import { NextResponse } from "next/server";
import {
  generateState,
  setStateCookie,
  generateCodeVerifier,
  setCodeVerifierCookie,
  getTikTokAuthUrl,
} from "@/lib/oauth";

export async function GET() {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    await setStateCookie(state);
    await setCodeVerifierCookie(codeVerifier);

    const authUrl = getTikTokAuthUrl(state, codeVerifier);
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("TikTok OAuth start error:", error);
    return NextResponse.redirect(
      new URL("/login?error=oauth_start_failed", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")
    );
  }
}
