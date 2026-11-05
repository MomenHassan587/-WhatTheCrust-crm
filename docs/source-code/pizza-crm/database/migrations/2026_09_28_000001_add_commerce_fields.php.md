# توسعة الحسابات والطلبات للدفع والتوصيل

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `database/migrations/2026_09_28_000001_add_commerce_fields.php` · 53 سطر.

**وظيفة الملف:** يضيف role ومعلومات العميل والدفع وgateway/idempotency keys وreason والملاحظات؛ يحول status إلى string ويترجم pending/confirmed القديمة. تغيير schema مش نفس business validation.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../database/migrations/2026_09_28_000001_add_commerce_fields.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Models/Order.php](../../app/Models/Order.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('customer')->index();
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->string('status')->default('new')->change();
            $table->dateTime('pickup_time')->nullable();
            $table->string('customer_name')->nullable();
            $table->string('customer_phone', 40)->nullable();
            $table->text('delivery_address')->nullable();
            $table->string('payment_method')->default('cash');
            $table->string('payment_status')->default('unpaid')->index();
            $table->string('payment_gateway')->nullable();
            $table->string('gateway_reference')->nullable()->unique();
            $table->string('idempotency_key')->nullable()->unique();
            $table->text('status_reason')->nullable();
        });

        DB::table('orders')->where('status', 'pending')->update(['status' => 'new']);
        DB::table('orders')->where('status', 'confirmed')->update(['status' => 'accepted']);

        Schema::table('order_items', function (Blueprint $table) {
            $table->string('notes', 200)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('order_items', fn (Blueprint $table) => $table->dropColumn('notes'));

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'pickup_time', 'customer_name', 'customer_phone', 'delivery_address',
                'payment_method', 'payment_status', 'payment_gateway', 'gateway_reference',
                'idempotency_key', 'status_reason',
            ]);
        });

        Schema::table('users', fn (Blueprint $table) => $table->dropColumn('role'));
    }
};
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### up

أضف الأعمدة والفهارس وترجم أسماء الحالات القديمة.

- **بتاخد إيه؟ Inputs:** Schema وDB query updates.

- **بترجع/بتغيّر إيه؟ Return / effect:** void.

### down

احذف الأعمدة المضافة؛ لا يعكس ترجمة أسماء الحالات ولا يعيد enum القديمة في هذا الكود.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** void.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### Schema::table

- **جاية منين؟** Laravel Schema Builder

- **وظيفتها:** عدّل هيكل جدول موجود بإضافة أو تغيير أو حذف أعمدة وقيود من callback. مش DB::table التي تبني استعلام بيانات.

- **المدخلات — Arguments:** اسم جدول موجود string ثم Closure تستقبل Blueprint $table.

- **الناتج/الأثر — Return / effect:** void؛ الأثر تعديل schema عند تشغيل migration، لا يرجع rows.

- **أول موضع هنا:** السطر 50.

- **مثال:** Schema::table('users', function (Blueprint $table) { $table->boolean('is_active')->default(true); });

### $table->string

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمود نص قصير بطول محدد؛ النوع الفعلي في SQL مثل VARCHAR يختلف مع driver.

- **المدخلات — Arguments:** اسم العمود string، ثم طول أقصى integer اختياري؛ مثال phone ثم40.

- **الناتج/الأثر — Return / effect:** ColumnDefinition لاستكمال nullable/default/index modifiers.

- **أول موضع هنا:** السطر 34.

- **مثال:** $table->string('phone', 40)->nullable();

### ->default

- **جاية منين؟** Laravel ColumnDefinition

- **وظيفتها:** تحدد قيمة افتراضية للعمود.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** نفس تعريف العمود.

- **أول موضع هنا:** السطر 23.

### ->index

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** تضيف index لتحسين الوصول وفق query.

- **المدخلات — Arguments:** column(s) وname اختيارية.

- **الناتج/الأثر — Return / effect:** IndexDefinition؛ مش صف بيانات.

- **أول موضع هنا:** السطر 23.

### ->change

- **جاية منين؟** Laravel Schema column

- **وظيفتها:** تطلب تعديل تعريف عمود قائم.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** تعريف migration؛ التنفيذ عند تشغيلها.

- **أول موضع هنا:** السطر 17.

### $table->dateTime

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمود تاريخ ووقت مثل pickup_time؛ لا يراجع إن الموعد في المستقبل، لأن دي قاعدة FormRequest.

- **المدخلات — Arguments:** اسم العمود string وprecision اختيارية.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 18.

- **مثال:** $table->dateTime('pickup_time')->nullable();

### ->nullable

- **جاية منين؟** Laravel Schema Column

- **وظيفتها:** تسمح بقيمة NULL للعمود.

- **المدخلات — Arguments:** Boolean اختياري.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 34.

### $table->text

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمود نص طويل مثل description أوdelivery_address؛ الاسم وحده لا يكتب فيه قيمة.

- **المدخلات — Arguments:** اسم العمود string فقط في المشروع.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 27.

- **مثال:** $table->text('delivery_address')->nullable();

### ->unique

- **جاية منين؟** Laravel Schema/Faker حسب المستقبِل

- **وظيفتها:** Schema: قيد عدم تكرار أعمدة؛ Faker: مولّد قيم فريدة داخل المولّد.

- **المدخلات — Arguments:** columns في schema أو خيارات Faker.

- **الناتج/الأثر — Return / effect:** تعريف index أو مولّد؛ راجع المستقبِل.

- **أول موضع هنا:** السطر 26.

### DB::table

- **جاية منين؟** Laravel Database Query Builder

- **وظيفتها:** ابدأ query لجدول بالاسم من غير Eloquent Model؛ لا يقرأ rows ولا يغيّر schema بمجرد استدعائه.

- **المدخلات — Arguments:** اسم الجدول string، مع alias اختيارية؛ في المشروع اسم فقط.

- **الناتج/الأثر — Return / effect:** Illuminate Database Query Builder؛ كمّل عليه where ثم first/get/update/insert لتنفيذ العملية.

- **أول موضع هنا:** السطر 31.

- **مثال:** DB::table('branch_menu_item')->where('branch_id', $branch->id)->first();

### ->where

- **جاية منين؟** Laravel Query Builder

- **وظيفتها:** تضيف شرط فلترة أو مجموعة شروط.

- **المدخلات — Arguments:** column/operator/value أو closure.

- **الناتج/الأثر — Return / effect:** Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.

- **أول موضع هنا:** السطر 31.

### ->update

- **جاية منين؟** Eloquent

- **وظيفتها:** تكتب تغييرات في DB.

- **المدخلات — Arguments:** attributes array.

- **الناتج/الأثر — Return / effect:** Boolean على model أو عدد صفوف على builder؛ حسب المستقبِل.

- **أول موضع هنا:** السطر 31.

### $table->dropColumn

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** سجل أمر حذف عمود أوأعمدة من جدول موجود أثناء تنفيذ Schema::table؛ قيم هذه الأعمدة تضيع عند التنفيذ.

- **المدخلات — Arguments:** اسم عمود string أوarray أسماء؛ Laravel يقبل كذلك arguments منفصلة، والمشروع يستخدم string/array.

- **الناتج/الأثر — Return / effect:** Illuminate Support Fluent يصف أمر الحذف؛ الأثر الفعلي أثناء بناء وتنفيذ migration.

- **أول موضع هنا:** السطر 50.

- **مثال:** $table->dropColumn(['phone', 'opening_hours', 'display_order']);

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** use / استيراد الاسم `Illuminate\Database\Migrations\Migration` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 4:** use / استيراد الاسم `Illuminate\Database\Schema\Blueprint` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 5:** use / استيراد الاسم `Illuminate\Support\Facades\DB` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** use / استيراد الاسم `Illuminate\Support\Facades\Schema` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 8:** Laravel لما يقرأ ملف الـmigration يستلم object من anonymous class وارثة من Migration. ده return من ملف PHP نفسه، مش تشغيل up ولا إنشاء جدول دلوقتي.

### السطور 9–16

```php
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('customer')->index();
        });

        Schema::table('orders', function (Blueprint $table) {
```

**السطر 9:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 10:** Function / تعريف دالة `up`؛ تعريفها مش تشغيلها. أضف الأعمدة والفهارس وترجم أسماء الحالات القديمة. مدخلاتها: Schema وDB query updates. ناتجها: void.

**السطر 11:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 12:** Schema::table: وقت تشغيل migration تعدّل هيكل الجدول الموجود `users`. الـcallback اللي بعدها تحدد الأعمدة/القيود اللي هتتضاف أو تتشال؛ مش قراءة سجلات.

**السطر 13:** تعريف عمود `role` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص. default تضبط القيمة الافتراضية على `'customer'` لما INSERT ما يبعتش العمود.

**السطر 14:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 16:** Schema::table: وقت تشغيل migration تعدّل هيكل الجدول الموجود `orders`. الـcallback اللي بعدها تحدد الأعمدة/القيود اللي هتتضاف أو تتشال؛ مش قراءة سجلات.

### السطور 17–24

```php
            $table->string('status')->default('new')->change();
            $table->dateTime('pickup_time')->nullable();
            $table->string('customer_name')->nullable();
            $table->string('customer_phone', 40)->nullable();
            $table->text('delivery_address')->nullable();
            $table->string('payment_method')->default('cash');
            $table->string('payment_status')->default('unpaid')->index();
            $table->string('payment_gateway')->nullable();
```

**السطر 17:** تعريف عمود `status` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص. default تضبط القيمة الافتراضية على `'new'` لما INSERT ما يبعتش العمود.

**السطر 18:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$table->dateTime(...)`: عرّف عمود تاريخ ووقت مثل pickup_time؛ لا يراجع إن الموعد في المستقبل، لأن دي قاعدة FormRequest. مدخلاتها: اسم العمود string وprecision اختيارية. العائد/الأثر: ColumnDefinition.؛ `->nullable(...)`: تسمح بقيمة NULL للعمود. مدخلاتها: Boolean اختياري. العائد/الأثر: ColumnDefinition.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 19:** تعريف عمود `customer_name` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص. nullable تسمح بتخزين null بدل إلزامه بقيمة.

**السطر 20:** تعريف عمود `customer_phone` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص. الخيارات الإضافية بعد الاسم: `40`. nullable تسمح بتخزين null بدل إلزامه بقيمة.

**السطر 21:** تعريف عمود `delivery_address` بنوع `text`: نص طويل. nullable تسمح بتخزين null بدل إلزامه بقيمة.

**السطر 22:** تعريف عمود `payment_method` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص. default تضبط القيمة الافتراضية على `'cash'` لما INSERT ما يبعتش العمود.

**السطر 23:** تعريف عمود `payment_status` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص. default تضبط القيمة الافتراضية على `'unpaid'` لما INSERT ما يبعتش العمود.

**السطر 24:** تعريف عمود `payment_gateway` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص. nullable تسمح بتخزين null بدل إلزامه بقيمة.

### السطور 25–32

```php
            $table->string('gateway_reference')->nullable()->unique();
            $table->string('idempotency_key')->nullable()->unique();
            $table->text('status_reason')->nullable();
        });

        DB::table('orders')->where('status', 'pending')->update(['status' => 'new']);
        DB::table('orders')->where('status', 'confirmed')->update(['status' => 'accepted']);

```

**السطر 25:** تعريف عمود `gateway_reference` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص. nullable تسمح بتخزين null بدل إلزامه بقيمة. unique تضيف قيد يمنع تكرار القيمة.

**السطر 26:** تعريف عمود `idempotency_key` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص. nullable تسمح بتخزين null بدل إلزامه بقيمة. unique تضيف قيد يمنع تكرار القيمة.

**السطر 27:** تعريف عمود `status_reason` بنوع `text`: نص طويل. nullable تسمح بتخزين null بدل إلزامه بقيمة.

**السطر 28:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 30:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `DB::table(...)`: ابدأ query لجدول بالاسم من غير Eloquent Model؛ لا يقرأ rows ولا يغيّر schema بمجرد استدعائه. مدخلاتها: اسم الجدول string، مع alias اختيارية؛ في المشروع اسم فقط. العائد/الأثر: Illuminate Database Query Builder؛ كمّل عليه where ثم first/get/update/insert لتنفيذ العملية.؛ `->where(...)`: تضيف شرط فلترة أو مجموعة شروط. مدخلاتها: column/operator/value أو closure. العائد/الأثر: Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.؛ `->update(...)`: تكتب تغييرات في DB. مدخلاتها: attributes array. العائد/الأثر: Boolean على model أو عدد صفوف على builder؛ حسب المستقبِل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 31:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `DB::table(...)`: ابدأ query لجدول بالاسم من غير Eloquent Model؛ لا يقرأ rows ولا يغيّر schema بمجرد استدعائه. مدخلاتها: اسم الجدول string، مع alias اختيارية؛ في المشروع اسم فقط. العائد/الأثر: Illuminate Database Query Builder؛ كمّل عليه where ثم first/get/update/insert لتنفيذ العملية.؛ `->where(...)`: تضيف شرط فلترة أو مجموعة شروط. مدخلاتها: column/operator/value أو closure. العائد/الأثر: Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.؛ `->update(...)`: تكتب تغييرات في DB. مدخلاتها: attributes array. العائد/الأثر: Boolean على model أو عدد صفوف على builder؛ حسب المستقبِل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 33–40

```php
        Schema::table('order_items', function (Blueprint $table) {
            $table->string('notes', 200)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('order_items', fn (Blueprint $table) => $table->dropColumn('notes'));
```

**السطر 33:** Schema::table: وقت تشغيل migration تعدّل هيكل الجدول الموجود `order_items`. الـcallback اللي بعدها تحدد الأعمدة/القيود اللي هتتضاف أو تتشال؛ مش قراءة سجلات.

**السطر 34:** تعريف عمود `notes` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص. الخيارات الإضافية بعد الاسم: `200`. nullable تسمح بتخزين null بدل إلزامه بقيمة.

**السطر 35:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 36:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 38:** Function / تعريف دالة `down`؛ تعريفها مش تشغيلها. احذف الأعمدة المضافة؛ لا يعكس ترجمة أسماء الحالات ولا يعيد enum القديمة في هذا الكود. مدخلاتها: لا شيء. ناتجها: void.

**السطر 39:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 40:** Schema::table: وقت تشغيل migration تعدّل هيكل الجدول الموجود `order_items`. الـcallback اللي بعدها تحدد الأعمدة/القيود اللي هتتضاف أو تتشال؛ مش قراءة سجلات.

### السطور 41–48

```php

        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'pickup_time', 'customer_name', 'customer_phone', 'delivery_address',
                'payment_method', 'payment_status', 'payment_gateway', 'gateway_reference',
                'idempotency_key', 'status_reason',
            ]);
        });
```

**السطر 42:** Schema::table: وقت تشغيل migration تعدّل هيكل الجدول الموجود `orders`. الـcallback اللي بعدها تحدد الأعمدة/القيود اللي هتتضاف أو تتشال؛ مش قراءة سجلات.

**السطر 43:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$table->dropColumn(...)`: سجل أمر حذف عمود أوأعمدة من جدول موجود أثناء تنفيذ Schema::table؛ قيم هذه الأعمدة تضيع عند التنفيذ. مدخلاتها: اسم عمود string أوarray أسماء؛ Laravel يقبل كذلك arguments منفصلة، والمشروع يستخدم string/array. العائد/الأثر: Illuminate Support Fluent يصف أمر الحذف؛ الأثر الفعلي أثناء بناء وتنفيذ migration.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 44:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 45:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 46:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 47:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 48:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 49–53

```php

        Schema::table('users', fn (Blueprint $table) => $table->dropColumn('role'));
    }
};

```

**السطر 50:** Schema::table: وقت تشغيل migration تعدّل هيكل الجدول الموجود `users`. الـcallback اللي بعدها تحدد الأعمدة/القيود اللي هتتضاف أو تتشال؛ مش قراءة سجلات.

**السطر 51:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 52:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
