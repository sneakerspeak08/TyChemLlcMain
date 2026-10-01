import type { Metadata } from "next";
import NotFoundView from "@/views/NotFoundView";

export const metadata: Metadata = {
  title: "Page not found | Tychem LLC",
  robots: { index: false },
};

export default function NotFound() {
  return <NotFoundView />;
}
