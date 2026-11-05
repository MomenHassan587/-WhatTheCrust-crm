# قاموس عملي: السؤال قبل المصطلح

مرجع ترجع له وقت الحاجة. الأمثلة الصغيرة هنا **تدريبية أو مبسّطة**، وليست أوامر تغيّر المشروع الأصلي. في كل سؤال اقرأ المثال ثم توقّع النتيجة.

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
