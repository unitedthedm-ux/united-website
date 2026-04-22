"use client";

import { useEffect, useState } from "react";
import { Building2, Home, PlaySquare, Star, TrendingUp, Eye } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";

interface Stats {
  totalListings: number;
  featuredListings: number;
  totalResale: number;
  featuredResale: number;
  totalMedia: number;
  featuredMedia: number;
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  sub?: string;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <div className={`p-2 rounded-xl ${accent ? "bg-[#a4c8e0]/15" : "bg-muted"}`}>
          <Icon size={18} className={accent ? "text-[#a4c8e0]" : "text-muted-foreground"} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold text-white">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [listings, resale, media] = await Promise.all([
        fetch("/api/admin/listings").then((r) => r.ok ? r.json() : []),
        fetch("/api/admin/resale").then((r) => r.ok ? r.json() : []),
        fetch("/api/admin/media").then((r) => r.ok ? r.json() : []),
      ]);
      setStats({
        totalListings: listings.length,
        featuredListings: listings.filter((l: { is_featured: boolean }) => l.is_featured).length,
        totalResale: resale.length,
        featuredResale: resale.filter((r: { is_featured: boolean }) => r.is_featured).length,
        totalMedia: media.length,
        featuredMedia: media.filter((m: { is_featured: boolean }) => m.is_featured).length,
      });
      setLoading(false);
    }
    load();
  }, []);

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Overview of your content</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-6 h-32 animate-pulse" />
          ))}
        </div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <StatCard
              label="Total Listings"
              value={stats.totalListings}
              sub="New development units"
              icon={Building2}
              accent
            />
            <StatCard
              label="Featured Listings"
              value={stats.featuredListings}
              sub={`${stats.totalListings > 0 ? Math.round((stats.featuredListings / stats.totalListings) * 100) : 0}% of total`}
              icon={Star}
              accent
            />
            <StatCard
              label="Total Resale"
              value={stats.totalResale}
              sub="Resale units"
              icon={Home}
            />
            <StatCard
              label="Featured Resale"
              value={stats.featuredResale}
              sub={`${stats.totalResale > 0 ? Math.round((stats.featuredResale / stats.totalResale) * 100) : 0}% of total`}
              icon={TrendingUp}
            />
            <StatCard
              label="Media Videos"
              value={stats.totalMedia}
              sub="All platforms"
              icon={PlaySquare}
            />
            <StatCard
              label="Featured Videos"
              value={stats.featuredMedia}
              sub="Shown on homepage"
              icon={Eye}
            />
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-semibold text-white mb-4">Quick Summary</h2>
            <div className="space-y-3">
              {[
                { label: "New listings published", value: stats.totalListings, total: stats.totalListings },
                { label: "Resale units active", value: stats.totalResale, total: stats.totalResale },
                { label: "Media videos live", value: stats.totalMedia, total: stats.totalMedia },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="text-sm font-semibold text-white">{item.value}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#a4c8e0]"
                        style={{ width: item.total > 0 ? "100%" : "0%" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </AdminShell>
  );
}
