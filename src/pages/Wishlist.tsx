import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import ProductCard from "@/components/ProductCard";
import { useState } from "react";

const initialWishlist = [
  {
    id: "1",
    title: "Apple AirPods Pro (2nd Gen) with MagSafe Charging Case",
    currentPrice: 18990,
    platform: "Amazon" as const,
    image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=200&h=200&fit=crop",
    hasAlert: true,
  },
  {
    id: "3",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    currentPrice: 28990,
    platform: "Amazon" as const,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
    hasAlert: false,
  },
];

const Wishlist = () => {
  const [wishlist, setWishlist] = useState(initialWishlist);

  const handleRemove = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto px-4 pt-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-6 h-6 text-destructive" />
            <h1 className="text-2xl font-semibold text-foreground">Wishlist</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            {wishlist.length} saved {wishlist.length === 1 ? "product" : "products"}
          </p>
        </motion.div>

        {/* Wishlist Items */}
        {wishlist.length > 0 ? (
          <div className="space-y-3">
            {wishlist.map((item, index) => (
              <ProductCard
                key={item.id}
                {...item}
                onRemove={() => handleRemove(item.id)}
                index={index}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-2">No saved products</h3>
            <p className="text-sm text-muted-foreground">
              Products you save will appear here
            </p>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Wishlist;
