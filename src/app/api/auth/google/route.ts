import { NextResponse } from "next/server";
import { generateState, setStateCookie, getGoogleAuthUrl } from "@/lib/oauth";

export async function GET() {
  try {
    const state = generateState();
    await setStateCookie(state);
    const authUrl = getGoogleAuthUrl(state);
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Google OAuth start error:", error);
    return NextResponse.redirect(
      new URL("/login?error=oauth_start_failed", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")
    );
  }
}
