import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Truck, Package2, Globe, Clock, Shield, MapPin, Phone, Mail, Send, MessageSquare, Map } from 'lucide-react';

export function Distribution() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Your message has been sent! We will contact you shortly.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

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
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-sm uppercase font-bold tracking-wider py-1 px-3 rounded-full mb-3 inline-block">Contact Us</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white relative">
              <span className="relative">
                Have Questions? 
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 ml-3">Get in Touch!</span>
              </span>
            </h2>
          </motion.div>

          <motion.div 
            className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            {/* Contact Information */}
            <motion.div variants={itemVariants} className="relative">
              <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 relative z-10">
                <motion.h3 
                  className="text-2xl font-bold mb-8 dark:text-white"
                  variants={itemVariants}
                >
                  Contact Information
                </motion.h3>
                
                <motion.div className="space-y-6" variants={itemVariants}>
                  <motion.div 
                    className="flex items-start space-x-4 group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-3 rounded-lg text-white group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">Our Location</h4>
                      <p className="text-gray-600 dark:text-gray-300">Chinar Park Business Center, Baku, Azerbaijan</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start space-x-4 group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-3 rounded-lg text-white group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">Phone Number</h4>
                      <p className="text-gray-600 dark:text-gray-300">+994 12 311 14 18</p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-start space-x-4 group"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-3 rounded-lg text-white group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">Email Address</h4>
                      <p className="text-gray-600 dark:text-gray-300">Sales@azportsupply.com</p>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div className="mt-12" variants={itemVariants}>
                  <h4 className="text-xl font-semibold mb-4 dark:text-white">Business Hours</h4>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                      <div>
                        <span className="block text-gray-700 dark:text-gray-300 font-medium">Monday - Friday</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">9:00 AM - 6:00 PM</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                      <div>
                        <span className="block text-gray-700 dark:text-gray-300 font-medium">Saturday</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">10:00 AM - 2:00 PM</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                      <div>
                        <span className="block text-gray-700 dark:text-gray-300 font-medium">Sunday</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">Closed</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  className="mt-12 flex space-x-4"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8 }}
                >
                  <motion.a 
                    href="#" 
                    className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-600 dark:text-blue-400"
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </motion.a>
                  <motion.a 
                    href="#" 
                    className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-600 dark:text-blue-400"
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                    </svg>
                  </motion.a>
                  <motion.a 
                    href="#" 
                    className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-600 dark:text-blue-400"
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </motion.a>
                  <motion.a 
                    href="#" 
                    className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-600 dark:text-blue-400"
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </motion.a>
                </motion.div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-blue-300 dark:border-blue-700 rounded-xl z-0 opacity-50"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-blue-300 dark:border-blue-700 rounded-xl z-0 opacity-50"></div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 relative z-10">
                <motion.h3 
                  className="text-2xl font-bold mb-8 dark:text-white"
                  variants={itemVariants}
                >
                  Send Us a Message
                </motion.h3>
                
                <motion.form className="space-y-6" variants={itemVariants} onSubmit={handleSubmit}>
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
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
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
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
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
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
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
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
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
              </div>
            </motion.div>
          </motion.div>

          {/* Map Section */}
          <motion.div 
            className="mt-20 relative z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl overflow-hidden h-80 relative">
              <div className="absolute inset-0">
                <iframe 
                  className="w-full h-full border-0 filter grayscale-[50%] contrast-[1.2] opacity-90"
                  title="AzPort Supply Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d48602.55900720524!2d49.8035548!3d40.3703125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d7a76a9b7b7%3A0x9e774fe73c9c9df7!2sBaku%2C%20Azerbaijan!5e0!3m2!1sen!2sus!4v1682600000000!5m2!1sen!2sus" 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
              <div className="absolute inset-0 bg-blue-900/10 flex flex-col items-center justify-center p-4">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-xl shadow-2xl transform hover:-translate-y-1 transition-transform duration-300 max-w-md w-full">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Visit Our Office</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">Come by and see our products in person at our main location in Baku.</p>
                  <div className="flex items-center">
                    <Map className="h-5 w-5 text-blue-600 mr-2" />
                    <a 
                      href="https://goo.gl/maps/5JrCjUGbV8v9JKPG6" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 font-medium hover:underline"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 