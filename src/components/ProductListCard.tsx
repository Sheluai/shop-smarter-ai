import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface ProductListCardProps {
  id: string;
  title: string;
  currentPrice: number;
  platform: "Amazon" | "Flipkart";
  image: string;
  index?: number;
}

const ProductListCard = ({
  id,
  title,
  currentPrice,
  platform,
  image,
  index = 0,
}: ProductListCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/product/${id}`)}
      className="flex gap-4 py-4 cursor-pointer"
    >
      {/* Product Image */}
      <div className="w-20 h-20 bg-secondary rounded-xl overflow-hidden flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <span className="text-xs text-muted-foreground mb-1">{platform}</span>
        <h3 className="font-medium text-foreground text-sm line-clamp-2 mb-1.5">
          {title}
        </h3>
        <span className="text-base font-semibold text-foreground">
          ₹{currentPrice.toLocaleString()}
        </span>
      </div>
    </motion.div>
  );
};

export default ProductListCard;
