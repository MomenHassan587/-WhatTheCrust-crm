# مدخل تطبيق البيتزا الحقيقي — React Router والـ Providers

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `resources/js/app.jsx` · 102 سطر.

**وظيفة الملف:** ده المدخل اللي vite.config.js بيبنيه فعلًا. بيعمل React root، يركّب Auth/Catalog/Order providers ويختار الصفحة من URL. نسخة الديمو بتغيّر شاشة الدخول لمستخدمين تجريبيين؛ ملف app.js الصغير مش المدخل الحالي.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../resources/js/app.jsx). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/resources/js/bootstrap.js](bootstrap.js.md)

- [pizza-crm/resources/css/app.css](../css/app.css.md)

- [pizza-crm/resources/js/Components/Navbar.jsx](Components/Navbar.jsx.md)

- [pizza-crm/resources/js/Components/Footer.jsx](Components/Footer.jsx.md)

- [pizza-crm/resources/js/Pages/Home.jsx](Pages/Home.jsx.md)

- [pizza-crm/resources/js/Pages/MenuPage.jsx](Pages/MenuPage.jsx.md)

- [pizza-crm/resources/js/Pages/Cart.jsx](Pages/Cart.jsx.md)

- [pizza-crm/resources/js/Pages/Auth/Login.jsx](Pages/Auth/Login.jsx.md)

- [pizza-crm/resources/js/Pages/Auth/Register.jsx](Pages/Auth/Register.jsx.md)

- [pizza-crm/resources/js/Pages/StaffDashboard.jsx](Pages/StaffDashboard.jsx.md)

- [pizza-crm/resources/js/Pages/OrderTracking.jsx](Pages/OrderTracking.jsx.md)

- [pizza-crm/resources/js/Pages/MyOrders.jsx](Pages/MyOrders.jsx.md)

- [pizza-crm/resources/js/Pages/Admin/AdminLayout.jsx](Pages/Admin/AdminLayout.jsx.md)

- [pizza-crm/resources/js/Pages/Admin/AdminDashboard.jsx](Pages/Admin/AdminDashboard.jsx.md)

- [pizza-crm/resources/js/Pages/Admin/AdminPanel.jsx](Pages/Admin/AdminPanel.jsx.md)

- [pizza-crm/resources/js/context/AuthContext.jsx](context/AuthContext.jsx.md)

- [pizza-crm/resources/js/context/CatalogContext.jsx](context/CatalogContext.jsx.md)

- [pizza-crm/resources/js/context/OrderContext.jsx](context/OrderContext.jsx.md)

- [pizza-crm/resources/js/Components/DemoBar.jsx](Components/DemoBar.jsx.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```jsx
// resources/js/app.jsx

import React, { Suspense, lazy, useCallback, useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import './bootstrap';
import '../css/app.css';

import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import MenuPage from './Pages/MenuPage';
import Cart from './Pages/Cart';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import StaffDashboard from './Pages/StaffDashboard';
import OrderTracking from './Pages/OrderTracking';
import MyOrders from './Pages/MyOrders';
import AdminLayout from './Pages/Admin/AdminLayout';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AdminPanel from './Pages/Admin/AdminPanel';
import { AuthProvider } from './context/AuthContext';
import { CatalogProvider } from './context/CatalogContext';
import { OrderProvider } from './context/OrderContext';

const isDemo = import.meta.env.VITE_DEMO_MODE === 'true';
const DemoBar = isDemo ? lazy(() => import('./Components/DemoBar')) : null;
const DemoAccounts = isDemo ? lazy(() => import('./Components/DemoBar').then((module) => ({ default: module.DemoAccounts }))) : null;
if (isDemo) document.body.classList.add('wtc-demo-mode');

function AppShell() {
    const location = useLocation();
    const reduceMotion = useReducedMotion();
    const isHome = location.pathname === '/';
    const previousPath = useRef(location.pathname);
    const [heroReady, setHeroReady] = useState(false);

    const revealHero = useCallback(() => {
        setHeroReady(true);
    }, []);

    useLayoutEffect(() => {
        if (isHome && previousPath.current !== '/') {
            setHeroReady(false);
        }

        previousPath.current = location.pathname;
    }, [isHome, location.pathname]);

    return (
        <>
            <Navbar
                isVisible={!isHome || heroReady}
                reduceMotion={reduceMotion}
                animateReveal={isHome}
            />

            <Suspense fallback={<main className="auth-page">Loading demo...</main>}>
            <Routes>
                <Route path="/" element={<Home heroReady={heroReady} onHeroReady={revealHero} reduceMotion={reduceMotion} />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={isDemo ? <DemoAccounts /> : <Login />} />
                <Route path="/register" element={isDemo ? <DemoAccounts /> : <Register />} />
                <Route path="/staff" element={<StaffDashboard />} />
                <Route path="/orders" element={<MyOrders />} />
                <Route path="/orders/:token" element={<OrderTracking />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path=":section" element={<AdminPanel />} />
                </Route>
            </Routes>
            </Suspense>

            <Footer />
            {isDemo && <Suspense fallback={null}><DemoBar /></Suspense>}
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CatalogProvider>
                    <OrderProvider>
                        <AppShell />
                    </OrderProvider>
                </CatalogProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### AppShell

يجمع Navbar وRoutes وFooter؛ يتحكم في إظهار الـ Navbar بعد مقدمة فيديو Home.

- **بتاخد إيه؟ Inputs:** مفيش props؛ بيقرأ useLocation وحالة heroReady.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX لتخطيط الموقع ومساراته.

### revealHero

Callback بتوصل من AppShell لحد فيديو Home؛ بتغيّر heroReady إلى true مرة المحتوى يبقى جاهز للظهور.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined؛ التأثير هو setHeroReady(true).

### App

يوفر Router وContexts لكل الأبناء؛ ترتيب Providers مهم لأن OrderProvider بيستخدم CatalogProvider.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX لشجرة الـ Providers حول AppShell.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### lazy

- **جاية منين؟** React API

- **وظيفتها:** يعرّف component يتحمّل عند الحاجة عبر Promise تنتهي بموديل default؛ Suspense يرسم fallback أثناء التحميل.

- **المدخلات — Arguments:** loader function مثل () => import(...).

- **الناتج/الأثر — Return / effect:** Lazy component.

- **أول موضع هنا:** السطر 30، والمدخلات المكتوبة: `() => import('./Components/DemoBar').then((module) => ({ default: module.DemoAccounts }))`.

- **مثال:** const DemoBar = isDemo ? lazy(() => import('./Components/DemoBar')) : null;

### import

- **جاية منين؟** JavaScript modules

- **وظيفتها:** تحمّل module ديناميكيًا وقت الحاجة.

- **المدخلات — Arguments:** مسار module.

- **الناتج/الأثر — Return / effect:** Promise لـmodule namespace؛ مش root component نفسه بدون اختيار export.

- **أول موضع هنا:** السطر 30، والمدخلات المكتوبة: `'./Components/DemoBar'`.

### import('./Components/DemoBar').then

- **جاية منين؟** Promise

- **وظيفتها:** تسجّل معالجة نجاح مع إمكانية chaining.

- **المدخلات — Arguments:** onFulfilled وonRejected اختيارية.

- **الناتج/الأثر — Return / effect:** Promise جديدة بنتيجة callback.

- **أول موضع هنا:** السطر 30، والمدخلات المكتوبة: `(module) => ({ default: module.DemoAccounts })`.

### document.body.classList.add

- **جاية منين؟** Set أو DOMTokenList

- **وظيفتها:** تضيف قيمة Set أو كلاس إلى classList حسب المستقبِل.

- **المدخلات — Arguments:** القيمة أو اسم الكلاس.

- **الناتج/الأثر — Return / effect:** Set نفسها عند Set.add؛ undefined عند classList.add.

- **أول موضع هنا:** السطر 31، والمدخلات المكتوبة: `'wtc-demo-mode'`.

### useLocation

- **جاية منين؟** react-router-dom hook

- **وظيفتها:** يقرأ عنوان Router الحالي ويحدث component عند التنقل.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** location فيها pathname/search/hash وغيرها.

- **أول موضع هنا:** السطر 34.

- **مثال:** const location = useLocation();

### useReducedMotion

- **جاية منين؟** framer-motion hook

- **وظيفتها:** يقرأ تفضيل المستخدم لتقليل الحركة ويستخدم لاختيار animations أخف؛ قيمته ليست طلب تعطيل الـ UI نفسه.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** Boolean أو null في سياقات لا يتوفر فيها القياس.

- **أول موضع هنا:** السطر 35.

- **مثال:** const reduceMotion = useReducedMotion();

### useRef

- **جاية منين؟** React

- **وظيفتها:** مرجع ثابت .current للDOM أو قيمة لا تتطلب render عند تغييرها.

- **المدخلات — Arguments:** initialValue

- **الناتج/الأثر — Return / effect:** MutableRefObject

- **أول موضع هنا:** السطر 37، والمدخلات المكتوبة: `location.pathname`.

- **مثال:** const videoRef = useRef<HTMLVideoElement>(null);

### useState

- **جاية منين؟** React

- **وظيفتها:** حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة.

- **المدخلات — Arguments:** initialState

- **الناتج/الأثر — Return / effect:** [currentState,setter]

- **أول موضع هنا:** السطر 38، والمدخلات المكتوبة: `false`.

- **مثال:** const [failed, setFailed] = useState(false);

### useCallback

- **جاية منين؟** React hook

- **وظيفتها:** يثبت هوية function بين renders ما دامت dependencies ثابتة؛ لا ينفذ الدالة ولا يحفظ نتيجة API. مهم لأن loadOrders dependency للـ polling effect.

- **المدخلات — Arguments:** function, dependencies.

- **الناتج/الأثر — Return / effect:** function memoized.

- **أول موضع هنا:** السطر 40، والمدخلات المكتوبة: `() => {         setHeroReady(true);     }`، `[]`.

- **مثال:** const loadOrders = useCallback(async () => { /* actual request */ }, [user, branch, date]);

### setHeroReady

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setHeroReady هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 46، والمدخلات المكتوبة: `false`.

### useLayoutEffect

- **جاية منين؟** React hook

- **وظيفتها:** effect قبل إعادة الرسم المرئي للمتصفح؛ هنا يعيد ضبط heroReady عند الرجوع إلى Home قبل paint. لا نستخدمه بدل useEffect لكل شيء.

- **المدخلات — Arguments:** setup,dependencies.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 44، والمدخلات المكتوبة: `() => {         if (isHome && previousPath.current !== '/') {             setHeroReady(false);         }          previousPath.current = location.pathname;     }`، `[isHome, location.pathname]`.

- **مثال:** useLayoutEffect(() => { previousPath.current = location.pathname; }, [location.pathname]);

### ReactDOM.createRoot(document.getElementById('root')).render

- **جاية منين؟** React DOM

- **وظيفتها:** تطلب عرض React node داخل root.

- **المدخلات — Arguments:** شجرة JSX/React node.

- **الناتج/الأثر — Return / effect:** undefined؛ الأثر تحديث DOM.

- **أول موضع هنا:** السطر 97، والمدخلات المكتوبة: `<React.StrictMode>         <App />     </React.StrictMode>`.

### ReactDOM.createRoot

- **جاية منين؟** React DOM

- **وظيفتها:** تجهّز React root داخل عنصر DOM موجود.

- **المدخلات — Arguments:** العنصر.

- **الناتج/الأثر — Return / effect:** Root object نكمل عليها render.

- **أول موضع هنا:** السطر 97، والمدخلات المكتوبة: `document.getElementById('root')`.

### document.getElementById

- **جاية منين؟** DOM

- **وظيفتها:** تبحث عن عنصر بالـid.

- **المدخلات — Arguments:** id بدون #.

- **الناتج/الأثر — Return / effect:** Element أو null.

- **أول موضع هنا:** السطر 97، والمدخلات المكتوبة: `'root'`.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```jsx
// resources/js/app.jsx

import React, { Suspense, lazy, useCallback, useLayoutEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import './bootstrap';
```

**السطر 1:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 3:** Import / استيراد: الأسماء `React`، `Suspense`، `lazy`، `useCallback`، `useLayoutEffect`، `useRef`، `useState` جاية من `react`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 4:** Import / استيراد: الأسماء `ReactDOM` جاية من `react-dom/client`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 5:** Import / استيراد: الأسماء `BrowserRouter`، `Route`، `Routes`، `useLocation` جاية من `react-router-dom`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 6:** Import / استيراد: الأسماء `useReducedMotion` جاية من `framer-motion`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 7:** Import / استيراد: الأسماء بدون أسماء؛ تشغيل الموديول لأثره جاية من `bootstrap/dist/css/bootstrap.min.css`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 8:** Import / استيراد: الأسماء بدون أسماء؛ تشغيل الموديول لأثره جاية من `./bootstrap`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

### السطور 9–16

```jsx
import '../css/app.css';

import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import MenuPage from './Pages/MenuPage';
import Cart from './Pages/Cart';
import Login from './Pages/Auth/Login';
```

**السطر 9:** Import / استيراد: الأسماء بدون أسماء؛ تشغيل الموديول لأثره جاية من `../css/app.css`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 11:** Import / استيراد: الأسماء `Navbar` جاية من `./Components/Navbar`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 12:** Import / استيراد: الأسماء `Footer` جاية من `./Components/Footer`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 13:** Import / استيراد: الأسماء `Home` جاية من `./Pages/Home`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 14:** Import / استيراد: الأسماء `MenuPage` جاية من `./Pages/MenuPage`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 15:** Import / استيراد: الأسماء `Cart` جاية من `./Pages/Cart`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 16:** Import / استيراد: الأسماء `Login` جاية من `./Pages/Auth/Login`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

### السطور 17–24

```jsx
import Register from './Pages/Auth/Register';
import StaffDashboard from './Pages/StaffDashboard';
import OrderTracking from './Pages/OrderTracking';
import MyOrders from './Pages/MyOrders';
import AdminLayout from './Pages/Admin/AdminLayout';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AdminPanel from './Pages/Admin/AdminPanel';
import { AuthProvider } from './context/AuthContext';
```

**السطر 17:** Import / استيراد: الأسماء `Register` جاية من `./Pages/Auth/Register`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 18:** Import / استيراد: الأسماء `StaffDashboard` جاية من `./Pages/StaffDashboard`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 19:** Import / استيراد: الأسماء `OrderTracking` جاية من `./Pages/OrderTracking`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 20:** Import / استيراد: الأسماء `MyOrders` جاية من `./Pages/MyOrders`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 21:** Import / استيراد: الأسماء `AdminLayout` جاية من `./Pages/Admin/AdminLayout`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 22:** Import / استيراد: الأسماء `AdminDashboard` جاية من `./Pages/Admin/AdminDashboard`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 23:** Import / استيراد: الأسماء `AdminPanel` جاية من `./Pages/Admin/AdminPanel`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 24:** Import / استيراد: الأسماء `AuthProvider` جاية من `./context/AuthContext`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

### السطور 25–32

```jsx
import { CatalogProvider } from './context/CatalogContext';
import { OrderProvider } from './context/OrderContext';

const isDemo = import.meta.env.VITE_DEMO_MODE === 'true';
const DemoBar = isDemo ? lazy(() => import('./Components/DemoBar')) : null;
const DemoAccounts = isDemo ? lazy(() => import('./Components/DemoBar').then((module) => ({ default: module.DemoAccounts }))) : null;
if (isDemo) document.body.classList.add('wtc-demo-mode');

```

**السطر 25:** Import / استيراد: الأسماء `CatalogProvider` جاية من `./context/CatalogContext`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 26:** Import / استيراد: الأسماء `OrderProvider` جاية من `./context/OrderContext`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 28:** Variable declaration / تعريف `isDemo` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 29:** Variable declaration / تعريف `DemoBar` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `lazy(...)`: يعرّف component يتحمّل عند الحاجة عبر Promise تنتهي بموديل default؛ Suspense يرسم fallback أثناء التحميل. القيم المكتوبة هنا: `() => import('./Components/DemoBar')`. العائد/الأثر: Lazy component.؛ `import(...)`: تحمّل module ديناميكيًا وقت الحاجة. القيم المكتوبة هنا: `'./Components/DemoBar'`. العائد/الأثر: Promise لـmodule namespace؛ مش root component نفسه بدون اختيار export.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 30:** Variable declaration / تعريف `DemoAccounts` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `lazy(...)`: يعرّف component يتحمّل عند الحاجة عبر Promise تنتهي بموديل default؛ Suspense يرسم fallback أثناء التحميل. القيم المكتوبة هنا: `() => import('./Components/DemoBar').then((module) => ({ default: module.DemoAccounts }))`. العائد/الأثر: Lazy component.؛ `import('./Components/DemoBar').then(...)`: تسجّل معالجة نجاح مع إمكانية chaining. القيم المكتوبة هنا: `(module) => ({ default: module.DemoAccounts })`. العائد/الأثر: Promise جديدة بنتيجة callback.؛ `import(...)`: تحمّل module ديناميكيًا وقت الحاجة. القيم المكتوبة هنا: `'./Components/DemoBar'`. العائد/الأثر: Promise لـmodule namespace؛ مش root component نفسه بدون اختيار export.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 31:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `document.body.classList.add(...)`: تضيف قيمة Set أو كلاس إلى classList حسب المستقبِل. القيم المكتوبة هنا: `'wtc-demo-mode'`. العائد/الأثر: Set نفسها عند Set.add؛ undefined عند classList.add.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 33–40

```jsx
function AppShell() {
    const location = useLocation();
    const reduceMotion = useReducedMotion();
    const isHome = location.pathname === '/';
    const previousPath = useRef(location.pathname);
    const [heroReady, setHeroReady] = useState(false);

    const revealHero = useCallback(() => {
```

**السطر 33:** Function / تعريف دالة `AppShell`؛ تعريفها مش تشغيلها. يجمع Navbar وRoutes وFooter؛ يتحكم في إظهار الـ Navbar بعد مقدمة فيديو Home. مدخلاتها: مفيش props؛ بيقرأ useLocation وحالة heroReady. ناتجها: JSX لتخطيط الموقع ومساراته.

**السطر 34:** Variable declaration / تعريف `location` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useLocation(...)`: يقرأ عنوان Router الحالي ويحدث component عند التنقل. مدخلاتها: لا شيء. العائد/الأثر: location فيها pathname/search/hash وغيرها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 35:** Variable declaration / تعريف `reduceMotion` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useReducedMotion(...)`: يقرأ تفضيل المستخدم لتقليل الحركة ويستخدم لاختيار animations أخف؛ قيمته ليست طلب تعطيل الـ UI نفسه. مدخلاتها: لا شيء. العائد/الأثر: Boolean أو null في سياقات لا يتوفر فيها القياس.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 36:** Variable declaration / تعريف `isHome` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 37:** Variable declaration / تعريف `previousPath` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useRef(...)`: مرجع ثابت .current للDOM أو قيمة لا تتطلب render عند تغييرها. القيم المكتوبة هنا: `location.pathname`. العائد/الأثر: MutableRefObject. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 38:** Variable declaration / تعريف `heroReady + setHeroReady` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `false`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 40:** Variable declaration / تعريف `revealHero` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `revealHero` هنا: Callback بتوصل من AppShell لحد فيديو Home؛ بتغيّر heroReady إلى true مرة المحتوى يبقى جاهز للظهور. المدخلات: لا شيء.. الناتج/الأثر: undefined؛ التأثير هو setHeroReady(true).. الدوال الموجودة في السطر: `useCallback(...)`: يثبت هوية function بين renders ما دامت dependencies ثابتة؛ لا ينفذ الدالة ولا يحفظ نتيجة API. مهم لأن loadOrders dependency للـ polling effect. القيم المكتوبة هنا: `() => {         setHeroReady(true);     }`، `[]`. العائد/الأثر: function memoized.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 41–48

```jsx
        setHeroReady(true);
    }, []);

    useLayoutEffect(() => {
        if (isHome && previousPath.current !== '/') {
            setHeroReady(false);
        }

```

**السطر 41:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setHeroReady(...)`: لو setHeroReady هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `true`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 42:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 44:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useLayoutEffect(...)`: effect قبل إعادة الرسم المرئي للمتصفح؛ هنا يعيد ضبط heroReady عند الرجوع إلى Home قبل paint. لا نستخدمه بدل useEffect لكل شيء. القيم المكتوبة هنا: `() => {         if (isHome && previousPath.current !== '/') {             setHeroReady(false);         }      …`، `[isHome, location.pathname]`. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 45:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 46:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setHeroReady(...)`: لو setHeroReady هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `false`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 47:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 49–56

```jsx
        previousPath.current = location.pathname;
    }, [isHome, location.pathname]);

    return (
        <>
            <Navbar
                isVisible={!isHome || heroReady}
                reduceMotion={reduceMotion}
```

**السطر 49:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 50:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 52:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 53:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 54:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 55:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 56:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

### السطور 57–64

```jsx
                animateReveal={isHome}
            />

            <Suspense fallback={<main className="auth-page">Loading demo...</main>}>
            <Routes>
                <Route path="/" element={<Home heroReady={heroReady} onHeroReady={revealHero} reduceMotion={reduceMotion} />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/cart" element={<Cart />} />
```

**السطر 57:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 58:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 60:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 61:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 62:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها.

**السطر 63:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 64:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 65–72

```jsx
                <Route path="/login" element={isDemo ? <DemoAccounts /> : <Login />} />
                <Route path="/register" element={isDemo ? <DemoAccounts /> : <Register />} />
                <Route path="/staff" element={<StaffDashboard />} />
                <Route path="/orders" element={<MyOrders />} />
                <Route path="/orders/:token" element={<OrderTracking />} />
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path=":section" element={<AdminPanel />} />
```

**السطر 65:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 66:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 67:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 68:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 69:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 70:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 71:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 72:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 73–80

```jsx
                </Route>
            </Routes>
            </Suspense>

            <Footer />
            {isDemo && <Suspense fallback={null}><DemoBar /></Suspense>}
        </>
    );
```

**السطر 73:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 74:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 75:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 77:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 78:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 79:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 80:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 81–88

```jsx
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CatalogProvider>
                    <OrderProvider>
```

**السطر 81:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 83:** Function / تعريف دالة `App`؛ تعريفها مش تشغيلها. يوفر Router وContexts لكل الأبناء؛ ترتيب Providers مهم لأن OrderProvider بيستخدم CatalogProvider. مدخلاتها: لا شيء. ناتجها: JSX لشجرة الـ Providers حول AppShell.

**السطر 84:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 85:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 86:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 87:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 88:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 89–96

```jsx
                        <AppShell />
                    </OrderProvider>
                </CatalogProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

```

**السطر 89:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 90:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 91:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 92:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 93:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 94:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 95:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 97–102

```jsx
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

```

**السطر 97:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `ReactDOM.createRoot(document.getElementById('root')).render(...)`: تطلب عرض React node داخل root. القيم المكتوبة هنا: `<React.StrictMode>         <App />     </React.StrictMode>`. العائد/الأثر: undefined؛ الأثر تحديث DOM.؛ `ReactDOM.createRoot(...)`: تجهّز React root داخل عنصر DOM موجود. القيم المكتوبة هنا: `document.getElementById('root')`. العائد/الأثر: Root object نكمل عليها render.؛ `document.getElementById(...)`: تبحث عن عنصر بالـid. القيم المكتوبة هنا: `'root'`. العائد/الأثر: Element أو null.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 98:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 99:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 100:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 101:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
