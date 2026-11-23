import { useEffect, useState } from 'react';

/*
  Tiny hash router:
    #/offers?cat=beach  →  { name: 'offers', params: [], query: URLSearchParams }
    #/offer/o07         →  { name: 'offer', params: ['o07'], query }
  Hash routing works on any static host (Live Server, Vercel, Netlify, GitHub Pages)
  without server rewrite rules.
*/
const parse = (hash) => {
  const h = hash.replace(/^#\/?/, '');
  const [path, qs] = h.split('?');
  const [name, ...params] = path.split('/').filter(Boolean).map((x) => { try { return decodeURIComponent(x); } catch { return x; } });
  return { name: name || 'home', params, query: new URLSearchParams(qs || ''), key: h };
};

/* Absolute, shareable URL for an in-app route, e.g. pageUrl('offer/o07'). */
export const pageUrl = (to) => `${window.location.origin}${window.location.pathname}#/${String(to).replace(/^#?\/?/, '')}`;

export function useRoute() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const on = () => setHash(window.location.hash);
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return parse(hash);
}

export function navigate(to) {
  const target = '#/' + String(to).replace(/^#?\/?/, '');
  if (window.location.hash === target) window.dispatchEvent(new HashChangeEvent('hashchange'));
  else window.location.hash = target;
}

export function Link({ to, children, ...rest }) {
  return <a href={'#/' + to} {...rest}>{children}</a>;
}
