import { NextRequest, NextResponse } from "next/server";
import { askAI } from "@/lib/ai";

export const dynamic = "force-dynamic";

interface UserStats {
  username: string;
  videoCount: number;
  totalViews: number;
  avgViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  avgEngagementRate: number;
  avgDuration: number;
  topHashtags: string[];
  bestHours: number[];
  topFormat: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user1, user2 } = body as { user1: UserStats; user2: UserStats };

    if (!user1 || !user2) {
      return NextResponse.json({ error: "İki kullanıcı verisi gerekli" }, { status: 400 });
    }

    const prompt = `Sen bir TikTok stratejisti ve rakip analiz uzmanısın. İki TikTok hesabını karşılaştır ve Türkçe detaylı yorum yap.

Kullanıcı 1: @${user1.username}
- ${user1.videoCount} video analiz edildi
- Toplam görüntülenme: ${user1.totalViews.toLocaleString()}
- Ortalama görüntülenme: ${user1.avgViews.toLocaleString()}
- Toplam beğeni: ${user1.totalLikes.toLocaleString()}
- Toplam yorum: ${user1.totalComments.toLocaleString()}
- Toplam paylaşım: ${user1.totalShares.toLocaleString()}
- Ortalama etkileşim oranı: %${user1.avgEngagementRate}
- Ortalama video süresi: ${user1.avgDuration} saniye
- En çok kullanılan hashtag'ler: ${user1.topHashtags.join(", ")}
- En iyi paylaşım saatleri: ${user1.bestHours.map((h) => h + ":00").join(", ")}
- En çok kullanılan format: ${user1.topFormat}

Kullanıcı 2: @${user2.username}
- ${user2.videoCount} video analiz edildi
- Toplam görüntülenme: ${user2.totalViews.toLocaleString()}
- Ortalama görüntülenme: ${user2.avgViews.toLocaleString()}
- Toplam beğeni: ${user2.totalLikes.toLocaleString()}
- Toplam yorum: ${user2.totalComments.toLocaleString()}
- Toplam paylaşım: ${user2.totalShares.toLocaleString()}
- Ortalama etkileşim oranı: %${user2.avgEngagementRate}
- Ortalama video süresi: ${user2.avgDuration} saniye
- En çok kullanılan hashtag'ler: ${user2.topHashtags.join(", ")}
- En iyi paylaşım saatleri: ${user2.bestHours.map((h) => h + ":00").join(", ")}
- En çok kullanılan format: ${user2.topFormat}

JSON formatında detaylı karşılaştırma yorumu döndür:
{
  "winner": "@kullanici_adi (genel olarak daha başarılı olan)",
  "summary": "Genel karşılaştırma özeti (3-4 cümle)",
  "categories": [
    {
      "name": "Erişim Gücü",
      "winner": "@kullanici_adi",
      "comment": "Neden bu kullanıcı daha iyi (1-2 cümle)"
    },
    {
      "name": "Etkileşim Kalitesi",
      "winner": "@kullanici_adi",
      "comment": "Neden bu kullanıcı daha iyi (1-2 cümle)"
    },
    {
      "name": "İçerik Stratejisi",
      "winner": "@kullanici_adi",
      "comment": "Neden bu kullanıcı daha iyi (1-2 cümle)"
    },
    {
      "name": "Paylaşım Zamanlaması",
      "winner": "@kullanici_adi",
      "comment": "Neden bu kullanıcı daha iyi (1-2 cümle)"
    }
  ],
  "tips": [
    "Her iki hesap için de uygulanabilir strateji önerisi 1",
    "Strateji önerisi 2",
    "Strateji önerisi 3"
  ]
}
Sadece JSON döndür, başka açıklama ekleme.`;

    const result = await askAI(prompt);

    // Try to parse JSON from the response
    let parsed;
    try {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      parsed = null;
    }

    return NextResponse.json({
      commentary: parsed,
      raw: parsed ? null : result,
    });
  } catch (e) {
    console.error("Compare API error:", e);
    return NextResponse.json({ error: "Karşılaştırma yapılamadı" }, { status: 500 });
  }
}
