import {
  FiHome,
  FiTrendingUp,
  FiBarChart2,
  FiMapPin,
  FiPlay,
  FiZap,
  FiHash,
  FiSearch,
  FiCopy,
  FiFilter,
  FiMusic,
  FiClock,
  FiStar,
  FiShoppingBag,
  FiHeart,
  FiInfo,
} from "react-icons/fi";
import type { TourStep } from "@/components/OnboardingTour";

/** ── Genel Bakış (Dashboard Overview) ── */
export const overviewTourSteps: TourStep[] = [
  {
    icon: FiHome,
    title: "Genel Bakis Paneli",
    description:
      "Bu sayfa TikTok trend verilerinin ozetini gosterir. Analiz edilen video sayisi, aktif trendler, ortalama etkilesim orani ve en iyi paylasim saatini tek bakista gorebilirsiniz.",
    color: "text-neon-red",
  },
  {
    icon: FiBarChart2,
    title: "30 Gunluk Grafik",
    description:
      "Son 30 gune ait video sayisi ve etkilesim oranini gorsel olarak takip edin. Kirmizi alan video sayisini, yesil alan etkilesim oranini gosterir.",
    color: "text-teal",
  },
  {
    icon: FiTrendingUp,
    title: "Trend Nisler",
    description:
      "En cok buyuyen icerik kategorilerini gorursunuz. Hangi nislerin yukseldigi buradan takip edebilirsiniz.",
    color: "text-purple-400",
  },
  {
    icon: FiMapPin,
    title: "Sehirler ve Formatlar",
    description:
      "Turkiye'de hangi sehirlerde trendler one cikiyor ve hangi video formatlari viral oluyor gorebilirsiniz.",
    color: "text-blue-400",
  },
  {
    icon: FiZap,
    title: "Yukselen Trendler",
    description:
      "Gercek zamanli yukselen trendleri, buyume oranlarini ve guvenilirlik skorlarini takip edin. Erken yakalanan trendler buyuk avantaj saglar.",
    color: "text-amber-400",
  },
];

/** ── Trend Videolar ── */
export const trendingVideosTourSteps: TourStep[] = [
  {
    icon: FiPlay,
    title: "Trend Videolar",
    description:
      "Turkiye'de su an viral olan TikTok videolarini burada bulabilirsiniz. Videolar viral skora gore siralanir.",
    color: "text-neon-red",
  },
  {
    icon: FiFilter,
    title: "Kategori Filtreleri",
    description:
      "Yemek, Komedi, Moda gibi kategorilere tiklayarak sadece o kategorideki videolari gorebilirsiniz.",
    color: "text-teal",
  },
  {
    icon: FiBarChart2,
    title: "Siralama Secenekleri",
    description:
      "Videolari viral skor, begeni orani, goruntulenme veya etkilesime gore siralayabilirsiniz. Amacli arama yapmanizi kolaylastirir.",
    color: "text-purple-400",
  },
  {
    icon: FiZap,
    title: "Video Detaylari",
    description:
      "Herhangi bir videoya tiklayarak detaylarina bakabilirsiniz: hashtag'ler, ses, begeni/yorum oranlari ve viral skor analizi.",
    color: "text-amber-400",
  },
];

/** ── Hashtag'ler ── */
export const hashtagsTourSteps: TourStep[] = [
  {
    icon: FiHash,
    title: "Trend Hashtag'ler",
    description:
      "Turkiye'de en cok kullanilan ve en hizli buyuyen hashtag'leri kesfedebilirsiniz. Her hashtag'in viral skoru ve haftalik buyume orani gorulur.",
    color: "text-neon-red",
  },
  {
    icon: FiSearch,
    title: "Arama ve Filtreleme",
    description:
      "Arama cubuguna yazarak spesifik hashtag'leri bulabilir, kategori butonlari ile filtreleyebilirsiniz.",
    color: "text-teal",
  },
  {
    icon: FiCopy,
    title: "Top 5 Kopyala",
    description:
      "\"Top 5 Kopyala\" butonuna tiklayarak en populer 5 hashtag'i tek seferde panoya kopyalayabilirsiniz. Direkt TikTok'a yapistirin.",
    color: "text-purple-400",
  },
  {
    icon: FiTrendingUp,
    title: "Trend Grafikleri",
    description:
      "Tablodaki mini grafikler hashtag'in son donemki trendini gosterir. Yesil yukselisi, kirmizi dususu ifade eder. Detay icin satirlara tiklayin.",
    color: "text-amber-400",
  },
];

/** ── Sesler ── */
export const soundsTourSteps: TourStep[] = [
  {
    icon: FiMusic,
    title: "Trend Sesler",
    description:
      "Viral videolarda en cok kullanilan sesleri kesfedebilirsiniz. Dogru ses secimi videonuzun viral olma sansini onemli olcude arttirir.",
    color: "text-teal",
  },
  {
    icon: FiSearch,
    title: "Ses Ara",
    description:
      "Ses adi veya yaratici adi ile arama yapabilirsiniz. Tur filtresi ile Hip Hop, Pop gibi kategorileri filtreleyebilirsiniz.",
    color: "text-neon-red",
  },
  {
    icon: FiTrendingUp,
    title: "Buyume Oranlari",
    description:
      "Her sesin kullanim sayisi, haftalik buyume orani, BPM ve suresi gorulur. Hizla yukselen sesler \"Hizla yukseliyor\" etiketi alir.",
    color: "text-purple-400",
  },
];

/** ── Paylaşım Zamanları ── */
export const postingTimesTourSteps: TourStep[] = [
  {
    icon: FiClock,
    title: "Paylasim Zamanlari",
    description:
      "Bu sayfa videolarinizi ne zaman paylasmaniz gerektigini gosterir. Veriler Turkiye'deki viral videolarin analizine dayanir.",
    color: "text-amber-400",
  },
  {
    icon: FiStar,
    title: "En Iyi 5 Zaman",
    description:
      "Sayfanin ustundeki kartlar en yuksek etkilesim alan 5 gun-saat kombinasyonunu gosterir. Bu zamanlarda paylasim yapmaniz onerilir.",
    color: "text-neon-red",
  },
  {
    icon: FiBarChart2,
    title: "Isi Haritasi",
    description:
      "Renk skalasi etkilesim yogunlugunu gosterir. Koyu kirmizi = en yuksek etkilesim. Bir hucrenin uzerine gelerek detay gorebilirsiniz.",
    color: "text-teal",
  },
  {
    icon: FiInfo,
    title: "Ipuclari",
    description:
      "Sayfanin altindaki ipucu kartlari genel paylasim stratejilerini icerir: Prime time 19:00-23:00, hafta sonu +%15, Cuma aksami +%20 gibi.",
    color: "text-purple-400",
  },
];

/** ── Reklam Fikirleri ── */
export const adIdeasTourSteps: TourStep[] = [
  {
    icon: FiShoppingBag,
    title: "Reklam Fikirleri",
    description:
      "Urun tanitimi, inceleme ve sponsorlu icerik gibi reklam formatlarinda viral olan videolari inceleyebilirsiniz.",
    color: "text-orange-400",
  },
  {
    icon: FiHeart,
    title: "Begeni Orani (Like Ratio)",
    description:
      "Begeni/goruntulenme orani bir videonun kalitesinin en iyi gostergesidir. %%10 ustu oran olaganustu performans anlamina gelir.",
    color: "text-neon-red",
  },
  {
    icon: FiFilter,
    title: "Format Filtreleri",
    description:
      "UGC Reklam, Urun Deneyimi, Haul, Unboxing gibi reklam formatlarina gore filtreleme yapabilirsiniz.",
    color: "text-teal",
  },
];
