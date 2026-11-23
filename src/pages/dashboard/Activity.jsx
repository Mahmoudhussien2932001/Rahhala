import { useState } from 'react';
import Icon from '../../components/Icon';
import { useLang } from '../../lib/i18n';
import { useStore } from '../../store/store';
import { fdate } from '../../lib/format';

/* Admin activity log — who did what, and when (recorded automatically by the store). */

const COL = {
  offers: { ar: 'عرض', en: 'offer' },
  agencies: { ar: 'شركة', en: 'agency' },
  inquiries: { ar: 'طلب حجز', en: 'booking request' },
  alerts: { ar: 'تنبيه', en: 'alert' },
  accounts: { ar: 'حساب دخول', en: 'login account' },
};

const FIELD = {
  price: { ar: 'السعر', en: 'price' }, oldPrice: { ar: 'السعر قبل الخصم', en: 'old price' }, active: { ar: 'الظهور', en: 'visibility' },
  featured: { ar: 'التمييز', en: 'featured' }, seats: { ar: 'الأماكن', en: 'seats' }, status: { ar: 'الحالة', en: 'status' },
  title: { ar: 'العنوان', en: 'title' }, date: { ar: 'الميعاد', en: 'date' }, verified: { ar: 'التوثيق', en: 'verification' },
  plan: { ar: 'الباقة', en: 'plan' }, name: { ar: 'الاسم', en: 'name' }, pricing: { ar: 'الأسعار', en: 'pricing' },
};

function describe(e, T, L) {
  const what = e.col ? L(COL[e.col]) || e.col : '';
  const label = e.label ? `"${L(e.label)}"` : '';
  switch (e.action) {
    case 'create': return T(`أضاف ${what} ${label}`, `added ${what} ${label}`);
    case 'update': {
      const f = (e.fields || []).slice(0, 4).map((k) => L(FIELD[k]) || k).join('، ');
      return T(`عدّل ${what} ${label}${f ? ` (${f})` : ''}`, `updated ${what} ${label}${f ? ` (${f})` : ''}`);
    }
    case 'delete': return T(`مسح ${what} ${label}`, `deleted ${what} ${label}`);
    case 'duplicate': return T(`عمل نسخة من عرض ${label}`, `duplicated offer ${label}`);
    case 'import': return T(`استورد ${e.count} عروض من CSV`, `imported ${e.count} offer(s) from CSV`);
    case 'login': return T('سجّل دخول', 'signed in');
    case 'logout': return T('سجّل خروج', 'signed out');
    case 'setting': return e.key === 'moderation'
      ? (e.value ? T('شغّل مراجعة العروض الجديدة', 'turned on new-offer moderation') : T('قفل مراجعة العروض الجديدة', 'turned off new-offer moderation'))
      : T(`غيّر الإعداد ${e.key}`, `changed setting ${e.key}`);
    case 'offer.approve': return T(`وافق على عرض ${label}`, `approved offer ${label}`);
    case 'offer.reject': return T(`رفض عرض ${label} — ${e.reason}`, `rejected offer ${label} — ${e.reason}`);
    case 'verification.submit': return T('بعت طلب توثيق', 'submitted a verification request');
    case 'verification.approve': return T(`وثّق شركة ${label}`, `verified agency ${label}`);
    case 'verification.reject': return T(`رفض توثيق ${label} — ${e.reason}`, `rejected verification for ${label} — ${e.reason}`);
    default: return e.action;
  }
}

export function ActivityLog() {
  const { T, L, lang } = useLang();
  const store = useStore();
  const [who, setWho] = useState('all');
  const all = store.activity();
  const list = all.filter((e) => who === 'all' || e.actor?.role === who).slice(0, 200);

  const actorName = (a) => {
    if (!a || a.role === 'visitor') return T('زائر', 'Visitor');
    if (a.role === 'admin') return T('الأدمن', 'Admin');
    const ag = store.agency(a.agencyId);
    return `${L(ag?.name) || a.agencyId}${a.asAdmin ? T(' (بواسطة الأدمن)', ' (via admin)') : ''}`;
  };
  const time = (t) => `${fdate(t, lang)} · ${new Date(t).toLocaleTimeString(lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <div className="panel">
      <h3>{T('سجل النشاط', 'Activity log')}
        <span className="seg seg-text al-filter">
          {[['all', T('الكل', 'All')], ['admin', T('الأدمن', 'Admin')], ['agency', T('الشركات', 'Agencies')], ['visitor', T('الزوار', 'Visitors')]].map(([k, l]) => (
            <button key={k} className={who === k ? 'on' : ''} onClick={() => setWho(k)}>{l}</button>
          ))}
        </span>
      </h3>
      {list.length ? (
        <ol className="act-list">
          {list.map((e) => (
            <li key={e.id} className={`act act-${e.actor?.role || 'visitor'}`}>
              <i><Icon name={e.actor?.role === 'admin' ? 'gear' : e.actor?.role === 'agency' ? 'bld' : 'users'} size={14} /></i>
              <div>
                <p><b>{actorName(e.actor)}</b> {describe(e, T, L)}</p>
                <time className="dim xs" dateTime={new Date(e.at).toISOString()}>{time(e.at)}</time>
              </div>
            </li>
          ))}
        </ol>
      ) : <div className="empty"><Icon name="clock" size={28} />{T('لسه مفيش نشاط مسجّل', 'No activity recorded yet')}</div>}
      <p className="dim xs mt12">{T(`بيتحفظ آخر 500 حدث. معروض ${list.length} من ${all.length}.`, `The last 500 events are kept. Showing ${list.length} of ${all.length}.`)}</p>
    </div>
  );
}
