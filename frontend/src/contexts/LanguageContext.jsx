import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../utils/translations';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('hi'); // Default Hindi

  useEffect(() => {
    const savedLang = localStorage.getItem('nileshSeedsLanguage');
    if (savedLang && ['hi', 'en', 'mr'].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  const changeLanguage = (lang) => {
    if (['hi', 'en', 'mr'].includes(lang)) {
      setLanguage(lang);
      localStorage.setItem('nileshSeedsLanguage', lang);
    }
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  const value = {
    language,
    changeLanguage,
    t
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
