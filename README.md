# Tychem LLC - Main Website

A modern, responsive website for Tychem LLC, a surplus chemical broker company.

## Features

- **Modern Design**: Clean, professional design with smooth animations
- **Responsive**: Optimized for all device sizes
- **Product Catalog**: Browse available surplus chemicals
- **Contact Forms**: Multiple contact options with email integration
- **SEO Optimized**: Structured data and meta tags for better search visibility

## Tech Stack

- **Framework**: Next.js (App Router) with React and TypeScript
- **Data**: Supabase (products table)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Animations**: Framer Motion
- **Forms**: Web3Forms, with Netlify Forms as a fallback (`public/__forms.html`)
- **Hosting**: Netlify

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in the Supabase URL and public (anon) key
   (Supabase: Project Settings > API).
3. `npm run dev` and open http://localhost:3000

Before pushing: `npm run typecheck` and `npm run build`.

## Search engines: product pages and sitemap

The site is a Next.js app. Every public page (home, `/products`, and one page per
product at `/products/<id>-<name>`) is built on the server from the Supabase
products table, so search engines get complete HTML with its own title,
description and canonical link. `/sitemap.xml` and `/robots.txt` are generated
the same way (`src/app/sitemap.ts`, `src/app/robots.ts`).

Pages refresh themselves: product data is cached for 60 seconds
(`src/lib/products.ts`), so an edit in the admin panel is live within a minute
without a redeploy.

A product's address is `<id>-<name>`, so renaming a product keeps its link
working, and old name-only links redirect permanently to the current address.
The admin panel's JSON import deletes and re-adds every product, which gives each
one a new id; avoid it, or expect every product address to change.

Environment variables (Netlify, or `.env` locally):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
