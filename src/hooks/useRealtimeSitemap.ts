import { useEffect } from 'react';
import { useProducts } from './useProducts';
import { generateSitemap } from '@/utils/sitemapGenerator';

export const useRealtimeSitemap = () => {
  const products = useProducts();

  useEffect(() => {
    if (products.length > 0) {
      // Update sitemap in real-time
      updateSitemapRealtime(products);
    }
  }, [products]);

  const updateSitemapRealtime = async (products: any[]) => {
    try {
      // Method 1: Use Netlify Functions
      await updateViaNetlifyFunction(products);
      
      // Method 2: Use Build Hooks as fallback
      await triggerNetlifyRebuild();
      
      console.log('🚀 Real-time sitemap update completed!');
      
    } catch (error) {
      console.error('Real-time sitemap update failed:', error);
      
      // Fallback: Generate locally for admin download
      const sitemapContent = generateSitemap(products);
      localStorage.setItem('tychem-sitemap-content', sitemapContent);
      localStorage.setItem('tychem-sitemap-updated', new Date().toISOString());
    }
  };

  const updateViaNetlifyFunction = async (products: any[]) => {
    const response = await fetch('/.netlify/functions/update-sitemap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ products })
    });
    
    if (!response.ok) {
      throw new Error('Netlify function update failed');
    }
    
    return response.json();
  };

  const triggerNetlifyRebuild = async () => {
    // You can set up a build hook in Netlify dashboard
    // and trigger it here for automatic rebuilds
    try {
      const buildHookUrl = process.env.NETLIFY_BUILD_HOOK_URL;
      if (buildHookUrl) {
        await fetch(buildHookUrl, { method: 'POST' });
        console.log('Build hook triggered');
      }
    } catch (error) {
      console.log('Build hook trigger failed');
    }
  };

  return products;
};