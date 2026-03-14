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
      "7 günlük veri erişimi",
      "Trend video keşfi (sınırlı)",
      "Temel hashtag analizi",
      "Ses trendleri",
      "Paylaşım zamanı önerileri",
      "Trend niş & şehir verileri",
      "Viral format takibi",
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
      "14 günlük veri döngüsü",
      "Sınırsız trend video analizi",
      "Detaylı hashtag & ses analizi",
      "Paylaşım zamanı optimizasyonu",
      "Trend niş & şehir verileri",
      "Viral format analizi",
      "İçerik üretici takibi",
      "Sektörel Hook Kütüphanesi",
      "Viral skor çözümlemesi",
      "Canlı yükselen trendler",
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
      "4 haftalık veri arşivi",
      "Tüm Lite özellikleri dahil",
      "Duygu Analizi (Sentiment)",
      "AI destekli İçerik Fikirleri",
      "Büyüme Stratejisi önerileri",
      "Trend Tahminleri & erken uyarı",
      "Hook Performans Analizi",
      "Günlük Rapor paneli",
      "Kategori bazlı duygu haritası",
      "Yorum tonlama analizi",
      "Detaylı performans raporları",
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
    badge: "Standart",
    badgeColor: "text-teal",
  },
  enterprise: {
    id: "enterprise",
    name: "Kurumsal",
    price: 1250,
    retentionDays: 30,
    features: [
      "30 günlük veri arşivi",
      "Tüm Standart özellikleri dahil",
      "Rakip Analizi & Savaş Odası",
      "AI ile otomatik Hook Üretimi",
      "PDF Rapor dışa aktarma",
      "Trend Doygunluk Analizi",
      "Rakip içerik karşılaştırma",
      "Marka bazlı strateji önerileri",
      "Öncelikli teknik destek",
      "Özel dashboard görünümü",
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
