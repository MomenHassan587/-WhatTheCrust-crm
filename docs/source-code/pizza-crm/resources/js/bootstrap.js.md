# علامة جاهزية مستند HTML

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `resources/js/bootstrap.js` · 5 سطر.

**وظيفة الملف:** يسجّل DOMContentLoaded ويضيف app-ready على body؛ ده مش Bootstrap CSS framework ولا مكان تشغيل React.

**نوعه:** support. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../resources/js/bootstrap.js). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```js
// resources/js/bootstrap.js

window.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('app-ready');
});
```

</details>

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### window.addEventListener

- **جاية منين؟** Browser EventTarget

- **وظيفتها:** تسجّل listener؛ مصدر الحدث يناديها ويمرر Event.

- **المدخلات — Arguments:** اسم الحدث والدالة وخيارات.

- **الناتج/الأثر — Return / effect:** undefined؛ لا تشغّل handler لحظة التسجيل.

- **أول موضع هنا:** السطر 3، والمدخلات المكتوبة: `'DOMContentLoaded'`، `() => {     document.body.classList.add('app-ready'); }`.

### document.body.classList.add

- **جاية منين؟** Set أو DOMTokenList

- **وظيفتها:** تضيف قيمة Set أو كلاس إلى classList حسب المستقبِل.

- **المدخلات — Arguments:** القيمة أو اسم الكلاس.

- **الناتج/الأثر — Return / effect:** Set نفسها عند Set.add؛ undefined عند classList.add.

- **أول موضع هنا:** السطر 4، والمدخلات المكتوبة: `'app-ready'`.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–5

```js
// resources/js/bootstrap.js

window.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('app-ready');
});
```

**السطر 1:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 3:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `window.addEventListener(...)`: تسجّل listener؛ مصدر الحدث يناديها ويمرر Event. القيم المكتوبة هنا: `'DOMContentLoaded'`، `() => {     document.body.classList.add('app-ready'); }`. العائد/الأثر: undefined؛ لا تشغّل handler لحظة التسجيل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 4:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `document.body.classList.add(...)`: تضيف قيمة Set أو كلاس إلى classList حسب المستقبِل. القيم المكتوبة هنا: `'app-ready'`. العائد/الأثر: Set نفسها عند Set.add؛ undefined عند classList.add.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 5:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
