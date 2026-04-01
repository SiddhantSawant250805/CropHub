import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3, Wheat, TrendingUp, IndianRupee, Leaf } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

interface CropAllocation {
  name: string; acres: number; cost: number; expectedRevenue: number; color: string;
}

const cropDatabase = [
  { name: "Maize",   costPerAcre: 8500,  revenuePerAcre: 18000, color: "#00e87a" }, // Neon Green
  { name: "Soybean", costPerAcre: 7200,  revenuePerAcre: 16000, color: "#ffb955" }, // Harvest Gold
  { name: "Wheat",   costPerAcre: 6800,  revenuePerAcre: 14500, color: "#00e87a" }, 
  { name: "Rice",    costPerAcre: 10200, revenuePerAcre: 22000, color: "#ffb955" },
  { name: "Cotton",  costPerAcre: 9500,  revenuePerAcre: 20000, color: "#00e87a" },
];

function fmt(n: number) { return "₹" + n.toLocaleString("en-IN"); }

export default function FathomLayer() {
  const [budget, setBudget] = useState("");
  const [landSize, setLandSize] = useState("");

  const allocations = useMemo<CropAllocation[]>(() => {
    const b = parseFloat(budget);
    const l = parseFloat(landSize);
    if (!b || !l || b <= 0 || l <= 0) return [];
    const sorted = [...cropDatabase].sort((a, c) => (c.revenuePerAcre - c.costPerAcre) - (a.revenuePerAcre - a.costPerAcre));
    const result: CropAllocation[] = [];
    let remB = b, remL = l;
    for (const crop of sorted) {
      if (remB <= 0 || remL <= 0) break;
      const acres = Math.min(remB / crop.costPerAcre, remL, Math.ceil(l / sorted.length));
      const ra = Math.round(acres * 10) / 10;
      if (ra <= 0) continue;
      result.push({ name: crop.name, acres: ra, cost: ra * crop.costPerAcre, expectedRevenue: ra * crop.revenuePerAcre, color: crop.color });
      remB -= ra * crop.costPerAcre; remL -= ra;
    }
    return result;
  }, [budget, landSize]);

  const totalCost    = allocations.reduce((s, a) => s + a.cost, 0);
  const totalRevenue = allocations.reduce((s, a) => s + a.expectedRevenue, 0);
  const totalAcres   = allocations.reduce((s, a) => s + a.acres, 0);
  const totalProfit  = totalRevenue - totalCost;

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }} className="space-y-6">
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-[#ffb955]/10 flex items-center justify-center border border-[#ffb955]/20 shadow-lg shadow-[#ffb955]/10">
            <BarChart3 className="w-6 h-6 text-[#ffb955]" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white font-outfit">Fathom Layer</h1>
            <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Predictive Optimization • Portfolio Risk Synthesis</p>
          </div>
        </div>
      </motion.div>

      {/* Inputs */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Total Investment Budget", placeholder: "e.g. 2,00,000", prefix: "₹", value: budget, set: setBudget },
          { label: "Cultivable Land Size", placeholder: "e.g. 15", prefix: "AC", value: landSize, set: setLandSize },
        ].map(({ label, placeholder, prefix, value, set }) => (
          <div key={label} className="glass-card rounded-3xl p-8 border border-white/5 group hover:border-[#00e87a]/20 transition-all">
            <label className="block text-xs font-bold uppercase tracking-[0.2em] mb-6 text-white/20 group-hover:text-white/40 transition-colors">{label}</label>
            <div className="flex items-center gap-6">
              <span className="text-2xl font-black text-white/10">{prefix}</span>
              <input type="number" value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder}
                className="flex-1 bg-transparent outline-none font-outfit text-4xl font-black placeholder:text-white/5 text-white" />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Results */}
      {allocations.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Stacked bar */}
          <div className="glass-card rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00e87a]/5 via-transparent to-transparent opacity-50" />
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-3">
                <Wheat className="w-5 h-5 text-[#ffb955]" />
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Resource Allocation Plan</h2>
              </div>
              <span className="text-xs font-mono text-white/20 uppercase tracking-widest">Calculated by Fathom Core</span>
            </div>
            <div className="h-16 rounded-2xl overflow-hidden flex mb-8 border border-white/5 p-1 bg-black/20 relative z-10">
              {allocations.map((a, i) => (
                <motion.div key={a.name} initial={{ width: 0 }}
                  animate={{ width: `${(a.acres / totalAcres) * 100}%` }}
                  transition={{ duration: 1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  style={{ background: a.color }} className="relative h-full first:rounded-l-xl last:rounded-r-xl group">
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
            </div>
            <div className="flex flex-wrap gap-6 relative z-10">
              {allocations.map((a) => (
                <div key={a.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ background: a.color }} />
                  <span className="text-xs font-bold text-white/50 uppercase tracking-widest">{a.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Allocation cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allocations.map((a, i) => {
              const margin = Math.round(((a.expectedRevenue - a.cost) / a.expectedRevenue) * 100);
              return (
                <motion.div key={a.name}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="glass-card rounded-[2rem] p-8 border border-white/5 group hover:border-white/20 transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5">
                        <Leaf className="w-5 h-5" style={{ color: a.color }} />
                      </div>
                      <span className="font-black text-lg text-white font-outfit uppercase tracking-tight">{a.name}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg border border-white/10 text-white/40 group-hover:text-white/80 transition-colors">{margin}% PROFIT</span>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "Planned Scale", val: `${a.acres} ac`, icon: Wheat },
                      { label: "Operation Cost", val: fmt(a.cost), icon: IndianRupee },
                      { label: "Target Alpha", val: fmt(a.expectedRevenue), icon: TrendingUp, color: a.color },
                    ].map(({ label, val, icon: Icon, color }) => (
                      <div key={label} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-2">
                          <Icon className="w-3.5 h-3.5 text-white/20" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">{label}</span>
                        </div>
                        <span className="text-sm font-black font-mono" style={{ color: color || "white" }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="glass-card rounded-[2.5rem] p-10 border border-[#00e87a]/20 bg-gradient-to-br from-[#00e87a]/10 to-transparent">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {[
                { label: "Portfolio Size", val: `${totalAcres} AC`,  icon: Wheat,        color: "#00e87a" },
                { label: "Total Exposure", val: fmt(totalCost),    icon: IndianRupee,  color: "#ffb955" },
                { label: "Gross Target",   val: fmt(totalRevenue), icon: TrendingUp,    color: "#00e87a" },
                { label: "Projected Alpha",val: fmt(totalProfit),  icon: BarChart3,     color: "#00e87a" },
              ].map(({ label, val, icon: Icon, color }) => (
                <div key={label} className="relative group">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="w-5 h-5" style={{ color }} />
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">{label}</p>
                  </div>
                  <p className="font-outfit text-4xl font-black tracking-tighter" style={{ color }}>{val}</p>
                  <div className="absolute -bottom-4 left-0 w-8 h-1 rounded-full group-hover:w-full transition-all duration-500" style={{ background: color, opacity: 0.3 }} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {!budget && !landSize && (
        <motion.div variants={fadeUp} className="glass-card rounded-[2.5rem] p-20 text-center border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent" />
          <BarChart3 className="w-20 h-20 mx-auto mb-8 text-white/5 group-hover:text-[#00e87a]/20 transition-colors duration-700" />
          <h3 className="text-2xl font-black text-white/40 font-outfit uppercase tracking-tight mb-2">Engine Pending Initialization</h3>
          <p className="text-white/20 text-xs font-bold uppercase tracking-widest">Enter portfolio constraints above to activate Fathom Core optimization.</p>
        </motion.div>
      )}
    </motion.div>
  );
}
