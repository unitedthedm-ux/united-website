import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticatedFromHeader } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

function guard(req: NextRequest) {
  return isAdminAuthenticatedFromHeader(req.headers.get("cookie"));
}

export async function GET(req: NextRequest) {
  if (!guard(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = createAdminClient();
  const { data, error } = await db
    .from("team_members")
    .select("*")
    .order("is_default", { ascending: false })
    .order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!guard(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const db = createAdminClient();

  // If this is marked as default, unset all others first
  if (body.is_default) {
    await db.from("team_members").update({ is_default: false }).neq("id", "00000000-0000-0000-0000-000000000000");
  }

  const { data, error } = await db.from("team_members").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
