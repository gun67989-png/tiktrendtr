import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { runFullAnalysis } from "@/lib/psychological-analysis";
import type { VideoData } from "@/lib/psychological-analysis";
import { askAI } from "@/lib/ai";

export const dynamic = "force-dynamic";

interface TikWMVideo {
  video_id: string;
  title: string;
  cover: string;
  origin_cover: string;
  duration: number;
  play_count: number;
  digg_count: number;
  comment_count: number;
  share_count: number;
  create_time: number;
  author: {
    id: string;
    unique_id: string;
    nickname: string;
    avatar: string;
  };
  music_info?: {
    title: string;
    author: string;
  };
}

function extractHashtags(text: string): string[] {
  const matches = text.match(/#[\w\u00C0-\u024F\u0400-\u04FF\u00e7\u011f\u0131\u00f6\u015f\u00fc\u00c7\u011e\u0130\u00d6\u015e\u00dc]+/g);
  return matches ? matches.map((h) => h.toLowerCase()) : [];
}

function detectFormat(caption: string): string {
  const text = caption.toLowerCase();
  if (text.includes("tutorial") || text.includes("nasil") || text.includes("rehber")) return "Tutorial";
  if (text.includes("pov")) return "POV";
  if (text.includes("grwm") || text.includes("get ready")) return "GRWM";
  if (text.includes("challenge")) return "Challenge";
  if (text.includes("duet")) return "Duet";
  if (text.includes("reaction") || text.includes("reaksiyon")) return "Reaksiyon";
  return "Kısa Video";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Kullanıcı adı gerekli" }, { status: 400 });
  }

  const cleanUsername = username.replace("@", "").trim().toLowerCase();

  try {
    let videos: VideoData[] = [];

    // Step 1: Check Supabase for existing videos
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from("trending_videos")
        .select("*")
        .ilike("creator_username", cleanUsername)
        .order("view_count", { ascending: false })
        .limit(30);

      if (data && data.length > 0) {
        videos = data.map((v: Record<string, unknown>) => ({
          video_id: v.video_id as string,
          creator_username: (v.creator_username as string) || cleanUsername,
          creator_nickname: (v.creator_nickname as string) || "",
          caption: (v.caption as string) || "",
          hashtags: Array.isArray(v.hashtags) ? (v.hashtags as string[]) : [],
          view_count: (v.view_count as number) || 0,
          like_count: (v.like_count as number) || 0,
          comment_count: (v.comment_count as number) || 0,
          share_count: (v.share_count as number) || 0,
          follower_count: (v.follower_count as number) || 0,
          duration: (v.duration as number) || 0,
          sound_name: (v.sound_name as string) || undefined,
          sound_creator: (v.sound_creator as string) || undefined,
          sound_type: (v.sound_type as string) || null,
          category: (v.category as string) || undefined,
          format: (v.format as string) || undefined,
          ad_format: (v.ad_format as string) || null,
          scraped_at: (v.scraped_at as string) || undefined,
        }));
      }
    }

    // Step 2: Fallback to TikWM API
    if (videos.length === 0) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const response = await fetch("https://www.tikwm.com/api/feed/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        body: `keywords=${encodeURIComponent(cleanUsername)}&count=30&region=tr`,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        return NextResponse.json({ error: "Video verisi alinamadi" }, { status: 502 });
      }

      const result = await response.json();

      if (result.code !== 0 || !result.data?.videos) {
        return NextResponse.json({ error: "Video bulunamadi" }, { status: 404 });
      }

      const tikwmVideos = result.data.videos as TikWMVideo[];
      const creatorVideos = tikwmVideos.filter(
        (v) => v.author?.unique_id?.toLowerCase() === cleanUsername
      );
      const videosToUse = creatorVideos.length > 0 ? creatorVideos : tikwmVideos;

      videos = videosToUse.map((v) => ({
        video_id: v.video_id,
        creator_username: v.author?.unique_id || cleanUsername,
        creator_nickname: v.author?.nickname || "",
        caption: v.title || "",
        hashtags: extractHashtags(v.title || ""),
        view_count: v.play_count || 0,
        like_count: v.digg_count || 0,
        comment_count: v.comment_count || 0,
        share_count: v.share_count || 0,
        follower_count: 0,
        duration: v.duration || 0,
        sound_name: v.music_info?.title || undefined,
        sound_creator: v.music_info?.author || undefined,
        sound_type: null,
        category: undefined,
        format: detectFormat(v.title || ""),
        ad_format: null,
        scraped_at: v.create_time ? new Date(v.create_time * 1000).toISOString() : undefined,
      }));
    }

    if (videos.length === 0) {
      return NextResponse.json({ error: "Bu kullanıcı için video bulunamadı" }, { status: 404 });
    }

    // Step 3: Run psychological analysis
    const analysis = runFullAnalysis(cleanUsername, "tiktok", videos);

    // Step 3.5: Fetch real comments from top 3 videos
    interface CommentData {
      video_caption: string;
      video_views: number;
      comments: { username: string; text: string; likes: number }[];
    }
    const commentsByVideo: CommentData[] = [];
    const topVideos = [...videos].sort((a, b) => b.view_count - a.view_count).slice(0, 3);

    for (const video of topVideos) {
      try {
        const commentRes = await fetch(
          `https://www.tikwm.com/api/comment/list?url=https://www.tiktok.com/@${cleanUsername}/video/${video.video_id}&count=30&cursor=0`,
          {
            headers: {
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              Accept: "application/json",
            },
            signal: AbortSignal.timeout(8000),
          }
        );
        if (commentRes.ok) {
          const commentResult = await commentRes.json();
          if (commentResult.code === 0 && commentResult.data?.comments) {
            commentsByVideo.push({
              video_caption: video.caption.substring(0, 100),
              video_views: video.view_count,
              comments: commentResult.data.comments.slice(0, 30).map((c: { user?: { unique_id?: string; nickname?: string }; text?: string; digg_count?: number }) => ({
                username: c.user?.unique_id || c.user?.nickname || "anonim",
                text: (c.text || "").substring(0, 200),
                likes: c.digg_count || 0,
              })),
            });
          }
        }
      } catch {
        // Skip this video's comments if fetch fails
      }
    }

    // Build comment summary for AI
    const allComments = commentsByVideo.flatMap((v) => v.comments);
    const commentTexts = allComments.map((c) => c.text).filter((t) => t.length > 2);
    const topLikedComments = [...allComments].sort((a, b) => b.likes - a.likes).slice(0, 10);

    // Step 4: Generate AI editorial commentary (now with real comments)
    let ai_commentary = null;
    try {
      const commentaryPrompt = `Sen bir sosyal medya psikoloji uzmanı ve gazetecisin. Aşağıdaki TikTok profil analiz verilerini kullanarak derinlemesine, magazinsel bir psikolojik analiz yaz. Türkçe yaz.

Profil: @${cleanUsername}
Video sayısı: ${videos.length}
Toplam görüntülenme: ${analysis.analysis_data.total_views.toLocaleString()}
Toplam beğeni: ${analysis.analysis_data.total_likes.toLocaleString()}
Toplam yorum: ${analysis.analysis_data.total_comments.toLocaleString()}
Toplam paylaşım: ${analysis.analysis_data.total_shares.toLocaleString()}
Ortalama etkileşim oranı: %${analysis.analysis_data.avg_engagement_rate}

Metrikler:
1. Nefret-İzleme Skoru: ${analysis.metrics.hate_watching.score}/100
   - Yorum/Görüntülenme oranı: %${analysis.metrics.hate_watching.comment_to_view_ratio}
   - Olumsuzluk tahmini: %${analysis.metrics.hate_watching.negativity_estimate}
   - Durum: ${analysis.metrics.hate_watching.label}

2. Çapa Noktası Skoru: ${analysis.metrics.anchor_points.score}/100
   - Tetikleyiciler: ${analysis.metrics.anchor_points.triggers.join(", ")}
   - Top hashtag'ler: ${analysis.metrics.anchor_points.top_hashtags.slice(0, 5).join(", ")}
   - Caption anahtar kelimeler: ${analysis.metrics.anchor_points.caption_keywords.slice(0, 5).join(", ")}

3. Drop-off (İzleyici Tutma) Skoru: ${analysis.metrics.drop_off.score}/100
   - Tahmini izleme oranı: %${analysis.metrics.drop_off.estimated_avg_watch_percent}
   - Süre/etkileşim oranı: ${analysis.metrics.drop_off.duration_engagement_ratio}
   - Durum: ${analysis.metrics.drop_off.label}

4. Demografik Skoru: ${analysis.metrics.demographics.score}/100
   - Tahmini yaş aralığı: ${analysis.metrics.demographics.estimated_age_range}
   - Sosyoekonomik katman: ${analysis.metrics.demographics.socioeconomic_tier}
   - Dil karmaşıklığı: ${analysis.metrics.demographics.language_complexity}
   - Kategori yakınlıkları: ${analysis.metrics.demographics.category_affinity.join(", ")}

5. Duygu Kayması Skoru: ${analysis.metrics.sentiment_drift.score}/100
   - Beğeni/olumsuz oranı: ${analysis.metrics.sentiment_drift.like_dislike_ratio}
   - Yorum hızı: ${analysis.metrics.sentiment_drift.comment_velocity}
   - Yön: ${analysis.metrics.sentiment_drift.drift_direction}

Ortalama video süresi: ${(videos.reduce((a, v) => a + v.duration, 0) / videos.length).toFixed(1)} saniye
En çok kullanılan hashtag'ler: ${analysis.metrics.anchor_points.top_hashtags.slice(0, 8).join(", ")}

${commentTexts.length > 0 ? `GERÇEK YORUMLAR (${commentTexts.length} yorum analiz edildi):
${commentsByVideo.map((v, i) => `
Video ${i + 1}: "${v.video_caption}" (${v.video_views.toLocaleString()} görüntülenme)
Yorumlar:
${v.comments.slice(0, 15).map((c) => `- @${c.username}: "${c.text}" (${c.likes} beğeni)`).join("\n")}
`).join("\n")}

En çok beğenilen yorumlar:
${topLikedComments.map((c) => `- @${c.username}: "${c.text}" (${c.likes} beğeni)`).join("\n")}
` : "Yorum verisi mevcut değil."}

ÖNEMLİ KURALLAR:
- Metrikleri birbirleriyle ilişkilendir, çapraz çıkarımlar yap
- Psikolojik terimler kullan: "psikolojik kopma noktası", "çapa etkisi", "nefret-izleme döngüsü", "izleyici kaybı", "duygusal bağ", "bilinçaltı tetikleyici"
- Spesifik yüzdeler ve sayılarla destekle
- Gazete köşe yazısı gibi akıcı ve etkileyici yaz
- Her yorumu birbirine bağla, tutarlı bir hikaye anlat
- GERÇEK YORUMLARI ANALİZ ET: Yorumları kategorilere ayır, en çarpıcı örnekleri ver, yorum örüntülerini tespit et
- Yorum örneklerini tırnak içinde doğrudan alıntıla

JSON formatında döndür:
{
  "editorial": "Genel editöryal analiz (3-4 paragraf, derinlemesine magazinsel yorum, gerçek yorum örnekleriyle desteklenmiş)",
  "hate_watching": "Nefret-izleme metriği hakkında 2-3 cümle magazinsel yorum",
  "anchor_points": "Çapa noktası metriği hakkında 2-3 cümle magazinsel yorum",
  "drop_off": "İzleyici tutma metriği hakkında 2-3 cümle magazinsel yorum",
  "demographics": "Demografik metrik hakkında 2-3 cümle magazinsel yorum",
  "sentiment_drift": "Duygu kayması metriği hakkında 2-3 cümle magazinsel yorum",
  "comment_analysis": {
    "total_analyzed": ${commentTexts.length},
    "clusters": [
      {"theme": "Tema adı", "percentage": yüzde, "example_comments": ["gerçek yorum 1", "gerçek yorum 2"], "insight": "Bu temanın psikolojik anlamı"}
    ],
    "striking_findings": ["Çarpıcı bulgu 1 (yüzde ve yorum örneğiyle)", "Çarpıcı bulgu 2"],
    "top_comments": [{"text": "yorum metni", "likes": beğeni_sayısı, "why_important": "neden önemli"}],
    "sentiment_breakdown": {"positive_pct": number, "negative_pct": number, "neutral_pct": number}
  }
}
Sadece JSON döndür, başka açıklama ekleme.`;

      const aiResult = await askAI(commentaryPrompt);
      try {
        const jsonMatch = aiResult.match(/\{[\s\S]*\}/);
        ai_commentary = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
      } catch {
        ai_commentary = null;
      }
    } catch {
      ai_commentary = null;
    }

    return NextResponse.json({
      username: cleanUsername,
      videoCount: videos.length,
      analysis_data: analysis.analysis_data,
      metrics: analysis.metrics,
      viral_post_drafts: analysis.viral_post_drafts,
      analyzed_at: analysis.analyzed_at,
      ai_commentary,
      comments_data: {
        total_fetched: allComments.length,
        videos_analyzed: commentsByVideo.length,
        top_comments: topLikedComments.slice(0, 5),
      },
    });
  } catch (e) {
    console.error("Psychological analysis error:", e);
    return NextResponse.json({ error: "Analiz sirasinda hata olustu" }, { status: 500 });
  }
}
