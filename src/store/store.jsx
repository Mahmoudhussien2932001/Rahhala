import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { buildSeed, DEMO_PLANS, demoReplyHours } from '../data/seed';
import { isExpired } from '../lib/offers';
import { passHash } from '../lib/hash';
import { storage } from '../lib/storage';
import { checkAlert } from '../data/alerts';
import { uid } from '../lib/format';

/*
  The app's "database".
  Today it lives in localStorage (one browser only).
  To go live, swap load/save + the CRUD functions below for calls to your backend
  (Supabase, Firebase, Laravel API...). Components only use the API returned by useStore().
*/
const DB_KEY = 'rahhala_react_db_v1';
const COLS = ['agencies', 'offers', 'inquiries', 'accounts', 'alerts'];
const REQUIRED = ['agencies', 'offers', 'inquiries', 'accounts']; // 'alerts' was added later and is created if missing

/* After an offer is written, flag any waiting price/seat alerts that now apply. */
function withAlertCheck(d, offer) {
  if (!offer || !d.alerts) return d;
  let changed = false;
  const alerts = { ...d.alerts };
  Object.values(alerts).forEach((a) => {
    const patch = checkAlert(a, offer);
    if (patch) { alerts[a.id] = { ...a, ...patch }; changed = true; }
  });
  return changed ? { ...d, alerts } : d;
}

function seedDb() {
  const seed = buildSeed();
  const db = {};
  for (const c of COLS) {
    db[c] = {};
    (seed[c] || []).forEach((x) => { db[c][x.id] = x; });
  }
  Object.values(db.accounts).forEach((a) => {
    a.passHash = passHash(a.email, a.pass);
    delete a.pass;
  });
  return db;
}

function loadDb() {
  const saved = storage.get(DB_KEY, null);
  if (!(saved && REQUIRED.every((c) => saved[c]))) return seedDb();
  if (!saved.alerts) saved.alerts = Object.fromEntries((buildSeed().alerts || []).map((a) => [a.id, a]));
  // Migration: give untouched demo offers the demo room/child pricing added later.
  const seedOffers = Object.fromEntries(buildSeed().offers.map((o) => [o.id, o]));
  Object.values(saved.offers).forEach((o) => {
    if (o.pricing === undefined && !o.updatedAt && seedOffers[o.id]) o.pricing = seedOffers[o.id].pricing;
    if (o.umrah === undefined && !o.updatedAt && seedOffers[o.id]?.umrah) o.umrah = seedOffers[o.id].umrah;
    if (o.flashEndsAt === undefined && !o.updatedAt && seedOffers[o.id]?.flashEndsAt) o.flashEndsAt = seedOffers[o.id].flashEndsAt;
  });
  // Migration: plans and reply times were added later.
  Object.values(saved.agencies).forEach((a) => { if (!a.plan) a.plan = DEMO_PLANS[a.id] || 'free'; });
  Object.values(saved.inquiries).forEach((q) => {
    if (q.status !== 'new' && !q.contactedAt) q.contactedAt = Math.min(Date.now(), q.createdAt + demoReplyHours(q.id, q.agencyId) * 36e5);
  });
  return saved;
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
  const [favorites, setFavorites] = useState(() => storage.get('rh_favs', []));
  const persistent = useRef(true);

  useEffect(() => { persistent.current = storage.set(DB_KEY, db); }, [db]);
  useEffect(() => { if (session) storage.set('rh_session', session); else storage.remove('rh_session'); }, [session]);
  useEffect(() => { storage.set('rh_cmp', compare); }, [compare]);
  useEffect(() => { storage.set('rh_prefs', prefs); }, [prefs]);
  useEffect(() => { storage.set('rh_favs', favorites); }, [favorites]);

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
      // Live = visible, agency active, and departure date not passed (expired offers hide automatically).
      liveOffers: () => Object.values(db.offers).filter((o) => o.active !== false && !isExpired(o) && isLive(agency(o.agencyId))),
      currentAgency: () => (session?.role === 'agency' ? agency(session.agencyId) : null),
      isAdmin: () => session?.role === 'admin',

      /* writes */
      set: (col, id, doc) => setDb((d) => {
        const next = { ...d, [col]: { ...d[col], [id]: { ...doc, id } } };
        return col === 'offers' ? withAlertCheck(next, next.offers[id]) : next;
      }),
      update: (col, id, patch) => setDb((d) => {
        if (!d[col][id]) return d;
        const next = { ...d, [col]: { ...d[col], [id]: { ...d[col][id], ...patch } } };
        return col === 'offers' ? withAlertCheck(next, next.offers[id]) : next;
      }),
      remove: (col, ids) => setDb((d) => {
        const c = { ...d[col] };
        [].concat(ids).forEach((i) => delete c[i]);
        return { ...d, [col]: c };
      }),
      /* add many docs in one write (CSV import) */
      setMany: (col, docs) => setDb((d) => ({ ...d, [col]: { ...d[col], ...Object.fromEntries(docs.map((x) => [x.id, x])) } })),
      duplicateOffer(id) {
        const o = db.offers[id];
        if (!o) return null;
        const nid = uid('o');
        const copy = { ...o, id: nid, title: { ar: `${o.title.ar} (نسخة)`, en: `${o.title.en || o.title.ar} (copy)` }, active: false, featured: false, views: 0, flashEndsAt: null, createdAt: Date.now(), updatedAt: Date.now() };
        setDb((d) => ({ ...d, offers: { ...d.offers, [nid]: copy } }));
        return nid;
      },
      removeAgency: (id) => setDb((d) => {
        const strip = (col, pred) => Object.fromEntries(Object.entries(d[col]).filter(([, v]) => !pred(v)));
        return {
          agencies: strip('agencies', (a) => a.id === id),
          accounts: strip('accounts', (a) => a.id === id),
          offers: strip('offers', (o) => o.agencyId === id),
          inquiries: strip('inquiries', (q) => q.agencyId === id),
          alerts: strip('alerts', (x) => x.agencyId === id),
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

      /* favorites (per visitor) */
      favorites,
      isFav: (id) => favorites.includes(id),
      toggleFav: (id) => setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [id, ...f])),

      /* price-drop / low-seats alerts */
      addAlert({ offerId, name, whatsapp, kinds, lang }) {
        const o = db.offers[offerId];
        if (!o) return null;
        const id = uid('al');
        setDb((d) => ({ ...d, alerts: { ...d.alerts, [id]: {
          id, offerId, agencyId: o.agencyId, name, whatsapp, kinds, lang,
          priceAtSignup: o.price, seatsAtSignup: o.seats, status: 'waiting', createdAt: Date.now(),
        } } }));
        return id;
      },

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
  }, [db, session, compare, prefs, chooserOpen, favorites]);

  return <StoreCtx.Provider value={api}>{children}</StoreCtx.Provider>;
}

export const useStore = () => useContext(StoreCtx);
