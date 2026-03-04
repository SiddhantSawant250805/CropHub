import { useState } from "react";
import { SoilUploader } from "@/components/terra/SoilUploader";
import { SoilResults } from "@/components/terra/SoilResults";
import { motion } from "framer-motion";

export default function TerraLayer() {
  const [showResults, setShowResults] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Terra Layer</h1>
        <p className="text-muted-foreground mt-1">Diagnostic Intelligence — Upload soil photos for AI-powered analysis.</p>
      </motion.div>

      <SoilUploader onAnalysisComplete={() => setShowResults(true)} />
      {showResults && <SoilResults />}
    </div>
  );
}
