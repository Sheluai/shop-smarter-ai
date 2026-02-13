import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2, Link2, Sparkles, ChevronDown, ChevronUp, Pencil } from "lucide-react";
import { toast } from "sonner";

interface ProductRow {
  id: string;
  name: string;
  image_url: string | null;
  category_id: string | null;
  current_price: number;
  original_price: number | null;
  price_drop: number | null;
  is_enabled: boolean;
  is_featured: boolean;
  is_todays_best_drop: boolean;
  ai_status: string | null;
  ai_status_override: boolean;
  store: string | null;
  product_url: string | null;
  affiliate_url: string | null;
  coupon_code: string | null;
  coupon_expiry: string | null;
}

interface CategoryOption {
  category_id: string;
  category_name: string;
}

const STORES = ["amazon", "flipkart", "myntra", "ajio", "croma", "other"];
const AI_VERDICTS = [
  { value: "none", label: "Auto AI" },
  { value: "buy", label: "🟢 Buy Now" },
  { value: "wait", label: "🟡 Wait" },
  { value: "overpriced", label: "🔴 Overpriced" },
];

const AdminProducts = () => {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // New product form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newMrp, setNewMrp] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newStore, setNewStore] = useState("");
  const [newProductUrl, setNewProductUrl] = useState("");
  const [newAffiliateUrl, setNewAffiliateUrl] = useState("");
  const [newCoupon, setNewCoupon] = useState("");
  const [newAiStatus, setNewAiStatus] = useState("none");

  // Paste link auto-fill
  const [pasteUrl, setPasteUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const fetchData = useCallback(async () => {
    const [prodRes, catRes] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("category_id, category_name").order("priority_order"),
    ]);

    if (prodRes.data) setProducts(prodRes.data as ProductRow[]);
    if (catRes.data) setCategories(catRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const detectStore = (url: string): string => {
    const lower = url.toLowerCase();
    if (lower.includes("amazon")) return "amazon";
    if (lower.includes("flipkart")) return "flipkart";
    if (lower.includes("myntra")) return "myntra";
    if (lower.includes("ajio")) return "ajio";
    if (lower.includes("croma")) return "croma";
    return "other";
  };

  const handlePasteAnalyze = async () => {
    if (!pasteUrl.trim()) return;
    setAnalyzing(true);

    try {
      const store = detectStore(pasteUrl);
      setNewStore(store);
      setNewProductUrl(pasteUrl.trim());

      // Call the analyze-deal edge function
      const res = await supabase.functions.invoke("analyze-deal", {
        body: { url: pasteUrl.trim() },
      });

      if (res.data) {
        const d = res.data;
        if (d.product_name) setNewName(d.product_name);
        if (d.current_price) setNewPrice(String(d.current_price));
        if (d.average_price) setNewMrp(String(d.average_price));
        if (d.verdict) setNewAiStatus(d.verdict);
        toast.success("Product details extracted!");
      }
    } catch {
      toast.info("Store detected. Fill remaining details manually.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAdd = async () => {
    if (!newName.trim() || !newPrice) {
      toast.error("Name and price are required");
      return;
    }

    setSaving(true);
    const aiVal = newAiStatus === "none" ? null : newAiStatus;
    const { error } = await supabase.from("products").insert({
      name: newName.trim(),
      current_price: parseFloat(newPrice),
      original_price: newMrp ? parseFloat(newMrp) : null,
      category_id: newCategory || null,
      image_url: newImageUrl.trim() || null,
      store: newStore || null,
      product_url: newProductUrl.trim() || null,
      affiliate_url: newAffiliateUrl.trim() || null,
      coupon_code: newCoupon.trim() || null,
      ai_status: aiVal,
      ai_status_override: aiVal !== null,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Product added");
      resetForm();
      fetchData();
    }
    setSaving(false);
  };

  const resetForm = () => {
    setNewName("");
    setNewPrice("");
    setNewMrp("");
    setNewCategory("");
    setNewImageUrl("");
    setNewStore("");
    setNewProductUrl("");
    setNewAffiliateUrl("");
    setNewCoupon("");
    setNewAiStatus("none");
    setPasteUrl("");
    setShowAddForm(false);
  };

  const handleToggle = async (id: string, field: string, value: boolean) => {
    const { error } = await supabase
      .from("products")
      .update({ [field]: value })
      .eq("id", id);

    if (error) toast.error(error.message);
    else {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
      );
    }
  };

  const handleFieldUpdate = async (id: string, field: string, value: string | number | null) => {
    const { error } = await supabase
      .from("products")
      .update({ [field]: value })
      .eq("id", id);
    if (error) toast.error(error.message);
    else {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
      );
    }
  };

  const handleAiStatus = async (id: string, status: string) => {
    const val = status === "none" ? null : status;
    const { error } = await supabase
      .from("products")
      .update({ ai_status: val, ai_status_override: val !== null })
      .eq("id", id);

    if (error) toast.error(error.message);
    else {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, ai_status: val, ai_status_override: val !== null } : p
        )
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Product deleted");
      fetchData();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground mb-1">Product Management</h2>
          <p className="text-sm text-muted-foreground">
            {products.length} products · Add, edit, and manage visibility.
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary flex items-center gap-1.5 text-sm px-4"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Add product form */}
      {showAddForm && (
        <div className="card-soft p-5 space-y-4">
          {/* Paste link auto-fill */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Quick Add — Paste Product Link</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Paste Amazon, Flipkart, or any product URL..."
                value={pasteUrl}
                onChange={(e) => setPasteUrl(e.target.value)}
                className="flex-1"
              />
              <button
                onClick={handlePasteAnalyze}
                disabled={analyzing || !pasteUrl.trim()}
                className="btn-primary flex items-center gap-1.5 text-sm px-4 whitespace-nowrap"
              >
                {analyzing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Auto-Fill
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Paste a link to auto-detect store and fill product details using AI.
            </p>
          </div>

          <div className="h-px bg-border" />

          {/* Manual form fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1">
              <Label className="text-xs text-muted-foreground">Product Name *</Label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Sony WH-1000XM5" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Price (₹) *</Label>
              <Input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="24990" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">MRP / Original Price (₹)</Label>
              <Input type="number" value={newMrp} onChange={(e) => setNewMrp(e.target.value)} placeholder="29990" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Store</Label>
              <Select value={newStore} onValueChange={setNewStore}>
                <SelectTrigger><SelectValue placeholder="Select store" /></SelectTrigger>
                <SelectContent>
                  {STORES.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Category</Label>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.category_id} value={c.category_id}>{c.category_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-1">
              <Label className="text-xs text-muted-foreground">Image URL</Label>
              <Input value={newImageUrl} onChange={(e) => setNewImageUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="text-xs text-muted-foreground">Product URL</Label>
              <Input value={newProductUrl} onChange={(e) => setNewProductUrl(e.target.value)} placeholder="Original product page link" />
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="text-xs text-muted-foreground">Affiliate Link</Label>
              <Input value={newAffiliateUrl} onChange={(e) => setNewAffiliateUrl(e.target.value)} placeholder="Affiliate deep link with tracking tag" />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Coupon Code</Label>
              <Input value={newCoupon} onChange={(e) => setNewCoupon(e.target.value)} placeholder="e.g. SAVE20" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">AI Verdict</Label>
              <Select value={newAiStatus} onValueChange={setNewAiStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {AI_VERDICTS.map((v) => (
                    <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={saving}
              className="btn-primary flex items-center gap-1.5 text-sm px-5"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add Product
            </button>
            <button onClick={resetForm} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Product list */}
      <div className="space-y-2">
        {products.map((prod) => (
          <div key={prod.id} className="card-soft overflow-hidden">
            {/* Summary row */}
            <div className="p-4 flex items-center gap-3">
              {prod.image_url && (
                <img src={prod.image_url} alt={prod.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{prod.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>₹{prod.current_price.toLocaleString()}</span>
                  {prod.store && <span className="capitalize">· {prod.store}</span>}
                  {prod.ai_status && (
                    <span className={
                      prod.ai_status === "buy" ? "text-green-600" :
                      prod.ai_status === "wait" ? "text-yellow-600" :
                      "text-red-500"
                    }>
                      · {prod.ai_status === "buy" ? "🟢 Buy" : prod.ai_status === "wait" ? "🟡 Wait" : "🔴 Overpriced"}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Switch
                  checked={prod.is_enabled}
                  onCheckedChange={(v) => handleToggle(prod.id, "is_enabled", v)}
                />
                <Label className="text-xs w-8">{prod.is_enabled ? "Live" : "Off"}</Label>

                <button
                  onClick={() => setExpandedId(expandedId === prod.id ? null : prod.id)}
                  className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
                >
                  {expandedId === prod.id ? <ChevronUp className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleDelete(prod.id)}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Expanded edit */}
            {expandedId === prod.id && (
              <div className="px-4 pb-4 pt-0 border-t border-border space-y-3">
                <div className="grid grid-cols-2 gap-3 pt-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Name</Label>
                    <Input
                      defaultValue={prod.name}
                      onBlur={(e) => handleFieldUpdate(prod.id, "name", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Store</Label>
                    <Select
                      defaultValue={prod.store || ""}
                      onValueChange={(v) => handleFieldUpdate(prod.id, "store", v)}
                    >
                      <SelectTrigger><SelectValue placeholder="Store" /></SelectTrigger>
                      <SelectContent>
                        {STORES.map((s) => (
                          <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Price (₹)</Label>
                    <Input
                      type="number"
                      defaultValue={prod.current_price}
                      onBlur={(e) => handleFieldUpdate(prod.id, "current_price", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">MRP (₹)</Label>
                    <Input
                      type="number"
                      defaultValue={prod.original_price || ""}
                      onBlur={(e) => handleFieldUpdate(prod.id, "original_price", e.target.value ? parseFloat(e.target.value) : null)}
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs text-muted-foreground">Image URL</Label>
                    <Input
                      defaultValue={prod.image_url || ""}
                      onBlur={(e) => handleFieldUpdate(prod.id, "image_url", e.target.value || null)}
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs text-muted-foreground">Product URL</Label>
                    <Input
                      defaultValue={prod.product_url || ""}
                      onBlur={(e) => handleFieldUpdate(prod.id, "product_url", e.target.value || null)}
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs text-muted-foreground">Affiliate Link</Label>
                    <Input
                      defaultValue={prod.affiliate_url || ""}
                      onBlur={(e) => handleFieldUpdate(prod.id, "affiliate_url", e.target.value || null)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Coupon Code</Label>
                    <Input
                      defaultValue={prod.coupon_code || ""}
                      onBlur={(e) => handleFieldUpdate(prod.id, "coupon_code", e.target.value || null)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">AI Verdict</Label>
                    <Select
                      value={prod.ai_status || "none"}
                      onValueChange={(v) => handleAiStatus(prod.id, v)}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {AI_VERDICTS.map((v) => (
                          <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-1">
                  <div className="flex items-center gap-2">
                    <Switch checked={prod.is_featured} onCheckedChange={(v) => handleToggle(prod.id, "is_featured", v)} />
                    <Label className="text-xs">Featured</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={prod.is_todays_best_drop} onCheckedChange={(v) => handleToggle(prod.id, "is_todays_best_drop", v)} />
                    <Label className="text-xs">Best Drop</Label>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {products.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            No products yet. Add one above to get started.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
