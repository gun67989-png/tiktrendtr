"use client";

import { useState } from "react";
import { FaFacebookF, FaTiktok } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

interface OAuthButtonsProps {
  mode: "login" | "register";
}

const providers = [
  {
    id: "google",
    label: "Google",
    icon: FcGoogle,
    bgClass: "bg-white hover:bg-gray-100",
    textClass: "text-gray-700",
    iconColor: undefined, // FcGoogle zaten renkli
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

  const handleOAuth = (providerId: string) => {
    setLoadingProvider(providerId);
    window.location.href = `/api/auth/${providerId}`;
  };

  const actionText = mode === "login" ? "ile Giriş Yap" : "ile Kayıt Ol";

  return (
    <div className="space-y-3">
      {/* Ayırıcı */}
      <div className="relative flex items-center my-4">
        <div className="flex-grow border-t border-border" />
        <span className="flex-shrink-0 mx-4 text-text-muted text-xs">veya</span>
        <div className="flex-grow border-t border-border" />
      </div>

      {/* OAuth Butonları */}
      <div className="space-y-2.5">
        {providers.map((provider) => {
          const Icon = provider.icon;
          const isLoading = loadingProvider === provider.id;

          return (
            <button
              key={provider.id}
              onClick={() => handleOAuth(provider.id)}
              disabled={loadingProvider !== null}
              className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed ${provider.bgClass} ${provider.textClass}`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              ) : (
                <>
                  <Icon className={`w-5 h-5 ${provider.iconColor || ""}`} />
                  {provider.label} {actionText}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
