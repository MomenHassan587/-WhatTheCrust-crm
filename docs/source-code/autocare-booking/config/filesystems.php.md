# config/filesystems.php

[فهرس كل الأكواد](../../../16-all-project-source.md)

المشروع: `autocare-booking` · الملف: `config/filesystems.php` · 81 سطر.

**وظيفة الملف:** ملف إعداد Laravel: يعيد array تضبط خدمة حسب environment/defaults. الإعداد مش تنفيذ عملية طلب مباشرة؛ لا نعرض .env الفعلية.

**نوعه:** starter / إعداد أو ملف أصلي من framework. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../autocare-booking/config/filesystems.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Filesystem Disk
    |--------------------------------------------------------------------------
    |
    | Here you may specify the default filesystem disk that should be used
    | by the framework. The "local" disk, as well as a variety of cloud
    | based disks are available to your application for file storage.
    |
    */

    'default' => env('FILESYSTEM_DISK', 'local'),

    /*
    |--------------------------------------------------------------------------
    | Filesystem Disks
    |--------------------------------------------------------------------------
    |
    | Below you may configure as many filesystem disks as necessary, and you
    | may even configure multiple disks for the same driver. Examples for
    | most supported storage drivers are configured here for reference.
    |
    | Supported drivers: "local", "ftp", "sftp", "s3"
    |
    */

    'disks' => [

        'local' => [
            'driver' => 'local',
            'root' => storage_path('app/private'),
            'serve' => true,
            'throw' => false,
            'report' => false,
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => rtrim(env('APP_URL', 'http://localhost'), '/').'/storage',
            'visibility' => 'public',
            'throw' => false,
            'report' => false,
        ],

        's3' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION'),
            'bucket' => env('AWS_BUCKET'),
            'url' => env('AWS_URL'),
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
            'throw' => false,
            'report' => false,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Symbolic Links
    |--------------------------------------------------------------------------
    |
    | Here you may configure the symbolic links that will be created when the
    | `storage:link` Artisan command is executed. The array keys should be
    | the locations of the links and the values should be their targets.
    |
    */

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],

];
```

</details>

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### env

- **جاية منين؟** Laravel helper

- **وظيفتها:** اقرأ قيمة متغير البيئة أو default؛ تستعمل لإعداد التطبيق، ومش وسيلة قراءة بيانات form. مع config cache تُقرأ الإعدادات عادة من config بدل env داخل business code.

- **المدخلات — Arguments:** اسم متغير string ثم default اختيارية؛ لا تطبع قيم password أو مفاتيح الدفع في المذكرات.

- **الناتج/الأثر — Return / effect:** قيمة متغير البيئة المحوّلة وفق Laravel، أو default لو غائب؛ ممكن string أو bool أو null.

- **أول موضع هنا:** السطر 58.

- **مثال:** env('ADMIN_EMAIL', 'admin@whatthecrust.test')

### storage_path

- **جاية منين؟** Laravel path helper

- **وظيفتها:** ابنِ مسار filesystem داخل storage؛ لا ينشئ symlink ولا ينشر الملف تلقائيًا.

- **المدخلات — Arguments:** مسار نسبي اختياري مثل app/public أو logs.

- **الناتج/الأثر — Return / effect:** absolute filesystem path string.

- **أول موضع هنا:** السطر 77.

- **مثال:** storage_path('app/public')

### rtrim

- **جاية منين؟** PHP built-in string function

- **وظيفتها:** تشيل أحرفًا من نهاية النص فقط؛ غالبًا مسافات أو / من آخر base URL. قائمة الأحرف character mask، مش كلمة كاملة لازم تتطابق.

- **المدخلات — Arguments:** string، وcharacters اختيارية تحدد الأحرف المحذوفة؛ الافتراضي whitespace محددة في PHP.

- **الناتج/الأثر — Return / effect:** string جديدة بعد القص من اليمين؛ الأصل لا يتعدل لمجرد الاستدعاء.

- **أول موضع هنا:** السطر 44.

### public_path

- **جاية منين؟** Laravel path helper

- **وظيفتها:** ابنِ مسار filesystem مطلق داخل public للكتابة أو القراءة المحلية؛ مختلف عن URL التي تبدأ /images.

- **المدخلات — Arguments:** مسار نسبي اختياري داخل public.

- **الناتج/الأثر — Return / effect:** absolute filesystem path string، مش public URL.

- **أول موضع هنا:** السطر 77.

- **مثال:** public_path('images/menu/admin')

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Filesystem Disk
    |--------------------------------------------------------------------------
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** return تعيد array القيم التالية. في ملف config دي إعدادات يستلمها Laravel وقت تحميل الإعداد؛ في method فهي ناتج يرجع للكود اللي ناداها. مش JSON response إلا لو بنينا response صراحة.

**السطر 5:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 6:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 7:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 8:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 9–16

```php
    |
    | Here you may specify the default filesystem disk that should be used
    | by the framework. The "local" disk, as well as a variety of cloud
    | based disks are available to your application for file storage.
    |
    */

    'default' => env('FILESYSTEM_DISK', 'local'),
```

**السطر 9:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 10:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 11:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 12:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 13:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 14:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 16:** PHP array entry: المفتاح `default` مرتبط بالقيمة `env('FILESYSTEM_DISK', 'local')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 17–24

```php

    /*
    |--------------------------------------------------------------------------
    | Filesystem Disks
    |--------------------------------------------------------------------------
    |
    | Below you may configure as many filesystem disks as necessary, and you
    | may even configure multiple disks for the same driver. Examples for
```

**السطر 18:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 19:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 20:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 21:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 22:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 23:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 24:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 25–32

```php
    | most supported storage drivers are configured here for reference.
    |
    | Supported drivers: "local", "ftp", "sftp", "s3"
    |
    */

    'disks' => [

```

**السطر 25:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 26:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 27:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 28:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 29:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 31:** PHP array entry: المفتاح `disks` مرتبط بالقيمة `[`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 33–40

```php
        'local' => [
            'driver' => 'local',
            'root' => storage_path('app/private'),
            'serve' => true,
            'throw' => false,
            'report' => false,
        ],

```

**السطر 33:** PHP array entry: المفتاح `local` مرتبط بالقيمة `[`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 34:** PHP array entry: المفتاح `driver` مرتبط بالقيمة `'local'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 35:** PHP array entry: المفتاح `root` مرتبط بالقيمة `storage_path('app/private')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 36:** PHP array entry: المفتاح `serve` مرتبط بالقيمة `true`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 37:** PHP array entry: المفتاح `throw` مرتبط بالقيمة `false`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 38:** PHP array entry: المفتاح `report` مرتبط بالقيمة `false`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 39:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 41–48

```php
        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => rtrim(env('APP_URL', 'http://localhost'), '/').'/storage',
            'visibility' => 'public',
            'throw' => false,
            'report' => false,
        ],
```

**السطر 41:** PHP array entry: المفتاح `public` مرتبط بالقيمة `[`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 42:** PHP array entry: المفتاح `driver` مرتبط بالقيمة `'local'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 43:** PHP array entry: المفتاح `root` مرتبط بالقيمة `storage_path('app/public')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 44:** PHP array entry: المفتاح `url` مرتبط بالقيمة `rtrim(env('APP_URL', 'http://localhost'), '/').'/storage'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 45:** PHP array entry: المفتاح `visibility` مرتبط بالقيمة `'public'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 46:** PHP array entry: المفتاح `throw` مرتبط بالقيمة `false`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 47:** PHP array entry: المفتاح `report` مرتبط بالقيمة `false`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 48:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 49–56

```php

        's3' => [
            'driver' => 's3',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION'),
            'bucket' => env('AWS_BUCKET'),
            'url' => env('AWS_URL'),
```

**السطر 50:** PHP array entry: المفتاح `s3` مرتبط بالقيمة `[`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 51:** PHP array entry: المفتاح `driver` مرتبط بالقيمة `'s3'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 52:** PHP array entry: المفتاح `key` مرتبط بالقيمة `env('AWS_ACCESS_KEY_ID')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 53:** PHP array entry: المفتاح `secret` مرتبط بالقيمة `env('AWS_SECRET_ACCESS_KEY')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 54:** PHP array entry: المفتاح `region` مرتبط بالقيمة `env('AWS_DEFAULT_REGION')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 55:** PHP array entry: المفتاح `bucket` مرتبط بالقيمة `env('AWS_BUCKET')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 56:** PHP array entry: المفتاح `url` مرتبط بالقيمة `env('AWS_URL')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 57–64

```php
            'endpoint' => env('AWS_ENDPOINT'),
            'use_path_style_endpoint' => env('AWS_USE_PATH_STYLE_ENDPOINT', false),
            'throw' => false,
            'report' => false,
        ],

    ],

```

**السطر 57:** PHP array entry: المفتاح `endpoint` مرتبط بالقيمة `env('AWS_ENDPOINT')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 58:** PHP array entry: المفتاح `use_path_style_endpoint` مرتبط بالقيمة `env('AWS_USE_PATH_STYLE_ENDPOINT', false)`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 59:** PHP array entry: المفتاح `throw` مرتبط بالقيمة `false`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 60:** PHP array entry: المفتاح `report` مرتبط بالقيمة `false`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 61:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 63:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 65–72

```php
    /*
    |--------------------------------------------------------------------------
    | Symbolic Links
    |--------------------------------------------------------------------------
    |
    | Here you may configure the symbolic links that will be created when the
    | `storage:link` Artisan command is executed. The array keys should be
    | the locations of the links and the values should be their targets.
```

**السطر 65:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 66:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 67:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 68:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 69:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 70:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 71:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 72:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 73–80

```php
    |
    */

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],

];
```

**السطر 73:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 74:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 76:** PHP array entry: المفتاح `links` مرتبط بالقيمة `[`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 77:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `public_path(...)`: ابنِ مسار filesystem مطلق داخل public للكتابة أو القراءة المحلية؛ مختلف عن URL التي تبدأ /images. مدخلاتها: مسار نسبي اختياري داخل public. العائد/الأثر: absolute filesystem path string، مش public URL.؛ `storage_path(...)`: ابنِ مسار filesystem داخل storage؛ لا ينشئ symlink ولا ينشر الملف تلقائيًا. مدخلاتها: مسار نسبي اختياري مثل app/public أو logs. العائد/الأثر: absolute filesystem path string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 78:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 80:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
