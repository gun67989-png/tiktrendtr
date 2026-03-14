import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

const CSRF_COOKIE = "csrf-token";
const CSRF_HEADER = "x-csrf-token";

export function generateCsrfToken(): string {
  return nanoid(32);
}

export function setCsrfCookie(response: NextResponse, token: string): void {
  response.cookies.set(CSRF_COOKIE, token, {
    httpOnly: false, // must be readable by JS
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export function validateCsrf(request: NextRequest): boolean {
  // Only validate state-changing methods
  const method = request.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return true;
  }

  const cookieToken = request.cookies.get(CSRF_COOKIE)?.value;
  const headerToken = request.headers.get(CSRF_HEADER);

  if (!cookieToken || !headerToken) return false;
  return cookieToken === headerToken;
}
