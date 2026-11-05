# تتبع الضيف وتاريخ العميل وإعادة الطلب

[فهرس كل الأكواد](../../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `app/Http/Controllers/Api/OrderTrackingController.php` · 98 سطر.

**وظيفة الملف:** تتبع عام باستخدام random token مش رقم order متوقع. safeOrder تعمل allowlist للحقول، وتاريخ الحساب وإعادة الطلب محميان بsession والملكية. كلمة safe مش معناها مفيش بيانات شخصية: صاحب tracking URL يقدر يشوف الاسم والهاتف والعنوان المعروضين.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../../app/Http/Controllers/Api/OrderTrackingController.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Http/Controllers/Controller.php](../Controller.php.md)

- [pizza-crm/app/Models/Order.php](../../../Models/Order.php.md)

- [pizza-crm/resources/js/Pages/OrderTracking.jsx](../../../../resources/js/Pages/OrderTracking.jsx.md)

- [pizza-crm/resources/js/Pages/MyOrders.jsx](../../../../resources/js/Pages/MyOrders.jsx.md)

- [pizza-crm/app/Models/User.php](../../../Models/User.php.md)

- [pizza-crm/resources/js/Pages/Cart.jsx](../../../../resources/js/Pages/Cart.jsx.md)

- [pizza-crm/app/Models/MenuItem.php](../../../Models/MenuItem.php.md)

- [pizza-crm/tests/Feature/OrderOperationsTest.php](../../../../tests/Feature/OrderOperationsTest.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderTrackingController extends Controller
{
    public function show(string $token): JsonResponse
    {
        $order = Order::query()
            ->where('tracking_token', $token)
            ->with(['branch', 'items', 'statusLogs'])
            ->firstOrFail();

        return response()->json(['order' => $this->safeOrder($order)]);
    }

    public function history(Request $request): JsonResponse
    {
        $orders = $request->user()->orders()
            ->with(['branch', 'items', 'statusLogs'])
            ->latest()
            ->get()
            ->map(fn (Order $order) => $this->safeOrder($order, true));

        return response()->json(['orders' => $orders]);
    }

    public function reorder(Request $request, Order $order): JsonResponse
    {
        abort_unless((int) $order->user_id === (int) $request->user()->id, 404);
        $order->load(['branch', 'items.menuItem.branches']);

        $cartItems = $order->items->map(function ($line) use ($order) {
            $item = $line->menuItem;
            $option = $item?->branches->firstWhere('id', $order->branch_id);
            if (! $item?->is_active || ! $option?->pivot?->is_available) {
                return null;
            }

            return [
                'id' => $item->id,
                'name' => $item->name,
                'description' => $item->description,
                'price' => (float) $option->pivot->price,
                'image_src' => $item->image_path,
                'branch_id' => $order->branch_id,
                'branch_name' => $order->branch->name,
                'quantity' => $line->quantity,
                'notes' => $line->notes,
            ];
        })->filter()->values();

        return response()->json([
            'branch_id' => $order->branch_id,
            'order_type' => $order->order_type,
            'cart_items' => $cartItems,
            'skipped_items' => $order->items->count() - $cartItems->count(),
        ]);
    }

    private function safeOrder(Order $order, bool $includeToken = false): array
    {
        return [
            'id' => $order->id,
            'tracking_token' => $includeToken ? $order->tracking_token : null,
            'status' => $order->status,
            'status_reason' => $order->status_reason,
            'order_type' => $order->order_type,
            'customer_name' => $order->customer_name,
            'customer_phone' => $order->customer_phone,
            'delivery_address' => $order->delivery_address,
            'pickup_time' => $order->pickup_time,
            'payment_method' => $order->payment_method,
            'payment_status' => $order->payment_status,
            'total_price' => $order->total_price,
            'created_at' => $order->created_at,
            'branch' => $order->branch?->only(['id', 'name', 'location', 'phone', 'opening_hours']),
            'items' => $order->items->map(fn ($item) => [
                'id' => $item->id,
                'item_name' => $item->item_name,
                'quantity' => $item->quantity,
                'price' => $item->price,
                'notes' => $item->notes,
            ]),
            'status_logs' => $order->statusLogs->map(fn ($log) => [
                'to_status' => $log->to_status,
                'reason' => $log->reason,
                'created_at' => $log->created_at,
            ]),
        ];
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### show

ابحث عن order بالtracking token وحمّل علاقاته ثم مرره لـ safeOrder.

- **بتاخد إيه؟ Inputs:** string token من URL.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON order بالحقول المسموحة أو 404.

### history

رجّع طلبات صاحب session فقط، الأحدث أولًا، مع token علشان يفتح التتبع.

- **بتاخد إيه؟ Inputs:** Request بمستخدم authenticated.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON orders؛ كل عنصر خارج من safeOrder(order,true).

### reorder

راجع ملكية الطلب ثم ابنِ سلة جديدة من المنتجات النشطة المتاحة بسعر الفرع الحالي؛ مش السعر القديم.

- **بتاخد إيه؟ Inputs:** Request صاحب الحساب وOrder قديم من route binding.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON branch_id/order_type/cart_items/skipped_items؛ لا ينشئ order جديدًا هنا.

### safeOrder

اختار صراحةً حقول التتبع وبنوده وسجل حالاته؛ استبعد user_id وgateway_reference وغيرهم من الحقول الداخلية.

- **بتاخد إيه؟ Inputs:** Order بعلاقات محملة وbool includeToken افتراضي false.

- **بترجع/بتغيّر إيه؟ Return / effect:** array تمثل order؛ token يظهر فقط لو includeToken=true.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### Order::query

- **جاية منين؟** Eloquent

- **وظيفتها:** تبدأ بناء query على model.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** Eloquent Builder، مش rows جاهزة.

- **أول موضع هنا:** السطر 14.

### ->where

- **جاية منين؟** Laravel Query Builder

- **وظيفتها:** تضيف شرط فلترة أو مجموعة شروط.

- **المدخلات — Arguments:** column/operator/value أو closure.

- **الناتج/الأثر — Return / effect:** Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.

- **أول موضع هنا:** السطر 15.

### ->with

- **جاية منين؟** Eloquent

- **وظيفتها:** تحدد علاقات يتم eager load لها عند الجلب.

- **المدخلات — Arguments:** علاقات كنصوص/array.

- **الناتج/الأثر — Return / effect:** Builder؛ التحميل يكتمل عند تنفيذ query.

- **أول موضع هنا:** السطر 25.

### ->firstOrFail

- **جاية منين؟** Laravel Eloquent

- **وظيفتها:** أول صف مطابق أو404 عن طريق exception.

- **المدخلات — Arguments:** columns اختيارية.

- **الناتج/الأثر — Return / effect:** Model أو exception.

- **أول موضع هنا:** السطر 17.

- **مثال:** Order::where('tracking_token', $token)->firstOrFail();

### ->json

- **جاية منين؟** Laravel Response factory

- **وظيفتها:** تجهّز HTTP response من بيانات JSON.

- **المدخلات — Arguments:** data وstatus وheaders.

- **الناتج/الأثر — Return / effect:** JsonResponse، مش object JavaScript مشترك بين PHP والمتصفح.

- **أول موضع هنا:** السطر 58.

### $this->safeOrder

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** اختار صراحةً حقول التتبع وبنوده وسجل حالاته؛ استبعد user_id وgateway_reference وغيرهم من الحقول الداخلية.

- **المدخلات — Arguments:** Order بعلاقات محملة وbool includeToken افتراضي false.

- **الناتج/الأثر — Return / effect:** array تمثل order؛ token يظهر فقط لو includeToken=true.

- **أول موضع هنا:** السطر 28.

### response

- **جاية منين؟** Laravel helper

- **وظيفتها:** جهّز HTTP response. بدون arguments هات factory نكمل عليها json أو view أو streamDownload.

- **المدخلات — Arguments:** بدون arguments للـ factory؛ أو content ثم status ثم headers لإنشاء response مباشرة.

- **الناتج/الأثر — Return / effect:** ResponseFactory بدون arguments، أو HTTP Response عند تمرير content؛ مش إرسال شبكة من browser.

- **أول موضع هنا:** السطر 58.

- **مثال:** return response()->json(['message' => 'Saved'], 201);

### $request->user

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** صاحب الحساب إن كان الطلب من مستخدم مسجل.

- **المدخلات — Arguments:** orders.user_id nullable.

- **الناتج/الأثر — Return / effect:** BelongsTo.

- **أول موضع هنا:** السطر 35.

- **تكملة التعريف:** [app/Models/Order.php](../../../Models/Order.php.md)، عند السطر 76.

### ->orders

- **جاية منين؟** علاقة Eloquent مخصّصة في model

- **وظيفتها:** تقرأ وصف علاقة الطلبات بالسجل الحالي؛ مثل طلبات المستخدم من user()->orders().

- **المدخلات — Arguments:** بدون arguments هنا.

- **الناتج/الأثر — Return / effect:** HasMany relation تقدر تكمل عليها query؛ مش كل طلبات النظام مباشرة.

- **أول موضع هنا:** السطر 24.

### ->latest

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تضيف ترتيبًا تنازليًا للأحدث.

- **المدخلات — Arguments:** column اختياري؛ الافتراضي created_at.

- **الناتج/الأثر — Return / effect:** Builder.

- **أول موضع هنا:** السطر 26.

### ->get

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تنفّذ الاستعلام وتجمع الصفوف.

- **المدخلات — Arguments:** columns اختيارية.

- **الناتج/الأثر — Return / effect:** Collection؛ مش استجابة JSON وحدها.

- **أول موضع هنا:** السطر 27.

### ->map

- **جاية منين؟** Laravel Collection

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback(value, key).

- **الناتج/الأثر — Return / effect:** Collection جديدة؛ ليست array إلا لو كملت all.

- **أول موضع هنا:** السطر 28.

### abort_unless

- **جاية منين؟** Laravel helper

- **وظيفتها:** لو الشرط false ارم HTTP exception وأوقف الطلب؛ لو true كمل.

- **المدخلات — Arguments:** condition وstatus code ورسالة اختيارية.

- **الناتج/الأثر — Return / effect:** لا قيمة مفيدة؛ قد يرمي exception.

- **أول موضع هنا:** السطر 35.

- **مثال:** abort_unless($user->isAdmin(), 403);

### $order->load

- **جاية منين؟** Eloquent Model/Collection

- **وظيفتها:** تحمّل علاقات على نتائج موجودة.

- **المدخلات — Arguments:** العلاقات.

- **الناتج/الأثر — Return / effect:** نفس model/collection بعد التحميل.

- **أول موضع هنا:** السطر 36.

### items->map

- **جاية منين؟** Laravel Collection

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback(value, key).

- **الناتج/الأثر — Return / effect:** Collection جديدة؛ ليست array إلا لو كملت all.

- **أول موضع هنا:** السطر 83.

### branches->firstWhere

- **جاية منين؟** Laravel Collection

- **وظيفتها:** تقرأ أول عنصر يطابق حقلًا/قيمة.

- **المدخلات — Arguments:** key/operator/value حسب الاستخدام.

- **الناتج/الأثر — Return / effect:** العنصر أو null.

- **أول موضع هنا:** السطر 40.

### ->filter

- **جاية منين؟** Laravel Collection

- **وظيفتها:** تختار العناصر المطابقة.

- **المدخلات — Arguments:** callback اختيارية.

- **الناتج/الأثر — Return / effect:** Collection جديدة مع مفاتيح قد تحتاج values لإعادة ترقيمها.

- **أول موضع هنا:** السطر 56.

### ->values

- **جاية منين؟** Laravel Collection

- **وظيفتها:** أعد ترقيم المفاتيح من صفر بعد filter لتتسلسل النتيجة JSON array منتظمة.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** Collection بمفاتيح رقمية متتابعة.

- **أول موضع هنا:** السطر 56.

- **مثال:** ->filter()->values()

### items->count

- **جاية منين؟** Laravel Builder/Collection

- **وظيفتها:** تحسب عدد الصفوف/العناصر حسب المستقبِل.

- **المدخلات — Arguments:** column اختيارية للـquery.

- **الناتج/الأثر — Return / effect:** عدد؛ query count تنفّذ aggregate.

- **أول موضع هنا:** السطر 62.

### $cartItems->count

- **جاية منين؟** Laravel Builder/Collection

- **وظيفتها:** تحسب عدد الصفوف/العناصر حسب المستقبِل.

- **المدخلات — Arguments:** column اختيارية للـquery.

- **الناتج/الأثر — Return / effect:** عدد؛ query count تنفّذ aggregate.

- **أول موضع هنا:** السطر 62.

### ->only

- **جاية منين؟** Laravel Request/Collection

- **وظيفتها:** تختار مفاتيح محددة من البيانات.

- **المدخلات — Arguments:** keys.

- **الناتج/الأثر — Return / effect:** array من Request، أو Collection من collection.

- **أول موضع هنا:** السطر 82.

### statusLogs->map

- **جاية منين؟** Laravel Collection

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback(value, key).

- **الناتج/الأثر — Return / effect:** Collection جديدة؛ ليست array إلا لو كملت all.

- **أول موضع هنا:** السطر 90.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** namespace بتحدد نطاق أسماء الكلاس `App\Http\Controllers\Api`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 5:** use / استيراد الاسم `App\Http\Controllers\Controller` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** use / استيراد الاسم `App\Models\Order` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 7:** use / استيراد الاسم `Illuminate\Http\JsonResponse` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 8:** use / استيراد الاسم `Illuminate\Http\Request` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php

class OrderTrackingController extends Controller
{
    public function show(string $token): JsonResponse
    {
        $order = Order::query()
            ->where('tracking_token', $token)
            ->with(['branch', 'items', 'statusLogs'])
```

**السطر 10:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

**السطر 11:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 12:** Function / تعريف دالة `show`؛ تعريفها مش تشغيلها. ابحث عن order بالtracking token وحمّل علاقاته ثم مرره لـ safeOrder. مدخلاتها: string token من URL. ناتجها: JSON order بالحقول المسموحة أو 404.

**السطر 13:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 14:** Assignment / إسناد: احسب `Order::query()` الأول وخزّن النتيجة في `$order`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 15:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->where(...)`: تضيف شرط فلترة أو مجموعة شروط. مدخلاتها: column/operator/value أو closure. العائد/الأثر: Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 16:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->with(...)`: تحدد علاقات يتم eager load لها عند الجلب. مدخلاتها: علاقات كنصوص/array. العائد/الأثر: Builder؛ التحميل يكتمل عند تنفيذ query.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 17–24

```php
            ->firstOrFail();

        return response()->json(['order' => $this->safeOrder($order)]);
    }

    public function history(Request $request): JsonResponse
    {
        $orders = $request->user()->orders()
```

**السطر 17:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->firstOrFail(...)`: أول صف مطابق أو404 عن طريق exception. مدخلاتها: columns اختيارية. العائد/الأثر: Model أو exception.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 19:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 20:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 22:** Function / تعريف دالة `history`؛ تعريفها مش تشغيلها. رجّع طلبات صاحب session فقط، الأحدث أولًا، مع token علشان يفتح التتبع. مدخلاتها: Request بمستخدم authenticated. ناتجها: JSON orders؛ كل عنصر خارج من safeOrder(order,true).

**السطر 23:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 24:** Assignment / إسناد: احسب `$request->user()->orders()` الأول وخزّن النتيجة في `$orders`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

### السطور 25–32

```php
            ->with(['branch', 'items', 'statusLogs'])
            ->latest()
            ->get()
            ->map(fn (Order $order) => $this->safeOrder($order, true));

        return response()->json(['orders' => $orders]);
    }

```

**السطر 25:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->with(...)`: تحدد علاقات يتم eager load لها عند الجلب. مدخلاتها: علاقات كنصوص/array. العائد/الأثر: Builder؛ التحميل يكتمل عند تنفيذ query.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 26:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->latest(...)`: تضيف ترتيبًا تنازليًا للأحدث. مدخلاتها: column اختياري؛ الافتراضي created_at. العائد/الأثر: Builder.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 27:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->get(...)`: تنفّذ الاستعلام وتجمع الصفوف. مدخلاتها: columns اختيارية. العائد/الأثر: Collection؛ مش استجابة JSON وحدها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 28:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->map(...)`: تحوّل كل عنصر إلى نتيجة callback. مدخلاتها: callback(value, key). العائد/الأثر: Collection جديدة؛ ليست array إلا لو كملت all.؛ `$this->safeOrder(...)`: اختار صراحةً حقول التتبع وبنوده وسجل حالاته؛ استبعد user_id وgateway_reference وغيرهم من الحقول الداخلية. مدخلاتها: Order بعلاقات محملة وbool includeToken افتراضي false. العائد/الأثر: array تمثل order؛ token يظهر فقط لو includeToken=true.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 30:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 31:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 33–40

```php
    public function reorder(Request $request, Order $order): JsonResponse
    {
        abort_unless((int) $order->user_id === (int) $request->user()->id, 404);
        $order->load(['branch', 'items.menuItem.branches']);

        $cartItems = $order->items->map(function ($line) use ($order) {
            $item = $line->menuItem;
            $option = $item?->branches->firstWhere('id', $order->branch_id);
```

**السطر 33:** Function / تعريف دالة `reorder`؛ تعريفها مش تشغيلها. راجع ملكية الطلب ثم ابنِ سلة جديدة من المنتجات النشطة المتاحة بسعر الفرع الحالي؛ مش السعر القديم. مدخلاتها: Request صاحب الحساب وOrder قديم من route binding. ناتجها: JSON branch_id/order_type/cart_items/skipped_items؛ لا ينشئ order جديدًا هنا.

**السطر 34:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 35:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$request->user(...)`: صاحب الحساب إن كان الطلب من مستخدم مسجل. مدخلاتها: orders.user_id nullable. العائد/الأثر: BelongsTo.؛ `abort_unless(...)`: لو الشرط false ارم HTTP exception وأوقف الطلب؛ لو true كمل. مدخلاتها: condition وstatus code ورسالة اختيارية. العائد/الأثر: لا قيمة مفيدة؛ قد يرمي exception.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 36:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$order->load(...)`: تحمّل علاقات على نتائج موجودة. مدخلاتها: العلاقات. العائد/الأثر: نفس model/collection بعد التحميل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 38:** Assignment / إسناد: احسب `$order->items->map(function ($line) use ($order) {` الأول وخزّن النتيجة في `$cartItems`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 39:** Assignment / إسناد: احسب `$line->menuItem` الأول وخزّن النتيجة في `$item`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 40:** Assignment / إسناد: احسب `$item?->branches->firstWhere('id', $order->branch_id)` الأول وخزّن النتيجة في `$option`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

### السطور 41–48

```php
            if (! $item?->is_active || ! $option?->pivot?->is_available) {
                return null;
            }

            return [
                'id' => $item->id,
                'name' => $item->name,
                'description' => $item->description,
```

**السطر 41:** if تختبر الشرط `! $item?->is_active || ! $option?->pivot?->is_available`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 42:** return تعيد التعبير `null` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 43:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 45:** return تعيد array القيم التالية. في ملف config دي إعدادات يستلمها Laravel وقت تحميل الإعداد؛ في method فهي ناتج يرجع للكود اللي ناداها. مش JSON response إلا لو بنينا response صراحة.

**السطر 46:** PHP array entry: المفتاح `id` مرتبط بالقيمة `$item->id`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 47:** PHP array entry: المفتاح `name` مرتبط بالقيمة `$item->name`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 48:** PHP array entry: المفتاح `description` مرتبط بالقيمة `$item->description`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 49–56

```php
                'price' => (float) $option->pivot->price,
                'image_src' => $item->image_path,
                'branch_id' => $order->branch_id,
                'branch_name' => $order->branch->name,
                'quantity' => $line->quantity,
                'notes' => $line->notes,
            ];
        })->filter()->values();
```

**السطر 49:** PHP array entry: المفتاح `price` مرتبط بالقيمة `(float) $option->pivot->price`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 50:** PHP array entry: المفتاح `image_src` مرتبط بالقيمة `$item->image_path`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 51:** PHP array entry: المفتاح `branch_id` مرتبط بالقيمة `$order->branch_id`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 52:** PHP array entry: المفتاح `branch_name` مرتبط بالقيمة `$order->branch->name`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 53:** PHP array entry: المفتاح `quantity` مرتبط بالقيمة `$line->quantity`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 54:** PHP array entry: المفتاح `notes` مرتبط بالقيمة `$line->notes`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 55:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 56:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->filter(...)`: تختار العناصر المطابقة. مدخلاتها: callback اختيارية. العائد/الأثر: Collection جديدة مع مفاتيح قد تحتاج values لإعادة ترقيمها.؛ `->values(...)`: أعد ترقيم المفاتيح من صفر بعد filter لتتسلسل النتيجة JSON array منتظمة. مدخلاتها: لا شيء. العائد/الأثر: Collection بمفاتيح رقمية متتابعة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 57–64

```php

        return response()->json([
            'branch_id' => $order->branch_id,
            'order_type' => $order->order_type,
            'cart_items' => $cartItems,
            'skipped_items' => $order->items->count() - $cartItems->count(),
        ]);
    }
```

**السطر 58:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 59:** PHP array entry: المفتاح `branch_id` مرتبط بالقيمة `$order->branch_id`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 60:** PHP array entry: المفتاح `order_type` مرتبط بالقيمة `$order->order_type`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 61:** PHP array entry: المفتاح `cart_items` مرتبط بالقيمة `$cartItems`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 62:** PHP array entry: المفتاح `skipped_items` مرتبط بالقيمة `$order->items->count() - $cartItems->count()`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 63:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 64:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 65–72

```php

    private function safeOrder(Order $order, bool $includeToken = false): array
    {
        return [
            'id' => $order->id,
            'tracking_token' => $includeToken ? $order->tracking_token : null,
            'status' => $order->status,
            'status_reason' => $order->status_reason,
```

**السطر 66:** Function / تعريف دالة `safeOrder`؛ تعريفها مش تشغيلها. اختار صراحةً حقول التتبع وبنوده وسجل حالاته؛ استبعد user_id وgateway_reference وغيرهم من الحقول الداخلية. مدخلاتها: Order بعلاقات محملة وbool includeToken افتراضي false. ناتجها: array تمثل order؛ token يظهر فقط لو includeToken=true.

**السطر 67:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 68:** return تعيد array القيم التالية. في ملف config دي إعدادات يستلمها Laravel وقت تحميل الإعداد؛ في method فهي ناتج يرجع للكود اللي ناداها. مش JSON response إلا لو بنينا response صراحة.

**السطر 69:** PHP array entry: المفتاح `id` مرتبط بالقيمة `$order->id`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 70:** PHP array entry: المفتاح `tracking_token` مرتبط بالقيمة `$includeToken ? $order->tracking_token : null`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 71:** PHP array entry: المفتاح `status` مرتبط بالقيمة `$order->status`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 72:** PHP array entry: المفتاح `status_reason` مرتبط بالقيمة `$order->status_reason`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 73–80

```php
            'order_type' => $order->order_type,
            'customer_name' => $order->customer_name,
            'customer_phone' => $order->customer_phone,
            'delivery_address' => $order->delivery_address,
            'pickup_time' => $order->pickup_time,
            'payment_method' => $order->payment_method,
            'payment_status' => $order->payment_status,
            'total_price' => $order->total_price,
```

**السطر 73:** PHP array entry: المفتاح `order_type` مرتبط بالقيمة `$order->order_type`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 74:** PHP array entry: المفتاح `customer_name` مرتبط بالقيمة `$order->customer_name`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 75:** PHP array entry: المفتاح `customer_phone` مرتبط بالقيمة `$order->customer_phone`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 76:** PHP array entry: المفتاح `delivery_address` مرتبط بالقيمة `$order->delivery_address`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 77:** PHP array entry: المفتاح `pickup_time` مرتبط بالقيمة `$order->pickup_time`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 78:** PHP array entry: المفتاح `payment_method` مرتبط بالقيمة `$order->payment_method`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 79:** PHP array entry: المفتاح `payment_status` مرتبط بالقيمة `$order->payment_status`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 80:** PHP array entry: المفتاح `total_price` مرتبط بالقيمة `$order->total_price`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 81–88

```php
            'created_at' => $order->created_at,
            'branch' => $order->branch?->only(['id', 'name', 'location', 'phone', 'opening_hours']),
            'items' => $order->items->map(fn ($item) => [
                'id' => $item->id,
                'item_name' => $item->item_name,
                'quantity' => $item->quantity,
                'price' => $item->price,
                'notes' => $item->notes,
```

**السطر 81:** PHP array entry: المفتاح `created_at` مرتبط بالقيمة `$order->created_at`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 82:** PHP array entry: المفتاح `branch` مرتبط بالقيمة `$order->branch?->only(['id', 'name', 'location', 'phone', 'opening_hours'])`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 83:** PHP array entry: المفتاح `items` مرتبط بالقيمة `$order->items->map(fn ($item) => [`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 84:** PHP array entry: المفتاح `id` مرتبط بالقيمة `$item->id`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 85:** PHP array entry: المفتاح `item_name` مرتبط بالقيمة `$item->item_name`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 86:** PHP array entry: المفتاح `quantity` مرتبط بالقيمة `$item->quantity`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 87:** PHP array entry: المفتاح `price` مرتبط بالقيمة `$item->price`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 88:** PHP array entry: المفتاح `notes` مرتبط بالقيمة `$item->notes`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 89–96

```php
            ]),
            'status_logs' => $order->statusLogs->map(fn ($log) => [
                'to_status' => $log->to_status,
                'reason' => $log->reason,
                'created_at' => $log->created_at,
            ]),
        ];
    }
```

**السطر 89:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 90:** PHP array entry: المفتاح `status_logs` مرتبط بالقيمة `$order->statusLogs->map(fn ($log) => [`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 91:** PHP array entry: المفتاح `to_status` مرتبط بالقيمة `$log->to_status`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 92:** PHP array entry: المفتاح `reason` مرتبط بالقيمة `$log->reason`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 93:** PHP array entry: المفتاح `created_at` مرتبط بالقيمة `$log->created_at`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 94:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 95:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 96:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 97–98

```php
}

```

**السطر 97:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
