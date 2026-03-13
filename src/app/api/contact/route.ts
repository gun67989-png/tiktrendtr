import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const CATEGORY_LABELS: Record<string, string> = {
  destek: "Destek",
  hata: "Hata Bildirimi",
  oneri: "Öneri",
  diger: "Diğer",
};

export async function POST(req: Request) {
  try {
    const { name, email, category, message } = await req.json();

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Tüm alanlar zorunludur." }, { status: 400 });
    }

    const categoryLabel = CATEGORY_LABELS[category] || category;

    await resend.emails.send({
      from: "Valyze TR Destek <destek@valyze.app>",
      to: ["destek@valyze.app"],
      replyTo: email,
      subject: `[${categoryLabel}] ${name} - Yeni Destek Talebi`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #e11d48; margin-bottom: 24px;">Yeni Destek Talebi</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #666; width: 120px;">Kategori:</td>
              <td style="padding: 8px 12px;">${categoryLabel}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #666;">İsim:</td>
              <td style="padding: 8px 12px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; font-weight: bold; color: #666;">E-posta:</td>
              <td style="padding: 8px 12px;"><a href="mailto:${email}">${email}</a></td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
            <p style="margin: 0; font-weight: bold; color: #666; margin-bottom: 8px;">Mesaj:</p>
            <p style="margin: 0; white-space: pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
          </div>
          <p style="margin-top: 24px; font-size: 12px; color: #999;">Bu mail Valyze TR iletişim formundan otomatik gönderilmiştir. Yanıtlamak için doğrudan reply yapabilirsiniz.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact email error:", error);
    return NextResponse.json({ error: "Mail gönderilemedi." }, { status: 500 });
  }
}
