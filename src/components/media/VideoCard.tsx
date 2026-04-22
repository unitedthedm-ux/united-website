"use client";

import { useLocale } from "@/context/LocaleContext";
import type { MediaVideo } from "@/types";

function getEmbedUrl(video: MediaVideo): string {
  if (video.platform === "youtube" && video.embed_id) {
    return `https://www.youtube.com/embed/${video.embed_id}?rel=0&modestbranding=1`;
  }
  return "";
}

function extractYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  );
  return match?.[1] ?? null;
}

export default function VideoCard({ video }: { video: MediaVideo }) {
  const { locale } = useLocale();
  const title = locale === "ar" ? video.title_ar : video.title_en;

  const embedUrl = getEmbedUrl(video);

  return (
    <div className="rounded-2xl overflow-hidden border border-border bg-card group">
      {/* Video embed or thumbnail */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        {video.platform === "youtube" && embedUrl ? (
          <iframe
            src={embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            loading="lazy"
          />
        ) : video.platform === "instagram" ? (
          <a
            href={video.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743] text-white gap-2 p-4"
          >
            {video.thumbnail_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={video.thumbnail_url}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
            )}
            <span className="relative z-10 text-4xl">▶</span>
            <span className="relative z-10 text-xs font-medium">Instagram</span>
          </a>
        ) : video.platform === "facebook" ? (
          <a
            href={video.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center h-full bg-[#1877f2] text-white gap-2"
          >
            <span className="text-4xl">▶</span>
            <span className="text-xs font-medium">Facebook</span>
          </a>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Video unavailable
          </div>
        )}
      </div>

      {/* Title */}
      <div className="p-3">
        <p className="text-sm font-medium text-foreground line-clamp-2">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 capitalize">{video.platform}</p>
      </div>
    </div>
  );
}
