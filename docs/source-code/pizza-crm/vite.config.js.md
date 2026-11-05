# vite.config.js

[فهرس كل الأكواد](../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `vite.config.js` · 18 سطر.

**وظيفة الملف:** إعدادات تطوير/build/dependencies أو اختبار. تفسّرها الأداة المكتوبة في الملف؛ وجود package لا يثبت استخدامها في واجهة نشطة.

**نوعه:** source / مصدر. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../vite.config.js). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```js
// vite.config.js

import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { realpathSync } from 'node:fs';

export default defineConfig({
    root: realpathSync('.'),
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
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

- **أول موضع هنا:** السطر 8، والمدخلات المكتوبة: `{     root: realpathSync('.'),     plugins: [         laravel({             input: ['resources/css/app.css', 'resources/js/app.jsx'],             refresh: true,         }),        …`.

### realpathSync

- **جاية منين؟** Node fs

- **وظيفتها:** تحل المسار الحقيقي على filesystem.

- **المدخلات — Arguments:** path.

- **الناتج/الأثر — Return / effect:** resolved string/Buffer أو خطأ.

- **أول موضع هنا:** السطر 9، والمدخلات المكتوبة: `'.'`.

### laravel

- **جاية منين؟** Laravel Vite plugin

- **وظيفتها:** تجهز تكامل entry points وrefresh وmanifest.

- **المدخلات — Arguments:** input/config.

- **الناتج/الأثر — Return / effect:** Vite plugin definitions؛ مش PHP server.

- **أول موضع هنا:** السطر 11، والمدخلات المكتوبة: `{             input: ['resources/css/app.css', 'resources/js/app.jsx'],             refresh: true,         }`.

### react

- **جاية منين؟** Vite React plugin

- **وظيفتها:** تنشئ plugin لمعالجة JSX/React وتجربة التطوير.

- **المدخلات — Arguments:** options اختيارية.

- **الناتج/الأثر — Return / effect:** plugin definition.

- **أول موضع هنا:** السطر 15.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```js
// vite.config.js

import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { realpathSync } from 'node:fs';

export default defineConfig({
```

**السطر 1:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 3:** Import / استيراد: الأسماء `defineConfig` جاية من `vite`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 4:** Import / استيراد: الأسماء `laravel` جاية من `laravel-vite-plugin`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 5:** Import / استيراد: الأسماء `react` جاية من `@vitejs/plugin-react`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 6:** Import / استيراد: الأسماء `realpathSync` جاية من `node:fs`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 8:** Export / تصدير تعريف علشان ملف آخر يقدر يستورده. default تصدير أساسي؛ named export يتستورد باسمه. الدوال الموجودة في السطر: `defineConfig(...)`: تساعد في تعريف/توصيف إعداد Vite. القيم المكتوبة هنا: `{     root: realpathSync('.'),     plugins: [         laravel({             input: ['resources/css/app.css', '…`. العائد/الأثر: config؛ لا تشغّل السيرفر بمجرد الاستدعاء.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 9–16

```js
    root: realpathSync('.'),
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
```

**السطر 9:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `realpathSync(...)`: تحل المسار الحقيقي على filesystem. القيم المكتوبة هنا: `'.'`. العائد/الأثر: resolved string/Buffer أو خطأ.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 10:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 11:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `laravel(...)`: تجهز تكامل entry points وrefresh وmanifest. القيم المكتوبة هنا: `{             input: ['resources/css/app.css', 'resources/js/app.jsx'],             refresh: true,         }`. العائد/الأثر: Vite plugin definitions؛ مش PHP server.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 12:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 13:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 14:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 15:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `react(...)`: تنشئ plugin لمعالجة JSX/React وتجربة التطوير. مدخلاتها: options اختيارية. العائد/الأثر: plugin definition.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 16:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 17–18

```js
});

```

**السطر 17:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
