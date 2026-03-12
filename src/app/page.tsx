"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FiTrendingUp,
  FiHash,
  FiPlay,
  FiClock,
  FiZap,
  FiTarget,
  FiBarChart2,
  FiArrowRight,
  FiCheck,
  FiStar,
  FiSearch,
  FiMessageCircle,
  FiMenu,
  FiX,
} from "react-icons/fi";
import LogoLink from "@/components/LogoLink";

/* ─── Data ─── */

const features = [
  {
    icon: FiTrendingUp,
    title: "Viral Trend Tespiti",
    desc: "Trendleri herkes fark etmeden tespit edin.",
    color: "text-neon-red",
    bg: "bg-neon-red/10",
  },
  {
    icon: FiHash,
    title: "Hashtag Analizi",
    desc: "Yuksek performansli hashtag'leri kesfedin.",
    color: "text-teal",
    bg: "bg-teal/10",
  },
  {
    icon: FiPlay,
    title: "Viral Video Veritabani",
    desc: "En viral videolari inceleyin ve analiz edin.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: FiClock,
    title: "Paylasim Zamani",
    desc: "En iyi paylasim zamanlarini bulun.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: FiZap,
    title: "AI Icerik Fikirleri",
    desc: "Trend konulara dayali icerik onerileri.",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
  {
    icon: FiTarget,
    title: "Rakip Analizi",
    desc: "Rakiplerinizi analiz edip one gecin.",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
];

const steps = [
  { num: "1", title: "Kesfet", desc: "Trend video ve hashtag'leri kesfet", icon: FiSearch },
  { num: "2", title: "Analiz Et", desc: "Neden viral oldugunu anla", icon: FiBarChart2 },
  { num: "3", title: "Buyut", desc: "Daha iyi icerik uret, hizli buyu", icon: FiTrendingUp },
];

const testimonials = [
  {
    quote: "Hangi videolarin viral oldugunu artik biliyorum. Cok faydali!",
    author: "Elif K.",
    role: "Icerik Uretici",
    avatar: "E",
  },
  {
    quote: "Saatlerce arastirma yapmaktan kurtardilar. Neyin tutacagini biliyorum.",
    author: "Ahmet D.",
    role: "TikTok Kreatoru",
    avatar: "A",
  },
  {
    quote: "Rakip analizi ozelligi tek basina Pro'ya gecmeye deger.",
    author: "Selin M.",
    role: "Dijital Pazarlamaci",
    avatar: "S",
  },
];

const freePlanFeatures = [
  "Sinirli gunluk analiz",
  "Temel trend paneli",
  "Sinirli hashtag verisi",
];

const proPlanFeatures = [
  "Sinirsiz trend analizi",
  "Tam viral video veritabani",
  "Rakip analizi",
  "AI icerik fikirleri",
  "Hook analizi",
  "Gunluk raporlar",
  "Oncelikli destek",
];

/* ─── Component ─── */

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <LogoLink />

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Ozellikler</a>
            <a href="#pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Fiyatlandirma</a>
            <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Giris Yap
            </Link>
            <Link href="/register" className="text-sm bg-neon-red text-white px-4 py-2 rounded-lg hover:bg-neon-red-light transition-colors font-medium">
              Ucretsiz Basla
            </Link>
          </div>

          {/* Mobile: CTA + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/register" className="text-xs bg-neon-red text-white px-3 py-1.5 rounded-lg font-medium">
              Basla
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-surface-light transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-light rounded-lg transition-colors">Ozellikler</a>
                <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-light rounded-lg transition-colors">Fiyatlandirma</a>
                <Link href="/viral-tiktok-videos-turkey" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-light rounded-lg transition-colors">Viral Videolar</Link>
                <Link href="/trending-hashtags-turkey" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-light rounded-lg transition-colors">Trend Hashtag&apos;ler</Link>
                <Link href="/tiktok-trend-report" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-light rounded-lg transition-colors">Haftalik Rapor</Link>
                <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-light rounded-lg transition-colors">Hakkimizda</Link>
                <div className="border-t border-border my-2" />
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-light rounded-lg transition-colors">Giris Yap</Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-neon-red hover:bg-neon-red/5 rounded-lg transition-colors">Ucretsiz Kayit Ol</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-24 pb-12 md:pt-32 md:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-neon-red/8 rounded-full blur-[100px]" />
        <div className="absolute top-40 right-1/4 w-56 md:w-80 h-56 md:h-80 bg-teal/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 md:w-[500px] h-40 bg-purple-400/5 rounded-full blur-[120px]" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-neon-red/10 border border-neon-red/20 text-neon-red text-xs px-3 py-1.5 rounded-full mb-5"
          >
            <FiZap className="w-3 h-3" />
            Turkiye&apos;nin #1 TikTok Analiz Platformu
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-5"
          >
            Viral Trendleri{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-red to-teal">
              Herkesten Once
            </span>{" "}
            Kesfet
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto mb-6 leading-relaxed"
          >
            Binlerce TikTok videosunu analiz edip viral firsatlari kesfetmenize ve daha hizli buyumenize yardimci olur.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6"
          >
            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neon-red text-white px-6 py-3 rounded-xl hover:bg-neon-red-light transition-all font-medium text-sm hover:shadow-lg hover:shadow-neon-red/20"
            >
              Ucretsiz Basla <FiArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface border border-border text-text-primary px-6 py-3 rounded-xl hover:border-neon-red/30 transition-all font-medium text-sm"
            >
              Giris Yap
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-12 md:py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Ihtiyacin Olan{" "}
              <span className="text-neon-red">Her Sey</span>
            </h2>
            <p className="text-sm text-text-secondary max-w-md mx-auto">
              TikTok&apos;ta viral olmak icin guclu araclar
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-surface border border-border rounded-xl p-4 md:p-5 hover:border-neon-red/20 transition-all"
              >
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${f.bg} flex items-center justify-center mb-3`}>
                  <f.icon className={`w-5 h-5 md:w-6 md:h-6 ${f.color}`} />
                </div>
                <h3 className="text-sm md:text-base font-semibold text-text-primary mb-1">{f.title}</h3>
                <p className="text-xs md:text-sm text-text-secondary leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-12 md:py-20 px-4 sm:px-6 bg-surface/50">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold text-center mb-8 md:mb-12"
          >
            Nasil <span className="text-neon-red">Calisir?</span>
          </motion.h2>

          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex-1 flex md:flex-col items-center md:text-center gap-4 md:gap-0 bg-surface md:bg-transparent border border-border md:border-0 rounded-xl p-4 md:p-0"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-neon-red/10 border border-neon-red/20 flex items-center justify-center shrink-0 md:mx-auto md:mb-3">
                  <step.icon className="w-5 h-5 md:w-6 md:h-6 text-neon-red" />
                </div>
                <div className="flex-1 md:flex-auto">
                  <div className="text-[10px] text-neon-red font-bold mb-1">ADIM {step.num}</div>
                  <h3 className="text-base font-bold text-text-primary mb-0.5">{step.title}</h3>
                  <p className="text-xs text-text-secondary">{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <FiArrowRight className="hidden md:block w-4 h-4 text-text-muted absolute -right-3 top-7" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-12 md:py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              Basit{" "}
              <span className="text-teal">Fiyatlandirma</span>
            </h2>
            <p className="text-sm text-text-secondary">
              Ucretsiz basla, ihtiyacin oldugunda yukselt.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-surface border border-border rounded-2xl p-5 md:p-6"
            >
              <h3 className="text-base font-bold text-text-primary mb-1">Ucretsiz</h3>
              <p className="text-xs text-text-secondary mb-3">Baslangic icin</p>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-3xl md:text-4xl font-bold text-text-primary">{"\u20BA"}0</span>
                <span className="text-sm text-text-muted">/ay</span>
              </div>
              <ul className="space-y-2.5 mb-5">
                {freePlanFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                    <FiCheck className="w-4 h-4 text-text-muted shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block w-full text-center bg-surface-light border border-border text-text-primary py-2.5 rounded-xl text-sm font-medium hover:border-neon-red/30 transition-colors"
              >
                Ucretsiz Basla
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-surface border-2 border-neon-red/30 rounded-2xl p-5 md:p-6 relative"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neon-red text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <FiStar className="w-2.5 h-2.5" /> EN POPULER
              </div>
              <h3 className="text-base font-bold text-text-primary mb-1">Pro</h3>
              <p className="text-xs text-text-secondary mb-3">Ciddi ureticiler icin</p>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-3xl md:text-4xl font-bold text-neon-red">{"\u20BA"}299</span>
                <span className="text-sm text-text-muted">/ay</span>
              </div>
              <ul className="space-y-2.5 mb-5">
                {proPlanFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                    <FiCheck className="w-4 h-4 text-teal shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
                className="block w-full text-center bg-neon-red text-white py-2.5 rounded-xl text-sm font-medium hover:bg-neon-red-light transition-colors hover:shadow-lg hover:shadow-neon-red/20"
              >
                Pro&apos;ya Yukselt
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-12 md:py-20 px-4 sm:px-6 bg-surface/50">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold text-center mb-8"
          >
            Ureticiler Ne Diyor?
          </motion.h2>

          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto snap-x snap-mandatory pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface border border-border rounded-xl p-4 md:p-5 min-w-[260px] md:min-w-0 snap-start"
              >
                <div className="flex items-center gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <FiStar key={j} className="w-3 h-3 text-neon-red fill-neon-red" />
                  ))}
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full gradient-red flex items-center justify-center text-white text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{t.author}</p>
                    <p className="text-[10px] text-text-muted">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-12 md:py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-neon-red/10 via-surface to-teal/10 border border-border rounded-2xl p-6 md:p-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">
              Bugunden{" "}
              <span className="text-neon-red">Buyumeye</span>{" "}
              Basla
            </h2>
            <p className="text-sm text-text-secondary mb-6 max-w-md mx-auto">
              Viral firsatlari kesfetmek icin Valyze kullanan ureticilere katilin.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-neon-red text-white px-6 py-3 rounded-xl hover:bg-neon-red-light transition-all font-medium text-sm hover:shadow-lg hover:shadow-neon-red/20"
            >
              Ucretsiz Hesap Olustur <FiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border py-8 md:py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="mb-2">
                <LogoLink size="sm" />
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Turkiye&apos;nin TikTok trend analiz platformu.
              </p>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-xs font-semibold text-text-primary uppercase mb-2">Platform</h4>
              <ul className="space-y-1.5">
                <li><a href="#features" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Ozellikler</a></li>
                <li><a href="#pricing" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Fiyatlandirma</a></li>
                <li><Link href="/about" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Hakkimizda</Link></li>
                <li><Link href="/contact" className="text-xs text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"><FiMessageCircle className="w-3 h-3" /> Iletisim</Link></li>
              </ul>
            </div>

            {/* Tools */}
            <div>
              <h4 className="text-xs font-semibold text-text-primary uppercase mb-2">Araclar</h4>
              <ul className="space-y-1.5">
                <li><Link href="/viral-tiktok-videos-turkey" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Viral Videolar</Link></li>
                <li><Link href="/trending-hashtags-turkey" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Trend Hashtag&apos;ler</Link></li>
                <li><Link href="/tiktok-trend-report" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Haftalik Rapor</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-xs font-semibold text-text-primary uppercase mb-2">Yasal</h4>
              <ul className="space-y-1.5">
                <li><Link href="/privacy-policy" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Gizlilik</Link></li>
                <li><Link href="/terms-of-service" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Kullanim Sartlari</Link></li>
                <li><Link href="/cookie-policy" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Cerez Politikasi</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-4 flex items-center justify-between">
            <p className="text-[10px] text-text-muted">&copy; 2026 Valyze</p>
            <p className="text-[10px] text-text-muted">Turkiye&apos;de yapildi</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
