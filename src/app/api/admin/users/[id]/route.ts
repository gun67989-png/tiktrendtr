import { NextRequest, NextResponse } from "next/server";
import { updateUser, deleteUser, findUserById } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const existingUser = findUserById(id);
    if (!existingUser) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (body.role !== undefined) {
      if (body.role !== "admin" && body.role !== "user") {
        return NextResponse.json(
          { error: "Geçersiz rol" },
          { status: 400 }
        );
      }
      updateData.role = body.role;
    }

    if (body.disabled !== undefined) {
      updateData.disabled = Boolean(body.disabled);
    }

    if (body.username !== undefined) {
      if (body.username.length < 3) {
        return NextResponse.json(
          { error: "Kullanıcı adı en az 3 karakter olmalıdır" },
          { status: 400 }
        );
      }
      updateData.username = body.username;
    }

    if (body.email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(
          { error: "Geçerli bir e-posta adresi girin" },
          { status: 400 }
        );
      }
      updateData.email = body.email;
    }

    const updated = updateUser(id, updateData);
    if (!updated) {
      return NextResponse.json(
        { error: "Güncelleme başarısız" },
        { status: 500 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...userPublic } = updated;
    return NextResponse.json({ user: userPublic });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Güncelleme başarısız";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const user = findUserById(id);
    if (!user) {
      return NextResponse.json(
        { error: "Kullanıcı bulunamadı" },
        { status: 404 }
      );
    }

    const deleted = deleteUser(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Silme başarısız" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
