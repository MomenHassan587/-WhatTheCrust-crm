# تتبع الطلب بالـ token وتحديث كل 7 ثوانٍ

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `resources/js/Pages/OrderTracking.jsx` · 78 سطر.

**وظيفة الملف:** يقرأ token من route ويجلب الطلب ثم polling. يشتق الخطوات حسب delivery/pickup؛ يحوّل accepted بصريًا إلى preparing، ويعرض سبب الإغلاق بدل التايملاين للملغي والمرفوض.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../resources/js/Pages/OrderTracking.jsx). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/resources/js/lib/api.js](../lib/api.js.md)

- [pizza-crm/resources/js/app.jsx](../app.jsx.md)

- [pizza-crm/app/Http/Controllers/Api/OrderTrackingController.php](../../../app/Http/Controllers/Api/OrderTrackingController.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { csrfFetch } from '../lib/api';

const STATUS_LABELS = {
    payment_pending: 'Confirming payment',
    new: 'Received',
    accepted: 'Accepted',
    preparing: 'Preparing',
    ready: 'Ready',
    out_for_delivery: 'Out for delivery',
    picked_up: 'Picked up',
    completed: 'Completed',
    cancelled: 'Cancelled',
    rejected: 'Rejected',
};

function statusSteps(order) {
    return order.order_type === 'delivery'
        ? ['new', 'preparing', 'ready', 'out_for_delivery', 'completed']
        : ['new', 'preparing', 'ready', 'picked_up', 'completed'];
}

export default function OrderTracking() {
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

    const steps = useMemo(() => order ? statusSteps(order) : [], [order]);
    const visibleStatus = order?.status === 'accepted' ? 'preparing' : order?.status;
    const currentIndex = steps.indexOf(visibleStatus);
    const closed = ['cancelled', 'rejected'].includes(order?.status);

    if (loading) return <main className="wtc-tracking-page"><div className="container">Loading your order...</div></main>;
    if (error || !order) return <main className="wtc-tracking-page"><div className="container"><section className="wtc-track-empty"><p className="eyebrow">Order tracking</p><h1>We could not find that order.</h1><p>The tracking link may be incomplete or expired.</p><Link to="/menu" className="btn btn-red">Back to menu</Link></section></div></main>;

    return (
        <main className="wtc-tracking-page">
            <style>{`
                .wtc-tracking-page{min-height:100vh;padding:8rem 0 5rem;background:#111;color:#f5f5f5}.wtc-track-head{display:flex;align-items:end;justify-content:space-between;gap:1rem;margin-bottom:2rem}.wtc-track-head h1{font-size:clamp(2.2rem,5vw,4.8rem);font-weight:1000;letter-spacing:0}.wtc-live-dot{display:inline-flex;align-items:center;gap:.5rem;color:#aaa;font-size:.8rem}.wtc-live-dot::before{content:'';width:8px;height:8px;border-radius:50%;background:#54c77b;box-shadow:0 0 0 5px rgba(84,199,123,.12)}.wtc-track-grid{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(280px,.75fr);gap:1rem}.wtc-track-panel{border:1px solid #303030;border-radius:8px;padding:1.25rem;background:#1a1a1a}.wtc-timeline{display:grid;grid-template-columns:repeat(5,1fr);margin:2rem 0}.wtc-step{position:relative;text-align:center;color:#747474}.wtc-step::before{content:'';position:absolute;left:-50%;right:50%;top:13px;height:2px;background:#363636}.wtc-step:first-child::before{display:none}.wtc-step-dot{position:relative;z-index:1;display:grid;place-items:center;width:28px;height:28px;margin:0 auto .65rem;border:2px solid #474747;border-radius:50%;background:#1a1a1a;font-size:.7rem}.wtc-step.done,.wtc-step.current{color:#fff}.wtc-step.done::before,.wtc-step.current::before{background:#e32626}.wtc-step.done .wtc-step-dot,.wtc-step.current .wtc-step-dot{border-color:#e32626;background:#e32626}.wtc-step.current .wtc-step-dot{box-shadow:0 0 0 7px rgba(227,38,38,.14)}.wtc-track-items{display:grid;gap:.75rem}.wtc-track-item{display:flex;justify-content:space-between;gap:1rem;padding-bottom:.75rem;border-bottom:1px solid #303030}.wtc-track-note{display:block;color:#f1a83a;font-size:.82rem}.wtc-track-total{display:flex;justify-content:space-between;margin-top:1rem;font-size:1.2rem}.wtc-track-fact{padding:.8rem 0;border-bottom:1px solid #303030}.wtc-track-fact span{display:block;color:#888;font-size:.72rem;text-transform:uppercase}.wtc-track-closed{margin:1rem 0;padding:1rem;border-left:3px solid #e32626;background:rgba(227,38,38,.1);color:#ff9b9b}.wtc-track-empty{max-width:620px;margin:10vh auto;text-align:center}@media(max-width:767px){.wtc-track-grid{grid-template-columns:1fr}.wtc-track-head{align-items:start;flex-direction:column}.wtc-timeline{grid-template-columns:1fr;margin:1rem 0}.wtc-step{display:grid;grid-template-columns:32px 1fr;align-items:center;gap:.65rem;text-align:left;padding:.45rem 0}.wtc-step::before{left:13px;right:auto;top:-50%;bottom:50%;width:2px;height:auto}.wtc-step-dot{margin:0}.wtc-tracking-page{padding-top:6.5rem}}
            `}</style>
            <div className="container">
                <header className="wtc-track-head"><div><p className="eyebrow">Order confirmed</p><h1 className="mb-0">Order #{order.id}</h1></div><span className="wtc-live-dot">{updatedAt ? 'Updated ' + updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Connecting'}</span></header>
                <section className="wtc-track-panel mb-3" aria-label="Order progress">
                    <h2 className="h4">Current status: {STATUS_LABELS[order.status] || order.status}</h2>
                    {closed ? <div className="wtc-track-closed"><strong>{STATUS_LABELS[order.status]}</strong>{order.status_reason && <p className="mb-0 mt-1">{order.status_reason}</p>}</div> : <div className="wtc-timeline">{steps.map((step, index) => <div className={`wtc-step ${index < currentIndex ? 'done' : ''} ${index === currentIndex ? 'current' : ''}`} key={step}><motion.span className="wtc-step-dot" animate={index === currentIndex ? { scale: [1, 1.08, 1] } : {}} transition={{ repeat: Infinity, duration: 1.4 }}>{index < currentIndex ? '✓' : index + 1}</motion.span><strong>{STATUS_LABELS[step]}</strong></div>)}</div>}
                </section>
                <div className="wtc-track-grid">
                    <section className="wtc-track-panel"><h2 className="h4 mb-3">Your order</h2><div className="wtc-track-items">{order.items.map((item) => <div className="wtc-track-item" key={item.id}><div><strong>{item.quantity} × {item.item_name}</strong>{item.notes && <span className="wtc-track-note">Note: {item.notes}</span>}</div><span>EGP {(Number(item.price) * item.quantity).toFixed(2)}</span></div>)}</div><div className="wtc-track-total"><span>Total</span><strong>EGP {Number(order.total_price).toFixed(2)}</strong></div></section>
                    <aside className="wtc-track-panel"><h2 className="h4 mb-3">{order.order_type === 'delivery' ? 'Delivery' : 'Pickup'} details</h2><div className="wtc-track-fact"><span>Branch</span><strong>{order.branch?.name}</strong><p className="mb-0 text-secondary">{order.branch?.location}</p></div><div className="wtc-track-fact"><span>{order.order_type === 'delivery' ? 'Address' : 'Estimated arrival'}</span><strong>{order.order_type === 'delivery' ? order.delivery_address : new Date(order.pickup_time).toLocaleString()}</strong></div><div className="wtc-track-fact"><span>Payment</span><strong className="text-capitalize">{order.payment_status} · {order.payment_method}</strong></div></aside>
                </div>
            </div>
        </main>
    );
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### statusSteps

يبني ترتيب التقدم حسب طريقة الاستلام؛ مرحلة out_for_delivery أو picked_up هي الاختلاف.

- **بتاخد إيه؟ Inputs:** order.

- **بترجع/بتغيّر إيه؟ Return / effect:** array من status strings.

### OrderTracking

يجمع طلب التتبع وحالات loading/error وتفاصيل الفرع والدفع والمنتجات.

- **بتاخد إيه؟ Inputs:** token من useParams.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX.

### loadOrder

يجلب /api/orders/track/encoded-token ويحدّث order/error/updatedAt؛ finally ينهي loading.

- **بتاخد إيه؟ Inputs:** لا parameters؛ useCallback يعتمد على token.

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<void>؛ الخطأ يظهر في state.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### useParams

- **جاية منين؟** react-router-dom hook

- **وظيفتها:** يقرأ الأجزاء الديناميكية من Route؛ token من /orders/:token وsection من /admin/:section.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** object قيم parameters كنصوص عادة.

- **أول موضع هنا:** السطر 26.

- **مثال:** const { token } = useParams();

### useState

- **جاية منين؟** React

- **وظيفتها:** حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة.

- **المدخلات — Arguments:** initialState

- **الناتج/الأثر — Return / effect:** [currentState,setter]

- **أول موضع هنا:** السطر 30، والمدخلات المكتوبة: `null`.

- **مثال:** const [failed, setFailed] = useState(false);

### useCallback

- **جاية منين؟** React hook

- **وظيفتها:** يثبت هوية function بين renders ما دامت dependencies ثابتة؛ لا ينفذ الدالة ولا يحفظ نتيجة API. مهم لأن loadOrders dependency للـ polling effect.

- **المدخلات — Arguments:** function, dependencies.

- **الناتج/الأثر — Return / effect:** function memoized.

- **أول موضع هنا:** السطر 32، والمدخلات المكتوبة: `async () => {         try {             const response = await csrfFetch('/api/orders/track/' + encodeURIComponent(token));             setOrder(response.order);             setErr…`، `[token]`.

- **مثال:** const loadOrders = useCallback(async () => { /* actual request */ }, [user, branch, date]);

### csrfFetch

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح.

- **المدخلات — Arguments:** url: مسار API؛ options: method/body/headers وغيرها، الافتراضي {}.

- **الناتج/الأثر — Return / effect:** Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.

- **أول موضع هنا:** السطر 34، والمدخلات المكتوبة: `'/api/orders/track/' + encodeURIComponent(token)`.

- **تكملة التعريف:** [resources/js/lib/api.js](../lib/api.js.md)، عند السطر 3.

### encodeURIComponent

- **جاية منين؟** JavaScript global function

- **وظيفتها:** يهرب مكوّن واحد من URL علشان token ما يتفسرش كرموز فصل؛ مش تشفير أو صلاحيات.

- **المدخلات — Arguments:** value كنص.

- **الناتج/الأثر — Return / effect:** encoded string.

- **أول موضع هنا:** السطر 34، والمدخلات المكتوبة: `token`.

- **مثال:** '/api/orders/track/' + encodeURIComponent(token);

### setOrder

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setOrder هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 35، والمدخلات المكتوبة: `response.order`.

### setError

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 39، والمدخلات المكتوبة: `requestError.payload?.message || (requestError.message === 'Not Found' ? 'Order not found.' : requestError.message)`.

### setUpdatedAt

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setUpdatedAt هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 37، والمدخلات المكتوبة: `new Date()`.

### Date

- **جاية منين؟** JavaScript Date

- **وظيفتها:** مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي.

- **المدخلات — Arguments:** قيمة تاريخ اختيارية.

- **الناتج/الأثر — Return / effect:** Date object عند new؛ مش string تلقائيًا.

- **أول موضع هنا:** السطر 72، والمدخلات المكتوبة: `order.pickup_time`.

### setLoading

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setLoading هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 41، والمدخلات المكتوبة: `false`.

### useEffect

- **جاية منين؟** React

- **وظيفتها:** يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies.

- **المدخلات — Arguments:** setup callback, dependencies

- **الناتج/الأثر — Return / effect:** undefined

- **أول موضع هنا:** السطر 45، والمدخلات المكتوبة: `() => {         loadOrder();         const timer = window.setInterval(loadOrder, 7000);         return () => window.clearInterval(timer);     }`، `[loadOrder]`.

- **مثال:** useEffect(() => { window.addEventListener('resize', updateRunway); return () => window.removeEventListener('resize', updateRunway); }, []);

### loadOrder

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يجلب /api/orders/track/encoded-token ويحدّث order/error/updatedAt؛ finally ينهي loading.

- **المدخلات — Arguments:** لا parameters؛ useCallback يعتمد على token.

- **الناتج/الأثر — Return / effect:** Promise<void>؛ الخطأ يظهر في state.

- **أول موضع هنا:** السطر 46.

### window.setInterval

- **جاية منين؟** Browser

- **وظيفتها:** تسجّل نداءً متكررًا لدالة؛ أول مرة بعد الفاصل، مش فورًا.

- **المدخلات — Arguments:** callback وdelay بالمللي ثانية.

- **الناتج/الأثر — Return / effect:** رقم timer ID في المتصفح؛ التوقيت تقريبي.

- **أول موضع هنا:** السطر 47، والمدخلات المكتوبة: `loadOrder`، `7000`.

### window.clearInterval

- **جاية منين؟** Browser

- **وظيفتها:** تلغي النداءات القادمة لمؤقت تكرار محدد.

- **المدخلات — Arguments:** timer ID الراجع من setInterval.

- **الناتج/الأثر — Return / effect:** undefined؛ لا تلغي fetch بدأت بالفعل.

- **أول موضع هنا:** السطر 48، والمدخلات المكتوبة: `timer`.

### useMemo

- **جاية منين؟** React hook

- **وظيفتها:** يحفظ نتيجة حساب كتحسين أداء لحد تغير dependencies؛ callback للحساب مش مكان HTTP أو setState side effects.

- **المدخلات — Arguments:** calculate function,dependencies.

- **الناتج/الأثر — Return / effect:** القيمة المحسوبة.

- **أول موضع هنا:** السطر 51، والمدخلات المكتوبة: `() => order ? statusSteps(order) : []`، `[order]`.

- **مثال:** const completedOrders = useMemo(() => orders.filter((order) => order.status === 'completed'), [orders]);

### statusSteps

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يبني ترتيب التقدم حسب طريقة الاستلام؛ مرحلة out_for_delivery أو picked_up هي الاختلاف.

- **المدخلات — Arguments:** order.

- **الناتج/الأثر — Return / effect:** array من status strings.

- **أول موضع هنا:** السطر 51، والمدخلات المكتوبة: `order`.

### steps.indexOf

- **جاية منين؟** JavaScript Array.prototype

- **وظيفتها:** يرجع موضع قيمة محددة في ترتيب الخطوات.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** index أو -1.

- **أول موضع هنا:** السطر 53، والمدخلات المكتوبة: `visibleStatus`.

- **مثال:** const currentIndex = steps.indexOf(visibleStatus);

### ['cancelled', 'rejected'].includes

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تختبر وجود قيمة في array أو نص داخل string.

- **المدخلات — Arguments:** القيمة/النص المطلوب.

- **الناتج/الأثر — Return / effect:** Boolean؛ مش العنصر ولا موقعه.

- **أول موضع هنا:** السطر 54، والمدخلات المكتوبة: `order?.status`.

### updatedAt.toLocaleTimeString

- **جاية منين؟** Date instance

- **وظيفتها:** تنسّق الوقت للعرض المحلي.

- **المدخلات — Arguments:** locale وخيارات.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 65، والمدخلات المكتوبة: `[]`، `{ hour: '2-digit', minute: '2-digit' }`.

### steps.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 68، والمدخلات المكتوبة: `(step, index) => <div className={'wtc-step ${index < currentIndex ? 'done' : ''} ${index === currentIndex ? 'current' : ''}'} key={step}><motion.span className="wtc-step-dot" anima…`.

### order.items.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 71، والمدخلات المكتوبة: `(item) => <div className="wtc-track-item" key={item.id}><div><strong>{item.quantity} × {item.item_name}</strong>{item.notes && <span className="wtc-track-note">Note: {item.notes}</…`.

### (Number(item.price) * item.quantity).toFixed

- **جاية منين؟** Number / JavaScript

- **وظيفتها:** تنسّق عددًا بمواضع عشرية محددة.

- **المدخلات — Arguments:** عدد الخانات.

- **الناتج/الأثر — Return / effect:** string، مش رقمًا صالحًا للحساب بدون تحويل.

- **أول موضع هنا:** السطر 71، والمدخلات المكتوبة: `2`.

### Number

- **جاية منين؟** JavaScript conversion function

- **وظيفتها:** يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** number أو NaN.

- **أول موضع هنا:** السطر 71، والمدخلات المكتوبة: `order.total_price`.

- **مثال:** Number(option.price);

### Number(order.total_price).toFixed

- **جاية منين؟** Number / JavaScript

- **وظيفتها:** تنسّق عددًا بمواضع عشرية محددة.

- **المدخلات — Arguments:** عدد الخانات.

- **الناتج/الأثر — Return / effect:** string، مش رقمًا صالحًا للحساب بدون تحويل.

- **أول موضع هنا:** السطر 71، والمدخلات المكتوبة: `2`.

### new Date(order.pickup_time).toLocaleString

- **جاية منين؟** Date/Number instance

- **وظيفتها:** تنسّق القيمة للعرض المحلي.

- **المدخلات — Arguments:** locale وخيارات.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 72.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { csrfFetch } from '../lib/api';

const STATUS_LABELS = {
    payment_pending: 'Confirming payment',
    new: 'Received',
```

**السطر 1:** Import / استيراد: الأسماء `React`، `useCallback`، `useEffect`، `useMemo`، `useState` جاية من `react`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 2:** Import / استيراد: الأسماء `motion` جاية من `framer-motion`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 3:** Import / استيراد: الأسماء `Link`، `useParams` جاية من `react-router-dom`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 4:** Import / استيراد: الأسماء `csrfFetch` جاية من `../lib/api`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 6:** Variable declaration / تعريف `STATUS_LABELS` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة Object حقولها `payment_pending`، `new`، `accepted`، `preparing`، `ready`، `out_for_delivery`، `picked_up`، `completed`، `cancelled`، `rejected`.

**السطر 7:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 8:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 9–16

```jsx
    accepted: 'Accepted',
    preparing: 'Preparing',
    ready: 'Ready',
    out_for_delivery: 'Out for delivery',
    picked_up: 'Picked up',
    completed: 'Completed',
    cancelled: 'Cancelled',
    rejected: 'Rejected',
```

**السطر 9:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 10:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 11:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 12:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 13:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 14:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 15:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 16:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 17–24

```jsx
};

function statusSteps(order) {
    return order.order_type === 'delivery'
        ? ['new', 'preparing', 'ready', 'out_for_delivery', 'completed']
        : ['new', 'preparing', 'ready', 'picked_up', 'completed'];
}

```

**السطر 17:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 19:** Function / تعريف دالة `statusSteps`؛ تعريفها مش تشغيلها. يبني ترتيب التقدم حسب طريقة الاستلام؛ مرحلة out_for_delivery أو picked_up هي الاختلاف. مدخلاتها: order. ناتجها: array من status strings.

**السطر 20:** Return / رجّع `order.order_type === 'delivery'` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 21:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 22:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 23:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 25–32

```jsx
export default function OrderTracking() {
    const { token } = useParams();
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [updatedAt, setUpdatedAt] = useState(null);

    const loadOrder = useCallback(async () => {
```

**السطر 25:** Function / تعريف دالة `OrderTracking`؛ تعريفها مش تشغيلها. يجمع طلب التتبع وحالات loading/error وتفاصيل الفرع والدفع والمنتجات. مدخلاتها: token من useParams. ناتجها: JSX.

**السطر 26:** Variable declaration / تعريف اسم/أسماء لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useParams(...)`: يقرأ الأجزاء الديناميكية من Route؛ token من /orders/:token وsection من /admin/:section. مدخلاتها: لا شيء. العائد/الأثر: object قيم parameters كنصوص عادة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 27:** Variable declaration / تعريف `order + setOrder` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `null`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 28:** Variable declaration / تعريف `error + setError` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `''`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 29:** Variable declaration / تعريف `loading + setLoading` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `true`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 30:** Variable declaration / تعريف `updatedAt + setUpdatedAt` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `null`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 32:** Variable declaration / تعريف `loadOrder` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `loadOrder` هنا: يجلب /api/orders/track/encoded-token ويحدّث order/error/updatedAt؛ finally ينهي loading. المدخلات: لا parameters؛ useCallback يعتمد على token.. الناتج/الأثر: Promise<void>؛ الخطأ يظهر في state.. الدوال الموجودة في السطر: `useCallback(...)`: يثبت هوية function بين renders ما دامت dependencies ثابتة؛ لا ينفذ الدالة ولا يحفظ نتيجة API. مهم لأن loadOrders dependency للـ polling effect. القيم المكتوبة هنا: `async () => {         try {             const response = await csrfFetch('/api/orders/track/' + encodeURICompo…`، `[token]`. العائد/الأثر: function memoized.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 33–40

```jsx
        try {
            const response = await csrfFetch('/api/orders/track/' + encodeURIComponent(token));
            setOrder(response.order);
            setError('');
            setUpdatedAt(new Date());
        } catch (requestError) {
            setError(requestError.payload?.message || (requestError.message === 'Not Found' ? 'Order not found.' : requestError.message));
        } finally {
```

**السطر 33:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة.

**السطر 34:** Variable declaration / تعريف `response` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `csrfFetch(...)`: توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح. القيم المكتوبة هنا: `'/api/orders/track/' + encodeURIComponent(token)`. العائد/الأثر: Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.؛ `encodeURIComponent(...)`: يهرب مكوّن واحد من URL علشان token ما يتفسرش كرموز فصل؛ مش تشفير أو صلاحيات. القيم المكتوبة هنا: `token`. العائد/الأثر: encoded string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 35:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setOrder(...)`: لو setOrder هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `response.order`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 36:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setError(...)`: لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `''`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 37:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setUpdatedAt(...)`: لو setUpdatedAt هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `new Date()`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `Date(...)`: مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي. مدخلاتها: قيمة تاريخ اختيارية. العائد/الأثر: Date object عند new؛ مش string تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 38:** Catch: استقبل الخطأ من try/Promise حسب السياق وتعامل مع رسالته؛ catch لا تعني نجاح الطلب الأصلي.

**السطر 39:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setError(...)`: لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `requestError.payload?.message || (requestError.message === 'Not Found' ? 'Order not found.' : requestError.mes…`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 40:** Finally: تنظيف/إرجاع حالة الانشغال بعد try سواء نجحت أو فشلت.

### السطور 41–48

```jsx
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        loadOrder();
        const timer = window.setInterval(loadOrder, 7000);
        return () => window.clearInterval(timer);
```

**السطر 41:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setLoading(...)`: لو setLoading هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `false`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 42:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 43:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 45:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `() => {         loadOrder();         const timer = window.setInterval(loadOrder, 7000);         return () => w…`، `[loadOrder]`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 46:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `loadOrder(...)`: يجلب /api/orders/track/encoded-token ويحدّث order/error/updatedAt؛ finally ينهي loading. مدخلاتها: لا parameters؛ useCallback يعتمد على token. العائد/الأثر: Promise<void>؛ الخطأ يظهر في state.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 47:** Variable declaration / تعريف `timer` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `window.setInterval(...)`: تسجّل نداءً متكررًا لدالة؛ أول مرة بعد الفاصل، مش فورًا. القيم المكتوبة هنا: `loadOrder`، `7000`. العائد/الأثر: رقم timer ID في المتصفح؛ التوقيت تقريبي.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 48:** Return / رجّع `() => window.clearInterval(timer)` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `window.clearInterval(...)`: تلغي النداءات القادمة لمؤقت تكرار محدد. القيم المكتوبة هنا: `timer`. العائد/الأثر: undefined؛ لا تلغي fetch بدأت بالفعل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 49–56

```jsx
    }, [loadOrder]);

    const steps = useMemo(() => order ? statusSteps(order) : [], [order]);
    const visibleStatus = order?.status === 'accepted' ? 'preparing' : order?.status;
    const currentIndex = steps.indexOf(visibleStatus);
    const closed = ['cancelled', 'rejected'].includes(order?.status);

    if (loading) return <main className="wtc-tracking-page"><div className="container">Loading your order...</div></main>;
```

**السطر 49:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 51:** Variable declaration / تعريف `steps` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useMemo(...)`: يحفظ نتيجة حساب كتحسين أداء لحد تغير dependencies؛ callback للحساب مش مكان HTTP أو setState side effects. القيم المكتوبة هنا: `() => order ? statusSteps(order) : []`، `[order]`. العائد/الأثر: القيمة المحسوبة.؛ `statusSteps(...)`: يبني ترتيب التقدم حسب طريقة الاستلام؛ مرحلة out_for_delivery أو picked_up هي الاختلاف. القيم المكتوبة هنا: `order`. العائد/الأثر: array من status strings.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 52:** Variable declaration / تعريف `visibleStatus` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 53:** Variable declaration / تعريف `currentIndex` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `steps.indexOf(...)`: يرجع موضع قيمة محددة في ترتيب الخطوات. القيم المكتوبة هنا: `visibleStatus`. العائد/الأثر: index أو -1.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 54:** Variable declaration / تعريف `closed` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `['cancelled', 'rejected'].includes(...)`: تختبر وجود قيمة في array أو نص داخل string. القيم المكتوبة هنا: `order?.status`. العائد/الأثر: Boolean؛ مش العنصر ولا موقعه.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 56:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

### السطور 57–64

```jsx
    if (error || !order) return <main className="wtc-tracking-page"><div className="container"><section className="wtc-track-empty"><p className="eyebrow">Order tracking</p><h1>We could not find that order.</h1><p>The tracking link may be incomplete or expired.</p><Link to="/menu" className="btn btn-red">Back to menu</Link></section></div></main>;

    return (
        <main className="wtc-tracking-page">
            <style>{`
                .wtc-tracking-page{min-height:100vh;padding:8rem 0 5rem;background:#111;color:#f5f5f5}.wtc-track-head{display:flex;align-items:end;justify-content:space-between;gap:1rem;margin-bottom:2rem}.wtc-track-head h1{font-size:clamp(2.2rem,5vw,4.8rem);font-weight:1000;letter-spacing:0}.wtc-live-dot{display:inline-flex;align-items:center;gap:.5rem;color:#aaa;font-size:.8rem}.wtc-live-dot::before{content:'';width:8px;height:8px;border-radius:50%;background:#54c77b;box-shadow:0 0 0 5px rgba(84,199,123,.12)}.wtc-track-grid{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(280px,.75fr);gap:1rem}.wtc-track-panel{border:1px solid #303030;border-radius:8px;padding:1.25rem;background:#1a1a1a}.wtc-timeline{display:grid;grid-template-columns:repeat(5,1fr);margin:2rem 0}.wtc-step{position:relative;text-align:center;color:#747474}.wtc-step::before{content:'';position:absolute;left:-50%;right:50%;top:13px;height:2px;background:#363636}.wtc-step:first-child::before{display:none}.wtc-step-dot{position:relative;z-index:1;display:grid;place-items:center;width:28px;height:28px;margin:0 auto .65rem;border:2px solid #474747;border-radius:50%;background:#1a1a1a;font-size:.7rem}.wtc-step.done,.wtc-step.current{color:#fff}.wtc-step.done::before,.wtc-step.current::before{background:#e32626}.wtc-step.done .wtc-step-dot,.wtc-step.current .wtc-step-dot{border-color:#e32626;background:#e32626}.wtc-step.current .wtc-step-dot{box-shadow:0 0 0 7px rgba(227,38,38,.14)}.wtc-track-items{display:grid;gap:.75rem}.wtc-track-item{display:flex;justify-content:space-between;gap:1rem;padding-bottom:.75rem;border-bottom:1px solid #303030}.wtc-track-note{display:block;color:#f1a83a;font-size:.82rem}.wtc-track-total{display:flex;justify-content:space-between;margin-top:1rem;font-size:1.2rem}.wtc-track-fact{padding:.8rem 0;border-bottom:1px solid #303030}.wtc-track-fact span{display:block;color:#888;font-size:.72rem;text-transform:uppercase}.wtc-track-closed{margin:1rem 0;padding:1rem;border-left:3px solid #e32626;background:rgba(227,38,38,.1);color:#ff9b9b}.wtc-track-empty{max-width:620px;margin:10vh auto;text-align:center}@media(max-width:767px){.wtc-track-grid{grid-template-columns:1fr}.wtc-track-head{align-items:start;flex-direction:column}.wtc-timeline{grid-template-columns:1fr;margin:1rem 0}.wtc-step{display:grid;grid-template-columns:32px 1fr;align-items:center;gap:.65rem;text-align:left;padding:.45rem 0}.wtc-step::before{left:13px;right:auto;top:-50%;bottom:50%;width:2px;height:auto}.wtc-step-dot{margin:0}.wtc-tracking-page{padding-top:6.5rem}}
            `}</style>
            <div className="container">
```

**السطر 57:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 59:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 60:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 61:** بداية CSS / تنسيق؛ لو scoped فـVue تضيف عزلًا بالـattributes أثناء البناء.

**السطر 62:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 63:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 64:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 65–72

```jsx
                <header className="wtc-track-head"><div><p className="eyebrow">Order confirmed</p><h1 className="mb-0">Order #{order.id}</h1></div><span className="wtc-live-dot">{updatedAt ? 'Updated ' + updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Connecting'}</span></header>
                <section className="wtc-track-panel mb-3" aria-label="Order progress">
                    <h2 className="h4">Current status: {STATUS_LABELS[order.status] || order.status}</h2>
                    {closed ? <div className="wtc-track-closed"><strong>{STATUS_LABELS[order.status]}</strong>{order.status_reason && <p className="mb-0 mt-1">{order.status_reason}</p>}</div> : <div className="wtc-timeline">{steps.map((step, index) => <div className={`wtc-step ${index < currentIndex ? 'done' : ''} ${index === currentIndex ? 'current' : ''}`} key={step}><motion.span className="wtc-step-dot" animate={index === currentIndex ? { scale: [1, 1.08, 1] } : {}} transition={{ repeat: Infinity, duration: 1.4 }}>{index < currentIndex ? '✓' : index + 1}</motion.span><strong>{STATUS_LABELS[step]}</strong></div>)}</div>}
                </section>
                <div className="wtc-track-grid">
                    <section className="wtc-track-panel"><h2 className="h4 mb-3">Your order</h2><div className="wtc-track-items">{order.items.map((item) => <div className="wtc-track-item" key={item.id}><div><strong>{item.quantity} × {item.item_name}</strong>{item.notes && <span className="wtc-track-note">Note: {item.notes}</span>}</div><span>EGP {(Number(item.price) * item.quantity).toFixed(2)}</span></div>)}</div><div className="wtc-track-total"><span>Total</span><strong>EGP {Number(order.total_price).toFixed(2)}</strong></div></section>
                    <aside className="wtc-track-panel"><h2 className="h4 mb-3">{order.order_type === 'delivery' ? 'Delivery' : 'Pickup'} details</h2><div className="wtc-track-fact"><span>Branch</span><strong>{order.branch?.name}</strong><p className="mb-0 text-secondary">{order.branch?.location}</p></div><div className="wtc-track-fact"><span>{order.order_type === 'delivery' ? 'Address' : 'Estimated arrival'}</span><strong>{order.order_type === 'delivery' ? order.delivery_address : new Date(order.pickup_time).toLocaleString()}</strong></div><div className="wtc-track-fact"><span>Payment</span><strong className="text-capitalize">{order.payment_status} · {order.payment_method}</strong></div></aside>
```

**السطر 65:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض. الدوال الموجودة في السطر: `updatedAt.toLocaleTimeString(...)`: تنسّق الوقت للعرض المحلي. القيم المكتوبة هنا: `[]`، `{ hour: '2-digit', minute: '2-digit' }`. العائد/الأثر: string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 66:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 67:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 68:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `steps.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(step, index) => <div className={'wtc-step ${index < currentIndex ? 'done' : ''} ${index === currentIndex ? 'c…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 69:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 70:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 71:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض. الدوال الموجودة في السطر: `order.items.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(item) => <div className="wtc-track-item" key={item.id}><div><strong>{item.quantity} × {item.item_name}</stron…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `(Number(item.price) * item.quantity).toFixed(...)`: تنسّق عددًا بمواضع عشرية محددة. القيم المكتوبة هنا: `2`. العائد/الأثر: string، مش رقمًا صالحًا للحساب بدون تحويل.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `order.total_price`. العائد/الأثر: number أو NaN.؛ `Number(order.total_price).toFixed(...)`: تنسّق عددًا بمواضع عشرية محددة. القيم المكتوبة هنا: `2`. العائد/الأثر: string، مش رقمًا صالحًا للحساب بدون تحويل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 72:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض. الدوال الموجودة في السطر: `new Date(order.pickup_time).toLocaleString(...)`: تنسّق القيمة للعرض المحلي. مدخلاتها: locale وخيارات. العائد/الأثر: string.؛ `Date(...)`: مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي. القيم المكتوبة هنا: `order.pickup_time`. العائد/الأثر: Date object عند new؛ مش string تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 73–78

```jsx
                </div>
            </div>
        </main>
    );
}

```

**السطر 73:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 74:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 75:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 76:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 77:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
