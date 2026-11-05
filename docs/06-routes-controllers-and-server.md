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

## 6. قبل السلسلة الكاملة: قاموس methods اللي بنستخدمها فعلًا

### توصيل المسار: مفيش طلب بيتنفّذ وقت تعريفه

- `Route::get($uri, $handler)` و`post` و`patch`: methods Laravel تسجّل route بالطريقة والـ URI والـ handler. ترجع Route object لإضافة middleware/قيود؛ لا ترجع بيانات الطلب الآن.
- `middleware(['auth', 'role:staff,admin'])`: تضيف إعداد فحوص وصول، وترجع registrar/route يسمح بتكملة التعريف. الأسماء إشارات إلى middleware، مش استدعاء دوال JavaScript.
- `prefix('staff')`: تضيف بادئة للمسارات داخل المجموعة وترجع إعداد المجموعة؛ لا تعمل redirect للمتصفح.
- `group(callback)`: Laravel ينادي callback أثناء تسجيل المسارات لتطبيق إعدادات المجموعة على اللي جواها. النتيجة المهمة تسجيل المسارات، مش payload.
- `where('view', regex)` على Route يقيد route parameter؛ ده غير `where('is_active', true)` على database builder. نفس الاسم لا يعني نفس receiver أو الوظيفة.

### Form Request: مين بينادي `rules`؟

- `authorize()` دالة Laravel lifecycle نكتب تنفيذها في Form Request، ترجع Boolean. `true` تسمح بالوصول لمرحلة validation، مش معناها إن البيانات صالحة.
- `prepareForValidation()` hook Laravel يناديها قبل التحقق؛ `: void` معناها لا نرجع payload. فيها `$this->merge(...)`، method تعدّل input على request وتعيد request object، لكن الكود الحالي يستخدم الأثر فقط.
- `$this->input('payment_method', 'cash')` تقرأ input بالاسم، ولو غائب ترجع fallback؛ القراءة مش حفظ في DB. اختيار cash الافتراضي عندنا يتضاف للطلب عن طريق merge.
- `rules()` يرجع array القواعد لكي Laravel تستخدمها؛ كتابة اسمها وحده لا تنفّذ تحققًا يدويًا. `Rule::in(['cash', 'card'])` تبني rule object للانتماء للقائمة؛ لا تختار قيمة تلقائيًا.
- `after()` في StoreOrderRequest ترجع array callbacks لفحوص إضافية بعد القواعد الأساسية. ده hook باسم محدد يتوقعه Laravel؛ مش callback بعد إنشاء order.
- `$request->validated()` ترجع array البيانات اللي قبلها validator. هي **ليست** method بتعمل INSERT أو بتحسب سعرًا. إن الطلب وصل للـ controller يعني Form Request جهّزت نجاح القواعد أولًا.
- في فشل JSON المعتاد Laravel يرجع 422 و`errors`، ولا يدخل `store()` أصلًا. `exists` تتحقق من وجود ID، مش التوفر التجاري أو الصلاحيات على هذا السجل.

### الخدمة والحفظ: دول أكتر أسماء محتاج تفهم نتيجتها

- `$creator->create($data, $user, $status)` دالة مشروع داخل OrderCreator، مش method عامة في Laravel. تاخد array البيانات وUser أو null وحالة، وترجع Order model محمّلة علاقاتها، أو ترمي exception لو فشل التحقق/الحفظ.
- `DB::transaction(callback)` method Laravel: تبدأ transaction، تنادي callback، تعمل commit لو خلصت طبيعي، وترجع **نفس نتيجة callback**. لو callback رمت exception تعمل rollback لتغييرات DB المعنية ثم تعيد رمي الخطأ. لا تلغي إيميل أو Stripe request خارجي.
- `function () use ($data, $user, $status)` closure PHP: الأقواس الأولى arguments فاضية؛ `use` تسمح بقراءة المتغيرات الخارجية داخلها. مش import classes اللي بنكتبه أعلى الملف.
- `Branch::query()->where(...)->findOrFail($id)`: query وwhere تبني شرطًا، وfindOrFail تنفّذ SELECT وترجع Branch أو ترمي exception. لو الفرع غير فعّال، الشرط يخليه غير مطابق حتى لو الـ ID موجود.
- `Order::create($attributes)` method Eloquent: تاخد array حقول مسموحة، تنفّذ INSERT، وترجع Order جديدة فيها id. تختلف عن دالة المشروع `$creator->create` اللي بتنسّق خطوات كثيرة.
- `DB::table('branch_menu_item')` تفتح query builder للجدول؛ `where` تبني القيود؛ `first()` تنفّذ وترجع أول record object أو null، مش MenuItem model.
- `$order->items()->create(...)` إنشاء Eloquent عبر العلاقة: تضيف OrderItem وتحط order_id تلقائيًا وترجع model البند. لا ترجع Collection البنود.
- `$order->update(['total_price' => $total])` تعدّل attributes وتحفظها في DB وترجع Boolean نجاح؛ مش model جديدة ولا السعر نفسه.
- `$order->load(['branch', 'user', 'items.menuItem'])` تحمّل العلاقات على model موجودة وترجع نفس Order. النقطة في `items.menuItem` تعني علاقة داخل علاقة، مش اسم عمود واحد.
- `Str::random(48)` أداة Laravel تنتج نصًا عشوائيًا بالطول المطلوب؛ هنا للتتبع. لا تنشئ order لوحدها ولا تكفي وحدها بدل قواعد صلاحيات التصميم.
- `now()` helper Laravel ترجع Carbon للتوقيت الحالي. لو كتبتها في attributes هتتحول لتاريخ مناسب وقت الحفظ.
- `OrderPlaced::dispatch($order)` event من المشروع باستخدام أدوات Laravel: تبعت event للمستمعين المسجّلين. ليست طلب دفع، ومش معناها إن المستخدم استلم إشعارًا حقيقيًا دائمًا؛ الأثر يتحدد بالـ listeners وإعداداتها.

### فحص موعد الاستلام: معنى methods بدل قراءة السطر كله كجملة واحدة

**نفس أسماء methods الموجودة في `StoreOrderRequest::after`:**

```php
$arrival = Carbon::parse($this->input('pickup_time'));
$earliest = now()->addMinutes($prepMinutes);
if ($arrival->lt($earliest)) {
    $validator->errors()->add('pickup_time', 'Pickup is too soon.');
}
```

المقتطف اختصر رسالة المصدر فقط. `parse(text)` من Carbon يحوّل نص تاريخ صالح لـ Carbon object؛ قد يرمي خطأ لو غير قابل للفهم، والقواعد الأساسية تتحقق من شكل التاريخ قبل الاعتماد عليه. `addMinutes(number)` تضيف دقائق للـ Carbon وتعيدها؛ هنا نستخدم object جديدة جاية من now، وCarbon المعتادة mutable. `lt(otherDate)` مقارنة أقل من، ترجع Boolean: هل الوصول قبل أقرب وقت مسموح؟ `errors()` ترجع message bag الخاصة بالـ validator. `add(field, message)` تضيف رسالة وتعيد bag؛ لا ترسل JSON بنفسها، Laravel يقرأ أخطاء validator ويكوّن الرد. `format('H:i:s')` ترجع نص وقت، و`diffInMinutes(otherDate)` تحسب فرق الدقائق وفق إصدار Carbon؛ مش تأخير تنفيذ أو مؤقت.

## 7. تطبيق واحد كامل: زر الكاش → Laravel → بنود الطلب → صفحة التتبع

**المطلوب تفهم السلسلة لا تنفّذها على طلبات حقيقية.** المقتطفات من Pizza الحالي؛ أي اختصار أو قيم تدريب متسمّية بوضوح. وضع demo له adapter محلي ولا يمر على PHP ده.

### أ. البداية في `Cart.jsx`

**دالة فعلية من المكوّن:**

```jsx
const submitCashOrder = async () => {
    setMessage('');
    setIsSubmitting(true);
    try {
        const response = await csrfFetch('/api/orders', {
            method: 'POST',
            body: JSON.stringify(buildPayload()),
        });
        clearCart();
        navigate(response.tracking_url);
    } catch (error) {
        setMessage(error.payload?.errors
            ? Object.values(error.payload.errors).flat()[0]
            : error.message);
    } finally {
        setIsSubmitting(false);
    }
};
```

- `buildPayload()` دالة مشروع تجمع البيانات الموجودة في state؛ في نفس Cart تعرفها وتستدعيها، مش method غامضة خارج الملف. مثال شكل ناتجها للتعلم:

```js
const examplePayload = {
    branch_id: 1,
    order_type: 'delivery',
    customer_name: 'Practice Customer',
    customer_phone: '01000000000',
    delivery_address: 'Demo address, not a real customer',
    pickup_time: null,
    payment_method: 'cash',
    items: [{ menu_item_id: 1, quantity: 2, notes: null }],
};
```

- `JSON.stringify` ترجع نص JSON من object؛ `csrfFetch` helper المشروع تضيف CSRF headers/كوكيز ثم fetch، تفك JSON، وتعيد payload أو ترمي Error. الـ endpoint مش بيتنادى لمجرد تعريف examplePayload.
- `setMessage` و`setIsSubmitting` React setters؛ الأولى تنظف/تعرض رسالة والثانية تغيّر loading state. لا تحفظ order.
- `Object.values(errors)` تحول object رسائل الحقول لـ array قيم، و`flat()` تفرد مستوى واحد، و`[0]` تختار أول رسالة للعرض. `?.` تمنع محاولة قراءة null/undefined.
- `finally` يتنفّذ عند النجاح أو الفشل لإلغاء حالة الانتظار؛ مش method. `clearCart` و`navigate` موجودتين بعد await لذلك لا يتنفذا لو الـ helper رمت خطأ.

### ب. الـ route تختار `store`

```php
// routes/web.php داخل prefix('api')
Route::post('/orders', [OrderController::class, 'store']);
```

Laravel تجهّز `StoreOrderRequest`، تشغّل authorize/prepare/rules/after، ثم تمرّرها مع `OrderCreator` للـ controller. لا يُنشأ order لو فشلت validation.

### ج. الـ controller الحقيقي

```php
public function store(StoreOrderRequest $request, OrderCreator $creator): JsonResponse
{
    $data = $request->validated();
    if ($data['payment_method'] === 'card') {
        throw ValidationException::withMessages([
            'payment_method' => ['Card orders must use the payment intent endpoint.'],
        ]);
    }

    $order = $creator->create($data, $request->user(), Order::STATUS_NEW);
    OrderPlaced::dispatch($order);

    return response()->json([
        'message' => 'Order created successfully.',
        'order' => $order,
        'tracking_token' => $order->tracking_token,
        'tracking_url' => "/orders/{$order->tracking_token}",
    ], 201);
}
```

`$request->user()` قد ترجع null لأن checkout يسمح بضيف. `Order::STATUS_NEW` constant من model قيمته الحالة الجديدة؛ مش استدعاء method. قبل `response` نحتاج نفهم create؛ نكمل تنفيذها دلوقتي بدل الاكتفاء باسمها.

### د. جوه `OrderCreator::create` لحد ما ترجع النتيجة

**جسم التنفيذ متصل من الخدمة الحقيقية، مع تقصير رسالة خطأ عدم توفر المنتج فقط.** المقطع داخل `create(array $data, ?User $user, string $status): Order`، والاستيرادات وclass موجودة في الملف الأصلي. مفيش خطوة إنشاء ناقصة بين أوله وآخره؛ لكنه مش ملف PHP مستقل بديل للمصدر.

```php
return DB::transaction(function () use ($data, $user, $status) {
    $branch = Branch::query()
        ->where('is_active', true)
        ->findOrFail($data['branch_id']);

    if ($data['order_type'] === 'delivery' && ! $branch->delivery_enabled) {
        throw ValidationException::withMessages([
            'branch_id' => ['This branch is not accepting delivery orders right now.'],
        ]);
    }

    $order = Order::create([
        'user_id' => $user?->id,
        'branch_id' => $branch->id,
        'order_type' => $data['order_type'],
        'pickup_time' => $data['order_type'] === 'pickup' ? $data['pickup_time'] : null,
        'customer_name' => $data['customer_name'],
        'customer_phone' => $data['customer_phone'],
        'delivery_address' => $data['order_type'] === 'delivery' ? $data['delivery_address'] : null,
        'payment_method' => $data['payment_method'],
        'payment_status' => $data['payment_method'] === 'card' ? 'pending' : 'unpaid',
        'status' => $status,
        'idempotency_key' => $data['idempotency_key'] ?? null,
        'tracking_token' => Str::random(48),
        'total_price' => 0,
    ]);

    $total = 0;
    foreach ($data['items'] as $line) {
        $menuItem = MenuItem::query()
            ->where('is_active', true)
            ->whereHas('category', fn ($query) => $query->where('is_active', true))
            ->find($line['menu_item_id']);

        $pivot = DB::table('branch_menu_item')
            ->where('branch_id', $branch->id)
            ->where('menu_item_id', $line['menu_item_id'])
            ->first();

        if (! $menuItem || ! $pivot || ! $pivot->is_available) {
            throw ValidationException::withMessages([
                'items' => ['The chosen item is unavailable at this branch.'],
            ]);
        }

        $price = (float) $pivot->price;
        $quantity = (int) $line['quantity'];
        $total += $price * $quantity;

        $order->items()->create([
            'menu_item_id' => $line['menu_item_id'],
            'item_name' => $menuItem->name,
            'quantity' => $quantity,
            'price' => $price,
            'notes' => $line['notes'] ?? null,
        ]);
    }

    if ($data['order_type'] === 'delivery') {
        $total += (float) $branch->delivery_fee;
    }

    $order->update(['total_price' => $total]);
    return $order->load(['branch', 'user', 'items.menuItem']);
});
```

`Order::create` قبل الحلقة تنشئ header الطلب بكل حقوله، ثم `items()->create` جوه الحلقة تنشئ بنوده. الاتنين داخل نفس transaction، ومش واحد منهم بيبعت response للمتصفح بنفسه.

- الحلقة اسمها `foreach` في PHP؛ هي syntax للمرور مش method. كل `$line` array بند من الطلب.
- السعر من pivot في DB، وليس قيمة يسمح العميل بتحديدها. افترض سعرًا تدريبيًا `190`، كمية `2`، ورسوم `35`: total النهائي `415`.
- `load` ترجع Order فتكون نتيجة callback، ثم نتيجة `DB::transaction`، ثم نتيجة دالة الخدمة كلها. دي **ثلاث طبقات return لنفس النتيجة**، مش ثلاث عمليات حفظ.
- لو أي بند غير متاح ورمى exception، تتراجع كتابة الطلب والبنود داخل transaction، ويرجع الخطأ للـ controller/HTTP؛ مسار الرد 201 لا يكتمل.

### هـ. النتيجة ترجع لنفس الزر في React

`response()->json` يحوّل Order المحمّلة إلى JSON، ويرجع 201. `csrfFetch` تفك body وتعيد object مثل `{ order, tracking_token, tracking_url }`. السطر التالي في `submitCashOrder` هو `clearCart()` ثم `navigate(response.tracking_url)`.

`clearCart` callback المشروع يفرّغ سلة المتصفح؛ مش حذف Order من DB. دي بقية الدوال الفعلية اللي بيناديها المسار، موجودة في نفس `Cart.jsx`:

```js
const clearCart = () => { setCartItems([]); writeCart([]); };

function writeCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event(CART_EVENT_NAME));
}
```

- `setCartItems([])` setter React يفرغ عرض السلة.
- `writeCart([])` دالة مشروع تاخد array وتكتبها كنص JSON في localStorage؛ لا ترجع order أو response.
- `localStorage.setItem(key, value)` Web API تغيّر تخزين المتصفح ولا ترجع بيانات؛ هنا قيمتها النص `'[]'`.
- `new Event(CART_EVENT_NAME)` يبني DOM Event باسم `wtc-cart-updated`؛ `dispatchEvent` تنشره للمستمعين في نفس النافذة لتزامن السلة. دي مش HTTP request ولا event Laravel اللي اسمه OrderPlaced.
- `CART_STORAGE_KEY` في نفس الملف يساوي `wtc_cart` في الوضع الحقيقي، و`wtc_demo_cart` في وضع demo. اختيار المفتاح لا يجعله تخزينًا آمنًا للسيرفر.

`navigate` من React Router تفتح صفحة التتبع داخل الواجهة؛ هي نهاية مسار النجاح في هذا المثال. فشل validation/DB يمنع clearCart وnavigate ويظهر رسالة في catch.

## 8. تكملة Dependency Injection: العقد ثم التنفيذ ثم الاستدعاء

**العقد الحقيقي في `app/Contracts/PaymentGateway.php`:**

```php
interface PaymentGateway
{
    public function createIntent(int $amount, string $currency, array $metadata, string $idempotencyKey): array;
    public function parseWebhook(string $payload, string $signature): object;
}
```

- interface تصف المدخلات وأنواع النتائج من غير جسم التنفيذ. لا اتصال Stripe يحصل من تعريفها.
- `bind(PaymentGateway::class, StripePaymentGateway::class)` في provider يقول للـ container مين التنفيذ الافتراضي.
- لما Laravel ترى `PaymentGateway $gateway` في signature الـ controller تحل الاعتماد وتمرّر object التنفيذ. كلمة `$gateway` مجرد اسم متغير نختاره، النوع والعقد هما المهمان.

**السطر الحقيقي المستدعي في `PaymentController`:**

```php
$intent = $gateway->createIntent(
    (int) round(((float) $order->total_price) * 100),
    'egp',
    ['order_id' => (string) $order->id],
    $key,
);
```

`round` دالة PHP تقرّب الناتج، و`(int)` تحويل نوع؛ مثل `415.00` جنيه تتحول إلى `41500` قرش. تنفيذ createIntent الفعلي داخل StripePaymentGateway ينادي SDK ويرجع array فيها id/client_secret، مش receipt دفع مؤكد. الاستدعاء وتكملته في درس الدفع أدناه مكتوبان inline، مش مجرد رابط اسم method.

التالي: [07 — المنيو والسلة](07-menu-and-cart.md)، وبعده [08 — الطلب والدفع](08-checkout-and-payment.md). تطبيق الصلاحيات وتحديث الحالات في الواجهة موجود في [09 — لوحة الموظفين](09-staff-dashboard.md)، وتدريب الاختبارات في [15 — الاختبارات وGit وتصحيح الأخطاء](15-testing-git-and-debugging.md).
