import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart3, Wheat, TrendingUp, IndianRupee, Leaf } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

interface CropAllocation {
  name: string; acres: number; cost: number; expectedRevenue: number; color: string;
}

const cropDatabase = [
  { name: "Maize",   costPerAcre: 8500,  revenuePerAcre: 18000, color: "#f5a623" },
  { name: "Soybean", costPerAcre: 7200,  revenuePerAcre: 16000, color: "#00e87a" },
  { name: "Wheat",   costPerAcre: 6800,  revenuePerAcre: 14500, color: "#ffb955" },
  { name: "Rice",    costPerAcre: 10200, revenuePerAcre: 22000, color: "#c49a6c" },
  { name: "Cotton",  costPerAcre: 9500,  revenuePerAcre: 20000, color: "#60b4ff" },
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
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(255,185,85,0.1)", border: "1px solid rgba(255,185,85,0.2)" }}>
            <BarChart3 className="w-4 h-4" style={{ color: "#ffb955" }} />
          </div>
          <h1 className="text-3xl font-outfit font-black" style={{ color: "rgb(var(--on-surface))" }}>Fathom Layer</h1>
        </div>
        <p className="text-sm ml-11" style={{ color: "rgba(186,203,186,0.6)" }}>
          Predictive Optimization — maximize returns per acre
        </p>
      </motion.div>

      {/* Inputs */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { label: "Total Budget", placeholder: "e.g. 200000", prefix: "₹", value: budget, set: setBudget },
          { label: "Land Size", placeholder: "e.g. 15", prefix: "ac", value: landSize, set: setLandSize },
        ].map(({ label, placeholder, prefix, value, set }) => (
          <div key={label} className="rounded-2xl p-5"
            style={{ background: "rgb(var(--surface-container))", border: "1px solid rgba(0,232,122,0.08)" }}>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-3"
              style={{ color: "rgba(186,203,186,0.5)" }}>{label}</label>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold shrink-0" style={{ color: "rgba(186,203,186,0.4)" }}>{prefix}</span>
              <input type="number" value={value} onChange={(e) => set(e.target.value)} placeholder={placeholder}
                className="flex-1 bg-transparent outline-none font-mono text-2xl font-bold placeholder:opacity-30"
                style={{ color: "rgb(var(--on-surface))" }} />
            </div>
            <div className="mt-3 h-px" style={{ background: "rgba(0,232,122,0.12)" }} />
          </div>
        ))}
      </motion.div>

      {/* Results */}
      {allocations.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Stacked bar */}
          <div className="rounded-2xl p-5" style={{ background: "rgb(var(--surface-container))", border: "1px solid rgba(0,232,122,0.08)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Wheat className="w-4 h-4" style={{ color: "#ffb955" }} />
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "rgba(186,203,186,0.6)" }}>Crop Allocation Plan</h2>
            </div>
            <div className="h-10 rounded-xl overflow-hidden flex mb-3">
              {allocations.map((a, i) => (
                <motion.div key={a.name} initial={{ width: 0 }}
                  animate={{ width: `${(a.acres / totalAcres) * 100}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                  style={{ background: a.color }} className="h-full flex items-center justify-center">
                  {a.acres >= totalAcres * 0.15 && (
                    <span className="text-xs font-mono font-bold text-black/70">{a.acres}ac</span>
                  )}
                </motion.div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              {allocations.map((a) => (
                <div key={a.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: a.color }} />
                  <span className="text-xs" style={{ color: "rgba(217,230,220,0.7)" }}>{a.name}</span>
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
                  className="rounded-2xl p-4"
                  style={{ background: "rgb(var(--surface-container))", borderTop: `3px solid ${a.color}`, border: `1px solid rgba(0,232,122,0.06)`, borderTopColor: a.color }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4" style={{ color: a.color }} />
                      <span className="font-semibold text-sm" style={{ color: "rgb(var(--on-surface))" }}>{a.name}</span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: `${a.color}18`, color: a.color }}>{margin}% margin</span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {[
                      { label: "Acres",         val: a.acres.toString() },
                      { label: "Cost",          val: fmt(a.cost) },
                      { label: "Est. Revenue",  val: fmt(a.expectedRevenue), accent: true },
                    ].map(({ label, val, accent }) => (
                      <div key={label} className="flex justify-between">
                        <span style={{ color: "rgba(186,203,186,0.5)" }}>{label}</span>
                        <span className="font-mono font-semibold" style={{ color: accent ? a.color : "rgb(var(--on-surface))" }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, rgba(0,232,122,0.06) 0%, rgba(0,232,122,0.02) 100%)", border: "1px solid rgba(0,232,122,0.2)" }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Total Allocated", val: `${totalAcres} acres`,      icon: Leaf,          color: "#00e87a" },
                { label: "Total Cost",       val: fmt(totalCost),             icon: IndianRupee,   color: "#ffb955" },
                { label: "Est. Revenue",     val: fmt(totalRevenue),          icon: TrendingUp,    color: "#00e87a" },
                { label: "Expected Profit",  val: fmt(totalProfit),           icon: BarChart3,     color: "#00e87a" },
              ].map(({ label, val, icon: Icon, color }) => (
                <div key={label}>
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                    <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(186,203,186,0.5)" }}>{label}</p>
                  </div>
                  <p className="font-mono text-xl font-black" style={{ color }}>{val}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {!budget && !landSize && (
        <motion.div variants={fadeUp} className="rounded-2xl p-8 text-center"
          style={{ background: "rgb(var(--surface-container))", border: "1px dashed rgba(0,232,122,0.15)" }}>
          <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: "#ffb955" }} />
          <p className="text-sm" style={{ color: "rgba(186,203,186,0.5)" }}>Enter your budget and land size above to generate an AI allocation plan.</p>
        </motion.div>
      )}
    </motion.div>
  );
}
