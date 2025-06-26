import { useState, useEffect } from 'react';
import { Chemical } from '@/data/products';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export const useProducts = () => {
  const [products, setProducts] = useState<Chemical[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error loading products:', error);
        toast.error('Failed to load products from database');
        return;
      }

      // Ensure products is always an array, even if data is null or undefined
      setProducts(data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const saveProducts = async (newProducts: Chemical[]) => {
    try {
      // First, delete all existing products
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .neq('id', 0); // Delete all rows

      if (deleteError) {
        console.error('Error deleting products:', deleteError);
        toast.error('Failed to clear existing products');
        return false;
      }

      // Then insert all new products
      const { error: insertError } = await supabase
        .from('products')
        .insert(newProducts.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          quantity: product.quantity
        })));

      if (insertError) {
        console.error('Error inserting products:', insertError);
        toast.error('Failed to save products to database');
        return false;
      }

      setProducts(newProducts);
      toast.success('Products saved to database successfully!');
      return true;
    } catch (error) {
      console.error('Error saving products:', error);
      toast.error('Failed to save products');
      return false;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product from database');
        return false;
      }

      // Update local state
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product deleted from database successfully!');
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
      return false;
    }
  };

  const addProduct = async (product: Omit<Chemical, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: product.name,
          description: product.description,
          quantity: product.quantity
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding product:', error);
        toast.error('Failed to add product to database');
        return false;
      }

      if (data) {
        setProducts(prev => [...prev, data]);
        toast.success('Product added to database successfully!');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
      return false;
    }
  };

  const updateProduct = async (id: number, updates: Partial<Chemical>) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: updates.name,
          description: updates.description,
          quantity: updates.quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating product:', error);
        toast.error('Failed to update product in database');
        return false;
      }

      if (data) {
        setProducts(prev => prev.map(p => p.id === id ? data : p));
        toast.success('Product updated in database successfully!');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
      return false;
    }
  };

  return { 
    products, 
    isLoading, 
    saveProducts, 
    deleteProduct,
    addProduct,
    updateProduct,
    refreshProducts: loadProducts 
  };
};