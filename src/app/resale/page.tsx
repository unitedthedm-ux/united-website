import { redirect } from "next/navigation";

export default function ResalePage() {
  redirect("/properties?tab=resale");
}
