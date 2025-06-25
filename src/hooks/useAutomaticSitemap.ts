import { useEffect } from 'react';
import { useProducts } from './useProducts';
import { toast } from 'sonner';

export const useAutomaticSitemap = () => {
  const products = useProducts();

  useEffect(() => {
    if (products.length > 0) {
      // Automatically update sitemap whenever products change
      updateSitemapAutomatically(products);
    }
  }, [products]);

  const updateSitemapAutomatically = async (products: any[]) => {
    try {
      console.log('🔄 Updating sitemap automatically...');
      
      // Call Netlify function to generate new sitemap
      const response = await fetch('/.netlify/functions/update-sitemap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Sitemap updated automatically!');
        
        // Store the new sitemap content locally for admin panel
        localStorage.setItem('tychem-sitemap-content', result.sitemap);
        localStorage.setItem('tychem-sitemap-updated', result.timestamp);
        
        // Dispatch event for admin panel
        const event = new CustomEvent('sitemapUpdated', {
          detail: {
            timestamp: result.timestamp,
            productCount: result.productCount,
            sitemap: result.sitemap
          }
        });
        window.dispatchEvent(event);
        
        // Show success message only in admin context
        if (window.location.pathname === '/admin') {
          toast.success('🚀 Sitemap updated automatically!');
        }
      }
      
    } catch (error) {
      console.error('Automatic sitemap update failed:', error);
      
      // Only show error in admin context
      if (window.location.pathname === '/admin') {
        toast.error('Automatic sitemap update failed - download manually');
      }
    }
  };

  return { products };
};