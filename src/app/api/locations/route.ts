import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/locations?level=2
 * GET /api/locations?level=3&parent_id={uuid}
 * GET /api/locations?level=4&parent_id={uuid}
 * GET /api/locations?level=5&parent_id={uuid}
 * GET /api/locations?name_en=Cairo&level=2   (find by name for edit pre-fill)
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const level = url.searchParams.get("level");
  const parentId = url.searchParams.get("parent_id");
  const nameEn = url.searchParams.get("name_en");

  const supabase = await createClient();

  let query = supabase
    .from("locations")
    .select("id, name_en, name_ar, slug, level, parent_id")
    .order("name_en");

  if (level) query = query.eq("level", Number(level));
  if (parentId) query = query.eq("parent_id", parentId);
  if (nameEn) query = query.ilike("name_en", nameEn);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? [], {
    headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" },
  });
}
