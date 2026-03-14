import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { findUserById } from "@/lib/db";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const session = await verifySession(token);
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  // Always read fresh data from DB to avoid stale JWT issues
  const freshUser = await findUserById(session.userId);
  if (!freshUser) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      userId: freshUser.id,
      username: freshUser.username,
      email: freshUser.email,
      role: freshUser.role,
      subscriptionType: freshUser.subscription_type || "free",
      subscriptionNiche: freshUser.subscription_niche || null,
      subscriptionRole: freshUser.subscription_role || null,
      onboardingCompleted: freshUser.onboarding_completed ?? false,
    },
  });
}
