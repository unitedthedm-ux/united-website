"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, BedDouble, Bath, Maximize2, ChevronLeft, ChevronRight, Phone } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import type { Listing } from "@/types";

function formatPrice(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return n.toLocaleString();
}

export default function PropertyCard({ listing }: { listing: Listing }) {
  const { t, locale } = useLocale();
  const title = locale === "ar" ? listing.title_ar : listing.title_en;
  const images = listing.images?.length ? listing.images : ["/brand/logo-stacked.svg"];
  const [idx, setIdx] = useState(0);

  const wa = listing.whatsapp_number ?? "201000000000";
  const waUrl = `https://wa.me/${wa}?text=${encodeURIComponent(`Interested in: ${title}`)}`;
  const callUrl = `tel:+${wa}`;

  function prev(e: React.MouseEvent) {
    e.preventDefault();
    setIdx((i) => (i - 1 + images.length) % images.length);
  }
  function next(e: React.MouseEvent) {
    e.preventDefault();
    setIdx((i) => (i + 1) % images.length);
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-card hover:shadow-lg hover:shadow-[#a4c8e0]/10 transition-all duration-300 flex flex-col">
      {/* Image with carousel */}
      <div className="relative h-56 w-full overflow-hidden bg-muted group">
        <Image
          src={images[idx]}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        {/* Featured badge */}
        {listing.is_featured && (
          <div className="absolute top-3 start-3 bg-[#a4c8e0] text-[#0a2233] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
            Featured
          </div>
        )}

        {/* Carousel arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={16} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); setIdx(i); }}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === idx ? "bg-white" : "bg-white/40"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Title + location */}
        <div>
          <p className="font-bold text-white leading-snug line-clamp-2">{title}</p>
          {(listing.compound_name || listing.region) && (
            <p className="flex items-center gap-1 text-xs text-[#a4c8e0] mt-1">
              <MapPin size={11} />
              {[listing.compound_name, listing.region].filter(Boolean).join(", ")}
            </p>
          )}
          {listing.delivery_year && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Delivery: {listing.delivery_year}
            </p>
          )}
        </div>

        {/* Specs row */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
          {listing.unit_type && <span>{listing.unit_type}</span>}
          {listing.area_sqm > 0 && (
            <span className="flex items-center gap-0.5">
              <Maximize2 size={11} /> {listing.area_sqm} m²
            </span>
          )}
          {listing.bedrooms != null && (
            <span className="flex items-center gap-0.5">
              <BedDouble size={11} /> {listing.bedrooms} {t.property.beds}
            </span>
          )}
          {listing.bathrooms != null && (
            <span className="flex items-center gap-0.5">
              <Bath size={11} /> {listing.bathrooms}
            </span>
          )}
          {listing.finishing && <span>{listing.finishing}</span>}
        </div>

        {/* Price table */}
        {(listing.show_downpayment || listing.show_monthly || listing.show_full_price) && (
          <div className="rounded-xl border border-border bg-background/40 divide-y divide-border text-sm">
            {listing.show_downpayment && listing.down_payment ? (
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-muted-foreground text-xs">{t.property.downPayment}</span>
                <span className="font-semibold text-white text-xs">EGP {formatPrice(listing.down_payment)}</span>
              </div>
            ) : null}
            {listing.show_monthly && listing.monthly_payment ? (
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-muted-foreground text-xs">{t.property.monthly}</span>
                <span className="font-semibold text-[#a4c8e0] text-xs">EGP {formatPrice(listing.monthly_payment)} /mo</span>
              </div>
            ) : null}
            {listing.show_full_price && listing.price ? (
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-muted-foreground text-xs">Full Price</span>
                <span className="font-semibold text-white text-xs">EGP {formatPrice(listing.price)}</span>
              </div>
            ) : null}
          </div>
        )}

        {!listing.show_downpayment && !listing.show_monthly && !listing.show_full_price && (
          <p className="text-xs text-muted-foreground">{t.property.askPrice}</p>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-2 mt-auto pt-1">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#25D366] hover:bg-[#1fb855] text-white text-xs font-semibold py-2.5 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </a>
          <a
            href={callUrl}
            className="flex items-center justify-center gap-2 w-full rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] text-xs font-semibold py-2.5 transition-colors"
          >
            <Phone size={13} />
            Call
          </a>
        </div>
      </div>
    </div>
  );
}
