import { motion } from "framer-motion";
import { ExternalLink, Award } from "lucide-react";
import { type Product } from "@/hooks/useProducts";
import { calculateDealScore } from "@/lib/dealScore";
import { openAffiliateLink } from "@/lib/affiliate";

interface ComparisonTableProps {
  products: Product[];
}

const MiniChart = ({ data, color }: { data: number[]; color: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 32;
  const w = 80;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");

  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const ComparisonTable = ({ products }: ComparisonTableProps) => {
  const cols = products.length;

  const scores = products.map((p) =>
    calculateDealScore({
      currentPrice: p.current_price,
      originalPrice: p.original_price,
      priceDrop: p.price_drop,
      categoryId: p.category_id,
      isFeatured: p.is_featured,
      isTodaysBestDrop: p.is_todays_best_drop,
      aiStatus: p.ai_status,
    })
  );

  const bestIdx = scores.reduce((best, s, i) => (s.score > scores[best].score ? i : best), 0);
  const lowestPriceIdx = products.reduce((best, p, i) => (p.current_price < products[best].current_price ? i : best), 0);

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* Names */}
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {products.map((p, i) => (
          <div key={p.id} className="text-center">
            <p className="text-xs font-medium text-foreground line-clamp-2 leading-tight">{p.name}</p>
            {i === bestIdx && cols > 1 && (
              <span className="inline-flex items-center gap-0.5 mt-1 px-1.5 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-semibold">
                <Award className="w-2.5 h-2.5" /> Best Deal
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Price */}
      <div className="bg-card rounded-xl border border-border p-4">
        <p className="text-xs font-medium text-muted-foreground mb-3">Price</p>
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {products.map((p, i) => {
            const discount = p.original_price && p.original_price > p.current_price
              ? Math.round(((p.original_price - p.current_price) / p.original_price) * 100)
              : 0;
            return (
              <div key={p.id} className="text-center">
                <p className={`text-lg font-bold ${i === lowestPriceIdx && cols > 1 ? "text-success" : "text-foreground"}`}>
                  ₹{p.current_price.toLocaleString()}
                </p>
                {p.original_price && p.original_price > p.current_price && (
                  <p className="text-xs text-muted-foreground line-through">₹{p.original_price.toLocaleString()}</p>
                )}
                {discount > 0 && <p className="text-xs font-medium text-success mt-0.5">{discount}% off</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Deal Score */}
      <div className="bg-card rounded-xl border border-border p-4">
        <p className="text-xs font-medium text-muted-foreground mb-3">AI Deal Score</p>
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {scores.map((s, i) => (
            <div key={products[i].id} className="flex justify-center">
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${s.color} ${s.bgColor}`}>
                {s.score >= 80 ? "🔥" : s.score >= 60 ? "👍" : "⏳"} {s.score}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Store */}
      <div className="bg-card rounded-xl border border-border p-4">
        <p className="text-xs font-medium text-muted-foreground mb-3">Store</p>
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {products.map((p) => (
            <div key={p.id} className="text-center">
              <span className="text-xs font-medium text-foreground capitalize">{p.category_id || "—"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Discount */}
      <div className="bg-card rounded-xl border border-border p-4">
        <p className="text-xs font-medium text-muted-foreground mb-3">Discount</p>
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {products.map((p) => {
            const discount = p.original_price && p.original_price > p.current_price
              ? Math.round(((p.original_price - p.current_price) / p.original_price) * 100)
              : 0;
            return (
              <div key={p.id} className="text-center">
                <span className={`text-sm font-semibold ${discount >= 20 ? "text-success" : "text-foreground"}`}>
                  {discount > 0 ? `${discount}%` : "—"}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verdict */}
      <div className="bg-card rounded-xl border border-border p-4">
        <p className="text-xs font-medium text-muted-foreground mb-3">Verdict</p>
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {scores.map((s, i) => (
            <div key={products[i].id} className="text-center">
              <p className={`text-xs font-semibold ${s.color}`}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Buy CTAs */}
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {products.map((p, i) => (
          <motion.button
            key={p.id}
            whileTap={{ scale: 0.97 }}
            onClick={() => openAffiliateLink(p.image_url || undefined, "Amazon", p.id, p.category_id || undefined)}
            className={`py-2.5 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
              i === bestIdx && cols > 1
                ? "bg-success text-success-foreground"
                : "bg-primary text-primary-foreground"
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Buy Now
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default ComparisonTable;
