import { useState, useEffect } from 'react';
import { Chemical } from '@/data/products';
import { ProductService } from '@/services/productService';
import { toast } from 'sonner';

export const useProducts = () => {
  const [products, setProducts] = useState<Chemical[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
    
    // Subscribe to real-time updates
    const subscription = ProductService.subscribeToProducts((updatedProducts) => {
      setProducts(updatedProducts);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedProducts = await ProductService.getAllProducts();
      setProducts(loadedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Failed to load products from database');
      toast.error('Failed to load products. Please check your connection.');
      // Fallback to default products
      setProducts(getDefaultProducts());
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (product: Omit<Chemical, 'id'>): Promise<boolean> => {
    try {
      const newProduct = await ProductService.addProduct(product);
      setProducts(prev => [...prev, newProduct]);
      toast.success('✅ Product added globally! Changes are live on the website.');
      return true;
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product. Please try again.');
      return false;
    }
  };

  const updateProduct = async (id: number, updates: Partial<Omit<Chemical, 'id'>>): Promise<boolean> => {
    try {
      const updatedProduct = await ProductService.updateProduct(id, updates);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      toast.success('✅ Product updated globally! Changes are live on the website.');
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product. Please try again.');
      return false;
    }
  };

  const deleteProduct = async (id: number): Promise<boolean> => {
    try {
      await ProductService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('✅ Product deleted globally! Changes are live on the website.');
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product. Please try again.');
      return false;
    }
  };

  const replaceAllProducts = async (newProducts: Omit<Chemical, 'id'>[]): Promise<boolean> => {
    try {
      const replacedProducts = await ProductService.replaceAllProducts(newProducts);
      setProducts(replacedProducts);
      toast.success('✅ Products imported globally! Changes are live on the website.');
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
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    replaceAllProducts,
    refreshProducts: loadProducts 
  };
};