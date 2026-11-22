import { useEffect, useState } from 'react';
import Icon from '../../components/Icon';
import { Avatar } from '../../components/Cards';
import { Bars, LineChart, StatusStack } from '../../components/Charts';
import { useUI } from '../../components/UI';
import { useLang } from '../../lib/i18n';
import { useStore } from '../../store/store';
import { navigate } from '../../lib/router';
import { CITIES } from '../../data/catalog';
import { InquiriesTable, Kpi, OffersTable, SideNav, StatusTabs, countStatus, last30 } from './parts';
import { OfferForm, PasswordForm } from './forms';

export default function AgencyDashboard() {
  const { T, L, lang } = useLang();
  const store = useStore();
  const { open, toast } = useUI();
  const [tab, setTab] = useState('overview');
  const [status, setStatus] = useState('all');
  const a = store.currentAgency();

  useEffect(() => { if (!a) navigate(store.isAdmin() ? 'admin' : 'login'); }, [a]); // eslint-disable-line
  if (!a) return null;

  const offers = store.list('offers').filter((o) => o.agencyId === a.id);
  const inqs = store.list('inquiries').filter((q) => q.agencyId === a.id);
  const st = countStatus(inqs);
  const newOffer = () => open(() => <OfferForm />, { size: 'lg' });

  const tabs = [
    ['overview', T('نظرة عامة', 'Overview'), 'chart'],
    ['offers', T('عروضي', 'My offers'), 'tag'],
    ['inquiries', T('طلبات العملاء', 'Requests'), 'inbox', st.new],
    ['profile', T('بيانات الشركة', 'Company profile'), 'gear'],
  ];
  const who = <><Avatar agency={a} size="lg" /><div><b>{L(a.name)}</b><span>{a.verified ? T('شركة موثّقة ✓', 'Verified agency ✓') : T('في انتظار التوثيق', 'Pending verification')}</span></div></>;

  let body;
  if (tab === 'overview') {
    const live = offers.filter((o) => o.active !== false);
    const views = offers.reduce((s, o) => s + (o.views || 0), 0);
    const { days, labels } = last30(inqs, lang);
    const conv = inqs.length ? Math.round((st.closed / inqs.length) * 100) : 0;
    const byOffer = live.map((o) => [L(o.title), inqs.filter((q) => q.offerId === o.id).length]).sort((x, y) => y[1] - x[1]).slice(0, 6);
    body = (
      <>
        <div className="dhead"><div><div className="eyebrow">{T('أهلاً', 'Welcome')} {L(a.name)}</div><h2>{T('نظرة عامة', 'Overview')}</h2></div><button className="btn btn-sun" onClick={newOffer}><Icon name="plus" />{T('عرض جديد', 'New offer')}</button></div>
        <div className="kpis">
          <Kpi label={T('العروض الظاهرة', 'Live offers')} value={live.length} sub={T(`من ${offers.length} عرض`, `of ${offers.length}`)} icon="tag" color="#14A79D" />
          <Kpi label={T('مشاهدات العروض', 'Offer views')} value={views} sub={T('إجمالي', 'Total')} icon="eye" color="#3A69AD" />
          <Kpi label={T('طلبات جديدة', 'New requests')} value={st.new} sub={T(`من ${inqs.length} طلب`, `of ${inqs.length}`)} icon="inbox" color="#E8693A" />
          <Kpi label={T('نسبة الحجز', 'Booking rate')} value={`${conv}%`} sub={T('طلبات اتحجزت', 'requests booked')} icon="check" color="#1E9E6A" />
        </div>
        <div className="two">
          <div className="panel"><h3>{T('الطلبات آخر 30 يوم', 'Requests — last 30 days')}<small>{T('عدد الطلبات في اليوم', 'per day')}</small></h3><LineChart values={days} labels={labels} unit={T(' طلب', ' requests')} /></div>
          <div className="panel"><h3>{T('حالة الطلبات', 'Request status')}</h3><StatusStack counts={st} />
            <h3 className="mt22">{T('الطلبات لكل عرض', 'Requests per offer')}</h3>{byOffer.length ? <Bars rows={byOffer} unit={T(' طلب', ' requests')} /> : <div className="empty">—</div>}</div>
        </div>
        <div className="panel"><h3>{T('آخر الطلبات', 'Latest requests')}<button className="btn btn-ghost btn-xs" onClick={() => setTab('inquiries')}>{T('الكل', 'All')}</button></h3>
          <InquiriesTable list={[...inqs].sort((x, y) => y.createdAt - x.createdAt).slice(0, 5)} /></div>
      </>
    );
  } else if (tab === 'offers') {
    body = (
      <>
        <div className="dhead"><div><div className="eyebrow">{offers.length} {T('عرض', 'offers')}</div><h2>{T('عروضي', 'My offers')}</h2></div><button className="btn btn-sun" onClick={newOffer}><Icon name="plus" />{T('عرض جديد', 'New offer')}</button></div>
        <div className="panel"><OffersTable list={[...offers].sort((x, y) => (y.createdAt || 0) - (x.createdAt || 0))} /></div>
      </>
    );
  } else if (tab === 'inquiries') {
    const l = status === 'all' ? inqs : inqs.filter((q) => q.status === status);
    body = (
      <>
        <div className="dhead"><div><div className="eyebrow">{inqs.length} {T('طلب', 'requests')} · {st.new} {T('جديد', 'new')}</div><h2>{T('طلبات العملاء', 'Customer requests')}</h2></div><StatusTabs value={status} onChange={setStatus} /></div>
        <div className="panel"><InquiriesTable list={l} /></div>
      </>
    );
  } else {
    body = <Profile agency={a} onSaved={() => toast(T('البيانات اتحفظت', 'Profile saved'))} />;
  }

  return (
    <div className="wrap dash">
      <SideNav who={who} tabs={tabs} tab={tab} setTab={setTab} />
      <div>
        {store.session?.asAdmin && (
          <div className="demo violet mb18">{T('انت فاتح لوحة الشركة دي كأدمن.', "You are viewing this agency's dashboard as admin.")} <button onClick={() => { store.setSession({ role: 'admin' }); navigate('admin'); }}>{T('ارجع للوحة الأدمن', 'Back to admin')}</button></div>
        )}
        {body}
      </div>
    </div>
  );
}

function Profile({ agency, onSaved }) {
  const { T, L } = useLang();
  const store = useStore();
  const [a, setA] = useState(agency);
  const setL = (k, lang, v) => setA((x) => ({ ...x, [k]: { ...x[k], [lang]: v } }));
  const set = (k, v) => setA((x) => ({ ...x, [k]: v }));
  const save = (e) => {
    e.preventDefault();
    const { name, tagline, desc, phone, whatsapp, email, city, color } = a;
    store.update('agencies', agency.id, { name: { ar: name.ar.trim(), en: name.en.trim() || name.ar.trim() }, tagline, desc, phone, whatsapp: String(whatsapp).replace(/\D/g, ''), email, city, color });
    onSaved();
  };
  return (
    <>
      <div className="dhead"><div><div className="eyebrow">{T('ملف الشركة', 'Company')}</div><h2>{T('بيانات الشركة', 'Company profile')}</h2></div></div>
      <div className="two">
        <form className="panel form" onSubmit={save}>
          <h3>{T('البيانات اللي بتظهر للعملاء', 'Public details')}</h3>
          <div className="row2">
            <label>{T('الاسم بالعربي', 'Name (Arabic)')}<input className="inp" required value={a.name.ar} onChange={(e) => setL('name', 'ar', e.target.value)} /></label>
            <label>{T('الاسم بالإنجليزي', 'Name (English)')}<input className="inp ltr" value={a.name.en} onChange={(e) => setL('name', 'en', e.target.value)} /></label>
          </div>
          <div className="row2">
            <label>{T('الشعار بالعربي', 'Tagline (Arabic)')}<input className="inp" value={a.tagline?.ar || ''} onChange={(e) => setL('tagline', 'ar', e.target.value)} /></label>
            <label>{T('الشعار بالإنجليزي', 'Tagline (English)')}<input className="inp ltr" value={a.tagline?.en || ''} onChange={(e) => setL('tagline', 'en', e.target.value)} /></label>
          </div>
          <div className="row2">
            <label>{T('الموبايل', 'Phone')}<input className="inp ltr" value={a.phone} onChange={(e) => set('phone', e.target.value)} /></label>
            <label>{T('واتساب (بكود الدولة)', 'WhatsApp (with country code)')}<input className="inp ltr" value={a.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} /></label>
          </div>
          <div className="row2">
            <label>{T('إيميل التواصل', 'Contact email')}<input className="inp ltr" type="email" value={a.email} onChange={(e) => set('email', e.target.value)} /></label>
            <label>{T('المدينة', 'City')}<select className="sel" value={a.city} onChange={(e) => set('city', e.target.value)}>{Object.keys(CITIES).map((k) => <option key={k} value={k}>{L(CITIES[k])}</option>)}</select></label>
          </div>
          <label>{T('نبذة بالعربي', 'About (Arabic)')}<textarea className="inp" rows="2" value={a.desc?.ar || ''} onChange={(e) => setL('desc', 'ar', e.target.value)} /></label>
          <label>{T('نبذة بالإنجليزي', 'About (English)')}<textarea className="inp ltr" rows="2" value={a.desc?.en || ''} onChange={(e) => setL('desc', 'en', e.target.value)} /></label>
          <label>{T('لون الشركة', 'Brand color')}<input type="color" className="color" value={a.color} onChange={(e) => set('color', e.target.value)} /></label>
          <div className="dim xs">{T('الترخيص والتوثيق والتقييم بيتعدّلوا من الإدارة بس.', 'License, verification and rating are managed by the admin.')}</div>
          <button className="btn btn-primary">{T('احفظ التعديلات', 'Save changes')}</button>
        </form>
        <div><PasswordForm accountId={agency.id} /></div>
      </div>
    </>
  );
}
