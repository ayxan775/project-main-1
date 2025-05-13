import React, { useState, useEffect } from 'react';
import type { AppProps } from 'next/app';
import { Header } from '../src/components/Header';
import { Footer } from '../src/components/Footer';
import { Nunito } from 'next/font/google';
import '../src/index.css';

const nunito = Nunito({
  subsets: ['latin', 'latin-ext', 'cyrillic'], // latin-ext for Azerbaijani, cyrillic for Russian
  variable: '--font-nunito',
  display: 'swap',
});

function MyApp({ Component, pageProps }: AppProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`${nunito.variable} font-sans min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300`}>
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      
      <main>
        <Component {...pageProps} />
      </main>

      <Footer />
    </div>
  );
}

export default MyApp; 