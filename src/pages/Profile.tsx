import { motion } from "framer-motion";
import { User, Settings, Info, Heart, Bell, ExternalLink, ChevronRight } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { Separator } from "@/components/ui/separator";

const Profile = () => {
  const menuItems = [
    { icon: Heart, label: "Saved Products", count: 2 },
    { icon: Bell, label: "Active Alerts", count: 2 },
    { icon: Settings, label: "Preferences" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto px-4 pt-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">ShopXAI User</h1>
              <p className="text-sm text-muted-foreground">Smart shopping starts here</p>
            </div>
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-soft overflow-hidden mb-6"
        >
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.label}>
                <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    <span className="font-medium text-foreground">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.count !== undefined && (
                      <span className="text-sm text-muted-foreground">{item.count}</span>
                    )}
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </button>
                {index < menuItems.length - 1 && <Separator />}
              </div>
            );
          })}
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-soft p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-semibold text-foreground">About ShopXAI</h2>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            ShopXAI helps you find better prices across Amazon and Flipkart. We track price history, alert you to drops, and help you make smarter shopping decisions.
          </p>
          
        </motion.div>

        {/* Version */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-xs text-muted-foreground mt-6"
        >
          ShopXAI v1.0.0
        </motion.p>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
