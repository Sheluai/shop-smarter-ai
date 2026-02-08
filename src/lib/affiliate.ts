/**
 * Affiliate link utilities for ShopXAI.
 * All external product actions must route through these helpers.
 */

const AFFILIATE_TAGS: Record<string, string> = {
  amazon: "shopxai-21",
  flipkart: "shopxai",
};

/**
 * Appends the affiliate tag to a URL based on the platform.
 */
export const buildAffiliateUrl = (
  url: string,
  platform: "Amazon" | "Flipkart" | string
): string => {
  try {
    const parsed = new URL(url);
    const key = platform.toLowerCase();
    const tag = AFFILIATE_TAGS[key];
    if (!tag) return url;

    if (key === "amazon") {
      parsed.searchParams.set("tag", tag);
    } else if (key === "flipkart") {
      parsed.searchParams.set("affid", tag);
    }
    return parsed.toString();
  } catch {
    return url;
  }
};

/**
 * Opens an affiliate link. Tries deep-link intent first (mobile),
 * then falls back to opening in a new tab.
 */
export const openAffiliateLink = (
  affiliateUrl: string | undefined,
  platform: "Amazon" | "Flipkart" | string
): boolean => {
  if (!affiliateUrl) return false;

  const taggedUrl = buildAffiliateUrl(affiliateUrl, platform);

  // Mark product as viewed
  try {
    const viewed: string[] = JSON.parse(localStorage.getItem("shopxai_viewed") || "[]");
    if (!viewed.includes(taggedUrl)) {
      viewed.push(taggedUrl);
      localStorage.setItem("shopxai_viewed", JSON.stringify(viewed.slice(-50)));
    }
  } catch {
    // Ignore storage errors
  }

  window.open(taggedUrl, "_blank", "noopener,noreferrer");
  return true;
};

/**
 * Returns true if a valid affiliate URL exists.
 */
export const hasValidAffiliateUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
