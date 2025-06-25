// Netlify Function to automatically update sitemap.xml
const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { sitemap, timestamp } = JSON.parse(event.body);
    
    // Write the new sitemap to the public directory
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    await fs.writeFile(sitemapPath, sitemap, 'utf8');
    
    // Also update a backup with timestamp
    const backupPath = path.join(process.cwd(), 'public', `sitemap-backup-${Date.now()}.xml`);
    await fs.writeFile(backupPath, sitemap, 'utf8');
    
    console.log(`✅ Sitemap updated at ${timestamp}`);
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Sitemap updated successfully',
        timestamp 
      })
    };
  } catch (error) {
    console.error('Error updating sitemap:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to update sitemap',
        details: error.message 
      })
    };
  }
};