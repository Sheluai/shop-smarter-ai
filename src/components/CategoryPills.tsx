import { motion } from "framer-motion";
import {
  Smartphone, Laptop, Shirt, Home, Sparkles, ShoppingBag, Tag, Cpu,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/hooks/useCategories";

const iconMap: Record<string, LucideIcon> = {
  mobiles: Smartphone,
  electronics: Laptop,
  fashion: Shirt,
  home: Home,
  appliances: Cpu,
  beauty: Sparkles,
  grocery: ShoppingBag,
  deals: Tag,
};

interface CategoryPillsProps {
  categories: Category[];
  selected: string;
  onSelect: (id: string) => void;
}

const CategoryPills = ({ categories, selected, onSelect }: CategoryPillsProps) => {
  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
      <div className="flex gap-2 pb-2">
        {categories.map((category, index) => {
          const Icon = iconMap[category.category_id] ?? Tag;
          const isSelected = selected === category.category_id;

          return (
            <motion.button
              key={category.category_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(category.category_id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border whitespace-nowrap transition-all duration-200 ${
                isSelected
                  ? "bg-foreground border-foreground text-background"
                  : "bg-background border-border text-muted-foreground hover:border-muted-foreground/30"
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={isSelected ? 2 : 1.5} />
              <span className="text-sm font-medium">{category.category_name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryPills;
