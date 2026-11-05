# 06 — أسئلة وأمثلة: الـ request بيمشي في Laravel إزاي؟

الترتيب اللي هتحتاج تفهمه في مقابلة: URL وHTTP method يختاروا route؛ middleware تفحص الوصول؛ Form Request تتحقق من البيانات؛ controller ينسّق التنفيذ؛ service تنفّذ منطقًا قابلًا لإعادة الاستخدام؛ وفي الآخر response.

خد سؤال واحد في المرة. الأمثلة المختصرة مش ملفات بديلة. هنا بندرس Laravel الحقيقي في Pizza CRM، مش ملفات الـ frontend demo اللي بتحاكي API.

## 1. مين بيوصل `/api/staff/orders/7` بالدالة المناسبة؟

**مقتطف فعلي** من [routes/web.php](../routes/web.php)، موجود داخل مجموعة `prefix('api')` بالفعل.

```php
Route::middleware(['auth', 'role:staff,admin'])->prefix('staff')->group(function () {
    Route::get('/orders', [StaffOrderController::class, 'index']);
    Route::get('/orders/{order}', [StaffOrderController::class, 'show']);
    Route::patch('/orders/{order}/status', [StaffOrderController::class, 'updateStatus']);
});
```

**كل سطر بيعمل إيه؟**

- `Route::middleware([...])`: أضف فحوصات قبل تنفيذ دوال المجموعة. `auth` للجلسة، و`role:staff,admin` لقبول دور موظف أو مدير حسب middleware المشروع.
- `->prefix('staff')`: ضيف `/staff` قبل مسارات المجموعة. ومع الـ prefix الخارجي النتيجة تبدأ بـ `/api/staff`.
- `->group(function () {`: اجمع المسارات داخل دالة؛ `{` يبدأ جسم المجموعة.
- `Route::get('/orders', [...])`: طلب قراءة القائمة ينادي `index`. الـ array فيها اسم class ثم اسم method كنص.
- `StaffOrderController::class`: هات اسم class الكامل؛ `use` في أول الملف يعرّف الاسم المختصر.
- `'/orders/{order}'`: الجزء بين `{}` قيمة متغيرة. مع parameter اسمه `$order` ونوعه `Order` في method، Laravel يحمّل السجل: route model binding.
- `Route::patch(...)`: تعديل جزئي للحالة، مش طلب قراءة. يوجّه إلى `updateStatus`.
- `});`: قفل الدالة والمجموعة.

لو سجل 7 مش موجود، binding يرجع404. لو موجود لكن تابع لفرع تاني، فيه فحص صلاحيات مستقل في controller؛ وجود السجل لا يعني السماح بعرضه.

ملفات `web.php` محمّلة من [bootstrap/app.php](../bootstrap/app.php). المسار يبدأ بـ `/api` لكن ما زال داخل web middleware، ولذلك المشروع يستخدم sessions وCSRF؛ الاسم وحده مش بيحوّله إلى token API. الطلب يدخل Laravel أصلًا من `public/index.php`، مش من ملف الـ controller مباشرة.

**نفّذ بإيدك:** حدد المسار والـ method والدالة لطلب قائمة الموظفين ولتغيير حالة الطلب 7. استخدم قراءة الكود أو Network؛ ما تبعتش PATCH عشوائي لطلب فعلي.

**المتوقع:** GET `/api/staff/orders` ينادي index؛ PATCH `/api/staff/orders/7/status` ينادي updateStatus بعد فحوص الوصول.

**غلطة شائعة:** تجرب POST على route مكتوبة PATCH، أو تعتبر model binding بديل authorization. method غلط قد يرجّع405 بدل404.

<details>
<summary>سؤال إنترفيو: هل route لازم تستخدم controller؟</summary>

لأ، ممكن closure أو `Route::view`. Controller مناسب لتنظيم معالجة الطلبات، خصوصًا لما فيها منطق أو اعتماديات أو أكثر من إجراء مترابط.

</details>

## 2. ليه الـ controller مش بيحسب الأسعار بنفسه؟

**مثال مبسّط من** [OrderController.php](../app/Http/Controllers/Api/OrderController.php). المثال يحتفظ بفصل الدفع الكاش عن الكارت؛ الأصل يستخدم ValidationException بدل الرد المختصر، ويطلق event ويرجع tracking URL كمان. الاستيرادات موجودة في المصدر.

```php
public function store(StoreOrderRequest $request, OrderCreator $creator): JsonResponse
{
    $data = $request->validated();
    if ($data['payment_method'] === 'card') {
        return response()->json(['message' => 'Use the card endpoint.'], 422);
    }
    $order = $creator->create($data, $request->user(), Order::STATUS_NEW);
    return response()->json(['order' => $order], 201);
}
```

**كل سطر بيعمل إيه؟**

- `public function store(...)`: method معالجة إنشاء الطلب. الاسم نفسه اختيارنا، والـ route هي اللي بتوصله بالـ URL.
- `StoreOrderRequest $request`: Laravel يجهّز طلبًا متحققًا منه باستخدام قواعد Form Request قبل دخول method إذا نجح authorization والـ validation.
- `OrderCreator $creator`: dependency injection؛ Laravel يجهّز object من الخدمة ويمرّره. `: JsonResponse` نوع الاستجابة.
- `$data = $request->validated()`: هات نتيجة التحقق بدل الاعتماد على كل input من غير تمييز.
- `if (... === 'card')`: لو العميل اختار كارت، ما تنشئش الطلب هنا كأنه كاش. `===` مقارنة صارمة.
- `return response()->json(..., 422)`: ارجع خطأ من هذا المثال واقفل المسار. `=>` يربط اسم المفتاح بقيمته في PHP array.
- `}` يقفل شرط الكارت.
- `$creator->create(...)`: ابعت البيانات، المستخدم الحالي أو null للضيف، وحالة new إلى الخدمة المشتركة. `Order::STATUS_NEW` ثابت من الـ model يقلل أخطاء الكتابة.
- آخر `return`: ارجع الطلب JSON بكود201 لإنشاء مورد جديد. `}` يقفل method.

الخدمة الأصلية [OrderCreator](../app/Services/Orders/OrderCreator.php) تنفّذ تحقق التوفر والسعر والحفظ؛ بيستخدمها cash controller وpayment controller بدل تكرار نفس القواعد. ده فصل مسؤوليات، مش شرط إن كل controller صغير يحتاج service من أول يوم.

**نفّذ بإيدك:** امشِ على المثال مرة بقيمة cash ومرة card، وحدد هل `create` تتنادى. ما تحتاجش تنشئ طلبًا جديدًا فعلًا.

**المتوقع:** cash يصل للخدمة ويرجع201 إذا نجح الحفظ؛ card يتوقف عند422 في المثال.

**غلطة شائعة:** تسمح لمسار الكاش ينشئ طلب card بحالة new قبل التحقق من الدفع؛ الموظف ممكن يبدأ تجهيزه وهو غير مدفوع.

<details>
<summary>سؤال إنترفيو: إيه الفرق بين controller وservice؟</summary>

Controller يتعامل مع سياق HTTP وينسّق الرد. Service تجمع منطق العمل القابل لإعادة الاستخدام، مثل إنشاء طلب بأسعار موثوقة. Laravel مش بيفرض service layer لكل عملية.

</details>

## 3. إزاي تتحقق من بيانات عناصر جاية جوه array؟

**مثال مبسّط من** [StoreOrderRequest.php](../app/Http/Requests/StoreOrderRequest.php). ده جزء من قواعده فقط؛ متحذفش قواعد العميل والعنوان ونوع الطلب وباقي قواعد المصدر.

```php
public function rules(): array
{
    return [
        'branch_id' => ['required', 'integer', 'exists:branches,id'],
        'items' => ['required', 'array', 'min:1'],
        'items.*.menu_item_id' => ['required', 'integer', 'exists:menu_items,id'],
        'items.*.quantity' => ['required', 'integer', 'min:1', 'max:20'],
        'items.*.notes' => ['nullable', 'string', 'max:200'],
    ];
}
```

**كل سطر بيعمل إيه؟**

- `public function rules(): array`: Laravel يقرأ من الدالة دي قائمة validation rules. `array` نوع الناتج.
- `return [`: ابدأ الـ array اللي كل مفتاح فيها اسم field وكل قيمة قواعده.
- `branch_id`: إجباري، integer، ولازم القيمة موجودة في عمود id بجدول branches. وجود الفرع غير كونه فعّالًا؛ الخدمة بتتحقق من فعاليته لاحقًا.
- `items`: لازم قائمة، وبها عنصر واحد على الأقل. هنا `min:1` حد لحجم الـ array، مش حد لسعرها.
- `items.*.menu_item_id`: النقطة للوصول داخل البنية، و`*` معناها كل عنصر. يتحقق من معرف كل منتج ومن وجوده في جدول المنيو.
- `items.*.quantity`: كل كمية عدد صحيح من1 إلى20. الصفر أو25 غير مقبولين.
- `items.*.notes`: الملاحظة ممكن تكون null؛ لو فيها قيمة فلازم نص لحد200 حرف. دي قاعدة خلفية حتى لو input الواجهة عليها maxLength.
- `];` يقفل array؛ `}` يقفل الدالة.

لو طلب JSON فشل في القواعد، Laravel عادة يرجع422 مع errors بدل الدخول لـ controller. الـ request الفعلي فيه `authorize()` يرجعtrue للسماح بضيف يعمل checkout؛ ده مش معناه إن باقي endpoints مفتوحة أو إن أي input صالح. قواعد pickup الإضافية تستخدم وقت التحضير من AppSetting ثم fallback config. حقل `opening_hours` الحالي نص للعرض؛ الكود الإضافي بيفحص `opens_at/closes_at` غير الموجودين حاليًا، فمتقولش إن عندنا تحقق ساعات تشغيل كامل.

**نفّذ بإيدك:** على الورق، اكتب payload بعنصر واحد quantity=0 ثم quantity=2. حدّد اسم مفتاح الخطأ المتوقع للأول.

**المتوقع:** الأول يرفض الكمية، ومفتاح الخطأ `items.0.quantity`؛ الثاني يعدي القاعدة دي لو باقي الشروط سليمة.

**غلطة شائعة:** تعتبر `exists:menu_items,id` ضمان إن المنتج متاح بالفرع. ده تحقق إضافي في الخدمة، مش في القاعدة دي.

<details>
<summary>سؤال إنترفيو: ليه نعمل validation في السيرفر لو الفرونت بالفعل بيتحقق؟</summary>

لأن العميل يقدر يتجاوز الواجهة أو يعدل request. تحقق الواجهة لتحسين التجربة؛ تحقق السيرفر لحماية قواعد النظام والبيانات.

</details>

## 4. لو تحديث الحالة نجح وتسجيل التاريخ فشل، نعمل إيه؟

**مثال مبسّط من** [StaffOrderController.php](../app/Http/Controllers/Api/StaffOrderController.php). داخل method عندها `$order` و`$data`؛ نفترض authorization والتحقق من الانتقال تمّا بالفعل. الأصل يعيد قراءة الطلب تحت lock، ويفحص expected_status ويسجل المستخدم والسبب كمان.

```php
DB::transaction(function () use ($order, $data) {
    $from = $order->status;
    $order->update(['status' => $data['status']]);
    OrderStatusLog::create([
        'order_id' => $order->id,
        'from_status' => $from,
        'to_status' => $data['status'],
        'created_at' => now(),
    ]);
});
```

**كل سطر بيعمل إيه؟**

- `DB::transaction(...)`: اجمع تغييرات قاعدة البيانات داخل transaction؛ لو callback فشل بـ exception تتعمل rollback لتغييراتها.
- `function () use ($order, $data)`: دالة من غير arguments مباشرة؛ `use` هنا تدخل المتغيرات الخارجية إلى نطاق closure. دي غير `use` استيراد class أعلى الملف.
- `$from = $order->status`: احتفظ بالحالة القديمة قبل تعديلها.
- `$order->update(...)`: حدّث الصف. الـ array تحدد اسم الحقل والقيمة الجديدة.
- `OrderStatusLog::create([`: أضف سجلًا جديدًا من خلال model.
- `order_id`: الطلب اللي حصل عليه التغيير.
- `from_status`: الحالة القديمة، و`to_status`: الحالة الجديدة من البيانات المتحقق منها.
- `created_at => now()`: وقت التغيير الحالي.
- `]);` يقفل بيانات التاريخ واستدعاء create؛ `});` يقفل transaction callback والاستدعاء.

لو إنشاء التاريخ فشل، تعديل الحالة اللي سبقه ما يتثبتش وحده. نجاح transaction مش معناه إنها تمنع كل تداخل تلقائيًا؛ النسخة الفعلية تستخدم `lockForUpdate()->findOrFail(...)` داخلها، وتقارن `expected_status` علشان ترفض تعديل موظف مبني على حالة قديمة بكود409. الـ locking يعتمد على قاعدة البيانات: SQLite مش بتوفر نفس row-level `FOR UPDATE` في MySQL/PostgreSQL، فاختبار بسيط عليها مش إثبات لسلوك التزامن في محرك الإنتاج. ده جزء مهم مش موجود في المثال المصغّر، فلا تستبدله بالأصل.

**نفّذ بإيدك:** حط علامة على كل سطر يغيّر DB، وافترض إن إضافة التاريخ رمت exception. اكتب النتيجة المطلوبة للحالة والتاريخ. التمرين على الورق أو في اختبار معزول، مش بإفساد قاعدة حقيقية.

**المتوقع:** مفيش تحديث حالة منفرد بدون سجله؛ تغييرات callback تتراجع معًا.

**غلطة شائعة:** تفترض transaction ترجع طلب HTTP خارجي لـ Stripe أو إيميل اتبعت. rollback تخص تغييرات DB المشاركة؛ الأنظمة الخارجية تحتاج تصميم تعويض/إعادة محاولة مناسب.

<details>
<summary>سؤال إنترفيو: الفرق بين transaction وrow lock؟</summary>

Transaction تجمع عمليات كوحدة نجاح/فشل. Row lock ينظم وصول معاملات متزامنة لصفوف معينة حسب قاعدة البيانات. الأول وحده مش ضمان ضد كل race condition.

</details>

## 5. Laravel عرف يجيب StripePaymentGateway منين؟

**مقتطف فعلي** من [AppServiceProvider.php](../app/Providers/AppServiceProvider.php). الأسماء مستوردة فوق، وprovider مسجل في [bootstrap/providers.php](../bootstrap/providers.php).

```php
public function register(): void
{
    $this->app->bind(PaymentGateway::class, StripePaymentGateway::class);
}
```

**كل سطر بيعمل إيه؟**

- `public function register()`: دالة lifecycle للـ service provider علشان تسجل الاعتماديات. مش registration لحساب مستخدم.
- `: void`: مش بنرجع بيانات مقصودة من الدالة.
- `{`: بداية جسم الدالة.
- `$this`: الـ provider الحالي.
- `->app`: Laravel service container؛ المسؤول عن تجهيز الاعتماديات وحلها.
- `->bind(A, B)`: لما الكود يطلب A، استخدم B كالتنفيذ المسجل.
- `PaymentGateway::class`: اسم interface في [app/Contracts/PaymentGateway.php](../app/Contracts/PaymentGateway.php)، بتحدد methods مطلوبة مثل createIntent وparseWebhook.
- `StripePaymentGateway::class`: الـ class اللي بتنّفذ العقد ده فعلًا عن طريق Stripe SDK.
- `;` نهاية التعليمة، و`}` نهاية register.

علشان كده `PaymentController` يقدر يطلب parameter نوعه PaymentGateway بدل ما يعمل `new StripePaymentGateway` بنفسه. لو غيرت بوابة الدفع، تقدر تبدّل التنفيذ مع الاحتفاظ بعقد مناسب؛ لكن بوابتين مختلفتين مش شرط يتطابقوا من غير أي تعديل تصميمي. الـ interface لا تحتوي أسرار Stripe؛ الإعدادات الخاصة تقرأ على السيرفر.

ده مفيد للاختبارات كمان: الاختبار يقدر يسجل fake gateway بدل الحقيقي، فيجرّب منطق webhook من غير اتصال أو فلوس. وجود اختبار ببوابة fake مش دليل إن الاتصال بـ Stripe الحقيقي اتجرّب؛ ده نطاق اختبار مختلف.

**نفّذ بإيدك:** افتح signature بتاع `PaymentController::createIntent` وشاور على parameter اللي Laravel هيحلّه باستخدام التسجيل ده. ثم افتح test الدفع وشوف `instance(PaymentGateway::class, $gateway)`.

**المتوقع:** تلاقي `$gateway` مع نوع PaymentGateway، وتلاقي اختبار يستبدل التنفيذ بشكل صريح من غير تعديل controller.

**غلطة شائعة:** تفتكر interface وحدها تعمل object، أو تكتب مفاتيح Stripe الخاصة داخل React أو ملف توثيق.

<details>
<summary>سؤال إنترفيو: يعني إيه dependency injection؟</summary>

إن الكود يستقبل الاعتماديات اللي يحتاجها بدل إنشائها داخله مباشرة. هنا Laravel container يجهّز التنفيذ؛ ده يسهل الفصل والاختبار واستبدال التفاصيل المناسبة.

</details>

التالي: [07 — المنيو والسلة](07-menu-and-cart.md)، وبعده [08 — الطلب والدفع](08-checkout-and-payment.md). تطبيق الصلاحيات وتحديث الحالات في الواجهة موجود في [09 — لوحة الموظفين](09-staff-dashboard.md)، وتدريب الاختبارات في [15 — الاختبارات وGit وتصحيح الأخطاء](15-testing-git-and-debugging.md).
