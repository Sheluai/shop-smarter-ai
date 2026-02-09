import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminConfig {
  maxAlertsPerUser: number;
  alertsEnabled: boolean;
}

const CACHE_KEY = "shopxai_admin_config";
const CACHE_TTL = 1000 * 60 * 15; // 15 minutes

const DEFAULT_CONFIG: AdminConfig = {
  maxAlertsPerUser: 5,
  alertsEnabled: true,
};

function readCache(): { data: AdminConfig; timestamp: number } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeCache(data: AdminConfig) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // ignore
  }
}

export function useAdminSettings() {
  const [config, setConfig] = useState<AdminConfig>(() => {
    const cached = readCache();
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.data;
    return DEFAULT_CONFIG;
  });

  const fetchSettings = useCallback(async () => {
    try {
      const { data } = await supabase.from("admin_settings").select("key, value");

      if (data && data.length > 0) {
        const newConfig = { ...DEFAULT_CONFIG };
        for (const row of data) {
          if (row.key === "max_alerts_per_user") {
            newConfig.maxAlertsPerUser =
              typeof row.value === "number" ? row.value : parseInt(String(row.value)) || 5;
          }
          if (row.key === "alerts_enabled") {
            newConfig.alertsEnabled = row.value === true || row.value === "true";
          }
        }
        setConfig(newConfig);
        writeCache(newConfig);
      }
    } catch {
      // Use cached/default config
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return config;
}
