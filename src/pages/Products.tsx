import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { OfferDialog } from "@/components/OfferDialog";
import { Chemical } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";
import SEOProductData from "@/components/SEOProductData";

const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const products = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChemical, setSelectedChemical] = useState<Chemical | null>(null);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Set page title and meta description
    document.title = "Chemical Products | Surplus Industrial Chemicals | Tychem LLC";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Browse our inventory of surplus industrial chemicals including sodium hydroxide, citric acid, glycerin, and more. Contact Tychem LLC for pricing and availability.'
      );
    }
  }, []);

  useEffect(() => {
    const selectedChemicalId = location.state?.selectedChemicalId;
    if (selectedChemicalId) {
      const chemical = products.find(c => c.id === selectedChemicalId);
      if (chemical) {
        setSelectedChemical(chemical);
        setIsOfferDialogOpen(true);
        window.history.replaceState({}, document.title);
      }
    }
  }, [location.state, products]);

  const filteredChemicals = products.filter(chemical => {
    const matchesSearch = 
      chemical.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chemical.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleOpenOfferDialog = (e: React.MouseEvent, chemical: Chemical) => {
    e.stopPropagation();
    setSelectedChemical(chemical);
    setIsOfferDialogOpen(true);
  };

  const handleCardClick = (chemical: Chemical) => {
    navigate(`/products/${chemical.name.toLowerCase().replace(/\s+/g, '-')}`);
  };

  const handleContactClick = () => {
    navigate('/', { state: { scrollToSection: 'contact' } });
  };

  return (
    <>
      <SEOProductData />
      <div className="min-h-screen bg-gray-50">
        <Navbar transparent={false} />
        
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Surplus Chemical Products
              </h1>
              <p className="text-lg text-gray-600">
                Browse our current inventory of high-quality surplus industrial chemicals. Contact us for competitive pricing and detailed specifications.
              </p>
            </div>

            <div className="mb-12">
              <div className="flex flex-col gap-6 max-w-4xl mx-auto">
                <div className="flex w-full gap-2">
                  <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <Search className="h-5 w-5" />
                    </div>
                    <Input
                      type="text"
                      placeholder="Search chemicals by name or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 h-12 bg-white border-gray-200"
                      aria-label="Search chemical products"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredChemicals.map((chemical) => (
                <motion.article
                  key={chemical.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  onClick={() => handleCardClick(chemical)}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  itemScope
                  itemType="https://schema.org/Product"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold" itemProp="name">{chemical.name}</h2>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 rounded-lg text-sm font-medium bg-blue-50 text-blue-700" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                        <span itemProp="availability" content="https://schema.org/InStock">{chemical.quantity}</span>
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4" itemProp="description">{chemical.description}</p>
                  
                  <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-100">
                    <Button 
                      variant="outline" 
                      className="text-tychem-600 hover:text-tychem-700"
                      onClick={(e) => handleOpenOfferDialog(e, chemical)}
                      aria-label={`Send offer for ${chemical.name}`}
                    >
                      Send Offer
                    </Button>
                  </div>
                </motion.article>
              ))}
            </div>

            {filteredChemicals.length === 0 && searchTerm && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No chemicals found matching "{searchTerm}"</p>
                <Button onClick={() => setSearchTerm("")} variant="outline">
                  Clear Search
                </Button>
              </div>
            )}

            <div className="text-center mt-12">
              <motion.button
                onClick={handleContactClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 bg-tychem-500 text-white rounded-lg font-medium transition-all duration-300 hover:bg-tychem-600"
                aria-label="Contact us for chemical availability"
              >
                Contact Us for Availability
              </motion.button>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {selectedChemical && (
        <OfferDialog
          isOpen={isOfferDialogOpen}
          onClose={() => setIsOfferDialogOpen(false)}
          productName={selectedChemical.name}
          productCas=""
        />
      )}
    </>
  );
};

export default ProductsPage;