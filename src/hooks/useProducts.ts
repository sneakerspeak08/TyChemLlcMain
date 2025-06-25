import { useState, useEffect } from 'react';
import { Chemical } from '@/data/products';
import { ProductManager } from '@/utils/productManager';

export const useProducts = () => {
  const [products, setProducts] = useState<Chemical[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const productManager = ProductManager.getInstance();
      const loadedProducts = await productManager.getProducts();
      setProducts(loadedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      // Fallback to default products
      setProducts(getDefaultProducts());
    } finally {
      setIsLoading(false);
    }
  };

  const saveProducts = async (newProducts: Chemical[]) => {
    try {
      const productManager = ProductManager.getInstance();
      const success = await productManager.saveProducts(newProducts);
      if (success) {
        setProducts(newProducts);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving products:', error);
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

  return { products, isLoading, saveProducts, refreshProducts: loadProducts };
};