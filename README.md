# Tychem LLC - Main Website

A modern, responsive website for Tychem LLC, a surplus chemical broker company.

## Features

- **Modern Design**: Clean, professional design with smooth animations
- **Responsive**: Optimized for all device sizes
- **Product Catalog**: Browse available surplus chemicals
- **Contact Forms**: Multiple contact options with email integration
- **SEO Optimized**: Structured data and meta tags for better search visibility

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion
- **UI Components**: Radix UI with shadcn/ui
- **Routing**: React Router
- **Forms**: React Hook Form with Zod validation
- **Email**: EmailJS integration with FormSubmit fallback
- **Build Tool**: Vite

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tychem-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Email Service**
   - Copy `.env.example` to `.env`
   - Sign up at [EmailJS](https://www.emailjs.com/)
   - Create an email service and template
   - Add your credentials to `.env`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## Email Configuration

The website uses EmailJS for form submissions with FormSubmit as a fallback. To set up EmailJS:

1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Add an email service (Gmail, Outlook, etc.)
3. Create an email template with these variables:
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{company}}` - Company name
   - `{{phone}}` - Phone number
   - `{{message}}` - Message content
   - `{{form_type}}` - Form type (contact/offer)
   - `{{product_name}}` - Product name (for offers)
   - `{{product_cas}}` - Product CAS number (for offers)
   - `{{offer_price}}` - Offer price (for offers)

4. Copy your Service ID, Template ID, and Public Key to `.env`

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── data/               # Static data and types
├── lib/                # Utility functions
├── hooks/              # Custom React hooks
└── index.css           # Global styles
```

## Key Components

- **Hero**: Landing section with animated globe
- **About**: Company information with video
- **Features**: Service highlights
- **ChemicalList**: Product showcase
- **ContactSection**: Contact form
- **Products**: Full product catalog page
- **ProductDetail**: Individual product pages

## Deployment

The site is optimized for deployment on modern hosting platforms like Netlify, Vercel, or similar services that support static site generation.

## License

© 2025 TYCHEM LLC. All rights reserved.
## Search engines: product pages and sitemap

`npm run build` runs `vite build` and then `scripts/prerender.mjs`, which reads the
products from Supabase and writes a real HTML page for `/`, `/products` and every
product (`/products/<id>-<name>`), plus `sitemap.xml` and `_redirects`. Search
engines read those pages directly instead of waiting for the app to draw them.

The build needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (in Netlify's
environment variables, or `.env` locally). It fails rather than publish a site
with no products if Supabase can't be read.

Product pages are only as fresh as the last build. To rebuild whenever a product
changes:

1. Netlify: Site configuration > Build & deploy > Build hooks > Add build hook. Copy the URL.
2. Supabase: Database > Webhooks > Create a new hook on the `products` table, for
   Insert, Update and Delete, type HTTP Request, method POST, URL = the build hook.

A product's address is `<id>-<name>`, so renaming a product keeps its link working.
The admin panel's JSON import deletes and re-adds every product, which gives each
one a new id; avoid it, or expect every product address to change.
