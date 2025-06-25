import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Menu, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

interface NavbarProps {
  transparent?: boolean;
}

const Navbar = ({ transparent = true }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (href.startsWith("/#")) {
      const sectionId = href.substring(2); // Remove "/#" to get section id
      
      if (location.pathname === '/') {
        // Already on home page, just scroll to section
        const element = document.getElementById(sectionId);
        if (element) {
          const offset = 80; // Height of the fixed navbar
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });
        }
      } else {
        // On different page, navigate to home with section target
        navigate('/', { state: { scrollToSection: sectionId } });
      }
    } else {
      // Regular navigation
      navigate(href);
    }
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      // If already on home page, scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    } else {
      // If on another page, navigate to home
      navigate('/');
    }
    setIsMenuOpen(false);
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    if (location.pathname === '/') {
      // Already on home page, just scroll to contact section
      const element = document.getElementById('contact');
      if (element) {
        const offset = 80; // Height of the fixed navbar
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    } else {
      // On different page, navigate to home with contact target
      navigate('/', { state: { scrollToSection: 'contact' } });
    }
  };

  const getHeaderBackground = () => {
    if (!transparent) return "bg-black";
    if (isScrolled) return "bg-black/80 backdrop-blur-md border-b border-gray-200/20";
    return "bg-transparent";
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getHeaderBackground()} ${
          isScrolled ? "py-3" : "py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            <button onClick={handleHomeClick} className="flex items-center">
              <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
                TYCHEM LLC
              </span>
            </button>

            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  to={link.href}
                  onClick={(e) => {
                    if (link.label === "Home") {
                      handleHomeClick(e);
                    } else {
                      handleNavClick(e, link.href);
                    }
                  }}
                  className="text-white/80 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                className="hidden md:flex items-center bg-transparent text-white border-white hover:bg-white hover:text-black transition-colors duration-300"
                onClick={handleContactClick}
              >
                Contact Us
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 md:hidden"
          >
            <div className="container h-full flex flex-col">
              <div className="flex items-center justify-between py-5">
                <button 
                  onClick={handleHomeClick}
                  className="flex items-center"
                >
                  <span className="text-xl font-bold text-white tracking-tight">
                    TYCHEM LLC
                  </span>
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <nav className="flex flex-col space-y-8 pt-10">
                {navLinks.map((link) => (
                  <motion.div
                    key={link.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      to={link.href}
                      onClick={(e) => {
                        if (link.label === "Home") {
                          handleHomeClick(e);
                        } else {
                          handleNavClick(e, link.href);
                        }
                      }}
                      className="text-2xl font-medium text-white"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-auto pb-10">
                <Button
                  className="w-full my-6 py-6 text-lg bg-white text-black hover:bg-white/90"
                  onClick={handleContactClick}
                >
                  Contact Us
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;