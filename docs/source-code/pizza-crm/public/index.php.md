# public/index.php

[فهرس كل الأكواد](../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `public/index.php` · 21 سطر.

**وظيفة الملف:** ملف مصدر كامل من المشروع. استخدم الروابط والتعريفات أدناه لتتبّع المدخلات والتنفيذ والناتج؛ لا تلصق أجزاءه فوق ملف مختلف بدون سياق.

**نوعه:** source / مصدر. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../public/index.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());
```

</details>

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### define

- **جاية منين؟** PHP built-in function

- **وظيفتها:** تعرّف Constant باسم تختاره وقت التشغيل؛ الثابت مش متغير يبدأ بـ$ ومش هتغيّر قيمته بعد تعريفه. زي تعريف LARAVEL_START لوقت بداية الطلب.

- **المدخلات — Arguments:** constant_name: اسم الثابت كنص، ثم value: قيمته. في PHP 8 أسماء الثوابت case-sensitive؛ ما نطلبش وضع case-insensitive القديم.

- **الناتج/الأثر — Return / effect:** true عند نجاح التعريف أو false عند الفشل؛ إعادة تعريف ثابت موجود تصدر warning ولا تستبدل قيمته.

- **أول موضع هنا:** السطر 6.

### microtime

- **جاية منين؟** PHP built-in time function

- **وظيفتها:** تجيب الوقت الحالي بالثواني من Unix epoch ومعاه جزء عشري دقيق؛ تنفع نسجل البداية ونطرحها من النهاية لقياس الزمن. دي مش sleep ولا مؤقت بيكرر كود.

- **المدخلات — Arguments:** as_float اختياري: true يرجّع رقمًا، وfalse الافتراضية ترجع النص بالشكل الخاص microseconds seconds.

- **الناتج/الأثر — Return / effect:** float بالثواني لما نكتب microtime(true)، أو string بالشكل الافتراضي. الفرق بين قراءتين بالـfloat مدة بالثواني.

- **أول موضع هنا:** السطر 6.

### file_exists

- **جاية منين؟** PHP built-in

- **وظيفتها:** اختبر وجود ملف أو مجلد على filesystem بدون قراءة محتواه؛ readiness تفحص وجود .env فقط ولا تطبع أسراره.

- **المدخلات — Arguments:** path string.

- **الناتج/الأثر — Return / effect:** bool: true لو المسار موجود، وإلا false.

- **أول موضع هنا:** السطر 9.

- **مثال:** file_exists(base_path('.env'))

### $app->handleRequest

- **جاية منين؟** Laravel Application

- **وظيفتها:** تدخل request في دورة HTTP وترسل/تجهز response.

- **المدخلات — Arguments:** Request object.

- **الناتج/الأثر — Return / effect:** الأثر معالجة الطلب؛ ليست قراءة products وحدها.

- **أول موضع هنا:** السطر 20.

### Request::capture

- **جاية منين؟** Laravel Request static

- **وظيفتها:** تلتقط الطلب الحالي من بيئة PHP.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** Request object.

- **أول موضع هنا:** السطر 20.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** use / استيراد الاسم `Illuminate\Foundation\Application` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 4:** use / استيراد الاسم `Illuminate\Http\Request` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `define(...)`: تعرّف Constant باسم تختاره وقت التشغيل؛ الثابت مش متغير يبدأ بـ$ ومش هتغيّر قيمته بعد تعريفه. زي تعريف LARAVEL_START لوقت بداية الطلب. مدخلاتها: constant_name: اسم الثابت كنص، ثم value: قيمته. في PHP 8 أسماء الثوابت case-sensitive؛ ما نطلبش وضع case-insensitive القديم. العائد/الأثر: true عند نجاح التعريف أو false عند الفشل؛ إعادة تعريف ثابت موجود تصدر warning ولا تستبدل قيمته.؛ `microtime(...)`: تجيب الوقت الحالي بالثواني من Unix epoch ومعاه جزء عشري دقيق؛ تنفع نسجل البداية ونطرحها من النهاية لقياس الزمن. دي مش sleep ولا مؤقت بيكرر كود. مدخلاتها: as_float اختياري: true يرجّع رقمًا، وfalse الافتراضية ترجع النص بالشكل الخاص microseconds seconds. العائد/الأثر: float بالثواني لما نكتب microtime(true)، أو string بالشكل الافتراضي. الفرق بين قراءتين بالـfloat مدة بالثواني.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 8:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

### السطور 9–16

```php
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

// Bootstrap Laravel and handle the request...
```

**السطر 9:** if تختبر الشرط `file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 10:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 11:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 13:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 14:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 16:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

### السطور 17–21

```php
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());

```

**السطر 17:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 18:** Assignment / إسناد: احسب `require_once __DIR__.'/../bootstrap/app.php'` الأول وخزّن النتيجة في `$app`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 20:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$app->handleRequest(...)`: تدخل request في دورة HTTP وترسل/تجهز response. مدخلاتها: Request object. العائد/الأثر: الأثر معالجة الطلب؛ ليست قراءة products وحدها.؛ `Request::capture(...)`: تلتقط الطلب الحالي من بيئة PHP. مدخلاتها: بدون arguments. العائد/الأثر: Request object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
