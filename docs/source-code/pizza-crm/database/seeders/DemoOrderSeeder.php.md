# طلبات تجريبية وسجلات الحالة

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `database/seeders/DemoOrderSeeder.php` · 109 سطر.

**وظيفة الملف:** يسجل أمثلة حالات مختلفة بمفاتيح demo-order-index؛ يعيد بناء بنود وسجل كل طلب demo مطابق للمفتاح. مش آمن تفترض إن db:seed لا يغير الطلبات القديمة: هو بيغيّر صفوف demo المقصودة. الأسعار من pivot لكن رسوم seeder من config بخلاف خدمة الطلب الحقيقية التي تستخدم الفرع.

**نوعه:** support. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../database/seeders/DemoOrderSeeder.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Models/Order.php](../../app/Models/Order.php.md)

- [pizza-crm/app/Models/OrderStatusLog.php](../../app/Models/OrderStatusLog.php.md)

- [pizza-crm/app/Models/User.php](../../app/Models/User.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderStatusLog;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DemoOrderSeeder extends Seeder
{
    public function run(): void
    {
        $staff = User::whereIn('role', ['staff', 'admin'])->first();
        $examples = [
            ['new', 'delivery', 1, 'Mariam Adel', '01090000101', [1, 24]],
            ['accepted', 'pickup', 2, 'Omar Hany', '01090000102', [5]],
            ['preparing', 'delivery', 3, 'Nour Ahmed', '01090000103', [2, 14]],
            ['ready', 'pickup', 1, 'Youssef Ali', '01090000104', [3, 20]],
            ['out_for_delivery', 'delivery', 2, 'Salma Tarek', '01090000105', [6, 25]],
            ['picked_up', 'pickup', 3, 'Karim Mostafa', '01090000106', [7, 18]],
            ['completed', 'delivery', 1, 'Farah Samir', '01090000107', [4, 28]],
            ['completed', 'pickup', 2, 'Ziad Emad', '01090000108', [5, 17]],
            ['cancelled', 'delivery', 3, 'Laila Wael', '01090000109', [1]],
            ['rejected', 'pickup', 1, 'Adam Khaled', '01090000110', [8]],
        ];

        foreach ($examples as $index => [$status, $type, $branchId, $name, $phone, $itemIds]) {
            $createdAt = now()->subMinutes(($index + 1) * 7);
            $order = Order::updateOrCreate(
                ['idempotency_key' => "demo-order-{$index}"],
                [
                    'branch_id' => $branchId,
                    'tracking_token' => Str::random(48),
                    'order_type' => $type,
                    'pickup_time' => $type === 'pickup' ? now()->addMinutes(35 + $index * 5) : null,
                    'customer_name' => $name,
                    'customer_phone' => $phone,
                    'delivery_address' => $type === 'delivery' ? (12 + $index).' Demo Street, Cairo' : null,
                    'payment_method' => $index % 3 === 0 ? 'card' : 'cash',
                    'payment_status' => $index % 3 === 0 ? 'paid' : 'unpaid',
                    'payment_gateway' => $index % 3 === 0 ? 'stripe' : null,
                    'gateway_reference' => $index % 3 === 0 ? "pi_demo_{$index}" : null,
                    'status' => $status,
                    'status_reason' => $status === 'cancelled' ? 'Customer changed their plans.' : ($status === 'rejected' ? 'Kitchen capacity reached.' : null),
                    'total_price' => 0,
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ],
            );

            $order->items()->delete();
            $total = 0;
            foreach ($itemIds as $position => $menuItemId) {
                $pivot = DB::table('branch_menu_item')->where('branch_id', $branchId)->where('menu_item_id', $menuItemId)->first();
                if (! $pivot) {
                    continue;
                }
                $quantity = $position === 0 && $index % 2 === 0 ? 2 : 1;
                $order->items()->create([
                    'menu_item_id' => $menuItemId,
                    'item_name' => DB::table('menu_items')->where('id', $menuItemId)->value('name') ?: 'Menu item',
                    'quantity' => $quantity,
                    'price' => $pivot->price,
                    'notes' => $position === 0 && $index % 2 === 0 ? 'Demo note: extra crispy, please.' : null,
                ]);
                $total += (float) $pivot->price * $quantity;
            }
            if ($type === 'delivery') {
                $total += (float) config('orders.delivery_fee', 25);
            }
            $order->update(['total_price' => $total, 'created_at' => $createdAt, 'updated_at' => $createdAt]);

            $order->statusLogs()->delete();
            foreach ($this->statusPath($status, $type) as $step => [$from, $to]) {
                OrderStatusLog::create([
                    'order_id' => $order->id,
                    'user_id' => $staff?->id,
                    'from_status' => $from,
                    'to_status' => $to,
                    'reason' => in_array($to, ['cancelled', 'rejected'], true) ? $order->status_reason : null,
                    'created_at' => $createdAt->copy()->addMinutes($step * 2),
                ]);
            }
        }
    }

    private function statusPath(string $status, string $type): array
    {
        $delivery = ['new', 'accepted', 'preparing', 'ready', 'out_for_delivery', 'completed'];
        $pickup = ['new', 'accepted', 'preparing', 'ready', 'picked_up', 'completed'];
        $path = $type === 'pickup' ? $pickup : $delivery;
        if (in_array($status, ['cancelled', 'rejected'], true)) {
            $path = ['new', $status];
        } else {
            $path = array_slice($path, 0, array_search($status, $path, true) + 1);
        }

        $logs = [];
        foreach ($path as $index => $to) {
            $logs[] = [$index === 0 ? null : $path[$index - 1], $to];
        }

        return $logs;
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### run

ابنِ طلبات fake مع items/totals/status logs وبيانات توصيل واستلام توضيحية.

- **بتاخد إيه؟ Inputs:** examples array وcatalogue الموجود.

- **بترجع/بتغيّر إيه؟ Return / effect:** void؛ تعديلات DB عند تشغيل seeder.

### statusPath

كوّن خطوات الحالة من new لحد الحالة المطلوبة؛ pickup له picked_up وdelivery له out_for_delivery، والإلغاء/الرفض مسار أقصر.

- **بتاخد إيه؟ Inputs:** string status وstring type.

- **بترجع/بتغيّر إيه؟ Return / effect:** array من الأزواج [from,to] أول from فيها null.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### User::whereIn

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تضيف شرط انتماء لقائمة قيم.

- **المدخلات — Arguments:** column وvalues.

- **الناتج/الأثر — Return / effect:** Builder؛ Collection.whereIn بدلًا منها تعيد مجموعة مفلترة.

- **أول موضع هنا:** السطر 16.

### ->first

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تنفّذ query لجلب أول صف.

- **المدخلات — Arguments:** columns اختيارية.

- **الناتج/الأثر — Return / effect:** model أو stdClass حسب builder، أو null.

- **أول موضع هنا:** السطر 57.

### ->subMinutes

- **جاية منين؟** Carbon

- **وظيفتها:** تطرح دقائق.

- **المدخلات — Arguments:** count.

- **الناتج/الأثر — Return / effect:** Carbon بعد التعديل في النوع mutable.

- **أول موضع هنا:** السطر 31.

### now

- **جاية منين؟** Laravel Date helper / Carbon

- **وظيفتها:** أنشئ object يمثل الوقت الحالي بتوقيت التطبيق أو المنطقة المطلوبة؛ ليست JS Date.now التي ترجع milliseconds.

- **المدخلات — Arguments:** timezone اختيارية؛ المشروع غالبًا بدون arguments.

- **الناتج/الأثر — Return / effect:** Carbon date-time object يمكن تنسيقها أو إضافة دقائق لها؛ ليست string تلقائيًا.

- **أول موضع هنا:** السطر 38.

- **مثال:** now()->addMinutes(20)

### Order::updateOrCreate

- **جاية منين؟** Laravel Eloquent

- **وظيفتها:** ابحث بالشروط؛ حدّث لو موجود أو أنشئ لو مفيش. مش معناها transaction مستقلة تمنع كل race condition تلقائيًا.

- **المدخلات — Arguments:** attributes للبحث ثم values للكتابة.

- **الناتج/الأثر — Return / effect:** Model محفوظة.

- **أول موضع هنا:** السطر 32.

- **مثال:** AppSetting::updateOrCreate(['key' => $key], ['value' => $value]);

### Str::random

- **جاية منين؟** Laravel Str

- **وظيفتها:** ولّد string عشوائية آمنة للاستخدام كtracking token أو جزء اسم ملف؛ الطول لا يلغي الحاجة للتحكم في صلاحيات الوصول.

- **المدخلات — Arguments:** length int.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 36.

- **مثال:** Str::random(48)

### ->addMinutes

- **جاية منين؟** Carbon

- **وظيفتها:** تضيف دقائق للتاريخ.

- **المدخلات — Arguments:** count.

- **الناتج/الأثر — Return / effect:** نفس Carbon المعدلة في النوع mutable المعتاد.

- **أول موضع هنا:** السطر 84.

### $order->items

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** بنود الطلب المحفوظة باسم وسعر وقت الشراء.

- **المدخلات — Arguments:** order_items.order_id.

- **الناتج/الأثر — Return / effect:** HasMany؛ items() تبني query وitems property تجيب collection.

- **أول موضع هنا:** السطر 62.

- **تكملة التعريف:** [app/Models/Order.php](../../app/Models/Order.php.md)، عند السطر 86.

### ->delete

- **جاية منين؟** Eloquent

- **وظيفتها:** تحذف صفًا/صفوفًا حسب المستقبِل.

- **المدخلات — Arguments:** بدون مدخلات في model المعتاد.

- **الناتج/الأثر — Return / effect:** نتيجة/عدد حسب model أو builder؛ حذف فعلي وليس إخفاء CSS.

- **أول موضع هنا:** السطر 76.

### DB::table

- **جاية منين؟** Laravel Database Query Builder

- **وظيفتها:** ابدأ query لجدول بالاسم من غير Eloquent Model؛ لا يقرأ rows ولا يغيّر schema بمجرد استدعائه.

- **المدخلات — Arguments:** اسم الجدول string، مع alias اختيارية؛ في المشروع اسم فقط.

- **الناتج/الأثر — Return / effect:** Illuminate Database Query Builder؛ كمّل عليه where ثم first/get/update/insert لتنفيذ العملية.

- **أول موضع هنا:** السطر 64.

- **مثال:** DB::table('branch_menu_item')->where('branch_id', $branch->id)->first();

### ->where

- **جاية منين؟** Laravel Query Builder

- **وظيفتها:** تضيف شرط فلترة أو مجموعة شروط.

- **المدخلات — Arguments:** column/operator/value أو closure.

- **الناتج/الأثر — Return / effect:** Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.

- **أول موضع هنا:** السطر 64.

### ->create

- **جاية منين؟** Eloquent/Relation

- **وظيفتها:** تنشئ صفًا ببيانات ملء مسموحة.

- **المدخلات — Arguments:** attributes array.

- **الناتج/الأثر — Return / effect:** model المحفوظ؛ ليست validation أو authorization تلقائية.

- **أول موضع هنا:** السطر 62.

### ->value

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تقرأ قيمة عمود من أول نتيجة.

- **المدخلات — Arguments:** column.

- **الناتج/الأثر — Return / effect:** scalar أو null.

- **أول موضع هنا:** السطر 64.

### config

- **جاية منين؟** Laravel helper

- **وظيفتها:** اقرأ إعدادًا من ملفات config بالقيمة المحملة وقت تشغيل التطبيق؛ النقطة تفصل الملف عن المفتاح الداخلي.

- **المدخلات — Arguments:** key بصيغة dot notation مثل services.stripe.key، ثم default اختيارية. بدون key يرجع config repository، وarray تضبط إعدادات.

- **الناتج/الأثر — Return / effect:** قيمة الإعداد أو default في الاستخدام الحالي؛ ليست بالضرورة string ولا قيمة env مباشرة.

- **أول موضع هنا:** السطر 72.

- **مثال:** config('orders.minimum_pickup_prep_minutes', 20)

### $order->update

- **جاية منين؟** Eloquent

- **وظيفتها:** تكتب تغييرات في DB.

- **المدخلات — Arguments:** attributes array.

- **الناتج/الأثر — Return / effect:** Boolean على model أو عدد صفوف على builder؛ حسب المستقبِل.

- **أول موضع هنا:** السطر 74.

### $order->statusLogs

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** سجل انتقالات الحالة مرتب created_at تصاعديًا.

- **المدخلات — Arguments:** order_status_logs.order_id.

- **الناتج/الأثر — Return / effect:** HasMany مع orderBy.

- **أول موضع هنا:** السطر 76.

- **تكملة التعريف:** [app/Models/Order.php](../../app/Models/Order.php.md)، عند السطر 91.

### $this->statusPath

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** كوّن خطوات الحالة من new لحد الحالة المطلوبة؛ pickup له picked_up وdelivery له out_for_delivery، والإلغاء/الرفض مسار أقصر.

- **المدخلات — Arguments:** string status وstring type.

- **الناتج/الأثر — Return / effect:** array من الأزواج [from,to] أول from فيها null.

- **أول موضع هنا:** السطر 77.

### OrderStatusLog::create

- **جاية منين؟** Eloquent/Relation

- **وظيفتها:** تنشئ صفًا ببيانات ملء مسموحة.

- **المدخلات — Arguments:** attributes array.

- **الناتج/الأثر — Return / effect:** model المحفوظ؛ ليست validation أو authorization تلقائية.

- **أول موضع هنا:** السطر 78.

### in_array

- **جاية منين؟** PHP built-in

- **وظيفتها:** هل قيمة موجودة في array؟ المعامل الثالث true يمنع تحويل الأنواع أثناء المقارنة.

- **المدخلات — Arguments:** needle ثم haystack ثم strict bool.

- **الناتج/الأثر — Return / effect:** bool.

- **أول موضع هنا:** السطر 95.

- **مثال:** in_array($status, $allowed, true)

### $createdAt->copy

- **جاية منين؟** Carbon

- **وظيفتها:** تنسخ object التاريخ للتعديل بدون تغيير الأصل.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** Carbon جديدة.

- **أول موضع هنا:** السطر 84.

### array_slice

- **جاية منين؟** PHP built-in array function

- **وظيفتها:** تأخذ جزءًا من array حسب موضع العناصر، وليس قيمة مفاتيحها؛ مثل أول عدد من النتائج. لا تحذف الجزء من الأصل زي array_splice.

- **المدخلات — Arguments:** array، offset: البداية، length اختياري، preserve_keys اختياري. offset أو length السالبة لها معنى العد من النهاية.

- **الناتج/الأثر — Return / effect:** array جديدة بالجزء المطلوب؛ مفاتيح string محفوظة، والأرقام يعاد ترقيمها افتراضيًا إلا لو preserve_keys=true.

- **أول موضع هنا:** السطر 98.

### array_search

- **جاية منين؟** PHP built-in array search function

- **وظيفتها:** تدور على قيمة وترجع مفتاح أول تطابق؛ مهم نميز المفتاح0 عن عدم العثور. strict=true تستخدم تطابق النوع والقيمة.

- **المدخلات — Arguments:** needle: القيمة المطلوبة، haystack: array، strict اختياري false افتراضيًا.

- **الناتج/الأثر — Return / effect:** int أو string للمفتاح، أو false لو مش موجودة. افحص النتيجة بـ !== false؛ لأن if($result) هتعتبر المفتاح0 فشلًا بالغلط.

- **أول موضع هنا:** السطر 98.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderStatusLog;
use App\Models\User;
use Illuminate\Database\Seeder;
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** namespace بتحدد نطاق أسماء الكلاس `Database\Seeders`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 5:** use / استيراد الاسم `App\Models\Order` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** use / استيراد الاسم `App\Models\OrderStatusLog` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 7:** use / استيراد الاسم `App\Models\User` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 8:** use / استيراد الاسم `Illuminate\Database\Seeder` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DemoOrderSeeder extends Seeder
{
    public function run(): void
    {
        $staff = User::whereIn('role', ['staff', 'admin'])->first();
```

**السطر 9:** use / استيراد الاسم `Illuminate\Support\Facades\DB` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 10:** use / استيراد الاسم `Illuminate\Support\Str` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 12:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

**السطر 13:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 14:** Function / تعريف دالة `run`؛ تعريفها مش تشغيلها. ابنِ طلبات fake مع items/totals/status logs وبيانات توصيل واستلام توضيحية. مدخلاتها: examples array وcatalogue الموجود. ناتجها: void؛ تعديلات DB عند تشغيل seeder.

**السطر 15:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 16:** Assignment / إسناد: احسب `User::whereIn('role', ['staff', 'admin'])->first()` الأول وخزّن النتيجة في `$staff`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

### السطور 17–24

```php
        $examples = [
            ['new', 'delivery', 1, 'Mariam Adel', '01090000101', [1, 24]],
            ['accepted', 'pickup', 2, 'Omar Hany', '01090000102', [5]],
            ['preparing', 'delivery', 3, 'Nour Ahmed', '01090000103', [2, 14]],
            ['ready', 'pickup', 1, 'Youssef Ali', '01090000104', [3, 20]],
            ['out_for_delivery', 'delivery', 2, 'Salma Tarek', '01090000105', [6, 25]],
            ['picked_up', 'pickup', 3, 'Karim Mostafa', '01090000106', [7, 18]],
            ['completed', 'delivery', 1, 'Farah Samir', '01090000107', [4, 28]],
```

**السطر 17:** Assignment / إسناد: احسب `[` الأول وخزّن النتيجة في `$examples`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 18:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 19:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 20:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 21:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 22:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 23:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 24:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 25–32

```php
            ['completed', 'pickup', 2, 'Ziad Emad', '01090000108', [5, 17]],
            ['cancelled', 'delivery', 3, 'Laila Wael', '01090000109', [1]],
            ['rejected', 'pickup', 1, 'Adam Khaled', '01090000110', [8]],
        ];

        foreach ($examples as $index => [$status, $type, $branchId, $name, $phone, $itemIds]) {
            $createdAt = now()->subMinutes(($index + 1) * 7);
            $order = Order::updateOrCreate(
```

**السطر 25:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 26:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 27:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 28:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 30:** Loop / حلقة مرور؛ تعيد تنفيذ الجسم حسب الشرط/العناصر. راقب المتغير الحالي وما الذي يتغيّر في كل دورة.

**السطر 31:** Assignment / إسناد: احسب `now()->subMinutes(($index + 1) * 7)` الأول وخزّن النتيجة في `$createdAt`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 32:** Assignment / إسناد: احسب `Order::updateOrCreate(` الأول وخزّن النتيجة في `$order`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

### السطور 33–40

```php
                ['idempotency_key' => "demo-order-{$index}"],
                [
                    'branch_id' => $branchId,
                    'tracking_token' => Str::random(48),
                    'order_type' => $type,
                    'pickup_time' => $type === 'pickup' ? now()->addMinutes(35 + $index * 5) : null,
                    'customer_name' => $name,
                    'customer_phone' => $phone,
```

**السطر 33:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 34:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 35:** PHP array entry: المفتاح `branch_id` مرتبط بالقيمة `$branchId`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 36:** PHP array entry: المفتاح `tracking_token` مرتبط بالقيمة `Str::random(48)`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 37:** PHP array entry: المفتاح `order_type` مرتبط بالقيمة `$type`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 38:** PHP array entry: المفتاح `pickup_time` مرتبط بالقيمة `$type === 'pickup' ? now()->addMinutes(35 + $index * 5) : null`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 39:** PHP array entry: المفتاح `customer_name` مرتبط بالقيمة `$name`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 40:** PHP array entry: المفتاح `customer_phone` مرتبط بالقيمة `$phone`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 41–48

```php
                    'delivery_address' => $type === 'delivery' ? (12 + $index).' Demo Street, Cairo' : null,
                    'payment_method' => $index % 3 === 0 ? 'card' : 'cash',
                    'payment_status' => $index % 3 === 0 ? 'paid' : 'unpaid',
                    'payment_gateway' => $index % 3 === 0 ? 'stripe' : null,
                    'gateway_reference' => $index % 3 === 0 ? "pi_demo_{$index}" : null,
                    'status' => $status,
                    'status_reason' => $status === 'cancelled' ? 'Customer changed their plans.' : ($status === 'rejected' ? 'Kitchen capacity reached.' : null),
                    'total_price' => 0,
```

**السطر 41:** PHP array entry: المفتاح `delivery_address` مرتبط بالقيمة `$type === 'delivery' ? (12 + $index).' Demo Street, Cairo' : null`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 42:** PHP array entry: المفتاح `payment_method` مرتبط بالقيمة `$index % 3 === 0 ? 'card' : 'cash'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 43:** PHP array entry: المفتاح `payment_status` مرتبط بالقيمة `$index % 3 === 0 ? 'paid' : 'unpaid'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 44:** PHP array entry: المفتاح `payment_gateway` مرتبط بالقيمة `$index % 3 === 0 ? 'stripe' : null`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 45:** PHP array entry: المفتاح `gateway_reference` مرتبط بالقيمة `$index % 3 === 0 ? "pi_demo_{$index}" : null`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 46:** PHP array entry: المفتاح `status` مرتبط بالقيمة `$status`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 47:** PHP array entry: المفتاح `status_reason` مرتبط بالقيمة `$status === 'cancelled' ? 'Customer changed their plans.' : ($status === 'rejected' ? 'Kitchen capacity reached.' : null)`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 48:** PHP array entry: المفتاح `total_price` مرتبط بالقيمة `0`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 49–56

```php
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ],
            );

            $order->items()->delete();
            $total = 0;
            foreach ($itemIds as $position => $menuItemId) {
```

**السطر 49:** PHP array entry: المفتاح `created_at` مرتبط بالقيمة `$createdAt`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 50:** PHP array entry: المفتاح `updated_at` مرتبط بالقيمة `$createdAt`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 51:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 52:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 54:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$order->items(...)`: بنود الطلب المحفوظة باسم وسعر وقت الشراء. مدخلاتها: order_items.order_id. العائد/الأثر: HasMany؛ items() تبني query وitems property تجيب collection.؛ `->delete(...)`: تحذف صفًا/صفوفًا حسب المستقبِل. مدخلاتها: بدون مدخلات في model المعتاد. العائد/الأثر: نتيجة/عدد حسب model أو builder؛ حذف فعلي وليس إخفاء CSS.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 55:** Assignment / إسناد: احسب `0` الأول وخزّن النتيجة في `$total`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 56:** Loop / حلقة مرور؛ تعيد تنفيذ الجسم حسب الشرط/العناصر. راقب المتغير الحالي وما الذي يتغيّر في كل دورة.

### السطور 57–64

```php
                $pivot = DB::table('branch_menu_item')->where('branch_id', $branchId)->where('menu_item_id', $menuItemId)->first();
                if (! $pivot) {
                    continue;
                }
                $quantity = $position === 0 && $index % 2 === 0 ? 2 : 1;
                $order->items()->create([
                    'menu_item_id' => $menuItemId,
                    'item_name' => DB::table('menu_items')->where('id', $menuItemId)->value('name') ?: 'Menu item',
```

**السطر 57:** Assignment / إسناد: احسب `DB::table('branch_menu_item')->where('branch_id', $branchId)->where('menu_item_id', $menuItemId)->first()` الأول وخزّن النتيجة في `$pivot`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 58:** if تختبر الشرط `! $pivot`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 59:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 60:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 61:** Assignment / إسناد: احسب `$position === 0 && $index % 2 === 0 ? 2 : 1` الأول وخزّن النتيجة في `$quantity`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 62:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$order->items(...)`: بنود الطلب المحفوظة باسم وسعر وقت الشراء. مدخلاتها: order_items.order_id. العائد/الأثر: HasMany؛ items() تبني query وitems property تجيب collection.؛ `->create(...)`: تنشئ صفًا ببيانات ملء مسموحة. مدخلاتها: attributes array. العائد/الأثر: model المحفوظ؛ ليست validation أو authorization تلقائية.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 63:** PHP array entry: المفتاح `menu_item_id` مرتبط بالقيمة `$menuItemId`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 64:** PHP array entry: المفتاح `item_name` مرتبط بالقيمة `DB::table('menu_items')->where('id', $menuItemId)->value('name') ?: 'Menu item'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 65–72

```php
                    'quantity' => $quantity,
                    'price' => $pivot->price,
                    'notes' => $position === 0 && $index % 2 === 0 ? 'Demo note: extra crispy, please.' : null,
                ]);
                $total += (float) $pivot->price * $quantity;
            }
            if ($type === 'delivery') {
                $total += (float) config('orders.delivery_fee', 25);
```

**السطر 65:** PHP array entry: المفتاح `quantity` مرتبط بالقيمة `$quantity`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 66:** PHP array entry: المفتاح `price` مرتبط بالقيمة `$pivot->price`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 67:** PHP array entry: المفتاح `notes` مرتبط بالقيمة `$position === 0 && $index % 2 === 0 ? 'Demo note: extra crispy, please.' : null`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 68:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 69:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 70:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 71:** if تختبر الشرط `$type === 'delivery'`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 72:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `config(...)`: اقرأ إعدادًا من ملفات config بالقيمة المحملة وقت تشغيل التطبيق؛ النقطة تفصل الملف عن المفتاح الداخلي. مدخلاتها: key بصيغة dot notation مثل services.stripe.key، ثم default اختيارية. بدون key يرجع config repository، وarray تضبط إعدادات. العائد/الأثر: قيمة الإعداد أو default في الاستخدام الحالي؛ ليست بالضرورة string ولا قيمة env مباشرة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 73–80

```php
            }
            $order->update(['total_price' => $total, 'created_at' => $createdAt, 'updated_at' => $createdAt]);

            $order->statusLogs()->delete();
            foreach ($this->statusPath($status, $type) as $step => [$from, $to]) {
                OrderStatusLog::create([
                    'order_id' => $order->id,
                    'user_id' => $staff?->id,
```

**السطر 73:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 74:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$order->update(...)`: تكتب تغييرات في DB. مدخلاتها: attributes array. العائد/الأثر: Boolean على model أو عدد صفوف على builder؛ حسب المستقبِل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 76:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$order->statusLogs(...)`: سجل انتقالات الحالة مرتب created_at تصاعديًا. مدخلاتها: order_status_logs.order_id. العائد/الأثر: HasMany مع orderBy.؛ `->delete(...)`: تحذف صفًا/صفوفًا حسب المستقبِل. مدخلاتها: بدون مدخلات في model المعتاد. العائد/الأثر: نتيجة/عدد حسب model أو builder؛ حذف فعلي وليس إخفاء CSS.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 77:** Loop / حلقة مرور؛ تعيد تنفيذ الجسم حسب الشرط/العناصر. راقب المتغير الحالي وما الذي يتغيّر في كل دورة. الدوال الموجودة في السطر: `$this->statusPath(...)`: كوّن خطوات الحالة من new لحد الحالة المطلوبة؛ pickup له picked_up وdelivery له out_for_delivery، والإلغاء/الرفض مسار أقصر. مدخلاتها: string status وstring type. العائد/الأثر: array من الأزواج [from,to] أول from فيها null.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 78:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `OrderStatusLog::create(...)`: تنشئ صفًا ببيانات ملء مسموحة. مدخلاتها: attributes array. العائد/الأثر: model المحفوظ؛ ليست validation أو authorization تلقائية.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 79:** PHP array entry: المفتاح `order_id` مرتبط بالقيمة `$order->id`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 80:** PHP array entry: المفتاح `user_id` مرتبط بالقيمة `$staff?->id`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 81–88

```php
                    'from_status' => $from,
                    'to_status' => $to,
                    'reason' => in_array($to, ['cancelled', 'rejected'], true) ? $order->status_reason : null,
                    'created_at' => $createdAt->copy()->addMinutes($step * 2),
                ]);
            }
        }
    }
```

**السطر 81:** PHP array entry: المفتاح `from_status` مرتبط بالقيمة `$from`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 82:** PHP array entry: المفتاح `to_status` مرتبط بالقيمة `$to`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 83:** PHP array entry: المفتاح `reason` مرتبط بالقيمة `in_array($to, ['cancelled', 'rejected'], true) ? $order->status_reason : null`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 84:** PHP array entry: المفتاح `created_at` مرتبط بالقيمة `$createdAt->copy()->addMinutes($step * 2)`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 85:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 86:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 87:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 88:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 89–96

```php

    private function statusPath(string $status, string $type): array
    {
        $delivery = ['new', 'accepted', 'preparing', 'ready', 'out_for_delivery', 'completed'];
        $pickup = ['new', 'accepted', 'preparing', 'ready', 'picked_up', 'completed'];
        $path = $type === 'pickup' ? $pickup : $delivery;
        if (in_array($status, ['cancelled', 'rejected'], true)) {
            $path = ['new', $status];
```

**السطر 90:** Function / تعريف دالة `statusPath`؛ تعريفها مش تشغيلها. كوّن خطوات الحالة من new لحد الحالة المطلوبة؛ pickup له picked_up وdelivery له out_for_delivery، والإلغاء/الرفض مسار أقصر. مدخلاتها: string status وstring type. ناتجها: array من الأزواج [from,to] أول from فيها null.

**السطر 91:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 92:** Assignment / إسناد: احسب `['new', 'accepted', 'preparing', 'ready', 'out_for_delivery', 'completed']` الأول وخزّن النتيجة في `$delivery`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 93:** Assignment / إسناد: احسب `['new', 'accepted', 'preparing', 'ready', 'picked_up', 'completed']` الأول وخزّن النتيجة في `$pickup`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 94:** Assignment / إسناد: احسب `$type === 'pickup' ? $pickup : $delivery` الأول وخزّن النتيجة في `$path`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 95:** if تختبر الشرط `in_array($status, ['cancelled', 'rejected'], true)`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 96:** Assignment / إسناد: احسب `['new', $status]` الأول وخزّن النتيجة في `$path`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

### السطور 97–104

```php
        } else {
            $path = array_slice($path, 0, array_search($status, $path, true) + 1);
        }

        $logs = [];
        foreach ($path as $index => $to) {
            $logs[] = [$index === 0 ? null : $path[$index - 1], $to];
        }
```

**السطر 97:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 98:** Assignment / إسناد: احسب `array_slice($path, 0, array_search($status, $path, true) + 1)` الأول وخزّن النتيجة في `$path`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 99:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 101:** Assignment / إسناد: احسب `[]` الأول وخزّن النتيجة في `$logs`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 102:** Loop / حلقة مرور؛ تعيد تنفيذ الجسم حسب الشرط/العناصر. راقب المتغير الحالي وما الذي يتغيّر في كل دورة.

**السطر 103:** Assignment / إسناد: احسب القيمة على يمين = وخزّنها في المتغير أو خاصية الـobject على الشمال. -> وصول لخاصية/دالة object، و:: وصول static/facade حسب التعريف.

**السطر 104:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 105–109

```php

        return $logs;
    }
}

```

**السطر 106:** return تعيد التعبير `$logs` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 107:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 108:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
