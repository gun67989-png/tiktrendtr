// Educational metric explanations for tooltips
// Provides Turkish-language explanations for dashboard metrics

export const METRIC_EXPLANATIONS = {
  viralScore: "Viral Skor, bir videonun viral potansiyelini 0-10 arasında ölçer. Etkileşim oranı (%35), görüntülenme büyümesi (%25), paylaşım oranı (%15), yorum aktivitesi (%15) ve güncellik (%10) ağırlıklarıyla hesaplanır.",
  engagementRate: "Etkileşim Oranı, bir videonun toplam etkileşimlerinin (beğeni + yorum + paylaşım) görüntülenme sayısına bölünmesiyle hesaplanır. TikTok'ta %3 üzeri iyi, %8 üzeri çok iyi kabul edilir.",
  surpriseFactor: "Sürpriz Faktörü, videonun takipçi sayısına göre ne kadar beklenmedik performans gösterdiğini ölçer. Yüksek sürpriz = düşük takipçili hesaptan yüksek etkileşim.",
  discoveryScore: "Keşfet Skoru, videonun takipçi tabanının ne kadar ötesine ulaştığını gösterir. Yüksek skor = video keşfet algoritmasında başarılı.",
  commentRate: "Yorum Oranı, izleyicilerin yorum bırakma eğilimini gösterir. %0.3 üzeri ortalama, %0.8 üzeri yüksek, %2 üzeri çok yüksek kabul edilir.",
  shareRate: "Paylaşım Oranı, videonun ne sıklıkla paylaşıldığını ölçer. Yüksek paylaşım oranı, içeriğin organik yayılma potansiyelini gösterir.",
  growthRate: "Büyüme Oranı, belirli bir süre içindeki artış yüzdesini gösterir. Hashtag, ses veya format bazında son 24-72 saatteki değişimi yansıtır.",
  retentionDays: "Veri Saklama Süresi, verilerinizin sistemde kaç gün saklanacağını gösterir. Süre dolduğunda eski veriler otomatik olarak silinir.",
  bestPostingTime: "En İyi Paylaşım Saati, veritabanındaki viral videoların paylaşım zamanlarına göre hesaplanır. Bu saatlerde paylaşım yapmanız daha yüksek erişim sağlayabilir.",
  trendConfidence: "Güven Skoru, bir trendin ne kadar güvenilir olduğunu gösterir. Yüksek skor = daha fazla veri noktası ve tutarlı büyüme paterni.",
} as const;

export type MetricKey = keyof typeof METRIC_EXPLANATIONS;
