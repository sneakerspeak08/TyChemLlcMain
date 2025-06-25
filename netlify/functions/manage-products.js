const fs = require('fs').promises;
const path = require('path');

// Simple file-based storage for products
const PRODUCTS_FILE = '/tmp/tychem-products.json';

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (event.httpMethod === 'GET') {
      // Get products
      const products = await getProducts();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          products: products,
          timestamp: new Date().toISOString()
        })
      };
    }

    if (event.httpMethod === 'POST') {
      // Save products
      const { action, products } = JSON.parse(event.body);
      
      if (action === 'save' && products) {
        await saveProducts(products);
        
        // Also update the sitemap
        await updateSitemap(products);
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            success: true, 
            message: 'Products saved successfully',
            productCount: products.length,
            timestamp: new Date().toISOString()
          })
        };
      }
    }

    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid request' })
    };

  } catch (error) {
    console.error('Error managing products:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      })
    };
  }
};

async function getProducts() {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Return default products if file doesn't exist
    return getDefaultProducts();
  }
}

async function saveProducts(products) {
  const data = JSON.stringify(products, null, 2);
  await fs.writeFile(PRODUCTS_FILE, data, 'utf8');
  console.log(`✅ Saved ${products.length} products to persistent storage`);
}

async function updateSitemap(products) {
  try {
    const sitemap = generateSitemap(products);
    const sitemapPath = '/tmp/sitemap.xml';
    await fs.writeFile(sitemapPath, sitemap, 'utf8');
    console.log('✅ Sitemap updated with new products');
  } catch (error) {
    console.error('Failed to update sitemap:', error);
  }
}

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

function getDefaultProducts() {
  return [
    {
      id: 1,
      name: "Sodium Hydroxide",
      description: "Caustic soda in pellet form, technical grade. Widely used in various industrial processes including chemical manufacturing, paper production, and water treatment.",
      quantity: "40,000 lbs"
    },
    {
      id: 2,
      name: "Citric Acid",
      description: "Anhydrous, food grade citric acid. Essential ingredient in food and beverage manufacturing, pharmaceutical formulations, and cleaning products.",
      quantity: "15,000 kgs"
    },
    {
      id: 3,
      name: "Glycerin",
      description: "USP grade, 99.7% pure glycerin. Versatile ingredient used in pharmaceutical, personal care, and food applications. Known for its humectant properties.",
      quantity: "4 totes"
    },
    {
      id: 4,
      name: "Potassium Chloride",
      description: "High purity potassium chloride suitable for various industrial applications including fertilizers, pharmaceuticals, and food processing.",
      quantity: "25,000 kgs"
    },
    {
      id: 5,
      name: "Methanol",
      description: "Technical grade methanol for industrial use. Essential solvent for various chemical processes and manufacturing applications.",
      quantity: "6 tankers"
    },
    {
      id: 6,
      name: "Sulfuric Acid",
      description: "Industrial grade sulfuric acid. Fundamental chemical for various industrial processes and manufacturing applications.",
      quantity: "3 rail cars"
    },
    {
      id: 7,
      name: "Ethylene Glycol",
      description: "Industrial grade ethylene glycol. Widely used in antifreeze formulations and as a chemical intermediate.",
      quantity: "8 totes"
    },
    {
      id: 8,
      name: "Sodium Carbonate",
      description: "Pure soda ash suitable for various industrial applications. Essential in glass manufacturing and chemical processing.",
      quantity: "50,000 lbs"
    },
    {
      id: 9,
      name: "Acetic Acid",
      description: "Glacial acetic acid for industrial use. Key ingredient in various chemical processes and manufacturing applications.",
      quantity: "12 totes"
    },
    {
      id: 10,
      name: "Hydrogen Peroxide",
      description: "Industrial strength hydrogen peroxide. Essential for bleaching, disinfection, and chemical synthesis.",
      quantity: "5 totes"
    }
  ];
}