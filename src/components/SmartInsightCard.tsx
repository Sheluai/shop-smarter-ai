import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

const insights = [
  "Electronics prices usually drop on weekends.",
  "Headphone deals peak during festive seasons.",
  "Fashion discounts are deepest in end-of-season sales.",
  "Smart home devices see the best prices in January.",
];

const SmartInsightCard = () => {
  // Rotate daily based on day of year
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const insight = insights[dayOfYear % insights.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-secondary to-muted border border-border/40"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-5 h-5 text-warning" />
        </div>
        <div>
          <p className="text-xs font-semibold text-muted-foreground tracking-wide uppercase mb-1">
            💡 AI Insight Today
          </p>
          <p className="text-sm font-medium text-foreground leading-relaxed">
            {insight}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default SmartInsightCard;
