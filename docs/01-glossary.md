# قاموس عملي: السؤال قبل المصطلح

مرجع ترجع له وقت الحاجة. الأمثلة الصغيرة هنا **تدريبية أو مبسّطة**، وليست أوامر تغيّر المشروع الأصلي. في كل سؤال اقرأ المثال ثم توقّع النتيجة.

## قبل المصطلحات: أعرف وظيفة أي function أو method إزاي؟

لما تقابل اسمًا زي setInterval أو find، اسأل خمس أسئلة بدل ما تحفظ اسمه:

1. **مين وفّره؟** JavaScript نفسها؟ المتصفح؟ Vue/React؟ Laravel؟ ولا دالة إحنا كتبناها؟
2. **بيستقبل إيه؟** القيم اللي بين الأقواس اسمها arguments وقت النداء. لو بيستقبل callback، إمتى وبيناديها بإيه؟
3. **بيرجّع إيه؟** رقم؟ object؟ array؟ Promise؟ ولا undefined؟
4. **بيغيّر إيه؟** ممكن يرجع نتيجة من غير تعديل الأصل، أو يكتب تخزينًا أو يغيّر state أو يسجل مؤقتًا.
5. **مين بيستخدم النتيجة؟** متغير تاني؟ template؟ helper؟ callback في ملف آخر؟

الدروس بتفصّل ده جنب الأمثلة؛ القاموس هنا مرجع لو نسيت معنى حاجة، مش بديل لتكملة المثال.

### function وmethod وproperty: مش نفس الحاجة

**مثال تدريبي مستقل** في Console:

```js
function double(number) {
    return number * 2;
}
const tools = { double };
const result = tools.double(3);
console.log(result);
```

1. تعريف function اسمها double، وnumber parameter تستقبل القيمة عند النداء.
2. return تنهي التنفيذ وترجع حاصل الضرب. مش طباعة ومش تحديث شاشة.
3. نهاية الدالة.
4. object فيه الخاصية double وقيمتها الدالة نفسها؛ اختصار `{ double: double }`.
5. لما نستدعي الدالة من خلال object نسمّيها method. `3` argument وصلت إلى number، والنتيجة6 اتخزّنت في result.
6. console.log method على console؛ تطبع6 وترجع undefined.

**بإيدك:** غيّر3 إلى5؛ المتوقع10. لو حذفت return، الدالة تحسب التعبير لكن لا تعيده، فتلاقي result تساوي undefined.

ملاحظة: ينفع نقول function بالمعنى العام على دالة مستدعاة كـmethod؛ المهم تفهم مين صاحبها وإيه عقد استخدامها.

### ليه الأقواس بتفرّق؟

باستخدام double من فوق:

```js
const operation = double;
const answer = double(4);
console.log(operation(5));
```

1. خزّن مرجع الدالة في اسم آخر؛ مفيش تنفيذ ومفيش ناتج حساب بعد.
2. نفّذها بالقيمة4؛ answer تساوي8.
3. نفّذ نفس الدالة عبر الاسم الآخر بالقيمة5، واطبع10.

علشان كده `addEventListener('scroll', updateNavbar)` تبعت دالة علشان المتصفح يناديها لاحقًا، و`updateNavbar()` تنفيذ الآن. وفي `@click="selectService(service)"` Vue هي اللي بتؤجّل تقييم التعبير لوقت الضغط؛ متعممش قاعدة الأقواس من غير سياق.

### property مش لازم نناديها بأقواس

```js
const items = ['Oil Change', 'Tire Service'];
console.log(items.length);
console.log(items.includes('Oil Change'));
```

1. قائمة نصوص.
2. length خاصية فيها العدد2؛ بنقرأها من غير `()`.
3. includes method تستقبل القيمة المطلوب البحث عنها، وترجع true/false؛ هنا true.

نفس الفكرة: `window.scrollY` و`response.ok` و`ref.value` و`reactRef.current` خصائص. لكن `response.json()` و`params.set(...)` و`array.find(...)` استدعاءات methods.

**غلطة شائعة:** تكتب `items.length()` أو `response.ok()` فتتعامل مع رقم أو Boolean كأنه function.

### إيه الفرق بين parameter وargument وreturn؟

في `function double(number)`، اسم number parameter: مكان يستقبل قيمة. في `double(4)`، الرقم4 argument: القيمة اللي اتبعتت. في `return number * 2`، الرقم8 return value: اللي يرجع للمتصل.

دي ثلاث حاجات مختلفة؛ مش كل اللي بين أقواس input يكون بيانات نهائية، ومش كل function تعمل side effect ترجع نتيجة مفيدة.

### callback مين بيناديها وبتاخد إيه؟

**مثال تدريبي مستقل**:

```js
const prices = [50, 30];
const doubled = prices.map((price) => price * 2);
console.log(doubled);
```

- `map` method جاهزة على array؛ بتاخد callback. هي اللي بتناديها لكل عنصر، مش إنت تعمل loop إضافية.
- price parameter تستقبل50 في المرة الأولى و30 في الثانية. callback في map ممكن تستقبل index والقائمة كمان، لكن مثالنا مش محتاجهم.
- كل مرة callback ترجع رقمًا؛ map تجمع النتائج في array جديدة `[100, 60]`.
- prices الأصلية تفضل `[50, 30]` لأن callback هنا لا تعدّلها.

**المقارنة:** callback داخل setInterval يناديها مؤقت المتصفح على فترات؛ callback داخل map تناديها map لكل عنصر أثناء التنفيذ الحالي. الاتنين دوال لكن **الجهة اللي بتستدعيهم وقيم المدخلات والتوقيت مختلفين**.

### built-in ولا دالة المشروع؟

| الاسم | جاي منين؟ | مدخلاته الأساسية | الناتج/الأثر |
| --- | --- | --- | --- |
| `array.find(callback)` | JavaScript | دالة شرط على العناصر | أول عنصر مطابق أو undefined |
| `array.filter(callback)` | JavaScript | دالة شرط | array جديدة بكل المطابقات |
| `array.map(callback)` | JavaScript | دالة تحويل عنصر | array جديدة بنتيجة كل تحويل |
| `array.forEach(callback)` | JavaScript | دالة تنفيذ على كل عنصر | undefined؛ لا تجمع نواتج callback |
| `array.reduce(callback, initial)` | JavaScript | دالة accumulator وقيمة بداية | النتيجة المتراكمة، ونوعها حسب التصميم |
| `window.setInterval(callback, delay)` | المتصفح | دالة وفاصل بالمللي ثانية | رقم معرّف مؤقت في المتصفح؛ يكرر النداءات |
| `window.clearInterval(id)` | المتصفح | معرّف المؤقت | undefined؛ يلغي النداءات التالية للمؤقت |
| `window.setTimeout(callback, delay)` | المتصفح | دالة وتأخير بالمللي ثانية | معرّف نداء واحد مؤجّل |
| `fetch(url, options)` | المتصفح في أمثلتنا | عنوان وإعدادات HTTP | Promise لـResponse؛ مش JSON جاهز |
| `response.json()` | Fetch Response | بدون arguments في استخدامنا | Promise لقيمة body بعد تحليل JSON |
| `JSON.stringify(value)` | JavaScript | قيمة قابلة للتحويل | نص JSON للقيم المستخدمة في أمثلتنا؛ قد يفشل مع circular references |
| `JSON.parse(text)` | JavaScript | نص JSON صالح | قيمة JavaScript؛ يرمي خطأ لو النص غير صالح |
| `ref(initial)` | Vue | قيمة البداية | ref فيها .value reactive |
| `computed(getter)` | Vue | دالة تحسب من حالة reactive | computed ref؛ الحساب في getter مش وظيفة computed تختار له بنفسها |
| `useState(initial)` | React | قيمة أو initializer | زوج: state وsetter تطلب تحديث العرض |
| `useRef(initial)` | React | قيمة البداية | object ثابت فيها current؛ تغييره لا يطلب render |
| `csrfFetch(url, options)` | كتبناها في Pizza | عنوان وإعدادات | Promise للبيانات المحللة أو خطأ؛ تضيف تجهيزات الجلسة وCSRF |
| `loadOrders()` | كتبناها في StaffDashboard | بدون arguments؛ تقرأ حالة المكوّن | Promise بلا بيانات مرجعة عادة؛ تحدّث state كأثر جانبي |

متطبّقش الجدول بالحفظ فقط. مثلًا find مش بتعرف يعني إيه خدمة مختارة؛ callback اللي كتبتها هي اللي بتقول شرط المطابقة.

### عايز مثال كامل على المؤقت من أوله لآخره؟

افتح [09 — setInterval ثم loadOrders ثم API والسيرفر والعرض](09-staff-dashboard.md). هتلاقي تعريف الدوال ومدخلاتها وناتجها والتكملة بين الملفات، مش كلمة «شغّل مؤقت» فقط.

## 1. يعني إيه array وobject؟

**مثال تدريبي من فكرة خدمات AutoCare**؛ [مصدر الفكرة](../../autocare-booking/resources/js/components/App.vue):

```js
const services = [
    { id: 1, name: 'Oil Change', price: 450 },
    { id: 2, name: 'Tire Service', price: 300 },
];
console.log(services[0].name);
```

- `const`: اسم مش هنعيد إسناده؛ مش معناه إن محتوى object مستحيل يتغير.
- `services`: اسم القائمة؛ `=` إسناد، و`[]` حدود array.
- `{}` object واحد؛ `id/name/price` خصائص، و`:` يفصل الاسم عن القيمة.
- `[0]` أول عنصر، و`.name` خاصية الاسم؛ الناتج `Oil Change`.
- `;` نهاية تعليمة؛ الفواصل تفصل الخصائص والعناصر.

**تمرين:** اطبع سعر الخدمة التانية. **المتوقع:** `300`.

**خطأ شائع:** `services.name`؛ القائمة نفسها مش هي الخدمة.

**إنترفيو:** array قائمة مرتبة؛ object يجمع خصائص كيان واحد.

## 2. إيه الفرق بين `=` و`===` و`!` و`&&`؟

**مثال تدريبي جديد** مرتبط بـ [اختيار الفرع](../resources/js/context/OrderContext.jsx):

```js
const branchId = 2;
const isSelected = branchId === 2;
const canOrder = isSelected && true;
console.log(!canOrder);
```

- `=` إسناد؛ `===` مقارنة القيمة والنوع.
- `isSelected` تساوي `true`.
- `&&` في المثال يرجّع نتيجة الطرف التاني لو الأول truthy؛ مش عامل تحويل تلقائي لكل نتيجة إلى Boolean.
- `!` يقلب القيمة المنطقية؛ الطباعة `false`.

**تمرين:** غيّر `branchId` إلى النص `'2'`. **المتوقع:** المقارنة false والطباعة true.

**خطأ شائع:** `if (branchId = 2)` إسناد مش مقارنة.

**إنترفيو:** strict equality ما بتحوّلش النوع قبل المقارنة؛ افهم مصدر القيمة قبل استخدام `Number()`.

## 3. إيه الفرق بين `find` و`filter` و`map` و`forEach`؟

استعمل `services` من سؤال 1. **مثال تدريبي مبسّط**؛ [كود السلة الحقيقي](../resources/js/Pages/Cart.jsx):

```js
const chosen = services.find((service) => service.id === 2);
const affordable = services.filter((service) => service.price < 400);
const names = services.map((service) => service.name);
services.forEach((service) => console.log(service.name));
```

- `find`: أول object مطابق، أو `undefined` لو مفيش.
- `filter`: array جديدة بالعناصر المطابقة؛ هنا خدمة الإطارات بس.
- `map`: array جديدة من نتائج التحويل؛ هنا اسمان.
- `forEach`: ينفذ callback لكل عنصر؛ مش بيرجّع array النتائج.
- `(service) => ...`: callback؛ `service` العنصر الحالي، والاسم اختيارنا.

**تمرين:** هات الخدمات الأعلى من `1000`. **المتوقع:** `filter` ترجع `[]`، مش `undefined`.

**خطأ شائع:** استخدام `map` للطباعة بس، أو توقع إن `find` ترجع قائمة.

**إنترفيو:** اختار الدالة بناءً على شكل النتيجة المطلوبة، مش الاسم اللي حافظه.

## 4. يعني إيه spread وdestructuring؟

**مثال مبسّط من [تحديث السلة](../resources/js/Pages/Cart.jsx):**

```js
const item = { id: 1, quantity: 1, price: 100 };
const updated = { ...item, quantity: 2 };
const { price, quantity } = updated;
console.log(price * quantity);
```

- `...item` ينسخ الخصائص إلى object جديد؛ النسخة shallow مش deep.
- `quantity: 2` مكتوبة بعد spread، فبتستبدل القيمة القديمة.
- `{ price, quantity } = updated` تفكيك: اعمل متغيرين من خاصيتين.
- الطباعة `200`؛ `item.quantity` لسه `1`.

**تمرين:** اعكس ترتيب `{ quantity: 2, ...item }`. **المتوقع:** quantity ترجع `1` لأن آخر خاصية تكسب.

**خطأ شائع:** تعديل `item.quantity++` مباشرة ثم توقع React يكتشف نفس المرجع تلقائيًا.

**إنترفيو:** immutable update معناه ننتج قيمة جديدة بدل تعديل القديمة؛ spread لا يفصل nested objects تلقائيًا.

## 5. يعني إيه optional chaining وnullish coalescing؟

**مثال تدريبي من فكرة [branchOption](../resources/js/context/CatalogContext.jsx):**

```js
const branch = null;
const name = branch?.name ?? 'Choose a branch';
const fee = 0;
console.log(fee ?? 20);
console.log(fee || 20);
```

- `?.` توقف الوصول لو القيمة `null` أو `undefined` بدل error.
- `??` يستخدم البديل فقط مع null/undefined؛ اسم الفرع هنا النص البديل.
- `fee ?? 20` يطبع `0`؛ الصفر قيمة مقصودة.
- `fee || 20` يطبع `20` لأن `||` يستخدم البديل مع أي falsy مثل صفر والنص الفاضي.

**تمرين:** غيّر fee إلى `undefined`. **المتوقع:** الاتنين `20`.

**خطأ شائع:** اعتبار `||` و`??` متطابقين في الأسعار والكميات.

**إنترفيو:** `?.` يمنع خطأ الوصول في مسار قد يكون مفقودًا؛ مش validation للبيانات.

## 6. يعني إيه Promise وasync/await؟

**مثال تدريبي مبسّط**؛ [المصدر الفعلي للطلبات](../resources/js/lib/api.js):

```js
async function loadMenu() {
    const response = await fetch('/api/menu');
    if (!response.ok) throw new Error('Menu request failed');
    const data = await response.json();
    return data;
}
```

- `async` تخلي الدالة ترجع Promise؛ Promise تمثل نتيجة قد تكتمل أو تفشل لاحقًا.
- `fetch` يبدأ طلب HTTP ويرجع Promise.
- `await` ينتظر داخل الدالة دي؛ مش بيجمّد واجهة المتصفح كلها.
- `response.ok` نجاح HTTP؛ fetch مش بيرفض Promise تلقائيًا لمجرد 404 أو 422.
- `throw new Error` ينقل التنفيذ لمسار الخطأ؛ استخدم `try/catch` عند الاستدعاء.
- `response.json()` قراءة body كـ JSON؛ غير `JSON.stringify` اللي يحوّل object إلى نص.

**تمرين:** توقع نتيجة URL غير موجود. **المتوقع:** الاستثناء اللي كتبناه، مش بيانات منيو.

**خطأ شائع:** استخدام `data.items` قبل انتظار Promise.

**إنترفيو:** `await` يبسّط كتابة async code؛ ما بيحوّلش طلب الشبكة لعملية synchronous على الـ main thread.

## 7. إيه state وprops وcomputed وeffect؟

- **State:** بيانات ممكن تتغير وتؤثر على العرض؛ Vue `ref`، React `useState`.
- **Props:** مدخلات الأب للابن؛ الطفل ما يغيّرش props مباشرة.
- **Computed / derived value:** نتيجة مشتقة، مثل الخدمة المطابقة للـ id؛ مش بنكرر تخزين نفس الحقيقة بدون داعي.
- **Effect:** مزامنة مع حاجة خارج حساب الواجهة: listener أو timer أو network.
- **Component:** جزء واجهة له inputs وعرض وسلوك؛ مش لازم يبقى ملف ضخم.

**سؤال:** Vue `ref` وReact `useRef` نفس الحاجة؟

<details><summary>الإجابة</summary>

لأ. تحديث Vue ref المستخدم في العرض ممكن يحدّث الواجهة. تغيير React ref.current لا يعمل render بحد ذاته. React state هو المقارنة الأقرب هنا.

</details>

## 8. HTTP وbackend: كل كلمة معناها إيه؟

- **Request:** رسالة طالعة للسيرفر؛ **Response:** رده.
- **Route:** ربط method وURL بكود؛ **Controller:** يستقبل ويُنسّق الرد.
- **GET:** قراءة؛ **POST:** إرسال/إنشاء؛ **PATCH:** تعديل جزئي؛ semantics مش بديل للحماية.
- **API endpoint:** مثل `POST /api/orders`؛ وجود `/api` في الاسم لا يفرض auth تلقائيًا.
- **Validation:** هل شكل وقيم البيانات مقبولة؟ **Authorization:** هل الشخص مسموح له بالفعل ده؟
- **Authentication:** إثبات الهوية؛ **Session:** ربط حالة الدخول بكوكي المتصفح في النسخة المحلية.
- **CSRF:** منع طلب تغيير مزور من موقع تاني مستغل جلسة المستخدم؛ مش حماية من كل الهجمات.
- **401:** لم يتم تسجيل الدخول؛ **403:** غير مسموح؛ **404:** غير موجود؛ **409:** تعارض؛ **422:** validation فشلت؛ **500:** خطأ سيرفر.

المصدر: [routes](../routes/web.php)، [auth](../app/Http/Controllers/Api/AuthController.php)، [request helper](../resources/js/lib/api.js).

## 9. Database وpayment: الأسئلة اللي تفرّق في الإنترفيو

- **Model/Eloquent:** تمثيل البيانات والعلاقات بكود PHP؛ [Order](../app/Models/Order.php).
- **Migration:** تعريف تغيير في بنية DB، مش البيانات نفسها.
- **Seeder:** إدخال بيانات بداية/demo؛ مش مصدر الأسرار.
- **Foreign key:** مرجع لصف في جدول تاني؛ مثل order → branch.
- **Pivot:** ربط many-to-many؛ `branch_menu_item` يحمل السعر والتوفر للفرع.
- **Transaction:** عمليات DB تنجح سوا أو تتراجع سوا؛ مش ضمان لنجاح خدمة Stripe الخارجية.
- **Webhook:** طلب من خدمة خارجية لسيرفرك؛ لازم تتحقق من توقيعه.
- **Idempotency:** تكرار نفس العملية المقصودة لا ينتج أثرًا مكررًا؛ مش ادعاء إن كل race condition اتحلت.

المصدر: [OrderCreator](../app/Services/Orders/OrderCreator.php)، [PaymentController](../app/Http/Controllers/Api/PaymentController.php).

## 10. أدوات المشروع: إيه اللي ما تعدّلوش بإيدك؟

- `npm` لحزم JavaScript؛ `Composer` لحزم PHP.
- `Vite` سيرفر تطوير وأداة build؛ مش سيرفر PHP.
- `node_modules/` و`vendor/` حزم مولّدة؛ عدّل source بدلها.
- lock files تثبّت شجرة الإصدارات؛ ما تحذفهاش عشوائيًا.
- **localStorage:** تخزين المتصفح لكل origin؛ مش auth موثوق ومش DB مشتركة.
- **polling:** طلب دوري؛ مش WebSocket؛ [staff](../resources/js/Pages/StaffDashboard.jsx) يطلب كل 7 ثواني.

لو وقفت عند مصطلح، خُد مثاله بس، طبّقه، وارجع للدرس اللي كنت فيه.
