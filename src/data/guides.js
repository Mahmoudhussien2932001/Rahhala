/*
  Travel guides (Guides page). Each guide = quick facts + a day-by-day plan + budget + Q&A.
  Text is bilingual { ar, en }. Photos are Pexels ids ('px:<id>').
  Costs are rough per-person estimates in USD and shown in EGP using EGP_PER_USD.
  Prices, visa rules and exchange rates change — review this file before each season.
*/

export const EGP_PER_USD = 50; // approximate; update when the rate moves

export const GUIDES = {
  georgia: {
    name: { ar: 'جورجيا', en: 'Georgia' },
    hero: 'px:38723717',
    tagline: { ar: 'جبال القوقاز، كنايس على القمم، ونبيذ وأكل بيت حقيقي', en: 'Caucasus peaks, hilltop churches, wine country and real home cooking' },
    intro: {
      ar: 'جورجيا من أقرب وأسهل الوجهات الأوروبية الطابع للمصريين: طبيعة خضرا وجبال تلج في الصيف، عاصمة قديمة حلوة للمشي، وبحر في باتومي. 7 أيام كفاية تشوف أهم حاجة فيها من غير ما تجري.',
      en: 'Georgia is one of the easiest European-feeling trips from Egypt: green valleys, snow-capped peaks even in summer, a walkable old capital, and the sea in Batumi. Seven days covers the highlights without rushing.',
    },
    facts: [
      { icon: 'cal', k: { ar: 'أحسن وقت', en: 'Best time' }, v: { ar: 'مايو – أكتوبر', en: 'May – October' } },
      { icon: 'clock', k: { ar: 'المدة المناسبة', en: 'Ideal length' }, v: { ar: '7 – 10 أيام', en: '7 – 10 days' } },
      { icon: 'shield', k: { ar: 'التأشيرة', en: 'Visa' }, v: { ar: 'إلكترونية أونلاين لحاملي الجواز المصري', en: 'e-Visa online for Egyptian passports' } },
      { icon: 'money', k: { ar: 'العملة', en: 'Currency' }, v: { ar: 'لاري جورجي (GEL)', en: 'Georgian lari (GEL)' } },
      { icon: 'users', k: { ar: 'اللغة', en: 'Language' }, v: { ar: 'جورجي، والروسي والإنجليزي منتشرين', en: 'Georgian; Russian & English widely used' } },
      { icon: 'plane', k: { ar: 'المطار', en: 'Airports' }, v: { ar: 'تبليسي أو باتومي أو كوتايسي', en: 'Tbilisi, Batumi or Kutaisi' } },
    ],
    days: [
      {
        place: { ar: 'تبليسي', en: 'Tbilisi' }, photo: 'px:31701710',
        title: { ar: 'وصول وتمشية في تبليسي القديمة', en: 'Arrive & wander Old Tbilisi' },
        items: [
          { ar: 'تمشية في الحي القديم وكوبري السلام', en: 'Walk the Old Town and the Bridge of Peace' },
          { ar: 'التلفريك لقلعة ناريكالا وغروب على المدينة', en: 'Cable car up to Narikala Fortress for sunset' },
          { ar: 'حمامات الكبريت في أبانوتوباني', en: 'Sulphur baths in Abanotubani' },
        ],
        tip: { ar: 'اشتري خط موبايل من المطار (Magti أو Silknet) — رخيص والنت سريع.', en: 'Grab a local SIM at the airport (Magti or Silknet) — cheap with fast data.' },
      },
      {
        place: { ar: 'متسخيتا', en: 'Mtskheta' }, photo: 'px:29874564',
        title: { ar: 'العاصمة القديمة ودير جفاري', en: 'The old capital & Jvari Monastery' },
        items: [
          { ar: 'دير جفاري فوق التل والمنظر على ملتقى النهرين', en: 'Jvari Monastery above the meeting of two rivers' },
          { ar: 'كاتدرائية سفيتيتسخوفيلي — تراث عالمي', en: 'Svetitskhoveli Cathedral — a UNESCO site' },
          { ar: 'رجوع تبليسي وعشا خينكالي وخاتشابوري', en: 'Back in Tbilisi for khinkali & khachapuri' },
        ],
        tip: { ar: 'نص ساعة بس من تبليسي — تاكسي Bolt أرخص من الرحلات المنظمة.', en: 'Only 30 minutes from Tbilisi — a Bolt taxi is cheaper than a tour.' },
      },
      {
        place: { ar: 'كازبيجي', en: 'Kazbegi' }, photo: 'px:33710115',
        title: { ar: 'طريق الجيش الجورجي وكنيسة جيرجيتي', en: 'Georgian Military Road & Gergeti Church' },
        items: [
          { ar: 'قلعة أنانوري على البحيرة في السكة', en: 'Ananuri Fortress on the reservoir along the way' },
          { ar: 'نصب الصداقة في جودوري والمنظر على الوادي', en: 'Friendship Monument viewpoint at Gudauri' },
          { ar: 'طلعة لكنيسة الثالوث جيرجيتي وتحتها جبل كازبيك', en: 'Up to Gergeti Trinity Church below Mount Kazbek' },
        ],
        tip: { ar: 'خد جاكيت حتى في الصيف — فوق الجبل الجو بيقلب بسرعة.', en: 'Pack a jacket even in summer — mountain weather turns fast.' },
      },
      {
        place: { ar: 'سيغناغي', en: 'Sighnaghi' }, photo: 'px:36043181',
        title: { ar: 'مدينة الحب ومزارع العنب في كاخيتي', en: 'The "City of Love" & Kakheti vineyards' },
        items: [
          { ar: 'سور المدينة القديم والبيوت بالسقف الأحمر', en: 'The old town walls and red-roofed houses' },
          { ar: 'دير بودبي والمنظر على وادي ألازاني', en: 'Bodbe Monastery over the Alazani Valley' },
          { ar: 'غدا في بيت ضيافة بأكل بيتي', en: 'Lunch at a family guesthouse' },
        ],
        tip: { ar: 'لو مش بتشرب نبيذ، اطلب عصير العنب الطازة أو الشاي بالأعشاب.', en: 'Not a wine drinker? Ask for fresh grape juice or herbal tea.' },
      },
      {
        place: { ar: 'باتومي', en: 'Batumi' }, photo: 'px:14029479',
        title: { ar: 'على البحر الأسود في باتومي', en: 'Black Sea days in Batumi' },
        items: [
          { ar: 'القطر من تبليسي لباتومي (حوالي 5 ساعات)', en: 'Train from Tbilisi to Batumi (about 5 hours)' },
          { ar: 'البوليفار على البحر وبرج الحروف', en: 'The seaside boulevard and Alphabet Tower' },
          { ar: 'الحديقة النباتية ويوم بحر', en: 'Botanical Garden and a beach day' },
        ],
        tip: { ar: 'باتومي فيها مطاعم حلال كتير، والصيف (يوليو وأغسطس) هو موسم البحر.', en: 'Batumi has plenty of halal restaurants; July–August is beach season.' },
      },
    ],
    budget: {
      low: [
        { k: { ar: 'السكن', en: 'Stay' }, usd: 25 },
        { k: { ar: 'الأكل', en: 'Food' }, usd: 15 },
        { k: { ar: 'المواصلات', en: 'Transport' }, usd: 10 },
        { k: { ar: 'الأنشطة والدخول', en: 'Activities' }, usd: 8 },
      ],
      mid: [
        { k: { ar: 'السكن', en: 'Stay' }, usd: 60 },
        { k: { ar: 'الأكل', en: 'Food' }, usd: 30 },
        { k: { ar: 'المواصلات', en: 'Transport' }, usd: 25 },
        { k: { ar: 'الأنشطة والدخول', en: 'Activities' }, usd: 15 },
      ],
      flight: { ar: 'الطيران من القاهرة ذهاب وعودة غالباً بين 350 و 600 دولار حسب الموسم.', en: 'Return flights from Cairo usually run $350–600 depending on season.' },
    },
    faq: [
      { q: { ar: 'محتاج تأشيرة؟', en: 'Do I need a visa?' }, a: { ar: 'أيوه لحاملي الجواز المصري. تقدر تقدّم على تأشيرة إلكترونية من موقع الحكومة الجورجية الرسمي (evisa.gov.ge). لو معاك إقامة أو تأشيرة سارية من أمريكا أو أوروبا أو الخليج ممكن تدخل من غير تأشيرة — اتأكد من القواعد على الموقع الرسمي قبل الحجز.', en: 'Yes, for Egyptian passports. Apply for an e-Visa on the official site (evisa.gov.ge). A valid US, EU or GCC visa or residence may let you enter visa-free — check the current rules on the official site before booking.' } },
      { q: { ar: 'هل جورجيا آمنة؟', en: 'Is Georgia safe?' }, a: { ar: 'من أكتر البلاد أماناً للسياح، والناس مضيافة جداً. خليك حريص عادي على حاجتك في الأماكن الزحمة.', en: 'It is one of the safer countries for tourists, and people are very hospitable. Use normal care with belongings in crowded spots.' } },
      { q: { ar: 'الأكل الحلال متوفر؟', en: 'Is halal food easy to find?' }, a: { ar: 'في تبليسي مطاعم حلال ومطاعم تركية وعربية، وفي باتومي أكتر. برا المدن الأكل البيتي فيه خيارات كتير بالخضار والجبنة والفراخ.', en: 'Tbilisi has halal, Turkish and Arab restaurants, and Batumi even more. Outside the cities, home cooking offers plenty of vegetable, cheese and chicken dishes.' } },
      { q: { ar: 'أتنقل إزاي؟', en: 'How do I get around?' }, a: { ar: 'جوه المدن تطبيق Bolt رخيص وآمن. بين المدن في ميني باص (مارشروتكا) وقطر تبليسي–باتومي، أو سواق خاص ليوم كامل لو مجموعة.', en: 'Bolt is cheap and reliable in cities. Between cities there are minibuses (marshrutka), the Tbilisi–Batumi train, or a private driver for the day if you are a group.' } },
      { q: { ar: 'كاش ولا فيزا؟', en: 'Cash or card?' }, a: { ar: 'الفيزا ماشية في أغلب الأماكن في المدن. خلّي معاك لاري كاش للقرى والأسواق والمارشروتكا، وغيّر من مكاتب الصرافة مش المطار.', en: 'Cards work in most city places. Keep some lari in cash for villages, markets and minibuses, and exchange at city bureaus rather than the airport.' } },
      { q: { ar: 'أقدر أجمعها مع أرمينيا؟', en: 'Can I combine it with Armenia?' }, a: { ar: 'أيوه، ودي حاجة شائعة. من تبليسي ليريفان حوالي 5–6 ساعات بالعربية أو الميني باص، وفي الصيف في قطر بالليل.', en: 'Yes, it is a popular combo. Tbilisi to Yerevan is about 5–6 hours by car or minibus, with an overnight train in summer.' } },
    ],
    dayLabels: ['1', '2', '3', '4', '5–7'],
    offersLink: 'offers?dest=georgia',
  },

  armenia: {
    name: { ar: 'أرمينيا', en: 'Armenia' },
    hero: 'px:39243255',
    tagline: { ar: 'أقدم أديرة العالم، جبل أرارات، وبحيرة في السما', en: 'Ancient monasteries, Mount Ararat views and a lake in the sky' },
    intro: {
      ar: 'أرمينيا بلد صغير بس مليان تاريخ: أديرة عمرها أكتر من ألف سنة على حافة الجبال، معبد روماني، وبحيرة سيفان. أسعارها هادية والمسافات قريبة، فـ 6 أيام بتكفي جداً.',
      en: 'Armenia is small but packed with history: thousand-year-old monasteries on cliff edges, a Roman temple and Lake Sevan. Prices are gentle and distances short, so six days is plenty.',
    },
    facts: [
      { icon: 'cal', k: { ar: 'أحسن وقت', en: 'Best time' }, v: { ar: 'مايو – أكتوبر', en: 'May – October' } },
      { icon: 'clock', k: { ar: 'المدة المناسبة', en: 'Ideal length' }, v: { ar: '5 – 7 أيام', en: '5 – 7 days' } },
      { icon: 'shield', k: { ar: 'التأشيرة', en: 'Visa' }, v: { ar: 'إلكترونية أونلاين لحاملي الجواز المصري', en: 'e-Visa online for Egyptian passports' } },
      { icon: 'money', k: { ar: 'العملة', en: 'Currency' }, v: { ar: 'درام أرميني (AMD)', en: 'Armenian dram (AMD)' } },
      { icon: 'users', k: { ar: 'اللغة', en: 'Language' }, v: { ar: 'أرميني، والروسي منتشر', en: 'Armenian; Russian widely spoken' } },
      { icon: 'plane', k: { ar: 'المطار', en: 'Airport' }, v: { ar: 'زفارتنوتس – يريفان', en: 'Zvartnots, Yerevan' } },
    ],
    days: [
      {
        place: { ar: 'يريفان', en: 'Yerevan' }, photo: 'px:29206201',
        title: { ar: 'يريفان: المدينة الوردي', en: 'Yerevan, the pink city' },
        items: [
          { ar: 'ميدان الجمهورية والنافورات المنورة بالليل', en: 'Republic Square and its lit fountains at night' },
          { ar: 'سلالم الكاسكيد والمنظر على أرارات', en: 'The Cascade steps with Ararat views' },
          { ar: 'سوق فيرنيساج يوم الويك إند', en: 'Vernissage market on weekends' },
        ],
        tip: { ar: 'تطبيق Yandex Go للتاكسي رخيص جداً جوه يريفان.', en: 'Yandex Go taxis are very cheap around Yerevan.' },
      },
      {
        place: { ar: 'جارني وجيغارد', en: 'Garni & Geghard' }, photo: 'px:34058959',
        title: { ar: 'معبد جارني ودير جيغارد في الصخر', en: 'Garni Temple & the rock-cut Geghard' },
        items: [
          { ar: 'معبد جارني الروماني فوق الوادي', en: 'The Greco-Roman Garni Temple above the gorge' },
          { ar: '"سيمفونية الحجارة" — أعمدة بازلت طبيعية', en: '"Symphony of Stones" basalt columns' },
          { ar: 'دير جيغارد المنحوت في الجبل', en: 'Geghard Monastery, carved into the mountain' },
        ],
        tip: { ar: 'الاتنين في يوم واحد مع سواق، حوالي ساعة من يريفان.', en: 'Do both in one day with a driver — about an hour from Yerevan.' },
      },
      {
        place: { ar: 'خور فيراب', en: 'Khor Virap' }, photo: 'px:34146317',
        title: { ar: 'خور فيراب وأقرب منظر لجبل أرارات', en: 'Khor Virap & the closest Ararat view' },
        items: [
          { ar: 'الدير قدام جبل أرارات مباشرة', en: 'The monastery right in front of Mount Ararat' },
          { ar: 'روح الصبح بدري — السحاب بيغطي الجبل بعد الضهر', en: 'Go early — clouds often hide the peak by afternoon' },
          { ar: 'وقفة في مصانع النبيذ والفواكه المجففة في أريني', en: 'Stop in Areni for dried fruit and local produce' },
        ],
        tip: { ar: 'أحسن صورة لأرارات بتبقى في الخريف والجو صافي.', en: 'The clearest Ararat photos come on crisp autumn mornings.' },
      },
      {
        place: { ar: 'تاتيف', en: 'Tatev' }, photo: 'px:36096774',
        title: { ar: 'دير تاتيف وأطول تلفريك', en: 'Tatev Monastery & the record cable car' },
        items: [
          { ar: 'تلفريك "أجنحة تاتيف" فوق الوادي', en: '"Wings of Tatev" cable car over the gorge' },
          { ar: 'الدير على حافة الجبل من القرن التاسع', en: 'The 9th-century monastery on the cliff edge' },
          { ar: 'ليلة في بيت ضيافة في جوريس أو تاتيف', en: 'Overnight in a Goris or Tatev guesthouse' },
        ],
        tip: { ar: 'المشوار طويل (حوالي 4 ساعات) فخليه ليلة مش يوم رايح جاي.', en: 'It is a long drive (about 4 hours), so stay overnight rather than day-trip.' },
      },
      {
        place: { ar: 'بحيرة سيفان', en: 'Lake Sevan' }, photo: 'px:11885385',
        title: { ar: 'بحيرة سيفان ودِليجان الخضرا', en: 'Lake Sevan & green Dilijan' },
        items: [
          { ar: 'دير سيفانافانك فوق شبه الجزيرة', en: 'Sevanavank Monastery on the peninsula' },
          { ar: 'سمك سيفان المشوي على البحيرة', en: 'Grilled Sevan fish by the water' },
          { ar: 'تمشية في غابات دِليجان "سويسرا أرمينيا"', en: 'Forest walks in Dilijan, "Armenia\'s Switzerland"' },
        ],
        tip: { ar: 'البحيرة على ارتفاع 1900 متر — الجو أبرد من يريفان بكتير.', en: 'The lake sits at 1,900 m — noticeably cooler than Yerevan.' },
      },
    ],
    budget: {
      low: [
        { k: { ar: 'السكن', en: 'Stay' }, usd: 25 },
        { k: { ar: 'الأكل', en: 'Food' }, usd: 15 },
        { k: { ar: 'المواصلات', en: 'Transport' }, usd: 12 },
        { k: { ar: 'الأنشطة والدخول', en: 'Activities' }, usd: 8 },
      ],
      mid: [
        { k: { ar: 'السكن', en: 'Stay' }, usd: 55 },
        { k: { ar: 'الأكل', en: 'Food' }, usd: 30 },
        { k: { ar: 'المواصلات', en: 'Transport' }, usd: 30 },
        { k: { ar: 'الأنشطة والدخول', en: 'Activities' }, usd: 15 },
      ],
      flight: { ar: 'الطيران من القاهرة غالباً بترانزيت، وذهاب وعودة بين 400 و 700 دولار.', en: 'Flights from Cairo usually connect once; return fares run about $400–700.' },
    },
    faq: [
      { q: { ar: 'محتاج تأشيرة؟', en: 'Do I need a visa?' }, a: { ar: 'أيوه لحاملي الجواز المصري، وتقدر تقدّم على تأشيرة إلكترونية من موقع وزارة الخارجية الأرمينية الرسمي (evisa.mfa.am). القواعد بتتغير، فاتأكد من الموقع الرسمي أو السفارة قبل ما تحجز.', en: 'Yes, for Egyptian passports — apply for an e-Visa on the official Armenian MFA site (evisa.mfa.am). Rules change, so confirm with the official site or embassy before booking.' } },
      { q: { ar: 'إيه أهم حاجة مينفعش تفوتني؟', en: "What shouldn't I miss?" }, a: { ar: 'منظر أرارات من خور فيراب الصبح، معبد جارني، وتلفريك تاتيف. لو وقتك قليل، الاتنين الأولانيين ينفعوا في يومين من يريفان.', en: 'The morning Ararat view from Khor Virap, Garni Temple and the Tatev cable car. Short on time? The first two are easy day trips from Yerevan.' } },
      { q: { ar: 'الأكل الحلال متوفر؟', en: 'Is halal food easy to find?' }, a: { ar: 'في يريفان مطاعم إيرانية وعربية وحلال، والأكل الأرميني نفسه قريب من أكلنا: مشويات، خضار محشي، وعيش لافاش.', en: 'Yerevan has Iranian, Arab and halal places, and Armenian food feels familiar: grills, stuffed vegetables and lavash bread.' } },
      { q: { ar: 'أتنقل إزاي بين الأماكن؟', en: 'How do I get between places?' }, a: { ar: 'أسهل حاجة سواق خاص أو رحلة يوم من يريفان، لأن المواصلات العامة للأديرة قليلة. جوه يريفان التاكسي بالتطبيق رخيص جداً.', en: 'A private driver or day tour from Yerevan is easiest — public transport to monasteries is sparse. In Yerevan, app taxis are very cheap.' } },
      { q: { ar: 'الأسعار غالية؟', en: 'Is it expensive?' }, a: { ar: 'لأ، أرمينيا من أرخص الوجهات في المنطقة. الأكل والمواصلات أرخص من جورجيا شوية، والفنادق الحلوة في يريفان أسعارها معقولة.', en: 'No — Armenia is one of the cheaper destinations in the region. Food and transport cost a bit less than Georgia, and good Yerevan hotels are reasonable.' } },
      { q: { ar: 'إمتى ينفع أشوف تلج؟', en: 'When can I see snow?' }, a: { ar: 'من ديسمبر لمارس، وفي منتجع تساغكادزور للتزحلق. بس الطرق الجبلية لتاتيف ممكن تقفل أحياناً في الشتا.', en: 'December to March, with skiing at Tsaghkadzor. Mountain roads to Tatev can close at times in winter.' } },
    ],
    dayLabels: ['1', '2', '3', '4', '5–6'],
    offersLink: 'offers?cat=abroad',
  },

  egypt: {
    name: { ar: 'مصر', en: 'Egypt' },
    hero: 'px:37662644',
    tagline: { ar: 'من الأهرامات للأقصر وأسوان — رحلة في 5000 سنة', en: 'From the Pyramids to Luxor and Aswan — 5,000 years in one trip' },
    intro: {
      ar: 'أحلى رحلة ممكن تعملها في بلدك: القاهرة التاريخية، معابد الأقصر، ونيل أسوان. لو عمرك ما عملتها، 7 أيام في الشتا هتبقى رحلة مش هتنساها.',
      en: 'The classic Egypt journey: historic Cairo, the temples of Luxor and the Nile at Aswan. Seven winter days make it unforgettable.',
    },
    facts: [
      { icon: 'cal', k: { ar: 'أحسن وقت', en: 'Best time' }, v: { ar: 'أكتوبر – أبريل', en: 'October – April' } },
      { icon: 'clock', k: { ar: 'المدة المناسبة', en: 'Ideal length' }, v: { ar: '7 – 9 أيام', en: '7 – 9 days' } },
      { icon: 'shield', k: { ar: 'التذاكر', en: 'Tickets' }, v: { ar: 'أسعار مخفضة للمصريين بالبطاقة', en: 'Reduced fares for Egyptians with ID' } },
      { icon: 'money', k: { ar: 'العملة', en: 'Currency' }, v: { ar: 'جنيه مصري (EGP)', en: 'Egyptian pound (EGP)' } },
      { icon: 'pin', k: { ar: 'المسار', en: 'Route' }, v: { ar: 'القاهرة ← الأقصر ← أسوان', en: 'Cairo → Luxor → Aswan' } },
      { icon: 'plane', k: { ar: 'التنقل', en: 'Getting around' }, v: { ar: 'قطر النوم أو طيران داخلي', en: 'Sleeper train or domestic flight' } },
    ],
    days: [
      {
        place: { ar: 'الجيزة', en: 'Giza' }, photo: 'px:33682713',
        title: { ar: 'الأهرامات وأبو الهول', en: 'The Pyramids & the Sphinx' },
        items: [
          { ar: 'هضبة الأهرامات بدري الصبح قبل الزحمة', en: 'The Giza plateau early, before the crowds' },
          { ar: 'المتحف المصري الكبير جنب الأهرامات', en: 'The Grand Egyptian Museum next door' },
          { ar: 'عرض الصوت والضوء بالليل', en: 'The Sound & Light show at night' },
        ],
        tip: { ar: 'احجز تذاكر المتحف الكبير أونلاين قبلها، وخد بطاقتك للسعر المصري.', en: 'Book Grand Egyptian Museum tickets online, and bring ID for local prices.' },
      },
      {
        place: { ar: 'القاهرة التاريخية', en: 'Historic Cairo' }, photo: 'px:30683180',
        title: { ar: 'القلعة وخان الخليلي', en: 'The Citadel & Khan el-Khalili' },
        items: [
          { ar: 'قلعة صلاح الدين وجامع محمد علي', en: 'Saladin Citadel and the Muhammad Ali Mosque' },
          { ar: 'شارع المعز والجامع الأزهر', en: 'Al-Muizz Street and Al-Azhar Mosque' },
          { ar: 'قهوة في الحسين وعشا في خان الخليلي', en: 'Coffee at El-Hussein and dinner in Khan el-Khalili' },
        ],
        tip: { ar: 'شارع المعز أحلى بالليل لما المباني تنوّر.', en: 'Al-Muizz Street is at its best at night when the buildings light up.' },
      },
      {
        place: { ar: 'الأقصر', en: 'Luxor' }, photo: 'px:18934607',
        title: { ar: 'الأقصر: الكرنك ووادي الملوك', en: 'Luxor: Karnak & the Valley of the Kings' },
        items: [
          { ar: 'قطر النوم بالليل من القاهرة توصل الصبح', en: 'Overnight sleeper train from Cairo, arriving in the morning' },
          { ar: 'معبد الكرنك، ومعبد الأقصر منوّر بالليل', en: 'Karnak Temple, then Luxor Temple lit up after dark' },
          { ar: 'تاني يوم: بالون مع الشروق ووادي الملوك ومعبد حتشبسوت', en: 'Next day: sunrise balloon, Valley of the Kings and Hatshepsut\'s Temple' },
        ],
        tip: { ar: 'احجز قطر النوم بدري، وخلي للأقصر يومين على الأقل.', en: 'Book the sleeper train early, and give Luxor at least two days.' },
      },
      {
        place: { ar: 'أسوان', en: 'Aswan' }, photo: 'px:27730261',
        title: { ar: 'فلوكة على نيل أسوان', en: 'Felucca days in Aswan' },
        items: [
          { ar: 'معبد فيلة على الجزيرة', en: 'Philae Temple on its island' },
          { ar: 'فلوكة وقت الغروب حوالين جزيرة النباتات', en: 'Sunset felucca around Kitchener\'s Island' },
          { ar: 'القرية النوبية في غرب سهيل', en: 'The Nubian village at Gharb Soheil' },
        ],
        tip: { ar: 'من الأقصر لأسوان بالقطر حوالي 3 ساعات، أو بكروز نيلي 3 ليالي.', en: 'Luxor to Aswan is about 3 hours by train, or a 3-night Nile cruise.' },
      },
      {
        place: { ar: 'أبو سمبل', en: 'Abu Simbel' }, photo: 'px:32013787',
        title: { ar: 'معابد أبو سمبل', en: 'The temples of Abu Simbel' },
        items: [
          { ar: 'معبد رمسيس التاني ومعبد نفرتاري', en: 'The temples of Ramesses II and Nefertari' },
          { ar: 'ظاهرة تعامد الشمس يومي 22 أكتوبر و22 فبراير', en: 'The sun alignment on 22 October and 22 February' },
          { ar: 'رجوع أسوان بعد الضهر والسفر', en: 'Back to Aswan by afternoon to head home' },
        ],
        tip: { ar: 'أبو سمبل حوالي 3 ساعات من أسوان — الرحلات بتطلع قبل الفجر.', en: 'Abu Simbel is about 3 hours from Aswan — trips leave before dawn.' },
      },
    ],
    budget: {
      low: [
        { k: { ar: 'السكن', en: 'Stay' }, usd: 20 },
        { k: { ar: 'الأكل', en: 'Food' }, usd: 10 },
        { k: { ar: 'المواصلات', en: 'Transport' }, usd: 10 },
        { k: { ar: 'التذاكر والأنشطة', en: 'Tickets & activities' }, usd: 10 },
      ],
      mid: [
        { k: { ar: 'السكن', en: 'Stay' }, usd: 50 },
        { k: { ar: 'الأكل', en: 'Food' }, usd: 20 },
        { k: { ar: 'المواصلات', en: 'Transport' }, usd: 20 },
        { k: { ar: 'التذاكر والأنشطة', en: 'Tickets & activities' }, usd: 30 },
      ],
      flight: { ar: 'التنقل بين المدن: قطر النوم أو طيران داخلي — الطيران أسرع والقطر تجربة حلوة.', en: 'Between cities: sleeper train or a domestic flight — flying is faster, the train is an experience.' },
    },
    faq: [
      { q: { ar: 'إيه أحسن وقت للأقصر وأسوان؟', en: "When's best for Luxor and Aswan?" }, a: { ar: 'من أكتوبر لأبريل. الصيف هناك بيعدّي 40 درجة، فلو مسافر في الصيف خلي الزيارات الصبح بدري وبعد العصر.', en: 'October to April. Summer tops 40°C there — if you go then, sightsee early morning and late afternoon.' } },
      { q: { ar: 'القطر ولا الطيارة؟', en: 'Train or plane?' }, a: { ar: 'قطر النوم بيوفّر ليلة فندق وتجربة حلوة (حوالي 10 ساعات للأقصر). الطيران ساعة وشوية لو وقتك ضيق.', en: 'The sleeper train saves a hotel night and is a fun ride (about 10 hours to Luxor). Flying takes just over an hour if time is tight.' } },
      { q: { ar: 'ينفع أعمل كروز نيلي؟', en: 'Can I do a Nile cruise?' }, a: { ar: 'أيوه، الكروز بين الأقصر وأسوان 3–4 ليالي وبيبقى شامل الأكل وزيارة معابد إدفو وكوم أمبو في السكة. شوف عروض الشركات في رحّالة.', en: 'Yes — Luxor–Aswan cruises run 3–4 nights, usually with meals and stops at Edfu and Kom Ombo. Check agency offers on Rahhala.' } },
      { q: { ar: 'أحتاج مرشد سياحي؟', en: 'Do I need a guide?' }, a: { ar: 'مش لازم، بس في الكرنك ووادي الملوك المرشد بيفرق جداً في إنك تفهم اللي بتشوفه. اتفق على السعر قبل ما تبدأ.', en: "Not essential, but at Karnak and the Valley of the Kings a guide makes a big difference. Agree on the price upfront." } },
      { q: { ar: 'إزاي أتجنب الاستغلال؟', en: 'How do I avoid tourist traps?' }, a: { ar: 'اتفق على أي سعر قبل الخدمة (حنطور، فلوكة، جمل)، واستخدم Uber أو Careem في القاهرة، واشتري التذاكر من الشبابيك الرسمية بس.', en: 'Agree prices before any ride (carriage, felucca, camel), use Uber or Careem in Cairo, and buy tickets only at official windows.' } },
      { q: { ar: 'ألبس إيه؟', en: 'What should I wear?' }, a: { ar: 'هدوم خفيفة قطن، جزمة مريحة للمشي الكتير، نضارة شمس وكاب. خد جاكيت خفيف للبالون وقطر الليل.', en: 'Light cotton clothes, comfortable walking shoes, sunglasses and a hat. Bring a light jacket for the balloon and the night train.' } },
    ],
    dayLabels: ['1', '2', '3–4', '5–6', '7'],
    offersLink: 'offers',
  },
};

export const GUIDE_ORDER = ['georgia', 'armenia', 'egypt'];
