import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Deal score calculation (mirrors frontend lib/dealScore.ts)
function calculateDealScore(p: {
  current_price: number;
  original_price: number | null;
  price_drop: number | null;
  category_id: string | null;
  is_featured: boolean;
  is_todays_best_drop: boolean;
  ai_status: string | null;
}): number {
  const orig = p.original_price && p.original_price > p.current_price ? p.original_price : p.current_price;
  const dropPct = orig > 0 ? ((orig - p.current_price) / orig) * 100 : 0;
  const dropScore = Math.min(35, (dropPct / 50) * 35);

  let proximityScore = 0;
  if (p.price_drop && p.price_drop > 0) {
    proximityScore = Math.min(25, (p.price_drop / p.current_price) * 250);
  } else if (dropPct > 0) {
    proximityScore = Math.min(15, dropPct * 0.5);
  }

  const trustScore = (p.category_id === "fashion" ? 0.8 : 1.0) * 15;

  let demandScore = 5;
  if (p.is_featured) demandScore += 5;
  if (p.is_todays_best_drop) demandScore += 5;

  let offerScore = 3;
  if (p.ai_status === "buy") offerScore = 10;
  else if (p.ai_status === "wait") offerScore = 4;
  else if (p.ai_status === "overpriced") offerScore = 0;

  let catBonus = 0;
  if (p.category_id === "fashion") catBonus = dropPct >= 40 ? 5 : dropPct >= 25 ? 0 : -5;
  else if (p.category_id === "electronics" || p.category_id === "mobiles") catBonus = dropPct >= 10 ? 5 : 0;
  else if (p.category_id === "beauty") catBonus = dropPct >= 30 ? 3 : 0;
  else if (p.category_id === "home") catBonus = dropPct >= 20 ? 3 : 0;

  return Math.round(Math.max(0, Math.min(100, dropScore + proximityScore + trustScore + demandScore + offerScore + catBonus)));
}

// Category-based optimal notification hours (IST offsets from UTC)
const CATEGORY_HOURS: Record<string, number[]> = {
  fashion: [10, 11, 19, 20],
  electronics: [9, 10, 18, 19],
  mobiles: [9, 10, 18, 19],
  beauty: [11, 12, 20, 21],
  home: [10, 11, 17, 18],
  default: [9, 10, 18, 19],
};

function isOptimalTime(categoryId: string | null): boolean {
  const nowIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  const hour = nowIST.getUTCHours();
  const hours = CATEGORY_HOURS[categoryId || "default"] || CATEGORY_HOURS.default;
  return hours.includes(hour);
}

// Apple-style notification copy
function buildNotification(
  product: { name: string; current_price: number; id: string },
  score: number,
  reason: string
): { title: string; body: string; deepLink: string } {
  const price = `₹${product.current_price.toLocaleString("en-IN")}`;
  let title: string;
  let body: string;

  if (score >= 80) {
    title = `🟢 ${product.name}`;
    body = `Now ${price} — best time to buy. ${reason}`;
  } else if (score >= 60) {
    title = `💰 ${product.name}`;
    body = `Good deal at ${price}. ${reason}`;
  } else {
    title = `📉 Price Drop: ${product.name}`;
    body = `Now ${price}. ${reason}`;
  }

  return {
    title: title.slice(0, 65),
    body: body.slice(0, 178),
    deepLink: `/product/${product.id}`,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 1. Fetch all enabled products
    const { data: products, error: pErr } = await supabaseAdmin
      .from("products")
      .select("id, name, current_price, original_price, price_drop, category_id, is_featured, is_todays_best_drop, ai_status")
      .eq("is_enabled", true);

    if (pErr || !products) {
      throw new Error(`Failed to fetch products: ${pErr?.message}`);
    }

    // 2. Fetch previous snapshots (last 24h and 7d)
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();

    const { data: recentSnapshots } = await supabaseAdmin
      .from("price_snapshots")
      .select("product_id, price, deal_score, snapshot_at")
      .gte("snapshot_at", ninetyDaysAgo)
      .order("snapshot_at", { ascending: true });

    const snapsByProduct = new Map<string, Array<{ price: number; deal_score: number; snapshot_at: string }>>();
    for (const s of recentSnapshots || []) {
      if (!snapsByProduct.has(s.product_id)) snapsByProduct.set(s.product_id, []);
      snapsByProduct.get(s.product_id)!.push(s);
    }

    // 3. Calculate scores and check triggers
    interface TriggerCandidate {
      product: typeof products[0];
      score: number;
      reason: string;
    }
    const candidates: TriggerCandidate[] = [];

    for (const p of products) {
      const score = calculateDealScore(p);
      const snaps = snapsByProduct.get(p.id) || [];

      // Find previous 24h snapshot
      const snap24h = snaps.filter((s) => s.snapshot_at >= oneDayAgo);
      const prevScore24h = snap24h.length > 0 ? snap24h[0].deal_score : null;
      const prevPrice24h = snap24h.length > 0 ? snap24h[0].price : null;

      // Find 7-day snapshots
      const snap7d = snaps.filter((s) => s.snapshot_at >= sevenDaysAgo);
      const prevPrice7d = snap7d.length > 0 ? snap7d[0].price : null;

      // Lowest in 60–90 days
      const lowestPrice = snaps.length > 0 ? Math.min(...snaps.map((s) => s.price)) : p.current_price;

      let triggered = false;
      let reason = "";

      // Trigger 1: Score crosses from <60 to ≥80
      if (prevScore24h !== null && prevScore24h < 60 && score >= 80) {
        triggered = true;
        reason = "Deal quality jumped significantly";
      }

      // Trigger 2: Score increase ≥20 in 24h
      if (!triggered && prevScore24h !== null && score - prevScore24h >= 20) {
        triggered = true;
        reason = "Deal score improved sharply today";
      }

      // Trigger 3: Price drop ≥10% in 24h
      if (!triggered && prevPrice24h !== null && prevPrice24h > 0) {
        const drop24h = ((prevPrice24h - p.current_price) / prevPrice24h) * 100;
        if (drop24h >= 10) {
          triggered = true;
          reason = `Price dropped ${Math.round(drop24h)}% today`;
        }
      }

      // Trigger 3b: Price drop ≥20% in 7 days
      if (!triggered && prevPrice7d !== null && prevPrice7d > 0) {
        const drop7d = ((prevPrice7d - p.current_price) / prevPrice7d) * 100;
        if (drop7d >= 20) {
          triggered = true;
          reason = `Down ${Math.round(drop7d)}% this week`;
        }
      }

      // Trigger 4: Current price is lowest in 60–90 days
      if (!triggered && snaps.length >= 3 && p.current_price <= lowestPrice) {
        triggered = true;
        reason = "Lowest price in 90 days";
      }

      if (triggered && score >= 60) {
        candidates.push({ product: p, score, reason });
      }

      // Save snapshot
      await supabaseAdmin.from("price_snapshots").insert({
        product_id: p.id,
        price: p.current_price,
        deal_score: score,
      });
    }

    // 4. For each candidate, find users watching it and apply anti-spam
    let notificationsSent = 0;

    for (const { product, score, reason } of candidates) {
      // Skip if not optimal time for category
      if (!isOptimalTime(product.category_id)) continue;

      // Find users watching this product or its category
      const { data: watchers } = await supabaseAdmin
        .from("user_watchlist")
        .select("user_id")
        .eq("is_active", true)
        .or(`product_id.eq.${product.id},category_id.eq.${product.category_id}`);

      const userIds = [...new Set((watchers || []).map((w) => w.user_id))];

      for (const userId of userIds) {
        // Anti-spam: 72h cooldown per product
        const cooldownStart = new Date(now.getTime() - 72 * 60 * 60 * 1000).toISOString();
        const { data: recentProductNotifs } = await supabaseAdmin
          .from("deal_notifications")
          .select("id")
          .eq("user_id", userId)
          .eq("product_id", product.id)
          .gte("sent_at", cooldownStart)
          .limit(1);

        if (recentProductNotifs && recentProductNotifs.length > 0) continue;

        // Anti-spam: max 1/day
        const dayStart = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        const { data: dailyNotifs } = await supabaseAdmin
          .from("deal_notifications")
          .select("id")
          .eq("user_id", userId)
          .gte("sent_at", dayStart);

        if (dailyNotifs && dailyNotifs.length >= 1) continue;

        // Anti-spam: max 3/week
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const { data: weeklyNotifs } = await supabaseAdmin
          .from("deal_notifications")
          .select("id")
          .eq("user_id", userId)
          .gte("sent_at", weekStart);

        if (weeklyNotifs && weeklyNotifs.length >= 3) continue;

        // Build and log notification
        const notif = buildNotification(product, score, reason);

        await supabaseAdmin.from("deal_notifications").insert({
          user_id: userId,
          product_id: product.id,
          deal_score: score,
          trigger_reason: reason,
          notification_title: notif.title,
          notification_body: notif.body,
          deep_link: notif.deepLink,
        });

        notificationsSent++;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        products_evaluated: products.length,
        candidates: candidates.length,
        notifications_sent: notificationsSent,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
