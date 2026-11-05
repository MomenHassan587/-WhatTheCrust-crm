# vite.config.js

[فهرس كل الأكواد](../../16-all-project-source.md)

المشروع: `autocare-booking` · الملف: `vite.config.js` · 13 سطر.

**وظيفة الملف:** إعدادات تطوير/build/dependencies أو اختبار. تفسّرها الأداة المكتوبة في الملف؛ وجود package لا يثبت استخدامها في واجهة نشطة.

**نوعه:** source / مصدر. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../autocare-booking/vite.config.js). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        vue(),
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

- **أول موضع هنا:** السطر 5، والمدخلات المكتوبة: `{     plugins: [         laravel({             input: ['resources/css/app.css', 'resources/js/app.js'],             refresh: true,         }),         vue(),     ], }`.

### laravel

- **جاية منين؟** Laravel Vite plugin

- **وظيفتها:** تجهز تكامل entry points وrefresh وmanifest.

- **المدخلات — Arguments:** input/config.

- **الناتج/الأثر — Return / effect:** Vite plugin definitions؛ مش PHP server.

- **أول موضع هنا:** السطر 7، والمدخلات المكتوبة: `{             input: ['resources/css/app.css', 'resources/js/app.js'],             refresh: true,         }`.

### vue

- **جاية منين؟** Vite Vue plugin

- **وظيفتها:** تنشئ plugin لمعالجة ملفات .vue.

- **المدخلات — Arguments:** options اختيارية.

- **الناتج/الأثر — Return / effect:** plugin definition للبناء والتطوير.

- **أول موضع هنا:** السطر 11.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```js
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
```

**السطر 1:** Import / استيراد: الأسماء `defineConfig` جاية من `vite`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 2:** Import / استيراد: الأسماء `laravel` جاية من `laravel-vite-plugin`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 3:** Import / استيراد: الأسماء `vue` جاية من `@vitejs/plugin-vue`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 5:** Export / تصدير تعريف علشان ملف آخر يقدر يستورده. default تصدير أساسي؛ named export يتستورد باسمه. الدوال الموجودة في السطر: `defineConfig(...)`: تساعد في تعريف/توصيف إعداد Vite. القيم المكتوبة هنا: `{     plugins: [         laravel({             input: ['resources/css/app.css', 'resources/js/app.js'],       …`. العائد/الأثر: config؛ لا تشغّل السيرفر بمجرد الاستدعاء.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 6:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 7:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `laravel(...)`: تجهز تكامل entry points وrefresh وmanifest. القيم المكتوبة هنا: `{             input: ['resources/css/app.css', 'resources/js/app.js'],             refresh: true,         }`. العائد/الأثر: Vite plugin definitions؛ مش PHP server.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 8:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 9–13

```js
            refresh: true,
        }),
        vue(),
    ],
});
```

**السطر 9:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 10:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 11:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `vue(...)`: تنشئ plugin لمعالجة ملفات .vue. مدخلاتها: options اختيارية. العائد/الأثر: plugin definition للبناء والتطوير.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 12:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 13:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
