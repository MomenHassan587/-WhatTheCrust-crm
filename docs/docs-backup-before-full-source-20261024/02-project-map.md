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

## 5. أنا مش حافظ methods البداية؛ كل واحدة وظيفتها إيه؟

مش كل كلمة في الكود method، ومش كل method بتجيب بيانات من السيرفر. خليك محدد في المدخل والناتج والأثر.

### PHP: `Route::get` و`view` و`where`

```php
Route::get('/{view?}', function () {
    return view('app');
})->where('view', '^(?!api).*$');
```

- `Route::get(uri, handler)` method Laravel لتسجيل مسار GET؛ arguments هنا pattern ودالة معالجة. ترجع Route object يمكن إضافة قيد عليه.
- تسجيل المسار لا يعني إن callback اتنفّذت فورًا ولا إن كل routes بترجع نفس الصفحة؛ Laravel تختار المطابقة للطلب القادم.
- `view('app')` helper Laravel، مش ملف JS. تاخد اسم view وترجع View object لـ `resources/views/app.blade.php`؛ Laravel ترندرها وتحوّلها لاستجابة HTML. ليست بيانات المنيو.
- `where('view', regex)` هنا method على Route تضيف قيدًا على parameter اسمه view. regex تمنع catch-all من خطف `/api...`؛ هذه ليست `where` الخاصة بجدول SQL.
- `{view?}` optional route parameter و`?` معناها اختياري داخل pattern ده، مش optional chaining JavaScript. `return` keyword ترجع View من callback.

### DOM: `document.getElementById('root')`

- method Web API تبحث في مستند HTML الحالي عن العنصر صاحب الـ id، وترجع Element أو null لو مش موجود.
- المدخل النص `'root'` بلا `#` هنا، بخلاف CSS selector المستخدم في Vue mount.
- لا تنشئ العنصر، لا تجيب ملف root من السيرفر، ولا ترجع component React.
- مثال: مع `<div id="root"></div>` النتيجة هي هذا DOM element؛ مع `<div id="app"></div>` فقط، البحث عن root يرجع null.

### React: `createRoot(element)` ثم `.render(tree)`

```jsx
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
```

- `ReactDOM.createRoot` method من React DOM. تستقبل DOM container حقيقية وترجع React Root object. ليست الصفحة المعروضة بعدُ ولا user state.
- `.render(...)` method على الـ Root: تاخد شجرة React elements وتبدأ عرضها/تحديثها في الحاوية. ترجع undefined، فلا تتوقع `const page = root.render(...)` يديك بيانات الصفحة.
- `<App />` JSX تُحوّل لبناء React element؛ React هي اللي تشغّل function component في دورة العرض المناسبة. مش بننادي `App()` يدويًا في bootstrap.
- `<React.StrictMode>` component للتشخيص وقت التطوير، مش method API ومش authentication. الفحوص الإضافية لا تعني إن الإنتاج يكرر نفس الـ requests بسبب هذا الاسم دائمًا؛ cleanup ضرورية على أي حال.

### AutoCare: `replace` هنا string method

```js
const isGarage = location.pathname.replace(/\/$/, '') === '/my-garage';
```

- `location.pathname` property Web API ترجع مسار URL الحالي كنص؛ لا تقرأ ملف PHP. `location` ليست method.
- `replace(pattern, replacement)` JavaScript String method تاخد نمطًا/نصًا وتستبدله في **نص جديد**؛ لا تعدّل عنوان المتصفح في هذا السطر.
- `/\/$/` regex تعني slash في النهاية؛ replacement `''` نص فارغ. `/my-garage/` تتحول لنص `/my-garage` للمقارنة فقط.
- `===` operator مقارنة صارمة ترجع Boolean. `isGarage` ستكون true أو false، وليست اسم component.
- انتبه: `history.replaceState` method أخرى تغيّر history؛ و`navigate(path, { replace: true })` في React Router سلوك آخر. نفس كلمة replace لا تعني نفس الأداة في أي مكان.

### `defineAsyncComponent(loader)` و`import(path)`

```js
const Page = defineAsyncComponent(() => isGarage
    ? import('./components/GarageDashboard.vue')
    : import('./components/App.vue'));
```

- `defineAsyncComponent` أداة Vue تستقبل loader function وترجع component wrapper؛ لا ترجع Promise تحميل مباشرة إلى متغير Page.
- `() => ...` الدالة المؤجلة التي Vue تناديها عند الحاجة للمكوّن. اختيار ternary يحدد أي import تتنفذ.
- `import(path)` الديناميكية جزء من نظام JavaScript modules، لا دالة كتبناها. ترجع Promise لـ module namespace بعد التحميل أو ترفض عند الفشل. Vue wrapper تتعامل مع مكوّن module المحمّلة.
- الـ static `import { createApp } from 'vue'` في أعلى الملف إعلان استيراد، مختلف عن expression الديناميكية دي.
- في Vite ملفات `.vue` تتحول لكود قابل للتشغيل؛ المتصفح مش بيفسّر قالب Vue الخام مباشرة كأنه HTML كامل.

### `createApp(Page)` ثم `mount('#app')`

- `createApp(rootComponent)` أداة Vue ترجع application instance. المدخل Page اللي اختارناها، مش DOM element.
- `.mount('#app')` method على التطبيق تختار mounting container وتبدأ العرض؛ يمكنها أخذ selector أو DOM element. ترجع public root component instance، والمشروع لا يستخدمها هنا.
- `'#app'` CSS id selector، لازم يطابق `id="app"` في HTML shell. ده مختلف عن getElementById اللي بتاخد الاسم بلا #.
- لا fetch بيانات عملاء يحصل تلقائيًا لمجرد mount. أي API أو localStorage لازم كود مكوّناتك يناديها صراحة.

### TypeScript `!` وVite env مش methods

- `document.getElementById('root')!` في Portfolio non-null assertion للـ type checker. لا ينشئ عنصرًا ناقصًا، ولا يفحص null وقت التشغيل.
- `import.meta.env.VITE_DEMO_MODE` قراءة build-time frontend configuration؛ ليست طريقة آمنة لإخفاء secret.
- `document.title = ...` إسناد property يغيّر عنوان تبويب المتصفح، لا method ولا تعديل لملف Blade على القرص.

## 6. متابعة AutoCare من أول URL لحد مكوّن الصفحة من غير حلقة ناقصة

### أ. السيرفر المحلي يرد على المسارين: `routes/web.php`

**المحتوى الفعلي لمساري المشروع:**

```php
Route::view('/', 'app');
Route::view('/my-garage', 'app');
```

`Route::view(uri, viewName)` shortcut من Laravel لتسجيل GET يعرض view محددة. مدخلها مسار واسم view، والنتيجة route مسجلة؛ لا تجهّز Vue بنفسها.

### ب. نفس HTML shell: `resources/views/app.blade.php`

```blade
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AutoCare Pro</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <div id="app"></div>
</body>
</html>
```

Blade على السيرفر تعالج `@vite` لتوليد asset tags حسب development/build. المتصفح يستقبل HTML، لا ينفّذ directive PHP. الـ div مكان الواجهة وليس صفحة الحجز نفسها. CSS وJS تحميل assets غير request بيانات حجز.

### ج. ملف الدخول يختار الصفحة: `resources/js/app.js`

**الكود الفعلي كاملًا:**

```js
import './bootstrap';
import '../css/app.css';
import '../css/product.css';
import { createApp, defineAsyncComponent } from 'vue';

const isGarage = location.pathname.replace(/\/$/, '') === '/my-garage';
document.title = isGarage ? 'My Garage | AutoCare Pro' : 'AutoCare Pro | Car care, with clarity';
const Page = defineAsyncComponent(() => isGarage
    ? import('./components/GarageDashboard.vue')
    : import('./components/App.vue'));

createApp(Page).mount('#app');
```

`bootstrap` import فيه side effects تجهيز مشتركة، لا يعني إننا استخدمنا API لمجرد استيراده. وعلشان ما يفضلش import غامض، ده محتوى `resources/js/bootstrap.js` الحقيقي في AutoCare:

```js
import axios from 'axios';
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
```

`axios` مكتبة HTTP. السطر الثاني يضعها كخاصية على window، والثالث يضبط header افتراضية لطلبات axios المستقبلية. ده **إعداد فقط**؛ مفيش `axios.get` أو طلب شبكة في المقطع، وfetch منفصلة لا ترث إعداد axios تلقائيًا.

CSS imports تعالجها Vite كأصول الواجهة. الخطوات بعد الاستيراد بقت معروفة: فحص المسار، عنوان التبويب، اختيار component، ثم mount.

### د. النتيجة في المسارين

- `/` تختار `components/App.vue`؛ ده يجمع القصة السينمائية والخدمات والحجز وباقي واجهة الموقع.
- `/my-garage` تختار `components/GarageDashboard.vue`؛ ده يستخدم بيانات الديمو من composable/repository المتصفح، وليس authentication backend مخفيًا.
- إزاي نفس Blade تعرض صفحتين؟ لأنها shell واحدة، والقرار هنا في app.js حسب pathname.
- HTML `href="/my-garage"` يعمل document navigation في الأسلوب الحالي؛ مفيش Vue Router في هذا bootstrap يراقب URL وينقل الصفحات وحده.
- في النسخة Cloudflare static يبدأ التحميل من HTML مبني بدل route PHP؛ لا تخلط مسار Laravel المحلي بمسار النشر الثابت.

**نهاية التجربة الذهنية:** غيّر فقط URL من `/` إلى `/my-garage`، Laravel ترجع نفس shell، لكن app.js تقرأ pathname مختلفة فتختار dashboard. لا تضيف route ثانية ترجع ملف Vue مباشرة؛ ملف Vue مدخل build وليس response HTML جاهزة.

## 7. متابعة Pizza: الـ providers مش أسماء لازم تحفظها من غير وظيفتها

**تكوين App الحقيقي في `app.jsx`:**

```jsx
function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CatalogProvider>
                    <OrderProvider>
                        <AppShell />
                    </OrderProvider>
                </CatalogProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
```

- دي function component من المشروع؛ ترجع JSX، مش Promise HTML من Laravel.
- BrowserRouter من React Router يوفر سياق التنقل. AuthProvider من مشروعنا يوفر حالة المستخدم ودوال الدخول. CatalogProvider يوفر الكتالوج/التحميل/الأخطاء، وOrderProvider إعداد الطلب والفرع والسلة المرتبطة.
- ترتيب nesting له معنى: OrderProvider يقدر يستخدم Catalog لأنه داخل CatalogProvider، لكن العكس مش مضمون.
- AppShell هو اللي يحتوي Navbar وRoutes وFooter. `<Route path="/menu" element={<MenuPage />} />` بيوصل مسار الواجهة لمكوّن المنيو بعد اختيار React Router، مش عبر route PHP مختلفة لترجع JSX.

**تكملة واحدة فعلية تبين إن Provider له جسم مش سحر:** من CatalogContext، منطق التحميل داخل `reload`:

```jsx
const response = await csrfFetch('/api/menu');
setCatalog({
    branches: response.branches || [],
    categories: response.categories || [],
    items: response.items || [],
});
```

`csrfFetch` دالة مشروع async، ترجع بيانات الطلب المفكوكة أو ترمي Error؛ وضع demo له فرع محلي، ووضع Laravel ينادي route `GET /api/menu` → `MenuController::index` → DB → JSON. `setCatalog` React setter تحدّث state للقراء داخل Provider؛ لا ترجع catalog جديدة من الدالة. الرحلة التفصيلية للسعر موجودة inline في درس 05، وللطلب/الدفع في 06 و08، مش مجرد أسماء ملفات مطلوب تحفظها.

**تمرين من غير تعديل:** اختار URL من مشاريعك واشرح أربع حاجات فقط: document entry، ملف تشغيل JavaScript، المكوّن المختار، ومصدر بياناته. لو مصدر بياناته localStorage، قول كده بوضوح بدل افتراض DB backend.
