import { motion } from "framer-motion";
import { ExternalLink, Check } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface PlatformPrice {
  platform: "Amazon" | "Flipkart";
  price: number;
  deliveryNote?: string;
  affiliateUrl: string;
  isLowest?: boolean;
}

interface PriceComparisonCardProps {
  prices: PlatformPrice[];
}

const PriceComparisonCard = ({ prices }: PriceComparisonCardProps) => {
  const [isOpen, setIsOpen] = useState(true);
  
  // Find lowest price
  const lowestPrice = Math.min(...prices.map(p => p.price));
  const pricesWithLowest = prices.map(p => ({
    ...p,
    isLowest: p.price === lowestPrice,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="bg-background rounded-xl border border-border overflow-hidden"
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary/50 transition-colors">
          <span className="text-sm font-medium text-foreground">Compare Prices</span>
          <ChevronDown 
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`} 
          />
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-4 pb-4">
            {/* Best Price Label */}
            <div className="flex items-center gap-2 mb-3 px-2">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-xs font-medium text-success">Best Price Today</span>
            </div>

            {/* Price Table */}
            <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
              {pricesWithLowest.map((item, index) => (
                <motion.button
                  key={item.platform}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => window.open(item.affiliateUrl, "_blank")}
                  className={`w-full flex items-center justify-between p-3 hover:bg-secondary/50 transition-colors ${
                    item.isLowest ? "bg-success/10" : "bg-background"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.isLowest && (
                      <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center">
                        <Check className="w-3 h-3 text-background" />
                      </div>
                    )}
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">{item.platform}</p>
                      {item.deliveryNote && (
                        <p className="text-xs text-muted-foreground">{item.deliveryNote}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`text-base font-semibold ${
                      item.isLowest ? "text-success" : "text-foreground"
                    }`}>
                      ₹{item.price.toLocaleString()}
                    </span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
};

export default PriceComparisonCard;
