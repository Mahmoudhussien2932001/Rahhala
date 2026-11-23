import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { buildSeed, DEMO_PLANS, DEMO_VERIFICATIONS, demoReplyHours } from '../data/seed';
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
const COLS = ['agencies', 'offers', 'inquiries', 'accounts', 'alerts', 'log'];
const LOG_CAP = 500;

/* ---------- activity log (who did what, when) ---------- */
const actorOf = (session) => (session?.role === 'admin' ? { role: 'admin' }
  : session?.role === 'agency' ? { role: 'agency', agencyId: session.agencyId, ...(session.asAdmin ? { asAdmin: true } : {}) }
    : { role: 'visitor' });

const labelOf = (col, doc) => {
  if (!doc) return null;
  if (col === 'offers') return doc.title || null;
  if (col === 'agencies') return doc.name || null;
  if (col === 'accounts') return { ar: doc.email, en: doc.email };
  if (doc.name) return typeof doc.name === 'string' ? { ar: doc.name, en: doc.name } : doc.name;
  return null;
};

function withLog(d, session, entry) {
  const id = uid('lg');
  const log = { ...(d.log || {}), [id]: { id, at: Date.now(), actor: actorOf(session), ...entry } };
  const ids = Object.keys(log);
  if (ids.length > LOG_CAP) ids.sort((a, b) => log[a].at - log[b].at).slice(0, ids.length - LOG_CAP).forEach((k) => delete log[k]);
  return { ...d, log };
}

const QUIET = ['views', 'updatedAt'];
const changedKeys = (before, after) => Object.keys(after).filter((k) => !QUIET.includes(k) && k !== 'id' && JSON.stringify(before?.[k]) !== JSON.stringify(after[k]));
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
  const db = { settings: { moderation: false } };
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
  if (!saved.log) saved.log = {};
  if (!saved.settings) saved.settings = { moderation: false };
  // Migration: give untouched demo offers the demo room/child pricing added later.
  const seedOffers = Object.fromEntries(buildSeed().offers.map((o) => [o.id, o]));
  Object.values(saved.offers).forEach((o) => {
    if (o.pricing === undefined && !o.updatedAt && seedOffers[o.id]) o.pricing = seedOffers[o.id].pricing;
    if (o.umrah === undefined && !o.updatedAt && seedOffers[o.id]?.umrah) o.umrah = seedOffers[o.id].umrah;
    if (o.flashEndsAt === undefined && !o.updatedAt && seedOffers[o.id]?.flashEndsAt) o.flashEndsAt = seedOffers[o.id].flashEndsAt;
  });
  // Migration: plans and reply times were added later.
  Object.values(saved.agencies).forEach((a) => {
    if (!a.plan) a.plan = DEMO_PLANS[a.id] || 'free';
    if (a.verification === undefined && !a.verified && DEMO_VERIFICATIONS[a.id]) a.verification = DEMO_VERIFICATIONS[a.id]();
  });
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
      // Live = visible, approved (when moderation is used), agency active, departure date not passed.
      liveOffers: () => Object.values(db.offers).filter((o) => o.active !== false && !isExpired(o) && o.review !== 'pending' && o.review !== 'rejected' && isLive(agency(o.agencyId))),
      settings: db.settings || {},
      activity: () => Object.values(db.log || {}).sort((a, b) => b.at - a.at),
      currentAgency: () => (session?.role === 'agency' ? agency(session.agencyId) : null),
      isAdmin: () => session?.role === 'admin',

      /* writes */
      set: (col, id, doc) => setDb((d) => {
        const before = d[col][id];
        let item = { ...doc, id };
        // Moderation: new offers from agencies wait for admin approval when the setting is on.
        if (col === 'offers' && !before && session?.role === 'agency' && d.settings?.moderation) item = { ...item, review: 'pending' };
        let next = { ...d, [col]: { ...d[col], [id]: item } };
        if (col === 'offers') next = withAlertCheck(next, item);
        const fields = before ? changedKeys(before, item) : [];
        if (before && !fields.length) return next;
        return withLog(next, session, { action: before ? 'update' : 'create', col, targetId: id, label: labelOf(col, item), fields });
      }),
      update: (col, id, patch) => setDb((d) => {
        if (!d[col][id]) return d;
        const before = d[col][id];
        const item = { ...before, ...patch };
        let next = { ...d, [col]: { ...d[col], [id]: item } };
        if (col === 'offers') next = withAlertCheck(next, item);
        const fields = changedKeys(before, patch);
        if (!fields.length) return next; // e.g. view counters — not worth logging
        return withLog(next, session, { action: 'update', col, targetId: id, label: labelOf(col, item), fields });
      }),
      remove: (col, ids) => setDb((d) => {
        const c = { ...d[col] };
        let next = d;
        [].concat(ids).forEach((i) => {
          if (c[i]) next = withLog(next, session, { action: 'delete', col, targetId: i, label: labelOf(col, c[i]) });
          delete c[i];
        });
        return { ...next, [col]: c };
      }),
      /* add many docs in one write (CSV import) */
      setMany: (col, docs) => setDb((d) => {
        const review = col === 'offers' && session?.role === 'agency' && d.settings?.moderation;
        const items = docs.map((x) => (review ? { ...x, review: 'pending' } : x));
        const next = { ...d, [col]: { ...d[col], ...Object.fromEntries(items.map((x) => [x.id, x])) } };
        return withLog(next, session, { action: 'import', col, count: items.length });
      }),

      /* settings + moderation + verification (admin tools) */
      setSetting: (key, value) => setDb((d) => withLog({ ...d, settings: { ...(d.settings || {}), [key]: value } }, session, { action: 'setting', key, value })),
      reviewOffer: (id, approve, reason = '') => setDb((d) => {
        const o = d.offers[id];
        if (!o) return d;
        const item = { ...o, review: approve ? 'approved' : 'rejected', reviewReason: approve ? '' : reason, reviewedAt: Date.now() };
        let next = { ...d, offers: { ...d.offers, [id]: item } };
        if (approve) next = withAlertCheck(next, item);
        return withLog(next, session, { action: approve ? 'offer.approve' : 'offer.reject', col: 'offers', targetId: id, label: o.title, reason });
      }),
      submitVerification: (agencyId, { licenseNo, licenseImg }) => setDb((d) => {
        const a = d.agencies[agencyId];
        if (!a) return d;
        const verification = { status: 'pending', licenseNo, licenseImg, submittedAt: Date.now() };
        return withLog({ ...d, agencies: { ...d.agencies, [agencyId]: { ...a, verification } } }, session, { action: 'verification.submit', col: 'agencies', targetId: agencyId, label: a.name });
      }),
      reviewVerification: (agencyId, approve, reason = '') => setDb((d) => {
        const a = d.agencies[agencyId];
        if (!a?.verification) return d;
        const verification = { ...a.verification, status: approve ? 'approved' : 'rejected', reason: approve ? '' : reason, reviewedAt: Date.now() };
        const item = { ...a, verification, verified: approve ? true : a.verified, ...(approve ? { license: a.verification.licenseNo || a.license } : {}) };
        return withLog({ ...d, agencies: { ...d.agencies, [agencyId]: item } }, session, { action: approve ? 'verification.approve' : 'verification.reject', col: 'agencies', targetId: agencyId, label: a.name, reason });
      }),
      duplicateOffer(id) {
        const o = db.offers[id];
        if (!o) return null;
        const nid = uid('o');
        const copy = { ...o, id: nid, title: { ar: `${o.title.ar} (نسخة)`, en: `${o.title.en || o.title.ar} (copy)` }, active: false, featured: false, views: 0, flashEndsAt: null, createdAt: Date.now(), updatedAt: Date.now() };
        delete copy.review; delete copy.reviewReason;
        setDb((d) => {
          const item = session?.role === 'agency' && d.settings?.moderation ? { ...copy, review: 'pending' } : copy;
          return withLog({ ...d, offers: { ...d.offers, [nid]: item } }, session, { action: 'duplicate', col: 'offers', targetId: nid, label: item.title });
        });
        return nid;
      },
      removeAgency: (id) => setDb((d) => {
        const strip = (col, pred) => Object.fromEntries(Object.entries(d[col]).filter(([, v]) => !pred(v)));
        return withLog({
          ...d,
          agencies: strip('agencies', (a) => a.id === id),
          accounts: strip('accounts', (a) => a.id === id),
          offers: strip('offers', (o) => o.agencyId === id),
          inquiries: strip('inquiries', (q) => q.agencyId === id),
          alerts: strip('alerts', (x) => x.agencyId === id),
        }, session, { action: 'delete', col: 'agencies', targetId: id, label: d.agencies[id]?.name });
      }),
      reset: () => { setDb(seedDb()); setSession(null); },

      /* auth (demo only — runs in the browser, not secure) */
      login(email, pass) {
        const e = String(email).toLowerCase().trim();
        const acc = Object.values(db.accounts).find((a) => a.email.toLowerCase() === e);
        if (!acc || acc.passHash !== passHash(e, pass)) return { ok: false, error: 'bad' };
        if (acc.role === 'admin') {
          setSession({ role: 'admin' });
          setDb((d) => withLog(d, { role: 'admin' }, { action: 'login' }));
          return { ok: true, role: 'admin' };
        }
        const a = agency(acc.agencyId);
        if (!a) return { ok: false, error: 'missing' };
        if (a.active === false) return { ok: false, error: 'suspended' };
        setSession({ role: 'agency', agencyId: a.id });
        setDb((d) => withLog(d, { role: 'agency', agencyId: a.id }, { action: 'login' }));
        return { ok: true, role: 'agency' };
      },
      logout: () => { setDb((d) => withLog(d, session, { action: 'logout' })); setSession(null); },
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
