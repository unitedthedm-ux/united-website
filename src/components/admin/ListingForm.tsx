"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, User } from "lucide-react";
import ImageUploader from "@/components/admin/ImageUploader";
import LocationPicker from "@/components/admin/LocationPicker";
import type { Listing, TeamMember } from "@/types";

export const LISTING_BLANK: Partial<Listing> = {
  title_en: "", title_ar: "", description_en: "", description_ar: "",
  price: 0, down_payment: 0, monthly_payment: 0, area_sqm: 0,
  bedrooms: undefined, bathrooms: undefined, unit_type: "", finishing: "",
  delivery_year: undefined,
  compound_name: "", region: "", area: "", neighborhood: "",
  images: [],
  show_price: true, show_downpayment: true, show_monthly: true,
  show_full_price: false, is_featured: false,
  agent_id: undefined,
  listing_type: "from-developer",
};

interface Props {
  initial?: Partial<Listing>;
  mode: "create" | "edit";
}

const INPUT =
  "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-[#a4c8e0] transition-colors text-white placeholder:text-muted-foreground";

export default function ListingForm({ initial, mode }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Listing>>(initial ?? LISTING_BLANK);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [agents, setAgents] = useState<TeamMember[]>([]);

  // Load team members for agent selector
  useEffect(() => {
    fetch("/api/admin/team")
      .then((r) => r.ok ? r.json() : [])
      .then((data: TeamMember[]) => {
        setAgents(data);
        // On create mode, auto-select default agent if no agent set yet
        if (mode === "create" && !form.agent_id) {
          const def = data.find((m) => m.is_default);
          if (def) setForm((f) => ({ ...f, agent_id: def.id }));
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function set<K extends keyof Listing>(key: K, value: Listing[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function field(key: keyof Listing, label: string, type = "text", placeholder = "") {
    return (
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1">{label}</label>
        <input
          type={type}
          value={(form[key] as string | number) ?? ""}
          placeholder={placeholder}
          onChange={(e) =>
            set(key as keyof Listing, (type === "number" ? Number(e.target.value) : e.target.value) as never)
          }
          className={INPUT}
        />
      </div>
    );
  }

  function toggle(key: keyof Listing, label: string) {
    return (
      <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
        <input
          type="checkbox"
          checked={!!form[key]}
          onChange={(e) => set(key as keyof Listing, e.target.checked as never)}
          className="accent-[#a4c8e0] w-4 h-4 rounded"
        />
        <span>{label}</span>
      </label>
    );
  }

  async function save() {
    setSaving(true);
    setError("");
    const isEdit = mode === "edit";
    const url = isEdit ? `/api/admin/listings/${form.id}` : "/api/admin/listings";
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.push("/admin/listings");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong. Please try again.");
    }
    setSaving(false);
  }

  const selectedAgent = agents.find((a) => a.id === form.agent_id);

  return (
    <div className="max-w-3xl mx-auto pb-16">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/admin/listings")}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-white"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">
              {mode === "create" ? "Add New Listing" : "Edit Listing"}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {mode === "create"
                ? "Fill in the details below to create a new listing"
                : `Editing: ${form.title_en || "Untitled"}`}
            </p>
          </div>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-[#a4c8e0] px-5 py-2.5 text-sm font-bold text-[#0a2233] hover:bg-[#7aaec9] transition-colors disabled:opacity-50"
        >
          <Save size={15} />
          {saving ? "Saving…" : mode === "create" ? "Create Listing" : "Save Changes"}
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-8">

        {/* ── Listing Type ── */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold text-[#a4c8e0] uppercase tracking-widest mb-4">Listing Type</h2>
          <div className="flex gap-3">
            {(["from-developer", "resale"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => set("listing_type", t)}
                className={`flex-1 py-3 rounded-xl border text-sm font-bold transition-all ${
                  form.listing_type === t
                    ? t === "from-developer"
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/30"
                      : "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-900/30"
                    : "border-border text-muted-foreground hover:border-[#a4c8e0]/50 hover:text-white"
                }`}
              >
                {t === "from-developer" ? "🏢 From Developer" : "🔄 Resale"}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground mt-3">
            {form.listing_type === "resale"
              ? "Unit sold by an owner or investor on the secondary market"
              : "New unit sold directly by the developer"}
          </p>
        </section>

        {/* ── Basic Info ── */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold text-[#a4c8e0] uppercase tracking-widest mb-4">Listing Info</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("title_en", "Title (English) *", "text", "e.g. Luxury Apartment in New Capital")}
            {field("title_ar", "Title (Arabic) *", "text", "مثال: شقة فاخرة في العاصمة الإدارية")}
            {field("description_en", "Description (EN)", "text", "Short description...")}
            {field("description_ar", "Description (AR)", "text", "وصف قصير...")}
            {field("delivery_year", "Delivery Year", "number", "2026")}
          </div>
        </section>

        {/* ── Agent ── */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold text-[#a4c8e0] uppercase tracking-widest mb-4">Assigned Agent</h2>
          {agents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No team members yet.{" "}
              <a href="/admin/team" className="text-[#a4c8e0] hover:underline">Add team members first →</a>
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  type="button"
                  onClick={() => set("agent_id", agent.id as never)}
                  className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                    form.agent_id === agent.id
                      ? "border-[#a4c8e0] bg-[#a4c8e0]/10"
                      : "border-border hover:border-[#a4c8e0]/40 hover:bg-muted/30"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                    form.agent_id === agent.id ? "bg-[#a4c8e0]/20" : "bg-muted"
                  }`}>
                    <User size={16} className={form.agent_id === agent.id ? "text-[#a4c8e0]" : "text-muted-foreground"} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${form.agent_id === agent.id ? "text-white" : "text-muted-foreground"}`}>
                      {agent.name}
                      {agent.is_default && <span className="ml-1.5 text-[10px] text-[#a4c8e0]">default</span>}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">{agent.whatsapp_number}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          {selectedAgent && (
            <p className="text-[11px] text-muted-foreground mt-3">
              Visitors will see WhatsApp & Call buttons connected to <strong className="text-white">{selectedAgent.name}</strong>
            </p>
          )}
        </section>

        {/* ── Unit Details ── */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold text-[#a4c8e0] uppercase tracking-widest mb-4">Unit Details</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {field("area_sqm", "Area (m²)", "number", "120")}
            {field("bedrooms", "Bedrooms", "number", "3")}
            {field("bathrooms", "Bathrooms", "number", "2")}
            {field("unit_type", "Unit Type", "text", "Apartment / Villa / Chalet")}
            {field("finishing", "Finishing", "text", "Fully Finished / Semi / Core & Shell")}
          </div>
        </section>

        {/* ── Pricing ── */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold text-[#a4c8e0] uppercase tracking-widest mb-4">Pricing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            {field("price", "Full Price (EGP)", "number", "0")}
            {field("down_payment", "Down Payment (EGP)", "number", "0")}
            {field("monthly_payment", "Monthly Payment (EGP)", "number", "0")}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3">
            {toggle("show_price", "Show Price")}
            {toggle("show_downpayment", "Show Down Payment")}
            {toggle("show_monthly", "Show Monthly")}
            {toggle("show_full_price", "Show Full Price")}
          </div>
        </section>

        {/* ── Location ── */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold text-[#a4c8e0] uppercase tracking-widest mb-4">Location</h2>
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
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold text-[#a4c8e0] uppercase tracking-widest mb-4">Images</h2>
          <ImageUploader
            images={form.images ?? []}
            onChange={(imgs) => set("images", imgs as never)}
          />
        </section>

        {/* ── Settings ── */}
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold text-[#a4c8e0] uppercase tracking-widest mb-4">Settings</h2>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {toggle("is_featured", "⭐ Mark as Featured")}
          </div>
        </section>

        {/* ── Footer actions ── */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => router.push("/admin/listings")}
            className="px-6 py-2.5 rounded-xl border border-border text-sm hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#a4c8e0] text-[#0a2233] text-sm font-bold hover:bg-[#7aaec9] transition-colors disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? "Saving…" : mode === "create" ? "Create Listing" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
