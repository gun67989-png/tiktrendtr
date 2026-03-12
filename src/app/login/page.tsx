"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiUser,
  FiArrowLeft,
  FiTrendingUp,
  FiHash,
  FiMusic,
  FiZap,
  FiBarChart2,
  FiTarget,
} from "react-icons/fi";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import LogoLink from "@/components/LogoLink";
import OAuthButtons from "@/components/OAuthButtons";

const OAUTH_ERRORS: Record<string, string> = {
  oauth_failed: "Sosyal giriş başarısız oldu. Lütfen tekrar deneyin.",
  oauth_denied: "Giriş izni reddedildi.",
  oauth_no_email:
    "E-posta adresi alınamadı. Lütfen farklı bir yöntem deneyin.",
  oauth_start_failed: "Sosyal giriş başlatılamadı.",
  oauth_invalid_state: "Güvenlik doğrulaması başarısız. Lütfen tekrar deneyin.",
  oauth_missing_params: "Eksik parametreler. Lütfen tekrar deneyin.",
  account_disabled: "Bu hesap devre dışı bırakılmış.",
};

const features = [
  {
    icon: FiTrendingUp,
    title: "Trend Analizi",
    desc: "Türkiye'deki güncel TikTok trendlerini takip edin",
  },
  {
    icon: FiHash,
    title: "Hashtag Keşfi",
    desc: "En popüler hashtag'leri ve büyüme oranlarını görün",
  },
  {
    icon: FiMusic,
    title: "Ses Trendleri",
    desc: "Viral olan sesleri ve kullanım istatistiklerini inceleyin",
  },
  {
    icon: FiZap,
    title: "İçerik Fikirleri",
    desc: "AI destekli içerik önerileriyle öne çıkın",
  },
  {
    icon: FiBarChart2,
    title: "Günlük Raporlar",
    desc: "Detaylı analizlerle stratejinizi şekillendirin",
  },
  {
    icon: FiTarget,
    title: "Rakip Analizi",
    desc: "Rakiplerinizin stratejilerini analiz edin",
  },
];

const floatingStats = [
  { label: "Aktif Trend", value: "2.4K+", color: "text-neon-red" },
  { label: "Hashtag", value: "15K+", color: "text-teal" },
  { label: "Günlük Analiz", value: "500+", color: "text-amber-400" },
];

function LoginContent() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const oauthError = searchParams.get("error");
    if (oauthError && OAUTH_ERRORS[oauthError]) {
      setError(OAUTH_ERRORS[oauthError]);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Giriş başarısız");
      }
    } catch {
      setError("Bağlantı hatası");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* ─────────── SOL PANEL — Marka & Özellikler (sadece desktop) ─────────── */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] relative flex-col justify-between p-10 xl:p-16 overflow-hidden">
        {/* Arka plan efektleri */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-neon-red/15 rounded-full blur-[150px] animate-pulse" />
          <div
            className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal/10 rounded-full blur-[120px] animate-pulse"
            style={{ animationDelay: "3s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/8 rounded-full blur-[100px] animate-pulse"
            style={{ animationDelay: "6s" }}
          />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Köşe dekorasyon */}
        <div className="absolute top-0 right-0 w-px h-40 bg-gradient-to-b from-neon-red/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-40 h-px bg-gradient-to-r from-teal/30 to-transparent" />

        {/* Üst — Logo & Navigasyon */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm mb-8">
            <FiArrowLeft className="w-4 h-4" />
            Ana Sayfa
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <Image
              src="/logo.png"
              alt="Valyze TR"
              width={48}
              height={48}
              className="rounded-2xl shadow-lg shadow-neon-red/20"
              unoptimized
            />
            <div>
              <h1 className="text-3xl xl:text-4xl font-bold text-text-primary">
                Valyze <span className="text-neon-red">TR</span>
              </h1>
              <p className="text-text-muted text-sm tracking-wide">
                TikTok Trend Analiz Platformu
              </p>
            </div>
          </div>
        </motion.div>

        {/* Orta — Özellikler Grid */}
        <div className="relative z-10 flex-1 flex items-center">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-xl xl:text-2xl font-semibold text-text-primary mb-2"
            >
              Trendleri Yakala, Öne Çık
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-text-secondary text-sm mb-8 max-w-md"
            >
              Türkiye&apos;nin en kapsamlı TikTok analiz aracıyla içeriklerinizi
              bir üst seviyeye taşıyın.
            </motion.p>

            <div className="grid grid-cols-2 gap-3 max-w-lg">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.08, duration: 0.4 }}
                    className="group flex items-start gap-3 p-3 rounded-xl bg-surface/40 border border-border/50 hover:border-neon-red/20 hover:bg-surface-light/50 transition-all duration-300"
                  >
                    <div className="w-9 h-9 rounded-lg bg-neon-red/10 flex items-center justify-center flex-shrink-0 group-hover:bg-neon-red/20 transition-colors">
                      <Icon className="w-4 h-4 text-neon-red" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary leading-tight">
                        {feature.title}
                      </p>
                      <p className="text-[11px] text-text-muted mt-0.5 leading-snug">
                        {feature.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Alt — İstatistik Kartları */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="relative z-10 flex gap-4"
        >
          {floatingStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 + i * 0.1 }}
              className="flex-1 bg-surface/50 backdrop-blur-sm border border-border/50 rounded-xl p-3 text-center"
            >
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-text-muted mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ─────────── Dikey Ayırıcı (desktop) ─────────── */}
      <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-border to-transparent" />

      {/* ─────────── SAĞ PANEL — Form ─────────── */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Mobile arka plan (desktop'ta sol panel karşılıyor) */}
        <div className="lg:hidden absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-neon-red/12 rounded-full blur-[100px] bg-animate" />
          <div
            className="absolute top-1/2 -right-40 w-96 h-96 bg-teal/10 rounded-full blur-[120px] bg-animate"
            style={{ animationDelay: "5s" }}
          />
          <div
            className="absolute -bottom-40 left-1/3 w-72 h-72 bg-purple-400/8 rounded-full blur-[80px] bg-animate"
            style={{ animationDelay: "10s" }}
          />
        </div>

        {/* Mobile grid pattern */}
        <div
          className="lg:hidden absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Mobile back button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="lg:hidden fixed top-0 left-0 right-0 z-20 px-4 py-4"
        >
          <div className="max-w-md mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm"
            >
              <FiArrowLeft className="w-4 h-4" />
              Ana Sayfa
            </Link>
          </div>
        </motion.div>

        {/* Form kartı */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md px-6 py-8 lg:px-10 xl:px-14"
        >
          {/* Desktop sağ panel üst dekorasyon */}
          <div className="hidden lg:block absolute top-0 right-0 w-20 h-px bg-gradient-to-l from-neon-red/20 to-transparent" />

          <div className="lg:bg-transparent lg:shadow-none glass lg:backdrop-blur-none rounded-2xl p-8 lg:p-0 shadow-2xl">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center lg:text-left mb-8"
            >
              <div className="inline-flex mb-4 lg:hidden">
                <LogoLink size="lg" />
              </div>
              <h2 className="hidden lg:block text-2xl xl:text-3xl font-bold text-text-primary mb-2">
                Hoş Geldiniz
              </h2>
              <p className="text-text-secondary text-sm">
                <span className="lg:hidden">TikTok Trend Analiz Platformu</span>
                <span className="hidden lg:inline">
                  Hesabınıza giriş yaparak trendleri keşfedin
                </span>
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Kullanıcı Adı veya E-posta
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Kullanıcı adınız veya e-postanız"
                    className="w-full bg-surface-light border border-border rounded-xl py-3 pl-10 pr-4 text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-red/50 focus:ring-1 focus:ring-neon-red/20 transition-all"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifrenizi girin"
                    className="w-full bg-surface-light border border-border rounded-xl py-3 pl-10 pr-12 text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-red/50 focus:ring-1 focus:ring-neon-red/20 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-5 h-5" />
                    ) : (
                      <FiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-neon-red/10 border border-neon-red/20 rounded-lg p-3 text-neon-red text-sm text-center"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                type="submit"
                disabled={loading || !identifier || !password}
                className="w-full gradient-red text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <FiLock className="w-4 h-4" />
                    Giriş Yap
                  </>
                )}
              </motion.button>
            </form>

            {/* OAuth Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <OAuthButtons mode="login" />
            </motion.div>

            {/* Register Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-6"
            >
              <p className="text-text-secondary text-sm">
                Hesabınız yok mu?{" "}
                <Link
                  href="/register"
                  className="text-neon-red hover:text-neon-red/80 font-medium transition-colors"
                >
                  Kayıt Ol
                </Link>
              </p>
            </motion.div>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center text-text-muted text-xs mt-4"
            >
              Sadece yetkili kullanıcılar erişebilir
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
