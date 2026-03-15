"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp,
  Hash,
  Play,
  Clock,
  Zap,
  Target,
  BarChart2,
  ArrowRight,
  Check,
  Star,
  Search,
  MessageCircle,
  Menu,
  X,
  Music,
  Sparkles,
  Users,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  Swords,
  Brain,
  Building2,
  Heart,
  BookOpen,
  Shield,
  FileText,
  LucideIcon,
  Cpu,
  Radio,
  Lock,
} from "lucide-react";
import Image from "next/image";
import LogoLink from "@/components/LogoLink";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { LandingContent, LandingFeature, LandingFAQ } from "@/lib/landing-content";

/* ─── Icon map for dynamic features ─── */
const iconMap: Record<string, LucideIcon> = {
  TrendingUp,
  Hash,
  Play,
  Clock,
  Zap,
  Target,
  BarChart2,
  Search,
  MessageCircle,
  Music,
  Sparkles,
  Users,
  Swords,
  Brain,
  Building2,
  Heart,
  BookOpen,
  Shield,
  FileText,
  Star,
  ArrowRight,
  Check,
};

function resolveIcon(name: string): LucideIcon {
  return iconMap[name] || Zap;
}

/* ─── Static data (not dynamic) ─── */

const featureDeepDives = [
  {
    badge: "Video Analizi",
    title: "Viral Videolar\u0131 Herkesten \u00D6nce Ke\u015Ffet",
    desc: "Binlerce TikTok videosunu ger\u00E7ek zamanl\u0131 analiz ederek viral olma potansiyeli ta\u015F\u0131yan i\u00E7erikleri erken tespit edin.",
    features: ["Ger\u00E7ek zamanl\u0131 video takibi", "Viralite skoru hesaplama", "Kategori bazl\u0131 filtreleme", "G\u00FCnl\u00FCk video raporlar\u0131"],
    image: "/images/login-bg-3.jpg",
  },
  {
    badge: "Hashtag Zekas\u0131",
    title: "Do\u011Fru Hashtag\u2019lerle Ke\u015Ffet Sayfas\u0131na \u00C7\u0131k",
    desc: "Milyonlarca hashtag verisini analiz ederek sizin ni\u015Finize en uygun etiketleri bulun.",
    features: ["Hashtag b\u00FCy\u00FCme grafi\u011Fi", "Rekabet analizi", "Ni\u015F hashtag \u00F6nerileri", "Performans kar\u015F\u0131la\u015Ft\u0131rma"],
    image: "/images/feature-hashtags.jpg",
  },
  {
    badge: "Ses Trendleri",
    title: "Trend Sesleri Erken Yakala",
    desc: "TikTok\u2019ta viral olan sesleri ve m\u00FCzikleri takip edin. Do\u011Fru zamanda kullanarak etkile\u015Fiminizi art\u0131r\u0131n.",
    features: ["Ses pop\u00FClerlik grafi\u011Fi", "Yeni y\u00FCkselen sesler", "Kategori bazl\u0131 sesler", "Kullan\u0131m istatistikleri"],
    image: "/images/feature-sounds.jpg",
  },
  {
    badge: "AI Destekli",
    title: "Yapay Zeka ile \u0130\u00E7erik Fikirleri \u00DCret",
    desc: "Trend analizlerine dayal\u0131 AI \u00F6nerileri ile i\u00E7erik \u00FCretim s\u00FCrecinizi h\u0131zland\u0131r\u0131n.",
    features: ["AI hook \u00F6nerileri", "Video a\u00E7\u0131klama \u015Fablonlar\u0131", "Trend bazl\u0131 fikirler", "Reklam fikir \u00FCreteci"],
    image: "/images/feature-ai.jpg",
  },
];

const steps = [
  { num: "1", title: "Ke\u015Ffet", desc: "Trend video, hashtag ve sesleri ke\u015Ffet", icon: Search },
  { num: "2", title: "Analiz Et", desc: "Neden viral oldu\u011Funu derinlemesine anla", icon: BarChart2 },
  { num: "3", title: "B\u00FCy\u00FCt", desc: "Veriye dayal\u0131 i\u00E7erik \u00FCret, h\u0131zl\u0131 b\u00FCy\u00FC", icon: TrendingUp },
];

const individualBenefits = [
  { icon: TrendingUp, text: "Trend videolar\u0131 herkesten \u00F6nce ke\u015Ffet" },
  { icon: Hash, text: "Do\u011Fru hashtag\u2019lerle ke\u015Ffete \u00E7\u0131k" },
  { icon: Music, text: "Viral sesleri erken yakala" },
  { icon: Zap, text: "AI ile i\u00E7erik fikirleri \u00FCret" },
  { icon: Heart, text: "Yorum analizi ile kitlenizi anlay\u0131n" },
  { icon: BookOpen, text: "Hook k\u00FCt\u00FCphanesi ile dikkat \u00E7ekin" },
];

const brandBenefits = [
  { icon: Swords, text: "Rakip analizi ile sava\u015F odas\u0131" },
  { icon: Brain, text: "AI strateji dan\u0131\u015Fman\u0131" },
  { icon: BarChart2, text: "Marka sa\u011Fl\u0131k skoru takibi" },
  { icon: Target, text: "Kampanya performans analizi" },
  { icon: FileText, text: "Detayl\u0131 PDF raporlar" },
  { icon: Shield, text: "\u00D6ncelikli teknik destek" },
];

/* ─── Glass helpers ─── */
const glass = "bg-card/60 backdrop-blur-xl border border-white/[0.06]";
const glassHover = "hover:bg-card/80 hover:border-white/[0.12] hover:shadow-lg hover:shadow-primary/5";

/* ─── Floating Particles ─── */

function FloatingParticles() {
  const [particles] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/20"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -30, 10, -20, 0],
            x: [0, 15, -10, 5, 0],
            opacity: [0.2, 0.6, 0.3, 0.5, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Mockup ─── */

function DashboardMockup() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className={`${glass} rounded-2xl overflow-hidden shadow-2xl shadow-primary/10`}>
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
          </div>
          <div className="flex-1 text-center text-[10px] text-muted-foreground/60">valyze.app/dashboard</div>
        </div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Trend Skoru", value: "94", change: "+12%", color: "text-primary" },
              { label: "Viral Index", value: "8.7", change: "+5%", color: "text-teal" },
              { label: "B\u00FCy\u00FCme", value: "23%", change: "+3%", color: "text-purple-400" },
            ].map((m) => (
              <div key={m.label} className="bg-white/[0.03] rounded-lg p-2.5 border border-white/[0.04]">
                <p className="text-[9px] text-muted-foreground/60">{m.label}</p>
                <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
                <p className="text-[9px] text-teal">{m.change}</p>
              </div>
            ))}
          </div>
          <div className="bg-white/[0.03] rounded-lg p-3 border border-white/[0.04]">
            <p className="text-[9px] text-muted-foreground/60 mb-2">Trend B\u00FCy\u00FCme</p>
            <div className="flex items-end gap-1 h-16">
              {[30, 45, 35, 60, 50, 75, 65, 90, 80, 95, 85, 100].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.5 + i * 0.05, duration: 0.6, ease: "easeOut" }}
                  className="flex-1 rounded-sm bg-gradient-to-t from-primary/40 to-primary/80"
                />
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            {[
              { tag: "#tiktokturkiye", views: "2.4M", trend: "+340%" },
              { tag: "#viralvideo", views: "1.8M", trend: "+220%" },
              { tag: "#trending", views: "956K", trend: "+180%" },
            ].map((row) => (
              <div key={row.tag} className="flex items-center justify-between bg-white/[0.02] rounded-md px-2.5 py-1.5 border border-white/[0.03]">
                <span className="text-[10px] font-medium text-foreground/80">{row.tag}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground/60">{row.views}</span>
                  <span className="text-[9px] text-teal font-medium">{row.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute -inset-8 bg-primary/[0.06] rounded-3xl blur-3xl -z-10" />
      <div className="absolute -inset-4 bg-teal/[0.04] rounded-2xl blur-2xl -z-10" />
    </div>
  );
}

/* ─── Live Demo Preview Card ─── */

function LiveDemoPreview() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Trendler", "Hashtag", "Sesler"];
  const demoData = [
    [
      { title: "Dans challenge videosu", score: 94, views: "2.4M", growth: "+340%" },
      { title: "Yemek tarifi - viral format", score: 87, views: "1.1M", growth: "+220%" },
      { title: "Duet trend videosu", score: 81, views: "890K", growth: "+180%" },
    ],
    [
      { title: "#turkiyetiktok", score: 96, views: "5.2M", growth: "+450%" },
      { title: "#viralolacak", score: 89, views: "3.1M", growth: "+280%" },
      { title: "#trendyakala", score: 78, views: "1.7M", growth: "+150%" },
    ],
    [
      { title: "Original Sound - trending", score: 92, views: "4.8M", growth: "+520%" },
      { title: "Pop remix - viral beat", score: 85, views: "2.9M", growth: "+310%" },
      { title: "Comedy audio clip", score: 74, views: "1.3M", growth: "+170%" },
    ],
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative"
    >
      <div className="bg-card/80 backdrop-blur-2xl border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl shadow-primary/5">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
            <span className="text-xs font-medium text-foreground">Canl{"\u0131"} Dashboard {"\u00D6"}nizleme</span>
          </div>
          <span className="text-[10px] text-muted-foreground">Son g{"\u00FC"}ncelleme: 2 dk {"\u00F6"}nce</span>
        </div>

        <div className="px-5 pt-3">
          <div className="flex gap-1 bg-white/[0.03] rounded-lg p-1">
            {tabs.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-all duration-300 ${
                  activeTab === i
                    ? "bg-primary/20 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 space-y-2">
          <AnimatePresence mode="wait">
            {demoData[activeTab].map((item, i) => (
              <motion.div
                key={`${activeTab}-${i}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.08, duration: 0.3 }}
                className="flex items-center justify-between bg-white/[0.03] rounded-xl px-4 py-3 border border-white/[0.04] hover:border-white/[0.08] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{item.score}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground">{item.views} g{"\u00F6"}r{"\u00FC"}nt{"\u00FC"}lenme</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-teal">{item.growth}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="px-5 pb-4">
          <Link
            href="/register"
            className="w-full flex items-center justify-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-medium py-2.5 rounded-xl hover:bg-primary/20 transition-colors"
          >
            T{"\u00FC"}m verileri g{"\u00F6"}rmek i{"\u00E7"}in {"\u00FC"}cretsiz ba{"\u015F"}la <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
      <div className="absolute -inset-6 bg-gradient-to-r from-primary/[0.04] via-teal/[0.03] to-purple-500/[0.04] rounded-3xl blur-3xl -z-10" />
    </motion.div>
  );
}

/* ─── Feature card with dynamic icon ─── */

function FeatureCard({ f, i }: { f: LandingFeature; i: number }) {
  const Icon = resolveIcon(f.iconName);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.06 }}
      whileHover={{ scale: 1.03, y: -4 }}
      className={`group relative ${glass} rounded-xl p-5 md:p-6 ${glassHover} transition-all duration-300`}
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/[0.00] to-teal/[0.00] group-hover:from-primary/[0.04] group-hover:to-teal/[0.04] transition-all duration-500" />
      <div className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/20 via-transparent to-teal/20 blur-sm -z-10" />

      <div className="relative">
        <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all duration-300`}>
          <Icon className={`w-5 h-5 ${f.color}`} />
        </div>
        <h3 className="text-sm md:text-base font-semibold text-foreground mb-2">{f.title}</h3>
        <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
      </div>
    </motion.div>
  );
}

/* ─── FAQ Item ─── */

function FAQItem({ faq, index }: { faq: LandingFAQ; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className={`${glass} rounded-xl overflow-hidden ${glassHover} transition-all duration-300`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 p-4 md:p-5 text-left"
      >
        <span className="text-sm font-medium text-foreground">{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 md:px-5 pb-4 md:pb-5 pt-0">
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Main Component ─── */

interface LandingPageProps {
  content: LandingContent;
}

export default function LandingPage({ content }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { stats, features, testimonials, plans, faq } = content;

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* Global ambient gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/[0.08] via-transparent to-rose-900/[0.06]" />
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-primary/[0.04] rounded-full blur-[180px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-teal/[0.03] rounded-full blur-[180px]" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-purple-500/[0.03] rounded-full blur-[150px]" />
      </div>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/50 backdrop-blur-2xl border-b border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <LogoLink />
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{"\u00D6"}zellikler</a>
            <a href="#for-who" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Kimler {"\u0130\u00E7"}in</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Fiyatland{"\u0131"}rma</a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">SSS</a>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Giri{"\u015F"} Yap</Link>
            <ThemeToggle />
            <Link href="/register" className="text-sm bg-primary/90 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary transition-colors">
              {"\u00DC"}cretsiz Ba{"\u015F"}la
            </Link>
          </div>
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Link href="/register" className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-medium">Ba{"\u015F"}la</Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Menu">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t border-white/[0.06] bg-background/80 backdrop-blur-2xl overflow-hidden">
              <div className="px-4 py-4 space-y-1">
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] rounded-lg transition-colors">{"\u00D6"}zellikler</a>
                <a href="#for-who" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] rounded-lg transition-colors">Kimler {"\u0130\u00E7"}in</a>
                <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] rounded-lg transition-colors">Fiyatland{"\u0131"}rma</a>
                <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] rounded-lg transition-colors">SSS</a>
                <Link href="/viral-tiktok-videos-turkey" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] rounded-lg transition-colors">Viral Videolar</Link>
                <Link href="/trending-hashtags-turkey" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] rounded-lg transition-colors">Trend Hashtag&apos;ler</Link>
                <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] rounded-lg transition-colors">Hakk{"\u0131"}m{"\u0131"}zda</Link>
                <div className="border-t border-white/[0.06] my-2" />
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] rounded-lg transition-colors">Giri{"\u015F"} Yap</Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors">{"\u00DC"}cretsiz Kay{"\u0131"}t Ol</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0">
          <Image src="/images/hero-creator.jpg" alt="" fill className="object-cover opacity-[0.06]" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/[0.08] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-teal/[0.06] via-transparent to-transparent" />
        </div>
        <div className="absolute top-20 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-primary/[0.04] rounded-full blur-[150px]" />
        <div className="absolute top-40 right-1/4 w-56 md:w-80 h-56 md:h-80 bg-teal/[0.04] rounded-full blur-[150px]" />

        {/* Floating particles */}
        <FloatingParticles />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-primary/[0.08] backdrop-blur-sm border border-primary/15 text-primary text-xs px-3 py-1.5 rounded-full mb-5">
                <Zap className="w-3 h-3" />
                T{"\u00FC"}rkiye&apos;nin #1 TikTok Analiz Platformu
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] mb-5">
                Her Videonun{" "}
                <span className="bg-gradient-to-r from-primary via-teal to-primary bg-clip-text text-transparent">Viral S{"\u0131"}rr{"\u0131"}n{"\u0131"}</span>{" "}
                {"\u00C7\u00F6"}z
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
                className="text-sm sm:text-base text-muted-foreground max-w-lg mb-6 leading-relaxed">
                TikTok videolar{"\u0131"}n{"\u0131"} derinlemesine analiz edin, hangi i{"\u00E7"}eriklerin neden viral oldu{"\u011F"}unu ke{"\u015F"}fedin. AI destekli analiz ile rakiplerinizden bir ad{"\u0131"}m {"\u00F6"}nde olun.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
                className="flex flex-col sm:flex-row items-start gap-3 mb-8">
                <Link href="/register" className="group inline-flex items-center gap-2 bg-primary/90 backdrop-blur-sm text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary transition-all font-medium text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]">
                  {"\u00DC"}cretsiz Analiz Ba{"\u015F"}lat <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/login" className={`inline-flex items-center gap-2 ${glass} text-foreground px-6 py-3 rounded-xl ${glassHover} transition-all font-medium text-sm`}>
                  <Play className="w-4 h-4" /> Dashboard Demo
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
                className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                  <span>6 saatte bir g{"\u00FC"}ncellenen ger{"\u00E7"}ek TikTok verileri</span>
                </div>
              </motion.div>
            </div>

            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.7 }}>
              <DashboardMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="relative border-y border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-card/40 backdrop-blur-xl" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center">
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-teal bg-clip-text text-transparent">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1.5">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="relative py-16 md:py-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-teal/[0.03] rounded-full blur-[150px]" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              TikTok B{"\u00FC"}y{"\u00FC"}mesi {"\u0130\u00E7"}in{" "}
              <span className="text-primary">G{"\u00FC\u00E7"}l{"\u00FC"} Ara{"\u00E7"}lar</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Viral olmak i{"\u00E7"}in ihtiyac{"\u0131"}n{"\u0131"}z olan her ara{"\u00E7"} tek bir platformda.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {features.map((f, i) => (
              <FeatureCard key={f.title} f={f} i={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Live Demo Preview ── */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 border-y border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-card/20 backdrop-blur-xl" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 bg-teal/[0.08] backdrop-blur-sm border border-teal/15 text-teal text-xs px-3 py-1.5 rounded-full mb-4">
              <Play className="w-3 h-3" />
              Canl{"\u0131"} {"\u00D6"}nizleme
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Dashboard{"\u2019"}unuz <span className="text-teal">B{"\u00F6"}yle</span> G{"\u00F6"}r{"\u00FC"}necek
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Ger{"\u00E7"}ek zamanl{"\u0131"} trend verileri, viralite skorlar{"\u0131"} ve b{"\u00FC"}y{"\u00FC"}me metrikleri tek bir ekranda.
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto">
            <LiveDemoPreview />
          </div>
        </div>
      </section>

      {/* ── Feature Deep Dives ── */}
      <section className="py-8 md:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-16 md:space-y-24">
          {featureDeepDives.map((fd, idx) => {
            const isReversed = idx % 2 === 1;
            return (
              <motion.div key={fd.badge} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className={isReversed ? "md:order-2" : ""}>
                  <span className="inline-block text-[10px] font-semibold text-primary uppercase tracking-wider mb-3 bg-primary/[0.08] backdrop-blur-sm px-2.5 py-1 rounded-full border border-primary/15">
                    {fd.badge}
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3 leading-tight">{fd.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{fd.desc}</p>
                  <ul className="space-y-2.5">
                    {fd.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2.5 text-sm text-foreground">
                        <div className="w-5 h-5 rounded-full bg-teal/10 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-teal" />
                        </div>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={isReversed ? "md:order-1" : ""}>
                  <div className="relative rounded-2xl overflow-hidden group">
                    <Image src={fd.image} alt={fd.badge} width={600} height={400}
                      className="w-full h-72 sm:h-80 md:h-96 object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                      unoptimized />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent rounded-2xl" />
                    <div className="absolute bottom-4 left-4">
                      <span className="inline-block text-[10px] font-semibold text-white uppercase tracking-wider bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                        {fd.badge}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 border-y border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-card/30 backdrop-blur-xl" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              3 Ad{"\u0131"}mda <span className="text-teal">Ba{"\u015F"}la</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {"\u00DC"}cretsiz hesap olu{"\u015F"}turun ve dakikalar i{"\u00E7"}inde trendleri ke{"\u015F"}fetmeye ba{"\u015F"}lay{"\u0131"}n.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="relative text-center">
                <div className={`w-14 h-14 rounded-2xl ${glass} flex items-center justify-center mx-auto mb-4`}>
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-[10px] text-primary font-bold mb-1.5 uppercase tracking-wider">Ad{"\u0131"}m {step.num}</div>
                <h3 className="text-base font-bold text-foreground mb-1">{step.title}</h3>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
                {i < steps.length - 1 && (
                  <ChevronRight className="hidden md:block absolute top-7 -right-3 w-5 h-5 text-muted-foreground/20" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Who: Brands vs Individuals ── */}
      <section id="for-who" className="relative py-16 md:py-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-teal/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-amber-500/[0.03] rounded-full blur-[150px]" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Size <span className="text-teal">Ne</span> Kazand{"\u0131"}r{"\u0131"}r{"\u0131"}z?
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              {"\u0130"}ster bireysel i{"\u00E7"}erik {"\u00FC"}retici olun, ister marka. Valyze TR ile TikTok stratejinizi tamamen d{"\u00F6"}n{"\u00FC\u015F"}t{"\u00FC"}r{"\u00FC"}n.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Individual */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className={`${glass} rounded-2xl p-6 md:p-8 ${glassHover} transition-all duration-300`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-teal" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Bireysel {"\u00DC"}reticiler</h3>
                  <p className="text-xs text-muted-foreground">{"\u0130\u00E7"}erik {"\u00FC"}reticileri ve kreat{"\u00F6"}rler</p>
                </div>
              </div>
              <div className="space-y-3">
                {individualBenefits.map((b, i) => (
                  <motion.div key={b.text} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.06 }}
                    className="flex items-center gap-3 group/item">
                    <div className="w-8 h-8 rounded-lg bg-teal/[0.06] flex items-center justify-center shrink-0 group-hover/item:bg-teal/10 transition-colors">
                      <b.icon className="w-4 h-4 text-teal" />
                    </div>
                    <span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors">{b.text}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.06]">
                <p className="text-xs text-muted-foreground mb-2">Lite plan{"\u0131"}ndan ba{"\u015F"}layarak:</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-teal">{"\u20BA"}280</span>
                  <span className="text-xs text-muted-foreground">/ay&apos;dan ba{"\u015F"}layan fiyatlar</span>
                </div>
              </div>
            </motion.div>

            {/* Brands */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className={`${glass} rounded-2xl p-6 md:p-8 ${glassHover} transition-all duration-300 relative`}>
              <div className="absolute top-4 right-4">
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-400/[0.08] border border-amber-400/15 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  Kurumsal
                </span>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Markalar & Ajanslar</h3>
                  <p className="text-xs text-muted-foreground">{"\u015E"}irketler ve dijital ajanslar</p>
                </div>
              </div>
              <div className="space-y-3">
                {brandBenefits.map((b, i) => (
                  <motion.div key={b.text} initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 + i * 0.06 }}
                    className="flex items-center gap-3 group/item">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/[0.06] flex items-center justify-center shrink-0 group-hover/item:bg-amber-500/10 transition-colors">
                      <b.icon className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="text-sm text-muted-foreground group-hover/item:text-foreground transition-colors">{b.text}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.06]">
                <p className="text-xs text-muted-foreground mb-2">T{"\u00FC"}m {"\u00F6"}zellikler dahil:</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-amber-400">{"\u20BA"}1.250</span>
                  <span className="text-xs text-muted-foreground">/ay</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 border-y border-white/[0.06] overflow-hidden">
        <div className="absolute inset-0 bg-card/20 backdrop-blur-xl" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">{"\u00DC"}reticiler Ne Diyor?</h2>
            <p className="text-sm text-muted-foreground">Erken kullan{"\u0131"}c{"\u0131"}lardan geri bildirimler.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group relative bg-card/40 backdrop-blur-2xl border border-white/[0.08] rounded-xl p-4 md:p-5 hover:bg-card/60 hover:border-white/[0.15] hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                {/* Glass shine effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/[0.03] via-transparent to-white/[0.01] pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />

                <div className="relative">
                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="w-3 h-3 text-primary fill-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-teal/20 flex items-center justify-center text-primary text-xs font-bold backdrop-blur-sm border border-white/[0.06]">{t.avatar}</div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.author}</p>
                      <p className="text-[10px] text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trusted By / Powered By ── */}
      <section className="relative py-12 md:py-16 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Altyap{"\u0131"}m{"\u0131"}z{"\u0131"} G{"\u00FC\u00E7"}lendiren Teknolojiler</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {[
              { icon: Brain, label: "Yapay Zeka", desc: "Gemini & Claude AI", color: "text-purple-400", bg: "bg-purple-400/[0.06]", borderColor: "border-purple-400/10" },
              { icon: Radio, label: "Ger\u00E7ek Zamanl\u0131", desc: "6 saatte g\u00FCncelleme", color: "text-teal", bg: "bg-teal/[0.06]", borderColor: "border-teal/10" },
              { icon: Lock, label: "SSL G\u00FCvenlik", desc: "256-bit \u015Fifreleme", color: "text-blue-400", bg: "bg-blue-400/[0.06]", borderColor: "border-blue-400/10" },
              { icon: Cpu, label: "Ak\u0131ll\u0131 Analiz", desc: "12+ kategori takibi", color: "text-primary", bg: "bg-primary/[0.06]", borderColor: "border-primary/10" },
            ].map((tech, i) => (
              <motion.div
                key={tech.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.03 }}
                className={`${tech.bg} border ${tech.borderColor} rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300`}
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center mx-auto mb-2.5">
                  <tech.icon className={`w-5 h-5 ${tech.color}`} />
                </div>
                <p className={`text-xs font-semibold ${tech.color} mb-0.5`}>{tech.label}</p>
                <p className="text-[10px] text-muted-foreground">{tech.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="relative py-16 md:py-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal/[0.03] rounded-full blur-[180px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/[0.03] rounded-full blur-[180px]" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              {"\u015E"}effaf <span className="text-teal">Fiyatland{"\u0131"}rma</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Gizli {"\u00FC"}cret yok, s{"\u00FC"}rpriz yok. {"\u0130"}htiyac{"\u0131"}n{"\u0131"}za uygun plan{"\u0131"} se{"\u00E7"}in, istedi{"\u011F"}iniz zaman iptal edin.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`relative ${glass} rounded-2xl p-5 md:p-6 border ${plan.accent} ${glassHover} transition-all duration-300 flex flex-col ${
                  plan.popular ? "ring-1 ring-teal/30 shadow-lg shadow-teal/10" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg shadow-teal/20">
                    <Star className="w-2.5 h-2.5" /> EN POP{"\u00DC"}LER
                  </div>
                )}
                <div className="mb-4">
                  <h3 className="text-base font-bold text-foreground mb-0.5">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground">{plan.desc}</p>
                </div>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className={`text-3xl font-bold ${plan.popular ? "text-teal" : "text-foreground"}`}>{"\u20BA"}{plan.price === 0 ? "0" : plan.price.toLocaleString("tr-TR")}</span>
                  <span className="text-xs text-muted-foreground">/ay</span>
                </div>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${plan.popular ? "text-teal" : "text-muted-foreground/50"}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={`block w-full text-center py-2.5 rounded-xl text-sm font-medium transition-all ${plan.btnClass}`}>
                  {plan.btnText}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Pricing transparency note */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
            className="mt-8 text-center">
            <div className={`inline-flex items-center gap-6 ${glass} rounded-xl px-6 py-3`}>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-3.5 h-3.5 text-teal" />
                <span>256-bit SSL</span>
              </div>
              <div className="w-px h-4 bg-white/[0.06]" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Check className="w-3.5 h-3.5 text-teal" />
                <span>{"\u0130"}stedi{"\u011F"}in zaman iptal</span>
              </div>
              <div className="w-px h-4 bg-white/[0.06]" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="w-3.5 h-3.5 text-teal" />
                <span>iyzico g{"\u00FC"}venli {"\u00F6"}deme</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="relative py-16 md:py-24 px-4 sm:px-6 border-t border-white/[0.06] overflow-hidden">
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-primary/[0.03] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-teal/[0.03] rounded-full blur-[150px]" />
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 bg-primary/[0.08] backdrop-blur-sm border border-primary/15 text-primary text-xs px-3 py-1.5 rounded-full mb-4">
              <HelpCircle className="w-3 h-3" />
              S{"\u0131"}k Sorulan Sorular
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Merak <span className="text-primary">Ettikleriniz</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Valyze hakk{"\u0131"}nda en {"\u00E7"}ok sorulan sorular ve yan{"\u0131"}tlar{"\u0131"}.
            </p>
          </motion.div>

          <div className="space-y-3">
            {faq.map((item, i) => (
              <FAQItem key={item.question} faq={item} index={i} />
            ))}
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Ba{"\u015F"}ka sorular{"\u0131"}n{"\u0131"}z m{"\u0131"} var?{" "}
              <Link href="/contact" className="text-primary hover:underline">Bize ula{"\u015F\u0131"}n</Link>
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative rounded-2xl p-8 md:p-14 overflow-hidden">
            {/* Gradient background for CTA */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.12] via-card/80 to-teal/[0.12] rounded-2xl" />
            <div className="absolute inset-0 backdrop-blur-xl border border-white/[0.08] rounded-2xl" />
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/[0.08] rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal/[0.08] rounded-full blur-[120px]" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                  Bug{"\u00FC"}nden <span className="bg-gradient-to-r from-primary to-teal bg-clip-text text-transparent">B{"\u00FC"}y{"\u00FC"}meye</span> Ba{"\u015F"}la
                </h2>
              </motion.div>
              <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
                Viral f{"\u0131"}rsatlar{"\u0131"} ke{"\u015F"}fetmek i{"\u00E7"}in {"\u00FC"}cretsiz hesab{"\u0131"}n{"\u0131"}z{"\u0131"} olu{"\u015F"}turun ve hemen analiz etmeye ba{"\u015F"}lay{"\u0131"}n.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/register" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-8 py-3.5 rounded-xl font-medium text-sm shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-shadow">
                    {"\u00DC"}cretsiz Hesap Olu{"\u015F"}tur <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <Link href="/contact" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors">
                  <MessageCircle className="w-4 h-4" /> Bize Ula{"\u015F\u0131"}n
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.06] py-10 md:py-14 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="mb-3"><LogoLink size="sm" /></div>
              <p className="text-xs text-muted-foreground leading-relaxed">T{"\u00FC"}rkiye&apos;nin TikTok trend analiz platformu. Veriye dayal{"\u0131"} b{"\u00FC"}y{"\u00FC"}me.</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Platform</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{"\u00D6"}zellikler</a></li>
                <li><a href="#pricing" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Fiyatland{"\u0131"}rma</a></li>
                <li><Link href="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Hakk{"\u0131"}m{"\u0131"}zda</Link></li>
                <li><Link href="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{"\u0130"}leti{"\u015F"}im</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Ara{"\u00E7"}lar</h4>
              <ul className="space-y-2">
                <li><Link href="/viral-tiktok-videos-turkey" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Viral Videolar</Link></li>
                <li><Link href="/trending-hashtags-turkey" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Trend Hashtag&apos;ler</Link></li>
                <li><Link href="/tiktok-trend-report" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Haftal{"\u0131"}k Rapor</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Yasal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy-policy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Gizlilik Politikas{"\u0131"}</Link></li>
                <li><Link href="/terms-of-service" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Kullan{"\u0131"}m {"\u015E"}artlar{"\u0131"}</Link></li>
                <li><Link href="/mesafeli-satis-sozlesmesi" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Mesafeli Sat{"\u0131\u015F"}</Link></li>
                <li><Link href="/iptal-ve-iade" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{"\u0130"}ptal ve {"\u0130"}ade</Link></li>
                <li><Link href="/cookie-policy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{"\u00C7"}erez Politikas{"\u0131"}</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/[0.06] pt-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <p className="text-[10px] text-muted-foreground">&copy; 2026 Valyze TR. T{"\u00FC"}m haklar{"\u0131"} sakl{"\u0131"}d{"\u0131"}r.</p>
                <a href="mailto:destek@valyze.app" className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">destek@valyze.app</a>
              </div>
              <div className="flex items-center gap-3">
                <svg className="h-5 w-auto" viewBox="0 0 48 16" fill="none"><rect width="48" height="16" rx="2" fill="#1A1F71" /><text x="24" y="11.5" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="Arial, sans-serif">VISA</text></svg>
                <svg className="h-5 w-auto" viewBox="0 0 48 16" fill="none"><rect width="48" height="16" rx="2" fill="#252525" /><circle cx="19" cy="8" r="5" fill="#EB001B" /><circle cx="29" cy="8" r="5" fill="#F79E1B" /><path d="M24 4.27a5 5 0 010 7.46 5 5 0 000-7.46z" fill="#FF5F00" /></svg>
                <svg className="h-5 w-auto" viewBox="0 0 48 16" fill="none"><rect width="48" height="16" rx="2" fill="#1E64FF" /><text x="24" y="11" textAnchor="middle" fill="white" fontSize="7.5" fontWeight="bold" fontFamily="Arial, sans-serif">iyzico</text></svg>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
