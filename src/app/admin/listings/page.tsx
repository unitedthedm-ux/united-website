"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Star, MapPin } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import type { Listing } from "@/types";

export default function ListingsAdmin() {
  const router = useRouter();
  const [rows, setRows] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/listings");
    if (res.ok) setRows(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function del(id: string) {
    await fetch(`/api/admin/listings/${id}`, { method: "DELETE" });
    setDeleteId(null);
    load();
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold">Listings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{rows.length} units</p>
        </div>
        <button
          onClick={() => router.push("/admin/listings/new")}
          className="flex items-center gap-2 rounded-lg bg-[#a4c8e0] px-4 py-2 text-sm font-semibold text-[#0a2233] hover:bg-[#7aaec9] transition-colors"
        >
          <Plus size={15} /> Add Listing
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No listings yet.</p>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-card">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Type</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Location</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Price</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Featured</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{r.title_en}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      r.listing_type === "resale"
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-blue-600/15 text-blue-400"
                    }`}>
                      {r.listing_type === "resale" ? "Resale" : "From Developer"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    <div className="flex items-center gap-1">
                      {(r.region || r.area) && <MapPin size={11} className="text-[#a4c8e0] shrink-0" />}
                      <span>
                        {[r.compound_name, r.area, r.neighborhood, r.region].filter(Boolean).join(" · ") || "—"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.price ? r.price.toLocaleString() + " EGP" : "—"}</td>
                  <td className="px-4 py-3">{r.is_featured && <Star size={14} className="text-[#a4c8e0]" />}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => router.push(`/admin/listings/${r.id}`)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(r.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Delete confirm ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="font-semibold mb-2">Delete listing?</h2>
            <p className="text-sm text-muted-foreground mb-6">This cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => del(deleteId)}
                className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
