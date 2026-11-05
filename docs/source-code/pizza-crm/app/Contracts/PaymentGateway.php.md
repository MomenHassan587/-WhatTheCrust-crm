# عقد بوابة الدفع — Interface

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `app/Contracts/PaymentGateway.php` · 11 سطر.

**وظيفة الملف:** مش implementation ومش بيكلم Stripe بنفسه. بيحدد الدوال اللي أي payment provider لازم يوفرها. controller يعتمد على العقد، والـ container يختار Stripe الحقيقي، والاختبار يقدر يبدّله بكلاس وهمي.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../app/Contracts/PaymentGateway.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Services/Payments/StripePaymentGateway.php](../Services/Payments/StripePaymentGateway.php.md)

- [pizza-crm/app/Providers/AppServiceProvider.php](../Providers/AppServiceProvider.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

namespace App\Contracts;

interface PaymentGateway
{
    public function createIntent(int $amount, string $currency, array $metadata, string $idempotencyKey): array;

    public function parseWebhook(string $payload, string $signature): object;
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### createIntent

توقيع الدالة المطلوبة من بوابة الدفع لبدء intent؛ الجسم موجود في StripePaymentGateway.

- **بتاخد إيه؟ Inputs:** int amount بالوحدة الصغرى، currency، metadata، idempotencyKey.

- **بترجع/بتغيّر إيه؟ Return / effect:** array حسب العقد؛ implementation المشروع يعيد id وclient_secret.

### parseWebhook

عقد فحص وتحويل webhook إلى event موثوق.

- **بتاخد إيه؟ Inputs:** string payload الخام وstring signature.

- **بترجع/بتغيّر إيه؟ Return / effect:** object event أو exception لو غير صالح.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

namespace App\Contracts;

interface PaymentGateway
{
    public function createIntent(int $amount, string $currency, array $metadata, string $idempotencyKey): array;

```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** namespace بتحدد نطاق أسماء الكلاس `App\Contracts`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 5:** TypeScript type: وصف شكل بيانات/مدخلات وقت الفحص، مش object أو تحقق API وقت التشغيل.

**السطر 6:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 7:** Function / تعريف دالة `createIntent`؛ تعريفها مش تشغيلها. توقيع الدالة المطلوبة من بوابة الدفع لبدء intent؛ الجسم موجود في StripePaymentGateway. مدخلاتها: int amount بالوحدة الصغرى، currency، metadata، idempotencyKey. ناتجها: array حسب العقد؛ implementation المشروع يعيد id وclient_secret.

### السطور 9–11

```php
    public function parseWebhook(string $payload, string $signature): object;
}

```

**السطر 9:** Function / تعريف دالة `parseWebhook`؛ تعريفها مش تشغيلها. عقد فحص وتحويل webhook إلى event موثوق. مدخلاتها: string payload الخام وstring signature. ناتجها: object event أو exception لو غير صالح.

**السطر 10:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
