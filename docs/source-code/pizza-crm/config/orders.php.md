# config/orders.php

[فهرس كل الأكواد](../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `config/orders.php` · 10 سطر.

**وظيفة الملف:** ملف إعداد Laravel: يعيد array تضبط خدمة حسب environment/defaults. الإعداد مش تنفيذ عملية طلب مباشرة؛ لا نعرض .env الفعلية.

**نوعه:** starter / إعداد أو ملف أصلي من framework. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../config/orders.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

return [
    'minimum_pickup_prep_minutes' => (int) env('ORDER_MIN_PICKUP_PREP_MINUTES', 20),
    'delivery_fee' => (float) env('ORDER_DELIVERY_FEE', 25),
    'order_promise_minutes' => (int) env('ORDER_PROMISE_MINUTES', 3),
    'kitchen_timer_green_minutes' => (int) env('ORDER_KITCHEN_GREEN_MINUTES', 3),
    'kitchen_timer_orange_minutes' => (int) env('ORDER_KITCHEN_ORANGE_MINUTES', 6),
];
```

</details>

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### env

- **جاية منين؟** Laravel helper

- **وظيفتها:** اقرأ قيمة متغير البيئة أو default؛ تستعمل لإعداد التطبيق، ومش وسيلة قراءة بيانات form. مع config cache تُقرأ الإعدادات عادة من config بدل env داخل business code.

- **المدخلات — Arguments:** اسم متغير string ثم default اختيارية؛ لا تطبع قيم password أو مفاتيح الدفع في المذكرات.

- **الناتج/الأثر — Return / effect:** قيمة متغير البيئة المحوّلة وفق Laravel، أو default لو غائب؛ ممكن string أو bool أو null.

- **أول موضع هنا:** السطر 8.

- **مثال:** env('ADMIN_EMAIL', 'admin@whatthecrust.test')

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

return [
    'minimum_pickup_prep_minutes' => (int) env('ORDER_MIN_PICKUP_PREP_MINUTES', 20),
    'delivery_fee' => (float) env('ORDER_DELIVERY_FEE', 25),
    'order_promise_minutes' => (int) env('ORDER_PROMISE_MINUTES', 3),
    'kitchen_timer_green_minutes' => (int) env('ORDER_KITCHEN_GREEN_MINUTES', 3),
    'kitchen_timer_orange_minutes' => (int) env('ORDER_KITCHEN_ORANGE_MINUTES', 6),
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** return تعيد array القيم التالية. في ملف config دي إعدادات يستلمها Laravel وقت تحميل الإعداد؛ في method فهي ناتج يرجع للكود اللي ناداها. مش JSON response إلا لو بنينا response صراحة.

**السطر 4:** PHP array entry: المفتاح `minimum_pickup_prep_minutes` مرتبط بالقيمة `(int) env('ORDER_MIN_PICKUP_PREP_MINUTES', 20)`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 5:** PHP array entry: المفتاح `delivery_fee` مرتبط بالقيمة `(float) env('ORDER_DELIVERY_FEE', 25)`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 6:** PHP array entry: المفتاح `order_promise_minutes` مرتبط بالقيمة `(int) env('ORDER_PROMISE_MINUTES', 3)`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 7:** PHP array entry: المفتاح `kitchen_timer_green_minutes` مرتبط بالقيمة `(int) env('ORDER_KITCHEN_GREEN_MINUTES', 3)`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 8:** PHP array entry: المفتاح `kitchen_timer_orange_minutes` مرتبط بالقيمة `(int) env('ORDER_KITCHEN_ORANGE_MINUTES', 6)`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 9–10

```php
];

```

**السطر 9:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
