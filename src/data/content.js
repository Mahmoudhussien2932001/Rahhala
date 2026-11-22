/* Static editorial content (travel tips + FAQ) */
export const ARTICLES = [
  {
    photo: 'px:30273249', cat: 'umrah', tag: { ar: 'عمرة', en: 'Umrah' },
    title: { ar: 'إزاي تختار شركة عمرة تطمن لها', en: 'How to choose an Umrah agency you can trust' },
    sum: { ar: 'الترخيص، العقد المكتوب، والمسافة الحقيقية بين الفندق والحرم.', en: 'License, a written contract, and the real hotel-to-Haram distance.' },
    body: [
      { ar: 'أول حاجة اتأكد إن الشركة مرخّصة وإن رقم الترخيص بتاعها حقيقي. على رحّالة الشركات الموثّقة عليها علامة الدرع.', en: 'First, make sure the agency is licensed and its license number is real. On Rahhala, verified agencies carry the shield badge.' },
      { ar: 'اطلب عقد مكتوب فيه اسم الفندق بالظبط ونوع الطيران (مباشر ولا ترانزيت) وعدد الليالي في مكة والمدينة.', en: 'Ask for a written contract naming the exact hotel, the flight type (direct or transit) and the nights in Makkah and Madinah.' },
      { ar: 'متكتفيش بكلمة "قريب من الحرم": اسأل عن المسافة بالمتر أو بالدقايق مشي، وقارن بين عرضين أو تلاتة قبل ما تقرر.', en: 'Don\'t settle for "near the Haram": ask for the distance in meters or walking minutes, and compare two or three offers before deciding.' },
    ],
  },
  {
    photo: 'px:13010781', cat: 'beach', tag: { ar: 'مصايف', en: 'Beach' },
    title: { ar: 'أحسن وقت تروح فيه البحر الأحمر', en: 'The best time to visit the Red Sea' },
    sum: { ar: 'الربيع والخريف هما الأحلى، والشتا دافي في الجنوب.', en: 'Spring and autumn are best; winter stays warm in the south.' },
    body: [
      { ar: 'الربيع (مارس لمايو) والخريف (سبتمبر لنوفمبر) الجو فيهم معتدل والمية حلوة للغطس والسنوركل.', en: 'Spring (March–May) and autumn (September–November) bring mild weather and great water for diving and snorkeling.' },
      { ar: 'في الشتا، مرسى علم وجنوب البحر الأحمر بيفضلوا أدفى من الشمال، وده وقت مناسب للهدوء وأسعار أقل.', en: 'In winter, Marsa Alam and the southern Red Sea stay warmer than the north — a quieter time with lower prices.' },
      { ar: 'الصيف حر جداً بالنهار، فلو هتسافر فيه اختار فندق على البحر وخطط للأنشطة الصبح بدري أو بعد العصر.', en: 'Summer days are very hot, so pick a beachfront hotel and plan activities early morning or late afternoon.' },
    ],
  },
  {
    photo: 'px:27430541', cat: 'adventure', tag: { ar: 'سفاري وجبال', en: 'Mountains' },
    title: { ar: 'شنطتك لطلوع جبل موسى', en: 'Your Mount Sinai packing list' },
    sum: { ar: 'هدوم طبقات، كشاف، مية، وجزمة مريحة للطلوع بالليل.', en: 'Layers, a headlamp, water and comfy shoes for the night climb.' },
    body: [
      { ar: 'الطلوع غالباً بيبدأ بعد نص الليل عشان توصل القمة وقت الشروق، والجو فوق بيبقى برد حتى في الصيف، فخد هدوم طبقات وجاكيت.', en: 'Climbs usually start after midnight to reach the summit for sunrise, and it gets cold at the top even in summer — bring layers and a jacket.' },
      { ar: 'خد كشاف رأس أو كشاف صغير، ومية كفاية، وحاجة خفيفة تتاكل، وجزمة رياضي مريحة بنعل كويس.', en: 'Bring a headlamp, enough water, light snacks and comfortable trainers with good grip.' },
      { ar: 'امشي على مهلك مع المرشد، وريّح كل شوية، وماتتأخرش عن الجروب عشان الطريق في الضلمة.', en: 'Walk at a steady pace with the guide, rest often, and stay with the group since the path is dark.' },
    ],
  },
];

export const FAQ = [
  { q: { ar: 'هل الحجز بيتم عن طريق رحّالة؟', en: 'Do I book through Rahhala?' }, a: { ar: 'لأ. رحّالة بتعرضلك العروض وتساعدك تقارن بينها، والحجز والدفع بيتموا مع الشركة نفسها مباشرة.', en: 'No. Rahhala shows and compares offers; booking and payment happen directly with the agency.' } },
  { q: { ar: 'هل الشركات اللي على المنصة مرخّصة؟', en: 'Are the agencies licensed?' }, a: { ar: 'كل شركة بتسجل برقم ترخيصها، والشركات اللي اتراجعت بياناتها عليها علامة "موثّقة".', en: 'Every agency registers with its license number, and reviewed agencies get a "Verified" badge.' } },
  { q: { ar: 'هل فيه رسوم على المسافر؟', en: 'Is there a fee for travelers?' }, a: { ar: 'لأ، البحث والمقارنة وإرسال طلبات الحجز ببلاش.', en: 'No — searching, comparing and sending booking requests are free.' } },
  { q: { ar: 'أقارن كام عرض مع بعض؟', en: 'How many offers can I compare?' }, a: { ar: 'لحد 3 عروض في نفس الوقت، وبنعلّملك الأرخص وأرخص سعر لليلة والأعلى تقييماً.', en: 'Up to 3 at once — we highlight the cheapest, the lowest per-night price and the highest rated.' } },
  { q: { ar: 'إزاي أضيف شركتي؟', en: 'How do I list my agency?' }, a: { ar: 'تواصل مع إدارة المنصة، وهيتعملك حساب ولوحة تحكم خاصة بشركتك.', en: "Contact the platform team and we'll create an account and a private dashboard for your agency." } },
];
