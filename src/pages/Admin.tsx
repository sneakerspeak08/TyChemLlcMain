import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Save, X, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Chemical } from "@/data/products";

const ADMIN_PASSWORD = "tychem2025"; // Change this to your desired password

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate a small delay for security
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        onLogin();
        toast.success("Welcome to admin panel");
      } else {
        toast.error("Invalid password");
        setPassword("");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="bg-tychem-50 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Lock className="h-8 w-8 text-tychem-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
          <p className="text-gray-600 mt-2">Enter password to access the admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-tychem-500 hover:bg-tychem-600"
          >
            {isLoading ? "Verifying..." : "Access Admin Panel"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-tychem-600 hover:text-tychem-700 transition-colors"
          >
            ← Back to Website
          </a>
        </div>
      </motion.div>
    </div>
  );
};

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<Chemical[]>([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Chemical | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: ""
  });

  // Check if user is already authenticated (session storage)
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('tychem-admin-auth');
    if (isLoggedIn === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load products from localStorage on component mount
  useEffect(() => {
    if (!isAuthenticated) return;

    const savedProducts = localStorage.getItem('tychem-products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Initialize with default products if none exist
      const defaultProducts: Chemical[] = [
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
        }
      ];
      setProducts(defaultProducts);
      localStorage.setItem('tychem-products', JSON.stringify(defaultProducts));
    }
  }, [isAuthenticated]);

  // Save products to localStorage whenever products change
  useEffect(() => {
    if (products.length > 0 && isAuthenticated) {
      localStorage.setItem('tychem-products', JSON.stringify(products));
      // Also update the products.ts file content for persistence
      updateProductsFile(products);
    }
  }, [products, isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('tychem-admin-auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('tychem-admin-auth');
    toast.success("Logged out successfully");
  };

  const updateProductsFile = (updatedProducts: Chemical[]) => {
    // This would ideally update the actual file, but for now we'll use localStorage
    // In a real implementation, this would make an API call to update the file
    console.log('Products updated:', updatedProducts);
  };

  const handleAddProduct = () => {
    setIsNewProduct(true);
    setEditingProduct(null);
    setFormData({ name: "", description: "", quantity: "" });
    setIsEditDialogOpen(true);
  };

  const handleEditProduct = (product: Chemical) => {
    setIsNewProduct(false);
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      quantity: product.quantity
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('Product deleted successfully');
    }
  };

  const handleSaveProduct = () => {
    if (!formData.name.trim() || !formData.description.trim() || !formData.quantity.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (isNewProduct) {
      const newId = Math.max(...products.map(p => p.id), 0) + 1;
      const newProduct: Chemical = {
        id: newId,
        name: formData.name.trim(),
        description: formData.description.trim(),
        quantity: formData.quantity.trim()
      };
      setProducts(prev => [...prev, newProduct]);
      toast.success('Product added successfully');
    } else if (editingProduct) {
      setProducts(prev => prev.map(p => 
        p.id === editingProduct.id 
          ? { ...p, name: formData.name.trim(), description: formData.description.trim(), quantity: formData.quantity.trim() }
          : p
      ));
      toast.success('Product updated successfully');
    }

    setIsEditDialogOpen(false);
    setFormData({ name: "", description: "", quantity: "" });
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tychem-products.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Products exported successfully');
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedProducts = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedProducts)) {
          setProducts(importedProducts);
          toast.success('Products imported successfully');
        } else {
          toast.error('Invalid file format');
        }
      } catch (error) {
        toast.error('Error reading file');
      }
    };
    reader.readAsText(file);
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Product Management</h1>
            <p className="text-gray-600 mt-1">Manage your chemical inventory</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={handleLogout} variant="outline" className="text-red-600 hover:text-red-700">
              Logout
            </Button>
            <Button onClick={handleExportData} variant="outline">
              Export Data
            </Button>
            <label className="cursor-pointer">
              <Button variant="outline" asChild>
                <span>Import Data</span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
            <Button onClick={handleAddProduct} className="bg-tychem-500 hover:bg-tychem-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border"
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    {product.quantity}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {product.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No products found</p>
            <Button onClick={handleAddProduct} className="bg-tychem-500 hover:bg-tychem-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isNewProduct ? 'Add New Product' : 'Edit Product'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Product Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <Input
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="e.g., 40,000 lbs, 15 totes, etc."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter product description"
                rows={4}
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSaveProduct}
                className="bg-tychem-500 hover:bg-tychem-600"
              >
                <Save className="h-4 w-4 mr-2" />
                {isNewProduct ? 'Add Product' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;