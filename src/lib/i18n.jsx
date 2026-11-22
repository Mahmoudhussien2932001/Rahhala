import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { storage } from './storage';

/*
  Language system
  - T('عربي', 'English')  → inline UI text
  - L({ ar, en })         → bilingual data fields
*/
const LangCtx = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => storage.get('rh_lang', 'ar'));

  useEffect(() => {
    storage.set('rh_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = lang === 'ar' ? 'رحّالة | قارن عروض شركات السياحة' : 'Rahhala | Compare travel agency offers';
  }, [lang]);

  const value = useMemo(() => ({
    lang,
    dir: lang === 'ar' ? 'rtl' : 'ltr',
    isAr: lang === 'ar',
    T: (ar, en) => (lang === 'en' ? en : ar),
    L: (o) => (o == null ? '' : typeof o === 'string' ? o : o[lang] || o.ar || o.en || ''),
    toggle: () => setLang((l) => (l === 'ar' ? 'en' : 'ar')),
  }), [lang]);

  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);
