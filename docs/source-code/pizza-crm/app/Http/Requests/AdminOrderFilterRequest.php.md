# مراجعة فلاتر بحث الإدارة

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `app/Http/Requests/AdminOrderFilterRequest.php` · 20 سطر.

**وظيفة الملف:** يحمي endpoint البحث من قيم بأنواع/أطوال غير متوقعة ويشترط branch_id موجودة؛ status/payment_status هنا string max40 مش Rule::in كاملة.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../app/Http/Requests/AdminOrderFilterRequest.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Http/Controllers/Api/AdminController.php](../Controllers/Api/AdminController.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminOrderFilterRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->isAdmin() === true; }
    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:100'],
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'status' => ['nullable', 'string', 'max:40'],
            'payment_status' => ['nullable', 'string', 'max:40'],
        ];
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### authorize

اقبل admin فقط.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** bool.

### rules

search اختياري max100، branch_id اختياري موجود، وstatus/payment_status نصوص اختيارية.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** array قواعد.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### $this->user

- **جاية منين؟** Laravel Request

- **وظيفتها:** تقرأ المستخدم المثبت للطلب الحالي.

- **المدخلات — Arguments:** guard اختياري.

- **الناتج/الأثر — Return / effect:** User أو null؛ مش user أرسله العميل في body.

- **أول موضع هنا:** السطر 9.

### ->isAdmin

- **جاية منين؟** دالة مخصّصة معرّفة في المشروع

- **وظيفتها:** هل role بالضبط admin؟

- **المدخلات — Arguments:** role الحالية.

- **الناتج/الأثر — Return / effect:** bool.

- **أول موضع هنا:** السطر 9.

- **تكملة التعريف:** [app/Models/User.php](../../Models/User.php.md)، عند السطر 56.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminOrderFilterRequest extends FormRequest
{
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** namespace بتحدد نطاق أسماء الكلاس `App\Http\Requests`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 5:** use / استيراد الاسم `Illuminate\Foundation\Http\FormRequest` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 7:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

**السطر 8:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

### السطور 9–16

```php
    public function authorize(): bool { return $this->user()?->isAdmin() === true; }
    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:100'],
            'branch_id' => ['nullable', 'integer', 'exists:branches,id'],
            'status' => ['nullable', 'string', 'max:40'],
            'payment_status' => ['nullable', 'string', 'max:40'],
```

**السطر 9:** Function / تعريف دالة `authorize`؛ تعريفها مش تشغيلها. اقبل admin فقط. مدخلاتها: لا شيء. ناتجها: bool. الدوال الموجودة في السطر: `$this->user(...)`: تقرأ المستخدم المثبت للطلب الحالي. مدخلاتها: guard اختياري. العائد/الأثر: User أو null؛ مش user أرسله العميل في body.؛ `->isAdmin(...)`: هل role بالضبط admin؟ مدخلاتها: role الحالية. العائد/الأثر: bool.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 10:** Function / تعريف دالة `rules`؛ تعريفها مش تشغيلها. search اختياري max100، branch_id اختياري موجود، وstatus/payment_status نصوص اختيارية. مدخلاتها: لا شيء. ناتجها: array قواعد.

**السطر 11:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 12:** return تعيد array القيم التالية. في ملف config دي إعدادات يستلمها Laravel وقت تحميل الإعداد؛ في method فهي ناتج يرجع للكود اللي ناداها. مش JSON response إلا لو بنينا response صراحة.

**السطر 13:** قواعد حقل `search` داخل array التحقق: `nullable` = مسموح تكون قيمته null؛ `string` = نص؛ `max:100` = أقصى قيمة/طول `100` حسب النوع؛ حجم الملفات بالكيلوبايت. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 14:** قواعد حقل `branch_id` داخل array التحقق: `nullable` = مسموح تكون قيمته null؛ `integer` = عدد صحيح؛ `exists:branches,id` = القيمة لازم تكون موجودة في الجدول والعمود المحددين. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 15:** قواعد حقل `status` داخل array التحقق: `nullable` = مسموح تكون قيمته null؛ `string` = نص؛ `max:40` = أقصى قيمة/طول `40` حسب النوع؛ حجم الملفات بالكيلوبايت. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 16:** قواعد حقل `payment_status` داخل array التحقق: `nullable` = مسموح تكون قيمته null؛ `string` = نص؛ `max:40` = أقصى قيمة/طول `40` حسب النوع؛ حجم الملفات بالكيلوبايت. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

### السطور 17–20

```php
        ];
    }
}

```

**السطر 17:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 18:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 19:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
