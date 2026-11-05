# الطلب وثوابت حالاته وعلاقاته

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `app/Models/Order.php` · 96 سطر.

**وظيفة الملف:** يوحد أسماء الحالات وTRANSITIONS. يخفي tracking_token من serialization العادي؛ controllers ترجعه صراحةً في الحالات المطلوبة. total_price decimal:2 غالبًا تتسلسل string للحفاظ على شكل منزلتين، وpickup_time datetime.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../app/Models/Order.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Models/User.php](User.php.md)

- [pizza-crm/app/Models/Branch.php](Branch.php.md)

- [pizza-crm/app/Models/OrderItem.php](OrderItem.php.md)

- [pizza-crm/app/Models/OrderStatusLog.php](OrderStatusLog.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

// app/Models/Order.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    public const STATUS_PAYMENT_PENDING = 'payment_pending';

    public const STATUS_NEW = 'new';

    public const STATUS_ACCEPTED = 'accepted';

    public const STATUS_PREPARING = 'preparing';

    public const STATUS_READY = 'ready';

    public const STATUS_OUT_FOR_DELIVERY = 'out_for_delivery';

    public const STATUS_PICKED_UP = 'picked_up';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_CANCELLED = 'cancelled';

    public const STATUS_REJECTED = 'rejected';

    public const STAFF_STATUSES = [
        self::STATUS_NEW, self::STATUS_ACCEPTED, self::STATUS_PREPARING,
        self::STATUS_READY, self::STATUS_OUT_FOR_DELIVERY, self::STATUS_PICKED_UP,
        self::STATUS_COMPLETED, self::STATUS_CANCELLED, self::STATUS_REJECTED,
    ];

    public const TRANSITIONS = [
        self::STATUS_NEW => [self::STATUS_ACCEPTED, self::STATUS_REJECTED, self::STATUS_CANCELLED],
        self::STATUS_ACCEPTED => [self::STATUS_PREPARING, self::STATUS_CANCELLED],
        self::STATUS_PREPARING => [self::STATUS_READY, self::STATUS_CANCELLED],
        self::STATUS_READY => [self::STATUS_OUT_FOR_DELIVERY, self::STATUS_PICKED_UP, self::STATUS_CANCELLED],
        self::STATUS_OUT_FOR_DELIVERY => [self::STATUS_COMPLETED, self::STATUS_CANCELLED],
        self::STATUS_PICKED_UP => [self::STATUS_COMPLETED],
    ];

    protected $fillable = [
        'user_id',
        'branch_id',
        'order_type',
        'total_price',
        'status',
        'pickup_time',
        'customer_name',
        'customer_phone',
        'delivery_address',
        'payment_method',
        'payment_status',
        'payment_gateway',
        'gateway_reference',
        'idempotency_key',
        'tracking_token',
        'status_reason',
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
        'pickup_time' => 'datetime',
    ];

    protected $hidden = [
        'tracking_token',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function statusLogs(): HasMany
    {
        return $this->hasMany(OrderStatusLog::class)->orderBy('created_at');
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### user

صاحب الحساب إن كان الطلب من مستخدم مسجل.

- **بتاخد إيه؟ Inputs:** orders.user_id nullable.

- **بترجع/بتغيّر إيه؟ Return / effect:** BelongsTo.

### branch

فرع الطلب.

- **بتاخد إيه؟ Inputs:** orders.branch_id.

- **بترجع/بتغيّر إيه؟ Return / effect:** BelongsTo.

### items

بنود الطلب المحفوظة باسم وسعر وقت الشراء.

- **بتاخد إيه؟ Inputs:** order_items.order_id.

- **بترجع/بتغيّر إيه؟ Return / effect:** HasMany؛ items() تبني query وitems property تجيب collection.

### statusLogs

سجل انتقالات الحالة مرتب created_at تصاعديًا.

- **بتاخد إيه؟ Inputs:** order_status_logs.order_id.

- **بترجع/بتغيّر إيه؟ Return / effect:** HasMany مع orderBy.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### $this->belongsTo

- **جاية منين؟** Eloquent Model

- **وظيفتها:** تصف علاقة السجل بالسجل الأب.

- **المدخلات — Arguments:** related class ومفاتيح اختيارية.

- **الناتج/الأثر — Return / effect:** BelongsTo relation.

- **أول موضع هنا:** السطر 83.

### $this->hasMany

- **جاية منين؟** Eloquent Model

- **وظيفتها:** تصف علاقة واحد لمتعدد.

- **المدخلات — Arguments:** related class ومفاتيح اختيارية.

- **الناتج/الأثر — Return / effect:** HasMany relation؛ ليست array منتجات جاهزة.

- **أول موضع هنا:** السطر 93.

### ->orderBy

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تضيف ترتيبًا حسب عمود واتجاه.

- **المدخلات — Arguments:** column وdirection.

- **الناتج/الأثر — Return / effect:** Builder.

- **أول موضع هنا:** السطر 93.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

// app/Models/Order.php

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
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    public const STATUS_PAYMENT_PENDING = 'payment_pending';

    public const STATUS_NEW = 'new';

```

**السطر 9:** use / استيراد الاسم `Illuminate\Database\Eloquent\Relations\HasMany` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 11:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

**السطر 12:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 13:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 15:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 17–24

```php
    public const STATUS_ACCEPTED = 'accepted';

    public const STATUS_PREPARING = 'preparing';

    public const STATUS_READY = 'ready';

    public const STATUS_OUT_FOR_DELIVERY = 'out_for_delivery';

```

**السطر 17:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 19:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 21:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 23:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 25–32

```php
    public const STATUS_PICKED_UP = 'picked_up';

    public const STATUS_COMPLETED = 'completed';

    public const STATUS_CANCELLED = 'cancelled';

    public const STATUS_REJECTED = 'rejected';

```

**السطر 25:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 27:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 29:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 31:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 33–40

```php
    public const STAFF_STATUSES = [
        self::STATUS_NEW, self::STATUS_ACCEPTED, self::STATUS_PREPARING,
        self::STATUS_READY, self::STATUS_OUT_FOR_DELIVERY, self::STATUS_PICKED_UP,
        self::STATUS_COMPLETED, self::STATUS_CANCELLED, self::STATUS_REJECTED,
    ];

    public const TRANSITIONS = [
        self::STATUS_NEW => [self::STATUS_ACCEPTED, self::STATUS_REJECTED, self::STATUS_CANCELLED],
```

**السطر 33:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 34:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 35:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 36:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 37:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 39:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 40:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 41–48

```php
        self::STATUS_ACCEPTED => [self::STATUS_PREPARING, self::STATUS_CANCELLED],
        self::STATUS_PREPARING => [self::STATUS_READY, self::STATUS_CANCELLED],
        self::STATUS_READY => [self::STATUS_OUT_FOR_DELIVERY, self::STATUS_PICKED_UP, self::STATUS_CANCELLED],
        self::STATUS_OUT_FOR_DELIVERY => [self::STATUS_COMPLETED, self::STATUS_CANCELLED],
        self::STATUS_PICKED_UP => [self::STATUS_COMPLETED],
    ];

    protected $fillable = [
```

**السطر 41:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 42:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 43:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 44:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 45:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 46:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 48:** Property / خاصية `$fillable` في الكلاس. `protected` معناها متاحة جوّه الكلاس والكلاسات الوارثة. fillable قائمة الحقول المسموح تمريرها في mass assignment زي create/update؛ مش هي validation.

### السطور 49–56

```php
        'user_id',
        'branch_id',
        'order_type',
        'total_price',
        'status',
        'pickup_time',
        'customer_name',
        'customer_phone',
```

**السطر 49:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 50:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 51:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 52:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 53:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 54:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 55:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 56:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 57–64

```php
        'delivery_address',
        'payment_method',
        'payment_status',
        'payment_gateway',
        'gateway_reference',
        'idempotency_key',
        'tracking_token',
        'status_reason',
```

**السطر 57:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 58:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 59:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 60:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 61:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 62:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 63:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 64:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 65–72

```php
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
        'pickup_time' => 'datetime',
    ];

    protected $hidden = [
```

**السطر 65:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 67:** Property / خاصية `$casts` في الكلاس. `protected` معناها متاحة جوّه الكلاس والكلاسات الوارثة. casts تحدد تحويل قيم attributes مثل boolean/datetime/hashed؛ hashed تعمل password hashing مش encryption قابل للفك.

**السطر 68:** PHP array entry: المفتاح `total_price` مرتبط بالقيمة `'decimal:2'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 69:** PHP array entry: المفتاح `pickup_time` مرتبط بالقيمة `'datetime'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 70:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 72:** Property / خاصية `$hidden` في الكلاس. `protected` معناها متاحة جوّه الكلاس والكلاسات الوارثة. hidden حقول متطلعش في تحويل الـmodel إلى JSON مثل password؛ ده إخفاء عرض مش تشفير.

### السطور 73–80

```php
        'tracking_token',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

```

**السطر 73:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 74:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 76:** Function / تعريف دالة `user`؛ تعريفها مش تشغيلها. صاحب الحساب إن كان الطلب من مستخدم مسجل. مدخلاتها: orders.user_id nullable. ناتجها: BelongsTo.

**السطر 77:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 78:** return تعيد التعبير `$this->belongsTo(User::class)` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 79:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 81–88

```php
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
```

**السطر 81:** Function / تعريف دالة `branch`؛ تعريفها مش تشغيلها. فرع الطلب. مدخلاتها: orders.branch_id. ناتجها: BelongsTo.

**السطر 82:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 83:** return تعيد التعبير `$this->belongsTo(Branch::class)` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 84:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 86:** Function / تعريف دالة `items`؛ تعريفها مش تشغيلها. بنود الطلب المحفوظة باسم وسعر وقت الشراء. مدخلاتها: order_items.order_id. ناتجها: HasMany؛ items() تبني query وitems property تجيب collection.

**السطر 87:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 88:** return تعيد التعبير `$this->hasMany(OrderItem::class)` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

### السطور 89–96

```php
    }

    public function statusLogs(): HasMany
    {
        return $this->hasMany(OrderStatusLog::class)->orderBy('created_at');
    }
}

```

**السطر 89:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 91:** Function / تعريف دالة `statusLogs`؛ تعريفها مش تشغيلها. سجل انتقالات الحالة مرتب created_at تصاعديًا. مدخلاتها: order_status_logs.order_id. ناتجها: HasMany مع orderBy.

**السطر 92:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 93:** return تعيد التعبير `$this->hasMany(OrderStatusLog::class)->orderBy('created_at')` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 94:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 95:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
