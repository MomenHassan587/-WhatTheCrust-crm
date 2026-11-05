# التحقق من فورم المنتج والصورة وأسعار الفروع

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `app/Http/Requests/AdminProductRequest.php` · 35 سطر.

**وظيفة الملف:** الواجهة تبعت multipart/FormData: الصورة ملف، وbranch_options نص JSON؛ لذلك نفك النص قبل validation. يراجع image MIME/8MB والاسم والوصف والفرع والسعر والإتاحة.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../app/Http/Requests/AdminProductRequest.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Models/User.php](../../Models/User.php.md)

- [pizza-crm/resources/js/Pages/Admin/AdminPanel.jsx](../../../resources/js/Pages/Admin/AdminPanel.jsx.md)

- [pizza-crm/app/Http/Controllers/Api/AdminController.php](../Controllers/Api/AdminController.php.md)

- [pizza-crm/app/Services/ProductImageService.php](../../Services/ProductImageService.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminProductRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->isAdmin() === true; }

    protected function prepareForValidation(): void
    {
        if (is_string($this->branch_options)) {
            $this->merge(['branch_options' => json_decode($this->branch_options, true)]);
        }
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:160'],
            'description' => ['required', 'string', 'max:1000'],
            'tag' => ['nullable', 'string', 'max:60'],
            'display_order' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:8192'],
            'branch_options' => ['required', 'array', 'min:1'],
            'branch_options.*.branch_id' => ['required', 'integer', 'exists:branches,id'],
            'branch_options.*.price' => ['required', 'numeric', 'min:0', 'max:99999'],
            'branch_options.*.is_available' => ['required', 'boolean'],
        ];
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### authorize

اسمح للمستخدم admin فقط.

- **بتاخد إيه؟ Inputs:** user الحالية من request.

- **بترجع/بتغيّر إيه؟ Return / effect:** bool؛ false تسبب 403.

### prepareForValidation

لو branch_options جاية string فكّها بـ json_decode(...,true) وحط array بدل النص.

- **بتاخد إيه؟ Inputs:** request.branch_options.

- **بترجع/بتغيّر إيه؟ Return / effect:** void؛ لو JSON غير صالح ينتج null ويترفض بواسطة rules.

### rules

حدد قواعد المنتج والصورة وحقل branch_options وكل صف داخله باستخدام wildcard *.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** array قواعد؛ لا تعني حفظ الملفات أو كتابة DB تلقائيًا.

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

### is_string

- **جاية منين؟** PHP built-in

- **وظيفتها:** اختبر هل القيمة نوعها string قبل json_decode؛ لا تتحقق من صلاحية النص كـ JSON.

- **المدخلات — Arguments:** قيمة واحدة من أي نوع.

- **الناتج/الأثر — Return / effect:** bool.

- **أول موضع هنا:** السطر 13.

- **مثال:** is_string($this->branch_options)

### $this->merge

- **جاية منين؟** Laravel FormRequest / Request

- **وظيفتها:** ادمج قيمًا جديدة داخل input request قبل validation؛ متغيّرش DB ولا ترسل طلب شبكة جديد.

- **المدخلات — Arguments:** array من field إلى value.

- **الناتج/الأثر — Return / effect:** نفس request object في Laravel المثبت؛ الكود يعتمد على الأثر ولا يستخدم return.

- **أول موضع هنا:** السطر 14.

- **مثال:** $this->merge(['payment_method' => 'cash']);

### json_decode

- **جاية منين؟** PHP built-in

- **وظيفتها:** حوّل JSON string إلى PHP value؛ true كمعامل تاني يجعل objects associative arrays.

- **المدخلات — Arguments:** string JSON وassociative flag.

- **الناتج/الأثر — Return / effect:** mixed؛ null ممكن تعني JSON null أو فشل parsing بدون JSON_THROW_ON_ERROR.

- **أول موضع هنا:** السطر 14.

- **مثال:** json_decode($this->branch_options, true)

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AdminProductRequest extends FormRequest
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

    protected function prepareForValidation(): void
    {
        if (is_string($this->branch_options)) {
            $this->merge(['branch_options' => json_decode($this->branch_options, true)]);
        }
    }
```

**السطر 9:** Function / تعريف دالة `authorize`؛ تعريفها مش تشغيلها. اسمح للمستخدم admin فقط. مدخلاتها: user الحالية من request. ناتجها: bool؛ false تسبب 403. الدوال الموجودة في السطر: `$this->user(...)`: تقرأ المستخدم المثبت للطلب الحالي. مدخلاتها: guard اختياري. العائد/الأثر: User أو null؛ مش user أرسله العميل في body.؛ `->isAdmin(...)`: هل role بالضبط admin؟ مدخلاتها: role الحالية. العائد/الأثر: bool.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 11:** Function / تعريف دالة `prepareForValidation`؛ تعريفها مش تشغيلها. لو branch_options جاية string فكّها بـ json_decode(...,true) وحط array بدل النص. مدخلاتها: request.branch_options. ناتجها: void؛ لو JSON غير صالح ينتج null ويترفض بواسطة rules.

**السطر 12:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 13:** if تختبر الشرط `is_string($this->branch_options)`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 14:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->merge(...)`: ادمج قيمًا جديدة داخل input request قبل validation؛ متغيّرش DB ولا ترسل طلب شبكة جديد. مدخلاتها: array من field إلى value. العائد/الأثر: نفس request object في Laravel المثبت؛ الكود يعتمد على الأثر ولا يستخدم return.؛ `json_decode(...)`: حوّل JSON string إلى PHP value؛ true كمعامل تاني يجعل objects associative arrays. مدخلاتها: string JSON وassociative flag. العائد/الأثر: mixed؛ null ممكن تعني JSON null أو فشل parsing بدون JSON_THROW_ON_ERROR.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 15:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 16:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 17–24

```php

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:160'],
            'description' => ['required', 'string', 'max:1000'],
            'tag' => ['nullable', 'string', 'max:60'],
```

**السطر 18:** Function / تعريف دالة `rules`؛ تعريفها مش تشغيلها. حدد قواعد المنتج والصورة وحقل branch_options وكل صف داخله باستخدام wildcard *. مدخلاتها: لا شيء. ناتجها: array قواعد؛ لا تعني حفظ الملفات أو كتابة DB تلقائيًا.

**السطر 19:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 20:** return تعيد array القيم التالية. في ملف config دي إعدادات يستلمها Laravel وقت تحميل الإعداد؛ في method فهي ناتج يرجع للكود اللي ناداها. مش JSON response إلا لو بنينا response صراحة.

**السطر 21:** قواعد حقل `category_id` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `integer` = عدد صحيح؛ `exists:categories,id` = القيمة لازم تكون موجودة في الجدول والعمود المحددين. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 22:** قواعد حقل `name` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `string` = نص؛ `max:160` = أقصى قيمة/طول `160` حسب النوع؛ حجم الملفات بالكيلوبايت. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 23:** قواعد حقل `description` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `string` = نص؛ `max:1000` = أقصى قيمة/طول `1000` حسب النوع؛ حجم الملفات بالكيلوبايت. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 24:** قواعد حقل `tag` داخل array التحقق: `nullable` = مسموح تكون قيمته null؛ `string` = نص؛ `max:60` = أقصى قيمة/طول `60` حسب النوع؛ حجم الملفات بالكيلوبايت. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

### السطور 25–32

```php
            'display_order' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:8192'],
            'branch_options' => ['required', 'array', 'min:1'],
            'branch_options.*.branch_id' => ['required', 'integer', 'exists:branches,id'],
            'branch_options.*.price' => ['required', 'numeric', 'min:0', 'max:99999'],
            'branch_options.*.is_available' => ['required', 'boolean'],
        ];
```

**السطر 25:** قواعد حقل `display_order` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `integer` = عدد صحيح؛ `min:0` = أقل قيمة/طول `0` حسب نوع الحقل. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 26:** قواعد حقل `is_active` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `boolean` = قيمة boolean مقبولة من Laravel. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 27:** قواعد حقل `image` داخل array التحقق: `nullable` = مسموح تكون قيمته null؛ `image` = ملف صورة من الأنواع المقبولة؛ `mimes:jpeg,png,webp` = أنواع ملفات مسموحة، مش مجرد ثقة في اسم الملف؛ `max:8192` = أقصى قيمة/طول `8192` حسب النوع؛ حجم الملفات بالكيلوبايت. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 28:** قواعد حقل `branch_options` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `array` = قائمة/array؛ `min:1` = أقل قيمة/طول `1` حسب نوع الحقل. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 29:** قواعد حقل `branch_options.*.branch_id` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `integer` = عدد صحيح؛ `exists:branches,id` = القيمة لازم تكون موجودة في الجدول والعمود المحددين. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 30:** قواعد حقل `branch_options.*.price` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `numeric` = قيمة رقمية؛ `min:0` = أقل قيمة/طول `0` حسب نوع الحقل؛ `max:99999` = أقصى قيمة/طول `99999` حسب النوع؛ حجم الملفات بالكيلوبايت. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 31:** قواعد حقل `branch_options.*.is_available` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `boolean` = قيمة boolean مقبولة من Laravel. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 32:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 33–35

```php
    }
}

```

**السطر 33:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 34:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
