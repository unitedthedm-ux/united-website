"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { useState } from "react";

export default function HeroSection() {
  const { t } = useLocale();
  const [query, setQuery] = useState("");

  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a2233] via-[#1a3d55] to-[#0a2233]" />

      {/* Subtle brand-colored orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#a4c8e0]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-[#a4c8e0]/8 blur-3xl pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#a4c8e0 1px, transparent 1px), linear-gradient(90deg, #a4c8e0 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 container mx-auto px-4 md:px-8 text-center text-white">
        {/* Tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#a4c8e0]/30 bg-[#a4c8e0]/10 px-4 py-1.5 text-xs font-medium text-[#a4c8e0] mb-6 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#a4c8e0] animate-pulse" />
          {t.tagline}
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 max-w-4xl mx-auto">
          {t.hero.headline}
        </h1>

        <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto mb-10">
          {t.hero.sub}
        </p>

        {/* Search bar */}
        <div className="relative max-w-xl mx-auto mb-10">
          <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 gap-3 focus-within:border-[#a4c8e0]/60 transition-colors">
            <Search size={18} className="text-white/40 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.hero.search}
              className="flex-1 bg-transparent text-white placeholder:text-white/40 text-sm outline-none"
            />
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/properties"
            className="rounded-full bg-[#a4c8e0] px-7 py-3 text-sm font-semibold text-[#0a2233] hover:bg-[#cce3f0] transition-colors"
          >
            {t.hero.cta}
          </Link>
          <Link
            href="/resale"
            className="rounded-full border border-white/30 bg-white/10 px-7 py-3 text-sm font-medium text-white hover:bg-white/20 backdrop-blur-sm transition-colors"
          >
            {t.hero.ctaResale}
          </Link>
        </div>

        {/* Stats strip */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center">
          {[
            { num: "500+", label: "Properties" },
            { num: "12+", label: "Locations" },
            { num: "1,200+", label: "Happy Clients" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-2xl md:text-3xl font-bold text-[#a4c8e0]">{s.num}</p>
              <p className="text-xs text-white/50 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
