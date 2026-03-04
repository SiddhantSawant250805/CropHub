import { motion } from "framer-motion";
import { CircularProgress } from "./CircularProgress";
import { Layers } from "lucide-react";

const soilData = [
  { label: "Nitrogen (N)", value: 65, max: 100, unit: "kg/ha", color: "hsl(152, 60%, 40%)" },
  { label: "Phosphorus (P)", value: 42, max: 80, unit: "kg/ha", color: "hsl(210, 80%, 55%)" },
  { label: "Potassium (K)", value: 78, max: 100, unit: "kg/ha", color: "hsl(38, 92%, 50%)" },
  { label: "pH Level", value: 6.5, max: 14, unit: "pH", color: "hsl(30, 30%, 45%)" },
];

export function SoilResults() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-card p-8"
    >
      <div className="flex items-center gap-2 mb-6">
        <Layers className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Soil Health Profile</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        {soilData.map((item, i) => (
          <CircularProgress key={item.label} {...item} delay={0.2 + i * 0.15} />
        ))}
      </div>

      {/* 3D Soil Composition Graphic (stylized) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="rounded-xl bg-muted/40 p-6"
      >
        <p className="text-sm font-medium text-muted-foreground mb-3">Soil Composition</p>
        <div className="flex gap-1 rounded-lg overflow-hidden h-8">
          {[
            { label: "Sand", pct: 40, bg: "bg-warning/70" },
            { label: "Silt", pct: 35, bg: "bg-secondary/70" },
            { label: "Clay", pct: 25, bg: "bg-primary/70" },
          ].map((layer) => (
            <motion.div
              key={layer.label}
              className={`${layer.bg} flex items-center justify-center text-[10px] font-semibold text-primary-foreground`}
              initial={{ width: 0 }}
              animate={{ width: `${layer.pct}%` }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              {layer.label} {layer.pct}%
            </motion.div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">Classification: <strong className="text-foreground">Loamy Soil</strong> — Excellent for most crops</p>
      </motion.div>
    </motion.div>
  );
}
