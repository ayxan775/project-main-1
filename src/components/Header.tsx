import React, { useEffect, useState } from 'react';
import { Package2, Sun, Moon, Menu, X, Globe, ChevronDown } from 'lucide-react'; // Added Globe, ChevronDown icons
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Import translations (adjust path if necessary)
import en from '../../locales/en.json';
import az from '../../locales/az.json';
import ru from '../../locales/ru.json';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (value: boolean) => void;
}

export function Header({ darkMode, setDarkMode, isMenuOpen, setIsMenuOpen }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const { locale, locales, pathname, query, asPath } = router; // Get locale info
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  // Language details mapping
  const languageDetails: { [key: string]: { name: string; flag: string } } = {
    en: { name: 'ENG', flag: '/flags/gb.svg' },
    az: { name: 'AZE', flag: '/flags/az.svg' },
    ru: { name: 'RU', flag: '/flags/ru.svg' },
  };

  const currentLangDetails = locale ? languageDetails[locale] : languageDetails.en;

  // Determine translations based on current locale
  const t = locale === 'az' ? az.header : locale === 'ru' ? ru.header : en.header;

  // Function to change language
  const changeLanguage = (newLocale: string) => {
    router.push({ pathname, query }, asPath, { locale: newLocale });
    setIsMenuOpen(false); // Close mobile menu on language change
    setIsLangDropdownOpen(false); // Close language dropdown
  };

  // Handle clicks outside the language dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const langDropdown = document.getElementById('language-dropdown-container');
      if (langDropdown && !langDropdown.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };

    if (isLangDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLangDropdownOpen]);

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
      <nav className="container mx-auto px-4 py-1">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="flex items-center space-x-4">
              <div className="relative w-20 h-20 sm:w-22 sm:h-22 lg:w-24 lg:h-24 overflow-hidden">
                <Image 
                  src="/images/logo.png"
                  alt={t.logoAlt} // Use translation
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 80px, (max-width: 1024px) 88px, 96px"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white font-sans">
                  AzPort Supply
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
                {[ // Use translations for labels
                  { href: "/", label: t.navHome },
                  { href: "/products", label: t.navProducts },
                  { href: "/distribution", label: t.navDistribution },
                  { href: "/career", label: t.navCareer },
                  { href: "/about", label: t.navAbout }
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
                {/* Language Switcher - Desktop */}
                <motion.li className="relative ml-2" id="language-dropdown-container-desktop">
                  <motion.button
                    onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                    className="flex items-center p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {currentLangDetails && (
                      <Image src={currentLangDetails.flag} alt={currentLangDetails.name} width={20} height={15} className="mr-2 rounded-sm" />
                    )}
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
                      {currentLangDetails ? currentLangDetails.name : locale?.toUpperCase()}
                    </span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 sm:hidden">
                      {locale?.toUpperCase()}
                    </span>
                    <ChevronDown className={`ml-1 h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
                  </motion.button>
                  <AnimatePresence>
                    {isLangDropdownOpen && (
                      <motion.ul
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700"
                      >
                        {locales?.filter(loc => loc !== locale).map((loc) => {
                          const lang = languageDetails[loc];
                          return (
                            <li key={loc}>
                              <button
                                onClick={() => changeLanguage(loc)}
                                className="w-full text-left px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors duration-150"
                              >
                                {lang && <Image src={lang.flag} alt={lang.name} width={20} height={15} className="mr-2 rounded-sm" />}
                                {lang ? lang.name : loc.toUpperCase()}
                              </button>
                            </li>
                          );
                        })}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.li>
                <motion.li whileHover={{ scale: 1.05 }}>
                  <Link
                    href="/contact"
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-base font-medium hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-blue-600/20"
                  >
                    {t.contactUs} {/* Use translation */}
                  </Link>
                </motion.li>
                {/* Dark Mode Toggle */}
                <motion.li>
                  <motion.button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`p-2.5 rounded-full transition-all duration-300 ml-1 ${
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
              {/* Dark Mode Toggle - Mobile */}
              <motion.button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full transition-all duration-300 mr-2 ${ // Reduced margin
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

              {/* Language Switcher - Mobile */}
              <div className="relative mr-2" id="language-dropdown-container-mobile">
                <motion.button
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="flex items-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {currentLangDetails && (
                    <Image src={currentLangDetails.flag} alt={currentLangDetails.name} width={22} height={16} className="rounded-sm" />
                  )}
                  <ChevronDown className={`ml-1 h-4 w-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
                </motion.button>
                <AnimatePresence>
                  {isLangDropdownOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700"
                    >
                      {locales?.filter(loc => loc !== locale).map((loc) => {
                        const lang = languageDetails[loc];
                        return (
                          <li key={loc}>
                            <button
                              onClick={() => changeLanguage(loc)}
                              className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center transition-colors duration-150"
                            >
                              {lang && <Image src={lang.flag} alt={lang.name} width={20} height={15} className="mr-2 rounded-sm" />}
                              {lang ? lang.name : loc.toUpperCase()}
                            </button>
                          </li>
                        );
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {/* Menu Toggle */}
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
                {[ // Use translations for labels
                  { href: "/", label: t.navHome },
                  { href: "/products", label: t.navProducts },
                  { href: "/distribution", label: t.navDistribution },
                  { href: "/career", label: t.navCareer },
                  { href: "/about", label: t.navAbout }
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
                    {t.contactUs}
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