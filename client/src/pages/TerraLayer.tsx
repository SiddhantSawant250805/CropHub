import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Check, Leaf, AlertCircle, RefreshCw, Droplets, Zap, FlaskConical } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

type ScanState = "idle" | "scanning" | "complete";

const mockResults = {
  nitrogen: 72, phosphorus: 45, potassium: 88,
  ph: 6.4, organicMatter: 3.2, moisture: 28,
};

const recommendations = [
  { icon: Zap,         text: "Add 20kg/acre urea — nitrogen below optimal range",  color: "#00e87a" },
  { icon: Droplets,    text: "Irrigation adequate — moisture within target band",   color: "#60b4ff" },
  { icon: FlaskConical,text: "pH balanced — no lime amendment needed this season",  color: "#ffb955" },
];

function healthScore(r: typeof mockResults) {
  const scores = [
    Math.min(r.nitrogen / 100, 1),
    Math.min(r.phosphorus / 100, 1),
    Math.min(r.potassium / 100, 1),
    1 - Math.abs(r.ph - 6.5) / 3.5,
    Math.min(r.organicMatter / 6, 1),
    Math.min(r.moisture / 60, 1),
  ];
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 100);
}

export default function TerraLayer() {
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = useCallback(() => {
    setScanState("scanning");
    setTimeout(() => setScanState("complete"), 3000);
  }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false); handleUpload();
  }, [handleUpload]);

  const score = healthScore(mockResults);

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }} className="space-y-6">
      <motion.div variants={fadeUp}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(0,232,122,0.1)", border: "1px solid rgba(0,232,122,0.2)" }}>
            <Leaf className="w-4 h-4" style={{ color: "#00e87a" }} />
          </div>
          <h1 className="text-3xl font-outfit font-black" style={{ color: "rgb(var(--on-surface))" }}>Terra Layer</h1>
        </div>
        <p className="text-sm ml-11" style={{ color: "rgba(186,203,186,0.6)" }}>
          Diagnostic Intelligence — CNN-powered soil analysis
        </p>
      </motion.div>

      {/* Upload Zone */}
      <motion.div variants={fadeUp}>
        <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => scanState === "idle" && handleUpload()}
          className="rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[220px]"
          style={{
            background: dragOver ? "rgba(0,232,122,0.06)" : "rgb(var(--surface-container))",
            border: `2px dashed ${dragOver ? "#00e87a" : "rgba(0,232,122,0.2)"}`,
          }}>
          <AnimatePresence mode="wait">
            {scanState === "idle" && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(0,232,122,0.08)", border: "1px solid rgba(0,232,122,0.2)" }}>
                  <Upload className="w-7 h-7" style={{ color: "#00e87a" }} />
                </div>
                <p className="text-base font-semibold mb-1" style={{ color: "rgb(var(--on-surface))" }}>Drop soil photo here</p>
                <p className="text-sm" style={{ color: "rgba(186,203,186,0.5)" }}>or click to upload · JPG, PNG up to 10MB</p>
                <div className="inline-flex items-center gap-1.5 mt-4 px-3 py-1 rounded-full text-xs"
                  style={{ background: "rgba(0,232,122,0.06)", color: "#00e87a" }}>
                  <Zap className="w-3 h-3" /> AI-powered in seconds
                </div>
              </motion.div>
            )}
            {scanState === "scanning" && (
              <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center w-full">
                <ScanAnimation />
                <p className="text-sm mt-4" style={{ color: "rgba(186,203,186,0.6)" }}>Analysing soil composition…</p>
              </motion.div>
            )}
            {scanState === "complete" && (
              <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(0,232,122,0.1)", border: "1px solid rgba(0,232,122,0.25)" }}>
                  <Check className="w-7 h-7" style={{ color: "#00e87a" }} />
                </div>
                <p className="text-base font-semibold" style={{ color: "rgb(var(--on-surface))" }}>Analysis Complete</p>
                <p className="text-sm mt-1" style={{ color: "rgba(186,203,186,0.5)" }}>Soil health profile ready below</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {scanState === "complete" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
            {/* Health Score Banner */}
            <div className="rounded-2xl p-5 flex items-center gap-5"
              style={{ background: "linear-gradient(135deg, rgba(0,232,122,0.08) 0%, rgba(0,232,122,0.04) 100%)", border: "1px solid rgba(0,232,122,0.2)" }}>
              <div className="relative w-16 h-16 shrink-0">
                <svg viewBox="0 0 60 60" className="w-full h-full -rotate-90">
                  <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(0,232,122,0.1)" strokeWidth="5" />
                  <motion.circle cx="30" cy="30" r="26" fill="none" stroke="#00e87a" strokeWidth="5"
                    strokeLinecap="round" strokeDasharray={2 * Math.PI * 26}
                    initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - score / 100) }}
                    transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-black font-outfit" style={{ color: "#00e87a" }}>{score}</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "rgba(186,203,186,0.5)" }}>Soil Health Score</p>
                <p className="text-2xl font-black font-outfit" style={{ color: "rgb(var(--on-surface))" }}>
                  {score >= 75 ? "Excellent" : score >= 55 ? "Good" : "Needs Attention"}
                </p>
                <p className="text-xs mt-1" style={{ color: "rgba(186,203,186,0.5)" }}>Based on 6 parameters · Sample from today</p>
              </div>
            </div>

            {/* Nutrient Gauges */}
            <div className="rounded-2xl p-6" style={{ background: "rgb(var(--surface-container))", border: "1px solid rgba(0,232,122,0.08)" }}>
              <div className="flex items-center gap-2 mb-6">
                <Leaf className="w-4 h-4" style={{ color: "#00e87a" }} />
                <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "rgba(186,203,186,0.6)" }}>Soil Health Profile</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <NutrientGauge label="Nitrogen (N)"    value={mockResults.nitrogen}      unit="mg/kg" color="#00e87a" />
                <NutrientGauge label="Phosphorus (P)"  value={mockResults.phosphorus}    unit="mg/kg" color="#ffb955" />
                <NutrientGauge label="Potassium (K)"   value={mockResults.potassium}     unit="mg/kg" color="#c49a6c" />
                <NutrientGauge label="pH Level"        value={mockResults.ph}            unit=""      color="#60b4ff" max={14} />
                <NutrientGauge label="Organic Matter"  value={mockResults.organicMatter} unit="%"     color="#c49a6c" max={10} />
                <NutrientGauge label="Moisture"        value={mockResults.moisture}      unit="%"     color="#00e87a" max={100} />
              </div>
            </div>

            {/* Soil Composition */}
            <div className="rounded-2xl p-6" style={{ background: "rgb(var(--surface-container))", border: "1px solid rgba(0,232,122,0.08)" }}>
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-5" style={{ color: "rgba(186,203,186,0.6)" }}>Soil Composition</h2>
              <SoilCompositionBlock />
            </div>

            {/* Recommendations */}
            <div className="rounded-2xl p-6" style={{ background: "rgb(var(--surface-container))", border: "1px solid rgba(0,232,122,0.08)" }}>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4" style={{ color: "#ffb955" }} />
                <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "rgba(186,203,186,0.6)" }}>AI Recommendations</h2>
              </div>
              <div className="space-y-3">
                {recommendations.map(({ icon: Icon, text, color }) => (
                  <div key={text} className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: `${color}08`, borderLeft: `3px solid ${color}` }}>
                    <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color }} />
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(217,230,220,0.8)" }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setScanState("idle")}
              className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold">
              <RefreshCw className="w-4 h-4" /> Scan Another Sample
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ScanAnimation() {
  return (
    <div className="relative w-full max-w-xs mx-auto h-36 rounded-xl overflow-hidden"
      style={{ background: "rgba(0,232,122,0.04)", border: "1px solid rgba(0,232,122,0.15)" }}>
      <div className="absolute inset-0 opacity-20" style={{
        background: "repeating-linear-gradient(0deg, rgba(0,232,122,0.15) 0px, transparent 2px, transparent 8px)"
      }} />
      <motion.div className="absolute top-0 left-0 w-full h-0.5"
        style={{ background: "linear-gradient(90deg, transparent, #00e87a, transparent)", boxShadow: "0 0 16px #00e87a60" }}
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div key={i} className="absolute left-0 w-full h-px"
          style={{ top: `${(i + 1) * 18}%`, background: "rgba(0,232,122,0.15)" }}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: i * 0.3, duration: 0.6 }} />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "rgba(0,232,122,0.4)", borderTopColor: "transparent" }} />
      </div>
    </div>
  );
}

function NutrientGauge({ label, value, unit, color, max = 100 }: {
  label: string; value: number; unit: string; color: string; max?: number;
}) {
  const pct = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * 28;
  return (
    <div className="flex flex-col items-center text-center p-3 rounded-xl"
      style={{ background: `${color}06`, border: `1px solid ${color}18` }}>
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
          <circle cx="32" cy="32" r="28" fill="none" stroke={`${color}18`} strokeWidth="5" />
          <motion.circle cx="32" cy="32" r="28" fill="none" stroke={color} strokeWidth="5"
            strokeLinecap="round" strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (circumference * pct) / 100 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-sm font-black" style={{ color }}>{value}</span>
        </div>
      </div>
      <p className="text-xs font-semibold mt-2" style={{ color: "rgb(var(--on-surface))" }}>{label}</p>
      {unit && <p className="text-xs" style={{ color: "rgba(186,203,186,0.5)" }}>{unit}</p>}
    </div>
  );
}

function SoilCompositionBlock() {
  const layers = [
    { name: "Topsoil", pct: 35, color: "hsl(25 40% 35%)" },
    { name: "Clay",    pct: 25, color: "hsl(15 35% 45%)" },
    { name: "Sand",    pct: 22, color: "hsl(38 40% 65%)" },
    { name: "Silt",    pct: 12, color: "hsl(30 25% 55%)" },
    { name: "Organic", pct: 6,  color: "#00e87a" },
  ];
  return (
    <div className="flex gap-8 items-end flex-wrap">
      <div className="w-28 h-44 rounded-xl overflow-hidden flex flex-col"
        style={{ border: "1px solid rgba(0,232,122,0.15)" }}>
        {layers.map((layer, i) => (
          <motion.div key={layer.name}
            initial={{ height: 0 }} animate={{ height: `${layer.pct}%` }}
            transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
            style={{ background: layer.color }} className="w-full relative">
            <div className="absolute inset-0 opacity-10" style={{
              background: "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.15) 3px, rgba(255,255,255,0.15) 4px)"
            }} />
          </motion.div>
        ))}
      </div>
      <div className="space-y-2.5">
        {layers.map((layer) => (
          <div key={layer.name} className="flex items-center gap-3">
            <div className="w-4 h-4 rounded" style={{ background: layer.color }} />
            <span className="text-sm font-medium" style={{ color: "rgb(var(--on-surface))" }}>{layer.name}</span>
            <span className="font-mono text-sm" style={{ color: "rgba(186,203,186,0.5)" }}>{layer.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
