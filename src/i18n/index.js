import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from './locales/es';
import en from './locales/en';
import { languageConfig } from '../config/languages';
export const resources = { es: { translation: es }, en: { translation: en } };
export function createI18n(language = languageConfig.defaultLanguage) {
  const instance = i18next.createInstance();
  instance.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: languageConfig.fallbackLanguage,
    supportedLngs: languageConfig.supportedLanguages.map((item) => item.code),
    interpolation: { escapeValue: false },
    initImmediate: false,
    react: { useSuspense: false },
  });
  return instance;
}
export const i18n = createI18n();
