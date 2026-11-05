# الديمو: دخول تجريبي وإعادة ضبط بيانات المتصفح

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `resources/js/Components/DemoBar.jsx` · 26 سطر.

**وظيفة الملف:** بيتعمله lazy import فقط لما VITE_DEMO_MODE=true. حسابات بلا كلمة مرور للديمو مش نظام مصادقة إنتاجي، والـ reset يمسح مفاتيح الديمو المعروفة فقط.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../resources/js/Components/DemoBar.jsx). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/resources/js/context/AuthContext.jsx](../context/AuthContext.jsx.md)

- [pizza-crm/resources/js/demo/api.js](../demo/api.js.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { demoAccounts, resetDemo } from '../demo/api';

export function DemoAccounts() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const enter = async (account) => {
        setBusy(true);
        try {
            const user = await login({ email: account.email });
            navigate(user.role === 'admin' ? '/admin' : user.role === 'staff' ? '/staff' : '/menu');
        } catch (requestError) { setError(requestError.message); }
        finally { setBusy(false); }
    };
    return <main className="auth-page"><section className="auth-card p-4"><p className="eyebrow">Interactive preview</p><h1 className="h3">Choose a demo account</h1><p className="text-secondary">No signup or password needed. Use sample customer details only.</p><div className="d-grid gap-2">{demoAccounts().map((account) => <button key={account.id} type="button" className="btn btn-outline-light text-start" disabled={busy} onClick={() => enter(account)}>{account.name}</button>)}</div>{error && <p role="alert" className="text-danger mt-3">{error}</p>}</section></main>;
}

export default function DemoBar() {
    const { user } = useAuth();
    return <aside className="wtc-demo-bar" aria-label="Demo controls"><div><strong>DEMO</strong><span>Sample orders only. No payments. Data stays in this browser.</span></div><nav aria-label="Demo navigation"><Link to="/login">{user ? 'Switch account' : 'Try staff / admin'}</Link><button type="button" onClick={() => { if (window.confirm('Reset all demo orders and changes in this browser?')) { resetDemo(); window.location.reload(); } }}>Reset demo</button></nav></aside>;
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### DemoAccounts

يرسم حساب عميل وموظفين وأدمن تجريبيين بدل Login/Register الحقيقي في build الديمو.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX لاختيار الحساب.

### enter

يمرر email حساب الديمو لـ login ثم يوجّه حسب role؛ busy يعطل الأزرار أثناء المحاولة.

- **بتاخد إيه؟ Inputs:** account: حساب من demoAccounts().

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<void>.

### DemoBar

تحذير مرئي بعدم وجود دفع وطلبات حقيقية، وروابط تبديل الحساب وزر reset بعد confirm.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX aside.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### useAuth

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** Custom hook يقرأ AuthContext؛ يرمي خطأ واضح لو اتنادى خارج AuthProvider.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** object فيه user/isCheckingAuth/login/register/logout.

- **أول موضع هنا:** السطر 23.

- **تكملة التعريف:** [resources/js/context/AuthContext.jsx](../context/AuthContext.jsx.md)، عند السطر 74.

### useNavigate

- **جاية منين؟** react-router-dom hook

- **وظيفتها:** يوفر function للتنقل داخل SPA؛ replace=true يستبدل history entry الحالية.

- **المدخلات — Arguments:** لا شيء عند إنشاء hook.

- **الناتج/الأثر — Return / effect:** navigate function.

- **أول موضع هنا:** السطر 8.

- **مثال:** navigate('/cart');

### useState

- **جاية منين؟** React

- **وظيفتها:** حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة.

- **المدخلات — Arguments:** initialState

- **الناتج/الأثر — Return / effect:** [currentState,setter]

- **أول موضع هنا:** السطر 10، والمدخلات المكتوبة: `false`.

- **مثال:** const [failed, setFailed] = useState(false);

### setBusy

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setBusy هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 17، والمدخلات المكتوبة: `false`.

### login

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** يزود request version، يرسل credentials إلى /api/auth/login ثم يحدّث user فورًا داخل flushSync قبل توجيه الصفحة.

- **المدخلات — Arguments:** credentials: object مثل email/password/remember.

- **الناتج/الأثر — Return / effect:** Promise<User>؛ يرمي خطأ csrfFetch عند الفشل.

- **أول موضع هنا:** السطر 14، والمدخلات المكتوبة: `{ email: account.email }`.

- **تكملة التعريف:** [resources/js/context/AuthContext.jsx](../context/AuthContext.jsx.md)، عند السطر 37.

### navigate

- **جاية منين؟** React Router callback

- **وظيفتها:** تنقّل داخل SPA حسب route.

- **المدخلات — Arguments:** path وoptions مثل replace.

- **الناتج/الأثر — Return / effect:** void/Promise حسب نمط Router؛ مش حماية endpoint.

- **أول موضع هنا:** السطر 15، والمدخلات المكتوبة: `user.role === 'admin' ? '/admin' : user.role === 'staff' ? '/staff' : '/menu'`.

### setError

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 16، والمدخلات المكتوبة: `requestError.message`.

### demoAccounts().map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 19، والمدخلات المكتوبة: `(account) => <button key={account.id} type="button" className="btn btn-outline-light text-start" disabled={busy} onClick={() => enter(account)}>{account.name}</button>`.

### demoAccounts

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** يبني عميلًا وموظفًا لكل فرع وأدمن بأرقام ثابتة للديمو.

- **المدخلات — Arguments:** catalog=seedCatalog.

- **الناتج/الأثر — Return / effect:** array حسابات وهمية، لا passwords.

- **أول موضع هنا:** السطر 19.

- **تكملة التعريف:** [resources/js/demo/api.js](../demo/api.js.md)، عند السطر 7.

### enter

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يمرر email حساب الديمو لـ login ثم يوجّه حسب role؛ busy يعطل الأزرار أثناء المحاولة.

- **المدخلات — Arguments:** account: حساب من demoAccounts().

- **الناتج/الأثر — Return / effect:** Promise<void>.

- **أول موضع هنا:** السطر 19، والمدخلات المكتوبة: `account`.

### window.confirm

- **جاية منين؟** Browser

- **وظيفتها:** تطلب تأكيدًا بسيطًا من المستخدم.

- **المدخلات — Arguments:** نص السؤال.

- **الناتج/الأثر — Return / effect:** Boolean؛ ده قرار واجهة مش authorization.

- **أول موضع هنا:** السطر 24، والمدخلات المكتوبة: `'Reset all demo orders and changes in this browser?'`.

### resetDemo

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** يمسح 5 مفاتيح demo محددة فقط؛ لا يستخدم localStorage.clear ولا يمس مفاتيح live.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** undefined؛ UI ينادي reload بعده لتوليد seed جديد.

- **أول موضع هنا:** السطر 24.

- **تكملة التعريف:** [resources/js/demo/api.js](../demo/api.js.md)، عند السطر 232.

### window.location.reload

- **جاية منين؟** Browser Location

- **وظيفتها:** تطلب تحميل المستند الحالي من جديد.

- **المدخلات — Arguments:** بدون arguments هنا.

- **الناتج/الأثر — Return / effect:** undefined؛ تعيد بدء التطبيق.

- **أول موضع هنا:** السطر 24.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { demoAccounts, resetDemo } from '../demo/api';

export function DemoAccounts() {
    const { login } = useAuth();
    const navigate = useNavigate();
```

**السطر 1:** Import / استيراد: الأسماء `React`، `useState` جاية من `react`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 2:** Import / استيراد: الأسماء `Link`، `useNavigate` جاية من `react-router-dom`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 3:** Import / استيراد: الأسماء `useAuth` جاية من `../context/AuthContext`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 4:** Import / استيراد: الأسماء `demoAccounts`، `resetDemo` جاية من `../demo/api`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 6:** Function / تعريف دالة `DemoAccounts`؛ تعريفها مش تشغيلها. يرسم حساب عميل وموظفين وأدمن تجريبيين بدل Login/Register الحقيقي في build الديمو. مدخلاتها: لا شيء. ناتجها: JSX لاختيار الحساب.

**السطر 7:** Variable declaration / تعريف اسم/أسماء لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useAuth(...)`: Custom hook يقرأ AuthContext؛ يرمي خطأ واضح لو اتنادى خارج AuthProvider. مدخلاتها: لا شيء. العائد/الأثر: object فيه user/isCheckingAuth/login/register/logout.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 8:** Variable declaration / تعريف `navigate` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useNavigate(...)`: يوفر function للتنقل داخل SPA؛ replace=true يستبدل history entry الحالية. مدخلاتها: لا شيء عند إنشاء hook. العائد/الأثر: navigate function.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 9–16

```jsx
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);
    const enter = async (account) => {
        setBusy(true);
        try {
            const user = await login({ email: account.email });
            navigate(user.role === 'admin' ? '/admin' : user.role === 'staff' ? '/staff' : '/menu');
        } catch (requestError) { setError(requestError.message); }
```

**السطر 9:** Variable declaration / تعريف `error + setError` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `''`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 10:** Variable declaration / تعريف `busy + setBusy` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `false`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 11:** Variable declaration / تعريف `enter` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `enter` هنا: يمرر email حساب الديمو لـ login ثم يوجّه حسب role؛ busy يعطل الأزرار أثناء المحاولة. المدخلات: account: حساب من demoAccounts().. الناتج/الأثر: Promise<void>..

**السطر 12:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setBusy(...)`: لو setBusy هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `true`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 13:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة.

**السطر 14:** Variable declaration / تعريف `user` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `login(...)`: يزود request version، يرسل credentials إلى /api/auth/login ثم يحدّث user فورًا داخل flushSync قبل توجيه الصفحة. القيم المكتوبة هنا: `{ email: account.email }`. العائد/الأثر: Promise<User>؛ يرمي خطأ csrfFetch عند الفشل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 15:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `navigate(...)`: تنقّل داخل SPA حسب route. القيم المكتوبة هنا: `user.role === 'admin' ? '/admin' : user.role === 'staff' ? '/staff' : '/menu'`. العائد/الأثر: void/Promise حسب نمط Router؛ مش حماية endpoint.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 16:** Catch: استقبل الخطأ من try/Promise حسب السياق وتعامل مع رسالته؛ catch لا تعني نجاح الطلب الأصلي. الدوال الموجودة في السطر: `setError(...)`: لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `requestError.message`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 17–24

```jsx
        finally { setBusy(false); }
    };
    return <main className="auth-page"><section className="auth-card p-4"><p className="eyebrow">Interactive preview</p><h1 className="h3">Choose a demo account</h1><p className="text-secondary">No signup or password needed. Use sample customer details only.</p><div className="d-grid gap-2">{demoAccounts().map((account) => <button key={account.id} type="button" className="btn btn-outline-light text-start" disabled={busy} onClick={() => enter(account)}>{account.name}</button>)}</div>{error && <p role="alert" className="text-danger mt-3">{error}</p>}</section></main>;
}

export default function DemoBar() {
    const { user } = useAuth();
    return <aside className="wtc-demo-bar" aria-label="Demo controls"><div><strong>DEMO</strong><span>Sample orders only. No payments. Data stays in this browser.</span></div><nav aria-label="Demo navigation"><Link to="/login">{user ? 'Switch account' : 'Try staff / admin'}</Link><button type="button" onClick={() => { if (window.confirm('Reset all demo orders and changes in this browser?')) { resetDemo(); window.location.reload(); } }}>Reset demo</button></nav></aside>;
```

**السطر 17:** Finally: تنظيف/إرجاع حالة الانشغال بعد try سواء نجحت أو فشلت. الدوال الموجودة في السطر: `setBusy(...)`: لو setBusy هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `false`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 18:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 19:** Return / رجّع `<main className="auth-page"><section className="auth-card p-4"><p className="eyebrow">Interactive preview</p><h1 className="h3">Choose a demo account</h1><p className="text-secondary">No signup or password needed. Use sa…` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `demoAccounts().map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(account) => <button key={account.id} type="button" className="btn btn-outline-light text-start" disabled={bus…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `demoAccounts(...)`: يبني عميلًا وموظفًا لكل فرع وأدمن بأرقام ثابتة للديمو. مدخلاتها: catalog=seedCatalog. العائد/الأثر: array حسابات وهمية، لا passwords.؛ `enter(...)`: يمرر email حساب الديمو لـ login ثم يوجّه حسب role؛ busy يعطل الأزرار أثناء المحاولة. القيم المكتوبة هنا: `account`. العائد/الأثر: Promise<void>.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 20:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 22:** Function / تعريف دالة `DemoBar`؛ تعريفها مش تشغيلها. تحذير مرئي بعدم وجود دفع وطلبات حقيقية، وروابط تبديل الحساب وزر reset بعد confirm. مدخلاتها: لا شيء. ناتجها: JSX aside.

**السطر 23:** Variable declaration / تعريف اسم/أسماء لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useAuth(...)`: Custom hook يقرأ AuthContext؛ يرمي خطأ واضح لو اتنادى خارج AuthProvider. مدخلاتها: لا شيء. العائد/الأثر: object فيه user/isCheckingAuth/login/register/logout.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 24:** Return / رجّع `<aside className="wtc-demo-bar" aria-label="Demo controls"><div><strong>DEMO</strong><span>Sample orders only. No payments. Data stays in this browser.</span></div><nav aria-label="Demo navigation"><Link to="/login">{use…` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `window.confirm(...)`: تطلب تأكيدًا بسيطًا من المستخدم. القيم المكتوبة هنا: `'Reset all demo orders and changes in this browser?'`. العائد/الأثر: Boolean؛ ده قرار واجهة مش authorization.؛ `resetDemo(...)`: يمسح 5 مفاتيح demo محددة فقط؛ لا يستخدم localStorage.clear ولا يمس مفاتيح live. مدخلاتها: لا شيء. العائد/الأثر: undefined؛ UI ينادي reload بعده لتوليد seed جديد.؛ `window.location.reload(...)`: تطلب تحميل المستند الحالي من جديد. مدخلاتها: بدون arguments هنا. العائد/الأثر: undefined؛ تعيد بدء التطبيق.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 25–26

```jsx
}

```

**السطر 25:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
