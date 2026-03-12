import { nanoid } from "nanoid";
import { cookies } from "next/headers";

// ============================================================
// Types
// ============================================================

export type OAuthProvider = "google" | "facebook" | "tiktok";

export interface OAuthProfile {
  provider: OAuthProvider;
  providerId: string;
  email: string;
  name: string;
  avatar?: string;
}

// ============================================================
// Provider Configs
// ============================================================

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const GOOGLE_CONFIG = {
  authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenUrl: "https://oauth2.googleapis.com/token",
  userInfoUrl: "https://www.googleapis.com/oauth2/v2/userinfo",
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  redirectUri: `${BASE_URL}/api/auth/google/callback`,
  scope: "openid email profile",
};

const FACEBOOK_CONFIG = {
  authorizeUrl: "https://www.facebook.com/v18.0/dialog/oauth",
  tokenUrl: "https://graph.facebook.com/v18.0/oauth/access_token",
  userInfoUrl: "https://graph.facebook.com/me?fields=id,name,email,picture.type(large)",
  clientId: process.env.FACEBOOK_APP_ID || "",
  clientSecret: process.env.FACEBOOK_APP_SECRET || "",
  redirectUri: `${BASE_URL}/api/auth/facebook/callback`,
  scope: "email,public_profile",
};

const TIKTOK_CONFIG = {
  authorizeUrl: "https://www.tiktok.com/v2/auth/authorize/",
  tokenUrl: "https://open.tiktokapis.com/v2/oauth/token/",
  userInfoUrl: "https://open.tiktokapis.com/v2/user/info/",
  clientKey: process.env.TIKTOK_CLIENT_KEY || "",
  clientSecret: process.env.TIKTOK_CLIENT_SECRET || "",
  redirectUri: `${BASE_URL}/api/auth/tiktok/callback`,
  scope: "user.info.basic,user.info.profile",
};

// ============================================================
// State Cookie (CSRF Protection)
// ============================================================

const STATE_COOKIE_NAME = "oauth_state";
const CODE_VERIFIER_COOKIE = "oauth_code_verifier";

export function generateState(): string {
  return nanoid(32);
}

export async function setStateCookie(state: string): Promise<void> {
  const cookieStore = cookies();
  cookieStore.set(STATE_COOKIE_NAME, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 dakika
    path: "/",
  });
}

export async function verifyStateCookie(state: string): Promise<boolean> {
  const cookieStore = cookies();
  const stored = cookieStore.get(STATE_COOKIE_NAME)?.value;
  if (!stored || stored !== state) return false;
  // Kullanıldıktan sonra sil
  cookieStore.delete(STATE_COOKIE_NAME);
  return true;
}

// ============================================================
// Code Verifier (TikTok PKCE)
// ============================================================

export async function setCodeVerifierCookie(verifier: string): Promise<void> {
  const cookieStore = cookies();
  cookieStore.set(CODE_VERIFIER_COOKIE, verifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
}

export async function getCodeVerifierCookie(): Promise<string | null> {
  const cookieStore = cookies();
  const verifier = cookieStore.get(CODE_VERIFIER_COOKIE)?.value || null;
  if (verifier) cookieStore.delete(CODE_VERIFIER_COOKIE);
  return verifier;
}

// ============================================================
// Google OAuth
// ============================================================

export function getGoogleAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: GOOGLE_CONFIG.clientId,
    redirect_uri: GOOGLE_CONFIG.redirectUri,
    response_type: "code",
    scope: GOOGLE_CONFIG.scope,
    state,
    access_type: "offline",
    prompt: "consent",
  });
  return `${GOOGLE_CONFIG.authorizeUrl}?${params}`;
}

export async function exchangeGoogleCode(code: string): Promise<string> {
  const res = await fetch(GOOGLE_CONFIG.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CONFIG.clientId,
      client_secret: GOOGLE_CONFIG.clientSecret,
      redirect_uri: GOOGLE_CONFIG.redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google token exchange failed: ${err}`);
  }

  const data = await res.json();
  return data.access_token;
}

export async function getGoogleProfile(accessToken: string): Promise<OAuthProfile> {
  const res = await fetch(GOOGLE_CONFIG.userInfoUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) throw new Error("Google profile fetch failed");

  const data = await res.json();
  return {
    provider: "google",
    providerId: data.id,
    email: data.email,
    name: data.name || data.email.split("@")[0],
    avatar: data.picture,
  };
}

// ============================================================
// Facebook OAuth
// ============================================================

export function getFacebookAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: FACEBOOK_CONFIG.clientId,
    redirect_uri: FACEBOOK_CONFIG.redirectUri,
    response_type: "code",
    scope: FACEBOOK_CONFIG.scope,
    state,
  });
  return `${FACEBOOK_CONFIG.authorizeUrl}?${params}`;
}

export async function exchangeFacebookCode(code: string): Promise<string> {
  const params = new URLSearchParams({
    code,
    client_id: FACEBOOK_CONFIG.clientId,
    client_secret: FACEBOOK_CONFIG.clientSecret,
    redirect_uri: FACEBOOK_CONFIG.redirectUri,
  });

  const res = await fetch(`${FACEBOOK_CONFIG.tokenUrl}?${params}`);

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Facebook token exchange failed: ${err}`);
  }

  const data = await res.json();
  return data.access_token;
}

export async function getFacebookProfile(accessToken: string): Promise<OAuthProfile> {
  const res = await fetch(`${FACEBOOK_CONFIG.userInfoUrl}&access_token=${accessToken}`);

  if (!res.ok) throw new Error("Facebook profile fetch failed");

  const data = await res.json();
  return {
    provider: "facebook",
    providerId: data.id,
    email: data.email,
    name: data.name || `user${data.id.slice(-4)}`,
    avatar: data.picture?.data?.url,
  };
}

// ============================================================
// TikTok OAuth
// ============================================================

export function generateCodeVerifier(): string {
  return nanoid(64);
}

export function getTikTokAuthUrl(state: string, codeVerifier: string): string {
  const params = new URLSearchParams({
    client_key: TIKTOK_CONFIG.clientKey,
    redirect_uri: TIKTOK_CONFIG.redirectUri,
    response_type: "code",
    scope: TIKTOK_CONFIG.scope,
    state,
    code_challenge: codeVerifier,
    code_challenge_method: "S256",
  });
  return `${TIKTOK_CONFIG.authorizeUrl}?${params}`;
}

export async function exchangeTikTokCode(code: string, codeVerifier: string): Promise<string> {
  const res = await fetch(TIKTOK_CONFIG.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key: TIKTOK_CONFIG.clientKey,
      client_secret: TIKTOK_CONFIG.clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: TIKTOK_CONFIG.redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`TikTok token exchange failed: ${err}`);
  }

  const data = await res.json();
  return data.access_token;
}

export async function getTikTokProfile(accessToken: string): Promise<OAuthProfile> {
  const res = await fetch(
    `${TIKTOK_CONFIG.userInfoUrl}?fields=open_id,display_name,avatar_url`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) throw new Error("TikTok profile fetch failed");

  const data = await res.json();
  const user = data.data?.user;

  if (!user) throw new Error("TikTok profile data missing");

  return {
    provider: "tiktok",
    providerId: user.open_id,
    email: "", // TikTok genellikle e-posta vermez
    name: user.display_name || `tiktok_${user.open_id.slice(-6)}`,
    avatar: user.avatar_url,
  };
}
