"use client";

import { useState, useEffect, Suspense } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowLeft,
  TrendingUp,
  Hash,
  Music,
  Zap,
  BarChart2,
  Target,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import LogoLink from "@/components/LogoLink";
import OAuthButtons from "@/components/OAuthButtons";

const OAUTH_ERRORS: Record<string, string> = {
  oauth_failed: "Sosyal giri\u015F ba\u015Far\u0131s\u0131z oldu. L\u00FCtfen tekrar deneyin.",
  oauth_denied: "Giri\u015F izni reddedildi.",
  oauth_no_email:
    "E-posta adresi al\u0131namad\u0131. L\u00FCtfen farkl\u0131 bir y\u00F6ntem deneyin.",
  oauth_start_failed: "Sosyal giri\u015F ba\u015Flat\u0131lamad\u0131.",
  oauth_invalid_state: "G\u00FCvenlik do\u011Frulamas\u0131 ba\u015Far\u0131s\u0131z. L\u00FCtfen tekrar deneyin.",
  oauth_missing_params: "Eksik parametreler. L\u00FCtfen tekrar deneyin.",
  account_disabled: "Bu hesap devre d\u0131\u015F\u0131 b\u0131rak\u0131lm\u0131\u015F.",
};

const features = [
  { icon: TrendingUp, text: "G\u00FCncel TikTok trendlerini takip edin" },
  { icon: Hash, text: "Pop\u00FCler hashtag\u2019leri ke\u015Ffedin" },
  { icon: Music, text: "Viral sesleri ve istatistikleri inceleyin" },
  { icon: Zap, text: "AI destekli i\u00E7erik \u00F6nerileri al\u0131n" },
  { icon: BarChart2, text: "Detayl\u0131 g\u00FCnl\u00FCk raporlar" },
  { icon: Target, text: "Rakip analizleriyle \u00F6ne \u00E7\u0131k\u0131n" },
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
        setError(data.error || "Giri\u015F ba\u015Far\u0131s\u0131z");
      }
    } catch {
      setError("Ba\u011Flant\u0131 hatas\u0131");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex">
      {/* ─── Full-screen background image ─── */}
      <div className="absolute inset-0">
        <Image
          src="/images/login-bg-4.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          unoptimized
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/70" />
      </div>

      {/* ─── SOL PANEL - Marka & Ozellikler (desktop) ─── */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-between p-12 xl:p-16">
        {/* Ust - Logo */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Ana Sayfa
          </Link>

          <div className="flex items-center gap-4">
            <Image
              src="/logo.png"
              alt="Valyze TR"
              width={64}
              height={64}
              className="rounded-xl"
              unoptimized
            />
            <div>
              <h1 className="text-3xl xl:text-4xl font-bold text-white">
                Valyze <span className="text-primary">TR</span>
              </h1>
              <p className="text-white/50 text-sm">
                TikTok Trend Analiz Platformu
              </p>
            </div>
          </div>
        </div>

        {/* Orta - Ozellikler */}
        <div className="flex-1 flex items-center">
          <div>
            <h2 className="text-2xl xl:text-3xl font-bold text-white mb-3">
              Trendleri Yakala,
              <br />
              <span className="text-primary">{"\u00D6ne \u00C7\u0131k"}</span>
            </h2>
            <p className="text-white/60 text-sm mb-8 max-w-md leading-relaxed">
              T{"\u00FC"}rkiye&apos;nin en kapsaml{"\u0131"} TikTok analiz arac{"\u0131"}yla
              i{"\u00E7"}eriklerinizi bir {"\u00FC"}st seviyeye ta{"\u015F\u0131"}y{"\u0131"}n.
            </p>

            <div className="space-y-3">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.text}
                    className="flex items-center gap-3 text-white/70"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm">{f.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Alt - Istatistikler */}
        <div className="flex gap-6">
          <div>
            <p className="text-2xl font-bold text-primary">2.4K+</p>
            <p className="text-white/40 text-xs">Aktif Trend</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-teal">15K+</p>
            <p className="text-white/40 text-xs">Hashtag</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-amber-400">500+</p>
            <p className="text-white/40 text-xs">G{"\u00FC"}nl{"\u00FC"}k Analiz</p>
          </div>
        </div>
      </div>

      {/* ─── SAG PANEL - Glass Form ─── */}
      <div className="flex-1 flex items-center justify-center relative z-10 p-4 sm:p-6">
        {/* Mobile back + logo */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-20 px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Geri
          </Link>
          <LogoLink size="sm" />
        </div>

        {/* Glass form card */}
        <div className="w-full max-w-md">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="lg:hidden mb-4">
                <Image
                  src="/logo.png"
                  alt="Valyze TR"
                  width={48}
                  height={48}
                  className="rounded-xl mx-auto"
                  unoptimized
                />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Ho{"\u015F"} Geldiniz
              </h2>
              <p className="text-white/50 text-sm">
                Hesab{"\u0131"}n{"\u0131"}za giri{"\u015F"} yaparak trendleri ke{"\u015F"}fedin
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Kullan{"\u0131"}c{"\u0131"} Ad{"\u0131"} veya E-posta
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={"Kullan\u0131c\u0131 ad\u0131n\u0131z veya e-postan\u0131z"}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  {"\u015E"}ifre
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={"\u015Eifrenizi girin"}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-12 text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !identifier || !password}
                className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Giri{"\u015F"} Yap
                  </>
                )}
              </button>
            </form>

            {/* OAuth */}
            <OAuthButtons mode="login" />

            {/* Register link */}
            <p className="text-center text-white/50 text-sm mt-6">
              Hesab{"\u0131"}n{"\u0131"}z yok mu?{" "}
              <Link
                href="/register"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Kay{"\u0131"}t Ol
              </Link>
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-white/30 text-xs mt-4">
            Sadece yetkili kullan{"\u0131"}c{"\u0131"}lar eri{"\u015F"}ebilir
          </p>
        </div>
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
