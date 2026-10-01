import { useEffect } from "react";

export const SITE_URL = "https://tychem.net";

interface PageMeta {
  title: string;
  description: string;
  // Path of this page's own address, e.g. "/products/24-isopropyl-myristate".
  // Omit it to leave the page without a canonical link.
  path?: string;
  noindex?: boolean;
}

const setMeta = (attr: "name" | "property", key: string, content: string) => {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.content = content;
};

const setCanonical = (url: string | null) => {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!url) {
    link?.remove();
    return;
  }
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = url;
};

// Keeps the title, description and canonical link right as visitors move between
// pages in the browser. The first page load already has them baked in by
// scripts/prerender.mjs; this covers navigation after that.
export const usePageMeta = ({ title, description, path, noindex }: PageMeta) => {
  useEffect(() => {
    const url = path === undefined ? null : `${SITE_URL}${path}`;
    document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "twitter:title", title);
    setMeta("property", "twitter:description", description);
    if (url) {
      setMeta("property", "og:url", url);
      setMeta("property", "twitter:url", url);
    }
    setMeta("name", "robots", noindex ? "noindex" : "index, follow");
    setCanonical(url);
  }, [title, description, path, noindex]);
};
