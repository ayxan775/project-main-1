import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router'; // Import useRouter

// Import translations
import en from '../../locales/en.json';
import az from '../../locales/az.json';
import ru from '../../locales/ru.json';

interface CertificationCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  custom: number;
}

export function SafetyStandards() {
  const router = useRouter();
  const { locale } = router;
  const t = locale === 'az' ? az.safetyStandards : locale === 'ru' ? ru.safetyStandards : en.safetyStandards; // Select translations

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -10,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.3
      }
    }
  };

  const CertificationCard = ({ title, icon, description, color, custom }: CertificationCardProps) => (
    <motion.div 
      className={`bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border-t-4 ${color} h-full relative overflow-hidden group`}
      custom={custom}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true }}
    >
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 opacity-50 group-hover:scale-150 transition-all duration-500"></div>
      <div className="absolute -left-6 -bottom-6 w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-700 opacity-20 group-hover:scale-150 transition-all duration-500 delay-100"></div>
      
      <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30 mx-auto mb-6 relative shadow-inner group-hover:shadow-blue-500/10 transition-all duration-300">
        <div className="absolute inset-0 bg-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {icon}
      </div>
      
      <h3 className="text-xl font-bold text-center mb-4 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{title}</h3> {/* Title is passed as prop */}
      <p className="text-gray-600 dark:text-gray-300 text-center">
        {description} {/* Description is passed as prop */}
      </p>

      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-blue-600"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: custom * 0.2 + 0.3 }}
        viewport={{ once: true }}
      />
    </motion.div>
  );

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
      <div className="container mx-auto px-4 relative">
        {/* Decorative elements */}
        <div className="absolute top-40 right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block"
          >
            <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-sm uppercase font-bold tracking-wider py-1 px-3 rounded-full mb-3 inline-block">{t.badge}</span> {/* Use translation */}
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              {t.heading} {/* Use translation */}
            </span>
          </h2>

          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-0">
              {t.subtitle} {/* Use translation */}
            </p>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <CertificationCard
            title={t.card1Title} // Use translation
            color="border-blue-600"
            custom={0}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
            description={t.card1Desc} // Use translation
          />

          <CertificationCard
            title={t.card2Title} // Use translation
            color="border-blue-600"
            custom={1}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            description={t.card2Desc} // Use translation
          />

          <CertificationCard
            title={t.card3Title} // Use translation
            color="border-blue-600"
            custom={2}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            description={t.card3Desc} // Use translation
          />
        </motion.div>
        
        <motion.div 
          className="max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.div 
            className="p-8 md:p-10 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900 rounded-3xl shadow-2xl overflow-hidden relative"
            variants={itemVariants}
          >
            <div className="absolute inset-0 bg-grid-white/[0.05]"></div>
            <div className="absolute -top-16 -right-16 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            
            <motion.h3 
              className="text-2xl font-bold mb-6 text-center text-white"
              variants={itemVariants}
            >
              {t.commitmentTitle} {/* Use translation */}
            </motion.h3>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              variants={itemVariants}
            >
              <motion.div
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 group hover:bg-white/20 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-white/20 rounded-lg mr-4 group-hover:bg-white/30 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-white">{t.commitmentItem1Title}</h4> {/* Use translation */}
                </div>
                <p className="text-blue-100">{t.commitmentItem1Desc}</p> {/* Use translation */}
              </motion.div>

              <motion.div
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 group hover:bg-white/20 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-white/20 rounded-lg mr-4 group-hover:bg-white/30 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-white">{t.commitmentItem2Title}</h4> {/* Use translation */}
                </div>
                <p className="text-blue-100">{t.commitmentItem2Desc}</p> {/* Use translation */}
              </motion.div>

              <motion.div
                className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 group hover:bg-white/20 transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-white/20 rounded-lg mr-4 group-hover:bg-white/30 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-bold text-white">{t.commitmentItem3Title}</h4> {/* Use translation */}
                </div>
                <p className="text-blue-100">{t.commitmentItem3Desc}</p> {/* Use translation */}
              </motion.div>
            </motion.div>

           
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 