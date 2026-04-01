import { useRef, useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  motion, AnimatePresence, useScroll, useTransform, useInView, useSpring, useMotionValue,
} from "framer-motion";
import {
  Sprout, Layers, BarChart3, Truck, ArrowRight, Leaf, TrendingUp, Shield, Zap,
  ChevronDown, Settings, LogOut, LayoutDashboard, Scan, Globe, Star, CheckCircle2,
  Activity, Cpu, Twitter, Github, Linkedin, Play
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
        ctx.fillStyle = `rgba(45, 106, 79, ${p.alpha * 0.6})`; ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(45, 106, 79, ${(1 - dist / 100) * 0.15})`; ctx.lineWidth = 0.5; ctx.stroke();
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
    <div className="min-h-screen relative overflow-hidden font-outfit" style={{ background: "#0a0f0d" }}>
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-2xl bg-[#0e1412]/60 backdrop-blur-md border border-white/5 shadow-2xl">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-[#00e87a]/10 flex items-center justify-center border border-[#00e87a]/20 group-hover:border-[#00e87a]/40 transition-colors">
              <Sprout className="w-5 h-5 text-[#00e87a]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Crop<span className="text-[#00e87a]">Hub</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            {["Features", "Process", "Impact"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm font-medium text-white/70 hover:text-[#00e87a] transition-colors">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-white/70 hover:text-[#00e87a] transition-colors">Log In</Link>
            <Link to="/signup" className="btn-primary px-5 py-2.5 rounded-xl text-sm shadow-lg shadow-[#00e87a]/20">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#00e87a]/10 blur-[120px] rounded-full" />
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-[#ffb955]/5 blur-[100px] rounded-full" />
        </div>
        <ParticleField />
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: "linear-gradient(rgba(var(--primary), 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(var(--primary), 0.2) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0e1412] border border-white/10 text-white/80 text-sm mb-8 shadow-xl">
              <span className="flex h-2 w-2 rounded-full bg-[#00e87a] animate-pulse" />
              Trusted by 12,000+ modern farmers
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter text-white">
              Farm Smarter.<br />
              <span className="hero-gradient-text">Harvest More.</span>
            </h1>
            <p className="text-xl text-white/60 mb-10 leading-relaxed max-w-lg">
              CropHub combines soil diagnostics, predictive crop planning, and market intelligence into one AI decision engine.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link to="/signup" className="btn-primary w-full sm:w-auto h-14 px-10 rounded-2xl text-lg flex items-center justify-center gap-2 shadow-2xl shadow-[#00e87a]/30">
                Join the Future <ArrowRight className="w-5 h-5" />
              </Link>
              <button className="w-full sm:w-auto h-14 px-10 rounded-2xl text-lg font-bold bg-[#0e1412] border border-white/10 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 shadow-xl">
                Watch Demo <Leaf className="w-5 h-5" />
              </button>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.9, rotateY: 15 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:block relative perspective-1000">
            <TiltCard>
              <div className="w-full aspect-[4/5] rounded-[3rem] overflow-hidden glass-card border border-white/5 p-8 flex flex-col shadow-2xl">
                <div className="flex items-center justify-between mb-12">
                  <div className="w-12 h-12 rounded-2xl bg-[#00e87a]/20 flex items-center justify-center"><Leaf className="w-6 h-6 text-[#00e87a]" /></div>
                  <span className="text-xs font-bold text-[#00e87a] px-3 py-1 bg-[#00e87a]/10 rounded-full border border-[#00e87a]/20">Live Sync</span>
                </div>
                <div className="space-y-6 flex-1">
                  <div className="h-32 rounded-3xl bg-white/5 border border-white/5 p-6 space-y-2">
                    <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Soil Health Score</p>
                    <div className="flex items-end gap-3 font-outfit"><span className="text-5xl font-black text-white">92</span><span className="text-sm text-[#00e87a] font-bold mb-1">+4.2%</span></div>
                  </div>
                  <div className="h-32 rounded-3xl bg-white/5 border border-white/5 p-6 space-y-4">
                    <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Optimal Crop</p>
                    <div className="flex justify-between items-center"><span className="text-2xl font-bold text-[#ffb955]">Soybean</span><span className="text-xs text-white/60">80% Match</span></div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-[#ffb955] rounded-full w-[80%]" /></div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">Built for <span className="text-[#00e87a]">Modern</span> Agriculture</h2>
            <p className="text-white/40 text-lg max-w-2xl mx-auto">Harness the power of AI across three distinct layers designed to maximize your efficiency.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <ScrollSection key={feature.title} delay={i * 0.1}>
                <TiltCard className="h-full">
                  <div className="glass-card h-full p-10 rounded-[2.5rem] flex flex-col group border border-white/5 hover:border-[#00e87a]/30">
                    <div className="w-14 h-14 rounded-2xl bg-[#00e87a]/10 flex items-center justify-center border border-[#00e87a]/20 mb-8 group-hover:scale-110 transition-transform">
                      <feature.icon className="w-7 h-7 text-[#00e87a]" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-white/50 leading-relaxed mb-8 flex-1">{feature.description}</p>
                    <div className="flex items-center gap-2 text-[#00e87a] font-bold text-sm">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </TiltCard>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ── */}
      <section id="process" className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">How <span className="text-[#00e87a]">It Works</span></h2>
            <p className="text-white/40 text-lg">Three simple steps to transition your farm into the AI era.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Scan Soil", desc: "Upload a photo or enter data. AI models analyze composition instantly.", icon: Scan },
              { num: "02", title: "Plan Target", desc: "Generate optimal crop mix mapping based on your budget & land size.", icon: Cpu },
              { num: "03", title: "Sell High", desc: "Track markets to find the most profitable buyer accounting for transport.", icon: Truck }
            ].map((step, i) => (
              <ScrollSection key={step.num} delay={i * 0.1}>
                <div className="p-10 rounded-[2.5rem] bg-[#0e1412] border border-white/5 relative overflow-hidden group">
                  <span className="absolute -right-4 -top-8 text-[12rem] font-black text-white/5 leading-none select-none">{step.num}</span>
                  <div className="w-16 h-16 rounded-2xl bg-[#00e87a]/10 flex items-center justify-center mb-8 border border-[#00e87a]/20 group-hover:scale-110 transition-transform">
                    <step.icon className="w-8 h-8 text-[#00e87a]" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{step.title}</h3>
                  <p className="text-white/40 leading-relaxed relative z-10">{step.desc}</p>
                </div>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="impact" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-white">Farmers Love <span className="text-[#00e87a]">CropHub</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Ravi Kumar", role: "Wheat Farmer", text: "Saved lakhs in fertilizer costs. The AI accuracy is unbelievable.", border: "hover:border-[#00e87a]/30" },
              { name: "Priya Sharma", role: "Rice Farmer", text: "Found a buyer paying 20% more via the Logistics Hub.", border: "hover:border-[#ffb955]/30" },
              { name: "Mohan Das", role: "Vegetable Farmer", text: "Fathom Layer pushed my yield up by 40% in one season.", border: "hover:border-[#00e87a]/30" }
            ].map((t, i) => (
              <ScrollSection key={t.name} delay={i * 0.1}>
                <div className={`glass-card p-10 rounded-[2.5rem] border border-white/5 transition-all ${t.border}`}>
                  <div className="flex items-center gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-[#ffb955] text-[#ffb955]" />
                    ))}
                  </div>
                  <p className="text-xl text-white/70 italic mb-8">"{t.text}"</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/10" />
                    <div>
                      <p className="font-bold text-white">{t.name}</p>
                      <p className="text-white/40 text-sm">{t.role}</p>
                    </div>
                  </div>
                </div>
              </ScrollSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="p-12 md:p-20 rounded-[3rem] bg-[#00e87a] relative overflow-hidden group shadow-[0_0_100px_rgba(0,232,122,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00e87a] to-[#00c860]" />
            <div className="absolute inset-0 opacity-[0.1]" style={{
              backgroundImage: "linear-gradient(rgba(0,57,25,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,57,25,1) 1px, transparent 1px)",
              backgroundSize: "24px 24px"
            }} />
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black mb-8 text-[#003919] leading-tight">
                Ready to maximize your harvest?
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/signup" className="w-full sm:w-auto h-16 px-12 rounded-2xl bg-[#003919] text-white text-xl font-bold hover:bg-[#002b13] transition-all flex items-center justify-center gap-3 shadow-2xl">
                  Get Started Now <ArrowRight className="w-6 h-6" />
                </Link>
                <button className="w-full sm:w-auto h-16 px-12 rounded-2xl bg-white/20 backdrop-blur-md text-white text-xl font-bold hover:bg-white/30 transition-all flex items-center justify-center gap-3 border border-white/20">
                  Contact Sales <Play className="w-5 h-5" fill="currentColor" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center md:text-left">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-[#00e87a]/10 flex items-center justify-center border border-[#00e87a]/20">
                  <Sprout className="w-4 h-4 text-[#00e87a]" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">CropHub</span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed">
                Building the future of sustainable, data-driven agriculture.
              </p>
            </div>
            {["Platform", "Product", "Social"].map((title, i) => (
              <div key={title}>
                <h4 className="text-white font-bold mb-6">{title}</h4>
                <ul className="space-y-4 text-white/40 text-sm">
                  {i === 2 ? (
                    <>
                      <li className="hover:text-[#00e87a] cursor-pointer">Twitter</li>
                      <li className="hover:text-[#00e87a] cursor-pointer">LinkedIn</li>
                      <li className="hover:text-[#00e87a] cursor-pointer">Instagram</li>
                    </>
                  ) : (
                    <>
                      <li className="hover:text-[#00e87a] cursor-pointer">Features</li>
                      <li className="hover:text-[#00e87a] cursor-pointer">Solutions</li>
                      <li className="hover:text-[#00e87a] cursor-pointer">Pricing</li>
                    </>
                  )}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-white/20 text-xs tracking-widest uppercase">© 2026 CropHub. All rights reserved.</p>
            <div className="flex gap-8 text-white/20 text-xs tracking-widest uppercase">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}