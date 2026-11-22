/*
  "Where to?" split used by the welcome chooser and the Destinations page.
  Each group lists catalog destinations (dest: key in DESTS → has offers) and/or
  travel guides (guide: key in GUIDES). A card can have both.
*/

export const SCOPES = {
  egypt: {
    name: { ar: 'جوّه مصر', en: 'Within Egypt' },
    sub: { ar: 'بحر، جبل، صحرا، ونيل — كل السفريات الداخلية', en: 'Sea, mountains, desert and the Nile — every trip at home' },
    photo: 'px:29095916',
  },
  abroad: {
    name: { ar: 'برّه مصر', en: 'Abroad' },
    sub: { ar: 'عمرة، أوروبا، آسيا، أفريقيا والقوقاز', en: 'Umrah, Europe, Asia, Africa and the Caucasus' },
    photo: 'px:37433103',
  },
};

export const GROUPS = {
  egypt: [
    { icon: 'wave', name: { ar: 'البحر الأحمر', en: 'The Red Sea' }, sub: { ar: 'شعاب مرجانية وغطس وشمس طول السنة', en: 'Coral reefs, diving and year-round sun' },
      items: [{ dest: 'sharm' }, { dest: 'hurghada' }, { dest: 'marsa' }, { dest: 'dahab' }, { dest: 'gouna' }, { dest: 'sokhna' }] },
    { icon: 'sun', name: { ar: 'الساحل الشمالي والمتوسط', en: 'North Coast & the Mediterranean' }, sub: { ar: 'مصايف الصيف والشاليهات', en: 'Summer beaches and chalets' },
      items: [{ dest: 'alamein' }, { dest: 'sahel' }, { dest: 'matrouh' }, { dest: 'gamasa' }] },
    { icon: 'mount', name: { ar: 'سينا والجبال', en: 'Sinai & the mountains' }, sub: { ar: 'طلوع الجبل، تخييم، وهدوء', en: 'Mountain hikes, camping and calm' },
      items: [{ dest: 'catherine' }, { dest: 'sudr' }] },
    { icon: 'compass', name: { ar: 'الصحرا والواحات', en: 'Desert & oases' }, sub: { ar: 'سفاري، نجوم، وبحيرات ملح', en: 'Safaris, starry nights and salt lakes' },
      items: [{ dest: 'siwa' }, { dest: 'whitedesert' }] },
    { icon: 'book', name: { ar: 'النيل والتاريخ', en: 'The Nile & history' }, sub: { ar: 'الأهرامات والأقصر وأسوان', en: 'The Pyramids, Luxor and Aswan' },
      items: [{ guide: 'egypt' }, { dest: 'luxor' }] },
  ],
  abroad: [
    { icon: 'moon', name: { ar: 'العمرة', en: 'Umrah' }, sub: { ar: 'مكة والمدينة', en: 'Makkah & Madinah' },
      items: [{ dest: 'mecca' }] },
    { icon: 'plane', name: { ar: 'الخليج وتركيا', en: 'The Gulf & Turkey' }, sub: { ar: 'قريبة وسهلة', en: 'Close and easy' },
      items: [{ dest: 'dubai' }, { dest: 'istanbul' }] },
    { icon: 'mount', name: { ar: 'القوقاز', en: 'The Caucasus' }, sub: { ar: 'جبال وطبيعة وأسعار حلوة', en: 'Mountains, nature and good prices' },
      items: [{ dest: 'georgia', guide: 'georgia' }, { guide: 'armenia' }] },
    { icon: 'bld', name: { ar: 'أوروبا', en: 'Europe' }, sub: { ar: 'تأشيرة شنغن ورحلة العمر', en: 'A Schengen visa and the trip of a lifetime' },
      items: [{ guide: 'italy' }, { guide: 'switzerland' }, { dest: 'europe' }] },
    { icon: 'wave', name: { ar: 'آسيا والجزر', en: 'Asia & islands' }, sub: { ar: 'طبيعة استوائية وبحر', en: 'Tropical nature and sea' },
      items: [{ dest: 'malaysia' }, { dest: 'maldives' }] },
    { icon: 'compass', name: { ar: 'أفريقيا', en: 'Africa' }, sub: { ar: 'سفاري وصحرا وأسواق', en: 'Safaris, desert and souks' },
      items: [{ guide: 'morocco' }, { guide: 'kenya' }] },
  ],
};
