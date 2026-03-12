"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FiTrendingUp,
  FiHash,
  FiArrowRight,
  FiArrowUp,
  FiArrowDown,
  FiLock,
  FiPlay,
  FiBarChart2,
  FiSearch,
  FiEye,
  FiFileText,
} from "react-icons/fi";
import LogoLink from "@/components/LogoLink";

interface HashtagData {
  id: string;
  name: string;
  totalUses: number;
  weeklyGrowth: number;
  category: string;
  viralScore: number;
  isEmerging: boolean;
  avgViews: number;
  trend: number[];
}

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}

export default function TrendingHashtagsPage() {
  const [hashtags, setHashtags] = useState<HashtagData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tumu");

  useEffect(() => {
    fetch("/api/public/trending-hashtags")
      .then((r) => r.json())
      .then((data) => setHashtags(data.hashtags || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(hashtags.map((h) => h.category)));
    return ["Tumu", ...cats.sort()];
  }, [hashtags]);

  const filtered = useMemo(() => {
    let result = hashtags;
    if (search) {
      result = result.filter((h) => h.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (categoryFilter !== "Tumu") {
      result = result.filter((h) => h.category === categoryFilter);
    }
    return result;
  }, [hashtags, search, categoryFilter]);

  const freeHashtags = filtered.slice(0, 15);
  const premiumHashtags = filtered.slice(15);

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <LogoLink />
          <div className="hidden md:flex items-center gap-6">
            <Link href="/viral-tiktok-videos-turkey" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Viral Videolar</Link>
            <Link href="/trending-hashtags-turkey" className="text-sm text-neon-red font-medium">Trend Hashtag&apos;ler</Link>
            <Link href="/tiktok-trend-report" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Haftalik Rapor</Link>
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
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-teal/5 rounded-full blur-[120px]" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-neon-red/5 rounded-full blur-[120px]" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-teal/10 border border-teal/20 text-teal text-xs px-4 py-1.5 rounded-full mb-4"
          >
            <FiHash className="w-3 h-3" />
            Canli Guncelleniyor
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold leading-tight mb-4"
          >
            Turkiye&apos;de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal to-neon-red">
              Trend TikTok Hashtag&apos;leri
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base text-text-secondary max-w-2xl mx-auto mb-6"
          >
            En populer ve en hizli buyuyen TikTok hashtag&apos;lerini kesfedin. Video sayilari,
            ortalama izlenmeler ve buyume oranlariyla detayli hashtag istatistikleri.
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
            <Link href="/tiktok-trend-report" className="inline-flex items-center gap-1.5 text-xs text-neon-red hover:text-neon-red/80 transition-colors">
              <FiBarChart2 className="w-3 h-3" /> Haftalik Trend Raporu
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 pb-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 max-w-md w-full">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Hashtag ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-teal/50"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.slice(0, 8).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                  categoryFilter === cat
                    ? "bg-teal/10 border-teal/30 text-teal"
                    : "bg-surface border-border text-text-secondary hover:border-teal/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Free Hashtags Table */}
      <section className="px-6 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <FiHash className="w-5 h-5 text-teal" />
            <h2 className="text-xl font-bold">Trend Hashtag&apos;ler</h2>
            <span className="text-xs bg-teal/10 text-teal px-2 py-0.5 rounded-full">Ucretsiz</span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-16 shimmer rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-xl overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-border text-[10px] text-text-muted uppercase tracking-wider">
                <div className="col-span-1">#</div>
                <div className="col-span-3">Hashtag</div>
                <div className="col-span-2">Kategori</div>
                <div className="col-span-2 text-right">Video Sayisi</div>
                <div className="col-span-2 text-right">Ort. Izlenme</div>
                <div className="col-span-2 text-right">Buyume</div>
              </div>

              {/* Rows */}
              {freeHashtags.map((hashtag, i) => (
                <motion.div
                  key={hashtag.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-border/50 hover:bg-surface-light/50 transition-colors items-center"
                >
                  <div className="col-span-1 text-xs text-text-muted font-mono">{i + 1}</div>
                  <div className="col-span-3 flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary">{hashtag.name}</span>
                    {hashtag.isEmerging && (
                      <span className="text-[9px] bg-neon-red/10 text-neon-red px-1.5 py-0.5 rounded">Yukselen</span>
                    )}
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs text-text-secondary bg-surface-light px-2 py-0.5 rounded">{hashtag.category}</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-xs text-text-primary font-medium flex items-center justify-end gap-1">
                      <FiEye className="w-3 h-3 text-text-muted" />
                      {formatNumber(hashtag.totalUses)}
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-xs text-text-primary">{formatNumber(hashtag.avgViews)}</span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className={`text-xs font-medium flex items-center justify-end gap-0.5 ${
                      hashtag.weeklyGrowth > 0 ? "text-teal" : "text-neon-red"
                    }`}>
                      {hashtag.weeklyGrowth > 0 ? <FiArrowUp className="w-3 h-3" /> : <FiArrowDown className="w-3 h-3" />}
                      {Math.abs(hashtag.weeklyGrowth).toFixed(1)}%
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Premium Section */}
      {premiumHashtags.length > 0 && (
        <section className="px-6 pb-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <FiLock className="w-5 h-5 text-neon-red" />
              <h2 className="text-xl font-bold">Gelismis Hashtag Analizleri</h2>
              <span className="text-xs bg-neon-red/10 text-neon-red px-2 py-0.5 rounded-full">Premium</span>
            </div>

            <div className="relative">
              <div className="bg-surface border border-border rounded-xl overflow-hidden blur-sm opacity-50 pointer-events-none select-none">
                {premiumHashtags.slice(0, 8).map((hashtag, i) => (
                  <div key={hashtag.id} className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-border/50 items-center">
                    <div className="col-span-1 text-xs text-text-muted">{i + 16}</div>
                    <div className="col-span-3 text-sm text-text-primary">{hashtag.name}</div>
                    <div className="col-span-2 text-xs text-text-secondary">{hashtag.category}</div>
                    <div className="col-span-2 text-right text-xs">{formatNumber(hashtag.totalUses)}</div>
                    <div className="col-span-2 text-right text-xs">{formatNumber(hashtag.avgViews)}</div>
                    <div className="col-span-2 text-right text-xs">{hashtag.weeklyGrowth.toFixed(1)}%</div>
                  </div>
                ))}
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-surface/95 backdrop-blur-sm border border-neon-red/30 rounded-2xl p-8 text-center max-w-md">
                  <div className="w-14 h-14 rounded-xl bg-neon-red/10 border border-neon-red/20 flex items-center justify-center mx-auto mb-4">
                    <FiLock className="w-6 h-6 text-neon-red" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">+{premiumHashtags.length} Hashtag Daha</h3>
                  <p className="text-sm text-text-secondary mb-4">
                    Tam hashtag veritabanina, detayli trend grafikleri ve buyume tahminlerine erisin.
                  </p>
                  <ul className="text-left space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-xs text-text-secondary">
                      <FiHash className="w-3 h-3 text-teal shrink-0" /> Tam hashtag veritabani
                    </li>
                    <li className="flex items-center gap-2 text-xs text-text-secondary">
                      <FiBarChart2 className="w-3 h-3 text-teal shrink-0" /> Detayli trend grafikleri
                    </li>
                    <li className="flex items-center gap-2 text-xs text-text-secondary">
                      <FiTrendingUp className="w-3 h-3 text-teal shrink-0" /> Buyume tahmini
                    </li>
                    <li className="flex items-center gap-2 text-xs text-text-secondary">
                      <FiFileText className="w-3 h-3 text-teal shrink-0" /> Rekabet analizi
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
      )}

      {/* SEO Content */}
      <section className="px-6 py-16 bg-surface/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">TikTok Hashtag Trendleri Hakkinda</h2>
          <div className="prose prose-invert prose-sm max-w-none space-y-4 text-text-secondary">
            <p>
              TikTok hashtag&apos;leri, iceriklerin kesfedilmesinde kritik bir rol oynar. Dogru hashtag&apos;leri
              kullanmak, videolarinizin daha genis bir kitleye ulasmasini saglar. TikTrendTR, Turkiye&apos;deki
              en trend hashtag&apos;leri analiz ederek size en guncel verileri sunar.
            </p>
            <p>
              Her hashtag icin video sayisi, ortalama izlenme ve haftalik buyume orani gibi detayli
              istatistikler sunuyoruz. Bu veriler, icerik stratejinizi olusturmaniza ve dogru
              hashtag&apos;leri secmenize yardimci olur.
            </p>
            <h3 className="text-lg font-semibold text-text-primary">Dogru Hashtag Nasil Secilir?</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Icerik nisinize uygun hashtag&apos;ler secin</li>
              <li>Populer ve niche hashtag&apos;lerin karisimini kullanin</li>
              <li>Haftalik buyume orani yuksek hashtag&apos;leri tercih edin</li>
              <li>Yukselen (emerging) hashtag&apos;leri erkenden yakamayin</li>
            </ul>
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
            <Link href="/tiktok-trend-report" className="bg-surface border border-border rounded-xl p-5 hover:border-neon-red/30 transition-all group">
              <div className="flex items-center gap-3 mb-2">
                <FiBarChart2 className="w-5 h-5 text-neon-red" />
                <h3 className="font-semibold text-sm">Haftalik Trend Raporu</h3>
                <FiArrowRight className="w-4 h-4 text-text-muted ml-auto group-hover:text-neon-red transition-colors" />
              </div>
              <p className="text-xs text-text-secondary">Haftalik trend analizi, populer nisler ve en iyi paylasim zamanlari.</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-teal/10 via-surface to-neon-red/10 border border-border rounded-2xl p-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Hashtag Stratejinizi{" "}
              <span className="text-teal">Gelistirin</span>
            </h2>
            <p className="text-sm text-text-secondary mb-6">
              Pro plana yukselerek detayli hashtag analizlerine, trend tahminlerine ve rekabet analizine erisin.
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
            <LogoLink size="sm" />
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
