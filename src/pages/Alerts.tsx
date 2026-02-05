import { motion } from "framer-motion";
import { Bell, TrendingDown, Check } from "lucide-react";
import BottomNav from "@/components/BottomNav";

const alerts = [
  {
    id: "1",
    title: "Apple AirPods Pro (2nd Gen)",
    targetPrice: 17999,
    currentPrice: 18990,
    platform: "Amazon",
    image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=100&h=100&fit=crop",
    status: "watching",
  },
  {
    id: "2",
    title: "Sony WH-1000XM5 Headphones",
    targetPrice: 25000,
    currentPrice: 28990,
    platform: "Amazon",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
    status: "triggered",
  },
];

const Alerts = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto px-4 pt-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-6 h-6 text-warning" />
            <h1 className="text-2xl font-semibold text-foreground">Price Alerts</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Get notified when prices drop
          </p>
        </motion.div>

        {/* Alerts List */}
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-soft p-4"
            >
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-secondary rounded-xl overflow-hidden flex-shrink-0">
                  <img
                    src={alert.image}
                    alt={alert.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="badge-platform">{alert.platform}</span>
                    {alert.status === "triggered" ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-success">
                        <Check className="w-3 h-3" />
                        Price dropped!
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendingDown className="w-3 h-3" />
                        Watching
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-medium text-foreground text-sm mb-2 line-clamp-1">
                    {alert.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground">
                      Current: ₹{alert.currentPrice.toLocaleString()}
                    </span>
                    <span className="text-foreground font-medium">
                      Alert: ₹{alert.targetPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-secondary/50 rounded-xl p-4"
        >
          <p className="text-sm text-muted-foreground text-center">
            We'll send you a notification when the price drops to your target price
          </p>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Alerts;
