/*
  "Find my trip" quiz: the 4 questions and the matching/scoring logic.
  Score (0-100) = budget 40 + vibe 30 + month 20 + who's travelling 10.
  Offers far over budget or with no vibe in common are left out.
*/

export const BUDGETS = [
  { k: 'b1', max: 10000, ar: 'أقل من 10 آلاف', en: 'Under 10,000' },
  { k: 'b2', max: 25000, ar: 'لحد 25 ألف', en: 'Up to 25,000' },
  { k: 'b3', max: 50000, ar: 'لحد 50 ألف', en: 'Up to 50,000' },
  { k: 'b4', max: 100000, ar: 'لحد 100 ألف', en: 'Up to 100,000' },
  { k: 'any', max: Infinity, ar: 'مش فارقة', en: "Doesn't matter" },
];

export const WHO = {
  solo: { ar: 'لوحدي', en: 'Solo', icon: 'users', fit: { ar: 'مناسب للسفر لوحدك', en: 'Good for solo travellers' } },
  couple: { ar: 'أنا وشريكي', en: 'As a couple', icon: 'heart', fit: { ar: 'مناسب للأزواج', en: 'Good for couples' } },
  family: { ar: 'العيلة والأطفال', en: 'Family with kids', icon: 'home', fit: { ar: 'مناسب للعيلة', en: 'Good for families' } },
  friends: { ar: 'مع أصحابي', en: 'With friends', icon: 'users', fit: { ar: 'مناسب للأصحاب', en: 'Good for groups of friends' } },
};

export const VIBES = {
  sea: { ar: 'بحر وشمس', en: 'Sea & sun', photo: 'px:29095916' },
  mountains: { ar: 'جبال وطبيعة', en: 'Mountains & nature', photo: 'px:16660047' },
  desert: { ar: 'صحرا وسفاري', en: 'Desert & safari', photo: 'px:16908872' },
  city: { ar: 'مدن وثقافة', en: 'Cities & culture', photo: 'px:7529416' },
  spiritual: { ar: 'روحاني (عمرة)', en: 'Spiritual (Umrah)', photo: 'px:31339194' },
};

/* Which vibes each destination offers. */
export const DEST_VIBES = {
  mecca: ['spiritual'],
  sharm: ['sea'], hurghada: ['sea'], marsa: ['sea'], dahab: ['sea', 'mountains'], sokhna: ['sea'],
  alamein: ['sea'], sahel: ['sea'], matrouh: ['sea'], gouna: ['sea'], gamasa: ['sea'], sudr: ['sea'],
  istanbul: ['city'], dubai: ['city', 'desert'], georgia: ['mountains', 'city'], malaysia: ['city', 'sea'],
  maldives: ['sea'], europe: ['city'],
  catherine: ['mountains', 'desert'], siwa: ['desert'], whitedesert: ['desert'], luxor: ['city'],
};

/* Features that suit each kind of group (adds to the "who" score). */
const WHO_FEATURES = {
  solo: ['guide', 'tours', 'hike', 'camp', 'safari'],
  couple: ['h5', 'seaview', 'allinc', 'beachfront', 'boat'],
  family: ['kids', 'pool', 'allinc', 'transfers', 'breakfast'],
  friends: ['safari', 'camp', 'bbq', 'boat', 'snorkel', 'diving'],
};

const n = (ar, en) => ({ ar, en });
const fmt = (x) => (Number(x) || 0).toLocaleString('en-US');
const monthName = (m, lang) => new Date(2026, m - 1, 1).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-GB', { month: 'long' });

/*
  answers = { budget: 'b2', month: 1-12 | 'any', who: 'family', vibes: ['sea', ...] }
  ctx = { MONTHS: { ar: [...], en: [...] }, DESTS }
  Returns [{ offer, score, pct, reasons: [{ ar, en }] }] best first.
*/
export function matchOffers(offers, answers, { DESTS, MONTHS }) {
  const budget = BUDGETS.find((b) => b.k === answers.budget) || BUDGETS[BUDGETS.length - 1];
  const vibes = answers.vibes?.length ? answers.vibes : Object.keys(VIBES);
  const month = answers.month === 'any' ? null : +answers.month;

  return offers
    .map((o) => {
      const reasons = [];
      let score = 0;

      // vibe (30) — required
      const dv = DEST_VIBES[o.dest] || [];
      const shared = dv.filter((v) => vibes.includes(v));
      if (!shared.length) return null;
      score += 30;
      reasons.push({ w: 1, t: n(`${VIBES[shared[0]].ar}، زي ما طلبت`, `${VIBES[shared[0]].en}, just as you asked`) });

      // budget (40) — per person
      if (budget.max === Infinity) score += 30;
      else if (o.price <= budget.max) {
        score += 40;
        reasons.push({ w: 4, t: n(`في حدود ميزانيتك (${fmt(o.price)} ج.م للفرد)`, `Within your budget (${fmt(o.price)} EGP per person)`) });
      } else if (o.price <= budget.max * 1.15) {
        score += 18;
        reasons.push({ w: 1, t: n('أعلى من ميزانيتك بشوية بس', 'Just a little over your budget') });
      } else if (o.price > budget.max * 1.3) return null;

      // month (20)
      if (!month) score += 12;
      else {
        const d = DESTS[o.dest];
        const departs = new Date(o.date).getMonth() + 1 === month;
        if (d?.best?.includes(month)) { score += 14; reasons.push({ w: 2, t: n(`${monthName(month, 'ar')} من أحسن شهورها`, `${monthName(month, 'en')} is a great time to go`) }); }
        if (departs) { score += 6; reasons.push({ w: 3, t: n(`بيسافر في ${monthName(month, 'ar')}`, `Departs in ${monthName(month, 'en')}`) }); }
      }

      // who (10)
      const feats = (o.features || []).filter((f) => (WHO_FEATURES[answers.who] || []).includes(f));
      let who = Math.min(8, feats.length * 3);
      if (answers.who === 'family' && o.pricing?.child != null) { who += 4; reasons.push({ w: 3, t: n('سعر مخصوص للأطفال', 'Special price for children') }); }
      if (answers.who === 'solo' && o.pricing?.rooms?.single) who += 2;
      if (answers.who === 'friends' && (o.pricing?.rooms?.triple || o.pricing?.rooms?.quad)) { who += 3; reasons.push({ w: 3, t: n('غرف تلاتية ورباعية للمجموعات', 'Triple & quad rooms for groups') }); }
      if (feats.length && WHO[answers.who]) reasons.push({ w: 2, t: WHO[answers.who].fit });
      if (feats.includes('kids')) reasons.push({ w: 3, t: n('فيه نادي أطفال', 'Has a kids club') });
      score += Math.min(10, who);

      if (o.seats > 0 && o.seats <= 5) reasons.push({ w: 0, t: n(`فاضل ${o.seats} أماكن بس`, `Only ${o.seats} seats left`) });

      const top = reasons.sort((a, b) => b.w - a.w).slice(0, 3).map((r) => r.t);
      return { offer: o, score, pct: Math.max(40, Math.min(99, Math.round(score))), reasons: top };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.offer.price - b.offer.price);
}
