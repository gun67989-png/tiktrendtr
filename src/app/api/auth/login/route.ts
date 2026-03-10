import { NextRequest, NextResponse } from "next/server";
import { verifyUserPassword, createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Kullanıcı adı/e-posta ve şifre gerekli" },
        { status: 400 }
      );
    }

    const user = await verifyUserPassword(identifier, password);

    if (!user) {
      return NextResponse.json(
        { error: "Geçersiz kullanıcı adı/e-posta veya şifre" },
        { status: 401 }
      );
    }

    const token = await createSession({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
