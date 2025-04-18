import React, { useEffect, useState } from 'react';
import { Package2, Sun, Moon, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
}

export function Header({ darkMode, setDarkMode, isMenuOpen, setIsMenuOpen }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [router.pathname, setIsMenuOpen]);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg' 
          : 'bg-white dark:bg-gray-900'
      }`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center space-x-4">
              <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 overflow-hidden">
                <Image 
                  src="/images/logo.png" 
                  alt="AzPort Supply - Industrial Supply Chain Solutions"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 48px, (max-width: 1024px) 56px, 64px"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white font-sans">
                  AzPort Supply
                </span>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium hidden sm:block">
                  Industrial Solutions
                </span>
              </div>
            </Link>
          </motion.div>
          
          <div className="flex items-center space-x-6">
            <div className="hidden md:block">
              <motion.ul 
                className="flex items-center space-x-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {[
                  { href: "/", label: "Home" },
                  { href: "/about", label: "About Us" },
                  { href: "/products", label: "Products" },
                  { href: "/certifications", label: "Certifications" },
                  { href: "/testing", label: "Testing" }
                ].map((item) => (
                  <motion.li key={item.href} whileHover={{ scale: 1.05 }}>
                    <Link
                      href={item.href}
                      className={`px-5 py-2.5 rounded-lg text-base font-medium transition-all duration-300 ${
                        router.pathname === item.href
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
                <motion.li whileHover={{ scale: 1.05 }}>
                  <Link
                    href="/contact"
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-base font-medium hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-600/20"
                  >
                    Contact Us
                  </Link>
                </motion.li>
                <motion.li>
                  <motion.button 
                    onClick={() => setDarkMode(!darkMode)}
                    className={`p-2.5 rounded-full transition-all duration-300 ml-2 ${
                      isScrolled ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {darkMode ? (
                      <Sun className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <Moon className="h-5 w-5 text-gray-600" />
                    )}
                  </motion.button>
                </motion.li>
              </motion.ul>
            </div>

            <div className="flex items-center md:hidden">
              <motion.button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full transition-all duration-300 mr-4 ${
                  isScrolled ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </motion.button>
              
              <motion.button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-gray-800 dark:text-white" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-800 dark:text-white" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <motion.ul 
                className="flex flex-col space-y-2 pt-4"
                initial="closed"
                animate="open"
                variants={{
                  open: {
                    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
                  },
                  closed: {
                    transition: { staggerChildren: 0.05, staggerDirection: -1 }
                  }
                }}
              >
                {[
                  { href: "/", label: "Home" },
                  { href: "/about", label: "About Us" },
                  { href: "/products", label: "Products" },
                  { href: "/certifications", label: "Certifications" },
                  { href: "/testing", label: "Testing" }
                ].map((item) => (
                  <motion.li
                    key={item.href}
                    variants={{
                      open: { opacity: 1, y: 0 },
                      closed: { opacity: 0, y: 20 }
                    }}
                  >
                    <Link
                      href={item.href}
                      className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                        router.pathname === item.href
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
                <motion.li
                  variants={{
                    open: { opacity: 1, y: 0 },
                    closed: { opacity: 0, y: 20 }
                  }}
                >
                  <Link
                    href="/contact"
                    className="block px-4 py-3 text-center bg-blue-600 text-white rounded-lg text-base font-medium hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact Us
                  </Link>
                </motion.li>
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}