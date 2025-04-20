import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { AlertTriangle, FileText, Upload, X } from 'lucide-react';

interface DocumentUploadProps {
  document: string | null;
  onDocumentChange: (document: string) => void;
  maxSize?: number;
}

export function DocumentUpload({
  document,
  onDocumentChange,
  maxSize = 10 * 1024 * 1024 // 10MB default
}: DocumentUploadProps) {
  const [error, setError] = React.useState<string | null>(null);

  // Handle document drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    
    if (acceptedFiles.length === 0) {
      return;
    }
    
    const file = acceptedFiles[0];
    
    // Check file size
    if (file.size > maxSize) {
      setError(`File is too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`);
      return;
    }
    
    // Supported file types: PDF, DOCX, DOC, XLS, XLSX, etc.
    const supportedTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      'application/msword',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/plain'
    ];
    
    if (!supportedTypes.includes(file.type)) {
      setError('Unsupported file type. Please upload a PDF, Word document, Excel sheet, or text file.');
      return;
    }
    
    // Convert to Base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onDocumentChange(result);
    };
    reader.readAsDataURL(file);
  }, [maxSize, onDocumentChange]);
  
  // Setup dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt']
    }
  });
  
  // Clear document
  const handleClearDocument = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDocumentChange('');
  };
  
  // Extract filename from base64 document
  const getFilenameFromDocument = () => {
    if (!document) return null;
    
    // Try to extract the filename from the data URL
    try {
      const matches = document.match(/^data:.*?;name=([^;]+);base64,/);
      if (matches && matches[1]) {
        return decodeURIComponent(matches[1]);
      }
      
      // Fallback to generic name based on type
      if (document.includes('application/pdf')) {
        return 'document.pdf';
      } else if (document.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        return 'document.docx';
      } else if (document.includes('application/msword')) {
        return 'document.doc';
      } else if (document.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        return 'document.xlsx';
      } else if (document.includes('application/vnd.ms-excel')) {
        return 'document.xls';
      } else if (document.includes('text/plain')) {
        return 'document.txt';
      }
    } catch (e) {
      console.error('Error extracting filename:', e);
    }
    
    return 'document';
  };

  return (
    <div className="space-y-2">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 shadow-sm mb-3">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      {document ? (
        <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-750 flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-blue-500 mr-3" />
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-200">
                {getFilenameFromDocument()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Click to replace document
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClearDocument}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-inner'
              : 'border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto text-blue-500 dark:text-blue-400 opacity-75" />
          <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            {isDragActive
              ? 'Drop the document here...'
              : 'Drag & drop document here, or click to select'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Supported formats: PDF, Word, Excel, Text (max {maxSize / (1024 * 1024)}MB)
          </p>
        </div>
      )}
    </div>
  );
} 