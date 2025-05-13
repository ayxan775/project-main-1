import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import en from '../../locales/en.json';
import az from '../../locales/az.json';
import ru from '../../locales/ru.json';

// Define a type for the translation structure
type TranslationObject = { [key: string]: string | TranslationObject };
type Translations = { [key: string]: TranslationObject };

export function TranslationManager() {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'az' ? az.translationManager : locale === 'ru' ? ru.translationManager : en.translationManager;

  const [englishTranslations, setEnglishTranslations] = useState<TranslationObject | null>(null);
  const [azerbaijaniTranslations, setAzerbaijaniTranslations] = useState<TranslationObject | null>(null);
  const [russianTranslations, setRussianTranslations] = useState<TranslationObject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, you'd fetch these from an API endpoint
    // For now, we'll use the imported JSON directly
    try {
      setEnglishTranslations(en as TranslationObject);
      setAzerbaijaniTranslations(az as TranslationObject);
      setRussianTranslations(ru as TranslationObject);
    } catch (e) {
      console.error("Error loading translations:", e);
      setError(t.errorLoading);
    } finally {
      setIsLoading(false);
    }
  }, [t.errorLoading]);

  const handleInputChange = (
    lang: 'en' | 'az' | 'ru',
    path: string[],
    value: string
  ) => {
    let translations;
    let setTranslations;

    if (lang === 'en') {
      translations = englishTranslations;
      setTranslations = setEnglishTranslations;
    } else if (lang === 'az') {
      translations = azerbaijaniTranslations;
      setTranslations = setAzerbaijaniTranslations;
    } else {
      translations = russianTranslations;
      setTranslations = setRussianTranslations;
    }

    if (!translations || !setTranslations) return;

    // Deep clone the object to avoid direct state mutation
    const newTranslations = JSON.parse(JSON.stringify(translations));
    let current = newTranslations;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]] as TranslationObject;
    }
    current[path[path.length - 1]] = value;
    setTranslations(newTranslations);
  };

  const renderTranslations = (
    obj: TranslationObject,
    currentPath: string[] = [],
    lang: 'en' | 'az' | 'ru'
  ) => {
    return Object.keys(obj).map((key) => {
      const value = obj[key];
      const newPath = [...currentPath, key];
      if (typeof value === 'string') {
        return (
          <div key={newPath.join('.')} className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
            <label htmlFor={newPath.join('.')} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {newPath.join(' > ')}
            </label>
            <input
              type="text"
              id={newPath.join('.')}
              value={value}
              onChange={(e) => handleInputChange(lang, newPath, e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-gray-100"
            />
          </div>
        );
      } else if (typeof value === 'object' && value !== null) {
        return (
          <div key={newPath.join('.')} className="mb-6 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 border-b pb-2 dark:border-gray-700">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </h3>
            {renderTranslations(value as TranslationObject, newPath, lang)}
          </div>
        );
      }
      return null;
    });
  };

  const handleSaveChanges = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      alert('Authentication token not found. Please log in again.');
      // Optionally redirect to login or handle appropriately
      return;
    }

    try {
      const response = await fetch('/api/translations/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          en: englishTranslations,
          az: azerbaijaniTranslations,
          ru: russianTranslations
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save translations');
      }
      alert(result.message || 'Translations saved successfully!');
    } catch (error) {
      console.error('Error saving translations:', error);
      alert('Error saving translations: ' + (error as Error).message);
    }
  };


  if (isLoading) {
    return <div className="p-6 text-gray-700 dark:text-gray-300">{t.loading}</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600 dark:text-red-400">{error}</div>;
  }

  if (!englishTranslations || !azerbaijaniTranslations || !russianTranslations ||
      typeof englishTranslations !== 'object' ||
      typeof azerbaijaniTranslations !== 'object' ||
      typeof russianTranslations !== 'object' ||
      Object.keys(englishTranslations).length === 0) { // Assuming en is the base and always present
    return <div className="p-6 text-gray-700 dark:text-gray-300">{t.noTranslations}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-300 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t.title}</h2>
          <button
            onClick={handleSaveChanges}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition ease-in-out duration-150"
          >
            {t.saveChanges}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t.english}</h3>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              {renderTranslations(englishTranslations, [], 'en')}
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">{t.azerbaijani}</h3>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              {renderTranslations(azerbaijaniTranslations, [], 'az')}
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {/* Assuming you'll add a "russian" key to translationManager in locale files */}
              { (t as any).russian || "Russian" }
            </h3>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              {renderTranslations(russianTranslations, [], 'ru')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}