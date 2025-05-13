import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileText, CheckCircle, Calendar, ArrowLeft, Download } from 'lucide-react';
import { useRouter } from 'next/router'; // Import useRouter

// Import translations
import en from '../../locales/en.json';
import az from '../../locales/az.json';
import ru from '../../locales/ru.json';

interface CertificationDetailsProps {
  certification: {
    name: string;
    description: string;
    icon: React.ReactNode;
    validUntil: string;
    issuer?: string;
    issueDate?: string;
    certificationNumber?: string;
    scope?: string;
    requirements?: string[];
  };
  onClose: () => void;
}

export function CertificationDetails({ certification, onClose }: CertificationDetailsProps) {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'az' ? az.certificationDetails : locale === 'ru' ? ru.certificationDetails : en.certificationDetails; // Select translations

  const {
    name, // Comes from props, potentially needs translation at source
    description, // Comes from props, potentially needs translation at source
    icon,
    validUntil,
    issuer = t.defaultIssuer, // Use translated default
    issueDate = t.defaultIssueDate, // Use translated default
    certificationNumber = t.defaultCertNumber, // Use translated default
    scope = t.defaultScope, // Use translated default
    requirements = [ // Use translated defaults
      t.defaultReq1,
      t.defaultReq2,
      t.defaultReq3,
      t.defaultReq4,
      t.defaultReq5
    ]
  } = certification;

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
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t.labelIssueDate}</h3> {/* Use translation */}
                </div>
                <p className="text-gray-600 dark:text-gray-300">{issueDate}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t.labelValidUntil}</h3> {/* Use translation */}
                </div>
                <p className="text-gray-600 dark:text-gray-300">{validUntil}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t.labelIssuer}</h3> {/* Use translation */}
                </div>
                <p className="text-gray-600 dark:text-gray-300">{issuer}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">{t.labelCertNumber}</h3> {/* Use translation */}
                </div>
                <p className="text-gray-600 dark:text-gray-300">{certificationNumber}</p>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.titleDescription}</h3> {/* Use translation */}
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.titleScope}</h3> {/* Use translation */}
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{scope}</p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t.titleRequirements}</h3> {/* Use translation */}
              <ul className="space-y-2">
                {requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">{requirement}</span>
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
                {t.buttonDownload} {/* Use translation */}
                <Download className="ml-2 h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
} 