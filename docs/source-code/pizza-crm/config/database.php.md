# config/database.php

[فهرس كل الأكواد](../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `config/database.php` · 185 سطر.

**وظيفة الملف:** ملف إعداد Laravel: يعيد array تضبط خدمة حسب environment/defaults. الإعداد مش تنفيذ عملية طلب مباشرة؛ لا نعرض .env الفعلية.

**نوعه:** starter / إعداد أو ملف أصلي من framework. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../config/database.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

use Illuminate\Support\Str;
use Pdo\Mysql;

return [

    /*
    |--------------------------------------------------------------------------
    | Default Database Connection Name
    |--------------------------------------------------------------------------
    |
    | Here you may specify which of the database connections below you wish
    | to use as your default connection for database operations. This is
    | the connection which will be utilized unless another connection
    | is explicitly specified when you execute a query / statement.
    |
    */

    'default' => env('DB_CONNECTION', 'sqlite'),

    /*
    |--------------------------------------------------------------------------
    | Database Connections
    |--------------------------------------------------------------------------
    |
    | Below are all of the database connections defined for your application.
    | An example configuration is provided for each database system which
    | is supported by Laravel. You're free to add / remove connections.
    |
    */

    'connections' => [

        'sqlite' => [
            'driver' => 'sqlite',
            'url' => env('DB_URL'),
            'database' => env('DB_DATABASE', database_path('database.sqlite')),
            'prefix' => '',
            'foreign_key_constraints' => env('DB_FOREIGN_KEYS', true),
            'busy_timeout' => null,
            'journal_mode' => null,
            'synchronous' => null,
            'transaction_mode' => 'DEFERRED',
        ],

        'mysql' => [
            'driver' => 'mysql',
            'url' => env('DB_URL'),
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '3306'),
            'database' => env('DB_DATABASE', 'laravel'),
            'username' => env('DB_USERNAME', 'root'),
            'password' => env('DB_PASSWORD', ''),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => env('DB_CHARSET', 'utf8mb4'),
            'collation' => env('DB_COLLATION', 'utf8mb4_unicode_ci'),
            'prefix' => '',
            'prefix_indexes' => true,
            'strict' => true,
            'engine' => null,
            'options' => extension_loaded('pdo_mysql') ? array_filter([
                (PHP_VERSION_ID >= 80500 ? Mysql::ATTR_SSL_CA : PDO::MYSQL_ATTR_SSL_CA) => env('MYSQL_ATTR_SSL_CA'),
            ]) : [],
        ],

        'mariadb' => [
            'driver' => 'mariadb',
            'url' => env('DB_URL'),
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '3306'),
            'database' => env('DB_DATABASE', 'laravel'),
            'username' => env('DB_USERNAME', 'root'),
            'password' => env('DB_PASSWORD', ''),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => env('DB_CHARSET', 'utf8mb4'),
            'collation' => env('DB_COLLATION', 'utf8mb4_unicode_ci'),
            'prefix' => '',
            'prefix_indexes' => true,
            'strict' => true,
            'engine' => null,
            'options' => extension_loaded('pdo_mysql') ? array_filter([
                (PHP_VERSION_ID >= 80500 ? Mysql::ATTR_SSL_CA : PDO::MYSQL_ATTR_SSL_CA) => env('MYSQL_ATTR_SSL_CA'),
            ]) : [],
        ],

        'pgsql' => [
            'driver' => 'pgsql',
            'url' => env('DB_URL'),
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '5432'),
            'database' => env('DB_DATABASE', 'laravel'),
            'username' => env('DB_USERNAME', 'root'),
            'password' => env('DB_PASSWORD', ''),
            'charset' => env('DB_CHARSET', 'utf8'),
            'prefix' => '',
            'prefix_indexes' => true,
            'search_path' => 'public',
            'sslmode' => env('DB_SSLMODE', 'prefer'),
        ],

        'sqlsrv' => [
            'driver' => 'sqlsrv',
            'url' => env('DB_URL'),
            'host' => env('DB_HOST', 'localhost'),
            'port' => env('DB_PORT', '1433'),
            'database' => env('DB_DATABASE', 'laravel'),
            'username' => env('DB_USERNAME', 'root'),
            'password' => env('DB_PASSWORD', ''),
            'charset' => env('DB_CHARSET', 'utf8'),
            'prefix' => '',
            'prefix_indexes' => true,
            // 'encrypt' => env('DB_ENCRYPT', 'yes'),
            // 'trust_server_certificate' => env('DB_TRUST_SERVER_CERTIFICATE', 'false'),
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Migration Repository Table
    |--------------------------------------------------------------------------
    |
    | This table keeps track of all the migrations that have already run for
    | your application. Using this information, we can determine which of
    | the migrations on disk haven't actually been run on the database.
    |
    */

    'migrations' => [
        'table' => 'migrations',
        'update_date_on_publish' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Redis Databases
    |--------------------------------------------------------------------------
    |
    | Redis is an open source, fast, and advanced key-value store that also
    | provides a richer body of commands than a typical key-value system
    | such as Memcached. You may define your connection settings here.
    |
    */

    'redis' => [

        'client' => env('REDIS_CLIENT', 'phpredis'),

        'options' => [
            'cluster' => env('REDIS_CLUSTER', 'redis'),
            'prefix' => env('REDIS_PREFIX', Str::slug((string) env('APP_NAME', 'laravel')).'-database-'),
            'persistent' => env('REDIS_PERSISTENT', false),
        ],

        'default' => [
            'url' => env('REDIS_URL'),
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'username' => env('REDIS_USERNAME'),
            'password' => env('REDIS_PASSWORD'),
            'port' => env('REDIS_PORT', '6379'),
            'database' => env('REDIS_DB', '0'),
            'max_retries' => env('REDIS_MAX_RETRIES', 3),
            'backoff_algorithm' => env('REDIS_BACKOFF_ALGORITHM', 'decorrelated_jitter'),
            'backoff_base' => env('REDIS_BACKOFF_BASE', 100),
            'backoff_cap' => env('REDIS_BACKOFF_CAP', 1000),
        ],

        'cache' => [
            'url' => env('REDIS_URL'),
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'username' => env('REDIS_USERNAME'),
            'password' => env('REDIS_PASSWORD'),
            'port' => env('REDIS_PORT', '6379'),
            'database' => env('REDIS_CACHE_DB', '1'),
            'max_retries' => env('REDIS_MAX_RETRIES', 3),
            'backoff_algorithm' => env('REDIS_BACKOFF_ALGORITHM', 'decorrelated_jitter'),
            'backoff_base' => env('REDIS_BACKOFF_BASE', 100),
            'backoff_cap' => env('REDIS_BACKOFF_CAP', 1000),
        ],

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

- **أول موضع هنا:** السطر 179.

- **مثال:** env('ADMIN_EMAIL', 'admin@whatthecrust.test')

### database_path

- **جاية منين؟** Laravel path helper

- **وظيفتها:** ابنِ مسار filesystem داخل database؛ readiness تستخدمه لتحديد مجلد ملفات migrations بدون تشغيلها.

- **المدخلات — Arguments:** مسار نسبي اختياري مثل migrations.

- **الناتج/الأثر — Return / effect:** absolute filesystem path string.

- **أول موضع هنا:** السطر 38.

- **مثال:** database_path('migrations')

### extension_loaded

- **جاية منين؟** PHP built-in extension inspection function

- **وظيفتها:** تسأل هل PHP Extension محمّلة في الـruntime الحالي؛ مثل gd لمعالجة الصور. لا تثبت المكتبة ولا تحملها بنفسها.

- **المدخلات — Arguments:** extension: اسم الإضافة كنص، مثل gd أو fileinfo.

- **الناتج/الأثر — Return / effect:** Boolean: true لو الإضافة محمّلة، false لو مش موجودة أو مش مفعّلة.

- **أول موضع هنا:** السطر 82.

### array_filter

- **جاية منين؟** PHP built-in array function

- **وظيفتها:** تعمل قائمة بالعناصر اللي شرط callback وافق عليها. لو مفيش callback، بتشيل القيم empty زي null وfalse وصفر والنص الفاضي والنص0. ما بتعيدش ترقيم المفاتيح تلقائيًا.

- **المدخلات — Arguments:** array، وcallback اختيارية، وmode اختياري لاختيار تمرير القيمة أو المفتاح أو الاثنين إلى callback.

- **الناتج/الأثر — Return / effect:** array جديدة بالمفاتيح الأصلية والعناصر المطابقة؛ ممكن تكون فاضية. callback الغلط أو نوع مدخل غير مناسب يسبب خطأ نوع.

- **أول موضع هنا:** السطر 82.

### Str::slug

- **جاية منين؟** Laravel Str

- **وظيفتها:** حوّل اسم المنتج أو الفرع إلى اسم مناسب للرابط/الملف مثل garlic-bread.

- **المدخلات — Arguments:** string name وseparator اختياري.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 152.

- **مثال:** Str::slug($name)

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

use Illuminate\Support\Str;
use Pdo\Mysql;

return [

    /*
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** use / استيراد الاسم `Illuminate\Support\Str` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 4:** use / استيراد الاسم `Pdo\Mysql` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** return تعيد array القيم التالية. في ملف config دي إعدادات يستلمها Laravel وقت تحميل الإعداد؛ في method فهي ناتج يرجع للكود اللي ناداها. مش JSON response إلا لو بنينا response صراحة.

**السطر 8:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

### السطور 9–16

```php
    |--------------------------------------------------------------------------
    | Default Database Connection Name
    |--------------------------------------------------------------------------
    |
    | Here you may specify which of the database connections below you wish
    | to use as your default connection for database operations. This is
    | the connection which will be utilized unless another connection
    | is explicitly specified when you execute a query / statement.
```

**السطر 9:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 10:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 11:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 12:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 13:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 14:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 15:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 16:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 17–24

```php
    |
    */

    'default' => env('DB_CONNECTION', 'sqlite'),

    /*
    |--------------------------------------------------------------------------
    | Database Connections
```

**السطر 17:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 18:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 20:** PHP array entry: المفتاح `default` مرتبط بالقيمة `env('DB_CONNECTION', 'sqlite')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 22:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 23:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 24:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 25–32

```php
    |--------------------------------------------------------------------------
    |
    | Below are all of the database connections defined for your application.
    | An example configuration is provided for each database system which
    | is supported by Laravel. You're free to add / remove connections.
    |
    */

```

**السطر 25:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 26:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 27:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 28:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 29:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 30:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 31:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

### السطور 33–40

```php
    'connections' => [

        'sqlite' => [
            'driver' => 'sqlite',
            'url' => env('DB_URL'),
            'database' => env('DB_DATABASE', database_path('database.sqlite')),
            'prefix' => '',
            'foreign_key_constraints' => env('DB_FOREIGN_KEYS', true),
```

**السطر 33:** PHP array entry: المفتاح `connections` مرتبط بالقيمة `[`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 35:** PHP array entry: المفتاح `sqlite` مرتبط بالقيمة `[`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 36:** PHP array entry: المفتاح `driver` مرتبط بالقيمة `'sqlite'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 37:** PHP array entry: المفتاح `url` مرتبط بالقيمة `env('DB_URL')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 38:** PHP array entry: المفتاح `database` مرتبط بالقيمة `env('DB_DATABASE', database_path('database.sqlite'))`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 39:** PHP array entry: المفتاح `prefix` مرتبط بالقيمة `''`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 40:** PHP array entry: المفتاح `foreign_key_constraints` مرتبط بالقيمة `env('DB_FOREIGN_KEYS', true)`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 41–48

```php
            'busy_timeout' => null,
            'journal_mode' => null,
            'synchronous' => null,
            'transaction_mode' => 'DEFERRED',
        ],

        'mysql' => [
            'driver' => 'mysql',
```

**السطر 41:** PHP array entry: المفتاح `busy_timeout` مرتبط بالقيمة `null`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 42:** PHP array entry: المفتاح `journal_mode` مرتبط بالقيمة `null`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 43:** PHP array entry: المفتاح `synchronous` مرتبط بالقيمة `null`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 44:** PHP array entry: المفتاح `transaction_mode` مرتبط بالقيمة `'DEFERRED'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 45:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 47:** PHP array entry: المفتاح `mysql` مرتبط بالقيمة `[`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 48:** PHP array entry: المفتاح `driver` مرتبط بالقيمة `'mysql'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 49–56

```php
            'url' => env('DB_URL'),
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '3306'),
            'database' => env('DB_DATABASE', 'laravel'),
            'username' => env('DB_USERNAME', 'root'),
            'password' => env('DB_PASSWORD', ''),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => env('DB_CHARSET', 'utf8mb4'),
```

**السطر 49:** PHP array entry: المفتاح `url` مرتبط بالقيمة `env('DB_URL')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 50:** PHP array entry: المفتاح `host` مرتبط بالقيمة `env('DB_HOST', '127.0.0.1')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 51:** PHP array entry: المفتاح `port` مرتبط بالقيمة `env('DB_PORT', '3306')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 52:** PHP array entry: المفتاح `database` مرتبط بالقيمة `env('DB_DATABASE', 'laravel')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 53:** PHP array entry: المفتاح `username` مرتبط بالقيمة `env('DB_USERNAME', 'root')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 54:** PHP array entry: المفتاح `password` مرتبط بالقيمة `env('DB_PASSWORD', '')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 55:** PHP array entry: المفتاح `unix_socket` مرتبط بالقيمة `env('DB_SOCKET', '')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 56:** PHP array entry: المفتاح `charset` مرتبط بالقيمة `env('DB_CHARSET', 'utf8mb4')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 57–64

```php
            'collation' => env('DB_COLLATION', 'utf8mb4_unicode_ci'),
            'prefix' => '',
            'prefix_indexes' => true,
            'strict' => true,
            'engine' => null,
            'options' => extension_loaded('pdo_mysql') ? array_filter([
                (PHP_VERSION_ID >= 80500 ? Mysql::ATTR_SSL_CA : PDO::MYSQL_ATTR_SSL_CA) => env('MYSQL_ATTR_SSL_CA'),
            ]) : [],
```

**السطر 57:** PHP array entry: المفتاح `collation` مرتبط بالقيمة `env('DB_COLLATION', 'utf8mb4_unicode_ci')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 58:** PHP array entry: المفتاح `prefix` مرتبط بالقيمة `''`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 59:** PHP array entry: المفتاح `prefix_indexes` مرتبط بالقيمة `true`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 60:** PHP array entry: المفتاح `strict` مرتبط بالقيمة `true`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 61:** PHP array entry: المفتاح `engine` مرتبط بالقيمة `null`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 62:** PHP array entry: المفتاح `options` مرتبط بالقيمة `extension_loaded('pdo_mysql') ? array_filter([`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 63:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `env(...)`: اقرأ قيمة متغير البيئة أو default؛ تستعمل لإعداد التطبيق، ومش وسيلة قراءة بيانات form. مع config cache تُقرأ الإعدادات عادة من config بدل env داخل business code. مدخلاتها: اسم متغير string ثم default اختيارية؛ لا تطبع قيم password أو مفاتيح الدفع في المذكرات. العائد/الأثر: قيمة متغير البيئة المحوّلة وفق Laravel، أو default لو غائب؛ ممكن string أو bool أو null.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 64:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 65–72

```php
        ],

        'mariadb' => [
            'driver' => 'mariadb',
            'url' => env('DB_URL'),
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '3306'),
            'database' => env('DB_DATABASE', 'laravel'),
```

**السطر 65:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 67:** PHP array entry: المفتاح `mariadb` مرتبط بالقيمة `[`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 68:** PHP array entry: المفتاح `driver` مرتبط بالقيمة `'mariadb'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 69:** PHP array entry: المفتاح `url` مرتبط بالقيمة `env('DB_URL')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 70:** PHP array entry: المفتاح `host` مرتبط بالقيمة `env('DB_HOST', '127.0.0.1')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 71:** PHP array entry: المفتاح `port` مرتبط بالقيمة `env('DB_PORT', '3306')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 72:** PHP array entry: المفتاح `database` مرتبط بالقيمة `env('DB_DATABASE', 'laravel')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 73–80

```php
            'username' => env('DB_USERNAME', 'root'),
            'password' => env('DB_PASSWORD', ''),
            'unix_socket' => env('DB_SOCKET', ''),
            'charset' => env('DB_CHARSET', 'utf8mb4'),
            'collation' => env('DB_COLLATION', 'utf8mb4_unicode_ci'),
            'prefix' => '',
            'prefix_indexes' => true,
            'strict' => true,
```

**السطر 73:** PHP array entry: المفتاح `username` مرتبط بالقيمة `env('DB_USERNAME', 'root')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 74:** PHP array entry: المفتاح `password` مرتبط بالقيمة `env('DB_PASSWORD', '')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 75:** PHP array entry: المفتاح `unix_socket` مرتبط بالقيمة `env('DB_SOCKET', '')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 76:** PHP array entry: المفتاح `charset` مرتبط بالقيمة `env('DB_CHARSET', 'utf8mb4')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 77:** PHP array entry: المفتاح `collation` مرتبط بالقيمة `env('DB_COLLATION', 'utf8mb4_unicode_ci')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 78:** PHP array entry: المفتاح `prefix` مرتبط بالقيمة `''`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 79:** PHP array entry: المفتاح `prefix_indexes` مرتبط بالقيمة `true`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 80:** PHP array entry: المفتاح `strict` مرتبط بالقيمة `true`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 81–88

```php
            'engine' => null,
            'options' => extension_loaded('pdo_mysql') ? array_filter([
                (PHP_VERSION_ID >= 80500 ? Mysql::ATTR_SSL_CA : PDO::MYSQL_ATTR_SSL_CA) => env('MYSQL_ATTR_SSL_CA'),
            ]) : [],
        ],

        'pgsql' => [
            'driver' => 'pgsql',
```

**السطر 81:** PHP array entry: المفتاح `engine` مرتبط بالقيمة `null`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 82:** PHP array entry: المفتاح `options` مرتبط بالقيمة `extension_loaded('pdo_mysql') ? array_filter([`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 83:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `env(...)`: اقرأ قيمة متغير البيئة أو default؛ تستعمل لإعداد التطبيق، ومش وسيلة قراءة بيانات form. مع config cache تُقرأ الإعدادات عادة من config بدل env داخل business code. مدخلاتها: اسم متغير string ثم default اختيارية؛ لا تطبع قيم password أو مفاتيح الدفع في المذكرات. العائد/الأثر: قيمة متغير البيئة المحوّلة وفق Laravel، أو default لو غائب؛ ممكن string أو bool أو null.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 84:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 85:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 87:** PHP array entry: المفتاح `pgsql` مرتبط بالقيمة `[`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 88:** PHP array entry: المفتاح `driver` مرتبط بالقيمة `'pgsql'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 89–96

```php
            'url' => env('DB_URL'),
            'host' => env('DB_HOST', '127.0.0.1'),
            'port' => env('DB_PORT', '5432'),
            'database' => env('DB_DATABASE', 'laravel'),
            'username' => env('DB_USERNAME', 'root'),
            'password' => env('DB_PASSWORD', ''),
            'charset' => env('DB_CHARSET', 'utf8'),
            'prefix' => '',
```

**السطر 89:** PHP array entry: المفتاح `url` مرتبط بالقيمة `env('DB_URL')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 90:** PHP array entry: المفتاح `host` مرتبط بالقيمة `env('DB_HOST', '127.0.0.1')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 91:** PHP array entry: المفتاح `port` مرتبط بالقيمة `env('DB_PORT', '5432')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 92:** PHP array entry: المفتاح `database` مرتبط بالقيمة `env('DB_DATABASE', 'laravel')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 93:** PHP array entry: المفتاح `username` مرتبط بالقيمة `env('DB_USERNAME', 'root')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 94:** PHP array entry: المفتاح `password` مرتبط بالقيمة `env('DB_PASSWORD', '')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 95:** PHP array entry: المفتاح `charset` مرتبط بالقيمة `env('DB_CHARSET', 'utf8')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 96:** PHP array entry: المفتاح `prefix` مرتبط بالقيمة `''`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 97–104

```php
            'prefix_indexes' => true,
            'search_path' => 'public',
            'sslmode' => env('DB_SSLMODE', 'prefer'),
        ],

        'sqlsrv' => [
            'driver' => 'sqlsrv',
            'url' => env('DB_URL'),
```

**السطر 97:** PHP array entry: المفتاح `prefix_indexes` مرتبط بالقيمة `true`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 98:** PHP array entry: المفتاح `search_path` مرتبط بالقيمة `'public'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 99:** PHP array entry: المفتاح `sslmode` مرتبط بالقيمة `env('DB_SSLMODE', 'prefer')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 100:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 102:** PHP array entry: المفتاح `sqlsrv` مرتبط بالقيمة `[`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 103:** PHP array entry: المفتاح `driver` مرتبط بالقيمة `'sqlsrv'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 104:** PHP array entry: المفتاح `url` مرتبط بالقيمة `env('DB_URL')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 105–112

```php
            'host' => env('DB_HOST', 'localhost'),
            'port' => env('DB_PORT', '1433'),
            'database' => env('DB_DATABASE', 'laravel'),
            'username' => env('DB_USERNAME', 'root'),
            'password' => env('DB_PASSWORD', ''),
            'charset' => env('DB_CHARSET', 'utf8'),
            'prefix' => '',
            'prefix_indexes' => true,
```

**السطر 105:** PHP array entry: المفتاح `host` مرتبط بالقيمة `env('DB_HOST', 'localhost')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 106:** PHP array entry: المفتاح `port` مرتبط بالقيمة `env('DB_PORT', '1433')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 107:** PHP array entry: المفتاح `database` مرتبط بالقيمة `env('DB_DATABASE', 'laravel')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 108:** PHP array entry: المفتاح `username` مرتبط بالقيمة `env('DB_USERNAME', 'root')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 109:** PHP array entry: المفتاح `password` مرتبط بالقيمة `env('DB_PASSWORD', '')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 110:** PHP array entry: المفتاح `charset` مرتبط بالقيمة `env('DB_CHARSET', 'utf8')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 111:** PHP array entry: المفتاح `prefix` مرتبط بالقيمة `''`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 112:** PHP array entry: المفتاح `prefix_indexes` مرتبط بالقيمة `true`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 113–120

```php
            // 'encrypt' => env('DB_ENCRYPT', 'yes'),
            // 'trust_server_certificate' => env('DB_TRUST_SERVER_CERTIFICATE', 'false'),
        ],

    ],

    /*
    |--------------------------------------------------------------------------
```

**السطر 113:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 114:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 115:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 117:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 119:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 120:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 121–128

```php
    | Migration Repository Table
    |--------------------------------------------------------------------------
    |
    | This table keeps track of all the migrations that have already run for
    | your application. Using this information, we can determine which of
    | the migrations on disk haven't actually been run on the database.
    |
    */
```

**السطر 121:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 122:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 123:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 124:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 125:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 126:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 127:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 128:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

### السطور 129–136

```php

    'migrations' => [
        'table' => 'migrations',
        'update_date_on_publish' => true,
    ],

    /*
    |--------------------------------------------------------------------------
```

**السطر 130:** PHP array entry: المفتاح `migrations` مرتبط بالقيمة `[`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 131:** PHP array entry: المفتاح `table` مرتبط بالقيمة `'migrations'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 132:** PHP array entry: المفتاح `update_date_on_publish` مرتبط بالقيمة `true`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 133:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 135:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 136:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 137–144

```php
    | Redis Databases
    |--------------------------------------------------------------------------
    |
    | Redis is an open source, fast, and advanced key-value store that also
    | provides a richer body of commands than a typical key-value system
    | such as Memcached. You may define your connection settings here.
    |
    */
```

**السطر 137:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 138:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 139:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 140:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 141:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 142:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 143:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 144:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

### السطور 145–152

```php

    'redis' => [

        'client' => env('REDIS_CLIENT', 'phpredis'),

        'options' => [
            'cluster' => env('REDIS_CLUSTER', 'redis'),
            'prefix' => env('REDIS_PREFIX', Str::slug((string) env('APP_NAME', 'laravel')).'-database-'),
```

**السطر 146:** PHP array entry: المفتاح `redis` مرتبط بالقيمة `[`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 148:** PHP array entry: المفتاح `client` مرتبط بالقيمة `env('REDIS_CLIENT', 'phpredis')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 150:** PHP array entry: المفتاح `options` مرتبط بالقيمة `[`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 151:** PHP array entry: المفتاح `cluster` مرتبط بالقيمة `env('REDIS_CLUSTER', 'redis')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 152:** PHP array entry: المفتاح `prefix` مرتبط بالقيمة `env('REDIS_PREFIX', Str::slug((string) env('APP_NAME', 'laravel')).'-database-')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 153–160

```php
            'persistent' => env('REDIS_PERSISTENT', false),
        ],

        'default' => [
            'url' => env('REDIS_URL'),
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'username' => env('REDIS_USERNAME'),
            'password' => env('REDIS_PASSWORD'),
```

**السطر 153:** PHP array entry: المفتاح `persistent` مرتبط بالقيمة `env('REDIS_PERSISTENT', false)`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 154:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 156:** PHP array entry: المفتاح `default` مرتبط بالقيمة `[`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 157:** PHP array entry: المفتاح `url` مرتبط بالقيمة `env('REDIS_URL')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 158:** PHP array entry: المفتاح `host` مرتبط بالقيمة `env('REDIS_HOST', '127.0.0.1')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 159:** PHP array entry: المفتاح `username` مرتبط بالقيمة `env('REDIS_USERNAME')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 160:** PHP array entry: المفتاح `password` مرتبط بالقيمة `env('REDIS_PASSWORD')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 161–168

```php
            'port' => env('REDIS_PORT', '6379'),
            'database' => env('REDIS_DB', '0'),
            'max_retries' => env('REDIS_MAX_RETRIES', 3),
            'backoff_algorithm' => env('REDIS_BACKOFF_ALGORITHM', 'decorrelated_jitter'),
            'backoff_base' => env('REDIS_BACKOFF_BASE', 100),
            'backoff_cap' => env('REDIS_BACKOFF_CAP', 1000),
        ],

```

**السطر 161:** PHP array entry: المفتاح `port` مرتبط بالقيمة `env('REDIS_PORT', '6379')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 162:** PHP array entry: المفتاح `database` مرتبط بالقيمة `env('REDIS_DB', '0')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 163:** PHP array entry: المفتاح `max_retries` مرتبط بالقيمة `env('REDIS_MAX_RETRIES', 3)`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 164:** PHP array entry: المفتاح `backoff_algorithm` مرتبط بالقيمة `env('REDIS_BACKOFF_ALGORITHM', 'decorrelated_jitter')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 165:** PHP array entry: المفتاح `backoff_base` مرتبط بالقيمة `env('REDIS_BACKOFF_BASE', 100)`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 166:** PHP array entry: المفتاح `backoff_cap` مرتبط بالقيمة `env('REDIS_BACKOFF_CAP', 1000)`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 167:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 169–176

```php
        'cache' => [
            'url' => env('REDIS_URL'),
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'username' => env('REDIS_USERNAME'),
            'password' => env('REDIS_PASSWORD'),
            'port' => env('REDIS_PORT', '6379'),
            'database' => env('REDIS_CACHE_DB', '1'),
            'max_retries' => env('REDIS_MAX_RETRIES', 3),
```

**السطر 169:** PHP array entry: المفتاح `cache` مرتبط بالقيمة `[`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 170:** PHP array entry: المفتاح `url` مرتبط بالقيمة `env('REDIS_URL')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 171:** PHP array entry: المفتاح `host` مرتبط بالقيمة `env('REDIS_HOST', '127.0.0.1')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 172:** PHP array entry: المفتاح `username` مرتبط بالقيمة `env('REDIS_USERNAME')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 173:** PHP array entry: المفتاح `password` مرتبط بالقيمة `env('REDIS_PASSWORD')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 174:** PHP array entry: المفتاح `port` مرتبط بالقيمة `env('REDIS_PORT', '6379')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 175:** PHP array entry: المفتاح `database` مرتبط بالقيمة `env('REDIS_CACHE_DB', '1')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 176:** PHP array entry: المفتاح `max_retries` مرتبط بالقيمة `env('REDIS_MAX_RETRIES', 3)`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 177–184

```php
            'backoff_algorithm' => env('REDIS_BACKOFF_ALGORITHM', 'decorrelated_jitter'),
            'backoff_base' => env('REDIS_BACKOFF_BASE', 100),
            'backoff_cap' => env('REDIS_BACKOFF_CAP', 1000),
        ],

    ],

];
```

**السطر 177:** PHP array entry: المفتاح `backoff_algorithm` مرتبط بالقيمة `env('REDIS_BACKOFF_ALGORITHM', 'decorrelated_jitter')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 178:** PHP array entry: المفتاح `backoff_base` مرتبط بالقيمة `env('REDIS_BACKOFF_BASE', 100)`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 179:** PHP array entry: المفتاح `backoff_cap` مرتبط بالقيمة `env('REDIS_BACKOFF_CAP', 1000)`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 180:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 182:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 184:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
