# resources/css/hero-slider.css

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `resources/css/hero-slider.css` · 411 سطر.

**وظيفة الملف:** ملف تنسيقات CSS: selectors تحدد العنصر، وproperties تحدد مظهره وتخطيطه. لا يحتوي backend ولا يحفظ بيانات.

**نوعه:** source / مصدر. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../resources/css/hero-slider.css). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```css
/* resources/css/hero-slider.css */

.premium-hero-slider {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    background:
        radial-gradient(circle at 80% 20%, rgba(227, 36, 36, 0.14), transparent 28rem),
        radial-gradient(circle at 65% 80%, rgba(241, 168, 58, 0.08), transparent 30rem),
        #0a0a0a;
    color: #f5f5f5;
}

.hero-copy {
    max-width: 680px;
    padding-top: 6rem;
    padding-bottom: 4rem;
}

.hero-eyebrow {
    margin-bottom: 1.15rem;
    color: #f1a83a;
    font-size: 0.78rem;
    font-weight: 950;
    letter-spacing: 0.18em;
}

.hero-title {
    margin: 0;
    color: #ffffff;
    font-size: clamp(3.2rem, 7vw, 7.6rem);
    line-height: 0.88;
    font-weight: 1000;
    letter-spacing: 0;
    text-shadow: 0 16px 42px rgba(0, 0, 0, 0.55);
}

.hero-title span {
    display: block;
    color: #e32424;
}

.hero-description {
    max-width: 590px;
    margin-top: 1.5rem;
    color: rgba(245, 245, 245, 0.72);
    font-size: 1rem;
    line-height: 1.85;
}

.hero-btn-primary,
.hero-btn-outline {
    min-height: 50px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.82rem 1.45rem;
    border-radius: 999px;
    font-weight: 950;
}

.hero-btn-primary {
    border: 1px solid #e32424;
    background: #e32424;
    color: #ffffff;
    box-shadow: 0 18px 38px rgba(227, 36, 36, 0.32);
}

.hero-btn-primary:hover {
    border-color: #ff3838;
    background: #ff3838;
    color: #ffffff;
    transform: translateY(-2px);
}

.hero-btn-outline {
    border: 1px solid rgba(255, 255, 255, 0.28);
    background: rgba(255, 255, 255, 0.035);
    color: #ffffff;
}

.hero-btn-outline:hover {
    border-color: rgba(255, 255, 255, 0.55);
    color: #ffffff;
    transform: translateY(-2px);
}

.hero-slide-caption {
    max-width: 440px;
    padding-left: 1rem;
    border-left: 2px solid #e32424;
}

.hero-slide-caption span {
    display: block;
    color: rgba(245, 245, 245, 0.45);
    font-size: 0.74rem;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
}

.hero-slide-caption strong {
    display: block;
    margin-top: 0.35rem;
    color: #ffffff;
    font-size: 1.1rem;
    font-weight: 950;
}

.hero-slide-caption p {
    margin: 0.4rem 0 0;
    color: rgba(245, 245, 245, 0.62);
    line-height: 1.65;
}

.pizza-slider-stage {
    position: relative;
    min-height: 620px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pizza-perspective-scene {
    position: relative;
    width: min(42vw, 620px);
    max-width: 620px;
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    perspective: 1000px;
    pointer-events: none;
}

.pizza-entrance {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    animation: pizzaEntrance 680ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.pizza-turntable {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 50%;
    transform-style: preserve-3d;
    animation: pizzaLazySusanSpin 28s linear infinite;
    will-change: transform;
    box-shadow:
        0 56px 130px rgba(0, 0, 0, 0.72),
        0 18px 48px rgba(227, 36, 36, 0.14),
        inset 0 0 86px rgba(0, 0, 0, 0.34);
}

.pizza-turntable img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
    user-select: none;
    pointer-events: none;
    filter: saturate(1.22) contrast(1.12) brightness(1.02);
}

.pizza-lighting-layer {
    position: absolute;
    inset: 0;
    z-index: 3;
    border-radius: 50%;
    pointer-events: none;
    background:
        radial-gradient(circle at 32% 22%, rgba(255, 255, 255, 0.22), transparent 20%),
        radial-gradient(circle at 72% 70%, rgba(227, 36, 36, 0.16), transparent 28%),
        radial-gradient(circle at 50% 50%, transparent 48%, rgba(10, 10, 10, 0.22) 76%, rgba(10, 10, 10, 0.64) 100%),
        linear-gradient(115deg, rgba(255, 255, 255, 0.1), transparent 32%, transparent 65%, rgba(0, 0, 0, 0.18));
    mix-blend-mode: screen;
}

.pizza-shadow {
    position: absolute;
    left: 8%;
    right: 8%;
    bottom: -9%;
    height: 20%;
    z-index: -1;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.72);
    filter: blur(30px);
    transform: rotateX(65deg);
}

.floating-spice {
    position: absolute;
    z-index: 4;
    width: 13px;
    height: 13px;
    border-radius: 44% 56% 45% 55%;
    pointer-events: none;
    animation: spiceFloat 5.8s ease-in-out infinite;
    filter: drop-shadow(0 10px 16px rgba(0, 0, 0, 0.45));
}

.spice-a {
    top: 18%;
    left: 28%;
    background: #78b83a;
}

.spice-b {
    top: 28%;
    right: 18%;
    width: 9px;
    height: 18px;
    background: #c8191f;
    animation-delay: 0.45s;
}

.spice-c {
    bottom: 24%;
    left: 18%;
    width: 18px;
    height: 12px;
    background: #9a6033;
    animation-delay: 0.9s;
}

.slider-arrow {
    position: absolute;
    top: 50%;
    z-index: 8;
    width: 46px;
    height: 46px;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.045);
    color: #ffffff;
    font-size: 2rem;
    line-height: 1;
    backdrop-filter: blur(10px);
    transform: translateY(-50%);
    transition: 0.22s ease;
}

.slider-arrow:hover {
    border-color: rgba(227, 36, 36, 0.7);
    background: rgba(227, 36, 36, 0.22);
    color: #ffffff;
}

.slider-arrow-left {
    left: 0;
}

.slider-arrow-right {
    right: 0;
}

.slider-dots {
    position: absolute;
    bottom: 2.25rem;
    left: 50%;
    z-index: 9;
    display: inline-flex;
    gap: 0.55rem;
    transform: translateX(-50%);
}

.slider-dots button {
    width: 9px;
    height: 9px;
    border: 0;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.28);
    transition: 0.22s ease;
}

.slider-dots button.active {
    width: 28px;
    background: #e32424;
}

@keyframes pizzaEntrance {
    from {
        opacity: 0;
        transform: scale(0.84) translate3d(52px, 18px, 0) rotateX(52deg);
        filter: blur(8px);
    }

    to {
        opacity: 1;
        transform: scale(1) translate3d(0, 0, 0) rotateX(0deg);
        filter: blur(0);
    }
}

@keyframes pizzaLazySusanSpin {
    from {
        transform: perspective(1000px) rotateX(45deg) rotateZ(0deg) translateZ(0);
    }

    to {
        transform: perspective(1000px) rotateX(45deg) rotateZ(360deg) translateZ(0);
    }
}

@keyframes spiceFloat {
    0%, 100% {
        transform: translate3d(0, 0, 0) rotate(0deg);
        opacity: 0.45;
    }

    50% {
        transform: translate3d(12px, -24px, 0) rotate(24deg);
        opacity: 0.9;
    }
}

@media (max-width: 991px) {
    .premium-hero-slider {
        min-height: auto;
        padding-top: 4rem;
        padding-bottom: 4rem;
    }

    .hero-copy {
        max-width: 720px;
        margin-inline: auto;
        padding-top: 2rem;
        padding-bottom: 1rem;
        text-align: center;
    }

    .hero-title {
        font-size: clamp(3rem, 13vw, 5.7rem);
    }

    .hero-description {
        margin-inline: auto;
    }

    .hero-slide-caption {
        margin-inline: auto;
        text-align: left;
    }

    .pizza-slider-stage {
        min-height: 430px;
    }

    .pizza-perspective-scene {
        width: min(78vw, 380px);
        max-width: 380px;
    }

    .slider-arrow-left {
        left: 1rem;
    }

    .slider-arrow-right {
        right: 1rem;
    }

    .slider-dots {
        bottom: 0;
    }
}

@media (max-width: 575px) {
    .premium-hero-slider {
        padding-top: 3rem;
        padding-bottom: 3rem;
    }

    .hero-title {
        font-size: clamp(2.8rem, 16vw, 4.6rem);
    }

    .hero-btn-primary,
    .hero-btn-outline {
        width: 100%;
    }

    .pizza-slider-stage {
        min-height: 360px;
    }

    .pizza-perspective-scene {
        width: min(84vw, 330px);
        max-width: 330px;
    }

    .slider-arrow {
        width: 40px;
        height: 40px;
        font-size: 1.7rem;
    }

    .slider-arrow-left {
        left: 0;
    }

    .slider-arrow-right {
        right: 0;
    }
}
```

</details>

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```css
/* resources/css/hero-slider.css */

.premium-hero-slider {
    position: relative;
    min-height: 100vh;
    overflow: hidden;
    background:
        radial-gradient(circle at 80% 20%, rgba(227, 36, 36, 0.14), transparent 28rem),
```

**السطر 1:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 3:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 4:** `position`: نوع تموضع العنصر بالقيمة `relative`. القيم هنا تنسيق، مش function JavaScript.

**السطر 5:** `min-height`: أقل ارتفاع بالقيمة `100vh`. القيم هنا تنسيق، مش function JavaScript.

**السطر 6:** `overflow`: التعامل مع المحتوى الزائد بالقيمة `hidden`. القيم هنا تنسيق، مش function JavaScript.

**السطر 7:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 8:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

### السطور 9–16

```css
        radial-gradient(circle at 65% 80%, rgba(241, 168, 58, 0.08), transparent 30rem),
        #0a0a0a;
    color: #f5f5f5;
}

.hero-copy {
    max-width: 680px;
    padding-top: 6rem;
```

**السطر 9:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 10:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 11:** `color`: لون النص بالقيمة `#f5f5f5`. القيم هنا تنسيق، مش function JavaScript.

**السطر 12:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 14:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 15:** `max-width`: أقصى عرض بالقيمة `680px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 16:** `padding-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `6rem`. القيم هنا تنسيق، مش function JavaScript.

### السطور 17–24

```css
    padding-bottom: 4rem;
}

.hero-eyebrow {
    margin-bottom: 1.15rem;
    color: #f1a83a;
    font-size: 0.78rem;
    font-weight: 950;
```

**السطر 17:** `padding-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `4rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 18:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 20:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 21:** `margin-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `1.15rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 22:** `color`: لون النص بالقيمة `#f1a83a`. القيم هنا تنسيق، مش function JavaScript.

**السطر 23:** `font-size`: حجم الخط بالقيمة `0.78rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 24:** `font-weight`: وزن الخط بالقيمة `950`. القيم هنا تنسيق، مش function JavaScript.

### السطور 25–32

```css
    letter-spacing: 0.18em;
}

.hero-title {
    margin: 0;
    color: #ffffff;
    font-size: clamp(3.2rem, 7vw, 7.6rem);
    line-height: 0.88;
```

**السطر 25:** `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `0.18em`. القيم هنا تنسيق، مش function JavaScript.

**السطر 26:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 28:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 29:** `margin`: مسافة خارجية بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 30:** `color`: لون النص بالقيمة `#ffffff`. القيم هنا تنسيق، مش function JavaScript.

**السطر 31:** `font-size`: حجم الخط بالقيمة `clamp(3.2rem, 7vw, 7.6rem)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 32:** `line-height`: ارتفاع سطر النص بالقيمة `0.88`. القيم هنا تنسيق، مش function JavaScript.

### السطور 33–40

```css
    font-weight: 1000;
    letter-spacing: 0;
    text-shadow: 0 16px 42px rgba(0, 0, 0, 0.55);
}

.hero-title span {
    display: block;
    color: #e32424;
```

**السطر 33:** `font-weight`: وزن الخط بالقيمة `1000`. القيم هنا تنسيق، مش function JavaScript.

**السطر 34:** `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 35:** `text-shadow`: ضبط الخاصية المسماة كما في CSS بالقيمة `0 16px 42px rgba(0, 0, 0, 0.55)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 36:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 38:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 39:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`. القيم هنا تنسيق، مش function JavaScript.

**السطر 40:** `color`: لون النص بالقيمة `#e32424`. القيم هنا تنسيق، مش function JavaScript.

### السطور 41–48

```css
}

.hero-description {
    max-width: 590px;
    margin-top: 1.5rem;
    color: rgba(245, 245, 245, 0.72);
    font-size: 1rem;
    line-height: 1.85;
```

**السطر 41:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 43:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 44:** `max-width`: أقصى عرض بالقيمة `590px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 45:** `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `1.5rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 46:** `color`: لون النص بالقيمة `rgba(245, 245, 245, 0.72)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 47:** `font-size`: حجم الخط بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 48:** `line-height`: ارتفاع سطر النص بالقيمة `1.85`. القيم هنا تنسيق، مش function JavaScript.

### السطور 49–56

```css
}

.hero-btn-primary,
.hero-btn-outline {
    min-height: 50px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
```

**السطر 49:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 51:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 52:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 53:** `min-height`: أقل ارتفاع بالقيمة `50px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 54:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `inline-flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 55:** `align-items`: محاذاة على المحور العرضي بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 56:** `justify-content`: توزيع على المحور الرئيسي بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

### السطور 57–64

```css
    padding: 0.82rem 1.45rem;
    border-radius: 999px;
    font-weight: 950;
}

.hero-btn-primary {
    border: 1px solid #e32424;
    background: #e32424;
```

**السطر 57:** `padding`: مسافة داخلية بالقيمة `0.82rem 1.45rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 58:** `border-radius`: تدوير الحواف بالقيمة `999px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 59:** `font-weight`: وزن الخط بالقيمة `950`. القيم هنا تنسيق، مش function JavaScript.

**السطر 60:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 62:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 63:** `border`: حدود العنصر بالقيمة `1px solid #e32424`. القيم هنا تنسيق، مش function JavaScript.

**السطر 64:** `background`: خلفية العنصر بالقيمة `#e32424`. القيم هنا تنسيق، مش function JavaScript.

### السطور 65–72

```css
    color: #ffffff;
    box-shadow: 0 18px 38px rgba(227, 36, 36, 0.32);
}

.hero-btn-primary:hover {
    border-color: #ff3838;
    background: #ff3838;
    color: #ffffff;
```

**السطر 65:** `color`: لون النص بالقيمة `#ffffff`. القيم هنا تنسيق، مش function JavaScript.

**السطر 66:** `box-shadow`: ظل العنصر بالقيمة `0 18px 38px rgba(227, 36, 36, 0.32)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 67:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 69:** `hero-btn-primary`: ضبط الخاصية المسماة كما في CSS بالقيمة `hover`. القيم هنا تنسيق، مش function JavaScript.

**السطر 70:** `border-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `#ff3838`. القيم هنا تنسيق، مش function JavaScript.

**السطر 71:** `background`: خلفية العنصر بالقيمة `#ff3838`. القيم هنا تنسيق، مش function JavaScript.

**السطر 72:** `color`: لون النص بالقيمة `#ffffff`. القيم هنا تنسيق، مش function JavaScript.

### السطور 73–80

```css
    transform: translateY(-2px);
}

.hero-btn-outline {
    border: 1px solid rgba(255, 255, 255, 0.28);
    background: rgba(255, 255, 255, 0.035);
    color: #ffffff;
}
```

**السطر 73:** `transform`: تحويل بصري بدون تعديل ترتيب DOM بالقيمة `translateY(-2px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 74:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 76:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 77:** `border`: حدود العنصر بالقيمة `1px solid rgba(255, 255, 255, 0.28)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 78:** `background`: خلفية العنصر بالقيمة `rgba(255, 255, 255, 0.035)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 79:** `color`: لون النص بالقيمة `#ffffff`. القيم هنا تنسيق، مش function JavaScript.

**السطر 80:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 81–88

```css

.hero-btn-outline:hover {
    border-color: rgba(255, 255, 255, 0.55);
    color: #ffffff;
    transform: translateY(-2px);
}

.hero-slide-caption {
```

**السطر 82:** `hero-btn-outline`: ضبط الخاصية المسماة كما في CSS بالقيمة `hover`. القيم هنا تنسيق، مش function JavaScript.

**السطر 83:** `border-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `rgba(255, 255, 255, 0.55)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 84:** `color`: لون النص بالقيمة `#ffffff`. القيم هنا تنسيق، مش function JavaScript.

**السطر 85:** `transform`: تحويل بصري بدون تعديل ترتيب DOM بالقيمة `translateY(-2px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 86:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 88:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 89–96

```css
    max-width: 440px;
    padding-left: 1rem;
    border-left: 2px solid #e32424;
}

.hero-slide-caption span {
    display: block;
    color: rgba(245, 245, 245, 0.45);
```

**السطر 89:** `max-width`: أقصى عرض بالقيمة `440px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 90:** `padding-left`: ضبط الخاصية المسماة كما في CSS بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 91:** `border-left`: ضبط الخاصية المسماة كما في CSS بالقيمة `2px solid #e32424`. القيم هنا تنسيق، مش function JavaScript.

**السطر 92:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 94:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 95:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`. القيم هنا تنسيق، مش function JavaScript.

**السطر 96:** `color`: لون النص بالقيمة `rgba(245, 245, 245, 0.45)`. القيم هنا تنسيق، مش function JavaScript.

### السطور 97–104

```css
    font-size: 0.74rem;
    font-weight: 900;
    letter-spacing: 0.12em;
    text-transform: uppercase;
}

.hero-slide-caption strong {
    display: block;
```

**السطر 97:** `font-size`: حجم الخط بالقيمة `0.74rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 98:** `font-weight`: وزن الخط بالقيمة `900`. القيم هنا تنسيق، مش function JavaScript.

**السطر 99:** `letter-spacing`: ضبط الخاصية المسماة كما في CSS بالقيمة `0.12em`. القيم هنا تنسيق، مش function JavaScript.

**السطر 100:** `text-transform`: ضبط الخاصية المسماة كما في CSS بالقيمة `uppercase`. القيم هنا تنسيق، مش function JavaScript.

**السطر 101:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 103:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 104:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`. القيم هنا تنسيق، مش function JavaScript.

### السطور 105–112

```css
    margin-top: 0.35rem;
    color: #ffffff;
    font-size: 1.1rem;
    font-weight: 950;
}

.hero-slide-caption p {
    margin: 0.4rem 0 0;
```

**السطر 105:** `margin-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `0.35rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 106:** `color`: لون النص بالقيمة `#ffffff`. القيم هنا تنسيق، مش function JavaScript.

**السطر 107:** `font-size`: حجم الخط بالقيمة `1.1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 108:** `font-weight`: وزن الخط بالقيمة `950`. القيم هنا تنسيق، مش function JavaScript.

**السطر 109:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 111:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 112:** `margin`: مسافة خارجية بالقيمة `0.4rem 0 0`. القيم هنا تنسيق، مش function JavaScript.

### السطور 113–120

```css
    color: rgba(245, 245, 245, 0.62);
    line-height: 1.65;
}

.pizza-slider-stage {
    position: relative;
    min-height: 620px;
    display: flex;
```

**السطر 113:** `color`: لون النص بالقيمة `rgba(245, 245, 245, 0.62)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 114:** `line-height`: ارتفاع سطر النص بالقيمة `1.65`. القيم هنا تنسيق، مش function JavaScript.

**السطر 115:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 117:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 118:** `position`: نوع تموضع العنصر بالقيمة `relative`. القيم هنا تنسيق، مش function JavaScript.

**السطر 119:** `min-height`: أقل ارتفاع بالقيمة `620px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 120:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `flex`. القيم هنا تنسيق، مش function JavaScript.

### السطور 121–128

```css
    align-items: center;
    justify-content: center;
}

.pizza-perspective-scene {
    position: relative;
    width: min(42vw, 620px);
    max-width: 620px;
```

**السطر 121:** `align-items`: محاذاة على المحور العرضي بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 122:** `justify-content`: توزيع على المحور الرئيسي بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 123:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 125:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 126:** `position`: نوع تموضع العنصر بالقيمة `relative`. القيم هنا تنسيق، مش function JavaScript.

**السطر 127:** `width`: العرض بالقيمة `min(42vw, 620px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 128:** `max-width`: أقصى عرض بالقيمة `620px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 129–136

```css
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    perspective: 1000px;
    pointer-events: none;
}

.pizza-entrance {
```

**السطر 129:** `aspect-ratio`: ضبط الخاصية المسماة كما في CSS بالقيمة `1`. القيم هنا تنسيق، مش function JavaScript.

**السطر 130:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `grid`. القيم هنا تنسيق، مش function JavaScript.

**السطر 131:** `place-items`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 132:** `perspective`: ضبط الخاصية المسماة كما في CSS بالقيمة `1000px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 133:** `pointer-events`: استقبال أحداث المؤشر بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 134:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 136:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 137–144

```css
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    animation: pizzaEntrance 680ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.pizza-turntable {
```

**السطر 137:** `position`: نوع تموضع العنصر بالقيمة `relative`. القيم هنا تنسيق، مش function JavaScript.

**السطر 138:** `width`: العرض بالقيمة `100%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 139:** `height`: الارتفاع بالقيمة `100%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 140:** `transform-style`: ضبط الخاصية المسماة كما في CSS بالقيمة `preserve-3d`. القيم هنا تنسيق، مش function JavaScript.

**السطر 141:** `animation`: ضبط الخاصية المسماة كما في CSS بالقيمة `pizzaEntrance 680ms cubic-bezier(0.16, 1, 0.3, 1) both`. القيم هنا تنسيق، مش function JavaScript.

**السطر 142:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 144:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 145–152

```css
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 50%;
    transform-style: preserve-3d;
    animation: pizzaLazySusanSpin 28s linear infinite;
    will-change: transform;
```

**السطر 145:** `position`: نوع تموضع العنصر بالقيمة `relative`. القيم هنا تنسيق، مش function JavaScript.

**السطر 146:** `width`: العرض بالقيمة `100%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 147:** `height`: الارتفاع بالقيمة `100%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 148:** `overflow`: التعامل مع المحتوى الزائد بالقيمة `hidden`. القيم هنا تنسيق، مش function JavaScript.

**السطر 149:** `border-radius`: تدوير الحواف بالقيمة `50%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 150:** `transform-style`: ضبط الخاصية المسماة كما في CSS بالقيمة `preserve-3d`. القيم هنا تنسيق، مش function JavaScript.

**السطر 151:** `animation`: ضبط الخاصية المسماة كما في CSS بالقيمة `pizzaLazySusanSpin 28s linear infinite`. القيم هنا تنسيق، مش function JavaScript.

**السطر 152:** `will-change`: ضبط الخاصية المسماة كما في CSS بالقيمة `transform`. القيم هنا تنسيق، مش function JavaScript.

### السطور 153–160

```css
    box-shadow:
        0 56px 130px rgba(0, 0, 0, 0.72),
        0 18px 48px rgba(227, 36, 36, 0.14),
        inset 0 0 86px rgba(0, 0, 0, 0.34);
}

.pizza-turntable img {
    width: 100%;
```

**السطر 153:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 154:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 155:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 156:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 157:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 159:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 160:** `width`: العرض بالقيمة `100%`. القيم هنا تنسيق، مش function JavaScript.

### السطور 161–168

```css
    height: 100%;
    display: block;
    object-fit: cover;
    object-position: center;
    user-select: none;
    pointer-events: none;
    filter: saturate(1.22) contrast(1.12) brightness(1.02);
}
```

**السطر 161:** `height`: الارتفاع بالقيمة `100%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 162:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `block`. القيم هنا تنسيق، مش function JavaScript.

**السطر 163:** `object-fit`: توزيع الصورة داخل أبعادها بالقيمة `cover`. القيم هنا تنسيق، مش function JavaScript.

**السطر 164:** `object-position`: ضبط الخاصية المسماة كما في CSS بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 165:** `user-select`: ضبط الخاصية المسماة كما في CSS بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 166:** `pointer-events`: استقبال أحداث المؤشر بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 167:** `filter`: تأثير على العنصر ومحتواه بالقيمة `saturate(1.22) contrast(1.12) brightness(1.02)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 168:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 169–176

```css

.pizza-lighting-layer {
    position: absolute;
    inset: 0;
    z-index: 3;
    border-radius: 50%;
    pointer-events: none;
    background:
```

**السطر 170:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 171:** `position`: نوع تموضع العنصر بالقيمة `absolute`. القيم هنا تنسيق، مش function JavaScript.

**السطر 172:** `inset`: ضبط الخاصية المسماة كما في CSS بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 173:** `z-index`: ترتيب الطبقة داخل stacking context بالقيمة `3`. القيم هنا تنسيق، مش function JavaScript.

**السطر 174:** `border-radius`: تدوير الحواف بالقيمة `50%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 175:** `pointer-events`: استقبال أحداث المؤشر بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 176:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

### السطور 177–184

```css
        radial-gradient(circle at 32% 22%, rgba(255, 255, 255, 0.22), transparent 20%),
        radial-gradient(circle at 72% 70%, rgba(227, 36, 36, 0.16), transparent 28%),
        radial-gradient(circle at 50% 50%, transparent 48%, rgba(10, 10, 10, 0.22) 76%, rgba(10, 10, 10, 0.64) 100%),
        linear-gradient(115deg, rgba(255, 255, 255, 0.1), transparent 32%, transparent 65%, rgba(0, 0, 0, 0.18));
    mix-blend-mode: screen;
}

.pizza-shadow {
```

**السطر 177:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 178:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 179:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 180:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 181:** `mix-blend-mode`: ضبط الخاصية المسماة كما في CSS بالقيمة `screen`. القيم هنا تنسيق، مش function JavaScript.

**السطر 182:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 184:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 185–192

```css
    position: absolute;
    left: 8%;
    right: 8%;
    bottom: -9%;
    height: 20%;
    z-index: -1;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.72);
```

**السطر 185:** `position`: نوع تموضع العنصر بالقيمة `absolute`. القيم هنا تنسيق، مش function JavaScript.

**السطر 186:** `left`: المسافة من الشمال بالقيمة `8%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 187:** `right`: المسافة من اليمين بالقيمة `8%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 188:** `bottom`: المسافة من أسفل بالقيمة `-9%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 189:** `height`: الارتفاع بالقيمة `20%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 190:** `z-index`: ترتيب الطبقة داخل stacking context بالقيمة `-1`. القيم هنا تنسيق، مش function JavaScript.

**السطر 191:** `border-radius`: تدوير الحواف بالقيمة `50%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 192:** `background`: خلفية العنصر بالقيمة `rgba(0, 0, 0, 0.72)`. القيم هنا تنسيق، مش function JavaScript.

### السطور 193–200

```css
    filter: blur(30px);
    transform: rotateX(65deg);
}

.floating-spice {
    position: absolute;
    z-index: 4;
    width: 13px;
```

**السطر 193:** `filter`: تأثير على العنصر ومحتواه بالقيمة `blur(30px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 194:** `transform`: تحويل بصري بدون تعديل ترتيب DOM بالقيمة `rotateX(65deg)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 195:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 197:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 198:** `position`: نوع تموضع العنصر بالقيمة `absolute`. القيم هنا تنسيق، مش function JavaScript.

**السطر 199:** `z-index`: ترتيب الطبقة داخل stacking context بالقيمة `4`. القيم هنا تنسيق، مش function JavaScript.

**السطر 200:** `width`: العرض بالقيمة `13px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 201–208

```css
    height: 13px;
    border-radius: 44% 56% 45% 55%;
    pointer-events: none;
    animation: spiceFloat 5.8s ease-in-out infinite;
    filter: drop-shadow(0 10px 16px rgba(0, 0, 0, 0.45));
}

.spice-a {
```

**السطر 201:** `height`: الارتفاع بالقيمة `13px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 202:** `border-radius`: تدوير الحواف بالقيمة `44% 56% 45% 55%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 203:** `pointer-events`: استقبال أحداث المؤشر بالقيمة `none`. القيم هنا تنسيق، مش function JavaScript.

**السطر 204:** `animation`: ضبط الخاصية المسماة كما في CSS بالقيمة `spiceFloat 5.8s ease-in-out infinite`. القيم هنا تنسيق، مش function JavaScript.

**السطر 205:** `filter`: تأثير على العنصر ومحتواه بالقيمة `drop-shadow(0 10px 16px rgba(0, 0, 0, 0.45))`. القيم هنا تنسيق، مش function JavaScript.

**السطر 206:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 208:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 209–216

```css
    top: 18%;
    left: 28%;
    background: #78b83a;
}

.spice-b {
    top: 28%;
    right: 18%;
```

**السطر 209:** `top`: المسافة من أعلى بالقيمة `18%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 210:** `left`: المسافة من الشمال بالقيمة `28%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 211:** `background`: خلفية العنصر بالقيمة `#78b83a`. القيم هنا تنسيق، مش function JavaScript.

**السطر 212:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 214:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 215:** `top`: المسافة من أعلى بالقيمة `28%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 216:** `right`: المسافة من اليمين بالقيمة `18%`. القيم هنا تنسيق، مش function JavaScript.

### السطور 217–224

```css
    width: 9px;
    height: 18px;
    background: #c8191f;
    animation-delay: 0.45s;
}

.spice-c {
    bottom: 24%;
```

**السطر 217:** `width`: العرض بالقيمة `9px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 218:** `height`: الارتفاع بالقيمة `18px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 219:** `background`: خلفية العنصر بالقيمة `#c8191f`. القيم هنا تنسيق، مش function JavaScript.

**السطر 220:** `animation-delay`: ضبط الخاصية المسماة كما في CSS بالقيمة `0.45s`. القيم هنا تنسيق، مش function JavaScript.

**السطر 221:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 223:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 224:** `bottom`: المسافة من أسفل بالقيمة `24%`. القيم هنا تنسيق، مش function JavaScript.

### السطور 225–232

```css
    left: 18%;
    width: 18px;
    height: 12px;
    background: #9a6033;
    animation-delay: 0.9s;
}

.slider-arrow {
```

**السطر 225:** `left`: المسافة من الشمال بالقيمة `18%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 226:** `width`: العرض بالقيمة `18px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 227:** `height`: الارتفاع بالقيمة `12px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 228:** `background`: خلفية العنصر بالقيمة `#9a6033`. القيم هنا تنسيق، مش function JavaScript.

**السطر 229:** `animation-delay`: ضبط الخاصية المسماة كما في CSS بالقيمة `0.9s`. القيم هنا تنسيق، مش function JavaScript.

**السطر 230:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 232:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 233–240

```css
    position: absolute;
    top: 50%;
    z-index: 8;
    width: 46px;
    height: 46px;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.045);
```

**السطر 233:** `position`: نوع تموضع العنصر بالقيمة `absolute`. القيم هنا تنسيق، مش function JavaScript.

**السطر 234:** `top`: المسافة من أعلى بالقيمة `50%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 235:** `z-index`: ترتيب الطبقة داخل stacking context بالقيمة `8`. القيم هنا تنسيق، مش function JavaScript.

**السطر 236:** `width`: العرض بالقيمة `46px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 237:** `height`: الارتفاع بالقيمة `46px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 238:** `border`: حدود العنصر بالقيمة `1px solid rgba(255, 255, 255, 0.16)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 239:** `border-radius`: تدوير الحواف بالقيمة `999px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 240:** `background`: خلفية العنصر بالقيمة `rgba(255, 255, 255, 0.045)`. القيم هنا تنسيق، مش function JavaScript.

### السطور 241–248

```css
    color: #ffffff;
    font-size: 2rem;
    line-height: 1;
    backdrop-filter: blur(10px);
    transform: translateY(-50%);
    transition: 0.22s ease;
}

```

**السطر 241:** `color`: لون النص بالقيمة `#ffffff`. القيم هنا تنسيق، مش function JavaScript.

**السطر 242:** `font-size`: حجم الخط بالقيمة `2rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 243:** `line-height`: ارتفاع سطر النص بالقيمة `1`. القيم هنا تنسيق، مش function JavaScript.

**السطر 244:** `backdrop-filter`: تأثير على المشهد خلف العنصر بالقيمة `blur(10px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 245:** `transform`: تحويل بصري بدون تعديل ترتيب DOM بالقيمة `translateY(-50%)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 246:** `transition`: تنعيم تغيّر خصائص CSS بالقيمة `0.22s ease`. القيم هنا تنسيق، مش function JavaScript.

**السطر 247:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 249–256

```css
.slider-arrow:hover {
    border-color: rgba(227, 36, 36, 0.7);
    background: rgba(227, 36, 36, 0.22);
    color: #ffffff;
}

.slider-arrow-left {
    left: 0;
```

**السطر 249:** `slider-arrow`: ضبط الخاصية المسماة كما في CSS بالقيمة `hover`. القيم هنا تنسيق، مش function JavaScript.

**السطر 250:** `border-color`: ضبط الخاصية المسماة كما في CSS بالقيمة `rgba(227, 36, 36, 0.7)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 251:** `background`: خلفية العنصر بالقيمة `rgba(227, 36, 36, 0.22)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 252:** `color`: لون النص بالقيمة `#ffffff`. القيم هنا تنسيق، مش function JavaScript.

**السطر 253:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 255:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 256:** `left`: المسافة من الشمال بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

### السطور 257–264

```css
}

.slider-arrow-right {
    right: 0;
}

.slider-dots {
    position: absolute;
```

**السطر 257:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 259:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 260:** `right`: المسافة من اليمين بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 261:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 263:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 264:** `position`: نوع تموضع العنصر بالقيمة `absolute`. القيم هنا تنسيق، مش function JavaScript.

### السطور 265–272

```css
    bottom: 2.25rem;
    left: 50%;
    z-index: 9;
    display: inline-flex;
    gap: 0.55rem;
    transform: translateX(-50%);
}

```

**السطر 265:** `bottom`: المسافة من أسفل بالقيمة `2.25rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 266:** `left`: المسافة من الشمال بالقيمة `50%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 267:** `z-index`: ترتيب الطبقة داخل stacking context بالقيمة `9`. القيم هنا تنسيق، مش function JavaScript.

**السطر 268:** `display`: طريقة ترتيب العنصر وأولاده بالقيمة `inline-flex`. القيم هنا تنسيق، مش function JavaScript.

**السطر 269:** `gap`: مسافة بين عناصر layout بالقيمة `0.55rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 270:** `transform`: تحويل بصري بدون تعديل ترتيب DOM بالقيمة `translateX(-50%)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 271:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 273–280

```css
.slider-dots button {
    width: 9px;
    height: 9px;
    border: 0;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.28);
    transition: 0.22s ease;
}
```

**السطر 273:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 274:** `width`: العرض بالقيمة `9px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 275:** `height`: الارتفاع بالقيمة `9px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 276:** `border`: حدود العنصر بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 277:** `border-radius`: تدوير الحواف بالقيمة `999px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 278:** `background`: خلفية العنصر بالقيمة `rgba(255, 255, 255, 0.28)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 279:** `transition`: تنعيم تغيّر خصائص CSS بالقيمة `0.22s ease`. القيم هنا تنسيق، مش function JavaScript.

**السطر 280:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 281–288

```css

.slider-dots button.active {
    width: 28px;
    background: #e32424;
}

@keyframes pizzaEntrance {
    from {
```

**السطر 282:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 283:** `width`: العرض بالقيمة `28px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 284:** `background`: خلفية العنصر بالقيمة `#e32424`. القيم هنا تنسيق، مش function JavaScript.

**السطر 285:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 287:** Animation keyframes: تعريف مراحل حركة CSS؛ التطبيق يتم من خاصية animation.

**السطر 288:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 289–296

```css
        opacity: 0;
        transform: scale(0.84) translate3d(52px, 18px, 0) rotateX(52deg);
        filter: blur(8px);
    }

    to {
        opacity: 1;
        transform: scale(1) translate3d(0, 0, 0) rotateX(0deg);
```

**السطر 289:** `opacity`: شفافية العنصر بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 290:** `transform`: تحويل بصري بدون تعديل ترتيب DOM بالقيمة `scale(0.84) translate3d(52px, 18px, 0) rotateX(52deg)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 291:** `filter`: تأثير على العنصر ومحتواه بالقيمة `blur(8px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 292:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 294:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 295:** `opacity`: شفافية العنصر بالقيمة `1`. القيم هنا تنسيق، مش function JavaScript.

**السطر 296:** `transform`: تحويل بصري بدون تعديل ترتيب DOM بالقيمة `scale(1) translate3d(0, 0, 0) rotateX(0deg)`. القيم هنا تنسيق، مش function JavaScript.

### السطور 297–304

```css
        filter: blur(0);
    }
}

@keyframes pizzaLazySusanSpin {
    from {
        transform: perspective(1000px) rotateX(45deg) rotateZ(0deg) translateZ(0);
    }
```

**السطر 297:** `filter`: تأثير على العنصر ومحتواه بالقيمة `blur(0)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 298:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 299:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 301:** Animation keyframes: تعريف مراحل حركة CSS؛ التطبيق يتم من خاصية animation.

**السطر 302:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 303:** `transform`: تحويل بصري بدون تعديل ترتيب DOM بالقيمة `perspective(1000px) rotateX(45deg) rotateZ(0deg) translateZ(0)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 304:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 305–312

```css

    to {
        transform: perspective(1000px) rotateX(45deg) rotateZ(360deg) translateZ(0);
    }
}

@keyframes spiceFloat {
    0%, 100% {
```

**السطر 306:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 307:** `transform`: تحويل بصري بدون تعديل ترتيب DOM بالقيمة `perspective(1000px) rotateX(45deg) rotateZ(360deg) translateZ(0)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 308:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 309:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 311:** Animation keyframes: تعريف مراحل حركة CSS؛ التطبيق يتم من خاصية animation.

**السطر 312:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 313–320

```css
        transform: translate3d(0, 0, 0) rotate(0deg);
        opacity: 0.45;
    }

    50% {
        transform: translate3d(12px, -24px, 0) rotate(24deg);
        opacity: 0.9;
    }
```

**السطر 313:** `transform`: تحويل بصري بدون تعديل ترتيب DOM بالقيمة `translate3d(0, 0, 0) rotate(0deg)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 314:** `opacity`: شفافية العنصر بالقيمة `0.45`. القيم هنا تنسيق، مش function JavaScript.

**السطر 315:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 317:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 318:** `transform`: تحويل بصري بدون تعديل ترتيب DOM بالقيمة `translate3d(12px, -24px, 0) rotate(24deg)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 319:** `opacity`: شفافية العنصر بالقيمة `0.9`. القيم هنا تنسيق، مش function JavaScript.

**السطر 320:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 321–328

```css
}

@media (max-width: 991px) {
    .premium-hero-slider {
        min-height: auto;
        padding-top: 4rem;
        padding-bottom: 4rem;
    }
```

**السطر 321:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 323:** `max-width`: أقصى عرض بالقيمة `991px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 324:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 325:** `min-height`: أقل ارتفاع بالقيمة `auto`. القيم هنا تنسيق، مش function JavaScript.

**السطر 326:** `padding-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `4rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 327:** `padding-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `4rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 328:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 329–336

```css

    .hero-copy {
        max-width: 720px;
        margin-inline: auto;
        padding-top: 2rem;
        padding-bottom: 1rem;
        text-align: center;
    }
```

**السطر 330:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 331:** `max-width`: أقصى عرض بالقيمة `720px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 332:** `margin-inline`: ضبط الخاصية المسماة كما في CSS بالقيمة `auto`. القيم هنا تنسيق، مش function JavaScript.

**السطر 333:** `padding-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `2rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 334:** `padding-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 335:** `text-align`: محاذاة النص بالقيمة `center`. القيم هنا تنسيق، مش function JavaScript.

**السطر 336:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 337–344

```css

    .hero-title {
        font-size: clamp(3rem, 13vw, 5.7rem);
    }

    .hero-description {
        margin-inline: auto;
    }
```

**السطر 338:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 339:** `font-size`: حجم الخط بالقيمة `clamp(3rem, 13vw, 5.7rem)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 340:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 342:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 343:** `margin-inline`: ضبط الخاصية المسماة كما في CSS بالقيمة `auto`. القيم هنا تنسيق، مش function JavaScript.

**السطر 344:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 345–352

```css

    .hero-slide-caption {
        margin-inline: auto;
        text-align: left;
    }

    .pizza-slider-stage {
        min-height: 430px;
```

**السطر 346:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 347:** `margin-inline`: ضبط الخاصية المسماة كما في CSS بالقيمة `auto`. القيم هنا تنسيق، مش function JavaScript.

**السطر 348:** `text-align`: محاذاة النص بالقيمة `left`. القيم هنا تنسيق، مش function JavaScript.

**السطر 349:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 351:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 352:** `min-height`: أقل ارتفاع بالقيمة `430px`. القيم هنا تنسيق، مش function JavaScript.

### السطور 353–360

```css
    }

    .pizza-perspective-scene {
        width: min(78vw, 380px);
        max-width: 380px;
    }

    .slider-arrow-left {
```

**السطر 353:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 355:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 356:** `width`: العرض بالقيمة `min(78vw, 380px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 357:** `max-width`: أقصى عرض بالقيمة `380px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 358:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 360:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 361–368

```css
        left: 1rem;
    }

    .slider-arrow-right {
        right: 1rem;
    }

    .slider-dots {
```

**السطر 361:** `left`: المسافة من الشمال بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 362:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 364:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 365:** `right`: المسافة من اليمين بالقيمة `1rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 366:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 368:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 369–376

```css
        bottom: 0;
    }
}

@media (max-width: 575px) {
    .premium-hero-slider {
        padding-top: 3rem;
        padding-bottom: 3rem;
```

**السطر 369:** `bottom`: المسافة من أسفل بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 370:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 371:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 373:** `max-width`: أقصى عرض بالقيمة `575px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 374:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 375:** `padding-top`: ضبط الخاصية المسماة كما في CSS بالقيمة `3rem`. القيم هنا تنسيق، مش function JavaScript.

**السطر 376:** `padding-bottom`: ضبط الخاصية المسماة كما في CSS بالقيمة `3rem`. القيم هنا تنسيق، مش function JavaScript.

### السطور 377–384

```css
    }

    .hero-title {
        font-size: clamp(2.8rem, 16vw, 4.6rem);
    }

    .hero-btn-primary,
    .hero-btn-outline {
```

**السطر 377:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 379:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 380:** `font-size`: حجم الخط بالقيمة `clamp(2.8rem, 16vw, 4.6rem)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 381:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 383:** تكملة/نهاية قاعدة CSS؛ الأقواس بتحدد حدود القاعدة، ومش تعديل state.

**السطر 384:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 385–392

```css
        width: 100%;
    }

    .pizza-slider-stage {
        min-height: 360px;
    }

    .pizza-perspective-scene {
```

**السطر 385:** `width`: العرض بالقيمة `100%`. القيم هنا تنسيق، مش function JavaScript.

**السطر 386:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 388:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 389:** `min-height`: أقل ارتفاع بالقيمة `360px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 390:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 392:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

### السطور 393–400

```css
        width: min(84vw, 330px);
        max-width: 330px;
    }

    .slider-arrow {
        width: 40px;
        height: 40px;
        font-size: 1.7rem;
```

**السطر 393:** `width`: العرض بالقيمة `min(84vw, 330px)`. القيم هنا تنسيق، مش function JavaScript.

**السطر 394:** `max-width`: أقصى عرض بالقيمة `330px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 395:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 397:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 398:** `width`: العرض بالقيمة `40px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 399:** `height`: الارتفاع بالقيمة `40px`. القيم هنا تنسيق، مش function JavaScript.

**السطر 400:** `font-size`: حجم الخط بالقيمة `1.7rem`. القيم هنا تنسيق، مش function JavaScript.

### السطور 401–408

```css
    }

    .slider-arrow-left {
        left: 0;
    }

    .slider-arrow-right {
        right: 0;
```

**السطر 401:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 403:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 404:** `left`: المسافة من الشمال بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

**السطر 405:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 407:** Selector: بداية مجموعة قواعد للعناصر اللي تطابق المحدد المكتوب؛ النقطة class و# تعني id.

**السطر 408:** `right`: المسافة من اليمين بالقيمة `0`. القيم هنا تنسيق، مش function JavaScript.

### السطور 409–411

```css
    }
}

```

**السطر 409:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 410:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
