import ProductsPage from "@/views/ProductsPage";
import { getProducts } from "@/lib/products";
import { breadcrumbJsonLd, jsonLdScript, pageMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata = pageMetadata({
  title: "Chemical Products | Surplus Industrial Chemicals | Tychem LLC",
  description: "Browse our inventory of surplus industrial chemicals. Contact Tychem LLC for pricing and availability.",
  path: "/products",
});

export default async function Page() {
  const products = await getProducts();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd([["Home", "/"], ["Products", "/products"]]))} />
      <ProductsPage products={products} />
    </>
  );
}
