# artisan

[فهرس كل الأكواد](../../16-all-project-source.md)

المشروع: `autocare-booking` · الملف: `artisan` · 19 سطر.

**وظيفة الملف:** ملف مصدر كامل من المشروع. استخدم الروابط والتعريفات أدناه لتتبّع المدخلات والتنفيذ والناتج؛ لا تلصق أجزاءه فوق ملف مختلف بدون سياق.

**نوعه:** source / مصدر. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../autocare-booking/artisan). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
#!/usr/bin/env php
<?php

use Illuminate\Foundation\Application;
use Symfony\Component\Console\Input\ArgvInput;

define('LARAVEL_START', microtime(true));

// Register the Composer autoloader...
require __DIR__.'/vendor/autoload.php';

// Bootstrap Laravel and handle the command...
/** @var Application $app */
$app = require_once __DIR__.'/bootstrap/app.php';

$status = $app->handleCommand(new ArgvInput);

exit($status);
```

</details>

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### define

- **جاية منين؟** PHP built-in function

- **وظيفتها:** تعرّف Constant باسم تختاره وقت التشغيل؛ الثابت مش متغير يبدأ بـ$ ومش هتغيّر قيمته بعد تعريفه. زي تعريف LARAVEL_START لوقت بداية الطلب.

- **المدخلات — Arguments:** constant_name: اسم الثابت كنص، ثم value: قيمته. في PHP 8 أسماء الثوابت case-sensitive؛ ما نطلبش وضع case-insensitive القديم.

- **الناتج/الأثر — Return / effect:** true عند نجاح التعريف أو false عند الفشل؛ إعادة تعريف ثابت موجود تصدر warning ولا تستبدل قيمته.

- **أول موضع هنا:** السطر 7.

### microtime

- **جاية منين؟** PHP built-in time function

- **وظيفتها:** تجيب الوقت الحالي بالثواني من Unix epoch ومعاه جزء عشري دقيق؛ تنفع نسجل البداية ونطرحها من النهاية لقياس الزمن. دي مش sleep ولا مؤقت بيكرر كود.

- **المدخلات — Arguments:** as_float اختياري: true يرجّع رقمًا، وfalse الافتراضية ترجع النص بالشكل الخاص microseconds seconds.

- **الناتج/الأثر — Return / effect:** float بالثواني لما نكتب microtime(true)، أو string بالشكل الافتراضي. الفرق بين قراءتين بالـfloat مدة بالثواني.

- **أول موضع هنا:** السطر 7.

### $app->handleCommand

- **جاية منين؟** Laravel Application

- **وظيفتها:** تعالج أمر CLI المكتوب في terminal.

- **المدخلات — Arguments:** Console input.

- **الناتج/الأثر — Return / effect:** exit status كرقم.

- **أول موضع هنا:** السطر 16.

### exit

- **جاية منين؟** PHP language construct في PHP 8.2؛ أصبحت function في PHP 8.4

- **وظيفتها:** تنهي تنفيذ السكربت الحالي؛ أي سطور عادية بعدها مش هتكمل. لو بعتلها رسالة نصية تطبعها ثم تتوقف. مش مجرد خروج من function زي return.

- **المدخلات — Arguments:** status اختياري: string للرسالة أو int لكود خروج العملية. exit; بدون قيمة تنهي السكربت أيضًا.

- **الناتج/الأثر — Return / effect:** لا ترجع لاستكمال السطر التالي — never. shutdown functions وdestructors قد تعمل؛ مش معناها إن كل إجراءات الإغلاق تُلغى.

- **أول موضع هنا:** السطر 18.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
#!/usr/bin/env php
<?php

use Illuminate\Foundation\Application;
use Symfony\Component\Console\Input\ArgvInput;

define('LARAVEL_START', microtime(true));

```

**السطر 1:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 2:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 4:** use / استيراد الاسم `Illuminate\Foundation\Application` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 5:** use / استيراد الاسم `Symfony\Component\Console\Input\ArgvInput` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 7:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `define(...)`: تعرّف Constant باسم تختاره وقت التشغيل؛ الثابت مش متغير يبدأ بـ$ ومش هتغيّر قيمته بعد تعريفه. زي تعريف LARAVEL_START لوقت بداية الطلب. مدخلاتها: constant_name: اسم الثابت كنص، ثم value: قيمته. في PHP 8 أسماء الثوابت case-sensitive؛ ما نطلبش وضع case-insensitive القديم. العائد/الأثر: true عند نجاح التعريف أو false عند الفشل؛ إعادة تعريف ثابت موجود تصدر warning ولا تستبدل قيمته.؛ `microtime(...)`: تجيب الوقت الحالي بالثواني من Unix epoch ومعاه جزء عشري دقيق؛ تنفع نسجل البداية ونطرحها من النهاية لقياس الزمن. دي مش sleep ولا مؤقت بيكرر كود. مدخلاتها: as_float اختياري: true يرجّع رقمًا، وfalse الافتراضية ترجع النص بالشكل الخاص microseconds seconds. العائد/الأثر: float بالثواني لما نكتب microtime(true)، أو string بالشكل الافتراضي. الفرق بين قراءتين بالـfloat مدة بالثواني.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 9–16

```php
// Register the Composer autoloader...
require __DIR__.'/vendor/autoload.php';

// Bootstrap Laravel and handle the command...
/** @var Application $app */
$app = require_once __DIR__.'/bootstrap/app.php';

$status = $app->handleCommand(new ArgvInput);
```

**السطر 9:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 10:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 12:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 13:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 14:** Assignment / إسناد: احسب `require_once __DIR__.'/bootstrap/app.php'` الأول وخزّن النتيجة في `$app`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 16:** Assignment / إسناد: احسب `$app->handleCommand(new ArgvInput)` الأول وخزّن النتيجة في `$status`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

### السطور 17–19

```php

exit($status);

```

**السطر 18:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `exit(...)`: تنهي تنفيذ السكربت الحالي؛ أي سطور عادية بعدها مش هتكمل. لو بعتلها رسالة نصية تطبعها ثم تتوقف. مش مجرد خروج من function زي return. مدخلاتها: status اختياري: string للرسالة أو int لكود خروج العملية. exit; بدون قيمة تنهي السكربت أيضًا. العائد/الأثر: لا ترجع لاستكمال السطر التالي — never. shutdown functions وdestructors قد تعمل؛ مش معناها إن كل إجراءات الإغلاق تُلغى.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
