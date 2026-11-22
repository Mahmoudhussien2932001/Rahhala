/*
  Visa rules for the Guides "trip finder".
  For each traveler nationality (Arab League countries) and each guide destination,
  BASE gives the rule for an ordinary passport. HELD_RULES upgrades it when the traveler
  holds a qualifying visa / residence permit from another country.

  Sources (checked Nov 2026): mfa.am visa-free list (updated 02.02.2024), Georgian
  Government Ordinance No 256, and the Wikipedia "Visa policy of Georgia / Armenia / Egypt"
  pages (edited Oct–Nov 2026). Where sources disagree, the entry has verify: true and the
  site tells the traveler to confirm. Unclear cases use status 'check'.
  Re-check this file before every season — visa rules change often.
*/

// Better status = smaller rank.
export const STATUS_RANK = { home: 0, free: 1, voa: 2, evisa: 3, check: 4, embassy: 5 };
export const EASY = ['home', 'free', 'voa', 'evisa'];

export const STATUS_LABEL = {
  home: { ar: 'بلدك', en: 'Your country' },
  free: { ar: 'من غير تأشيرة', en: 'Visa-free' },
  voa: { ar: 'تأشيرة في المطار', en: 'Visa on arrival' },
  evisa: { ar: 'تأشيرة إلكترونية أونلاين', en: 'e-Visa online' },
  check: { ar: 'محتاج تتأكد', en: 'Needs checking' },
  embassy: { ar: 'تأشيرة من السفارة', en: 'Embassy visa' },
};

export const NATIONALITIES = [
  ['eg', 'مصر', 'Egypt'], ['sa', 'السعودية', 'Saudi Arabia'], ['ae', 'الإمارات', 'UAE'], ['kw', 'الكويت', 'Kuwait'],
  ['qa', 'قطر', 'Qatar'], ['bh', 'البحرين', 'Bahrain'], ['om', 'عُمان', 'Oman'], ['jo', 'الأردن', 'Jordan'],
  ['lb', 'لبنان', 'Lebanon'], ['sy', 'سوريا', 'Syria'], ['iq', 'العراق', 'Iraq'], ['ps', 'فلسطين', 'Palestine'],
  ['ye', 'اليمن', 'Yemen'], ['ly', 'ليبيا', 'Libya'], ['tn', 'تونس', 'Tunisia'], ['dz', 'الجزائر', 'Algeria'],
  ['ma', 'المغرب', 'Morocco'], ['sd', 'السودان', 'Sudan'], ['mr', 'موريتانيا', 'Mauritania'], ['so', 'الصومال', 'Somalia'],
  ['dj', 'جيبوتي', 'Djibouti'], ['km', 'جزر القمر', 'Comoros'],
].map(([code, ar, en]) => ({ code, ar, en }));

export const HELD = [
  { k: 'us', ar: 'تأشيرة أمريكا سارية', en: 'Valid US visa' },
  { k: 'uk', ar: 'تأشيرة بريطانيا سارية', en: 'Valid UK visa' },
  { k: 'schengen', ar: 'تأشيرة شنغن سارية', en: 'Valid Schengen visa' },
  { k: 'euRes', ar: 'إقامة في دولة أوروبية (شنغن)', en: 'Residence in a Schengen / EU country' },
  { k: 'usukRes', ar: 'إقامة في أمريكا أو بريطانيا', en: 'Residence in the US or UK' },
  { k: 'gcc', ar: 'إقامة في دولة خليجية', en: 'Gulf (GCC) residence permit' },
];

const GCC = ['sa', 'ae', 'kw', 'qa', 'bh', 'om'];
const ALL = NATIONALITIES.map((x) => x.code);
const ANY_HELD = ['us', 'uk', 'schengen', 'euRes', 'usukRes', 'gcc'];
const SCHENGEN_BASE = () => ({
  ...Object.fromEntries(ALL.map((c) => [c, r('embassy')])),
  ae: r('free', { stay: { ar: '90 يوم في أي 180 يوم', en: '90 days in any 180' } }),
});
const r = (status, extra = {}) => ({ status, ...extra });
const n = (ar, en) => ({ ar, en });

const BASE = {
  georgia: {
    ...Object.fromEntries([...GCC, 'jo', 'lb'].map((c) => [c, r('free', { stay: n('لحد سنة', 'up to 1 year') })])),
    eg: r('evisa'), dj: r('evisa'), km: r('evisa'),
    iq: r('check', { note: n('الدخول من غير تأشيرة للعراقيين اتلغى من 2014.', 'Visa-free entry for Iraqis was cancelled in 2014.') }),
  },
  armenia: {
    ae: r('free', { stay: n('لحد 180 يوم', 'up to 180 days') }),
    qa: r('free', { stay: n('لحد 180 يوم', 'up to 180 days') }),
    ...Object.fromEntries(['sa', 'kw', 'bh', 'om'].map((c) => [c, r('free', { stay: n('لحد 180 يوم', 'up to 180 days'), verify: true, note: n('المصادر مختلفة في القاعدة دي — اتأكد من موقع الخارجية الأرمينية.', 'Sources disagree on this rule — confirm on the Armenian MFA site.') })])),
    jo: r('voa', { stay: n('لحد 120 يوم', 'up to 120 days') }),
    ...Object.fromEntries(['eg', 'lb', 'iq', 'tn', 'dz', 'ma'].map((c) => [c, r('evisa', { verify: c !== 'eg' })])),
    ...Object.fromEntries(['sy', 'ps', 'ye', 'sd'].map((c) => [c, r('embassy')])),
  },
  egypt: {
    eg: r('home'),
    ...Object.fromEntries(GCC.map((c) => [c, r('free', { stay: n('لحد 6 شهور', 'up to 6 months') })])),
    jo: r('free', { stay: n('لحد 3 شهور', 'up to 3 months'), note: n('بجواز عادي صلاحيته 5 سنين.', 'With a regular 5-year passport.') }),
    lb: r('check', { note: n('اللي أقل من 16 أو أكبر من 50 سنة بيدخلوا من غير تأشيرة 30 يوم.', 'Under 16s and over 50s enter visa-free for 30 days.') }),
    ly: r('embassy', { note: n('الستات، والرجالة أقل من 18 أو أكبر من 45، بيدخلوا من غير تأشيرة.', 'Women, and men under 18 or over 45, enter visa-free.') }),
    ...Object.fromEntries(['tn', 'dz', 'ma'].map((c) => [c, r('embassy', { note: n('الأطفال أقل من 14 سنة من غير تأشيرة، والمجموعات عن طريق شركة سياحة ليها إجراءات أسهل.', 'Children under 14 are visa-free; organised groups through a travel agency have an easier route.') })])),
    iq: r('evisa', { verify: true, note: n('للسياحة من سن 16 لـ 60.', 'For tourists aged 16–60.') }),
    ...Object.fromEntries(['sy', 'sd', 'ye', 'ps'].map((c) => [c, r('embassy', { note: n('محتاجة موافقة أمنية مسبقة.', 'Requires prior security approval.') })])),
  },
  italy: SCHENGEN_BASE(),
  switzerland: SCHENGEN_BASE(),
  morocco: {
    ma: r('home'),
    ...Object.fromEntries([...GCC, 'tn'].map((c) => [c, r('free', { stay: n('لحد 90 يوم', 'up to 90 days') })])),
    dz: r('free', { stay: n('لحد 90 يوم', 'up to 90 days'), verify: true, note: n('في فحص إضافي عند الدخول أحياناً — اتأكد قبل السفر.', 'Extra checks at entry are sometimes reported — confirm before travel.') }),
    jo: r('evisa', { verify: true }),
    eg: r('embassy', { verify: true, note: n('لو معاك تأشيرة أو إقامة من أمريكا أو بريطانيا أو شنغن تقدر تطلع تأشيرة إلكترونية بدل السفارة.', 'With a US, UK or Schengen visa or residence you can use the e-Visa instead of the embassy.') }),
    ...Object.fromEntries(['sy', 'ps'].map((c) => [c, r('embassy')])),
    ly: r('check', { note: n('الإعفاء من التأشيرة لليبيين اتلغى في 2014.', 'Visa exemption for Libyans was cancelled in 2014.') }),
  },
  kenya: {
    ...Object.fromEntries(ALL.map((c) => [c, r('evisa', { note: n('تصريح سفر إلكتروني (eTA) — قدّم قبل السفر بـ 3 أيام على الأقل.', 'Electronic Travel Authorisation (eTA) — apply at least 3 days before travel.') })])),
    ...Object.fromEntries(['eg', 'dz', 'dj', 'mr', 'ma', 'sd'].map((c) => [c, r('free', { stay: n('لحد 60 يوم', 'up to 60 days') })])),
    km: r('free', { stay: n('لحد 90 يوم', 'up to 90 days') }),
    tn: r('free', { verify: true, note: n('أغلب الجنسيات الأفريقية معفية من التصريح — اتأكد من موقع eTA.', 'Most African nationals are eTA-exempt — confirm on the eTA site.') }),
  },
};

// Holding these visas / permits improves the rule (only if it beats the base rule).
const HELD_RULES = {
  georgia: {
    keys: ANY_HELD,
    result: r('free', {
      stay: n('90 يوم في أي 180 يوم', '90 days in any 180'),
      via: true,
      note: n('التأشيرة أو الإقامة لازم تكون سارية يوم الدخول. الإقامة الإماراتية مذكورة في القائمة الرسمية؛ باقي دول الخليج اتأكد منها.', 'The visa or permit must be valid on the day you enter. UAE residence is on the official list; confirm other Gulf permits.'),
    }),
  },
  armenia: {
    keys: ANY_HELD,
    result: r('voa', {
      via: true, verify: true,
      note: n('بتطلع التأشيرة في المطار. أصحاب إقامات الخليج (صالحة 6 شهور على الأقل) ممكن يدخلوا من غير تأشيرة لحد يوليو 2027 — اتأكد قبل السفر.', 'You get the visa at the airport. Gulf residence holders (valid 6+ months) may enter visa-free until July 2027 — confirm before travel.'),
    }),
  },
  egypt: {
    keys: ANY_HELD,
    exclude: ['ps', 'sd', 'sy'],
    result: r('voa', {
      stay: n('لحد 30 يوم', 'up to 30 days'),
      via: true,
      note: n('التأشيرة لازم تكون مستخدمة قبل كده، والإقامة صالحة 6 شهور على الأقل. خلي معاك تذكرة رجوع وحجز فندق.', 'The visa must have been used before, and the permit valid for 6+ months. Carry a return ticket and hotel booking.'),
    }),
  },
  ...Object.fromEntries(['italy', 'switzerland'].map((d) => [d, {
    keys: ['schengen', 'euRes'],
    result: r('free', {
      stay: n('90 يوم في أي 180 يوم', '90 days in any 180'),
      via: true,
      note: n('تأشيرة الشنغن لازم تكون سارية ومتعددة الدخول (أو لسه ما استخدمتهاش)، والإقامة الأوروبية سارية.', 'Your Schengen visa must be valid and multiple-entry (or still unused), or your EU residence permit valid.'),
    }),
  }])),
  morocco: {
    keys: ANY_HELD,
    exclude: ['sy', 'ps'],
    result: r('evisa', {
      via: true,
      note: n('التأشيرة لازم تكون ملزوقة في الجواز أو كارت إقامة. من الخليج: الإقامة الإماراتية بس.', 'The visa must be stamped in your passport, or a residence card. From the Gulf: UAE residence only.'),
    }),
  },
};

// Older saved answers used one combined "west" residence option.
const normalize = (held) => held.flatMap((h) => (h === 'west' ? ['usukRes'] : [h]));

export function visaFor(nat, held = [], dest) {
  const base = BASE[dest]?.[nat] || r('check');
  const rule = HELD_RULES[dest];
  if (rule && !rule.exclude?.includes(nat) && normalize(held).some((h) => rule.keys.includes(h))) {
    if (STATUS_RANK[rule.result.status] < STATUS_RANK[base.status]) return rule.result;
  }
  return base;
}

export const OFFICIAL = {
  georgia: { evisa: 'https://www.evisa.gov.ge', info: 'https://www.geoconsul.gov.ge' },
  armenia: { evisa: 'https://evisa.mfa.am', info: 'https://www.mfa.am/en/whoneedvisa' },
  egypt: { evisa: 'https://visa2egypt.gov.eg', info: 'https://visa2egypt.gov.eg' },
  italy: { evisa: 'https://vistoperitalia.esteri.it', info: 'https://vistoperitalia.esteri.it' },
  switzerland: { evisa: 'https://www.sem.admin.ch', info: 'https://www.sem.admin.ch' },
  morocco: { evisa: 'https://www.acces-maroc.ma', info: 'https://www.acces-maroc.ma' },
  kenya: { evisa: 'https://www.etakenya.go.ke', info: 'https://www.etakenya.go.ke' },
};
const SCHENGEN_DESTS = ['italy', 'switzerland'];

const docsFor = (dest) => DOCS.map((d, i) => {
  if (i !== 4) return d;
  if (dest === 'georgia') return d;
  if (SCHENGEN_DESTS.includes(dest)) return n('تأمين سفر طبي بتغطية 30 ألف يورو على الأقل (إجباري للشنغن)', 'Travel medical insurance covering at least €30,000 (required for Schengen)');
  if (dest === 'kenya') return n('تأمين صحي للسفر، وشهادة الحمى الصفرا لو جاي من بلد فيها المرض', 'Travel insurance, plus a yellow fever certificate if arriving from an endemic country');
  return n('تأمين صحي للسفر (مُستحسن)', 'Travel medical insurance (recommended)');
});

const DOCS = [
  n('جواز سفر صالح 6 شهور على الأقل بعد تاريخ الرجوع', 'Passport valid for at least 6 months after your return date'),
  n('صورة شخصية حديثة بخلفية بيضا', 'A recent passport photo on a white background'),
  n('حجز فندق وتذكرة طيران ذهاب وعودة', 'Hotel booking and a return flight ticket'),
  n('كشف حساب بنكي آخر 3–6 شهور', 'Bank statement for the last 3–6 months'),
  n('تأمين صحي للسفر (إجباري لجورجيا من 2026)', 'Travel medical insurance (mandatory for Georgia since 2026)'),
  n('خطاب من جهة العمل أو ما يثبت مصدر دخلك', 'An employment letter or proof of income'),
];

/* Step-by-step "how to get it" content for a status + destination. */
export function visaSteps(status, dest) {
  const o = OFFICIAL[dest];
  if (status === 'evisa') {
    const fees = {
      armenia: n('الرسوم حوالي 7 يورو (21 يوم) أو 34 يورو (120 يوم). قدّم قبل السفر بـ 3 أيام عمل على الأقل.', 'About €7 (21 days) or €34 (120 days). Apply at least 3 working days before travel.'),
      egypt: n('الرسوم حوالي 25 دولار للدخول مرة واحدة.', 'About $25 for a single entry.'),
      georgia: n('الرسوم بتتدفع أونلاين، وقدّم قبل السفر بأسبوع على الأقل.', 'Pay the fee online, and apply at least a week before you travel.'),
      kenya: n('الرسوم 32.5 دولار للدخول مرة واحدة. قدّم قبل السفر بـ 3 أيام على الأقل (ولحد 90 يوم قبلها)، وجهّز حجز الفندق.', '$32.50 for a single entry. Apply at least 3 days (and up to 90 days) before travel, with your hotel booking ready.'),
      morocco: n('الرسوم بتتدفع أونلاين. قدّم بدري، والتأشيرة أو الإقامة اللي معاك لازم تكون سارية.', 'Pay the fee online. Apply early, and the visa or permit you hold must be valid.'),
    }[dest];
    return {
      link: o.evisa,
      steps: [
        n('ادخل على موقع التأشيرة الإلكترونية الرسمي (اللينك تحت).', 'Go to the official e-Visa site (link below).'),
        n('املا البيانات وارفع صورة الجواز وصورتك الشخصية.', 'Fill in the form and upload your passport scan and photo.'),
        n('ارفع حجز الفندق وتذكرة الطيران والتأمين لو مطلوبين.', 'Upload your hotel booking, flight ticket and insurance if asked.'),
        n('ادفع الرسوم بالفيزا.', 'Pay the fee by card.'),
        n('هتوصلك التأشيرة على الإيميل — اطبعها وخدها معاك.', 'The visa arrives by email — print it and carry it with you.'),
      ],
      fees,
      docs: docsFor(dest).slice(0, 5),
    };
  }
  if (status === 'voa') {
    return {
      link: o.info,
      steps: [
        n('مش محتاج تقدّم قبل السفر.', 'No need to apply before you travel.'),
        n('في المطار روح شباك التأشيرات قبل الجوازات.', 'At the airport, go to the visa desk before passport control.'),
        n('ادفع الرسوم (خلي معاك كاش بالدولار أو اليورو).', 'Pay the fee (carry some cash in USD or EUR).'),
        n('اعرض الجواز والتأشيرة أو الإقامة اللي معاك وحجز الفندق.', 'Show your passport, the visa/permit you hold and your hotel booking.'),
      ],
      docs: [0, 2, 4].map((i) => docsFor(dest)[i]),
    };
  }
  if (status === 'embassy') {
    return {
      link: o.info,
      steps: [
        n('كلّم سفارة أو قنصلية البلد في بلدك واعرف المواعيد والمستندات المطلوبة.', 'Contact the country\'s embassy or consulate in your country for appointments and the document list.'),
        n('جهّز المستندات (القائمة تحت) وترجمها لو مطلوب.', 'Prepare the documents (list below) and translate them if required.'),
        n('احجز ميعاد وقدّم الطلب وادفع الرسوم.', 'Book an appointment, submit the application and pay the fee.'),
        n('استنى الرد — غالباً من أسبوع لـ 4 أسابيع، فقدّم بدري.', 'Wait for the decision — usually 1–4 weeks, so apply early.'),
        n('ما تحجزش طيران غير قابل للاسترداد قبل ما التأشيرة تطلع.', "Don't buy non-refundable flights until the visa is issued."),
      ],
      tip: n('شركات السياحة في رحّالة ممكن تساعدك في ملف التأشيرة مع حجز الرحلة.', 'Agencies on Rahhala can often handle the visa file with your trip booking.'),
      fees: SCHENGEN_DESTS.includes(dest)
        ? n('تأشيرة شنغن: الرسوم حوالي 90 يورو للكبار، وبتقدّم من مركز التأشيرات المعتمد (زي VFS أو TLS). قدّم قبل السفر بـ 15 يوم على الأقل ولحد 6 شهور، والرد عادةً خلال 15 يوم.', 'Schengen visa: about €90 for adults, submitted at the authorised visa centre (e.g. VFS or TLS). Apply at least 15 days and up to 6 months before travel; decisions usually take about 15 days.')
        : null,
      docs: docsFor(dest),
    };
  }
  return {
    link: o.info,
    steps: [
      n('القاعدة لجنسيتك مش واضحة في المصادر الرسمية اللي راجعناها.', "We couldn't confirm the rule for your nationality from official sources."),
      n('ادخل على الموقع الرسمي (اللينك تحت) وشوف وضع جنسيتك.', 'Check your nationality on the official site (link below).'),
      n('أو كلّم سفارة البلد في بلدك — هيقولولك محتاج إيه بالظبط.', 'Or contact the embassy in your country — they will tell you exactly what you need.'),
      n('جهّز المستندات الأساسية من دلوقتي عشان توفّر وقت.', 'Prepare the basic documents now to save time.'),
    ],
    docs: docsFor(dest),
  };
}
