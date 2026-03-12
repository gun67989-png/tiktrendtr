import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kullanim Sartlari | Valyze",
  description: "Valyze kullanim sartlari. Platform kullanimi, abonelik, sorumluluklar ve yasal bilgiler.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
