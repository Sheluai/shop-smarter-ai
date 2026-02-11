import { motion } from "framer-motion";
import { TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProducts, type Product } from "@/hooks/useProducts";
import { useSmartDealMode, type ScoredProduct } from "@/hooks/useSmartDealMode";
import DealScoreBadge from "@/components/DealScoreBadge";

const FALLBACK_DROPS = [
  { id: "fb-1", name: "AirPods Pro 2", image_url: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=200&h=200&fit=crop", current_price: 18990, original_price: 24900, price_drop: 2000, category_id: "mobiles", is_todays_best_drop: true, is_featured: false, ai_status: "buy" },
  { id: "fb-2", name: "Galaxy Watch 6", image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop", current_price: 26999, original_price: 34999, price_drop: 3500, category_id: "electronics", is_todays_best_drop: true, is_featured: false, ai_status: null },
  { id: "fb-3", name: "Sony WH-1000XM5", image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop", current_price: 28990, original_price: 34990, price_drop: 4010, category_id: "electronics", is_todays_best_drop: true, is_featured: true, ai_status: "buy" },
  { id: "fb-4", name: "iPad Air M1", image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&h=200&fit=crop", current_price: 49900, original_price: 54900, price_drop: 5100, category_id: "electronics", is_todays_best_drop: true, is_featured: false, ai_status: null },
  { id: "fb-5", name: "Cotton Casual Shirt", image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop", current_price: 799, original_price: 1499, price_drop: 400, category_id: "fashion", is_todays_best_drop: true, is_featured: false, ai_status: "buy" },
];

interface TodayBestDropsProps {
  selectedCategory: string;
}

const TodayBestDrops = ({ selectedCategory }: TodayBestDropsProps) => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { filterAndSort, enabled: smartMode } = useSmartDealMode();

  const bestDrops = products.filter((p) => p.is_todays_best_drop);
  const source: Product[] = bestDrops.length > 0 ? bestDrops : FALLBACK_DROPS as any[];

  const categoryFiltered = selectedCategory
    ? source.filter((d) => d.category_id === selectedCategory)
    : source;

  const scored = filterAndSort(categoryFiltered);

  if (scored.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-foreground">
          🔥 Today's Best Drops
        </h2>
        <span className="text-xs font-medium text-muted-foreground">
          Best time to buy
        </span>
      </div>

      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
        <div className="flex gap-3 pb-1">
          {scored.map((item, index) => (
            <motion.div
              key={`${selectedCategory}-${item.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/product/${item.id}`)}
              className="flex-shrink-0 w-40 cursor-pointer"
            >
              <div className="card-soft overflow-hidden">
                <div className="relative w-full h-32 bg-secondary overflow-hidden">
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {smartMode && (
                    <div className="absolute top-2 left-2">
                      <DealScoreBadge dealScore={item.dealScore} compact />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-foreground mb-1.5 truncate">
                    {item.name}
                  </h3>
                  <p className="text-base font-semibold text-foreground">
                    ₹{item.current_price.toLocaleString()}
                  </p>
                  {item.price_drop && item.price_drop > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingDown className="w-3 h-3 text-success" />
                      <span className="text-xs font-medium text-success">
                        ↓ ₹{item.price_drop.toLocaleString()} today
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodayBestDrops;
