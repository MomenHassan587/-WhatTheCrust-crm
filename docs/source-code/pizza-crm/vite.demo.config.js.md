# vite.demo.config.js

[فهرس كل الأكواد](../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `vite.demo.config.js` · 15 سطر.

**وظيفة الملف:** إعدادات تطوير/build/dependencies أو اختبار. تفسّرها الأداة المكتوبة في الملف؛ وجود package لا يثبت استخدامها في واجهة نشطة.

**نوعه:** source / مصدر. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../vite.demo.config.js). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { realpathSync } from 'node:fs';

export default defineConfig({
    root: realpathSync('demo'),
    publicDir: false,
    plugins: [react()],
    define: {
        'import.meta.env.VITE_DEMO_MODE': JSON.stringify('true'),
        'import.meta.env.VITE_STRIPE_KEY': JSON.stringify(''),
    },
    build: { outDir: '../dist-demo', emptyOutDir: true },
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

- **أول موضع هنا:** السطر 5، والمدخلات المكتوبة: `{     root: realpathSync('demo'),     publicDir: false,     plugins: [react()],     define: {         'import.meta.env.VITE_DEMO_MODE': JSON.stringify('true'),         'import.meta…`.

### realpathSync

- **جاية منين؟** Node fs

- **وظيفتها:** تحل المسار الحقيقي على filesystem.

- **المدخلات — Arguments:** path.

- **الناتج/الأثر — Return / effect:** resolved string/Buffer أو خطأ.

- **أول موضع هنا:** السطر 6، والمدخلات المكتوبة: `'demo'`.

### react

- **جاية منين؟** Vite React plugin

- **وظيفتها:** تنشئ plugin لمعالجة JSX/React وتجربة التطوير.

- **المدخلات — Arguments:** options اختيارية.

- **الناتج/الأثر — Return / effect:** plugin definition.

- **أول موضع هنا:** السطر 8.

### JSON.stringify

- **جاية منين؟** JavaScript

- **وظيفتها:** يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions.

- **المدخلات — Arguments:** value

- **الناتج/الأثر — Return / effect:** string أو undefined لبعض القيم

- **أول موضع هنا:** السطر 11، والمدخلات المكتوبة: `''`.

- **مثال:** localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { realpathSync } from 'node:fs';

export default defineConfig({
    root: realpathSync('demo'),
    publicDir: false,
    plugins: [react()],
```

**السطر 1:** Import / استيراد: الأسماء `defineConfig` جاية من `vite`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 2:** Import / استيراد: الأسماء `react` جاية من `@vitejs/plugin-react`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 3:** Import / استيراد: الأسماء `realpathSync` جاية من `node:fs`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 5:** Export / تصدير تعريف علشان ملف آخر يقدر يستورده. default تصدير أساسي؛ named export يتستورد باسمه. الدوال الموجودة في السطر: `defineConfig(...)`: تساعد في تعريف/توصيف إعداد Vite. القيم المكتوبة هنا: `{     root: realpathSync('demo'),     publicDir: false,     plugins: [react()],     define: {         'import.…`. العائد/الأثر: config؛ لا تشغّل السيرفر بمجرد الاستدعاء.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 6:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `realpathSync(...)`: تحل المسار الحقيقي على filesystem. القيم المكتوبة هنا: `'demo'`. العائد/الأثر: resolved string/Buffer أو خطأ.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 7:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 8:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `react(...)`: تنشئ plugin لمعالجة JSX/React وتجربة التطوير. مدخلاتها: options اختيارية. العائد/الأثر: plugin definition.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 9–15

```js
    define: {
        'import.meta.env.VITE_DEMO_MODE': JSON.stringify('true'),
        'import.meta.env.VITE_STRIPE_KEY': JSON.stringify(''),
    },
    build: { outDir: '../dist-demo', emptyOutDir: true },
});

```

**السطر 9:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 10:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `'true'`. العائد/الأثر: string أو undefined لبعض القيم. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 11:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `''`. العائد/الأثر: string أو undefined لبعض القيم. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 12:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 13:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 14:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
