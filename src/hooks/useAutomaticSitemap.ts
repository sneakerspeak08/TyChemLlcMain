import { useEffect } from 'react';
import { useProducts } from './useProducts';
import { generateSitemap } from '@/utils/sitemapGenerator';

export const useAutomaticSitemap = () => {
  const products = useProducts();

  useEffect(() => {
    if (products.length > 0) {
      // Automatically update sitemap whenever products change
      updateSitemapFile(products);
    }
  }, [products]);

  const updateSitemapFile = async (products: any[]) => {
    try {
      const sitemapContent = generateSitemap(products);
      
      // Method 1: Use Netlify Functions to update the file
      await fetch('/.netlify/functions/update-sitemap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sitemap: sitemapContent,
          timestamp: new Date().toISOString()
        })
      });

      console.log('✅ Sitemap automatically updated!');
      
      // Notify Google Search Console automatically
      await notifySearchEngines();
      
    } catch (error) {
      console.error('Failed to update sitemap:', error);
    }
  };

  const notifySearchEngines = async () => {
    try {
      // Ping Google to reindex the sitemap
      await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent('https://tychem.net/sitemap.xml')}`);
      
      // Ping Bing
      await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent('https://tychem.net/sitemap.xml')}`);
      
      console.log('🔔 Search engines notified of sitemap update');
    } catch (error) {
      console.log('Search engine notification failed (this is normal)');
    }
  };
};