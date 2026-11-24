export const fmt = (n) => (Number(n) || 0).toLocaleString('en-US');

export const money = (n, lang) => `${fmt(n)} ${lang === 'en' ? 'EGP' : 'ج.م'}`;

export const fdate = (d, lang) => {
  try {
    return new Date(d).toLocaleDateString(lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return d;
  }
};

export const shortDate = (d, lang) =>
  new Date(d).toLocaleDateString(lang === 'ar' ? 'ar-EG-u-nu-latn' : 'en-GB', { day: 'numeric', month: 'short' });

export const daysTo = (d) => Math.ceil((new Date(d) - Date.now()) / 864e5);

export const ago = (t, lang) => {
  const m = Math.max(1, Math.round((Date.now() - t) / 6e4));
  const ar = lang === 'ar';
  if (m < 60) return ar ? `من ${m} دقيقة` : `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return ar ? `من ${h} ساعة` : `${h}h ago`;
  const d = Math.round(h / 24);
  return ar ? `من ${d} يوم` : `${d}d ago`;
};

export const MONTHS = {
  ar: ['ينا', 'فبر', 'مار', 'أبر', 'ماي', 'يون', 'يول', 'أغس', 'سبت', 'أكت', 'نوف', 'ديس'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

export const MONTHS_FULL = {
  ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

export const discount = (o) => (o.oldPrice && o.oldPrice > o.price ? Math.round((1 - o.price / o.oldPrice) * 100) : 0);

export const uid = (p) => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
