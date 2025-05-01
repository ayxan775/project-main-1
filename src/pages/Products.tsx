import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { ArrowRight, Download, AlertCircle, X } from 'lucide-react';
import { Products as ProductsComponent } from '../components/Products';
import { Contact } from '../components/Contact';

// Testimonials from customers
const testimonials = [
  {
    quote: "The industrial products we purchased have significantly improved our operational efficiency by 35%.",
    author: "Michael Chen",
    company: "Global Manufacturing Inc.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100"
  },
  {
    quote: "Their quality control equipment has been instrumental in maintaining our high standards of production.",
    author: "Sarah Johnson",
    company: "Quality Systems Ltd.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
  }
];

export function Products() {
  const router = useRouter();
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  const handleDownloadCatalog = async () => {
    try {
      setDownloadError(null);
      
      // Add a timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/catalog/download?t=${timestamp}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to download catalog');
      }

      // Create a blob from the response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Get filename from the Content-Disposition header if available
      let filename = 'catalog.pdf';
      const contentDisposition = response.headers.get('Content-Disposition');
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading catalog:', error);
      setDownloadError(error instanceof Error ? error.message : 'Failed to download catalog');
      setTimeout(() => setDownloadError(null), 5000);
    }
  };

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
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <span className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded-full font-medium uppercase tracking-wider">Premium Solutions</span>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6 text-gray-900 dark:text-white">
              Industrial Products <span className="text-blue-600 dark:text-blue-400">Engineered for Excellence</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Discover our comprehensive range of high-quality industrial equipment, designed to meet the most demanding requirements in today's challenging environments.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowContactModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center"
              >
                Request Custom Quota
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleDownloadCatalog}
                className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 px-6 py-3 rounded-lg font-medium flex items-center"
              >
                Download Catalog
                <Download className="ml-2 h-5 w-5" />
              </motion.button>
            </div>
            {downloadError && (
              <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <p>{downloadError}</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <section className="pt-0 pb-16">
        <ProductsComponent />
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What Our Clients Say</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Don't just take our word for it - hear from some of our satisfied customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
              >
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.author}
                    className="w-14 h-14 rounded-full object-cover mr-4"
                  />
                    <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 dark:bg-blue-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Elevate Your Industrial Operations?</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">
            Our team of experts is ready to help you find the perfect solutions for your specific requirements.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/contact')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Contact Our Specialists
          </motion.button>
        </div>
      </section>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setShowContactModal(false)}>
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div 
              className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              onClick={e => e.stopPropagation()}
            >
              <Contact 
                isModal={true}
                modalTitle="Request Custom Quota"
                onClose={() => setShowContactModal(false)}
                initialValues={{
                  name: '',
                  email: '',
                  subject: 'Custom Quota Request',
                  message: ''
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 