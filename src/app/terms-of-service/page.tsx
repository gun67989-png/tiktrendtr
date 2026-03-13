"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LogoLink from "@/components/LogoLink";

export default function TermsOfServicePage() {
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

          <h1 className="text-3xl font-bold mb-2">Kullanım Koşulları</h1>
          <p className="text-xs text-muted-foreground mb-10">Son güncelleme: 14 Mart 2026</p>

          <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">

            {/* 1. Kabul ve Onay */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">1. Kabul ve Onay</h2>
              <p>
                İşbu Kullanım Koşulları (&quot;Sözleşme&quot;), ValyzeTR platformuna (&quot;Platform&quot;) erişen, kayıt olan veya Platformu herhangi bir şekilde kullanan tüm gerçek ve tüzel kişiler (&quot;Kullanıcı&quot;) ile Platform sahibi arasında akdedilen bağlayıcı bir sözleşmedir.
              </p>
              <p className="mt-2">
                Platformu kullanarak, hesap oluşturarak veya hizmetlerden yararlanarak işbu Sözleşme&apos;nin tüm hükümlerini okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan ve taahhüt edersiniz. Bu koşulları kabul etmiyorsanız Platformu kullanmamanız gerekmektedir.
              </p>
              <p className="mt-2">
                Platformu kullanabilmek için 18 yaşını doldurmuş olmanız gerekmektedir. 18 yaşından küçük kişiler Platformu kullanamazlar. Hesap oluşturarak 18 yaşını doldurduğunuzu beyan ve taahhüt edersiniz.
              </p>
              <p className="mt-2">
                İşbu Sözleşme, 6098 sayılı Türk Borçlar Kanunu ve 6502 sayılı Tüketicinin Korunması Hakkında Kanun ile ilgili mevzuat çerçevesinde düzenlenmiştir.
              </p>
            </section>

            {/* 2. Tanımlar */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">2. Tanımlar</h2>
              <p className="mb-2">İşbu Sözleşme&apos;de kullanılan terimler aşağıdaki anlamları taşır:</p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong className="text-foreground">Platform:</strong> ValyzeTR markası altında valyze.vercel.app adresi üzerinden sunulan web tabanlı yazılım hizmeti (SaaS) ve tüm alt sayfaları, API&apos;leri ve bileşenleri.</li>
                <li><strong className="text-foreground">Kullanıcı:</strong> Platforma erişen, kayıt olan veya hizmetlerden yararlanan tüm gerçek ve tüzel kişiler.</li>
                <li><strong className="text-foreground">Üye:</strong> Platforma kayıt olarak hesap oluşturmuş ve e-posta doğrulaması tamamlamış Kullanıcı.</li>
                <li><strong className="text-foreground">Hizmet:</strong> Platform üzerinden sunulan TikTok trend analizi, veri görselleştirme, raporlama ve diğer tüm dijital hizmetler.</li>
                <li><strong className="text-foreground">Abonelik:</strong> Kullanıcı&apos;nın ücretli (Pro Plan) veya ücretsiz (Ücretsiz Plan) olarak yararlandığı hizmet paketi.</li>
                <li><strong className="text-foreground">İçerik:</strong> Platform üzerinde sunulan analiz verileri, grafikler, raporlar, istatistikler, öneriler ve diğer tüm dijital materyaller.</li>
                <li><strong className="text-foreground">Pro Plan:</strong> Aylık 299 TL (KDV dahil) karşılığında sunulan premium abonelik paketi.</li>
                <li><strong className="text-foreground">Ücretsiz Plan:</strong> Herhangi bir ücret ödemeksizin sınırlı özelliklere erişim sağlayan temel abonelik paketi.</li>
                <li><strong className="text-foreground">Ödeme Hizmet Sağlayıcısı:</strong> iyzico Ödeme Hizmetleri A.Ş., ödeme işlemlerinin güvenli şekilde gerçekleştirilmesini sağlayan lisanslı ödeme kuruluşu.</li>
              </ul>
            </section>

            {/* 3. Hizmet Tanımı */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">3. Hizmet Tanımı</h2>
              <p>
                ValyzeTR, Türkiye&apos;deki TikTok trendlerini analiz eden, içerik üreticileri ve markalar için veri odaklı içgörüler sunan bir SaaS (Software as a Service - Hizmet Olarak Yazılım) platformudur. Platform tamamen dijital bir hizmettir; herhangi bir fiziksel ürün teslimatı veya nakliye söz konusu değildir.
              </p>
              <p className="mt-3 mb-2"><strong className="text-foreground">Sunulan hizmetler şunları kapsar:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>TikTok viral video veritabanı ve trend takibi</li>
                <li>Hashtag istatistikleri, büyüme oranları ve performans analizleri</li>
                <li>Ses/müzik trend analizi ve popülerlik takibi</li>
                <li>Genel bakış panosu ve özet istatistikler</li>
                <li>Günlük ve haftalık trend raporları</li>
                <li>İçerik üretici (creator) analizi ve keşif araçları</li>
                <li>En iyi paylaşım zamanı önerileri</li>
                <li>Yorum analizi ve duygu analizi araçları (Pro Plan)</li>
                <li>Gelişmiş içerik stratejisi önerileri (Pro Plan)</li>
                <li>Rakip analizi ve karşılaştırma araçları (Pro Plan)</li>
                <li>Detaylı performans raporları ve veri dışa aktarımı (Pro Plan)</li>
              </ul>
              <p className="mt-3">
                Platform, TikTok&apos;un kamuya açık verilerini analiz eder. Sunulan analizler ve öneriler bilgilendirme amaçlıdır ve kesin sonuç garantisi vermez.
              </p>
            </section>

            {/* 4. Üyelik ve Hesap Güvenliği */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">4. Üyelik ve Hesap Güvenliği</h2>
              <p className="mb-2"><strong className="text-foreground">4.1. Kayıt İşlemi</strong></p>
              <p>
                Platformun tüm özelliklerinden yararlanabilmek için geçerli bir e-posta adresi ile kayıt olmanız gerekmektedir. Kayıt sırasında sağladığınız bilgilerin doğru, güncel ve eksiksiz olduğunu beyan ve taahhüt edersiniz. Yanlış veya yanıltıcı bilgi vermek hesabınızın askıya alınmasına veya feshedilmesine neden olabilir.
              </p>
              <p className="mt-3 mb-2"><strong className="text-foreground">4.2. Hesap Güvenliği</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Şifrenizin gizliliğini korumak ve üçüncü kişilerle paylaşmamak sizin sorumluluğunuzdadır.</li>
                <li>Hesabınız üzerinden gerçekleştirilen tüm işlemlerden siz sorumlusunuz.</li>
                <li>Güçlü bir şifre kullanmanız (en az 8 karakter, büyük-küçük harf, rakam ve özel karakter içermesi) önerilir.</li>
                <li>Hesabınıza yetkisiz erişim olduğundan şüpheleniyorsanız derhal destek@valyze.app adresine bildirmeniz gerekmektedir.</li>
                <li>Her Kullanıcı yalnızca bir hesap oluşturabilir. Aynı kişi tarafından birden fazla hesap açılması yasaktır.</li>
              </ul>
              <p className="mt-3 mb-2"><strong className="text-foreground">4.3. Hesap Devri</strong></p>
              <p>
                Hesabınızı ValyzeTR&apos;nin yazılı onayı olmaksızın başka bir kişi veya kuruluşa devredemez, satamaz veya kiralayamazsınız.
              </p>
            </section>

            {/* 5. Abonelik Planları ve Ödeme */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">5. Abonelik Planları ve Ödeme</h2>

              <p className="mb-2"><strong className="text-foreground">5.1. Ücretsiz Plan</strong></p>
              <p>
                Ücretsiz Plan, herhangi bir ödeme veya kredi kartı bilgisi gerektirmeksizin sınırlı özelliklere erişim sağlar. ValyzeTR, Ücretsiz Plan&apos;ın kapsamını, özelliklerini ve kullanım limitlerini önceden bildirimde bulunarak değiştirme hakkını saklı tutar.
              </p>

              <p className="mt-3 mb-2"><strong className="text-foreground">5.2. Pro Plan</strong></p>
              <p>
                Pro Plan, aylık 299 TL (KDV dahil) karşılığında tüm premium özelliklere sınırsız erişim sağlar. Pro Plan aboneliği aylık dönemler halinde faturalandırılır.
              </p>

              <p className="mt-3 mb-2"><strong className="text-foreground">5.3. Ödeme Yöntemi</strong></p>
              <p>
                Tüm ödemeler, Türkiye Cumhuriyet Merkez Bankası (TCMB) lisanslı ödeme kuruluşu iyzico Ödeme Hizmetleri A.Ş. altyapısı üzerinden güvenli şekilde işlenir. Kredi kartı ve banka kartı ile ödeme kabul edilmektedir. Kredi kartı bilgileriniz ValyzeTR sunucularında saklanmaz; tüm ödeme verileri iyzico tarafından PCI DSS standartlarına uygun şekilde işlenir ve korunur.
              </p>

              <p className="mt-3 mb-2"><strong className="text-foreground">5.4. Otomatik Yenileme</strong></p>
              <p>
                Pro Plan abonelikleri, iptal edilmediği sürece her ayın faturalandırma tarihinde otomatik olarak yenilenir. Otomatik yenileme sırasında kayıtlı ödeme yönteminizden aylık abonelik ücreti tahsil edilir. İptal işlemi, mevcut faturalandırma döneminin sonuna kadar geçerli olmaz; iptal ettiğiniz tarihten dönem sonuna kadar hizmetten yararlanmaya devam edersiniz.
              </p>

              <p className="mt-3 mb-2"><strong className="text-foreground">5.5. Fiyat Değişiklikleri</strong></p>
              <p>
                ValyzeTR, abonelik fiyatlarını değiştirme hakkını saklı tutar. Fiyat değişiklikleri, mevcut abonelere en az 30 gün öncesinden e-posta yoluyla bildirilir. Yeni fiyatlar, bildirim tarihinden sonraki ilk yenileme döneminde uygulanır. Fiyat değişikliğini kabul etmemeniz durumunda aboneliğinizi yenileme tarihinden önce iptal edebilirsiniz.
              </p>

              <p className="mt-3 mb-2"><strong className="text-foreground">5.6. Başarısız Ödeme</strong></p>
              <p>
                Otomatik yenileme sırasında ödeme başarısız olursa, ValyzeTR size e-posta ile bildirimde bulunur. Ödeme bilgilerinizi 7 gün içinde güncellemeniz gerekmektedir. Bu süre içinde ödeme alınamazsa Pro Plan aboneliğiniz askıya alınabilir ve hesabınız Ücretsiz Plan&apos;a düşürülebilir.
              </p>
            </section>

            {/* 6. Hizmetin Kullanımı ve Sınırlamalar */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">6. Hizmetin Kullanımı ve Sınırlamalar</h2>
              <p className="mb-2">Platformu kullanırken aşağıdaki kurallara uymanız zorunludur:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Platformu yalnızca yasal amaçlarla ve işbu Sözleşme&apos;ye uygun şekilde kullanmak.</li>
                <li>Türkiye Cumhuriyeti mevzuatına ve uluslararası hukuk kurallarına uymak.</li>
                <li>Diğer kullanıcıların haklarını ve Platform&apos;un işleyişini ihlal etmemek.</li>
                <li>Platform üzerinden elde edilen verileri yalnızca kişisel veya meşru ticari amaçlarla kullanmak.</li>
                <li>Abonelik planınızın kapsamı dışında kalan özelliklere yetkisiz erişim sağlamamak.</li>
                <li>Platform&apos;un altyapısına aşırı yük bindirmemek veya performansını olumsuz etkilememek.</li>
                <li>Platform üzerindeki verileri, analizleri veya raporları üçüncü taraflara ticari amaçla satmamak veya lisanslamamak.</li>
              </ul>
            </section>

            {/* 7. Yasaklanan Faaliyetler */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">7. Yasaklanan Faaliyetler</h2>
              <p className="mb-2">Aşağıdaki faaliyetler kesinlikle yasaktır ve ihlal durumunda hesabınız derhal askıya alınabilir veya feshedilebilir:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong className="text-foreground">Veri Kazıma (Scraping):</strong> Platform&apos;daki verilerin otomatik araçlarla toplu olarak toplanması, kopyalanması veya çıkarılması.</li>
                <li><strong className="text-foreground">Bot ve Otomasyon:</strong> Platform&apos;a erişmek veya etkileşimde bulunmak için bot, spider, crawler veya benzeri otomatik yazılımların kullanılması.</li>
                <li><strong className="text-foreground">API Kötüye Kullanımı:</strong> Platform API&apos;lerinin izinsiz, belgelenmemiş veya aşırı şekilde kullanılması; rate limit&apos;lerin kasıtlı olarak aşılması.</li>
                <li><strong className="text-foreground">Yeniden Dağıtım:</strong> Platform&apos;dan elde edilen verilerin, analizlerin veya raporların kısmen veya tamamen yeniden yayımlanması, dağıtılması veya satışa sunulması.</li>
                <li><strong className="text-foreground">Tersine Mühendislik:</strong> Platform&apos;un kaynak kodunun, algoritmalarının veya veri yapılarının tersine mühendislik, derleme veya çözümleme yoluyla elde edilmeye çalışılması.</li>
                <li><strong className="text-foreground">Dolandırıcılık:</strong> Sahte hesap bilgileri kullanmak, ödeme dolandırıcılığı yapmak veya ücretsiz deneme süresini kötüye kullanmak amacıyla birden fazla hesap oluşturmak.</li>
                <li><strong className="text-foreground">Güvenlik İhlali:</strong> Platform&apos;un güvenlik önlemlerini aşmaya, test etmeye veya devre dışı bırakmaya çalışmak.</li>
                <li><strong className="text-foreground">Zararlı Yazılım:</strong> Platform üzerinden veya Platform&apos;a yönelik virüs, truva atı, fidye yazılımı veya diğer zararlı yazılımların dağıtılması.</li>
                <li><strong className="text-foreground">Kimlik Sahteciliği:</strong> Başka bir kişi veya kuruluş gibi davranmak veya Platform yöneticisi olarak kendini tanıtmak.</li>
                <li><strong className="text-foreground">Yasadışı Kullanım:</strong> Platform&apos;un herhangi bir yasadışı faaliyet için kullanılması.</li>
              </ul>
            </section>

            {/* 8. Fikri Mülkiyet Hakları */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">8. Fikri Mülkiyet Hakları</h2>

              <p className="mb-2"><strong className="text-foreground">8.1. ValyzeTR&apos;nin Fikri Mülkiyeti</strong></p>
              <p>
                Platform&apos;un tasarımı, kaynak kodu, algoritmaları, logosu, grafikleri, kullanıcı arayüzü, içeriği ve tüm özgün materyalleri 5846 sayılı Fikir ve Sanat Eserleri Kanunu ve ilgili mevzuat kapsamında ValyzeTR&apos;nin münhasır fikri mülkiyetidir. Bu materyallerin izinsiz kopyalanması, çoğaltılması, dağıtılması veya türev eserler oluşturulması yasaktır.
              </p>

              <p className="mt-3 mb-2"><strong className="text-foreground">8.2. TikTok Mülkiyeti</strong></p>
              <p>
                TikTok adı, logosu, markaları ve TikTok platformu üzerindeki tüm içerikler TikTok Ltd. (ByteDance) ve ilgili hak sahiplerine aittir. ValyzeTR, TikTok ile herhangi bir ortaklık, bağlılık veya resmi iş birliği ilişkisi içinde değildir. Platform, kamuya açık verileri analiz eder ve bu veriler üzerinde bağımsız analizler sunar.
              </p>

              <p className="mt-3 mb-2"><strong className="text-foreground">8.3. Kullanıcı Hakları</strong></p>
              <p>
                Kullanıcılar, Platform üzerinden elde ettikleri analiz sonuçlarını ve raporları kendi kişisel veya meşru ticari içerik stratejileri için kullanabilirler. Ancak bu verilerin toplu olarak kopyalanması, yeniden yayımlanması, satışa sunulması veya rakip bir hizmet oluşturmak amacıyla kullanılması kesinlikle yasaktır.
              </p>
            </section>

            {/* 9. Veri Kullanımı ve Gizlilik */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">9. Veri Kullanımı ve Gizlilik</h2>
              <p>
                Kişisel verilerinizin işlenmesi, saklanması ve korunması hakkındaki tüm bilgiler{" "}
                <Link href="/privacy-policy" className="text-primary hover:underline">Gizlilik Politikası</Link>{" "}
                belgemizde detaylı olarak açıklanmaktadır. Platformu kullanarak Gizlilik Politikası&apos;nı da kabul etmiş sayılırsınız.
              </p>
              <p className="mt-2">
                ValyzeTR, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve ilgili mevzuat hükümlerine uygun olarak kişisel verileri işler. Kişisel verileriniz, hizmetlerin sunulması, iyileştirilmesi ve yasal yükümlülüklerin yerine getirilmesi amacıyla işlenir.
              </p>
              <p className="mt-2">
                Çerezlerin kullanımı hakkında detaylı bilgi için{" "}
                <Link href="/cookie-policy" className="text-primary hover:underline">Çerez Politikası</Link>{" "}
                belgemizi inceleyebilirsiniz.
              </p>
            </section>

            {/* 10. Hizmet Değişiklikleri ve Kesintiler */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">10. Hizmet Değişiklikleri ve Kesintiler</h2>

              <p className="mb-2"><strong className="text-foreground">10.1. Hizmet Değişiklikleri</strong></p>
              <p>
                ValyzeTR, Platform&apos;un özelliklerini, işlevlerini, kullanıcı arayüzünü ve içeriğini önceden bildirimde bulunarak veya bulunmaksızın güncelleme, değiştirme, ekleme veya kaldırma hakkını saklı tutar. Hizmeti iyileştirmek amacıyla yapılan değişiklikler Platform&apos;un doğal gelişim sürecinin bir parçasıdır.
              </p>

              <p className="mt-3 mb-2"><strong className="text-foreground">10.2. Planlı Bakım</strong></p>
              <p>
                Platform, bakım, güncelleme ve iyileştirme çalışmaları nedeniyle geçici olarak erişime kapatılabilir. Planlı bakım çalışmaları mümkün olduğunca önceden duyurulur ve düşük kullanım saatlerinde gerçekleştirilir.
              </p>

              <p className="mt-3 mb-2"><strong className="text-foreground">10.3. Üçüncü Taraf Bağımlılıkları</strong></p>
              <p>
                Platform, TikTok API&apos;leri ve diğer üçüncü taraf hizmetlere bağımlıdır. TikTok&apos;un API politikalarındaki değişiklikler, erişim kısıtlamaları veya hizmet kesintileri Platform&apos;un işlevselliğini etkileyebilir. Bu tür üçüncü taraf kaynaklı kesintilerden ValyzeTR sorumlu tutulamaz.
              </p>

              <p className="mt-3 mb-2"><strong className="text-foreground">10.4. Hizmetin Sonlandırılması</strong></p>
              <p>
                ValyzeTR, Platform&apos;u tamamen veya kısmen sonlandırma hakkını saklı tutar. Bu durumda aktif Pro Plan abonelerine kalan süreye ilişkin orantılı iade yapılır ve en az 30 gün öncesinden bildirimde bulunulur.
              </p>
            </section>

            {/* 11. Sorumluluk Sınırlaması */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">11. Sorumluluk Sınırlaması</h2>

              <p className="mb-2"><strong className="text-foreground">11.1. Hizmetin Sunumu</strong></p>
              <p>
                Platform ve tüm hizmetler &quot;olduğu gibi&quot; (as-is) ve &quot;mevcut haliyle&quot; (as-available) sunulmaktadır. ValyzeTR, Platform&apos;un kesintisiz, hatasız veya güvenli olacağına dair açık veya zımni hiçbir garanti vermemektedir.
              </p>

              <p className="mt-3 mb-2"><strong className="text-foreground">11.2. Analiz ve Tahminler</strong></p>
              <p>
                Platform üzerinden sunulan tüm analizler, tahminler, öneriler ve raporlar yalnızca bilgilendirme amaçlıdır. Bu verilerin doğruluğu, eksiksizliği veya güncelliği garanti edilmez. Kullanıcıların bu verilere dayanarak aldıkları kararlardan ValyzeTR sorumlu tutulamaz. İçerik stratejisi kararları Kullanıcı&apos;nın kendi sorumluluğundadır.
              </p>

              <p className="mt-3 mb-2"><strong className="text-foreground">11.3. Zarar Sınırlaması</strong></p>
              <p>
                ValyzeTR, Platform&apos;un kullanımından veya kullanılamamasından kaynaklanan doğrudan, dolaylı, özel, arızi, cezai veya sonuç olarak ortaya çıkan zararlardan (kâr kaybı, veri kaybı, itibar kaybı, iş kaybı dahil ancak bunlarla sınırlı olmamak üzere) sorumlu değildir. ValyzeTR&apos;nin toplam sorumluluğu, her halükarda Kullanıcı&apos;nın son 3 ay içinde ödediği abonelik ücretleri toplamını aşamaz.
              </p>
            </section>

            {/* 12. Hesap Askıya Alma ve Fesih */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">12. Hesap Askıya Alma ve Fesih</h2>
              <p className="mb-2">ValyzeTR, aşağıdaki durumlarda Kullanıcı&apos;nın hesabını önceden bildirimde bulunarak veya bulunmaksızın askıya alabilir veya kalıcı olarak feshedebilir:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>İşbu Kullanım Koşulları&apos;nın herhangi bir hükmünün ihlal edilmesi.</li>
                <li>Yasaklanan faaliyetlerde bulunulması (Madde 7).</li>
                <li>Platform güvenliğini tehdit eden veya diğer kullanıcıları olumsuz etkileyen etkinlikler.</li>
                <li>Pro Plan ödeme yükümlülüğüne uyulmaması veya ödeme bilgilerinin güncellenmemesi.</li>
                <li>Sahte, yanıltıcı veya yanlış hesap bilgileri kullanılması.</li>
                <li>12 aydan fazla süreyle hesapta hiçbir etkinlik gerçekleştirilmemesi (hareketsizlik).</li>
                <li>Yasal makamların talebi veya mahkeme kararı gereği.</li>
              </ul>
              <p className="mt-3">
                Kullanıcı, hesabını istediği zaman Platform üzerinden veya destek@valyze.app adresine yazılı bildirimde bulunarak kapatabilir. Hesap kapatma işlemi, aktif abonelik döneminin sonunda geçerli olur. Hesap kapatıldıktan sonra Kullanıcı&apos;nın verileri Gizlilik Politikası&apos;nda belirtilen süreler dahilinde silinir.
              </p>
            </section>

            {/* 13. Tazminat */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">13. Tazminat (Kullanıcı Yükümlülüğü)</h2>
              <p>
                Kullanıcı, Platform&apos;u işbu Sözleşme&apos;ye aykırı şekilde kullanması, üçüncü taraf haklarını ihlal etmesi veya yürürlükteki mevzuata aykırı davranması nedeniyle ValyzeTR&apos;nin, yöneticilerinin, çalışanlarının ve iş ortaklarının uğrayabileceği her türlü zarar, ziyan, kayıp, masraf (avukatlık ücretleri dahil) ve talepten ValyzeTR&apos;yi tazmin etmeyi ve zararsız kılmayı kabul ve taahhüt eder.
              </p>
            </section>

            {/* 14. Mücbir Sebepler */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">14. Mücbir Sebepler</h2>
              <p>
                Doğal afetler, savaş, terör, salgın hastalık, grev, lokavt, hükümet kararları, internet altyapısı arızaları, siber saldırılar, TikTok API değişiklikleri veya kesintileri, enerji kesintileri ve tarafların kontrolü dışındaki diğer öngörülemeyen olaylar mücbir sebep olarak kabul edilir.
              </p>
              <p className="mt-2">
                Mücbir sebep durumunda ValyzeTR&apos;nin yükümlülükleri, mücbir sebebin devam ettiği süre boyunca askıya alınır. ValyzeTR, mücbir sebebin etkilerini en aza indirmek için makul çabayı gösterir. Mücbir sebebin 90 günden fazla sürmesi halinde taraflardan her biri sözleşmeyi feshedebilir.
              </p>
            </section>

            {/* 15. Değişiklikler */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">15. Sözleşme Değişiklikleri</h2>
              <p>
                ValyzeTR, işbu Kullanım Koşulları&apos;nı herhangi bir zamanda güncelleme veya değiştirme hakkını saklı tutar.
              </p>
              <p className="mt-2">
                Esaslı değişiklikler (abonelik koşulları, fiyatlandırma, sorumluluk sınırlaması gibi Kullanıcı haklarını doğrudan etkileyen değişiklikler), yürürlüğe girmeden en az 30 gün önce kayıtlı e-posta adresinize ve/veya Platform üzerinden bildirim yoluyla duyurulur.
              </p>
              <p className="mt-2">
                Değişikliklerin yürürlüğe girmesinden sonra Platformu kullanmaya devam etmeniz, güncellenmiş Kullanım Koşulları&apos;nı kabul ettiğiniz anlamına gelir. Değişiklikleri kabul etmemeniz durumunda Platform kullanımını sonlandırmanız ve hesabınızı kapatmanız gerekmektedir.
              </p>
              <p className="mt-2">
                Güncellenmiş Kullanım Koşulları&apos;nın yürürlüğe girdiği tarih, bu sayfanın üst kısmında &quot;Son güncelleme&quot; tarihi olarak belirtilir.
              </p>
            </section>

            {/* 16. Bölünebilirlik */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">16. Bölünebilirlik</h2>
              <p>
                İşbu Sözleşme&apos;nin herhangi bir hükmünün yetkili bir mahkeme tarafından geçersiz, hükümsüz veya uygulanamaz bulunması durumunda, söz konusu hüküm Sözleşme&apos;den ayrılmış sayılır ve kalan hükümlerin geçerliliği, bağlayıcılığı ve uygulanabilirliği etkilenmez. Geçersiz bulunan hüküm, tarafların asıl niyetine en yakın şekilde geçerli bir hükümle değiştirilmiş sayılır.
              </p>
            </section>

            {/* 17. Uygulanacak Hukuk ve Yetkili Mahkeme */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">17. Uygulanacak Hukuk ve Yetkili Mahkeme</h2>
              <p>
                İşbu Kullanım Koşulları, Türkiye Cumhuriyeti kanunlarına tabi olup Türkiye Cumhuriyeti hukukuna göre yorumlanır.
              </p>
              <p className="mt-2">
                İşbu Sözleşme&apos;den doğan veya Sözleşme ile bağlantılı her türlü uyuşmazlığın çözümünde İstanbul Mahkemeleri ve İcra Daireleri münhasıran yetkilidir.
              </p>
              <p className="mt-2">
                Tüketici işlemlerinden kaynaklanan uyuşmazlıklarda, 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve ilgili yönetmelikler çerçevesinde Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri de yetkilidir.
              </p>
            </section>

            {/* 18. İletişim */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">18. İletişim</h2>
              <p className="mb-2">
                İşbu Kullanım Koşulları hakkında sorularınız, görüşleriniz veya şikayetleriniz için aşağıdaki kanallardan bize ulaşabilirsiniz:
              </p>
              <ul className="list-none space-y-1 ml-2">
                <li><strong className="text-foreground">E-posta:</strong> destek@valyze.app</li>
                <li><strong className="text-foreground">Web:</strong> valyze.vercel.app</li>
                <li><strong className="text-foreground">İletişim Formu:</strong>{" "}
                  <Link href="/contact" className="text-primary hover:underline">valyze.vercel.app/contact</Link>
                </li>
              </ul>
              <p className="mt-3">
                Destek taleplerinize en geç 48 saat içinde yanıt verilmesi hedeflenmektedir.
              </p>
            </section>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/privacy-policy" className="text-xs bg-card border border-border px-4 py-2 rounded-lg hover:border-primary/20 transition-colors">Gizlilik Politikası</Link>
            <Link href="/mesafeli-satis-sozlesmesi" className="text-xs bg-card border border-border px-4 py-2 rounded-lg hover:border-primary/20 transition-colors">Mesafeli Satış Sözleşmesi</Link>
            <Link href="/iptal-ve-iade" className="text-xs bg-card border border-border px-4 py-2 rounded-lg hover:border-primary/20 transition-colors">İptal ve İade</Link>
            <Link href="/cookie-policy" className="text-xs bg-card border border-border px-4 py-2 rounded-lg hover:border-primary/20 transition-colors">Çerez Politikası</Link>
            <Link href="/contact" className="text-xs bg-card border border-border px-4 py-2 rounded-lg hover:border-primary/20 transition-colors">İletişim</Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
            <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Gizlilik Politikası</Link>
            <Link href="/terms-of-service" className="hover:text-foreground transition-colors">Kullanım Koşulları</Link>
            <Link href="/mesafeli-satis-sozlesmesi" className="hover:text-foreground transition-colors">Mesafeli Satış Sözleşmesi</Link>
            <Link href="/iptal-ve-iade" className="hover:text-foreground transition-colors">İptal ve İade</Link>
            <Link href="/cookie-policy" className="hover:text-foreground transition-colors">Çerez Politikası</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">İletişim</Link>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground">&copy; 2026 ValyzeTR. Tüm hakları saklıdır.</p>
            <p className="text-[10px] text-muted-foreground">destek@valyze.app</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
