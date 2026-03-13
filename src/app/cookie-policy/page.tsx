"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LogoLink from "@/components/LogoLink";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <LogoLink size="sm" />
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2">Giris Yap</Link>
            <Link href="/register" className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors font-medium">Ucretsiz Basla</Link>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-3 h-3" /> Ana Sayfaya Don
          </Link>

          <h1 className="text-3xl font-bold mb-2">Cerez Politikasi</h1>
          <p className="text-xs text-muted-foreground mb-10">Son guncelleme: 11 Mart 2026</p>

          <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">1. Cerez Nedir?</h2>
              <p>
                Cerezler, web sitelerinin tarayiciniza gonderdigI kucuk metin dosyalaridir.
                Tarayicinizda saklanir ve siteyi tekrar ziyaret ettiginizde sizi tanimamiza yardimci olur.
                Cerezler, site deneyiminizi kisisellestirmek, oturum yonetimi saglamak ve platform
                performansini analiz etmek icin kullanilir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">2. Kullandigimiz Cerez Turleri</h2>

              <div className="space-y-4 mt-3">
                <div className="bg-card border border-border rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Zorunlu Cerezler</h3>
                  <p className="text-xs text-muted-foreground mb-2">Platformun temel islevleri icin gereklidir. Devre disi birakilamaz.</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Cerez</th>
                          <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Amac</th>
                          <th className="text-left py-2 text-muted-foreground font-medium">Sure</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/50">
                          <td className="py-2 pr-4 font-mono text-foreground">session</td>
                          <td className="py-2 pr-4">Kullanici oturumu yonetimi (JWT token)</td>
                          <td className="py-2">7 gun</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Performans Cerezleri</h3>
                  <p className="text-xs text-muted-foreground mb-2">Platformun performansini olcmemize ve iyilestirmemize yardimci olur.</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Cerez</th>
                          <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Amac</th>
                          <th className="text-left py-2 text-muted-foreground font-medium">Sure</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/50">
                          <td className="py-2 pr-4 font-mono text-foreground">_analytics</td>
                          <td className="py-2 pr-4">Sayfa ziyaret istatistikleri</td>
                          <td className="py-2">30 gun</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Tercih Cerezleri</h3>
                  <p className="text-xs text-muted-foreground mb-2">Tercihlerinizi hatirlamak icin kullanilir.</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Cerez</th>
                          <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Amac</th>
                          <th className="text-left py-2 text-muted-foreground font-medium">Sure</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/50">
                          <td className="py-2 pr-4 font-mono text-foreground">cookie_consent</td>
                          <td className="py-2 pr-4">Cerez tercih ayarlariniz</td>
                          <td className="py-2">365 gun</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">3. Cerezleri Yonetme</h2>
              <p>
                Tarayici ayarlarinizdan cerezleri yonetebilir, silebilir veya engelleyebilirsiniz.
                Ancak zorunlu cerezleri devre disi birakmaniz platformun duzgun calismasini
                engelleyebilir. Asagida populer tarayicilar icin cerez ayarlari baglantilari bulunmaktadir:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                <li>Google Chrome: Ayarlar &gt; Gizlilik ve Guvenlik &gt; Cerezler</li>
                <li>Mozilla Firefox: Ayarlar &gt; Gizlilik ve Guvenlik</li>
                <li>Safari: Tercihler &gt; Gizlilik</li>
                <li>Microsoft Edge: Ayarlar &gt; Cerezler ve Site Izinleri</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">4. Ucuncu Taraf Cerezleri</h2>
              <p>
                Platformumuzda ucuncu taraf analitik veya reklam cerezleri kullanilmamaktadir.
                Gelecekte ucuncu taraf cerezleri eklenmesi durumunda bu politika guncellenecek
                ve sizden ayrica onay alinacaktir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">5. Yasal Dayanak</h2>
              <p>
                Cerez kullanimamiz, 6698 sayili KVKK, 5809 sayili Elektronik Haberlesme Kanunu
                ve Avrupa Birligi ePrivacy Yonergesi ile uyumludur. Zorunlu cerezler disindaki
                cerezler icin acik rizaniz alinmaktadir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">6. Degisiklikler</h2>
              <p>
                Bu Cerez Politikasi zaman zaman guncellenebilir. Degisiklikler bu sayfada yayinlanacaktir.
                Onemli degisiklikler icin ayrica bildirim yapilacaktir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">7. Iletisim</h2>
              <p>
                Cerez politikamiz hakkinda sorulariniz icin{" "}
                <Link href="/contact" className="text-primary hover:underline">iletisim formu</Link> uzerinden
                bize ulasabilirsiniz.
              </p>
            </section>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/privacy-policy" className="text-xs bg-card border border-border px-4 py-2 rounded-lg hover:border-primary/20 transition-colors">Gizlilik Politikası</Link>
            <Link href="/terms-of-service" className="text-xs bg-card border border-border px-4 py-2 rounded-lg hover:border-primary/20 transition-colors">Kullanım Şartları</Link>
            <Link href="/mesafeli-satis-sozlesmesi" className="text-xs bg-card border border-border px-4 py-2 rounded-lg hover:border-primary/20 transition-colors">Mesafeli Satış Sözleşmesi</Link>
            <Link href="/iptal-ve-iade" className="text-xs bg-card border border-border px-4 py-2 rounded-lg hover:border-primary/20 transition-colors">İptal ve İade</Link>
            <Link href="/contact" className="text-xs bg-card border border-border px-4 py-2 rounded-lg hover:border-primary/20 transition-colors">İletişim</Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Gizlilik Politikası</Link>
            <Link href="/terms-of-service" className="hover:text-foreground transition-colors">Kullanım Şartları</Link>
            <Link href="/mesafeli-satis-sozlesmesi" className="hover:text-foreground transition-colors">Mesafeli Satış Sözleşmesi</Link>
            <Link href="/iptal-ve-iade" className="hover:text-foreground transition-colors">İptal ve İade</Link>
            <Link href="/cookie-policy" className="hover:text-foreground transition-colors">Çerez Politikası</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">İletişim</Link>
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
