"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PremiumGate from "@/components/PremiumGate";
import {
  Search,
  Brain,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Loader2,
  Zap,
  Users,
  TrendingDown,
  Crosshair,
  Activity,
  Copy,
  Check,
  Sparkles,
  MessageSquare,
  ThumbsUp,
  BarChart3,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString("tr-TR");
}

interface AnalysisData {
  username: string;
  videoCount: number;
  analysis_data: {
    video_count: number;
    total_views: number;
    total_likes: number;
    total_comments: number;
    total_shares: number;
    avg_engagement_rate: number;
    summary: string;
  };
  metrics: {
    hate_watching: {
      score: number;
      comment_to_view_ratio: number;
      negativity_estimate: number;
      label: string;
    };
    anchor_points: {
      score: number;
      triggers: string[];
      top_hashtags: string[];
      caption_keywords: string[];
      engagement_spike_indicators: string[];
    };
    drop_off: {
      score: number;
      estimated_avg_watch_percent: number;
      duration_engagement_ratio: number;
      label: string;
    };
    demographics: {
      score: number;
      estimated_age_range: string;
      socioeconomic_tier: string;
      language_complexity: string;
      peak_activity_hours: string[];
      category_affinity: string[];
    };
    sentiment_drift: {
      score: number;
      like_dislike_ratio: number;
      comment_velocity: number;
      drift_direction: "positive" | "negative" | "neutral";
      label: string;
    };
  };
  viral_post_drafts: Array<{
    id: number;
    text: string;
    hook_type: string;
    estimated_engagement: string;
    target_emotion: string;
  }>;
  ai_commentary: {
    editorial: string;
    hate_watching: string;
    anchor_points: string;
    drop_off: string;
    demographics: string;
    sentiment_drift: string;
    comment_analysis?: {
      total_analyzed: number;
      clusters: Array<{
        theme: string;
        percentage: number;
        example_comments: string[];
        insight: string;
      }>;
      striking_findings: string[];
      top_comments: Array<{
        text: string;
        likes: number;
        why_important: string;
      }>;
      sentiment_breakdown: {
        positive_pct: number;
        negative_pct: number;
        neutral_pct: number;
      };
    };
  } | null;
  comments_data: {
    total_fetched: number;
    videos_analyzed: number;
    top_comments: Array<{ username: string; text: string; likes: number }>;
  };
}

const METRIC_CONFIG = [
  { key: "hate_watching", label: "Nefret-Izleme", icon: Eye, color: "text-red-400", bg: "bg-red-400/10" },
  { key: "anchor_points", label: "Capa Noktasi", icon: Crosshair, color: "text-blue-400", bg: "bg-blue-400/10" },
  { key: "drop_off", label: "Izleyici Tutma", icon: TrendingDown, color: "text-teal", bg: "bg-teal/10" },
  { key: "demographics", label: "Demografik", icon: Users, color: "text-purple-400", bg: "bg-purple-400/10" },
  { key: "sentiment_drift", label: "Duygu Kaymasi", icon: Activity, color: "text-orange-400", bg: "bg-orange-400/10" },
] as const;

function ScoreBar({ score, color }: { score: number; color: string }) {
  const barColor = score >= 70 ? "bg-red-500" : score >= 40 ? "bg-yellow-500" : "bg-teal";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2.5 bg-border/30 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8 }}
          className={`h-full rounded-full ${barColor}`}
        />
      </div>
      <span className={`text-sm font-bold w-10 text-right ${color}`}>{score}</span>
    </div>
  );
}

function generateFallbackCommentary(data: AnalysisData) {
  const m = data.metrics;
  const d = data.analysis_data;
  const engRate = d.avg_engagement_rate;
  const commentRatio = m.hate_watching.comment_to_view_ratio;
  const watchPct = m.drop_off.estimated_avg_watch_percent;

  const editorial = `@${data.username} profilinin ${d.video_count} videosu uzerinden yapilan derinlemesine analiz, ilginc psikolojik oruntuleri ortaya koyuyor. ` +
    `Toplam ${formatNumber(d.total_views)} goruntulenmede %${engRate} etkilesim oranina sahip bu profil, ` +
    (engRate > 8 ? `izleyicileriyle guclu bir duygusal bag kurmayı basaran nadir hesaplardan biri.` :
     engRate > 3 ? `ortalama ustu bir izleyici bagliligi sergiliyor.` :
     `izleyici bagliligini artirmasi gereken bir profil olarak one cikiyor.`) +
    `\n\n` +
    `Izleyici tutma orani %${watchPct} seviyesinde - bu, ` +
    (watchPct > 75 ? `izleyicilerin buyuk cogunlugunun videoyu sonuna kadar izledigini gosteren guclu bir 'psikolojik baglama' isaretdir. Icerikler, izleyicinin dikkatini dagitmadan sonuca tasimayı basariyor.` :
     watchPct > 50 ? `izleyicilerin yarisından fazlasinin videoyu tamamladigini gosteren makul bir tutuculuk. Ancak videonun ilk 3-5 saniyesinde bir 'kopma noktasi' olabilir.` :
     `ciddi bir 'izleyici kaybi' (drop-off) sinyali. Izleyicilerin onemli bir kismi videonun ilk saniyelerinde ayrilıyor - bu da 'psikolojik kopma' yasandigini gosteriyor.`) +
    `\n\n` +
    (m.hate_watching.score > 50 ? `Dikkat cekici bir bulgu: Nefret-izleme endeksi ${m.hate_watching.score}/100 ile yuksek. Yorum/goruntuleme orani %${commentRatio} - bu, icerigin 'nefret-izleme dongusu' yarattıgını, izleyicilerin begenmese bile izlemeye devam ettigini gosteriyor.` :
     `Nefret-izleme endeksi ${m.hate_watching.score}/100 ile dusuk seyrediyor - icerik, 'nefret-izleme' degil gercek ilgi uzerinden etkilesim aliyor.`) +
    `\n\n` +
    `Demografik haritaya gore, ${m.demographics.estimated_age_range} yas araligindaki ${m.demographics.socioeconomic_tier.toLowerCase()} gelir grubundaki izleyiciler ana kitleyi olusturuyor. ` +
    `Duygu kaymasi ${m.sentiment_drift.drift_direction === "positive" ? "pozitif" : m.sentiment_drift.drift_direction === "negative" ? "negatif" : "notr"} yonde ilerliyor - ` +
    (m.sentiment_drift.score > 50 ? `bu da izleyici kitlesinde belirgin bir 'duygusal kutuplaşma' oldugunu gosteriyor.` : `bu da izleyici kitlesinin duygusal olarak stabil oldugunu gosteriyor.`);

  const hate_watching = m.hate_watching.score > 50
    ? `Yorum/goruntuleme orani %${commentRatio} ile dikkat cekici derecede yuksek. Bu, izleyicilerin onemli bir kisminin 'nefret-izleme dongusu'ne girdigini, icerigi begenmese de izlemeye ve yorum yapmaya devam ettigini ortaya koyuyor. Olumsuzluk tahmini %${m.hate_watching.negativity_estimate} seviyesinde.`
    : `Nefret-izleme endeksi ${m.hate_watching.score}/100 ile saglikli seviyede. Izleyiciler icerigi gercekten sevdikleri icin etkilesime geciyorlar, 'nefret-izleme' motivasyonu dusuk. Yorum/goruntuleme orani %${commentRatio} ile organik etkilesimi dogruluyor.`;

  const anchor_points = `Capa noktasi skoru ${m.anchor_points.score}/100 - ` +
    (m.anchor_points.score > 60
      ? `icerik, izleyicinin dikkatini yakalayan guclu 'bilincalti tetikleyiciler' kullaniyor. ${m.anchor_points.top_hashtags.slice(0, 3).map(h => h).join(", ")} gibi hashtag'ler, izleyicinin icerige duygusal olarak baglanmasini saglayan 'capa noktalari' olusturuyor.`
      : `icerik, izleyicinin dikkatini yakalamak icin daha guclu 'capa noktalari'na ihtiyac duyuyor. Hashtag stratejisi ve caption anahtar kelimeleri guclendirilebilir.`);

  const drop_off = `Tahmini izleme orani %${watchPct} - ` +
    (watchPct > 75
      ? `bu, izleyicilerin buyuk cogunlugunun videoyu sonuna kadar izledigini gosteren mukemmel bir sinyal. 'Psikolojik kopma' orani cok dusuk, icerik izleyiciyi sonuna kadar 'bagli' tutuyor.`
      : watchPct > 50
      ? `izleyicilerin yarısından fazlasi videoyu tamamliyor, ancak belirli bir noktada 'izleyici kaybi' yaşaniyor. Video suresi/etkilesim orani ${m.drop_off.duration_engagement_ratio} - bu, videonun belirli bir aninda 'psikolojik kopma noktasi' oldugunu isaret ediyor.`
      : `ciddi bir 'izleyici kaybi' sinyali. Izleyicilerin buyuk kismi videonun ilk saniyelerinde ayrilıyor. Sure/etkilesim orani ${m.drop_off.duration_engagement_ratio} ile 'hizli terk' paternini dogruluyor.`);

  const demographics = `Hedef kitle ${m.demographics.estimated_age_range} yas araliginda, ${m.demographics.socioeconomic_tier.toLowerCase()} sosyoekonomik katmandan. ` +
    `Dil karmasikligi '${m.demographics.language_complexity.toLowerCase()}' seviyesinde - bu, icerigin ` +
    (m.demographics.language_complexity === "Düşük" || m.demographics.language_complexity === "Dusuk"
      ? `genis kitlelere hitap eden, kolay tuketilebilir bir dil kullanidigini gosteriyor. 'Viral yayilma' potansiyeli yuksek.`
      : `belirli bir egitim seviyesindeki izleyicilere hitap ettigini ve 'nis kitle' stratejisi izledigini gosteriyor.`);

  const sentiment_drift = `Duygu kaymasi ${m.sentiment_drift.drift_direction === "positive" ? "pozitif" : m.sentiment_drift.drift_direction === "negative" ? "negatif" : "notr"} yonde, skor ${m.sentiment_drift.score}/100. ` +
    `Yorum hizi ${m.sentiment_drift.comment_velocity} ile ` +
    (m.sentiment_drift.comment_velocity > 1
      ? `yuksek - izleyiciler icerigi izledikten sonra hizla yorum yaziyor, bu da guclu bir 'duygusal tetikleme' mekanizmasinin calistigini gosteriyor.`
      : `normal seviyede - izleyiciler duygusal olarak stabil bir sekilde etkilesime geciyor, ani 'duygusal patlamalar' yok.`);

  return { editorial, hate_watching, anchor_points, drop_off, demographics, sentiment_drift };
}

function generateFallbackCommentAnalysis(
  topComments: Array<{ username: string; text: string; likes: number }>,
  totalFetched: number
) {
  if (!topComments || topComments.length === 0) return null;

  const totalLikes = topComments.reduce((sum, c) => sum + c.likes, 0);
  const avgLikes = Math.round(totalLikes / topComments.length);

  // Detect language patterns
  const languages = new Set<string>();
  topComments.forEach(c => {
    if (/[a-zA-Z]{3,}/.test(c.text)) languages.add("en");
    if (/[ğüşöçıİĞÜŞÖÇ]/.test(c.text)) languages.add("tr");
    if (/[áéíóúñ¿¡]/.test(c.text)) languages.add("es");
    if (/[ãõçê]/.test(c.text)) languages.add("pt");
  });
  const isMultilingual = languages.size > 1;

  // Detect emoji usage
  const emojiComments = topComments.filter(c => /[\u{1F600}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F300}-\u{1F5FF}]/u.test(c.text));
  const emojiPct = Math.round((emojiComments.length / topComments.length) * 100);

  // Detect short vs long comments
  const shortComments = topComments.filter(c => c.text.length < 30);
  const shortPct = Math.round((shortComments.length / topComments.length) * 100);

  const editorial_comment = `${totalFetched} yorum incelendiginde, en cok begenilen ${topComments.length} yorumun toplam ${formatNumber(totalLikes)} begeni topladigi gorulur. ` +
    `Bu da her bir ust yorumun ortalama ${formatNumber(avgLikes)} begeni aldigini gosteriyor - bu, izleyicilerin sadece video izlemekle yetinmeyip, birbirlerinin yorumlarini da aktif olarak 'onayladiginin' kaniti. ` +
    (isMultilingual
      ? `Dikkat cekici bir detay: Yorumlar birden fazla dilde yazilmis. Bu, icerigin dil bariyerini asan 'evrensel bir psikolojik cekicilige' sahip oldugunu gosteriyor.`
      : `Yorumlardaki dil oruntuleri, izleyici kitlesinin belirli bir cografya ve kultur grubunda yogunlastigini ortaya koyuyor.`) +
    (emojiPct > 50
      ? ` Yorumlarin %${emojiPct}'i emoji iceriyor - bu, izleyicilerin duygularini kelimelerle ifade etmekte zorlandigi, 'duygusal tasman' yasadigi anlamina geliyor.`
      : emojiPct > 20
      ? ` Yorumlarin %${emojiPct}'inde emoji kullanilmis - ortalama bir duygusal ifade orani.`
      : ` Emoji kullanimi dusuk (%${emojiPct}) - izleyiciler daha cok sozel ifadeyi tercih ediyor, bu da daha 'bilincli bir izleyici kitlesi' isaretdir.`) +
    (shortPct > 60
      ? ` Ilginc bir bulgu: Yorumlarin %${shortPct}'i 30 karakterden kisa. Bu 'ani reaksiyon' paterni, izleyicilerin icerigi izlerken dusunmeden, icgudusel olarak yorum biraktigini gosteriyor.`
      : ``);

  // Generate per-comment insights
  const commentInsights = topComments.map((c, i) => {
    const likeRatio = totalLikes > 0 ? Math.round((c.likes / totalLikes) * 100) : 0;
    let insight = "";

    if (i === 0) {
      insight = `En cok begenilen yorum olarak, tum ust yorumlardaki begenilerin %${likeRatio}'ini tek basina toplamis. Bu, izleyici kitlesinin 'kolektif sesi' niteliginde - cogunluk bu duyguyla ozdesim kuruyor.`;
    } else if (c.text.length < 20) {
      insight = `Kisa ama etkili: ${c.text.length} karakterlik bu yorum ${formatNumber(c.likes)} begeni almis. Izleyiciler, kisa ve vurgulu ifadelere guclu tepki veriyor - 'az soz cok etki' prensibi.`;
    } else if (/[!]{2,}|[A-Z]{4,}|😂|🤣|💀/.test(c.text)) {
      insight = `Guclu duygusal reaksiyon iceriyor. Bu tarz 'patlamali' ifadeler, icerigin izleyicide beklenmedik bir duygusal tetikleme yarattigini gosteriyor.`;
    } else if (/\?/.test(c.text)) {
      insight = `Soru formundaki bu yorum, izleyicinin merak duygusunun tetiklendigini gosteriyor. ${formatNumber(c.likes)} kisi ayni merakı paylasmis - potansiyel bir 'devam icerigi' firsati.`;
    } else {
      insight = `Ust yorumlarin %${likeRatio}'lik begeni payina sahip. Yorumun tonu ve uzunlugu, izleyici kitlesinin etkilesim tercihleri hakkında ipucu veriyor.`;
    }

    return { ...c, insight, likeRatio };
  });

  return {
    editorial_comment,
    commentInsights,
    stats: {
      totalLikes,
      avgLikes,
      emojiPct,
      shortPct,
      isMultilingual,
      languageCount: languages.size,
    }
  };
}

function PsychologicalContent() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleAnalyze = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch(`/api/psychological?username=${encodeURIComponent(username.trim())}`);
      const result = await res.json();

      if (result.error) {
        setError(result.error);
      } else {
        setData(result);
      }
    } catch {
      setError("Bir hata olustu. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const copyDraft = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const radarData = data
    ? METRIC_CONFIG.map((m) => ({
        metric: m.label,
        score: data.metrics[m.key].score,
      }))
    : [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-400" />
          Psikolojik Analiz
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          TikTok hesabinin izleyici psikolojisi, icerik stratejisi ve viral potansiyelini analiz edin
        </p>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            placeholder="@kullaniciadi girin..."
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-purple-400/50 transition-colors"
          />
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading || !username.trim()}
          className="px-6 py-2.5 bg-purple-500 text-white text-sm font-medium rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Analiz ediliyor...
            </span>
          ) : (
            "Analiz Et"
          )}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-4 h-28 shimmer" />
            ))}
          </div>
          <div className="h-72 shimmer rounded-xl" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Results */}
      {data && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Profile Banner */}
          <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-xl">
              {data.username[0]?.toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">@{data.username}</h2>
              <p className="text-xs text-muted-foreground">{data.videoCount} video analiz edildi</p>
            </div>
            <div className="hidden sm:flex gap-4 text-center">
              <div>
                <p className="text-sm font-bold text-foreground">{formatNumber(data.analysis_data.total_views)}</p>
                <p className="text-[10px] text-muted-foreground">Goruntulenme</p>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{formatNumber(data.analysis_data.total_likes)}</p>
                <p className="text-[10px] text-muted-foreground">Begeni</p>
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">%{data.analysis_data.avg_engagement_rate}</p>
                <p className="text-[10px] text-muted-foreground">Etkilesim</p>
              </div>
            </div>
          </div>

          {/* Stats row for mobile */}
          <div className="grid grid-cols-4 gap-3 sm:hidden">
            {[
              { label: "Goruntulenme", value: formatNumber(data.analysis_data.total_views), icon: Eye },
              { label: "Begeni", value: formatNumber(data.analysis_data.total_likes), icon: Heart },
              { label: "Yorum", value: formatNumber(data.analysis_data.total_comments), icon: MessageCircle },
              { label: "Paylasim", value: formatNumber(data.analysis_data.total_shares), icon: Share2 },
            ].map((s) => (
              <div key={s.label} className="bg-card rounded-xl border border-border p-3 text-center">
                <s.icon className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                <p className="text-sm font-bold text-foreground">{s.value}</p>
                <p className="text-[9px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Editorial Analysis */}
          {(() => {
            const commentary = data.ai_commentary || generateFallbackCommentary(data);
            return (
              <div className="bg-gradient-to-br from-purple-500/5 via-card to-blue-500/5 rounded-xl border border-purple-500/20 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-semibold text-purple-400">Editoryal Psikolojik Analiz</h3>
                </div>
                <div className="prose prose-sm prose-invert max-w-none">
                  {commentary.editorial.split("\n\n").map((p, i) => (
                    <p key={i} className="text-sm text-muted-foreground leading-relaxed mb-3 last:mb-0 italic">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Radar Chart + Metric Scores */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Psikolojik Profil</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#2a2a3a" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: "#8888a0", fontSize: 10 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Skor"
                      dataKey="score"
                      stroke="#a78bfa"
                      fill="#a78bfa"
                      fillOpacity={0.25}
                      strokeWidth={2}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: 8, fontSize: 12 }}
                      formatter={(v) => [`${v}/100`, "Skor"]}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Metric Bars */}
            <div className="bg-card rounded-xl border border-border p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Metrik Skorlari</h3>
              {METRIC_CONFIG.map((m) => {
                const metric = data.metrics[m.key];
                return (
                  <div key={m.key}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <m.icon className={`w-4 h-4 ${m.color}`} />
                      <span className="text-xs text-foreground font-medium">{m.label}</span>
                    </div>
                    <ScoreBar score={metric.score} color={m.color} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Metric Detail Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Hate Watching */}
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-red-400/10 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Nefret-Izleme Indeksi</p>
                  <p className="text-[10px] text-muted-foreground">{data.metrics.hate_watching.label}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Yorum/Goruntulenme Orani</span>
                  <span className="text-foreground font-medium">%{(data.metrics.hate_watching.comment_to_view_ratio * 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Olumsuzluk Tahmini</span>
                  <span className="text-foreground font-medium">%{data.metrics.hate_watching.negativity_estimate.toFixed(0)}</span>
                </div>
              </div>
              <p className="mt-3 pt-3 border-t border-border text-[11px] text-purple-300/80 italic leading-relaxed">
                {(data.ai_commentary || generateFallbackCommentary(data)).hate_watching}
              </p>
            </div>

            {/* Anchor Points */}
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center">
                  <Crosshair className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Capa Noktasi Tespiti</p>
                  <p className="text-[10px] text-muted-foreground">Skor: {data.metrics.anchor_points.score}/100</p>
                </div>
              </div>
              <div className="space-y-2">
                {data.metrics.anchor_points.triggers.length > 0 && (
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1">Tetikleyiciler</p>
                    <div className="flex flex-wrap gap-1">
                      {data.metrics.anchor_points.triggers.slice(0, 5).map((t) => (
                        <span key={t} className="text-[10px] bg-blue-400/10 text-blue-400 px-2 py-0.5 rounded">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
                {data.metrics.anchor_points.top_hashtags.length > 0 && (
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1">Top Hashtag&apos;ler</p>
                    <div className="flex flex-wrap gap-1">
                      {data.metrics.anchor_points.top_hashtags.slice(0, 4).map((h) => (
                        <span key={h} className="text-[10px] bg-teal/10 text-teal px-2 py-0.5 rounded">{h}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <p className="mt-3 pt-3 border-t border-border text-[11px] text-purple-300/80 italic leading-relaxed">
                {(data.ai_commentary || generateFallbackCommentary(data)).anchor_points}
              </p>
            </div>

            {/* Drop Off */}
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-teal" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Izleyici Tutma</p>
                  <p className="text-[10px] text-muted-foreground">{data.metrics.drop_off.label}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Tahmini Izleme Orani</span>
                  <span className="text-foreground font-medium">%{data.metrics.drop_off.estimated_avg_watch_percent.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sure/Etkilesim Orani</span>
                  <span className="text-foreground font-medium">{data.metrics.drop_off.duration_engagement_ratio.toFixed(2)}</span>
                </div>
              </div>
              <p className="mt-3 pt-3 border-t border-border text-[11px] text-purple-300/80 italic leading-relaxed">
                {(data.ai_commentary || generateFallbackCommentary(data)).drop_off}
              </p>
            </div>

            {/* Demographics */}
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-purple-400/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Demografik Haritalama</p>
                  <p className="text-[10px] text-muted-foreground">Skor: {data.metrics.demographics.score}/100</p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Tahmini Yas Araligi</span>
                  <span className="text-foreground font-medium">{data.metrics.demographics.estimated_age_range}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sosyoekonomik Katman</span>
                  <span className="text-foreground font-medium">{data.metrics.demographics.socioeconomic_tier}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dil Karmasikligi</span>
                  <span className="text-foreground font-medium">{data.metrics.demographics.language_complexity}</span>
                </div>
              </div>
              <p className="mt-3 pt-3 border-t border-border text-[11px] text-purple-300/80 italic leading-relaxed">
                {(data.ai_commentary || generateFallbackCommentary(data)).demographics}
              </p>
            </div>

            {/* Sentiment Drift */}
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-orange-400/10 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Duygu Kaymasi</p>
                  <p className="text-[10px] text-muted-foreground">{data.metrics.sentiment_drift.label}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Begeni/Olumsuz Orani</span>
                  <span className="text-foreground font-medium">{data.metrics.sentiment_drift.like_dislike_ratio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Yorum Hizi</span>
                  <span className="text-foreground font-medium">{data.metrics.sentiment_drift.comment_velocity.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Yon</span>
                  <span className={`font-medium ${
                    data.metrics.sentiment_drift.drift_direction === "positive" ? "text-teal" :
                    data.metrics.sentiment_drift.drift_direction === "negative" ? "text-red-400" : "text-muted-foreground"
                  }`}>
                    {data.metrics.sentiment_drift.drift_direction === "positive" ? "Pozitif" :
                     data.metrics.sentiment_drift.drift_direction === "negative" ? "Negatif" : "Notr"}
                  </span>
                </div>
              </div>
              <p className="mt-3 pt-3 border-t border-border text-[11px] text-purple-300/80 italic leading-relaxed">
                {(data.ai_commentary || generateFallbackCommentary(data)).sentiment_drift}
              </p>
            </div>

            {/* Summary */}
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xs font-semibold text-foreground">Genel Ozet</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{data.analysis_data.summary}</p>
            </div>
          </div>

          {/* Comment Analysis */}
          {(() => {
            const ca = data.ai_commentary?.comment_analysis;
            if (!ca && data.comments_data.total_fetched === 0) return null;
            return (
              <div className="bg-gradient-to-br from-cyan-500/5 via-card to-pink-500/5 rounded-xl border border-cyan-500/20 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-sm font-semibold text-cyan-400">Yorum Analizi</h3>
                  </div>
                  <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                    {ca?.total_analyzed || data.comments_data.total_fetched} yorum analiz edildi
                  </span>
                </div>

                {/* Striking Findings */}
                {ca?.striking_findings && ca.striking_findings.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-medium text-foreground uppercase tracking-wider">Carpici Bulgular</p>
                    {ca.striking_findings.map((finding, i) => (
                      <div key={i} className="flex items-start gap-2 bg-background/50 rounded-lg p-3 border border-border/50">
                        <Zap className="w-3.5 h-3.5 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-foreground leading-relaxed">{finding}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comment Clusters */}
                {ca?.clusters && ca.clusters.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-medium text-foreground uppercase tracking-wider">Yorum Temalari</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ca.clusters.map((cluster, i) => (
                        <div key={i} className="bg-background/50 rounded-lg p-3 border border-border/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-foreground">{cluster.theme}</span>
                            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">%{cluster.percentage}</span>
                          </div>
                          <div className="w-full h-1.5 bg-border/30 rounded-full mb-2 overflow-hidden">
                            <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${Math.min(cluster.percentage, 100)}%` }} />
                          </div>
                          {cluster.example_comments.slice(0, 2).map((c, j) => (
                            <p key={j} className="text-[11px] text-muted-foreground italic mb-1">&ldquo;{c}&rdquo;</p>
                          ))}
                          <p className="text-[10px] text-purple-300/80 mt-1">{cluster.insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Top Comments with Context */}
                {ca?.top_comments && ca.top_comments.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-medium text-foreground uppercase tracking-wider">Onemli Yorumlar</p>
                    {ca.top_comments.slice(0, 3).map((comment, i) => (
                      <div key={i} className="bg-background/50 rounded-lg p-3 border border-border/50">
                        <div className="flex items-start gap-2">
                          <MessageCircle className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs text-foreground italic">&ldquo;{comment.text}&rdquo;</p>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <ThumbsUp className="w-3 h-3" /> {comment.likes.toLocaleString()} begeni
                              </span>
                            </div>
                            <p className="text-[10px] text-purple-300/80 mt-1">{comment.why_important}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sentiment Breakdown */}
                {ca?.sentiment_breakdown && (
                  <div className="flex items-center gap-4 bg-background/50 rounded-lg p-3 border border-border/50">
                    <BarChart3 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-[10px] text-muted-foreground mb-1.5">Yorum Duygu Dagilimi</p>
                      <div className="flex h-2.5 rounded-full overflow-hidden gap-0.5">
                        <div className="bg-teal rounded-l-full" style={{ width: `${ca.sentiment_breakdown.positive_pct}%` }} />
                        <div className="bg-gray-500" style={{ width: `${ca.sentiment_breakdown.neutral_pct}%` }} />
                        <div className="bg-red-500 rounded-r-full" style={{ width: `${ca.sentiment_breakdown.negative_pct}%` }} />
                      </div>
                      <div className="flex justify-between mt-1 text-[9px]">
                        <span className="text-teal">Pozitif %{ca.sentiment_breakdown.positive_pct}</span>
                        <span className="text-gray-400">Notr %{ca.sentiment_breakdown.neutral_pct}</span>
                        <span className="text-red-400">Negatif %{ca.sentiment_breakdown.negative_pct}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Magazinsel Yorum Analizi Fallback */}
                {!ca && data.comments_data.top_comments.length > 0 && (() => {
                  const fb = generateFallbackCommentAnalysis(
                    data.comments_data.top_comments,
                    data.comments_data.total_fetched
                  );
                  if (!fb) return null;
                  return (
                    <div className="space-y-3">
                      {/* Editorial Comment Overview */}
                      <div className="bg-gradient-to-r from-purple-500/10 via-background/50 to-cyan-500/10 rounded-lg p-4 border border-purple-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                          <p className="text-[11px] font-medium text-purple-400 uppercase tracking-wider">Yorum Psikolojisi</p>
                        </div>
                        <p className="text-xs text-foreground/90 leading-relaxed italic">{fb.editorial_comment}</p>
                        <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3 text-cyan-400" /> Toplam {formatNumber(fb.stats.totalLikes)} begeni</span>
                          <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3 text-purple-400" /> Ort. {formatNumber(fb.stats.avgLikes)} begeni/yorum</span>
                          {fb.stats.isMultilingual && <span className="text-yellow-400">🌍 {fb.stats.languageCount} dil tespit edildi</span>}
                        </div>
                      </div>

                      {/* Per-Comment Magazine Insights */}
                      <p className="text-[11px] font-medium text-foreground uppercase tracking-wider">En Carpici Yorumlar</p>
                      {fb.commentInsights.map((c, i) => (
                        <div key={i} className="bg-background/50 rounded-lg p-3 border border-border/50">
                          <div className="flex items-start gap-2">
                            <MessageCircle className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-xs text-foreground font-medium italic">&ldquo;{c.text}&rdquo;</p>
                              <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                  <ThumbsUp className="w-3 h-3" /> {formatNumber(c.likes)} begeni
                                </span>
                                <span className="text-[10px] text-muted-foreground">@{c.username}</span>
                                <span className="text-[10px] text-cyan-400/70">begenilerin %{c.likeRatio}&apos;i</span>
                              </div>
                              <p className="text-[10px] text-purple-300/80 mt-1.5 leading-relaxed">{c.insight}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            );
          })()}

          {/* Viral Post Drafts */}
          {data.viral_post_drafts.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                Viral Post Taslaklari
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Bu profilin izleyici psikolojisine gore uretilmis viral icerik taslaklari
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.viral_post_drafts.map((draft) => (
                  <div
                    key={draft.id}
                    className="bg-background rounded-lg border border-border p-3 group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex gap-1.5">
                        <span className="text-[9px] bg-purple-400/10 text-purple-400 px-1.5 py-0.5 rounded">
                          {draft.hook_type}
                        </span>
                        <span className="text-[9px] bg-teal/10 text-teal px-1.5 py-0.5 rounded">
                          {draft.target_emotion}
                        </span>
                      </div>
                      <button
                        onClick={() => copyDraft(draft.id, draft.text)}
                        className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                      >
                        {copiedId === draft.id ? (
                          <Check className="w-3.5 h-3.5 text-teal" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-foreground leading-relaxed">{draft.text}</p>
                    <p className="text-[9px] text-muted-foreground mt-2 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Tahmini etkilesim: {draft.estimated_engagement}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Empty state */}
      {!data && !loading && !error && (
        <div className="text-center py-20">
          <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Bir TikTok kullanici adi girerek psikolojik analiz baslatin</p>
          <p className="text-muted-foreground text-xs mt-1">Izleyici psikolojisi, icerik stratejisi ve viral potansiyel</p>
        </div>
      )}
    </motion.div>
  );
}

export default function PsychologicalPage() {
  return (
    <PremiumGate featureName="Psikolojik Analiz" requiredPlan="enterprise">
      <PsychologicalContent />
    </PremiumGate>
  );
}
