# sales/render-video.mjs

[فهرس كل الأكواد](../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `sales/render-video.mjs` · 54 سطر.

**وظيفة الملف:** ملف عرض/تقديم تجاري مساعد للمشروع؛ مش مسار المتجر الأساسي ولا API إنتاج.

**نوعه:** source / مصدر. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../sales/render-video.mjs). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```js
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const work = join(root, 'video-work');
mkdirSync(work, { recursive: true });
const scenes = [
    ['01-home', 'Restaurant ordering, on your own website', 'A working project that can be customized for another restaurant.'],
    ['02-menu', 'One menu. The right branch.', 'Customers choose products with branch-specific prices and availability.'],
    ['03-checkout', 'Delivery or pickup, with kitchen notes', 'The cart keeps items, quantities, notes and fulfillment details together.'],
    ['07-tracking-ready', 'Customers can track their order', 'Received > Preparing > Ready > Delivery or Pickup > Completed'],
    ['06-ready', 'The order reaches its branch dashboard', 'Branch staff see their own orders, customer details and highlighted notes.'],
    ['06-ready', 'Clear next steps for the kitchen', 'Accept and prepare. Mark ready. Send or hand over. Complete.'],
    ['07-tracking-ready', 'Kitchen updates become customer updates', 'This sample order was moved to Ready in the branch dashboard.'],
    ['08-admin', 'The owner sees the bigger picture', 'Daily order totals, order counts, branch comparisons and best-selling items.'],
    ['09-admin-menu', 'Manage the menu without editing code', 'Products, categories, branch prices, availability and sold-out controls.'],
    ['10-admin-staff', 'A staff account for each branch', 'Branch staff access one branch. Admin oversees all branches.'],
    ['11-admin-settings', 'Manage operating settings', 'Preparation time, delivery settings and admin activity history.'],
    ['08-admin', 'A cashier edition can be developed next', 'An optional future extension, scoped separately. Not included today.'],
    ['01-home', 'Try the interactive demo', 'pizza-ordering-preview.pages.dev | Ask for a version for your restaurant.'],
];
function run(args) {
    const result = spawnSync(process.env.FFMPEG_PATH || 'ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
    if (result.error) process.stderr.write(result.error.message + '\n');
    if (result.status !== 0) throw new Error('Video rendering failed. Check that FFmpeg is installed.');
}
// Use the homepage source once, with the same slight zoom as its CSS.
run(['-i', join(root, '..', 'public', 'videos', 'hero-pizza-motion.mp4'), '-map', '0:v:0', '-vf', 'crop=trunc(iw/1.12/2)*2:trunc(ih/1.12/2)*2,scale=1920:1080,setsar=1,fps=25,fade=t=in:st=0:d=0.2,fade=t=out:st=7.85:d=0.25', '-c:v', 'libx264', '-preset', 'fast', '-crf', '22', '-pix_fmt', 'yuv420p', '-an', join(work, 'intro.mp4')]);
process.stdout.write('Homepage pizza intro ready\n');
for (const [index, [image, title, caption]] of scenes.entries()) {
    const escape = (value) => value.replaceAll('\\', '/').replaceAll(':', '\\:');
    const titleFile = join(work, `title-${index}.txt`);
    const captionFile = join(work, `caption-${index}.txt`);
    writeFileSync(titleFile, title);
    writeFileSync(captionFile, caption);
    const font = 'C\\:/Windows/Fonts/arial.ttf';
    const filter = [
        'scale=1600:820:force_original_aspect_ratio=decrease',
        'pad=1920:1080:(ow-iw)/2:130:color=0x101010',
        `drawtext=fontfile='${font}':textfile='${escape(titleFile)}':fontcolor=white:fontsize=40:x=(w-tw)/2:y=44`,
        `drawtext=fontfile='${font}':textfile='${escape(captionFile)}':fontcolor=white:fontsize=25:x=(w-tw)/2:y=980`,
        `drawtext=fontfile='${font}':text='DEMO - Sample data - No real payments':fontcolor=0xff6565:fontsize=20:x=(w-tw)/2:y=1030`,
        'fade=t=in:st=0:d=0.25',
        'fade=t=out:st=5.75:d=0.25',
    ].join(',');
    run(['-loop', '1', '-i', join(root, 'assets', `${image}.jpg`), '-vf', filter, '-t', '6', '-r', '25', '-c:v', 'libx264', '-preset', 'fast', '-crf', '22', '-pix_fmt', 'yuv420p', '-an', join(work, `scene-${index}.mp4`)]);
    process.stdout.write(`Scene ${index + 1}/${scenes.length} ready\n`);
}
writeFileSync(join(work, 'sequence.txt'), ["file 'intro.mp4'", ...scenes.map((_, index) => `file 'scene-${index}.mp4'`)].join('\n'));
run(['-f', 'concat', '-safe', '0', '-i', join(work, 'sequence.txt'), '-c', 'copy', '-movflags', '+faststart', join(root, 'restaurant-system-demo-with-intro.mp4')]);
process.stdout.write('Created sales/restaurant-system-demo-with-intro.mp4 (about 86 seconds, no audio)\n');
```

</details>

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### dirname

- **جاية منين؟** Node path

- **وظيفتها:** ترجع مسار المجلد الأب.

- **المدخلات — Arguments:** path.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 6، والمدخلات المكتوبة: `fileURLToPath(import.meta.url)`.

### fileURLToPath

- **جاية منين؟** Node URL

- **وظيفتها:** تحوّل file URL لمسار filesystem مناسب للنظام.

- **المدخلات — Arguments:** file URL.

- **الناتج/الأثر — Return / effect:** path string؛ لا تقرأ الملف.

- **أول موضع هنا:** السطر 6، والمدخلات المكتوبة: `import.meta.url`.

### join

- **جاية منين؟** JavaScript Array.prototype

- **وظيفتها:** يجمع عناصر القائمة في string يفصلها separator.

- **المدخلات — Arguments:** separator مثل ', '.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 52، والمدخلات المكتوبة: `root`، `'restaurant-system-demo-with-intro.mp4'`.

- **مثال:** [deliveryArea, deliveryAddress].filter(Boolean).join(', ');

### mkdirSync

- **جاية منين؟** Node fs

- **وظيفتها:** تنشئ directory بشكل متزامن.

- **المدخلات — Arguments:** path وoptions.

- **الناتج/الأثر — Return / effect:** نتيجة حسب recursive؛ الأثر إنشاء folder.

- **أول موضع هنا:** السطر 8، والمدخلات المكتوبة: `work`، `{ recursive: true }`.

### spawnSync

- **جاية منين؟** Node child_process

- **وظيفتها:** تشغّل process وتنتظرها بشكل متزامن.

- **المدخلات — Arguments:** command وargs وoptions.

- **الناتج/الأثر — Return / effect:** object فيها status/stdout/stderr/error؛ ليست نتيجة كود الواجهة.

- **أول موضع هنا:** السطر 25، والمدخلات المكتوبة: `process.env.FFMPEG_PATH || 'ffmpeg'`، `['-hide_banner', '-loglevel', 'error', '-y', ...args]`، `{ stdio: 'inherit' }`.

### process.stderr.write

- **جاية منين؟** Node stream

- **وظيفتها:** تكتب chunk في stream مثل stdout/stderr.

- **المدخلات — Arguments:** chunk وخيارات/callback.

- **الناتج/الأثر — Return / effect:** Boolean للـbackpressure؛ غير repository.write المحلية المعرّفة في مشروعنا.

- **أول موضع هنا:** السطر 26، والمدخلات المكتوبة: `result.error.message + '\n'`.

### Error

- **جاية منين؟** JavaScript

- **وظيفتها:** تنشئ object خطأ برسالة؛ الرمي يحتاج throw منفصلة.

- **المدخلات — Arguments:** message وخيارات اختيارية.

- **الناتج/الأثر — Return / effect:** Error object.

- **أول موضع هنا:** السطر 27، والمدخلات المكتوبة: `'Video rendering failed. Check that FFmpeg is installed.'`.

### run

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** تنفّذ الجزء المعرّف باسم run في نفس الملف؛ التعريف كامل تحت مع شرح سطوره.

- **المدخلات — Arguments:** args

- **الناتج/الأثر — Return / effect:** ارجع لسطر return في تعريف الدالة؛ لو مفيش return قيمة فالناتج المعتاد undefined في JavaScript.

- **أول موضع هنا:** السطر 52، والمدخلات المكتوبة: `['-f', 'concat', '-safe', '0', '-i', join(work, 'sequence.txt'), '-c', 'copy', '-movflags', '+faststart', join(root, 'restaurant-system-demo-with-intro.mp4')]`.

### process.stdout.write

- **جاية منين؟** Node stream

- **وظيفتها:** تكتب chunk في stream مثل stdout/stderr.

- **المدخلات — Arguments:** chunk وخيارات/callback.

- **الناتج/الأثر — Return / effect:** Boolean للـbackpressure؛ غير repository.write المحلية المعرّفة في مشروعنا.

- **أول موضع هنا:** السطر 53، والمدخلات المكتوبة: `'Created sales/restaurant-system-demo-with-intro.mp4 (about 86 seconds, no audio)\n'`.

### scenes.entries

- **جاية منين؟** Object/Map

- **وظيفتها:** تجهز أزواج key/value من المصدر.

- **المدخلات — Arguments:** object مع Object.entries، أو بدون arguments على Map.

- **الناتج/الأثر — Return / effect:** array أزواج أو iterator حسب المستقبِل.

- **أول موضع هنا:** السطر 32.

### value.replaceAll('\\', '/').replaceAll

- **جاية منين؟** String

- **وظيفتها:** تستبدل كل التطابقات بنص جديد.

- **المدخلات — Arguments:** search وreplacement.

- **الناتج/الأثر — Return / effect:** string جديدة؛ لا تعدّل الأصل.

- **أول موضع هنا:** السطر 33، والمدخلات المكتوبة: `':'`، `'\\:'`.

### value.replaceAll

- **جاية منين؟** String

- **وظيفتها:** تستبدل كل التطابقات بنص جديد.

- **المدخلات — Arguments:** search وreplacement.

- **الناتج/الأثر — Return / effect:** string جديدة؛ لا تعدّل الأصل.

- **أول موضع هنا:** السطر 33، والمدخلات المكتوبة: `'\\'`، `'/'`.

### writeFileSync

- **جاية منين؟** Node fs

- **وظيفتها:** تكتب ملفًا بشكل متزامن.

- **المدخلات — Arguments:** path وdata.

- **الناتج/الأثر — Return / effect:** undefined؛ توقف استمرار JS خلال الكتابة في هذا التنفيذ.

- **أول موضع هنا:** السطر 51، والمدخلات المكتوبة: `join(work, 'sequence.txt')`، `["file 'intro.mp4'", ...scenes.map((_, index) => 'file 'scene-${index}.mp4'')].join('\n')`.

### [         'scale=1600:820:force_original_aspect_ratio=decrease',         'pad=1920:1080:(ow-iw)/2:130:color=0x101010',         `drawtext=fontfile='${font}':textfile='${escape(titleFile)}':fontcolor=white:fontsize=40:x=(w-tw)/2:y=44`,         `drawtext=fontfile='${font}':textfile='${escape(captionFile)}':fontcolor=white:fontsize=25:x=(w-tw)/2:y=980`,         `drawtext=fontfile='${font}':text='DEMO - Sample data - No real payments':fontcolor=0xff6565:fontsize=20:x=(w-tw)/2:y=1030`,         'fade=t=in:st=0:d=0.25',         'fade=t=out:st=5.75:d=0.25',     ].join

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تجمع عناصر في نص.

- **المدخلات — Arguments:** separator اختياري.

- **الناتج/الأثر — Return / effect:** string، لا تعدّل عناصر الأصل.

- **أول موضع هنا:** السطر 39، والمدخلات المكتوبة: `','`.

### escape

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** تنفّذ الجزء المعرّف باسم escape في نفس الملف؛ التعريف كامل تحت مع شرح سطوره.

- **المدخلات — Arguments:** value

- **الناتج/الأثر — Return / effect:** ارجع لسطر return في تعريف الدالة؛ لو مفيش return قيمة فالناتج المعتاد undefined في JavaScript.

- **أول موضع هنا:** السطر 43، والمدخلات المكتوبة: `captionFile`.

### ["file 'intro.mp4'", ...scenes.map((_, index) => `file 'scene-${index}.mp4'`)].join

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تجمع عناصر في نص.

- **المدخلات — Arguments:** separator اختياري.

- **الناتج/الأثر — Return / effect:** string، لا تعدّل عناصر الأصل.

- **أول موضع هنا:** السطر 51، والمدخلات المكتوبة: `'\n'`.

### scenes.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 51، والمدخلات المكتوبة: `(_, index) => 'file 'scene-${index}.mp4''`.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```js
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const work = join(root, 'video-work');
mkdirSync(work, { recursive: true });
```

**السطر 1:** Import / استيراد: الأسماء `spawnSync` جاية من `node:child_process`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 2:** Import / استيراد: الأسماء `mkdirSync`، `writeFileSync` جاية من `node:fs`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 3:** Import / استيراد: الأسماء `dirname`، `join` جاية من `node:path`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 4:** Import / استيراد: الأسماء `fileURLToPath` جاية من `node:url`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 6:** Variable declaration / تعريف `root` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `dirname(...)`: ترجع مسار المجلد الأب. القيم المكتوبة هنا: `fileURLToPath(import.meta.url)`. العائد/الأثر: string.؛ `fileURLToPath(...)`: تحوّل file URL لمسار filesystem مناسب للنظام. القيم المكتوبة هنا: `import.meta.url`. العائد/الأثر: path string؛ لا تقرأ الملف.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 7:** Variable declaration / تعريف `work` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `join(...)`: يجمع عناصر القائمة في string يفصلها separator. القيم المكتوبة هنا: `root`، `'video-work'`. العائد/الأثر: string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 8:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `mkdirSync(...)`: تنشئ directory بشكل متزامن. القيم المكتوبة هنا: `work`، `{ recursive: true }`. العائد/الأثر: نتيجة حسب recursive؛ الأثر إنشاء folder.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 9–16

```js
const scenes = [
    ['01-home', 'Restaurant ordering, on your own website', 'A working project that can be customized for another restaurant.'],
    ['02-menu', 'One menu. The right branch.', 'Customers choose products with branch-specific prices and availability.'],
    ['03-checkout', 'Delivery or pickup, with kitchen notes', 'The cart keeps items, quantities, notes and fulfillment details together.'],
    ['07-tracking-ready', 'Customers can track their order', 'Received > Preparing > Ready > Delivery or Pickup > Completed'],
    ['06-ready', 'The order reaches its branch dashboard', 'Branch staff see their own orders, customer details and highlighted notes.'],
    ['06-ready', 'Clear next steps for the kitchen', 'Accept and prepare. Mark ready. Send or hand over. Complete.'],
    ['07-tracking-ready', 'Kitchen updates become customer updates', 'This sample order was moved to Ready in the branch dashboard.'],
```

**السطر 9:** Variable declaration / تعريف `scenes` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة الابتدائية Array فيها 13 عنصرًا؛ العناصر نفسها في السطور التالية.

**السطر 10:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 11:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 12:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 13:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 14:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 15:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 16:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 17–24

```js
    ['08-admin', 'The owner sees the bigger picture', 'Daily order totals, order counts, branch comparisons and best-selling items.'],
    ['09-admin-menu', 'Manage the menu without editing code', 'Products, categories, branch prices, availability and sold-out controls.'],
    ['10-admin-staff', 'A staff account for each branch', 'Branch staff access one branch. Admin oversees all branches.'],
    ['11-admin-settings', 'Manage operating settings', 'Preparation time, delivery settings and admin activity history.'],
    ['08-admin', 'A cashier edition can be developed next', 'An optional future extension, scoped separately. Not included today.'],
    ['01-home', 'Try the interactive demo', 'pizza-ordering-preview.pages.dev | Ask for a version for your restaurant.'],
];
function run(args) {
```

**السطر 17:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 18:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 19:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 20:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 21:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 22:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 23:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 24:** Function / تعريف دالة `run`؛ تعريفها مش تشغيلها. اللي بين الأقواس parameters، والجسم التالي هو خطواتها.  

### السطور 25–32

```js
    const result = spawnSync(process.env.FFMPEG_PATH || 'ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { stdio: 'inherit' });
    if (result.error) process.stderr.write(result.error.message + '\n');
    if (result.status !== 0) throw new Error('Video rendering failed. Check that FFmpeg is installed.');
}
// Use the homepage source once, with the same slight zoom as its CSS.
run(['-i', join(root, '..', 'public', 'videos', 'hero-pizza-motion.mp4'), '-map', '0:v:0', '-vf', 'crop=trunc(iw/1.12/2)*2:trunc(ih/1.12/2)*2,scale=1920:1080,setsar=1,fps=25,fade=t=in:st=0:d=0.2,fade=t=out:st=7.85:d=0.25', '-c:v', 'libx264', '-preset', 'fast', '-crf', '22', '-pix_fmt', 'yuv420p', '-an', join(work, 'intro.mp4')]);
process.stdout.write('Homepage pizza intro ready\n');
for (const [index, [image, title, caption]] of scenes.entries()) {
```

**السطر 25:** Variable declaration / تعريف `result` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `spawnSync(...)`: تشغّل process وتنتظرها بشكل متزامن. القيم المكتوبة هنا: `process.env.FFMPEG_PATH || 'ffmpeg'`، `['-hide_banner', '-loglevel', 'error', '-y', ...args]`، `{ stdio: 'inherit' }`. العائد/الأثر: object فيها status/stdout/stderr/error؛ ليست نتيجة كود الواجهة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 26:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `process.stderr.write(...)`: تكتب chunk في stream مثل stdout/stderr. القيم المكتوبة هنا: `result.error.message + '\n'`. العائد/الأثر: Boolean للـbackpressure؛ غير repository.write المحلية المعرّفة في مشروعنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 27:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `Error(...)`: تنشئ object خطأ برسالة؛ الرمي يحتاج throw منفصلة. القيم المكتوبة هنا: `'Video rendering failed. Check that FFmpeg is installed.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 28:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 29:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 30:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `run(...)`: تنفّذ الجزء المعرّف باسم run في نفس الملف؛ التعريف كامل تحت مع شرح سطوره. القيم المكتوبة هنا: `['-i', join(root, '..', 'public', 'videos', 'hero-pizza-motion.mp4'), '-map', '0:v:0', '-vf', 'crop=trunc(iw/1…`. العائد/الأثر: ارجع لسطر return في تعريف الدالة؛ لو مفيش return قيمة فالناتج المعتاد undefined في JavaScript.؛ `join(...)`: يجمع عناصر القائمة في string يفصلها separator. القيم المكتوبة هنا: `work`، `'intro.mp4'`. العائد/الأثر: string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 31:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `process.stdout.write(...)`: تكتب chunk في stream مثل stdout/stderr. القيم المكتوبة هنا: `'Homepage pizza intro ready\n'`. العائد/الأثر: Boolean للـbackpressure؛ غير repository.write المحلية المعرّفة في مشروعنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 32:** Variable declaration / تعريف `index + ` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `scenes.entries(...)`: تجهز أزواج key/value من المصدر. مدخلاتها: object مع Object.entries، أو بدون arguments على Map. العائد/الأثر: array أزواج أو iterator حسب المستقبِل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 33–40

```js
    const escape = (value) => value.replaceAll('\\', '/').replaceAll(':', '\\:');
    const titleFile = join(work, `title-${index}.txt`);
    const captionFile = join(work, `caption-${index}.txt`);
    writeFileSync(titleFile, title);
    writeFileSync(captionFile, caption);
    const font = 'C\\:/Windows/Fonts/arial.ttf';
    const filter = [
        'scale=1600:820:force_original_aspect_ratio=decrease',
```

**السطر 33:** Variable declaration / تعريف `escape` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `value.replaceAll('\\', '/').replaceAll(...)`: تستبدل كل التطابقات بنص جديد. القيم المكتوبة هنا: `':'`، `'\\:'`. العائد/الأثر: string جديدة؛ لا تعدّل الأصل.؛ `value.replaceAll(...)`: تستبدل كل التطابقات بنص جديد. القيم المكتوبة هنا: `'\\'`، `'/'`. العائد/الأثر: string جديدة؛ لا تعدّل الأصل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 34:** Variable declaration / تعريف `titleFile` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `join(...)`: يجمع عناصر القائمة في string يفصلها separator. القيم المكتوبة هنا: `work`، `'title-${index}.txt'`. العائد/الأثر: string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 35:** Variable declaration / تعريف `captionFile` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `join(...)`: يجمع عناصر القائمة في string يفصلها separator. القيم المكتوبة هنا: `work`، `'caption-${index}.txt'`. العائد/الأثر: string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 36:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `writeFileSync(...)`: تكتب ملفًا بشكل متزامن. القيم المكتوبة هنا: `titleFile`، `title`. العائد/الأثر: undefined؛ توقف استمرار JS خلال الكتابة في هذا التنفيذ.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 37:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `writeFileSync(...)`: تكتب ملفًا بشكل متزامن. القيم المكتوبة هنا: `captionFile`، `caption`. العائد/الأثر: undefined؛ توقف استمرار JS خلال الكتابة في هذا التنفيذ.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 38:** Variable declaration / تعريف `font` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `"C\\:/Windows/Fonts/arial.ttf"`، مش ناتج طلب شبكة.

**السطر 39:** Variable declaration / تعريف `filter` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `[         'scale=1600:820:force_original_aspect_ratio=decrease',         'pad=1920:1080:(ow-iw)/2:130:color=0x101010',         'drawtext=fontfile='${font}':textfile='${escape(titleFile)}':fontcolor=white:fontsize=40:x=(w-tw)/2:y=44',         'drawtext=fontfile='${font}':textfile='${escape(captionFile)}':fontcolor=white:fontsize=25:x=(w-tw)/2:y=980',         'drawtext=fontfile='${font}':text='DEMO - Sample data - No real payments':fontcolor=0xff6565:fontsize=20:x=(w-tw)/2:y=1030',         'fade=t=in:st=0:d=0.25',         'fade=t=out:st=5.75:d=0.25',     ].join(...)`: تجمع عناصر في نص. القيم المكتوبة هنا: `','`. العائد/الأثر: string، لا تعدّل عناصر الأصل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 40:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 41–48

```js
        'pad=1920:1080:(ow-iw)/2:130:color=0x101010',
        `drawtext=fontfile='${font}':textfile='${escape(titleFile)}':fontcolor=white:fontsize=40:x=(w-tw)/2:y=44`,
        `drawtext=fontfile='${font}':textfile='${escape(captionFile)}':fontcolor=white:fontsize=25:x=(w-tw)/2:y=980`,
        `drawtext=fontfile='${font}':text='DEMO - Sample data - No real payments':fontcolor=0xff6565:fontsize=20:x=(w-tw)/2:y=1030`,
        'fade=t=in:st=0:d=0.25',
        'fade=t=out:st=5.75:d=0.25',
    ].join(',');
    run(['-loop', '1', '-i', join(root, 'assets', `${image}.jpg`), '-vf', filter, '-t', '6', '-r', '25', '-c:v', 'libx264', '-preset', 'fast', '-crf', '22', '-pix_fmt', 'yuv420p', '-an', join(work, `scene-${index}.mp4`)]);
```

**السطر 41:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 42:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `escape(...)`: تنفّذ الجزء المعرّف باسم escape في نفس الملف؛ التعريف كامل تحت مع شرح سطوره. القيم المكتوبة هنا: `titleFile`. العائد/الأثر: ارجع لسطر return في تعريف الدالة؛ لو مفيش return قيمة فالناتج المعتاد undefined في JavaScript.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 43:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `escape(...)`: تنفّذ الجزء المعرّف باسم escape في نفس الملف؛ التعريف كامل تحت مع شرح سطوره. القيم المكتوبة هنا: `captionFile`. العائد/الأثر: ارجع لسطر return في تعريف الدالة؛ لو مفيش return قيمة فالناتج المعتاد undefined في JavaScript.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 44:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 45:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 46:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 47:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 48:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `run(...)`: تنفّذ الجزء المعرّف باسم run في نفس الملف؛ التعريف كامل تحت مع شرح سطوره. القيم المكتوبة هنا: `['-loop', '1', '-i', join(root, 'assets', '${image}.jpg'), '-vf', filter, '-t', '6', '-r', '25', '-c:v', 'libx…`. العائد/الأثر: ارجع لسطر return في تعريف الدالة؛ لو مفيش return قيمة فالناتج المعتاد undefined في JavaScript.؛ `join(...)`: يجمع عناصر القائمة في string يفصلها separator. القيم المكتوبة هنا: `work`، `'scene-${index}.mp4'`. العائد/الأثر: string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 49–54

```js
    process.stdout.write(`Scene ${index + 1}/${scenes.length} ready\n`);
}
writeFileSync(join(work, 'sequence.txt'), ["file 'intro.mp4'", ...scenes.map((_, index) => `file 'scene-${index}.mp4'`)].join('\n'));
run(['-f', 'concat', '-safe', '0', '-i', join(work, 'sequence.txt'), '-c', 'copy', '-movflags', '+faststart', join(root, 'restaurant-system-demo-with-intro.mp4')]);
process.stdout.write('Created sales/restaurant-system-demo-with-intro.mp4 (about 86 seconds, no audio)\n');

```

**السطر 49:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `process.stdout.write(...)`: تكتب chunk في stream مثل stdout/stderr. القيم المكتوبة هنا: `'Scene ${index + 1}/${scenes.length} ready\n'`. العائد/الأثر: Boolean للـbackpressure؛ غير repository.write المحلية المعرّفة في مشروعنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 50:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 51:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `writeFileSync(...)`: تكتب ملفًا بشكل متزامن. القيم المكتوبة هنا: `join(work, 'sequence.txt')`، `["file 'intro.mp4'", ...scenes.map((_, index) => 'file 'scene-${index}.mp4'')].join('\n')`. العائد/الأثر: undefined؛ توقف استمرار JS خلال الكتابة في هذا التنفيذ.؛ `join(...)`: يجمع عناصر القائمة في string يفصلها separator. القيم المكتوبة هنا: `work`، `'sequence.txt'`. العائد/الأثر: string.؛ `["file 'intro.mp4'", ...scenes.map((_, index) => 'file 'scene-${index}.mp4'')].join(...)`: تجمع عناصر في نص. القيم المكتوبة هنا: `'\n'`. العائد/الأثر: string، لا تعدّل عناصر الأصل.؛ `scenes.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(_, index) => 'file 'scene-${index}.mp4''`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 52:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `run(...)`: تنفّذ الجزء المعرّف باسم run في نفس الملف؛ التعريف كامل تحت مع شرح سطوره. القيم المكتوبة هنا: `['-f', 'concat', '-safe', '0', '-i', join(work, 'sequence.txt'), '-c', 'copy', '-movflags', '+faststart', join…`. العائد/الأثر: ارجع لسطر return في تعريف الدالة؛ لو مفيش return قيمة فالناتج المعتاد undefined في JavaScript.؛ `join(...)`: يجمع عناصر القائمة في string يفصلها separator. القيم المكتوبة هنا: `root`، `'restaurant-system-demo-with-intro.mp4'`. العائد/الأثر: string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 53:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `process.stdout.write(...)`: تكتب chunk في stream مثل stdout/stderr. القيم المكتوبة هنا: `'Created sales/restaurant-system-demo-with-intro.mp4 (about 86 seconds, no audio)\n'`. العائد/الأثر: Boolean للـbackpressure؛ غير repository.write المحلية المعرّفة في مشروعنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
