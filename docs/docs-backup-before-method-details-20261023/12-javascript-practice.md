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

**بإيدك:** غيّر المسار لمسار API غير موجود. المتوقع رسالة الخطأ بدل محاولة عرض بيانات غير صالحة.

**غلطة شائعة:** تنسى `await response.json()` فتتعامل مع Promise كأنها بيانات المنتجات.

**سؤال إنترفيو:** `await` بتوقف JavaScript كله؟

<details><summary>الإجابة</summary>لأ؛ بتعلّق استمرار الدالة async لحد النتيجة، وباقي المهام تقدر تشتغل.</details>

المصدر: [مساعد طلبات المشروع](../resources/js/lib/api.js). المثال مختصر ومش بديل للمساعد؛ الطلبات اللي تغيّر البيانات تحتاج قواعد CSRF والجلسة الموجودة فيه.

بعدها: [Vue بنفس البيانات](13-vue-practice.md).
