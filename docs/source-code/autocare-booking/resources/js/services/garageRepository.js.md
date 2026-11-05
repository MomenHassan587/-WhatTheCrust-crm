# قراءة وكتابة بيانات الجراج في المتصفح

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `autocare-booking` · الملف: `resources/js/services/garageRepository.js` · 16 سطر.

**وظيفة الملف:** ده storage adapter للديمو فقط. write مش API وread مش SQL؛ كل البيانات بتفضل على نفس المتصفح ونفس origin.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../../autocare-booking/resources/js/services/garageRepository.js). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [autocare-booking/resources/js/composables/useGarage.js](../composables/useGarage.js.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```js
// Browser-only demo adapter. Replace these methods with authenticated API calls.
const STORAGE_KEY = 'autocare.demo.garage.v1';
export const garageRepository = {
    read() {
        try {
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (data?.version === 1 && Array.isArray(data.vehicles) && Array.isArray(data.appointments) && Array.isArray(data.history)) return data;
        } catch { /* An unavailable or invalid store falls back to the demo seed. */ }
        return null;
    },
    write(data) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); return true; }
        catch { return false; }
    },
};
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### STORAGE_KEY

اسم الخانة اللي شايلة JSON بتاع الديمو، فيه v1 علشان نسخة الشكل.

- **بتاخد إيه؟ Inputs:** لا شيء

- **بترجع/بتغيّر إيه؟ Return / effect:** string ثابت

### read

يحاول يفك JSON ويتأكد من version والقوائم؛ يرجّع null لو التخزين مقفول أو البيانات تالفة أو شكلها غير متوقع.

- **بتاخد إيه؟ Inputs:** لا توجد parameters

- **بترجع/بتغيّر إيه؟ Return / effect:** object صالح للحد الأدنى من الفحص أو null

### write

يحوّل state إلى JSON ويكتبها في localStorage، ويرجّع نجاح أو فشل بدل ما يقع التطبيق.

- **بتاخد إيه؟ Inputs:** data: state object

- **بترجع/بتغيّر إيه؟ Return / effect:** true عند الكتابة؛ false عند خطأ التخزين

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### JSON.parse

- **جاية منين؟** JavaScript

- **وظيفتها:** يفك JSON string لقيم JS؛ ممكن يرمي SyntaxError ولا يعتبر validation كامل.

- **المدخلات — Arguments:** JSON string

- **الناتج/الأثر — Return / effect:** JS value

- **أول موضع هنا:** السطر 6، والمدخلات المكتوبة: `localStorage.getItem(STORAGE_KEY)`.

- **مثال:** const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

### localStorage.getItem

- **جاية منين؟** Browser localStorage/sessionStorage

- **وظيفتها:** تقرأ النص المحفوظ تحت مفتاح.

- **المدخلات — Arguments:** اسم المفتاح.

- **الناتج/الأثر — Return / effect:** string أو null؛ لا تعيد object تلقائيًا.

- **أول موضع هنا:** السطر 6، والمدخلات المكتوبة: `STORAGE_KEY`.

### Array.isArray

- **جاية منين؟** Array static

- **وظيفتها:** تفحص هل القيمة Array.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** Boolean؛ object يشبه قائمة مش بالضرورة Array.

- **أول موضع هنا:** السطر 7، والمدخلات المكتوبة: `data.history`.

### localStorage.setItem

- **جاية منين؟** Browser localStorage/sessionStorage

- **وظيفتها:** تحفظ قيمة نصية تحت مفتاح وتستبدل القديمة.

- **المدخلات — Arguments:** key وvalue.

- **الناتج/الأثر — Return / effect:** undefined؛ قد تفشل لو التخزين غير متاح.

- **أول موضع هنا:** السطر 12، والمدخلات المكتوبة: `STORAGE_KEY`، `JSON.stringify(data)`.

### JSON.stringify

- **جاية منين؟** JavaScript

- **وظيفتها:** يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions.

- **المدخلات — Arguments:** value

- **الناتج/الأثر — Return / effect:** string أو undefined لبعض القيم

- **أول موضع هنا:** السطر 12، والمدخلات المكتوبة: `data`.

- **مثال:** localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```js
// Browser-only demo adapter. Replace these methods with authenticated API calls.
const STORAGE_KEY = 'autocare.demo.garage.v1';
export const garageRepository = {
    read() {
        try {
            const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (data?.version === 1 && Array.isArray(data.vehicles) && Array.isArray(data.appointments) && Array.isArray(data.history)) return data;
        } catch { /* An unavailable or invalid store falls back to the demo seed. */ }
```

**السطر 1:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 2:** Variable declaration / تعريف `STORAGE_KEY` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `"autocare.demo.garage.v1"`، مش ناتج طلب شبكة. دور `STORAGE_KEY` هنا: اسم الخانة اللي شايلة JSON بتاع الديمو، فيه v1 علشان نسخة الشكل. المدخلات: لا شيء. الناتج/الأثر: string ثابت.

**السطر 3:** Variable declaration / تعريف `garageRepository` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة Object حقولها `read`، `write`.

**السطر 4:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 5:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة.

**السطر 6:** Variable declaration / تعريف `data` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `JSON.parse(...)`: يفك JSON string لقيم JS؛ ممكن يرمي SyntaxError ولا يعتبر validation كامل. القيم المكتوبة هنا: `localStorage.getItem(STORAGE_KEY)`. العائد/الأثر: JS value؛ `localStorage.getItem(...)`: تقرأ النص المحفوظ تحت مفتاح. القيم المكتوبة هنا: `STORAGE_KEY`. العائد/الأثر: string أو null؛ لا تعيد object تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 7:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `Array.isArray(...)`: تفحص هل القيمة Array. القيم المكتوبة هنا: `data.history`. العائد/الأثر: Boolean؛ object يشبه قائمة مش بالضرورة Array.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 8:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 9–16

```js
        return null;
    },
    write(data) {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); return true; }
        catch { return false; }
    },
};

```

**السطر 9:** Return / رجّع `null` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 10:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 11:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 12:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة. الدوال الموجودة في السطر: `localStorage.setItem(...)`: تحفظ قيمة نصية تحت مفتاح وتستبدل القديمة. القيم المكتوبة هنا: `STORAGE_KEY`، `JSON.stringify(data)`. العائد/الأثر: undefined؛ قد تفشل لو التخزين غير متاح.؛ `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `data`. العائد/الأثر: string أو undefined لبعض القيم. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 13:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 14:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 15:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
