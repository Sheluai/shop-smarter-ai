import { NavLink, useLocation } from "react-router-dom";
import { Home, Heart, Bell, User } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/wishlist", icon: Heart, label: "Wishlist" },
  { path: "/alerts", icon: Bell, label: "Alerts" },
  { path: "/profile", icon: User, label: "Profile" },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border/50">
      <div className="flex items-center justify-around max-w-lg mx-auto px-4 py-2 pb-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center gap-1 py-2 px-4"
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <Icon
                  className={`w-6 h-6 transition-colors duration-200 ${
                    isActive ? "text-foreground" : "text-muted-foreground"
                  }`}
                  strokeWidth={isActive ? 2.5 : 1.5}
                />
              </motion.div>
              {/* Show text only on active tab */}
              <motion.span
                initial={false}
                animate={{
                  opacity: isActive ? 1 : 0,
                  y: isActive ? 0 : 5,
                  height: isActive ? "auto" : 0,
                }}
                transition={{ duration: 0.2 }}
                className={`text-xs font-medium text-foreground overflow-hidden`}
              >
                {item.label}
              </motion.span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
