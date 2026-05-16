import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { Resend } from "resend";

const REPORT_TO = "thedealmaker.xyz@gmail.com";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized — please log in first." }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Email is not configured yet. Add RESEND_API_KEY to the environment variables." },
      { status: 500 }
    );
  }

  let body: { message?: string; reporter?: string; page?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Could not read the request." }, { status: 400 });
  }

  const message = (body.message ?? "").toString().trim();
  const reporter = (body.reporter ?? "").toString().trim();
  const page = (body.page ?? "").toString().trim();

  if (!message) {
    return NextResponse.json({ error: "Please describe the problem." }, { status: 400 });
  }

  const when = new Date().toLocaleString("en-GB", { timeZone: "Africa/Cairo" });
  const resend = new Resend(apiKey);

  try {
    await resend.emails.send({
      from: "UNITED Website <onboarding@resend.dev>",
      to: REPORT_TO,
      subject: `Bug report — UNITED admin${reporter ? ` (${reporter})` : ""}`,
      html: `
        <div style="font-family:Arial,sans-serif;color:#1f2d3a;line-height:1.7;">
          <h2 style="color:#0a2233;margin-bottom:4px;">Bug report — UNITED Real Estate</h2>
          <p><strong>Reporter:</strong> ${esc(reporter) || "—"}</p>
          <p><strong>Page / where:</strong> ${esc(page) || "—"}</p>
          <p><strong>Time:</strong> ${when} (Cairo)</p>
          <hr style="border:none;border-top:1px solid #e4eaef;">
          <p style="white-space:pre-wrap;">${esc(message)}</p>
        </div>`,
    });
  } catch (err: unknown) {
    const m = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Could not send the report: ${m}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
