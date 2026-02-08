import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

type Status = "buy" | "wait" | "overpriced";

interface Pick {
  id: string;
  title: string;
  image: string;
  status: Status;
  reason: string;
  price: number;
}

const picks: Pick[] = [
  {
    id: "1",
    title: "Apple AirPods Pro (2nd Gen)",
    image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=120&h=120&fit=crop",
    status: "buy",
    reason: "Within 5% of 90-day low",
    price: 18990,
  },
  {
    id: "2",
    title: "Samsung Galaxy Watch 6",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120&h=120&fit=crop",
    status: "wait",
    reason: "Price likely to drop further",
    price: 26999,
  },
  {
    id: "4",
    title: "iPad Air M1 10.9-inch",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=120&h=120&fit=crop",
    status: "overpriced",
    reason: "Was ₹5K less last month",
    price: 49900,
  },
];

const statusConfig: Record<Status, { label: string; emoji: string; color: string; bg: string }> = {
  buy: { label: "Buy Now", emoji: "🟢", color: "text-success", bg: "bg-success/10" },
  wait: { label: "Wait", emoji: "🟡", color: "text-warning", bg: "bg-warning/10" },
  overpriced: { label: "Overpriced", emoji: "🔴", color: "text-destructive", bg: "bg-destructive/10" },
};

const BuyOrWaitPicks = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-3">
        ⏳ Buy or Wait?
      </h2>

      <div className="space-y-2.5">
        {picks.map((pick, index) => {
          const config = statusConfig[pick.status];
          return (
            <motion.div
              key={pick.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/product/${pick.id}`)}
              className="card-soft flex items-center gap-3.5 p-3.5 cursor-pointer"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary overflow-hidden flex-shrink-0">
                <img
                  src={pick.image}
                  alt={pick.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground truncate">
                  {pick.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {pick.reason}
                </p>
                <p className="text-sm font-semibold text-foreground mt-1">
                  ₹{pick.price.toLocaleString()}
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
