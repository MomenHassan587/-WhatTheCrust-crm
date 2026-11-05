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

### كل دالة هنا أصلها إيه وبترجع إيه؟

- **`csrfFetch(url, options)`:** helper إحنا كتبناه في api.js. تأخذ URL وخيارات، وترجع Promise بالـ payload. في وضع demo فرع الشرط يرجّع ناتج demoFetch بدل طلب HTTP.
- **`import('../demo/api')`:** صيغة dynamic import من JavaScript، ترجع Promise بموديول exports. ده تحميل كود، مش GET /api/menu إلى Laravel. المتصفح قد يحمّل JS chunk في Network، لكن ده غير طلب بيانات PHP.
- **`demoFetch(url, options)`:** custom async function في demo/api.js؛ تقلّد عقد المساعد وترجع Promise ببيانات JavaScript أو ترمي خطأ. مش method أصلية في fetch ومش كائن Response.

### نكمّل مثال GET menu داخل الملف الآخر

**مقتطفات فعلية متصلة بالفكرة من [demo/api.js](../resources/js/demo/api.js)، حذفنا باقي المسارات لتوضيح قراءة menu فقط:**

```js
import seedCatalog from './catalog.json' with { type: 'json' };
const STORE_KEY = 'wtc-demo-store-v1';
const clone = (value) => JSON.parse(JSON.stringify(value));
```

وعند بداية demoFetch:

```js
export async function demoFetch(url, options = {}) {
    const location = new URL(url, 'https://demo.local');
    const path = location.pathname;
    const method = options.method || 'GET';
    const store = loadStore();
    const user = currentUser(store);
    const data = options.body instanceof FormData
        ? Object.fromEntries(options.body.entries())
        : options.body ? JSON.parse(options.body) : {};
    const catalog = store.catalog;
    const persist = (result) => { saveStore(store); return clone(result); };

    if (path === '/api/menu') return clone({
        ...catalog,
        branches: catalog.branches.filter((branch) => branch.is_active !== false),
        categories: catalog.categories.filter((category) => category.is_active !== false),
        items: catalog.items.filter((item) =>
            item.is_active !== false
            && catalog.categories.find((category) => category.id === item.category_id)?.is_active !== false
        ),
    });
    // الملف الفعلي يكمل مسارات auth/orders/staff/admin؛ مش مطلوبة لقراءة menu.
}
```

**دور الأدوات اللي ظهرت:**

- `new URL(url, base)` Web API constructor يفسّر العنوان ويرجع URL object فيها pathname وsearchParams. وجود عنوان base توضيحي لا يرسل اتصالًا إليه.
- `loadStore()` دالة المشروع: تقرأ localStorage وتحاول تفك JSON؛ لو البيانات صالحة ترجع store. لو ناقصة/تالفة تنادي initialStore ثم saveStore وتعيد البداية. فيها قراءة وربما كتابة تخزين محلي.
- `currentUser(store)` دالة المشروع: تقرأ رقم حساب العرض من localStorage وتستخدم find في users؛ ترجع user أو null. لا تستوثق مع Laravel.
- `FormData.entries()` Web API method ترجع iterator لأزواج الحقول؛ `Object.fromEntries(...)` JavaScript method تحول الأزواج إلى object.
- `JSON.parse(text)` JavaScript method تفك نص JSON إلى قيمة وقد ترمي خطأ لو النص غير صالح. `JSON.stringify(value)` العكس. `clone(value)` دالة المشروع تجمع الاثنين لنسخ بيانات JSON البسيطة؛ لا تناسب أي نوع JavaScript عشوائي.
- `filter` ترجع قائمة المطابقات، و`find` أول category مطابقة أو undefined. لا يحدث تغيير على DB في هذا الفرع.
- `persist(result)` دالة محلية كتبها المشروع: تحفظ store الحالية ثم ترجع نسخة result. تستخدمها مسارات تغيير البيانات، **مش مسار menu المعروض**.

مثال دخل/خرج: `csrfFetch('/api/menu')` → demoFetch ترى pathname menu → loadStore تعيد catalog المحلي → filter تستبعد غير النشط → ترجع `{ branches, categories, items }` → CatalogContext تعرض القائمة بنفس شكل الرد الحقيقي.

لو التخزين مش موجود، `initialStore()` في نفس الملف تبني catalog من seedCatalog المنسوخ، وتضيف حسابات عرض وطلبات تجريبية؛ ثم `saveStore(store)` تكتبها:

```js
function saveStore(store) {
    try {
        localStorage.setItem(STORE_KEY, JSON.stringify(store));
    } catch {
        throw error('Demo storage is full. Reset the demo and try again.');
    }
}
```

`error(message, errors = {}, status = 422)` دالة المشروع في نفس الملف تنشئ Error وتضيف له payload وstatus ثم ترجعه؛ **throw في المستدعي** هو اللي يرميه. ده محاكاة نتيجة، مش HTTP status مبعوت من سيرفر.

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

### الأمر بيكمل فين؟

قيمة script الفعلية في package.json:

```json
"demo:build": "vite build --config vite.demo.config.js && node scripts/package-demo.mjs"
```

- `vite build --config ...` أمر CLI يبني ملفات الواجهة حسب config الديمو؛ ناتجه **ملفات فعلية داخل dist-demo**، مش response API.
- `&&` في script معناها شغّل الأمر الثاني إذا الأول نجح.
- `node scripts/package-demo.mjs` ينفّذ تجهيز الصور وملفات الاستضافة بالـ filesystem. لا يرفع الموقع إلى Cloudflare، ولا يعيد تشغيل Laravel.
- `demo:preview` يشغّل Vite preview ليقدّم ملفات البناء عبر HTTP محليًا. هو عملية server تفضل شغالة لحد إيقافها، مش ملف جديد ولا طريقة نشر تلقائية.

تشغيل build يستبدل ناتج البناء السابق في المجلد المخصص. اقرأ السكربت أولًا، ومتشغّلهوش لو مش عايز إعادة إنشاء هذا الناتج.

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

### Methods تجهيز الأصول: كلها filesystem، مش شبكة

- **`new Set(initialValues)`:** JavaScript constructor تعمل مجموعة قيم فريدة. `assets.add(path)` تضيف المسار وترجع نفس Set؛ لو المسار موجود لا تضيف نسخة مكررة. متنسخش الملفات بنفسها.
- **`replace(/^\//, '')`:** String method تأخذ pattern وبديل، وترجع نصًا جديدًا بدون أول slash هنا. `^\/` في regex معناها slash عند البداية فقط. الأصل لا يتغير.
- **`JSON.parse(await readFile(path, 'utf8'))`:** readFile من Node fs/promises تقرأ الملف كنص وترجع Promise، ثم JSON.parse تحوله إلى object. ده catalog.json موجود على القرص، مش طلب fetch.

**تكملة الحلقة الفعلية من نفس السكربت:**

```js
for (const asset of assets) {
    const source = path.resolve('public', asset);
    const target = path.resolve(destination, asset);
    if (!source.startsWith(path.resolve('public') + path.sep) || !target.startsWith(destination + path.sep)) {
        throw new Error('Invalid demo asset path: ' + asset);
    }
    await mkdir(path.dirname(target), { recursive: true });
    await cp(source, target);
}
await writeFile(path.join(destination, '_redirects'), '/* /index.html 200\n');
```

تعريف destination في أول الملف:

```js
const destination = path.resolve('dist-demo');
```

واستيراد الدوال:

```js
import { cp, writeFile, readdir, stat, readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
```

- **`path.resolve(...parts)`:** Node method تجمع المسار وتحوّله إلى absolute string حسب المجلد الحالي؛ لا تنشئ ملفًا ولا تفحص وجوده.
- **`startsWith(prefix)`:** String method تأخذ prefix وترجع Boolean. guard هنا يرفض المصدر/الهدف لو خرج النص المحسوب عن المجلدات المحددة. ده فحص للمسارات في السكربت، مش ضمان شامل ضد كل إعداد filesystem أو symlinks.
- **`path.sep`:** خاصية separator النظام، مش method.
- **`path.dirname(target)`:** Node method ترجع اسم المجلد الأب كنص؛ لا تنشئه.
- **`mkdir(directory, { recursive: true })`:** Node async function تنشئ المجلد وآباءه عند الحاجة؛ ترجع Promise. الراجع نفسه مش مستخدم هنا، المهم إتمام الأثر على القرص أو رمي خطأ.
- **`cp(source, target)`:** Node async function تنسخ الملف فعليًا، وترجع Promise تتحقق بلا قيمة مفيدة عند النجاح. ده نسخ محلي؛ لا يعني upload.
- **`path.join(...parts)`:** تجمع أجزاء مسار مع التطبيع؛ لا تقرأ ولا تكتب. هنا نص مسار ملف _redirects.
- **`writeFile(path, text)`:** Node async function تكتب النص وتستبدل الملف لو موجود بالافتراضات هنا، وترجع Promise تنتهي undefined. لذلك ده تغيير في artifacts عند تشغيل build، مش مجرد console.log.

مثال: asset = `images/menu/diavola.webp` → source تحت public → target تحت dist-demo/images/menu → mkdir تجهز الأب → cp تنسخ → writeFile تجهز routing. مفيش PHP بيتنفّذ أثناء زيارة المستخدم للناتج.

### تكملة فحص الملفات الكبيرة — الدالة والمستدعي

**مثال من الكود الفعلي في آخر package-demo.mjs:** فصلنا شرط الملف الكبير في أقواس معقوفة وأسطر مستقلة للقراءة، بدون تغيير فكرته؛ مش نقل حرفي لتنسيق الملف.

```js
async function checkFiles(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
        const target = path.join(directory, entry.name);
        if (entry.isDirectory()) await checkFiles(target);
        else if ((await stat(target)).size > 25 * 1024 * 1024) {
            throw new Error('Cloudflare file limit exceeded: ' + target);
        }
    }
}
await checkFiles(destination);
```

- `checkFiles(directory)` custom async function. المدخل مسار مجلد، والراجع Promise بلا بيانات عند النجاح أو رفض عند ملف أكبر من الحد المكتوب في السكربت. ده الحد الذي اختاره الكود الحالي، مش ادعاء إننا راجعنا خطة استضافتك اليوم.
- `readdir(directory, { withFileTypes: true })` من Node تقرأ أسماء المداخل وترجع Promise بقائمة Dirent objects؛ لا تقرأ محتوى كل ملف.
- `entry.isDirectory()` method على Dirent ترجع Boolean؛ لو مجلد نعيد استدعاء checkFiles عليه. ده recursion: نفس الدالة تتابع المجلدات الفرعية.
- `stat(target)` من Node ترجع Promise بـ Stats فيها size بالبايت؛ `.size` خاصية مش method.
- آخر `await checkFiles(destination)` هو الاستدعاء اللي يبدأ الفحص؛ تعريف الدالة وحده ما ينفّذهاش. الفحص لا يصغّر الملف الكبير؛ يرمي Error علشان build يفشل بدل إنه يعدّي.

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
