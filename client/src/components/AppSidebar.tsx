import { useState, useRef, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Layers, BarChart3, Truck,
  ChevronLeft, ChevronRight, Sprout, Settings,
  LogOut, ChevronUp,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { title: "Dashboard",    path: "/dashboard", icon: LayoutDashboard },
  { title: "Terra Layer",  path: "/terra",      icon: Layers },
  { title: "Fathom Layer", path: "/fathom",     icon: BarChart3 },
  { title: "Logistics",    path: "/logistics",  icon: Truck },
];

function getInitials(name: string): string {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

function getAvatarHue(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
}

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLogout() { setMenuOpen(false); logout(); navigate("/login", { replace: true }); }
  function handleSettings() { setMenuOpen(false); navigate("/settings"); }

  const initials = user ? getInitials(user.name) : "?";
  const avatarHue = user ? getAvatarHue(user.name) : 153;

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 248 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen sticky top-0 flex flex-col z-50 overflow-visible shrink-0 glass-card"
      style={{ background: "#0a0f0d", borderRight: "1px solid rgba(0, 232, 122, 0.1)" }}
    >
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-6 h-20 border-b shrink-0" style={{ borderColor: "rgba(0, 232, 122, 0.1)" }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(0, 232, 122, 0.1)", border: "1px solid rgba(0, 232, 122, 0.2)" }}>
          <Sprout className="w-5 h-5 text-[#00e87a]" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="text-2xl font-black whitespace-nowrap overflow-hidden font-outfit"
              style={{ color: "white" }}
            >
              Crop<span className="text-[#00e87a]">Hub</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 py-4 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group"
              style={{
                background: isActive ? "rgba(0, 232, 122, 0.1)" : "transparent",
                color: isActive ? "#00e87a" : "rgba(255, 255, 255, 0.4)",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255, 255, 255, 0.03)";
                  (e.currentTarget as HTMLElement).style.color = "white";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255, 255, 255, 0.4)";
                }
              }}
            >
              {/* Active indicator bar */}
              {isActive && (
                <motion.div
                  layoutId="activeBar"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full"
                  style={{ background: "#00e87a", boxShadow: "0 0 15px rgba(0, 232, 122, 0.5)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <item.icon className="w-4.5 h-4.5 shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-bold tracking-wide whitespace-nowrap overflow-hidden"
                    >
                      {item.title}
                    </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          );
        })}
      </nav>

      {/* ── User card ── */}
      <div className="px-2 pb-2 border-t relative" ref={menuRef} style={{ borderColor: "rgba(var(--primary), 0.1)" }}>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-full left-2 right-2 mb-2 rounded-[1.5rem] overflow-hidden shadow-2xl z-50 border border-white/5"
              style={{
                background: "#0e1412",
              }}
            >
              <div className="px-5 py-4 border-b border-white/5">
                <p className="text-[10px] uppercase tracking-widest font-bold text-white/20 mb-1">Signed in as</p>
                <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                <p className="text-xs text-white/40 truncate mt-0.5">{user?.email}</p>
              </div>
              <button onClick={handleSettings}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-bold text-white/60 transition-all hover:bg-white/5 hover:text-[#00e87a]">
                <Settings className="w-4 h-4 shrink-0" />
                <span>Account Settings</span>
              </button>
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all border-t border-white/5">
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Log out</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="w-full mt-4 flex items-center gap-3 px-3 py-3 rounded-2xl transition-all"
          style={{ background: menuOpen ? "rgba(255, 255, 255, 0.05)" : "transparent" }}
          onMouseEnter={(e) => { if (!menuOpen) (e.currentTarget as HTMLElement).style.background = "rgba(255, 255, 255, 0.03)"; }}
          onMouseLeave={(e) => { if (!menuOpen) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 text-white ring-2 ring-white/10"
            style={{ background: `hsl(${avatarHue}, 60%, 30%)` }}
          >
            {initials}
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0 text-left">
                <p className="text-sm font-bold text-white truncate leading-tight">
                  {user?.name ?? "Account"}
                </p>
                <p className="text-[10px] font-bold text-[#00e87a] uppercase tracking-widest truncate mt-0.5 opacity-60">
                  Premium Tier
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="shrink-0">
                <ChevronUp className="w-4 h-4 text-white/20 transition-transform"
                  style={{ transform: menuOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* ── Collapse toggle ── */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 transition-all border-t border-white/5 text-white/20 hover:text-[#00e87a] hover:bg-white/5"
      >
        {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>
    </motion.aside>
  );
}