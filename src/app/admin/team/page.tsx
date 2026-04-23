"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Phone, Star } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import type { TeamMember } from "@/types";

const BLANK: Partial<TeamMember> = {
  name: "",
  whatsapp_number: "",
  phone_number: "",
  role: "agent",
  is_default: false,
};

const INPUT = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-[#a4c8e0] transition-colors text-white placeholder:text-muted-foreground";

export default function TeamAdmin() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<Partial<TeamMember>>(BLANK);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/team");
    if (res.ok) setMembers(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() { setForm(BLANK); setError(""); setModal("create"); }
  function openEdit(m: TeamMember) { setForm(m); setError(""); setModal("edit"); }

  async function save() {
    setSaving(true);
    setError("");
    const isEdit = modal === "edit";
    const url = isEdit ? `/api/admin/team/${form.id}` : "/api/admin/team";
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

  async function del(id: string) {
    await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
    setDeleteId(null);
    load();
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-white">Team</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{members.length} members · agents assigned to listings</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-[#a4c8e0] px-4 py-2 text-sm font-semibold text-[#0a2233] hover:bg-[#7aaec9] transition-colors"
        >
          <Plus size={15} /> Add Member
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : members.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <p className="text-muted-foreground text-sm mb-3">No team members yet.</p>
          <p className="text-xs text-muted-foreground">Add yourself as the main admin first — new listings will default to them.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-card">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Role</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">WhatsApp</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Phone</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">Default</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-white">{m.name}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      m.role === "admin"
                        ? "bg-[#a4c8e0]/15 text-[#a4c8e0]"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {m.role === "admin" ? "Admin" : "Agent"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs font-mono">{m.whatsapp_number}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs font-mono">{m.phone_number || "—"}</td>
                  <td className="px-4 py-3">
                    {m.is_default && <Star size={14} className="text-[#a4c8e0]" />}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(m)} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteId(m.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-400">
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

      {/* ── Create / Edit Modal ── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-white">{modal === "create" ? "Add Team Member" : "Edit Member"}</h2>
              <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-foreground text-xl leading-none">×</button>
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
              )}

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Name *</label>
                <input
                  type="text"
                  value={form.name ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Ahmed Hassan"
                  className={INPUT}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Role</label>
                <select
                  value={form.role ?? "agent"}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as "agent" | "admin" }))}
                  className={INPUT}
                >
                  <option value="agent">👤 Agent</option>
                  <option value="admin">🛡️ Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">WhatsApp Number *</label>
                <input
                  type="text"
                  value={form.whatsapp_number ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, whatsapp_number: e.target.value }))}
                  placeholder="201xxxxxxxxx"
                  className={INPUT}
                />
                <p className="text-[11px] text-muted-foreground mt-1">International format without +</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Phone Number</label>
                <input
                  type="text"
                  value={form.phone_number ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, phone_number: e.target.value }))}
                  placeholder="201xxxxxxxxx"
                  className={INPUT}
                />
                <p className="text-[11px] text-muted-foreground mt-1">Used for the Call button (leave blank to use WhatsApp number)</p>
              </div>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!!form.is_default}
                  onChange={(e) => setForm((f) => ({ ...f, is_default: e.target.checked }))}
                  className="accent-[#a4c8e0] w-4 h-4"
                />
                <span className="text-sm text-white">⭐ Set as default agent for new listings</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-border">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-sm rounded-xl border border-border hover:bg-muted transition-colors">
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="px-5 py-2 text-sm rounded-xl bg-[#a4c8e0] text-[#0a2233] font-bold hover:bg-[#7aaec9] transition-colors disabled:opacity-50"
              >
                {saving ? "Saving…" : modal === "create" ? "Add Member" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirm ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h2 className="font-semibold mb-2 text-white">Remove team member?</h2>
            <p className="text-sm text-muted-foreground mb-6">Listings assigned to this agent will have no agent until reassigned.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted transition-colors">Cancel</button>
              <button onClick={() => del(deleteId)} className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors">Remove</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
