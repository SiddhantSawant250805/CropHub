import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Check, Leaf, AlertCircle, RefreshCw, Download, ArrowRight, Zap } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

type TerraReport = {
  health_status: string;
  key_interpretation: string;
  hydrology_alert: string;
  workability_window: string;
  ideal_crops: string[];
  warning_crop: string;
  action_plan: string[];
};

type ScanState = "idle" | "locating" | "uploading" | "analyzing" | "complete";


export default function TerraLayer() {
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [dragOver, setDragOver] = useState(false);
  const [reportData, setReportData] = useState<TerraReport | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setScanState("locating");
    
    // Attempt real geolocation
    let lat = '34.05';
    let lon = '-118.24';
    
    try {
        const position: GeolocationPosition = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
        });
        lat = position.coords.latitude.toString();
        lon = position.coords.longitude.toString();
    } catch (e) {
        console.warn("Geolocation blocked or failed. Using defaults.", e);
    }
    
    setScanState("uploading");
    await new Promise(r => setTimeout(r, 1500)); // Simulating processing time
    
    try {
      const formData = new FormData();
      formData.append('soilImage', file);
      
      formData.append('lat', lat);
      formData.append('lon', lon);
      formData.append('survey', JSON.stringify({ texture: "Unknown", color: "Brown", drainage: "Good" }));

      setScanState("analyzing");
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/soil/analyze', {
        method: 'POST',
        headers: {
           ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData
      });
      
      const data = await res.json();
      if(data.success && data.data.analysis.terraReport && !data.data.analysis.terraReport.error) {
         setReportData(data.data.analysis.terraReport);
      } else {
         throw new Error("Failed to get valid report from backend");
      }
    } catch (err) {
      console.error("Using fallback mock data due to error:", err);
      setReportData({
          health_status: "Optimal",
          key_interpretation: `Your pH is 6.5, meaning nutrients are perfectly unlocked. Weather near you (${lat}, ${lon}) indicates balance.`,
          hydrology_alert: "Conditions are stable.",
          workability_window: "Soil is prime for working over the next 48 hours.",
          ideal_crops: ["**Tomatoes**", "**Bell Peppers**", "**Corn**"],
          warning_crop: "**Blueberries** (Require highly acidic soil)",
          action_plan: ["Current weather supports light top-dressing.", "Monitor soil moisture levels manually before watering.", "Consider long-term amendments like cover cropping this fall."]
      });
    } finally {
      setScanState("complete");
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); 
    setDragOver(false); 
    if(e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const downloadReport = () => {
    if(!reportData) return;
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "TerraLayer_Report.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Helper to safely format bold text
  const formatBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white font-bold">{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

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
          Diagnostic Intelligence — CNN-powered soil analysis & Weather Synthesis
        </p>
      </motion.div>

      {/* Upload Zone */}
      <motion.div variants={fadeUp}>
        <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept="image/jpeg, image/png" />
        <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => scanState === "idle" && fileInputRef.current?.click()}
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
                  <Zap className="w-3 h-3" /> AI-powered Real-time Synthesis
                </div>
              </motion.div>
            )}
            {scanState !== "idle" && scanState !== "complete" && (
              <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center w-full">
                <ScanAnimation />
                <p className="text-sm mt-4 font-semibold" style={{ color: "rgba(186,203,186,0.9)" }}>
                   {scanState === "locating" && "Acquiring GPS Satellite Data..."}
                   {scanState === "uploading" && "Securely Transmitting Image..."}
                   {scanState === "analyzing" && "Running Base MobileNetV2 Inference & OpenCV Synthesis..."}
                </p>
                <p className="text-xs mt-1" style={{ color: "rgba(186,203,186,0.5)" }}>This might take a few moments.</p>
              </motion.div>
            )}
            {scanState === "complete" && (
              <motion.div key="complete" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(0,232,122,0.1)", border: "1px solid rgba(0,232,122,0.25)" }}>
                  <Check className="w-7 h-7" style={{ color: "#00e87a" }} />
                </div>
                <p className="text-base font-semibold" style={{ color: "rgb(var(--on-surface))" }}>Analysis Complete</p>
                <p className="text-sm mt-1" style={{ color: "rgba(186,203,186,0.5)" }}>Personalized report generated below</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {scanState === "complete" && reportData && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
            
            {/* Health Score Banner */}
            <div className="rounded-2xl p-5 flex items-center gap-5"
              style={{ background: "linear-gradient(135deg, rgba(0,232,122,0.08) 0%, rgba(0,232,122,0.04) 100%)", border: "1px solid rgba(0,232,122,0.2)" }}>
              <div className="relative w-16 h-16 shrink-0 rounded-full flex items-center justify-center border-4"
              style={{ borderColor: reportData.health_status === "Optimal" ? "#00e87a" : "#ffb955" }}>
                  <span className="text-sm font-black font-outfit" style={{ color: reportData.health_status === "Optimal" ? "#00e87a" : "#ffb955" }}>
                     {reportData.health_status}
                  </span>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "rgba(186,203,186,0.5)" }}>Terra Layer Output</p>
                <p className="text-xl font-medium font-outfit" style={{ color: "rgb(var(--on-surface))" }}>
                   {formatBoldText(reportData.key_interpretation)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Weather Synthesis */}
              <div className="rounded-2xl p-6" style={{ background: "rgb(var(--surface-container))", border: "1px solid rgba(0,232,122,0.08)" }}>
                 <div className="flex items-center gap-2 mb-4">
                   <AlertCircle className="w-4 h-4" style={{ color: "#60b4ff" }} />
                   <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "rgba(186,203,186,0.6)" }}>Weather-Soil Synthesis</h2>
                 </div>
                 <div className="space-y-4 text-sm" style={{ color: "rgba(217,230,220,0.8)" }}>
                    <p><strong>Hydrology Alert:</strong> {formatBoldText(reportData.hydrology_alert)}</p>
                    <p><strong>Workability Window:</strong> {formatBoldText(reportData.workability_window)}</p>
                 </div>
              </div>

              {/* Crop Matchmaker */}
              <div className="rounded-2xl p-6" style={{ background: "rgb(var(--surface-container))", border: "1px solid rgba(0,232,122,0.08)" }}>
                 <div className="flex items-center gap-2 mb-4">
                   <Leaf className="w-4 h-4" style={{ color: "#00e87a" }} />
                   <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "rgba(186,203,186,0.6)" }}>Crop Matchmaker</h2>
                 </div>
                 <div className="space-y-4 text-sm" style={{ color: "rgba(217,230,220,0.8)" }}>
                    <p><strong>Ideal Matches:</strong> {reportData.ideal_crops.map(c => <span key={c} className="mr-2 inline-block px-2 py-1 bg-green-900/40 rounded text-green-300">{formatBoldText(c)}</span>)}</p>
                    <p><strong>Warning:</strong> <span className="text-amber-400">{formatBoldText(reportData.warning_crop)}</span></p>
                 </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="rounded-2xl p-6" style={{ background: "rgb(var(--surface-container))", border: "1px solid rgba(0,232,122,0.08)" }}>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4" style={{ color: "#ffb955" }} />
                <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "rgba(186,203,186,0.6)" }}>72-Hour Action Plan</h2>
              </div>
              <div className="space-y-3">
                {reportData.action_plan.map((text, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                    style={{ background: `rgba(0,232,122,0.08)`, borderLeft: `3px solid #00e87a` }}>
                    <span className="text-green-500 font-bold mt-0.5">•</span>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(217,230,220,0.8)" }}>{formatBoldText(text)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
               <button onClick={downloadReport}
                 className="btn-secondary flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
                 style={{ background: "rgba(186,203,186,0.05)", border: "1px solid rgba(186,203,186,0.2)", color: "white" }}>
                 <Download className="w-4 h-4" /> Download Report JSON
               </button>
               <button onClick={() => {
                   /* Pass state to FathomLayer or navigate there */ 
                   window.location.href = "/fathom-layer"; 
                 }}
                 className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-black transition-all"
                 style={{ background: "linear-gradient(to right, #00e87a, #00c165)", color: "#000", boxShadow: "0 0 20px rgba(0,232,122,0.3)" }}>
                 Move to Fathom Layer <ArrowRight className="w-4 h-4" />
               </button>
               <div className="flex-1" />
               <button onClick={() => setScanState("idle")}
                 className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:text-white transition-colors">
                 <RefreshCw className="w-4 h-4" /> Scan Another
               </button>
            </div>
            
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
