# أسئلة وتمارين: فيديو الـ Hero — refs وevents وcleanup

المشروع: **pizza-crm، React**. المتطلبات: `useState` وقراءة props و`useEffect` من [تشغيل الواجهة](11-app-navbar-footer-and-styles.md). المصدر الأساسي: [Home.jsx](../resources/js/Pages/Home.jsx)، والتنسيق مع الـ Navbar في [app.jsx](../resources/js/app.jsx).

**سؤال البداية:** الفيديو والنص والـ Navbar بيظهروا ليه بتوقيت واحد؟ الأب يحتفظ بحالة `heroReady`، والـ Hero ينادي callback لما يحين وقت إظهار المحتوى. هنشرح الأساس، مش كل معادلات سرعة الفيديو.

**حقيقة النسخة الحالية:** الفيديو النشط `/videos/hero-pizza-motion.mp4`، يبدأ من الأول، يكشف المحتوى عند `1.2` ثانية من زمن الفيديو، ويبطّأ بين الثانية `6` و`8` وصولًا إلى `0.35x` لو مدة الملف تسمح. مش loop. `HeroSlider.jsx` و`HeroLanding.jsx` تجارب أقدم مش مستخدمة في الـ Home الحالي.

## 1. سؤال: JavaScript بيمسك عنصر الفيديو إزاي؟

**مقتطف فعلي** داخل `HeroSection`:

```jsx
const videoRef = React.useRef(null);
const hasRevealedRef = React.useRef(false);
```

الأول يعمل ref يبدأ بـ `null`؛ بعد الربط هيوصلنا لعنصر الفيديو الحقيقي في DOM. الثاني يخزّن هل المحتوى ظهر قبل كده؛ قيمته مش معروضة كنص، فتغييرها مش محتاج render.

**مقتطف فعلي** من JSX لنفس المكوّن:

```jsx
<video
    key="hero-intro-video-v2"
    ref={videoRef}
    className="wtc-hero-video object-cover w-100 h-100 position-absolute top-0 start-0"
    src="/videos/hero-pizza-motion.mp4?v=20260930-2"
    muted
    playsInline
    preload="auto"
    onEnded={revealContent}
    onError={revealContent}
    aria-hidden="true"
/>
```

**كل سطر:** الأول يبدأ العنصر. الثاني `key` هوية React؛ تغييره يعيد إنشاء العنصر، مش timer. الثالث يربط العنصر بـ `videoRef.current`. الرابع كلاسات التنسيق، مش state. الخامس عنوان الملف؛ `/videos` داخل public، وجزء `?v=` نسخة URL لكسر cache القديم. السادس يكتم الصوت ويساعد autoplay لكنه مش ضمان تشغيل. السابع يطلب تشغيلًا داخل الصفحة على الموبايل. الثامن تلميح للمتصفح لتحميل البيانات، مش أمر مضمون. التاسع ينادي الدالة عند انتهاء الفيديو. العاشر يناديها عند خطأ حتى ما يفضلش الموقع فاضي. الحادي عشر يخفي الفيديو الزخرفي عن قارئ الشاشة، مش عن النظر. الأخير يقفل العنصر.

**تطبيق يدوي:** اقرأ `const video = videoRef.current` في الـ effect الأصلي. في نسخة تدريبية فقط أضف زرًا ينادي `videoRef.current?.pause()`؛ `?.` يحمي من عدم وجود العنصر. **المتوقع:** الوقوف من غير ما تتحول قيمة ref إلى state.

**غلطة شائعة:** كتابة `videoRef.play()`؛ العنصر الحقيقي في `.current` مش كائن الـ ref نفسه.

<details><summary>سؤال إنترفيو: إمتى تستخدم DOM ref؟</summary>

لعمل imperative محتاج العنصر نفسه، زي focus أو قياس الأبعاد أو play/pause. لتغيير النص أو إظهار قائمة استخدم state وJSX بدل تعديل DOM يدويًا جنب React.

</details>

## 2. سؤال: الطفل بيبلغ الأب إن الفيديو جاهز إزاي؟

**مقتطف فعلي** من `app.jsx` داخل `AppShell`:

```jsx
const [heroReady, setHeroReady] = useState(false);

const revealHero = useCallback(() => {
    setHeroReady(true);
}, []);
```

السطر الأول يفك نتيجة `useState` إلى قيمة وsetter، والبداية false. السطر الفاضي للفصل فقط. الثالث يعرّف callback ثابتة المرجع عبر renders طالما الاعتماديات لم تتغير. الرابع يطلب تحديث الحالة إلى true. الخامس يقفل الدالة ويحدد اعتماديات فاضية؛ setter الخاص بـ React ثابت فلا نحتاج إضافته. `useCallback` لا ينفّذ الدالة؛ بيرجع نسخة ذات مرجع محفوظ.

الأب يمرر `revealHero` إلى Home باسم `onHeroReady`. **مقتطف فعلي** من Home يمرره للـ Hero:

```jsx
<HeroSection
    isReady={heroReady}
    onReady={onHeroReady}
    reduceMotion={reduceMotion}
/>
```

الأول اسم المكوّن، الثاني الحالة نازلة من الأب، الثالث الدالة نازلة تحت اسم `onReady`، الرابع تفضيل تقليل الحركة، الخامس قفل المكوّن. الأسماء بعد `=` تعبيرات JavaScript داخل `{}`، مش نصوص.

**مقتطف فعلي** داخل Hero:

```jsx
const revealContent = React.useCallback(() => {
    if (hasRevealedRef.current) return;
    hasRevealedRef.current = true;
    onReady();
}, [onReady]);
```

الأول تعريف callback؛ الثاني يمنع النداء المكرر لو كنا كشفنا المحتوى؛ الثالث يسجل الكشف؛ الرابع ينادي الدالة اللي الأب بعتها؛ الخامس يعيد المرجع لو `onReady` اتغيرت. الطفل مش بيعدل prop اسمها `isReady`؛ بيطلب من الأب يحدّث الحالة.

**تطبيق:** ارسم على ورقة `AppShell → Home → HeroSection` للـ props، وسهم رجوع لنداء callback. **المتوقع:** تقدر تقول مين صاحب الحالة ومين بيطلب تغييرها. **غلطة شائعة:** `onReady={onHeroReady()}` يشغّل الدالة أثناء render بدل تمريرها.

<details><summary>سؤال إنترفيو: ليه الحالة في الأب؟</summary>

لأن Navbar وHero محتاجين نفس المعلومة. رفع الحالة لأقرب أب مشترك يمنع نسختين مختلفتين من «جاهز». في React التواصل لفوق غالبًا callback prop؛ مش تعديل props مباشرة.

</details>

## 3. سؤال: إيه علاقة play بـ Promise وتنظيف الـ effect؟

**مقتطف فعلي** من effect الفيديو؛ المتغيرات والدوال معرفة قبله في نفس effect:

```js
const playPromise = video.play();
playPromise?.catch(() => {
    if (isCurrentPlayback) {
        revealContent();
        window.cancelAnimationFrame(animationFrameId);
    }
});
```

1. ننادي تشغيل الفيديو ونحفظ Promise التشغيل؛ دي مش Promise انتهاء الفيديو.
2. `?.catch` يتعامل مع رفض التشغيل لو فيه Promise؛ الـ arrow function تتنفذ عند الرفض، مثل رفض autoplay.
3. نفحص إن دورة التشغيل الحالية ما اتلغتش.
4. نكشف النص علشان الموقع يفضل قابلًا للاستخدام لو الفيديو فشل.
5. نوقف frame callback المحفوظة؛ ملهاش داعي بعد الرفض.
6–7. قفل الشرط ثم callback واستدعاء catch.

**مقتطف فعلي** من نهاية نفس effect:

```js
return () => {
    isCurrentPlayback = false;
    window.cancelAnimationFrame(animationFrameId);
};
```

الأول يرجع cleanup لReact، مش نتيجة شاشة. الثاني يغيّر علمًا محليًا علشان رد Promise المتأخر ما يشغّلش كشف قديم. الثالث يلغي callback الرسم المجدولة. الرابع نهاية الدالة. `isCurrentPlayback` متغير داخل effect، مش state؛ قيمته وظيفتها حماية دورة تشغيل محددة.

**تطبيق يدوي:** في نسخة تجريبية غيّر عنوان الفيديو مؤقتًا لملف غير موجود ثم ارجع العنوان الصحيح. **المتوقع:** النص يظهر عن طريق `onError` بدل صفحة بلا محتوى. جرّب الانتقال لصفحة Menu أثناء التشغيل؛ الـ effect يتنضف. ما تضيفش cleanup ثانية منفصلة من غير ما تفهم متغيراتها.

**غلطة شائعة:** الاعتماد على autoplay وعدم توفير fallback. وبرضه flag الإلغاء لا توقف الشبكة ولا تقوم تلقائيًا بعمل `video.pause()`؛ cleanup الحالية تلغي callback وتمنع ردها المتأخر فقط.

<details><summary>سؤال إنترفيو: requestAnimationFrame هو setInterval؟</summary>

لأ، requestAnimationFrame يطلب callback قرب رسم الإطار القادم، ولمواصلة الدورة لازم تعيد طلبه. setInterval يعمل بتوقيت زمني. الاتنين محتاجين cleanup مناسبة، ومش مضمون يتنفذوا بانتظام كامل في تبويب بالخلفية.

</details>

## 4. سؤال: إزاي النص يظهر تدريجيًا من غير تعديل DOM يدوي؟

**مثال مبسّط من** تعريف `heroRevealItem` في Home؛ اختصرنا كتابة `transition` إلى سطر واحد بنفس القيم:

```js
const heroRevealItem = {
    hidden: {
        opacity: 0,
        y: 25,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' },
    },
};
```

الأول object إعدادات، مش دالة. الثاني حالة اسمها hidden. الثالث شفافية صفر. الرابع إزاحة رأسية `25px`. الخامس يقفل الحالة. السادس يبدأ visible. السابع شفافية كاملة. الثامن يرجع لموضع الصفر. التاسع object لتوقيت الحركة: `duration` بالثواني و`easeOut` يبطئ قرب النهاية. العاشر يقفل visible، والحادي عشر يقفل object.

**مثال مبسّط من JSX للـ Hero:** داخل المكوّن، بعد التأكد إن `isReady` و`reduceMotion` props موجودة، و`motion` مستوردة من framer-motion:

```jsx
{isReady && (
    <motion.h1 variants={heroRevealItem} initial={reduceMotion ? false : 'hidden'} animate="visible">
        Hot Stone Pizza
    </motion.h1>
)}
```

الأول conditional rendering: لو جاهز، أضف العنصر. الثاني `motion.h1` عنوان تديره مكتبة الحركة؛ `variants` يمرر الإعدادات، وternary يختار تعطيل البداية الحركية عند طلب تقليل الحركة، و`animate` يحدد الحالة النهائية. الثالث النص. الرابع يقفل العنوان. الخامس يقفل التعبير. الأصل يستخدم container مع stagger لظهور العناصر بالتتابع؛ المثال اختصره لعنوان واحد.

**تطبيق:** غيّر `y: 25` إلى `0` في نسخة تدريبية فقط. **المتوقع:** تلاشي بدون انتقال رأسي. **غلطة شائعة:** استخدام اسم `show` في animate بينما التعريف اسمه `visible`.

<details><summary>سؤال إنترفيو: ليه نهتم بتقليل الحركة؟</summary>

تفضيل accessibility لازم نحترمه، مش كل مستخدم يستحمل نفس الأنيميشن. الأصل يمرر useReducedMotion للانتقالات؛ الفيديو نفسه لا يتوقف تلقائيًا بهذا prop في التنفيذ الحالي، ودي نقطة لازم ما نخلطش بينها وبين تعطيل الحركة بالكامل.

</details>

## 5. سؤال: كل method للفيديو بتعمل إيه، بعيدًا عن كلمة «تشغّل»؟

خد method واحدة في كل مرة. المتغير `video` هنا هو عنصر `<video>` الحقيقي؛ جبناه من `videoRef.current` داخل effect بعد تركيب العنصر.

### `video.pause()` — إيقاف التشغيل الحالي

- دي Browser method على عنصر الفيديو، مش React Hook.
- ما بتاخدش مدخلات، وبتوقف تقدّم التشغيل. عائدها `undefined`، مش Promise.
- لو الفيديو عند الثانية 3، pause تسيبه عند الثانية 3؛ مش بترجعه لأول الفيديو.
- في المشروع بنستخدمها قبل إعادة تهيئة الفيديو، علشان نبدأ دورة المقدمة بحالة واضحة.

### `video.currentTime = 0` — تعيين موضع التشغيل

دي **خاصية رقمية، مش method**. وحدتها ثانية من زمن الفيديو. تعيين صفر يطلب الرجوع للبداية؛ `video.currentTime` بدون إسناد تقرأ الموضع الحالي. تحميل/seek البيانات قد يستغرق وقتًا؛ السطر مش تحويل لصورة فورية مضمونة.

### `video.load()` — إعادة تحميل إعدادات مصدر الفيديو

- method بلا مدخلات وعائدها undefined.
- بتعيد اختيار/تحميل مصدر الوسائط وتصفّر حالة التحميل الحالية؛ ممكن تلغي عمليات تشغيل معلّقة من دورة سابقة.
- **مش معناها شغّل الفيديو**، ومش بترجع Promise نعمل عليها await لتحميل الملف كله. التشغيل له play، ومعرفة التحميل لها أحداث مثل loadedmetadata/canplay حسب الاحتياج.

### `video.play()` — طلب بدء أو استئناف التشغيل

```js
const playPromise = video.play();
playPromise?.catch(() => {
    if (isCurrentPlayback) {
        revealContent();
        window.cancelAnimationFrame(animationFrameId);
    }
});
```

- `play()` لا تاخد مدخلات؛ في المتصفحات الحديثة بترجع Promise.
- الـ Promise تنجح عند بدء التشغيل، **مش عند انتهاء الفيديو**. انتهاء الفيديو له حدث `ended`.
- ممكن ترفض مثلًا لو سياسة autoplay منعت التشغيل أو المصدر غير مدعوم. `muted` يساعد السماح لكنه مش ضمان لكل حالة.
- `.catch(callback)` method على Promise؛ تسجّل دالة تتنادى لو الوعد اترفض. React مش هي اللي بتناديها.
- callback تقدر تستقبل سبب الرفض، مثل `(error) => {...}`؛ في الكود الحالي مش محتاجين نقراه، فالأقواس فاضية.
- `?.catch` لا تنادي catch لو `playPromise` null/undefined، مراعاة لبعض سلوكيات التشغيل القديمة. دي مش معناها تجاهل رفض Promise لو موجودة.
- `catch` ترجع Promise جديدة، لكننا لا نخزّنها هنا؛ callback نفسها مفيهاش return فتخلص بـ undefined.
- `isCurrentPlayback` Boolean محلية بتقول إن effect دي لسه صالحة. لو اتنضفت قبل الرفض، مش هنغيّر عرض دورة قديمة.
- `revealContent()` دالة المشروع الموضحة في السؤال 2؛ تكمل للأب علشان يظهر النص حتى لو الفيديو اتمنع.

### `requestAnimationFrame(callback)` — تابع تقدّم الفيديو مع الرسم

**مقتطف فعلي من الحلقة مع حذف جزء التبطيء فقط:**

```js
let animationFrameId = 0;

const updatePlayback = () => {
    if (!isCurrentPlayback || video.error) return;

    if (video.currentTime >= HERO_REVEAL_TIME) {
        revealContent();
    }

    if (!video.ended) {
        animationFrameId = window.requestAnimationFrame(updatePlayback);
    }
};

animationFrameId = window.requestAnimationFrame(updatePlayback);
```

السطر الأول مكان نحفظ فيه **رقم طلب الإطار**. متغير `let` لأننا هنغيّر قيمته مع كل طلب جديد.

`updatePlayback` دالة كتبناها، بلا مدخلات مطلوبة هنا، تقرأ حالة الفيديو. المتصفح يمرر timestamp لو محتاجينه لكننا لا نستخدمه في المثال. عائد الدالة undefined؛ تأثيرها كشف المحتوى وجدولة فحص تالٍ.

`if (!isCurrentPlayback || video.error) return;` خروج مبكر لو effect اتلغت أو الفيديو له خطأ؛ مفيش طلب إطار تالٍ بعد الخروج.

`HERO_REVEAL_TIME` ثابت فعلي قيمته `1.2`. لما زمن الفيديو يتجاوزها ننادي revealContent. الفيديو ممكن يبقى بطيئًا أو واقفًا، فدي **1.2 ثانية من الوسائط** مش مؤقت مضمون بعد 1.2 ثانية حقيقية من فتح الصفحة.

`window.requestAnimationFrame(updatePlayback)` Browser method تستقبل callback، وتطلب تنفيذها قرب فرصة الرسم القادمة. بترجع ID رقمي فورًا، لا ترجع نتيجة callback ولا Promise.

كل طلب يشغّل callback **مرة واحدة**. التكرار هنا لأن callback بتطلب إطارًا جديدًا داخل `if (!video.ended)`؛ مش لأن requestAnimationFrame فيها تكرار ذاتي.

السطر الأخير يبدأ أول حلقة؛ من غيره الدالة متعرفة لكن محدش طلب تشغيلها. العدد مش مضمون 60 مرة بالثانية؛ يختلف حسب المتصفح والشاشة والتبويب.

### `cancelAnimationFrame(id)` — إلغاء طلب رسم معلّق

```js
return () => {
    isCurrentPlayback = false;
    window.cancelAnimationFrame(animationFrameId);
};
```

- تستقبل **الـ ID اللي رجع من requestAnimationFrame**، مش اسم الدالة ولا الفيديو. ترجع undefined.
- بتلغي callback معلّقة لم تبدأ؛ لا ترجع الزمن للخلف ولا توقف فيديو أو Promise أو طلب شبكة.
- تغيير `isCurrentPlayback` يحمي callback لو كانت بدأت فعلًا أو Promise التشغيل رجعت متأخرًا.
- `return () => {...}` دالة تنظيف يرجّعها effect إلى React. React تناديها قبل setup جديدة لو `revealContent` اتغيرت، وعند إزالة المكوّن. StrictMode التطوير قد يعمل setup/cleanup إضافية؛ مش bug نعالجه بحذف التنظيف.

### باقي methods معادلة التبطيء: الغرض والناتج

الكود الكامل في Home يحتوي على `Number.isFinite(video.duration)`: تستقبل قيمة وترجع Boolean إذا كانت number محدودة، مش NaN أو Infinity. مدة لم تُحمّل بعد قد تكون NaN، فبنمنع الحساب قبل بيانات صالحة.

`Math.min(HERO_SLOWDOWN_END, video.duration)` ترجع أصغر رقم؛ لو الحد المطلوب 8 ومدة الملف 7، النتيجة 7. مفيش تغيير للقيم الأصلية.

`Math.min(1, fraction)` تحط سقفًا 1 لنسبة التقدم. `progress * progress * (3 - 2 * progress)` معادلة رياضية تُنتج انتقالًا ناعمًا من صفر لواحد، مش method مخفية.

`video.playbackRate` خاصية رقمية: `1` سرعة طبيعية، و`0.35` أبطأ. تغيير السرعة لا يغيّر طول الملف نفسه على القرص.

## 6. سؤال: `revealContent` تكمل فين لحد ما أشوف النص والـ Navbar؟

دي رحلة حقيقية من ملفين؛ `HeroSection` و`Home` في نفس `Home.jsx`، و`AppShell` في `app.jsx`.

### الملف `app.jsx`: صاحب الحالة

```jsx
const [heroReady, setHeroReady] = useState(false);

const revealHero = useCallback(() => {
    setHeroReady(true);
}, []);
```

`useState(false)` ترجع قيمة ودالة تحديث. `setHeroReady(true)` تطلب render بحالة جاهزة؛ عائدها undefined. `useCallback(function, [])` ترجع دالة بمرجع محفوظ، ولا تنفّذ محتواها الآن. الشرط إن الدالة لا تعتمد على قيم reactive متغيرة من الأب؛ setter React نفسها ثابتة المرجع.

**توصيلات فعلية من AppShell؛ جمعناها في غلاف JSX صغير علشان تبقى مقروءة.** ده مقتطف مرجعي مش بديل المكوّن كله؛ داخل AppShell الأصلي فيه Routes وباقي الصفحات، وكل ده موجود أصلًا تحت BrowserRouter:

```jsx
<>
    <Navbar
        isVisible={!isHome || heroReady}
        reduceMotion={reduceMotion}
        animateReveal={isHome}
    />
    <Routes>
        <Route
            path="/"
            element={<Home heroReady={heroReady} onHeroReady={revealHero} reduceMotion={reduceMotion} />}
        />
    </Routes>
</>
```

الأسماء على الشمال props، وعلى اليمين قيم ودوال الأب. `onHeroReady={revealHero}` بيمرر الدالة؛ لا يناديها وقت render. في Home، `heroReady=false` تخفي المحتوى وNavbar، وبعد التحديث true الاتنين يقرؤوا الحالة الجديدة.

### الملف `Home.jsx`: يمرّر التوصيلة للـ Hero

**التوصيلة الفعلية داخل Home:**

```jsx
<HeroSection
    isReady={heroReady}
    onReady={onHeroReady}
    reduceMotion={reduceMotion}
/>
```

`onReady` في الطفل هي نفس دالة `revealHero` الأصلية، لكن عدّت عبر اسم prop في Home. مش محتاجين API أو EventBus علشان الأب يعرف.

### داخل HeroSection: نداء واحد يحرك السلسلة

```js
const revealContent = React.useCallback(() => {
    if (hasRevealedRef.current) return;
    hasRevealedRef.current = true;
    onReady();
}, [onReady]);
```

- `React.useRef(false)` اللي عملناه فوق يرجّع object ثابت له `.current`. تغيير current لا يطلب render. هنا العلم يمنع تكرار الإبلاغ، مش هو اللي يعرض النص.
- أول نداء يغيّر العلم ثم ينادي `onReady()`؛ النداءات اللاحقة تخرج عند أول if.
- استدعاء `onReady()` يصل إلى `revealHero` في app.jsx، اللي تعمل `setHeroReady(true)`.
- React تعرض AppShell من جديد ثم تمرّر true لـ Home ولـ Navbar. الـ Hero يقرأ `isReady` ويضيف `motion.div`، والـ Navbar يقرأ `isVisible` ويظهر.
- callbacks المربوطة على `onEnded` و`onError` قد تستقبل event من React، لكن revealContent لا تستخدمه؛ ده مسموح. استخدامها fallback حتى لو توقيت كشف المحتوى الطبيعي ما اشتغلش.

**اختبار يفهمك التدفق:** مع عنوان فيديو صحيح انتظر الوصول إلى 1.2 ثانية فيديو؛ يظهر النص والـ Navbar. في نسخة تدريبية استخدم عنوانًا غير موجود؛ `onError` ينادي نفس revealContent فتظهر الواجهة بدل شاشة فاضية. أعد العنوان الصحيح بعد التجربة. دي مسارات مختلفة تؤدي لنفس تحديث الحالة، مش ثلاث حالات متنافسة.

<details><summary>إنترفيو: useRef هنا بديل useState؟</summary>

مش بديل عام. ref تمسك DOM أو قيمة داخلية لا يعتمد عليها العرض مباشرة. state هي اللي تُطلب إعادة render عند تغييرها. لو خزنّا heroReady في ref فقط، تغييرها وحده مش هيخلي Navbar تقرأ قيمة جديدة في render تلقائيًا.

</details>

بعد ما تشرح الأمثلة: ارجع لـ [Navbar والأب المشترك](11-app-navbar-footer-and-styles.md). لا تحتاج دراسة CSS الطويل أو معادلة تبطيء الفيديو قبل فهم refs وcallbacks والتنظيف.
