# قواعد إنشاء وتعديل حساب موظف

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `app/Http/Requests/AdminStaffRequest.php` · 25 سطر.

**وظيفة الملف:** الrole فقط staff/admin. الموظف محتاج فرع؛ الباسورد مطلوبة للإنشاء واختيارية للتعديل. uniqueness الإيميل تستثني المستخدم الحالي وقت التعديل.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../app/Http/Requests/AdminStaffRequest.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Http/Controllers/Api/AdminController.php](../Controllers/Api/AdminController.php.md)

- [pizza-crm/app/Models/User.php](../../Models/User.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class AdminStaffRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->isAdmin() === true; }
    public function rules(): array
    {
        $user = $this->route('user');
        return [
            'name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:160', Rule::unique('users')->ignore($user)],
            'role' => ['required', Rule::in(['staff', 'admin'])],
            'branch_id' => ['nullable', 'required_if:role,staff', 'exists:branches,id'],
            'is_active' => ['required', 'boolean'],
            'password' => [$user ? 'nullable' : 'required', 'confirmed', Password::min(8)],
        ];
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### authorize

الإدمن فقط يدير حسابات الموظفين.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** bool.

### rules

هات user من route لتحديد required password واستثناء unique email، ثم ارجع قواعد الحساب والدور والفرع.

- **بتاخد إيه؟ Inputs:** route user ممكن null في الإنشاء.

- **بترجع/بتغيّر إيه؟ Return / effect:** array.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### $this->user

- **جاية منين؟** Laravel Request

- **وظيفتها:** تقرأ المستخدم المثبت للطلب الحالي.

- **المدخلات — Arguments:** guard اختياري.

- **الناتج/الأثر — Return / effect:** User أو null؛ مش user أرسله العميل في body.

- **أول موضع هنا:** السطر 11.

### ->isAdmin

- **جاية منين؟** دالة مخصّصة معرّفة في المشروع

- **وظيفتها:** هل role بالضبط admin؟

- **المدخلات — Arguments:** role الحالية.

- **الناتج/الأثر — Return / effect:** bool.

- **أول موضع هنا:** السطر 11.

- **تكملة التعريف:** [app/Models/User.php](../../Models/User.php.md)، عند السطر 56.

### $this->route

- **جاية منين؟** Laravel FormRequest / Request

- **وظيفتها:** اقرأ parameter من URL بعد route binding؛ هنا User أو Category Model لتحديد التعديل واستثناء unique.

- **المدخلات — Arguments:** اسم route parameter string، ثم default اختيارية.

- **الناتج/الأثر — Return / effect:** قيمة parameter مثل User أو Category أو null عند غيابها؛ بدون اسم ترجع Route object.

- **أول موضع هنا:** السطر 14.

- **مثال:** $this->route('user')

### Rule::unique

- **جاية منين؟** Laravel Validation Rule

- **وظيفتها:** ابنِ قاعدة تمنع وجود نفس القيمة في جدول أو عمود أثناء validation؛ مختلفة عن unique index داخل schema، والأفضل وجود قيد DB كمان.

- **المدخلات — Arguments:** اسم الجدول string ثم column اختيارية؛ تُستنتج column من field لو لم تحدد.

- **الناتج/الأثر — Return / effect:** Illuminate Validation Rules Unique object قابلة لـ ignore، والتحقق لا يعمل إلا عند تشغيل validator.

- **أول موضع هنا:** السطر 17.

- **مثال:** Rule::unique('users')->ignore($user)

### ->ignore

- **جاية منين؟** Laravel unique rule

- **وظيفتها:** تستثني سجلًا محددًا من تحقق uniqueness.

- **المدخلات — Arguments:** id/model وcolumn اختيارية.

- **الناتج/الأثر — Return / effect:** rule object؛ لا تمرّر user-controlled id بدون تحقق.

- **أول موضع هنا:** السطر 17.

### Rule::in

- **جاية منين؟** Laravel Validation Rule

- **وظيفتها:** ابنِ قاعدة تقبل قيمة الحقل لو ضمن القائمة المحددة؛ لا تختار عنصرًا ولا تحوّله إلى array.

- **المدخلات — Arguments:** array قيم مسموحة أو قيم منفصلة؛ هنا array مثل ['cash','card'].

- **الناتج/الأثر — Return / effect:** Illuminate Validation Rules In object تفسرها validation.

- **أول موضع هنا:** السطر 18.

- **مثال:** Rule::in(['cash', 'card'])

### Password::min

- **جاية منين؟** Laravel Validation Password Rule

- **وظيفتها:** كوّن قاعدة password بطول أدنى؛ min(8) لا تعني فحص كل سياسات الأمان ولا hashing.

- **المدخلات — Arguments:** عدد أحرف أدنى integer، هنا 8.

- **الناتج/الأثر — Return / effect:** Password rule object يمكن إضافة mixedCase/numbers/symbols لها، لكن مش كلها مستخدمة هنا.

- **أول موضع هنا:** السطر 21.

- **مثال:** Password::min(8)

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** namespace بتحدد نطاق أسماء الكلاس `App\Http\Requests`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 5:** use / استيراد الاسم `Illuminate\Foundation\Http\FormRequest` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** use / استيراد الاسم `Illuminate\Validation\Rule` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 7:** use / استيراد الاسم `Illuminate\Validation\Rules\Password` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php
class AdminStaffRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->isAdmin() === true; }
    public function rules(): array
    {
        $user = $this->route('user');
        return [
            'name' => ['required', 'string', 'max:100'],
```

**السطر 9:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

**السطر 10:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 11:** Function / تعريف دالة `authorize`؛ تعريفها مش تشغيلها. الإدمن فقط يدير حسابات الموظفين. مدخلاتها: لا شيء. ناتجها: bool. الدوال الموجودة في السطر: `$this->user(...)`: تقرأ المستخدم المثبت للطلب الحالي. مدخلاتها: guard اختياري. العائد/الأثر: User أو null؛ مش user أرسله العميل في body.؛ `->isAdmin(...)`: هل role بالضبط admin؟ مدخلاتها: role الحالية. العائد/الأثر: bool.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 12:** Function / تعريف دالة `rules`؛ تعريفها مش تشغيلها. هات user من route لتحديد required password واستثناء unique email، ثم ارجع قواعد الحساب والدور والفرع. مدخلاتها: route user ممكن null في الإنشاء. ناتجها: array.

**السطر 13:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 14:** Assignment / إسناد: احسب `$this->route('user')` الأول وخزّن النتيجة في `$user`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 15:** return تعيد array القيم التالية. في ملف config دي إعدادات يستلمها Laravel وقت تحميل الإعداد؛ في method فهي ناتج يرجع للكود اللي ناداها. مش JSON response إلا لو بنينا response صراحة.

**السطر 16:** قواعد حقل `name` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `string` = نص؛ `max:100` = أقصى قيمة/طول `100` حسب النوع؛ حجم الملفات بالكيلوبايت. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

### السطور 17–24

```php
            'email' => ['required', 'email', 'max:160', Rule::unique('users')->ignore($user)],
            'role' => ['required', Rule::in(['staff', 'admin'])],
            'branch_id' => ['nullable', 'required_if:role,staff', 'exists:branches,id'],
            'is_active' => ['required', 'boolean'],
            'password' => [$user ? 'nullable' : 'required', 'confirmed', Password::min(8)],
        ];
    }
}
```

**السطر 17:** قواعد حقل `email` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `email` = صيغة بريد إلكتروني؛ `max:160` = أقصى قيمة/طول `160` حسب النوع؛ حجم الملفات بالكيلوبايت؛ `users` قاعدة إضافية يفسّرها Laravel. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 18:** قواعد حقل `role` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `staff` قاعدة إضافية يفسّرها Laravel؛ `admin` قاعدة إضافية يفسّرها Laravel. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 19:** قواعد حقل `branch_id` داخل array التحقق: `nullable` = مسموح تكون قيمته null؛ `required_if:role,staff` قاعدة إضافية يفسّرها Laravel؛ `exists:branches,id` = القيمة لازم تكون موجودة في الجدول والعمود المحددين. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 20:** قواعد حقل `is_active` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `boolean` = قيمة boolean مقبولة من Laravel. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 21:** قواعد حقل `password` داخل array التحقق: `nullable` = مسموح تكون قيمته null؛ `required` = لازم يتبعت ومينفعش يكون فاضي؛ `confirmed` = لازم يطابق حقل التأكيد اللي اسمه منتهي بـ_confirmation. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 22:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 23:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 24:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
