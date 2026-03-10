"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  FiActivity,
  FiPlay,
} from "react-icons/fi";

const navItems = [
  { href: "/dashboard", label: "Genel Bakış", icon: FiHome },
  { href: "/dashboard/trending-videos", label: "Trend Videolar", icon: FiPlay },
  { href: "/dashboard/hashtags", label: "Hashtag'ler", icon: FiHash },
  { href: "/dashboard/sounds", label: "Sesler", icon: FiMusic },
  { href: "/dashboard/ideas", label: "İçerik Fikirleri", icon: FiZap },
  { href: "/dashboard/posting-times", label: "Paylaşım Zamanı", icon: FiClock },
  { href: "/dashboard/growth", label: "Büyüme Stratejisi", icon: FiTrendingUp },
  { href: "/dashboard/predictions", label: "Trend Tahminleri", icon: FiTarget },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background flex">
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
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg gradient-red flex items-center justify-center">
              <FiActivity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary">
                Tik<span className="text-neon-red">Trend</span>TR
              </h1>
              <p className="text-[10px] text-text-muted uppercase tracking-wider">
                Trend Analytics
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.href);
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
                {item.label}
                {active && (
                  <motion.div
                    layoutId="activeNav"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-red"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Status & Logout */}
        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-light">
            <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
            <span className="text-xs text-text-secondary">Veri toplama aktif</span>
          </div>
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
      <main className="flex-1 min-h-screen">
        {/* Mobile header */}
        <div className="lg:hidden sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-surface-light transition-colors"
          >
            {sidebarOpen ? (
              <FiX className="w-5 h-5 text-text-primary" />
            ) : (
              <FiMenu className="w-5 h-5 text-text-primary" />
            )}
          </button>
          <h1 className="text-sm font-semibold text-text-primary">
            Tik<span className="text-neon-red">Trend</span>TR
          </h1>
        </div>

        <div className="p-4 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
