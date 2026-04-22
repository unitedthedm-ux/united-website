"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import ImageUploader from "@/components/admin/ImageUploader";
import type { ResaleUnit } from "@/types";

const BLANK: Partial<ResaleUnit> = {
  title_en: "", title_ar: "", description_en: "", description_ar: "",
  price: 0, area_sqm: 0, bedrooms: undefined, bathrooms: undefined,
  unit_type: "", finishing: "", compound_name: "", region: "", area: "",
  images: [], owner_name: "", show_price: true, is_featured: false,
  whatsapp_number: "",
};

export default function ResaleAdmin() {
  const [rows, setRows] = useState<ResaleUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<Partial<ResaleUnit>>(BLANK);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/resale");
    if (res.ok) setRows(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() { setForm(BLANK); setModal("create"); }
  function openEdit(r: ResaleUnit) { setForm(r); setModal("edit"); }

  async function save() {
    setSaving(true);
    const isEdit = modal === "edit";
    const url = isEdit ? `/api/admin/resale/${form.id}` : "/api/admin/resale";
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) { setModal(null); load(); }
  }

  async function del(id: string) {
    await fetch(`/api/admin/resale/${id}`, { method: "DELETE" });
    setDeleteId(null);
    load();
  }

  function field(key: keyof ResaleUnit, label: string, type = "text") {
    return (
      <div key={key}>
        <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
        <input
          type={type}
          value={(form[key] as string | number) ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, [key]: type === "number" ? Number(e.target.value) : e.target.value }))}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#a4c8e0] transition-colors"
        />
      </div>
    );
  }

  function toggle(key: keyof ResaleUnit, label: string) {
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
          <h1 className="text-xl font-bold">Resale Units</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{rows.length} units</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-[#a4c8e0] px-4 py-2 text-sm font-semibold text-[#0a2233] hover:bg-[#7aaec9] transition-colors"
        >
          <Plus size={15} /> Add Unit
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No resale units yet.</p>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-card">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Region</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Price</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Featured</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{r.title_en}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.region ?? "—"}</td>
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

      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 overflow-y-auto py-8 px-4">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold">{modal === "create" ? "Add Resale Unit" : "Edit Resale Unit"}</h2>
              <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-foreground text-xl leading-none">&times;</button>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field("title_en", "Title (EN)")}
              {field("title_ar", "Title (AR)")}
              {field("description_en", "Description (EN)")}
              {field("description_ar", "Description (AR)")}
              {field("price", "Price (EGP)", "number")}
              {field("area_sqm", "Area (sqm)", "number")}
              {field("bedrooms", "Bedrooms", "number")}
              {field("bathrooms", "Bathrooms", "number")}
              {field("unit_type", "Unit Type")}
              {field("finishing", "Finishing")}
              {field("compound_name", "Compound")}
              {field("region", "Region")}
              {field("area", "Area")}
              {field("owner_name", "Owner Name")}
              {field("whatsapp_number", "WhatsApp")}

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-2">Images</label>
                <ImageUploader
                  images={form.images ?? []}
                  onChange={(imgs) => setForm((f) => ({ ...f, images: imgs }))}
                />
              </div>

              <div className="sm:col-span-2 flex flex-wrap gap-4 pt-2">
                {toggle("show_price", "Show Price")}
                {toggle("is_featured", "Featured")}
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors">
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="px-4 py-2 text-sm rounded-lg bg-[#a4c8e0] text-[#0a2233] font-semibold hover:bg-[#7aaec9] transition-colors disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="font-semibold mb-2">Delete unit?</h2>
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
