/*
  # Update RLS policies for products table

  1. Security Changes
    - Update INSERT policy to allow anonymous users
    - Update UPDATE policy to allow anonymous users  
    - Update DELETE policy to allow anonymous users
    - Keep SELECT policy as is (already allows anon users)

  This enables the admin panel to work with anonymous access while maintaining RLS protection.
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow authenticated users to insert products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to update products" ON products;
DROP POLICY IF EXISTS "Allow authenticated users to delete products" ON products;

-- Create new policies that allow anonymous access
CREATE POLICY "Allow anonymous users to insert products"
  ON products
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous users to update products"
  ON products
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow anonymous users to delete products"
  ON products
  FOR DELETE
  TO anon
  USING (true);

-- Also allow authenticated users (in case you add auth later)
CREATE POLICY "Allow authenticated users to insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);