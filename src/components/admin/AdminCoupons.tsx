import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, Ticket, Search } from "lucide-react";
import { toast } from "sonner";

interface CouponProduct {
  id: string;
  name: string;
  store: string | null;
  coupon_code: string | null;
  coupon_expiry: string | null;
  current_price: number;
}

const AdminCoupons = () => {
  const [products, setProducts] = useState<CouponProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchProducts = useCallback(async () => {
    const { data } = await supabase
      .from("products")
      .select("id, name, store, coupon_code, coupon_expiry, current_price")
      .order("created_at", { ascending: false });

    if (data) setProducts(data as CouponProduct[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCouponUpdate = async (id: string, code: string) => {
    const { error } = await supabase
      .from("products")
      .update({ coupon_code: code || null })
      .eq("id", id);
    if (error) toast.error(error.message);
    else {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, coupon_code: code || null } : p))
      );
    }
  };

  const handleExpiryUpdate = async (id: string, expiry: string) => {
    const { error } = await supabase
      .from("products")
      .update({ coupon_expiry: expiry || null })
      .eq("id", id);
    if (error) toast.error(error.message);
    else {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, coupon_expiry: expiry || null } : p))
      );
    }
  };

  const handleClearCoupon = async (id: string) => {
    const { error } = await supabase
      .from("products")
      .update({ coupon_code: null, coupon_expiry: null })
      .eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Coupon removed");
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, coupon_code: null, coupon_expiry: null } : p))
      );
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.store && p.store.toLowerCase().includes(search.toLowerCase())) ||
      (p.coupon_code && p.coupon_code.toLowerCase().includes(search.toLowerCase()))
  );

  const withCoupons = filtered.filter((p) => p.coupon_code);
  const withoutCoupons = filtered.filter((p) => !p.coupon_code);

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
        <h2 className="text-base font-semibold text-foreground mb-1">Coupon Management</h2>
        <p className="text-sm text-muted-foreground">
          Assign coupon codes to products. Active coupons appear in the Coupons tab.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search products or coupons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Active coupons */}
      {withCoupons.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Ticket className="w-4 h-4 text-primary" />
            Active Coupons ({withCoupons.length})
          </h3>
          {withCoupons.map((prod) => (
            <div key={prod.id} className="card-soft p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{prod.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {prod.store || "Unknown store"} · ₹{prod.current_price.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleClearCoupon(prod.id)}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Coupon Code</Label>
                  <Input
                    defaultValue={prod.coupon_code || ""}
                    onBlur={(e) => handleCouponUpdate(prod.id, e.target.value)}
                    className="font-mono uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Expiry Date</Label>
                  <Input
                    type="date"
                    defaultValue={prod.coupon_expiry ? prod.coupon_expiry.split("T")[0] : ""}
                    onBlur={(e) => handleExpiryUpdate(prod.id, e.target.value ? new Date(e.target.value).toISOString() : "")}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Products without coupons */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          Products without coupons ({withoutCoupons.length})
        </h3>
        {withoutCoupons.map((prod) => (
          <div key={prod.id} className="card-soft p-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate">{prod.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{prod.store || "—"}</p>
            </div>
            <Input
              placeholder="Add coupon code"
              className="w-36 h-8 text-xs font-mono uppercase"
              onBlur={(e) => {
                if (e.target.value.trim()) handleCouponUpdate(prod.id, e.target.value.trim());
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCoupons;
