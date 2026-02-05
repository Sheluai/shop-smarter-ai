import { motion } from "framer-motion";
import { TrendingDown, AlertTriangle, Info } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface PriceHistoryData {
  lowest30Days: number;
  lowest30DaysDate: string;
  lowest90Days: number;
  lowest90DaysDate: string;
  chartData: { day: string; price: number }[];
}

interface PriceHistoryCardProps {
  currentPrice: number;
  priceHistory: PriceHistoryData;
}

const PriceHistoryCard = ({ currentPrice, priceHistory }: PriceHistoryCardProps) => {
  const isFakeDiscount = currentPrice > priceHistory.lowest30Days;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-secondary/30 rounded-xl p-4 border border-border"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Price History</span>
        </div>
        <TooltipProvider>
          <UITooltip>
            <TooltipTrigger asChild>
              <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                <Info className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-[250px]">
              <p className="text-sm">
                Price history is based on recent observed prices and may vary.
              </p>
            </TooltipContent>
          </UITooltip>
        </TooltipProvider>
      </div>

      {/* Fake Discount Warning */}
      {isFakeDiscount && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
        >
          <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
          <span className="text-sm text-destructive font-medium">
            ⚠️ Price was lower recently (₹{priceHistory.lowest30Days.toLocaleString()})
          </span>
        </motion.div>
      )}

      {/* Price Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-background rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">Lowest in 30 days</p>
          <p className="text-lg font-semibold text-foreground">
            ₹{priceHistory.lowest30Days.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">{priceHistory.lowest30DaysDate}</p>
        </div>
        <div className="bg-background rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">Lowest in 90 days</p>
          <p className="text-lg font-semibold text-foreground">
            ₹{priceHistory.lowest90Days.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">{priceHistory.lowest90DaysDate}</p>
        </div>
      </div>

      {/* Mini Chart */}
      <div className="h-24 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={priceHistory.chartData}>
            <XAxis 
              dataKey="day" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              interval="preserveStartEnd"
            />
            <YAxis 
              hide 
              domain={['dataMin - 500', 'dataMax + 500']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Price']}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#3b82f6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default PriceHistoryCard;
