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

  italy: {
    name: { ar: 'إيطاليا', en: 'Italy' },
    hero: 'px:37433103',
    tagline: { ar: 'روما وفلورنسا وفينيسيا وساحل أمالفي — متحف مفتوح على البحر', en: 'Rome, Florence, Venice and the Amalfi Coast — an open-air museum by the sea' },
    intro: {
      ar: 'إيطاليا رحلة العمر لأي حد بيحب التاريخ والأكل والمناظر: الكولوسيوم في روما، فن عصر النهضة في فلورنسا، قنوات فينيسيا، وبيوت أمالفي الملونة على الجبل. القطارات السريعة بتربط المدن في ساعات قليلة.',
      en: 'Italy is a trip of a lifetime for lovers of history, food and views: the Colosseum in Rome, Renaissance art in Florence, the canals of Venice and the pastel villages of Amalfi. Fast trains link the cities in just a few hours.',
    },
    facts: [
      { icon: 'cal', k: { ar: 'أحسن وقت', en: 'Best time' }, v: { ar: 'أبريل – يونيو، سبتمبر – أكتوبر', en: 'Apr – Jun, Sep – Oct' } },
      { icon: 'clock', k: { ar: 'المدة المناسبة', en: 'Ideal length' }, v: { ar: '8 – 10 أيام', en: '8 – 10 days' } },
      { icon: 'shield', k: { ar: 'التأشيرة', en: 'Visa' }, v: { ar: 'تأشيرة شنغن', en: 'Schengen visa' } },
      { icon: 'money', k: { ar: 'العملة', en: 'Currency' }, v: { ar: 'يورو (EUR)', en: 'Euro (EUR)' } },
      { icon: 'users', k: { ar: 'اللغة', en: 'Language' }, v: { ar: 'إيطالي، والإنجليزي في الأماكن السياحية', en: 'Italian; English in tourist areas' } },
      { icon: 'plane', k: { ar: 'المطار', en: 'Airports' }, v: { ar: 'روما، ميلانو، فينيسيا', en: 'Rome, Milan, Venice' } },
    ],
    days: [
      {
        place: { ar: 'روما', en: 'Rome' }, photo: 'px:32619390',
        title: { ar: 'روما القديمة والكولوسيوم', en: 'Ancient Rome & the Colosseum' },
        items: [
          { ar: 'الكولوسيوم والمنتدى الروماني وتل بالاتين', en: 'The Colosseum, Roman Forum and Palatine Hill' },
          { ar: 'نافورة تريفي وسلالم إسبانيا والبانثيون', en: 'Trevi Fountain, the Spanish Steps and the Pantheon' },
          { ar: 'جيلاتو وعشا في حي تراستيفيري', en: 'Gelato and dinner in Trastevere' },
        ],
        tip: { ar: 'احجز تذكرة الكولوسيوم أونلاين بميعاد محدد — الطوابير طويلة جداً.', en: 'Book a timed Colosseum ticket online — the queues are long.' },
      },
      {
        place: { ar: 'الفاتيكان', en: 'Vatican City' }, photo: 'px:5659303',
        title: { ar: 'الفاتيكان: أصغر دولة في العالم', en: 'The Vatican, the smallest country on earth' },
        items: [
          { ar: 'ساحة القديس بطرس والكاتدرائية', en: "St Peter's Square and Basilica" },
          { ar: 'متاحف الفاتيكان وكنيسة سيستينا', en: 'The Vatican Museums and Sistine Chapel' },
          { ar: 'طلعة القبة والمنظر على روما كلها', en: 'Climb the dome for a view over all of Rome' },
        ],
        tip: { ar: 'لازم الكتاف والركب تبقى مغطية عشان تدخل الكاتدرائية.', en: 'Shoulders and knees must be covered to enter the basilica.' },
      },
      {
        place: { ar: 'فلورنسا', en: 'Florence' }, photo: 'px:36435317',
        title: { ar: 'فلورنسا وفن عصر النهضة', en: 'Florence & the Renaissance' },
        items: [
          { ar: 'القطار السريع من روما (حوالي ساعة ونص)', en: 'Fast train from Rome (about 1.5 hours)' },
          { ar: 'الدومو وكوبري بونتي فيكيو', en: 'The Duomo and the Ponte Vecchio' },
          { ar: 'تمثال داوود وغروب من ساحة ميكيلانجلو', en: "Michelangelo's David and sunset at Piazzale Michelangelo" },
          { ar: 'يوم في بيزا أو ريف توسكانا', en: 'A day trip to Pisa or the Tuscan countryside' },
        ],
        tip: { ar: 'احجز تذاكر القطار بدري على موقع Trenitalia أو Italo — السعر بيزيد قرب الميعاد.', en: 'Book trains early on Trenitalia or Italo — fares rise closer to the date.' },
      },
      {
        place: { ar: 'فينيسيا', en: 'Venice' }, photo: 'px:30802526',
        title: { ar: 'فينيسيا مدينة القنوات', en: 'Venice, the city of canals' },
        items: [
          { ar: 'ساحة سان ماركو والكاتدرائية', en: "St Mark's Square and Basilica" },
          { ar: 'جولة جندول أو الفابوريتو في القناة الكبيرة', en: 'A gondola or vaporetto ride down the Grand Canal' },
          { ar: 'جزيرتي مورانو وبورانو الملونة', en: 'The islands of Murano and colourful Burano' },
        ],
        tip: { ar: 'في أيام معينة في رسوم دخول لزوار اليوم الواحد — شوف موقع المدينة قبل ما تروح.', en: 'Day-trippers pay an entry fee on some dates — check the city website before you go.' },
      },
      {
        place: { ar: 'ساحل أمالفي', en: 'Amalfi Coast' }, photo: 'px:358223',
        title: { ar: 'ساحل أمالفي وبوزيتانو', en: 'The Amalfi Coast & Positano' },
        items: [
          { ar: 'القطار لنابولي، وبعدها باص أو مركب للساحل', en: 'Train to Naples, then bus or ferry to the coast' },
          { ar: 'بوزيتانو وأمالفي ورافيلو', en: 'Positano, Amalfi and Ravello' },
          { ar: 'مركب لجزيرة كابري والكهف الأزرق', en: 'A boat to Capri and the Blue Grotto' },
        ],
        tip: { ar: 'المراكب بين البلاد أسرع وأحلى من الطريق الجبلي في الصيف.', en: 'Ferries between towns beat the cliff road in summer traffic.' },
      },
    ],
    budget: {
      low: [
        { k: { ar: 'السكن', en: 'Stay' }, usd: 60 },
        { k: { ar: 'الأكل', en: 'Food' }, usd: 30 },
        { k: { ar: 'المواصلات', en: 'Transport' }, usd: 20 },
        { k: { ar: 'الأنشطة والدخول', en: 'Activities' }, usd: 15 },
      ],
      mid: [
        { k: { ar: 'السكن', en: 'Stay' }, usd: 130 },
        { k: { ar: 'الأكل', en: 'Food' }, usd: 55 },
        { k: { ar: 'المواصلات', en: 'Transport' }, usd: 35 },
        { k: { ar: 'الأنشطة والدخول', en: 'Activities' }, usd: 30 },
      ],
      flight: { ar: 'الطيران من القاهرة لروما ذهاب وعودة غالباً بين 350 و 650 دولار.', en: 'Return flights Cairo–Rome usually run $350–650.' },
    },
    faq: [
      { q: { ar: 'أطلع تأشيرة شنغن منين؟', en: 'Where do I apply for the Schengen visa?' }, a: { ar: 'من القنصلية الإيطالية أو مركز التأشيرات المعتمد في بلدك، لأن إيطاليا هي البلد اللي هتقضي فيه أطول وقت. قدّم قبل السفر بشهر على الأقل.', en: "Through the Italian consulate or its authorised visa centre in your country, since Italy is where you'll spend the most time. Apply at least a month before travel." } },
      { q: { ar: 'القطر ولا الطيران الداخلي؟', en: 'Train or domestic flights?' }, a: { ar: 'القطار السريع أحسن بكتير: من وسط المدينة لوسط المدينة، ومريح، وفي أسعار حلوة لو حجزت بدري.', en: 'High-speed trains win: city centre to city centre, comfortable, and cheap if booked early.' } },
      { q: { ar: 'الأكل الحلال متوفر؟', en: 'Is halal food easy to find?' }, a: { ar: 'في روما وميلانو مطاعم حلال وعربية وتركية. البيتزا بالخضار والمكرونة بالسي فود والجبنة اختيارات سهلة في أي مكان.', en: 'Rome and Milan have halal, Arab and Turkish places. Vegetable pizza and seafood or cheese pasta are easy anywhere.' } },
      { q: { ar: 'إزاي أوفّر؟', en: 'How can I save money?' }, a: { ar: 'اشرب قهوتك واقف في البار، كُل الغدا بدل العشا في المطاعم، واستخدم مياه النافورات العامة — مياهها نضيفة.', en: 'Drink your coffee standing at the bar, eat out at lunch rather than dinner, and refill at public fountains — the water is clean.' } },
      { q: { ar: 'في نشالين؟', en: 'Are pickpockets a problem?' }, a: { ar: 'أيوه في الأماكن الزحمة والمترو في روما وفلورنسا. خلي الشنطة قدامك والموبايل في جيب مقفول.', en: 'Yes, in crowds and on the Rome and Florence metro. Keep your bag in front and your phone zipped away.' } },
    ],
    dayLabels: ['1–2', '3', '4–5', '6–7', '8–9'],
    offersLink: 'offers?dest=europe',
  },

  switzerland: {
    name: { ar: 'سويسرا', en: 'Switzerland' },
    hero: 'px:40099965',
    tagline: { ar: 'جبال الألب، بحيرات زي المراية، وقطارات بتعدّي من وسط اللوحة', en: 'Alpine peaks, mirror lakes and trains that run right through the postcard' },
    intro: {
      ar: 'سويسرا هي جنة الطبيعة في أوروبا: بحيرات صافية، قرى خشب، شلالات، وجبل الماترهورن. غالية شوية، بس بتذكرة قطار واحدة تتنقل في البلد كلها ومش هتحتاج عربية خالص.',
      en: "Switzerland is Europe's nature paradise: clear lakes, timber villages, waterfalls and the Matterhorn. It's pricey, but one rail pass covers the whole country and you'll never need a car.",
    },
    facts: [
      { icon: 'cal', k: { ar: 'أحسن وقت', en: 'Best time' }, v: { ar: 'يونيو – سبتمبر (والتلج ديسمبر – مارس)', en: 'Jun – Sep (snow Dec – Mar)' } },
      { icon: 'clock', k: { ar: 'المدة المناسبة', en: 'Ideal length' }, v: { ar: '7 – 8 أيام', en: '7 – 8 days' } },
      { icon: 'shield', k: { ar: 'التأشيرة', en: 'Visa' }, v: { ar: 'تأشيرة شنغن', en: 'Schengen visa' } },
      { icon: 'money', k: { ar: 'العملة', en: 'Currency' }, v: { ar: 'فرنك سويسري (CHF)', en: 'Swiss franc (CHF)' } },
      { icon: 'users', k: { ar: 'اللغة', en: 'Language' }, v: { ar: 'ألماني وفرنساوي وإيطالي، والإنجليزي منتشر', en: 'German, French, Italian; English widely spoken' } },
      { icon: 'plane', k: { ar: 'المطار', en: 'Airports' }, v: { ar: 'زيورخ أو جنيف', en: 'Zurich or Geneva' } },
    ],
    days: [
      {
        place: { ar: 'لوسيرن', en: 'Lucerne' }, photo: 'px:27910257',
        title: { ar: 'لوسيرن على البحيرة', en: 'Lakeside Lucerne' },
        items: [
          { ar: 'كوبري تشابل الخشب والمدينة القديمة', en: 'The wooden Chapel Bridge and the old town' },
          { ar: 'رحلة مركب على بحيرة لوسيرن', en: 'A boat cruise on Lake Lucerne' },
          { ar: 'طلعة جبل بيلاتوس أو تيتليس بالتلفريك', en: 'Cable car up Mount Pilatus or Titlis' },
        ],
        tip: { ar: 'تيتليس فيه تلج طول السنة — حلو لو مسافر في الصيف وعايز تشوف تلج.', en: 'Titlis has snow all year — great if you travel in summer and want snow.' },
      },
      {
        place: { ar: 'إنترلاكن', en: 'Interlaken' }, photo: 'px:33315428',
        title: { ar: 'إنترلاكن بين بحيرتين', en: 'Interlaken between two lakes' },
        items: [
          { ar: 'المدينة بين بحيرتي تون وبرينز الفيروزي', en: 'The town between turquoise Lakes Thun and Brienz' },
          { ar: 'باراشوت فوق البحيرات للمغامرين', en: 'Paragliding over the lakes for the adventurous' },
          { ar: 'قرية إيزلتفالد على بحيرة برينز', en: 'Iseltwald village on Lake Brienz' },
        ],
        tip: { ar: 'إنترلاكن قاعدة ممتازة — اسكن هنا وروح منها رحلات يومية.', en: 'Interlaken is the perfect base — stay here and day-trip from it.' },
      },
      {
        place: { ar: 'لاوتربرونن', en: 'Lauterbrunnen' }, photo: 'px:14529749',
        title: { ar: 'وادي الـ72 شلال ويونغفراو', en: 'Valley of 72 waterfalls & the Jungfrau' },
        items: [
          { ar: 'شلال شتاوباخ في قلب القرية', en: 'Staubbach Falls in the village centre' },
          { ar: 'شلالات تروملباخ جوه الجبل', en: 'Trümmelbach Falls inside the mountain' },
          { ar: 'قطار يونغفراو "قمة أوروبا" (اختياري وغالي)', en: 'The Jungfraujoch "Top of Europe" railway (optional, pricey)' },
        ],
        tip: { ar: 'شوف الجو على كاميرات القمة قبل ما تطلع — لو غيم مش هتشوف حاجة.', en: 'Check the summit webcams first — on a cloudy day you see nothing.' },
      },
      {
        place: { ar: 'زيرمات', en: 'Zermatt' }, photo: 'px:29734955',
        title: { ar: 'زيرمات وجبل الماترهورن', en: 'Zermatt & the Matterhorn' },
        items: [
          { ar: 'قرية من غير عربيات — بتوصلها بالقطار بس', en: 'A car-free village reached only by train' },
          { ar: 'قطار جورنرجرات والمنظر على الماترهورن', en: 'The Gornergrat railway with Matterhorn views' },
          { ar: 'ممشى البحيرات الخمسة وانعكاس الجبل في المية', en: 'The Five Lakes walk with the peak reflected in the water' },
        ],
        tip: { ar: 'الشروق على الماترهورن من القرية منظر مش هتنساه — اصحى بدري.', en: 'Sunrise on the Matterhorn from the village is unforgettable — get up early.' },
      },
    ],
    budget: {
      low: [
        { k: { ar: 'السكن', en: 'Stay' }, usd: 90 },
        { k: { ar: 'الأكل', en: 'Food' }, usd: 45 },
        { k: { ar: 'المواصلات', en: 'Transport' }, usd: 40 },
        { k: { ar: 'الأنشطة والدخول', en: 'Activities' }, usd: 20 },
      ],
      mid: [
        { k: { ar: 'السكن', en: 'Stay' }, usd: 180 },
        { k: { ar: 'الأكل', en: 'Food' }, usd: 80 },
        { k: { ar: 'المواصلات', en: 'Transport' }, usd: 60 },
        { k: { ar: 'الأنشطة والدخول', en: 'Activities' }, usd: 40 },
      ],
      flight: { ar: 'الطيران من القاهرة لزيورخ أو جنيف ذهاب وعودة غالباً بين 400 و 700 دولار.', en: 'Return flights Cairo–Zurich or Geneva usually run $400–700.' },
    },
    faq: [
      { q: { ar: 'سويسرا في شنغن؟', en: 'Is Switzerland in Schengen?' }, a: { ar: 'أيوه. تأشيرة شنغن بتدخلك سويسرا، ولو سويسرا وجهتك الأساسية قدّم في السفارة أو مركز التأشيرات السويسري.', en: 'Yes. A Schengen visa covers Switzerland; if it is your main destination, apply through the Swiss embassy or its visa centre.' } },
      { q: { ar: 'أشتري Swiss Travel Pass؟', en: 'Should I buy the Swiss Travel Pass?' }, a: { ar: 'غالباً أيوه لو هتتنقل كتير: بيغطي القطارات والباصات والمراكب ومتاحف كتير، وخصم على تلفريكات الجبال.', en: 'Usually yes if you move around a lot: it covers trains, buses, boats and many museums, with discounts on mountain cable cars.' } },
      { q: { ar: 'سويسرا غالية قد إيه؟', en: 'How expensive is it?' }, a: { ar: 'من أغلى بلاد أوروبا. وفّر بالسوبر ماركت (Coop وMigros) للأكل، واسكن في قرى قريبة بدل المدن الكبيرة.', en: 'One of the priciest in Europe. Save with supermarket meals (Coop, Migros) and stay in villages rather than big cities.' } },
      { q: { ar: 'الأكل الحلال متوفر؟', en: 'Is halal food easy to find?' }, a: { ar: 'في زيورخ وجنيف ولوسيرن مطاعم حلال وتركية ولبنانية. في القرى الجبلية الاختيارات أقل، فخلي معاك أكل خفيف.', en: 'Zurich, Geneva and Lucerne have halal, Turkish and Lebanese spots. Mountain villages have fewer options, so carry snacks.' } },
      { q: { ar: 'ألبس إيه في الجبل؟', en: 'What to wear in the mountains?' }, a: { ar: 'حتى في الصيف خد جاكيت وجزمة مشي مريحة. الجو فوق القمم ممكن يكون تحت الصفر.', en: 'Even in summer bring a jacket and good walking shoes. It can be below zero on the summits.' } },
    ],
    dayLabels: ['1–2', '3', '4–5', '6–7'],
    offersLink: 'offers?dest=europe',
  },

  morocco: {
    name: { ar: 'المغرب', en: 'Morocco' },
    hero: 'px:35752246',
    tagline: { ar: 'أسواق مراكش، صحرا مرزوقة، وشفشاون الزرقا', en: "Marrakech souks, Merzouga's dunes and blue Chefchaouen" },
    intro: {
      ar: 'المغرب قريب في الروح والأكل واللغة، ومختلف تماماً في الألوان والمعمار. من صخب جامع الفنا لهدوء الصحرا تحت النجوم، ومن مدابغ فاس لحواري شفشاون الزرقا.',
      en: 'Morocco feels familiar in spirit, food and language, yet completely different in colour and architecture — from the buzz of Jemaa el-Fnaa to a silent desert night under the stars.',
    },
    facts: [
      { icon: 'cal', k: { ar: 'أحسن وقت', en: 'Best time' }, v: { ar: 'مارس – مايو، سبتمبر – نوفمبر', en: 'Mar – May, Sep – Nov' } },
      { icon: 'clock', k: { ar: 'المدة المناسبة', en: 'Ideal length' }, v: { ar: '8 – 10 أيام', en: '8 – 10 days' } },
      { icon: 'shield', k: { ar: 'التأشيرة', en: 'Visa' }, v: { ar: 'حسب الجنسية — شوف تحت', en: 'Depends on nationality — see below' } },
      { icon: 'money', k: { ar: 'العملة', en: 'Currency' }, v: { ar: 'درهم مغربي (MAD)', en: 'Moroccan dirham (MAD)' } },
      { icon: 'users', k: { ar: 'اللغة', en: 'Language' }, v: { ar: 'عربي ودارجة وأمازيغي وفرنساوي', en: 'Arabic, Darija, Amazigh & French' } },
      { icon: 'plane', k: { ar: 'المطار', en: 'Airports' }, v: { ar: 'مراكش، الدار البيضاء، فاس', en: 'Marrakech, Casablanca, Fes' } },
    ],
    days: [
      {
        place: { ar: 'مراكش', en: 'Marrakech' }, photo: 'px:17649841',
        title: { ar: 'مراكش الحمرا', en: 'Marrakech, the red city' },
        items: [
          { ar: 'ساحة جامع الفنا بالليل وجامع الكتبية', en: 'Jemaa el-Fnaa at night and the Koutoubia Mosque' },
          { ar: 'قصر الباهية وحديقة ماجوريل', en: 'Bahia Palace and the Majorelle Garden' },
          { ar: 'الأسواق والحمام المغربي التقليدي', en: 'The souks and a traditional hammam' },
        ],
        tip: { ar: 'اسكن في رياض جوه المدينة القديمة — التجربة نفسها جزء من الرحلة.', en: 'Stay in a riad inside the medina — the experience is part of the trip.' },
      },
      {
        place: { ar: 'صحراء مرزوقة', en: 'Merzouga' }, photo: 'px:30628808',
        title: { ar: 'ليلة في الصحرا الكبرى', en: 'A night in the Sahara' },
        items: [
          { ar: 'طريق جبال الأطلس وقصبة آيت بن حدو', en: 'Over the Atlas Mountains via Aït Benhaddou' },
          { ar: 'ركوب الجمال وقت الغروب على كثبان عرق الشبي', en: 'A sunset camel ride over the Erg Chebbi dunes' },
          { ar: 'مبيت في مخيم وسط الرمال تحت النجوم', en: 'A night in a desert camp under the stars' },
        ],
        tip: { ar: 'الرحلة من مراكش طويلة (3 أيام رايح جاي) — خدها مع شركة منظمة.', en: 'It is a long journey from Marrakech (3 days round trip) — go with an organised tour.' },
      },
      {
        place: { ar: 'فاس', en: 'Fes' }, photo: 'px:38112164',
        title: { ar: 'فاس العتيقة ومدابغها', en: 'Ancient Fes & its tanneries' },
        items: [
          { ar: 'المدينة القديمة — أكبر منطقة مشاة في العالم', en: "The medina — the world's largest car-free urban area" },
          { ar: 'مدبغة الشوارة من فوق السطوح', en: 'The Chouara tannery from the rooftops' },
          { ar: 'جامع القرويين، أقدم جامعة في العالم', en: 'Al-Qarawiyyin, the oldest university in the world' },
        ],
        tip: { ar: 'خد مرشد رسمي لأول يوم — الحواري متاهة حقيقية.', en: 'Hire an official guide for the first day — the alleys are a true maze.' },
      },
      {
        place: { ar: 'شفشاون', en: 'Chefchaouen' }, photo: 'px:33912190',
        title: { ar: 'شفشاون اللؤلؤة الزرقا', en: 'Chefchaouen, the blue pearl' },
        items: [
          { ar: 'تمشية في الحواري الزرقا من أولها لآخرها', en: 'Wander the blue lanes end to end' },
          { ar: 'الجامع الإسباني والغروب على المدينة', en: 'The Spanish Mosque viewpoint at sunset' },
          { ar: 'شلالات أقشور في الطبيعة القريبة', en: 'The nearby Akchour waterfalls' },
        ],
        tip: { ar: 'روح بدري الصبح قبل الزحمة عشان تاخد أحلى صور.', en: 'Go early in the morning before the crowds for the best photos.' },
      },
    ],
    budget: {
      low: [
        { k: { ar: 'السكن', en: 'Stay' }, usd: 25 },
        { k: { ar: 'الأكل', en: 'Food' }, usd: 15 },
        { k: { ar: 'المواصلات', en: 'Transport' }, usd: 12 },
        { k: { ar: 'الأنشطة والدخول', en: 'Activities' }, usd: 10 },
      ],
      mid: [
        { k: { ar: 'السكن', en: 'Stay' }, usd: 70 },
        { k: { ar: 'الأكل', en: 'Food' }, usd: 30 },
        { k: { ar: 'المواصلات', en: 'Transport' }, usd: 25 },
        { k: { ar: 'الأنشطة والدخول', en: 'Activities' }, usd: 25 },
      ],
      flight: { ar: 'الطيران من القاهرة للدار البيضاء ذهاب وعودة غالباً بين 350 و 600 دولار.', en: 'Return flights Cairo–Casablanca usually run $350–600.' },
    },
    faq: [
      { q: { ar: 'إزاي أتنقل بين المدن؟', en: 'How do I get between cities?' }, a: { ar: 'في قطار مريح بين الدار البيضاء وفاس ومراكش وطنجة (والبراق السريع لطنجة). للصحرا وشفشاون الباصات (CTM) أو رحلة منظمة.', en: 'Comfortable trains link Casablanca, Fes, Marrakech and Tangier (with the Al Boraq high-speed line). For the desert and Chefchaouen, use CTM buses or a tour.' } },
      { q: { ar: 'هفهم اللهجة؟', en: 'Will I understand the dialect?' }, a: { ar: 'الدارجة صعبة في الأول، بس أغلب الناس بيفهموا الفصحى والمصري من الأفلام والمسلسلات.', en: 'Darija is tough at first, but most people understand Modern Standard Arabic and Egyptian from films and TV.' } },
      { q: { ar: 'إزاي أفاصل في السوق؟', en: 'How do I bargain in the souk?' }, a: { ar: 'ابدأ بحوالي تلت أو نص السعر الأول، وخليك هادي ومبتسم. لو مش عاجبك امشي — غالباً هينادوا عليك.', en: 'Open at a third to half of the first price, and stay calm and friendly. Walk away if unhappy — they often call you back.' } },
      { q: { ar: 'أجيب كاش ولا فيزا؟', en: 'Cash or card?' }, a: { ar: 'الكاش أساسي في الأسواق والتاكسي. الفيزا ماشية في الفنادق والمطاعم الكبيرة، والـ ATM منتشرة.', en: 'Cash rules in souks and taxis. Cards work in hotels and bigger restaurants, and ATMs are everywhere.' } },
      { q: { ar: 'الجو عامل إزاي في الصحرا؟', en: "What's the desert weather like?" }, a: { ar: 'حر جداً بالنهار في الصيف، وبارد جداً بالليل خصوصاً في الشتا. خد طبقات هدوم وجاكيت.', en: 'Very hot by day in summer and cold at night, especially in winter. Pack layers and a jacket.' } },
    ],
    dayLabels: ['1–3', '4–6', '7–8', '9'],
    offersLink: 'offers?cat=abroad',
  },

  kenya: {
    name: { ar: 'كينيا', en: 'Kenya' },
    hero: 'px:37419265',
    tagline: { ar: 'سفاري الماساي مارا، أفيال تحت كليمنجارو، وبحر المحيط الهندي', en: 'Maasai Mara safaris, elephants under Kilimanjaro and the Indian Ocean' },
    intro: {
      ar: 'كينيا هي أحسن مكان تعيش فيه سفاري حقيقي: الأسود والفهود والأفيال في الطبيعة، ومن يوليو لأكتوبر الهجرة الكبرى لملايين الحيوانات. وبعد السفاري تختم على شط ديناني الأبيض.',
      en: 'Kenya is the place for a real safari: lions, cheetahs and elephants in the wild, and from July to October the Great Migration of millions of animals. Finish on the white sand of Diani Beach.',
    },
    facts: [
      { icon: 'cal', k: { ar: 'أحسن وقت', en: 'Best time' }, v: { ar: 'يوليو – أكتوبر (الهجرة)، يناير – فبراير', en: 'Jul – Oct (migration), Jan – Feb' } },
      { icon: 'clock', k: { ar: 'المدة المناسبة', en: 'Ideal length' }, v: { ar: '8 – 10 أيام', en: '8 – 10 days' } },
      { icon: 'shield', k: { ar: 'الدخول', en: 'Visa' }, v: { ar: 'تصريح إلكتروني eTA أو من غير تأشيرة', en: 'eTA online, or visa-free' } },
      { icon: 'money', k: { ar: 'العملة', en: 'Currency' }, v: { ar: 'شلن كيني (KES)', en: 'Kenyan shilling (KES)' } },
      { icon: 'users', k: { ar: 'اللغة', en: 'Language' }, v: { ar: 'إنجليزي وسواحيلي', en: 'English & Swahili' } },
      { icon: 'plane', k: { ar: 'المطار', en: 'Airports' }, v: { ar: 'نيروبي (JKIA) أو مومباسا', en: 'Nairobi (JKIA) or Mombasa' } },
    ],
    days: [
      {
        place: { ar: 'نيروبي', en: 'Nairobi' }, photo: 'px:29506189',
        title: { ar: 'نيروبي: سفاري جنب العاصمة', en: 'Nairobi: a safari beside the capital' },
        items: [
          { ar: 'حديقة نيروبي الوطنية — حيوانات وورا منها ناطحات سحاب', en: 'Nairobi National Park — wildlife with skyscrapers behind' },
          { ar: 'ملجأ صغار الأفيال وقت الرضاعة', en: 'The baby elephant orphanage at feeding time' },
          { ar: 'مركز الزرافات وتأكّلها بإيدك', en: 'The Giraffe Centre — feed them by hand' },
        ],
        tip: { ar: 'خد خط موبايل Safaricom من المطار — الفلوس والدفع كله بـ M-Pesa.', en: 'Get a Safaricom SIM at the airport — payments run on M-Pesa.' },
      },
      {
        place: { ar: 'الماساي مارا', en: 'Maasai Mara' }, photo: 'px:26052417',
        title: { ar: 'سفاري الماساي مارا', en: 'Safari in the Maasai Mara' },
        items: [
          { ar: 'جولات سفاري الصبح بدري وبعد العصر', en: 'Game drives at dawn and late afternoon' },
          { ar: 'الأسود والفهود والأفيال و"الخمسة الكبار"', en: 'Lions, cheetahs, elephants and the "Big Five"' },
          { ar: 'عبور الحيوانات لنهر مارا (يوليو – أكتوبر)', en: 'The Mara River crossings (July – October)' },
          { ar: 'اختياري: بالون فوق السهول مع الشروق', en: 'Optional: a sunrise balloon over the plains' },
        ],
        tip: { ar: 'رسوم دخول المحمية غالية وبتزيد في موسم الهجرة — احسبها في الميزانية.', en: 'Reserve fees are high and rise in migration season — budget for them.' },
      },
      {
        place: { ar: 'أمبوسيلي', en: 'Amboseli' }, photo: 'px:26924191',
        title: { ar: 'أفيال أمبوسيلي وكليمنجارو', en: 'Amboseli elephants & Kilimanjaro' },
        items: [
          { ar: 'قطعان أفيال كبيرة قدام جبل كليمنجارو', en: 'Big elephant herds in front of Mount Kilimanjaro' },
          { ar: 'المستنقعات والطيور وفرس النهر', en: 'Swamps, birdlife and hippos' },
          { ar: 'زيارة قرية من قرى الماساي', en: 'A visit to a Maasai village' },
        ],
        tip: { ar: 'الجبل بيبان أوضح بدري الصبح — بعد كده السحاب بيغطيه.', en: 'Kilimanjaro shows best at dawn — clouds cover it later.' },
      },
      {
        place: { ar: 'شاطئ ديناني', en: 'Diani Beach' }, photo: 'px:13292007',
        title: { ar: 'استرخاء على شط ديناني', en: 'Unwind on Diani Beach' },
        items: [
          { ar: 'طيران داخلي أو قطار SGR لمومباسا', en: 'Domestic flight or SGR train to Mombasa' },
          { ar: 'رمل أبيض ومية فيروزي على المحيط الهندي', en: 'White sand and turquoise Indian Ocean water' },
          { ar: 'غطس وسنوركل ورحلة مركب لمحمية كيسيتي', en: 'Snorkelling and a dhow trip to Kisite marine park' },
        ],
        tip: { ar: 'مومباسا ومنطقة الساحل فيها أكل حلال كتير ومساجد.', en: 'Mombasa and the coast have plenty of halal food and mosques.' },
      },
    ],
    budget: {
      low: [
        { k: { ar: 'السكن', en: 'Stay' }, usd: 50 },
        { k: { ar: 'الأكل', en: 'Food' }, usd: 20 },
        { k: { ar: 'المواصلات', en: 'Transport' }, usd: 30 },
        { k: { ar: 'السفاري ورسوم المحميات', en: 'Safari & park fees' }, usd: 100 },
      ],
      mid: [
        { k: { ar: 'السكن', en: 'Stay' }, usd: 150 },
        { k: { ar: 'الأكل', en: 'Food' }, usd: 40 },
        { k: { ar: 'المواصلات', en: 'Transport' }, usd: 60 },
        { k: { ar: 'السفاري ورسوم المحميات', en: 'Safari & park fees' }, usd: 220 },
      ],
      flight: { ar: 'في رحلات مباشرة من القاهرة لنيروبي، وذهاب وعودة غالباً بين 450 و 800 دولار.', en: 'Direct flights run Cairo–Nairobi; return fares usually $450–800.' },
    },
    faq: [
      { q: { ar: 'محتاج تطعيمات؟', en: 'Do I need vaccinations?' }, a: { ar: 'شهادة الحمى الصفرا مطلوبة لو جاي من بلد فيها المرض، ومُستحسنة عموماً. كلّم دكتور عن دوا الملاريا قبل السفر بأسابيع.', en: 'A yellow fever certificate is required if arriving from an endemic country and is recommended anyway. Ask a doctor about malaria tablets weeks ahead.' } },
      { q: { ar: 'السفاري لوحدي ولا مع شركة؟', en: 'Safari solo or with a company?' }, a: { ar: 'مع شركة أحسن بكتير: عربية 4×4 بسقف بيتفتح وسواق مرشد عارف الحيوانات فين. قارن عروض الشركات في رحّالة.', en: 'A company is far better: a pop-top 4×4 and a driver-guide who knows where the animals are. Compare agency offers on Rahhala.' } },
      { q: { ar: 'هل كينيا آمنة؟', en: 'Is Kenya safe?' }, a: { ar: 'مناطق السفاري والساحل السياحي آمنة مع الشركات المعروفة. في نيروبي استخدم Uber أو Bolt بالليل وما تمشيش بحاجات غالية.', en: 'Safari areas and the tourist coast are safe with reputable operators. In Nairobi use Uber or Bolt at night and keep valuables out of sight.' } },
      { q: { ar: 'ألبس إيه في السفاري؟', en: 'What to wear on safari?' }, a: { ar: 'ألوان هادية (بيج وزيتي)، جاكيت للصبح البدري، قبعة ونضارة شمس، وكريم ضد الناموس.', en: 'Neutral colours (beige, olive), a jacket for chilly dawns, a hat, sunglasses and insect repellent.' } },
      { q: { ar: 'إمتى أشوف الهجرة الكبرى؟', en: 'When can I see the Great Migration?' }, a: { ar: 'في الماساي مارا تقريباً من يوليو لأكتوبر، وعبور النهر غالباً في أغسطس وسبتمبر. احجز بدري لأنه أعلى موسم.', en: 'In the Maasai Mara roughly July to October, with river crossings mostly in August and September. Book early — it is peak season.' } },
    ],
    dayLabels: ['1', '2–4', '5–6', '7–9'],
    offersLink: 'offers?cat=abroad',
  },
};

export const GUIDE_ORDER = ['georgia', 'armenia', 'egypt', 'italy', 'switzerland', 'morocco', 'kenya'];
