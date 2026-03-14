import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const niche = searchParams.get("niche") || "komedi";
  void niche;
  return NextResponse.json({ ideas: [], source: "no_data" });
}
