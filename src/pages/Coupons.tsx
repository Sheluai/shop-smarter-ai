import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Clock, Sparkles } from "lucide-react";
import BottomNav from "@/components/BottomNav";
import { toast } from "@/hooks/use-toast";

interface Coupon {
  id: string;
  store: string;
  storeColor: string;
  code: string;
  description: string;
  discount: string;
  expiresAt: number; // timestamp
  isVerified: boolean;
  isBest: boolean;
  autoApply: boolean;
  minOrder?: number;
}

const mockCoupons: Coupon[] = [
  {
    id: "1",
    store: "Amazon",
    storeColor: "30 90% 50%",
    code: "SAVE500",
    description: "₹500 off on Electronics",
    discount: "₹500 off",
    expiresAt: Date.now() + 2 * 24 * 60 * 60 * 1000,
    isVerified: true,
    isBest: true,
    autoApply: true,
    minOrder: 2999,
  },
  {
    id: "2",
    store: "Flipkart",
    storeColor: "220 85% 55%",
    code: "FLIP15",
    description: "15% off on Fashion",
    discount: "15% off",
    expiresAt: Date.now() + 5 * 24 * 60 * 60 * 1000,
    isVerified: true,
    isBest: false,
    autoApply: false,
    minOrder: 999,
  },
  {
    id: "3",
    store: "Amazon",
    storeColor: "30 90% 50%",
    code: "PRIME200",
    description: "₹200 off for Prime members",
    discount: "₹200 off",
    expiresAt: Date.now() + 1 * 24 * 60 * 60 * 1000,
    isVerified: true,
    isBest: false,
    autoApply: true,
  },
  {
    id: "4",
    store: "Flipkart",
    storeColor: "220 85% 55%",
    code: "SUPER10",
    description: "10% off on orders above ₹5000",
    discount: "10% off",
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    isVerified: true,
    isBest: false,
    autoApply: false,
    minOrder: 5000,
  },
];

const useCountdown = (expiresAt: number) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = expiresAt - Date.now();
      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h left`);
      } else {
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${mins}m left`);
      }
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return timeLeft;
};

const CouponCard = ({ coupon }: { coupon: Coupon }) => {
  const [copied, setCopied] = useState(false);
  const timeLeft = useCountdown(coupon.expiresAt);
  const isUrgent = coupon.expiresAt - Date.now() < 24 * 60 * 60 * 1000;

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    toast({ title: "Code copied!", description: `${coupon.code} is ready to paste` });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl overflow-hidden border ${
        coupon.isBest ? "border-success/30 bg-success/5" : "border-border bg-card"
      }`}
    >
      {/* Wallet-style notch */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-background rounded-r-full" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-background rounded-l-full" />

      <div className="px-6 py-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white"
              style={{ backgroundColor: `hsl(${coupon.storeColor})` }}
            >
              {coupon.store[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{coupon.store}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {coupon.isVerified && (
                  <span className="text-[10px] font-medium text-success flex items-center gap-0.5">
                    <Check className="w-2.5 h-2.5" /> Verified
                  </span>
                )}
                {coupon.autoApply && (
                  <span className="text-[10px] font-medium text-accent flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" /> Auto-apply
                  </span>
                )}
              </div>
            </div>
          </div>
          {coupon.isBest && (
            <span className="bg-success text-success-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full">
              Best Coupon
            </span>
          )}
        </div>

        {/* Dashed separator */}
        <div className="border-t border-dashed border-border/60 my-3" />

        {/* Body */}
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-lg font-bold text-foreground">{coupon.discount}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{coupon.description}</p>
            {coupon.minOrder && (
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Min. order: ₹{coupon.minOrder.toLocaleString()}
              </p>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              copied
                ? "bg-success/10 text-success"
                : "bg-primary text-primary-foreground"
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? "Copied" : coupon.code}
          </motion.button>
        </div>

        {/* Expiry */}
        <div className={`flex items-center gap-1 mt-3 ${isUrgent ? "text-destructive" : "text-muted-foreground"}`}>
          <Clock className="w-3 h-3" />
          <span className="text-[10px] font-medium">{timeLeft}</span>
        </div>
      </div>
    </motion.div>
  );
};

const Coupons = () => {
  const [filter, setFilter] = useState<"all" | "Amazon" | "Flipkart">("all");

  const filtered = filter === "all"
    ? mockCoupons
    : mockCoupons.filter((c) => c.store === filter);

  return (
    <div className="min-h-screen bg-background pb-24">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border"
      >
        <div className="max-w-lg mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-foreground">Coupons</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Verified & working codes</p>
        </div>
      </motion.header>

      <div className="max-w-lg mx-auto px-4 pt-5 space-y-5">
        {/* Filter Pills */}
        <div className="flex gap-2">
          {(["all", "Amazon", "Flipkart"] as const).map((f) => (
            <motion.button
              key={f}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {f === "all" ? "All Stores" : f}
            </motion.button>
          ))}
        </div>

        {/* Coupon Cards */}
        <div className="space-y-3">
          {filtered.map((coupon, i) => (
            <motion.div
              key={coupon.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <CouponCard coupon={coupon} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm text-muted-foreground">No coupons available for this store.</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default Coupons;
