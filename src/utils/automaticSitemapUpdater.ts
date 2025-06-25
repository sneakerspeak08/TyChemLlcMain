import { generateSitemap } from './sitemapGenerator';

export class AutomaticSitemapUpdater {
  private static instance: AutomaticSitemapUpdater;
  private updateQueue: any[] = [];
  private isUpdating = false;
  private lastUpdate = 0;
  private readonly UPDATE_THROTTLE = 5000; // 5 seconds

  static getInstance() {
    if (!this.instance) {
      this.instance = new AutomaticSitemapUpdater();
    }
    return this.instance;
  }

  async updateSitemap(products: any[]) {
    // Throttle updates to prevent spam
    const now = Date.now();
    if (now - this.lastUpdate < this.UPDATE_THROTTLE) {
      console.log('Sitemap update throttled');
      return;
    }

    this.lastUpdate = now;
    this.updateQueue.push(products);
    
    if (!this.isUpdating) {
      await this.processQueue();
    }
  }

  private async processQueue() {
    this.isUpdating = true;
    
    while (this.updateQueue.length > 0) {
      const products = this.updateQueue.pop(); // Get latest
      this.updateQueue = []; // Clear queue
      
      try {
        await this.performUpdate(products);
      } catch (error) {
        console.error('Sitemap update failed:', error);
      }
    }
    
    this.isUpdating = false;
  }

  private async performUpdate(products: any[]) {
    const methods = [
      () => this.updateViaNetlifyFunction(products),
      () => this.updateViaWebhook(products),
      () => this.updateViaLocalStorage(products)
    ];

    // Try each method until one succeeds
    for (const method of methods) {
      try {
        await method();
        console.log('✅ Sitemap updated successfully');
        await this.notifySearchEngines();
        return;
      } catch (error) {
        console.log('Method failed, trying next...');
      }
    }
    
    console.log('All update methods failed, using local storage fallback');
    this.updateViaLocalStorage(products);
  }

  private async updateViaNetlifyFunction(products: any[]) {
    const response = await fetch('/.netlify/functions/update-sitemap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ products })
    });
    
    if (!response.ok) {
      throw new Error('Netlify function failed');
    }

    const result = await response.json();
    
    // Store result locally
    localStorage.setItem('tychem-sitemap-content', result.sitemap);
    localStorage.setItem('tychem-sitemap-updated', result.timestamp);
    
    return result;
  }

  private async updateViaWebhook(products: any[]) {
    // Use a webhook service like Zapier, Make.com, or IFTTT
    const webhookUrl = process.env.SITEMAP_WEBHOOK_URL;
    
    if (!webhookUrl) {
      throw new Error('No webhook URL configured');
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_sitemap',
        products: products,
        sitemap: generateSitemap(products),
        timestamp: new Date().toISOString(),
        site: 'tychem.net'
      })
    });

    if (!response.ok) {
      throw new Error('Webhook failed');
    }
  }

  private updateViaLocalStorage(products: any[]) {
    // Fallback: Store in localStorage for manual download
    const sitemap = generateSitemap(products);
    const timestamp = new Date().toISOString();
    
    localStorage.setItem('tychem-sitemap-content', sitemap);
    localStorage.setItem('tychem-sitemap-updated', timestamp);
    
    // Dispatch event for admin panel
    const event = new CustomEvent('sitemapReady', {
      detail: {
        timestamp,
        productCount: products.length,
        content: sitemap,
        downloadUrl: '/sitemap.xml'
      }
    });
    window.dispatchEvent(event);
  }

  private async notifySearchEngines() {
    const sitemapUrl = 'https://tychem.net/sitemap.xml';
    
    // Modern approach: Use IndexNow API
    try {
      await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          host: 'tychem.net',
          key: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', // Replace with your IndexNow key
          urlList: [sitemapUrl]
        })
      });
      console.log('🔔 Search engines notified via IndexNow');
    } catch (error) {
      console.log('IndexNow notification failed');
    }

    // Fallback: Traditional ping (deprecated but still works)
    try {
      await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
      console.log('🔔 Google pinged directly');
    } catch (error) {
      console.log('Google ping failed');
    }
  }
}

// Hook for easy usage
export const useAutomaticSitemapUpdates = () => {
  const updater = AutomaticSitemapUpdater.getInstance();
  return {
    updateSitemap: (products: any[]) => updater.updateSitemap(products)
  };
};