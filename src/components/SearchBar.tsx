import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
}

const SearchBar = ({ value = "", onChange, onSubmit }: SearchBarProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.();
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={handleSubmit}
      className="relative"
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Search products or paste store link"
          className="input-search w-full pl-12 pr-4 text-base"
        />
      </div>
    </motion.form>
  );
};

export default SearchBar;
