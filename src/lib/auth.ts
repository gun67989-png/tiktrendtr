import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret-change-me"
);

const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || "TikTrend2024!";

export async function verifyPassword(password: string): Promise<boolean> {
  return password === DASHBOARD_PASSWORD;
}

export async function createSession(): Promise<string> {
  const token = await new SignJWT({ role: "admin", iat: Date.now() })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
  return token;
}

export async function verifySession(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function getSession(): Promise<boolean> {
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return false;
  return verifySession(token);
}
