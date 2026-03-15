"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Hash,
  Music,
  Zap,
  Clock,
  TrendingUp,
  Target,
  LogOut,
  Menu,
  Play,
  Shield,
  Users,
  BarChart2,
  Lock,
  Star,
  CreditCard,
  Search,
  FileText,
  BookOpen,
  Heart,
  Compass,
  Lightbulb,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";
import WelcomeOverlay from "@/components/WelcomeOverlay";
import LogoutOverlay from "@/components/LogoutOverlay";
import OnboardingFlow from "@/components/OnboardingFlow";
import BeginnerGuide from "@/components/dashboard/BeginnerGuide";
import { useAchievements, AchievementToast, AchievementsPanel } from "@/components/dashboard/Achievements";

const LITE_PATHS = [
  "/dashboard/creators",
  "/dashboard/hook-library",
];

const PREMIUM_PATHS = [
  "/dashboard/sentiment",
  "/dashboard/ideas",
  "/dashboard/growth",
  "/dashboard/predictions",
  "/dashboard/competitor",
  "/dashboard/hooks",
  "/dashboard/reports",
  "/dashboard/daily-report",
  "/dashboard/ad-analysis",
];

const navItems: { href: string; label: string; icon: typeof Home; badge?: string }[] = [
  { href: "/dashboard", label: "Genel Bakış", icon: Home },
  { href: "/dashboard/trending-videos", label: "Trend Videolar", icon: Play },
  { href: "/dashboard/creators", label: "İçerik Üreticileri", icon: Users },
  { href: "/dashboard/hook-library", label: "Hook Kütüphanesi", icon: BookOpen },
  { href: "/dashboard/hashtags", label: "Hashtag'ler", icon: Hash },
  { href: "/dashboard/sounds", label: "Sesler", icon: Music },
  { href: "/dashboard/posting-times", label: "Paylaşım Zamanı", icon: Clock },
];

const premiumNavItems: { href: string; label: string; icon: typeof Home; badge?: string }[] = [
  { href: "/dashboard/sentiment", label: "Yorum Analizi", icon: Heart },
  { href: "/dashboard/ideas", label: "İçerik Fikirleri", icon: Zap },
  { href: "/dashboard/growth", label: "Büyüme Stratejisi", icon: TrendingUp },
  { href: "/dashboard/predictions", label: "Trend Tahminleri", icon: Target, badge: "Yeni" },
  { href: "/dashboard/competitor", label: "Rakip Analizi", icon: Target },
  { href: "/dashboard/hooks", label: "Hook Analizi", icon: Zap, badge: "Yeni" },
  { href: "/dashboard/reports", label: "Günlük Rapor", icon: BarChart2 },
  { href: "/dashboard/daily-report", label: "Detaylı Rapor", icon: FileText },
  { href: "/dashboard/ad-analysis", label: "Reklam Analizi", icon: BarChart2, badge: "Yeni" },
];

interface UserInfo {
  userId: string;
  username: string;
  email: string;
  role: "admin" | "user";
  subscriptionType: "free" | "lite" | "standard" | "enterprise";
  subscriptionNiche: string | null;
  subscriptionRole: "brand" | "individual" | null;
  onboardingCompleted: boolean;
}

function SidebarNav({
  user,
  isPremium,
  pathname,
  onNavigate,
}: {
  user: UserInfo | null;
  isPremium: boolean;
  pathname: string;
  onNavigate: (href: string) => void;
}) {
  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-4 border-b">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Valyze TR" className="w-8 h-8 rounded-lg" />
          <div>
            <h1 className="text-sm font-semibold tracking-tight">
              Valyze <span className="text-teal">TR</span>
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Trend Analytics
            </p>
          </div>
        </Link>
      </div>

      {/* Quick Access */}
      <div className="px-2 pt-3 pb-1">
        <p className="px-3 py-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          Hızlı Erişim
        </p>
        <div className="flex gap-1.5 px-1 mt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("/dashboard/trending-videos")}
            className="flex-1 h-8 text-[11px] gap-1.5 border-teal/20 text-teal hover:bg-teal/10 hover:text-teal"
          >
            <Compass className="w-3.5 h-3.5" />
            Trend Keşfet
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate("/dashboard/ideas")}
            className="flex-1 h-8 text-[11px] gap-1.5 border-teal/20 text-teal hover:bg-teal/10 hover:text-teal"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            İçerik Fikri Al
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        <p className="px-3 py-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          Ana Menü
        </p>
        {navItems.map((item) => {
          const active = isActive(item.href);
          const isLiteLocked = !isPremium && LITE_PATHS.includes(item.href);
          return (
            <Button
              key={item.href}
              variant="ghost"
              onClick={() => onNavigate(item.href)}
              className={`relative w-full justify-start gap-2.5 h-9 px-3 text-[13px] font-medium ${
                active
                  ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-primary rounded-r" />
              )}
              <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-primary" : ""}`} />
              <span className="flex-1 text-left truncate">{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-teal/15 text-teal leading-none">
                  {item.badge}
                </span>
              )}
              {isLiteLocked && <Lock className="w-3 h-3 text-muted-foreground" />}
            </Button>
          );
        })}

        <Separator className="my-3" />

        <p className="px-3 py-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          Pro Özellikler
        </p>
        {premiumNavItems.map((item) => {
          const active = isActive(item.href);
          const isLocked = !isPremium && PREMIUM_PATHS.includes(item.href);
          return (
            <Button
              key={item.href}
              variant="ghost"
              onClick={() => onNavigate(item.href)}
              className={`relative w-full justify-start gap-2.5 h-9 px-3 text-[13px] font-medium ${
                active
                  ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-primary rounded-r" />
              )}
              <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-primary" : ""}`} />
              <span className="flex-1 text-left truncate">{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-teal/15 text-teal leading-none">
                  {item.badge}
                </span>
              )}
              {isLocked && <Lock className="w-3 h-3 text-muted-foreground" />}
            </Button>
          );
        })}

        <Separator className="my-3" />

        {/* Billing */}
        <Button
          variant="ghost"
          onClick={() => onNavigate("/dashboard/billing")}
          className={`relative w-full justify-start gap-2.5 h-9 px-3 text-[13px] font-medium ${
            isActive("/dashboard/billing")
              ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {isActive("/dashboard/billing") && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-primary rounded-r" />
          )}
          <CreditCard className={`w-4 h-4 ${isActive("/dashboard/billing") ? "text-primary" : ""}`} />
          <span>Fatura</span>
        </Button>

        {/* Admin */}
        {user?.role === "admin" && (
          <Button
            variant="ghost"
            onClick={() => onNavigate("/dashboard/admin")}
            className={`relative w-full justify-start gap-2.5 h-9 px-3 text-[13px] font-medium ${
              isActive("/dashboard/admin")
                ? "bg-teal/10 text-teal hover:bg-teal/15 hover:text-teal"
                : "text-muted-foreground hover:text-teal"
            }`}
          >
            {isActive("/dashboard/admin") && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-teal rounded-r" />
            )}
            <Shield className={`w-4 h-4 ${isActive("/dashboard/admin") ? "text-teal" : ""}`} />
            <span>Admin Paneli</span>
          </Button>
        )}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t space-y-2">
        {user && (
          <div className="px-1">
            {user.subscriptionType === "enterprise" ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-amber-500/5 border border-amber-500/15">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-amber-400">Kurumsal Plan</p>
                  <p className="text-[10px] text-amber-400/50">Tüm özellikler aktif</p>
                </div>
              </div>
            ) : user.subscriptionType === "standard" ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-teal/5 border border-teal/15">
                <Star className="w-3.5 h-3.5 text-teal" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-teal">Standart Plan</p>
                  <p className="text-[10px] text-teal/50">4 haftalık arşiv</p>
                </div>
              </div>
            ) : user.subscriptionType === "lite" ? (
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-blue-400/5 border border-blue-400/15">
                <Star className="w-3.5 h-3.5 text-blue-400" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-blue-400">Lite Plan</p>
                  <p className="text-[10px] text-blue-400/50">14 günlük döngü</p>
                </div>
              </div>
            ) : (
              <Link
                href="/pricing"
                className="flex items-center gap-2 px-3 py-2 rounded-md border hover:border-primary/20 transition-colors group"
              >
                <Zap className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    Free Plan
                  </p>
                  <p className="text-[10px] text-muted-foreground">Planını yükselt</p>
                </div>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { unlocked, newAchievement, checkPageAchievement, totalPoints, maxPoints } = useAchievements();

  // Track page visits for achievements
  useEffect(() => {
    checkPageAchievement(pathname);
  }, [pathname, checkPageAchievement]);

  useEffect(() => {
    fetch("/api/auth/check")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setUser(data.user);
          if (!data.user.onboardingCompleted && data.user.role !== "admin") {
            setShowOnboarding(true);
          }
        }
      })
      .catch(() => {});
  }, []);

  const doLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const isPremium = (user?.subscriptionType && user.subscriptionType !== "free") || user?.role === "admin";

  const handleNavigate = (href: string) => {
    router.push(href);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex overflow-x-hidden max-w-[100vw]">
      <WelcomeOverlay username={user?.username} />
      {showOnboarding && (
        <OnboardingFlow
          username={user?.username}
          onComplete={() => setShowOnboarding(false)}
        />
      )}
      <LogoutOverlay
        username={user?.username}
        open={logoutOpen}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={doLogout}
      />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-60 lg:flex-col lg:fixed lg:inset-y-0 border-r bg-card">
        <SidebarNav
          user={user}
          isPremium={isPremium}
          pathname={pathname}
          onNavigate={handleNavigate}
        />
      </aside>

      {/* Main area */}
      <div className="flex-1 lg:pl-60 min-w-0">
        {/* Top header bar */}
        <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-md">
          <div className="flex items-center gap-4 px-4 h-14">
            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-60">
                <SheetTitle className="sr-only">Navigasyon Menüsü</SheetTitle>
                <SidebarNav
                  user={user}
                  isPremium={isPremium}
                  pathname={pathname}
                  onNavigate={handleNavigate}
                />
              </SheetContent>
            </Sheet>

            {/* Mobile logo */}
            <Link href="/dashboard" className="lg:hidden flex items-center gap-2">
              <img src="/logo.png" alt="Valyze TR" className="w-7 h-7 rounded-lg" />
              <span className="text-sm font-semibold tracking-tight">
                Valyze <span className="text-teal">TR</span>
              </span>
            </Link>

            {/* Search (desktop) */}
            <div className="hidden lg:flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Ara..."
                  className="w-full h-9 pl-9 pr-4 rounded-md border bg-muted/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="flex-1 lg:hidden" />

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Achievements button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 relative"
                onClick={() => setAchievementsOpen(true)}
              >
                <Trophy className="h-4 w-4 text-amber-400" />
                {totalPoints > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-400 text-[9px] text-white rounded-full flex items-center justify-center font-bold">
                    {unlocked.length}
                  </span>
                )}
              </Button>
              <ThemeToggle />

              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-9 gap-2 px-2">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {user.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden sm:inline text-sm font-medium">
                        {user.username}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>
                      <p className="text-sm font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/dashboard/billing")}>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Fatura
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setLogoutOpen(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Çıkış Yap
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8 w-full max-w-[1400px] mx-auto space-y-6">
          {pathname === "/dashboard" && <BeginnerGuide />}
          {children}
        </main>

        {/* Achievement toast */}
        <AchievementToast achievement={newAchievement} />

        {/* Achievements panel */}
        <AchievementsPanel
          isOpen={achievementsOpen}
          onClose={() => setAchievementsOpen(false)}
          unlocked={unlocked}
          totalPoints={totalPoints}
          maxPoints={maxPoints}
        />
      </div>
    </div>
  );
}
