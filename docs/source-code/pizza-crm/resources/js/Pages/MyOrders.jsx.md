# سجل العميل وإعادة الطلب

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `resources/js/Pages/MyOrders.jsx` · 42 سطر.

**وظيفة الملف:** يجلب تاريخ المستخدم المسجل. Reorder لا ينسخ السعر القديم حرفيًا؛ API يرجع cart_items الحالية ثم الواجهة تملأ السلة وتنتقل إليها.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../resources/js/Pages/MyOrders.jsx). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/resources/js/context/AuthContext.jsx](../context/AuthContext.jsx.md)

- [pizza-crm/resources/js/context/OrderContext.jsx](../context/OrderContext.jsx.md)

- [pizza-crm/resources/js/lib/api.js](../lib/api.js.md)

- [pizza-crm/resources/js/Pages/Cart.jsx](Cart.jsx.md)

- [pizza-crm/app/Http/Controllers/Api/OrderTrackingController.php](../../../app/Http/Controllers/Api/OrderTrackingController.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { csrfFetch } from '../lib/api';

export default function MyOrders() {
    const { user, isCheckingAuth } = useAuth();
    const { setOrderMode, setBranch } = useOrder();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        csrfFetch('/api/orders/history').then((response) => setOrders(response.orders || [])).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false));
    }, [user]);

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

    if (isCheckingAuth || loading) return <main className="wtc-orders-page"><div className="container">Loading orders...</div></main>;
    if (!user) return <main className="wtc-orders-page"><div className="container text-center"><h1>Sign in to see your orders.</h1><Link to="/login" className="btn btn-red">Sign in</Link></div></main>;

    return <main className="wtc-orders-page"><style>{`.wtc-orders-page{min-height:100vh;padding:8rem 0 5rem;background:#111;color:#f5f5f5}.wtc-order-history{display:grid;gap:.8rem}.wtc-history-card{display:grid;grid-template-columns:1fr auto;gap:1rem;padding:1.1rem;border:1px solid #303030;border-radius:8px;background:#1a1a1a}.wtc-history-meta{display:flex;flex-wrap:wrap;gap:.8rem;color:#999}.wtc-history-actions{display:flex;align-items:center;gap:.5rem}@media(max-width:575px){.wtc-history-card{grid-template-columns:1fr}.wtc-history-actions{justify-content:stretch}.wtc-history-actions>*{flex:1}}`}</style><div className="container"><p className="eyebrow">Account</p><h1 className="display-4 fw-bold mb-4">My orders</h1>{error && <div className="alert alert-danger">{error}</div>}{!orders.length ? <section className="text-center py-5"><h2>No orders yet.</h2><Link to="/menu" className="btn btn-red">Explore the menu</Link></section> : <div className="wtc-order-history">{orders.map((order) => <article className="wtc-history-card" key={order.id}><div><h2 className="h5">Order #{order.id} · <span className="text-capitalize">{order.status.replaceAll('_', ' ')}</span></h2><div className="wtc-history-meta"><span>{order.branch?.name}</span><span>{new Date(order.created_at).toLocaleString()}</span><span>EGP {Number(order.total_price).toFixed(2)}</span></div></div><div className="wtc-history-actions"><Link className="btn btn-outline-light" to={'/orders/' + order.tracking_token}>Track</Link><button type="button" className="btn btn-red" onClick={() => reorder(order)}>Reorder</button></div></article>)}</div>}</div></main>;
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### MyOrders

يعرض loading/signin/history وTrack/Reorder لكل طلب.

- **بتاخد إيه؟ Inputs:** useAuth/useOrder.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX.

### reorder

POST لطلب إعادة الطلب، يضبط mode والفرع ويحفظ cart_items ويصدر الحدث ثم يذهب /cart. الكود الحالي لا يفحص false العائد من setBranch؛ نقطة مراجعة مهمة قبل تحسينه.

- **بتاخد إيه؟ Inputs:** order: الطلب القديم.

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<void>.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### useAuth

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** Custom hook يقرأ AuthContext؛ يرمي خطأ واضح لو اتنادى خارج AuthProvider.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** object فيه user/isCheckingAuth/login/register/logout.

- **أول موضع هنا:** السطر 8.

- **تكملة التعريف:** [resources/js/context/AuthContext.jsx](../context/AuthContext.jsx.md)، عند السطر 74.

### useOrder

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** Custom hook يقرأ اختيار الفرع وطريقة الاستلام والعنوان ودوال تغييرها.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** value الخاص بـ OrderContext أو يرمي خطأ لو خارج Provider.

- **أول موضع هنا:** السطر 9.

- **تكملة التعريف:** [resources/js/context/OrderContext.jsx](../context/OrderContext.jsx.md)، عند السطر 127.

### useNavigate

- **جاية منين؟** react-router-dom hook

- **وظيفتها:** يوفر function للتنقل داخل SPA؛ replace=true يستبدل history entry الحالية.

- **المدخلات — Arguments:** لا شيء عند إنشاء hook.

- **الناتج/الأثر — Return / effect:** navigate function.

- **أول موضع هنا:** السطر 10.

- **مثال:** navigate('/cart');

### useState

- **جاية منين؟** React

- **وظيفتها:** حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة.

- **المدخلات — Arguments:** initialState

- **الناتج/الأثر — Return / effect:** [currentState,setter]

- **أول موضع هنا:** السطر 13، والمدخلات المكتوبة: `true`.

- **مثال:** const [failed, setFailed] = useState(false);

### useEffect

- **جاية منين؟** React

- **وظيفتها:** يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies.

- **المدخلات — Arguments:** setup callback, dependencies

- **الناتج/الأثر — Return / effect:** undefined

- **أول موضع هنا:** السطر 15، والمدخلات المكتوبة: `() => {         if (!user) {             setLoading(false);             return;         }         csrfFetch('/api/orders/history').then((response) => setOrders(response.orders || […`، `[user]`.

- **مثال:** useEffect(() => { window.addEventListener('resize', updateRunway); return () => window.removeEventListener('resize', updateRunway); }, []);

### setLoading

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setLoading هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 20، والمدخلات المكتوبة: `false`.

### csrfFetch('/api/orders/history').then((response) => setOrders(response.orders || [])).catch((requestError) => setError(requestError.message)).finally

- **جاية منين؟** Promise

- **وظيفتها:** تسجّل تنظيفًا بعد حسم النجاح أو الفشل.

- **المدخلات — Arguments:** callback.

- **الناتج/الأثر — Return / effect:** Promise جديدة؛ callback لا تستقبل بيانات النجاح كمدخل.

- **أول موضع هنا:** السطر 20، والمدخلات المكتوبة: `() => setLoading(false)`.

### csrfFetch('/api/orders/history').then((response) => setOrders(response.orders || [])).catch

- **جاية منين؟** Promise

- **وظيفتها:** تسجّل معالجة فشل الـPromise.

- **المدخلات — Arguments:** callback تستقبل سبب الفشل.

- **الناتج/الأثر — Return / effect:** Promise جديدة؛ عدم إعادة الرمي قد يحوّل المسار لنجاح.

- **أول موضع هنا:** السطر 20، والمدخلات المكتوبة: `(requestError) => setError(requestError.message)`.

### csrfFetch('/api/orders/history').then

- **جاية منين؟** Promise

- **وظيفتها:** تسجّل معالجة نجاح مع إمكانية chaining.

- **المدخلات — Arguments:** onFulfilled وonRejected اختيارية.

- **الناتج/الأثر — Return / effect:** Promise جديدة بنتيجة callback.

- **أول موضع هنا:** السطر 20، والمدخلات المكتوبة: `(response) => setOrders(response.orders || [])`.

### csrfFetch

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح.

- **المدخلات — Arguments:** url: مسار API؛ options: method/body/headers وغيرها، الافتراضي {}.

- **الناتج/الأثر — Return / effect:** Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.

- **أول موضع هنا:** السطر 26، والمدخلات المكتوبة: `'/api/orders/' + order.id + '/reorder'`، `{ method: 'POST' }`.

- **تكملة التعريف:** [resources/js/lib/api.js](../lib/api.js.md)، عند السطر 3.

### setOrders

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setOrders هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 20، والمدخلات المكتوبة: `response.orders || []`.

### setError

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 33، والمدخلات المكتوبة: `requestError.message`.

### setOrderMode

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setOrderMode هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 27، والمدخلات المكتوبة: `response.order_type`.

### setBranch

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setBranch هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 28، والمدخلات المكتوبة: `response.branch_id`، `{ confirmCart: true }`.

### localStorage.setItem

- **جاية منين؟** Browser localStorage/sessionStorage

- **وظيفتها:** تحفظ قيمة نصية تحت مفتاح وتستبدل القديمة.

- **المدخلات — Arguments:** key وvalue.

- **الناتج/الأثر — Return / effect:** undefined؛ قد تفشل لو التخزين غير متاح.

- **أول موضع هنا:** السطر 29، والمدخلات المكتوبة: `import.meta.env.VITE_DEMO_MODE === 'true' ? 'wtc_demo_cart' : 'wtc_cart'`، `JSON.stringify(response.cart_items)`.

### JSON.stringify

- **جاية منين؟** JavaScript

- **وظيفتها:** يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions.

- **المدخلات — Arguments:** value

- **الناتج/الأثر — Return / effect:** string أو undefined لبعض القيم

- **أول موضع هنا:** السطر 29، والمدخلات المكتوبة: `response.cart_items`.

- **مثال:** localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

### window.dispatchEvent

- **جاية منين؟** Browser EventTarget

- **وظيفتها:** ترسل Event للمستمعين على هذا الهدف بشكل متزامن.

- **المدخلات — Arguments:** Event object.

- **الناتج/الأثر — Return / effect:** Boolean مرتبطة بعدم إلغاء default؛ مش HTTP response.

- **أول موضع هنا:** السطر 30، والمدخلات المكتوبة: `new Event('wtc-cart-updated')`.

### Event

- **جاية منين؟** Browser

- **وظيفتها:** تنشئ Event تحمل نوع الحدث.

- **المدخلات — Arguments:** event type وoptions.

- **الناتج/الأثر — Return / effect:** Event object؛ الإرسال يحتاج dispatchEvent.

- **أول موضع هنا:** السطر 30، والمدخلات المكتوبة: `'wtc-cart-updated'`.

### navigate

- **جاية منين؟** React Router callback

- **وظيفتها:** تنقّل داخل SPA حسب route.

- **المدخلات — Arguments:** path وoptions مثل replace.

- **الناتج/الأثر — Return / effect:** void/Promise حسب نمط Router؛ مش حماية endpoint.

- **أول موضع هنا:** السطر 31، والمدخلات المكتوبة: `'/cart'`.

### orders.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 40، والمدخلات المكتوبة: `(order) => <article className="wtc-history-card" key={order.id}><div><h2 className="h5">Order #{order.id} · <span className="text-capitalize">{order.status.replaceAll('_', ' ')}</s…`.

### order.status.replaceAll

- **جاية منين؟** String

- **وظيفتها:** تستبدل كل التطابقات بنص جديد.

- **المدخلات — Arguments:** search وreplacement.

- **الناتج/الأثر — Return / effect:** string جديدة؛ لا تعدّل الأصل.

- **أول موضع هنا:** السطر 40، والمدخلات المكتوبة: `'_'`، `' '`.

### new Date(order.created_at).toLocaleString

- **جاية منين؟** Date/Number instance

- **وظيفتها:** تنسّق القيمة للعرض المحلي.

- **المدخلات — Arguments:** locale وخيارات.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 40.

### Date

- **جاية منين؟** JavaScript Date

- **وظيفتها:** مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي.

- **المدخلات — Arguments:** قيمة تاريخ اختيارية.

- **الناتج/الأثر — Return / effect:** Date object عند new؛ مش string تلقائيًا.

- **أول موضع هنا:** السطر 40، والمدخلات المكتوبة: `order.created_at`.

### Number(order.total_price).toFixed

- **جاية منين؟** Number / JavaScript

- **وظيفتها:** تنسّق عددًا بمواضع عشرية محددة.

- **المدخلات — Arguments:** عدد الخانات.

- **الناتج/الأثر — Return / effect:** string، مش رقمًا صالحًا للحساب بدون تحويل.

- **أول موضع هنا:** السطر 40، والمدخلات المكتوبة: `2`.

### Number

- **جاية منين؟** JavaScript conversion function

- **وظيفتها:** يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** number أو NaN.

- **أول موضع هنا:** السطر 40، والمدخلات المكتوبة: `order.total_price`.

- **مثال:** Number(option.price);

### reorder

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** POST لطلب إعادة الطلب، يضبط mode والفرع ويحفظ cart_items ويصدر الحدث ثم يذهب /cart. الكود الحالي لا يفحص false العائد من setBranch؛ نقطة مراجعة مهمة قبل تحسينه.

- **المدخلات — Arguments:** order: الطلب القديم.

- **الناتج/الأثر — Return / effect:** Promise<void>.

- **أول موضع هنا:** السطر 40، والمدخلات المكتوبة: `order`.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { csrfFetch } from '../lib/api';

export default function MyOrders() {
    const { user, isCheckingAuth } = useAuth();
```

**السطر 1:** Import / استيراد: الأسماء `React`، `useEffect`، `useState` جاية من `react`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 2:** Import / استيراد: الأسماء `Link`، `useNavigate` جاية من `react-router-dom`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 3:** Import / استيراد: الأسماء `useAuth` جاية من `../context/AuthContext`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 4:** Import / استيراد: الأسماء `useOrder` جاية من `../context/OrderContext`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 5:** Import / استيراد: الأسماء `csrfFetch` جاية من `../lib/api`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 7:** Function / تعريف دالة `MyOrders`؛ تعريفها مش تشغيلها. يعرض loading/signin/history وTrack/Reorder لكل طلب. مدخلاتها: useAuth/useOrder. ناتجها: JSX.

**السطر 8:** Variable declaration / تعريف اسم/أسماء لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useAuth(...)`: Custom hook يقرأ AuthContext؛ يرمي خطأ واضح لو اتنادى خارج AuthProvider. مدخلاتها: لا شيء. العائد/الأثر: object فيه user/isCheckingAuth/login/register/logout.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 9–16

```jsx
    const { setOrderMode, setBranch } = useOrder();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
```

**السطر 9:** Variable declaration / تعريف اسم/أسماء لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useOrder(...)`: Custom hook يقرأ اختيار الفرع وطريقة الاستلام والعنوان ودوال تغييرها. مدخلاتها: لا شيء. العائد/الأثر: value الخاص بـ OrderContext أو يرمي خطأ لو خارج Provider.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 10:** Variable declaration / تعريف `navigate` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useNavigate(...)`: يوفر function للتنقل داخل SPA؛ replace=true يستبدل history entry الحالية. مدخلاتها: لا شيء عند إنشاء hook. العائد/الأثر: navigate function.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 11:** Variable declaration / تعريف `orders + setOrders` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `[]`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 12:** Variable declaration / تعريف `error + setError` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `''`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 13:** Variable declaration / تعريف `loading + setLoading` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `true`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 15:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `() => {         if (!user) {             setLoading(false);             return;         }         csrfFetch('/…`، `[user]`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 16:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

### السطور 17–24

```jsx
            setLoading(false);
            return;
        }
        csrfFetch('/api/orders/history').then((response) => setOrders(response.orders || [])).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false));
    }, [user]);

    const reorder = async (order) => {
        setError('');
```

**السطر 17:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setLoading(...)`: لو setLoading هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `false`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 18:** Return / رجّع `` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 19:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 20:** Catch: استقبل الخطأ من try/Promise حسب السياق وتعامل مع رسالته؛ catch لا تعني نجاح الطلب الأصلي. الدوال الموجودة في السطر: `csrfFetch('/api/orders/history').then((response) => setOrders(response.orders || [])).catch((requestError) => setError(requestError.message)).finally(...)`: تسجّل تنظيفًا بعد حسم النجاح أو الفشل. القيم المكتوبة هنا: `() => setLoading(false)`. العائد/الأثر: Promise جديدة؛ callback لا تستقبل بيانات النجاح كمدخل.؛ `csrfFetch('/api/orders/history').then((response) => setOrders(response.orders || [])).catch(...)`: تسجّل معالجة فشل الـPromise. القيم المكتوبة هنا: `(requestError) => setError(requestError.message)`. العائد/الأثر: Promise جديدة؛ عدم إعادة الرمي قد يحوّل المسار لنجاح.؛ `csrfFetch('/api/orders/history').then(...)`: تسجّل معالجة نجاح مع إمكانية chaining. القيم المكتوبة هنا: `(response) => setOrders(response.orders || [])`. العائد/الأثر: Promise جديدة بنتيجة callback.؛ `csrfFetch(...)`: توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح. القيم المكتوبة هنا: `'/api/orders/history'`. العائد/الأثر: Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.؛ `setOrders(...)`: لو setOrders هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `response.orders || []`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `setError(...)`: لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `requestError.message`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `setLoading(...)`: لو setLoading هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `false`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 21:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 23:** Variable declaration / تعريف `reorder` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `reorder` هنا: POST لطلب إعادة الطلب، يضبط mode والفرع ويحفظ cart_items ويصدر الحدث ثم يذهب /cart. الكود الحالي لا يفحص false العائد من setBranch؛ نقطة مراجعة مهمة قبل تحسينه. المدخلات: order: الطلب القديم.. الناتج/الأثر: Promise<void>..

**السطر 24:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setError(...)`: لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `''`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 25–32

```jsx
        try {
            const response = await csrfFetch('/api/orders/' + order.id + '/reorder', { method: 'POST' });
            setOrderMode(response.order_type);
            setBranch(response.branch_id, { confirmCart: true });
            localStorage.setItem(import.meta.env.VITE_DEMO_MODE === 'true' ? 'wtc_demo_cart' : 'wtc_cart', JSON.stringify(response.cart_items));
            window.dispatchEvent(new Event('wtc-cart-updated'));
            navigate('/cart');
        } catch (requestError) {
```

**السطر 25:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة.

**السطر 26:** Variable declaration / تعريف `response` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `csrfFetch(...)`: توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح. القيم المكتوبة هنا: `'/api/orders/' + order.id + '/reorder'`، `{ method: 'POST' }`. العائد/الأثر: Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 27:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setOrderMode(...)`: لو setOrderMode هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `response.order_type`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 28:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `setBranch(...)`: لو setBranch هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `response.branch_id`، `{ confirmCart: true }`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 29:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `localStorage.setItem(...)`: تحفظ قيمة نصية تحت مفتاح وتستبدل القديمة. القيم المكتوبة هنا: `import.meta.env.VITE_DEMO_MODE === 'true' ? 'wtc_demo_cart' : 'wtc_cart'`، `JSON.stringify(response.cart_items)`. العائد/الأثر: undefined؛ قد تفشل لو التخزين غير متاح.؛ `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `response.cart_items`. العائد/الأثر: string أو undefined لبعض القيم. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 30:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `window.dispatchEvent(...)`: ترسل Event للمستمعين على هذا الهدف بشكل متزامن. القيم المكتوبة هنا: `new Event('wtc-cart-updated')`. العائد/الأثر: Boolean مرتبطة بعدم إلغاء default؛ مش HTTP response.؛ `Event(...)`: تنشئ Event تحمل نوع الحدث. القيم المكتوبة هنا: `'wtc-cart-updated'`. العائد/الأثر: Event object؛ الإرسال يحتاج dispatchEvent.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 31:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `navigate(...)`: تنقّل داخل SPA حسب route. القيم المكتوبة هنا: `'/cart'`. العائد/الأثر: void/Promise حسب نمط Router؛ مش حماية endpoint.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 32:** Catch: استقبل الخطأ من try/Promise حسب السياق وتعامل مع رسالته؛ catch لا تعني نجاح الطلب الأصلي.

### السطور 33–40

```jsx
            setError(requestError.message);
        }
    };

    if (isCheckingAuth || loading) return <main className="wtc-orders-page"><div className="container">Loading orders...</div></main>;
    if (!user) return <main className="wtc-orders-page"><div className="container text-center"><h1>Sign in to see your orders.</h1><Link to="/login" className="btn btn-red">Sign in</Link></div></main>;

    return <main className="wtc-orders-page"><style>{`.wtc-orders-page{min-height:100vh;padding:8rem 0 5rem;background:#111;color:#f5f5f5}.wtc-order-history{display:grid;gap:.8rem}.wtc-history-card{display:grid;grid-template-columns:1fr auto;gap:1rem;padding:1.1rem;border:1px solid #303030;border-radius:8px;background:#1a1a1a}.wtc-history-meta{display:flex;flex-wrap:wrap;gap:.8rem;color:#999}.wtc-history-actions{display:flex;align-items:center;gap:.5rem}@media(max-width:575px){.wtc-history-card{grid-template-columns:1fr}.wtc-history-actions{justify-content:stretch}.wtc-history-actions>*{flex:1}}`}</style><div className="container"><p className="eyebrow">Account</p><h1 className="display-4 fw-bold mb-4">My orders</h1>{error && <div className="alert alert-danger">{error}</div>}{!orders.length ? <section className="text-center py-5"><h2>No orders yet.</h2><Link to="/menu" className="btn btn-red">Explore the menu</Link></section> : <div className="wtc-order-history">{orders.map((order) => <article className="wtc-history-card" key={order.id}><div><h2 className="h5">Order #{order.id} · <span className="text-capitalize">{order.status.replaceAll('_', ' ')}</span></h2><div className="wtc-history-meta"><span>{order.branch?.name}</span><span>{new Date(order.created_at).toLocaleString()}</span><span>EGP {Number(order.total_price).toFixed(2)}</span></div></div><div className="wtc-history-actions"><Link className="btn btn-outline-light" to={'/orders/' + order.tracking_token}>Track</Link><button type="button" className="btn btn-red" onClick={() => reorder(order)}>Reorder</button></div></article>)}</div>}</div></main>;
```

**السطر 33:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setError(...)`: لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `requestError.message`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 34:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 35:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 37:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 38:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 40:** Return / رجّع `<main className="wtc-orders-page"><style>{'.wtc-orders-page{min-height:100vh;padding:8rem 0 5rem;background:#111;color:#f5f5f5}.wtc-order-history{display:grid;gap:.8rem}.wtc-history-card{display:grid;grid-template-column…` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `orders.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(order) => <article className="wtc-history-card" key={order.id}><div><h2 className="h5">Order #{order.id} · <s…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `order.status.replaceAll(...)`: تستبدل كل التطابقات بنص جديد. القيم المكتوبة هنا: `'_'`، `' '`. العائد/الأثر: string جديدة؛ لا تعدّل الأصل.؛ `new Date(order.created_at).toLocaleString(...)`: تنسّق القيمة للعرض المحلي. مدخلاتها: locale وخيارات. العائد/الأثر: string.؛ `Date(...)`: مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي. القيم المكتوبة هنا: `order.created_at`. العائد/الأثر: Date object عند new؛ مش string تلقائيًا.؛ `Number(order.total_price).toFixed(...)`: تنسّق عددًا بمواضع عشرية محددة. القيم المكتوبة هنا: `2`. العائد/الأثر: string، مش رقمًا صالحًا للحساب بدون تحويل.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `order.total_price`. العائد/الأثر: number أو NaN.؛ `reorder(...)`: POST لطلب إعادة الطلب، يضبط mode والفرع ويحفظ cart_items ويصدر الحدث ثم يذهب /cart. الكود الحالي لا يفحص false العائد من setBranch؛ نقطة مراجعة مهمة قبل تحسينه. القيم المكتوبة هنا: `order`. العائد/الأثر: Promise<void>.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 41–42

```jsx
}

```

**السطر 41:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
