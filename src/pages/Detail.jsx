import { useEffect, useRef, useState } from 'react';
import Icon from '../components/Icon';
import { Photo, Reveal } from '../components/Media';
import { PageHeader } from '../components/Layout';
import { Avatar, CompareButton, OfferCard, Verified, stars } from '../components/Cards';
import { BookingForm, InstallmentNote, waLink } from '../components/Booking';
import { ShareButton } from '../components/Share';
import { AlertBox, FavButton } from '../components/Alerts';
import { useLang } from '../lib/i18n';
import { useStore } from '../store/store';
import { Link, navigate } from '../lib/router';
import { usePageMeta } from '../lib/seo';
import { CATS, CITIES, DESTS, FEATURES } from '../data/catalog';
import { GUIDES } from '../data/guides';
import { discount, fdate, fmt, money, MONTHS } from '../lib/format';

/* Full, shareable pages: #/offer/:id, #/destination/:id, #/agency/:id */

function NotFound({ what }) {
  const { T } = useLang();
  usePageMeta(T('مش موجود', 'Not found'));
  return (
    <section className="sec detail-404">
      <div className="wrap empty">
        <Icon name="search" size={30} />
        <h2>{what}</h2>
        <p>{T('ممكن يكون اتشال أو اللينك غلط.', 'It may have been removed, or the link is wrong.')}</p>
        <button className="btn btn-sun" onClick={() => navigate('offers')}>{T('شوف كل العروض', 'Browse all offers')}</button>
      </div>
    </section>
  );
}

function HiddenNote({ children }) {
  return <div className="hidden-note"><Icon name="eye" size={16} />{children}</div>;
}

/* ---------------- offer ---------------- */

function Gallery({ photos, alt }) {
  const { T } = useLang();
  const [i, setI] = useState(0);
  const go = (d) => setI((x) => (x + d + photos.length) % photos.length);
  return (
    <div className="op-gallery" onKeyDown={(e) => { if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); }}>
      <div className="op-main">
        <Photo key={photos[i]} src={photos[i]} alt={alt} w={1800} sizes="(max-width: 900px) 100vw, 66vw" priority />
        {photos.length > 1 && (
          <>
            <button className="op-nav prev" onClick={() => go(-1)} aria-label={T('الصورة اللي فاتت', 'Previous photo')}><Icon name="chev" size={20} /></button>
            <button className="op-nav next" onClick={() => go(1)} aria-label={T('الصورة اللي بعدها', 'Next photo')}><Icon name="chev" size={20} /></button>
            <span className="op-count">{i + 1} / {photos.length}</span>
          </>
        )}
      </div>
      {photos.length > 1 && (
        <div className="op-thumbs">
          {photos.map((p, k) => (
            <button key={p} className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={`${T('صورة', 'Photo')} ${k + 1}`} aria-pressed={k === i}>
              <Photo src={p} w={400} sizes="160px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function OfferPage({ params }) {
  const { T, L, lang } = useLang();
  const store = useStore();
  const id = params[0];
  const o = store.get('offers', id);
  const counted = useRef(false);
  const a = o ? store.agency(o.agencyId) || {} : {};
  const priceLine = o ? `${fmt(o.price)} ${T('ج.م للفرد', 'EGP per person')} · ${o.nights} ${T('ليالي', 'nights')}` : '';
  usePageMeta(o ? L(o.title) : null, o ? `${L(o.title)} — ${L(DESTS[o.dest])}. ${priceLine}. ${L(a.name)}.` : '');

  const live = !!o && store.liveOffers().some((x) => x.id === id);
  const canPreview = !!o && (store.isAdmin() || store.currentAgency()?.id === o.agencyId);

  useEffect(() => {
    if (o && live && !counted.current) { counted.current = true; store.update('offers', id, { views: (o.views || 0) + 1 }); }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!o || (!live && !canPreview)) return <NotFound what={T('العرض ده مش متاح', 'This offer is not available')} />;

  const photos = [...new Set([o.img, ...(DESTS[o.dest]?.photos || []).map((p) => `px:${p}`)])].slice(0, 5);
  const others = store.liveOffers().filter((x) => x.id !== id);
  const more = others.filter((x) => x.agencyId === o.agencyId).slice(0, 4);
  const similar = others
    .filter((x) => x.agencyId !== o.agencyId && (x.dest === o.dest || x.category === o.category))
    .map((x) => ({ x, gap: Math.abs(x.price - o.price) / o.price, score: (x.dest === o.dest ? 2 : 0) + (x.category === o.category ? 1 : 0) }))
    .filter((s) => s.gap <= 0.5)
    .sort((p, q) => q.score - p.score || p.gap - q.gap)
    .slice(0, 4)
    .map((s) => s.x);
  const d = discount(o);

  return (
    <div className="detail op-page">
      <div className="wrap">
        <nav className="dt-crumbs" aria-label={T('مسار الصفحة', 'Breadcrumb')}>
          <Link to="home">{T('الرئيسية', 'Home')}</Link><span>/</span>
          <Link to="offers">{T('العروض', 'Offers')}</Link><span>/</span>
          <Link to={`destination/${o.dest}`}>{L(DESTS[o.dest])}</Link>
        </nav>
        {!live && <HiddenNote>{T('العرض ده مخفي عن الزوار — إنت شايفه عشان إنت صاحبه أو أدمن.', 'This offer is hidden from visitors — you can see it as its owner or an admin.')}</HiddenNote>}

        <Gallery photos={photos} alt={L(o.title)} />

        <div className="op-grid">
          <div className="op-main-col">
            <div className="op-titlebar">
              <div>
                <div className="badges">
                  <span className="badge outline" style={{ color: CATS[o.category]?.color }}>{L(CATS[o.category])}</span>
                  {d > 0 && <span className="badge hot">-{d}%</span>}
                  {o.seats <= 6 && <span className="badge warm"><Icon name="fire" size={14} />{T(`باقي ${o.seats} أماكن`, `${o.seats} spots left`)}</span>}
                </div>
                <h1 className="op-title">{L(o.title)}</h1>
              </div>
              <div className="op-actions"><FavButton id={o.id} variant="button" /><ShareButton to={`offer/${o.id}`} title={L(o.title)} line={priceLine} /></div>
            </div>

            <div className="op-facts">
              {[
                ['pin', T('الوجهة', 'Destination'), <Link key="d" to={`destination/${o.dest}`}>{L(DESTS[o.dest])}</Link>],
                ['cal', T('ميعاد السفر', 'Departure'), fdate(o.date, lang)],
                ['moon', T('المدة', 'Duration'), `${o.nights} ${T('ليالي', 'nights')}`],
                ['plane', T('السفر من', 'From'), L(CITIES[o.from])],
                ['users', T('الأماكن المتاحة', 'Seats left'), o.seats],
                ['money', T('سعر الليلة', 'Per night'), money(Math.round(o.price / o.nights), lang)],
              ].map(([ic, k, v]) => (
                <div key={k} className="op-fact"><i><Icon name={ic} size={18} /></i><div><span>{k}</span><b>{v}</b></div></div>
              ))}
            </div>

            <div className="box">
              <h4>{T('العرض بيشمل', "What's included")}</h4>
              <div className="inc">{(o.features || []).map((k) => <span key={k}><Icon name="check" size={14} />{L(FEATURES[k]) || k}</span>)}</div>
            </div>

            <Link to={`agency/${a.id}`} className="box agency-row mt12">
              <Avatar agency={a} size="lg" />
              <div style={{ flex: 1 }}>
                <b>{L(a.name)} {a.verified && <Verified />}</b>
                <div className="dim small"><span className="stars">{stars(a.rating)}</span> {a.rating} · {L(CITIES[a.city])} · {T('ترخيص', 'License')} {a.license || '-'}</div>
              </div>
              <Icon name="arrow" flip />
            </Link>
          </div>

          <aside className="op-side">
            <div className="box op-pricebox">
              <div className="price"><small>{T('السعر للفرد (غرفة مزدوجة)', 'Price per person (double room)')}</small><div><b className="xl">{fmt(o.price)}</b> <small>{T('ج.م', 'EGP')}</small>{o.oldPrice ? <s>{fmt(o.oldPrice)}</s> : null}</div></div>
              <InstallmentNote total={o.price} />
              <div className="mt12"><CompareButton id={o.id} variant="button" /></div>
            </div>
            <BookingForm offer={o} className="mt12" />
            <AlertBox offer={o} />
          </aside>
        </div>

        {more.length > 0 && (
          <section className="dt-sec">
            <Reveal className="head"><div><div className="eyebrow">{L(a.name)}</div><h2 className="h-md">{T('عروض تانية من نفس الشركة', 'More from this agency')}</h2></div>
              <Link to={`agency/${a.id}`} className="btn btn-ghost btn-sm">{T('صفحة الشركة', 'Agency page')} <Icon name="arrow" flip size={15} /></Link></Reveal>
            <div className="grid-offers">{more.map((x, i) => <OfferCard key={x.id} offer={x} i={i} />)}</div>
          </section>
        )}
        {similar.length > 0 && (
          <section className="dt-sec">
            <Reveal className="head"><div><div className="eyebrow">{T('قارن قبل ما تحجز', 'Compare before you book')}</div><h2 className="h-md">{T('عروض شبهه', 'Similar offers')}</h2></div></Reveal>
            <div className="grid-offers">{similar.map((x, i) => <OfferCard key={x.id} offer={x} i={i} />)}</div>
          </section>
        )}
      </div>
    </div>
  );
}

/* ---------------- destination ---------------- */

export function DestinationPage({ params }) {
  const { T, L, lang } = useLang();
  const store = useStore();
  const id = params[0];
  const d = DESTS[id];
  const list = d ? store.liveOffers().filter((o) => o.dest === id).sort((p, q) => p.price - q.price) : [];
  const min = list.length ? list[0].price : 0;
  usePageMeta(d ? L(d) : null, d ? `${L(d)} — ${L(d.country)}. ${list.length} ${T('عرض من شركات سياحة مرخّصة', 'offers from licensed travel agencies')}${min ? ` ${T('تبدأ من', 'from')} ${fmt(min)} ${T('ج.م', 'EGP')}` : ''}.` : '');
  if (!d) return <NotFound what={T('الوجهة دي مش موجودة', 'Destination not found')} />;
  const guide = GUIDES[id] ? id : null;
  const month = new Date().getMonth() + 1;

  return (
    <>
      <PageHeader title={L(d)} sub={`${L(d.country)} · ${L(CATS[d.cat])}`} crumb={<><Link to="destinations">{T('الوجهات', 'Destinations')}</Link> / {L(d)}</>} photo={`px:${d.photos[0]}`}>
        <div className="ph-actions">
          <span className="ph-stat"><b>{list.length}</b> {T('عرض', 'offers')}</span>
          {min > 0 && <span className="ph-stat">{T('تبدأ من', 'from')} <b>{fmt(min)}</b> {T('ج.م', 'EGP')}</span>}
          <ShareButton to={`destination/${id}`} title={L(d)} line={`${list.length} ${T('عرض', 'offers')}${min ? ` · ${T('تبدأ من', 'from')} ${fmt(min)} ${T('ج.م', 'EGP')}` : ''}`} variant="glass" />
        </div>
      </PageHeader>
      <div className="wrap sec-sm detail">
        {d.photos.length > 1 && <div className="strip">{d.photos.slice(1).map((p) => <Photo key={p} src={`px:${p}`} w={600} sizes="(max-width: 700px) 50vw, 25vw" />)}</div>}
        <div className="dp-row">
          <div className="box">
            <b className="small">{T('أحسن شهور للسفر', 'Best months to go')}</b>
            <div className="months">{MONTHS[lang].map((m, i) => <span key={m} className={`${d.best.includes(i + 1) ? 'on' : ''} ${i + 1 === month ? 'now' : ''}`}>{m}</span>)}</div>
          </div>
          {guide && (
            <Link to={`guides?c=${guide}`} className="box dp-guide">
              <i><Icon name="book" size={20} /></i>
              <div><b>{T('دليل السفر', 'Travel guide')}</b><span className="dim small">{T('خطة يوم بيوم، الميزانية، والتأشيرة', 'Day-by-day plan, budget and visa')}</span></div>
              <Icon name="arrow" flip />
            </Link>
          )}
        </div>
        <Reveal className="head mt22"><div><h2 className="h-md">{T('العروض المتاحة', 'Available offers')} ({list.length})</h2></div>
          {list.length > 0 && <Link to={`offers?dest=${id}`} className="btn btn-ghost btn-sm">{T('فلتر وقارن', 'Filter & compare')} <Icon name="arrow" flip size={15} /></Link>}</Reveal>
        {list.length ? <div className="grid-offers">{list.map((o, i) => <OfferCard key={o.id} offer={o} i={i} />)}</div>
          : <div className="empty">{T('مفيش عروض للوجهة دي دلوقتي', 'No offers for this destination right now')}</div>}
      </div>
    </>
  );
}

/* ---------------- agency ---------------- */

export function AgencyPage({ params }) {
  const { T, L } = useLang();
  const store = useStore();
  const id = params[0];
  const a = store.agency(id);
  const live = !!a && a.active !== false;
  const canPreview = !!a && (store.isAdmin() || store.currentAgency()?.id === id);
  const list = a ? store.liveOffers().filter((o) => o.agencyId === id) : [];
  usePageMeta(a ? L(a.name) : null, a ? `${L(a.name)} — ${L(a.tagline)}. ${L(a.desc)}` : '');
  if (!a || (!live && !canPreview)) return <NotFound what={T('الشركة دي مش متاحة', 'This agency is not available')} />;
  const cover = list[0]?.img || 'px:22643850';
  const cats = [...new Set(list.map((o) => o.category))];

  return (
    <>
      <PageHeader title={L(a.name)} sub={L(a.tagline)} crumb={<><Link to="agencies">{T('الشركات', 'Agencies')}</Link> / {L(a.name)}</>} photo={cover}>
        <div className="ph-actions">
          <span className="ph-stat"><span className="stars">{stars(a.rating)}</span> <b>{a.rating}</b> ({fmt(a.reviews)})</span>
          {a.verified && <span className="ph-stat"><Verified /> {T('موثّقة', 'Verified')}</span>}
          <ShareButton to={`agency/${id}`} title={L(a.name)} line={`${list.length} ${T('عرض', 'offers')} · ${L(a.tagline)}`} variant="glass" />
        </div>
      </PageHeader>
      <div className="wrap sec-sm detail">
        {!live && <HiddenNote>{T('الشركة دي موقوفة ومش ظاهرة للزوار.', 'This agency is suspended and hidden from visitors.')}</HiddenNote>}
        <div className="ap-grid">
          <div className="box ap-about">
            <div className="ap-id"><Avatar agency={a} size="xl" /><div><h2>{L(a.name)} {a.verified && <Verified />}</h2><span className="dim small">{T('شغالة من', 'Since')} {a.since}</span></div></div>
            <p className="muted">{L(a.desc)}</p>
            {cats.length > 0 && <div className="inc">{cats.map((c) => <span key={c}>{L(CATS[c])}</span>)}</div>}
          </div>
          <div className="box ap-contact">
            <h4>{T('تواصل مع الشركة', 'Contact the agency')}</h4>
            <ul>
              <li><Icon name="pin" size={16} />{L(CITIES[a.city])}</li>
              <li><Icon name="phone" size={16} /><a className="ltr" href={`tel:${a.phone}`}>{a.phone}</a></li>
              <li><Icon name="shield" size={16} />{T('ترخيص', 'License')} {a.license || '-'}</li>
            </ul>
            <a className="btn btn-sun" href={waLink(a.whatsapp, T('مرحباً، شفت عروضكم على رحّالة', 'Hi, I found your offers on Rahhala'))} target="_blank" rel="noopener noreferrer"><Icon name="wa" />{T('كلّمهم واتساب', 'WhatsApp them')}</a>
          </div>
        </div>
        <Reveal className="head mt22"><div><h2 className="h-md">{T('عروض الشركة', 'Offers')} ({list.length})</h2></div></Reveal>
        {list.length ? <div className="grid-offers">{list.map((o, i) => <OfferCard key={o.id} offer={o} i={i} />)}</div>
          : <div className="empty">{T('مفيش عروض حالياً', 'No offers right now')}</div>}
      </div>
    </>
  );
}
