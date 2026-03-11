import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikasi | TikTrendTR",
  description: "TikTrendTR gizlilik politikasi. KVKK ve GDPR uyumlu veri koruma politikamiz hakkinda bilgi edinin.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
