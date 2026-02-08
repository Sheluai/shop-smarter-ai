import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const budgets = [
  { label: "Under ₹999", max: 999 },
  { label: "Under ₹4,999", max: 4999 },
  { label: "Under ₹9,999", max: 9999 },
];

const DealsUnderBudget = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-3">
        🎯 Deals Under Budget
      </h2>

      <div className="flex gap-2.5">
        {budgets.map((budget, index) => (
          <motion.button
            key={budget.max}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.35 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/?budget=${budget.max}`)}
            className="flex-1 py-3.5 px-3 rounded-xl bg-foreground text-background text-sm font-semibold text-center transition-opacity hover:opacity-90"
          >
            {budget.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default DealsUnderBudget;
