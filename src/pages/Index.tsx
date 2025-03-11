import { useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import About from "@/components/About";
import Features from "@/components/Features";
import ChemicalList from "@/components/ChemicalList";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

const Index = () => {
  useEffect(() => {
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
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
    </motion.div>
  );
};

export default Index;