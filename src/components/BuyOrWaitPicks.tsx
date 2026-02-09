import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";

type Status = "buy" | "wait" | "overpriced";

interface PickItem {
  id: string;
  name: string;
  image_url: string | null;
  status: Status;
  reason: string;
  current_price: number;
  category_id: string | null;
}

// Static fallback picks
const FALLBACK_PICKS: PickItem[] = [
  {
    id: "fb-1",
    name: "Apple AirPods Pro (2nd Gen)",
    image_url: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=120&h=120&fit=crop",
    status: "buy",
    reason: "Within 5% of 90-day low",
    current_price: 18990,
    category_id: "mobiles",
  },
  {
    id: "fb-2",
    name: "Samsung Galaxy Watch 6",
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&h=120&fit=crop",
    status: "wait",
    reason: "Price likely to drop further",
    current_price: 26999,
    category_id: "electronics",
  },
  {
    id: "fb-4",
    name: "iPad Air M1 10.9-inch",
    image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=120&h=120&fit=crop",
    status: "overpriced",
    reason: "Was ₹5K less last month",
    current_price: 49900,
    category_id: "electronics",
  },
  {
    id: "fb-5",
    name: "Cotton Casual Shirt",
    image_url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=120&h=120&fit=crop",
    status: "buy",
    reason: "40% off — best in 6 months",
    current_price: 799,
    category_id: "fashion",
  },
];

const statusConfig: Record<Status, { label: string; emoji: string; color: string; bg: string }> = {
  buy: { label: "Buy Now", emoji: "🟢", color: "text-success", bg: "bg-success/10" },
  wait: { label: "Wait", emoji: "🟡", color: "text-warning", bg: "bg-warning/10" },
  overpriced: { label: "Overpriced", emoji: "🔴", color: "text-destructive", bg: "bg-destructive/10" },
};

const getDefaultReason = (status: Status): string => {
  switch (status) {
    case "buy": return "Great price — buy now";
    case "wait": return "Expected to drop further";
    case "overpriced": return "Above average price";
  }
};

interface BuyOrWaitPicksProps {
  selectedCategory: string;
}

const BuyOrWaitPicks = ({ selectedCategory }: BuyOrWaitPicksProps) => {
  const navigate = useNavigate();
  const { products } = useProducts();

  // Use DB products that have an ai_status, fallback to static
  const dbPicks: PickItem[] = products
    .filter((p) => p.ai_status && ["buy", "wait", "overpriced"].includes(p.ai_status))
    .map((p) => ({
      id: p.id,
      name: p.name,
      image_url: p.image_url,
      status: p.ai_status as Status,
      reason: getDefaultReason(p.ai_status as Status),
      current_price: p.current_price,
      category_id: p.category_id,
    }));

  const picks = dbPicks.length > 0 ? dbPicks : FALLBACK_PICKS;

  const filtered = selectedCategory
    ? picks.filter((p) => p.category_id === selectedCategory)
    : picks;

  if (filtered.length === 0) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-3">
        ⏳ Buy or Wait?
      </h2>

      <div className="space-y-2.5">
        {filtered.map((pick, index) => {
          const config = statusConfig[pick.status];
          return (
            <motion.div
              key={`${selectedCategory}-${pick.id}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/product/${pick.id}`)}
              className="card-soft flex items-center gap-3.5 p-3.5 cursor-pointer"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary overflow-hidden flex-shrink-0">
                <img
                  src={pick.image_url || "/placeholder.svg"}
                  alt={pick.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground truncate">
                  {pick.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {pick.reason}
                </p>
                <p className="text-sm font-semibold text-foreground mt-1">
                  ₹{pick.current_price.toLocaleString()}
                </p>
              </div>

              <div className={`flex-shrink-0 px-2.5 py-1 rounded-full ${config.bg}`}>
                <span className={`text-xs font-semibold ${config.color}`}>
                  {config.emoji} {config.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BuyOrWaitPicks;
