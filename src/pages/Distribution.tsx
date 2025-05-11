import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Package2, Globe, Clock, Shield, MapPin } from 'lucide-react';
import { Contact } from '../components/Contact';

export function Distribution() {
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

  const distributionFeatures = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Official Balflex Representative",
      description: "Authorized distributor providing genuine Balflex products and solutions"
    },
    {
      icon: <Package2 className="h-6 w-6" />,
      title: "Comprehensive Supply Chain",
      description: "End-to-end supply chain management tailored to your business needs"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Sourcing",
      description: "Direct access to Balflex's international product portfolio"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Efficient Operations",
      description: "Streamlined processes ensuring timely delivery and optimal inventory management"
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Reliable Distribution",
      description: "Strategic distribution network covering all major industrial areas"
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-24 bg-blue-50 dark:bg-blue-900/20 overflow-hidden">
        <div className="absolute inset-0 opacity-20 dark:opacity-10">
          <svg className="absolute left-0 top-0 h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="#2563eb">
            <path d="M0 .5H31.5V32" />
          </svg>
          <div className="absolute inset-0 transform -skew-x-12 bg-gradient-to-r from-blue-500/10 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm uppercase font-bold tracking-wider py-1 px-3 rounded-full mb-6 inline-block">
              Official Balflex Representative
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">
              Complete Supply Chain Solutions
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              At AzPort Supply, we offer comprehensive supply chain services designed to streamline operations and drive efficiency at every stage of the process
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {distributionFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                  <div className="text-blue-600 dark:text-blue-400">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-6 dark:text-white">Supply Chain Excellence</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Our tailored solutions are crafted to meet the unique needs of your business, ensuring smooth and reliable supply chain management from start to finish
            </p>
          </div>
          
          {/* Supply Chain Process Visualization */}
          <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Sourcing</h3>
                <p className="text-gray-600 dark:text-gray-300">Direct access to genuine Balflex products</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Distribution</h3>
                <p className="text-gray-600 dark:text-gray-300">Efficient delivery and logistics management</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 dark:text-white">Support</h3>
                <p className="text-gray-600 dark:text-gray-300">Expert technical assistance and after-sales service</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <Contact />
    </div>
  );
} 