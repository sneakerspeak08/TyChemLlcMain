import { useState, useEffect } from 'react';
import { Chemical } from '@/data/products';
import { ProductService } from '@/services/productService';
import { toast } from 'sonner';

export const useProducts = () => {
  const [products, setProducts] = useState<Chemical[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isSupabaseConnected = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

  useEffect(() => {
    loadProducts();
    
    // Only subscribe to real-time updates if Supabase is connected
    if (isSupabaseConnected) {
      const subscription = ProductService.subscribeToProducts((updatedProducts) => {
        console.log(`🔄 Real-time update: ${updatedProducts.length} products`);
        setProducts(updatedProducts);
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [isSupabaseConnected]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if Supabase environment variables are present
      if (!isSupabaseConnected) {
        console.log('⚠️ Supabase not configured, using default products');
        setProducts(getDefaultProducts());
        return;
      }
      
      // Test connection first
      const isConnected = await ProductService.testConnection();
      if (!isConnected) {
        throw new Error('Database connection failed - check your Supabase configuration');
      }

      // Load products from database
      const loadedProducts = await ProductService.getAllProducts();
      
      // CRITICAL: Always use the database result, even if it's empty
      // Empty array = database is connected but has no products (user deleted them all)
      // This is different from a connection error
      setProducts(loadedProducts);
      
      if (loadedProducts.length === 0) {
        console.log('📭 Database is connected but contains no products');
      } else {
        console.log(`📦 Loaded ${loadedProducts.length} products from database`);
      }
      
    } catch (error) {
      console.error('❌ Error loading products:', error);
      setError('Failed to connect to database. Using default products.');
      
      // Only fall back to default products if Supabase is not configured
      // If Supabase is configured but there's an error, show the error
      if (!isSupabaseConnected) {
        setProducts(getDefaultProducts());
      } else {
        // Show empty state - let user know there's a connection issue
        setProducts([]);
        toast.error('Database connection failed. Please check your Supabase configuration.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (product: Omit<Chemical, 'id'>): Promise<boolean> => {
    if (!isSupabaseConnected) {
      toast.error('Please connect to Supabase to add products to the database.');
      return false;
    }

    try {
      const newProduct = await ProductService.addProduct(product);
      setProducts(prev => [...prev, newProduct]);
      toast.success('✅ Product added to database! Changes are live on the website.');
      return true;
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product. Please try again.');
      return false;
    }
  };

  const updateProduct = async (id: number, updates: Partial<Omit<Chemical, 'id'>>): Promise<boolean> => {
    if (!isSupabaseConnected) {
      toast.error('Please connect to Supabase to update products in the database.');
      return false;
    }

    try {
      const updatedProduct = await ProductService.updateProduct(id, updates);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      toast.success('✅ Product updated in database! Changes are live on the website.');
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product. Please try again.');
      return false;
    }
  };

  const deleteProduct = async (id: number): Promise<boolean> => {
    if (!isSupabaseConnected) {
      toast.error('Please connect to Supabase to delete products from the database.');
      return false;
    }

    try {
      await ProductService.deleteProduct(id);
      
      // Update local state immediately
      setProducts(prev => {
        const newProducts = prev.filter(p => p.id !== id);
        console.log(`🗑️ Product deleted. Remaining products: ${newProducts.length}`);
        return newProducts;
      });
      
      toast.success('✅ Product deleted from database! Changes are live on the website.');
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product. Please try again.');
      return false;
    }
  };

  const replaceAllProducts = async (newProducts: Omit<Chemical, 'id'>[]): Promise<boolean> => {
    if (!isSupabaseConnected) {
      toast.error('Please connect to Supabase to import products to the database.');
      return false;
    }

    try {
      const replacedProducts = await ProductService.replaceAllProducts(newProducts);
      setProducts(replacedProducts);
      toast.success(`✅ ${replacedProducts.length} products imported to database! Changes are live on the website.`);
      return true;
    } catch (error) {
      console.error('Error replacing products:', error);
      toast.error('Failed to import products. Please try again.');
      return false;
    }
  };

  const getDefaultProducts = (): Chemical[] => [
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

  return { 
    products, 
    isLoading, 
    error: isSupabaseConnected ? error : null,
    addProduct,
    updateProduct,
    deleteProduct,
    replaceAllProducts,
    refreshProducts: loadProducts,
    isSupabaseConnected
  };
};