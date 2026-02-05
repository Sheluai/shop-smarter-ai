import { motion } from "framer-motion";
import { Bell, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  id: string;
  title: string;
  currentPrice: number;
  platform: "Amazon" | "Flipkart";
  image: string;
  hasAlert?: boolean;
  onRemove?: () => void;
  index?: number;
}

const ProductCard = ({
  id,
  title,
  currentPrice,
  platform,
  image,
  hasAlert,
  onRemove,
  index = 0,
}: ProductCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="card-soft p-4"
    >
      <div className="flex gap-4">
        <motion.div
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/product/${id}`)}
          className="w-20 h-20 bg-secondary rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
        >
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-platform">{platform}</span>
            {hasAlert && (
              <span className="flex items-center gap-1 text-xs text-warning">
                <Bell className="w-3 h-3" />
                Alert set
              </span>
            )}
          </div>
          
          <h3
            onClick={() => navigate(`/product/${id}`)}
            className="font-medium text-foreground line-clamp-2 text-sm mb-2 cursor-pointer hover:text-primary transition-colors"
          >
            {title}
          </h3>
          
          <div className="flex items-center justify-between">
            <span className="text-base font-semibold text-foreground">
              ₹{currentPrice.toLocaleString()}
            </span>
            
            {onRemove && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
