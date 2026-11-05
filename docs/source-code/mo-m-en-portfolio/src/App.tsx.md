# تجميع أقسام البورتفوليو

[فهرس كل الأكواد](../../../16-all-project-source.md)

المشروع: `mo-m-en-portfolio` · الملف: `src/App.tsx` · 27 سطر.

**وظيفة الملف:** App مجرد composition للأقسام بالترتيب، من غير state أو API. خلفية والoverflow هنا inline style.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../mo-m-en-portfolio/src/App.tsx). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [mo-m-en-portfolio/src/sections/HeroSection.tsx](sections/HeroSection.tsx.md)

- [mo-m-en-portfolio/src/sections/MarqueeSection.tsx](sections/MarqueeSection.tsx.md)

- [mo-m-en-portfolio/src/sections/AboutSection.tsx](sections/AboutSection.tsx.md)

- [mo-m-en-portfolio/src/sections/SkillsSection.tsx](sections/SkillsSection.tsx.md)

- [mo-m-en-portfolio/src/sections/ServicesSection.tsx](sections/ServicesSection.tsx.md)

- [mo-m-en-portfolio/src/sections/ProjectsSection.tsx](sections/ProjectsSection.tsx.md)

- [mo-m-en-portfolio/src/sections/ContactSection.tsx](sections/ContactSection.tsx.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```tsx
import HeroSection from './sections/HeroSection';
import MarqueeSection from './sections/MarqueeSection';
import AboutSection from './sections/AboutSection';
import SkillsSection from './sections/SkillsSection';
import ServicesSection from './sections/ServicesSection';
import ProjectsSection from './sections/ProjectsSection';
import ContactSection from './sections/ContactSection';

function App() {
  return (
    <div
      className="font-kanit"
      style={{ background: '#0C0C0C', overflowX: 'clip', overflowY: 'visible' }}
    >
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <SkillsSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
}

export default App;
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### App

يرجع JSX لكل الصفحة ويستورد7sections.

- **بتاخد إيه؟ Inputs:** لا props

- **بترجع/بتغيّر إيه؟ Return / effect:** React element

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```tsx
import HeroSection from './sections/HeroSection';
import MarqueeSection from './sections/MarqueeSection';
import AboutSection from './sections/AboutSection';
import SkillsSection from './sections/SkillsSection';
import ServicesSection from './sections/ServicesSection';
import ProjectsSection from './sections/ProjectsSection';
import ContactSection from './sections/ContactSection';

```

**السطر 1:** Import / استيراد: الأسماء `HeroSection` جاية من `./sections/HeroSection`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 2:** Import / استيراد: الأسماء `MarqueeSection` جاية من `./sections/MarqueeSection`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 3:** Import / استيراد: الأسماء `AboutSection` جاية من `./sections/AboutSection`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 4:** Import / استيراد: الأسماء `SkillsSection` جاية من `./sections/SkillsSection`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 5:** Import / استيراد: الأسماء `ServicesSection` جاية من `./sections/ServicesSection`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 6:** Import / استيراد: الأسماء `ProjectsSection` جاية من `./sections/ProjectsSection`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 7:** Import / استيراد: الأسماء `ContactSection` جاية من `./sections/ContactSection`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

### السطور 9–16

```tsx
function App() {
  return (
    <div
      className="font-kanit"
      style={{ background: '#0C0C0C', overflowX: 'clip', overflowY: 'visible' }}
    >
      <HeroSection />
      <MarqueeSection />
```

**السطر 9:** Function / تعريف دالة `App`؛ تعريفها مش تشغيلها. يرجع JSX لكل الصفحة ويستورد7sections. مدخلاتها: لا props ناتجها: React element

**السطر 10:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 11:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 12:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 13:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 14:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 15:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 16:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 17–24

```tsx
      <AboutSection />
      <SkillsSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
}
```

**السطر 17:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 18:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 19:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 20:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 21:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 22:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 23:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 24:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 25–27

```tsx

export default App;

```

**السطر 26:** Export / تصدير تعريف علشان ملف آخر يقدر يستورده. default تصدير أساسي؛ named export يتستورد باسمه.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
