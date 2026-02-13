import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link2,
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Bell,
  Bookmark,
  GitCompareArrows,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VerdictData {
  productName: string;
  verdict: "buy" | "wait" | "overpriced";
  reason: string;
  currentPrice: number;
  averagePrice: number;
  lowestPrice: number;
  bestStore: string;
  bestStorePrice: number;
  category: string;
  confidence: string;
  store: { name: string; logo: string };
  url: string;
}

const LOADING_MESSAGES = [
  "Checking price across stores…",
  "Analyzing price history…",
  "Running deal score engine…",
  "Comparing with alternatives…",
  "Finding best coupons…",
  "Generating smart verdict…",
];

const VERDICT_CONFIG = {
  buy: {
    emoji: "🟢",
    label: "Buy Now",
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/20",
    icon: CheckCircle2,
  },
  wait: {
    emoji: "🟡",
    label: "Wait",
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/20",
    icon: Clock,
  },
  overpriced: {
    emoji: "🔴",
    label: "Overpriced",
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/20",
    icon: AlertCircle,
  },
};

const SmartVerdictSection = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [verdict, setVerdict] = useState<VerdictData | null>(null);

  // Rotate loading messages
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [loading]);

  const analyzeDeal = useCallback(async () => {
    if (!url.trim()) {
      toast.error("Paste a product link to analyze");
      return;
    }

    setLoading(true);
    setLoadingMsgIndex(0);
    setVerdict(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-deal", {
        body: { url: url.trim() },
      });

      if (error || !data?.success) {
        toast.error(data?.error || "Couldn't analyze this link. Try another.");
        return;
      }

      setVerdict(data.data);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [url]);

  const formatPrice = (n: number) =>
    `₹${n.toLocaleString("en-IN")}`;

  const config = verdict ? VERDICT_CONFIG[verdict.verdict] : null;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground tracking-tight">
          Paste Any Link → Smart Verdict
        </h2>
      </div>

      {/* Input Area */}
      <div className="card-soft p-4 space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste any product link…"
              className="pl-9 bg-secondary border-0 rounded-xl h-11 text-sm"
              onKeyDown={(e) => e.key === "Enter" && analyzeDeal()}
              disabled={loading}
            />
          </div>
          <Button
            onClick={analyzeDeal}
            disabled={loading || !url.trim()}
            className="rounded-xl h-11 px-5 bg-primary text-primary-foreground font-medium text-sm shrink-0"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
            ) : (
              <>
                Analyze
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </>
            )}
          </Button>
        </div>

        {/* Loading State */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 pt-2"
            >
              {/* Progress shimmer */}
              <div className="h-1 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className="h-full bg-primary/40 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "90%" }}
                  transition={{ duration: 12, ease: "easeOut" }}
                />
              </div>
              <motion.p
                key={loadingMsgIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="text-xs text-muted-foreground text-center"
              >
                {LOADING_MESSAGES[loadingMsgIndex]}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Verdict Card */}
      <AnimatePresence mode="wait">
        {verdict && config && (
          <motion.div
            key="verdict"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="card-elevated overflow-hidden"
          >
            {/* Verdict Badge + Product */}
            <div className={`p-4 border-b border-border`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">
                    {verdict.store.logo} {verdict.store.name}
                  </p>
                  <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
                    {verdict.productName}
                  </h3>
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                  className={`ml-3 shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.bg} border ${config.border}`}
                >
                  <span className="text-sm">{config.emoji}</span>
                  <span className={`text-xs font-semibold ${config.color}`}>
                    {config.label}
                  </span>
                </motion.div>
              </div>

              {/* AI Reason */}
              <p className={`text-sm ${config.color} opacity-90 mt-2`}>
                {verdict.reason}
              </p>
            </div>

            {/* Price Insights */}
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <PriceBlock
                  label="Current"
                  value={formatPrice(verdict.currentPrice)}
                  icon={<TrendingUp className="w-3 h-3" />}
                  muted={false}
                />
                <PriceBlock
                  label="Average"
                  value={formatPrice(verdict.averagePrice)}
                  icon={<ArrowRight className="w-3 h-3" />}
                  muted
                />
                <PriceBlock
                  label="Lowest"
                  value={formatPrice(verdict.lowestPrice)}
                  icon={<TrendingDown className="w-3 h-3" />}
                  muted
                  highlight
                />
              </div>

              {/* Best Store */}
              {verdict.bestStore && verdict.bestStorePrice < verdict.currentPrice && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-success/5 border border-success/10"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                  <p className="text-xs text-foreground">
                    <span className="font-medium">{verdict.bestStore}</span> has it for{" "}
                    <span className="font-semibold text-success">
                      {formatPrice(verdict.bestStorePrice)}
                    </span>
                  </p>
                </motion.div>
              )}

              {/* Primary CTA */}
              <Button
                className="w-full rounded-xl h-11 bg-primary text-primary-foreground font-medium text-sm"
                onClick={() => {
                  window.open(verdict.url, "_blank", "noopener");
                }}
              >
                <ExternalLink className="w-4 h-4 mr-1.5" />
                Buy at Best Price
              </Button>

              {/* Secondary Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl text-xs h-9 border-border"
                  onClick={() => toast.info("Price alert set!")}
                >
                  <Bell className="w-3.5 h-3.5 mr-1" />
                  Price Alert
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl text-xs h-9 border-border"
                  onClick={() => toast.info("Saved!")}
                >
                  <Bookmark className="w-3.5 h-3.5 mr-1" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 rounded-xl text-xs h-9 border-border"
                  onClick={() => toast.info("Added to compare")}
                >
                  <GitCompareArrows className="w-3.5 h-3.5 mr-1" />
                  Compare
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PriceBlock = ({
  label,
  value,
  icon,
  muted,
  highlight,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  muted: boolean;
  highlight?: boolean;
}) => (
  <div className={`rounded-lg p-2.5 text-center ${highlight ? "bg-success/5" : "bg-secondary/50"}`}>
    <div className={`flex items-center justify-center gap-1 mb-1 ${muted ? "text-muted-foreground" : "text-foreground"}`}>
      {icon}
      <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    </div>
    <p className={`text-sm font-semibold ${highlight ? "text-success" : "text-foreground"}`}>
      {value}
    </p>
  </div>
);

export default SmartVerdictSection;
