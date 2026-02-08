import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  { id: "mobiles", label: "Mobiles" },
  { id: "electronics", label: "Electronics" },
  { id: "fashion", label: "Fashion" },
  { id: "home", label: "Home" },
];

const dealsByCategory: Record<string, Array<{
  id: string;
  title: string;
  image: string;
  price: number;
  platform: string;
}>> = {
  mobiles: [
    { id: "1", title: "AirPods Pro 2", image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=160&h=160&fit=crop", price: 18990, platform: "Amazon" },
    { id: "2", title: "Galaxy Watch 6", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=160&h=160&fit=crop", price: 26999, platform: "Flipkart" },
  ],
  electronics: [
    { id: "3", title: "Sony WH-1000XM5", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=160&h=160&fit=crop", price: 28990, platform: "Amazon" },
    { id: "4", title: "iPad Air M1", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=160&h=160&fit=crop", price: 49900, platform: "Flipkart" },
  ],
  fashion: [
    { id: "1", title: "AirPods Pro 2", image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=160&h=160&fit=crop", price: 18990, platform: "Amazon" },
  ],
  home: [
    { id: "3", title: "Sony WH-1000XM5", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=160&h=160&fit=crop", price: 28990, platform: "Amazon" },
  ],
};

const TopDealsByCategory = () => {
  const [selected, setSelected] = useState("mobiles");
  const navigate = useNavigate();
  const deals = dealsByCategory[selected] || [];

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-3">
        💰 Top Deals by Category
      </h2>

      {/* Category Chips */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 mb-4">
        <div className="flex gap-2 pb-1">
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelected(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selected === cat.id
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground border border-border"
              }`}
            >
              {cat.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Deal Cards */}
      <div className="grid grid-cols-2 gap-3">
        {deals.map((deal, index) => (
          <motion.div
            key={`${selected}-${deal.id}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.06, duration: 0.35 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(`/product/${deal.id}`)}
            className="card-soft overflow-hidden cursor-pointer"
          >
            <div className="w-full h-28 bg-secondary overflow-hidden">
              <img
                src={deal.image}
                alt={deal.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="p-3">
              <p className="text-xs text-muted-foreground">{deal.platform}</p>
              <h3 className="text-sm font-medium text-foreground truncate mt-0.5">
                {deal.title}
              </h3>
              <p className="text-sm font-semibold text-foreground mt-1">
                ₹{deal.price.toLocaleString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TopDealsByCategory;
