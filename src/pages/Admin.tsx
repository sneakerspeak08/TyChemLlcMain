import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import { Chemical } from "@/data/products";
import { toast } from "sonner";

const AdminPanel = () => {
  const [products, setProducts] = useState<Chemical[]>([]);
  const [editingProduct, setEditingProduct] = useState<Chemical | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simple password protection
  const handleLogin = () => {
    if (password === "tychem2024") { // Change this password!
      setIsAuthenticated(true);
      loadProducts();
    } else {
      toast.error("Invalid password");
    }
  };

  const loadProducts = () => {
    // Load from localStorage or API
    const saved = localStorage.getItem('tychem_products');
    if (saved) {
      setProducts(JSON.parse(saved));
    }
  };

  const saveProducts = (newProducts: Chemical[]) => {
    localStorage.setItem('tychem_products', JSON.stringify(newProducts));
    setProducts(newProducts);
    toast.success("Products saved successfully!");
  };

  const handleAddProduct = () => {
    const newProduct: Chemical = {
      id: Date.now(),
      name: "",
      category: "",
      description: "",
      cas: "",
      quantity: "",
      location: "",
      manufacturer: "",
      purity: "",
      applications: [],
      safetyInfo: {
        hazardClass: "",
        storageTemp: "",
        handling: []
      }
    };
    setEditingProduct(newProduct);
    setIsAddingNew(true);
  };

  const handleSaveProduct = (product: Chemical) => {
    let newProducts;
    if (isAddingNew) {
      newProducts = [...products, product];
    } else {
      newProducts = products.map(p => p.id === product.id ? product : p);
    }
    saveProducts(newProducts);
    setEditingProduct(null);
    setIsAddingNew(false);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      const newProducts = products.filter(p => p.id !== id);
      saveProducts(newProducts);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Product Management</h1>
          <Button onClick={handleAddProduct}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="relative">
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <p className="text-sm text-gray-600">{product.category}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">CAS: {product.cas}</p>
                <p className="text-sm mb-2">Quantity: {product.quantity}</p>
                <p className="text-sm mb-4">Location: {product.location}</p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingProduct(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {editingProduct && (
          <ProductEditModal
            product={editingProduct}
            onSave={handleSaveProduct}
            onCancel={() => {
              setEditingProduct(null);
              setIsAddingNew(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

const ProductEditModal = ({ 
  product, 
  onSave, 
  onCancel 
}: { 
  product: Chemical;
  onSave: (product: Chemical) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState(product);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Edit Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">CAS Number</label>
                <Input
                  value={formData.cas}
                  onChange={(e) => setFormData({...formData, cas: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <Input
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Manufacturer</label>
                <Input
                  value={formData.manufacturer || ''}
                  onChange={(e) => setFormData({...formData, manufacturer: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Save Product
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;