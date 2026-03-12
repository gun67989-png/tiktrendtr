import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cerez Politikasi | Valyze",
  description: "Valyze cerez politikasi. Kullanilan cerez turleri, amaclari ve yonetim secenekleri hakkinda bilgi.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
