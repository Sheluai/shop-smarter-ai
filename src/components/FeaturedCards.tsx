import { motion } from "framer-motion";
import { Flame, TrendingDown, Sparkles, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const featuredItems = [
  {
    id: "best-deals",
    title: "Best Deals Today",
    subtitle: "Lowest price in 30 days",
    icon: Flame,
    iconColor: "text-warning",
    bgGradient: "from-warning/5 to-warning/10",
  },
  {
    id: "price-drops",
    title: "Price Drops",
    subtitle: "Recently reduced prices",
    icon: TrendingDown,
    iconColor: "text-success",
    bgGradient: "from-success/5 to-success/10",
  },
  {
    id: "recommended",
    title: "Recommended for You",
    subtitle: "Personalized picks",
    icon: Sparkles,
    iconColor: "text-primary",
    bgGradient: "from-primary/5 to-primary/10",
  },
];

const FeaturedCards = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-3">
      {featuredItems.map((item, index) => {
        const Icon = item.icon;
        
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/category/${item.id}`)}
            className={`relative overflow-hidden rounded-2xl p-5 cursor-pointer bg-gradient-to-br ${item.bgGradient} border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-background flex items-center justify-center shadow-sm`}>
                  <Icon className={`w-6 h-6 ${item.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-base">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.subtitle}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FeaturedCards;
