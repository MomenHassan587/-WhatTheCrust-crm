# وسيط كل طلبات الشبكة — csrfFetch

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `resources/js/lib/api.js` · 47 سطر.

**وظيفة الملف:** دالة المشروع اللي الواجهات بتناديها بدل fetch المباشر. تضيف headers وCSRF وcookies، تفك JSON، وتحوّل HTTP errors إلى exceptions. في VITE_DEMO_MODE بتفوض demoFetch بدل أي اتصال Laravel.

**نوعه:** support. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../resources/js/lib/api.js). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/resources/js/demo/api.js](../demo/api.js.md)

- [pizza-crm/routes/web.php](../../../routes/web.php.md)

- [pizza-crm/resources/views/app.blade.php](../../views/app.blade.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```js
// resources/js/lib/api.js

export async function csrfFetch(url, options = {}) {
    if (import.meta.env.VITE_DEMO_MODE === 'true') {
        const { demoFetch } = await import('../demo/api');
        return demoFetch(url, options);
    }
    const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');

    const isFormData = options.body instanceof FormData;
    const headers = {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
    };

    if (csrfToken) {
        headers['X-CSRF-TOKEN'] = csrfToken;
    }

    const response = await fetch(url, {
        credentials: 'same-origin',
        ...options,
        headers,
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const payload = isJson ? await response.json() : null;

    if (payload?.csrf_token) {
        document.querySelector('meta[name="csrf-token"]')?.setAttribute('content', payload.csrf_token);
    }

    if (!response.ok) {
        const message = payload?.message || 'Something went wrong. Please try again.';
        const error = new Error(message);
        error.payload = payload;
        throw error;
    }

    return payload;
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### csrfFetch

توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح.

- **بتاخد إيه؟ Inputs:** url: مسار API؛ options: method/body/headers وغيرها، الافتراضي {}.

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### import

- **جاية منين؟** JavaScript modules

- **وظيفتها:** تحمّل module ديناميكيًا وقت الحاجة.

- **المدخلات — Arguments:** مسار module.

- **الناتج/الأثر — Return / effect:** Promise لـmodule namespace؛ مش root component نفسه بدون اختيار export.

- **أول موضع هنا:** السطر 5، والمدخلات المكتوبة: `'../demo/api'`.

### demoFetch

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** Router محلي يختار من url/method ويطبق منطق API demo ثم يرجع data مباشرة. لا يرجع Response مثل fetch، ولا يجري network request.

- **المدخلات — Arguments:** url,options={}؛ body JSON أو FormData.

- **الناتج/الأثر — Return / effect:** Promise<payload> أو rejection بخطأ demo.

- **أول موضع هنا:** السطر 6، والمدخلات المكتوبة: `url`، `options`.

- **تكملة التعريف:** [resources/js/demo/api.js](../demo/api.js.md)، عند السطر 114.

### document         .querySelector('meta[name="csrf-token"]')         ?.getAttribute

- **جاية منين؟** DOM Element

- **وظيفتها:** تقرأ attribute من العنصر.

- **المدخلات — Arguments:** اسم attribute.

- **الناتج/الأثر — Return / effect:** string أو null.

- **أول موضع هنا:** السطر 8، والمدخلات المكتوبة: `'content'`.

### document         .querySelector

- **جاية منين؟** DOM

- **وظيفتها:** تبحث عن أول عنصر يطابق CSS selector.

- **المدخلات — Arguments:** selector.

- **الناتج/الأثر — Return / effect:** Element أو null.

- **أول موضع هنا:** السطر 8، والمدخلات المكتوبة: `'meta[name="csrf-token"]'`.

### fetch

- **جاية منين؟** Browser

- **وظيفتها:** يبعت HTTP request ويرجع Promise لاستجابة؛ status404 لا يرفض Promise تلقائيًا ولذلك نفحص response.ok.

- **المدخلات — Arguments:** URL,options مثل cache/signal

- **الناتج/الأثر — Return / effect:** Promise<Response>

- **أول موضع هنا:** السطر 24، والمدخلات المكتوبة: `url`، `{         credentials: 'same-origin',         ...options,         headers,     }`.

- **مثال:** const response = await fetch('/assets/story/manifest.json', {cache:'no-cache'});

### response.headers.get

- **جاية منين؟** Fetch Headers

- **وظيفتها:** تقرأ قيمة HTTP header.

- **المدخلات — Arguments:** اسم header.

- **الناتج/الأثر — Return / effect:** string أو null.

- **أول موضع هنا:** السطر 30، والمدخلات المكتوبة: `'content-type'`.

### contentType.includes

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تختبر وجود قيمة في array أو نص داخل string.

- **المدخلات — Arguments:** القيمة/النص المطلوب.

- **الناتج/الأثر — Return / effect:** Boolean؛ مش العنصر ولا موقعه.

- **أول موضع هنا:** السطر 31، والمدخلات المكتوبة: `'application/json'`.

### response.json

- **جاية منين؟** Browser Fetch Response

- **وظيفتها:** يقرأ body ويفك JSON بصورة async؛ ممكن يفشل لو المحتوى مش JSON.

- **المدخلات — Arguments:** لا شيء

- **الناتج/الأثر — Return / effect:** Promise<JS value>

- **أول موضع هنا:** السطر 32.

- **مثال:** manifest = await response.json();

### document.querySelector('meta[name="csrf-token"]')?.setAttribute

- **جاية منين؟** DOM Element

- **وظيفتها:** تضيف أو تغيّر attribute.

- **المدخلات — Arguments:** الاسم والقيمة.

- **الناتج/الأثر — Return / effect:** undefined؛ لا تعيد العنصر.

- **أول موضع هنا:** السطر 35، والمدخلات المكتوبة: `'content'`، `payload.csrf_token`.

### document.querySelector

- **جاية منين؟** DOM

- **وظيفتها:** تبحث عن أول عنصر يطابق CSS selector.

- **المدخلات — Arguments:** selector.

- **الناتج/الأثر — Return / effect:** Element أو null.

- **أول موضع هنا:** السطر 35، والمدخلات المكتوبة: `'meta[name="csrf-token"]'`.

### Error

- **جاية منين؟** JavaScript

- **وظيفتها:** تنشئ object خطأ برسالة؛ الرمي يحتاج throw منفصلة.

- **المدخلات — Arguments:** message وخيارات اختيارية.

- **الناتج/الأثر — Return / effect:** Error object.

- **أول موضع هنا:** السطر 40، والمدخلات المكتوبة: `message`.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```js
// resources/js/lib/api.js

export async function csrfFetch(url, options = {}) {
    if (import.meta.env.VITE_DEMO_MODE === 'true') {
        const { demoFetch } = await import('../demo/api');
        return demoFetch(url, options);
    }
    const csrfToken = document
```

**السطر 1:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 3:** Function / تعريف دالة `csrfFetch`؛ تعريفها مش تشغيلها. توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح. مدخلاتها: url: مسار API؛ options: method/body/headers وغيرها، الافتراضي {}. ناتجها: Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.

**السطر 4:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 5:** Variable declaration / تعريف اسم/أسماء لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `import(...)`: تحمّل module ديناميكيًا وقت الحاجة. القيم المكتوبة هنا: `'../demo/api'`. العائد/الأثر: Promise لـmodule namespace؛ مش root component نفسه بدون اختيار export.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 6:** Return / رجّع `demoFetch(url, options)` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `demoFetch(...)`: Router محلي يختار من url/method ويطبق منطق API demo ثم يرجع data مباشرة. لا يرجع Response مثل fetch، ولا يجري network request. القيم المكتوبة هنا: `url`، `options`. العائد/الأثر: Promise<payload> أو rejection بخطأ demo.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 7:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 8:** Variable declaration / تعريف `csrfToken` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `document         .querySelector('meta[name="csrf-token"]')         ?.getAttribute(...)`: تقرأ attribute من العنصر. القيم المكتوبة هنا: `'content'`. العائد/الأثر: string أو null.؛ `document         .querySelector(...)`: تبحث عن أول عنصر يطابق CSS selector. القيم المكتوبة هنا: `'meta[name="csrf-token"]'`. العائد/الأثر: Element أو null.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 9–16

```js
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');

    const isFormData = options.body instanceof FormData;
    const headers = {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
```

**السطر 9:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 10:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 12:** Variable declaration / تعريف `isFormData` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 13:** Variable declaration / تعريف `headers` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة Object حقولها `Accept`، `X-Requested-With`.

**السطر 14:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 15:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 16:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 17–24

```js
        ...options.headers,
    };

    if (csrfToken) {
        headers['X-CSRF-TOKEN'] = csrfToken;
    }

    const response = await fetch(url, {
```

**السطر 17:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 18:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 20:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 21:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 22:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 24:** Variable declaration / تعريف `response` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `fetch(...)`: يبعت HTTP request ويرجع Promise لاستجابة؛ status404 لا يرفض Promise تلقائيًا ولذلك نفحص response.ok. القيم المكتوبة هنا: `url`، `{         credentials: 'same-origin',         ...options,         headers,     }`. العائد/الأثر: Promise<Response>. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 25–32

```js
        credentials: 'same-origin',
        ...options,
        headers,
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const payload = isJson ? await response.json() : null;
```

**السطر 25:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 26:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 27:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 28:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 30:** Variable declaration / تعريف `contentType` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `response.headers.get(...)`: تقرأ قيمة HTTP header. القيم المكتوبة هنا: `'content-type'`. العائد/الأثر: string أو null.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 31:** Variable declaration / تعريف `isJson` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `contentType.includes(...)`: تختبر وجود قيمة في array أو نص داخل string. القيم المكتوبة هنا: `'application/json'`. العائد/الأثر: Boolean؛ مش العنصر ولا موقعه.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 32:** Variable declaration / تعريف `payload` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `response.json(...)`: يقرأ body ويفك JSON بصورة async؛ ممكن يفشل لو المحتوى مش JSON. مدخلاتها: لا شيء العائد/الأثر: Promise<JS value>. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 33–40

```js

    if (payload?.csrf_token) {
        document.querySelector('meta[name="csrf-token"]')?.setAttribute('content', payload.csrf_token);
    }

    if (!response.ok) {
        const message = payload?.message || 'Something went wrong. Please try again.';
        const error = new Error(message);
```

**السطر 34:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 35:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `document.querySelector('meta[name="csrf-token"]')?.setAttribute(...)`: تضيف أو تغيّر attribute. القيم المكتوبة هنا: `'content'`، `payload.csrf_token`. العائد/الأثر: undefined؛ لا تعيد العنصر.؛ `document.querySelector(...)`: تبحث عن أول عنصر يطابق CSS selector. القيم المكتوبة هنا: `'meta[name="csrf-token"]'`. العائد/الأثر: Element أو null.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 36:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 38:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 39:** Variable declaration / تعريف `message` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 40:** Variable declaration / تعريف `error` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Error(...)`: تنشئ object خطأ برسالة؛ الرمي يحتاج throw منفصلة. القيم المكتوبة هنا: `message`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 41–47

```js
        error.payload = payload;
        throw error;
    }

    return payload;
}

```

**السطر 41:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 42:** Throw / ارمِ خطأ وأوقف المسار الحالي؛ الدالة async تتحول Promise الخاصة بها إلى rejected لو لم يُمسك الخطأ داخلها.

**السطر 43:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 45:** Return / رجّع `payload` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 46:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
