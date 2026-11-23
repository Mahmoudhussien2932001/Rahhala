import { useEffect } from 'react';

/*
  Per-page <title> and meta description.
  LangProvider registers the language defaults with setDefaultMeta(); pages override them with
  usePageMeta(title, description). Both go through apply(), so effect order can't make one
  clobber the other.
  Note: with hash URLs, link previews (WhatsApp, Facebook) still read the static tags in
  index.html — per-page previews need server-side rendering or an edge function.
*/
let fallback = { title: 'Rahhala', description: '' };
let current = null;

function apply() {
  const m = current || fallback;
  document.title = m.title;
  let tag = document.querySelector('meta[name="description"]');
  if (!tag) {
    tag = document.createElement('meta');
    tag.name = 'description';
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', m.description || fallback.description);
}

export function setDefaultMeta(meta) {
  fallback = meta;
  apply();
}

export function usePageMeta(title, description) {
  useEffect(() => {
    if (!title) return undefined;
    const brand = fallback.title.split('|')[0].trim();
    current = { title: `${title} | ${brand}`, description: String(description || '').slice(0, 160) };
    apply();
    return () => { current = null; apply(); };
  }, [title, description]);
}
