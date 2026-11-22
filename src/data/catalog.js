/* Catalogs — trip types, cities, destinations (with real Pexels photos), features */

export const CATS = {
  umrah:     { ar: 'عمرة',         en: 'Umrah',              color: '#C9922E', photo: 'px:35564654', sub: { ar: 'برامج العمرة من القاهرة والإسكندرية', en: 'Umrah programs from Cairo & Alexandria' } },
  beach:     { ar: 'مصايف',        en: 'Beach Holidays',     color: '#0E9E94', photo: 'px:22643850', sub: { ar: 'شرم والغردقة ومرسى علم والعلمين', en: 'Sharm, Hurghada, Marsa Alam & Alamein' } },
  stays:     { ar: 'شقق وشاليهات', en: 'Chalets & Stays',    color: '#E8693A', photo: 'px:24807132', sub: { ar: 'إيجار بالأسبوع في الساحل وغيره', en: 'Weekly rentals on the coast & beyond' } },
  abroad:    { ar: 'سفر للخارج',   en: 'Abroad',             color: '#3A69AD', photo: 'px:7529416',  sub: { ar: 'تركيا ودبي وأوروبا وآسيا', en: 'Turkey, Dubai, Europe & Asia' } },
  adventure: { ar: 'سفاري وجبال',  en: 'Safari & Mountains', color: '#8A6440', photo: 'px:29747818', sub: { ar: 'سانت كاترين وسيوة والصحرا البيضا', en: 'St. Catherine, Siwa & the White Desert' } },
};

export const CITIES = {
  cairo: { ar: 'القاهرة', en: 'Cairo' },
  giza: { ar: 'الجيزة', en: 'Giza' },
  alex: { ar: 'الإسكندرية', en: 'Alexandria' },
  mansoura: { ar: 'المنصورة', en: 'Mansoura' },
};

// best = good months (1–12). photos = Pexels ids (first one is the cover).
export const DESTS = {
  mecca:       { ar: 'مكة والمدينة',   en: 'Makkah & Madinah', cat: 'umrah',     country: { ar: 'السعودية', en: 'Saudi Arabia' }, best: [10, 11, 12, 1, 2, 3], photos: [35564654, 12777419, 2895295, 30273249, 16012748] },
  sharm:       { ar: 'شرم الشيخ',      en: 'Sharm El Sheikh',  cat: 'beach',     country: { ar: 'مصر', en: 'Egypt' }, best: [3, 4, 5, 10, 11], photos: [18886592, 22643850] },
  hurghada:    { ar: 'الغردقة',        en: 'Hurghada',         cat: 'beach',     country: { ar: 'مصر', en: 'Egypt' }, best: [3, 4, 5, 9, 10, 11], photos: [22643850, 18886592] },
  marsa:       { ar: 'مرسى علم',       en: 'Marsa Alam',       cat: 'beach',     country: { ar: 'مصر', en: 'Egypt' }, best: [3, 4, 10, 11, 12], photos: [13010781, 22643850] },
  dahab:       { ar: 'دهب',            en: 'Dahab',            cat: 'beach',     country: { ar: 'مصر', en: 'Egypt' }, best: [3, 4, 5, 9, 10], photos: [27430541, 29747818] },
  sokhna:      { ar: 'العين السخنة',   en: 'Ain Sokhna',       cat: 'beach',     country: { ar: 'مصر', en: 'Egypt' }, best: [4, 5, 6, 9, 10], photos: [1268871, 24807132] },
  alamein:     { ar: 'العلمين',        en: 'El Alamein',       cat: 'beach',     country: { ar: 'مصر', en: 'Egypt' }, best: [6, 7, 8, 9], photos: [10832155, 2476632] },
  sahel:       { ar: 'الساحل الشمالي', en: 'North Coast',      cat: 'stays',     country: { ar: 'مصر', en: 'Egypt' }, best: [6, 7, 8, 9], photos: [2476632, 10832155] },
  matrouh:     { ar: 'مرسى مطروح',     en: 'Marsa Matrouh',    cat: 'stays',     country: { ar: 'مصر', en: 'Egypt' }, best: [6, 7, 8], photos: [10832155, 1488327] },
  gouna:       { ar: 'الجونة',         en: 'El Gouna',         cat: 'stays',     country: { ar: 'مصر', en: 'Egypt' }, best: [3, 4, 10, 11, 12], photos: [1268871, 1488327] },
  gamasa:      { ar: 'جمصة',           en: 'Gamasa',           cat: 'stays',     country: { ar: 'مصر', en: 'Egypt' }, best: [7, 8], photos: [31817155, 1488327] },
  sudr:        { ar: 'رأس سدر',        en: 'Ras Sudr',         cat: 'stays',     country: { ar: 'مصر', en: 'Egypt' }, best: [4, 5, 9, 10], photos: [24807132, 31817155] },
  istanbul:    { ar: 'إسطنبول',        en: 'Istanbul',         cat: 'abroad',    country: { ar: 'تركيا', en: 'Turkey' }, best: [4, 5, 6, 9, 10], photos: [7529416, 28958176, 29127539] },
  dubai:       { ar: 'دبي',            en: 'Dubai',            cat: 'abroad',    country: { ar: 'الإمارات', en: 'UAE' }, best: [11, 12, 1, 2, 3], photos: [19894545, 33687811, 1537493] },
  georgia:     { ar: 'جورجيا',         en: 'Georgia',          cat: 'abroad',    country: { ar: 'جورجيا', en: 'Georgia' }, best: [5, 6, 7, 8, 9], photos: [16660047, 1280841, 4916521, 26556152] },
  malaysia:    { ar: 'ماليزيا',        en: 'Malaysia',         cat: 'abroad',    country: { ar: 'ماليزيا', en: 'Malaysia' }, best: [1, 2, 3, 6, 7], photos: [4239545, 433942] },
  maldives:    { ar: 'المالديف',       en: 'Maldives',         cat: 'abroad',    country: { ar: 'المالديف', en: 'Maldives' }, best: [12, 1, 2, 3, 4], photos: [1287460, 28843922, 30037393] },
  europe:      { ar: 'أوروبا',         en: 'Europe',           cat: 'abroad',    country: { ar: 'فرنسا وهولندا', en: 'France & Netherlands' }, best: [5, 6, 7, 9], photos: [17185651, 14345180, 2082103] },
  catherine:   { ar: 'سانت كاترين',    en: 'St. Catherine',    cat: 'adventure', country: { ar: 'مصر', en: 'Egypt' }, best: [3, 4, 5, 10, 11], photos: [29747818, 27430541] },
  siwa:        { ar: 'سيوة',           en: 'Siwa Oasis',       cat: 'adventure', country: { ar: 'مصر', en: 'Egypt' }, best: [10, 11, 12, 1, 2, 3], photos: [14065506, 14065727, 2010296] },
  whitedesert: { ar: 'الصحرا البيضا',  en: 'White Desert',     cat: 'adventure', country: { ar: 'مصر', en: 'Egypt' }, best: [10, 11, 12, 1, 2, 3], photos: [13004623, 937187] },
  luxor:       { ar: 'الأقصر وأسوان',  en: 'Luxor & Aswan',    cat: 'adventure', country: { ar: 'مصر', en: 'Egypt' }, best: [11, 12, 1, 2], photos: [1755390, 15131579] },
};

export const FEATURES = {
  flight: { ar: 'طيران', en: 'Flights' },
  direct: { ar: 'طيران مباشر', en: 'Direct flight' },
  bus: { ar: 'أتوبيس VIP', en: 'VIP coach' },
  h5: { ar: 'فندق 5 نجوم', en: '5-star hotel' },
  h4: { ar: 'فندق 4 نجوم', en: '4-star hotel' },
  h3: { ar: 'فندق 3 نجوم', en: '3-star hotel' },
  haram: { ar: 'قريب من الحرم', en: 'Near the Haram' },
  visa: { ar: 'تأشيرة', en: 'Visa' },
  transfers: { ar: 'انتقالات', en: 'Transfers' },
  allinc: { ar: 'All Inclusive', en: 'All inclusive' },
  half: { ar: 'نص إقامة', en: 'Half board' },
  breakfast: { ar: 'إفطار', en: 'Breakfast' },
  guide: { ar: 'مرشد عربي', en: 'Arabic guide' },
  tours: { ar: 'جولات يومية', en: 'Daily tours' },
  pool: { ar: 'حمام سباحة', en: 'Pool' },
  seaview: { ar: 'إطلالة بحر', en: 'Sea view' },
  beachfront: { ar: 'على البحر مباشرة', en: 'Beachfront' },
  ac: { ar: 'تكييف', en: 'A/C' },
  parking: { ar: 'باركينج', en: 'Parking' },
  wifi: { ar: 'واي فاي', en: 'Wi-Fi' },
  kids: { ar: 'نادي أطفال', en: 'Kids club' },
  snorkel: { ar: 'سنوركل', en: 'Snorkeling' },
  diving: { ar: 'غطس', en: 'Diving' },
  safari: { ar: 'سفاري', en: 'Safari' },
  camp: { ar: 'تخييم', en: 'Camping' },
  hike: { ar: 'طلوع الجبل', en: 'Mountain hike' },
  boat: { ar: 'رحلة مركب', en: 'Boat trip' },
  insurance: { ar: 'تأمين سفر', en: 'Travel insurance' },
  supervisor: { ar: 'مشرف ديني', en: 'Religious guide' },
  bbq: { ar: 'شواية', en: 'BBQ' },
};

export const STATUS = {
  new: { ar: 'جديد', en: 'New', color: '#3D85D1' },
  contacted: { ar: 'تم التواصل', en: 'Contacted', color: '#D99A1E' },
  closed: { ar: 'تم الحجز', en: 'Booked', color: '#1E9E6A' },
};

// Every photo the admin/agency can pick from in the offer form
export const PHOTO_LIBRARY = [...new Set(Object.values(DESTS).flatMap((d) => d.photos))].map((id) => `px:${id}`);
