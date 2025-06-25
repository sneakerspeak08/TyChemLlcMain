export class SitemapNotifier {
  private static instance: SitemapNotifier;

  static getInstance() {
    if (!this.instance) {
      this.instance = new SitemapNotifier();
    }
    return this.instance;
  }

  async notifyAllSearchEngines() {
    try {
      // Use our Netlify function to notify search engines
      const response = await fetch('/.netlify/functions/notify-search-engines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const result = await response.json();
        console.log('🔔 Search engines notified:', result);
        return result;
      } else {
        throw new Error('Notification service failed');
      }
    } catch (error) {
      console.error('Failed to notify search engines:', error);
      
      // Fallback: Direct notifications
      await this.fallbackNotifications();
    }
  }

  private async fallbackNotifications() {
    const sitemapUrl = 'https://tychem.net/sitemap.xml';
    
    // Google (deprecated but still works)
    try {
      await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
      console.log('Google pinged directly');
    } catch (error) {
      console.log('Google ping failed');
    }

    // Bing
    try {
      await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`);
      console.log('Bing pinged directly');
    } catch (error) {
      console.log('Bing ping failed');
    }
  }

  async submitToGoogleSearchConsole(sitemapUrl: string) {
    // This would require Google Search Console API setup
    // For now, we'll just log the instruction
    console.log(`📋 Manual step: Submit ${sitemapUrl} to Google Search Console`);
    console.log('🔗 https://search.google.com/search-console');
  }
}