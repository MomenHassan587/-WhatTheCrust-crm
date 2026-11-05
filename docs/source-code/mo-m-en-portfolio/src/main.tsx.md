# بداية React في البورتفوليو

[فهرس كل الأكواد](../../../16-all-project-source.md)

المشروع: `mo-m-en-portfolio` · الملف: `src/main.tsx` · 11 سطر.

**وظيفة الملف:** يجد root من HTML ويعمل React root ويرندر App داخل StrictMode. TypeScript ! تأكيد للمترجم، مش حماية runtime.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../mo-m-en-portfolio/src/main.tsx). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [mo-m-en-portfolio/src/App.tsx](App.tsx.md)

- [mo-m-en-portfolio/src/index.css](index.css.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### createRoot(...).render

يربط React بعنصر root ثم يعرض App؛ StrictMode يعمل checks إضافية أثناء dev.

- **بتاخد إيه؟ Inputs:** document.getElementById('root')! ثم React element

- **بترجع/بتغيّر إيه؟ Return / effect:** createRoot يرجع Root؛ render لا يرجع واجهة HTML كنص

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### ReactDOM.createRoot(document.getElementById('root')!).render

- **جاية منين؟** React DOM

- **وظيفتها:** تطلب عرض React node داخل root.

- **المدخلات — Arguments:** شجرة JSX/React node.

- **الناتج/الأثر — Return / effect:** undefined؛ الأثر تحديث DOM.

- **أول موضع هنا:** السطر 6، والمدخلات المكتوبة: `<React.StrictMode>     <App />   </React.StrictMode>`.

### ReactDOM.createRoot

- **جاية منين؟** React DOM

- **وظيفتها:** تجهّز React root داخل عنصر DOM موجود.

- **المدخلات — Arguments:** العنصر.

- **الناتج/الأثر — Return / effect:** Root object نكمل عليها render.

- **أول موضع هنا:** السطر 6، والمدخلات المكتوبة: `document.getElementById('root')!`.

### document.getElementById

- **جاية منين؟** DOM

- **وظيفتها:** تبحث عن عنصر بالـid.

- **المدخلات — Arguments:** id بدون #.

- **الناتج/الأثر — Return / effect:** Element أو null.

- **أول موضع هنا:** السطر 6، والمدخلات المكتوبة: `'root'`.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
```

**السطر 1:** Import / استيراد: الأسماء `React` جاية من `react`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 2:** Import / استيراد: الأسماء `ReactDOM` جاية من `react-dom/client`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 3:** Import / استيراد: الأسماء `App` جاية من `./App`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 4:** Import / استيراد: الأسماء بدون أسماء؛ تشغيل الموديول لأثره جاية من `./index.css`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 6:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `ReactDOM.createRoot(document.getElementById('root')!).render(...)`: تطلب عرض React node داخل root. القيم المكتوبة هنا: `<React.StrictMode>     <App />   </React.StrictMode>`. العائد/الأثر: undefined؛ الأثر تحديث DOM.؛ `ReactDOM.createRoot(...)`: تجهّز React root داخل عنصر DOM موجود. القيم المكتوبة هنا: `document.getElementById('root')!`. العائد/الأثر: Root object نكمل عليها render.؛ `document.getElementById(...)`: تبحث عن عنصر بالـid. القيم المكتوبة هنا: `'root'`. العائد/الأثر: Element أو null.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 7:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 8:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 9–11

```tsx
  </React.StrictMode>
);

```

**السطر 9:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 10:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
