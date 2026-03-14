import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { findUserById } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await findUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // GDPR data export — return all user data except password hash
    const exportData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      subscription_type: user.subscription_type,
      subscription_status: user.subscription_status,
      subscription_niche: user.subscription_niche,
      subscription_role: user.subscription_role,
      onboarding_completed: user.onboarding_completed,
      created_at: user.created_at,
      exported_at: new Date().toISOString(),
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="valyze-data-export-${user.username}.json"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
