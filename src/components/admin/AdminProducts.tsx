import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2 } from "lucide-react";
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
}

interface CategoryOption {
  category_id: string;
  category_name: string;
}

const AdminProducts = () => {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New product form
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  const fetchData = useCallback(async () => {
    const [prodRes, catRes] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("category_id, category_name").order("priority_order"),
    ]);

    if (prodRes.data) setProducts(prodRes.data);
    if (catRes.data) setCategories(catRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = async () => {
    if (!newName.trim() || !newPrice) {
      toast.error("Name and price are required");
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("products").insert({
      name: newName.trim(),
      current_price: parseFloat(newPrice),
      category_id: newCategory || null,
      image_url: newImageUrl.trim() || null,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Product added");
      setNewName("");
      setNewPrice("");
      setNewCategory("");
      setNewImageUrl("");
      fetchData();
    }
    setSaving(false);
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

  const handleFieldUpdate = async (id: string, field: string, value: string | number | null) => {
    const { error } = await supabase
      .from("products")
      .update({ [field]: value })
      .eq("id", id);
    if (error) toast.error(error.message);
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
      <div>
        <h2 className="text-base font-semibold text-foreground mb-1">Product Management</h2>
        <p className="text-sm text-muted-foreground">
          Add products, mark as featured/best drop, and override AI recommendations.
        </p>
      </div>

      {/* Add product */}
      <div className="card-soft p-4 space-y-3">
        <h3 className="text-sm font-medium text-foreground">Add Product</h3>
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Product name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Price (₹)"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
          />
          <Select value={newCategory} onValueChange={setNewCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.category_id} value={c.category_id}>
                  {c.category_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Image URL (optional)"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
          />
        </div>
        <button
          onClick={handleAdd}
          disabled={saving}
          className="btn-primary flex items-center gap-1.5 text-sm px-4"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add Product
        </button>
      </div>

      {/* Product list */}
      <div className="space-y-2">
        {products.map((prod) => (
          <div key={prod.id} className="card-soft p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {prod.image_url && (
                  <img
                    src={prod.image_url}
                    alt={prod.name}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <Input
                    defaultValue={prod.name}
                    onBlur={(e) => handleFieldUpdate(prod.id, "name", e.target.value)}
                    className="h-7 text-sm font-medium border-0 p-0 focus-visible:ring-0"
                  />
                  <p className="text-xs text-muted-foreground">
                    ₹{prod.current_price.toLocaleString()}
                    {prod.category_id && ` · ${prod.category_id}`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDelete(prod.id)}
                className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={prod.is_enabled}
                  onCheckedChange={(v) => handleToggle(prod.id, "is_enabled", v)}
                />
                <Label className="text-xs">Enabled</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={prod.is_featured}
                  onCheckedChange={(v) => handleToggle(prod.id, "is_featured", v)}
                />
                <Label className="text-xs">Featured</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={prod.is_todays_best_drop}
                  onCheckedChange={(v) => handleToggle(prod.id, "is_todays_best_drop", v)}
                />
                <Label className="text-xs">Best Drop</Label>
              </div>

              <Select
                value={prod.ai_status || "none"}
                onValueChange={(v) => handleAiStatus(prod.id, v)}
              >
                <SelectTrigger className="w-36 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Auto AI</SelectItem>
                  <SelectItem value="buy">🟢 Buy Now</SelectItem>
                  <SelectItem value="wait">🟡 Wait</SelectItem>
                  <SelectItem value="overpriced">🔴 Overpriced</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
