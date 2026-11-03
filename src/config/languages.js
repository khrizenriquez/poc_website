/** Shared language settings. Translation resources will live in src/i18n/locales/. */
export const languageConfig = {
  defaultLanguage: 'es',
  fallbackLanguage: 'es',
  storageKey: 'leterago-poc.language',
  supportedLanguages: [
    { code: 'es', label: 'Español', locale: 'es-GT', direction: 'ltr' },
    { code: 'en', label: 'English', locale: 'en-US', direction: 'ltr' },
  ],
};
