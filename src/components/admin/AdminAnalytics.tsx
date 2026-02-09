import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MousePointerClick, TrendingUp, Tag } from "lucide-react";

interface TopProduct {
  product_id: string;
  product_name: string;
  clicks: number;
}

interface TopCategory {
  category_id: string;
  clicks: number;
}

const AdminAnalytics = () => {
  const [totalClicks, setTotalClicks] = useState(0);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [topCategories, setTopCategories] = useState<TopCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    // Fetch all clicks
    const { data: clicks, count } = await supabase
      .from("affiliate_clicks")
      .select("product_id, category_id", { count: "exact" });

    setTotalClicks(count || 0);

    if (clicks && clicks.length > 0) {
      // Aggregate top products
      const productCounts: Record<string, number> = {};
      const categoryCounts: Record<string, number> = {};

      for (const click of clicks) {
        if (click.product_id) {
          productCounts[click.product_id] = (productCounts[click.product_id] || 0) + 1;
        }
        if (click.category_id) {
          categoryCounts[click.category_id] = (categoryCounts[click.category_id] || 0) + 1;
        }
      }

      // Get product names for top products
      const topProdIds = Object.entries(productCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([id]) => id);

      if (topProdIds.length > 0) {
        const { data: prodNames } = await supabase
          .from("products")
          .select("id, name")
          .in("id", topProdIds);

        const nameMap = new Map((prodNames || []).map((p) => [p.id, p.name]));

        setTopProducts(
          topProdIds.map((id) => ({
            product_id: id,
            product_name: nameMap.get(id) || "Unknown",
            clicks: productCounts[id],
          }))
        );
      }

      setTopCategories(
        Object.entries(categoryCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([id, clicks]) => ({ category_id: id, clicks }))
      );
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground mb-1">Affiliate Analytics</h2>
        <p className="text-sm text-muted-foreground">
          Track affiliate clicks, top products, and performing categories.
        </p>
      </div>

      {/* Total clicks */}
      <div className="card-soft p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
          <MousePointerClick className="w-6 h-6 text-accent" />
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">{totalClicks.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total Affiliate Clicks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top products */}
        <div className="card-soft p-5 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-success" />
            <h3 className="text-sm font-semibold text-foreground">Top Clicked Products</h3>
          </div>

          {topProducts.length === 0 ? (
            <p className="text-xs text-muted-foreground">No click data yet.</p>
          ) : (
            <div className="space-y-2">
              {topProducts.map((p, i) => (
                <div key={p.product_id} className="flex items-center justify-between">
                  <span className="text-sm text-foreground truncate flex-1">
                    <span className="text-muted-foreground mr-2">{i + 1}.</span>
                    {p.product_name}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground ml-2">
                    {p.clicks} clicks
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top categories */}
        <div className="card-soft p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-warning" />
            <h3 className="text-sm font-semibold text-foreground">Top Performing Categories</h3>
          </div>

          {topCategories.length === 0 ? (
            <p className="text-xs text-muted-foreground">No click data yet.</p>
          ) : (
            <div className="space-y-2">
              {topCategories.map((c, i) => (
                <div key={c.category_id} className="flex items-center justify-between">
                  <span className="text-sm text-foreground capitalize">
                    <span className="text-muted-foreground mr-2">{i + 1}.</span>
                    {c.category_id}
                  </span>
                  <span className="text-xs font-mono text-muted-foreground ml-2">
                    {c.clicks} clicks
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
