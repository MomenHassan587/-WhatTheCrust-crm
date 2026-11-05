# أمر inspire الافتراضي

[فهرس كل الأكواد](../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `routes/console.php` · 9 سطر.

**وظيفة الملف:** يسجل أمر CLI يطبع اقتباس؛ مش route HTTP ومش جزء من تشغيل الطلبات.

**نوعه:** starter. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../routes/console.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
```

</details>

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### Artisan::command

- **جاية منين؟** Laravel Artisan

- **وظيفتها:** تسجّل command CLI بقالب arguments.

- **المدخلات — Arguments:** signature وcallback.

- **الناتج/الأثر — Return / effect:** command definition.

- **أول موضع هنا:** السطر 6.

### $this->comment

- **جاية منين؟** Laravel Console Command

- **وظيفتها:** تطبع رسالة comment للـterminal.

- **المدخلات — Arguments:** text.

- **الناتج/الأثر — Return / effect:** أثر عرض، مش HTTP response.

- **أول موضع هنا:** السطر 7.

### Inspiring::quote

- **جاية منين؟** Laravel Inspiring

- **وظيفتها:** تختار اقتباسًا للعرض في الأمر الافتراضي.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 7.

### ->purpose

- **جاية منين؟** Laravel Console Command

- **وظيفتها:** تضيف وصفًا للأمر في help.

- **المدخلات — Arguments:** text.

- **الناتج/الأثر — Return / effect:** command definition.

- **أول موضع هنا:** السطر 8.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** use / استيراد الاسم `Illuminate\Foundation\Inspiring` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 4:** use / استيراد الاسم `Illuminate\Support\Facades\Artisan` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `Artisan::command(...)`: تسجّل command CLI بقالب arguments. مدخلاتها: signature وcallback. العائد/الأثر: command definition.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 7:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->comment(...)`: تطبع رسالة comment للـterminal. مدخلاتها: text. العائد/الأثر: أثر عرض، مش HTTP response.؛ `Inspiring::quote(...)`: تختار اقتباسًا للعرض في الأمر الافتراضي. مدخلاتها: بدون arguments. العائد/الأثر: string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 8:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->purpose(...)`: تضيف وصفًا للأمر في help. مدخلاتها: text. العائد/الأثر: command definition.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
