import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import type { Developer } from "@/types";

export const revalidate = 60;

export default async function DevelopersPage() {
  const supabase = await createClient();
  const { data: developers } = await supabase
    .from("developers")
    .select("id, name, slug, logo_url, website, description")
    .eq("is_active", true)
    .order("name");

  return (
    <main className="min-h-screen bg-background text-white">
      {/* Hero */}
      <section className="border-b border-border bg-card px-6 py-14 text-center">
        <h1 className="text-3xl font-bold mb-2">Developers</h1>
        <p className="text-muted-foreground text-sm max-w-xl mx-auto">
          Browse Egypt&apos;s top real estate developers and explore their available units on United TDM.
        </p>
      </section>

      {/* Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {!developers?.length ? (
          <p className="text-center text-muted-foreground">No developers listed yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {developers.map((dev: Developer) => (
              <Link
                key={dev.id}
                href={`/developers/${dev.slug}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-5 hover:border-[#a4c8e0]/50 hover:bg-muted/30 transition-all"
              >
                {dev.logo_url ? (
                  <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-white/5 flex items-center justify-center">
                    <Image
                      src={dev.logo_url}
                      alt={dev.name}
                      fill
                      className="object-contain p-1"
                      sizes="64px"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-[#a4c8e0]/10 flex items-center justify-center text-[#a4c8e0] text-xl font-bold">
                    {dev.name.charAt(0)}
                  </div>
                )}
                <p className="text-xs font-semibold text-white text-center group-hover:text-[#a4c8e0] transition-colors leading-tight">
                  {dev.name}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
