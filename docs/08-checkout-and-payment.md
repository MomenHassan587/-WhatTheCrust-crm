# 08 — أسئلة وأمثلة: من السلة إلى الدفع

الدروس دي أهم من حفظ أسماء Stripe: افهم البيانات بتتحول إزاي، ومين صاحب قرار السعر، وإمتى نعتبر الدفع مؤكدًا. ذاكر سؤال واحد كل مرة، ومتجربش طلبات دفع أو مفاتيح production. لو عايز تجربة تكامل فعلية استخدم بيئة test مفصولة، مش حساب دفع حقيقي.

**واقع المشروع:** [Cart.jsx](../resources/js/Pages/Cart.jsx) فيها React وStripe Elements؛ [csrfFetch](../resources/js/lib/api.js) تحول الطلبات إلى محاكاة لو `VITE_DEMO_MODE` مفعّل. وضع الديمو لا يجمع فلوس ولا يثبت عمل Laravel/Stripe. الكلام التالي يفرّق بين مسار Laravel الحقيقي وبين أي مثال مختصر.

## 1. أبعت السعر ولا أبعت معرف المنتج والكمية؟

**مقتطف فعلي** من [Cart.jsx](../resources/js/Pages/Cart.jsx). داخل component عندها state للعميل والسلة والفرع؛ المقطع مش مستقل، ولا فيه إرسال بمجرد تعريفه.

```jsx
const buildPayload = () => ({
    branch_id: Number(selectedBranchId),
    order_type: orderType,
    customer_name: customer.name,
    customer_phone: customer.phone,
    delivery_address: orderType === 'delivery' ? [deliveryArea, deliveryAddress].filter(Boolean).join(', ') : null,
    pickup_time: orderType === 'pickup' ? customer.pickupTime : null,
    payment_method: paymentMethod,
    items: cartItems.map((item) => ({ menu_item_id: item.id, quantity: item.quantity, notes: item.notes || null })),
});
```

**كل سطر بيعمل إيه؟**

- `const buildPayload = () => ({`: دالة من غير arguments ترجع object مباشرة. الأقواس `({ ... })` تميز object الناتج عن جسم الدالة؛ مش body محتاج return.
- `branch_id: Number(...)`: المفتاح المتوقع من Laravel، وقيمته تحويل معرف الفرع إلى رقم.
- `order_type`: نوع الاستلام من state. `customer_name` و`customer_phone`: انقل قيم الحقول إلى أسماء السيرفر المتوقعة.
- `delivery_address`: الـ ternary `condition ? A : B` يختار العنوان للتوصيل فقط، وإلا null. `[deliveryArea, deliveryAddress]` قائمة جزأين، `filter(Boolean)` يشيل القيم falsy، و`join(', ')` يضم الباقي بفاصلة ومسافة.
- `pickup_time`: وقت الاستلام لو pickup، وإلا null؛ مش كل الحقول مطلوبة لكل نوع طلب.
- `payment_method`: كاش أو كارت حسب اختيار المستخدم؛ السيرفر ما زال يتحقق منها.
- `items: cartItems.map(...)`: حوّل كل عنصر إلى object جديد فيه المعرف والكمية والملاحظات فقط. `|| null` يحول الملاحظة الفاضية إلى null هنا.
- `});`: يقفل object والتعبير وينهي تعريف الدالة.

لاحظ إن العميل لا يرسل total ولا price هنا. إجمالي React للعرض، بينما السعر الموثوق من قاعدة البيانات. الدالة تبني بيانات فقط؛ طلب HTTP بيحصل لاحقًا لما نستخدم ناتج `buildPayload()` مع csrfFetch وJSON.stringify.

**نفّذ بإيدك:** اكتب عنصر سلة افتراضي فيه id/name/price/quantity، وتتبع ناتج map. استخدم بيانات وهمية، مش رقم أو عنوان شخص حقيقي.

**المتوقع:** الاسم والسعر يختفوا من payload الخاص بالبند؛ يبقى menu_item_id وquantity وnotes.

**غلطة شائعة:** تستخدم `forEach` بدل `map` وتتوقع array جديدة؛ أو تفترض إن إخفاء السعر من payload يغني عن حساب السيرفر.

<details>
<summary>سؤال إنترفيو: ليه `map` مناسبة هنا؟</summary>

لأننا محتاجين array جديدة ناتجة عن تحويل كل عنصر إلى الشكل اللي API تتوقعه. `forEach` تنفذ callback لكل عنصر لكن لا ترجع array نتائج.

</details>

## 2. السعر اتغيّر في المتصفح؛ مين يمنع دفع جنيه بدل190؟

**مقتطف فعلي** من [OrderCreator.php](../app/Services/Orders/OrderCreator.php). داخل foreach، بعد التحقق من المنتج وتوفره وقراءة pivot الخاص بالفرع. `$order` اتعملت داخل transaction، و`$total` بدأ بصفر.

```php
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
```

**كل سطر بيعمل إيه؟**

- `$price = (float) $pivot->price`: السعر من صف قاعدة البيانات اللي بيربط المنتج بالفرع، مش من localStorage. `(float)` تحويل إلى رقم عشري في PHP.
- `$quantity = (int) $line['quantity']`: اقرأ الكمية من بند الطلب المتحقق منه وحولها لعدد صحيح. التحويل نفسه مش بديل قواعد min/max.
- `$total += $price * $quantity`: اضرب السعر في الكمية وضيف الناتج على الإجمالي السابق. `+=` اختصار جمع ثم إسناد.
- `$order->items()->create([`: أنشئ بندًا تابعًا لهذا الطلب؛ العلاقة تربط order_id تلقائيًا.
- `menu_item_id`: اربط المنتج الأصلي.
- `item_name`: احتفظ بنسخة الاسم وقت الطلب. تغيير اسم المنيو لاحقًا ما يغيّرش النص المحفوظ هنا.
- `quantity` و`price`: احفظ الكمية وسعر الوحدة التاريخي، مش الإجمالي في حقل price.
- `notes => ... ?? null`: لو المفتاح غير موجود أو قيمته null، استخدم null. `??` مش نفس `||`: مش بيستبدل كل قيمة falsy.
- `]);`: نهاية بيانات البند واستدعاء create.

بعد الحلقة، التوصيل يضيف `$branch->delivery_fee` ثم يحفظ total_price. الرسوم الحالية من الفرع، مش رقم25 ثابت في كل الحالات. والخدمة تتحقق كمان إن الفرع فعّال وإن التوصيل مفعّل له.

**نفّذ بإيدك:** سعر قاعدة البيانات190 والكمية2 ورسوم الفرع35؛ احسب الناتج حتى لو المتصفح يعرض price=1. التمرين حساب يدوي، مش تعديل سعر فعلي.

**المتوقع:** 415 للتوصيل، و380 قبل الرسوم.

**غلطة شائعة:** تثق في total جاية من العميل، أو تعتبر `(float)` تمثيلًا مثاليًا للفلوس. الأصل يستخدم float في الحساب؛ لتطبيق مالي أدق، تصميم integer minor units أو decimal arithmetic مناسب مع قواعد تقريب واضحة أفضل من افتراض عدم وجود أخطاء تقريب.

<details>
<summary>سؤال إنترفيو: العميل عدّل localStorage للسعر؛ هل validation نوع الرقم كفاية؟</summary>

لأ. الرقم ممكن يكون صالحًا شكليًا لكنه سعر غلط. السيرفر يجيب السعر والتوفر من مصدره الموثوق ويحسب الإجمالي؛ السعر النهائي قرار business مش مجرد type validation.

</details>

## 3. إيه اللي بيتبعت إلى Stripe، وإيه اللي ماينفعش يظهر في React؟

**مقتطف فعلي** من [StripePaymentGateway.php](../app/Services/Payments/StripePaymentGateway.php)، داخل createIntent. الـ parameters معرفة في signature، وStripeClient مستوردة فوق.

```php
$intent = (new StripeClient(config('services.stripe.secret')))->paymentIntents->create([
    'amount' => $amount,
    'currency' => $currency,
    'automatic_payment_methods' => ['enabled' => true],
    'metadata' => $metadata,
], ['idempotency_key' => $idempotencyKey]);

return ['id' => $intent->id, 'client_secret' => $intent->client_secret];
```

**كل سطر بيعمل إيه؟**

- `$intent`: متغير نتيجة إنشاء محاولة الدفع. `new StripeClient(...)` يبني عميل مكتبة Stripe بمفتاح السيرفر الخاص المقروء من config، مش قيمة نحطها حرفيًا في الدرس.
- `->paymentIntents->create([`: اطلب إنشاء PaymentIntent بإعدادات المبلغ والدفع.
- `'amount' => $amount`: المبلغ بوحدات العملة الصغرى حسب العملة. الـ controller عندنا يحول جنيهات EGP إلى قروش بالضرب في100 ثم التقريب والتحويل لعدد صحيح قبل الإرسال.
- `'currency' => $currency`: العملة؛ controller المشروع يمرر `egp`.
- `automatic_payment_methods`: إعداد يفعّل طرق الدفع التلقائية المتاحة بحسب Stripe؛ مش ضمان إن كل وسيلة متاحة لكل حساب أو بلد.
- `metadata`: بيانات ربط مثل order_id؛ مش بيانات بطاقة ولا مكان مناسب لمعلومات حساسة غير لازمة.
- `['idempotency_key' => ...]`: خيارات الطلب إلى Stripe لمنع تكرار إنشاء نفس العملية عند إعادة المحاولة بنفس المفتاح المناسب.
- آخر `return`: رجّع id وclient_secret للـ controller، اللي يرجع بيانات لازمة للواجهة. القوس `[]` هنا PHP array.

`client_secret` يسمح للعميل بمتابعة Intent المحدد؛ مش هو مفتاح الحساب الخاص ولا حاجة ننشرها في logs. `VITE_STRIPE_KEY` في React لازم يكون publishable key فقط، لأن قيم VITE بتظهر في كود المتصفح. CardElement وconfirmCardPayment يرسلان بيانات البطاقة إلى Stripe؛ Laravel عندنا لا يحتاج رقم البطاقة الخام.

**نفّذ بإيدك:** حدد على الورق أماكن publishable key وsecret key وclient_secret. ما تفتحش أسرار حسابك ولا تنسخها للتوثيق.

**المتوقع:** publishable key للواجهة، secret key للسيرفر، وclient_secret لعملية دفع محددة وللعميل المعني فقط.

**غلطة شائعة:** تعمل `VITE_STRIPE_SECRET` وتفتكر تغيير اسم المتغير يخفي قيمته؛ أو تعتبر إنشاء PaymentIntent معناه إن الفلوس اتحصلت.

<details>
<summary>سؤال إنترفيو: ليه إنشاء عملية الدفع يتم من backend؟</summary>

لأن فيه سر حساب ومبلغ لازم يكون موثوقًا ومحسوبًا على السيرفر. المتصفح يتعامل مع خطوة التأكيد الآمنة، مش تحديد المبلغ النهائي أو امتلاك المفتاح الخاص.

</details>

## 4. لو نفس طلب الدفع اتبعت مرتين، إزاي نمنع التكرار؟

**مثال مبسّط من** [Cart.jsx](../resources/js/Pages/Cart.jsx). داخل async payment handler، و`payload` دالة تمرر بيانات الطلب. الأصل يحيط العملية بـ try/catch/finally ويمنع ضغطات متزامنة في الواجهة.

```jsx
const idempotencyKey = crypto.randomUUID();
const response = await csrfFetch('/api/payments/intents', {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify({
        ...payload(),
        payment_method: 'card',
        idempotency_key: idempotencyKey,
    }),
});
```

**كل سطر بيعمل إيه؟**

- `crypto.randomUUID()`: اعمل معرفًا عشوائيًا للمحاولة. مش كلمة سر، لكنه لازم يمثل العملية المقصودة بوضوح.
- `await csrfFetch(...)`: اطلب من Laravel بدء الدفع واستنى الرد. في demo mode ده محاكاة حسب الـ helper، مش طلب Stripe حقيقي.
- `method: 'POST'`: إنشاء عملية، مش قراءة فقط.
- `headers: { ... }`: ابعت المفتاح في HTTP header بالاسم المتفق عليه.
- `body: JSON.stringify({`: ابنِ object ثم حوّله إلى JSON.
- `...payload()`: انسخ خصائص بيانات الطلب إلى object جديد؛ ده spread syntax.
- `payment_method: 'card'`: تأكيد طريقة الدفع. وجوده بعد spread يخليه يغلب قيمة بنفس الاسم جاية من payload.
- `idempotency_key`: نفس المفتاح في body كمان؛ السيرفر يفضّل header ثم fallback للـ body.
- `}),` يقفل object وstringify، و`});` يقفل خيارات الطلب والاستدعاء.

في [PaymentController](../app/Http/Controllers/Api/PaymentController.php)، لو المفتاح موجود بالفعل يرد409 مع order_id ورسالة، مش يرجّع client_secret لنفس المحاولة. كمان قاعدة البيانات عليها unique constraint؛ الفحص الأول وحده لا يمنع طلبين متزامنين من العبور قبل الحفظ.

**نفّذ بإيدك:** افترض محاولة K1 ثم retry بنفس K1، وبعدها محاولة K2. حدّد أيهم السيرفر يقدر يتعرف عليه كتكرار. ده تمرين تتبع؛ لا تبعت دفعات حقيقية.

**المتوقع:** إعادة K1 مرتبطة بالمحاولة السابقة؛ K2 عملية مختلفة من وجهة نظر المفتاح.

**غلطة شائعة في الكود الحالي:** UUID تتولّد داخل كل استدعاء pay. ضغط لاحق بعد خطأ شبكة يعمل مفتاحًا جديدًا؛ بالتالي ده مش نظام retries كامل. التطوير الأفضل يحافظ على مفتاح المحاولة نفسها عند retry ويصمم رد إعادة الاستخدام آمنًا. تعطيل الزر وحده لا يحمي السيرفر.

<details>
<summary>سؤال إنترفيو: يعني إيه idempotency؟</summary>

إعادة نفس العملية المقصودة لا تضاعف أثرها. في الدفع محتاج هوية للمحاولة، قيود تخزين ومعالجة تزامن مناسبة، وسياسة واضحة لرد retry؛ مجرد UUID جديد كل مرة مش كفاية.

</details>

## 5. صفحة النجاح قالت تم الدفع؛ ليه لسه محتاج webhook؟

**مقتطف فعلي** من [PaymentController.php](../app/Http/Controllers/Api/PaymentController.php)، بداية method webhook؛ `$gateway` تنفيذ PaymentGateway المجهز من Laravel.

```php
try {
    $event = $gateway->parseWebhook($request->getContent(), (string) $request->header('Stripe-Signature'));
} catch (Throwable) {
    return response()->json(['message' => 'Invalid webhook signature.'], 400);
}
```

**كل سطر بيعمل إيه؟**

- `try {`: حاول تنفيذ كود ممكن يفشل، ووجّه الفشل إلى catch بدل متابعة الدفع كأنه صحيح.
- `$request->getContent()`: جسم الطلب الخام كما وصل؛ التحقق من التوقيع محتاجه، مش JSON فكّيته وركّبته تاني بشكل مختلف.
- `$request->header('Stripe-Signature')`: التوقيع المرسل. `(string)` يحول النتيجة إلى نص.
- `$gateway->parseWebhook(...)`: التنفيذ الحقيقي في [StripePaymentGateway.php](../app/Services/Payments/StripePaymentGateway.php) يستخدم `Webhook::constructEvent` مع webhook secret؛ مش مجرد JSON.parse يثق في الرسالة.
- `$event = ...`: خزّن الحدث بعد نجاح التحقق.
- `catch (Throwable)`: لو حصل exception، ادخل هنا. النوع ده يغطي أخطاء PHP وexceptions؛ المشروع يعامل فشل هذه الخطوة كرسالة غير صالحة.
- `return response()->json(..., 400)`: رد خطأ وأوقف المسار؛ ما تحدثش الطلب. `}` يقفل catch.

بعد التحقق، الكود يطابق gateway_reference مع Intent ويعالج `payment_intent.succeeded`: يغير payment_status إلى paid والحالة إلى new ويسجل التحول داخل transaction. البداية كانت payment_pending، وقائمة الموظفين تخفي طلبات الكارت غير المدفوعة. عدم وجود order مطابق يرجع received=true من غير تعديل.

**نفّذ بإيدك:** اقرأ اختبار `test_verified_payment_webhook_marks_order_paid_once` في [OrderOperationsTest.php](../tests/Feature/OrderOperationsTest.php). حدّد عدد إرسال الحدث وعدد سجلات التاريخ المتوقع. لا تبعت webhook يدوي للإنتاج.

**المتوقع:** الاختبار يرسل مرتين متتاليتين ويتوقع سجلًا واحدًا. بيستخدم gateway fake؛ لذلك لا يثبت إن التحقق الحقيقي من توقيع Stripe اتجرب.

**غلطة شائعة:** تعتبر إشعار المتصفح إثبات الدفع، أو تقول إن الكود محصّن تمامًا من التزامن. شرط `payment_status !== 'paid'` الحالي قبل transaction يمنع التكرار المتتابع المعتاد، لكن حدثين متزامنين ممكن يعدّوا الشرط معًا. تحسينه يحتاج row locking وإعادة فحص أو معالجة event IDs/unique transitions وتصميم إعادة المحاولة. والملف لا يمثل دورة refunds كاملة.

<details>
<summary>سؤال إنترفيو: ليه webhook معفية من CSRF، وهل كده مكشوفة؟</summary>

Stripe سيرفر خارجي مش معاه CSRF token جلسة المتصفح. الاستثناء في bootstrap/app.php خاص بهذا المسار، وبديله هنا التحقق من توقيع الرسالة قبل أي تحديث، مع تصميم معالجة تكرار آمن. CSRF exemption وحدها مش حماية.

</details>

## 6. وظيفة كل method من أول تجهيز البيانات إلى تأكيد الكارت

هنا مطلوب تعرف مين صاحب الدالة، مدخلاتها، ناتجها، وإيه اللي بيتغير بسببها. لا تحفظ «تشغّل الدفع» كجملة واحدة؛ مفيش method واحدة بتعمل الرحلة كلها.

### `buildPayload()` — دالة من مشروعنا

- المدخلات المباشرة: لا توجد؛ بتقرأ state السلة والعميل والفرع من نطاق component.
- الناتج: object JavaScript جديد بالأسماء اللي Laravel تتوقعها؛ لا Promise ولا HTTP request.
- مثال ناتج: `items: [{ menu_item_id: 1, quantity: 2, notes: null }]`.
- لو غيرت state لازم تناديها من جديد علشان تجمع القيم الحالية؛ تعريفها لا يرسل طلبًا.

### Methods تجهيز البيانات داخلها

- `Number(value)` دالة JavaScript لتحويل قيمة لرقم. `Number('2')` يعطي `2`، وغير الصالح قد يعطي `NaN`؛ ليست validation تجارية ولا حفظًا في DB.
- `filter(Boolean)` على array تمرّر كل عنصر للدالة `Boolean` وتحتفظ بالـ truthy؛ تعيد array جديدة. `['Cairo', ''].filter(Boolean)` تعطي `['Cairo']`. تحذف كمان `0` وfalse لو موجودين، مش «المسافات» داخل نص غير فارغ.
- `join(', ')` على array ترجع string بعد ضم العناصر بالفاصل. `['Area', 'Street'].join(', ')` نتيجتها `'Area, Street'`. لا تغيّر array الأصلية.
- `map(callback)` على cartItems تعيد array من نواتج callback، ولا تعدّل الأصل بمجرد استخدامها. هنا تحوّل cart line لبند API؛ `forEach` لا تعيد array النتائج دي.
- `JSON.stringify(object)` دالة JavaScript ترجع نص JSON؛ لا تحفظه ولا ترسله بنفسها. `JSON.parse(text)` العكس: نص JSON صالح إلى قيمة JavaScript، وقد ترمي SyntaxError لو النص تالف.

### `crypto.randomUUID()` — Web API، مش اسم اخترناه

- لا arguments في المثال؛ ترجع string UUID عشوائية مثل صيغة `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.
- نستعملها كهوية محاولة الدفع. لا تبدأ طلب شبكة ولا تضمن idempotency وحدها.
- كل استدعاء جديد يعطي مفتاح محاولة جديدًا؛ لو retry المفروض نفس المحاولة، حفظ نفس المفتاح جزء من تصميم التطبيق، لا وظيفة randomUUID.

### `csrfFetch(url, options)` — helper من المشروع

- المدخل URL وإعدادات الطلب. `POST` مع body JSON وIdempotency-Key هو الشكل المستخدم هنا.
- في Laravel الحقيقي: تضيف headers مناسبة ثم تنادي `fetch`، تقرأ JSON، تفحص HTTP status وترجع **payload object** أو ترمي Error. ناتج الدالة Promise لأنها async.
- `await csrfFetch(...)` ينتظر النتيجة. النجاح هنا يرجع order_id/client_secret، مش token بطاقة.
- في demo mode تستخدم adapter محلي؛ لا Stripe charge ولا PHP من هذا الفرع. تفصيل helper نفسه في درس API، لكن عقدها واضح هنا علشان نكمل المثال.

### `loadStripe(key)` و`useStripe()` و`useElements()` — أدوات Stripe React

- `loadStripe(publishableKey)` من مكتبة Stripe JS ترجع Promise لـ Stripe object أو null عند عدم توفره؛ تجهّز مكتبة العميل. ليست createIntent على السيرفر، ولا مكان secret key.
- `<Elements stripe={stripePromise}>` provider للمكتبة، مش دالة من PHP. تضع بيئة Stripe للمكونات الداخلية.
- `useStripe()` React hook من المكتبة يرجع Stripe object المتاحة داخل Elements، وقد يكون null أثناء التحميل.
- `useElements()` يرجع Elements object لإدارة حقول الدفع أو null قبل الجاهزية.
- الـ guard `if (!stripe || !elements || processing) return;` يمنع متابعة الضغط قبل الجاهزية أو أثناء عملية قائمة؛ `return` هنا يخرج من الدالة من غير طلب دفع.

### `elements.getElement(CardElement)`

- method من Stripe Elements؛ المدخل نوع المكوّن المطلوب، والناتج instance الحقل المركّب أو null.
- دي **مش** `.value` بها رقم الكارت، ومش `document.getElementById` للحاوية. بتدي Stripe الحقل الآمن علشان تقرأ بياناته في تدفقها.
- كود Laravel عندنا لا يستقبل رقم الكارت الخام من الطلب ده.

### `stripe.confirmCardPayment(clientSecret, options)`

- method من Stripe JS؛ الأول client_secret للـ Intent، والثاني إعدادات فيها CardElement المستخدمة كطريقة الدفع.
- ترجع Promise لنتيجة فيها `error` أو معلومات `paymentIntent` وفق العملية؛ مش Boolean مجردة.
- لها أثر خارجي: تأكيد محاولة الدفع والتعامل مع خطوات التحقق المطلوبة. قد تفشل أو تحتاج معالجة حالات حسب بوابة الدفع.
- المشروع يفحص `result.error` ويرمي Error عند وجوده. عدم وجود error في المتصفح ليس بديلًا عن webhook موثقة لتحديث حالة DB.

### `onSuccess(...)` و`onMessage(...)` — callbacks من الأب، مش Stripe methods

- الاسمان props مرّرتها Cart إلى CardCheckout؛ تقدر تسميهم أسماء تانية لو غيّرت الطرفين.
- `onMessage(text)` في الأب مربوطة بـ `setMessage`، فتغيّر رسالة React؛ لا تحدّث payment_status في DB.
- `onSuccess(trackingUrl)` في الأب تفرغ السلة ثم تستخدم React Router للتنقل. الناتج المهم أثر الواجهة، مش إثبات الدفع.
- لذلك معرفة «مين مرّر الدالة؟» أهم من افتراض إنها method مدمجة لمجرد اسمها.

## 7. متابعة نفس عملية الكارت عبر الملفات، خطوة خطوة

دي المقاطع المترابطة من الكود الحالي. الأجزاء المحذوفة تخص العرض والرسائل لا جوهر الدفع؛ وليست ملفات بديلة للإنتاج. لا تطبّق طلبات دفع حقيقية من أجل التمرين.

### أ. الأب يمرّر الدوال: `Cart.jsx`

**مقتطف JSX فعلي داخل فرع ظهور الدفع بالكارت:**

```jsx
<Elements stripe={stripePromise}>
    <CardCheckout
        payload={buildPayload}
        disabled={disabled}
        onSuccess={(trackingUrl) => {
            clearCart();
            navigate(trackingUrl);
        }}
        onMessage={setMessage}
    />
</Elements>
```

- `payload={buildPayload}` تمرير مرجع الدالة؛ الابن يستدعيها لاحقًا `payload()` علشان يأخذ أحدث بيانات.
- `onSuccess` يستقبل العنوان من الابن. `clearCart` في نفس Cart تستدعي `setCartItems([])` و`writeCart([])`؛ `writeCart` تحفظ `'[]'` في localStorage وتبعث event مزامنة السلة. ده مسح سلة فقط، مش حذف Order.
- `navigate` من React Router تفتح عنوان التتبع، و`setMessage` setter React تعرض النص. لا callbacks منهم تنادي Stripe نيابة عن الابن.

### ب. الابن يطلب Intent ثم يؤكدها: `CardCheckout` في نفس الملف

**نفس دالة الدفع الفعلية؛ قصّرنا نص النجاح فقط:**

```jsx
const pay = async () => {
    if (!stripe || !elements || processing) return;
    setProcessing(true);
    onMessage('');
    const idempotencyKey = crypto.randomUUID();
    try {
        const response = await csrfFetch('/api/payments/intents', {
            method: 'POST',
            headers: { 'Idempotency-Key': idempotencyKey },
            body: JSON.stringify({
                ...payload(),
                payment_method: 'card',
                idempotency_key: idempotencyKey,
            }),
        });

        const result = await stripe.confirmCardPayment(response.client_secret, {
            payment_method: { card: elements.getElement(CardElement) },
        });
        if (result.error) throw new Error(result.error.message);

        onMessage('Payment is being confirmed.');
        onSuccess(response.tracking_url);
    } catch (error) {
        onMessage(error.message || 'Card payment failed. Please try again.');
    } finally {
        setProcessing(false);
    }
};
```

`setProcessing` React setter يضبط حالة الواجهة؛ `finally` يعيدها false عند النجاح والفشل. `...payload()` spread ينسخ خصائص object الناتجة، و`payment_method` بعده تغلب نفس المفتاح لو موجود. لا تنتقل إلى confirmCardPayment لو csrfFetch فشلت: التحكم يذهب مباشرة إلى catch.

### ج. الـ route والـ controller: `routes/web.php` ثم `PaymentController`

```php
// السطران داخل prefix('api') في routes/web.php
Route::post('/payments/intents', [PaymentController::class, 'createIntent']);
Route::post('/payments/webhook', [PaymentController::class, 'webhook']);
```

**مقتطف من createIntent بعد validation وفحص تكرار المفتاح:**

```php
$data['idempotency_key'] = $key;
$order = $creator->create($data, $request->user(), Order::STATUS_PAYMENT_PENDING);

try {
    $intent = $gateway->createIntent(
        (int) round(((float) $order->total_price) * 100),
        'egp',
        ['order_id' => (string) $order->id],
        $key,
    );
    $order->update([
        'payment_gateway' => 'stripe',
        'gateway_reference' => $intent['id'],
    ]);
} catch (Throwable $exception) {
    $order->delete();
    report($exception);
    return response()->json(['message' => 'Card payment could not be started.'], 502);
}

return response()->json([
    'order_id' => $order->id,
    'tracking_token' => $order->tracking_token,
    'tracking_url' => "/orders/{$order->tracking_token}",
    'client_secret' => $intent['client_secret'],
    'publishable_key' => config('services.stripe.key'),
], 201);
```

- `$creator->create(...)` دالة مشروع سبق تتبعنا جسمها في درس 06: تحسب السعر من pivot، تحفظ Order والبنود داخل transaction، وترجع Order. هنا الحالة payment_pending، مش new؛ payment_status pending للكارت.
- `$request->header('Idempotency-Key')` في بداية method تقرأ نص header أو null. مفتاح سابق موجود يؤدي لرد 409 قبل هذا المقطع؛ مش إلى Stripe call ثانية داخل نفس الطلب.
- `round` دالة PHP ترجع رقمًا مقربًا؛ `(float)` و`(int)` casts. لو total `415.00`، مبلغ EGP المرسل `41500` قرش؛ ده تحويل وحدات لا زيادة سعر.
- `update` method Eloquent تحفظ حقول gateway على Order وترجع Boolean؛ الكود لا يستخدم الناتج.
- `delete()` method Eloquent تحذف الصف الحالي وترجع نتيجة نجاح، وليست إلغاء PaymentIntent خارجي. `report($exception)` helper Laravel يبلّغ نظام التقارير/التسجيل وفق الإعداد؛ ما يرجّعش رسالة العميل.
- **حد مهم في الكود الحالي:** إنشاء Order تم والتعامل مع Stripe خارج transaction الخاصة بإنشائها. لو إنشاء Stripe نجح ثم فشل حفظ المرجع، حذف Order لا يلغي Intent عند Stripe. ده يحتاج تصميم تعويض/إعادة ربط أفضل في الإنتاج، مش rollback سحرية.
- `config('services.stripe.key')` helper تقرأ قيمة إعداد في السيرفر؛ هنا المفتاح القابل للنشر للعميل فقط. لا تفتح config الأسرار أو تنسخها في المثال.

### د. مين `$gateway`؟ العقد والتسجيل والتنفيذ

**التسجيل الحقيقي في AppServiceProvider:**

```php
$this->app->bind(PaymentGateway::class, StripePaymentGateway::class);
```

Laravel container يعطي controller object من StripePaymentGateway لما يطلب interface PaymentGateway. `bind` تسجل طريقة الحل؛ لا تنفّذ دفعة. العقد يفرض signature فيها amount/currency/metadata/idempotencyKey ونتيجة array.

**تنفيذ `createIntent` الفعلي في StripePaymentGateway:**

```php
public function createIntent(int $amount, string $currency, array $metadata, string $idempotencyKey): array
{
    $intent = (new StripeClient(config('services.stripe.secret')))->paymentIntents->create([
        'amount' => $amount,
        'currency' => $currency,
        'automatic_payment_methods' => ['enabled' => true],
        'metadata' => $metadata,
    ], ['idempotency_key' => $idempotencyKey]);

    return ['id' => $intent->id, 'client_secret' => $intent->client_secret];
}
```

- `createIntent` هنا اسم اختاره المشروع، تنفيذه يجمع إعدادات المكتبة؛ ليست نفس method `create` التالية.
- `new StripeClient(...)` يبني SDK client بمفتاح السيرفر المقروء من config؛ ترجع عملية الإنشاء object عميل، ولا ده معناه تحصيل مبلغ الآن.
- `paymentIntents` خدمة من Stripe SDK، و`create($params, $options)` عليها هي اللي تطلب إنشاء Intent عبر الشبكة وترجع PaymentIntent object أو ترمي exception.
- المدخل الأول params للعملية، والثاني options للطلب مثل idempotency_key. `metadata` تربط order_id، لا تخزّن بها بيانات بطاقة.
- `return [...]` يحوّل object SDK لعقد array الذي يحتاجه controller. البيانات تعود للـ controller ثم JSON إلى `csrfFetch` ثم `confirmCardPayment` في الابن. كده قفلنا مسار الرد الأول.

## 8. الطلب الثاني مستقل: webhook من Stripe، مش رجوع React

المتصفح ممكن يقفل قبل صفحة النجاح. لذلك Stripe ترسل HTTP request مستقلة إلى `/api/payments/webhook`، في توقيت قد يختلف عن رد المتصفح.

### أ. دالة التحقق مش اسم مجهول: جسمها الحقيقي

```php
public function parseWebhook(string $payload, string $signature): object
{
    return Webhook::constructEvent(
        $payload,
        $signature,
        config('services.stripe.webhook_secret')
    );
}
```

- `parseWebhook` دالة مشروع لتنفيذ عقد gateway. تاخد raw body والتوقيع وترجع event object أو ترمي exception.
- `Webhook::constructEvent` method Stripe SDK: تتحقق من التوقيع باستخدام secret وتبني Event من payload الصحيحة. لو verification فشلت لا ترجع event موثوقًا، بل ترمي خطأ.
- `$request->getContent()` method request ترجع raw body كنص، و`header('Stripe-Signature')` ترجع قيمة header؛ دول المدخلان من HTTP، مش من state React.
- استثناء CSRF لهذا المسار يسمح لسيرفر Stripe بالوصول؛ التوقيع هو فحص المصدر هنا. لا تعفي أي endpoint عشوائي من CSRF للتعلّم.

### ب. تكملة controller بعد التحقق

**المقطع الفعلي من webhook:**

```php
$intent = $event->data->object;
$order = Order::where('gateway_reference', $intent->id ?? null)->first();
if (! $order) {
    return response()->json(['received' => true]);
}

if ($event->type === 'payment_intent.succeeded' && $order->payment_status !== 'paid') {
    DB::transaction(function () use ($order): void {
        $from = $order->status;
        $order->update(['payment_status' => 'paid', 'status' => Order::STATUS_NEW]);
        OrderStatusLog::create([
            'order_id' => $order->id,
            'from_status' => $from,
            'to_status' => Order::STATUS_NEW,
            'created_at' => now(),
        ]);
    });
    OrderPlaced::dispatch($order->fresh());
}

if ($event->type === 'payment_intent.payment_failed') {
    $order->update(['payment_status' => 'failed']);
}

return response()->json(['received' => true]);
```

- `where(...)->first()` تبحث في DB عن Order مرجعها نفس Intent، وترجع model أو null. قراءة `$event->data->object` وصول خصائص، مش methods.
- `DB::transaction` تجمع update الحالة وcreate التاريخ في نجاح/تراجع واحد. callback هنا `void` لا ترجع Order؛ لا تفترض إن transaction دائمًا ترجع Order، نتيجتها حسب return callback.
- `OrderStatusLog::create` تضيف model تاريخ جديدة في DB؛ `now()` تعطي التوقيت الحالي.
- `fresh()` method Eloquent تقرأ نسخة جديدة من نفس السجل وترجع model جديدة أو null؛ تختلف عن `refresh()` التي تعيد تعبئة instance الحالية. هنا نرسل النسخة الجديدة للـ event.
- `dispatch` تطلق event للمستمعين؛ `response()->json(['received' => true])` إقرار استلام إلى Stripe، مش رسالة نجاح إلى React مباشرة.
- تكرار نفس الحدث **بالتتابع** يتوقف عند شرط paid فلا يكتب تاريخًا ثانيًا. شرط قبل transaction وحده لا يحل race لحدثين متزامنين؛ الاختبار الحالي لا يثبت هذا الجانب. لا نقدم المثال كدورة دفع إنتاجية مكتملة أو دعم refunds.

**اختبار فهم بإيدك من غير فلوس:** ارسم مسارين منفصلين: `React → Intent endpoint → gateway → React`، ثم `Stripe → webhook → verify → DB → acknowledgment`. حدد في كل مسار مين ينادي مين، وموضع أول تغيير لـ payment_status إلى paid. الجواب: webhook الموثقة، مش مجرد navigate لصفحة النجاح.

راجع كمان [04 — الجلسات والصلاحيات](04-login-and-roles.md) و[06 — transaction وdependency injection](06-routes-controllers-and-server.md).
