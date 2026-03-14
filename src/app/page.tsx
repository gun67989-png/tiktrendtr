"use client";

import { useState } from "react";
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
  Swords,
  Brain,
  Crown,
  Building2,
  Heart,
  BookOpen,
  Shield,
  FileText,
} from "lucide-react";
import Image from "next/image";
import LogoLink from "@/components/LogoLink";
import { ThemeToggle } from "@/components/ThemeToggle";

/* ─── Data ─── */

const stats = [
  { value: "50K+", label: "Analiz Edilen Video" },
  { value: "12K+", label: "Aktif Hashtag" },
  { value: "3K+", label: "Üretici" },
  { value: "99.9%", label: "Uptime" },
];

const features = [
  {
    icon: TrendingUp,
    title: "Viral Video Tespiti",
    desc: "Viral olma potansiyeli taşıyan videoları herkes fark etmeden tespit edin.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Hash,
    title: "Hashtag Analizi",
    desc: "Yüksek performanslı hashtag'leri keşfedin, büyüme hızlarını takip edin.",
    color: "text-teal",
    bg: "bg-teal/10",
  },
  {
    icon: Music,
    title: "Ses Trend Analizi",
    desc: "Trend olan sesleri erken yakalayıp içeriğinizde kullanın.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: Clock,
    title: "Paylaşım Zamanı",
    desc: "Hedef kitlenizin en aktif olduğu saatleri analiz edin.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Zap,
    title: "AI İçerik Fikirleri",
    desc: "AI destekli önerilerle trend konulara uygun video fikirleri alın.",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
  {
    icon: Target,
    title: "Rakip Analizi",
    desc: "Rakiplerinizin performansını takip edin, stratejinizi optimize edin.",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
];

const featureDeepDives = [
  {
    badge: "Video Analizi",
    title: "Viral Videoları Herkesten Önce Keşfet",
    desc: "Binlerce TikTok videosunu gerçek zamanlı analiz ederek viral olma potansiyeli taşıyan içerikleri erken tespit edin.",
    features: ["Gerçek zamanlı video takibi", "Viralite skoru hesaplama", "Kategori bazlı filtreleme", "Günlük video raporları"],
    image: "/images/login-bg-3.jpg",
  },
  {
    badge: "Hashtag Zekası",
    title: "Doğru Hashtag'lerle Keşfet Sayfasına Çık",
    desc: "Milyonlarca hashtag verisini analiz ederek sizin nişinize en uygun etiketleri bulun.",
    features: ["Hashtag büyüme grafiği", "Rekabet analizi", "Niş hashtag önerileri", "Performans karşılaştırma"],
    image: "/images/feature-hashtags.jpg",
  },
  {
    badge: "Ses Trendleri",
    title: "Trend Sesleri Erken Yakala",
    desc: "TikTok'ta viral olan sesleri ve müzikleri takip edin. Doğru zamanda kullanarak etkileşiminizi artırın.",
    features: ["Ses popülerlik grafiği", "Yeni yükselen sesler", "Kategori bazlı sesler", "Kullanım istatistikleri"],
    image: "/images/feature-sounds.jpg",
  },
  {
    badge: "AI Destekli",
    title: "Yapay Zeka ile İçerik Fikirleri Üret",
    desc: "Trend analizlerine dayalı AI önerileri ile içerik üretim sürecinizi hızlandırın.",
    features: ["AI hook önerileri", "Video açıklama şablonları", "Trend bazlı fikirler", "Reklam fikir üreteci"],
    image: "/images/feature-ai.jpg",
  },
];

const steps = [
  { num: "1", title: "Keşfet", desc: "Trend video, hashtag ve sesleri keşfet", icon: Search },
  { num: "2", title: "Analiz Et", desc: "Neden viral olduğunu derinlemesine anla", icon: BarChart2 },
  { num: "3", title: "Büyüt", desc: "Veriye dayalı içerik üret, hızlı büyü", icon: TrendingUp },
];

const testimonials = [
  {
    quote: "Hangi videoların viral olduğunu artık biliyorum. İçerik stratejim tamamen değişti!",
    author: "Elif K.",
    role: "İçerik Üretici · 250K Takipçi",
    avatar: "E",
  },
  {
    quote: "Saatlerce araştırma yapmaktan kurtardılar. Neyin tutacağını önceden biliyorum.",
    author: "Ahmet D.",
    role: "TikTok Kreatörü · 180K Takipçi",
    avatar: "A",
  },
  {
    quote: "Rakip analizi özelliği tek başına plan almaya değer. Çok memnunum.",
    author: "Selin M.",
    role: "Dijital Pazarlamacı",
    avatar: "S",
  },
  {
    quote: "AI içerik fikirleri harika. Her gün ne paylaşacağımı düşünmek zorunda kalmıyorum.",
    author: "Can T.",
    role: "E-ticaret Uzmanı",
    avatar: "C",
  },
];

/* ── Plan Data ── */

const individualBenefits = [
  { icon: TrendingUp, text: "Trend videoları herkesten önce keşfet" },
  { icon: Hash, text: "Doğru hashtag'lerle keşfete çık" },
  { icon: Music, text: "Viral sesleri erken yakala" },
  { icon: Zap, text: "AI ile içerik fikirleri üret" },
  { icon: Heart, text: "Yorum analizi ile kitlenizi anlayın" },
  { icon: BookOpen, text: "Hook kütüphanesi ile dikkat çekin" },
];

const brandBenefits = [
  { icon: Swords, text: "Rakip analizi ile savaş odası" },
  { icon: Brain, text: "AI strateji danışmanı" },
  { icon: BarChart2, text: "Marka sağlık skoru takibi" },
  { icon: Target, text: "Kampanya performans analizi" },
  { icon: FileText, text: "Detaylı PDF raporlar" },
  { icon: Shield, text: "Öncelikli teknik destek" },
];

const plans = [
  {
    id: "free",
    name: "Ücretsiz",
    desc: "Platformu keşfet",
    price: 0,
    popular: false,
    accent: "border-border",
    btnClass: "bg-card border border-border text-foreground hover:bg-muted",
    btnText: "Ücretsiz Başla",
    href: "/register",
    features: [
      "7 günlük veri erişimi",
      "Sınırlı trend video analizi",
      "Temel hashtag verileri",
      "Ses trendleri (sınırlı)",
      "Paylaşım zamanı önerileri",
    ],
  },
  {
    id: "lite",
    name: "Bireysel Lite",
    desc: "Aktif içerik üreticileri",
    price: 280,
    popular: false,
    accent: "border-blue-400/30",
    btnClass: "bg-blue-500 text-white hover:bg-blue-600",
    btnText: "Lite Başla",
    href: "/pricing",
    features: [
      "14 günlük veri döngüsü",
      "Sınırsız trend video analizi",
      "Detaylı hashtag & ses analizi",
      "İçerik üretici takibi",
      "Hook kütüphanesi",
      "Viral skor çözümlemesi",
    ],
  },
  {
    id: "standard",
    name: "Bireysel Standart",
    desc: "Profesyonel üreticiler",
    price: 350,
    popular: true,
    accent: "border-teal/40",
    btnClass: "bg-teal text-white hover:bg-teal/90",
    btnText: "Standart Başla",
    href: "/pricing",
    features: [
      "4 haftalık veri arşivi",
      "Tüm Lite özellikleri",
      "AI yorum analizi (Sentiment)",
      "AI içerik fikirleri",
      "Büyüme stratejisi",
      "Trend tahminleri",
      "Hook performans analizi",
      "Günlük & detaylı raporlar",
      "Rakip yorum karşılaştırma",
    ],
  },
  {
    id: "enterprise",
    name: "Kurumsal",
    desc: "Markalar & ajanslar",
    price: 1250,
    popular: false,
    accent: "border-amber-400/30",
    btnClass: "bg-amber-500 text-white hover:bg-amber-600",
    btnText: "Kurumsal Başla",
    href: "/pricing",
    features: [
      "30 günlük veri arşivi",
      "Tüm Standart özellikleri",
      "Rakip savaş odası",
      "AI hook üretimi",
      "PDF rapor dışa aktarma",
      "Trend doygunluk analizi",
      "Marka stratejisi önerileri",
      "Öncelikli teknik destek",
    ],
  },
];

/* ─── Glass Card helper ─── */
const glass = "bg-card/60 backdrop-blur-xl border border-white/[0.06]";
const glassHover = "hover:bg-card/80 hover:border-white/[0.12] hover:shadow-lg hover:shadow-primary/5";

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
              { label: "Büyüme", value: "23%", change: "+3%", color: "text-purple-400" },
            ].map((m) => (
              <div key={m.label} className="bg-white/[0.03] rounded-lg p-2.5 border border-white/[0.04]">
                <p className="text-[9px] text-muted-foreground/60">{m.label}</p>
                <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
                <p className="text-[9px] text-teal">{m.change}</p>
              </div>
            ))}
          </div>
          <div className="bg-white/[0.03] rounded-lg p-3 border border-white/[0.04]">
            <p className="text-[9px] text-muted-foreground/60 mb-2">Trend Büyüme</p>
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
              { tag: "#tiktoktürkiye", views: "2.4M", trend: "+340%" },
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

/* ─── Component ─── */

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Özellikler</a>
            <a href="#for-who" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Kimler İçin</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Fiyatlandırma</a>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Giriş Yap</Link>
            <ThemeToggle />
            <Link href="/register" className="text-sm bg-primary/90 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary transition-colors">
              Ücretsiz Başla
            </Link>
          </div>
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Link href="/register" className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-medium">Başla</Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Menu">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t border-white/[0.06] bg-background/80 backdrop-blur-2xl overflow-hidden">
              <div className="px-4 py-4 space-y-1">
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] rounded-lg transition-colors">Özellikler</a>
                <a href="#for-who" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] rounded-lg transition-colors">Kimler İçin</a>
                <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] rounded-lg transition-colors">Fiyatlandırma</a>
                <Link href="/viral-tiktok-videos-turkey" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] rounded-lg transition-colors">Viral Videolar</Link>
                <Link href="/trending-hashtags-turkey" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] rounded-lg transition-colors">Trend Hashtag&apos;ler</Link>
                <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] rounded-lg transition-colors">Hakkımızda</Link>
                <div className="border-t border-white/[0.06] my-2" />
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-white/[0.04] rounded-lg transition-colors">Giriş Yap</Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors">Ücretsiz Kayıt Ol</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/hero-creator.jpg" alt="" fill className="object-cover opacity-[0.06]" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        </div>
        <div className="absolute top-20 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-primary/[0.04] rounded-full blur-[150px]" />
        <div className="absolute top-40 right-1/4 w-56 md:w-80 h-56 md:h-80 bg-teal/[0.04] rounded-full blur-[150px]" />

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
                <Link href="/register" className={`inline-flex items-center gap-2 bg-primary/90 backdrop-blur-sm text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary transition-all font-medium text-sm shadow-lg shadow-primary/20`}>
                  Ücretsiz Analiz Başlat <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/login" className={`inline-flex items-center gap-2 ${glass} text-foreground px-6 py-3 rounded-xl ${glassHover} transition-all font-medium text-sm`}>
                  <Play className="w-4 h-4" /> Dashboard Demo
                </Link>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
                className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["E", "A", "S", "C"].map((letter) => (
                    <div key={letter} className="w-7 h-7 rounded-full bg-primary/15 border-2 border-background flex items-center justify-center text-[10px] font-bold text-primary backdrop-blur-sm">
                      {letter}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-primary fill-primary" />
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground">3,000+ üretici tarafından kullanılıyor</p>
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
              TikTok Büyümesi İçin{" "}
              <span className="text-primary">Güçlü Araçlar</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Viral olmak için ihtiyacınız olan her araç tek bir platformda.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className={`group relative ${glass} rounded-xl p-5 md:p-6 ${glassHover} transition-all duration-300`}>
                <div className="relative">
                  <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <f.icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <h3 className="text-sm md:text-base font-semibold text-foreground mb-2">{f.title}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
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
                className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center`}>
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
              3 Adımda <span className="text-teal">Başla</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Ücretsiz hesap oluşturun ve dakikalar içinde trendleri keşfetmeye başlayın.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="relative text-center">
                <div className={`w-14 h-14 rounded-2xl ${glass} flex items-center justify-center mx-auto mb-4`}>
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-[10px] text-primary font-bold mb-1.5 uppercase tracking-wider">Adım {step.num}</div>
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
              Size <span className="text-teal">Ne</span> Kazandırırız?
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              İster bireysel içerik üretici olun, ister marka. Valyze TR ile TikTok stratejinizi tamamen dönüştürün.
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
                  <h3 className="text-lg font-bold text-foreground">Bireysel Üreticiler</h3>
                  <p className="text-xs text-muted-foreground">İçerik üreticileri ve kreatörler</p>
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
                <p className="text-xs text-muted-foreground mb-2">Lite planından başlayarak:</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-teal">{"\u20BA"}280</span>
                  <span className="text-xs text-muted-foreground">/ay&apos;dan başlayan fiyatlar</span>
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
                  <p className="text-xs text-muted-foreground">Şirketler ve dijital ajanslar</p>
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
                <p className="text-xs text-muted-foreground mb-2">Tüm özellikler dahil:</p>
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
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">Üreticiler Ne Diyor?</h2>
            <p className="text-sm text-muted-foreground">Binlerce içerik üreticisi Valyze TR ile büyüyor.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {testimonials.map((t, i) => (
              <motion.div key={t.author} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className={`${glass} rounded-xl p-4 md:p-5 ${glassHover} transition-all duration-300`}>
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-3 h-3 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold backdrop-blur-sm">{t.avatar}</div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t.author}</p>
                    <p className="text-[10px] text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="relative py-16 md:py-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal/[0.03] rounded-full blur-[180px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/[0.03] rounded-full blur-[180px]" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Şeffaf <span className="text-teal">Fiyatlandırma</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Gizli ücret yok, sürpriz yok. İhtiyacınıza uygun planı seçin, istediğiniz zaman iptal edin.
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
                    <Star className="w-2.5 h-2.5" /> EN POPÜLER
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
                <span>İstediğin zaman iptal</span>
              </div>
              <div className="w-px h-4 bg-white/[0.06]" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="w-3.5 h-3.5 text-teal" />
                <span>iyzico güvenli ödeme</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className={`relative ${glass} rounded-2xl p-8 md:p-14 overflow-hidden`}>
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/[0.04] rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal/[0.04] rounded-full blur-[120px]" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                Bugünden <span className="text-primary">Büyümeye</span> Başla
              </h2>
              <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
                Viral fırsatları keşfetmek için Valyze TR kullanan binlerce üreticiye katılın.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/register" className="inline-flex items-center gap-2 bg-primary/90 backdrop-blur-sm text-primary-foreground px-8 py-3 rounded-xl hover:bg-primary transition-all font-medium text-sm shadow-lg shadow-primary/20">
                  Ücretsiz Hesap Oluştur <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/contact" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors">
                  <MessageCircle className="w-4 h-4" /> Bize Ulaşın
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
              <p className="text-xs text-muted-foreground leading-relaxed">Türkiye&apos;nin TikTok trend analiz platformu. Veriye dayalı büyüme.</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Platform</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Özellikler</a></li>
                <li><a href="#pricing" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Fiyatlandırma</a></li>
                <li><Link href="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Hakkımızda</Link></li>
                <li><Link href="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors">İletişim</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Araçlar</h4>
              <ul className="space-y-2">
                <li><Link href="/viral-tiktok-videos-turkey" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Viral Videolar</Link></li>
                <li><Link href="/trending-hashtags-turkey" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Trend Hashtag&apos;ler</Link></li>
                <li><Link href="/tiktok-trend-report" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Haftalık Rapor</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">Yasal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy-policy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Gizlilik Politikası</Link></li>
                <li><Link href="/terms-of-service" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Kullanım Şartları</Link></li>
                <li><Link href="/mesafeli-satis-sozlesmesi" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Mesafeli Satış</Link></li>
                <li><Link href="/iptal-ve-iade" className="text-xs text-muted-foreground hover:text-foreground transition-colors">İptal ve İade</Link></li>
                <li><Link href="/cookie-policy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Çerez Politikası</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/[0.06] pt-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <p className="text-[10px] text-muted-foreground">&copy; 2026 Valyze TR. Tüm hakları saklıdır.</p>
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
