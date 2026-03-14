import {
  Home,
  TrendingUp,
  BarChart2,
  MapPin,
  Play,
  Zap,
  Hash,
  Search,
  Copy,
  Filter,
  Music,
  Clock,
  Star,
  Heart,
  Info,
} from "lucide-react";
import type { TourStep } from "@/components/OnboardingTour";

/** ── Genel Bakış (Dashboard Overview) ── */
export const overviewTourSteps: TourStep[] = [
  {
    icon: Home,
    title: "Genel Bakis Paneli",
    description:
      "Valyze TR'nin ana kontrol merkezine hos geldiniz! Burada analiz edilen video sayisi, aktif trendler, ortalama etkilesim orani ve en iyi paylasim saatini tek bakista gorebilirsiniz.",
    color: "text-neon-red",
  },
  {
    icon: BarChart2,
    title: "30 Gunluk Performans Grafigi",
    description:
      "Son 30 gundeki video ve etkilesim trendlerini gorsel olarak takip edin. Kirmizi cizgi video sayisini, yesil cizgi etkilesim oranini gosterir. Yukselen trendleri erken yakalamak icin bu grafigi duzenli kontrol edin.",
    color: "text-teal",
  },
  {
    icon: TrendingUp,
    title: "Trend Nisler",
    description:
      "Turkiye'de en hizli buyuyen icerik kategorilerini kesfet. Moda, Yemek, Teknoloji gibi nislerin haftalik buyume yuzdesini takip ederek icerik stratejini buna gore sekillendirin.",
    color: "text-purple-400",
  },
  {
    icon: MapPin,
    title: "Sehir ve Format Analizi",
    description:
      "Hangi sehirlerde hangi trendler one cikiyor? Hangi video formatlari (duet, stitch, POV) daha cok viral oluyor? Hedef kitlenize gore stratejinizi optimize edin.",
    color: "text-blue-400",
  },
  {
    icon: Zap,
    title: "Canli Yukselen Trendler",
    description:
      "Su anda hizla yukselen trendleri, buyume oranlarini ve guvenilirlik skorlarini anlik takip edin. Trende erken binmek buyuk avantaj saglar!",
    color: "text-amber-400",
  },
];

/** ── Trend Videolar ── */
export const trendingVideosTourSteps: TourStep[] = [
  {
    icon: Play,
    title: "Viral Video Kesfet",
    description:
      "Turkiye'de su an en cok izlenen ve paylasilan TikTok videolarini kesfet. Videolar viral skora gore siralanir — en guclu icerikler en ustte!",
    color: "text-neon-red",
  },
  {
    icon: Filter,
    title: "Kategori Filtreleri",
    description:
      "Yemek, Komedi, Moda, Teknoloji gibi kategorilere tiklayarak ilgi alaniniza uygun videolari hizlica bulun.",
    color: "text-teal",
  },
  {
    icon: BarChart2,
    title: "Akilli Siralama",
    description:
      "Viral skor, begeni orani, goruntulenme veya etkilesime gore siralama yapin. Amacli arama ile tam ihtiyaciniz olan icerigi bulun.",
    color: "text-purple-400",
  },
  {
    icon: Zap,
    title: "Video Detay Analizi",
    description:
      "Bir videoya tiklayarak detaylarina ulas: kullanilan hashtag'ler, ses, begeni/yorum oranlari ve viral skor cozumlemesi. Basarili iceriklerin formülünü kesfet!",
    color: "text-amber-400",
  },
];

/** ── Hashtag'ler ── */
export const hashtagsTourSteps: TourStep[] = [
  {
    icon: Hash,
    title: "Trend Hashtag Analizi",
    description:
      "Turkiye'de en cok kullanilan ve en hizli buyuyen hashtag'leri kesfet. Her hashtag'in viral skoru, kullanim sayisi ve haftalik buyume orani gorulur.",
    color: "text-neon-red",
  },
  {
    icon: Search,
    title: "Hashtag Ara ve Filtrele",
    description:
      "Arama cubuguna yazarak spesifik hashtag'leri bulun veya kategori butonlari ile filtreleme yapin. Nisinize uygun hashtag'leri kolayca kesfet.",
    color: "text-teal",
  },
  {
    icon: Copy,
    title: "Tek Tikla Kopyala",
    description:
      "\"Top 5 Kopyala\" butonuna tiklayarak en populer 5 hashtag'i panoya kopyala. Dogrudan TikTok'a yapistirin — vakit kaybetmeyin!",
    color: "text-purple-400",
  },
  {
    icon: TrendingUp,
    title: "Trend Grafikleri",
    description:
      "Mini grafikler hashtag'in son donemki performansini gosterir. Yesil yukselis, kirmizi dusus demek. Detay icin satira tiklayin.",
    color: "text-amber-400",
  },
];

/** ── Sesler ── */
export const soundsTourSteps: TourStep[] = [
  {
    icon: Music,
    title: "Trend Sesler",
    description:
      "Viral videolarda en cok kullanilan sesleri kesfet. Dogru ses secimi videonuzun erisimini ve viral olma sansini ciddi olcude arttirir.",
    color: "text-teal",
  },
  {
    icon: Search,
    title: "Ses Arama",
    description:
      "Ses adi veya yaratici adi ile arama yapin. Tur filtresi (Hip Hop, Pop, Elektronik) ile aramanizi daraltabilirsiniz.",
    color: "text-neon-red",
  },
  {
    icon: TrendingUp,
    title: "Buyume Takibi",
    description:
      "Her sesin kullanim sayisi, haftalik buyume orani, BPM ve suresi gorulur. \"Hizla yukseliyor\" etiketli seslere oncelik verin!",
    color: "text-purple-400",
  },
];

/** ── Paylaşım Zamanları ── */
export const postingTimesTourSteps: TourStep[] = [
  {
    icon: Clock,
    title: "En Iyi Paylasim Zamanlari",
    description:
      "Videolarinizi ne zaman paylasmaniz gerektigini veri odakli ogren. Tum veriler Turkiye'deki viral videolarin gercek analizine dayanir.",
    color: "text-amber-400",
  },
  {
    icon: Star,
    title: "Altin Saatler",
    description:
      "En yuksek etkilesim alan 5 gun-saat kombinasyonu. Bu \"altin saatlerde\" paylasim yaparak erisim potansiyelinizi maximize edin.",
    color: "text-neon-red",
  },
  {
    icon: BarChart2,
    title: "Etkilesim Isi Haritasi",
    description:
      "Renk skalasi etkilesim yogunlugunu gosterir: koyu kirmizi = en yuksek etkilesim. Bir hucrenin uzerine gelerek detay goruntuleyin.",
    color: "text-teal",
  },
  {
    icon: Info,
    title: "Strateji Ipuclari",
    description:
      "Prime time 19:00-23:00 arasi, hafta sonu +%15 daha fazla erisim, Cuma aksami +%20 bonus. Bu bilgilerle iceriklerin zamanlamasini optimize edin.",
    color: "text-purple-400",
  },
];

/** ── Sektörel Hook Kütüphanesi ── */
export const hookLibraryTourSteps: TourStep[] = [
  {
    icon: Zap,
    title: "Hook Kutuphanesi",
    description:
      "Sektorunuze ozel viral giris cumlelerini (hook) kesfet. Kozmetik, Teknoloji, Moda gibi nislere gore filtreleme yapin.",
    color: "text-amber-400",
  },
  {
    icon: Star,
    title: "Hook Performansi",
    description:
      "Her hook'un viral skoru, kullanim ornekleri ve etkilesim orani gorulur. Yuksek skorlu hook'lari iceriklerinize uyarlayin.",
    color: "text-teal",
  },
  {
    icon: Copy,
    title: "Kopyala ve Kullan",
    description:
      "Begendginiz hook'u tek tikla kopyalayin. AI ile kendi nisinize ozel yeni hook'lar da uretebilirsiniz.",
    color: "text-purple-400",
  },
];

/** ── Duygu Analizi ── */
export const sentimentTourSteps: TourStep[] = [
  {
    icon: Heart,
    title: "Duygu Analizi",
    description:
      "Video yorumlarinin duygusal tonunu analiz edin. Pozitif, negatif ve notr dagilimini goruntuleyin.",
    color: "text-neon-red",
  },
  {
    icon: TrendingUp,
    title: "Duygu Trendi",
    description:
      "Son 7-30 gundeki duygu degisimini takip edin. Duygu trendleri icerik stratejinizi sekillendirir.",
    color: "text-teal",
  },
  {
    icon: BarChart2,
    title: "Kategori Bazli Duygu",
    description:
      "Hangi kategorilerde izleyiciler daha pozitif? Nisinizin duygu haritasini cikartin ve iceriginizi buna gore optimize edin.",
    color: "text-purple-400",
  },
];
