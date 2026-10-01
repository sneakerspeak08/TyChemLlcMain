import type { Metadata } from "next";

export const SITE_URL = "https://tychem.net";
export const SITE_NAME = "Tychem LLC";

export const HOME_TITLE = "Tychem LLC - Surplus Chemical Brokers Since 2001 | Industrial Chemicals";
export const HOME_DESCRIPTION =
  "Leading surplus chemical broker since 2001. Buy and sell industrial chemicals including sodium hydroxide, citric acid, glycerin, and more. Save money while protecting the environment.";

// Next.js replaces (not merges) a page's openGraph and twitter blocks, so every
// page builds all of them from here to keep them consistent.
export const pageMetadata = ({ title, description, path }: { title: string; description: string; path: string }): Metadata => ({
  title,
  description,
  alternates: { canonical: path },
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_US", url: path, title, description },
  twitter: { card: "summary", title, description },
});

// Search results show about 155 characters; lead with what a buyer searches for.
export const productDescription = (p: { name: string; quantity: string; description: string }) => {
  const text = `${p.name}, ${p.quantity} available as surplus from Tychem LLC. ${p.description}`.replace(/\s+/g, " ").trim();
  return text.length > 155 ? `${text.slice(0, 152).trimEnd()}...` : text;
};

export const breadcrumbJsonLd = (items: [name: string, path: string][]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
    item: `${SITE_URL}${path}`,
  })),
});

// JSON inside a <script> tag must not be able to close the tag early.
export const jsonLdScript = (value: unknown) => ({ __html: JSON.stringify(value).replace(/</g, "\u003c") });
