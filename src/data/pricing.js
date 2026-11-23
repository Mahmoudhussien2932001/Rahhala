/*
  Pricing, installments and the trip-cost calculator — all in one place.

  An offer's `price` is the base price per person (sharing a double room).
  Agencies can optionally add `offer.pricing`:
    {
      rooms:  { single, double, triple, quad }   // price per person for that room type
      child:  number                              // per child aged 2–11
      infant: number                              // per infant under 2
      extras: [{ id, name: { ar, en }, price, per: 'person' | 'booking' }]
    }
  Anything left empty falls back to the base price.
*/

/* Installments are an ESTIMATE shown to travelers — the agency confirms the real plan. */
export const INSTALLMENT = {
  months: [6, 12],   // plans to show; the card shows the longest one
  adminFeePct: 0,    // optional admin fee added once to the total, e.g. 5 for 5%
  roundTo: 10,       // round monthly amounts up to the nearest N EGP
};

export const ROOM_TYPES = [
  { k: 'single', ar: 'فردي', en: 'Single', pax: 1 },
  { k: 'double', ar: 'مزدوج', en: 'Double', pax: 2 },
  { k: 'triple', ar: 'ثلاثي', en: 'Triple', pax: 3 },
  { k: 'quad', ar: 'رباعي', en: 'Quad', pax: 4 },
];

export const AGE_BANDS = {
  child: { ar: 'أطفال (2–11 سنة)', en: 'Children (2–11)' },
  infant: { ar: 'رُضّع (أقل من سنتين)', en: 'Infants (under 2)' },
};

const num = (v) => (v === '' || v === null || v === undefined || Number.isNaN(+v) ? null : +v);

/* Price per person for each room type (falls back to the base price). */
export function roomPrice(offer, room) {
  return num(offer.pricing?.rooms?.[room]) ?? offer.price;
}

export function childPrice(offer, band) {
  const p = offer.pricing || {};
  if (band === 'infant') return num(p.infant) ?? num(p.child) ?? offer.price;
  return num(p.child) ?? offer.price;
}

/* Rooms the agency actually priced (double is always available = base price). */
export function availableRooms(offer) {
  const rooms = offer.pricing?.rooms || {};
  return ROOM_TYPES.filter((r) => r.k === 'double' || num(rooms[r.k]) !== null);
}

export function monthly(total, months) {
  const withFee = total * (1 + (INSTALLMENT.adminFeePct || 0) / 100);
  const step = INSTALLMENT.roundTo || 1;
  return Math.ceil(withFee / months / step) * step;
}

/* "From X / month" for a single traveler at the base price, using the longest plan. */
export function fromMonthly(offer) {
  const m = Math.max(...INSTALLMENT.months);
  return { months: m, amount: monthly(offer.price, m) };
}

/*
  Full quote for a booking selection:
    sel = { adults, children, infants, room, extras: [ids] }
  Returns line items + totals, ready to save with the booking request.
*/
export function quote(offer, sel) {
  const adults = Math.max(1, Math.round(+sel.adults || 1));
  const children = Math.max(0, Math.round(+sel.children || 0));
  const infants = Math.max(0, Math.round(+sel.infants || 0));
  const room = availableRooms(offer).some((r) => r.k === sel.room) ? sel.room : 'double';
  const adultUnit = roomPrice(offer, room);
  const childUnit = childPrice(offer, 'child');
  const infantUnit = childPrice(offer, 'infant');
  const payers = adults + children; // infants don't count for per-person extras
  const extras = (offer.pricing?.extras || [])
    .filter((x) => (sel.extras || []).includes(x.id))
    .map((x) => ({ id: x.id, name: x.name, per: x.per, unit: +x.price || 0, qty: x.per === 'booking' ? 1 : payers }))
    .map((x) => ({ ...x, amount: x.unit * x.qty }));

  const lines = [
    { k: 'adults', qty: adults, unit: adultUnit, amount: adults * adultUnit },
    children ? { k: 'children', qty: children, unit: childUnit, amount: children * childUnit } : null,
    infants ? { k: 'infants', qty: infants, unit: infantUnit, amount: infants * infantUnit } : null,
  ].filter(Boolean);

  const total = lines.reduce((s, l) => s + l.amount, 0) + extras.reduce((s, x) => s + x.amount, 0);
  return {
    adults, children, infants, room,
    lines, extras, total,
    perPerson: Math.round(total / Math.max(1, payers)),
    monthly: Object.fromEntries(INSTALLMENT.months.map((m) => [m, monthly(total, m)])),
    feePct: INSTALLMENT.adminFeePct || 0,
  };
}

/* Short human summary of a saved breakdown (for dashboards). */
export function breakdownSummary(b, T, L) {
  if (!b) return '';
  const room = ROOM_TYPES.find((r) => r.k === b.room);
  const n = (count, one, many) => `${count} ${count === 1 ? one : many}`;
  return [
    n(b.adults, T('بالغ', 'adult'), T('بالغين', 'adults')),
    b.children ? n(b.children, T('طفل', 'child'), T('أطفال', 'children')) : null,
    b.infants ? n(b.infants, T('رضيع', 'infant'), T('رُضّع', 'infants')) : null,
    room ? `${T('غرفة', 'Room')}: ${L(room)}` : null,
    ...(b.extras || []).map((x) => `+ ${L(x.name)}`),
  ].filter(Boolean).join(' · ');
}
