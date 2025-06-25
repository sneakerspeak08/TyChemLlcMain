import { useState, useEffect } from 'react';
import { fetchProductsFromSheets } from '@/lib/sheets';
import { chemicals as fallbackProducts } from '@/data/products';

export const useProducts = () => {
  const [products, setProducts] = useState(fallbackProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const sheetProducts = await fetchProductsFromSheets();
        
        if (sheetProducts.length > 0) {
          setProducts(sheetProducts);
        } else {
          // Fallback to static data
          setProducts(fallbackProducts);
        }
      } catch (err) {
        setError('Failed to load products');
        setProducts(fallbackProducts); // Fallback
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return { products, loading, error };
};