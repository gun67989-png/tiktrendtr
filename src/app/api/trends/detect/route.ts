import { NextResponse } from "next/server";
import { detectTrends } from "@/lib/trend-engine";
import { cached } from "@/lib/cache";
import { apiLogger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await cached("trends:detect", async () => {
      return await detectTrends();
    }, 1800); // Cache 30 minutes

    return NextResponse.json(result);
  } catch (error) {
    apiLogger.error({ err: error }, "Trend detection failed");
    return NextResponse.json(
      { signals: [], emergingTrends: [], detectedAt: new Date().toISOString(), totalVideosAnalyzed: 0 },
      { status: 500 }
    );
  }
}
