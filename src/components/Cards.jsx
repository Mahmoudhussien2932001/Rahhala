import Icon from './Icon';
import { Photo, Reveal } from './Media';
import { useLang } from '../lib/i18n';
import { useStore } from '../store/store';
import { useUI } from './UI';
import { CATS, CITIES, DESTS } from '../data/catalog';
import { daysTo, discount, fdate, fmt } from '../lib/format';
import { OfferModal, AgencyModal, DestModal } from './Modals';
import { fromMonthly } from '../data/pricing';
import { FavButton } from './Alerts';

export const stars = (n) => '★'.repeat(Math.round(n || 0)) + '☆'.repeat(5 - Math.round(n || 0));

export function Avatar({ agency, size = '' }) {
  const { L } = useLang();
  return <span className={`av ${size}`} style={{ background: agency?.color || '#999' }}>{(L(agency?.name) || '?').trim()[0]}</span>;
}

export function Verified() {
  const { T } = useLang();
  return <span className="verified" title={T('موثّقة', 'Verified')}><Icon name="shield" size={16} /></span>;
}

export function CompareButton({ id, variant = 'chip' }) {
  const { T } = useLang();
  const store = useStore();
  const { toast } = useUI();
  const on = store.compare.includes(id);
  const click = (e) => {
    e.stopPropagation();
    if (!store.toggleCompare(id)) toast(T('تقدر تقارن 3 عروض بس', 'You can compare up to 3 offers'), 'err');
  };
  if (variant === 'chip') return <button className={`cmpbtn ${on ? 'on' : ''}`} onClick={click}><Icon name="scale" size={14} />{on ? T('في المقارنة', 'Comparing') : T('قارن', 'Compare')}</button>;
  return <button className={`btn btn-sm ${on ? 'btn-teal' : 'btn-ghost'}`} style={{ width: '100%' }} onClick={click}><Icon name="scale" />{on ? T('في المقارنة', 'In comparison') : T('ضيفه للمقارنة', 'Add to compare')}</button>;
}

export function OfferCard({ offer: o, i = 0, list = false }) {
  const { T, L, lang } = useLang();
  const store = useStore();
  const { open } = useUI();
  const a = store.agency(o.agencyId) || {};
  const d = discount(o), left = daysTo(o.date);
  const inst = fromMonthly(o);
  return (
    <Reveal as="article" delay={(i % 4) * 70} className={`ocard ${list ? 'list' : ''}`} onClick={() => open(() => <OfferModal id={o.id} />, { size: 'lg' })}>
      <div className="ph">
        <Photo src={o.img} w={900} />
        <div className="tags">
          <span className="badge" style={{ color: CATS[o.category]?.color }}>{L(CATS[o.category])}</span>
          {d ? <span className="badge hot">-{d}%</span> : o.featured ? <span className="badge hot">{T('مميز', 'Featured')}</span> : null}
        </div>
        <CompareButton id={o.id} />
        <FavButton id={o.id} />
      </div>
      <div className="body">
        <h4><a href={`#/offer/${o.id}`} onClick={(e) => e.stopPropagation()}>{L(o.title)}</a></h4>
        <div className="meta">
          <span><Icon name="pin" size={15} />{L(DESTS[o.dest])}</span>
          <span><Icon name="moon" size={15} />{o.nights} {T('ليالي', 'nights')}</span>
          <span><Icon name="cal" size={15} />{fdate(o.date, lang)}</span>
        </div>
        {o.seats <= 6 ? (
          <div className="urgent">
            <span><Icon name="fire" size={15} />{T(`باقي ${o.seats} أماكن بس`, `Only ${o.seats} spots left`)}</span>
            <div className="seatbar"><i style={{ width: `${Math.max(10, 100 - o.seats * 14)}%` }} /></div>
          </div>
        ) : left >= 0 && left <= 10 ? (
          <div className="soon"><Icon name="clock" size={15} />{T(`السفر بعد ${left} يوم`, `Departs in ${left} days`)}</div>
        ) : null}
        <div className="foot">
          <div className="price">
            <small>{T('للفرد من', 'From / person')}</small>
            <div><b>{fmt(o.price)}</b> <small>{T('ج.م', 'EGP')}</small>{o.oldPrice ? <s>{fmt(o.oldPrice)}</s> : null}</div>
            <small className="per-month" title={T('تقسيط تقديري', 'Estimated installment')}>{T('أو من', 'or from')} {fmt(inst.amount)} / {T('شهر', 'mo')}*</small>
          </div>
          <span className="chip-ag"><Avatar agency={a} /><span className="nm">{L(a.name)}</span>{a.verified && <Verified />}</span>
        </div>
      </div>
    </Reveal>
  );
}

export function AgencyCard({ agency: a, i = 0 }) {
  const { T, L } = useLang();
  const store = useStore();
  const { open } = useUI();
  const n = store.liveOffers().filter((o) => o.agencyId === a.id).length;
  return (
    <Reveal className="agcard" delay={(i % 4) * 70} style={{ '--c': a.color }} onClick={() => open(() => <AgencyModal id={a.id} />, { size: 'lg' })}>
      <div className="top">
        <Avatar agency={a} size="lg" />
        <div><h3><a href={`#/agency/${a.id}`} onClick={(e) => e.stopPropagation()}>{L(a.name)}</a> {a.verified && <Verified />}</h3><span className="dim small">{L(a.tagline)}</span></div>
      </div>
      <div className="kv">
        <span><span className="stars">{stars(a.rating)}</span> {a.rating} ({fmt(a.reviews)})</span>
        <span><Icon name="pin" size={15} />{L(CITIES[a.city])}</span>
        <span><Icon name="tag" size={15} />{n} {T('عرض', 'offers')}</span>
      </div>
    </Reveal>
  );
}

export function DestCard({ id, big = false, i = 0 }) {
  const { T, L } = useLang();
  const store = useStore();
  const { open } = useUI();
  const d = DESTS[id];
  const list = store.liveOffers().filter((o) => o.dest === id);
  const min = list.length ? Math.min(...list.map((o) => o.price)) : 0;
  const inSeason = d.best.includes(new Date().getMonth() + 1);
  return (
    <Reveal variant="zoom" delay={i * 60} className={`dest ${big ? 'big' : ''}`} onClick={() => open(() => <DestModal id={id} />, { size: 'lg' })}>
      <Photo src={`px:${d.photos[0]}`} w={big ? 1400 : 800} />
      <div className="ov" />
      {inSeason && <span className="tag">☀ {T('موسمها دلوقتي', 'In season now')}</span>}
      <div className="tx">
        <div><h3><a href={`#/destination/${id}`} onClick={(e) => e.stopPropagation()}>{L(d)}</a></h3><span className="sub">{L(d.country)} · {list.length} {T('عرض', 'offers')}</span></div>
        {list.length > 0 && <div className="from">{T('تبدأ من', 'from')}<b>{fmt(min)}</b></div>}
      </div>
    </Reveal>
  );
}
