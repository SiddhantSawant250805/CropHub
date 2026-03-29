import { useRef, useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  motion, AnimatePresence, useScroll, useTransform, useInView, useSpring, useMotionValue,
} from "framer-motion";
import {
  Sprout, Layers, BarChart3, Truck, ArrowRight, Leaf, TrendingUp, Shield, Zap,
  ChevronDown, Settings, LogOut, LayoutDashboard, Scan, Globe, Star, CheckCircle2,
  Activity, Cpu, Twitter, Github, Linkedin
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/* ─── Scroll-triggered section wrapper ─── */
function ScrollSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number; }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section ref={ref} initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut", delay }} className={className}>
      {children}
    </motion.section>
  );
}

/* ─── 3D tilt card on mouse hover ─── */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string; }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }, [x, y]);
  const handleMouseLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.div ref={ref} style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── Animated particle canvas ─── */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 0.3, alpha: Math.random(), fadeDir: Math.random() > 0.5 ? 1 : -1,
    }));
    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.alpha += p.fadeDir * 0.003;
        if (p.alpha >= 1 || p.alpha <= 0) p.fadeDir *= -1;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 232, 122, ${p.alpha * 0.6})`; ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 232, 122, ${(1 - dist / 100) * 0.08})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />;
}

/* ─── Animated counter ─── */
function AnimatedCounter({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string; }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let start = 0; const increment = target / (1800 / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); } else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target]);
  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

const stats = [
  { value: 40, suffix: "%", label: "Yield Increase", icon: TrendingUp },
  { prefix: "₹", value: 2, suffix: ".4L", label: "Avg. Savings", icon: Globe },
  { value: 12, suffix: "K+", label: "Active Farmers", icon: Leaf },
  { value: 98, suffix: "%", label: "Accuracy Rate", icon: Activity },
];

const features = [
  {
    icon: Layers, title: "Terra Layer", description: "AI-powered soil diagnostics. Upload a photo and get instant NPK, pH, and health analysis for optimized growth.",
    accent: "text-emerald-accent", bg: "bg-emerald-accent/10", border: "border-emerald-accent/20", to: "/terra", badge: "Soil AI",
  },
  {
    icon: BarChart3, title: "Fathom Layer", description: "Predictive crop allocation. Enter your budget and land size to get an optimised planting plan backed by data.",
    accent: "text-harvest-gold", bg: "bg-harvest-gold/10", border: "border-harvest-gold/20", to: "/fathom", badge: "Crop AI",
  },
  {
    icon: Truck, title: "Logistics Hub", description: "Market arbitrage engine. Compare real-time pricing across nearby markets to maximise profit on every harvest.",
    accent: "text-loam-warm", bg: "bg-loam-warm/10", border: "border-loam-warm/20", to: "/logistics", badge: "Market AI",
  },
];

/* ═══════════════════════════════════════════════════════════════════════ */
export default function Landing() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false); }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const initials = user ? user.name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") : "";
  const avatarHue = user ? Math.abs([...user.name].reduce((h, c) => c.charCodeAt(0) + ((h << 5) - h), 0)) % 360 : 153;

  return (
    <div className="landing-page min-h-screen overflow-x-hidden">
      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <motion.nav className="fixed top-0 w-full z-50 transition-all duration-500"
        animate={scrolled ? { backgroundColor: "rgba(var(--surface-rgb), 0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,232,122,0.1)" }
                          : { backgroundColor: "transparent", backdropFilter: "blur(0px)", borderBottom: "1px solid transparent" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-accent/10 border border-emerald-accent/30 flex items-center justify-center group-hover:bg-emerald-accent/20 transition-colors">
              <Sprout className="w-4.5 h-4.5 text-emerald-accent" />
            </div>
            <span className="text-lg font-bold text-white font-outfit tracking-tight">
              Crop<span className="text-emerald-accent">Hub</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            {["#features", "#how-it-works", "#impact"].map((href, i) => (
              <a key={href} href={href} className="text-surface-variant hover:text-white transition-colors relative group">
                {["Features", "How It Works", "Impact"][i]}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-emerald-accent group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative" ref={menuRef}>
                <button onClick={() => setMenuOpen((o) => !o)} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-container transition-colors">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ring-2 ring-emerald-accent/30" style={{ background: `hsl(${avatarHue}, 60%, 30%)` }}>{initials}</div>
                  <ChevronDown className={`w-3.5 h-3.5 text-surface-variant transition-transform ${menuOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      className="absolute right-0 mt-2 w-56 rounded-xl border border-emerald-accent/10 bg-surface-container-high/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-white/5">
                        <p className="text-xs text-surface-variant uppercase tracking-wider font-medium">Signed in as</p>
                        <p className="text-sm font-semibold text-white truncate mt-0.5">{user.name}</p>
                      </div>
                       <button onClick={() => navigate("/dashboard")} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-surface-container-highest transition-colors">
                        <LayoutDashboard className="w-4 h-4 text-surface-variant" /> Dashboard
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-surface-variant hover:text-white transition-colors px-4 py-2">Log in</Link>
                <Link to="/signup" className="btn-primary text-sm font-semibold px-5 py-2 rounded-lg">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen pt-24 pb-16 overflow-hidden bg-surface flex items-center">
        {/* Aurora */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, rgba(0,232,122,0.15) 0%, transparent 70%)", filter: "blur(60px)" }} />
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }} className="absolute top-1/4 -right-48 w-[500px] h-[500px] rounded-full" style={{ background: "radial-gradient(circle, rgba(245,166,35,0.1) 0%, transparent 70%)", filter: "blur(60px)" }} />
        </div>
        <ParticleField />
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "linear-gradient(#00e87a 1px, transparent 1px), linear-gradient(90deg, #00e87a 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
          {/* Hero Left 60% */}
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="lg:col-span-7 pt-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8" style={{ background: "rgba(0, 232, 122, 0.08)", border: "1px solid rgba(0, 232, 122, 0.25)", color: "#00E87A" }}>
              <Zap className="w-3.5 h-3.5" /> AI-Powered Agriculture Platform
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-5xl md:text-7xl font-outfit font-black text-white leading-[1.05] mb-6 tracking-tight">
              Farm Smarter.<br /><span className="hero-gradient-text">Harvest More.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="text-lg text-surface-variant max-w-xl mb-10 leading-relaxed">
              CropHub combines soil diagnostics, predictive crop planning, and market intelligence into one AI decision engine — built for the modern farmer.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/signup">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="btn-primary flex items-center gap-2 text-base px-8 py-3.5 rounded-xl font-bold">
                  Start Free <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <div className="flex items-center gap-4 text-xs text-surface-variant ml-4">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-accent" /> No credit card</span>
                <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-accent" /> SOC 2 compliant</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Right 40% (Mockup) */}
          <motion.div initial={{ opacity: 0, scale: 0.9, rotateY: 15 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:block lg:col-span-5 relative perspective-[1000px]">
            <TiltCard>
              <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden glass-card border border-emerald-accent/20 p-6 flex flex-col shadow-2xl shadow-emerald-accent/10">
                <div className="flex items-center justify-between mb-8">
                  <div className="w-10 h-10 rounded-xl bg-emerald-accent/20 flex items-center justify-center"><Leaf className="w-5 h-5 text-emerald-accent" /></div>
                  <span className="text-xs font-mono font-bold text-emerald-accent px-3 py-1 bg-emerald-accent/10 rounded-full border border-emerald-accent/20">Live Sync</span>
                </div>
                <div className="space-y-4 flex-1">
                  <div className="h-24 rounded-2xl bg-surface-container/50 border border-white/5 p-4">
                    <p className="text-xs text-surface-variant mb-2">Soil Health Score</p>
                    <div className="flex items-end gap-3"><span className="text-3xl font-black text-white font-outfit">92</span><span className="text-sm text-emerald-accent font-semibold mb-1">+4%</span></div>
                  </div>
                  <div className="h-24 rounded-2xl bg-surface-container/50 border border-white/5 p-4">
                    <p className="text-xs text-surface-variant mb-2">Optimal Crop</p>
                    <div className="flex justify-between items-center"><span className="text-xl font-bold text-harvest-gold">Soybean</span><span className="text-xs text-surface-variant">80% Match</span></div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full mt-3"><div className="h-full bg-harvest-gold rounded-full w-[80%]" /></div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────── */}
      <div className="py-6 border-y border-white/5 bg-surface-container-low flex overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-surface-container-low to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-surface-container-low to-transparent z-10" />
        <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 20, ease: "linear", repeat: Infinity }} className="flex whitespace-nowrap items-center min-w-max">
           {[...Array(2)].map((_, i) => (
             <div key={i} className="flex gap-16 px-8 items-center">
               {["Trusted by top agritech partners", "Over 12,000 acres monitored daily", "₹2.4L average annual savings per farm", "98% diagnostic accuracy via CNN"].map(t => (
                 <span key={t} className="text-sm font-semibold uppercase tracking-widest text-surface-variant/70 flex items-center gap-3">
                   <Star className="w-3 h-3 text-emerald-accent" /> {t}
                 </span>
               ))}
             </div>
           ))}
        </motion.div>
      </div>

      {/* ── STATS ────────────────────────────────────────── */}
      <section id="impact" className="py-24 px-6 bg-surface">
        <div className="max-w-5xl mx-auto">
          <ScrollSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-emerald-accent/10">
              {stats.map((s, i) => (
                <div key={s.label} className="bg-surface-container p-8 text-center group hover:bg-surface-container-high transition-colors">
                  <s.icon className="w-5 h-5 mx-auto mb-3 text-emerald-accent opacity-60 group-hover:opacity-100 transition-opacity" />
                  <div className="text-4xl md:text-5xl font-black text-white mb-1 font-outfit">
                    <AnimatedCounter target={s.value} suffix={s.suffix} prefix={s.prefix} />
                  </div>
                  <div className="text-xs text-surface-variant font-medium uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </ScrollSection>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section id="features" className="py-28 px-6 bg-surface-container-low relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollSection className="text-center mb-16">
            <span className="text-xs font-semibold text-harvest-gold uppercase tracking-[0.2em] font-mono">Capabilities</span>
            <h2 className="text-4xl md:text-5xl font-outfit font-black text-white mt-3 mb-4 tracking-tight">Three Layers of <span className="text-emerald-accent">Intelligence</span></h2>
          </ScrollSection>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <ScrollSection key={f.title} delay={i * 0.1}>
                <TiltCard className="h-full">
                  <div className={`glass-card h-full p-8 flex flex-col rounded-3xl border ${f.border} hover:-translate-y-2 transition-transform duration-300 group`}
                    style={{ background: "rgb(var(--surface-container))" }}>
                    <div className="flex items-center gap-4 mb-6">
                       <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${f.bg} group-hover:scale-110 transition-transform`}><f.icon className={`w-6 h-6 ${f.accent}`} /></div>
                       <span className={`text-xs font-mono font-semibold px-3 py-1 rounded-full ${f.bg} ${f.accent} border ${f.border}`}>{f.badge}</span>
                    </div>
                    <h3 className="text-2xl font-outfit font-bold text-white mb-3">{f.title}</h3>
                    <p className="text-surface-variant text-sm flex-1 mb-8">{f.description}</p>
                    
                    {/* Mini viz */}
                    <div className="h-24 rounded-xl mb-6 bg-black/20 border border-white/5 flex items-end gap-2 p-4 justify-between" style={{ borderBottom: `2px solid ${i===0?'#00e87a':i===1?'#ffb955':'#c49a6c'}` }}>
                       {[40, 70, 45, 90, 60].map((h, j) => (
                         <motion.div key={j} className="w-full rounded-t-sm" style={{ background: i===0?'#00e87a':i===1?'#ffb955':'#c49a6c', opacity: j===3?1:0.3 }}
                           initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }} transition={{ delay: 0.2 + j * 0.1 }} />
                       ))}
                    </div>

                    <Link to={f.to} className={`inline-flex items-center gap-2 text-sm font-semibold ${f.accent} hover:gap-3 transition-all group-hover:opacity-100 opacity-70`}>
                      Explore <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </TiltCard>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section id="how-it-works" className="py-28 px-6 bg-surface">
        <div className="max-w-6xl mx-auto">
          <ScrollSection className="text-center mb-16">
            <span className="text-xs font-semibold text-emerald-accent uppercase tracking-[0.2em] font-mono">Process</span>
            <h2 className="text-4xl md:text-5xl font-outfit font-black text-white mt-3 tracking-tight">How CropHub Works</h2>
          </ScrollSection>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Scan Soil", desc: "Upload a photo or enter data. AI models analyze composition instantly.", icon: Scan, color: "text-emerald-accent", bg: "bg-emerald-accent/10", border: "border-emerald-accent/20" },
              { num: "02", title: "Plan Target", desc: "Generate optimal crop mix mapping based on your budget & land size.", icon: Cpu, color: "text-harvest-gold", bg: "bg-harvest-gold/10", border: "border-harvest-gold/20" },
              { num: "03", title: "Sell High", desc: "Track markets to find the most profitable buyer accounting for transport.", icon: Truck, color: "text-loam-warm", bg: "bg-loam-warm/10", border: "border-loam-warm/20" }
            ].map((step, i) => (
              <ScrollSection key={step.num} delay={i * 0.1}>
                 <div className="p-8 rounded-3xl bg-surface-container border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
                    <span className="absolute -right-4 -top-6 text-9xl font-black text-white/[0.03] font-outfit group-hover:text-white/[0.05] transition-colors">{step.num}</span>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${step.border} ${step.bg}`}>
                       <step.icon className={`w-7 h-7 ${step.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-sm text-surface-variant relative z-10">{step.desc}</p>
                 </div>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────── */}
      <section className="py-28 px-6 bg-surface-container-low relative">
        <div className="max-w-6xl mx-auto">
          <ScrollSection className="text-center mb-16">
            <span className="text-xs font-semibold text-harvest-gold uppercase tracking-[0.2em] font-mono">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-outfit font-black text-white mt-3 tracking-tight">Farmers Love <span className="text-emerald-accent">CropHub</span></h2>
          </ScrollSection>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Ravi Kumar", role: "Wheat Farmer", qt: "Saved lakhs in fertilizer costs. The CNN accuracy is unbelievable.", hue: 153 },
              { name: "Priya Sharma", role: "Rice Farmer", qt: "Found a buyer paying 18% more via Logistics Hub.", hue: 40 },
              { name: "Mohan Das", role: "Vegetable Farmer", qt: "Fathom Layer pushed my yield up 35% in one season.", hue: 200 }
            ].map((t, i) => (
              <ScrollSection key={t.name} delay={i * 0.1}>
                <div className="glass-card p-8 rounded-3xl border border-white/5 flex flex-col h-full hover:-translate-y-1 transition-transform" style={{ borderTop: `4px solid hsl(${t.hue}, 80%, 60%)` }}>
                   <div className="flex gap-1 mb-5">{[...Array(5)].map((_,j) => <Star key={j} className="w-4 h-4 text-harvest-gold fill-harvest-gold" />)}</div>
                   <p className="text-surface-variant text-sm italic flex-1 mb-6">"{t.qt}"</p>
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: `hsl(${t.hue}, 50%, 30%)` }}>{t.name.substring(0,2).toUpperCase()}</div>
                     <div><p className="text-sm font-bold text-white">{t.name}</p><p className="text-xs text-surface-variant">{t.role}</p></div>
                   </div>
                </div>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <ScrollSection className="py-24 px-6 bg-surface">
        <div className="max-w-5xl mx-auto cta-card rounded-3xl p-12 md:p-16 text-center relative overflow-hidden border border-emerald-accent/20">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-emerald-accent/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-harvest-gold/10 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-outfit font-black text-white mb-4 tracking-tight">Ready to Transform<br /><span className="text-emerald-accent">Your Farm?</span></h2>
            <p className="text-surface-variant max-w-lg mx-auto mb-10 text-lg">Join thousands of farmers using AI-driven insights to increase yield and maximise profit.</p>
            <Link to="/signup">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="btn-primary mx-auto flex items-center gap-2 text-base px-10 py-4 rounded-full font-bold">
                Create Free Account <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>
        </div>
      </ScrollSection>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer className="border-t border-white/5 bg-surface-container-low py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-accent" /><span className="text-lg font-bold text-white font-outfit">Crop<span className="text-emerald-accent">Hub</span></span>
          </Link>
          <div className="flex gap-6 text-sm text-surface-variant">
            <a href="#" className="hover:text-emerald-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-accent transition-colors">Terms</a>
            <a href="#" className="hover:text-emerald-accent transition-colors">Support</a>
          </div>
          <div className="flex gap-4">
             <a href="#" className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-surface-variant hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
             <a href="#" className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-surface-variant hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></a>
             <a href="#" className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-surface-variant hover:text-white transition-colors"><Github className="w-4 h-4" /></a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 text-center text-xs text-surface-variant/50">© 2026 CropHub. Built for the modern farmer.</div>
      </footer>
    </div>
  );
}