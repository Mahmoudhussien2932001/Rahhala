import { useEffect, useState } from 'react';
import Icon, { Logo } from '../../components/Icon';
import { Avatar } from '../../components/Cards';
import { Bars, LineChart, StatusStack } from '../../components/Charts';
import { useUI } from '../../components/UI';
import { useLang } from '../../lib/i18n';
import { useStore } from '../../store/store';
import { navigate } from '../../lib/router';
import { CATS, CITIES, DESTS } from '../../data/catalog';
import { fmt } from '../../lib/format';
import { InquiriesTable, Kpi, OffersTable, SideNav, StatusTabs, Toggle, countStatus, last30 } from './parts';
import { AgencyForm, OfferForm, PasswordForm } from './forms';

export default function AdminDashboard() {
  const { T, L, lang } = useLang();
  const store = useStore();
  const { open, toast, confirm } = useUI();
  const [tab, setTab] = useState('overview');
  const [status, setStatus] = useState('all');
  const [agFilter, setAgFilter] = useState('all');
  const [q, setQ] = useState('');
  const admin = store.isAdmin();

  useEffect(() => { if (!admin) navigate('login'); }, [admin]);
  if (!admin) return null;

  const A = store.list('agencies'), O = store.list('offers'), Q = store.list('inquiries');
  const st = countStatus(Q);
  const tabs = [
    ['overview', T('نظرة عامة', 'Overview'), 'chart'],
    ['agencies', T('الشركات', 'Agencies'), 'bld'],
    ['offers', T('كل العروض', 'All offers'), 'tag'],
    ['inquiries', T('كل الطلبات', 'All requests'), 'inbox', st.new],
    ['settings', T('الإعدادات', 'Settings'), 'gear'],
  ];
  const who = <><span className="av lg plain"><Logo size={42} /></span><div><b>{T('لوحة الأدمن', 'Admin')}</b><span className="ltr xs">{store.get('accounts', 'admin')?.email}</span></div></>;
  const newAgency = () => open(() => <AgencyForm />, { size: 'lg' });
  const newOffer = () => open(() => <OfferForm />, { size: 'lg' });

  let body;
  if (tab === 'overview') {
    const live = O.filter((o) => o.active !== false);
    const { days, labels } = last30(Q, lang);
    const value = Q.filter((x) => x.status === 'closed').reduce((s, x) => s + (x.breakdown?.total ?? (store.get('offers', x.offerId)?.price || 0) * x.people), 0);
    const byCat = Object.keys(CATS).map((k) => [L(CATS[k]), Q.filter((x) => store.get('offers', x.offerId)?.category === k).length]);
    const byAg = A.map((a) => [L(a.name), Q.filter((x) => x.agencyId === a.id).length]).sort((x, y) => y[1] - x[1]).slice(0, 8);
    const byDest = Object.keys(DESTS).map((k) => [L(DESTS[k]), Q.filter((x) => store.get('offers', x.offerId)?.dest === k).length]).filter((r) => r[1]).sort((x, y) => y[1] - x[1]).slice(0, 6);
    const week = Q.filter((x) => Date.now() - x.createdAt < 7 * 864e5).length;
    const prev = Q.filter((x) => { const d = Date.now() - x.createdAt; return d >= 7 * 864e5 && d < 14 * 864e5; }).length;
    const trend = prev ? Math.round(((week - prev) / prev) * 100) : 0;
    body = (
      <>
        <div className="dhead">
          <div><div className="eyebrow">{T('كل حاجة على المنصة', 'Everything on the platform')}</div><h2>{T('نظرة عامة', 'Overview')}</h2></div>
          <div className="row-start"><button className="btn btn-ghost" onClick={newOffer}><Icon name="plus" />{T('عرض', 'Offer')}</button><button className="btn btn-sun" onClick={newAgency}><Icon name="plus" />{T('شركة جديدة', 'New agency')}</button></div>
        </div>
        <div className="kpis">
          <Kpi label={T('الشركات', 'Agencies')} value={A.length} sub={T(`${A.filter((a) => a.verified).length} موثّقة · ${A.filter((a) => a.active === false).length} موقوفة`, `${A.filter((a) => a.verified).length} verified · ${A.filter((a) => a.active === false).length} suspended`)} icon="bld" color="#3A69AD" />
          <Kpi label={T('العروض الظاهرة', 'Live offers')} value={live.length} sub={T(`من ${O.length} عرض`, `of ${O.length}`)} icon="tag" color="#14A79D" />
          <Kpi label={T('طلبات الأسبوع', 'Requests this week')} value={week} sub={`${trend >= 0 ? '▲' : '▼'} ${Math.abs(trend)}% ${T('عن الأسبوع اللي فات', 'vs last week')}`} icon="inbox" color="#E8693A" />
          <Kpi label={T('قيمة الحجوزات', 'Booked value')} value={`${fmt(Math.round(value / 1000))}K`} sub={T('ج.م · طلبات اتحجزت', 'EGP · booked requests')} icon="money" color="#1E9E6A" />
        </div>
        <div className="two">
          <div className="panel"><h3>{T('الطلبات آخر 30 يوم', 'Requests — last 30 days')}<small>{Q.length} {T('إجمالي', 'total')}</small></h3><LineChart values={days} labels={labels} unit={T(' طلب', ' requests')} /></div>
          <div className="panel"><h3>{T('حالة الطلبات', 'Request status')}</h3><StatusStack counts={st} />
            <h3 className="mt22">{T('أكتر الوجهات طلباً', 'Most requested destinations')}</h3><Bars rows={byDest} unit={T(' طلب', ' requests')} /></div>
        </div>
        <div className="two eq">
          <div className="panel"><h3>{T('الطلبات حسب الشركة', 'Requests by agency')}</h3><Bars rows={byAg} unit={T(' طلب', ' requests')} /></div>
          <div className="panel"><h3>{T('الطلبات حسب نوع الرحلة', 'Requests by trip type')}</h3><Bars rows={byCat} unit={T(' طلب', ' requests')} /></div>
        </div>
        <div className="panel"><h3>{T('آخر الطلبات', 'Latest requests')}<button className="btn btn-ghost btn-xs" onClick={() => setTab('inquiries')}>{T('الكل', 'All')}</button></h3>
          <InquiriesTable list={[...Q].sort((x, y) => y.createdAt - x.createdAt).slice(0, 6)} admin /></div>
      </>
    );
  } else if (tab === 'agencies') {
    const list = A.filter((a) => !q || `${a.name.ar} ${a.name.en}`.toLowerCase().includes(q.toLowerCase())).sort((x, y) => (x.createdAt || 0) - (y.createdAt || 0));
    const del = async (a) => {
      const n = O.filter((o) => o.agencyId === a.id).length;
      if (await confirm(T(`هتمسح "${L(a.name)}" وحسابها و${n} عرض والطلبات بتاعتها نهائي.`, `Delete "${L(a.name)}", its login, ${n} offers and its requests permanently?`), T('امسح الشركة', 'Delete agency'))) {
        store.removeAgency(a.id); toast(T('الشركة اتمسحت', 'Agency deleted'));
      }
    };
    body = (
      <>
        <div className="dhead">
          <div><div className="eyebrow">{A.length} {T('شركة', 'agencies')}</div><h2>{T('الشركات', 'Agencies')}</h2></div>
          <div className="row-start"><input className="inp auto" placeholder={T('ابحث...', 'Search...')} value={q} onChange={(e) => setQ(e.target.value)} /><button className="btn btn-sun" onClick={newAgency}><Icon name="plus" />{T('شركة جديدة', 'New agency')}</button></div>
        </div>
        <div className="panel">
          {list.length ? (
            <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr><th>{T('الشركة', 'Agency')}</th><th>{T('إيميل الدخول', 'Login email')}</th><th>{T('المدينة', 'City')}</th><th>{T('عروض', 'Offers')}</th><th>{T('طلبات', 'Leads')}</th><th>{T('التقييم', 'Rating')}</th><th>{T('موثّقة', 'Verified')}</th><th>{T('شغالة', 'Active')}</th><th /></tr></thead>
                <tbody>
                  {list.map((a) => (
                    <tr key={a.id}>
                      <td><div className="cell"><Avatar agency={a} /><div><b className="fw5">{L(a.name)}</b><div className="dim xs">{T('ترخيص', 'License')} {a.license || '-'}</div></div></div></td>
                      <td className="ltr start xs">{store.get('accounts', a.id)?.email || '—'}</td>
                      <td>{L(CITIES[a.city])}</td>
                      <td>{O.filter((o) => o.agencyId === a.id).length}</td>
                      <td>{Q.filter((x) => x.agencyId === a.id).length}</td>
                      <td>★ {a.rating}</td>
                      <td><Toggle checked={!!a.verified} onChange={(v) => { store.update('agencies', a.id, { verified: v }); toast(T('اتحفظ', 'Saved')); }} /></td>
                      <td><Toggle checked={a.active !== false} onChange={(v) => { store.update('agencies', a.id, { active: v }); toast(v ? T('الشركة اتفعّلت', 'Agency activated') : T('الشركة اتوقفت', 'Agency suspended')); }} /></td>
                      <td className="nowrap">
                        <button className="btn btn-ghost btn-xs" title={T('افتح لوحتها', 'Open dashboard')} onClick={() => { store.setSession({ role: 'agency', agencyId: a.id, asAdmin: true }); navigate('dashboard'); }}><Icon name="eye" size={16} /></button>{' '}
                        <button className="btn btn-ghost btn-xs" onClick={() => open(() => <AgencyForm agency={a} />, { size: 'lg' })}><Icon name="edit" size={16} /></button>{' '}
                        <button className="btn btn-danger btn-xs" onClick={() => del(a)}><Icon name="trash" size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <div className="empty">{T('مفيش شركات', 'No agencies')}</div>}
        </div>
      </>
    );
  } else if (tab === 'offers') {
    const list = O.filter((o) => agFilter === 'all' || o.agencyId === agFilter).sort((x, y) => (y.createdAt || 0) - (x.createdAt || 0));
    body = (
      <>
        <div className="dhead">
          <div><div className="eyebrow">{list.length} {T('عرض', 'offers')}</div><h2>{T('كل العروض', 'All offers')}</h2></div>
          <div className="row-start">
            <select className="sel auto" value={agFilter} onChange={(e) => setAgFilter(e.target.value)}><option value="all">{T('كل الشركات', 'All agencies')}</option>{A.map((a) => <option key={a.id} value={a.id}>{L(a.name)}</option>)}</select>
            <button className="btn btn-sun" onClick={newOffer}><Icon name="plus" />{T('عرض جديد', 'New offer')}</button>
          </div>
        </div>
        <div className="panel"><OffersTable list={list} admin /></div>
      </>
    );
  } else if (tab === 'inquiries') {
    const l = status === 'all' ? Q : Q.filter((x) => x.status === status);
    body = (
      <>
        <div className="dhead"><div><div className="eyebrow">{Q.length} {T('طلب', 'requests')} · {st.new} {T('جديد', 'new')}</div><h2>{T('كل الطلبات', 'All requests')}</h2></div><StatusTabs value={status} onChange={setStatus} /></div>
        <div className="panel"><InquiriesTable list={l} admin /></div>
      </>
    );
  } else {
    body = (
      <>
        <div className="dhead"><div><div className="eyebrow">{T('حساب الأدمن', 'Admin account')}</div><h2>{T('الإعدادات', 'Settings')}</h2></div></div>
        <div className="two eq">
          <PasswordForm accountId="admin" />
          <div className="panel">
            <h3>{T('البيانات', 'Data')}</h3>
            <p className="muted small">{T('البيانات متخزنة في المتصفح ده (localStorage). عشان تشتغل لكل المستخدمين لازم تربط الموقع بقاعدة بيانات وسيرفر — ابدأ من ملف src/store/store.jsx.', 'Data is stored in this browser (localStorage). To share it across users, connect a backend — start from src/store/store.jsx.')}</p>
            <button className="btn btn-danger mt18" onClick={async () => { if (await confirm(T('هترجّع كل البيانات للنسخة التجريبية وتمسح أي تعديل.', 'This restores the demo data and erases all changes.'), T('رجّع', 'Reset'))) { store.reset(); toast(T('البيانات رجعت', 'Data reset')); navigate('login'); } }}>
              <Icon name="reset" />{T('رجّع البيانات التجريبية', 'Reset demo data')}
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="wrap dash">
      <SideNav who={who} tabs={tabs} tab={tab} setTab={setTab} />
      <div>{body}</div>
    </div>
  );
}
