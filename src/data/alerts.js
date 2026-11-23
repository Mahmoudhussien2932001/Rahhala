/*
  Price-drop / low-seats alerts.
  A traveler leaves a name + WhatsApp number on an offer. When the agency later saves the offer
  with a lower price, or seats fall to LOW_SEATS or fewer, the store flags the alert as "ready"
  and the dashboards offer a one-click WhatsApp message.
*/

export const LOW_SEATS = 5;

export const ALERT_KINDS = {
  price: { ar: 'لو السعر نزل', en: 'If the price drops' },
  seats: { ar: 'لو الأماكن قربت تخلص', en: 'If seats run low' },
};

export const ALERT_STATUS = {
  waiting: { ar: 'مستني', en: 'Waiting' },
  ready: { ar: 'جاهز للتواصل', en: 'Ready to contact' },
  contacted: { ar: 'اتكلّمنا معاه', en: 'Contacted' },
};

/* Returns the patch to apply to a waiting alert after the offer changed, or null. */
export function checkAlert(alert, offer) {
  if (alert.status !== 'waiting' || alert.offerId !== offer.id) return null;
  const kinds = alert.kinds || ['price'];
  if (kinds.includes('price') && +offer.price < +alert.priceAtSignup) {
    return { status: 'ready', reason: 'price', readyPrice: +offer.price, readyAt: Date.now() };
  }
  if (kinds.includes('seats') && +offer.seats <= LOW_SEATS && +offer.seats < +alert.seatsAtSignup) {
    return { status: 'ready', reason: 'seats', readySeats: +offer.seats, readyAt: Date.now() };
  }
  return null;
}

const fmt = (n) => (Number(n) || 0).toLocaleString('en-US');

/* WhatsApp message to the traveler, in the language they used when signing up. */
export function alertMessage(alert, offer, agencyName, link) {
  const ar = alert.lang === 'ar';
  const title = offer.title?.[ar ? 'ar' : 'en'] || offer.title?.ar || '';
  if (alert.reason === 'seats') {
    return ar
      ? `أهلاً ${alert.name}، معاك ${agencyName} من رحّالة. عرض "${title}" فاضل فيه ${offer.seats} أماكن بس. لو لسه مهتم احجز من هنا: ${link}`
      : `Hi ${alert.name}, this is ${agencyName} via Rahhala. "${title}" has only ${offer.seats} seats left. If you're still interested, book here: ${link}`;
  }
  return ar
    ? `أهلاً ${alert.name}، معاك ${agencyName} من رحّالة. سعر عرض "${title}" نزل من ${fmt(alert.priceAtSignup)} لـ ${fmt(offer.price)} ج.م للفرد. احجز من هنا: ${link}`
    : `Hi ${alert.name}, this is ${agencyName} via Rahhala. The price of "${title}" dropped from ${fmt(alert.priceAtSignup)} to ${fmt(offer.price)} EGP per person. Book here: ${link}`;
}
