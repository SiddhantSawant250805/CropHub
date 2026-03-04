import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, IndianRupee, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CropPlan {
  name: string;
  acres: number;
  budget: number;
  color: string;
}

function generatePlan(budget: number, land: number): CropPlan[] {
  const crops = [
    { name: "Maize", ratio: 0.3, color: "hsl(38, 92%, 50%)" },
    { name: "Soybean", ratio: 0.25, color: "hsl(152, 60%, 40%)" },
    { name: "Wheat", ratio: 0.2, color: "hsl(30, 30%, 45%)" },
    { name: "Rice", ratio: 0.15, color: "hsl(210, 80%, 55%)" },
    { name: "Vegetables", ratio: 0.1, color: "hsl(142, 76%, 36%)" },
  ];
  return crops.map((c) => ({
    name: c.name,
    acres: Math.round(land * c.ratio * 10) / 10,
    budget: Math.round(budget * c.ratio),
    color: c.color,
  }));
}

export default function FathomLayer() {
  const [budget, setBudget] = useState("");
  const [land, setLand] = useState("");
  const [plan, setPlan] = useState<CropPlan[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOptimize = () => {
    if (!budget || !land) return;
    setLoading(true);
    setPlan(null);
    setTimeout(() => {
      setPlan(generatePlan(Number(budget), Number(land)));
      setLoading(false);
    }, 2000);
  };

  const totalBudget = plan?.reduce((s, c) => s + c.budget, 0) || 0;
  const totalAcres = plan?.reduce((s, c) => s + c.acres, 0) || 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Fathom Layer</h1>
        <p className="text-muted-foreground mt-1">Predictive Optimization — Get AI-powered crop allocation plans.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8"
      >
        <div className="flex items-center gap-2 mb-6">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Input Parameters</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
              <IndianRupee className="h-4 w-4" /> Total Budget
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. 500000"
              className="w-full h-14 text-lg px-4 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
              <Ruler className="h-4 w-4" /> Land Size (Acres)
            </label>
            <input
              type="number"
              value={land}
              onChange={(e) => setLand(e.target.value)}
              placeholder="e.g. 10"
              className="w-full h-14 text-lg px-4 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:outline-none"
            />
          </div>
        </div>

        <Button
          onClick={handleOptimize}
          disabled={!budget || !land || loading}
          className="mt-6 h-12 px-8 text-base"
        >
          {loading ? "Optimizing..." : "Generate Crop Plan"}
        </Button>
      </motion.div>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-xl border bg-card p-6 space-y-3">
                <div className="skeleton-loader h-4 w-2/3" />
                <div className="skeleton-loader h-8 w-1/2" />
                <div className="skeleton-loader h-3 w-full" />
              </div>
            ))}
          </motion.div>
        )}

        {plan && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-foreground">Crop Allocation Plan</h3>

            {/* Budget bar */}
            <div className="glass-card p-4">
              <p className="text-sm text-muted-foreground mb-2">Budget Distribution</p>
              <div className="flex gap-0.5 rounded-lg overflow-hidden h-10">
                {plan.map((crop) => (
                  <motion.div
                    key={crop.name}
                    className="flex items-center justify-center text-xs font-semibold text-primary-foreground"
                    style={{ backgroundColor: crop.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(crop.budget / totalBudget) * 100}%` }}
                    transition={{ duration: 0.6 }}
                  >
                    {crop.name}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {plan.map((crop, i) => (
                <motion.div
                  key={crop.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-5 border-l-4"
                  style={{ borderLeftColor: crop.color }}
                >
                  <p className="font-semibold text-foreground text-lg">{crop.name}</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Area: <span className="font-semibold text-foreground">{crop.acres} Acres</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Budget: <span className="font-semibold text-foreground">₹{crop.budget.toLocaleString()}</span>
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="glass-card p-4 flex justify-between text-sm">
              <span className="text-muted-foreground">Total: <strong className="text-foreground">{totalAcres} Acres</strong></span>
              <span className="text-muted-foreground">Budget: <strong className="text-foreground">₹{totalBudget.toLocaleString()}</strong></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
