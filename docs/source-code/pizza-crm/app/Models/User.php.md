# مستخدم وعلاقاته ودوره وpassword hashing

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `app/Models/User.php` · 61 سطر.

**وظيفة الملف:** Eloquent model يرث Authenticatable للدخول. fillable يحدد الحقول القابلة للتعبئة الجماعية، hidden يمنع password/remember_token من JSON، وhashed cast يحوّل الباسورد إلى hash أحادي الاتجاه عند الإسناد؛ مش encryption لها مفتاح لفك النص. hidden مش صلاحية قراءة قاعدة البيانات.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../app/Models/User.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Models/Order.php](Order.php.md)

- [pizza-crm/app/Models/Branch.php](Branch.php.md)

- [pizza-crm/app/Http/Middleware/RequireRole.php](../Http/Middleware/RequireRole.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

// app/Models/User.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory;
    use Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'branch_id',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function isStaff(): bool
    {
        return in_array($this->role, ['staff', 'admin'], true);
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### casts

حوّل وقت التأكيد إلى datetime وis_active إلى Boolean، وpassword إلى hash أحادي الاتجاه عند الكتابة؛ وقت login نقارن بالـ hash مش نفكّه.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** array cast definitions.

### orders

علاقة كل طلبات المستخدم عن طريق orders.user_id.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** HasMany relation مش نتيجة query جاهزة.

### branch

الفرع اللي الموظف تابع له عن طريق users.branch_id.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** BelongsTo relation.

### isStaff

اعتبر الدور staff أو admin قادرًا على واجهة الموظف.

- **بتاخد إيه؟ Inputs:** role الحالية.

- **بترجع/بتغيّر إيه؟ Return / effect:** bool من in_array strict.

### isAdmin

هل role بالضبط admin؟

- **بتاخد إيه؟ Inputs:** role الحالية.

- **بترجع/بتغيّر إيه؟ Return / effect:** bool.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### $this->hasMany

- **جاية منين؟** Eloquent Model

- **وظيفتها:** تصف علاقة واحد لمتعدد.

- **المدخلات — Arguments:** related class ومفاتيح اختيارية.

- **الناتج/الأثر — Return / effect:** HasMany relation؛ ليست array منتجات جاهزة.

- **أول موضع هنا:** السطر 43.

### $this->belongsTo

- **جاية منين؟** Eloquent Model

- **وظيفتها:** تصف علاقة السجل بالسجل الأب.

- **المدخلات — Arguments:** related class ومفاتيح اختيارية.

- **الناتج/الأثر — Return / effect:** BelongsTo relation.

- **أول موضع هنا:** السطر 48.

### in_array

- **جاية منين؟** PHP built-in

- **وظيفتها:** هل قيمة موجودة في array؟ المعامل الثالث true يمنع تحويل الأنواع أثناء المقارنة.

- **المدخلات — Arguments:** needle ثم haystack ثم strict bool.

- **الناتج/الأثر — Return / effect:** bool.

- **أول موضع هنا:** السطر 53.

- **مثال:** in_array($status, $allowed, true)

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

// app/Models/User.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 5:** namespace بتحدد نطاق أسماء الكلاس `App\Models`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 7:** use / استيراد الاسم `Illuminate\Database\Eloquent\Factories\HasFactory` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 8:** use / استيراد الاسم `Illuminate\Database\Eloquent\Relations\HasMany` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory;
    use Notifiable;
```

**السطر 9:** use / استيراد الاسم `Illuminate\Database\Eloquent\Relations\BelongsTo` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 10:** use / استيراد الاسم `Illuminate\Foundation\Auth\User as Authenticatable` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 11:** use / استيراد الاسم `Illuminate\Notifications\Notifiable` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 13:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

**السطر 14:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 15:** use / استيراد الاسم `HasFactory` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 16:** use / استيراد الاسم `Notifiable` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 17–24

```php

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'branch_id',
        'is_active',
```

**السطر 18:** Property / خاصية `$fillable` في الكلاس. `protected` معناها متاحة جوّه الكلاس والكلاسات الوارثة. fillable قائمة الحقول المسموح تمريرها في mass assignment زي create/update؛ مش هي validation.

**السطر 19:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 20:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 21:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 22:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 23:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 24:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 25–32

```php
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
```

**السطر 25:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 27:** Property / خاصية `$hidden` في الكلاس. `protected` معناها متاحة جوّه الكلاس والكلاسات الوارثة. hidden حقول متطلعش في تحويل الـmodel إلى JSON مثل password؛ ده إخفاء عرض مش تشفير.

**السطر 28:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 29:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 30:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 32:** Function / تعريف دالة `casts`؛ تعريفها مش تشغيلها. حوّل وقت التأكيد إلى datetime وis_active إلى Boolean، وpassword إلى hash أحادي الاتجاه عند الكتابة؛ وقت login نقارن بالـ hash مش نفكّه. مدخلاتها: لا شيء. ناتجها: array cast definitions.

### السطور 33–40

```php
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

```

**السطر 33:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 34:** return تعيد array القيم التالية. في ملف config دي إعدادات يستلمها Laravel وقت تحميل الإعداد؛ في method فهي ناتج يرجع للكود اللي ناداها. مش JSON response إلا لو بنينا response صراحة.

**السطر 35:** PHP array entry: المفتاح `email_verified_at` مرتبط بالقيمة `'datetime'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 36:** PHP array entry: المفتاح `password` مرتبط بالقيمة `'hashed'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 37:** قواعد حقل `is_active` داخل array التحقق: `boolean` = قيمة boolean مقبولة من Laravel. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 38:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 39:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 41–48

```php
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
```

**السطر 41:** Function / تعريف دالة `orders`؛ تعريفها مش تشغيلها. علاقة كل طلبات المستخدم عن طريق orders.user_id. مدخلاتها: لا شيء. ناتجها: HasMany relation مش نتيجة query جاهزة.

**السطر 42:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 43:** return تعيد التعبير `$this->hasMany(Order::class)` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 44:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 46:** Function / تعريف دالة `branch`؛ تعريفها مش تشغيلها. الفرع اللي الموظف تابع له عن طريق users.branch_id. مدخلاتها: لا شيء. ناتجها: BelongsTo relation.

**السطر 47:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 48:** return تعيد التعبير `$this->belongsTo(Branch::class)` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

### السطور 49–56

```php
    }

    public function isStaff(): bool
    {
        return in_array($this->role, ['staff', 'admin'], true);
    }

    public function isAdmin(): bool
```

**السطر 49:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 51:** Function / تعريف دالة `isStaff`؛ تعريفها مش تشغيلها. اعتبر الدور staff أو admin قادرًا على واجهة الموظف. مدخلاتها: role الحالية. ناتجها: bool من in_array strict.

**السطر 52:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 53:** return تعيد التعبير `in_array($this->role, ['staff', 'admin'], true)` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 54:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 56:** Function / تعريف دالة `isAdmin`؛ تعريفها مش تشغيلها. هل role بالضبط admin؟ مدخلاتها: role الحالية. ناتجها: bool.

### السطور 57–61

```php
    {
        return $this->role === 'admin';
    }
}

```

**السطر 57:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 58:** return تعيد التعبير `$this->role === 'admin'` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 59:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 60:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
