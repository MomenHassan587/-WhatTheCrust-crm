# scripts/build-cloudflare.mjs

[فهرس كل الأكواد](../../../16-all-project-source.md)

المشروع: `autocare-booking` · الملف: `scripts/build-cloudflare.mjs` · 63 سطر.

**وظيفة الملف:** ملف مصدر كامل من المشروع. استخدم الروابط والتعريفات أدناه لتتبّع المدخلات والتنفيذ والناتج؛ لا تلصق أجزاءه فوق ملف مختلف بدون سياق.

**نوعه:** source / مصدر. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../autocare-booking/scripts/build-cloudflare.mjs). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```js
import { build } from 'vite';
import { cp, readdir, readFile, stat, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist-cloudflare');
await build({ configFile: path.join(root, 'vite.cloudflare.config.js') });
const source = path.join(root, 'public');

// Explicit allowlist: no Laravel code, .env, vendor, database, logs or raw videos.
for (const folder of ['assets/photos', 'assets/story/frames', 'assets/story/frames-sm']) {
    await cp(path.join(source, folder), path.join(output, folder), { recursive: true });
}
for (const file of ['assets/story/manifest.json', 'assets/story/poster.webp', 'assets/story/last-frame.webp', 'favicon.ico']) {
    await cp(path.join(source, file), path.join(output, file));
}
// Pages serves clean URLs from matching HTML files. This avoids rewrite loops.
const indexHtml = await readFile(path.join(output, 'index.html'), 'utf8');
await writeFile(path.join(output, 'my-garage.html'), indexHtml
    .replace('<title>AutoCare Pro | Car care, with clarity</title>', '<title>My Garage | AutoCare Pro</title>')
    .replace('</head>', '<meta name="robots" content="noindex,follow"></head>'));
await writeFile(path.join(output, '_headers'), [
    '/*',
    '  X-Content-Type-Options: nosniff',
    '  Referrer-Policy: strict-origin-when-cross-origin',
    '  Permissions-Policy: camera=(), microphone=(), geolocation=()',
    '  X-Frame-Options: SAMEORIGIN',
    '/app/*',
    '  Cache-Control: public, max-age=31536000, immutable',
    '/assets/story/frames/*',
    '  Cache-Control: public, max-age=86400',
    '/assets/story/frames-sm/*',
    '  Cache-Control: public, max-age=86400',
    '/assets/photos/*',
    '  Cache-Control: public, max-age=86400',
    '',
].join('\n'));

// Check the complete sequence and enforce the Pages per-file size limit.
const manifest = JSON.parse(await readFile(path.join(output, 'assets/story/manifest.json'), 'utf8'));
for (const set of [manifest.desktop, manifest.mobile]) {
    for (let index = 1; index <= set.count; index++) {
        const file = set.path.replace(/^\//, '').replace('%04d', String(index).padStart(4, '0'));
        await stat(path.join(output, file));
    }
}
async function inventory(folder) {
    const entries = await readdir(folder, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const fullPath = path.join(folder, entry.name);
        if (entry.isDirectory()) files.push(...await inventory(fullPath));
        else files.push({ path: path.relative(output, fullPath), bytes: (await stat(fullPath)).size });
    }
    return files;
}
const files = await inventory(output);
if (files.some(file => file.bytes > 25 * 1024 * 1024)) throw new Error('A deployment asset exceeds the Cloudflare Pages 25 MiB limit.');
if (files.some(file => /(^|[\\/])(\.env|source|database|vendor|node_modules)([.\\/]|$)|\.(php|mp4|log|map)$/i.test(file.path))) throw new Error('Unexpected private/source file found in the deployment output.');
console.log(`Cloudflare bundle ready: ${files.length} public files, ${(files.reduce((sum,file)=>sum+file.bytes,0)/1e6).toFixed(2)} MB.`);
console.log(`Frame sequences verified: ${manifest.desktop.count} desktop, ${manifest.mobile.count} mobile. Output: ${output}`);
```

</details>

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### fileURLToPath

- **جاية منين؟** Node URL

- **وظيفتها:** تحوّل file URL لمسار filesystem مناسب للنظام.

- **المدخلات — Arguments:** file URL.

- **الناتج/الأثر — Return / effect:** path string؛ لا تقرأ الملف.

- **أول موضع هنا:** السطر 6، والمدخلات المكتوبة: `new URL('../', import.meta.url)`.

### URL

- **جاية منين؟** Browser/Node URL

- **وظيفتها:** تحلل عنوانًا وتجهز حقوله.

- **المدخلات — Arguments:** عنوان وbase اختياري.

- **الناتج/الأثر — Return / effect:** URL object، ولا تجلب المورد وحدها.

- **أول موضع هنا:** السطر 6، والمدخلات المكتوبة: `'../'`، `import.meta.url`.

### path.join

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تجمع عناصر في نص.

- **المدخلات — Arguments:** separator اختياري.

- **الناتج/الأثر — Return / effect:** string، لا تعدّل عناصر الأصل.

- **أول موضع هنا:** السطر 52، والمدخلات المكتوبة: `folder`، `entry.name`.

### build

- **جاية منين؟** Vite

- **وظيفتها:** تبدأ frontend production build بالإعدادات.

- **المدخلات — Arguments:** options/configFile.

- **الناتج/الأثر — Return / effect:** Promise لنتيجة build؛ الأثر ملفات artifacts.

- **أول موضع هنا:** السطر 8، والمدخلات المكتوبة: `{ configFile: path.join(root, 'vite.cloudflare.config.js') }`.

### cp

- **جاية منين؟** Node fs/promises

- **وظيفتها:** تنسخ ملفًا/شجرة حسب الخيارات.

- **المدخلات — Arguments:** source وdestination وoptions.

- **الناتج/الأثر — Return / effect:** Promise؛ لا يعني نشرًا على Cloudflare.

- **أول موضع هنا:** السطر 16، والمدخلات المكتوبة: `path.join(source, file)`، `path.join(output, file)`.

### readFile

- **جاية منين؟** Node fs/promises

- **وظيفتها:** تقرأ محتوى ملف.

- **المدخلات — Arguments:** path وencoding/options.

- **الناتج/الأثر — Return / effect:** Promise لـBuffer أو string عند encoding؛ قراءة مش تنفيذ.

- **أول موضع هنا:** السطر 41، والمدخلات المكتوبة: `path.join(output, 'assets/story/manifest.json')`، `'utf8'`.

### writeFile

- **جاية منين؟** Node fs/promises

- **وظيفتها:** تكتب/تستبدل محتوى ملف.

- **المدخلات — Arguments:** path وdata وخيارات.

- **الناتج/الأثر — Return / effect:** Promise بلا بيانات عند النجاح؛ تعديل filesystem.

- **أول موضع هنا:** السطر 23، والمدخلات المكتوبة: `path.join(output, '_headers')`، `[     '/*',     '  X-Content-Type-Options: nosniff',     '  Referrer-Policy: strict-origin-when-cross-origin',     '  Permissions-Policy: camera=(), microphone=(), geolocation=()',…`.

### indexHtml     .replace('<title>AutoCare Pro | Car care, with clarity</title>', '<title>My Garage | AutoCare Pro</title>')     .replace

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تستبدل تطابقًا أو تطابقات حسب pattern.

- **المدخلات — Arguments:** نص/regex ثم replacement.

- **الناتج/الأثر — Return / effect:** نص جديد؛ الأصل لا يتغيّر.

- **أول موضع هنا:** السطر 20، والمدخلات المكتوبة: `'</head>'`، `'<meta name="robots" content="noindex,follow"></head>'`.

### indexHtml     .replace

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تستبدل تطابقًا أو تطابقات حسب pattern.

- **المدخلات — Arguments:** نص/regex ثم replacement.

- **الناتج/الأثر — Return / effect:** نص جديد؛ الأصل لا يتغيّر.

- **أول موضع هنا:** السطر 20، والمدخلات المكتوبة: `'<title>AutoCare Pro | Car care, with clarity</title>'`، `'<title>My Garage | AutoCare Pro</title>'`.

### [     '/*',     '  X-Content-Type-Options: nosniff',     '  Referrer-Policy: strict-origin-when-cross-origin',     '  Permissions-Policy: camera=(), microphone=(), geolocation=()',     '  X-Frame-Options: SAMEORIGIN',     '/app/*',     '  Cache-Control: public, max-age=31536000, immutable',     '/assets/story/frames/*',     '  Cache-Control: public, max-age=86400',     '/assets/story/frames-sm/*',     '  Cache-Control: public, max-age=86400',     '/assets/photos/*',     '  Cache-Control: public, max-age=86400',     '', ].join

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تجمع عناصر في نص.

- **المدخلات — Arguments:** separator اختياري.

- **الناتج/الأثر — Return / effect:** string، لا تعدّل عناصر الأصل.

- **أول موضع هنا:** السطر 23، والمدخلات المكتوبة: `'\n'`.

### JSON.parse

- **جاية منين؟** JavaScript

- **وظيفتها:** يفك JSON string لقيم JS؛ ممكن يرمي SyntaxError ولا يعتبر validation كامل.

- **المدخلات — Arguments:** JSON string

- **الناتج/الأثر — Return / effect:** JS value

- **أول موضع هنا:** السطر 41، والمدخلات المكتوبة: `await readFile(path.join(output, 'assets/story/manifest.json'), 'utf8')`.

- **مثال:** const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

### set.path.replace(/^\//, '').replace

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تستبدل تطابقًا أو تطابقات حسب pattern.

- **المدخلات — Arguments:** نص/regex ثم replacement.

- **الناتج/الأثر — Return / effect:** نص جديد؛ الأصل لا يتغيّر.

- **أول موضع هنا:** السطر 44، والمدخلات المكتوبة: `'%04d'`، `String(index).padStart(4, '0')`.

### set.path.replace

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تستبدل تطابقًا أو تطابقات حسب pattern.

- **المدخلات — Arguments:** نص/regex ثم replacement.

- **الناتج/الأثر — Return / effect:** نص جديد؛ الأصل لا يتغيّر.

- **أول موضع هنا:** السطر 44، والمدخلات المكتوبة: `/^\//`، `''`.

### String(index).padStart

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تضيف padding لبداية النص حتى طول محدد.

- **المدخلات — Arguments:** targetLength وpadString.

- **الناتج/الأثر — Return / effect:** نص جديد.

- **أول موضع هنا:** السطر 44، والمدخلات المكتوبة: `4`، `'0'`.

### String

- **جاية منين؟** JavaScript

- **وظيفتها:** تحوّل قيمة إلى نص عند استدعائها بدون new.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 44، والمدخلات المكتوبة: `index`.

### stat

- **جاية منين؟** Node fs/promises

- **وظيفتها:** تقرأ معلومات ملف.

- **المدخلات — Arguments:** path.

- **الناتج/الأثر — Return / effect:** Promise لـStats فيها size وغيرها؛ لا تقرأ body.

- **أول موضع هنا:** السطر 54، والمدخلات المكتوبة: `fullPath`.

### readdir

- **جاية منين؟** Node fs/promises

- **وظيفتها:** تقرأ مداخل directory.

- **المدخلات — Arguments:** path وoptions مثل withFileTypes.

- **الناتج/الأثر — Return / effect:** Promise لقائمة أسماء/Dirent.

- **أول موضع هنا:** السطر 49، والمدخلات المكتوبة: `folder`، `{ withFileTypes: true }`.

### entry.isDirectory

- **جاية منين؟** Node Dirent/Stats

- **وظيفتها:** تحدد هل المدخل directory.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** Boolean.

- **أول موضع هنا:** السطر 53.

### files.push

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تضيف عناصر في آخر array الأصلية.

- **المدخلات — Arguments:** العناصر المطلوبة.

- **الناتج/الأثر — Return / effect:** الطول الجديد؛ تعدّل الأصل.

- **أول موضع هنا:** السطر 54، والمدخلات المكتوبة: `{ path: path.relative(output, fullPath), bytes: (await stat(fullPath)).size }`.

### inventory

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** تنفّذ الجزء المعرّف باسم inventory في نفس الملف؛ التعريف كامل تحت مع شرح سطوره.

- **المدخلات — Arguments:** folder

- **الناتج/الأثر — Return / effect:** ارجع لسطر return في تعريف الدالة؛ لو مفيش return قيمة فالناتج المعتاد undefined في JavaScript.

- **أول موضع هنا:** السطر 58، والمدخلات المكتوبة: `output`.

### path.relative

- **جاية منين؟** Node path

- **وظيفتها:** تحسب المسار النسبي بين مسارين.

- **المدخلات — Arguments:** from وto.

- **الناتج/الأثر — Return / effect:** string؛ لا تنقل الملف.

- **أول موضع هنا:** السطر 54، والمدخلات المكتوبة: `output`، `fullPath`.

### files.some

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تفحص هل أي عنصر يحقق الشرط وتتوقف عند أول نجاح.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** Boolean.

- **أول موضع هنا:** السطر 60، والمدخلات المكتوبة: `file => /(^|[\\/])(\.env|source|database|vendor|node_modules)([.\\/]|$)|\.(php|mp4|log|map)$/i.test(file.path)`.

### Error

- **جاية منين؟** JavaScript

- **وظيفتها:** تنشئ object خطأ برسالة؛ الرمي يحتاج throw منفصلة.

- **المدخلات — Arguments:** message وخيارات اختيارية.

- **الناتج/الأثر — Return / effect:** Error object.

- **أول موضع هنا:** السطر 60، والمدخلات المكتوبة: `'Unexpected private/source file found in the deployment output.'`.

### /(^|[\\/])(\.env|source|database|vendor|node_modules)([.\\/]|$)|\.(php|mp4|log|map)$/i.test

- **جاية منين؟** RegExp أو Node test حسب المستقبِل

- **وظيفتها:** RegExp.test تفحص تطابق النص؛ Node test يسجل اختبارًا.

- **المدخلات — Arguments:** نص للـregex، أو اسم وcallback للاختبار.

- **الناتج/الأثر — Return / effect:** Boolean في regex؛ نتيجة تسجيل اختبار في Node.

- **أول موضع هنا:** السطر 60، والمدخلات المكتوبة: `file.path`.

### console.log

- **جاية منين؟** Console

- **وظيفتها:** تعرض قيمة للفحص في Console.

- **المدخلات — Arguments:** قيمة أو عدة قيم.

- **الناتج/الأثر — Return / effect:** undefined؛ لا تبني واجهة HTML.

- **أول موضع هنا:** السطر 62، والمدخلات المكتوبة: `'Frame sequences verified: ${manifest.desktop.count} desktop, ${manifest.mobile.count} mobile. Output: ${output}'`.

### (files.reduce((sum,file)=>sum+file.bytes,0)/1e6).toFixed

- **جاية منين؟** Number / JavaScript

- **وظيفتها:** تنسّق عددًا بمواضع عشرية محددة.

- **المدخلات — Arguments:** عدد الخانات.

- **الناتج/الأثر — Return / effect:** string، مش رقمًا صالحًا للحساب بدون تحويل.

- **أول موضع هنا:** السطر 61، والمدخلات المكتوبة: `2`.

### files.reduce

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تجمع عناصر في نتيجة متراكمة.

- **المدخلات — Arguments:** callback(accumulator, item) وقيمة بداية اختيارية.

- **الناتج/الأثر — Return / effect:** الناتج النهائي؛ سلة فاضية مع البداية0 ترجع0.

- **أول موضع هنا:** السطر 61، والمدخلات المكتوبة: `(sum,file)=>sum+file.bytes`، `0`.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```js
import { build } from 'vite';
import { cp, readdir, readFile, stat, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist-cloudflare');
await build({ configFile: path.join(root, 'vite.cloudflare.config.js') });
```

**السطر 1:** Import / استيراد: الأسماء `build` جاية من `vite`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 2:** Import / استيراد: الأسماء `cp`، `readdir`، `readFile`، `stat`، `writeFile`، `mkdir` جاية من `node:fs/promises`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 3:** Import / استيراد: الأسماء `fileURLToPath` جاية من `node:url`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 4:** Import / استيراد: الأسماء `path` جاية من `node:path`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 6:** Variable declaration / تعريف `root` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `fileURLToPath(...)`: تحوّل file URL لمسار filesystem مناسب للنظام. القيم المكتوبة هنا: `new URL('../', import.meta.url)`. العائد/الأثر: path string؛ لا تقرأ الملف.؛ `URL(...)`: تحلل عنوانًا وتجهز حقوله. القيم المكتوبة هنا: `'../'`، `import.meta.url`. العائد/الأثر: URL object، ولا تجلب المورد وحدها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 7:** Variable declaration / تعريف `output` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `path.join(...)`: تجمع عناصر في نص. القيم المكتوبة هنا: `root`، `'dist-cloudflare'`. العائد/الأثر: string، لا تعدّل عناصر الأصل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 8:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `build(...)`: تبدأ frontend production build بالإعدادات. القيم المكتوبة هنا: `{ configFile: path.join(root, 'vite.cloudflare.config.js') }`. العائد/الأثر: Promise لنتيجة build؛ الأثر ملفات artifacts.؛ `path.join(...)`: تجمع عناصر في نص. القيم المكتوبة هنا: `root`، `'vite.cloudflare.config.js'`. العائد/الأثر: string، لا تعدّل عناصر الأصل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 9–16

```js
const source = path.join(root, 'public');

// Explicit allowlist: no Laravel code, .env, vendor, database, logs or raw videos.
for (const folder of ['assets/photos', 'assets/story/frames', 'assets/story/frames-sm']) {
    await cp(path.join(source, folder), path.join(output, folder), { recursive: true });
}
for (const file of ['assets/story/manifest.json', 'assets/story/poster.webp', 'assets/story/last-frame.webp', 'favicon.ico']) {
    await cp(path.join(source, file), path.join(output, file));
```

**السطر 9:** Variable declaration / تعريف `source` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `path.join(...)`: تجمع عناصر في نص. القيم المكتوبة هنا: `root`، `'public'`. العائد/الأثر: string، لا تعدّل عناصر الأصل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 11:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 12:** Variable declaration / تعريف `folder` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 13:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `cp(...)`: تنسخ ملفًا/شجرة حسب الخيارات. القيم المكتوبة هنا: `path.join(source, folder)`، `path.join(output, folder)`، `{ recursive: true }`. العائد/الأثر: Promise؛ لا يعني نشرًا على Cloudflare.؛ `path.join(...)`: تجمع عناصر في نص. القيم المكتوبة هنا: `output`، `folder`. العائد/الأثر: string، لا تعدّل عناصر الأصل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 14:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 15:** Variable declaration / تعريف `file` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 16:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `cp(...)`: تنسخ ملفًا/شجرة حسب الخيارات. القيم المكتوبة هنا: `path.join(source, file)`، `path.join(output, file)`. العائد/الأثر: Promise؛ لا يعني نشرًا على Cloudflare.؛ `path.join(...)`: تجمع عناصر في نص. القيم المكتوبة هنا: `output`، `file`. العائد/الأثر: string، لا تعدّل عناصر الأصل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 17–24

```js
}
// Pages serves clean URLs from matching HTML files. This avoids rewrite loops.
const indexHtml = await readFile(path.join(output, 'index.html'), 'utf8');
await writeFile(path.join(output, 'my-garage.html'), indexHtml
    .replace('<title>AutoCare Pro | Car care, with clarity</title>', '<title>My Garage | AutoCare Pro</title>')
    .replace('</head>', '<meta name="robots" content="noindex,follow"></head>'));
await writeFile(path.join(output, '_headers'), [
    '/*',
```

**السطر 17:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 18:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 19:** Variable declaration / تعريف `indexHtml` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `readFile(...)`: تقرأ محتوى ملف. القيم المكتوبة هنا: `path.join(output, 'index.html')`، `'utf8'`. العائد/الأثر: Promise لـBuffer أو string عند encoding؛ قراءة مش تنفيذ.؛ `path.join(...)`: تجمع عناصر في نص. القيم المكتوبة هنا: `output`، `'index.html'`. العائد/الأثر: string، لا تعدّل عناصر الأصل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 20:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `writeFile(...)`: تكتب/تستبدل محتوى ملف. القيم المكتوبة هنا: `path.join(output, 'my-garage.html')`، `indexHtml     .replace('<title>AutoCare Pro | Car care, with clarity</title>', '<title>My Garage | AutoCare Pr…`. العائد/الأثر: Promise بلا بيانات عند النجاح؛ تعديل filesystem.؛ `path.join(...)`: تجمع عناصر في نص. القيم المكتوبة هنا: `output`، `'my-garage.html'`. العائد/الأثر: string، لا تعدّل عناصر الأصل.؛ `indexHtml     .replace('<title>AutoCare Pro | Car care, with clarity</title>', '<title>My Garage | AutoCare Pro</title>')     .replace(...)`: تستبدل تطابقًا أو تطابقات حسب pattern. القيم المكتوبة هنا: `'</head>'`، `'<meta name="robots" content="noindex,follow"></head>'`. العائد/الأثر: نص جديد؛ الأصل لا يتغيّر.؛ `indexHtml     .replace(...)`: تستبدل تطابقًا أو تطابقات حسب pattern. القيم المكتوبة هنا: `'<title>AutoCare Pro | Car care, with clarity</title>'`، `'<title>My Garage | AutoCare Pro</title>'`. العائد/الأثر: نص جديد؛ الأصل لا يتغيّر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 21:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 22:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 23:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `writeFile(...)`: تكتب/تستبدل محتوى ملف. القيم المكتوبة هنا: `path.join(output, '_headers')`، `[     '/*',     '  X-Content-Type-Options: nosniff',     '  Referrer-Policy: strict-origin-when-cross-origin',…`. العائد/الأثر: Promise بلا بيانات عند النجاح؛ تعديل filesystem.؛ `path.join(...)`: تجمع عناصر في نص. القيم المكتوبة هنا: `output`، `'_headers'`. العائد/الأثر: string، لا تعدّل عناصر الأصل.؛ `[     '/*',     '  X-Content-Type-Options: nosniff',     '  Referrer-Policy: strict-origin-when-cross-origin',     '  Permissions-Policy: camera=(), microphone=(), geolocation=()',     '  X-Frame-Options: SAMEORIGIN',     '/app/*',     '  Cache-Control: public, max-age=31536000, immutable',     '/assets/story/frames/*',     '  Cache-Control: public, max-age=86400',     '/assets/story/frames-sm/*',     '  Cache-Control: public, max-age=86400',     '/assets/photos/*',     '  Cache-Control: public, max-age=86400',     '', ].join(...)`: تجمع عناصر في نص. القيم المكتوبة هنا: `'\n'`. العائد/الأثر: string، لا تعدّل عناصر الأصل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 24:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 25–32

```js
    '  X-Content-Type-Options: nosniff',
    '  Referrer-Policy: strict-origin-when-cross-origin',
    '  Permissions-Policy: camera=(), microphone=(), geolocation=()',
    '  X-Frame-Options: SAMEORIGIN',
    '/app/*',
    '  Cache-Control: public, max-age=31536000, immutable',
    '/assets/story/frames/*',
    '  Cache-Control: public, max-age=86400',
```

**السطر 25:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 26:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 27:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 28:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 29:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 30:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 31:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 32:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 33–40

```js
    '/assets/story/frames-sm/*',
    '  Cache-Control: public, max-age=86400',
    '/assets/photos/*',
    '  Cache-Control: public, max-age=86400',
    '',
].join('\n'));

// Check the complete sequence and enforce the Pages per-file size limit.
```

**السطر 33:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 34:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 35:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 36:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 37:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 38:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 40:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

### السطور 41–48

```js
const manifest = JSON.parse(await readFile(path.join(output, 'assets/story/manifest.json'), 'utf8'));
for (const set of [manifest.desktop, manifest.mobile]) {
    for (let index = 1; index <= set.count; index++) {
        const file = set.path.replace(/^\//, '').replace('%04d', String(index).padStart(4, '0'));
        await stat(path.join(output, file));
    }
}
async function inventory(folder) {
```

**السطر 41:** Variable declaration / تعريف `manifest` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `JSON.parse(...)`: يفك JSON string لقيم JS؛ ممكن يرمي SyntaxError ولا يعتبر validation كامل. القيم المكتوبة هنا: `await readFile(path.join(output, 'assets/story/manifest.json'), 'utf8')`. العائد/الأثر: JS value؛ `readFile(...)`: تقرأ محتوى ملف. القيم المكتوبة هنا: `path.join(output, 'assets/story/manifest.json')`، `'utf8'`. العائد/الأثر: Promise لـBuffer أو string عند encoding؛ قراءة مش تنفيذ.؛ `path.join(...)`: تجمع عناصر في نص. القيم المكتوبة هنا: `output`، `'assets/story/manifest.json'`. العائد/الأثر: string، لا تعدّل عناصر الأصل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 42:** Variable declaration / تعريف `set` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 43:** Variable declaration / تعريف `index` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `1`، مش ناتج طلب شبكة.

**السطر 44:** Variable declaration / تعريف `file` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `set.path.replace(/^\//, '').replace(...)`: تستبدل تطابقًا أو تطابقات حسب pattern. القيم المكتوبة هنا: `'%04d'`، `String(index).padStart(4, '0')`. العائد/الأثر: نص جديد؛ الأصل لا يتغيّر.؛ `set.path.replace(...)`: تستبدل تطابقًا أو تطابقات حسب pattern. القيم المكتوبة هنا: `/^\//`، `''`. العائد/الأثر: نص جديد؛ الأصل لا يتغيّر.؛ `String(index).padStart(...)`: تضيف padding لبداية النص حتى طول محدد. القيم المكتوبة هنا: `4`، `'0'`. العائد/الأثر: نص جديد.؛ `String(...)`: تحوّل قيمة إلى نص عند استدعائها بدون new. القيم المكتوبة هنا: `index`. العائد/الأثر: string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 45:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `stat(...)`: تقرأ معلومات ملف. القيم المكتوبة هنا: `path.join(output, file)`. العائد/الأثر: Promise لـStats فيها size وغيرها؛ لا تقرأ body.؛ `path.join(...)`: تجمع عناصر في نص. القيم المكتوبة هنا: `output`، `file`. العائد/الأثر: string، لا تعدّل عناصر الأصل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 46:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 47:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 48:** Function / تعريف دالة `inventory`؛ تعريفها مش تشغيلها. اللي بين الأقواس parameters، والجسم التالي هو خطواتها.  

### السطور 49–56

```js
    const entries = await readdir(folder, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const fullPath = path.join(folder, entry.name);
        if (entry.isDirectory()) files.push(...await inventory(fullPath));
        else files.push({ path: path.relative(output, fullPath), bytes: (await stat(fullPath)).size });
    }
    return files;
```

**السطر 49:** Variable declaration / تعريف `entries` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `readdir(...)`: تقرأ مداخل directory. القيم المكتوبة هنا: `folder`، `{ withFileTypes: true }`. العائد/الأثر: Promise لقائمة أسماء/Dirent.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 50:** Variable declaration / تعريف `files` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة الابتدائية Array فيها 0 عنصرًا؛ العناصر نفسها في السطور التالية.

**السطر 51:** Variable declaration / تعريف `entry` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 52:** Variable declaration / تعريف `fullPath` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `path.join(...)`: تجمع عناصر في نص. القيم المكتوبة هنا: `folder`، `entry.name`. العائد/الأثر: string، لا تعدّل عناصر الأصل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 53:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `entry.isDirectory(...)`: تحدد هل المدخل directory. مدخلاتها: بدون arguments. العائد/الأثر: Boolean.؛ `files.push(...)`: تضيف عناصر في آخر array الأصلية. القيم المكتوبة هنا: `...await inventory(fullPath)`. العائد/الأثر: الطول الجديد؛ تعدّل الأصل.؛ `inventory(...)`: تنفّذ الجزء المعرّف باسم inventory في نفس الملف؛ التعريف كامل تحت مع شرح سطوره. القيم المكتوبة هنا: `fullPath`. العائد/الأثر: ارجع لسطر return في تعريف الدالة؛ لو مفيش return قيمة فالناتج المعتاد undefined في JavaScript.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 54:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `files.push(...)`: تضيف عناصر في آخر array الأصلية. القيم المكتوبة هنا: `{ path: path.relative(output, fullPath), bytes: (await stat(fullPath)).size }`. العائد/الأثر: الطول الجديد؛ تعدّل الأصل.؛ `path.relative(...)`: تحسب المسار النسبي بين مسارين. القيم المكتوبة هنا: `output`، `fullPath`. العائد/الأثر: string؛ لا تنقل الملف.؛ `stat(...)`: تقرأ معلومات ملف. القيم المكتوبة هنا: `fullPath`. العائد/الأثر: Promise لـStats فيها size وغيرها؛ لا تقرأ body.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 55:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 56:** Return / رجّع `files` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

### السطور 57–63

```js
}
const files = await inventory(output);
if (files.some(file => file.bytes > 25 * 1024 * 1024)) throw new Error('A deployment asset exceeds the Cloudflare Pages 25 MiB limit.');
if (files.some(file => /(^|[\\/])(\.env|source|database|vendor|node_modules)([.\\/]|$)|\.(php|mp4|log|map)$/i.test(file.path))) throw new Error('Unexpected private/source file found in the deployment output.');
console.log(`Cloudflare bundle ready: ${files.length} public files, ${(files.reduce((sum,file)=>sum+file.bytes,0)/1e6).toFixed(2)} MB.`);
console.log(`Frame sequences verified: ${manifest.desktop.count} desktop, ${manifest.mobile.count} mobile. Output: ${output}`);

```

**السطر 57:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 58:** Variable declaration / تعريف `files` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `inventory(...)`: تنفّذ الجزء المعرّف باسم inventory في نفس الملف؛ التعريف كامل تحت مع شرح سطوره. القيم المكتوبة هنا: `output`. العائد/الأثر: ارجع لسطر return في تعريف الدالة؛ لو مفيش return قيمة فالناتج المعتاد undefined في JavaScript.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 59:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `files.some(...)`: تفحص هل أي عنصر يحقق الشرط وتتوقف عند أول نجاح. القيم المكتوبة هنا: `file => file.bytes > 25 * 1024 * 1024`. العائد/الأثر: Boolean.؛ `Error(...)`: تنشئ object خطأ برسالة؛ الرمي يحتاج throw منفصلة. القيم المكتوبة هنا: `'A deployment asset exceeds the Cloudflare Pages 25 MiB limit.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 60:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `files.some(...)`: تفحص هل أي عنصر يحقق الشرط وتتوقف عند أول نجاح. القيم المكتوبة هنا: `file => /(^|[\\/])(\.env|source|database|vendor|node_modules)([.\\/]|$)|\.(php|mp4|log|map)$/i.test(file.path)`. العائد/الأثر: Boolean.؛ `/(^|[\\/])(\.env|source|database|vendor|node_modules)([.\\/]|$)|\.(php|mp4|log|map)$/i.test(...)`: RegExp.test تفحص تطابق النص؛ Node test يسجل اختبارًا. القيم المكتوبة هنا: `file.path`. العائد/الأثر: Boolean في regex؛ نتيجة تسجيل اختبار في Node.؛ `Error(...)`: تنشئ object خطأ برسالة؛ الرمي يحتاج throw منفصلة. القيم المكتوبة هنا: `'Unexpected private/source file found in the deployment output.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 61:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `console.log(...)`: تعرض قيمة للفحص في Console. القيم المكتوبة هنا: `'Cloudflare bundle ready: ${files.length} public files, ${(files.reduce((sum,file)=>sum+file.bytes,0)/1e6).toF…`. العائد/الأثر: undefined؛ لا تبني واجهة HTML.؛ `(files.reduce((sum,file)=>sum+file.bytes,0)/1e6).toFixed(...)`: تنسّق عددًا بمواضع عشرية محددة. القيم المكتوبة هنا: `2`. العائد/الأثر: string، مش رقمًا صالحًا للحساب بدون تحويل.؛ `files.reduce(...)`: تجمع عناصر في نتيجة متراكمة. القيم المكتوبة هنا: `(sum,file)=>sum+file.bytes`، `0`. العائد/الأثر: الناتج النهائي؛ سلة فاضية مع البداية0 ترجع0.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 62:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `console.log(...)`: تعرض قيمة للفحص في Console. القيم المكتوبة هنا: `'Frame sequences verified: ${manifest.desktop.count} desktop, ${manifest.mobile.count} mobile. Output: ${outpu…`. العائد/الأثر: undefined؛ لا تبني واجهة HTML.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
