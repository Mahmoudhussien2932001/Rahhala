import { useEffect, useState } from 'react';
import Icon from '../components/Icon';
import { Photo, Reveal } from '../components/Media';
import { useLang } from '../lib/i18n';
import { navigate } from '../lib/router';
import { fmt } from '../lib/format';
import { EGP_PER_USD, GUIDE_ORDER, GUIDES } from '../data/guides';

/* Country travel guides: hero + quick facts, day-by-day journey, budget and Q&A. */

const SEG_COLORS = ['#14A79D', '#1B7A9C', '#F3B54A', '#FF7A45'];

function tripDays(labels) {
  const last = labels[labels.length - 1];
  return Number(String(last).split(/[–-]/).pop()) || labels.length;
}

export default function Guides({ query }) {
  const { T, L } = useLang();
  const id = GUIDES[query.get('c')] ? query.get('c') : GUIDE_ORDER[0];
  const g = GUIDES[id];
  const [level, setLevel] = useState('mid');
  const days = tripDays(g.dayLabels);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [id]);

  const rows = g.budget[level];
  const perDay = rows.reduce((s, r) => s + r.usd, 0);
  const egp = (usd) => fmt(Math.round((usd * EGP_PER_USD) / 50) * 50);

  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="g-hero" key={id}>
        <div className="g-hero-ph"><Photo src={g.hero} w={2000} sizes="100vw" priority /></div>
        <div className="g-hero-shade" />
        <div className="wrap g-hero-in">
          <div className="eyebrow light"><Icon name="book" size={15} />{T('دليل السفر', 'Travel guide')}</div>
          <h1>{L(g.name)}</h1>
          <p className="g-tag">{L(g.tagline)}</p>
          <div className="g-facts">
            {g.facts.map((f) => (
              <div key={f.k.en} className="g-fact">
                <i><Icon name={f.icon} size={18} /></i>
                <div><span>{L(f.k)}</span><b>{L(f.v)}</b></div>
              </div>
            ))}
          </div>
        </div>
        <nav className="g-switch wrap" aria-label={T('اختار الدولة', 'Choose a country')}>
          {GUIDE_ORDER.map((k) => (
            <button key={k} className={k === id ? 'on' : ''} onClick={() => navigate(`guides?c=${k}`)}>
              <Photo src={GUIDES[k].hero} w={300} sizes="120px" />
              <span>{L(GUIDES[k].name)}</span>
            </button>
          ))}
        </nav>
      </section>

      {/* ---------- intro ---------- */}
      <section className="sec g-intro">
        <div className="wrap">
          <Reveal className="g-intro-in">
            <div className="eyebrow">{T(`خطة ${days} أيام`, `A ${days}-day plan`)}</div>
            <h2>{T(`إزاي تستمتع بـ${L(g.name)} صح`, `How to do ${L(g.name)} right`)}</h2>
            <p className="lead-p">{L(g.intro)}</p>
          </Reveal>
        </div>
      </section>

      {/* ---------- journey ---------- */}
      <section className="sec pt0">
        <div className="wrap">
          <ol className="journey">
            {g.days.map((d, i) => (
              <li key={d.place.en} className="jr">
                <span className="jr-dot">{i + 1}</span>
                <Reveal className="jr-card" variant={i % 2 ? 'left' : 'right'}>
                  <div className="jr-ph">
                    <Photo src={d.photo} w={1000} sizes="(max-width: 900px) 100vw, 45vw" />
                    <span className="jr-day">{T('اليوم', g.dayLabels[i].includes('–') ? 'Days' : 'Day')} <bdi dir="ltr">{g.dayLabels[i]}</bdi></span>
                    <span className="jr-place"><Icon name="pin" size={14} />{L(d.place)}</span>
                  </div>
                  <div className="jr-tx">
                    <h3>{L(d.title)}</h3>
                    <ul>{d.items.map((it) => <li key={it.en}><Icon name="check" size={16} />{L(it)}</li>)}</ul>
                    <div className="jr-tip"><Icon name="sparkle" size={16} /><p>{L(d.tip)}</p></div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- budget ---------- */}
      <section className="sec pt0">
        <div className="wrap">
          <Reveal className="g-budget">
            <div className="gb-head">
              <div>
                <div className="eyebrow">{T('الميزانية', 'Budget')}</div>
                <h2>{T('هتصرف كام تقريباً؟', 'Roughly how much?')}</h2>
                <p className="muted">{T('للفرد في اليوم، من غير الطيران. أرقام تقريبية بتتغير مع الموسم وسعر الصرف.', 'Per person per day, excluding flights. Rough figures that shift with season and exchange rates.')}</p>
              </div>
              <div className="seg seg-text">
                <button className={level === 'low' ? 'on' : ''} onClick={() => setLevel('low')}>{T('اقتصادي', 'Budget')}</button>
                <button className={level === 'mid' ? 'on' : ''} onClick={() => setLevel('mid')}>{T('مريح', 'Comfort')}</button>
              </div>
            </div>
            <div className="gb-bar" role="img" aria-label={rows.map((r) => `${L(r.k)} $${r.usd}`).join(', ')}>
              {rows.map((r, j) => <span key={r.k.en} style={{ flexGrow: r.usd, background: SEG_COLORS[j % SEG_COLORS.length] }} />)}
            </div>
            <div className="gb-grid">
              {rows.map((r, j) => (
                <div key={r.k.en} className="gb-row">
                  <i style={{ background: SEG_COLORS[j % SEG_COLORS.length] }} />
                  <span>{L(r.k)}</span>
                  <b>${r.usd}</b>
                  <small>≈ {egp(r.usd)} {T('ج.م', 'EGP')}</small>
                </div>
              ))}
            </div>
            <div className="gb-total">
              <div><span>{T('في اليوم', 'Per day')}</span><b>${perDay}</b><small>≈ {egp(perDay)} {T('ج.م', 'EGP')}</small></div>
              <div><span>{T(`الرحلة كلها (${days} أيام)`, `Whole trip (${days} days)`)}</span><b>${perDay * days}</b><small>≈ {egp(perDay * days)} {T('ج.م', 'EGP')}</small></div>
            </div>
            <p className="gb-note"><Icon name="plane" size={16} />{L(g.budget.flight)}</p>
            <p className="gb-note dim">{T(`التحويل على أساس الدولار ≈ ${EGP_PER_USD} جنيه.`, `Converted at about ${EGP_PER_USD} EGP per USD.`)}</p>
          </Reveal>
        </div>
      </section>

      {/* ---------- Q&A ---------- */}
      <section className="sec pt0">
        <div className="wrap">
          <Reveal className="head"><div><div className="eyebrow">{T('أسئلة وأجوبة', 'Questions & answers')}</div><h2>{T(`كل اللي بيتسأل عن ${L(g.name)}`, `What travelers ask about ${L(g.name)}`)}</h2></div></Reveal>
          <div className="g-faq">
            {g.faq.map((f, i) => (
              <Reveal key={f.q.en} delay={(i % 2) * 90} as="details" className="gq" open={i === 0}>
                <summary><span className="gq-n">{String(i + 1).padStart(2, '0')}</span>{L(f.q)}<Icon name="plus" /></summary>
                <p>{L(f.a)}</p>
              </Reveal>
            ))}
          </div>
          <p className="g-disclaimer"><Icon name="shield" size={15} />{T('قواعد التأشيرة والأسعار بتتغير — اتأكد من المواقع الرسمية أو السفارة قبل ما تحجز.', 'Visa rules and prices change — confirm with official sites or the embassy before booking.')}</p>
        </div>
      </section>

      {/* ---------- next steps ---------- */}
      <section className="sec pt0">
        <div className="wrap">
          <Reveal className="g-next">
            <div>
              <h2>{T(`جاهز لـ${L(g.name)}؟`, `Ready for ${L(g.name)}?`)}</h2>
              <p>{T('قارن عروض الشركات واحجز معاها مباشرة.', 'Compare agency offers and book with them directly.')}</p>
            </div>
            <button className="btn btn-sun" onClick={() => navigate(g.offersLink)}>{T('شوف العروض', 'See offers')} <Icon name="arrow" flip /></button>
          </Reveal>
          <div className="g-more">
            {GUIDE_ORDER.filter((k) => k !== id).map((k, i) => (
              <Reveal key={k} delay={i * 100} variant="zoom" className="g-more-card" onClick={() => navigate(`guides?c=${k}`)}>
                <Photo src={GUIDES[k].hero} w={900} />
                <div className="ov" />
                <div className="tx"><span>{T('دليل تاني', 'Another guide')}</span><h3>{L(GUIDES[k].name)}</h3><p>{L(GUIDES[k].tagline)}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
