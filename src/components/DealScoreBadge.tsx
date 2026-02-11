import { motion } from "framer-motion";
import { type DealScoreResult } from "@/lib/dealScore";

interface DealScoreBadgeProps {
  dealScore: DealScoreResult;
  compact?: boolean;
}

const DealScoreBadge = ({ dealScore, compact = false }: DealScoreBadgeProps) => {
  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${dealScore.color} ${dealScore.bgColor}`}
      >
        {dealScore.icon} {dealScore.score}
      </span>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${dealScore.bgColor}`}
    >
      <span className={`text-xs font-semibold ${dealScore.color}`}>
        {dealScore.icon} {dealScore.label}
      </span>
    </motion.div>
  );
};

export default DealScoreBadge;
