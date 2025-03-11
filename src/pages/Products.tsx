import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { OfferDialog } from "@/components/OfferDialog";
import { Chemical, chemicals, categories } from "@/data/products";

const ProductsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedChemical, setSelectedChemical] = useState<Chemical | null>(null);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);

  const filteredChemicals = chemicals.filter(chemical => {
    const matchesSearch = 
      chemical.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chemical.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chemical.cas.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || chemical.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenOfferDialog = (chemical: Chemical) => {
    setSelectedChemical(chemical);
    setIsOfferDialogOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Navbar transparent={false} />
        
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Available Chemicals
              </h1>
              <p className="text-lg text-gray-600">
                Browse our current inventory of surplus chemicals. Contact us for pricing and additional information.
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
                      placeholder="Search by name, CAS number, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 h-12 bg-white border-gray-200"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={!selectedCategory ? "default" : "outline"}
                    onClick={() => setSelectedCategory(null)}
                    className={!selectedCategory ? "bg-tychem-500 hover:bg-tychem-600" : ""}
                  >
                    All Categories
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ? "bg-tychem-500 hover:bg-tychem-600" : ""}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredChemicals.map((chemical) => (
                <motion.div
                  key={chemical.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-tychem-50 text-tychem-700 mb-2">
                        {chemical.category}
                      </span>
                      <h3 className="text-xl font-bold">{chemical.name}</h3>
                      <p className="text-sm text-gray-500">CAS: {chemical.cas}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 rounded-lg text-sm font-medium bg-blue-50 text-blue-700">
                        {chemical.quantity}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{chemical.description}</p>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm">{chemical.location}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      className="text-tychem-600 hover:text-tychem-700"
                      onClick={() => handleOpenOfferDialog(chemical)}
                    >
                      Send Offer
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 bg-tychem-500 text-white rounded-lg font-medium transition-all duration-300 hover:bg-tychem-600"
              >
                Contact Us for Availability
              </motion.a>
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
          productCas={selectedChemical.cas}
        />
      )}
    </>
  );
};

export default ProductsPage;