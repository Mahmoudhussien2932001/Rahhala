import { useEffect, useState } from 'react';
import Icon, { Logo } from './Icon';
import { Photo, Reveal } from './Media';
import { DestModal } from './Modals';
import { useUI } from './UI';
import { useLang } from '../lib/i18n';
import { useStore } from '../store/store';
import { navigate } from '../lib/router';
import { fmt } from '../lib/format';
import { DESTS } from '../data/catalog';
import { GUIDES } from '../data/guides';
import { SCOPES } from '../data/explore';

/* "Within Egypt or abroad?" — the first-visit chooser and the cards on the Destinations page. */


export function WelcomeChooser({ route }) {
  const { T, L } = useLang();
  // Shown every time the site is opened on the home page (closing hides it until the next visit).
  const [show, setShow] = useState(() => route === 'home');

  useEffect(() => {
    if (!show) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [show]); // eslint-disable-line

  if (!show) return null;
  const close = () => setShow(false);
  const pick = (s) => { close(); navigate(`destinations?s=${s}`); };

  return (
    <div className="wc" role="dialog" aria-modal="true" aria-labelledby="wc-title">
      <div className="wc-in">
        <div className="wc-head">
          <Logo size={48} />
          <h2 id="wc-title">{T('بتدوّر على سفر فين؟', 'Where are you looking to travel?')}</h2>
          <p>{T('اختار ونوريك كل الرحلات المتاحة', "Pick one and we'll show you every trip")}</p>
        </div>
        <div className="wc-grid">
          {Object.entries(SCOPES).map(([k, s], i) => (
            <button key={k} className="wc-card" style={{ '--d': `${150 + i * 120}ms` }} onClick={() => pick(k)} autoFocus={i === 0}>
              <Photo src={s.photo} w={1000} sizes="(max-width: 700px) 100vw, 45vw" priority />
              <span className="ov" />
              <span className="tx">
                <b>{L(s.name)}</b>
                <small>{L(s.sub)}</small>
                <i>{T('يلا', "Let's go")} <Icon name="arrow" flip size={16} /></i>
              </span>
            </button>
          ))}
        </div>
        <button className="wc-skip" onClick={close}>{T('أتفرّج على الموقع الأول', 'Just browse the site')}</button>
      </div>
    </div>
  );
}

/* A destination card: catalog offers and/or a travel guide. */
export function ExploreCard({ dest, guide, i = 0 }) {
  const { T, L } = useLang();
  const store = useStore();
  const { open } = useUI();
  const d = dest ? DESTS[dest] : null;
  const g = guide ? GUIDES[guide] : null;
  const offers = dest ? store.liveOffers().filter((o) => o.dest === dest) : [];
  const min = offers.length ? Math.min(...offers.map((o) => o.price)) : 0;
  const inSeason = d?.best.includes(new Date().getMonth() + 1);
  const photo = g ? g.hero : `px:${d.photos[0]}`;
  const name = g && !d ? L(g.name) : L(d);
  const sub = d ? L(d.country) : L(g.tagline);
  const main = () => (g ? navigate(`guides?c=${guide}`) : open(() => <DestModal id={dest} />, { size: 'lg' }));

  return (
    <Reveal variant="zoom" delay={(i % 4) * 70} className="xc">
      <div className="xc-ph" onClick={main}>
        <Photo src={photo} w={800} sizes="(max-width: 700px) 100vw, 25vw" />
        <div className="ov" />
        <div className="xc-tags">
          {inSeason && <span className="tag">☀ {T('موسمها دلوقتي', 'In season')}</span>}
          {g && <span className="tag guide"><Icon name="book" size={12} /> {T('دليل سفر', 'Guide')}</span>}
        </div>
        <div className="xc-tx">
          <h3>{name}</h3>
          <span>{sub}</span>
        </div>
      </div>
      <div className="xc-foot">
        {d ? (
          offers.length
            ? <span className="xc-price">{offers.length} {T('عرض', 'offers')} · {T('من', 'from')} <b>{fmt(min)}</b> {T('ج.م', 'EGP')}</span>
            : <span className="xc-price dim">{T('مفيش عروض دلوقتي', 'No offers right now')}</span>
        ) : <span className="xc-price dim">{T('خطة يوم بيوم وتكلفة', 'Day-by-day plan & costs')}</span>}
        <div className="xc-btns">
          {d && offers.length > 0 && <button className="btn btn-ghost btn-xs" onClick={() => navigate(`offers?dest=${dest}`)}>{T('العروض', 'Offers')}</button>}
          {g && <button className="btn btn-sun btn-xs" onClick={() => navigate(`guides?c=${guide}`)}>{T('الدليل', 'Guide')}</button>}
          {d && !g && <button className="btn btn-sun btn-xs" onClick={main}>{T('التفاصيل', 'Details')}</button>}
        </div>
      </div>
    </Reveal>
  );
}
