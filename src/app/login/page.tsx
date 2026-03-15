"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowLeft,
  TrendingUp,
  Zap,
  Shield,
  Check,
} from "lucide-react";
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

const benefits = [
  {
    icon: TrendingUp,
    title: "Gerçek Zamanlı Trendler",
    desc: "Güncel TikTok trendlerini anında takip edin",
  },
  {
    icon: Zap,
    title: "AI Destekli Öneriler",
    desc: "Yapay zeka ile kişiselleştirilmiş içerik fikirleri",
  },
  {
    icon: Shield,
    title: "Güvenli & Hızlı",
    desc: "Verileriniz güvende, analizler saniyeler içinde hazır",
  },
];

const checklist = [
  "Güncel TikTok trendlerini takip edin",
  "Popüler hashtag'leri keşfedin",
  "Viral sesleri ve istatistikleri inceleyin",
  "Detaylı günlük raporlar",
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
        const data = await res.json();
        const destination = data.user?.onboardingCompleted === false ? "/onboarding" : "/dashboard";
        router.push(destination);
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
      {/* ─────────── SOL PANEL — Marka & Avantajlar (sadece desktop) ─────────── */}
      <div className="hidden lg:flex lg:w-[55%] xl:w-[60%] relative flex-col justify-between p-10 xl:p-16 overflow-hidden">
        {/* Arka plan efektleri */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-teal/8 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
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
        <div className="absolute top-0 right-0 w-px h-40 bg-teal/20" />
        <div className="absolute bottom-0 left-0 w-40 h-px bg-primary/20" />

        {/* Üst — Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-8">
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfa
          </Link>

          <LogoLink size="lg" showSubtitle subtitle="TikTok Trend Analiz Platformu" />
        </motion.div>

        {/* Orta — Avantajlar */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="w-full max-w-lg">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-xl xl:text-2xl font-semibold text-foreground mb-2"
            >
              Tekrar Hoş Geldiniz
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-muted-foreground text-sm mb-8"
            >
              Hesabınıza giriş yaparak trendleri analiz etmeye devam edin.
            </motion.p>

            {/* Benefit kartları */}
            <div className="space-y-3 mb-8">
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-card/40 border border-border/50 transition-colors hover:bg-card/60 hover:border-border"
                  >
                    <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-teal" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {benefit.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {benefit.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Checklist */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="bg-card/30 border border-border/30 rounded-xl p-4"
            >
              <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                Platform Özellikleri
              </p>
              <div className="grid grid-cols-2 gap-2">
                {checklist.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + i * 0.08 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="w-3.5 h-3.5 text-teal flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Alt — İstatistikler */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="relative z-10 flex items-center gap-6"
        >
          <div>
            <p className="text-2xl font-bold text-primary">5.2K+</p>
            <p className="text-muted-foreground text-xs">Aktif Kullanıcı</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-2xl font-bold text-teal">25K+</p>
            <p className="text-muted-foreground text-xs">Günlük Analiz</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <p className="text-2xl font-bold text-amber-400">150K+</p>
            <p className="text-muted-foreground text-xs">Trend Takibi</p>
          </div>
        </motion.div>
      </div>

      {/* ─────────── Dikey Ayırıcı (desktop) ─────────── */}
      <div className="hidden lg:block w-px bg-border" />

      {/* ─────────── SAĞ PANEL — Form ─────────── */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Mobile arka plan */}
        <div className="lg:hidden absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/8 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 -right-40 w-96 h-96 bg-teal/5 rounded-full blur-[120px]" />
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
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
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
          <div className="lg:bg-transparent lg:shadow-none glass lg:backdrop-blur-none rounded-xl p-8 lg:p-0 shadow-2xl">
            {/* Başlık */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center lg:text-left mb-6"
            >
              <div className="inline-flex mb-4 lg:hidden">
                <LogoLink size="lg" />
              </div>
              <h2 className="hidden lg:block text-2xl xl:text-3xl font-bold text-foreground mb-2">
                Hoş Geldiniz
              </h2>
              <p className="text-muted-foreground text-sm">
                <span className="lg:hidden">Hesabınıza Giriş Yapın</span>
                <span className="hidden lg:inline">
                  Hesabınıza giriş yaparak trendleri keşfedin
                </span>
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Kullanıcı Adı veya E-posta
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Kullanıcı adınız veya e-postanız"
                    className="w-full bg-muted border border-border rounded-xl py-3 pl-10 pr-4 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifrenizi girin"
                    className="w-full bg-muted border border-border rounded-xl py-3 pl-10 pr-12 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-primary text-sm text-center"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                type="submit"
                disabled={loading || !identifier || !password}
                className="w-full bg-primary text-white font-semibold py-3 rounded-md hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Giriş Yap
                  </>
                )}
              </motion.button>
            </form>

            {/* OAuth */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <OAuthButtons mode="login" />
            </motion.div>

            {/* Register link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="text-center mt-6"
            >
              <p className="text-muted-foreground text-sm">
                Hesabınız yok mu?{" "}
                <Link
                  href="/register"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Kayıt Ol
                </Link>
              </p>
            </motion.div>
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
