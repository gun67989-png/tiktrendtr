"use client";

import Link from "next/link";
import { FiTrendingUp, FiArrowLeft } from "react-icons/fi";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-red flex items-center justify-center">
              <FiTrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">TikTrend<span className="text-neon-red">TR</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors px-4 py-2">Giris Yap</Link>
            <Link href="/register" className="text-sm bg-neon-red text-white px-4 py-2 rounded-lg hover:bg-neon-red-light transition-colors font-medium">Ucretsiz Basla</Link>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors mb-6">
            <FiArrowLeft className="w-3 h-3" /> Ana Sayfaya Don
          </Link>

          <h1 className="text-3xl font-bold mb-2">Cerez Politikasi</h1>
          <p className="text-xs text-text-muted mb-10">Son guncelleme: 11 Mart 2026</p>

          <div className="space-y-8 text-sm text-text-secondary leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">1. Cerez Nedir?</h2>
              <p>
                Cerezler, web sitelerinin tarayiciniza gonderdigI kucuk metin dosyalaridir.
                Tarayicinizda saklanir ve siteyi tekrar ziyaret ettiginizde sizi tanimamiza yardimci olur.
                Cerezler, site deneyiminizi kisisellestirmek, oturum yonetimi saglamak ve platform
                performansini analiz etmek icin kullanilir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">2. Kullandigimiz Cerez Turleri</h2>

              <div className="space-y-4 mt-3">
                <div className="bg-surface border border-border rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-text-primary mb-1">Zorunlu Cerezler</h3>
                  <p className="text-xs text-text-secondary mb-2">Platformun temel islevleri icin gereklidir. Devre disi birakilamaz.</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 pr-4 text-text-muted font-medium">Cerez</th>
                          <th className="text-left py-2 pr-4 text-text-muted font-medium">Amac</th>
                          <th className="text-left py-2 text-text-muted font-medium">Sure</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/50">
                          <td className="py-2 pr-4 font-mono text-text-primary">session</td>
                          <td className="py-2 pr-4">Kullanici oturumu yonetimi (JWT token)</td>
                          <td className="py-2">7 gun</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-surface border border-border rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-text-primary mb-1">Performans Cerezleri</h3>
                  <p className="text-xs text-text-secondary mb-2">Platformun performansini olcmemize ve iyilestirmemize yardimci olur.</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 pr-4 text-text-muted font-medium">Cerez</th>
                          <th className="text-left py-2 pr-4 text-text-muted font-medium">Amac</th>
                          <th className="text-left py-2 text-text-muted font-medium">Sure</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/50">
                          <td className="py-2 pr-4 font-mono text-text-primary">_analytics</td>
                          <td className="py-2 pr-4">Sayfa ziyaret istatistikleri</td>
                          <td className="py-2">30 gun</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-surface border border-border rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-text-primary mb-1">Tercih Cerezleri</h3>
                  <p className="text-xs text-text-secondary mb-2">Tercihlerinizi hatirlamak icin kullanilir.</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 pr-4 text-text-muted font-medium">Cerez</th>
                          <th className="text-left py-2 pr-4 text-text-muted font-medium">Amac</th>
                          <th className="text-left py-2 text-text-muted font-medium">Sure</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/50">
                          <td className="py-2 pr-4 font-mono text-text-primary">cookie_consent</td>
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
              <h2 className="text-lg font-semibold text-text-primary mb-3">3. Cerezleri Yonetme</h2>
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
              <h2 className="text-lg font-semibold text-text-primary mb-3">4. Ucuncu Taraf Cerezleri</h2>
              <p>
                Platformumuzda ucuncu taraf analitik veya reklam cerezleri kullanilmamaktadir.
                Gelecekte ucuncu taraf cerezleri eklenmesi durumunda bu politika guncellenecek
                ve sizden ayrica onay alinacaktir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">5. Yasal Dayanak</h2>
              <p>
                Cerez kullanimamiz, 6698 sayili KVKK, 5809 sayili Elektronik Haberlesme Kanunu
                ve Avrupa Birligi ePrivacy Yonergesi ile uyumludur. Zorunlu cerezler disindaki
                cerezler icin acik rizaniz alinmaktadir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">6. Degisiklikler</h2>
              <p>
                Bu Cerez Politikasi zaman zaman guncellenebilir. Degisiklikler bu sayfada yayinlanacaktir.
                Onemli degisiklikler icin ayrica bildirim yapilacaktir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">7. Iletisim</h2>
              <p>
                Cerez politikamiz hakkinda sorulariniz icin{" "}
                <Link href="/contact" className="text-neon-red hover:underline">iletisim formu</Link> uzerinden
                bize ulasabilirsiniz.
              </p>
            </section>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/privacy-policy" className="text-xs bg-surface border border-border px-4 py-2 rounded-lg hover:border-neon-red/20 transition-colors">Gizlilik Politikasi</Link>
            <Link href="/terms-of-service" className="text-xs bg-surface border border-border px-4 py-2 rounded-lg hover:border-neon-red/20 transition-colors">Kullanim Sartlari</Link>
            <Link href="/contact" className="text-xs bg-surface border border-border px-4 py-2 rounded-lg hover:border-neon-red/20 transition-colors">Iletisim</Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-border py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-[10px] text-text-muted">&copy; 2026 TikTrendTR. Tum haklari saklidir.</p>
          <div className="flex gap-4 text-[10px] text-text-muted">
            <Link href="/privacy-policy" className="hover:text-text-primary transition-colors">Gizlilik</Link>
            <Link href="/terms-of-service" className="hover:text-text-primary transition-colors">Sartlar</Link>
            <Link href="/cookie-policy" className="hover:text-text-primary transition-colors">Cerezler</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
