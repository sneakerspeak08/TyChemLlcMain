import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { chemicals } from '@/data/products';

const ChemicalTicker = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

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

  const handleChemicalClick = (cas: string) => {
    navigate(`/products/${cas}`);
  };

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
              {chemicals.map((chemical, index) => (
                <button
                  key={`${chemical.id}-${index}`}
                  onClick={() => handleChemicalClick(chemical.cas)}
                  className="inline-flex items-center mx-6 text-white/80 text-xs hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  <span className="font-medium">{chemical.name}</span>
                  <span className="mx-1.5">•</span>
                  <span className="opacity-80">CAS: {chemical.cas}</span>
                </button>
              ))}
              {/* Duplicate for seamless loop */}
              {chemicals.map((chemical, index) => (
                <button
                  key={`${chemical.id}-${index}-duplicate`}
                  onClick={() => handleChemicalClick(chemical.cas)}
                  className="inline-flex items-center mx-6 text-white/80 text-xs hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  <span className="font-medium">{chemical.name}</span>
                  <span className="mx-1.5">•</span>
                  <span className="opacity-80">CAS: {chemical.cas}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChemicalTicker