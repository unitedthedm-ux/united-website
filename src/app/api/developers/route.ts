import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/** GET /api/developers → active developers for public listing */
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("developers")
    .select("id, name, slug, logo_url, website, description")
    .eq("is_active", true)
    .order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? [], {
    headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" },
  });
}
