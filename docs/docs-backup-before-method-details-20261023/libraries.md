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
