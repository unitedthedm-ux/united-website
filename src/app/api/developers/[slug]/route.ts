import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

/** GET /api/developers/[slug] → developer detail + their listings */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch developer
  const { data: dev, error: devErr } = await supabase
    .from("developers")
    .select("id, name, slug, logo_url, website, description")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (devErr || !dev) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Fetch listings for this developer (via developer_id on listings)
  const { data: listings } = await supabase
    .from("listings")
    .select("id, title_en, title_ar, price, area_sqm, bedrooms, unit_type, images, compound_name, region, area, listing_type, is_featured, team_members(id, name, whatsapp_number, phone_number)")
    .eq("developer_id", dev.id)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  return NextResponse.json({ developer: dev, listings: listings ?? [] }, {
    headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" },
  });
}
