import { NextRequest, NextResponse } from "next/server";
import { generateHashtagDetail } from "@/lib/data";

export async function GET(
  request: NextRequest,
  { params }: { params: { tag: string } }
) {
  try {
    const tag = decodeURIComponent(params.tag);
    const detail = generateHashtagDetail(tag);

    if (!detail) {
      return NextResponse.json(
        { error: "Hashtag bulunamadi" },
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
