import { motion } from "framer-motion";
import { User, Settings, Heart, Bell, ChevronRight, Info, LogOut, Sun, Moon, Monitor, Eye } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import LoginPromptModal from "@/components/LoginPromptModal";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useLoginPrompt } from "@/hooks/useLoginPrompt";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const Profile = () => {
  const { user, profile, isGuest, signInWithGoogle, signOut } = useAuth();
  const { showPrompt, promptMessage, promptForProfile, closePrompt } = useLoginPrompt();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Soft prompt when guest opens profile
  useEffect(() => {
    if (isGuest) {
      promptForProfile();
    }
  }, [isGuest, promptForProfile]);

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
            {isGuest ? (
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
            ) : (
              <Avatar className="w-16 h-16">
                <AvatarImage src={profile?.avatar_url || ""} alt={profile?.display_name || "User"} />
                <AvatarFallback className="bg-secondary text-foreground text-lg font-semibold">
                  {(profile?.display_name || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {isGuest ? "Guest User" : profile?.display_name || "ShopXAI User"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isGuest ? "Sign in to sync across devices" : profile?.email || "Smart shopping starts here"}
              </p>
            </div>
          </div>

          {/* Sign in / Sign out button */}
          {isGuest ? (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 bg-foreground text-background font-medium py-3.5 px-6 rounded-xl transition-opacity hover:opacity-90"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign in with Google
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={signOut}
              className="w-full flex items-center justify-center gap-2 border border-border text-foreground font-medium py-3 px-6 rounded-xl transition-colors hover:bg-secondary"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </motion.button>
          )}
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

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card-soft p-5 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Sun className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-semibold text-foreground">Appearance</h2>
          </div>
          {mounted && (
            <div className="grid grid-cols-4 gap-2 p-1 bg-secondary rounded-xl">
              {[
                { value: "system", label: "System", icon: Monitor },
                { value: "light", label: "Light", icon: Sun },
                { value: "dark", label: "Dark", icon: Moon },
                { value: "night", label: "Night", icon: Eye },
              ].map((option) => {
                const Icon = option.icon;
                const isActive = theme === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      if (option.value === "night") {
                        document.documentElement.classList.remove("dark");
                        document.documentElement.classList.add("night");
                        setTheme("night");
                      } else {
                        document.documentElement.classList.remove("night");
                        setTheme(option.value);
                      }
                    }}
                    className={`flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>


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
            ShopXAI helps you find better prices across Amazon, Flipkart & 100+ stores. We track price history, alert you to drops, and help you make smarter shopping decisions.
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

      <LoginPromptModal
        open={showPrompt}
        onClose={closePrompt}
        message={promptMessage}
      />

      <BottomNav />
    </div>
  );
};

export default Profile;
