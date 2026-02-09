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
import { Loader2, Plus, Trash2, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

interface AffiliateRow {
  id: string;
  product_id: string;
  platform: string;
  affiliate_url: string;
  is_primary: boolean;
  product_name?: string;
}

interface ProductOption {
  id: string;
  name: string;
}

const AdminAffiliateLinks = () => {
  const [links, setLinks] = useState<AffiliateRow[]>([]);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [newProductId, setNewProductId] = useState("");
  const [newPlatform, setNewPlatform] = useState("amazon");
  const [newUrl, setNewUrl] = useState("");

  const fetchData = useCallback(async () => {
    const [linkRes, prodRes] = await Promise.all([
      supabase
        .from("affiliate_links")
        .select("*, products(name)")
        .order("created_at", { ascending: false }),
      supabase.from("products").select("id, name").order("name"),
    ]);

    if (linkRes.data) {
      setLinks(
        linkRes.data.map((l: any) => ({
          ...l,
          product_name: l.products?.name || "Unknown",
        }))
      );
    }
    if (prodRes.data) setProducts(prodRes.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdd = async () => {
    if (!newProductId || !newUrl.trim()) {
      toast.error("Product and URL are required");
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("affiliate_links").insert({
      product_id: newProductId,
      platform: newPlatform,
      affiliate_url: newUrl.trim(),
      is_primary: true,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Affiliate link added");
      setNewProductId("");
      setNewUrl("");
      fetchData();
    }
    setSaving(false);
  };

  const handleTogglePrimary = async (id: string, productId: string, isPrimary: boolean) => {
    // If setting as primary, unset other links for the same product
    if (isPrimary) {
      await supabase
        .from("affiliate_links")
        .update({ is_primary: false })
        .eq("product_id", productId);
    }

    const { error } = await supabase
      .from("affiliate_links")
      .update({ is_primary: isPrimary })
      .eq("id", id);

    if (error) toast.error(error.message);
    else fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this affiliate link?")) return;
    const { error } = await supabase.from("affiliate_links").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Link deleted");
      fetchData();
    }
  };

  const handleUrlUpdate = async (id: string, url: string) => {
    const { error } = await supabase
      .from("affiliate_links")
      .update({ affiliate_url: url })
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
        <h2 className="text-base font-semibold text-foreground mb-1">Affiliate Link Management</h2>
        <p className="text-sm text-muted-foreground">
          Add or update affiliate URLs per product. Mark one as primary per product.
        </p>
      </div>

      {/* Add link */}
      <div className="card-soft p-4 space-y-3">
        <h3 className="text-sm font-medium text-foreground">Add Affiliate Link</h3>
        <div className="grid grid-cols-2 gap-2">
          <Select value={newProductId} onValueChange={setNewProductId}>
            <SelectTrigger>
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={newPlatform} onValueChange={setNewPlatform}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="amazon">Amazon</SelectItem>
              <SelectItem value="flipkart">Flipkart</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input
          placeholder="Affiliate URL"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
        />
        <button
          onClick={handleAdd}
          disabled={saving}
          className="btn-primary flex items-center gap-1.5 text-sm px-4"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add Link
        </button>
      </div>

      {/* Link list */}
      <div className="space-y-2">
        {links.map((link) => (
          <div key={link.id} className="card-soft p-4 flex items-center gap-3">
            <LinkIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />

            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-sm font-medium text-foreground truncate">
                {link.product_name}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded">
                  {link.platform}
                </span>
                <Input
                  defaultValue={link.affiliate_url}
                  onBlur={(e) => handleUrlUpdate(link.id, e.target.value)}
                  className="h-6 text-xs border-0 p-0 focus-visible:ring-0 flex-1"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Switch
                  checked={link.is_primary}
                  onCheckedChange={(v) =>
                    handleTogglePrimary(link.id, link.product_id, v)
                  }
                />
                <Label className="text-xs">Primary</Label>
              </div>

              <button
                onClick={() => handleDelete(link.id)}
                className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {links.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            No affiliate links yet. Add products first, then link them.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminAffiliateLinks;
