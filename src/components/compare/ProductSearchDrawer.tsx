import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Link2, X, ArrowLeft } from "lucide-react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useProducts, type Product } from "@/hooks/useProducts";

type Tab = "search" | "paste";

interface ProductSearchDrawerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (product: Product) => void;
  excludeIds: string[];
}

const ProductSearchDrawer = ({ open, onClose, onSelect, excludeIds }: ProductSearchDrawerProps) => {
  const { products, isLoading } = useProducts();
  const [tab, setTab] = useState<Tab>("search");
  const [query, setQuery] = useState("");
  const [pasteUrl, setPasteUrl] = useState("");

  const filtered = useMemo(() => {
    const available = products.filter((p) => !excludeIds.includes(p.id));
    if (!query.trim()) return available.slice(0, 20);
    const q = query.toLowerCase();
    return available.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 20);
  }, [products, excludeIds, query]);

  const handleSelect = (product: Product) => {
    onSelect(product);
    setQuery("");
    setPasteUrl("");
  };

  const handlePasteSearch = () => {
    if (!pasteUrl.trim()) return;
    // Try to find a product matching the URL in the database
    const q = pasteUrl.toLowerCase();
    const found = products.find(
      (p) => !excludeIds.includes(p.id) && (p.name.toLowerCase().includes(q) || q.includes("amazon") || q.includes("flipkart"))
    );
    if (found) {
      handleSelect(found);
    }
  };

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-lg">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 pt-4 pb-3">
            <button onClick={onClose} className="p-1">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <h2 className="text-lg font-semibold text-foreground flex-1">Add Product</h2>
            <button onClick={onClose} className="p-1">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 px-4 mb-4">
            <button
              onClick={() => setTab("search")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                tab === "search"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              <Search className="w-4 h-4" />
              Search Products
            </button>
            <button
              onClick={() => setTab("paste")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                tab === "paste"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              <Link2 className="w-4 h-4" />
              Paste Link
            </button>
          </div>

          {/* Content */}
          <div className="px-4 pb-8 overflow-y-auto max-h-[60vh]">
            <AnimatePresence mode="wait">
              {tab === "search" ? (
                <motion.div
                  key="search"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative mb-4">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search by product name..."
                      autoFocus
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    {query && (
                      <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>

                  {isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 rounded-xl bg-secondary animate-pulse" />
                      ))}
                    </div>
                  ) : filtered.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-sm text-muted-foreground">No products found</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {filtered.map((p, i) => {
                        const discount = p.original_price && p.original_price > p.current_price
                          ? Math.round(((p.original_price - p.current_price) / p.original_price) * 100)
                          : 0;
                        return (
                          <motion.button
                            key={p.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.02 }}
                            onClick={() => handleSelect(p)}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary/70 transition-colors"
                          >
                            <img
                              src={p.image_url || "/placeholder.svg"}
                              alt={p.name}
                              className="w-12 h-12 rounded-lg object-cover bg-secondary"
                            />
                            <div className="flex-1 text-left min-w-0">
                              <p className="text-sm font-medium text-foreground line-clamp-1">{p.name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-sm font-semibold text-foreground">
                                  ₹{p.current_price.toLocaleString()}
                                </span>
                                {p.original_price && p.original_price > p.current_price && (
                                  <>
                                    <span className="text-xs text-muted-foreground line-through">
                                      ₹{p.original_price.toLocaleString()}
                                    </span>
                                    <span className="text-xs font-medium text-success">{discount}% off</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="paste"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-xs text-muted-foreground mb-3">
                    Paste an Amazon or Flipkart product link to add it for comparison.
                  </p>
                  <div className="relative mb-4">
                    <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="url"
                      value={pasteUrl}
                      onChange={(e) => setPasteUrl(e.target.value)}
                      placeholder="https://amazon.in/dp/... or flipkart.com/..."
                      autoFocus
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <button
                    onClick={handlePasteSearch}
                    disabled={!pasteUrl.trim()}
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-40 transition-opacity"
                  >
                    Find Product
                  </button>
                  <p className="text-[11px] text-muted-foreground text-center mt-3">
                    We'll match this link to our product database for accurate comparison.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ProductSearchDrawer;
