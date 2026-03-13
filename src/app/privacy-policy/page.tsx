"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import LogoLink from "@/components/LogoLink";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
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

          <h1 className="text-3xl font-bold mb-2">Gizlilik Politikası ve KVKK Aydınlatma Metni</h1>
          <p className="text-xs text-muted-foreground mb-10">Son güncelleme: 14 Mart 2026</p>

          <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">

            {/* ============================================ */}
            {/* PART A - KVKK AYDINLATMA METNİ               */}
            {/* ============================================ */}

            <div className="border-b border-border/50 pb-4">
              <h2 className="text-xl font-bold text-foreground">Bölüm A — KVKK Aydınlatma Metni</h2>
              <p className="mt-1 text-xs">6698 Sayılı Kişisel Verilerin Korunması Kanunu Kapsamında Aydınlatma Metni</p>
            </div>

            {/* 1. Veri Sorumlusu */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">1. Veri Sorumlusu</h2>
              <p>
                6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca, kişisel verileriniz
                veri sorumlusu sıfatıyla <strong className="text-foreground">ValyzeTR Yazılım ve Teknoloji</strong> (&quot;ValyzeTR&quot;, &quot;Şirket&quot;, &quot;biz&quot;)
                tarafından aşağıda açıklanan kapsamda işlenecektir.
              </p>
              <div className="mt-3 bg-card border border-border rounded-lg p-4 space-y-1">
                <p><strong className="text-foreground">Ticari Unvan:</strong> ValyzeTR Yazılım ve Teknoloji</p>
                <p><strong className="text-foreground">E-posta (Genel):</strong> destek@valyze.app</p>
                <p><strong className="text-foreground">E-posta (KVKK Başvuruları):</strong> kvkk@valyze.app</p>
                <p><strong className="text-foreground">Web Sitesi:</strong> valyze.vercel.app</p>
              </div>
              <p className="mt-3">
                ValyzeTR, TikTok trend analizi hizmeti sunan dijital bir SaaS (Hizmet Olarak Yazılım) platformudur.
                Platformumuz üzerinden herhangi bir fiziksel ürün satışı veya kargo/nakliye hizmeti sunulmamaktadır.
              </p>
            </section>

            {/* 2. Kişisel Verilerin İşlenme Amaçları */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">2. Kişisel Verilerin İşlenme Amaçları</h2>
              <p className="mb-2">Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Üyelik hesabınızın oluşturulması, doğrulanması ve yönetimi</li>
                <li>Platform hizmetlerinin sunulması ve işlevselliğinin sağlanması</li>
                <li>Abonelik planlarının (Ücretsiz Plan / Pro Plan — 299 TL/ay, KDV dahil) yönetimi</li>
                <li>iyzico altyapısı üzerinden ödeme işlemlerinin güvenli şekilde gerçekleştirilmesi</li>
                <li>Müşteri destek taleplerinin karşılanması ve iletişim faaliyetlerinin yürütülmesi</li>
                <li>Platform kullanım istatistiklerinin oluşturulması ve hizmet kalitesinin iyileştirilmesi</li>
                <li>Bilgi güvenliği süreçlerinin yürütülmesi, yetkisiz erişim ve dolandırıcılığın önlenmesi</li>
                <li>Yasal düzenlemelerden kaynaklanan yükümlülüklerin yerine getirilmesi</li>
                <li>Hukuki uyuşmazlıklarda delil olarak kullanılması gereken kayıtların saklanması</li>
                <li>İlgili mevzuat gereği yetkili kurum ve kuruluşlara bilgi sunulması</li>
              </ul>
            </section>

            {/* 3. İşlenen Kişisel Veriler */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">3. İşlenen Kişisel Veriler</h2>
              <p className="mb-3">Platformumuz tarafından işlenen kişisel veri kategorileri aşağıda belirtilmiştir:</p>

              <div className="space-y-3">
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-1">Kimlik Verileri</h3>
                  <p>Ad, soyad, kullanıcı adı</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-1">İletişim Verileri</h3>
                  <p>E-posta adresi</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-1">İşlem Güvenliği Verileri</h3>
                  <p>Şifre (bcrypt ile hashlenmiş), oturum bilgileri (JWT token), IP adresi, giriş/çıkış kayıtları</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-1">Finansal Veriler</h3>
                  <p>Abonelik planı, abonelik başlangıç/bitiş tarihleri, ödeme durumu. Not: Kredi kartı bilgileri
                    ValyzeTR tarafından saklanmaz; ödeme işlemleri iyzico altyapısı üzerinden gerçekleştirilir.</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-1">Cihaz ve Log Verileri</h3>
                  <p>IP adresi, tarayıcı türü ve sürümü, işletim sistemi, cihaz bilgisi, sayfa görüntüleme kayıtları,
                    erişim tarihi ve saati, yönlendirici URL</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-1">Kullanım Verileri</h3>
                  <p>Platform içerisindeki etkileşimler, ziyaret edilen sayfalar, kullanılan özellikler, arama sorguları,
                    favori/kayıt işlemleri</p>
                </div>
              </div>
            </section>

            {/* 4. Hukuki Sebepler */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">4. Kişisel Verilerin İşlenmesinin Hukuki Sebepleri</h2>
              <p className="mb-2">
                Kişisel verileriniz, KVKK&apos;nın 5. maddesinin 2. fıkrasında belirtilen aşağıdaki hukuki sebepler
                kapsamında işlenmektedir:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-foreground">Sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması (md. 5/2-c):</strong>{" "}
                  Üyelik sözleşmesi ve abonelik sözleşmesinin kurulması, platform hizmetlerinin sunulması, ödeme işlemlerinin gerçekleştirilmesi.
                </li>
                <li>
                  <strong className="text-foreground">Veri sorumlusunun hukuki yükümlülüğünü yerine getirmesi (md. 5/2-ç):</strong>{" "}
                  6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun, 6502 sayılı Tüketicinin Korunması Hakkında Kanun,
                  5651 sayılı İnternet Kanunu ve ilgili mevzuat kapsamındaki yükümlülükler.
                </li>
                <li>
                  <strong className="text-foreground">Bir hakkın tesisi, kullanılması veya korunması (md. 5/2-e):</strong>{" "}
                  Hukuki uyuşmazlıklarda delil teşkil edecek verilerin saklanması.
                </li>
                <li>
                  <strong className="text-foreground">Meşru menfaat (md. 5/2-f):</strong>{" "}
                  Platform güvenliğinin sağlanması, hizmet kalitesinin iyileştirilmesi, dolandırıcılığın önlenmesi,
                  istatistiksel analizlerin yapılması. Meşru menfaat işlemelerinde temel hak ve özgürlüklerinize zarar
                  verilmemesine özen gösterilmektedir.
                </li>
              </ul>
              <p className="mt-3">
                Açık rızanızın gerektiği hallerde (ör. pazarlama amaçlı elektronik ileti gönderimi) ayrıca
                açık rızanız talep edilecektir.
              </p>
            </section>

            {/* 5. Kişisel Verilerin Aktarılması */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">5. Kişisel Verilerin Aktarılması</h2>
              <p className="mb-3">
                Kişisel verileriniz, KVKK&apos;nın 8. ve 9. maddeleri kapsamında aşağıdaki alıcı gruplarına aktarılabilir:
              </p>

              <h3 className="font-semibold text-foreground mb-2">Yurt İçi Aktarım</h3>
              <ul className="list-disc list-inside space-y-1 ml-2 mb-4">
                <li>
                  <strong className="text-foreground">iyzico Ödeme Hizmetleri A.Ş.:</strong> Ödeme işlemlerinin güvenli
                  şekilde gerçekleştirilmesi amacıyla. iyzico, PCI DSS uyumlu bir ödeme altyapısı sunmakta olup
                  kredi kartı bilgileriniz yalnızca iyzico tarafından işlenmektedir.
                </li>
                <li>
                  <strong className="text-foreground">Yetkili kamu kurum ve kuruluşları:</strong> Yasal yükümlülükler
                  kapsamında talep edilmesi halinde.
                </li>
                <li>
                  <strong className="text-foreground">Hukuk danışmanları ve denetçiler:</strong> Hukuki uyuşmazlık
                  ve denetim süreçlerinde, gerekli olduğu ölçüde.
                </li>
              </ul>

              <h3 className="font-semibold text-foreground mb-2">Yurt Dışı Aktarım</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  <strong className="text-foreground">Vercel Inc. (ABD):</strong> Platform barındırma ve dağıtım hizmeti.
                  Standart sözleşme hükümleri (Standard Contractual Clauses) çerçevesinde veri aktarımı yapılmaktadır.
                </li>
                <li>
                  <strong className="text-foreground">Supabase Inc. (ABD):</strong> Veritabanı ve kimlik doğrulama hizmetleri.
                  Veriler şifreli bağlantılar üzerinden aktarılmaktadır.
                </li>
                <li>
                  <strong className="text-foreground">Analitik hizmet sağlayıcıları:</strong> Anonim kullanım istatistikleri
                  için, kişisel veri anonimleştirilerek aktarılmaktadır.
                </li>
              </ul>
              <p className="mt-3">
                Yurt dışına veri aktarımlarında KVKK&apos;nın 9. maddesinde öngörülen yeterli koruma düzeyinin sağlanması
                için standart sözleşme hükümleri ve ek teknik/idari tedbirler uygulanmaktadır.
              </p>
            </section>

            {/* 6. Veri Sahibinin Hakları */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">6. Veri Sahibinin Hakları</h2>
              <p className="mb-2">
                KVKK&apos;nın 11. maddesi uyarınca, kişisel veri sahibi olarak aşağıdaki haklara sahipsiniz:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
                <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                <li>Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
                <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme</li>
                <li>KVKK&apos;nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
                <li>Düzeltme, silme ve yok etme işlemlerinin kişisel verilerinizin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
                <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
                <li>Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme</li>
              </ul>
            </section>

            {/* 7. Başvuru Yöntemi */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">7. Başvuru Yöntemi</h2>
              <p className="mb-3">
                Yukarıda belirtilen haklarınızı kullanmak için aşağıdaki yöntemlerden biriyle başvurabilirsiniz:
              </p>
              <div className="bg-card border border-border rounded-lg p-4 space-y-2">
                <p>
                  <strong className="text-foreground">E-posta ile başvuru:</strong>{" "}
                  <a href="mailto:kvkk@valyze.app" className="text-primary hover:underline">kvkk@valyze.app</a>{" "}
                  adresine, &quot;KVKK Bilgi Talebi&quot; konulu e-posta göndererek.
                </p>
                <p>
                  <strong className="text-foreground">İletişim formu ile başvuru:</strong>{" "}
                  <Link href="/contact" className="text-primary hover:underline">İletişim sayfamız</Link> üzerinden
                  KVKK başvuru formunu doldurarak.
                </p>
              </div>
              <p className="mt-3">
                Başvurunuzda kimliğinizi teyit edici bilgiler, kullanıcı hesabınıza ait e-posta adresi ve
                talebinizin açık bir şekilde belirtilmesi gerekmektedir. Başvurularınız en geç <strong className="text-foreground">30 (otuz) gün</strong> içinde
                ücretsiz olarak sonuçlandırılacaktır. İşlemin ayrıca bir maliyet gerektirmesi halinde,
                Kişisel Verileri Koruma Kurulu tarafından belirlenen tarifedeki ücret alınabilir.
              </p>
            </section>

            {/* ============================================ */}
            {/* PART B - GİZLİLİK POLİTİKASI                */}
            {/* ============================================ */}

            <div className="border-b border-border/50 pb-4 pt-4">
              <h2 className="text-xl font-bold text-foreground">Bölüm B — Gizlilik Politikası</h2>
              <p className="mt-1 text-xs">ValyzeTR Platformu Gizlilik Politikası</p>
            </div>

            {/* 8. Toplanan Veriler */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">8. Toplanan Veriler</h2>
              <p className="mb-3">
                ValyzeTR platformunu kullandığınızda aşağıdaki veriler toplanmakta ve işlenmektedir:
              </p>

              <h3 className="font-semibold text-foreground mb-2">8.1 Hesap Bilgileri</h3>
              <p className="mb-3">
                Kayıt sırasında sağladığınız ad, soyad, e-posta adresi ve kullanıcı adı. Şifreniz bcrypt
                algoritması ile hashlenmiş olarak saklanır; düz metin olarak hiçbir zaman kaydedilmez.
              </p>

              <h3 className="font-semibold text-foreground mb-2">8.2 Ödeme Bilgileri</h3>
              <p className="mb-3">
                Pro Plan aboneliği (299 TL/ay, KDV dahil) için ödeme işlemleri tamamen <strong className="text-foreground">iyzico Ödeme Hizmetleri A.Ş.</strong> altyapısı
                üzerinden gerçekleştirilmektedir. Kredi kartı numarası, son kullanma tarihi ve CVV gibi hassas
                ödeme bilgileri ValyzeTR sunucularında saklanmaz. Bu bilgiler doğrudan PCI DSS uyumlu iyzico
                sisteminde işlenir. ValyzeTR yalnızca abonelik durumu, plan türü ve ödeme başarı/başarısızlık
                bilgisini saklar.
              </p>

              <h3 className="font-semibold text-foreground mb-2">8.3 Kullanım Verileri</h3>
              <p className="mb-3">
                Platform içerisindeki etkileşimleriniz, görüntülediğiniz sayfalar, kullandığınız özellikler
                (trend analizi, hashtag araştırması, ses analizi vb.), arama sorguları, kaydettiğiniz içerikler
                ve tercihleriniz.
              </p>

              <h3 className="font-semibold text-foreground mb-2">8.4 Cihaz ve Tarayıcı Bilgileri</h3>
              <p className="mb-3">
                IP adresi, tarayıcı türü ve sürümü, işletim sistemi, ekran çözünürlüğü, cihaz türü (masaüstü/mobil/tablet),
                dil tercihi, zaman dilimi, yönlendirici URL (referrer) bilgileri.
              </p>

              <h3 className="font-semibold text-foreground mb-2">8.5 Çerez Verileri</h3>
              <p>
                Oturum çerezleri, tercih çerezleri ve analitik çerezleri aracılığıyla toplanan veriler.
                Çerezler hakkında detaylı bilgi için{" "}
                <Link href="/cookie-policy" className="text-primary hover:underline">Çerez Politikası</Link> sayfamızı
                inceleyebilirsiniz.
              </p>
            </section>

            {/* 9. Verilerin Kullanım Amaçları */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">9. Verilerin Kullanım Amaçları</h2>
              <p className="mb-2">Toplanan veriler aşağıdaki amaçlarla kullanılmaktadır:</p>

              <h3 className="font-semibold text-foreground mb-1 mt-3">Hizmet Sunumu</h3>
              <ul className="list-disc list-inside space-y-1 ml-2 mb-3">
                <li>Hesabınızın oluşturulması, kimlik doğrulaması ve oturum yönetimi</li>
                <li>TikTok trend analizi, hashtag araştırması, ses/video analizi gibi platform özelliklerinin sunulması</li>
                <li>Abonelik yönetimi ve iyzico üzerinden güvenli ödeme işlemlerinin gerçekleştirilmesi</li>
                <li>Müşteri destek taleplerinin yanıtlanması</li>
              </ul>

              <h3 className="font-semibold text-foreground mb-1">Hizmet İyileştirme</h3>
              <ul className="list-disc list-inside space-y-1 ml-2 mb-3">
                <li>Platform kullanım istatistiklerinin analiz edilmesi</li>
                <li>Kullanıcı deneyiminin ve arayüzün geliştirilmesi</li>
                <li>Yeni özelliklerin planlanması ve mevcut özelliklerin optimize edilmesi</li>
                <li>Performans sorunlarının tespit edilmesi ve giderilmesi</li>
              </ul>

              <h3 className="font-semibold text-foreground mb-1">Güvenlik</h3>
              <ul className="list-disc list-inside space-y-1 ml-2 mb-3">
                <li>Yetkisiz erişim girişimlerinin tespit edilmesi ve engellenmesi</li>
                <li>Dolandırıcılık ve kötüye kullanımın önlenmesi</li>
                <li>Hesap güvenliğinin sağlanması</li>
                <li>Sistem bütünlüğünün korunması</li>
              </ul>

              <h3 className="font-semibold text-foreground mb-1">Yasal Yükümlülükler</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>6698 sayılı KVKK kapsamındaki yükümlülüklerin yerine getirilmesi</li>
                <li>6563 sayılı Elektronik Ticaret Kanunu kapsamında kayıt saklama yükümlülüğü</li>
                <li>5651 sayılı İnternet Kanunu kapsamında trafik bilgilerinin saklanması</li>
                <li>Vergi mevzuatı kapsamındaki beyan ve saklama yükümlülükleri</li>
              </ul>
            </section>

            {/* 10. Veri Güvenliği Tedbirleri */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">10. Veri Güvenliği Tedbirleri</h2>
              <p className="mb-3">
                ValyzeTR, kişisel verilerinizin güvenliğini sağlamak için endüstri standartlarında teknik ve
                idari tedbirler uygulamaktadır:
              </p>

              <h3 className="font-semibold text-foreground mb-2">Teknik Tedbirler</h3>
              <ul className="list-disc list-inside space-y-1 ml-2 mb-4">
                <li><strong className="text-foreground">Şifre güvenliği:</strong> Kullanıcı şifreleri bcrypt algoritması ile hashlenmiş olarak saklanır</li>
                <li><strong className="text-foreground">İletişim şifrelemesi:</strong> Tüm veri trafiği SSL/TLS (256-bit) şifreleme ile korunur</li>
                <li><strong className="text-foreground">Oturum yönetimi:</strong> JWT (JSON Web Token) tabanlı güvenli oturum yönetimi, httpOnly çerezler</li>
                <li><strong className="text-foreground">Veritabanı güvenliği:</strong> Şifreli bağlantılar, satır düzeyinde güvenlik politikaları (Row Level Security)</li>
                <li><strong className="text-foreground">Erişim kontrolü:</strong> Rol tabanlı erişim kontrolü (RBAC), en az yetki prensibi</li>
                <li><strong className="text-foreground">Güvenlik duvarı:</strong> Web uygulama güvenlik duvarı (WAF) ve DDoS koruması</li>
                <li><strong className="text-foreground">Düzenli güncellemeler:</strong> Yazılım bağımlılıklarının ve güvenlik yamalarının düzenli güncellenmesi</li>
              </ul>

              <h3 className="font-semibold text-foreground mb-2">İdari Tedbirler</h3>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Kişisel veri işleme envanterinin tutulması</li>
                <li>Veri işleme süreçlerinin düzenli olarak gözden geçirilmesi ve denetlenmesi</li>
                <li>Çalışanların veri güvenliği konusunda bilgilendirilmesi</li>
                <li>Veri ihlali durumunda müdahale planının bulundurulması</li>
                <li>Üçüncü taraf hizmet sağlayıcılarla veri işleme sözleşmelerinin yapılması</li>
              </ul>
            </section>

            {/* 11. Çerezler */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">11. Çerezler (Cookies)</h2>
              <p className="mb-3">
                ValyzeTR platformu, hizmetlerin sunulması ve kullanıcı deneyiminin iyileştirilmesi amacıyla
                çerez teknolojilerinden yararlanmaktadır. Kullanılan çerez türleri:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>
                  <strong className="text-foreground">Zorunlu Çerezler:</strong> Oturum yönetimi ve kimlik doğrulama
                  için gerekli olan çerezlerdir. Bu çerezler olmadan platform düzgün çalışamaz.
                </li>
                <li>
                  <strong className="text-foreground">İşlevsel Çerezler:</strong> Dil tercihi, tema seçimi gibi
                  kullanıcı tercihlerinin hatırlanması için kullanılır.
                </li>
                <li>
                  <strong className="text-foreground">Analitik Çerezler:</strong> Platformun nasıl kullanıldığını
                  anlamamıza yardımcı olan, anonim istatistiksel veriler toplayan çerezlerdir.
                </li>
              </ul>
              <p className="mt-3">
                Çerezlerin kullanımı, kapsamı ve yönetimi hakkında detaylı bilgi için{" "}
                <Link href="/cookie-policy" className="text-primary hover:underline">Çerez Politikası</Link> sayfamızı
                ziyaret edebilirsiniz. Tarayıcı ayarlarınızdan çerezleri yönetebilir veya devre dışı bırakabilirsiniz;
                ancak bu durumda platformun bazı özellikleri düzgün çalışmayabilir.
              </p>
            </section>

            {/* 12. Üçüncü Taraf Hizmetler */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">12. Üçüncü Taraf Hizmetler</h2>
              <p className="mb-3">
                ValyzeTR, hizmetlerinin sunulması için aşağıdaki üçüncü taraf hizmet sağlayıcılarıyla çalışmaktadır.
                Kişisel verileriniz pazarlama amacıyla üçüncü taraflarla paylaşılmaz.
              </p>

              <div className="space-y-3">
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-1">iyzico Ödeme Hizmetleri A.Ş.</h3>
                  <p><strong className="text-foreground">Amaç:</strong> Ödeme işlemlerinin güvenli şekilde gerçekleştirilmesi</p>
                  <p><strong className="text-foreground">İşlenen veriler:</strong> Ödeme için gerekli bilgiler (kredi kartı bilgileri yalnızca iyzico tarafından işlenir)</p>
                  <p><strong className="text-foreground">Güvenlik:</strong> PCI DSS Level 1 uyumlu, BDDK lisanslı ödeme kuruluşu</p>
                  <p className="mt-1 text-xs">
                    iyzico&apos;nun gizlilik politikası için:{" "}
                    <a href="https://www.iyzico.com/gizlilik-politikasi" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      iyzico.com/gizlilik-politikasi
                    </a>
                  </p>
                </div>

                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-1">Vercel Inc.</h3>
                  <p><strong className="text-foreground">Amaç:</strong> Platform barındırma, dağıtım ve CDN hizmetleri</p>
                  <p><strong className="text-foreground">Konum:</strong> ABD (Standart Sözleşme Hükümleri kapsamında)</p>
                </div>

                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-1">Supabase Inc.</h3>
                  <p><strong className="text-foreground">Amaç:</strong> Veritabanı yönetimi ve kimlik doğrulama hizmetleri</p>
                  <p><strong className="text-foreground">Konum:</strong> ABD (Şifreli bağlantılar üzerinden)</p>
                </div>

                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-1">Analitik Hizmetleri</h3>
                  <p><strong className="text-foreground">Amaç:</strong> Platform kullanım istatistiklerinin oluşturulması</p>
                  <p><strong className="text-foreground">İşlenen veriler:</strong> Anonimleştirilmiş kullanım verileri</p>
                </div>
              </div>
            </section>

            {/* 13. Veri Saklama Süreleri */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">13. Veri Saklama Süreleri</h2>
              <p className="mb-3">
                Kişisel verileriniz, işlenme amaçlarının gerektirdiği süre boyunca ve ilgili mevzuatın
                öngördüğü süreler dahilinde saklanmaktadır:
              </p>
              <div className="space-y-3">
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-1">Aktif Hesap Verileri</h3>
                  <p>Hesabınız aktif olduğu sürece saklanır.</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-1">Hesap Silme Sonrası</h3>
                  <p>Hesabınızı silmeniz halinde kişisel verileriniz <strong className="text-foreground">30 (otuz) gün</strong> içinde
                    kalıcı olarak silinir veya anonim hale getirilir. Bu süre, yanlışlıkla silme durumlarında
                    hesabınızın kurtarılabilmesi için tanınmaktadır.</p>
                </div>
                <div className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-1">Yasal Saklama Süreleri</h3>
                  <ul className="list-disc list-inside space-y-1 ml-2 mt-1">
                    <li>6563 sayılı Kanun kapsamında ticari elektronik iletişim kayıtları: <strong className="text-foreground">3 yıl</strong></li>
                    <li>5651 sayılı Kanun kapsamında trafik (log) verileri: <strong className="text-foreground">2 yıl</strong></li>
                    <li>6502 sayılı Kanun kapsamında tüketici işlem kayıtları: <strong className="text-foreground">3 yıl</strong></li>
                    <li>Vergi mevzuatı kapsamındaki mali kayıtlar: <strong className="text-foreground">5 yıl</strong></li>
                    <li>Genel zamanaşımı süreleri kapsamında sözleşme kayıtları: <strong className="text-foreground">10 yıl</strong></li>
                  </ul>
                </div>
              </div>
              <p className="mt-3">
                Saklama süresi dolan veriler, periyodik imha süreçleri kapsamında silinir, yok edilir veya
                anonim hale getirilir.
              </p>
            </section>

            {/* 14. Çocukların Gizliliği */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">14. Çocukların Gizliliği</h2>
              <p>
                ValyzeTR platformu, <strong className="text-foreground">18 yaşından büyük</strong> bireylere yönelik bir hizmet sunmaktadır.
                18 yaşından küçük bireylerin platformumuza üye olması veya platformumuzu kullanması
                kabul edilmemektedir. 18 yaşından küçük bir bireye ait kişisel verilerin işlendiğinin
                tespit edilmesi halinde, ilgili veriler derhal silinecektir.
              </p>
              <p className="mt-2">
                Ebeveynlerin veya yasal velilerin, çocuklarının bilgisi dahilinde veya bilgisi dışında
                platformumuza kayıt olduğunu düşünmeleri halinde, derhal{" "}
                <a href="mailto:kvkk@valyze.app" className="text-primary hover:underline">kvkk@valyze.app</a> adresinden
                bizimle iletişime geçmelerini rica ederiz.
              </p>
            </section>

            {/* 15. Uluslararası Veri Aktarımı */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">15. Uluslararası Veri Aktarımı</h2>
              <p>
                ValyzeTR, platform hizmetlerinin sunulması için yurt dışında bulunan hizmet sağlayıcılarıyla
                çalışmaktadır. Bu kapsamda kişisel verileriniz, KVKK&apos;nın 9. maddesi hükümleri doğrultusunda
                yurt dışına aktarılabilir.
              </p>
              <p className="mt-2">
                Yurt dışına veri aktarımında aşağıdaki güvenceler sağlanmaktadır:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                <li><strong className="text-foreground">Standart Sözleşme Hükümleri (SCC):</strong> AB Komisyonu tarafından onaylanan
                  standart sözleşme hükümleri çerçevesinde yeterli koruma sağlanmaktadır</li>
                <li><strong className="text-foreground">Teknik tedbirler:</strong> Aktarılan veriler SSL/TLS ile şifrelenmekte ve
                  erişim kontrollerine tabi tutulmaktadır</li>
                <li><strong className="text-foreground">Veri minimizasyonu:</strong> Yalnızca hizmetin sunulması için zorunlu olan
                  veriler aktarılmaktadır</li>
                <li><strong className="text-foreground">Sözleşmesel güvenceler:</strong> Hizmet sağlayıcılarla veri işleme sözleşmeleri
                  imzalanmaktadır</li>
              </ul>
            </section>

            {/* 16. Politika Değişiklikleri */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">16. Politika Değişiklikleri</h2>
              <p>
                Bu Gizlilik Politikası ve KVKK Aydınlatma Metni, yasal düzenlemeler veya hizmet değişiklikleri
                doğrultusunda güncellenebilir. Önemli değişiklikler yapılması halinde:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2 mt-2">
                <li>Kayıtlı e-posta adresinize bildirim gönderilecektir</li>
                <li>Platform içi bildirim yoluyla bilgilendirileceksiniz</li>
                <li>Güncellenmiş politika bu sayfada yayınlanacak ve &quot;Son güncelleme&quot; tarihi revize edilecektir</li>
              </ul>
              <p className="mt-2">
                Değişiklikler yayınlandığı tarihte yürürlüğe girer. Güncelleme sonrası platformu kullanmaya
                devam etmeniz, güncel politikayı kabul ettiğiniz anlamına gelir. Politikayı düzenli olarak
                kontrol etmenizi tavsiye ederiz.
              </p>
            </section>

            {/* 17. İletişim */}
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-3">17. İletişim</h2>
              <p className="mb-3">
                Gizlilik Politikası ve KVKK Aydınlatma Metni hakkında sorularınız, görüşleriniz veya
                başvurularınız için aşağıdaki kanallardan bize ulaşabilirsiniz:
              </p>
              <div className="bg-card border border-border rounded-lg p-4 space-y-2">
                <p><strong className="text-foreground">Genel Destek:</strong>{" "}
                  <a href="mailto:destek@valyze.app" className="text-primary hover:underline">destek@valyze.app</a>
                </p>
                <p><strong className="text-foreground">KVKK Başvuruları:</strong>{" "}
                  <a href="mailto:kvkk@valyze.app" className="text-primary hover:underline">kvkk@valyze.app</a>
                </p>
                <p><strong className="text-foreground">İletişim Formu:</strong>{" "}
                  <Link href="/contact" className="text-primary hover:underline">valyze.vercel.app/contact</Link>
                </p>
                <p><strong className="text-foreground">Web Sitesi:</strong>{" "}
                  <a href="https://valyze.vercel.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">valyze.vercel.app</a>
                </p>
              </div>
              <p className="mt-4 text-xs">
                <strong className="text-foreground">Veri Sorumlusu:</strong> ValyzeTR Yazılım ve Teknoloji
              </p>
            </section>
          </div>

          {/* Related links */}
          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/terms-of-service" className="text-xs bg-card border border-border px-4 py-2 rounded-lg hover:border-primary/20 transition-colors">Kullanım Şartları</Link>
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
            <Link href="/terms-of-service" className="hover:text-foreground transition-colors">Kullanım Şartları</Link>
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
