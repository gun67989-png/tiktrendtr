"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LogoLink from "@/components/LogoLink";

export default function MesafeliSatisSozlesmesiPage() {
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

          <h1 className="text-3xl font-bold mb-2">Mesafeli Satış Sözleşmesi</h1>
          <p className="text-xs text-muted-foreground mb-10">Son güncelleme: 14 Mart 2026</p>

          <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">

            {/* MADDE 1 - TARAFLAR */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Madde 1 – Taraflar</h2>

              <p className="mb-2"><strong className="text-foreground">1.1 SATICI (Hizmet Sağlayıcı) Bilgileri:</strong></p>
              <ul className="list-none space-y-1 ml-2 mb-4">
                <li><strong className="text-foreground">Unvan:</strong> ValyzeTR Yazılım ve Teknoloji</li>
                <li><strong className="text-foreground">Adres:</strong> İstanbul, Türkiye</li>
                <li><strong className="text-foreground">E-posta:</strong> destek@valyze.app</li>
                <li><strong className="text-foreground">Web Sitesi:</strong> https://valyze.vercel.app</li>
                <li>(Bundan böyle &quot;SATICI&quot; veya &quot;ValyzeTR&quot; olarak anılacaktır.)</li>
              </ul>

              <p className="mb-2"><strong className="text-foreground">1.2 ALICI (Tüketici) Bilgileri:</strong></p>
              <p>
                ValyzeTR platformunda kayıt oluşturarak ve/veya ödeme işlemi gerçekleştirerek
                hizmet satın alan gerçek veya tüzel kişidir. Alıcı&apos;nın ad-soyad, e-posta adresi,
                fatura bilgileri ve iletişim bilgileri; üyelik kaydı ve ödeme işlemi sırasında
                elektronik ortamda temin edilmekte olup işbu sözleşmenin ayrılmaz bir parçasını
                oluşturur.
              </p>
              <p className="mt-1">(Bundan böyle &quot;ALICI&quot; olarak anılacaktır.)</p>
              <p className="mt-2">SATICI ve ALICI, aşağıda ayrı ayrı &quot;Taraf&quot;, birlikte &quot;Taraflar&quot; olarak anılacaktır.</p>
            </section>

            {/* MADDE 2 - SÖZLEŞMENİN KONUSU */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Madde 2 – Sözleşmenin Konusu</h2>
              <p>
                İşbu Mesafeli Satış Sözleşmesi (&quot;Sözleşme&quot;), 6502 sayılı Tüketicinin Korunması Hakkında
                Kanun (&quot;TKHK&quot;) ve Mesafeli Sözleşmeler Yönetmeliği (&quot;Yönetmelik&quot;) hükümleri uyarınca,
                ALICI&apos;nın SATICI&apos;ya ait valyze.vercel.app internet sitesi üzerinden mesafeli olarak
                (elektronik ortamda) satın aldığı dijital hizmet aboneliğine ilişkin Taraflar&apos;ın
                karşılıklı hak ve yükümlülüklerini düzenlemektedir.
              </p>
              <p className="mt-2">
                ALICI, işbu Sözleşme&apos;yi onaylamadan önce; satın alacağı hizmete ait temel nitelikleri,
                satış fiyatını (vergiler dahil), ödeme şeklini, hizmetin ifa şartlarını ve cayma hakkına
                ilişkin ön bilgilendirme formunu okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli
                onayı verdiğini kabul, beyan ve taahhüt eder.
              </p>
              <p className="mt-2">
                Ön Bilgilendirme Formu ve Fatura, işbu Sözleşme&apos;nin ayrılmaz parçalarıdır.
              </p>
            </section>

            {/* MADDE 3 - SÖZLEŞME KONUSU HİZMET */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Madde 3 – Sözleşme Konusu Hizmet</h2>

              <p className="mb-2"><strong className="text-foreground">3.1 Hizmetin Tanımı:</strong></p>
              <p className="mb-3">
                ValyzeTR, TikTok platformundaki trend içeriklerin, viral videoların, popüler seslerin,
                hashtag performanslarının ve içerik oluşturucu istatistiklerinin analiz edilmesine yönelik
                bir SaaS (Software as a Service – Hizmet Olarak Yazılım) dijital platformdur. Hizmet,
                tamamen çevrim içi (online) olarak sunulmakta olup herhangi bir fiziksel ürün teslimi
                içermemektedir.
              </p>

              <p className="mb-2"><strong className="text-foreground">3.2 Hizmet Paketleri:</strong></p>

              <p className="mb-1 ml-2"><strong className="text-foreground">a) Ücretsiz Plan (Free Plan):</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
                <li>Sınırlı sayıda trend analizi ve viral video görüntüleme</li>
                <li>Temel hashtag istatistikleri</li>
                <li>Herhangi bir ücret tahsil edilmez</li>
              </ul>

              <p className="mb-1 ml-2"><strong className="text-foreground">b) Pro Plan (Ücretli Abonelik):</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4 mb-3">
                <li>Sınırsız trend analizi ve viral video veritabanına tam erişim</li>
                <li>Gelişmiş hashtag istatistikleri, büyüme grafikleri ve karşılaştırmalı analizler</li>
                <li>Yapay zekâ destekli içerik önerileri ve strateji araçları</li>
                <li>Detaylı rakip analizi ve performans tahmin modülleri</li>
                <li>İçerik oluşturucu (creator) analiz ve raporlama araçları</li>
                <li>Popüler ses ve müzik trend takibi</li>
                <li>Haftalık ve aylık detaylı performans raporları</li>
                <li>Öncelikli müşteri desteği</li>
              </ul>

              <p className="mb-2"><strong className="text-foreground">3.3 Hizmetin Niteliği:</strong></p>
              <p>
                Sözleşme konusu hizmet, 6502 sayılı Kanun ve ilgili yönetmelikler kapsamında
                &quot;elektronik ortamda anında ifa edilen hizmet&quot; ve &quot;gayri maddi mal&quot;
                niteliğindedir. Fiziksel bir teslimat söz konusu değildir. Hizmet, ödemenin
                tamamlanmasıyla birlikte dijital ortamda derhal ALICI&apos;nın kullanımına sunulur.
              </p>
            </section>

            {/* MADDE 4 - HİZMET BEDELİ VE ÖDEME KOŞULLARI */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Madde 4 – Hizmet Bedeli ve Ödeme Koşulları</h2>

              <p className="mb-2"><strong className="text-foreground">4.1 Hizmet Bedeli:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2 mb-3">
                <li><strong className="text-foreground">Pro Plan:</strong> Aylık 299 TL (İki yüz doksan dokuz Türk Lirası) – KDV dahil toplam bedel</li>
                <li><strong className="text-foreground">Ücretsiz Plan:</strong> 0 TL (Herhangi bir ücret talep edilmez)</li>
              </ul>

              <p className="mb-2"><strong className="text-foreground">4.2 Ödeme Yöntemi:</strong></p>
              <p className="mb-3">
                Tüm ödemeler, iyzico güvenli ödeme altyapısı üzerinden kredi kartı ve/veya
                banka kartı ile gerçekleştirilir. iyzico, 6493 sayılı Ödeme ve Menkul Kıymet
                Mutabakat Sistemleri, Ödeme Hizmetleri ve Elektronik Para Kuruluşları Hakkında
                Kanun kapsamında Türkiye Cumhuriyet Merkez Bankası (TCMB) tarafından lisanslandırılmış
                bir ödeme kuruluşudur. ALICI&apos;nın kart bilgileri SATICI tarafından saklanmaz;
                ödeme bilgileri doğrudan iyzico tarafından PCI DSS standartlarına uygun olarak işlenir.
              </p>

              <p className="mb-2"><strong className="text-foreground">4.3 Otomatik Yenileme:</strong></p>
              <p className="mb-3">
                Pro Plan aboneliği, ALICI tarafından iptal edilmedikçe her ayın sonunda otomatik olarak
                yenilenir ve kayıtlı ödeme aracından ilgili dönem ücreti tahsil edilir. ALICI, aboneliğini
                dilediği zaman hesap ayarları üzerinden veya destek@valyze.app adresine yazılı bildirim
                göndererek iptal edebilir. İptal işlemi, mevcut ödeme döneminin sonunda geçerli olur;
                kalan süre boyunca hizmet kullanılmaya devam edilebilir.
              </p>

              <p className="mb-2"><strong className="text-foreground">4.4 Fiyat Değişiklikleri:</strong></p>
              <p>
                SATICI, hizmet bedelinde değişiklik yapma hakkını saklı tutar. Fiyat değişiklikleri,
                ALICI&apos;ya en az 30 (otuz) gün öncesinden kayıtlı e-posta adresine bildirim yapılmak
                suretiyle yürürlüğe girer. ALICI, yeni fiyatı kabul etmemesi halinde aboneliğini
                mevcut dönem sonunda iptal edebilir.
              </p>
            </section>

            {/* MADDE 5 - HİZMETİN İFASI VE TESLİMAT ŞEKLİ */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Madde 5 – Hizmetin İfası ve Teslimat Şekli</h2>

              <p className="mb-2"><strong className="text-foreground">5.1 Anında İfa:</strong></p>
              <p className="mb-3">
                Sözleşme konusu hizmet, dijital niteliktedir ve fiziksel teslimat içermemektedir.
                Pro Plan özellikleri, ödeme işleminin iyzico tarafından onaylanmasının ardından derhal
                (anında) ALICI&apos;nın hesabında aktif hale getirilir. ALICI, ödeme onayı ile birlikte
                hizmetten yararlanmaya başlayabilir.
              </p>

              <p className="mb-2"><strong className="text-foreground">5.2 Hizmet Erişimi:</strong></p>
              <p className="mb-3">
                Hizmet, valyze.vercel.app adresi üzerinden internet bağlantısı olan herhangi bir cihazdan
                (bilgisayar, tablet, akıllı telefon) 7 gün 24 saat (7/24) erişilebilir şekilde sunulmaktadır.
                Planlı bakım çalışmaları ve mücbir sebepler halleri saklıdır.
              </p>

              <p className="mb-2"><strong className="text-foreground">5.3 Teslimat Süresi:</strong></p>
              <p>
                Hizmet, ödemenin onaylanmasından itibaren en geç birkaç dakika içinde kullanıma açılır.
                Olağan koşullarda aktivasyon anında gerçekleşir. Teknik sorunlardan kaynaklanan gecikmelerde
                SATICI, ALICI&apos;yı bilgilendirir ve sorunu en kısa sürede giderir.
              </p>
            </section>

            {/* MADDE 6 - CAYMA HAKKI */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Madde 6 – Cayma Hakkı</h2>

              <p className="mb-2"><strong className="text-foreground">6.1 Yasal Çerçeve:</strong></p>
              <p className="mb-3">
                6502 sayılı Tüketicinin Korunması Hakkında Kanun&apos;un 53. maddesinin (ğ) bendi ve
                Mesafeli Sözleşmeler Yönetmeliği&apos;nin 15. maddesinin (ğ) bendi uyarınca;
                &quot;Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen
                gayri maddi mallara ilişkin sözleşmelerde&quot; cayma hakkı kullanılamaz.
              </p>

              <p className="mb-3">
                ValyzeTR hizmeti, ödemenin onaylanmasıyla birlikte elektronik ortamda anında ifa
                edilmekte ve ALICI&apos;nın kullanımına derhal sunulmaktadır. Bu sebeple, ALICI&apos;nın
                yasal cayma hakkı bulunmamaktadır. ALICI, bu durumu işbu Sözleşme&apos;yi onaylamadan
                önce açıkça bildirildiğini ve kabul ettiğini beyan eder.
              </p>

              <p className="mb-2"><strong className="text-foreground">6.2 İyi Niyet İade Politikası (Goodwill Refund):</strong></p>
              <p className="mb-3">
                Yukarıdaki yasal düzenlemeye rağmen, ValyzeTR olarak müşteri memnuniyetini ön planda
                tutuyoruz. İlk kez Pro Plan aboneliği başlatan ALICI&apos;lar, abonelik başlangıç
                tarihinden itibaren <strong className="text-foreground">7 (yedi) takvim günü</strong> içinde
                destek@valyze.app adresine yazılı başvuru yaparak ücret iadesini talep edebilirler.
              </p>
              <p className="mb-2">İade koşulları:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 mb-3">
                <li>İade hakkı yalnızca ilk abonelik dönemi için geçerlidir; yenilenen dönemler için uygulanmaz.</li>
                <li>İade talebi, abonelik başlangıcından itibaren 7 takvim günü içinde yapılmalıdır.</li>
                <li>İade, ödemenin yapıldığı ödeme aracına (kredi kartı/banka kartı) iyzico aracılığıyla gerçekleştirilir.</li>
                <li>İade süreci, talebin onaylanmasından itibaren en geç 14 (on dört) iş günü içinde başlatılır.</li>
                <li>İadenin banka/kredi kartı hesabına yansıma süresi, ALICI&apos;nın bankasına bağlı olarak değişebilir.</li>
              </ul>
              <p>
                Detaylı bilgi için{" "}
                <Link href="/iptal-ve-iade" className="text-primary hover:underline">İptal ve İade Koşulları</Link> sayfamızı
                inceleyebilirsiniz.
              </p>
            </section>

            {/* MADDE 7 - TARAFLARIN HAK VE YÜKÜMLÜLÜKLERİ */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Madde 7 – Tarafların Hak ve Yükümlülükleri</h2>

              <p className="mb-2"><strong className="text-foreground">7.1 SATICI&apos;nın Hak ve Yükümlülükleri:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2 mb-4">
                <li>SATICI, sözleşme konusu hizmeti eksiksiz, zamanında ve işbu Sözleşme&apos;de belirtilen niteliklere uygun olarak ifa etmekle yükümlüdür.</li>
                <li>SATICI, hizmetin güvenli ve kesintisiz sunulması için gerekli teknik altyapıyı sağlamakla yükümlüdür. Planlı bakım çalışmaları öncesinde ALICI bilgilendirilir.</li>
                <li>SATICI, ALICI&apos;nın kişisel verilerini 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) ve ilgili mevzuat hükümlerine uygun olarak işler ve korur.</li>
                <li>SATICI, hizmet kapsamında ve içeriğinde iyileştirme, güncelleme ve değişiklik yapma hakkını saklı tutar. Esaslı değişiklikler ALICI&apos;ya önceden bildirilir.</li>
                <li>SATICI, ALICI&apos;nın platformu Kullanım Şartları&apos;na aykırı biçimde kullanması halinde hesabı askıya alma veya sonlandırma hakkına sahiptir.</li>
                <li>SATICI, iyzico üzerinden yapılan ödemelerde kart bilgilerini saklamaz ve ödeme güvenliğinden iyzico sorumludur.</li>
              </ul>

              <p className="mb-2"><strong className="text-foreground">7.2 ALICI&apos;nın Hak ve Yükümlülükleri:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>ALICI, işbu Sözleşme&apos;yi ve Ön Bilgilendirme Formu&apos;nu elektronik ortamda okuyup anladığını ve kabul ettiğini beyan eder.</li>
                <li>ALICI, kayıt sırasında doğru, güncel ve eksiksiz bilgi vermekle yükümlüdür. Yanlış veya eksik bilgiden doğan sorumluluk ALICI&apos;ya aittir.</li>
                <li>ALICI, hesap bilgilerinin (kullanıcı adı, şifre) gizliliğini korumakla yükümlüdür. Hesap üzerinden gerçekleştirilen tüm işlemlerden ALICI sorumludur.</li>
                <li>ALICI, platformu yalnızca kişisel kullanımı için ve Kullanım Şartları&apos;na uygun olarak kullanmayı taahhüt eder.</li>
                <li>ALICI, platformdaki verileri otomatik yollarla (bot, scraper vb.) toplamayacağını, tersine mühendislik yapmayacağını ve üçüncü kişilerin erişimine açmayacağını kabul eder.</li>
                <li>ALICI, abonelik ücretini zamanında ödemekle yükümlüdür. Ödeme başarısızlığı halinde SATICI, hizmeti askıya alabilir.</li>
                <li>ALICI, ödeme işlemi sırasında kullanılan kredi kartı/banka kartının kendisine ait olduğunu veya kart sahibinin açık iznini aldığını beyan ve taahhüt eder.</li>
              </ul>
            </section>

            {/* MADDE 8 - MÜCBİR SEBEPLER */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Madde 8 – Mücbir Sebepler</h2>
              <p className="mb-3">
                Taraflar&apos;ın kontrolü dışında gerçekleşen, önceden öngörülemeyen ve önlenemeyen;
                doğal afetler, salgın hastalıklar, savaş, terör, grev, lokavt, yasal düzenleme
                değişiklikleri, siber saldırılar, internet altyapı arızaları, enerji kesintileri,
                devlet müdahaleleri, üçüncü taraf hizmet sağlayıcılarının (sunucu, API, ödeme sistemi vb.)
                hizmet kesintileri ve benzeri durumlar mücbir sebep olarak kabul edilir.
              </p>
              <p className="mb-3">
                Mücbir sebep halinde, etkilenen Taraf&apos;ın işbu Sözleşme kapsamındaki yükümlülükleri,
                mücbir sebebin devam ettiği süre boyunca askıya alınır ve bu süre zarfında
                yükümlülüklerini yerine getirememesi temerrüt olarak değerlendirilmez.
              </p>
              <p>
                Mücbir sebebin 30 (otuz) günü aşması halinde, Taraflar&apos;dan her biri Sözleşme&apos;yi
                herhangi bir tazminat yükümlülüğü olmaksızın feshedebilir. Bu durumda, ALICI&apos;nın
                kullanılmayan döneme ilişkin ödemiş olduğu ücret, gün bazında hesaplanarak iade edilir.
              </p>
            </section>

            {/* MADDE 9 - UYUŞMAZLIK ÇÖZÜMÜ */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Madde 9 – Uyuşmazlık Çözümü</h2>
              <p className="mb-3">
                İşbu Sözleşme&apos;den doğan uyuşmazlıklarda Türkiye Cumhuriyeti kanunları uygulanır.
              </p>
              <p className="mb-3">
                Sözleşme&apos;den kaynaklanan uyuşmazlıklarda, her yıl Ticaret Bakanlığı tarafından
                ilan edilen parasal sınırlar dahilinde ALICI&apos;nın mal veya hizmeti satın aldığı ya da
                ikametgahının bulunduğu yerdeki <strong className="text-foreground">İl veya İlçe Tüketici Hakem Heyetleri</strong> yetkilidir.
              </p>
              <p className="mb-3">
                Tüketici Hakem Heyetleri&apos;nin görev alanını aşan uyuşmazlıklarda ise ALICI&apos;nın
                ikametgahındaki veya SATICI&apos;nın merkezinin bulunduğu yerdeki{" "}
                <strong className="text-foreground">Tüketici Mahkemeleri</strong> yetkilidir.
              </p>
              <p>
                SATICI&apos;nın merkezinin bulunduğu yer: <strong className="text-foreground">İstanbul</strong>.
                Yetkili mahkeme ve icra daireleri olarak İstanbul Mahkemeleri ve İcra Daireleri yetkili
                kılınmıştır.
              </p>
            </section>

            {/* MADDE 10 - YÜRÜRLÜK */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Madde 10 – Yürürlük</h2>
              <p className="mb-3">
                İşbu Sözleşme, toplam 11 (on bir) maddeden oluşmakta olup ALICI tarafından
                elektronik ortamda onaylandığı (kabul edildiği) tarihte yürürlüğe girer.
              </p>
              <p className="mb-3">
                ALICI, işbu Sözleşme&apos;nin tüm maddelerini okuduğunu, anladığını ve kabul ettiğini;
                Sözleşme konusu hizmetin temel nitelikleri, satış fiyatı (tüm vergiler dahil), ödeme
                şekli ve cayma hakkına ilişkin ön bilgilendirmenin kendisine yapıldığını elektronik
                ortamda teyit eder.
              </p>
              <p>
                Sözleşme, ALICI&apos;nın aboneliğinin sona ermesi veya Taraflar&apos;dan birinin Sözleşme&apos;yi
                feshetmesiyle son bulur. Fesih halinde, fesih tarihine kadar doğmuş hak ve yükümlülükler
                saklı kalır.
              </p>
            </section>

            {/* MADDE 11 - İLETİŞİM */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">Madde 11 – İletişim</h2>
              <p className="mb-3">
                Sözleşme&apos;yle ilgili her türlü soru, talep, şikâyet ve bildirimleriniz için
                aşağıdaki kanallardan bize ulaşabilirsiniz:
              </p>
              <ul className="list-none space-y-1 ml-2">
                <li><strong className="text-foreground">Unvan:</strong> ValyzeTR Yazılım ve Teknoloji</li>
                <li><strong className="text-foreground">E-posta:</strong> destek@valyze.app</li>
                <li><strong className="text-foreground">Web:</strong> https://valyze.vercel.app</li>
                <li><strong className="text-foreground">İletişim Sayfası:</strong>{" "}
                  <Link href="/contact" className="text-primary hover:underline">valyze.vercel.app/contact</Link>
                </li>
              </ul>
              <p className="mt-3">
                SATICI, ALICI&apos;ya yapacağı bildirimleri, ALICI&apos;nın kayıt sırasında verdiği e-posta
                adresine elektronik posta göndermek suretiyle yapacaktır. ALICI, kayıtlı e-posta adresinin
                güncel olmasından sorumludur.
              </p>
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
            <Link href="/iptal-ve-iade" className="hover:text-foreground transition-colors">İptal ve İade</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">İletişim</Link>
          </div>
          <p className="text-[10px] text-muted-foreground">&copy; 2026 ValyzeTR. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
