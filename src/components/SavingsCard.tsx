import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const SavingsCard = () => {
  // This would come from real tracking in production
  const totalSaved = 3450;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="card-soft p-5 text-center"
    >
      <div className="w-11 h-11 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-3">
        <Heart className="w-5 h-5 text-destructive" />
      </div>
      <p className="text-2xl font-bold text-foreground mb-1">
        ₹{totalSaved.toLocaleString()}
      </p>
      <p className="text-sm text-muted-foreground">
        You saved using ShopXAI
      </p>
    </motion.div>
  );
};

export default SavingsCard;
