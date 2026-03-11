"use client";

import { motion } from "framer-motion";
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
  FiUsers,
  FiActivity,
  FiSearch,
  FiMessageCircle,
} from "react-icons/fi";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const features = [
  {
    icon: FiTrendingUp,
    title: "Viral Trend Tespiti",
    desc: "Viral TikTok trendlerini herkes fark etmeden once tespit edin.",
    color: "text-neon-red",
    bg: "bg-neon-red/10",
  },
  {
    icon: FiHash,
    title: "Hashtag Istihbarati",
    desc: "Viral icerik ureticilerinin kullandigi yuksek performansli hashtag'leri kesfedin.",
    color: "text-teal",
    bg: "bg-teal/10",
  },
  {
    icon: FiPlay,
    title: "Viral Video Veritabani",
    desc: "En viral TikTok videolarini inceleyin ve basari nedenlerini analiz edin.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: FiClock,
    title: "En Iyi Paylasim Zamani",
    desc: "Maksimum etkilesim icin en iyi paylasim zamanlarini bulun.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: FiZap,
    title: "AI Icerik Fikir Uretici",
    desc: "Trend konulara dayali viral icerik fikirleri uretin.",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
  {
    icon: FiTarget,
    title: "Rakip Analizi",
    desc: "Rakiplerinizin stratejilerini analiz edin ve bir adim one gecin.",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
];

const steps = [
  {
    num: "01",
    title: "Kesfet",
    desc: "Trend TikTok videolarini ve hashtag'leri kesfedin.",
    icon: FiSearch,
  },
  {
    num: "02",
    title: "Analiz Et",
    desc: "Bu videolarin neden viral oldugunu analiz edin.",
    icon: FiBarChart2,
  },
  {
    num: "03",
    title: "Buyut",
    desc: "Daha iyi icerik uretin ve daha hizli buyuyun.",
    icon: FiActivity,
  },
];

const testimonials = [
  {
    quote: "Bu platform, hangi tur videolarin gercekten viral oldugunu anlamamda bana yardimci oldu.",
    author: "Elif K.",
    role: "Icerik Uretici",
    avatar: "E",
  },
  {
    quote: "Trend analizleri bana saatlerce arastirma yapmamdan kurtardi. Artik neyin tutacagini biliyorum.",
    author: "Ahmet D.",
    role: "TikTok Kreatoru",
    avatar: "A",
  },
  {
    quote: "Rakip analizi ozelligi tek basina Pro plana gecmeye deger. Cok guclu bir arac.",
    author: "Selin M.",
    role: "Dijital Pazarlamaci",
    avatar: "S",
  },
];

const freePlanFeatures = [
  "Sinirli gunluk analiz",
  "Temel trend paneli",
  "Sinirli hashtag verisi",
  "Sinirli video analizleri",
];

const proPlanFeatures = [
  "Sinirsiz trend analizi",
  "Tam viral video veritabani",
  "Rakip analizi",
  "AI icerik fikirleri",
  "Gelismis analizler",
  "Hook analizi",
  "Gunluk raporlar",
  "Oncelikli destek",
];

const dashboardPreviews = [
  { title: "Trend Videolar", desc: "En viral videolari anlik olarak takip edin", icon: FiPlay, color: "text-neon-red" },
  { title: "Hashtag Analizi", desc: "Yukselen hashtag'leri ve performanslarini gorun", icon: FiHash, color: "text-teal" },
  { title: "Viral Tahmin", desc: "AI destekli trend tahminleri alin", icon: FiTrendingUp, color: "text-purple-400" },
  { title: "Icerik Uretici Analizi", desc: "Basarili ureticilerin stratejilerini inceleyin", icon: FiUsers, color: "text-blue-400" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-red flex items-center justify-center">
              <FiTrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">TikTrend<span className="text-neon-red">TR</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/viral-tiktok-videos-turkey" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Viral Videolar</Link>
            <Link href="/trending-hashtags-turkey" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Trend Hashtag&apos;ler</Link>
            <Link href="/tiktok-trend-report" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Haftalik Rapor</Link>
            <a href="#pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Fiyatlandirma</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors px-4 py-2">
              Giris Yap
            </Link>
            <Link href="/register" className="text-sm bg-neon-red text-white px-4 py-2 rounded-lg hover:bg-neon-red-light transition-colors font-medium">
              Ucretsiz Basla
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* BG effects */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-neon-red/5 rounded-full blur-[120px]" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-teal/5 rounded-full blur-[120px]" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-neon-red/10 border border-neon-red/20 text-neon-red text-xs px-4 py-1.5 rounded-full mb-6"
          >
            <FiZap className="w-3 h-3" />
            Turkiye&apos;nin #1 TikTok Analiz Platformu
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold leading-tight mb-6"
          >
            Viral TikTok Trendlerini{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-red to-teal">
              Herkesten Once
            </span>{" "}
            Kesfedin
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            TikTrendTR binlerce TikTok videosunu, hashtag&apos;leri ve sesleri analiz ederek
            icerik ureticilerinin viral firsatlari kesfetmesine ve daha hizli buyumesine yardimci olur.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-neon-red text-white px-6 py-3 rounded-xl hover:bg-neon-red-light transition-all font-medium text-sm hover:shadow-lg hover:shadow-neon-red/20"
            >
              Ucretsiz Basla <FiArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-surface border border-border text-text-primary px-6 py-3 rounded-xl hover:border-neon-red/30 transition-all font-medium text-sm"
            >
              Giris Yap
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs text-text-muted"
          >
            TikTok icerik ureticileri tarafindan viral icerik firsatlarini kesfetmek icin kullaniliyor.
          </motion.p>
        </div>
      </section>

      {/* Platform Preview */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-14"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold mb-4">
              TikTok&apos;ta Viral Olmak Icin{" "}
              <span className="text-neon-red">Ihtiyaciniz Olan Her Sey</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-text-secondary max-w-xl mx-auto">
              TikTrendTR, Turkiye genelindeki trend videolari, hashtag&apos;leri ve sesleri analiz eder.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardPreviews.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface border border-border rounded-xl p-5 hover:border-neon-red/20 transition-all group"
              >
                <item.icon className={`w-8 h-8 ${item.color} mb-3 group-hover:scale-110 transition-transform`} />
                <h3 className="text-sm font-semibold text-text-primary mb-1">{item.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-surface/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-14"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold mb-4">
              TikTok Ureticileri Icin{" "}
              <span className="text-teal">Guclu Araclar</span>
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-surface border border-border rounded-xl p-6 hover:border-neon-red/20 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-base font-semibold text-text-primary mb-2">{f.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-14"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold mb-4">
              TikTrendTR{" "}
              <span className="text-neon-red">Nasil Calisir?</span>
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                <div className="w-16 h-16 rounded-2xl bg-neon-red/10 border border-neon-red/20 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7 text-neon-red" />
                </div>
                <div className="text-[10px] text-neon-red font-bold mb-2">ADIM {step.num}</div>
                <h3 className="text-lg font-bold text-text-primary mb-2">{step.title}</h3>
                <p className="text-sm text-text-secondary">{step.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8">
                    <FiArrowRight className="w-5 h-5 text-text-muted" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-surface/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-14"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold mb-4">
              Basit ve Seffaf{" "}
              <span className="text-teal">Fiyatlandirma</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-text-secondary">
              Ucretsiz baslayin, ihtiyaciniz oldugunda yukseltin.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-surface border border-border rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold text-text-primary mb-1">Ucretsiz</h3>
              <p className="text-xs text-text-secondary mb-4">Baslangic icin ideal</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-text-primary">$0</span>
                <span className="text-sm text-text-muted">/ay</span>
              </div>
              <ul className="space-y-3 mb-6">
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
              className="bg-surface border-2 border-neon-red/30 rounded-2xl p-6 relative"
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neon-red text-white text-[10px] font-bold px-3 py-1 rounded-full">
                POPULER
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-1">Pro</h3>
              <p className="text-xs text-text-secondary mb-4">Ciddi ureticiler icin</p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-neon-red">$19</span>
                <span className="text-sm text-text-muted">/ay</span>
              </div>
              <ul className="space-y-3 mb-6">
                {proPlanFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                    <FiCheck className="w-4 h-4 text-teal shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block w-full text-center bg-neon-red text-white py-2.5 rounded-xl text-sm font-medium hover:bg-neon-red-light transition-colors hover:shadow-lg hover:shadow-neon-red/20"
              >
                Pro&apos;ya Yukselt
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-14"
          >
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold mb-4">
              Ureticiler Ne Diyor?
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface border border-border rounded-xl p-5"
              >
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <FiStar key={j} className="w-3.5 h-3.5 text-neon-red fill-neon-red" />
                  ))}
                </div>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-red flex items-center justify-center text-white text-xs font-bold">
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

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-neon-red/10 via-surface to-teal/10 border border-border rounded-2xl p-10"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              TikTok&apos;unuzu{" "}
              <span className="text-neon-red">Bugunden</span>{" "}
              Buyutmeye Baslayin
            </h2>
            <p className="text-text-secondary mb-8 max-w-lg mx-auto">
              Viral icerik firsatlarini kesfetmek icin TikTrendTR kullanan ureticilere katilin.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-neon-red text-white px-8 py-3.5 rounded-xl hover:bg-neon-red-light transition-all font-medium hover:shadow-lg hover:shadow-neon-red/20"
            >
              Ucretsiz Hesap Olustur <FiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg gradient-red flex items-center justify-center">
                  <FiTrendingUp className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-base font-bold">TikTrend<span className="text-neon-red">TR</span></span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Turkiye&apos;deki TikTok trendlerini analiz edin ve viral icerik firsatlarini kesfedin.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-text-primary uppercase mb-3">Platform</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Ozellikler</a></li>
                <li><a href="#pricing" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Fiyatlandirma</a></li>
                <li><a href="#how-it-works" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Nasil Calisir</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-text-primary uppercase mb-3">Ucretsiz Araclar</h4>
              <ul className="space-y-2">
                <li><Link href="/viral-tiktok-videos-turkey" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Viral TikTok Videolari</Link></li>
                <li><Link href="/trending-hashtags-turkey" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Trend Hashtag&apos;ler</Link></li>
                <li><Link href="/tiktok-trend-report" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Haftalik Trend Raporu</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-text-primary uppercase mb-3">Yasal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy-policy" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Gizlilik Politikasi</Link></li>
                <li><Link href="/terms-of-service" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Kullanim Sartlari</Link></li>
                <li><Link href="/cookie-policy" className="text-xs text-text-secondary hover:text-text-primary transition-colors">Cerez Politikasi</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-text-primary uppercase mb-3">Iletisim</h4>
              <ul className="space-y-2">
                <li><Link href="/contact" className="text-xs text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2"><FiMessageCircle className="w-3 h-3" /> Destek & Iletisim</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-6 flex items-center justify-between">
            <p className="text-[10px] text-text-muted">&copy; 2026 TikTrendTR. Tum haklari saklidir.</p>
            <p className="text-[10px] text-text-muted">Turkiye&apos;de yapildi</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
