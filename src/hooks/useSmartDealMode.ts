import { useState, useCallback, useMemo } from "react";
import { type Product } from "@/hooks/useProducts";
import { calculateDealScore, type DealScoreResult } from "@/lib/dealScore";

const STORAGE_KEY = "shopxai_smart_deal_mode";

export interface ScoredProduct extends Product {
  dealScore: DealScoreResult;
}

export function useSmartDealMode() {
  const [enabled, setEnabled] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored !== null ? stored === "true" : true;
    } catch {
      return true;
    }
  });

  const toggle = useCallback((value: boolean) => {
    setEnabled(value);
    try {
      localStorage.setItem(STORAGE_KEY, String(value));
    } catch {
      // ignore
    }
  }, []);

  const scoreProducts = useCallback((products: Product[]): ScoredProduct[] => {
    return products.map((p) => ({
      ...p,
      dealScore: calculateDealScore({
        currentPrice: p.current_price,
        originalPrice: p.original_price,
        priceDrop: p.price_drop,
        categoryId: p.category_id,
        isFeatured: p.is_featured,
        isTodaysBestDrop: p.is_todays_best_drop,
        aiStatus: p.ai_status,
      }),
    }));
  }, []);

  const filterAndSort = useCallback(
    (products: Product[]): ScoredProduct[] => {
      const scored = scoreProducts(products);
      if (!enabled) return scored;
      return scored
        .filter((p) => p.dealScore.score >= 60)
        .sort((a, b) => b.dealScore.score - a.dealScore.score);
    },
    [enabled, scoreProducts]
  );

  return { enabled, toggle, scoreProducts, filterAndSort };
}
