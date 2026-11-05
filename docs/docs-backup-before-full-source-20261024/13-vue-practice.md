# 13 — Vue: نفس أمثلة AutoCare خطوة خطوة

[الفهرس](00-start-here.md) · قبل الدرس: [JavaScript](12-javascript-practice.md).

المصدر الأساسي [AutoCare App.vue](../../autocare-booking/resources/js/components/App.vue). الأمثلة الصغيرة **تدريب مبسّط على نفس الفكرة**، مش نقل حرفي لكل التطبيق. نفّذ كل سؤال في مكوّن تدريب داخل مشروعك اليدوي؛ متستبدلش App.vue الأصلي الكبير.

## سؤال 1: أغيّر النص لما أضغط زر إزاي؟

ده مكوّن تدريب كامل صغير:

```vue
<script setup>
import { ref } from 'vue';
const menuOpen = ref(false);
</script>

<template>
    <button type="button" @click="menuOpen = !menuOpen">
        {{ menuOpen ? 'Close' : 'Menu' }}
    </button>
</template>
```

شرح السطور:

1. `<script setup>` جزء JavaScript؛ تعريفاته متاحة في template.
2. `import` استيراد أداة `ref` من Vue.
3. حالة reactive تبدأ false. `const` يمنع إعادة إسناد المرجع، مش تغيير `.value`.
4. نهاية script.
6. بداية واجهة المكوّن.
7. زر عادي؛ `@click` ينفّذ التعبير عند الضغط؛ `!` تعكس true/false. في template Vue تفك ref تلقائيًا.
8. `{{ }}` عرض نص؛ `? :` اختيار بين نصين حسب الحالة.
9–10. قفل الزر وtemplate.

**بإيدك:** اضغط مرتين. المتوقع Close ثم Menu.

**غلطة شائعة:** في JavaScript نكتب `menuOpen.value`؛ في template هنا `menuOpen` بدون value.

**سؤال إنترفيو:** الفرق بين متغير عادي وref؟

<details><summary>الإجابة</summary>ref تعطي Vue حالة قابلة للتتبع لتحديث الواجهة عند تغيّرها؛ تغيير متغير عادي مش وسيلة reactive لتحديث العرض.</details>

## سؤال 2: أعرض قائمة خدمات وأخزّن الاختيار؟

داخل script للمكوّن التدريبي، احتفظ باستيراد ref مرة واحدة وأضف:

```js
const services = [
    { id: 1, name: 'Oil Change', price: 450 },
    { id: 2, name: 'Tire Service', price: 300 },
];
const selectedServiceId = ref('');
```

1–4. قائمة object لكل خدمة، وفيها معرّف واسم وسعر.
5. الاختيار يبدأ فارغًا؛ ده المتغير اللي v-model هتحدّثه.

داخل template:

```vue
<select v-model="selectedServiceId" aria-label="Service">
    <option disabled value="">Choose a service</option>
    <option v-for="service in services" :key="service.id" :value="service.id">
        {{ service.name }}
    </option>
</select>
```

1. `v-model` تربط قيمة القائمة بالحالة في الاتجاهين؛ `aria-label` اسم مفهوم للقائمة.
2. اختيار إرشادي قيمته فارغة؛ disabled يمنع اختياره.
3. `v-for` تكرر option؛ service العنصر الحالي؛ `:key` هوية مستقرة وفريدة؛ `:value` يربط رقم id الحقيقي، مش نص `service.id`.
4. اسم الخدمة المعروض للمستخدم.
5–6. إغلاق العناصر.

**بإيدك:** أضف `<p>{{ selectedServiceId }}</p>` بعد القائمة. المتوقع 1 أو 2 عند الاختيار.

**غلطة شائعة:** `value="service.id"` بدون النقطتين يخزّن النص نفسه لكل الخيارات.

**سؤال إنترفيو:** هل key هي القيمة اللي select تختارها؟

<details><summary>الإجابة</summary>لأ؛ key لتتبّع Vue للعناصر، value هي قيمة الاختيار.</details>

## سؤال 3: أظهر السعر تلقائيًا باستخدام computed؟

عدّل الاستيراد إلى `import { ref, computed } from 'vue';` وأضف بعد القائمة والحالة:

```js
const selectedService = computed(() => {
    return services.find((service) => {
        return service.id === selectedServiceId.value;
    });
});
```

1. متغير computed قيمته ناتج الدالة؛ بيتابع selectedServiceId اللي اتقرأت أثناء الحساب.
2. `find` ترجع أول object يحقق الشرط.
3. `===` مقارنة صارمة بين id الخدمة وقيمة الاختيار؛ `.value` لقراءة ref داخل JavaScript.
4–5. إغلاق callback واستدعاء find، ثم computed.

وفي template بعد select:

```vue
<div v-if="selectedService">
    <p>{{ selectedService.name }}</p>
    <p>{{ selectedService.price }} EGP</p>
</div>
```

1. لو find رجّعت undefined مش ننشئ التفاصيل؛ بعد اختيار صالح ننشئها.
2. الاسم من object المختار، مش من متغير `service` الخاص بالـ v-for.
3. السعر رقم مع عملة عند العرض.
4. نهاية المجموعة.

**بإيدك:** اختار Tire Service. المتوقع 300 EGP.

**غلطة شائعة:** `selectService` بدل `selectedService`؛ أسماء JavaScript لازم تتطابق حرفيًا.

**سؤال إنترفيو:** ليه computed بدل watch؟

<details><summary>الإجابة</summary>لأننا بنشتق قيمة من حالة موجودة؛ computed بتحفظ النتيجة لحد تغيّر اعتماد reactive. watch مناسب أكتر لأثر جانبي مثل الحفظ أو طلب شبكة، مش نسخ نفس القيمة في حالة إضافية.</details>

## سؤال 4: حالة فيها أكثر من حقل باستخدام reactive؟

مثال مبسّط من [فورم AutoCare](../../autocare-booking/resources/js/components/App.vue). أضف `reactive` للاستيراد، ثم داخل script:

```js
const form = reactive({ name: '', phone: '' });
function clearForm() {
    form.name = '';
    form.phone = '';
}
```

1. `reactive` ترجع proxy لـ object Vue تتبع تغييرات خصائصه.
2. دالة بدون مدخلات لمسح الحقول.
3–4. تعديل الخصائص مباشرة، بدون `.value` مع reactive object.
5. نهاية الدالة.

داخل template:

```vue
<input v-model="form.name" aria-label="Name">
<input v-model="form.phone" type="tel" aria-label="Phone">
<button type="button" @click="clearForm">Clear</button>
<p>{{ form.name }}</p>
```

1–2. ربط كل input بخاصية؛ type tel للموبايل مش تحقق كامل من صحة الرقم.
3. يمرّر الدالة لتتنفّذ عند الضغط.
4. يعرض الاسم الحالي مع الكتابة.

**بإيدك:** اكتب اسم ورقم ثم Clear. المتوقع الحقول تفضى.

**غلطة شائعة:** `form.value.name`؛ ده reactive مش ref.

**سؤال إنترفيو:** التحقق في المتصفح كفاية؟

<details><summary>الإجابة</summary>لأ؛ يساعد المستخدم، لكن Laravel لازم يتحقق من الطلب الحقيقي لأن المتصفح قابل للتعديل.</details>

## سؤال 5: إيه شغل props وemit؟

مثال تدريبي إضافي. اعمل مكوّن ابن `ServiceButton.vue`:

```vue
<script setup>
defineProps({ name: { type: String, required: true } });
const emit = defineEmits(['select']);
</script>
<template>
    <button type="button" @click="emit('select')">{{ name }}</button>
</template>
```

1. بداية script.
2. `defineProps` compiler macro لتعريف مدخل من الأب اسمه name؛ نوعه String ومطلوب. ده تحذير تطوير مش فحص أمان للـ API.
3. `defineEmits` تعرّف الأحداث اللي الابن يرسلها؛ emit دالة الإرسال؛ select اسم الحدث.
4–5. نهاية script وبداية template.
6. عند الضغط ابعت الحدث للأب، واعرض name.
7. نهاية template.

الأب يستورد المكوّن في script:

```js
import ServiceButton from './ServiceButton.vue';
function handleSelect() {
    console.log('Service selected');
}
```

1. المسار يفترض إن الملفين في نفس الفولدر؛ عدّله لو مكانهم مختلف.
2–4. دالة الأب تطبع عند استقبال الاختيار.

واستخدمه في template الأب:

```vue
<ServiceButton name="Oil Change" @select="handleSelect" />
```

السطر يبعت prop اسمها name للابن، ويسمع حدث select ثم يشغّل دالة الأب.

**بإيدك:** غيّر الاسم واضغط. المتوقع الاسم الجديد وظهور الرسالة في Console.

**غلطة شائعة:** الابن يحاول يعدّل prop مباشرة. التغيير المطلوب يتطلب حدث للأب أو حالة محلية مناسبة.

**سؤال إنترفيو:** اتجاه التواصل؟

<details><summary>الإجابة</summary>props من الأب للابن، events من الابن للأب. في AutoCare مثال حقيقي: StoryCanvas يستقبل time ويرسل ready/failure.</details>

المصدر الحقيقي للمقارنة: [StoryCanvas](../../autocare-booking/resources/js/components/StoryCanvas.vue).

## سؤال 6: أربط scroll وألغيه بطريقة صحيحة؟

مثال مبسّط من navbar الأصلية. أضف `onMounted, onBeforeUnmount` للاستيراد:

```js
const navbarScrolled = ref(false);
function updateNavbar() {
    navbarScrolled.value = window.scrollY > 24;
}
onMounted(() => {
    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });
});
onBeforeUnmount(() => {
    window.removeEventListener('scroll', updateNavbar);
});
```

1. حالة تبدأ false.
2–4. دالة تغيّرها حسب تجاوز 24px من أعلى الصفحة.
5. بعد تركيب المكوّن نقدر نتعامل مع المتصفح.
6. نضبط الحالة فورًا، حتى لو الصفحة اتفتحت في مكان scroll سابق.
7. listener يستدعي الدالة عند الحركة؛ passive وعد بعدم استخدام preventDefault في callback، مش بديل عن تقليل الشغل داخلها.
8. نهاية onMounted.
9–11. قبل الإزالة نلغي نفس listener بنفس مرجع الدالة.

الربط داخل template:

```vue
<nav class="navbar" :class="{ 'is-scrolled': navbarScrolled }">AutoCare</nav>
```

السطر يحتفظ بالكلاس الأساسي ويضيف الثاني حسب Boolean. ظهور تأثير بصري محتاج CSS للكلاس؛ هنا بنذاكر JS وVue فقط.

**بإيدك:** اعرض `{{ navbarScrolled }}` داخل nav مؤقتًا وصفحة طويلة. المتوقع false أعلى الصفحة وtrue بعد 24px.

**غلطة شائعة:** كتابة اسم مختلف للدالة في addEventListener أو Window بحرف كبير.

**سؤال إنترفيو:** ليه نلغي listener؟

<details><summary>الإجابة</summary>علشان مايفضلش شغال بعد زوال المكوّن أو يتكرر مع كل تركيب جديد.</details>

## سؤال 7: نفهم وظيفة كل أداة في مثال الاختيار، مش اسمها بس؟

خد جزء واحد من السؤال ده في كل مرة. `ref` و`computed` أدوات Vue، أما `find` أداة JavaScript. `v-model` و`v-if` تعليمات template، مش methods هنستدعيها بالأقواس.

### `ref('')`: بتاخد إيه وبترجع إيه؟

```js
const selectedServiceId = ref('');
selectedServiceId.value = 2;
```

- `ref` دالة جاهزة من Vue؛ مدخلها القيمة الابتدائية، هنا نص فاضي.
- بترجع ref object له خاصية `value`؛ مش بترجع النص وحده. Vue يتتبّع قراءة وتغيير الخاصية دي.
- أول سطر ينشئ الحالة. التاني يغيّر القيمة الموجودة جواها إلى الرقم `2`.
- `const` يمنع إننا نكتب `selectedServiceId = شيء آخر`، لكنه لا يمنع تغيير `selectedServiceId.value`.
- ده مثال لتوضيح النتيجة؛ في القائمة `v-model` هي اللي بتحدّث القيمة بدل السطر التاني.

### `computed(callback)`: مين بينادي الـ callback؟

```js
const selectedService = computed(() => {
    return services.find((service) => {
        return service.id === selectedServiceId.value;
    });
});
```

- `computed` تستقبل دالة حساب، وبترجع computed ref. نتيجة الدالة هي اللي تبقى في `selectedService.value` داخل JavaScript.
- Vue هي اللي تدير تشغيل دالة الحساب لما النتيجة تُقرأ؛ مش بتتنفّذ مرة كل ثانية، ومش listener للـ select.
- القراءة `selectedServiceId.value` جوه الحساب بتسجّل اعتماد reactive. لما الاختيار يتغير، النتيجة القديمة تبقى محتاجة إعادة حساب عند القراءة التالية.
- `services` هنا array ثابتة عادية؛ لو عدّلتها مباشرة لاحقًا، ده مش اعتماد reactive تلقائي. خلّيها `ref` أو `reactive` لو مطلوب تغيّر محتواها أثناء التشغيل.
- بنستخدم computed لأننا محتاجين **نتيجة بحث مشتقة**، مش حالة ثانية نعدّلها يدويًا مع كل اختيار.

### `find(callback)`: بتدوّر إزاي؟

```js
const result = services.find((service) => {
    return service.id === 2;
});
```

- `find` method جاهزة على arrays في JavaScript. تستقبل دالة اختبار، وتناديها على العناصر بالترتيب لحد أول نتيجة truthy.
- `service` مدخل الدالة هو object العنصر الحالي. الاسم اختياري؛ مش متغير Vue سحري.
- `return service.id === 2` يرجّع Boolean للدالة `find`؛ مش بيرجع object الخدمة مباشرة.
- لو أول عنصر id بتاعه `1` ترجع callback قيمة `false`، فيكمل البحث. لو التاني id بتاعه `2` ترجع `true`، فتوقف `find` وترجع object التاني.
- ناتج المثال `{ id: 2, name: 'Tire Service', price: 300 }`. لو دورت على `99` النتيجة `undefined`.
- `find` لا تنشئ نسخة جديدة من object المطابق، ولا تحذف العناصر غير المطابقة من القائمة.

**ليه فيه `return` مرتين؟** الداخلي يرجّع إجابة «العنصر ده مطابق؟» إلى `find`. الخارجي يرجّع object البحث من دالة حساب computed. لو شلت الخارجي، نتيجة computed تبقى `undefined` حتى لو البحث لقى الخدمة.

### الرحلة كاملة عند اختيار Tire Service

1. `:value="service.id"` في option يحمل الرقم `2`، مش النص `'service.id'`.
2. المستخدم يختارها؛ `v-model` يغيّر `selectedServiceId.value` إلى `2`.
3. `selectedService` محتاجة نتيجة جديدة؛ الحساب يستخدم `find` على قائمة الخدمات.
4. أول مقارنة `1 === 2` غير مطابقة، والتانية `2 === 2` مطابقة.
5. النتيجة object الخدمة؛ `v-if="selectedService"` يضيف جزء التفاصيل.
6. `selectedService.price` في template تقرأ السعر من النتيجة، فتشوف `300 EGP`.

مفيش HTTP request هنا، ومفيش حفظ في Laravel. ده تحديث واجهة في المتصفح.

### لو السعر مش ظهر، أمسك السلسلة من أولها

اعرض مؤقتًا بعد القائمة:

```vue
<p>Selected ID: {{ selectedServiceId }}</p>
<p>Selected object: {{ selectedService }}</p>
```

السطر الأول يبيّن قيمة الاختيار. التاني يبيّن نتيجة البحث للتشخيص؛ مش شكل نهائي للموقع. لو الـ ID بيتغير والـ object مش موجود، افحص `:value` ونوع الأرقام والمقارنة. لو الـ object موجود والتفاصيل لا تظهر، افحص تهجئة `selectedService` و`v-if`.

## سؤال 8: الطفل يبعت اختيار حقيقي، والأب يكمل المثال للآخر؟

**مثال تدريبي كامل من ملفين** على فكرة props/events في AutoCare. أضف الملفين في نفس فولدر مكوّنات مشروع Vue التدريبي؛ اعرض `ServicePicker.vue` من App.vue زي ما عرضنا Navbar. مش بنعدّل مكوّنات المشروع الأصلي هنا.

### الملف الأول: `ServiceButton.vue` — الطفل

```vue
<script setup>
defineProps({ service: { type: Object, required: true } });
const emit = defineEmits(['select']);
</script>

<template>
    <button type="button" @click="emit('select', service)">
        {{ service.name }}
    </button>
</template>
```

- `defineProps(...)` macro من Vue compiler، مش محتاجة import. تستقبل وصف المدخلات؛ هنا prop اسمها `service` مطلوب ونوعه object. ما طلبناش قيمة راجعة منها لأننا بنقرأ الـ prop مباشرة في template.
- `defineEmits(['select'])` macro تحدد أسماء الأحداث اللي المكوّن بيعلن عنها، وبترجع دالة خزّناها باسم `emit`.
- `emit('select', service)` تنادي دالة الإرسال: أول مدخل اسم الحدث، والتاني بياناته. هنا البيانات object الخدمة نفسه. عائد emit مش هو الخدمة المختارة؛ التواصل بيحصل باستدعاء listener الأب.
- `@click` يشغّل التعبير عند ضغط الزر. متوقع يجيله click event، لكن إحنا مش محتاجين نقرأه في المثال ده.
- `{{ service.name }}` تقرأ الاسم من prop وتعرضه على الزر. الطفل مش بيغيّر الـ prop.

### الملف التاني: `ServicePicker.vue` — الأب

```vue
<script setup>
import { ref } from 'vue';
import ServiceButton from './ServiceButton.vue';

const services = [
    { id: 1, name: 'Oil Change', price: 450 },
    { id: 2, name: 'Tire Service', price: 300 },
];
const selectedService = ref(null);

function handleSelect(service) {
    selectedService.value = service;
}
</script>

<template>
    <ServiceButton
        v-for="service in services"
        :key="service.id"
        :service="service"
        @select="handleSelect"
    />
    <p v-if="selectedService">
        {{ selectedService.name }}: {{ selectedService.price }} EGP
    </p>
</template>
```

- الاستيراد الثاني يجيب الطفل من الملف الأول؛ `./` يعني نفس الفولدر.
- `services` مدخلات الأزرار؛ `ref(null)` حالة الأب اللي فيها الاختيار النهائي، و`null` معناها مفيش اختيار.
- `handleSelect(service)` دالة إحنا كاتبينها، مش method جاهزة. مدخلها الـ payload اللي الطفل بعته، وظيفتها تحديث الحالة، ومش محتاجين منها قيمة راجعة.
- `:service="service"` اللي على الشمال اسم prop في الطفل، واللي على اليمين object التكرار الحالي في الأب.
- `@select="handleSelect"` يسلّم الدالة للأحداث. Vue تبعت payload الحدث كأول argument؛ علشان كده مدخل الدالة اسمه `service`.
- `<p>` تقرأ حالة الأب، مش prop الطفل. هي اللي بتثبت إن رحلة البيانات خلصت بعرض الاختيار.

**اتبع ضغطة واحدة:** الأب يرسل خدمة Oil Change للزر ← الزر يرسل `select` ومعاه object ← Vue تنادي `handleSelect(object)` في الأب ← ref تتغيّر ← الاسم والسعر يظهروا. اسم الحدث لازم يتطابق في `defineEmits` و`emit` و`@select`.

**ليه ما غيرناش prop داخل الطفل؟** الأب هو صاحب حالة الاختيار؛ الطفل بيبلغ عن حدث، والأب يقرر يعمل إيه. `Object` في وصف props ما بتفحصش وجود `id/name/price` ولا تعتبر حماية أمنية.

<details><summary>إنترفيو: emit بيبعت لكل الموقع زي window.dispatchEvent؟</summary>

لأ. Vue component events هنا بيتسمع لها من الأب اللي ربط listener على الطفل؛ مش browser DOM event تلقائي ينتشر في كل الصفحة. لو محتاج مشاركة بعيدة نختار تصميم حالة مناسب بدل افتراض إن كل المكوّنات هتسمع الحدث.

</details>

## سؤال 9: `reactive` وhooks وأحداث المتصفح بيرجعوا إيه؟

- `reactive(object)` من Vue: تستقبل object وترجع Proxy reactive لنفس البيانات؛ مثال `reactive({name:''})` يسمح بكتابة `form.name = 'Momen'` فتتحدث الواجهة. مش `.value` زي ref.
- `onMounted(callback)` و`onBeforeUnmount(callback)` يسجّلوا دوال لدورة حياة المكوّن. مش محتاجين قيمة راجعة منهم في الأمثلة. الأولى بعد تركيب المكوّن، والتانية قبل إزالته. استدعاؤهم في setup، مش كل مرة يحصل scroll.
- `window.addEventListener('scroll', updateNavbar, {passive:true})` Browser method: اسم حدث + دالة + خيارات. بترجع `undefined`؛ المتصفح ينادي الدالة عند الحدث ويمرر Event لو الدالة محتاجاه. `updateNavbar` عندنا بتتجاهله وتقرأ `window.scrollY`.
- `window.removeEventListener('scroll', updateNavbar)` تلغي نفس الاستماع باستخدام نفس الدالة ونفس نوع الحدث، ومع مراعاة نفس capture لو مستخدم. مفيش قيمة نتيجة نعتمد عليها. مش معناها توقف التمرير نفسه.
- `window.scrollY` خاصية رقمية، مش method؛ مفيش `scrollY()`. لو قيمتها `50`، التعبير `50 > 24` يرجع `true`.
- `console.log(value)` أداة Console: تستقبل القيمة وتعرضها لأغراض التشخيص؛ عائدها `undefined`، ومش بتعرض بيانات في واجهة المستخدم.

التالي: [نفس الأفكار في React وTypeScript](14-react-typescript-practice.md).
