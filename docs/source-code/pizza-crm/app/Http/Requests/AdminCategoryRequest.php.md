# قواعد قسم المنيو وslug فريد

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `app/Http/Requests/AdminCategoryRequest.php` · 21 سطر.

**وظيفة الملف:** الslug لازم unique؛ عند تعديل category بنستثني نفس السجل من فحص uniqueness بدل ما نرفض اسمه الحالي.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../app/Http/Requests/AdminCategoryRequest.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Models/Category.php](../../Models/Category.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminCategoryRequest extends FormRequest
{
    public function authorize(): bool { return $this->user()?->isAdmin() === true; }
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'slug' => ['required', 'string', 'max:100', Rule::unique('categories')->ignore($this->route('category'))],
            'display_order' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### authorize

اسمح للإدمن فقط.

- **بتاخد إيه؟ Inputs:** user session.

- **بترجع/بتغيّر إيه؟ Return / effect:** bool.

### rules

راجع name/slug/display_order/is_active مع Rule::unique(...)->ignore(route category).

- **بتاخد إيه؟ Inputs:** category من route model binding إن كان تحديثًا.

- **بترجع/بتغيّر إيه؟ Return / effect:** array قواعد.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### $this->user

- **جاية منين؟** Laravel Request

- **وظيفتها:** تقرأ المستخدم المثبت للطلب الحالي.

- **المدخلات — Arguments:** guard اختياري.

- **الناتج/الأثر — Return / effect:** User أو null؛ مش user أرسله العميل في body.

- **أول موضع هنا:** السطر 10.

### ->isAdmin

- **جاية منين؟** دالة مخصّصة معرّفة في المشروع

- **وظيفتها:** هل role بالضبط admin؟

- **المدخلات — Arguments:** role الحالية.

- **الناتج/الأثر — Return / effect:** bool.

- **أول موضع هنا:** السطر 10.

- **تكملة التعريف:** [app/Models/User.php](../../Models/User.php.md)، عند السطر 56.

### Rule::unique

- **جاية منين؟** Laravel Validation Rule

- **وظيفتها:** ابنِ قاعدة تمنع وجود نفس القيمة في جدول أو عمود أثناء validation؛ مختلفة عن unique index داخل schema، والأفضل وجود قيد DB كمان.

- **المدخلات — Arguments:** اسم الجدول string ثم column اختيارية؛ تُستنتج column من field لو لم تحدد.

- **الناتج/الأثر — Return / effect:** Illuminate Validation Rules Unique object قابلة لـ ignore، والتحقق لا يعمل إلا عند تشغيل validator.

- **أول موضع هنا:** السطر 15.

- **مثال:** Rule::unique('users')->ignore($user)

### ->ignore

- **جاية منين؟** Laravel unique rule

- **وظيفتها:** تستثني سجلًا محددًا من تحقق uniqueness.

- **المدخلات — Arguments:** id/model وcolumn اختيارية.

- **الناتج/الأثر — Return / effect:** rule object؛ لا تمرّر user-controlled id بدون تحقق.

- **أول موضع هنا:** السطر 15.

### $this->route

- **جاية منين؟** Laravel FormRequest / Request

- **وظيفتها:** اقرأ parameter من URL بعد route binding؛ هنا User أو Category Model لتحديد التعديل واستثناء unique.

- **المدخلات — Arguments:** اسم route parameter string، ثم default اختيارية.

- **الناتج/الأثر — Return / effect:** قيمة parameter مثل User أو Category أو null عند غيابها؛ بدون اسم ترجع Route object.

- **أول موضع هنا:** السطر 15.

- **مثال:** $this->route('user')

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AdminCategoryRequest extends FormRequest
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** namespace بتحدد نطاق أسماء الكلاس `App\Http\Requests`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 5:** use / استيراد الاسم `Illuminate\Foundation\Http\FormRequest` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** use / استيراد الاسم `Illuminate\Validation\Rule` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 8:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

### السطور 9–16

```php
{
    public function authorize(): bool { return $this->user()?->isAdmin() === true; }
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'slug' => ['required', 'string', 'max:100', Rule::unique('categories')->ignore($this->route('category'))],
            'display_order' => ['required', 'integer', 'min:0'],
```

**السطر 9:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 10:** Function / تعريف دالة `authorize`؛ تعريفها مش تشغيلها. اسمح للإدمن فقط. مدخلاتها: user session. ناتجها: bool. الدوال الموجودة في السطر: `$this->user(...)`: تقرأ المستخدم المثبت للطلب الحالي. مدخلاتها: guard اختياري. العائد/الأثر: User أو null؛ مش user أرسله العميل في body.؛ `->isAdmin(...)`: هل role بالضبط admin؟ مدخلاتها: role الحالية. العائد/الأثر: bool.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 11:** Function / تعريف دالة `rules`؛ تعريفها مش تشغيلها. راجع name/slug/display_order/is_active مع Rule::unique(...)->ignore(route category). مدخلاتها: category من route model binding إن كان تحديثًا. ناتجها: array قواعد.

**السطر 12:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 13:** return تعيد array القيم التالية. في ملف config دي إعدادات يستلمها Laravel وقت تحميل الإعداد؛ في method فهي ناتج يرجع للكود اللي ناداها. مش JSON response إلا لو بنينا response صراحة.

**السطر 14:** قواعد حقل `name` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `string` = نص؛ `max:100` = أقصى قيمة/طول `100` حسب النوع؛ حجم الملفات بالكيلوبايت. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 15:** قواعد حقل `slug` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `string` = نص؛ `max:100` = أقصى قيمة/طول `100` حسب النوع؛ حجم الملفات بالكيلوبايت؛ `categories` قاعدة إضافية يفسّرها Laravel؛ `category` قاعدة إضافية يفسّرها Laravel. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 16:** قواعد حقل `display_order` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `integer` = عدد صحيح؛ `min:0` = أقل قيمة/طول `0` حسب نوع الحقل. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

### السطور 17–21

```php
            'is_active' => ['required', 'boolean'],
        ];
    }
}

```

**السطر 17:** قواعد حقل `is_active` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `boolean` = قيمة boolean مقبولة من Laravel. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 18:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 19:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 20:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
