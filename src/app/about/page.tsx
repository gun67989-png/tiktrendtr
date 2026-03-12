"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FiTarget,
  FiEye,
  FiHeart,
  FiShield,
  FiUsers,
  FiTrendingUp,
  FiZap,
  FiGlobe,
  FiArrowRight,
  FiMessageCircle,
} from "react-icons/fi";
import LogoLink from "@/components/LogoLink";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const values = [
  {
    icon: FiShield,
    title: "Guvenilirlik",
    desc: "Gercek veriye dayali analizler sunuyoruz. Tahmin degil, olcum yapiyoruz. Her veri noktasi dogrulanmis kaynaklardan geliyor.",
    color: "text-teal",
    bg: "bg-teal/10",
  },
  {
    icon: FiZap,
    title: "Hiz",
    desc: "Trendler hizla degisir. Platformumuz verileri surekli guncelleyerek firsatlari kacirmanizi onler.",
    color: "text-neon-red",
    bg: "bg-neon-red/10",
  },
  {
    icon: FiUsers,
    title: "Topluluk Odaklilik",
    desc: "Turkiye'deki icerik ureticilerinin ihtiyaclarina odaklaniyoruz. Her ozellik gercek kullanici geri bildirimlerine dayanir.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: FiGlobe,
    title: "Erisebilirlik",
    desc: "Profesyonel analiz araclarini herkes icin erisilebilir kiliyoruz. Ucretsiz plan ile herkes trenleri takip edebilir.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
];

const milestones = [
  {
    year: "2025 Q3",
    title: "Fikir Asamasi",
    desc: "Turkiye'deki icerik ureticilerinin trend takibinde yasadigi zorluklar fark edildi.",
  },
  {
    year: "2025 Q4",
    title: "Gelistirme Basladi",
    desc: "Veri toplama altyapisi ve AI tabanli analiz motoru gelistirilmeye baslandi.",
  },
  {
    year: "2026 Q1",
    title: "Beta Lansman",
    desc: "Ilk kullanicilar platforma davet edildi. Geri bildirimlerle hizla iyilestirildi.",
  },
  {
    year: "2026 Q2",
    title: "Halka Acik Lansman",
    desc: "Pro plan, rakip analizi ve AI icerik onerileri ile tam surum yayinlandi.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <LogoLink />
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors px-4 py-2"
            >
              Giris Yap
            </Link>
            <Link
              href="/register"
              className="text-sm bg-neon-red text-white px-4 py-2 rounded-lg hover:bg-neon-red-light transition-colors font-medium"
            >
              Ucretsiz Basla
            </Link>
          </div>
        </div>
      </nav>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="pt-28 pb-20 px-6"
      >
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <motion.div variants={item} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-neon-red/10 border border-neon-red/20 text-neon-red text-xs px-4 py-1.5 rounded-full mb-4">
              <FiHeart className="w-3 h-3" />
              Hakkimizda
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Turkiye&apos;nin TikTok{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-red to-teal">
                Trend Analiz
              </span>{" "}
              Platformu
            </h1>
            <p className="text-text-secondary text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Valyze, Turkiye&apos;deki icerik ureticilerine, markalara ve
              dijital pazarlamacilara veri odakli TikTok analizi sunan bagimsiz
              bir teknoloji platformudur.
            </p>
          </motion.div>

          {/* Misyon */}
          <motion.div
            variants={item}
            className="bg-surface border border-border rounded-2xl p-6 md:p-8 mb-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-neon-red/10 flex items-center justify-center shrink-0">
                <FiTarget className="w-6 h-6 text-neon-red" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary mb-2">
                  Misyonumuz
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Turkiye&apos;deki dijital icerik ureticilerinin dogru zamanda
                  dogru trende yonelmesini saglayarak buyumelerini
                  hizlandirmak. Binlerce videoyu analiz ederek neyin viral
                  oldugunu, neden viral oldugunu ve bir sonraki trendin ne
                  olacagini anlasilir sekilde sunuyoruz. Amacimiz, buyuk
                  ajanslarin sahip oldugu veri avantajini bireysel ureticilere
                  de ulastirmak.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Vizyon */}
          <motion.div
            variants={item}
            className="bg-surface border border-border rounded-2xl p-6 md:p-8 mb-12"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center shrink-0">
                <FiEye className="w-6 h-6 text-teal" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary mb-2">
                  Vizyonumuz
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed">
                  Turkiye&apos;de sosyal medya analizinin referans noktasi
                  olmak. Sadece TikTok degil, tum kisa video platformlarinda
                  icerik ureticilerinin en guvenilir veri ortagi haline
                  gelmek istiyoruz. Yapay zeka destekli analizlerimizi
                  surekli gelistirerek ureticilerin sadece trendleri takip
                  etmesini degil, trendleri belirlemesini sagliyoruz.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Degerlerimiz */}
          <motion.div variants={item} className="mb-12">
            <h2 className="text-xl font-bold text-text-primary text-center mb-6">
              Degerlerimiz
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((v) => (
                <motion.div
                  key={v.title}
                  variants={item}
                  className="bg-surface border border-border rounded-xl p-5 hover:border-neon-red/20 transition-all"
                >
                  <div
                    className={`w-10 h-10 rounded-lg ${v.bg} flex items-center justify-center mb-3`}
                  >
                    <v.icon className={`w-5 h-5 ${v.color}`} />
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary mb-1">
                    {v.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {v.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Ne Yapiyoruz */}
          <motion.div
            variants={item}
            className="bg-surface border border-border rounded-2xl p-6 md:p-8 mb-12"
          >
            <h2 className="text-lg font-bold text-text-primary mb-4">
              Ne Yapiyoruz?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-neon-red/10 flex items-center justify-center shrink-0 mt-0.5">
                  <FiTrendingUp className="w-3.5 h-3.5 text-neon-red" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">
                    Trend Analizi
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed mt-0.5">
                    Her gun binlerce Turkiye odakli TikTok videosunu tarayarak
                    viral trendleri, yukselen hashtag&apos;leri ve populer
                    sesleri tespit ediyoruz.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                  <FiZap className="w-3.5 h-3.5 text-teal" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">
                    AI Destekli Icerik Onerileri
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed mt-0.5">
                    Yapay zeka modellerimiz mevcut trendleri analiz ederek size
                    ozel icerik fikirleri, hook onerileri ve paylasim zamanlari
                    sunuyor.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-purple-400/10 flex items-center justify-center shrink-0 mt-0.5">
                  <FiUsers className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">
                    Rakip ve Pazar Analizi
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed mt-0.5">
                    Rakiplerinizin hangi iceriklerinin tuttugunuzu, hangi
                    formatlarin ise yaradigini ve sektorunuzdeki bosluklan
                    gormenizi sagliyoruz.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Yol Haritasi */}
          <motion.div variants={item} className="mb-12">
            <h2 className="text-xl font-bold text-text-primary text-center mb-6">
              Yolculugumuz
            </h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[18px] top-3 bottom-3 w-px bg-border hidden sm:block" />

              <div className="space-y-4">
                {milestones.map((m, i) => (
                  <motion.div
                    key={m.year}
                    variants={item}
                    className="flex items-start gap-4"
                  >
                    <div className="w-9 h-9 rounded-full bg-surface border-2 border-border flex items-center justify-center shrink-0 z-10 relative">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          i === milestones.length - 1
                            ? "bg-neon-red"
                            : "bg-text-muted"
                        }`}
                      />
                    </div>
                    <div className="flex-1 bg-surface border border-border rounded-xl p-4 hover:border-border/80 transition-all">
                      <span className="text-[10px] font-bold text-neon-red uppercase tracking-wider">
                        {m.year}
                      </span>
                      <h3 className="text-sm font-semibold text-text-primary mt-1">
                        {m.title}
                      </h3>
                      <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                        {m.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Rakamlar */}
          <motion.div
            variants={item}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12"
          >
            {[
              { label: "Analiz Edilen Video", value: "50.000+", color: "text-neon-red" },
              { label: "Aktif Kullanici", value: "2.500+", color: "text-teal" },
              { label: "Gunluk Guncelleme", value: "24/7", color: "text-purple-400" },
              { label: "Trend Tespiti", value: "%94", color: "text-blue-400" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-surface border border-border rounded-xl p-4 text-center"
              >
                <p className={`text-xl md:text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            variants={item}
            className="bg-gradient-to-br from-neon-red/10 via-surface to-teal/10 border border-border rounded-2xl p-6 md:p-8 text-center"
          >
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              Siz de Katilmak Ister Misiniz?
            </h2>
            <p className="text-sm text-text-secondary mb-5 max-w-md mx-auto">
              Binlerce icerik ureticisi viral firsatlari kesfetmek icin
              Valyze kullaniyor. Ucretsiz hesabinizi hemen olusturun.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neon-red text-white px-6 py-3 rounded-xl hover:bg-neon-red-light transition-all font-medium text-sm hover:shadow-lg hover:shadow-neon-red/20"
              >
                Ucretsiz Basla <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface border border-border text-text-primary px-6 py-3 rounded-xl hover:border-neon-red/30 transition-all font-medium text-sm"
              >
                <FiMessageCircle className="w-4 h-4" />
                Bize Ulasin
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <LogoLink size="sm" />
          <div className="flex items-center gap-6 text-xs text-text-secondary">
            <Link
              href="/contact"
              className="hover:text-text-primary transition-colors"
            >
              Iletisim
            </Link>
            <Link
              href="/privacy-policy"
              className="hover:text-text-primary transition-colors"
            >
              Gizlilik
            </Link>
            <Link
              href="/terms-of-service"
              className="hover:text-text-primary transition-colors"
            >
              Kullanim Sartlari
            </Link>
          </div>
          <p className="text-[10px] text-text-muted">
            &copy; 2026 Valyze
          </p>
        </div>
      </footer>
    </div>
  );
}
