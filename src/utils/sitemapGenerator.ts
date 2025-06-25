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

// Function to update the public sitemap.xml file (for manual replacement)
export const generateSitemapInstructions = (products: Chemical[]): string => {
  return `
🎯 **SITEMAP UPDATE INSTRUCTIONS**

Your current inventory has ${products.length} products. To update your live sitemap:

1. **Download the sitemap** using the button in the admin panel
2. **Replace the public/sitemap.xml** file with the downloaded version
3. **Submit to Google Search Console** for faster indexing

**Current Products in Sitemap:**
${products.map((product, index) => `${index + 1}. ${product.name}`).join('\n')}

**URLs Generated:**
- Homepage: https://tychem.net/
- Products: https://tychem.net/products
${products.map(product => `- ${product.name}: https://tychem.net/products/${product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`).join('\n')}

**Next Steps:**
1. Download the updated sitemap
2. Submit to Google Search Console
3. Monitor indexing status
  `;
};