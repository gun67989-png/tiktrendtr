import { NextRequest, NextResponse } from "next/server";
import { getAllUsersPublic, createUser, seedDefaultAdmin } from "@/lib/db";

export async function GET() {
  try {
    await seedDefaultAdmin();
    const users = await getAllUsersPublic();
    return NextResponse.json({ users });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await seedDefaultAdmin();
    const { username, email, password, role } = await request.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Kullanıcı adı, e-posta ve şifre zorunludur" },
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

    const validRole = role === "admin" ? "admin" : "user";
    const user = await createUser({
      username,
      email,
      password,
      role: validRole,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...userPublic } = user;
    return NextResponse.json({ user: userPublic }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Kullanıcı oluşturulamadı";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
