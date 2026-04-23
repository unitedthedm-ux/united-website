import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticatedFromHeader } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";

function guard(req: NextRequest) {
  return isAdminAuthenticatedFromHeader(req.headers.get("cookie"));
}

/** PATCH /api/admin/compounds/[id] */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!guard(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const db = createAdminClient();
  const { data, error } = await db
    .from("compounds")
    .update(body)
    .eq("id", id)
    .select("*, developers(id, name, logo_url)")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

/** DELETE /api/admin/compounds/[id] */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!guard(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const db = createAdminClient();
  const { error } = await db.from("compounds").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
