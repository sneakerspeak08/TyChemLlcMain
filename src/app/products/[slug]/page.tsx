import { notFound, permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import ProductDetailView from "@/views/ProductDetailView";
import { getProducts } from "@/lib/products";
import { findProductBySlug, productPath, productSlug } from "@/lib/productUrl";
import { breadcrumbJsonLd, jsonLdScript, pageMetadata, productDescription } from "@/lib/seo";

export const revalidate = 60;
// Products added after the last deploy still get a page on first visit.
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

const lookup = async (params: Props["params"]) => {
  const { slug } = await params;
  const decoded = decodeURIComponent(slug);
  return { slug: decoded, product: findProductBySlug(await getProducts(), decoded) };
};

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: productSlug(p) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product } = await lookup(params);
  if (!product) return { title: "Page not found | Tychem LLC", robots: { index: false } };
  return pageMetadata({
    title: `${product.name} | Surplus Chemical | Tychem LLC`,
    description: productDescription(product),
    path: productPath(product),
  });
}

export default async function Page({ params }: Props) {
  const { slug, product } = await lookup(params);
  if (!product) notFound();
  // An old name-only link, or the product was renamed: send it to the current address.
  if (slug !== productSlug(product)) permanentRedirect(productPath(product));

  const crumbs = breadcrumbJsonLd([["Home", "/"], ["Products", "/products"], [product.name, productPath(product)]]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(crumbs)} />
      <ProductDetailView product={product} />
    </>
  );
}
