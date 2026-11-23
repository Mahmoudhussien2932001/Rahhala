import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { buildSeed } from '../data/seed';
import { passHash } from '../lib/hash';
import { storage } from '../lib/storage';

/*
  The app's "database".
  Today it lives in localStorage (one browser only).
  To go live, swap load/save + the CRUD functions below for calls to your backend
  (Supabase, Firebase, Laravel API...). Components only use the API returned by useStore().
*/
const DB_KEY = 'rahhala_react_db_v1';
const COLS = ['agencies', 'offers', 'inquiries', 'accounts'];

function seedDb() {
  const seed = buildSeed();
  const db = {};
  for (const c of COLS) {
    db[c] = {};
    seed[c].forEach((x) => { db[c][x.id] = x; });
  }
  Object.values(db.accounts).forEach((a) => {
    a.passHash = passHash(a.email, a.pass);
    delete a.pass;
  });
  return db;
}

function loadDb() {
  const saved = storage.get(DB_KEY, null);
  return saved && COLS.every((c) => saved[c]) ? saved : seedDb();
}

const StoreCtx = createContext(null);

export function StoreProvider({ children }) {
  const [db, setDb] = useState(loadDb);
  const [session, setSession] = useState(() => storage.get('rh_session', null));
  const [compare, setCompare] = useState(() => storage.get('rh_cmp', []));
  // Per-visitor preferences (trip scope, visa-checker answers…). Migrates the old separate key.
  const [prefs, setPrefs] = useState(() => {
    const p = storage.get('rh_prefs', {});
    if (p.traveler === undefined) { const old = storage.get('rh_traveler_v1', null); if (old) p.traveler = old; }
    return p;
  });
  const [chooserOpen, setChooserOpen] = useState(false); // UI only, not persisted
  const persistent = useRef(true);

  useEffect(() => { persistent.current = storage.set(DB_KEY, db); }, [db]);
  useEffect(() => { if (session) storage.set('rh_session', session); else storage.remove('rh_session'); }, [session]);
  useEffect(() => { storage.set('rh_cmp', compare); }, [compare]);
  useEffect(() => { storage.set('rh_prefs', prefs); }, [prefs]);

  const api = useMemo(() => {
    const agency = (id) => db.agencies[id];
    const isLive = (a) => a && a.active !== false;
    return {
      db,
      session,
      compare,
      persistent: persistent.current,

      /* reads */
      list: (col) => Object.values(db[col]),
      get: (col, id) => db[col][id],
      agency,
      liveAgencies: () => Object.values(db.agencies).filter(isLive),
      liveOffers: () => Object.values(db.offers).filter((o) => o.active !== false && isLive(agency(o.agencyId))),
      currentAgency: () => (session?.role === 'agency' ? agency(session.agencyId) : null),
      isAdmin: () => session?.role === 'admin',

      /* writes */
      set: (col, id, doc) => setDb((d) => ({ ...d, [col]: { ...d[col], [id]: { ...doc, id } } })),
      update: (col, id, patch) => setDb((d) => (d[col][id] ? { ...d, [col]: { ...d[col], [id]: { ...d[col][id], ...patch } } } : d)),
      remove: (col, ids) => setDb((d) => {
        const c = { ...d[col] };
        [].concat(ids).forEach((i) => delete c[i]);
        return { ...d, [col]: c };
      }),
      removeAgency: (id) => setDb((d) => {
        const strip = (col, pred) => Object.fromEntries(Object.entries(d[col]).filter(([, v]) => !pred(v)));
        return {
          agencies: strip('agencies', (a) => a.id === id),
          accounts: strip('accounts', (a) => a.id === id),
          offers: strip('offers', (o) => o.agencyId === id),
          inquiries: strip('inquiries', (q) => q.agencyId === id),
        };
      }),
      reset: () => { setDb(seedDb()); setSession(null); },

      /* auth (demo only — runs in the browser, not secure) */
      login(email, pass) {
        const e = String(email).toLowerCase().trim();
        const acc = Object.values(db.accounts).find((a) => a.email.toLowerCase() === e);
        if (!acc || acc.passHash !== passHash(e, pass)) return { ok: false, error: 'bad' };
        if (acc.role === 'admin') { setSession({ role: 'admin' }); return { ok: true, role: 'admin' }; }
        const a = agency(acc.agencyId);
        if (!a) return { ok: false, error: 'missing' };
        if (a.active === false) return { ok: false, error: 'suspended' };
        setSession({ role: 'agency', agencyId: a.id });
        return { ok: true, role: 'agency' };
      },
      logout: () => setSession(null),
      setSession,

      /* compare */
      toggleCompare(id) {
        if (compare.includes(id)) { setCompare(compare.filter((x) => x !== id)); return true; }
        if (compare.length >= 3) return false;
        setCompare([...compare, id]);
        return true;
      },
      clearCompare: () => setCompare([]),

      /* visitor preferences */
      prefs,
      setPref: (key, value) => setPrefs((p) => {
        const next = { ...p };
        if (value === null || value === undefined) delete next[key]; else next[key] = value;
        return next;
      }),
      chooserOpen,
      openChooser: () => setChooserOpen(true),
      closeChooser: () => setChooserOpen(false),
    };
  }, [db, session, compare, prefs, chooserOpen]);

  return <StoreCtx.Provider value={api}>{children}</StoreCtx.Provider>;
}

export const useStore = () => useContext(StoreCtx);
