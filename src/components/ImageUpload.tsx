import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, AlertTriangle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/router'; // Import useRouter

// Import translations
import en from '../../locales/en.json';
import az from '../../locales/az.json';
import ru from '../../locales/ru.json';

interface ImageUploadProps {
  coverImage: string;
  interiorImages: string[];
  onCoverImageChange: (image: string) => void;
  onInteriorImagesChange: (images: string[]) => void;
  maxSize?: number; // Max file size in bytes, defaults to 5MB
}

export function ImageUpload({ 
  coverImage, 
  interiorImages, 
  onCoverImageChange, 
  onInteriorImagesChange,
  maxSize = 5 * 1024 * 1024 // 5MB default
}: ImageUploadProps) {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'az' ? az.imageUpload : locale === 'ru' ? ru.imageUpload : en.imageUpload; // Select translations

  const [error, setError] = React.useState<string | null>(null);

  const validateImage = async (url: string, isCover: boolean = false) => {
    try {
      const img = new Image();
      img.src = url;
      
      return new Promise((resolve, reject) => {
        img.onload = () => {
          // For cover images
          if (isCover) {
            // Recommended dimensions: 800x600 to 1200x900 (4:3 ratio)
            if (img.width < 800 || img.height < 600) {
              reject(t.errorCoverSmall); // Use translation
            } else if (img.width > 1200 || img.height > 900) {
              reject(t.errorCoverLarge); // Use translation
            } else if (Math.abs(img.width / img.height - 4/3) > 0.1) {
              reject(t.errorCoverAspectRatio); // Use translation
            }
          }
          // For interior images
          else {
            if (img.width < 600 || img.height < 400) {
              reject(t.errorInteriorSmall); // Use translation
            }
          }
          resolve(true);
        };
        img.onerror = () => reject(t.errorLoadFail); // Use translation
      });
    } catch (error) {
      throw new Error(t.errorInvalidUrl); // Use translation
    }
  };

  const handleCoverImageChange = async (url: string) => {
    try {
      setError(null);
      await validateImage(url, true);
      onCoverImageChange(url);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    }
  };

  const handleInteriorImageChange = async (url: string) => {
    try {
      setError(null);
      await validateImage(url);
      onInteriorImagesChange([...interiorImages, url]);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    }
  };

  const onDropCover = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    handleRejectedFiles(rejectedFiles);
    
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0]; // Only use the first file for cover
    if (file.size > maxSize) {
      setError(t.errorFileTooLarge.replace('{size}', (maxSize / (1024 * 1024)).toString())); // Use translation
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        handleCoverImageChange(e.target.result as string);
      }
    };
    reader.onerror = () => {
      setError(t.errorReadFail); // Use translation
    };
    reader.readAsDataURL(file);
  }, [onCoverImageChange, maxSize, handleCoverImageChange, t]);

  const onDropInterior = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    handleRejectedFiles(rejectedFiles);
    
    if (acceptedFiles.length === 0) return;
    
    acceptedFiles.forEach(file => {
      if (file.size > maxSize) {
        setError(t.errorFileTooLarge.replace('{size}', (maxSize / (1024 * 1024)).toString())); // Use translation
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          handleInteriorImageChange(e.target.result as string);
        }
      };
      reader.onerror = () => {
        setError(t.errorReadFail); // Use translation
      };
      reader.readAsDataURL(file);
    });
  }, [interiorImages, onInteriorImagesChange, maxSize, handleInteriorImageChange, t]);

  const handleRejectedFiles = (rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const errorMessages = rejectedFiles.map(rejection => {
        const errors = rejection.errors.map((e: any) => e.message).join(', ');
        return `${rejection.file.name}: ${errors}`;
      });
      setError(errorMessages.join('; '));
    }
  };

  const { getRootProps: getCoverRootProps, getInputProps: getCoverInputProps, isDragActive: isCoverDragActive } = useDropzone({
    onDrop: onDropCover,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false,
    maxSize
  });

  const { getRootProps: getInteriorRootProps, getInputProps: getInteriorInputProps, isDragActive: isInteriorDragActive } = useDropzone({
    onDrop: onDropInterior,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: true,
    maxSize
  });

  const removeCoverImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      onCoverImageChange('');
      console.log('Cover image removed successfully');
    } catch (error) {
      console.error('Error removing cover image:', error);
      setError(t.errorRemoveCover); // Use translation
    }
  };

  const removeInteriorImage = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (index < 0 || index >= interiorImages.length) {
        console.error(`Invalid image index: ${index}`);
        setError(t.errorInvalidIndex.replace('{index}', index.toString())); // Use translation
        return;
      }

      const newImages = [...interiorImages];
      newImages.splice(index, 1);
      onInteriorImagesChange(newImages);
      console.log(`Interior image at index ${index} removed successfully`);
    } catch (error) {
      console.error(`Error removing interior image at index ${index}:`, error);
      setError(t.errorRemoveInterior); // Use translation
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 shadow-sm">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Cover Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t.labelCover} {/* Use translation */}
        </label>

        <div
          {...getCoverRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
            isCoverDragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-inner'
              : 'border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md'
          }`}
        >
          <input {...getCoverInputProps()} />
          <ImageIcon className="w-12 h-12 mx-auto text-blue-500 dark:text-blue-400 opacity-75" />
          <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            {isCoverDragActive
              ? t.dropzoneCoverActive // Use translation
              : t.dropzoneCoverInactive} {/* Use translation */}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {t.dropzoneHint.replace('{size}', (maxSize / (1024 * 1024)).toString())} {/* Use translation */}
          </p>
        </div>

        {coverImage && (
          <div className="mt-4">
            <div className="relative group inline-block overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
              <img
                src={coverImage}
                alt={t.altCover} // Use translation
                className="h-40 w-auto object-contain"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={removeCoverImage}
                  className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow-sm"
                  aria-label={t.ariaRemoveCover} // Use translation
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interior Images Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t.labelInterior} {/* Use translation */}
        </label>

        <div
          {...getInteriorRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
            isInteriorDragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-inner'
              : 'border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md'
          }`}
        >
          <input {...getInteriorInputProps()} />
          <Upload className="w-12 h-12 mx-auto text-blue-500 dark:text-blue-400 opacity-75" />
          <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
            {isInteriorDragActive
              ? t.dropzoneInteriorActive // Use translation
              : t.dropzoneInteriorInactive} {/* Use translation */}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {t.dropzoneHint.replace('{size}', (maxSize / (1024 * 1024)).toString())} {/* Use translation */}
          </p>
        </div>

        {interiorImages.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {interiorImages.map((image, index) => (
              <div key={index} className="relative group rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700">
                <img
                  src={image}
                  alt={t.altInterior.replace('{index}', (index + 1).toString())} // Use translation
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={(e) => removeInteriorImage(index, e)}
                    className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors shadow-sm"
                    aria-label={t.ariaRemoveInterior.replace('{index}', (index + 1).toString())} // Use translation
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 