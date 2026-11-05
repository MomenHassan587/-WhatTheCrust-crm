# تسجيل الدخول الحقيقي: Form → Context → API

[فهرس كل الأكواد](../../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `resources/js/Pages/Auth/Login.jsx` · 98 سطر.

**وظيفة الملف:** Controlled inputs تحفظ email/password/remember. الإرسال لا يعيد تحميل الصفحة، يمرر form إلى AuthContext.login ويوجّه حسب role. build الديمو يستبدل الشاشة بـ DemoAccounts.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../../resources/js/Pages/Auth/Login.jsx). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/resources/js/context/AuthContext.jsx](../../context/AuthContext.jsx.md)

- [pizza-crm/resources/js/app.jsx](../../app.jsx.md)

- [pizza-crm/resources/js/lib/api.js](../../lib/api.js.md)

- [pizza-crm/app/Http/Controllers/Api/AuthController.php](../../../../app/Http/Controllers/Api/AuthController.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```jsx
// resources/js/Pages/Auth/Login.jsx

import React, { useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
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

    return (
        <main className="auth-page">
            <Card className="auth-card">
                <Card.Body>
                    <p className="eyebrow">Welcome Back</p>
                    <h1>Login</h1>
                    <p className="section-copy">
                        Enter the crust chamber and continue your order.
                    </p>

                    {error && <Alert variant="danger">{error}</Alert>}

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

                    <p className="auth-switch">
                        No account yet? <Link to="/register">Create one</Link>
                    </p>
                </Card.Body>
            </Card>
        </main>
    );
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### Login

يعرض فورم الدخول وحالة الخطأ وتعطيل الزر أثناء الإرسال.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX main/Card/Form.

### updateField

يحدّث حقلًا واحدًا في form بدون فقد باقي الحقول باستعمال ...current و[field].

- **بتاخد إيه؟ Inputs:** field: اسم الخاصية؛ value من event.target.value أو checked.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined.

### submitLogin

يمنع submit الافتراضي، يمسح الخطأ، ينتظر login(form)، ثم يوجّه admin/staff/customer ويوقف loading في finally.

- **بتاخد إيه؟ Inputs:** event: حدث إرسال الفورم.

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<void>.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### useNavigate

- **جاية منين؟** react-router-dom hook

- **وظيفتها:** يوفر function للتنقل داخل SPA؛ replace=true يستبدل history entry الحالية.

- **المدخلات — Arguments:** لا شيء عند إنشاء hook.

- **الناتج/الأثر — Return / effect:** navigate function.

- **أول موضع هنا:** السطر 9.

- **مثال:** navigate('/cart');

### useAuth

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** Custom hook يقرأ AuthContext؛ يرمي خطأ واضح لو اتنادى خارج AuthProvider.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** object فيه user/isCheckingAuth/login/register/logout.

- **أول موضع هنا:** السطر 10.

- **تكملة التعريف:** [resources/js/context/AuthContext.jsx](../../context/AuthContext.jsx.md)، عند السطر 74.

### useState

- **جاية منين؟** React

- **وظيفتها:** حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة.

- **المدخلات — Arguments:** initialState

- **الناتج/الأثر — Return / effect:** [currentState,setter]

- **أول موضع هنا:** السطر 19، والمدخلات المكتوبة: `false`.

- **مثال:** const [failed, setFailed] = useState(false);

### setForm

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setForm هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 22، والمدخلات المكتوبة: `(current) => ({             ...current,             [field]: value,         })`.

### event.preventDefault

- **جاية منين؟** Browser Event

- **وظيفتها:** تمنع السلوك الافتراضي لحدث قابل للإلغاء.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** undefined؛ لا توقف propagation تلقائيًا.

- **أول موضع هنا:** السطر 29.

### setError

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 37، والمدخلات المكتوبة: `requestError.message`.

### setIsSubmitting

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setIsSubmitting هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 39، والمدخلات المكتوبة: `false`.

### login

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** يزود request version، يرسل credentials إلى /api/auth/login ثم يحدّث user فورًا داخل flushSync قبل توجيه الصفحة.

- **المدخلات — Arguments:** credentials: object مثل email/password/remember.

- **الناتج/الأثر — Return / effect:** Promise<User>؛ يرمي خطأ csrfFetch عند الفشل.

- **أول موضع هنا:** السطر 34، والمدخلات المكتوبة: `form`.

- **تكملة التعريف:** [resources/js/context/AuthContext.jsx](../../context/AuthContext.jsx.md)، عند السطر 37.

### navigate

- **جاية منين؟** React Router callback

- **وظيفتها:** تنقّل داخل SPA حسب route.

- **المدخلات — Arguments:** path وoptions مثل replace.

- **الناتج/الأثر — Return / effect:** void/Promise حسب نمط Router؛ مش حماية endpoint.

- **أول موضع هنا:** السطر 35، والمدخلات المكتوبة: `user.role === 'admin' ? '/admin' : user.role === 'staff' ? '/staff' : '/menu'`، `{ replace: true }`.

### updateField

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يحدّث حقلًا واحدًا في form بدون فقد باقي الحقول باستعمال ...current و[field].

- **المدخلات — Arguments:** field: اسم الخاصية؛ value من event.target.value أو checked.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 82، والمدخلات المكتوبة: `'remember'`، `event.target.checked`.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```jsx
// resources/js/Pages/Auth/Login.jsx

import React, { useState } from 'react';
import { Alert, Button, Card, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
```

**السطر 1:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 3:** Import / استيراد: الأسماء `React`، `useState` جاية من `react`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 4:** Import / استيراد: الأسماء `Alert`، `Button`، `Card`، `Form` جاية من `react-bootstrap`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 5:** Import / استيراد: الأسماء `Link`، `useNavigate` جاية من `react-router-dom`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 6:** Import / استيراد: الأسماء `useAuth` جاية من `../../context/AuthContext`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 8:** Function / تعريف دالة `Login`؛ تعريفها مش تشغيلها. يعرض فورم الدخول وحالة الخطأ وتعطيل الزر أثناء الإرسال. مدخلاتها: لا شيء. ناتجها: JSX main/Card/Form.

### السطور 9–16

```jsx
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: '',
        password: '',
        remember: false,
    });
```

**السطر 9:** Variable declaration / تعريف `navigate` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useNavigate(...)`: يوفر function للتنقل داخل SPA؛ replace=true يستبدل history entry الحالية. مدخلاتها: لا شيء عند إنشاء hook. العائد/الأثر: navigate function.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 10:** Variable declaration / تعريف اسم/أسماء لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useAuth(...)`: Custom hook يقرأ AuthContext؛ يرمي خطأ واضح لو اتنادى خارج AuthProvider. مدخلاتها: لا شيء. العائد/الأثر: object فيه user/isCheckingAuth/login/register/logout.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 12:** Variable declaration / تعريف `form + setForm` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `{         email: '',         password: '',         remember: false,     }`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 13:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 14:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 15:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 16:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 17–24

```jsx

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateField = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
```

**السطر 18:** Variable declaration / تعريف `error + setError` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `''`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 19:** Variable declaration / تعريف `isSubmitting + setIsSubmitting` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `false`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 21:** Variable declaration / تعريف `updateField` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `updateField` هنا: يحدّث حقلًا واحدًا في form بدون فقد باقي الحقول باستعمال ...current و[field]. المدخلات: field: اسم الخاصية؛ value من event.target.value أو checked.. الناتج/الأثر: undefined..

**السطر 22:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setForm(...)`: لو setForm هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `(current) => ({             ...current,             [field]: value,         })`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 23:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 24:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 25–32

```jsx
        }));
    };

    const submitLogin = async (event) => {
        event.preventDefault();
        setError('');
        setIsSubmitting(true);

```

**السطر 25:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 26:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 28:** Variable declaration / تعريف `submitLogin` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `submitLogin` هنا: يمنع submit الافتراضي، يمسح الخطأ، ينتظر login(form)، ثم يوجّه admin/staff/customer ويوقف loading في finally. المدخلات: event: حدث إرسال الفورم.. الناتج/الأثر: Promise<void>..

**السطر 29:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `event.preventDefault(...)`: تمنع السلوك الافتراضي لحدث قابل للإلغاء. مدخلاتها: بدون مدخلات. العائد/الأثر: undefined؛ لا توقف propagation تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 30:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setError(...)`: لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `''`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 31:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setIsSubmitting(...)`: لو setIsSubmitting هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `true`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 33–40

```jsx
        try {
            const user = await login(form);
            navigate(user.role === 'admin' ? '/admin' : user.role === 'staff' ? '/staff' : '/menu', { replace: true });
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setIsSubmitting(false);
        }
```

**السطر 33:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة.

**السطر 34:** Variable declaration / تعريف `user` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `login(...)`: يزود request version، يرسل credentials إلى /api/auth/login ثم يحدّث user فورًا داخل flushSync قبل توجيه الصفحة. القيم المكتوبة هنا: `form`. العائد/الأثر: Promise<User>؛ يرمي خطأ csrfFetch عند الفشل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 35:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `navigate(...)`: تنقّل داخل SPA حسب route. القيم المكتوبة هنا: `user.role === 'admin' ? '/admin' : user.role === 'staff' ? '/staff' : '/menu'`، `{ replace: true }`. العائد/الأثر: void/Promise حسب نمط Router؛ مش حماية endpoint.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 36:** Catch: استقبل الخطأ من try/Promise حسب السياق وتعامل مع رسالته؛ catch لا تعني نجاح الطلب الأصلي.

**السطر 37:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setError(...)`: لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `requestError.message`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 38:** Finally: تنظيف/إرجاع حالة الانشغال بعد try سواء نجحت أو فشلت.

**السطر 39:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setIsSubmitting(...)`: لو setIsSubmitting هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `false`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 40:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 41–48

```jsx
    };

    return (
        <main className="auth-page">
            <Card className="auth-card">
                <Card.Body>
                    <p className="eyebrow">Welcome Back</p>
                    <h1>Login</h1>
```

**السطر 41:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 43:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 44:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 45:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 46:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 47:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 48:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 49–56

```jsx
                    <p className="section-copy">
                        Enter the crust chamber and continue your order.
                    </p>

                    {error && <Alert variant="danger">{error}</Alert>}

                    <Form onSubmit={submitLogin}>
                        <Form.Group className="mb-3" controlId="login-email">
```

**السطر 49:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 50:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 51:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 53:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 55:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها.

**السطر 56:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 57–64

```jsx
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={form.email}
                                onChange={(event) => updateField('email', event.target.value)}
                                required
                            />
                        </Form.Group>
```

**السطر 57:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 58:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 59:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 60:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 61:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `updateField(...)`: يحدّث حقلًا واحدًا في form بدون فقد باقي الحقول باستعمال ...current و[field]. القيم المكتوبة هنا: `'email'`، `event.target.value`. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 62:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 63:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 64:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 65–72

```jsx

                        <Form.Group className="mb-3" controlId="login-password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={form.password}
                                onChange={(event) => updateField('password', event.target.value)}
                                required
```

**السطر 66:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 67:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 68:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 69:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 70:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 71:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `updateField(...)`: يحدّث حقلًا واحدًا في form بدون فقد باقي الحقول باستعمال ...current و[field]. القيم المكتوبة هنا: `'password'`، `event.target.value`. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 72:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 73–80

```jsx
                            />
                        </Form.Group>

                        <Form.Check
                            className="mb-4"
                            type="checkbox"
                            id="remember-me"
                            label="Remember me"
```

**السطر 73:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 74:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 76:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 77:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 78:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 79:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 80:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

### السطور 81–88

```jsx
                            checked={form.remember}
                            onChange={(event) => updateField('remember', event.target.checked)}
                        />

                        <Button type="submit" className="btn-red w-100" disabled={isSubmitting}>
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </Button>
                    </Form>
```

**السطر 81:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 82:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `updateField(...)`: يحدّث حقلًا واحدًا في form بدون فقد باقي الحقول باستعمال ...current و[field]. القيم المكتوبة هنا: `'remember'`، `event.target.checked`. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 83:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 85:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 86:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 87:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 88:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 89–96

```jsx

                    <p className="auth-switch">
                        No account yet? <Link to="/register">Create one</Link>
                    </p>
                </Card.Body>
            </Card>
        </main>
    );
```

**السطر 90:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 91:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 92:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 93:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 94:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 95:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 96:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 97–98

```jsx
}

```

**السطر 97:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
