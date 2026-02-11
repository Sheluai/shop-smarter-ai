import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface PostLoginAnimationProps {
  onComplete: () => void;
}

const PostLoginAnimation = ({ onComplete }: PostLoginAnimationProps) => {
  const { profile } = useAuth();
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("reveal"), 900);
    const t2 = setTimeout(() => setPhase("done"), 1800);
    const t3 = setTimeout(() => {
      if (navigator.vibrate) navigator.vibrate(8);
      onComplete();
    }, 2500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center px-6"
    >
      {/* Avatar area */}
      <div className="relative w-20 h-20 mb-6">
        {/* Shimmer placeholder */}
        <AnimatePresence>
          {phase === "loading" && (
            <motion.div
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 rounded-full overflow-hidden"
            >
              <div className="w-full h-full bg-secondary rounded-full animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-foreground/5 to-transparent animate-[shimmer_1.5s_infinite]" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Real avatar */}
        <AnimatePresence>
          {(phase === "reveal" || phase === "done") && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt=""
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-2xl font-semibold text-foreground">
                    {(profile?.display_name || "U").charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User info */}
      <AnimatePresence>
        {(phase === "reveal" || phase === "done") && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
            className="text-center"
          >
            <h2 className="text-lg font-semibold text-foreground">
              {profile?.display_name || "Welcome!"}
            </h2>
            {profile?.email && (
              <p className="text-sm text-muted-foreground mt-1">{profile.email}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading text / Success */}
      <div className="mt-8">
        <AnimatePresence mode="wait">
          {phase === "loading" && (
            <motion.p
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-muted-foreground"
            >
              Setting up your ShopXAI profile…
            </motion.p>
          )}

          {phase === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-full bg-green-500/15 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-sm font-medium text-foreground">You're all set!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PostLoginAnimation;
