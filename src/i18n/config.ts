import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ptBR from './locales/pt-BR.json';
import en from './locales/en.json';
import es from './locales/es.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'pt-BR': { translation: ptBR },
      en: { translation: en },
      es: { translation: es },
    },

    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'wapp-locale',
      caches: ['localStorage'],
    },
    supportedLngs: ['pt-BR', 'pt', 'en', 'es'],
    fallbackLng: 'pt-BR',

    load: 'all',

    interpolation: { escapeValue: false },
  });

i18n.on('languageChanged', (lng: string) => {
  if (lng === 'pt') {
    void i18n.changeLanguage('pt-BR');
  }
});

export default i18n;
