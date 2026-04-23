"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Globe, Eye, EyeOff } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import type { Developer } from "@/types";

const BLANK: Partial<Developer> = { name: "", logo_url: "", website: "", description: "", is_active: true };
const INPUT = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-[#a4c8e0] transition-colors text-white placeholder:text-muted-foreground";

export default function DevelopersAdmin() {
  const [rows, setRows] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<Partial<Developer>>(BLANK);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/developers");
    if (res.ok) setRows(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() { setForm(BLANK); setError(""); setModal("create"); }
  function openEdit(d: Developer) { setForm(d); setError(""); setModal("edit"); }

  async function save() {
    setSaving(true);
    setError("");
    const isEdit = modal === "edit";
    const url = isEdit ? `/api/admin/developers/${form.id}` : "/api/admin/developers";
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) { setModal(null); load(); }
    else {
      const d = await res.json().catch(() => ({}));
      setError(d.error ?? "Something went wrong.");
    }
  }

  async function toggleActive(dev: Developer) {
    await fetch(`/api/admin/developers/${dev.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !dev.is_active }),
    });
    load();
  }

  async function del(id: string) {
    await fetch(`/api/admin/developers/${id}`, { method: "DELETE" });
    setDeleteId(null);
    load();
  }

  const filtered = rows.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Developers</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{rows.length} developers in database</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-[#a4c8e0] px-4 py-2 text-sm font-semibold text-[#0a2233] hover:bg-[#7aaec9] transition-colors"
        >
          <Plus size={15} /> Add Developer
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search developers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={INPUT}
        />
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="h-12 rounded-xl border border-border bg-card animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <p className="text-muted-foreground text-sm">{search ? `No developers matching "${search}"` : "No developers yet."}</p>
          {!search && <button onClick={openCreate} className="mt-3 text-xs text-[#a4c8e0] hover:underline">+ Add one now</button>}
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-card">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Developer</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Website</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((dev) => (
                <tr key={dev.id} className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors ${!dev.is_active ? "opacity-50" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {dev.logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={dev.logo_url} alt={dev.name} className="w-8 h-8 rounded-lg object-contain bg-white/5" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-[#a4c8e0]/10 flex items-center justify-center text-[#a4c8e0] text-xs font-bold">
                          {dev.name.charAt(0)}
                        </div>
                      )}
                      <span className="font-medium text-white">{dev.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {dev.website ? (
                      <a href={dev.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#a4c8e0]" onClick={(e) => e.stopPropagation()}>
                        <Globe size={11} /> {dev.website.replace(/^https?:\/\//, "").split("/")[0]}
                      </a>
                    ) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(dev)}
                      className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                        dev.is_active
                          ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {dev.is_active ? <Eye size={11} /> : <EyeOff size={11} />}
                      {dev.is_active ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openEdit(dev)} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => setDeleteId(dev.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-400">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-white">{modal === "create" ? "Add Developer" : "Edit Developer"}</h2>
              <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-white text-xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-4">
              {error && <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Name *</label>
                <input value={form.name ?? ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Emaar Properties" className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Logo URL</label>
                <input value={form.logo_url ?? ""} onChange={(e) => setForm((f) => ({ ...f, logo_url: e.target.value }))} placeholder="https://..." className={INPUT} />
                {form.logo_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.logo_url} alt="preview" className="mt-2 h-10 w-auto rounded object-contain" />
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Website</label>
                <input value={form.website ?? ""} onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))} placeholder="https://developer.com" className={INPUT} />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Description</label>
                <textarea
                  value={form.description ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="About this developer..."
                  rows={3}
                  className={INPUT + " resize-none"}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm rounded-xl border border-border hover:bg-muted transition-colors">Cancel</button>
              <button onClick={save} disabled={saving || !form.name?.trim()} className="px-5 py-2 text-sm rounded-xl bg-[#a4c8e0] text-[#0a2233] font-bold hover:bg-[#7aaec9] transition-colors disabled:opacity-50">
                {saving ? "Saving…" : modal === "create" ? "Add Developer" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="font-semibold mb-2 text-white">Remove developer?</h2>
            <p className="text-sm text-muted-foreground mb-6">Listings linked to this developer will be unlinked. Compounds won&apos;t be deleted.</p>
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
