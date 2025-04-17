import React from 'react';
import { motion } from 'framer-motion';

export function AboutAzPort() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
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

  const counterVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Image parallax effect
  const imageVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="container mx-auto px-4 relative">
        {/* Decorative elements */}
        <div className="absolute top-40 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <motion.div
          className="text-center mb-20 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block"
          >
            <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-sm uppercase font-bold tracking-wider py-1 px-3 rounded-full mb-3 inline-block">About Us</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white relative">
            <span className="relative">
              About 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 ml-3">AzPort Supply</span>
              <motion.div 
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600/50 to-blue-400/50 rounded-full"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              ></motion.div>
            </span>
          </h2>
          <motion.p 
            className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Leading provider of premium hydraulic solutions in Azerbaijan
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.div 
            className="relative"
            variants={imageVariants}
          >
            <motion.div 
              className="absolute -top-5 -left-5 w-32 h-32 border-2 border-blue-300 dark:border-blue-700 rounded-lg z-0 opacity-50"
              animate={{ 
                rotate: [0, 5, 0, -5, 0],
                x: [0, 5, 0, -5, 0],
                y: [0, 5, 0, -5, 0],
              }}
              transition={{ 
                repeat: Infinity,
                duration: 10,
                ease: "easeInOut"
              }}
            ></motion.div>
            
            <motion.div 
              className="absolute -bottom-5 -right-5 w-32 h-32 border-2 border-blue-300 dark:border-blue-700 rounded-lg z-0 opacity-50"
              animate={{ 
                rotate: [0, -5, 0, 5, 0],
                x: [0, -5, 0, 5, 0],
                y: [0, -5, 0, 5, 0],
              }}
              transition={{ 
                repeat: Infinity,
                duration: 10,
                ease: "easeInOut",
                delay: 0.5
              }}
            ></motion.div>
            
            <motion.div
              className="relative rounded-xl overflow-hidden shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 z-10 bg-white dark:bg-gray-800 p-3"
              whileHover={{ y: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent opacity-30 z-0"></div>
              <img 
                src="/src/img/AzPort Supply.webp" 
                alt="AzPort Supply Facility" 
                className="rounded-lg w-full h-auto object-cover relative z-10"
              />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg z-20">
                <div className="flex items-center">
                  <div className="bg-blue-600 text-white p-2 rounded mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Main Facility</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Baku, Azerbaijan</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div className="space-y-8" variants={itemVariants}>
            <motion.p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed" variants={itemVariants}>
              AzPort Supply is a leading provider of industrial hydraulic solutions in Azerbaijan. With years of experience and expertise,
              we specialize in supplying premium hydraulic hoses, fittings, and accessories for various industrial applications.
            </motion.p>
            
            <motion.p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed" variants={itemVariants}>
              Our mission is to deliver reliable, high-performance products that meet the demanding needs of industries
              including oil and gas, construction, manufacturing, and marine sectors.
            </motion.p>
            
            <motion.div 
              className="grid grid-cols-2 gap-6 mt-12"
              variants={itemVariants}
            >
              <motion.div 
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100 dark:border-gray-700"
                variants={counterVariants}
                whileHover={{ y: -5 }}
              >
                <div className="text-blue-600 text-4xl font-bold mb-2 flex items-end">
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    10+
                  </motion.span>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 ml-1 mb-2"></div>
                </div>
                <div className="text-gray-800 dark:text-gray-300 font-medium">Years of Experience</div>
              </motion.div>
              
              <motion.div 
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100 dark:border-gray-700"
                variants={counterVariants}
                whileHover={{ y: -5 }}
              >
                <div className="text-blue-600 text-4xl font-bold mb-2 flex items-end">
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    500+
                  </motion.span>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 ml-1 mb-2"></div>
                </div>
                <div className="text-gray-800 dark:text-gray-300 font-medium">Projects Completed</div>
              </motion.div>
              
              <motion.div 
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100 dark:border-gray-700"
                variants={counterVariants}
                whileHover={{ y: -5 }}
              >
                <div className="text-blue-600 text-4xl font-bold mb-2 flex items-end">
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  >
                    100+
                  </motion.span>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 ml-1 mb-2"></div>
                </div>
                <div className="text-gray-800 dark:text-gray-300 font-medium">Regular Clients</div>
              </motion.div>
              
              <motion.div 
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100 dark:border-gray-700"
                variants={counterVariants}
                whileHover={{ y: -5 }}
              >
                <div className="text-blue-600 text-4xl font-bold mb-2 flex items-end">
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    24/7
                  </motion.span>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-600 ml-1 mb-2"></div>
                </div>
                <div className="text-gray-800 dark:text-gray-300 font-medium">Customer Support</div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 