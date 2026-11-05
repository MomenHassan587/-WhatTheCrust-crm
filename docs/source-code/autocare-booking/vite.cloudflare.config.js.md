# vite.cloudflare.config.js

[فهرس كل الأكواد](../../16-all-project-source.md)

المشروع: `autocare-booking` · الملف: `vite.cloudflare.config.js` · 17 سطر.

**وظيفة الملف:** إعدادات تطوير/build/dependencies أو اختبار. تفسّرها الأداة المكتوبة في الملف؛ وجود package لا يثبت استخدامها في واجهة نشطة.

**نوعه:** source / مصدر. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../autocare-booking/vite.cloudflare.config.js). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';

// Independent of the Laravel build: only the frontend demo is deployed.
export default defineConfig({
    root: fileURLToPath(new URL('./cloudflare', import.meta.url)),
    publicDir: false,
    plugins: [vue()],
    build: {
        outDir: fileURLToPath(new URL('./dist-cloudflare', import.meta.url)),
        emptyOutDir: true,
        assetsDir: 'app',
        sourcemap: false,
    },
});
```

</details>

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### defineConfig

- **جاية منين؟** Vite

- **وظيفتها:** تساعد في تعريف/توصيف إعداد Vite.

- **المدخلات — Arguments:** config object/function.

- **الناتج/الأثر — Return / effect:** config؛ لا تشغّل السيرفر بمجرد الاستدعاء.

- **أول موضع هنا:** السطر 6، والمدخلات المكتوبة: `{     root: fileURLToPath(new URL('./cloudflare', import.meta.url)),     publicDir: false,     plugins: [vue()],     build: {         outDir: fileURLToPath(new URL('./dist-cloudfla…`.

### fileURLToPath

- **جاية منين؟** Node URL

- **وظيفتها:** تحوّل file URL لمسار filesystem مناسب للنظام.

- **المدخلات — Arguments:** file URL.

- **الناتج/الأثر — Return / effect:** path string؛ لا تقرأ الملف.

- **أول موضع هنا:** السطر 11، والمدخلات المكتوبة: `new URL('./dist-cloudflare', import.meta.url)`.

### URL

- **جاية منين؟** Browser/Node URL

- **وظيفتها:** تحلل عنوانًا وتجهز حقوله.

- **المدخلات — Arguments:** عنوان وbase اختياري.

- **الناتج/الأثر — Return / effect:** URL object، ولا تجلب المورد وحدها.

- **أول موضع هنا:** السطر 11، والمدخلات المكتوبة: `'./dist-cloudflare'`، `import.meta.url`.

### vue

- **جاية منين؟** Vite Vue plugin

- **وظيفتها:** تنشئ plugin لمعالجة ملفات .vue.

- **المدخلات — Arguments:** options اختيارية.

- **الناتج/الأثر — Return / effect:** plugin definition للبناء والتطوير.

- **أول موضع هنا:** السطر 9.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';

// Independent of the Laravel build: only the frontend demo is deployed.
export default defineConfig({
    root: fileURLToPath(new URL('./cloudflare', import.meta.url)),
    publicDir: false,
```

**السطر 1:** Import / استيراد: الأسماء `defineConfig` جاية من `vite`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 2:** Import / استيراد: الأسماء `vue` جاية من `@vitejs/plugin-vue`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 3:** Import / استيراد: الأسماء `fileURLToPath` جاية من `node:url`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 5:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 6:** Export / تصدير تعريف علشان ملف آخر يقدر يستورده. default تصدير أساسي؛ named export يتستورد باسمه. الدوال الموجودة في السطر: `defineConfig(...)`: تساعد في تعريف/توصيف إعداد Vite. القيم المكتوبة هنا: `{     root: fileURLToPath(new URL('./cloudflare', import.meta.url)),     publicDir: false,     plugins: [vue()…`. العائد/الأثر: config؛ لا تشغّل السيرفر بمجرد الاستدعاء.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 7:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `fileURLToPath(...)`: تحوّل file URL لمسار filesystem مناسب للنظام. القيم المكتوبة هنا: `new URL('./cloudflare', import.meta.url)`. العائد/الأثر: path string؛ لا تقرأ الملف.؛ `URL(...)`: تحلل عنوانًا وتجهز حقوله. القيم المكتوبة هنا: `'./cloudflare'`، `import.meta.url`. العائد/الأثر: URL object، ولا تجلب المورد وحدها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 8:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 9–16

```js
    plugins: [vue()],
    build: {
        outDir: fileURLToPath(new URL('./dist-cloudflare', import.meta.url)),
        emptyOutDir: true,
        assetsDir: 'app',
        sourcemap: false,
    },
});
```

**السطر 9:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `vue(...)`: تنشئ plugin لمعالجة ملفات .vue. مدخلاتها: options اختيارية. العائد/الأثر: plugin definition للبناء والتطوير.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 10:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 11:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `fileURLToPath(...)`: تحوّل file URL لمسار filesystem مناسب للنظام. القيم المكتوبة هنا: `new URL('./dist-cloudflare', import.meta.url)`. العائد/الأثر: path string؛ لا تقرأ الملف.؛ `URL(...)`: تحلل عنوانًا وتجهز حقوله. القيم المكتوبة هنا: `'./dist-cloudflare'`، `import.meta.url`. العائد/الأثر: URL object، ولا تجلب المورد وحدها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 12:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 13:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 14:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 15:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 16:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
