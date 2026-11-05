# مجموعات المهارات من array متداخلة

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `mo-m-en-portfolio` · الملف: `src/sections/SkillsSection.tsx` · 64 سطر.

**وظيفة الملف:** map الأولى تعمل card لكل مجموعة، والثانية تعمل li لكل مهارة. delays مشتقة من index.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../mo-m-en-portfolio/src/sections/SkillsSection.tsx). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [mo-m-en-portfolio/src/components/FadeIn.tsx](../components/FadeIn.tsx.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```tsx
import FadeIn from '../components/FadeIn';

const SKILL_GROUPS = [
  {
    number: '01',
    title: 'Frontend Development',
    description: 'Building responsive, interactive interfaces with modern component-based frameworks and styling tools.',
    skills: ['HTML5', 'CSS3', 'Sass', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Tailwind CSS', 'Bootstrap', 'React Router', 'Framer Motion'],
  },
  {
    number: '02',
    title: 'Backend Development',
    description: 'Developing application logic, APIs, authentication flows, payments, and data-driven features.',
    skills: ['PHP', 'Laravel', 'REST APIs', 'Authentication', 'Authorization', 'Eloquent ORM', 'MySQL', 'Database Migrations', 'Stripe', 'Webhooks'],
  },
  {
    number: '03',
    title: 'Tools & Workflow',
    description: 'The development tools and practices I use to build, test, optimize, and maintain projects.',
    skills: ['Git & GitHub', 'Vite', 'npm', 'Composer', 'XAMPP', 'Axios', 'PHPUnit', 'Feature Testing', 'Responsive Design', 'Performance Optimization'],
  },
];

export default function SkillsSection() {
  return (
    <section id="skills" className="bg-[#0C0C0C] px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-32 scroll-mt-8">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="mb-14 flex flex-col gap-5 sm:mb-20 md:flex-row md:items-end md:justify-between">
            <h2
              className="hero-heading font-black uppercase leading-none tracking-tight"
              style={{ fontSize: 'clamp(3rem, 12vw, 150px)' }}
            >
              Skills
            </h2>
            <p className="max-w-md text-sm font-light leading-relaxed text-[#D7E2EA]/70 sm:text-base">
              Technologies I have used across frontend, backend, and full-stack projects—from responsive interfaces to APIs, databases, and payments.
            </p>
          </div>
        </FadeIn>

        <div className="grid gap-4 lg:grid-cols-3">
          {SKILL_GROUPS.map((group, index) => (
            <FadeIn key={group.title} delay={index * 0.1} className="h-full">
              <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-[#111111] p-6 sm:p-8">
                <span className="mb-10 text-sm font-medium tracking-[0.2em] text-[#D7E2EA]/45">{group.number}</span>
                <h3 className="mb-3 text-2xl font-semibold uppercase text-white sm:text-3xl">{group.title}</h3>
                <p className="mb-8 text-sm font-light leading-relaxed text-[#D7E2EA]/65 sm:text-base">{group.description}</p>
                <ul className="mt-auto flex flex-wrap gap-2" aria-label={`${group.title} skills`}>
                  {group.skills.map((skill) => (
                    <li key={skill} className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-[#D7E2EA] sm:text-sm">
                      {skill}
                    </li>
                  ))}
                </ul>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### SKILL_GROUPS

بيانات number/title/description/skills؛ skills array داخل كل object.

- **بتاخد إيه؟ Inputs:** لا شيء

- **بترجع/بتغيّر إيه؟ Return / effect:** array

### SkillsSection

يرندر مجموعات ومهاراتها مع key ثابت لكل مجموعة ومهارة.

- **بتاخد إيه؟ Inputs:** لا props

- **بترجع/بتغيّر إيه؟ Return / effect:** React element

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### SKILL_GROUPS.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 43، والمدخلات المكتوبة: `(group, index) => (             <FadeIn key={group.title} delay={index * 0.1} className="h-full">               <article className="flex h-full flex-col rounded-3xl border border-w…`.

### group.skills.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 50، والمدخلات المكتوبة: `(skill) => (                     <li key={skill} className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-[#D7E2EA] sm:text-sm">                       {s…`.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```tsx
import FadeIn from '../components/FadeIn';

const SKILL_GROUPS = [
  {
    number: '01',
    title: 'Frontend Development',
    description: 'Building responsive, interactive interfaces with modern component-based frameworks and styling tools.',
    skills: ['HTML5', 'CSS3', 'Sass', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Tailwind CSS', 'Bootstrap', 'React Router', 'Framer Motion'],
```

**السطر 1:** Import / استيراد: الأسماء `FadeIn` جاية من `../components/FadeIn`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 3:** Variable declaration / تعريف `SKILL_GROUPS` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة الابتدائية Array فيها 3 عنصرًا؛ العناصر نفسها في السطور التالية. دور `SKILL_GROUPS` هنا: بيانات number/title/description/skills؛ skills array داخل كل object. المدخلات: لا شيء. الناتج/الأثر: array.

**السطر 4:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 5:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 6:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 7:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 8:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 9–16

```tsx
  },
  {
    number: '02',
    title: 'Backend Development',
    description: 'Developing application logic, APIs, authentication flows, payments, and data-driven features.',
    skills: ['PHP', 'Laravel', 'REST APIs', 'Authentication', 'Authorization', 'Eloquent ORM', 'MySQL', 'Database Migrations', 'Stripe', 'Webhooks'],
  },
  {
```

**السطر 9:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 10:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 11:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 12:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 13:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 14:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 15:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 16:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 17–24

```tsx
    number: '03',
    title: 'Tools & Workflow',
    description: 'The development tools and practices I use to build, test, optimize, and maintain projects.',
    skills: ['Git & GitHub', 'Vite', 'npm', 'Composer', 'XAMPP', 'Axios', 'PHPUnit', 'Feature Testing', 'Responsive Design', 'Performance Optimization'],
  },
];

export default function SkillsSection() {
```

**السطر 17:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 18:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 19:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 20:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 21:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 22:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 24:** Function / تعريف دالة `SkillsSection`؛ تعريفها مش تشغيلها. يرندر مجموعات ومهاراتها مع key ثابت لكل مجموعة ومهارة. مدخلاتها: لا props ناتجها: React element

### السطور 25–32

```tsx
  return (
    <section id="skills" className="bg-[#0C0C0C] px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-32 scroll-mt-8">
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <div className="mb-14 flex flex-col gap-5 sm:mb-20 md:flex-row md:items-end md:justify-between">
            <h2
              className="hero-heading font-black uppercase leading-none tracking-tight"
              style={{ fontSize: 'clamp(3rem, 12vw, 150px)' }}
```

**السطر 25:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 26:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 27:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 28:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 29:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 30:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 31:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 32:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

### السطور 33–40

```tsx
            >
              Skills
            </h2>
            <p className="max-w-md text-sm font-light leading-relaxed text-[#D7E2EA]/70 sm:text-base">
              Technologies I have used across frontend, backend, and full-stack projects—from responsive interfaces to APIs, databases, and payments.
            </p>
          </div>
        </FadeIn>
```

**السطر 33:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 34:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 35:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 36:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 37:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 38:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 39:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 40:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 41–48

```tsx

        <div className="grid gap-4 lg:grid-cols-3">
          {SKILL_GROUPS.map((group, index) => (
            <FadeIn key={group.title} delay={index * 0.1} className="h-full">
              <article className="flex h-full flex-col rounded-3xl border border-white/10 bg-[#111111] p-6 sm:p-8">
                <span className="mb-10 text-sm font-medium tracking-[0.2em] text-[#D7E2EA]/45">{group.number}</span>
                <h3 className="mb-3 text-2xl font-semibold uppercase text-white sm:text-3xl">{group.title}</h3>
                <p className="mb-8 text-sm font-light leading-relaxed text-[#D7E2EA]/65 sm:text-base">{group.description}</p>
```

**السطر 42:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 43:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `SKILL_GROUPS.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(group, index) => (             <FadeIn key={group.title} delay={index * 0.1} className="h-full">             …`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 44:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 45:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 46:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 47:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 48:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 49–56

```tsx
                <ul className="mt-auto flex flex-wrap gap-2" aria-label={`${group.title} skills`}>
                  {group.skills.map((skill) => (
                    <li key={skill} className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-[#D7E2EA] sm:text-sm">
                      {skill}
                    </li>
                  ))}
                </ul>
              </article>
```

**السطر 49:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 50:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `group.skills.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(skill) => (                     <li key={skill} className="rounded-full border border-white/15 px-3 py-1.5 te…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 51:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 52:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 53:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 54:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 55:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 56:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 57–64

```tsx
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

```

**السطر 57:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 58:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 59:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 60:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 61:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 62:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 63:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
