// Product management utility for persistent storage
import { Chemical } from '@/data/products';
import { toast } from 'sonner';

export class ProductManager {
  private static instance: ProductManager;
  private readonly STORAGE_KEY = 'tychem-products';
  private readonly API_ENDPOINT = '/.netlify/functions/manage-products';

  static getInstance() {
    if (!this.instance) {
      this.instance = new ProductManager();
    }
    return this.instance;
  }

  // Get products from multiple sources
  async getProducts(): Promise<Chemical[]> {
    try {
      // Try to get from server first
      const serverProducts = await this.getFromServer();
      if (serverProducts && serverProducts.length > 0) {
        // Update local storage with server data
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(serverProducts));
        return serverProducts;
      }
    } catch (error) {
      console.log('Server fetch failed, using local storage');
    }

    // Fallback to localStorage
    const localProducts = this.getFromLocalStorage();
    if (localProducts.length > 0) {
      return localProducts;
    }

    // Final fallback to default products
    return this.getDefaultProducts();
  }

  // Save products to both local and server
  async saveProducts(products: Chemical[]): Promise<boolean> {
    try {
      // Save locally first
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(products));

      // Try to save to server
      await this.saveToServer(products);
      
      // Trigger sitemap update
      this.triggerSitemapUpdate(products);
      
      return true;
    } catch (error) {
      console.error('Failed to save products:', error);
      toast.error('Failed to save changes globally. Changes saved locally only.');
      return false;
    }
  }

  private getFromLocalStorage(): Chemical[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  private async getFromServer(): Promise<Chemical[]> {
    const response = await fetch(`${this.API_ENDPOINT}?action=get`);
    if (!response.ok) {
      throw new Error('Server fetch failed');
    }
    const data = await response.json();
    return data.products || [];
  }

  private async saveToServer(products: Chemical[]): Promise<void> {
    const response = await fetch(this.API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'save',
        products: products,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error('Server save failed');
    }
  }

  private triggerSitemapUpdate(products: Chemical[]) {
    // Trigger sitemap regeneration
    fetch('/.netlify/functions/update-sitemap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ products })
    }).catch(error => {
      console.log('Sitemap update failed:', error);
    });
  }

  private getDefaultProducts(): Chemical[] {
    return [
      {
        id: 1,
        name: "Sodium Hydroxide",
        description: "Caustic soda in pellet form, technical grade. Widely used in various industrial processes including chemical manufacturing, paper production, and water treatment.",
        quantity: "40,000 lbs"
      },
      {
        id: 2,
        name: "Citric Acid",
        description: "Anhydrous, food grade citric acid. Essential ingredient in food and beverage manufacturing, pharmaceutical formulations, and cleaning products.",
        quantity: "15,000 kgs"
      },
      {
        id: 3,
        name: "Glycerin",
        description: "USP grade, 99.7% pure glycerin. Versatile ingredient used in pharmaceutical, personal care, and food applications. Known for its humectant properties.",
        quantity: "4 totes"
      },
      {
        id: 4,
        name: "Potassium Chloride",
        description: "High purity potassium chloride suitable for various industrial applications including fertilizers, pharmaceuticals, and food processing.",
        quantity: "25,000 kgs"
      },
      {
        id: 5,
        name: "Methanol",
        description: "Technical grade methanol for industrial use. Essential solvent for various chemical processes and manufacturing applications.",
        quantity: "6 tankers"
      },
      {
        id: 6,
        name: "Sulfuric Acid",
        description: "Industrial grade sulfuric acid. Fundamental chemical for various industrial processes and manufacturing applications.",
        quantity: "3 rail cars"
      },
      {
        id: 7,
        name: "Ethylene Glycol",
        description: "Industrial grade ethylene glycol. Widely used in antifreeze formulations and as a chemical intermediate.",
        quantity: "8 totes"
      },
      {
        id: 8,
        name: "Sodium Carbonate",
        description: "Pure soda ash suitable for various industrial applications. Essential in glass manufacturing and chemical processing.",
        quantity: "50,000 lbs"
      },
      {
        id: 9,
        name: "Acetic Acid",
        description: "Glacial acetic acid for industrial use. Key ingredient in various chemical processes and manufacturing applications.",
        quantity: "12 totes"
      },
      {
        id: 10,
        name: "Hydrogen Peroxide",
        description: "Industrial strength hydrogen peroxide. Essential for bleaching, disinfection, and chemical synthesis.",
        quantity: "5 totes"
      }
    ];
  }
}