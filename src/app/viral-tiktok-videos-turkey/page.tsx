"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp,
  Play,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Hash,
  ArrowRight,
  Lock,
  ExternalLink,
  BarChart2,
  FileText,
} from "lucide-react";
import LogoLink from "@/components/LogoLink";

type ViralTier = "mega_viral" | "viral" | "trend" | "rising" | null;

interface Video {
  id: string;
  creator: string;
  description: string;
  thumbnailUrl: string;
  tiktokUrl: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  followerCount?: number;
  engagementRate: number;
  viralScore?: number;
  surpriseFactor?: number;
  engagementVelocity?: number;
  discoveryScore?: number;
  tier?: ViralTier;
  format: string;
  category: string;
  hashtags: string[];
  publishedAt: string;
}

const TIER_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  mega_viral: { label: "Mega Viral", color: "text-white", bg: "bg-primary" },
  viral: { label: "Viral", color: "text-white", bg: "bg-orange-500" },
  trend: { label: "Trend", color: "text-white", bg: "bg-teal" },
  rising: { label: "Yükselen", color: "text-white", bg: "bg-purple-500" },
};

function getThumbnailUrl(url: string): string {
  if (!url) return "/images/placeholder-video.jpg";
  if (url.includes("tiktokcdn") || url.includes("tikwm") || url.includes("muscdn")) {
    return `/api/thumbnail?url=${encodeURIComponent(url)}`;
  }
  return url;
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}

export default function ViralVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/viral-videos")
      .then((r) => r.json())
      .then((data) => setVideos(data.videos || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const freeVideos = videos.slice(0, 10);
  const premiumVideos = videos.slice(10);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <LogoLink />
          <div className="hidden md:flex items-center gap-6">
            <Link href="/viral-tiktok-videos-turkey" className="text-sm text-primary font-medium">Viral Videolar</Link>
            <Link href="/trending-hashtags-turkey" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Trend Hashtag&apos;ler</Link>
            <Link href="/tiktok-trend-report" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Haftalik Rapor</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
              Giris Yap
            </Link>
            <Link href="/register" className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors font-medium">
              Ucretsiz Basla
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-28 pb-12 px-6 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-teal/5 rounded-full blur-[120px]" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs px-4 py-1.5 rounded-full mb-4"
          >
            <Play className="w-3 h-3" />
            Gunluk Guncelleniyor
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold leading-tight mb-4"
          >
            Turkiye&apos;de Bugun{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal">
              En Viral TikTok Videolari
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base text-muted-foreground max-w-2xl mx-auto mb-6"
          >
            Turkiye&apos;deki en cok izlenen, en cok begeni alan ve en hizli yayilan TikTok videolarini kesfedin.
            Her gun guncellenen viral video veritabanimizla trendleri yakin takip edin.
          </motion.p>

          {/* SEO cross-links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link href="/trending-hashtags-turkey" className="inline-flex items-center gap-1.5 text-xs text-teal hover:text-teal/80 transition-colors">
              <Hash className="w-3 h-3" /> Trend Hashtag&apos;leri Gor
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link href="/tiktok-trend-report" className="inline-flex items-center gap-1.5 text-xs text-teal hover:text-teal/80 transition-colors">
              <BarChart2 className="w-3 h-3" /> Haftalik Trend Raporu
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Free Videos Section */}
      <section className="px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Play className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">En Viral 10 Video</h2>
            <span className="text-xs bg-teal/10 text-teal px-2 py-0.5 rounded-full">Ucretsiz</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="aspect-[9/16] shimmer" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 shimmer rounded w-3/4" />
                    <div className="h-3 shimmer rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {freeVideos.map((video, i) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all group"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[9/16] bg-muted overflow-hidden">
                    <img
                      src={getThumbnailUrl(video.thumbnailUrl)}
                      alt={`${video.creator} viral TikTok video`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Eye className="w-2.5 h-2.5" />
                      {formatNumber(video.views)}
                    </div>
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      {video.tier && TIER_CONFIG[video.tier] && (
                        <span className={`${TIER_CONFIG[video.tier].bg} ${TIER_CONFIG[video.tier].color} text-[9px] font-semibold px-1.5 py-0.5 rounded-full`}>
                          {TIER_CONFIG[video.tier].label}
                        </span>
                      )}
                      <span className="bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-full">
                        #{i + 1}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="bg-black/70 text-[10px] text-white px-2 py-1 rounded-lg truncate">
                        {video.format}
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                        {video.creator.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-xs font-medium text-foreground truncate">@{video.creator}</span>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-0.5"><Heart className="w-2.5 h-2.5" /> {formatNumber(video.likes)}</span>
                      <span className="flex items-center gap-0.5"><MessageCircle className="w-2.5 h-2.5" /> {formatNumber(video.comments)}</span>
                      <span className="flex items-center gap-0.5"><Share2 className="w-2.5 h-2.5" /> {formatNumber(video.shares)}</span>
                    </div>

                    {/* Hashtags */}
                    <div className="flex flex-wrap gap-1">
                      {video.hashtags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[9px] text-teal bg-teal/10 px-1.5 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* TikTok link */}
                    <a
                      href={video.tiktokUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80 transition-colors"
                    >
                      <ExternalLink className="w-2.5 h-2.5" /> TikTok&apos;ta Izle
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Premium Section - Blurred */}
      {premiumVideos.length > 0 && (
        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Tam Video Veritabani</h2>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Premium</span>
            </div>

            <div className="relative">
              {/* Blurred preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 blur-sm opacity-50 pointer-events-none select-none">
                {premiumVideos.slice(0, 10).map((video) => (
                  <div key={video.id} className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="aspect-[9/16] bg-muted">
                      <img
                        src={getThumbnailUrl(video.thumbnailUrl)}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Overlay CTA */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-card/95 backdrop-blur-sm border border-primary/30 rounded-2xl p-8 text-center max-w-md">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">+{premiumVideos.length} Video Daha</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tam viral video veritabanina, gelismis analizlere ve trend tahminlerine eris.
                  </p>
                  <ul className="text-left space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Play className="w-3 h-3 text-teal shrink-0" /> Tam video veritabani
                    </li>
                    <li className="flex items-center gap-2 text-xs text-muted-foreground">
                      <BarChart2 className="w-3 h-3 text-teal shrink-0" /> Gelismis analizler
                    </li>
                    <li className="flex items-center gap-2 text-xs text-muted-foreground">
                      <TrendingUp className="w-3 h-3 text-teal shrink-0" /> Trend tahmini
                    </li>
                    <li className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FileText className="w-3 h-3 text-teal shrink-0" /> Rakip analizi
                    </li>
                  </ul>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl hover:bg-primary/80 transition-all text-sm font-medium"
                  >
                    Ucretsiz Basla <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SEO Content Section */}
      <section className="px-6 py-16 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Turkiye&apos;de Viral TikTok Videolari Hakkinda</h2>
          <div className="prose prose-invert prose-sm max-w-none space-y-4 text-muted-foreground">
            <p>
              Valyze, Turkiye&apos;deki en viral TikTok videolarini analiz ederek icerik ureticilerinin
              trendleri yakin takip etmesini saglar. Platformumuz her gun binlerce videoyu tarayarak
              en cok izlenen, en cok paylasilan ve en hizli buyuyen icerikleri tespit eder.
            </p>
            <p>
              Viral video veritabanimiz, video thumbnailleri, ureticilerin kullanici adlari, izlenme sayilari,
              kullanilan hashtag&apos;ler ve TikTok videolarina dogrudan baglanti gibi detayli bilgiler sunar.
              Bu veriler, kendi icerik stratejinizi olustururken ilham kaynagi olarak kullanilabilir.
            </p>
            <h3 className="text-lg font-semibold text-foreground">Neden Viral Videolari Takip Etmelisiniz?</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Hangi tur iceriklerin viral oldugunu gorun</li>
              <li>Basarili formatlari ve trendleri tespit edin</li>
              <li>Rakiplerinizin stratejilerini analiz edin</li>
              <li>Kendi icerikleriniz icin ilham alin</li>
            </ul>
          </div>

          {/* Cross-links */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/trending-hashtags-turkey" className="bg-card border border-border rounded-xl p-5 hover:border-teal/30 transition-all group">
              <div className="flex items-center gap-3 mb-2">
                <Hash className="w-5 h-5 text-teal" />
                <h3 className="font-semibold text-sm">Trend Hashtag&apos;ler</h3>
                <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-teal transition-colors" />
              </div>
              <p className="text-xs text-muted-foreground">Turkiye&apos;de en hizli buyuyen TikTok hashtag&apos;lerini kesfedin.</p>
            </Link>
            <Link href="/tiktok-trend-report" className="bg-card border border-border rounded-xl p-5 hover:border-teal/30 transition-all group">
              <div className="flex items-center gap-3 mb-2">
                <BarChart2 className="w-5 h-5 text-teal" />
                <h3 className="font-semibold text-sm">Haftalik Trend Raporu</h3>
                <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-teal transition-colors" />
              </div>
              <p className="text-xs text-muted-foreground">Haftalik trend analizi, populer nisler ve en iyi paylasim zamanlari.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary/10 via-card to-teal/10 border border-border rounded-2xl p-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Viral Firsatlari{" "}
              <span className="text-primary">Kacirmayin</span>
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Pro plana yukselerek tam video veritabanina, gelismis analizlere ve trend tahminlerine erisin.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary/80 transition-all font-medium text-sm"
            >
              Ucretsiz Hesap Olustur <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <LogoLink size="sm" />
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <Link href="/viral-tiktok-videos-turkey" className="hover:text-foreground transition-colors">Viral Videolar</Link>
              <Link href="/trending-hashtags-turkey" className="hover:text-foreground transition-colors">Trend Hashtag&apos;ler</Link>
              <Link href="/tiktok-trend-report" className="hover:text-foreground transition-colors">Haftalik Rapor</Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">Fiyatlandirma</Link>
            </div>
            <p className="text-[10px] text-muted-foreground">&copy; 2026 Valyze. Tum haklari saklidir.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
