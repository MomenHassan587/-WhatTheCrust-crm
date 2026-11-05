# تشغيل seeders بالترتيب

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `database/seeders/DatabaseSeeder.php` · 18 سطر.

**وظيفة الملف:** ينادي MenuCatalogSeeder قبل StaffUserSeeder قبل DemoOrderSeeder عشان الفروع والمنتجات موجودين قبل الموظفين والطلبات. الأمر db:seed بيكتب قاعدة البيانات فعليًا، مش جزء من قراءة المذكرات.

**نوعه:** support. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../database/seeders/DatabaseSeeder.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/database/seeders/MenuCatalogSeeder.php](MenuCatalogSeeder.php.md)

- [pizza-crm/database/seeders/StaffUserSeeder.php](StaffUserSeeder.php.md)

- [pizza-crm/database/seeders/DemoOrderSeeder.php](DemoOrderSeeder.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

// database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(MenuCatalogSeeder::class);
        $this->call(StaffUserSeeder::class);
        $this->call(DemoOrderSeeder::class);
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### run

شغّل seeders الثلاثة بالترتيب المحدد.

- **بتاخد إيه؟ Inputs:** لا parameters.

- **بترجع/بتغيّر إيه؟ Return / effect:** void؛ آثار كتابة DB عند تشغيل الأمر.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### $this->call

- **جاية منين؟** Laravel Seeder

- **وظيفتها:** تشغّل seeder(s) أخرى من داخل الحالية.

- **المدخلات — Arguments:** class(es).

- **الناتج/الأثر — Return / effect:** الأثر تجهيز بيانات؛ راجع اتصال البيئة قبل التنفيذ.

- **أول موضع هنا:** السطر 15.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

// database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 5:** namespace بتحدد نطاق أسماء الكلاس `Database\Seeders`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 7:** use / استيراد الاسم `Illuminate\Database\Seeder` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(MenuCatalogSeeder::class);
        $this->call(StaffUserSeeder::class);
        $this->call(DemoOrderSeeder::class);
    }
```

**السطر 9:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

**السطر 10:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 11:** Function / تعريف دالة `run`؛ تعريفها مش تشغيلها. شغّل seeders الثلاثة بالترتيب المحدد. مدخلاتها: لا parameters. ناتجها: void؛ آثار كتابة DB عند تشغيل الأمر.

**السطر 12:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 13:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->call(...)`: تشغّل seeder(s) أخرى من داخل الحالية. مدخلاتها: class(es). العائد/الأثر: الأثر تجهيز بيانات؛ راجع اتصال البيئة قبل التنفيذ.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 14:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->call(...)`: تشغّل seeder(s) أخرى من داخل الحالية. مدخلاتها: class(es). العائد/الأثر: الأثر تجهيز بيانات؛ راجع اتصال البيئة قبل التنفيذ.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 15:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->call(...)`: تشغّل seeder(s) أخرى من داخل الحالية. مدخلاتها: class(es). العائد/الأثر: الأثر تجهيز بيانات؛ راجع اتصال البيئة قبل التنفيذ.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 16:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 17–18

```php
}

```

**السطر 17:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
