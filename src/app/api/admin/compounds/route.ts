import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticatedFromHeader } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";

function guard(req: NextRequest) {
  return isAdminAuthenticatedFromHeader(req.headers.get("cookie"));
}

function makeSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

/** GET /api/admin/compounds?search=xxx → all compounds (admin) */
export async function GET(req: NextRequest) {
  if (!guard(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = req.nextUrl;
  const search = url.searchParams.get("search");
  const db = createAdminClient();
  let query = db
    .from("compounds")
    .select("*, developers(id, name, logo_url)")
    .order("name");
  if (search) query = query.ilike("name", `%${search}%`);
  const { data, error } = await query.limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

/** POST /api/admin/compounds → create compound */
export async function POST(req: NextRequest) {
  if (!guard(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { name, developer_id, governorate, district, area, city_name, cover_image_url, description } = body;
  if (!name?.trim()) return NextResponse.json({ error: "name is required" }, { status: 400 });
  const db = createAdminClient();
  const baseSlug = makeSlug(name);
  const slug = baseSlug + "-" + Date.now().toString(36);
  const { data, error } = await db
    .from("compounds")
    .insert({
      name: name.trim(),
      slug,
      developer_id: developer_id || null,
      governorate: governorate || null,
      district: district || null,
      area: area || null,
      city_name: city_name || null,
      cover_image_url: cover_image_url || null,
      description: description || null,
      is_active: true,
    })
    .select("*, developers(id, name, logo_url)")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
