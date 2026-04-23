import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/compounds?search=xxx  → search active compounds (for listing form autocomplete)
 * GET /api/compounds?all=1       → all active compounds
 */
export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const search = url.searchParams.get("search");

  const supabase = await createClient();
  let query = supabase
    .from("compounds")
    .select("id, name, slug, developer_id, developers(id, name), governorate, district, area, city_name")
    .eq("is_active", true)
    .order("name");

  if (search) query = query.ilike("name", `%${search}%`);

  const { data, error } = await query.limit(20);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? [], {
    headers: { "Cache-Control": "public, max-age=30, stale-while-revalidate=120" },
  });
}
