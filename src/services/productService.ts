import { supabase, type Product, type ProductInsert, type ProductUpdate } from '@/lib/supabase'
import { Chemical } from '@/data/products'

export class ProductService {
  // Get all products from Supabase
  static async getAllProducts(): Promise<Chemical[]> {
    try {
      // First test if we can connect to Supabase
      const isConnected = await this.testConnection()
      if (!isConnected) {
        throw new Error('Supabase connection failed')
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching products:', error)
        throw error
      }

      // IMPORTANT: Always return the actual database data, even if it's an empty array
      // An empty array means the database is connected but has no products
      // This is different from a connection error
      const products = (data || []).map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        quantity: product.quantity
      }))

      console.log(`✅ Successfully loaded ${products.length} products from Supabase database`)
      return products
    } catch (error) {
      console.error('❌ Failed to fetch products from database:', error)
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

      console.log(`✅ Successfully added product: ${data.name}`)
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        quantity: data.quantity
      }
    } catch (error) {
      console.error('❌ Failed to add product to database:', error)
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

      console.log(`✅ Successfully updated product: ${data.name}`)
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        quantity: data.quantity
      }
    } catch (error) {
      console.error('❌ Failed to update product in database:', error)
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

      console.log(`✅ Successfully deleted product with id: ${id}`)
    } catch (error) {
      console.error('❌ Failed to delete product from database:', error)
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

      console.log('✅ Successfully cleared all existing products')

      // If no products to insert, return empty array
      if (products.length === 0) {
        console.log('✅ No products to import, database is now empty')
        return []
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

      const result = data.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        quantity: product.quantity
      }))

      console.log(`✅ Successfully imported ${result.length} products`)
      return result
    } catch (error) {
      console.error('❌ Failed to replace products in database:', error)
      throw error
    }
  }

  // Check if Supabase is properly connected and accessible
  static async testConnection(): Promise<boolean> {
    try {
      // Check if environment variables are present
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseAnonKey) {
        console.log('❌ Supabase environment variables not found')
        return false
      }

      // Try a simple query to test the connection
      const { error } = await supabase
        .from('products')
        .select('count', { count: 'exact', head: true })

      if (error) {
        console.error('❌ Supabase connection test failed:', error)
        return false
      }

      console.log('✅ Supabase connection test successful')
      return true
    } catch (error) {
      console.error('❌ Supabase connection test failed:', error)
      return false
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
            console.log('🔄 Real-time update detected, fetching latest products...')
            const products = await this.getAllProducts()
            callback(products)
          } catch (error) {
            console.error('❌ Error fetching updated products:', error)
          }
        }
      )
      .subscribe()

    console.log('🔄 Subscribed to real-time product updates')
    return subscription
  }
}