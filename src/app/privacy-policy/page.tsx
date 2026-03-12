"use client";

import Link from "next/link";
import { FiTrendingUp, FiArrowLeft } from "react-icons/fi";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Navbar */}
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

          <h1 className="text-3xl font-bold mb-2">Gizlilik Politikasi</h1>
          <p className="text-xs text-text-muted mb-10">Son guncelleme: 11 Mart 2026</p>

          <div className="space-y-8 text-sm text-text-secondary leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">1. Genel Bakis</h2>
              <p>
                Valyze (&quot;Platform&quot;, &quot;biz&quot;, &quot;bizim&quot;) olarak kullanicilarimizin gizliligini korumaya buyuk onem veriyoruz.
                Bu Gizlilik Politikasi, platformumuzu kullandiginizda hangi kisisel verilerin toplandigini,
                nasil islendigini ve korundigunu aciklamaktadir.
              </p>
              <p className="mt-2">
                Platformumuzu kullanarak bu politikayi kabul etmis sayilirsiniz. 6698 sayili Kisisel Verilerin Korunmasi
                Kanunu (KVKK) ve Avrupa Birlig Genel Veri Koruma Tuzugu (GDPR) kapsaminda haklariniz saklidir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">2. Toplanan Veriler</h2>
              <p className="mb-2">Platformumuzu kullandiginizda asagidaki verileri toplayabiliriz:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong className="text-text-primary">Hesap Bilgileri:</strong> Kullanici adi, e-posta adresi, sifre (sifreli olarak saklanir)</li>
                <li><strong className="text-text-primary">Abonelik Bilgileri:</strong> Plan turu, abonelik baslangic ve bitis tarihleri</li>
                <li><strong className="text-text-primary">Kullanim Verileri:</strong> Platform icerisindeki etkilesimleriniz, ziyaret ettiginiz sayfalar</li>
                <li><strong className="text-text-primary">Cihaz Bilgileri:</strong> IP adresi, tarayici turu, isletim sistemi</li>
                <li><strong className="text-text-primary">Cerez Verileri:</strong> Oturum cerezleri ve tercih cerezleri</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">3. Verilerin Kullanim Amaci</h2>
              <p className="mb-2">Toplanan veriler asagidaki amaclarla kullanilmaktadir:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Hesabinizin olusturulmasi ve yonetimi</li>
                <li>Platformun islevselliginin saglanmasi ve iyilestirilmesi</li>
                <li>Abonelik ve odeme islemlerinin yonetimi</li>
                <li>Musteri destegi saglanmasi</li>
                <li>Platform guvenliginin saglanmasi ve dolandiricilik onlenmesi</li>
                <li>Yasal yukumluluklerin yerine getirilmesi</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">4. Veri Guvenligi</h2>
              <p>
                Kisisel verileriniz endustri standardlarinda guvenlik onlemleriyle korunmaktadir.
                Sifreleriniz bcrypt algoritmasi ile hashlenerek saklanir. Oturum yonetimi JWT (JSON Web Token)
                teknolojisi ile gerceklestirilir ve httpOnly cerezler kullanilir. Veritabanimiz SSL/TLS
                sifreleme ile korunmaktadir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">5. Ucuncu Taraf Paylasimi</h2>
              <p>
                Kisisel verileriniz ucuncu taraflarla pazarlama amaciyla paylasilmaz. Verileriniz yalnizca
                asagidaki durumlarda paylasilabilir:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                <li>Yasal zorunluluk halinde yetkili makamlarla</li>
                <li>Odeme islemleri icin odeme saglayicilariyla (sifrelenmis olarak)</li>
                <li>Platform altyapisi icin bulut hizmet saglayicilariyla (veri isleme sozlesmesi kapsaminda)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">6. KVKK Kapsamindaki Haklariniz</h2>
              <p className="mb-2">6698 sayili KVKK kapsaminda asagidaki haklara sahipsiniz:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Kisisel verilerinizin islenip islenmedigini ogrenme</li>
                <li>Islenmisse buna iliskin bilgi talep etme</li>
                <li>Isleme amacini ve amacina uygun kullanilip kullanilmadigini ogrenme</li>
                <li>Eksik veya yanlis islenmisse duzeltilmesini isteme</li>
                <li>KVKK&apos;nin 7. maddesinde ongorten sartlar cercevesinde silinmesini isteme</li>
                <li>Islenen verilerin munhasiran otomatik sistemler vasitasiyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya cikmasina itiraz etme</li>
              </ul>
              <p className="mt-2">
                Bu haklarinizi kullanmak icin <Link href="/contact" className="text-neon-red hover:underline">iletisim sayfamiz</Link> uzerinden bize ulasabilirsiniz.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">7. Veri Saklama Suresi</h2>
              <p>
                Kisisel verileriniz, hesabiniz aktif oldugu surece veya yasal zorunluluklar gerektirdigi
                surece saklanir. Hesabinizi silmeniz halinde verileriniz 30 gun icerisinde kalici olarak
                silinir. Yasal saklama yukumlulugune tabi veriler ilgili sure boyunca muhafaza edilir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">8. Degisiklikler</h2>
              <p>
                Bu Gizlilik Politikasi zaman zaman guncellenebilir. Onemli degisiklikler yapildiginda
                e-posta veya platform ici bildirim yoluyla bilgilendirilirsiniz. Politikayi duzenli olarak
                kontrol etmenizi oneririz.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">9. Iletisim</h2>
              <p>
                Gizlilik politikamiz hakkinda sorulariniz icin{" "}
                <Link href="/contact" className="text-neon-red hover:underline">iletisim formu</Link> uzerinden
                bize ulasabilirsiniz.
              </p>
            </section>
          </div>

          {/* Related links */}
          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/terms-of-service" className="text-xs bg-surface border border-border px-4 py-2 rounded-lg hover:border-neon-red/20 transition-colors">Kullanim Sartlari</Link>
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
