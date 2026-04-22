"use client";

import Image from "next/image";
import Link from "next/link";
import { BedDouble, Bath, Maximize2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/context/LocaleContext";
import type { Listing } from "@/types";

function formatPrice(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString();
}

export default function PropertyCard({
  listing,
  href,
}: {
  listing: Listing;
  href?: string;
}) {
  const { t, locale } = useLocale();
  const title = locale === "ar" ? listing.title_ar : listing.title_en;
  const image = listing.images?.[0] ?? "/brand/logo-stacked.svg";
  const link = href ?? `/properties/${listing.id}`;

  return (
    <Link href={link} className="group block rounded-2xl overflow-hidden border border-border bg-card hover:shadow-lg hover:shadow-[#a4c8e0]/10 transition-all duration-300">
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden bg-muted">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {listing.is_featured && (
          <Badge className="absolute top-3 start-3 bg-[#a4c8e0] text-[#0a2233] text-xs font-semibold">
            Featured
          </Badge>
        )}
        {/* Price badge */}
        {listing.show_price && listing.price > 0 && (
          <div className="absolute bottom-3 end-3 rounded-full bg-[#0a2233]/80 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-[#a4c8e0]">
            {formatPrice(listing.price)} EGP
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-3">
        <div>
          <p className="font-semibold text-foreground line-clamp-1">{title}</p>
          {listing.compound_name && (
            <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <MapPin size={11} />
              {listing.compound_name}
            </p>
          )}
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {listing.bedrooms != null && (
            <span className="flex items-center gap-1">
              <BedDouble size={13} /> {listing.bedrooms} {t.property.beds}
            </span>
          )}
          {listing.bathrooms != null && (
            <span className="flex items-center gap-1">
              <Bath size={13} /> {listing.bathrooms}
            </span>
          )}
          {listing.area_sqm > 0 && (
            <span className="flex items-center gap-1">
              <Maximize2 size={13} /> {listing.area_sqm} {t.property.sqm}
            </span>
          )}
        </div>

        {/* Pricing */}
        <div className="border-t border-border pt-3 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            {listing.show_downpayment && listing.down_payment ? (
              <>
                <span className="text-xs text-muted-foreground">{t.property.downPayment}</span>
                <span className="text-sm font-semibold text-[#0a2233]">
                  {formatPrice(listing.down_payment)} EGP
                </span>
              </>
            ) : !listing.show_price ? (
              <span className="text-sm font-medium text-muted-foreground">{t.property.askPrice}</span>
            ) : null}
          </div>
          {listing.show_monthly && listing.monthly_payment ? (
            <div className="text-end">
              <span className="text-xs text-muted-foreground">{t.property.monthly}</span>
              <p className="text-sm font-semibold text-[#a4c8e0]">
                {formatPrice(listing.monthly_payment)}
              </p>
            </div>
          ) : null}
        </div>

        {/* WhatsApp CTA */}
        <a
          href={`https://wa.me/${listing.whatsapp_number ?? "201000000000"}?text=${encodeURIComponent(`Interested in: ${title}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="w-full rounded-xl bg-[#a4c8e0]/15 hover:bg-[#a4c8e0]/30 text-[#0a2233] text-xs font-semibold py-2 text-center transition-colors"
        >
          {t.property.whatsapp}
        </a>
      </div>
    </Link>
  );
}
