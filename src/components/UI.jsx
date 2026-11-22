import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon';
import { useLang } from '../lib/i18n';

/* Modals (stack) + toasts + confirm dialog */
const UICtx = createContext(null);
const ModalSelfCtx = createContext(() => {});
export const useModalClose = () => useContext(ModalSelfCtx);
let nextId = 1;

export function UIProvider({ children }) {
  const [modals, setModals] = useState([]);
  const [toasts, setToasts] = useState([]);

  const close = useCallback((id) => {
    setModals((m) => m.map((x) => (id == null ? (x === m[m.length - 1] ? { ...x, closing: true } : x) : x.id === id ? { ...x, closing: true } : x)));
    setTimeout(() => setModals((m) => m.filter((x) => !x.closing)), 260);
  }, []);

  const open = useCallback((render, opts = {}) => {
    const id = nextId++;
    setModals((m) => [...m, { id, render, size: opts.size || '', kind: opts.kind }]);
    return id;
  }, []);

  const closeAll = useCallback(() => {
    setModals((m) => m.map((x) => ({ ...x, closing: true })));
    setTimeout(() => setModals([]), 260);
  }, []);

  const toast = useCallback((msg, type = 'ok') => {
    const id = nextId++;
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const confirm = useCallback((text, okText) => new Promise((resolve) => {
    const id = open(({ T }) => (
      <>
        <div className="mhead"><h3>{T('متأكد؟', 'Are you sure?')}</h3></div>
        <div className="mbody">
          <p className="muted">{text}</p>
          <div className="row-end">
            <button className="btn btn-ghost" onClick={() => { close(id); resolve(false); }}>{T('إلغاء', 'Cancel')}</button>
            <button className="btn btn-danger" onClick={() => { close(id); resolve(true); }}>{okText || T('تأكيد', 'Confirm')}</button>
          </div>
        </div>
      </>
    ), { size: 'sm' });
  }), [open, close]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  useEffect(() => { document.body.style.overflow = modals.length ? 'hidden' : ''; }, [modals.length]);

  const value = useMemo(() => ({ open, close, closeAll, toast, confirm, modals }), [open, close, closeAll, toast, confirm, modals]);

  return (
    <UICtx.Provider value={value}>
      {children}
      <ModalHost modals={modals} close={close} />
      {createPortal(
        <div className="toasts">
          {toasts.map((t) => (
            <div key={t.id} className={`toast ${t.type}`}><Icon name={t.type === 'ok' ? 'check' : 'x'} />{t.msg}</div>
          ))}
        </div>,
        document.body,
      )}
    </UICtx.Provider>
  );
}

function ModalHost({ modals, close }) {
  const lang = useLang();
  return createPortal(
    <>
      {modals.map((m) => (
        <ModalSelfCtx.Provider key={m.id} value={() => close(m.id)}>
          <ModalShell closing={m.closing} size={m.size} onBackdrop={() => close(m.id)}>
            {m.render({ ...lang, close: () => close(m.id) })}
          </ModalShell>
        </ModalSelfCtx.Provider>
      ))}
    </>,
    document.body,
  );
}

function ModalShell({ children, closing, size, onBackdrop }) {
  const [shown, setShown] = useState(false);
  useEffect(() => { const r = requestAnimationFrame(() => setShown(true)); return () => cancelAnimationFrame(r); }, []);
  return (
    <div className={`modal-bg ${shown && !closing ? 'show' : ''}`} onMouseDown={(e) => { if (e.target === e.currentTarget) onBackdrop(); }}>
      <div className={`modal ${size}`} role="dialog" aria-modal="true">{children}</div>
    </div>
  );
}

export const useUI = () => useContext(UICtx);
