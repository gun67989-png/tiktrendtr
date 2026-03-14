import { NextResponse } from "next/server";
import { generateState, setStateCookie, getFacebookAuthUrl } from "@/lib/oauth";
import { authLogger } from "@/lib/logger";

export async function GET() {
  try {
    const state = generateState();
    await setStateCookie(state);
    const authUrl = getFacebookAuthUrl(state);
    return NextResponse.redirect(authUrl);
  } catch (error) {
    authLogger.error({ err: error }, "Facebook OAuth start error");
    return NextResponse.redirect(
      new URL("/login?error=oauth_start_failed", process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000")
    );
  }
}
