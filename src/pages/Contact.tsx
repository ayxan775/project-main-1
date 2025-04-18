import React from 'react';
import { motion } from 'framer-motion';
import { Contact } from '../components/Contact';
import { HelpCircle, ChevronDown, Clock, MessageSquare, Phone, Mail } from 'lucide-react';

export function ContactPage() {
  const faqVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const faqs = [
    {
      question: "What are your business hours?",
      answer: "We are open Monday to Friday from 9:00 AM to 6:00 PM, and Saturday from 10:00 AM to 2:00 PM (Azerbaijan Time). We are closed on Sundays and public holidays."
    },
    {
      question: "How quickly can I expect a response?",
      answer: "We strive to respond to all inquiries within 24 hours during business days. For urgent matters, please contact us by phone."
    },
    {
      question: "Do you provide international shipping?",
      answer: "Yes, we provide international shipping services. Please contact our sales team for detailed information about shipping to your location."
    },
    {
      question: "Can I request a product demonstration?",
      answer: "Absolutely! We offer product demonstrations at our Baku office. Please schedule an appointment through our contact form or by calling us directly."
    }
  ];

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
              Contact Us
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">
              Let's Start a Conversation
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              Have questions about our products or services? Our team is here to help you find the perfect solution for your needs.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <Contact />

      {/* Quick Contact Options */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold mb-6 dark:text-white">Quick Contact Options</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Choose the most convenient way to reach us
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Phone className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 dark:text-white">Call Us</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Speak directly with our team</p>
              <a href="tel:+99412311418" className="text-blue-600 dark:text-blue-400 hover:underline">+994 12 311 14 18</a>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Mail className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 dark:text-white">Email Us</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Send us your inquiry</p>
              <a href="mailto:Sales@azportsupply.com" className="text-blue-600 dark:text-blue-400 hover:underline">Sales@azportsupply.com</a>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Clock className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 dark:text-white">Business Hours</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">Mon-Fri: 9:00 AM - 6:00 PM</p>
              <p className="text-gray-600 dark:text-gray-300">Sat: 10:00 AM - 2:00 PM</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm uppercase font-bold tracking-wider py-1 px-3 rounded-full mb-6 inline-block">
              FAQs
            </span>
            <h2 className="text-3xl font-bold mb-6 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Find quick answers to common questions about our services
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="mb-6"
                variants={faqVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 dark:text-white">{faq.question}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="bg-white/10 p-2 rounded-full inline-flex items-center mb-8">
              <MessageSquare className="h-5 w-5 text-white mr-2" />
              <span className="text-white text-sm font-medium">24/7 Support Available</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Supply Chain?
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Get in touch with our experts today and discover how we can help optimize your operations.
            </p>
            <motion.button
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule a Consultation
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 