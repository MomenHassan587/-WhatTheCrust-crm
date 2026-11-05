# إنشاء أقسام المنيو

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `database/migrations/2026_06_14_000002_create_categories_table.php` · 22 سطر.

**وظيفة الملف:** name وslug unique لمنع التكرار؛ display_order/is_active اتضافوا لاحقًا.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../database/migrations/2026_06_14_000002_create_categories_table.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php // database/migrations/2026_06_14_000002_create_categories_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### up

إنشاء categories بأعمدة unique.

- **بتاخد إيه؟ Inputs:** Blueprint.

- **بترجع/بتغيّر إيه؟ Return / effect:** void.

### down

drop categories.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** void.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### Schema::create

- **جاية منين؟** Laravel Schema Builder

- **وظيفتها:** أنشئ جدولًا جديدًا ونفّذ تعريف الأعمدة والقيود المكتوب داخل callback عند تشغيل migration. مختلف عن Model::create الذي ينشئ صف بيانات.

- **المدخلات — Arguments:** اسم الجدول string ثم Closure تستقبل Blueprint $table. مثال: 'branches' ثم function (Blueprint $table) { ... }.

- **الناتج/الأثر — Return / effect:** void؛ الأثر إنشاء schema في DB، لا يرجع Model ولا صفًا محفوظًا.

- **أول موضع هنا:** السطر 10.

- **مثال:** Schema::create('branches', function (Blueprint $table) { $table->id(); });

### $table->id

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** أضف عمود primary key رقمي auto-increment إلى تعريف الجدول؛ لا تضيف صف مستخدم أو order.

- **المدخلات — Arguments:** اسم عمود اختياري string افتراضي 'id'؛ في المشروع بدون arguments.

- **الناتج/الأثر — Return / effect:** ColumnDefinition للعمود يمكن إضافة modifiers لها.

- **أول موضع هنا:** السطر 11.

- **مثال:** $table->id();

### $table->string

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمود نص قصير بطول محدد؛ النوع الفعلي في SQL مثل VARCHAR يختلف مع driver.

- **المدخلات — Arguments:** اسم العمود string، ثم طول أقصى integer اختياري؛ مثال phone ثم40.

- **الناتج/الأثر — Return / effect:** ColumnDefinition لاستكمال nullable/default/index modifiers.

- **أول موضع هنا:** السطر 13.

- **مثال:** $table->string('phone', 40)->nullable();

### ->unique

- **جاية منين؟** Laravel Schema/Faker حسب المستقبِل

- **وظيفتها:** Schema: قيد عدم تكرار أعمدة؛ Faker: مولّد قيم فريدة داخل المولّد.

- **المدخلات — Arguments:** columns في schema أو خيارات Faker.

- **الناتج/الأثر — Return / effect:** تعريف index أو مولّد؛ راجع المستقبِل.

- **أول موضع هنا:** السطر 13.

### $table->timestamps

- **جاية منين؟** Laravel Schema Blueprint — الإصدار المثبت بالمشروع

- **وظيفتها:** أضف عمودي created_at وupdated_at كأعمدة قابلة لـNULL؛ Eloquent لاحقًا يحدّث القيم عند create/save.

- **المدخلات — Arguments:** precision اختيارية لأجزاء الثانية، أوبدون arguments كما في المشروع.

- **الناتج/الأثر — Return / effect:** Collection من ColumnDefinition للعمودين في Laravel المثبت؛ لا يرجع وقت الآن ولا rows.

- **أول موضع هنا:** السطر 14.

- **مثال:** $table->timestamps();

### Schema::dropIfExists

- **جاية منين؟** Laravel Schema Builder

- **وظيفتها:** احذف الجدول كاملًا لو موجود، بما فيه بياناته. يستعمل في down للrollback؛ لو غير موجود لا يحاول حذفه كجدول موجود.

- **المدخلات — Arguments:** اسم الجدول string فقط. لا يستقبل callback ولا Blueprint.

- **الناتج/الأثر — Return / effect:** void؛ الأثر حذف الجدول فعليًا عند تنفيذ migration/rollback، مش مجرد إخفائه أو حذف صف واحد.

- **أول موضع هنا:** السطر 20.

- **مثال:** Schema::dropIfExists('order_status_logs');

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php // database/migrations/2026_06_14_000002_create_categories_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** use / استيراد الاسم `Illuminate\Database\Migrations\Migration` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 4:** use / استيراد الاسم `Illuminate\Database\Schema\Blueprint` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 5:** use / استيراد الاسم `Illuminate\Support\Facades\Schema` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 7:** Laravel لما يقرأ ملف الـmigration يستلم object من anonymous class وارثة من Migration. ده return من ملف PHP نفسه، مش تشغيل up ولا إنشاء جدول دلوقتي.

**السطر 8:** Function / تعريف دالة `up`؛ تعريفها مش تشغيلها. إنشاء categories بأعمدة unique. مدخلاتها: Blueprint. ناتجها: void.

### السطور 9–16

```php
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique();
            $table->timestamps();
        });
    }
```

**السطر 9:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 10:** Schema::create: وقت تشغيل migration تنشئ جدول `categories`. الـfunction اللي بعدها تستقبل Blueprint باسم $table وتوصف الأعمدة؛ مش بتضيف صفوف بيانات عملاء.

**السطر 11:** توصف عمود id كمفتاح أساسي Primary key من نوع unsigned BIGINT مع زيادة تلقائية في قواعد البيانات المعتادة؛ كل صف له هوية مختلفة.

**السطر 12:** تعريف عمود `name` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص. unique تضيف قيد يمنع تكرار القيمة.

**السطر 13:** تعريف عمود `slug` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص. unique تضيف قيد يمنع تكرار القيمة.

**السطر 14:** توصف العمودين created_at وupdated_at. Eloquent تقدر تحدّث قيمهم تلقائيًا عند إنشاء/تحديث model؛ تعريفهم مش إدخال صف الآن.

**السطر 15:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 16:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 17–22

```php

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
```

**السطر 18:** Function / تعريف دالة `down`؛ تعريفها مش تشغيلها. drop categories. مدخلاتها: لا شيء. ناتجها: void.

**السطر 19:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 20:** Schema::dropIfExists: تحذف جدول `categories` لو موجود. ده بيحذف بياناته كمان؛ السطر غالبًا في down للرجوع عن migration، فمتجربوش على قاعدة حقيقية.

**السطر 21:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 22:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
