import { NextResponse } from "next/server";
import { generateOverview, generateEmergingTrends } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const overview = generateOverview();
  const emergingTrends = generateEmergingTrends();
  return NextResponse.json({ overview, emergingTrends });
}
