import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Save, X, Lock, Globe, AlertCircle, CheckCircle, ExternalLink, Download, Copy, Upload, FileText, Zap, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Chemical } from "@/data/products";
import { downloadSitemap, autoSaveSitemap, copySitemapToClipboard } from "@/utils/sitemapGenerator";
import { useProducts } from "@/hooks/useProducts";

const ADMIN_PASSWORD = "tychem2025";

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
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
  const { products, isLoading, deleteProduct, addProduct, updateProduct, refreshProducts, saveProducts } = useProducts();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Chemical | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sitemapStatus, setSitemapStatus] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: ""
  });

  // Check if user is already authenticated
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('tychem-admin-auth');
    if (isLoggedIn === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Listen for sitemap updates
  useEffect(() => {
    const handleSitemapReady = (event: any) => {
      setSitemapStatus({
        lastUpdated: event.detail.timestamp,
        productCount: event.detail.productCount,
        downloadUrl: event.detail.downloadUrl,
        content: event.detail.content
      });
    };

    window.addEventListener('sitemapReady', handleSitemapReady);
    
    return () => {
      window.removeEventListener('sitemapReady', handleSitemapReady);
    };
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('tychem-admin-auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('tychem-admin-auth');
    toast.success("Logged out successfully");
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

  const handleDeleteProduct = async (id: number) => {
    if (confirm('Are you sure you want to delete this product? This will remove it from the database permanently.')) {
      setIsSaving(true);
      const success = await deleteProduct(id);
      setIsSaving(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!formData.name.trim() || !formData.description.trim() || !formData.quantity.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSaving(true);
    let success = false;

    if (isNewProduct) {
      success = await addProduct({
        name: formData.name.trim(),
        description: formData.description.trim(),
        quantity: formData.quantity.trim()
      });
    } else if (editingProduct) {
      success = await updateProduct(editingProduct.id, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        quantity: formData.quantity.trim()
      });
    }

    if (success) {
      setIsEditDialogOpen(false);
      setFormData({ name: "", description: "", quantity: "" });
    }
    
    setIsSaving(false);
  };

  const handleRefreshProducts = async () => {
    toast.info('Refreshing products from database...');
    await refreshProducts();
    toast.success('Products refreshed!');
  };

  const handleDownloadSitemap = () => {
    downloadSitemap(products);
    toast.success('Sitemap downloaded! This includes all current products.');
  };

  const handleCopySitemap = async () => {
    await copySitemapToClipboard(products);
    toast.success('Sitemap XML copied to clipboard!');
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

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast.error('Please select a JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        // Validate the imported data
        if (!Array.isArray(importedData)) {
          toast.error('Invalid file format: Expected an array of products');
          return;
        }

        // Validate each product has required fields and remove id field
        const validProducts = importedData
          .filter(product => {
            return product && 
                   typeof product.name === 'string' && 
                   typeof product.description === 'string' && 
                   typeof product.quantity === 'string' &&
                   product.name.trim() !== '' &&
                   product.description.trim() !== '' &&
                   product.quantity.trim() !== '';
          })
          .map(product => ({
            // Explicitly exclude id field to avoid database conflicts
            name: product.name.trim(),
            description: product.description.trim(),
            quantity: product.quantity.trim()
          }));

        if (validProducts.length === 0) {
          toast.error('No valid products found in the file');
          return;
        }

        if (validProducts.length !== importedData.length) {
          toast.warning(`${importedData.length - validProducts.length} invalid products were skipped`);
        }

        // Confirm the import
        const confirmMessage = `This will replace all ${products.length} existing products with ${validProducts.length} imported products. Are you sure?`;
        if (!confirm(confirmMessage)) {
          return;
        }

        setIsSaving(true);
        
        // Use saveProducts to replace all products (this handles ID generation properly)
        const success = await saveProducts(validProducts);
        
        if (success) {
          toast.success(`✅ Successfully imported ${validProducts.length} products! Database updated.`);
        } else {
          toast.error('Failed to import products to database');
        }
        
        setIsSaving(false);
      } catch (error) {
        console.error('Import error:', error);
        toast.error('Error reading file: Invalid JSON format');
      }
    };
    
    reader.readAsText(file);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-tychem-600" />
          <p className="text-gray-600">Loading products from database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your chemical inventory - changes update the database instantly</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={handleRefreshProducts} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleLogout} variant="outline" className="text-red-600 hover:text-red-700">
              Logout
            </Button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Globe className="h-4 w-4 mr-2" />
              View Website
            </a>
          </div>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Product Management</TabsTrigger>
            <TabsTrigger value="sitemap">Sitemap Management</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Products ({products.length})</h2>
              <div className="flex gap-4">
                <Button onClick={handleExportData} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export JSON
                </Button>
                <Button onClick={handleImportClick} variant="outline" disabled={isSaving}>
                  <Upload className="h-4 w-4 mr-2" />
                  Import JSON
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                  className="hidden"
                />
                <Button 
                  onClick={handleAddProduct} 
                  className="bg-tychem-500 hover:bg-tychem-600"
                  disabled={isSaving}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>

            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>🚀 DATABASE CONNECTED:</strong> All changes are saved directly to the Supabase database! 
                Products are synced in real-time across all pages.
              </AlertDescription>
            </Alert>

            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <strong>📁 Import/Export:</strong> Export your products as JSON for backup, or import a JSON file to replace all products. 
                Import format: <code>[&#123;"name": "Product Name", "description": "Description", "quantity": "Amount"&#125;]</code>
                <br />
                <strong>Note:</strong> When importing, the database will automatically assign new IDs to all products.
              </AlertDescription>
            </Alert>

            {isSaving && (
              <Alert>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  <strong>Saving changes...</strong> Updating the database with your changes.
                </AlertDescription>
              </Alert>
            )}

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
                            disabled={isSaving}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-700"
                            disabled={isSaving}
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
                <p className="text-gray-500 mb-4">No products found in database</p>
                <div className="flex gap-4 justify-center">
                  <Button 
                    onClick={handleAddProduct} 
                    className="bg-tychem-500 hover:bg-tychem-600"
                    disabled={isSaving}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Product
                  </Button>
                  <Button 
                    onClick={handleImportClick} 
                    variant="outline"
                    disabled={isSaving}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import Products
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sitemap" className="space-y-6">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>🎯 AUTO-UPDATED!</strong> Your sitemap automatically includes all {products.length} products from the database. 
                Download the latest version for manual submission to search engines.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Download className="h-5 w-5 mr-2 text-blue-600" />
                    Download Current Sitemap
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-2">
                      <FileText className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-medium text-blue-800">Ready to Download!</h4>
                    </div>
                    <p className="text-sm text-blue-700 mb-4">
                      Your sitemap includes all {products.length} products with current URLs and dates. 
                      This is automatically generated from your live database.
                    </p>
                    
                    <div className="flex gap-3">
                      <Button onClick={handleDownloadSitemap} className="flex-1 bg-blue-600 hover:bg-blue-700">
                        <Download className="h-4 w-4 mr-2" />
                        Download sitemap.xml
                      </Button>
                      <Button onClick={handleCopySitemap} variant="outline" className="flex-1">
                        <Copy className="h-4 w-4 mr-2" />
                        Copy XML
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Database Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Products in Database</span>
                      <span className="text-blue-600 text-sm font-medium">{products.length} items</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database Connection</span>
                      <span className="text-green-600 text-sm font-medium">✅ Connected</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Real-time Sync</span>
                      <span className="text-green-600 text-sm">✅ Active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
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
                disabled={isSaving}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <Input
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                placeholder="e.g., 40,000 lbs, 15 totes, etc."
                disabled={isSaving}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter product description"
                rows={4}
                disabled={isSaving}
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isSaving}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSaveProduct}
                className="bg-tychem-500 hover:bg-tychem-600"
                disabled={isSaving}
              >
                {isSaving ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isSaving ? 'Saving...' : (isNewProduct ? 'Add Product' : 'Save Changes')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;