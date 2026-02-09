import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";

interface CategoryRow {
  category_id: string;
  category_name: string;
  priority_order: number;
  icon_optional: string | null;
  is_enabled: boolean;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newId, setNewId] = useState("");
  const [newName, setNewName] = useState("");

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("priority_order", { ascending: true });

    if (error) {
      toast.error("Failed to load categories");
      return;
    }
    setCategories(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAdd = async () => {
    const id = newId.trim().toLowerCase().replace(/\s+/g, "-");
    const name = newName.trim();
    if (!id || !name) {
      toast.error("Category ID and name are required");
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("categories").insert({
      category_id: id,
      category_name: name,
      priority_order: categories.length + 1,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Category added");
      setNewId("");
      setNewName("");
      fetchCategories();
    }
    setSaving(false);
  };

  const handleToggle = async (catId: string, enabled: boolean) => {
    const { error } = await supabase
      .from("categories")
      .update({ is_enabled: enabled })
      .eq("category_id", catId);

    if (error) toast.error(error.message);
    else {
      setCategories((prev) =>
        prev.map((c) => (c.category_id === catId ? { ...c, is_enabled: enabled } : c))
      );
    }
  };

  const handleDelete = async (catId: string) => {
    if (!confirm(`Delete category "${catId}"? This cannot be undone.`)) return;

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("category_id", catId);

    if (error) toast.error(error.message);
    else {
      toast.success("Category deleted");
      fetchCategories();
    }
  };

  const handleNameChange = async (catId: string, name: string) => {
    const { error } = await supabase
      .from("categories")
      .update({ category_name: name })
      .eq("category_id", catId);

    if (error) toast.error(error.message);
  };

  const handleOrderChange = async (catId: string, order: number) => {
    const { error } = await supabase
      .from("categories")
      .update({ priority_order: order })
      .eq("category_id", catId);

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
        <h2 className="text-base font-semibold text-foreground mb-1">Category Management</h2>
        <p className="text-sm text-muted-foreground">
          Create, reorder, and toggle categories. Changes reflect instantly on the Home screen.
        </p>
      </div>

      {/* Add new category */}
      <div className="card-soft p-4 space-y-3">
        <h3 className="text-sm font-medium text-foreground">Add Category</h3>
        <div className="flex gap-2">
          <Input
            placeholder="ID (e.g. gaming)"
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Name (e.g. Gaming)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1"
          />
          <button
            onClick={handleAdd}
            disabled={saving}
            className="btn-primary flex items-center gap-1.5 text-sm px-4"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add
          </button>
        </div>
      </div>

      {/* Category list */}
      <div className="space-y-2">
        {categories.map((cat) => (
          <div
            key={cat.category_id}
            className="card-soft p-4 flex items-center gap-3"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />

            <div className="flex-1 grid grid-cols-3 gap-3 items-center">
              <span className="text-xs font-mono text-muted-foreground truncate">
                {cat.category_id}
              </span>
              <Input
                defaultValue={cat.category_name}
                onBlur={(e) => handleNameChange(cat.category_id, e.target.value)}
                className="h-8 text-sm"
              />
              <Input
                type="number"
                defaultValue={cat.priority_order}
                onBlur={(e) => handleOrderChange(cat.category_id, parseInt(e.target.value) || 0)}
                className="h-8 text-sm w-20"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch
                  checked={cat.is_enabled}
                  onCheckedChange={(checked) => handleToggle(cat.category_id, checked)}
                />
                <Label className="text-xs text-muted-foreground">
                  {cat.is_enabled ? "Active" : "Off"}
                </Label>
              </div>

              <button
                onClick={() => handleDelete(cat.category_id)}
                className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
