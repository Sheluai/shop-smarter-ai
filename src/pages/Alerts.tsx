import { motion } from "framer-motion";
import { Bell, TrendingDown, Check, Trash2, Edit3, Info, ExternalLink, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import NotificationBanner from "@/components/NotificationBanner";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import LoginPromptModal from "@/components/LoginPromptModal";
import { usePriceAlerts } from "@/contexts/PriceAlertContext";
import { openAffiliateLink, hasValidAffiliateUrl } from "@/lib/affiliate";
import { useLoginPrompt } from "@/hooks/useLoginPrompt";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";

const Alerts = () => {
  const navigate = useNavigate();
  const { alerts, removeAlert, updateAlertPrice } = usePriceAlerts();
  const { showPrompt, promptMessage, closePrompt } = useLoginPrompt();
  const [editingAlert, setEditingAlert] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState(0);

  const activeAlerts = alerts.filter((a) => a.status === "active");
  const triggeredAlerts = alerts.filter((a) => a.status === "triggered");

  const handleEdit = (productId: string, currentTarget: number) => {
    setEditPrice(currentTarget);
    setEditingAlert(productId);
  };

  const handleSaveEdit = () => {
    if (editingAlert) {
      updateAlertPrice(editingAlert, editPrice);
      toast({
        title: "Alert Updated",
        description: `Target price updated to ₹${editPrice.toLocaleString()}`,
      });
      setEditingAlert(null);
    }
  };

  const handleRemove = (productId: string) => {
    removeAlert(productId);
    toast({
      title: "Alert Removed",
      description: "Price alert has been disabled",
    });
  };

  const editingAlertData = editingAlert ? alerts.find((a) => a.productId === editingAlert) : null;

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

        {/* Notification Permission Banner */}
        <div className="mb-4">
          <NotificationBanner />
        </div>

        {/* Empty State */}
        {alerts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No alerts yet</h3>
            <p className="text-sm text-muted-foreground">
              Set a target price on any product to get notified when it drops
            </p>
          </motion.div>
        )}

        {/* Triggered Alerts */}
        {triggeredAlerts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-medium text-success mb-3 flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              Price Dropped ({triggeredAlerts.length})
            </h2>
            <div className="space-y-3">
              {triggeredAlerts.map((alert, index) => (
                <AlertCard
                  key={alert.productId}
                  alert={alert}
                  index={index}
                  onTap={() => navigate(`/product/${alert.productId}`)}
                  onEdit={() => handleEdit(alert.productId, alert.targetPrice)}
                  onRemove={() => handleRemove(alert.productId)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4" />
              Watching ({activeAlerts.length})
            </h2>
            <div className="space-y-3">
              {activeAlerts.map((alert, index) => (
                <AlertCard
                  key={alert.productId}
                  alert={alert}
                  index={index + triggeredAlerts.length}
                  onTap={() => navigate(`/product/${alert.productId}`)}
                  onEdit={() => handleEdit(alert.productId, alert.targetPrice)}
                  onRemove={() => handleRemove(alert.productId)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Info Card */}
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 space-y-3"
          >
            <div className="bg-secondary/50 rounded-xl p-4 flex items-start gap-2">
              <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Price alerts are based on periodic price checks. We'll notify you when the price drops to your target.
              </p>
            </div>
            <AffiliateDisclosure />
          </motion.div>
        )}
      </div>

      {/* Edit Alert Sheet */}
      <Sheet open={!!editingAlert} onOpenChange={(open) => !open && setEditingAlert(null)}>
        <SheetContent side="bottom" className="rounded-t-3xl px-6 pb-10 pt-6">
          <SheetHeader className="text-left mb-6">
            <SheetTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-warning" />
              Edit Price Alert
            </SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground line-clamp-1">
              {editingAlertData?.productTitle}
            </SheetDescription>
          </SheetHeader>

          {editingAlertData && (
            <>
              <div className="bg-secondary/50 rounded-xl p-4 mb-6">
                <p className="text-xs text-muted-foreground mb-1">Current Price</p>
                <p className="text-2xl font-bold text-foreground">
                  ₹{editingAlertData.currentPrice.toLocaleString()}
                </p>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  New target price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                  <Input
                    type="text"
                    value={editPrice.toLocaleString()}
                    onChange={(e) => {
                      const val = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10);
                      if (!isNaN(val)) setEditPrice(val);
                    }}
                    className="pl-7 text-lg font-semibold h-12 rounded-xl"
                  />
                </div>
              </div>

              <Slider
                value={[editPrice]}
                onValueChange={(v) => setEditPrice(v[0])}
                min={Math.round(editingAlertData.currentPrice * 0.5)}
                max={editingAlertData.currentPrice}
                step={100}
                className="w-full mb-6"
              />

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleSaveEdit}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Bell className="w-5 h-5" />
                Update Alert
              </motion.button>
            </>
          )}
        </SheetContent>
      </Sheet>

      <LoginPromptModal
        open={showPrompt}
        onClose={closePrompt}
        message={promptMessage}
      />

      <BottomNav />
    </div>
  );
};

// Alert Card sub-component
interface AlertCardProps {
  alert: {
    productId: string;
    productTitle: string;
    targetPrice: number;
    currentPrice: number;
    platform: string;
    image: string;
    status: "active" | "triggered";
    affiliateUrl: string;
  };
  index: number;
  onTap: () => void;
  onEdit: () => void;
  onRemove: () => void;
}

const AlertCard = ({ alert, index, onTap, onEdit, onRemove }: AlertCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="card-soft p-4"
    >
      <div className="flex gap-4" onClick={onTap} role="button" tabIndex={0}>
        <div className="w-16 h-16 bg-secondary rounded-xl overflow-hidden flex-shrink-0">
          <img
            src={alert.image}
            alt={alert.productTitle}
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
            {alert.productTitle}
          </h3>

          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">
              Now: ₹{alert.currentPrice.toLocaleString()}
            </span>
            <span className="text-foreground font-medium">
              Alert: ₹{alert.targetPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Open Deal button for triggered alerts */}
      {alert.status === "triggered" && (
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation();
            openAffiliateLink(alert.affiliateUrl, alert.platform);
          }}
          disabled={!hasValidAffiliateUrl(alert.affiliateUrl)}
          className="w-full flex items-center justify-center gap-2 mt-3 py-2.5 text-sm font-medium text-primary-foreground bg-success rounded-lg hover:bg-success/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {hasValidAffiliateUrl(alert.affiliateUrl) ? (
            <>
              <ExternalLink className="w-4 h-4" />
              Open Best Price 🔥
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4" />
              Deal temporarily unavailable
            </>
          )}
        </motion.button>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="flex-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground py-2 rounded-lg hover:bg-secondary transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          Edit
        </motion.button>
        <div className="w-px h-5 bg-border" />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="flex-1 flex items-center justify-center gap-1.5 text-sm text-destructive py-2 rounded-lg hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Remove
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Alerts;
