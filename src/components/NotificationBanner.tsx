import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";
import { useState } from "react";
import { useNotifications } from "@/hooks/useNotifications";

const NotificationBanner = () => {
  const { permission, isSupported, requestPermission } = useNotifications();
  const [dismissed, setDismissed] = useState(false);

  if (!isSupported || permission !== "default" || dismissed) return null;

  const handleEnable = async () => {
    await requestPermission();
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, height: 0 }}
        animate={{ opacity: 1, y: 0, height: "auto" }}
        exit={{ opacity: 0, y: -10, height: 0 }}
        className="bg-warning/10 border border-warning/20 rounded-xl p-3 flex items-center gap-3"
      >
        <Bell className="w-5 h-5 text-warning flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">Enable notifications</p>
          <p className="text-xs text-muted-foreground">Get alerts when prices drop to your target</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleEnable}
            className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-lg"
          >
            Enable
          </motion.button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationBanner;
