"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import {
  FiEye,
  FiEyeOff,
  FiLock,
  FiUser,
  FiMail,
  FiUserPlus,
  FiArrowLeft,
  FiTrendingUp,
  FiCheck,
  FiShield,
  FiZap,
} from "react-icons/fi";
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
    icon: FiTrendingUp,
    title: "Gerçek Zamanlı Trendler",
    desc: "Türkiye'de viral olan tüm trendleri anında keşfedin",
  },
  {
    icon: FiZap,
    title: "AI İçerik Önerileri",
    desc: "Yapay zeka destekli kişiselleştirilmiş içerik fikirleri",
  },
  {
    icon: FiShield,
    title: "Güvenli & Hızlı",
    desc: "Verileriniz güvende, analizler saniyeler içinde hazır",
  },
];

const checklist = [
  "Sınırsız trend analizi erişimi",
  "Günlük e-posta raporları",
  "Hashtag & ses keşfi araçları",
  "İçerik takvimi önerileri",
];

function RegisterContent() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    if (username.length < 3) {
      setError("Kullanıcı adı en az 3 karakter olmalıdır");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Geçerli bir e-posta adresi girin");
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır");
      return;
    }

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, confirmPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Kayıt başarısız");
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
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-teal/15 rounded-full blur-[150px] animate-pulse" />
          <div
            className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-neon-red/10 rounded-full blur-[120px] animate-pulse"
            style={{ animationDelay: "3s" }}
          />
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-amber-500/8 rounded-full blur-[100px] animate-pulse"
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
        <div className="absolute top-0 right-0 w-px h-40 bg-gradient-to-b from-teal/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-40 h-px bg-gradient-to-r from-neon-red/30 to-transparent" />

        {/* Üst — Logo */}
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
            <div className="w-12 h-12 rounded-2xl gradient-red flex items-center justify-center shadow-lg shadow-neon-red/20">
              <FiTrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl xl:text-4xl font-bold text-text-primary">
                Val<span className="text-neon-red">yze</span>
              </h1>
              <p className="text-text-muted text-sm tracking-wide">
                TikTok Trend Analiz Platformu
              </p>
            </div>
          </div>
        </motion.div>

        {/* Orta — Avantajlar */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="w-full max-w-lg">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-xl xl:text-2xl font-semibold text-text-primary mb-2"
            >
              Ücretsiz Başlayın
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-text-secondary text-sm mb-8"
            >
              Hesap oluşturun ve Türkiye&apos;nin TikTok trendlerini analiz etmeye hemen başlayın.
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
                    className="flex items-start gap-4 p-4 rounded-xl bg-surface/40 border border-border/50"
                  >
                    <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-teal" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {benefit.title}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">
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
              className="bg-surface/30 border border-border/30 rounded-xl p-4"
            >
              <p className="text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wider">
                Free Plana Dahil
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
                    <FiCheck className="w-3.5 h-3.5 text-teal flex-shrink-0" />
                    <span className="text-xs text-text-secondary">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Alt — Güven göstergesi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="relative z-10"
        >
          <p className="text-text-muted text-xs flex items-center gap-2">
            <FiShield className="w-3.5 h-3.5 text-teal" />
            256-bit SSL şifreleme ile korunmaktadır
          </p>
        </motion.div>
      </div>

      {/* ─────────── Dikey Ayırıcı (desktop) ─────────── */}
      <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-border to-transparent" />

      {/* ─────────── SAĞ PANEL — Form ─────────── */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Mobile arka plan */}
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
          <div className="lg:bg-transparent lg:shadow-none glass lg:backdrop-blur-none rounded-2xl p-8 lg:p-0 shadow-2xl">
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
              <h2 className="hidden lg:block text-2xl xl:text-3xl font-bold text-text-primary mb-2">
                Hesap Oluştur
              </h2>
              <p className="text-text-secondary text-sm">
                <span className="lg:hidden">Yeni Hesap Oluştur</span>
                <span className="hidden lg:inline">
                  Bilgilerinizi girerek hemen başlayın
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
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Kullanıcı Adı
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Kullanıcı adınız"
                    className="w-full bg-surface-light border border-border rounded-xl py-3 pl-10 pr-4 text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-red/50 focus:ring-1 focus:ring-neon-red/20 transition-all"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  E-posta
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-posta adresiniz"
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
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Şifre
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="En az 6 karakter"
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

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Şifre Tekrar
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Şifrenizi tekrar girin"
                    className="w-full bg-surface-light border border-border rounded-xl py-3 pl-10 pr-4 text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-red/50 focus:ring-1 focus:ring-neon-red/20 transition-all"
                    required
                  />
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
                transition={{ delay: 0.45 }}
                type="submit"
                disabled={
                  loading || !username || !email || !password || !confirmPassword
                }
                className="w-full gradient-red text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <FiUserPlus className="w-4 h-4" />
                    Kayıt Ol
                  </>
                )}
              </motion.button>
            </form>

            {/* OAuth Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <OAuthButtons mode="register" />
            </motion.div>

            {/* Login Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="text-center mt-6"
            >
              <p className="text-text-secondary text-sm">
                Zaten hesabınız var mı?{" "}
                <Link
                  href="/login"
                  className="text-neon-red hover:text-neon-red/80 font-medium transition-colors"
                >
                  Giriş Yap
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterContent />
    </Suspense>
  );
}
