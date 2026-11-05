# خمس رحلات كاملة في Backend مشروع البيتزا — من ضغطة المستخدم لحد النتيجة

المشروع: `D:/01-Work/Projects/pizza-crm`.

اقرأ رحلة واحدة في المرة. الكود المكتوب تحت «مقتطف حرفي» من الملفات نفسها؛ الدالة كاملة لو قولنا دالة كاملة، ومش معنى مقتطف إنك تستبدل بيه الملف كله. الربط بين الملفات جزء من المثال، مش واجب عليك تتخيله.

**شرط مهم قبل البداية:** الرحلات دي تخص نسخة Laravel الحقيقية، مش النسخة static اللي فيها `VITE_DEMO_MODE`. في `resources/js/lib/api.js` يوجد فرع بيحوّل الطلبات لـ `demoFetch` لما demo mode=true. الفرع ده بيحاكي backend في المتصفح؛ مبيسجلش طلبات في Laravel DB ومبيحصّلش فلوس.

## الرحلة 1 — Login: من الفورم إلى Session ثم رجوع بيانات المستخدم

**الهدف:** المستخدم يكتب email/password ويضغط Login. عايزين نفهم مين بيبعت ومين بيتحقق ومين بيغيّر الشاشة.

### أ. الزر مش بيكلم Laravel لوحده

المصدر: `pizza-crm/resources/js/Pages/Auth/Login.jsx` — مقتطف حرفي من JSX:

```jsx
<Form onSubmit={submitLogin}>
```

`onSubmit` اسم حدث React للفورم. `submitLogin` هنا مرجع الدالة، مش ناتج تشغيلها. لما المستخدم يضغط زر type=submit أو يرسل الفورم بالكيبورد، React تناديها ومعاها event.

نفس الملف — دالة فعلية كاملة:

```js
const submitLogin = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
        const user = await login(form);
        navigate(user.role === 'admin' ? '/admin' : user.role === 'staff' ? '/staff' : '/menu', { replace: true });
    } catch (requestError) {
        setError(requestError.message);
    } finally {
        setIsSubmitting(false);
    }
};
```

سطر سطر:

- `async (event) =>`: دالة asynchronous بتستقبل حدث الفورم. `async` يجعل استدعاء الدالة يرجّع Promise، ويسمح بكتابة `await` داخلها.
- `event.preventDefault()`: method من browser event؛ تمنع إرسال HTML التقليدي اللي ممكن يعيد تحميل الصفحة. مفيش request اتبعتت بالسطر ده.
- `setError('')`: setter من React `useState` يمسح رسالة محاولة قديمة.
- `setIsSubmitting(true)`: يغيّر state اللي الزر بيستخدمها لعرض Logging in وتعطيل الضغط المتكرر.
- `try`: الجزء اللي ممكن يحصل فيه request failure.
- `await login(form)`: نادِ دالة login الموجودة في AuthContext، وابعت object الفورم. `await` ينتظر نتيجة الوعد داخل الدالة، لكنه مش بيجمّد المتصفح كله.
- `const user`: ده المستخدم العائد من login، مش user مدخلة من الفورم.
- `navigate(...)`: method من React Router. الـ ternary يختار صفحة حسب role. `replace:true` يستبدل عنوان login في history بدل إضافته كخطوة جديدة.
- `catch (requestError)`: لو request أو login رمت error، امسكه بدل انهيار المسار.
- `requestError.message`: النص اللي بيقرأه المستخدم من Error object.
- `finally`: يتنفذ في النجاح والفشل؛ يرجّع isSubmitting=false علشان الزر يشتغل.

### ب. دالة login موجودة في ملف تاني فعلًا

المصدر: `pizza-crm/resources/js/context/AuthContext.jsx` — مقتطف حرفي من object القيمة اللي Provider بيوفرها:

```js
login: async (credentials) => {
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
},
```

- `credentials`: parameter تستقبل نفس object اسمها `form` في الملف السابق. تغيير اسم parameter مش تغيير للبيانات.
- `authRequestVersion.current += 1`: زوّد رقم النسخة المخزن في `useRef`. ده بيساعد الطلب الأول `/auth/me` ما يكتبش نتيجة قديمة بعد login أحدث.
- `csrfFetch`: **دالة مشروع كتبناها**، مش browser method. مصدرها `resources/js/lib/api.js`.
- `/api/auth/login`: العنوان اللي هيروح Laravel لو demo mode=false.
- `method:'POST'`: عملية إرسال بيانات، مش GET لقراءة صفحة.
- `JSON.stringify(credentials)`: JavaScript built-in يحوّل object إلى JSON string علشان body الشبكة.
- `flushSync`: React DOM helper يجبر state updates داخل callback تتطبق بشكل متزامن هنا قبل الاعتماد عليها في الانتقال. مش مطلوب ترشّه على كل state update؛ استخدامه حالة خاصة.
- `setUser(response.user)`: خزّن بيانات المستخدم اللي أكدها السيرفر، مش البيانات اللي ادعاها المتصفح.
- `return response.user`: دي القيمة اللي `await login(form)` في الملف السابق هيوصلها.

### ج. وسيط الشبكة — مش هنسيب csrfFetch كلمة غامضة

المصدر: `pizza-crm/resources/js/lib/api.js` — الدالة حرفية كاملة:

```js
export async function csrfFetch(url, options = {}) {
    if (import.meta.env.VITE_DEMO_MODE === 'true') {
        const { demoFetch } = await import('../demo/api');
        return demoFetch(url, options);
    }
    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');

    const isFormData = options.body instanceof FormData;
    const headers = {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
    };

    if (csrfToken) {
        headers['X-CSRF-TOKEN'] = csrfToken;
    }

    const response = await fetch(url, {
        credentials: 'same-origin',
        ...options,
        headers,
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const payload = isJson ? await response.json() : null;

    if (payload?.csrf_token) {
        document.querySelector('meta[name="csrf-token"]')?.setAttribute('content', payload.csrf_token);
    }

    if (!response.ok) {
        const message = payload?.message || 'Something went wrong. Please try again.';
        const error = new Error(message);
        error.payload = payload;
        throw error;
    }

    return payload;
}
```

الأوامر الرئيسية بالترتيب:

- `export`: يخلي ملفات تانية تقدر تعمل import للدالة. `url` العنوان و`options={}` إعدادات اختيارية default بتاعتها object فاضي.
- `import.meta.env...`: متغير build من Vite. المقارنة مع النص `'true'`، مش Boolean true. الـ `return demoFetch` تنهي المسار هنا؛ بالتالي مفيش backend حقيقي في الفرع التجريبي.
- `await import('../demo/api')`: dynamic import يرجّع Promise للوحدة؛ destructuring يطلع منها demoFetch.
- `document.querySelector(...)`: browser method تختار أول meta مطابقة. `?.getAttribute` تقرأ content بس لو العنصر موجود؛ بدل error لو null.
- `options.body instanceof FormData`: هل body عبارة عن FormData فيها ملفات؟ النتيجة Boolean.
- `Accept`: بنطلب JSON في response. `Content-Type` بيصف اللي إحنا بنبعته، مش اللي راجع.
- `...(isFormData ? {} : {...})`: spread شرطية؛ مع FormData منضبطش Content-Type يدويًا، لأن المتصفح لازم يضيف multipart boundary بنفسه.
- `...options.headers`: ادمج headers إضافية، زي Idempotency-Key في رحلة الدفع.
- `headers['X-CSRF-TOKEN']=...`: bracket notation لإضافة header اسمها فيه شرطات؛ بتوصل session token للسيرفر.
- `fetch`: browser method تبعت HTTP وترجع Promise لـ Response، مش JSON مباشرة.
- `credentials:'same-origin'`: تسمح بإرسال session cookies للطلبات من نفس الـ origin؛ هي جزء من استمرار login.
- `response.headers.get`: اقرأ نوع الرد. `includes`: هل النص يحتوي application/json؟
- `response.json()`: method asynchronous تقرأ body وتعمل parsing؛ ترجع Promise لقيمة JavaScript. دي مختلفة عن PHP `response()->json()` اللي بتبني الرد.
- `payload?.csrf_token`: لو السيرفر رجّع token جديدة حدّث meta علشان الطلب التالي يستخدمها.
- `response.ok`: true للـ HTTP status من 200 إلى299. `fetch` عادةً مش بترمي exception لمجرد status422/401؛ إحنا اللي بنحوّلها لـ Error.
- `new Error(message)`: أنشئ Error object. `error.payload=payload`: أضف بيانات validation علشان الواجهة تقدر تقرأ errors.
- `throw error`: ارفض async function؛ الدالة المستدعية تدخل catch.
- `return payload`: النجاح يرجّع JSON parsed للمستدعي؛ مش HTML.

### د. Laravel يستقبل request

المصدر: `pizza-crm/routes/web.php` — السطر حرفي داخل `Route::prefix('api')`:

```php
Route::post('/auth/login', [AuthController::class, 'login']);
```

`post` تسجل route لHTTP POST؛ الـ prefix يخلي URL النهائية `/api/auth/login`. المصفوفة تحدد class واسم method. Laravel هو اللي ينشئ controller ويحقن Request.

المصدر: `pizza-crm/app/Http/Controllers/Api/AuthController.php` — دالة كاملة حرفية:

```php
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
```

- `public`: Laravel يقدر ينادي method من route. `function login`: دالة مخصصة بالمشروع، مش built-in PHP.
- `Request $request`: type hint؛ container يوفر request الحالية. `$` بداية اسم متغير PHP. `:JsonResponse` نوع القيمة المطلوبة من الدالة عند رجوعها طبيعيًا.
- `->validate`: method Laravel تاخد rules وتعيد verified array، أو ترمي ValidationException لو المدخل غلط. `required` يعني مطلوب، و`email` صيغة إيميل، و`string` نص.
- `(bool)`: cast إلى Boolean. `boolean('remember')` أصلاً method تقرأ field كقيمة منطقية؛ cast هنا تأكيد زائد مش method جديدة.
- `Auth::attempt`: method في Laravel تتحقق من الحساب وpassword hash وتحاول تسجيله. `::` استدعاء static-style عبر Facade، مختلف عن `->` على object.
- `!`: اعكس نتيجة النجاح. لو false، نكوّن أخطاء بـ `withMessages` ونرميها بـ throw.
- `user()->is_active`: بعد login نراجع نشاط الحساب. لو معطل نعمل logout ونرفض. إخفاء صفحة account في React مش كفاية للصلاحيات.
- `session()->regenerate`: جدّد session ID بعد الدخول لمواجهة session fixation؛ مش مجرد تغيير لون/متغير frontend.
- `load('branch')`: eager-load علاقة الفرع على User موجودة علشان الواجهة تعرف موظف تابع لأي فرع.
- `response()->json`: تبني HTTP JSON response. مفيش status محددة هنا، فتكون200 افتراضيًا.
- `csrf_token()`: Laravel helper يقرأ token الجلسة؛ ملوش علاقة بمفتاح Stripe.

### هـ. رجوع النتيجة

الرد يعدي `csrfFetch` ثم `AuthContext.login` ثم `submitLogin`. البيانات تظهر في React state وتحدد صفحة المستخدم.

**تطبيق يدوي:** افتح DevTools > Network ثم سجّل الدخول بحساب تجريبي تملكه. راقب POST login وresponse user. متطبعش password أو session cookie في screenshots. لو الإيميل غلط تتوقع validation response، وcatch تعرض message.

**سؤال إنترفيو:** هل JWT مستخدمة هنا؟ لا؛ ده session/cookie auth مع CSRF. role check في الواجهة تجربة استخدام، والتفويض الحقيقي في backend middleware.

## الرحلة 2 — Cash checkout: السلة تبعت IDs والسيرفر يحسب السعر

### أ. بناء الـ payload من الواجهة

المصدر: `pizza-crm/resources/js/Pages/Cart.jsx` — مقتطفان حرفيان مرتبطان:

```js
const buildPayload = () => ({
    branch_id: Number(selectedBranchId),
    order_type: orderType,
    customer_name: customer.name,
    customer_phone: customer.phone,
    delivery_address: orderType === 'delivery' ? [deliveryArea, deliveryAddress].filter(Boolean).join(', ') : null,
    pickup_time: orderType === 'pickup' ? customer.pickupTime : null,
    payment_method: paymentMethod,
    items: cartItems.map((item) => ({ menu_item_id: item.id, quantity: item.quantity, notes: item.notes || null })),
});

const submitCashOrder = async () => {
    setMessage('');
    setIsSubmitting(true);
    try {
        const response = await csrfFetch('/api/orders', { method: 'POST', body: JSON.stringify(buildPayload()) });
        clearCart();
        navigate(response.tracking_url);
    } catch (error) {
        setMessage(error.payload?.errors ? Object.values(error.payload.errors).flat()[0] : error.message);
    } finally { setIsSubmitting(false); }
};
```

- `() => ({...})`: arrow function ترجع object مباشرة. الأقواس الخارجية تمنع تفسير `{}` كجسم دالة بلا return.
- `Number(selectedBranchId)`: built-in JS يحوّل قيمة اختيار الفرع لرقم؛ السيرفر يعيد validation، فده مش حاجز أمني.
- `condition ? a : b`: ternary يرسل عنوانًا للتوصيل ووقتًا للاستلام فقط، وإلا null.
- `[deliveryArea, deliveryAddress].filter(Boolean)`: احذف القيم الفاضية من أجزاء العنوان. `.join(', ')` تحوّل أجزاء القائمة لنص واحد بفاصلة.
- `cartItems.map`: ترجع array جديدة شكل كل سطر فيها id/quantity/notes فقط. السعر الظاهر في السلة **مش مصدر حساب الطلب على السيرفر**.
- `notes || null`: لو الملاحظة falsy ابعت null بدل نص فاضي.
- `JSON.stringify(buildPayload())`: شغل builder أولًا، ثم حوّل النتيجة لـJSON؛ مختلف عن تمرير اسم الدالة كـ callback.
- `clearCart`: دالة نفس الملف تمسح React cartItems وتكتب سلة فاضية في localStorage؛ بتتشغّل بعد نجاح request فقط.
- `navigate(response.tracking_url)`: افتح عنوان التتبع اللي السيرفر ولّده.
- `Object.values(...).flat()[0]`: هات arrays أخطاء الحقول، افردهم مستوى واحد، واعرض أول رسالة. لو مفيش errors استخدم error.message.
- `finally`: رجّع الزر لحالته بعد أي نتيجة.

### ب. route ثم validation قبل controller

المصدر: `pizza-crm/routes/web.php` — مقتطف حرفي:

```php
Route::post('/orders', [OrderController::class, 'store']);
```

المصدر: `pizza-crm/app/Http/Requests/StoreOrderRequest.php` — دالة rules كاملة حرفية:

```php
public function rules(): array
{
    return [
        'branch_id' => ['required', 'integer', 'exists:branches,id'],
        'order_type' => ['required', Rule::in(['delivery', 'pickup', 'dine_in'])],
        'customer_name' => ['required', 'string', 'min:2', 'max:100'],
        'customer_phone' => ['required', 'string', 'max:40'],
        'delivery_address' => ['nullable', 'required_if:order_type,delivery', 'string', 'max:500'],
        'pickup_time' => ['nullable', 'required_if:order_type,pickup', 'date'],
        'payment_method' => ['required', Rule::in(['cash', 'card'])],
        'idempotency_key' => ['nullable', 'string', 'max:100'],
        'items' => ['required', 'array', 'min:1'],
        'items.*.menu_item_id' => ['required', 'integer', 'exists:menu_items,id'],
        'items.*.quantity' => ['required', 'integer', 'min:1', 'max:20'],
        'items.*.notes' => ['nullable', 'string', 'max:200'],
    ];
}
```

`rules` callback اسم معروف للـ FormRequest. `return [...]` بيرجع خريطة field=>rules؛ مبيعملش insert. `Rule::in` يقبل القيم المذكورة فقط. `exists:branches,id` يراجع وجود ID في DB، لكن نشاط الفرع وإتاحة المنتج business rules لاحقة. `items.*` معناها كل عنصر داخل array items، مش string حرفية اسمها نجمة. `required_if` يطلب قيمة حسب نوع الطلب. `nullable` يسمح بـnull لكنه مش يلغي required_if وقت تحقق شرطه.

نفس FormRequest عندها `after()` تراجع minimum pickup prep time. دي تكملة مهمة: قبول نوع date مش كفاية؛ الطلب بعد10دقائق قد يترفض حتى لو صيغة التاريخ صحيحة. جزء فحص opening hours يعتمد على opens_at/closes_at لو موجودين، ومش مفروض ندعي إن string opening_hours لوحدها بتفعّل التحقق ده.

### ج. controller قصير لأنه بيسلّم الشغل لخدمة

المصدر: `pizza-crm/app/Http/Controllers/Api/OrderController.php` — دالة كاملة حرفية:

```php
public function store(StoreOrderRequest $request, OrderCreator $creator): JsonResponse
{
    $data = $request->validated();
    if ($data['payment_method'] === 'card') {
        throw ValidationException::withMessages(['payment_method' => ['Card orders must use the payment intent endpoint.']]);
    }

    $order = $creator->create($data, $request->user(), Order::STATUS_NEW);
    OrderPlaced::dispatch($order);

    return response()->json([
        'message' => 'Order created successfully.',
        'order' => $order,
        'tracking_token' => $order->tracking_token,
        'tracking_url' => "/orders/{$order->tracking_token}",
    ], 201);
}
```

- `StoreOrderRequest $request`: Laravel يراجع authorization/validation قبل دخول جسم method. لو فشل مش هنوصل لـcreate.
- `OrderCreator $creator`: dependency injection؛ كلاس service الخاص بالمشروع. مش Model::create.
- `validated()`: هات البيانات المقبولة، مش كل input خام.
- `=== 'card'`: strict equality في PHP. الدفع بالكارت ملوش حق يدخل endpoint الكاش ويتظاهر إنه paid.
- `$creator->create(...)`: ابعت data والمستخدم أوnull وحالة new.
- `OrderPlaced::dispatch`: أطلق event بعد انتهاء create؛ مش معناه إن React بتستمع websocket تلقائيًا.
- `tracking_url`: PHP string interpolation يضع token داخل الرابط.
- `201`: HTTP Created؛ مش رقم order.

### د. تكملة create داخل ملف الخدمة، مش هنقف عند اسمها

المصدر: `pizza-crm/app/Services/Orders/OrderCreator.php` — دالة كاملة حرفية:

```php
public function create(array $data, ?User $user, string $status): Order
{
    return DB::transaction(function () use ($data, $user, $status) {
        $branch = Branch::query()->where('is_active', true)->findOrFail($data['branch_id']);
        if ($data['order_type'] === 'delivery' && ! $branch->delivery_enabled) {
            throw ValidationException::withMessages([
                'branch_id' => ['This branch is not accepting delivery orders right now.'],
            ]);
        }
        $order = Order::create([
            'user_id' => $user?->id,
            'branch_id' => $branch->id,
            'order_type' => $data['order_type'],
            'pickup_time' => $data['order_type'] === 'pickup' ? $data['pickup_time'] : null,
            'customer_name' => $data['customer_name'],
            'customer_phone' => $data['customer_phone'],
            'delivery_address' => $data['order_type'] === 'delivery' ? $data['delivery_address'] : null,
            'payment_method' => $data['payment_method'],
            'payment_status' => $data['payment_method'] === 'card' ? 'pending' : 'unpaid',
            'status' => $status,
            'idempotency_key' => $data['idempotency_key'] ?? null,
            'tracking_token' => Str::random(48),
            'total_price' => 0,
        ]);

        $total = 0;
        foreach ($data['items'] as $line) {
            $menuItem = MenuItem::query()
                ->where('is_active', true)
                ->whereHas('category', fn ($query) => $query->where('is_active', true))
                ->find($line['menu_item_id']);
            $pivot = DB::table('branch_menu_item')
                ->where('branch_id', $branch->id)
                ->where('menu_item_id', $line['menu_item_id'])
                ->first();

            if (! $menuItem || ! $pivot || ! $pivot->is_available) {
                throw ValidationException::withMessages([
                    'items' => ["Menu item {$line['menu_item_id']} is unavailable at {$branch->name}."],
                ]);
            }

            $price = (float) $pivot->price;
            $quantity = (int) $line['quantity'];
            $total += $price * $quantity;
            $order->items()->create([
                'menu_item_id' => $line['menu_item_id'],
                'item_name' => $menuItem->name,
                'quantity' => $quantity,
                'price' => $price,
                'notes' => $line['notes'] ?? null,
            ]);
        }

        if ($data['order_type'] === 'delivery') {
            $total += (float) $branch->delivery_fee;
        }

        $order->update(['total_price' => $total]);

        return $order->load(['branch', 'user', 'items.menuItem']);
    });
}
```

امشِ عليها بالترتيب:

1. `array $data`: البيانات المحققة. `?User`: User أوnull، لأن الضيف مسموح. `string $status`: controller يحدد new أوpayment_pending. `:Order`: النجاح يرجع موديل Order.
2. `return DB::transaction(...)`: transaction تشغّل callback؛ لو exception حصل rollback لكتابات DB داخلها. قيمة return من callback هي اللي transaction ترجعها، ثم الدالة create ترجعها للcontroller.
3. `function () use (...)`: PHP closure؛ `use` بتدخل المتغيرات الخارجية في نطاق الدالة الداخلية. دي مش import classes اللي فوق الملف.
4. `Branch::query()->where(...)->findOrFail(...)`: ابحث عن الفرع النشط بالid؛ لو مش موجود404. `query/where` بيبنوا query وfindOrFail تنفذ.
5. `&& !delivery_enabled`: لو delivery والفرع موقفها، ارم validation error. وجود الفرع في DB وحده مش كفاية.
6. `Order::create([...])`: اعمل row مبدئية. `$user?->id` null-safe access للضيف. حقول العنوان والوقت تتحدد حسب order_type.
7. `idempotency_key ?? null`: استخدم المفتاح لو موجود وغيرnull؛ مش نفس `||` في JS.
8. `Str::random(48)`: Laravel helper يولد token عشوائية؛ تخمين order IDs مش وسيلة التتبع العامة هنا.
9. `total_price=>0`: بداية مؤقتة داخل transaction؛ بنحدّثه بعد جمع البنود.
10. `foreach`: مرة لكل line في items. `$line` فيها id/quantity/notes مش السعر الموثوق.
11. `whereHas('category', fn...)`: المنتج لازم category بتاعته نشطة كمان. PHP arrow `fn` تعيد expression مباشرة.
12. `find` ترجع Model أوnull؛ لذلك فيه if بعدها. دي مش `findOrFail` في هذا الموضع.
13. `DB::table('branch_menu_item')`: السعر الفعلي يتقرأ من pivot المطابقة للفرع والمنتج، و`first()` يرجع object أوnull.
14. `||` داخل شرط الرفض معناها OR: منتج مش موجود أوpivot مش موجودة أوis_available=false؛ أي واحد يوقف العملية.
15. `(float)` و`(int)`: casts للأرقام قبل الحساب. `$total += ...` اختصار `$total=$total+...`.
16. `$order->items()->create`: استخدم علاقة HasMany لإنشاء بند مرتبط بالـ order؛ Laravel يملأ order_id من العلاقة.
17. `item_name`: snapshot لاسم وقت الطلب. لو اسم المنتج اتغير بعدين، الطلب القديم يفضل واضح. السعر نفس الفكرة.
18. `notes ?? null`: ملاحظة اختيارية.
19. بعد الحلقة، أضف delivery_fee من الفرع مرة واحدة لو توصيل، مش لكل بند.
20. `update(['total_price'=>$total])`: احفظ الإجمالي النهائي.
21. `load`: حمّل العلاقات اللي JSON محتاجها. `items.menuItem` nested relation؛ مش اسم عمود فيه نقطة.

**النتيجة:** DB order+items محفوظين، token/url راجعين للواجهة، السلة تتفضى، وصفحة التتبع تحمل الطلب. مثال حساب توضيحي: سعر200 وكمية2 ورسوم25 =>425؛ الأرقام هنا حساب تدريبي وليست سعر صنف بعينه.

**سؤال إنترفيو:** ليه السعر من DB؟ لأن العميل يقدر يعدّل JavaScript/request. validation الشكلية مش بديل حساب business totals على السيرفر.

## الرحلة 3 — Card payment: ليه محتاجين intent وبعده webhook؟

### أ. طلب intent من الواجهة ثم تأكيد الكارت

المصدر: `pizza-crm/resources/js/Pages/Cart.jsx` — دالة pay حرفية داخل CardCheckout:

```js
const pay = async () => {
    if (!stripe || !elements || processing) return;
    setProcessing(true);
    onMessage('');
    const idempotencyKey = crypto.randomUUID();
    try {
        const response = await csrfFetch('/api/payments/intents', {
            method: 'POST',
            headers: { 'Idempotency-Key': idempotencyKey },
            body: JSON.stringify({ ...payload(), payment_method: 'card', idempotency_key: idempotencyKey }),
        });
        const result = await stripe.confirmCardPayment(response.client_secret, {
            payment_method: { card: elements.getElement(CardElement) },
        });
        if (result.error) throw new Error(result.error.message);
        onMessage(`Payment received. Order #${response.order_id} is being confirmed.`);
        onSuccess(response.tracking_url);
    } catch (error) {
        onMessage(error.message || 'Card payment failed. Please try again.');
    } finally {
        setProcessing(false);
    }
};
```

- الحارس `if (...) return`: لو SDK مش جاهزة أو فيه معالجة شغالة، متكملش.
- `crypto.randomUUID`: browser API يولد request identity؛ الكود بيولد واحدة لكل محاولة pay. المفتاح مش id المستخدم ومش key Stripe السري.
- `...payload()`: نفّذ الدالة لبناء order data، ثم spread خصائصها؛ عدّل payment_method إلىcard.
- `csrfFetch`: الدالة اللي شرحناها في الرحلة1، مش helper جديدة. بترجع JSON أو ترمي Error.
- `stripe.confirmCardPayment`: method من Stripe JS بتستخدم client_secret وCardElement. تفاصيل البطاقة تُتعامل من خلال Stripe Elements بدل حقل عادي يتحفظ عندنا.
- `elements.getElement(CardElement)`: هات عنصر Stripe المسجل، مش DOM query عادي.
- `result.error`: SDK ممكن ترجع object فيها error بدل throw؛ الكود يحولها إلى throw عشان catch واحدة.
- `onSuccess`: callback من الأب تفتح التتبع وتحدث السلة؛ **مش بتكتب paid في DB**.

### ب. Backend يبدأ intent ولا يعلن paid

المصدر: `pizza-crm/app/Http/Controllers/Api/PaymentController.php` — دالة كاملة حرفية:

```php
public function createIntent(StoreOrderRequest $request, OrderCreator $creator, PaymentGateway $gateway): JsonResponse
{
    $data = $request->validated();
    if ($data['payment_method'] !== 'card') {
        throw ValidationException::withMessages(['payment_method' => ['Select card payment to create a payment intent.']]);
    }

    $key = $request->header('Idempotency-Key') ?: ($data['idempotency_key'] ?? null);
    if (! $key) {
        throw ValidationException::withMessages(['idempotency_key' => ['An idempotency key is required.']]);
    }

    if ($existing = Order::where('idempotency_key', $key)->first()) {
        return response()->json([
            'order_id' => $existing->id,
            'tracking_token' => $existing->tracking_token,
            'tracking_url' => "/orders/{$existing->tracking_token}",
            'client_secret' => null,
            'message' => 'This payment request has already been created.',
        ], 409);
    }

    $data['idempotency_key'] = $key;
    $order = $creator->create($data, $request->user(), Order::STATUS_PAYMENT_PENDING);

    try {
        $intent = $gateway->createIntent(
            (int) round(((float) $order->total_price) * 100),
            'egp',
            ['order_id' => (string) $order->id],
            $key,
        );
        $order->update(['payment_gateway' => 'stripe', 'gateway_reference' => $intent['id']]);
    } catch (Throwable $exception) {
        $order->delete();
        report($exception);

        return response()->json(['message' => 'Card payment could not be started.'], 502);
    }

    return response()->json([
        'order_id' => $order->id,
        'tracking_token' => $order->tracking_token,
        'tracking_url' => "/orders/{$order->tracking_token}",
        'client_secret' => $intent['client_secret'],
        'publishable_key' => config('services.stripe.key'),
    ], 201);
}
```

- `!== 'card'`: ارفض النوع المختلف؛ الكاش له endpoint تاني.
- `header(...) ?: (...)`: جرّب مفتاح header، ولو falsy استخدم حقل body؛ `??null` يحمي غياب الحقل.
- `if ($existing = ...)`: **assignment داخل الشرط**؛ خزّن أول طلب مطابق، ثم اختبر هل وجد Model. علامة واحدة `=` مش مقارنة.
- رد409 مع `client_secret:null`: التنفيذ الحالي يقول conflict؛ لا يستأنف Stripe intent قديمة من هذا الفرع. متوصفوش إنه retry resume كاملة.
- `$creator->create`: نفس الخدمة في رحلة2، لكن الحالة المبدئية payment_pending وpayment_status=pending.
- `PaymentGateway $gateway`: interface مش concrete class. provider فيه `$this->app->bind(PaymentGateway::class, StripePaymentGateway::class)`.
- `round(total*100)` ثم `(int)`: حوّل مبلغ EGP إلى أصغر وحدة متوقعة من gateway؛ 425.00=>42500.
- `['order_id'=>(string)...]`: metadata تربط Stripe بالـ order للمتابعة؛ string مطلوب هنا.
- `$intent['id']`: مرجع gateway يتخزن في DB. `client_secret` يرجع للمتصفح، أما secret API key لا.
- `catch(Throwable)`: يغطي Exceptions وأخطاء PHP التابعة للواجهة؛ يحذف order المبدئية ويبلغ logging ثم502. ده لا يساوي rollback لنداء خارجي ممكن يكون وصل بالفعل؛ production resilience موضوع منفصل.

### ج. التنفيذ يتكمّل داخل StripePaymentGateway

المصدر: `pizza-crm/app/Services/Payments/StripePaymentGateway.php` — دالتان كاملتان حرفيتان:

```php
public function createIntent(int $amount, string $currency, array $metadata, string $idempotencyKey): array
{
    $intent = (new StripeClient(config('services.stripe.secret')))->paymentIntents->create([
        'amount' => $amount,
        'currency' => $currency,
        'automatic_payment_methods' => ['enabled' => true],
        'metadata' => $metadata,
    ], ['idempotency_key' => $idempotencyKey]);

    return ['id' => $intent->id, 'client_secret' => $intent->client_secret];
}

public function parseWebhook(string $payload, string $signature): object
{
    return Webhook::constructEvent($payload, $signature, config('services.stripe.webhook_secret'));
}
```

- `new StripeClient(...)`: أنشئ SDK client باستخدام config secret؛ المثال لا يقرأ أو يطبع قيمة المفتاح.
- `->paymentIntents->create`: SDK operation تتواصل مع Stripe؛ تختلف عن `Order::create` التي تكتب DB المحلية رغم تشابه الاسم.
- أول array بيانات intent، والثانية request options ومنها idempotency key.
- `return ['id'=>..., 'client_secret'=>...]`: service ترجع array بسيطة بدل تمرير SDK object كله للcontroller.
- `Webhook::constructEvent`: تفحص signature باستخدام raw payload وwebhook secret؛ مش مجرد parsing JSON. ترجع Event object أو ترمي exception.

### د. webhook يغيّر الحالة النهائية

المصدر: `pizza-crm/app/Http/Controllers/Api/PaymentController.php` — دالة كاملة حرفية:

```php
public function webhook(Request $request, PaymentGateway $gateway): JsonResponse
{
    try {
        $event = $gateway->parseWebhook($request->getContent(), (string) $request->header('Stripe-Signature'));
    } catch (Throwable) {
        return response()->json(['message' => 'Invalid webhook signature.'], 400);
    }

    $intent = $event->data->object;
    $order = Order::where('gateway_reference', $intent->id ?? null)->first();
    if (! $order) {
        return response()->json(['received' => true]);
    }

    if ($event->type === 'payment_intent.succeeded' && $order->payment_status !== 'paid') {
        DB::transaction(function () use ($order): void {
            $from = $order->status;
            $order->update(['payment_status' => 'paid', 'status' => Order::STATUS_NEW]);
            OrderStatusLog::create([
                'order_id' => $order->id,
                'from_status' => $from,
                'to_status' => Order::STATUS_NEW,
                'created_at' => now(),
            ]);
        });
        OrderPlaced::dispatch($order->fresh());
    }

    if ($event->type === 'payment_intent.payment_failed') {
        $order->update(['payment_status' => 'failed']);
    }

    return response()->json(['received' => true]);
}
```

- `getContent`: raw request body، مهم لأن signature مرتبطة بالبايتات الأصلية.
- `(string) header`: header الغائبة تتحول نص فاضي؛ verification ترفضه.
- catch أول block يرجع400؛ مش بيكمّل اعتماد event غير موثوق.
- `$event->data->object`: Stripe event فيها object الـintent.
- `gateway_reference`: نفس الـid اللي حفظناه في createIntent. مفيش اعتماد على order_id مبعوت من العميل لتأكيد paid.
- `if(!$order) return received`: event غير مرتبط بطلب محفوظ ينتهي بدون تحديث.
- شرط succeeded ومعاه `payment_status!=='paid'`: يمنع إعادة نفس تغيير الحالة في إعادة الإرسال العادية المتتابعة.
- transaction تحفظ order+status log معًا، ثم dispatch باستخدام `fresh()` لإحضار أحدث بيانات.
- `payment_failed`: يتغير payment_status إلى failed؛ هنا مفيش مسح للطلب.
- `received:true`: acknowledgment إن السيرفر استقبل وعالج/تجاهل الحدث وفق الكود، مش إثبات دفع لأي order.

**حدود التطبيق الحالية:** فحص paid خارج lock، فمتقولش إنه exactly-once تحت كل concurrency. ومفاتيح/SDK موجودة في source لا تعني تكوين Stripe أو webhook على البيئة المنشورة فعلًا. الاختبار يستخدم fake gateway، مش transaction مالية حقيقية.

**سؤال إنترفيو:** ليه منغيّرش paid بعد onSuccess في React؟ لأن frontend قابل للتعديل، وممكن يقفل قبل انتهاء الدفع؛ backend يثق في verified webhook من provider.

## الرحلة 4 — Staff status: موظفين يضغطوا في نفس الوقت

### أ. الواجهة تبعت الحالة اللي كانت شايفاها

المصدر: `pizza-crm/resources/js/Pages/StaffDashboard.jsx` — دالة كاملة حرفية:

```js
const updateStatus = async (order, status, reason = null) => {
    setBusyOrders((current) => [...current, order.id]);
    try {
        const response = await csrfFetch(`/api/staff/orders/${order.id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status, reason, expected_status: order.status }),
        });
        setOrders((current) => current.map((item) => item.id === order.id ? response.order : item));
        setMessage(response.message);
        setReasonAction(null);
    } catch (error) {
        if (error.payload?.errors?.expected_status) {
            setMessage('Another staff member already moved this order. The board has been refreshed.');
            await loadOrders();
        } else {
            setMessage(error.payload?.errors ? Object.values(error.payload.errors).flat()[0] : error.message);
        }
    } finally {
        setBusyOrders((current) => current.filter((id) => id !== order.id));
    }
};
```

- parameters: `order` البطاقة الحالية، `status` المطلوبة، `reason=null` سبب اختياري.
- functional setter تاخد `current` أحدث array، وspread تضيف order.id لقائمة busy من غير تعديل array الأصلية.
- `PATCH`: تحديث جزء من المورد، مش إنشاء order جديدة.
- object shorthand `{status,reason}` اختصار `{status:status,reason:reason}`.
- `expected_status:order.status`: قول للسيرفر «أنا اتصرفت على أساس إن الطلب كان كده»؛ ده مش الحالة الجديدة.
- بعد النجاح `.map` تستبدل البطاقة المطابقة بالـ order الحقيقية الراجعة؛ باقي الكروت تفضل كما هي.
- لو response فيها expected_status error نعمل refresh عن طريق `loadOrders` الموجودة بنفس الملف؛ شرح الدالة والمؤقت في درس لوحة الموظف.
- finally تستخدم `.filter` لإزالة id من busy، سواء حصل نجاح أو فشل.

### ب. Route وFormRequest

المصدر: `pizza-crm/routes/web.php` — سطر حرفي داخل auth+role:staff,admin وprefix staff:

```php
Route::patch('/orders/{order}/status', [StaffOrderController::class, 'updateStatus']);
```

`{order}` route parameter؛ Laravel route model binding تجيب Order بالid للـcontroller. غياب السجل يسبب404 قبل منطق التحديث.

المصدر: `pizza-crm/app/Http/Requests/UpdateOrderStatusRequest.php` — rules كاملة حرفية:

```php
public function rules(): array
{
    return [
        'status' => ['required', Rule::in(Order::STAFF_STATUSES)],
        'expected_status' => ['nullable', Rule::in(Order::STAFF_STATUSES)],
        'reason' => ['nullable', 'required_if:status,cancelled,rejected', 'string', 'max:500'],
    ];
}
```

القواعد تراجع **اسم** الحالة، لكن مش هل الانتقال من new إلى ready صحيح. ده business validation في الخطوة التالية. reason لازم للإلغاء أو الرفض، ومتحددة أقصى 500 حرف.

### ج. الكود الحقيقي اللي يمنع الصراع ويسجل الانتقال

المصدر: `pizza-crm/app/Http/Controllers/Api/StaffOrderController.php` — دالة كاملة حرفية:

```php
public function updateStatus(UpdateOrderStatusRequest $request, Order $order): JsonResponse
{
    $this->authorizeBranch($request, $order);
    $data = $request->validated();
    DB::transaction(function () use ($request, $order, $data): void {
        $lockedOrder = Order::query()->lockForUpdate()->findOrFail($order->id);

        if (($data['expected_status'] ?? null) && $lockedOrder->status !== $data['expected_status']) {
            $exception = ValidationException::withMessages([
                'expected_status' => ['Another staff member already updated this order. The card has been refreshed.'],
            ]);
            $exception->status(409);
            throw $exception;
        }

        $steps = $lockedOrder->status === Order::STATUS_NEW && $data['status'] === Order::STATUS_PREPARING
            ? [Order::STATUS_ACCEPTED, Order::STATUS_PREPARING]
            : [$data['status']];

        foreach ($steps as $status) {
            $allowed = $this->allowedTransitions($lockedOrder);
            if (! in_array($status, $allowed, true)) {
                throw ValidationException::withMessages([
                    'status' => ["Cannot move an order from {$lockedOrder->status} to {$status}."],
                ]);
            }

            $from = $lockedOrder->status;
            $lockedOrder->update([
                'status' => $status,
                'status_reason' => in_array($status, [Order::STATUS_CANCELLED, Order::STATUS_REJECTED], true)
                    ? ($data['reason'] ?? null)
                    : null,
            ]);
            OrderStatusLog::create([
                'order_id' => $lockedOrder->id,
                'user_id' => $request->user()->id,
                'from_status' => $from,
                'to_status' => $status,
                'reason' => $data['reason'] ?? null,
                'created_at' => now(),
            ]);
        }
    });

    $order = $order->fresh()->load(['branch', 'user', 'items.menuItem', 'statusLogs.user']);
    OrderStatusUpdated::dispatch($order);

    return response()->json(['message' => 'Order status updated.', 'order' => $order]);
}
```

بالبلدي، السطر وإيه اللي حصل:

- `authorizeBranch`: استدعاء method مخصوصة لقرار صلاحية الفرع، تكملتها تحت؛ مفيش أمان لو سيبناها اسم بس.
- `validated`: هات status/reason/expected_status المقبولة.
- `DB::transaction`: order update والlogs ينجحوا سوا أويتراجعوا سوا عند exception.
- `lockForUpdate`: اطلب write lock على صف الطلب داخل transaction؛ يمنع سباق نفس الصف على محرك يدعم row locks. مش قفل لكل جدول الطلبات، ومش منع طلبات HTTP كلها.
- `expected_status ?? null`: الحقل اختياري؛ لو مبعوت بنتأكد الحالة المقروءة تحت القفل لسه مطابقة.
- `status(409)` ثمthrow: HTTP Conflict، مش مجرد422 عامة؛ الواجهة تقرأ expected_status وتعمل loadOrders.
- `$steps`: لو UI اختصرت قبول وبدء تحضير في ضغطة واحدة، احفظ accepted ثمpreparing بدل اختراع إن accepted محصلتش.
- `foreach`: كل خطوة تتراجع مقابل الحالة الحالية بعد تحديث الخطوة السابقة.
- `in_array(...,true)`: هل status ضمن المسموح مع strict comparison؟ لو لأ throw وتراجع transaction.
- `$from`: احفظ الحالة القديمة قبل ما update يبدلها.
- `status_reason`: تخزين السبب للحالات cancelled/rejected فقط، وإلاnull.
- `OrderStatusLog::create`: احفظ order_id وuser_id والانتقال والسبب والوقت؛ كده عندنا audit trail لتطور الطلب.
- `fresh()->load`: النسخة اللي دخلت route كانت قديمة؛ هات نسخة جديدة بعلاقاتها للرد.
- `dispatch`: أطلق event بعد نجاح transaction.
- JSON response تستخدمها frontend لاستبدال البطاقة.

نفس الملف — الدالتان المرتبطتان كاملتان حرفيًا:

```php
private function allowedTransitions(Order $order): array
{
    if ($order->status === Order::STATUS_READY) {
        return $order->order_type === 'delivery'
            ? [Order::STATUS_OUT_FOR_DELIVERY, Order::STATUS_CANCELLED]
            : [Order::STATUS_PICKED_UP, Order::STATUS_CANCELLED];
    }

    return Order::TRANSITIONS[$order->status] ?? [];
}

private function authorizeBranch(Request $request, Order $order): void
{
    $user = $request->user();
    abort_unless($user->isAdmin() || (int) $user->branch_id === (int) $order->branch_id, 404);
}
```

- `private`: methods داخلية للكلاس، مش routes عامة.
- في `allowedTransitions`: ready الخاصة بالتوصيل تتحرك out_for_delivery، والاستلام picked_up؛ مش الاتنين سوا. باقي الحالات تقرأ جدول `Order::TRANSITIONS`، ولو مفيش entry تعيد array فاضية.
- في `authorizeBranch`: `isAdmin` دالة User تقارن role بـ admin. غير كده لازم branch_id متطابقة. `abort_unless` helper توقف برمز 404 لو الشرط false؛ اختيار 404 هنا ما يكشفش طلب فرع تاني.
- `:void`: الدالة مش بترجع payload؛ يا تكمل عادي، يا ترمي HTTP exception.

**النتيجة:** الطلب يتحدث، history تسجل مين عمل إيه، والموظف الثاني لو كان شايف نسخة قديمة يتطلب منه refresh بدل الرجوع لخطوة غلط.

**سؤال إنترفيو:** الفرق بين validation وauthorization وconcurrency؟ الأولى شكل وقيم البيانات، الثانية مين له الحق، والثالثة منع تعارض عمليتين صحيحتين على نفس البيانات في نفس الوقت.

## الرحلة 5 — رفع صورة منتج: React FormData إلى PHP GD ثم الصورة في المنيو

### أ. المتصفح يقرأ الملف ويرسل FormData

المصدر: `pizza-crm/resources/js/Pages/Admin/AdminPanel.jsx` — عنصر JSX حرفي من ProductForm:

```jsx
<input className="wtc-admin-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e)=>setForm({...form,image:e.target.files[0]||null})}/>
```

- `type=file` يعمل file picker.
- `accept` يرشح الأنواع للمستخدم؛ مش أمن سيرفر وممكن request تتعدل.
- `e.target.files[0]`: أول File object تم اختياره؛ مفيش upload حصل لسه.
- `setForm({...form,image:...})`: خزّن الملف داخل React state؛ ده غير كتابة bytes على السيرفر.

نفس الملف — دالة save كاملة حرفية:

```js
const save = async (event) => {
    event.preventDefault();
    setBusy(true); setError('');
    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => {
        if (key === 'branch_options') body.append(key, JSON.stringify(value));
        else if (key === 'image' && value) body.append(key, value);
        else if (key !== 'image') body.append(key, typeof value === 'boolean' ? (value ? '1' : '0') : value);
    });
    try {
        await csrfFetch(product ? '/api/admin/products/' + product.id : '/api/admin/products', { method: 'POST', body });
        onSaved();
    } catch (requestError) { setError(requestError.payload?.errors ? Object.values(requestError.payload.errors).flat()[0] : requestError.message); }
    finally { setBusy(false); }
};
```

- `new FormData`: browser object تجمع text fields وfiles وتبني multipart body وقت fetch.
- `Object.entries(form)`: حوّل object إلى array من `[key,value]` لكل property.
- `.forEach(([key,value])=>...)`: كرر وأفك زوج كل property باستخدام destructuring؛ forEach لتنفيذ append، ومش محتاج نتيجة array جديدة زي map.
- `body.append`: FormData method تضيف field؛ ترجع undefined، المهم الأثر داخل body.
- `branch_options`: array معقدة نرسلها JSON string وبنفكها في PHP request لاحقًا.
- image تضاف كFile object فقط لو موجودة؛ منكتبش JSON.stringify للملف لأنه مش هيبعت bytes صح.
- Boolean تتحول `'1'/'0'` لأن multipart fields نصوص؛ Laravel boolean rule تقبل القيم المقصودة هنا.
- endpoint يختلف إنشاء/تعديل، لكن الاتنين POST في routes الحالية لمراعاة شكل الفورم؛ ده قرار API الحالي، مش قاعدة إن كلupdate لازمPOST.
- `onSaved()`: callback من MenuAdmin تقفل editor وتحمّل catalog من جديد. التنفيذ الفعلي بالملف: `onSaved={()=>{setEditing(undefined);load();}}`.
- `csrfFetch` يتعرف على FormData فيمتنع عن Content-Type:application/json؛ browser يضيف multipart boundary.

### ب. فك field JSON ثم التحقق من الصورة

المصدر: `pizza-crm/app/Http/Requests/AdminProductRequest.php` — دالة كاملة حرفية:

```php
protected function prepareForValidation(): void
{
    if (is_string($this->branch_options)) {
        $this->merge(['branch_options' => json_decode($this->branch_options, true)]);
    }
}
```

- method ضمن Laravel lifecycle: قبل rules نفّذ التجهيز.
- `is_string`: PHP built-in ترجع bool؛ افحص إن field نص قبل json_decode.
- `json_decode(...,true)`: يحوّل JSON string إلى associative array؛ true هنا مش «JSON صحيح»، ده اختيار شكل الناتج.
- `merge`: Request method تدمج القيمة الجديدة مع input؛ مش DB update.
- مفيش JSON_THROW_ON_ERROR هنا؛ JSON غلط ينتج null ثم rules ترفض إنه مش array صالحة.

نفس الملف — أسطر قواعد حرفية مرتبطة:

```php
'image' => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:8192'],
'branch_options' => ['required', 'array', 'min:1'],
'branch_options.*.branch_id' => ['required', 'integer', 'exists:branches,id'],
'branch_options.*.price' => ['required', 'numeric', 'min:0', 'max:99999'],
'branch_options.*.is_available' => ['required', 'boolean'],
```

`image` rule تتحقق من ملف صورة، `mimes` تحصر الأنواع، و`max:8192` للملف بالـ kilobytes، حوالي 8 MiB. كل branch option محتاجة branch موجود، وسعر غير سالب، وقيمة availability منطقية. `authorize` في نفس FormRequest تتأكد إن المستخدم admin؛ مش أي زائر يرفع حتى لو الملف صحيح.

### ج. controller يربط البيانات بخدمة الصورة والعلاقات

المصدر: `pizza-crm/app/Http/Controllers/Api/AdminController.php` — methods كاملة حرفية:

```php
public function storeProduct(AdminProductRequest $request, ProductImageService $images, AdminAudit $audit): JsonResponse
{
    return $this->saveProduct($request, new MenuItem(), $images, $audit, 201);
}

public function updateProduct(AdminProductRequest $request, MenuItem $menuItem, ProductImageService $images, AdminAudit $audit): JsonResponse
{
    return $this->saveProduct($request, $menuItem, $images, $audit);
}

private function saveProduct(AdminProductRequest $request, MenuItem $item, ProductImageService $images, AdminAudit $audit, int $status = 200): JsonResponse
{
    $data = $request->validated();
    if ($request->hasFile('image')) $data['image_path'] = $images->store($request->file('image'), $data['name']);
    $options = $data['branch_options'];
    unset($data['branch_options'], $data['image']);
    $item->fill($data)->save();
    $item->branches()->sync(collect($options)->mapWithKeys(fn ($option) => [$option['branch_id'] => ['price' => $option['price'], 'is_available' => $option['is_available']]])->all());
    $audit->record($request->user(), $status === 201 ? 'product.created' : 'product.updated', $item, $data);
    return response()->json(['item' => $item->load(['category', 'branches'])], $status);
}
```

- إنشاء: `new MenuItem()` تنشئ model لسه مش محفوظة، والرد 201. تحديث: Model موجودة من route وstatus الافتراضي 200.
- `hasFile`: Laravel تراجع إن فيه uploaded file في field؛ و`file` تجيب UploadedFile object.
- `$images->store`: **method خاصة بالمشروع**، تكملتها في الفقرة التالية؛ بتعمل resize وكتابة ملف، وترجع public URL.
- `image_path`: بنخزن الرابط في DB، مش bytes الصورة داخل عمود text.
- `$options`: افصل pivot data عن حقول menu_items.
- `unset`: امسح keys من array المحلية عشان متتحطش كأعمدة منتج؛ مش DELETE من DB.
- `fill($data)`: حط attributes المسموحة في model؛ و`save`: اعمل insert أو update فعلًا.
- `collect($options)`: حوّل array إلى Laravel Collection؛ و`mapWithKeys` تعيد الشكل `[branchId=>pivotAttributes]`.
- `all()`: رجّع array عادية تستقبلها sync.
- `branches()->sync`: طابق الروابط والقيم مع القائمة الجديدة، بما فيها حذف pivot links غير الموجودة؛ مش append فقط.
- `$audit->record`: سجّل الإجراء؛ نكمّلها بعد الصورة.
- `load(['category','branches'])`: ارجع منتجًا كاملًا للواجهة مع العلاقات.

### د. تكملة store داخل ProductImageService

المصدر: `pizza-crm/app/Services/ProductImageService.php` — دالة كاملة حرفية:

```php
public function store(UploadedFile $file, string $name): string
{
    if (! function_exists('imagewebp')) {
        throw ValidationException::withMessages(['image' => ['PHP GD with WebP support is required for product uploads.']]);
    }

    $source = match ($file->getMimeType()) {
        'image/jpeg' => imagecreatefromjpeg($file->getRealPath()),
        'image/png' => imagecreatefrompng($file->getRealPath()),
        'image/webp' => imagecreatefromwebp($file->getRealPath()),
        default => false,
    };
    if (! $source) {
        throw ValidationException::withMessages(['image' => ['The image could not be processed.']]);
    }

    $width = imagesx($source);
    $height = imagesy($source);
    $targetWidth = min(800, $width);
    $targetHeight = max(1, (int) round($height * ($targetWidth / $width)));
    $target = imagecreatetruecolor($targetWidth, $targetHeight);
    imagealphablending($target, false);
    imagesavealpha($target, true);
    imagecopyresampled($target, $source, 0, 0, 0, 0, $targetWidth, $targetHeight, $width, $height);

    $directory = public_path('images/menu/admin');
    if (! is_dir($directory)) mkdir($directory, 0755, true);
    $filename = Str::slug($name).'-'.Str::lower(Str::random(8)).'.webp';
    imagewebp($target, $directory.DIRECTORY_SEPARATOR.$filename, 82);
    imagedestroy($source);
    imagedestroy($target);

    return '/images/menu/admin/'.$filename;
}
```

الـ methods هنا بالتحديد:

- `function_exists('imagewebp')`: PHP built-in تسأل هل تثبيت PHP يدعم كتابة WebP بالـ GD ولا لأ. لا تعدّل PHP config بمجرد الفحص.
- `$file->getMimeType()`: method على UploadedFile تقرأ نوع الملف المكتشف؛ مش مجرد امتداد اسم كتبه المستخدم.
- `match`: PHP language construct تختار قيمة تعبير حسب تطابق الـ MIME؛ مختلفة عن function call.
- `getRealPath()`: مسار الملف المرفوع مؤقتًا على السيرفر؛ مش URL التحميل النهائي.
- `imagecreatefromjpeg/png/webp`: GD functions تفك ملف الصورة إلى image in memory، أو false لو فشلت.
- `imagesx/imagesy`: هات عرض وارتفاع الصورة بالبكسل.
- `min(800,$width)`: لا يتجاوز 800، وما يكبّرش صورة عرضها 400 إلى 800.
- `height*(targetWidth/width)`: حافظ على aspect ratio. `round` تقريب، و`(int)` عدد صحيح، و`max(1,...)` يمنع ارتفاع صفر.
- `imagecreatetruecolor`: أنشئ canvas هدف بالأبعاد الجديدة.
- `imagealphablending(...,false)` و`imagesavealpha(...,true)`: حضّر التعامل مع الشفافية في الصورة الهدف.
- `imagecopyresampled`: انسخ المصدر للهدف مع resize؛ الأصفار إحداثيات بداية النسخ، بعدها عرض وارتفاع الهدف ثم أبعاد المصدر.
- `public_path`: Laravel helper يرجع مسار filesystem مطلق داخل public؛ ده مش URL.
- `is_dir`: هل directory موجودة؟ `mkdir(...,0755,true)` تنشئها بآباء المسار لو غائبة؛ صلاحيات Windows قد تختلف عن Unix.
- `Str::slug($name)`: اسم مناسب للملف. `Str::random(8)` إضافة عشوائية لتقليل تصادم أسماء؛ و`lower` تحولها حروفًا صغيرة.
- `.` في PHP تعني string concatenation؛ مش وصول لخاصية زي JS.
- `imagewebp`: اكتب ملف WebP بجودة 82. الكود الحالي مش بيفحص return value، فمفروض ما ندّعيش إنه بيعالج كل disk failure.
- `imagedestroy`: تحرير image بعد المعالجة؛ لا يحذف ملف المستخدم الأصلي على جهازه.
- `return '/images/...'`: رجّع URL للـ controller ليحفظ image_path.

### هـ. سجل الإدارة ثم رجوع الصورة للكتالوج

المصدر: `pizza-crm/app/Services/AdminAudit.php` — دالة كاملة حرفية:

```php
public function record(User $user, string $action, Model|string $subject, array $details = []): void
{
    AdminAuditLog::create([
        'user_id' => $user->id,
        'action' => $action,
        'subject_type' => $subject instanceof Model ? $subject::class : $subject,
        'subject_id' => $subject instanceof Model ? $subject->getKey() : null,
        'details' => $details,
        'created_at' => now(),
    ]);
}
```

- `Model|string`: union type؛ مرجع العنصر يمكن object موديل أو اسم class كنص.
- `instanceof Model`: هل subject موديل؟ لو آه خد نوعه وقيمة primary key باستخدام getKey؛ لو string مفيش id.
- `details=[]`: تفاصيل إضافية اختيارية؛ AdminAuditLog بتعمل cast لها إلى JSON array.
- `now()`: Laravel/Carbon helper للوقت الآن.
- `:void`: لا يرجّع message؛ الأثر row تدقيق.

الواجهة تنفذ onSaved فتعيد تحميل catalog، وMenuController يرجع image_path في المنيو، وعنصر img يعرضه. التخزين نفسه مش معناه إن المستخدم هيشوف الصورة دون refetch أو تحديث state.

**حدود الحالي:** حفظ الصورة وmodel وpivot وaudit مش كلهم transaction واحدة، وأصلًا تراجع DB لا يمسح ملف كتبته تلقائيًا. تعديل صورة منتج لا ينظّف الصورة القديمة في هذه الخدمة. دي أسئلة تحسين مستقبلي، مش ميزات ندعي إنها موجودة.

**سؤال إنترفيو:** ليه ما نبعتش File داخل JSON؟ لأن File object مش تمثيل bytes بالطريقة المطلوبة؛ FormData تدعم multipart، والسيرفر يستقبل UploadedFile ويعيد التحقق.

## قاموس سريع للمفاهيم اللي قابلتنا

- **Caller / المستدعي:** الكود اللي بينادي الدالة، مثل submitLogin ينادي login.
- **Parameter / مُعامل:** الاسم داخل تعريف الدالة، مثل credentials.
- **Argument / قيمة مُرسلة:** البيانات وقت النداء، مثل form في login(form).
- **Return value / القيمة الراجعة:** اللي return تعيدها للمستدعي؛ مش أي أثر بصري على الشاشة.
- **Side effect / أثر جانبي:** تحديث state أو كتابة DB أو إرسال request؛ ممكن دالة تعمل ده وترجع void.
- **Validation / التحقق من البيانات:** هل النوع والقيمة مسموحين؟
- **Authorization / التفويض:** هل المستخدم الحالي مسموح له يعمل العملية على هذا السجل؟
- **Authentication / إثبات الهوية:** مين صاحب session أصلًا؟
- **Transaction / معاملة:** مجموعة كتابات DB تنجح أو تتراجع معًا، مش ضمان للعمليات الخارجية.
- **Idempotency / أثر ثابت عند التكرار:** منع إن إعادة نفس الطلب تخلق عمليات مدفوعة متكررة؛ لازم implementation وقيود DB وتصميم concurrency مناسبين، مش مجرد وجود متغير key.
- **Snapshot / لقطة وقت التنفيذ:** حفظ اسم وسعر البند وقت شرائه بدل الاعتماد على كتالوج قد يتغير.

## إزاي تراجع المثال من غير متاهة؟

افتح الملفات المذكورة للرحلة نفسها بس، واتبع السلسلة: UI event → frontend function → csrfFetch → route → request validation → controller → service/model → response → state/UI. كل جزء له شرح هدف ومدخلات ونتيجة، وكل الكود المخصص المتبقي في أطلس المصدر الكامل له نسخة ملف مستقلة.

الصفحات دي شرح وقراءة فقط. لم تُشغّل migrations أو seeders ولم تتغير DB أو كود التطبيق أثناء إعدادها.
