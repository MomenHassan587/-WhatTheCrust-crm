# لوحة الموظف: القراءة وتغيير الحالة بأمان

[فهرس كل الأكواد](../../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `app/Http/Controllers/Api/StaffOrderController.php` · 122 سطر.

**وظيفة الملف:** يحصر الموظف في فرعه، يسمح للإدمن بكل الفروع، ويطبق انتقالات الطلب داخل transaction مع row lock. expected_status يكشف إن موظف تاني سبقك، وكل انتقال يتحفظ في order_status_logs.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../../app/Http/Controllers/Api/StaffOrderController.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Events/OrderStatusUpdated.php](../../../Events/OrderStatusUpdated.php.md)

- [pizza-crm/app/Http/Controllers/Controller.php](../Controller.php.md)

- [pizza-crm/app/Http/Requests/UpdateOrderStatusRequest.php](../../Requests/UpdateOrderStatusRequest.php.md)

- [pizza-crm/app/Models/Order.php](../../../Models/Order.php.md)

- [pizza-crm/app/Models/AppSetting.php](../../../Models/AppSetting.php.md)

- [pizza-crm/app/Models/OrderStatusLog.php](../../../Models/OrderStatusLog.php.md)

- [pizza-crm/resources/js/Pages/StaffDashboard.jsx](../../../../resources/js/Pages/StaffDashboard.jsx.md)

- [pizza-crm/app/Http/Middleware/RequireRole.php](../../Middleware/RequireRole.php.md)

- [pizza-crm/app/Models/User.php](../../../Models/User.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

namespace App\Http\Controllers\Api;

use App\Events\OrderStatusUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Models\Order;
use App\Models\AppSetting;
use App\Models\OrderStatusLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StaffOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'status' => ['nullable', 'string'],
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'date' => ['nullable', 'date_format:Y-m-d'],
        ]);

        $user = $request->user();
        $orders = Order::query()
            ->with(['branch', 'user', 'items.menuItem', 'statusLogs.user'])
            ->when(! $user->isAdmin(), fn ($query) => $query->where('branch_id', $user->branch_id))
            ->where('status', '!=', Order::STATUS_PAYMENT_PENDING)
            ->where(fn ($query) => $query->where('payment_method', 'cash')->orWhere('payment_status', 'paid'))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
            ->when($user->isAdmin() && $request->branch_id, fn ($query) => $query->where('branch_id', $request->branch_id))
            ->when($request->date, fn ($query, $date) => $query->whereDate('created_at', $date))
            ->latest()
            ->get();

        return response()->json([
            'orders' => $orders,
            'timing' => [
                'green_minutes' => (int) AppSetting::valueFor('order_promise_minutes', config('orders.kitchen_timer_green_minutes', 3)),
                'orange_minutes' => config('orders.kitchen_timer_orange_minutes', 6),
            ],
        ]);
    }

    public function show(Order $order): JsonResponse
    {
        $this->authorizeBranch(request(), $order);

        return response()->json(['order' => $order->load(['branch', 'user', 'items.menuItem', 'statusLogs.user'])]);
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): JsonResponse
    {
        $this->authorizeBranch($request, $order);
        $data = $request->validated();
        DB::transaction(function () use ($request, $order, $data): void {
            $lockedOrder = Order::query()->lockForUpdate()->findOrFail($order->id);

            if (($data['expected_status'] ?? null) && $lockedOrder->status !== $data['expected_status']) {
                $exception = ValidationException::withMessages([
                    'expected_status' => ['Another staff member already updated this order. The card has been refreshed.'],
                ]);
                $exception->status(409);
                throw $exception;
            }

            $steps = $lockedOrder->status === Order::STATUS_NEW && $data['status'] === Order::STATUS_PREPARING
                ? [Order::STATUS_ACCEPTED, Order::STATUS_PREPARING]
                : [$data['status']];

            foreach ($steps as $status) {
                $allowed = $this->allowedTransitions($lockedOrder);
                if (! in_array($status, $allowed, true)) {
                    throw ValidationException::withMessages([
                        'status' => ["Cannot move an order from {$lockedOrder->status} to {$status}."],
                    ]);
                }

                $from = $lockedOrder->status;
                $lockedOrder->update([
                    'status' => $status,
                    'status_reason' => in_array($status, [Order::STATUS_CANCELLED, Order::STATUS_REJECTED], true)
                        ? ($data['reason'] ?? null)
                        : null,
                ]);
                OrderStatusLog::create([
                    'order_id' => $lockedOrder->id,
                    'user_id' => $request->user()->id,
                    'from_status' => $from,
                    'to_status' => $status,
                    'reason' => $data['reason'] ?? null,
                    'created_at' => now(),
                ]);
            }
        });

        $order = $order->fresh()->load(['branch', 'user', 'items.menuItem', 'statusLogs.user']);
        OrderStatusUpdated::dispatch($order);

        return response()->json(['message' => 'Order status updated.', 'order' => $order]);
    }

    private function allowedTransitions(Order $order): array
    {
        if ($order->status === Order::STATUS_READY) {
            return $order->order_type === 'delivery'
                ? [Order::STATUS_OUT_FOR_DELIVERY, Order::STATUS_CANCELLED]
                : [Order::STATUS_PICKED_UP, Order::STATUS_CANCELLED];
        }

        return Order::TRANSITIONS[$order->status] ?? [];
    }

    private function authorizeBranch(Request $request, Order $order): void
    {
        $user = $request->user();
        abort_unless($user->isAdmin() || (int) $user->branch_id === (int) $order->branch_id, 404);
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### index

فلتر الطلبات حسب دور المستخدم/فرعه والتاريخ والحالة، وأبعد card orders غير المدفوعة، وأرجع إعدادات مؤقت المطبخ.

- **بتاخد إيه؟ Inputs:** Request فيها filters اختيارية status/branch_id/date ومستخدم authenticated.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON orders وtiming.green_minutes/orange_minutes.

### show

راجع صلاحية الفرع وارجع طلبًا واحدًا بعلاقاته.

- **بتاخد إيه؟ Inputs:** Order من route model binding.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON order أو 404 لو فرع مختلف.

### updateStatus

اقفل صف الطلب، افحص expected_status وانتقال الحالة، سجّل كل خطوة، ثم broadcast وأرجع أحدث order.

- **بتاخد إيه؟ Inputs:** UpdateOrderStatusRequest وOrder من URL؛ status/reason/expected_status.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON order/message؛ 409 عند تعارض نسخة قديمة؛ 422 لانتقال غير مسموح.

### allowedTransitions

حدد الحالات التالية؛ ready تتفرع حسب delivery أو pickup بدل السماح بالمسارين معًا.

- **بتاخد إيه؟ Inputs:** Order بحالته ونوعه الحاليين.

- **بترجع/بتغيّر إيه؟ Return / effect:** array من status strings؛ [] لو الحالة نهائية أو غير معروفة.

### authorizeBranch

اسمح للإدمن أو صاحب نفس الفرع فقط؛ 404 بدل كشف وجود طلب فرع تاني.

- **بتاخد إيه؟ Inputs:** Request الحالية وOrder المراد التعامل معه.

- **بترجع/بتغيّر إيه؟ Return / effect:** void لو مسموح، أو HTTP 404 يوقف التنفيذ.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### $request->validate

- **جاية منين؟** Laravel Request

- **وظيفتها:** شغّل validation بالقواعد المعطاة؛ لو بعضها غلط يوقف التنفيذ ويرجع أخطاء بدل ما يكمل controller.

- **المدخلات — Arguments:** array rules ثم messages وattributes اختيارية.

- **الناتج/الأثر — Return / effect:** array القيم التي عدّت القواعد؛ أو ValidationException عند الفشل.

- **أول موضع هنا:** السطر 20.

- **مثال:** $request->validate(['email' => ['required', 'email']]);

### $request->user

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** صاحب الحساب إن كان الطلب من مستخدم مسجل.

- **المدخلات — Arguments:** orders.user_id nullable.

- **الناتج/الأثر — Return / effect:** BelongsTo.

- **أول موضع هنا:** السطر 118.

- **تكملة التعريف:** [app/Models/Order.php](../../../Models/Order.php.md)، عند السطر 76.

- **تكملة التعريف:** [app/Models/OrderStatusLog.php](../../../Models/OrderStatusLog.php.md)، عند السطر 21.

### Order::query

- **جاية منين؟** Eloquent

- **وظيفتها:** تبدأ بناء query على model.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** Eloquent Builder، مش rows جاهزة.

- **أول موضع هنا:** السطر 59.

### ->with

- **جاية منين؟** Eloquent

- **وظيفتها:** تحدد علاقات يتم eager load لها عند الجلب.

- **المدخلات — Arguments:** علاقات كنصوص/array.

- **الناتج/الأثر — Return / effect:** Builder؛ التحميل يكتمل عند تنفيذ query.

- **أول موضع هنا:** السطر 28.

### ->when

- **جاية منين؟** Laravel Builder/Collection

- **وظيفتها:** تنفّذ callback شرطية حسب قيمة.

- **المدخلات — Arguments:** value وcallback وdefault اختيارية.

- **الناتج/الأثر — Return / effect:** نتيجة callback أو السلسلة؛ في query هنا لاستكمال بناء الشروط.

- **أول موضع هنا:** السطر 34.

### $user->isAdmin

- **جاية منين؟** دالة مخصّصة معرّفة في المشروع

- **وظيفتها:** هل role بالضبط admin؟

- **المدخلات — Arguments:** role الحالية.

- **الناتج/الأثر — Return / effect:** bool.

- **أول موضع هنا:** السطر 119.

- **تكملة التعريف:** [app/Models/User.php](../../../Models/User.php.md)، عند السطر 56.

### $query->where

- **جاية منين؟** Laravel Query Builder

- **وظيفتها:** تضيف شرط فلترة أو مجموعة شروط.

- **المدخلات — Arguments:** column/operator/value أو closure.

- **الناتج/الأثر — Return / effect:** Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.

- **أول موضع هنا:** السطر 33.

### ->where

- **جاية منين؟** Laravel Query Builder

- **وظيفتها:** تضيف شرط فلترة أو مجموعة شروط.

- **المدخلات — Arguments:** column/operator/value أو closure.

- **الناتج/الأثر — Return / effect:** Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.

- **أول موضع هنا:** السطر 31.

### ->orWhere

- **جاية منين؟** Laravel Query Builder

- **وظيفتها:** تضيف شرط OR في المجموعة الحالية.

- **المدخلات — Arguments:** column/value أو closure.

- **الناتج/الأثر — Return / effect:** Builder؛ الأقواس/المجموعات مهمة لمعنى OR.

- **أول موضع هنا:** السطر 31.

### $query->whereDate

- **جاية منين؟** Laravel Query Builder

- **وظيفتها:** تقارن جزء التاريخ من عمود.

- **المدخلات — Arguments:** column وdate/operator.

- **الناتج/الأثر — Return / effect:** Builder.

- **أول موضع هنا:** السطر 34.

### ->latest

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تضيف ترتيبًا تنازليًا للأحدث.

- **المدخلات — Arguments:** column اختياري؛ الافتراضي created_at.

- **الناتج/الأثر — Return / effect:** Builder.

- **أول موضع هنا:** السطر 35.

### ->get

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تنفّذ الاستعلام وتجمع الصفوف.

- **المدخلات — Arguments:** columns اختيارية.

- **الناتج/الأثر — Return / effect:** Collection؛ مش استجابة JSON وحدها.

- **أول موضع هنا:** السطر 36.

### ->json

- **جاية منين؟** Laravel Response factory

- **وظيفتها:** تجهّز HTTP response من بيانات JSON.

- **المدخلات — Arguments:** data وstatus وheaders.

- **الناتج/الأثر — Return / effect:** JsonResponse، مش object JavaScript مشترك بين PHP والمتصفح.

- **أول موضع هنا:** السطر 102.

### response

- **جاية منين؟** Laravel helper

- **وظيفتها:** جهّز HTTP response. بدون arguments هات factory نكمل عليها json أو view أو streamDownload.

- **المدخلات — Arguments:** بدون arguments للـ factory؛ أو content ثم status ثم headers لإنشاء response مباشرة.

- **الناتج/الأثر — Return / effect:** ResponseFactory بدون arguments، أو HTTP Response عند تمرير content؛ مش إرسال شبكة من browser.

- **أول موضع هنا:** السطر 102.

- **مثال:** return response()->json(['message' => 'Saved'], 201);

### AppSetting::valueFor

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** query على key ثم value('value') وبعدها null-coalescing إلى default.

- **المدخلات — Arguments:** string key وmixed default افتراضي null.

- **الناتج/الأثر — Return / effect:** mixed قيمة setting أو default؛ caller مسؤول عن cast المطلوب.

- **أول موضع هنا:** السطر 41.

- **تكملة التعريف:** [app/Models/AppSetting.php](../../../Models/AppSetting.php.md)، عند السطر 11.

### config

- **جاية منين؟** Laravel helper

- **وظيفتها:** اقرأ إعدادًا من ملفات config بالقيمة المحملة وقت تشغيل التطبيق؛ النقطة تفصل الملف عن المفتاح الداخلي.

- **المدخلات — Arguments:** key بصيغة dot notation مثل services.stripe.key، ثم default اختيارية. بدون key يرجع config repository، وarray تضبط إعدادات.

- **الناتج/الأثر — Return / effect:** قيمة الإعداد أو default في الاستخدام الحالي؛ ليست بالضرورة string ولا قيمة env مباشرة.

- **أول موضع هنا:** السطر 42.

- **مثال:** config('orders.minimum_pickup_prep_minutes', 20)

### $this->authorizeBranch

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** اسمح للإدمن أو صاحب نفس الفرع فقط؛ 404 بدل كشف وجود طلب فرع تاني.

- **المدخلات — Arguments:** Request الحالية وOrder المراد التعامل معه.

- **الناتج/الأثر — Return / effect:** void لو مسموح، أو HTTP 404 يوقف التنفيذ.

- **أول موضع هنا:** السطر 56.

### request

- **جاية منين؟** Laravel helper

- **وظيفتها:** هات request الحالية أو input محددة منها؛ في show() يستخدم request() بدل parameter صريحة للوصول للمستخدم.

- **المدخلات — Arguments:** بدون arguments للحصول على Request، أو key وdefault لقراءة input.

- **الناتج/الأثر — Return / effect:** Request object بدون key، أو قيمة المدخل عند تمرير key.

- **أول موضع هنا:** السطر 49.

- **مثال:** $this->authorizeBranch(request(), $order);

### $order->load

- **جاية منين؟** Eloquent Model/Collection

- **وظيفتها:** تحمّل علاقات على نتائج موجودة.

- **المدخلات — Arguments:** العلاقات.

- **الناتج/الأثر — Return / effect:** نفس model/collection بعد التحميل.

- **أول موضع هنا:** السطر 51.

### $request->validated

- **جاية منين؟** Laravel FormRequest

- **وظيفتها:** اقرأ بيانات FormRequest التي عدّت validation؛ لا تعيد تشغيل business operation ولا إدخال DB.

- **المدخلات — Arguments:** key وdefault اختياريان؛ هنا الدالة بدون arguments لإرجاع البيانات كلها.

- **الناتج/الأثر — Return / effect:** array من validated input في الاستخدام الحالي.

- **أول موضع هنا:** السطر 57.

- **مثال:** $data = $request->validated();

### DB::transaction

- **جاية منين؟** Laravel Database Connection

- **وظيفتها:** شغّل callback داخل DB transaction؛ commit عند النجاح وrollback عند exception. لا يتراجع به ملف صورة أوطلب Stripe خارجي.

- **المدخلات — Arguments:** Closure callback، وعدد محاولات integer اختياري افتراضي1.

- **الناتج/الأثر — Return / effect:** نفس القيمة الراجعة من callback؛ يعيد رمي exception عند الفشل النهائي.

- **أول موضع هنا:** السطر 58.

- **مثال:** return DB::transaction(function () use ($data) { return Order::create($data); });

### ->lockForUpdate

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تطلب قفل rows مناسبًا داخل transaction.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** Builder؛ السلوك الفعلي يعتمد على محرك DB.

- **أول موضع هنا:** السطر 59.

### ->findOrFail

- **جاية منين؟** Eloquent

- **وظيفتها:** تبحث بالـprimary key أو تفشل.

- **المدخلات — Arguments:** id.

- **الناتج/الأثر — Return / effect:** model أو exception تترجم عادة404.

- **أول موضع هنا:** السطر 59.

### ValidationException::withMessages

- **جاية منين؟** Laravel ValidationException

- **وظيفتها:** ابنِ exception بأخطاء مرتبطة بأسماء حقول زي items أو expected_status.

- **المدخلات — Arguments:** array field=>messages.

- **الناتج/الأثر — Return / effect:** ValidationException؛ throw هو اللي يرميها.

- **أول موضع هنا:** السطر 76.

- **مثال:** throw ValidationException::withMessages(['items' => ['Unavailable']]);

### $exception->status

- **جاية منين؟** Laravel ValidationException

- **وظيفتها:** اضبط رمز HTTP اللي validation exception ستستخدمه لما يتم throw، مثل تعارض 409 بدل 422.

- **المدخلات — Arguments:** HTTP status integer هنا 409.

- **الناتج/الأثر — Return / effect:** نفس ValidationException object؛ السطر ده لا يرميها بنفسه، لازم throw بعده.

- **أول موضع هنا:** السطر 65.

- **مثال:** $exception->status(409);

### $this->allowedTransitions

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** حدد الحالات التالية؛ ready تتفرع حسب delivery أو pickup بدل السماح بالمسارين معًا.

- **المدخلات — Arguments:** Order بحالته ونوعه الحاليين.

- **الناتج/الأثر — Return / effect:** array من status strings؛ [] لو الحالة نهائية أو غير معروفة.

- **أول موضع هنا:** السطر 74.

### in_array

- **جاية منين؟** PHP built-in

- **وظيفتها:** هل قيمة موجودة في array؟ المعامل الثالث true يمنع تحويل الأنواع أثناء المقارنة.

- **المدخلات — Arguments:** needle ثم haystack ثم strict bool.

- **الناتج/الأثر — Return / effect:** bool.

- **أول موضع هنا:** السطر 84.

- **مثال:** in_array($status, $allowed, true)

### $lockedOrder->update

- **جاية منين؟** Eloquent

- **وظيفتها:** تكتب تغييرات في DB.

- **المدخلات — Arguments:** attributes array.

- **الناتج/الأثر — Return / effect:** Boolean على model أو عدد صفوف على builder؛ حسب المستقبِل.

- **أول موضع هنا:** السطر 82.

### OrderStatusLog::create

- **جاية منين؟** Eloquent/Relation

- **وظيفتها:** تنشئ صفًا ببيانات ملء مسموحة.

- **المدخلات — Arguments:** attributes array.

- **الناتج/الأثر — Return / effect:** model المحفوظ؛ ليست validation أو authorization تلقائية.

- **أول موضع هنا:** السطر 88.

### now

- **جاية منين؟** Laravel Date helper / Carbon

- **وظيفتها:** أنشئ object يمثل الوقت الحالي بتوقيت التطبيق أو المنطقة المطلوبة؛ ليست JS Date.now التي ترجع milliseconds.

- **المدخلات — Arguments:** timezone اختيارية؛ المشروع غالبًا بدون arguments.

- **الناتج/الأثر — Return / effect:** Carbon date-time object يمكن تنسيقها أو إضافة دقائق لها؛ ليست string تلقائيًا.

- **أول موضع هنا:** السطر 94.

- **مثال:** now()->addMinutes(20)

### $order->fresh

- **جاية منين؟** Laravel Eloquent Model

- **وظيفتها:** هات نسخة جديدة من السجل من DB بدل الاعتماد على نسخة قديمة في الذاكرة.

- **المدخلات — Arguments:** relations اختيارية.

- **الناتج/الأثر — Return / effect:** Model جديدة أو null لو السجل اختفى.

- **أول موضع هنا:** السطر 99.

- **مثال:** $order = $order->fresh()->load('items');

### ->load

- **جاية منين؟** Eloquent Model/Collection

- **وظيفتها:** تحمّل علاقات على نتائج موجودة.

- **المدخلات — Arguments:** العلاقات.

- **الناتج/الأثر — Return / effect:** نفس model/collection بعد التحميل.

- **أول موضع هنا:** السطر 99.

### OrderStatusUpdated::dispatch

- **جاية منين؟** Laravel Event

- **وظيفتها:** تطلق event مع بياناته.

- **المدخلات — Arguments:** arguments الحدث.

- **الناتج/الأثر — Return / effect:** نتائج listeners أو null حسب dispatch؛ لا يثبت WebSocket في المتصفح.

- **أول موضع هنا:** السطر 100.

### abort_unless

- **جاية منين؟** Laravel helper

- **وظيفتها:** لو الشرط false ارم HTTP exception وأوقف الطلب؛ لو true كمل.

- **المدخلات — Arguments:** condition وstatus code ورسالة اختيارية.

- **الناتج/الأثر — Return / effect:** لا قيمة مفيدة؛ قد يرمي exception.

- **أول موضع هنا:** السطر 119.

- **مثال:** abort_unless($user->isAdmin(), 403);

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

namespace App\Http\Controllers\Api;

use App\Events\OrderStatusUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Models\Order;
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** namespace بتحدد نطاق أسماء الكلاس `App\Http\Controllers\Api`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 5:** use / استيراد الاسم `App\Events\OrderStatusUpdated` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** use / استيراد الاسم `App\Http\Controllers\Controller` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 7:** use / استيراد الاسم `App\Http\Requests\UpdateOrderStatusRequest` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 8:** use / استيراد الاسم `App\Models\Order` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php
use App\Models\AppSetting;
use App\Models\OrderStatusLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StaffOrderController extends Controller
```

**السطر 9:** use / استيراد الاسم `App\Models\AppSetting` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 10:** use / استيراد الاسم `App\Models\OrderStatusLog` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 11:** use / استيراد الاسم `Illuminate\Http\JsonResponse` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 12:** use / استيراد الاسم `Illuminate\Http\Request` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 13:** use / استيراد الاسم `Illuminate\Support\Facades\DB` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 14:** use / استيراد الاسم `Illuminate\Validation\ValidationException` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 16:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

### السطور 17–24

```php
{
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'status' => ['nullable', 'string'],
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'date' => ['nullable', 'date_format:Y-m-d'],
        ]);
```

**السطر 17:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 18:** Function / تعريف دالة `index`؛ تعريفها مش تشغيلها. فلتر الطلبات حسب دور المستخدم/فرعه والتاريخ والحالة، وأبعد card orders غير المدفوعة، وأرجع إعدادات مؤقت المطبخ. مدخلاتها: Request فيها filters اختيارية status/branch_id/date ومستخدم authenticated. ناتجها: JSON orders وtiming.green_minutes/orange_minutes.

**السطر 19:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 20:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$request->validate(...)`: شغّل validation بالقواعد المعطاة؛ لو بعضها غلط يوقف التنفيذ ويرجع أخطاء بدل ما يكمل controller. مدخلاتها: array rules ثم messages وattributes اختيارية. العائد/الأثر: array القيم التي عدّت القواعد؛ أو ValidationException عند الفشل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 21:** قواعد حقل `status` داخل array التحقق: `nullable` = مسموح تكون قيمته null؛ `string` = نص. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 22:** قواعد حقل `branch_id` داخل array التحقق: `nullable` = مسموح تكون قيمته null؛ `integer` = عدد صحيح؛ `exists:branches,id` = القيمة لازم تكون موجودة في الجدول والعمود المحددين. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 23:** قواعد حقل `date` داخل array التحقق: `nullable` = مسموح تكون قيمته null؛ `date_format:Y-m-d` قاعدة إضافية يفسّرها Laravel. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 24:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 25–32

```php

        $user = $request->user();
        $orders = Order::query()
            ->with(['branch', 'user', 'items.menuItem', 'statusLogs.user'])
            ->when(! $user->isAdmin(), fn ($query) => $query->where('branch_id', $user->branch_id))
            ->where('status', '!=', Order::STATUS_PAYMENT_PENDING)
            ->where(fn ($query) => $query->where('payment_method', 'cash')->orWhere('payment_status', 'paid'))
            ->when($request->status, fn ($query, $status) => $query->where('status', $status))
```

**السطر 26:** Assignment / إسناد: احسب `$request->user()` الأول وخزّن النتيجة في `$user`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 27:** Assignment / إسناد: احسب `Order::query()` الأول وخزّن النتيجة في `$orders`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 28:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->with(...)`: تحدد علاقات يتم eager load لها عند الجلب. مدخلاتها: علاقات كنصوص/array. العائد/الأثر: Builder؛ التحميل يكتمل عند تنفيذ query.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 29:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->when(...)`: تنفّذ callback شرطية حسب قيمة. مدخلاتها: value وcallback وdefault اختيارية. العائد/الأثر: نتيجة callback أو السلسلة؛ في query هنا لاستكمال بناء الشروط.؛ `$user->isAdmin(...)`: هل role بالضبط admin؟ مدخلاتها: role الحالية. العائد/الأثر: bool.؛ `$query->where(...)`: تضيف شرط فلترة أو مجموعة شروط. مدخلاتها: column/operator/value أو closure. العائد/الأثر: Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 30:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->where(...)`: تضيف شرط فلترة أو مجموعة شروط. مدخلاتها: column/operator/value أو closure. العائد/الأثر: Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 31:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->where(...)`: تضيف شرط فلترة أو مجموعة شروط. مدخلاتها: column/operator/value أو closure. العائد/الأثر: Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.؛ `$query->where(...)`: تضيف شرط فلترة أو مجموعة شروط. مدخلاتها: column/operator/value أو closure. العائد/الأثر: Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.؛ `->orWhere(...)`: تضيف شرط OR في المجموعة الحالية. مدخلاتها: column/value أو closure. العائد/الأثر: Builder؛ الأقواس/المجموعات مهمة لمعنى OR.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 32:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->when(...)`: تنفّذ callback شرطية حسب قيمة. مدخلاتها: value وcallback وdefault اختيارية. العائد/الأثر: نتيجة callback أو السلسلة؛ في query هنا لاستكمال بناء الشروط.؛ `$query->where(...)`: تضيف شرط فلترة أو مجموعة شروط. مدخلاتها: column/operator/value أو closure. العائد/الأثر: Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 33–40

```php
            ->when($user->isAdmin() && $request->branch_id, fn ($query) => $query->where('branch_id', $request->branch_id))
            ->when($request->date, fn ($query, $date) => $query->whereDate('created_at', $date))
            ->latest()
            ->get();

        return response()->json([
            'orders' => $orders,
            'timing' => [
```

**السطر 33:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->when(...)`: تنفّذ callback شرطية حسب قيمة. مدخلاتها: value وcallback وdefault اختيارية. العائد/الأثر: نتيجة callback أو السلسلة؛ في query هنا لاستكمال بناء الشروط.؛ `$user->isAdmin(...)`: هل role بالضبط admin؟ مدخلاتها: role الحالية. العائد/الأثر: bool.؛ `$query->where(...)`: تضيف شرط فلترة أو مجموعة شروط. مدخلاتها: column/operator/value أو closure. العائد/الأثر: Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 34:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->when(...)`: تنفّذ callback شرطية حسب قيمة. مدخلاتها: value وcallback وdefault اختيارية. العائد/الأثر: نتيجة callback أو السلسلة؛ في query هنا لاستكمال بناء الشروط.؛ `$query->whereDate(...)`: تقارن جزء التاريخ من عمود. مدخلاتها: column وdate/operator. العائد/الأثر: Builder.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 35:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->latest(...)`: تضيف ترتيبًا تنازليًا للأحدث. مدخلاتها: column اختياري؛ الافتراضي created_at. العائد/الأثر: Builder.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 36:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->get(...)`: تنفّذ الاستعلام وتجمع الصفوف. مدخلاتها: columns اختيارية. العائد/الأثر: Collection؛ مش استجابة JSON وحدها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 38:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 39:** PHP array entry: المفتاح `orders` مرتبط بالقيمة `$orders`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 40:** PHP array entry: المفتاح `timing` مرتبط بالقيمة `[`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 41–48

```php
                'green_minutes' => (int) AppSetting::valueFor('order_promise_minutes', config('orders.kitchen_timer_green_minutes', 3)),
                'orange_minutes' => config('orders.kitchen_timer_orange_minutes', 6),
            ],
        ]);
    }

    public function show(Order $order): JsonResponse
    {
```

**السطر 41:** PHP array entry: المفتاح `green_minutes` مرتبط بالقيمة `(int) AppSetting::valueFor('order_promise_minutes', config('orders.kitchen_timer_green_minutes', 3))`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 42:** PHP array entry: المفتاح `orange_minutes` مرتبط بالقيمة `config('orders.kitchen_timer_orange_minutes', 6)`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 43:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 44:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 45:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 47:** Function / تعريف دالة `show`؛ تعريفها مش تشغيلها. راجع صلاحية الفرع وارجع طلبًا واحدًا بعلاقاته. مدخلاتها: Order من route model binding. ناتجها: JSON order أو 404 لو فرع مختلف.

**السطر 48:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

### السطور 49–56

```php
        $this->authorizeBranch(request(), $order);

        return response()->json(['order' => $order->load(['branch', 'user', 'items.menuItem', 'statusLogs.user'])]);
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): JsonResponse
    {
        $this->authorizeBranch($request, $order);
```

**السطر 49:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->authorizeBranch(...)`: اسمح للإدمن أو صاحب نفس الفرع فقط؛ 404 بدل كشف وجود طلب فرع تاني. مدخلاتها: Request الحالية وOrder المراد التعامل معه. العائد/الأثر: void لو مسموح، أو HTTP 404 يوقف التنفيذ.؛ `request(...)`: هات request الحالية أو input محددة منها؛ في show() يستخدم request() بدل parameter صريحة للوصول للمستخدم. مدخلاتها: بدون arguments للحصول على Request، أو key وdefault لقراءة input. العائد/الأثر: Request object بدون key، أو قيمة المدخل عند تمرير key.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 51:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 52:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 54:** Function / تعريف دالة `updateStatus`؛ تعريفها مش تشغيلها. اقفل صف الطلب، افحص expected_status وانتقال الحالة، سجّل كل خطوة، ثم broadcast وأرجع أحدث order. مدخلاتها: UpdateOrderStatusRequest وOrder من URL؛ status/reason/expected_status. ناتجها: JSON order/message؛ 409 عند تعارض نسخة قديمة؛ 422 لانتقال غير مسموح.

**السطر 55:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 56:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->authorizeBranch(...)`: اسمح للإدمن أو صاحب نفس الفرع فقط؛ 404 بدل كشف وجود طلب فرع تاني. مدخلاتها: Request الحالية وOrder المراد التعامل معه. العائد/الأثر: void لو مسموح، أو HTTP 404 يوقف التنفيذ.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 57–64

```php
        $data = $request->validated();
        DB::transaction(function () use ($request, $order, $data): void {
            $lockedOrder = Order::query()->lockForUpdate()->findOrFail($order->id);

            if (($data['expected_status'] ?? null) && $lockedOrder->status !== $data['expected_status']) {
                $exception = ValidationException::withMessages([
                    'expected_status' => ['Another staff member already updated this order. The card has been refreshed.'],
                ]);
```

**السطر 57:** Assignment / إسناد: احسب `$request->validated()` الأول وخزّن النتيجة في `$data`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 58:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `DB::transaction(...)`: شغّل callback داخل DB transaction؛ commit عند النجاح وrollback عند exception. لا يتراجع به ملف صورة أوطلب Stripe خارجي. مدخلاتها: Closure callback، وعدد محاولات integer اختياري افتراضي1. العائد/الأثر: نفس القيمة الراجعة من callback؛ يعيد رمي exception عند الفشل النهائي.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 59:** Assignment / إسناد: احسب `Order::query()->lockForUpdate()->findOrFail($order->id)` الأول وخزّن النتيجة في `$lockedOrder`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 61:** if تختبر الشرط `($data['expected_status'] ?? null) && $lockedOrder->status !== $data['expected_status']`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 62:** Assignment / إسناد: احسب `ValidationException::withMessages([` الأول وخزّن النتيجة في `$exception`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 63:** PHP array entry: المفتاح `expected_status` مرتبط بالقيمة `['Another staff member already updated this order. The card has been refreshed.']`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 64:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 65–72

```php
                $exception->status(409);
                throw $exception;
            }

            $steps = $lockedOrder->status === Order::STATUS_NEW && $data['status'] === Order::STATUS_PREPARING
                ? [Order::STATUS_ACCEPTED, Order::STATUS_PREPARING]
                : [$data['status']];

```

**السطر 65:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$exception->status(...)`: اضبط رمز HTTP اللي validation exception ستستخدمه لما يتم throw، مثل تعارض 409 بدل 422. مدخلاتها: HTTP status integer هنا 409. العائد/الأثر: نفس ValidationException object؛ السطر ده لا يرميها بنفسه، لازم throw بعده.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 66:** throw ترمي الاستثناء `$exception;` وتوقف المسار العادي. Laravel exception handler أو catch المناسبة تتعامل معاه؛ مش مجرد رسالة بتنطبع وتكمّل التنفيذ.

**السطر 67:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 69:** Assignment / إسناد: احسب `$lockedOrder->status === Order::STATUS_NEW && $data['status'] === Order::STATUS_PREPARING` الأول وخزّن النتيجة في `$steps`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 70:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 71:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 73–80

```php
            foreach ($steps as $status) {
                $allowed = $this->allowedTransitions($lockedOrder);
                if (! in_array($status, $allowed, true)) {
                    throw ValidationException::withMessages([
                        'status' => ["Cannot move an order from {$lockedOrder->status} to {$status}."],
                    ]);
                }

```

**السطر 73:** Loop / حلقة مرور؛ تعيد تنفيذ الجسم حسب الشرط/العناصر. راقب المتغير الحالي وما الذي يتغيّر في كل دورة.

**السطر 74:** Assignment / إسناد: احسب `$this->allowedTransitions($lockedOrder)` الأول وخزّن النتيجة في `$allowed`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 75:** if تختبر الشرط `! in_array($status, $allowed, true)`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 76:** throw ترمي الاستثناء `ValidationException::withMessages([` وتوقف المسار العادي. Laravel exception handler أو catch المناسبة تتعامل معاه؛ مش مجرد رسالة بتنطبع وتكمّل التنفيذ.

**السطر 77:** PHP array entry: المفتاح `status` مرتبط بالقيمة `["Cannot move an order from {$lockedOrder->status} to {$status}."]`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 78:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 79:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 81–88

```php
                $from = $lockedOrder->status;
                $lockedOrder->update([
                    'status' => $status,
                    'status_reason' => in_array($status, [Order::STATUS_CANCELLED, Order::STATUS_REJECTED], true)
                        ? ($data['reason'] ?? null)
                        : null,
                ]);
                OrderStatusLog::create([
```

**السطر 81:** Assignment / إسناد: احسب `$lockedOrder->status` الأول وخزّن النتيجة في `$from`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 82:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$lockedOrder->update(...)`: تكتب تغييرات في DB. مدخلاتها: attributes array. العائد/الأثر: Boolean على model أو عدد صفوف على builder؛ حسب المستقبِل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 83:** PHP array entry: المفتاح `status` مرتبط بالقيمة `$status`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 84:** PHP array entry: المفتاح `status_reason` مرتبط بالقيمة `in_array($status, [Order::STATUS_CANCELLED, Order::STATUS_REJECTED], true)`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 85:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 86:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 87:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 88:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `OrderStatusLog::create(...)`: تنشئ صفًا ببيانات ملء مسموحة. مدخلاتها: attributes array. العائد/الأثر: model المحفوظ؛ ليست validation أو authorization تلقائية.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 89–96

```php
                    'order_id' => $lockedOrder->id,
                    'user_id' => $request->user()->id,
                    'from_status' => $from,
                    'to_status' => $status,
                    'reason' => $data['reason'] ?? null,
                    'created_at' => now(),
                ]);
            }
```

**السطر 89:** PHP array entry: المفتاح `order_id` مرتبط بالقيمة `$lockedOrder->id`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 90:** PHP array entry: المفتاح `user_id` مرتبط بالقيمة `$request->user()->id`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 91:** PHP array entry: المفتاح `from_status` مرتبط بالقيمة `$from`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 92:** PHP array entry: المفتاح `to_status` مرتبط بالقيمة `$status`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 93:** PHP array entry: المفتاح `reason` مرتبط بالقيمة `$data['reason'] ?? null`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 94:** PHP array entry: المفتاح `created_at` مرتبط بالقيمة `now()`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 95:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 96:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 97–104

```php
        });

        $order = $order->fresh()->load(['branch', 'user', 'items.menuItem', 'statusLogs.user']);
        OrderStatusUpdated::dispatch($order);

        return response()->json(['message' => 'Order status updated.', 'order' => $order]);
    }

```

**السطر 97:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 99:** Assignment / إسناد: احسب `$order->fresh()->load(['branch', 'user', 'items.menuItem', 'statusLogs.user'])` الأول وخزّن النتيجة في `$order`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 100:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `OrderStatusUpdated::dispatch(...)`: تطلق event مع بياناته. مدخلاتها: arguments الحدث. العائد/الأثر: نتائج listeners أو null حسب dispatch؛ لا يثبت WebSocket في المتصفح.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 102:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 103:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 105–112

```php
    private function allowedTransitions(Order $order): array
    {
        if ($order->status === Order::STATUS_READY) {
            return $order->order_type === 'delivery'
                ? [Order::STATUS_OUT_FOR_DELIVERY, Order::STATUS_CANCELLED]
                : [Order::STATUS_PICKED_UP, Order::STATUS_CANCELLED];
        }

```

**السطر 105:** Function / تعريف دالة `allowedTransitions`؛ تعريفها مش تشغيلها. حدد الحالات التالية؛ ready تتفرع حسب delivery أو pickup بدل السماح بالمسارين معًا. مدخلاتها: Order بحالته ونوعه الحاليين. ناتجها: array من status strings؛ [] لو الحالة نهائية أو غير معروفة.

**السطر 106:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 107:** if تختبر الشرط `$order->status === Order::STATUS_READY`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 108:** return تعيد التعبير `$order->order_type === 'delivery'` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 109:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 110:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 111:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 113–120

```php
        return Order::TRANSITIONS[$order->status] ?? [];
    }

    private function authorizeBranch(Request $request, Order $order): void
    {
        $user = $request->user();
        abort_unless($user->isAdmin() || (int) $user->branch_id === (int) $order->branch_id, 404);
    }
```

**السطر 113:** return تعيد التعبير `Order::TRANSITIONS[$order->status] ?? []` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 114:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 116:** Function / تعريف دالة `authorizeBranch`؛ تعريفها مش تشغيلها. اسمح للإدمن أو صاحب نفس الفرع فقط؛ 404 بدل كشف وجود طلب فرع تاني. مدخلاتها: Request الحالية وOrder المراد التعامل معه. ناتجها: void لو مسموح، أو HTTP 404 يوقف التنفيذ.

**السطر 117:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 118:** Assignment / إسناد: احسب `$request->user()` الأول وخزّن النتيجة في `$user`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 119:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$user->isAdmin(...)`: هل role بالضبط admin؟ مدخلاتها: role الحالية. العائد/الأثر: bool.؛ `abort_unless(...)`: لو الشرط false ارم HTTP exception وأوقف الطلب؛ لو true كمل. مدخلاتها: condition وstatus code ورسالة اختيارية. العائد/الأثر: لا قيمة مفيدة؛ قد يرمي exception.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 120:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 121–122

```php
}

```

**السطر 121:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
