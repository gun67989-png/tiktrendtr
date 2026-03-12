import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { findUserByEmailOrUsername, findUserById, seedDefaultAdmin, type User } from "./db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret-change-me"
);

export interface SessionPayload {
  userId: string;
  username: string;
  email: string;
  role: "admin" | "user";
  subscriptionType: "free" | "premium";
  iat: number;
  [key: string]: unknown;
}

export async function verifyUserPassword(
  identifier: string,
  password: string
): Promise<User | null> {
  await seedDefaultAdmin();
  const user = await findUserByEmailOrUsername(identifier);
  if (!user) return null;
  if (user.disabled) return null;
  const valid = await bcrypt.compare(password, user.password);
  return valid ? user : null;
}

export async function createSession(user: {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  subscription_type?: "free" | "premium";
}): Promise<string> {
  const token = await new SignJWT({
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    subscriptionType: user.subscription_type || "free",
    iat: Date.now(),
  } as SessionPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
  return token;
}

export async function verifySession(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  return verifySession(token);
}

/**
 * Ödeme sonrası session'ı yenile (subscriptionType güncellensin)
 */
export async function refreshSession(userId: string): Promise<string | null> {
  const user = await findUserById(userId);
  if (!user) return null;

  const token = await createSession({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    subscription_type: user.subscription_type,
  });

  // Cookie'yi güncelle
  const cookieStore = cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 gün
    path: "/",
  });

  return token;
}
