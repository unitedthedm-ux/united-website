import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PropertyCard from "@/components/property/PropertyCard";
import type { Listing } from "@/types";
import { Globe, ArrowLeft } from "lucide-react";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function DeveloperPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch developer
  const { data: dev } = await supabase
    .from("developers")
    .select("id, name, slug, logo_url, website, description")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!dev) notFound();

  // Fetch listings for this developer
  const { data: listings } = await supabase
    .from("listings")
    .select("*, team_members(id, name, whatsapp_number, phone_number)")
    .eq("developer_id", dev.id)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  const count = listings?.length ?? 0;

  return (
    <main className="min-h-screen bg-background text-white">
      {/* Back */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-4">
        <Link href="/developers" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors">
          <ArrowLeft size={15} /> All Developers
        </Link>
      </div>

      {/* Developer header */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="rounded-2xl border border-border bg-card p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {dev.logo_url ? (
            <div className="w-24 h-24 relative rounded-2xl overflow-hidden bg-white/5 shrink-0 flex items-center justify-center">
              <Image src={dev.logo_url} alt={dev.name} fill className="object-contain p-2" sizes="96px" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-2xl bg-[#a4c8e0]/10 flex items-center justify-center text-[#a4c8e0] text-3xl font-bold shrink-0">
              {dev.name.charAt(0)}
            </div>
          )}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold mb-1">{dev.name}</h1>
            <p className="text-sm text-muted-foreground mb-3">
              {count} listing{count !== 1 ? "s" : ""} available on United TDM
            </p>
            {dev.description && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-3 max-w-2xl">{dev.description}</p>
            )}
            {dev.website && (
              <a
                href={dev.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs text-[#a4c8e0] hover:underline"
              >
                <Globe size={13} /> {dev.website.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-lg font-semibold mb-5">
          Available Units
          <span className="ml-2 text-sm text-muted-foreground font-normal">({count})</span>
        </h2>
        {count === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-muted-foreground text-sm">No listings available for this developer yet.</p>
            <Link href="/properties" className="mt-3 text-xs text-[#a4c8e0] hover:underline inline-block">
              Browse all properties →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings!.map((listing: Listing) => (
              <PropertyCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
