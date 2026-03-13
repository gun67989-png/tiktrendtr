"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OAuthButtonsProps {
  mode: "login" | "register";
}

// Aktif olmayan provider'lar — henüz key yok
const COMING_SOON_PROVIDERS = ["facebook", "tiktok"];

const GoogleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className || "w-5 h-5"}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TiktokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className || "w-5 h-5"}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.49a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.24 8.24 0 0 0 4.8 1.54V6.84a4.83 4.83 0 0 1-1.04-.15z"/>
  </svg>
);

const providers = [
  {
    id: "google",
    label: "Google",
    icon: GoogleIcon,
    bgClass: "bg-white hover:bg-gray-100",
    textClass: "text-gray-700",
    iconColor: undefined,
  },
  {
    id: "facebook",
    label: "Facebook",
    icon: FacebookIcon,
    bgClass: "bg-[#1877F2] hover:bg-[#166FE5]",
    textClass: "text-white",
    iconColor: "text-white",
  },
  {
    id: "tiktok",
    label: "TikTok",
    icon: TiktokIcon,
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
        <span className="flex-shrink-0 mx-4 text-muted-foreground text-xs">veya</span>
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
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm">
              <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
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
              className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg font-medium text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed relative ${provider.bgClass} ${provider.textClass} ${isComingSoon ? "opacity-80" : ""}`}
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
