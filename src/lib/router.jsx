import { useEffect, useState } from 'react';

/*
  Tiny hash router:  #/offers?cat=beach  →  { name: 'offers', query: URLSearchParams }
  Hash routing works on any static host (Live Server, Vercel, Netlify, GitHub Pages)
  without server rewrite rules.
*/
const parse = (hash) => {
  const h = hash.replace(/^#\/?/, '');
  const [name, qs] = h.split('?');
  return { name: name || 'home', query: new URLSearchParams(qs || ''), key: h };
};

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
