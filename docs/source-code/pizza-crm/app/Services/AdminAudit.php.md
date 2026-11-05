# تسجيل مين عمل تعديل إداري

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `app/Services/AdminAudit.php` · 23 سطر.

**وظيفة الملف:** service واحدة بتكتب admin_audit_logs لكل إجراء. subject ممكن Model موجود له id أو string اسم class لإجراء عام زي settings؛ details metadata مش مكان لحفظ passwords.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../app/Services/AdminAudit.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Models/AdminAuditLog.php](../Models/AdminAuditLog.php.md)

- [pizza-crm/app/Models/User.php](../Models/User.php.md)

- [pizza-crm/app/Http/Controllers/Api/AdminController.php](../Http/Controllers/Api/AdminController.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

namespace App\Services;

use App\Models\AdminAuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class AdminAudit
{
    public function record(User $user, string $action, Model|string $subject, array $details = []): void
    {
        AdminAuditLog::create([
            'user_id' => $user->id,
            'action' => $action,
            'subject_type' => $subject instanceof Model ? $subject::class : $subject,
            'subject_id' => $subject instanceof Model ? $subject->getKey() : null,
            'details' => $details,
            'created_at' => now(),
        ]);
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### record

احفظ user/action ونوع وid العنصر وتفاصيل ووقت العملية.

- **بتاخد إيه؟ Inputs:** User $user وstring $action وModel|string $subject وarray $details افتراضي [].

- **بترجع/بتغيّر إيه؟ Return / effect:** void؛ الأثر row جديدة في AdminAuditLog.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### AdminAuditLog::create

- **جاية منين؟** Eloquent/Relation

- **وظيفتها:** تنشئ صفًا ببيانات ملء مسموحة.

- **المدخلات — Arguments:** attributes array.

- **الناتج/الأثر — Return / effect:** model المحفوظ؛ ليست validation أو authorization تلقائية.

- **أول موضع هنا:** السطر 13.

### $subject->getKey

- **جاية منين؟** Eloquent Model

- **وظيفتها:** تقرأ قيمة primary key.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** قيمة id وفق key type.

- **أول موضع هنا:** السطر 17.

### now

- **جاية منين؟** Laravel Date helper / Carbon

- **وظيفتها:** أنشئ object يمثل الوقت الحالي بتوقيت التطبيق أو المنطقة المطلوبة؛ ليست JS Date.now التي ترجع milliseconds.

- **المدخلات — Arguments:** timezone اختيارية؛ المشروع غالبًا بدون arguments.

- **الناتج/الأثر — Return / effect:** Carbon date-time object يمكن تنسيقها أو إضافة دقائق لها؛ ليست string تلقائيًا.

- **أول موضع هنا:** السطر 19.

- **مثال:** now()->addMinutes(20)

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

namespace App\Services;

use App\Models\AdminAuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** namespace بتحدد نطاق أسماء الكلاس `App\Services`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 5:** use / استيراد الاسم `App\Models\AdminAuditLog` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** use / استيراد الاسم `App\Models\User` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 7:** use / استيراد الاسم `Illuminate\Database\Eloquent\Model` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php
class AdminAudit
{
    public function record(User $user, string $action, Model|string $subject, array $details = []): void
    {
        AdminAuditLog::create([
            'user_id' => $user->id,
            'action' => $action,
            'subject_type' => $subject instanceof Model ? $subject::class : $subject,
```

**السطر 9:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

**السطر 10:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 11:** Function / تعريف دالة `record`؛ تعريفها مش تشغيلها. احفظ user/action ونوع وid العنصر وتفاصيل ووقت العملية. مدخلاتها: User $user وstring $action وModel|string $subject وarray $details افتراضي []. ناتجها: void؛ الأثر row جديدة في AdminAuditLog.

**السطر 12:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 13:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `AdminAuditLog::create(...)`: تنشئ صفًا ببيانات ملء مسموحة. مدخلاتها: attributes array. العائد/الأثر: model المحفوظ؛ ليست validation أو authorization تلقائية.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 14:** PHP array entry: المفتاح `user_id` مرتبط بالقيمة `$user->id`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 15:** PHP array entry: المفتاح `action` مرتبط بالقيمة `$action`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 16:** PHP array entry: المفتاح `subject_type` مرتبط بالقيمة `$subject instanceof Model ? $subject::class : $subject`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 17–23

```php
            'subject_id' => $subject instanceof Model ? $subject->getKey() : null,
            'details' => $details,
            'created_at' => now(),
        ]);
    }
}

```

**السطر 17:** PHP array entry: المفتاح `subject_id` مرتبط بالقيمة `$subject instanceof Model ? $subject->getKey() : null`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 18:** PHP array entry: المفتاح `details` مرتبط بالقيمة `$details`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 19:** PHP array entry: المفتاح `created_at` مرتبط بالقيمة `now()`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 20:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 21:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 22:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
