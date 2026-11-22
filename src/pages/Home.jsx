import { useCallback, useMemo, useState } from 'react';
import Icon from '../components/Icon';
import Select from '../components/Select';
import HeroSlider from '../components/HeroSlider';
import Ocean3D from '../components/Ocean3D';
import { Counter, ParallaxPhoto, Photo, Reveal } from '../components/Media';
import { AgencyCard, Avatar, DestCard, OfferCard, Verified } from '../components/Cards';
import { Bars } from '../components/Charts';
import { ArticleModal, JoinModal, OfferModal } from '../components/Modals';
import { useUI } from '../components/UI';
import { useLang } from '../lib/i18n';
import { useStore } from '../store/store';
import { navigate } from '../lib/router';
import { CATS, CITIES, DESTS } from '../data/catalog';
import { daysTo, discount, fmt, MONTHS } from '../lib/format';
import { ARTICLES, FAQ } from '../data/content';

export default function Home() {
  const { T, L, lang } = useLang();
  const store = useStore();
  const { open, toast } = useUI();
  const [tab, setTab] = useState('featured');
  const [word, setWord] = useState(null);
  const onWord = useCallback((s) => setWord(s), []);

  const offers = store.liveOffers();
  const agencies = store.liveAgencies();
  const destKeys = Object.keys(DESTS).filter((k) => offers.some((o) => o.dest === k));
  const withDisc = offers.filter((o) => discount(o));
  const avgDisc = withDisc.length ? Math.round(withDisc.reduce((s, o) => s + discount(o), 0) / withDisc.length) : 0;
  const inq30 = store.list('inquiries').filter((q) => Date.now() - q.createdAt < 30 * 864e5).length;
  const month = new Date().getMonth() + 1;

  const tabList = tab === 'featured' ? offers.filter((o) => o.featured) : offers.filter((o) => o.category === tab);
  const lastMin = offers.filter((o) => { const d = daysTo(o.date); return (d >= 0 && d <= 14) || o.seats <= 5; }).sort((a, b) => daysTo(a.date) - daysTo(b.date)).slice(0, 4);
  const topDests = useMemo(() => [...destKeys].sort((a, b) => offers.filter((o) => o.dest === b).length - offers.filter((o) => o.dest === a).length).slice(0, 7), [offers.length]); // eslint-disable-line
  const perNight = Object.keys(CATS).map((k) => { const l = offers.filter((o) => o.category === k); return [L(CATS[k]), l.length ? Math.round(l.reduce((s, o) => s + o.price / o.nights, 0) / l.length) : 0]; });
  const heatDests = ['mecca', 'sharm', 'hurghada', 'sahel', 'catherine', 'siwa', 'istanbul', 'dubai', 'georgia'];

  const search = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const q = new URLSearchParams();
    for (const k of ['cat', 'dest', 'from', 'max']) { const v = f.get(k); if (v && v !== 'all') q.set(k, v); }
    navigate('offers' + (q.toString() ? '?' + q : ''));
  };

  return (
    <>
      <HeroSlider onWord={onWord}>
        <div className="wrap hero-content">
          <span className="kicker hero-in" style={{ '--d': '0ms' }}><b>{T('جديد', 'New')}</b>{T(`${agencies.length} شركة و${offers.length} عرض في مكان واحد`, `${agencies.length} agencies & ${offers.length} offers in one place`)}</span>
          <h1>
            <span className="ln"><span className="hero-in" style={{ '--d': '120ms' }}>{T('اكتشف', 'Discover')} <em key={word?.photo} className="word">{word ? L(word.word) : ''}</em></span></span>
            <span className="ln"><span className="hero-in" style={{ '--d': '240ms' }}>{T('واحجز مع شركة تثق فيها', 'and book with an agency you trust')}</span></span>
          </h1>
          <p className="lead hero-in" style={{ '--d': '360ms' }}>{T('قارن عروض شركات السياحة المرخّصة للعمرة والمصايف والشاليهات والسفاري والسفر للخارج، واحجز مع الشركة مباشرة.', 'Compare offers from licensed agencies for Umrah, beach holidays, chalets, safaris and trips abroad — then book directly.')}</p>
          <form className="searchbox hero-in" style={{ '--d': '480ms' }} onSubmit={search}>
            <div className="f"><label><Icon name="grid" size={14} />{T('نوع الرحلة', 'Trip type')}</label>
              <Select variant="bare" name="cat" defaultValue="" ariaLabel={T('نوع الرحلة', 'Trip type')} options={[{ value: '', label: T('الكل', 'All') }, ...Object.entries(CATS).map(([k, c]) => ({ value: k, label: L(c) }))]} /></div>
            <div className="f"><label><Icon name="pin" size={14} />{T('الوجهة', 'Destination')}</label>
              <Select variant="bare" name="dest" defaultValue="all" ariaLabel={T('الوجهة', 'Destination')} options={[{ value: 'all', label: T('أي مكان', 'Anywhere') }, ...destKeys.map((k) => ({ value: k, label: L(DESTS[k]) }))]} /></div>
            <div className="f"><label><Icon name="plane" size={14} />{T('السفر من', 'From')}</label>
              <Select variant="bare" name="from" defaultValue="all" ariaLabel={T('السفر من', 'From')} options={[{ value: 'all', label: T('أي مدينة', 'Any city') }, ...Object.keys(CITIES).map((k) => ({ value: k, label: L(CITIES[k]) }))]} /></div>
            <div className="f"><label><Icon name="money" size={14} />{T('الميزانية لحد', 'Budget up to')}</label><input name="max" type="number" inputMode="numeric" placeholder={T('ج.م', 'EGP')} /></div>
            <button className="btn btn-sun go"><Icon name="search" />{T('دوّر', 'Search')}</button>
          </form>
          <div className="quick hero-in" style={{ '--d': '600ms' }}>
            <span>{T('الأكتر بحثاً:', 'Popular:')}</span>
            {['mecca', 'sharm', 'sahel', 'catherine', 'istanbul'].map((k) => <button key={k} onClick={() => navigate(`offers?dest=${k}`)}>{L(DESTS[k])}</button>)}
          </div>
        </div>
      </HeroSlider>

      <div className="ribbon wrap">
        <Reveal className="rb">
          {[
            ['tag', 'teal', offers.length, '', T('عرض متاح', 'Live offers'), 'offers'],
            ['shield', 'ocean', agencies.length, '', T('شركة مرخّصة', 'Licensed agencies'), 'agencies'],
            ['pin', 'sea', destKeys.length, '', T('وجهة', 'Destinations'), 'destinations'],
            ['fire', 'coral', avgDisc, '%', T('متوسط الخصم', 'Average discount'), 'offers'],
            ['inbox', 'sun', inq30, '', T('طلب حجز آخر 30 يوم', 'Requests (30 days)'), null],
          ].map(([ic, tone, n, suf, label, to]) => (
            <div key={ic} className={`rb-st t-${tone} ${to ? 'link' : ''}`} onClick={to ? () => navigate(to) : undefined}>
              <i className="rb-ic"><Icon name={ic} size={22} /></i>
              <div className="rb-tx"><b className="rb-n"><Counter to={n} suffix={suf} /></b><small>{label}</small></div>
            </div>
          ))}
        </Reveal>
      </div>

      <section className="sec">
        <div className="wrap">
          <Reveal className="head"><div><div className="eyebrow">{T('اختار نوع رحلتك', 'Pick your kind of trip')}</div><h2>{T('رايح فين المرة دي؟', 'Where to this time?')}</h2></div>
            <button className="btn btn-ghost" onClick={() => navigate('offers')}>{T('كل العروض', 'All offers')} <Icon name="arrow" flip /></button></Reveal>
          <div className="cats">
            {Object.entries(CATS).map(([k, c], i) => (
              <Reveal key={k} variant="zoom" delay={i * 90} className="cat" onClick={() => navigate(`offers?cat=${k}`)}>
                <Photo src={c.photo} w={900} />
                <div className="ov" />
                <span className="n">{offers.filter((o) => o.category === k).length} {T('عرض', 'offers')}</span>
                <div className="tx"><h3>{L(c)}</h3><p>{L(c.sub)}</p><span className="go"><Icon name="arrow" flip size={16} /></span></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sec pt0">
        <div className="wrap">
          <Reveal className="head"><div><div className="eyebrow">{T('الوجهات الأكتر طلباً', 'Trending destinations')}</div><h2>{T('أماكن تستاهل الرحلة', 'Places worth the trip')}</h2></div>
            <button className="btn btn-ghost" onClick={() => navigate('destinations')}>{T('كل الوجهات', 'All destinations')} <Icon name="arrow" flip /></button></Reveal>
          <div className="dests">{topDests.map((k, i) => <DestCard key={k} id={k} big={i === 0} i={i} />)}</div>
        </div>
      </section>

      <section className="sec pt0">
        <div className="wrap">
          <Reveal className="head"><div><div className="eyebrow">{T('مختارات الأسبوع', 'Picks of the week')}</div><h2>{T('عروض مميزة', 'Featured offers')}</h2></div>
            <div className="tabs">
              {[['featured', T('المميز', 'Featured')], ...Object.entries(CATS).map(([k, c]) => [k, L(c)])].map(([k, n]) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{n}</button>)}
            </div></Reveal>
          <div className="grid-offers" key={tab}>
            {tabList.slice(0, 8).map((o, i) => <OfferCard key={o.id} offer={o} i={i} />)}
            {!tabList.length && <div className="empty">{T('مفيش عروض هنا لسه', 'No offers here yet')}</div>}
          </div>
        </div>
      </section>

      <ParallaxPhoto src="px:4916521" className="banner">
        <div className="banner-shade" />
        <div className="wrap banner-in">
          <Reveal variant="blur"><div className="eyebrow light">{T('سفاري وجبال', 'Safari & Mountains')}</div>
            <h2>{T('الجبال بتنادي، والشروق من فوق القمة حاجة تانية', 'The mountains are calling — sunrise from the summit is something else')}</h2>
            <p>{T('طلوع جبل موسى، تخييم في الصحرا البيضا، وكازبيجي في جورجيا.', 'Climb Mount Sinai, camp in the White Desert, or hike Kazbegi in Georgia.')}</p>
            <button className="btn btn-sun" onClick={() => navigate('offers?cat=adventure')}>{T('عروض المغامرة', 'Adventure offers')} <Icon name="arrow" flip /></button>
          </Reveal>
        </div>
      </ParallaxPhoto>

      {lastMin.length > 0 && (
        <section className="sec">
          <div className="wrap">
            <Reveal className="head"><div><div className="eyebrow warm">{T('الحق قبل ما تخلص', "Grab them before they're gone")}</div><h2>{T('عروض اللحظة الأخيرة', 'Last-minute deals')}</h2></div></Reveal>
            <div className="grid-offers">{lastMin.map((o, i) => <OfferCard key={o.id} offer={o} i={i} />)}</div>
          </div>
        </section>
      )}

      <Ocean3D className="ocean-sec">
        <div className="ocean-overlay wrap">
          <Reveal variant="blur">
            <div className="eyebrow light">{T('مصايف البحر الأحمر والساحل', 'Red Sea & North Coast')}</div>
            <h2>{T('البحر مستنيك', 'The sea is waiting')}</h2>
            <p>{T('شرم، الغردقة، مرسى علم، دهب، والعلمين — اختار البحر اللي يناسبك وقارن بين كل الشركات.', 'Sharm, Hurghada, Marsa Alam, Dahab and Alamein — pick your sea and compare every agency.')}</p>
            <div className="chips-row">
              {['sharm', 'hurghada', 'marsa', 'dahab', 'alamein'].map((k) => <button key={k} className="glass-chip" onClick={() => navigate(`offers?dest=${k}`)}>{L(DESTS[k])}</button>)}
            </div>
          </Reveal>
        </div>
      </Ocean3D>

      <section className="sec dark">
        <div className="wrap">
          <Reveal className="head"><div><div className="eyebrow light">{T('بيانات من العروض الحالية', 'Insights from live offers')}</div><h2>{T('اعرف قبل ما تحجز', 'Know before you book')}</h2>
            <p className="muted">{T('أرقام محسوبة من العروض المنشورة دلوقتي، ومواسم كل وجهة.', 'Numbers computed from offers live right now, plus each destination’s best season.')}</p></div></Reveal>
          <div className="insights">
            <Reveal className="ins-card">
              <h3>{T('متوسط سعر الليلة', 'Average price per night')}</h3>
              <p className="s">{T('للفرد، حسب نوع الرحلة · ج.م', 'Per person, by trip type · EGP')}</p>
              <Bars rows={perNight} color="#2FC2B5" />
              <div className="ins-sep">
                <h3>{T('أرخص عرض لكل نوع', 'Cheapest offer per type')}</h3>
                <div className="cheap">
                  {Object.keys(CATS).map((k) => {
                    const c = offers.filter((o) => o.category === k).sort((a, b) => a.price - b.price)[0];
                    return c ? <button key={k} onClick={() => open(() => <OfferModal id={c.id} />, { size: 'lg' })}><span className="k">{L(CATS[k])}</span><span className="t">{L(c.title)}</span><b>{fmt(c.price)}</b></button> : null;
                  })}
                </div>
              </div>
            </Reveal>
            <Reveal className="ins-card" delay={120}>
              <h3>{T('أحسن وقت للسفر', 'Best time to travel')}</h3>
              <p className="s">{T('الشهور المناسبة لكل وجهة · الشهر الحالي متعلّم', 'Best months per destination · current month highlighted')}</p>
              <div className="scroll-x">
                <table className="heat">
                  <thead><tr><th />{MONTHS[lang].map((m, i) => <th key={m} className={i + 1 === month ? 'now' : ''}>{m}</th>)}</tr></thead>
                  <tbody>
                    {heatDests.map((k) => (
                      <tr key={k}><th>{L(DESTS[k])}</th>
                        {MONTHS.en.map((m, i) => {
                          const b = DESTS[k].best.includes(i + 1), near = DESTS[k].best.includes(i) || DESTS[k].best.includes(i + 2);
                          return <td key={m} className={`${b ? 'l2' : near ? 'l1' : ''} ${i + 1 === month ? 'now' : ''}`} title={`${L(DESTS[k])} · ${MONTHS[lang][i]}: ${b ? T('موسم ممتاز', 'Great season') : near ? T('مناسب', 'Good') : T('مش أحسن وقت', 'Off season')}`} />;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="legend"><span><i className="l2" />{T('موسم ممتاز', 'Great season')}</span><span><i className="l1" />{T('مناسب', 'Good')}</span><span><i className="l0" />{T('مش أحسن وقت', 'Off season')}</span></div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <Reveal className="head"><div><div className="eyebrow">{T('بسيطة جداً', 'Simple as that')}</div><h2>{T('إزاي بتشتغل؟', 'How it works')}</h2></div></Reveal>
          <div className="steps">
            {[
              ['search', T('دوّر', 'Search'), T('اختار نوع الرحلة والوجهة والميزانية، وكل عروض الشركات هتظهرلك.', "Pick trip type, destination and budget — every agency's offers show up."), 'px:18886592'],
              ['scale', T('قارن', 'Compare'), T('حط لحد 3 عروض جنب بعض: السعر، سعر الليلة، الخدمات، وتقييم الشركة.', 'Put up to 3 offers side by side: price, per-night price, inclusions and rating.'), 'px:16660047'],
              ['phone', T('احجز مع الشركة', 'Book with the agency'), T('ابعت طلب حجز أو كلّم الشركة واتساب، والحجز والدفع بيتم عندها.', 'Send a request or WhatsApp the agency — booking and payment happen with them.'), 'px:1287460'],
            ].map(([ic, t, d, ph], i) => (
              <Reveal key={ic} delay={i * 110} className="step">
                <div className="step-ph"><Photo src={ph} w={700} /><span className="n">0{i + 1}</span></div>
                <div className="step-tx"><div className="ic"><Icon name={ic} size={22} /></div><h3>{t}</h3><p className="muted">{d}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sec pt0">
        <div className="wrap">
          <Reveal className="head"><div><div className="eyebrow">{T('الأعلى تقييماً', 'Top rated')}</div><h2>{T('شركات تثق فيها', 'Agencies you can trust')}</h2></div>
            <button className="btn btn-ghost" onClick={() => navigate('agencies')}>{T('كل الشركات', 'All agencies')} <Icon name="arrow" flip /></button></Reveal>
          <div className="grid-ag">{[...agencies].sort((a, b) => b.rating - a.rating).slice(0, 4).map((a, i) => <AgencyCard key={a.id} agency={a} i={i} />)}</div>
        </div>
        <div className="marquee"><div className="track">
          {[...agencies, ...agencies].map((a, i) => <div key={i} className="mq"><Avatar agency={a} /><b>{L(a.name)}</b>{a.verified && <Verified />}<span className="dim">★ {a.rating}</span></div>)}
        </div></div>
      </section>

      <section className="sec">
        <div className="wrap">
          <Reveal className="head"><div><div className="eyebrow">{T('دليل المسافر', "Traveler's guide")}</div><h2>{T('نصايح قبل ما تسافر', 'Tips before you go')}</h2></div></Reveal>
          <div className="arts">
            {ARTICLES.map((a, i) => (
              <Reveal key={i} delay={i * 90} className="art" onClick={() => open(() => <ArticleModal article={a} />, { size: 'lg' })}>
                <Photo src={a.photo} w={900} />
                <div className="tx"><span className="badge green"><Icon name="book" size={14} />{L(a.tag)}</span><h3>{L(a.title)}</h3><p className="muted">{L(a.sum)}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sec pt0">
        <div className="wrap faq-wrap">
          <Reveal><div className="eyebrow">{T('أسئلة شائعة', 'FAQ')}</div><h2>{T('عندك سؤال؟', 'Got questions?')}</h2><p className="muted mt12">{T('لو مش لاقي إجابتك هنا، كلّم الشركة صاحبة العرض مباشرة.', "If your answer isn't here, contact the agency behind the offer.")}</p></Reveal>
          <Reveal className="faq" delay={100}>{FAQ.map((f, i) => <details key={i} open={i === 0}><summary>{L(f.q)}<Icon name="plus" /></summary><p>{L(f.a)}</p></details>)}</Reveal>
        </div>
      </section>

      <section className="sec pt0">
        <div className="wrap">
          <Reveal variant="zoom" className="cta">
            <Photo src="px:24807132" w={1800} sizes="100vw" />
            <div className="cta-shade" />
            <div className="cta-in">
              <div>
                <div className="eyebrow light">{T('لأصحاب شركات السياحة', 'For travel agencies')}</div>
                <h2>{T('اعرض عروضك قدام آلاف المسافرين', 'Put your offers in front of thousands of travelers')}</h2>
                <p>{T('لوحة تحكم خاصة بشركتك تضيف وتعدّل فيها عروضك وأسعارك، وطلبات العملاء توصلك على طول.', 'Your own dashboard to add and update offers — customer requests land straight in your inbox.')}</p>
                <div className="row-start">
                  <button className="btn btn-sun" onClick={() => open(() => <JoinModal />, { size: 'sm' })}>{T('سجّل شركتك', 'List your agency')} <Icon name="arrow" flip /></button>
                  <button className="btn btn-glass" onClick={() => navigate('login')}>{T('دخول الشركات', 'Agency login')}</button>
                </div>
                <form className="news" onSubmit={(e) => { e.preventDefault(); e.currentTarget.reset(); toast(T('اشتركت! هتوصلك أحسن العروض', 'Subscribed! Best deals are on the way')); }}>
                  <input type="email" required placeholder={T('إيميلك عشان توصلك أحسن العروض', 'Your email for the best deals')} />
                  <button className="btn btn-sun btn-sm">{T('اشترك', 'Subscribe')}</button>
                </form>
              </div>
              <ul>
                {[T('لوحة تحكم لشركتك لوحدها', 'A private dashboard for your agency'), T('تعديل الأسعار والأماكن في ثانية', 'Update prices and seats in seconds'), T('طلبات العملاء توصلك مباشرة', 'Customer requests delivered instantly'), T('علامة "موثّقة" للشركات المرخّصة', '"Verified" badge for licensed agencies'), T('إحصائيات عن عروضك وطلباتك', 'Analytics on your offers and leads')].map((t) => <li key={t}><Icon name="check" />{t}</li>)}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
