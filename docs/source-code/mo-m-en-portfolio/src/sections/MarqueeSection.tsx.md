# صفان صور وفيديو يتحركان مع scroll

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `mo-m-en-portfolio` · الملف: `src/sections/MarqueeSection.tsx` · 265 سطر.

**وظيفة الملف:** MediaItem union تفرق image/video. lazy load حقيقي بالIntersectionObserver، فيديوهات play عند الظهور وpause خارجه، والصفوف لها نسختان للتكرار البصري.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../mo-m-en-portfolio/src/sections/MarqueeSection.tsx). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```tsx
import { useEffect, useRef, useState } from 'react';

type MediaItem =
  | { type: 'image'; src: string; alt: string }
  | { type: 'video'; src: string; poster: string; alt: string };

const image = (src: string): MediaItem => ({
  type: 'image',
  src,
  alt: 'Featured website preview',
});

const ALL_MEDIA: MediaItem[] = [
  image('https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif'),
  {
    type: 'video',
    src: '/pizza-showcase.webm',
    poster: '/pizza-home.webp',
    alt: 'What The Crust pizza website preview',
  },
  image('https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif'),
  image('https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif'),
  image('https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif'),
  image('https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif'),
  image('https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif'),
  image('https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif'),
  image('https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif'),
  image('https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif'),
  image('https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif'),
  image('https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif'),
  {
    type: 'video',
    src: '/autocare-showcase.webm',
    poster: '/autocare-home.webp',
    alt: 'AutoCare Pro car service booking website preview',
  },
  image('https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif'),
  image('https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif'),
  image('https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif'),
  image('https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif'),
  image('https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif'),
  image('https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif'),
  image('https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif'),
  image('https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif'),
  image('https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif'),
  image('https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif'),
];

const ROW_1 = ALL_MEDIA.slice(0, 12);
const ROW_2 = ALL_MEDIA.slice(12);
const GAP = 12;

const tileClassName =
  'h-[180px] w-[280px] flex-shrink-0 rounded-2xl object-cover sm:h-[225px] sm:w-[350px] lg:h-[270px] lg:w-[420px]';
const imageTileClassName = tileClassName;
const videoTileClassName = tileClassName;

function VideoTile({ item, decorative }: { item: Extract<MediaItem, { type: 'video' }>; decorative: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || shouldLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '500px' },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [shouldLoad]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || failed || !shouldLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [failed, shouldLoad]);

  if (failed) {
    return (
      <img
        src={item.poster}
        alt={decorative ? '' : `${item.alt} (video unavailable)`}
        loading="lazy"
        width="420"
        height="270"
        className={videoTileClassName}
      />
    );
  }

  return (
    <video
      ref={videoRef}
      src={shouldLoad ? item.src : undefined}
      poster={item.poster}
      aria-label={decorative ? undefined : item.alt}
      aria-hidden={decorative || undefined}
      muted
      loop
      playsInline
      preload="metadata"
      onError={() => setFailed(true)}
      className={videoTileClassName}
    >
      Your browser does not support embedded videos.
    </video>
  );
}

function ImageTile({ item, decorative }: { item: Extract<MediaItem, { type: 'image' }>; decorative: boolean }) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement || shouldLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '500px' },
    );

    observer.observe(imageElement);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <img
      ref={imageRef}
      src={shouldLoad ? item.src : undefined}
      alt={decorative ? '' : item.alt}
      loading="lazy"
      decoding="async"
      width="420"
      height="270"
      className={imageTileClassName}
    />
  );
}

function Tile({ item, decorative }: { item: MediaItem; decorative: boolean }) {
  if (item.type === 'video') {
    return <VideoTile item={item} decorative={decorative} />;
  }

  return <ImageTile item={item} decorative={decorative} />;
}

function MediaGroup({ items, repeat }: { items: MediaItem[]; repeat: number }) {
  return (
    <div className="flex flex-shrink-0 gap-3" aria-hidden={repeat > 0 || undefined}>
      {items.map((item, index) => (
        <Tile key={`${repeat}-${item.src}-${index}`} item={item} decorative={repeat > 0} />
      ))}
    </div>
  );
}

const wrap = (value: number, width: number) => ((value % width) + width) % width;

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const row1GroupRef = useRef<HTMLDivElement>(null);
  const row2GroupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const updateRows = () => {
      frame = 0;
      const section = sectionRef.current;
      const row1 = row1Ref.current;
      const row2 = row2Ref.current;
      const row1Group = row1GroupRef.current;
      const row2Group = row2GroupRef.current;
      if (!section || !row1 || !row2 || !row1Group || !row2Group) return;

      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const progress = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      const row1Width = row1Group.offsetWidth + GAP;
      const row2Width = row2Group.offsetWidth + GAP;

      row1.style.transform = `translate3d(${-row1Width + wrap(progress, row1Width)}px, 0, 0)`;
      row2.style.transform = `translate3d(${-wrap(progress, row2Width)}px, 0, 0)`;
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateRows);
    };

    const resizeObserver = new ResizeObserver(requestUpdate);
    if (row1GroupRef.current) resizeObserver.observe(row1GroupRef.current);
    if (row2GroupRef.current) resizeObserver.observe(row2GroupRef.current);

    updateRows();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      resizeObserver.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      id="showcase"
      ref={sectionRef}
      className="overflow-hidden pt-24 pb-10 sm:pt-32 md:pt-40"
      style={{ background: '#0C0C0C' }}
    >
      <div className="flex flex-col gap-3">
        <div ref={row1Ref} className="flex gap-3 will-change-transform">
          {[0, 1].map((repeat) => (
            <div key={repeat} ref={repeat === 0 ? row1GroupRef : undefined} className="flex flex-shrink-0 gap-3">
              <MediaGroup items={ROW_1} repeat={repeat} />
            </div>
          ))}
        </div>
        <div ref={row2Ref} className="flex gap-3 will-change-transform">
          {[0, 1].map((repeat) => (
            <div key={repeat} ref={repeat === 0 ? row2GroupRef : undefined} className="flex flex-shrink-0 gap-3">
              <MediaGroup items={ROW_2} repeat={repeat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### image

مصنع object موحّد لكل صورة بدل تكرار type/alt.

- **بتاخد إيه؟ Inputs:** src:string

- **بترجع/بتغيّر إيه؟ Return / effect:** MediaItem type=image

### ALL_MEDIA

مصادر معاينات؛ بعض GIF خارجي وفيديوهات Pizza/AutoCare محلية. وجود مصدر لا يثبت أنه مشروع عمله صاحب البورتفوليو.

- **بتاخد إيه؟ Inputs:** array MediaItem[]

- **بترجع/بتغيّر إيه؟ Return / effect:** قائمة ثابتة

### VideoTile

يحمل src قرب الشاشة، يشغل الفيديو المرئي، ولو error يستبدله بصورة poster.

- **بتاخد إيه؟ Inputs:** {item:Extract<MediaItem,{type:'video'}>,decorative:boolean}

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX video أو img

### ImageTile

يؤخر وضع src حتى الاقتراب ويضبط alt للنسخ الزخرفية.

- **بتاخد إيه؟ Inputs:** {item:Extract<MediaItem,{type:'image'}>,decorative:boolean}

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX img

### Tile

type narrowing: لو video يمرر للVideoTile، وإلاImageTile.

- **بتاخد إيه؟ Inputs:** {item:MediaItem,decorative:boolean}

- **بترجع/بتغيّر إيه؟ Return / effect:** React element

### MediaGroup

map لمجموعة واحدة؛ repeat>0 يخفي النسخة المتكررة عن assistive tech.

- **بتاخد إيه؟ Inputs:** {items:MediaItem[],repeat:number}

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX group

### wrap

يرجع موضع دوري موجب حتى لو value سالب؛ width لازم أكبر من0 في القياسات الحالية.

- **بتاخد إيه؟ Inputs:** value,width:number

- **بترجع/بتغيّر إيه؟ Return / effect:** number من0لأقل منwidth

### MarqueeSection

يربط refs للصفين والمجموعتين، ويعمل scroll transform بطريقة rAF مع cleanup.

- **بتاخد إيه؟ Inputs:** لا props

- **بترجع/بتغيّر إيه؟ Return / effect:** React element

### updateRows

يقيس مكان section وعرض كل مجموعة ويحرك الصفين في اتجاهين عكس بعض.

- **بتاخد إيه؟ Inputs:** refs/window.scrollY/window.innerHeight

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined؛ direct DOM style لا state لكل scroll

### requestUpdate

يضمن في الframe الواحدة طلب تحديث واحد فقط؛ ده scheduling مش debouncing بالوقت.

- **بتاخد إيه؟ Inputs:** event غير مستخدم

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined؛ يحتفظ frame handle

### VideoTile useEffect load

Observer يبدأ تحميل قبل الظهور ب500px ويوقف نفسه بعد أول تقاطع.

- **بتاخد إيه؟ Inputs:** [shouldLoad]

- **بترجع/بتغيّر إيه؟ Return / effect:** cleanup disconnect

### VideoTile useEffect play

Observer يشغل عندما intersection≥تقريبًا25% ويpause خارجها؛ يعالج رفض autoplay بهدوء.

- **بتاخد إيه؟ Inputs:** [failed,shouldLoad]

- **بترجع/بتغيّر إيه؟ Return / effect:** cleanup disconnect+pause

### ImageTile useEffect

Observer يحدد shouldLoad ويقطع المراقبة بعد أول اقتراب.

- **بتاخد إيه؟ Inputs:** [shouldLoad]

- **بترجع/بتغيّر إيه؟ Return / effect:** cleanup disconnect

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### image

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** مصنع object موحّد لكل صورة بدل تكرار type/alt.

- **المدخلات — Arguments:** src:string

- **الناتج/الأثر — Return / effect:** MediaItem type=image

- **أول موضع هنا:** السطر 46، والمدخلات المكتوبة: `'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif'`.

### ALL_MEDIA.slice

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تأخذ جزءًا بدون تعديل الأصل.

- **المدخلات — Arguments:** start وend غير شامل النهاية.

- **الناتج/الأثر — Return / effect:** نسخة array جزئية أو نص جزئي حسب المستقبِل.

- **أول موضع هنا:** السطر 50، والمدخلات المكتوبة: `12`.

### useRef

- **جاية منين؟** React

- **وظيفتها:** مرجع ثابت .current للDOM أو قيمة لا تتطلب render عند تغييرها.

- **المدخلات — Arguments:** initialValue

- **الناتج/الأثر — Return / effect:** MutableRefObject

- **أول موضع هنا:** السطر 196، والمدخلات المكتوبة: `null`.

- **مثال:** const videoRef = useRef<HTMLVideoElement>(null);

### useState

- **جاية منين؟** React

- **وظيفتها:** حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة.

- **المدخلات — Arguments:** initialState

- **الناتج/الأثر — Return / effect:** [currentState,setter]

- **أول موضع هنا:** السطر 137، والمدخلات المكتوبة: `false`.

- **مثال:** const [failed, setFailed] = useState(false);

### useEffect

- **جاية منين؟** React

- **وظيفتها:** يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies.

- **المدخلات — Arguments:** setup callback, dependencies

- **الناتج/الأثر — Return / effect:** undefined

- **أول موضع هنا:** السطر 198، والمدخلات المكتوبة: `() => {     let frame = 0;      const updateRows = () => {       frame = 0;       const section = sectionRef.current;       const row1 = row1Ref.current;       const row2 = row2Ref…`، `[]`.

- **مثال:** useEffect(() => { window.addEventListener('resize', updateRunway); return () => window.removeEventListener('resize', updateRunway); }, []);

### IntersectionObserver

- **جاية منين؟** Browser

- **وظيفتها:** يراقب دخول عنصر ضمن viewport/root بشكل async؛ لا يحتاج listener scroll يدوي لكل عنصر.

- **المدخلات — Arguments:** callback(entries),{rootMargin,threshold}

- **الناتج/الأثر — Return / effect:** observer instance

- **أول موضع هنا:** السطر 143، والمدخلات المكتوبة: `([entry]) => {         if (entry.isIntersecting) {           setShouldLoad(true);           observer.disconnect();         }       }`، `{ rootMargin: '500px' }`.

- **مثال:** new IntersectionObserver(([entry]) => { storyActive.value=entry.isIntersecting; },{threshold:.01});

### setShouldLoad

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setShouldLoad هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 146، والمدخلات المكتوبة: `true`.

### observer.disconnect

- **جاية منين؟** Browser Observer

- **وظيفتها:** توقف مراقبة الأهداف الخاصة بهذا observer.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 154.

### observer.observe

- **جاية منين؟** Browser Observer

- **وظيفتها:** تبدأ مراقبة عنصر بالـobserver الحالي.

- **المدخلات — Arguments:** عنصر وخيارات حسب API.

- **الناتج/الأثر — Return / effect:** عادة undefined؛ التقارير تصل للـcallback المسجّلة عند إنشاء observer.

- **أول موضع هنا:** السطر 153، والمدخلات المكتوبة: `imageElement`.

### video.play().catch

- **جاية منين؟** Promise

- **وظيفتها:** تسجّل معالجة فشل الـPromise.

- **المدخلات — Arguments:** callback تستقبل سبب الفشل.

- **الناتج/الأثر — Return / effect:** Promise جديدة؛ عدم إعادة الرمي قد يحوّل المسار لنجاح.

- **أول موضع هنا:** السطر 88، والمدخلات المكتوبة: `() => undefined`.

### video.play

- **جاية منين؟** HTMLMediaElement

- **وظيفتها:** تحاول بدء تشغيل فيديو/صوت.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** Promise قد ترفض بسبب autoplay أو خطأ؛ عالجها.

- **أول موضع هنا:** السطر 88.

### video.pause

- **جاية منين؟** HTMLMediaElement

- **وظيفتها:** توقف التشغيل مؤقتًا.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** undefined؛ لا تمسح الملف.

- **أول موضع هنا:** السطر 99.

### setFailed

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setFailed هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 127، والمدخلات المكتوبة: `true`.

### items.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 182، والمدخلات المكتوبة: `(item, index) => (         <Tile key={'${repeat}-${item.src}-${index}'} item={item} decorative={repeat > 0} />       )`.

### section.getBoundingClientRect

- **جاية منين؟** DOM Element

- **وظيفتها:** تقيس موضع وأبعاد العنصر بالنسبة للـviewport.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** DOMRect؛ القيم تتأثر بالـscroll والتحويلات.

- **أول موضع هنا:** السطر 210.

### wrap

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يرجع موضع دوري موجب حتى لو value سالب؛ width لازم أكبر من0 في القياسات الحالية.

- **المدخلات — Arguments:** value,width:number

- **الناتج/الأثر — Return / effect:** number من0لأقل منwidth

- **أول موضع هنا:** السطر 216، والمدخلات المكتوبة: `progress`، `row2Width`.

### window.requestAnimationFrame

- **جاية منين؟** Browser

- **وظيفتها:** تطلب callback قبل فرصة رسم إطار قادم؛ ليست loop تلقائية.

- **المدخلات — Arguments:** callback تستقبل timestamp.

- **الناتج/الأثر — Return / effect:** request ID؛ لو محتاج تكرار تعيد التسجيل.

- **أول موضع هنا:** السطر 220، والمدخلات المكتوبة: `updateRows`.

### ResizeObserver

- **جاية منين؟** Browser

- **وظيفتها:** يراقب تغير حجم عنصر ويشغّل callback؛ cleanup بdisconnect.

- **المدخلات — Arguments:** callback

- **الناتج/الأثر — Return / effect:** observer instance

- **أول موضع هنا:** السطر 223، والمدخلات المكتوبة: `requestUpdate`.

- **مثال:** const resizeObserver = new ResizeObserver(updateRunway); resizeObserver.observe(lastCard);

### resizeObserver.observe

- **جاية منين؟** Browser Observer

- **وظيفتها:** تبدأ مراقبة عنصر بالـobserver الحالي.

- **المدخلات — Arguments:** عنصر وخيارات حسب API.

- **الناتج/الأثر — Return / effect:** عادة undefined؛ التقارير تصل للـcallback المسجّلة عند إنشاء observer.

- **أول موضع هنا:** السطر 225، والمدخلات المكتوبة: `row2GroupRef.current`.

### updateRows

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يقيس مكان section وعرض كل مجموعة ويحرك الصفين في اتجاهين عكس بعض.

- **المدخلات — Arguments:** refs/window.scrollY/window.innerHeight

- **الناتج/الأثر — Return / effect:** undefined؛ direct DOM style لا state لكل scroll

- **أول موضع هنا:** السطر 227.

### window.addEventListener

- **جاية منين؟** Browser EventTarget

- **وظيفتها:** تسجّل listener؛ مصدر الحدث يناديها ويمرر Event.

- **المدخلات — Arguments:** اسم الحدث والدالة وخيارات.

- **الناتج/الأثر — Return / effect:** undefined؛ لا تشغّل handler لحظة التسجيل.

- **أول موضع هنا:** السطر 229، والمدخلات المكتوبة: `'resize'`، `requestUpdate`.

### window.removeEventListener

- **جاية منين؟** Browser EventTarget

- **وظيفتها:** تلغي listener بنفس الاسم ومرجع الدالة وcapture المناسب.

- **المدخلات — Arguments:** نوع الحدث والدالة وخيار capture إن لزم.

- **الناتج/الأثر — Return / effect:** undefined؛ لا توقف الحدث نفسه.

- **أول موضع هنا:** السطر 233، والمدخلات المكتوبة: `'resize'`، `requestUpdate`.

### resizeObserver.disconnect

- **جاية منين؟** Browser Observer

- **وظيفتها:** توقف مراقبة الأهداف الخاصة بهذا observer.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 234.

### window.cancelAnimationFrame

- **جاية منين؟** Browser

- **وظيفتها:** تلغي طلب إطار معلّق.

- **المدخلات — Arguments:** ID الراجع من requestAnimationFrame.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 235، والمدخلات المكتوبة: `frame`.

### [0, 1].map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 255، والمدخلات المكتوبة: `(repeat) => (             <div key={repeat} ref={repeat === 0 ? row2GroupRef : undefined} className="flex flex-shrink-0 gap-3">               <MediaGroup items={ROW_2} repeat={repe…`.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```tsx
import { useEffect, useRef, useState } from 'react';

type MediaItem =
  | { type: 'image'; src: string; alt: string }
  | { type: 'video'; src: string; poster: string; alt: string };

const image = (src: string): MediaItem => ({
  type: 'image',
```

**السطر 1:** Import / استيراد: الأسماء `useEffect`، `useRef`، `useState` جاية من `react`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 3:** TypeScript type: وصف شكل بيانات/مدخلات وقت الفحص، مش object أو تحقق API وقت التشغيل.

**السطر 4:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 5:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 7:** Variable declaration / تعريف `image` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `image` هنا: مصنع object موحّد لكل صورة بدل تكرار type/alt. المدخلات: src:string. الناتج/الأثر: MediaItem type=image.

**السطر 8:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 9–16

```tsx
  src,
  alt: 'Featured website preview',
});

const ALL_MEDIA: MediaItem[] = [
  image('https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif'),
  {
    type: 'video',
```

**السطر 9:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 10:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 11:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 13:** Variable declaration / تعريف `ALL_MEDIA` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة الابتدائية Array فيها 23 عنصرًا؛ العناصر نفسها في السطور التالية. دور `ALL_MEDIA` هنا: مصادر معاينات؛ بعض GIF خارجي وفيديوهات Pizza/AutoCare محلية. وجود مصدر لا يثبت أنه مشروع عمله صاحب البورتفوليو. المدخلات: array MediaItem[]. الناتج/الأثر: قائمة ثابتة.

**السطر 14:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `image(...)`: مصنع object موحّد لكل صورة بدل تكرار type/alt. القيم المكتوبة هنا: `'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif'`. العائد/الأثر: MediaItem type=image. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 15:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 16:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 17–24

```tsx
    src: '/pizza-showcase.webm',
    poster: '/pizza-home.webp',
    alt: 'What The Crust pizza website preview',
  },
  image('https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif'),
  image('https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif'),
  image('https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif'),
  image('https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif'),
```

**السطر 17:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 18:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 19:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 20:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 21:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `image(...)`: مصنع object موحّد لكل صورة بدل تكرار type/alt. القيم المكتوبة هنا: `'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif'`. العائد/الأثر: MediaItem type=image. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 22:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `image(...)`: مصنع object موحّد لكل صورة بدل تكرار type/alt. القيم المكتوبة هنا: `'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif'`. العائد/الأثر: MediaItem type=image. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 23:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `image(...)`: مصنع object موحّد لكل صورة بدل تكرار type/alt. القيم المكتوبة هنا: `'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif'`. العائد/الأثر: MediaItem type=image. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 24:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `image(...)`: مصنع object موحّد لكل صورة بدل تكرار type/alt. القيم المكتوبة هنا: `'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif'`. العائد/الأثر: MediaItem type=image. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 25–32

```tsx
  image('https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif'),
  image('https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif'),
  image('https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif'),
  image('https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif'),
  image('https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif'),
  image('https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif'),
  {
    type: 'video',
```

**السطر 25:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `image(...)`: مصنع object موحّد لكل صورة بدل تكرار type/alt. القيم المكتوبة هنا: `'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif'`. العائد/الأثر: MediaItem type=image. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 26:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `image(...)`: مصنع object موحّد لكل صورة بدل تكرار type/alt. القيم المكتوبة هنا: `'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif'`. العائد/الأثر: MediaItem type=image. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 27:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `image(...)`: مصنع object موحّد لكل صورة بدل تكرار type/alt. القيم المكتوبة هنا: `'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif'`. العائد/الأثر: MediaItem type=image. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 28:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `image(...)`: مصنع object موحّد لكل صورة بدل تكرار type/alt. القيم المكتوبة هنا: `'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif'`. العائد/الأثر: MediaItem type=image. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 29:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `image(...)`: مصنع object موحّد لكل صورة بدل تكرار type/alt. القيم المكتوبة هنا: `'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif'`. العائد/الأثر: MediaItem type=image. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 30:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `image(...)`: مصنع object موحّد لكل صورة بدل تكرار type/alt. القيم المكتوبة هنا: `'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif'`. العائد/الأثر: MediaItem type=image. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 31:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 32:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 33–40

```tsx
    src: '/autocare-showcase.webm',
    poster: '/autocare-home.webp',
    alt: 'AutoCare Pro car service booking website preview',
  },
  image('https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif'),
  image('https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif'),
  image('https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif'),
  image('https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif'),
```

**السطر 33:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 34:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 35:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 36:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 37:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `image(...)`: مصنع object موحّد لكل صورة بدل تكرار type/alt. القيم المكتوبة هنا: `'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif'`. العائد/الأثر: MediaItem type=image. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 38:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `image(...)`: مصنع object موحّد لكل صورة بدل تكرار type/alt. القيم المكتوبة هنا: `'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif'`. العائد/الأثر: MediaItem type=image. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 39:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `image(...)`: مصنع object موحّد لكل صورة بدل تكرار type/alt. القيم المكتوبة هنا: `'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif'`. العائد/الأثر: MediaItem type=image. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 40:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `image(...)`: مصنع object موحّد لكل صورة بدل تكرار type/alt. القيم المكتوبة هنا: `'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif'`. العائد/الأثر: MediaItem type=image. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 41–48

```tsx
  image('https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif'),
  image('https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif'),
  image('https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif'),
  image('https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif'),
  image('https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif'),
  image('https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif'),
];

```

**السطر 41:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `image(...)`: مصنع object موحّد لكل صورة بدل تكرار type/alt. القيم المكتوبة هنا: `'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif'`. العائد/الأثر: MediaItem type=image. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 42:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `image(...)`: مصنع object موحّد لكل صورة بدل تكرار type/alt. القيم المكتوبة هنا: `'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif'`. العائد/الأثر: MediaItem type=image. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 43:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `image(...)`: مصنع object موحّد لكل صورة بدل تكرار type/alt. القيم المكتوبة هنا: `'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif'`. العائد/الأثر: MediaItem type=image. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 44:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `image(...)`: مصنع object موحّد لكل صورة بدل تكرار type/alt. القيم المكتوبة هنا: `'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif'`. العائد/الأثر: MediaItem type=image. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 45:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `image(...)`: مصنع object موحّد لكل صورة بدل تكرار type/alt. القيم المكتوبة هنا: `'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif'`. العائد/الأثر: MediaItem type=image. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 46:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `image(...)`: مصنع object موحّد لكل صورة بدل تكرار type/alt. القيم المكتوبة هنا: `'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif'`. العائد/الأثر: MediaItem type=image. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 47:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 49–56

```tsx
const ROW_1 = ALL_MEDIA.slice(0, 12);
const ROW_2 = ALL_MEDIA.slice(12);
const GAP = 12;

const tileClassName =
  'h-[180px] w-[280px] flex-shrink-0 rounded-2xl object-cover sm:h-[225px] sm:w-[350px] lg:h-[270px] lg:w-[420px]';
const imageTileClassName = tileClassName;
const videoTileClassName = tileClassName;
```

**السطر 49:** Variable declaration / تعريف `ROW_1` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ALL_MEDIA.slice(...)`: تأخذ جزءًا بدون تعديل الأصل. القيم المكتوبة هنا: `0`، `12`. العائد/الأثر: نسخة array جزئية أو نص جزئي حسب المستقبِل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 50:** Variable declaration / تعريف `ROW_2` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ALL_MEDIA.slice(...)`: تأخذ جزءًا بدون تعديل الأصل. القيم المكتوبة هنا: `12`. العائد/الأثر: نسخة array جزئية أو نص جزئي حسب المستقبِل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 51:** Variable declaration / تعريف `GAP` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `12`، مش ناتج طلب شبكة.

**السطر 53:** Variable declaration / تعريف `tileClassName` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `"h-[180px] w-[280px] flex-shrink-0 rounded-2xl object-cover sm:h-[225px] sm:w-[350px] lg:h-[270px] lg:w-[420px]"`، مش ناتج طلب شبكة.

**السطر 54:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 55:** Variable declaration / تعريف `imageTileClassName` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 56:** Variable declaration / تعريف `videoTileClassName` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

### السطور 57–64

```tsx

function VideoTile({ item, decorative }: { item: Extract<MediaItem, { type: 'video' }>; decorative: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
```

**السطر 58:** Function / تعريف دالة `VideoTile`؛ تعريفها مش تشغيلها. يحمل src قرب الشاشة، يشغل الفيديو المرئي، ولو error يستبدله بصورة poster. مدخلاتها: {item:Extract<MediaItem,{type:'video'}>,decorative:boolean} ناتجها: JSX video أو img

**السطر 59:** Variable declaration / تعريف `videoRef` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useRef(...)`: مرجع ثابت .current للDOM أو قيمة لا تتطلب render عند تغييرها. القيم المكتوبة هنا: `null`. العائد/الأثر: MutableRefObject. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 60:** Variable declaration / تعريف `failed + setFailed` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `false`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 61:** Variable declaration / تعريف `shouldLoad + setShouldLoad` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `false`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 63:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `() => {     const video = videoRef.current;     if (!video || shouldLoad) return;      const observer = new In…`، `[shouldLoad]`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 64:** Variable declaration / تعريف `video` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

### السطور 65–72

```tsx
    if (!video || shouldLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
```

**السطر 65:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 67:** Variable declaration / تعريف `observer` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `IntersectionObserver(...)`: يراقب دخول عنصر ضمن viewport/root بشكل async؛ لا يحتاج listener scroll يدوي لكل عنصر. القيم المكتوبة هنا: `([entry]) => {         if (entry.isIntersecting) {           setShouldLoad(true);           observer.disconnec…`، `{ rootMargin: '500px' }`. العائد/الأثر: observer instance. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 68:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 69:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 70:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setShouldLoad(...)`: لو setShouldLoad هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `true`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 71:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `observer.disconnect(...)`: توقف مراقبة الأهداف الخاصة بهذا observer. مدخلاتها: بدون مدخلات. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 72:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 73–80

```tsx
      },
      { rootMargin: '500px' },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [shouldLoad]);

```

**السطر 73:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 74:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 75:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 77:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `observer.observe(...)`: تبدأ مراقبة عنصر بالـobserver الحالي. القيم المكتوبة هنا: `video`. العائد/الأثر: عادة undefined؛ التقارير تصل للـcallback المسجّلة عند إنشاء observer.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 78:** Return / رجّع `() => observer.disconnect()` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `observer.disconnect(...)`: توقف مراقبة الأهداف الخاصة بهذا observer. مدخلاتها: بدون مدخلات. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 79:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 81–88

```tsx
  useEffect(() => {
    const video = videoRef.current;
    if (!video || failed || !shouldLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined);
```

**السطر 81:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `() => {     const video = videoRef.current;     if (!video || failed || !shouldLoad) return;      const observ…`، `[failed, shouldLoad]`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 82:** Variable declaration / تعريف `video` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 83:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 85:** Variable declaration / تعريف `observer` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `IntersectionObserver(...)`: يراقب دخول عنصر ضمن viewport/root بشكل async؛ لا يحتاج listener scroll يدوي لكل عنصر. القيم المكتوبة هنا: `([entry]) => {         if (entry.isIntersecting) {           void video.play().catch(() => undefined);        …`، `{ threshold: 0.25 }`. العائد/الأثر: observer instance. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 86:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 87:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 88:** Catch: استقبل الخطأ من try/Promise حسب السياق وتعامل مع رسالته؛ catch لا تعني نجاح الطلب الأصلي. الدوال الموجودة في السطر: `video.play().catch(...)`: تسجّل معالجة فشل الـPromise. القيم المكتوبة هنا: `() => undefined`. العائد/الأثر: Promise جديدة؛ عدم إعادة الرمي قد يحوّل المسار لنجاح.؛ `video.play(...)`: تحاول بدء تشغيل فيديو/صوت. مدخلاتها: بدون مدخلات. العائد/الأثر: Promise قد ترفض بسبب autoplay أو خطأ؛ عالجها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 89–96

```tsx
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(video);
```

**السطر 89:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 90:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `video.pause(...)`: توقف التشغيل مؤقتًا. مدخلاتها: بدون مدخلات. العائد/الأثر: undefined؛ لا تمسح الملف.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 91:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 92:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 93:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 94:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 96:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `observer.observe(...)`: تبدأ مراقبة عنصر بالـobserver الحالي. القيم المكتوبة هنا: `video`. العائد/الأثر: عادة undefined؛ التقارير تصل للـcallback المسجّلة عند إنشاء observer.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 97–104

```tsx
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [failed, shouldLoad]);

  if (failed) {
    return (
```

**السطر 97:** Return / رجّع `() => {` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 98:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `observer.disconnect(...)`: توقف مراقبة الأهداف الخاصة بهذا observer. مدخلاتها: بدون مدخلات. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 99:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `video.pause(...)`: توقف التشغيل مؤقتًا. مدخلاتها: بدون مدخلات. العائد/الأثر: undefined؛ لا تمسح الملف.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 100:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 101:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 103:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 104:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

### السطور 105–112

```tsx
      <img
        src={item.poster}
        alt={decorative ? '' : `${item.alt} (video unavailable)`}
        loading="lazy"
        width="420"
        height="270"
        className={videoTileClassName}
      />
```

**السطر 105:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 106:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 107:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 108:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 109:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 110:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 111:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 112:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 113–120

```tsx
    );
  }

  return (
    <video
      ref={videoRef}
      src={shouldLoad ? item.src : undefined}
      poster={item.poster}
```

**السطر 113:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 114:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 116:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 117:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 118:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 119:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 120:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

### السطور 121–128

```tsx
      aria-label={decorative ? undefined : item.alt}
      aria-hidden={decorative || undefined}
      muted
      loop
      playsInline
      preload="metadata"
      onError={() => setFailed(true)}
      className={videoTileClassName}
```

**السطر 121:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 122:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 123:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 124:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 125:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 126:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 127:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `setFailed(...)`: لو setFailed هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `true`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 128:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

### السطور 129–136

```tsx
    >
      Your browser does not support embedded videos.
    </video>
  );
}

function ImageTile({ item, decorative }: { item: Extract<MediaItem, { type: 'image' }>; decorative: boolean }) {
  const imageRef = useRef<HTMLImageElement>(null);
```

**السطر 129:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 130:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 131:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 132:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 133:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 135:** Function / تعريف دالة `ImageTile`؛ تعريفها مش تشغيلها. يؤخر وضع src حتى الاقتراب ويضبط alt للنسخ الزخرفية. مدخلاتها: {item:Extract<MediaItem,{type:'image'}>,decorative:boolean} ناتجها: JSX img

**السطر 136:** Variable declaration / تعريف `imageRef` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useRef(...)`: مرجع ثابت .current للDOM أو قيمة لا تتطلب render عند تغييرها. القيم المكتوبة هنا: `null`. العائد/الأثر: MutableRefObject. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 137–144

```tsx
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement || shouldLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
```

**السطر 137:** Variable declaration / تعريف `shouldLoad + setShouldLoad` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `false`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 139:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `() => {     const imageElement = imageRef.current;     if (!imageElement || shouldLoad) return;      const obs…`، `[shouldLoad]`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 140:** Variable declaration / تعريف `imageElement` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 141:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 143:** Variable declaration / تعريف `observer` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `IntersectionObserver(...)`: يراقب دخول عنصر ضمن viewport/root بشكل async؛ لا يحتاج listener scroll يدوي لكل عنصر. القيم المكتوبة هنا: `([entry]) => {         if (entry.isIntersecting) {           setShouldLoad(true);           observer.disconnec…`، `{ rootMargin: '500px' }`. العائد/الأثر: observer instance. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 144:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 145–152

```tsx
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '500px' },
    );

```

**السطر 145:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 146:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setShouldLoad(...)`: لو setShouldLoad هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `true`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 147:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `observer.disconnect(...)`: توقف مراقبة الأهداف الخاصة بهذا observer. مدخلاتها: بدون مدخلات. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 148:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 149:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 150:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 151:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 153–160

```tsx
    observer.observe(imageElement);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <img
      ref={imageRef}
      src={shouldLoad ? item.src : undefined}
```

**السطر 153:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `observer.observe(...)`: تبدأ مراقبة عنصر بالـobserver الحالي. القيم المكتوبة هنا: `imageElement`. العائد/الأثر: عادة undefined؛ التقارير تصل للـcallback المسجّلة عند إنشاء observer.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 154:** Return / رجّع `() => observer.disconnect()` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `observer.disconnect(...)`: توقف مراقبة الأهداف الخاصة بهذا observer. مدخلاتها: بدون مدخلات. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 155:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 157:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 158:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 159:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 160:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

### السطور 161–168

```tsx
      alt={decorative ? '' : item.alt}
      loading="lazy"
      decoding="async"
      width="420"
      height="270"
      className={imageTileClassName}
    />
  );
```

**السطر 161:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 162:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 163:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 164:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 165:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 166:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 167:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 168:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 169–176

```tsx
}

function Tile({ item, decorative }: { item: MediaItem; decorative: boolean }) {
  if (item.type === 'video') {
    return <VideoTile item={item} decorative={decorative} />;
  }

  return <ImageTile item={item} decorative={decorative} />;
```

**السطر 169:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 171:** Function / تعريف دالة `Tile`؛ تعريفها مش تشغيلها. type narrowing: لو video يمرر للVideoTile، وإلاImageTile. مدخلاتها: {item:MediaItem,decorative:boolean} ناتجها: React element

**السطر 172:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 173:** Return / رجّع `<VideoTile item={item} decorative={decorative} />` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 174:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 176:** Return / رجّع `<ImageTile item={item} decorative={decorative} />` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

### السطور 177–184

```tsx
}

function MediaGroup({ items, repeat }: { items: MediaItem[]; repeat: number }) {
  return (
    <div className="flex flex-shrink-0 gap-3" aria-hidden={repeat > 0 || undefined}>
      {items.map((item, index) => (
        <Tile key={`${repeat}-${item.src}-${index}`} item={item} decorative={repeat > 0} />
      ))}
```

**السطر 177:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 179:** Function / تعريف دالة `MediaGroup`؛ تعريفها مش تشغيلها. map لمجموعة واحدة؛ repeat>0 يخفي النسخة المتكررة عن assistive tech. مدخلاتها: {items:MediaItem[],repeat:number} ناتجها: JSX group

**السطر 180:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 181:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 182:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `items.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(item, index) => (         <Tile key={'${repeat}-${item.src}-${index}'} item={item} decorative={repeat > 0} />…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 183:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 184:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 185–192

```tsx
    </div>
  );
}

const wrap = (value: number, width: number) => ((value % width) + width) % width;

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
```

**السطر 185:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 186:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 187:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 189:** Variable declaration / تعريف `wrap` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `wrap` هنا: يرجع موضع دوري موجب حتى لو value سالب؛ width لازم أكبر من0 في القياسات الحالية. المدخلات: value,width:number. الناتج/الأثر: number من0لأقل منwidth.

**السطر 191:** Function / تعريف دالة `MarqueeSection`؛ تعريفها مش تشغيلها. يربط refs للصفين والمجموعتين، ويعمل scroll transform بطريقة rAF مع cleanup. مدخلاتها: لا props ناتجها: React element

**السطر 192:** Variable declaration / تعريف `sectionRef` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useRef(...)`: مرجع ثابت .current للDOM أو قيمة لا تتطلب render عند تغييرها. القيم المكتوبة هنا: `null`. العائد/الأثر: MutableRefObject. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 193–200

```tsx
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const row1GroupRef = useRef<HTMLDivElement>(null);
  const row2GroupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

```

**السطر 193:** Variable declaration / تعريف `row1Ref` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useRef(...)`: مرجع ثابت .current للDOM أو قيمة لا تتطلب render عند تغييرها. القيم المكتوبة هنا: `null`. العائد/الأثر: MutableRefObject. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 194:** Variable declaration / تعريف `row2Ref` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useRef(...)`: مرجع ثابت .current للDOM أو قيمة لا تتطلب render عند تغييرها. القيم المكتوبة هنا: `null`. العائد/الأثر: MutableRefObject. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 195:** Variable declaration / تعريف `row1GroupRef` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useRef(...)`: مرجع ثابت .current للDOM أو قيمة لا تتطلب render عند تغييرها. القيم المكتوبة هنا: `null`. العائد/الأثر: MutableRefObject. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 196:** Variable declaration / تعريف `row2GroupRef` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useRef(...)`: مرجع ثابت .current للDOM أو قيمة لا تتطلب render عند تغييرها. القيم المكتوبة هنا: `null`. العائد/الأثر: MutableRefObject. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 198:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `() => {     let frame = 0;      const updateRows = () => {       frame = 0;       const section = sectionRef.c…`، `[]`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 199:** Variable declaration / تعريف `frame` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `0`، مش ناتج طلب شبكة.

### السطور 201–208

```tsx
    const updateRows = () => {
      frame = 0;
      const section = sectionRef.current;
      const row1 = row1Ref.current;
      const row2 = row2Ref.current;
      const row1Group = row1GroupRef.current;
      const row2Group = row2GroupRef.current;
      if (!section || !row1 || !row2 || !row1Group || !row2Group) return;
```

**السطر 201:** Variable declaration / تعريف `updateRows` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `updateRows` هنا: يقيس مكان section وعرض كل مجموعة ويحرك الصفين في اتجاهين عكس بعض. المدخلات: refs/window.scrollY/window.innerHeight. الناتج/الأثر: undefined؛ direct DOM style لا state لكل scroll.

**السطر 202:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 203:** Variable declaration / تعريف `section` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 204:** Variable declaration / تعريف `row1` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 205:** Variable declaration / تعريف `row2` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 206:** Variable declaration / تعريف `row1Group` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 207:** Variable declaration / تعريف `row2Group` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 208:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

### السطور 209–216

```tsx

      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const progress = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      const row1Width = row1Group.offsetWidth + GAP;
      const row2Width = row2Group.offsetWidth + GAP;

      row1.style.transform = `translate3d(${-row1Width + wrap(progress, row1Width)}px, 0, 0)`;
      row2.style.transform = `translate3d(${-wrap(progress, row2Width)}px, 0, 0)`;
```

**السطر 210:** Variable declaration / تعريف `sectionTop` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `section.getBoundingClientRect(...)`: تقيس موضع وأبعاد العنصر بالنسبة للـviewport. مدخلاتها: بدون مدخلات. العائد/الأثر: DOMRect؛ القيم تتأثر بالـscroll والتحويلات.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 211:** Variable declaration / تعريف `progress` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 212:** Variable declaration / تعريف `row1Width` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 213:** Variable declaration / تعريف `row2Width` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 215:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods. الدوال الموجودة في السطر: `wrap(...)`: يرجع موضع دوري موجب حتى لو value سالب؛ width لازم أكبر من0 في القياسات الحالية. القيم المكتوبة هنا: `progress`، `row1Width`. العائد/الأثر: number من0لأقل منwidth. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 216:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods. الدوال الموجودة في السطر: `wrap(...)`: يرجع موضع دوري موجب حتى لو value سالب؛ width لازم أكبر من0 في القياسات الحالية. القيم المكتوبة هنا: `progress`، `row2Width`. العائد/الأثر: number من0لأقل منwidth. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 217–224

```tsx
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateRows);
    };

    const resizeObserver = new ResizeObserver(requestUpdate);
    if (row1GroupRef.current) resizeObserver.observe(row1GroupRef.current);
```

**السطر 217:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 219:** Variable declaration / تعريف `requestUpdate` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `requestUpdate` هنا: يضمن في الframe الواحدة طلب تحديث واحد فقط؛ ده scheduling مش debouncing بالوقت. المدخلات: event غير مستخدم. الناتج/الأثر: undefined؛ يحتفظ frame handle.

**السطر 220:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `window.requestAnimationFrame(...)`: تطلب callback قبل فرصة رسم إطار قادم؛ ليست loop تلقائية. القيم المكتوبة هنا: `updateRows`. العائد/الأثر: request ID؛ لو محتاج تكرار تعيد التسجيل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 221:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 223:** Variable declaration / تعريف `resizeObserver` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ResizeObserver(...)`: يراقب تغير حجم عنصر ويشغّل callback؛ cleanup بdisconnect. القيم المكتوبة هنا: `requestUpdate`. العائد/الأثر: observer instance. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 224:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `resizeObserver.observe(...)`: تبدأ مراقبة عنصر بالـobserver الحالي. القيم المكتوبة هنا: `row1GroupRef.current`. العائد/الأثر: عادة undefined؛ التقارير تصل للـcallback المسجّلة عند إنشاء observer.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 225–232

```tsx
    if (row2GroupRef.current) resizeObserver.observe(row2GroupRef.current);

    updateRows();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      window.removeEventListener('scroll', requestUpdate);
```

**السطر 225:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `resizeObserver.observe(...)`: تبدأ مراقبة عنصر بالـobserver الحالي. القيم المكتوبة هنا: `row2GroupRef.current`. العائد/الأثر: عادة undefined؛ التقارير تصل للـcallback المسجّلة عند إنشاء observer.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 227:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `updateRows(...)`: يقيس مكان section وعرض كل مجموعة ويحرك الصفين في اتجاهين عكس بعض. مدخلاتها: refs/window.scrollY/window.innerHeight العائد/الأثر: undefined؛ direct DOM style لا state لكل scroll. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 228:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `window.addEventListener(...)`: تسجّل listener؛ مصدر الحدث يناديها ويمرر Event. القيم المكتوبة هنا: `'scroll'`، `requestUpdate`، `{ passive: true }`. العائد/الأثر: undefined؛ لا تشغّل handler لحظة التسجيل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 229:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `window.addEventListener(...)`: تسجّل listener؛ مصدر الحدث يناديها ويمرر Event. القيم المكتوبة هنا: `'resize'`، `requestUpdate`. العائد/الأثر: undefined؛ لا تشغّل handler لحظة التسجيل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 231:** Return / رجّع `() => {` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 232:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `window.removeEventListener(...)`: تلغي listener بنفس الاسم ومرجع الدالة وcapture المناسب. القيم المكتوبة هنا: `'scroll'`، `requestUpdate`. العائد/الأثر: undefined؛ لا توقف الحدث نفسه.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 233–240

```tsx
      window.removeEventListener('resize', requestUpdate);
      resizeObserver.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
```

**السطر 233:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `window.removeEventListener(...)`: تلغي listener بنفس الاسم ومرجع الدالة وcapture المناسب. القيم المكتوبة هنا: `'resize'`، `requestUpdate`. العائد/الأثر: undefined؛ لا توقف الحدث نفسه.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 234:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `resizeObserver.disconnect(...)`: توقف مراقبة الأهداف الخاصة بهذا observer. مدخلاتها: بدون مدخلات. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 235:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `window.cancelAnimationFrame(...)`: تلغي طلب إطار معلّق. القيم المكتوبة هنا: `frame`. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 236:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 237:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 239:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 240:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 241–248

```tsx
      id="showcase"
      ref={sectionRef}
      className="overflow-hidden pt-24 pb-10 sm:pt-32 md:pt-40"
      style={{ background: '#0C0C0C' }}
    >
      <div className="flex flex-col gap-3">
        <div ref={row1Ref} className="flex gap-3 will-change-transform">
          {[0, 1].map((repeat) => (
```

**السطر 241:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 242:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 243:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 244:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 245:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 246:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 247:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 248:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `[0, 1].map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(repeat) => (             <div key={repeat} ref={repeat === 0 ? row1GroupRef : undefined} className="flex flex…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 249–256

```tsx
            <div key={repeat} ref={repeat === 0 ? row1GroupRef : undefined} className="flex flex-shrink-0 gap-3">
              <MediaGroup items={ROW_1} repeat={repeat} />
            </div>
          ))}
        </div>
        <div ref={row2Ref} className="flex gap-3 will-change-transform">
          {[0, 1].map((repeat) => (
            <div key={repeat} ref={repeat === 0 ? row2GroupRef : undefined} className="flex flex-shrink-0 gap-3">
```

**السطر 249:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 250:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 251:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 252:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 253:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 254:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 255:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `[0, 1].map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(repeat) => (             <div key={repeat} ref={repeat === 0 ? row2GroupRef : undefined} className="flex flex…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 256:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 257–264

```tsx
              <MediaGroup items={ROW_2} repeat={repeat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**السطر 257:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 258:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 259:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 260:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 261:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 262:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 263:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 264:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
