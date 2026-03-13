"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LogoLink from "@/components/LogoLink";

export default function IptalVeIadePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <LogoLink size="sm" />
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2">Giriş Yap</Link>
            <Link href="/register" className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors font-medium">Ücretsiz Başla</Link>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="w-3 h-3" /> Ana Sayfaya Dön
          </Link>

          <h1 className="text-3xl font-bold mb-2">İptal ve İade Koşulları</h1>
          <p className="text-xs text-muted-foreground mb-10">Son güncelleme: 13 Mart 2026</p>

          <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">1. Genel Bilgi</h2>
              <p>
                Valyze TR, dijital bir SaaS (Hizmet Olarak Yazılım) platformu olarak TikTok trend analizi hizmeti sunmaktadır.
                İşbu koşullar, Pro Plan aboneliği kapsamında yapılan ödemeler için geçerli iptal ve iade prosedürlerini belirler.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">2. Abonelik İptali</h2>
              <p className="mb-2">Aboneliğinizi istediğiniz zaman iptal edebilirsiniz:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Dashboard &gt; Hesap Ayarları &gt; Abonelik bölümünden iptal işlemi yapılabilir.</li>
                <li>İptal işlemi, mevcut fatura döneminin sonunda geçerli olur.</li>
                <li>İptal sonrası, dönem sonuna kadar Pro Plan özelliklerine erişiminiz devam eder.</li>
                <li>İptal edilen abonelikler otomatik olarak Ücretsiz Plan&apos;a düşürülür.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">3. İade Politikası</h2>
              <p className="mb-3">
                6502 sayılı Tüketicinin Korunması Hakkında Kanun&apos;un 53/ğ maddesi gereğince, elektronik ortamda
                anında ifa edilen dijital hizmetlerde cayma hakkı bulunmamaktadır. Ancak Valyze olarak müşteri
                memnuniyetini ön planda tutuyoruz.
              </p>

              <div className="bg-muted border border-border rounded-xl p-4 mb-3">
                <h3 className="text-sm font-semibold text-foreground mb-2">İade Yapılabilecek Durumlar:</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong className="text-foreground">İlk Abonelik İadesi:</strong> İlk kez Pro Plan&apos;a abone olan kullanıcılar, abonelik başlangıcından itibaren 7 gün içinde tam iade talep edebilir.</li>
                  <li><strong className="text-foreground">Teknik Aksaklık:</strong> Platform kaynaklı teknik sorunlar nedeniyle hizmetten yararlanamama durumunda, etkilenen dönem için iade yapılabilir.</li>
                  <li><strong className="text-foreground">Mükerrer Ödeme:</strong> Sistem kaynaklı mükerrer (çift) çekim yapılması durumunda fazla ödeme derhal iade edilir.</li>
                </ul>
              </div>

              <div className="bg-muted border border-border rounded-xl p-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">İade Yapılmayacak Durumlar:</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>7 günlük iade süresini geçmiş abonelikler</li>
                  <li>Kullanıcının kendi isteğiyle hesabını silmesi veya ihlal nedeniyle kapatılması</li>
                  <li>Abonelik döneminin kısmen kullanılması sonrası kalan süre için orantılı iade</li>
                  <li>Ücretsiz Plan kullanıcıları (ödeme yapılmadığı için)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">4. İade Süreci</h2>
              <ol className="list-decimal list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-foreground">Başvuru:</strong> destek@valyze.app adresine e-posta göndererek
                  iade talebinizi iletin. E-postanızda kayıtlı e-posta adresinizi ve iade gerekçenizi belirtin.
                </li>
                <li>
                  <strong className="text-foreground">Değerlendirme:</strong> Talebiniz en geç 3 iş günü içinde
                  incelenir ve sonuç e-posta ile bildirilir.
                </li>
                <li>
                  <strong className="text-foreground">İade İşlemi:</strong> Onaylanan iadeler, ödemenin yapıldığı
                  kredi kartı/banka kartına 5-10 iş günü içinde iade edilir. İade, iyzico güvenli ödeme altyapısı
                  üzerinden gerçekleştirilir.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">5. Fiyat Değişiklikleri</h2>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Abonelik ücretlerindeki değişiklikler en az 30 gün öncesinden e-posta ile bildirilir.</li>
                <li>Fiyat artışı durumunda mevcut aboneler, dönem sonuna kadar eski fiyattan yararlanır.</li>
                <li>Yeni fiyatı kabul etmeyen kullanıcılar aboneliklerini ücretsiz iptal edebilir.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">6. İletişim</h2>
              <p>İptal ve iade işlemleriniz için bize aşağıdaki kanallardan ulaşabilirsiniz:</p>
              <ul className="list-none space-y-1 ml-2 mt-2">
                <li><strong className="text-foreground">E-posta:</strong> destek@valyze.app</li>
                <li><strong className="text-foreground">İletişim Formu:</strong>{" "}
                  <Link href="/contact" className="text-primary hover:underline">valyze.vercel.app/contact</Link>
                </li>
                <li><strong className="text-foreground">Yanıt Süresi:</strong> En geç 24 saat içinde</li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Gizlilik Politikası</Link>
            <Link href="/terms-of-service" className="hover:text-foreground transition-colors">Kullanım Şartları</Link>
            <Link href="/cookie-policy" className="hover:text-foreground transition-colors">Çerez Politikası</Link>
            <Link href="/mesafeli-satis-sozlesmesi" className="hover:text-foreground transition-colors">Mesafeli Satış Sözleşmesi</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">İletişim</Link>
          </div>
          <p className="text-[10px] text-muted-foreground">&copy; 2026 Valyze TR. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
