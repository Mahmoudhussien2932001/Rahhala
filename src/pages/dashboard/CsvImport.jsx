import { useState } from 'react';
import Icon from '../../components/Icon';
import { useLang } from '../../lib/i18n';
import { useStore } from '../../store/store';
import { useUI, useModalClose } from '../../components/UI';
import { CITIES, DESTS, FEATURES } from '../../data/catalog';
import { fmt, uid } from '../../lib/format';
import { isExpired } from '../../lib/offers';
import { liveCountOf, planOf } from '../../data/plans';

/*
  Bulk offer import from CSV: download template → upload/paste → preview + validation → save.
  Columns use internal keys for destination / city / features (listed in the template's notes).
*/

const pl = (n, one, many) => `${n} ${n === 1 ? one : many}`;

const COLS = ['title_ar', 'title_en', 'destination', 'from_city', 'price', 'old_price', 'nights', 'seats', 'departure_date', 'features'];

function templateCsv() {
  const future = (d) => new Date(Date.now() + d * 864e5).toISOString().slice(0, 10);
  const rows = [
    COLS,
    ['شرم الشيخ 4 ليالي شامل', 'Sharm — 4 nights all inclusive', 'sharm', 'cairo', '15900', '18500', '4', '20', future(30), 'h5|allinc|transfers'],
    ['دهب 3 ليالي', 'Dahab — 3 nights', 'dahab', 'cairo', '7900', '', '3', '12', future(45), 'h4|breakfast|snorkel'],
  ];
  return rows.map((r) => r.map((c) => (/[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(',')).join('\r\n');
}

/* Small RFC-4180 style parser: quoted fields, escaped quotes, commas/newlines inside quotes. */
export function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', q = false;
  const s = String(text).replace(/^﻿/, '');
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (q) {
      if (ch === '"' && s[i + 1] === '"') { cell += '"'; i++; } else if (ch === '"') q = false; else cell += ch;
    } else if (ch === '"') q = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && s[i + 1] === '\n') i++;
      row.push(cell); cell = '';
      if (row.some((c) => c.trim() !== '')) rows.push(row);
      row = [];
    } else cell += ch;
  }
  row.push(cell);
  if (row.some((c) => c.trim() !== '')) rows.push(row);
  return rows;
}

function validate(rows, T) {
  if (!rows.length) return { error: T('الملف فاضي', 'The file is empty') };
  const head = rows[0].map((h) => h.trim().toLowerCase());
  const missing = COLS.filter((c) => !['title_en', 'old_price', 'features'].includes(c) && !head.includes(c));
  if (missing.length) return { error: T(`أعمدة ناقصة: ${missing.join(', ')}`, `Missing columns: ${missing.join(', ')}`) };
  const idx = Object.fromEntries(COLS.map((c) => [c, head.indexOf(c)]));
  const get = (r, c) => (idx[c] >= 0 ? String(r[idx[c]] ?? '').trim() : '');
  const today = new Date().toISOString().slice(0, 10);

  return {
    items: rows.slice(1).map((r, i) => {
      const errors = [], warnings = [];
      const titleAr = get(r, 'title_ar'), titleEn = get(r, 'title_en');
      const dest = get(r, 'destination').toLowerCase(), from = get(r, 'from_city').toLowerCase();
      const price = +get(r, 'price'), oldRaw = get(r, 'old_price'), oldPrice = oldRaw ? +oldRaw : null;
      const nights = +get(r, 'nights'), seats = +get(r, 'seats'), date = get(r, 'departure_date');
      const feats = get(r, 'features').split(/[|;]/).map((f) => f.trim().toLowerCase()).filter(Boolean);

      if (!titleAr && !titleEn) errors.push(T('العنوان ناقص', 'Missing title'));
      if (!DESTS[dest]) errors.push(T(`وجهة مش معروفة: "${dest || '—'}"`, `Unknown destination: "${dest || '—'}"`));
      if (!CITIES[from]) errors.push(T(`مدينة مش معروفة: "${from || '—'}"`, `Unknown city: "${from || '—'}"`));
      if (!(price > 0) || !Number.isFinite(price)) errors.push(T('السعر لازم يكون رقم أكبر من صفر', 'Price must be a number above 0'));
      if (oldRaw && !(oldPrice > price)) warnings.push(T('السعر قبل الخصم مش أكبر من السعر — هيتشال', 'Old price is not above the price — ignored'));
      if (!(nights >= 1) || !Number.isInteger(nights)) errors.push(T('عدد الليالي لازم يكون رقم صحيح 1 أو أكتر', 'Nights must be a whole number ≥ 1'));
      if (!(seats >= 0) || !Number.isInteger(seats)) errors.push(T('الأماكن لازم تكون رقم صحيح', 'Seats must be a whole number'));
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(+new Date(date))) errors.push(T('التاريخ لازم يكون YYYY-MM-DD', 'Date must be YYYY-MM-DD'));
      else if (date < today) errors.push(T('ميعاد السفر عدّى', 'Departure date is in the past'));
      const unknown = feats.filter((f) => !FEATURES[f]);
      if (unknown.length) warnings.push(T(`مميزات مش معروفة اتشالت: ${unknown.join(', ')}`, `Unknown features dropped: ${unknown.join(', ')}`));

      return {
        line: i + 2, errors, warnings,
        offer: {
          title: { ar: titleAr || titleEn, en: titleEn || titleAr }, dest, from, category: DESTS[dest]?.cat,
          price: Math.round(price), oldPrice: oldPrice > price ? Math.round(oldPrice) : null,
          nights, seats, date, features: feats.filter((f) => FEATURES[f]),
          img: DESTS[dest] ? `px:${DESTS[dest].photos[0]}` : '',
        },
      };
    }),
  };
}

export function CsvImport({ agencyId }) {
  const { T, L } = useLang();
  const store = useStore();
  const { toast } = useUI();
  const close = useModalClose();
  const [res, setRes] = useState(null);
  const agency = store.agency(agencyId);
  const plan = planOf(agency);
  const used = liveCountOf(store.list('offers'), agencyId, isExpired);
  const room = plan.maxLive === Infinity ? Infinity : Math.max(0, plan.maxLive - used);

  const load = (text) => setRes(validate(parseCsv(text), T));
  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 500_000) return toast(T('الملف كبير — الحد 500KB', 'File too large — 500KB max'), 'err');
    const r = new FileReader();
    r.onload = () => load(String(r.result));
    r.readAsText(f, 'utf-8');
  };
  const download = () => {
    const blob = new Blob(['﻿' + templateCsv()], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'rahhala-offers-template.csv';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const valid = res?.items?.filter((x) => !x.errors.length) || [];
  const save = () => {
    const now = Date.now();
    const docs = valid.map((x, i) => ({
      ...x.offer, id: uid('o'), agencyId, active: i < room, featured: false, views: 0, createdAt: now + i, updatedAt: now,
    }));
    store.setMany('offers', docs);
    const hidden = docs.filter((d) => !d.active).length;
    toast(hidden
      ? T(`اتضاف ${docs.length} عرض — ${hidden} مخفيين عشان حد الباقة`, `${pl(docs.length, 'offer', 'offers')} added — ${hidden} hidden because of your plan limit`)
      : T(`اتضاف ${docs.length} عرض`, `${pl(docs.length, 'offer', 'offers')} added`));
    close();
  };

  return (
    <>
      <div className="mhead"><h3>{T('استيراد عروض من ملف CSV', 'Import offers from CSV')}</h3><button className="xbtn" onClick={close}><Icon name="x" /></button></div>
      <div className="mbody csv">
        <ol className="csv-steps">
          <li><b>{T('نزّل القالب', 'Download the template')}</b>
            <button className="btn btn-ghost btn-sm" onClick={download}><Icon name="up" size={15} style={{ transform: 'rotate(180deg)' }} />rahhala-offers-template.csv</button></li>
          <li><b>{T('املاه في Excel أو Google Sheets واحفظه CSV', 'Fill it in Excel or Google Sheets and save as CSV')}</b>
            <details className="csv-help"><summary>{T('الأكواد المسموحة', 'Allowed codes')}</summary>
              <p><b>destination:</b> {Object.keys(DESTS).join(', ')}</p>
              <p><b>from_city:</b> {Object.keys(CITIES).join(', ')}</p>
              <p><b>features</b> ({T('افصل بـ |', 'separate with |')}): {Object.keys(FEATURES).join(', ')}</p>
            </details></li>
          <li><b>{T('ارفع الملف', 'Upload the file')}</b>
            <label className="btn btn-sun btn-sm"><Icon name="up" size={15} />{T('اختار ملف CSV', 'Choose CSV file')}<input type="file" accept=".csv,text/csv" hidden onChange={onFile} /></label></li>
        </ol>

        {res?.error && <div className="csv-err"><Icon name="x" size={16} />{res.error}</div>}
        {res?.items && (
          <>
            <div className="csv-sum">
              <span className="ok">{T(`${valid.length} صف سليم`, pl(valid.length, 'valid row', 'valid rows'))}</span>
              <span className="bad">{T(`${res.items.length - valid.length} فيهم أخطاء`, pl(res.items.length - valid.length, 'row with errors', 'rows with errors'))}</span>
              {room !== Infinity && <span className="dim">{T(`مكان في الباقة لـ ${room} عروض ظاهرة — الباقي هيتحفظ مخفي`, `Room for ${room} more live offers on your plan — the rest are saved hidden`)}</span>}
            </div>
            <div className="tbl-wrap csv-prev">
              <table className="tbl">
                <thead><tr><th>#</th><th>{T('العنوان', 'Title')}</th><th>{T('الوجهة', 'Destination')}</th><th>{T('السعر', 'Price')}</th><th>{T('ليالي', 'Nights')}</th><th>{T('التاريخ', 'Date')}</th><th>{T('الحالة', 'Status')}</th></tr></thead>
                <tbody>
                  {res.items.map((x) => (
                    <tr key={x.line} className={x.errors.length ? 'row-bad' : ''}>
                      <td className="dim">{x.line}</td>
                      <td className="maxw">{L(x.offer.title) || '—'}</td>
                      <td>{DESTS[x.offer.dest] ? L(DESTS[x.offer.dest]) : x.offer.dest || '—'}</td>
                      <td className="nowrap">{x.offer.price > 0 ? fmt(x.offer.price) : '—'}</td>
                      <td>{x.offer.nights || '—'}</td>
                      <td className="nowrap">{x.offer.date || '—'}</td>
                      <td className="xs">
                        {x.errors.length ? x.errors.map((e) => <div key={e} className="bad">✕ {e}</div>) : <div className="ok">✓ {T('جاهز', 'Ready')}</div>}
                        {x.warnings.map((w) => <div key={w} className="warn">! {w}</div>)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        <div className="row-end mt12">
          <button className="btn btn-ghost" onClick={close}>{T('إلغاء', 'Cancel')}</button>
          <button className="btn btn-sun" disabled={!valid.length} onClick={save}>{T(`احفظ ${valid.length} عرض`, `Save ${pl(valid.length, 'offer', 'offers')}`)}</button>
        </div>
      </div>
    </>
  );
}
