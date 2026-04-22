"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import VideoCard from "@/components/media/VideoCard";
import type { MediaVideo } from "@/types";

const PLATFORMS = ["all", "youtube", "instagram", "facebook"];

export default function MediaClient({ videos }: { videos: MediaVideo[] }) {
  const { t, locale } = useLocale();
  const [platform, setPlatform] = useState("all");

  const filtered =
    platform === "all" ? videos : videos.filter((v) => v.platform === platform);

  return (
    <div className="container mx-auto px-4 md:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#a4c8e0]/15 px-3 py-1 text-xs font-semibold text-[#0a2233] mb-4">
          <Play size={12} />
          {locale === "ar" ? "الميديا" : "Media"}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">{t.mediaPage.title}</h1>
        <p className="text-muted-foreground mt-2 text-sm">{t.mediaPage.sub}</p>
      </div>

      {/* Platform filter */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {PLATFORMS.map((p) => (
          <button
            key={p}
            onClick={() => setPlatform(p)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium border transition-colors capitalize ${
              platform === p
                ? "bg-[#a4c8e0] border-[#a4c8e0] text-[#0a2233]"
                : "border-border text-muted-foreground hover:border-[#a4c8e0]/50"
            }`}
          >
            {p === "all" ? (locale === "ar" ? "الكل" : "All") : p}
          </button>
        ))}
      </div>

      {/* Video grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-muted-foreground text-sm">
          {locale === "ar" ? "لا توجد مقاطع فيديو" : "No videos yet."}
        </div>
      )}

      {/* Social links */}
      <div className="mt-16 rounded-3xl bg-gradient-to-br from-[#0a2233] to-[#1a3d55] p-10 text-center text-white">
        <h2 className="text-xl font-bold mb-2">
          {locale === "ar" ? "تابعنا على السوشيال ميديا" : "Follow us on Social Media"}
        </h2>
        <p className="text-white/50 text-sm mb-6">
          {locale === "ar"
            ? "لا تفوت أي تحديثات أو عروض"
            : "Never miss a new listing or update"}
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://instagram.com/unitedrealestate"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://facebook.com/unitedrealestate"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Facebook
          </a>
          <a
            href="https://youtube.com/@unitedrealestate"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#a4c8e0] px-5 py-2 text-sm font-semibold text-[#0a2233] hover:bg-[#cce3f0] transition-colors"
          >
            YouTube
          </a>
        </div>
      </div>
    </div>
  );
}
