import { useState } from 'react';
import Icon from '../../components/Icon';
import { Photo } from '../../components/Media';
import { useLang } from '../../lib/i18n';
import { useStore } from '../../store/store';
import { useUI, useModalClose } from '../../components/UI';
import { CATS, CITIES, DESTS, FEATURES, PHOTO_LIBRARY } from '../../data/catalog';
import { uid } from '../../lib/format';
import { passHash } from '../../lib/hash';
import { ROOM_TYPES } from '../../data/pricing';
import { FLIGHT_TYPES } from '../../data/umrah';
import { isExpired } from '../../lib/offers';
import { liveCountOf, planOf } from '../../data/plans';

export function compressImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image(), u = URL.createObjectURL(file);
    img.onload = () => {
      const sc = Math.min(1, 1400 / img.width);
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * sc); c.height = Math.round(img.height * sc);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      let q = 0.82, out;
      do { out = c.toDataURL('image/jpeg', q); q -= 0.1; } while (out.length > 350000 && q > 0.3);
      URL.revokeObjectURL(u); resolve(out);
    };
    img.onerror = reject; img.src = u;
  });
}

/* ---------- optional room / child prices + extras (see data/pricing.js) ---------- */

const posNum = (v) => (v === '' || v === null || v === undefined || !(+v > 0) ? null : Math.round(+v));

function cleanPricing(p) {
  if (!p) return null;
  const rooms = Object.fromEntries(ROOM_TYPES.filter((r) => r.k !== 'double').map((r) => [r.k, posNum(p.rooms?.[r.k])]).filter(([, v]) => v !== null));
  const extras = (p.extras || [])
    .map((x) => ({ id: x.id || uid('x'), name: { ar: String(x.name?.ar || '').trim(), en: String(x.name?.en || '').trim() }, price: posNum(x.price), per: x.per === 'booking' ? 'booking' : 'person' }))
    .filter((x) => (x.name.ar || x.name.en) && x.price)
    .map((x) => ({ ...x, name: { ar: x.name.ar || x.name.en, en: x.name.en || x.name.ar } }));
  const child = posNum(p.child) ?? (p.child === 0 || p.child === '0' ? 0 : null);
  const infant = p.infant === 0 || p.infant === '0' ? 0 : posNum(p.infant);
  const out = { rooms, extras };
  if (child !== null) out.child = child;
  if (infant !== null) out.infant = infant;
  return Object.keys(rooms).length || extras.length || 'child' in out || 'infant' in out ? out : null;
}

function PricingEditor({ pricing, base, onChange }) {
  const { T } = useLang();
  const p = pricing || { rooms: {}, extras: [] };
  const upd = (patch) => onChange({ ...p, ...patch });
  const setRoom = (k, v) => upd({ rooms: { ...(p.rooms || {}), [k]: v } });
  const extras = p.extras || [];
  const setExtra = (i, patch) => upd({ extras: extras.map((x, j) => (j === i ? { ...x, ...patch } : x)) });
  const has = !!pricing && (Object.values(p.rooms || {}).some((v) => v !== '' && v != null) || extras.length || p.child != null || p.infant != null);
  const ph = base ? String(base) : T('السعر الأساسي', 'Base price');

  return (
    <details className="pricing-ed" open={has}>
      <summary><Icon name="money" size={16} />{T('أسعار الغرف والأطفال والإضافات (اختياري)', 'Room, child & extras pricing (optional)')}</summary>
      <p className="dim xs">{T('السعر الأساسي هو سعر الفرد في غرفة مزدوجة. أي خانة فاضية بتاخد السعر الأساسي.', 'The base price is per person in a double room. Any empty field uses the base price.')}</p>
      <div className="row3">
        {ROOM_TYPES.filter((r) => r.k !== 'double').map((r) => (
          <label key={r.k}>{T(`غرفة ${r.ar} (للفرد)`, `${r.en} room (per person)`)}<input className="inp" type="number" min="0" placeholder={ph} value={p.rooms?.[r.k] ?? ''} onChange={(e) => setRoom(r.k, e.target.value)} /></label>
        ))}
      </div>
      <div className="row2">
        <label>{T('سعر الطفل (2–11 سنة)', 'Child price (2–11)')}<input className="inp" type="number" min="0" placeholder={ph} value={p.child ?? ''} onChange={(e) => upd({ child: e.target.value === '' ? null : e.target.value })} /></label>
        <label>{T('سعر الرضيع (أقل من سنتين)', 'Infant price (under 2)')}<input className="inp" type="number" min="0" placeholder={T('زي سعر الطفل', 'Same as child')} value={p.infant ?? ''} onChange={(e) => upd({ infant: e.target.value === '' ? null : e.target.value })} /></label>
      </div>
      <div className="extras-ed">
        <b className="small">{T('إضافات اختيارية للعميل', 'Optional extras for travelers')}</b>
        {extras.map((x, i) => (
          <div key={x.id || i} className="extra-row">
            <input className="inp" placeholder={T('الاسم بالعربي', 'Name (Arabic)')} maxLength={50} value={x.name?.ar || ''} onChange={(e) => setExtra(i, { name: { ...x.name, ar: e.target.value } })} />
            <input className="inp ltr" placeholder={T('الاسم بالإنجليزي', 'Name (English)')} maxLength={50} value={x.name?.en || ''} onChange={(e) => setExtra(i, { name: { ...x.name, en: e.target.value } })} />
            <input className="inp" type="number" min="0" placeholder={T('السعر', 'Price')} value={x.price ?? ''} onChange={(e) => setExtra(i, { price: e.target.value })} />
            <select className="sel" value={x.per || 'person'} onChange={(e) => setExtra(i, { per: e.target.value })}>
              <option value="person">{T('للفرد', 'per person')}</option>
              <option value="booking">{T('للحجز كله', 'per booking')}</option>
            </select>
            <button type="button" className="btn btn-danger btn-xs" aria-label={T('امسح', 'Remove')} onClick={() => upd({ extras: extras.filter((_, j) => j !== i) })}><Icon name="trash" size={15} /></button>
          </div>
        ))}
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => upd({ extras: [...extras, { id: uid('x'), name: { ar: '', en: '' }, price: '', per: 'person' }] })}><Icon name="plus" size={15} />{T('ضيف إضافة', 'Add extra')}</button>
      </div>
    </details>
  );
}

/* datetime-local wants local time without seconds/zone */
const toLocalInput = (iso) => { const d = new Date(iso); const p = (n) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`; };

/* ---------- optional Umrah details (see data/umrah.js) ---------- */

function cleanUmrah(u) {
  if (!u) return null;
  const n = (v) => (v === '' || v === null || v === undefined || Number.isNaN(+v) || +v < 0 ? null : Math.round(+v));
  const out = {
    hotelMakkah: String(u.hotelMakkah || '').trim().slice(0, 80),
    hotelMadinah: String(u.hotelMadinah || '').trim().slice(0, 80),
    distanceHaram: n(u.distanceHaram), distanceNabawi: n(u.distanceNabawi),
    nightsMakkah: n(u.nightsMakkah), nightsMadinah: n(u.nightsMadinah),
    flight: FLIGHT_TYPES[u.flight] ? u.flight : null,
    airline: u.flight === 'road' ? '' : String(u.airline || '').trim().slice(0, 40),
  };
  return Object.values(out).some((v) => v !== null && v !== '') ? out : null;
}

function UmrahEditor({ umrah, nights, onChange }) {
  const { T, L } = useLang();
  const u = umrah || {};
  const upd = (k, v) => onChange({ ...u, [k]: v });
  const sum = (+u.nightsMakkah || 0) + (+u.nightsMadinah || 0);
  const mismatch = (u.nightsMakkah !== undefined && u.nightsMakkah !== '' || u.nightsMadinah !== undefined && u.nightsMadinah !== '') && nights && sum !== nights;
  return (
    <details className="pricing-ed umrah-ed" open>
      <summary><Icon name="moon" size={16} />{T('تفاصيل العمرة (اختياري، بتظهر للعملاء وفي الفلاتر)', 'Umrah details (optional — shown to travelers and used in filters)')}</summary>
      <div className="row2">
        <label>{T('فندق مكة', 'Makkah hotel')}<input className="inp" maxLength={80} value={u.hotelMakkah || ''} onChange={(e) => upd('hotelMakkah', e.target.value)} /></label>
        <label>{T('فندق المدينة', 'Madinah hotel')}<input className="inp" maxLength={80} value={u.hotelMadinah || ''} onChange={(e) => upd('hotelMadinah', e.target.value)} /></label>
      </div>
      <div className="row2">
        <label>{T('المسافة للحرم (متر)', 'Distance to the Haram (m)')}<input className="inp" type="number" min="0" value={u.distanceHaram ?? ''} onChange={(e) => upd('distanceHaram', e.target.value)} /></label>
        <label>{T('المسافة للمسجد النبوي (متر)', "Distance to the Prophet's Mosque (m)")}<input className="inp" type="number" min="0" value={u.distanceNabawi ?? ''} onChange={(e) => upd('distanceNabawi', e.target.value)} /></label>
      </div>
      <div className="row2">
        <label>{T('ليالي مكة', 'Nights in Makkah')}<input className="inp" type="number" min="0" value={u.nightsMakkah ?? ''} onChange={(e) => upd('nightsMakkah', e.target.value)} /></label>
        <label>{T('ليالي المدينة', 'Nights in Madinah')}<input className="inp" type="number" min="0" value={u.nightsMadinah ?? ''} onChange={(e) => upd('nightsMadinah', e.target.value)} /></label>
      </div>
      {mismatch && <p className="warn-line xs"><Icon name="clock" size={13} />{T(`مجموع ليالي مكة والمدينة (${sum}) مختلف عن عدد ليالي العرض (${nights}).`, `Makkah + Madinah nights (${sum}) don't match the offer's nights (${nights}).`)}</p>}
      <div className="row2">
        <label>{T('نوع السفر', 'Travel type')}
          <select className="sel" value={u.flight || ''} onChange={(e) => upd('flight', e.target.value)}>
            <option value="">{T('— اختار —', '— choose —')}</option>
            {Object.entries(FLIGHT_TYPES).map(([k, v]) => <option key={k} value={k}>{L(v)}</option>)}
          </select>
        </label>
        {u.flight !== 'road' && <label>{T('شركة الطيران', 'Airline')}<input className="inp" maxLength={40} value={u.airline || ''} onChange={(e) => upd('airline', e.target.value)} placeholder="EgyptAir" /></label>}
      </div>
    </details>
  );
}

export function OfferForm({ offer }) {
  const { T, L } = useLang();
  const store = useStore();
  const { toast } = useUI();
  const close = useModalClose();
  const admin = store.isAdmin();
  const mine = store.currentAgency();
  const isNew = !offer;
  const [o, setO] = useState(() => offer || {
    agencyId: mine?.id || store.list('agencies')[0]?.id, dest: 'sharm', category: 'beach', from: mine?.city || 'cairo',
    title: { ar: '', en: '' }, price: '', oldPrice: '', nights: 4, seats: 10, features: [], img: 'px:18886592', active: true, featured: false,
    date: new Date(Date.now() + 20 * 864e5).toISOString().slice(0, 10),
  });
  const set = (k, v) => setO((x) => ({ ...x, [k]: v }));
  const photos = [...new Set([...(DESTS[o.dest]?.photos || []).map((p) => `px:${p}`), ...PHOTO_LIBRARY])];

  const upload = async (e) => {
    const f = e.target.files[0]; if (!f) return;
    try { set('img', await compressImage(f)); } catch { toast(T('مش قادر أقرا الصورة دي', 'Could not read that image'), 'err'); }
  };

  const save = (e) => {
    e.preventDefault();
    if (mine && offer && offer.agencyId !== mine.id) return toast(T('العرض ده مش بتاعك', 'Not your offer'), 'err');
    const id = offer?.id || uid('o');
    const agencyId = admin ? o.agencyId : mine.id;
    // Plan limit: an agency can't publish more live offers than its plan allows (saved hidden instead).
    // Only checked when publishing a new or hidden offer — editing an offer that is already live never hides it.
    let active = o.active !== false;
    let limited = false;
    const plan = planOf(store.agency(agencyId));
    const goingLive = active && (isNew || offer.active === false || isExpired(offer));
    if (goingLive && !admin && !isExpired({ date: o.date }) && liveCountOf(store.list('offers').filter((x) => x.id !== id), agencyId, isExpired) >= plan.maxLive) {
      active = false;
      limited = true;
      toast(T(`اتحفظ مخفي — باقتك (${plan.name.ar}) بتسمح بـ ${plan.maxLive} عروض ظاهرة بس.`, `Saved as hidden — your ${plan.name.en} plan allows ${plan.maxLive} live offers.`), 'err');
    }
    const hasDiscount = +o.oldPrice > +o.price;
    store.set('offers', id, {
      ...offer, ...o,
      agencyId,
      category: DESTS[o.dest]?.cat || o.category,
      title: { ar: o.title.ar.trim(), en: (o.title.en || '').trim() || o.title.ar.trim() },
      price: +o.price || 0, oldPrice: +o.oldPrice || null, nights: Math.max(1, +o.nights || 1), seats: Math.max(0, +o.seats || 0),
      pricing: cleanPricing(o.pricing),
      umrah: DESTS[o.dest]?.cat === 'umrah' ? cleanUmrah(o.umrah) : null,
      active,
      flashEndsAt: hasDiscount && o.flashEndsAt && +new Date(o.flashEndsAt) > Date.now() ? new Date(o.flashEndsAt).toISOString() : null,
      views: offer?.views || 0, createdAt: offer?.createdAt || Date.now(), updatedAt: Date.now(),
    });
    const willNotify = offer ? store.list('alerts').filter((x) => x.offerId === offer.id && x.status === 'waiting' && (x.kinds || ['price']).includes('price') && (+o.price || 0) < +x.priceAtSignup).length : 0;
    if (!limited) toast(willNotify
      ? T(`السعر نزل — ${willNotify} ${willNotify === 1 ? 'شخص كان' : 'أشخاص كانوا'} مستنيين تنبيه. كلّمهم من "قائمة الانتظار".`, `Price dropped — ${willNotify} ${willNotify === 1 ? 'person was' : 'people were'} waiting. Contact them from the Waiting list.`)
      : isNew ? T('العرض اتضاف', 'Offer added') : T('العرض اتعدّل', 'Offer updated'));
    close();
  };

  return (
    <>
      <div className="mhead"><h3>{isNew ? T('عرض جديد', 'New offer') : T('تعديل العرض', 'Edit offer')}</h3><button className="xbtn" onClick={close}><Icon name="x" /></button></div>
      <form className="mbody form" onSubmit={save}>
        {admin && (
          <label>{T('الشركة', 'Agency')}
            <select className="sel" value={o.agencyId} onChange={(e) => set('agencyId', e.target.value)}>{store.list('agencies').map((a) => <option key={a.id} value={a.id}>{L(a.name)}</option>)}</select>
          </label>
        )}
        <div className="row2">
          <label>{T('العنوان بالعربي', 'Title (Arabic)')}<input className="inp" required maxLength={80} value={o.title.ar} onChange={(e) => set('title', { ...o.title, ar: e.target.value })} placeholder="شرم الشيخ 5 ليالي شامل" /></label>
          <label>{T('العنوان بالإنجليزي', 'Title (English)')}<input className="inp ltr" maxLength={80} value={o.title.en} onChange={(e) => set('title', { ...o.title, en: e.target.value })} placeholder="Sharm — 5 nights all inclusive" /></label>
        </div>
        <div className="row2">
          <label>{T('الوجهة', 'Destination')}<select className="sel" value={o.dest} onChange={(e) => { set('dest', e.target.value); set('img', `px:${DESTS[e.target.value].photos[0]}`); }}>{Object.keys(DESTS).map((k) => <option key={k} value={k}>{L(DESTS[k])} — {L(CATS[DESTS[k].cat])}</option>)}</select></label>
          <label>{T('السفر من', 'Departing from')}<select className="sel" value={o.from} onChange={(e) => set('from', e.target.value)}>{Object.keys(CITIES).map((k) => <option key={k} value={k}>{L(CITIES[k])}</option>)}</select></label>
        </div>
        <div className="row2">
          <label>{T('السعر للفرد (ج.م)', 'Price per person (EGP)')}<input className="inp" type="number" min="0" required value={o.price} onChange={(e) => set('price', e.target.value)} /></label>
          <label>{T('السعر قبل الخصم (اختياري)', 'Price before discount (optional)')}<input className="inp" type="number" min="0" value={o.oldPrice || ''} onChange={(e) => set('oldPrice', e.target.value)} /></label>
        </div>
        {+o.oldPrice > +o.price && (
          <label className="flash-field">{T('عرض لفترة محدودة؟ الخصم ينتهي في (اختياري)', 'Flash deal? Discount ends at (optional)')}
            <input className="inp ltr" type="datetime-local" value={o.flashEndsAt ? toLocalInput(o.flashEndsAt) : ''} min={toLocalInput(new Date().toISOString())} onChange={(e) => set('flashEndsAt', e.target.value ? new Date(e.target.value).toISOString() : null)} />
            <small className="dim">{T('هيظهر عدّاد تنازلي على العرض لحد الميعاد ده.', 'A countdown shows on the offer until this time.')}</small>
          </label>
        )}
        <div className="row3">
          <label>{T('عدد الليالي', 'Nights')}<input className="inp" type="number" min="1" required value={o.nights} onChange={(e) => set('nights', e.target.value)} /></label>
          <label>{T('الأماكن المتاحة', 'Seats')}<input className="inp" type="number" min="0" required value={o.seats} onChange={(e) => set('seats', e.target.value)} /></label>
          <label>{T('ميعاد السفر', 'Departure')}<input className="inp" type="date" required value={o.date} onChange={(e) => set('date', e.target.value)} /></label>
        </div>
        {DESTS[o.dest]?.cat === 'umrah' && <UmrahEditor umrah={o.umrah} nights={+o.nights || 0} onChange={(u) => set('umrah', u)} />}
        <PricingEditor pricing={o.pricing} base={+o.price || 0} onChange={(p) => set('pricing', p)} />
        <label>{T('العرض بيشمل', 'Includes')}</label>
        <div className="feat-pick">
          {Object.entries(FEATURES).map(([k, f]) => (
            <label key={k} className={o.features.includes(k) ? 'on' : ''}>
              <input type="checkbox" checked={o.features.includes(k)} onChange={(e) => set('features', e.target.checked ? [...o.features, k] : o.features.filter((x) => x !== k))} />{L(f)}
            </label>
          ))}
        </div>
        <label>{T('الصورة', 'Photo')}</label>
        <div className="upl">
          <div className="pv"><Photo src={o.img} w={400} /></div>
          <div>
            <label className="btn btn-ghost btn-sm"><Icon name="up" />{T('ارفع صورة من جهازك', 'Upload your photo')}<input type="file" accept="image/*" hidden onChange={upload} /></label>
            <div className="dim xs mt8">{T('أو اختار صورة من المكتبة:', 'or pick one from the library:')}</div>
          </div>
        </div>
        <div className="photo-pick">{photos.slice(0, 18).map((p) => <button type="button" key={p} className={o.img === p ? 'on' : ''} onClick={() => set('img', p)}><Photo src={p} w={240} /></button>)}</div>
        <div className="row-start">
          <label className="toggle"><input type="checkbox" checked={o.active !== false} onChange={(e) => set('active', e.target.checked)} /><i />{T('ظاهر للعملاء', 'Visible to customers')}</label>
          {admin && <label className="toggle"><input type="checkbox" checked={!!o.featured} onChange={(e) => set('featured', e.target.checked)} /><i />{T('عرض مميز', 'Featured')}</label>}
        </div>
        <div className="row-end">
          <button type="button" className="btn btn-ghost" onClick={close}>{T('إلغاء', 'Cancel')}</button>
          <button className="btn btn-sun">{isNew ? T('أضف العرض', 'Add offer') : T('احفظ', 'Save')}</button>
        </div>
      </form>
    </>
  );
}

export function AgencyForm({ agency }) {
  const { T, L } = useLang();
  const store = useStore();
  const { toast } = useUI();
  const close = useModalClose();
  const isNew = !agency;
  const acc = agency ? store.get('accounts', agency.id) : null;
  const [a, setA] = useState(() => agency || {
    name: { ar: '', en: '' }, tagline: { ar: '', en: '' }, desc: { ar: '', en: '' }, city: 'cairo', license: '', phone: '', whatsapp: '', email: '',
    since: new Date().getFullYear(), rating: 4.5, reviews: 0, color: '#14A79D', verified: false, active: true,
  });
  const [login, setLogin] = useState(acc?.email || '');
  const [pass, setPass] = useState('');
  const set = (k, v) => setA((x) => ({ ...x, [k]: v }));
  const setL = (k, lang, v) => setA((x) => ({ ...x, [k]: { ...x[k], [lang]: v } }));

  const save = (e) => {
    e.preventDefault();
    const id = agency?.id || uid('a');
    const em = login.toLowerCase().trim();
    if (store.list('accounts').some((x) => x.email.toLowerCase() === em && x.id !== id)) return toast(T('إيميل الدخول ده مستخدم قبل كده', 'That login email is already used'), 'err');
    if (!pass && (!acc || acc.email !== em)) return toast(T('اكتب باسورد للحساب', 'Enter a password for this login'), 'err');
    store.set('agencies', id, {
      ...a, name: { ar: a.name.ar.trim(), en: a.name.en.trim() || a.name.ar.trim() }, whatsapp: String(a.whatsapp).replace(/\D/g, ''),
      since: +a.since || new Date().getFullYear(), rating: Math.min(5, +a.rating || 0), reviews: +a.reviews || 0, createdAt: a.createdAt || Date.now(),
    });
    store.set('accounts', id, { role: 'agency', agencyId: id, email: em, passHash: pass ? passHash(em, pass) : acc.passHash });
    toast(isNew ? T(`الشركة اتضافت · الدخول: ${em}`, `Agency added · login: ${em}`) : T('اتحفظ', 'Saved'));
    close();
  };

  return (
    <>
      <div className="mhead"><h3>{isNew ? T('شركة جديدة', 'New agency') : T('تعديل الشركة', 'Edit agency')}</h3><button className="xbtn" onClick={close}><Icon name="x" /></button></div>
      <form className="mbody form" onSubmit={save}>
        <div className="row2">
          <label>{T('الاسم بالعربي', 'Name (Arabic)')}<input className="inp" required value={a.name.ar} onChange={(e) => setL('name', 'ar', e.target.value)} /></label>
          <label>{T('الاسم بالإنجليزي', 'Name (English)')}<input className="inp ltr" value={a.name.en} onChange={(e) => setL('name', 'en', e.target.value)} /></label>
        </div>
        <div className="row2">
          <label>{T('الشعار بالعربي', 'Tagline (Arabic)')}<input className="inp" value={a.tagline.ar} onChange={(e) => setL('tagline', 'ar', e.target.value)} /></label>
          <label>{T('الشعار بالإنجليزي', 'Tagline (English)')}<input className="inp ltr" value={a.tagline.en} onChange={(e) => setL('tagline', 'en', e.target.value)} /></label>
        </div>
        <div className="row3">
          <label>{T('المدينة', 'City')}<select className="sel" value={a.city} onChange={(e) => set('city', e.target.value)}>{Object.keys(CITIES).map((k) => <option key={k} value={k}>{L(CITIES[k])}</option>)}</select></label>
          <label>{T('رقم الترخيص', 'License no.')}<input className="inp ltr" value={a.license} onChange={(e) => set('license', e.target.value)} /></label>
          <label>{T('سنة التأسيس', 'Founded')}<input className="inp" type="number" value={a.since} onChange={(e) => set('since', e.target.value)} /></label>
        </div>
        <div className="row3">
          <label>{T('الموبايل', 'Phone')}<input className="inp ltr" value={a.phone} onChange={(e) => set('phone', e.target.value)} /></label>
          <label>{T('واتساب', 'WhatsApp')}<input className="inp ltr" value={a.whatsapp} placeholder="2010xxxxxxxx" onChange={(e) => set('whatsapp', e.target.value)} /></label>
          <label>{T('إيميل التواصل', 'Contact email')}<input className="inp ltr" type="email" value={a.email} onChange={(e) => set('email', e.target.value)} /></label>
        </div>
        <div className="row3">
          <label>{T('التقييم (من 5)', 'Rating (of 5)')}<input className="inp" type="number" step=".1" min="0" max="5" value={a.rating} onChange={(e) => set('rating', e.target.value)} /></label>
          <label>{T('عدد التقييمات', 'Reviews')}<input className="inp" type="number" min="0" value={a.reviews} onChange={(e) => set('reviews', e.target.value)} /></label>
          <label>{T('اللون', 'Color')}<input type="color" className="color" value={a.color} onChange={(e) => set('color', e.target.value)} /></label>
        </div>
        <label>{T('نبذة بالعربي', 'About (Arabic)')}<textarea className="inp" rows="2" value={a.desc.ar} onChange={(e) => setL('desc', 'ar', e.target.value)} /></label>
        <label>{T('نبذة بالإنجليزي', 'About (English)')}<textarea className="inp ltr" rows="2" value={a.desc.en} onChange={(e) => setL('desc', 'en', e.target.value)} /></label>
        <div className="box sand">
          <b className="row-start small"><Icon name="lock" />{T('حساب دخول الشركة', 'Agency login')}</b>
          <div className="row2 mt8">
            <label>{T('إيميل الدخول', 'Login email')}<input className="inp ltr" type="email" required value={login} onChange={(e) => setLogin(e.target.value)} /></label>
            <label>{isNew ? T('الباسورد', 'Password') : T('باسورد جديد (اختياري)', 'New password (optional)')}<input className="inp ltr" minLength={6} required={isNew} value={pass} autoComplete="off" onChange={(e) => setPass(e.target.value)} /></label>
          </div>
        </div>
        <div className="row-start">
          <label className="toggle"><input type="checkbox" checked={!!a.verified} onChange={(e) => set('verified', e.target.checked)} /><i />{T('موثّقة', 'Verified')}</label>
          <label className="toggle"><input type="checkbox" checked={a.active !== false} onChange={(e) => set('active', e.target.checked)} /><i />{T('شغالة', 'Active')}</label>
        </div>
        <div className="row-end">
          <button type="button" className="btn btn-ghost" onClick={close}>{T('إلغاء', 'Cancel')}</button>
          <button className="btn btn-sun">{isNew ? T('أضف الشركة', 'Add agency') : T('احفظ', 'Save')}</button>
        </div>
      </form>
    </>
  );
}

export function PasswordForm({ accountId }) {
  const { T } = useLang();
  const store = useStore();
  const { toast } = useUI();
  const submit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const acc = store.get('accounts', accountId);
    if (!acc) return;
    if (passHash(acc.email, f.get('cur')) !== acc.passHash) return toast(T('الباسورد الحالي غلط', 'Current password is wrong'), 'err');
    if (f.get('n1') !== f.get('n2')) return toast(T('الباسوردين مش زي بعض', "Passwords don't match"), 'err');
    store.update('accounts', accountId, { passHash: passHash(acc.email, f.get('n1')) });
    e.currentTarget.reset();
    toast(T('الباسورد اتغيّر', 'Password updated'));
  };
  return (
    <form className="panel form" onSubmit={submit}>
      <h3>{T('تغيير الباسورد', 'Change password')}</h3>
      <label>{T('الباسورد الحالي', 'Current password')}<input className="inp ltr" name="cur" type="password" required /></label>
      <label>{T('الباسورد الجديد', 'New password')}<input className="inp ltr" name="n1" type="password" required minLength={6} /></label>
      <label>{T('تأكيد الباسورد', 'Confirm password')}<input className="inp ltr" name="n2" type="password" required minLength={6} /></label>
      <button className="btn btn-primary">{T('حفظ الباسورد', 'Save password')}</button>
    </form>
  );
}
