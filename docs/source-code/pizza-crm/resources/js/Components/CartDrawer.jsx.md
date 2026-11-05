# Cart Drawer قديم: موجود لكن مش مسار السلة الحالي

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `resources/js/Components/CartDrawer.jsx` · 150 سطر.

**وظيفة الملف:** Offcanvas بيستقبل السلة ودوال تعديلها كـ props؛ app.jsx الحالي بيستخدم Pages/Cart.jsx ومفيش import لـ CartDrawer. الكود يسمح dine_in لكن الطلب الحالي delivery/pickup؛ ما تعتبرهوش أحدث checkout.

**نوعه:** legacy. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../resources/js/Components/CartDrawer.jsx). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/resources/js/lib/api.js](../lib/api.js.md)

- [pizza-crm/resources/js/Pages/Cart.jsx](../Pages/Cart.jsx.md)

- [pizza-crm/app/Http/Controllers/Api/OrderController.php](../../../app/Http/Controllers/Api/OrderController.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```jsx
// resources/js/Components/CartDrawer.jsx

import React, { useMemo, useState } from 'react';
import { Button, Form, Offcanvas } from 'react-bootstrap';
import { csrfFetch } from '../lib/api';

const fulfillmentOptions = [
    { label: 'Delivery', value: 'delivery' },
    { label: 'Pickup (Near Restaurant)', value: 'pickup' },
    { label: 'Dine-In', value: 'dine_in' },
];

export default function CartDrawer({
    show,
    onHide,
    branch,
    cartItems,
    onIncrease,
    onDecrease,
    onRemove,
    onClear,
}) {
    const [orderType, setOrderType] = useState('delivery');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const total = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [cartItems]);

    const submitOrder = async () => {
        setMessage('');

        if (!branch) {
            setMessage('Select a branch before checkout.');
            return;
        }

        if (cartItems.length === 0) {
            setMessage('Your cart is empty.');
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                branch_id: branch.id,
                order_type: orderType,
                items: cartItems.map((item) => ({
                    menu_item_id: item.id,
                    quantity: item.quantity,
                })),
            };

            const response = await csrfFetch('/api/orders', {
                method: 'POST',
                body: JSON.stringify(payload),
            });

            setMessage(`Order #${response.order.id} created successfully.`);
            onClear();
        } catch (error) {
            setMessage(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Offcanvas show={show} onHide={onHide} placement="end" className="cart-drawer">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Your Cart</Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
                <div className="cart-branch">
                    <span>Selected Branch</span>
                    <strong>{branch ? branch.name : 'No branch selected'}</strong>
                </div>

                {cartItems.length === 0 ? (
                    <div className="cart-empty">
                        <h4>Your cart is empty.</h4>
                        <p>Add a pizza and let the cheese prophecy begin.</p>
                    </div>
                ) : (
                    <div className="cart-lines">
                        {cartItems.map((item) => (
                            <div className="cart-line" key={item.id}>
                                <div>
                                    <strong>{item.name}</strong>
                                    <span>EGP {item.price} each</span>
                                </div>

                                <div className="cart-controls">
                                    <button type="button" onClick={() => onDecrease(item.id)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button type="button" onClick={() => onIncrease(item.id)}>+</button>
                                </div>

                                <button
                                    type="button"
                                    className="remove-line"
                                    onClick={() => onRemove(item.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="checkout-panel">
                    <h5>Choose fulfillment</h5>

                    {fulfillmentOptions.map((option) => (
                        <Form.Check
                            key={option.value}
                            type="radio"
                            id={`fulfillment-${option.value}`}
                            label={option.label}
                            name="fulfillment"
                            value={option.value}
                            checked={orderType === option.value}
                            onChange={(event) => setOrderType(event.target.value)}
                            className="checkout-radio"
                        />
                    ))}

                    <div className="cart-total">
                        <span>Total</span>
                        <strong>EGP {total.toFixed(2)}</strong>
                    </div>

                    {message && <div className="cart-message">{message}</div>}

                    <Button
                        type="button"
                        className="btn-red w-100"
                        disabled={isSubmitting || cartItems.length === 0}
                        onClick={submitOrder}
                    >
                        {isSubmitting ? 'Sending Order...' : 'Checkout'}
                    </Button>
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### CartDrawer

يعرض سلة جانبية وradio fulfillment وcheckout قديم.

- **بتاخد إيه؟ Inputs:** show/onHide/branch/cartItems/onIncrease/onDecrease/onRemove/onClear.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX Offcanvas.

### submitOrder

يفحص الفرع والسلة، يبني payload قديم ثم POST /api/orders ويفرغ السلة عند نجاحه؛ قد لا يلبّي التحقق الحالي بسبب غياب customer fields.

- **بتاخد إيه؟ Inputs:** لا شيء؛ يقرأ props/state.

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<void>.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### useState

- **جاية منين؟** React

- **وظيفتها:** حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة.

- **المدخلات — Arguments:** initialState

- **الناتج/الأثر — Return / effect:** [currentState,setter]

- **أول موضع هنا:** السطر 25، والمدخلات المكتوبة: `''`.

- **مثال:** const [failed, setFailed] = useState(false);

### useMemo

- **جاية منين؟** React hook

- **وظيفتها:** يحفظ نتيجة حساب كتحسين أداء لحد تغير dependencies؛ callback للحساب مش مكان HTTP أو setState side effects.

- **المدخلات — Arguments:** calculate function,dependencies.

- **الناتج/الأثر — Return / effect:** القيمة المحسوبة.

- **أول موضع هنا:** السطر 27، والمدخلات المكتوبة: `() => {         return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);     }`، `[cartItems]`.

- **مثال:** const completedOrders = useMemo(() => orders.filter((order) => order.status === 'completed'), [orders]);

### cartItems.reduce

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تجمع عناصر في نتيجة متراكمة.

- **المدخلات — Arguments:** callback(accumulator, item) وقيمة بداية اختيارية.

- **الناتج/الأثر — Return / effect:** الناتج النهائي؛ سلة فاضية مع البداية0 ترجع0.

- **أول موضع هنا:** السطر 28، والمدخلات المكتوبة: `(sum, item) => sum + item.price * item.quantity`، `0`.

### setMessage

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setMessage هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 64، والمدخلات المكتوبة: `error.message`.

### setIsSubmitting

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setIsSubmitting هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 66، والمدخلات المكتوبة: `false`.

### cartItems.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 89، والمدخلات المكتوبة: `(item) => (                             <div className="cart-line" key={item.id}>                                 <div>                                     <strong>{item.name}</str…`.

### csrfFetch

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح.

- **المدخلات — Arguments:** url: مسار API؛ options: method/body/headers وغيرها، الافتراضي {}.

- **الناتج/الأثر — Return / effect:** Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.

- **أول موضع هنا:** السطر 56، والمدخلات المكتوبة: `'/api/orders'`، `{                 method: 'POST',                 body: JSON.stringify(payload),             }`.

- **تكملة التعريف:** [resources/js/lib/api.js](../lib/api.js.md)، عند السطر 3.

### JSON.stringify

- **جاية منين؟** JavaScript

- **وظيفتها:** يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions.

- **المدخلات — Arguments:** value

- **الناتج/الأثر — Return / effect:** string أو undefined لبعض القيم

- **أول موضع هنا:** السطر 58، والمدخلات المكتوبة: `payload`.

- **مثال:** localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

### onClear

- **جاية منين؟** Callback/دالة مأخوذة من props أو Context حسب تعريف المكوّن

- **وظيفتها:** تنادي العملية اللي الأب أو الـContext مرّرها باسم onClear؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي.

- **المدخلات — Arguments:** بدون arguments مباشرة هنا.

- **الناتج/الأثر — Return / effect:** العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.

- **أول موضع هنا:** السطر 62.

### onDecrease

- **جاية منين؟** Callback/دالة مأخوذة من props أو Context حسب تعريف المكوّن

- **وظيفتها:** تنادي العملية اللي الأب أو الـContext مرّرها باسم onDecrease؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي.

- **المدخلات — Arguments:** item.id

- **الناتج/الأثر — Return / effect:** العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.

- **أول موضع هنا:** السطر 97، والمدخلات المكتوبة: `item.id`.

### onIncrease

- **جاية منين؟** Callback/دالة مأخوذة من props أو Context حسب تعريف المكوّن

- **وظيفتها:** تنادي العملية اللي الأب أو الـContext مرّرها باسم onIncrease؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي.

- **المدخلات — Arguments:** item.id

- **الناتج/الأثر — Return / effect:** العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.

- **أول موضع هنا:** السطر 99، والمدخلات المكتوبة: `item.id`.

### onRemove

- **جاية منين؟** Callback/دالة مأخوذة من props أو Context حسب تعريف المكوّن

- **وظيفتها:** تنادي العملية اللي الأب أو الـContext مرّرها باسم onRemove؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي.

- **المدخلات — Arguments:** item.id

- **الناتج/الأثر — Return / effect:** العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.

- **أول موضع هنا:** السطر 105، والمدخلات المكتوبة: `item.id`.

### fulfillmentOptions.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 117، والمدخلات المكتوبة: `(option) => (                         <Form.Check                             key={option.value}                             type="radio"                             id={'fulfillme…`.

### setOrderType

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setOrderType هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 126، والمدخلات المكتوبة: `event.target.value`.

### total.toFixed

- **جاية منين؟** Number / JavaScript

- **وظيفتها:** تنسّق عددًا بمواضع عشرية محددة.

- **المدخلات — Arguments:** عدد الخانات.

- **الناتج/الأثر — Return / effect:** string، مش رقمًا صالحًا للحساب بدون تحويل.

- **أول موضع هنا:** السطر 133، والمدخلات المكتوبة: `2`.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```jsx
// resources/js/Components/CartDrawer.jsx

import React, { useMemo, useState } from 'react';
import { Button, Form, Offcanvas } from 'react-bootstrap';
import { csrfFetch } from '../lib/api';

const fulfillmentOptions = [
    { label: 'Delivery', value: 'delivery' },
```

**السطر 1:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 3:** Import / استيراد: الأسماء `React`، `useMemo`، `useState` جاية من `react`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 4:** Import / استيراد: الأسماء `Button`، `Form`، `Offcanvas` جاية من `react-bootstrap`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 5:** Import / استيراد: الأسماء `csrfFetch` جاية من `../lib/api`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 7:** Variable declaration / تعريف `fulfillmentOptions` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة الابتدائية Array فيها 3 عنصرًا؛ العناصر نفسها في السطور التالية.

**السطر 8:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 9–16

```jsx
    { label: 'Pickup (Near Restaurant)', value: 'pickup' },
    { label: 'Dine-In', value: 'dine_in' },
];

export default function CartDrawer({
    show,
    onHide,
    branch,
```

**السطر 9:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 10:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 11:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 13:** Function / تعريف دالة `CartDrawer`؛ تعريفها مش تشغيلها. يعرض سلة جانبية وradio fulfillment وcheckout قديم. مدخلاتها: show/onHide/branch/cartItems/onIncrease/onDecrease/onRemove/onClear. ناتجها: JSX Offcanvas.

**السطر 14:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 15:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 16:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 17–24

```jsx
    cartItems,
    onIncrease,
    onDecrease,
    onRemove,
    onClear,
}) {
    const [orderType, setOrderType] = useState('delivery');
    const [isSubmitting, setIsSubmitting] = useState(false);
```

**السطر 17:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 18:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 19:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 20:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 21:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 22:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 23:** Variable declaration / تعريف `orderType + setOrderType` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `'delivery'`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 24:** Variable declaration / تعريف `isSubmitting + setIsSubmitting` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `false`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 25–32

```jsx
    const [message, setMessage] = useState('');

    const total = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }, [cartItems]);

    const submitOrder = async () => {
        setMessage('');
```

**السطر 25:** Variable declaration / تعريف `message + setMessage` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `''`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 27:** Variable declaration / تعريف `total` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useMemo(...)`: يحفظ نتيجة حساب كتحسين أداء لحد تغير dependencies؛ callback للحساب مش مكان HTTP أو setState side effects. القيم المكتوبة هنا: `() => {         return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);     }`، `[cartItems]`. العائد/الأثر: القيمة المحسوبة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 28:** Return / رجّع `cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `cartItems.reduce(...)`: تجمع عناصر في نتيجة متراكمة. القيم المكتوبة هنا: `(sum, item) => sum + item.price * item.quantity`، `0`. العائد/الأثر: الناتج النهائي؛ سلة فاضية مع البداية0 ترجع0.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 29:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 31:** Variable declaration / تعريف `submitOrder` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `submitOrder` هنا: يفحص الفرع والسلة، يبني payload قديم ثم POST /api/orders ويفرغ السلة عند نجاحه؛ قد لا يلبّي التحقق الحالي بسبب غياب customer fields. المدخلات: لا شيء؛ يقرأ props/state.. الناتج/الأثر: Promise<void>..

**السطر 32:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setMessage(...)`: لو setMessage هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `''`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 33–40

```jsx

        if (!branch) {
            setMessage('Select a branch before checkout.');
            return;
        }

        if (cartItems.length === 0) {
            setMessage('Your cart is empty.');
```

**السطر 34:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 35:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setMessage(...)`: لو setMessage هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `'Select a branch before checkout.'`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 36:** Return / رجّع `` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 37:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 39:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 40:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setMessage(...)`: لو setMessage هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `'Your cart is empty.'`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 41–48

```jsx
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = {
                branch_id: branch.id,
```

**السطر 41:** Return / رجّع `` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 42:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 44:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setIsSubmitting(...)`: لو setIsSubmitting هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `true`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 46:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة.

**السطر 47:** Variable declaration / تعريف `payload` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة Object حقولها `branch_id`، `order_type`، `items`.

**السطر 48:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 49–56

```jsx
                order_type: orderType,
                items: cartItems.map((item) => ({
                    menu_item_id: item.id,
                    quantity: item.quantity,
                })),
            };

            const response = await csrfFetch('/api/orders', {
```

**السطر 49:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 50:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `cartItems.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(item) => ({                     menu_item_id: item.id,                     quantity: item.quantity,          …`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 51:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 52:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 53:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 54:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 56:** Variable declaration / تعريف `response` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `csrfFetch(...)`: توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح. القيم المكتوبة هنا: `'/api/orders'`، `{                 method: 'POST',                 body: JSON.stringify(payload),             }`. العائد/الأثر: Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 57–64

```jsx
                method: 'POST',
                body: JSON.stringify(payload),
            });

            setMessage(`Order #${response.order.id} created successfully.`);
            onClear();
        } catch (error) {
            setMessage(error.message);
```

**السطر 57:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 58:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `payload`. العائد/الأثر: string أو undefined لبعض القيم. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 59:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 61:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setMessage(...)`: لو setMessage هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `'Order #${response.order.id} created successfully.'`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 62:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `onClear(...)`: تنادي العملية اللي الأب أو الـContext مرّرها باسم onClear؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي. مدخلاتها: بدون arguments مباشرة هنا. العائد/الأثر: العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 63:** Catch: استقبل الخطأ من try/Promise حسب السياق وتعامل مع رسالته؛ catch لا تعني نجاح الطلب الأصلي.

**السطر 64:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setMessage(...)`: لو setMessage هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `error.message`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 65–72

```jsx
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Offcanvas show={show} onHide={onHide} placement="end" className="cart-drawer">
            <Offcanvas.Header closeButton>
```

**السطر 65:** Finally: تنظيف/إرجاع حالة الانشغال بعد try سواء نجحت أو فشلت.

**السطر 66:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setIsSubmitting(...)`: لو setIsSubmitting هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `false`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 67:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 68:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 70:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 71:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها.

**السطر 72:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 73–80

```jsx
                <Offcanvas.Title>Your Cart</Offcanvas.Title>
            </Offcanvas.Header>

            <Offcanvas.Body>
                <div className="cart-branch">
                    <span>Selected Branch</span>
                    <strong>{branch ? branch.name : 'No branch selected'}</strong>
                </div>
```

**السطر 73:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 74:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 76:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 77:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 78:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 79:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 80:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 81–88

```jsx

                {cartItems.length === 0 ? (
                    <div className="cart-empty">
                        <h4>Your cart is empty.</h4>
                        <p>Add a pizza and let the cheese prophecy begin.</p>
                    </div>
                ) : (
                    <div className="cart-lines">
```

**السطر 82:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 83:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 84:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 85:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 86:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 87:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 88:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 89–96

```jsx
                        {cartItems.map((item) => (
                            <div className="cart-line" key={item.id}>
                                <div>
                                    <strong>{item.name}</strong>
                                    <span>EGP {item.price} each</span>
                                </div>

                                <div className="cart-controls">
```

**السطر 89:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `cartItems.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(item) => (                             <div className="cart-line" key={item.id}>                             …`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 90:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 91:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 92:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 93:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 94:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 96:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 97–104

```jsx
                                    <button type="button" onClick={() => onDecrease(item.id)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button type="button" onClick={() => onIncrease(item.id)}>+</button>
                                </div>

                                <button
                                    type="button"
                                    className="remove-line"
```

**السطر 97:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `onDecrease(...)`: تنادي العملية اللي الأب أو الـContext مرّرها باسم onDecrease؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي. القيم المكتوبة هنا: `item.id`. العائد/الأثر: العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 98:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 99:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `onIncrease(...)`: تنادي العملية اللي الأب أو الـContext مرّرها باسم onIncrease؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي. القيم المكتوبة هنا: `item.id`. العائد/الأثر: العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 100:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 102:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 103:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 104:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

### السطور 105–112

```jsx
                                    onClick={() => onRemove(item.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
```

**السطر 105:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `onRemove(...)`: تنادي العملية اللي الأب أو الـContext مرّرها باسم onRemove؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي. القيم المكتوبة هنا: `item.id`. العائد/الأثر: العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 106:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 107:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 108:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 109:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 110:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 111:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 112:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 113–120

```jsx

                <div className="checkout-panel">
                    <h5>Choose fulfillment</h5>

                    {fulfillmentOptions.map((option) => (
                        <Form.Check
                            key={option.value}
                            type="radio"
```

**السطر 114:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 115:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 117:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `fulfillmentOptions.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(option) => (                         <Form.Check                             key={option.value}              …`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 118:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 119:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 120:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

### السطور 121–128

```jsx
                            id={`fulfillment-${option.value}`}
                            label={option.label}
                            name="fulfillment"
                            value={option.value}
                            checked={orderType === option.value}
                            onChange={(event) => setOrderType(event.target.value)}
                            className="checkout-radio"
                        />
```

**السطر 121:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 122:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 123:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 124:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 125:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 126:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `setOrderType(...)`: لو setOrderType هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `event.target.value`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 127:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 128:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 129–136

```jsx
                    ))}

                    <div className="cart-total">
                        <span>Total</span>
                        <strong>EGP {total.toFixed(2)}</strong>
                    </div>

                    {message && <div className="cart-message">{message}</div>}
```

**السطر 129:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 131:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 132:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 133:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض. الدوال الموجودة في السطر: `total.toFixed(...)`: تنسّق عددًا بمواضع عشرية محددة. القيم المكتوبة هنا: `2`. العائد/الأثر: string، مش رقمًا صالحًا للحساب بدون تحويل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 134:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 136:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 137–144

```jsx

                    <Button
                        type="button"
                        className="btn-red w-100"
                        disabled={isSubmitting || cartItems.length === 0}
                        onClick={submitOrder}
                    >
                        {isSubmitting ? 'Sending Order...' : 'Checkout'}
```

**السطر 138:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 139:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 140:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 141:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 142:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها.

**السطر 143:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 144:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 145–150

```jsx
                    </Button>
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
}
```

**السطر 145:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 146:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 147:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 148:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 149:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 150:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
