import { motion } from "framer-motion";
import { TrendingDown, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DealCardProps {
  id: string;
  title: string;
  originalPrice: number;
  currentPrice: number;
  discount: number;
  platform: "Amazon" | "Flipkart";
  image: string;
  index?: number;
}

const DealCard = ({
  id,
  title,
  originalPrice,
  currentPrice,
  discount,
  platform,
  image,
  index = 0,
}: DealCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/product/${id}`)}
      className="card-elevated p-4 cursor-pointer transition-shadow duration-200 hover:shadow-elevated"
    >
      <div className="flex gap-4">
        <div className="w-24 h-24 bg-secondary rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-platform">{platform}</span>
            <span className="text-xs font-medium text-success flex items-center gap-1">
              <TrendingDown className="w-3 h-3" />
              {discount}% off
            </span>
          </div>
          
          <h3 className="font-medium text-foreground line-clamp-2 text-sm mb-2">
            {title}
          </h3>
          
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold text-foreground">
              ₹{currentPrice.toLocaleString()}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DealCard;
