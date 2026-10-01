import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { productPath } from '@/lib/productUrl';
import { useProducts } from '@/hooks/useProducts';

const ChemicalTicker = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { products } = useProducts();

  // Ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];

  useEffect(() => {
    const handleScroll = () => {
      const statsSection = document.getElementById('stats');
      const heroSection = document.querySelector('.h-screen');
      
      if (statsSection && heroSection) {
        const statsRect = statsSection.getBoundingClientRect();
        const heroRect = heroSection.getBoundingClientRect();
        
        const showTicker = statsRect.top <= window.innerHeight && heroRect.bottom < 0;
        setIsVisible(showTicker);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't render if no products
  if (safeProducts.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm z-50 py-1.5 border-t border-white/10"
        >
          <div className="relative overflow-hidden">
            <div className="flex animate-[ticker_60s_linear_infinite] whitespace-nowrap">
              {safeProducts.map((chemical, index) => (
                <Link
                  key={`${chemical.id}-${index}`}
                  to={productPath(chemical)}
                  className="inline-flex items-center mx-6 text-white/80 text-xs hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  <span className="font-medium">{chemical.name}</span>
                  <span className="mx-1.5">•</span>
                  <span className="opacity-80">{chemical.quantity}</span>
                </Link>
              ))}
              {/* Duplicate for seamless loop */}
              {safeProducts.map((chemical, index) => (
                <Link
                  key={`${chemical.id}-${index}-duplicate`}
                  to={productPath(chemical)}
                  tabIndex={-1}
                  aria-hidden="true"
                  className="inline-flex items-center mx-6 text-white/80 text-xs hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  <span className="font-medium">{chemical.name}</span>
                  <span className="mx-1.5">•</span>
                  <span className="opacity-80">{chemical.quantity}</span>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChemicalTicker