import { supabase, type Product, type ProductInsert, type ProductUpdate } from '@/lib/supabase'
import { Chemical } from '@/data/products'

export class ProductService {
  // Get all products from Supabase
  static async getAllProducts(): Promise<Chemical[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching products:', error)
        throw error
      }

      // Convert Supabase products to Chemical interface
      return data.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        quantity: product.quantity
      }))
    } catch (error) {
      console.error('Failed to fetch products from database:', error)
      throw error
    }
  }

  // Add a new product
  static async addProduct(product: Omit<Chemical, 'id'>): Promise<Chemical> {
    try {
      const productInsert: ProductInsert = {
        name: product.name,
        description: product.description,
        quantity: product.quantity
      }

      const { data, error } = await supabase
        .from('products')
        .insert(productInsert)
        .select()
        .single()

      if (error) {
        console.error('Error adding product:', error)
        throw error
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        quantity: data.quantity
      }
    } catch (error) {
      console.error('Failed to add product to database:', error)
      throw error
    }
  }

  // Update an existing product
  static async updateProduct(id: number, updates: Partial<Omit<Chemical, 'id'>>): Promise<Chemical> {
    try {
      const productUpdate: ProductUpdate = {
        ...(updates.name && { name: updates.name }),
        ...(updates.description && { description: updates.description }),
        ...(updates.quantity && { quantity: updates.quantity })
      }

      const { data, error } = await supabase
        .from('products')
        .update(productUpdate)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating product:', error)
        throw error
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        quantity: data.quantity
      }
    } catch (error) {
      console.error('Failed to update product in database:', error)
      throw error
    }
  }

  // Delete a product
  static async deleteProduct(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting product:', error)
        throw error
      }
    } catch (error) {
      console.error('Failed to delete product from database:', error)
      throw error
    }
  }

  // Replace all products (for bulk import)
  static async replaceAllProducts(products: Omit<Chemical, 'id'>[]): Promise<Chemical[]> {
    try {
      // First, delete all existing products
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .neq('id', 0) // Delete all rows

      if (deleteError) {
        console.error('Error clearing products:', deleteError)
        throw deleteError
      }

      // Then insert new products
      const productsInsert: ProductInsert[] = products.map(product => ({
        name: product.name,
        description: product.description,
        quantity: product.quantity
      }))

      const { data, error } = await supabase
        .from('products')
        .insert(productsInsert)
        .select()

      if (error) {
        console.error('Error inserting products:', error)
        throw error
      }

      return data.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        quantity: product.quantity
      }))
    } catch (error) {
      console.error('Failed to replace products in database:', error)
      throw error
    }
  }

  // Subscribe to real-time changes
  static subscribeToProducts(callback: (products: Chemical[]) => void) {
    const subscription = supabase
      .channel('products_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        async () => {
          // Fetch updated products when any change occurs
          try {
            const products = await this.getAllProducts()
            callback(products)
          } catch (error) {
            console.error('Error fetching updated products:', error)
          }
        }
      )
      .subscribe()

    return subscription
  }
}