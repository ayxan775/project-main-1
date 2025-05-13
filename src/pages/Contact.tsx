import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Contact } from '../components/Contact';
import { HelpCircle, Clock, MessageSquare, Phone, Mail } from 'lucide-react';
import { useRouter } from 'next/router';

// Import translations
import en from '../../locales/en.json';
import az from '../../locales/az.json';
import ru from '../../locales/ru.json';

export function ContactPage() {
  const router = useRouter();
  const { locale } = router;

  // Determine translations based on current locale
  const t = locale === 'az' ? az.contactPageContent : locale === 'ru' ? ru.contactPageContent : en.contactPageContent;
  const tGlobal = locale === 'az' ? az : locale === 'ru' ? ru : en; // For header.contactUs
  const pageTitle = `${tGlobal.header.contactUs} | AzPort Supply`;
  const pageDescription = t.heroSubtitle;
  const siteUrl = 'https://azportsupply.com'; // Ensure this is your correct domain
  const canonicalUrl = `${siteUrl}${router.asPath}`;

  const faqVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const faqs = [
    {
      question: t.faq1Question,
      answer: t.faq1Answer
    },
    {
      question: t.faq2Question,
      answer: t.faq2Answer
    },
    {
      question: t.faq3Question,
      answer: t.faq3Answer
    },
    {
      question: t.faq4Question,
      answer: t.faq4Answer
    }
  ];

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
      </Head>
      <div className="pt-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/10">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm uppercase font-bold tracking-wider py-1 px-3 rounded-full mb-6 inline-block">
              {t.heroBadge}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">
              {t.heroHeading}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              {t.heroSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <Contact />

      {/* Quick Contact Options */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl font-bold mb-6 dark:text-white">{t.quickContactHeading}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t.quickContactSubtitle}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Phone className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 dark:text-white">{t.callUsTitle}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{t.callUsDescription}</p>
              <a href={`tel:${t.callUsPhone.replace(/\s/g, '')}`} className="text-blue-600 dark:text-blue-400 hover:underline">{t.callUsPhone}</a>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Mail className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 dark:text-white">{t.emailUsTitle}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{t.emailUsDescription}</p>
              <a href={`mailto:${t.emailUsEmail}`} className="text-blue-600 dark:text-blue-400 hover:underline">{t.emailUsEmail}</a>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-blue-100 dark:bg-blue-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Clock className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 dark:text-white">{t.businessHoursTitle}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{t.businessHoursLine1}</p>
              <p className="text-gray-600 dark:text-gray-300">{t.businessHoursLine2}</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-sm uppercase font-bold tracking-wider py-1 px-3 rounded-full mb-6 inline-block">
              {t.faqBadge}
            </span>
            <h2 className="text-3xl font-bold mb-6 dark:text-white">{t.faqHeading}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t.faqSubtitle}
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="mb-6"
                variants={faqVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index}
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-4">
                      <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 dark:text-white">{faq.question}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="bg-white/10 p-2 rounded-full inline-flex items-center mb-8">
              <MessageSquare className="h-5 w-5 text-white mr-2" />
              <span className="text-white text-sm font-medium">{t.ctaSupportBadge}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t.ctaHeading}
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              {t.ctaSubtitle}
            </p>
            <motion.button
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t.ctaButton}
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
    </>
  );
}