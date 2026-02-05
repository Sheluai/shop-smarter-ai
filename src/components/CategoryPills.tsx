import { motion } from "framer-motion";
import { Smartphone, Laptop, Shirt, Home, Sparkles, ShoppingBag, Tag } from "lucide-react";

const categories = [
  { id: "mobiles", label: "Mobiles", icon: Smartphone },
  { id: "electronics", label: "Electronics", icon: Laptop },
  { id: "fashion", label: "Fashion", icon: Shirt },
  { id: "home", label: "Home", icon: Home },
  { id: "beauty", label: "Beauty", icon: Sparkles },
  { id: "grocery", label: "Grocery", icon: ShoppingBag },
  { id: "deals", label: "Deals", icon: Tag },
];

interface CategoryPillsProps {
  selected: string;
  onSelect: (id: string) => void;
}

const CategoryPills = ({ selected, onSelect }: CategoryPillsProps) => {
  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
      <div className="flex gap-2 pb-2">
        {categories.map((category, index) => {
          const Icon = category.icon;
          const isSelected = selected === category.id;
          
          return (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(category.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? "bg-secondary border-secondary text-foreground"
                  : "bg-background border-border text-muted-foreground hover:border-muted-foreground/30"
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={isSelected ? 2 : 1.5} />
              <span className="text-sm font-medium">{category.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryPills;
