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

## السؤال اللي يختم أي feature

قبل ما تقول «أنا فاهمها»، جاوب أربع حاجات: **القيمة بدأت منين؟ اتغيّرت فين؟ اتحفظت فين؟ ومين يتحقق منها؟**

اختار ميزة واحدة من الصفحة، تتبع الملفات المذكورة، واشرحها في دقيقتين. تفاصيل كل تدفق في درسه المتخصص، مش لازم تحفظ الصفحة كلها النهارده.
