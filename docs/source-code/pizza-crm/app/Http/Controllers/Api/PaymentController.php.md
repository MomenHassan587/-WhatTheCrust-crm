# بدء دفع الكارت وتأكيده من webhook

[فهرس كل الأكواد](../../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `app/Http/Controllers/Api/PaymentController.php` · 104 سطر.

**وظيفة الملف:** createIntent ينشئ طلب payment_pending ثم يطلب Stripe intent. webhook مستقل يتأكد من signature قبل إعلان paid. نجاح واجهة الكارت وحده مش مصدر الثقة. الحماية الحالية للتكرار تمنع webhook متكرر بالتتابع، لكنها مش ضمان كامل ضد وصول حدثين متزامنين.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../../app/Http/Controllers/Api/PaymentController.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Contracts/PaymentGateway.php](../../../Contracts/PaymentGateway.php.md)

- [pizza-crm/app/Events/OrderPlaced.php](../../../Events/OrderPlaced.php.md)

- [pizza-crm/app/Http/Controllers/Controller.php](../Controller.php.md)

- [pizza-crm/app/Http/Requests/StoreOrderRequest.php](../../Requests/StoreOrderRequest.php.md)

- [pizza-crm/app/Models/Order.php](../../../Models/Order.php.md)

- [pizza-crm/app/Models/OrderStatusLog.php](../../../Models/OrderStatusLog.php.md)

- [pizza-crm/app/Services/Orders/OrderCreator.php](../../../Services/Orders/OrderCreator.php.md)

- [pizza-crm/resources/js/Pages/Cart.jsx](../../../../resources/js/Pages/Cart.jsx.md)

- [pizza-crm/app/Services/Payments/StripePaymentGateway.php](../../../Services/Payments/StripePaymentGateway.php.md)

- [pizza-crm/bootstrap/app.php](../../../../bootstrap/app.php.md)

- [pizza-crm/tests/Feature/OrderOperationsTest.php](../../../../tests/Feature/OrderOperationsTest.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

namespace App\Http\Controllers\Api;

use App\Contracts\PaymentGateway;
use App\Events\OrderPlaced;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Models\OrderStatusLog;
use App\Services\Orders\OrderCreator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Throwable;

class PaymentController extends Controller
{
    public function createIntent(StoreOrderRequest $request, OrderCreator $creator, PaymentGateway $gateway): JsonResponse
    {
        $data = $request->validated();
        if ($data['payment_method'] !== 'card') {
            throw ValidationException::withMessages(['payment_method' => ['Select card payment to create a payment intent.']]);
        }

        $key = $request->header('Idempotency-Key') ?: ($data['idempotency_key'] ?? null);
        if (! $key) {
            throw ValidationException::withMessages(['idempotency_key' => ['An idempotency key is required.']]);
        }

        if ($existing = Order::where('idempotency_key', $key)->first()) {
            return response()->json([
                'order_id' => $existing->id,
                'tracking_token' => $existing->tracking_token,
                'tracking_url' => "/orders/{$existing->tracking_token}",
                'client_secret' => null,
                'message' => 'This payment request has already been created.',
            ], 409);
        }

        $data['idempotency_key'] = $key;
        $order = $creator->create($data, $request->user(), Order::STATUS_PAYMENT_PENDING);

        try {
            $intent = $gateway->createIntent(
                (int) round(((float) $order->total_price) * 100),
                'egp',
                ['order_id' => (string) $order->id],
                $key,
            );
            $order->update(['payment_gateway' => 'stripe', 'gateway_reference' => $intent['id']]);
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
    }

    public function webhook(Request $request, PaymentGateway $gateway): JsonResponse
    {
        try {
            $event = $gateway->parseWebhook($request->getContent(), (string) $request->header('Stripe-Signature'));
        } catch (Throwable) {
            return response()->json(['message' => 'Invalid webhook signature.'], 400);
        }

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
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### createIntent

اطلب PaymentIntent للكارت بعد التحقق من idempotency key وحساب الإجمالي server-side؛ لو gateway فشل احذف الطلب المبدئي وأرجع 502.

- **بتاخد إيه؟ Inputs:** StoreOrderRequest وOrderCreator وPaymentGateway؛ header Idempotency-Key أو حقل idempotency_key.

- **بترجع/بتغيّر إيه؟ Return / effect:** 201 JSON client_secret وorder_id والتتبع؛ 409 لو نفس المفتاح موجود؛ 502 لو بدء الدفع فشل.

### webhook

تحقق من رسالة Stripe الموقعة، دور على الطلب بgateway_reference، حدّث paid/new وسجّل انتقال الحالة أو سجّل فشل الدفع.

- **بتاخد إيه؟ Inputs:** raw request body وStripe-Signature وPaymentGateway.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON received:true حتى لحدث ملوش طلب؛ 400 للتوقيع غير المقبول.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### $request->validated

- **جاية منين؟** Laravel FormRequest

- **وظيفتها:** اقرأ بيانات FormRequest التي عدّت validation؛ لا تعيد تشغيل business operation ولا إدخال DB.

- **المدخلات — Arguments:** key وdefault اختياريان؛ هنا الدالة بدون arguments لإرجاع البيانات كلها.

- **الناتج/الأثر — Return / effect:** array من validated input في الاستخدام الحالي.

- **أول موضع هنا:** السطر 22.

- **مثال:** $data = $request->validated();

### ValidationException::withMessages

- **جاية منين؟** Laravel ValidationException

- **وظيفتها:** ابنِ exception بأخطاء مرتبطة بأسماء حقول زي items أو expected_status.

- **المدخلات — Arguments:** array field=>messages.

- **الناتج/الأثر — Return / effect:** ValidationException؛ throw هو اللي يرميها.

- **أول موضع هنا:** السطر 29.

- **مثال:** throw ValidationException::withMessages(['items' => ['Unavailable']]);

### $request->header

- **جاية منين؟** Laravel Request

- **وظيفتها:** تقرأ HTTP header.

- **المدخلات — Arguments:** name وdefault اختياري.

- **الناتج/الأثر — Return / effect:** القيمة أو default؛ ليست proof صحة التوقيع.

- **أول موضع هنا:** السطر 72.

### Order::where

- **جاية منين؟** Laravel Query Builder

- **وظيفتها:** تضيف شرط فلترة أو مجموعة شروط.

- **المدخلات — Arguments:** column/operator/value أو closure.

- **الناتج/الأثر — Return / effect:** Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.

- **أول موضع هنا:** السطر 78.

### ->first

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تنفّذ query لجلب أول صف.

- **المدخلات — Arguments:** columns اختيارية.

- **الناتج/الأثر — Return / effect:** model أو stdClass حسب builder، أو null.

- **أول موضع هنا:** السطر 78.

### ->json

- **جاية منين؟** Laravel Response factory

- **وظيفتها:** تجهّز HTTP response من بيانات JSON.

- **المدخلات — Arguments:** data وstatus وheaders.

- **الناتج/الأثر — Return / effect:** JsonResponse، مش object JavaScript مشترك بين PHP والمتصفح.

- **أول موضع هنا:** السطر 101.

### response

- **جاية منين؟** Laravel helper

- **وظيفتها:** جهّز HTTP response. بدون arguments هات factory نكمل عليها json أو view أو streamDownload.

- **المدخلات — Arguments:** بدون arguments للـ factory؛ أو content ثم status ثم headers لإنشاء response مباشرة.

- **الناتج/الأثر — Return / effect:** ResponseFactory بدون arguments، أو HTTP Response عند تمرير content؛ مش إرسال شبكة من browser.

- **أول موضع هنا:** السطر 101.

- **مثال:** return response()->json(['message' => 'Saved'], 201);

### $creator->create

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** تحقق من الفرع والتوصيل وإتاحة كل منتج، احسب الإجمالي واحفظ order/items مع نسخة اسم وسعر وقت الطلب.

- **المدخلات — Arguments:** array $data المحققة، ?User $user ممكن null للضيف، string $status يحدده الكاش أو الدفع.

- **الناتج/الأثر — Return / effect:** Order محمّل بعلاقات branch وuser وitems.menuItem؛ يرمي ValidationException لو بند/توصيل غير متاح.

- **أول موضع هنا:** السطر 43.

- **تكملة التعريف:** [app/Services/Orders/OrderCreator.php](../../../Services/Orders/OrderCreator.php.md)، عند السطر 15.

### $request->user

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** صاحب الحساب إن كان الطلب من مستخدم مسجل.

- **المدخلات — Arguments:** orders.user_id nullable.

- **الناتج/الأثر — Return / effect:** BelongsTo.

- **أول موضع هنا:** السطر 43.

- **تكملة التعريف:** [app/Models/Order.php](../../../Models/Order.php.md)، عند السطر 76.

- **تكملة التعريف:** [app/Models/OrderStatusLog.php](../../../Models/OrderStatusLog.php.md)، عند السطر 21.

### $gateway->createIntent

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** اطلب PaymentIntent للكارت بعد التحقق من idempotency key وحساب الإجمالي server-side؛ لو gateway فشل احذف الطلب المبدئي وأرجع 502.

- **المدخلات — Arguments:** StoreOrderRequest وOrderCreator وPaymentGateway؛ header Idempotency-Key أو حقل idempotency_key.

- **الناتج/الأثر — Return / effect:** 201 JSON client_secret وorder_id والتتبع؛ 409 لو نفس المفتاح موجود؛ 502 لو بدء الدفع فشل.

- **أول موضع هنا:** السطر 46.

### round

- **جاية منين؟** PHP built-in

- **وظيفتها:** قرّب رقمًا حسب precision؛ الدفع يستخدمها بعد ضرب total في100 ثم cast إلىint، وده مختلف عن تقريب سعر للعرض فقط.

- **المدخلات — Arguments:** number ثم precision اختيارية افتراضي0 ثم rounding mode اختيارية.

- **الناتج/الأثر — Return / effect:** float نتيجة التقريب؛ cast(int) في payment يحوّلها بعد ذلك إلىinteger.

- **أول موضع هنا:** السطر 47.

- **مثال:** (int) round(((float) $order->total_price) * 100)

### $order->update

- **جاية منين؟** Eloquent

- **وظيفتها:** تكتب تغييرات في DB.

- **المدخلات — Arguments:** attributes array.

- **الناتج/الأثر — Return / effect:** Boolean على model أو عدد صفوف على builder؛ حسب المستقبِل.

- **أول موضع هنا:** السطر 98.

### $order->delete

- **جاية منين؟** Eloquent

- **وظيفتها:** تحذف صفًا/صفوفًا حسب المستقبِل.

- **المدخلات — Arguments:** بدون مدخلات في model المعتاد.

- **الناتج/الأثر — Return / effect:** نتيجة/عدد حسب model أو builder؛ حذف فعلي وليس إخفاء CSS.

- **أول موضع هنا:** السطر 54.

### report

- **جاية منين؟** Laravel helper

- **وظيفتها:** مرّر exception لنظام الإبلاغ والتسجيل المهيأ؛ لا يرسل رسالة نجاح للمستخدم ولا يعيد رميها لمجرد report.

- **المدخلات — Arguments:** Throwable أو قيمة خطأ يدعمها exception handler.

- **الناتج/الأثر — Return / effect:** void؛ الأثر تسجيل أو إبلاغ بحسب إعدادات المشروع.

- **أول موضع هنا:** السطر 55.

- **مثال:** report($exception);

### config

- **جاية منين؟** Laravel helper

- **وظيفتها:** اقرأ إعدادًا من ملفات config بالقيمة المحملة وقت تشغيل التطبيق؛ النقطة تفصل الملف عن المفتاح الداخلي.

- **المدخلات — Arguments:** key بصيغة dot notation مثل services.stripe.key، ثم default اختيارية. بدون key يرجع config repository، وarray تضبط إعدادات.

- **الناتج/الأثر — Return / effect:** قيمة الإعداد أو default في الاستخدام الحالي؛ ليست بالضرورة string ولا قيمة env مباشرة.

- **أول موضع هنا:** السطر 65.

- **مثال:** config('orders.minimum_pickup_prep_minutes', 20)

### $gateway->parseWebhook

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** عقد فحص وتحويل webhook إلى event موثوق.

- **المدخلات — Arguments:** string payload الخام وstring signature.

- **الناتج/الأثر — Return / effect:** object event أو exception لو غير صالح.

- **أول موضع هنا:** السطر 72.

- **تكملة التعريف:** [app/Contracts/PaymentGateway.php](../../../Contracts/PaymentGateway.php.md)، عند السطر 9.

### $request->getContent

- **جاية منين؟** Laravel Request

- **وظيفتها:** تقرأ جسم HTTP الخام.

- **المدخلات — Arguments:** اختيارات قليلة؛ الاستخدام هنا بدون.

- **الناتج/الأثر — Return / effect:** string في webhook هنا.

- **أول موضع هنا:** السطر 72.

### DB::transaction

- **جاية منين؟** Laravel Database Connection

- **وظيفتها:** شغّل callback داخل DB transaction؛ commit عند النجاح وrollback عند exception. لا يتراجع به ملف صورة أوطلب Stripe خارجي.

- **المدخلات — Arguments:** Closure callback، وعدد محاولات integer اختياري افتراضي1.

- **الناتج/الأثر — Return / effect:** نفس القيمة الراجعة من callback؛ يعيد رمي exception عند الفشل النهائي.

- **أول موضع هنا:** السطر 84.

- **مثال:** return DB::transaction(function () use ($data) { return Order::create($data); });

### OrderStatusLog::create

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** تحقق من الفرع والتوصيل وإتاحة كل منتج، احسب الإجمالي واحفظ order/items مع نسخة اسم وسعر وقت الطلب.

- **المدخلات — Arguments:** array $data المحققة، ?User $user ممكن null للضيف، string $status يحدده الكاش أو الدفع.

- **الناتج/الأثر — Return / effect:** Order محمّل بعلاقات branch وuser وitems.menuItem؛ يرمي ValidationException لو بند/توصيل غير متاح.

- **أول موضع هنا:** السطر 87.

- **تكملة التعريف:** [app/Services/Orders/OrderCreator.php](../../../Services/Orders/OrderCreator.php.md)، عند السطر 15.

### now

- **جاية منين؟** Laravel Date helper / Carbon

- **وظيفتها:** أنشئ object يمثل الوقت الحالي بتوقيت التطبيق أو المنطقة المطلوبة؛ ليست JS Date.now التي ترجع milliseconds.

- **المدخلات — Arguments:** timezone اختيارية؛ المشروع غالبًا بدون arguments.

- **الناتج/الأثر — Return / effect:** Carbon date-time object يمكن تنسيقها أو إضافة دقائق لها؛ ليست string تلقائيًا.

- **أول موضع هنا:** السطر 91.

- **مثال:** now()->addMinutes(20)

### OrderPlaced::dispatch

- **جاية منين؟** Laravel Event

- **وظيفتها:** تطلق event مع بياناته.

- **المدخلات — Arguments:** arguments الحدث.

- **الناتج/الأثر — Return / effect:** نتائج listeners أو null حسب dispatch؛ لا يثبت WebSocket في المتصفح.

- **أول موضع هنا:** السطر 94.

### $order->fresh

- **جاية منين؟** Laravel Eloquent Model

- **وظيفتها:** هات نسخة جديدة من السجل من DB بدل الاعتماد على نسخة قديمة في الذاكرة.

- **المدخلات — Arguments:** relations اختيارية.

- **الناتج/الأثر — Return / effect:** Model جديدة أو null لو السجل اختفى.

- **أول موضع هنا:** السطر 94.

- **مثال:** $order = $order->fresh()->load('items');

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

namespace App\Http\Controllers\Api;

use App\Contracts\PaymentGateway;
use App\Events\OrderPlaced;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** namespace بتحدد نطاق أسماء الكلاس `App\Http\Controllers\Api`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 5:** use / استيراد الاسم `App\Contracts\PaymentGateway` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** use / استيراد الاسم `App\Events\OrderPlaced` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 7:** use / استيراد الاسم `App\Http\Controllers\Controller` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 8:** use / استيراد الاسم `App\Http\Requests\StoreOrderRequest` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php
use App\Models\Order;
use App\Models\OrderStatusLog;
use App\Services\Orders\OrderCreator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Throwable;
```

**السطر 9:** use / استيراد الاسم `App\Models\Order` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 10:** use / استيراد الاسم `App\Models\OrderStatusLog` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 11:** use / استيراد الاسم `App\Services\Orders\OrderCreator` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 12:** use / استيراد الاسم `Illuminate\Http\JsonResponse` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 13:** use / استيراد الاسم `Illuminate\Http\Request` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 14:** use / استيراد الاسم `Illuminate\Support\Facades\DB` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 15:** use / استيراد الاسم `Illuminate\Validation\ValidationException` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 16:** use / استيراد الاسم `Throwable` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 17–24

```php

class PaymentController extends Controller
{
    public function createIntent(StoreOrderRequest $request, OrderCreator $creator, PaymentGateway $gateway): JsonResponse
    {
        $data = $request->validated();
        if ($data['payment_method'] !== 'card') {
            throw ValidationException::withMessages(['payment_method' => ['Select card payment to create a payment intent.']]);
```

**السطر 18:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

**السطر 19:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 20:** Function / تعريف دالة `createIntent`؛ تعريفها مش تشغيلها. اطلب PaymentIntent للكارت بعد التحقق من idempotency key وحساب الإجمالي server-side؛ لو gateway فشل احذف الطلب المبدئي وأرجع 502. مدخلاتها: StoreOrderRequest وOrderCreator وPaymentGateway؛ header Idempotency-Key أو حقل idempotency_key. ناتجها: 201 JSON client_secret وorder_id والتتبع؛ 409 لو نفس المفتاح موجود؛ 502 لو بدء الدفع فشل.

**السطر 21:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 22:** Assignment / إسناد: احسب `$request->validated()` الأول وخزّن النتيجة في `$data`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 23:** if تختبر الشرط `$data['payment_method'] !== 'card'`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 24:** throw ترمي الاستثناء `ValidationException::withMessages(['payment_method' => ['Select card payment to create a payment intent.']]);` وتوقف المسار العادي. Laravel exception handler أو catch المناسبة تتعامل معاه؛ مش مجرد رسالة بتنطبع وتكمّل التنفيذ.

### السطور 25–32

```php
        }

        $key = $request->header('Idempotency-Key') ?: ($data['idempotency_key'] ?? null);
        if (! $key) {
            throw ValidationException::withMessages(['idempotency_key' => ['An idempotency key is required.']]);
        }

        if ($existing = Order::where('idempotency_key', $key)->first()) {
```

**السطر 25:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 27:** Assignment / إسناد: احسب `$request->header('Idempotency-Key') ?: ($data['idempotency_key'] ?? null)` الأول وخزّن النتيجة في `$key`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 28:** if تختبر الشرط `! $key`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 29:** throw ترمي الاستثناء `ValidationException::withMessages(['idempotency_key' => ['An idempotency key is required.']]);` وتوقف المسار العادي. Laravel exception handler أو catch المناسبة تتعامل معاه؛ مش مجرد رسالة بتنطبع وتكمّل التنفيذ.

**السطر 30:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 32:** if تختبر الشرط `$existing = Order::where('idempotency_key', $key)->first()`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

### السطور 33–40

```php
            return response()->json([
                'order_id' => $existing->id,
                'tracking_token' => $existing->tracking_token,
                'tracking_url' => "/orders/{$existing->tracking_token}",
                'client_secret' => null,
                'message' => 'This payment request has already been created.',
            ], 409);
        }
```

**السطر 33:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 34:** PHP array entry: المفتاح `order_id` مرتبط بالقيمة `$existing->id`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 35:** PHP array entry: المفتاح `tracking_token` مرتبط بالقيمة `$existing->tracking_token`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 36:** PHP array entry: المفتاح `tracking_url` مرتبط بالقيمة `"/orders/{$existing->tracking_token}"`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 37:** PHP array entry: المفتاح `client_secret` مرتبط بالقيمة `null`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 38:** PHP array entry: المفتاح `message` مرتبط بالقيمة `'This payment request has already been created.'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 39:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 40:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 41–48

```php

        $data['idempotency_key'] = $key;
        $order = $creator->create($data, $request->user(), Order::STATUS_PAYMENT_PENDING);

        try {
            $intent = $gateway->createIntent(
                (int) round(((float) $order->total_price) * 100),
                'egp',
```

**السطر 42:** Assignment / إسناد: احسب القيمة على يمين = وخزّنها في المتغير أو خاصية الـobject على الشمال. -> وصول لخاصية/دالة object، و:: وصول static/facade حسب التعريف.

**السطر 43:** Assignment / إسناد: احسب `$creator->create($data, $request->user(), Order::STATUS_PAYMENT_PENDING)` الأول وخزّن النتيجة في `$order`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 45:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة.

**السطر 46:** Assignment / إسناد: احسب `$gateway->createIntent(` الأول وخزّن النتيجة في `$intent`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 47:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `round(...)`: قرّب رقمًا حسب precision؛ الدفع يستخدمها بعد ضرب total في100 ثم cast إلىint، وده مختلف عن تقريب سعر للعرض فقط. مدخلاتها: number ثم precision اختيارية افتراضي0 ثم rounding mode اختيارية. العائد/الأثر: float نتيجة التقريب؛ cast(int) في payment يحوّلها بعد ذلك إلىinteger.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 48:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 49–56

```php
                ['order_id' => (string) $order->id],
                $key,
            );
            $order->update(['payment_gateway' => 'stripe', 'gateway_reference' => $intent['id']]);
        } catch (Throwable $exception) {
            $order->delete();
            report($exception);

```

**السطر 49:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 50:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 51:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 52:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$order->update(...)`: تكتب تغييرات في DB. مدخلاتها: attributes array. العائد/الأثر: Boolean على model أو عدد صفوف على builder؛ حسب المستقبِل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 53:** Catch: استقبل الخطأ من try/Promise حسب السياق وتعامل مع رسالته؛ catch لا تعني نجاح الطلب الأصلي.

**السطر 54:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$order->delete(...)`: تحذف صفًا/صفوفًا حسب المستقبِل. مدخلاتها: بدون مدخلات في model المعتاد. العائد/الأثر: نتيجة/عدد حسب model أو builder؛ حذف فعلي وليس إخفاء CSS.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 55:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `report(...)`: مرّر exception لنظام الإبلاغ والتسجيل المهيأ؛ لا يرسل رسالة نجاح للمستخدم ولا يعيد رميها لمجرد report. مدخلاتها: Throwable أو قيمة خطأ يدعمها exception handler. العائد/الأثر: void؛ الأثر تسجيل أو إبلاغ بحسب إعدادات المشروع.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 57–64

```php
            return response()->json(['message' => 'Card payment could not be started.'], 502);
        }

        return response()->json([
            'order_id' => $order->id,
            'tracking_token' => $order->tracking_token,
            'tracking_url' => "/orders/{$order->tracking_token}",
            'client_secret' => $intent['client_secret'],
```

**السطر 57:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 58:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 60:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 61:** PHP array entry: المفتاح `order_id` مرتبط بالقيمة `$order->id`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 62:** PHP array entry: المفتاح `tracking_token` مرتبط بالقيمة `$order->tracking_token`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 63:** PHP array entry: المفتاح `tracking_url` مرتبط بالقيمة `"/orders/{$order->tracking_token}"`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 64:** PHP array entry: المفتاح `client_secret` مرتبط بالقيمة `$intent['client_secret']`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 65–72

```php
            'publishable_key' => config('services.stripe.key'),
        ], 201);
    }

    public function webhook(Request $request, PaymentGateway $gateway): JsonResponse
    {
        try {
            $event = $gateway->parseWebhook($request->getContent(), (string) $request->header('Stripe-Signature'));
```

**السطر 65:** PHP array entry: المفتاح `publishable_key` مرتبط بالقيمة `config('services.stripe.key')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 66:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 67:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 69:** Function / تعريف دالة `webhook`؛ تعريفها مش تشغيلها. تحقق من رسالة Stripe الموقعة، دور على الطلب بgateway_reference، حدّث paid/new وسجّل انتقال الحالة أو سجّل فشل الدفع. مدخلاتها: raw request body وStripe-Signature وPaymentGateway. ناتجها: JSON received:true حتى لحدث ملوش طلب؛ 400 للتوقيع غير المقبول.

**السطر 70:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 71:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة.

**السطر 72:** Assignment / إسناد: احسب `$gateway->parseWebhook($request->getContent(), (string) $request->header('Stripe-Signature'))` الأول وخزّن النتيجة في `$event`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

### السطور 73–80

```php
        } catch (Throwable) {
            return response()->json(['message' => 'Invalid webhook signature.'], 400);
        }

        $intent = $event->data->object;
        $order = Order::where('gateway_reference', $intent->id ?? null)->first();
        if (! $order) {
            return response()->json(['received' => true]);
```

**السطر 73:** Catch: استقبل الخطأ من try/Promise حسب السياق وتعامل مع رسالته؛ catch لا تعني نجاح الطلب الأصلي.

**السطر 74:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 75:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 77:** Assignment / إسناد: احسب `$event->data->object` الأول وخزّن النتيجة في `$intent`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 78:** Assignment / إسناد: احسب `Order::where('gateway_reference', $intent->id ?? null)->first()` الأول وخزّن النتيجة في `$order`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 79:** if تختبر الشرط `! $order`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 80:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

### السطور 81–88

```php
        }

        if ($event->type === 'payment_intent.succeeded' && $order->payment_status !== 'paid') {
            DB::transaction(function () use ($order): void {
                $from = $order->status;
                $order->update(['payment_status' => 'paid', 'status' => Order::STATUS_NEW]);
                OrderStatusLog::create([
                    'order_id' => $order->id,
```

**السطر 81:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 83:** if تختبر الشرط `$event->type === 'payment_intent.succeeded' && $order->payment_status !== 'paid'`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 84:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `DB::transaction(...)`: شغّل callback داخل DB transaction؛ commit عند النجاح وrollback عند exception. لا يتراجع به ملف صورة أوطلب Stripe خارجي. مدخلاتها: Closure callback، وعدد محاولات integer اختياري افتراضي1. العائد/الأثر: نفس القيمة الراجعة من callback؛ يعيد رمي exception عند الفشل النهائي.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 85:** Assignment / إسناد: احسب `$order->status` الأول وخزّن النتيجة في `$from`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 86:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$order->update(...)`: تكتب تغييرات في DB. مدخلاتها: attributes array. العائد/الأثر: Boolean على model أو عدد صفوف على builder؛ حسب المستقبِل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 87:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `OrderStatusLog::create(...)`: تحقق من الفرع والتوصيل وإتاحة كل منتج، احسب الإجمالي واحفظ order/items مع نسخة اسم وسعر وقت الطلب. مدخلاتها: array $data المحققة، ?User $user ممكن null للضيف، string $status يحدده الكاش أو الدفع. العائد/الأثر: Order محمّل بعلاقات branch وuser وitems.menuItem؛ يرمي ValidationException لو بند/توصيل غير متاح.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 88:** PHP array entry: المفتاح `order_id` مرتبط بالقيمة `$order->id`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 89–96

```php
                    'from_status' => $from,
                    'to_status' => Order::STATUS_NEW,
                    'created_at' => now(),
                ]);
            });
            OrderPlaced::dispatch($order->fresh());
        }

```

**السطر 89:** PHP array entry: المفتاح `from_status` مرتبط بالقيمة `$from`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 90:** PHP array entry: المفتاح `to_status` مرتبط بالقيمة `Order::STATUS_NEW`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 91:** PHP array entry: المفتاح `created_at` مرتبط بالقيمة `now()`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 92:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 93:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 94:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `OrderPlaced::dispatch(...)`: تطلق event مع بياناته. مدخلاتها: arguments الحدث. العائد/الأثر: نتائج listeners أو null حسب dispatch؛ لا يثبت WebSocket في المتصفح.؛ `$order->fresh(...)`: هات نسخة جديدة من السجل من DB بدل الاعتماد على نسخة قديمة في الذاكرة. مدخلاتها: relations اختيارية. العائد/الأثر: Model جديدة أو null لو السجل اختفى.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 95:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 97–104

```php
        if ($event->type === 'payment_intent.payment_failed') {
            $order->update(['payment_status' => 'failed']);
        }

        return response()->json(['received' => true]);
    }
}

```

**السطر 97:** if تختبر الشرط `$event->type === 'payment_intent.payment_failed'`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 98:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$order->update(...)`: تكتب تغييرات في DB. مدخلاتها: attributes array. العائد/الأثر: Boolean على model أو عدد صفوف على builder؛ حسب المستقبِل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 99:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 101:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 102:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 103:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
