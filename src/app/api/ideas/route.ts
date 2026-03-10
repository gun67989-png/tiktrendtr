import { NextRequest, NextResponse } from "next/server";
import { generateContentIdeas } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const niche = searchParams.get("niche") || "komedi";
  const ideas = generateContentIdeas(niche);
  return NextResponse.json({ ideas });
}
