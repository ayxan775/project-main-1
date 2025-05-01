import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, FileText, Heart } from 'lucide-react';
import { Product } from '../types';
import { useRouter } from 'next/router';

export function HomeProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [displayLimit, setDisplayLimit] = useState<number>(6);
  const [isFavorite, setIsFavorite] = useState<Record<number, boolean>>({});
  const router = useRouter();

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch products');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Toggle favorite status
  const toggleFavorite = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setIsFavorite(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Get cover image
  const getCoverImage = (product: Product): string => {
    return product.image || (product.images && product.images.length > 0 ? product.images[0] : '');
  };

  // Skeleton loader for products
  const ProductSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gray-200 dark:bg-gray-700 h-64 animate-pulse"></div>
      <div className="p-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4 animate-pulse"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
      </div>
    </div>
  );

  const renderProductCard = (product: Product) => {
    const coverImage = getCoverImage(product);
    
    return (
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -5 }}
        transition={{ 
          duration: 0.6,
          ease: [0.43, 0.13, 0.23, 0.96],
          layout: { duration: 0.4 }
        }}
        key={product.id}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-500"
        onClick={() => router.push('/products')}
      >
        <div className="relative overflow-hidden group">
          {coverImage ? (
            <img 
              src={coverImage} 
              alt={product.name}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
          )}
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-4 right-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm shadow-md">
              {product.category}
            </span>
          </div>
          <button 
            onClick={(e) => toggleFavorite(product.id, e)}
            className="absolute top-4 left-4 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow-md transition-all duration-300 hover:bg-white hover:dark:bg-gray-700"
          >
            <Heart 
              className={`h-5 w-5 ${isFavorite[product.id] ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'}`} 
            />
          </button>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{product.name}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{product.description}</p>
          <div className="flex justify-between items-center">
            <button
              className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold group"
            >
              View Details 
              <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Featured Products
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our range of high-quality industrial products designed to meet your needs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {products.slice(0, displayLimit).map((product) => (
            <div key={product.id}>
              {renderProductCard(product)}
            </div>
          ))}
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        )}

        {displayLimit < products.length && (
          <div className="flex justify-center mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDisplayLimit(prev => prev + 6)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
            >
              Load More Products
              <ChevronRight className="ml-2 h-5 w-5" />
            </motion.button>
          </div>
        )}

        {/* View All Products Button */}
        <div className="flex justify-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/products')}
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center"
          >
            View All Products
            <ChevronRight className="ml-2 h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </section>
  );
} 