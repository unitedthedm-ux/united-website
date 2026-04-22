import { NextRequest, NextResponse } from "next/server";
import { setAdminCookie } from "@/lib/admin-auth";

const ADMIN_PW = process.env.ADMIN_PASSWORD?.trim() || "324511";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (password?.trim() !== ADMIN_PW) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  await setAdminCookie();
  return NextResponse.json({ ok: true });
}
