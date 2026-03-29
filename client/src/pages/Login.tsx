import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Sprout, Mail, Lock, Eye, EyeOff, ArrowRight, Zap, Shield, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth, getApiError } from "@/context/AuthContext";

const highlights = [
  { icon: Zap, text: "AI soil analysis in seconds" },
  { icon: TrendingUp, text: "Predictive crop planning" },
  { icon: Shield, text: "Real-time market arbitrage" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password, remember);
      navigate(from, { replace: true });
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "rgb(var(--surface))" }}>
      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center"
        style={{ background: "rgb(var(--surface-container-low))", borderRight: "1px solid rgba(0,232,122,0.08)" }}>
        {/* Aurora blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(0,232,122,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
          <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(255,185,85,0.1) 0%, transparent 70%)", filter: "blur(60px)" }} />
        </div>
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: "linear-gradient(rgba(0,232,122,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,232,122,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
        {/* Content */}
        <div className="relative z-10 max-w-sm px-12">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(0,232,122,0.12)", border: "1px solid rgba(0,232,122,0.3)" }}>
              <Sprout className="w-5 h-5" style={{ color: "#00e87a" }} />
            </div>
            <span className="text-xl font-bold font-outfit" style={{ color: "rgb(var(--on-surface))" }}>
              Crop<span style={{ color: "#00e87a" }}>Hub</span>
            </span>
          </div>
          <h1 className="text-4xl font-outfit font-black mb-4 leading-tight" style={{ color: "rgb(var(--on-surface))" }}>
            Welcome<br /><span style={{ color: "#00e87a" }}>Back.</span>
          </h1>
          <p className="mb-10 leading-relaxed" style={{ color: "rgba(186,203,186,0.7)" }}>
            Your crops, your data, your decisions — all in one AI-powered place.
          </p>
          <div className="space-y-4">
            {highlights.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: "rgba(0,232,122,0.1)", border: "1px solid rgba(0,232,122,0.2)" }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: "#00e87a" }} />
                </div>
                <span className="text-sm" style={{ color: "rgba(217,230,220,0.75)" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }} className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <Sprout className="w-7 h-7" style={{ color: "#00e87a" }} />
            <span className="text-xl font-outfit font-bold" style={{ color: "rgb(var(--on-surface))" }}>
              Crop<span style={{ color: "#00e87a" }}>Hub</span>
            </span>
          </div>

          <h2 className="text-3xl font-outfit font-black mb-1" style={{ color: "rgb(var(--on-surface))" }}>Log in</h2>
          <p className="mb-8 text-sm" style={{ color: "rgba(186,203,186,0.7)" }}>
            Enter your credentials to access your dashboard.
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm"
              style={{ background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.25)", color: "#ff8080" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium" style={{ color: "rgba(217,230,220,0.8)" }}>Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(186,203,186,0.5)" }} />
                <Input id="email" type="email" placeholder="farmer@crophub.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  required disabled={isSubmitting}
                  className="pl-10 h-12 rounded-xl text-sm"
                  style={{ background: "rgb(var(--surface-container))", borderColor: "rgba(0,232,122,0.15)", color: "rgb(var(--on-surface))" }} />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium" style={{ color: "rgba(217,230,220,0.8)" }}>Password</Label>
                <Link to="#" className="text-xs hover:underline" style={{ color: "#00e87a" }}>Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(186,203,186,0.5)" }} />
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  required disabled={isSubmitting}
                  className="pl-10 pr-10 h-12 rounded-xl text-sm"
                  style={{ background: "rgb(var(--surface-container))", borderColor: "rgba(0,232,122,0.15)", color: "rgb(var(--on-surface))" }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "rgba(186,203,186,0.5)" }}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <Checkbox id="remember" checked={remember}
                onCheckedChange={(v) => setRemember(Boolean(v))} disabled={isSubmitting} />
              <Label htmlFor="remember" className="text-sm cursor-pointer select-none" style={{ color: "rgba(186,203,186,0.7)" }}>
                Remember me
              </Label>
            </div>

            <motion.button type="submit" disabled={isSubmitting}
              whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
              className="btn-primary w-full h-12 rounded-xl font-semibold flex items-center justify-center gap-2">
              {isSubmitting ? (
                <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Logging in…</>
              ) : (
                <>Log in <ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: "rgba(0,232,122,0.1)" }} />
            <span className="text-xs" style={{ color: "rgba(186,203,186,0.4)" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(0,232,122,0.1)" }} />
          </div>

          <button disabled className="w-full h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-medium opacity-50 cursor-not-allowed transition-colors"
            style={{ background: "rgb(var(--surface-container))", border: "1px solid rgba(0,232,122,0.12)", color: "rgba(217,230,220,0.7)" }}>
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <p className="text-center text-sm mt-8" style={{ color: "rgba(186,203,186,0.6)" }}>
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold hover:underline" style={{ color: "#00e87a" }}>Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}