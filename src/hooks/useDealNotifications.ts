import { useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";

const POLL_KEY = "shopxai_last_notif_check";
const POLL_INTERVAL = 5 * 60 * 1000; // 5 min

/**
 * Polls deal_notifications for unseen entries and dispatches
 * browser push notifications via the service worker.
 */
export function useDealNotifications() {
  const { user, isGuest } = useAuth();
  const { isGranted, sendNotification } = useNotifications();

  const checkNotifications = useCallback(async () => {
    if (isGuest || !user?.id || !isGranted) return;

    const lastCheck = localStorage.getItem(POLL_KEY) || new Date(0).toISOString();

    const { data: notifications } = await supabase
      .from("deal_notifications")
      .select("id, notification_title, notification_body, deep_link, product_id, sent_at")
      .eq("user_id", user.id)
      .gt("sent_at", lastCheck)
      .order("sent_at", { ascending: false })
      .limit(3);

    if (notifications && notifications.length > 0) {
      for (const n of notifications) {
        sendNotification({
          title: n.notification_title,
          body: n.notification_body,
          data: { productId: n.product_id, deepLink: n.deep_link },
        });
      }
      localStorage.setItem(POLL_KEY, new Date().toISOString());
    }
  }, [user, isGuest, isGranted, sendNotification]);

  useEffect(() => {
    if (isGuest || !user?.id || !isGranted) return;

    // Check immediately on mount
    checkNotifications();

    // Then poll periodically
    const interval = setInterval(checkNotifications, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [checkNotifications, isGuest, user?.id, isGranted]);
}
