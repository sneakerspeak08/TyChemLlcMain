import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { chemicals } from "@/data/products";
import ProductSchema from "@/components/ProductSchema";
import { OfferDialog } from "@/components/OfferDialog";

const ProductDetail = () => {
  const { cas } = useParams();
  const navigate = useNavigate();
  const product = chemicals.find(c => c.cas === cas);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!product) {
      navigate("/products");
    }
  }, [product, navigate]);

  if (!product) return null;

  // Update meta tags
  useEffect(() => {
    document.title = `${product.name} | Tychem LLC`;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 
      `${product.name} (CAS: ${product.cas}) - ${product.description} Available at Tychem LLC.`
    );
  }, [product]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar transparent={false} />
      <ProductSchema product={product} />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto mb-6">
            <Button
              variant="ghost"
              className="mb-4 text-gray-600 hover:text-gray-900"
              onClick={() => navigate("/products")}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-lg"
          >
            <div className="mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-tychem-50 text-tychem-700">
                    {product.category}
                  </span>
                  <h1 className="text-3xl font-bold mt-2">{product.name}</h1>
                  <p className="text-gray-600 mt-1">CAS: {product.cas}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-lg text-sm font-medium bg-blue-50 text-blue-700">
                    {product.quantity}
                  </span>
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="text-lg text-gray-700">{product.description}</p>

              <div className="flex items-center text-gray-600 mt-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">{product.location}</span>
              </div>

              {product.applications && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Applications</h2>
                  <ul className="list-disc pl-5 space-y-2">
                    {product.applications.map((app, index) => (
                      <li key={index}>{app}</li>
                    ))}
                  </ul>
                </div>
              )}

              {product.safetyInfo && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold mb-4">Safety Information</h2>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <p><strong>Hazard Class:</strong> {product.safetyInfo.hazardClass}</p>
                    <p><strong>Storage Temperature:</strong> {product.safetyInfo.storageTemp}</p>
                    <div className="mt-4">
                      <strong>Handling Instructions:</strong>
                      <ul className="list-disc pl-5 mt-2">
                        {product.safetyInfo.handling?.map((instruction, index) => (
                          <li key={index}>{instruction}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-12 flex justify-center">
                <Button
                  size="lg"
                  className="bg-tychem-500 hover:bg-tychem-600"
                  onClick={() => setIsOfferDialogOpen(true)}
                >
                  Send Offer
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />

      <OfferDialog
        isOpen={isOfferDialogOpen}
        onClose={() => setIsOfferDialogOpen(false)}
        productName={product.name}
        productCas={product.cas}
      />
    </div>
  );
};

export default ProductDetail;