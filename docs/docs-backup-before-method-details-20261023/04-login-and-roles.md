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

التالي: [05 — قاعدة البيانات والعلاقات](05-database-and-models.md).
