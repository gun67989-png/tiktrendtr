"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  User,
  Building2,
  TrendingUp,
  Video,
  Zap,
  Target,
  BarChart2,
  BookOpen,
  Swords,
  FileText,
  ArrowRight,
  Check,
  Loader2,
  Sparkles,
} from "lucide-react";
import LogoLink from "@/components/LogoLink";

const individualFeatures = [
  { icon: TrendingUp, text: "Ki\u015Fisel trend analizi ve i\u00E7erik \u00F6nerileri" },
  { icon: Video, text: "Viral video ke\u015Ffi ve ilham paneli" },
  { icon: Zap, text: "AI destekli i\u00E7erik fikirleri" },
  { icon: BookOpen, text: "Hook k\u00FCt\u00FCphanesi ve format \u00F6nerileri" },
  { icon: Sparkles, text: "G\u00FCnl\u00FCk i\u00E7erik plan\u0131 ve hedefler" },
];

const brandFeatures = [
  { icon: Target, text: "Rakip analizi ve kar\u015F\u0131la\u015Ft\u0131rma paneli" },
  { icon: BarChart2, text: "Marka performans ve ROI takibi" },
  { icon: Swords, text: "Rekabet stratejisi ve sekt\u00F6rel veriler" },
  { icon: FileText, text: "Detayl\u0131 raporlar ve PDF d\u0131\u015Fa aktarma" },
  { icon: Sparkles, text: "AI strateji \u00F6nerileri ve trend tahmini" },
];

interface UserInfo {
  userId: string;
  username: string;
  onboardingCompleted: boolean;
}

export default function OnboardingPage() {
  const [selected, setSelected] = useState<"individual" | "brand" | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState("");
  const router = useRouter();

  // Check if user is authenticated and hasn't completed onboarding
  useEffect(() => {
    fetch("/api/auth/check")
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push("/login");
          return;
        }
        const user = data.user as UserInfo;
        if (user.onboardingCompleted) {
          router.push("/dashboard");
          return;
        }
        setUsername(user.username);
        setChecking(false);
      })
      .catch(() => {
        router.push("/login");
      });
  }, [router]);

  const handleSelect = async (role: "individual" | "brand") => {
    setSelected(role);
    setLoading(true);

    try {
      const res = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (res.ok) {
        // Small delay for animation
        await new Promise((resolve) => setTimeout(resolve, 600));
        router.push("/dashboard");
        router.refresh();
      } else {
        setLoading(false);
        setSelected(null);
      }
    } catch {
      setLoading(false);
      setSelected(null);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/3 rounded-full blur-[200px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <LogoLink size="lg" />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-10 max-w-lg"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Ho\u015F geldin, <span className="text-primary">{username}</span>!
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Sana en uygun deneyimi sunabilmemiz i\u00E7in nas\u0131l kullanaca\u011F\u0131n\u0131 se\u00E7.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-3xl">
          {/* Individual Card */}
          <motion.button
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => !loading && handleSelect("individual")}
            disabled={loading}
            className={`relative overflow-hidden text-left rounded-2xl border-2 p-6 sm:p-8 transition-all duration-300 group ${
              selected === "individual"
                ? "border-teal bg-teal/5 shadow-lg shadow-teal/10"
                : selected === "brand"
                ? "border-border/50 bg-card/50 opacity-50"
                : "border-border bg-card hover:border-teal/50 hover:bg-teal/5"
            }`}
          >
            {/* Glow effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              {/* Icon + Badge */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <User className="w-7 h-7 text-teal" />
                </div>
                <AnimatePresence>
                  {selected === "individual" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="w-8 h-8 rounded-full bg-teal flex items-center justify-center"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      ) : (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-foreground mb-1">
                Bireysel \u00DCretici
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                \u0130\u00E7erik \u00FCreticileri, influencer&apos;lar ve bireysel kullan\u0131c\u0131lar i\u00E7in
              </p>

              {/* Features */}
              <div className="space-y-3">
                {individualFeatures.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-5 h-5 rounded bg-teal/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <feature.icon className="w-3 h-3 text-teal" />
                    </div>
                    <span className="text-sm text-muted-foreground leading-tight">
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* CTA hint */}
              <div className="mt-6 flex items-center gap-2 text-teal text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Se\u00E7 ve ba\u015Fla</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.button>

          {/* Brand Card */}
          <motion.button
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => !loading && handleSelect("brand")}
            disabled={loading}
            className={`relative overflow-hidden text-left rounded-2xl border-2 p-6 sm:p-8 transition-all duration-300 group ${
              selected === "brand"
                ? "border-amber-400 bg-amber-400/5 shadow-lg shadow-amber-400/10"
                : selected === "individual"
                ? "border-border/50 bg-card/50 opacity-50"
                : "border-border bg-card hover:border-amber-400/50 hover:bg-amber-400/5"
            }`}
          >
            {/* Glow effect */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="relative z-10">
              {/* Icon + Badge */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Building2 className="w-7 h-7 text-amber-400" />
                </div>
                <AnimatePresence>
                  {selected === "brand" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center"
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      ) : (
                        <Check className="w-4 h-4 text-white" />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-foreground mb-1">
                Marka / Ajans
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                Markalar, ajanslar ve kurumsal ekipler i\u00E7in
              </p>

              {/* Features */}
              <div className="space-y-3">
                {brandFeatures.map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-5 h-5 rounded bg-amber-400/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <feature.icon className="w-3 h-3 text-amber-400" />
                    </div>
                    <span className="text-sm text-muted-foreground leading-tight">
                      {feature.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* CTA hint */}
              <div className="mt-6 flex items-center gap-2 text-amber-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Se\u00E7 ve ba\u015Fla</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.button>
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs text-muted-foreground mt-8 text-center max-w-md"
        >
          Se\u00E7imini daha sonra ayarlardan de\u011Fi\u015Ftirebilirsin. Her iki dashboard&apos;a da eri\u015Fim m\u00FCmk\u00FCnd\u00FCr.
        </motion.p>
      </div>
    </div>
  );
}
