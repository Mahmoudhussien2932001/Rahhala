/* CSV export helpers (admin). UTF-8 with BOM so Excel shows Arabic correctly. */

// Cells starting with = + - @ could run as formulas in Excel/Sheets ("CSV injection") — prefix them.
const safe = (v) => {
  const s = v === null || v === undefined ? '' : String(v);
  const t = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
  return /[",\n\r]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t;
};

export function toCsv(headers, rows) {
  return [headers, ...rows].map((r) => r.map(safe).join(',')).join('\r\n');
}

export function downloadCsv(filename, headers, rows) {
  const blob = new Blob(['﻿' + toCsv(headers, rows)], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

const iso = (t) => (t ? new Date(t).toISOString().replace('T', ' ').slice(0, 16) : '');
const day = () => new Date().toISOString().slice(0, 10);

/* The three exports the admin can download. */
export function exportAgencies(store) {
  const accs = store.db.accounts;
  downloadCsv(`rahhala-agencies-${day()}.csv`,
    ['id', 'name_ar', 'name_en', 'city', 'plan', 'verified', 'active', 'license', 'phone', 'whatsapp', 'email', 'login_email', 'rating', 'reviews', 'since', 'offers', 'requests'],
    store.list('agencies').map((a) => [
      a.id, a.name?.ar, a.name?.en, a.city, a.plan || 'free', a.verified ? 'yes' : 'no', a.active === false ? 'no' : 'yes', a.license, a.phone, a.whatsapp, a.email,
      accs[a.id]?.email, a.rating, a.reviews, a.since,
      store.list('offers').filter((o) => o.agencyId === a.id).length,
      store.list('inquiries').filter((q) => q.agencyId === a.id).length,
    ]));
}

export function exportOffers(store) {
  downloadCsv(`rahhala-offers-${day()}.csv`,
    ['id', 'agency_id', 'agency', 'title_ar', 'title_en', 'category', 'destination', 'from_city', 'price', 'old_price', 'nights', 'seats', 'departure_date', 'live', 'review', 'featured', 'views', 'features', 'created'],
    store.list('offers').map((o) => [
      o.id, o.agencyId, store.agency(o.agencyId)?.name?.en, o.title?.ar, o.title?.en, o.category, o.dest, o.from, o.price, o.oldPrice || '', o.nights, o.seats, o.date,
      o.active === false ? 'no' : 'yes', o.review || '', o.featured ? 'yes' : 'no', o.views || 0, (o.features || []).join('|'), iso(o.createdAt),
    ]));
}

export function exportRequests(store) {
  downloadCsv(`rahhala-requests-${day()}.csv`,
    ['id', 'created', 'status', 'contacted_at', 'customer', 'phone', 'people', 'offer_id', 'offer', 'agency', 'quoted_total', 'note'],
    store.list('inquiries').sort((a, b) => b.createdAt - a.createdAt).map((q) => [
      q.id, iso(q.createdAt), q.status, iso(q.contactedAt), q.name, q.phone, q.people, q.offerId,
      store.get('offers', q.offerId)?.title?.en || '', store.agency(q.agencyId)?.name?.en || '', q.breakdown?.total ?? '', q.note || '',
    ]));
}
