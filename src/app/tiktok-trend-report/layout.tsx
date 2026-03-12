import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TikTok Weekly Trend Report - Turkey | Valyze",
  description:
    "Weekly TikTok trend analysis for Turkey. Trending video formats, popular niches, best posting times, and fastest growing hashtags. Updated weekly.",
  keywords: [
    "tiktok trend report turkey",
    "tiktok haftalik rapor turkiye",
    "tiktok trend analizi",
    "tiktok en iyi paylasim zamani",
    "tiktok populer nisler turkiye",
    "tiktok trend video formatlari",
    "tiktok turkiye analiz",
  ],
  openGraph: {
    title: "TikTok Weekly Trend Report - Turkey | Valyze",
    description:
      "Weekly TikTok trend analysis for Turkey. Trending formats, popular niches, best posting times, and growing hashtags.",
    type: "website",
    locale: "tr_TR",
    siteName: "Valyze",
  },
  alternates: {
    canonical: "/tiktok-trend-report",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
