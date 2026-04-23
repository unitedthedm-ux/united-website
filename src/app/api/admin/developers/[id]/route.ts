import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticatedFromHeader } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";

function guard(req: NextRequest) {
  return isAdminAuthenticatedFromHeader(req.headers.get("cookie"));
}

/** PUT /api/admin/developers/[id] */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!guard(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const db = createAdminClient();
  const { data, error } = await db
    .from("developers")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** DELETE /api/admin/developers/[id] */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!guard(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const db = createAdminClient();
  const { error } = await db.from("developers").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
