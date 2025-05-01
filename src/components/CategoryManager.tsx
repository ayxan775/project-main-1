import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, AlertCircle } from 'lucide-react';
import { Category } from '../types';

interface CategoryManagerProps {
  token: string;
  onCategoryChange?: () => void;
}

export function CategoryManager({ token, onCategoryChange }: CategoryManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError('Failed to load categories');
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Edit category
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: ''
    });
  };

  // Save category (create or update)
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Category name is required');
      return;
    }

    try {
      const method = editingCategory ? 'PUT' : 'POST';
      const url = editingCategory 
        ? `/api/categories?id=${editingCategory.id}` 
        : '/api/categories';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save category');
      }

      // Refresh category list and reset form
      await fetchCategories();
      handleCancelEdit();
      
      // Notify parent component that categories have changed
      if (onCategoryChange) {
        onCategoryChange();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save category');
    }
  };

  // Delete category
  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const response = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchCategories();
        
        // Notify parent component that categories have changed
        if (onCategoryChange) {
          onCategoryChange();
        }
        return;
      }

      // Handle the case where a category can't be deleted due to products using it
      const errorData = await response.json();
      
      if (errorData.canReassign && errorData.productsCount > 0) {
        const categoryToDelete = categories.find(cat => cat.id === id);
        const otherCategories = categories.filter(cat => cat.id !== id);
        
        if (otherCategories.length === 0) {
          alert('Cannot delete this category because it contains products and there are no other categories to move them to.');
          return;
        }
        
        // Ask user which category to reassign products to
        const reassign = confirm(
          `This category contains ${errorData.productsCount} products. Would you like to reassign them to another category?`
        );
        
        if (reassign) {
          // Create a dropdown for selecting the target category
          const selectTarget = document.createElement('select');
          selectTarget.innerHTML = otherCategories.map(cat => 
            `<option value="${cat.name}">${cat.name}</option>`
          ).join('');
          
          const container = document.createElement('div');
          container.innerHTML = `
            <p>Select a category to move ${errorData.productsCount} products from "${categoryToDelete?.name}":</p>
          `;
          container.appendChild(selectTarget);
          
          // Use a custom dialog or modal in your app
          const targetCategory = prompt(
            `Select a category to move ${errorData.productsCount} products to:`,
            otherCategories[0].name
          );
          
          if (targetCategory && otherCategories.some(cat => cat.name === targetCategory)) {
            // Call the API with the reassignment option
            const reassignResponse = await fetch(`/api/categories?id=${id}&reassignTo=${encodeURIComponent(targetCategory)}`, {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (reassignResponse.ok) {
              const result = await reassignResponse.json();
              alert(`Category deleted successfully. ${result.reassigned} products were moved to "${targetCategory}".`);
              await fetchCategories();
              
              // Notify parent component that categories have changed
              if (onCategoryChange) {
                onCategoryChange();
              }
            } else {
              const reassignError = await reassignResponse.json();
              setError(reassignError.message || 'Failed to reassign products and delete category');
            }
          }
        }
        return;
      }
      
      throw new Error(errorData.message || 'Failed to delete category');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          {editingCategory ? 'Edit Category' : 'Add New Category'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSaveCategory} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center transition-colors shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Save className="w-5 h-5 mr-2" />
              {editingCategory ? 'Update Category' : 'Save Category'}
            </button>

            {editingCategory && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-md flex items-center transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Categories</h2>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No categories found.</p>
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
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {category.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {category.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                          <span className="sr-only">Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
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
  );
} 