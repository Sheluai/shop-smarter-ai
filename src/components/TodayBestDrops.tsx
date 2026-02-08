import { motion } from "framer-motion";
import { TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const bestDrops = [
  {
    id: "1",
    title: "AirPods Pro 2",
    image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=200&h=200&fit=crop",
    currentPrice: 18990,
    drop: 2000,
    platform: "Amazon",
    category: "mobiles",
  },
  {
    id: "2",
    title: "Galaxy Watch 6",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop",
    currentPrice: 26999,
    drop: 3500,
    platform: "Flipkart",
    category: "electronics",
  },
  {
    id: "3",
    title: "Sony WH-1000XM5",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
    currentPrice: 28990,
    drop: 4010,
    platform: "Amazon",
    category: "electronics",
  },
  {
    id: "4",
    title: "iPad Air M1",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&h=200&fit=crop",
    currentPrice: 49900,
    drop: 5100,
    platform: "Flipkart",
    category: "electronics",
  },
  {
    id: "5",
    title: "Cotton Casual Shirt",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop",
    currentPrice: 799,
    drop: 400,
    platform: "Amazon",
    category: "fashion",
  },
  {
    id: "6",
    title: "Smart LED Bulb Pack",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=200&fit=crop",
    currentPrice: 1299,
    drop: 500,
    platform: "Flipkart",
    category: "home",
  },
  {
    id: "7",
    title: "Instant Pot Duo 7-in-1",
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=200&h=200&fit=crop",
    currentPrice: 5499,
    drop: 1500,
    platform: "Amazon",
    category: "appliances",
  },
];

interface TodayBestDropsProps {
  selectedCategory: string;
}

const TodayBestDrops = ({ selectedCategory }: TodayBestDropsProps) => {
  const navigate = useNavigate();

  const filtered = selectedCategory
    ? bestDrops.filter((d) => d.category === selectedCategory)
    : bestDrops;

  if (filtered.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-foreground">
          🔥 Today's Best Drops
        </h2>
        <span className="text-xs font-medium text-muted-foreground">
          Best time to buy
        </span>
      </div>

      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
        <div className="flex gap-3 pb-1">
          {filtered.map((item, index) => (
            <motion.div
              key={`${selectedCategory}-${item.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/product/${item.id}`)}
              className="flex-shrink-0 w-40 cursor-pointer"
            >
              <div className="card-soft overflow-hidden">
                <div className="w-full h-32 bg-secondary overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs text-muted-foreground mb-1 truncate">
                    {item.platform}
                  </p>
                  <h3 className="text-sm font-medium text-foreground mb-1.5 truncate">
                    {item.title}
                  </h3>
                  <p className="text-base font-semibold text-foreground">
                    ₹{item.currentPrice.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="w-3 h-3 text-success" />
                    <span className="text-xs font-medium text-success">
                      ↓ ₹{item.drop.toLocaleString()} today
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodayBestDrops;
