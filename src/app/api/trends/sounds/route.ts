import { NextResponse } from "next/server";
import { generateSounds } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const sounds = generateSounds();
  return NextResponse.json({ sounds });
}
