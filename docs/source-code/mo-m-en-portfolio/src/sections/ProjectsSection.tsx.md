# كروت المشاريع المتراكمة بـ sticky

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `mo-m-en-portfolio` · الملف: `src/sections/ProjectsSection.tsx` · 202 سطر.

**وظيفة الملف:** الكروت ثابتة CSS داخل container واحد، وJS يحسب runway للبطاقة الأخيرة. liveUrl optional وغير موجود في البيانات الحالية، فكل Live Project ظاهر غير فعال.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../mo-m-en-portfolio/src/sections/ProjectsSection.tsx). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```tsx
import { useEffect, useRef, type CSSProperties, type Ref } from 'react';

/**
 * ProjectsSection
 * -----------------------------------------------------------------------
 * A dark, full-bleed section that renders a stack of project cards using
 * native CSS `position: sticky`. Each card sticks to the top of the
 * viewport at a slightly increasing offset, so as the user scrolls,
 * cards pile up like a deck of cards with only a thin "lip" of each
 * previous card peeking out above the next one.
 * -----------------------------------------------------------------------
 */

interface Project {
  id: string;
  category: string;
  title: string;
  liveUrl?: string;
  images: {
    topLeft: string;
    bottomLeft: string;
    right: string;
  };
}

const PROJECTS: Project[] = [
  {
    id: 'autocare-pro',
    category: 'Personal',
    title: 'AutoCare Pro',
    images: {
      topLeft: '/autocare-dashboard.webp',
      bottomLeft: '/autocare-details.webp',
      right: '/autocare-home.webp',
    },
  },
  {
    id: 'what-the-crust',
    category: 'Personal',
    title: 'What The Crust',
    images: {
      topLeft: '/pizza-admin.webp',
      bottomLeft: '/pizza-orders.webp',
      right: '/pizza-home.webp',
    },
  },
];

const TOP_OFFSET_BASE = 80; // px, matches top-20
const TOP_OFFSET_STEP = 16; // px added per card index

function LiveProjectPill({ href }: { href?: string }) {
  const className =
    'inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-2.5 text-xs sm:text-sm font-medium uppercase tracking-widest text-white transition-colors duration-200';

  if (!href) {
    return (
      <span
        aria-disabled="true"
        title="Live link coming soon"
        className={`${className} cursor-not-allowed opacity-60`}
      >
        Live Project
      </span>
    );
  }

  return (
    <a
      href={href}
      className={`${className} hover:border-white/40 hover:bg-white/10`}
      target="_blank"
      rel="noreferrer"
    >
      Live Project
    </a>
  );
}

function ProjectCard({ project, index, cardRef }: { project: Project; index: number; cardRef?: Ref<HTMLDivElement> }) {
  const stickyTop = TOP_OFFSET_BASE + index * TOP_OFFSET_STEP;
  const smallImageClassName = 'w-full rounded-2xl object-cover object-top aspect-video';
  const largeImageClassName = 'w-full rounded-2xl object-cover object-top aspect-video sm:h-full';

  const cardStyle: CSSProperties = {
    top: `${stickyTop}px`,
    zIndex: index + 1,
  };

  return (
    <div ref={cardRef} className="sticky" style={cardStyle}>
      <div className="rounded-3xl sm:rounded-[32px] border border-white/10 bg-[#111111] p-6 sm:p-8 shadow-2xl shadow-black/40">
        {/* Card header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="text-white font-black leading-none text-5xl sm:text-6xl md:text-7xl">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 text-xs sm:text-sm font-medium uppercase tracking-widest">
                {project.category}
              </span>
              <span className="text-white text-xl sm:text-2xl md:text-3xl font-semibold">
                {project.title}
              </span>
            </div>
          </div>

          <LiveProjectPill href={project.liveUrl} />
        </div>

        {/* Asymmetrical image grid: 1fr / 2fr */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_2fr] sm:gap-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-1 sm:grid-rows-2 sm:gap-4">
            <img
              src={project.images.topLeft}
              alt={`${project.title} detail 1`}
              loading="lazy"
              decoding="async"
              width="800"
              height="600"
              className={smallImageClassName}
            />
            <img
              src={project.images.bottomLeft}
              alt={`${project.title} detail 2`}
              loading="lazy"
              decoding="async"
              width="800"
              height="600"
              className={smallImageClassName}
            />
          </div>
          <img
            src={project.images.right}
            alt={`${project.title} detail 3`}
            loading="lazy"
            decoding="async"
            width="1200"
            height="900"
            className={largeImageClassName}
          />
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const lastCardRef = useRef<HTMLDivElement>(null);
  const runwayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lastCard = lastCardRef.current;
    const runway = runwayRef.current;
    if (!lastCard || !runway) return;

    const updateRunway = () => {
      const finalStickyTop = TOP_OFFSET_BASE + (PROJECTS.length - 1) * TOP_OFFSET_STEP;
      runway.style.height = `${Math.max(0, window.innerHeight - lastCard.offsetHeight - finalStickyTop)}px`;
    };

    const resizeObserver = new ResizeObserver(updateRunway);
    resizeObserver.observe(lastCard);
    window.addEventListener('resize', updateRunway);
    updateRunway();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateRunway);
    };
  }, []);

  return (
    <section id="projects" className="relative bg-[#0a0a0a] px-4 pt-24 sm:px-6 sm:pt-32 md:px-10">
      <h2
        className="text-center font-black uppercase leading-none tracking-tight mb-16 sm:mb-24 md:mb-28 select-none"
        style={{
          fontSize: 'clamp(3rem, 12vw, 160px)',
          color: 'transparent',
          WebkitTextStroke: '1.5px rgba(255,255,255,0.15)',
        }}
      >
        Project
      </h2>

      <div className="max-w-5xl mx-auto flex flex-col gap-10 sm:gap-14">
        {PROJECTS.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            cardRef={index === PROJECTS.length - 1 ? lastCardRef : undefined}
          />
        ))}
      </div>

      <div ref={runwayRef} aria-hidden="true" />
    </section>
  );
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### PROJECTS

قائمة مشروعين AutoCare وPizza فيها صور وعناوين بلا liveUrl حاليًا.

- **بتاخد إيه؟ Inputs:** Project[] TypeScript

- **بترجع/بتغيّر إيه؟ Return / effect:** array بيانات ثابتة

### LiveProjectPill

لو href ناقص يعرض span aria-disabled، ولو موجود يعرض anchor بتاب جديدة.

- **بتاخد إيه؟ Inputs:** {href?:string}

- **بترجع/بتغيّر إيه؟ Return / effect:** React element؛ مش مستخدم LiveProjectButton legacy

### ProjectCard

يحسب top لكل index وzIndex ويعرض الصور والزر، ويربط cardRef اختياري.

- **بتاخد إيه؟ Inputs:** {project,index,cardRef?}

- **بترجع/بتغيّر إيه؟ Return / effect:** React element مع CSS sticky

### ProjectsSection

يمرر project/index لكل card وref للأخيرة فقط؛ effect يقيسها ليضبط runway.

- **بتاخد إيه؟ Inputs:** لا props

- **بترجع/بتغيّر إيه؟ Return / effect:** React element

### updateRunway

يحسب مساحة بعد الكارت الأخير حتى تنتهي sticky وهو مناسب للشاشة، ويعيد القياس عند resize.

- **بتاخد إيه؟ Inputs:** يقرأ window.innerHeight,lastCard.offsetHeight,PROJECTS.length

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined؛ يكتب runway.style.height

### useEffect

يراقب آخر كارت ResizeObserver ويستمع resize ثم ينظف الاثنين.

- **بتاخد إيه؟ Inputs:** callback,[]

- **بترجع/بتغيّر إيه؟ Return / effect:** cleanup function يرجع من callback، لا يتم إعادة setup على كل render

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### String(index + 1).padStart

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تضيف padding لبداية النص حتى طول محدد.

- **المدخلات — Arguments:** targetLength وpadString.

- **الناتج/الأثر — Return / effect:** نص جديد.

- **أول موضع هنا:** السطر 97، والمدخلات المكتوبة: `2`، `'0'`.

### String

- **جاية منين؟** JavaScript

- **وظيفتها:** تحوّل قيمة إلى نص عند استدعائها بدون new.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 97، والمدخلات المكتوبة: `index + 1`.

### useRef

- **جاية منين؟** React

- **وظيفتها:** مرجع ثابت .current للDOM أو قيمة لا تتطلب render عند تغييرها.

- **المدخلات — Arguments:** initialValue

- **الناتج/الأثر — Return / effect:** MutableRefObject

- **أول موضع هنا:** السطر 151، والمدخلات المكتوبة: `null`.

- **مثال:** const videoRef = useRef<HTMLVideoElement>(null);

### useEffect

- **جاية منين؟** React

- **وظيفتها:** يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies.

- **المدخلات — Arguments:** setup callback, dependencies

- **الناتج/الأثر — Return / effect:** undefined

- **أول موضع هنا:** السطر 153، والمدخلات المكتوبة: `() => {     const lastCard = lastCardRef.current;     const runway = runwayRef.current;     if (!lastCard || !runway) return;      const updateRunway = () => {       const finalSti…`، `[]`.

- **مثال:** useEffect(() => { window.addEventListener('resize', updateRunway); return () => window.removeEventListener('resize', updateRunway); }, []);

### Math.max

- **جاية منين؟** Math / JavaScript

- **وظيفتها:** ترجع أكبر المدخلات.

- **المدخلات — Arguments:** أعداد.

- **الناتج/الأثر — Return / effect:** number.

- **أول موضع هنا:** السطر 160، والمدخلات المكتوبة: `0`، `window.innerHeight - lastCard.offsetHeight - finalStickyTop`.

### ResizeObserver

- **جاية منين؟** Browser

- **وظيفتها:** يراقب تغير حجم عنصر ويشغّل callback؛ cleanup بdisconnect.

- **المدخلات — Arguments:** callback

- **الناتج/الأثر — Return / effect:** observer instance

- **أول موضع هنا:** السطر 163، والمدخلات المكتوبة: `updateRunway`.

- **مثال:** const resizeObserver = new ResizeObserver(updateRunway); resizeObserver.observe(lastCard);

### resizeObserver.observe

- **جاية منين؟** Browser Observer

- **وظيفتها:** تبدأ مراقبة عنصر بالـobserver الحالي.

- **المدخلات — Arguments:** عنصر وخيارات حسب API.

- **الناتج/الأثر — Return / effect:** عادة undefined؛ التقارير تصل للـcallback المسجّلة عند إنشاء observer.

- **أول موضع هنا:** السطر 164، والمدخلات المكتوبة: `lastCard`.

### window.addEventListener

- **جاية منين؟** Browser EventTarget

- **وظيفتها:** تسجّل listener؛ مصدر الحدث يناديها ويمرر Event.

- **المدخلات — Arguments:** اسم الحدث والدالة وخيارات.

- **الناتج/الأثر — Return / effect:** undefined؛ لا تشغّل handler لحظة التسجيل.

- **أول موضع هنا:** السطر 165، والمدخلات المكتوبة: `'resize'`، `updateRunway`.

### updateRunway

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يحسب مساحة بعد الكارت الأخير حتى تنتهي sticky وهو مناسب للشاشة، ويعيد القياس عند resize.

- **المدخلات — Arguments:** يقرأ window.innerHeight,lastCard.offsetHeight,PROJECTS.length

- **الناتج/الأثر — Return / effect:** undefined؛ يكتب runway.style.height

- **أول موضع هنا:** السطر 166.

### resizeObserver.disconnect

- **جاية منين؟** Browser Observer

- **وظيفتها:** توقف مراقبة الأهداف الخاصة بهذا observer.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 169.

### window.removeEventListener

- **جاية منين؟** Browser EventTarget

- **وظيفتها:** تلغي listener بنفس الاسم ومرجع الدالة وcapture المناسب.

- **المدخلات — Arguments:** نوع الحدث والدالة وخيار capture إن لزم.

- **الناتج/الأثر — Return / effect:** undefined؛ لا توقف الحدث نفسه.

- **أول موضع هنا:** السطر 170، والمدخلات المكتوبة: `'resize'`، `updateRunway`.

### PROJECTS.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 188، والمدخلات المكتوبة: `(project, index) => (           <ProjectCard             key={project.id}             project={project}             index={index}             cardRef={index === PROJECTS.length - 1…`.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```tsx
import { useEffect, useRef, type CSSProperties, type Ref } from 'react';

/**
 * ProjectsSection
 * -----------------------------------------------------------------------
 * A dark, full-bleed section that renders a stack of project cards using
 * native CSS `position: sticky`. Each card sticks to the top of the
 * viewport at a slightly increasing offset, so as the user scrolls,
```

**السطر 1:** Import / استيراد: الأسماء `useEffect`، `useRef`، `CSSProperties`، `Ref` جاية من `react`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 3:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 4:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 5:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 6:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 7:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 8:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

### السطور 9–16

```tsx
 * cards pile up like a deck of cards with only a thin "lip" of each
 * previous card peeking out above the next one.
 * -----------------------------------------------------------------------
 */

interface Project {
  id: string;
  category: string;
```

**السطر 9:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 10:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 11:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 12:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 14:** TypeScript type: وصف شكل بيانات/مدخلات وقت الفحص، مش object أو تحقق API وقت التشغيل.

**السطر 15:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 16:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 17–24

```tsx
  title: string;
  liveUrl?: string;
  images: {
    topLeft: string;
    bottomLeft: string;
    right: string;
  };
}
```

**السطر 17:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 18:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 19:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 20:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 21:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 22:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 23:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 24:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 25–32

```tsx

const PROJECTS: Project[] = [
  {
    id: 'autocare-pro',
    category: 'Personal',
    title: 'AutoCare Pro',
    images: {
      topLeft: '/autocare-dashboard.webp',
```

**السطر 26:** Variable declaration / تعريف `PROJECTS` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة الابتدائية Array فيها 2 عنصرًا؛ العناصر نفسها في السطور التالية. دور `PROJECTS` هنا: قائمة مشروعين AutoCare وPizza فيها صور وعناوين بلا liveUrl حاليًا. المدخلات: Project[] TypeScript. الناتج/الأثر: array بيانات ثابتة.

**السطر 27:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 28:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 29:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 30:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 31:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 32:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 33–40

```tsx
      bottomLeft: '/autocare-details.webp',
      right: '/autocare-home.webp',
    },
  },
  {
    id: 'what-the-crust',
    category: 'Personal',
    title: 'What The Crust',
```

**السطر 33:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 34:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 35:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 36:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 37:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 38:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 39:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 40:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 41–48

```tsx
    images: {
      topLeft: '/pizza-admin.webp',
      bottomLeft: '/pizza-orders.webp',
      right: '/pizza-home.webp',
    },
  },
];

```

**السطر 41:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 42:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 43:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 44:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 45:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 46:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 47:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 49–56

```tsx
const TOP_OFFSET_BASE = 80; // px, matches top-20
const TOP_OFFSET_STEP = 16; // px added per card index

function LiveProjectPill({ href }: { href?: string }) {
  const className =
    'inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-2.5 text-xs sm:text-sm font-medium uppercase tracking-widest text-white transition-colors duration-200';

  if (!href) {
```

**السطر 49:** Variable declaration / تعريف `TOP_OFFSET_BASE` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `80`، مش ناتج طلب شبكة.

**السطر 50:** Variable declaration / تعريف `TOP_OFFSET_STEP` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `16`، مش ناتج طلب شبكة.

**السطر 52:** Function / تعريف دالة `LiveProjectPill`؛ تعريفها مش تشغيلها. لو href ناقص يعرض span aria-disabled، ولو موجود يعرض anchor بتاب جديدة. مدخلاتها: {href?:string} ناتجها: React element؛ مش مستخدم LiveProjectButton legacy

**السطر 53:** Variable declaration / تعريف `className` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `"inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-2.5 text-xs sm:text-sm font-medium uppercase tracking-widest text-white transition-colors duration-200"`، مش ناتج طلب شبكة.

**السطر 54:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 56:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

### السطور 57–64

```tsx
    return (
      <span
        aria-disabled="true"
        title="Live link coming soon"
        className={`${className} cursor-not-allowed opacity-60`}
      >
        Live Project
      </span>
```

**السطر 57:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 58:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 59:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 60:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 61:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 62:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 63:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 64:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 65–72

```tsx
    );
  }

  return (
    <a
      href={href}
      className={`${className} hover:border-white/40 hover:bg-white/10`}
      target="_blank"
```

**السطر 65:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 66:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 68:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 69:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 70:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 71:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 72:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

### السطور 73–80

```tsx
      rel="noreferrer"
    >
      Live Project
    </a>
  );
}

function ProjectCard({ project, index, cardRef }: { project: Project; index: number; cardRef?: Ref<HTMLDivElement> }) {
```

**السطر 73:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 74:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 75:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 76:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 77:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 78:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 80:** Function / تعريف دالة `ProjectCard`؛ تعريفها مش تشغيلها. يحسب top لكل index وzIndex ويعرض الصور والزر، ويربط cardRef اختياري. مدخلاتها: {project,index,cardRef?} ناتجها: React element مع CSS sticky

### السطور 81–88

```tsx
  const stickyTop = TOP_OFFSET_BASE + index * TOP_OFFSET_STEP;
  const smallImageClassName = 'w-full rounded-2xl object-cover object-top aspect-video';
  const largeImageClassName = 'w-full rounded-2xl object-cover object-top aspect-video sm:h-full';

  const cardStyle: CSSProperties = {
    top: `${stickyTop}px`,
    zIndex: index + 1,
  };
```

**السطر 81:** Variable declaration / تعريف `stickyTop` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 82:** Variable declaration / تعريف `smallImageClassName` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `"w-full rounded-2xl object-cover object-top aspect-video"`، مش ناتج طلب شبكة.

**السطر 83:** Variable declaration / تعريف `largeImageClassName` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `"w-full rounded-2xl object-cover object-top aspect-video sm:h-full"`، مش ناتج طلب شبكة.

**السطر 85:** Variable declaration / تعريف `cardStyle` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة Object حقولها `top`، `zIndex`.

**السطر 86:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 87:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 88:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 89–96

```tsx

  return (
    <div ref={cardRef} className="sticky" style={cardStyle}>
      <div className="rounded-3xl sm:rounded-[32px] border border-white/10 bg-[#111111] p-6 sm:p-8 shadow-2xl shadow-black/40">
        {/* Card header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="text-white font-black leading-none text-5xl sm:text-6xl md:text-7xl">
```

**السطر 90:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 91:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 92:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 93:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 94:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 95:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 96:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 97–104

```tsx
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 text-xs sm:text-sm font-medium uppercase tracking-widest">
                {project.category}
              </span>
              <span className="text-white text-xl sm:text-2xl md:text-3xl font-semibold">
                {project.title}
```

**السطر 97:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `String(index + 1).padStart(...)`: تضيف padding لبداية النص حتى طول محدد. القيم المكتوبة هنا: `2`، `'0'`. العائد/الأثر: نص جديد.؛ `String(...)`: تحوّل قيمة إلى نص عند استدعائها بدون new. القيم المكتوبة هنا: `index + 1`. العائد/الأثر: string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 98:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 99:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 100:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 101:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 102:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 103:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 104:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 105–112

```tsx
              </span>
            </div>
          </div>

          <LiveProjectPill href={project.liveUrl} />
        </div>

        {/* Asymmetrical image grid: 1fr / 2fr */}
```

**السطر 105:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 106:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 107:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 109:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 110:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 112:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 113–120

```tsx
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_2fr] sm:gap-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-1 sm:grid-rows-2 sm:gap-4">
            <img
              src={project.images.topLeft}
              alt={`${project.title} detail 1`}
              loading="lazy"
              decoding="async"
              width="800"
```

**السطر 113:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 114:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 115:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 116:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 117:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 118:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 119:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 120:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

### السطور 121–128

```tsx
              height="600"
              className={smallImageClassName}
            />
            <img
              src={project.images.bottomLeft}
              alt={`${project.title} detail 2`}
              loading="lazy"
              decoding="async"
```

**السطر 121:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 122:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 123:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 124:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 125:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 126:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 127:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 128:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

### السطور 129–136

```tsx
              width="800"
              height="600"
              className={smallImageClassName}
            />
          </div>
          <img
            src={project.images.right}
            alt={`${project.title} detail 3`}
```

**السطر 129:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 130:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 131:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 132:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 133:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 134:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 135:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 136:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

### السطور 137–144

```tsx
            loading="lazy"
            decoding="async"
            width="1200"
            height="900"
            className={largeImageClassName}
          />
        </div>
      </div>
```

**السطر 137:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 138:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 139:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 140:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 141:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 142:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 143:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 144:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 145–152

```tsx
    </div>
  );
}

export default function ProjectsSection() {
  const lastCardRef = useRef<HTMLDivElement>(null);
  const runwayRef = useRef<HTMLDivElement>(null);

```

**السطر 145:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 146:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 147:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 149:** Function / تعريف دالة `ProjectsSection`؛ تعريفها مش تشغيلها. يمرر project/index لكل card وref للأخيرة فقط؛ effect يقيسها ليضبط runway. مدخلاتها: لا props ناتجها: React element

**السطر 150:** Variable declaration / تعريف `lastCardRef` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useRef(...)`: مرجع ثابت .current للDOM أو قيمة لا تتطلب render عند تغييرها. القيم المكتوبة هنا: `null`. العائد/الأثر: MutableRefObject. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 151:** Variable declaration / تعريف `runwayRef` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useRef(...)`: مرجع ثابت .current للDOM أو قيمة لا تتطلب render عند تغييرها. القيم المكتوبة هنا: `null`. العائد/الأثر: MutableRefObject. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 153–160

```tsx
  useEffect(() => {
    const lastCard = lastCardRef.current;
    const runway = runwayRef.current;
    if (!lastCard || !runway) return;

    const updateRunway = () => {
      const finalStickyTop = TOP_OFFSET_BASE + (PROJECTS.length - 1) * TOP_OFFSET_STEP;
      runway.style.height = `${Math.max(0, window.innerHeight - lastCard.offsetHeight - finalStickyTop)}px`;
```

**السطر 153:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `() => {     const lastCard = lastCardRef.current;     const runway = runwayRef.current;     if (!lastCard || !…`، `[]`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 154:** Variable declaration / تعريف `lastCard` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 155:** Variable declaration / تعريف `runway` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 156:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 158:** Variable declaration / تعريف `updateRunway` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `updateRunway` هنا: يحسب مساحة بعد الكارت الأخير حتى تنتهي sticky وهو مناسب للشاشة، ويعيد القياس عند resize. المدخلات: يقرأ window.innerHeight,lastCard.offsetHeight,PROJECTS.length. الناتج/الأثر: undefined؛ يكتب runway.style.height.

**السطر 159:** Variable declaration / تعريف `finalStickyTop` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 160:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods. الدوال الموجودة في السطر: `Math.max(...)`: ترجع أكبر المدخلات. القيم المكتوبة هنا: `0`، `window.innerHeight - lastCard.offsetHeight - finalStickyTop`. العائد/الأثر: number.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 161–168

```tsx
    };

    const resizeObserver = new ResizeObserver(updateRunway);
    resizeObserver.observe(lastCard);
    window.addEventListener('resize', updateRunway);
    updateRunway();

    return () => {
```

**السطر 161:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 163:** Variable declaration / تعريف `resizeObserver` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ResizeObserver(...)`: يراقب تغير حجم عنصر ويشغّل callback؛ cleanup بdisconnect. القيم المكتوبة هنا: `updateRunway`. العائد/الأثر: observer instance. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 164:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `resizeObserver.observe(...)`: تبدأ مراقبة عنصر بالـobserver الحالي. القيم المكتوبة هنا: `lastCard`. العائد/الأثر: عادة undefined؛ التقارير تصل للـcallback المسجّلة عند إنشاء observer.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 165:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `window.addEventListener(...)`: تسجّل listener؛ مصدر الحدث يناديها ويمرر Event. القيم المكتوبة هنا: `'resize'`، `updateRunway`. العائد/الأثر: undefined؛ لا تشغّل handler لحظة التسجيل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 166:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `updateRunway(...)`: يحسب مساحة بعد الكارت الأخير حتى تنتهي sticky وهو مناسب للشاشة، ويعيد القياس عند resize. مدخلاتها: يقرأ window.innerHeight,lastCard.offsetHeight,PROJECTS.length العائد/الأثر: undefined؛ يكتب runway.style.height. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 168:** Return / رجّع `() => {` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

### السطور 169–176

```tsx
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateRunway);
    };
  }, []);

  return (
    <section id="projects" className="relative bg-[#0a0a0a] px-4 pt-24 sm:px-6 sm:pt-32 md:px-10">
      <h2
```

**السطر 169:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `resizeObserver.disconnect(...)`: توقف مراقبة الأهداف الخاصة بهذا observer. مدخلاتها: بدون مدخلات. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 170:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `window.removeEventListener(...)`: تلغي listener بنفس الاسم ومرجع الدالة وcapture المناسب. القيم المكتوبة هنا: `'resize'`، `updateRunway`. العائد/الأثر: undefined؛ لا توقف الحدث نفسه.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 171:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 172:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 174:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 175:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 176:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 177–184

```tsx
        className="text-center font-black uppercase leading-none tracking-tight mb-16 sm:mb-24 md:mb-28 select-none"
        style={{
          fontSize: 'clamp(3rem, 12vw, 160px)',
          color: 'transparent',
          WebkitTextStroke: '1.5px rgba(255,255,255,0.15)',
        }}
      >
        Project
```

**السطر 177:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 178:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 179:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 180:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 181:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 182:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 183:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 184:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 185–192

```tsx
      </h2>

      <div className="max-w-5xl mx-auto flex flex-col gap-10 sm:gap-14">
        {PROJECTS.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
```

**السطر 185:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 187:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 188:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `PROJECTS.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(project, index) => (           <ProjectCard             key={project.id}             project={project}       …`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 189:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 190:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 191:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 192:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

### السطور 193–200

```tsx
            cardRef={index === PROJECTS.length - 1 ? lastCardRef : undefined}
          />
        ))}
      </div>

      <div ref={runwayRef} aria-hidden="true" />
    </section>
  );
```

**السطر 193:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 194:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 195:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 196:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 198:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 199:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 200:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 201–202

```tsx
}

```

**السطر 201:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
