/*
  Umrah-specific offer details (all optional, only for category 'umrah'):
    offer.umrah = {
      hotelMakkah, hotelMadinah,          // hotel names
      distanceHaram, distanceNabawi,      // walking distance in meters
      nightsMakkah, nightsMadinah,        // how the trip's nights are split
      flight: 'direct' | 'transit' | 'road',
      airline,                            // free text, e.g. "EgyptAir"
    }
*/

export const FLIGHT_TYPES = {
  direct: { ar: 'طيران مباشر', en: 'Direct flight', icon: 'plane' },
  transit: { ar: 'طيران ترانزيت', en: 'Connecting flight', icon: 'plane' },
  road: { ar: 'بري بالأتوبيس', en: 'By road (coach)', icon: 'bus' },
};

/* Options for the "max distance to the Haram" filter, in meters. */
export const DISTANCE_STEPS = [200, 500, 1000, 2000];

/* Options for the nights-split filter. */
export const NIGHT_SPLITS = {
  makkah: { ar: 'ليالي أكتر في مكة', en: 'More nights in Makkah' },
  balanced: { ar: 'متوازنة', en: 'Balanced' },
  madinah: { ar: 'ليالي أكتر في المدينة', en: 'More nights in Madinah' },
};

export const isUmrah = (o) => o?.category === 'umrah';
export const umrahOf = (o) => (isUmrah(o) && o.umrah ? o.umrah : null);

export function splitOf(u) {
  if (!u || !(u.nightsMakkah >= 0) || !(u.nightsMadinah >= 0)) return null;
  const diff = u.nightsMakkah - u.nightsMadinah;
  if (Math.abs(diff) <= 1) return 'balanced';
  return diff > 0 ? 'makkah' : 'madinah';
}

/* "150 m" / "1.2 km" */
export function fmtDistance(m, T) {
  if (m === null || m === undefined || m === '') return '—';
  return m < 1000 ? `${m} ${T('متر', 'm')}` : `${(m / 1000).toFixed(m % 1000 ? 1 : 0)} ${T('كم', 'km')}`;
}

/* Rough walking time at ~75 m/min, rounded up to whole minutes. */
export const walkMinutes = (m) => Math.max(1, Math.ceil(m / 75));
