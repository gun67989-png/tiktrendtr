import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trending TikTok Hashtags in Turkey | TikTrendTR",
  description:
    "Discover trending TikTok hashtags in Turkey with detailed statistics. Video counts, average views, growth rates, and emerging hashtags updated daily.",
  keywords: [
    "trending tiktok hashtags turkey",
    "tiktok hashtag turkiye",
    "trend hashtag tiktok",
    "populer tiktok hashtagleri",
    "tiktok kesfet hashtag",
    "en populer tiktok hashtagleri turkiye",
    "tiktok hashtag istatistikleri",
  ],
  openGraph: {
    title: "Trending TikTok Hashtags in Turkey | TikTrendTR",
    description:
      "Discover trending TikTok hashtags in Turkey with video counts, average views, and growth rates.",
    type: "website",
    locale: "tr_TR",
    siteName: "TikTrendTR",
  },
  alternates: {
    canonical: "/trending-hashtags-turkey",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
