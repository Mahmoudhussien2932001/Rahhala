/* Small offer / agency helpers shared by the store and the UI. */

const todayStr = () => new Date().toISOString().slice(0, 10);

/* An offer whose departure date has passed is hidden from the public automatically. */
export const isExpired = (o) => !!o?.date && String(o.date) < todayStr();

/* A flash deal is running while flashEndsAt is in the future and there is a discount. */
export const flashActive = (o, now = Date.now()) =>
  !!o?.flashEndsAt && +new Date(o.flashEndsAt) > now && !!o.oldPrice && o.oldPrice > o.price;

/*
  Response time = hours from a request arriving to the agency marking it "contacted".
  Returns { hours, count } using the median of the agency's last 30 answered requests.
*/
export function responseStats(inquiries, agencyId) {
  const hrs = inquiries
    .filter((q) => q.agencyId === agencyId && q.contactedAt && q.contactedAt >= q.createdAt)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 30)
    .map((q) => (q.contactedAt - q.createdAt) / 36e5)
    .sort((a, b) => a - b);
  if (!hrs.length) return { hours: null, count: 0 };
  const mid = Math.floor(hrs.length / 2);
  const median = hrs.length % 2 ? hrs[mid] : (hrs[mid - 1] + hrs[mid]) / 2;
  return { hours: median, count: hrs.length };
}

/* Show the badge only when it's good (≤ 24h) and based on at least 3 answered requests. */
export function responseBadge(stats) {
  if (!stats || stats.count < 3 || stats.hours === null || stats.hours > 24) return null;
  return Math.max(1, Math.ceil(stats.hours));
}
