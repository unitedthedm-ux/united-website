"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Phone } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import type { Listing } from "@/types";

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

function fmtFull(n: number) {
  return n.toLocaleString("en-EG");
}

export default function PropertyCard({
  listing,
  isResale = false,
}: {
  listing: Listing;
  isResale?: boolean;
}) {
  const { locale } = useLocale();
  const title = locale === "ar" ? listing.title_ar : listing.title_en;
  const images = listing.images?.length ? listing.images : [];
  const [idx, setIdx] = useState(0);

  const agent = listing.team_members;
  const wa = agent?.whatsapp_number ?? listing.whatsapp_number ?? "201000000000";
  const callNum = agent?.phone_number ?? agent?.whatsapp_number ?? listing.whatsapp_number ?? "201000000000";
  const waMsg = encodeURIComponent(
    locale === "ar" ? `مهتم بـ: ${title}` : `Interested in: ${title}`
  );

  const specParts = [
    listing.unit_type,
    listing.area_sqm > 0 ? `${listing.area_sqm} m²` : null,
    listing.bedrooms != null ? `${listing.bedrooms} ${locale === "ar" ? "غرفة" : "Beds"}` : null,
    listing.bathrooms != null ? `${listing.bathrooms} ${locale === "ar" ? "حمام" : "Bath"}` : null,
    listing.finishing,
  ].filter(Boolean) as string[];

  // Breadcrumb: region › neighborhood › area › compound (outer → inner)
  const locationParts = [
    listing.region,
    listing.neighborhood,
    listing.area,
    listing.compound_name,
  ].filter(Boolean) as string[];

  const hasPriceTable =
    (listing.show_downpayment && !!listing.down_payment) ||
    (listing.show_monthly && !!listing.monthly_payment) ||
    (listing.show_full_price && !!listing.price);

  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-card flex flex-col hover:shadow-xl hover:shadow-black/30 hover:border-[#a4c8e0]/30 transition-all duration-300">

      {/* ── Image carousel ── */}
      <div className="relative h-56 bg-muted group overflow-hidden">
        {images.length > 0 ? (
          <Image
            src={images[idx]}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground text-xs">No image</span>
          </div>
        )}

        {/* Featured badge */}
        {listing.is_featured && (
          <div className="absolute top-3 start-3 bg-[#a4c8e0] text-[#0a2233] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide z-10">
            {locale === "ar" ? "مميز" : "Featured"}
          </div>
        )}

        {/* Resale badge */}
        {isResale && (
          <div className="absolute top-3 end-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide z-10">
            {locale === "ar" ? "إعادة بيع" : "Resale"}
          </div>
        )}

        {/* From Developer / Resale badge */}
        {!isResale && (
          <div className={`absolute top-3 end-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide z-10 ${
            listing.listing_type === "resale"
              ? "bg-amber-500 text-white"
              : "bg-blue-600 text-white"
          }`}>
            {listing.listing_type === "resale"
              ? (locale === "ar" ? "إعادة بيع" : "Resale")
              : (locale === "ar" ? "من المطور" : "Developer")}
          </div>
        )}

        {/* Carousel controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 hover:bg-black/70 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => setIdx((i) => (i + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/50 hover:bg-black/70 p-1.5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={14} />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === idx ? "bg-white w-3" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-2.5 end-3 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded-full z-10">
            {idx + 1}/{images.length}
          </div>
        )}
      </div>

      {/* ── Card body ── */}
      <div className="p-4 flex flex-col gap-3 flex-1">

        {/* Title */}
        <div>
          <h3 className="font-bold text-white text-sm leading-snug line-clamp-2">{title}</h3>

          {/* Location */}
          {locationParts.length > 0 && (
            <p className="text-[#a4c8e0] text-xs mt-1 line-clamp-1">
              · {locationParts.join(", ")}
            </p>
          )}

          {/* Delivery */}
          {listing.delivery_year && (
            <p className="text-muted-foreground text-xs mt-0.5">
              {locale === "ar" ? `التسليم: ${listing.delivery_year}` : `Delivery: ${listing.delivery_year}`}
            </p>
          )}
        </div>

        {/* Specs row */}
        {specParts.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            {specParts.map((s, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span className="text-border">·</span>}
                {s}
              </span>
            ))}
          </div>
        )}

        {/* ── Price table ── */}
        {hasPriceTable ? (
          <div className="rounded-xl border border-border overflow-hidden text-xs mt-1">
            {listing.show_downpayment && listing.down_payment ? (
              <div className="flex items-center justify-between px-3 py-2 border-b border-border last:border-0">
                <span className="text-muted-foreground">
                  {locale === "ar" ? "المقدم" : "Down Payment"}
                </span>
                <span className="font-bold text-white">
                  EGP {fmtFull(listing.down_payment)}
                </span>
              </div>
            ) : null}
            {listing.show_monthly && listing.monthly_payment ? (
              <div className="flex items-center justify-between px-3 py-2 border-b border-border last:border-0">
                <span className="text-muted-foreground">
                  {locale === "ar" ? "الشهري" : "Monthly"}
                </span>
                <span className="font-bold text-[#a4c8e0]">
                  EGP {fmtFull(listing.monthly_payment)} /mo
                </span>
              </div>
            ) : null}
            {listing.show_full_price && listing.price ? (
              <div className="flex items-center justify-between px-3 py-2 border-b border-border last:border-0">
                <span className="text-muted-foreground">
                  {locale === "ar" ? "السعر الكامل" : "Full Price"}
                </span>
                <span className="font-bold text-white">
                  EGP {fmtFull(listing.price)}
                </span>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic mt-1">
            {locale === "ar" ? "تواصل للسعر" : "Contact for price"}
          </p>
        )}

        {/* ── Action buttons ── */}
        <div className="flex flex-col gap-2 mt-auto pt-1">
          <a
            href={`https://wa.me/${wa}?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#25D366] hover:bg-[#1fbc59] text-white text-xs font-bold py-2.5 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </a>
          <a
            href={`tel:+${callNum}`}
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/10 text-xs font-bold py-2.5 transition-colors"
          >
            <Phone size={13} />
            {locale === "ar" ? "اتصل" : "Call"}
          </a>
        </div>
      </div>
    </div>
  );
}
