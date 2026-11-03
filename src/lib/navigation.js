import { languageConfig } from '../config/languages';
import { countries, countryPages, corporatePages, legalPages } from '../data/site';

export const isLanguage = (code) =>
  languageConfig.supportedLanguages.some((language) => language.code === code);
export function readLanguage() {
  try {
    const saved = localStorage.getItem(languageConfig.storageKey);
    return isLanguage(saved) ? saved : languageConfig.defaultLanguage;
  } catch {
    return languageConfig.defaultLanguage;
  }
}
export function saveLanguage(language) {
  if (!isLanguage(language)) return false;
  try {
    localStorage.setItem(languageConfig.storageKey, language);
    return true;
  } catch {
    return false;
  }
}
export function routePath(language, country = null, page = '') {
  return '/' + [language, country?.slug, page].filter(Boolean).join('/') + '/';
}
export function resolveRoute(pathname, preferred = languageConfig.defaultLanguage) {
  let parts;
  try {
    parts = decodeURIComponent(pathname).split('/').filter(Boolean);
  } catch {
    return { language: 'es', country: null, page: '404', notFound: true, canonical: pathname };
  }
  let language = isLanguage(preferred) ? preferred : languageConfig.defaultLanguage;
  if (isLanguage(parts[0])) language = parts.shift();
  else if (/^[a-z]{2}$/i.test(parts[0])) {
    parts.shift();
    language = languageConfig.defaultLanguage;
  }
  const country = countries.find((item) => item.slug === parts[0]) || null;
  if (country) parts.shift();
  const page = parts.join('/');
  const valid = country
    ? countryPages.includes(page)
    : [...corporatePages, ...legalPages].includes(page);
  return {
    language,
    country,
    page: valid ? page : '404',
    notFound: !valid,
    canonical: routePath(language, country, page),
  };
}
export const asset = (name) => `${import.meta.env.BASE_URL}media/${name}`;
