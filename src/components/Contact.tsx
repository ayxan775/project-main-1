import { useState, useRef, useEffect } from 'react';
import { MapPin, Phone, Mail, Send, MessageSquare, Clock, Map, X, Facebook, Instagram, Linkedin, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router'; // Import useRouter
import ReCAPTCHA from 'react-google-recaptcha';

// Import translations
import en from '../../locales/en.json';
import az from '../../locales/az.json';
import ru from '../../locales/ru.json';

// Define an interface for the contact translation keys
interface ContactTranslations {
  labelName: string;
  placeholderName: string;
  labelEmail: string;
  placeholderEmail: string;
  labelSubject: string;
  placeholderSubject: string;
  labelMessage: string;
  placeholderMessage: string;
  buttonSend: string;
  buttonSending?: string; // Optional as it might not be in all locale files initially
  alertSuccess: string;
  alertError?: string; // Optional for the same reason
  recaptchaError?: string; // Add recaptchaError to translations
  modalDefaultTitle: string;
  pageBadge: string;
  pageHeading1: string;
  pageHeading2: string;
  pageSubtitle: string;
  infoTitle: string;
  infoLabelPhone: string;
  infoLabelEmail: string;
  infoLabelLocation: string;
  infoLabelHours: string;
  infoHoursLine1: string;
  infoHoursLine2: string;
  infoLabelFollow: string;
  formTitle: string;
  mapOverlayTitle: string;
  mapOverlayText: string;
  mapLink: string;
  // Add any other keys that are part of your contact translations
}

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  attachment?: File | null;
  recaptchaToken?: string | null;
}

interface ContactProps {
  isModal?: boolean;
  modalTitle?: string;
  initialValues?: ContactFormData;
  onClose?: () => void;
}

export function Contact({ isModal, modalTitle, initialValues, onClose }: ContactProps) {
  const router = useRouter();
  const { locale } = router;
  const t = (locale === 'az' ? az.contact : locale === 'ru' ? ru.contact : en.contact) as ContactTranslations; // Select and cast translations

  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [formData, setFormData] = useState<ContactFormData>(initialValues || {
    name: '',
    email: '',
    subject: '',
    message: '',
    attachment: null,
    recaptchaToken: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [fileError, setFileError] = useState<string | null>(null);
  const [recaptchaError, setRecaptchaError] = useState<string | null>(null);

  // Text field character limits
  const MAX_NAME_LENGTH = 100;
  const MAX_SUBJECT_LENGTH = 200;
  const MAX_MESSAGE_LENGTH = 2000;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

  const handleRecaptchaChange = (token: string | null) => {
    if (token) {
      setRecaptchaError(null);
      setFormData(prev => ({
        ...prev,
        recaptchaToken: token
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let trimmedValue = value;
    if (name === 'name' && value.length > MAX_NAME_LENGTH) {
      trimmedValue = value.slice(0, MAX_NAME_LENGTH);
    } else if (name === 'subject' && value.length > MAX_SUBJECT_LENGTH) {
      trimmedValue = value.slice(0, MAX_SUBJECT_LENGTH);
    } else if (name === 'message' && value.length > MAX_MESSAGE_LENGTH) {
      trimmedValue = value.slice(0, MAX_MESSAGE_LENGTH);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: trimmedValue
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setFileError(null);
    
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`File size exceeds 5MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        attachment: file
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        attachment: null
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fileError) return;
    
    if (!formData.recaptchaToken) {
      setRecaptchaError(t.recaptchaError || 'Please verify that you are not a robot.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('subject', formData.subject);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('recaptchaToken', formData.recaptchaToken || '');
      
      if (formData.attachment) {
        formDataToSend.append('attachment', formData.attachment);
      }

      const response = await fetch('/api/send-email', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage(t.alertSuccess || "Message sent successfully! We will contact you shortly.");
        if (!isModal) {
            setFormData({ name: '', email: '', subject: '', message: '', attachment: null, recaptchaToken: null });
            recaptchaRef.current?.reset();
        }
      } else {
        setSubmitStatus('error');
        setSubmitMessage(t.alertError || "Sorry, we couldn't send your message. Please try again.");
        recaptchaRef.current?.reset();
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage(t.alertError || "Sorry, we couldn't send your message. Please try again.");
      recaptchaRef.current?.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (isModal) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{modalTitle || t.modalDefaultTitle}</h3>
          {onClose && ! (submitStatus === 'success') && ( 
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>
        
        {/* Conditional rendering for form, success message, or error message */}
        {!submitStatus && ( // Show form if submitStatus is null or empty
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.labelName}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-16 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
                  placeholder={t.placeholderName}
                  maxLength={MAX_NAME_LENGTH}
                  required
                />
                <span className="absolute bottom-2.5 right-3 text-xs text-gray-400 dark:text-gray-500 pointer-events-none">{formData.name.length}/{MAX_NAME_LENGTH}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.labelEmail}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
                  placeholder={t.placeholderEmail}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.labelSubject}</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MessageSquare className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-16 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
                  placeholder={t.placeholderSubject}
                  maxLength={MAX_SUBJECT_LENGTH}
                  required
                />
                <span className="absolute bottom-2.5 right-3 text-xs text-gray-400 dark:text-gray-500 pointer-events-none">{formData.subject.length}/{MAX_SUBJECT_LENGTH}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.labelMessage}</label>
              <div className="relative">
                <textarea
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 pr-16 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
                  placeholder={t.placeholderMessage}
                  maxLength={MAX_MESSAGE_LENGTH}
                  required
                ></textarea>
                <span className="absolute bottom-2.5 right-3 text-xs text-gray-400 dark:text-gray-500 pointer-events-none">{formData.message.length}/{MAX_MESSAGE_LENGTH}</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Attachment (optional, max 5MB)</label>
              <div className="relative">
                <label htmlFor="modalAttachment" className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors duration-300 focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400 focus-within:border-blue-500 dark:focus-within:border-blue-400">
                  <UploadCloud className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                  <span>{formData.attachment ? formData.attachment.name : 'Choose File'}</span>
                </label>
                <input
                  id="modalAttachment"
                  type="file"
                  onChange={handleFileChange}
                  className="sr-only"
                />
                {fileError && (
                  <p className="text-sm text-red-500 mt-1">{fileError}</p>
                )}
                {formData.attachment && !fileError && (
                  <p className="text-sm text-green-500 mt-1">
                    Selected: {formData.attachment.name} ({(formData.attachment.size / (1024 * 1024)).toFixed(2)}MB)
                  </p>
                )}
              </div>
            </div>
            
            <div className="mt-3">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LdnxjorAAAAAE8GP_mvWHXUXeNRTRTO7Zvega3b"
                onChange={handleRecaptchaChange}
                onErrored={() => setRecaptchaError(t.recaptchaError || 'Failed to load reCAPTCHA. Please try again.')}
              />
            </div>
            {recaptchaError && (
              <p className="text-sm text-red-500 mt-1">{recaptchaError}</p>
            )}
            
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="pt-1"
            >
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-2.5 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/30 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t.buttonSending || 'Sending...'}
                  </>
                ) : (
                  <>
                    <span>{t.buttonSend}</span>
                    <Send className="h-5 w-5 ml-2" />
                  </>
                )}
              </button>
            </motion.div>
            {/* Removed inline error message from here */}
          </form>
        )}

        {submitStatus === 'success' && isModal && submitMessage && (
          <div className="mt-4 p-4 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
            <div className="flex justify-between items-center">
              <p>{submitMessage}</p>
              <button
                onClick={() => {
                  setFormData({ name: '', email: '', subject: '', message: '', attachment: null, recaptchaToken: null });
                  recaptchaRef.current?.reset();
                  setSubmitStatus(null);
                  setSubmitMessage('');
                  onClose?.();
                }}
                className="text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 p-1 rounded-full -mr-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {submitStatus === 'error' && isModal && submitMessage && (
          <div className="mt-4 p-4 rounded-md bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
            <div className="flex justify-between items-center">
              <p>{submitMessage}</p>
              <button
                onClick={() => {
                  setSubmitStatus(null);
                  setSubmitMessage('');
                }}
                className="text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 p-1 rounded-full -mr-1"
                title="Try again"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full Contact page with location and other details
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <div className="absolute top-40 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <motion.div
          className="text-center mb-20 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block"
          >
            <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-sm uppercase font-bold tracking-wider py-1 px-3 rounded-full mb-3 inline-block">{t.pageBadge}</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white relative">
            <span className="relative">
              {t.pageHeading1}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 ml-3">{t.pageHeading2}</span>
              <motion.div 
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600/50 to-blue-400/50 rounded-full"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              ></motion.div>
            </span>
          </h2>
          <motion.p 
            className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {t.pageSubtitle}
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="relative">
            <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 relative z-10">
              <motion.h3 
                className="text-2xl font-bold mb-8 dark:text-white"
                variants={itemVariants}
              >
                {t.infoTitle}
              </motion.h3>

              <motion.div className="space-y-6" variants={itemVariants}>
                <motion.div 
                  className="flex items-start space-x-4 group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t.infoLabelPhone}</h4>
                    <a href="tel:+99412311418" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      +994 12 311 14 18
                    </a>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-4 group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t.infoLabelEmail}</h4>
                    <a href="mailto:Sales@azportsupply.com" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      Sales@azportsupply.com
                    </a>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-4 group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t.infoLabelLocation}</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      Chinar Park Business Center, Baku
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-4 group"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{t.infoLabelHours}</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                      {t.infoHoursLine1}<br />
                      {t.infoHoursLine2}
                    </p>
                  </div>
                </motion.div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{t.infoLabelFollow}</h4>
                  <div className="flex space-x-4">
                    <a
                      href="https://www.facebook.com/profile.php?id=61575970508290"
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <Facebook className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </a>
                    <a 
                      href="https://www.instagram.com/azport.supply/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <Instagram className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </a>
                    <a 
                      href="https://www.linkedin.com/company/azport-supply/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                    >
                      <Linkedin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-2 border-blue-300 dark:border-blue-700 rounded-xl z-0 opacity-50"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 border-2 border-blue-300 dark:border-blue-700 rounded-xl z-0 opacity-50"></div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 relative z-10">
              <motion.h3 
                className="text-2xl font-bold mb-8 dark:text-white"
                variants={itemVariants}
              >
                {t.formTitle}
              </motion.h3>

              <motion.form className="space-y-3" variants={itemVariants} onSubmit={handleSubmit}>
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.labelName}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-16 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
                      placeholder={t.placeholderName}
                      maxLength={MAX_NAME_LENGTH}
                      required
                    />
                    <span className="absolute bottom-2.5 right-3 text-xs text-gray-400 dark:text-gray-500 pointer-events-none">{formData.name.length}/{MAX_NAME_LENGTH}</span>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.labelEmail}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
                      placeholder={t.placeholderEmail}
                      required
                    />
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.labelSubject}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                    </div>
                    <input 
                      type="text" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-16 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
                      placeholder={t.placeholderSubject}
                      maxLength={MAX_SUBJECT_LENGTH}
                      required
                    />
                    <span className="absolute bottom-2.5 right-3 text-xs text-gray-400 dark:text-gray-500 pointer-events-none">{formData.subject.length}/{MAX_SUBJECT_LENGTH}</span>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.labelMessage}</label>
                  <div className="relative">
                    <textarea
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 pr-16 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
                      placeholder={t.placeholderMessage}
                      maxLength={MAX_MESSAGE_LENGTH}
                      required
                    ></textarea>
                    <span className="absolute bottom-2.5 right-3 text-xs text-gray-400 dark:text-gray-500 pointer-events-none">{formData.message.length}/{MAX_MESSAGE_LENGTH}</span>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Attachment (optional, max 5MB)</label>
                  <div className="relative">
                    <label htmlFor="fullPageAttachment" className="w-full flex items-center justify-center px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors duration-300 focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400 focus-within:border-blue-500 dark:focus-within:border-blue-400">
                      <UploadCloud className="h-5 w-5 mr-2 text-gray-500 dark:text-gray-400" />
                      <span>{formData.attachment ? formData.attachment.name : 'Choose File'}</span>
                    </label>
                    <input
                      id="fullPageAttachment"
                      type="file"
                      onChange={handleFileChange}
                      className="sr-only"
                    />
                    {fileError && (
                      <p className="text-sm text-red-500 mt-1">{fileError}</p>
                    )}
                    {formData.attachment && !fileError && (
                      <p className="text-sm text-green-500 mt-1">
                        Selected: {formData.attachment.name} ({(formData.attachment.size / (1024 * 1024)).toFixed(2)}MB)
                      </p>
                    )}
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="mt-3">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey="6LdnxjorAAAAAE8GP_mvWHXUXeNRTRTO7Zvega3b"
                    onChange={handleRecaptchaChange}
                    onErrored={() => setRecaptchaError(t.recaptchaError || 'Failed to load reCAPTCHA. Please try again.')}
                  />
                </motion.div>
                {recaptchaError && (
                  <p className="text-sm text-red-500 mt-1">{recaptchaError}</p>
                )}
                
                <motion.div 
                  className="pt-1"
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-blue-500/30 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t.buttonSending || 'Sending...'}
                        </>
                      ) : (
                        <>
                          <span>{t.buttonSend}</span>
                          <Send className="h-5 w-5 ml-2" />
                        </>
                      )}
                  </button>
                </motion.div>
                 {submitStatus === 'success' && !isModal && submitMessage && (
                    <motion.div
                        variants={itemVariants}
                        className={`mt-2 p-3 rounded-md text-sm bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300`}
                    >
                        <div className="flex justify-between items-center">
                          <span>{submitMessage}</span>
                          <button
                            onClick={() => {
                              setSubmitStatus(null);
                              setSubmitMessage('');
                            }}
                            className="text-green-700 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 p-1 rounded-full -mr-1 -mt-1 -mb-1"
                            title="Close message"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                    </motion.div>
                 )}
                {submitStatus === 'error' && submitMessage && (
                   <div
                       className={`mt-2 p-3 rounded-md text-sm bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300`}
                    >
                        <div className="flex justify-between items-center">
                          <span>{submitMessage}</span>
                          <button
                            onClick={() => {
                              setSubmitStatus(null);
                              setSubmitMessage('');
                            }}
                            className="text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 p-1 rounded-full -mr-1 -mt-1 -mb-1"
                            title="Close message"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                    </div>
                 )}
              </motion.form>
            </div>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-20 relative z-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl overflow-hidden h-80 relative">
            <div className="absolute inset-0">
              <iframe 
                className="w-full h-full border-0 filter grayscale-[50%] contrast-[1.2] opacity-90"
                title="AzPort Supply Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.6990456824287!2d49.85643977653901!3d40.41478637144418!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40307d1f08d751e5%3A0x682d37b49a753e5a!2sAzport%20Supply%20MMC!5e0!3m2!1sen!2saz!4v1710425567159!5m2!1sen!2saz" 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
            <div className="absolute inset-0 bg-blue-900/10 flex flex-col items-center justify-center p-4">
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-xl shadow-2xl transform hover:-translate-y-1 transition-transform duration-300 max-w-md w-full">
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{t.mapOverlayTitle}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{t.mapOverlayText}</p>
                <div className="flex items-center">
                  <Map className="h-5 w-5 text-blue-600 mr-2" />
                  <a
                    href="https://www.google.com/maps/place/Azport+Supply+MMC/@40.4147864,49.8564398,17z/data=!3m1!4b1!4m6!3m5!1s0x40307d1f08d751e5:0x682d37b49a753e5a!8m2!3d40.4147823!4d49.8590147!16s%2Fg%2F11lp0z4mdk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    {t.mapLink}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}