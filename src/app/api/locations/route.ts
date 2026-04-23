import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/locations?level=2                          → active governorates
 * GET /api/locations?level=3&parent_id={uuid}         → active districts
 * GET /api/locations?level=4&parent_id={uuid}         → active areas
 * GET /api/locations?level=5&parent_id={uuid}         → active compounds
 * GET /api/locations?all=1&level=2                    → all (admin, bypasses is_active)
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const level = url.searchParams.get("level");
  const parentId = url.searchParams.get("parent_id");
  const nameEn = url.searchParams.get("name_en");
  const showAll = url.searchParams.get("all") === "1";

  const supabase = await createClient();

  let query = supabase
    .from("locations")
    .select("id, name_en, name_ar, slug, level, parent_id, is_active")
    .order("name_en");

  if (level) query = query.eq("level", Number(level));
  if (parentId) query = query.eq("parent_id", parentId);
  if (nameEn) query = query.ilike("name_en", nameEn);
  if (!showAll) query = query.eq("is_active", true);

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data ?? [], {
    headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" },
  });
}
