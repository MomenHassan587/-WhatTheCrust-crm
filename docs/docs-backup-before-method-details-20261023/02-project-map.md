# التطبيق بيبدأ منين؟ أربع أسئلة من ملفاتك

مش مطلوب تحفظ شجرة كل الفولدرات. المطلوب لما تفتح URL تعرف: مين استقبل الطلب؟ مين رجّع HTML؟ مين شغّل JavaScript؟ ومين عرض الواجهة؟

## 1. Pizza: ليه فيه Blade وapp.jsx؟

**السؤال:** لو كتبت `/menu` في العنوان، مين بيعرض المنيو؟

مصادر فعلية: [routes/web.php](../routes/web.php)، [app.blade.php](../resources/views/app.blade.php)، [app.jsx](../resources/js/app.jsx).

**مقتطف فعلي من آخر routes/web.php:**

```php
Route::get('/{view?}', function () {
    return view('app');
})->where('view', '^(?!api).*$');
```

- `Route::get` يسجل handler لطلبات GET.
- `/{view?}` parameter اختياري؛ شرط `where` يسمح له بمطابقة المسارات المقصودة.
- `function () {}` دالة تنفذ عند المطابقة.
- `return view('app')` رجّع `resources/views/app.blade.php`.
- `where` regex تستبعد المسارات اللي تبدأ بـ `api` من الـ catch-all؛ API المعرّفة فوق لها handlers منفصلة.

المتصفح يطلب URL، مش بيشغّل ملف Blade. PHP يعالج Blade على السيرفر.

**مقتطف فعلي من Blade، كل سطر من موضعه:**

```blade
@viteReactRefresh
@vite(['resources/css/app.css', 'resources/js/app.jsx'])
```

وداخل body:

```html
<div id="root"></div>
```

- `@viteReactRefresh` تكامل React refresh في التطوير.
- `@vite` يولد asset tags؛ في التطوير من Vite server، وفي build من manifest.
- `root` مكان تركيب React؛ مش مكان تخزين البيانات.

**مقتطف فعلي من نهاية app.jsx:**

```jsx
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
```

- `document.getElementById` يجيب عنصر root.
- `createRoot` يجهز React root، و`render` يعرض المكوّن.
- `StrictMode` فحوص تطوير؛ ممكن يعيد تشغيل render/effect setup-cleanup للمساعدة في اكتشاف أخطاء. مش سبب لإلغاء cleanup.
- `<App />` مكوّن React، مش ملف HTML جديد.

داخل App موجود BrowserRouter وAuthProvider وCatalogProvider وOrderProvider. داخل AppShell موجود Navbar وRoutes وFooter. مثلًا **سطر فعلي**:

```jsx
<Route path="/menu" element={<MenuPage />} />
```

React Router يختار MenuPage؛ Laravel رجّع HTML shell، مش HTML المنيو كاملًا. تغيير الشاشة بـ Link ممكن يتم client-side بدون طلب مستند جديد.

**تمرين يدوي:** افتح DevTools → Network، افتح `/menu` مباشرة، وبعدين انتقل بـ Link للسلة. **المتوقع:** أول مرة document، والانتقال الداخلي مش لازم يحمل Blade تاني. ملفات البيانات قد تُطلب بشكل مستقل.

**خطأ شائع:** تقول إن Laravel route وReact Route نفس الطبقة؛ واحد في السيرفر وواحد في المتصفح.

**سؤال إنترفيو:** هل دي SSR؟ **الإجابة:** الواجهة الأساسية client-rendered من React؛ وجود Blade shell لا يساوي React server-side rendering.

## 2. AutoCare: app.js بيختار App.vue إزاي؟

مصادر: [routes](../../autocare-booking/routes/web.php)، [Blade](../../autocare-booking/resources/views/app.blade.php)، [app.js](../../autocare-booking/resources/js/app.js).

**مقتطف فعلي من app.js:**

```js
const isGarage = location.pathname.replace(/\/$/, '') === '/my-garage';
document.title = isGarage ? 'My Garage | AutoCare Pro' : 'AutoCare Pro | Car care, with clarity';
const Page = defineAsyncComponent(() => isGarage
    ? import('./components/GarageDashboard.vue')
    : import('./components/App.vue'));

createApp(Page).mount('#app');
```

السياق: الملف مستورد فيه `createApp` و`defineAsyncComponent` من Vue فوق المقتطف.

- `location.pathname` مسار العنوان بدون domain وquery.
- `.replace(/\/$/, '')` يشيل slash النهائية؛ `$` نهاية النص، و`\/` slash حرفية في regex.
- `===` يرجع Boolean؛ `/my-garage/` يتطبع لـ `/my-garage` قبل المقارنة.
- `condition ? A : B` ternary يختار واحد من قيمتين؛ هنا عنوان الصفحة ثم المكوّن.
- `defineAsyncComponent` يأخذ loader؛ `import(...)` الديناميكية ترجع Promise وتتيح تحميل chunk حسب الاختيار.
- `mount('#app')` يطابق `<div id="app">` في Blade.

مفيش Vue Router في الأسلوب ده. اختيار root component بيحصل وقت بدء التطبيق، والتنقل العادي بين الصفحتين يعمل document navigation.

**تمرين:** افتح `/` ثم `/my-garage/` وراقب document title. **المتوقع:** عنوانان ومكوّنان مختلفان رغم نفس Blade view محليًا.

**خطأ شائع:** تغيير id في Blade إلى root وترك mount على app؛ Vue مش هيلاقي الهدف.

**سؤال إنترفيو:** إمتى أستخدم dynamic import؟ **الإجابة:** لما فصل التحميل مفيد، مع handling لحالات الانتظار والفشل؛ مش كل import لازم يبقى lazy.

## 3. Portfolio: فين Laravel وBlade؟

**الإجابة:** مش موجودين داخل المشروع ده. البداية HTML → TSX. مصادر: [index.html](../../mo-m-en-portfolio/index.html)، [main.tsx](../../mo-m-en-portfolio/src/main.tsx)، [App.tsx](../../mo-m-en-portfolio/src/App.tsx).

**مقتطف فعلي من index.html:**

```html
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

- `type="module"` يسمح باستيراد وحدات JavaScript.
- `src` مدخل التطوير؛ Vite يعالج TypeScript/JSX، وبعد build HTML يشير للملفات المبنية. المتصفح مش بيفهم TSX الخام بنفسه.

**مقتطف فعلي من main.tsx:**

```tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- نفس فكرة React root في Pizza.
- `!` بعد استدعاء getElementById هنا TypeScript non-null assertion: بنقول للـ type checker إن العنصر مش null.
- دي **مش** علامة عكس Boolean هنا، ومش بتعمل runtime validation؛ لو العنصر مفقود هيفضل فيه خطأ runtime.
- App بيجمع HeroSection وProjectsSection وContactSection وغيرها.

**تمرين:** افتح App.tsx وحدد مين بيحدد ترتيب الأقسام. **المتوقع:** ترتيب استدعاءات المكوّنات داخل return، مش ترتيب ملفات الفولدر.

**خطأ شائع:** تعتبر ContactSection فورم backend؛ الحالي يعرض دعوة وروابط، مش endpoint إرسال رسائل.

**سؤال إنترفيو:** TypeScript بيمنع كل runtime error؟ **الإجابة:** لا؛ الأنواع تساعد وقت التطوير والبناء، لكن البيانات الخارجية والـ DOM محتاجين تحقق مناسب.

## 4. النسخة المحلية والـ static demo نفس التنفيذ؟

**السؤال:** ليه عندي `/api/menu` في مشروع PHP والنسخة المنشورة ممكن تشتغل بدون PHP؟

مصدر: [csrfFetch](../resources/js/lib/api.js). **مقتطف فعلي من بداية الدالة:**

```js
if (import.meta.env.VITE_DEMO_MODE === 'true') {
    const { demoFetch } = await import('../demo/api');
    return demoFetch(url, options);
}
```

- `import.meta.env` قيم بيئة متاحة لكود Vite؛ المتغيرات العامة دي مش خزنة secrets.
- المقارنة مع النص `'true'`، مش Boolean true.
- لو demo، حمّل adapter محلي بدل fetch الشبكة في الفرع العادي.
- `return` يخرج من الدالة بالنتيجة؛ باقي كود الطلب الحقيقي مش بيتنفّذ في الفرع ده.

**تمرين:** اقرأ تعريف `isDemo` في [app.jsx](../resources/js/app.jsx) من غير تعديل ملفات البيئة. ليه صفحة Login بتعرض DemoAccounts في الديمو؟ **المتوقع:** personas محلية للعرض، مش إثبات هوية آمن على السيرفر.

**خطأ شائع:** تكتب في CV إن حساب demo بيحمي API إنتاج أو إن static hosting يشغّل Laravel تلقائيًا.

**سؤال إنترفيو:** هل VITE_ secret؟ **الإجابة:** لا؛ القيم المستخدمة في الفرونت يمكن تضمينها في bundle ويقدر المستخدم يشوفها. Secret keys تبقى في backend فقط.

## خريطة الرجوع السريعة

| محتاج تعدّل إيه؟ | المكان في Pizza |
|---|---|
| routes والـ middleware | `routes/web.php` و`bootstrap/app.php` |
| validation | `app/Http/Requests/` |
| استقبال API وتنسيق الرد | `app/Http/Controllers/Api/` |
| إنشاء order وتسعيره | `app/Services/Orders/OrderCreator.php` |
| DB والعلاقات | `database/migrations/` و`app/Models/` |
| React pages ومكوّنات | `resources/js/Pages/` و`resources/js/Components/` |
| حالة مشتركة | `resources/js/context/` |
| نسخة demo | `resources/js/demo/` |
| اختبارات | `tests/` |

ما تعدلش `vendor/` أو `node_modules/` أو generated build علشان تغيّر feature. ابدأ من مصدرها، وابنِ الملفات تاني بعد التعديل.
