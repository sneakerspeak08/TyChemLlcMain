import type { Chemical } from "@/data/products";

type ProductRef = Pick<Chemical, "id" | "name">;

export const slugify = (text: string) =>
  text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// A product's permanent address is "<id>-<name>". The id is what identifies the
// product, so renaming it, or listing two products with the same name, never
// breaks a link. The name part is there for people and search engines.
export const productSlug = (product: ProductRef) => `${product.id}-${slugify(product.name)}`;

export const productPath = (product: ProductRef) => `/products/${productSlug(product)}`;

// The old address scheme: the name, lowercased, with spaces turned into dashes.
export const legacySlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

export const findProductBySlug = <T extends ProductRef>(products: T[], slug: string): T | undefined => {
  const exact = products.find((p) => productSlug(p) === slug);
  if (exact) return exact;

  // An old name-only link (from before the id was added to the address).
  const byName = products.find((p) => legacySlug(p.name) === slug || slugify(p.name) === slug);
  if (byName) return byName;

  // The id is right but the name part is out of date (the product was renamed).
  const id = /^(\d+)-/.exec(slug)?.[1];
  return id ? products.find((p) => p.id === Number(id)) : undefined;
};
