import { createClient } from "@/lib/supabase/server";
import ResaleClient from "./ResaleClient";

export default async function ResalePage() {
  const supabase = await createClient();
  const { data: units } = await supabase
    .from("resale_units")
    .select("*")
    .order("created_at", { ascending: false });

  return <ResaleClient units={units ?? []} />;
}
