# scripts/export-demo-catalog.php

[فهرس كل الأكواد](../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `scripts/export-demo-catalog.php` · 15 سطر.

**وظيفة الملف:** ملف مصدر كامل من المشروع. استخدم الروابط والتعريفات أدناه لتتبّع المدخلات والتنفيذ والناتج؛ لا تلصق أجزاءه فوق ملف مختلف بدون سياق.

**نوعه:** source / مصدر. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../scripts/export-demo-catalog.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

require __DIR__.'/../vendor/autoload.php';
$app = require __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Export public menu fields only. Never export users, orders, credentials, or .env.
$response = app(App\Http\Controllers\Api\MenuController::class)->index();
$payload = $response->getData(true);
if (empty($payload['branches']) || empty($payload['items'])) {
    throw new RuntimeException('Seed the menu before exporting the demo catalog.');
}
file_put_contents(__DIR__.'/../resources/js/demo/catalog.json', json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR).PHP_EOL);
echo 'Exported public catalog: '.count($payload['items']).' products.'.PHP_EOL;
```

</details>

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### $app->make

- **جاية منين؟** Laravel Factory

- **وظيفتها:** تجهز model(s) في الذاكرة.

- **المدخلات — Arguments:** attributes اختيارية.

- **الناتج/الأثر — Return / effect:** model/collection بدون حفظ DB.

- **أول موضع هنا:** السطر 5.

### ->bootstrap

- **جاية منين؟** Laravel Console Kernel

- **وظيفتها:** تجهز التطبيق وخدماته من CLI.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** تهيئة التطبيق؛ مش مكتبة CSS Bootstrap.

- **أول موضع هنا:** السطر 5.

### ->index

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** تضيف index لتحسين الوصول وفق query.

- **المدخلات — Arguments:** column(s) وname اختيارية.

- **الناتج/الأثر — Return / effect:** IndexDefinition؛ مش صف بيانات.

- **أول موضع هنا:** السطر 8.

### app

- **جاية منين؟** Laravel helper / Service Container

- **وظيفتها:** هات container أو حل dependency مسجلة؛ app('migrator') في readiness تجيب خدمة المهاجرات، مش تشغل migration وحدها.

- **المدخلات — Arguments:** اسم خدمة أو class string اختياري، ثم array parameters اختيارية.

- **الناتج/الأثر — Return / effect:** Application container بدون اسم، أو instance الخدمة المطلوبة؛ يفشل لو الاعتماد لا يمكن حله.

- **أول موضع هنا:** السطر 8.

- **مثال:** $migrator = app('migrator');

### $response->getData

- **جاية منين؟** Laravel JsonResponse

- **وظيفتها:** تقرأ JSON data الموجودة في الاستجابة.

- **المدخلات — Arguments:** assoc اختيارية.

- **الناتج/الأثر — Return / effect:** decoded object أو array؛ لا تنادي API ثانية.

- **أول موضع هنا:** السطر 9.

### empty

- **جاية منين؟** PHP language construct، مش method

- **وظيفتها:** تسأل هل القيمة فاضية بالمعنى الواسع في PHP. تعتبر غير الموجود وnull وfalse و0 والنص0 والنص الفاضي و[] كلها empty؛ لذلك ما تنفعش تميّز صفرًا صحيحًا عن حقل ناقص.

- **المدخلات — Arguments:** متغير أو تعبير تفحص قيمته. فحص متغير غير معرّف لا يصدر undefined-variable warning هنا.

- **الناتج/الأثر — Return / effect:** Boolean: true لو القيمة empty، false لغير كده. لا تمسح المتغير ولا تغيره.

- **أول موضع هنا:** السطر 10.

### file_put_contents

- **جاية منين؟** PHP built-in filesystem write function

- **وظيفتها:** تكتب بيانات في ملف؛ لو موجود تستبدل محتواه افتراضيًا، ولو مش موجود تحاول تنشئه. FILE_APPEND تلحق بدل الاستبدال، وLOCK_EX قفل حصري أثناء الكتابة.

- **المدخلات — Arguments:** filename: مسار مضبوط، data: المحتوى، flags اختيارية، context اختياري. لا تنشئ الفولدرات الآباء تلقائيًا.

- **الناتج/الأثر — Return / effect:** int عدد البايتات المكتوبة، أو false عند الفشل مع warning. صفر بايت كتابة ناجحة محتملة، فافحص === false بدل !result.

- **أول موضع هنا:** السطر 13.

### json_encode

- **جاية منين؟** PHP built-in JSON serialization function

- **وظيفتها:** تحوّل بيانات PHP إلى JSON string لإرسالها أو حفظها. ليست تشفيرًا، وكل string محتاجة UTF-8 صالحة أو flags معالجة مناسبة.

- **المدخلات — Arguments:** value، flags اختياري مثل JSON_UNESCAPED_UNICODE أو JSON_THROW_ON_ERROR، وdepth اختياري افتراضيه512.

- **الناتج/الأثر — Return / effect:** string عند النجاح أو false عند فشل الترميز عادة. مع JSON_THROW_ON_ERROR يرمي JsonException بدل false لأخطاء JSON؛ flags أخرى قد تنتج مخرجات جزئية.

- **أول موضع هنا:** السطر 13.

### count

- **جاية منين؟** PHP built-in عند count(...) وليس ->count()

- **وظيفتها:** عد عناصر array أو Countable في الذاكرة؛ مختلف عن QueryBuilder->count الذي يجري aggregate SQL.

- **المدخلات — Arguments:** array أو Countable ثم mode اختيارية.

- **الناتج/الأثر — Return / effect:** int عدد العناصر.

- **أول موضع هنا:** السطر 14.

- **مثال:** count($pending)

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

require __DIR__.'/../vendor/autoload.php';
$app = require __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Export public menu fields only. Never export users, orders, credentials, or .env.
$response = app(App\Http\Controllers\Api\MenuController::class)->index();
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 4:** Assignment / إسناد: احسب `require __DIR__.'/../bootstrap/app.php'` الأول وخزّن النتيجة في `$app`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 5:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$app->make(...)`: تجهز model(s) في الذاكرة. مدخلاتها: attributes اختيارية. العائد/الأثر: model/collection بدون حفظ DB.؛ `->bootstrap(...)`: تجهز التطبيق وخدماته من CLI. مدخلاتها: بدون arguments. العائد/الأثر: تهيئة التطبيق؛ مش مكتبة CSS Bootstrap.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 7:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 8:** Assignment / إسناد: احسب `app(App\Http\Controllers\Api\MenuController::class)->index()` الأول وخزّن النتيجة في `$response`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

### السطور 9–15

```php
$payload = $response->getData(true);
if (empty($payload['branches']) || empty($payload['items'])) {
    throw new RuntimeException('Seed the menu before exporting the demo catalog.');
}
file_put_contents(__DIR__.'/../resources/js/demo/catalog.json', json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR).PHP_EOL);
echo 'Exported public catalog: '.count($payload['items']).' products.'.PHP_EOL;

```

**السطر 9:** Assignment / إسناد: احسب `$response->getData(true)` الأول وخزّن النتيجة في `$payload`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 10:** if تختبر الشرط `empty($payload['branches']) || empty($payload['items'])`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 11:** throw ترمي الاستثناء `new RuntimeException('Seed the menu before exporting the demo catalog.');` وتوقف المسار العادي. Laravel exception handler أو catch المناسبة تتعامل معاه؛ مش مجرد رسالة بتنطبع وتكمّل التنفيذ.

**السطر 12:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 13:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `file_put_contents(...)`: تكتب بيانات في ملف؛ لو موجود تستبدل محتواه افتراضيًا، ولو مش موجود تحاول تنشئه. FILE_APPEND تلحق بدل الاستبدال، وLOCK_EX قفل حصري أثناء الكتابة. مدخلاتها: filename: مسار مضبوط، data: المحتوى، flags اختيارية، context اختياري. لا تنشئ الفولدرات الآباء تلقائيًا. العائد/الأثر: int عدد البايتات المكتوبة، أو false عند الفشل مع warning. صفر بايت كتابة ناجحة محتملة، فافحص === false بدل !result.؛ `json_encode(...)`: تحوّل بيانات PHP إلى JSON string لإرسالها أو حفظها. ليست تشفيرًا، وكل string محتاجة UTF-8 صالحة أو flags معالجة مناسبة. مدخلاتها: value، flags اختياري مثل JSON_UNESCAPED_UNICODE أو JSON_THROW_ON_ERROR، وdepth اختياري افتراضيه512. العائد/الأثر: string عند النجاح أو false عند فشل الترميز عادة. مع JSON_THROW_ON_ERROR يرمي JsonException بدل false لأخطاء JSON؛ flags أخرى قد تنتج مخرجات جزئية.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 14:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `count(...)`: عد عناصر array أو Countable في الذاكرة؛ مختلف عن QueryBuilder->count الذي يجري aggregate SQL. مدخلاتها: array أو Countable ثم mode اختيارية. العائد/الأثر: int عدد العناصر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
