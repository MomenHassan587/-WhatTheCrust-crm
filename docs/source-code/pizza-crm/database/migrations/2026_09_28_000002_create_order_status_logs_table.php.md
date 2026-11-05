# إنشاء سجل حالات الطلب

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `database/migrations/2026_09_28_000002_create_order_status_logs_table.php` · 27 سطر.

**وظيفة الملف:** يخزن order_id/user_id/from/to/reason/created_at فقط؛ المستخدم لو اتحذف يبقى null لكن الطلب لو اتحذف سجلاته cascade.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../database/migrations/2026_09_28_000002_create_order_status_logs_table.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Models/OrderStatusLog.php](../../app/Models/OrderStatusLog.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_status_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('from_status')->nullable();
            $table->string('to_status');
            $table->text('reason')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_status_logs');
    }
};
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### up

أنشئ order_status_logs.

- **بتاخد إيه؟ Inputs:** Blueprint.

- **بترجع/بتغيّر إيه؟ Return / effect:** void.

### down

drop سجل الحالات.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** void.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### Schema::create

- **جاية منين؟** Laravel Schema Builder

- **وظيفتها:** أنشئ جدولًا جديدًا ونفّذ تعريف الأعمدة والقيود المكتوب داخل callback عند تشغيل migration. مختلف عن Model::create الذي ينشئ صف بيانات.

- **المدخلات — Arguments:** اسم الجدول string ثم Closure تستقبل Blueprint $table. مثال: 'branches' ثم function (Blueprint $table) { ... }.

- **الناتج/الأثر — Return / effect:** void؛ الأثر إنشاء schema في DB، لا يرجع Model ولا صفًا محفوظًا.

- **أول موضع هنا:** السطر 11.

- **مثال:** Schema::create('branches', function (Blueprint $table) { $table->id(); });

### $table->id

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** أضف عمود primary key رقمي auto-increment إلى تعريف الجدول؛ لا تضيف صف مستخدم أو order.

- **المدخلات — Arguments:** اسم عمود اختياري string افتراضي 'id'؛ في المشروع بدون arguments.

- **الناتج/الأثر — Return / effect:** ColumnDefinition للعمود يمكن إضافة modifiers لها.

- **أول موضع هنا:** السطر 12.

- **مثال:** $table->id();

### $table->foreignId

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** أضف عمود معرف للربط؛ constrained بعدها تُنشئ قيد foreign key. foreignId وحدها مش ضمان وجود سجل أب.

- **المدخلات — Arguments:** اسم العمود string، مثل branch_id أوuser_id.

- **الناتج/الأثر — Return / effect:** ForeignIdColumnDefinition قابلة لـnullable/constrained.

- **أول موضع هنا:** السطر 14.

- **مثال:** $table->foreignId('branch_id')->constrained()->cascadeOnDelete();

### ->constrained

- **جاية منين؟** Laravel Schema

- **وظيفتها:** تضيف foreign key لجدول/عمود مستنتج أو محدد.

- **المدخلات — Arguments:** table/column اختيارية.

- **الناتج/الأثر — Return / effect:** ForeignKeyDefinition.

- **أول موضع هنا:** السطر 14.

### ->cascadeOnDelete

- **جاية منين؟** Laravel Schema foreign key

- **وظيفتها:** تجعل حذف الأب يحذف الصفوف المرتبطة بهذا القيد.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** نفس تعريف القيد؛ مؤثرة عند تنفيذ حذف لاحقًا.

- **أول موضع هنا:** السطر 13.

### ->nullable

- **جاية منين؟** Laravel Schema Column

- **وظيفتها:** تسمح بقيمة NULL للعمود.

- **المدخلات — Arguments:** Boolean اختياري.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 17.

### ->nullOnDelete

- **جاية منين؟** Laravel Schema foreign key

- **وظيفتها:** تضبط المرجع إلى null عند حذف الأب إذا كان العمود يسمح.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** تعريف القيد.

- **أول موضع هنا:** السطر 14.

### $table->string

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمود نص قصير بطول محدد؛ النوع الفعلي في SQL مثل VARCHAR يختلف مع driver.

- **المدخلات — Arguments:** اسم العمود string، ثم طول أقصى integer اختياري؛ مثال phone ثم40.

- **الناتج/الأثر — Return / effect:** ColumnDefinition لاستكمال nullable/default/index modifiers.

- **أول موضع هنا:** السطر 16.

- **مثال:** $table->string('phone', 40)->nullable();

### $table->text

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمود نص طويل مثل description أوdelivery_address؛ الاسم وحده لا يكتب فيه قيمة.

- **المدخلات — Arguments:** اسم العمود string فقط في المشروع.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 17.

- **مثال:** $table->text('delivery_address')->nullable();

### $table->timestamp

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمود وقت مثل created_at؛ default الوقت الحالي يحتاج useCurrent أوقيمة من التطبيق.

- **المدخلات — Arguments:** اسم العمود string ثم precision عدد خانات أجزاء الثانية اختياري؛ هنا اسم فقط.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 18.

- **مثال:** $table->timestamp('created_at')->useCurrent();

### ->useCurrent

- **جاية منين؟** Laravel timestamp column

- **وظيفتها:** تجعل timestamp تستخدم الوقت الحالي كـdefault.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** تعريف العمود.

- **أول موضع هنا:** السطر 18.

### Schema::dropIfExists

- **جاية منين؟** Laravel Schema Builder

- **وظيفتها:** احذف الجدول كاملًا لو موجود، بما فيه بياناته. يستعمل في down للrollback؛ لو غير موجود لا يحاول حذفه كجدول موجود.

- **المدخلات — Arguments:** اسم الجدول string فقط. لا يستقبل callback ولا Blueprint.

- **الناتج/الأثر — Return / effect:** void؛ الأثر حذف الجدول فعليًا عند تنفيذ migration/rollback، مش مجرد إخفائه أو حذف صف واحد.

- **أول موضع هنا:** السطر 24.

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
    public function up(): void
    {
        Schema::create('order_status_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('from_status')->nullable();
            $table->string('to_status');
```

**السطر 9:** Function / تعريف دالة `up`؛ تعريفها مش تشغيلها. أنشئ order_status_logs. مدخلاتها: Blueprint. ناتجها: void.

**السطر 10:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 11:** Schema::create: وقت تشغيل migration تنشئ جدول `order_status_logs`. الـfunction اللي بعدها تستقبل Blueprint باسم $table وتوصف الأعمدة؛ مش بتضيف صفوف بيانات عملاء.

**السطر 12:** توصف عمود id كمفتاح أساسي Primary key من نوع unsigned BIGINT مع زيادة تلقائية في قواعد البيانات المعتادة؛ كل صف له هوية مختلفة.

**السطر 13:** تعريف عمود `order_id` بنوع `foreignId`: عدد unsigned BIGINT يُستعمل عادة لربط سجل بجدول آخر؛ القيد الفعلي يحتاج constrained أو foreign. constrained تضيف Foreign key للجدول المحدد أو المستنتج من اسم العمود. cascadeOnDelete تمسح السجلات التابعة عند حذف السجل الأب؛ دي سياسة حذف لازم تفهمها قبل التطبيق.

**السطر 14:** تعريف عمود `user_id` بنوع `foreignId`: عدد unsigned BIGINT يُستعمل عادة لربط سجل بجدول آخر؛ القيد الفعلي يحتاج constrained أو foreign. nullable تسمح بتخزين null بدل إلزامه بقيمة. constrained تضيف Foreign key للجدول المحدد أو المستنتج من اسم العمود. nullOnDelete تجعل المفتاح null عند حذف السجل المرتبط؛ لازم العمود يسمح بـnull.

**السطر 15:** تعريف عمود `from_status` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص. nullable تسمح بتخزين null بدل إلزامه بقيمة.

**السطر 16:** تعريف عمود `to_status` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص.

### السطور 17–24

```php
            $table->text('reason')->nullable();
            $table->timestamp('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_status_logs');
```

**السطر 17:** تعريف عمود `reason` بنوع `text`: نص طويل. nullable تسمح بتخزين null بدل إلزامه بقيمة.

**السطر 18:** تعريف عمود `created_at` بنوع `timestamp`: تاريخ ووقت.

**السطر 19:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 20:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 22:** Function / تعريف دالة `down`؛ تعريفها مش تشغيلها. drop سجل الحالات. مدخلاتها: لا شيء. ناتجها: void.

**السطر 23:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 24:** Schema::dropIfExists: تحذف جدول `order_status_logs` لو موجود. ده بيحذف بياناته كمان؛ السطر غالبًا في down للرجوع عن migration، فمتجربوش على قاعدة حقيقية.

### السطور 25–27

```php
    }
};

```

**السطر 25:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 26:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
