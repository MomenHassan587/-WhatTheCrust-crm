# تحميل الكتالوج مرة ومشاركته مع الصفحات

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `resources/js/context/CatalogContext.jsx` · 48 سطر.

**وظيفة الملف:** يطلب /api/menu ويوفر branches/categories/items مع loading/error/reload. Navbar/Footer/Menu/Cart/Home بياخدوا نفس الكتالوج بدل عمل API منفصل لكل مكوّن.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../resources/js/context/CatalogContext.jsx). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/resources/js/lib/api.js](../lib/api.js.md)

- [pizza-crm/app/Http/Controllers/Api/MenuController.php](../../../app/Http/Controllers/Api/MenuController.php.md)

- [pizza-crm/resources/js/app.jsx](../app.jsx.md)

- [pizza-crm/resources/js/Pages/MenuPage.jsx](../Pages/MenuPage.jsx.md)

- [pizza-crm/resources/js/context/OrderContext.jsx](OrderContext.jsx.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```jsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { csrfFetch } from '../lib/api';

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
    const [catalog, setCatalog] = useState({ branches: [], categories: [], items: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const reload = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await csrfFetch('/api/menu');
            setCatalog({
                branches: response.branches || [],
                categories: response.categories || [],
                items: response.items || [],
            });
        } catch (requestError) {
            setError(requestError.message || 'The menu could not be loaded.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        reload();
    }, [reload]);

    const value = useMemo(() => ({ ...catalog, loading, error, reload }), [catalog, loading, error, reload]);

    return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
    const context = useContext(CatalogContext);
    if (!context) {
        throw new Error('useCatalog must be used inside CatalogProvider.');
    }
    return context;
}

export function branchOption(item, branchId) {
    return item?.branch_options?.find((option) => Number(option.branch_id) === Number(branchId)) || null;
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### CatalogProvider

يمسك نتيجة الكتالوج ويشغّل reload أول التركيب ويشاركها مع الأبناء.

- **بتاخد إيه؟ Inputs:** children.

- **بترجع/بتغيّر إيه؟ Return / effect:** CatalogContext.Provider.

### reload

يفعّل loading ويفضّي error، يجلب /api/menu، يحفظ arrays حتى لو الرد ناقص، وينهي loading في finally.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<void>؛ الخطأ يتحول إلى state بدل الخروج للمستدعي.

### useCatalog

يوصل المكوّن إلى الكتالوج المشترك؛ يفشل بوضوح لو Provider غير موجود.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** branches/categories/items/loading/error/reload.

### branchOption

يبحث عن سعر وتوفر منتج في فرع بعينه. السعر مش ثابت في item نفسه؛ مصدره branch_options.

- **بتاخد إيه؟ Inputs:** item: المنتج وقد يكون undefined؛ branchId: رقم أو نص معرّف الفرع.

- **بترجع/بتغيّر إيه؟ Return / effect:** object خيار الفرع أو null؛ Number يوحّد نوع المعرّفات قبل المقارنة.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### createContext

- **جاية منين؟** React API

- **وظيفتها:** ينشئ قناة مشاركة بيانات للأبناء؛ إنشاء السياق لا يخزن بيانات وحده، الـ Provider يمرر value.

- **المدخلات — Arguments:** defaultValue.

- **الناتج/الأثر — Return / effect:** Context object.

- **أول موضع هنا:** السطر 4، والمدخلات المكتوبة: `null`.

- **مثال:** const OrderContext = createContext(null);

### useState

- **جاية منين؟** React

- **وظيفتها:** حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة.

- **المدخلات — Arguments:** initialState

- **الناتج/الأثر — Return / effect:** [currentState,setter]

- **أول موضع هنا:** السطر 9، والمدخلات المكتوبة: `''`.

- **مثال:** const [failed, setFailed] = useState(false);

### useCallback

- **جاية منين؟** React hook

- **وظيفتها:** يثبت هوية function بين renders ما دامت dependencies ثابتة؛ لا ينفذ الدالة ولا يحفظ نتيجة API. مهم لأن loadOrders dependency للـ polling effect.

- **المدخلات — Arguments:** function, dependencies.

- **الناتج/الأثر — Return / effect:** function memoized.

- **أول موضع هنا:** السطر 11، والمدخلات المكتوبة: `async () => {         setLoading(true);         setError('');         try {             const response = await csrfFetch('/api/menu');             setCatalog({                 bran…`، `[]`.

- **مثال:** const loadOrders = useCallback(async () => { /* actual request */ }, [user, branch, date]);

### setLoading

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setLoading هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 24، والمدخلات المكتوبة: `false`.

### setError

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 22، والمدخلات المكتوبة: `requestError.message || 'The menu could not be loaded.'`.

### csrfFetch

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح.

- **المدخلات — Arguments:** url: مسار API؛ options: method/body/headers وغيرها، الافتراضي {}.

- **الناتج/الأثر — Return / effect:** Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.

- **أول موضع هنا:** السطر 15، والمدخلات المكتوبة: `'/api/menu'`.

- **تكملة التعريف:** [resources/js/lib/api.js](../lib/api.js.md)، عند السطر 3.

### setCatalog

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setCatalog هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 16، والمدخلات المكتوبة: `{                 branches: response.branches || [],                 categories: response.categories || [],                 items: response.items || [],             }`.

### useEffect

- **جاية منين؟** React

- **وظيفتها:** يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies.

- **المدخلات — Arguments:** setup callback, dependencies

- **الناتج/الأثر — Return / effect:** undefined

- **أول موضع هنا:** السطر 28، والمدخلات المكتوبة: `() => {         reload();     }`، `[reload]`.

- **مثال:** useEffect(() => { window.addEventListener('resize', updateRunway); return () => window.removeEventListener('resize', updateRunway); }, []);

### reload

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يفعّل loading ويفضّي error، يجلب /api/menu، يحفظ arrays حتى لو الرد ناقص، وينهي loading في finally.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** Promise<void>؛ الخطأ يتحول إلى state بدل الخروج للمستدعي.

- **أول موضع هنا:** السطر 29.

### useMemo

- **جاية منين؟** React hook

- **وظيفتها:** يحفظ نتيجة حساب كتحسين أداء لحد تغير dependencies؛ callback للحساب مش مكان HTTP أو setState side effects.

- **المدخلات — Arguments:** calculate function,dependencies.

- **الناتج/الأثر — Return / effect:** القيمة المحسوبة.

- **أول موضع هنا:** السطر 32، والمدخلات المكتوبة: `() => ({ ...catalog, loading, error, reload })`، `[catalog, loading, error, reload]`.

- **مثال:** const completedOrders = useMemo(() => orders.filter((order) => order.status === 'completed'), [orders]);

### useContext

- **جاية منين؟** React hook

- **وظيفتها:** يقرأ أقرب Provider لنفس Context ويشترك في تغيّر قيمته.

- **المدخلات — Arguments:** Context object.

- **الناتج/الأثر — Return / effect:** value الحالية أو default لو لا Provider.

- **أول موضع هنا:** السطر 38، والمدخلات المكتوبة: `CatalogContext`.

- **مثال:** const context = useContext(OrderContext);

### Error

- **جاية منين؟** JavaScript

- **وظيفتها:** تنشئ object خطأ برسالة؛ الرمي يحتاج throw منفصلة.

- **المدخلات — Arguments:** message وخيارات اختيارية.

- **الناتج/الأثر — Return / effect:** Error object.

- **أول موضع هنا:** السطر 40، والمدخلات المكتوبة: `'useCatalog must be used inside CatalogProvider.'`.

### item?.branch_options?.find

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تبحث بالترتيب حتى أول callback truthy.

- **المدخلات — Arguments:** callback تستقبل العنصر وindex والقائمة.

- **الناتج/الأثر — Return / effect:** العنصر المطابق نفسه أو undefined؛ ليست array نتائج.

- **أول موضع هنا:** السطر 46، والمدخلات المكتوبة: `(option) => Number(option.branch_id) === Number(branchId)`.

### Number

- **جاية منين؟** JavaScript conversion function

- **وظيفتها:** يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** number أو NaN.

- **أول موضع هنا:** السطر 46، والمدخلات المكتوبة: `branchId`.

- **مثال:** Number(option.price);

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```jsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { csrfFetch } from '../lib/api';

const CatalogContext = createContext(null);

export function CatalogProvider({ children }) {
    const [catalog, setCatalog] = useState({ branches: [], categories: [], items: [] });
    const [loading, setLoading] = useState(true);
```

**السطر 1:** Import / استيراد: الأسماء `React`، `createContext`، `useCallback`، `useContext`، `useEffect`، `useMemo`، `useState` جاية من `react`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 2:** Import / استيراد: الأسماء `csrfFetch` جاية من `../lib/api`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 4:** Variable declaration / تعريف `CatalogContext` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `createContext(...)`: ينشئ قناة مشاركة بيانات للأبناء؛ إنشاء السياق لا يخزن بيانات وحده، الـ Provider يمرر value. القيم المكتوبة هنا: `null`. العائد/الأثر: Context object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 6:** Function / تعريف دالة `CatalogProvider`؛ تعريفها مش تشغيلها. يمسك نتيجة الكتالوج ويشغّل reload أول التركيب ويشاركها مع الأبناء. مدخلاتها: children. ناتجها: CatalogContext.Provider.

**السطر 7:** Variable declaration / تعريف `catalog + setCatalog` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `{ branches: [], categories: [], items: [] }`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 8:** Variable declaration / تعريف `loading + setLoading` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `true`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 9–16

```jsx
    const [error, setError] = useState('');

    const reload = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await csrfFetch('/api/menu');
            setCatalog({
```

**السطر 9:** Variable declaration / تعريف `error + setError` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `''`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 11:** Variable declaration / تعريف `reload` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `reload` هنا: يفعّل loading ويفضّي error، يجلب /api/menu، يحفظ arrays حتى لو الرد ناقص، وينهي loading في finally. المدخلات: لا شيء.. الناتج/الأثر: Promise<void>؛ الخطأ يتحول إلى state بدل الخروج للمستدعي.. الدوال الموجودة في السطر: `useCallback(...)`: يثبت هوية function بين renders ما دامت dependencies ثابتة؛ لا ينفذ الدالة ولا يحفظ نتيجة API. مهم لأن loadOrders dependency للـ polling effect. القيم المكتوبة هنا: `async () => {         setLoading(true);         setError('');         try {             const response = await…`، `[]`. العائد/الأثر: function memoized.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 12:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setLoading(...)`: لو setLoading هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `true`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 13:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setError(...)`: لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `''`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 14:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة.

**السطر 15:** Variable declaration / تعريف `response` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `csrfFetch(...)`: توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح. القيم المكتوبة هنا: `'/api/menu'`. العائد/الأثر: Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 16:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setCatalog(...)`: لو setCatalog هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `{                 branches: response.branches || [],                 categories: response.categories || [],   …`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 17–24

```jsx
                branches: response.branches || [],
                categories: response.categories || [],
                items: response.items || [],
            });
        } catch (requestError) {
            setError(requestError.message || 'The menu could not be loaded.');
        } finally {
            setLoading(false);
```

**السطر 17:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 18:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 19:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 20:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 21:** Catch: استقبل الخطأ من try/Promise حسب السياق وتعامل مع رسالته؛ catch لا تعني نجاح الطلب الأصلي.

**السطر 22:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setError(...)`: لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `requestError.message || 'The menu could not be loaded.'`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 23:** Finally: تنظيف/إرجاع حالة الانشغال بعد try سواء نجحت أو فشلت.

**السطر 24:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setLoading(...)`: لو setLoading هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `false`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 25–32

```jsx
        }
    }, []);

    useEffect(() => {
        reload();
    }, [reload]);

    const value = useMemo(() => ({ ...catalog, loading, error, reload }), [catalog, loading, error, reload]);
```

**السطر 25:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 26:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 28:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `() => {         reload();     }`، `[reload]`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 29:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `reload(...)`: يفعّل loading ويفضّي error، يجلب /api/menu، يحفظ arrays حتى لو الرد ناقص، وينهي loading في finally. مدخلاتها: لا شيء. العائد/الأثر: Promise<void>؛ الخطأ يتحول إلى state بدل الخروج للمستدعي.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 30:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 32:** Variable declaration / تعريف `value` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useMemo(...)`: يحفظ نتيجة حساب كتحسين أداء لحد تغير dependencies؛ callback للحساب مش مكان HTTP أو setState side effects. القيم المكتوبة هنا: `() => ({ ...catalog, loading, error, reload })`، `[catalog, loading, error, reload]`. العائد/الأثر: القيمة المحسوبة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 33–40

```jsx

    return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
    const context = useContext(CatalogContext);
    if (!context) {
        throw new Error('useCatalog must be used inside CatalogProvider.');
```

**السطر 34:** Return / رجّع `<CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 35:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 37:** Function / تعريف دالة `useCatalog`؛ تعريفها مش تشغيلها. يوصل المكوّن إلى الكتالوج المشترك؛ يفشل بوضوح لو Provider غير موجود. مدخلاتها: لا شيء. ناتجها: branches/categories/items/loading/error/reload.

**السطر 38:** Variable declaration / تعريف `context` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useContext(...)`: يقرأ أقرب Provider لنفس Context ويشترك في تغيّر قيمته. القيم المكتوبة هنا: `CatalogContext`. العائد/الأثر: value الحالية أو default لو لا Provider.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 39:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 40:** Throw / ارمِ خطأ وأوقف المسار الحالي؛ الدالة async تتحول Promise الخاصة بها إلى rejected لو لم يُمسك الخطأ داخلها. الدوال الموجودة في السطر: `Error(...)`: تنشئ object خطأ برسالة؛ الرمي يحتاج throw منفصلة. القيم المكتوبة هنا: `'useCatalog must be used inside CatalogProvider.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 41–48

```jsx
    }
    return context;
}

export function branchOption(item, branchId) {
    return item?.branch_options?.find((option) => Number(option.branch_id) === Number(branchId)) || null;
}

```

**السطر 41:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 42:** Return / رجّع `context` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 43:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 45:** Function / تعريف دالة `branchOption`؛ تعريفها مش تشغيلها. يبحث عن سعر وتوفر منتج في فرع بعينه. السعر مش ثابت في item نفسه؛ مصدره branch_options. مدخلاتها: item: المنتج وقد يكون undefined؛ branchId: رقم أو نص معرّف الفرع. ناتجها: object خيار الفرع أو null؛ Number يوحّد نوع المعرّفات قبل المقارنة.

**السطر 46:** Return / رجّع `item?.branch_options?.find((option) => Number(option.branch_id) === Number(branchId)) || null` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `item?.branch_options?.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(option) => Number(option.branch_id) === Number(branchId)`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `branchId`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 47:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
