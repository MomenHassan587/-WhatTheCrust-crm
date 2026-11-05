# إنشاء طلب كاش

[فهرس كل الأكواد](../../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `app/Http/Controllers/Api/OrderController.php` · 33 سطر.

**وظيفة الملف:** نقطة دخول الطلب العادي من Cart. بيرفض card هنا عشان ما يتسجلش طلب مدفوع من مجرد كلام المتصفح. الشغل الفعلي لإنشاء الطلب وحساب الأسعار في OrderCreator، وبعده يرسل OrderPlaced ويرجع tracking_url.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../../app/Http/Controllers/Api/OrderController.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Events/OrderPlaced.php](../../../Events/OrderPlaced.php.md)

- [pizza-crm/app/Http/Controllers/Controller.php](../Controller.php.md)

- [pizza-crm/app/Http/Requests/StoreOrderRequest.php](../../Requests/StoreOrderRequest.php.md)

- [pizza-crm/app/Models/Order.php](../../../Models/Order.php.md)

- [pizza-crm/app/Services/Orders/OrderCreator.php](../../../Services/Orders/OrderCreator.php.md)

- [pizza-crm/resources/js/Pages/Cart.jsx](../../../../resources/js/Pages/Cart.jsx.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

namespace App\Http\Controllers\Api;

use App\Events\OrderPlaced;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
use App\Services\Orders\OrderCreator;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function store(StoreOrderRequest $request, OrderCreator $creator): JsonResponse
    {
        $data = $request->validated();
        if ($data['payment_method'] === 'card') {
            throw ValidationException::withMessages(['payment_method' => ['Card orders must use the payment intent endpoint.']]);
        }

        $order = $creator->create($data, $request->user(), Order::STATUS_NEW);
        OrderPlaced::dispatch($order);

        return response()->json([
            'message' => 'Order created successfully.',
            'order' => $order,
            'tracking_token' => $order->tracking_token,
            'tracking_url' => "/orders/{$order->tracking_token}",
        ], 201);
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### store

خد البيانات اللي عدّت StoreOrderRequest، ارفض card، أنشئ طلب new وارجع لينك التتبع.

- **بتاخد إيه؟ Inputs:** StoreOrderRequest وOrderCreator يحقنهم Laravel.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON order وtracking_token وtracking_url، status 201.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### $request->validated

- **جاية منين؟** Laravel FormRequest

- **وظيفتها:** اقرأ بيانات FormRequest التي عدّت validation؛ لا تعيد تشغيل business operation ولا إدخال DB.

- **المدخلات — Arguments:** key وdefault اختياريان؛ هنا الدالة بدون arguments لإرجاع البيانات كلها.

- **الناتج/الأثر — Return / effect:** array من validated input في الاستخدام الحالي.

- **أول موضع هنا:** السطر 17.

- **مثال:** $data = $request->validated();

### ValidationException::withMessages

- **جاية منين؟** Laravel ValidationException

- **وظيفتها:** ابنِ exception بأخطاء مرتبطة بأسماء حقول زي items أو expected_status.

- **المدخلات — Arguments:** array field=>messages.

- **الناتج/الأثر — Return / effect:** ValidationException؛ throw هو اللي يرميها.

- **أول موضع هنا:** السطر 19.

- **مثال:** throw ValidationException::withMessages(['items' => ['Unavailable']]);

### $creator->create

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** تحقق من الفرع والتوصيل وإتاحة كل منتج، احسب الإجمالي واحفظ order/items مع نسخة اسم وسعر وقت الطلب.

- **المدخلات — Arguments:** array $data المحققة، ?User $user ممكن null للضيف، string $status يحدده الكاش أو الدفع.

- **الناتج/الأثر — Return / effect:** Order محمّل بعلاقات branch وuser وitems.menuItem؛ يرمي ValidationException لو بند/توصيل غير متاح.

- **أول موضع هنا:** السطر 22.

- **تكملة التعريف:** [app/Services/Orders/OrderCreator.php](../../../Services/Orders/OrderCreator.php.md)، عند السطر 15.

### $request->user

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** صاحب الحساب إن كان الطلب من مستخدم مسجل.

- **المدخلات — Arguments:** orders.user_id nullable.

- **الناتج/الأثر — Return / effect:** BelongsTo.

- **أول موضع هنا:** السطر 22.

- **تكملة التعريف:** [app/Models/Order.php](../../../Models/Order.php.md)، عند السطر 76.

### OrderPlaced::dispatch

- **جاية منين؟** Laravel Event

- **وظيفتها:** تطلق event مع بياناته.

- **المدخلات — Arguments:** arguments الحدث.

- **الناتج/الأثر — Return / effect:** نتائج listeners أو null حسب dispatch؛ لا يثبت WebSocket في المتصفح.

- **أول موضع هنا:** السطر 23.

### ->json

- **جاية منين؟** Laravel Response factory

- **وظيفتها:** تجهّز HTTP response من بيانات JSON.

- **المدخلات — Arguments:** data وstatus وheaders.

- **الناتج/الأثر — Return / effect:** JsonResponse، مش object JavaScript مشترك بين PHP والمتصفح.

- **أول موضع هنا:** السطر 25.

### response

- **جاية منين؟** Laravel helper

- **وظيفتها:** جهّز HTTP response. بدون arguments هات factory نكمل عليها json أو view أو streamDownload.

- **المدخلات — Arguments:** بدون arguments للـ factory؛ أو content ثم status ثم headers لإنشاء response مباشرة.

- **الناتج/الأثر — Return / effect:** ResponseFactory بدون arguments، أو HTTP Response عند تمرير content؛ مش إرسال شبكة من browser.

- **أول موضع هنا:** السطر 25.

- **مثال:** return response()->json(['message' => 'Saved'], 201);

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

namespace App\Http\Controllers\Api;

use App\Events\OrderPlaced;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Models\Order;
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** namespace بتحدد نطاق أسماء الكلاس `App\Http\Controllers\Api`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 5:** use / استيراد الاسم `App\Events\OrderPlaced` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** use / استيراد الاسم `App\Http\Controllers\Controller` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 7:** use / استيراد الاسم `App\Http\Requests\StoreOrderRequest` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 8:** use / استيراد الاسم `App\Models\Order` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php
use App\Services\Orders\OrderCreator;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function store(StoreOrderRequest $request, OrderCreator $creator): JsonResponse
    {
```

**السطر 9:** use / استيراد الاسم `App\Services\Orders\OrderCreator` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 10:** use / استيراد الاسم `Illuminate\Http\JsonResponse` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 11:** use / استيراد الاسم `Illuminate\Validation\ValidationException` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 13:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

**السطر 14:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 15:** Function / تعريف دالة `store`؛ تعريفها مش تشغيلها. خد البيانات اللي عدّت StoreOrderRequest، ارفض card، أنشئ طلب new وارجع لينك التتبع. مدخلاتها: StoreOrderRequest وOrderCreator يحقنهم Laravel. ناتجها: JSON order وtracking_token وtracking_url، status 201.

**السطر 16:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

### السطور 17–24

```php
        $data = $request->validated();
        if ($data['payment_method'] === 'card') {
            throw ValidationException::withMessages(['payment_method' => ['Card orders must use the payment intent endpoint.']]);
        }

        $order = $creator->create($data, $request->user(), Order::STATUS_NEW);
        OrderPlaced::dispatch($order);

```

**السطر 17:** Assignment / إسناد: احسب `$request->validated()` الأول وخزّن النتيجة في `$data`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 18:** if تختبر الشرط `$data['payment_method'] === 'card'`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 19:** throw ترمي الاستثناء `ValidationException::withMessages(['payment_method' => ['Card orders must use the payment intent endpoint.']]);` وتوقف المسار العادي. Laravel exception handler أو catch المناسبة تتعامل معاه؛ مش مجرد رسالة بتنطبع وتكمّل التنفيذ.

**السطر 20:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 22:** Assignment / إسناد: احسب `$creator->create($data, $request->user(), Order::STATUS_NEW)` الأول وخزّن النتيجة في `$order`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 23:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `OrderPlaced::dispatch(...)`: تطلق event مع بياناته. مدخلاتها: arguments الحدث. العائد/الأثر: نتائج listeners أو null حسب dispatch؛ لا يثبت WebSocket في المتصفح.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 25–32

```php
        return response()->json([
            'message' => 'Order created successfully.',
            'order' => $order,
            'tracking_token' => $order->tracking_token,
            'tracking_url' => "/orders/{$order->tracking_token}",
        ], 201);
    }
}
```

**السطر 25:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 26:** PHP array entry: المفتاح `message` مرتبط بالقيمة `'Order created successfully.'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 27:** PHP array entry: المفتاح `order` مرتبط بالقيمة `$order`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 28:** PHP array entry: المفتاح `tracking_token` مرتبط بالقيمة `$order->tracking_token`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 29:** PHP array entry: المفتاح `tracking_url` مرتبط بالقيمة `"/orders/{$order->tracking_token}"`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 30:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 31:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 32:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
