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
      {/* Background gradient overlay for entire page */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.04] via-transparent to-blue-500/[0.04]" />

      {/* ─────────── LEFT PANEL - Canva-style showcase (desktop only) ─────────── */}
      <div className="hidden md:flex md:w-[50%] lg:w-[55%] xl:w-[58%] relative flex-col justify-between p-8 lg:p-12 xl:p-16 overflow-hidden bg-gradient-to-br from-purple-600/20 via-blue-600/15 to-teal-500/10">
        {/* Floating gradient blurs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[450px] h-[450px] bg-purple-500/20 rounded-full blur-[130px]" />
          <div className="absolute bottom-20 right-10 w-[350px] h-[350px] bg-teal-500/15 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px]" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Top - Logo & back */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors text-sm mb-8">
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfa
          </Link>
          <LogoLink size="lg" showSubtitle subtitle="TikTok Trend Analiz Platformu" />
        </motion.div>

        {/* Center - Headline + benefit cards */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="w-full max-w-lg">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-2xl xl:text-3xl font-bold text-foreground mb-4 leading-tight"
            >
              Trendleri Analiz Edin,{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-teal-400 bg-clip-text text-transparent">
                Rakiplerinizin Önüne Geçin
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-foreground/60 text-sm mb-8"
            >
              Hesabınıza giriş yaparak trendleri analiz etmeye devam edin.
            </motion.p>

            {/* Colorful benefit cards */}
            <div className="space-y-3 mb-8">
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                const cardStyles = [
                  {
                    bg: "bg-purple-500/[0.12]",
                    border: "border-purple-500/20",
                    iconBg: "bg-purple-500/25",
                    iconColor: "text-purple-300",
                    shadow: "hover:shadow-purple-500/10",
                  },
                  {
                    bg: "bg-teal-500/[0.12]",
                    border: "border-teal-500/20",
                    iconBg: "bg-teal-500/25",
                    iconColor: "text-teal-300",
                    shadow: "hover:shadow-teal-500/10",
                  },
                  {
                    bg: "bg-amber-500/[0.12]",
                    border: "border-amber-500/20",
                    iconBg: "bg-amber-500/25",
                    iconColor: "text-amber-300",
                    shadow: "hover:shadow-amber-500/10",
                  },
                ];
                const c = cardStyles[i % cardStyles.length];
                return (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                    className={`flex items-start gap-4 p-4 rounded-xl ${c.bg} border ${c.border} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${c.shadow}`}
                  >
                    <div className={`w-11 h-11 rounded-xl ${c.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${c.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {benefit.title}
                      </p>
                      <p className="text-xs text-foreground/60 mt-0.5">
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
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 backdrop-blur-sm"
            >
              <p className="text-xs font-semibold text-foreground/50 mb-3 uppercase tracking-wider">
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
                    <span className="text-xs text-foreground/60">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom - Stats row with colored backgrounds */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="bg-purple-500/[0.15] border border-purple-500/20 rounded-xl px-4 py-3 backdrop-blur-sm">
            <p className="text-2xl font-bold text-purple-400">5.2K+</p>
            <p className="text-foreground/60 text-xs">Aktif Kullanıcı</p>
          </div>
          <div className="bg-teal-500/[0.15] border border-teal-500/20 rounded-xl px-4 py-3 backdrop-blur-sm">
            <p className="text-2xl font-bold text-teal">25K+</p>
            <p className="text-foreground/60 text-xs">Günlük Analiz</p>
          </div>
          <div className="bg-amber-500/[0.15] border border-amber-500/20 rounded-xl px-4 py-3 backdrop-blur-sm">
            <p className="text-2xl font-bold text-amber-400">150K+</p>
            <p className="text-foreground/60 text-xs">Trend Takibi</p>
          </div>
        </motion.div>
      </div>

      {/* ─────────── RIGHT PANEL - Form ─────────── */}
      <div className="flex-1 flex flex-col items-center justify-center relative min-h-screen">
        {/* Mobile gradient background */}
        <div className="md:hidden absolute inset-0 overflow-hidden bg-gradient-to-br from-purple-600/10 via-background to-teal-500/10">
          <div className="absolute -top-32 -left-20 w-72 h-72 bg-purple-500/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-teal-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-1/2 w-60 h-60 bg-blue-500/8 rounded-full blur-[80px]" />
        </div>

        {/* Mobile back button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="md:hidden absolute top-0 left-0 right-0 z-20 px-4 py-4"
        >
          <div className="max-w-md mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Ana Sayfa
            </Link>
          </div>
        </motion.div>

        {/* Mobile compact header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:hidden relative z-10 text-center mt-16 mb-6 px-6"
        >
          <LogoLink size="lg" />
          <p className="text-foreground/60 text-sm mt-3">TikTok Trend Analiz Platformu</p>
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md px-6 py-4 md:py-10 md:px-10 xl:px-14"
        >
          <div className="md:bg-transparent md:shadow-none md:backdrop-blur-none md:border-0 bg-white/[0.06] backdrop-blur-xl border border-white/[0.1] rounded-2xl p-6 sm:p-8 md:p-0 shadow-2xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center md:text-left mb-8"
            >
              <div className="hidden md:inline-flex md:mb-6">
                <LogoLink size="lg" />
              </div>
              <h2 className="text-xl sm:text-2xl xl:text-3xl font-bold text-foreground mb-2">
                <span className="md:hidden">Hesabınıza Giriş Yapın</span>
                <span className="hidden md:inline">Hoş Geldiniz</span>
              </h2>
              <p className="text-foreground/70 text-sm">
                <span className="hidden md:inline">
                  Hesabınıza giriş yaparak trendleri keşfedin
                </span>
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <label className="block text-sm font-medium text-foreground/70 mb-1.5">
                  Kullanıcı Adı veya E-posta
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 w-5 h-5" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Kullanıcı adınız veya e-postanız"
                    className="w-full bg-muted border border-border rounded-xl py-3 pl-10 pr-4 text-foreground placeholder-foreground/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-foreground/70 mb-1.5">
                  Şifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifrenizi girin"
                    className="w-full bg-muted border border-border rounded-xl py-3 pl-10 pr-12 text-foreground placeholder-foreground/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground transition-colors"
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
                className="w-full bg-gradient-to-r from-primary to-rose-500 text-white font-semibold py-3 rounded-xl hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
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
              <p className="text-foreground/70 text-sm">
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

        {/* Mobile trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="md:hidden relative z-10 flex items-center justify-center gap-3 px-6 pb-8 mt-2"
        >
          <div className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/15 rounded-lg px-3 py-2">
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs text-foreground/70 font-medium">5.2K+ Kullanıcı</span>
          </div>
          <div className="flex items-center gap-1.5 bg-teal-500/10 border border-teal-500/15 rounded-lg px-3 py-2">
            <Zap className="w-3.5 h-3.5 text-teal" />
            <span className="text-xs text-foreground/70 font-medium">25K+ Analiz</span>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/15 rounded-lg px-3 py-2">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs text-foreground/70 font-medium">SSL Güvenli</span>
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
