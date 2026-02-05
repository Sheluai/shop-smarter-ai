import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Bell, ExternalLink, Info } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import RecommendationCard from "@/components/RecommendationCard";
import PriceHistoryCard, { PriceHistoryData } from "@/components/PriceHistoryCard";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { getRecommendation, ProductCategory, PriceHistory } from "@/lib/recommendation";

// Mock product data with category and detailed price history
const products: Record<string, {
  id: string;
  title: string;
  originalPrice: number;
  currentPrice: number;
  discount: number;
  platform: "Amazon" | "Flipkart";
  image: string;
  category: ProductCategory;
  priceHistory: PriceHistory;
  priceHistoryData: PriceHistoryData;
  affiliateUrl: string;
}> = {
  "1": {
    id: "1",
    title: "Apple AirPods Pro (2nd Gen) with MagSafe Charging Case",
    originalPrice: 24900,
    currentPrice: 18990,
    discount: 24,
    platform: "Amazon",
    image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=400&h=400&fit=crop",
    category: "mobiles",
    priceHistory: {
      lowest90Days: 18500,
      lowest6Months: 17990,
    },
    priceHistoryData: {
      lowest30Days: 18500,
      lowest30DaysDate: "Jan 15, 2026",
      lowest90Days: 17990,
      lowest90DaysDate: "Dec 20, 2025",
      chartData: [
        { day: "Nov", price: 22990 },
        { day: "Dec", price: 19990 },
        { day: "Jan", price: 18500 },
        { day: "Feb", price: 18990 },
      ],
    },
    affiliateUrl: "https://amazon.in",
  },
  "2": {
    id: "2",
    title: "Samsung Galaxy Watch 6 Classic Bluetooth Smart Watch",
    originalPrice: 35999,
    currentPrice: 26999,
    discount: 25,
    platform: "Flipkart",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    category: "electronics",
    priceHistory: {
      lowest90Days: 25999,
      lowest6Months: 24999,
    },
    priceHistoryData: {
      lowest30Days: 27500,
      lowest30DaysDate: "Jan 20, 2026",
      lowest90Days: 24999,
      lowest90DaysDate: "Nov 25, 2025",
      chartData: [
        { day: "Nov", price: 24999 },
        { day: "Dec", price: 29999 },
        { day: "Jan", price: 27500 },
        { day: "Feb", price: 26999 },
      ],
    },
    affiliateUrl: "https://flipkart.com",
  },
  "3": {
    id: "3",
    title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    originalPrice: 34990,
    currentPrice: 28990,
    discount: 17,
    platform: "Amazon",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    category: "electronics",
    priceHistory: {
      lowest90Days: 26990,
      lowest6Months: 25990,
      preSalePrice: 27500,
    },
    priceHistoryData: {
      lowest30Days: 26990,
      lowest30DaysDate: "Jan 10, 2026",
      lowest90Days: 25990,
      lowest90DaysDate: "Dec 1, 2025",
      chartData: [
        { day: "Nov", price: 29990 },
        { day: "Dec", price: 25990 },
        { day: "Jan", price: 26990 },
        { day: "Feb", price: 28990 },
      ],
    },
    affiliateUrl: "https://amazon.in",
  },
  "4": {
    id: "4",
    title: "iPad Air M1 Chip 10.9-inch Liquid Retina Display",
    originalPrice: 59900,
    currentPrice: 49900,
    discount: 17,
    platform: "Flipkart",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop",
    category: "electronics",
    priceHistory: {
      lowest90Days: 48900,
      lowest6Months: 46900,
    },
    priceHistoryData: {
      lowest30Days: 48900,
      lowest30DaysDate: "Jan 25, 2026",
      lowest90Days: 46900,
      lowest90DaysDate: "Nov 15, 2025",
      chartData: [
        { day: "Nov", price: 46900 },
        { day: "Dec", price: 52900 },
        { day: "Jan", price: 48900 },
        { day: "Feb", price: 49900 },
      ],
    },
    affiliateUrl: "https://flipkart.com",
  },
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [hasAlert, setHasAlert] = useState(false);

  const product = id ? products[id] : null;

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  const handleOpenStore = () => {
    window.open(product.affiliateUrl, "_blank");
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      description: isWishlisted ? "Product removed from your wishlist" : "You can view it in the Wishlist tab",
    });
  };

  const handleSetAlert = () => {
    setHasAlert(!hasAlert);
    toast({
      title: hasAlert ? "Alert Removed" : "Price Alert Set",
      description: hasAlert ? "You won't receive notifications for this product" : "We'll notify you when the price drops",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border"
      >
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 text-foreground"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
          <h1 className="font-semibold text-foreground">Product Details</h1>
        </div>
      </motion.header>

      <div className="max-w-lg mx-auto px-4 pt-6">
        {/* Product Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-secondary rounded-2xl overflow-hidden mb-6 aspect-square"
        >
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <span className="badge-platform mb-2 inline-block">{product.platform}</span>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {product.title}
          </h2>
          
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">
              ₹{product.currentPrice.toLocaleString()}
            </span>
            <span className="text-lg text-muted-foreground line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
            <span className="text-sm font-medium text-success">
              {product.discount}% off
            </span>
          </div>
        </motion.div>

        {/* Affiliate Disclosure */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="affiliate-notice flex gap-3 mb-6"
        >
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            This app uses affiliate links. If you buy through this link, we may earn a small commission at no extra cost to you.
          </p>
        </motion.div>

        {/* AI Recommendation */}
        <div className="mb-6">
          <RecommendationCard
            recommendation={getRecommendation(
              product.category,
              product.currentPrice,
              product.originalPrice,
              product.priceHistory
            )}
          />
        </div>

        {/* Price History */}
        <div className="mb-6">
          <PriceHistoryCard
            currentPrice={product.currentPrice}
            priceHistory={product.priceHistoryData}
          />
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-3"
        >
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenStore}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-5 h-5" />
            Open on Store
          </motion.button>

          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleWishlist}
              className={`btn-secondary flex items-center justify-center gap-2 ${
                isWishlisted ? "bg-destructive/10 text-destructive" : ""
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
              {isWishlisted ? "Saved" : "Wishlist"}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleSetAlert}
              className={`btn-secondary flex items-center justify-center gap-2 ${
                hasAlert ? "bg-warning/10 text-warning" : ""
              }`}
            >
              <Bell className={`w-5 h-5 ${hasAlert ? "fill-current" : ""}`} />
              {hasAlert ? "Alert Set" : "Set Alert"}
            </motion.button>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProductDetail;
