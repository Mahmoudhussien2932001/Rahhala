import { useState } from 'react';
import Icon from './Icon';
import { useLang } from '../lib/i18n';
import { useStore } from '../store/store';
import { money, uid } from '../lib/format';

/* Booking request form — shared by the offer quick-view modal and the full offer page. */

export const waLink = (number, text = '') =>
  `https://wa.me/${String(number || '').replace(/\D/g, '')}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export function BookingForm({ offer: o, className = '' }) {
  const { T, L, lang } = useLang();
  const store = useStore();
  const a = store.agency(o.agencyId) || {};
  const [people, setPeople] = useState(1);
  const [sent, setSent] = useState(null);
  const n = Math.max(1, +people || 1);

  const submit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get('name')).trim().slice(0, 60);
    const phone = String(f.get('phone')).trim().slice(0, 15);
    store.set('inquiries', uid('q'), {
      offerId: o.id, agencyId: o.agencyId, name, phone, people: n,
      note: String(f.get('note') || '').trim().slice(0, 300), status: 'new', createdAt: Date.now(),
    });
    setSent(phone);
  };

  if (sent) {
    return (
      <div className={`box sent ${className}`}>
        <div className="ok-circle"><Icon name="check" size={26} /></div>
        <h3>{T('طلبك وصل للشركة', 'Request sent')}</h3>
        <p className="muted small">{L(a.name)} {T('هتكلمك قريب على', 'will call you soon on')} <span className="ltr">{sent}</span></p>
      </div>
    );
  }

  return (
    <form className={`box form ${className}`} onSubmit={submit}>
      <h3>{T('اطلب الحجز من الشركة', 'Request booking')}</h3>
      <p className="dim small" style={{ marginTop: -6 }}>{T('الشركة هتكلمك وتأكد الحجز معاك', 'The agency will call you to confirm')}</p>
      <label>{T('الاسم', 'Name')}<input className="inp" name="name" required maxLength={60} autoComplete="name" /></label>
      <div className="row2">
        <label>{T('الموبايل', 'Mobile')}<input className="inp ltr" name="phone" required inputMode="tel" autoComplete="tel" pattern="[0-9+ ]{8,15}" /></label>
        <label>{T('عدد الأفراد', 'Travelers')}<input className="inp" type="number" min="1" max="50" value={people} onChange={(e) => setPeople(e.target.value)} /></label>
      </div>
      <label>{T('ملاحظة (اختياري)', 'Note (optional)')}<textarea className="inp" name="note" rows="2" maxLength={300} /></label>
      <div className="dim small">{T('الإجمالي التقريبي:', 'Estimated total:')} <b className="accent">{money(o.price * n, lang)}</b></div>
      <button className="btn btn-sun">{T('ابعت الطلب', 'Send request')}</button>
      <a className="btn btn-ghost wa" href={waLink(a.whatsapp, T('استفسار عن عرض: ', 'Question about: ') + L(o.title))} target="_blank" rel="noopener noreferrer"><Icon name="wa" />{T('كلّم الشركة واتساب', 'WhatsApp the agency')}</a>
      <div className="dim ltr small center">{a.phone}</div>
    </form>
  );
}
