import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iletisim & Destek | Valyze",
  description: "Valyze destek ekibiyle iletisime gecin. Sorun bildirin, oneri gonderin veya yardim alin.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
