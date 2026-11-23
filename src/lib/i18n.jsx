import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { storage } from './storage';
import { setDefaultMeta } from './seo';

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
    setDefaultMeta(lang === 'ar'
      ? { title: 'رحّالة | قارن عروض شركات السياحة', description: 'رحّالة — قارن عروض شركات السياحة المرخّصة: عمرة، مصايف، شاليهات، سفاري، وسفر للخارج.' }
      : { title: 'Rahhala | Compare travel agency offers', description: 'Rahhala — compare offers from licensed travel agencies: Umrah, beach holidays, chalets, safaris and trips abroad.' });
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
