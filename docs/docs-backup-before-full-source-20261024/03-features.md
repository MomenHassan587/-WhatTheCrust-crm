# أسئلة features: من ضغطة المستخدم لحد النتيجة

اختار سؤال واحد في القعدة. هدفنا نعرف **البيانات ماشية فين ومين مسؤول عنها**، مش نستعرض كل كود الميزة مرة واحدة.

## 1. اخترت فرع وقسم: مين بيحدد المنتجات اللي تظهر؟

المصدر: [MenuPage.jsx](../resources/js/Pages/MenuPage.jsx)، [CatalogContext](../resources/js/context/CatalogContext.jsx).

**مقتطف فعلي من MenuPage:**

```jsx
const filteredItems = useMemo(() => items.filter((item) => {
    const option = branchOption(item, selectedBranchId);
    return item.category_slug === activeCategory && option?.is_available;
}), [items, activeCategory, selectedBranchId]);
```

**كل سطر بيعمل إيه؟**

- `filteredItems` نتيجة عرض، مش نسخة تانية من كل بيانات السيرفر.
- `useMemo` يحفظ نتيجة الحساب بين renders طالما dependencies ما تغيرتش؛ مش شرط للتصفية نفسها، ومش validation.
- `items.filter` ترجع array جديدة بالعناصر اللي callback بتاعتها truthy.
- `branchOption` helper بيجيب بيانات المنتج في الفرع، مثل السعر والتوفر.
- `=== activeCategory` يطابق القسم المختار؛ `&&` يشترط كمان التوفر.
- `option?.is_available` تمنع error لو مفيش option للفرع.
- آخر array تقول React إمتى يعيد الحساب.

**مهم:** النسخة الحالية بقت تجيب الكتالوج من `/api/menu` عبر CatalogContext، مش قائمة menu هاردكود زي بعض المذكرات القديمة. في static demo نفس الواجهة تعتمد على demo adapter بدل PHP endpoint.

**تمرين يدوي:** اقرأ قيمة `activeCategory` وجرّب تغيير القسم من الواجهة. **المتوقع:** بيانات items الأصلية مش بتتحذف؛ اللي بيتغير نتيجة التصفية.

**خطأ شائع:** `filter` بتغير القائمة الأصلية؟ لأ. أو الاعتماد على إخفاء المنتج في الفرونت لمنع طلبه؛ Laravel يعيد التحقق من التوفر.

**إنترفيو:** ليه مشتقات مش state إضافية؟ لأن تخزين نتيجة التصفية كحقيقة مستقلة محتاج مزامنة ممكن تنسى تعملها.

## 2. زوّدت quantity: ليه `map` مش تعديل مباشر؟

المصدر: [Cart.jsx](../resources/js/Pages/Cart.jsx).

**مقتطف فعلي:**

```jsx
const updateItem = (id, changes) => {
    const next = cartItems.map((item) => item.id === id ? { ...item, ...changes } : item);
    setCartItems(next);
    writeCart(next);
};
```

- `(id, changes)` مدخلان: مين يتعدل؟ وإيه الخصائص الجديدة؟
- `map` يمر على السلة ويرجع array جديدة.
- `item.id === id` يحدد العنصر المقصود.
- `condition ? A : B` يرجع object جديد للمطابق والعنصر القديم للباقي.
- `{ ...item, ...changes }` ينسخ البيانات؛ خصائص changes اللاحقة تكسب لو نفس الاسم.
- `setCartItems(next)` يحدّث React state والعرض.
- `writeCart(next)` يكتب localStorage ويطلق event لتحديث عداد السلة في نفس التبويب.

**تمرين جديد مبسّط، داخل Cart حيث الدالة موجودة:**

```js
updateItem(1, { quantity: 3 });
```

**المتوقع:** العنصر id=1 فقط يتحدث لو موجود. ما تشغّلش النداء مباشرة في body المكوّن كل render؛ جرّبه من handler زر.

**خطأ شائع:** localStorage وحدها بتخلي React يرندر؟ لأ؛ setter أو listener يزامن state. حدث `storage` العادي لا ينطلق في نفس التبويب اللي عمل الكتابة، لذلك فيه custom event.

**إنترفيو:** هل سعر السلة موثوق للدفع؟ لا؛ preview من الفرونت. Laravel يحسب السعر من DB.

## 3. ضغطت تأكيد طلب نقدي: مين يحفظه؟

المصدر: [Cart.jsx](../resources/js/Pages/Cart.jsx)، [OrderController](../app/Http/Controllers/Api/OrderController.php)، [OrderCreator](../app/Services/Orders/OrderCreator.php).

**مقتطف فعلي من داخل try في submitCashOrder:**

```jsx
const response = await csrfFetch('/api/orders', { method: 'POST', body: JSON.stringify(buildPayload()) });
clearCart();
navigate(response.tracking_url);
```

- `buildPayload()` يجمع الفرع والعميل والخدمات المطلوبة؛ الـ items تبعت IDs وquantity وnotes، مش السعر كحقيقة موثوقة.
- `JSON.stringify` يحوّل البيانات إلى نص JSON للطلب.
- `await csrfFetch` ينتظر؛ الـ helper يضيف headers والجلسة في الوضع الحقيقي، أو يشغّل demo adapter في static demo.
- `clearCart()` بعد النجاح فقط؛ مش قبل ما نعرف إن السيرفر قبل الطلب.
- `navigate` يفتح صفحة التتبع باستخدام الرابط في الرد.

**مقتطف فعلي من controller بعد validation:**

```php
$order = $creator->create($data, $request->user(), Order::STATUS_NEW);
OrderPlaced::dispatch($order);
```

- `$creator` خدمة حقنها Laravel؛ الوظيفة الكبيرة مش مكتوبة كلها في controller.
- `$data` جاية من `$request->validated()` في نفس الميثود.
- `$request->user()` المستخدم الحالي أو null للضيف حسب التدفق.
- `Order::STATUS_NEW` ثابت للحالة.
- `dispatch` يطلق event؛ مش معناه إن متصفح الموظف عنده WebSocket متصل بالفعل.

OrderCreator يستخدم transaction، يتأكد من الفرع والمنتج والتوفر، يقرأ سعر `branch_menu_item`، ويحفظ order/items وسعر اللحظة. عنوان التتبع مبني على token، والـ staff API له صلاحيات مختلفة.

**تمرين يدوي:** افتح ملف OrderCreator وحدد سطر قراءة `$pivot->price`. **المتوقع:** السعر مصدره DB، مش `item.price` اللي المستخدم ممكن يعدّله.

**خطأ شائع:** تجربة POST حقيقي ممكن تنشئ طلب؛ في مذاكرة قراءة الكود استخدم بيئة محلية/اختبار وبيانات وهمية، مش دفع أو سيرفر إنتاج.

**إنترفيو:** ليه transaction؟ علشان order/items ما يتحفظوش نصف حفظ لو فشل جزء؛ مش بديل للـ validation والصلاحيات.

## 4. اخترت بطاقة: هل رسالة نجاح المتصفح تكفي؟

المصدر: [PaymentController](../app/Http/Controllers/Api/PaymentController.php)، [StripePaymentGateway](../app/Services/Payments/StripePaymentGateway.php).

**مقتطف فعلي من webhook:**

```php
try {
    $event = $gateway->parseWebhook($request->getContent(), (string) $request->header('Stripe-Signature'));
} catch (Throwable) {
    return response()->json(['message' => 'Invalid webhook signature.'], 400);
}
```

- `try` حاول تحليل الحدث والتحقق من التوقيع.
- `getContent()` body الخام، و`Stripe-Signature` header التوقيع.
- `(string)` تحويل/تأكيد النوع حسب الكود.
- `catch (Throwable)` يمسك فشل التحليل ويرجع 400 بدل تحديث أي طلب.
- نجاح التوقيع مش نهاية التدفق: الكود بعدها يحدد PaymentIntent والطلب ونوع الحدث ثم يحدّث حالة الدفع.

**تمرين سؤال فقط:** حد غيّر localStorage لـ `paid`، هل ده دليل للسيرفر؟ **المتوقع:** لا. النسخة المحلية الحقيقية تعتمد webhook متحقق منه، والديمو مجرد محاكاة.

**خطأ شائع:** تقول الدفع جاهز production لمجرد وجود Stripe package. محتاج إعدادات آمنة واختبارات واعتماد نشر حقيقي، ومعالجة تكرار/فشل/concurrency مناسبة.

**إنترفيو:** لماذا webhook؟ لأنه server-to-server confirmation، بينما المتصفح ممكن يتقفل أو تتغير قيمه.

## 5. AutoCare حفظ عربية: ليه مش بتظهر على جهاز تاني؟

المصدر: [garageRepository.js](../../autocare-booking/resources/js/services/garageRepository.js)، [useGarage](../../autocare-booking/resources/js/composables/useGarage.js).

**مقتطف فعلي من repository:**

```js
write(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); return true; }
    catch { return false; }
},
```

- `write(data)` method داخل object؛ مش endpoint Laravel.
- `JSON.stringify` يجهّز نص التخزين.
- `localStorage.setItem` يكتب في متصفحك للـ origin الحالي.
- `return true` يبلغ المستدعي بنجاح العملية؛ مش إثبات حفظ في DB.
- `catch` مثلًا لو التخزين غير متاح، يرجع false بدل توقف الواجهة باستثناء غير معالج.

**تمرين:** احفظ demo vehicle على بيئة محلية، اعمل refresh، ثم افتح profile متصفح مختلف. **المتوقع:** الأول يحتفظ بها، التاني له تخزين مستقل.

**خطأ شائع:** اعتبار التخزين المحلي حساب عميل أو حماية بيانات مشتركة.

**إنترفيو:** ما التطوير الحقيقي المطلوب؟ authenticated API، ownership/authorization لكل vehicle، validation، DB relationships واختبارات؛ مش تبديل اسم دالة فقط.

## 6. سؤال كامل من 3 ملفات: ضغطة Save Vehicle بتكمل فين؟

دي **الرحلة الحقيقية الحالية في AutoCare**، مش backend كامل. اقرأ كل مرحلة لوحدها؛ مش مطلوب تنسخ كل الكود في ملف واحد.

### أ. المكوّن `GarageDashboard.vue` يجمع البيانات

أعلى script المكوّن موجود:

```js
import { useGarage } from '../composables/useGarage';
const { state, storage, addVehicle } = useGarage();
```

- `useGarage` دالة كتبناها للمشروع، مش method جاهزة في Vue. الاسم بادئ بـ use كاصطلاح، مش اللي بيشغّلها تلقائيًا.
- النداء `useGarage()` يرجع object فيه الحالة ودوال الإضافة. `{...}` تفكيك للـ object علشان نستخدم كل خاصية باسمها.
- `state` البيانات reactive، و`storage` حالة إمكانية الحفظ، و`addVehicle` الدالة اللي هتكمل في الملف التالي.

**مقتطف فعلي من الفورم، واختصرنا حقول الواجهة هنا للقراءة:**

```vue
<form @submit.prevent="saveVehicle">
    <input v-model.trim="vehicleForm.make" required>
    <input v-model.trim="vehicleForm.model" required>
    <input v-model.trim="vehicleForm.plate" required>
    <button type="submit">Save vehicle</button>
</form>
```

- `v-model.trim` تربط الحقل بالخاصية وتحذف المسافات من طرفي قيمة الإدخال. لا تتحقق من ملكية العربية ولا تحفظها وحدها.
- `@submit` يستمع لإرسال الفورم؛ `.prevent` تجعل Vue تنادي `event.preventDefault()` لمنع التنقل/إعادة تحميل الصفحة بالطريقة الافتراضية، ثم تنادي `saveVehicle`.
- `required` تحقق HTML مبدئي؛ الكود التالي يكرر فحص ما يحتاجه لتجربة المستخدم. backend مستقبلي محتاج validation مستقلة.

**دالة `saveVehicle` الفعلية، فكّينا تنسيق السطور بس:**

```js
function saveVehicle() {
    vehicleError.value = '';

    if (!vehicleForm.make.trim() || !vehicleForm.model.trim() || !vehicleForm.plate.trim()) {
        vehicleError.value = 'Please complete the vehicle details.';
        return;
    }

    if (state.vehicles.some(v => v.plate.toLowerCase() === vehicleForm.plate.toLowerCase())) {
        vehicleError.value = 'That registration is already saved.';
        return;
    }

    addVehicle({ ...vehicleForm });
    showVehicleForm.value = false;
    notice.value = 'Vehicle saved in this demo workspace.';
    Object.assign(vehicleForm, {
        make: '', model: '', year: new Date().getFullYear(), plate: '', mileage: 0,
    });
}
```

**كل خطوة بتعمل إيه؟**

1. نمسح خطأ محاولة قديمة بدل ما يفضل ظاهر بعد التصحيح.
2. `trim()` method نص؛ تستقبل لا شيء، وترجع نصًا جديدًا من غير المسافات في الطرفين. مثال `'   '` تصبح `''`، فـ `!''` تبقى true ونكتشف الحقل الفاضي فعليًا.
3. `return;` داخل الشرط يخرج من saveVehicle مبكرًا؛ مش معناها نجاح الحفظ. مفيش كود بعدها يتنفذ في المحاولة دي.
4. `some(callback)` method array، تنادي الاختبار لحد أول truthy وترجع Boolean. مش بترجع العربية المطابقة. بنسأل «فيه تسجيل مكرر؟» علشان كده some مناسبة.
5. `toLowerCase()` method نص ترجع نسخة بحروف صغيرة: `'DEMO 101'` → `'demo 101'`. المقارنة تصبح غير حساسة لحجم الحروف؛ مش تغيير للّوحة المخزّنة نفسها.
6. لو فيه تكرار نعرض خطأ ونخرج، قبل استدعاء الإضافة.
7. `addVehicle({...vehicleForm})` تمرر shallow copy لبيانات الفورم إلى composable. `...` تنسخ الخصائص القابلة للعد هنا؛ مش deep clone ولا طلب HTTP.
8. نغلق الفورم ونخزن نص الإشعار في ref للعرض. الرسالة تصف حفظ ديمو في المتصفح، مش حفظ Laravel DB.
9. `Object.assign(target, source)` دالة JavaScript جاهزة: تكتب خصائص source فوق target وترجع target. هنا target هو vehicleForm reactive، فلا نستبدل object نفسه ونفقد ارتباطاته. إحنا لا نستخدم العائد، نحتاج تأثير إعادة الحقول للقيم الابتدائية.
10. `new Date()` ينشئ Date object للوقت الحالي؛ `.getFullYear()` method بلا مدخلات ترجع سنة رقمية محلية، مثل `2026`. دي قيمة بداية لحقل السنة، مش تاريخ حفظ في DB.

### ب. الملف `composables/useGarage.js` يضيف العربية إلى الحالة

**مقتطف فعلي داخل useGarage، تنسيق موسّع:**

```js
const addVehicle = (vehicle) => {
    const entry = {
        ...vehicle,
        id: crypto.randomUUID(),
        year: Number(vehicle.year),
        mileage: Number(vehicle.mileage || 0),
    };
    state.vehicles.push(entry);
    return entry;
};
```

- `vehicle` المدخل اللي المكوّن بعته. `entry` object جديد علشان نضيف معرّف ونطبع أنواع الأرقام.
- `crypto.randomUUID()` Browser method بلا مدخلات، ترجع UUID كنص، مثل `'e4a...-...'`. تحتاج سياقًا آمنًا مدعومًا مثل HTTPS أو localhost؛ مش ID صادر من قاعدة بيانات ولا دليل صلاحيات.
- `Number(vehicle.year)` تحوّل `'2021'` إلى `2021`. لو النص غير صالح ترجع NaN؛ لازم validation إضافية لو اتحول التدفق لمنتج حقيقي.
- `push(entry)` method array؛ تضيف العنصر **لنفس array** وترجع طولها الجديد، لكننا مش بنستخدم الطول. Vue يتابع التعديل لأن state reactive، فيحدّث عناصر الواجهة المرتبطة بها.
- `return entry` عائد دالة addVehicle هو object العربية الجديدة. saveVehicle هنا لا تخزنه في متغير لأنها محتاجة تأثير الإضافة فقط.

### ج. نفس الملف يراقب التغيير ويستدعي الـ repository

**الربط الفعلي على مستوى module:**

```js
const state = reactive(garageRepository.read() || seed());
const storage = reactive({ available: true });

watch(state, () => {
    storage.available = garageRepository.write(state);
}, { deep: true });
```

- `garageRepository.read()` دالة مشروع بلا مدخلات، تقرأ المخزّن وترجع بيانات سليمة الشكل أو null. لو null، `|| seed()` ينادي دالة الديمو اللي ترجع بيانات البداية.
- `reactive(object)` من Vue ترجع Proxy يسمح بتتبّع تغييرات الخصائص. state هنا مشتركة من module بين مستخدمي useGarage في نفس تطبيق الصفحة، مش ref منفصلة لكل مكوّن.
- `watch(source, callback, options)` من Vue تسجّل مراقبة: المصدر state، الدالة تعمل أثرًا جانبيًا وهو الحفظ، و`deep:true` علشان متابعة التعديلات الداخلية مثل إضافة عربية إلى vehicles.
- watch ترجع handle لإيقاف المراقبة لو احتجت، لكن الكود الحالي لا يخزنه؛ المراقبة على مستوى module، مش مربوطة بإزالة dashboard وحدها.
- callback هنا لا تحتاج مدخلات القيمة القديمة والجديدة؛ تقرأ state الحالية وتكتبها. توقيت watcher الافتراضي مجدول/مجمّع، مش لازم يحصل قبل السطر التالي مباشرة.
- `garageRepository.write(state)` ترجع true أو false؛ نخزن الإجابة في `storage.available` علشان الواجهة تقدر تبلغ المستخدم لو التخزين غير متاح.

### د. الملف `services/garageRepository.js` يحفظ النص

**method فعلية؛ حطيناها في object صغير علشان تشوف حدودها.** ده مقتطف قراءة من الملف، مش كود تضيفه مرة ثانية؛ `STORAGE_KEY` معرّفة أعلى الملف بالقيمة `'autocare.demo.garage.v1'`:

```js
const garageRepository = {
    write(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch {
            return false;
        }
    },
};
```

ده method داخل object اسمه garageRepository؛ مش function ناقصها كلمة function. `JSON.stringify(data)` ترجع نص JSON؛ `setItem(key,text)` تخزن النص للـ origin الحالي، وعائدها undefined. بعد نجاحها نرجع Boolean true بأنفسنا. لو التخزين ممتلئ أو مرفوض، catch ترجع false بدل انهيار التدفق باستثناء غير معالج.

**مقتطف read الفعلي المكمل عند refresh، داخل نفس garageRepository الأصلي.** الغلاف هنا للتوضيح، مش تعريف object ثانية تضيفها في نفس الملف:

```js
const garageRepository = {
    read() {
        try {
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (data?.version === 1 && Array.isArray(data.vehicles) && Array.isArray(data.appointments) && Array.isArray(data.history)) return data;
        } catch {}
        return null;
    },
};
```

- `getItem` ترجع النص أو null. `JSON.parse` تحوّله لبيانات؛ `JSON.parse(null)` ترجع null، والـ optional chaining يمنع قراءة version من null.
- `Array.isArray(value)` تستقبل قيمة وترجع Boolean؛ `Array.isArray([])` true و`Array.isArray({})` false. الفحص هنا محدود لشكل القوائم؛ مش validation كاملة لكل حقل عربية.
- لو version وشكل القوائم مناسبين نرجّع data. لو فشل التحليل أو البيانات غير مناسبة، النتيجة null فتُستخدم seed في مرحلة ج.

### هـ. رجوع النتيجة للواجهة

**مثال عرض مبسّط لنفس state** — داخل template مكوّن يستخدم useGarage:

```vue
<article v-for="vehicle in state.vehicles" :key="vehicle.id">
    <h2>{{ vehicle.make }} {{ vehicle.model }}</h2>
    <p>{{ vehicle.plate }}</p>
</article>
```

بعد `push` عدد العناصر في state زاد، فـ v-for يعرض كارت إضافي. refresh ينهي الحالة الذاكرية ثم read تسترجع JSON وتعيد بناء البداية. جهاز آخر أو origin مختلف لا يرى نفس التخزين؛ مفيش حساب عميل أو API في السلسلة دي.

**تنبيه من الكود الحقيقي:** saveVehicle تضبط نص النجاح حتى لو التخزين فشل لاحقًا؛ `storage.available` حالة منفصلة للإنذار. إضافة العنصر في الواجهة لا تثبت إن الحفظ الدائم نجح. دي نقطة مفيدة تلاحظها بدل القول إن كل خطوة مثالية.

## 7. سؤال: methods الحجز والدفع اللي فوق معناها إيه؟

المساران الكاملان مع بقية الدوال في [درس الحجز والدفع](08-checkout-and-payment.md). المرجع السريع هنا يوضح الوظيفة، مش بديل عن قراءة التدفق:

- `buildPayload()` دالتنا في Cart، بلا مدخلات؛ ترجع object مركّبًا من حالة الفرع والعميل والسلة. `map` داخلها تحول كل عنصر إلى `{menu_item_id,quantity,notes}`، ومش بتبعت سعر المتصفح كمصدر موثوق.
- `JSON.stringify(object)` ترجع نص JSON لجسم طلب POST؛ لا ترسل الشبكة بنفسها.
- `csrfFetch(url, options)` دالتنا async: مدخلها عنوان وإعدادات الطلب، وترجع Promise بـ payload JSON في الوضع الحقيقي أو نتيجة محاكي الديمو. `await` تطلع النتيجة، والفشل يذهب لـ catch. [شرح helper خطوة خطوة](07-menu-and-cart.md).
- `clearCart()` دالتنا: تنادي `setCartItems([])` لتحديث الواجهة ثم `writeCart([])` لمسح السلة المخزّنة وإبلاغ العداد. لا تاخد مدخلات ولا ترجع بيانات طلب.
- `navigate(response.tracking_url)` دالة React Router اللي رجعتها useNavigate، مدخلها رابط التتبع؛ تنقل الواجهة بعد النجاح. لا تنشئ order بنفسها.
- `$request->validated()` method في Laravel FormRequest، ترجع array البيانات اللي نجحت قواعد التحقق. الطلب غير الصالح لا يكمل create الطبيعي؛ يرجع رد validation حسب التدفق.
- `$request->user()` method Laravel Request، بلا مدخلات هنا، ترجع المستخدم الحالي أو null. وجود null هنا لا يعني صلاحية موظف.
- `$creator->create($data, $user, $status)` method كتبناها في خدمة OrderCreator؛ مدخلاتها بيانات محققة، مستخدم اختياري، وحالة البداية، وناتجها Order model بعد نجاح transaction. Laravel لا ينفّذها لمجرد اسم create؛ controller يناديها.
- `OrderPlaced::dispatch($order)` طريقة Laravel لإرسال event مع order للمستمعين المسجّلين. مش معناها وحدها إن اتصال WebSocket اتفتح، ومش هي اللي حفظت السجل أولًا.
- `$request->getContent()` تجيب raw body كنص للـ webhook. `$request->header('Stripe-Signature')` تقرأ قيمة header، اللي gateway تستخدمها للتحقق من توقيع نفس body.
- `$gateway->parseWebhook(body, signature)` method مشروع على gateway، ترجع event بعد نجاح parsing/verification أو ترمي خطأ. مش مجرد JSON.parse؛ التوقيع جزء أساسي.
- `response()->json(data, status)` helper Laravel يبني JsonResponse؛ مثلًا array رسالة مع `400`. ده رجوع استجابة للسيرفر المنادي، مش عرض رسالة مباشرة في React.

## السؤال اللي يختم أي feature

قبل ما تقول «أنا فاهمها»، جاوب أربع حاجات: **القيمة بدأت منين؟ اتغيّرت فين؟ اتحفظت فين؟ ومين يتحقق منها؟**

اختار ميزة واحدة من الصفحة، تتبع الملفات المذكورة، واشرحها في دقيقتين. تفاصيل كل تدفق في درسه المتخصص، مش لازم تحفظ الصفحة كلها النهارده.
