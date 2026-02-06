import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Bell, Sparkles, Info } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PriceAlertSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPrice: number;
  lowestPrice90Days?: number;
  productTitle: string;
  onActivate: (targetPrice: number) => void;
}

const PriceAlertSheet = ({
  open,
  onOpenChange,
  currentPrice,
  lowestPrice90Days,
  productTitle,
  onActivate,
}: PriceAlertSheetProps) => {
  const suggestedPrice = useMemo(() => {
    if (lowestPrice90Days) {
      return Math.round(lowestPrice90Days * 0.98);
    }
    return Math.round(currentPrice * 0.9);
  }, [currentPrice, lowestPrice90Days]);

  const [targetPrice, setTargetPrice] = useState(suggestedPrice);

  const minPrice = Math.round(currentPrice * 0.5);
  const maxPrice = currentPrice;

  const handleSliderChange = (value: number[]) => {
    setTargetPrice(value[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
    if (!isNaN(val)) {
      setTargetPrice(Math.max(minPrice, Math.min(maxPrice, val)));
    }
  };

  const handleActivate = () => {
    onActivate(targetPrice);
    onOpenChange(false);
  };

  const savings = currentPrice - targetPrice;
  const savingsPercent = Math.round((savings / currentPrice) * 100);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-3xl px-6 pb-10 pt-6">
        <SheetHeader className="text-left mb-6">
          <SheetTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5 text-warning" />
            Set Price Alert
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground line-clamp-1">
            {productTitle}
          </SheetDescription>
        </SheetHeader>

        {/* Current Price */}
        <div className="bg-secondary/50 rounded-xl p-4 mb-6">
          <p className="text-xs text-muted-foreground mb-1">Current Price</p>
          <p className="text-2xl font-bold text-foreground">
            ₹{currentPrice.toLocaleString()}
          </p>
        </div>

        {/* Smart Suggestion */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 bg-warning/10 border border-warning/20 rounded-xl p-3 mb-6"
        >
          <Sparkles className="w-4 h-4 text-warning flex-shrink-0" />
          <p className="text-sm text-foreground">
            Suggested alert: <span className="font-semibold">₹{suggestedPrice.toLocaleString()}</span>
            <span className="text-muted-foreground"> (based on recent prices)</span>
          </p>
        </motion.div>

        {/* Target Price Input */}
        <div className="mb-4">
          <label className="text-sm font-medium text-foreground mb-2 block">
            Notify me when price drops to
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              ₹
            </span>
            <Input
              type="text"
              value={targetPrice.toLocaleString()}
              onChange={handleInputChange}
              className="pl-7 text-lg font-semibold h-12 rounded-xl"
            />
          </div>
        </div>

        {/* Price Slider */}
        <div className="mb-6">
          <Slider
            value={[targetPrice]}
            onValueChange={handleSliderChange}
            min={minPrice}
            max={maxPrice}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>₹{minPrice.toLocaleString()}</span>
            <span>₹{maxPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Savings Preview */}
        {savings > 0 && (
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground">
              You'll save{" "}
              <span className="font-semibold text-success">
                ₹{savings.toLocaleString()} ({savingsPercent}%)
              </span>
            </p>
          </div>
        )}

        {/* Activate Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleActivate}
          className="btn-primary w-full flex items-center justify-center gap-2 text-base"
        >
          <Bell className="w-5 h-5" />
          Activate Alert
        </motion.button>

        {/* Transparency Note */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Info className="w-3 h-3" />
                Price alerts are based on periodic price checks
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-[200px]">
                We check prices periodically and notify you when the price drops to your target. Actual prices may vary.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PriceAlertSheet;
