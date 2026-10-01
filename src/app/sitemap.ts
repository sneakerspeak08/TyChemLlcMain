import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/products";
import { productPath } from "@/lib/productUrl";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const lastModified = (p: { updated_at: string | null }) => (p.updated_at ? new Date(p.updated_at) : undefined);
  const newest = products.map(lastModified).filter(Boolean).sort((a, b) => b!.getTime() - a!.getTime())[0];
  return [
    { url: `${SITE_URL}/`, lastModified: newest },
    { url: `${SITE_URL}/products`, lastModified: newest },
    ...products.map((p) => ({ url: `${SITE_URL}${productPath(p)}`, lastModified: lastModified(p) })),
  ];
}
