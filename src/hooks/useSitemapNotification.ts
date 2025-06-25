import { useEffect } from 'react';
import { useProducts } from './useProducts';

// Simple hook that just tracks when products change
export const useSitemapNotification = () => {
  const products = useProducts();

  useEffect(() => {
    // Just log that products changed - the admin panel handles sitemap generation
    if (products.length > 0) {
      console.log(`✅ Products updated: ${products.length} items available`);
      console.log('📥 Download updated sitemap from admin panel: /admin');
    }
  }, [products.length]);

  return products;
};