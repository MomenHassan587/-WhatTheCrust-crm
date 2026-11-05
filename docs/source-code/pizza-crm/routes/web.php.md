# خريطة طلبات الويب والـ API

[فهرس كل الأكواد](../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `routes/web.php` · 64 سطر.

**وظيفة الملف:** ده جدول التوصيل الحقيقي: عنوان زي POST /api/orders يروح لـ OrderController.store. كل المسارات هنا تحت web middleware؛ كلمة api في prefix مش معناها إن Laravel حوّلها تلقائيًا لـ stateless API. آخر route بيرجع Blade لتطبيق React بشرط المسار ما يبدأش api.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../routes/web.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Http/Controllers/Api/AuthController.php](../app/Http/Controllers/Api/AuthController.php.md)

- [pizza-crm/app/Http/Controllers/Api/AdminController.php](../app/Http/Controllers/Api/AdminController.php.md)

- [pizza-crm/app/Http/Controllers/Api/MenuController.php](../app/Http/Controllers/Api/MenuController.php.md)

- [pizza-crm/app/Http/Controllers/Api/OrderController.php](../app/Http/Controllers/Api/OrderController.php.md)

- [pizza-crm/app/Http/Controllers/Api/OrderTrackingController.php](../app/Http/Controllers/Api/OrderTrackingController.php.md)

- [pizza-crm/app/Http/Controllers/Api/PaymentController.php](../app/Http/Controllers/Api/PaymentController.php.md)

- [pizza-crm/app/Http/Controllers/Api/StaffOrderController.php](../app/Http/Controllers/Api/StaffOrderController.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

// routes/web.php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\OrderTrackingController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\StaffOrderController;
use Illuminate\Support\Facades\Route;

Route::prefix('api')->group(function () {
    Route::get('/menu', [MenuController::class, 'index']);

    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/track/{token}', [OrderTrackingController::class, 'show'])->middleware('throttle:60,1');
    Route::post('/payments/intents', [PaymentController::class, 'createIntent']);
    Route::post('/payments/webhook', [PaymentController::class, 'webhook']);

    Route::middleware('auth')->group(function () {
        Route::get('/orders/history', [OrderTrackingController::class, 'history']);
        Route::post('/orders/{order}/reorder', [OrderTrackingController::class, 'reorder']);
    });

    Route::middleware(['auth', 'role:staff,admin'])->prefix('staff')->group(function () {
        Route::get('/orders', [StaffOrderController::class, 'index']);
        Route::get('/orders/{order}', [StaffOrderController::class, 'show']);
        Route::patch('/orders/{order}/status', [StaffOrderController::class, 'updateStatus']);
    });

    Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/catalog', [AdminController::class, 'catalog']);
        Route::post('/products', [AdminController::class, 'storeProduct']);
        Route::post('/products/{menuItem}', [AdminController::class, 'updateProduct']);
        Route::delete('/products/{menuItem}', [AdminController::class, 'disableProduct']);
        Route::post('/categories', [AdminController::class, 'storeCategory']);
        Route::put('/categories/{category}', [AdminController::class, 'updateCategory']);
        Route::get('/branches', [AdminController::class, 'branches']);
        Route::put('/branches/{branch}', [AdminController::class, 'updateBranch']);
        Route::get('/staff', [AdminController::class, 'staff']);
        Route::post('/staff', [AdminController::class, 'storeStaff']);
        Route::put('/staff/{user}', [AdminController::class, 'updateStaff']);
        Route::put('/staff/{user}/password', [AdminController::class, 'resetPassword']);
        Route::get('/orders', [AdminController::class, 'orders']);
        Route::get('/orders/export', [AdminController::class, 'exportOrders']);
        Route::get('/customers', [AdminController::class, 'customers']);
        Route::get('/settings', [AdminController::class, 'settings']);
        Route::put('/settings', [AdminController::class, 'updateSettings']);
        Route::get('/audit', [AdminController::class, 'audit']);
    });
});

Route::get('/{view?}', function () {
    return view('app');
})->where('view', '^(?!api).*$');
```

</details>

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### Route::prefix

- **جاية منين؟** Laravel Router

- **وظيفتها:** تسجّل/تضبط route باستخدام prefix؛ ده تعريف لاستقبال request لاحق، مش query قراءة DB الآن.

- **المدخلات — Arguments:** URI/handler أو إعداد المجموعة كما هو مكتوب.

- **الناتج/الأثر — Return / effect:** Route أو registrar حسب method، أو نتيجة التسجيل؛ ليست قائمة orders.

- **أول موضع هنا:** السطر 14.

### ->group

- **جاية منين؟** Laravel Route

- **وظيفتها:** تجمع تعريفات routes تحت إعدادات مشتركة.

- **المدخلات — Arguments:** callback أو ملف routes.

- **الناتج/الأثر — Return / effect:** تسجل التعريفات؛ مش payload مستخدم.

- **أول موضع هنا:** السطر 38.

### Route::get

- **جاية منين؟** Laravel Router

- **وظيفتها:** تسجّل/تضبط route باستخدام get؛ ده تعريف لاستقبال request لاحق، مش query قراءة DB الآن.

- **المدخلات — Arguments:** URI/handler أو إعداد المجموعة كما هو مكتوب.

- **الناتج/الأثر — Return / effect:** Route أو registrar حسب method، أو نتيجة التسجيل؛ ليست قائمة orders.

- **أول موضع هنا:** السطر 61.

### Route::post

- **جاية منين؟** Laravel Router

- **وظيفتها:** تسجّل/تضبط route باستخدام post؛ ده تعريف لاستقبال request لاحق، مش query قراءة DB الآن.

- **المدخلات — Arguments:** URI/handler أو إعداد المجموعة كما هو مكتوب.

- **الناتج/الأثر — Return / effect:** Route أو registrar حسب method، أو نتيجة التسجيل؛ ليست قائمة orders.

- **أول موضع هنا:** السطر 49.

### ->middleware

- **جاية منين؟** Laravel Route

- **وظيفتها:** تحدد فحوص الوصول/المعالجة على route أو group.

- **المدخلات — Arguments:** middleware names.

- **الناتج/الأثر — Return / effect:** route/registrar للاستكمال، لا تنفذها الآن.

- **أول موضع هنا:** السطر 23.

### Route::middleware

- **جاية منين؟** Laravel Router

- **وظيفتها:** تسجّل/تضبط route باستخدام middleware؛ ده تعريف لاستقبال request لاحق، مش query قراءة DB الآن.

- **المدخلات — Arguments:** URI/handler أو إعداد المجموعة كما هو مكتوب.

- **الناتج/الأثر — Return / effect:** Route أو registrar حسب method، أو نتيجة التسجيل؛ ليست قائمة orders.

- **أول موضع هنا:** السطر 38.

### ->prefix

- **جاية منين؟** Laravel Route

- **وظيفتها:** تضيف جزءًا ثابتًا لبداية المسارات.

- **المدخلات — Arguments:** prefix text.

- **الناتج/الأثر — Return / effect:** registrar.

- **أول موضع هنا:** السطر 38.

### Route::patch

- **جاية منين؟** Laravel Router

- **وظيفتها:** تسجّل/تضبط route باستخدام patch؛ ده تعريف لاستقبال request لاحق، مش query قراءة DB الآن.

- **المدخلات — Arguments:** URI/handler أو إعداد المجموعة كما هو مكتوب.

- **الناتج/الأثر — Return / effect:** Route أو registrar حسب method، أو نتيجة التسجيل؛ ليست قائمة orders.

- **أول موضع هنا:** السطر 35.

### Route::delete

- **جاية منين؟** Laravel Router

- **وظيفتها:** تسجّل/تضبط route باستخدام delete؛ ده تعريف لاستقبال request لاحق، مش query قراءة DB الآن.

- **المدخلات — Arguments:** URI/handler أو إعداد المجموعة كما هو مكتوب.

- **الناتج/الأثر — Return / effect:** Route أو registrar حسب method، أو نتيجة التسجيل؛ ليست قائمة orders.

- **أول موضع هنا:** السطر 43.

### Route::put

- **جاية منين؟** Laravel Router

- **وظيفتها:** تسجّل/تضبط route باستخدام put؛ ده تعريف لاستقبال request لاحق، مش query قراءة DB الآن.

- **المدخلات — Arguments:** URI/handler أو إعداد المجموعة كما هو مكتوب.

- **الناتج/الأثر — Return / effect:** Route أو registrar حسب method، أو نتيجة التسجيل؛ ليست قائمة orders.

- **أول موضع هنا:** السطر 56.

### view

- **جاية منين؟** Laravel helper

- **وظيفتها:** جهّز Blade view من اسم template وبياناته؛ helper view مختلفة عن Route::view التي تسجّل route.

- **المدخلات — Arguments:** اسم view مثل app ثم array data اختيارية وmergeData اختيارية.

- **الناتج/الأثر — Return / effect:** View object عند إعطاء اسم؛ Laravel يحوّلها إلى HTML داخل response. بدون اسم ترجع View Factory.

- **أول موضع هنا:** السطر 62.

- **مثال:** return view('app');

### ->where

- **جاية منين؟** Laravel Query Builder

- **وظيفتها:** تضيف شرط فلترة أو مجموعة شروط.

- **المدخلات — Arguments:** column/operator/value أو closure.

- **الناتج/الأثر — Return / effect:** Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.

- **أول موضع هنا:** السطر 63.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

// routes/web.php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\OrderController;
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 5:** use / استيراد الاسم `App\Http\Controllers\Api\AuthController` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** use / استيراد الاسم `App\Http\Controllers\Api\AdminController` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 7:** use / استيراد الاسم `App\Http\Controllers\Api\MenuController` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 8:** use / استيراد الاسم `App\Http\Controllers\Api\OrderController` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php
use App\Http\Controllers\Api\OrderTrackingController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\StaffOrderController;
use Illuminate\Support\Facades\Route;

Route::prefix('api')->group(function () {
    Route::get('/menu', [MenuController::class, 'index']);

```

**السطر 9:** use / استيراد الاسم `App\Http\Controllers\Api\OrderTrackingController` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 10:** use / استيراد الاسم `App\Http\Controllers\Api\PaymentController` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 11:** use / استيراد الاسم `App\Http\Controllers\Api\StaffOrderController` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 12:** use / استيراد الاسم `Illuminate\Support\Facades\Route` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 14:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `Route::prefix(...)`: تسجّل/تضبط route باستخدام prefix؛ ده تعريف لاستقبال request لاحق، مش query قراءة DB الآن. مدخلاتها: URI/handler أو إعداد المجموعة كما هو مكتوب. العائد/الأثر: Route أو registrar حسب method، أو نتيجة التسجيل؛ ليست قائمة orders.؛ `->group(...)`: تجمع تعريفات routes تحت إعدادات مشتركة. مدخلاتها: callback أو ملف routes. العائد/الأثر: تسجل التعريفات؛ مش payload مستخدم.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 15:** سجّل Route: طلب `GET` على `/menu` يشغّل method `index` من `MenuController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

### السطور 17–24

```php
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/track/{token}', [OrderTrackingController::class, 'show'])->middleware('throttle:60,1');
    Route::post('/payments/intents', [PaymentController::class, 'createIntent']);
```

**السطر 17:** سجّل Route: طلب `GET` على `/auth/me` يشغّل method `me` من `AuthController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 18:** سجّل Route: طلب `POST` على `/auth/login` يشغّل method `login` من `AuthController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 19:** سجّل Route: طلب `POST` على `/auth/register` يشغّل method `register` من `AuthController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 20:** سجّل Route: طلب `POST` على `/auth/logout` يشغّل method `logout` من `AuthController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 22:** سجّل Route: طلب `POST` على `/orders` يشغّل method `store` من `OrderController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 23:** سجّل Route: طلب `GET` على `/orders/track/{token}` يشغّل method `show` من `OrderTrackingController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 24:** سجّل Route: طلب `POST` على `/payments/intents` يشغّل method `createIntent` من `PaymentController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

### السطور 25–32

```php
    Route::post('/payments/webhook', [PaymentController::class, 'webhook']);

    Route::middleware('auth')->group(function () {
        Route::get('/orders/history', [OrderTrackingController::class, 'history']);
        Route::post('/orders/{order}/reorder', [OrderTrackingController::class, 'reorder']);
    });

    Route::middleware(['auth', 'role:staff,admin'])->prefix('staff')->group(function () {
```

**السطر 25:** سجّل Route: طلب `POST` على `/payments/webhook` يشغّل method `webhook` من `PaymentController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 27:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `Route::middleware(...)`: تسجّل/تضبط route باستخدام middleware؛ ده تعريف لاستقبال request لاحق، مش query قراءة DB الآن. مدخلاتها: URI/handler أو إعداد المجموعة كما هو مكتوب. العائد/الأثر: Route أو registrar حسب method، أو نتيجة التسجيل؛ ليست قائمة orders.؛ `->group(...)`: تجمع تعريفات routes تحت إعدادات مشتركة. مدخلاتها: callback أو ملف routes. العائد/الأثر: تسجل التعريفات؛ مش payload مستخدم.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 28:** سجّل Route: طلب `GET` على `/orders/history` يشغّل method `history` من `OrderTrackingController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 29:** سجّل Route: طلب `POST` على `/orders/{order}/reorder` يشغّل method `reorder` من `OrderTrackingController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 30:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 32:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `Route::middleware(...)`: تسجّل/تضبط route باستخدام middleware؛ ده تعريف لاستقبال request لاحق، مش query قراءة DB الآن. مدخلاتها: URI/handler أو إعداد المجموعة كما هو مكتوب. العائد/الأثر: Route أو registrar حسب method، أو نتيجة التسجيل؛ ليست قائمة orders.؛ `->prefix(...)`: تضيف جزءًا ثابتًا لبداية المسارات. مدخلاتها: prefix text. العائد/الأثر: registrar.؛ `->group(...)`: تجمع تعريفات routes تحت إعدادات مشتركة. مدخلاتها: callback أو ملف routes. العائد/الأثر: تسجل التعريفات؛ مش payload مستخدم.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 33–40

```php
        Route::get('/orders', [StaffOrderController::class, 'index']);
        Route::get('/orders/{order}', [StaffOrderController::class, 'show']);
        Route::patch('/orders/{order}/status', [StaffOrderController::class, 'updateStatus']);
    });

    Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/catalog', [AdminController::class, 'catalog']);
```

**السطر 33:** سجّل Route: طلب `GET` على `/orders` يشغّل method `index` من `StaffOrderController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 34:** سجّل Route: طلب `GET` على `/orders/{order}` يشغّل method `show` من `StaffOrderController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 35:** سجّل Route: طلب `PATCH` على `/orders/{order}/status` يشغّل method `updateStatus` من `StaffOrderController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 36:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 38:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `Route::middleware(...)`: تسجّل/تضبط route باستخدام middleware؛ ده تعريف لاستقبال request لاحق، مش query قراءة DB الآن. مدخلاتها: URI/handler أو إعداد المجموعة كما هو مكتوب. العائد/الأثر: Route أو registrar حسب method، أو نتيجة التسجيل؛ ليست قائمة orders.؛ `->prefix(...)`: تضيف جزءًا ثابتًا لبداية المسارات. مدخلاتها: prefix text. العائد/الأثر: registrar.؛ `->group(...)`: تجمع تعريفات routes تحت إعدادات مشتركة. مدخلاتها: callback أو ملف routes. العائد/الأثر: تسجل التعريفات؛ مش payload مستخدم.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 39:** سجّل Route: طلب `GET` على `/dashboard` يشغّل method `dashboard` من `AdminController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 40:** سجّل Route: طلب `GET` على `/catalog` يشغّل method `catalog` من `AdminController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

### السطور 41–48

```php
        Route::post('/products', [AdminController::class, 'storeProduct']);
        Route::post('/products/{menuItem}', [AdminController::class, 'updateProduct']);
        Route::delete('/products/{menuItem}', [AdminController::class, 'disableProduct']);
        Route::post('/categories', [AdminController::class, 'storeCategory']);
        Route::put('/categories/{category}', [AdminController::class, 'updateCategory']);
        Route::get('/branches', [AdminController::class, 'branches']);
        Route::put('/branches/{branch}', [AdminController::class, 'updateBranch']);
        Route::get('/staff', [AdminController::class, 'staff']);
```

**السطر 41:** سجّل Route: طلب `POST` على `/products` يشغّل method `storeProduct` من `AdminController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 42:** سجّل Route: طلب `POST` على `/products/{menuItem}` يشغّل method `updateProduct` من `AdminController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 43:** سجّل Route: طلب `DELETE` على `/products/{menuItem}` يشغّل method `disableProduct` من `AdminController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 44:** سجّل Route: طلب `POST` على `/categories` يشغّل method `storeCategory` من `AdminController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 45:** سجّل Route: طلب `PUT` على `/categories/{category}` يشغّل method `updateCategory` من `AdminController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 46:** سجّل Route: طلب `GET` على `/branches` يشغّل method `branches` من `AdminController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 47:** سجّل Route: طلب `PUT` على `/branches/{branch}` يشغّل method `updateBranch` من `AdminController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 48:** سجّل Route: طلب `GET` على `/staff` يشغّل method `staff` من `AdminController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

### السطور 49–56

```php
        Route::post('/staff', [AdminController::class, 'storeStaff']);
        Route::put('/staff/{user}', [AdminController::class, 'updateStaff']);
        Route::put('/staff/{user}/password', [AdminController::class, 'resetPassword']);
        Route::get('/orders', [AdminController::class, 'orders']);
        Route::get('/orders/export', [AdminController::class, 'exportOrders']);
        Route::get('/customers', [AdminController::class, 'customers']);
        Route::get('/settings', [AdminController::class, 'settings']);
        Route::put('/settings', [AdminController::class, 'updateSettings']);
```

**السطر 49:** سجّل Route: طلب `POST` على `/staff` يشغّل method `storeStaff` من `AdminController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 50:** سجّل Route: طلب `PUT` على `/staff/{user}` يشغّل method `updateStaff` من `AdminController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 51:** سجّل Route: طلب `PUT` على `/staff/{user}/password` يشغّل method `resetPassword` من `AdminController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 52:** سجّل Route: طلب `GET` على `/orders` يشغّل method `orders` من `AdminController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 53:** سجّل Route: طلب `GET` على `/orders/export` يشغّل method `exportOrders` من `AdminController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 54:** سجّل Route: طلب `GET` على `/customers` يشغّل method `customers` من `AdminController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 55:** سجّل Route: طلب `GET` على `/settings` يشغّل method `settings` من `AdminController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 56:** سجّل Route: طلب `PUT` على `/settings` يشغّل method `updateSettings` من `AdminController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

### السطور 57–64

```php
        Route::get('/audit', [AdminController::class, 'audit']);
    });
});

Route::get('/{view?}', function () {
    return view('app');
})->where('view', '^(?!api).*$');

```

**السطر 57:** سجّل Route: طلب `GET` على `/audit` يشغّل method `audit` من `AdminController::class`. لو السطر جوّه prefix أو middleware فإعدادات المجموعة تنطبق عليه كمان؛ التسجيل مش تنفيذ الـcontroller دلوقتي.

**السطر 58:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 59:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 61:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `Route::get(...)`: تسجّل/تضبط route باستخدام get؛ ده تعريف لاستقبال request لاحق، مش query قراءة DB الآن. مدخلاتها: URI/handler أو إعداد المجموعة كما هو مكتوب. العائد/الأثر: Route أو registrar حسب method، أو نتيجة التسجيل؛ ليست قائمة orders.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 62:** return تعيد التعبير `view('app')` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 63:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->where(...)`: تضيف شرط فلترة أو مجموعة شروط. مدخلاتها: column/operator/value أو closure. العائد/الأثر: Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
