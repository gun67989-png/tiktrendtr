import { NextResponse } from "next/server";
import { generateHashtags } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const hashtags = generateHashtags();
  return NextResponse.json({ hashtags });
}
