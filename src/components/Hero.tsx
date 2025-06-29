import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Globe } from "@/components/ui/globe";
import { AuroraBackground } from "@/components/ui/aurora-background";

const Hero = () => {
  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth"
    });
  };

  return (
    <AuroraBackground className="relative w-full h-screen overflow-hidden bg-black">
      {/* Content Container */}
      <div className="relative z-10 flex h-full container mx-auto px-4 md:px-6">
        <div className="flex flex-col justify-center w-full lg:max-w-[50%]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-20"
          >
            <h1 
              className="text-[40px] sm:text-[50px] md:text-[60px] lg:text-[80px] font-bold leading-[0.9] mb-6" 
              style={{ color: '#3b9460' }}
            >
              Save The Earth, Sell Us Your Unwanted Chemicals.
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-2">
              Surplus Chemical Brokers, Since 2001.
            </p>
            <p className="text-base md:text-lg text-white/70 mb-8">
              Turn your chemical waste into profit while protecting the environment. We buy surplus chemicals of all sizes - from small lots to rail cars.
            </p>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex px-6 sm:px-8 py-3 sm:py-4 text-white font-medium text-center transition-all duration-300 bg-[#3b9460] rounded-md hover:bg-[#3b9460]/90"
              aria-label="Contact Tychem LLC for chemical disposal services"
            >
              Get Free Quote
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Globe Container */}
      <div className="absolute top-1/2 left-1/2 -translate-y-1/2">
        <div className="relative w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] lg:w-[700px] lg:h-[700px] opacity-50 sm:opacity-100">
          <Globe config={{
            width: 700,
            height: 700,
            phi: 0,
            theta: 0.3,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.3, 0.3, 0.3],
            markerColor: [0.23, 0.58, 0.37],
            glowColor: [1, 1, 1],
            markers: [
              { location: [37.7749, -122.4194], size: 0.1 },
              { location: [40.7128, -74.006], size: 0.1 }
            ],
          }} />
        </div>
      </div>

      {/* Scroll Button */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <button 
          onClick={handleScrollDown}
          className="p-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-colors duration-300"
          aria-label="Scroll down to learn more"
        >
          <ChevronDown className="h-6 w-6" />
        </button>
      </motion.div>
    </AuroraBackground>
  );
};

export default Hero;