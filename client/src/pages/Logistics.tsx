import { motion } from "framer-motion";
import { MapPin, Truck, TrendingUp } from "lucide-react";

const markets = [
  { name: "Mandal Mandi", price: 2450, distance: 12, transport: 800, rent: 200, profit: 1450 },
  { name: "District APMC", price: 2680, distance: 28, transport: 1500, rent: 350, profit: 830 },
  { name: "Krishi Bazaar", price: 2820, distance: 8, transport: 500, rent: 150, profit: 2170 },
];

const bestMarket = markets.reduce((a, b) => (a.profit > b.profit ? a : b));

export default function Logistics() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Logistics & Market Arbitrage</h1>
        <p className="text-muted-foreground mt-1">Find the most profitable market for your produce.</p>
      </motion.div>

      {/* Map Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        <div className="relative bg-muted/30 h-64 md:h-80 flex items-center justify-center">
          {/* Stylized map */}
          <svg viewBox="0 0 400 250" className="w-full h-full max-w-lg opacity-60">
            {/* Farm */}
            <circle cx="200" cy="125" r="8" fill="hsl(152, 60%, 40%)" />
            <text x="200" y="115" textAnchor="middle" fill="hsl(152, 60%, 28%)" fontSize="10" fontWeight="600">Your Farm</text>

            {/* Markets with lines */}
            {[
              { x: 100, y: 60, name: "Mandal Mandi" },
              { x: 320, y: 80, name: "District APMC" },
              { x: 140, y: 200, name: "Krishi Bazaar" },
            ].map((m, i) => (
              <g key={m.name}>
                <motion.line
                  x1="200" y1="125" x2={m.x} y2={m.y}
                  stroke="hsl(152, 60%, 45%)"
                  strokeWidth="1.5"
                  strokeDasharray="6 3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5 + i * 0.3, duration: 0.8 }}
                />
                <circle cx={m.x} cy={m.y} r="5" fill="hsl(30, 30%, 45%)" />
                <text x={m.x} y={m.y - 10} textAnchor="middle" fill="hsl(150, 30%, 10%)" fontSize="9" fontWeight="500">{m.name}</text>
              </g>
            ))}
          </svg>
          <div className="absolute top-4 left-4 glass-card px-3 py-1.5 text-xs font-medium text-foreground flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary" /> Interactive Map View
          </div>
        </div>
      </motion.div>

      {/* Market Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card overflow-hidden"
      >
        <div className="p-4 border-b flex items-center gap-2">
          <Truck className="h-5 w-5 text-secondary" />
          <h3 className="font-semibold text-foreground">Market Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left p-3 font-medium text-muted-foreground">Market</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Price (₹/qtl)</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Distance (km)</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Transport (₹)</th>
                <th className="text-right p-3 font-medium text-muted-foreground">Rent (₹)</th>
                <th className="text-right p-3 font-medium text-muted-foreground">True Profit (₹)</th>
              </tr>
            </thead>
            <tbody>
              {markets.map((m, i) => {
                const isBest = m.name === bestMarket.name;
                return (
                  <motion.tr
                    key={m.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className={`border-b last:border-0 ${isBest ? "bg-accent/40" : "hover:bg-muted/20"}`}
                  >
                    <td className="p-3 font-medium text-foreground flex items-center gap-2">
                      <MapPin className={`h-4 w-4 ${isBest ? "text-profit" : "text-muted-foreground"}`} />
                      {m.name}
                      {isBest && (
                        <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-semibold">
                          BEST
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right text-foreground">₹{m.price}</td>
                    <td className="p-3 text-right text-muted-foreground">{m.distance} km</td>
                    <td className="p-3 text-right text-muted-foreground">₹{m.transport}</td>
                    <td className="p-3 text-right text-muted-foreground">₹{m.rent}</td>
                    <td className={`p-3 text-right font-bold text-lg ${isBest ? "text-profit glow-profit" : "text-foreground"}`}>
                      <div className="flex items-center justify-end gap-1">
                        {isBest && <TrendingUp className="h-4 w-4" />}
                        ₹{m.profit}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
