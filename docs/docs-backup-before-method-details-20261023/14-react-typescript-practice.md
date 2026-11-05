# 14 — React وTypeScript من البورتفوليو والبيتزا

[الفهرس](00-start-here.md) · اقرأ [JavaScript](12-javascript-practice.md) أولًا. خُد سؤال واحد؛ مش مطلوب تخلط React وVue في ملف واحد.

Pizza يستخدم React JSX. البورتفوليو يستخدم React TSX؛ TypeScript يضيف فحص أنواع قبل التشغيل، ومش backend. الأمثلة التالية مبسّطة من المصدر أو تدريب إضافي ومكتوب نوع كل مثال.

## سؤال 1: أغيّر اختيار خدمة في React إزاي؟

**مثال تدريبي إضافي** للمقارنة مع Vue. نفّذه كمكوّن React منفصل مستورد ومعروض من مشروع تدريب React:

```jsx
import { useState } from 'react';

export default function ServicePicker() {
    const [serviceId, setServiceId] = useState('');
    return (
        <select value={serviceId} onChange={(event) => setServiceId(event.target.value)}>
            <option value="">Choose</option>
            <option value="1">Oil Change</option>
        </select>
    );
}
```

1. استيراد hook اسمه useState.
3. `export default` تصدير المكوّن الرئيسي؛ الدالة React لازم يبدأ اسمها بحرف كبير.
4. `useState('')` ترجع array من قيمة ودالة تحديث؛ `[]` هنا destructuring مش إنشاء قائمة خدمات. serviceId القيمة وsetServiceId لتغييرها.
5. `return` ترجع JSX اللي React تعرضه؛ الأقواس تضم تعبير متعدد السطور.
6. `value` تربط قيمة القائمة بالحالة؛ onChange يستقبل event؛ target العنصر اللي اتغيّر؛ value قيمته؛ setter تطلب تحديث الحالة والعرض.
7–8. اختيارات نصية؛ value هنا نص `'1'` وليس رقمًا.
9–11. قفل العناصر والتعبير والدالة.

**بإيدك:** أضف `<p>{serviceId}</p>` خارج select داخل wrapper مشترك. اختار Oil Change؛ المتوقع 1.

**غلطة شائعة:** استخدام `serviceId = '1'` بدل setter، أو كتابة `v-model` داخل React. في JSX تعبير JavaScript بين `{}` مش `{{}}`.

**سؤال إنترفيو:** تحديث React state بيظهر فورًا في نفس سطر التنفيذ؟

<details><summary>الإجابة</summary>setter تطلب render جديد؛ المتغير في التنفيذ الحالي يمثل snapshot الحالية. لو القيمة الجديدة تعتمد على القديمة نستخدم functional update.</details>

المقابل الفعلي: [حالات OrderContext](../resources/js/context/OrderContext.jsx).

## سؤال 2: أعرّف شكل بيانات المشروع بـ TypeScript؟

**مثال مبسّط** من [ProjectsSection](../../mo-m-en-portfolio/src/sections/ProjectsSection.tsx). داخل ملف `.tsx` تدريبي:

```tsx
interface Project {
    id: string;
    title: string;
    liveUrl?: string;
}
const projects: Project[] = [
    { id: 'autocare-pro', title: 'AutoCare Pro' },
];
```

1. `interface` تصف شكل object وقت فحص TypeScript؛ Project اسم النوع.
2–3. id وtitle لازم يكونوا نصوصًا؛ `:` هنا تحديد نوع، مش إسناد قيمة.
4. `?` بعد اسم الخاصية تجعلها اختيارية؛ ممكن مفيش liveUrl.
5. نهاية وصف النوع.
6. `Project[]` معناها قائمة عناصر من النوع Project.
7. object مطابق؛ عدم وجود liveUrl مسموح.
8. نهاية القائمة.

**بإيدك:** غيّر title إلى الرقم 123. المتوقع خطأ TypeScript؛ رجّعه نص قبل build.

**غلطة شائعة:** اعتبار interface تحققًا من JSON الشبكة وقت التشغيل. الأنواع بتتشال من JavaScript النهائي؛ بيانات غير موثوقة تحتاج runtime validation.

**سؤال إنترفيو:** TypeScript يمنع كل أخطاء التشغيل؟

<details><summary>الإجابة</summary>لأ؛ يكتشف فئة من أخطاء الأنواع قبل التشغيل، مش انقطاع الشبكة أو بيانات API المخالفة وقت التنفيذ.</details>

## سؤال 3: أبعث project لمكوّن وأعرض قائمة؟

**مثال مبسّط** من نفس ProjectsSection. باستخدام النوع والقائمة السابقة، أضف:

```tsx
function ProjectCard({ project }: { project: Project }) {
    return <h2>{project.title}</h2>;
}

export default function Projects() {
    return (
        <section>
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </section>
    );
}
```

1. `{ project }` تفكيك props؛ الجزء بعد `:` يحدد نوع props object. الخاصية project نوعها Project.
2. اعرض عنوان الـ object اللي الأب بعته.
3. نهاية الابن.
5. المكوّن الأب.
6–7. رجّع section تحتوي القائمة.
8. JavaScript داخل JSX؛ map ترجع عنصرًا لكل project؛ الأقواس بعد السهم ترجع JSX مباشرة.
9. key هوية فريدة؛ project prop بيانات للابن. React key مش prop عادية تصل للابن.
10–13. نهاية map والعناصر والأب.

**بإيدك:** أضف What The Crust إلى projects. المتوقع عنوانان بدون نسخ JSX.

**غلطة شائعة:** تكتب `key={Math.random()}` فتغيّر الهوية مع كل render. استخدم id ثابت.

**سؤال إنترفيو:** مين مسؤول عن تعديل البيانات؟

<details><summary>الإجابة</summary>الأب مالك البيانات يحدّثها. الابن يقرأ props ويطلب تغييرًا عبر callback لما نحتاج تفاعل.</details>

## سؤال 4: أعمل props اختيارية وقيم افتراضية؟

**مثال مبسّط** من [FadeIn](../../mo-m-en-portfolio/src/components/FadeIn.tsx):

```tsx
interface FadeInProps {
    delay?: number;
}
function Example({ delay = 0 }: FadeInProps) {
    return <p>Delay: {delay}</p>;
}
```

1. وصف props.
2. delay اختيارية ونوعها number.
3. نهاية interface.
4. تفكيك delay مع قيمة افتراضية صفر لو undefined أو غير مبعوتة؛ FadeInProps نوع مدخلات المكوّن.
5. عرض القيمة؛ ده تمرين أنواع مش تطبيق أنيميشن.
6. نهاية المكوّن.

**بإيدك:** اعرض `<Example />` ثم `<Example delay={0.5} />` داخل مكوّن تدريب. المتوقع 0 ثم 0.5.

**غلطة شائعة:** `delay="0.5"` نص، بينما النوع رقم. الأقواس تبعت JavaScript number.

**سؤال إنترفيو:** `?` هنا زي `?.`؟

<details><summary>الإجابة</summary>لأ؛ `delay?` خاصية اختيارية في نوع TypeScript. `object?.property` optional chaining أثناء التنفيذ.</details>

## سؤال 5: أوقف listener لما مكوّن React يتشال؟

**مثال تدريبي مبسّط** على cleanup الموجودة في [ProjectsSection](../../mo-m-en-portfolio/src/sections/ProjectsSection.tsx). استورد `useEffect` وضع داخل مكوّن React:

```js
useEffect(() => {
    function handleResize() {
        console.log(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);
```

1. effect لتوصيل المكوّن بنظام خارجي؛ هنا أحداث المتصفح.
2–4. دالة تطبع عرض النافذة.
5. بدء الاستماع.
6–8. الدالة المرجعة cleanup تلغي نفس listener؛ تشغيلها عند unmount، وقبل إعادة effect لو اعتماداتها اتغيّرت.
9. `[]` مفيش reactive dependencies هنا؛ effect مش بتتكرر مع كل render. في Strict Mode بالتطوير React ممكن تنفّذ دورة setup/cleanup إضافية للتأكد من سلامة الكود.

**بإيدك:** غيّر حجم النافذة. المتوقع عرضها في Console. المكوّن ما بيطبعش قبل أول resize لأننا ما ناديناش الدالة يدويًا.

**غلطة شائعة:** listener جديد كل render بدون cleanup.

**سؤال إنترفيو:** المقابل في Vue؟

<details><summary>الإجابة</summary>onMounted للإضافة وonBeforeUnmount أو onUnmounted للإزالة؛ الفكرة إدارة عمر الاشتراك، مش حفظ أسماء hooks فقط.</details>

التالي: [اختبارات وDebugging وGit](15-testing-git-and-debugging.md).
