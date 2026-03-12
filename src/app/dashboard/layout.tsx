"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FiHome,
  FiHash,
  FiMusic,
  FiZap,
  FiClock,
  FiTrendingUp,
  FiTarget,
  FiLogOut,
  FiMenu,
  FiX,
  FiPlay,
  FiShield,
  FiUser,
  FiShoppingBag,
  FiBarChart2,
  FiLock,
  FiStar,
  FiCreditCard,
} from "react-icons/fi";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import LogoutOverlay from "@/components/LogoutOverlay";

// Premium pages — free users see the PremiumGate inside these pages
const PREMIUM_PATHS = [
  "/dashboard/ideas",
  "/dashboard/growth",
  "/dashboard/predictions",
  "/dashboard/competitor",
  "/dashboard/hooks",
  "/dashboard/reports",
];

const navItems = [
  { href: "/dashboard", label: "Genel Bakış", icon: FiHome },
  { href: "/dashboard/trending-videos", label: "Trend Videolar", icon: FiPlay },
  { href: "/dashboard/ad-ideas", label: "Reklam Fikirleri", icon: FiShoppingBag },
  { href: "/dashboard/hashtags", label: "Hashtag'ler", icon: FiHash },
  { href: "/dashboard/sounds", label: "Sesler", icon: FiMusic },
  { href: "/dashboard/posting-times", label: "Paylaşım Zamanı", icon: FiClock },
  // — premium —
  { href: "/dashboard/ideas", label: "İçerik Fikirleri", icon: FiZap },
  { href: "/dashboard/growth", label: "Büyüme Stratejisi", icon: FiTrendingUp },
  { href: "/dashboard/predictions", label: "Trend Tahminleri", icon: FiTarget },
  { href: "/dashboard/competitor", label: "Rakip Analizi", icon: FiTarget },
  { href: "/dashboard/hooks", label: "Hook Analizi", icon: FiZap },
  { href: "/dashboard/reports", label: "Günlük Rapor", icon: FiBarChart2 },
];

interface UserInfo {
  userId: string;
  username: string;
  email: string;
  role: "admin" | "user";
  subscriptionType: "free" | "premium";
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/check")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    setLogoutOpen(true);
  };

  const doLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const isPremium = user?.subscriptionType === "premium" || user?.role === "admin";

  return (
    <div className="min-h-screen bg-background flex overflow-x-hidden max-w-[100vw]">
      {/* Welcome back overlay — on every login */}
      <WelcomeOverlay username={user?.username} />

      {/* Logout confirmation + exit animation */}
      <LogoutOverlay
        username={user?.username}
        open={logoutOpen}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={doLogout}
      />

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-surface border-r border-border z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Valyze TR"
              className="w-9 h-9 rounded-lg"
            />
            <div>
              <h1 className="text-lg font-bold text-text-primary">
                Valyze <span className="text-neon-red">TR</span>
              </h1>
              <p className="text-[10px] text-text-muted uppercase tracking-wider">
                Trend Analytics
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
            const isLocked = !isPremium && PREMIUM_PATHS.includes(item.href);
            return (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-neon-red/10 text-neon-red"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-light"
                }`}
              >
                <item.icon className={`w-4 h-4 ${active ? "text-neon-red" : ""}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {isLocked && (
                  <FiLock className="w-3 h-3 text-text-muted" />
                )}
                {active && !isLocked && (
                  <motion.div
                    layoutId="activeNav"
                    className="w-1.5 h-1.5 rounded-full bg-neon-red"
                  />
                )}
              </button>
            );
          })}

          {/* Fatura */}
          <div className="my-3 border-t border-border" />
          <button
            onClick={() => {
              router.push("/dashboard/billing");
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive("/dashboard/billing")
                ? "bg-neon-red/10 text-neon-red"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-light"
            }`}
          >
            <FiCreditCard className={`w-4 h-4 ${isActive("/dashboard/billing") ? "text-neon-red" : ""}`} />
            <span className="flex-1 text-left">Fatura</span>
            {isActive("/dashboard/billing") && (
              <motion.div
                layoutId="activeNavBilling"
                className="w-1.5 h-1.5 rounded-full bg-neon-red"
              />
            )}
          </button>

          {/* Admin Panel Link - only for admins */}
          {user?.role === "admin" && (
            <>
              <div className="my-3 border-t border-border" />
              <button
                onClick={() => {
                  router.push("/dashboard/admin");
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive("/dashboard/admin")
                    ? "bg-teal/10 text-teal"
                    : "text-text-secondary hover:text-teal hover:bg-teal/5"
                }`}
              >
                <FiShield
                  className={`w-4 h-4 ${
                    isActive("/dashboard/admin") ? "text-teal" : ""
                  }`}
                />
                Admin Paneli
                {isActive("/dashboard/admin") && (
                  <motion.div
                    layoutId="activeNavAdmin"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-teal"
                  />
                )}
              </button>
            </>
          )}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-border space-y-3">
          {/* Plan badge */}
          {user && (
            <div className="px-3">
              {isPremium ? (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                  <FiStar className="w-4 h-4 text-amber-400" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-amber-400">Pro Plan</p>
                    <p className="text-[10px] text-amber-400/60">Tüm özellikler aktif</p>
                  </div>
                </div>
              ) : (
                <Link
                  href="/pricing"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-light border border-border hover:border-neon-red/30 transition-all group"
                >
                  <FiZap className="w-4 h-4 text-text-muted group-hover:text-neon-red transition-colors" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-text-secondary group-hover:text-text-primary transition-colors">Free Plan</p>
                    <p className="text-[10px] text-text-muted">Pro&apos;ya yükselt</p>
                  </div>
                </Link>
              )}
            </div>
          )}

          {/* User info */}
          {user && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-light">
              <div className="w-7 h-7 rounded-full gradient-red flex items-center justify-center flex-shrink-0">
                <FiUser className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-text-primary truncate">
                  {user.username}
                </p>
                <p className="text-[10px] text-text-muted truncate">
                  {user.role === "admin" ? "Yönetici" : "Kullanıcı"}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-neon-red hover:bg-neon-red/5 transition-all"
          >
            <FiLogOut className="w-4 h-4" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen min-w-0 overflow-x-hidden">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-border px-3 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-surface-light transition-colors shrink-0"
          >
            {sidebarOpen ? (
              <FiX className="w-5 h-5 text-text-primary" />
            ) : (
              <FiMenu className="w-5 h-5 text-text-primary" />
            )}
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <img src="/logo.png" alt="Valyze TR" className="w-7 h-7 rounded-lg" />
            <span className="text-sm font-semibold text-text-primary">
              Valyze <span className="text-neon-red">TR</span>
            </span>
          </Link>
        </div>

        <div className="p-3 sm:p-4 lg:p-8 w-full">{children}</div>
      </main>
    </div>
  );
}
