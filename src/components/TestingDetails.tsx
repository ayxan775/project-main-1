import React from 'react';
import { motion } from 'framer-motion';
import { Microscope, FileText, CheckCircle, Calendar, ArrowLeft, Download, ClipboardList, Clock, Beaker } from 'lucide-react';
import { useRouter } from 'next/router'; // Import useRouter

// Import translations
import en from '../../locales/en.json';
import az from '../../locales/az.json';
import ru from '../../locales/ru.json';

interface TestingDetailsProps {
  service: {
    name: string;
    description: string;
    icon: React.ReactNode;
    turnaround: string;
    methodology?: string;
    equipment?: string[];
    standardsCompliance?: string[];
    sampleRequirements?: string;
  };
  onClose: () => void;
}

export function TestingDetails({ service, onClose }: TestingDetailsProps) {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'az' ? az.testingDetails : locale === 'ru' ? ru.testingDetails : en.testingDetails; // Select translations

  const {
    name, // Comes from props
    description, // Comes from props
    icon,
    turnaround, // Comes from props
    methodology = t.defaultMethodology, // Use translated default
    equipment = [ // Use translated defaults
      t.defaultEquipment1,
      t.defaultEquipment2,
      t.defaultEquipment3,
      t.defaultEquipment4,
      t.defaultEquipment5
    ],
    standardsCompliance = [ // Use translated defaults
      t.defaultStandard1,
      t.defaultStandard2,
      t.defaultStandard3,
      t.defaultStandard4
    ],
    sampleRequirements = t.defaultSampleReq // Use translated default
  } = service;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div className="absolute top-4 left-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="bg-white dark:bg-gray-700 p-2 rounded-full shadow-md"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </motion.button>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-8 flex items-center justify-center flex-col rounded-t-xl">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-lg mb-4">
              {icon}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white text-center">{name}</h2>
            <p className="text-blue-600 dark:text-blue-400 font-medium mt-2">{t.modalSubtitle}</p> {/* Use translation */}
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t.labelTurnaround}</h3> {/* Use translation */}
                </div>
                <p className="text-gray-600 dark:text-gray-300">{turnaround}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t.labelSampleReq}</h3> {/* Use translation */}
                </div>
                <p className="text-gray-600 dark:text-gray-300">{sampleRequirements}</p>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.titleDescription}</h3> {/* Use translation */}
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.titleMethodology}</h3> {/* Use translation */}
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{methodology}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.titleEquipment}</h3> {/* Use translation */}
              <ul className="space-y-2">
                {equipment.map((item, index) => (
                  <li key={index} className="flex items-start">
                    <Beaker className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.titleStandards}</h3> {/* Use translation */}
              <ul className="space-y-2">
                {standardsCompliance.map((standard, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">{standard}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center shadow-md"
              >
                {t.buttonRequestQuote} {/* Use translation */}
                <Download className="ml-2 h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 