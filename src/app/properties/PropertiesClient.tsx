"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import PropertyCard from "@/components/property/PropertyCard";
import type { Listing } from "@/types";

const REGIONS = [
  { slug: "", labelEn: "All Areas", labelAr: "كل المناطق" },
  { slug: "new-capital", labelEn: "New Capital", labelAr: "العاصمة الإدارية" },
  { slug: "new-cairo", labelEn: "New Cairo", labelAr: "القاهرة الجديدة" },
  { slug: "north-coast", labelEn: "North Coast", labelAr: "الساحل الشمالي" },
  { slug: "sheikh-zayed", labelEn: "Sheikh Zayed", labelAr: "الشيخ زايد" },
  { slug: "6th-october", labelEn: "6th of October", labelAr: "السادس من أكتوبر" },
  { slug: "el-alamein", labelEn: "El Alamein", labelAr: "العلمين" },
];

export default function PropertiesClient({
  listings,
  initialRegion,
}: {
  listings: Listing[];
  initialRegion?: string;
}) {
  const { t, locale } = useLocale();
  const [region, setRegion] = useState(initialRegion ?? "");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return listings.filter((l) => {
      const title = locale === "ar" ? l.title_ar : l.title_en;
      const matchRegion = !region || l.region === region;
      const matchQuery = !query || title.toLowerCase().includes(query.toLowerCase());
      return matchRegion && matchQuery;
    });
  }, [listings, region, query, locale]);

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#a4c8e0] mb-2">UNITED</p>
        <h1 className="text-3xl md:text-4xl font-bold">{t.nav.properties}</h1>
        <p className="text-muted-foreground mt-2 text-sm">{t.hero.sub}</p>
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex items-center gap-2 flex-1 rounded-xl border border-border bg-card px-4 py-2.5 focus-within:border-[#a4c8e0]/60 transition-colors">
          <Search size={16} className="text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.hero.search}
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {REGIONS.map((r) => (
            <button
              key={r.slug}
              onClick={() => setRegion(r.slug)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium border transition-colors ${
                region === r.slug
                  ? "bg-[#a4c8e0] border-[#a4c8e0] text-[#0a2233]"
                  : "border-border text-muted-foreground hover:border-[#a4c8e0]/50"
              }`}
            >
              {locale === "ar" ? r.labelAr : r.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground mb-6">
        {filtered.length} {locale === "ar" ? "وحدة" : "units"}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((l) => (
            <PropertyCard key={l.id} listing={l} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-muted-foreground text-sm">
          {t.common.noResults}
        </div>
      )}
    </div>
  );
}
