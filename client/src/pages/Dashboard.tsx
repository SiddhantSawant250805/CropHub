import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Command Center</h1>
        <p className="text-muted-foreground mt-1">Welcome back. Here's your farm at a glance.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <WeatherWidget />
        <SummaryCards />
      </div>
    </div>
  );
}
