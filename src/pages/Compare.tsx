import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, ExternalLink, TrendingDown, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import { openAffiliateLink, hasValidAffiliateUrl } from "@/lib/affiliate";

interface CompareProduct {
  id: string;
  title: string;
  image: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  platform: "Amazon" | "Flipkart";
  dealScore: number;
  priceHistory: number[];
  affiliateUrl: string;
  lowestPrice: number;
}

const mockProducts: CompareProduct[] = [
  {
    id: "1",
    title: "Apple AirPods Pro (2nd Gen)",
    image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=200&h=200&fit=crop",
    currentPrice: 18990,
    originalPrice: 24900,
    discount: 24,
    platform: "Amazon",
    dealScore: 85,
    priceHistory: [22990, 21500, 19990, 18500, 18990],
    affiliateUrl: "https://amazon.in",
    lowestPrice: 17990,
  },
  {
    id: "3",
    title: "Sony WH-1000XM5 Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
    currentPrice: 28990,
    originalPrice: 34990,
    discount: 17,
    platform: "Amazon",
    dealScore: 62,
    priceHistory: [29990, 27990, 25990, 26990, 28990],
    affiliateUrl: "https://amazon.in",
    lowestPrice: 25990,
  },
  {
    id: "2",
    title: "Samsung Galaxy Watch 6 Classic",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop",
    currentPrice: 26999,
    originalPrice: 35999,
    discount: 25,
    platform: "Flipkart",
    dealScore: 78,
    priceHistory: [32999, 29999, 24999, 27500, 26999],
    affiliateUrl: "https://flipkart.com",
    lowestPrice: 24999,
  },
];

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
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const Compare = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<CompareProduct[]>([]);
  const [showPicker, setShowPicker] = useState(false);

  const bestDealId = selected.length > 0
    ? selected.reduce((best, p) => (p.dealScore > best.dealScore ? p : best), selected[0]).id
    : null;

  const addProduct = (product: CompareProduct) => {
    if (selected.length < 3 && !selected.find((p) => p.id === product.id)) {
      setSelected([...selected, product]);
    }
    setShowPicker(false);
  };

  const removeProduct = (id: string) => {
    setSelected(selected.filter((p) => p.id !== id));
  };

  const availableProducts = mockProducts.filter(
    (p) => !selected.find((s) => s.id === p.id)
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border"
      >
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-foreground">Compare Products</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Add up to 3 products to compare</p>
        </div>
      </motion.header>

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        {/* Product Slots */}
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((slot) => {
            const product = selected[slot];
            return (
              <motion.div
                key={slot}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: slot * 0.05 }}
                className={`relative rounded-2xl border-2 border-dashed overflow-hidden aspect-square flex items-center justify-center ${
                  product
                    ? "border-border bg-card"
                    : "border-muted-foreground/20 bg-secondary/50"
                } ${product && product.id === bestDealId ? "ring-2 ring-success" : ""}`}
              >
                {product ? (
                  <>
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-background/80 backdrop-blur flex items-center justify-center"
                    >
                      <X className="w-3.5 h-3.5 text-foreground" />
                    </button>
                    {product.id === bestDealId && selected.length > 1 && (
                      <div className="absolute top-1.5 left-1.5 bg-success text-success-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                        <Award className="w-2.5 h-2.5" />
                        Best
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => setShowPicker(true)}
                    className="flex flex-col items-center gap-1 text-muted-foreground"
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-[10px] font-medium">Add</span>
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Product Picker */}
        <AnimatePresence>
          {showPicker && availableProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-card rounded-2xl border border-border divide-y divide-border overflow-hidden">
                <div className="px-4 py-2.5 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Select a product</span>
                  <button onClick={() => setShowPicker(false)}>
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                {availableProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => addProduct(p)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors"
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-foreground line-clamp-1">{p.title}</p>
                      <p className="text-xs text-muted-foreground">₹{p.currentPrice.toLocaleString()}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comparison Table */}
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Names */}
            <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${selected.length}, 1fr)` }}>
              {selected.map((p) => (
                <div key={p.id} className="text-center">
                  <p className="text-xs font-medium text-foreground line-clamp-2 leading-tight">{p.title}</p>
                  <span className="badge-platform mt-1 inline-block text-[10px]">{p.platform}</span>
                </div>
              ))}
            </div>

            {/* Price Row */}
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-xs font-medium text-muted-foreground mb-3">Price</p>
              <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${selected.length}, 1fr)` }}>
                {selected.map((p) => {
                  const isBest = selected.length > 1 && p.currentPrice === Math.min(...selected.map((s) => s.currentPrice));
                  return (
                    <div key={p.id} className="text-center">
                      <p className={`text-lg font-bold ${isBest ? "text-success" : "text-foreground"}`}>
                        ₹{p.currentPrice.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground line-through">₹{p.originalPrice.toLocaleString()}</p>
                      <p className="text-xs font-medium text-success mt-0.5">{p.discount}% off</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Deal Score Row */}
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-xs font-medium text-muted-foreground mb-3">AI Deal Score</p>
              <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${selected.length}, 1fr)` }}>
                {selected.map((p) => {
                  const scoreColor = p.dealScore >= 80 ? "text-success" : p.dealScore >= 60 ? "text-warning" : "text-destructive";
                  const scoreBg = p.dealScore >= 80 ? "bg-success/10" : p.dealScore >= 60 ? "bg-warning/10" : "bg-destructive/10";
                  return (
                    <div key={p.id} className="flex justify-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${scoreColor} ${scoreBg}`}>
                        {p.dealScore >= 80 ? "🔥" : p.dealScore >= 60 ? "👍" : "⏳"} {p.dealScore}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price History Row */}
            <div className="bg-card rounded-xl border border-border p-4">
              <p className="text-xs font-medium text-muted-foreground mb-3">Price Trend</p>
              <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${selected.length}, 1fr)` }}>
                {selected.map((p) => {
                  const trending = p.priceHistory[p.priceHistory.length - 1] <= p.priceHistory[0];
                  return (
                    <div key={p.id} className="flex flex-col items-center gap-1">
                      <MiniChart
                        data={p.priceHistory}
                        color={trending ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                      />
                      <div className="flex items-center gap-0.5">
                        <TrendingDown className={`w-3 h-3 ${trending ? "text-success" : "text-destructive rotate-180"}`} />
                        <span className="text-[10px] text-muted-foreground">
                          Low: ₹{p.lowestPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Buy CTAs */}
            <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${selected.length}, 1fr)` }}>
              {selected.map((p) => (
                <motion.button
                  key={p.id}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => openAffiliateLink(p.affiliateUrl, p.platform)}
                  disabled={!hasValidAffiliateUrl(p.affiliateUrl)}
                  className={`btn-primary text-xs py-2.5 px-2 flex items-center justify-center gap-1 disabled:opacity-50 ${
                    p.id === bestDealId && selected.length > 1 ? "bg-success text-success-foreground" : ""
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Buy Now
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {selected.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary flex items-center justify-center">
              <Plus className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">Compare Products</h3>
            <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">
              Add products to see price comparisons, deal scores, and find the best deal.
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowPicker(true)}
              className="btn-secondary mt-5 text-sm"
            >
              Add First Product
            </motion.button>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Compare;
