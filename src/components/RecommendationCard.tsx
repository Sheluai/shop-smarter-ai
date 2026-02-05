import { motion } from "framer-motion";
import { Sparkles, Info } from "lucide-react";
import { RecommendationResult } from "@/lib/recommendation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RecommendationCardProps {
  recommendation: RecommendationResult;
}

const RecommendationCard = ({ recommendation }: RecommendationCardProps) => {
  const getEmoji = () => {
    switch (recommendation.type) {
      case "buy":
        return "🟢";
      case "wait":
        return "🟡";
      case "overpriced":
        return "🔴";
    }
  };

  const getLabel = () => {
    switch (recommendation.type) {
      case "buy":
        return "Buy Now";
      case "wait":
        return "Wait";
      case "overpriced":
        return "Overpriced";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`rounded-xl p-4 border ${recommendation.bgColor} ${recommendation.borderColor}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className={`w-4 h-4 ${recommendation.color}`} />
          <span className="text-xs font-medium text-muted-foreground">
            AI Recommendation (based on price history)
          </span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                <Info className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[250px]">
              <p className="text-sm">
                This recommendation is based on historical prices and category trends.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Recommendation */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{getEmoji()}</span>
        <span className={`text-lg font-semibold ${recommendation.color}`}>
          {getLabel()}
        </span>
      </div>

      {/* Reason */}
      <p className={`text-sm ${recommendation.color} opacity-90`}>
        {recommendation.reason}
      </p>
    </motion.div>
  );
};

export default RecommendationCard;
