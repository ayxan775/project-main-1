import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, MessageSquare, Clock, Map, X, Facebook, Instagram, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactProps {
  isModal?: boolean;
  modalTitle?: string;
  initialValues?: ContactFormData;
  onClose?: () => void;
}

export function Contact({ isModal, modalTitle, initialValues, onClose }: ContactProps) {
  const [formData, setFormData] = useState<ContactFormData>(initialValues || {
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
    // Here you would handle form submission, including SMTP logic
    console.log('Form submitted:', formData);
    
    // Show success message
    alert('Your message has been sent! We will contact you shortly.');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    
    // Close modal if in modal mode
    if (isModal && onClose) {
      onClose();
    }
  };

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

  // Render just the form if used in modal mode
  if (isModal) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{modalTitle || 'Contact Us'}</h3>
          {onClose && (
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
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
          </div>
          
          <div>
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
          </div>
          
          <div>
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
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
            <textarea 
              rows={4}
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
              placeholder="Your message here..."
              required
            ></textarea>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/30 flex items-center justify-center space-x-2"
            >
              <span>Send Message</span>
              <Send className="h-5 w-5 ml-2" />
            </button>
          </motion.div>
        </form>
      </div>
    );
  }

  // Full Contact page with location and other details
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
            <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-sm uppercase font-bold tracking-wider py-1 px-3 rounded-full mb-3 inline-block">Contact Us</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white relative">
            <span className="relative">
              Have Questions? 
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 ml-3">Get in Touch!</span>
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
            We're here to assist you with any questions about our hydraulic solutions
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
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
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Phone</h4>
                    <a href="tel:+99412311418" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      +994 12 311 14 18
                    </a>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-4 group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Email</h4>
                    <a href="mailto:Sales@azportsupply.com" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      Sales@azportsupply.com
                    </a>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-4 group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Location</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Chinar Park Business Center, Baku
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-4 group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Business Hours</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Mon-Fri: 9:00 AM - 6:00 PM<br />
                      Sat: 10:00 AM - 2:00 PM
                    </p>
                  </div>
                </motion.div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h4>
                  <div className="flex space-x-4">
                    <a 
                      href="https://www.facebook.com/profile.php?id=61575970508290" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <Facebook className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </a>
                    <a 
                      href="https://www.instagram.com/azport.supply/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <Instagram className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </a>
                    <a 
                      href="https://www.linkedin.com/company/azport-supply/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <Linkedin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-blue-300 dark:border-blue-700 rounded-xl z-0 opacity-50"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-blue-300 dark:border-blue-700 rounded-xl z-0 opacity-50"></div>
          </motion.div>
          
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.6990456824287!2d49.85643977653901!3d40.41478637144418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d1f08d751e5%3A0x682d37b49a753e5a!2sAzport%20Supply%20MMC!5e0!3m2!1sen!2saz!4v1710425567159!5m2!1sen!2saz" 
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
                    href="https://www.google.com/maps/place/Azport+Supply+MMC/@40.4147864,49.8564398,17z/data=!3m1!4b1!4m6!3m5!1s0x40307d1f08d751e5:0x682d37b49a753e5a!8m2!3d40.4147823!4d49.8590147!16s%2Fg%2F11lp0z4mdk" 
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
  );
}