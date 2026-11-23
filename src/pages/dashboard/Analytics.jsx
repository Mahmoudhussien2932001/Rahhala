import Icon from '../../components/Icon';
import { Photo } from '../../components/Media';
import { useLang } from '../../lib/i18n';
import { useStore } from '../../store/store';
import { navigate } from '../../lib/router';
import { fmt } from '../../lib/format';
import { isExpired, responseStats } from '../../lib/offers';
import { PLANS, planKey, planOf, liveCountOf } from '../../data/plans';

/* Plan summary card for the agency overview. */
export function PlanCard({ agency }) {
  const { T, L } = useLang();
  const store = useStore();
  const plan = planOf(agency);
  const used = liveCountOf(store.list('offers'), agency.id, isExpired);
  const max = plan.maxLive;
  const pct = max === Infinity ? 12 : Math.min(100, Math.round((used / max) * 100));
  const full = max !== Infinity && used >= max;
  return (
    <div className={`panel plan-card ${full ? 'full' : ''}`}>
      <div className="pc-top">
        <div><span className="dim small">{T('باقتك', 'Your plan')}</span><b>{L(plan.name)}</b></div>
        {planKey(agency) !== 'premium' && <button className="btn btn-sun btn-sm" onClick={() => navigate('pricing')}><Icon name="up" size={15} />{T('رقّي الباقة', 'Upgrade')}</button>}
      </div>
      <div className="pc-meter"><i style={{ width: `${pct}%` }} /></div>
      <div className="pc-foot">
        <span>{max === Infinity ? T(`${used} عرض ظاهر — بلا حدود`, `${used} live offers — unlimited`) : T(`${used} من ${max} عروض ظاهرة`, `${used} of ${max} live offers`)}</span>
        {full && <span className="warm fw6">{T('وصلت للحد', 'Limit reached')}</span>}
      </div>
    </div>
  );
}

/* Agency analytics: funnel, conversion, price vs market. Pro and Premium only. */
export function AgencyAnalytics({ agency }) {
  const { T, L } = useLang();
  const store = useStore();
  const plan = planOf(agency);

  if (!plan.analytics) {
    return (
      <div className="panel locked">
        <Icon name="lock" size={30} />
        <h3>{T('الإحصائيات الكاملة في باقة برو وبريميوم', 'Full analytics are on Pro and Premium')}</h3>
        <p className="muted">{T('اعرف عروضك بتتحول لحجوزات قد إيه، وسعرك مقارنة بالسوق لنفس الوجهة.', 'See how your offers turn into bookings, and how your prices compare with the market for the same destination.')}</p>
        <button className="btn btn-sun" onClick={() => navigate('pricing')}>{T('شوف الباقات', 'See plans')}</button>
      </div>
    );
  }

  const offers = store.list('offers').filter((o) => o.agencyId === agency.id);
  const inqs = store.list('inquiries').filter((q) => q.agencyId === agency.id);
  const views = offers.reduce((s, o) => s + (o.views || 0), 0);
  const reqs = inqs.length;
  const booked = inqs.filter((q) => q.status === 'closed').length;
  const pct = (a, b) => (b ? Math.round((a / b) * 1000) / 10 : 0);
  const stages = [
    [T('مشاهدات', 'Views'), views, 'eye'],
    [T('طلبات حجز', 'Requests'), reqs, 'inbox'],
    [T('اتحجزت', 'Booked'), booked, 'check'],
  ];
  const max = Math.max(1, views);
  const rt = responseStats(store.list('inquiries'), agency.id);

  // price vs market: same destination + category, other agencies' live offers
  const live = store.liveOffers();
  const rows = offers.filter((o) => !isExpired(o)).map((o) => {
    const peers = live.filter((x) => x.agencyId !== agency.id && x.dest === o.dest && x.category === o.category);
    const perNight = (x) => x.price / Math.max(1, x.nights);
    const avg = peers.length ? peers.reduce((s, x) => s + perNight(x), 0) / peers.length : null;
    const diff = avg ? Math.round(((perNight(o) - avg) / avg) * 100) : null;
    const leads = inqs.filter((q) => q.offerId === o.id).length;
    return { o, peers: peers.length, avg, diff, leads };
  });

  return (
    <>
      <div className="panel">
        <h3>{T('رحلة العميل', 'Conversion funnel')}<small>{T('كل عروضك', 'All your offers')}</small></h3>
        <div className="funnel">
          {stages.map(([label, v, ic], i) => (
            <div key={label} className="fn-row">
              <span className="fn-l"><Icon name={ic} size={16} />{label}</span>
              <div className="fn-bar"><i style={{ width: `${Math.max(3, (v / max) * 100)}%` }} /><b>{fmt(v)}</b></div>
              {i > 0 && <span className="fn-rate">{pct(v, stages[i - 1][1])}%</span>}
            </div>
          ))}
        </div>
        <div className="fn-kpis">
          <div><b>{pct(reqs, views)}%</b><span>{T('من المشاهدات لطلبات', 'views → requests')}</span></div>
          <div><b>{pct(booked, reqs)}%</b><span>{T('من الطلبات لحجوزات', 'requests → booked')}</span></div>
          <div><b>{rt.hours === null ? '—' : `${Math.max(1, Math.ceil(rt.hours))}${T(' س', 'h')}`}</b><span>{T('متوسط وقت الرد', 'median reply time')}</span></div>
        </div>
      </div>

      <div className="panel">
        <h3>{T('سعرك مقارنة بالسوق', 'Your price vs the market')}<small>{T('سعر الليلة مقارنة بمتوسط الشركات التانية لنفس الوجهة ونوع الرحلة', 'Per-night price vs other agencies, same destination & trip type')}</small></h3>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead><tr><th>{T('العرض', 'Offer')}</th><th>{T('سعر الليلة', 'Per night')}</th><th>{T('متوسط السوق', 'Market avg')}</th><th>{T('الفرق', 'Difference')}</th><th>{T('طلبات', 'Requests')}</th></tr></thead>
            <tbody>
              {rows.map(({ o, peers, avg, diff, leads }) => (
                <tr key={o.id}>
                  <td><div className="cell"><div className="thumb"><Photo src={o.img} w={200} /></div><b className="fw5">{L(o.title)}</b></div></td>
                  <td className="nowrap">{fmt(Math.round(o.price / Math.max(1, o.nights)))}</td>
                  <td className="nowrap">{avg ? <>{fmt(Math.round(avg))}<div className="dim xs">{peers} {T('عرض', 'offers')}</div></> : <span className="dim">{T('مفيش عروض مشابهة', 'No comparable offers')}</span>}</td>
                  <td>{diff === null ? '—' : <span className={`mkt ${diff > 10 ? 'high' : diff < -10 ? 'low' : 'mid'}`}>{diff > 0 ? '+' : ''}{diff}%</span>}</td>
                  <td>{leads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="dim xs mt8">{T('أخضر = أرخص من السوق بأكتر من 10%، أحمر = أغلى بأكتر من 10%.', 'Green = more than 10% below market, red = more than 10% above.')}</p>
      </div>
    </>
  );
}

export const planLimitMessage = (T, plan) =>
  T(`باقتك (${plan.name.ar}) بتسمح بـ ${plan.maxLive} عروض ظاهرة بس. اخفي عرض تاني أو رقّي الباقة.`, `Your ${plan.name.en} plan allows ${plan.maxLive} live offers. Hide another offer or upgrade your plan.`);

export { PLANS };
