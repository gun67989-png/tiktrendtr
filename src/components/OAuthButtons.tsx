"use client";

import { useState, useEffect } from "react";
import { FaFacebookF, FaTiktok } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiClock } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface OAuthButtonsProps {
  mode: "login" | "register";
}

// Aktif olmayan provider'lar — henüz key yok
const COMING_SOON_PROVIDERS = ["facebook", "tiktok"];

const providers = [
  {
    id: "google",
    label: "Google",
    icon: FcGoogle,
    bgClass: "bg-white hover:bg-gray-100",
    textClass: "text-gray-700",
    iconColor: undefined,
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: FaFacebookF,
    bgClass: "bg-[#1877F2] hover:bg-[#166FE5]",
    textClass: "text-white",
    iconColor: "text-white",
  },
  {
    id: "tiktok",
    label: "TikTok",
    icon: FaTiktok,
    bgClass: "bg-black hover:bg-gray-900",
    textClass: "text-white",
    iconColor: "text-white",
  },
];

export default function OAuthButtons({ mode }: OAuthButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [comingSoonToast, setComingSoonToast] = useState<string | null>(null);

  // Toast'u 2.5 saniye sonra kapat
  useEffect(() => {
    if (comingSoonToast) {
      const timer = setTimeout(() => setComingSoonToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [comingSoonToast]);

  const handleOAuth = (providerId: string) => {
    // Coming soon provider'larına tıklanınca yönlendirme yapma
    if (COMING_SOON_PROVIDERS.includes(providerId)) {
      setComingSoonToast(providerId);
      return;
    }

    setLoadingProvider(providerId);
    window.location.href = `/api/auth/${providerId}`;
  };

  const actionText = mode === "login" ? "ile Giriş Yap" : "ile Kayıt Ol";

  const getProviderLabel = (id: string) =>
    providers.find((p) => p.id === id)?.label || id;

  return (
    <div className="space-y-3 relative">
      {/* Ayırıcı */}
      <div className="relative flex items-center my-4">
        <div className="flex-grow border-t border-border" />
        <span className="flex-shrink-0 mx-4 text-text-muted text-xs">veya</span>
        <div className="flex-grow border-t border-border" />
      </div>

      {/* "Çok yakında" Toast */}
      <AnimatePresence>
        {comingSoonToast && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full z-10"
          >
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 backdrop-blur-sm shadow-lg shadow-amber-500/5">
              <FiClock className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <p className="text-xs font-medium text-amber-300 whitespace-nowrap">
                {getProviderLabel(comingSoonToast)} ile giriş çok yakında aktif olacak!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OAuth Butonları */}
      <div className="space-y-2.5">
        {providers.map((provider) => {
          const Icon = provider.icon;
          const isLoading = loadingProvider === provider.id;
          const isComingSoon = COMING_SOON_PROVIDERS.includes(provider.id);

          return (
            <button
              key={provider.id}
              onClick={() => handleOAuth(provider.id)}
              disabled={loadingProvider !== null}
              className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed relative ${provider.bgClass} ${provider.textClass} ${isComingSoon ? "opacity-80" : ""}`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              ) : (
                <>
                  <Icon className={`w-5 h-5 ${provider.iconColor || ""}`} />
                  {provider.label} {actionText}
                  {isComingSoon && (
                    <span className="ml-1 text-[10px] opacity-70 font-normal">(Yakında)</span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
