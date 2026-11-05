# أسئلة: إيه الفرق بين نشر الديمو ونشر Laravel كامل؟

[الفهرس](00-start-here.md) · مستوى: بعد فهم startup وAPI. الشرح هنا من ملفات البناء الحالية، مش خطوات ضغط أزرار في لوحة Cloudflare ممكن تتغير.

مراجع العرض المسجلة في المشروع: [Pizza demo](https://pizza-ordering-preview.pages.dev/) و[AutoCare demo](https://autocare-pro-40f.pages.dev/). دي روابط مرجعية، مش ادعاء بفحص توافرها الآن. كل مثال على build يتنفّذ يدويًا لما تختار، مش درس ينشر موقعك تلقائيًا.

## سؤال 1: نفس استدعاء API يشتغل إزاي بدون PHP في الديمو؟

**مقتطف فعلي** من [csrfFetch](../resources/js/lib/api.js)، داخل الدالة:

```js
if (import.meta.env.VITE_DEMO_MODE === 'true') {
    const { demoFetch } = await import('../demo/api');
    return demoFetch(url, options);
}
```

1. `if` شرط؛ import.meta.env إعدادات Vite المتاحة أثناء البناء؛ المقارنة بالنص `'true'` مش Boolean true.
2. dynamic import ترجع Promise؛ await تنتظر الموديول؛ `{ demoFetch }` تفكيك الخاصية من الموديول.
3. رجّع نتيجة المحاكي بدل تنفيذ fetch الحقيقي الموجود لاحقًا في الدالة.
4. نهاية الشرط.

**بإيدك:** افتح [demo/api.js](../resources/js/demo/api.js) وابحث عن localStorage. المتوقع تلاقي تخزين محلي ومحاكاة مسارات؛ مش اتصال بالمطعم أو Stripe.

**غلطة شائعة:** تعتبر demo login نظام حماية. الزائر يختار حساب عرض محلي؛ السيرفر الحقيقي فقط يفرض الأدوار على بيانات مشتركة.

**سؤال إنترفيو:** الديمو بيثبت إن الدفع الحقيقي شغّال؟

<details><summary>الإجابة</summary>لأ. بوابات الدفع الحقيقية تحتاج backend وإعدادات واختبارات منفصلة؛ المحاكي يرفض تشغيل الدفع.</details>

## سؤال 2: أبني وأشوف الديمو محليًا إزاي؟

من فولدر `pizza-crm`، أوامر موجودة في [package.json](../package.json):

```powershell
npm.cmd run demo:build
npm.cmd run demo:preview
```

1. يبني الواجهة بوضع demo ثم يجهّز الأصول داخل dist-demo. ده بيستبدل مخرجات البناء السابقة في الفولدر المخصص، مش بيانات Laravel.
2. يشغّل preview محلي على `http://127.0.0.1:4173`؛ خليه شغّال وافتح الرابط. ده مش نشر production.

**بإيدك:** استخدم بيانات اتصال وهمية. افتح tracking وstaff في تبويبين لنفس المتصفح. المتوقع التغييرات تظهر مع polling؛ متصفح أو جهاز تاني ليه مخزن منفصل.

**غلطة شائعة:** رفع فولدر Laravel كله إلى استضافة static. ارفع ناتج البناء المخصص فقط بعد مراجعته؛ لا .env ولا database ولا vendor ولا بيانات العملاء.

**سؤال إنترفيو:** ليه طلب GET للديمو مش شرط يظهر في Network كطلب Laravel؟

<details><summary>الإجابة</summary>لأن csrfFetch في وضع demo بيستدعي محاكي JavaScript محلي بدل fetch شبكة.</details>

تحديث snapshot الكتالوج متاح بأمر `npm.cmd run demo:export` لكنه يقرأ DB المحلية ويكتب JSON عام؛ راجع إعداداتك ومحتوى التصدير قبل تشغيله. مش مطلوب للدرس.

## سؤال 3: مين يشغّل Laravel الحقيقي؟

الديمو static يستضيف HTML/CSS/JS وأصولًا عامة. نشر backend كامل يحتاج بيئة PHP وتشغيل Laravel وإعداد DB وجلسات ومفاتيح خاصة وwebhooks وHTTPS. مش بيحصل تلقائيًا برفع dist-demo.

**مقتطف فعلي** من [تجهيز حزمة Pizza](../scripts/package-demo.mjs):

```js
const assets = new Set(['images/logo.png', 'videos/hero-pizza-motion.mp4']);
for (const item of catalog.items) {
    if (item.image_path) assets.add(item.image_path.replace(/^\//, ''));
}
```

1. Set قائمة قيم فريدة؛ تضم أصول العرض المطلوبة.
2. for...of تمرّ على المنتجات المصدّرة في catalog.
3. لو المنتج له صورة أضف مسارها بعد إزالة slash البداية؛ ده لنسخ المسار من public لاحقًا.
4. نهاية الحلقة.

**بإيدك:** حدّد في نفس السكربت اختبار startsWith اللي يمنع خروج المصدر والهدف عن المجلدات المقصودة. المطلوب فهمه، مش إضافة مسارات حساسة للتجربة.

**غلطة شائعة:** اعتبار كل `VITE_` سرًا. القيم المستخدمة في frontend ممكن تدخل bundle العام؛ مفاتيح السيرفر السرية ممنوعة هناك.

**سؤال إنترفيو:** ليه allowlist للأصول أفضل من نسخ كل المشروع؟

<details><summary>الإجابة</summary>بتقلل احتمال تسريب ملفات غير لازمة، لكن لازم تراجع الناتج وإعدادات build كمان؛ مش ضمان أمان شامل.</details>

## سؤال 4: ليه refresh لمسار داخلي ممكن يعمل404؟

React Router بيغيّر URL داخل المتصفح، لكن refresh يطلب نفس URL من الاستضافة. Pizza packaging بيكتب rewrite يرجّع index.html لمسارات SPA. AutoCare بيولّد my-garage.html لمسار مستقل بدل الاعتماد على نفس القاعدة.

**بإيدك:** قارن [Pizza package-demo](../scripts/package-demo.mjs) مع [AutoCare build-cloudflare](../../autocare-booking/scripts/build-cloudflare.mjs)، وحدد السطر اللي ينشئ كل حل.

**سؤال إنترفيو:** هل rewrite يخلق API backend؟

<details><summary>الإجابة</summary>لأ؛ بيرجع HTML للواجهة، مش منطق Laravel. إعداد routing للصفحات مختلف عن تنفيذ API.</details>

اختبارات العرض الفعلية: [demo tests](../tests/demo/orders.test.mjs). شرح أوامر الاختبار في [15](15-testing-git-and-debugging.md).
