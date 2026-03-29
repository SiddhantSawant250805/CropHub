import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Cloud, Droplets, Thermometer, Wind, Sprout, TrendingUp,
  AlertTriangle, ArrowUpRight, Layers, BarChart3, Truck,
  FileText, ArrowRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

const statusColors: Record<string, string> = {
  Growing:    "#00e87a",
  Planted:    "#ffb955",
  Harvesting: "#c49a6c",
};

const quickActions = [
  { label: "Scan Soil",      icon: Layers,    path: "/terra",     color: "#00e87a",  bg: "rgba(0,232,122,0.08)" },
  { label: "Plan Budget",    icon: BarChart3,  path: "/fathom",    color: "#ffb955",  bg: "rgba(255,185,85,0.08)" },
  { label: "Check Markets",  icon: Truck,      path: "/logistics", color: "#c49a6c",  bg: "rgba(196,154,108,0.08)" },
  { label: "View Reports",   icon: FileText,   path: "#",          color: "rgba(186,203,186,0.6)", bg: "rgba(186,203,186,0.05)" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6 p-1">
      {/* ── Header ── */}
      <motion.div variants={fadeUp} className="flex items-start justify-between">
        <div>
          <p className="text-sm mb-0.5" style={{ color: "rgba(186,203,186,0.5)" }}>{today}</p>
          <h1 className="text-3xl font-outfit font-black" style={{ color: "rgb(var(--on-surface))" }}>
            {greeting}{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
          </h1>
          <p className="text-sm mt-1" style={{ color: "rgba(186,203,186,0.6)" }}>
            Here's an overview of your agricultural operations.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ background: "rgba(0,232,122,0.08)", border: "1px solid rgba(0,232,122,0.2)", color: "#00e87a" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          Live data
        </div>
      </motion.div>

      {/* ── Weather Widget ── */}
      <motion.div variants={fadeUp} className="rounded-2xl p-6"
        style={{ background: "rgb(var(--surface-container))", border: "1px solid rgba(0,232,122,0.08)" }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(186,203,186,0.5)" }}>
            Today's Conditions
          </h2>
          <span className="text-xs" style={{ color: "rgba(186,203,186,0.4)" }}>Pune, Maharashtra · Updated now</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Thermometer, label: "Temperature", value: "28°C", sub: "Feels like 31°C", color: "#ff8c42" },
            { icon: Droplets,    label: "Humidity",    value: "64%",  sub: "Moderate",        color: "#60b4ff" },
            { icon: Cloud,       label: "Rainfall",    value: "12mm", sub: "Expected today",  color: "#a0c4ff" },
            { icon: Wind,        label: "Wind",        value: "14 km/h", sub: "NE Direction", color: "#00e87a" },
          ].map(({ icon: Icon, label, value, sub, color }) => (
            <div key={label} className="flex flex-col gap-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: `${color}14` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "rgba(186,203,186,0.5)" }}>{label}</span>
              </div>
              <p className="text-2xl font-black font-outfit" style={{ color: "rgb(var(--on-surface))" }}>{value}</p>
              <p className="text-xs" style={{ color: "rgba(186,203,186,0.5)" }}>{sub}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Active Crop Plans */}
        <motion.div variants={fadeUp} className="rounded-2xl p-5"
          style={{ background: "rgb(var(--surface-container))", border: "1px solid rgba(0,232,122,0.08)" }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(186,203,186,0.5)" }}>Active Crop Plans</p>
              <p className="text-4xl font-black font-outfit" style={{ color: "rgb(var(--on-surface))" }}>4</p>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(0,232,122,0.1)", border: "1px solid rgba(0,232,122,0.2)" }}>
              <Sprout className="w-5 h-5" style={{ color: "#00e87a" }} />
            </div>
          </div>
          <div className="space-y-2.5">
            {[
              { name: "Maize",   acres: "12", status: "Growing" },
              { name: "Soybean", acres: "8",  status: "Planted" },
              { name: "Wheat",   acres: "5",  status: "Harvesting" },
              { name: "Rice",    acres: "10", status: "Growing" },
            ].map(({ name, acres, status }) => (
              <div key={name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: statusColors[status] }} />
                  <span className="font-medium" style={{ color: "rgb(var(--on-surface))" }}>{name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs" style={{ color: "rgba(186,203,186,0.5)" }}>{acres} ac</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: `${statusColors[status]}14`, color: statusColors[status] }}>
                    {status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Market Alerts */}
        <motion.div variants={fadeUp} className="rounded-2xl p-5"
          style={{ background: "rgb(var(--surface-container))", border: "1px solid rgba(0,232,122,0.08)" }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(186,203,186,0.5)" }}>Market Alerts</p>
              <p className="text-4xl font-black font-outfit" style={{ color: "rgb(var(--on-surface))" }}>3</p>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(255,185,85,0.1)", border: "1px solid rgba(255,185,85,0.2)" }}>
              <TrendingUp className="w-5 h-5" style={{ color: "#ffb955" }} />
            </div>
          </div>
          <div className="space-y-3">
            {[
              { type: "up",      message: "Maize prices up 8% at Mandi B" },
              { type: "warning", message: "Soybean supply surplus expected" },
              { type: "up",      message: "Wheat demand rising in Region C" },
            ].map(({ type, message }) => (
              <div key={message} className="flex items-start gap-3 p-2.5 rounded-lg"
                style={{ background: type === "up" ? "rgba(0,232,122,0.04)" : "rgba(255,185,85,0.04)",
                         borderLeft: `2px solid ${type === "up" ? "#00e87a" : "#ffb955"}` }}>
                {type === "up"
                  ? <TrendingUp className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "#00e87a" }} />
                  : <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "#ffb955" }} />}
                <span className="text-xs leading-relaxed" style={{ color: "rgba(217,230,220,0.8)" }}>{message}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Season Profit */}
        <motion.div variants={fadeUp} className="rounded-2xl p-5"
          style={{ background: "rgb(var(--surface-container))", border: "1px solid rgba(0,232,122,0.08)" }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "rgba(186,203,186,0.5)" }}>Season Profit</p>
              <p className="text-3xl font-black font-outfit" style={{ color: "#ffb955" }}>₹4,82,000</p>
            </div>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(0,232,122,0.1)", border: "1px solid rgba(0,232,122,0.2)" }}>
              <ArrowUpRight className="w-5 h-5" style={{ color: "#00e87a" }} />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs">
              <span style={{ color: "rgba(186,203,186,0.6)" }}>Budget utilized</span>
              <span className="font-mono font-semibold" style={{ color: "#00e87a" }}>67%</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(0,232,122,0.08)" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: "67%" }}
                transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #00e87a, #85ffa7)" }} />
            </div>
            <div className="flex justify-between text-xs mt-3" style={{ color: "rgba(186,203,186,0.5)" }}>
              <span>₹0</span><span>₹7,20,000 target</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Quick Actions ── */}
      <motion.div variants={fadeUp}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "rgba(186,203,186,0.4)" }}>Quick Actions</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map(({ label, icon: Icon, path, color, bg }) => (
            <Link key={label} to={path}
              className="group flex items-center gap-3 p-4 rounded-2xl transition-all duration-200 hover:scale-[1.02]"
              style={{ background: "rgb(var(--surface-container))", border: "1px solid rgba(0,232,122,0.06)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = `${color}30`; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,232,122,0.06)"; }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110"
                style={{ background: bg }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: "rgb(var(--on-surface))" }}>{label}</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                style={{ color }} />
            </Link>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
