import { NextResponse } from "next/server";
import { generatePostingTimes } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const postingTimes = generatePostingTimes();
  return NextResponse.json({ postingTimes });
}
