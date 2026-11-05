# database/migrations/0001_01_01_000000_create_users_table.php

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `autocare-booking` · الملف: `database/migrations/0001_01_01_000000_create_users_table.php` · 50 سطر.

**وظيفة الملف:** Migration / وصف تغييرات هيكل قاعدة البيانات في up/down. قراءة الملف لا تنفّذ migration؛ rollback قد يحذف بيانات، فلا تجرب على قاعدة حقيقية.

**نوعه:** source / مصدر. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../autocare-booking/database/migrations/0001_01_01_000000_create_users_table.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
```

</details>

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### Schema::create

- **جاية منين؟** Laravel Schema Builder

- **وظيفتها:** أنشئ جدولًا جديدًا ونفّذ تعريف الأعمدة والقيود المكتوب داخل callback عند تشغيل migration. مختلف عن Model::create الذي ينشئ صف بيانات.

- **المدخلات — Arguments:** اسم الجدول string ثم Closure تستقبل Blueprint $table. مثال: 'branches' ثم function (Blueprint $table) { ... }.

- **الناتج/الأثر — Return / effect:** void؛ الأثر إنشاء schema في DB، لا يرجع Model ولا صفًا محفوظًا.

- **أول موضع هنا:** السطر 30.

- **مثال:** Schema::create('branches', function (Blueprint $table) { $table->id(); });

### $table->id

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** أضف عمود primary key رقمي auto-increment إلى تعريف الجدول؛ لا تضيف صف مستخدم أو order.

- **المدخلات — Arguments:** اسم عمود اختياري string افتراضي 'id'؛ في المشروع بدون arguments.

- **الناتج/الأثر — Return / effect:** ColumnDefinition للعمود يمكن إضافة modifiers لها.

- **أول موضع هنا:** السطر 15.

- **مثال:** $table->id();

### $table->string

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمود نص قصير بطول محدد؛ النوع الفعلي في SQL مثل VARCHAR يختلف مع driver.

- **المدخلات — Arguments:** اسم العمود string، ثم طول أقصى integer اختياري؛ مثال phone ثم40.

- **الناتج/الأثر — Return / effect:** ColumnDefinition لاستكمال nullable/default/index modifiers.

- **أول موضع هنا:** السطر 33.

- **مثال:** $table->string('phone', 40)->nullable();

### ->unique

- **جاية منين؟** Laravel Schema/Faker حسب المستقبِل

- **وظيفتها:** Schema: قيد عدم تكرار أعمدة؛ Faker: مولّد قيم فريدة داخل المولّد.

- **المدخلات — Arguments:** columns في schema أو خيارات Faker.

- **الناتج/الأثر — Return / effect:** تعريف index أو مولّد؛ راجع المستقبِل.

- **أول موضع هنا:** السطر 17.

### $table->timestamp

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمود وقت مثل created_at؛ default الوقت الحالي يحتاج useCurrent أوقيمة من التطبيق.

- **المدخلات — Arguments:** اسم العمود string ثم precision عدد خانات أجزاء الثانية اختياري؛ هنا اسم فقط.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 27.

- **مثال:** $table->timestamp('created_at')->useCurrent();

### ->nullable

- **جاية منين؟** Laravel Schema Column

- **وظيفتها:** تسمح بقيمة NULL للعمود.

- **المدخلات — Arguments:** Boolean اختياري.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 34.

### $table->rememberToken

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** أضف عمود remember_token النصي nullable الذي session guard قد يستخدمه لوخيار remember مفعل.

- **المدخلات — Arguments:** بدون arguments في المشروع.

- **الناتج/الأثر — Return / effect:** ColumnDefinition؛ تعريف العمود مش تفعيل remember لكل مستخدم.

- **أول موضع هنا:** السطر 20.

- **مثال:** $table->rememberToken();

### $table->timestamps

- **جاية منين؟** Laravel Schema Blueprint — الإصدار المثبت بالمشروع

- **وظيفتها:** أضف عمودي created_at وupdated_at كأعمدة قابلة لـNULL؛ Eloquent لاحقًا يحدّث القيم عند create/save.

- **المدخلات — Arguments:** precision اختيارية لأجزاء الثانية، أوبدون arguments كما في المشروع.

- **الناتج/الأثر — Return / effect:** Collection من ColumnDefinition للعمودين في Laravel المثبت؛ لا يرجع وقت الآن ولا rows.

- **أول موضع هنا:** السطر 21.

- **مثال:** $table->timestamps();

### ->primary

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** تحدد primary key بسيطًا/مركبًا.

- **المدخلات — Arguments:** column(s).

- **الناتج/الأثر — Return / effect:** IndexDefinition.

- **أول موضع هنا:** السطر 31.

### $table->foreignId

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** أضف عمود معرف للربط؛ constrained بعدها تُنشئ قيد foreign key. foreignId وحدها مش ضمان وجود سجل أب.

- **المدخلات — Arguments:** اسم العمود string، مثل branch_id أوuser_id.

- **الناتج/الأثر — Return / effect:** ForeignIdColumnDefinition قابلة لـnullable/constrained.

- **أول موضع هنا:** السطر 32.

- **مثال:** $table->foreignId('branch_id')->constrained()->cascadeOnDelete();

### ->index

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** تضيف index لتحسين الوصول وفق query.

- **المدخلات — Arguments:** column(s) وname اختيارية.

- **الناتج/الأثر — Return / effect:** IndexDefinition؛ مش صف بيانات.

- **أول موضع هنا:** السطر 36.

### $table->text

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمود نص طويل مثل description أوdelivery_address؛ الاسم وحده لا يكتب فيه قيمة.

- **المدخلات — Arguments:** اسم العمود string فقط في المشروع.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 34.

- **مثال:** $table->text('delivery_address')->nullable();

### $table->longText

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمود نص كبير لتخزين session أوjob payload؛ مش قارئ للملفات ولا عملية JSON parsing.

- **المدخلات — Arguments:** اسم العمود string.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 35.

- **مثال:** $table->longText('payload');

### $table->integer

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمود عدد صحيح؛ مثال last_activity أوexpiration. مختلف عن Request::integer التي تقرأ input كرقم.

- **المدخلات — Arguments:** اسم العمود string؛ خيارات autoIncrement/unsigned متاحة في Laravel لكن غير مستخدمة هنا.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 36.

- **مثال:** $table->integer('last_activity')->index();

### Schema::dropIfExists

- **جاية منين؟** Laravel Schema Builder

- **وظيفتها:** احذف الجدول كاملًا لو موجود، بما فيه بياناته. يستعمل في down للrollback؛ لو غير موجود لا يحاول حذفه كجدول موجود.

- **المدخلات — Arguments:** اسم الجدول string فقط. لا يستقبل callback ولا Blueprint.

- **الناتج/الأثر — Return / effect:** void؛ الأثر حذف الجدول فعليًا عند تنفيذ migration/rollback، مش مجرد إخفائه أو حذف صف واحد.

- **أول موضع هنا:** السطر 47.

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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
```

**السطر 9:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 10:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 11:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 12:** Function / تعريف دالة `up`؛ تعريفها مش تشغيلها. اللي بين الأقواس parameters، والجسم التالي هو خطواتها.  

**السطر 13:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 14:** Schema::create: وقت تشغيل migration تنشئ جدول `users`. الـfunction اللي بعدها تستقبل Blueprint باسم $table وتوصف الأعمدة؛ مش بتضيف صفوف بيانات عملاء.

**السطر 15:** توصف عمود id كمفتاح أساسي Primary key من نوع unsigned BIGINT مع زيادة تلقائية في قواعد البيانات المعتادة؛ كل صف له هوية مختلفة.

**السطر 16:** تعريف عمود `name` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص.

### السطور 17–24

```php
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
```

**السطر 17:** تعريف عمود `email` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص. unique تضيف قيد يمنع تكرار القيمة.

**السطر 18:** تعريف عمود `email_verified_at` بنوع `timestamp`: تاريخ ووقت. nullable تسمح بتخزين null بدل إلزامه بقيمة.

**السطر 19:** تعريف عمود `password` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص.

**السطر 20:** توصف عمود remember_token nullable اللي Laravel تستخدمه لتذكّر تسجيل الدخول؛ ده مش عمود password.

**السطر 21:** توصف العمودين created_at وupdated_at. Eloquent تقدر تحدّث قيمهم تلقائيًا عند إنشاء/تحديث model؛ تعريفهم مش إدخال صف الآن.

**السطر 22:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 24:** Schema::create: وقت تشغيل migration تنشئ جدول `password_reset_tokens`. الـfunction اللي بعدها تستقبل Blueprint باسم $table وتوصف الأعمدة؛ مش بتضيف صفوف بيانات عملاء.

### السطور 25–32

```php
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
```

**السطر 25:** تعريف عمود `email` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص.

**السطر 26:** تعريف عمود `token` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص.

**السطر 27:** تعريف عمود `created_at` بنوع `timestamp`: تاريخ ووقت. nullable تسمح بتخزين null بدل إلزامه بقيمة.

**السطر 28:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 30:** Schema::create: وقت تشغيل migration تنشئ جدول `sessions`. الـfunction اللي بعدها تستقبل Blueprint باسم $table وتوصف الأعمدة؛ مش بتضيف صفوف بيانات عملاء.

**السطر 31:** تعريف عمود `id` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص.

**السطر 32:** تعريف عمود `user_id` بنوع `foreignId`: عدد unsigned BIGINT يُستعمل عادة لربط سجل بجدول آخر؛ القيد الفعلي يحتاج constrained أو foreign. nullable تسمح بتخزين null بدل إلزامه بقيمة.

### السطور 33–40

```php
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
```

**السطر 33:** تعريف عمود `ip_address` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص. الخيارات الإضافية بعد الاسم: `45`. nullable تسمح بتخزين null بدل إلزامه بقيمة.

**السطر 34:** تعريف عمود `user_agent` بنوع `text`: نص طويل. nullable تسمح بتخزين null بدل إلزامه بقيمة.

**السطر 35:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$table->longText(...)`: عرّف عمود نص كبير لتخزين session أوjob payload؛ مش قارئ للملفات ولا عملية JSON parsing. مدخلاتها: اسم العمود string. العائد/الأثر: ColumnDefinition.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 36:** تعريف عمود `last_activity` بنوع `integer`: عدد صحيح.

**السطر 37:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 38:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 40:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

### السطور 41–48

```php
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
```

**السطر 41:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 42:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 43:** Function / تعريف دالة `down`؛ تعريفها مش تشغيلها. اللي بين الأقواس parameters، والجسم التالي هو خطواتها.  

**السطر 44:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 45:** Schema::dropIfExists: تحذف جدول `users` لو موجود. ده بيحذف بياناته كمان؛ السطر غالبًا في down للرجوع عن migration، فمتجربوش على قاعدة حقيقية.

**السطر 46:** Schema::dropIfExists: تحذف جدول `password_reset_tokens` لو موجود. ده بيحذف بياناته كمان؛ السطر غالبًا في down للرجوع عن migration، فمتجربوش على قاعدة حقيقية.

**السطر 47:** Schema::dropIfExists: تحذف جدول `sessions` لو موجود. ده بيحذف بياناته كمان؛ السطر غالبًا في down للرجوع عن migration، فمتجربوش على قاعدة حقيقية.

**السطر 48:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 49–50

```php
};

```

**السطر 49:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
