import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { HOME_DESCRIPTION, HOME_TITLE, jsonLdScript, SITE_URL } from "@/lib/seo";
import "@/index.css";

// No canonical link here: each page sets its own, so a page that forgets one (or
// a 404) can never claim to be the homepage.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  authors: [{ name: "Tychem LLC" }],
};

const address = {
  "@type": "PostalAddress",
  streetAddress: "312 Bulkhead Way Ste 104, PMB 308",
  addressLocality: "Clover",
  addressRegion: "SC",
  postalCode: "29710",
  addressCountry: "US",
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Tychem LLC",
  alternateName: "TYCHEM",
  url: SITE_URL,
  description: "Surplus chemical brokers since 2001, specializing in buying and selling industrial chemicals while providing environmental solutions.",
  foundingDate: "2001",
  address,
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-561-357-3200",
    contactType: "customer service",
    email: "ty@tychem.net",
    availableLanguage: "English",
  },
  sameAs: [
    "https://www.linkedin.com/company/tychem-llc/",
    "https://www.facebook.com/people/Tychem-LLC/100066420100375/",
    "https://www.youtube.com/watch?v=7OsRBfAEUJA",
    "https://www.instagram.com/tychemllc/",
  ],
};

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Tychem LLC",
  telephone: "+1-561-357-3200",
  email: "ty@tychem.net",
  address,
  geo: { "@type": "GeoCoordinates", latitude: "35.1174", longitude: "-81.2265" },
  url: SITE_URL,
  openingHours: "Mo-Fr 09:00-17:00",
  priceRange: "$$",
  description: "Surplus chemical brokers since 2001, specializing in buying and selling industrial chemicals.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(organization)} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(localBusiness)} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
