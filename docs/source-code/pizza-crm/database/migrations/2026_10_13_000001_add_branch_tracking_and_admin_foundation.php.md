# الفرع والصلاحيات والتتبع والإدارة

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `database/migrations/2026_10_13_000001_add_branch_tracking_and_admin_foundation.php` · 95 سطر.

**وظيفة الملف:** يضيف رسوم وإتاحة الفرع وفرع/نشاط المستخدم وactivity الكتالوج وtracking token وitem_name snapshot؛ يعمل backfill للبيانات القديمة ثم ينشئ audit/settings ويملأ defaults. دي schema+data migration وليست مجرد create table.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../database/migrations/2026_10_13_000001_add_branch_tracking_and_admin_foundation.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Models/AppSetting.php](../../app/Models/AppSetting.php.md)

- [pizza-crm/app/Models/AdminAuditLog.php](../../app/Models/AdminAuditLog.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('branches', function (Blueprint $table) {
            $table->decimal('delivery_fee', 10, 2)->default(25)->after('opening_hours');
            $table->boolean('delivery_enabled')->default(true)->after('delivery_fee');
            $table->boolean('is_active')->default(true)->after('delivery_enabled');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('branch_id')->nullable()->after('role')->constrained()->nullOnDelete();
            $table->boolean('is_active')->default(true)->after('branch_id');
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->unsignedInteger('display_order')->default(0)->after('slug');
            $table->boolean('is_active')->default(true)->after('display_order');
        });

        Schema::table('menu_items', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->after('display_order');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->string('tracking_token', 64)->nullable()->unique()->after('idempotency_key');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->string('item_name')->nullable()->after('menu_item_id');
        });

        DB::table('orders')->orderBy('id')->each(function (object $order): void {
            DB::table('orders')->where('id', $order->id)->update([
                'tracking_token' => Str::random(48),
            ]);
        });

        DB::table('order_items')->orderBy('id')->each(function (object $item): void {
            $name = DB::table('menu_items')->where('id', $item->menu_item_id)->value('name');
            DB::table('order_items')->where('id', $item->id)->update([
                'item_name' => $name ?: 'Menu item',
            ]);
        });

        Schema::create('admin_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action');
            $table->string('subject_type');
            $table->unsignedBigInteger('subject_id')->nullable();
            $table->json('details')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->index(['subject_type', 'subject_id']);
        });

        Schema::create('app_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        DB::table('app_settings')->insert([
            ['key' => 'default_delivery_fee', 'value' => (string) config('orders.delivery_fee', 25), 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'minimum_pickup_prep_minutes', 'value' => (string) config('orders.minimum_pickup_prep_minutes', 20), 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'order_promise_minutes', 'value' => (string) config('orders.order_promise_minutes', 3), 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('app_settings');
        Schema::dropIfExists('admin_audit_logs');

        Schema::table('order_items', fn (Blueprint $table) => $table->dropColumn('item_name'));
        Schema::table('orders', fn (Blueprint $table) => $table->dropColumn('tracking_token'));
        Schema::table('menu_items', fn (Blueprint $table) => $table->dropColumn('is_active'));
        Schema::table('categories', fn (Blueprint $table) => $table->dropColumn(['display_order', 'is_active']));
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('branch_id');
            $table->dropColumn('is_active');
        });
        Schema::table('branches', fn (Blueprint $table) => $table->dropColumn(['delivery_fee', 'delivery_enabled', 'is_active']));
    }
};
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### up

أضف أعمدة وعلاقات وفهارس وbackfill tokens/names ثم أنشئ admin_audit_logs/app_settings.

- **بتاخد إيه؟ Inputs:** Schema وقراءات/كتابات DB وconfig defaults.

- **بترجع/بتغيّر إيه؟ Return / effect:** void؛ يحتمل كتابة data موجودة عند migrate.

### down

احذف الجداول والأعمدة والفورين كي بالترتيب العكسي؛ يمسح بيانات features دي.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** void.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### Schema::table

- **جاية منين؟** Laravel Schema Builder

- **وظيفتها:** عدّل هيكل جدول موجود بإضافة أو تغيير أو حذف أعمدة وقيود من callback. مش DB::table التي تبني استعلام بيانات.

- **المدخلات — Arguments:** اسم جدول موجود string ثم Closure تستقبل Blueprint $table.

- **الناتج/الأثر — Return / effect:** void؛ الأثر تعديل schema عند تشغيل migration، لا يرجع rows.

- **أول موضع هنا:** السطر 92.

- **مثال:** Schema::table('users', function (Blueprint $table) { $table->boolean('is_active')->default(true); });

### $table->decimal

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمود عدد عشري دقيق، مناسب لتخزين قيمة سعر بمنزلتين بدل نوع float التقريبي.

- **المدخلات — Arguments:** اسم العمود ثم precision وهو إجمالي الأرقام، ثم scale وهو أرقام بعد العلامة. decimal('price',10,2) يسمح8أرقام قبل العلامة و2بعدها.

- **الناتج/الأثر — Return / effect:** ColumnDefinition؛ لا يحسب total ولا يحوّل سعر المتصفح إلى قيمة موثوقة وحده.

- **أول موضع هنا:** السطر 14.

- **مثال:** $table->decimal('price', 10, 2);

### ->default

- **جاية منين؟** Laravel ColumnDefinition

- **وظيفتها:** تحدد قيمة افتراضية للعمود.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** نفس تعريف العمود.

- **أول موضع هنا:** السطر 30.

### ->after

- **جاية منين؟** Laravel Schema column

- **وظيفتها:** تحدد ترتيب عمود بعد آخر حيث يدعم المحرك.

- **المدخلات — Arguments:** column.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 38.

### $table->boolean

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمودًا يمثل true/false مثل is_active؛ لا يقرأ قيمة request الحالية.

- **المدخلات — Arguments:** اسم العمود string.

- **الناتج/الأثر — Return / effect:** ColumnDefinition؛ يكمّل default(true) مثلًا.

- **أول موضع هنا:** السطر 30.

- **مثال:** $table->boolean('delivery_enabled')->default(true);

### $table->foreignId

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** أضف عمود معرف للربط؛ constrained بعدها تُنشئ قيد foreign key. foreignId وحدها مش ضمان وجود سجل أب.

- **المدخلات — Arguments:** اسم العمود string، مثل branch_id أوuser_id.

- **الناتج/الأثر — Return / effect:** ForeignIdColumnDefinition قابلة لـnullable/constrained.

- **أول موضع هنا:** السطر 56.

- **مثال:** $table->foreignId('branch_id')->constrained()->cascadeOnDelete();

### ->nullable

- **جاية منين؟** Laravel Schema Column

- **وظيفتها:** تسمح بقيمة NULL للعمود.

- **المدخلات — Arguments:** Boolean اختياري.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 68.

### ->constrained

- **جاية منين؟** Laravel Schema

- **وظيفتها:** تضيف foreign key لجدول/عمود مستنتج أو محدد.

- **المدخلات — Arguments:** table/column اختيارية.

- **الناتج/الأثر — Return / effect:** ForeignKeyDefinition.

- **أول موضع هنا:** السطر 56.

### ->nullOnDelete

- **جاية منين؟** Laravel Schema foreign key

- **وظيفتها:** تضبط المرجع إلى null عند حذف الأب إذا كان العمود يسمح.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** تعريف القيد.

- **أول موضع هنا:** السطر 56.

### $table->unsignedInteger

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عددًا صحيحًا غير سالب في المحركات التي تدعم unsigned؛ يُستخدم للكمية أوترتيب العرض.

- **المدخلات — Arguments:** اسم العمود string، وخيار autoIncrement اختياري غير مستخدم هنا.

- **الناتج/الأثر — Return / effect:** ColumnDefinition؛ قواعد quantity min/max في FormRequest تظل مطلوبة.

- **أول موضع هنا:** السطر 25.

- **مثال:** $table->unsignedInteger('quantity');

### $table->string

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمود نص قصير بطول محدد؛ النوع الفعلي في SQL مثل VARCHAR يختلف مع driver.

- **المدخلات — Arguments:** اسم العمود string، ثم طول أقصى integer اختياري؛ مثال phone ثم40.

- **الناتج/الأثر — Return / effect:** ColumnDefinition لاستكمال nullable/default/index modifiers.

- **أول موضع هنا:** السطر 67.

- **مثال:** $table->string('phone', 40)->nullable();

### ->unique

- **جاية منين؟** Laravel Schema/Faker حسب المستقبِل

- **وظيفتها:** Schema: قيد عدم تكرار أعمدة؛ Faker: مولّد قيم فريدة داخل المولّد.

- **المدخلات — Arguments:** columns في schema أو خيارات Faker.

- **الناتج/الأثر — Return / effect:** تعريف index أو مولّد؛ راجع المستقبِل.

- **أول موضع هنا:** السطر 67.

### DB::table

- **جاية منين؟** Laravel Database Query Builder

- **وظيفتها:** ابدأ query لجدول بالاسم من غير Eloquent Model؛ لا يقرأ rows ولا يغيّر schema بمجرد استدعائه.

- **المدخلات — Arguments:** اسم الجدول string، مع alias اختيارية؛ في المشروع اسم فقط.

- **الناتج/الأثر — Return / effect:** Illuminate Database Query Builder؛ كمّل عليه where ثم first/get/update/insert لتنفيذ العملية.

- **أول موضع هنا:** السطر 72.

- **مثال:** DB::table('branch_menu_item')->where('branch_id', $branch->id)->first();

### ->orderBy

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تضيف ترتيبًا حسب عمود واتجاه.

- **المدخلات — Arguments:** column وdirection.

- **الناتج/الأثر — Return / effect:** Builder.

- **أول موضع هنا:** السطر 47.

### ->each

- **جاية منين؟** Laravel Collection

- **وظيفتها:** تنفذ callback لكل عنصر لأثر جانبي.

- **المدخلات — Arguments:** callback.

- **الناتج/الأثر — Return / effect:** نفس Collection؛ return false قد توقف المرور.

- **أول موضع هنا:** السطر 47.

### ->where

- **جاية منين؟** Laravel Query Builder

- **وظيفتها:** تضيف شرط فلترة أو مجموعة شروط.

- **المدخلات — Arguments:** column/operator/value أو closure.

- **الناتج/الأثر — Return / effect:** Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.

- **أول موضع هنا:** السطر 49.

### ->update

- **جاية منين؟** Eloquent

- **وظيفتها:** تكتب تغييرات في DB.

- **المدخلات — Arguments:** attributes array.

- **الناتج/الأثر — Return / effect:** Boolean على model أو عدد صفوف على builder؛ حسب المستقبِل.

- **أول موضع هنا:** السطر 49.

### Str::random

- **جاية منين؟** Laravel Str

- **وظيفتها:** ولّد string عشوائية آمنة للاستخدام كtracking token أو جزء اسم ملف؛ الطول لا يلغي الحاجة للتحكم في صلاحيات الوصول.

- **المدخلات — Arguments:** length int.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 43.

- **مثال:** Str::random(48)

### ->value

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تقرأ قيمة عمود من أول نتيجة.

- **المدخلات — Arguments:** column.

- **الناتج/الأثر — Return / effect:** scalar أو null.

- **أول موضع هنا:** السطر 48.

### Schema::create

- **جاية منين؟** Laravel Schema Builder

- **وظيفتها:** أنشئ جدولًا جديدًا ونفّذ تعريف الأعمدة والقيود المكتوب داخل callback عند تشغيل migration. مختلف عن Model::create الذي ينشئ صف بيانات.

- **المدخلات — Arguments:** اسم الجدول string ثم Closure تستقبل Blueprint $table. مثال: 'branches' ثم function (Blueprint $table) { ... }.

- **الناتج/الأثر — Return / effect:** void؛ الأثر إنشاء schema في DB، لا يرجع Model ولا صفًا محفوظًا.

- **أول موضع هنا:** السطر 65.

- **مثال:** Schema::create('branches', function (Blueprint $table) { $table->id(); });

### $table->id

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** أضف عمود primary key رقمي auto-increment إلى تعريف الجدول؛ لا تضيف صف مستخدم أو order.

- **المدخلات — Arguments:** اسم عمود اختياري string افتراضي 'id'؛ في المشروع بدون arguments.

- **الناتج/الأثر — Return / effect:** ColumnDefinition للعمود يمكن إضافة modifiers لها.

- **أول موضع هنا:** السطر 66.

- **مثال:** $table->id();

### $table->unsignedBigInteger

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف integer كبيرًا غير سالب مثل subject_id؛ مجرد العمود مش foreign key تلقائيًا.

- **المدخلات — Arguments:** اسم العمود string؛ خيارات autoIncrement غير مستخدمة هنا.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 59.

- **مثال:** $table->unsignedBigInteger('subject_id')->nullable();

### $table->json

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمود JSON لتخزين details التدقيق؛ لا تُنشئ HTTP response ولا تحلل request body.

- **المدخلات — Arguments:** اسم العمود string؛ هنا 'details'.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 60.

- **مثال:** $table->json('details')->nullable();

### $table->timestamp

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمود وقت مثل created_at؛ default الوقت الحالي يحتاج useCurrent أوقيمة من التطبيق.

- **المدخلات — Arguments:** اسم العمود string ثم precision عدد خانات أجزاء الثانية اختياري؛ هنا اسم فقط.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 61.

- **مثال:** $table->timestamp('created_at')->useCurrent();

### ->useCurrent

- **جاية منين؟** Laravel timestamp column

- **وظيفتها:** تجعل timestamp تستخدم الوقت الحالي كـdefault.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** تعريف العمود.

- **أول موضع هنا:** السطر 61.

### $table->index

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف database index على عمود أوأكثر لتسريع عمليات بحث مناسبة؛ index عادي لا يمنع تكرار القيم.

- **المدخلات — Arguments:** اسم عمود string أوarray أسماء أعمدة، ثم اسم index وalgorithm اختياريان.

- **الناتج/الأثر — Return / effect:** IndexDefinition.

- **أول موضع هنا:** السطر 62.

- **مثال:** $table->index(['subject_type', 'subject_id']);

### $table->text

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** عرّف عمود نص طويل مثل description أوdelivery_address؛ الاسم وحده لا يكتب فيه قيمة.

- **المدخلات — Arguments:** اسم العمود string فقط في المشروع.

- **الناتج/الأثر — Return / effect:** ColumnDefinition.

- **أول موضع هنا:** السطر 68.

- **مثال:** $table->text('delivery_address')->nullable();

### $table->timestamps

- **جاية منين؟** Laravel Schema Blueprint — الإصدار المثبت بالمشروع

- **وظيفتها:** أضف عمودي created_at وupdated_at كأعمدة قابلة لـNULL؛ Eloquent لاحقًا يحدّث القيم عند create/save.

- **المدخلات — Arguments:** precision اختيارية لأجزاء الثانية، أوبدون arguments كما في المشروع.

- **الناتج/الأثر — Return / effect:** Collection من ColumnDefinition للعمودين في Laravel المثبت؛ لا يرجع وقت الآن ولا rows.

- **أول موضع هنا:** السطر 69.

- **مثال:** $table->timestamps();

### ->insert

- **جاية منين؟** Laravel Query Builder

- **وظيفتها:** تضيف صفًا/صفوفًا مباشرة للجدول.

- **المدخلات — Arguments:** attributes/rows.

- **الناتج/الأثر — Return / effect:** Boolean عادة؛ لا تشغّل كل model events مثل create.

- **أول موضع هنا:** السطر 72.

### config

- **جاية منين؟** Laravel helper

- **وظيفتها:** اقرأ إعدادًا من ملفات config بالقيمة المحملة وقت تشغيل التطبيق؛ النقطة تفصل الملف عن المفتاح الداخلي.

- **المدخلات — Arguments:** key بصيغة dot notation مثل services.stripe.key، ثم default اختيارية. بدون key يرجع config repository، وarray تضبط إعدادات.

- **الناتج/الأثر — Return / effect:** قيمة الإعداد أو default في الاستخدام الحالي؛ ليست بالضرورة string ولا قيمة env مباشرة.

- **أول موضع هنا:** السطر 75.

- **مثال:** config('orders.minimum_pickup_prep_minutes', 20)

### now

- **جاية منين؟** Laravel Date helper / Carbon

- **وظيفتها:** أنشئ object يمثل الوقت الحالي بتوقيت التطبيق أو المنطقة المطلوبة؛ ليست JS Date.now التي ترجع milliseconds.

- **المدخلات — Arguments:** timezone اختيارية؛ المشروع غالبًا بدون arguments.

- **الناتج/الأثر — Return / effect:** Carbon date-time object يمكن تنسيقها أو إضافة دقائق لها؛ ليست string تلقائيًا.

- **أول موضع هنا:** السطر 75.

- **مثال:** now()->addMinutes(20)

### Schema::dropIfExists

- **جاية منين؟** Laravel Schema Builder

- **وظيفتها:** احذف الجدول كاملًا لو موجود، بما فيه بياناته. يستعمل في down للrollback؛ لو غير موجود لا يحاول حذفه كجدول موجود.

- **المدخلات — Arguments:** اسم الجدول string فقط. لا يستقبل callback ولا Blueprint.

- **الناتج/الأثر — Return / effect:** void؛ الأثر حذف الجدول فعليًا عند تنفيذ migration/rollback، مش مجرد إخفائه أو حذف صف واحد.

- **أول موضع هنا:** السطر 82.

- **مثال:** Schema::dropIfExists('order_status_logs');

### $table->dropColumn

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** سجل أمر حذف عمود أوأعمدة من جدول موجود أثناء تنفيذ Schema::table؛ قيم هذه الأعمدة تضيع عند التنفيذ.

- **المدخلات — Arguments:** اسم عمود string أوarray أسماء؛ Laravel يقبل كذلك arguments منفصلة، والمشروع يستخدم string/array.

- **الناتج/الأثر — Return / effect:** Illuminate Support Fluent يصف أمر الحذف؛ الأثر الفعلي أثناء بناء وتنفيذ migration.

- **أول موضع هنا:** السطر 92.

- **مثال:** $table->dropColumn(['phone', 'opening_hours', 'display_order']);

### $table->dropConstrainedForeignId

- **جاية منين؟** Laravel Schema Blueprint

- **وظيفتها:** احذف قيد foreign key الخاص بالعمود أولًا، ثم احذف العمود نفسه. مش حذف foreign key فقط مع ترك العمود.

- **المدخلات — Arguments:** اسم عمود string واحد مثل branch_id؛ لا يستقبل callback ولا اسم موديل.

- **الناتج/الأثر — Return / effect:** Fluent command لتعريف حذف العمود، مع تسجيل حذف القيد قبله.

- **أول موضع هنا:** السطر 89.

- **مثال:** $table->dropConstrainedForeignId('branch_id');

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** use / استيراد الاسم `Illuminate\Database\Migrations\Migration` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 4:** use / استيراد الاسم `Illuminate\Database\Schema\Blueprint` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 5:** use / استيراد الاسم `Illuminate\Support\Facades\DB` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** use / استيراد الاسم `Illuminate\Support\Facades\Schema` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 7:** use / استيراد الاسم `Illuminate\Support\Str` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('branches', function (Blueprint $table) {
            $table->decimal('delivery_fee', 10, 2)->default(25)->after('opening_hours');
            $table->boolean('delivery_enabled')->default(true)->after('delivery_fee');
            $table->boolean('is_active')->default(true)->after('delivery_enabled');
```

**السطر 9:** Laravel لما يقرأ ملف الـmigration يستلم object من anonymous class وارثة من Migration. ده return من ملف PHP نفسه، مش تشغيل up ولا إنشاء جدول دلوقتي.

**السطر 10:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 11:** Function / تعريف دالة `up`؛ تعريفها مش تشغيلها. أضف أعمدة وعلاقات وفهارس وbackfill tokens/names ثم أنشئ admin_audit_logs/app_settings. مدخلاتها: Schema وقراءات/كتابات DB وconfig defaults. ناتجها: void؛ يحتمل كتابة data موجودة عند migrate.

**السطر 12:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 13:** Schema::table: وقت تشغيل migration تعدّل هيكل الجدول الموجود `branches`. الـcallback اللي بعدها تحدد الأعمدة/القيود اللي هتتضاف أو تتشال؛ مش قراءة سجلات.

**السطر 14:** تعريف عمود `delivery_fee` بنوع `decimal`: رقم عشري بدقة ثابتة مناسب لتخزين مبالغ لما عدد الخانات محدد. الخيارات الإضافية بعد الاسم: `10, 2`. default تضبط القيمة الافتراضية على `25` لما INSERT ما يبعتش العمود.

**السطر 15:** تعريف عمود `delivery_enabled` بنوع `boolean`: قيمة صح/غلط. default تضبط القيمة الافتراضية على `true` لما INSERT ما يبعتش العمود.

**السطر 16:** تعريف عمود `is_active` بنوع `boolean`: قيمة صح/غلط. default تضبط القيمة الافتراضية على `true` لما INSERT ما يبعتش العمود.

### السطور 17–24

```php
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('branch_id')->nullable()->after('role')->constrained()->nullOnDelete();
            $table->boolean('is_active')->default(true)->after('branch_id');
        });

        Schema::table('categories', function (Blueprint $table) {
```

**السطر 17:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 19:** Schema::table: وقت تشغيل migration تعدّل هيكل الجدول الموجود `users`. الـcallback اللي بعدها تحدد الأعمدة/القيود اللي هتتضاف أو تتشال؛ مش قراءة سجلات.

**السطر 20:** تعريف عمود `branch_id` بنوع `foreignId`: عدد unsigned BIGINT يُستعمل عادة لربط سجل بجدول آخر؛ القيد الفعلي يحتاج constrained أو foreign. nullable تسمح بتخزين null بدل إلزامه بقيمة. constrained تضيف Foreign key للجدول المحدد أو المستنتج من اسم العمود. nullOnDelete تجعل المفتاح null عند حذف السجل المرتبط؛ لازم العمود يسمح بـnull.

**السطر 21:** تعريف عمود `is_active` بنوع `boolean`: قيمة صح/غلط. default تضبط القيمة الافتراضية على `true` لما INSERT ما يبعتش العمود.

**السطر 22:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 24:** Schema::table: وقت تشغيل migration تعدّل هيكل الجدول الموجود `categories`. الـcallback اللي بعدها تحدد الأعمدة/القيود اللي هتتضاف أو تتشال؛ مش قراءة سجلات.

### السطور 25–32

```php
            $table->unsignedInteger('display_order')->default(0)->after('slug');
            $table->boolean('is_active')->default(true)->after('display_order');
        });

        Schema::table('menu_items', function (Blueprint $table) {
            $table->boolean('is_active')->default(true)->after('display_order');
        });

```

**السطر 25:** تعريف عمود `display_order` بنوع `unsignedInteger`: عدد صحيح غير سالب. default تضبط القيمة الافتراضية على `0` لما INSERT ما يبعتش العمود.

**السطر 26:** تعريف عمود `is_active` بنوع `boolean`: قيمة صح/غلط. default تضبط القيمة الافتراضية على `true` لما INSERT ما يبعتش العمود.

**السطر 27:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 29:** Schema::table: وقت تشغيل migration تعدّل هيكل الجدول الموجود `menu_items`. الـcallback اللي بعدها تحدد الأعمدة/القيود اللي هتتضاف أو تتشال؛ مش قراءة سجلات.

**السطر 30:** تعريف عمود `is_active` بنوع `boolean`: قيمة صح/غلط. default تضبط القيمة الافتراضية على `true` لما INSERT ما يبعتش العمود.

**السطر 31:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 33–40

```php
        Schema::table('orders', function (Blueprint $table) {
            $table->string('tracking_token', 64)->nullable()->unique()->after('idempotency_key');
        });

        Schema::table('order_items', function (Blueprint $table) {
            $table->string('item_name')->nullable()->after('menu_item_id');
        });

```

**السطر 33:** Schema::table: وقت تشغيل migration تعدّل هيكل الجدول الموجود `orders`. الـcallback اللي بعدها تحدد الأعمدة/القيود اللي هتتضاف أو تتشال؛ مش قراءة سجلات.

**السطر 34:** تعريف عمود `tracking_token` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص. الخيارات الإضافية بعد الاسم: `64`. nullable تسمح بتخزين null بدل إلزامه بقيمة. unique تضيف قيد يمنع تكرار القيمة.

**السطر 35:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 37:** Schema::table: وقت تشغيل migration تعدّل هيكل الجدول الموجود `order_items`. الـcallback اللي بعدها تحدد الأعمدة/القيود اللي هتتضاف أو تتشال؛ مش قراءة سجلات.

**السطر 38:** تعريف عمود `item_name` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص. nullable تسمح بتخزين null بدل إلزامه بقيمة.

**السطر 39:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 41–48

```php
        DB::table('orders')->orderBy('id')->each(function (object $order): void {
            DB::table('orders')->where('id', $order->id)->update([
                'tracking_token' => Str::random(48),
            ]);
        });

        DB::table('order_items')->orderBy('id')->each(function (object $item): void {
            $name = DB::table('menu_items')->where('id', $item->menu_item_id)->value('name');
```

**السطر 41:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `DB::table(...)`: ابدأ query لجدول بالاسم من غير Eloquent Model؛ لا يقرأ rows ولا يغيّر schema بمجرد استدعائه. مدخلاتها: اسم الجدول string، مع alias اختيارية؛ في المشروع اسم فقط. العائد/الأثر: Illuminate Database Query Builder؛ كمّل عليه where ثم first/get/update/insert لتنفيذ العملية.؛ `->orderBy(...)`: تضيف ترتيبًا حسب عمود واتجاه. مدخلاتها: column وdirection. العائد/الأثر: Builder.؛ `->each(...)`: تنفذ callback لكل عنصر لأثر جانبي. مدخلاتها: callback. العائد/الأثر: نفس Collection؛ return false قد توقف المرور.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 42:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `DB::table(...)`: ابدأ query لجدول بالاسم من غير Eloquent Model؛ لا يقرأ rows ولا يغيّر schema بمجرد استدعائه. مدخلاتها: اسم الجدول string، مع alias اختيارية؛ في المشروع اسم فقط. العائد/الأثر: Illuminate Database Query Builder؛ كمّل عليه where ثم first/get/update/insert لتنفيذ العملية.؛ `->where(...)`: تضيف شرط فلترة أو مجموعة شروط. مدخلاتها: column/operator/value أو closure. العائد/الأثر: Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.؛ `->update(...)`: تكتب تغييرات في DB. مدخلاتها: attributes array. العائد/الأثر: Boolean على model أو عدد صفوف على builder؛ حسب المستقبِل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 43:** PHP array entry: المفتاح `tracking_token` مرتبط بالقيمة `Str::random(48)`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 44:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 45:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 47:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `DB::table(...)`: ابدأ query لجدول بالاسم من غير Eloquent Model؛ لا يقرأ rows ولا يغيّر schema بمجرد استدعائه. مدخلاتها: اسم الجدول string، مع alias اختيارية؛ في المشروع اسم فقط. العائد/الأثر: Illuminate Database Query Builder؛ كمّل عليه where ثم first/get/update/insert لتنفيذ العملية.؛ `->orderBy(...)`: تضيف ترتيبًا حسب عمود واتجاه. مدخلاتها: column وdirection. العائد/الأثر: Builder.؛ `->each(...)`: تنفذ callback لكل عنصر لأثر جانبي. مدخلاتها: callback. العائد/الأثر: نفس Collection؛ return false قد توقف المرور.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 48:** Assignment / إسناد: احسب `DB::table('menu_items')->where('id', $item->menu_item_id)->value('name')` الأول وخزّن النتيجة في `$name`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

### السطور 49–56

```php
            DB::table('order_items')->where('id', $item->id)->update([
                'item_name' => $name ?: 'Menu item',
            ]);
        });

        Schema::create('admin_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
```

**السطر 49:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `DB::table(...)`: ابدأ query لجدول بالاسم من غير Eloquent Model؛ لا يقرأ rows ولا يغيّر schema بمجرد استدعائه. مدخلاتها: اسم الجدول string، مع alias اختيارية؛ في المشروع اسم فقط. العائد/الأثر: Illuminate Database Query Builder؛ كمّل عليه where ثم first/get/update/insert لتنفيذ العملية.؛ `->where(...)`: تضيف شرط فلترة أو مجموعة شروط. مدخلاتها: column/operator/value أو closure. العائد/الأثر: Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.؛ `->update(...)`: تكتب تغييرات في DB. مدخلاتها: attributes array. العائد/الأثر: Boolean على model أو عدد صفوف على builder؛ حسب المستقبِل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 50:** PHP array entry: المفتاح `item_name` مرتبط بالقيمة `$name ?: 'Menu item'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 51:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 52:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 54:** Schema::create: وقت تشغيل migration تنشئ جدول `admin_audit_logs`. الـfunction اللي بعدها تستقبل Blueprint باسم $table وتوصف الأعمدة؛ مش بتضيف صفوف بيانات عملاء.

**السطر 55:** توصف عمود id كمفتاح أساسي Primary key من نوع unsigned BIGINT مع زيادة تلقائية في قواعد البيانات المعتادة؛ كل صف له هوية مختلفة.

**السطر 56:** تعريف عمود `user_id` بنوع `foreignId`: عدد unsigned BIGINT يُستعمل عادة لربط سجل بجدول آخر؛ القيد الفعلي يحتاج constrained أو foreign. nullable تسمح بتخزين null بدل إلزامه بقيمة. constrained تضيف Foreign key للجدول المحدد أو المستنتج من اسم العمود. nullOnDelete تجعل المفتاح null عند حذف السجل المرتبط؛ لازم العمود يسمح بـnull.

### السطور 57–64

```php
            $table->string('action');
            $table->string('subject_type');
            $table->unsignedBigInteger('subject_id')->nullable();
            $table->json('details')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->index(['subject_type', 'subject_id']);
        });

```

**السطر 57:** تعريف عمود `action` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص.

**السطر 58:** تعريف عمود `subject_type` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص.

**السطر 59:** تعريف عمود `subject_id` بنوع `unsignedBigInteger`: عدد صحيح كبير غير سالب. nullable تسمح بتخزين null بدل إلزامه بقيمة.

**السطر 60:** تعريف عمود `details` بنوع `json`: بيانات JSON. nullable تسمح بتخزين null بدل إلزامه بقيمة.

**السطر 61:** تعريف عمود `created_at` بنوع `timestamp`: تاريخ ووقت.

**السطر 62:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$table->index(...)`: عرّف database index على عمود أوأكثر لتسريع عمليات بحث مناسبة؛ index عادي لا يمنع تكرار القيم. مدخلاتها: اسم عمود string أوarray أسماء أعمدة، ثم اسم index وalgorithm اختياريان. العائد/الأثر: IndexDefinition.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 63:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 65–72

```php
        Schema::create('app_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->timestamps();
        });

        DB::table('app_settings')->insert([
```

**السطر 65:** Schema::create: وقت تشغيل migration تنشئ جدول `app_settings`. الـfunction اللي بعدها تستقبل Blueprint باسم $table وتوصف الأعمدة؛ مش بتضيف صفوف بيانات عملاء.

**السطر 66:** توصف عمود id كمفتاح أساسي Primary key من نوع unsigned BIGINT مع زيادة تلقائية في قواعد البيانات المعتادة؛ كل صف له هوية مختلفة.

**السطر 67:** تعريف عمود `key` بنوع `string`: نص محدود الطول؛ الافتراضي 255 حرفًا لو مفيش طول مخصص. unique تضيف قيد يمنع تكرار القيمة.

**السطر 68:** تعريف عمود `value` بنوع `text`: نص طويل. nullable تسمح بتخزين null بدل إلزامه بقيمة.

**السطر 69:** توصف العمودين created_at وupdated_at. Eloquent تقدر تحدّث قيمهم تلقائيًا عند إنشاء/تحديث model؛ تعريفهم مش إدخال صف الآن.

**السطر 70:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 72:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `DB::table(...)`: ابدأ query لجدول بالاسم من غير Eloquent Model؛ لا يقرأ rows ولا يغيّر schema بمجرد استدعائه. مدخلاتها: اسم الجدول string، مع alias اختيارية؛ في المشروع اسم فقط. العائد/الأثر: Illuminate Database Query Builder؛ كمّل عليه where ثم first/get/update/insert لتنفيذ العملية.؛ `->insert(...)`: تضيف صفًا/صفوفًا مباشرة للجدول. مدخلاتها: attributes/rows. العائد/الأثر: Boolean عادة؛ لا تشغّل كل model events مثل create.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 73–80

```php
            ['key' => 'default_delivery_fee', 'value' => (string) config('orders.delivery_fee', 25), 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'minimum_pickup_prep_minutes', 'value' => (string) config('orders.minimum_pickup_prep_minutes', 20), 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'order_promise_minutes', 'value' => (string) config('orders.order_promise_minutes', 3), 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    public function down(): void
    {
```

**السطر 73:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `config(...)`: اقرأ إعدادًا من ملفات config بالقيمة المحملة وقت تشغيل التطبيق؛ النقطة تفصل الملف عن المفتاح الداخلي. مدخلاتها: key بصيغة dot notation مثل services.stripe.key، ثم default اختيارية. بدون key يرجع config repository، وarray تضبط إعدادات. العائد/الأثر: قيمة الإعداد أو default في الاستخدام الحالي؛ ليست بالضرورة string ولا قيمة env مباشرة.؛ `now(...)`: أنشئ object يمثل الوقت الحالي بتوقيت التطبيق أو المنطقة المطلوبة؛ ليست JS Date.now التي ترجع milliseconds. مدخلاتها: timezone اختيارية؛ المشروع غالبًا بدون arguments. العائد/الأثر: Carbon date-time object يمكن تنسيقها أو إضافة دقائق لها؛ ليست string تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 74:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `config(...)`: اقرأ إعدادًا من ملفات config بالقيمة المحملة وقت تشغيل التطبيق؛ النقطة تفصل الملف عن المفتاح الداخلي. مدخلاتها: key بصيغة dot notation مثل services.stripe.key، ثم default اختيارية. بدون key يرجع config repository، وarray تضبط إعدادات. العائد/الأثر: قيمة الإعداد أو default في الاستخدام الحالي؛ ليست بالضرورة string ولا قيمة env مباشرة.؛ `now(...)`: أنشئ object يمثل الوقت الحالي بتوقيت التطبيق أو المنطقة المطلوبة؛ ليست JS Date.now التي ترجع milliseconds. مدخلاتها: timezone اختيارية؛ المشروع غالبًا بدون arguments. العائد/الأثر: Carbon date-time object يمكن تنسيقها أو إضافة دقائق لها؛ ليست string تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 75:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `config(...)`: اقرأ إعدادًا من ملفات config بالقيمة المحملة وقت تشغيل التطبيق؛ النقطة تفصل الملف عن المفتاح الداخلي. مدخلاتها: key بصيغة dot notation مثل services.stripe.key، ثم default اختيارية. بدون key يرجع config repository، وarray تضبط إعدادات. العائد/الأثر: قيمة الإعداد أو default في الاستخدام الحالي؛ ليست بالضرورة string ولا قيمة env مباشرة.؛ `now(...)`: أنشئ object يمثل الوقت الحالي بتوقيت التطبيق أو المنطقة المطلوبة؛ ليست JS Date.now التي ترجع milliseconds. مدخلاتها: timezone اختيارية؛ المشروع غالبًا بدون arguments. العائد/الأثر: Carbon date-time object يمكن تنسيقها أو إضافة دقائق لها؛ ليست string تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 76:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 77:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 79:** Function / تعريف دالة `down`؛ تعريفها مش تشغيلها. احذف الجداول والأعمدة والفورين كي بالترتيب العكسي؛ يمسح بيانات features دي. مدخلاتها: لا شيء. ناتجها: void.

**السطر 80:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

### السطور 81–88

```php
        Schema::dropIfExists('app_settings');
        Schema::dropIfExists('admin_audit_logs');

        Schema::table('order_items', fn (Blueprint $table) => $table->dropColumn('item_name'));
        Schema::table('orders', fn (Blueprint $table) => $table->dropColumn('tracking_token'));
        Schema::table('menu_items', fn (Blueprint $table) => $table->dropColumn('is_active'));
        Schema::table('categories', fn (Blueprint $table) => $table->dropColumn(['display_order', 'is_active']));
        Schema::table('users', function (Blueprint $table) {
```

**السطر 81:** Schema::dropIfExists: تحذف جدول `app_settings` لو موجود. ده بيحذف بياناته كمان؛ السطر غالبًا في down للرجوع عن migration، فمتجربوش على قاعدة حقيقية.

**السطر 82:** Schema::dropIfExists: تحذف جدول `admin_audit_logs` لو موجود. ده بيحذف بياناته كمان؛ السطر غالبًا في down للرجوع عن migration، فمتجربوش على قاعدة حقيقية.

**السطر 84:** Schema::table: وقت تشغيل migration تعدّل هيكل الجدول الموجود `order_items`. الـcallback اللي بعدها تحدد الأعمدة/القيود اللي هتتضاف أو تتشال؛ مش قراءة سجلات.

**السطر 85:** Schema::table: وقت تشغيل migration تعدّل هيكل الجدول الموجود `orders`. الـcallback اللي بعدها تحدد الأعمدة/القيود اللي هتتضاف أو تتشال؛ مش قراءة سجلات.

**السطر 86:** Schema::table: وقت تشغيل migration تعدّل هيكل الجدول الموجود `menu_items`. الـcallback اللي بعدها تحدد الأعمدة/القيود اللي هتتضاف أو تتشال؛ مش قراءة سجلات.

**السطر 87:** Schema::table: وقت تشغيل migration تعدّل هيكل الجدول الموجود `categories`. الـcallback اللي بعدها تحدد الأعمدة/القيود اللي هتتضاف أو تتشال؛ مش قراءة سجلات.

**السطر 88:** Schema::table: وقت تشغيل migration تعدّل هيكل الجدول الموجود `users`. الـcallback اللي بعدها تحدد الأعمدة/القيود اللي هتتضاف أو تتشال؛ مش قراءة سجلات.

### السطور 89–95

```php
            $table->dropConstrainedForeignId('branch_id');
            $table->dropColumn('is_active');
        });
        Schema::table('branches', fn (Blueprint $table) => $table->dropColumn(['delivery_fee', 'delivery_enabled', 'is_active']));
    }
};

```

**السطر 89:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$table->dropConstrainedForeignId(...)`: احذف قيد foreign key الخاص بالعمود أولًا، ثم احذف العمود نفسه. مش حذف foreign key فقط مع ترك العمود. مدخلاتها: اسم عمود string واحد مثل branch_id؛ لا يستقبل callback ولا اسم موديل. العائد/الأثر: Fluent command لتعريف حذف العمود، مع تسجيل حذف القيد قبله.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 90:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$table->dropColumn(...)`: سجل أمر حذف عمود أوأعمدة من جدول موجود أثناء تنفيذ Schema::table؛ قيم هذه الأعمدة تضيع عند التنفيذ. مدخلاتها: اسم عمود string أوarray أسماء؛ Laravel يقبل كذلك arguments منفصلة، والمشروع يستخدم string/array. العائد/الأثر: Illuminate Support Fluent يصف أمر الحذف؛ الأثر الفعلي أثناء بناء وتنفيذ migration.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 91:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 92:** Schema::table: وقت تشغيل migration تعدّل هيكل الجدول الموجود `branches`. الـcallback اللي بعدها تحدد الأعمدة/القيود اللي هتتضاف أو تتشال؛ مش قراءة سجلات.

**السطر 93:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 94:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
