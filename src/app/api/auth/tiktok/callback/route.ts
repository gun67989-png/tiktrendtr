import { NextRequest, NextResponse } from "next/server";
import {
  verifyStateCookie,
  getCodeVerifierCookie,
  exchangeTikTokCode,
  getTikTokProfile,
} from "@/lib/oauth";
import { findUserByOAuth, createOAuthUser, updateUser, findUserByEmail } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { authLogger } from "@/lib/logger";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(new URL("/login?error=oauth_denied", BASE_URL));
    }

    if (!code || !state) {
      return NextResponse.redirect(new URL("/login?error=oauth_missing_params", BASE_URL));
    }

    const validState = await verifyStateCookie(state);
    if (!validState) {
      return NextResponse.redirect(new URL("/login?error=oauth_invalid_state", BASE_URL));
    }

    const codeVerifier = await getCodeVerifierCookie();
    if (!codeVerifier) {
      return NextResponse.redirect(new URL("/login?error=oauth_invalid_state", BASE_URL));
    }

    const accessToken = await exchangeTikTokCode(code, codeVerifier);
    const profile = await getTikTokProfile(accessToken);

    // TikTok genellikle e-posta vermez, providerId ile arama yaparız
    let user = await findUserByOAuth("tiktok", profile.providerId);

    if (!user) {
      // E-posta varsa mevcut hesapla eşleştir
      if (profile.email) {
        user = await findUserByEmail(profile.email);
        if (user) {
          await updateUser(user.id, {
            oauth_provider: "tiktok",
            oauth_provider_id: profile.providerId,
          });
        }
      }

      if (!user) {
        // Yeni hesap oluştur
        const username = profile.name
          .toLowerCase()
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9_]/g, "");
        user = await createOAuthUser({
          email: profile.email || `tiktok_${profile.providerId}@valyze.local`,
          username: username || `tiktok_${profile.providerId.slice(-6)}`,
          oauth_provider: "tiktok",
          oauth_provider_id: profile.providerId,
        });
      }
    }

    if (user.disabled) {
      return NextResponse.redirect(new URL("/login?error=account_disabled", BASE_URL));
    }

    const token = await createSession({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      subscription_type: user.subscription_type,
      subscription_niche: user.subscription_niche,
      subscription_role: user.subscription_role,
      onboarding_completed: user.onboarding_completed,
    });

    const destination = user.onboarding_completed ? "/dashboard" : "/onboarding";
    const response = NextResponse.redirect(new URL(destination, BASE_URL));
    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    authLogger.error({ err: error }, "TikTok OAuth callback error");
    return NextResponse.redirect(new URL("/login?error=oauth_failed", BASE_URL));
  }
}
