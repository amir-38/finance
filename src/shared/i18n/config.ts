import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { az } from './locales/az';
import { ru } from './locales/ru';

export const SUPPORTED_LANGUAGES = ['az', 'ru'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const STORAGE_KEY = 'financeflow:language';

function getInitialLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'az';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'az' || stored === 'ru') return stored;
  return 'az';
}

i18n.use(initReactI18next).init({
  resources: {
    az: { translation: az },
    ru: { translation: ru },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'az',
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  window.localStorage.setItem(STORAGE_KEY, lng);
  document.documentElement.lang = lng;
});

document.documentElement.lang = i18n.language;

export default i18n;
