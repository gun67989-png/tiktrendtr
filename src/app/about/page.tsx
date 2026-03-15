"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Target,
  Eye,
  Heart,
  Shield,
  Users,
  TrendingUp,
  Zap,
  Globe,
  ArrowRight,
  MessageCircle,
  Brain,
  BarChart2,
  Sparkles,
  Clock,
} from "lucide-react";
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
    icon: Shield,
    title: "G\u00FCvenilirlik",
    desc: "Ger\u00E7ek veriye dayal\u0131 analizler sunuyoruz. Tahmin de\u011Fil, \u00F6l\u00E7\u00FCm yap\u0131yoruz. Her veri noktas\u0131 do\u011Frulanm\u0131\u015F kaynaklardan geliyor.",
    color: "text-teal",
    bg: "bg-teal/10",
  },
  {
    icon: Zap,
    title: "H\u0131z",
    desc: "Trendler h\u0131zla de\u011Fi\u015Fir. Platformumuz verileri s\u00FCrekli g\u00FCncelleyerek f\u0131rsatlar\u0131 ka\u00E7\u0131rman\u0131z\u0131 \u00F6nler.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Users,
    title: "Topluluk Odakl\u0131l\u0131k",
    desc: "T\u00FCrkiye\u2019deki i\u00E7erik \u00FCreticilerinin ihtiya\u00E7lar\u0131na odaklan\u0131yoruz. Her \u00F6zellik ger\u00E7ek kullan\u0131c\u0131 geri bildirimlerine dayan\u0131r.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: Globe,
    title: "Eri\u015Febilirlik",
    desc: "Profesyonel analiz ara\u00E7lar\u0131n\u0131 herkes i\u00E7in eri\u015Filebilir k\u0131l\u0131yoruz. \u00DCcretsiz plan ile herkes trendleri takip edebilir.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
];

const milestones = [
  {
    year: "2025 Q3",
    title: "Fikir A\u015Famas\u0131",
    desc: "T\u00FCrkiye\u2019deki i\u00E7erik \u00FCreticilerinin trend takibinde ya\u015Fad\u0131\u011F\u0131 zorluklar fark edildi.",
    active: false,
  },
  {
    year: "2025 Q4",
    title: "Geli\u015Ftirme Ba\u015Flad\u0131",
    desc: "Veri toplama altyap\u0131s\u0131 ve AI tabanl\u0131 analiz motoru geli\u015Ftirilmeye ba\u015Fland\u0131.",
    active: false,
  },
  {
    year: "2026 Q1",
    title: "Beta Lansman",
    desc: "\u0130lk kullan\u0131c\u0131lar platforma davet edildi. Geri bildirimlerle h\u0131zla iyile\u015Ftirildi.",
    active: true,
  },
  {
    year: "2026 Q2",
    title: "Halka A\u00E7\u0131k Lansman",
    desc: "Pro plan, rakip analizi ve AI i\u00E7erik \u00F6nerileri ile tam s\u00FCr\u00FCm yay\u0131nland\u0131.",
    active: false,
  },
];

const whyValyze = [
  {
    icon: Brain,
    title: "\u00C7ift AI Motor",
    desc: "Gemini ve Claude AI modellerini bir arada kullanarak daha derin, daha do\u011Fru analizler sunuyoruz. Tek bir AI\u2019dan fazlas\u0131.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: Target,
    title: "T\u00FCrkiye Odakl\u0131",
    desc: "Global platformlar\u0131n g\u00F6rmezden geldi\u011Fi T\u00FCrk\u00E7e i\u00E7erik ekosistemini derinlemesine analiz ediyoruz. 70+ T\u00FCrk\u00E7e anahtar kelime takibi.",
    color: "text-teal",
    bg: "bg-teal/10",
  },
  {
    icon: Clock,
    title: "S\u00FCrekli G\u00FCncelleme",
    desc: "Veriler 6 saatte bir otomatik g\u00FCncellenir. Trend de\u011Fi\u015Fikliklerini ger\u00E7ek zamanl\u0131 olarak takip edin, f\u0131rsatlar\u0131 ka\u00E7\u0131rmay\u0131n.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: BarChart2,
    title: "Aksiyona D\u00F6n\u00FC\u015Fen Veri",
    desc: "Sadece say\u0131lar de\u011Fil, ne yapman\u0131z gerekti\u011Fini s\u00F6yl\u00FCyoruz. AI destekli i\u00E7erik \u00F6nerileri, hook fikirleri ve zamanlama tavsiyeleri.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <LogoLink />
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
            >
              Giri\u015F Yap
            </Link>
            <Link
              href="/register"
              className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors font-medium"
            >
              \u00DCcretsiz Ba\u015Fla
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div variants={item} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs px-4 py-1.5 rounded-full mb-4">
              <Heart className="w-3 h-3" />
              Hikayemiz
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">
              \u0130\u00E7erik \u00DCreticilerinin{" "}
              <span className="bg-gradient-to-r from-primary via-teal to-primary bg-clip-text text-transparent">
                Hikayelerini
              </span>{" "}
              Daha Geni\u015F Kitlelere Ula\u015Ft\u0131r\u0131yoruz
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Valyze, T\u00FCrkiye&apos;deki her i\u00E7erik \u00FCreticisinin
              profesyonel veri analizine eri\u015Febilmesini sa\u011Flayan ba\u011F\u0131ms\u0131z bir teknoloji
              platformudur. B\u00FCy\u00FCk ajanslar\u0131n sahip oldu\u011Fu veri avantaj\u0131n\u0131 bireysel
              \u00FCreticilere de ta\u015F\u0131yoruz.
            </p>
          </motion.div>

          {/* Misyon & Vizyon Cards */}
          <div className="grid md:grid-cols-2 gap-5 mb-16">
            <motion.div
              variants={item}
              className="group bg-card border border-border rounded-2xl p-6 md:p-8 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-foreground mb-3">
                Misyonumuz
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Her i\u00E7erik \u00FCreticisinin sesini duyurmas\u0131n\u0131 sa\u011Flamak. Binlerce
                videoyu analiz ederek neyin viral oldu\u011Funu, neden oldu\u011Funu ve bir
                sonraki f\u0131rsat\u0131n ne olaca\u011F\u0131n\u0131 herkesin anlayabilece\u011Fi \u015Fekilde
                sunuyoruz. Amac\u0131m\u0131z, veri odakl\u0131 i\u00E7erik \u00FCretimini
                demokratikle\u015Ftirmek ve T\u00FCrkiye&apos;deki \u00FCreticilerin
                b\u00FCy\u00FCmesini h\u0131zland\u0131rmak.
              </p>
            </motion.div>

            <motion.div
              variants={item}
              className="group bg-card border border-border rounded-2xl p-6 md:p-8 hover:border-teal/20 hover:shadow-lg hover:shadow-teal/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal/20 to-teal/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6 text-teal" />
              </div>
              <h2 className="text-lg font-bold text-foreground mb-3">
                Vizyonumuz
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Veri analizini sadece b\u00FCy\u00FCk \u015Firketlerin de\u011Fil, her i\u00E7erik
                \u00FCreticisinin eri\u015Febildi\u011Fi bir araca d\u00F6n\u00FC\u015Ft\u00FCrmek.
                T\u00FCrkiye&apos;de sosyal medya analizinin referans noktas\u0131 olarak
                \u00FCreticilerin sadece trendleri takip etmesini de\u011Fil, trendleri
                belirlemesini sa\u011Fl\u0131yoruz. K\u0131sa video platformlar\u0131n\u0131n en g\u00FCvenilir
                veri orta\u011F\u0131 olmay\u0131 hedefliyoruz.
              </p>
            </motion.div>
          </div>

          {/* Neden Valyze */}
          <motion.div variants={item} className="mb-16">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-teal/10 border border-teal/20 text-teal text-xs px-4 py-1.5 rounded-full mb-3">
                <Sparkles className="w-3 h-3" />
                Fark\u0131m\u0131z
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Neden <span className="text-teal">Valyze</span>?
              </h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
                Bizi di\u011Fer analiz ara\u00E7lar\u0131ndan ay\u0131ran temel \u00F6zellikler.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {whyValyze.map((w, idx) => (
                <motion.div
                  key={w.title}
                  variants={item}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="group bg-card border border-border rounded-xl p-5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                >
                  <div
                    className={`w-10 h-10 rounded-lg ${w.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                  >
                    <w.icon className={`w-5 h-5 ${w.color}`} />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1.5">
                    {w.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {w.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Degerlerimiz */}
          <motion.div variants={item} className="mb-16">
            <h2 className="text-xl font-bold text-foreground text-center mb-6">
              De\u011Ferlerimiz
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((v) => (
                <motion.div
                  key={v.title}
                  variants={item}
                  className="bg-card border border-border rounded-xl p-5 hover:border-primary/20 transition-all"
                >
                  <div
                    className={`w-10 h-10 rounded-lg ${v.bg} flex items-center justify-center mb-3`}
                  >
                    <v.icon className={`w-5 h-5 ${v.color}`} />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">
                    {v.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {v.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Ne Yapiyoruz */}
          <motion.div
            variants={item}
            className="bg-card border border-border rounded-xl p-6 md:p-8 mb-16"
          >
            <h2 className="text-lg font-bold text-foreground mb-4">
              Ne Yap\u0131yoruz?
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Trend Analizi
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    Her g\u00FCn binlerce T\u00FCrkiye odakl\u0131 TikTok videosunu tarayarak
                    viral trendleri, y\u00FCkselen hashtag&apos;leri ve pop\u00FCler
                    sesleri tespit ediyoruz.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-teal/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-3.5 h-3.5 text-teal" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    AI Destekli \u0130\u00E7erik \u00D6nerileri
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    Yapay zeka modellerimiz mevcut trendleri analiz ederek size
                    \u00F6zel i\u00E7erik fikirleri, hook \u00F6nerileri ve payla\u015F\u0131m zamanlar\u0131
                    sunuyor.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-purple-400/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Users className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    Rakip ve Pazar \u0130ncelemesi
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    Rakiplerinizin hangi i\u00E7eriklerinin tuttu\u011Funu, hangi
                    formatlar\u0131n i\u015Fe yarad\u0131\u011F\u0131n\u0131 ve sekt\u00F6r\u00FCn\u00FCzdeki bo\u015Fluklar\u0131
                    g\u00F6rmenizi sa\u011Fl\u0131yoruz.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Yolculugumuz - Improved Timeline */}
          <motion.div variants={item} className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-foreground">
                Yolculu\u011Fumuz
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Bir fikirden T\u00FCrkiye&apos;nin analiz platformuna.
              </p>
            </div>
            <div className="relative max-w-2xl mx-auto">
              {/* Vertical timeline line */}
              <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-teal/30 to-border" />

              <div className="space-y-0">
                {milestones.map((m, i) => (
                  <motion.div
                    key={m.year}
                    variants={item}
                    className="relative flex items-start gap-5 group"
                  >
                    {/* Timeline dot */}
                    <div className="relative z-10 shrink-0">
                      <motion.div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                          m.active
                            ? "bg-primary/20 border-primary shadow-lg shadow-primary/20"
                            : "bg-card border-border group-hover:border-primary/30"
                        }`}
                        whileHover={{ scale: 1.1 }}
                      >
                        <div
                          className={`w-3 h-3 rounded-full transition-colors ${
                            m.active
                              ? "bg-primary"
                              : "bg-muted-foreground/30 group-hover:bg-primary/50"
                          }`}
                        />
                      </motion.div>
                      {m.active && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-primary/20"
                          animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>

                    {/* Content card */}
                    <div className={`flex-1 pb-8 ${i === milestones.length - 1 ? "pb-0" : ""}`}>
                      <div className={`bg-card border rounded-xl p-4 transition-all duration-300 ${
                        m.active
                          ? "border-primary/30 shadow-md shadow-primary/5"
                          : "border-border group-hover:border-border/80"
                      }`}>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          m.active ? "text-primary" : "text-muted-foreground"
                        }`}>
                          {m.year}
                        </span>
                        <h3 className="text-sm font-semibold text-foreground mt-1">
                          {m.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {m.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Rakamlar - Improved Stats */}
          <motion.div
            variants={item}
            className="mb-16"
          >
            <h2 className="text-xl font-bold text-foreground text-center mb-6">
              Rakamlarla Valyze
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Kategori Analizi", value: "12+", color: "text-primary", icon: BarChart2, bg: "bg-primary/5 border-primary/10" },
                { label: "T\u00FCrk\u00E7e Anahtar Kelime", value: "70+", color: "text-teal", icon: Target, bg: "bg-teal/5 border-teal/10" },
                { label: "Veri G\u00FCncelleme", value: "6 saatte bir", color: "text-purple-400", icon: Clock, bg: "bg-purple-400/5 border-purple-400/10" },
                { label: "AI Destekli Analiz", value: "Gemini & Claude", color: "text-blue-400", icon: Brain, bg: "bg-blue-400/5 border-blue-400/10" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className={`bg-card border rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 ${stat.bg}`}
                >
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center mx-auto mb-2">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <p className={`text-xl md:text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Founder Philosophy */}
          <motion.div
            variants={item}
            className="mb-16"
          >
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/[0.04] rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal/[0.04] rounded-full blur-[80px]" />

              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs px-3 py-1 rounded-full mb-4">
                  <Heart className="w-3 h-3" />
                  Felsefemiz
                </div>
                <h2 className="text-lg md:text-xl font-bold text-foreground mb-3">
                  \u00DCreticilerin Yan\u0131ndaki Teknoloji Orta\u011F\u0131
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Valyze, b\u00FCy\u00FCk b\u00FCt\u00E7elere sahip ajanslar\u0131n kulland\u0131\u011F\u0131 profesyonel veri
                  analiz ara\u00E7lar\u0131n\u0131 her \u00FCreticinin eri\u015Fimine a\u00E7mak i\u00E7in kuruldu. Veri
                  analizinin bir ayr\u0131cal\u0131k de\u011Fil, temel bir hak oldu\u011Funa inan\u0131yoruz.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Tek ki\u015Filik bir odada i\u00E7erik \u00FCreten bir \u00FCretici de, y\u00FCz ki\u015Filik bir
                  ajans da ayn\u0131 kalitede veriye ula\u015Fabilmeli. Bu e\u015Fitli\u011Fi sa\u011Flamak,
                  T\u00FCrkiye&apos;deki i\u00E7erik ekosistemini g\u00FC\u00E7lendirmek i\u00E7in her g\u00FCn
                  \u00E7al\u0131\u015F\u0131yoruz.
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA - Emotional */}
          <motion.div
            variants={item}
            className="relative rounded-2xl p-6 md:p-10 text-center overflow-hidden"
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.1] via-card to-teal/[0.1] rounded-2xl" />
            <div className="absolute inset-0 backdrop-blur-xl border border-border/50 rounded-2xl" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <div className="absolute top-0 left-1/4 w-48 h-48 bg-primary/[0.06] rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-teal/[0.06] rounded-full blur-[100px]" />

            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-xl md:text-2xl font-bold mb-3">
                  Hikayenizi Daha Geni\u015F{" "}
                  <span className="bg-gradient-to-r from-primary to-teal bg-clip-text text-transparent">
                    Kitlelere
                  </span>{" "}
                  Ula\u015Ft\u0131r\u0131n
                </h2>
              </motion.div>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                Binlerce i\u00E7erik \u00FCreticisi viral f\u0131rsatlar\u0131 ke\u015Ffetmek i\u00E7in
                Valyze kullan\u0131yor. Siz de bu toplu\u011Fa kat\u0131l\u0131n.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-white px-7 py-3 rounded-xl font-medium text-sm shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-shadow"
                  >
                    \u00DCcretsiz Ba\u015Fla <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Bize Ula\u015F\u0131n
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Gizlilik Politikas\u0131</Link>
            <Link href="/terms-of-service" className="hover:text-foreground transition-colors">Kullan\u0131m \u015Eartlar\u0131</Link>
            <Link href="/mesafeli-satis-sozlesmesi" className="hover:text-foreground transition-colors">Mesafeli Sat\u0131\u015F S\u00F6zle\u015Fmesi</Link>
            <Link href="/iptal-ve-iade" className="hover:text-foreground transition-colors">\u0130ptal ve \u0130ade</Link>
            <Link href="/cookie-policy" className="hover:text-foreground transition-colors">\u00C7erez Politikas\u0131</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">\u0130leti\u015Fim</Link>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground">&copy; 2026 Valyze TR. T\u00FCm haklar\u0131 sakl\u0131d\u0131r.</p>
            <p className="text-[10px] text-muted-foreground">destek@valyze.app</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
