"use client";

import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import LogoLink from "@/components/LogoLink";

export default function MesafeliSatisSozlesmesiPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <LogoLink size="sm" />
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors px-4 py-2">Giriş Yap</Link>
            <Link href="/register" className="text-sm bg-neon-red text-white px-4 py-2 rounded-lg hover:bg-neon-red-light transition-colors font-medium">Ücretsiz Başla</Link>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors mb-6">
            <FiArrowLeft className="w-3 h-3" /> Ana Sayfaya Dön
          </Link>

          <h1 className="text-3xl font-bold mb-2">Mesafeli Satış Sözleşmesi</h1>
          <p className="text-xs text-text-muted mb-10">Son güncelleme: 13 Mart 2026</p>

          <div className="space-y-8 text-sm text-text-secondary leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">1. Taraflar</h2>
              <p><strong className="text-text-primary">SATICI:</strong></p>
              <ul className="list-none space-y-1 ml-2 mt-2">
                <li>Unvan: Valyze Yazılım Teknoloji</li>
                <li>Adres: İstanbul, Türkiye</li>
                <li>E-posta: destek@valyze.app</li>
                <li>Web: https://valyze.vercel.app</li>
              </ul>
              <p className="mt-3"><strong className="text-text-primary">ALICI:</strong></p>
              <p className="mt-1">Platformda kayıt olarak satın alma işlemi gerçekleştiren kullanıcı. Alıcı bilgileri kayıt ve ödeme esnasında temin edilmektedir.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">2. Sözleşmenin Konusu</h2>
              <p>
                İşbu sözleşme, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince,
                Alıcı&apos;nın Satıcı&apos;ya ait valyze.vercel.app internet sitesi üzerinden elektronik ortamda satın aldığı
                dijital hizmet aboneliğinin satışı ile ilgili tarafların hak ve yükümlülüklerini düzenler.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">3. Sözleşme Konusu Hizmet</h2>
              <p className="mb-2">Satışa konu dijital hizmetin özellikleri:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong className="text-text-primary">Hizmet Adı:</strong> Valyze TR - TikTok Trend Analiz Platformu</li>
                <li><strong className="text-text-primary">Hizmet Türü:</strong> SaaS (Hizmet Olarak Yazılım) - Dijital abonelik hizmeti</li>
                <li><strong className="text-text-primary">Pro Plan Ücreti:</strong> Aylık 299 TL (KDV dahil)</li>
                <li><strong className="text-text-primary">Ücretsiz Plan:</strong> Sınırlı özelliklere erişim, ücret alınmaz</li>
              </ul>
              <p className="mt-3">Pro Plan kapsamında sunulan hizmetler:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 mt-1">
                <li>Sınırsız trend analizi ve viral video veritabanı</li>
                <li>Gelişmiş hashtag istatistikleri ve büyüme analizleri</li>
                <li>AI destekli içerik önerileri ve strateji araçları</li>
                <li>Rakip analizi ve performans tahmin araçları</li>
                <li>Detaylı haftalık ve aylık raporlar</li>
                <li>Öncelikli müşteri desteği</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">4. Hizmet Bedeli ve Ödeme</h2>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Pro Plan ücreti aylık 299 TL&apos;dir ve KDV dahildir.</li>
                <li>Ödeme, iyzico güvenli ödeme altyapısı üzerinden kredi kartı/banka kartı ile gerçekleştirilir.</li>
                <li>Abonelik her ay otomatik olarak yenilenir.</li>
                <li>Fiyat değişiklikleri en az 30 gün öncesinden e-posta ile bildirilir.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">5. Hizmetin İfası ve Teslimat</h2>
              <p>
                Dijital hizmet, ödemenin onaylanmasının ardından derhal kullanıma açılır.
                Pro Plan özellikleri, ödeme işleminin tamamlanmasından itibaren hesabınızda aktif hale gelir.
                Hizmet, internet üzerinden 7/24 erişilebilir olarak sunulmaktadır.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">6. Cayma Hakkı</h2>
              <p>
                6502 sayılı Kanun&apos;un 53/ğ maddesi ve Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15/ğ maddesi gereğince,
                elektronik ortamda anında ifa edilen hizmetler ve tüketiciye anında teslim edilen gayri maddi mallarda
                cayma hakkı kullanılamaz.
              </p>
              <p className="mt-2">
                Bununla birlikte, Valyze olarak müşteri memnuniyetine önem veriyoruz. İlk kez abone olan kullanıcılar,
                abonelik başlangıcından itibaren <strong className="text-text-primary">7 gün içinde</strong> destek@valyze.app
                adresine yazılı başvuru yaparak iade talep edebilirler. Detaylı bilgi için{" "}
                <Link href="/iptal-ve-iade" className="text-neon-red hover:underline">İptal ve İade Koşulları</Link> sayfamızı
                inceleyebilirsiniz.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">7. Genel Hükümler</h2>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Alıcı, satın alma işlemi öncesinde sözleşme konusu hizmete ilişkin tüm bilgileri okuduğunu ve kabul ettiğini beyan eder.</li>
                <li>Satıcı, hizmet kalitesini artırmak amacıyla hizmet içeriğinde değişiklik yapma hakkını saklı tutar.</li>
                <li>Alıcı bilgileri gizlilik politikamız çerçevesinde korunur.</li>
                <li>İşbu sözleşme, Alıcı tarafından elektronik ortamda onaylandığı tarihte yürürlüğe girer.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">8. Uyuşmazlık Çözümü</h2>
              <p>
                İşbu sözleşmeden kaynaklanan uyuşmazlıklarda Türkiye Cumhuriyeti kanunları uygulanır.
                Tüketici şikayetlerinde, satış bedelinin ilgili yıla ait tüketici hakem heyetlerine
                başvuru sınırının altında veya üstünde olmasına göre, Alıcı&apos;nın ikamet ettiği yerdeki
                Tüketici Hakem Heyetleri veya Tüketici Mahkemeleri yetkilidir.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-text-primary mb-3">9. İletişim</h2>
              <p>Sözleşmeyle ilgili her türlü soru ve talepleriniz için:</p>
              <ul className="list-none space-y-1 ml-2 mt-2">
                <li><strong className="text-text-primary">E-posta:</strong> destek@valyze.app</li>
                <li><strong className="text-text-primary">Web:</strong> https://valyze.vercel.app/contact</li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-4 text-xs text-text-muted mb-4">
            <Link href="/privacy-policy" className="hover:text-text-primary transition-colors">Gizlilik Politikası</Link>
            <Link href="/terms-of-service" className="hover:text-text-primary transition-colors">Kullanım Şartları</Link>
            <Link href="/cookie-policy" className="hover:text-text-primary transition-colors">Çerez Politikası</Link>
            <Link href="/iptal-ve-iade" className="hover:text-text-primary transition-colors">İptal ve İade</Link>
            <Link href="/contact" className="hover:text-text-primary transition-colors">İletişim</Link>
          </div>
          <p className="text-[10px] text-text-muted">&copy; 2026 Valyze TR. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
