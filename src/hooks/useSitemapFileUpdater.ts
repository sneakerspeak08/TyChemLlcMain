import { useEffect } from 'react';
import { useProducts } from './useProducts';
import { generateSitemap } from '@/utils/sitemapGenerator';

export const useSitemapFileUpdater = () => {
  const products = useProducts();

  useEffect(() => {
    if (products.length > 0) {
      const sitemapContent = generateSitemap(products);
      const timestamp = new Date().toISOString();

      // Store sitemap content and timestamp in localStorage
      localStorage.setItem('tychem-sitemap-content', sitemapContent);
      localStorage.setItem('tychem-sitemap-updated', timestamp);

      // Dispatch a custom event to notify other parts of the app (e.g., Admin page)
      const event = new CustomEvent('sitemapReady', {
        detail: {
          timestamp: timestamp,
          productCount: products.length,
          content: sitemapContent,
          downloadUrl: '/sitemap.xml'
        }
      });
      window.dispatchEvent(event);

      console.log('Sitemap generated and updated in localStorage.');
    }
  }, [products]);
};