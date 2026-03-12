"use client";

import Link from "next/link";
import { FiTrendingUp, FiArrowLeft } from "react-icons/fi";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-red flex items-center justify-center">
              <FiTrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">Val<span className="text-neon-red">yze</span></span>
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

          <h1 className="text-3xl font-bold mb-2">Kullanim Sartlari</h1>
          <p className="text-xs text-text-muted mb-10">Son guncelleme: 11 Mart 2026</p>

          <div className="space-y-8 text-sm text-text-secondary leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">1. Kabul ve Onay</h2>
              <p>
                Valyze platformuna kayit olarak veya platformu kullanarak bu Kullanim Sartlarini
                kabul etmis sayilirsiniz. Bu sartlari kabul etmiyorsaniz platformu kullanamazsiniz.
                Platform 18 yas ve uzeri kullanicilar icindir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">2. Hizmet Tanimi</h2>
              <p>
                Valyze, TikTok platformundaki trend verileri analiz eden bir SaaS (Software as a Service)
                platformudur. Sunulan hizmetler:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                <li>TikTok video trend analizi ve viral video veritabani</li>
                <li>Hashtag istatistikleri ve buyume analizleri</li>
                <li>Haftalik trend raporlari</li>
                <li>Icerik onerisi ve strateji araclari (Pro plan)</li>
                <li>Rakip analizi ve tahmin araclari (Pro plan)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">3. Hesap Sorumlulugu</h2>
              <p>Kullanicilar asagidaki sorumluluklara sahiptir:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                <li>Hesap bilgilerinizin dogrulugunu ve guncelligini saglamak</li>
                <li>Sifrenizin guvenligini korumak ve ucuncu kisilerle paylasimamak</li>
                <li>Hesabinizdaki tum etkinliklerden sorumlu olmak</li>
                <li>Yetkisiz erisim suphesi durumunda derhal bizi bilgilendirmek</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">4. Abonelik ve Odeme</h2>
              <p><strong className="text-text-primary">Ucretsiz Plan:</strong> Sinirli ozelliklere erisim saglayan ucretsiz plandir. Kredi karti gerektirmez.</p>
              <p className="mt-2"><strong className="text-text-primary">Pro Plan:</strong> Aylik $19 ucretli abonelik planidir. Tum premium ozelliklere erisim saglar.</p>
              <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                <li>Abonelikler aylik olarak faturalandirilir</li>
                <li>Iptal islemi bir sonraki fatura donemi icin gecerli olur</li>
                <li>Kismi donem iadesi yapilmaz</li>
                <li>Fiyat degisiklikleri en az 30 gun oncesinden bildirilir</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">5. Kabul Edilebilir Kullanim</h2>
              <p className="mb-2">Platformu kullanirken asagidaki kurallara uymalisiniz:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Platformu yalnizca yasal amaclarla kullanmak</li>
                <li>Diger kullanicilarin haklarini ihlal etmemek</li>
                <li>Platforma zarar verecek yazilim veya bot kullanmamak</li>
                <li>API&apos;leri izinsiz veya asiri sekilde kullanmamak</li>
                <li>Platformdaki verileri toplu olarak kopyalamamak veya yeniden yayinlamamak</li>
                <li>Yaniltici veya sahte hesap bilgileri kullanmamak</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">6. Fikri Mulkiyet</h2>
              <p>
                Platform tasarimi, kodu, logosu, icerik ve analizleri Valyze&apos;nin fikri mulkiyetidir.
                Platformdaki analiz verileri kisisel ve ticari icerik stratejiniz icin kullanilabilir, ancak
                verilerin toplu olarak kopyalanmasi, yeniden yayinlanmasi veya satilmasi yasaktir.
                TikTok markalari ve verileri ilgili hak sahiplerine aittir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">7. Sorumluluk Sinirlamasi</h2>
              <p>
                Valyze, sunulan analizlerin ve tahminlerin dogrulugunu garanti etmez. Platform
                &quot;oldugu gibi&quot; sunulmaktadir. Platformun kullanimindan dogan dolayli, ozel veya sonuc
                olarak ortaya cikan zararlardan sorumlu degiliz. TikTok&apos;un API veya politika
                degisikliklerinden kaynaklanabilecek hizmet kesintilerinden sorumlulugumuz bulunmamaktadir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">8. Hesap Askiya Alma ve Fesih</h2>
              <p>Asagidaki durumlarda hesabinizi askiya alabilir veya feshedebiliriz:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                <li>Kullanim sartlarinin ihlali</li>
                <li>Platform guvenligini tehdit eden etkinlikler</li>
                <li>Odeme yukulumlugune uyulmamasi</li>
                <li>Uzun sureli hareketsizlik (12 aydan fazla)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">9. Degisiklikler</h2>
              <p>
                Bu Kullanim Sartlarini herhangi bir zamanda degistirme hakkimizi sakli tutariz.
                Onemli degisiklikler e-posta veya platform ici bildirim yoluyla duyurulur.
                Degisikliklerden sonra platformu kullanmaya devam etmeniz, yeni sartlari kabul
                ettiginiz anlamina gelir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">10. Uygulanacak Hukuk</h2>
              <p>
                Bu Kullanim Sartlari Turkiye Cumhuriyeti kanunlarina tabidir. Herhangi bir uyusmazlik
                durumunda Istanbul Mahkemeleri ve Icra Daireleri yetkilidir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">11. Iletisim</h2>
              <p>
                Kullanim sartlari hakkinda sorulariniz icin{" "}
                <Link href="/contact" className="text-neon-red hover:underline">iletisim formu</Link> uzerinden
                bize ulasabilirsiniz.
              </p>
            </section>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/privacy-policy" className="text-xs bg-surface border border-border px-4 py-2 rounded-lg hover:border-neon-red/20 transition-colors">Gizlilik Politikasi</Link>
            <Link href="/cookie-policy" className="text-xs bg-surface border border-border px-4 py-2 rounded-lg hover:border-neon-red/20 transition-colors">Cerez Politikasi</Link>
            <Link href="/contact" className="text-xs bg-surface border border-border px-4 py-2 rounded-lg hover:border-neon-red/20 transition-colors">Iletisim</Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-border py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-[10px] text-text-muted">&copy; 2026 Valyze. Tum haklari saklidir.</p>
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
