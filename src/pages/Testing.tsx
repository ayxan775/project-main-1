import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Microscope, BarChart, CheckCircle, ClipboardCheck, Download, ArrowRight, Beaker, FlaskConical, FileText, Gauge } from 'lucide-react';
import Link from 'next/link';
import { TestingAnalytics } from '../components/TestingAnalytics';
import { TestingDetails } from '../components/TestingDetails';

// Import translations for potential future use, though current content is hardcoded
import en from '../../locales/en.json';
import az from '../../locales/az.json';
import ru from '../../locales/ru.json';


// Stats shown in the testing page
const testingStats = [
  { 
    value: "99.9%", 
    label: "Accuracy Rate", 
    icon: <CheckCircle className="w-6 h-6 text-green-500" /> 
  },
  { 
    value: "500+", 
    label: "Tests Conducted Monthly", 
    icon: <BarChart className="w-6 h-6 text-blue-500" /> 
  },
  { 
    value: "ISO 17025", 
    label: "Accredited Laboratory", 
    icon: <ClipboardCheck className="w-6 h-6 text-blue-500" /> 
  },
  { 
    value: "24/7", 
    label: "Lab Operations", 
    icon: <Gauge className="w-6 h-6 text-indigo-500" /> 
  }
];

// Testing services
const testingServices = [
  {
    name: "Material Composition Testing",
    description: "Comprehensive analysis of materials to determine elemental composition, alloy verification, and identify contaminants.",
    icon: <Microscope className="h-10 w-10 text-blue-600" />,
    turnaround: "3-5 Business Days"
  },
  {
    name: "Mechanical Property Testing",
    description: "Evaluating tensile strength, hardness, impact resistance, and fatigue performance of materials and components.",
    icon: <Gauge className="h-10 w-10 text-green-600" />,
    turnaround: "5-7 Business Days"
  },
  {
    name: "Chemical Analysis",
    description: "Qualitative and quantitative analysis of chemicals, compounds, and mixtures to ensure compliance with specifications.",
    icon: <Beaker className="h-10 w-10 text-yellow-600" />,
    turnaround: "4-6 Business Days"
  },
  {
    name: "Environmental Testing",
    description: "Evaluating performance under various environmental conditions including temperature, humidity, and corrosive atmospheres.",
    icon: <FlaskConical className="h-10 w-10 text-red-600" />,
    turnaround: "7-10 Business Days"
  },
  {
    name: "Non-Destructive Testing",
    description: "Inspection techniques that do not damage the tested items, including ultrasonic, radiographic, and magnetic particle testing.",
    icon: <FileText className="h-10 w-10 text-blue-600" />,
    turnaround: "2-3 Business Days"
  },
  {
    name: "Failure Analysis",
    description: "Comprehensive investigation of component failures to determine root causes and recommend preventive measures.",
    icon: <Microscope className="h-10 w-10 text-gray-600" />,
    turnaround: "10-14 Business Days"
  }
];

export function Testing() {
  const [selectedService, setSelectedService] = useState<typeof testingServices[0] | null>(null);
  const router = useRouter();
  const { locale, asPath } = router;

  // Determine translations - though current title/desc are from page content
  // const t = locale === 'az' ? az : locale === 'ru' ? ru : en;

  const pageTitle = "Advanced Testing Services | AzPort Supply";
  const pageDescription = "Our state-of-the-art laboratory provides comprehensive testing services to ensure your products meet the highest quality and safety standards.";
  const siteUrl = 'https://azportsupply.com';
  const canonicalUrl = `${siteUrl}${asPath}`;
  
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

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
      </Head>
      <div className="bg-white dark:bg-gray-900 min-h-screen pt-20">
        <TestingAnalytics page="testing" />
        
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
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full font-medium uppercase tracking-wider">Quality Assurance</span>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6 text-gray-900 dark:text-white">
              Advanced <span className="text-blue-600 dark:text-blue-400">Testing</span> Services
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Our state-of-the-art laboratory provides comprehensive testing services to ensure your products meet the highest quality and safety standards.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center"
              >
                Request Testing Quote
                <ClipboardCheck className="ml-2 h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 px-6 py-3 rounded-lg font-medium flex items-center"
              >
                Download Test Catalog
                <Download className="ml-2 h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {testingStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl text-center"
              >
                <div className="inline-flex justify-center items-center rounded-full p-3 bg-blue-100 dark:bg-blue-900/30 mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                <p className="text-gray-500 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testing Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Testing Services</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Comprehensive testing solutions tailored to your specific requirements, delivered with precision and reliability.
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testingServices.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div className="inline-flex justify-center items-center rounded-full p-4 bg-blue-50 dark:bg-blue-900/20 mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{service.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Turnaround: {service.turnaround}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-blue-600 dark:text-blue-400 font-medium flex items-center"
                    onClick={() => setSelectedService(service)}
                  >
                    View Details
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Testing Process Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Testing Process</h2>
            <p className="text-gray-600 dark:text-gray-300">
              We follow a rigorous, systematic approach to ensure accurate and reliable test results
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-blue-200 dark:bg-blue-800"></div>
              
              {[
                {
                  title: "Sample Reception",
                  description: "Reception and logging of test samples with detailed client requirements"
                },
                {
                  title: "Test Planning",
                  description: "Development of a comprehensive testing methodology and protocol"
                },
                {
                  title: "Sample Preparation",
                  description: "Preparation of samples according to standardized procedures"
                },
                {
                  title: "Initial Testing",
                  description: "Preliminary testing to establish baseline parameters"
                }
              ].map((step, index) => (
                <div key={index} className="flex mb-8 relative">
                  <div className="flex-shrink-0 bg-blue-500 text-white h-16 w-16 rounded-full flex items-center justify-center z-10">
                    <span className="text-xl font-bold">{index + 1}</span>
                  </div>
                  <div className="ml-6 pt-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute top-0 bottom-0 left-8 w-0.5 bg-blue-200 dark:bg-blue-800"></div>
              
              {[
                {
                  title: "Comprehensive Analysis",
                  description: "In-depth testing using state-of-the-art equipment and methodologies"
                },
                {
                  title: "Data Collection",
                  description: "Systematic recording and analysis of test results"
                },
                {
                  title: "Quality Control",
                  description: "Verification of results against established standards and specifications"
                },
                {
                  title: "Reporting",
                  description: "Detailed documentation of findings with interpretation and recommendations"
                }
              ].map((step, index) => (
                <div key={index} className="flex mb-8 relative">
                  <div className="flex-shrink-0 bg-blue-500 text-white h-16 w-16 rounded-full flex items-center justify-center z-10">
                    <span className="text-xl font-bold">{index + 5}</span>
                  </div>
                  <div className="ml-6 pt-3">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Laboratory Facilities Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">State-of-the-Art Laboratory Facilities</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Our laboratories are equipped with cutting-edge technology to deliver precise and reliable testing results
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Material Testing Lab",
                description: "Advanced equipment for comprehensive material analysis and characterization",
                icon: <Microscope className="h-8 w-8 text-white" />
              },
              {
                title: "Chemical Analysis Facility",
                description: "Specialized instruments for precise chemical composition determination",
                icon: <Beaker className="h-8 w-8 text-white" />
              },
              {
                title: "Mechanical Testing Center",
                description: "Sophisticated tools for evaluating mechanical properties and performance",
                icon: <Gauge className="h-8 w-8 text-white" />
              }
            ].map((facility, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-700 dark:to-blue-900 p-8 rounded-xl text-white shadow-lg"
              >
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  {facility.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{facility.title}</h3>
                <p className="text-blue-50">{facility.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-blue-600 dark:bg-blue-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Ensure Your Product Quality?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">
            Our testing experts are ready to help you develop a customized testing program to meet your specific requirements.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Schedule a Consultation
          </motion.button>
        </div>
      </section>

      {/* Testing Details Modal */}
      <AnimatePresence>
        {selectedService && (
          <TestingDetails 
            service={selectedService} 
            onClose={() => setSelectedService(null)} 
          />
        )}
      </AnimatePresence>
    </div>
    </>
  );
}