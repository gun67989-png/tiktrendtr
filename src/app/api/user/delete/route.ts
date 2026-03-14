import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";
import { findUserById, updateUser } from "@/lib/db";

export async function DELETE(request: NextRequest) {
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

    // Soft-delete: disable account and anonymize data
    await updateUser(session.userId, {
      disabled: true,
      email: `deleted_${session.userId}@valyze.app`,
      username: `deleted_${session.userId}`,
      subscription_type: "free",
      subscription_status: "cancelled",
    });

    // Clear session cookie
    const response = NextResponse.json({ success: true, message: "Hesabınız silindi." });
    response.cookies.set("session", "", { maxAge: 0, path: "/" });
    return response;
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
