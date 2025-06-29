import { Chemical } from '@/data/products';

export const generateSitemap = (products: Chemical[]): string => {
  const baseUrl = 'https://tychem.net';
  const currentDate = new Date().toISOString().split('T')[0];
  
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

  return sitemapXml;
};

export const downloadSitemap = (products: Chemical[]) => {
  const sitemapContent = generateSitemap(products);
  const blob = new Blob([sitemapContent], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sitemap.xml';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const copySitemapToClipboard = async (products: Chemical[]) => {
  const sitemapContent = generateSitemap(products);
  await navigator.clipboard.writeText(sitemapContent);
};

// Auto-save sitemap to a file that can replace the public one
export const autoSaveSitemap = (products: Chemical[]) => {
  const sitemapContent = generateSitemap(products);
  
  // Create a blob and download it automatically
  const blob = new Blob([sitemapContent], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sitemap.xml';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  return sitemapContent;
};