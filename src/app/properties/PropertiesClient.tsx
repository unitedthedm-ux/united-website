"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import PropertyCard from "@/components/property/PropertyCard";
import type { Listing, ResaleUnit } from "@/types";

// Region filter pills — match against listing.neighborhood (district level)
// or listing.area — whichever is set when creating the listing
const REGIONS = [
  { slug: "", labelEn: "All Areas", labelAr: "كل المناطق" },
  { slug: "East Cairo", labelEn: "East Cairo", labelAr: "شرق القاهرة" },
  { slug: "North Coast", labelEn: "North Coast", labelAr: "الساحل الشمالي" },
  { slug: "Sheikh Zayed & 6th October", labelEn: "Sheikh Zayed", labelAr: "الشيخ زايد" },
  { slug: "Alexandria Areas", labelEn: "Alexandria", labelAr: "الإسكندرية" },
  { slug: "Ain Sokhna", labelEn: "Ain Sokhna", labelAr: "عين السخنة" },
  { slug: "Red Sea Areas", labelEn: "Red Sea", labelAr: "البحر الأحمر" },
  { slug: "South Sinai", labelEn: "Sharm El-Sheikh", labelAr: "شرم الشيخ" },
];

type Tab = "listings" | "resale";

export default function PropertiesClient({
  listings,
  resaleUnits,
  initialTab = "listings",
  initialRegion,
}: {
  listings: Listing[];
  resaleUnits: ResaleUnit[];
  initialTab?: Tab;
  initialRegion?: string;
}) {
  const { locale } = useLocale();
  const [tab, setTab] = useState<Tab>(initialTab);
  const [region, setRegion] = useState(initialRegion ?? "");
  const [query, setQuery] = useState("");

  const filteredListings = useMemo(() => {
    return listings.filter((l) => {
      const title = locale === "ar" ? l.title_ar : l.title_en;
      // Match against neighborhood (district), area, or region (governorate)
      const matchRegion =
        !region ||
        l.neighborhood === region ||
        l.area === region ||
        l.region === region;
      const matchQuery =
        !query ||
        title.toLowerCase().includes(query.toLowerCase()) ||
        (l.compound_name ?? "").toLowerCase().includes(query.toLowerCase()) ||
        (l.area ?? "").toLowerCase().includes(query.toLowerCase()) ||
        (l.neighborhood ?? "").toLowerCase().includes(query.toLowerCase());
      return matchRegion && matchQuery;
    });
  }, [listings, region, query, locale]);

  const filteredResale = useMemo(() => {
    return resaleUnits.filter((u) => {
      const title = locale === "ar" ? u.title_ar : u.title_en;
      const matchRegion =
        !region ||
        (u as unknown as { neighborhood?: string }).neighborhood === region ||
        u.area === region ||
        u.region === region;
      const matchQuery =
        !query ||
        title.toLowerCase().includes(query.toLowerCase()) ||
        (u.compound_name ?? "").toLowerCase().includes(query.toLowerCase()) ||
        (u.area ?? "").toLowerCase().includes(query.toLowerCase());
      return matchRegion && matchQuery;
    });
  }, [resaleUnits, region, query, locale]);

  const shown = tab === "listings" ? filteredListings : filteredResale;

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#a4c8e0] mb-2">UNITED</p>
        <h1 className="text-3xl md:text-4xl font-bold text-white">
          {locale === "ar" ? "العقارات" : "Properties"}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          {locale === "ar"
            ? "تصفح وحدات التطوير الجديدة وإعادة البيع في مصر"
            : "Browse new development units and resale properties across Egypt"}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-8 bg-card rounded-xl p-1 border border-border w-fit">
        <button
          onClick={() => setTab("listings")}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            tab === "listings"
              ? "bg-[#a4c8e0] text-[#0a2233] shadow"
              : "text-muted-foreground hover:text-white"
          }`}
        >
          {locale === "ar" ? "وحدات جديدة" : "New Listings"}
          <span className={`ml-2 text-xs rounded-full px-1.5 py-0.5 ${
            tab === "listings" ? "bg-[#0a2233]/20" : "bg-muted"
          }`}>
            {listings.length}
          </span>
        </button>
        <button
          onClick={() => setTab("resale")}
          className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
            tab === "resale"
              ? "bg-[#a4c8e0] text-[#0a2233] shadow"
              : "text-muted-foreground hover:text-white"
          }`}
        >
          {locale === "ar" ? "إعادة البيع" : "Resale"}
          <span className={`ml-2 text-xs rounded-full px-1.5 py-0.5 ${
            tab === "resale" ? "bg-[#0a2233]/20" : "bg-muted"
          }`}>
            {resaleUnits.length}
          </span>
        </button>
      </div>

      {/* Search + Region filters */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-2 max-w-lg rounded-xl border border-border bg-card px-4 py-2.5 focus-within:border-[#a4c8e0]/60 transition-colors">
          <Search size={16} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={locale === "ar" ? "ابحث باسم المشروع أو الموقع..." : "Search by project or location..."}
            className="flex-1 bg-transparent text-sm outline-none text-white placeholder:text-muted-foreground"
          />
        </div>

        {/* Region pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {REGIONS.map((r) => (
            <button
              key={r.slug}
              onClick={() => setRegion(r.slug)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium border transition-colors ${
                region === r.slug
                  ? "bg-[#a4c8e0] border-[#a4c8e0] text-[#0a2233]"
                  : "border-border text-muted-foreground hover:border-[#a4c8e0]/50 hover:text-white"
              }`}
            >
              {locale === "ar" ? r.labelAr : r.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-muted-foreground mb-6">
        {shown.length} {locale === "ar" ? "وحدة" : "units found"}
      </p>

      {/* Grid */}
      {shown.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shown.map((item) => (
            <PropertyCard
              key={item.id}
              listing={item as unknown as Listing}
              isResale={tab === "resale"}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <p className="text-muted-foreground text-sm">
            {locale === "ar" ? "لا توجد نتائج" : "No properties found"}
          </p>
          <button
            onClick={() => { setQuery(""); setRegion(""); }}
            className="text-xs text-[#a4c8e0] hover:underline"
          >
            {locale === "ar" ? "مسح الفلاتر" : "Clear filters"}
          </button>
        </div>
      )}
    </div>
  );
}
