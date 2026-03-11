import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Viral TikTok Videos in Turkey Today | TikTrendTR",
  description:
    "Discover the most viral TikTok videos in Turkey today. View counts, creator profiles, hashtags, and direct links. Updated daily with fresh viral content.",
  keywords: [
    "viral tiktok videos turkey",
    "trending tiktok turkey",
    "viral tiktok videolar turkiye",
    "en cok izlenen tiktok videolari",
    "tiktok trend turkiye",
    "tiktok viral videos",
    "turkiye tiktok kesfet",
  ],
  openGraph: {
    title: "Top Viral TikTok Videos in Turkey Today | TikTrendTR",
    description:
      "Discover the most viral TikTok videos in Turkey. Updated daily with view counts, creators, and hashtags.",
    type: "website",
    locale: "tr_TR",
    siteName: "TikTrendTR",
  },
  alternates: {
    canonical: "/viral-tiktok-videos-turkey",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
