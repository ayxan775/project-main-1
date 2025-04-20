import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Award, CheckCircle, FileCheck, Download, ArrowRight, FileText } from 'lucide-react';
import Link from 'next/link';
import { CertificationDetails } from '../components/CertificationDetails';
import { CertificationAnalytics } from '../components/CertificationAnalytics';

// Stats shown in the certification page
const certificationStats = [
  { 
    value: "100%", 
    label: "Compliance Rate", 
    icon: <CheckCircle className="w-6 h-6 text-green-500" /> 
  },
  { 
    value: "15+", 
    label: "International Standards", 
    icon: <Award className="w-6 h-6 text-blue-500" /> 
  },
  { 
    value: "ISO 9001", 
    label: "Quality Management", 
    icon: <ShieldCheck className="w-6 h-6 text-blue-500" /> 
  },
  { 
    value: "Annual", 
    label: "Renewal Cycle", 
    icon: <FileCheck className="w-6 h-6 text-green-500" /> 
  }
];

// Certification types
const certifications = [
  {
    name: "ISO 9001",
    description: "Quality Management System certification ensuring consistent quality products and services that meet customer requirements.",
    icon: <ShieldCheck className="h-10 w-10 text-blue-600" />,
    validUntil: "December 2025"
  },
  {
    name: "ISO 14001",
    description: "Environmental Management System certification demonstrating our commitment to reducing environmental impact.",
    icon: <FileText className="h-10 w-10 text-green-600" />,
    validUntil: "November 2024"
  },
  {
    name: "ISO 45001",
    description: "Occupational Health and Safety Management System certification ensuring workplace safety standards.",
    icon: <ShieldCheck className="h-10 w-10 text-yellow-600" />,
    validUntil: "March 2025"
  },
  {
    name: "API Certification",
    description: "American Petroleum Institute certification for equipment used in oil and gas industry applications.",
    icon: <FileText className="h-10 w-10 text-red-600" />,
    validUntil: "July 2025"
  },
  {
    name: "CE Marking",
    description: "Conformité Européenne marking indicating compliance with EU health, safety, and environmental protection standards.",
    icon: <CheckCircle className="h-10 w-10 text-blue-600" />,
    validUntil: "Permanent"
  },
  {
    name: "ASME Certification",
    description: "American Society of Mechanical Engineers certification for pressure vessels and boilers.",
    icon: <FileText className="h-10 w-10 text-gray-600" />,
    validUntil: "October 2024"
  }
];

export function Certifications() {
  const [selectedCertification, setSelectedCertification] = useState<typeof certifications[0] | null>(null);
  
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
    <div className="bg-white dark:bg-gray-900 min-h-screen pt-20">
      <CertificationAnalytics page="certifications" />
      
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
              Our <span className="text-blue-600 dark:text-blue-400">Certifications</span> & Standards
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              AzPort Supply Chain Solutions is committed to maintaining the highest industry standards through comprehensive certifications that validate our quality, safety, and operational excellence.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center"
              >
                Verify Certifications
                <CheckCircle className="ml-2 h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 px-6 py-3 rounded-lg font-medium flex items-center"
              >
                Download Certificates
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
            {certificationStats.map((stat, index) => (
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

      {/* Certifications Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Quality Certifications</h2>
            <p className="text-gray-600 dark:text-gray-300">
              All our certifications are regularly audited and maintained to ensure continuous compliance with international standards.
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {certifications.map((certification, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div className="inline-flex justify-center items-center rounded-full p-4 bg-blue-50 dark:bg-blue-900/20 mb-6">
                  {certification.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{certification.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{certification.description}</p>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Valid until: {certification.validUntil}</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-blue-600 dark:text-blue-400 font-medium flex items-center"
                    onClick={() => setSelectedCertification(certification)}
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
      
      {/* Certification Process Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Certification Process</h2>
            <p className="text-gray-600 dark:text-gray-300">
              We maintain rigorous quality control processes to ensure compliance with all certification requirements
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
                  title: "Initial Assessment",
                  description: "Comprehensive review of processes, documentation, and operations"
                },
                {
                  title: "Gap Analysis",
                  description: "Identification of areas requiring improvement to meet certification requirements"
                },
                {
                  title: "Implementation",
                  description: "Development and execution of improvement plans to address identified gaps"
                },
                {
                  title: "Internal Audit",
                  description: "Thorough inspection to verify compliance with certification standards"
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
                  title: "External Audit",
                  description: "Official certification body assessment to verify compliance"
                },
                {
                  title: "Certification",
                  description: "Issuance of official certification after successful audit"
                },
                {
                  title: "Continuous Monitoring",
                  description: "Ongoing assessment to maintain certification standards"
                },
                {
                  title: "Annual Renewal",
                  description: "Regular recertification to ensure continued compliance"
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
      
      {/* CTA Section */}
      <section className="py-20 bg-blue-600 dark:bg-blue-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Need Custom Certification Documentation?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">
            Our team can provide detailed certification documentation tailored to your specific project requirements.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Request Documentation
          </motion.button>
        </div>
      </section>

      {/* Certification Details Modal */}
      <AnimatePresence>
        {selectedCertification && (
          <CertificationDetails 
            certification={selectedCertification} 
            onClose={() => setSelectedCertification(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
} 