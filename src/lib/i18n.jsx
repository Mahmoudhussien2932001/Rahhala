import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { storage } from './storage';

/*
  Language system
  - T('عربي', 'English')  → inline UI text
  - L({ ar, en })         → bilingual data fields
*/
const LangCtx = createContext(null);

export function LangProvider({ children }) {
  // English is the default. The key was renamed from 'rh_lang' because the old
  // version auto-saved 'ar' for every visitor, which would otherwise stick.
  const [lang, setLang] = useState(() => storage.get('rh_lang_v2', 'en'));

  useEffect(() => {
    storage.set('rh_lang_v2', lang);
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
