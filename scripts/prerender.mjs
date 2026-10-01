// Runs after `vite build`. The React app draws pages in the browser, so the HTML
// a search engine downloads would otherwise be an empty shell. This script reads
// the product list from Supabase and writes a real HTML page for /, /products and
// every product, plus sitemap.xml and the _redirects file.
//
// It runs on every Netlify build. To keep product pages current, point a Supabase
// database webhook on the products table at a Netlify build hook (see README).

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadEnv } from "vite";

const SITE_URL = "https://tychem.net";
const DIST = path.resolve("dist");

// --- product addresses: keep in step with src/lib/productUrl.ts ---------------
const slugify = (text) =>
  text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
const productSlug = (p) => `${p.id}-${slugify(p.name)}`;
const productPath = (p) => `/products/${productSlug(p)}`;
const legacySlug = (name) => name.toLowerCase().replace(/\s+/g, "-");

// Keep in step with productDescription in src/pages/ProductDetail.tsx.
const productDescription = (p) => {
  const text = `${p.name}, ${p.quantity} available as surplus from Tychem LLC. ${p.description}`.replace(/\s+/g, " ").trim();
  return text.length > 155 ? `${text.slice(0, 152).trimEnd()}...` : text;
};

const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// JSON inside a <script> tag must not be able to close the tag early.
const scriptJson = (value) => JSON.stringify(value).replace(/</g, "\\u003c");

// --- data -----------------------------------------------------------------------
async function fetchProducts() {
  const env = loadEnv("production", process.cwd(), "");
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set");

  const res = await fetch(`${url}/rest/v1/products?select=id,name,description,quantity,updated_at&order=id`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`Supabase returned ${res.status}: ${await res.text()}`);
  const products = await res.json();
  // Fail the build rather than publish a site with no products if the read
  // quietly comes back empty; Netlify then keeps serving the last good deploy.
  if (!Array.isArray(products) || products.length === 0) throw new Error("Supabase returned no products");
  return products;
}

// --- page rendering -------------------------------------------------------------
function renderPage(template, { title, description, pagePath, body, jsonLd, products }) {
  const url = `${SITE_URL}${pagePath}`;
  const replaceMeta = (html, attr, key, value) => {
    const pattern = new RegExp(`(<meta ${attr}="${key}" content=")[^"]*(")`);
    if (!pattern.test(html)) throw new Error(`index.html is missing <meta ${attr}="${key}">`);
    return html.replace(pattern, `$1${escapeHtml(value)}$2`);
  };

  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
  html = replaceMeta(html, "name", "title", title);
  html = replaceMeta(html, "name", "description", description);
  html = replaceMeta(html, "property", "og:url", url);
  html = replaceMeta(html, "property", "og:title", title);
  html = replaceMeta(html, "property", "og:description", description);
  html = replaceMeta(html, "property", "twitter:url", url);
  html = replaceMeta(html, "property", "twitter:title", title);
  html = replaceMeta(html, "property", "twitter:description", description);

  const head = [
    `<link rel="canonical" href="${escapeHtml(url)}" />`,
    jsonLd ? `<script type="application/ld+json">${scriptJson(jsonLd)}</script>` : "",
    `<script>window.__TYCHEM_PRODUCTS__=${scriptJson(products)}</script>`,
  ].join("\n    ");
  html = html.replace("</head>", `    ${head}\n  </head>`);

  if (!html.includes('<div id="root"></div>')) throw new Error('index.html is missing <div id="root"></div>');
  return html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

const shell = (inner) => `
      <main class="pt-24 pb-20 bg-gray-50 min-h-screen">
        <div class="container mx-auto px-4 md:px-6">${inner}
        </div>
      </main>`;

const productBody = (p) =>
  shell(`
          <p class="max-w-4xl mx-auto mb-6"><a href="/products">Back to Products</a></p>
          <article class="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-lg">
            <h1 class="text-3xl font-bold">${escapeHtml(p.name)}</h1>
            <p class="mt-4">Quantity available: ${escapeHtml(p.quantity)}</p>
            <p class="mt-4 text-lg text-gray-700">${escapeHtml(p.description)}</p>
            <p class="mt-8">To make an offer, email <a href="mailto:Sales@tychem.net">Sales@tychem.net</a> or call 561-357-3200.</p>
          </article>`);

const productsBody = (products) =>
  shell(`
          <h1 class="text-4xl md:text-6xl font-bold mb-6 text-center">Surplus Chemical Products</h1>
          <ul class="max-w-4xl mx-auto">${products
            .map((p) => `\n            <li><a href="${productPath(p)}">${escapeHtml(p.name)}</a>: ${escapeHtml(p.quantity)}</li>`)
            .join("")}
          </ul>`);

const breadcrumbs = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, itemPath], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
    item: `${SITE_URL}${itemPath}`,
  })),
});

// --- outputs ----------------------------------------------------------------------
function sitemap(products) {
  const today = new Date().toISOString().slice(0, 10);
  const newest = products.map((p) => (p.updated_at ?? "").slice(0, 10)).filter(Boolean).sort().at(-1) ?? today;
  const entries = [
    { loc: "/", lastmod: newest },
    { loc: "/products", lastmod: newest },
    ...products.map((p) => ({ loc: productPath(p), lastmod: (p.updated_at ?? "").slice(0, 10) || today })),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map((e) => `  <url><loc>${SITE_URL}${e.loc}</loc><lastmod>${e.lastmod}</lastmod></url>`).join("\n")}
</urlset>
`;
}

function redirects(products) {
  const rules = [
    "# Generated by scripts/prerender.mjs on every build. Edit that script, not this file.",
    "",
    "# Old Turbify site addresses",
    "/inventory  /products  301",
    "",
    "# Old product addresses (name only, before the id was added)",
  ];
  const taken = new Set(products.map(productPath));
  const seen = new Set();
  for (const p of products) {
    const old = `/products/${legacySlug(p.name)}`;
    // Only plain addresses: names with slashes, brackets or other symbols made
    // links that did not work in the first place. The app still resolves those.
    if (!/^\/products\/[a-z0-9-]+$/.test(old) || taken.has(old) || seen.has(old)) continue;
    seen.add(old);
    rules.push(`${old}  ${productPath(p)}  301`);
  }
  rules.push("", "# Everything else is drawn by the React app", "/*  /app.html  200", "");
  return rules.join("\n");
}

async function writePage(pagePath, html) {
  const file = pagePath === "/" ? "index.html" : `${pagePath.slice(1)}.html`;
  const target = path.join(DIST, file);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, html);
}

async function main() {
  const template = await readFile(path.join(DIST, "index.html"), "utf8");
  const products = await fetchProducts();
  // Only what the browser app needs; the embedded copy is replaced by a live read.
  const embedded = products.map(({ id, name, description, quantity }) => ({ id, name, description, quantity }));

  // The fallback for every address without its own file (/admin, unknown links).
  // It has no canonical link, so it can never claim to be another page.
  await writeFile(path.join(DIST, "app.html"), template);

  await writePage(
    "/",
    renderPage(template, {
      title: "Tychem LLC - Surplus Chemical Brokers Since 2001 | Industrial Chemicals",
      description:
        "Leading surplus chemical broker since 2001. Buy and sell industrial chemicals including sodium hydroxide, citric acid, glycerin, and more. Save money while protecting the environment.",
      pagePath: "/",
      body: "",
      products: embedded,
    }),
  );

  await writePage(
    "/products",
    renderPage(template, {
      title: "Chemical Products | Surplus Industrial Chemicals | Tychem LLC",
      description: "Browse our inventory of surplus industrial chemicals. Contact Tychem LLC for pricing and availability.",
      pagePath: "/products",
      body: productsBody(products),
      jsonLd: breadcrumbs([["Home", "/"], ["Products", "/products"]]),
      products: embedded,
    }),
  );

  for (const p of products) {
    await writePage(
      productPath(p),
      renderPage(template, {
        title: `${p.name} | Surplus Chemical | Tychem LLC`,
        description: productDescription(p),
        pagePath: productPath(p),
        body: productBody(p),
        jsonLd: breadcrumbs([["Home", "/"], ["Products", "/products"], [p.name, productPath(p)]]),
        products: embedded,
      }),
    );
  }

  await writeFile(path.join(DIST, "sitemap.xml"), sitemap(products));
  await writeFile(path.join(DIST, "_redirects"), redirects(products));
  console.log(`prerender: wrote ${products.length} product pages, /products, /, sitemap.xml and _redirects`);
}

main().catch((err) => {
  console.error(`prerender failed: ${err.message}`);
  process.exit(1);
});
