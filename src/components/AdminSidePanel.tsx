import React from 'react';
import { Package, Tag, Key, LogOut, Database, Upload } from 'lucide-react';
import { AdminSection } from '../types';

interface AdminSidePanelProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

export function AdminSidePanel({ activeSection, onSectionChange, onLogout }: AdminSidePanelProps) {
  const sections: AdminSection[] = [
    { id: 'products', name: 'Products', icon: <Package className="w-5 h-5" /> },
    { id: 'categories', name: 'Categories', icon: <Tag className="w-5 h-5" /> },
    { id: 'catalog', name: 'Catalog', icon: <Upload className="w-5 h-5" /> },
    { id: 'backup', name: 'Backup & Restore', icon: <Database className="w-5 h-5" /> },
    { id: 'password', name: 'Change Password', icon: <Key className="w-5 h-5" /> }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 w-64 min-h-screen shadow-lg border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
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
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
} 