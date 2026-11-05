# تسجيل الحساب والدخول والخروج بالـ session

[فهرس كل الأكواد](../../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `app/Http/Controllers/Api/AuthController.php` · 88 سطر.

**وظيفة الملف:** بيستقبل طلبات AuthContext من React، يتحقق من البيانات، ويستخدم Laravel session authentication مش JWT. كلمات المرور تتحول إلى hash أحادي الاتجاه من User casts، مش encryption قابلة للفك؛ session تتجدد بعد الدخول، والرد بيرجع user وCSRF token جديد للواجهة.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../../app/Http/Controllers/Api/AuthController.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Http/Controllers/Controller.php](../Controller.php.md)

- [pizza-crm/app/Models/User.php](../../../Models/User.php.md)

- [pizza-crm/resources/js/context/AuthContext.jsx](../../../../resources/js/context/AuthContext.jsx.md)

- [pizza-crm/resources/js/Pages/Auth/Register.jsx](../../../../resources/js/Pages/Auth/Register.jsx.md)

- [pizza-crm/resources/js/Pages/Auth/Login.jsx](../../../../resources/js/Pages/Auth/Login.jsx.md)

- [pizza-crm/resources/js/lib/api.js](../../../../resources/js/lib/api.js.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

// app/Http/Controllers/Api/AuthController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user()?->load('branch'),
        ], $request->user() ? 200 : 401);
    }

    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:80'],
            'email' => ['required', 'email', 'max:160', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        $user = User::create($data);

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Registration successful.',
            'user' => $user,
            'csrf_token' => csrf_token(),
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $remember = (bool) $request->boolean('remember');

        if (! Auth::attempt($credentials, $remember)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if (! $request->user()->is_active) {
            Auth::logout();
            throw ValidationException::withMessages([
                'email' => ['This account has been disabled. Please contact an administrator.'],
            ]);
        }

        $request->session()->regenerate();

        return response()->json([
            'message' => 'Login successful.',
            'user' => $request->user()->load('branch'),
            'csrf_token' => csrf_token(),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logout successful.',
            'csrf_token' => csrf_token(),
        ]);
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### me

اعرف مين صاحب session الحالية؛ حمّل فرعه إن كان مسجل دخول، وإلا رجّع 401.

- **بتاخد إيه؟ Inputs:** Request الحالية وفيها session/cookies.

- **بترجع/بتغيّر إيه؟ Return / effect:** JsonResponse فيها user؛ status 200 أو 401.

### register

راجع اسم وإيميل وباسورد مؤكّد، أنشئ customer، دخّله وجدّد session.

- **بتاخد إيه؟ Inputs:** name وemail وpassword وpassword_confirmation في Request.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON user وmessage وcsrf_token مع 201؛ validation errors لو البيانات غلط.

### login

راجع credentials وجرب Auth::attempt؛ ارفض الحساب غير النشط، ثم جدّد session ورجّع بياناته.

- **بتاخد إيه؟ Inputs:** email وpassword واختيار remember.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON user/CSRF أو ValidationException لبيانات خاطئة أو حساب معطل.

### logout

اخرج المستخدم من web guard وأبطل session وجدّد CSRF token.

- **بتاخد إيه؟ Inputs:** Request وsession الحالية.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSON نجاح وcsrf_token جديد؛ مفيش user في الرد.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### ->json

- **جاية منين؟** Laravel Response factory

- **وظيفتها:** تجهّز HTTP response من بيانات JSON.

- **المدخلات — Arguments:** data وstatus وheaders.

- **الناتج/الأثر — Return / effect:** JsonResponse، مش object JavaScript مشترك بين PHP والمتصفح.

- **أول موضع هنا:** السطر 82.

### response

- **جاية منين؟** Laravel helper

- **وظيفتها:** جهّز HTTP response. بدون arguments هات factory نكمل عليها json أو view أو streamDownload.

- **المدخلات — Arguments:** بدون arguments للـ factory؛ أو content ثم status ثم headers لإنشاء response مباشرة.

- **الناتج/الأثر — Return / effect:** ResponseFactory بدون arguments، أو HTTP Response عند تمرير content؛ مش إرسال شبكة من browser.

- **أول موضع هنا:** السطر 82.

- **مثال:** return response()->json(['message' => 'Saved'], 201);

### $request->user

- **جاية منين؟** Laravel Request

- **وظيفتها:** اقرأ المستخدم الذي ثبتته session أو guard للطلب الحالي؛ مش user ID أرسله العميل في body.

- **المدخلات — Arguments:** اسم guard اختياري؛ المشروع بدون arguments.

- **الناتج/الأثر — Return / effect:** User أو null لو ضيف.

- **أول موضع هنا:** السطر 70.

- **مثال:** $request->user()?->load('branch')

### ->load

- **جاية منين؟** Eloquent Model/Collection

- **وظيفتها:** تحمّل علاقات على نتائج موجودة.

- **المدخلات — Arguments:** العلاقات.

- **الناتج/الأثر — Return / effect:** نفس model/collection بعد التحميل.

- **أول موضع هنا:** السطر 70.

### $request->validate

- **جاية منين؟** Laravel Request

- **وظيفتها:** شغّل validation بالقواعد المعطاة؛ لو بعضها غلط يوقف التنفيذ ويرجع أخطاء بدل ما يكمل controller.

- **المدخلات — Arguments:** array rules ثم messages وattributes اختيارية.

- **الناتج/الأثر — Return / effect:** array القيم التي عدّت القواعد؛ أو ValidationException عند الفشل.

- **أول موضع هنا:** السطر 46.

- **مثال:** $request->validate(['email' => ['required', 'email']]);

### Password::min

- **جاية منين؟** Laravel Validation Password Rule

- **وظيفتها:** كوّن قاعدة password بطول أدنى؛ min(8) لا تعني فحص كل سياسات الأمان ولا hashing.

- **المدخلات — Arguments:** عدد أحرف أدنى integer، هنا 8.

- **الناتج/الأثر — Return / effect:** Password rule object يمكن إضافة mixedCase/numbers/symbols لها، لكن مش كلها مستخدمة هنا.

- **أول موضع هنا:** السطر 29.

- **مثال:** Password::min(8)

### User::create

- **جاية منين؟** Eloquent/Relation

- **وظيفتها:** تنشئ صفًا ببيانات ملء مسموحة.

- **المدخلات — Arguments:** attributes array.

- **الناتج/الأثر — Return / effect:** model المحفوظ؛ ليست validation أو authorization تلقائية.

- **أول موضع هنا:** السطر 32.

### Auth::login

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** راجع credentials وجرب Auth::attempt؛ ارفض الحساب غير النشط، ثم جدّد session ورجّع بياناته.

- **المدخلات — Arguments:** email وpassword واختيار remember.

- **الناتج/الأثر — Return / effect:** JSON user/CSRF أو ValidationException لبيانات خاطئة أو حساب معطل.

- **أول موضع هنا:** السطر 34.

### $request->session

- **جاية منين؟** Laravel Request

- **وظيفتها:** هات session store المرتبطة بالـ request الحالية حتى تقرأ أو تجدد أو تبطل بيانات الجلسة.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** Session Store object؛ ليس session ID نصيًا بمفرده.

- **أول موضع هنا:** السطر 80.

- **مثال:** $request->session()->regenerate();

### ->regenerate

- **جاية منين؟** Laravel Session

- **وظيفتها:** تغيّر session ID وتجدد CSRF token حسب store.

- **المدخلات — Arguments:** destroy اختيارية.

- **الناتج/الأثر — Return / effect:** Boolean في implementation؛ الأثر تجديد الجلسة.

- **أول موضع هنا:** السطر 66.

### csrf_token

- **جاية منين؟** Laravel helper

- **وظيفتها:** هات CSRF token الخاصة بالsession الحالية لربط طلبات المتصفح بنفس الجلسة.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** string token.

- **أول موضع هنا:** السطر 84.

- **مثال:** 'csrf_token' => csrf_token()

### $request->boolean

- **جاية منين؟** Laravel Request InteractsWithInput

- **وظيفتها:** اقرأ input وحوّل قيم مثل true أو '1' أو 'on' أو 'yes' إلى true، والقيم غير المطابقة إلى false. مختلف عن Blueprint::boolean التي تعرّف عمودًا.

- **المدخلات — Arguments:** اسم field string ثم default bool اختيارية افتراضي false.

- **الناتج/الأثر — Return / effect:** bool قيمة المدخل بعد التحويل.

- **أول موضع هنا:** السطر 51.

- **مثال:** $request->boolean('remember')

### Auth::attempt

- **جاية منين؟** Laravel Auth Facade / SessionGuard

- **وظيفتها:** ابحث عن الحساب بالـ credentials، راجع password مقابل hash، وسجل الدخول عند التطابق. لا تفك hash إلى password أصلية.

- **المدخلات — Arguments:** array credentials فيها email وpassword، ثم remember bool اختياري.

- **الناتج/الأثر — Return / effect:** bool: true عند نجاح إثبات الهوية، false عند عدم التطابق.

- **أول موضع هنا:** السطر 53.

- **مثال:** Auth::attempt($credentials, $remember)

### ValidationException::withMessages

- **جاية منين؟** Laravel ValidationException

- **وظيفتها:** ابنِ exception بأخطاء مرتبطة بأسماء حقول زي items أو expected_status.

- **المدخلات — Arguments:** array field=>messages.

- **الناتج/الأثر — Return / effect:** ValidationException؛ throw هو اللي يرميها.

- **أول موضع هنا:** السطر 61.

- **مثال:** throw ValidationException::withMessages(['items' => ['Unavailable']]);

### Auth::logout

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** اخرج المستخدم من web guard وأبطل session وجدّد CSRF token.

- **المدخلات — Arguments:** Request وsession الحالية.

- **الناتج/الأثر — Return / effect:** JSON نجاح وcsrf_token جديد؛ مفيش user في الرد.

- **أول موضع هنا:** السطر 60.

### Auth::guard

- **جاية منين؟** Laravel Auth Manager

- **وظيفتها:** اختر guard مسؤولة عن إثبات الهوية؛ هنا web هي session-based guard وليست JWT token.

- **المدخلات — Arguments:** اسم guard string اختياري؛ المشروع يمرر 'web'.

- **الناتج/الأثر — Return / effect:** Guard object؛ في إعداد web المستخدم هنا SessionGuard تقدر تنادي logout عليها.

- **أول موضع هنا:** السطر 77.

- **مثال:** Auth::guard('web')->logout();

### ->logout

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** اخرج المستخدم من web guard وأبطل session وجدّد CSRF token.

- **المدخلات — Arguments:** Request وsession الحالية.

- **الناتج/الأثر — Return / effect:** JSON نجاح وcsrf_token جديد؛ مفيش user في الرد.

- **أول موضع هنا:** السطر 77.

### ->invalidate

- **جاية منين؟** Laravel Session

- **وظيفتها:** تفرغ بيانات الجلسة وتغيّر ID.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** Boolean في store؛ ليست React state.

- **أول موضع هنا:** السطر 79.

### ->regenerateToken

- **جاية منين؟** Laravel Session Store

- **وظيفتها:** ولّد CSRF token جديدة واحفظها في session؛ استدعاء csrf_token بعدها يقرأ القيمة الجديدة.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** void؛ لا يرجع نص token مباشرة.

- **أول موضع هنا:** السطر 80.

- **مثال:** $request->session()->regenerateToken();

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

// app/Http/Controllers/Api/AuthController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 5:** namespace بتحدد نطاق أسماء الكلاس `App\Http\Controllers\Api`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 7:** use / استيراد الاسم `App\Http\Controllers\Controller` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 8:** use / استيراد الاسم `App\Models\User` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
```

**السطر 9:** use / استيراد الاسم `Illuminate\Http\JsonResponse` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 10:** use / استيراد الاسم `Illuminate\Http\Request` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 11:** use / استيراد الاسم `Illuminate\Support\Facades\Auth` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 12:** use / استيراد الاسم `Illuminate\Validation\Rules\Password` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 13:** use / استيراد الاسم `Illuminate\Validation\ValidationException` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 15:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

**السطر 16:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

### السطور 17–24

```php
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user()?->load('branch'),
        ], $request->user() ? 200 : 401);
    }

    public function register(Request $request): JsonResponse
```

**السطر 17:** Function / تعريف دالة `me`؛ تعريفها مش تشغيلها. اعرف مين صاحب session الحالية؛ حمّل فرعه إن كان مسجل دخول، وإلا رجّع 401. مدخلاتها: Request الحالية وفيها session/cookies. ناتجها: JsonResponse فيها user؛ status 200 أو 401.

**السطر 18:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 19:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 20:** PHP array entry: المفتاح `user` مرتبط بالقيمة `$request->user()?->load('branch')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 21:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$request->user(...)`: اقرأ المستخدم الذي ثبتته session أو guard للطلب الحالي؛ مش user ID أرسله العميل في body. مدخلاتها: اسم guard اختياري؛ المشروع بدون arguments. العائد/الأثر: User أو null لو ضيف.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 22:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 24:** Function / تعريف دالة `register`؛ تعريفها مش تشغيلها. راجع اسم وإيميل وباسورد مؤكّد، أنشئ customer، دخّله وجدّد session. مدخلاتها: name وemail وpassword وpassword_confirmation في Request. ناتجها: JSON user وmessage وcsrf_token مع 201؛ validation errors لو البيانات غلط.

### السطور 25–32

```php
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:80'],
            'email' => ['required', 'email', 'max:160', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        $user = User::create($data);
```

**السطر 25:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 26:** خزّن البيانات اللي نجحت في validation داخل `$data`. $request هو HTTP request الحالية، وvalidate تطبق array القواعد التالية؛ لو فشلت ترمي ValidationException ومتكملش المسار عادي.

**السطر 27:** قواعد حقل `name` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `string` = نص؛ `min:2` = أقل قيمة/طول `2` حسب نوع الحقل؛ `max:80` = أقصى قيمة/طول `80` حسب النوع؛ حجم الملفات بالكيلوبايت. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 28:** قواعد حقل `email` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `email` = صيغة بريد إلكتروني؛ `max:160` = أقصى قيمة/طول `160` حسب النوع؛ حجم الملفات بالكيلوبايت؛ `unique:users,email` = القيمة ما تتكررش في الجدول والعمود المحددين. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 29:** قواعد حقل `password` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `confirmed` = لازم يطابق حقل التأكيد اللي اسمه منتهي بـ_confirmation. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 30:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 32:** User::create تحفظ مستخدمًا جديدًا بالبيانات المعطاة وترجع User model نخزّنها في `$user`. قواعد fillable وcasts في User.php جزء من العملية، ومنها hashing للباسورد؛ ده حفظ في السيرفر مش state بالمتصفح.

### السطور 33–40

```php

        Auth::login($user);
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Registration successful.',
            'user' => $user,
            'csrf_token' => csrf_token(),
```

**السطر 34:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `Auth::login(...)`: راجع credentials وجرب Auth::attempt؛ ارفض الحساب غير النشط، ثم جدّد session ورجّع بياناته. مدخلاتها: email وpassword واختيار remember. العائد/الأثر: JSON user/CSRF أو ValidationException لبيانات خاطئة أو حساب معطل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 35:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$request->session(...)`: هات session store المرتبطة بالـ request الحالية حتى تقرأ أو تجدد أو تبطل بيانات الجلسة. مدخلاتها: بدون arguments. العائد/الأثر: Session Store object؛ ليس session ID نصيًا بمفرده.؛ `->regenerate(...)`: تغيّر session ID وتجدد CSRF token حسب store. مدخلاتها: destroy اختيارية. العائد/الأثر: Boolean في implementation؛ الأثر تجديد الجلسة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 37:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 38:** PHP array entry: المفتاح `message` مرتبط بالقيمة `'Registration successful.'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 39:** PHP array entry: المفتاح `user` مرتبط بالقيمة `$user`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 40:** PHP array entry: المفتاح `csrf_token` مرتبط بالقيمة `csrf_token()`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 41–48

```php
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
```

**السطر 41:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 42:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 44:** Function / تعريف دالة `login`؛ تعريفها مش تشغيلها. راجع credentials وجرب Auth::attempt؛ ارفض الحساب غير النشط، ثم جدّد session ورجّع بياناته. مدخلاتها: email وpassword واختيار remember. ناتجها: JSON user/CSRF أو ValidationException لبيانات خاطئة أو حساب معطل.

**السطر 45:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 46:** خزّن البيانات اللي نجحت في validation داخل `$credentials`. $request هو HTTP request الحالية، وvalidate تطبق array القواعد التالية؛ لو فشلت ترمي ValidationException ومتكملش المسار عادي.

**السطر 47:** قواعد حقل `email` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `email` = صيغة بريد إلكتروني. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 48:** قواعد حقل `password` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `string` = نص. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

### السطور 49–56

```php
        ]);

        $remember = (bool) $request->boolean('remember');

        if (! Auth::attempt($credentials, $remember)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
```

**السطر 49:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 51:** Assignment / إسناد: احسب `(bool) $request->boolean('remember')` الأول وخزّن النتيجة في `$remember`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 53:** if تختبر الشرط `! Auth::attempt($credentials, $remember)`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 54:** throw ترمي الاستثناء `ValidationException::withMessages([` وتوقف المسار العادي. Laravel exception handler أو catch المناسبة تتعامل معاه؛ مش مجرد رسالة بتنطبع وتكمّل التنفيذ.

**السطر 55:** PHP array entry: المفتاح `email` مرتبط بالقيمة `['The provided credentials are incorrect.']`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 56:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 57–64

```php
        }

        if (! $request->user()->is_active) {
            Auth::logout();
            throw ValidationException::withMessages([
                'email' => ['This account has been disabled. Please contact an administrator.'],
            ]);
        }
```

**السطر 57:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 59:** if تختبر الشرط `! $request->user()->is_active`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 60:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `Auth::logout(...)`: اخرج المستخدم من web guard وأبطل session وجدّد CSRF token. مدخلاتها: Request وsession الحالية. العائد/الأثر: JSON نجاح وcsrf_token جديد؛ مفيش user في الرد.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 61:** throw ترمي الاستثناء `ValidationException::withMessages([` وتوقف المسار العادي. Laravel exception handler أو catch المناسبة تتعامل معاه؛ مش مجرد رسالة بتنطبع وتكمّل التنفيذ.

**السطر 62:** PHP array entry: المفتاح `email` مرتبط بالقيمة `['This account has been disabled. Please contact an administrator.']`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 63:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 64:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 65–72

```php

        $request->session()->regenerate();

        return response()->json([
            'message' => 'Login successful.',
            'user' => $request->user()->load('branch'),
            'csrf_token' => csrf_token(),
        ]);
```

**السطر 66:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$request->session(...)`: هات session store المرتبطة بالـ request الحالية حتى تقرأ أو تجدد أو تبطل بيانات الجلسة. مدخلاتها: بدون arguments. العائد/الأثر: Session Store object؛ ليس session ID نصيًا بمفرده.؛ `->regenerate(...)`: تغيّر session ID وتجدد CSRF token حسب store. مدخلاتها: destroy اختيارية. العائد/الأثر: Boolean في implementation؛ الأثر تجديد الجلسة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 68:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 69:** PHP array entry: المفتاح `message` مرتبط بالقيمة `'Login successful.'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 70:** PHP array entry: المفتاح `user` مرتبط بالقيمة `$request->user()->load('branch')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 71:** PHP array entry: المفتاح `csrf_token` مرتبط بالقيمة `csrf_token()`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 72:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 73–80

```php
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();
```

**السطر 73:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 75:** Function / تعريف دالة `logout`؛ تعريفها مش تشغيلها. اخرج المستخدم من web guard وأبطل session وجدّد CSRF token. مدخلاتها: Request وsession الحالية. ناتجها: JSON نجاح وcsrf_token جديد؛ مفيش user في الرد.

**السطر 76:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 77:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `Auth::guard(...)`: اختر guard مسؤولة عن إثبات الهوية؛ هنا web هي session-based guard وليست JWT token. مدخلاتها: اسم guard string اختياري؛ المشروع يمرر 'web'. العائد/الأثر: Guard object؛ في إعداد web المستخدم هنا SessionGuard تقدر تنادي logout عليها.؛ `->logout(...)`: اخرج المستخدم من web guard وأبطل session وجدّد CSRF token. مدخلاتها: Request وsession الحالية. العائد/الأثر: JSON نجاح وcsrf_token جديد؛ مفيش user في الرد.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 79:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$request->session(...)`: هات session store المرتبطة بالـ request الحالية حتى تقرأ أو تجدد أو تبطل بيانات الجلسة. مدخلاتها: بدون arguments. العائد/الأثر: Session Store object؛ ليس session ID نصيًا بمفرده.؛ `->invalidate(...)`: تفرغ بيانات الجلسة وتغيّر ID. مدخلاتها: بدون مدخلات. العائد/الأثر: Boolean في store؛ ليست React state.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 80:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$request->session(...)`: هات session store المرتبطة بالـ request الحالية حتى تقرأ أو تجدد أو تبطل بيانات الجلسة. مدخلاتها: بدون arguments. العائد/الأثر: Session Store object؛ ليس session ID نصيًا بمفرده.؛ `->regenerateToken(...)`: ولّد CSRF token جديدة واحفظها في session؛ استدعاء csrf_token بعدها يقرأ القيمة الجديدة. مدخلاتها: بدون arguments. العائد/الأثر: void؛ لا يرجع نص token مباشرة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 81–88

```php

        return response()->json([
            'message' => 'Logout successful.',
            'csrf_token' => csrf_token(),
        ]);
    }
}

```

**السطر 82:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

**السطر 83:** PHP array entry: المفتاح `message` مرتبط بالقيمة `'Logout successful.'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 84:** PHP array entry: المفتاح `csrf_token` مرتبط بالقيمة `csrf_token()`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 85:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 86:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 87:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
