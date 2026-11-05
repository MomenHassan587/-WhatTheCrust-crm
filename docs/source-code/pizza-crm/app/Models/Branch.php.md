# الفرع وأسعاره وطلباته وموظفوه

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `app/Models/Branch.php` · 48 سطر.

**وظيفة الملف:** يخزن العنوان والهاتف ورسوم وإتاحة التوصيل. menuItems many-to-many وفي الـ pivot سعر وإتاحة كل صنف بالفرع. staff() اسم علاقة فقط؛ هي hasMany لكل users اللي branch_id بتاعهم الفرع، مش role filter داخل الدالة.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../app/Models/Branch.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Models/MenuItem.php](MenuItem.php.md)

- [pizza-crm/database/migrations/2026_06_14_000004_create_branch_menu_item_table.php](../../database/migrations/2026_06_14_000004_create_branch_menu_item_table.php.md)

- [pizza-crm/app/Models/Order.php](Order.php.md)

- [pizza-crm/app/Models/User.php](User.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

// app/Models/Branch.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Branch extends Model
{
    protected $fillable = [
        'name',
        'location',
        'phone',
        'opening_hours',
        'delivery_fee',
        'delivery_enabled',
        'is_active',
        'display_order',
    ];

    protected $casts = [
        'display_order' => 'integer',
        'delivery_fee' => 'decimal:2',
        'delivery_enabled' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function menuItems(): BelongsToMany
    {
        return $this->belongsToMany(MenuItem::class)
            ->withPivot(['price', 'is_available'])
            ->withTimestamps();
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function staff(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### menuItems

هات منتجات الفرع مع price/is_available من branch_menu_item.

- **بتاخد إيه؟ Inputs:** pivot branch_menu_item.

- **بترجع/بتغيّر إيه؟ Return / effect:** BelongsToMany relation.

### orders

طلبات هذا الفرع.

- **بتاخد إيه؟ Inputs:** orders.branch_id.

- **بترجع/بتغيّر إيه؟ Return / effect:** HasMany.

### staff

المستخدمون المرتبطون بالفرع؛ لا يوجد where role في العلاقة الحالية.

- **بتاخد إيه؟ Inputs:** users.branch_id.

- **بترجع/بتغيّر إيه؟ Return / effect:** HasMany.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### $this->belongsToMany

- **جاية منين؟** Eloquent Model

- **وظيفتها:** تصف علاقة متعدد لمتعدد عبر pivot.

- **المدخلات — Arguments:** related class وجدول/مفاتيح اختيارية.

- **الناتج/الأثر — Return / effect:** BelongsToMany relation.

- **أول موضع هنا:** السطر 33.

### ->withPivot

- **جاية منين؟** Eloquent relation

- **وظيفتها:** تحدد أعمدة pivot الإضافية المطلوب قراءتها.

- **المدخلات — Arguments:** أسماء الأعمدة.

- **الناتج/الأثر — Return / effect:** relation لاستكمال السلسلة.

- **أول موضع هنا:** السطر 34.

### ->withTimestamps

- **جاية منين؟** Eloquent many-to-many

- **وظيفتها:** تفعّل إدارة created_at/updated_at في pivot.

- **المدخلات — Arguments:** column names اختيارية.

- **الناتج/الأثر — Return / effect:** نفس relation.

- **أول موضع هنا:** السطر 35.

### $this->hasMany

- **جاية منين؟** Eloquent Model

- **وظيفتها:** تصف علاقة واحد لمتعدد.

- **المدخلات — Arguments:** related class ومفاتيح اختيارية.

- **الناتج/الأثر — Return / effect:** HasMany relation؛ ليست array منتجات جاهزة.

- **أول موضع هنا:** السطر 45.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

// app/Models/Branch.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 5:** namespace بتحدد نطاق أسماء الكلاس `App\Models`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 7:** use / استيراد الاسم `Illuminate\Database\Eloquent\Model` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 8:** use / استيراد الاسم `Illuminate\Database\Eloquent\Relations\BelongsToMany` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php
use Illuminate\Database\Eloquent\Relations\HasMany;

class Branch extends Model
{
    protected $fillable = [
        'name',
        'location',
        'phone',
```

**السطر 9:** use / استيراد الاسم `Illuminate\Database\Eloquent\Relations\HasMany` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 11:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

**السطر 12:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 13:** Property / خاصية `$fillable` في الكلاس. `protected` معناها متاحة جوّه الكلاس والكلاسات الوارثة. fillable قائمة الحقول المسموح تمريرها في mass assignment زي create/update؛ مش هي validation.

**السطر 14:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 15:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 16:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 17–24

```php
        'opening_hours',
        'delivery_fee',
        'delivery_enabled',
        'is_active',
        'display_order',
    ];

    protected $casts = [
```

**السطر 17:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 18:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 19:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 20:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 21:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 22:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 24:** Property / خاصية `$casts` في الكلاس. `protected` معناها متاحة جوّه الكلاس والكلاسات الوارثة. casts تحدد تحويل قيم attributes مثل boolean/datetime/hashed؛ hashed تعمل password hashing مش encryption قابل للفك.

### السطور 25–32

```php
        'display_order' => 'integer',
        'delivery_fee' => 'decimal:2',
        'delivery_enabled' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function menuItems(): BelongsToMany
    {
```

**السطر 25:** قواعد حقل `display_order` داخل array التحقق: `integer` = عدد صحيح. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 26:** PHP array entry: المفتاح `delivery_fee` مرتبط بالقيمة `'decimal:2'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 27:** قواعد حقل `delivery_enabled` داخل array التحقق: `boolean` = قيمة boolean مقبولة من Laravel. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 28:** قواعد حقل `is_active` داخل array التحقق: `boolean` = قيمة boolean مقبولة من Laravel. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 29:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 31:** Function / تعريف دالة `menuItems`؛ تعريفها مش تشغيلها. هات منتجات الفرع مع price/is_available من branch_menu_item. مدخلاتها: pivot branch_menu_item. ناتجها: BelongsToMany relation.

**السطر 32:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

### السطور 33–40

```php
        return $this->belongsToMany(MenuItem::class)
            ->withPivot(['price', 'is_available'])
            ->withTimestamps();
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
```

**السطر 33:** return تعيد التعبير `$this->belongsToMany(MenuItem::class)` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 34:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->withPivot(...)`: تحدد أعمدة pivot الإضافية المطلوب قراءتها. مدخلاتها: أسماء الأعمدة. العائد/الأثر: relation لاستكمال السلسلة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 35:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->withTimestamps(...)`: تفعّل إدارة created_at/updated_at في pivot. مدخلاتها: column names اختيارية. العائد/الأثر: نفس relation.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 36:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 38:** Function / تعريف دالة `orders`؛ تعريفها مش تشغيلها. طلبات هذا الفرع. مدخلاتها: orders.branch_id. ناتجها: HasMany.

**السطر 39:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 40:** return تعيد التعبير `$this->hasMany(Order::class)` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

### السطور 41–48

```php
    }

    public function staff(): HasMany
    {
        return $this->hasMany(User::class);
    }
}

```

**السطر 41:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 43:** Function / تعريف دالة `staff`؛ تعريفها مش تشغيلها. المستخدمون المرتبطون بالفرع؛ لا يوجد where role في العلاقة الحالية. مدخلاتها: users.branch_id. ناتجها: HasMany.

**السطر 44:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 45:** return تعيد التعبير `$this->hasMany(User::class)` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 46:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 47:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
