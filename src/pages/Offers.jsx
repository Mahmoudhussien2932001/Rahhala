import { useEffect, useMemo, useState } from 'react';
import Icon from '../components/Icon';
import Select from '../components/Select';
import { PageHeader } from '../components/Layout';
import { OfferCard } from '../components/Cards';
import { useLang } from '../lib/i18n';
import { useStore } from '../store/store';
import { CATS, CITIES, DESTS } from '../data/catalog';
import { discount } from '../lib/format';

const EMPTY = { cats: [], dest: 'all', from: 'all', min: '', max: '', nights: 'all', verified: false, q: '', sort: 'featured' };

export default function Offers({ query }) {
  const { T, L } = useLang();
  const store = useStore();
  const [f, setF] = useState(EMPTY);
  const [layout, setLayout] = useState('grid');
  const all = store.liveOffers();
  const agencies = store.liveAgencies();

  // read filters from the URL (#/offers?cat=beach&dest=sharm&max=20000)
  const qs = query.toString();
  useEffect(() => {
    setF({
      ...EMPTY,
      cats: query.get('cat') ? [query.get('cat')] : [],
      dest: query.get('dest') || 'all',
      from: query.get('from') || 'all',
      max: query.get('max') || '',
    });
  }, [qs]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const dests = Object.keys(DESTS).filter((k) => all.some((o) => o.dest === k));

  const list = useMemo(() => {
    const q = f.q.trim().toLowerCase(), min = +f.min || 0, max = +f.max || Infinity;
    const r = all.filter((o) => {
      const a = store.agency(o.agencyId);
      if (f.cats.length && !f.cats.includes(o.category)) return false;
      if (f.dest !== 'all' && o.dest !== f.dest) return false;
      if (f.from !== 'all' && o.from !== f.from) return false;
      if (o.price < min || o.price > max) return false;
      if ((f.nights === 's' && o.nights > 3) || (f.nights === 'm' && (o.nights < 4 || o.nights > 7)) || (f.nights === 'l' && o.nights < 8)) return false;
      if (f.verified && !a?.verified) return false;
      if (q && !`${o.title.ar} ${o.title.en} ${DESTS[o.dest]?.ar} ${DESTS[o.dest]?.en} ${a?.name?.ar} ${a?.name?.en}`.toLowerCase().includes(q)) return false;
      return true;
    });
    const by = {
      featured: (a, b) => b.featured - a.featured || a.price - b.price,
      priceAsc: (a, b) => a.price - b.price,
      priceDesc: (a, b) => b.price - a.price,
      night: (a, b) => a.price / a.nights - b.price / b.nights,
      discount: (a, b) => discount(b) - discount(a),
      soon: (a, b) => String(a.date).localeCompare(b.date),
      rating: (a, b) => (store.agency(b.agencyId)?.rating || 0) - (store.agency(a.agencyId)?.rating || 0),
    };
    return r.sort(by[f.sort] || by.featured);
  }, [all, f, store]);

  const headPhoto = f.dest !== 'all' ? `px:${DESTS[f.dest].photos[0]}` : f.cats.length === 1 ? CATS[f.cats[0]].photo : 'px:18886592';
  const headTitle = f.dest !== 'all' ? L(DESTS[f.dest]) : f.cats.length === 1 ? L(CATS[f.cats[0]]) : T('كل العروض', 'All offers');

  return (
    <>
      <PageHeader title={headTitle} sub={T(`${all.length} عرض من ${agencies.length} شركة`, `${all.length} offers from ${agencies.length} agencies`)} crumb={T('العروض', 'Offers')} photo={headPhoto} />
      <div className="wrap layout">
        <aside className="filters">
          <input className="inp" placeholder={T('ابحث بالاسم أو الوجهة...', 'Search name or destination...')} value={f.q} onChange={(e) => set('q', e.target.value)} />
          <div>
            <h4>{T('نوع الرحلة', 'Trip type')}</h4>
            <div className="checks">
              {Object.entries(CATS).map(([k, c]) => (
                <label key={k}>
                  <input type="checkbox" checked={f.cats.includes(k)} onChange={(e) => set('cats', e.target.checked ? [...f.cats, k] : f.cats.filter((x) => x !== k))} />
                  {L(c)}<span className="c">{all.filter((o) => o.category === k).length}</span>
                </label>
              ))}
            </div>
          </div>
          <div><h4>{T('الوجهة', 'Destination')}</h4>
            <Select value={f.dest} onChange={(v) => set('dest', v)} ariaLabel={T('الوجهة', 'Destination')} options={[{ value: 'all', label: T('كل الوجهات', 'All destinations') }, ...dests.map((k) => ({ value: k, label: L(DESTS[k]) }))]} /></div>
          <div><h4>{T('السفر من', 'Departing from')}</h4>
            <Select value={f.from} onChange={(v) => set('from', v)} ariaLabel={T('السفر من', 'Departing from')} options={[{ value: 'all', label: T('أي مدينة', 'Any city') }, ...Object.keys(CITIES).map((k) => ({ value: k, label: L(CITIES[k]) }))]} /></div>
          <div><h4>{T('السعر للفرد (ج.م)', 'Price per person (EGP)')}</h4>
            <div className="row2"><input className="inp" type="number" placeholder={T('من', 'Min')} value={f.min} onChange={(e) => set('min', e.target.value)} /><input className="inp" type="number" placeholder={T('لحد', 'Max')} value={f.max} onChange={(e) => set('max', e.target.value)} /></div></div>
          <div><h4>{T('المدة', 'Duration')}</h4>
            <Select value={f.nights} onChange={(v) => set('nights', v)} ariaLabel={T('المدة', 'Duration')} options={[
              { value: 'all', label: T('أي مدة', 'Any') }, { value: 's', label: T('3 ليالي أو أقل', '3 nights or less') }, { value: 'm', label: T('4 - 7 ليالي', '4–7 nights') }, { value: 'l', label: T('أكتر من 7', '8+ nights') },
            ]} /></div>
          <label className="toggle"><input type="checkbox" checked={f.verified} onChange={(e) => set('verified', e.target.checked)} /><i />{T('شركات موثّقة بس', 'Verified agencies only')}</label>
          <button className="btn btn-ghost btn-sm" onClick={() => setF(EMPTY)}><Icon name="reset" />{T('امسح الفلاتر', 'Clear filters')}</button>
        </aside>
        <div>
          <div className="toolbar">
            <b>{T(`${list.length} عرض`, `${list.length} offers`)}</b>
            <div className="row-start">
              <Select className="auto" value={f.sort} onChange={(v) => set('sort', v)} ariaLabel={T('الترتيب', 'Sort')} options={[
                { value: 'featured', label: T('المميز أولاً', 'Featured first') },
                { value: 'priceAsc', label: T('الأرخص', 'Lowest price') },
                { value: 'priceDesc', label: T('الأغلى', 'Highest price') },
                { value: 'night', label: T('أرخص سعر لليلة', 'Lowest per night') },
                { value: 'discount', label: T('أكبر خصم', 'Biggest discount') },
                { value: 'soon', label: T('الأقرب موعداً', 'Soonest') },
                { value: 'rating', label: T('تقييم الشركة', 'Agency rating') },
              ]} />
              <div className="seg">
                <button className={layout === 'grid' ? 'on' : ''} onClick={() => setLayout('grid')} title="Grid"><Icon name="grid" /></button>
                <button className={layout === 'list' ? 'on' : ''} onClick={() => setLayout('list')} title="List"><Icon name="list" /></button>
              </div>
            </div>
          </div>
          {list.length ? (
            <div className={`grid-offers ${layout === 'list' ? 'one' : ''}`}>{list.map((o, i) => <OfferCard key={o.id} offer={o} i={i} list={layout === 'list'} />)}</div>
          ) : (
            <div className="empty"><Icon name="search" size={30} />{T('مفيش عروض بالفلاتر دي، جرّب توسّع البحث', 'No offers match these filters — try widening your search')}</div>
          )}
        </div>
      </div>
    </>
  );
}
