# البيتزا — أمثلة Frontend كاملة ومتصلة ببعض

الكود هنا من مشروع `pizza-crm` الفعلي. لغة الواجهة **React وJSX**، مش Vue. JSX هو كود واجهة شبه HTML داخل JavaScript. كل رحلة مكتوب فيها اسم الملفات ومكان أول حدث وآخر نتيجة. النسخة الكاملة الحرفية لكل ملف موجودة في أطلس المصدر؛ الأمثلة دي بتجمع الأجزاء المرتبطة علشان تعرف الحكاية بدل ما تذاكر دالة لوحدها.

**تصنيف النقل:** «مقتطف حرفي» يعني السطور من المصدر من غير تغيير منطق أو أسماء؛ المقتطف مش ملف مستقل كامل. «تنسيق فقط» يعني نفس التعبير لكن فصلنا سطر JSX طويل على سطور. «مثال تدريبي» يعني إضافة للتوضيح، مش ادعاء وجوده في المشروع.

**مهم قبل التطبيق:** اقرأ الأول واستخدم بيانات تجريبية. ما تشغّلش إرسال طلبات أو دفع أو تعطيل منتجات على بيانات حقيقية بغرض المذاكرة. تقدر تتابع في نسخة الديمو المحلية؛ وضع الديمو لا يكلّم Laravel ولا يجمع فلوس. ما تنسخش مقتطف واحد مكان ملف كامل.

## 1. أضغط + في المنيو: إزاي العداد يتغير في ملف Navbar تاني؟

**النوع:** مقتطفات حرفية مترابطة، مع فصل أسطر زر واحد للقراءة فقط. **الملفات:** `Pages/MenuPage.jsx` ← `context/CatalogContext.jsx` ← `context/OrderContext.jsx` عند تغيير الفرع ← `Components/Navbar.jsx` ← `Pages/Cart.jsx`.

**الهدف بالبلدي:** اختارت بيتزا، ضغطت +، زادت الكمية واتحفظت السلة، ورقم الشنطة في الـ Navbar اتحدث. الضغط ده **مش بيعمل order في قاعدة البيانات**؛ لسه مجرد سلة في المتصفح.

### أ. مصدر البيانات والزر اللي يبدأ الرحلة

من `resources/js/Pages/MenuPage.jsx`:

```jsx
const { branches, categories, items, loading, error, reload } = useCatalog();
const { mode, branchId: selectedBranchId, selectedBranch, availableBranches, setBranch } = useOrder();
```

السطر الأول بياخد بيانات المنيو من Custom Hook اسمه `useCatalog`. الأقواس `{}` هنا **destructuring**: بنسحب خصائص من object بدل كتابة `catalog.items` كل مرة.

السطر التاني بياخد الفرع وطريقة الاستلام من `useOrder`. الجزء `branchId: selectedBranchId` اسمه **alias**: الخاصية اسمها `branchId` في المصدر، لكن سميناها محليًا `selectedBranchId`. مش تغيير لقيمة ولا إعادة تسمية في الـ Context نفسه.

الزر داخل تكرار المنتجات فيه التعبير ده:

```jsx
<button
    type="button"
    aria-label={`Add ${item.name} to cart`}
    onClick={() => addToCart(item)}
>
    +
</button>
```

`type="button"` زر عادي مش إرسال فورم. `onClick` هو React event handler. الدالة `() => addToCart(item)` مش بتشتغل أثناء render؛ React يشغّلها عند الضغط. بتبعت **الـ item الحالي** من تكرار `filteredItems.map` للدالة. `${item.name}` جوه backticks بتكوّن اسمًا واضحًا للزر لقارئ الشاشة.

### ب. الدالة كاملة — من المنتج إلى السلة الجديدة

مقتطف حرفي من `MenuPage.jsx`:

```js
const addToCart = (item) => {
    const option = branchOption(item, selectedBranchId);
    if (!selectedBranch || !option?.is_available) return;
    let currentCart = readCart();
    const differentBranch = currentCart.some((line) => Number(line.branch_id) !== selectedBranch.id);
    if (differentBranch) {
        if (!setBranch(selectedBranch.id)) return;
        currentCart = readCart();
    }
    const existing = currentCart.find((line) => line.id === item.id);
    const canonical = {
        id: item.id,
        name: item.name,
        description: item.description,
        price: Number(option.price),
        image_src: item.image_path,
        branch_id: selectedBranch.id,
        branch_name: selectedBranch.name,
    };
    const next = existing
        ? currentCart.map((line) => line.id === item.id ? { ...line, ...canonical, quantity: line.quantity + 1 } : line)
        : [...currentCart, { ...canonical, quantity: 1 }];
    writeCart(next);
    setToast(`${item.name} added to cart.`);
};
```

`const addToCart = (item) => {` بيعرّف دالة مخصصة باسم `addToCart`. `item` هو الـ input، والدالة لا ترجع السلة؛ أثرها الجانبي **side effect** هو الحفظ وتحديث رسالة الواجهة.

`branchOption(item, selectedBranchId)` بيجيب خيار المنتج في الفرع الحالي. الدالة دي مش من JavaScript؛ مستوردة من ملف تاني وهنفتحها تحت حالًا.

`if (!selectedBranch || !option?.is_available) return;` معناها لو مفيش فرع **أو** المنتج مش متاح، اخرج فورًا. `!` عكس منطقي، `||` أو، و`?.` توقف قراءة الخاصية بأمان لو `option` فاضية. `return` هنا **early return** مش تأكيد نجاح.

`let currentCart = readCart();` اقرأ السلة. اخترنا `let` لأننا هنقدر نسند لها قراءة جديدة بعد تغيير الفرع.

`some(...)` ترجع Boolean: هل سطر واحد على الأقل من فرع مختلف؟ `Number(...)` يحوّل المعرّف لنوع رقمي. `!==` مقارنة عدم مساواة صارمة.

داخل `if (differentBranch)` بننادي `setBranch`. دي alias لدالة `changeBranch` في `OrderContext.jsx`: تراجع الفرع، تستأذن المستخدم لو فيه اختلاف، تعيد تسعير السلة وتزيل غير المتاح. بترجّع `false` لو المستخدم رفض أو الفرع غير صالح، فهنا نخرج. بعد نجاحها بنقرأ التخزين تاني لأن السلة ممكن تكون اتغيّرت.

`find(...)` بترجع أول سطر منتج معرّفه يساوي `item.id`، أو `undefined` لو المنتج مش في السلة. مش بترجع array زي `filter`.

`canonical` هو object فيه بيانات المنتج الحالية. كل سطر `اسم: قيمة` بيحدد خاصية واحدة. `price` جاي من **سعر الفرع** بعد `Number`، مش سعر ثابت عام. `image_src` اسم الخاصية المستخدم في عرض السلة، والمصدر هنا `item.image_path`.

`const next = existing ? ... : ...` اسمه **ternary**: لو لقينا المنتج نحدّث، غير كده نضيف. الجزء الطويل ينفهم كده:

`currentCart.map(...)` يعمل قائمة جديدة. لكل سطر، لو `line.id === item.id` نرجّع `{ ...line, ...canonical, quantity: line.quantity + 1 }`؛ لو مش هو نرجّع `line` زي ما هو.

`...line` نسخ خصائص السطر، وبعده `...canonical` يحدّث البيانات المتكررة بالقيم الحالية، وبعدهم `quantity` يزيد العدد بواحد. ترتيب الـ spread مهم: آخر قيمة لنفس المفتاح هي اللي تكسب.

`[...currentCart, { ...canonical, quantity: 1 }]` ينشئ قائمة فيها القديم ومعاه منتج جديد بكمية واحدة.

`writeCart(next)` ينادي مساعد الحفظ. `setToast(...)` يحدث React state فتظهر رسالة. الضغط مرة أخرى على نفس المنتج يزيد الكمية بدل إضافة سطر مكرر.

### ج. نكمّل الدالة المستوردة بدل ما نسيبها اسم غامض

من `resources/js/context/CatalogContext.jsx`:

```js
export function branchOption(item, branchId) {
    return item?.branch_options?.find((option) => Number(option.branch_id) === Number(branchId)) || null;
}
```

`export` تسمح لملف آخر يستورد الدالة. `branch_options` قائمة أسعار وتوفر المنتج حسب الفرع. `find` تدور على معرّف الفرع المطلوب بعد توحيد النوع باستخدام `Number` للطرفين. `|| null` يخلّي عدم العثور يرجّع `null` بدل `undefined`. الناتج **object خيار واحد** مثل `{branch_id,price,is_available}`، مش المنتج كله.

### د. الحفظ والحدث — باقي الرحلة في نفس ملف المنيو

```js
const CART_STORAGE_KEY = import.meta.env.VITE_DEMO_MODE === 'true' ? 'wtc_demo_cart' : 'wtc_cart';
const CART_EVENT_NAME = 'wtc-cart-updated';

function readCart() {
    try { return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]'); } catch { return []; }
}

function writeCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event(CART_EVENT_NAME));
}
```

`import.meta.env` إعدادات Vite وقت التطوير/البناء. الشرط يفصل سلة الديمو عن السلة العادية. النص `'true'` هنا string، مش Boolean `true`.

`getItem` تقرأ نصًا أو `null`. `|| '[]'` يوفر JSON لقائمة فاضية لو لا بيانات. `JSON.parse` يفك النص لقيمة JavaScript؛ لو النص تالف، `catch` يرجّع `[]` بدل إسقاط الصفحة.

`JSON.stringify(cart)` يحوّل السلة لنص لأن localStorage لا يخزن object مباشرة. `setItem` يكتب النص محليًا، مش في قاعدة بيانات السيرفر، ولا يحدّث React state وحده.

`new Event(CART_EVENT_NAME)` ينشئ حدثًا باسمه. `dispatchEvent` يطلقه على `window` في نفس التبويب. ده مش طلب شبكة ولا Vue emit؛ ده Browser Event عادي.

ليه محتاجين الحدث؟ `storage` الطبيعي يصل لتبويبات أخرى مشاركة في نفس التخزين، **مش لنفس الصفحة اللي عملت setItem**.

### هـ. الملف التاني يسمع ويعرض النتيجة

من `resources/js/Components/Navbar.jsx`:

```js
function getCartCount() {
    try {
        const savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');

        return savedCart.reduce((total, item) => total + Number(item.quantity || 0), 0);
    } catch {
        return 0;
    }
}
```

`reduce` بتجمع قيمة واحدة من قائمة. `total` يبدأ من آخر argument وهو `0`. في كل عنصر نضيف الكمية؛ فلو منتجين بكميات 2 و3، النتيجة5، مش2. `Number(item.quantity || 0)` يحمي من غياب quantity في العنصر العادي، لكنه مش validation كامل لشكل التخزين.

داخل `Navbar`:

```js
const [cartCount, setCartCount] = useState(getCartCount);

useEffect(() => {
    const syncCartCount = () => {
        setCartCount(getCartCount());
    };

    window.addEventListener('storage', syncCartCount);
    window.addEventListener(CART_EVENT_NAME, syncCartCount);

    return () => {
        window.removeEventListener('storage', syncCartCount);
        window.removeEventListener(CART_EVENT_NAME, syncCartCount);
    };
}, []);
```

`useState(getCartCount)` يمرر function كـ **lazy initializer**؛ React يستدعيها لتحديد القيمة الأولية بدل قراءتها يدويًا كل render.

`syncCartCount` دالة تقرأ أحدث تخزين وتحدّث state. `addEventListener` يسجّلها للحدثين. مفيش `()` بعد اسمها لأننا بنسلّم الدالة علشان تتنفّذ لاحقًا.

`return () => {...}` هي cleanup الخاصة بالـ effect: يفك نفس الـ listeners عند إزالة Navbar. `[]` معناها مفيش reactive dependencies لإعادة إعداد الـ effect عند كل render؛ في StrictMode التطوير React ممكن يعمل دورة فحص setup/cleanup إضافية.

مكان ظهور الرقم حرفيًا:

```jsx
{cartCount > 0 && (
    <span className="wtc-cart-badge">
        {cartCount > 99 ? '99+' : cartCount}
    </span>
)}
```

`&&` تعرض الشارة لو العدد أكبر من صفر. التعبير الثلاثي يختصر العدد لأكثر من99 إلى `99+`. ده آخر الرحلة المرئي.

**التطبيق اليدوي:** في الديمو أضف نفس البيتزا مرتين، وافتح `/cart`؛ شوف كمية2 وعدّاد2. اعمل refresh؛ التخزين يخلي السلة موجودة. لا تضغط Checkout في نظام حقيقي أثناء التدريب.

**سؤال مقابلة — Interview:** ليه تغيير localStorage وحده لا يحدث Navbar؟ لأن React يعيد render عندما تتغير state/props/context، وقراءة storage العادية مش subscription. الحدث يستدعي setter فينشّط التحديث.

## 2. أضغط Login: فين الدالة اللي فعلًا تبعت البيانات؟

**النوع:** مقتطفات حرفية. **الرحلة:** `Pages/Auth/Login.jsx` → `context/AuthContext.jsx` → `lib/api.js` → route → `AuthController.php` → النتيجة ترجع لـ Context ثم الصفحة. في وضع الديمو login screen تُستبدل بـ DemoAccounts وطلب API يتوجه إلى demoFetch؛ متجربش كلمات مرور حقيقية في الديمو.

### أ. بيانات الفورم ودالة تحديثها

من `Login.jsx`:

```js
const navigate = useNavigate();
const { login } = useAuth();

const [form, setForm] = useState({
    email: '',
    password: '',
    remember: false,
});

const [error, setError] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);

const updateField = (field, value) => {
    setForm((current) => ({
        ...current,
        [field]: value,
    }));
};
```

`useNavigate()` يرجع function للتنقل في React Router. `useAuth()` hook مخصصة من ملف السياق، ومنها نأخذ `login`؛ مش function مكتوبة داخل صفحة Login.

`useState({...})` يحفظ object الفورم بين renders. `form` القيمة الحالية و`setForm` دالة تحديثها. `remember` Boolean لأن checkbox تختلف عن النصوص.

`updateField(field,value)` تتلقى اسم الحقل وقيمته. `setForm((current) => ...)` **functional update**: React يمرر أحدث state بدل الاعتماد على نسخة قديمة من closure.

`({ ...current, [field]: value })` ترجع object جديدة. الأقواس العادية حول object علشان arrow function تفسر `{}` كقيمة مش جسم دالة. `...current` يحتفظ بباقي الحقول. `[field]` **computed property name**: لو field تساوي `'email'` يحدّث email، مش خاصية حرفيًا اسمها field.

### ب. HTML/JSX المتصل بالدالة، مش JavaScript لوحده

مقتطفات حرفية من الفورم:

```jsx
<Form onSubmit={submitLogin}>
    <Form.Group className="mb-3" controlId="login-email">
        <Form.Label>Email</Form.Label>
        <Form.Control
            type="email"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            required
        />
    </Form.Group>

    <Form.Group className="mb-3" controlId="login-password">
        <Form.Label>Password</Form.Label>
        <Form.Control
            type="password"
            value={form.password}
            onChange={(event) => updateField('password', event.target.value)}
            required
        />
    </Form.Group>

    <Form.Check
        className="mb-4"
        type="checkbox"
        id="remember-me"
        label="Remember me"
        checked={form.remember}
        onChange={(event) => updateField('remember', event.target.checked)}
    />

    <Button type="submit" className="btn-red w-100" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
    </Button>
</Form>
```

`Form`/`Form.Control`/`Button` مكوّنات مستوردة من react-bootstrap، وفي النهاية ترسم عناصر HTML مناسبة. `onSubmit={submitLogin}` يسلم الدالة للحدث، مش يناديها أثناء render.

`value={form.email}` input **controlled**: المصدر هو state. `onChange` يأخذ event ثم `event.target.value` النص المكتوب ويحدّث نفس الحالة. بدون onChange القيمة ستبقى مقيدة بما في state.

checkbox تستخدم `checked` و`event.target.checked` للـ Boolean، مش `value` النصية. `required` تحقق من المتصفح فقط؛ Laravel لازم يتحقق كمان.

زر submit يطلق الحدث الموجود على Form، و`disabled` تمنع الضغط أثناء الطلب. النص يتبدل من ternary حسب isSubmitting.

### ج. Handler الإرسال كاملة

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

`async` تجعل الدالة ترجع Promise. `event.preventDefault()` تمنع submit الافتراضي وإعادة تحميل الصفحة؛ لا تمنع propagation تلقائيًا.

نمسح خطأ محاولة سابقة ونفعّل loading. `try` الجزء المتوقع نجاحه. `await login(form)` ينتظر Promise الدالة المشتركة؛ لا يجمّد المتصفح كله.

الدالة ترجع user، فنختار destination حسب role. `replace:true` يستبدل سجل صفحة الدخول في History بدل إضافة entry جديدة. ده تنقل داخل SPA، مش guard أمني للسيرفر.

`catch` يستقبل الخطأ لو login رفضت، ويعرض message. `finally` ينفذ في النجاح والفشل فيرجع الزر متاحًا.

### د. التكملة في AuthContext.jsx

هذا العضو داخل object الـ Context، وليس function مستقلة خارج المكوّن:

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

`credentials` هو نفس object `form` من الصفحة، لكن الاسم المحلي مختلف. `JSON.stringify` يحوله لنص JSON. `method:'POST'` يحدد HTTP method، و`body` البيانات.

`authRequestVersion.current += 1` يزود رقم النسخة؛ طلب /me القديم لما يرجع يراجع نفس الرقم قبل كتابة user، فيمنع overwriting أحدث login. تعديل ref لا يسبب render بنفسه.

`flushSync` من react-dom يطلب إنهاء تحديثات state داخله فورًا قبل العودة؛ هنا علشان صفحة الوجهة تقرأ user المحدث. دي أداة خاصة، مش قاعدة استخدام لكل setState.

`return response.user` يرسل نتيجة login للـ `await login(form)` في الصفحة. كده فهمنا إزاي قيمة user وصلت للـ navigate.

### هـ. تكملة الوسيط csrfFetch كاملة

من `resources/js/lib/api.js`:

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

`url, options={}` مدخلان؛ الثاني اختياري. أول فرع يوجّه الديمو إلى dynamic import لدالة demoFetch ويخرج؛ ده لا يتصل بباك اند حقيقي.

`querySelector` يختار meta CSRF؛ `getAttribute` يقرأ content، و`?.` تحمي لو العنصر غير موجود. CSRF token ليست كلمة مرور المستخدم.

`instanceof FormData` يميز رفع الملفات. لو FormData لا نثبت Content-Type يدويًا؛ المتصفح يختار multipart boundary الصحيح. غير كده JSON headers. `...options.headers` يسمح برؤوس إضافية من المستدعي، وبعده CSRF يُضاف إن وجد.

`fetch` دالة المتصفح؛ ترجع Promise<Response>. `credentials:'same-origin'` تسمح بإرسال cookies للـ same origin. `...options` تمرر method/body، و`headers` الأخيرة تستخدم المجموعة المجهزة.

`response.headers.get` تقرأ نوع المحتوى. `includes` هنا على string فبتفحص وجود النص. `response.json()` تفك body بشكل async؛ الناتج هو payload مش Response.

لو السيرفر أعاد csrf_token، `setAttribute` يحدّث meta للاستخدام القادم بعد تغير session/token.

`response.ok` نجاح HTTP من 200 إلى299. `fetch` لا ترمي تلقائيًا بسبب422؛ علشان كده نكوّن `Error` ونضيف payload ونرميه بـ `throw`. الخطأ يوصل لـ catch في submitLogin عبر login. في النجاح `return payload` يرجع بيانات المستخدم إلى AuthContext.

Laravel route الفعلي داخل `Route::prefix('api')` في `routes/web.php`:

```php
Route::post('/auth/login', [AuthController::class, 'login']);
```

ده يربط POST `/api/auth/login` بـ `AuthController::login`. تفاصيل التحقق من البيانات والجلسة وhashing مكانها درس ملف الباك اند الفعلي؛ ما تفترضش إن React بتتحقق من كلمة المرور.

**النهاية على الشاشة:** setUser يغير Context، Navbar يقرأ useAuth ويعرض اسم المستخدم وروابط دوره، والصفحة تنتقل للوجهة المناسبة.

**الغلطة الشائعة:** `onSubmit={submitLogin()}` تنادي الدالة أثناء render بدون event. الصحيح تسليم function reference أو callback لو محتاج parameters.

**Interview:** ليه في validation بالواجهة والسيرفر؟ الأول لتحسين التجربة؛ الثاني إلزامي لأن أي عميل يقدر يتجاوز JavaScript ويبعت HTTP مباشرة.

## 3. لوحة الموظف بتعرف الطلب الجديد إزاي؟ setInterval من أولها لآخرها

**النوع:** مقتطفات حرفية من `Pages/StaffDashboard.jsx` مع تنسيق JSX طويل للقراءة. **الملفات المتصلة:** `AuthContext.jsx` و`CatalogContext.jsx` → `StaffDashboard.jsx` → `lib/api.js` → `StaffOrderController.php`، ثم ترجع البيانات لنفس الـ Dashboard وترسل props إلى `OrderCard`.

**الهدف:** نطلب الطلبات فور فتح اللوحة، وبعد كده نطلبها تاني كل7 ثوانٍ تقريبًا. ده اسمه **polling**، مش WebSocket ومش وصول لحظي مضمون.

### أ. الحالة اللي الطلب هيحدّثها

مقتطفات التعريفات الفعلية داخل `StaffDashboard`؛ جمعنا السطور المتعلقة بالتحميل من مواضع متفرقة، من غير تغيير محتواها. ترتيبها هنا مش وعد إنها متجاورة في الملف:

```js
const { user, isCheckingAuth } = useAuth();
const [orders, setOrders] = useState([]);
const [branch, setBranch] = useState('');
const [date, setDate] = useState(today());
const [message, setMessage] = useState('');
const [loadError, setLoadError] = useState('');
const [lastUpdated, setLastUpdated] = useState(null);
const [timing, setTiming] = useState({ green_minutes: 3, orange_minutes: 6 });
const [highlighted, setHighlighted] = useState([]);
const knownIds = useRef(new Set());
const loadedOnce = useRef(false);
const loadingRef = useRef(false);
const isAdmin = user?.role === 'admin';
```

دي state وrefs مرتبطة بالتحميل، مش كل تعريفات الملف. `orders` البيانات اللي نرسمها. `branch/date` الفلاتر. `loadError` خطأ التحميل، و`lastUpdated` موعد آخر نجاح.

`timing` حدود ألوان مؤقت الحالة: بالدقائق. `knownIds` Set للأرقام اللي شفناها سابقًا، علشان نميز الطلب الجديد. `loadedOnce` تمنع اعتبار كل الطلبات القديمة «جديدة» في أول تحميل.

`loadingRef` بتمنع تشغيل طلب تحميل ثاني قبل الأول ينتهي. استخدمنا ref لأن تغيير busy flag ده مش محتاج يرسم واجهة جديدة. `user?.role` تحمي من user=null.

الدالة `today` من نفس الملف:

```js
function today() {
    return new Date().toISOString().slice(0, 10);
}
```

`new Date` الوقت الحالي؛ `toISOString()` نص تاريخ UTC؛ `slice(0,10)` أول10 أحرف مثل `2026-10-24`. **ده اختيار UTC فعلًا؛ مش تضمن إنه نفس تاريخ الفرع المحلي قرب منتصف الليل.**

### ب. الدالة اللي بتيجي كل مرة من المؤقت

```js
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

`useCallback` يرجع function يحتفظ بهويتها ما دامت dependencies ثابتة. **مش بيشغّل API ولا بيخزن نتيجة الطلب**؛ اللي يشغّلها هو الاستدعاء أو المؤقت أو زر Retry.

أول `if` يخرج لو user غير موجود أو دوره مش staff/admin أو فيه تحميل جاري. ده guard محلي؛ الـ server عنده authorization منفصلة لا نعتمد بدلها على الواجهة.

`loadingRef.current=true` تقفل الباب أمام تداخل تحميلين. `new URLSearchParams({date})` ينشئ query string مع encoding؛ `{date}` اختصار `{date:date}`.

`if (isAdmin && branch)` الأدمن فقط يضيف `branch_id` لو اختار فرع. الموظف فرعه يتحدد في السيرفر. `params.set` تضبط قيمة المفتاح؛ لا تعمل request.

`csrfFetch` الدالة اللي فتحناها كاملة في الرحلة2. المسار يصبح مثل `/api/staff/orders?date=2026-10-24&branch_id=1`. `await` ينتظر payload أو يرمي خطأ.

`response.orders || []` تمنع غياب orders من ترك undefined. لا تعني إن أي شكل API خاطئ هيتحقق منه بالكامل.

السطر اللي فيه `notify` يشتغل فقط بعد تحميل سابق. `fresh.filter` تختار الطلبات status=new ومعرّفها غير موجود في knownIds. `Set.has(id)` بترجع Boolean؛ `!` تعكسها علشان نختار غير المعروف.

`new Set(fresh.map(...))` تحفظ أرقام الطلبات الحالية فقط. `map` تستخرج id لكل طلب. بعد كده نعلّم إن أول تحميل حصل.

`setOrders(fresh)` ده اللي يطلب render بالطلبات الجديدة. `setTiming` يحفظ حدود المؤقت من السيرفر. `setLastUpdated` يحدث نص «آخر تحديث». `setLoadError('')` يمسح خطأ سابق بعد نجاح جديد.

`catch` تعرض خطأ مفهوماً. `finally` ترجع loadingRef=false في النجاح أو الفشل علشان المحاولة القادمة تتاح.

### ج. المؤقت نفسه ومعنى كل method

```js
useEffect(() => {
    loadOrders();
    const refreshTimer = window.setInterval(loadOrders, 7000);
    return () => window.clearInterval(refreshTimer);
}, [loadOrders]);
```

`loadOrders()` أول طلب **دلوقتي**؛ لأن `setInterval` لا تشغّل أول مرة فورًا.

`window.setInterval(loadOrders,7000)` دالة browser بتجدول تكرار `loadOrders` كل7000 مللي ثانية تقريبًا؛ كل1000ms تساوي ثانية. JavaScript بتكمل شغلها أثناء الانتظار، والـ interval لا ينتظر Promise الطلب السابق تلقائيًا. علشان كده loadingRef مهمة.

`loadOrders` من غير `()` معناها مرّر الدالة. لو كتبت `loadOrders()` جوه setInterval هتشغّلها فورًا وتمرّر ناتجها Promise بدل callback.

`refreshTimer` مش بيانات الطلبات؛ ده **interval ID**، رقم يحدد المؤقت. تقدر تعمل أكتر من مؤقت ولكل واحد ID مختلف.

`return () => ...` ترجع cleanup function إلى React؛ مش بتشغّل clearInterval فورًا. React يناديها قبل إعادة إعداد الـ effect بسبب dependency اتغيرت، وكمان عند unmount.

`clearInterval(refreshTimer)` توقف **التكرارات القادمة لنفس المؤقت**. لا تلغي HTTP request بدأت بالفعل؛ إلغاء الشبكة يحتاج AbortController وتنفيذ إضافي، مش موجود في المقتطف.

`[loadOrders]` dependency list. لما user/branch/date/notify تغير function المخزنة بواسطة useCallback، React ينظف المؤقت القديم ويعمل إعداد بالاختيارات الجديدة.

**ملحوظة مهمة:** callback بتاعة useEffect مش `async`. هي ترجع cleanup function أو لا شيء. الدالة `loadOrders` نفسها async، وده طبيعي.

وفي نفس الملف الساعة الداخلية غير طلبات الشبكة:

```js
useEffect(() => {
    const clock = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(clock);
}, []);
```

ده مؤقت ثاني يحدّث `now` كل ثانية علشان عداد دقائق/ثواني الكروت. **مش بيبعت API request كل ثانية.** `Date.now()` رقم milliseconds من Unix epoch. كل مؤقت بيتلغى باستخدام الـ ID الخاص بيه.

### د. notify مش اسم نسيبه من غير تكملة

```js
const notify = useCallback((newOrders) => {
    if (!newOrders.length) return;
    setMessage(`${newOrders.length} new order${newOrders.length > 1 ? 's' : ''} received.`);
    setHighlighted(newOrders.map((order) => order.id));
    window.setTimeout(() => setHighlighted([]), 3600);
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
}, [muted]);
```

الـ input هو array الطلبات الجديدة. لو طولها صفر نخرج. `setMessage` تعمل نص العدد مع s لو أكثر من واحد. `setHighlighted` تخزن IDs علشان كروتهم تتبرز.

`setTimeout` **مرة واحدة** بعد3600ms تمسح highlight. مختلفة عن setInterval اللي يتكرر. المشروع هنا لا يخزن timeout ID لتنظيفه؛ وصفنا الواقع، مش بنقول إن cleanup كاملة لكل timeout في الملف.

`muted` state و`audioContext` ref متعرّفين في المكوّن. لو الصوت متاح، `createOscillator` مصدر نغمة، و`createGain` متحكم مستوى الصوت. frequency=760 تحدد التردد. `setValueAtTime` يبدأ volume0.1، و`exponentialRampToValueAtTime` تخفضه تدريجيًا إلى0.001 خلال0.18 ثانية.

`connect` توصل مصدر الصوت بالمتحكم ثم بمخرج الصوت. `start` تبدأ المصدر و`stop` تجدول نهايته. دول methods من Web Audio، مش React. التفعيل الحقيقي يبدأ من زر الصوت ودالة `toggleSound` الموجودة حرفيًا في أطلس الملف.

### هـ. من orders الجديدة إلى الكروت والأزرار

السطران التاليان حرفيان لكن بينهما تعريفات أخرى في المصدر؛ جمعناهما لربط البيانات بالأعمدة:

```js
const activeOrders = useMemo(() => orders.filter((order) => !['completed', ...CLOSED_STATUSES].includes(order.status)), [orders]);
const columnOrders = (column) => activeOrders.filter((order) => column.statuses.includes(order.status));
```

`activeOrders` بيانات مشتقة: استبعد المكتمل والمغلق. `CLOSED_STATUSES` في أعلى الملف هي cancelled/rejected. `columnOrders(column)` ترجع طلبات حالات العمود فقط.

الكرت الفعلي يستقبل callback من الأب، excerpt مع تغيير whitespace فقط:

```jsx
<OrderCard
    key={order.id}
    order={order}
    now={now}
    timing={timing}
    busy={busyOrders.includes(order.id)}
    highlighted={highlighted.includes(order.id)}
    printing={printingOrderId === order.id}
    reduceMotion={reduceMotion}
    onAdvance={updateStatus}
    onReason={(selectedOrder, status) => setReasonAction({ order: selectedOrder, status })}
    onPrint={printTicket}
/>
```

`order` البيانات نفسها، و`now/timing` مدخلات عداد المرحلة. `highlighted` Boolean من فحص ID في القائمة. **الدالة في الأب اسمها updateStatus، لكن اسم الـ prop في الابن onAdvance.** الأسماء مش لازم تتطابق؛ التمرير هو اللي يربطهم.

داخل `OrderCard` السطر الفعلي:

```jsx
{action && <button type="button" className="wtc-primary-action" disabled={busy} onClick={() => onAdvance(order, action.status)}>{busy ? 'Updating...' : action.label}</button>}
```

`action` نتيجة `primaryAction(order)`؛ مثلًا new → preparing. عند الضغط `onAdvance(order,action.status)` تنادي **updateStatus في الأب**، مش دالة غامضة في ملف آخر.

### و. Handler تغيير الحالة كاملة

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

`order/status/reason=null` مدخلات الدالة؛ السبب اختياري إلا لبعض الحالات حسب validation. `setBusyOrders` يضيف ID لقائمة المشغول علشان نعطّل زر الطلب المحدد مش كل اللوحة.

`PATCH` تحديث جزئي. `expected_status` تبعت الحالة اللي الموظف شايفها؛ السيرفر يرفض لو موظف آخر نقل الطلب بالفعل. دي **optimistic concurrency check** وليست optimistic UI؛ الكود هنا لا يغيّر الحالة إلى النجاح قبل الرد.

`setOrders(current=>current.map(...))` يستبدل الطلب المطابق بنسخة السيرفر، ويترك البقية زي ما هي. لأن source state اتغير، حساب الأعمدة يتحدث والكرت يظهر في العمود الجديد.

`setMessage` رسالة السيرفر و`setReasonAction(null)` تقفل Modal السبب لو كانت مفتوحة. في conflict نطلب أحدث بيانات. باقي validation errors object قيمها arrays، فـ `Object.values(...).flat()[0]` تجيب أول رسالة.

`finally` تستبعد ID من busy، فتتاح الأزرار في النجاح أو الفشل.

سطرا الـ Route الفعليان داخل مجموعة staff المؤمنة بـ auth وrole؛ بينهما route عرض الطلب الواحد في المصدر الكامل:

```php
Route::get('/orders', [StaffOrderController::class, 'index']);
Route::patch('/orders/{order}/status', [StaffOrderController::class, 'updateStatus']);
```

**التطبيق اليدوي الآمن:** ادخل حساب staff في الديمو، تابع Network إن كنت في live محلي للتعلم من غير mutations؛ لو demo مفيش network calls حقيقية. اطلب sample order في tab أخرى محلية وشوف اللوحة بعد حوالي7ثوانٍ. جرّب تغيير الحالة في بيانات الديمو فقط.

**Interview:** ما الفرق بين polling وrealtime؟ polling يكرر HTTP دوريًا حتى بلا تغيير؛ WebSocket/SSE اتصال يستقبل تحديثات من السيرفر. وclearInterval لا تلغي fetch جارٍ.

## 4. أغيّر الكمية وأأكد Cash order: من input إلى tracking page

**النوع:** مقتطفات حرفية من `Pages/Cart.jsx`؛ JSX الأزرار مفصول تنسيقًا فقط. **الفكرة:** state تغيّر → subtotal يتحدث → payload يجهز → POST → tracking_url → Router يعرض OrderTracking.

### أ. نحدّث السطر بدل التعديل على نفس state

```js
const updateItem = (id, changes) => {
    const next = cartItems.map((item) => item.id === id ? { ...item, ...changes } : item);
    setCartItems(next);
    writeCart(next);
};
const removeItem = (id) => { const next = cartItems.filter((item) => item.id !== id); setCartItems(next); writeCart(next); };
const clearCart = () => { setCartItems([]); writeCart([]); };
const updateCustomer = (field, value) => setCustomer((current) => ({ ...current, [field]: value }));
```

`updateItem` تاخد id وobject التغييرات. `map` تعمل قائمة جديدة؛ لو العنصر مطابق ننسخه ونضيف changes فوقه. `setCartItems` تحدث الشاشة و`writeCart` تحفظ وتنبّه Navbar. كتابة واحدة مش بديل عن الأخرى.

`removeItem` تستخدم filter فتستبقي كل ID **غير** المطلوب. `clearCart` تفريغ كامل السلة بـ [] في المكانين. `updateCustomer` نفس نمط login: اسم حقل ديناميكي داخل object جديدة.

أزرار الكمية الحالية، تنسيق فقط:

```jsx
<button
    type="button"
    aria-label={`Decrease ${item.name}`}
    disabled={item.quantity <= 1}
    onClick={() => updateItem(item.id,{quantity:Math.max(1,item.quantity-1)})}
>-</button>
<strong>{item.quantity}</strong>
<button
    type="button"
    aria-label={`Increase ${item.name}`}
    onClick={() => updateItem(item.id,{quantity:item.quantity+1})}
>+</button>
```

`Math.max(1,item.quantity-1)` تختار الأكبر، فتمنع النزول تحت1 حتى لو الدالة اتنادت. `disabled` منع مرئي إضافي للزر. `{quantity:...}` object التغيير اللي helper هيدمجها. في زيادة الكمية الواجهة لا تفرض حد20 هنا؛ السيرفر لازم يتحقق من حدوده.

### ب. الحساب المشتق

```js
const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0), [cartItems]);
const deliveryFee = orderType === 'delivery' && cartItems.length ? Number(selectedBranch?.delivery_fee || 0) : 0;
const total = subtotal + deliveryFee;
```

`reduce` تجمع حاصل السعر×الكمية، والبداية0. `useMemo` تتبع cartItems؛ لما updateItem تعمل array جديدة يتحدث الحساب.

`deliveryFee` رسوم الفرع فقط لو delivery والسلة غير فاضية. غير كده0. `total` مجموع الاثنين، وحساب الواجهة للعرض فقط؛ مفيش ثقة في سعر المتصفح عند إنشاء الطلب.

المكان اللي النتيجة بتتعرض فيه حرفيًا:

```jsx
<div className="wtc-summary-line"><span>Subtotal</span><strong>EGP {subtotal.toFixed(2)}</strong></div><div className="wtc-summary-line"><span>Delivery fee</span><strong>EGP {deliveryFee.toFixed(2)}</strong></div><div className="wtc-summary-total"><span>Total</span><strong>EGP {total.toFixed(2)}</strong></div>
```

`toFixed(2)` تنسيق لمنزلتين، **ترجع string** وليست رقمًا جاهزًا للحساب.

### ج. payload هو شكل البيانات المتفق عليه مع API

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
```

`buildPayload` function بدون input لأنها تقرأ state الحالية. `() => ({...})` ترجع object مباشرة. **مش بتبعت request** ولا ترجع JSON string.

كل سطر يحول اسمًا في state إلى اسم الـ backend: مثل customer.name → customer_name. `Number` يحول branch ID لرقم.

العنوان يتكوّن لو delivery فقط؛ `[deliveryArea,deliveryAddress]` قائمة جزأين، `filter(Boolean)` تشيل القيم falsy، و`join(', ')` تجمع النص بفاصلة. غير delivery نرسل null.

`items.map` يحوّل كل سطر إلى ID/quantity/notes فقط. **مفيش price في payload**؛ Laravel يحسب السعر من قاعدة البيانات وخيار الفرع. `notes || null` يرسل null بدل النص الفاضي.

### د. الزر الفعلي والـ handler

فرع Cash داخل JSX، تنسيق فقط:

```jsx
<button
    type="button"
    className="btn btn-red w-100"
    disabled={disabled||isSubmitting}
    onClick={submitCashOrder}
>
    {isSubmitting?'Confirming...':'Confirm Order'}
</button>
```

المتغير `disabled` الحقيقي يجمع شروط نقص البيانات:

```js
const disabled = !selectedBranchId || !cartItems.length || !customer.name || !customer.phone || (orderType === 'delivery' && (!deliveryArea || !deliveryAddress)) || (orderType === 'pickup' && !customer.pickupTime);
```

كل `||` معناها «أو فيه نقص». الشرط المناسب للتوصيل يختلف عن pickup. ده UI validation مش بديل FormRequest في السيرفر.

```js
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

نبدأ برسالة فاضية وbusy=true. `buildPayload()` تتنفذ في اللحظة دي، `JSON.stringify` تحوّل object إلى body نصية. `csrfFetch` تضيف headers وتفك الرد.

بعد نجاح الطلب **فقط** نفضّي السلة ثم `navigate(response.tracking_url)`. مثل `/orders/some-token`. عند الفشل لا نفرغها، ونظهر أول validation message أو error.message. `finally` تنهي busy.

Route الحقيقي:

```php
Route::post('/orders', [OrderController::class, 'store']);
```

هو داخل prefix api. الـ endpoint يراجع البيانات والأسعار/توافر الأصناف في backend؛ تفاصيله في درس `OrderController` وملفات الطلب والخدمة المرتبطة. لو demo، نفس csrfFetch تذهب إلى demoFetch وتبني sample order في localStorage فقط.

الجزء اللي يكمل بعد navigate من `app.jsx`:

```jsx
<Route path="/orders/:token" element={<OrderTracking />} />
```

المسار يحتوي token، فيقرأه مكوّن التتبع ويطلب البيانات؛ هنكمل الرحلة دي في المثال7.

**Interview:** لماذا لا نرسل السعر ونثق فيه؟ لأن العميل قابل للتعديل. السيرفر يستقبل ID والكمية ويعيد حساب السعر من مصدره الموثوق. تعديل total في DevTools لا يجب أن يغيّر المبلغ الحقيقي.

## 5. فورم الأدمن: صورة + أسعار الفروع ليه محتاجين FormData؟

**النوع:** مقتطفات حرفية من `Pages/Admin/AdminPanel.jsx`؛ أسطر JSX الطويلة اتقسمت تنسيقًا فقط مع الحفاظ على نفس expressions. **الرحلة:** `MenuAdmin` يعرض `ProductForm` → المستخدم يكتب ويختار File → `save` تحول state إلى FormData → `csrfFetch` → `AdminController` → `onSaved` في الأب يقفل الفورم ويعيد تحميل القائمة.

**Status:** ملف AdminPanel نشط. صفحة `/admin/menu` تختاره عن طريق `AdminPanel`، وتحكم الوصول موجود في `AdminLayout` وفي Laravel middleware، مش في الزر فقط.

### أ. props الفورم والبيانات الأولية

```jsx
function ProductForm({ product, categories, branches, onSaved, onCancel }) {
    const [form, setForm] = useState(() => ({
        category_id: product?.category_id || categories[0]?.id || '',
        name: product?.name || '',
        description: product?.description || '',
        tag: product?.tag || '',
        display_order: product?.display_order || 0,
        is_active: product?.is_active ?? true,
        image: null,
        branch_options: branches.map((branch) => {
            const current = product?.branches?.find((item) => item.id === branch.id);
            return { branch_id: branch.id, price: current?.pivot?.price || '', is_available: current?.pivot?.is_available ?? true };
        }),
    }));
```

`ProductForm` مكوّن React يستقبل object props ثم يفك أسماءها بالـ destructuring. `product` إما منتج موجود للتعديل أو null لإنشاء جديد. `onSaved/onCancel` functions بعتها الأب، مش requests تلقائية.

`useState(() => ({...}))` initializer تعمل بداية المكوّن؛ مش إعادة نسخ props عند كل keypress. الأب يمرر key=product ID أو new، فالتبديل بين المنتجات يركّب فورم بهوية جديدة وحالة بداية مناسبة.

`product?.name || ''` لو في منتج خذ اسمه وإلا نص فاضي. `categories[0]?.id` افتراضي أول فئة إن وجدت. `is_active ?? true` تستخدم **nullish coalescing**: فقط null/undefined يرجّع true، لكن false الأصلية تفضل false. لو كتبنا `|| true` هنخسر false!

`image:null` معناها المستخدم لم يختَر File جديد بعد. `branch_options` array لكل فرع: نبحث عن بيانات الفرع المرتبطة بالمنتج ثم ننسخ price/is_available من `pivot`. ده اسم شكل العلاقة many-to-many اللي backend رجّعه.

### ب. المدخلات بتغيّر نفس state

مقتطفان فعليان من name وphoto، مع تنسيق أسطر فقط. بينهم حقول الفئة والوصف والترتيب في الملف الكامل؛ جمعنا المطلوب للشرح هنا، مش حذفهم من التطبيق:

```jsx
<label className="col-md-6">
    Name
    <input
        className="wtc-admin-input"
        value={form.name}
        onChange={(e)=>setForm({...form,name:e.target.value})}
        required
    />
</label>
<label className="col-md-5">
    Photo
    <input
        className="wtc-admin-input"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e)=>setForm({...form,image:e.target.files[0]||null})}
    />
</label>
```

النص يأخذ `e.target.value`. الملف يأخذ `e.target.files[0]`، لأن files هي قائمة File objects مش مجرد string filename. `||null` لو المستخدم ألغى الاختيار. ما بنحطش `value={form.image}` على file input هنا.

`accept` بتوجّه اختيار أنواع الملفات في المتصفح؛ لا تعني الملف آمن أو متحقق منه. Laravel لازم يراجع MIME/size/authorization والتخزين.

الفورم الفعلي من أوله مربوط بـ `onSubmit={save}`، وزر الحفظ في آخره:

```jsx
<button className="btn btn-red mt-3" disabled={busy}>{busy?'Saving...':'Save product'}</button>
```

زر button داخل form بدون type افتراضيه submit، فبيشغّل handler الفورم. busy تبدل النص وتعطل الزر.

### ج. تحديث سعر فرع محدد

الدالة الفعلية كاملة في سطر واحد:

```js
const setOption = (index, key, value) => setForm((current) => ({ ...current, branch_options: current.branch_options.map((option, optionIndex) => optionIndex === index ? { ...option, [key]: value } : option) }));
```

نقرأها من برّه لجوه: setOption تأخذ index الفرع، واسم الخاصية key، وقيمتها value. setForm تستقبل current. ننسخ باقي form، وبعدها نحدد نسخة جديدة من branch_options. map تمر على كل option؛ لو optionIndex مساوية index ننسخ option ونغير `[key]` فقط، وإلا نتركها.

المستدعي الحقيقي على حقل السعر، تنسيق فقط:

```jsx
<input
    className="wtc-admin-input my-2"
    type="number"
    step=".01"
    min="0"
    placeholder="Price"
    value={option.price}
    onChange={(e)=>setOption(index,'price',e.target.value)}
    required
/>
```

`index` من `form.branch_options.map((option,index)=>...)`. عند الكتابة نبعث `(index,'price',النص)`. type=number يساعد UI لكن event.target.value لسه عادة string؛ السيرفر يراجع الرقم ويحوّله حسب قواعده.

### د. save كاملة مش سطر POST لوحده

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

`preventDefault` يمنع إرسال المتصفح التقليدي. busy=true وerror='' بداية محاولة جديدة.

`new FormData()` ينشئ حاوية تقبل نصوص وFile/Blob، علشان رفع الملف. مش JSON object ومش request من تلقاء نفسه.

`Object.entries(form)` ترجع مثل `[['name','Pizza'],['image',File],...]`. `forEach(([key,value])=>...)` تمر على كل pair وتفك الاسم والقيمة. forEach ترجع undefined؛ هنا عايزين side effect وهو append، مش قائمة جديدة.

`body.append(key,value)` تضيف field للحاوية. لو branch_options نحوّل array إلى JSON string. لو image ومعها File نضيفها زي ما هي. لو image فاضية لا نضيف حقلها. باقي الحقول: `typeof value==='boolean'` يشوف النوع؛ Boolean تتحول `'1'/'0'` كنص مناسب للاستقبال، وباقي القيم تُضاف.

`product ? URL-with-ID : URL-create` تختار تعديل الموجود أو إنشاء جديد. في هذا المشروع **الطريقان POST فعلًا** كما routes، مش افتراض REST عام. `{method:'POST',body}` فيها اختصار body:body.

`csrfFetch` التي شرحناها بالرحلة2 تكتشف `body instanceof FormData`، فلا تضيف Content-Type JSON؛ المتصفح يولّد multipart boundary. تثبيت Content-Type يدويًا بدون boundary يفسد رفع الملفات.

بعد await ناجحة `onSaved()` تنادي function مررها MenuAdmin. في الخطأ نعرض أول validation message، وفي finally نعيد busy=false.

### هـ. التكملة عند الأب: حفظ، قفل، إعادة تحميل

مقتطف actual JSX مع تنسيق فقط:

```jsx
{editing!==undefined&&<ProductForm
    key={editing?.id||'new'}
    product={editing}
    categories={data.categories}
    branches={data.branches}
    onSaved={()=>{setEditing(undefined);load();}}
    onCancel={()=>setEditing(undefined)}
/>}
```

`editing===undefined` يعني الفورم مغلق. `editing===null` يعني منتج جديد. object يعني تعديل منتج. التفريق بين null وundefined هنا **مقصود في منطق المشروع**.

`onSaved` تغلق الفورم ثم تنادي load. دي الدالة الفعلية داخل MenuAdmin:

```js
const load=()=>csrfFetch('/api/admin/catalog').then(setData).catch((e)=>setError(e.message));
```

csrfFetch ترجع Promise. `.then(setData)` تمرر payload القادمة مباشرة إلى setter، فتحدث data والقائمة. `.catch` تحفظ error message. اسم load موجود كمان في مكوّنات أخرى في نفس الملف، لكن كل واحدة في scope مستقل ومش نفس endpoint.

الـ routes الحرفية داخل مجموعة admin:

```php
Route::post('/products', [AdminController::class, 'storeProduct']);
Route::post('/products/{menuItem}', [AdminController::class, 'updateProduct']);
```

**التطبيق الآمن:** جرّب كتابة حقول form في نسخة محلية. لو demo، تعديل البيانات بدون File متاح، لكن **رفع الصور معطل بوضوح** داخل demoFetch؛ فشل الرفع هناك حد مقصود مش عطل في FormData. لا تعطل منتجات live أثناء الدراسة.

**Interview:** لماذا FormData بدل JSON عند رفع صورة؟ لأنها تنقل File مع حقول النص في multipart، بينما stringify على File لا ينقل محتوى الملف المطلوب. والتحقق النهائي من الملف مسؤولية السيرفر.

## 6. الفيديو بيخلّي Navbar والنص يظهروا إزاي وهما في ملفات مختلفة؟

**النوع:** مقتطفات حرفية. **الملفات:** `app.jsx` الأب → `Pages/Home.jsx` → المكوّن الداخلي `HeroSection` → callback ترجع للأب → props تعود إلى `Navbar` وإلى overlay.

**الحقيقة المهمة:** `HeroSlider.jsx` و`HeroLanding.jsx` موجودان لكن لا يوجد import لهما في شجرة app.jsx الحالية. الفيديو النشط داخل Home. عدم وجود تشغيل لملف مش معناه إن الملف فارغ أو ممنوع مذاكرته؛ معناه اشرح استخدامه بوضوح ككود قديم.

### أ. حالة مشتركة عند الأب AppShell

```js
const [heroReady, setHeroReady] = useState(false);

const revealHero = useCallback(() => {
    setHeroReady(true);
}, []);
```

heroReady تبدأ false. revealHero callback تغيّرها true. useCallback تثبت function identity؛ لا تنتظر فيديو ولا تعرف توقيته بنفسها.

مقتطفات التوصيل الحرفية من app.jsx:

```jsx
<Navbar
    isVisible={!isHome || heroReady}
    reduceMotion={reduceMotion}
    animateReveal={isHome}
/>
```

```jsx
<Route path="/" element={<Home heroReady={heroReady} onHeroReady={revealHero} reduceMotion={reduceMotion} />} />
```

`isVisible={!isHome || heroReady}`: خارج الرئيسية الشريط يظهر؛ داخل الرئيسية ينتظر heroReady. `onHeroReady={revealHero}` يمرر الدالة باسم prop جديد. دي طريقة **child-to-parent communication**: الأب يرسل callback، الابن يناديها، الأب يحدّث state.

### ب. Home يمررها درجة إضافية إلى HeroSection

```jsx
<HeroSection
    isReady={heroReady}
    onReady={onHeroReady}
    reduceMotion={reduceMotion}
/>
```

نفس القيمة ونفس function reference، الأسماء اتغيرت محليًا فقط. Home مش بيعمل setHeroReady مباشرة؛ مفيش state setter خاص بالأب عنده إلا callback اللي استقبلها.

### ج. HeroSection يمسك الفيديو ويكشف النص مرة واحدة

```js
const HERO_REVEAL_TIME = 1.2;
const HERO_SLOWDOWN_START = 6;
const HERO_SLOWDOWN_END = 8;
const HERO_MIN_PLAYBACK_RATE = 0.35;
```

الأرقام دي **ثواني من زمن الفيديو**، مش pixels scroll أو وقت بعد فتح الصفحة. 0.35 هو playback speed factor.

داخل HeroSection:

```js
const videoRef = React.useRef(null);
const hasRevealedRef = React.useRef(false);

const revealContent = React.useCallback(() => {
    if (hasRevealedRef.current) return;

    hasRevealedRef.current = true;
    onReady();
}, [onReady]);
```

videoRef سيحمل DOM video element بعد render. hasRevealedRef علم لا يسبب render؛ يمنع تكرار callback من مصادر متعددة مثل loop/error/ended.

`if (...) return` تخرج إن حصل الكشف قبل كده. نضبط العلم true ثم `onReady()`؛ دي نفس revealHero في AppShell بعد مرورها عبر Home.

### د. effect التشغيل كاملة

```js
useEffect(() => {
    let isCurrentPlayback = true;
    let animationFrameId = 0;
    const video = videoRef.current;
    if (!video) {
        revealContent();
        return undefined;
    }

    hasRevealedRef.current = false;
    video.pause();
    video.playbackRate = 1;
    video.currentTime = 0;
    video.load();

    const updatePlayback = () => {
        if (!isCurrentPlayback || video.error) return;

        if (video.currentTime >= HERO_REVEAL_TIME) {
            revealContent();
        }

        if (Number.isFinite(video.duration) && video.duration > 0) {
            const slowdownEnd = Math.min(HERO_SLOWDOWN_END, video.duration);

            if (video.currentTime >= HERO_SLOWDOWN_START && slowdownEnd > HERO_SLOWDOWN_START) {
                const progress = Math.min(
                    1,
                    (video.currentTime - HERO_SLOWDOWN_START) / (slowdownEnd - HERO_SLOWDOWN_START),
                );
                const easedProgress = progress * progress * (3 - (2 * progress));
                video.playbackRate = 1 - ((1 - HERO_MIN_PLAYBACK_RATE) * easedProgress);
            } else {
                video.playbackRate = 1;
            }
        }

        if (!video.ended) {
            animationFrameId = window.requestAnimationFrame(updatePlayback);
        }
    };

    animationFrameId = window.requestAnimationFrame(updatePlayback);

    const playPromise = video.play();
    playPromise?.catch(() => {
        if (isCurrentPlayback) {
            revealContent();
            window.cancelAnimationFrame(animationFrameId);
        }
    });

    return () => {
        isCurrentPlayback = false;
        window.cancelAnimationFrame(animationFrameId);
    };
}, [revealContent]);
```

`isCurrentPlayback` علم داخل effect؛ cleanup تغيّره false حتى أي callback متأخر ما يكمّلش دورة قديمة. `animationFrameId` يمسك رقم آخر callback مجدولة. `const video=videoRef.current` تمسك العنصر الحقيقي بدل React component.

لو العنصر غير موجود نكشف المحتوى بدل شاشة انتظار للأبد ثم نرجع undefined؛ cleanup غير مطلوبة في الفرع ده لأنه لا جدول شيئًا.

`pause()` method browser توقف الفيديو مؤقتًا. `playbackRate=1` property يعيد السرعة الطبيعية. `currentTime=0` يعيد البداية. `load()` method تعيد بدء اختيار/تحميل المصدر. مش كل سطر dot هو method: الـ properties فيها `=`، والـ method تُستدعى بـ `()`.

`updatePlayback` callback نقرأ فيها تقدم الفيديو. لو دورة قديمة أو video.error نخرج. لو currentTime وصلت1.2 ثانية ننادي revealContent، فلازم نفهم callback الأب عشان نفهم آخر النتيجة.

`Number.isFinite(video.duration)` تتأكد إن مدة الفيديو رقم محدود؛ metadata قد تكون لسه مش جاهزة. `Math.min(8,duration)` يختار آخر زمن تبطيء بدون تجاوز مدة الفيديو.

فرع البطء يشتغل بعد الثانية6 لو فيه مدى صالح. `(currentTime-6)/(end-6)` يحوّل مدى الوقت لتقدم0..1، وMath.min تحصر الحد الأعلى. `progress*progress*(3-2*progress)` **smoothstep** لتدرج ناعم. النتيجة تنزل بالسرعة من1 إلى0.35. مش لازم تحفظ المعادلة؛ افهم input وناتجها واستخدامه في playbackRate.

`requestAnimationFrame(updatePlayback)` يجدول **مرة واحدة قبل فرصة الرسم المقبلة**. بداخل callback نعيد الجدولة لو الفيديو لم ينته. مش function تتكرر تلقائيًا زي interval. العائد ID علشان الإلغاء.

`video.play()` ترجع Promise لمحاولة التشغيل. ممكن المتصفح يرفض autoplay؛ catch تكشف النص وتلغي animation frame بدل ما نعلق الواجهة. `playPromise?.catch` تفحص وجود النتيجة قبل قراءة catch.

cleanup تلغي callback القادمة باستخدام آخر ID. `cancelAnimationFrame` مش pause للفيديو نفسه. `[revealContent]` يعيد setup لو function reference اتغيرت.

### هـ. عنصر الفيديو والـ fallback والنتيجة

```jsx
<video
    key="hero-intro-video-v2"
    ref={videoRef}
    className="wtc-hero-video object-cover w-100 h-100 position-absolute top-0 start-0"
    src="/videos/hero-pizza-motion.mp4?v=20260930-2"
    muted
    playsInline
    preload="auto"
    onEnded={revealContent}
    onError={revealContent}
    aria-hidden="true"
/>
```

`ref={videoRef}` هي اللي وضعت DOM element في current. `muted` كتم الصوت يساعد السماح بالتشغيل؛ لا يضمنه. `playsInline` لتشغيل داخل الصفحة على الأجهزة المناسبة. `preload=auto` تلميح تحميل للمتصفح، مش إجبار. onEnded/onError ينادوا نفس callback كـ fallback. aria-hidden لأن الفيديو خلفية زخرفية والمعلومات موجودة بالنص.

الـ overlay في نفس الملف يستخدم:

```jsx
{isReady && (
    <motion.div
        className="wtc-hero-overlay"
        variants={heroReveal}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
    >
```

ده opening excerpt؛ باقي العنوان والأزرار وإغلاق العناصر موجود في المصدر الكامل. isReady شرط الرسم، variants إعدادات الحركة الفعلية في أعلى الملف. reduceMotion يخفف كشف النص؛ **لا يوقف تحميل الفيديو تلقائيًا في الكود الحالي**.

**النهاية:** currentTime≥1.2 أو failure → revealContent → onReady → onHeroReady → revealHero → setHeroReady(true) → Navbar يظهر وoverlay يتركب. كده تابعنا الوظيفة عبر الملفين من أولها لآخرها.

**Interview:** الفرق بين ref وstate في React؟ ref لمرجع DOM/قيمة mutable لا تحتاج render؛ state عندما تكون القيمة هي التي تحدد المخرجات المرئية. وrequestAnimationFrame ليست interval ثابتة ولا توقف الفيديو وحدها.

## 7. بعد إنشاء الطلب: التتبع والسجل وإعادة الطلب

**النوع:** مقتطفات حرفية. **الملفات:** `app.jsx` → `Pages/OrderTracking.jsx` → `lib/api.js` → `OrderTrackingController.php`. ثم رحلة أخرى من `Pages/MyOrders.jsx` → endpoint reorder → سلة Cart.

### أ. قراءة token وجلب الطلب

من `OrderTracking.jsx`:

```js
const { token } = useParams();
const [order, setOrder] = useState(null);
const [error, setError] = useState('');
const [loading, setLoading] = useState(true);
const [updatedAt, setUpdatedAt] = useState(null);

const loadOrder = useCallback(async () => {
    try {
        const response = await csrfFetch('/api/orders/track/' + encodeURIComponent(token));
        setOrder(response.order);
        setError('');
        setUpdatedAt(new Date());
    } catch (requestError) {
        setError(requestError.payload?.message || (requestError.message === 'Not Found' ? 'Order not found.' : requestError.message));
    } finally {
        setLoading(false);
    }
}, [token]);

useEffect(() => {
    loadOrder();
    const timer = window.setInterval(loadOrder, 7000);
    return () => window.clearInterval(timer);
}, [loadOrder]);
```

`useParams()` من Router تقرأ token من `/orders/:token`. ده ليس password ولا يجب عرضه عشوائيًا في صفحة عامة لو هيسمح بقراءة بيانات حساسة؛ السيرفر يحدد سياسة المعلومات الراجعة.

state order تبدأ null حتى أول response. `encodeURIComponent(token)` تهرّب رموز جزء URL، **مش تشفير** ولا security authorization. csrfFetch ترجع payload فنسند response.order إلى state.

نمسح error عند نجاح ونحفظ updatedAt لعرض وقت آخر تحديث. catch تختار رسالة backend لو متاحة أو message بديلة. finally تنهي أول loading.

useCallback تعتمد على token؛ لما العنوان يتغير الدالة تتغير، والـ effect تلغي interval القديمة وتبدأ على الطلب الجديد. نفس setInterval/clearInterval اللي شرحناها في الرحلة3. **loadOrder هنا لا تحتوي loadingRef أو AbortController**، فلا ننسب لها منع overlap أو إلغاء network غير موجود.

### ب. حساب خطوات العرض من بيانات الطلب

```js
function statusSteps(order) {
    return order.order_type === 'delivery'
        ? ['new', 'preparing', 'ready', 'out_for_delivery', 'completed']
        : ['new', 'preparing', 'ready', 'picked_up', 'completed'];
}
```

دي pure helper: تتلقى order وترجع array حالات حسب طريقة الاستلام، لا تغير state ولا تبعت طلب.

```js
const steps = useMemo(() => order ? statusSteps(order) : [], [order]);
const visibleStatus = order?.status === 'accepted' ? 'preparing' : order?.status;
const currentIndex = steps.indexOf(visibleStatus);
const closed = ['cancelled', 'rejected'].includes(order?.status);
```

`steps` فاضية لو لسه مفيش order. status=accepted يظهر في خطوة preparing لأن التايملاين لا تعرض accepted منفصلة. `indexOf` يرجع موضع الحالة أو-1 لو غير موجودة، مثل payment_pending. `closed` true عند الإلغاء/الرفض فتظهر رسالة السبب بدل التايملاين.

عنوان الحالة الفعلي على الشاشة:

```jsx
<h2 className="h4">Current status: {STATUS_LABELS[order.status] || order.status}</h2>
```

`STATUS_LABELS` dictionary من أعلى الملف يحوّل كود الحالة إلى كلام مقروء؛ `||order.status` fallback لو كود مش في dictionary. `[]` هنا dynamic property access باسم قيمة order.status، مش index قائمة فقط.

### ج. MyOrders: الزر الذي يعيد ملء السلة لا يعيد الطلب القديم تلقائيًا

داخل `MyOrders.jsx` الصفحة تستعمل:

```js
const { setOrderMode, setBranch } = useOrder();
const navigate = useNavigate();
```

الزر الفعلي:

```jsx
<button type="button" className="btn btn-red" onClick={() => reorder(order)}>Reorder</button>
```

الدالة كاملة:

```js
const reorder = async (order) => {
    setError('');
    try {
        const response = await csrfFetch('/api/orders/' + order.id + '/reorder', { method: 'POST' });
        setOrderMode(response.order_type);
        setBranch(response.branch_id, { confirmCart: true });
        localStorage.setItem(import.meta.env.VITE_DEMO_MODE === 'true' ? 'wtc_demo_cart' : 'wtc_cart', JSON.stringify(response.cart_items));
        window.dispatchEvent(new Event('wtc-cart-updated'));
        navigate('/cart');
    } catch (requestError) {
        setError(requestError.message);
    }
};
```

نمسح error القديمة. POST يطلب **تجهيز سلة من طلب سابق**؛ endpoint يراجع الملكية والتوفر والأسعار الحالية في backend، مش وثوقًا بأسعار قديمة محفوظة في JSX.

`setOrderMode` و`setBranch` دوال من OrderContext، شرحنا مصدرها في الرحلة1. `{confirmCart:true}` يطلب الموافقة عند تغيير فرع السلة. **ملاحظة واقع الكود:** الدالة هنا لا تفحص false من setBranch وتكمل كتابة السلة؛ ده نقص منطقي محتمل عند إلغاء المستخدم، مش سلوك مثالي ندافع عنه في المقابلة.

`response.cart_items` جاهزة من API؛ نحولها JSON ونكتبها تحت مفتاح demo/live المناسب. dispatchEvent يحدّث عداد Navbar، وبعد navigate('/cart') تأثير sync في Cart يقرأ نفس المفتاح ويعرض العناصر.

Route المتصل في Laravel داخل مجموعة auth:

```php
Route::get('/orders/history', [OrderTrackingController::class, 'history']);
Route::post('/orders/{order}/reorder', [OrderTrackingController::class, 'reorder']);
```

**النتيجة:** المستخدم يشوف سلة جاهزة للمراجعة ويؤكد checkout من جديد. Reorder **مش معناه تم إنشاء order جديد بالفعل** بمجرد الضغط على الزر.

**تطبيق آمن:** بحساب Demo Customer اختار طلب sample من My orders، اضغط Reorder، راجع السلة. جرّب صنفًا أصبح غير متاح في الديمو وشوف إن backend demo يقدر يستبعده. لا تستخدم بيانات عملاء حقيقية.

**Interview:** ما الفرق بين UI route وAPI route؟ React Router يختار المكوّن داخل المتصفح؛ Laravel route يستقبل HTTP method/URL ويشغل منطقًا ويرجع استجابة. نفس التطبيق يستعمل الاثنين، لكن كل واحد شغال في طبقة مختلفة.

## خريطة المذاكرة من غير ادعاء تغطية ملف كامل بالمقتطفات

الرحلات السبعة ربطت الواجهة والـ handlers والـ helpers والـ Context والـ API المسمّاة. المصدر الكامل لباقي مكونات كل ملف موجود في أطلس الملفات، ومنها تفاصيل WebAudio/ReasonModal/طباعة التذكرة وباقي تبويبات Admin وStripe وDemo API وكل سطور CSS داخل JSX. المقتطفات فوق لا تقول إن باقي الكود اتلغى أو إن مجرد نسخها ينشئ صفحة كاملة.

**قاعدة التطبيق:** اقرأ العنوان «مقتطف حرفي/تنسيق فقط/مثال تدريبي» قبل النسخ. اكتب الرحلة في نسخة تدريبية، وافتح الملف المرتبط عند أول اسم function مخصص غير واضح. أي side effect له شبكة/رفع/حذف/دفع تجرّبه على demo أو اختبارات فقط.


