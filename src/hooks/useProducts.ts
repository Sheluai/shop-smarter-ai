import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Product {
  id: string;
  name: string;
  image_url: string | null;
  category_id: string | null;
  current_price: number;
  original_price: number | null;
  price_drop: number | null;
  is_featured: boolean;
  is_todays_best_drop: boolean;
  ai_status: string | null;
}

const CACHE_KEY = "shopxai_products";
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

function readCache(): { data: Product[]; timestamp: number } | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeCache(data: Product[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // ignore
  }
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(() => {
    const cached = readCache();
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.data;
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select(
          "id, name, image_url, category_id, current_price, original_price, price_drop, is_featured, is_todays_best_drop, ai_status"
        )
        .order("created_at", { ascending: false });

      if (!error && data) {
        setProducts(data);
        writeCache(data);
      }
    } catch {
      // Keep cached data
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, isLoading, refetch: fetchProducts };
}
