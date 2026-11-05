# 12 — JavaScript: أمثلة صغيرة من شغلنا

[الفهرس](00-start-here.md) · المستوى: أساسي مهم للشغل · ذاكر سؤال واحد بس كل مرة.

الأمثلة هنا **تدريب إضافي مبسّط** على بيانات Pizza وAutoCare، مش نسخ حرفي من التطبيق. نفّذها في Console المتصفح أو ملف تدريب منفصل. متضيفش كل الأمثلة في نفس النطاق بنفس أسماء المتغيرات.

## سؤال 1: إزاي أوصل لاسم خدمة جوه array؟

```js
const services = [
    { id: 1, name: 'Oil Change', price: 450 },
    { id: 2, name: 'Tire Service', price: 300 },
];
console.log(services[0].name);
```

شرح السطور:

1. `const` تعريف متغير لا نعيد إسناده؛ `services` اسمه؛ `=` إسناد؛ `[]` قائمة.
2. `{}` object لخدمة واحدة. `id` و`name` و`price` خصائص؛ `:` يفصل الخاصية عن قيمتها؛ الفواصل تفصل الخصائص.
3. عنصر آخر في القائمة. النص بين اقتباسات؛ السعر رقم بدون اقتباسات.
4. `];` نهاية القائمة والتعليمة.
5. `console.log` يطبع؛ `[0]` أول عنصر؛ `.name` خاصية اسمه. الناتج `Oil Change`.

### `console.log` وظيفتها إيه بالضبط؟

- **جاية منين؟** أداة من بيئة المتصفح/Node، مش دالة إحنا كتبناها ومش Vue.
- **بتاخد إيه؟** قيمة أو أكثر عايز تشوفهم، زي نص أو رقم أو object.
- **بتعمل إيه؟** تعرض القيم في Developer Tools → Console. مش بتضيف كلام داخل الصفحة.
- **بترجّع إيه؟** `undefined`. مهم تفرّق بين اللي اتطبع وبين القيمة الراجعة من الدالة.

```js
const result = console.log('Oil Change');
console.log(result);
```

أول سطر يطبع الاسم، والسطر التاني يطبع `undefined`. `result` مش اسم الخدمة؛ هو ناتج استدعاء `log`.

`services[0].name` مش استدعاء method؛ دي قراءة عنصر ثم خاصية. الأقواس `()` هي علامة استدعاء الدالة في `console.log(...)`.

**بإيدك:** اطبع سعر الخدمة الثانية. المتوقع `300`.

**غلطة شائعة:** `services.name`؛ القائمة نفسها مش خدمة واحدة.

**سؤال إنترفيو:** هل `const` تمنع تغيير خصائص object؟

<details><summary>الإجابة بعد المحاولة</summary>
لأ. تمنع إعادة إسناد المتغير، لكن تقدر تعدّل محتويات object أو array.
</details>

المصدر اللي بنتمرّن على فكرته: [خدمات AutoCare](../../autocare-booking/resources/js/components/App.vue).

## سؤال 2: أجيب خدمة واحدة باستخدام find إزاي؟

استخدم قائمة السؤال الأول:

```js
const selectedId = 2;
const selected = services.find((service) => {
    return service.id === selectedId;
});
console.log(selected?.price);
```

1. `selectedId` رقم الاختيار.
2. `find` تمرّ على العناصر وترجّع أول عنصر ينجح شرطه. `(service) => {}` callback يستقبل العنصر الحالي.
3. `return` يرجّع نتيجة الشرط؛ `===` مقارنة القيمة والنوع؛ لو `true` يبقى لقينا العنصر.
4. قفل الدالة واستدعاء `find`.
5. `?.` optional chaining: اقرأ `price` لو `selected` موجودة؛ لو مفيش نتيجة ترجع `undefined` بدل خطأ. الناتج هنا `300`.

### `find` بتاخد إيه وبتسلّمنا إيه؟

- **أصلها:** method جاهزة على JavaScript arrays.
- **المدخل:** دالة شرط اسمها callback. `find` هي اللي بتنادي الدالة لكل عنصر بالترتيب.
- **دالة الشرط تستقبل:** العنصر الحالي، وممكن تستقبل كمان رقمه في القائمة ثم القائمة نفسها. هنا محتاجين العنصر بس.
- **دالة الشرط ترجع:** قيمة `true/false` في مثالنا. `true` معناها «ده المطلوب».
- **`find` نفسها ترجع:** أول عنصر نجح، وتتوقف؛ أو `undefined` لو خلصت القائمة بدون نجاح.
- **بتغيّر الأصل؟** `find` نفسها لأ. لكن العنصر الناتج هو نفس object الموجودة في القائمة، مش نسخة مستقلة.

في المثال: الخدمة 1 شرطها غلط، الخدمة 2 شرطها صح، فتعود الخدمة 2 كاملة. السعر بيتقرأ بعدها بـ `selected?.price`.

```js
const selected = services.find((service) => service.id === 2);
console.log(selected === services[1]); // true: نفس الـ object
```

متعدّلش `selected.price` وتفتكر إن الأصل مش هيتأثر؛ ده نفس مرجع العنصر.

**بإيدك:** جرّب `selectedId = 99` في تعريف المتغير ثم نفّذ المثال من جديد. المتوقع `undefined`.

**غلطة شائعة:** المقارنة بين الرقم `2` والنص `'2'`. حوّل القيمة بـ `Number(...)` عند الحاجة؛ متلغيش المقارنة الصارمة لمجرد إخفاء المشكلة.

**سؤال إنترفيو:** `find` ترجع إيه لو مفيش تطابق؟

<details><summary>الإجابة</summary>ترجع `undefined`، مش array فاضية.</details>

المصدر الفعلي للفكرة: [بحث السيارة](../../autocare-booking/resources/js/composables/useGarage.js)، [بحث سعر الفرع](../resources/js/context/CatalogContext.jsx).

## سؤال 3: أجيب الطلبات المؤكدة فقط باستخدام filter؟

```js
const appointments = [
    { id: 1, status: 'confirmed' },
    { id: 2, status: 'requested' },
];
const confirmed = appointments.filter((item) => item.status === 'confirmed');
console.log(confirmed.length);
```

1–4. قائمة فيها object لكل موعد، وكل واحد له `id` و`status`.
5. `filter` تنشئ array جديدة بكل العناصر اللي شرطها `true`. هنا arrow function مختصرة: التعبير بعد `=>` بيترد تلقائيًا بدون `return`.
6. `.length` عدد عناصر النتيجة؛ الناتج `1`.

### بطاقة `filter`

- **أصلها:** JavaScript Array method، مش دالة خاصة بالمشروع.
- **بتاخد:** callback تقول هل نحتفظ بالعنصر ولا لأ؛ تستقبل العنصر، ومعاه index والقائمة لو طلبتهم.
- **بترجّع:** array جديدة بكل العناصر الناجحة. لو مفيش مطابقات، ترجع `[]`.
- **بتوقف عند أول نتيجة؟** لأ، بتفحص باقي العناصر علشان تجمع كل المطابقات.
- **بتحذف من الأصل؟** لأ. `appointments` تفضل بعناصرها الاثنين، و`confirmed` قائمة أخرى فيها عنصر واحد.
- **هل نسخت objects بعمق؟** لأ؛ القائمتان مختلفتان، لكن العناصر اللي عدّت هي نفس مراجع objects.

```js
console.log(appointments.length); // 2
console.log(confirmed.length);    // 1
console.log(confirmed === appointments); // false
```

`length` **خاصية** نقرأها، مش method؛ علشان كده بنكتب `.length` مش `.length()`.

**بإيدك:** اعرض الطلبات `requested`. المتوقع array فيها الموعد الثاني.

**غلطة شائعة:** توقّع object واحد من `filter`. حتى لو فيه نتيجة واحدة، الناتج array.

**سؤال إنترفيو:** الفرق بين `find` و`filter`؟

<details><summary>الإجابة</summary>`find` أول عنصر أو undefined؛ `filter` قائمة بكل المطابقات أو قائمة فاضية.</details>

الفكرة مستخدمة في [فلترة GarageDashboard](../../autocare-booking/resources/js/components/GarageDashboard.vue).

## سؤال 4: إزاي أحوّل قائمة الخدمات لقائمة أسماء بـ map؟

باستخدام `services` من السؤال الأول:

```js
const names = services.map((service) => service.name);
console.log(names);
```

1. `map` تبني array جديدة؛ لكل خدمة الدالة بترجّع `name` فقط. عدد عناصر الناتج يساوي عدد عناصر الأصل هنا.
2. يطبع `['Oil Change', 'Tire Service']`.

### `map` غير `forEach` في النتيجة

- **`map(callback)`:** method جاهزة تبني array جديدة من **القيمة اللي callback بترجّعها** لكل عنصر. في مثالنا المدخل object، وناتج callback نص الاسم.
- **الأصل:** `services` تفضل قائمة objects. `names` هي قائمة النصوص الجديدة؛ `map` نفسها مش بتغيّر الأصل.
- **`forEach(callback)`:** method جاهزة تنفّذ callback لكل عنصر، لكن ناتجها هي `undefined`؛ حتى لو كتبت `return` في callback، مش هتكوّن array نتائج.
- **الآثار الجانبية:** `map` مش بتطبع لوحدها. الطباعة تحصل فقط لو كتبت `console.log`. ولو callback عدّلت object، التعديل ده منك، مش لأن `map` لازم تعدّل الأصل.

```js
const names = services.map((service) => service.name);
const result = services.forEach((service) => {
    console.log(service.name);
});
console.log(names);  // ['Oil Change', 'Tire Service']
console.log(result); // undefined
```

في `map((service) => service.name)` السهم من غير `{}` بيرجّع التعبير تلقائيًا. مع البلوك لازم نكتب:

```js
const names = services.map((service) => {
    return service.name;
});
```

**بإيدك:** رجّع الأسعار بدل الأسماء. المتوقع `[450, 300]`.

**غلطة شائعة:** تكتب callback بـ `{}` وتنسى `return`، فتلاقي النتيجة قيم `undefined`.

**سؤال إنترفيو:** ليه مش `forEach`؟

<details><summary>الإجابة</summary>`map` ترجع قائمة النتائج. `forEach` تنفّذ callback لكل عنصر لكن ترجع undefined، ومش بتجهّز قائمة نتائج تلقائيًا.</details>

مصدر عرض قائمة فعلي: [ProjectsSection في البورتفوليو](../../mo-m-en-portfolio/src/sections/ProjectsSection.tsx).

## سؤال 5: أحسب إجمالي سلة بـ reduce إزاي؟

```js
const cart = [
    { price: 50, quantity: 2 },
    { price: 30, quantity: 1 },
];
const total = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
}, 0);
console.log(total);
```

1–4. بيانات سلة تدريبية؛ كل سطر سعر وكمية.
5. `reduce` تجمع القائمة في نتيجة؛ `sum` الإجمالي المتراكم و`item` السطر الحالي.
6. `*` حساب قيمة السطر؛ `+` إضافتها للإجمالي؛ `return` يمرّر الإجمالي للفة التالية.
7. `0` القيمة الابتدائية لـ `sum`؛ مهمة كمان علشان السلة الفاضية ترجع صفر.
8. الناتج `130`: أول سطر 100 وبعده 30.

### بطاقة `reduce`

- **أصلها:** method جاهزة على array.
- **المدخل الأول:** callback للحساب. `sum` اسم اخترناه للنتيجة المتراكمة، و`item` العنصر الحالي. ممكن تضيف index والقائمة كوسيطين لاحقين.
- **المدخل الثاني:** `0`، قيمة البداية. مش سعر منتج، ومش عدد مرات التكرار.
- **الراجع:** قيمة واحدة هي آخر accumulator؛ هنا رقم. ممكن تكون object أو array في أمثلة أخرى حسب callback والبداية.
- **الأثر على الأصل:** `reduce` نفسها مش بتغيّر `cart`. callback هنا حساب نقي.

التنفيذ خطوة خطوة:

1. `sum = 0` و`item = { price: 50, quantity: 2 }` → نرجّع `100`.
2. `sum = 100` و`item = { price: 30, quantity: 1 }` → نرجّع `130`.
3. مفيش عناصر تانية → `total = 130`.

لو `cart = []`، النتيجة البداية `0`. لو شلت البداية من `reduce` على array فاضية، هترمي `TypeError`؛ دي مش نفس نتيجة صفر.

**بإيدك:** زوّد الكمية الأولى لـ 3. المتوقع `180`.

**غلطة شائعة:** تخزّن السعر `'$50'` ثم تعمل ضرب. خزّن رقمًا، واعرض العملة عند العرض. إجمالي المتصفح للعرض؛ السيرفر لازم يعيد حساب سعر الطلب الحقيقي.

**سؤال إنترفيو:** ينفع أثق في total اللي المتصفح بعته؟

<details><summary>الإجابة</summary>لأ؛ المستخدم يقدر يغيّره. Laravel يقرأ الأسعار الموثوقة ويحسِب الإجمالي.</details>

المصدر: [Cart](../resources/js/Pages/Cart.jsx)، [حساب الطلب على السيرفر](../app/Services/Orders/OrderCreator.php).

## سؤال 6: أعمل نسخة object وأغيّر خاصية؟

```js
const vehicle = { make: 'Toyota', mileage: 42000 };
const updated = { ...vehicle, mileage: 42500 };
console.log(vehicle.mileage);
console.log(updated.mileage);
```

1. بيانات السيارة الأصلية.
2. `...vehicle` spread تنسخ الخصائص للـ object الجديد؛ `mileage` المكتوبة بعدها تستبدل القيمة المنسوخة.
3. الأصل ما زال `42000`.
4. النسخة الجديدة `42500`.

`...` هنا **syntax في اللغة مش method**؛ مفيش `spread()` بنستدعيها. النسخ يحصل لحظة إنشاء `updated`، ومفيش حفظ على السيرفر ولا localStorage في السطور دي. علشان تحفظ التعديل محتاج دالة أخرى صريحة.

**بإيدك:** أضف `year: 2021` للنسخة فقط. المتوقع الأصل يفضل بدون `year`.

**غلطة شائعة:** دي shallow copy؛ لو فيه object داخلي، المرجع الداخلي يفضل مشتركًا. مش deep clone.

**سؤال إنترفيو:** ليه React بيحتاج غالبًا نسخ state بدل تعديلها مباشرة؟

<details><summary>الإجابة</summary>علشان نمرّر مرجعًا جديدًا عبر setter ونتجنّب تعديل الحالة القديمة. Vue reactive arrays تسمح بتعديلات مثل push؛ متخلطش القاعدتين.</details>

مقتطف التطبيق المقابل: [addVehicle](../../autocare-booking/resources/js/composables/useGarage.js).

## سؤال 7: أتعامل مع Promise وasync/await إزاي؟

نفّذ ده من Console صفحة Pizza المحلية، مش من Cloudflare Demo. الطلب GET قراءة فقط:

```js
async function loadMenu() {
    try {
        const response = await fetch('/api/menu');
        if (!response.ok) throw new Error('Menu request failed');
        const data = await response.json();
        console.log(data.items.length);
    } catch (error) {
        console.log(error.message);
    }
}
loadMenu();
```

1. `async` تجعل الدالة ترجع Promise وتسمح باستخدام `await` داخلها.
2. `try` بداية الكود اللي ممكن يفشل.
3. `fetch` ترجع Promise؛ `await` تنتظر النتيجة داخل الدالة، من غير تجميد واجهة المتصفح.
4. `!` نفي؛ لو حالة HTTP مش ناجحة نرمي Error. `fetch` لا ترمي خطأ تلقائيًا لمجرد 404 أو 500.
5. `response.json()` عملية أخرى asynchronous لقراءة JSON وتحويله لقيمة JavaScript.
6. اطبع عدد المنتجات؛ يعتمد على الكتالوج الحالي.
7–8. `catch` تستقبل الخطأ وتطبع رسالته.
9–10. إغلاق البلوكات والدالة.
11. استدعاء الدالة؛ من غيره مجرد تعريف مش هيتنفّذ.

### كل دالة في المثال وظيفتها إيه؟

**`loadMenu()` — دالة إحنا كتبناها في المثال:** لا تستقبل arguments هنا. بترجع Promise بسبب `async`. إحنا مش بنرجّع بيانات بـ `return data`، فلو نجحت الطباعة فالـ Promise تتحقق بقيمة `undefined`. ولو `catch` طبع الخطأ من غير ما يعيد رميه، برضه الاستدعاء ينتهي بقيمة `undefined`. الأثر الجانبي هو طلب GET والطباعة، مش تعديل DB.

**`fetch('/api/menu')` — Web API جاهزة:** بتاخد URL، وممكن object خيارات ثاني مثل `method` و`headers`. بدون method هنا معناها GET. ترجع Promise تنتهي بـ `Response`، مش قائمة المنتجات نفسها.

**`response.ok` — خاصية، مش method:** Boolean تكون `true` مع حالات HTTP من 200 إلى 299. استجابة 404 لسه Response، لكن `ok = false`. فشل الشبكة قد يرفض Promise قبل الحصول على Response.

**`new Error('...')` — إنشاء object خطأ جاهز في JavaScript:** النص هو الرسالة، وبنقرأها من `.message`. `throw` هو اللي يوقف المسار الحالي وينقلنا لأقرب `catch`، مش `new Error` وحدها.

**`response.json()` — method على Response:** بتقرأ body وتفسّره JSON، ومش محتاجة arguments هنا. ترجع Promise تنتهي بقيمة JavaScript؛ ممكن object أو array حسب الرد. JSON غير صالح يسبب رفضًا/خطأ. دي مش طلب شبكة ثانٍ ومش لتحويل object لنص؛ التحويل لنص هو `JSON.stringify`.

### نكمّل الطلب لآخره بدل ما نقف عند fetch

**المثال السابق تدريبي. المسار الحقيقي على Laravel المحلي** في [routes/web.php](../routes/web.php) يسجل `GET /api/menu` ويرسله إلى `MenuController::index`. الرد النهائي الفعلي في [MenuController.php](../app/Http/Controllers/Api/MenuController.php):

```php
return response()->json([
    'branches' => $branches,
    'categories' => $categories,
    'items' => $items,
]);
```

`$items` جاية من query لمنتجات نشطة وعلاقاتها. `response()->json(...)` أداة Laravel تبني HTTP JSON response؛ هي اللي تسلّم جسم الرد للمتصفح، مش `console.log`.

لذلك بعد `await response.json()` يبقى عندنا شكل شبيه بالآتي — **بيانات توضيحية**:

```js
const data = {
    branches: [],
    categories: [],
    items: [{ id: 1, name: 'Diavola' }],
};
console.log(data.items.length); // 1
```

الواجهة الحقيقية تكمل من [csrfFetch](../resources/js/lib/api.js) إلى [CatalogContext.reload](../resources/js/context/CatalogContext.jsx) ثم `setCatalog` ثم [MenuPage](../resources/js/Pages/MenuPage.jsx) تعرض `items`. شرح الدوال المتصلة بكودها موجود في [المكتبات — تتبع csrfFetch](libraries.md#3-لو-fetch-موجودة-ليه-axios-وليه-csrffetch).

**بإيدك:** غيّر المسار لمسار API غير موجود. المتوقع رسالة الخطأ بدل محاولة عرض بيانات غير صالحة.

**غلطة شائعة:** تنسى `await response.json()` فتتعامل مع Promise كأنها بيانات المنتجات.

**سؤال إنترفيو:** `await` بتوقف JavaScript كله؟

<details><summary>الإجابة</summary>لأ؛ بتعلّق استمرار الدالة async لحد النتيجة، وباقي المهام تقدر تشتغل.</details>

المصدر: [مساعد طلبات المشروع](../resources/js/lib/api.js). المثال مختصر ومش بديل للمساعد؛ الطلبات اللي تغيّر البيانات تحتاج قواعد CSRF والجلسة الموجودة فيه.

## سؤال 8: `Number` بتحوّل إيه؟ وإمتى ترجع NaN؟

**تدريب إضافي**؛ نفّذ سطر واحد وشوف ناتجه:

```js
console.log(Number('2'));     // 2
console.log(Number(''));      // 0
console.log(Number('50 EGP')); // NaN
console.log(Number.isNaN(Number('50 EGP'))); // true
```

- **`Number(value)`:** دالة JavaScript جاهزة لتحويل قيمة إلى رقم؛ بترجّع رقم، وقد يكون `NaN` لو التحويل غير صالح. لا تعدّل النص الأصلي. النص الفاضي بيتحوّل لصفر، فمتعتبرش التحويل validation لحقل مطلوب.
- **`NaN`:** قيمة معناها Not-a-Number، لكنها ضمن نوع number في JavaScript. مش نص ومش صفر.
- **`Number.isNaN(value)`:** method جاهزة تفحص هل القيمة نفسها NaN، وترجع Boolean. مش بتحاول تحوّل النص بنفسها؛ `Number.isNaN('hello')` ترجع false لأن النص نفسه مش NaN.
- **`Number.isFinite(value)`:** تفحص إن القيمة رقم محدود، فترفض NaN وInfinity والنصوص. مناسبة بعد التحويل مع بقية شروط الحقل.

```js
const raw = '3';
const quantity = Number(raw);
const valid = raw.trim() !== '' && Number.isInteger(quantity) && quantity >= 1;
console.log(valid); // true
```

`trim()` String method ترجع نصًا جديدًا بدون فراغات الطرفين. `Number.isInteger` ترجع true لو القيمة عدد صحيح؛ هنا نضيف شرط عدم الفراغ وحد أدنى بدل الثقة في Number وحدها.

**بإيدك:** غيّر `raw` إلى `''` ثم `'2.5'` ثم `'abc'`. المتوقع false في الحالات الثلاثة. متقارنش `value === NaN`؛ حتى NaN لا تساوي نفسها.

بعدها: [Vue بنفس البيانات](13-vue-practice.md).
