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

## سؤال 6: نفهم methods الـ state والأحداث بدل ما نحفظها؟

### `useState(initialValue)` بترجع إيه؟

```jsx
const [serviceId, setServiceId] = useState('');
```

- Hook جاهزة من React، مدخلها هنا قيمة البداية `''`، وبترجع array من عنصرين: قيمة الحالة الحالية، ودالة تحديثها.
- `[serviceId, setServiceId]` تفكيك للنتيجة. الأسماء اخترناها، لكن الترتيب ثابت: القيمة أولًا والدالة ثانيًا.
- `setServiceId('2')` تمرّر قيمة الحالة التالية. setter تطلب render بالقيمة الجديدة، وعائدها undefined، مش Promise نستناها بـ await.
- متغير `serviceId` في نفس تنفيذ handler يفضل snapshot الحالية؛ setter مش بتغيّر المتغير المحلي بأثر رجعي.

### `onChange` بتبعت إيه؟

```jsx
<select value={serviceId} onChange={(event) => setServiceId(event.target.value)}>
    <option value="">Choose</option>
    <option value="2">Tire Service</option>
</select>
```

- `onChange` prop حدث في React. بنمرّر لها دالة، وReact تنادي الدالة لما اختيار المستخدم يتغيّر.
- ده جزء الواجهة داخل ServicePicker اللي عرّفناها فوق، وفيها serviceId وsetServiceId بالفعل. أول option اختيار فارغ، والثانية تعرض Tire Service وتبعث النص `'2'`؛ إغلاق select ينهي القائمة.
- `event` هو event object اللي React مرّرته، مش معرّف الخدمة نفسه.
- `event.target` العنصر اللي صدر منه الحدث؛ في المثال هو select.
- `.value` هنا خاصية DOM للقيمة، **مش ref.value الخاصة بـ Vue**. قيمة option العادية في React هنا نص؛ اختيار `value="2"` يعطي `'2'`.
- نقرأ النص ونمرّره لـ setter. React تعيد العرض، و`value={serviceId}` تربط القائمة بالحالة الجديدة. ده controlled input.
- لو محتاج رقم صراحة تقدر تستخدم `Number(event.target.value)`، لكن خطّط لقيمة الاختيار الفارغ لأن Number('') تساوي صفرًا، مش null.

### functional setter: ليه ساعات بنكتب دالة بدل قيمة؟

**مثال تدريبي كامل صغير على زر قائمة الموبايل، بنفس فكرة Navbar البيتزا:**

```jsx
import { useState } from 'react';

export default function MenuToggle() {
    const [isOpen, setIsOpen] = useState(false);

    function toggleMenu() {
        setIsOpen((current) => !current);
    }

    return (
        <button type="button" onClick={toggleMenu} aria-expanded={isOpen}>
            {isOpen ? 'Close' : 'Menu'}
        </button>
    );
}
```

- `setIsOpen((current) => !current)` تمرّر **updater function**. React تناديها بالقيمة السابقة في قائمة التحديثات، وناتجها يبقى القيمة التالية.
- `current` اسم المدخل؛ مش state ثانية. لو false فـ `!current` true، ولو true فالنتيجة false.
- `toggleMenu` دالتنا، لا تحتاج مدخلات ولا ترجع بيانات؛ أثرها طلب تحديث state. React قد تمرّر click event لكننا لا نقرأه هنا.
- `onClick={toggleMenu}` يمرّر الدالة للتشغيل عند الضغط. `onClick={toggleMenu()}` يشغّلها أثناء render، وده خطأ ممكن يعمل حلقة تحديث.
- `aria-expanded` يربط حالة الانفتاح لمساعدة التقنيات المساعدة؛ لا يفتح القائمة بنفسه. هنا بنعرض النص فقط، فده تدريب state مش mobile menu مكتملة.

**مثال يوضح الفارق:** لو كتبت استدعاءين `setCount(count + 1)` في نفس handler، الاتنين ممكن يطلبوا نفس القيمة لأن count snapshot واحدة. استدعاءان `setCount(current => current + 1)` يضيفوا واحدًا ثم واحدًا إلى القيمة المعلّقة. دالة updater لازم تكون pure: لا طلب شبكة ولا تعديل localStorage جواها؛ React قد تختبرها أكثر من مرة بالتطوير.

### `useEffect(setup, dependencies)` مش timer

```js
useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
}, []);
```

ده مقتطف توضيحي يتطلب `handleResize` معرّفة داخل effect أو ذات مرجع ثابت مناسب. المثال الكامل في السؤال 5 يعرّفها داخل effect.

- أول مدخل دالة setup تربط اشتراكًا خارجيًا، وممكن ترجع دالة cleanup.
- تاني مدخل dependencies تخبر React بالقيم reactive اللي setup تقرأها. `[]` مش معناها interval ولا كل صفر ثانية.
- `addEventListener` Browser method ترجع undefined وتسجّل listener؛ عند resize المتصفح ينادي handleResize ويمرّر الحدث.
- `removeEventListener` تلغي نفس الاشتراك؛ لازم نفس مرجع الدالة، مش arrow جديدة بنفس المحتوى.
- `window.innerWidth` خاصية عرض نافذة بالـ CSS pixels، مش method. `console.log` في المثال تطبعها في Console ولا تغيّر واجهة المكوّن.
- cleanup عند unmount، وقبل setup جديدة لو dependencies اتغيرت. في StrictMode التطوير قد تظهر دورة إضافية لفحص التنظيف، فمش دقيق نقول «التنفيذ مرة واحدة مضمون».

## سؤال 7: مثال React + TypeScript من ملفين لحد النتيجة في الصفحة

**تدريب إضافي كامل على نفس فكرة كروت المشاريع في البورتفوليو.** نفّذه في مشروع React/TypeScript التدريبي فقط، مش Vue أو JSX بلا إعداد TypeScript. الملفان في نفس الفولدر، وApp يقدر يعرض `<ProjectPicker />` بعد استيراده.

### الملف الأول: `ProjectCard.tsx` — عرض المشروع وإبلاغ الأب

```tsx
export interface Project {
    id: string;
    title: string;
}

interface ProjectCardProps {
    project: Project;
    onSelect: (project: Project) => void;
}

export default function ProjectCard({ project, onSelect }: ProjectCardProps) {
    return (
        <button type="button" onClick={() => onSelect(project)}>
            {project.title}
        </button>
    );
}
```

- `export interface Project` يصدّر وصف شكل object للاستخدام في ملف آخر؛ مش class ومش بيانات بتتخزن.
- `ProjectCardProps` يصف مدخلات الطفل: object مشروع ودالة callback.
- `onSelect: (project: Project) => void` **نوع دالة**: تاخد object من نوع Project، وعائدها مش مستخدم كقيمة. `void` مش معناها الدالة ممنوعة تغيّر state، بل لا نعتمد على قيمة راجعة منها هنا.
- `{ project, onSelect }` تفكيك props object. `: ProjectCardProps` يحدد نوع object اللي فككناه.
- `onClick={() => onSelect(project)}` دالة تتنفذ عند الضغط؛ ساعتها تبعت object المشروع للدالة القادمة من الأب. مش بتنادي onSelect وقت عرض الزر.
- `{project.title}` النص اللي المستخدم يشوفه. `key` مش مطلوبة هنا داخل الطفل؛ مكانها في قائمة الأب.

### الملف التاني: `ProjectPicker.tsx` — مالك الاختيار

```tsx
import { useState } from 'react';
import ProjectCard, { type Project } from './ProjectCard';

const projects: Project[] = [
    { id: 'autocare-pro', title: 'AutoCare Pro' },
    { id: 'pizza-crm', title: 'What The Crust' },
];

export default function ProjectPicker() {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    function handleSelect(project: Project) {
        setSelectedProject(project);
    }

    return (
        <section>
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} onSelect={handleSelect} />
            ))}
            {selectedProject && <p>Selected: {selectedProject.title}</p>}
        </section>
    );
}
```

- نستورد المكوّن كـ default، والنوع كـ named type import. كلمة `type` تقول إن Project مطلوبة لفحص الأنواع، مش object أثناء التشغيل.
- `Project[]` قائمة مشاريع بنفس الشكل؛ القوسان هنا في **وصف النوع**.
- `useState<Project | null>(null)` الـ `<...>` تحديد نوع الحالة. `|` في النوع يعني إما Project وإما null. مفيش اختيار في البداية، وبعد الضغط نخزّن object.
- `handleSelect(project: Project)` دالة الأب تستقبل المشروع المختار وتطلب تغيير الحالة؛ لا تحتاج return لأننا محتاجين أثر التحديث.
- `projects.map(callback)` method array ترجع array جديدة بنفس عدد المشاريع؛ كل ناتج callback هنا React element من ProjectCard. مش filtering، ومش بتعدّل القائمة الأصلية.
- `project={project}` ينزل البيانات للطفل، و`onSelect={handleSelect}` ينزل دالة الطفل يقدر يناديها لاحقًا.
- `selectedProject && ...` يعرض النص لما يكون فيه object. TypeScript يضيّق النوع في الطرف التاني لأن null لا تكمل الشرط، فنقدر نقرأ `.title` بأمان في التعبير ده.

**تتبع الضغطة:** الأب يعرض كارتين ← اضغط What The Crust ← الطفل ينادي `onSelect` ومعاه `{id:'pizza-crm',title:'What The Crust'}` ← دالة handleSelect في الأب تشتغل ← setter تطلب render ← فقرة Selected تعرض الاسم. تقدر تغيّر الاختيار بالضغط على الكارت الآخر من غير أي HTTP request.

**غلطة مهمة:** `onSelect={handleSelect(project)}` في الأب غلط هنا؛ انت بتنادي الدالة أثناء render وبتمّرر ناتجها، مش callback. خليك في النسخة اللي فوق.

<details><summary>إنترفيو: callback prop في React هي emit في Vue بالضبط؟</summary>

الاتنين يخدموا فكرة إبلاغ الأب. في React الأب يمرّر دالة كـ prop والطفل يناديها. في Vue الطفل يعلن component event بـ defineEmits ويستخدم emit، والأب يربط listener. الفكرة متشابهة، لكن واجهة الاستخدام مش واحدة؛ متكتبش @select داخل React أو onSelect كأنه emit تلقائي في Vue.

</details>

التالي: [اختبارات وDebugging وGit](15-testing-git-and-debugging.md).
