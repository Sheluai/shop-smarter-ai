import { motion } from "framer-motion";
import { ExternalLink, Sparkles, Info, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { openAffiliateLink, hasValidAffiliateUrl } from "@/lib/affiliate";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface AlternativeProduct {
  id: string;
  title: string;
  price: number;
  image: string;
  platform: "Amazon" | "Flipkart";
  reason: string;
  isBestValue?: boolean;
  affiliateUrl: string;
}

interface AIAlternativesCardProps {
  alternatives: AlternativeProduct[];
}

const AIAlternativesCard = ({ alternatives }: AIAlternativesCardProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  if (alternatives.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-background rounded-xl border border-border overflow-hidden"
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary/50 transition-colors">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">AI Alternative Suggestions</span>
          </div>
          <ChevronDown 
            className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`} 
          />
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-3">
            {alternatives.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`relative rounded-xl border p-3 ${
                  product.isBestValue 
                    ? "border-primary/30 bg-primary/5" 
                    : "border-border bg-secondary/30"
                }`}
              >
                {/* Best Value Badge */}
                {product.isBestValue && (
                  <div className="absolute -top-2 left-3 flex items-center gap-1 px-2 py-0.5 bg-primary rounded-full">
                    <Award className="w-3 h-3 text-primary-foreground" />
                    <span className="text-xs font-medium text-primary-foreground">Best Value</span>
                  </div>
                )}

                <div className="flex gap-3">
                  {/* Product Image */}
                  <div 
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer bg-secondary"
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">{product.platform}</p>
                    <h4 
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="text-sm font-medium text-foreground line-clamp-2 mb-1 cursor-pointer hover:text-primary transition-colors"
                    >
                      {product.title}
                    </h4>
                    <p className="text-base font-semibold text-foreground mb-1">
                      ₹{product.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      "{product.reason}"
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-3">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/product/${product.id}`)}
                    className="flex-1 py-2 text-sm font-medium text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    View Details
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openAffiliateLink(product.affiliateUrl, product.platform)}
                    disabled={!hasValidAffiliateUrl(product.affiliateUrl)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {hasValidAffiliateUrl(product.affiliateUrl) ? "Open" : "Unavailable"}
                  </motion.button>
                </div>
              </motion.div>
            ))}

            {/* Transparency Note */}
            <div className="flex items-start gap-2 pt-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-0.5 text-muted-foreground hover:text-foreground transition-colors">
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-[250px]">
                    <p className="text-sm">
                      Products are ranked by price advantage, discount percentage, and ratings.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="text-xs text-muted-foreground">
                Suggestions are based on price, category, and available ratings.
              </p>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
};

export default AIAlternativesCard;
