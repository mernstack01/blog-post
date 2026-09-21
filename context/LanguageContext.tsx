'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '@/lib/translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  setLanguage: (lang: Language) => void;
  t: typeof translations['uz'];
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'uz',
  setLang: () => {},
  setLanguage: () => {},
  t: translations.uz,
});

export function LanguageProvider({
  children,
  initialLang = 'uz',
}: {
  children: React.ReactNode;
  initialLang?: Language;
}) {
  const [lang, setLangState] = useState<Language>(initialLang);

  // Brauzerdan saqlangan tilni yoki URL parametrini o'qish
  useEffect(() => {
    try {
      // 1. URL parametrlari (?lang=ru yoki ?lang=uz)
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const queryLang = params.get('lang') as Language | null;
        if (queryLang === 'uz' || queryLang === 'ru') {
          if (queryLang !== lang) {
            setLangState(queryLang);
          }
          localStorage.setItem('topbaza_lang', queryLang);
          document.cookie = `NEXT_LOCALE=${queryLang}; path=/; max-age=31536000; SameSite=Lax`;
          document.documentElement.lang = queryLang;
          return;
        }
      }

      // 2. Cookie
      const cookieLang = document.cookie
        .split('; ')
        .find((row) => row.startsWith('NEXT_LOCALE='))
        ?.split('=')[1] as Language | undefined;
      if (cookieLang === 'uz' || cookieLang === 'ru') {
        if (cookieLang !== lang) {
          setLangState(cookieLang);
        }
        document.documentElement.lang = cookieLang;
        return;
      }

      // 3. localStorage
      const savedLang = localStorage.getItem('topbaza_lang') as Language | null;
      if (savedLang === 'uz' || savedLang === 'ru') {
        if (savedLang !== lang) {
          setLangState(savedLang);
        }
        document.documentElement.lang = savedLang;
      }
    } catch {}

    const handlePopState = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const queryLang = params.get('lang') as Language | null;
        if (queryLang === 'uz' || queryLang === 'ru') {
          setLangState(queryLang);
          document.documentElement.lang = queryLang;
        }
      } catch {}
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Iframe yoki tashqi oynadan keluvchi xabarlar (postMessage) orqali tilni sinxronlash
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        if (
          event.data &&
          (event.data.type === 'SET_LANGUAGE' || event.data.type === 'SET_LOCALE') &&
          (event.data.lang === 'uz' || event.data.lang === 'ru')
        ) {
          setLang(event.data.lang);
        }
      } catch {}
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('topbaza_lang', newLang);
      document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.lang = newLang;

      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', newLang);
        window.history.replaceState({}, '', url.toString());
      }
    } catch {}
  };

  const t = translations[lang] || translations.uz;

  return (
    <LanguageContext.Provider value={{ lang, setLang, setLanguage: setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
