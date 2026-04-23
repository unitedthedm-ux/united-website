import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticatedFromHeader } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";

function guard(req: NextRequest) {
  return isAdminAuthenticatedFromHeader(req.headers.get("cookie"));
}

function makeSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

/** GET /api/admin/developers → all developers including inactive */
export async function GET(req: NextRequest) {
  if (!guard(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = createAdminClient();
  const { data, error } = await db
    .from("developers")
    .select("*")
    .order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

/** POST /api/admin/developers → create developer */
export async function POST(req: NextRequest) {
  if (!guard(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { name, logo_url, website, description } = body;
  if (!name?.trim()) return NextResponse.json({ error: "name is required" }, { status: 400 });
  const db = createAdminClient();
  const slug = makeSlug(name) + "-" + Date.now().toString(36);
  const { data, error } = await db
    .from("developers")
    .insert({ name: name.trim(), slug, logo_url: logo_url || null, website: website || null, description: description || null, is_active: true })
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
