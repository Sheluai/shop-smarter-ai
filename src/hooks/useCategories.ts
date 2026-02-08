import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Category {
  category_id: string;
  category_name: string;
  priority_order: number;
  icon_optional?: string;
}

const CACHE_KEY = "shopxai_categories";
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

const DEFAULT_CATEGORIES: Category[] = [
  { category_id: "mobiles", category_name: "Mobiles", priority_order: 1 },
  { category_id: "electronics", category_name: "Electronics", priority_order: 2 },
  { category_id: "fashion", category_name: "Fashion", priority_order: 3 },
  { category_id: "home", category_name: "Home", priority_order: 4 },
  { category_id: "appliances", category_name: "Appliances", priority_order: 5 },
  { category_id: "beauty", category_name: "Beauty", priority_order: 6 },
  { category_id: "grocery", category_name: "Grocery", priority_order: 7 },
  { category_id: "deals", category_name: "Deals", priority_order: 8 },
];

function readCache(): { data: Category[]; timestamp: number } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeCache(data: Category[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // storage full — ignore
  }
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(() => {
    const cached = readCache();
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    return DEFAULT_CATEGORIES;
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      // API-ready: when a categories table exists, uncomment:
      // const { data, error } = await supabase
      //   .from("categories")
      //   .select("category_id, category_name, priority_order, icon_optional")
      //   .order("priority_order", { ascending: true });
      // if (!error && data && data.length > 0) {
      //   setCategories(data);
      //   writeCache(data);
      //   return;
      // }

      // Fallback to defaults
      setCategories(DEFAULT_CATEGORIES);
      writeCache(DEFAULT_CATEGORIES);
    } catch {
      // Failsafe: always show fallback
      setCategories(DEFAULT_CATEGORIES);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Silent background refresh
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, isLoading, refetch: fetchCategories };
}
