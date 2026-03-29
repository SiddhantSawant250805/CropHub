import { motion } from "framer-motion";
import { MapPin, Truck, TrendingUp, Star, Navigation } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

const markets = [
  { name: "Mandi Alpha", distance: "12 km", price: "₹2,450/q", transport: "₹800",  rent: "₹150", trueProfit: "₹1,500", best: false, lat: 0.6,  lng: 0.3  },
  { name: "Mandi Beta",  distance: "28 km", price: "₹2,800/q", transport: "₹1,400",rent: "₹200", trueProfit: "₹1,200", best: false, lat: 0.35, lng: 0.7  },
  { name: "Mandi Gamma", distance: "18 km", price: "₹2,900/q", transport: "₹1,000",rent: "₹180", trueProfit: "₹1,720", best: true,  lat: 0.7,  lng: 0.65 },
];

export default function Logistics() {
  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }} className="space-y-6">
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(196,154,108,0.1)", border: "1px solid rgba(196,154,108,0.2)" }}>
            <Truck className="w-4 h-4" style={{ color: "#c49a6c" }} />
          </div>
          <h1 className="text-3xl font-outfit font-black" style={{ color: "rgb(var(--on-surface))" }}>Logistics & Market Arbitrage</h1>
        </div>
        <p className="text-sm ml-11" style={{ color: "rgba(186,203,186,0.6)" }}>Find the most profitable market for your produce</p>
      </motion.div>

      {/* Best Pick Banner */}
      <motion.div variants={fadeUp} className="rounded-2xl p-4 flex items-center gap-4"
        style={{ background: "rgba(0,232,122,0.06)", border: "1px solid rgba(0,232,122,0.2)" }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(0,232,122,0.12)" }}>
          <Star className="w-5 h-5" style={{ color: "#00e87a" }} />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: "rgba(186,203,186,0.5)" }}>Recommended Market</p>
          <p className="font-outfit font-black text-lg" style={{ color: "#00e87a" }}>
            Mandi Gamma — ₹1,720/quintal true profit after all deductions
          </p>
        </div>
      </motion.div>

      {/* Map */}
      <motion.div variants={fadeUp} className="rounded-2xl p-5"
        style={{ background: "rgb(var(--surface-container))", border: "1px solid rgba(0,232,122,0.08)" }}>
        <div className="flex items-center gap-2 mb-4">
          <Navigation className="w-4 h-4" style={{ color: "#c49a6c" }} />
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "rgba(186,203,186,0.6)" }}>Farm to Market Routes</h2>
        </div>
        <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden"
          style={{ background: "rgb(var(--surface-container-low))", border: "1px solid rgba(0,232,122,0.08)" }}>
          {/* Grid lines */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`h${i}`} className="absolute w-full h-px" style={{ top: `${(i + 1) * 11}%`, background: "rgba(0,232,122,0.05)" }} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`v${i}`} className="absolute h-full w-px" style={{ left: `${(i + 1) * 11}%`, background: "rgba(0,232,122,0.05)" }} />
          ))}
          {/* Subtle glow at center */}
          <div className="absolute" style={{ left: "42%", top: "46%", width: 120, height: 120, transform: "translate(-50%,-50%)",
            background: "radial-gradient(circle, rgba(0,232,122,0.08) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(20px)" }} />

          {/* Farm */}
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }}
            className="absolute z-10" style={{ left: "45%", top: "50%" }}>
            <div className="relative">
              <div className="w-7 h-7 rounded-full flex items-center justify-center ring-2"
                style={{ background: "#00e87a", ringColor: "rgba(0,232,122,0.3)" }}>
                <MapPin className="w-3.5 h-3.5 text-black" />
              </div>
              <motion.div className="absolute inset-0 rounded-full"
                style={{ border: "2px solid #00e87a" }}
                animate={{ scale: [1, 2], opacity: [0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity }} />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-semibold whitespace-nowrap"
                style={{ color: "#00e87a" }}>Your Farm</span>
            </div>
          </motion.div>

          {/* Markets */}
          {markets.map((market, i) => (
            <motion.div key={market.name}>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                <motion.line x1="47%" y1="52%" x2={`${market.lng * 100}%`} y2={`${market.lat * 100}%`}
                  stroke={market.best ? "#00e87a" : "rgba(186,203,186,0.2)"}
                  strokeWidth={market.best ? 2.5 : 1.5} strokeDasharray="6 4"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5 + i * 0.2, duration: 0.8 }} />
              </svg>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.7 + i * 0.2, type: "spring" }}
                className="absolute z-10"
                style={{ left: `${market.lng * 100}%`, top: `${market.lat * 100}%` }}>
                <div className="relative">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2`}
                    style={{
                      background: market.best ? "#00e87a" : "rgba(196,154,108,0.4)",
                      borderColor: market.best ? "#85ffa7" : "rgba(196,154,108,0.4)"
                    }}>
                    <Truck className="w-3 h-3" style={{ color: market.best ? "#003919" : "#c49a6c" }} />
                  </div>
                  {market.best && (
                    <motion.div className="absolute inset-0 rounded-full"
                      style={{ border: "2px solid #00e87a" }}
                      animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
                  )}
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-medium whitespace-nowrap"
                    style={{ color: market.best ? "#00e87a" : "rgba(186,203,186,0.5)" }}>
                    {market.name}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Market Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {markets.map((m, i) => (
          <motion.div key={m.name}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
            className="rounded-2xl p-5 transition-all"
            style={{
              background: m.best ? "rgba(0,232,122,0.04)" : "rgb(var(--surface-container))",
              border: `1px solid ${m.best ? "rgba(0,232,122,0.3)" : "rgba(0,232,122,0.06)"}`,
              borderTop: `3px solid ${m.best ? "#00e87a" : "rgba(186,203,186,0.1)"}`,
            }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" style={{ color: m.best ? "#00e87a" : "rgba(186,203,186,0.5)" }} />
                <span className="font-semibold text-sm" style={{ color: "rgb(var(--on-surface))" }}>{m.name}</span>
              </div>
              {m.best && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
                  style={{ background: "rgba(0,232,122,0.12)", color: "#00e87a" }}>
                  <Star className="w-2.5 h-2.5 fill-current" /> Best
                </span>
              )}
            </div>
            <div className="space-y-2 text-sm">
              {[
                { label: "Price",       val: m.price,       accent: false },
                { label: "Distance",    val: m.distance,    accent: false },
                { label: "Transport",   val: m.transport,   accent: false },
                { label: "Rent",        val: m.rent,        accent: false },
                { label: "True Profit", val: m.trueProfit,  accent: true  },
              ].map(({ label, val, accent }) => (
                <div key={label} className="flex justify-between">
                  <span style={{ color: "rgba(186,203,186,0.5)" }}>{label}</span>
                  <span className="font-mono font-semibold" style={{ color: accent ? (m.best ? "#00e87a" : "#ffb955") : "rgba(217,230,220,0.8)" }}>
                    {val}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Full table */}
      <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden"
        style={{ background: "rgb(var(--surface-container))", border: "1px solid rgba(0,232,122,0.08)" }}>
        <div className="p-5 flex items-center gap-2" style={{ borderBottom: "1px solid rgba(0,232,122,0.08)" }}>
          <TrendingUp className="w-4 h-4" style={{ color: "#00e87a" }} />
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "rgba(186,203,186,0.6)" }}>Full Market Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,232,122,0.08)", background: "rgba(0,232,122,0.02)" }}>
                {["Market", "Price", "Distance", "Transport", "Rent", "True Profit"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "rgba(186,203,186,0.4)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {markets.map((m, i) => (
                <motion.tr key={m.name}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  style={{
                    borderBottom: "1px solid rgba(0,232,122,0.05)",
                    background: m.best ? "rgba(0,232,122,0.04)" : "transparent",
                  }}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {m.best && <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#00e87a" }} />}
                      <span className="font-medium" style={{ color: "rgb(var(--on-surface))" }}>{m.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono" style={{ color: "rgba(217,230,220,0.8)" }}>{m.price}</td>
                  <td className="px-5 py-4 font-mono" style={{ color: "rgba(186,203,186,0.5)" }}>{m.distance}</td>
                  <td className="px-5 py-4 font-mono" style={{ color: "rgba(186,203,186,0.5)" }}>{m.transport}</td>
                  <td className="px-5 py-4 font-mono" style={{ color: "rgba(186,203,186,0.5)" }}>{m.rent}</td>
                  <td className="px-5 py-4">
                    <span className="font-mono font-bold text-sm px-2.5 py-1 rounded-full"
                      style={{
                        background: m.best ? "rgba(0,232,122,0.12)" : "rgba(255,185,85,0.08)",
                        color: m.best ? "#00e87a" : "#ffb955",
                      }}>
                      {m.trueProfit}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
