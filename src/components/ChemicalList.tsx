import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { OfferDialog } from "./OfferDialog";
import { Chemical } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";

const ChemicalList = () => {
  const navigate = useNavigate();
  const products = useProducts();
  const [selectedChemical, setSelectedChemical] = useState<Chemical | null>(null);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);

  // Get only the last 2 chemicals
  const latestChemicals = products.slice(-2);

  const handleOpenOfferDialog = (e: React.MouseEvent, chemical: Chemical) => {
    e.stopPropagation();
    setSelectedChemical(chemical);
    setIsOfferDialogOpen(true);
  };

  const handleCardClick = (chemical: Chemical) => {
    navigate(`/products/${chemical.name.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <>
      <section id="chemicals" className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
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
                    <h3 className="text-xl font-bold">{chemical.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-lg text-sm font-medium bg-blue-50 text-blue-700">
                      {chemical.quantity}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{chemical.description}</p>
                
                <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-100">
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
          productCas=""
        />
      )}
    </>
  );
};

export default ChemicalList;