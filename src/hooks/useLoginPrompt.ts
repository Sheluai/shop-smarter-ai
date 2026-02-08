import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

const WISHLIST_LIMIT = 3;
const ALERTS_LIMIT = 2;

export const useLoginPrompt = () => {
  const { isGuest } = useAuth();
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptMessage, setPromptMessage] = useState("");

  const checkWishlistLimit = useCallback(
    (currentCount: number): boolean => {
      if (isGuest && currentCount >= WISHLIST_LIMIT) {
        setPromptMessage(
          "You've reached the guest limit for saved products. Sign in to save unlimited items across devices."
        );
        setShowPrompt(true);
        return true;
      }
      return false;
    },
    [isGuest]
  );

  const checkAlertsLimit = useCallback(
    (currentCount: number): boolean => {
      if (isGuest && currentCount >= ALERTS_LIMIT) {
        setPromptMessage(
          "You've reached the guest limit for price alerts. Sign in to set unlimited alerts and never miss a deal."
        );
        setShowPrompt(true);
        return true;
      }
      return false;
    },
    [isGuest]
  );

  const promptForProfile = useCallback(() => {
    if (isGuest) {
      setPromptMessage(
        "Sign in to save your alerts and wishlist across devices."
      );
      setShowPrompt(true);
    }
  }, [isGuest]);

  const closePrompt = useCallback(() => {
    setShowPrompt(false);
    setPromptMessage("");
  }, []);

  return {
    showPrompt,
    promptMessage,
    checkWishlistLimit,
    checkAlertsLimit,
    promptForProfile,
    closePrompt,
    WISHLIST_LIMIT,
    ALERTS_LIMIT,
  };
};
