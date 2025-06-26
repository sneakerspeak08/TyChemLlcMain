/*
  # Create products table for Tychem LLC

  1. New Tables
    - `products`
      - `id` (bigint, primary key, auto-increment)
      - `name` (text, not null)
      - `description` (text, not null)
      - `quantity` (text, not null)
      - `created_at` (timestamp with timezone, default now())
      - `updated_at` (timestamp with timezone, default now())

  2. Security
    - Enable RLS on `products` table
    - Add policies for public read access (since this is a public website)
    - Add policies for authenticated admin access for write operations
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  description text NOT NULL,
  quantity text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for website visitors)
CREATE POLICY "Allow public read access to products"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow authenticated users to insert products (for admin)
CREATE POLICY "Allow authenticated users to insert products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update products (for admin)
CREATE POLICY "Allow authenticated users to update products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to delete products (for admin)
CREATE POLICY "Allow authenticated users to delete products"
  ON products
  FOR DELETE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default products
INSERT INTO products (name, description, quantity) VALUES
  ('Sodium Hydroxide', 'Caustic soda in pellet form, technical grade. Widely used in various industrial processes including chemical manufacturing, paper production, and water treatment.', '40,000 lbs'),
  ('Citric Acid', 'Anhydrous, food grade citric acid. Essential ingredient in food and beverage manufacturing, pharmaceutical formulations, and cleaning products.', '15,000 kgs'),
  ('Glycerin', 'USP grade, 99.7% pure glycerin. Versatile ingredient used in pharmaceutical, personal care, and food applications. Known for its humectant properties.', '4 totes'),
  ('Potassium Chloride', 'High purity potassium chloride suitable for various industrial applications including fertilizers, pharmaceuticals, and food processing.', '25,000 kgs'),
  ('Methanol', 'Technical grade methanol for industrial use. Essential solvent for various chemical processes and manufacturing applications.', '6 tankers'),
  ('Sulfuric Acid', 'Industrial grade sulfuric acid. Fundamental chemical for various industrial processes and manufacturing applications.', '3 rail cars'),
  ('Ethylene Glycol', 'Industrial grade ethylene glycol. Widely used in antifreeze formulations and as a chemical intermediate.', '8 totes'),
  ('Sodium Carbonate', 'Pure soda ash suitable for various industrial applications. Essential in glass manufacturing and chemical processing.', '50,000 lbs'),
  ('Acetic Acid', 'Glacial acetic acid for industrial use. Key ingredient in various chemical processes and manufacturing applications.', '12 totes'),
  ('Hydrogen Peroxide', 'Industrial strength hydrogen peroxide. Essential for bleaching, disinfection, and chemical synthesis.', '5 totes')
ON CONFLICT DO NOTHING;