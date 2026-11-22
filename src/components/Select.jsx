import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon';

/**
 * Styled replacement for <select>.
 * options: [{ value, label }]
 * Controlled (value + onChange(value)) or uncontrolled (defaultValue).
 * Pass `name` to include the value in a surrounding <form> (FormData).
 */
export default function Select({ options, value, defaultValue, onChange, name, className = '', variant = 'box', ariaLabel }) {
  const [inner, setInner] = useState(defaultValue ?? options[0]?.value);
  const current = value !== undefined ? value : inner;
  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(0);
  const [pos, setPos] = useState(null);
  const btn = useRef(null);
  const list = useRef(null);
  const id = useId();

  const idx = Math.max(0, options.findIndex((o) => o.value === current));
  const sel = options[idx];

  const pick = (v) => {
    if (value === undefined) setInner(v);
    onChange?.(v);
    setOpen(false);
    btn.current?.focus();
  };

  const place = () => {
    const r = btn.current?.getBoundingClientRect();
    if (!r) return;
    const below = window.innerHeight - r.bottom - 12;
    const above = r.top - 12;
    const up = below < 240 && above > below;
    const maxH = Math.min(320, Math.max(160, up ? above : below));
    const anchor = btn.current.closest('.f') || btn.current;
    const a = anchor.getBoundingClientRect();
    const width = Math.min(Math.max(a.width, 220), window.innerWidth - 24);
    const rtl = getComputedStyle(anchor).direction === 'rtl';
    let left = rtl ? a.right - width : a.left;
    left = Math.min(Math.max(12, left), window.innerWidth - width - 12);
    setPos({ left, width, top: up ? undefined : a.bottom + 8, bottom: up ? window.innerHeight - a.top + 8 : undefined, maxH, up });
  };

  useLayoutEffect(() => { if (open) { place(); setHi(idx); } }, [open]); // eslint-disable-line

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (!btn.current?.contains(e.target) && !list.current?.contains(e.target)) setOpen(false); };
    const re = () => place();
    document.addEventListener('pointerdown', close);
    window.addEventListener('resize', re);
    window.addEventListener('scroll', re, true);
    return () => { document.removeEventListener('pointerdown', close); window.removeEventListener('resize', re); window.removeEventListener('scroll', re, true); };
  }, [open]); // eslint-disable-line

  useEffect(() => {
    if (open) list.current?.querySelector(`[data-i="${hi}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [hi, open, pos]);

  const onKey = (e) => {
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); setOpen(true); }
      return;
    }
    if (e.key === 'Escape' || e.key === 'Tab') { setOpen(false); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setHi((h) => Math.min(options.length - 1, h + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => Math.max(0, h - 1)); }
    else if (e.key === 'Home') { e.preventDefault(); setHi(0); }
    else if (e.key === 'End') { e.preventDefault(); setHi(options.length - 1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(options[hi].value); }
  };

  return (
    <>
      {name && <input type="hidden" name={name} value={current ?? ''} />}
      <button
        type="button"
        ref={btn}
        className={`dd dd-${variant} ${open ? 'open' : ''} ${className}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={id}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKey}
      >
        <span className="dd-v">{sel?.label}</span>
        <Icon name="chev" size={16} className="dd-chev" />
      </button>
      {open && pos && createPortal(
        <ul
          ref={list}
          id={id}
          role="listbox"
          className={`dd-menu ${pos.up ? 'up' : ''}`}
          style={{ left: pos.left, width: pos.width, top: pos.top, bottom: pos.bottom, maxHeight: pos.maxH }}
        >
          {options.map((o, i) => (
            <li
              key={o.value}
              data-i={i}
              role="option"
              aria-selected={o.value === current}
              className={`${o.value === current ? 'on' : ''} ${i === hi ? 'hi' : ''}`}
              onPointerEnter={() => setHi(i)}
              onClick={() => pick(o.value)}
            >
              <span>{o.label}</span>
              {o.value === current && <Icon name="check" size={16} />}
            </li>
          ))}
        </ul>,
        document.body,
      )}
    </>
  );
}
