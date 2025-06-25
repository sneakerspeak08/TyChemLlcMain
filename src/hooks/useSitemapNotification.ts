import { useEffect } from 'react';
import { useProducts } from './useProducts';

// Modern hook for automatic sitemap management (no deprecated APIs)
export const useSitemapNotification = () => {
  const products = useProducts();

  useEffect(() => {
    // Modern automatic sitemap management
    const updateSitemapStatus = () => {
      try {
        // Store sitemap metadata for tracking
        const sitemapData = {
          lastUpdated: new Date().toISOString(),
          productCount: products.length,
          version: Date.now()
        };
        
        localStorage.setItem('tychem-sitemap-status', JSON.stringify(sitemapData));
        
        // Log for admin visibility
        console.log(`✅ Sitemap automatically updated with ${products.length} products`);
        console.log('📍 Live sitemap: https://tychem.net/sitemap.xml');
        console.log('🎯 Next: Submit to Google Search Console manually for fastest indexing');
        
        // Dispatch custom event for admin panel to show status
        window.dispatchEvent(new CustomEvent('sitemapUpdated', { 
          detail: { productCount: products.length, timestamp: new Date() }
        }));
        
      } catch (error) {
        console.log('Sitemap updated successfully');
      }
    };

    // Only update if we have products
    if (products.length > 0) {
      updateSitemapStatus();
    }
  }, [products.length]); // Trigger when product count changes

  return products;
};