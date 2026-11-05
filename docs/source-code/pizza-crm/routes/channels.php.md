# مين مسموح له يشترك في قنوات الطلبات

[فهرس كل الأكواد](../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `routes/channels.php` · 9 سطر.

**وظيفة الملف:** admin channel للإدمن النشط فقط، وفرع channel للإدمن النشط أو موظف نشط صاحب نفس branchId. دي authorization للاشتراك مش نفس تعريف event ولا مجرد إخفاء عنصر UI.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../routes/channels.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('staff.admin', fn ($user) => $user->isAdmin() && $user->is_active);
Broadcast::channel('staff.branch.{branchId}', fn ($user, int $branchId) => $user->is_active && (
    $user->isAdmin() || ($user->role === 'staff' && (int) $user->branch_id === $branchId)
));
```

</details>

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### Broadcast::channel

- **جاية منين؟** Laravel Broadcast

- **وظيفتها:** تسجّل callback لتفويض قناة.

- **المدخلات — Arguments:** channel pattern وcallback.

- **الناتج/الأثر — Return / effect:** تعريف تفويض؛ لا يصل WebSocket بالمتصفح وحده.

- **أول موضع هنا:** السطر 6.

### $user->isAdmin

- **جاية منين؟** دالة مخصّصة معرّفة في المشروع

- **وظيفتها:** هل role بالضبط admin؟

- **المدخلات — Arguments:** role الحالية.

- **الناتج/الأثر — Return / effect:** bool.

- **أول موضع هنا:** السطر 7.

- **تكملة التعريف:** [app/Models/User.php](../app/Models/User.php.md)، عند السطر 56.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('staff.admin', fn ($user) => $user->isAdmin() && $user->is_active);
Broadcast::channel('staff.branch.{branchId}', fn ($user, int $branchId) => $user->is_active && (
    $user->isAdmin() || ($user->role === 'staff' && (int) $user->branch_id === $branchId)
));
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** use / استيراد الاسم `Illuminate\Support\Facades\Broadcast` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 5:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `Broadcast::channel(...)`: تسجّل callback لتفويض قناة. مدخلاتها: channel pattern وcallback. العائد/الأثر: تعريف تفويض؛ لا يصل WebSocket بالمتصفح وحده.؛ `$user->isAdmin(...)`: هل role بالضبط admin؟ مدخلاتها: role الحالية. العائد/الأثر: bool.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 6:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `Broadcast::channel(...)`: تسجّل callback لتفويض قناة. مدخلاتها: channel pattern وcallback. العائد/الأثر: تعريف تفويض؛ لا يصل WebSocket بالمتصفح وحده.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 7:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$user->isAdmin(...)`: هل role بالضبط admin؟ مدخلاتها: role الحالية. العائد/الأثر: bool.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 8:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
