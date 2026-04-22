import { createClient } from "@/lib/supabase/server";
import HomeClient from "./HomeClient";

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: featured }, { data: resaleHighlights }, { data: videos }] =
    await Promise.all([
      supabase
        .from("listings")
        .select("*, team_members(id, name, whatsapp_number, phone_number)")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("resale_units")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(3),
      supabase
        .from("media_videos")
        .select("*")
        .eq("is_featured", true)
        .order("sort_order", { ascending: true })
        .limit(3),
    ]);

  return (
    <HomeClient
      featured={featured ?? []}
      resaleHighlights={resaleHighlights ?? []}
      videos={videos ?? []}
    />
  );
}
