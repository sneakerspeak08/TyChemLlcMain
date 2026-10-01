import type { Metadata } from "next";
import AdminPage from "@/views/AdminPage";

export const metadata: Metadata = { title: "Admin | Tychem LLC", robots: { index: false, follow: false } };

export default function Page() {
  return <AdminPage />;
}
