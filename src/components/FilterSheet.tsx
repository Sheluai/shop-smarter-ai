import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    priceRange: [number, number];
    platform: "all" | "amazon" | "flipkart";
    dealType: string[];
    availability: boolean;
  };
  onApply: (filters: FilterSheetProps["filters"]) => void;
}

const FilterSheet = ({ isOpen, onClose, filters, onApply }: FilterSheetProps) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onApply(localFilters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters = {
      priceRange: [0, 100000] as [number, number],
      platform: "all" as const,
      dealType: [],
      availability: false,
    };
    setLocalFilters(defaultFilters);
  };

  const toggleDealType = (type: string) => {
    setLocalFilters(prev => ({
      ...prev,
      dealType: prev.dealType.includes(type)
        ? prev.dealType.filter(t => t !== type)
        : [...prev.dealType, type],
    }));
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
            className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-muted" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Filters</h2>
              <button onClick={onClose} className="p-2 -mr-2">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="px-6 py-6 space-y-8">
              {/* Price Range */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-4">Price Range</h3>
                <Slider
                  value={localFilters.priceRange}
                  onValueChange={(value) => setLocalFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                  max={100000}
                  step={1000}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹{localFilters.priceRange[0].toLocaleString()}</span>
                  <span>₹{localFilters.priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              {/* Platform */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-4">Platform</h3>
                <div className="flex gap-2">
                  {["all", "amazon", "flipkart"].map((platform) => (
                    <button
                      key={platform}
                      onClick={() => setLocalFilters(prev => ({ ...prev, platform: platform as typeof prev.platform }))}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        localFilters.platform === platform
                          ? "bg-foreground text-background"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deal Type */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-4">Deal Type</h3>
                <div className="flex flex-wrap gap-2">
                  {["Best Price", "Price Drop", "High Rating"].map((type) => (
                    <button
                      key={type}
                      onClick={() => toggleDealType(type)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                        localFilters.dealType.includes(type)
                          ? "bg-foreground text-background border-foreground"
                          : "bg-background text-foreground border-border"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">In Stock Only</h3>
                <Switch
                  checked={localFilters.availability}
                  onCheckedChange={(checked) => setLocalFilters(prev => ({ ...prev, availability: checked }))}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-6 border-t border-border flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-3.5 rounded-xl text-sm font-medium text-foreground bg-secondary"
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                className="flex-1 py-3.5 rounded-xl text-sm font-medium text-background bg-foreground"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterSheet;
