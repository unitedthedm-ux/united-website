import { NextRequest, NextResponse } from "next/server";
import { setAdminCookie } from "@/lib/admin-auth";

const USERS: Record<string, string> = {
  admin:   "324511",
  united:  "united2024",
  manager: "tdm@2024",
};

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();
  const u = (username ?? "").trim().toLowerCase();
  const p = (password ?? "").trim();
  if (!USERS[u] || USERS[u] !== p) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  await setAdminCookie();
  return NextResponse.json({ ok: true });
}
