import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Award, Globe, ChevronRight, Building2, MapPin, Phone, Mail, Briefcase, Network, MessageSquare, Send } from 'lucide-react';
import Link from 'next/link';

export function About() {
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
    <div className="pt-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/10">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm uppercase font-bold tracking-wider py-1 px-3 rounded-full mb-6 inline-block">
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">
              Seamless Solutions, Endless Possibilities
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              AzPort Supply Chain Solutions is a leading provider of comprehensive logistics and supply chain solutions, 
              dedicated to empowering businesses with efficient and seamless operations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              variants={itemVariants}
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 dark:text-white">Our Mission</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                At AzPort Supply Chain Solutions, our mission is to deliver excellence in supply chain management by 
                offering tailored solutions that drive efficiency, reduce costs, and enhance competitiveness. We are 
                committed to providing exceptional service and value to our clients, enabling them to achieve their 
                strategic objectives and succeed in today's dynamic business environment.
              </p>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              variants={itemVariants}
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Globe className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 dark:text-white">About AzPort Supply</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                AzPort Supply Chain Solutions is a leading provider of comprehensive logistics and supply chain solutions, 
                dedicated to empowering businesses with efficient and seamless operations. With a focus on innovation, 
                reliability, and customer satisfaction, we strive to be the trusted partner that businesses rely on to 
                navigate the complexities of the global marketplace.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">What Sets Us Apart</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              These principles guide our operations and shape our commitment to excellence.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: <Award className="h-7 w-7 text-blue-600 dark:text-blue-400" />,
                title: "Industry Expertise",
                description: "With years of experience in logistics and supply chain industry, our team brings unparalleled expertise and insights to every project."
              },
              {
                icon: <Network className="h-7 w-7 text-blue-600 dark:text-blue-400" />,
                title: "Innovative Solutions",
                description: "We embrace innovation and leverage the latest technologies to develop cutting-edge solutions that optimize supply chain processes."
              },
              {
                icon: <Users className="h-7 w-7 text-blue-600 dark:text-blue-400" />,
                title: "Customer-Centric Approach",
                description: "We prioritize the needs of our customers above all else, tailoring our solutions to meet their unique requirements."
              },
              {
                icon: <Globe className="h-7 w-7 text-blue-600 dark:text-blue-400" />,
                title: "Global Network",
                description: "With a global network of partners and carriers, we have the capability to manage logistics operations across borders and continents."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                variants={itemVariants}
              >
                <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 dark:text-white">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 dark:text-white">Get In Touch</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Have questions about our supply chain solutions? Contact us today.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div 
              className="lg:col-span-2 bg-white dark:bg-gray-800 p-8 md:p-10 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 relative z-10"
              variants={itemVariants}
            >
              <motion.h3 
                className="text-2xl font-bold mb-8 dark:text-white"
                variants={itemVariants}
              >
                Send Us a Message
              </motion.h3>
              
              <motion.form className="space-y-6" variants={itemVariants}>
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input 
                      type="text" 
                      className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
                      placeholder="Your name"
                      required
                    />
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="email" 
                      className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      className="w-full pl-10 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
                      placeholder="How can we help?"
                      required
                    />
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                  <textarea 
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
                    placeholder="Your message here..."
                    required
                  ></textarea>
                </motion.div>
                
                <motion.div 
                  className="pt-3"
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/30 flex items-center justify-center space-x-2"
                  >
                    <span>Send Message</span>
                    <Send className="h-5 w-5" />
                  </button>
                </motion.div>
              </motion.form>
            </motion.div>

            <motion.div className="space-y-6" variants={itemVariants}>
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                variants={itemVariants}
              >
                <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <MapPin className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-4 dark:text-white">Our Location</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Chinar Park Business Center, Baku, Azerbaijan</p>
                <Link href="https://maps.google.com" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">View on map →</Link>
              </motion.div>

              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                variants={itemVariants}
              >
                <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <Phone className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-4 dark:text-white">Call Us</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">+994 12 311 14 18</p>
                <Link href="tel:+99412311418" className="text-blue-600 dark:text-blue-400 hover:underline">Call now →</Link>
              </motion.div>

              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                variants={itemVariants}
              >
                <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                  <Mail className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-4 dark:text-white">Email Us</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Sales@azportsupply.com</p>
                <Link href="mailto:Sales@azportsupply.com" className="text-blue-600 dark:text-blue-400 hover:underline">Send email →</Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Transform Your Supply Chain?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                Partner with AzPort Supply for innovative solutions that drive efficiency and growth.
              </p>
              <motion.button 
                className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all duration-300 inline-flex items-center group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started Today
                <ChevronRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 