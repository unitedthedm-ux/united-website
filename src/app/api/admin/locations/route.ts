import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/admin/locations
 * Add a new compound (level 5) under an area (level 4)
 */
export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name_en, name_ar, parent_id, level = 5 } = body;

  if (!name_en?.trim()) {
    return NextResponse.json({ error: "name_en is required" }, { status: 400 });
  }
  if (!parent_id) {
    return NextResponse.json({ error: "parent_id is required" }, { status: 400 });
  }

  // Generate a URL-safe slug with timestamp to avoid conflicts
  const base = name_en
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const slug = `compound-${base}-${Date.now().toString(36)}`;

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("locations")
    .insert({
      name_en: name_en.trim(),
      name_ar: (name_ar ?? name_en).trim(),
      slug,
      level,
      parent_id,
    })
    .select("id, name_en, name_ar, slug, level, parent_id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
