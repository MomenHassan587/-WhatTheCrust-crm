# 04 — أسئلة وأمثلة: تسجيل الدخول والصلاحيات

خد سؤال واحد بس في كل مرة: اكتب الكود بإيدك، اشرح السطور بصوتك، وبعدها افتح إجابة الإنترفيو. الأمثلة مقتطفات للتعلّم؛ متستبدلش بيها الملفات الكاملة.

الشرح هنا لنسخة Pizza CRM اللي بتشتغل بـ Laravel. لو `VITE_DEMO_MODE` مفعّل، [csrfFetch](../resources/js/lib/api.js) بيحوّل الطلبات لمحاكاة في المتصفح؛ نجاح تسجيل الدخول في الديمو مش دليل على تشغيل السيرفر أو أمانه. AutoCare الحالي ديمو متصفح من غير نظام دخول backend مماثل.

## 1. ليه طلب تسجيل الدخول محتاج CSRF token وكوكيز؟

**مثال مبسّط من** [resources/js/lib/api.js](../resources/js/lib/api.js). اكتبه في ورقة أو ملف تدريب؛ مش بديل للدالة الأصلية، اللي كمان بتعالج الأخطاء وJSON وFormData.

```js
const token = document.querySelector('meta[name="csrf-token"]')?.content;
const response = await fetch('/api/auth/login', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': token,
    },
    body: JSON.stringify(credentials),
});
```

**كل سطر بيعمل إيه؟**

- `const token`: متغير لقيمة الرمز. `document.querySelector(...)` يجيب عنصر الـ meta، و`?.content` يقرأ قيمته لو العنصر موجود؛ مش هو رمز تسجيل الدخول.
- `const response = await fetch(...)`: ابعت HTTP request واستنى الرد. `await` لازم يكون داخل دالة `async` أو بيئة تدعم top-level await. `credentials` في آخر المثال object موجود مسبقًا فيه email وpassword.
- `method: 'POST'`: العملية بتغيّر حالة تسجيل الدخول، مش مجرد قراءة.
- `credentials: 'same-origin'`: اسم إعداد fetch، مش object بيانات الدخول؛ يسمح بإرسال كوكيز نفس الموقع. ده أصلًا default fetch المعتاد، وكتابته هنا توضيح للقصد.
- `headers: { ... }`: معلومات عن الطلب. `Accept` يطلب رد JSON؛ `Content-Type` يصف الجسم المرسل.
- `'X-CSRF-TOKEN': token`: ابعت الرمز اللي Laravel ولّده للصفحة. دوره مقاومة CSRF، مش إثبات إن المستخدم admin.
- `body: JSON.stringify(credentials)`: حوّل object بيانات الدخول لنص JSON. `});` يقفل إعدادات fetch وينهي التعليمة.

**نفّذ بإيدك:** افتح Network في أدوات المتصفح وسجّل الدخول بحساب تجريبي محلي. شوف Method وRequest Headers من غير ما تنسخ كلمة السر أو الكوكيز في ملفات المذاكرة.

**المتوقع:** POST للـ endpoint، CSRF header، وبعد النجاح session cookie يعرّف المتصفح عند الطلبات التالية. عدم وجود token صحيح ممكن ينتج عنه 419؛ الـ helper الأصلي بيحدّث الرمز لما السيرفر يرجّع رمزًا جديدًا.

**غلطة شائعة:** تفتكر CSRF token بديل لكلمة السر أو تتوقع إن الكوكي تحتوي على كلمة السر. كمان `fetch` مش بيرمي خطأ تلقائيًا لكل 401/422؛ لازم فحص `response.ok` كما في الـ helper الأصلي.

<details>
<summary>سؤال إنترفيو: هل CSRF وAuthentication نفس الحاجة؟</summary>

لأ. Authentication يحدد مين المستخدم. CSRF protection بيحاول يمنع موقعًا آخر من تنفيذ عمليات باستخدام جلسة المستخدم من غير قصده. الـ session cookie والـ CSRF token لكل واحد دور مختلف.

</details>

## 2. إزاي Laravel يتأكد من الباسورد ويبدأ جلسة آمنة؟

**مثال مبسّط من** [AuthController.php](../app/Http/Controllers/Api/AuthController.php). المقطع داخل `login`؛ `$credentials` ناتجة من validation، و`$remember` قيمة Boolean. اختصرنا رسالة الخطأ وفصلنا فحص الحساب المعطّل؛ الملف الأصلي بيعمل الفحص ده كمان.

```php
if (! Auth::attempt($credentials, $remember)) {
    throw ValidationException::withMessages([
        'email' => ['The provided credentials are incorrect.'],
    ]);
}
$request->session()->regenerate();
return response()->json(['user' => $request->user()]);
```

**كل سطر بيعمل إيه؟**

- `if (...)`: نفّذ اللي بين الأقواس المعقوفة لو الشرط صحيح.
- `Auth::attempt(...)`: اطلب من Laravel التحقق من بيانات الدخول باستخدام الـ guard. `::` وصول لدالة على الـ facade، و`$` بداية اسم متغير PHP.
- `!`: اعكس النتيجة؛ ندخل فرع الخطأ لما محاولة الدخول تفشل. Laravel يقارن كلمة السر بالـ hash، مش بمقارنة نصين عاديين منك.
- `throw`: أوقف المسار الحالي وارمِ exception. `ValidationException::withMessages` يجهّز خطأ validation، وعند طلب JSON يكون غالبًا 422.
- `'email' => [...]`: اسم الحقل ورسائله. `=>` تربط المفتاح بالقيمة داخل array PHP.
- `]);` يقفل قائمة الرسائل والاستدعاء، و`}` يقفل شرط الفشل.
- `$request->session()->regenerate()`: بعد النجاح غيّر session ID لتقليل خطر session fixation. `->` وصول لدالة/خاصية على object.
- `return response()->json(...)`: رجّع المستخدم الحالي بصيغة JSON. في الملف الفعلي الرد كمان فيه رسالة وCSRF token جديد وعلاقة الفرع.

المشروع بيستخدم session guard من [config/auth.php](../config/auth.php)، مش JWT ولا Sanctum SPA بمجرد وجود مسار يبدأ بـ `/api`.

**نفّذ بإيدك:** تتبّع فرعين على الورق: باسورد غلط، وباسورد صحيح لحساب فعّال. حدّد هل سطر `regenerate` هيتنفّذ في كل فرع.

**المتوقع:** الغلط يقف عند exception؛ النجاح يكمل ويعيد توليد الجلسة. الكود الفعلي يرفض الحساب غير الفعّال حتى لو كلمة السر صحيحة.

**غلطة شائعة:** تخزّن `user` في React وتعتبر ده تسجيل دخول حقيقي. الحالة دي عرض للواجهة؛ Laravel هو اللي بيثبت هوية الطلبات. عند logout، الأصل بيعمل `logout()` ثم `invalidate()` ثم `regenerateToken()`؛ مسح user من React وحده مش كفاية.

<details>
<summary>سؤال إنترفيو: ليه نغيّر session ID بعد الدخول؟</summary>

علشان مهاجم ما يستغلش session ID قديم يعرفه أو ثبّته قبل تسجيل الدخول. ده دفاع ضد session fixation، مش تشفير للباسورد.

</details>

## 3. الباسورد بيتخزّن إزاي، وليه مش بيرجع في JSON؟

**مثال مبسّط من** [User.php](../app/Models/User.php)، اختصرنا القوائم للخصائص المتعلقة بالسؤال. السطور دي مكانها داخل class الـ model، مش ملف PHP مستقل.

```php
protected $hidden = ['password', 'remember_token'];
protected function casts(): array
{
    return [
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];
}
```

**كل سطر بيعمل إيه؟**

- `protected $hidden`: إعداد داخل model يحدد خصائص لا تُضمّن في التحويل العادي إلى array/JSON. `protected` مستوى الوصول للخاصية، مش تشفير للبيانات.
- `['password', 'remember_token']`: أسماء الأعمدة المطلوب استبعادها. الـ password hash نفسه بيانات حساسة ومش محتاج يرجع للواجهة.
- `protected function casts(): array`: دالة إعدادات اسمها `casts`. الأقواس `()` معناها مفيش arguments هنا، و`: array` نوع القيمة اللي الدالة هترجعها.
- `{`: بداية جسم الدالة.
- `return [`: رجّع array من أسماء الخصائص وطريقة التعامل معاها.
- `'password' => 'hashed'`: لما تسند باسورد جديد من خلال model، Laravel يتعامل مع تخزينه كـ hash. ما تشيلش ده وتكتب الباسورد raw.
- `'is_active' => 'boolean'`: لما تتعامل مع القيمة في model، تحصل على `true/false` بدل اختلاف تمثيل قاعدة البيانات.
- `];` يقفل array وينهي return، و`}` يقفل الدالة.

الـ hidden لا يمنع مطوّرًا من كتابة response يدوي يسرّب القيمة، ولا يمنع تعديلها. وفي نفس الملف `$fillable` يحدد حقول mass assignment المسموحة؛ هو شيء مختلف تمامًا. التسجيل الفعلي يمرّر validated data فيها name/email/password فقط، مش role جاية من العميل.

**نفّذ بإيدك:** اقرأ payload استجابة الدخول في Network على النسخة المحلية. ابحث عن اسم المستخدم وrole، واتأكد إن password وremember_token مش موجودين. ما تطبعش hash حقيقي علشان تثبت الفكرة.

**المتوقع:** بيانات عرض المستخدم موجودة، كلمة السر والـ hash مش ضمن JSON.

**غلطة شائعة:** تفتكر إن `$hidden` يحمي الحقل من التعديل، أو إن `hashed` تشفير تقدر تعكسه علشان ترجع كلمة السر. الـ hash للتحقق، مش للاسترجاع.

<details>
<summary>سؤال إنترفيو: الفرق بين hashing وencryption؟</summary>

Encryption قابل للفك بالمفتاح المناسب. Password hashing مصمم للتحقق من كلمة السر من غير استرجاع أصلها؛ Laravel بيوفر أدوات للمقارنة الآمنة بدل تنفيذها بنفسك.

</details>

## 4. هل إخفاء زر Staff من الواجهة يعتبر صلاحيات؟

لأ. **مقتطف فعلي** من [RequireRole.php](../app/Http/Middleware/RequireRole.php). الـ middleware متسجل باسم `role` في [bootstrap/app.php](../bootstrap/app.php).

```php
public function handle(Request $request, Closure $next, string ...$roles): Response
{
    $user = $request->user();
    abort_unless($user && $user->is_active && in_array($user->role, $roles, true), 403);
    abort_if($user->role === 'staff' && ! $user->branch_id, 403, 'This staff account is not assigned to a branch.');

    return $next($request);
}
```

**كل سطر بيعمل إيه؟**

- `public function handle`: نقطة معالجة الـ middleware. `public` يسمح باستدعائها من Laravel.
- `Request $request`: object الطلب؛ `Closure $next` الدالة اللي تكمل المعالجة؛ `string ...$roles` تجمع بقية الـ role arguments في array. `: Response` نوع الرد المتوقع.
- `$user = $request->user()`: هات المستخدم الحالي من الجلسة، مش من body أرسله الزائر.
- `abort_unless(..., 403)`: أوقف الطلب إلا لو الشرط متحقق. `&&` معناها لازم كل الشروط صح. التقييم يقف لو مفيش user بدل محاولة قراءة خصائص null.
- `$user->is_active`: الحساب لازم يكون فعّالًا. `in_array(..., true)` يتأكد إن الدور ضمن الأدوار المسموحة بمقارنة صارمة للنوع.
- `abort_if(...)`: الموظف اللي ملوش فرع مربوط بيه يتمنع. `===` مقارنة صارمة، و`!` معناها عدم وجود قيمة branch صالحة هنا.
- `return $next($request)`: لو الشروط نجحت، كمّل إلى المعالجة التالية. القوس الأخير يقفل الدالة.

مسارات الموظفين تجمع `auth` مع `role:staff,admin`، ومسارات الإدارة تستخدم `role:admin`. إخفاء زر في React تحسين للواجهة، مش حماية endpoint.

**نفّذ بإيدك:** اكتب نتائج ثلاثة أمثلة على الورق: customer فعّال؛ staff فعّال له فرع؛ staff فعّال من غير فرع. افترض قائمة الأدوار staff/admin.

**المتوقع:** الأول 403، الثاني يكمل، الثالث 403. الزائر أصلًا بيتوقف عند auth middleware قبل ده في مجموعة الموظفين.

**غلطة شائعة:** تبعت role من المتصفح وتعتمد عليها، أو تكتفي بإن الرابط مش ظاهر.

<details>
<summary>سؤال إنترفيو: الفرق بين 401 و403؟</summary>

401 يعني الطلب مش مثبت هوية مستخدم مقبول. 403 يعني الوصول ممنوع؛ مثل عميل مسجل بيحاول يستخدم إجراء موظف. اختيار الكود الفعلي يعتمد على مسار الحماية وسياق الاستجابة.

</details>

## 5. الموظف شغال في فرع واحد؛ إيه اللي يمنعه يشوف طلب فرع تاني؟

**مقتطف فعلي** من [StaffOrderController.php](../app/Http/Controllers/Api/StaffOrderController.php). الدالة داخل الـ controller، وبتتنده قبل عرض طلب واحد أو تغيير حالته.

```php
private function authorizeBranch(Request $request, Order $order): void
{
    $user = $request->user();
    abort_unless($user->isAdmin() || (int) $user->branch_id === (int) $order->branch_id, 404);
}
```

**كل سطر بيعمل إيه؟**

- `private`: الدالة للاستخدام الداخلي في نفس class. `authorizeBranch` اسم اختاره المطوّر، مش Laravel magic method.
- `Request $request, Order $order`: محتاجين هوية المستخدم والطلب اللي عايز يوصل له. `void` يعني مفيش قيمة مقصودة ترجع؛ إما تكمل أو توقف الطلب.
- `$request->user()`: هات المستخدم الموثّق بالفعل. المسار محمي بـ auth وrole قبل استدعاء الـ controller.
- `abort_unless`: امنع الوصول إلا لو واحد من الشرطين صحيح.
- `$user->isAdmin()`: المدير يقدر يصل لأي فرع حسب قرار المشروع الحالي.
- `||`: أو؛ يكفي شرط واحد. بخلاف `&&` اللي تحتاج كل الشروط.
- `(int)`: حوّل معرف الفرع لرقم قبل المقارنة الصارمة `===` لتجنب اختلاف تمثيل الرقم.
- `404`: المشروع اختار إخفاء وجود الطلب غير المسموح، مش معناه إن الطلب مش موجود فعلًا.
- `}` يقفل الدالة. الدالة لا تعدّل بيانات.

القائمة كمان بتتفلتر في `index` على فرع الموظف. فلترة القائمة وحدها مش كفاية: المستخدم ممكن يطلب `/api/staff/orders/123` مباشرة، ولذلك فيه فحص على مستوى الطلب المفرد.

**نفّذ بإيدك:** افترض staff فرعه 2، وطلب فرعه 3؛ قيّم الشرط. بعدين غيّر دور المستخدم إلى admin وقيّمه تاني. ما تعدّلش بيانات موظفين حقيقيين للتجربة.

**المتوقع:** staff يتوقف بـ404؛ admin يكمل. تأكد في المصدر إن `show` و`updateStatus` بينادوا الدالة.

**غلطة شائعة:** تفترض إن route model binding أو وجود id في قاعدة البيانات يدي المستخدم صلاحية الوصول. التحميل غير التصريح.

<details>
<summary>سؤال إنترفيو: يعني إيه IDOR، وإيه علاقته بالمثال؟</summary>

وصول غير مسموح لعنصر بتغيير معرفه في URL أو الطلب. الحماية لازم تتحقق من صلاحية المستخدم على العنصر نفسه، مش مجرد إنه مسجل دخول أو إن الـ ID موجود.

</details>

## 6. مش مجرد «يبدأ جلسة»: وظيفة كل method في المثال

اقرأ method واحدة وجرّب تتوقع **مدخلاتها وناتجها وتأثيرها** قبل ما تكمل. الأمثلة بالقيم الوهمية فقط.

### `validate` غير `validated`

```php
$credentials = $request->validate([
    'email' => ['required', 'email'],
    'password' => ['required', 'string'],
]);
```

- `validate` method من Laravel على الطلب. تاخد array قواعد وتنفّذ التحقق الآن.
- لو نجح التحقق، ترجع array بيانات الحقول المتحقق منها؛ هنا مثل `['email' => 'learner@example.test', 'password' => 'practice-only']`. ما تطبعش كلمة سر حقيقية للتجربة.
- لو فشل، ترمي `ValidationException` ويتحوّل الفشل لرد مناسب؛ في طلب JSON المعتاد `422` مع `errors`. السطر اللي بعدها مش بيتنفّذ في المسار ده.
- دي مش method لحفظ user ولا للتأكد إن الباسورد يخص الحساب؛ التأكد من قواعد الشكل مختلف عن التأكد من بيانات الدخول.
- أما `$request->validated()` في Form Request مثل `StoreOrderRequest` فبتقرأ البيانات المقبولة بعد validation اللي Laravel شغّلها قبل دخول controller؛ هنشوفها في درس الطلبات.

### `boolean('remember')`

```php
$remember = (bool) $request->boolean('remember');
```

- method Laravel تقرأ input بالاسم وتحوّله لمعنى Boolean؛ تقبل قيم true المعروفة مثل `true` و`1` و`'1'` و`'true'` و`'on'` و`'yes'`، وإلا ترجع `false` افتراضيًا.
- المدخل اسم الحقل، والناتج `true` أو `false`. التحويل `(bool)` في الكود الأصلي زائد للتأكيد هنا لأن الناتج Boolean بالفعل.
- ما بتغيّرش قاعدة البيانات. مجرد قراءة إعداد «افتكرني».

### `Auth::attempt($credentials, $remember)`

- method من Laravel authentication. المدخل الأول بيانات الاعتماد، والثاني اختيار remember.
- بتحاول تجيب الحساب المناسب وتقارن كلمة السر المدخلة بالـ hash المخزّن عن طريق نظام Laravel.
- ترجع `true` لو نجحت أو `false` لو فشلت. عند النجاح بتسجّل المستخدم في الـ guard/session، مش بس بترجع Boolean؛ ده **side effect** مهم.
- لذلك `! Auth::attempt(...)` معناه «لو محاولة الدخول فشلت». `!` مش جزء من اسم method.
- نجاحها مش إذن إدارة؛ الكود بعدها بيختبر `is_active`، والمسارات المحمية تختبر الدور والفرع.

### `ValidationException::withMessages(...)`

- factory method من Laravel تبني object exception من array رسائل مرتبطة بأسماء الحقول.
- المدخل مثل `['email' => ['Incorrect credentials.']]`، والناتج exception object؛ اللي يرميه فعلًا هو keyword `throw` المكتوب قبله.
- `return` و`throw` مش methods: الأول يرجّع نتيجة من الدالة، والتاني يقطع التنفيذ العادي بسبب خطأ.

### `session()` ثم `regenerate()`

```php
$request->session()->regenerate();
```

- `session()` ترجع object إدارة جلسة الطلب، مش نص الكوكي.
- `regenerate()` method على object الجلسة تغيّر session ID وتجدد CSRF token وفق تنفيذ Laravel المستخدم. بيانات الجلسة لا تُمسح لمجرد تغيير المعرّف.
- Laravel ترجع منها نتيجة نجاح Boolean؛ المشروع لا يستخدم الناتج، بل محتاج التأثير الأمني لتغيير هوية الجلسة بعد الدخول.
- الاسم الجديد لا يعني «كوّن حسابًا جديدًا» ولا يعني hash جديد للباسورد.

### `user()` ثم `load('branch')`

```php
'user' => $request->user()->load('branch'),
```

- `user()` method Laravel تقرأ المستخدم الحالي من الـ guard: ترجع `User` أو `null` لو مفيش جلسة موثقة.
- هنا وصلنا بعد `attempt` الناجحة، لذلك المتوقع وجود User. في `me()` يستخدم المصدر `?->load('branch')` لأن الزائر ممكن يبقى null.
- `load('branch')` method Eloquent على model موجودة: تنفّذ تحميل العلاقة المسماة branch وتضيفها على نفس object، وترجع نفس model لتكملة الاستخدام.
- الناتج مش اسم الفرع كنص؛ هو user model محمّل معها branch أو `null` للعلاقة لو لا يوجد فرع.

### `response()->json(...)` و`csrf_token()`

- `response()` helper من Laravel يرجع factory لتكوين الردود. مش هو رد fetch في المتصفح.
- `json($data, $status)` تاخد بيانات PHP وكود HTTP اختياري، وترجع `JsonResponse` يحتوي body JSON وheader مناسب. الافتراضي `200`؛ التسجيل يستخدم `201`.
- دي مش طباعة فورية في React؛ الـ controller يرجّع object الاستجابة، وLaravel يرسلها عبر HTTP.
- `csrf_token()` helper يرجع نص token الخاص بالجلسة الحالية. ده token مضاد CSRF، مش bearer token ولا password.

### Logout: تلات عمليات مختلفة مش نفس المعنى

**المقطع الحقيقي من `AuthController::logout`:**

```php
Auth::guard('web')->logout();
$request->session()->invalidate();
$request->session()->regenerateToken();
```

- `guard('web')` يختار مسؤول التوثيق بالاسم ويرجع guard object. الاسم جاي من إعدادات auth.
- `logout()` تنهي حالة تسجيل الدخول في guard؛ مش بترجع بيانات user جديدة. ده إجراء له أثر على التوثيق.
- `invalidate()` تمسح بيانات الجلسة وتجدد هويتها؛ النتيجة Boolean نجاح، والمشروع ما بيستخدمهاش.
- `regenerateToken()` تغيّر CSRF token المخزّن في الجلسة؛ ما بترجعش token لاستخدامه هنا. علشان تجيب النص الجديد تستخدم `csrf_token()` في الرد.
- مسح user من state على الفرونت وحده لا ينفّذ أي خطوة من دول على السيرفر.

### باقي الأدوات الصغيرة في الصلاحيات

- `abort_unless($condition, 403)` helper Laravel: لو الشرط false ترمي HTTP exception؛ لو true تكمل من غير بيانات محتاج تحفظها.
- `abort_if($condition, 403)` العكس: توقف لو true. دي مش methods بترجع `false` ليك تتصرف فيه.
- `in_array($role, $roles, true)` دالة PHP: تبحث عن قيمة في array وترجع Boolean؛ الثالث `true` للمقارنة الصارمة. لا تعدّل القائمة.
- `$user->isAdmin()` دالة مشروع داخل User؛ نتيجتها Boolean لدور المدير، مش اتصال تسجيل دخول جديد.
- `$next($request)` استدعاء closure جهّزها Laravel للـ middleware؛ تمرّر الطلب للمرحلة التالية وترجع الاستجابة القادمة منها. `next` مش keyword PHP.

## 7. المثال كامل بين Login والـ Context والسيرفر والعودة

هنا مش هقول «افتح ملف تاني» وأسكت. هنمشي في نفس الطلب. **المقتطفات التالية من التنفيذ الحقيقي مع حذف كود العرض فقط**، وتخص وضع Laravel، لا demo.

### أ. المستخدم يرسل الفورم: `Pages/Auth/Login.jsx`

```jsx
try {
    const user = await login(form);
    navigate(user.role === 'admin' ? '/admin' : user.role === 'staff' ? '/staff' : '/menu', { replace: true });
} catch (requestError) {
    setError(requestError.message);
}
```

- `login(form)` دالة مشروع مأخوذة من `useAuth()`، مش method مدمجة في المتصفح. `form` object فيه القيم المدخلة.
- `await` يستنى الـ Promise. النجاح يرجّع user؛ الفشل ينتقل لـ catch بدل تنفيذ navigate.
- `navigate(path, { replace: true })` من React Router: يغيّر صفحة الواجهة ويستبدل مدخل history الحالي. مش method لحماية مسار backend.
- `setError(...)` setter من React يعرض الرسالة عبر state؛ مش بيرسلها للسيرفر.

### ب. تنفيذ `login`: `context/AuthContext.jsx`

**في الأصل دي property داخل object قيمة الـ Context. هنا فصلناها كمتغير دالة مكتمل نحويًا فقط لسهولة القراءة؛ جسم التنفيذ نفسه. مش ملف مستقل عن React.**

```jsx
const login = async (credentials) => {
    authRequestVersion.current += 1;
    const response = await csrfFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
    flushSync(() => {
        setUser(response.user);
        setIsCheckingAuth(false);
    });
    return response.user;
};
```

- `async` تجعل الدالة ترجع Promise. `credentials` الاسم المحلي لبيانات `form` اللي وصلت.
- زيادة `authRequestVersion.current` رقم إصدار داخل ref علشان رد فحص هوية قديم ما يكتبش فوق الدخول الجديد؛ مش session ID.
- `JSON.stringify(credentials)` دالة JavaScript ترجع نص JSON؛ لا ترسل الشبكة بنفسها.
- `csrfFetch` helper مشروع. في الوضع الحقيقي تضيف headers والكوكيز، تنفّذ fetch، تفك JSON، وترمي Error للـ HTTP غير الناجح.
- **ناتجها هو payload بعد فك JSON، مش `Response` خام؛** لذلك هنا `response.user` مباشرة، مش `response.json()` مرة أخرى.
- `flushSync(callback)` من React DOM: يطبّق تحديثات React داخل callback بشكل متزامن قبل الاستمرار؛ لا يعيد طلب HTTP ولا نحتاج نستخدمه لكل state update. الكود الحالي يستخدمه عند تغيير الهوية قبل التنقل.
- `setUser(...)` يحدّث state المستخدم، و`setIsCheckingAuth(false)` ينهي حالة انتظار فحص الهوية. setters لا ترجع user.
- `return response.user` هو اللي يسلّم user للدالة المنتظرة في Login؛ لأن الدالة async، يتغلف كنجاح Promise.

### ج. الـ helper ثم الـ route

**أهم سطور `lib/api.js` الفعلية، مقتطفات من مواضعها:**

```js
const response = await fetch(url, {
    credentials: 'same-origin',
    ...options,
    headers,
});
const payload = isJson ? await response.json() : null;
if (payload?.csrf_token) {
    document.querySelector('meta[name="csrf-token"]')?.setAttribute('content', payload.csrf_token);
}
if (!response.ok) {
    const error = new Error(payload?.message || 'Something went wrong. Please try again.');
    error.payload = payload;
    throw error;
}
return payload;
```

- `fetch` Web API ترجع Promise لـ Response؛ `.json()` method على Response تقرأ body وتعيد Promise لقيمة JavaScript. قرايتها مش استعلام جديد.
- `response.ok` property تكون true للحالات `200–299`، مش method. fetch لا ترفض Promise تلقائيًا بسبب `422`، لذلك فحصها ضروري.
- `querySelector` DOM method ترجع أول عنصر مطابق أو null. `setAttribute(name, value)` تغيّر attribute على العنصر؛ هنا تحفظ token الجديد في meta للطلبات التالية، ولا ترجع قيمة بيانات مفيدة.
- `new Error(...)` ينشئ object خطأ. `throw error` يجعل الـ Promise تفشل، فيمسكها catch في Login.

```php
// routes/web.php داخل prefix('api')
Route::post('/auth/login', [AuthController::class, 'login']);
```

دي تجهّز ربط POST `/api/auth/login` بـ `AuthController::login`؛ مش بتشغّل محاولة تسجيل دخول وقت تحميل ملف routes.

### د. السيرفر يتحقق ويرد ثم الواجهة تتحدث

في AuthController يحدث بالترتيب: `validate` ثم `attempt` ثم رفض الحساب المعطّل إن وجد، ثم `regenerate`، وأخيرًا **الرد الحقيقي**:

```php
return response()->json([
    'message' => 'Login successful.',
    'user' => $request->user()->load('branch'),
    'csrf_token' => csrf_token(),
]);
```

الرد يوصل إلى `csrfFetch` فتفكّه، تحدّث token، وترجّع object إلى AuthContext. الـ Context يحدّث user ثم يرجّعها إلى Login. Login يختار الصفحة حسب role. **ده آخر نفس المثال، مش بداية دالة ناقصة محتاج تخمّن بقيتها.**

**تمرين التتبّع:** باسورد غلط → `attempt` ترجع false → exception → HTTP 422 → helper ترمي Error → catch في Login تعرض الرسالة. لا `setUser` ولا `navigate` في مسار النجاح يحصلوا.

التالي: [05 — قاعدة البيانات والعلاقات](05-database-and-models.md).
