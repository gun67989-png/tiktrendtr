"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Send,
  MessageCircle,
  AlertCircle,
  HelpCircle,
  CheckCircle,
  Mail,
} from "lucide-react";
import LogoLink from "@/components/LogoLink";

type Category = "destek" | "hata" | "oneri" | "diger";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<Category>("destek");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const categories: { value: Category; label: string; icon: React.ReactNode; desc: string }[] = [
    { value: "destek", label: "Destek", icon: <HelpCircle className="w-4 h-4" />, desc: "Hesap veya platform ile ilgili yardim" },
    { value: "hata", label: "Hata Bildirimi", icon: <AlertCircle className="w-4 h-4" />, desc: "Bug veya teknik sorun bildirin" },
    { value: "oneri", label: "Oneri", icon: <MessageCircle className="w-4 h-4" />, desc: "Yeni ozellik veya iyilestirme onerisi" },
    { value: "diger", label: "Diger", icon: <Mail className="w-4 h-4" />, desc: "Genel sorular ve is birligi" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;
    setSending(true);
    // Simulate sending
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <LogoLink />
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
              Giris Yap
            </Link>
            <Link href="/register" className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors font-medium">
              Ucretsiz Basla
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-teal" />
              </div>
              <h1 className="text-2xl font-bold mb-3">Mesajiniz Alindi!</h1>
              <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto">
                En kisa surede size donus yapacagiz. Genellikle 24 saat icerisinde yanitlariz.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-card border border-border text-foreground px-6 py-2.5 rounded-md hover:border-primary/30 transition-all text-sm font-medium"
              >
                Ana Sayfaya Don
              </Link>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10"
              >
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs px-4 py-1.5 rounded-full mb-4">
                  <MessageCircle className="w-3 h-3" />
                  Destek & Iletisim
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  Size Nasil{" "}
                  <span className="text-primary">Yardimci</span>{" "}
                  Olabiliriz?
                </h1>
                <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                  Sorun bildirin, oneri gonderenin veya yardim alin. Ekibimiz en kisa surede donus yapacaktir.
                </p>
              </motion.div>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Category selection */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-3 block">Konu</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {categories.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setCategory(cat.value)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-center ${
                          category === cat.value
                            ? "bg-primary/10 border-primary/30 text-primary"
                            : "bg-card border-border text-muted-foreground hover:border-primary/20"
                        }`}
                      >
                        {cat.icon}
                        <span className="text-xs font-medium">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Adiniz</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Adinizi girin"
                      required
                      className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">E-posta</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ornek@email.com"
                      required
                      className="w-full px-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Mesajiniz</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={
                      category === "hata"
                        ? "Lutfen hatayi detayli aciklayin. Hangi sayfada, ne yaptiginizda olustu?"
                        : category === "oneri"
                        ? "Onerinizi detayli aciklayin. Ne tur bir ozellik veya iyilestirme gormek istersiniz?"
                        : "Mesajinizi yazin..."
                    }
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={sending || !name.trim() || !email.trim() || !message.trim()}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-md font-medium text-sm hover:bg-primary/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {sending ? "Gonderiliyor..." : "Mesaj Gonder"}
                </button>
              </motion.form>

              {/* FAQ hints */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-12 bg-card border border-border rounded-xl p-6"
              >
                <h3 className="text-sm font-semibold mb-4">Sik Sorulan Sorular</h3>
                <div className="space-y-3">
                  {[
                    { q: "Pro plani nasil iptal edebilirim?", a: "Hesap ayarlarindan istediginiz zaman iptal edebilirsiniz." },
                    { q: "Veriler ne siklikla guncelleniyor?", a: "Viral videolar ve hashtag verileri her gun otomatik olarak guncellenir." },
                    { q: "Ucretsiz plan neleri kapsiyor?", a: "Sinirli video analizi, temel hashtag verisi ve trend paneli erisimi." },
                  ].map((faq) => (
                    <details key={faq.q} className="group">
                      <summary className="text-xs text-foreground cursor-pointer hover:text-primary transition-colors list-none flex items-center gap-2">
                        <HelpCircle className="w-3 h-3 text-muted-foreground shrink-0" />
                        {faq.q}
                      </summary>
                      <p className="text-xs text-muted-foreground mt-1 ml-5">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Gizlilik Politikası</Link>
            <Link href="/terms-of-service" className="hover:text-foreground transition-colors">Kullanım Şartları</Link>
            <Link href="/mesafeli-satis-sozlesmesi" className="hover:text-foreground transition-colors">Mesafeli Satış Sözleşmesi</Link>
            <Link href="/iptal-ve-iade" className="hover:text-foreground transition-colors">İptal ve İade</Link>
            <Link href="/cookie-policy" className="hover:text-foreground transition-colors">Çerez Politikası</Link>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground">&copy; 2026 Valyze TR. Tüm hakları saklıdır.</p>
            <p className="text-[10px] text-muted-foreground">destek@valyze.app</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
