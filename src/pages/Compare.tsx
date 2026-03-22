import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Trash2, Award } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import ProductSearchDrawer from "@/components/compare/ProductSearchDrawer";
import ComparisonTable from "@/components/compare/ComparisonTable";
import { type Product } from "@/hooks/useProducts";

const Compare = () => {
  const [selected, setSelected] = useState<Product[]>([]);
  const [showSearch, setShowSearch] = useState(false);

  const addProduct = (product: Product) => {
    if (selected.length < 3 && !selected.find((p) => p.id === product.id)) {
      setSelected((prev) => [...prev, product]);
    }
    setShowSearch(false);
  };

  const removeProduct = (id: string) => {
    setSelected((prev) => prev.filter((p) => p.id !== id));
  };

  const clearAll = () => setSelected([]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border"
      >
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Compare Products</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Add up to 3 products to compare</p>
          </div>
          {selected.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearAll}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All
            </motion.button>
          )}
        </div>
      </motion.header>

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        {/* Product Slots */}
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((slot) => {
            const product = selected[slot];
            const discount = product && product.original_price && product.original_price > product.current_price
              ? Math.round(((product.original_price - product.current_price) / product.original_price) * 100)
              : 0;
            return (
              <motion.div
                key={slot}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: slot * 0.05 }}
                className={`relative rounded-2xl border-2 overflow-hidden ${
                  product
                    ? "border-border bg-card"
                    : "border-dashed border-muted-foreground/20 bg-secondary/50"
                }`}
              >
                <AnimatePresence mode="wait">
                  {product ? (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.25 }}
                      className="flex flex-col"
                    >
                      <div className="aspect-square">
                        <img
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Remove button */}
                      <button
                        onClick={() => removeProduct(product.id)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-destructive/90 backdrop-blur flex items-center justify-center"
                      >
                        <X className="w-3.5 h-3.5 text-destructive-foreground" />
                      </button>
                      {/* Info */}
                      <div className="p-2">
                        <p className="text-[10px] font-medium text-foreground line-clamp-1">{product.name}</p>
                        <p className="text-xs font-bold text-foreground">₹{product.current_price.toLocaleString()}</p>
                        {discount > 0 && (
                          <p className="text-[10px] font-medium text-success">{discount}% off</p>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => setShowSearch(true)}
                      className="aspect-square w-full flex flex-col items-center justify-center gap-1 text-muted-foreground"
                    >
                      <Plus className="w-6 h-6" />
                      <span className="text-[10px] font-medium">Add</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Comparison Table */}
        {selected.length >= 2 && <ComparisonTable products={selected} />}

        {/* Single product hint */}
        {selected.length === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
            <p className="text-sm text-muted-foreground">Add one more product to start comparing</p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowSearch(true)}
              className="mt-3 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
            >
              Add Product
            </motion.button>
          </motion.div>
        )}

        {/* Empty State */}
        {selected.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary flex items-center justify-center">
              <Plus className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">Compare Products</h3>
            <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">
              Search or paste a link to compare products side by side.
            </p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowSearch(true)}
              className="mt-5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
            >
              Add First Product
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Search Drawer */}
      <ProductSearchDrawer
        open={showSearch}
        onClose={() => setShowSearch(false)}
        onSelect={addProduct}
        excludeIds={selected.map((p) => p.id)}
      />

      <BottomNav />
    </div>
  );
};

export default Compare;
