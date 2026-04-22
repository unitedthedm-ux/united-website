import { createClient } from "@/lib/supabase/server";
import PropertiesClient from "./PropertiesClient";

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; region?: string; q?: string }>;
}) {
  const { tab, region, q } = await searchParams;
  const supabase = await createClient();

  const [{ data: listings }, { data: resale }] = await Promise.all([
    supabase.from("listings").select("*, team_members(id, name, whatsapp_number, phone_number)").order("created_at", { ascending: false }),
    supabase.from("resale_units").select("*").order("created_at", { ascending: false }),
  ]);

  return (
    <PropertiesClient
      listings={listings ?? []}
      resaleUnits={resale ?? []}
      initialTab={tab === "resale" ? "resale" : "listings"}
      initialRegion={region}
    />
  );
}
