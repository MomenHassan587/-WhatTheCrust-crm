# بداية Laravel والـ middleware والاستثناءات

[فهرس كل الأكواد](../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `bootstrap/app.php` · 44 سطر.

**وظيفة الملف:** بيحمّل routes وبيعرّف الاسم role للـ RequireRole. بيستثني webhook الدفع فقط من CSRF لأن Stripe مش متصفح عنده session token، وبيعتمد بدل ده على signature داخل PaymentGateway. لو خطأ اتصال قاعدة البيانات معروف، بيرجع JSON أو صفحة 503 مفهومة بدل رسالة SQL الخام.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../bootstrap/app.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Http/Middleware/RequireRole.php](../app/Http/Middleware/RequireRole.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

use App\Http\Middleware\RequireRole;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        channels: __DIR__.'/../routes/channels.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias(['role' => RequireRole::class]);
        $middleware->validateCsrfTokens(except: ['api/payments/webhook']);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (QueryException $exception, Request $request) {
            $message = strtolower($exception->getMessage());
            $isConnectionProblem = str_contains($message, 'connection refused')
                || str_contains($message, 'no connection could be made')
                || str_contains($message, 'unknown database')
                || str_contains($message, 'server has gone away')
                || str_contains($message, 'sqlstate[hy000] [2002]')
                || str_contains($message, 'sqlstate[hy000] [1049]');

            if (! $isConnectionProblem) {
                return null;
            }

            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => 'Database is not running. Start MySQL in XAMPP and check the database name in .env.',
                ], 503);
            }

            return response()->view('errors.database', status: 503);
        });
    })->create();
```

</details>

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### Application::configure

- **جاية منين؟** Laravel Application

- **وظيفتها:** تبدأ إعداد التطبيق بمساره الأساسي.

- **المدخلات — Arguments:** basePath وخيارات.

- **الناتج/الأثر — Return / effect:** ApplicationBuilder لاستكمال withRouting/withMiddleware.

- **أول موضع هنا:** السطر 10.

### dirname

- **جاية منين؟** PHP built-in filesystem path function

- **وظيفتها:** تطلع مسار الفولدر الأب من نص مسار؛ مفيدة لبناء مسار bootstrap أو vendor بالنسبة لمكان الملف. بتتعامل مع النص ومش بتتأكد إن المسار موجود.

- **المدخلات — Arguments:** path: نص المسار، وlevels اختياري بعدد مستويات الرجوع؛ الافتراضي1 ولازم يكون موجبًا.

- **الناتج/الأثر — Return / effect:** string لمسار الفولدر الأب. لو مفيش جزء فولدر مناسب قد تكون النتيجة نقطة .؛ levels غير صالح يرمي ValueError.

- **أول موضع هنا:** السطر 10.

### ->withRouting

- **جاية منين؟** Laravel ApplicationBuilder

- **وظيفتها:** تسجل ملفات routes/commands/health.

- **المدخلات — Arguments:** named arguments لمسارات الملفات.

- **الناتج/الأثر — Return / effect:** نفس builder.

- **أول موضع هنا:** السطر 11.

### ->withMiddleware

- **جاية منين؟** Laravel ApplicationBuilder

- **وظيفتها:** تسجل إعدادات middleware عبر callback.

- **المدخلات — Arguments:** callback.

- **الناتج/الأثر — Return / effect:** builder.

- **أول موضع هنا:** السطر 17.

### $middleware->alias

- **جاية منين؟** Laravel Middleware configuration

- **وظيفتها:** تسجّل أسماء middleware المختصرة.

- **المدخلات — Arguments:** alias=>class array.

- **الناتج/الأثر — Return / effect:** إعدادات middleware؛ لا تنفذ request الآن.

- **أول موضع هنا:** السطر 18.

### $middleware->validateCsrfTokens

- **جاية منين؟** Laravel Middleware configuration

- **وظيفتها:** تضبط CSRF middleware مثل except لمسار webhook.

- **المدخلات — Arguments:** except وغيرها حسب الإصدار.

- **الناتج/الأثر — Return / effect:** إعداد؛ استثناء CSRF ليس proof صحة webhook.

- **أول موضع هنا:** السطر 19.

### ->withExceptions

- **جاية منين؟** Laravel ApplicationBuilder

- **وظيفتها:** تسجل إعداد معالجة exceptions.

- **المدخلات — Arguments:** callback.

- **الناتج/الأثر — Return / effect:** builder.

- **أول موضع هنا:** السطر 21.

### $exceptions->render

- **جاية منين؟** Laravel Exceptions configuration

- **وظيفتها:** تسجّل طريقة تحويل exception إلى response.

- **المدخلات — Arguments:** callback.

- **الناتج/الأثر — Return / effect:** إعداد handler؛ ردها يتم عند خطأ مطابق.

- **أول موضع هنا:** السطر 22.

### $exception->getMessage

- **جاية منين؟** PHP Throwable

- **وظيفتها:** تقرأ رسالة الخطأ.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** string؛ لا تعالج الخطأ وحدها.

- **أول موضع هنا:** السطر 23.

### strtolower

- **جاية منين؟** PHP built-in string function

- **وظيفتها:** تحوّل أحرف ASCII الإنجليزية الكبيرة لصغيرة؛ مثل تطبيع امتداد JPEG إلى jpeg. لا تغيّر string الأصلية ولا تعتبر معالجة lowercase كاملة لكل لغات Unicode.

- **المدخلات — Arguments:** string: النص المراد تحويله.

- **الناتج/الأثر — Return / effect:** string جديدة بالأحرف الصغيرة حيث ينطبق التحويل؛ العربي لا يحتاج حالة upper/lower بالطريقة دي.

- **أول موضع هنا:** السطر 23.

### str_contains

- **جاية منين؟** PHP 8 built-in string function

- **وظيفتها:** تفحص هل النص يحتوي المقطع في أي موضع؛ مثل البحث عن لفظ داخل رسالة. المقارنة case-sensitive.

- **المدخلات — Arguments:** haystack: النص الكامل، needle: المقطع المطلوب.

- **الناتج/الأثر — Return / effect:** Boolean. true لو المقطع موجود؛ needle الفاضية ترجع true.

- **أول موضع هنا:** السطر 29.

### $request->expectsJson

- **جاية منين؟** Laravel Request

- **وظيفتها:** اختبر هل الطلب متوقع لرد JSON بناءً على headers وطبيعة الطلب؛ يستخدم لاختيار رد خطأ DB المناسب.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** bool؛ لا تحلل JSON body ولا ترسل response.

- **أول موضع هنا:** السطر 35.

- **مثال:** $request->expectsJson()

### $request->is

- **جاية منين؟** Laravel Request

- **وظيفتها:** طابق path الطلب مع pattern، والنجمة * تسمح بتكملة المسار؛ مش مقارنة دور مستخدم.

- **المدخلات — Arguments:** pattern string أو عدة patterns؛ هنا 'api/*'.

- **الناتج/الأثر — Return / effect:** bool هل المسار مطابق.

- **أول موضع هنا:** السطر 35.

- **مثال:** $request->is('api/*')

### ->json

- **جاية منين؟** Laravel Response factory

- **وظيفتها:** تجهّز HTTP response من بيانات JSON.

- **المدخلات — Arguments:** data وstatus وheaders.

- **الناتج/الأثر — Return / effect:** JsonResponse، مش object JavaScript مشترك بين PHP والمتصفح.

- **أول موضع هنا:** السطر 36.

### response

- **جاية منين؟** Laravel helper

- **وظيفتها:** جهّز HTTP response. بدون arguments هات factory نكمل عليها json أو view أو streamDownload.

- **المدخلات — Arguments:** بدون arguments للـ factory؛ أو content ثم status ثم headers لإنشاء response مباشرة.

- **الناتج/الأثر — Return / effect:** ResponseFactory بدون arguments، أو HTTP Response عند تمرير content؛ مش إرسال شبكة من browser.

- **أول موضع هنا:** السطر 41.

- **مثال:** return response()->json(['message' => 'Saved'], 201);

### ->view

- **جاية منين؟** Laravel Route/Response

- **وظيفتها:** تربط أو ترجع view حسب الاستدعاء.

- **المدخلات — Arguments:** اسم view وبيانات/URI حسب API.

- **الناتج/الأثر — Return / effect:** Route عند Route::view، أو View في helper.

- **أول موضع هنا:** السطر 41.

### ->create

- **جاية منين؟** Eloquent/Relation

- **وظيفتها:** تنشئ صفًا ببيانات ملء مسموحة.

- **المدخلات — Arguments:** attributes array.

- **الناتج/الأثر — Return / effect:** model المحفوظ؛ ليست validation أو authorization تلقائية.

- **أول موضع هنا:** السطر 43.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

use App\Http\Middleware\RequireRole;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** use / استيراد الاسم `App\Http\Middleware\RequireRole` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 4:** use / استيراد الاسم `Illuminate\Database\QueryException` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 5:** use / استيراد الاسم `Illuminate\Foundation\Application` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** use / استيراد الاسم `Illuminate\Foundation\Configuration\Exceptions` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 7:** use / استيراد الاسم `Illuminate\Foundation\Configuration\Middleware` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 8:** use / استيراد الاسم `Illuminate\Http\Request` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        channels: __DIR__.'/../routes/channels.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
```

**السطر 10:** return تعيد التعبير `Application::configure(basePath: dirname(__DIR__))` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 11:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->withRouting(...)`: تسجل ملفات routes/commands/health. مدخلاتها: named arguments لمسارات الملفات. العائد/الأثر: نفس builder.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 12:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 13:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 14:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 15:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 16:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 17–24

```php
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias(['role' => RequireRole::class]);
        $middleware->validateCsrfTokens(except: ['api/payments/webhook']);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (QueryException $exception, Request $request) {
            $message = strtolower($exception->getMessage());
            $isConnectionProblem = str_contains($message, 'connection refused')
```

**السطر 17:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->withMiddleware(...)`: تسجل إعدادات middleware عبر callback. مدخلاتها: callback. العائد/الأثر: builder.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 18:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$middleware->alias(...)`: تسجّل أسماء middleware المختصرة. مدخلاتها: alias=>class array. العائد/الأثر: إعدادات middleware؛ لا تنفذ request الآن.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 19:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `$middleware->validateCsrfTokens(...)`: تضبط CSRF middleware مثل except لمسار webhook. مدخلاتها: except وغيرها حسب الإصدار. العائد/الأثر: إعداد؛ استثناء CSRF ليس proof صحة webhook.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 20:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 21:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->withExceptions(...)`: تسجل إعداد معالجة exceptions. مدخلاتها: callback. العائد/الأثر: builder.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 22:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$exceptions->render(...)`: تسجّل طريقة تحويل exception إلى response. مدخلاتها: callback. العائد/الأثر: إعداد handler؛ ردها يتم عند خطأ مطابق.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 23:** Assignment / إسناد: احسب `strtolower($exception->getMessage())` الأول وخزّن النتيجة في `$message`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 24:** Assignment / إسناد: احسب `str_contains($message, 'connection refused')` الأول وخزّن النتيجة في `$isConnectionProblem`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

### السطور 25–32

```php
                || str_contains($message, 'no connection could be made')
                || str_contains($message, 'unknown database')
                || str_contains($message, 'server has gone away')
                || str_contains($message, 'sqlstate[hy000] [2002]')
                || str_contains($message, 'sqlstate[hy000] [1049]');

            if (! $isConnectionProblem) {
                return null;
```

**السطر 25:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `str_contains(...)`: تفحص هل النص يحتوي المقطع في أي موضع؛ مثل البحث عن لفظ داخل رسالة. المقارنة case-sensitive. مدخلاتها: haystack: النص الكامل، needle: المقطع المطلوب. العائد/الأثر: Boolean. true لو المقطع موجود؛ needle الفاضية ترجع true.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 26:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `str_contains(...)`: تفحص هل النص يحتوي المقطع في أي موضع؛ مثل البحث عن لفظ داخل رسالة. المقارنة case-sensitive. مدخلاتها: haystack: النص الكامل، needle: المقطع المطلوب. العائد/الأثر: Boolean. true لو المقطع موجود؛ needle الفاضية ترجع true.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 27:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `str_contains(...)`: تفحص هل النص يحتوي المقطع في أي موضع؛ مثل البحث عن لفظ داخل رسالة. المقارنة case-sensitive. مدخلاتها: haystack: النص الكامل، needle: المقطع المطلوب. العائد/الأثر: Boolean. true لو المقطع موجود؛ needle الفاضية ترجع true.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 28:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `str_contains(...)`: تفحص هل النص يحتوي المقطع في أي موضع؛ مثل البحث عن لفظ داخل رسالة. المقارنة case-sensitive. مدخلاتها: haystack: النص الكامل، needle: المقطع المطلوب. العائد/الأثر: Boolean. true لو المقطع موجود؛ needle الفاضية ترجع true.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 29:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `str_contains(...)`: تفحص هل النص يحتوي المقطع في أي موضع؛ مثل البحث عن لفظ داخل رسالة. المقارنة case-sensitive. مدخلاتها: haystack: النص الكامل، needle: المقطع المطلوب. العائد/الأثر: Boolean. true لو المقطع موجود؛ needle الفاضية ترجع true.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 31:** if تختبر الشرط `! $isConnectionProblem`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 32:** return تعيد التعبير `null` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

### السطور 33–40

```php
            }

            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'message' => 'Database is not running. Start MySQL in XAMPP and check the database name in .env.',
                ], 503);
            }

```

**السطر 33:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 35:** if تختبر الشرط `$request->expectsJson() || $request->is('api/*')`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 36:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 37:** PHP array entry: المفتاح `message` مرتبط بالقيمة `'Database is not running. Start MySQL in XAMPP and check the database name in .env.'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 38:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 39:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 41–44

```php
            return response()->view('errors.database', status: 503);
        });
    })->create();

```

**السطر 41:** return تعيد التعبير `response()->view('errors.database', status: 503)` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 42:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 43:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->create(...)`: تنشئ صفًا ببيانات ملء مسموحة. مدخلاتها: attributes array. العائد/الأثر: model المحفوظ؛ ليست validation أو authorization تلقائية.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
