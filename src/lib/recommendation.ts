export type RecommendationType = "buy" | "wait" | "overpriced";

export type ProductCategory = 
  | "mobiles" 
  | "electronics" 
  | "fashion" 
  | "beauty" 
  | "home" 
  | "grocery" 
  | "deals";

export interface PriceHistory {
  lowest90Days: number;
  lowest6Months: number;
  preSalePrice?: number; // Price before current sale started
}

export interface RecommendationResult {
  type: RecommendationType;
  reason: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export function getRecommendation(
  category: ProductCategory,
  currentPrice: number,
  originalPrice: number,
  priceHistory: PriceHistory
): RecommendationResult {
  const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  const nearLowest90 = currentPrice <= priceHistory.lowest90Days * 1.08; // Within 8%
  const nearLowest6Months = currentPrice <= priceHistory.lowest6Months * 1.05;
  const priceIncreasedBeforeSale = priceHistory.preSalePrice && currentPrice > priceHistory.preSalePrice;

  switch (category) {
    case "mobiles":
      return getMobilesRecommendation(discount, nearLowest90, priceIncreasedBeforeSale);
    case "electronics":
      return getElectronicsRecommendation(discount, nearLowest6Months);
    case "fashion":
      return getFashionRecommendation(discount);
    case "beauty":
      return getBeautyRecommendation(discount);
    case "home":
      return getHomeRecommendation(discount, nearLowest90);
    case "grocery":
    case "deals":
    default:
      return getDefaultRecommendation(discount);
  }
}

function getMobilesRecommendation(
  discount: number, 
  nearLowest90: boolean, 
  priceIncreasedBeforeSale?: boolean
): RecommendationResult {
  if (priceIncreasedBeforeSale) {
    return {
      type: "overpriced",
      reason: "Price was lower before this sale",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    };
  }
  if (nearLowest90 || discount >= 5) {
    return {
      type: "buy",
      reason: "Near lowest price in 3 months",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    };
  }
  return {
    type: "wait",
    reason: "Price may drop during upcoming sale",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
  };
}

function getElectronicsRecommendation(
  discount: number, 
  nearLowest6Months: boolean
): RecommendationResult {
  if (discount >= 15 || nearLowest6Months) {
    return {
      type: "buy",
      reason: "Strong discount for this category",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    };
  }
  if (discount >= 8) {
    return {
      type: "wait",
      reason: "Better deals likely during big sales",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    };
  }
  return {
    type: "overpriced",
    reason: "Low discount for electronics",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  };
}

function getFashionRecommendation(discount: number): RecommendationResult {
  if (discount >= 40) {
    return {
      type: "buy",
      reason: "Good fashion deal",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    };
  }
  if (discount >= 25) {
    return {
      type: "wait",
      reason: "Better coupons may apply",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    };
  }
  return {
    type: "overpriced",
    reason: "Fashion items often go on deeper sale",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  };
}

function getBeautyRecommendation(discount: number): RecommendationResult {
  if (discount >= 30) {
    return {
      type: "buy",
      reason: "High margin category deal",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    };
  }
  if (discount >= 15) {
    return {
      type: "wait",
      reason: "Prices fluctuate frequently",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    };
  }
  return {
    type: "overpriced",
    reason: "Not a strong beauty deal",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  };
}

function getHomeRecommendation(
  discount: number, 
  nearLowest90: boolean
): RecommendationResult {
  if (discount >= 20 || nearLowest90) {
    return {
      type: "buy",
      reason: "Good value for home category",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    };
  }
  if (discount >= 10) {
    return {
      type: "wait",
      reason: "Prices drop during festive sales",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    };
  }
  return {
    type: "overpriced",
    reason: "Low discount for this category",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  };
}

function getDefaultRecommendation(discount: number): RecommendationResult {
  if (discount >= 20) {
    return {
      type: "buy",
      reason: "Good discount available",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    };
  }
  if (discount >= 10) {
    return {
      type: "wait",
      reason: "Prices may drop further",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    };
  }
  return {
    type: "overpriced",
    reason: "Consider waiting for a sale",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  };
}
