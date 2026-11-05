# 15 — أتأكد إن الكود صح وأشرح ده في الإنترفيو؟

[الفهرس](00-start-here.md) · اقرأ JavaScript وطلبات API قبل الاختبارات. الأمثلة التعليمية متنفّذش ضد بيانات الشغل الحقيقية.

## سؤال 1: أختبر حساب الإجمالي بدون فتح المتصفح؟

**مثال تدريبي إضافي**، مستقل عن تطبيق الدفع. اعمل `total.practice.mjs` في فولدر تدريب منفصل:

```js
import assert from 'node:assert/strict';
function calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
assert.equal(calculateTotal([{ price: 50, quantity: 2 }]), 100);
assert.equal(calculateTotal([]), 0);
console.log('Passed');
```

1. أداة assertions الموجودة في Node؛ strict تقارن بدون تحويل أنواع تلقائي.
2. دالة تاخد قائمة.
3. تجمع قيمة كل سطر؛ صفر قيمة البداية.
4. نهاية الدالة.
5. شغّل الحساب وقارن النتيجة المتوقعة 100؛ لو مختلفة assertion ترمي خطأ.
6. اختبر حالة حدّية: سلة فاضية.
7. اطبع Passed لو مفيش assertion فشلت.

شغّل من فولدر التدريب:

```powershell
node total.practice.mjs
```

**بإيدك:** غيّر المتوقع إلى 90. المفروض الاختبار يفشل؛ رجّعه 100 بعد التجربة.

**غلطة شائعة:** اختبار حالة النجاح فقط، ونسيان الفاضي والحدود والأخطاء.

**سؤال إنترفيو:** ليه دي قريبة من Unit Test؟

<details><summary>الإجابة</summary>بتختبر دالة صغيرة معزولة بدون HTTP أو DB أو متصفح. اختبارات مشروع Pizza الفعلية موجودة في tests/demo/orders.test.mjs ومش كلها unit لأن بعضها يختبر تدفق demo كامل.</details>

المصدر الحقيقي للمقارنة: [اختبارات demo](../tests/demo/orders.test.mjs).

## سؤال 2: أختبر GET /api/menu في Laravel؟

**مثال مبسّط** من [MenuApiTest](../tests/Feature/MenuApiTest.php). ضعه كـ method جديدة داخل نفس test class لو بتطبّق يدويًا؛ الـ class الموجودة فيها RefreshDatabase وبتعمل seed للكتالوج في setUp:

```php
public function test_menu_has_items_for_practice(): void
{
    $response = $this->getJson('/api/menu');
    $response->assertOk();
    $response->assertJsonStructure(['branches', 'categories', 'items']);
    $response->assertJsonPath('items.0.id', 1);
}
```

1. public method للاختبار؛ الاسم يبدأ test_؛ void معناها مش بترجع قيمة.
2. بداية الجسم.
3. `$this` test case الحالية؛ `->` استدعاء method؛ getJson ينفّذ طلب اختباري مع توقع JSON.
4. تأكد status 200.
5. تأكد وجود مفاتيح الاستجابة.
6. تأكد معرّف أول منتج 1 حسب seeder المستخدم؛ مش افتراض لكل قاعدة بيانات.
7. نهاية الاختبار.

قبل تشغيل أي اختبار DB: راجع [phpunit.xml](../phpunit.xml). إعداد المشروع وقت المراجعة testing + SQLite `:memory:`؛ خليك متأكد مفيش إعداد خارجي/كاش بيحوّله لقاعدة حقيقية. متستخدمش `migrate:fresh` على قاعدة شغل.

```powershell
php artisan test --filter=MenuApiTest
```

**بإيدك:** غيّر path إلى `items.0.id` بقيمة متوقعة غلط داخل الاختبار فقط وشوف الفشل، ثم رجّعه.

**غلطة شائعة:** تفسّر مرور اختبار القائمة إنه دليل إن الدفع أو صلاحيات الموظفين سليمة. كل سلوك يحتاج اختبار خاص.

**سؤال إنترفيو:** Unit ولا Feature؟

<details><summary>الإجابة</summary>Feature لأنه يعدّي عبر HTTP routing وLaravel والـ DB الاختبارية، مش دالة واحدة معزولة.</details>

## سؤال 3: أختار حالات اختبار مهمة من المشروع؟

قبل قراءة [OrderOperationsTest](../tests/Feature/OrderOperationsTest.php)، جاوب:

1. لو العميل بعت total_price = 1، هل السيرفر يعتمده؟ المتوقع لأ؛ يعيد الحساب من بيانات الفرع.
2. لو staff لفرع 1 حاول يعدّل طلب فرع آخر؟ المتوقع رفض الوصول وفق كود السيرفر؛ بعض المسارات تخفي وجود الطلب بـ404.
3. لو تعديل حالة الطلب جاي من شاشة قديمة؟ المتوقع رفض التعارض، مش الكتابة فوق تحديث أحدث.
4. لو webhook اتبعت مرتين؟ لازم تختبر عدم تكرار الأثر؛ الاختبار المتسلسل لا يثبت الأمان من السباق المتزامن وحده.

**بإيدك:** اختار حالة واحدة، واقرأ اسم test اللي بيغطيها، وحدد Arrange البيانات وAct الطلب وAssert التوقع.

**غلطة شائعة:** كتابة test يكرّر نفس منطق التطبيق لحساب النتيجة المتوقعة؛ ممكن نفس الغلط ينجح في الاتنين.

**سؤال إنترفيو:** النجاح في كل الاختبارات يضمن انعدام الأخطاء؟

<details><summary>الإجابة</summary>لأ؛ يثبت الحالات اللي اختبرناها فقط، وجودة الدليل تعتمد على تغطية السيناريوهات والحدود.</details>

## سؤال 4: أكتشف ليه سعر الخدمة مش بيظهر؟

**مثال تدريبي إضافي** من الغلطة اللي قابلتك:

```js
const selectedServiceId = '2';
const services = [{ id: 2, price: 300 }];
const selected = services.find((item) => item.id === selectedServiceId);
console.log(typeof selectedServiceId);
console.log(selected);
```

1. القيمة نص بين اقتباسات.
2. id رقم.
3. المقارنة الصارمة تفشل لاختلاف النوع؛ find ترجع undefined.
4. typeof يطبع string.
5. يطبع undefined؛ ده يفسّر غياب السعر قبل ما تلوم CSS.

**بإيدك:** قارن بـ `Number(selectedServiceId)` بعد التأكد إن المدخل صالح؛ المتوقع object السعر 300. في Vue select المثال الصحيح `:value="service.id"` يمرّر الرقم أصلًا.

**غلطة شائعة:** تغيّر `===` إلى `==` بدون فهم أصل اختلاف البيانات.

**سؤال إنترفيو:** بتبدأ debugging منين؟

<details><summary>الإجابة</summary>أعيد إنتاج المشكلة، أقرأ أول Console error، أفحص المدخلات وأنواعها، أتابع Network لو فيه API، ثم أصلح السبب وأضيف اختبارًا مناسبًا. مابغيّرش خمس حاجات مرة واحدة.</details>

## سؤال 5: أستخدم Git من غير ما أضيّع شغلي؟

المشاريع وقت المراجعة مش كلها مهيّأة كـ Git repository. الأوامر دي **تدريب في repo موجودة**، مش دليل إنها اتنفّذت هنا:

```powershell
git status
git diff
git add resources/js/components/ServicePractice.vue
git diff --staged
git commit -m "Add service selection practice"
```

1. شوف الفرع والملفات المتغيرة.
2. راجع التعديلات غير المضافة.
3. جهّز الملف المقصود فقط؛ المسار مثال لازم موجود عندك.
4. راجع بالضبط اللي هيدخل commit.
5. احفظ snapshot محلية برسالة توضّح التغيير؛ مش نشر على الإنترنت.

**بإيدك:** اشرح الفرق بين working tree وstaging وcommit قبل التنفيذ.

**غلطة شائعة:** `git add .` بدون مراجعة ممكن يضيف أسرار أو ملفات مش مقصودة. متضيفش .env أو قواعد البيانات أو مفاتيح الدفع، ومتستخدمش أوامر reset/clean المدمّرة لتجربة الحظ.

**سؤال إنترفيو:** commit هي push؟

<details><summary>الإجابة</summary>لأ؛ commit سجل محلي، push يرسل commits إلى remote وده إجراء منفصل.</details>

## سؤال 6: أقيس تقدمي إزاي؟

بدون نسخ الإجابات، اختار ميزة واحدة مثل اختيار خدمة أو إضافة منتج للسلة:

1. اكتب البيانات المطلوبة.
2. اعرضها ثم ضيف التفاعل.
3. اختبر نجاح وفشل ومدخل فاضي.
4. قول بصوتك كل سطر بيعمل إيه.
5. اشرح مصدر الحقيقة: frontend للعرض، backend للأمان والحسابات الموثوقة.

المطلوب مش حفظ المشروع كله؛ المطلوب تقدر تبني جزء صغير، تصلّح غلطته، وتبرّر قرارك.
