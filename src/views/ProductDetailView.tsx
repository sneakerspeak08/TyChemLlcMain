"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { OfferDialog } from "@/components/OfferDialog";
import type { Chemical } from "@/data/products";

const ProductDetailView = ({ product }: { product: Chemical }) => {
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar transparent={false} />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto mb-6">
            <Button asChild variant="ghost" className="mb-4 text-gray-600 hover:text-gray-900">
              <Link href="/products">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Link>
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
                  <h1 className="text-3xl font-bold">{product.name}</h1>
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
        productCas=""
      />
    </div>
  );
};

export default ProductDetailView;