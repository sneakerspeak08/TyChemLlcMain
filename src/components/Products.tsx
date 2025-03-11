
import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  features: string[];
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "TyClean Pro",
    category: "Industrial Cleaners",
    description: "Advanced industrial cleaning solutions with powerful degreasing properties for machinery and equipment maintenance.",
    features: [
      "Removes stubborn contaminants and residues",
      "Non-corrosive to equipment surfaces",
      "Biodegradable formulation",
      "Concentrated for cost-efficiency"
    ],
    image: "public/lovable-uploads/07b90b5f-e9de-448c-b375-6ba53ef3aae5.png"
  },
  {
    id: 2,
    name: "TyBond Ultra",
    category: "Adhesives & Sealants",
    description: "High-performance industrial adhesive systems designed for maximum bonding strength in challenging environments.",
    features: [
      "Exceptional bonding strength",
      "Temperature and chemical resistance",
      "Fast curing time",
      "Compatible with multiple substrates"
    ],
    image: "public/lovable-uploads/fb67403f-ed79-4090-9432-b6c60bcfadb7.png"
  },
  {
    id: 3,
    name: "TyCoat Pro",
    category: "Surface Treatments",
    description: "Specialized coating solutions providing superior protection against corrosion, chemicals, and extreme wear conditions.",
    features: [
      "Extends equipment lifespan",
      "Highly resistant to chemical exposure",
      "Easy application process",
      "Available in various application methods"
    ],
    image: "public/lovable-uploads/ed475dda-d90d-49bf-8eaa-1568397bfdf7.png"
  }
];

const Products = () => {
  const [activeProduct, setActiveProduct] = useState<Product>(products[0]);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="products" className="py-20 md:py-32 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-block mb-6 px-3 py-1 rounded-full bg-tychem-50 border border-tychem-100">
            <p className="text-sm font-medium text-tychem-700">Our Products</p>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Chemical Solutions for Every Industry
          </h2>
          <p className="text-lg text-gray-600">
            Discover our range of high-performance chemical products designed to meet the evolving needs of diverse industries.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="sticky top-32">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={activeProduct.id}
                      src={activeProduct.image}
                      alt={activeProduct.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="object-cover w-full h-full"
                    />
                  </AnimatePresence>
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sm font-medium text-tychem-700">
                    {activeProduct.category}
                  </div>
                </div>
                
                <div className="p-6 md:p-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeProduct.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 className="text-2xl font-bold mb-4">{activeProduct.name}</h3>
                      <p className="text-gray-600 mb-6">{activeProduct.description}</p>
                      
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold uppercase text-gray-500">Key Features</h4>
                        <ul className="space-y-2">
                          {activeProduct.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <div className="text-tychem-500 mr-3 mt-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="mt-8 px-6 py-3 bg-tychem-500 text-white rounded-lg font-medium transition-all duration-300 hover:bg-tychem-600 w-full"
                      >
                        Request Product Information
                      </motion.button>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
          
          <div className="lg:col-span-3 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold mb-8">Featured Products</h3>
              
              <div className="space-y-6">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.3 }}
                    className={`p-6 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                      activeProduct.id === product.id
                        ? "border-tychem-500 bg-tychem-50"
                        : "border-gray-200 bg-white hover:border-tychem-200 hover:bg-gray-50"
                    }`}
                    onClick={() => setActiveProduct(product)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xl font-bold mb-2">{product.name}</h4>
                        <p className="text-gray-500 text-sm">{product.category}</p>
                      </div>
                      <div className={`transition-transform duration-300 ${
                        activeProduct.id === product.id ? "rotate-180" : "rotate-0"
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-tychem-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {activeProduct.id === product.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 overflow-hidden"
                        >
                          <p className="text-gray-600">{product.description}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-12 p-8 bg-gradient-to-br from-tychem-500/10 to-tychem-600/5 rounded-2xl border border-tychem-100">
                <h3 className="text-xl font-bold mb-4">Custom Formulations</h3>
                <p className="text-gray-600 mb-6">
                  Don't see what you need? We specialize in developing custom chemical formulations tailored to your specific requirements and industry challenges.
                </p>
                <motion.a
                  href="#contact"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center px-6 py-3 bg-white border border-tychem-200 text-tychem-700 rounded-lg font-medium transition-all duration-300 hover:bg-tychem-50"
                >
                  Discuss your needs
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
