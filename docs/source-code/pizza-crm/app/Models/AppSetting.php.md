# إعدادات key/value وfallback

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `app/Models/AppSetting.php` · 16 سطر.

**وظيفة الملف:** يخزن الإعدادات كنصوص. valueFor تقرأ مفتاحًا أو default لو القيمة null أو السجل غير موجود؛ الصفر أو النص الفاضي مش بيتبدلوا بسبب ?? لو مش null.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../app/Models/AppSetting.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Http/Requests/StoreOrderRequest.php](../Http/Requests/StoreOrderRequest.php.md)

- [pizza-crm/app/Http/Controllers/Api/StaffOrderController.php](../Http/Controllers/Api/StaffOrderController.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppSetting extends Model
{
    protected $fillable = ['key', 'value'];

    public static function valueFor(string $key, mixed $default = null): mixed
    {
        return static::query()->where('key', $key)->value('value') ?? $default;
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### valueFor

query على key ثم value('value') وبعدها null-coalescing إلى default.

- **بتاخد إيه؟ Inputs:** string key وmixed default افتراضي null.

- **بترجع/بتغيّر إيه؟ Return / effect:** mixed قيمة setting أو default؛ caller مسؤول عن cast المطلوب.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### static::query

- **جاية منين؟** Eloquent

- **وظيفتها:** تبدأ بناء query على model.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** Eloquent Builder، مش rows جاهزة.

- **أول موضع هنا:** السطر 13.

### ->where

- **جاية منين؟** Laravel Query Builder

- **وظيفتها:** تضيف شرط فلترة أو مجموعة شروط.

- **المدخلات — Arguments:** column/operator/value أو closure.

- **الناتج/الأثر — Return / effect:** Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.

- **أول موضع هنا:** السطر 13.

### ->value

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تقرأ قيمة عمود من أول نتيجة.

- **المدخلات — Arguments:** column.

- **الناتج/الأثر — Return / effect:** scalar أو null.

- **أول موضع هنا:** السطر 13.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppSetting extends Model
{
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** namespace بتحدد نطاق أسماء الكلاس `App\Models`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 5:** use / استيراد الاسم `Illuminate\Database\Eloquent\Model` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 7:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

**السطر 8:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

### السطور 9–16

```php
    protected $fillable = ['key', 'value'];

    public static function valueFor(string $key, mixed $default = null): mixed
    {
        return static::query()->where('key', $key)->value('value') ?? $default;
    }
}

```

**السطر 9:** Property / خاصية `$fillable` في الكلاس. `protected` معناها متاحة جوّه الكلاس والكلاسات الوارثة. fillable قائمة الحقول المسموح تمريرها في mass assignment زي create/update؛ مش هي validation.

**السطر 11:** Function / تعريف دالة `valueFor`؛ تعريفها مش تشغيلها. query على key ثم value('value') وبعدها null-coalescing إلى default. مدخلاتها: string key وmixed default افتراضي null. ناتجها: mixed قيمة setting أو default؛ caller مسؤول عن cast المطلوب.

**السطر 12:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 13:** return تعيد التعبير `static::query()->where('key', $key)->value('value') ?? $default` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 14:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 15:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
