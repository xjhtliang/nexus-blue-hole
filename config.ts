
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import Chinese Locales
// Use strict relative paths. All locales are now .ts files.
import common_zh from './locales/zh-CN/common';
import navigation_zh from './locales/zh-CN/navigation'; 
import dashboard_zh from './locales/zh-CN/dashboard';
import neuron_zh from './locales/zh-CN/neuron';
import work_zh from './locales/zh-CN/work';
import life_zh from './locales/zh-CN/life';
import system_zh from './locales/zh-CN/system';

// Import English Locales
import common_en from './locales/en-US/common';
import navigation_en from './locales/en-US/navigation';
import dashboard_en from './locales/en-US/dashboard';
import neuron_en from './locales/en-US/neuron';
import work_en from './locales/en-US/work';
import life_en from './locales/en-US/life';
import system_en from './locales/en-US/system';

const resources = {
  'zh-CN': {
    common: common_zh,
    navigation: navigation_zh,
    neuron: neuron_zh,
    work: work_zh,
    life: life_zh,
    system: system_zh,
    dashboard: dashboard_zh,
  },
  'en-US': {
    common: common_en,
    navigation: navigation_en,
    neuron: neuron_en,
    work: work_en,
    life: life_en,
    system: system_en,
    dashboard: dashboard_en,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh-CN',
    // Initialize language from local storage or default to zh-CN
    lng: localStorage.getItem('nexus_language') || 'zh-CN',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'nexus_language',
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
