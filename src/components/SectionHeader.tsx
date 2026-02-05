import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  icon?: React.ReactNode;
  onSeeAll?: () => void;
}

const SectionHeader = ({ title, icon, onSeeAll }: SectionHeaderProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-between mb-4"
    >
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      
      {onSeeAll && (
        <button
          onClick={onSeeAll}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          See all
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
};

export default SectionHeader;
