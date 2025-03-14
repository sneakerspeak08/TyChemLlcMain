import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OfferDialog } from "./OfferDialog";
import { Chemical, chemicals, categories } from "@/data/products";

const ChemicalList = () => {
  const navigate = useNavigate();
  const [selectedChemical, setSelectedChemical] = useState<Chemical | null>(null);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);

  // Get only the last 2 chemicals
  const latestChemicals = chemicals.slice(-2);

  const handleOpenOfferDialog = (e: React.MouseEvent, chemical: Chemical) => {
    e.stopPropagation();
    setSelectedChemical(chemical);
    setIsOfferDialogOpen(true);
  };

  const handleCardClick = (chemical: Chemical) => {
    navigate(`/products/${chemical.cas}`);
  };

  return (
    <>
      <section id="chemicals" className="py-20 md:py-32 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block mb-6 px-3 py-1 rounded-full bg-tychem-50 border border-tychem-100">
              <p className="text-sm font-medium text-tychem-700">Latest Products</p>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Recently Added Chemicals
            </h2>
            <p className="text-lg text-gray-600">
              Check out our latest available chemicals. Visit our products page for our complete inventory.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {latestChemicals.map((chemical) => (
              <motion.div
                key={chemical.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                onClick={() => handleCardClick(chemical)}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
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
                    onClick={(e) => handleOpenOfferDialog(e, chemical)}
                  >
                    Send Offer
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <motion.a
              href="/products"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-8 py-4 bg-tychem-500 text-white rounded-lg font-medium transition-all duration-300 hover:bg-tychem-600"
            >
              View All Products
            </motion.a>
          </div>
        </div>
      </section>

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

export default ChemicalList;