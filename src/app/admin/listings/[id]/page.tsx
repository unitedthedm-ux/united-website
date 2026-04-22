"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import ListingForm from "@/components/admin/ListingForm";
import type { Listing } from "@/types";

export default function EditListingPage() {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/admin/listings/${id}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data) => { if (data) setListing(data); })
      .catch(() => setNotFound(true));
  }, [id]);

  return (
    <AdminShell>
      {notFound ? (
        <div className="flex flex-col items-center justify-center py-32 gap-3">
          <p className="text-muted-foreground text-sm">Listing not found.</p>
        </div>
      ) : listing ? (
        <ListingForm mode="edit" initial={listing} />
      ) : (
        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card h-32 animate-pulse" />
          ))}
        </div>
      )}
    </AdminShell>
  );
}
