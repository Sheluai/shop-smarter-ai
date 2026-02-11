/**
 * Deal Score Engine (0–100)
 *
 * Factors:
 *  1. Price drop % from original  (0–35 pts)
 *  2. Proximity to lowest price   (0–25 pts)
 *  3. Store trust level           (0–15 pts)
 *  4. Product demand / popularity (0–15 pts)
 *  5. Available offers / cashback (0–10 pts)
 */

export interface DealScoreInput {
  currentPrice: number;
  originalPrice: number | null;
  priceDrop: number | null;
  categoryId: string | null;
  isFeatured: boolean;
  isTodaysBestDrop: boolean;
  aiStatus: string | null;
}

export type DealLabel = "Best Time to Buy" | "Good Deal" | "Wait for Better Price" | "Avoid Now";

export interface DealScoreResult {
  score: number;
  label: DealLabel;
  color: string;
  bgColor: string;
  icon: "↑" | "→" | "↓";
}

// Store trust multipliers (normalized 0–1)
const STORE_TRUST: Record<string, number> = {
  amazon: 1.0,
  flipkart: 0.9,
  myntra: 0.8,
  ajio: 0.75,
  default: 0.7,
};

export function calculateDealScore(input: DealScoreInput): DealScoreResult {
  const { currentPrice, originalPrice, priceDrop, categoryId, isFeatured, isTodaysBestDrop, aiStatus } = input;

  const effectiveOriginal = originalPrice && originalPrice > currentPrice ? originalPrice : currentPrice;

  // 1. Price drop percentage score (0–35)
  const dropPercent = effectiveOriginal > 0
    ? ((effectiveOriginal - currentPrice) / effectiveOriginal) * 100
    : 0;
  const dropScore = Math.min(35, (dropPercent / 50) * 35);

  // 2. Proximity to lowest / price drop signal (0–25)
  let proximityScore = 0;
  if (priceDrop && priceDrop > 0) {
    const dropRatio = priceDrop / currentPrice;
    proximityScore = Math.min(25, dropRatio * 250);
  } else if (dropPercent > 0) {
    proximityScore = Math.min(15, dropPercent * 0.5);
  }

  // 3. Store trust (0–15) — derived from category heuristics
  const trustKey = categoryId === "fashion" ? "myntra" : "amazon";
  const trustScore = (STORE_TRUST[trustKey] ?? STORE_TRUST.default) * 15;

  // 4. Demand / popularity (0–15)
  let demandScore = 5; // baseline
  if (isFeatured) demandScore += 5;
  if (isTodaysBestDrop) demandScore += 5;

  // 5. AI status bonus / offers (0–10)
  let offerScore = 3; // baseline for generic offers
  if (aiStatus === "buy") offerScore = 10;
  else if (aiStatus === "wait") offerScore = 4;
  else if (aiStatus === "overpriced") offerScore = 0;

  // Category-specific adjustments
  const categoryBonus = getCategoryBonus(categoryId, dropPercent);

  const raw = dropScore + proximityScore + trustScore + demandScore + offerScore + categoryBonus;
  const score = Math.round(Math.max(0, Math.min(100, raw)));

  return {
    score,
    ...getLabel(score),
  };
}

function getCategoryBonus(categoryId: string | null, dropPercent: number): number {
  switch (categoryId) {
    case "fashion":
      // Fashion has inflated MRPs, require higher discounts
      return dropPercent >= 40 ? 5 : dropPercent >= 25 ? 0 : -5;
    case "electronics":
    case "mobiles":
      // Electronics rarely have deep discounts, reward smaller ones
      return dropPercent >= 10 ? 5 : 0;
    case "beauty":
      return dropPercent >= 30 ? 3 : 0;
    case "home":
      return dropPercent >= 20 ? 3 : 0;
    default:
      return 0;
  }
}

function getLabel(score: number): Omit<DealScoreResult, "score"> {
  if (score >= 80) {
    return {
      label: "Best Time to Buy",
      color: "text-success",
      bgColor: "bg-success/10",
      icon: "↑",
    };
  }
  if (score >= 60) {
    return {
      label: "Good Deal",
      color: "text-primary",
      bgColor: "bg-primary/10",
      icon: "↑",
    };
  }
  if (score >= 40) {
    return {
      label: "Wait for Better Price",
      color: "text-warning",
      bgColor: "bg-warning/10",
      icon: "→",
    };
  }
  return {
    label: "Avoid Now",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    icon: "↓",
  };
}
