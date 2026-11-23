/* Demo seed data — all agencies, offers and customers are fictional. */
import { DESTS } from './catalog';

const AGENCIES = [
  ['a1', { ar: 'مدار للسفر والسياحة', en: 'Madar Travel' }, { ar: 'عمرة وحج بخدمة فندقية', en: 'Umrah & Hajj with hotel-grade service' }, '#C9922E', 'cairo', 4.8, 412, true, 2009, 'A-1452', { ar: 'متخصصين في رحلات العمرة من القاهرة والإسكندرية بفنادق قريبة من الحرم وطيران مباشر.', en: 'Umrah specialists from Cairo & Alexandria with hotels close to the Haram and direct flights.' }, 'madar'],
  ['a2', { ar: 'نجمة البحر تورز', en: 'Sea Star Tours' }, { ar: 'مصايف البحر الأحمر', en: 'Red Sea holidays' }, '#0E9E94', 'cairo', 4.6, 287, true, 2014, 'A-2210', { ar: 'باقات شرم الشيخ والغردقة ومرسى علم شاملة الإقامة والانتقالات.', en: 'Sharm, Hurghada and Marsa Alam packages including stay and transfers.' }, 'seastar'],
  ['a3', { ar: 'واحة الساحل', en: 'Coast Oasis' }, { ar: 'شقق وشاليهات مصيفية', en: 'Summer chalets & apartments' }, '#E8693A', 'alex', 4.4, 156, true, 2017, 'B-3318', { ar: 'إيجار شقق وشاليهات في الساحل الشمالي والعلمين ومطروح بالأسبوع.', en: 'Weekly chalet and apartment rentals on the North Coast, Alamein and Matrouh.' }, 'waha'],
  ['a4', { ar: 'أفق للسياحة الخارجية', en: 'Ofok Outbound' }, { ar: 'العالم بين إيديك', en: 'The world in your hands' }, '#3A69AD', 'cairo', 4.7, 333, true, 2011, 'A-0987', { ar: 'رحلات إسطنبول ودبي وجورجيا وماليزيا والمالديف مع تأشيرة ومرشد عربي.', en: 'Istanbul, Dubai, Georgia, Malaysia and Maldives trips with visa and an Arabic guide.' }, 'ofok'],
  ['a5', { ar: 'بوابة الحرمين', en: 'Haramain Gate' }, { ar: 'عمرة اقتصادية ومميزة', en: 'Economy & premium Umrah' }, '#A8812F', 'giza', 4.5, 198, true, 2012, 'A-1877', { ar: 'برامج عمرة 10 و15 يوم بأسعار مناسبة للعائلات.', en: '10 and 15-day Umrah programs at family-friendly prices.' }, 'bawaba'],
  ['a6', { ar: 'اللؤلؤة ترافيل', en: 'Lulu Travel' }, { ar: 'إجازات العيلة', en: 'Family holidays' }, '#3BA3CF', 'alex', 4.3, 121, false, 2019, 'B-4120', { ar: 'مصايف العين السخنة والعلمين وباقات الأطفال.', en: 'Sokhna and Alamein holidays plus kids packages.' }, 'lulu'],
  ['a7', { ar: 'كنوز النيل', en: 'Nile Treasures' }, { ar: 'سياحة داخلية وخارجية', en: 'Domestic & outbound tours' }, '#B9506F', 'cairo', 4.6, 244, true, 2008, 'A-2645', { ar: 'من الأقصر وأسوان لحد أوروبا، برامج مرنة وأسعار تنافسية.', en: 'From Luxor and Aswan to Europe — flexible programs, competitive prices.' }, 'konoz'],
  ['a8', { ar: 'سفريات المرسى', en: 'Marsa Trips' }, { ar: 'مرسى علم والجونة', en: 'Marsa Alam & El Gouna' }, '#3A9C66', 'giza', 4.2, 88, false, 2021, 'B-3902', { ar: 'باقات غطس وسفاري ومنتجعات على البحر الأحمر.', en: 'Diving, safari and Red Sea resort packages.' }, 'marsa'],
  ['a9', { ar: 'قمم سيناء', en: 'Sinai Peaks' }, { ar: 'مغامرات الجبل والصحرا', en: 'Mountain & desert adventures' }, '#8A6440', 'cairo', 4.9, 176, true, 2015, 'A-3071', { ar: 'رحلات طلوع جبل موسى وسانت كاترين وتخييم في الصحرا البيضا وسيوة.', en: 'Mount Sinai climbs, St. Catherine, White Desert camping and Siwa.' }, 'peaks'],
  ['a10', { ar: 'موج للرحلات', en: 'Mawj Holidays' }, { ar: 'عروض اللحظة الأخيرة', en: 'Last-minute deals' }, '#1B7A9C', 'mansoura', 4.1, 64, false, 2022, 'C-5210', { ar: 'أحسن عروض اللحظة الأخيرة على الساحل والبحر الأحمر.', en: 'The best last-minute deals on the coast and the Red Sea.' }, 'mawj'],
  ['a11', { ar: 'بوصلة ترافيل', en: 'Bosla Travel' }, { ar: 'رحلات مصممة على مقاسك', en: 'Tailor-made trips' }, '#5566B8', 'cairo', 4.7, 205, true, 2013, 'A-1990', { ar: 'برامج خاصة للعائلات والمجموعات لتركيا وجورجيا وأوروبا.', en: 'Private programs for families and groups to Turkey, Georgia and Europe.' }, 'bosla'],
  ['a12', { ar: 'شطّ إسكندرية', en: 'Alex Shore' }, { ar: 'الساحل والعلمين', en: 'North Coast & Alamein' }, '#D27C3E', 'alex', 4.4, 139, true, 2016, 'B-2784', { ar: 'شاليهات وفنادق الساحل الشمالي والعلمين الجديدة.', en: 'North Coast chalets and New Alamein hotels.' }, 'shore'],
];

// [id, agency, dest, from, titleAr, titleEn, price, oldPrice, nights, daysFromNow, seats, features, photoIndex, featured]
const OFFERS = [
  ['o01', 'a1', 'mecca', 'cairo', 'عمرة رجب 15 يوم فندق 5 نجوم', 'Rajab Umrah — 15 days, 5★', 78500, 86000, 14, 35, 24, ['direct', 'h5', 'haram', 'visa', 'supervisor'], 0, 1],
  ['o02', 'a1', 'mecca', 'cairo', 'عمرة اقتصادية 10 أيام', 'Economy Umrah — 10 days', 46900, 52000, 9, 20, 40, ['flight', 'h3', 'visa', 'transfers'], 1, 0],
  ['o03', 'a5', 'mecca', 'giza', 'عمرة العائلات - شعبان', "Family Umrah — Sha'ban", 52500, null, 12, 60, 30, ['flight', 'h4', 'breakfast', 'supervisor'], 2, 1],
  ['o04', 'a5', 'mecca', 'giza', 'عمرة بري بالأتوبيس', 'Umrah by road', 32000, 36500, 13, 75, 45, ['bus', 'h3', 'visa'], 3, 0],
  ['o05', 'a5', 'mecca', 'giza', 'عمرة رمضان العشر الأواخر', 'Ramadan Umrah — last 10 nights', 96000, null, 11, 110, 20, ['flight', 'h5', 'haram', 'visa'], 4, 0],
  ['o06', 'a1', 'mecca', 'alex', 'عمرة من إسكندرية 12 يوم', 'Umrah from Alexandria — 12 days', 55800, 59900, 11, 48, 4, ['direct', 'h4', 'visa', 'transfers'], 0, 0],
  ['o07', 'a2', 'sharm', 'cairo', 'شرم الشيخ 5 ليالي شامل', 'Sharm — 5 nights all inclusive', 18900, 22500, 5, 14, 18, ['h5', 'allinc', 'transfers', 'pool'], 0, 1],
  ['o08', 'a2', 'hurghada', 'cairo', 'الغردقة - عرض الويك إند', 'Hurghada weekend deal', 9800, 11500, 3, 7, 26, ['h4', 'half', 'snorkel'], 0, 0],
  ['o09', 'a8', 'marsa', 'giza', 'مرسى علم غطس وسفاري', 'Marsa Alam diving & safari', 21400, null, 6, 28, 12, ['h5', 'diving', 'safari'], 0, 1],
  ['o10', 'a6', 'sokhna', 'alex', 'العين السخنة للعائلات', 'Ain Sokhna family break', 7900, 9200, 3, 10, 30, ['h4', 'half', 'kids'], 0, 0],
  ['o11', 'a6', 'alamein', 'alex', 'العلمين الجديدة 4 ليالي', 'New Alamein — 4 nights', 16500, 19000, 4, 40, 16, ['beachfront', 'allinc', 'transfers'], 0, 1],
  ['o12', 'a7', 'dahab', 'cairo', 'دهب ونويبع', 'Dahab & Nuweiba escape', 8600, null, 4, 18, 20, ['camp', 'snorkel', 'boat'], 0, 0],
  ['o13', 'a10', 'hurghada', 'mansoura', 'الغردقة لحظة أخيرة', 'Hurghada last-minute', 7400, 10200, 3, 4, 5, ['h4', 'allinc', 'bus'], 1, 0],
  ['o14', 'a10', 'sharm', 'mansoura', 'شرم بالأتوبيس 4 ليالي', 'Sharm by coach — 4 nights', 11900, 13800, 4, 9, 6, ['bus', 'h4', 'allinc'], 1, 0],
  ['o15', 'a8', 'marsa', 'giza', 'مرسى علم - منتجع هادي', 'Marsa Alam quiet resort', 24900, 27500, 5, 21, 10, ['h5', 'half', 'boat'], 1, 0],
  ['o16', 'a12', 'alamein', 'alex', 'فندق العلمين على البحر', 'Alamein beachfront hotel', 19900, 22000, 5, 55, 14, ['h5', 'beachfront', 'breakfast'], 1, 0],
  ['o17', 'a3', 'sahel', 'alex', 'شاليه 3 غرف - مراسي', '3-bed chalet — Marassi', 42000, 48000, 7, 45, 3, ['pool', 'beachfront', 'ac', 'parking'], 0, 1],
  ['o18', 'a3', 'alamein', 'alex', 'شقة غرفتين - العلمين', '2-bed apartment — Alamein', 19500, null, 7, 30, 5, ['ac', 'parking', 'wifi'], 1, 0],
  ['o19', 'a3', 'matrouh', 'alex', 'شاليه ستوديو - مطروح', 'Studio chalet — Matrouh', 11200, 13000, 7, 50, 6, ['seaview', 'ac'], 0, 0],
  ['o20', 'a6', 'gamasa', 'alex', 'شقة عائلية - جمصة', 'Family apartment — Gamasa', 6800, 7500, 7, 22, 8, ['ac', 'parking'], 0, 0],
  ['o21', 'a7', 'sudr', 'cairo', 'فيلا خاصة - رأس سدر', 'Private villa — Ras Sudr', 54000, 60000, 7, 33, 2, ['pool', 'bbq', 'seaview', 'parking'], 0, 0],
  ['o22', 'a2', 'gouna', 'cairo', 'شاليه لاجون - الجونة', 'Lagoon chalet — El Gouna', 38500, null, 5, 26, 4, ['pool', 'seaview', 'wifi'], 0, 0],
  ['o23', 'a12', 'sahel', 'alex', 'شاليه أرضي - سيدي عبدالرحمن', 'Ground-floor chalet — Sidi Abdel Rahman', 34500, 39000, 7, 62, 3, ['beachfront', 'ac', 'bbq'], 1, 0],
  ['o24', 'a12', 'gouna', 'alex', 'فيلا بحمام سباحة - الجونة', 'Pool villa — El Gouna', 46000, null, 7, 38, 7, ['seaview', 'pool', 'ac'], 1, 0],
  ['o25', 'a4', 'istanbul', 'cairo', 'إسطنبول وبورصة 7 ليالي', 'Istanbul & Bursa — 7 nights', 48900, 55000, 7, 25, 22, ['flight', 'h4', 'visa', 'guide'], 0, 1],
  ['o26', 'a4', 'dubai', 'cairo', 'دبي - المدينة والصحرا', 'Dubai — city & desert', 41500, 46000, 5, 15, 25, ['flight', 'h4', 'safari', 'tours'], 0, 1],
  ['o27', 'a4', 'georgia', 'cairo', 'جورجيا تبليسي وباتومي', 'Georgia — Tbilisi & Batumi', 52800, null, 7, 55, 14, ['flight', 'h4', 'tours'], 1, 0],
  ['o28', 'a7', 'malaysia', 'cairo', 'ماليزيا كوالالمبور ولنكاوي', 'Malaysia — KL & Langkawi', 69900, 76000, 9, 65, 18, ['flight', 'h4', 'tours', 'insurance'], 0, 0],
  ['o29', 'a7', 'maldives', 'cairo', 'المالديف - شهر العسل', 'Maldives honeymoon', 128000, 142000, 6, 80, 6, ['flight', 'allinc', 'boat'], 0, 1],
  ['o30', 'a11', 'europe', 'cairo', 'باريس وأمستردام', 'Paris & Amsterdam', 98500, null, 8, 90, 10, ['flight', 'h4', 'visa', 'tours'], 0, 0],
  ['o31', 'a11', 'istanbul', 'cairo', 'تركيا العائلية', 'Family Turkey', 57900, 62000, 8, 70, 12, ['flight', 'h4', 'guide', 'tours'], 2, 0],
  ['o32', 'a11', 'georgia', 'cairo', 'جورجيا الجبال - كازبيجي', 'Georgia mountains — Kazbegi', 61200, null, 6, 85, 9, ['flight', 'h4', 'hike', 'guide'], 0, 1],
  ['o33', 'a4', 'dubai', 'cairo', 'دبي ويك إند', 'Dubai weekend', 29900, 33500, 3, 12, 5, ['flight', 'h4'], 1, 0],
  ['o34', 'a9', 'catherine', 'cairo', 'طلوع جبل موسى والشروق', 'Mount Sinai sunrise climb', 4900, null, 2, 11, 25, ['bus', 'hike', 'guide', 'camp'], 0, 1],
  ['o35', 'a9', 'whitedesert', 'cairo', 'تخييم الصحرا البيضا والسودا', 'White & Black Desert camping', 6400, 7200, 2, 16, 18, ['safari', 'camp', 'bbq', 'guide'], 0, 1],
  ['o36', 'a9', 'siwa', 'cairo', 'سيوة 4 أيام', 'Siwa Oasis — 4 days', 9800, null, 3, 30, 16, ['bus', 'h3', 'safari', 'tours'], 0, 0],
  ['o37', 'a7', 'luxor', 'cairo', 'الأقصر وأسوان بالقطار', 'Luxor & Aswan by train', 13900, 15500, 4, 24, 20, ['h4', 'tours', 'guide', 'boat'], 0, 0],
  ['o38', 'a9', 'catherine', 'cairo', 'سانت كاترين ووادي الأربعين', 'St. Catherine & Wadi El Arbaein', 7200, null, 3, 42, 3, ['bus', 'hike', 'camp'], 1, 0],
  ['o39', 'a8', 'whitedesert', 'giza', 'سفاري الصحرا بالجمال', 'Desert camel safari', 3900, null, 1, 8, 15, ['safari', 'bbq', 'transfers'], 1, 0],
  ['o40', 'a2', 'sharm', 'cairo', 'شرم - رأس محمد بالمركب', 'Sharm — Ras Mohammed by boat', 21900, 24000, 5, 32, 11, ['h5', 'half', 'boat', 'snorkel'], 1, 0],
];

const NAMES = ['أحمد سمير', 'منى عادل', 'كريم فتحي', 'سارة محمود', 'محمد طارق', 'نهى إبراهيم', 'يوسف علي', 'هبة سامي', 'عمر خالد', 'رنا مصطفى', 'مصطفى حسن', 'ياسمين أشرف', 'Omar Nabil', 'Laila Hany', 'خالد عبدالله', 'إيمان سعيد', 'شريف رأفت', 'دينا وليد', 'Ahmed Fawzy', 'نورهان جمال'];

/* Demo pending verification requests (fictional license images drawn as SVG). */
const licenseSvg = (name, no) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420"><rect width="640" height="420" rx="18" fill="#FBF5E6" stroke="#C9922E" stroke-width="6"/><text x="320" y="80" font-family="Arial" font-size="30" font-weight="700" fill="#0E3B5A" text-anchor="middle">TOURISM COMPANY LICENSE</text><text x="320" y="118" font-family="Arial" font-size="18" fill="#7D909D" text-anchor="middle">DEMO DOCUMENT — NOT REAL</text><text x="60" y="200" font-family="Arial" font-size="22" fill="#0F2A3D">Company: ${name}</text><text x="60" y="250" font-family="Arial" font-size="22" fill="#0F2A3D">License No: ${no}</text><text x="60" y="300" font-family="Arial" font-size="22" fill="#0F2A3D">Category: A</text><circle cx="520" cy="320" r="56" fill="none" stroke="#C9922E" stroke-width="5"/><text x="520" y="328" font-family="Arial" font-size="18" fill="#C9922E" text-anchor="middle">STAMP</text></svg>`);
export const DEMO_VERIFICATIONS = {
  a10: () => ({ status: 'pending', licenseNo: 'C-5210', licenseImg: licenseSvg('Mawj Holidays', 'C-5210'), submittedAt: Date.now() - 2 * 864e5 }),
  a8: () => ({ status: 'pending', licenseNo: 'B-4471', licenseImg: licenseSvg('Marsa Trips', 'B-4471'), submittedAt: Date.now() - 5 * 36e5 }),
};

/* Demo plans per agency (others are on Free). */
export const DEMO_PLANS = { a1: 'premium', a2: 'pro', a4: 'pro', a5: 'pro', a9: 'pro' };

/* Deterministic demo reply time in hours for an answered request (fast agencies answer quicker). */
const FAST = ['a1', 'a2', 'a5', 'a9'];
export function demoReplyHours(id, agencyId) {
  const h = [...String(id)].reduce((s, c) => (s * 31 + c.charCodeAt(0)) % 9973, 7);
  return FAST.includes(agencyId) ? 1 + (h % 6) : 6 + (h % 34);
}

/* Demo flash deals: hours from now until the discount ends. */
const DEMO_FLASH = { o07: 55, o14: 19 };

/* Demo Umrah details (fictional hotels and distances, like all demo data). */
const U = (hotelMakkah, hotelMadinah, distanceHaram, distanceNabawi, nightsMakkah, nightsMadinah, flight, airline) =>
  ({ hotelMakkah, hotelMadinah, distanceHaram, distanceNabawi, nightsMakkah, nightsMadinah, flight, airline });
const DEMO_UMRAH = {
  o01: U('Noor Al Haram Grand', 'Rawdat Al Nour Suites', 150, 200, 9, 5, 'direct', 'EgyptAir'),
  o02: U('Al Sakeena Residence', 'Taiba Garden Inn', 1200, 900, 4, 5, 'transit', 'flynas'),
  o03: U('Zamzam Pearl Hotel', 'Al Ansar Plaza', 600, 450, 6, 6, 'direct', 'Saudia'),
  o04: U('Ajyad Family Inn', 'Quba Road Hotel', 1500, 1100, 5, 8, 'road', ''),
  o05: U('Safa Tower Makkah', 'Al Rawda Palace', 100, 250, 8, 3, 'direct', 'EgyptAir'),
  o06: U('Al Masfalah Suites', 'Sultana Court', 500, 350, 7, 4, 'direct', 'EgyptAir'),
};

/* Demo room / child prices and extras (fictional, like all demo data). Chalets keep the base price only. */
const r100 = (n) => Math.round(n / 100) * 100;
const X = (id, ar, en, price, per = 'person') => ({ id, name: { ar, en }, price, per });
function demoPricing(cat, p, oid) {
  if (cat === 'stays') return null;
  const base = {
    umrah: { single: 1.35, triple: 0.92, quad: 0.86, child: 0.7, infant: 0.15, extras: [X(`${oid}-x1`, 'رحلة الطائف', 'Taif day trip', 1800)] },
    beach: { single: 1.3, triple: 0.9, child: 0.5, infant: 0, extras: [X(`${oid}-x1`, 'رحلة سنوركل بالمركب', 'Snorkeling boat trip', 900), X(`${oid}-x2`, 'توصيل من وإلى المطار', 'Airport transfer', 600, 'booking')] },
    abroad: { single: 1.25, triple: 0.93, child: 0.75, infant: 0.1, extras: [X(`${oid}-x1`, 'تأمين سفر', 'Travel insurance', 500), X(`${oid}-x2`, 'جولة في المدينة', 'City tour', 1200)] },
    adventure: { child: 0.7, infant: 0, extras: [X(`${oid}-x1`, 'إيجار سليبنج باج', 'Sleeping bag rental', 150)] },
  }[cat];
  if (!base) return null;
  const rooms = Object.fromEntries(['single', 'triple', 'quad'].filter((k) => base[k]).map((k) => [k, r100(p * base[k])]));
  return { rooms, child: r100(p * base.child), infant: r100(p * base.infant), extras: base.extras };
}

export function buildSeed() {
  const now = Date.now(), day = 864e5;
  let s = 42;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;

  const agencies = AGENCIES.map(([id, name, tagline, color, city, rating, reviews, verified, since, license, desc, login]) => {
    const n = String(10000000 + Number(id.slice(1)) * 1234567).slice(0, 8);
    return { id, name, tagline, color, city, rating, reviews, verified, since, license, desc, active: true, plan: DEMO_PLANS[id] || 'free', ...(!verified && DEMO_VERIFICATIONS[id] ? { verification: DEMO_VERIFICATIONS[id]() } : {}), phone: '010' + n, whatsapp: '2010' + n, email: `info@${login}-demo.com`, createdAt: now - (2026 - since) * 9 * day, login };
  });

  const offers = OFFERS.map(([id, agencyId, dest, from, ar, en, price, oldPrice, nights, d, seats, features, pi, featured], i) => {
    const photos = DESTS[dest].photos;
    return {
      id, agencyId, category: DESTS[dest].cat, dest, from, title: { ar, en }, price, oldPrice, nights, seats, features,
      date: new Date(now + d * day).toISOString().slice(0, 10),
      img: `px:${photos[pi % photos.length]}`, featured: !!featured, active: true,
      views: Math.round(120 + rnd() * 900), createdAt: now - (45 - i) * day,
      pricing: demoPricing(DESTS[dest].cat, price, id),
      ...(DEMO_UMRAH[id] ? { umrah: DEMO_UMRAH[id] } : {}),
      ...(DEMO_FLASH[id] ? { flashEndsAt: new Date(now + DEMO_FLASH[id] * 36e5).toISOString() } : {}),
    };
  });

  const statuses = ['new', 'new', 'new', 'contacted', 'contacted', 'closed'];
  const inquiries = [];
  for (let i = 0; i < 64; i++) {
    const o = offers[Math.floor(Math.pow(rnd(), 1.4) * offers.length)];
    const age = Math.pow(rnd(), 1.3) * 29.5;
    inquiries.push({
      id: 'q' + String(i + 1).padStart(3, '0'), offerId: o.id, agencyId: o.agencyId,
      name: NAMES[Math.floor(rnd() * NAMES.length)],
      phone: '01' + ['0', '1', '2', '5'][Math.floor(rnd() * 4)] + String(Math.floor(10000000 + rnd() * 89999999)),
      people: 1 + Math.floor(rnd() * 5), note: rnd() > 0.7 ? 'محتاج أعرف تفاصيل أكتر عن الإقامة' : '',
      status: age < 3 ? 'new' : statuses[Math.floor(rnd() * statuses.length)], createdAt: Math.round(now - age * day),
    });
  }

  const accounts = [{ id: 'admin', role: 'admin', email: 'mahmoudhussien200111@gmail.com', pass: 'Admin@2026' }]
    .concat(agencies.map((a) => ({ id: a.id, role: 'agency', agencyId: a.id, email: `${a.login}@demo.com`, pass: 'Demo@123' })));
  agencies.forEach((a) => delete a.login);

  inquiries.forEach((q) => { if (q.status !== 'new') q.contactedAt = Math.min(now, q.createdAt + demoReplyHours(q.id, q.agencyId) * 36e5); });

  // Demo waiting-list entries (fictional): some still waiting, one already triggered by a price drop.
  const byId = Object.fromEntries(offers.map((o) => [o.id, o]));
  const AL = [
    ['al1', 'o07', 'منى عادل', '201001234567', ['price'], 'ar', 0, 2],
    ['al2', 'o07', 'Omar Nabil', '201112345678', ['price', 'seats'], 'en', 0, 5],
    ['al3', 'o40', 'كريم فتحي', '201223456789', ['price'], 'ar', 2500, 9],
    ['al4', 'o25', 'Laila Hany', '201554567890', ['seats'], 'en', 0, 4],
    ['al5', 'o01', 'إيمان سعيد', '201065678901', ['price'], 'ar', 0, 1],
  ];
  const alerts = AL.filter(([, oid]) => byId[oid]).map(([id, oid, name, whatsapp, kinds, lang, dropped, ago]) => {
    const o = byId[oid];
    const base = { id, offerId: oid, agencyId: o.agencyId, name, whatsapp, kinds, lang, priceAtSignup: o.price + dropped, seatsAtSignup: o.seats, createdAt: now - ago * day };
    return dropped ? { ...base, status: 'ready', reason: 'price', readyPrice: o.price, readyAt: now - day } : { ...base, status: 'waiting' };
  });

  return { agencies, offers, inquiries, accounts, alerts };
}
