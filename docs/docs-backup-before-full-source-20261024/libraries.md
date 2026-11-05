# المكتبات: أسئلة «ليه دي موجودة؟» بدل حفظ الأسماء

المصدر الأساسي للحقيقة: [Pizza package.json](../package.json)، [Pizza composer.json](../composer.json)، [AutoCare package.json](../../autocare-booking/package.json)، [Portfolio package.json](../../mo-m-en-portfolio/package.json).

ما تحفظش أرقام الإصدارات للمقابلة. افهم دور الأداة، واعرف إن `package.json` يحدد ranges والـ lock file يسجل شجرة إصدارات مثبتة.

## 1. Vite بيشغّل Laravel؟

**لأ.** Vite مسؤول عن frontend development/build؛ PHP يشغّل Laravel. مثالهم متكامل، لكن مش نفس العملية.

المصدر: [Pizza vite.config.js](../vite.config.js). **مقتطف فعلي من plugins:**

```js
plugins: [
    laravel({
        input: ['resources/css/app.css', 'resources/js/app.jsx'],
        refresh: true,
    }),
    react(),
],
```

- `plugins` قائمة إضافات Vite.
- `laravel(...)` يربط entry points وتكامل Blade/dev server/manifest.
- `input` الملفات اللي يبدأ منها تتبع imports والبناء.
- `refresh: true` يساعد في full reload عند تغيّر ملفات Laravel المتابعة؛ مش نفس React component refresh وحده.
- `react()` plugin معالجة React وتحسين تجربة التطوير.
- في AutoCare الإضافة المقابلة `vue()`؛ Portfolio يستخدم React plugin من غير Laravel plugin.

### مين كتب الدوال دي؟ بتاخد وترجع إيه؟

دي بداية [vite.config.js](../vite.config.js) الفعلية علشان تشوف الاستيراد قبل الاستخدام:

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { realpathSync } from 'node:fs';
```

- **`defineConfig(config)`:** helper من Vite يستقبل object الإعدادات ويرجعه كتعريف config؛ يفيد في أدوات الكتابة والتوصيف. استدعاؤه مش هو أمر تشغيل السيرفر؛ Vite يقرأ الإعدادات لما تنفّذ أمر dev/build.
- **`laravel(options)`:** plugin factory من حزمة Laravel/Vite. بتاخد إعدادات مثل `input` و`refresh` وترجع إعداد إضافة/إضافات يستهلكها Vite. مش بترجع HTML الصفحة ومش بتشغّل PHP.
- **`react()`:** plugin factory من حزمة React الخاصة بـ Vite. هنا من غير arguments، فترجع إعداداتها الافتراضية لمعالجة React. الناتج configuration، مش React component.
- **`realpathSync('.')`:** دالة Node لقراءة المسار الحقيقي المطلق للمجلد الحالي؛ ترجع string. `Sync` معناها متزامنة: أثناءها نفس عملية Node تنتظر النتيجة. استخدامها هنا وقت إعداد build، مش في متصفح الزائر. ممكن ترمي خطأ لو المسار غير صالح.
- **`vue()`:** المقابل في AutoCare من `@vitejs/plugin-vue`؛ ترجع plugin لمعالجة ملفات Vue. مش هي `createApp` اللي بتشغّل واجهة Vue.

التكملة في نفس الملف: `export default defineConfig({ root: realpathSync('.'), plugins: [...] })`. أمر Vite يقرأ الناتج، يبدأ من ملفات `input`، ويتتبّع imports. كده السلسلة كاملة: package مثبتة → import → استدعاء factory → config → Vite يعالج entry files.

**تمرين:** افتح [AutoCare vite.config.js](../../autocare-booking/vite.config.js) وحدد entry file. **المتوقع:** `resources/js/app.js`، مش app.jsx.

**خطأ شائع:** فتح port Vite وتوقّع API Laravel تشتغل منه تلقائيًا. ادخل عنوان Laravel للنسخة المحلية، وخلي Vite يقدّم assets.

**إنترفيو:** ليه المتصفح ما بيحمّلش `.vue` خام؟ لأن Vue plugin يحوّلها إلى JavaScript قابل للتنفيذ. TypeScript/JSX كذلك يحتاجان معالجة مناسبة.

## 2. `dependencies` و`devDependencies` يعني إيه فعلًا؟

**مثال مبسّط، مش نقل تصنيف المشروع حرفيًا:**

```json
{
    "dependencies": { "vue": "^3.0.0" },
    "devDependencies": { "vite": "^7.0.0" }
}
```

- `dependencies` حزم تعتمد عليها الشيفرة أو التطبيق؛ `devDependencies` أدوات مطلوبة للتطوير/البناء/الاختبار.
- `^` range توافق، مش الإصدار المثبت الدقيق. الأرقام هنا توضيحية فقط؛ راجع manifests الحقيقية.
- JSON يحتاج مفاتيح ونصوص بين double quotes، ومفيش trailing comma في JSON القياسي.
- التصنيف لا يقرر وحده ما يدخل bundle: imports وbuild configuration هما الأساس.
- ممكن حزمة frontend موجودة في devDependencies تدخل bundle لو استوردتها؛ العكس أداة build مصنّفة dependencies لا يجعلها واجهة للمستخدم.

في manifests الحالية plugin Vue وplugin React بتاع Pizza مكتوبين تحت dependencies، رغم إن دورهما build tooling. ده مش معناه إن المستخدم يشغّل plugin داخل المتصفح.

**تمرين:** افتح Pizza package.json وابحث عن `axios`. هل وجودها يكفي لإثبات استخدامها؟ **المتوقع:** لا؛ راجع imports ومسار التنفيذ.

**خطأ شائع:** تثبيت dependencies بدون devDependencies قبل frontend build ممكن يفقد Vite؛ غالبًا أدوات البناء مطلوبة في مرحلة build ثم تُسلّم artifacts.

**إنترفيو:** ما الفرق بين install وupdate؟ install يعتمد على lock لإعادة نفس الشجرة عند وجوده؛ update يعيد حل إصدارات ضمن الحدود ويغيّر lock. ما تعملش update شامل من غير اختبار.

## 3. لو fetch موجودة، ليه Axios؟ وليه csrfFetch؟

**مقتطف فعلي من [Pizza API helper](../resources/js/lib/api.js):**

```js
const response = await fetch(url, {
    credentials: 'same-origin',
    ...options,
    headers,
});
```

- `fetch` API أصلية في المتصفح، مش package في npm.
- `credentials` إرسال بيانات اعتماد مثل cookies للـ same-origin.
- `...options` يمرّر method/body وخيارات المستدعي؛ الترتيب يسمح باستبدال قيمة سابقة.
- `headers` قيمة object تم تجهيزها فوق المقتطف، فيها قبول JSON وCSRF عند توفره.
- helper يكمل تحليل JSON ويرمي error مع فشل HTTP، ويحوّل الطلبات لـ demoFetch في demo mode.

**الحقيقة الحالية:**

- Pizza ثبت Axios لكن الكود النشط للطلبات يستخدم `csrfFetch` المبني على fetch؛ `bootstrap.js` بتاعه مش ملف Axios starter.
- AutoCare `bootstrap.js` فعلًا يستورد Axios ويضع `window.axios`؛ لكن بيانات الجراج الحالية محفوظة محليًا، وده مش API booking حقيقية.
- ما تفترضش إن ملف اسمه `bootstrap.js` يعني مكتبة Bootstrap؛ الاسم مجرد startup module. Pizza يستورد Bootstrap CSS بشكل منفصل.

### تتبّع `csrfFetch` من المستدعي لحد الواجهة

**`csrfFetch` دالة المشروع، مش اسمًا أصليًا في المتصفح.** بتاخد `url` كنص و`options` كـ object اختياري، وترجع Promise تنتهي بـ **بيانات JSON نفسها** أو `null` لرد غير JSON. في الفشل ترمي Error. مش بترجع Response الأصلية زي fetch.

**المستدعي الحقيقي** في [CatalogContext.jsx](../resources/js/context/CatalogContext.jsx) بيبدأ بـ:

```js
import { csrfFetch } from '../lib/api';
```

ودي دالة `reload` الفعلية كاملة:

```jsx
const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
        const response = await csrfFetch('/api/menu');
        setCatalog({
            branches: response.branches || [],
            categories: response.categories || [],
            items: response.items || [],
        });
    } catch (requestError) {
        setError(requestError.message || 'The menu could not be loaded.');
    } finally {
        setLoading(false);
    }
}, []);
```

- `reload` دالة إحنا كتبناها. هنا بدون arguments، وترجع Promise تنتهي بـ undefined لأنها لا تستخدم return لبيانات الكتالوج؛ النتيجة اللي يراها المستخدم تأتي من تحديث state.
- `useCallback` أداة React تستقبل function وdependencies array، وترجع function reference محفوظة طالما dependencies لم تتغير. **لا تنادي reload بدلنا**.
- `setLoading(true)` setter من `useState` يطلب تحديث حالة التحميل. `setError('')` يمسح رسالة الخطأ السابقة.
- `await csrfFetch(...)` تنتظر بيانات القائمة. الاسم المحلي `response` هنا يقصد **payload المحلل**، مش كائن Response؛ الاسم لا يحدد النوع.
- `setCatalog({...})` يحفظ البيانات في React state؛ `|| []` يستخدم array فاضية لو الحقل falsy.
- `catch` تعرض رسالة الفشل. `finally` تقفل التحميل في الحالتين.

طيب `csrfFetch` نفسها كملت إزاي؟ **المقتطف المتصل التالي من المسار الحقيقي في api.js، حذفنا منه فقط فرع demo الموجود أول الدالة**:

```js
export async function csrfFetch(url, options = {}) {
    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');

    const isFormData = options.body instanceof FormData;
    const headers = {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
    };
    if (csrfToken) headers['X-CSRF-TOKEN'] = csrfToken;

    const response = await fetch(url, {
        credentials: 'same-origin',
        ...options,
        headers,
    });
    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const payload = isJson ? await response.json() : null;

    if (payload?.csrf_token) {
        document.querySelector('meta[name="csrf-token"]')
            ?.setAttribute('content', payload.csrf_token);
    }
    if (!response.ok) {
        const message = payload?.message || 'Something went wrong. Please try again.';
        const error = new Error(message);
        error.payload = payload;
        throw error;
    }
    return payload;
}
```

### الدوال الصغيرة جواها معناها إيه؟

- **`querySelector(selector)`:** DOM method جاهزة من المتصفح. تأخذ CSS selector، وترجع أول عنصر مطابق أو null؛ لا تنشئ العنصر.
- **`getAttribute('content')`:** method على عنصر HTML، تقرأ قيمة attribute وترجع string أو null. `?.` تمنع الاستدعاء لو العنصر غير موجود.
- **`instanceof FormData`:** عامل في اللغة، مش method؛ يختبر هل body كائن FormData. في الحالة دي نسيب المتصفح يضبط multipart Content-Type والـ boundary بدل كتابة JSON header غلط.
- **`fetch(url, options)`:** يرسل HTTP request ويرجع Promise بـ Response. خيارات الطلب هنا تؤثر على الشبكة والجلسة؛ وجود الدالة لا يلغي تحقق Laravel.
- **`response.headers.get('content-type')`:** Headers method تقرأ header الرد، وترجع نصًا أو null. ده غير `getAttribute`؛ الأولى للـ HTTP headers، والثانية لعناصر HTML.
- **`contentType.includes('application/json')`:** String method تختبر وجود جزء من النص، وترجع Boolean بدون تغيير النص.
- **`response.json()`:** تقرأ body وتفسّر JSON وترجع Promise بالبيانات؛ ليست مجرد تغيير اسم متغير. قد تفشل لو JSON تالف، حتى لو HTTP نجح.
- **`setAttribute('content', token)`:** DOM method تغيّر attribute في الصفحة ولا ترجع بيانات مفيدة؛ ناتجها undefined. هنا تحدّث CSRF token الذي سيُقرأ في طلب لاحق.
- **`new Error(message)`:** إنشاء Error object؛ وضع `error.payload` إضافة خاصة بمساعد المشروع علشان الواجهة تقدر تقرأ أخطاء validation. `throw` ينقل الفشل إلى catch.

ثم نكمّل في نفس CatalogContext:

```jsx
useEffect(() => {
    reload();
}, [reload]);
```

`useEffect` يشغّل reload بعد commit المكوّن، ويعيد تشغيله لو مرجع reload تغيّر. `reload` بعد النجاح تحدّث catalog. الـ Provider يسلّم `items` للمستهلكين، و[MenuPage.jsx](../resources/js/Pages/MenuPage.jsx) تقرأها عبر:

```jsx
const { branches, categories, items, loading, error, reload } = useCatalog();
```

`useCatalog` custom hook في نفس ملف الـ Context؛ وظيفتها قراءة قيمة الـ Provider بـ `useContext(CatalogContext)` وإرجاعها. لو مفيش Provider فوق المكوّن، ترمي Error واضح. مش بتطلب الشبكة بنفسها.

**تعريفها الفعلي، علشان الاستدعاء يكون له تكملة واضحة:**

```jsx
export function useCatalog() {
    const context = useContext(CatalogContext);
    if (!context) {
        throw new Error('useCatalog must be used inside CatalogProvider.');
    }
    return context;
}
```

`useContext` hook React تأخذ context object وترجع أقرب value من Provider فوق المكوّن. `CatalogContext` متعرّفة في أول الملف بـ `createContext(null)`؛ createContext ترجع قناة مشاركة بيانات، مش البيانات المحمّلة نفسها. الـ Provider يرجع:

```jsx
return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
```

`value` فيها catalog وloading وerror وreload. `children` المكوّنات اللي اتلفّت بالـ Provider في شجرة التطبيق؛ menu من ضمنها، فتقرأ القائمة الجديدة عند التحديث.

**مثال دخول/خروج مبسّط:** GET menu → API ترجع `{ items: [{ id: 1, name: 'Diavola' }], branches: [], categories: [] }` → csrfFetch ترجع object دي → reload تضعها في state → MenuPage تعيد العرض. تحميل الصورة يتم بطلب آخر من `img src`، مش من csrfFetch.

**تمرين:** قارن [Pizza bootstrap](../resources/js/bootstrap.js) و[AutoCare bootstrap](../../autocare-booking/resources/js/bootstrap.js). **المتوقع:** نفس اسم الملف، مسؤوليتان مختلفتان حسب محتواه.

**خطأ شائع:** استخدام fetch وAxios بالتبادل في كل مكان بدون توحيد handling للجلسة والأخطاء.

**إنترفيو:** ليه helper؟ لتوحيد السلوك المشترك، مش لإخفاء فهم HTTP أو الاستغناء عن backend security.

## 4. Stripe browser وStripe PHP: ليه حزمتين؟

مصادر: [Cart](../resources/js/Pages/Cart.jsx)، [StripePaymentGateway](../app/Services/Payments/StripePaymentGateway.php).

**مقتطف فعلي من داخل الدفع في Cart:**

```jsx
const result = await stripe.confirmCardPayment(response.client_secret, {
    payment_method: { card: elements.getElement(CardElement) },
});
```

- `stripe` أداة المتصفح من Stripe.js، وReact bindings توفر hooks/components.
- `client_secret` خاص بـ PaymentIntent ضمن التدفق المقصود؛ مش server secret API key، وبرضه ما تنشروش عشوائيًا.
- `CardElement` إدخال Stripe؛ raw card details لا تتحول لحقول Laravel عندنا.
- PHP package تنشئ intent وتتحقق من webhook على السيرفر. جواب المتصفح مش بديل للتأكيد المتحقق منه.

### Methods الدفع: مدخلاتها وناتجها

- **`loadStripe(publishableKey)`:** من `@stripe/stripe-js` في Cart؛ تأخذ مفتاح المتصفح العام، وتحضّر Stripe.js، وترجع Promise تنتهي بكائن Stripe أو null. قد تحتاج تحميل موارد شبكة. في المشروع مخزّنة في `stripePromise` وخارج المكوّن لتجنّب إعادة الإنشاء مع كل render.
- **`useStripe()` و`useElements()`:** hooks من React Stripe داخل CardCheckout، لا تستقبل arguments هنا. الأولى تقرأ Stripe instance والثانية Elements manager من Provider. ممكن ترجع null قبل الجاهزية؛ وجود hooks وحده مش معناه الدفع حصل.
- **`elements.getElement(CardElement)`:** تأخذ نوع Stripe Element، وترجع instance الحقل أو null. مش بترجع رقم البطاقة في نص نرسله لLaravel.
- **`stripe.confirmCardPayment(clientSecret, options)`:** تأخذ سر المحاولة الخاص بالعميل وبيانات طريقة الدفع، وترجع Promise بنتيجة مثل `{ paymentIntent }` أو `{ error }`. دي عملية ذات أثر خارجي: قد تتواصل مع Stripe وتعرض خطوات مصادقة، وليست حسابًا محليًا.

تكملة المقتطف الحقيقي في Cart بعد الاستدعاء:

```jsx
if (result.error) throw new Error(result.error.message);
onMessage(`Payment received. Order #${response.order_id} is being confirmed.`);
```

`onMessage` callback جاية للمكوّن من الأب علشان تعرض رسالة؛ مش method من Stripe. النجاح هنا لا يبدّل قاعدة البيانات وحده إلى paid: webhook السيرفر له دوره المنفصل.

في [StripePaymentGateway.php](../app/Services/Payments/StripePaymentGateway.php)، `createIntent(amount, currency, metadata, idempotencyKey)` custom method عندنا ترسل create عبر Stripe SDK ثم ترجع array فيها `id` و`client_secret`. المبلغ بالـ minor units حسب العملة؛ مش نص السعر المعروض. `parseWebhook(payload, signature)` عندنا تمرّر الجسم والتوقيع والسر إلى `Webhook::constructEvent`، اللي تتحقق وترجع event object أو ترمي استثناء لو التحقق فشل. ده وصول مكتبة عبر خدمة المشروع، مش raw fetch في React. تتبّع إنشاء المحاولة والـ controller والـ webhook كامل في [08](08-checkout-and-payment.md).

**تمرين سؤال فقط:** Stripe secret key ينفع في متغير `VITE_`؟ **المتوقع:** لا؛ هيظهر في شيفرة العميل.

**خطأ شائع:** وجود Stripe packages يعني الدفع live جاهز ومختبر؟ لا. الديمو يحاكي التدفق ولا يستقبل دفع حقيقي.

**إنترفيو:** الفصل client/server يقلّل تعرض بيانات البطاقة ويحافظ على أسرار إنشاء الدفع في السيرفر؛ لا يلغي التزامات وإعدادات التشغيل الآمن.

## مرجع الحزم الفعلية: دورها ومكانها

### Frontend

| الحزمة | استخدامها الحالي/دورها |
|---|---|
| `react`, `react-dom` | واجهة Pizza وPortfolio وتركيبها على DOM |
| `react-router-dom` | مسارات Pizza والـ Link والتنقل؛ Portfolio لا يثبتها حسب manifest الحالي |
| `vue` | مكوّنات وreactivity AutoCare |
| `@vitejs/plugin-react`, `@vitejs/plugin-vue` | تكامل البناء والتطوير مع Vite، مش مكوّنات للواجهة |
| `vite`, `laravel-vite-plugin` | dev/build وتكامل Laravel، والإضافة الثانية في مشروعي Laravel |
| `bootstrap`, `react-bootstrap` | CSS ومكوّنات Cards/Rows/Cols في Pizza |
| `framer-motion` | animations وreduced motion في Pizza وPortfolio |
| `gsap` | tweening وScrollTrigger في AutoCare |
| `lucide-react` | icons في Portfolio |
| `@stripe/stripe-js`, `@stripe/react-stripe-js` | Stripe browser وتكامل React في Pizza |
| `axios` | مثبت في Pizza وAutoCare؛ الاختلاف في الاستخدام موضّح فوق |
| `tailwindcss`, `@tailwindcss/vite` | مثبتان في مشروعي Laravel، لكن Vite config وCSS الحاليين مش مفعّلين Tailwind هناك |
| `tailwindcss`, `postcss`, `autoprefixer` | سلسلة CSS نشطة في Portfolio؛ index.css فيه Tailwind directives |
| `typescript`, `@types/react`, `@types/react-dom` | فحص أنواع وتوصيف React في Portfolio؛ types لا تتحول لنظام تحقق runtime |
| `concurrently` | تشغيل أوامر تطوير متوازية في composer dev لمشروعي Laravel |

### PHP / Composer في Pizza

| الحزمة/المكوّن | الوظيفة |
|---|---|
| `laravel/framework` | routing، validation، sessions، Eloquent، events، testing integration |
| `laravel/tinker` | REPL لتجربة PHP/Laravel؛ ما تكتبش أوامر تغيّر DB من غير قصد |
| `stripe/stripe-php` | Stripe API وتحقق webhook على السيرفر |
| `fakerphp/faker` | بيانات وهمية في factories/tests |
| `laravel/pail`, `nunomaduro/collision` | عرض logs وأخطاء terminal للتطوير |
| `laravel/pint` | تنسيق PHP؛ مش إصلاح business logic |
| `laravel/sail` | دعم workflow Docker؛ وجودها لا يعني إن التشغيل الحالي داخل Docker |
| `mockery/mockery`, `phpunit/phpunit` | mocking واختبارات PHP |

`Eloquent` جزء من Laravel، مش npm package. `SQLite` محرك قاعدة بيانات، مش React state. `Sanctum/Reverb/Echo/Pusher` مش direct dependencies في manifests دي؛ ما تدّعيش استخدامها بدون مسار تنفيذي فعلي.

## سؤال مراجعة أخير

دخلت مشروع جديد وعايز تعرف مستخدم Vue ولا React. تبدأ بإيه؟

<details><summary>الإجابة</summary>

manifest يديك مؤشر، لكن اقرأ entry point وimports وVite config للتأكيد. حزمة مثبتة أو ملف قديم موجود مش دليل إنه داخل التطبيق النشط.

</details>
