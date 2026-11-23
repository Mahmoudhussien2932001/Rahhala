import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import { useUI } from './UI';
import { useLang } from '../lib/i18n';
import { pageUrl } from '../lib/router';

/*
  Share button: WhatsApp, copy link, and the native share sheet when the browser has one.
  to    — in-app route, e.g. 'offer/o07'
  title — headline for the message
  line  — optional second line (price, offer count…)
*/
export function ShareButton({ to, title, line, variant = 'ghost', className = '' }) {
  const { T } = useLang();
  const { toast } = useUI();
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  const url = pageUrl(to);
  const text = [title, line].filter(Boolean).join('\n');
  const canNative = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => { if (!box.current?.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', esc); };
  }, [open]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const t = document.createElement('textarea');
      t.value = url; document.body.appendChild(t); t.select();
      try { document.execCommand('copy'); } catch { /* ignore */ }
      t.remove();
    }
    toast(T('اتنسخ اللينك', 'Link copied'));
    setOpen(false);
  };

  const native = async () => {
    try { await navigator.share({ title, text, url }); } catch { /* cancelled */ }
    setOpen(false);
  };

  return (
    <div className={`share ${className}`} ref={box}>
      <button type="button" className={`btn btn-sm btn-${variant}`} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Icon name="share" size={16} />{T('شارك', 'Share')}
      </button>
      {open && (
        <div className="share-menu" role="menu">
          <a role="menuitem" href={`https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
            <i className="wa-ic"><Icon name="wa" size={16} /></i>{T('واتساب', 'WhatsApp')}
          </a>
          <button role="menuitem" type="button" onClick={copy}><i><Icon name="copy" size={16} /></i>{T('انسخ اللينك', 'Copy link')}</button>
          {canNative && <button role="menuitem" type="button" onClick={native}><i><Icon name="out" size={16} /></i>{T('شارك بطريقة تانية', 'More options')}</button>}
        </div>
      )}
    </div>
  );
}
