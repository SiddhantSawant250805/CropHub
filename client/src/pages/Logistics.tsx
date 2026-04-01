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
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-[#00e87a]/10 flex items-center justify-center border border-[#00e87a]/20 shadow-lg shadow-[#00e87a]/10">
            <Truck className="w-6 h-6 text-[#00e87a]" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white font-outfit">Logistics & Arbitrage</h1>
            <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Supply Chain Optimization • Market Synthesis</p>
          </div>
        </div>
      </motion.div>

      {/* Best Pick Banner */}
      <motion.div variants={fadeUp} className="glass-card rounded-3xl p-6 flex items-center gap-6 border-[#00e87a]/20 bg-gradient-to-r from-[#00e87a]/10 to-transparent">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-[#00e87a]/20">
          <Star className="w-7 h-7 text-[#00e87a] fill-[#00e87a]/20" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-1 text-[#00e87a]/60">Recommended Synthesis</p>
          <p className="font-outfit font-black text-2xl text-white tracking-tight">
            Mandi Gamma <span className="text-[#00e87a]">➔ ₹1,720/quintal</span> Alpha Profit
          </p>
        </div>
      </motion.div>

      {/* Map */}
      <motion.div variants={fadeUp} className="glass-card rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
            <Navigation className="w-4 h-4 text-[#00e87a]" />
          </div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">In-Field Logistics Topology</h2>
        </div>
        <div className="relative w-full h-64 md:h-80 rounded-[2rem] overflow-hidden bg-[#0a0f0d] border border-white/5 group">
          {/* Grid lines */}
          {Array.from({ length: 12 }).map((_, i) => (
             <div key={`h${i}`} className="absolute w-full h-px" style={{ top: `${(i + 1) * 8.33}%`, background: "rgba(0, 232, 122, 0.03)" }} />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
             <div key={`v${i}`} className="absolute h-full w-px" style={{ left: `${(i + 1) * 8.33}%`, background: "rgba(0, 232, 122, 0.03)" }} />
          ))}
          {/* Subtle glow at center */}
          <div className="absolute" style={{ left: "42%", top: "46%", width: 240, height: 240, transform: "translate(-50%,-50%)",
            background: "radial-gradient(circle, rgba(0, 232, 122, 0.05) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(40px)" }} />

          {/* Farm */}
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: "spring" }}
            className="absolute z-10" style={{ left: "45%", top: "50%" }}>
            <div className="relative">
               <div className="w-8 h-8 rounded-xl flex items-center justify-center ring ring-[#00e87a]/20 bg-[#00e87a] shadow-[0_0_20px_rgba(0,232,122,0.4)]">
                <MapPin className="w-4 h-4 text-[#003919]" />
              </div>
              <motion.div className="absolute inset-0 rounded-xl"
                style={{ border: "2px solid #00e87a" }}
                animate={{ scale: [1, 2], opacity: [0.6, 0] }}
                transition={{ duration: 2, repeat: Infinity }} />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-[#00e87a]">Base Farm</span>
            </div>
          </motion.div>

          {/* Markets */}
          {markets.map((market, i) => (
            <motion.div key={market.name}>
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                <motion.line x1="47%" y1="52%" x2={`${market.lng * 100}%`} y2={`${market.lat * 100}%`}
                  stroke={market.best ? "#00e87a" : "rgba(255, 255, 255, 0.05)"}
                  strokeWidth={market.best ? 3 : 1} strokeDasharray="8 6"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 0.5 + i * 0.2, duration: 1 }} />
              </svg>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ delay: 0.7 + i * 0.2, type: "spring" }}
                className="absolute z-10"
                style={{ left: `${market.lng * 100}%`, top: `${market.lat * 100}%` }}>
                <div className="relative group/mkt">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-transform group-hover/mkt:scale-125 duration-300 shadow-2xl`}
                    style={{
                      background: market.best ? "#00e87a" : "#1a2420",
                      borderColor: market.best ? "rgba(0,232,122,0.5)" : "rgba(255,255,255,0.05)"
                    }}>
                    <Truck className="w-4 h-4" style={{ color: market.best ? "#003919" : "rgba(255,255,255,0.3)" }} />
                  </div>
                  {market.best && (
                    <motion.div className="absolute inset-0 rounded-xl"
                      style={{ border: "2px solid #00e87a" }}
                      animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
                  )}
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-bold uppercase tracking-widest whitespace-nowrap"
                    style={{ color: market.best ? "#00e87a" : "white", opacity: market.best ? 1 : 0.2 }}>
                    {market.name}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Market Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {markets.map((m, i) => (
          <motion.div key={m.name}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
            className="glass-card rounded-[2rem] p-8 transition-all group border border-white/5 hover:border-white/20">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.best ? 'bg-[#00e87a]/10' : 'bg-white/5'}`}>
                   <Truck className={`w-5 h-5 ${m.best ? 'text-[#00e87a]' : 'text-white/20'}`} />
                </div>
                <span className="font-black text-lg text-white font-outfit uppercase tracking-tight">{m.name}</span>
              </div>
              {m.best && (
                <span className="text-[10px] font-black px-3 py-1 rounded-lg bg-[#00e87a]/20 text-[#00e87a] uppercase tracking-widest border border-[#00e87a]/30">Optimal</span>
              )}
            </div>
            <div className="space-y-4">
              {[
                { label: "Market Price", val: m.price },
                { label: "Topology Range", val: m.distance },
                { label: "Logistics Load", val: m.transport },
                { label: "Storage Rent", val: m.rent },
                { label: "Alpha Profit", val: m.trueProfit, accent: true },
              ].map(({ label, val, accent }) => (
                <div key={label} className={`flex justify-between items-center p-3 rounded-xl ${accent ? 'bg-[#00e87a]/5 border border-[#00e87a]/10' : 'bg-white/5 border border-white/5'}`}>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{label}</span>
                  <span className={`font-mono font-bold ${accent ? 'text-[#00e87a] text-lg' : 'text-white/60 text-sm'}`}>{val}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Full table */}
      <motion.div variants={fadeUp} className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5">
        <div className="p-8 flex items-center gap-4 bg-white/5 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-[#00e87a]/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[#00e87a]" />
          </div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Market Synthesis Matrix</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5">
                {["Target Market", "Price Node", "Topology Range", "Logistics", "Unit Rent", "Alpha Matrix"].map((h) => (
                  <th key={h} className="text-left px-8 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {markets.map((m, i) => (
                <motion.tr key={m.name}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className={`border-b border-white/[0.02] transition-colors hover:bg-white/[0.02] ${m.best ? 'bg-[#00e87a]/[0.02]' : ''}`}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${m.best ? 'bg-[#00e87a] shadow-[0_0_10px_#00e87a]' : 'bg-white/10'}`} />
                      <span className="font-bold text-white/80">{m.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-mono text-white/60">{m.price}</td>
                  <td className="px-8 py-6 font-mono text-white/20">{m.distance}</td>
                  <td className="px-8 py-6 font-mono text-white/20">{m.transport}</td>
                  <td className="px-8 py-6 font-mono text-white/20">{m.rent}</td>
                  <td className="px-8 py-6">
                    <span className={`font-mono font-black text-sm px-4 py-2 rounded-xl border ${m.best ? 'bg-[#00e87a]/10 border-[#00e87a]/30 text-[#00e87a]' : 'bg-white/5 border-white/5 text-white/40'}`}>
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
