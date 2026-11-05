# قلب إنشاء الطلب وحساب السعر من السيرفر

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `app/Services/Orders/OrderCreator.php` · 79 سطر.

**وظيفة الملف:** كلاس service مش route. الكاش والكارت بيستخدموه عشان منكررش منطق الفروع والإتاحة والأسعار. بيحفظ الطلب وبنوده داخل transaction، وياخد السعر من DB مش من سعر جاي من المتصفح. لو أي بند غير متاح العملية كلها تتراجع.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../app/Services/Orders/OrderCreator.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Models/Branch.php](../../Models/Branch.php.md)

- [pizza-crm/app/Models/MenuItem.php](../../Models/MenuItem.php.md)

- [pizza-crm/app/Models/Order.php](../../Models/Order.php.md)

- [pizza-crm/app/Models/User.php](../../Models/User.php.md)

- [pizza-crm/app/Http/Controllers/Api/OrderController.php](../../Http/Controllers/Api/OrderController.php.md)

- [pizza-crm/app/Http/Controllers/Api/PaymentController.php](../../Http/Controllers/Api/PaymentController.php.md)

- [pizza-crm/app/Models/OrderItem.php](../../Models/OrderItem.php.md)

- [pizza-crm/database/migrations/2026_06_14_000004_create_branch_menu_item_table.php](../../../database/migrations/2026_06_14_000004_create_branch_menu_item_table.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

namespace App\Services\Orders;

use App\Models\Branch;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderCreator
{
    public function create(array $data, ?User $user, string $status): Order
    {
        return DB::transaction(function () use ($data, $user, $status) {
            $branch = Branch::query()->where('is_active', true)->findOrFail($data['branch_id']);
            if ($data['order_type'] === 'delivery' && ! $branch->delivery_enabled) {
                throw ValidationException::withMessages([
                    'branch_id' => ['This branch is not accepting delivery orders right now.'],
                ]);
            }
            $order = Order::create([
                'user_id' => $user?->id,
                'branch_id' => $branch->id,
                'order_type' => $data['order_type'],
                'pickup_time' => $data['order_type'] === 'pickup' ? $data['pickup_time'] : null,
                'customer_name' => $data['customer_name'],
                'customer_phone' => $data['customer_phone'],
                'delivery_address' => $data['order_type'] === 'delivery' ? $data['delivery_address'] : null,
                'payment_method' => $data['payment_method'],
                'payment_status' => $data['payment_method'] === 'card' ? 'pending' : 'unpaid',
                'status' => $status,
                'idempotency_key' => $data['idempotency_key'] ?? null,
                'tracking_token' => Str::random(48),
                'total_price' => 0,
            ]);

            $total = 0;
            foreach ($data['items'] as $line) {
                $menuItem = MenuItem::query()
                    ->where('is_active', true)
                    ->whereHas('category', fn ($query) => $query->where('is_active', true))
                    ->find($line['menu_item_id']);
                $pivot = DB::table('branch_menu_item')
                    ->where('branch_id', $branch->id)
                    ->where('menu_item_id', $line['menu_item_id'])
                    ->first();

                if (! $menuItem || ! $pivot || ! $pivot->is_available) {
                    throw ValidationException::withMessages([
                        'items' => ["Menu item {$line['menu_item_id']} is unavailable at {$branch->name}."],
                    ]);
                }

                $price = (float) $pivot->price;
                $quantity = (int) $line['quantity'];
                $total += $price * $quantity;
                $order->items()->create([
                    'menu_item_id' => $line['menu_item_id'],
                    'item_name' => $menuItem->name,
                    'quantity' => $quantity,
                    'price' => $price,
                    'notes' => $line['notes'] ?? null,
                ]);
            }

            if ($data['order_type'] === 'delivery') {
                $total += (float) $branch->delivery_fee;
            }

            $order->update(['total_price' => $total]);

            return $order->load(['branch', 'user', 'items.menuItem']);
        });
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### create

تحقق من الفرع والتوصيل وإتاحة كل منتج، احسب الإجمالي واحفظ order/items مع نسخة اسم وسعر وقت الطلب.

- **بتاخد إيه؟ Inputs:** array $data المحققة، ?User $user ممكن null للضيف، string $status يحدده الكاش أو الدفع.

- **بترجع/بتغيّر إيه؟ Return / effect:** Order محمّل بعلاقات branch وuser وitems.menuItem؛ يرمي ValidationException لو بند/توصيل غير متاح.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### DB::transaction

- **جاية منين؟** Laravel Database Connection

- **وظيفتها:** شغّل callback داخل DB transaction؛ commit عند النجاح وrollback عند exception. لا يتراجع به ملف صورة أوطلب Stripe خارجي.

- **المدخلات — Arguments:** Closure callback، وعدد محاولات integer اختياري افتراضي1.

- **الناتج/الأثر — Return / effect:** نفس القيمة الراجعة من callback؛ يعيد رمي exception عند الفشل النهائي.

- **أول موضع هنا:** السطر 17.

- **مثال:** return DB::transaction(function () use ($data) { return Order::create($data); });

### Branch::query

- **جاية منين؟** Eloquent

- **وظيفتها:** تبدأ بناء query على model.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** Eloquent Builder، مش rows جاهزة.

- **أول موضع هنا:** السطر 18.

### ->where

- **جاية منين؟** Laravel Query Builder

- **وظيفتها:** تضيف شرط فلترة أو مجموعة شروط.

- **المدخلات — Arguments:** column/operator/value أو closure.

- **الناتج/الأثر — Return / effect:** Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.

- **أول موضع هنا:** السطر 48.

### ->findOrFail

- **جاية منين؟** Eloquent

- **وظيفتها:** تبحث بالـprimary key أو تفشل.

- **المدخلات — Arguments:** id.

- **الناتج/الأثر — Return / effect:** model أو exception تترجم عادة404.

- **أول موضع هنا:** السطر 18.

### ValidationException::withMessages

- **جاية منين؟** Laravel ValidationException

- **وظيفتها:** ابنِ exception بأخطاء مرتبطة بأسماء حقول زي items أو expected_status.

- **المدخلات — Arguments:** array field=>messages.

- **الناتج/الأثر — Return / effect:** ValidationException؛ throw هو اللي يرميها.

- **أول موضع هنا:** السطر 52.

- **مثال:** throw ValidationException::withMessages(['items' => ['Unavailable']]);

### Order::create

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** تحقق من الفرع والتوصيل وإتاحة كل منتج، احسب الإجمالي واحفظ order/items مع نسخة اسم وسعر وقت الطلب.

- **المدخلات — Arguments:** array $data المحققة، ?User $user ممكن null للضيف، string $status يحدده الكاش أو الدفع.

- **الناتج/الأثر — Return / effect:** Order محمّل بعلاقات branch وuser وitems.menuItem؛ يرمي ValidationException لو بند/توصيل غير متاح.

- **أول موضع هنا:** السطر 24.

### Str::random

- **جاية منين؟** Laravel Str

- **وظيفتها:** ولّد string عشوائية آمنة للاستخدام كtracking token أو جزء اسم ملف؛ الطول لا يلغي الحاجة للتحكم في صلاحيات الوصول.

- **المدخلات — Arguments:** length int.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 36.

- **مثال:** Str::random(48)

### MenuItem::query

- **جاية منين؟** Eloquent

- **وظيفتها:** تبدأ بناء query على model.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** Eloquent Builder، مش rows جاهزة.

- **أول موضع هنا:** السطر 42.

### ->whereHas

- **جاية منين؟** Eloquent

- **وظيفتها:** تقيد النتائج بوجود علاقة تحقق شروطًا.

- **المدخلات — Arguments:** relation وcallback.

- **الناتج/الأثر — Return / effect:** Builder؛ غير eager loading with.

- **أول موضع هنا:** السطر 44.

### $query->where

- **جاية منين؟** Laravel Query Builder

- **وظيفتها:** تضيف شرط فلترة أو مجموعة شروط.

- **المدخلات — Arguments:** column/operator/value أو closure.

- **الناتج/الأثر — Return / effect:** Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.

- **أول موضع هنا:** السطر 44.

### ->find

- **جاية منين؟** Eloquent

- **وظيفتها:** تبحث بالـprimary key مع شروط query الحالية.

- **المدخلات — Arguments:** id.

- **الناتج/الأثر — Return / effect:** model أو null في استخدام id الواحد.

- **أول موضع هنا:** السطر 45.

### DB::table

- **جاية منين؟** Laravel Database Query Builder

- **وظيفتها:** ابدأ query لجدول بالاسم من غير Eloquent Model؛ لا يقرأ rows ولا يغيّر schema بمجرد استدعائه.

- **المدخلات — Arguments:** اسم الجدول string، مع alias اختيارية؛ في المشروع اسم فقط.

- **الناتج/الأثر — Return / effect:** Illuminate Database Query Builder؛ كمّل عليه where ثم first/get/update/insert لتنفيذ العملية.

- **أول موضع هنا:** السطر 46.

- **مثال:** DB::table('branch_menu_item')->where('branch_id', $branch->id)->first();

### ->first

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تنفّذ query لجلب أول صف.

- **المدخلات — Arguments:** columns اختيارية.

- **الناتج/الأثر — Return / effect:** model أو stdClass حسب builder، أو null.

- **أول موضع هنا:** السطر 49.

### $order->items

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** بنود الطلب المحفوظة باسم وسعر وقت الشراء.

- **المدخلات — Arguments:** order_items.order_id.

- **الناتج/الأثر — Return / effect:** HasMany؛ items() تبني query وitems property تجيب collection.

- **أول موضع هنا:** السطر 60.

- **تكملة التعريف:** [app/Models/Order.php](../../Models/Order.php.md)، عند السطر 86.

### ->create

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** تحقق من الفرع والتوصيل وإتاحة كل منتج، احسب الإجمالي واحفظ order/items مع نسخة اسم وسعر وقت الطلب.

- **المدخلات — Arguments:** array $data المحققة، ?User $user ممكن null للضيف، string $status يحدده الكاش أو الدفع.

- **الناتج/الأثر — Return / effect:** Order محمّل بعلاقات branch وuser وitems.menuItem؛ يرمي ValidationException لو بند/توصيل غير متاح.

- **أول موضع هنا:** السطر 60.

### $order->update

- **جاية منين؟** Eloquent

- **وظيفتها:** تكتب تغييرات في DB.

- **المدخلات — Arguments:** attributes array.

- **الناتج/الأثر — Return / effect:** Boolean على model أو عدد صفوف على builder؛ حسب المستقبِل.

- **أول موضع هنا:** السطر 73.

### $order->load

- **جاية منين؟** Eloquent Model/Collection

- **وظيفتها:** تحمّل علاقات على نتائج موجودة.

- **المدخلات — Arguments:** العلاقات.

- **الناتج/الأثر — Return / effect:** نفس model/collection بعد التحميل.

- **أول موضع هنا:** السطر 75.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

namespace App\Services\Orders;

use App\Models\Branch;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\User;
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** namespace بتحدد نطاق أسماء الكلاس `App\Services\Orders`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 5:** use / استيراد الاسم `App\Models\Branch` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** use / استيراد الاسم `App\Models\MenuItem` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 7:** use / استيراد الاسم `App\Models\Order` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 8:** use / استيراد الاسم `App\Models\User` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderCreator
{
    public function create(array $data, ?User $user, string $status): Order
    {
```

**السطر 9:** use / استيراد الاسم `Illuminate\Support\Facades\DB` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 10:** use / استيراد الاسم `Illuminate\Support\Str` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 11:** use / استيراد الاسم `Illuminate\Validation\ValidationException` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 13:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

**السطر 14:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 15:** Function / تعريف دالة `create`؛ تعريفها مش تشغيلها. تحقق من الفرع والتوصيل وإتاحة كل منتج، احسب الإجمالي واحفظ order/items مع نسخة اسم وسعر وقت الطلب. مدخلاتها: array $data المحققة، ?User $user ممكن null للضيف، string $status يحدده الكاش أو الدفع. ناتجها: Order محمّل بعلاقات branch وuser وitems.menuItem؛ يرمي ValidationException لو بند/توصيل غير متاح.

**السطر 16:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

### السطور 17–24

```php
        return DB::transaction(function () use ($data, $user, $status) {
            $branch = Branch::query()->where('is_active', true)->findOrFail($data['branch_id']);
            if ($data['order_type'] === 'delivery' && ! $branch->delivery_enabled) {
                throw ValidationException::withMessages([
                    'branch_id' => ['This branch is not accepting delivery orders right now.'],
                ]);
            }
            $order = Order::create([
```

**السطر 17:** return تعيد التعبير `DB::transaction(function () use ($data, $user, $status) {` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 18:** Assignment / إسناد: احسب `Branch::query()->where('is_active', true)->findOrFail($data['branch_id'])` الأول وخزّن النتيجة في `$branch`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 19:** if تختبر الشرط `$data['order_type'] === 'delivery' && ! $branch->delivery_enabled`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 20:** throw ترمي الاستثناء `ValidationException::withMessages([` وتوقف المسار العادي. Laravel exception handler أو catch المناسبة تتعامل معاه؛ مش مجرد رسالة بتنطبع وتكمّل التنفيذ.

**السطر 21:** PHP array entry: المفتاح `branch_id` مرتبط بالقيمة `['This branch is not accepting delivery orders right now.']`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 22:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 23:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 24:** Assignment / إسناد: احسب `Order::create([` الأول وخزّن النتيجة في `$order`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

### السطور 25–32

```php
                'user_id' => $user?->id,
                'branch_id' => $branch->id,
                'order_type' => $data['order_type'],
                'pickup_time' => $data['order_type'] === 'pickup' ? $data['pickup_time'] : null,
                'customer_name' => $data['customer_name'],
                'customer_phone' => $data['customer_phone'],
                'delivery_address' => $data['order_type'] === 'delivery' ? $data['delivery_address'] : null,
                'payment_method' => $data['payment_method'],
```

**السطر 25:** PHP array entry: المفتاح `user_id` مرتبط بالقيمة `$user?->id`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 26:** PHP array entry: المفتاح `branch_id` مرتبط بالقيمة `$branch->id`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 27:** PHP array entry: المفتاح `order_type` مرتبط بالقيمة `$data['order_type']`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 28:** PHP array entry: المفتاح `pickup_time` مرتبط بالقيمة `$data['order_type'] === 'pickup' ? $data['pickup_time'] : null`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 29:** PHP array entry: المفتاح `customer_name` مرتبط بالقيمة `$data['customer_name']`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 30:** PHP array entry: المفتاح `customer_phone` مرتبط بالقيمة `$data['customer_phone']`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 31:** PHP array entry: المفتاح `delivery_address` مرتبط بالقيمة `$data['order_type'] === 'delivery' ? $data['delivery_address'] : null`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 32:** PHP array entry: المفتاح `payment_method` مرتبط بالقيمة `$data['payment_method']`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 33–40

```php
                'payment_status' => $data['payment_method'] === 'card' ? 'pending' : 'unpaid',
                'status' => $status,
                'idempotency_key' => $data['idempotency_key'] ?? null,
                'tracking_token' => Str::random(48),
                'total_price' => 0,
            ]);

            $total = 0;
```

**السطر 33:** PHP array entry: المفتاح `payment_status` مرتبط بالقيمة `$data['payment_method'] === 'card' ? 'pending' : 'unpaid'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 34:** PHP array entry: المفتاح `status` مرتبط بالقيمة `$status`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 35:** PHP array entry: المفتاح `idempotency_key` مرتبط بالقيمة `$data['idempotency_key'] ?? null`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 36:** PHP array entry: المفتاح `tracking_token` مرتبط بالقيمة `Str::random(48)`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 37:** PHP array entry: المفتاح `total_price` مرتبط بالقيمة `0`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 38:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 40:** Assignment / إسناد: احسب `0` الأول وخزّن النتيجة في `$total`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

### السطور 41–48

```php
            foreach ($data['items'] as $line) {
                $menuItem = MenuItem::query()
                    ->where('is_active', true)
                    ->whereHas('category', fn ($query) => $query->where('is_active', true))
                    ->find($line['menu_item_id']);
                $pivot = DB::table('branch_menu_item')
                    ->where('branch_id', $branch->id)
                    ->where('menu_item_id', $line['menu_item_id'])
```

**السطر 41:** Loop / حلقة مرور؛ تعيد تنفيذ الجسم حسب الشرط/العناصر. راقب المتغير الحالي وما الذي يتغيّر في كل دورة.

**السطر 42:** Assignment / إسناد: احسب `MenuItem::query()` الأول وخزّن النتيجة في `$menuItem`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 43:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->where(...)`: تضيف شرط فلترة أو مجموعة شروط. مدخلاتها: column/operator/value أو closure. العائد/الأثر: Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 44:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->whereHas(...)`: تقيد النتائج بوجود علاقة تحقق شروطًا. مدخلاتها: relation وcallback. العائد/الأثر: Builder؛ غير eager loading with.؛ `$query->where(...)`: تضيف شرط فلترة أو مجموعة شروط. مدخلاتها: column/operator/value أو closure. العائد/الأثر: Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 45:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->find(...)`: تبحث بالـprimary key مع شروط query الحالية. مدخلاتها: id. العائد/الأثر: model أو null في استخدام id الواحد.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 46:** Assignment / إسناد: احسب `DB::table('branch_menu_item')` الأول وخزّن النتيجة في `$pivot`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 47:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->where(...)`: تضيف شرط فلترة أو مجموعة شروط. مدخلاتها: column/operator/value أو closure. العائد/الأثر: Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 48:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->where(...)`: تضيف شرط فلترة أو مجموعة شروط. مدخلاتها: column/operator/value أو closure. العائد/الأثر: Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 49–56

```php
                    ->first();

                if (! $menuItem || ! $pivot || ! $pivot->is_available) {
                    throw ValidationException::withMessages([
                        'items' => ["Menu item {$line['menu_item_id']} is unavailable at {$branch->name}."],
                    ]);
                }

```

**السطر 49:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->first(...)`: تنفّذ query لجلب أول صف. مدخلاتها: columns اختيارية. العائد/الأثر: model أو stdClass حسب builder، أو null.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 51:** if تختبر الشرط `! $menuItem || ! $pivot || ! $pivot->is_available`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 52:** throw ترمي الاستثناء `ValidationException::withMessages([` وتوقف المسار العادي. Laravel exception handler أو catch المناسبة تتعامل معاه؛ مش مجرد رسالة بتنطبع وتكمّل التنفيذ.

**السطر 53:** PHP array entry: المفتاح `items` مرتبط بالقيمة `["Menu item {$line['menu_item_id']} is unavailable at {$branch->name}."]`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 54:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 55:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 57–64

```php
                $price = (float) $pivot->price;
                $quantity = (int) $line['quantity'];
                $total += $price * $quantity;
                $order->items()->create([
                    'menu_item_id' => $line['menu_item_id'],
                    'item_name' => $menuItem->name,
                    'quantity' => $quantity,
                    'price' => $price,
```

**السطر 57:** Assignment / إسناد: احسب `(float) $pivot->price` الأول وخزّن النتيجة في `$price`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 58:** Assignment / إسناد: احسب `(int) $line['quantity']` الأول وخزّن النتيجة في `$quantity`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 59:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 60:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$order->items(...)`: بنود الطلب المحفوظة باسم وسعر وقت الشراء. مدخلاتها: order_items.order_id. العائد/الأثر: HasMany؛ items() تبني query وitems property تجيب collection.؛ `->create(...)`: تحقق من الفرع والتوصيل وإتاحة كل منتج، احسب الإجمالي واحفظ order/items مع نسخة اسم وسعر وقت الطلب. مدخلاتها: array $data المحققة، ?User $user ممكن null للضيف، string $status يحدده الكاش أو الدفع. العائد/الأثر: Order محمّل بعلاقات branch وuser وitems.menuItem؛ يرمي ValidationException لو بند/توصيل غير متاح.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 61:** PHP array entry: المفتاح `menu_item_id` مرتبط بالقيمة `$line['menu_item_id']`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 62:** PHP array entry: المفتاح `item_name` مرتبط بالقيمة `$menuItem->name`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 63:** PHP array entry: المفتاح `quantity` مرتبط بالقيمة `$quantity`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 64:** PHP array entry: المفتاح `price` مرتبط بالقيمة `$price`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 65–72

```php
                    'notes' => $line['notes'] ?? null,
                ]);
            }

            if ($data['order_type'] === 'delivery') {
                $total += (float) $branch->delivery_fee;
            }

```

**السطر 65:** PHP array entry: المفتاح `notes` مرتبط بالقيمة `$line['notes'] ?? null`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 66:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 67:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 69:** if تختبر الشرط `$data['order_type'] === 'delivery'`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 70:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 71:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 73–79

```php
            $order->update(['total_price' => $total]);

            return $order->load(['branch', 'user', 'items.menuItem']);
        });
    }
}

```

**السطر 73:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$order->update(...)`: تكتب تغييرات في DB. مدخلاتها: attributes array. العائد/الأثر: Boolean على model أو عدد صفوف على builder؛ حسب المستقبِل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 75:** return تعيد التعبير `$order->load(['branch', 'user', 'items.menuItem'])` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 76:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 77:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 78:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
