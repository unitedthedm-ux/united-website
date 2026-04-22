import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticatedFromHeader } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

function guard(req: NextRequest) {
  return isAdminAuthenticatedFromHeader(req.headers.get("cookie"));
}

export async function GET(req: NextRequest) {
  if (!guard(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = createAdminClient();
  const { data, error } = await db.from("resale_units").select("*").order("sort_order").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!guard(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const db = createAdminClient();
  const { data, error } = await db.from("resale_units").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
