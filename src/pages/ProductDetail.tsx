import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { OfferDialog } from "@/components/OfferDialog";
import { useProducts } from "@/hooks/useProducts";
import { findProductBySlug, productPath } from "@/lib/productUrl";
import { usePageMeta } from "@/lib/seo";
import NotFound from "@/pages/NotFound";

const ProductDetail = () => {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const { products, isLoading } = useProducts();
  const product = findProductBySlug(products, slug);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // An old or out-of-date address: move to the product's permanent one.
  useEffect(() => {
    if (product && productPath(product) !== `/products/${slug}`) {
      navigate(productPath(product), { replace: true });
    }
  }, [product, slug, navigate]);

  usePageMeta(
    product
      ? {
          title: `${product.name} | Surplus Chemical | Tychem LLC`,
          description: productDescription(product.name, product.quantity, product.description),
          path: productPath(product),
        }
      : { title: "Page not found | Tychem LLC", description: "This product is no longer listed.", noindex: true }
  );

  if (!product && !isLoading) {
    return <NotFound />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar transparent={false} />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <p className="text-lg text-gray-600">Loading product...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar transparent={false} />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto mb-6">
            <Button asChild variant="ghost" className="mb-4 text-gray-600 hover:text-gray-900">
              <Link to="/products">
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

// Search results show about 155 characters; lead with what a buyer searches for.
// Keep in step with productDescription in scripts/prerender.mjs.
const productDescription = (name: string, quantity: string, description: string) => {
  const text = `${name}, ${quantity} available as surplus from Tychem LLC. ${description}`.replace(/\s+/g, " ").trim();
  return text.length > 155 ? `${text.slice(0, 152).trimEnd()}...` : text;
};

export default ProductDetail;