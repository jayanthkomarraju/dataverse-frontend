// src/shared/LanguageContext.tsx
import React, { createContext, useState, ReactNode, useEffect } from 'react';
import i18n from '../i18n';

interface LanguageContextProps {
  language: string;
  setLanguage: (language: string) => void;
}

export const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: () => {},
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    document.body.classList.toggle('rtl', language === 'ar');
    i18n.changeLanguage(language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
