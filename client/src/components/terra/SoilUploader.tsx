import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image, CheckCircle } from "lucide-react";

interface SoilUploaderProps {
  onAnalysisComplete: () => void;
}

export function SoilUploader({ onAnalysisComplete }: SoilUploaderProps) {
  const [state, setState] = useState<"idle" | "scanning" | "done">("idle");
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = useCallback(() => {
    setState("scanning");
    setTimeout(() => {
      setState("done");
      onAnalysisComplete();
    }, 3000);
  }, [onAnalysisComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-8"
    >
      <h3 className="font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
        <Image className="h-5 w-5 text-primary" />
        Soil Photo Analysis
      </h3>

      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(); }}
            onClick={handleUpload}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
              dragOver ? "border-primary bg-accent/50 scale-[1.02]" : "border-border hover:border-primary/50 hover:bg-muted/30"
            }`}
          >
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-foreground font-medium">Drop soil photo here or click to upload</p>
            <p className="text-sm text-muted-foreground mt-1">Supports JPG, PNG up to 10MB</p>
          </motion.div>
        )}

        {state === "scanning" && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative rounded-xl overflow-hidden bg-muted/30 h-64 flex items-center justify-center"
          >
            {/* Scan line animation */}
            <motion.div
              className="absolute left-0 right-0 h-1 scan-line"
              style={{ height: "4px" }}
              animate={{ top: ["0%", "95%", "0%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="text-center z-10">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-foreground font-semibold">Analyzing soil composition...</p>
              <p className="text-sm text-muted-foreground mt-1">CNN model processing image data</p>
            </div>
          </motion.div>
        )}

        {state === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl bg-accent/30 p-8 text-center"
          >
            <CheckCircle className="h-12 w-12 mx-auto text-primary mb-3" />
            <p className="text-foreground font-semibold">Analysis Complete</p>
            <p className="text-sm text-muted-foreground">Scroll down to view your Soil Health Profile</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
