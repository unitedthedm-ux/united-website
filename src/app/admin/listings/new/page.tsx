"use client";

import AdminShell from "@/components/admin/AdminShell";
import ListingForm from "@/components/admin/ListingForm";

export default function NewListingPage() {
  return (
    <AdminShell>
      <ListingForm mode="create" />
    </AdminShell>
  );
}
