# إضاءة حروف النص حسب scroll

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `mo-m-en-portfolio` · الملف: `src/components/AnimatedText.tsx` · 56 سطر.

**وظيفة الملف:** الأب يقسم النص لحروف ويمرر scrollYProgress؛ كل Char تحول جزء من التقدم إلى opacity. الاسم متغير ref هنا مش Vue ref.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../mo-m-en-portfolio/src/components/AnimatedText.tsx). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [mo-m-en-portfolio/src/sections/AboutSection.tsx](../sections/AboutSection.tsx.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```tsx
import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

interface CharProps {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

function Char({ char, index, total, progress }: CharProps) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ visibility: 'hidden' }}>{char === ' ' ? '\u00A0' : char}</span>
      <motion.span
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          opacity,
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    </span>
  );
}

export default function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const chars = text.split('');

  return (
    <p ref={ref} className={className} style={style}>
      {chars.map((char, i) => (
        <Char key={i} char={char} index={i} total={chars.length} progress={scrollYProgress} />
      ))}
    </p>
  );
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### AnimatedText

يربط paragraph بuseScroll، يحوّل النص لحروف ويكرر Char.

- **بتاخد إيه؟ Inputs:** {text,className?,style?}

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX paragraph

### Char

يحدد مدى ظهور حرف واحد من index/total ويعرض نسخة مخفية لحجز المساحة وmotion span مرئي.

- **بتاخد إيه؟ Inputs:** {char,index,total,progress}

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX span؛ opacity MotionValue من useTransform

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### useTransform

- **جاية منين؟** Framer Motion

- **وظيفتها:** يشتق MotionValue من آخر بربط مدى input إلى مدى output.

- **المدخلات — Arguments:** motionValue,inputRange,outputRange

- **الناتج/الأثر — Return / effect:** MotionValue

- **أول موضع هنا:** السطر 20، والمدخلات المكتوبة: `progress`، `[start, end]`، `[0.2, 1]`.

- **مثال:** const opacity = useTransform(progress, [start,end], [0.2,1]);

### useRef

- **جاية منين؟** React

- **وظيفتها:** مرجع ثابت .current للDOM أو قيمة لا تتطلب render عند تغييرها.

- **المدخلات — Arguments:** initialValue

- **الناتج/الأثر — Return / effect:** MutableRefObject

- **أول موضع هنا:** السطر 40، والمدخلات المكتوبة: `null`.

- **مثال:** const videoRef = useRef<HTMLVideoElement>(null);

### useScroll

- **جاية منين؟** Framer Motion

- **وظيفتها:** يرجع MotionValues لتقدم/مواضع scroll مرتبطة target وoffset.

- **المدخلات — Arguments:** {target,offset}

- **الناتج/الأثر — Return / effect:** object مثل scrollYProgress

- **أول موضع هنا:** السطر 41، والمدخلات المكتوبة: `{     target: ref,     offset: ['start 0.8', 'end 0.2'],   }`.

- **مثال:** const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8','end 0.2'] });

### text.split

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تقسم النص لأجزاء.

- **المدخلات — Arguments:** separator وlimit اختيارية.

- **الناتج/الأثر — Return / effect:** array نصوص.

- **أول موضع هنا:** السطر 46، والمدخلات المكتوبة: `''`.

### chars.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 50، والمدخلات المكتوبة: `(char, i) => (         <Char key={i} char={char} index={i} total={chars.length} progress={scrollYProgress} />       )`.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```tsx
import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}
```

**السطر 1:** Import / استيراد: الأسماء `useRef` جاية من `react`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 2:** Import / استيراد: الأسماء `motion`، `useScroll`، `useTransform`، `MotionValue` جاية من `framer-motion`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 4:** TypeScript type: وصف شكل بيانات/مدخلات وقت الفحص، مش object أو تحقق API وقت التشغيل.

**السطر 5:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 6:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 7:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 8:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 9–16

```tsx

interface CharProps {
  char: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

```

**السطر 10:** TypeScript type: وصف شكل بيانات/مدخلات وقت الفحص، مش object أو تحقق API وقت التشغيل.

**السطر 11:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 12:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 13:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 14:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 15:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 17–24

```tsx
function Char({ char, index, total, progress }: CharProps) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ visibility: 'hidden' }}>{char === ' ' ? '\u00A0' : char}</span>
```

**السطر 17:** Function / تعريف دالة `Char`؛ تعريفها مش تشغيلها. يحدد مدى ظهور حرف واحد من index/total ويعرض نسخة مخفية لحجز المساحة وmotion span مرئي. مدخلاتها: {char,index,total,progress} ناتجها: JSX span؛ opacity MotionValue من useTransform

**السطر 18:** Variable declaration / تعريف `start` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 19:** Variable declaration / تعريف `end` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 20:** Variable declaration / تعريف `opacity` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useTransform(...)`: يشتق MotionValue من آخر بربط مدى input إلى مدى output. القيم المكتوبة هنا: `progress`، `[start, end]`، `[0.2, 1]`. العائد/الأثر: MotionValue. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 22:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 23:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 24:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 25–32

```tsx
      <motion.span
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          opacity,
        }}
      >
```

**السطر 25:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 26:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 27:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 28:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 29:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 30:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 31:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 32:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 33–40

```tsx
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    </span>
  );
}

export default function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
```

**السطر 33:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 34:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 35:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 36:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 37:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 39:** Function / تعريف دالة `AnimatedText`؛ تعريفها مش تشغيلها. يربط paragraph بuseScroll، يحوّل النص لحروف ويكرر Char. مدخلاتها: {text,className?,style?} ناتجها: JSX paragraph

**السطر 40:** Variable declaration / تعريف `ref` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useRef(...)`: مرجع ثابت .current للDOM أو قيمة لا تتطلب render عند تغييرها. القيم المكتوبة هنا: `null`. العائد/الأثر: MutableRefObject. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 41–48

```tsx
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const chars = text.split('');

  return (
```

**السطر 41:** Variable declaration / تعريف اسم/أسماء لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useScroll(...)`: يرجع MotionValues لتقدم/مواضع scroll مرتبطة target وoffset. القيم المكتوبة هنا: `{     target: ref,     offset: ['start 0.8', 'end 0.2'],   }`. العائد/الأثر: object مثل scrollYProgress. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 42:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 43:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 44:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 46:** Variable declaration / تعريف `chars` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `text.split(...)`: تقسم النص لأجزاء. القيم المكتوبة هنا: `''`. العائد/الأثر: array نصوص.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 48:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

### السطور 49–56

```tsx
    <p ref={ref} className={className} style={style}>
      {chars.map((char, i) => (
        <Char key={i} char={char} index={i} total={chars.length} progress={scrollYProgress} />
      ))}
    </p>
  );
}

```

**السطر 49:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 50:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `chars.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(char, i) => (         <Char key={i} char={char} index={i} total={chars.length} progress={scrollYProgress} /> …`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 51:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 52:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 53:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 54:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 55:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
