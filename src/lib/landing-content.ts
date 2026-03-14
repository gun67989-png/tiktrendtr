import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { apiLogger } from "@/lib/logger";

/* ─── Types ─── */

export interface LandingStats {
  value: string;
  label: string;
}

export interface LandingTestimonial {
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

export interface LandingPlan {
  id: string;
  name: string;
  desc: string;
  price: number;
  popular: boolean;
  accent: string;
  btnClass: string;
  btnText: string;
  href: string;
  features: string[];
}

export interface LandingFeature {
  iconName: string;
  title: string;
  desc: string;
  color: string;
  bg: string;
}

export interface LandingContent {
  stats: LandingStats[];
  features: LandingFeature[];
  testimonials: LandingTestimonial[];
  plans: LandingPlan[];
}

/* ─── Defaults ─── */

export const defaultStats: LandingStats[] = [
  { value: "50K+", label: "Analiz Edilen Video" },
  { value: "12K+", label: "Aktif Hashtag" },
  { value: "3K+", label: "\u00DCretici" },
  { value: "99.9%", label: "Uptime" },
];

export const defaultFeatures: LandingFeature[] = [
  {
    iconName: "TrendingUp",
    title: "Viral Video Tespiti",
    desc: "Viral olma potansiyeli ta\u015F\u0131yan videolar\u0131 herkes fark etmeden tespit edin.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    iconName: "Hash",
    title: "Hashtag Analizi",
    desc: "Y\u00FCksek performansl\u0131 hashtag\u2019leri ke\u015Ffedin, b\u00FCy\u00FCme h\u0131zlar\u0131n\u0131 takip edin.",
    color: "text-teal",
    bg: "bg-teal/10",
  },
  {
    iconName: "Music",
    title: "Ses Trend Analizi",
    desc: "Trend olan sesleri erken yakalay\u0131p i\u00E7eri\u011Finizde kullan\u0131n.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    iconName: "Clock",
    title: "Payla\u015F\u0131m Zaman\u0131",
    desc: "Hedef kitlenizin en aktif oldu\u011Fu saatleri analiz edin.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    iconName: "Zap",
    title: "AI \u0130\u00E7erik Fikirleri",
    desc: "AI destekli \u00F6nerilerle trend konulara uygun video fikirleri al\u0131n.",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
  {
    iconName: "Target",
    title: "Rakip Analizi",
    desc: "Rakiplerinizin performans\u0131n\u0131 takip edin, stratejinizi optimize edin.",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
];

export const defaultTestimonials: LandingTestimonial[] = [
  {
    quote: "Hangi videolar\u0131n viral oldu\u011Funu art\u0131k biliyorum. \u0130\u00E7erik stratejim tamamen de\u011Fi\u015Fti!",
    author: "Elif K.",
    role: "\u0130\u00E7erik \u00DCretici \u00B7 250K Takip\u00E7i",
    avatar: "E",
  },
  {
    quote: "Saatlerce ara\u015Ft\u0131rma yapmaktan kurtard\u0131lar. Neyin tutaca\u011F\u0131n\u0131 \u00F6nceden biliyorum.",
    author: "Ahmet D.",
    role: "TikTok Kreat\u00F6r\u00FC \u00B7 180K Takip\u00E7i",
    avatar: "A",
  },
  {
    quote: "Rakip analizi \u00F6zelli\u011Fi tek ba\u015F\u0131na plan almaya de\u011Fer. \u00C7ok memnunum.",
    author: "Selin M.",
    role: "Dijital Pazarlamac\u0131",
    avatar: "S",
  },
  {
    quote: "AI i\u00E7erik fikirleri harika. Her g\u00FCn ne payla\u015Faca\u011F\u0131m\u0131 d\u00FC\u015F\u00FCnmek zorunda kalm\u0131yorum.",
    author: "Can T.",
    role: "E-ticaret Uzman\u0131",
    avatar: "C",
  },
];

export const defaultPlans: LandingPlan[] = [
  {
    id: "free",
    name: "\u00DCcretsiz",
    desc: "Platformu ke\u015Ffet",
    price: 0,
    popular: false,
    accent: "border-border",
    btnClass: "bg-card border border-border text-foreground hover:bg-muted",
    btnText: "\u00DCcretsiz Ba\u015Fla",
    href: "/register",
    features: [
      "7 g\u00FCnl\u00FCk veri eri\u015Fimi",
      "S\u0131n\u0131rl\u0131 trend video analizi",
      "Temel hashtag verileri",
      "Ses trendleri (s\u0131n\u0131rl\u0131)",
      "Payla\u015F\u0131m zaman\u0131 \u00F6nerileri",
    ],
  },
  {
    id: "lite",
    name: "Bireysel Lite",
    desc: "Aktif i\u00E7erik \u00FCreticileri",
    price: 280,
    popular: false,
    accent: "border-blue-400/30",
    btnClass: "bg-blue-500 text-white hover:bg-blue-600",
    btnText: "Lite Ba\u015Fla",
    href: "/pricing",
    features: [
      "14 g\u00FCnl\u00FCk veri d\u00F6ng\u00FCs\u00FC",
      "S\u0131n\u0131rs\u0131z trend video analizi",
      "Detayl\u0131 hashtag & ses analizi",
      "\u0130\u00E7erik \u00FCretici takibi",
      "Hook k\u00FCt\u00FCphanesi",
      "Viral skor \u00E7\u00F6z\u00FCmlemesi",
    ],
  },
  {
    id: "standard",
    name: "Bireysel Standart",
    desc: "Profesyonel \u00FCreticiler",
    price: 350,
    popular: true,
    accent: "border-teal/40",
    btnClass: "bg-teal text-white hover:bg-teal/90",
    btnText: "Standart Ba\u015Fla",
    href: "/pricing",
    features: [
      "4 haftal\u0131k veri ar\u015Fivi",
      "T\u00FCm Lite \u00F6zellikleri",
      "AI yorum analizi (Sentiment)",
      "AI i\u00E7erik fikirleri",
      "B\u00FCy\u00FCme stratejisi",
      "Trend tahminleri",
      "Hook performans analizi",
      "G\u00FCnl\u00FCk & detayl\u0131 raporlar",
      "Rakip yorum kar\u015F\u0131la\u015Ft\u0131rma",
    ],
  },
  {
    id: "enterprise",
    name: "Kurumsal",
    desc: "Markalar & ajanslar",
    price: 1250,
    popular: false,
    accent: "border-amber-400/30",
    btnClass: "bg-amber-500 text-white hover:bg-amber-600",
    btnText: "Kurumsal Ba\u015Fla",
    href: "/pricing",
    features: [
      "30 g\u00FCnl\u00FCk veri ar\u015Fivi",
      "T\u00FCm Standart \u00F6zellikleri",
      "Rakip sava\u015F odas\u0131",
      "AI hook \u00FCretimi",
      "PDF rapor d\u0131\u015Fa aktarma",
      "Trend doygunluk analizi",
      "Marka stratejisi \u00F6nerileri",
      "\u00D6ncelikli teknik destek",
    ],
  },
];

/* ─── Fetch ─── */

export async function getLandingContent(): Promise<LandingContent> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      stats: defaultStats,
      features: defaultFeatures,
      testimonials: defaultTestimonials,
      plans: defaultPlans,
    };
  }

  try {
    const { data, error } = await supabase
      .from("landing_content")
      .select("id, content")
      .in("id", ["stats", "features", "testimonials", "plans"]);

    if (error || !data || data.length === 0) {
      return {
        stats: defaultStats,
        features: defaultFeatures,
        testimonials: defaultTestimonials,
        plans: defaultPlans,
      };
    }

    const contentMap = new Map(data.map((row) => [row.id, row.content]));

    return {
      stats: contentMap.get("stats") ?? defaultStats,
      features: contentMap.get("features") ?? defaultFeatures,
      testimonials: contentMap.get("testimonials") ?? defaultTestimonials,
      plans: contentMap.get("plans") ?? defaultPlans,
    };
  } catch (e) {
    apiLogger.error({ err: e }, "Failed to fetch landing content");
    return {
      stats: defaultStats,
      features: defaultFeatures,
      testimonials: defaultTestimonials,
      plans: defaultPlans,
    };
  }
}

/* ─── Upsert (admin) ─── */

export async function upsertLandingContent(
  id: string,
  content: unknown
): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false;

  try {
    const { error } = await supabase
      .from("landing_content")
      .upsert(
        { id, content, updated_at: new Date().toISOString() },
        { onConflict: "id" }
      );

    if (error) {
      apiLogger.error({ err: error }, "Failed to upsert landing content");
      return false;
    }
    return true;
  } catch (e) {
    apiLogger.error({ err: e }, "Failed to upsert landing content");
    return false;
  }
}
