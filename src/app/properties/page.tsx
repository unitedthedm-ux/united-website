import { createClient } from "@/lib/supabase/server";
import PropertiesClient from "./PropertiesClient";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ region?: string; q?: string }>;
}) {
  const { region, q } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from("listings").select("*").order("created_at", { ascending: false });
  if (region) query = query.eq("region", region);

  const { data: listings } = await query;

  return <PropertiesClient listings={listings ?? []} initialRegion={region} />;
}
