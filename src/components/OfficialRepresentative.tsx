import React from 'react';
import { motion } from 'framer-motion';

export function OfficialRepresentative() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
      <div className="container mx-auto px-4 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        
        <motion.div 
          className="flex flex-col lg:flex-row items-center relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.div className="lg:w-1/2 lg:pr-16 mb-12 lg:mb-0" variants={itemVariants}>
            <div className="relative">
              <div className="absolute -top-10 -left-10 text-7xl text-blue-600/10 font-bold z-0">BALFLEX</div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white relative z-10">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                  Official Representative
                </span>
                <br />of Balflex
              </h2>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg leading-relaxed">
              As the exclusive authorized distributor of Balflex products in Azerbaijan, we provide high-quality hydraulic hoses, 
              fittings, and accessories that meet international standards for safety and reliability.
            </p>
            
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-10">
              Our partnership with Balflex allows us to deliver premium European manufacturing quality with local support, 
              ensuring you receive the best hydraulic solutions for your industrial applications.
            </p>
            
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-colors duration-300 shadow-lg hover:shadow-blue-500/30"
            >
              Explore Balflex Products
            </motion.button>
          </motion.div>
          
          <motion.div className="lg:w-1/2 relative" variants={itemVariants}>
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-yellow-300/10 rounded-full blur-3xl"></div>
            <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 backdrop-blur-sm bg-opacity-70 dark:bg-opacity-70 relative z-10 transform hover:-rotate-1 transition-all duration-500 hover:shadow-blue-500/10">
              <div className="flex justify-center mb-8">
                <img
                  src="/src/img/logo_balflex.png"
                  alt="Balflex Logo"
                  className="h-24 filter drop-shadow-xl"
                />
              </div>
              
              <div className="space-y-6">
                <motion.div 
                  className="flex items-center group"
                  whileHover={{ x: 5 }}
                >
                  <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-3 rounded-full mr-4 shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">European Quality Standards</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ISO 9001:2015 certified manufacturing</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center group"
                  whileHover={{ x: 5 }}
                >
                  <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-3 rounded-full mr-4 shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">Certified Products</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">All products meet international certifications</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center group"
                  whileHover={{ x: 5 }}
                >
                  <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-3 rounded-full mr-4 shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">Full Hydraulic Solutions</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Comprehensive range for all industrial needs</p>
                  </div>
                </motion.div>
              </div>
              
              <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img src="/eu-flag.png" alt="European Union" className="h-6 mr-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Made in Europe</span>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-bold px-4 py-1 rounded-full">
                    Premium Partner
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 