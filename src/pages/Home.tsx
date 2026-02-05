import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "@/components/SearchBar";
import SectionHeader from "@/components/SectionHeader";
import DealCard from "@/components/DealCard";
import BottomNav from "@/components/BottomNav";
import SplashScreen from "@/components/SplashScreen";
import { Flame, TrendingDown } from "lucide-react";

// Mock data for demonstration
const bestDeals = [
  {
    id: "1",
    title: "Apple AirPods Pro (2nd Gen) with MagSafe Charging Case",
    originalPrice: 24900,
    currentPrice: 18990,
    discount: 24,
    platform: "Amazon" as const,
    image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=200&h=200&fit=crop",
  },
  {
    id: "2",
    title: "Samsung Galaxy Watch 6 Classic Bluetooth Smart Watch",
    originalPrice: 35999,
    currentPrice: 26999,
    discount: 25,
    platform: "Flipkart" as const,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop",
  },
];

const priceDrops = [
  {
    id: "3",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    originalPrice: 34990,
    currentPrice: 28990,
    discount: 17,
    platform: "Amazon" as const,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
  },
  {
    id: "4",
    title: "iPad Air M1 Chip 10.9-inch Liquid Retina Display",
    originalPrice: 59900,
    currentPrice: 49900,
    discount: 17,
    platform: "Flipkart" as const,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&h=200&fit=crop",
  },
];

const Home = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <motion.div
            key="splash"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SplashScreen />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showSplash ? 0 : 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="min-h-screen bg-background pb-24"
      >
        <div className="max-w-lg mx-auto px-4 pt-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: showSplash ? 0 : 1, y: showSplash ? -20 : 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-semibold text-foreground mb-1">
              ShopXAI
            </h1>
            <p className="text-muted-foreground text-sm">
              Find the best deals across stores
            </p>
          </motion.div>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          {/* Best Deals Section */}
          <section className="mb-8">
            <SectionHeader
              title="Best Deals Today"
              icon={<Flame className="w-5 h-5 text-warning" />}
            />
            <div className="space-y-3">
              {bestDeals.map((deal, index) => (
                <DealCard key={deal.id} {...deal} index={index} />
              ))}
            </div>
          </section>

          {/* Price Drops Section */}
          <section className="mb-8">
            <SectionHeader
              title="Price Drops"
              icon={<TrendingDown className="w-5 h-5 text-success" />}
            />
            <div className="space-y-3">
              {priceDrops.map((deal, index) => (
                <DealCard key={deal.id} {...deal} index={index} />
              ))}
            </div>
          </section>
        </div>

        <BottomNav />
      </motion.div>
    </>
  );
};

export default Home;
