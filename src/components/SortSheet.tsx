import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";

interface SortSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selected: string;
  onSelect: (option: string) => void;
}

const sortOptions = [
  { id: "lowest-price", label: "Lowest Price" },
  { id: "highest-rating", label: "Highest Rating" },
  { id: "biggest-drop", label: "Biggest Drop" },
  { id: "newest", label: "Newest Deals" },
];

const SortSheet = ({ isOpen, onClose, selected, onSelect }: SortSheetProps) => {
  const handleSelect = (id: string) => {
    onSelect(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 z-50"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-muted" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Sort By</h2>
              <button onClick={onClose} className="p-2 -mr-2">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Options */}
            <div className="py-2">
              {sortOptions.map((option) => (
                <motion.button
                  key={option.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(option.id)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-secondary/50 transition-colors"
                >
                  <span className={`text-base ${selected === option.id ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                    {option.label}
                  </span>
                  {selected === option.id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Safe area padding */}
            <div className="h-8" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SortSheet;
