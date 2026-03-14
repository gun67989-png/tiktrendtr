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
          <p className="text-xs text-muted-foreground mb-10">Son güncelleme: 14 Mart 2026</p>

          <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">

            {/* 1. Genel Bilgi */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">1. Genel Bilgi</h2>
              <p className="mb-3">
                ValyzeTR (bundan sonra &quot;Platform&quot; olarak anılacaktır), dijital bir SaaS hizmeti (dijital SaaS hizmeti — Software as a Service, Hizmet Olarak Yazılım) olarak Türkiye pazarına yönelik TikTok trend analizi hizmeti sunmaktadır. Platform üzerinden sunulan tüm hizmetler, tamamen dijital ortamda ve elektronik olarak anında ifa edilen hizmetlerdir; fiziksel bir ürün teslimatı veya kargo söz konusu değildir. Dijital SaaS hizmetlerinde cayma hakkı ve iade koşulları, fiziksel ürünlerden farklı yasal düzenlemelere tabidir.
              </p>
              <p className="mb-3">
                İşbu İptal ve İade Koşulları, Platform&apos;a üye olan kullanıcıların ücretli abonelik planları (Bireysel Lite, Bireysel Standart, Kurumsal) kapsamında gerçekleştirdikleri ödemeler için geçerli olan iptal, cayma hakkı ve iade prosedürlerini düzenlemektedir. Ücretsiz (Free) Plan kullanıcıları herhangi bir ödeme yapmadığından, bu koşullar Ücretsiz Plan kullanıcıları için geçerli değildir.
              </p>
              <p className="mb-3">
                Platform üzerindeki tüm ödemeler, iyzico güvenli ödeme altyapısı aracılığıyla işlenmektedir. Kullanıcıların kredi kartı ve banka kartı bilgileri iyzico tarafından PCI DSS standartlarına uygun olarak korunmakta olup, ValyzeTR tarafından saklanmamaktadır.
              </p>
              <div className="bg-muted border border-border rounded-xl p-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">Mevcut Abonelik Planları:</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong className="text-foreground">Ücretsiz (Free) Plan:</strong> Temel özellikler, ücret yok (₺0).</li>
                  <li><strong className="text-foreground">Bireysel Lite Plan:</strong> Genişletilmiş özellikler, aylık ₺280 (KDV dahil).</li>
                  <li><strong className="text-foreground">Bireysel Standart Plan:</strong> Tüm bireysel özellikler dahil, aylık ₺350 (KDV dahil).</li>
                  <li><strong className="text-foreground">Kurumsal Plan:</strong> Ekip yönetimi ve öncelikli destek dahil, aylık ₺1.250 (KDV dahil).</li>
                </ul>
              </div>
            </section>

            {/* 2. Dijital Hizmetlerde Cayma Hakkı */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">2. Dijital Hizmetlerde Cayma Hakkı</h2>
              <p className="mb-3">
                6502 sayılı Tüketicinin Korunması Hakkında Kanun&apos;un 53. maddesi ve Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15. maddesi uyarınca, belirli mal ve hizmetlerde cayma hakkı kullanılamaz. ValyzeTR tarafından sunulan hizmetler, aşağıda belirtilen yasal istisnalar kapsamındadır:
              </p>
              <div className="bg-muted border border-border rounded-xl p-4 mb-3">
                <h3 className="text-sm font-semibold text-foreground mb-2">Yasal Dayanak:</h3>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>
                    <strong className="text-foreground">6502 sayılı Kanun, Madde 53/ğ:</strong> Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayri maddi mallara ilişkin sözleşmelerde cayma hakkı kullanılamaz.
                  </li>
                  <li>
                    <strong className="text-foreground">Mesafeli Sözleşmeler Yönetmeliği, Madde 15/ğ:</strong> Cayma hakkı süresi sona ermeden önce, tüketicinin onayı ile ifasına başlanan hizmetlere ilişkin sözleşmelerde cayma hakkı kullanılamaz.
                  </li>
                </ul>
              </div>
              <p className="mb-3">
                ValyzeTR&apos;nin sunduğu dijital analiz hizmeti, abonelik ödemesinin tamamlanmasının ardından derhal ve otomatik olarak kullanıcının erişimine açılmaktadır. Bu nedenle Platform hizmetleri, yukarıda belirtilen kanun ve yönetmelik maddeleri kapsamında &quot;anında ifa edilen hizmetler&quot; ve &quot;anında teslim edilen gayri maddi mallar&quot; kategorisine girmekte olup, yasal cayma hakkı istisnası kapsamındadır.
              </p>
              <p>
                Kullanıcılar, ücretli plan aboneliğini başlatırken bu durumu kabul etmiş sayılır. Ancak ValyzeTR, müşteri memnuniyetini ön planda tutarak aşağıda detaylandırılan iyi niyet iade politikasını uygulamaktadır.
              </p>
            </section>

            {/* 3. Abonelik İptali */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">3. Abonelik İptali</h2>
              <p className="mb-3">
                Kullanıcılar, ücretli plan aboneliklerini (Bireysel Lite, Bireysel Standart, Kurumsal) istedikleri zaman, herhangi bir gerekçe belirtmeksizin ve cezai şart ödenmeksizin iptal edebilirler. Abonelik iptali aşağıdaki yöntemlerle gerçekleştirilebilir:
              </p>
              <div className="bg-muted border border-border rounded-xl p-4 mb-3">
                <h3 className="text-sm font-semibold text-foreground mb-2">İptal Yöntemleri:</h3>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong className="text-foreground">Platform Üzerinden:</strong> Dashboard &gt; Hesap Ayarları &gt; Abonelik bölümünden &quot;Aboneliği İptal Et&quot; butonuna tıklayarak iptal işlemi yapılabilir.</li>
                  <li><strong className="text-foreground">E-posta ile:</strong> destek@valyze.app adresine kayıtlı e-posta adresinizden iptal talebinizi iletebilirsiniz.</li>
                </ul>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">İptal Sonrası Geçerlilik:</h3>
              <ul className="list-disc list-inside space-y-1 ml-2 mb-3">
                <li>İptal işlemi, mevcut fatura döneminin sonunda geçerli olur. Dönem ortasında yapılan iptallerde, dönem sonuna kadar ücretli plan özellikleri aktif kalır.</li>
                <li>Mevcut fatura dönemi sona erdikten sonra bir sonraki dönem için otomatik yenileme yapılmaz ve herhangi bir ücret tahsil edilmez.</li>
                <li>İptal edilen abonelikler, fatura döneminin sona ermesiyle birlikte otomatik olarak Ücretsiz Plan&apos;a düşürülür.</li>
                <li>Ücretsiz Plan&apos;a geçişle birlikte, ücretli planlara özel özellikler (gelişmiş analitik, detaylı raporlar, içerik önerileri vb.) devre dışı kalır.</li>
                <li>Ücretsiz Plan&apos;daki verileriniz ve hesabınız korunmaya devam eder. Dilediğiniz zaman tekrar ücretli bir plana yükseltme yapabilirsiniz.</li>
              </ul>
              <p>
                İptal işlemi geri alınamaz; ancak kullanıcılar istedikleri zaman yeniden ücretli bir plan aboneliği başlatabilirler.
              </p>
            </section>

            {/* 4. İade Politikası */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">4. İade Politikası</h2>
              <p className="mb-3">
                Yukarıda açıklandığı üzere, dijital hizmetlerde yasal cayma hakkı bulunmamaktadır. Bununla birlikte ValyzeTR, müşteri memnuniyetini ve kullanıcı güvenini ön planda tutarak aşağıdaki durumlarda iyi niyet çerçevesinde iade yapmaktadır:
              </p>
              <div className="bg-muted border border-border rounded-xl p-4 mb-3">
                <h3 className="text-sm font-semibold text-foreground mb-2">4.1. İlk Abonelik İadesi (7 Günlük İyi Niyet İadesi)</h3>
                <p className="mb-2">
                  İlk kez ücretli plan aboneliği (Bireysel Lite, Bireysel Standart veya Kurumsal) başlatan kullanıcılar, abonelik başlangıç tarihinden itibaren 7 (yedi) takvim günü içinde tam iade talep edebilirler. Bu hak, yalnızca ilk abonelik dönemi için geçerlidir ve her kullanıcı tarafından yalnızca bir kez kullanılabilir.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>İade talebi, abonelik başlangıcından itibaren 7 takvim günü içinde yapılmalıdır.</li>
                  <li>Daha önce ücretli plan aboneliği başlatıp iptal etmiş ve tekrar abone olan kullanıcılar bu haktan yararlanamaz.</li>
                  <li>İade onaylandığında abonelik derhal iptal edilir ve hesap Ücretsiz Plan&apos;a düşürülür.</li>
                  <li>İade tutarı, ödenen abonelik ücretinin tamamıdır (Bireysel Lite: ₺280, Bireysel Standart: ₺350, Kurumsal: ₺1.250).</li>
                </ul>
              </div>
              <div className="bg-muted border border-border rounded-xl p-4 mb-3">
                <h3 className="text-sm font-semibold text-foreground mb-2">4.2. Teknik Aksaklık Kaynaklı İade</h3>
                <p className="mb-2">
                  Platform kaynaklı teknik sorunlar nedeniyle hizmetin kesintiye uğraması veya kullanıcının hizmetten yararlanamaması durumunda, etkilenen dönem için tam veya orantılı iade yapılabilir.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Teknik aksaklığın ValyzeTR kaynaklı olduğunun tespit edilmesi gerekmektedir.</li>
                  <li>Kullanıcının internet bağlantısı, cihaz uyumsuzluğu veya üçüncü taraf yazılımlardan kaynaklanan sorunlar bu kapsama girmez.</li>
                  <li>TikTok API&apos;sindeki değişiklikler veya TikTok platformunun kendi kesintileri nedeniyle oluşan aksaklıklar ValyzeTR&apos;nin kontrolü dışında olup, bu durumlar için iade garantisi verilmemektedir; ancak her talep bireysel olarak değerlendirilir.</li>
                  <li>İade miktarı, aksaklığın süresine ve etkisine göre tam veya kısmi olarak belirlenir.</li>
                </ul>
              </div>
              <div className="bg-muted border border-border rounded-xl p-4">
                <h3 className="text-sm font-semibold text-foreground mb-2">4.3. Mükerrer (Çift) Ödeme İadesi</h3>
                <p className="mb-2">
                  Sistem kaynaklı bir hata sonucu aynı dönem için birden fazla ödeme tahsil edilmesi durumunda, fazla ödenen tutar derhal ve koşulsuz olarak iade edilir.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Mükerrer ödeme tespiti, ValyzeTR tarafından otomatik olarak veya kullanıcı bildirimi üzerine yapılır.</li>
                  <li>Fazla ödeme tespit edildiğinde, kullanıcının ayrıca başvuru yapmasına gerek kalmaksızın iade süreci başlatılır.</li>
                  <li>İade, ödemenin yapıldığı ödeme yöntemine (kredi kartı veya banka kartı) iyzico aracılığıyla gerçekleştirilir.</li>
                </ul>
              </div>
            </section>

            {/* 5. İade Yapılmayacak Durumlar */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">5. İade Yapılmayacak Durumlar</h2>
              <p className="mb-3">
                Aşağıdaki durumlarda iade talebi kabul edilmeyecektir:
              </p>
              <div className="bg-muted border border-border rounded-xl p-4">
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>
                    <strong className="text-foreground">Süre Aşımı:</strong> 7 günlük iyi niyet iade süresinin dolmasının ardından yapılan iade talepleri (ilk abonelik iadesi için).
                  </li>
                  <li>
                    <strong className="text-foreground">Hesap İhlali:</strong> Kullanım Şartları&apos;nı veya Platform kurallarını ihlal etmesi nedeniyle askıya alınan veya kapatılan hesaplar için yapılan iade talepleri.
                  </li>
                  <li>
                    <strong className="text-foreground">Kısmi Dönem İadesi:</strong> Abonelik döneminin kısmen kullanılması sonrasında, kalan süre için orantılı (pro-rata) iade talepleri. İptal işlemi dönem sonunda geçerli olur ve kısmi iade yapılmaz.
                  </li>
                  <li>
                    <strong className="text-foreground">Ücretsiz Plan:</strong> Ücretsiz Plan kullanıcıları herhangi bir ödeme yapmadığından, iade söz konusu değildir.
                  </li>
                  <li>
                    <strong className="text-foreground">Kullanıcı Kaynaklı Sorunlar:</strong> Kullanıcının kendi internet bağlantısı, cihaz uyumsuzluğu, tarayıcı ayarları veya üçüncü taraf yazılımlardan kaynaklanan erişim sorunları.
                  </li>
                  <li>
                    <strong className="text-foreground">Beklenti Uyuşmazlığı:</strong> Platform&apos;un sunduğu özellikler ve kapsamı hakkında önceden bilgilendirilmiş olmasına rağmen, hizmetin kullanıcının beklentilerini karşılamaması durumu. Platform&apos;un sunduğu özellikler, web sitesinde ve abonelik öncesi bilgilendirme sayfasında açıkça belirtilmektedir.
                  </li>
                  <li>
                    <strong className="text-foreground">Hesap Silme:</strong> Kullanıcının kendi isteğiyle hesabını silmesi durumunda, aktif abonelik dönemi için iade yapılmaz.
                  </li>
                  <li>
                    <strong className="text-foreground">Tekrarlayan İade Talepleri:</strong> Daha önce 7 günlük iyi niyet iade hakkını kullanmış olan kullanıcının, yeniden abone olduktan sonra tekrar iade talep etmesi.
                  </li>
                </ul>
              </div>
            </section>

            {/* 6. İade Başvuru Süreci */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">6. İade Başvuru Süreci</h2>
              <p className="mb-3">
                İade talebinde bulunmak isteyen kullanıcılar, aşağıdaki adımları izlemelidir:
              </p>
              <div className="bg-muted border border-border rounded-xl p-4 mb-3">
                <ol className="list-decimal list-inside space-y-3 ml-2">
                  <li>
                    <strong className="text-foreground">Başvuru:</strong> destek@valyze.app adresine, Platform&apos;a kayıtlı e-posta adresinizden bir iade talebi e-postası gönderin. E-postanızda aşağıdaki bilgileri eksiksiz olarak belirtin:
                    <ul className="list-disc list-inside space-y-1 ml-6 mt-1">
                      <li>Platform&apos;a kayıtlı e-posta adresiniz</li>
                      <li>Abonelik başlangıç tarihiniz</li>
                      <li>İade talebinizin gerekçesi</li>
                      <li>Varsa destekleyici ekran görüntüsü veya belge</li>
                    </ul>
                  </li>
                  <li>
                    <strong className="text-foreground">Değerlendirme:</strong> İade talebiniz, destek ekibimiz tarafından en geç 3 (üç) iş günü içinde incelenir. İnceleme sonucu, başvuruda belirtilen e-posta adresine yazılı olarak bildirilir. Gerekli görülmesi halinde ek bilgi veya belge talep edilebilir.
                  </li>
                  <li>
                    <strong className="text-foreground">Onay / Red Bildirimi:</strong> İade talebinizin kabul veya reddedildiği, gerekçesiyle birlikte e-posta ile tarafınıza bildirilir. Reddedilen talepler için itiraz hakkınız saklıdır.
                  </li>
                  <li>
                    <strong className="text-foreground">İade İşlemi:</strong> Onaylanan iadeler, ödemenin yapıldığı kredi kartı veya banka kartına iyzico güvenli ödeme altyapısı üzerinden iade edilir. İade tutarının karta yansıma süresi, bankanıza bağlı olarak 5 ila 10 iş günü arasında değişmektedir. ValyzeTR, iade işlemini iyzico&apos;ya iletmekle yükümlüdür; kartınıza yansıma süresi bankanızın iç işleyişine bağlıdır.
                  </li>
                </ol>
              </div>
              <p>
                İade onaylandığında, kullanıcının ücretli plan aboneliği derhal sonlandırılır ve hesap Ücretsiz Plan&apos;a düşürülür.
              </p>
            </section>

            {/* 7. Fiyat Değişiklikleri */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">7. Fiyat Değişiklikleri</h2>
              <p className="mb-3">
                ValyzeTR, tüm ücretli planların (Bireysel Lite, Bireysel Standart, Kurumsal) abonelik ücretlerinde değişiklik yapma hakkını saklı tutar. Fiyat değişikliklerinde aşağıdaki kurallar uygulanır:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-foreground">Önceden Bildirim:</strong> Abonelik ücretlerindeki herhangi bir değişiklik, yürürlüğe girmesinden en az 30 (otuz) takvim günü önce kullanıcılara kayıtlı e-posta adresleri üzerinden ve/veya Platform içi bildirim yoluyla duyurulur.
                </li>
                <li>
                  <strong className="text-foreground">Mevcut Abone Koruması:</strong> Fiyat artışı durumunda, aktif ücretli plan aboneleri mevcut fatura dönemlerinin sonuna kadar eski (mevcut) fiyattan yararlanmaya devam eder. Yeni fiyat, bir sonraki yenileme döneminden itibaren uygulanır.
                </li>
                <li>
                  <strong className="text-foreground">İptal Hakkı:</strong> Fiyat değişikliğini kabul etmeyen kullanıcılar, yeni fiyatın yürürlüğe gireceği tarihten önce aboneliklerini herhangi bir cezai şart ödemeksizin ücretsiz olarak iptal edebilirler.
                </li>
                <li>
                  <strong className="text-foreground">Fiyat İndirimi:</strong> Fiyat indirimi yapılması halinde, yeni fiyat bir sonraki yenileme döneminden itibaren tüm aktif abonelere otomatik olarak uygulanır.
                </li>
              </ul>
            </section>

            {/* 8. Abonelik Yenileme */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">8. Abonelik Yenileme</h2>
              <p className="mb-3">
                Ücretli plan abonelikleri (Bireysel Lite, Bireysel Standart, Kurumsal), kullanıcı tarafından iptal edilmediği sürece her fatura döneminin sonunda otomatik olarak yenilenir.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-foreground">Otomatik Yenileme:</strong> Abonelik, her aylık dönemin sonunda otomatik olarak yenilenir ve kayıtlı ödeme yönteminizden abonelik ücreti tahsil edilir.
                </li>
                <li>
                  <strong className="text-foreground">Yenileme Bildirimi:</strong> Her yenileme işleminden önce, kullanıcıya kayıtlı e-posta adresi üzerinden bilgilendirme yapılır.
                </li>
                <li>
                  <strong className="text-foreground">Ödeme Başarısızlığı:</strong> Yenileme sırasında ödeme başarısız olursa (yetersiz bakiye, kartın süresi dolmuş vb.), kullanıcıya e-posta ile bildirim gönderilir. Ödeme bilgileri güncellenmediği takdirde abonelik askıya alınır ve hesap Ücretsiz Plan&apos;a düşürülür.
                </li>
                <li>
                  <strong className="text-foreground">Yenileme İptali:</strong> Otomatik yenilemeyi durdurmak için, yenileme tarihinden önce aboneliğinizi iptal etmeniz gerekmektedir. İptal işlemi bir sonraki dönemden itibaren geçerli olur.
                </li>
              </ul>
            </section>

            {/* 9. Uyuşmazlık Çözümü */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">9. Uyuşmazlık Çözümü</h2>
              <p className="mb-3">
                İşbu İptal ve İade Koşulları&apos;ndan doğabilecek uyuşmazlıklarda aşağıdaki çözüm mekanizmaları uygulanır:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-foreground">Dostane Çözüm:</strong> Taraflar, ortaya çıkabilecek her türlü uyuşmazlığı öncelikle karşılıklı iyi niyet çerçevesinde ve doğrudan iletişim yoluyla çözmeye gayret eder. Kullanıcılar, destek@valyze.app adresine başvurarak sorunlarını iletebilirler.
                </li>
                <li>
                  <strong className="text-foreground">Tüketici Hakem Heyetleri:</strong> 6502 sayılı Tüketicinin Korunması Hakkında Kanun kapsamında, her yıl belirlenen parasal sınırlar dahilindeki uyuşmazlıklar için Tüketici Hakem Heyetleri&apos;ne başvuru yapılabilir.
                </li>
                <li>
                  <strong className="text-foreground">Tüketici Mahkemeleri:</strong> Tüketici Hakem Heyetleri&apos;nin yetkisini aşan tutarlar ve itiraz durumlarında Tüketici Mahkemeleri yetkilidir.
                </li>
                <li>
                  <strong className="text-foreground">Uygulanacak Hukuk:</strong> İşbu koşullar, Türkiye Cumhuriyeti kanunlarına tabidir ve Türkiye Cumhuriyeti mahkemeleri yetkilidir.
                </li>
              </ul>
            </section>

            {/* 10. İletişim */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">10. İletişim</h2>
              <p className="mb-3">
                İptal, iade ve abonelik işlemlerinizle ilgili her türlü soru, talep ve şikayetleriniz için aşağıdaki iletişim kanallarından bize ulaşabilirsiniz:
              </p>
              <div className="bg-muted border border-border rounded-xl p-4">
                <ul className="list-none space-y-2 ml-2">
                  <li><strong className="text-foreground">Platform:</strong> ValyzeTR</li>
                  <li><strong className="text-foreground">E-posta:</strong> destek@valyze.app</li>
                  <li><strong className="text-foreground">Web Sitesi:</strong>{" "}
                    <Link href="/" className="text-primary hover:underline">valyze.vercel.app</Link>
                  </li>
                  <li><strong className="text-foreground">İletişim Formu:</strong>{" "}
                    <Link href="/contact" className="text-primary hover:underline">valyze.vercel.app/contact</Link>
                  </li>
                  <li><strong className="text-foreground">Yanıt Süresi:</strong> Tüm başvurulara en geç 24 saat içinde yanıt verilir. İade talepleri 3 iş günü içinde değerlendirilir.</li>
                </ul>
              </div>
            </section>

            {/* Kapanış Notu */}
            <section>
              <div className="border-t border-border pt-6">
                <p className="text-xs">
                  İşbu İptal ve İade Koşulları, 14 Mart 2026 tarihinde yürürlüğe girmiştir. ValyzeTR, bu koşulları önceden bildirmeksizin güncelleme hakkını saklı tutar. Güncel koşullar her zaman bu sayfada yayınlanır. Kullanıcıların Platform&apos;u kullanmaya devam etmeleri, güncel koşulları kabul ettikleri anlamına gelir.
                </p>
              </div>
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
          <p className="text-[10px] text-muted-foreground">&copy; 2026 ValyzeTR. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
