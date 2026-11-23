import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import { Photo } from './Media';
import { useLang } from '../lib/i18n';
import { useStore } from '../store/store';
import { useUI, useModalClose } from './UI';
import { CATS, CITIES, DESTS, FEATURES } from '../data/catalog';
import { discount, fdate, fmt, money, MONTHS } from '../lib/format';
import { navigate } from '../lib/router';
import { Avatar, CompareButton, OfferCard, Verified, stars } from './Cards';
import { BookingForm } from './Booking';

export function OfferModal({ id }) {
  const { T, L, lang } = useLang();
  const store = useStore();
  const { open, closeAll } = useUI();
  const closeSelf = useModalClose();
  const o = store.get('offers', id);
  const counted = useRef(false);
  const [photoIdx, setPhotoIdx] = useState(0);

  useEffect(() => {
    if (o && !counted.current) { counted.current = true; store.update('offers', id, { views: (o.views || 0) + 1 }); }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!o) return null;
  const a = store.agency(o.agencyId) || {};
  const gallery = [o.img, ...(DESTS[o.dest]?.photos || []).map((p) => `px:${p}`).filter((p) => p !== o.img)].slice(0, 4);
  const more = store.liveOffers().filter((x) => x.agencyId === o.agencyId && x.id !== id).slice(0, 3);
  const goPage = (to) => { closeAll(); navigate(to); };

  return (
    <>
      <div className="od-hero">
        <Photo src={gallery[photoIdx]} w={1600} sizes="(max-width: 900px) 100vw, 920px" priority />
        <button className="xbtn floating" onClick={() => closeSelf()}><Icon name="x" /></button>
        {gallery.length > 1 && (
          <div className="thumbs">
            {gallery.map((g, k) => <button key={g} className={k === photoIdx ? 'on' : ''} onClick={() => setPhotoIdx(k)}><Photo src={g} w={200} /></button>)}
          </div>
        )}
      </div>
      <div className="mbody">
        <div className="od-grid">
          <div>
            <div className="badges">
              <span className="badge outline" style={{ color: CATS[o.category]?.color }}>{L(CATS[o.category])}</span>
              {discount(o) > 0 && <span className="badge hot">-{discount(o)}%</span>}
              {o.seats <= 6 && <span className="badge warm"><Icon name="fire" size={14} />{T(`باقي ${o.seats} أماكن`, `${o.seats} spots left`)}</span>}
            </div>
            <h2 className="od-title">{L(o.title)}</h2>
            <button className="fullpage-link" onClick={() => goPage(`offer/${o.id}`)}><Icon name="out" size={15} />{T('افتح صفحة العرض كاملة', 'Open the full offer page')}</button>
            <div className="meta lg">
              <span><Icon name="pin" size={16} />{L(DESTS[o.dest])}</span>
              <span><Icon name="moon" size={16} />{o.nights} {T('ليالي', 'nights')}</span>
              <span><Icon name="cal" size={16} />{fdate(o.date, lang)}</span>
              <span><Icon name="users" size={16} />{o.seats} {T('مكان متاح', 'seats left')}</span>
              <span><Icon name="plane" size={16} />{T('من', 'from')} {L(CITIES[o.from])}</span>
            </div>
            <div className="box">
              <h4>{T('العرض بيشمل', "What's included")}</h4>
              <div className="inc">{(o.features || []).map((k) => <span key={k}><Icon name="check" size={14} />{L(FEATURES[k]) || k}</span>)}</div>
            </div>
            <div className="row2 mt12">
              <div className="box sm"><span className="dim small">{T('سعر الليلة', 'Per night')}</span><b className="big">{money(Math.round(o.price / o.nights), lang)}</b></div>
              <div className="box sm"><span className="dim small">{T('شافوا العرض', 'Viewed')}</span><b className="big">{fmt(o.views)} {T('مرة', 'times')}</b></div>
            </div>
            <div className="box agency-row mt12" onClick={() => goPage(`agency/${a.id}`)}>
              <Avatar agency={a} size="lg" />
              <div style={{ flex: 1 }}>
                <b>{L(a.name)} {a.verified && <Verified />}</b>
                <div className="dim small"><span className="stars">{stars(a.rating)}</span> {a.rating} · {L(CITIES[a.city])} · {T('ترخيص', 'License')} {a.license || '-'}</div>
              </div>
              <Icon name="arrow" flip />
            </div>
            {more.length > 0 && (
              <>
                <h4 className="mt18">{T('عروض تانية من نفس الشركة', 'More from this agency')}</h4>
                <div className="mini-list">
                  {more.map((m) => (
                    <div key={m.id} className="box mini" onClick={() => { closeSelf(); setTimeout(() => open(() => <OfferModal id={m.id} />, { size: 'lg' }), 280); }}>
                      <div className="thumb"><Photo src={m.img} w={200} /></div>
                      <span>{L(m.title)}</span><b>{fmt(m.price)}</b>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          <div>
            <div className="box">
              <div className="price"><small>{T('السعر للفرد', 'Price per person')}</small><div><b className="xl">{fmt(o.price)}</b> <small>{T('ج.م', 'EGP')}</small>{o.oldPrice ? <s>{fmt(o.oldPrice)}</s> : null}</div></div>
              <div className="mt12"><CompareButton id={o.id} variant="button" /></div>
            </div>
            <BookingForm offer={o} className="mt12" />
          </div>
        </div>
      </div>
    </>
  );
}

export function AgencyModal({ id }) {
  const { T, L } = useLang();
  const store = useStore();
  const { closeAll } = useUI();
  const closeSelf = useModalClose();
  const a = store.agency(id);
  if (!a) return null;
  const list = store.liveOffers().filter((o) => o.agencyId === id);
  const cover = list[0]?.img || 'px:22643850';
  return (
    <>
      <div className="ag-cover"><Photo src={cover} w={1600} sizes="920px" /><div className="ov" /><button className="xbtn floating" onClick={() => closeSelf()}><Icon name="x" /></button>
        <div className="ag-head"><Avatar agency={a} size="xl" /><div><h2>{L(a.name)} {a.verified && <Verified />}</h2><span><span className="stars">{stars(a.rating)}</span> {a.rating} ({fmt(a.reviews)} {T('تقييم', 'reviews')}) · {T('من', 'since')} {a.since}</span></div></div>
      </div>
      <div className="mbody">
        <p className="muted">{L(a.desc)}</p>
        <button className="fullpage-link" onClick={() => { closeAll(); navigate(`agency/${a.id}`); }}><Icon name="out" size={15} />{T('افتح صفحة الشركة', 'Open the agency page')}</button>
        <div className="kv mt12 mb18">
          <span><Icon name="pin" size={15} />{L(CITIES[a.city])}</span>
          <span className="ltr"><Icon name="phone" size={15} />{a.phone}</span>
          <span><Icon name="shield" size={15} />{T('ترخيص', 'License')} {a.license || '-'}</span>
          <a className="wa-link" href={`https://wa.me/${String(a.whatsapp || '').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"><Icon name="wa" size={15} />WhatsApp</a>
        </div>
        <h3 className="mb12">{T('عروض الشركة', 'Offers')} ({list.length})</h3>
        {list.length ? <div className="grid-offers">{list.map((o, i) => <OfferCard key={o.id} offer={o} i={i} />)}</div> : <div className="empty">{T('مفيش عروض حالياً', 'No offers right now')}</div>}
      </div>
    </>
  );
}

export function DestModal({ id }) {
  const { T, L, lang } = useLang();
  const store = useStore();
  const closeSelf = useModalClose();
  const d = DESTS[id];
  const list = store.liveOffers().filter((o) => o.dest === id).sort((a, b) => a.price - b.price);
  return (
    <>
      <div className="ag-cover tall"><Photo src={`px:${d.photos[0]}`} w={1800} sizes="920px" priority /><div className="ov" /><button className="xbtn floating" onClick={() => closeSelf()}><Icon name="x" /></button>
        <div className="ag-head"><div><span className="eyebrow light">{L(CATS[d.cat])}</span><h2 className="xl">{L(d)}</h2><span>{L(d.country)}</span></div></div>
      </div>
      <div className="mbody">
        <div className="strip">{d.photos.slice(1).map((p) => <Photo key={p} src={`px:${p}`} w={600} />)}</div>
        <div className="box mb18">
          <b className="small">{T('أحسن شهور للسفر', 'Best months to go')}</b>
          <div className="months">{MONTHS[lang].map((m, i) => <span key={m} className={d.best.includes(i + 1) ? 'on' : ''}>{m}</span>)}</div>
        </div>
        <h3 className="mb12">{T('العروض المتاحة', 'Available offers')} ({list.length})</h3>
        {list.length ? <div className="grid-offers">{list.map((o, i) => <OfferCard key={o.id} offer={o} i={i} />)}</div> : <div className="empty">{T('مفيش عروض للوجهة دي دلوقتي', 'No offers for this destination right now')}</div>}
        <div className="row-end mt18">
          <button className="btn btn-ghost" onClick={() => { closeSelf(); navigate(`destination/${id}`); }}><Icon name="out" size={16} />{T('صفحة الوجهة', 'Destination page')}</button>
          <button className="btn btn-primary" onClick={() => { closeSelf(); navigate(`offers?dest=${id}`); }}>{T('شوف في صفحة العروض', 'Open in offers')} <Icon name="arrow" flip /></button>
        </div>
      </div>
    </>
  );
}

export function ArticleModal({ article: a }) {
  const { T, L } = useLang();
  const closeSelf = useModalClose();
  return (
    <>
      <div className="ag-cover tall"><Photo src={a.photo} w={1800} sizes="920px" priority /><div className="ov" /><button className="xbtn floating" onClick={() => closeSelf()}><Icon name="x" /></button>
        <div className="ag-head"><div><span className="badge green">{L(a.tag)}</span><h2>{L(a.title)}</h2></div></div>
      </div>
      <div className="mbody article">
        {a.body.map((p, i) => <p key={i}>{L(p)}</p>)}
        <button className="btn btn-primary mt12" onClick={() => { closeSelf(); navigate(`offers?cat=${a.cat}`); }}>{T('شوف العروض', 'See offers')} <Icon name="arrow" flip /></button>
      </div>
    </>
  );
}

export function JoinModal() {
  const { T } = useLang();
  const closeSelf = useModalClose();
  return (
    <>
      <div className="mhead"><h3>{T('سجّل شركتك على رحّالة', 'List your agency on Rahhala')}</h3><button className="xbtn" onClick={() => closeSelf()}><Icon name="x" /></button></div>
      <div className="mbody">
        <p className="muted">{T('في النسخة دي، الأدمن هو اللي بيضيف الشركات ويعملّها حساب دخول من لوحة الأدمن.', 'In this version the admin adds agencies and creates their login from the admin dashboard.')}</p>
        <div className="demo">{T('جرّب لوحة الشركة بحساب تجريبي:', 'Try the agency dashboard with a demo account:')} <code>madar@demo.com</code> / <code>Demo@123</code></div>
        <div className="row-end mt18"><button className="btn btn-ghost" onClick={() => { closeSelf(); navigate('pricing'); }}>{T('شوف الباقات', 'See plans')}</button><button className="btn btn-primary" onClick={() => { closeSelf(); navigate('login'); }}>{T('دخول الشركات', 'Agency login')}</button></div>
      </div>
    </>
  );
}
