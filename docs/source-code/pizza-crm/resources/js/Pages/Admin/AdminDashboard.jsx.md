# إحصاءات الأدمن وتحويل الأرقام إلى عرض

[فهرس كل الأكواد](../../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `resources/js/Pages/Admin/AdminDashboard.jsx` · 13 سطر.

**وظيفة الملف:** يطلب /api/admin/dashboard ويعرض sales/orders/average والمبيعات حسب الفرع والأكثر مبيعًا والحالات. maxBranch يمنع قسمة على صفر في عرض أعمدة الرسم.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../../resources/js/Pages/Admin/AdminDashboard.jsx). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/resources/js/lib/api.js](../../lib/api.js.md)

- [pizza-crm/app/Http/Controllers/Api/AdminController.php](../../../../app/Http/Controllers/Api/AdminController.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```jsx
import React, { useEffect, useState } from 'react';
import { csrfFetch } from '../../lib/api';

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => { csrfFetch('/api/admin/dashboard').then(setData).catch((requestError) => setError(requestError.message)); }, []);
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!data) return <p>Loading today&apos;s numbers...</p>;
    const maxBranch = Math.max(1, ...data.by_branch.map((item) => Number(item.sales)));
    return <><header className="mb-4"><p className="eyebrow">Today</p><h1 className="wtc-admin-title">Business overview</h1></header><div className="wtc-admin-grid mb-4">{[['Sales','EGP '+Number(data.summary.sales).toFixed(2)],['Orders',data.summary.orders],['Average order','EGP '+Number(data.summary.average).toFixed(2)]].map(([label,value])=><section className="wtc-admin-card p-3" key={label}><span className="text-secondary">{label}</span><strong className="d-block fs-2">{value}</strong></section>)}</div><div className="row g-3"><div className="col-12 col-lg-7"><section className="wtc-admin-card p-3"><h2 className="h5">Sales by branch</h2>{data.by_branch.map((item)=><div className="mb-3" key={item.name}><div className="d-flex justify-content-between"><span>{item.name}</span><strong>EGP {Number(item.sales).toFixed(2)}</strong></div><div style={{height:8,background:'#303030'}}><div style={{height:'100%',width:(Number(item.sales)/maxBranch*100)+'%',background:'#e32626'}} /></div></div>)}</section></div><div className="col-12 col-lg-5"><section className="wtc-admin-card p-3"><h2 className="h5">Best sellers</h2>{data.best_items.map((item,index)=><div className="d-flex justify-content-between py-2 border-bottom border-secondary-subtle" key={item.item_name}><span>{index+1}. {item.item_name}</span><strong>{item.quantity}</strong></div>)}</section></div><div className="col-12"><section className="wtc-admin-card p-3"><h2 className="h5">Orders by status</h2><div className="d-flex flex-wrap gap-2">{Object.entries(data.by_status).map(([status,count])=><span className="badge text-bg-dark p-2 text-capitalize" key={status}>{status.replaceAll('_',' ')}: {count}</span>)}</div></section></div></div></>;
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### AdminDashboard

يجلب summary ثم يرسم cards/charts من البيانات؛ catch يظهر رسالة بدل UI ناقص.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX حسب data/error.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### useState

- **جاية منين؟** React

- **وظيفتها:** حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة.

- **المدخلات — Arguments:** initialState

- **الناتج/الأثر — Return / effect:** [currentState,setter]

- **أول موضع هنا:** السطر 6، والمدخلات المكتوبة: `''`.

- **مثال:** const [failed, setFailed] = useState(false);

### useEffect

- **جاية منين؟** React

- **وظيفتها:** يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies.

- **المدخلات — Arguments:** setup callback, dependencies

- **الناتج/الأثر — Return / effect:** undefined

- **أول موضع هنا:** السطر 7، والمدخلات المكتوبة: `() => { csrfFetch('/api/admin/dashboard').then(setData).catch((requestError) => setError(requestError.message)); }`، `[]`.

- **مثال:** useEffect(() => { window.addEventListener('resize', updateRunway); return () => window.removeEventListener('resize', updateRunway); }, []);

### csrfFetch('/api/admin/dashboard').then(setData).catch

- **جاية منين؟** Promise

- **وظيفتها:** تسجّل معالجة فشل الـPromise.

- **المدخلات — Arguments:** callback تستقبل سبب الفشل.

- **الناتج/الأثر — Return / effect:** Promise جديدة؛ عدم إعادة الرمي قد يحوّل المسار لنجاح.

- **أول موضع هنا:** السطر 7، والمدخلات المكتوبة: `(requestError) => setError(requestError.message)`.

### csrfFetch('/api/admin/dashboard').then

- **جاية منين؟** Promise

- **وظيفتها:** تسجّل معالجة نجاح مع إمكانية chaining.

- **المدخلات — Arguments:** onFulfilled وonRejected اختيارية.

- **الناتج/الأثر — Return / effect:** Promise جديدة بنتيجة callback.

- **أول موضع هنا:** السطر 7، والمدخلات المكتوبة: `setData`.

### csrfFetch

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح.

- **المدخلات — Arguments:** url: مسار API؛ options: method/body/headers وغيرها، الافتراضي {}.

- **الناتج/الأثر — Return / effect:** Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.

- **أول موضع هنا:** السطر 7، والمدخلات المكتوبة: `'/api/admin/dashboard'`.

- **تكملة التعريف:** [resources/js/lib/api.js](../../lib/api.js.md)، عند السطر 3.

### setError

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 7، والمدخلات المكتوبة: `requestError.message`.

### Math.max

- **جاية منين؟** Math / JavaScript

- **وظيفتها:** ترجع أكبر المدخلات.

- **المدخلات — Arguments:** أعداد.

- **الناتج/الأثر — Return / effect:** number.

- **أول موضع هنا:** السطر 10، والمدخلات المكتوبة: `1`، `...data.by_branch.map((item) => Number(item.sales))`.

### data.by_branch.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 11، والمدخلات المكتوبة: `(item)=><div className="mb-3" key={item.name}><div className="d-flex justify-content-between"><span>{item.name}</span><strong>EGP {Number(item.sales).toFixed(2)}</strong></div><div…`.

### Number

- **جاية منين؟** JavaScript conversion function

- **وظيفتها:** يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** number أو NaN.

- **أول موضع هنا:** السطر 11، والمدخلات المكتوبة: `item.sales`.

- **مثال:** Number(option.price);

### [['Sales','EGP '+Number(data.summary.sales).toFixed(2)],['Orders',data.summary.orders],['Average order','EGP '+Number(data.summary.average).toFixed(2)]].map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 11، والمدخلات المكتوبة: `([label,value])=><section className="wtc-admin-card p-3" key={label}><span className="text-secondary">{label}</span><strong className="d-block fs-2">{value}</strong></section>`.

### Number(data.summary.sales).toFixed

- **جاية منين؟** Number / JavaScript

- **وظيفتها:** تنسّق عددًا بمواضع عشرية محددة.

- **المدخلات — Arguments:** عدد الخانات.

- **الناتج/الأثر — Return / effect:** string، مش رقمًا صالحًا للحساب بدون تحويل.

- **أول موضع هنا:** السطر 11، والمدخلات المكتوبة: `2`.

### Number(data.summary.average).toFixed

- **جاية منين؟** Number / JavaScript

- **وظيفتها:** تنسّق عددًا بمواضع عشرية محددة.

- **المدخلات — Arguments:** عدد الخانات.

- **الناتج/الأثر — Return / effect:** string، مش رقمًا صالحًا للحساب بدون تحويل.

- **أول موضع هنا:** السطر 11، والمدخلات المكتوبة: `2`.

### Number(item.sales).toFixed

- **جاية منين؟** Number / JavaScript

- **وظيفتها:** تنسّق عددًا بمواضع عشرية محددة.

- **المدخلات — Arguments:** عدد الخانات.

- **الناتج/الأثر — Return / effect:** string، مش رقمًا صالحًا للحساب بدون تحويل.

- **أول موضع هنا:** السطر 11، والمدخلات المكتوبة: `2`.

### data.best_items.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 11، والمدخلات المكتوبة: `(item,index)=><div className="d-flex justify-content-between py-2 border-bottom border-secondary-subtle" key={item.item_name}><span>{index+1}. {item.item_name}</span><strong>{item.…`.

### Object.entries(data.by_status).map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 11، والمدخلات المكتوبة: `([status,count])=><span className="badge text-bg-dark p-2 text-capitalize" key={status}>{status.replaceAll('_',' ')}: {count}</span>`.

### Object.entries

- **جاية منين؟** JavaScript Object

- **وظيفتها:** يحوّل الخصائص الذاتية القابلة للتعداد لأزواج [key,value]؛ مفيد لبناء FormData وفلاتر URL.

- **المدخلات — Arguments:** object.

- **الناتج/الأثر — Return / effect:** array أزواج.

- **أول موضع هنا:** السطر 11، والمدخلات المكتوبة: `data.by_status`.

- **مثال:** Object.entries(form).forEach(([key, value]) => { /* append */ });

### status.replaceAll

- **جاية منين؟** String

- **وظيفتها:** تستبدل كل التطابقات بنص جديد.

- **المدخلات — Arguments:** search وreplacement.

- **الناتج/الأثر — Return / effect:** string جديدة؛ لا تعدّل الأصل.

- **أول موضع هنا:** السطر 11، والمدخلات المكتوبة: `'_'`، `' '`.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```jsx
import React, { useEffect, useState } from 'react';
import { csrfFetch } from '../../lib/api';

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    useEffect(() => { csrfFetch('/api/admin/dashboard').then(setData).catch((requestError) => setError(requestError.message)); }, []);
    if (error) return <div className="alert alert-danger">{error}</div>;
```

**السطر 1:** Import / استيراد: الأسماء `React`، `useEffect`، `useState` جاية من `react`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 2:** Import / استيراد: الأسماء `csrfFetch` جاية من `../../lib/api`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 4:** Function / تعريف دالة `AdminDashboard`؛ تعريفها مش تشغيلها. يجلب summary ثم يرسم cards/charts من البيانات؛ catch يظهر رسالة بدل UI ناقص. مدخلاتها: لا شيء. ناتجها: JSX حسب data/error.

**السطر 5:** Variable declaration / تعريف `data + setData` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `null`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 6:** Variable declaration / تعريف `error + setError` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `''`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 7:** Catch: استقبل الخطأ من try/Promise حسب السياق وتعامل مع رسالته؛ catch لا تعني نجاح الطلب الأصلي. الدوال الموجودة في السطر: `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `() => { csrfFetch('/api/admin/dashboard').then(setData).catch((requestError) => setError(requestError.message)…`، `[]`. العائد/الأثر: undefined؛ `csrfFetch('/api/admin/dashboard').then(setData).catch(...)`: تسجّل معالجة فشل الـPromise. القيم المكتوبة هنا: `(requestError) => setError(requestError.message)`. العائد/الأثر: Promise جديدة؛ عدم إعادة الرمي قد يحوّل المسار لنجاح.؛ `csrfFetch('/api/admin/dashboard').then(...)`: تسجّل معالجة نجاح مع إمكانية chaining. القيم المكتوبة هنا: `setData`. العائد/الأثر: Promise جديدة بنتيجة callback.؛ `csrfFetch(...)`: توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح. القيم المكتوبة هنا: `'/api/admin/dashboard'`. العائد/الأثر: Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.؛ `setError(...)`: لو setError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `requestError.message`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 8:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

### السطور 9–13

```jsx
    if (!data) return <p>Loading today&apos;s numbers...</p>;
    const maxBranch = Math.max(1, ...data.by_branch.map((item) => Number(item.sales)));
    return <><header className="mb-4"><p className="eyebrow">Today</p><h1 className="wtc-admin-title">Business overview</h1></header><div className="wtc-admin-grid mb-4">{[['Sales','EGP '+Number(data.summary.sales).toFixed(2)],['Orders',data.summary.orders],['Average order','EGP '+Number(data.summary.average).toFixed(2)]].map(([label,value])=><section className="wtc-admin-card p-3" key={label}><span className="text-secondary">{label}</span><strong className="d-block fs-2">{value}</strong></section>)}</div><div className="row g-3"><div className="col-12 col-lg-7"><section className="wtc-admin-card p-3"><h2 className="h5">Sales by branch</h2>{data.by_branch.map((item)=><div className="mb-3" key={item.name}><div className="d-flex justify-content-between"><span>{item.name}</span><strong>EGP {Number(item.sales).toFixed(2)}</strong></div><div style={{height:8,background:'#303030'}}><div style={{height:'100%',width:(Number(item.sales)/maxBranch*100)+'%',background:'#e32626'}} /></div></div>)}</section></div><div className="col-12 col-lg-5"><section className="wtc-admin-card p-3"><h2 className="h5">Best sellers</h2>{data.best_items.map((item,index)=><div className="d-flex justify-content-between py-2 border-bottom border-secondary-subtle" key={item.item_name}><span>{index+1}. {item.item_name}</span><strong>{item.quantity}</strong></div>)}</section></div><div className="col-12"><section className="wtc-admin-card p-3"><h2 className="h5">Orders by status</h2><div className="d-flex flex-wrap gap-2">{Object.entries(data.by_status).map(([status,count])=><span className="badge text-bg-dark p-2 text-capitalize" key={status}>{status.replaceAll('_',' ')}: {count}</span>)}</div></section></div></div></>;
}

```

**السطر 9:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 10:** Variable declaration / تعريف `maxBranch` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Math.max(...)`: ترجع أكبر المدخلات. القيم المكتوبة هنا: `1`، `...data.by_branch.map((item) => Number(item.sales))`. العائد/الأثر: number.؛ `data.by_branch.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(item) => Number(item.sales)`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `item.sales`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 11:** Return / رجّع `<><header className="mb-4"><p className="eyebrow">Today</p><h1 className="wtc-admin-title">Business overview</h1></header><div className="wtc-admin-grid mb-4">{[['Sales','EGP '+Number(data.summary.sales).toFixed(2)],['Or…` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `[['Sales','EGP '+Number(data.summary.sales).toFixed(2)],['Orders',data.summary.orders],['Average order','EGP '+Number(data.summary.average).toFixed(2)]].map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `([label,value])=><section className="wtc-admin-card p-3" key={label}><span className="text-secondary">{label}<…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `Number(data.summary.sales).toFixed(...)`: تنسّق عددًا بمواضع عشرية محددة. القيم المكتوبة هنا: `2`. العائد/الأثر: string، مش رقمًا صالحًا للحساب بدون تحويل.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `item.sales`. العائد/الأثر: number أو NaN.؛ `Number(data.summary.average).toFixed(...)`: تنسّق عددًا بمواضع عشرية محددة. القيم المكتوبة هنا: `2`. العائد/الأثر: string، مش رقمًا صالحًا للحساب بدون تحويل.؛ `data.by_branch.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(item)=><div className="mb-3" key={item.name}><div className="d-flex justify-content-between"><span>{item.name…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `Number(item.sales).toFixed(...)`: تنسّق عددًا بمواضع عشرية محددة. القيم المكتوبة هنا: `2`. العائد/الأثر: string، مش رقمًا صالحًا للحساب بدون تحويل.؛ `data.best_items.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(item,index)=><div className="d-flex justify-content-between py-2 border-bottom border-secondary-subtle" key={…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `Object.entries(data.by_status).map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `([status,count])=><span className="badge text-bg-dark p-2 text-capitalize" key={status}>{status.replaceAll('_'…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `Object.entries(...)`: يحوّل الخصائص الذاتية القابلة للتعداد لأزواج [key,value]؛ مفيد لبناء FormData وفلاتر URL. القيم المكتوبة هنا: `data.by_status`. العائد/الأثر: array أزواج.؛ `status.replaceAll(...)`: تستبدل كل التطابقات بنص جديد. القيم المكتوبة هنا: `'_'`، `' '`. العائد/الأثر: string جديدة؛ لا تعدّل الأصل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 12:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
