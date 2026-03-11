"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FiTrendingUp,
  FiHash,
  FiArrowRight,
  FiArrowUp,
  FiPlay,
  FiBarChart2,
  FiClock,
  FiLock,
  FiTarget,
  FiZap,
  FiFileText,
  FiCalendar,
} from "react-icons/fi";

interface TrendReport {
  dateRange: { start: string; end: string };
  stats: {
    totalVideosAnalyzed: number;
    activeTrends: number;
    avgEngagement: number;
  };
  trendingFormats: { name: string; count: number; description: string }[];
  popularNiches: { name: string; count: number; growth: number }[];
  bestTimeSlots: { slot: string; label: string; engagement: number; description: string }[];
  topPostingTimes: { day: string; hour: number; engagement: number }[];
  fastestGrowingHashtags: { name: string; growth: number; category: string; totalUses: number }[];
  dailyStats: { date: string; videos: number; engagement: number }[];
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}

export default function TrendReportPage() {
  const [report, setReport] = useState<TrendReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/trend-report")
      .then((r) => r.json())
      .then((data) => setReport(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

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
          <div className="hidden md:flex items-center gap-6">
            <Link href="/viral-tiktok-videos-turkey" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Viral Videolar</Link>
            <Link href="/trending-hashtags-turkey" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Trend Hashtag&apos;ler</Link>
            <Link href="/tiktok-trend-report" className="text-sm text-neon-red font-medium">Haftalik Rapor</Link>
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
      <section className="relative pt-28 pb-12 px-6 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-neon-red/5 rounded-full blur-[120px]" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs px-4 py-1.5 rounded-full mb-4"
          >
            <FiCalendar className="w-3 h-3" />
            {report ? `${report.dateRange.start} - ${report.dateRange.end}` : "Haftalik Rapor"}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold leading-tight mb-4"
          >
            TikTok{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-neon-red">
              Haftalik Trend Raporu
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base text-text-secondary max-w-2xl mx-auto mb-6"
          >
            Turkiye&apos;deki haftalik TikTok trend analizi. Trend video formatlari, populer nisler,
            en iyi paylasim zamanlari ve en hizli buyuyen hashtag&apos;ler.
          </motion.p>

          {/* SEO cross-links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link href="/viral-tiktok-videos-turkey" className="inline-flex items-center gap-1.5 text-xs text-neon-red hover:text-neon-red/80 transition-colors">
              <FiPlay className="w-3 h-3" /> Viral Videolari Gor
            </Link>
            <span className="text-text-muted">|</span>
            <Link href="/trending-hashtags-turkey" className="inline-flex items-center gap-1.5 text-xs text-teal hover:text-teal/80 transition-colors">
              <FiHash className="w-3 h-3" /> Trend Hashtag&apos;ler
            </Link>
          </motion.div>
        </div>
      </section>

      {loading ? (
        <div className="max-w-6xl mx-auto px-6 space-y-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 shimmer rounded-xl" />
            ))}
          </div>
          <div className="h-64 shimmer rounded-xl" />
          <div className="h-64 shimmer rounded-xl" />
        </div>
      ) : report ? (
        <>
          {/* Stats Overview */}
          <section className="px-6 pb-10">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface border border-border rounded-xl p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <FiPlay className="w-4 h-4 text-neon-red" />
                  <span className="text-xs text-text-muted">Analiz Edilen Video</span>
                </div>
                <p className="text-2xl font-bold">{formatNumber(report.stats.totalVideosAnalyzed)}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-surface border border-border rounded-xl p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <FiTrendingUp className="w-4 h-4 text-teal" />
                  <span className="text-xs text-text-muted">Aktif Trend</span>
                </div>
                <p className="text-2xl font-bold">{report.stats.activeTrends}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-surface border border-border rounded-xl p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <FiBarChart2 className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-text-muted">Ort. Etkilesim</span>
                </div>
                <p className="text-2xl font-bold">%{report.stats.avgEngagement}</p>
              </motion.div>
            </div>
          </section>

          {/* Trending Formats - Free */}
          <section className="px-6 pb-10">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <FiPlay className="w-5 h-5 text-neon-red" />
                <h2 className="text-xl font-bold">Trend Video Formatlari</h2>
                <span className="text-xs bg-teal/10 text-teal px-2 py-0.5 rounded-full">Ucretsiz</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {report.trendingFormats.map((format, i) => (
                  <motion.div
                    key={format.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-surface border border-border rounded-xl p-5 hover:border-neon-red/20 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold">{format.name}</h3>
                      <span className="text-xs text-text-muted">{formatNumber(format.count)} video</span>
                    </div>
                    <p className="text-xs text-text-secondary">{format.description}</p>
                    {/* Mini bar */}
                    <div className="mt-3 h-1.5 bg-surface-light rounded-full overflow-hidden">
                      <div
                        className="h-full gradient-red rounded-full"
                        style={{ width: `${Math.min(100, (format.count / (report.trendingFormats[0]?.count || 1)) * 100)}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Popular Niches - Free */}
          <section className="px-6 pb-10">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <FiTarget className="w-5 h-5 text-teal" />
                <h2 className="text-xl font-bold">Populer Nisler</h2>
                <span className="text-xs bg-teal/10 text-teal px-2 py-0.5 rounded-full">Ucretsiz</span>
              </div>

              <div className="bg-surface border border-border rounded-xl overflow-hidden">
                {report.popularNiches.map((niche, i) => (
                  <motion.div
                    key={niche.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-4 px-5 py-3 border-b border-border/50 hover:bg-surface-light/50 transition-colors"
                  >
                    <span className="text-xs text-text-muted font-mono w-6">{i + 1}</span>
                    <span className="text-sm font-medium flex-1">{niche.name}</span>
                    <span className="text-xs text-text-secondary">{formatNumber(niche.count)} video</span>
                    <span className="flex items-center gap-0.5 text-xs font-medium text-teal">
                      <FiArrowUp className="w-3 h-3" /> {niche.growth}%
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Best Posting Times - Free */}
          <section className="px-6 pb-10">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <FiClock className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold">En Iyi Paylasim Zamanlari</h2>
                <span className="text-xs bg-teal/10 text-teal px-2 py-0.5 rounded-full">Ucretsiz</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {report.bestTimeSlots.map((slot, i) => (
                  <motion.div
                    key={slot.slot}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-surface border border-border rounded-xl p-5 hover:border-purple-500/20 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-wider text-text-muted">{slot.label}</span>
                      <span className={`text-xs font-bold ${
                        slot.engagement >= 80 ? "text-teal" : slot.engagement >= 60 ? "text-blue-400" : "text-text-secondary"
                      }`}>
                        {slot.engagement}%
                      </span>
                    </div>
                    <p className="text-lg font-bold mb-1">{slot.slot}</p>
                    <p className="text-[10px] text-text-muted">{slot.description}</p>
                    {/* Bar */}
                    <div className="mt-3 h-1.5 bg-surface-light rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${slot.engagement}%`,
                          background: slot.engagement >= 80
                            ? "linear-gradient(90deg, #00d4aa, #00b894)"
                            : slot.engagement >= 60
                            ? "linear-gradient(90deg, #6c5ce7, #a29bfe)"
                            : "linear-gradient(90deg, #636e72, #b2bec3)",
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Fastest Growing Hashtags - Free (limited) */}
          <section className="px-6 pb-10">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <FiHash className="w-5 h-5 text-neon-red" />
                <h2 className="text-xl font-bold">En Hizli Buyuyen Hashtag&apos;ler</h2>
                <span className="text-xs bg-teal/10 text-teal px-2 py-0.5 rounded-full">Ucretsiz</span>
              </div>

              <div className="bg-surface border border-border rounded-xl overflow-hidden">
                {report.fastestGrowingHashtags.slice(0, 5).map((hashtag, i) => (
                  <motion.div
                    key={hashtag.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-4 px-5 py-3 border-b border-border/50 hover:bg-surface-light/50 transition-colors"
                  >
                    <span className="text-xs text-text-muted font-mono w-6">{i + 1}</span>
                    <span className="text-sm font-medium flex-1">{hashtag.name}</span>
                    <span className="text-xs text-text-secondary bg-surface-light px-2 py-0.5 rounded">{hashtag.category}</span>
                    <span className="text-xs text-text-secondary">{formatNumber(hashtag.totalUses)} video</span>
                    <span className="flex items-center gap-0.5 text-xs font-bold text-teal">
                      <FiArrowUp className="w-3 h-3" /> {hashtag.growth.toFixed(1)}%
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Premium Section */}
          <section className="px-6 pb-16">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <FiLock className="w-5 h-5 text-neon-red" />
                <h2 className="text-xl font-bold">Gelismis Analizler</h2>
                <span className="text-xs bg-neon-red/10 text-neon-red px-2 py-0.5 rounded-full">Premium</span>
              </div>

              <div className="relative">
                {/* Blurred premium content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 blur-sm opacity-50 pointer-events-none select-none">
                  <div className="bg-surface border border-border rounded-xl p-5 col-span-2 h-48" />
                  <div className="bg-surface border border-border rounded-xl p-5 h-48" />
                  <div className="bg-surface border border-border rounded-xl p-5 h-32" />
                  <div className="bg-surface border border-border rounded-xl p-5 h-32 col-span-2" />
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-surface/95 backdrop-blur-sm border border-neon-red/30 rounded-2xl p-8 text-center max-w-md">
                    <div className="w-14 h-14 rounded-xl bg-neon-red/10 border border-neon-red/20 flex items-center justify-center mx-auto mb-4">
                      <FiLock className="w-6 h-6 text-neon-red" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Detayli Analizlerin Kilidi Acin</h3>
                    <p className="text-sm text-text-secondary mb-4">
                      Trend tahmini, detayli video analizi, rakip karsilastirma ve daha fazlasi.
                    </p>
                    <ul className="text-left space-y-2 mb-6">
                      <li className="flex items-center gap-2 text-xs text-text-secondary">
                        <FiZap className="w-3 h-3 text-teal shrink-0" /> Trend tahmini & erken uyari
                      </li>
                      <li className="flex items-center gap-2 text-xs text-text-secondary">
                        <FiBarChart2 className="w-3 h-3 text-teal shrink-0" /> Detayli video analizi
                      </li>
                      <li className="flex items-center gap-2 text-xs text-text-secondary">
                        <FiTarget className="w-3 h-3 text-teal shrink-0" /> Rakip analizi
                      </li>
                      <li className="flex items-center gap-2 text-xs text-text-secondary">
                        <FiFileText className="w-3 h-3 text-teal shrink-0" /> Gunluk detayli raporlar
                      </li>
                    </ul>
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-2 bg-neon-red text-white px-6 py-2.5 rounded-xl hover:bg-neon-red-light transition-all text-sm font-medium"
                    >
                      Ucretsiz Basla <FiArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <p className="text-text-secondary">Rapor yuklenemedi. Lutfen daha sonra tekrar deneyin.</p>
        </div>
      )}

      {/* SEO Content */}
      <section className="px-6 py-16 bg-surface/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">TikTok Haftalik Trend Raporu Hakkinda</h2>
          <div className="prose prose-invert prose-sm max-w-none space-y-4 text-text-secondary">
            <p>
              TikTrendTR haftalik trend raporu, Turkiye&apos;deki TikTok ekosisteminin kapsamli
              bir analizini sunar. Trend video formatlari, yukselen nisler, en iyi paylasim
              zamanlari ve en hizli buyuyen hashtag&apos;ler gibi onemli verileri iceren bu rapor,
              icerik ureticilerinin stratejilerini optimize etmelerine yardimci olur.
            </p>
            <h3 className="text-lg font-semibold text-text-primary">Raporda Neler Var?</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Trend video formatlari ve performanslari</li>
              <li>Populer nisler ve buyume oranlari</li>
              <li>En iyi paylasim zamanlari ve gunleri</li>
              <li>En hizli buyuyen hashtag&apos;ler</li>
            </ul>
            <p>
              Haftalik rapor her hafta otomatik olarak guncellenir ve en guncel trend verilerini sunar.
              Pro aboneler detayli analizlere, trend tahminlerine ve rakip karsilastirmaya erisebilir.
            </p>
          </div>

          {/* Cross-links */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/viral-tiktok-videos-turkey" className="bg-surface border border-border rounded-xl p-5 hover:border-neon-red/30 transition-all group">
              <div className="flex items-center gap-3 mb-2">
                <FiPlay className="w-5 h-5 text-neon-red" />
                <h3 className="font-semibold text-sm">Viral Videolar</h3>
                <FiArrowRight className="w-4 h-4 text-text-muted ml-auto group-hover:text-neon-red transition-colors" />
              </div>
              <p className="text-xs text-text-secondary">Turkiye&apos;de bugun en cok izlenen viral TikTok videolari.</p>
            </Link>
            <Link href="/trending-hashtags-turkey" className="bg-surface border border-border rounded-xl p-5 hover:border-teal/30 transition-all group">
              <div className="flex items-center gap-3 mb-2">
                <FiHash className="w-5 h-5 text-teal" />
                <h3 className="font-semibold text-sm">Trend Hashtag&apos;ler</h3>
                <FiArrowRight className="w-4 h-4 text-text-muted ml-auto group-hover:text-teal transition-colors" />
              </div>
              <p className="text-xs text-text-secondary">Turkiye&apos;de en hizli buyuyen TikTok hashtag&apos;lerini kesfedin.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-purple-500/10 via-surface to-neon-red/10 border border-border rounded-2xl p-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Trendleri{" "}
              <span className="text-purple-400">Herkesten Once</span>{" "}
              Yakamayin
            </h2>
            <p className="text-sm text-text-secondary mb-6">
              Pro plana yukselerek detayli trend raporlarina, tahminlere ve rakip analizine erisin.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-neon-red text-white px-8 py-3 rounded-xl hover:bg-neon-red-light transition-all font-medium text-sm"
            >
              Ucretsiz Hesap Olustur <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg gradient-red flex items-center justify-center">
                <FiTrendingUp className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-bold">TikTrend<span className="text-neon-red">TR</span></span>
            </div>
            <div className="flex items-center gap-6 text-xs text-text-secondary">
              <Link href="/viral-tiktok-videos-turkey" className="hover:text-text-primary transition-colors">Viral Videolar</Link>
              <Link href="/trending-hashtags-turkey" className="hover:text-text-primary transition-colors">Trend Hashtag&apos;ler</Link>
              <Link href="/tiktok-trend-report" className="hover:text-text-primary transition-colors">Haftalik Rapor</Link>
              <Link href="/pricing" className="hover:text-text-primary transition-colors">Fiyatlandirma</Link>
            </div>
            <p className="text-[10px] text-text-muted">&copy; 2026 TikTrendTR. Tum haklari saklidir.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
