import Icon from '../../components/Icon';
import { Photo, Counter } from '../../components/Media';
import { Avatar } from '../../components/Cards';
import { useLang } from '../../lib/i18n';
import { useStore } from '../../store/store';
import { useUI } from '../../components/UI';
import { navigate } from '../../lib/router';
import { CATS, DESTS, STATUS } from '../../data/catalog';
import { ago, fdate, fmt, shortDate } from '../../lib/format';
import { OfferForm } from './forms';

export function Kpi({ label, value, sub, icon, color }) {
  return (
    <div className="kpi">
      <div className="ic" style={{ background: `${color}1f`, color }}><Icon name={icon} /></div>
      <div className="l">{label}</div>
      <div className="v">{typeof value === 'number' ? <Counter to={value} /> : value}</div>
      <div className="s">{sub}</div>
    </div>
  );
}

export function SideNav({ who, tabs, tab, setTab }) {
  const { T } = useLang();
  const store = useStore();
  return (
    <aside className="side">
      <div className="who">{who}</div>
      <nav>
        {tabs.map(([k, n, ic, cnt]) => (
          <button key={k} className={tab === k ? 'on' : ''} onClick={() => { setTab(k); window.scrollTo({ top: 0 }); }}>
            <Icon name={ic} />{n}{cnt ? <span className="cnt">{cnt}</span> : null}
          </button>
        ))}
        <hr />
        <button onClick={() => navigate('home')}><Icon name="home" />{T('الموقع', 'Website')}</button>
        <button onClick={() => { store.logout(); navigate('home'); }}><Icon name="out" />{T('خروج', 'Sign out')}</button>
      </nav>
    </aside>
  );
}

export function last30(list, lang) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const days = Array(30).fill(0), labels = [];
  for (let i = 29; i >= 0; i--) labels.push(shortDate(today.getTime() - i * 864e5, lang));
  list.forEach((q) => { const i = 29 - Math.floor((today.getTime() + 864e5 - q.createdAt) / 864e5); if (i >= 0 && i < 30) days[i]++; });
  return { days, labels };
}

export const countStatus = (l) => ({ new: l.filter((q) => q.status === 'new').length, contacted: l.filter((q) => q.status === 'contacted').length, closed: l.filter((q) => q.status === 'closed').length });

export function StatusTabs({ value, onChange }) {
  const { T, L } = useLang();
  return (
    <div className="tabs">
      {[['all', T('الكل', 'All')], ...Object.entries(STATUS).map(([k, v]) => [k, L(v)])].map(([k, n]) => (
        <button key={k} className={value === k ? 'on' : ''} onClick={() => onChange(k)}>{n}</button>
      ))}
    </div>
  );
}

export function OffersTable({ list, admin }) {
  const { T, L, lang } = useLang();
  const store = useStore();
  const { open, toast, confirm } = useUI();
  const mine = store.currentAgency();
  if (!list.length) return <div className="empty"><Icon name="tag" size={30} />{T('مفيش عروض. اضغط "عرض جديد" وضيف أول عرض.', 'No offers yet. Click "New offer" to add one.')}</div>;
  const leads = (id) => store.list('inquiries').filter((q) => q.offerId === id).length;
  const del = async (o) => {
    if (mine && o.agencyId !== mine.id) return;
    if (await confirm(T(`هتمسح "${L(o.title)}" نهائي.`, `Delete "${L(o.title)}" permanently?`), T('امسح', 'Delete'))) { store.remove('offers', o.id); toast(T('العرض اتمسح', 'Offer deleted')); }
  };
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead><tr>
          <th>{T('العرض', 'Offer')}</th>{admin && <th>{T('الشركة', 'Agency')}</th>}<th>{T('السعر', 'Price')}</th><th>{T('الأماكن', 'Seats')}</th><th>{T('الميعاد', 'Date')}</th><th>{T('مشاهدات', 'Views')}</th><th>{T('طلبات', 'Leads')}</th>{admin && <th>{T('مميز', 'Featured')}</th>}<th>{T('ظاهر', 'Live')}</th><th />
        </tr></thead>
        <tbody>
          {list.map((o) => {
            const a = store.agency(o.agencyId) || {};
            return (
              <tr key={o.id}>
                <td><div className="cell"><div className="thumb"><Photo src={o.img} w={200} /></div><div><b className="fw5">{L(o.title)}</b><div className="dim xs">{L(CATS[o.category])} · {L(DESTS[o.dest])} · {o.nights} {T('ليالي', 'n')}</div></div></div></td>
                {admin && <td><span className="chip-ag"><Avatar agency={a} /><span className="nm">{L(a.name) || '—'}</span></span></td>}
                <td><b className="accent">{fmt(o.price)}</b>{o.oldPrice ? <div className="dim xs strike">{fmt(o.oldPrice)}</div> : null}</td>
                <td className={o.seats <= 5 ? 'warm fw6' : ''}>{o.seats}</td>
                <td className="nowrap">{fdate(o.date, lang)}</td>
                <td>{fmt(o.views || 0)}</td>
                <td>{leads(o.id)}</td>
                {admin && <td><Toggle checked={!!o.featured} onChange={(v) => { store.update('offers', o.id, { featured: v }); toast(v ? T('اتميّز', 'Featured') : T('اتشال من المميز', 'Unfeatured')); }} /></td>}
                <td><Toggle checked={o.active !== false} onChange={(v) => { store.update('offers', o.id, { active: v }); toast(v ? T('العرض ظاهر', 'Offer is live') : T('العرض اتخفى', 'Offer hidden')); }} /></td>
                <td className="nowrap">
                  <button className="btn btn-ghost btn-xs" title={T('تعديل', 'Edit')} onClick={() => open(() => <OfferForm offer={o} />, { size: 'lg' })}><Icon name="edit" size={16} /></button>{' '}
                  <button className="btn btn-danger btn-xs" title={T('مسح', 'Delete')} onClick={() => del(o)}><Icon name="trash" size={16} /></button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function InquiriesTable({ list, admin }) {
  const { T, L, lang } = useLang();
  const store = useStore();
  const { toast, confirm } = useUI();
  if (!list.length) return <div className="empty"><Icon name="inbox" size={30} />{T('مفيش طلبات', 'No requests')}</div>;
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead><tr>
          <th>{T('العميل', 'Customer')}</th><th>{T('الموبايل', 'Mobile')}</th><th>{T('العرض', 'Offer')}</th>{admin && <th>{T('الشركة', 'Agency')}</th>}<th>{T('أفراد', 'Pax')}</th><th>{T('القيمة', 'Value')}</th><th>{T('وصل', 'Received')}</th><th>{T('الحالة', 'Status')}</th>{admin && <th />}
        </tr></thead>
        <tbody>
          {[...list].sort((a, b) => b.createdAt - a.createdAt).map((q) => {
            const o = store.get('offers', q.offerId), a = store.agency(q.agencyId) || {};
            return (
              <tr key={q.id}>
                <td><b className="fw5">{q.name}</b>{q.note && <div className="dim xs">{q.note}</div>}</td>
                <td className="ltr start">{q.phone}</td>
                <td className="maxw">{o ? L(o.title) : T('عرض محذوف', 'Deleted offer')}</td>
                {admin && <td>{L(a.name) || '—'}</td>}
                <td>{q.people}</td>
                <td className="nowrap">{o ? fmt(o.price * q.people) : '—'}</td>
                <td className="dim nowrap">{ago(q.createdAt, lang)}</td>
                <td>
                  <select className={`sel status st-${q.status}`} value={q.status} onChange={(e) => { store.update('inquiries', q.id, { status: e.target.value }); toast(T('الحالة اتغيّرت', 'Status updated')); }}>
                    {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{L(v)}</option>)}
                  </select>
                </td>
                {admin && <td><button className="btn btn-danger btn-xs" onClick={async () => { if (await confirm(T('هتمسح الطلب ده نهائي.', 'Delete this request permanently?'), T('امسح', 'Delete'))) store.remove('inquiries', q.id); }}><Icon name="trash" size={16} /></button></td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <label className="toggle" onClick={(e) => e.stopPropagation()}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} /><i />{label}
    </label>
  );
}
