# رحّالة · Rahhala (React)

منصة بتجمع عروض شركات السياحة في مكان واحد: عمرة، مصايف، شقق وشاليهات، سفر للخارج، وسفاري وجبال.
المستخدم بيقارن بين العروض ويبعت طلب حجز للشركة، وكل شركة ليها لوحة تحكم خاصة بيها، وفيه لوحة أدمن بتشوف كل حاجة.

- الموقع عربي وإنجليزي.
- الصور حقيقية من Pexels.
- فيه بحر 3D واقعي معمول بـ three.js.
- كل الشركات والعروض والأسعار وهمية للعرض بس.

## التشغيل

```bash
npm install
npm run dev
```
الموقع هيفتح لوحده على `http://localhost:5173`.

للنشر شغّل `npm run build` والملفات هتطلع في `dist/`، وتقدر ترفعها على Vercel أو Netlify زي ما هي.
الروابط معمولة بنظام `#/` فمش محتاج تضبط أي حاجة في السيرفر.

## حسابات الدخول

| الدور | الإيميل | الباسورد |
|---|---|---|
| أدمن | mahmoudhussien200111@gmail.com | Admin@2026 |
| شركة | madar@demo.com | Demo@123 |
| باقي الشركات | seastar, waha, ofok, bawaba, lulu, konoz, marsa, peaks, mawj, bosla, shore + `@demo.com` | Demo@123 |

## هيكل المشروع

```
src/
  App.jsx                  الراوتر وترتيب الصفحات
  main.jsx                 نقطة البداية
  styles/global.css        الهوية والألوان وكل الستايل (المتغيرات في :root)
  lib/
    i18n.jsx               اللغة: T('عربي','English') و L({ar,en})
    router.jsx             راوتر صغير بالـ hash: #/offers?cat=beach
    photos.js              روابط صور Pexels
    format.js, hash.js, storage.js
  data/
    catalog.js             أنواع الرحلات، الوجهات وصورها، المدن، المميزات
    seed.js                الشركات والعروض والطلبات الوهمية
    content.js             المقالات والأسئلة الشائعة
  store/store.jsx          "قاعدة البيانات" (localStorage) وتسجيل الدخول والمقارنة
  components/
    HeroSlider.jsx         أول الصفحة: صور حقيقية بتتبدّل بزووم بطيء وحركة مع الماوس
    Ocean3D.jsx            البحر الـ 3D (Water + Sky من three.js) وجبال في الأفق
    Media.jsx              Photo و Reveal (أنيميشن الظهور) و Counter و ParallaxPhoto
    Cards.jsx, Modals.jsx, Layout.jsx, Charts.jsx, UI.jsx, Icon.jsx
  pages/
    Home.jsx, Offers.jsx, Browse.jsx (الوجهات/الشركات/المقارنة/الدخول)
    dashboard/AgencyDashboard.jsx, AdminDashboard.jsx, forms.jsx, parts.jsx
```

## حاجات لازم تعرفها

- **الصور:** بتتحمّل من Pexels (مجانية الاستخدام). لو هتنشر الموقع بجد، نزّل الصور اللي هتستخدمها في `public/` وغيّر الروابط في `src/lib/photos.js`.
- **الصلاحيات والبيانات:** تسجيل الدخول معمول في المتصفح، يعني للعرض بس ومش آمن. والبيانات متخزنة في `localStorage`، يعني كل متصفح ليه نسخته لوحده. عشان تنشره بجد اربطه بـ Supabase أو Firebase أو API بتاعك، وكل التعامل مع البيانات موجود في ملف واحد هو `src/store/store.jsx`.
- **إعادة البيانات التجريبية:** من لوحة الأدمن ← الإعدادات ← "رجّع البيانات التجريبية".
