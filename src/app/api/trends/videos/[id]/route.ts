import { NextRequest, NextResponse } from "next/server";
import { generateVideoAnalytics } from "@/lib/data";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const analytics = generateVideoAnalytics(params.id);

    if (!analytics) {
      return NextResponse.json(
        { error: "Video bulunamadi" },
        { status: 404 }
      );
    }

    return NextResponse.json(analytics);
  } catch {
    return NextResponse.json(
      { error: "Sunucu hatasi" },
      { status: 500 }
    );
  }
}
