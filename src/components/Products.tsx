import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, X, Search, Grid, List, SlidersHorizontal, 
  Download, Share2, ChevronLeft, 
  Heart, Info, Truck, Shield, ArrowRight, FileText, Phone
} from 'lucide-react';
import { products, categories } from '../data/products';
import { Product } from '../types';

export function Products() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isGridView, setIsGridView] = useState<boolean>(true);
  const [sortOption, setSortOption] = useState<string>("default");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<Record<number, boolean>>({});
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Filter products based on category and search query
  const filteredProducts = products
    .filter(product => 
      (selectedCategory === "all" || product.category === selectedCategory) &&
      (searchQuery === "" || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "id-asc":
        return a.id - b.id;
      case "id-desc":
        return b.id - a.id;
      default:
        return 0;
    }
  });

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Set related products when a product is selected
  useEffect(() => {
    if (selectedProduct) {
      // Find products in the same category, excluding the current product
      const related = products
        .filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id)
        .slice(0, 3);
      setRelatedProducts(related);
      setCurrentImageIndex(0);
    }
  }, [selectedProduct]);

  // Toggle favorite status
  const toggleFavorite = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setIsFavorite(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
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
    const cardContent = (
      <>
        <div className="relative overflow-hidden group">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-4 right-4 flex flex-col space-y-2">
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
          <div className="absolute bottom-4 left-4 right-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-md text-gray-700 dark:text-gray-200 hover:bg-white hover:dark:bg-gray-700 transition-all duration-300">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{product.name}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{product.description}</p>
          <div className="flex justify-between items-center">
            <button
              onClick={() => setSelectedProduct(product)}
              className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold group"
            >
              View Details 
              <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <FileText className="h-4 w-4 mr-1" />
              <span>Documentation</span>
            </div>
          </div>
        </div>
      </>
    );

    if (isGridView) {
      return (
        <motion.div 
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          key={product.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:shadow-xl transition duration-300"
          onClick={() => setSelectedProduct(product)}
        >
          {cardContent}
        </motion.div>
      );
    } else {
      return (
        <motion.div 
          layout
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          key={product.id}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row transform hover:shadow-xl transition duration-300"
          onClick={() => setSelectedProduct(product)}
        >
          <div className="md:w-1/3">
            <div className="relative h-full">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-64 md:h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm shadow-md">
                  {product.category}
                </span>
              </div>
              <button 
                onClick={(e) => toggleFavorite(product.id, e)}
                className="absolute top-4 left-4 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full shadow-md"
              >
                <Heart 
                  className={`h-5 w-5 ${isFavorite[product.id] ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'}`} 
                />
              </button>
            </div>
          </div>
          <div className="p-6 md:w-2/3 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{product.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{product.description}</p>
              
              <div className="mb-4">
                {product.specs.slice(0, 2).map((spec, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    {spec}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <button
                onClick={() => setSelectedProduct(product)}
                className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold group"
              >
                View Details 
                <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Truck className="h-4 w-4 mr-1" />
                <span>Available</span>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }
  };

  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Search and Filter Controls */}
        <div className="mb-10 flex flex-col lg:flex-row gap-4 items-center justify-between bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {/* Layout Toggle */}
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsGridView(true)}
                className={`p-2 ${isGridView ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsGridView(false)}
                className={`p-2 ${!isGridView ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
            
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 py-2 pl-3 pr-10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="default">Sort by: Default</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="id-asc">Newest</option>
                <option value="id-desc">Oldest</option>
              </select>
              <SlidersHorizontal className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>
        
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedCategory("all")}
            className={`px-6 py-2 rounded-full transition-all duration-300 ${
              selectedCategory === "all"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            All Products
          </motion.button>
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>

        {/* Results Count and Sort Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 dark:text-gray-300">
            Showing <span className="font-semibold">{sortedProducts.length}</span> products
            {selectedCategory !== "all" && (
              <span> in <span className="font-semibold">{selectedCategory}</span></span>
            )}
            {searchQuery && (
              <span> matching "<span className="font-semibold">{searchQuery}</span>"</span>
            )}
          </p>
        </div>

        {/* Products Grid/List */}
        <AnimatePresence>
          <motion.div
            layout
            className={isGridView 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
              : "flex flex-col gap-6"
            }
          >
            {isLoading ? (
              // Skeleton loaders during loading
              Array.from({ length: 6 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            ) : sortedProducts.length > 0 ? (
              sortedProducts.map((product) => renderProductCard(product))
            ) : (
              // No results found
              <div className="col-span-3 py-16 text-center">
                <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No products found</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Enhanced Product Modal */}
      <AnimatePresence>
      {selectedProduct && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Left: Image Gallery */}
                <div className="relative bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center p-8">
                  <div className="absolute top-4 left-4 z-10">
                <button 
                  onClick={() => setSelectedProduct(null)}
                      className="bg-white/80 dark:bg-gray-800/80 p-2 rounded-full text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                      <X className="h-5 w-5" />
                </button>
              </div>
                  
                  {/* Primary Image */}
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name}
                    className="w-full h-auto max-h-[400px] object-contain rounded-lg"
                  />
                  
                  {/* Image Navigation (Simulated multiple images) */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <div className="flex space-x-3 px-4 py-2 bg-white/80 dark:bg-gray-800/80 rounded-full">
                      {[0, 1, 2].map((index) => (
                        <button 
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all ${
                            currentImageIndex === index 
                              ? 'bg-blue-600 scale-110' 
                              : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        ></button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Previous/Next Buttons (Simulated as we have only one real image) */}
                  <button 
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(prev => (prev === 0 ? 2 : prev - 1));
                    }}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button 
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 p-2 rounded-full text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(prev => (prev === 2 ? 0 : prev + 1));
                    }}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Right: Product Details */}
                <div className="p-8">
                  <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-3">
                    {selectedProduct.category}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    {selectedProduct.name}
                  </h2>
                  
                  <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <div className="flex items-center text-blue-700 dark:text-blue-300 mb-1">
                      <Info className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Product Information</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      Complete product specifications are available in the documentation. Contact our team for custom requirements.
                    </p>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                  
                  {/* Product Features */}
              <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Specifications</h3>
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                      <ul className="space-y-3">
                  {selectedProduct.specs.map((spec, index) => (
                          <li key={index} className="flex items-start">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mt-0.5 mr-3">
                              <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></div>
                            </div>
                            <span className="text-gray-700 dark:text-gray-300">{spec}</span>
                          </li>
                  ))}
                </ul>
                    </div>
              </div>
              
                  {/* Product Use Cases */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Use Cases</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedProduct.useCases.map((useCase, index) => (
                        <div 
                          key={index} 
                          className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg flex items-center"
                        >
                          <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">{useCase}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition duration-300 flex items-center justify-center">
                      <Phone className="h-5 w-5 mr-2" />
                      Request Quote
                    </button>
                    <button className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-300 flex items-center justify-center">
                      <Download className="h-5 w-5 mr-2" />
                      Download Specs
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Related Products */}
              {relatedProducts.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 p-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Related Products</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedProducts.map((product) => (
                      <div 
                        key={product.id}
                        className="bg-gray-50 dark:bg-gray-900/50 rounded-lg overflow-hidden flex cursor-pointer hover:shadow-md transition-shadow"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(product);
                        }}
                      >
                        <div className="w-1/3">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="w-2/3 p-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{product.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-2">{product.description}</p>
                          <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                            View Details
                            <ArrowRight className="ml-1 h-3 w-3" />
            </div>
          </div>
        </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}