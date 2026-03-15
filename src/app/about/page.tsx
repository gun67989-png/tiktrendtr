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
    title: "Güvenilirlik",
    desc: "Gerçek veriye dayalı analizler sunuyoruz. Tahmin değil, ölçüm yapıyoruz. Her veri noktası doğrulanmış kaynaklardan geliyor.",
    color: "text-teal",
    bg: "bg-teal/10",
  },
  {
    icon: Zap,
    title: "Hız",
    desc: "Trendler hızla değişir. Platformumuz verileri sürekli güncelleyerek fırsatları kaçırmanızı önler.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: Users,
    title: "Topluluk Odaklılık",
    desc: "Türkiye'deki içerik üreticilerinin ihtiyaçlarına odaklanıyoruz. Her özellik gerçek kullanıcı geri bildirimlerine dayanır.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: Globe,
    title: "Erişebilirlik",
    desc: "Profesyonel analiz araçlarını herkes için erişilebilir kılıyoruz. Ücretsiz plan ile herkes trendleri takip edebilir.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
];

const milestones = [
  {
    year: "2025 Q3",
    title: "Fikir Aşaması",
    desc: "Türkiye'deki içerik üreticilerinin trend takibinde yaşadığı zorluklar fark edildi.",
  },
  {
    year: "2025 Q4",
    title: "Geliştirme Başladı",
    desc: "Veri toplama altyapısı ve AI tabanlı analiz motoru geliştirilmeye başlandı.",
  },
  {
    year: "2026 Q1",
    title: "Beta Lansman",
    desc: "İlk kullanıcılar platforma davet edildi. Geri bildirimlerle hızla iyileştirildi.",
  },
  {
    year: "2026 Q2",
    title: "Halka Açık Lansman",
    desc: "Pro plan, rakip analizi ve AI içerik önerileri ile tam sürüm yayınlandı.",
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
              Giriş Yap
            </Link>
            <Link
              href="/register"
              className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors font-medium"
            >
              Ücretsiz Başla
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
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs px-4 py-1.5 rounded-full mb-4">
              <Heart className="w-3 h-3" />
              Hakkımızda
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Turkiye&apos;nin TikTok{" "}
              <span className="text-primary">
                Trend Analiz
              </span>{" "}
              Platformu
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Valyze, Türkiye&apos;deki içerik üreticilerine, markalara ve
              dijital pazarlamacılara veri odaklı TikTok analizi sunan bağımsız
              bir teknoloji platformudur.
            </p>
          </motion.div>

          {/* Misyon */}
          <motion.div
            variants={item}
            className="bg-card border border-border rounded-xl p-6 md:p-8 mb-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground mb-2">
                  Misyonumuz
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Türkiye&apos;deki dijital içerik üreticilerinin doğru zamanda
                  doğru trende yönelmesini sağlayarak büyümelerini
                  hızlandırmak. Binlerce videoyu analiz ederek neyin viral
                  olduğunu, neden viral olduğunu ve bir sonraki trendin ne
                  olacağını anlaşılır şekilde sunuyoruz. Amacımız, büyük
                  ajansların sahip olduğu veri avantajını bireysel üreticilere
                  de ulaştırmak.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Vizyon */}
          <motion.div
            variants={item}
            className="bg-card border border-border rounded-xl p-6 md:p-8 mb-12"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center shrink-0">
                <Eye className="w-6 h-6 text-teal" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground mb-2">
                  Vizyonumuz
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Türkiye&apos;de sosyal medya analizinin referans noktası
                  olmak. Sadece TikTok değil, tüm kısa video platformlarında
                  içerik üreticilerinin en güvenilir veri ortağı haline
                  gelmek istiyoruz. Yapay zeka destekli analizlerimizi
                  sürekli geliştirerek üreticilerin sadece trendleri takip
                  etmesini değil, trendleri belirlemesini sağlıyoruz.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Degerlerimiz */}
          <motion.div variants={item} className="mb-12">
            <h2 className="text-xl font-bold text-foreground text-center mb-6">
              Değerlerimiz
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
            className="bg-card border border-border rounded-xl p-6 md:p-8 mb-12"
          >
            <h2 className="text-lg font-bold text-foreground mb-4">
              Ne Yapıyoruz?
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
                    Her gün binlerce Türkiye odaklı TikTok videosunu tarayarak
                    viral trendleri, yükselen hashtag&apos;leri ve popüler
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
                    AI Destekli İçerik Önerileri
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    Yapay zeka modellerimiz mevcut trendleri analiz ederek size
                    özel içerik fikirleri, hook önerileri ve paylaşım zamanları
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
                    Rakip ve Pazar İncelemesi
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                    Rakiplerinizin hangi içeriklerinin tuttuğunu, hangi
                    formatların işe yaradığını ve sektörünüzdeki boşlukları
                    görmenizi sağlıyoruz.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Yol Haritasi */}
          <motion.div variants={item} className="mb-12">
            <h2 className="text-xl font-bold text-foreground text-center mb-6">
              Yolculuğumuz
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
                    <div className="w-9 h-9 rounded-full bg-card border-2 border-border flex items-center justify-center shrink-0 z-10 relative">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          i === milestones.length - 1
                            ? "bg-primary"
                            : "bg-text-muted"
                        }`}
                      />
                    </div>
                    <div className="flex-1 bg-card border border-border rounded-xl p-4 hover:border-border/80 transition-all">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                        {m.year}
                      </span>
                      <h3 className="text-sm font-semibold text-foreground mt-1">
                        {m.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
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
              { label: "Kategori Analizi", value: "12+", color: "text-primary" },
              { label: "Türkçe Anahtar Kelime", value: "70+", color: "text-teal" },
              { label: "Veri Güncelleme", value: "6 saatte bir", color: "text-purple-400" },
              { label: "AI Destekli Analiz", value: "Gemini & Claude", color: "text-blue-400" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-card border border-border rounded-xl p-4 text-center"
              >
                <p className={`text-xl md:text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            variants={item}
            className="bg-card border border-border rounded-xl p-6 md:p-8 text-center"
          >
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              Siz de Katılmak İster Misiniz?
            </h2>
            <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
              İçerik üreticileri viral fırsatları keşfetmek için
              Valyze kullanıyor. Ücretsiz hesabınızı hemen oluşturun.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/80 transition-all font-medium text-sm"
              >
                Ücretsiz Başla <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-card border border-border text-foreground px-6 py-3 rounded-md hover:border-primary/30 transition-all font-medium text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Bize Ulaşın
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Gizlilik Politikası</Link>
            <Link href="/terms-of-service" className="hover:text-foreground transition-colors">Kullanım Şartları</Link>
            <Link href="/mesafeli-satis-sozlesmesi" className="hover:text-foreground transition-colors">Mesafeli Satış Sözleşmesi</Link>
            <Link href="/iptal-ve-iade" className="hover:text-foreground transition-colors">İptal ve İade</Link>
            <Link href="/cookie-policy" className="hover:text-foreground transition-colors">Çerez Politikası</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">İletişim</Link>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground">&copy; 2026 Valyze TR. Tüm hakları saklıdır.</p>
            <p className="text-[10px] text-muted-foreground">destek@valyze.app</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
