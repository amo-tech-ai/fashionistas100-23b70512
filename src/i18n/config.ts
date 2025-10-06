import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enUS from './locales/en-US.json';
import esCO from './locales/es-CO.json';

// Initialize i18next
i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Pass i18n instance to react-i18next
  .init({
    resources: {
      'en-US': {
        translation: enUS
      },
      'es-CO': {
        translation: esCO
      },
      // Aliases for easier detection
      'en': {
        translation: enUS
      },
      'es': {
        translation: esCO
      }
    },
    fallbackLng: 'es-CO', // Colombian Spanish as default (primary market)
    debug: import.meta.env.MODE === 'development',
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },

    detection: {
      // Order of language detection methods
      order: ['localStorage', 'navigator', 'htmlTag'],
      
      // Keys to lookup language from
      lookupLocalStorage: 'i18nextLng',
      
      // Cache user language
      caches: ['localStorage'],
      
      // Don't use cookies
      excludeCacheFor: ['cimode'],
    },

    react: {
      useSuspense: false, // Disable suspense to avoid loading issues
    }
  });

export default i18n;
