import { useState, useEffect, useCallback } from "react";

type PermissionState = "default" | "granted" | "denied" | "unsupported";

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  data?: Record<string, unknown>;
}

export const useNotifications = () => {
  const [permission, setPermission] = useState<PermissionState>("default");
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setPermission("unsupported");
      return;
    }

    setPermission(Notification.permission as PermissionState);

    // Register service worker
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => setRegistration(reg))
      .catch((err) => console.warn("SW registration failed:", err));
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!("Notification" in window)) return false;

    const result = await Notification.requestPermission();
    setPermission(result as PermissionState);
    return result === "granted";
  }, []);

  const sendNotification = useCallback(
    (payload: NotificationPayload) => {
      if (permission !== "granted") return;

      if (registration?.active) {
        registration.active.postMessage({
          type: "SHOW_NOTIFICATION",
          payload,
        });
      } else {
        // Fallback to basic Notification API
        new Notification(payload.title, {
          body: payload.body,
          icon: payload.icon || "/favicon.ico",
        });
      }
    },
    [permission, registration]
  );

  return {
    permission,
    isSupported: permission !== "unsupported",
    isGranted: permission === "granted",
    isDenied: permission === "denied",
    requestPermission,
    sendNotification,
  };
};
