"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import type { Compound, Developer } from "@/types";

const BLANK: Partial<Compound> = { name: "", developer_id: "", governorate: "", district: "", area: "", city_name: "", description: "", is_active: true };
const INPUT = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-[#a4c8e0] transition-colors text-white placeholder:text-muted-foreground";

export default function CompoundsAdmin() {
  const [rows, setRows] = useState<Compound[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<Partial<Compound>>(BLANK);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function load(q = "") {
    setLoading(true);
    const params = q ? `?search=${encodeURIComponent(q)}` : "";
    const [compRes, devRes] = await Promise.all([
      fetch(`/api/admin/compounds${params}`),
      fetch("/api/admin/developers"),
    ]);
    if (compRes.ok) setRows(await compRes.json());
    if (devRes.ok) setDevelopers(await devRes.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => load(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  function openCreate() { setForm(BLANK); setError(""); setModal("create"); }
  function openEdit(c: Compound) { setForm(c); setError(""); setModal("edit"); }

  async function save() {
    setSaving(true);
    setError("");
    const isEdit = modal === "edit";
    const url = isEdit ? `/api/admin/compounds/${form.id}` : "/api/admin/compounds";
    const method = isEdit ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) { setModal(null); load(search); }
    else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Something went wrong.");
    }
  }

  async function toggleActive(c: Compound) {
    await fetch(`/api/admin/compounds/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !c.is_active }),
    });
    load(search);
  }

  async function del(id: string) {
    await fetch(`/api/admin/compounds/${id}`, { method: "DELETE" });
    setDeleteId(null);
    load(search);
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Compounds</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{rows.length} compounds</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-[#a4c8e0] px-4 py-2 text-sm font-semibold text-[#0a2233] hover:bg-[#7aaec9] transition-colors"
        >
          <Plus size={15} /> Add Compound
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search compounds..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={INPUT}
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => <div key={i} className="h-12 rounded-xl border border-border bg-card animate-pulse" />)}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <p className="text-muted-foreground text-sm">{search ? `No compounds matching "${search}"` : "No compounds yet."}</p>
          {!search && <button onClick={openCreate} className="mt-3 text-xs text-[#a4c8e0] hover:underline">+ Add one now</button>}
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-card">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Compound</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Developer</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Location</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${!c.is_active ? "opacity-50" : ""}`}>
                  <td className="px-4 py-3 font-medium text-white">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {c.developers?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {[c.area, c.district, c.governorate].filter(Boolean).join(", ") || c.city_name || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(c)}
                      className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                        c.is_active
                          ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {c.is_active ? <Eye size={11} /> : <EyeOff size={11} />}
                      {c.is_active ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => setDeleteId(c.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-400">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 overflow-y-auto py-8">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-white">{modal === "create" ? "Add Compound" : "Edit Compound"}</h2>
              <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-white text-xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Compound Name *</label>
                <input value={form.name ?? ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Marassi" className={INPUT} />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Developer</label>
                <select
                  value={form.developer_id ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, developer_id: e.target.value || undefined }))}
                  className={INPUT}
                >
                  <option value="">— No developer linked —</option>
                  {developers.filter((d) => d.is_active).map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Governorate</label>
                  <input value={form.governorate ?? ""} onChange={(e) => setForm((f) => ({ ...f, governorate: e.target.value }))} placeholder="e.g. Cairo" className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">District</label>
                  <input value={form.district ?? ""} onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))} placeholder="e.g. New Cairo" className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Area</label>
                  <input value={form.area ?? ""} onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))} placeholder="e.g. Fifth Settlement" className={INPUT} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">City Label</label>
                  <input value={form.city_name ?? ""} onChange={(e) => setForm((f) => ({ ...f, city_name: e.target.value }))} placeholder="e.g. New Cairo" className={INPUT} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Cover Image URL</label>
                <input value={form.cover_image_url ?? ""} onChange={(e) => setForm((f) => ({ ...f, cover_image_url: e.target.value }))} placeholder="https://..." className={INPUT} />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
                <textarea
                  value={form.description ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className={INPUT + " resize-none"}
                  placeholder="About this compound..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm rounded-xl border border-border hover:bg-muted transition-colors">Cancel</button>
              <button onClick={save} disabled={saving || !form.name?.trim()} className="px-5 py-2 text-sm rounded-xl bg-[#a4c8e0] text-[#0a2233] font-bold hover:bg-[#7aaec9] transition-colors disabled:opacity-50">
                {saving ? "Saving…" : modal === "create" ? "Add Compound" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="font-semibold mb-2 text-white">Delete compound?</h2>
            <p className="text-sm text-muted-foreground mb-6">Listings linked to this compound will be unlinked but not deleted.</p>
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
