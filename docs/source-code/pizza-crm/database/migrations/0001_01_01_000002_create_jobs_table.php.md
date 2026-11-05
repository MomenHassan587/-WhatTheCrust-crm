# جداول queues الافتراضية

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `database/migrations/0001_01_01_000002_create_jobs_table.php` · 58 سطر.

**وظيفة الملف:** jobs/job_batches/failed_jobs infrastructure؛ events الحالية ShouldBroadcastNow لا تحتاج queue worker لهذا النوع بالذات، ووجود جدول jobs لا يثبت إن كل request background job.

**نوعه:** starter. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../database/migrations/0001_01_01_000002_create_jobs_table.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('queue')->index();
            $table->longText('payload');
            $table->unsignedTinyInteger('attempts');
            $table->unsignedInteger('reserved_at')->nullable();
            $table->unsignedInteger('available_at');
            $table->unsignedInteger('created_at');
        });

        Schema::create('job_batches', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('name');
            $table->integer('total_jobs');
            $table->integer('pending_jobs');
            $table->integer('failed_jobs');
            $table->longText('failed_job_ids');
            $table->mediumText('options')->nullable();
            $table->integer('cancelled_at')->nullable();
            $table->integer('created_at');
            $table->integer('finished_at')->nullable();
        });

        Schema::create('failed_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique();
            $table->text('connection');
            $table->text('queue');
            $table->longText('payload');
            $table->longText('exception');
            $table->timestamp('failed_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('job_batches');
        Schema::dropIfExists('failed_jobs');
    }
};
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### up

أنشئ جداول المهام ودفعاتها وفشلها.

- **بتاخد إيه؟ Inputs:** Blueprint.

- **بترجع/بتغيّر إيه؟ Return / effect:** void.

### down

drop جداول queue الثلاثة.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** void.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### Schema::create

- **جاية منين؟** Laravel Schema Builder

- **وظيفتها:** أنشئ جدولًا جديدًا ونفّذ تعريف الأعمدة والقيود المكتوب داخل callback عند تشغيل migration. مختلف عن Model::create الذي ينشئ صف بيانات.

- **المدخلات — Arguments:** اسم الجدول string ثم Closure تستقبل Blueprint $table. مثال: 'branches' ثم function (Blueprint $table) { ... }.

- **الناتج/الأثر — Return / effect:** void؛ الأثر إنشاء schema في DB، لا يرجع Model ولا صفًا محفوظًا.

- **أول موضع هنا:** السطر 37.

- **مثال:** Schema::create('branches', function (Blueprint $table) { $table->id(); });

### $table->id

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** أضف عمود primary key رقمي auto-increment إلى تعريف الجدول؛ لا تضيف صف مستخدم أو order.

- **المدخلات — Arguments:** اسم عمود اختياري string افتراضي 'id'؛ في المشروع بدون arguments.

- **الناتج/الأثر — Return / effect:** ColumnDefinition للعمود يمكن إضافة modifiers لها.

- **أول موضع هنا:** السطر 38.

- **مثال:** $table->id();

### $table->string

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمود نص قصير بطول محدد؛ النوع الفعلي في SQL مثل VARCHAR يختلف مع driver.

- **المدخلات — Arguments:** اسم العمود string، ثم طول أقصى integer اختياري؛ مثال phone ثم40.

- **الناتج/الأثر — Return / effect:** ColumnDefinition لاستكمال nullable/default/index modifiers.

- **أول موضع هنا:** السطر 39.

- **مثال:** $table->string('phone', 40)->nullable();

### ->index

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** تضيف index لتحسين الوصول وفق query.

- **المدخلات — Arguments:** column(s) وname اختيارية.

- **الناتج/الأثر — Return / effect:** IndexDefinition؛ مش صف بيانات.

- **أول موضع هنا:** السطر 16.

### $table->longText

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمود نص كبير لتخزين session أوjob payload؛ مش قارئ للملفات ولا عملية JSON parsing.

- **المدخلات — Arguments:** اسم العمود string.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 43.

- **مثال:** $table->longText('payload');

### $table->unsignedTinyInteger

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عددًا صحيحًا صغيرًا unsigned لمحاولات job. المجال الفعلي يعتمد على محرك DB؛ في MySQL عادة0إلى255.

- **المدخلات — Arguments:** اسم العمود string؛ هنا 'attempts'.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 18.

- **مثال:** $table->unsignedTinyInteger('attempts');

### $table->unsignedInteger

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عددًا صحيحًا غير سالب في المحركات التي تدعم unsigned؛ يُستخدم للكمية أوترتيب العرض.

- **المدخلات — Arguments:** اسم العمود string، وخيار autoIncrement اختياري غير مستخدم هنا.

- **الناتج/الأثر — Return / effect:** ColumnDefinition؛ قواعد quantity min/max في FormRequest تظل مطلوبة.

- **أول موضع هنا:** السطر 21.

- **مثال:** $table->unsignedInteger('quantity');

### ->nullable

- **جاية منين؟** Laravel Schema Column

- **وظيفتها:** تسمح بقيمة NULL للعمود.

- **المدخلات — Arguments:** Boolean اختياري.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 34.

### ->primary

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** تحدد primary key بسيطًا/مركبًا.

- **المدخلات — Arguments:** column(s).

- **الناتج/الأثر — Return / effect:** IndexDefinition.

- **أول موضع هنا:** السطر 25.

### $table->integer

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمود عدد صحيح؛ مثال last_activity أوexpiration. مختلف عن Request::integer التي تقرأ input كرقم.

- **المدخلات — Arguments:** اسم العمود string؛ خيارات autoIncrement/unsigned متاحة في Laravel لكن غير مستخدمة هنا.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 34.

- **مثال:** $table->integer('last_activity')->index();

### $table->mediumText

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمود نص أكبر من TEXT في المحركات التي تفرق الأحجام، مثل قيمة cache؛ driver يحدد SQL المقابل.

- **المدخلات — Arguments:** اسم العمود string.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 31.

- **مثال:** $table->mediumText('value');

### ->unique

- **جاية منين؟** Laravel Schema/Faker حسب المستقبِل

- **وظيفتها:** Schema: قيد عدم تكرار أعمدة؛ Faker: مولّد قيم فريدة داخل المولّد.

- **المدخلات — Arguments:** columns في schema أو خيارات Faker.

- **الناتج/الأثر — Return / effect:** تعريف index أو مولّد؛ راجع المستقبِل.

- **أول موضع هنا:** السطر 39.

### $table->text

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمود نص طويل مثل description أوdelivery_address؛ الاسم وحده لا يكتب فيه قيمة.

- **المدخلات — Arguments:** اسم العمود string فقط في المشروع.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 41.

- **مثال:** $table->text('delivery_address')->nullable();

### $table->timestamp

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمود وقت مثل created_at؛ default الوقت الحالي يحتاج useCurrent أوقيمة من التطبيق.

- **المدخلات — Arguments:** اسم العمود string ثم precision عدد خانات أجزاء الثانية اختياري؛ هنا اسم فقط.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 44.

- **مثال:** $table->timestamp('created_at')->useCurrent();

### ->useCurrent

- **جاية منين؟** Laravel timestamp column

- **وظيفتها:** تجعل timestamp تستخدم الوقت الحالي كـdefault.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** تعريف العمود.

- **أول موضع هنا:** السطر 44.

### Schema::dropIfExists

- **جاية منين؟** Laravel Schema Builder

- **وظيفتها:** احذف الجدول كاملًا لو موجود، بما فيه بياناته. يستعمل في down للrollback؛ لو غير موجود لا يحاول حذفه كجدول موجود.

- **المدخلات — Arguments:** اسم الجدول string فقط. لا يستقبل callback ولا Blueprint.

- **الناتج/الأثر — Return / effect:** void؛ الأثر حذف الجدول فعليًا عند تنفيذ migration/rollback، مش مجرد إخفائه أو حذف صف واحد.

- **أول موضع هنا:** السطر 55.

- **مثال:** Schema::dropIfExists('order_status_logs');

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** use / استيراد الاسم `Illuminate\Database\Migrations\Migration` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 4:** use / استيراد الاسم `Illuminate\Database\Schema\Blueprint` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 5:** use / استيراد الاسم `Illuminate\Support\Facades\Schema` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 7:** Laravel لما يقرأ ملف الـmigration يستلم object من anonymous class وارثة من Migration. ده return من ملف PHP نفسه، مش تشغيل up ولا إنشاء جدول دلوقتي.

**السطر 8:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

### السطور 9–16

```php
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('queue')->index();
```

**السطر 9:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 10:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 11:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 12:** Function / تعريف دالة `up`؛ تعريفها مش تشغيلها. أنشئ جداول المهام ودفعاتها وفشلها. مدخلاتها: Blueprint. ناتجها: void.

**السطر 13:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 14:** Schema::create: وقت تشغيل migration تنشئ جدول `jobs`. الـfunction اللي بعدها تستقبل Blueprint باسم $table وتوصف الأعمدة؛ مش بتضيف صفوف بيانات عملاء.

**السطر 15:** توصف عمود id كمفتاح أساسي Primary key من نوع unsigned BIGINT مع زيادة تلقائية في قواعد البيانات المعتادة؛ كل صف له هوية مختلفة.

**السطر 16:** تعريف عمود `queue` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص.

### السطور 17–24

```php
            $table->longText('payload');
            $table->unsignedTinyInteger('attempts');
            $table->unsignedInteger('reserved_at')->nullable();
            $table->unsignedInteger('available_at');
            $table->unsignedInteger('created_at');
        });

        Schema::create('job_batches', function (Blueprint $table) {
```

**السطر 17:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$table->longText(...)`: عرّف عمود نص كبير لتخزين session أوjob payload؛ مش قارئ للملفات ولا عملية JSON parsing. مدخلاتها: اسم العمود string. العائد/الأثر: ColumnDefinition.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 18:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$table->unsignedTinyInteger(...)`: عرّف عددًا صحيحًا صغيرًا unsigned لمحاولات job. المجال الفعلي يعتمد على محرك DB؛ في MySQL عادة0إلى255. مدخلاتها: اسم العمود string؛ هنا 'attempts'. العائد/الأثر: ColumnDefinition.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 19:** تعريف عمود `reserved_at` بنوع `unsignedInteger`: عدد صحيح غير سالب. nullable تسمح بتخزين null بدل إلزامه بقيمة.

**السطر 20:** تعريف عمود `available_at` بنوع `unsignedInteger`: عدد صحيح غير سالب.

**السطر 21:** تعريف عمود `created_at` بنوع `unsignedInteger`: عدد صحيح غير سالب.

**السطر 22:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 24:** Schema::create: وقت تشغيل migration تنشئ جدول `job_batches`. الـfunction اللي بعدها تستقبل Blueprint باسم $table وتوصف الأعمدة؛ مش بتضيف صفوف بيانات عملاء.

### السطور 25–32

```php
            $table->string('id')->primary();
            $table->string('name');
            $table->integer('total_jobs');
            $table->integer('pending_jobs');
            $table->integer('failed_jobs');
            $table->longText('failed_job_ids');
            $table->mediumText('options')->nullable();
            $table->integer('cancelled_at')->nullable();
```

**السطر 25:** تعريف عمود `id` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص.

**السطر 26:** تعريف عمود `name` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص.

**السطر 27:** تعريف عمود `total_jobs` بنوع `integer`: عدد صحيح.

**السطر 28:** تعريف عمود `pending_jobs` بنوع `integer`: عدد صحيح.

**السطر 29:** تعريف عمود `failed_jobs` بنوع `integer`: عدد صحيح.

**السطر 30:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$table->longText(...)`: عرّف عمود نص كبير لتخزين session أوjob payload؛ مش قارئ للملفات ولا عملية JSON parsing. مدخلاتها: اسم العمود string. العائد/الأثر: ColumnDefinition.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 31:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$table->mediumText(...)`: عرّف عمود نص أكبر من TEXT في المحركات التي تفرق الأحجام، مثل قيمة cache؛ driver يحدد SQL المقابل. مدخلاتها: اسم العمود string. العائد/الأثر: ColumnDefinition.؛ `->nullable(...)`: تسمح بقيمة NULL للعمود. مدخلاتها: Boolean اختياري. العائد/الأثر: ColumnDefinition.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 32:** تعريف عمود `cancelled_at` بنوع `integer`: عدد صحيح. nullable تسمح بتخزين null بدل إلزامه بقيمة.

### السطور 33–40

```php
            $table->integer('created_at');
            $table->integer('finished_at')->nullable();
        });

        Schema::create('failed_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique();
            $table->text('connection');
```

**السطر 33:** تعريف عمود `created_at` بنوع `integer`: عدد صحيح.

**السطر 34:** تعريف عمود `finished_at` بنوع `integer`: عدد صحيح. nullable تسمح بتخزين null بدل إلزامه بقيمة.

**السطر 35:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 37:** Schema::create: وقت تشغيل migration تنشئ جدول `failed_jobs`. الـfunction اللي بعدها تستقبل Blueprint باسم $table وتوصف الأعمدة؛ مش بتضيف صفوف بيانات عملاء.

**السطر 38:** توصف عمود id كمفتاح أساسي Primary key من نوع unsigned BIGINT مع زيادة تلقائية في قواعد البيانات المعتادة؛ كل صف له هوية مختلفة.

**السطر 39:** تعريف عمود `uuid` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص. unique تضيف قيد يمنع تكرار القيمة.

**السطر 40:** تعريف عمود `connection` بنوع `text`: نص طويل.

### السطور 41–48

```php
            $table->text('queue');
            $table->longText('payload');
            $table->longText('exception');
            $table->timestamp('failed_at')->useCurrent();
        });
    }

    /**
```

**السطر 41:** تعريف عمود `queue` بنوع `text`: نص طويل.

**السطر 42:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$table->longText(...)`: عرّف عمود نص كبير لتخزين session أوjob payload؛ مش قارئ للملفات ولا عملية JSON parsing. مدخلاتها: اسم العمود string. العائد/الأثر: ColumnDefinition.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 43:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$table->longText(...)`: عرّف عمود نص كبير لتخزين session أوjob payload؛ مش قارئ للملفات ولا عملية JSON parsing. مدخلاتها: اسم العمود string. العائد/الأثر: ColumnDefinition.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 44:** تعريف عمود `failed_at` بنوع `timestamp`: تاريخ ووقت.

**السطر 45:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 46:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 48:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

### السطور 49–56

```php
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('job_batches');
        Schema::dropIfExists('failed_jobs');
    }
```

**السطر 49:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 50:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 51:** Function / تعريف دالة `down`؛ تعريفها مش تشغيلها. drop جداول queue الثلاثة. مدخلاتها: لا شيء. ناتجها: void.

**السطر 52:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 53:** Schema::dropIfExists: تحذف جدول `jobs` لو موجود. ده بيحذف بياناته كمان؛ السطر غالبًا في down للرجوع عن migration، فمتجربوش على قاعدة حقيقية.

**السطر 54:** Schema::dropIfExists: تحذف جدول `job_batches` لو موجود. ده بيحذف بياناته كمان؛ السطر غالبًا في down للرجوع عن migration، فمتجربوش على قاعدة حقيقية.

**السطر 55:** Schema::dropIfExists: تحذف جدول `failed_jobs` لو موجود. ده بيحذف بياناته كمان؛ السطر غالبًا في down للرجوع عن migration، فمتجربوش على قاعدة حقيقية.

**السطر 56:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 57–58

```php
};

```

**السطر 57:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
