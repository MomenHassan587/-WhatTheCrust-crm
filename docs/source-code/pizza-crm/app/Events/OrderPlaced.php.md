# حدث إنشاء طلب قابل للعرض بالمطبخ

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `app/Events/OrderPlaced.php` · 35 سطر.

**وظيفة الملف:** ShouldBroadcastNow يطلب بثًا فوريًا باستخدام broadcasting driver المهيأ؛ لا يضمن إن driver أو frontend subscription موجودين. الواجهة الحالية تعرض polling أيضًا، لذلك وجود event مش معناه realtime وحده شغال.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../app/Events/OrderPlaced.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Models/Order.php](../Models/Order.php.md)

- [pizza-crm/routes/channels.php](../../routes/channels.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderPlaced implements ShouldBroadcastNow
{
    use Dispatchable, SerializesModels;

    public function __construct(public Order $order) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('staff.admin'),
            new PrivateChannel('staff.branch.'.$this->order->branch_id),
        ];
    }

    public function broadcastAs(): string
    {
        return 'OrderPlaced';
    }

    public function broadcastWith(): array
    {
        return ['order_id' => $this->order->id];
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### __construct

احفظ Order الممرر كخاصية public باستخدام constructor property promotion.

- **بتاخد إيه؟ Inputs:** Order $order.

- **بترجع/بتغيّر إيه؟ Return / effect:** constructor بلا return.

### broadcastOn

حدد قناتي admin العامة للإدارة والفرع الخاص بالطلب.

- **بتاخد إيه؟ Inputs:** order.branch_id.

- **بترجع/بتغيّر إيه؟ Return / effect:** array PrivateChannel objects.

### broadcastAs

اسم الحدث الخارجي بالضبط OrderPlaced.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** string.

### broadcastWith

حدد payload خفيفة فيها order_id بدل إرسال كل بيانات العميل.

- **بتاخد إيه؟ Inputs:** order.id.

- **بترجع/بتغيّر إيه؟ Return / effect:** array order_id.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** namespace بتحدد نطاق أسماء الكلاس `App\Events`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 5:** use / استيراد الاسم `App\Models\Order` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** use / استيراد الاسم `Illuminate\Broadcasting\PrivateChannel` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 7:** use / استيراد الاسم `Illuminate\Contracts\Broadcasting\ShouldBroadcastNow` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 8:** use / استيراد الاسم `Illuminate\Foundation\Events\Dispatchable` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php
use Illuminate\Queue\SerializesModels;

class OrderPlaced implements ShouldBroadcastNow
{
    use Dispatchable, SerializesModels;

    public function __construct(public Order $order) {}

```

**السطر 9:** use / استيراد الاسم `Illuminate\Queue\SerializesModels` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 11:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

**السطر 12:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 13:** use / استيراد الاسم `Dispatchable, SerializesModels` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 15:** Function / تعريف دالة `__construct`؛ تعريفها مش تشغيلها. احفظ Order الممرر كخاصية public باستخدام constructor property promotion. مدخلاتها: Order $order. ناتجها: constructor بلا return.

### السطور 17–24

```php
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('staff.admin'),
            new PrivateChannel('staff.branch.'.$this->order->branch_id),
        ];
    }

```

**السطر 17:** Function / تعريف دالة `broadcastOn`؛ تعريفها مش تشغيلها. حدد قناتي admin العامة للإدارة والفرع الخاص بالطلب. مدخلاتها: order.branch_id. ناتجها: array PrivateChannel objects.

**السطر 18:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 19:** return تعيد array القيم التالية. في ملف config دي إعدادات يستلمها Laravel وقت تحميل الإعداد؛ في method فهي ناتج يرجع للكود اللي ناداها. مش JSON response إلا لو بنينا response صراحة.

**السطر 20:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 21:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 22:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 23:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 25–32

```php
    public function broadcastAs(): string
    {
        return 'OrderPlaced';
    }

    public function broadcastWith(): array
    {
        return ['order_id' => $this->order->id];
```

**السطر 25:** Function / تعريف دالة `broadcastAs`؛ تعريفها مش تشغيلها. اسم الحدث الخارجي بالضبط OrderPlaced. مدخلاتها: لا شيء. ناتجها: string.

**السطر 26:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 27:** return تعيد التعبير `'OrderPlaced'` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 28:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 30:** Function / تعريف دالة `broadcastWith`؛ تعريفها مش تشغيلها. حدد payload خفيفة فيها order_id بدل إرسال كل بيانات العميل. مدخلاتها: order.id. ناتجها: array order_id.

**السطر 31:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 32:** return تعيد array القيم التالية. في ملف config دي إعدادات يستلمها Laravel وقت تحميل الإعداد؛ في method فهي ناتج يرجع للكود اللي ناداها. مش JSON response إلا لو بنينا response صراحة.

### السطور 33–35

```php
    }
}

```

**السطر 33:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 34:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
