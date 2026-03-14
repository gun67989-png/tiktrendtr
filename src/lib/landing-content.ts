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

export interface LandingFAQ {
  question: string;
  answer: string;
}

export interface LandingContent {
  stats: LandingStats[];
  features: LandingFeature[];
  testimonials: LandingTestimonial[];
  plans: LandingPlan[];
  faq: LandingFAQ[];
}

/* ─── Defaults ─── */

export const defaultStats: LandingStats[] = [
  { value: "12+", label: "Trend Kategorisi" },
  { value: "70+", label: "Takip Edilen Anahtar Kelime" },
  { value: "6 Saatte Bir", label: "Veri G\u00FCncelleme" },
  { value: "AI Destekli", label: "Viral Analiz Motoru" },
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
    quote: "Trend analizleri sayesinde do\u011Fru zamanda do\u011Fru i\u00E7eri\u011Fi \u00FCretmeye ba\u015Flad\u0131m.",
    author: "Erken Kullan\u0131c\u0131",
    role: "\u0130\u00E7erik \u00DCretici",
    avatar: "E",
  },
  {
    quote: "Hangi hashtag\u2019lerin y\u00FCkseli\u015Fte oldu\u011Funu g\u00F6rmek i\u00E7erik planlamas\u0131n\u0131 \u00E7ok kolayla\u015Ft\u0131rd\u0131.",
    author: "Beta Kullan\u0131c\u0131",
    role: "TikTok Kreat\u00F6r\u00FC",
    avatar: "B",
  },
  {
    quote: "Viral skor \u00E7\u00F6z\u00FCmlemesi neyin neden tuttu\u011Funu anlamam\u0131 sa\u011Flad\u0131.",
    author: "Test Kullan\u0131c\u0131",
    role: "Dijital Pazarlamac\u0131",
    avatar: "T",
  },
  {
    quote: "Ses ve format trendlerini takip etmek art\u0131k \u00E7ok daha kolay.",
    author: "Pilot Kullan\u0131c\u0131",
    role: "Sosyal Medya Y\u00F6neticisi",
    avatar: "P",
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

export const defaultFAQ: LandingFAQ[] = [
  {
    question: "Valyze tam olarak ne yapar?",
    answer: "Valyze, T\u00FCrkiye odakl\u0131 TikTok trend analiz platformudur. Viral videolar\u0131, y\u00FCkselen hashtag\u2019leri, trend sesleri ve format de\u011Fi\u015Fikliklerini ger\u00E7ek verilerle takip eder. AI destekli viral skor hesaplamas\u0131 ile hangi i\u00E7eriklerin neden tuttu\u011Funu analiz eder.",
  },
  {
    question: "Veriler ne s\u0131kl\u0131kla g\u00FCncellenir?",
    answer: "Trend verileri 6 saatte bir otomatik olarak g\u00FCncellenir. Her g\u00FCncelleme d\u00F6ng\u00FCs\u00FCnde y\u00FCzlerce video, hashtag ve ses analiz edilir. Dashboard\u2019ta \u201CSon g\u00FCncelleme\u201D zaman damgas\u0131n\u0131 g\u00F6rebilirsiniz.",
  },
  {
    question: "Viral skor nas\u0131l hesaplan\u0131r?",
    answer: "Viral skor 5 fakt\u00F6r\u00FCn a\u011F\u0131rl\u0131kl\u0131 ortalamas\u0131d\u0131r: Etkile\u015Fim oran\u0131 (%35), g\u00F6r\u00FCnt\u00FClenme b\u00FCy\u00FCme h\u0131z\u0131 (%25), payla\u015F\u0131m oran\u0131 (%15), yorum aktivitesi (%15) ve g\u00FCncellik skoru (%10). Her fakt\u00F6r\u00FCn katk\u0131s\u0131n\u0131 \u201CViralite \u00C7\u00F6z\u00FCmlemesi\u201D panelinde g\u00F6rebilirsiniz.",
  },
  {
    question: "\u00DCcretsiz plan ile ne yapabilirim?",
    answer: "\u00DCcretsiz planda 7 g\u00FCnl\u00FCk veri eri\u015Fimi, s\u0131n\u0131rl\u0131 trend video analizi, temel hashtag verileri ve payla\u015F\u0131m zaman\u0131 \u00F6nerileri sunulur. Platformu ke\u015Ffetmek ve de\u011Ferini g\u00F6rmek i\u00E7in idealdir.",
  },
  {
    question: "Lite ile Standart plan aras\u0131ndaki fark nedir?",
    answer: "Lite plan aktif i\u00E7erik \u00FCreticileri i\u00E7in temel analiz ara\u00E7lar\u0131n\u0131 sunar (14 g\u00FCnl\u00FCk veri, s\u0131n\u0131rs\u0131z video analizi). Standart plan ise AI yorum analizi, AI i\u00E7erik fikirleri, b\u00FCy\u00FCme stratejisi, trend tahminleri ve hook performans analizi gibi ileri \u00F6zellikler ekler.",
  },
  {
    question: "Kurumsal plan kimlere uygun?",
    answer: "Kurumsal plan, markalar ve dijital ajanslar i\u00E7in tasarlanm\u0131\u015Ft\u0131r. Rakip sava\u015F odas\u0131, AI hook \u00FCretimi, PDF rapor d\u0131\u015Fa aktarma, trend doygunluk analizi ve \u00F6ncelikli teknik destek i\u00E7erir.",
  },
  {
    question: "\u00D6deme y\u00F6ntemleri nelerdir?",
    answer: "\u00D6demeler iyzico altyap\u0131s\u0131 \u00FCzerinden g\u00FCvenli \u015Fekilde al\u0131n\u0131r. Visa, Mastercard ve yerli banka kartlar\u0131 ile \u00F6deme yapabilirsiniz. T\u00FCm i\u015Flemler 256-bit SSL ile korunur.",
  },
  {
    question: "Abone olduktan sonra istedi\u011Fim zaman iptal edebilir miyim?",
    answer: "Evet, aboneli\u011Finizi istedi\u011Finiz zaman iptal edebilirsiniz. \u0130ptal i\u015Flemi an\u0131nda ger\u00E7ekle\u015Fir ve mevcut d\u00F6neminizin sonuna kadar eri\u015Fiminiz devam eder. Herhangi bir iptal \u00FCcreti al\u0131nmaz.",
  },
  {
    question: "TikTok hesab\u0131m\u0131 ba\u011Flamam gerekiyor mu?",
    answer: "Hay\u0131r, Valyze TikTok hesab\u0131n\u0131za ba\u011Flanmaz. Platform, kamuya a\u00E7\u0131k TikTok verilerini analiz eder. Hesap bilgilerinizi veya \u015Fifrenizi asla istemez.",
  },
  {
    question: "Hangi \u00FClkelerin verileri analiz ediliyor?",
    answer: "\u015Eu anda T\u00FCrkiye odakl\u0131 TikTok trendleri analiz edilmektedir. T\u00FCrkiye\u2019deki en pop\u00FCler kategoriler, hashtag\u2019ler, sesler ve formatlar takip edilir.",
  },
  {
    question: "AI i\u00E7erik fikirleri nas\u0131l \u00E7al\u0131\u015F\u0131r?",
    answer: "AI motoru g\u00FCncel trend verilerini analiz ederek ni\u015Finize uygun video fikirleri \u00F6nerir. \u00D6neriler g\u00FCncel hashtag\u2019ler, trend sesler ve y\u00FCksek performansl\u0131 formatlar baz al\u0131narak olu\u015Fturulur.",
  },
  {
    question: "Rakip analizi \u00F6zelli\u011Fi nas\u0131l \u00E7al\u0131\u015F\u0131r?",
    answer: "Rakip analizi ile belirli TikTok hesaplar\u0131n\u0131n performans\u0131n\u0131 inceleyebilirsiniz. Video s\u0131kl\u0131\u011F\u0131, etkile\u015Fim oranlar\u0131, en iyi performans g\u00F6steren i\u00E7erikler ve kulland\u0131klar\u0131 hashtag\u2019ler gibi metrikleri kar\u015F\u0131la\u015Ft\u0131rabilirsiniz.",
  },
  {
    question: "Hook k\u00FCt\u00FCphanesi nedir?",
    answer: "Hook k\u00FCt\u00FCphanesi, videolar\u0131n\u0131z\u0131n ilk saniyelerinde izleyiciyi yakalamak i\u00E7in kullanabilece\u011Finiz a\u00E7\u0131l\u0131\u015F c\u00FCmleleri ve teknikleri i\u00E7erir. Y\u00FCksek performansl\u0131 videolardan analiz edilen hook \u00F6r\u00FCnt\u00FCleri sunulur.",
  },
  {
    question: "Verileriniz ne kadar g\u00FCvenilir?",
    answer: "T\u00FCm veriler ger\u00E7ek TikTok i\u00E7eriklerinden toplan\u0131r ve do\u011Frulama s\u00FCrecinden ge\u00E7irilir. Ge\u00E7ersiz veya tutars\u0131z veriler otomatik olarak filtrelenir. Dashboard\u2019ta veri kayna\u011F\u0131 g\u00F6stergesi ile verinin canl\u0131 m\u0131 yoksa ge\u00E7ici olarak kullan\u0131lamaz m\u0131 oldu\u011Funu g\u00F6rebilirsiniz.",
  },
  {
    question: "Mobil cihazlardan kullanabilir miyim?",
    answer: "Evet, Valyze tam responsive tasar\u0131ma sahiptir. Telefon, tablet ve masa\u00FCst\u00FC dahil her cihazdan taray\u0131c\u0131 \u00FCzerinden eri\u015Febilirsiniz.",
  },
  {
    question: "Teknik destek nas\u0131l al\u0131r\u0131m?",
    answer: "T\u00FCm planlar e-posta deste\u011Fi i\u00E7erir. Kurumsal plan kullan\u0131c\u0131lar\u0131 \u00F6ncelikli teknik deste\u011Fe sahiptir. destek@valyze.app adresinden bize ula\u015Fabilirsiniz.",
  },
  {
    question: "Plan y\u00FCkseltme veya d\u00FC\u015F\u00FCrme yapabilir miyim?",
    answer: "Evet, istedi\u011Finiz zaman plan\u0131n\u0131z\u0131 y\u00FCkseltebilir veya d\u00FC\u015F\u00FCrebilirsiniz. Y\u00FCkseltme an\u0131nda ge\u00E7erli olur, d\u00FC\u015F\u00FCrme ise mevcut d\u00F6nemin sonunda uygulan\u0131r.",
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
      faq: defaultFAQ,
    };
  }

  try {
    const { data, error } = await supabase
      .from("landing_content")
      .select("id, content")
      .in("id", ["stats", "features", "testimonials", "plans", "faq"]);

    if (error || !data || data.length === 0) {
      return {
        stats: defaultStats,
        features: defaultFeatures,
        testimonials: defaultTestimonials,
        plans: defaultPlans,
        faq: defaultFAQ,
      };
    }

    const contentMap = new Map(data.map((row) => [row.id, row.content]));

    return {
      stats: contentMap.get("stats") ?? defaultStats,
      features: contentMap.get("features") ?? defaultFeatures,
      testimonials: contentMap.get("testimonials") ?? defaultTestimonials,
      plans: contentMap.get("plans") ?? defaultPlans,
      faq: contentMap.get("faq") ?? defaultFAQ,
    };
  } catch (e) {
    apiLogger.error({ err: e }, "Failed to fetch landing content");
    return {
      stats: defaultStats,
      features: defaultFeatures,
      testimonials: defaultTestimonials,
      plans: defaultPlans,
      faq: defaultFAQ,
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
