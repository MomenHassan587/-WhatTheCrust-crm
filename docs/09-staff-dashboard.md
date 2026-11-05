# أسئلة وتمارين: لوحة الموظف — طلبات وصلاحيات وتحديث تلقائي

المشروع: **pizza-crm، Laravel + React**. قبل الملف: [الطلبات والـ API](06-routes-controllers-and-server.md) و[الحسابات](04-login-and-roles.md). المصدر: [StaffDashboard.jsx](../resources/js/Pages/StaffDashboard.jsx)، [routes/web.php](../routes/web.php)، [StaffOrderController](../app/Http/Controllers/Api/StaffOrderController.php).

**سؤال البداية:** هل الموظف لازم يعمل refresh علشان يشوف طلب جديد؟ لأ؛ الصفحة الحالية تعمل **polling كل 7 ثوانٍ**، مش اتصال WebSocket. في البناء العادي البيانات من Laravel، وفي الديمو من محاكاة محلية منفصلة، مش مطبخ حقيقي. كل درس مقتطف صغير من نفس الصفحة، مش تعليمات تستبدل الصفحة كلها.

## نفهم الأول: setInterval نفسها بتعمل إيه؟

`setInterval` دالة جاهزة بيوفّرها المتصفح، مش دالة كتبناها إحنا ومش جزء من React. وظيفتها **تسجيل تكرار لدالة** على فترات زمنية، لحد ما تلغي التسجيل.

شكل استخدامها:

```js
const timerId = window.setInterval(callback, delay);
```

- `window`: object بيمثّل نافذة المتصفح الحالية.
- `.setInterval`: الوصول للدالة الجاهزة الموجودة عليه.
- `callback`: دالة تبعتها للمتصفح؛ هو اللي هيناديها كل مرة. مش اسم إجباري؛ ممكن تكون loadOrders أو أي دالة مناسبة.
- `delay`: الفترة بين محاولات التنفيذ بالـ milliseconds. كل `1000` مللي ثانية = ثانية؛ `7000` = سبع ثوانٍ.
- **بترجع إيه؟** في المتصفح بترجع رقم يميّز المؤقت المسجّل. خزّنّاه هنا في timerId؛ مش ناتج callback ومش بيانات API. في Node نوع المقبض مختلف، والدرس هنا للمتصفح.
- **بتعمل إيه للبيانات؟** لا تجلب طلبات بنفسها ولا تحفظ بيانات؛ هي بس بتنادي الدالة اللي إنت اديتهالها.
- **أول نداء إمتى؟** بعد فترة الانتظار، مش فور التسجيل. التوقيت تقريبي؛ لو المتصفح مشغول أو التبويب في الخلفية، ممكن يتأخر.

### مثال مستقل تشوفه بعينك

اكتبه مرة واحدة في Console المتصفح، مش في الصفحة الحقيقية. بيقف لوحده بعد 3 مرات:

```js
let count = 0;
function printCount() {
    count = count + 1;
    console.log(count);
    if (count === 3) window.clearInterval(timerId);
}
const timerId = window.setInterval(printCount, 1000);
```

شرح كل سطر:

1. `let count = 0`: عدّاد يبدأ بصفر. استخدمنا let لأننا هنعيد إسناد الرقم.
2. `function printCount()`: تعريف دالة بدون مدخلات. تعريفها وحده مش بيشغّلها.
3. زوّد العداد واحدًا وخزّن الرقم الجديد مكان القديم.
4. `console.log(count)`: دالة جاهزة تطبع القيمة في Console. بترجع undefined؛ هدفها الطباعة، مش إنتاج بيانات.
5. `if` تختبر هل الرقم بقى3؛ `===` مقارنة صارمة. لو آه نلغي المؤقت المحدد بـtimerId.
6. نهاية تعريف الدالة.
7. نسجّل الدالة printCount علشان المتصفح يناديها كل ثانية؛ ونحفظ معرّف المؤقت في timerId. وصول printCount لـtimerId يحصل وقت النداء اللاحق، بعد تعيينه، مش أثناء تعريف الدالة.

**المتوقع:** بعد ثانية تقريبًا يطبع1، ثم2، ثم3، وبعدها يتوقف. مش هيطبع صفر ولا هيطبع1 لحظة التسجيل.

### clearInterval بتعمل إيه بالتحديد؟

```js
window.clearInterval(timerId);
```

- دالة جاهزة من المتصفح لإلغاء **تكرار المؤقت اللي معرّفه timerId**.
- بتاخد معرّف المؤقت، مش اسم callback ولا عدد الثواني.
- بترجع undefined؛ متتوقعش ترجع قائمة طلبات أو true عند الإلغاء.
- مش بتمسح تعريف printCount. تقدر تنادي `printCount()` يدويًا بعدها.
- مش بترجّع count للصفر ومش بتوقف كل مؤقتات الصفحة.
- مش بتلغي كود callback اشتغل بالفعل أو HTTP request بدأ بالفعل؛ بتمنع النداءات المتكررة التالية من المؤقت.

**تجربة قصيرة:** بعد ظهور3 اكتب `printCount()`. المتوقع4 مرة واحدة؛ الدالة لسه موجودة لكن المؤقت متلغي.

### ليه بنبعت اسم الدالة من غير أقواس؟

```js
window.setInterval(printCount, 1000);
```

هنا بتسلّم **الدالة نفسها** علشان تتنفّذ لاحقًا.

```js
printCount();
```

هنا بتطلب **تنفيذ الدالة الآن**. علشان كده `setInterval(printCount(), 1000)` غلط في مثالنا: هيشغّل printCount فورًا، وبعدها يمرّر ناتجها undefined بدل callback المطلوبة. لو جرّبت مؤقتًا إضافيًا احفظ معرّفه وألغِه؛ متتركش تجارب بتشتغل في الخلفية.

### الفرق بينها وبين setTimeout؟

`setTimeout(callback, delay)` ترتّب نداءً واحدًا بعد التأخير، وترجع معرّفًا نلغيه بـclearTimeout. `setInterval` تكرر النداء لحد الإلغاء. الاتنين لا ينتظروا انتهاء Promise ترجعها async callback تلقائيًا؛ طول request ممكن يتجاوز الفترة، ولذلك loadOrders فيها loadingRef تمنع التداخل.

## نربطها دلوقتي بكود المشروع الحقيقي

**المقتطف الفعلي** من StaffDashboard:

```jsx
useEffect(() => {
    loadOrders();
    const refreshTimer = window.setInterval(loadOrders, 7000);
    return () => window.clearInterval(refreshTimer);
}, [loadOrders]);
```

نفهم وظيفة كل أداة قبل حركة السطور:

- **useEffect:** hook من React بتاخد setup function وقائمة dependencies. بعد تركيب المكوّن بتنّفذ setup؛ ولو الاعتمادات اتغيّرت تنظّف القديم وتنفّذ الجديد. عند إزالة المكوّن تنفّذ cleanup الأخيرة. استدعاء useEffect نفسه يرجع undefined؛ الدالة اللي *إنت* بترجّعها من setup هي cleanup، مش بيانات API.
- **loadOrders:** دالة إحنا كاتبينها في نفس الملف، مش React API. وظيفتها جلب الطلبات وتحديث state. لأنها async فاستدعاؤها يرجع Promise؛ تفاصيلها تحت.
- **setInterval:** تسجّل تكرار loadOrders كل7ثوانٍ تقريبًا وترجع timer ID.
- **clearInterval:** تلغي تكرار المعرّف اللي خزّنّاه، من غير إلغاء request بدأت بالفعل.

السطور بالترتيب:

1. `useEffect(() => {` سلّم React دالة إعداد؛ React هتشغّلها في مرحلة effect، مش إنت تناديها كل render يدويًا.
2. `loadOrders()` شغّل جلب البيانات الآن؛ السطر مش بيعمل await للـPromise هنا، لكن loadOrders نفسها فيها try/catch.
3. سجّل جلبًا دوريًا واحفظ timer ID في refreshTimer. الاسم اختيارنا، مش كلمة محجوزة.
4. `return () => ...` **رجّع دالة**، متشغّلهاش الآن. React هتناديها للتنظيف؛ ساعتها clearInterval تستقبل نفس refreshTimer.
5. `[loadOrders]` قائمة الاعتمادات: React تقارن مرجع الدالة بين renders. مش معناها شغّل مرة كل طلب. useCallback تحت هي اللي بتتحكم في ثبات المرجع حسب المستخدم والاختيارات.

تتبّع زمني بعد تشغيل setup:

| الوقت التقريبي | اللي بيحصل |
| --- | --- |
| الآن | loadOrders تتنادى فورًا |
| بعد7ثوانٍ | المؤقت ينادي loadOrders |
| بعد14ثانية | نداء آخر |
| خرجت من الصفحة | React تنادي cleanup؛ لا مزيد من نداءات المؤقت ده |

لو المستخدم مش staff أو فيه request لسه شغالة، نداء loadOrders يخرج من أول شرط؛ نداء الدالة مش ضمان خروج طلب شبكة كل مرة.

## تكملة المثال — loadOrders بتعمل إيه من أولها لآخرها؟

المصدر [StaffDashboard.jsx](../resources/js/Pages/StaffDashboard.jsx). ده **تعريف الدالة الفعلي**، مش دالة جديدة تضيفها فوق القديمة:

```jsx
const loadOrders = useCallback(async () => {
    if (!user || !['staff', 'admin'].includes(user.role) || loadingRef.current) return;
    loadingRef.current = true;
    try {
        const params = new URLSearchParams({ date });
        if (isAdmin && branch) params.set('branch_id', branch);
        const response = await csrfFetch(`/api/staff/orders?${params}`);
        const fresh = response.orders || [];
        if (loadedOnce.current) notify(fresh.filter((order) => order.status === 'new' && !knownIds.current.has(order.id)));
        knownIds.current = new Set(fresh.map((order) => order.id));
        loadedOnce.current = true;
        setOrders(fresh);
        setTiming(response.timing || { green_minutes: 3, orange_minutes: 6 });
        setLastUpdated(new Date());
        setLoadError('');
    } catch (error) {
        setLoadError(error.message || 'Orders could not be refreshed.');
    } finally {
        loadingRef.current = false;
    }
}, [user, isAdmin, branch, date, notify]);
```

المتغيرات اللي الدالة محتاجاها جاية من نفس المكوّن:

- user من useAuth؛ date وbranch من useState لاختيارات الشاشة؛ isAdmin مقارنة لدور المستخدم.
- `loadingRef = useRef(false)` لحالة انشغال الطلب؛ useRef ترجع object فيه current مستمر بين renders، وتعديل current لا يطلب render.
- knownIds ref فيها Set للمعرّفات المعروفة؛ loadedOnce ref تبدأ false.
- setOrders وsetTiming وsetLastUpdated وsetLoadError دوال تحديث useState؛ تخزّن القيمة الجديدة وتطلب تحديث العرض. مش HTTP methods ومش دوال حفظ DB.

شرح السطور:

1. **useCallback** تستقبل function واعتماداتها، وترجع نفس مرجع الدالة لو الاعتمادات لم تتغير. مش بتنفّذ الدالة ومش بتخزّن نتيجة جلب البيانات. async تجعل الدالة ترجع Promise.
2. خروج مبكر: includes تفحص وجود الدور في القائمة وترجع Boolean؛ لو لا مستخدم أو دور غير مسموح أو طلب جارٍ، return توقف الدالة.
3. سجل انشغال الطلب قبل await علشان النداء القادم ما يبدأش طلبًا متداخلًا.
4. بداية try للكود اللي ممكن يفشل.
5. **new URLSearchParams({ date })** يبني object يمثّل query string؛ `{ date }` اختصار `{ date: date }`. مثلًا تاريخ `2026-10-23` يصبح `date=2026-10-23`.
6. **params.set('branch_id', branch)** تضيف/تستبدل قيمة query parameter باسم branch_id؛ ترجع undefined وتعدّل params نفسها. تُنفّذ فقط للمدير لو اختار فرعًا.
7. **csrfFetch(url)** مساعد مشروعنا من ملف آخر؛ يرجع Promise للبيانات بعد تحليل JSON أو يرمي خطأ. `${params}` تحوّل URLSearchParams للنص المناسب عند بناء العنوان.
8. خُد orders من الرد أو قائمة فاضية لو القيمة falsy؛ اسم fresh هنا مش معناه كل الطلبات جديدة فعليًا.
9. بعد أول تحميل فقط، filter تختار الطلبات الجديدة وغير المعروفة؛ has تفحص وجود id في Set وترجع Boolean؛ notify دالة إشعارنا، وتفصيلها تحت.
10. map تحوّل كل طلب إلى id؛ new Set تبني مجموعة فريدة؛ خزّن المجموعة للمقارنة في الطلب القادم.
11. علّم إن أول تحميل اكتمل.
12. حدّث state بالطلبات؛ ده السطر اللي هيؤدي لإعادة عرض الكروت.
13. حدّث إعدادات ألوان الوقت من response أو object افتراضي.
14. new Date() ترجع object بوقت جهاز المستخدم الحالي؛ setter تحفظه علشان تعرض آخر تحديث.
15. امسح خطأ قديم بعد النجاح.
16–17. catch تستقبل الخطأ وتعرض رسالته أو نصًا بديلًا.
18–19. finally ترفع قفل الانشغال بعد النجاح أو الفشل؛ وإلا بعد أول فشل كل النداءات اللاحقة ممكن تخرج من guard.
20–21. نهاية try والدالة وقائمة اعتماد useCallback. لما اعتماد يتغير يُرجع useCallback مرجعًا جديدًا، فيعيد effect إعداد المؤقت.

**بترجع إيه؟** مفيش return بيانات في مسار النجاح؛ نتيجة الـPromise عادة undefined. البيانات مش بتظهر لأنها رجعت من loadOrders، بل لأن setOrders حدّثت state. return المبكرة داخل async كمان تحسم Promise إلى undefined.

## تكملة الملف الآخر — csrfFetch بتجيب البيانات إزاي؟

السطر ده في أعلى StaffDashboard:

```js
import { csrfFetch } from '../lib/api';
```

معناه استورد دالة مصدّرة من [resources/js/lib/api.js](../resources/js/lib/api.js). `../` ارجع من Pages إلى js، ثم ادخل lib. Vite يحل امتداد الملف هنا.

الدالة الأصلية أولها تختبر demo mode: لو مفعّل تستدعي demoFetch من demo/api بدل شبكة Laravel. التدفق التالي للبناء المحلي الحقيقي.

### تجهيز الطلب

**مقتطف فعلي** من helper بعد تجهيز headers:

```js
const response = await fetch(url, {
    credentials: 'same-origin',
    ...options,
    headers,
});
```

- **fetch(url, options):** دالة متصفح ترسل HTTP request، وترجع Promise تحسم إلى Response، مش بيانات الطلبات نفسها. فشل شبكة يرفض Promise، لكن 403/500 لا يرفضانها تلقائيًا.
- url هو العنوان اللي loadOrders بعته؛ options مثل method وbody؛ في جلب القائمة مفيش method ممررة فـfetch تستخدم GET.
- credentials تسمح بكوكيز same-origin علشان Laravel تتعرّف على الجلسة؛ ده مش رقم الموظف المرسل في body.
- `...options` تنسخ الإعدادات؛ headers اختصار `headers: headers`، والـobject اتجهّز بالفعل بـAccept وX-Requested-With وCSRF عند وجوده. وجود CSRF header لا يمنح role.
- await تنتظر Response؛ قبل تحليلها ماينفعش نفترض `response.orders` موجودة.

### تحويل الرد إلى بيانات JavaScript

**مقتطف فعلي** من نفس helper:

```js
const contentType = response.headers.get('content-type') || '';
const isJson = contentType.includes('application/json');
const payload = isJson ? await response.json() : null;
```

1. **headers.get(name)** method على Headers object؛ ترجع قيمة header كنص أو null لو مش موجود. `|| ''` يضمن نصًا نقدر نستدعي includes عليه.
2. **String.includes(text)** تبحث عن نص داخل نص، وترجع true/false؛ هنا نفحص نوع الاستجابة.
3. **response.json()** تقرأ body مرة وتحلّل JSON، وترجع Promise لقيمة JavaScript؛ ممكن التحليل يفشل لو المحتوى مش JSON صالح. المتغير payload هو البيانات الفعلية.

### لو السيرفر رفض الطلب

**مقتطف فعلي** من آخر helper:

```js
if (!response.ok) {
    const message = payload?.message || 'Something went wrong. Please try again.';
    const error = new Error(message);
    error.payload = payload;
    throw error;
}
return payload;
```

1. ok **خاصية Boolean**، مش method؛ true لحالات HTTP من200 إلى299.
2. اقرأ رسالة السيرفر لو موجودة، أو بديل.
3. **new Error(message)** تنشئ object خطأ؛ لا ترميه بمجرد الإنشاء.
4. خزّن تفاصيل رد السيرفر كخاصية إضافية على الخطأ.
5. throw ترميه؛ تتوقف helper وتُرفض Promise، فيمسكه catch داخل loadOrders.
6–7. لو مفيش خطأ، ارجع payload؛ await في loadOrders يستقبل الـobject ده باسم response.

**انتبه للأسماء:** response داخل helper هي Response متصفح. response داخل loadOrders هي بيانات JSON اللي رجعتها helper. نفس الاسم لا يعني نفس نوع القيمة!

## تكملة السيرفر — الـURL راح لمين؟

**مقتطف فعلي** داخل prefix api في [routes/web.php](../routes/web.php):

```php
Route::middleware(['auth', 'role:staff,admin'])->prefix('staff')->group(function () {
    Route::get('/orders', [StaffOrderController::class, 'index']);
    Route::get('/orders/{order}', [StaffOrderController::class, 'show']);
    Route::patch('/orders/{order}/status', [StaffOrderController::class, 'updateStatus']);
});
```

- middleware تسجل فحوص الوصول؛ auth يحدد المستخدم من الجلسة وrole يفحص الدور والحساب والفرع وفق الكود.
- prefix يضيف staff للعنوان؛ group تجمع المسارات؛ دول methods لبناء تعريفات routes، مش استعلامات DB.
- get تسجل route لقراءة الطلبات: مع prefix الخارجي العنوان GET `/api/staff/orders` ينادي index.
- `StaffOrderController::class` اسم class؛ `'index'` اسم method، مش نداء فوري لها وقت تعريف route.
- show لمسار طلب واحد؛ patch لتغيير الحالة. جلب القائمة الحالي لا ينادي أيًّا منهما.

### index بتقرأ قاعدة البيانات

في [StaffOrderController.php](../app/Http/Controllers/Api/StaffOrderController.php)، Laravel أولًا يتحقق من query parameters باستخدام validate، ثم يبني الاستعلام التالي. **مقتطف فعلي**:

```php
$user = $request->user();
$orders = Order::query()
    ->with(['branch', 'user', 'items.menuItem', 'statusLogs.user'])
    ->when(! $user->isAdmin(), fn ($query) => $query->where('branch_id', $user->branch_id))
    ->where('status', '!=', Order::STATUS_PAYMENT_PENDING)
    ->where(fn ($query) => $query->where('payment_method', 'cash')->orWhere('payment_status', 'paid'))
    ->when($request->status, fn ($query, $status) => $query->where('status', $status))
    ->when($user->isAdmin() && $request->branch_id, fn ($query) => $query->where('branch_id', $request->branch_id))
    ->when($request->date, fn ($query, $date) => $query->whereDate('created_at', $date))
    ->latest()
    ->get();
```

1. **request->user()** ترجع المستخدم الحالي أو null؛ هنا route auth ضمنت دخوله، مش قيمة زائر يختارها من الفرونت.
2. **Order::query()** ترجع Eloquent Builder علشان تبني استعلامًا؛ مش قائمة الطلبات بعد.
3. **with([...])** تسجل تحميل العلاقات المطلوبة مع النتائج؛ ما بتغيّرش دور المستخدم. بعض العلاقات المتداخلة تتطلب queries إضافية منظّمة بدل query لكل كارت.
4. **isAdmin()** دالة model عندنا ترجع Boolean؛ **when(condition, callback)** تضيف callback للاستعلام لو الشرط متحقق. للموظف **where(column, value)** تقيد الفرع بفرع حسابه.
5. **where(column, operator, value)** تستبعد payment_pending؛ شرط إضافي للفلترة، مش تعديل حالة.
6. where بدالة تجمع شرطين داخل مجموعة: cash **أو** paid. **orWhere** تضيف OR داخل المجموعة علشان كارت غير مدفوع ما يظهرش كطلب جاهز للمطبخ.
7. فلتر status اختياري لو جاي من الطلب.
8. فلتر الفرع اللي اختاره المدير فقط؛ الموظف لا يملك تجاوز قيد فرعه بإرسال branch_id.
9. **whereDate(column, value)** تقارن جزء التاريخ من created_at بالتاريخ المطلوب.
10. **latest()** ترتّب بالأحدث حسب created_at افتراضيًا؛ لسه بنبني query.
11. **get()** تنفّذ القراءة وترجع Eloquent Collection من الطلبات، ومعها العلاقات المحددة.

الـmethods اللي بتبني شروط query غالبًا ترجع builder علشان نكمّل chain. get هي خطوة جلب البيانات هنا. الـvalidation والقواعد والصلاحيات جزء من المسار، مش حاجات المتصفح يقدر يحل محلها.

السيرفر بعدها يرجع response JSON فيها orders وtiming. **مثال توضيحي لشكل رد، مش بيانات عملاء فعلية**:

```json
{
  "orders": [{ "id": 12, "status": "new", "items": [] }],
  "timing": { "green_minutes": 3, "orange_minutes": 6 }
}
```

`response()->json(...)` تبني JsonResponse مع تحويل بيانات models/collections لصيغة JSON وفق إعدادات serialization؛ ترجع استجابة HTTP، مش JavaScript object عابر بين PHP وReact. المتصفح بعد كده يحلّل النص بـjson(). المثال مختصر؛ الرد الحقيقي يحتوي تفاصيل أكتر وعلاقات.

## آخر الرحلة — setOrders تحوّل البيانات لكروت إزاي؟

في StaffDashboard القائمة معرفة كده:

```jsx
const [orders, setOrders] = useState([]);
```

useState ترجع زوجًا: القيمة الحالية ودالة تحديثها. بدأت array فاضية. عند `setOrders(fresh)` React تسجّل تحديثًا وتعمل render جديد؛ المتغير في التنفيذ الحالي مش بيتبدّل لحظيًا.

**مثال مبسّط من عرض الصفحة** يوضّح الحلقة الأخيرة؛ الأصل يقسّم الطلبات لأعمدة ويمرّر props إضافية:

```jsx
{orders.map((order) => (
    <OrderCard key={order.id} order={order} />
))}
```

- map ترجع array من عناصر React، عنصر لكل طلب.
- OrderCard مكوّن معرف في **نفس StaffDashboard.jsx**؛ مش ملف محتاج تدور عليه.
- key هوية React للعنصر، وorder prop بيانات الطلب اللي يستقبلها المكوّن.
- المثال مش بديل مباشر لسطر العرض الأصلي لأن OrderCard الفعلية محتاجة props مثل timing وnow وhandlers.

**مقتطف فعلي من داخل OrderCard** يبين بيانات وصلت لواجهة المستخدم:

```jsx
<h3>{order.customer_name || order.user?.name || 'Guest order'}</h3>
```

يعرض اسم العميل أو اسم حسابه أو نصًا بديلًا. ده آخر أثر مرئي لرحلة المؤقت: مش setInterval اللي بترسم الاسم، هي بتنادي دالة تجلب بيانات، والدالة تعمل setOrders، وReact ترسم المكوّن بالبيانات الجديدة.

### notify اللي ظهرت في loadOrders: دي بتكمل إيه؟

دي دالة مخصّصة في نفس الملف، مش browser notification جاهزة. بتاخد array الطلبات الجديدة فقط؛ لو فاضية تخرج. مفيش return بيانات على مسارها المعتاد، وuseCallback ترجع مرجع الدالة. أول جزء فعلي:

```jsx
if (!newOrders.length) return;
setMessage(`${newOrders.length} new order${newOrders.length > 1 ? 's' : ''} received.`);
setHighlighted(newOrders.map((order) => order.id));
window.setTimeout(() => setHighlighted([]), 3600);
```

1. length خاصية عدد العناصر، مش method؛ لو صفر نخرج بدون إشعار.
2. setter تغيّر رسالة الشاشة. `${}` إدخال قيمة داخل template literal، والـternary يضيف s للجمع.
3. map تستخرج IDs؛ setter تحفظها لتظليل الكروت المطابقة.
4. setTimeout تسجل نداءً واحدًا بعد3.6ثانية لمسح التظليل. callback setter ترجع undefined؛ setTimeout نفسها ترجع timer ID لكن الأصل لا يخزّنه هنا.

الكود بعدها يصدر صوتًا فقط لو المستخدم فعّله وaudioContext موجودة. للتتبّع الكامل، ده **المقطع الفعلي**:

```js
if (!muted && audioContext.current) {
    const oscillator = audioContext.current.createOscillator();
    const gain = audioContext.current.createGain();
    oscillator.frequency.value = 760;
    gain.gain.setValueAtTime(0.1, audioContext.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + 0.18);
    oscillator.connect(gain).connect(audioContext.current.destination);
    oscillator.start();
    oscillator.stop(audioContext.current.currentTime + 0.18);
}
```

- createOscillator() ترجع OscillatorNode لتوليد نغمة؛ createGain() ترجع GainNode للتحكم في مستواها. إنشاء النود مش تشغيل الصوت بعد.
- frequency.value تحدد تردد760Hz؛ دي خاصية، مش method.
- setValueAtTime(value, time) تضبط قيمة AudioParam في توقيت AudioContext؛ هنا مستوى0.1 الآن. exponentialRampToValueAtTime(value, endTime) ترتّب خفضًا تدريجيًا موجبًا إلى0.001 بعد0.18ثانية. الاتنين يرجعوا AudioParam؛ مش timer IDs.
- connect(destinationNode) توصل عقد الصوت؛ overload المستخدم يرجع العقدة الهدف، فيسمح بتوصيل gain بعدها لمخرج الصوت. مفيش طلب HTTP هنا.
- start() تبدأ مصدر الصوت؛ stop(when) تحدد إيقافه بتوقيت audio clock. يرجعوا undefined، والأوقات هنا بالثواني، مش milliseconds بتاعة setInterval.
- audioContext.current بتتجهّز عند ضغط المستخدم toggleSound في نفس الملف عبر AudioContext وresume()؛ الأخيرة ترجع Promise لاكتمال الاستئناف. البداية muted، لذلك جلب الطلبات لا يحتاج صوتًا علشان يعمل.

الكود الحالي لا يحتفظ بمعرّف timeout للتظليل، وبالتالي cleanup الخاصة بالـinterval لا تلغيها. دي حدود بنفهمها، مش بندّعي إن تنظيف واحد يشمل كل شغل الصفحة.

### تكملة تفعيل الصوت: مين أنشأ audioContext؟

علشان ميبقاش فيه اسم ظهر وسِبناه من غير مصدر: ref اسمها audioContext تبدأ null في StaffDashboard. الدالة التالية **فعلية من نفس الملف**، وبتتنادى من زر الصوت:

```js
const toggleSound = async () => {
    const nextMuted = !muted;
    if (!nextMuted) {
        if (!audioContext.current) audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
        await audioContext.current.resume();
    }
    setMuted(nextMuted);
    localStorage.setItem('wtc-staff-muted', nextMuted ? '1' : '0');
};
```

1. تعريف دالة async؛ مفيش arguments، وترجع Promise تحسم عادة إلى undefined.
2. اعكس كتم الصوت الحالي وخزّن القرار الجديد.
3. لو القرار الجديد مش muted، جهّز تشغيل الصوت.
4. لو مفيش AudioContext بعد، أنشئها مرة. AudioContext constructor من المتصفح ينشئ بيئة معالجة صوت؛ الاسم البديل webkitAudioContext للتوافق حيث يوجد. `new (...)()` هنا إنشاء object، مش دالة المشروع.
5. resume() method على AudioContext ترجع Promise لاكتمال استئنافها. await تنتظرها قبل حفظ حالة التفعيل. الكود الحالي مفيهوش catch داخل toggleSound لو إنشاء/استئناف الصوت فشل؛ ده حدّ موجود مش معالجة كاملة بنفترضها.
6. نهاية شرط التجهيز.
7. setter تحدث state؛ كلمة muted على الشاشة تعتمد على render الجديد.
8. setItem(key, value) تكتب نصًا في تخزين المتصفح، وترجع undefined. `'1'` تفضيل الكتم، و`'0'` تفعيله؛ مش ملف صوت ومش إعداد مشترك بين كل الموظفين.
9. نهاية الدالة.

الزر الفعلي يربطها بـ `onClick={toggleSound}`؛ بعد ضغط المستخدم وتفعيل الصوت، نداء notify اللاحق يقدر يستخدم audioContext. تفعيل الصوت نفسه لا ينشئ طلب مطعم جديد ولا يغيّر polling.

## جرّب رحلة واحدة من غير ما تضيف كود للصفحة

1. على نسخة Laravel المحلية وبحساب staff تجريبي، افتح Network وفلتر `staff/orders`.
2. افتح الصفحة: تابع الطلب الأول، عنوانه، ورد JSON فيه orders.
3. انتظر7ثوانٍ تقريبًا: تابع الطلب الدوري. لو request قديمة لسه شغالة loadingRef تمنع التداخل.
4. افتح React DevTools لو متاح، أو راقب الكروت: البيانات الجديدة جاية من setOrders.
5. انتقل لصفحة أخرى: النـداءات الدورية الجديدة تتوقف بعد cleanup. طلب بدأ بالفعل قد يكمل.

الديمو على Cloudflare لا يستخدم Laravel في الرحلة دي: csrfFetch تنادي demoFetch داخل المتصفح. لذلك Network مش هتثبت backend في نسخة العرض، حتى لو المؤقت وتحديث state شغالين.

**الخلاصة اللي تقولها بنفسك:** setInterval تسجّل التكرار وترجع معرّفه؛ loadOrders تجمع query وتستدعي helper؛ helper تنفّذ GET وتحلّل JSON؛ Laravel تتحقق وتقرأ DB وترجع JSON؛ setOrders تحدّث الواجهة؛ clearInterval تلغي التكرار عند الخروج.

## 1. سؤال: إخفاء الصفحة عن العميل كفاية لحمايتها؟

**مقتطف فعلي** داخل دالة `loadOrders`:

```js
if (!user || !['staff', 'admin'].includes(user.role) || loadingRef.current) return;
loadingRef.current = true;
```

1. `if` شرط للخروج المبكر. `!user` يعني لا يوجد مستخدم. `||` معناها «أو»: أي حالة من الحالات تكفي للخروج. `['staff', 'admin']` قائمة الأدوار المسموحة، و`includes(user.role)` تختبر هل الدور موجود. `!` قبلها يعكس الإجابة؛ لو مش مسموح، نخرج. آخر جزء يمنع بدء طلب جديد لو السابق لسه شغال. `return` هنا يوقف الدالة بدون قيمة.
2. نسجل إن فيه طلب بدأ. `loadingRef` معمولة بـ `useRef(false)`؛ تغيير `.current` لا يطلب إعادة رسم الشاشة. ده قفل محلي للطلب، مش حماية سيرفر.

**مقتطف فعلي** من تعريف مجموعة الروتات:

```php
Route::middleware(['auth', 'role:staff,admin'])->prefix('staff')->group(function () {
```

ده **سطر افتتاح مجموعة** في `routes/web.php`، مش كود كامل للصق: `auth` يطلب جلسة مستخدم، و`role:staff,admin` يفحص الدور، و`prefix('staff')` يضيف جزء المسار. المجموعة جوه prefix اسمه `api`، فـ endpoint الطلبات `/api/staff/orders`. الكنترولر كمان يحدد طلبات فرع الموظف، مش أي فرع من الواجهة.

**تطبيق يدوي:** اقرأ الشرط وبدّل الدور في بيانات object تدريبية بالـ Console، مش في قاعدة المستخدمين. بعد كده افتح `/staff` بحساب عميل تجريبي: المتوقع «Access restricted». وفي Laravel الحقيقي طلب API غير مصرح لازم يتمنع على السيرفر حتى لو حد تجاوز الواجهة.

**غلطة شائعة:** اعتبار كلاس hidden أو شرط React authorization. المستخدم يقدر يرسل HTTP request من غير أزرار أصلًا.

<details><summary>سؤال إنترفيو: Authentication غير Authorization في إيه؟</summary>

الأولى «إنت مين؟» بجلسة أو وسيلة مصادقة. الثانية «مسموح لك تعمل إيه وعلى أنهي مورد؟». دور الموظف لا يسمح له تلقائيًا بطلبات فروع أخرى. فحص الواجهة لتحسين التجربة، والسيرفر هو صاحب القرار الأمني.

</details>

## 2. سؤال: ليه لازم ننضّف مؤقت التحديث؟

**مقتطف فعلي** داخل `StaffDashboard`:

```jsx
useEffect(() => {
    loadOrders();
    const refreshTimer = window.setInterval(loadOrders, 7000);
    return () => window.clearInterval(refreshTimer);
}, [loadOrders]);
```

**كل سطر:**

1. `useEffect` يشغّل side effect بعد ظهور المكوّن؛ `() => {}` الدالة اللي React هيناديها.
2. نجيب البيانات فورًا بدل انتظار أول سبع ثوانٍ؛ وجود `()` يعني تنفيذ الآن.
3. `setInterval(loadOrders, 7000)` تسجّل تكرارًا: المتصفح ينادي الدالة بعد7ثوانٍ تقريبًا ثم يكررها بنفس الفترة. بترجع معرّفًا رقميًا للمؤقت خزّناه في `refreshTimer`، مش بيانات الطلبات. مرّرنا الدالة نفسها بدون `()`؛ جلب البيانات الفوري حصل بالسطر السابق، مش من setInterval.
4. `return () => ...` بيرجّع دالة تنظيف. React يناديها قبل إعادة تشغيل الـ effect بسبب اعتماد تغير، وعند إزالة المكوّن. `clearInterval` يوقف هذا المؤقت بالتحديد.
5. `[loadOrders]` اعتماد effect. الدالة الأصلية معمولة بـ `useCallback` وتعتمد على المستخدم والفرع والتاريخ؛ لو تغيروا، المؤقت القديم يتنضف ونبدأ تحديثًا بالاختيارات الجديدة.

**التطبيق اليدوي:** ما تضيفش interval ثانية في الصفحة الحقيقية. راقب Network بعد فتح `/staff`: طلب فوري، وبعده تحديثات تقريبًا كل 7 ثوانٍ. انتقل للمنيو؛ المتوقع إن طلبات Staff تتوقف بعد إزالة الصفحة. في وضع React StrictMode أثناء التطوير ممكن تشوف دورة إعداد وتنظيف إضافية؛ ده يكشف التنظيف الناقص، مش سبب نحذف cleanup.

**غلطة شائعة:** `setInterval(loadOrders(), 7000)`؛ هنا بتنادي الدالة فورًا وتمرر ناتجها بدل الدالة.

حدود الكود: إيقاف interval لا يلغي HTTP request بدأ بالفعل. `loadingRef` يمنع تداخل طلبين، لكن إلغاء الشبكة يحتاج AbortController وتنفيذًا إضافيًا، مش موجود في المقتطف.

<details><summary>سؤال إنترفيو: ده real-time؟</summary>

هو polling؛ التغيير ممكن يتأخر لحد التحديث التالي. WebSocket أو SSE طرق أخرى لدفع التحديث من السيرفر، لكن متدّعيش إن الواجهة الحالية تستخدمهم. المؤقت هو اللي بيرسل الطلبات هنا.

</details>

## 3. سؤال: إزاي أعرف الطلب جديد من غير إعلان كل الطلبات القديمة؟

**مقتطف فعلي** من `loadOrders`، بعد استلام الرد:

```js
const fresh = response.orders || [];
if (loadedOnce.current) notify(fresh.filter((order) => order.status === 'new' && !knownIds.current.has(order.id)));
knownIds.current = new Set(fresh.map((order) => order.id));
loadedOnce.current = true;
setOrders(fresh);
```

السطر الأول يأخذ الطلبات أو قائمة فاضية. `fresh` مجرد اسم «النسخة الجديدة من الرد»، مش معنى إن كل عناصرها وصلت حالًا.

السطر الثاني لا ينادي `notify` في أول تحميل؛ `loadedOnce.current` تبدأ بـ false. بعد أول تحميل نستخدم `filter` لاختيار الطلبات اللي حالتها `new` وID بتاعها مش موجود في المجموعة القديمة. `&&` يشترط الاتنين. `has` تختبر وجود المعرّف، و`!` يعكس النتيجة. `notify` يعرض رسالة ويحدد IDs للتظليل؛ الصوت يتطلب تفعيل المستخدم بسبب قيود المتصفح.

السطر الثالث يعمل `map` لاستخراج IDs، ثم `new Set` يبني مجموعة بدون تكرارات. نخزنها في ref علشان المقارنة في الرد القادم. الرابع يسجل اكتمال أول تحميل. الخامس يحدّث React state بالطلبات؛ ده اللي يعيد رسم الكروت، على عكس تحديث refs.

**تطبيق يدوي — مثال تدريبي إضافي في Console:**

```js
const known = new Set([10, 11]);
const fresh = [{ id: 11 }, { id: 12 }];
console.log(fresh.filter((order) => !known.has(order.id)));
```

الأول IDs معروفة، الثاني الرد الجديد، الثالث يستبعد المعروفة. **المتوقع:** array فيها `{ id: 12 }` فقط. في المشروع فيه شرط الحالة كمان، وتتصفّر ذاكرة المقارنة عند تغيير الفرع أو التاريخ.

**غلطة شائعة:** تحديث `knownIds` قبل المقارنة؛ كده كل IDs الرد بقت معروفة ومش هتكتشف جديد.

<details><summary>سؤال إنترفيو: useRef ولا useState؟</summary>

استخدم state لبيانات لازم تغييرها يظهر على الشاشة، وref لقيمة تستمر بين renders من غير ما تغييرها يسبب render، زي IDs المعروفة أو معرّف مؤقت. الـ ref مش بديل أسرع تلقائيًا لكل state.

</details>

## 4. سؤال: إزاي أغيّر حالة الطلب وأمنع تضارب موظفين؟

**مقتطف فعلي** من `updateStatus`، داخل `try`:

```jsx
const response = await csrfFetch(`/api/staff/orders/${order.id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, reason, expected_status: order.status }),
});
setOrders((current) => current.map((item) => item.id === order.id ? response.order : item));
setMessage(response.message);
setReasonAction(null);
```

1. نرسل طلبًا ونستنى الرد. backticks تعمل template literal؛ `${order.id}` تضع ID في URL. `order` و`status` و`reason` مدخلات الدالة الأصلية.
2. `PATCH` معناها تحديث جزئي لمورد.
3. `JSON.stringify` يحوّل البيانات لنص JSON. `{ status, reason }` اختصار `{ status: status, reason: reason }`. `expected_status` هي الحالة اللي الموظف شافها قبل الضغط.
4. إغلاق options واستدعاء الطلب.
5. functional setter يستقبل أحدث قائمة `current`. `map` تستبدل الطلب المطابق بالنسخة اللي رجعها السيرفر؛ الباقي كما هو. مش بنفترض إن تغيير اللون محليًا معناه نجاح السيرفر.
6. عرض رسالة الرد.
7. إغلاق اختيار سبب الإلغاء/الرفض باستخدام `null`.

**ليه expected_status؟** لو موظف تاني نقل الطلب بعد ما شفته، السيرفر الحقيقي يقارن الحالة داخل transaction مع قفل الصف. لو اختلفت يرجع `409`، والواجهة تعيد جلب الطلبات. الـ backend كمان يفحص الانتقالات المسموحة وسبب الإلغاء؛ مش أي status في الواجهة تبقى مقبولة.

**تطبيق:** بحسابات تجريبية وطلبات وهمية فقط، جرّب نقل طلب `preparing` إلى `ready`. المتوقع الكارت ينتقل لعمود Ready بعد النجاح. لو بتختبر ديمو Cloudflare، دي محاكاة محلية وليست دليلًا على اختبار قفل قاعدة البيانات.

**غلطة شائعة:** تغيير الحالة محليًا وإهمال response أو catch؛ الموظف يظن الطلب اتقبل بينما السيرفر رفضه. الكود الحالي يعرض الخطأ ويمسح busy state في `finally`.

<details><summary>سؤال إنترفيو: UI تمنع الضغط مرتين، هل كده منعنا كل race conditions؟</summary>

لأ، فيه تبويبات وأجهزة وموظفين غيرك. منع التكرار في الواجهة يحسن التجربة، لكن backend لازم يتحقق من الحالة والصلاحية ويستخدم transaction/locking حسب العملية. في المشروع `expected_status` يكشف إن البطاقة قديمة.

</details>

**حدود لازم تعرفها:** `today()` الحالية تستخدم `toISOString()`، يعني UTC وقد تختلف عن اليوم المحلي قرب منتصف الليل. مؤقت تظليل الطلب داخل `notify` ليس له cleanup مستقل حاليًا؛ تنظيف polling لا ينظف كل timeout تلقائيًا. دي نقاط تحسين، مش مزايا مكتملة.
