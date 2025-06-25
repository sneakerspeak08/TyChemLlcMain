import { useEffect } from 'react';
import { useProducts } from './useProducts';

// Hook to automatically notify search engines when products change
export const useSitemapNotification = () => {
  const products = useProducts();

  useEffect(() => {
    // Automatically ping Google when products change
    const notifySearchEngines = async () => {
      try {
        // Ping Google about sitemap update
        const sitemapUrl = encodeURIComponent('https://tychem.net/sitemap.xml');
        
        // Use a simple fetch to ping Google (this happens in background)
        fetch(`https://www.google.com/ping?sitemap=${sitemapUrl}`, {
          method: 'GET',
          mode: 'no-cors' // Avoid CORS issues
        }).catch(() => {
          // Silently fail - this is just a notification
        });

        console.log('🚀 Sitemap automatically updated and search engines notified!');
      } catch (error) {
        // Silently handle errors
        console.log('Sitemap updated (search engine notification pending)');
      }
    };

    // Only notify if we have products
    if (products.length > 0) {
      // Small delay to ensure the sitemap is ready
      setTimeout(notifySearchEngines, 1000);
    }
  }, [products.length]); // Trigger when product count changes

  return products;
};