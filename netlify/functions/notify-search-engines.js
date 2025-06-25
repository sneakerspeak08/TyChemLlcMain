exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const sitemapUrl = 'https://tychem.net/sitemap.xml';
    const results = [];

    // IndexNow API (Modern approach)
    try {
      const indexNowResponse = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: 'tychem.net',
          key: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', // Replace with your key
          urlList: [sitemapUrl]
        })
      });
      
      results.push({
        service: 'IndexNow',
        status: indexNowResponse.ok ? 'success' : 'failed',
        statusCode: indexNowResponse.status
      });
    } catch (error) {
      results.push({
        service: 'IndexNow',
        status: 'error',
        error: error.message
      });
    }

    // Google Search Console API (if configured)
    try {
      // You would need to set up Google Search Console API credentials
      // This is a placeholder for the actual implementation
      results.push({
        service: 'Google Search Console',
        status: 'not_configured',
        message: 'Set up GSC API for automatic submission'
      });
    } catch (error) {
      results.push({
        service: 'Google Search Console',
        status: 'error',
        error: error.message
      });
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Search engine notifications sent',
        results: results,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to notify search engines',
        details: error.message
      })
    };
  }
};