import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Thumbnail proxy — TikWM thumbnail'ları doğrudan yüklenemediğinde
 * bu endpoint üzerinden proxy'lenir. CORS ve referrer sorunlarını çözer.
 *
 * Usage: /api/thumbnail?url=https://p16-sign-sg.tiktokcdn.com/...
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // Only allow TikTok CDN and TikWM domains
  const allowed = [
    "tiktokcdn.com",
    "tikwm.com",
    "tiktokcdn-us.com",
    "p16-sign",
    "p19-sign",
    "p77-sign",
    "muscdn.com",
  ];

  const isAllowed = allowed.some(domain => url.includes(domain));
  if (!isAllowed) {
    return NextResponse.json({ error: "Domain not allowed" }, { status: 403 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Referer": "https://www.tiktok.com/",
        "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json({ error: "Upstream failed" }, { status: response.status });
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=604800",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    // Return a 1x1 transparent pixel as fallback
    const pixel = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );
    return new NextResponse(pixel, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=300",
      },
    });
  }
}
