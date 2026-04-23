"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, MapPin, ChevronDown } from "lucide-react";

interface LocationNode {
  id: string;
  name_en: string;
  name_ar: string;
  slug: string;
  level: number;
  parent_id: string | null;
}

interface LocationValues {
  region?: string;       // Governorate (level 2)
  neighborhood?: string; // District    (level 3)
  area?: string;         // Area        (level 4)
  compound_name?: string;// Compound    (level 5)
}

interface Props {
  values: LocationValues;
  onChange: (v: LocationValues) => void;
}

const SELECT =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#a4c8e0] transition-colors text-white";

const INPUT =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-[#a4c8e0] transition-colors text-white";

async function fetchLocations(level: number, parentId?: string): Promise<LocationNode[]> {
  const params = new URLSearchParams({ level: String(level) });
  if (parentId) params.set("parent_id", parentId);
  const res = await fetch(`/api/locations?${params}`);
  if (!res.ok) return [];
  return res.json();
}

export default function LocationPicker({ values, onChange }: Props) {
  const hasExisting =
    values.region || values.neighborhood || values.area || values.compound_name;

  const [expanded, setExpanded] = useState(!hasExisting);

  const [governorates, setGovernorates] = useState<LocationNode[]>([]);
  const [districts, setDistricts] = useState<LocationNode[]>([]);
  const [areas, setAreas] = useState<LocationNode[]>([]);
  const [compounds, setCompounds] = useState<LocationNode[]>([]);

  const [selGov, setSelGov] = useState<LocationNode | null>(null);
  const [selDist, setSelDist] = useState<LocationNode | null>(null);
  const [selArea, setSelArea] = useState<LocationNode | null>(null);
  const [selCompound, setSelCompound] = useState<LocationNode | null>(null);

  const [showAdd, setShowAdd] = useState(false);
  const [addEn, setAddEn] = useState("");
  const [addAr, setAddAr] = useState("");
  const [adding, setAdding] = useState(false);

  // Load governorates and auto-select Cairo as default
  useEffect(() => {
    fetchLocations(2).then((data) => {
      setGovernorates(data);

      // If editing an existing listing, match the saved region
      if (values.region) {
        const match = data.find(
          (g) => g.name_en.toLowerCase() === values.region?.toLowerCase()
        );
        if (match) { setSelGov(match); return; }
      }

      // Default to Cairo for new listings
      const cairo = data.find((g) => g.name_en.toLowerCase().includes("cairo"));
      if (cairo) setSelGov(cairo);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load districts when gov changes
  useEffect(() => {
    if (!selGov) { setDistricts([]); setSelDist(null); return; }
    fetchLocations(3, selGov.id).then((data) => {
      setDistricts(data);
      if (values.neighborhood) {
        const m = data.find(
          (d) => d.name_en.toLowerCase() === values.neighborhood?.toLowerCase()
        );
        if (m) setSelDist(m);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selGov]);

  // Load areas when district changes
  useEffect(() => {
    if (!selDist) { setAreas([]); setSelArea(null); return; }
    fetchLocations(4, selDist.id).then((data) => {
      setAreas(data);
      if (values.area) {
        const m = data.find(
          (a) => a.name_en.toLowerCase() === values.area?.toLowerCase()
        );
        if (m) setSelArea(m);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selDist]);

  // Load compounds when area changes
  useEffect(() => {
    if (!selArea) { setCompounds([]); setSelCompound(null); return; }
    fetchLocations(5, selArea.id).then((data) => {
      setCompounds(data);
      if (values.compound_name) {
        const m = data.find(
          (c) => c.name_en.toLowerCase() === values.compound_name?.toLowerCase()
        );
        if (m) setSelCompound(m);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selArea]);

  const notify = useCallback(
    (gov: LocationNode | null, dist: LocationNode | null, area: LocationNode | null, comp: LocationNode | null) => {
      onChange({
        region: gov?.name_en,
        neighborhood: dist?.name_en,
        area: area?.name_en,
        compound_name: comp?.name_en,
      });
    },
    [onChange]
  );

  function selectGov(node: LocationNode | null) {
    setSelGov(node);
    setSelDist(null);
    setSelArea(null);
    setSelCompound(null);
    notify(node, null, null, null);
  }

  function selectDist(node: LocationNode | null) {
    setSelDist(node);
    setSelArea(null);
    setSelCompound(null);
    notify(selGov, node, null, null);
  }

  function selectArea(node: LocationNode | null) {
    setSelArea(node);
    setSelCompound(null);
    notify(selGov, selDist, node, null);
  }

  function selectCompound(node: LocationNode | null) {
    setSelCompound(node);
    notify(selGov, selDist, selArea, node);
  }

  async function addCompound() {
    if (!selArea || !addEn.trim()) return;
    setAdding(true);
    const res = await fetch("/api/admin/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name_en: addEn, name_ar: addAr || addEn, parent_id: selArea.id, level: 5 }),
    });
    if (res.ok) {
      const newNode: LocationNode = await res.json();
      setCompounds((c) => [...c, newNode].sort((a, b) => a.name_en.localeCompare(b.name_en)));
      selectCompound(newNode);
      setShowAdd(false);
      setAddEn("");
      setAddAr("");
    }
    setAdding(false);
  }

  const breadcrumb = [selGov?.name_en, selDist?.name_en, selArea?.name_en, selCompound?.name_en]
    .filter(Boolean)
    .join(" › ");

  // ── Collapsed summary ─────────────────────────────────────────────────
  if (!expanded) {
    const summary = [values.compound_name, values.area, values.neighborhood, values.region]
      .filter(Boolean)
      .join(", ");
    return (
      <div className="rounded-xl border border-border bg-muted/20 p-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <MapPin size={14} className="text-[#a4c8e0] mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">Location</p>
            <p className="text-sm text-white">{summary || "—"}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="shrink-0 flex items-center gap-1 text-xs text-[#a4c8e0] hover:underline"
        >
          Change <ChevronDown size={12} />
        </button>
      </div>
    );
  }

  // ── Full picker ───────────────────────────────────────────────────────
  return (
    <div className="space-y-3">

      {/* Governorate */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1">
          Governorate <span className="text-red-400">*</span>
        </label>
        <select
          value={selGov?.id ?? ""}
          onChange={(e) => {
            const id = e.target.value;
            selectGov(governorates.find((g) => g.id === id) ?? null);
          }}
          className={SELECT}
        >
          <option value="">— Select governorate —</option>
          {governorates.map((g) => (
            <option key={g.id} value={g.id}>
              {g.name_en} · {g.name_ar}
            </option>
          ))}
        </select>
      </div>

      {/* District */}
      {selGov && (
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">District</label>
          <select
            value={selDist?.id ?? ""}
            onChange={(e) => {
              const id = e.target.value;
              selectDist(districts.find((d) => d.id === id) ?? null);
            }}
            className={SELECT}
          >
            <option value="">— Select district —</option>
            {districts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name_en} · {d.name_ar}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Area */}
      {selDist && (
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">Area</label>
          <select
            value={selArea?.id ?? ""}
            onChange={(e) => {
              const id = e.target.value;
              selectArea(areas.find((a) => a.id === id) ?? null);
            }}
            className={SELECT}
          >
            <option value="">— Select area —</option>
            {areas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name_en} · {a.name_ar}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Compound */}
      {selArea && (
        <div>
          <label className="block text-xs font-medium text-muted-foreground mb-1">
            Compound <span className="text-muted-foreground text-[10px]">(optional)</span>
          </label>
          <div className="flex gap-2">
            <select
              value={selCompound?.id ?? ""}
              onChange={(e) => {
                const id = e.target.value;
                selectCompound(compounds.find((c) => c.id === id) ?? null);
              }}
              className={SELECT}
            >
              <option value="">— No compound / select —</option>
              {compounds.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name_en}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowAdd((v) => !v)}
              title="Add new compound"
              className="shrink-0 flex items-center gap-1 rounded-lg border border-[#a4c8e0]/50 px-3 py-2 text-[#a4c8e0] hover:bg-[#a4c8e0]/10 transition-colors text-xs font-medium"
            >
              <Plus size={13} /> New
            </button>
          </div>

          {showAdd && (
            <div className="mt-2 rounded-xl border border-border bg-muted/30 p-4 space-y-3">
              <p className="text-xs font-semibold text-[#a4c8e0]">Add New Compound</p>
              <input
                placeholder="Compound name (English) *"
                value={addEn}
                onChange={(e) => setAddEn(e.target.value)}
                className={INPUT}
              />
              <input
                placeholder="اسم المشروع بالعربي"
                value={addAr}
                onChange={(e) => setAddAr(e.target.value)}
                className={INPUT}
                dir="rtl"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setShowAdd(false); setAddEn(""); setAddAr(""); }}
                  className="flex-1 rounded-lg border border-border py-2 text-xs hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={addCompound}
                  disabled={!addEn.trim() || adding}
                  className="flex-1 rounded-lg bg-[#a4c8e0] text-[#0a2233] py-2 text-xs font-semibold hover:bg-[#7aaec9] transition-colors disabled:opacity-50"
                >
                  {adding ? "Adding…" : "Add Compound"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Breadcrumb preview */}
      {breadcrumb && (
        <div className="rounded-lg bg-[#a4c8e0]/5 border border-[#a4c8e0]/20 px-3 py-2">
          <p className="text-[11px] text-[#a4c8e0]">📍 {breadcrumb}</p>
        </div>
      )}

      {hasExisting && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="text-xs text-muted-foreground hover:text-white transition-colors"
        >
          ← Back to summary
        </button>
      )}
    </div>
  );
}
