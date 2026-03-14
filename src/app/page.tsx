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
    desc: "Viral olma potansiyeli taşıyan videoları herkes fark etmeden tespit edin. AI destekli video analizi ile içerik stratejinizi şekillendirin.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Hash,
    title: "Hashtag Analizi",
    desc: "Yüksek performanslı hashtag'leri keşfedin, büyüme hızlarını takip edin ve içeriğinize en uygun etiketleri bulun.",
    color: "text-teal",
    bg: "bg-teal/10",
  },
  {
    icon: Music,
    title: "Ses Trend Analizi",
    desc: "TikTok'ta trend olan sesleri ve müzikleri takip edin. Viral olan sesleri erken yakalayıp içeriğinizde kullanın.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: Clock,
    title: "Paylaşım Zamanı",
    desc: "Hedef kitlenizin en aktif olduğu saatleri analiz edin. En iyi paylaşım zamanlarını bularak etkileşiminizi artırın.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Zap,
    title: "AI İçerik Fikirleri",
    desc: "Yapay zeka destekli içerik önerileri ile trend konulara uygun video fikirleri alın. Hook'lardan açıklamalara kadar her şey hazır.",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
  {
    icon: Target,
    title: "Rakip Analizi",
    desc: "Rakiplerinizin performansını takip edin, hangi içeriklerinin viral olduğunu görün ve stratejinizi buna göre optimize edin.",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
];

const featureDeepDives = [
  {
    badge: "Video Analizi",
    title: "Viral Videoları Herkesten Önce Keşfet",
    desc: "Binlerce TikTok videosunu gerçek zamanlı analiz ederek viral olma potansiyeli taşıyan içerikleri erken tespit edin. Görüntülenme artış hızı, etkileşim oranı ve paylaşım metrikleri ile viral videoları tahmin edin.",
    features: ["Gerçek zamanlı video takibi", "Viralite skoru hesaplama", "Kategori bazlı filtreleme", "Günlük video raporları"],
    mockup: "trends",
    image: "/images/login-bg-3.jpg",
  },
  {
    badge: "Hashtag Zekası",
    title: "Doğru Hashtag'lerle Keşfet Sayfasına Çık",
    desc: "Milyonlarca hashtag verisini analiz ederek sizin nişinize en uygun, yüksek performanslı etiketleri bulun. Büyüme trendlerini takip edin ve rakiplerinizin kullandığı hashtag'leri keşfedin.",
    features: ["Hashtag büyüme grafiği", "Rekabet analizi", "Niş hashtag önerileri", "Performans karşılaştırma"],
    mockup: "hashtags",
    image: "/images/feature-hashtags.jpg",
  },
  {
    badge: "Ses Trendleri",
    title: "Trend Sesleri Erken Yakala",
    desc: "TikTok'ta viral olan sesleri ve müzikleri takip edin. Hangi seslerin yükselişte olduğunu görün ve içeriğinizde doğru zamanda kullanarak etkileşiminizi artırın.",
    features: ["Ses popülerlik grafiği", "Yeni yükselen sesler", "Kategori bazlı sesler", "Kullanım istatistikleri"],
    mockup: "sounds",
    image: "/images/feature-sounds.jpg",
  },
  {
    badge: "AI Destekli",
    title: "Yapay Zeka ile İçerik Fikirleri Üret",
    desc: "Trend analizlerine dayalı yapay zeka önerileri ile içerik üretim sürecinizi hızlandırın. Hook fikirleri, video açıklamaları ve hashtag önerileri tek tıkla hazır.",
    features: ["AI hook önerileri", "Video açıklama şablonları", "Trend bazlı fikirler", "Reklam fikir üreteci"],
    mockup: "ai",
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
    quote: "Rakip analizi özelliği tek başına Pro'ya geçmeye değer. Rakiplerimi artık takip ediyorum.",
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

const freePlanFeatures = [
  "Sınırlı günlük analiz",
  "Temel video analiz paneli",
  "Sınırlı hashtag verisi",
  "Ses trendleri (sınırlı)",
];

const proPlanFeatures = [
  "Sınırsız video analizi",
  "Tam viral video veritabanı",
  "Rakip analizi",
  "AI içerik fikirleri",
  "Hook analizi",
  "Reklam fikir üreteci",
  "Günlük raporlar",
  "Öncelikli destek",
];

const useCases = [
  {
    icon: Users,
    title: "İçerik Üreticileri",
    desc: "Viral trendleri erken yakalayıp takipçi kitlenizi hızla büyütün.",
  },
  {
    icon: Target,
    title: "Markalar & Ajanslar",
    desc: "Rakip analizi ve trend verileriyle kampanya stratejinizi optimize edin.",
  },
  {
    icon: Sparkles,
    title: "E-ticaret",
    desc: "Trend ürünleri ve viral pazarlama fırsatlarını erken keşfedin.",
  },
];

const brandFeatures = [
  {
    title: "Rakip Savaş Odası",
    desc: "Rakiplerinizin TikTok stratejilerini derinlemesine analiz edin. Hangi içerikleri paylaştıklarını, etkileşim oranlarını ve büyüme trendlerini takip edin.",
    icon: Swords,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Marka Sağlık Skoru",
    desc: "AI destekli marka sağlık skoruyla markanızın TikTok performansını tek bir metrikle ölçün. Güçlü ve zayıf yönlerinizi keşfedin.",
    icon: BarChart2,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
  },
  {
    title: "Kampanya Analizi",
    desc: "Kampanya performansınızı gerçek zamanlı takip edin. ROI hesaplama, hedef karşılaştırma ve AI strateji önerileriyle kampanyalarınızı optimize edin.",
    icon: Target,
    color: "text-teal",
    bg: "bg-teal/10",
  },
  {
    title: "AI Strateji Danışmanı",
    desc: "Yapay zeka destekli strateji önerileriyle markanızı büyütün. Rakip analizleri, trend tahminleri ve içerik önerileri tek panelde.",
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
];

/* ─── Mockup Components ─── */

function DashboardMockup() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xl shadow-primary/5">
        {/* Top bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-card">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
          </div>
          <div className="flex-1 text-center text-[10px] text-muted-foreground">dashboard.valyze.app</div>
        </div>
        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Metric cards */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Trend Skoru", value: "94", change: "+12%", color: "text-primary" },
              { label: "Viral Index", value: "8.7", change: "+5%", color: "text-teal" },
              { label: "Büyüme", value: "23%", change: "+3%", color: "text-purple-400" },
            ].map((m) => (
              <div key={m.label} className="bg-muted/50 rounded-lg p-2.5">
                <p className="text-[9px] text-muted-foreground">{m.label}</p>
                <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
                <p className="text-[9px] text-teal">{m.change}</p>
              </div>
            ))}
          </div>
          {/* Chart mockup */}
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-[9px] text-muted-foreground mb-2">Trend Büyüme</p>
            <div className="flex items-end gap-1 h-16">
              {[30, 45, 35, 60, 50, 75, 65, 90, 80, 95, 85, 100].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-primary/20"
                  style={{ height: `${h}%` }}
                >
                  <div
                    className="w-full rounded-sm bg-primary transition-all"
                    style={{ height: `${Math.min(h + 10, 100)}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Table mockup */}
          <div className="space-y-1.5">
            {[
              { tag: "#tiktoktürkiye", views: "2.4M", trend: "+340%" },
              { tag: "#viralvideo", views: "1.8M", trend: "+220%" },
              { tag: "#trending", views: "956K", trend: "+180%" },
            ].map((row) => (
              <div key={row.tag} className="flex items-center justify-between bg-muted/30 rounded-md px-2.5 py-1.5">
                <span className="text-[10px] font-medium text-foreground">{row.tag}</span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground">{row.views}</span>
                  <span className="text-[9px] text-teal font-medium">{row.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Glow effects */}
      <div className="absolute -inset-4 bg-primary/5 rounded-2xl blur-2xl -z-10" />
    </div>
  );
}

/* ─── Component ─── */

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Subtle blue-red gradient overlay */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/[0.15] via-transparent to-rose-900/[0.12]" />
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-500/[0.06] rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] bg-rose-500/[0.05] rounded-full blur-[150px]" />
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-indigo-500/[0.04] rounded-full blur-[120px]" />
      </div>
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/70 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <LogoLink />
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Özellikler</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Fiyatlandırma</a>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Giriş Yap</Link>
            <ThemeToggle />
            <Link href="/register" className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
              Ücretsiz Başla
            </Link>
          </div>
          <div className="flex md:hidden items-center gap-2">
            <Link href="/register" className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-medium">Başla</Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Menu">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl overflow-hidden">
              <div className="px-4 py-4 space-y-1">
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">Özellikler</a>
                <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">Fiyatlandırma</a>
                <Link href="/viral-tiktok-videos-turkey" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">Viral Videolar</Link>
                <Link href="/trending-hashtags-turkey" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">Trend Hashtag&apos;ler</Link>
                <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">Hakkımızda</Link>
                <div className="border-t border-border my-2" />
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">Giriş Yap</Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors">Ücretsiz Kayıt Ol</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image src="/images/hero-creator.jpg" alt="" fill className="object-cover opacity-10" unoptimized />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        </div>
        {/* Background effects */}
        <div className="absolute top-20 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-40 right-1/4 w-56 md:w-80 h-56 md:h-80 bg-teal/5 rounded-full blur-[120px]" />
        {/* Floating photo accents */}
        <div className="hidden lg:block absolute top-32 right-8 w-20 h-20 rounded-xl overflow-hidden opacity-20 rotate-12">
          <Image src="/images/feature-sounds.jpg" alt="" fill className="object-cover" unoptimized />
        </div>
        <div className="hidden lg:block absolute bottom-16 left-8 w-24 h-16 rounded-xl overflow-hidden opacity-15 -rotate-6">
          <Image src="/images/feature-hashtags.jpg" alt="" fill className="object-cover" unoptimized />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Text */}
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs px-3 py-1.5 rounded-full mb-5">
                <Zap className="w-3 h-3" />
                T{"\u00FC"}rkiye&apos;nin #1 TikTok Video Analiz Platformu
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] mb-5">
                Her Videonun{" "}
                <span className="bg-gradient-to-r from-primary via-teal to-primary bg-clip-text text-transparent">Viral S{"\u0131"}rr{"\u0131"}n{"\u0131"}</span>{" "}
                {"\u00C7\u00F6"}z
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
                className="text-sm sm:text-base text-muted-foreground max-w-lg mb-6 leading-relaxed">
                TikTok videolar{"\u0131"}n{"\u0131"} derinlemesine analiz edin, hangi i{"\u00E7"}eriklerin neden viral oldu{"\u011F"}unu ke{"\u015F"}fedin. AI destekli video analizi ile rakiplerinizden bir ad{"\u0131"}m {"\u00F6"}nde olun.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}
                className="flex flex-col sm:flex-row items-start gap-3 mb-8">
                <Link href="/register" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium text-sm">
                  Ücretsiz Analiz Başlat <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/login" className="inline-flex items-center gap-2 bg-card border border-border text-foreground px-6 py-3 rounded-lg hover:bg-muted transition-colors font-medium text-sm">
                  <Play className="w-4 h-4" /> Dashboard Demo
                </Link>
              </motion.div>

              {/* Social proof */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}
                className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["E", "A", "S", "C"].map((letter) => (
                    <div key={letter} className="w-7 h-7 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-[10px] font-bold text-primary">
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

            {/* Right: Dashboard Mockup */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
              <DashboardMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="relative border-y border-border overflow-hidden">
        <Image src="/images/hero-creator.jpg" alt="" fill className="object-cover opacity-[0.04]" unoptimized />
        <div className="absolute inset-0 bg-card/80 backdrop-blur-sm" />
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
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.03]">
          <Image src="/images/login-bg-2.jpg" alt="" fill className="object-cover" unoptimized />
        </div>
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-teal/5 rounded-full blur-[120px]" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              TikTok Büyümesi İçin{" "}
              <span className="text-primary">Güçlü Araçlar</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Viral olmak için ihtiyacınız olan her araç tek bir platformda. Veri odaklı kararlar alın, içerik stratejinizi güçlendirin.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="group relative bg-card border border-border rounded-xl p-5 md:p-6 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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

      {/* ── Photo Strip ── */}
      <section className="py-6 md:py-10 overflow-hidden">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="flex gap-4 animate-[scroll_30s_linear_infinite]"
          style={{ width: "max-content" }}>
          {[...Array(2)].flatMap((_, setIdx) =>
            ["/images/login-bg-3.jpg", "/images/feature-hashtags.jpg", "/images/feature-sounds.jpg", "/images/feature-ai.jpg", "/images/hero-creator.jpg", "/images/cta-bg.jpg"].map((src, i) => (
              <div key={`${setIdx}-${i}`} className="relative w-48 h-28 md:w-64 md:h-36 rounded-xl overflow-hidden shrink-0 group">
                <Image src={src} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-110" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            ))
          )}
        </motion.div>
      </section>

      {/* ── Feature Deep Dives ── */}
      <section className="py-8 md:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-16 md:space-y-24">
          {featureDeepDives.map((fd, idx) => {
            const isReversed = idx % 2 === 1;
            return (
              <motion.div key={fd.badge} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${isReversed ? "md:direction-rtl" : ""}`}>
                {/* Text */}
                <div className={isReversed ? "md:order-2" : ""}>
                  <span className="inline-block text-[10px] font-semibold text-primary uppercase tracking-wider mb-3 bg-primary/10 px-2.5 py-1 rounded-full">
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
                {/* Visual */}
                <div className={isReversed ? "md:order-1" : ""}>
                  <div className="relative rounded-xl overflow-hidden group">
                    <Image
                      src={fd.image}
                      alt={fd.badge}
                      width={600}
                      height={400}
                      className="w-full h-72 sm:h-80 md:h-96 object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-xl" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-block text-[10px] font-semibold text-white uppercase tracking-wider bg-primary/80 backdrop-blur-sm px-2.5 py-1 rounded-full">
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
      <section className="relative py-16 md:py-24 px-4 sm:px-6 border-y border-border overflow-hidden">
        <Image src="/images/feature-hashtags.jpg" alt="" fill className="object-cover opacity-[0.04]" unoptimized />
        <div className="absolute inset-0 bg-card/90 backdrop-blur-sm" />
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
              <motion.div key={step.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-[10px] text-primary font-bold mb-1.5 uppercase tracking-wider">Adım {step.num}</div>
                <h3 className="text-base font-bold text-foreground mb-1">{step.title}</h3>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
                {i < steps.length - 1 && (
                  <ChevronRight className="hidden md:block absolute top-7 -right-3 w-5 h-5 text-muted-foreground/30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Use Cases ── */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-1/3 h-full opacity-[0.03]">
          <Image src="/images/feature-ai.jpg" alt="" fill className="object-cover" unoptimized />
        </div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Kimler İçin?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {useCases.map((uc, i) => (
              <motion.div key={uc.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-5 text-center hover:border-primary/20 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <uc.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{uc.title}</h3>
                <p className="text-sm text-muted-foreground">{uc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand Section ── */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.03] via-transparent to-purple-500/[0.03]" />
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-amber-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-purple-500/5 rounded-full blur-[120px]" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 md:mb-14">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-3 py-1.5 rounded-full mb-4">
              <Crown className="w-3 h-3" />
              Kurumsal Çözümler
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Markalar İçin{" "}
              <span className="bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">Güçlü Araçlar</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              TikTok&apos;ta marka bilinirliğinizi artırın, rakiplerinizi analiz edin ve AI destekli strateji önerileriyle kampanyalarınızı optimize edin.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 mb-10">
            {brandFeatures.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="group relative bg-card border border-border rounded-xl p-5 md:p-6 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/5 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.02] to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex gap-4">
                  <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <f.icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-semibold text-foreground mb-1.5">{f.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Brand CTA */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative overflow-hidden rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/5 via-card to-purple-500/5 p-6 md:p-8">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
              <div className="bg-amber-500/10 p-4 rounded-2xl">
                <Building2 className="w-8 h-8 text-amber-400" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-foreground mb-1">Markanız İçin Özel Çözüm</h3>
                <p className="text-sm text-muted-foreground">Kurumsal plana geçerek tüm marka araçlarına erişin. Rakip analizi, AI strateji ve detaylı raporlar dahil.</p>
              </div>
              <Link href="/pricing" className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-xl hover:bg-amber-600 transition-colors font-medium text-sm whitespace-nowrap">
                <Crown className="w-4 h-4" />
                Kurumsal Plan
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="relative py-16 md:py-24 px-4 sm:px-6 border-y border-border overflow-hidden">
        <Image src="/images/feature-sounds.jpg" alt="" fill className="object-cover opacity-[0.04]" unoptimized />
        <div className="absolute inset-0 bg-card/90 backdrop-blur-sm" />
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">Üreticiler Ne Diyor?</h2>
            <p className="text-sm text-muted-foreground">Binlerce içerik üreticisi Valyze TR ile büyüyor.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {testimonials.map((t, i) => (
              <motion.div key={t.author} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-4 md:p-5">
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-3 h-3 text-primary fill-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">{t.avatar}</div>
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
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 opacity-[0.03]">
          <Image src="/images/login-bg-2.jpg" alt="" fill className="object-cover" unoptimized />
        </div>
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-teal/5 rounded-full blur-[120px]" />
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Basit <span className="text-teal">Fiyatlandırma</span>
            </h2>
            <p className="text-sm text-muted-foreground">Ücretsiz başla, ihtiyacın olduğunda yükselt. Gizli ücret yok.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
            {/* Free */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-card border border-border rounded-xl p-5 md:p-7">
              <h3 className="text-base font-bold text-foreground mb-1">Ücretsiz</h3>
              <p className="text-xs text-muted-foreground mb-4">Başlangıç için ideal</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-foreground">{"\u20BA"}0</span>
                <span className="text-sm text-muted-foreground">/ay</span>
              </div>
              <ul className="space-y-3 mb-6">
                {freePlanFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-muted-foreground/60 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block w-full text-center bg-muted border border-border text-foreground py-2.5 rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors">
                Ücretsiz Başla
              </Link>
            </motion.div>

            {/* Pro */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="bg-card border-2 border-primary/30 rounded-xl p-5 md:p-7 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Star className="w-2.5 h-2.5" /> EN POPÜLER
              </div>
              <h3 className="text-base font-bold text-foreground mb-1 flex items-center gap-2">Pro <Zap className="w-4 h-4 text-primary" /></h3>
              <p className="text-xs text-muted-foreground mb-4">Profesyonel içerik üreticileri için</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-primary">{"\u20BA"}299</span>
                <span className="text-sm text-muted-foreground">/ay</span>
              </div>
              <ul className="space-y-3 mb-6">
                {proPlanFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-teal shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/pricing" className="block w-full text-center bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                Pro&apos;ya Yükselt
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="relative bg-card border border-border rounded-2xl p-8 md:p-14 overflow-hidden">
            <Image src="/images/cta-bg.jpg" alt="" fill className="object-cover opacity-10" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-br from-card via-card/95 to-card/80" />
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal/5 rounded-full blur-[100px]" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                Bugünden <span className="text-primary">Büyümeye</span> Başla
              </h2>
              <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto">
                Viral fırsatları keşfetmek için Valyze TR kullanan binlerce üreticiye katılın. Ücretsiz hesap oluşturun.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/register" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium text-sm">
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
      <footer className="border-t border-border py-10 md:py-14 px-4 sm:px-6">
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

          <div className="border-t border-border pt-5">
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
