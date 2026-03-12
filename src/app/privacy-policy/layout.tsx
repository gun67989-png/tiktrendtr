import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikasi | Valyze",
  description: "Valyze gizlilik politikasi. KVKK ve GDPR uyumlu veri koruma politikamiz hakkinda bilgi edinin.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
