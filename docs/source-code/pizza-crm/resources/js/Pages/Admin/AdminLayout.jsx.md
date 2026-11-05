# تخطيط الأدمن ومساراته المتداخلة

[فهرس كل الأكواد](../../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `resources/js/Pages/Admin/AdminLayout.jsx` · 32 سطر.

**وظيفة الملف:** يفحص user.role للعرض، يرسم NavLink sidebar وOutlet مكان صفحة الأدمن الفرعية. الحماية الحقيقية لكل /api/admin موجودة بالـ middleware كمان.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../../resources/js/Pages/Admin/AdminLayout.jsx). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/resources/js/context/AuthContext.jsx](../../context/AuthContext.jsx.md)

- [pizza-crm/resources/js/Pages/Admin/AdminPanel.jsx](AdminPanel.jsx.md)

- [pizza-crm/resources/js/app.jsx](../../app.jsx.md)

- [pizza-crm/routes/web.php](../../../../routes/web.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
    ['', 'Overview'],
    ['menu', 'Menu'],
    ['branches', 'Branches'],
    ['staff', 'Staff'],
    ['orders', 'Orders'],
    ['customers', 'Customers'],
    ['settings', 'Settings'],
];

export default function AdminLayout() {
    const { user, isCheckingAuth } = useAuth();
    if (isCheckingAuth) return <main className="wtc-admin-shell"><p>Checking access...</p></main>;
    if (!user || user.role !== 'admin') return <main className="wtc-admin-shell"><section className="wtc-admin-denied"><h1>Admin access required</h1><p>This area is only available to administrators.</p></section></main>;

    return (
        <main className="wtc-admin-shell">
            <style>{`
                .wtc-admin-shell{min-height:100vh;padding-top:84px;background:#0f0f0f;color:#f5f5f5}.wtc-admin-layout{display:grid;grid-template-columns:220px minmax(0,1fr);min-height:calc(100vh - 84px)}.wtc-admin-nav{position:sticky;top:84px;height:calc(100vh - 84px);padding:1.25rem .85rem;border-right:1px solid #2c2c2c;background:#151515}.wtc-admin-brand{display:block;padding:.65rem;color:#ff5252;font-size:.72rem;font-weight:950;text-transform:uppercase}.wtc-admin-nav a{display:flex;min-height:43px;align-items:center;padding:.65rem .8rem;border-radius:5px;color:#aaa;text-decoration:none;font-weight:850}.wtc-admin-nav a:hover,.wtc-admin-nav a:focus-visible{background:#222;color:#fff}.wtc-admin-nav a.active{background:#e32626;color:#fff}.wtc-admin-content{min-width:0;padding:2rem}.wtc-admin-denied{padding:8rem 1rem;text-align:center}.wtc-admin-title{font-size:clamp(2rem,4vw,3.8rem);font-weight:1000;letter-spacing:0}.wtc-admin-card{border:1px solid #303030;border-radius:8px;background:#191919}.wtc-admin-table{width:100%;border-collapse:collapse}.wtc-admin-table th,.wtc-admin-table td{padding:.75rem;border-bottom:1px solid #303030;text-align:left;vertical-align:top}.wtc-admin-table th{color:#909090;font-size:.72rem;text-transform:uppercase}.wtc-admin-input{width:100%;min-height:42px;border:1px solid #3b3b3b;border-radius:5px;padding:.6rem .7rem;background:#101010;color:#fff}.wtc-admin-input:focus{border-color:#e32626;outline:3px solid rgba(227,38,38,.16)}.wtc-admin-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.8rem}@media(max-width:900px){.wtc-admin-shell{padding-top:72px}.wtc-admin-layout{grid-template-columns:1fr}.wtc-admin-nav{position:sticky;top:72px;z-index:20;width:100%;height:auto;display:flex;gap:.35rem;overflow-x:auto;border-right:0;border-bottom:1px solid #2c2c2c;padding:.55rem}.wtc-admin-brand{display:none}.wtc-admin-nav a{flex:0 0 auto}.wtc-admin-content{padding:1rem}.wtc-admin-grid{grid-template-columns:1fr}.wtc-admin-table-wrap{overflow-x:auto}}
            `}</style>
            <div className="wtc-admin-layout">
                <nav className="wtc-admin-nav" aria-label="Admin navigation"><span className="wtc-admin-brand">Admin control</span>{links.map(([path, label]) => <NavLink key={label} end={!path} to={path}>{label}</NavLink>)}</nav>
                <section className="wtc-admin-content"><Outlet /></section>
            </div>
        </main>
    );
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### AdminLayout

يعرض checking/access denied أو إطار لوحة الإدارة.

- **بتاخد إيه؟ Inputs:** useAuth.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX مع Outlet.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### useAuth

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** Custom hook يقرأ AuthContext؛ يرمي خطأ واضح لو اتنادى خارج AuthProvider.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** object فيه user/isCheckingAuth/login/register/logout.

- **أول موضع هنا:** السطر 16.

- **تكملة التعريف:** [resources/js/context/AuthContext.jsx](../../context/AuthContext.jsx.md)، عند السطر 74.

### links.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 26، والمدخلات المكتوبة: `([path, label]) => <NavLink key={label} end={!path} to={path}>{label}</NavLink>`.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
    ['', 'Overview'],
    ['menu', 'Menu'],
    ['branches', 'Branches'],
```

**السطر 1:** Import / استيراد: الأسماء `React` جاية من `react`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 2:** Import / استيراد: الأسماء `NavLink`، `Outlet` جاية من `react-router-dom`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 3:** Import / استيراد: الأسماء `useAuth` جاية من `../../context/AuthContext`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 5:** Variable declaration / تعريف `links` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة الابتدائية Array فيها 7 عنصرًا؛ العناصر نفسها في السطور التالية.

**السطر 6:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 7:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 8:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 9–16

```jsx
    ['staff', 'Staff'],
    ['orders', 'Orders'],
    ['customers', 'Customers'],
    ['settings', 'Settings'],
];

export default function AdminLayout() {
    const { user, isCheckingAuth } = useAuth();
```

**السطر 9:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 10:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 11:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 12:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 13:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 15:** Function / تعريف دالة `AdminLayout`؛ تعريفها مش تشغيلها. يعرض checking/access denied أو إطار لوحة الإدارة. مدخلاتها: useAuth. ناتجها: JSX مع Outlet.

**السطر 16:** Variable declaration / تعريف اسم/أسماء لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useAuth(...)`: Custom hook يقرأ AuthContext؛ يرمي خطأ واضح لو اتنادى خارج AuthProvider. مدخلاتها: لا شيء. العائد/الأثر: object فيه user/isCheckingAuth/login/register/logout.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 17–24

```jsx
    if (isCheckingAuth) return <main className="wtc-admin-shell"><p>Checking access...</p></main>;
    if (!user || user.role !== 'admin') return <main className="wtc-admin-shell"><section className="wtc-admin-denied"><h1>Admin access required</h1><p>This area is only available to administrators.</p></section></main>;

    return (
        <main className="wtc-admin-shell">
            <style>{`
                .wtc-admin-shell{min-height:100vh;padding-top:84px;background:#0f0f0f;color:#f5f5f5}.wtc-admin-layout{display:grid;grid-template-columns:220px minmax(0,1fr);min-height:calc(100vh - 84px)}.wtc-admin-nav{position:sticky;top:84px;height:calc(100vh - 84px);padding:1.25rem .85rem;border-right:1px solid #2c2c2c;background:#151515}.wtc-admin-brand{display:block;padding:.65rem;color:#ff5252;font-size:.72rem;font-weight:950;text-transform:uppercase}.wtc-admin-nav a{display:flex;min-height:43px;align-items:center;padding:.65rem .8rem;border-radius:5px;color:#aaa;text-decoration:none;font-weight:850}.wtc-admin-nav a:hover,.wtc-admin-nav a:focus-visible{background:#222;color:#fff}.wtc-admin-nav a.active{background:#e32626;color:#fff}.wtc-admin-content{min-width:0;padding:2rem}.wtc-admin-denied{padding:8rem 1rem;text-align:center}.wtc-admin-title{font-size:clamp(2rem,4vw,3.8rem);font-weight:1000;letter-spacing:0}.wtc-admin-card{border:1px solid #303030;border-radius:8px;background:#191919}.wtc-admin-table{width:100%;border-collapse:collapse}.wtc-admin-table th,.wtc-admin-table td{padding:.75rem;border-bottom:1px solid #303030;text-align:left;vertical-align:top}.wtc-admin-table th{color:#909090;font-size:.72rem;text-transform:uppercase}.wtc-admin-input{width:100%;min-height:42px;border:1px solid #3b3b3b;border-radius:5px;padding:.6rem .7rem;background:#101010;color:#fff}.wtc-admin-input:focus{border-color:#e32626;outline:3px solid rgba(227,38,38,.16)}.wtc-admin-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.8rem}@media(max-width:900px){.wtc-admin-shell{padding-top:72px}.wtc-admin-layout{grid-template-columns:1fr}.wtc-admin-nav{position:sticky;top:72px;z-index:20;width:100%;height:auto;display:flex;gap:.35rem;overflow-x:auto;border-right:0;border-bottom:1px solid #2c2c2c;padding:.55rem}.wtc-admin-brand{display:none}.wtc-admin-nav a{flex:0 0 auto}.wtc-admin-content{padding:1rem}.wtc-admin-grid{grid-template-columns:1fr}.wtc-admin-table-wrap{overflow-x:auto}}
            `}</style>
```

**السطر 17:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 18:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 20:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 21:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 22:** بداية CSS / تنسيق؛ لو scoped فـVue تضيف عزلًا بالـattributes أثناء البناء.

**السطر 23:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 24:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 25–32

```jsx
            <div className="wtc-admin-layout">
                <nav className="wtc-admin-nav" aria-label="Admin navigation"><span className="wtc-admin-brand">Admin control</span>{links.map(([path, label]) => <NavLink key={label} end={!path} to={path}>{label}</NavLink>)}</nav>
                <section className="wtc-admin-content"><Outlet /></section>
            </div>
        </main>
    );
}

```

**السطر 25:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 26:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض. الدوال الموجودة في السطر: `links.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `([path, label]) => <NavLink key={label} end={!path} to={path}>{label}</NavLink>`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 27:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 28:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 29:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 30:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 31:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
