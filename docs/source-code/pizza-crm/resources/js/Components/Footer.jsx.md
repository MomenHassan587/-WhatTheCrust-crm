# Footer من بيانات الفروع الحقيقية

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `resources/js/Components/Footer.jsx` · 35 سطر.

**وظيفة الملف:** يعرض loading/error ثم خريطة الفروع وساعاتها وهواتفها، ويحوّل الهاتف إلى tel بعد إزالة المسافات. روابط السوشيال / حاليًا placeholders وليست روابط فعلية.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../resources/js/Components/Footer.jsx). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/resources/js/context/CatalogContext.jsx](../context/CatalogContext.jsx.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```jsx
import React from 'react';
import { useCatalog } from '../context/CatalogContext';

export default function Footer() {
    const { branches, loading, error } = useCatalog();

    return (
        <footer className="site-footer">
            <div className="container">
                <div className="site-footer-heading"><h2>Contacts<span>?</span></h2></div>
                <div className="site-footer-grid">
                    {loading && <section className="site-footer-column"><h3>Branches</h3><p>Loading locations...</p></section>}
                    {!loading && error && <section className="site-footer-column"><h3>Branches</h3><p>Locations are temporarily unavailable.</p></section>}
                    {!loading && !error && branches.map((branch) => (
                        <section className="site-footer-column" key={branch.id}>
                            <h3>{branch.name}</h3>
                            <p>{branch.location}</p>
                            <p>{branch.opening_hours || 'Opening hours coming soon'}</p>
                            {branch.phone ? <a href={`tel:${branch.phone.replace(/\s/g, '')}`}>{branch.phone}</a> : <span className="text-secondary">Phone coming soon</span>}
                        </section>
                    ))}
                    <section className="site-footer-column">
                        <h3>Email</h3>
                        <a href="mailto:hello@WhatTheCrust.com">hello@WhatTheCrust.com</a>
                    </section>
                </div>
                <div className="site-footer-bottom">
                    <span>&copy; {new Date().getFullYear()} What The Crust.</span>
                    <nav aria-label="Social links"><a href="/">Instagram</a><a href="/">Facebook</a><a href="/">TikTok</a></nav>
                </div>
            </div>
        </footer>
    );
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### Footer

يرسم بيانات التواصل من useCatalog والسنة الحالية.

- **بتاخد إيه؟ Inputs:** لا props.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX footer.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### useCatalog

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** يوصل المكوّن إلى الكتالوج المشترك؛ يفشل بوضوح لو Provider غير موجود.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** branches/categories/items/loading/error/reload.

- **أول موضع هنا:** السطر 5.

- **تكملة التعريف:** [resources/js/context/CatalogContext.jsx](../context/CatalogContext.jsx.md)، عند السطر 37.

### branches.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 14، والمدخلات المكتوبة: `(branch) => (                         <section className="site-footer-column" key={branch.id}>                             <h3>{branch.name}</h3>                             <p>{br…`.

### branch.phone.replace

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تستبدل تطابقًا أو تطابقات حسب pattern.

- **المدخلات — Arguments:** نص/regex ثم replacement.

- **الناتج/الأثر — Return / effect:** نص جديد؛ الأصل لا يتغيّر.

- **أول موضع هنا:** السطر 19، والمدخلات المكتوبة: `/\s/g`، `''`.

### new Date().getFullYear

- **جاية منين؟** Date instance

- **وظيفتها:** تقرأ السنة المحلية كاملة.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** number مثل2026.

- **أول موضع هنا:** السطر 28.

### Date

- **جاية منين؟** JavaScript Date

- **وظيفتها:** مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي.

- **المدخلات — Arguments:** قيمة تاريخ اختيارية.

- **الناتج/الأثر — Return / effect:** Date object عند new؛ مش string تلقائيًا.

- **أول موضع هنا:** السطر 28.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```jsx
import React from 'react';
import { useCatalog } from '../context/CatalogContext';

export default function Footer() {
    const { branches, loading, error } = useCatalog();

    return (
        <footer className="site-footer">
```

**السطر 1:** Import / استيراد: الأسماء `React` جاية من `react`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 2:** Import / استيراد: الأسماء `useCatalog` جاية من `../context/CatalogContext`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 4:** Function / تعريف دالة `Footer`؛ تعريفها مش تشغيلها. يرسم بيانات التواصل من useCatalog والسنة الحالية. مدخلاتها: لا props. ناتجها: JSX footer.

**السطر 5:** Variable declaration / تعريف اسم/أسماء لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useCatalog(...)`: يوصل المكوّن إلى الكتالوج المشترك؛ يفشل بوضوح لو Provider غير موجود. مدخلاتها: لا شيء. العائد/الأثر: branches/categories/items/loading/error/reload.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 7:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 8:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 9–16

```jsx
            <div className="container">
                <div className="site-footer-heading"><h2>Contacts<span>?</span></h2></div>
                <div className="site-footer-grid">
                    {loading && <section className="site-footer-column"><h3>Branches</h3><p>Loading locations...</p></section>}
                    {!loading && error && <section className="site-footer-column"><h3>Branches</h3><p>Locations are temporarily unavailable.</p></section>}
                    {!loading && !error && branches.map((branch) => (
                        <section className="site-footer-column" key={branch.id}>
                            <h3>{branch.name}</h3>
```

**السطر 9:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 10:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 11:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 12:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 13:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 14:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `branches.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(branch) => (                         <section className="site-footer-column" key={branch.id}>                …`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 15:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 16:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 17–24

```jsx
                            <p>{branch.location}</p>
                            <p>{branch.opening_hours || 'Opening hours coming soon'}</p>
                            {branch.phone ? <a href={`tel:${branch.phone.replace(/\s/g, '')}`}>{branch.phone}</a> : <span className="text-secondary">Phone coming soon</span>}
                        </section>
                    ))}
                    <section className="site-footer-column">
                        <h3>Email</h3>
                        <a href="mailto:hello@WhatTheCrust.com">hello@WhatTheCrust.com</a>
```

**السطر 17:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 18:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 19:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `branch.phone.replace(...)`: تستبدل تطابقًا أو تطابقات حسب pattern. القيم المكتوبة هنا: `/\s/g`، `''`. العائد/الأثر: نص جديد؛ الأصل لا يتغيّر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 20:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 21:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 22:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 23:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 24:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 25–32

```jsx
                    </section>
                </div>
                <div className="site-footer-bottom">
                    <span>&copy; {new Date().getFullYear()} What The Crust.</span>
                    <nav aria-label="Social links"><a href="/">Instagram</a><a href="/">Facebook</a><a href="/">TikTok</a></nav>
                </div>
            </div>
        </footer>
```

**السطر 25:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 26:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 27:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 28:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض. الدوال الموجودة في السطر: `new Date().getFullYear(...)`: تقرأ السنة المحلية كاملة. مدخلاتها: بدون arguments. العائد/الأثر: number مثل2026.؛ `Date(...)`: مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي. مدخلاتها: قيمة تاريخ اختيارية. العائد/الأثر: Date object عند new؛ مش string تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 29:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 30:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 31:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 32:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 33–35

```jsx
    );
}

```

**السطر 33:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 34:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
