import { NextRequest, NextResponse } from "next/server";
import { verifySession, refreshSession } from "@/lib/auth";
import { updateUser } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { role, niche, plan } = body;

    // Update user with onboarding data
    const updateData: Record<string, unknown> = {
      onboarding_completed: true,
    };

    if (role) updateData.subscription_role = role;
    if (niche) updateData.subscription_niche = niche;
    if (plan && plan !== "free") updateData.subscription_type = plan;

    await updateUser(session.userId, updateData);

    // Refresh session to include new data
    await refreshSession(session.userId);

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[ONBOARDING] Error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
