import { useState, useEffect } from "react";
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
  const { products, isLoading, saveProducts, refreshProducts } = useProducts();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Chemical | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [sitemapStatus, setSitemapStatus] = useState<any>(null);
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
    if (confirm('Are you sure you want to delete this product? This will update the live website.')) {
      setIsSaving(true);
      const updatedProducts = products.filter(p => p.id !== id);
      const success = await saveProducts(updatedProducts);
      
      if (success) {
        toast.success('✅ Product deleted globally! Changes are live on the website.');
      } else {
        toast.error('Failed to delete product globally. Please try again.');
      }
      setIsSaving(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!formData.name.trim() || !formData.description.trim() || !formData.quantity.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSaving(true);
    let updatedProducts: Chemical[];

    if (isNewProduct) {
      const newId = Math.max(...products.map(p => p.id), 0) + 1;
      const newProduct: Chemical = {
        id: newId,
        name: formData.name.trim(),
        description: formData.description.trim(),
        quantity: formData.quantity.trim()
      };
      updatedProducts = [...products, newProduct];
    } else if (editingProduct) {
      updatedProducts = products.map(p => 
        p.id === editingProduct.id 
          ? { ...p, name: formData.name.trim(), description: formData.description.trim(), quantity: formData.quantity.trim() }
          : p
      );
    } else {
      setIsSaving(false);
      return;
    }

    const success = await saveProducts(updatedProducts);
    
    if (success) {
      toast.success(
        isNewProduct 
          ? '✅ Product added globally! Changes are live on the website.' 
          : '✅ Product updated globally! Changes are live on the website.'
      );
      setIsEditDialogOpen(false);
      setFormData({ name: "", description: "", quantity: "" });
    } else {
      toast.error('Failed to save product globally. Please try again.');
    }
    
    setIsSaving(false);
  };

  const handleRefreshProducts = async () => {
    toast.info('Refreshing products from server...');
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

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedProducts = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedProducts)) {
          setIsSaving(true);
          const success = await saveProducts(importedProducts);
          
          if (success) {
            toast.success('✅ Products imported globally! Changes are live on the website.');
          } else {
            toast.error('Failed to import products globally.');
          }
          setIsSaving(false);
        } else {
          toast.error('Invalid file format');
        }
      } catch (error) {
        toast.error('Error reading file');
      }
    };
    reader.readAsText(file);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-tychem-600" />
          <p className="text-gray-600">Loading products...</p>
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
            <p className="text-gray-600 mt-1">Manage your chemical inventory - changes update the live website instantly</p>
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
                <strong>🚀 LIVE UPDATES:</strong> All changes you make here instantly update the live website! 
                Products are automatically synced across all pages and the sitemap is regenerated.
              </AlertDescription>
            </Alert>

            {isSaving && (
              <Alert>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  <strong>Saving changes...</strong> Updating the live website with your changes.
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
                <p className="text-gray-500 mb-4">No products found</p>
                <Button 
                  onClick={handleAddProduct} 
                  className="bg-tychem-500 hover:bg-tychem-600"
                  disabled={isSaving}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Product
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="sitemap" className="space-y-6">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>🎯 AUTO-UPDATED!</strong> Your sitemap automatically includes all {products.length} products. 
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
                      This is automatically generated from your live product data.
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
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 text-green-800">📋 Submit to Search Engines:</h4>
                    <ol className="text-sm text-green-700 space-y-1">
                      <li>1. Download the sitemap above</li>
                      <li>2. Go to Google Search Console</li>
                      <li>3. Submit: https://tychem.net/sitemap.xml</li>
                      <li>4. Repeat for Bing Webmaster Tools</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Sitemap Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Products Included</span>
                      <span className="text-blue-600 text-sm font-medium">{products.length} items</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-Generated</span>
                      <span className="text-green-600 text-sm font-medium">✅ Live Data</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">URLs Generated</span>
                      <span className="text-green-600 text-sm">{products.length + 2} total</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SEO Optimized</span>
                      <span className="text-green-600 text-sm">✅ Ready</span>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Sitemap Includes:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>✅ Homepage (priority 1.0)</li>
                      <li>✅ Products page (priority 0.9)</li>
                      <li>✅ All {products.length} product pages (priority 0.8)</li>
                      <li>✅ Current dates and change frequencies</li>
                      <li>✅ SEO-optimized URLs</li>
                    </ul>
                  </div>

                  <div className="text-xs text-gray-500">
                    <strong>Sample URLs in your sitemap:</strong>
                    <ul className="mt-1 space-y-1 max-h-32 overflow-y-auto">
                      <li>• https://tychem.net/</li>
                      <li>• https://tychem.net/products</li>
                      {products.slice(0, 3).map(product => (
                        <li key={product.id}>• https://tychem.net/products/{product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}</li>
                      ))}
                      {products.length > 3 && <li>• ... and {products.length - 3} more product pages</li>}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Search Engine Submission</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <code className="text-sm text-gray-700">https://tychem.net/sitemap.xml</code>
                    <Button 
                      onClick={() => window.open('https://search.google.com/search-console', '_blank')} 
                      size="sm" 
                      variant="outline"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Search Console
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  📍 Submit this URL to Google Search Console and Bing Webmaster Tools. 
                  Your sitemap automatically updates when you change products!
                </p>
              </CardContent>
            </Card>
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