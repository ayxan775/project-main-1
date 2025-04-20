import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  LogIn, Save, Trash2, Edit, Plus, X, Package,
  ChevronRight, ChevronLeft, AlertCircle, Image as ImageIcon, Key,
  Database, Download, Upload, CheckCircle
} from 'lucide-react';
import Head from 'next/head';
import { AdminSidePanel } from '../src/components/AdminSidePanel';
import { CategoryManager } from '../src/components/CategoryManager';
import { Product } from '../src/types';
import { ImageUpload } from '../src/components/ImageUpload';

export default function AdminPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [token, setToken] = useState('');
  const [activeSection, setActiveSection] = useState('products');
  
  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');
  
  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  
  // Search and filtering state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '', // Cover image
    category: '',
    specs: [] as string[],
    useCases: [] as string[],
    images: [] as string[] // Interior images
  });
  
  const [newSpec, setNewSpec] = useState('');
  const [newUseCase, setNewUseCase] = useState('');
  
  // Backup state
  const [backupStatus, setBackupStatus] = useState<string | null>(null);
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);
  const [backupFile, setBackupFile] = useState<File | null>(null);
  const [lastBackupDate, setLastBackupDate] = useState<string | null>(null);
  
  // Fetch products with token verification
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
      // Verify token validity
      fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        }
      })
      .then(response => {
        if (response.ok) {
          setToken(storedToken);
          setIsLoggedIn(true);
          fetchProducts();
          fetchCategories();
        } else {
          // Token is invalid, clear it
          localStorage.removeItem('adminToken');
          setIsLoggedIn(false);
        }
      })
      .catch(error => {
        console.error('Error verifying token:', error);
        localStorage.removeItem('adminToken');
        setIsLoggedIn(false);
      });
    }
  }, []);
  
  // Effect to fetch categories when logging in
  useEffect(() => {
    if (isLoggedIn) {
      fetchCategories();
    }
  }, [isLoggedIn]);
  
  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!username || !password) {
      setLoginError('Username and password are required');
      return;
    }
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      
      const data = await response.json();
      
      // Save token to localStorage
      localStorage.setItem('adminToken', data.token);
      
      // Update state
      setToken(data.token);
      setIsLoggedIn(true);
      setUsername('');
      setPassword('');
      
      // Fetch products after login
      fetchProducts();
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(error instanceof Error ? error.message : 'Login failed');
    }
  };
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    setIsLoggedIn(false);
    setProducts([]);
  };
  
  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError('');
    setPasswordChangeSuccess('');
    
    if (newPassword !== confirmPassword) {
      setPasswordChangeError('New passwords do not match');
      return;
    }
    
    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: 'admin', // Hardcoded as we only have one user
          currentPassword,
          newPassword
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }
      
      setPasswordChangeSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Hide the form after a short delay
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordChangeSuccess('');
      }, 2000);
    } catch (error) {
      setPasswordChangeError(error instanceof Error ? error.message : 'Failed to change password');
    }
  };
  
  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data = await response.json();
      setCategories(data.map((category: { name: string }) => category.name));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Add spec to the form
  const handleAddSpec = () => {
    if (newSpec.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        specs: [...prev.specs, newSpec.trim()]
      }));
      setNewSpec('');
    }
  };
  
  // Remove spec from the form
  const handleRemoveSpec = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index)
    }));
  };
  
  // Add use case to the form
  const handleAddUseCase = () => {
    if (newUseCase.trim() !== '') {
      setFormData(prev => ({
        ...prev,
        useCases: [...prev.useCases, newUseCase.trim()]
      }));
      setNewUseCase('');
    }
  };
  
  // Remove use case from the form
  const handleRemoveUseCase = (index: number) => {
    setFormData(prev => ({
      ...prev,
      useCases: prev.useCases.filter((_, i) => i !== index)
    }));
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingProduct(null);
    setSaveError(null);
    setFormData({
      name: '',
      description: '',
      image: '',
      category: '',
      specs: [],
      useCases: [],
      images: []
    });
    setShowProductModal(false);
  };
  
  // Edit a product
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setSaveError(null);
    
    // Ensure we have valid arrays for images
    const interiorImages = product.images || [];
    
    setFormData({
      name: product.name,
      description: product.description,
      image: product.image || '', // Cover image
      category: product.category,
      specs: [...product.specs],
      useCases: [...product.useCases],
      images: interiorImages // Interior images
    });
    
    setShowProductModal(true);
  };
  
  // Open the add product modal
  const handleAddProduct = () => {
    setEditingProduct(null);
    setSaveError(null);
    setFormData({
      name: '',
      description: '',
      image: '',
      category: '',
      specs: [],
      useCases: [],
      images: []
    });
    setShowProductModal(true);
  };
  
  // Save product (create or update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);

    if (!formData.name.trim()) {
      setSaveError('Product name is required');
      return;
    }

    if (!formData.category) {
      setSaveError('Please select a category');
      return;
    }

    // Ensure we have at least a cover image
    if (!formData.image) {
      setSaveError('Cover image is required');
      return;
    }

    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct 
        ? `/api/products?id=${editingProduct.id}` 
        : '/api/products';

      // Create a clean product object for the API
      const productData = {
        ...formData,
        // Ensure image fields are correctly set
        image: formData.image,
        images: formData.images.filter(img => img !== formData.image) // Don't duplicate cover image in interior images
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save product');
      }

      // Refresh product list after successful save
      fetchProducts();

      // Reset form and editing state
      handleCancelEdit();
    } catch (error) {
      console.error('Error saving product:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save product');
    }
  };
  
  // Delete a product
  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }
      
      // Refresh product list after successful delete
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete product');
    }
  };
  
  // Filter products based on search term and category filter
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === '' || 
      product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Create backup of products and categories
  const handleCreateBackup = async () => {
    try {
      // Get full category data from API
      const categoriesResponse = await fetch('/api/categories');
      if (!categoriesResponse.ok) {
        throw new Error('Failed to fetch categories for backup');
      }
      const categoriesData = await categoriesResponse.json();
      
      // Combine products and categories into a single backup object
      const backupData = {
        products: products,
        categories: categoriesData,
        timestamp: new Date().toISOString()
      };
      
      // Convert to JSON and create a downloadable file
      const jsonData = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a download link and trigger it
      const a = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      a.download = `product-data-backup-${timestamp}.json`;
      a.href = url;
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      setLastBackupDate(new Date().toISOString());
      setBackupStatus('Backup created successfully!');
      
      // Clear status after a few seconds
      setTimeout(() => {
        setBackupStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Error creating backup:', error);
      setBackupStatus(`Backup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => {
        setBackupStatus(null);
      }, 5000);
    }
  };
  
  // Handle file selection for restore
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setBackupFile(e.target.files[0]);
    }
  };
  
  // Restore from backup file
  const handleRestore = async () => {
    if (!backupFile) {
      setRestoreStatus('Please select a backup file first');
      return;
    }
    
    try {
      // Read the file content
      const fileContent = await backupFile.text();
      const backupData = JSON.parse(fileContent);
      
      // Validate backup data structure
      if (!backupData.products || !backupData.categories) {
        throw new Error('Invalid backup file format');
      }
      
      // Confirm restore
      if (!confirm('Are you sure you want to restore from this backup? This will replace all current products and categories.')) {
        return;
      }
      
      // Actually restore the data via API
      setRestoreStatus('Restoring data...');
      
      // First restore categories
      for (const category of backupData.categories) {
        // Check if category exists
        const existingCategories = await fetch('/api/categories');
        const existingCategoriesData = await existingCategories.json();
        const exists = existingCategoriesData.some((c: any) => c.name === category.name);
        
        if (!exists) {
          // Create category
          await fetch('/api/categories', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              name: category.name,
              description: category.description || ''
            })
          });
        }
      }
      
      // Then restore products
      for (const product of backupData.products) {
        // For products, we'll update if they exist, otherwise create new
        const method = 'POST'; // Always create new for simplicity
        await fetch('/api/products', {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: product.name,
            description: product.description,
            category: product.category,
            image: product.image,
            images: product.images || [],
            specs: product.specs || [],
            useCases: product.useCases || []
          })
        });
      }
      
      // Refresh data after restore
      await fetchProducts();
      await fetchCategories();
      
      setRestoreStatus('Restore completed successfully!');
      setBackupFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('backup-file') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
      // Clear status after a few seconds
      setTimeout(() => {
        setRestoreStatus(null);
      }, 5000);
    } catch (error) {
      console.error('Error restoring from backup:', error);
      setRestoreStatus(`Restore failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      setTimeout(() => {
        setRestoreStatus(null);
      }, 5000);
    }
  };
  
  // Login form
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Head>
          <title>Admin Login</title>
        </Head>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <Package className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h1>
          </div>
          
          {loginError && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <p>{loginError}</p>
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  // Admin dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      
      <div className="flex">
        <AdminSidePanel
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          onLogout={handleLogout}
        />
        
        <div className="flex-1 flex flex-col">
          <header className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700">
            <div className="px-8 py-6 flex justify-between items-center">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-blue-600 dark:text-blue-400 mr-3" />
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Product Admin Dashboard</h1>
              </div>
            </div>
          </header>

          <main className="p-8">
            {/* Password Change Modal */}
            {showPasswordForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Change Password</h2>
                  
                  {passwordChangeError && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 flex items-start">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                      <p>{passwordChangeError}</p>
                    </div>
                  )}
                  
                  {passwordChangeSuccess && (
                    <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 flex items-start">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                      <p>{passwordChangeSuccess}</p>
                    </div>
                  )}
                  
                  <form onSubmit={handlePasswordChange}>
                    <div className="mb-4">
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Current Password
                      </label>
                      <input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        Update Password
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowPasswordForm(false)}
                        className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Product Modal */}
            {showProductModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-5xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>

                  {saveError && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 flex items-start">
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                      <p>{saveError}</p>
                    </div>
                  )}

                  <form onSubmit={handleSaveProduct}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Product Name *
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Category *
                        </label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          value={formData.description}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <ImageUpload
                          coverImage={formData.image}
                          interiorImages={formData.images}
                          onCoverImageChange={(image) => setFormData(prev => ({ ...prev, image }))}
                          onInteriorImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Specifications
                        </label>
                        <div className="flex items-center mb-2">
                          <input
                            type="text"
                            value={newSpec}
                            onChange={(e) => setNewSpec(e.target.value)}
                            placeholder="Add specification"
                            className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={handleAddSpec}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-r-md transition-colors"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {formData.specs.map((spec, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                              <span className="text-sm text-gray-700 dark:text-gray-200">{spec}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveSpec(index)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Use Cases
                        </label>
                        <div className="flex items-center mb-2">
                          <input
                            type="text"
                            value={newUseCase}
                            onChange={(e) => setNewUseCase(e.target.value)}
                            placeholder="Add use case"
                            className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={handleAddUseCase}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-r-md transition-colors"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {formData.useCases.map((useCase, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                              <span className="text-sm text-gray-700 dark:text-gray-200">{useCase}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveUseCase(index)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <Save className="w-5 h-5 mr-2" />
                        {editingProduct ? 'Update Product' : 'Save Product'}
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-md flex items-center transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Main Content */}
            {activeSection === 'products' && (
              <div className="space-y-8">
                {/* Add Product Button and Products Table */}
                <div className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
                  <button
                    onClick={handleAddProduct}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg flex items-center transition-colors shadow-sm hover:shadow-md"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Product
                  </button>
                </div>

                {/* Products Table */}
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Products</h2>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search Input */}
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 px-3 py-2 pl-10 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                        </div>
                        
                        {/* Category Filter */}
                        <select
                          value={categoryFilter}
                          onChange={(e) => setCategoryFilter(e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        >
                          <option value="">All Categories</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {loading ? (
                    <div className="p-6 text-center">
                      <p className="text-gray-500 dark:text-gray-400">Loading products...</p>
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        {products.length === 0 
                          ? "No products found." 
                          : "No products match your search criteria."}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-750">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Category
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Images
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {product.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {product.name}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                                    {product.description}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                  {product.category}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex -space-x-2">
                                  {/* Cover image first */}
                                  {product.image && (
                                    <div className="relative z-10">
                                      <img
                                        src={product.image}
                                        alt={`${product.name} - Cover`}
                                        className="h-10 w-10 rounded-md object-cover ring-2 ring-white dark:ring-gray-800 border-2 border-blue-500"
                                        title="Cover Image"
                                      />
                                    </div>
                                  )}
                                  
                                  {/* Interior images - filter out the cover image if it's accidentally duplicated */}
                                  {(product.images || [])
                                    .filter(img => img && img !== product.image) // Ensure no duplicates with cover
                                    .slice(0, 3)
                                    .map((img, index) => (
                                      <img
                                        key={index}
                                        src={img}
                                        alt={`${product.name} - Interior ${index + 1}`}
                                        className="h-10 w-10 rounded-md object-cover ring-2 ring-white dark:ring-gray-800"
                                        title={`Interior Image ${index + 1}`}
                                      />
                                    ))
                                  }
                                  
                                  {/* Show count if there are more images - count only unique images that aren't the cover */}
                                  {product.images && 
                                   product.images.filter(img => img && img !== product.image).length > 3 && (
                                    <div className="h-10 w-10 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center ring-2 ring-white dark:ring-gray-800 text-xs font-medium text-gray-500 dark:text-gray-400">
                                      +{product.images.filter(img => img && img !== product.image).length - 3}
                                    </div>
                                  )}
                                  
                                  {/* No images placeholder */}
                                  {!product.image && (!product.images || product.images.length === 0) && (
                                    <div className="h-10 w-10 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                      <ImageIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <div className="flex justify-end space-x-3">
                                  <button
                                    onClick={() => handleEditProduct(product)}
                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                  >
                                    <Edit className="w-5 h-5" />
                                    <span className="sr-only">Edit</span>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                    <span className="sr-only">Delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'categories' && (
              <CategoryManager token={token} />
            )}

            {activeSection === 'password' && (
              <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  Change Password
                </h2>
                
                {passwordChangeError && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 flex items-start">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <p>{passwordChangeError}</p>
                  </div>
                )}
                
                {passwordChangeSuccess && (
                  <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 flex items-start">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <p>{passwordChangeSuccess}</p>
                  </div>
                )}
                
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Current Password
                      </label>
                      <input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-2">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <Key className="w-5 h-5 mr-2" />
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeSection === 'backup' && (
              <div className="space-y-8">
                {/* Backup Section Header */}
                <div className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Backup & Restore</h1>
                  <button
                    onClick={handleCreateBackup}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg flex items-center transition-colors shadow-sm hover:shadow-md"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Create Backup
                  </button>
                </div>
                
                {/* Backup Status */}
                {backupStatus && (
                  <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 flex items-start">
                    <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <p>{backupStatus}</p>
                  </div>
                )}
                
                {/* Restore Section */}
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Restore Data</h2>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Upload a previously created backup file to restore your products and categories.
                    </p>
                    
                    {/* File Upload */}
                    <div className="mb-6">
                      <label htmlFor="backup-file" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Select Backup File
                      </label>
                      <input
                        id="backup-file"
                        type="file"
                        accept=".json"
                        onChange={handleFileChange}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    {/* Restore Button */}
                    <button
                      onClick={handleRestore}
                      disabled={!backupFile}
                      className={`flex items-center px-4 py-2 rounded-md font-medium ${
                        backupFile 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      } transition-colors`}
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      Restore from Backup
                    </button>
                    
                    {/* Restore Status */}
                    {restoreStatus && (
                      <div className={`mt-4 p-3 rounded-lg flex items-start ${
                        restoreStatus.includes('failed') || restoreStatus.includes('select')
                          ? 'bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
                          : 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
                      }`}>
                        {restoreStatus.includes('failed') || restoreStatus.includes('select')
                          ? <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                          : <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                        }
                        <p>{restoreStatus}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Backup Info */}
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Backup Information</h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Data to be backed up:</h3>
                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                          <li>Products ({products.length} items)</li>
                          <li>Categories ({categories.length} items)</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Last backup:</h3>
                        <p className="text-gray-700 dark:text-gray-300">
                          {lastBackupDate 
                            ? new Date(lastBackupDate).toLocaleString() 
                            : 'No backup has been created yet'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
} 