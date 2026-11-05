# قواعد انتقال حالة الطلب

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `app/Http/Requests/UpdateOrderStatusRequest.php` · 25 سطر.

**وظيفة الملف:** يتأكد إن status/expected_status أسماء ضمن القائمة، ويطلب reason للإلغاء والرفض. صحة الانتقال من الحالة القديمة للجديدة مش هنا؛ داخل StaffOrderController بعد قفل الصف.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../app/Http/Requests/UpdateOrderStatusRequest.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Models/Order.php](../../Models/Order.php.md)

- [pizza-crm/app/Http/Middleware/RequireRole.php](../Middleware/RequireRole.php.md)

- [pizza-crm/app/Http/Controllers/Api/StaffOrderController.php](../Controllers/Api/StaffOrderController.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

namespace App\Http\Requests;

use App\Models\Order;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrderStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::in(Order::STAFF_STATUSES)],
            'expected_status' => ['nullable', Rule::in(Order::STAFF_STATUSES)],
            'reason' => ['nullable', 'required_if:status,cancelled,rejected', 'string', 'max:500'],
        ];
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### authorize

يرجع true؛ صلاحية staff/admin من middleware والفرع داخل controller.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** bool true.

### rules

قواعد status وexpected_status الاختيارية وreason عند cancelled/rejected.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** array قواعد.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### Rule::in

- **جاية منين؟** Laravel Validation Rule

- **وظيفتها:** ابنِ قاعدة تقبل قيمة الحقل لو ضمن القائمة المحددة؛ لا تختار عنصرًا ولا تحوّله إلى array.

- **المدخلات — Arguments:** array قيم مسموحة أو قيم منفصلة؛ هنا array مثل ['cash','card'].

- **الناتج/الأثر — Return / effect:** Illuminate Validation Rules In object تفسرها validation.

- **أول موضع هنا:** السطر 20.

- **مثال:** Rule::in(['cash', 'card'])

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

namespace App\Http\Requests;

use App\Models\Order;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** namespace بتحدد نطاق أسماء الكلاس `App\Http\Requests`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 5:** use / استيراد الاسم `App\Models\Order` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** use / استيراد الاسم `Illuminate\Foundation\Http\FormRequest` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 7:** use / استيراد الاسم `Illuminate\Validation\Rule` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php
class UpdateOrderStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
```

**السطر 9:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

**السطر 10:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 11:** Function / تعريف دالة `authorize`؛ تعريفها مش تشغيلها. يرجع true؛ صلاحية staff/admin من middleware والفرع داخل controller. مدخلاتها: لا شيء. ناتجها: bool true.

**السطر 12:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 13:** return تعيد التعبير `true` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 14:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 16:** Function / تعريف دالة `rules`؛ تعريفها مش تشغيلها. قواعد status وexpected_status الاختيارية وreason عند cancelled/rejected. مدخلاتها: لا شيء. ناتجها: array قواعد.

### السطور 17–24

```php
    {
        return [
            'status' => ['required', Rule::in(Order::STAFF_STATUSES)],
            'expected_status' => ['nullable', Rule::in(Order::STAFF_STATUSES)],
            'reason' => ['nullable', 'required_if:status,cancelled,rejected', 'string', 'max:500'],
        ];
    }
}
```

**السطر 17:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 18:** return تعيد array القيم التالية. في ملف config دي إعدادات يستلمها Laravel وقت تحميل الإعداد؛ في method فهي ناتج يرجع للكود اللي ناداها. مش JSON response إلا لو بنينا response صراحة.

**السطر 19:** قواعد حقل `status` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 20:** قواعد حقل `expected_status` داخل array التحقق: `nullable` = مسموح تكون قيمته null. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 21:** قواعد حقل `reason` داخل array التحقق: `nullable` = مسموح تكون قيمته null؛ `required_if:status,cancelled,rejected` قاعدة إضافية يفسّرها Laravel؛ `string` = نص؛ `max:500` = أقصى قيمة/طول `500` حسب النوع؛ حجم الملفات بالكيلوبايت. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 22:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 23:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 24:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
