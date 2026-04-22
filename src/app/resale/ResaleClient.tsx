"use client";

import { useState, useMemo } from "react";
import { Search, Tag } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import PropertyCard from "@/components/property/PropertyCard";
import type { ResaleUnit, Listing } from "@/types";

export default function ResaleClient({ units }: { units: ResaleUnit[] }) {
  const { t, locale } = useLocale();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query) return units;
    return units.filter((u) => {
      const title = locale === "ar" ? u.title_ar : u.title_en;
      return title.toLowerCase().includes(query.toLowerCase());
    });
  }, [units, query, locale]);

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#a4c8e0]/15 px-3 py-1 text-xs font-semibold text-[#0a2233] mb-4">
          <Tag size={12} />
          {locale === "ar" ? "وحدات إعادة البيع" : "Resale Units"}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">{t.resalePage.title}</h1>
        <p className="text-muted-foreground mt-2 text-sm">{t.resalePage.sub}</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 max-w-md rounded-xl border border-border bg-card px-4 py-2.5 mb-8 focus-within:border-[#a4c8e0]/60 transition-colors">
        <Search size={16} className="text-muted-foreground" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.hero.search}
          className="flex-1 bg-transparent text-sm outline-none"
        />
      </div>

      <p className="text-xs text-muted-foreground mb-6">
        {filtered.length} {locale === "ar" ? "وحدة متاحة" : "units available"}
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((u) => (
            <PropertyCard
              key={u.id}
              listing={u as unknown as Listing}
            />
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
