"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Star, MapPin } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import ImageUploader from "@/components/admin/ImageUploader";
import LocationPicker from "@/components/admin/LocationPicker";
import type { Listing } from "@/types";

const BLANK: Partial<Listing> = {
  title_en: "", title_ar: "", description_en: "", description_ar: "",
  price: 0, down_payment: 0, monthly_payment: 0, area_sqm: 0,
  bedrooms: undefined, bathrooms: undefined, unit_type: "", finishing: "",
  delivery_year: undefined,
  compound_name: "", region: "", area: "", neighborhood: "",
  images: [],
  show_price: true, show_downpayment: true, show_monthly: true,
  show_full_price: false, is_featured: false,
  whatsapp_number: "",
  listing_type: "off-plan",
};

export default function ListingsAdmin() {
  const [rows, setRows] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<Partial<Listing>>(BLANK);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/listings");
    if (res.ok) setRows(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() { setForm(BLANK); setModal("create"); }
  function openEdit(l: Listing) { setForm(l); setModal("edit"); }

  async function save() {
    setSaving(true);
    const isEdit = modal === "edit";
    const url = isEdit ? `/api/admin/listings/${form.id}` : "/api/admin/listings";
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) { setModal(null); load(); }
  }

  async function del(id: string) {
    await fetch(`/api/admin/listings/${id}`, { method: "DELETE" });
    setDeleteId(null);
    load();
  }

  function field(key: keyof Listing, label: string, type = "text") {
    return (
      <div key={key}>
        <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
        <input
          type={type}
          value={(form[key] as string | number) ?? ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, [key]: type === "number" ? Number(e.target.value) : e.target.value }))
          }
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#a4c8e0] transition-colors"
        />
      </div>
    );
  }

  function toggle(key: keyof Listing, label: string) {
    return (
      <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={!!form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))}
          className="accent-[#a4c8e0]"
        />
        {label}
      </label>
    );
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold">Listings</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{rows.length} units</p>
        </div>
        <button
          onClick={openCreate}
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
                      <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteId(r.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-400">
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

      {/* ── Create/Edit Modal ── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 overflow-y-auto py-8 px-4">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold">{modal === "create" ? "Add Listing" : "Edit Listing"}</h2>
              <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-foreground text-xl leading-none">×</button>
            </div>

            <div className="p-6 space-y-6">

              {/* ── Titles & Descriptions ── */}
              <section>
                <p className="text-xs font-semibold text-[#a4c8e0] uppercase tracking-widest mb-3">Listing Info</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {field("title_en", "Title (English)")}
                  {field("title_ar", "Title (Arabic)")}
                  {field("description_en", "Description (EN)")}
                  {field("description_ar", "Description (AR)")}
                  {field("whatsapp_number", "WhatsApp Number")}
                  {field("delivery_year", "Delivery Year", "number")}
                </div>
              </section>

              {/* ── Listing Type ── */}
              <section>
                <p className="text-xs font-semibold text-[#a4c8e0] uppercase tracking-widest mb-3">Listing Type</p>
                <div className="flex gap-3">
                  {(["off-plan", "ready"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, listing_type: t }))}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                        form.listing_type === t
                          ? t === "off-plan"
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-emerald-500 border-emerald-500 text-white"
                          : "border-border text-muted-foreground hover:border-[#a4c8e0]/50 hover:text-white"
                      }`}
                    >
                      {t === "off-plan" ? "🏗️ Off Plan" : "✅ Ready"}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">
                  {form.listing_type === "off-plan"
                    ? "Unit is under construction / future delivery"
                    : "Unit is ready to move in"}
                </p>
              </section>

              {/* ── Unit Details ── */}
              <section>
                <p className="text-xs font-semibold text-[#a4c8e0] uppercase tracking-widest mb-3">Unit Details</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {field("area_sqm", "Area (m²)", "number")}
                  {field("bedrooms", "Bedrooms", "number")}
                  {field("bathrooms", "Bathrooms", "number")}
                  {field("unit_type", "Unit Type")}
                  {field("finishing", "Finishing")}
                </div>
              </section>

              {/* ── Pricing ── */}
              <section>
                <p className="text-xs font-semibold text-[#a4c8e0] uppercase tracking-widest mb-3">Pricing</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  {field("price", "Full Price (EGP)", "number")}
                  {field("down_payment", "Down Payment", "number")}
                  {field("monthly_payment", "Monthly Payment", "number")}
                </div>
                <div className="flex flex-wrap gap-4">
                  {toggle("show_price", "Show Price")}
                  {toggle("show_downpayment", "Show Down Payment")}
                  {toggle("show_monthly", "Show Monthly")}
                  {toggle("show_full_price", "Show Full Price")}
                  {toggle("is_featured", "⭐ Featured")}
                </div>
              </section>

              {/* ── Location Hierarchy ── */}
              <section>
                <p className="text-xs font-semibold text-[#a4c8e0] uppercase tracking-widest mb-3">Location</p>
                <LocationPicker
                  values={{
                    region: form.region,
                    neighborhood: form.neighborhood,
                    area: form.area,
                    compound_name: form.compound_name,
                  }}
                  onChange={(v) =>
                    setForm((f) => ({
                      ...f,
                      region: v.region ?? f.region,
                      neighborhood: v.neighborhood ?? f.neighborhood,
                      area: v.area ?? f.area,
                      compound_name: v.compound_name ?? f.compound_name,
                    }))
                  }
                />
              </section>

              {/* ── Images ── */}
              <section>
                <p className="text-xs font-semibold text-[#a4c8e0] uppercase tracking-widest mb-3">Images</p>
                <ImageUploader
                  images={form.images ?? []}
                  onChange={(imgs) => setForm((f) => ({ ...f, images: imgs }))}
                />
              </section>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="px-4 py-2 text-sm rounded-lg bg-[#a4c8e0] text-[#0a2233] font-semibold hover:bg-[#7aaec9] transition-colors disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save Listing"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="font-semibold mb-2">Delete listing?</h2>
            <p className="text-sm text-muted-foreground mb-6">This cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors">Cancel</button>
              <button onClick={() => del(deleteId)} className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
