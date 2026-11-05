# حقول العرض والصور وبيانات الفرع

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `database/migrations/2026_10_09_000001_add_catalog_display_fields.php` · 35 سطر.

**وظيفة الملف:** يضيف phone/opening_hours/display_order للفروع وimage_path/tag/display_order للمنتجات؛ opening_hours نص للعرض مش جدول ساعات structured.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../database/migrations/2026_10_09_000001_add_catalog_display_fields.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Models/MenuItem.php](../../app/Models/MenuItem.php.md)

- [pizza-crm/app/Models/Branch.php](../../app/Models/Branch.php.md)

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
        Schema::table('branches', function (Blueprint $table) {
            $table->string('phone', 40)->nullable()->after('location');
            $table->string('opening_hours')->nullable()->after('phone');
            $table->unsignedInteger('display_order')->default(0)->after('opening_hours');
        });

        Schema::table('menu_items', function (Blueprint $table) {
            $table->string('image_path')->nullable()->after('description');
            $table->string('tag', 60)->nullable()->after('image_path');
            $table->unsignedInteger('display_order')->default(0)->after('tag');
        });
    }

    public function down(): void
    {
        Schema::table('menu_items', function (Blueprint $table) {
            $table->dropColumn(['image_path', 'tag', 'display_order']);
        });

        Schema::table('branches', function (Blueprint $table) {
            $table->dropColumn(['phone', 'opening_hours', 'display_order']);
        });
    }
};
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### up

Schema::table لإضافة أعمدة العرض.

- **بتاخد إيه؟ Inputs:** Blueprint callbacks.

- **بترجع/بتغيّر إيه؟ Return / effect:** void.

### down

حذف أعمدة العرض المضافة.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** void.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### Schema::table

- **جاية منين؟** Laravel Schema Builder

- **وظيفتها:** عدّل هيكل جدول موجود بإضافة أو تغيير أو حذف أعمدة وقيود من callback. مش DB::table التي تبني استعلام بيانات.

- **المدخلات — Arguments:** اسم جدول موجود string ثم Closure تستقبل Blueprint $table.

- **الناتج/الأثر — Return / effect:** void؛ الأثر تعديل schema عند تشغيل migration، لا يرجع rows.

- **أول موضع هنا:** السطر 30.

- **مثال:** Schema::table('users', function (Blueprint $table) { $table->boolean('is_active')->default(true); });

### $table->string

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمود نص قصير بطول محدد؛ النوع الفعلي في SQL مثل VARCHAR يختلف مع driver.

- **المدخلات — Arguments:** اسم العمود string، ثم طول أقصى integer اختياري؛ مثال phone ثم40.

- **الناتج/الأثر — Return / effect:** ColumnDefinition لاستكمال nullable/default/index modifiers.

- **أول موضع هنا:** السطر 19.

- **مثال:** $table->string('phone', 40)->nullable();

### ->nullable

- **جاية منين؟** Laravel Schema Column

- **وظيفتها:** تسمح بقيمة NULL للعمود.

- **المدخلات — Arguments:** Boolean اختياري.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 19.

### ->after

- **جاية منين؟** Laravel Schema column

- **وظيفتها:** تحدد ترتيب عمود بعد آخر حيث يدعم المحرك.

- **المدخلات — Arguments:** column.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 20.

### $table->unsignedInteger

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عددًا صحيحًا غير سالب في المحركات التي تدعم unsigned؛ يُستخدم للكمية أوترتيب العرض.

- **المدخلات — Arguments:** اسم العمود string، وخيار autoIncrement اختياري غير مستخدم هنا.

- **الناتج/الأثر — Return / effect:** ColumnDefinition؛ قواعد quantity min/max في FormRequest تظل مطلوبة.

- **أول موضع هنا:** السطر 20.

- **مثال:** $table->unsignedInteger('quantity');

### ->default

- **جاية منين؟** Laravel ColumnDefinition

- **وظيفتها:** تحدد قيمة افتراضية للعمود.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** نفس تعريف العمود.

- **أول موضع هنا:** السطر 20.

### $table->dropColumn

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** سجل أمر حذف عمود أوأعمدة من جدول موجود أثناء تنفيذ Schema::table؛ قيم هذه الأعمدة تضيع عند التنفيذ.

- **المدخلات — Arguments:** اسم عمود string أوarray أسماء؛ Laravel يقبل كذلك arguments منفصلة، والمشروع يستخدم string/array.

- **الناتج/الأثر — Return / effect:** Illuminate Support Fluent يصف أمر الحذف؛ الأثر الفعلي أثناء بناء وتنفيذ migration.

- **أول موضع هنا:** السطر 31.

- **مثال:** $table->dropColumn(['phone', 'opening_hours', 'display_order']);

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
        Schema::table('branches', function (Blueprint $table) {
            $table->string('phone', 40)->nullable()->after('location');
            $table->string('opening_hours')->nullable()->after('phone');
            $table->unsignedInteger('display_order')->default(0)->after('opening_hours');
        });

```

**السطر 9:** Function / تعريف دالة `up`؛ تعريفها مش تشغيلها. Schema::table لإضافة أعمدة العرض. مدخلاتها: Blueprint callbacks. ناتجها: void.

**السطر 10:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 11:** Schema::table: وقت تشغيل migration تعدّل هيكل الجدول الموجود `branches`. الـcallback اللي بعدها تحدد الأعمدة/القيود اللي هتتضاف أو تتشال؛ مش قراءة سجلات.

**السطر 12:** تعريف عمود `phone` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص. الخيارات الإضافية بعد الاسم: `40`. nullable تسمح بتخزين null بدل إلزامه بقيمة.

**السطر 13:** تعريف عمود `opening_hours` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص. nullable تسمح بتخزين null بدل إلزامه بقيمة.

**السطر 14:** تعريف عمود `display_order` بنوع `unsignedInteger`: عدد صحيح غير سالب. default تضبط القيمة الافتراضية على `0` لما INSERT ما يبعتش العمود.

**السطر 15:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 17–24

```php
        Schema::table('menu_items', function (Blueprint $table) {
            $table->string('image_path')->nullable()->after('description');
            $table->string('tag', 60)->nullable()->after('image_path');
            $table->unsignedInteger('display_order')->default(0)->after('tag');
        });
    }

    public function down(): void
```

**السطر 17:** Schema::table: وقت تشغيل migration تعدّل هيكل الجدول الموجود `menu_items`. الـcallback اللي بعدها تحدد الأعمدة/القيود اللي هتتضاف أو تتشال؛ مش قراءة سجلات.

**السطر 18:** تعريف عمود `image_path` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص. nullable تسمح بتخزين null بدل إلزامه بقيمة.

**السطر 19:** تعريف عمود `tag` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص. الخيارات الإضافية بعد الاسم: `60`. nullable تسمح بتخزين null بدل إلزامه بقيمة.

**السطر 20:** تعريف عمود `display_order` بنوع `unsignedInteger`: عدد صحيح غير سالب. default تضبط القيمة الافتراضية على `0` لما INSERT ما يبعتش العمود.

**السطر 21:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 22:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 24:** Function / تعريف دالة `down`؛ تعريفها مش تشغيلها. حذف أعمدة العرض المضافة. مدخلاتها: لا شيء. ناتجها: void.

### السطور 25–32

```php
    {
        Schema::table('menu_items', function (Blueprint $table) {
            $table->dropColumn(['image_path', 'tag', 'display_order']);
        });

        Schema::table('branches', function (Blueprint $table) {
            $table->dropColumn(['phone', 'opening_hours', 'display_order']);
        });
```

**السطر 25:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 26:** Schema::table: وقت تشغيل migration تعدّل هيكل الجدول الموجود `menu_items`. الـcallback اللي بعدها تحدد الأعمدة/القيود اللي هتتضاف أو تتشال؛ مش قراءة سجلات.

**السطر 27:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$table->dropColumn(...)`: سجل أمر حذف عمود أوأعمدة من جدول موجود أثناء تنفيذ Schema::table؛ قيم هذه الأعمدة تضيع عند التنفيذ. مدخلاتها: اسم عمود string أوarray أسماء؛ Laravel يقبل كذلك arguments منفصلة، والمشروع يستخدم string/array. العائد/الأثر: Illuminate Support Fluent يصف أمر الحذف؛ الأثر الفعلي أثناء بناء وتنفيذ migration.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 28:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 30:** Schema::table: وقت تشغيل migration تعدّل هيكل الجدول الموجود `branches`. الـcallback اللي بعدها تحدد الأعمدة/القيود اللي هتتضاف أو تتشال؛ مش قراءة سجلات.

**السطر 31:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$table->dropColumn(...)`: سجل أمر حذف عمود أوأعمدة من جدول موجود أثناء تنفيذ Schema::table؛ قيم هذه الأعمدة تضيع عند التنفيذ. مدخلاتها: اسم عمود string أوarray أسماء؛ Laravel يقبل كذلك arguments منفصلة، والمشروع يستخدم string/array. العائد/الأثر: Illuminate Support Fluent يصف أمر الحذف؛ الأثر الفعلي أثناء بناء وتنفيذ migration.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 32:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 33–35

```php
    }
};

```

**السطر 33:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 34:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
