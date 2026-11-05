# src/index.css

[فهرس كل الأكواد](../../../16-all-project-source.md)

المشروع: `mo-m-en-portfolio` · الملف: `src/index.css` · 44 سطر.

**وظيفة الملف:** ملف تنسيقات CSS: selectors تحدد العنصر، وproperties تحدد مظهره وتخطيطه. لا يحتوي backend ولا يحفظ بيانات.

**نوعه:** source / مصدر. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../mo-m-en-portfolio/src/index.css). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
}

html,
body,
#root {
  margin: 0;
  padding: 0;
  background: #0c0c0c;
  min-height: 100%;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Kanit', sans-serif;
}

.hero-heading {
  background: linear-gradient(180deg, #646973 0%, #bbccd7 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

</details>

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
}

```

**السطر 1:** تعليمة CSS/build بحسب الاسم المكتوب؛ مش دالة Vue.

**السطر 2:** تعليمة CSS/build بحسب الاسم المكتوب؛ مش دالة Vue.

**السطر 3:** تعليمة CSS/build بحسب الاسم المكتوب؛ مش دالة Vue.

**السطر 5:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 6:** `box-sizing`: ضبط الخاصية المسماة كما في CSS بالقيمة `border-box`. القيم هنا تنسيق، مش function JavaScript.

**السطر 7:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 9–16

```css
html,
body,
#root {
  margin: 0;
  padding: 0;
  background: #0c0c0c;
  min-height: 100%;
}
```

**السطر 9:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 10:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 11:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 12:** `margin`: مسافة خارجية بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 13:** `padding`: مسافة داخلية بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 14:** `background`: خلفية العنصر بالقيمة `#0c0c0c`. القيم هنا تنسيق، مش function JavaScript.

**السطر 15:** `min-height`: أقل ارتفاع بالقيمة `100%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 16:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 17–24

```css

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Kanit', sans-serif;
}
```

**السطر 18:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 19:** `scroll-behavior`: ضبط الخاصية المسماة كما في CSS بالقيمة `smooth`. القيم هنا تنسيق، مش function JavaScript.

**السطر 20:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 22:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 23:** `font-family`: ضبط الخاصية المسماة كما في CSS بالقيمة `'Kanit', sans-serif`. القيم هنا تنسيق، مش function JavaScript.

**السطر 24:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 25–32

```css

.hero-heading {
  background: linear-gradient(180deg, #646973 0%, #bbccd7 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
```

**السطر 26:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 27:** `background`: خلفية العنصر بالقيمة `linear-gradient(180deg, #646973 0%, #bbccd7 100%)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 28:** `-webkit-background-clip`: ضبط الخاصية المسماة كما في CSS بالقيمة `text`. القيم هنا تنسيق، مش function JavaScript.

**السطر 29:** `background-clip`: ضبط الخاصية المسماة كما في CSS بالقيمة `text`. القيم هنا تنسيق، مش function JavaScript.

**السطر 30:** `-webkit-text-fill-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `transparent`. القيم هنا تنسيق، مش function JavaScript.

**السطر 31:** `color`: لون النص بالقيمة `transparent`. القيم هنا تنسيق، مش function JavaScript.

**السطر 32:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 33–40

```css

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
```

**السطر 34:** `prefers-reduced-motion`: ضبط الخاصية المسماة كما في CSS بالقيمة `reduce)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 35:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 36:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 37:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 38:** `animation-duration`: ضبط الخاصية المسماة كما في CSS بالقيمة `0.01ms !important`. القيم هنا تنسيق، مش function JavaScript.

**السطر 39:** `animation-iteration-count`: ضبط الخاصية المسماة كما في CSS بالقيمة `1 !important`. القيم هنا تنسيق، مش function JavaScript.

**السطر 40:** `transition-duration`: ضبط الخاصية المسماة كما في CSS بالقيمة `0.01ms !important`. القيم هنا تنسيق، مش function JavaScript.

### السطور 41–44

```css
    scroll-behavior: auto !important;
  }
}

```

**السطر 41:** `scroll-behavior`: ضبط الخاصية المسماة كما في CSS بالقيمة `auto !important`. القيم هنا تنسيق، مش function JavaScript.

**السطر 42:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 43:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
