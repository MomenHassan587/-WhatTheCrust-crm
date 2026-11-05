# أسئلة وتمارين: لوحة الموظف — طلبات وصلاحيات وتحديث تلقائي

المشروع: **pizza-crm، Laravel + React**. قبل الملف: [الطلبات والـ API](06-routes-controllers-and-server.md) و[الحسابات](04-login-and-roles.md). المصدر: [StaffDashboard.jsx](../resources/js/Pages/StaffDashboard.jsx)، [routes/web.php](../routes/web.php)، [StaffOrderController](../app/Http/Controllers/Api/StaffOrderController.php).

**سؤال البداية:** هل الموظف لازم يعمل refresh علشان يشوف طلب جديد؟ لأ؛ الصفحة الحالية تعمل **polling كل 7 ثوانٍ**، مش اتصال WebSocket. في البناء العادي البيانات من Laravel، وفي الديمو من محاكاة محلية منفصلة، مش مطبخ حقيقي. كل درس مقتطف صغير من نفس الصفحة، مش تعليمات تستبدل الصفحة كلها.

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
3. `setInterval` يطلب تشغيل `loadOrders` كل `7000` مللي ثانية تقريبًا. مرّرنا الدالة نفسها بدون `()` علشان تتنفذ لاحقًا. `refreshTimer` هو معرّف المؤقت، مش بيانات الطلبات.
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
