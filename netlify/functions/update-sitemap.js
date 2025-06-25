const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { products } = JSON.parse(event.body);
    
    if (!products || !Array.isArray(products)) {
      throw new Error('Invalid products data');
    }

    // Generate sitemap content
    const sitemap = generateSitemap(products);
    
    // In Netlify Functions, we can't directly write to the public folder
    // Instead, we'll return the sitemap content and let the client handle it
    // Or use Netlify's file system API if available
    
    console.log(`✅ Sitemap generated for ${products.length} products`);
    
    // Notify search engines
    await notifySearchEngines();
    
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Sitemap generated successfully',
        productCount: products.length,
        sitemap: sitemap,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to generate sitemap',
        details: error.message 
      })
    };
  }
};

function generateSitemap(products) {
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

  return `<?xml version="1.0" encoding="UTF-8"?>
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
}

async function notifySearchEngines() {
  const sitemapUrl = 'https://tychem.net/sitemap.xml';
  
  try {
    // Use IndexNow API for modern search engine notification
    const indexNowResponse = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        host: 'tychem.net',
        key: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', // Replace with your IndexNow key
        urlList: [sitemapUrl]
      })
    });
    
    console.log('IndexNow notification sent');
  } catch (error) {
    console.log('IndexNow notification failed:', error.message);
  }
}