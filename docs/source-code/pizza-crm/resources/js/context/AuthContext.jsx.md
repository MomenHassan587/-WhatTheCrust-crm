# هوية المستخدم المشتركة — Authentication Context

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `resources/js/context/AuthContext.jsx` · 79 سطر.

**وظيفة الملف:** يوفر user وحالة فحص الجلسة ودوال login/register/logout لكل الصفحات. يطلب /api/auth/me أول التركيب. رقم authRequestVersion يمنع استجابة فحص قديمة من الكتابة فوق تسجيل دخول أحدث.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../resources/js/context/AuthContext.jsx). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/resources/js/lib/api.js](../lib/api.js.md)

- [pizza-crm/resources/js/Pages/Auth/Login.jsx](../Pages/Auth/Login.jsx.md)

- [pizza-crm/resources/js/Pages/Auth/Register.jsx](../Pages/Auth/Register.jsx.md)

- [pizza-crm/app/Http/Controllers/Api/AuthController.php](../../../app/Http/Controllers/Api/AuthController.php.md)

- [pizza-crm/resources/js/Components/Navbar.jsx](../Components/Navbar.jsx.md)

- [pizza-crm/resources/js/app.jsx](../app.jsx.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```jsx
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { csrfFetch } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => window.__AUTH_USER__ || null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const authRequestVersion = useRef(0);

    useEffect(() => {
        let isMounted = true;
        const requestVersion = authRequestVersion.current;

        csrfFetch('/api/auth/me')
            .then((response) => {
                if (isMounted && requestVersion === authRequestVersion.current) {
                    setUser(response.user || null);
                }
            })
            .catch(() => {
                if (isMounted && requestVersion === authRequestVersion.current) setUser(null);
            })
            .finally(() => {
                if (isMounted) setIsCheckingAuth(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const value = useMemo(() => ({
        user,
        isCheckingAuth,
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
        register: async (details) => {
            authRequestVersion.current += 1;
            const response = await csrfFetch('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify(details),
            });
            flushSync(() => {
                setUser(response.user);
                setIsCheckingAuth(false);
            });
            return response.user;
        },
        logout: async () => {
            authRequestVersion.current += 1;
            await csrfFetch('/api/auth/logout', { method: 'POST' });
            flushSync(() => {
                setUser(null);
                setIsCheckingAuth(false);
            });
        },
    }), [user, isCheckingAuth]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used inside AuthProvider.');
    return context;
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### AuthProvider

يمسك حالة المستخدم ويوزع دوال الحساب على كل children؛ Provider مش مجرد UI.

- **بتاخد إيه؟ Inputs:** children: المكوّنات المحاطة به.

- **بترجع/بتغيّر إيه؟ Return / effect:** AuthContext.Provider يحمل value وفيه الأبناء.

### login

يزود request version، يرسل credentials إلى /api/auth/login ثم يحدّث user فورًا داخل flushSync قبل توجيه الصفحة.

- **بتاخد إيه؟ Inputs:** credentials: object مثل email/password/remember.

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<User>؛ يرمي خطأ csrfFetch عند الفشل.

### register

يرسل بيانات إنشاء الحساب ثم يسجّل المستخدم الناتج في الـ Context.

- **بتاخد إيه؟ Inputs:** details: name/email/password/password_confirmation.

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<User>.

### logout

يطلب إنهاء جلسة السيرفر ثم يمسح user محليًا؛ المسح وحده مش بديل عن إنهاء الجلسة.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<void>.

### useAuth

Custom hook يقرأ AuthContext؛ يرمي خطأ واضح لو اتنادى خارج AuthProvider.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** object فيه user/isCheckingAuth/login/register/logout.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### createContext

- **جاية منين؟** React API

- **وظيفتها:** ينشئ قناة مشاركة بيانات للأبناء؛ إنشاء السياق لا يخزن بيانات وحده، الـ Provider يمرر value.

- **المدخلات — Arguments:** defaultValue.

- **الناتج/الأثر — Return / effect:** Context object.

- **أول موضع هنا:** السطر 5، والمدخلات المكتوبة: `null`.

- **مثال:** const OrderContext = createContext(null);

### useState

- **جاية منين؟** React

- **وظيفتها:** حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة.

- **المدخلات — Arguments:** initialState

- **الناتج/الأثر — Return / effect:** [currentState,setter]

- **أول موضع هنا:** السطر 9، والمدخلات المكتوبة: `true`.

- **مثال:** const [failed, setFailed] = useState(false);

### useRef

- **جاية منين؟** React

- **وظيفتها:** مرجع ثابت .current للDOM أو قيمة لا تتطلب render عند تغييرها.

- **المدخلات — Arguments:** initialValue

- **الناتج/الأثر — Return / effect:** MutableRefObject

- **أول موضع هنا:** السطر 10، والمدخلات المكتوبة: `0`.

- **مثال:** const videoRef = useRef<HTMLVideoElement>(null);

### useEffect

- **جاية منين؟** React

- **وظيفتها:** يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies.

- **المدخلات — Arguments:** setup callback, dependencies

- **الناتج/الأثر — Return / effect:** undefined

- **أول موضع هنا:** السطر 12، والمدخلات المكتوبة: `() => {         let isMounted = true;         const requestVersion = authRequestVersion.current;          csrfFetch('/api/auth/me')             .then((response) => {               …`، `[]`.

- **مثال:** useEffect(() => { window.addEventListener('resize', updateRunway); return () => window.removeEventListener('resize', updateRunway); }, []);

### csrfFetch('/api/auth/me')             .then((response) => {                 if (isMounted && requestVersion === authRequestVersion.current) {                     setUser(response.user || null);                 }             })             .catch(() => {                 if (isMounted && requestVersion === authRequestVersion.current) setUser(null);             })             .finally

- **جاية منين؟** Promise

- **وظيفتها:** تسجّل تنظيفًا بعد حسم النجاح أو الفشل.

- **المدخلات — Arguments:** callback.

- **الناتج/الأثر — Return / effect:** Promise جديدة؛ callback لا تستقبل بيانات النجاح كمدخل.

- **أول موضع هنا:** السطر 16، والمدخلات المكتوبة: `() => {                 if (isMounted) setIsCheckingAuth(false);             }`.

### csrfFetch('/api/auth/me')             .then((response) => {                 if (isMounted && requestVersion === authRequestVersion.current) {                     setUser(response.user || null);                 }             })             .catch

- **جاية منين؟** Promise

- **وظيفتها:** تسجّل معالجة فشل الـPromise.

- **المدخلات — Arguments:** callback تستقبل سبب الفشل.

- **الناتج/الأثر — Return / effect:** Promise جديدة؛ عدم إعادة الرمي قد يحوّل المسار لنجاح.

- **أول موضع هنا:** السطر 16، والمدخلات المكتوبة: `() => {                 if (isMounted && requestVersion === authRequestVersion.current) setUser(null);             }`.

### csrfFetch('/api/auth/me')             .then

- **جاية منين؟** Promise

- **وظيفتها:** تسجّل معالجة نجاح مع إمكانية chaining.

- **المدخلات — Arguments:** onFulfilled وonRejected اختيارية.

- **الناتج/الأثر — Return / effect:** Promise جديدة بنتيجة callback.

- **أول موضع هنا:** السطر 16، والمدخلات المكتوبة: `(response) => {                 if (isMounted && requestVersion === authRequestVersion.current) {                     setUser(response.user || null);                 }             …`.

### csrfFetch

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح.

- **المدخلات — Arguments:** url: مسار API؛ options: method/body/headers وغيرها، الافتراضي {}.

- **الناتج/الأثر — Return / effect:** Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.

- **أول موضع هنا:** السطر 63، والمدخلات المكتوبة: `'/api/auth/logout'`، `{ method: 'POST' }`.

- **تكملة التعريف:** [resources/js/lib/api.js](../lib/api.js.md)، عند السطر 3.

### setUser

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setUser هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 65، والمدخلات المكتوبة: `null`.

### setIsCheckingAuth

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setIsCheckingAuth هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 66، والمدخلات المكتوبة: `false`.

### useMemo

- **جاية منين؟** React hook

- **وظيفتها:** يحفظ نتيجة حساب كتحسين أداء لحد تغير dependencies؛ callback للحساب مش مكان HTTP أو setState side effects.

- **المدخلات — Arguments:** calculate function,dependencies.

- **الناتج/الأثر — Return / effect:** القيمة المحسوبة.

- **أول موضع هنا:** السطر 34، والمدخلات المكتوبة: `() => ({         user,         isCheckingAuth,         login: async (credentials) => {             authRequestVersion.current += 1;             const response = await csrfFetch('/a…`، `[user, isCheckingAuth]`.

- **مثال:** const completedOrders = useMemo(() => orders.filter((order) => order.status === 'completed'), [orders]);

### JSON.stringify

- **جاية منين؟** JavaScript

- **وظيفتها:** يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions.

- **المدخلات — Arguments:** value

- **الناتج/الأثر — Return / effect:** string أو undefined لبعض القيم

- **أول موضع هنا:** السطر 53، والمدخلات المكتوبة: `details`.

- **مثال:** localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

### flushSync

- **جاية منين؟** react-dom API

- **وظيفتها:** يجبر React على إتمام تحديثات داخل callback بشكل متزامن؛ هنا لتحديث سياق المستخدم قبل navigate. أداة استثنائية مش مطلوب استخدامها لكل setter.

- **المدخلات — Arguments:** callback يحدّث state.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 64، والمدخلات المكتوبة: `() => {                 setUser(null);                 setIsCheckingAuth(false);             }`.

- **مثال:** flushSync(() => { setUser(response.user); setIsCheckingAuth(false); });

### useContext

- **جاية منين؟** React hook

- **وظيفتها:** يقرأ أقرب Provider لنفس Context ويشترك في تغيّر قيمته.

- **المدخلات — Arguments:** Context object.

- **الناتج/الأثر — Return / effect:** value الحالية أو default لو لا Provider.

- **أول موضع هنا:** السطر 75، والمدخلات المكتوبة: `AuthContext`.

- **مثال:** const context = useContext(OrderContext);

### Error

- **جاية منين؟** JavaScript

- **وظيفتها:** تنشئ object خطأ برسالة؛ الرمي يحتاج throw منفصلة.

- **المدخلات — Arguments:** message وخيارات اختيارية.

- **الناتج/الأثر — Return / effect:** Error object.

- **أول موضع هنا:** السطر 76، والمدخلات المكتوبة: `'useAuth must be used inside AuthProvider.'`.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```jsx
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { csrfFetch } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => window.__AUTH_USER__ || null);
```

**السطر 1:** Import / استيراد: الأسماء `React`، `createContext`، `useContext`، `useEffect`، `useMemo`، `useRef`، `useState` جاية من `react`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 2:** Import / استيراد: الأسماء `flushSync` جاية من `react-dom`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 3:** Import / استيراد: الأسماء `csrfFetch` جاية من `../lib/api`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 5:** Variable declaration / تعريف `AuthContext` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `createContext(...)`: ينشئ قناة مشاركة بيانات للأبناء؛ إنشاء السياق لا يخزن بيانات وحده، الـ Provider يمرر value. القيم المكتوبة هنا: `null`. العائد/الأثر: Context object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 7:** Function / تعريف دالة `AuthProvider`؛ تعريفها مش تشغيلها. يمسك حالة المستخدم ويوزع دوال الحساب على كل children؛ Provider مش مجرد UI. مدخلاتها: children: المكوّنات المحاطة به. ناتجها: AuthContext.Provider يحمل value وفيه الأبناء.

**السطر 8:** Variable declaration / تعريف `user + setUser` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `() => window.__AUTH_USER__ || null`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 9–16

```jsx
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const authRequestVersion = useRef(0);

    useEffect(() => {
        let isMounted = true;
        const requestVersion = authRequestVersion.current;

        csrfFetch('/api/auth/me')
```

**السطر 9:** Variable declaration / تعريف `isCheckingAuth + setIsCheckingAuth` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `true`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 10:** Variable declaration / تعريف `authRequestVersion` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useRef(...)`: مرجع ثابت .current للDOM أو قيمة لا تتطلب render عند تغييرها. القيم المكتوبة هنا: `0`. العائد/الأثر: MutableRefObject. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 12:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `() => {         let isMounted = true;         const requestVersion = authRequestVersion.current;          csrf…`، `[]`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 13:** Variable declaration / تعريف `isMounted` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `true`، مش ناتج طلب شبكة.

**السطر 14:** Variable declaration / تعريف `requestVersion` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 16:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `csrfFetch('/api/auth/me')             .then((response) => {                 if (isMounted && requestVersion === authRequestVersion.current) {                     setUser(response.user || null);                 }             })             .catch(() => {                 if (isMounted && requestVersion === authRequestVersion.current) setUser(null);             })             .finally(...)`: تسجّل تنظيفًا بعد حسم النجاح أو الفشل. القيم المكتوبة هنا: `() => {                 if (isMounted) setIsCheckingAuth(false);             }`. العائد/الأثر: Promise جديدة؛ callback لا تستقبل بيانات النجاح كمدخل.؛ `csrfFetch('/api/auth/me')             .then((response) => {                 if (isMounted && requestVersion === authRequestVersion.current) {                     setUser(response.user || null);                 }             })             .catch(...)`: تسجّل معالجة فشل الـPromise. القيم المكتوبة هنا: `() => {                 if (isMounted && requestVersion === authRequestVersion.current) setUser(null);        …`. العائد/الأثر: Promise جديدة؛ عدم إعادة الرمي قد يحوّل المسار لنجاح.؛ `csrfFetch('/api/auth/me')             .then(...)`: تسجّل معالجة نجاح مع إمكانية chaining. القيم المكتوبة هنا: `(response) => {                 if (isMounted && requestVersion === authRequestVersion.current) {             …`. العائد/الأثر: Promise جديدة بنتيجة callback.؛ `csrfFetch(...)`: توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح. القيم المكتوبة هنا: `'/api/auth/me'`. العائد/الأثر: Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 17–24

```jsx
            .then((response) => {
                if (isMounted && requestVersion === authRequestVersion.current) {
                    setUser(response.user || null);
                }
            })
            .catch(() => {
                if (isMounted && requestVersion === authRequestVersion.current) setUser(null);
            })
```

**السطر 17:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 18:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 19:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setUser(...)`: لو setUser هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `response.user || null`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 20:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 21:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 22:** Catch: استقبل الخطأ من try/Promise حسب السياق وتعامل مع رسالته؛ catch لا تعني نجاح الطلب الأصلي.

**السطر 23:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `setUser(...)`: لو setUser هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `null`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 24:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 25–32

```jsx
            .finally(() => {
                if (isMounted) setIsCheckingAuth(false);
            });

        return () => {
            isMounted = false;
        };
    }, []);
```

**السطر 25:** Finally: تنظيف/إرجاع حالة الانشغال بعد try سواء نجحت أو فشلت.

**السطر 26:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `setIsCheckingAuth(...)`: لو setIsCheckingAuth هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `false`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 27:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 29:** Return / رجّع `() => {` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 30:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 31:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 32:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 33–40

```jsx

    const value = useMemo(() => ({
        user,
        isCheckingAuth,
        login: async (credentials) => {
            authRequestVersion.current += 1;
            const response = await csrfFetch('/api/auth/login', {
                method: 'POST',
```

**السطر 34:** Variable declaration / تعريف `value` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useMemo(...)`: يحفظ نتيجة حساب كتحسين أداء لحد تغير dependencies؛ callback للحساب مش مكان HTTP أو setState side effects. القيم المكتوبة هنا: `() => ({         user,         isCheckingAuth,         login: async (credentials) => {             authRequest…`، `[user, isCheckingAuth]`. العائد/الأثر: القيمة المحسوبة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 35:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 36:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 37:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 38:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 39:** Variable declaration / تعريف `response` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `csrfFetch(...)`: توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح. القيم المكتوبة هنا: `'/api/auth/login'`، `{                 method: 'POST',                 body: JSON.stringify(credentials),             }`. العائد/الأثر: Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 40:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 41–48

```jsx
                body: JSON.stringify(credentials),
            });
            flushSync(() => {
                setUser(response.user);
                setIsCheckingAuth(false);
            });
            return response.user;
        },
```

**السطر 41:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `credentials`. العائد/الأثر: string أو undefined لبعض القيم. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 42:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 43:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `flushSync(...)`: يجبر React على إتمام تحديثات داخل callback بشكل متزامن؛ هنا لتحديث سياق المستخدم قبل navigate. أداة استثنائية مش مطلوب استخدامها لكل setter. القيم المكتوبة هنا: `() => {                 setUser(response.user);                 setIsCheckingAuth(false);             }`. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 44:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setUser(...)`: لو setUser هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `response.user`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 45:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setIsCheckingAuth(...)`: لو setIsCheckingAuth هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `false`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 46:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 47:** Return / رجّع `response.user` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 48:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 49–56

```jsx
        register: async (details) => {
            authRequestVersion.current += 1;
            const response = await csrfFetch('/api/auth/register', {
                method: 'POST',
                body: JSON.stringify(details),
            });
            flushSync(() => {
                setUser(response.user);
```

**السطر 49:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 50:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 51:** Variable declaration / تعريف `response` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `csrfFetch(...)`: توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح. القيم المكتوبة هنا: `'/api/auth/register'`، `{                 method: 'POST',                 body: JSON.stringify(details),             }`. العائد/الأثر: Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 52:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 53:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `details`. العائد/الأثر: string أو undefined لبعض القيم. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 54:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 55:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `flushSync(...)`: يجبر React على إتمام تحديثات داخل callback بشكل متزامن؛ هنا لتحديث سياق المستخدم قبل navigate. أداة استثنائية مش مطلوب استخدامها لكل setter. القيم المكتوبة هنا: `() => {                 setUser(response.user);                 setIsCheckingAuth(false);             }`. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 56:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setUser(...)`: لو setUser هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `response.user`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 57–64

```jsx
                setIsCheckingAuth(false);
            });
            return response.user;
        },
        logout: async () => {
            authRequestVersion.current += 1;
            await csrfFetch('/api/auth/logout', { method: 'POST' });
            flushSync(() => {
```

**السطر 57:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setIsCheckingAuth(...)`: لو setIsCheckingAuth هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `false`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 58:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 59:** Return / رجّع `response.user` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 60:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 61:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 62:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 63:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `csrfFetch(...)`: توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح. القيم المكتوبة هنا: `'/api/auth/logout'`، `{ method: 'POST' }`. العائد/الأثر: Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 64:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `flushSync(...)`: يجبر React على إتمام تحديثات داخل callback بشكل متزامن؛ هنا لتحديث سياق المستخدم قبل navigate. أداة استثنائية مش مطلوب استخدامها لكل setter. القيم المكتوبة هنا: `() => {                 setUser(null);                 setIsCheckingAuth(false);             }`. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 65–72

```jsx
                setUser(null);
                setIsCheckingAuth(false);
            });
        },
    }), [user, isCheckingAuth]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

**السطر 65:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setUser(...)`: لو setUser هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `null`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 66:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setIsCheckingAuth(...)`: لو setIsCheckingAuth هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `false`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 67:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 68:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 69:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 71:** Return / رجّع `<AuthContext.Provider value={value}>{children}</AuthContext.Provider>` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 72:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 73–79

```jsx

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used inside AuthProvider.');
    return context;
}

```

**السطر 74:** Function / تعريف دالة `useAuth`؛ تعريفها مش تشغيلها. Custom hook يقرأ AuthContext؛ يرمي خطأ واضح لو اتنادى خارج AuthProvider. مدخلاتها: لا شيء. ناتجها: object فيه user/isCheckingAuth/login/register/logout.

**السطر 75:** Variable declaration / تعريف `context` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useContext(...)`: يقرأ أقرب Provider لنفس Context ويشترك في تغيّر قيمته. القيم المكتوبة هنا: `AuthContext`. العائد/الأثر: value الحالية أو default لو لا Provider.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 76:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `Error(...)`: تنشئ object خطأ برسالة؛ الرمي يحتاج throw منفصلة. القيم المكتوبة هنا: `'useAuth must be used inside AuthProvider.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 77:** Return / رجّع `context` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 78:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
