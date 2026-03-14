// Plan definitions for Valyze TR

export type PlanType = "free" | "lite" | "standard" | "enterprise";
export type UserRole = "brand" | "individual";

export interface PlanConfig {
  id: PlanType;
  name: string;
  price: number; // TL / month
  retentionDays: number;
  features: string[];
  allowedPaths: string[];
  badge: string;
  badgeColor: string;
}

export const PLANS: Record<PlanType, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    retentionDays: 7,
    features: [
      "Trend video keşfi (sınırlı)",
      "Temel hashtag analizi",
      "Ses trendleri",
      "Paylaşım zamanı önerileri",
    ],
    allowedPaths: [
      "/dashboard",
      "/dashboard/trending-videos",
      "/dashboard/hashtags",
      "/dashboard/sounds",
      "/dashboard/posting-times",
    ],
    badge: "Free",
    badgeColor: "text-muted-foreground",
  },
  lite: {
    id: "lite",
    name: "Bireysel Lite",
    price: 280,
    retentionDays: 14,
    features: [
      "Trend video analizi",
      "Hashtag & ses analizi",
      "Paylaşım zamanı optimizasyonu",
      "İçerik üretici takibi",
      "Sektörel Hook Kütüphanesi",
      "14 günlük veri döngüsü",
    ],
    allowedPaths: [
      "/dashboard",
      "/dashboard/trending-videos",
      "/dashboard/hashtags",
      "/dashboard/sounds",
      "/dashboard/posting-times",
      "/dashboard/creators",
      "/dashboard/hook-library",
    ],
    badge: "Lite",
    badgeColor: "text-blue-400",
  },
  standard: {
    id: "standard",
    name: "Bireysel Standart",
    price: 350,
    retentionDays: 28,
    features: [
      "Tüm Lite özellikleri",
      "Duygu Analizi (Sentiment)",
      "AI İçerik Fikirleri",
      "Büyüme Stratejisi",
      "Trend Tahminleri",
      "Hook Analizi",
      "Günlük & Detaylı Rapor",
      "4 haftalık veri arşivi",
    ],
    allowedPaths: [
      "/dashboard",
      "/dashboard/trending-videos",
      "/dashboard/hashtags",
      "/dashboard/sounds",
      "/dashboard/posting-times",
      "/dashboard/creators",
      "/dashboard/hook-library",
      "/dashboard/sentiment",
      "/dashboard/ideas",
      "/dashboard/growth",
      "/dashboard/predictions",
      "/dashboard/hooks",
      "/dashboard/reports",
      "/dashboard/daily-report",
    ],
    badge: "Standart",
    badgeColor: "text-teal",
  },
  enterprise: {
    id: "enterprise",
    name: "Kurumsal",
    price: 1250,
    retentionDays: 30,
    features: [
      "Tüm Standart özellikleri",
      "Rakip Analizi & Savaş Odası",
      "AI Hook Üretimi",
      "PDF Rapor Çıktısı",
      "Trend Doygunluk Analizi",
      "30 günlük veri arşivi",
      "Öncelikli destek",
    ],
    allowedPaths: [
      "/dashboard",
      "/dashboard/trending-videos",
      "/dashboard/hashtags",
      "/dashboard/sounds",
      "/dashboard/posting-times",
      "/dashboard/creators",
      "/dashboard/hook-library",
      "/dashboard/sentiment",
      "/dashboard/ideas",
      "/dashboard/growth",
      "/dashboard/predictions",
      "/dashboard/hooks",
      "/dashboard/reports",
      "/dashboard/daily-report",
      "/dashboard/competitor",
    ],
    badge: "Kurumsal",
    badgeColor: "text-amber-400",
  },
};

export const NICHES = [
  "Kozmetik",
  "Teknoloji",
  "Moda",
  "Yemek",
  "Eğitim",
  "Fitness",
  "Oyun",
  "Seyahat",
  "Müzik",
  "Finans",
  "Sağlık",
  "Diğer",
] as const;

export type Niche = (typeof NICHES)[number];

export function getPlanConfig(planType: PlanType): PlanConfig {
  return PLANS[planType] || PLANS.free;
}

export function canAccessPath(planType: PlanType, path: string): boolean {
  const plan = getPlanConfig(planType);
  // Admin always has access
  // Check exact match or startsWith for dynamic routes
  return plan.allowedPaths.some(
    (p) => path === p || path.startsWith(p + "/")
  );
}

export function getRetentionDays(planType: PlanType): number {
  return getPlanConfig(planType).retentionDays;
}
