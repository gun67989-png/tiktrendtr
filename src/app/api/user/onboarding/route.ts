import { NextRequest, NextResponse } from "next/server";
import { verifySession, createSession } from "@/lib/auth";
import { updateUser, findUserById } from "@/lib/db";

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
    // Plan ödeme yapılmadan güncellenmez - sadece role ve niche kaydedilir
    // Ücretli plan seçildiyse kullanıcı /payment sayfasına yönlendirilir

    const updated = await updateUser(session.userId, updateData);
    if (!updated) {
      console.error("[ONBOARDING] Failed to update user:", session.userId);
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    // Read fresh user data and create new session token
    const freshUser = await findUserById(session.userId);
    if (!freshUser) {
      return NextResponse.json({ error: "User not found" }, { status: 500 });
    }

    const newToken = await createSession({
      id: freshUser.id,
      username: freshUser.username,
      email: freshUser.email,
      role: freshUser.role,
      subscription_type: freshUser.subscription_type,
      subscription_niche: freshUser.subscription_niche,
      subscription_role: freshUser.subscription_role,
      onboarding_completed: freshUser.onboarding_completed,
    });

    // Set cookie directly on the response object
    const response = NextResponse.json({ success: true });
    response.cookies.set("session", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (e) {
    console.error("[ONBOARDING] Error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
