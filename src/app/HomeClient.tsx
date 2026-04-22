"use client";

import Link from "next/link";
import { useLocale } from "@/context/LocaleContext";
import HeroSection from "@/components/sections/HeroSection";
import PropertyCard from "@/components/property/PropertyCard";
import VideoCard from "@/components/media/VideoCard";
import type { Listing, ResaleUnit, MediaVideo } from "@/types";

const REGIONS = [
  { slug: "new-capital", nameEn: "New Capital", nameAr: "العاصمة الإدارية" },
  { slug: "new-cairo", nameEn: "New Cairo", nameAr: "القاهرة الجديدة" },
  { slug: "north-coast", nameEn: "North Coast", nameAr: "الساحل الشمالي" },
  { slug: "sheikh-zayed", nameEn: "Sheikh Zayed", nameAr: "الشيخ زايد" },
  { slug: "6th-october", nameEn: "6th of October", nameAr: "السادس من أكتوبر" },
  { slug: "el-alamein", nameEn: "El Alamein", nameAr: "العلمين" },
];

function SectionHeader({
  title,
  sub,
  href,
  cta,
}: {
  title: string;
  sub: string;
  href?: string;
  cta?: string;
}) {
  return (
    <div className="flex items-end justify-between mb-8 gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#a4c8e0] mb-2">
          UNITED
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1">{sub}</p>
      </div>
      {href && cta && (
        <Link
          href={href}
          className="shrink-0 rounded-full border border-border px-5 py-2 text-sm font-medium hover:bg-muted transition-colors"
        >
          {cta} →
        </Link>
      )}
    </div>
  );
}

export default function HomeClient({
  featured,
  resaleHighlights,
  videos,
}: {
  featured: Listing[];
  resaleHighlights: ResaleUnit[];
  videos: MediaVideo[];
}) {
  const { t, locale } = useLocale();

  return (
    <>
      <HeroSection />

      {/* Featured Properties */}
      {featured.length > 0 && (
        <section className="container mx-auto px-4 md:px-8 py-16">
          <SectionHeader
            title={t.sections.featured}
            sub={t.sections.featuredSub}
            href="/properties"
            cta={t.sections.viewAll}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((l) => (
              <PropertyCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}

      {/* Regions */}
      <section className="container mx-auto px-4 md:px-8 py-16">
        <SectionHeader
          title={t.sections.regions}
          sub={t.sections.regionsSub}
          href="/properties"
          cta={t.sections.viewAll}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {REGIONS.map((r) => (
            <Link
              key={r.slug}
              href={`/properties?region=${r.slug}`}
              className="group rounded-2xl border border-border bg-card p-4 text-center hover:border-[#a4c8e0]/60 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-full bg-[#a4c8e0]/15 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#a4c8e0]/30 transition-colors">
                <span className="text-[#a4c8e0] text-lg">🏙</span>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {locale === "ar" ? r.nameAr : r.nameEn}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Resale Highlights */}
      {resaleHighlights.length > 0 && (
        <section className="bg-muted/40 py-16">
          <div className="container mx-auto px-4 md:px-8">
            <SectionHeader
              title={t.sections.resale}
              sub={t.sections.resaleSub}
              href="/resale"
              cta={t.sections.viewAll}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resaleHighlights.map((u) => (
                <PropertyCard
                  key={u.id}
                  listing={u as unknown as Listing}
                  href={`/resale/${u.id}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Media teaser */}
      {videos.length > 0 && (
        <section className="container mx-auto px-4 md:px-8 py-16">
          <SectionHeader
            title={t.sections.media}
            sub={t.sections.mediaSub}
            href="/media"
            cta={t.sections.viewAll}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </section>
      )}

      {/* WhatsApp CTA Banner */}
      <section className="container mx-auto px-4 md:px-8 py-16">
        <div className="rounded-3xl bg-gradient-to-br from-[#0a2233] to-[#1a3d55] p-10 md:p-14 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            {locale === "ar"
              ? "هل أنت مستعد للعثور على عقارك المثالي؟"
              : "Ready to find your perfect property?"}
          </h2>
          <p className="text-white/60 mb-8 text-sm">
            {locale === "ar"
              ? "تواصل معنا الآن عبر واتساب وسيساعدك فريقنا"
              : "Chat with our team on WhatsApp right now."}
          </p>
          <a
            href="https://wa.me/201000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#a4c8e0] px-8 py-3 text-sm font-semibold text-[#0a2233] hover:bg-[#cce3f0] transition-colors"
          >
            {t.property.whatsapp}
          </a>
        </div>
      </section>
    </>
  );
}
