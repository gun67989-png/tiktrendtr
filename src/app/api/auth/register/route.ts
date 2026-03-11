import { NextRequest, NextResponse } from "next/server";
import { createUser, seedDefaultAdmin } from "@/lib/db";
import { createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    await seedDefaultAdmin();

    const { username, email, password, confirmPassword } =
      await request.json();

    if (!username || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "Tüm alanlar zorunludur" },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: "Kullanıcı adı en az 3 karakter olmalıdır" },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json(
        { error: "Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Geçerli bir e-posta adresi girin" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Şifre en az 6 karakter olmalıdır" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Şifreler eşleşmiyor" },
        { status: 400 }
      );
    }

    const user = await createUser({ username, email, password, role: "user" });

    const token = await createSession({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      subscription_type: user.subscription_type || "free",
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        subscriptionType: user.subscription_type || "free",
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
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Kayıt sırasında bir hata oluştu";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
