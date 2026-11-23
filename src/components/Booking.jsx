import { useState } from 'react';
import Icon from './Icon';
import { useLang } from '../lib/i18n';
import { useStore } from '../store/store';
import { fmt, money, uid } from '../lib/format';
import { AGE_BANDS, INSTALLMENT, availableRooms, monthly, quote } from '../data/pricing';

/* Booking request form + trip-cost calculator — shared by the offer quick-view modal and the full offer page. */

export const waLink = (number, text = '') =>
  `https://wa.me/${String(number || '').replace(/\D/g, '')}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

function Stepper({ label, hint, value, min = 0, max = 20, onChange }) {
  const { T } = useLang();
  return (
    <div className="stp">
      <div className="stp-l"><b>{label}</b>{hint && <small>{hint}</small>}</div>
      <div className="stp-c">
        <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`${T('أقل', 'Fewer')} — ${label}`}>−</button>
        <output aria-live="polite">{value}</output>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`${T('أكتر', 'More')} — ${label}`}>+</button>
      </div>
    </div>
  );
}

export function InstallmentNote({ total, compact = false }) {
  const { T, lang } = useLang();
  const fee = INSTALLMENT.adminFeePct;
  return (
    <div className={`inst ${compact ? 'compact' : ''}`}>
      <div className="inst-row">
        {INSTALLMENT.months.map((m) => (
          <span key={m}><b>{money(monthly(total, m), lang)}</b> / {T('شهر', 'month')} <small>× {m}</small></span>
        ))}
      </div>
      <small className="inst-note">
        {T('تقسيط تقديري', 'Estimated installments')}{fee ? ` — ${T(`شامل مصاريف إدارية ${fee}%`, `incl. ${fee}% admin fee`)}` : ''}. {T('الشركة بتأكد نظام التقسيط الفعلي.', 'The agency confirms the actual plan.')}
      </small>
    </div>
  );
}

export function BookingForm({ offer: o, className = '' }) {
  const { T, L, lang } = useLang();
  const store = useStore();
  const a = store.agency(o.agencyId) || {};
  const [sel, setSel] = useState({ adults: 2, children: 0, infants: 0, room: 'double', extras: [] });
  const [sent, setSent] = useState(null);
  const set = (k, v) => setSel((s) => ({ ...s, [k]: v }));
  const rooms = availableRooms(o);
  const extras = o.pricing?.extras || [];
  const q = quote(o, sel);

  const submit = (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get('name')).trim().slice(0, 60);
    const phone = String(f.get('phone')).trim().slice(0, 15);
    store.set('inquiries', uid('q'), {
      offerId: o.id, agencyId: o.agencyId, name, phone,
      people: q.adults + q.children + q.infants,
      breakdown: { ...q, quotedAt: Date.now() },
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
        <p className="dim small mt8">{T('الإجمالي التقديري:', 'Estimated total:')} <b className="accent">{money(q.total, lang)}</b></p>
      </div>
    );
  }

  return (
    <form className={`box form calc ${className}`} onSubmit={submit}>
      <h3>{T('احسب تكلفة رحلتك واحجز', 'Price your trip & request booking')}</h3>

      <fieldset className="calc-sec">
        <legend>{T('المسافرين', 'Travelers')}</legend>
        <Stepper label={T('كبار', 'Adults')} hint={T('12 سنة وأكبر', '12+ years')} value={q.adults} min={1} onChange={(v) => set('adults', v)} />
        <Stepper label={T('أطفال', 'Children')} hint={L(AGE_BANDS.child)} value={q.children} onChange={(v) => set('children', v)} />
        <Stepper label={T('رُضّع', 'Infants')} hint={L(AGE_BANDS.infant)} value={q.infants} max={6} onChange={(v) => set('infants', v)} />
      </fieldset>

      {rooms.length > 1 && (
        <fieldset className="calc-sec">
          <legend>{T('نوع الغرفة', 'Room type')}</legend>
          <div className="room-pick" role="radiogroup">
            {rooms.map((r) => (
              <label key={r.k} className={q.room === r.k ? 'on' : ''}>
                <input type="radio" name="room" value={r.k} checked={q.room === r.k} onChange={() => set('room', r.k)} />
                <b>{L(r)}</b>
                <small>{fmt(o.pricing?.rooms?.[r.k] ?? o.price)} / {T('فرد', 'person')}</small>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {extras.length > 0 && (
        <fieldset className="calc-sec">
          <legend>{T('إضافات اختيارية', 'Optional extras')}</legend>
          <div className="extra-pick">
            {extras.map((x) => {
              const on = sel.extras.includes(x.id);
              return (
                <label key={x.id} className={on ? 'on' : ''}>
                  <input type="checkbox" checked={on} onChange={(e) => set('extras', e.target.checked ? [...sel.extras, x.id] : sel.extras.filter((i) => i !== x.id))} />
                  <span>{L(x.name)}</span>
                  <small>+{fmt(x.price)} {x.per === 'booking' ? T('للحجز', 'per booking') : T('للفرد', 'per person')}</small>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className="calc-sum" aria-live="polite">
        {q.lines.map((l) => (
          <div key={l.k} className="cs-row"><span>{l.qty} × {{ adults: T('كبار', 'adults'), children: T('أطفال', 'children'), infants: T('رُضّع', 'infants') }[l.k]} <small>({fmt(l.unit)})</small></span><b>{fmt(l.amount)}</b></div>
        ))}
        {q.extras.map((x) => (
          <div key={x.id} className="cs-row"><span>{L(x.name)} {x.qty > 1 && <small>(× {x.qty})</small>}</span><b>{fmt(x.amount)}</b></div>
        ))}
        <div className="cs-total"><span>{T('الإجمالي', 'Total')}</span><b>{money(q.total, lang)}</b></div>
        <div className="cs-row dim"><span>{T('متوسط للفرد', 'Per person')}</span><span>{money(q.perPerson, lang)}</span></div>
        <InstallmentNote total={q.total} compact />
      </div>

      <label>{T('الاسم', 'Name')}<input className="inp" name="name" required maxLength={60} autoComplete="name" /></label>
      <label>{T('الموبايل', 'Mobile')}<input className="inp ltr" name="phone" required inputMode="tel" autoComplete="tel" pattern="[0-9+ ]{8,15}" /></label>
      <label>{T('ملاحظة (اختياري)', 'Note (optional)')}<textarea className="inp" name="note" rows="2" maxLength={300} /></label>
      <button className="btn btn-sun">{T('ابعت الطلب', 'Send request')}</button>
      <a className="btn btn-ghost wa" href={waLink(a.whatsapp, T('استفسار عن عرض: ', 'Question about: ') + L(o.title))} target="_blank" rel="noopener noreferrer"><Icon name="wa" />{T('كلّم الشركة واتساب', 'WhatsApp the agency')}</a>
      <div className="dim ltr small center">{a.phone}</div>
    </form>
  );
}
