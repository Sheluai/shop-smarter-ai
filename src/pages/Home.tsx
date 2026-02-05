import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "@/components/SearchBar";
import CategoryPills from "@/components/CategoryPills";
import FeaturedCards from "@/components/FeaturedCards";
import ProductListCard from "@/components/ProductListCard";
import FilterSheet from "@/components/FilterSheet";
import SortSheet from "@/components/SortSheet";
import BottomNav from "@/components/BottomNav";
import SplashScreen from "@/components/SplashScreen";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";

// Mock data for demonstration
const products = [
  {
    id: "1",
    title: "Apple AirPods Pro (2nd Gen) with MagSafe Charging Case",
    currentPrice: 18990,
    platform: "Amazon" as const,
    image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=200&h=200&fit=crop",
  },
  {
    id: "2",
    title: "Samsung Galaxy Watch 6 Classic Bluetooth Smart Watch",
    currentPrice: 26999,
    platform: "Flipkart" as const,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop",
  },
  {
    id: "3",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    currentPrice: 28990,
    platform: "Amazon" as const,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
  },
  {
    id: "4",
    title: "iPad Air M1 Chip 10.9-inch Liquid Retina Display",
    currentPrice: 49900,
    platform: "Flipkart" as const,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&h=200&fit=crop",
  },
];

const Home = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("deals");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState("lowest-price");
  const [filters, setFilters] = useState({
    priceRange: [0, 100000] as [number, number],
    platform: "all" as "all" | "amazon" | "flipkart",
    dealType: [] as string[],
    availability: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
        className="min-h-screen bg-background"
      >
        {/* Sticky Header with Search */}
        <motion.header
          className={`sticky top-0 z-40 bg-background transition-shadow duration-300 ${
            isScrolled ? "shadow-md" : ""
          }`}
        >
          <div className="max-w-lg mx-auto px-4 pt-12 pb-4">
            {/* App Title */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: showSplash ? 0 : 1, y: showSplash ? -20 : 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mb-4"
            >
              <h1 className="text-2xl font-semibold text-foreground">
                ShopXAI
              </h1>
            </motion.div>

            {/* Search Bar */}
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="max-w-lg mx-auto px-4 pb-28">
          {/* Category Pills */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: showSplash ? 0 : 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="mb-6"
          >
            <CategoryPills
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </motion.section>

          {/* Featured Cards */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: showSplash ? 0 : 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="mb-8"
          >
            <FeaturedCards />
          </motion.section>

          {/* Filter & Sort Bar */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: showSplash ? 0 : 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="flex gap-2 mb-6"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-background text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSortOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-border bg-background text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              <ArrowUpDown className="w-4 h-4" />
              Sort
            </motion.button>
          </motion.section>

          {/* Product List */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: showSplash ? 0 : 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <h2 className="text-lg font-semibold text-foreground mb-2">
              All Products
            </h2>
            <div className="divide-y divide-border">
              {products.map((product, index) => (
                <ProductListCard key={product.id} {...product} index={index} />
              ))}
            </div>
          </motion.section>
        </main>

        <BottomNav />

        {/* Filter Sheet */}
        <FilterSheet
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filters={filters}
          onApply={setFilters}
        />

        {/* Sort Sheet */}
        <SortSheet
          isOpen={isSortOpen}
          onClose={() => setIsSortOpen(false)}
          selected={sortOption}
          onSelect={setSortOption}
        />
      </motion.div>
    </>
  );
};

export default Home;
