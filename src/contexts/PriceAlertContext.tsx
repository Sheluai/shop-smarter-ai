import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from "react";
import { useNotifications } from "@/hooks/useNotifications";

export interface PriceAlert {
  productId: string;
  targetPrice: number;
  currentPrice: number;
  productTitle: string;
  platform: string;
  image: string;
  affiliateUrl: string;
  status: "active" | "triggered";
  createdAt: number;
}

interface PriceAlertContextType {
  alerts: PriceAlert[];
  addAlert: (alert: PriceAlert) => void;
  removeAlert: (productId: string) => void;
  updateAlertPrice: (productId: string, newTargetPrice: number) => void;
  getAlert: (productId: string) => PriceAlert | undefined;
  hasAlert: (productId: string) => boolean;
  checkAlertTriggered: (productId: string, currentPrice: number) => boolean;
  notificationPermission: string;
  requestNotificationPermission: () => Promise<boolean>;
}

const PriceAlertContext = createContext<PriceAlertContextType | undefined>(undefined);

export const PriceAlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { permission, requestPermission, sendNotification } = useNotifications();
  const notifiedRef = useRef<Set<string>>(new Set());

  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      productId: "1",
      targetPrice: 17999,
      currentPrice: 18990,
      productTitle: "Apple AirPods Pro (2nd Gen) with MagSafe Charging Case",
      platform: "Amazon",
      image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=100&h=100&fit=crop",
      affiliateUrl: "https://amazon.in",
      status: "active",
      createdAt: Date.now() - 86400000,
    },
    {
      productId: "3",
      targetPrice: 27000,
      currentPrice: 28990,
      productTitle: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
      platform: "Amazon",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
      affiliateUrl: "https://amazon.in",
      status: "triggered",
      createdAt: Date.now() - 172800000,
    },
  ]);

  const triggerNotification = useCallback(
    (alert: PriceAlert) => {
      if (notifiedRef.current.has(alert.productId)) return;
      notifiedRef.current.add(alert.productId);

      sendNotification({
        title: "🔥 Price Drop Alert!",
        body: `${alert.productTitle} is now ₹${alert.currentPrice.toLocaleString()}. Tap to view deal.`,
        icon: alert.image,
        data: { productId: alert.productId },
      });
    },
    [sendNotification]
  );

  const addAlert = useCallback(
    (alert: PriceAlert) => {
      setAlerts((prev) => {
        const filtered = prev.filter((a) => a.productId !== alert.productId);
        return [...filtered, alert];
      });

      // Send notification immediately if already triggered
      if (alert.status === "triggered") {
        triggerNotification(alert);
      }
    },
    [triggerNotification]
  );

  const removeAlert = useCallback((productId: string) => {
    setAlerts((prev) => prev.filter((a) => a.productId !== productId));
    notifiedRef.current.delete(productId);
  }, []);

  const updateAlertPrice = useCallback((productId: string, newTargetPrice: number) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.productId === productId ? { ...a, targetPrice: newTargetPrice, status: "active" as const } : a
      )
    );
    notifiedRef.current.delete(productId);
  }, []);

  const getAlert = useCallback(
    (productId: string) => alerts.find((a) => a.productId === productId),
    [alerts]
  );

  const hasAlert = useCallback(
    (productId: string) => alerts.some((a) => a.productId === productId),
    [alerts]
  );

  const checkAlertTriggered = useCallback(
    (productId: string, currentPrice: number) => {
      const alert = alerts.find((a) => a.productId === productId);
      if (alert && currentPrice <= alert.targetPrice && alert.status === "active") {
        // Trigger the alert and send notification
        setAlerts((prev) =>
          prev.map((a) =>
            a.productId === productId ? { ...a, status: "triggered" as const, currentPrice } : a
          )
        );
        triggerNotification({ ...alert, currentPrice, status: "triggered" });
        return true;
      }
      return alert ? currentPrice <= alert.targetPrice : false;
    },
    [alerts, triggerNotification]
  );

  return (
    <PriceAlertContext.Provider
      value={{
        alerts,
        addAlert,
        removeAlert,
        updateAlertPrice,
        getAlert,
        hasAlert,
        checkAlertTriggered,
        notificationPermission: permission,
        requestNotificationPermission: requestPermission,
      }}
    >
      {children}
    </PriceAlertContext.Provider>
  );
};

export const usePriceAlerts = () => {
  const context = useContext(PriceAlertContext);
  if (!context) {
    throw new Error("usePriceAlerts must be used within a PriceAlertProvider");
  }
  return context;
};
