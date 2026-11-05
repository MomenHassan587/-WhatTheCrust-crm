# قسم التواصل الحالي: دعوة لعرض العمل

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `mo-m-en-portfolio` · الملف: `src/sections/ContactSection.tsx` · 23 سطر.

**وظيفة الملف:** فيه نص فرص عمل وزر View My Work يذهب للمشاريع. لا يوجد إرسال رسالة أو بريد أو form حاليًا؛ النص يقول الروابط ستضاف لاحقًا.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../mo-m-en-portfolio/src/sections/ContactSection.tsx). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [mo-m-en-portfolio/src/components/FadeIn.tsx](../components/FadeIn.tsx.md)

- [mo-m-en-portfolio/src/components/ContactButton.tsx](../components/ContactButton.tsx.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```tsx
import FadeIn from '../components/FadeIn';
import ContactButton from '../components/ContactButton';

export default function ContactSection() {
  return (
    <section id="contact" className="relative bg-[#0C0C0C] px-5 py-24 sm:px-8 sm:py-32 md:px-10 scroll-mt-8">
      <FadeIn>
        <div className="mx-auto flex max-w-5xl flex-col items-center rounded-[32px] border border-white/10 bg-[#111111] px-6 py-16 text-center shadow-2xl shadow-black/30 sm:px-10 sm:py-20">
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.25em] text-[#D7E2EA]/55 sm:text-sm">Open to opportunities</p>
          <h2 className="hero-heading max-w-4xl font-black uppercase leading-[0.9] tracking-tight" style={{ fontSize: 'clamp(3.2rem, 10vw, 130px)' }}>
            Let&apos;s Connect
          </h2>
          <p className="my-8 max-w-xl text-base font-light leading-relaxed text-[#D7E2EA]/70 sm:text-lg">
            I&apos;m open to full-stack, frontend, and backend development opportunities where I can contribute, learn, and grow with a strong team.
          </p>
          <ContactButton href="#projects" label="View My Work" />
          <p className="mt-5 text-xs text-[#D7E2EA]/40">Professional contact links will appear here once added.</p>
        </div>
      </FadeIn>
    </section>
  );
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### ContactSection

يعرض card ثابت داخل FadeIn وزر ContactButton.

- **بتاخد إيه؟ Inputs:** لا props

- **بترجع/بتغيّر إيه؟ Return / effect:** React element

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```tsx
import FadeIn from '../components/FadeIn';
import ContactButton from '../components/ContactButton';

export default function ContactSection() {
  return (
    <section id="contact" className="relative bg-[#0C0C0C] px-5 py-24 sm:px-8 sm:py-32 md:px-10 scroll-mt-8">
      <FadeIn>
        <div className="mx-auto flex max-w-5xl flex-col items-center rounded-[32px] border border-white/10 bg-[#111111] px-6 py-16 text-center shadow-2xl shadow-black/30 sm:px-10 sm:py-20">
```

**السطر 1:** Import / استيراد: الأسماء `FadeIn` جاية من `../components/FadeIn`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 2:** Import / استيراد: الأسماء `ContactButton` جاية من `../components/ContactButton`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 4:** Function / تعريف دالة `ContactSection`؛ تعريفها مش تشغيلها. يعرض card ثابت داخل FadeIn وزر ContactButton. مدخلاتها: لا props ناتجها: React element

**السطر 5:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 6:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 7:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 8:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 9–16

```tsx
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.25em] text-[#D7E2EA]/55 sm:text-sm">Open to opportunities</p>
          <h2 className="hero-heading max-w-4xl font-black uppercase leading-[0.9] tracking-tight" style={{ fontSize: 'clamp(3.2rem, 10vw, 130px)' }}>
            Let&apos;s Connect
          </h2>
          <p className="my-8 max-w-xl text-base font-light leading-relaxed text-[#D7E2EA]/70 sm:text-lg">
            I&apos;m open to full-stack, frontend, and backend development opportunities where I can contribute, learn, and grow with a strong team.
          </p>
          <ContactButton href="#projects" label="View My Work" />
```

**السطر 9:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 10:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 11:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 12:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 13:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 14:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 15:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 16:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 17–23

```tsx
          <p className="mt-5 text-xs text-[#D7E2EA]/40">Professional contact links will appear here once added.</p>
        </div>
      </FadeIn>
    </section>
  );
}

```

**السطر 17:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 18:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 19:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 20:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 21:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 22:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
