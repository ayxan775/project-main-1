import React, { useState, useEffect } from 'react';
import { DocumentUpload } from './DocumentUpload';
import { Download, AlertTriangle, Trash2, RefreshCw } from 'lucide-react';

export function CatalogManager() {
  const [catalog, setCatalog] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch current catalog status
  useEffect(() => {
    fetchCatalogStatus();
  }, []);

  const fetchCatalogStatus = async () => {
    try {
      setRefreshing(true);
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/catalog/status?t=${timestamp}`);
      if (response.ok) {
        const data = await response.json();
        setCatalog(data.catalog);
      }
    } catch (error) {
      console.error('Error fetching catalog status:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCatalogUpload = async (document: string) => {
    setError(null);
    setLoading(true);
    setUploadSuccess(false);

    try {
      const response = await fetch('/api/catalog/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ catalog: document }),
      });

      if (!response.ok) {
        throw new Error('Failed to upload catalog');
      }

      // Refresh catalog status after successful upload
      await fetchCatalogStatus();
      
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to upload catalog');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCatalog = async () => {
    setError(null);
    setLoading(true);
    setDeleteSuccess(false);

    try {
      const response = await fetch('/api/catalog/delete', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete catalog');
      }

      // Refresh catalog status after successful deletion
      setCatalog(null);
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete catalog');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshCatalog = () => {
    fetchCatalogStatus();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="border-b border-gray-200 dark:border-gray-700 pb-5">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Catalog Management</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Upload and manage your product catalog PDF. This will be available for customers to download.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5" />
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      {uploadSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-sm text-green-700 dark:text-green-300">
            Catalog uploaded successfully!
          </p>
        </div>
      )}

      {deleteSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-sm text-green-700 dark:text-green-300">
            Catalog deleted successfully!
          </p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">Upload Catalog</h4>
          <button 
            onClick={handleRefreshCatalog}
            className="flex items-center text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            title="Refresh catalog status"
          >
            <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <DocumentUpload
          document={catalog}
          onDocumentChange={handleCatalogUpload}
          maxSize={20 * 1024 * 1024} // 20MB limit
        />
        {loading && (
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Uploading catalog...
          </div>
        )}
      </div>

      {catalog && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">Current Catalog</h4>
              <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                A catalog is currently available for download
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleDeleteCatalog}
                className="flex items-center text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                title="Delete current catalog"
              >
                <Trash2 className="h-5 w-5" />
              </button>
              <Download className="h-5 w-5 text-blue-500 dark:text-blue-400" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 