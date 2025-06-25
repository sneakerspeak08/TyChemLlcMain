import { useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";

const SitemapPage = () => {
  const products = useProducts();
  const baseUrl = 'https://tychem.net';
  const currentDate = new Date().toISOString().split('T')[0];
  
  useEffect(() => {
    // Set the correct content type for XML
    const metaContentType = document.createElement('meta');
    metaContentType.httpEquiv = 'Content-Type';
    metaContentType.content = 'application/xml; charset=utf-8';
    document.head.appendChild(metaContentType);

    return () => {
      // Cleanup
      document.head.removeChild(metaContentType);
    };
  }, []);
  
  const staticUrls = [
    {
      loc: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0'
    },
    {
      loc: `${baseUrl}/products`,
      lastmod: currentDate,
      changefreq: 'daily',
      priority: '0.9'
    }
  ];

  const productUrls = products.map(product => ({
    loc: `${baseUrl}/products/${product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`,
    lastmod: currentDate,
    changefreq: 'weekly',
    priority: '0.8'
  }));

  const allUrls = [...staticUrls, ...productUrls];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allUrls.map(url => `  
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('')}
  
</urlset>`;

  // Return raw XML content
  return (
    <div 
      dangerouslySetInnerHTML={{ __html: sitemapXml }}
      style={{ 
        fontFamily: 'monospace', 
        whiteSpace: 'pre-wrap', 
        fontSize: '12px',
        margin: 0,
        padding: 0
      }}
    />
  );
};

export default SitemapPage;