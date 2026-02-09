import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

const AdminSettings = () => {
  const [maxAlerts, setMaxAlerts] = useState(5);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    const { data } = await supabase
      .from("admin_settings")
      .select("key, value");

    if (data) {
      for (const row of data) {
        if (row.key === "max_alerts_per_user") {
          setMaxAlerts(typeof row.value === "number" ? row.value : parseInt(String(row.value)) || 5);
        }
        if (row.key === "alerts_enabled") {
          setAlertsEnabled(row.value === true || row.value === "true");
        }
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);

    const updates = [
      supabase
        .from("admin_settings")
        .upsert({ key: "max_alerts_per_user", value: maxAlerts as any }),
      supabase
        .from("admin_settings")
        .upsert({ key: "alerts_enabled", value: alertsEnabled as any }),
    ];

    const results = await Promise.all(updates);
    const hasError = results.some((r) => r.error);

    if (hasError) {
      toast.error("Failed to save some settings");
    } else {
      toast.success("Settings saved");
    }
    setSaving(false);
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
        <h2 className="text-base font-semibold text-foreground mb-1">Global Settings</h2>
        <p className="text-sm text-muted-foreground">
          Control price alerts and other app-wide behavior.
        </p>
      </div>

      <div className="card-soft p-5 space-y-6">
        {/* Alerts enabled */}
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Price Alerts</Label>
            <p className="text-xs text-muted-foreground mt-0.5">
              Enable or disable price alerts globally for all users.
            </p>
          </div>
          <Switch
            checked={alertsEnabled}
            onCheckedChange={setAlertsEnabled}
          />
        </div>

        {/* Max alerts */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Max Alerts Per User</Label>
          <p className="text-xs text-muted-foreground">
            Limits how many active price alerts each user can create.
          </p>
          <Input
            type="number"
            min={1}
            max={50}
            value={maxAlerts}
            onChange={(e) => setMaxAlerts(parseInt(e.target.value) || 1)}
            className="w-24"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
