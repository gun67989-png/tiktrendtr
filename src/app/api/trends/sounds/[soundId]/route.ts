import { NextRequest, NextResponse } from "next/server";
import { generateSoundDetail } from "@/lib/data";

export async function GET(
  request: NextRequest,
  { params }: { params: { soundId: string } }
) {
  try {
    const detail = generateSoundDetail(params.soundId);

    if (!detail) {
      return NextResponse.json(
        { error: "Ses bulunamadi" },
        { status: 404 }
      );
    }

    return NextResponse.json(detail);
  } catch {
    return NextResponse.json(
      { error: "Sunucu hatasi" },
      { status: 500 }
    );
  }
}
