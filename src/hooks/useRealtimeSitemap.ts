import { useEffect } from 'react';
import { useProducts } from './useProducts';
import { toast } from 'sonner';

export const useRealtimeSitemap = () => {
  const products = useProducts();

  useEffect(() => {
    if (products.length > 0) {
      // Automatically trigger sitemap update
      updateSitemapRealtime(products);
    }
  }, [products]);

  const updateSitemapRealtime = async (products: any[]) => {
    try {
      // Generate new sitemap content
      const sitemapContent = generateSitemapXML(products);
      
      // Method 1: Use GitHub API to update the file directly
      await updateViaGitHub(sitemapContent);
      
      // Method 2: Use Netlify Build Hooks to trigger rebuild
      await triggerNetlifyRebuild();
      
      toast.success('🚀 Sitemap updated automatically!');
      
    } catch (error) {
      console.error('Sitemap update failed:', error);
      toast.error('Sitemap update failed - please download manually');
    }
  };

  const updateViaGitHub = async (content: string) => {
    // If your site is connected to GitHub, you can use GitHub API
    const response = await fetch('https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/contents/public/sitemap.xml', {
      method: 'PUT',
      headers: {
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Auto-update sitemap with new products',
        content: btoa(content), // Base64 encode
        sha: await getCurrentFileSHA() // Get current file SHA
      })
    });
    
    return response.json();
  };

  const triggerNetlifyRebuild = async () => {
    // Trigger Netlify build hook to rebuild site with new sitemap
    await fetch('https://api.netlify.com/build_hooks/YOUR_BUILD_HOOK_ID', {
      method: 'POST'
    });
  };

  const generateSitemapXML = (products: any[]) => {
    const baseUrl = 'https://tychem.net';
    const currentDate = new Date().toISOString().split('T')[0];
    
    const urls = [
      { loc: `${baseUrl}/`, priority: '1.0' },
      { loc: `${baseUrl}/products`, priority: '0.9' },
      ...products.map(p => ({
        loc: `${baseUrl}/products/${p.name.toLowerCase().replace(/\s+/g, '-')}`,
        priority: '0.8'
      }))
    ];

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  };
};