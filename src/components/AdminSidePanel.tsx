import React from 'react';
import { Package, Tag, Key, LogOut, Database, Upload, Briefcase, Languages } from 'lucide-react';
import { AdminSection } from '../types';
import { useRouter } from 'next/router'; // Import useRouter

// Import translations
import en from '../../locales/en.json';
import az from '../../locales/az.json';
import ru from '../../locales/ru.json';

interface AdminSidePanelProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

export function AdminSidePanel({ activeSection, onSectionChange, onLogout }: AdminSidePanelProps) {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'az' ? az.adminSidePanel : locale === 'ru' ? ru.adminSidePanel : en.adminSidePanel; // Select translations

  const sections: AdminSection[] = [
    { id: 'products', name: t.sectionProducts, icon: <Package className="w-5 h-5" /> },
    { id: 'categories', name: t.sectionCategories, icon: <Tag className="w-5 h-5" /> },
    { id: 'catalog', name: t.sectionCatalog, icon: <Upload className="w-5 h-5" /> },
    { id: 'careers', name: t.sectionCareers, icon: <Briefcase className="w-5 h-5" /> },
    { id: 'translations', name: t.sectionTranslations, icon: <Languages className="w-5 h-5" /> },
    { id: 'backup', name: t.sectionBackup, icon: <Database className="w-5 h-5" /> },
    { id: 'password', name: t.sectionPassword, icon: <Key className="w-5 h-5" /> }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 w-64 min-h-screen shadow-lg border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t.title}</h1> {/* Use translation */}
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              activeSection === section.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className={activeSection === section.id ? 'text-white' : 'text-blue-600 dark:text-blue-400'}>
              {section.icon}
            </span>
            <span className="font-medium">{section.name}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-3 px-4 py-3 rounded-lg text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{t.logoutButton}</span> {/* Use translation */}
        </button>
      </div>
    </div>
  );
} 