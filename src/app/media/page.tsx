import { createClient } from "@/lib/supabase/server";
import MediaClient from "./MediaClient";

export default async function MediaPage() {
  const supabase = await createClient();
  const { data: videos } = await supabase
    .from("media_videos")
    .select("*")
    .order("sort_order", { ascending: true });

  return <MediaClient videos={videos ?? []} />;
}
