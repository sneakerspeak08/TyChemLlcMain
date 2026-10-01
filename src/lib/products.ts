import { cache } from "react";
import type { Chemical } from "@/data/products";

export type Product = Chemical & { updated_at: string | null };

// Every public page reads products here, on the server, so the HTML that
// visitors and search engines receive already contains them. Results are cached
// for 60 seconds: an edit in the admin panel shows on the live site within a minute.
export const REVALIDATE_SECONDS = 60;

export const getProducts = cache(async (): Promise<Product[]> => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set");

  const res = await fetch(`${url}/rest/v1/products?select=id,name,description,quantity,updated_at&order=id`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    next: { revalidate: REVALIDATE_SECONDS },
  });
  // Throwing keeps the last good version of the page up instead of replacing it
  // with an empty product list.
  if (!res.ok) throw new Error(`Supabase returned ${res.status}`);
  return res.json();
});
