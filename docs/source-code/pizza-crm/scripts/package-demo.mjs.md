# scripts/package-demo.mjs

[فهرس كل الأكواد](../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `scripts/package-demo.mjs` · 30 سطر.

**وظيفة الملف:** ملف مصدر كامل من المشروع. استخدم الروابط والتعريفات أدناه لتتبّع المدخلات والتنفيذ والناتج؛ لا تلصق أجزاءه فوق ملف مختلف بدون سياق.

**نوعه:** source / مصدر. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../scripts/package-demo.mjs). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```js
import { cp, writeFile, readdir, stat, readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const destination = path.resolve('dist-demo');
const catalog = JSON.parse(await readFile('resources/js/demo/catalog.json', 'utf8'));
const assets = new Set(['images/logo.png', 'videos/hero-pizza-motion.mp4']);
for (const item of catalog.items) {
    if (item.image_path) assets.add(item.image_path.replace(/^\//, ''));
}
for (const asset of assets) {
    const source = path.resolve('public', asset);
    const target = path.resolve(destination, asset);
    if (!source.startsWith(path.resolve('public') + path.sep) || !target.startsWith(destination + path.sep)) {
        throw new Error('Invalid demo asset path: ' + asset);
    }
    await mkdir(path.dirname(target), { recursive: true });
    await cp(source, target);
}
await writeFile(path.join(destination, '_redirects'), '/* /index.html 200\n');
await writeFile(path.join(destination, '_headers'), '/*\n  X-Robots-Tag: noindex, nofollow\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n');
async function checkFiles(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
        const target = path.join(directory, entry.name);
        if (entry.isDirectory()) await checkFiles(target);
        else if ((await stat(target)).size > 25 * 1024 * 1024) throw new Error('Cloudflare file limit exceeded: ' + target);
    }
}
await checkFiles(destination);
console.log('Upload dist-demo to Cloudflare Pages. PHP, .env, and database files are excluded.');
```

</details>

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### path.resolve

- **جاية منين؟** Promise executor callback

- **وظيفتها:** تحسم العملية بالقيمة/الـthenable الممررة.

- **المدخلات — Arguments:** القيمة.

- **الناتج/الأثر — Return / effect:** undefined من callback نفسها؛ الأثر حسم Promise.

- **أول موضع هنا:** السطر 13، والمدخلات المكتوبة: `'public'`.

### JSON.parse

- **جاية منين؟** JavaScript

- **وظيفتها:** يفك JSON string لقيم JS؛ ممكن يرمي SyntaxError ولا يعتبر validation كامل.

- **المدخلات — Arguments:** JSON string

- **الناتج/الأثر — Return / effect:** JS value

- **أول موضع هنا:** السطر 5، والمدخلات المكتوبة: `await readFile('resources/js/demo/catalog.json', 'utf8')`.

- **مثال:** const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

### readFile

- **جاية منين؟** Node fs/promises

- **وظيفتها:** تقرأ محتوى ملف.

- **المدخلات — Arguments:** path وencoding/options.

- **الناتج/الأثر — Return / effect:** Promise لـBuffer أو string عند encoding؛ قراءة مش تنفيذ.

- **أول موضع هنا:** السطر 5، والمدخلات المكتوبة: `'resources/js/demo/catalog.json'`، `'utf8'`.

### Set

- **جاية منين؟** JavaScript

- **وظيفتها:** تنشئ مجموعة قيم فريدة.

- **المدخلات — Arguments:** iterable اختيارية.

- **الناتج/الأثر — Return / effect:** Set instance، مش array.

- **أول موضع هنا:** السطر 6، والمدخلات المكتوبة: `['images/logo.png', 'videos/hero-pizza-motion.mp4']`.

### assets.add

- **جاية منين؟** Set أو DOMTokenList

- **وظيفتها:** تضيف قيمة Set أو كلاس إلى classList حسب المستقبِل.

- **المدخلات — Arguments:** القيمة أو اسم الكلاس.

- **الناتج/الأثر — Return / effect:** Set نفسها عند Set.add؛ undefined عند classList.add.

- **أول موضع هنا:** السطر 8، والمدخلات المكتوبة: `item.image_path.replace(/^\//, '')`.

### item.image_path.replace

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تستبدل تطابقًا أو تطابقات حسب pattern.

- **المدخلات — Arguments:** نص/regex ثم replacement.

- **الناتج/الأثر — Return / effect:** نص جديد؛ الأصل لا يتغيّر.

- **أول موضع هنا:** السطر 8، والمدخلات المكتوبة: `/^\//`، `''`.

### source.startsWith

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تفحص بداية النص.

- **المدخلات — Arguments:** prefix وموضع اختياري.

- **الناتج/الأثر — Return / effect:** Boolean؛ لا تتحقق من وجود ملف.

- **أول موضع هنا:** السطر 13، والمدخلات المكتوبة: `path.resolve('public') + path.sep`.

### target.startsWith

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تفحص بداية النص.

- **المدخلات — Arguments:** prefix وموضع اختياري.

- **الناتج/الأثر — Return / effect:** Boolean؛ لا تتحقق من وجود ملف.

- **أول موضع هنا:** السطر 13، والمدخلات المكتوبة: `destination + path.sep`.

### Error

- **جاية منين؟** JavaScript

- **وظيفتها:** تنشئ object خطأ برسالة؛ الرمي يحتاج throw منفصلة.

- **المدخلات — Arguments:** message وخيارات اختيارية.

- **الناتج/الأثر — Return / effect:** Error object.

- **أول موضع هنا:** السطر 25، والمدخلات المكتوبة: `'Cloudflare file limit exceeded: ' + target`.

### mkdir

- **جاية منين؟** Node fs/promises

- **وظيفتها:** تنشئ directory وآباءه عند recursive.

- **المدخلات — Arguments:** path وoptions.

- **الناتج/الأثر — Return / effect:** Promise؛ لا يكتب كود application.

- **أول موضع هنا:** السطر 16، والمدخلات المكتوبة: `path.dirname(target)`، `{ recursive: true }`.

### path.dirname

- **جاية منين؟** Node path

- **وظيفتها:** ترجع مسار المجلد الأب.

- **المدخلات — Arguments:** path.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 16، والمدخلات المكتوبة: `target`.

### cp

- **جاية منين؟** Node fs/promises

- **وظيفتها:** تنسخ ملفًا/شجرة حسب الخيارات.

- **المدخلات — Arguments:** source وdestination وoptions.

- **الناتج/الأثر — Return / effect:** Promise؛ لا يعني نشرًا على Cloudflare.

- **أول موضع هنا:** السطر 17، والمدخلات المكتوبة: `source`، `target`.

### writeFile

- **جاية منين؟** Node fs/promises

- **وظيفتها:** تكتب/تستبدل محتوى ملف.

- **المدخلات — Arguments:** path وdata وخيارات.

- **الناتج/الأثر — Return / effect:** Promise بلا بيانات عند النجاح؛ تعديل filesystem.

- **أول موضع هنا:** السطر 20، والمدخلات المكتوبة: `path.join(destination, '_headers')`، `'/*\n  X-Robots-Tag: noindex, nofollow\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n'`.

### path.join

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تجمع عناصر في نص.

- **المدخلات — Arguments:** separator اختياري.

- **الناتج/الأثر — Return / effect:** string، لا تعدّل عناصر الأصل.

- **أول موضع هنا:** السطر 23، والمدخلات المكتوبة: `directory`، `entry.name`.

### readdir

- **جاية منين؟** Node fs/promises

- **وظيفتها:** تقرأ مداخل directory.

- **المدخلات — Arguments:** path وoptions مثل withFileTypes.

- **الناتج/الأثر — Return / effect:** Promise لقائمة أسماء/Dirent.

- **أول موضع هنا:** السطر 22، والمدخلات المكتوبة: `directory`، `{ withFileTypes: true }`.

### entry.isDirectory

- **جاية منين؟** Node Dirent/Stats

- **وظيفتها:** تحدد هل المدخل directory.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** Boolean.

- **أول موضع هنا:** السطر 24.

### checkFiles

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** تنفّذ الجزء المعرّف باسم checkFiles في نفس الملف؛ التعريف كامل تحت مع شرح سطوره.

- **المدخلات — Arguments:** directory

- **الناتج/الأثر — Return / effect:** ارجع لسطر return في تعريف الدالة؛ لو مفيش return قيمة فالناتج المعتاد undefined في JavaScript.

- **أول موضع هنا:** السطر 28، والمدخلات المكتوبة: `destination`.

### stat

- **جاية منين؟** Node fs/promises

- **وظيفتها:** تقرأ معلومات ملف.

- **المدخلات — Arguments:** path.

- **الناتج/الأثر — Return / effect:** Promise لـStats فيها size وغيرها؛ لا تقرأ body.

- **أول موضع هنا:** السطر 25، والمدخلات المكتوبة: `target`.

### console.log

- **جاية منين؟** Console

- **وظيفتها:** تعرض قيمة للفحص في Console.

- **المدخلات — Arguments:** قيمة أو عدة قيم.

- **الناتج/الأثر — Return / effect:** undefined؛ لا تبني واجهة HTML.

- **أول موضع هنا:** السطر 29، والمدخلات المكتوبة: `'Upload dist-demo to Cloudflare Pages. PHP, .env, and database files are excluded.'`.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```js
import { cp, writeFile, readdir, stat, readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const destination = path.resolve('dist-demo');
const catalog = JSON.parse(await readFile('resources/js/demo/catalog.json', 'utf8'));
const assets = new Set(['images/logo.png', 'videos/hero-pizza-motion.mp4']);
for (const item of catalog.items) {
    if (item.image_path) assets.add(item.image_path.replace(/^\//, ''));
```

**السطر 1:** Import / استيراد: الأسماء `cp`، `writeFile`، `readdir`، `stat`، `readFile`، `mkdir` جاية من `node:fs/promises`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 2:** Import / استيراد: الأسماء `path` جاية من `node:path`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 4:** Variable declaration / تعريف `destination` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `path.resolve(...)`: تحسم العملية بالقيمة/الـthenable الممررة. القيم المكتوبة هنا: `'dist-demo'`. العائد/الأثر: undefined من callback نفسها؛ الأثر حسم Promise.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 5:** Variable declaration / تعريف `catalog` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `JSON.parse(...)`: يفك JSON string لقيم JS؛ ممكن يرمي SyntaxError ولا يعتبر validation كامل. القيم المكتوبة هنا: `await readFile('resources/js/demo/catalog.json', 'utf8')`. العائد/الأثر: JS value؛ `readFile(...)`: تقرأ محتوى ملف. القيم المكتوبة هنا: `'resources/js/demo/catalog.json'`، `'utf8'`. العائد/الأثر: Promise لـBuffer أو string عند encoding؛ قراءة مش تنفيذ.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 6:** Variable declaration / تعريف `assets` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Set(...)`: تنشئ مجموعة قيم فريدة. القيم المكتوبة هنا: `['images/logo.png', 'videos/hero-pizza-motion.mp4']`. العائد/الأثر: Set instance، مش array.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 7:** Variable declaration / تعريف `item` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 8:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `assets.add(...)`: تضيف قيمة Set أو كلاس إلى classList حسب المستقبِل. القيم المكتوبة هنا: `item.image_path.replace(/^\//, '')`. العائد/الأثر: Set نفسها عند Set.add؛ undefined عند classList.add.؛ `item.image_path.replace(...)`: تستبدل تطابقًا أو تطابقات حسب pattern. القيم المكتوبة هنا: `/^\//`، `''`. العائد/الأثر: نص جديد؛ الأصل لا يتغيّر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 9–16

```js
}
for (const asset of assets) {
    const source = path.resolve('public', asset);
    const target = path.resolve(destination, asset);
    if (!source.startsWith(path.resolve('public') + path.sep) || !target.startsWith(destination + path.sep)) {
        throw new Error('Invalid demo asset path: ' + asset);
    }
    await mkdir(path.dirname(target), { recursive: true });
```

**السطر 9:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 10:** Variable declaration / تعريف `asset` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 11:** Variable declaration / تعريف `source` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `path.resolve(...)`: تحسم العملية بالقيمة/الـthenable الممررة. القيم المكتوبة هنا: `'public'`، `asset`. العائد/الأثر: undefined من callback نفسها؛ الأثر حسم Promise.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 12:** Variable declaration / تعريف `target` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `path.resolve(...)`: تحسم العملية بالقيمة/الـthenable الممررة. القيم المكتوبة هنا: `destination`، `asset`. العائد/الأثر: undefined من callback نفسها؛ الأثر حسم Promise.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 13:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `source.startsWith(...)`: تفحص بداية النص. القيم المكتوبة هنا: `path.resolve('public') + path.sep`. العائد/الأثر: Boolean؛ لا تتحقق من وجود ملف.؛ `path.resolve(...)`: تحسم العملية بالقيمة/الـthenable الممررة. القيم المكتوبة هنا: `'public'`. العائد/الأثر: undefined من callback نفسها؛ الأثر حسم Promise.؛ `target.startsWith(...)`: تفحص بداية النص. القيم المكتوبة هنا: `destination + path.sep`. العائد/الأثر: Boolean؛ لا تتحقق من وجود ملف.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 14:** Throw / ارمِ خطأ وأوقف المسار الحالي؛ الدالة async تتحول Promise الخاصة بها إلى rejected لو لم يُمسك الخطأ داخلها. الدوال الموجودة في السطر: `Error(...)`: تنشئ object خطأ برسالة؛ الرمي يحتاج throw منفصلة. القيم المكتوبة هنا: `'Invalid demo asset path: ' + asset`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 15:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 16:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `mkdir(...)`: تنشئ directory وآباءه عند recursive. القيم المكتوبة هنا: `path.dirname(target)`، `{ recursive: true }`. العائد/الأثر: Promise؛ لا يكتب كود application.؛ `path.dirname(...)`: ترجع مسار المجلد الأب. القيم المكتوبة هنا: `target`. العائد/الأثر: string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 17–24

```js
    await cp(source, target);
}
await writeFile(path.join(destination, '_redirects'), '/* /index.html 200\n');
await writeFile(path.join(destination, '_headers'), '/*\n  X-Robots-Tag: noindex, nofollow\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n');
async function checkFiles(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
        const target = path.join(directory, entry.name);
        if (entry.isDirectory()) await checkFiles(target);
```

**السطر 17:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `cp(...)`: تنسخ ملفًا/شجرة حسب الخيارات. القيم المكتوبة هنا: `source`، `target`. العائد/الأثر: Promise؛ لا يعني نشرًا على Cloudflare.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 18:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 19:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `writeFile(...)`: تكتب/تستبدل محتوى ملف. القيم المكتوبة هنا: `path.join(destination, '_redirects')`، `'/* /index.html 200\n'`. العائد/الأثر: Promise بلا بيانات عند النجاح؛ تعديل filesystem.؛ `path.join(...)`: تجمع عناصر في نص. القيم المكتوبة هنا: `destination`، `'_redirects'`. العائد/الأثر: string، لا تعدّل عناصر الأصل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 20:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `writeFile(...)`: تكتب/تستبدل محتوى ملف. القيم المكتوبة هنا: `path.join(destination, '_headers')`، `'/*\n  X-Robots-Tag: noindex, nofollow\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-wh…`. العائد/الأثر: Promise بلا بيانات عند النجاح؛ تعديل filesystem.؛ `path.join(...)`: تجمع عناصر في نص. القيم المكتوبة هنا: `destination`، `'_headers'`. العائد/الأثر: string، لا تعدّل عناصر الأصل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 21:** Function / تعريف دالة `checkFiles`؛ تعريفها مش تشغيلها. اللي بين الأقواس parameters، والجسم التالي هو خطواتها.  

**السطر 22:** Variable declaration / تعريف `entry` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `readdir(...)`: تقرأ مداخل directory. القيم المكتوبة هنا: `directory`، `{ withFileTypes: true }`. العائد/الأثر: Promise لقائمة أسماء/Dirent.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 23:** Variable declaration / تعريف `target` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `path.join(...)`: تجمع عناصر في نص. القيم المكتوبة هنا: `directory`، `entry.name`. العائد/الأثر: string، لا تعدّل عناصر الأصل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 24:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `entry.isDirectory(...)`: تحدد هل المدخل directory. مدخلاتها: بدون arguments. العائد/الأثر: Boolean.؛ `checkFiles(...)`: تنفّذ الجزء المعرّف باسم checkFiles في نفس الملف؛ التعريف كامل تحت مع شرح سطوره. القيم المكتوبة هنا: `target`. العائد/الأثر: ارجع لسطر return في تعريف الدالة؛ لو مفيش return قيمة فالناتج المعتاد undefined في JavaScript.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 25–30

```js
        else if ((await stat(target)).size > 25 * 1024 * 1024) throw new Error('Cloudflare file limit exceeded: ' + target);
    }
}
await checkFiles(destination);
console.log('Upload dist-demo to Cloudflare Pages. PHP, .env, and database files are excluded.');

```

**السطر 25:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `stat(...)`: تقرأ معلومات ملف. القيم المكتوبة هنا: `target`. العائد/الأثر: Promise لـStats فيها size وغيرها؛ لا تقرأ body.؛ `Error(...)`: تنشئ object خطأ برسالة؛ الرمي يحتاج throw منفصلة. القيم المكتوبة هنا: `'Cloudflare file limit exceeded: ' + target`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 26:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 27:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 28:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `checkFiles(...)`: تنفّذ الجزء المعرّف باسم checkFiles في نفس الملف؛ التعريف كامل تحت مع شرح سطوره. القيم المكتوبة هنا: `destination`. العائد/الأثر: ارجع لسطر return في تعريف الدالة؛ لو مفيش return قيمة فالناتج المعتاد undefined في JavaScript.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 29:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `console.log(...)`: تعرض قيمة للفحص في Console. القيم المكتوبة هنا: `'Upload dist-demo to Cloudflare Pages. PHP, .env, and database files are excluded.'`. العائد/الأثر: undefined؛ لا تبني واجهة HTML.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
