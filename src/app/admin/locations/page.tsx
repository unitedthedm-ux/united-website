"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Eye, EyeOff, ChevronRight, ChevronLeft } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";

interface Loc {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  level: number;
  parent_id: string | null;
  is_active: boolean;
}

const LEVEL_LABELS: Record<number, string> = {
  2: "Governorate",
  3: "District",
  4: "Area",
  5: "Compound",
};

const INPUT = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-[#a4c8e0] transition-colors text-white placeholder:text-muted-foreground";

export default function LocationsAdmin() {
  // Breadcrumb trail: [{id, name_en, level}]
  const [trail, setTrail] = useState<{ id: string; name_en: string; level: number }[]>([]);
  const [items, setItems] = useState<Loc[]>([]);
  const [loading, setLoading] = useState(true);

  // Add modal
  const [showAdd, setShowAdd] = useState(false);
  const [addEn, setAddEn] = useState("");
  const [addAr, setAddAr] = useState("");
  const [adding, setAdding] = useState(false);

  // Edit modal
  const [editItem, setEditItem] = useState<Loc | null>(null);
  const [editEn, setEditEn] = useState("");
  const [editAr, setEditAr] = useState("");
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const currentLevel = trail.length + 2; // starts at 2 (governorate)
  const parentId = trail.length > 0 ? trail[trail.length - 1].id : undefined;

  async function load() {
    setLoading(true);
    const params = new URLSearchParams({ level: String(currentLevel) });
    if (parentId) params.set("parent_id", parentId);
    const res = await fetch(`/api/admin/locations?${params}`);
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, [trail]);

  function drillDown(item: Loc) {
    if (item.level >= 5) return; // compounds have no children
    setTrail((t) => [...t, { id: item.id, name_en: item.name_en, level: item.level }]);
  }

  function goTo(index: number) {
    setTrail((t) => t.slice(0, index));
  }

  async function toggleActive(item: Loc) {
    await fetch(`/api/admin/locations/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !item.is_active }),
    });
    load();
  }

  async function addLocation() {
    if (!addEn.trim()) return;
    setAdding(true);
    await fetch("/api/admin/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name_en: addEn.trim(),
        name_ar: addAr.trim() || addEn.trim(),
        level: currentLevel,
        parent_id: parentId ?? null,
      }),
    });
    setAdding(false);
    setShowAdd(false);
    setAddEn("");
    setAddAr("");
    load();
  }

  async function saveEdit() {
    if (!editItem || !editEn.trim()) return;
    setSaving(true);
    await fetch(`/api/admin/locations/${editItem.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name_en: editEn.trim(), name_ar: editAr.trim() || editEn.trim() }),
    });
    setSaving(false);
    setEditItem(null);
    load();
  }

  async function del(id: string) {
    await fetch(`/api/admin/locations/${id}`, { method: "DELETE" });
    setDeleteId(null);
    load();
  }

  const canDrillDown = currentLevel < 5;

  return (
    <AdminShell>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Locations</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage the location hierarchy used in listings
          </p>
        </div>
        <button
          onClick={() => { setShowAdd(true); setAddEn(""); setAddAr(""); }}
          className="flex items-center gap-2 rounded-lg bg-[#a4c8e0] px-4 py-2 text-sm font-semibold text-[#0a2233] hover:bg-[#7aaec9] transition-colors"
        >
          <Plus size={15} /> Add {LEVEL_LABELS[currentLevel]}
        </button>
      </div>

      {/* Breadcrumb trail */}
      <div className="flex items-center gap-1 mb-5 flex-wrap">
        <button
          onClick={() => goTo(0)}
          className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${trail.length === 0 ? "bg-[#a4c8e0]/10 text-[#a4c8e0] font-semibold" : "text-muted-foreground hover:text-white"}`}
        >
          Governorates
        </button>
        {trail.map((t, i) => (
          <span key={t.id} className="flex items-center gap-1">
            <ChevronRight size={14} className="text-muted-foreground" />
            <button
              onClick={() => goTo(i + 1)}
              className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${i === trail.length - 1 ? "bg-[#a4c8e0]/10 text-[#a4c8e0] font-semibold" : "text-muted-foreground hover:text-white"}`}
            >
              {t.name_en}
            </button>
          </span>
        ))}
      </div>

      {/* Current level label */}
      <div className="flex items-center gap-2 mb-3">
        {trail.length > 0 && (
          <button
            onClick={() => goTo(trail.length - 1)}
            className="p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-white"
          >
            <ChevronLeft size={16} />
          </button>
        )}
        <p className="text-xs font-semibold uppercase tracking-widest text-[#a4c8e0]">
          {LEVEL_LABELS[currentLevel]}s
          {trail.length > 0 && <span className="text-muted-foreground normal-case tracking-normal font-normal"> in {trail[trail.length - 1].name_en}</span>}
        </p>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 rounded-xl border border-border bg-card animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <p className="text-muted-foreground text-sm">No {LEVEL_LABELS[currentLevel].toLowerCase()}s yet.</p>
          <button
            onClick={() => setShowAdd(true)}
            className="mt-3 text-xs text-[#a4c8e0] hover:underline"
          >
            + Add one now
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-card">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Name (EN)</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Name (AR)</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Show in Listings</th>
                {canDrillDown && <th className="px-4 py-3 text-xs font-medium text-muted-foreground text-right">Children</th>}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b border-border last:border-0 transition-colors ${canDrillDown ? "cursor-pointer hover:bg-muted/30" : "hover:bg-muted/20"} ${!item.is_active ? "opacity-50" : ""}`}
                  onClick={() => canDrillDown && drillDown(item)}
                >
                  <td className="px-4 py-3 font-medium text-white">{item.name_en}</td>
                  <td className="px-4 py-3 text-muted-foreground" dir="rtl">{item.name_ar}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleActive(item); }}
                      className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                        item.is_active
                          ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {item.is_active ? <Eye size={11} /> : <EyeOff size={11} />}
                      {item.is_active ? "Visible" : "Hidden"}
                    </button>
                  </td>
                  {canDrillDown && (
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs text-[#a4c8e0] flex items-center gap-1 justify-end">
                        {LEVEL_LABELS[item.level + 1]}s <ChevronRight size={12} />
                      </span>
                    </td>
                  )}
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => { setEditItem(item); setEditEn(item.name_en); setEditAr(item.name_ar); }}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => setDeleteId(item.id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-400"
                      >
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

      {/* ── Add Modal ── */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card shadow-2xl p-6 space-y-4">
            <h2 className="font-semibold text-white">Add {LEVEL_LABELS[currentLevel]}</h2>
            {trail.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Under: <span className="text-white">{trail[trail.length - 1].name_en}</span>
              </p>
            )}
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Name (English) *</label>
              <input value={addEn} onChange={(e) => setAddEn(e.target.value)} placeholder="e.g. New Capital" className={INPUT} />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Name (Arabic)</label>
              <input value={addAr} onChange={(e) => setAddAr(e.target.value)} placeholder="مثال: العاصمة الإدارية" className={INPUT} dir="rtl" />
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setShowAdd(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm hover:bg-muted transition-colors">Cancel</button>
              <button
                onClick={addLocation}
                disabled={!addEn.trim() || adding}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#a4c8e0] text-[#0a2233] text-sm font-bold hover:bg-[#7aaec9] transition-colors disabled:opacity-50"
              >
                {adding ? "Adding…" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Modal ── */}
      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card shadow-2xl p-6 space-y-4">
            <h2 className="font-semibold text-white">Edit {LEVEL_LABELS[editItem.level]}</h2>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Name (English) *</label>
              <input value={editEn} onChange={(e) => setEditEn(e.target.value)} className={INPUT} />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Name (Arabic)</label>
              <input value={editAr} onChange={(e) => setEditAr(e.target.value)} className={INPUT} dir="rtl" />
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => setEditItem(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm hover:bg-muted transition-colors">Cancel</button>
              <button
                onClick={saveEdit}
                disabled={!editEn.trim() || saving}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#a4c8e0] text-[#0a2233] text-sm font-bold hover:bg-[#7aaec9] transition-colors disabled:opacity-50"
              >
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="font-semibold mb-2 text-white">Delete location?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              This will also delete all child locations (districts, areas, compounds) under it.
            </p>
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
