import { motion } from "framer-motion";
import { Sprout, TrendingUp, AlertTriangle, BarChart3 } from "lucide-react";

const cards = [
  { title: "Active Crop Plans", value: "4", subtitle: "2 in growth phase", icon: Sprout, color: "text-primary" },
  { title: "Market Alerts", value: "3", subtitle: "1 high priority", icon: TrendingUp, color: "text-profit" },
  { title: "Soil Warnings", value: "1", subtitle: "Low nitrogen detected", icon: AlertTriangle, color: "text-warning" },
  { title: "Yield Forecast", value: "+12%", subtitle: "vs. last season", icon: BarChart3, color: "text-info" },
];

export function SummaryCards() {
  return (
    <>
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * i, duration: 0.4 }}
          className="glass-card p-5 hover:shadow-xl transition-shadow group cursor-default"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">{card.title}</p>
              <p className={`text-3xl font-bold mt-1 ${card.color}`}>{card.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
            </div>
            <div className={`p-2.5 rounded-lg bg-muted/60 ${card.color} group-hover:scale-110 transition-transform`}>
              <card.icon className="h-5 w-5" />
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
}
