# بوابة الصلاحيات قبل الـ controller

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `app/Http/Middleware/RequireRole.php` · 20 سطر.

**وظيفة الملف:** يرفض الطلب لو المستخدم غائب أو معطّل أو دوره مش ضمن roles المطلوبة. staff لازم مرتبط بفرع. إخفاء زر React مش أمن؛ الرفض الحقيقي هنا وفي authorizeBranch.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../app/Http/Middleware/RequireRole.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/routes/web.php](../../../routes/web.php.md)

- [pizza-crm/bootstrap/app.php](../../../bootstrap/app.php.md)

- [pizza-crm/app/Models/User.php](../../Models/User.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();
        abort_unless($user && $user->is_active && in_array($user->role, $roles, true), 403);
        abort_if($user->role === 'staff' && ! $user->branch_id, 403, 'This staff account is not assigned to a branch.');

        return $next($request);
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### handle

راجع المستخدم والدور والفرع، وكمل للطبقة التالية فقط لو مسموح.

- **بتاخد إيه؟ Inputs:** Request وClosure $next وstring ...$roles؛ مثال role:staff,admin.

- **بترجع/بتغيّر إيه؟ Return / effect:** Symfony Response من next(request) أو HTTP403 يوقف التنفيذ.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### $request->user

- **جاية منين؟** Laravel Request

- **وظيفتها:** اقرأ المستخدم الذي ثبتته session أو guard للطلب الحالي؛ مش user ID أرسله العميل في body.

- **المدخلات — Arguments:** اسم guard اختياري؛ المشروع بدون arguments.

- **الناتج/الأثر — Return / effect:** User أو null لو ضيف.

- **أول موضع هنا:** السطر 13.

- **مثال:** $request->user()?->load('branch')

### abort_unless

- **جاية منين؟** Laravel helper

- **وظيفتها:** لو الشرط false ارم HTTP exception وأوقف الطلب؛ لو true كمل.

- **المدخلات — Arguments:** condition وstatus code ورسالة اختيارية.

- **الناتج/الأثر — Return / effect:** لا قيمة مفيدة؛ قد يرمي exception.

- **أول موضع هنا:** السطر 14.

- **مثال:** abort_unless($user->isAdmin(), 403);

### in_array

- **جاية منين؟** PHP built-in

- **وظيفتها:** هل قيمة موجودة في array؟ المعامل الثالث true يمنع تحويل الأنواع أثناء المقارنة.

- **المدخلات — Arguments:** needle ثم haystack ثم strict bool.

- **الناتج/الأثر — Return / effect:** bool.

- **أول موضع هنا:** السطر 14.

- **مثال:** in_array($status, $allowed, true)

### abort_if

- **جاية منين؟** Laravel helper

- **وظيفتها:** لو الشرط true أوقف الطلب بالstatus المحددة؛ عكس abort_unless.

- **المدخلات — Arguments:** condition وstatus code/message.

- **الناتج/الأثر — Return / effect:** قد يرمي HTTP exception.

- **أول موضع هنا:** السطر 15.

- **مثال:** abort_if($user->role === 'staff' && ! $user->branch_id, 403);

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** namespace بتحدد نطاق أسماء الكلاس `App\Http\Middleware`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 5:** use / استيراد الاسم `Closure` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** use / استيراد الاسم `Illuminate\Http\Request` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 7:** use / استيراد الاسم `Symfony\Component\HttpFoundation\Response` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php
class RequireRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();
        abort_unless($user && $user->is_active && in_array($user->role, $roles, true), 403);
        abort_if($user->role === 'staff' && ! $user->branch_id, 403, 'This staff account is not assigned to a branch.');

```

**السطر 9:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

**السطر 10:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 11:** Function / تعريف دالة `handle`؛ تعريفها مش تشغيلها. راجع المستخدم والدور والفرع، وكمل للطبقة التالية فقط لو مسموح. مدخلاتها: Request وClosure $next وstring ...$roles؛ مثال role:staff,admin. ناتجها: Symfony Response من next(request) أو HTTP403 يوقف التنفيذ.

**السطر 12:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 13:** Assignment / إسناد: احسب `$request->user()` الأول وخزّن النتيجة في `$user`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 14:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `abort_unless(...)`: لو الشرط false ارم HTTP exception وأوقف الطلب؛ لو true كمل. مدخلاتها: condition وstatus code ورسالة اختيارية. العائد/الأثر: لا قيمة مفيدة؛ قد يرمي exception.؛ `in_array(...)`: هل قيمة موجودة في array؟ المعامل الثالث true يمنع تحويل الأنواع أثناء المقارنة. مدخلاتها: needle ثم haystack ثم strict bool. العائد/الأثر: bool.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 15:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `abort_if(...)`: لو الشرط true أوقف الطلب بالstatus المحددة؛ عكس abort_unless. مدخلاتها: condition وstatus code/message. العائد/الأثر: قد يرمي HTTP exception.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 17–20

```php
        return $next($request);
    }
}

```

**السطر 17:** return تعيد التعبير `$next($request)` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 18:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 19:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
