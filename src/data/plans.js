/*
  Agency pricing plans — everything plan-related lives here.
  The admin sets each agency's plan (agency.plan). Limits are enforced in the dashboards.
  Prices are placeholders: set your real prices before launch.
*/

export const PLANS = {
  free: {
    name: { ar: 'مجاني', en: 'Free' },
    price: 0,
    tagline: { ar: 'ابدأ واعرض أول عروضك', en: 'Get started with your first offers' },
    maxLive: 3,
    featuredSlots: 0,
    analytics: false,
    verifyPriority: 'standard',
  },
  pro: {
    name: { ar: 'برو', en: 'Pro' },
    price: 499,
    tagline: { ar: 'للشركات اللي بتكبر', en: 'For growing agencies' },
    maxLive: 15,
    featuredSlots: 1,
    analytics: true,
    verifyPriority: 'fast',
    popular: true,
  },
  premium: {
    name: { ar: 'بريميوم', en: 'Premium' },
    price: 1499,
    tagline: { ar: 'أقصى ظهور ومميزات', en: 'Maximum reach and every feature' },
    maxLive: Infinity,
    featuredSlots: 3,
    analytics: true,
    verifyPriority: 'priority',
  },
};

export const PLAN_ORDER = ['free', 'pro', 'premium'];

export const VERIFY_LABEL = {
  standard: { ar: 'مراجعة عادية', en: 'Standard review' },
  fast: { ar: 'مراجعة أسرع', en: 'Faster review' },
  priority: { ar: 'أولوية في التوثيق', en: 'Priority verification' },
};

export const planOf = (agency) => PLANS[agency?.plan] || PLANS.free;
export const planKey = (agency) => (PLANS[agency?.plan] ? agency.plan : 'free');

/* How many of the agency's offers count against the live limit (visible and not expired). */
export const liveCountOf = (offers, agencyId, isExpired) =>
  offers.filter((o) => o.agencyId === agencyId && o.active !== false && !isExpired(o)).length;
