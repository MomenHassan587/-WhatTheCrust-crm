# التنفيذ الحقيقي لبوابة Stripe

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `app/Services/Payments/StripePaymentGateway.php` · 28 سطر.

**وظيفة الملف:** هو المكان اللي بيعرف Stripe SDK. المفتاح السري من config، ومش بيرجعه للمتصفح. الواجهة تستقبل client_secret بتاع intent فقط وpublishable key من controller.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../app/Services/Payments/StripePaymentGateway.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Contracts/PaymentGateway.php](../../Contracts/PaymentGateway.php.md)

- [pizza-crm/app/Http/Controllers/Api/PaymentController.php](../../Http/Controllers/Api/PaymentController.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

namespace App\Services\Payments;

use App\Contracts\PaymentGateway;
use Stripe\StripeClient;
use Stripe\Webhook;

class StripePaymentGateway implements PaymentGateway
{
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

    public function parseWebhook(string $payload, string $signature): object
    {
        return Webhook::constructEvent($payload, $signature, config('services.stripe.webhook_secret'));
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### createIntent

أنشئ StripeClient واطلب paymentIntents.create مع automatic payment methods وmetadata ومفتاح منع التكرار.

- **بتاخد إيه؟ Inputs:** amount int بالقرش، currency egp، metadata فيها order_id، idempotencyKey.

- **بترجع/بتغيّر إيه؟ Return / effect:** array بمفتاحي id وclient_secret من Stripe.

### parseWebhook

مرّر body والتوقيع والwebhook secret إلى Stripe Webhook::constructEvent؛ مش مجرد json_decode.

- **بتاخد إيه؟ Inputs:** payload النص الأصلي بدون تعديله، signature من header.

- **بترجع/بتغيّر إيه؟ Return / effect:** Stripe event object عند التحقق الناجح؛ SDK يرمي exception لو غير صالح.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### paymentIntents->create

- **جاية منين؟** Stripe SDK

- **وظيفتها:** تنشئ PaymentIntent عبر عميل Stripe على السيرفر.

- **المدخلات — Arguments:** amount/currency/metadata ثم خيارات idempotency.

- **الناتج/الأثر — Return / effect:** Stripe PaymentIntent object؛ الإنشاء ليس إثبات دفع.

- **أول موضع هنا:** السطر 13.

### config

- **جاية منين؟** Laravel helper

- **وظيفتها:** اقرأ إعدادًا من ملفات config بالقيمة المحملة وقت تشغيل التطبيق؛ النقطة تفصل الملف عن المفتاح الداخلي.

- **المدخلات — Arguments:** key بصيغة dot notation مثل services.stripe.key، ثم default اختيارية. بدون key يرجع config repository، وarray تضبط إعدادات.

- **الناتج/الأثر — Return / effect:** قيمة الإعداد أو default في الاستخدام الحالي؛ ليست بالضرورة string ولا قيمة env مباشرة.

- **أول موضع هنا:** السطر 25.

- **مثال:** config('orders.minimum_pickup_prep_minutes', 20)

### Webhook::constructEvent

- **جاية منين؟** Stripe Webhook SDK

- **وظيفتها:** تحقق من signature وتوقيت webhook بالsecret ثم حوّل JSON إلى Stripe event.

- **المدخلات — Arguments:** payload وStripe-Signature وwebhook_secret.

- **الناتج/الأثر — Return / effect:** Stripe event أو exception عند خطأ.

- **أول موضع هنا:** السطر 25.

- **مثال:** Webhook::constructEvent($payload, $signature, config('services.stripe.webhook_secret'))

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

namespace App\Services\Payments;

use App\Contracts\PaymentGateway;
use Stripe\StripeClient;
use Stripe\Webhook;

```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** namespace بتحدد نطاق أسماء الكلاس `App\Services\Payments`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 5:** use / استيراد الاسم `App\Contracts\PaymentGateway` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** use / استيراد الاسم `Stripe\StripeClient` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 7:** use / استيراد الاسم `Stripe\Webhook` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php
class StripePaymentGateway implements PaymentGateway
{
    public function createIntent(int $amount, string $currency, array $metadata, string $idempotencyKey): array
    {
        $intent = (new StripeClient(config('services.stripe.secret')))->paymentIntents->create([
            'amount' => $amount,
            'currency' => $currency,
            'automatic_payment_methods' => ['enabled' => true],
```

**السطر 9:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

**السطر 10:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 11:** Function / تعريف دالة `createIntent`؛ تعريفها مش تشغيلها. أنشئ StripeClient واطلب paymentIntents.create مع automatic payment methods وmetadata ومفتاح منع التكرار. مدخلاتها: amount int بالقرش، currency egp، metadata فيها order_id، idempotencyKey. ناتجها: array بمفتاحي id وclient_secret من Stripe.

**السطر 12:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 13:** Assignment / إسناد: احسب `(new StripeClient(config('services.stripe.secret')))->paymentIntents->create([` الأول وخزّن النتيجة في `$intent`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 14:** PHP array entry: المفتاح `amount` مرتبط بالقيمة `$amount`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 15:** PHP array entry: المفتاح `currency` مرتبط بالقيمة `$currency`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 16:** PHP array entry: المفتاح `automatic_payment_methods` مرتبط بالقيمة `['enabled' => true]`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 17–24

```php
            'metadata' => $metadata,
        ], ['idempotency_key' => $idempotencyKey]);

        return ['id' => $intent->id, 'client_secret' => $intent->client_secret];
    }

    public function parseWebhook(string $payload, string $signature): object
    {
```

**السطر 17:** PHP array entry: المفتاح `metadata` مرتبط بالقيمة `$metadata`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 18:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 20:** return تعيد array القيم التالية. في ملف config دي إعدادات يستلمها Laravel وقت تحميل الإعداد؛ في method فهي ناتج يرجع للكود اللي ناداها. مش JSON response إلا لو بنينا response صراحة.

**السطر 21:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 23:** Function / تعريف دالة `parseWebhook`؛ تعريفها مش تشغيلها. مرّر body والتوقيع والwebhook secret إلى Stripe Webhook::constructEvent؛ مش مجرد json_decode. مدخلاتها: payload النص الأصلي بدون تعديله، signature من header. ناتجها: Stripe event object عند التحقق الناجح؛ SDK يرمي exception لو غير صالح.

**السطر 24:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

### السطور 25–28

```php
        return Webhook::constructEvent($payload, $signature, config('services.stripe.webhook_secret'));
    }
}

```

**السطر 25:** return تعيد التعبير `Webhook::constructEvent($payload, $signature, config('services.stripe.webhook_secret'))` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 26:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 27:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
