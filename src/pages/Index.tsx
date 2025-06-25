import { useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import About from "@/components/About";
import Features from "@/components/Features";
import ChemicalList from "@/components/ChemicalList";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ChemicalTicker from "@/components/ChemicalTicker";
import SEOProductData from "@/components/SEOProductData";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // Set page title and meta description
    document.title = "Tychem LLC - Surplus Chemical Brokers Since 2001 | Industrial Chemicals";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Leading surplus chemical broker since 2001. Buy and sell industrial chemicals including sodium hydroxide, citric acid, glycerin, and more. Save money while protecting the environment.'
      );
    }

    // Initialize scroll animations
    const scrollElements = document.querySelectorAll(".scroll-trigger-fade-in");
    
    const elementInView = (el: Element, scrollOffset = 100) => {
      const elementTop = el.getBoundingClientRect().top;
      return (
        elementTop <= (window.innerHeight || document.documentElement.clientHeight) - scrollOffset
      );
    };
    
    const displayScrollElement = (element: Element) => {
      element.classList.add("visible");
    };
    
    const handleScrollAnimation = () => {
      scrollElements.forEach((el) => {
        if (elementInView(el)) {
          displayScrollElement(el);
        }
      });
    };
    
    window.addEventListener("scroll", handleScrollAnimation);
    // Initial check on load
    handleScrollAnimation();
    
    return () => {
      window.removeEventListener("scroll", handleScrollAnimation);
    };
  }, []);

  // Handle scrolling to specific sections when navigated from other pages
  useEffect(() => {
    const scrollToSection = location.state?.scrollToSection;
    if (scrollToSection) {
      // Small delay to ensure the page has loaded
      setTimeout(() => {
        const element = document.getElementById(scrollToSection);
        if (element) {
          const offset = 80; // Height of the fixed navbar
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      }, 100);
      
      // Clear the state to prevent scrolling on subsequent visits
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      <SEOProductData />
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <About />
        <Features />
        <ChemicalList />
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTop />
      <ChemicalTicker />
    </motion.div>
  );
};

export default Index;