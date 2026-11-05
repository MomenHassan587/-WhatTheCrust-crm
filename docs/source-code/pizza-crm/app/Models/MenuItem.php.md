# المنتج وعلاقته بالقسم والفروع

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `app/Models/MenuItem.php` · 46 سطر.

**وظيفة الملف:** المنتج ليه category واحدة وفروع متعددة، وكل فرع ليه سعر وإتاحة على pivot. is_active تعطيل على مستوى كل الفروع؛ pivot.is_available تعطيل داخل فرع معين.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../app/Models/MenuItem.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Models/Category.php](Category.php.md)

- [pizza-crm/app/Models/Branch.php](Branch.php.md)

- [pizza-crm/app/Models/OrderItem.php](OrderItem.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

// app/Models/MenuItem.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MenuItem extends Model
{
    protected $fillable = [
        'category_id',
        'name',
        'description',
        'image_path',
        'tag',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'display_order' => 'integer',
        'is_active' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function branches(): BelongsToMany
    {
        return $this->belongsToMany(Branch::class)
            ->withPivot(['price', 'is_available'])
            ->withTimestamps();
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### category

القسم صاحب المنتج.

- **بتاخد إيه؟ Inputs:** category_id.

- **بترجع/بتغيّر إيه؟ Return / effect:** BelongsTo.

### branches

الفروع المرتبط بها المنتج ومعها pivot price/is_available/timestamps.

- **بتاخد إيه؟ Inputs:** branch_menu_item.

- **بترجع/بتغيّر إيه؟ Return / effect:** BelongsToMany.

### orderItems

كل بنود الطلبات اللي أشارت لهذا المنتج.

- **بتاخد إيه؟ Inputs:** order_items.menu_item_id.

- **بترجع/بتغيّر إيه؟ Return / effect:** HasMany.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### $this->belongsTo

- **جاية منين؟** Eloquent Model

- **وظيفتها:** تصف علاقة السجل بالسجل الأب.

- **المدخلات — Arguments:** related class ومفاتيح اختيارية.

- **الناتج/الأثر — Return / effect:** BelongsTo relation.

- **أول موضع هنا:** السطر 31.

### $this->belongsToMany

- **جاية منين؟** Eloquent Model

- **وظيفتها:** تصف علاقة متعدد لمتعدد عبر pivot.

- **المدخلات — Arguments:** related class وجدول/مفاتيح اختيارية.

- **الناتج/الأثر — Return / effect:** BelongsToMany relation.

- **أول موضع هنا:** السطر 36.

### ->withPivot

- **جاية منين؟** Eloquent relation

- **وظيفتها:** تحدد أعمدة pivot الإضافية المطلوب قراءتها.

- **المدخلات — Arguments:** أسماء الأعمدة.

- **الناتج/الأثر — Return / effect:** relation لاستكمال السلسلة.

- **أول موضع هنا:** السطر 37.

### ->withTimestamps

- **جاية منين؟** Eloquent many-to-many

- **وظيفتها:** تفعّل إدارة created_at/updated_at في pivot.

- **المدخلات — Arguments:** column names اختيارية.

- **الناتج/الأثر — Return / effect:** نفس relation.

- **أول موضع هنا:** السطر 38.

### $this->hasMany

- **جاية منين؟** Eloquent Model

- **وظيفتها:** تصف علاقة واحد لمتعدد.

- **المدخلات — Arguments:** related class ومفاتيح اختيارية.

- **الناتج/الأثر — Return / effect:** HasMany relation؛ ليست array منتجات جاهزة.

- **أول موضع هنا:** السطر 43.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

// app/Models/MenuItem.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 5:** namespace بتحدد نطاق أسماء الكلاس `App\Models`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 7:** use / استيراد الاسم `Illuminate\Database\Eloquent\Model` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 8:** use / استيراد الاسم `Illuminate\Database\Eloquent\Relations\BelongsTo` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MenuItem extends Model
{
    protected $fillable = [
        'category_id',
        'name',
```

**السطر 9:** use / استيراد الاسم `Illuminate\Database\Eloquent\Relations\BelongsToMany` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 10:** use / استيراد الاسم `Illuminate\Database\Eloquent\Relations\HasMany` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 12:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

**السطر 13:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 14:** Property / خاصية `$fillable` في الكلاس. `protected` معناها متاحة جوّه الكلاس والكلاسات الوارثة. fillable قائمة الحقول المسموح تمريرها في mass assignment زي create/update؛ مش هي validation.

**السطر 15:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 16:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 17–24

```php
        'description',
        'image_path',
        'tag',
        'display_order',
        'is_active',
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
        'is_active' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
```

**السطر 25:** قواعد حقل `display_order` داخل array التحقق: `integer` = عدد صحيح. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 26:** قواعد حقل `is_active` داخل array التحقق: `boolean` = قيمة boolean مقبولة من Laravel. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 27:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 29:** Function / تعريف دالة `category`؛ تعريفها مش تشغيلها. القسم صاحب المنتج. مدخلاتها: category_id. ناتجها: BelongsTo.

**السطر 30:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 31:** return تعيد التعبير `$this->belongsTo(Category::class)` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 32:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 33–40

```php

    public function branches(): BelongsToMany
    {
        return $this->belongsToMany(Branch::class)
            ->withPivot(['price', 'is_available'])
            ->withTimestamps();
    }

```

**السطر 34:** Function / تعريف دالة `branches`؛ تعريفها مش تشغيلها. الفروع المرتبط بها المنتج ومعها pivot price/is_available/timestamps. مدخلاتها: branch_menu_item. ناتجها: BelongsToMany.

**السطر 35:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 36:** return تعيد التعبير `$this->belongsToMany(Branch::class)` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 37:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->withPivot(...)`: تحدد أعمدة pivot الإضافية المطلوب قراءتها. مدخلاتها: أسماء الأعمدة. العائد/الأثر: relation لاستكمال السلسلة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 38:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->withTimestamps(...)`: تفعّل إدارة created_at/updated_at في pivot. مدخلاتها: column names اختيارية. العائد/الأثر: نفس relation.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 39:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 41–46

```php
    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}

```

**السطر 41:** Function / تعريف دالة `orderItems`؛ تعريفها مش تشغيلها. كل بنود الطلبات اللي أشارت لهذا المنتج. مدخلاتها: order_items.menu_item_id. ناتجها: HasMany.

**السطر 42:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 43:** return تعيد التعبير `$this->hasMany(OrderItem::class)` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 44:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 45:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
