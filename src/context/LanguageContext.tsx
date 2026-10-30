/* oxlint-disable react/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import type { Language, TranslationStrings } from '../types';
import { translations } from '../utils/translations';
import { useLanguage } from './useLanguage';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationStrings;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('mahasahayak_lang');
    if (saved === 'mr' || saved === 'hi' || saved === 'en') {
      return saved;
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('mahasahayak_lang', lang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export { useLanguage };
