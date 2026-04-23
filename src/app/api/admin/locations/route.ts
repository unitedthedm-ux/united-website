import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticatedFromHeader } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";

function guard(req: NextRequest) {
  return isAdminAuthenticatedFromHeader(req.headers.get("cookie"));
}

function makeSlug(name_en: string, level: number) {
  const base = name_en.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const prefix = level === 2 ? "gov" : level === 3 ? "dist" : level === 4 ? "area" : "compound";
  return `${prefix}-${base}-${Date.now().toString(36)}`;
}

/**
 * GET /api/admin/locations?level=2&parent_id=xxx   → all locations (incl. inactive)
 */
export async function GET(req: NextRequest) {
  if (!guard(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = req.nextUrl;
  const level = url.searchParams.get("level");
  const parentId = url.searchParams.get("parent_id");
  const db = createAdminClient();

  let query = db
    .from("locations")
    .select("id, name_en, name_ar, slug, level, parent_id, is_active")
    .order("name_en");

  if (level) query = query.eq("level", Number(level));
  if (parentId) query = query.eq("parent_id", parentId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

/**
 * POST /api/admin/locations  → add location at any level
 */
export async function POST(req: NextRequest) {
  if (!guard(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { name_en, name_ar, parent_id, level = 5 } = body;

  if (!name_en?.trim()) return NextResponse.json({ error: "name_en is required" }, { status: 400 });
  if (level > 2 && !parent_id) return NextResponse.json({ error: "parent_id required for level > 2" }, { status: 400 });

  const db = createAdminClient();
  const { data, error } = await db
    .from("locations")
    .insert({ name_en: name_en.trim(), name_ar: (name_ar ?? name_en).trim(), slug: makeSlug(name_en, level), level, parent_id: parent_id ?? null, is_active: true })
    .select("id, name_en, name_ar, slug, level, parent_id, is_active")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
