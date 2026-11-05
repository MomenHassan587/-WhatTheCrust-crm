# database/migrations/0001_01_01_000001_create_cache_table.php

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `autocare-booking` · الملف: `database/migrations/0001_01_01_000001_create_cache_table.php` · 36 سطر.

**وظيفة الملف:** Migration / وصف تغييرات هيكل قاعدة البيانات في up/down. قراءة الملف لا تنفّذ migration؛ rollback قد يحذف بيانات، فلا تجرب على قاعدة حقيقية.

**نوعه:** source / مصدر. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../autocare-booking/database/migrations/0001_01_01_000001_create_cache_table.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

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
        Schema::create('cache', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->mediumText('value');
            $table->integer('expiration')->index();
        });

        Schema::create('cache_locks', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->string('owner');
            $table->integer('expiration')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cache');
        Schema::dropIfExists('cache_locks');
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

- **أول موضع هنا:** السطر 20.

- **مثال:** Schema::create('branches', function (Blueprint $table) { $table->id(); });

### $table->string

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمود نص قصير بطول محدد؛ النوع الفعلي في SQL مثل VARCHAR يختلف مع driver.

- **المدخلات — Arguments:** اسم العمود string، ثم طول أقصى integer اختياري؛ مثال phone ثم40.

- **الناتج/الأثر — Return / effect:** ColumnDefinition لاستكمال nullable/default/index modifiers.

- **أول موضع هنا:** السطر 22.

- **مثال:** $table->string('phone', 40)->nullable();

### ->primary

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** تحدد primary key بسيطًا/مركبًا.

- **المدخلات — Arguments:** column(s).

- **الناتج/الأثر — Return / effect:** IndexDefinition.

- **أول موضع هنا:** السطر 21.

### $table->mediumText

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمود نص أكبر من TEXT في المحركات التي تفرق الأحجام، مثل قيمة cache؛ driver يحدد SQL المقابل.

- **المدخلات — Arguments:** اسم العمود string.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 16.

- **مثال:** $table->mediumText('value');

### $table->integer

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمود عدد صحيح؛ مثال last_activity أوexpiration. مختلف عن Request::integer التي تقرأ input كرقم.

- **المدخلات — Arguments:** اسم العمود string؛ خيارات autoIncrement/unsigned متاحة في Laravel لكن غير مستخدمة هنا.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 23.

- **مثال:** $table->integer('last_activity')->index();

### ->index

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** تضيف index لتحسين الوصول وفق query.

- **المدخلات — Arguments:** column(s) وname اختيارية.

- **الناتج/الأثر — Return / effect:** IndexDefinition؛ مش صف بيانات.

- **أول موضع هنا:** السطر 23.

### Schema::dropIfExists

- **جاية منين؟** Laravel Schema Builder

- **وظيفتها:** احذف الجدول كاملًا لو موجود، بما فيه بياناته. يستعمل في down للrollback؛ لو غير موجود لا يحاول حذفه كجدول موجود.

- **المدخلات — Arguments:** اسم الجدول string فقط. لا يستقبل callback ولا Blueprint.

- **الناتج/الأثر — Return / effect:** void؛ الأثر حذف الجدول فعليًا عند تنفيذ migration/rollback، مش مجرد إخفائه أو حذف صف واحد.

- **أول موضع هنا:** السطر 33.

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
        Schema::create('cache', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->mediumText('value');
```

**السطر 9:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 10:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 11:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 12:** Function / تعريف دالة `up`؛ تعريفها مش تشغيلها. اللي بين الأقواس parameters، والجسم التالي هو خطواتها.  

**السطر 13:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 14:** Schema::create: وقت تشغيل migration تنشئ جدول `cache`. الـfunction اللي بعدها تستقبل Blueprint باسم $table وتوصف الأعمدة؛ مش بتضيف صفوف بيانات عملاء.

**السطر 15:** تعريف عمود `key` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص.

**السطر 16:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$table->mediumText(...)`: عرّف عمود نص أكبر من TEXT في المحركات التي تفرق الأحجام، مثل قيمة cache؛ driver يحدد SQL المقابل. مدخلاتها: اسم العمود string. العائد/الأثر: ColumnDefinition.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 17–24

```php
            $table->integer('expiration')->index();
        });

        Schema::create('cache_locks', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->string('owner');
            $table->integer('expiration')->index();
        });
```

**السطر 17:** تعريف عمود `expiration` بنوع `integer`: عدد صحيح.

**السطر 18:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 20:** Schema::create: وقت تشغيل migration تنشئ جدول `cache_locks`. الـfunction اللي بعدها تستقبل Blueprint باسم $table وتوصف الأعمدة؛ مش بتضيف صفوف بيانات عملاء.

**السطر 21:** تعريف عمود `key` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص.

**السطر 22:** تعريف عمود `owner` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص.

**السطر 23:** تعريف عمود `expiration` بنوع `integer`: عدد صحيح.

**السطر 24:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 25–32

```php
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cache');
```

**السطر 25:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 27:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 28:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 29:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 30:** Function / تعريف دالة `down`؛ تعريفها مش تشغيلها. اللي بين الأقواس parameters، والجسم التالي هو خطواتها.  

**السطر 31:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 32:** Schema::dropIfExists: تحذف جدول `cache` لو موجود. ده بيحذف بياناته كمان؛ السطر غالبًا في down للرجوع عن migration، فمتجربوش على قاعدة حقيقية.

### السطور 33–36

```php
        Schema::dropIfExists('cache_locks');
    }
};

```

**السطر 33:** Schema::dropIfExists: تحذف جدول `cache_locks` لو موجود. ده بيحذف بياناته كمان؛ السطر غالبًا في down للرجوع عن migration، فمتجربوش على قاعدة حقيقية.

**السطر 34:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 35:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
