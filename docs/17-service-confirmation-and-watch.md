# 17 — اختيار الخدمة والتأكيد وwatch: المثال كامل بالـVue والـJavaScript

[بداية المذاكرة](00-start-here.md) · [كل أكواد المشاريع](16-all-project-source.md) · [Vue الأساسي](13-vue-practice.md)

ده **مثال تدريبي إضافي** بيجمع آخر اللي شرحناه في المحادثة. مش بندّعي إن confirmService بالشكل ده موجودة في AutoCare الأصلي. الفكرة نفسها من شغل الخدمات والحجز، لكن هنا مكوّن صغير تقدر تكتبه وتجرّبه من أوله لآخره.

المطلوب: قائمة خدمات → تختار واحدة → السعر يظهر → تضغط تأكيد → نراجع الاختيار → رسالة تظهر → تغيّر الخدمة فالتأكيد القديم يتمسح.

## 1. تكتب المثال فين؟

في **مشروع Vue التدريبي** اعمل `resources/js/components/ServicePractice.vue`. الكود الكامل التالي محتوى المكوّن. لو بتكمّل في ملفك الحالي، عدّل الأجزاء المطابقة بدون تكرار import أو تعريف نفس المتغير مرتين. متستبدلش App.vue الكبيرة بتاعة الموقع الأصلي بالمثال ده.

```vue
<script setup>
import { ref, computed, watch } from 'vue';

const services = [
    { id: 1, name: 'Oil Change', price: '$50' },
    { id: 2, name: 'Tire Rotation', price: '$30' },
    { id: 3, name: 'Rotation', price: '$60' },
];

const selectedServiceId = ref('');
const errorMessage = ref('');
const confirmationMessage = ref('');

const selectedService = computed(() => {
    return services.find((service) => {
        return service.id === selectedServiceId.value;
    });
});

function confirmService() {
    errorMessage.value = '';
    confirmationMessage.value = '';

    if (!selectedService.value) {
        errorMessage.value = 'اختار خدمة الأول';
        return;
    }

    confirmationMessage.value =
        `اختيارك: ${selectedService.value.name} — السعر: ${selectedService.value.price}`;
}

watch(selectedServiceId, () => {
    errorMessage.value = '';
    confirmationMessage.value = '';
});
</script>

<template>
    <form @submit.prevent="confirmService">
        <label for="service">اختار الخدمة</label>

        <select id="service" v-model="selectedServiceId">
            <option disabled value="">اختار خدمة</option>
            <option
                v-for="service in services"
                :key="service.id"
                :value="service.id"
            >
                {{ service.name }}
            </option>
        </select>

        <div v-if="selectedService">
            <p>السعر: {{ selectedService.price }}</p>
        </div>

        <button type="submit">تأكيد الاختيار</button>

        <p v-if="errorMessage">{{ errorMessage }}</p>
        <p v-if="confirmationMessage">{{ confirmationMessage }}</p>
    </form>
</template>
```

الكود فيه JavaScript فوق وtemplate تحت؛ دول جزآن لنفس المثال. مفيش دالة ناقصة في ملف تاني لعملية الاختيار نفسها.

## 2. نوصّله بالصفحة اللي بتظهر

في `resources/js/App.vue` لمشروع التدريب، لو ده مكوّن الصفحة عندك، استورد المكوّن واعرضه. المثال ده كامل لصفحة تدريب فاضية؛ لو عندك Navbar وأقسام، احتفظ بيهم وأضف الاستيراد والاستدعاء فقط:

```vue
<script setup>
import ServicePractice from './components/ServicePractice.vue';
</script>

<template>
    <ServicePractice />
</template>
```

- import تجيب المكوّن من الملف الأول. `./` يعني من نفس مكان App.vue، وبعدها فولدر components.
- `<ServicePractice />` يعرضه؛ مش مجرد حفظ الملف هيخليه يظهر لوحده.
- Laravel في مشروع التدريب ترجع Blade shell، وapp.js تعمل mount لـApp كما اتعلمنا. السلسلة: Blade → app.js → App.vue → ServicePractice.vue → template الموجودة فوق. لو App.vue عندك داخل components، عدّل المسار حسب مكان الملفين، مش الاسم وحده.

## 3. نبدأ بالـimport

```js
import { ref, computed, watch } from 'vue';
```

- import: هات الأدوات المكتوبة بين `{}` من المكتبة المحددة.
- ref: تعمل حالة reactive؛ يعني Vue تتبع تغيّر value وتحدّث العرض.
- computed: تشتق نتيجة من الحالة؛ هنا تجيب object الخدمة المطابقة.
- watch: تتابع تغيّر مصدر وتعمل تصرّف؛ هنا تمسح الرسائل القديمة.
- from 'vue': المصدر مكتبة Vue؛ حروف الاسم صغيرة. دي مش functions إحنا كتبنا تعريفها بإيدنا.

## 4. قائمة البيانات ومين بيقرأها

```js
const services = [
    { id: 1, name: 'Oil Change', price: '$50' },
    { id: 2, name: 'Tire Rotation', price: '$30' },
    { id: 3, name: 'Rotation', price: '$60' },
];
```

- const تعريف متغير؛ services اسمه؛ = إسناد.
- [] Array / قائمة؛ كل {} Object / بيانات خدمة واحدة.
- id معرّف ثابت للخدمة؛ name اسم العرض؛ price سعر العرض.
- النقطتان : تفصل الخاصية عن قيمتها؛ الفواصل تفصل الخصائص والعناصر.
- 1 و2 و3 أرقام؛ الأسماء والأسعار هنا نصوص.
- السعر '$50' مناسب لعرض المثال كما كتبتَه، لكن لو هتحسب ضريبة/إجمالي استخدم قيمة رقمية منفصلة والعملة عند العرض؛ متضربش نصًا فيه علامة دولار.
- القائمة دي يقرأها جزآن: v-for علشان تعرض الخيارات، وfind علشان تلاقي بيانات الاختيار.

## 5. المتغيرات اللي الواجهة هتتفاعل معاها

```js
const selectedServiceId = ref('');
const errorMessage = ref('');
const confirmationMessage = ref('');
```

كل سطر ينادي ref بقيمة بداية نص فاضي. ref ترجع object تفاعلية، ونقرأ/نعدّل قيمتها بـ.value داخل JavaScript.

- selectedServiceId: قيمة القائمة. تبدأ ''، وبعد اختيار Tire Rotation تبقى الرقم2 بسبب :value.
- errorMessage: نص خطأ لو المستخدم أكد بدون خدمة.
- confirmationMessage: نص التأكيد بعد اختيار صالح.

const تمنع إعادة إسناد selectedServiceId نفسها، لكن تغيير selectedServiceId.value مسموح. النص الفاضي مش error object، هو فقط حالة عدم وجود رسالة.

## 6. computed مع find: وظيفتين مختلفتين مرتبطتين

```js
const selectedService = computed(() => {
    return services.find((service) => {
        return service.id === selectedServiceId.value;
    });
});
```

**computed بتاخد إيه؟** دالة حساب اسمها getter؛ هنا arrow function `() => { ... }`.

**computed بترجع إيه؟** computed ref، ونتيجتها نقرأها من selectedService.value في JavaScript. Vue تدير إعادة الحساب حسب الاعتماد reactive المقروء، مش كل ثانية ولا بسبب اسم المتغير.

**find بتاخد إيه؟** callback تختبر كل خدمة. service اسم parameter للخدمة الحالية؛ الاسم إحنا اخترناه.

**find بترجع إيه؟** أول object ينجح شرطه أو undefined لو مفيش تطابق. ما بترجعش true بدل الخدمة، وما بتعملش نسخة من object المطابق.

السطور:

1. عرّف selectedService كناتج computed؛ مش ref هنختارها يدويًا هنا.
2. رجّع نتيجة البحث من getter؛ ده return الخارجي.
3. رجّع نتيجة المقارنة لـfind؛ ده return الداخلي. === تقارن النوع والقيمة؛ selectedServiceId.value هي قيمة الاختيار الحالية.
4. اقفل callback البحث ونداء find.
5. اقفل getter ونداء computed.

لو الاختيار2: مقارنة1===2 تفشل، ومقارنة2===2 تنجح. find ترجع `{ id: 2, name: 'Tire Rotation', price: '$30' }`، فـselectedService.value يبقى الـobject ده.

## 7. confirmService: من أولها لآخرها

```js
function confirmService() {
    errorMessage.value = '';
    confirmationMessage.value = '';

    if (!selectedService.value) {
        errorMessage.value = 'اختار خدمة الأول';
        return;
    }

    confirmationMessage.value =
        `اختيارك: ${selectedService.value.name} — السعر: ${selectedService.value.price}`;
}
```

**دي دالة إحنا كتبناها — Custom function.** مدخلاتها المباشرة مفيش، لذلك () فاضية. بتقرأ الحالة الموجودة في نفس المكوّن، وبتغير الرسائل. مفيش return بيانات في مسار النجاح؛ الناتج المعتاد undefined.

1. function تعريف دالة، confirmService اسمها. التعريف وحده مش تشغيل.
2. امسح خطأ المحاولة السابقة.
3. امسح تأكيد المحاولة السابقة.
4. السطر الفاضي فصل للقراءة فقط.
5. if شرط. ! تعني نفي؛ لو selectedService.value هي undefined، يبقى مفيش خدمة، وندخل فرع الخطأ.
6. خزّن رسالة الخطأ في state؛ Vue تعرضها من template.
7. return لوحدها تنهي الدالة فورًا؛ متكملش للتأكيد. مش بترجع رسالة الخطأ كناتج.
8. نهاية شرط الفشل.
9. سطر فاصل.
10–11. لو فيه خدمة، كوّن رسالة باستخدام الاسم والسعر. backticks تسمح بـ`${...}`؛ التعبير يتقيّم ويتحط نصه في الرسالة.
12. نهاية الدالة.

**مهم:** الرسالة بتظهر لأننا غيرنا state، مش لأن confirmService رجّعتها للـHTML. مفيش API أو DB هنا.

## 8. template: مين بينادي الدالة ومين يعرض نتيجتها؟

```vue
<form @submit.prevent="confirmService">
```

- form تجمع المدخلات لعملية إرسال.
- @submit اختصار listener لحدث الإرسال.
- confirmService مرجع الدالة اللي Vue تناديها عند الحدث؛ مش بيتنفّذ كل render.
- .prevent modifier تطلب event.preventDefault()؛ method متصفح تمنع الإرسال الافتراضي القابل للإلغاء، وترجع undefined. لا تبعت API بدلًا منك ولا تمنع كل تفاعل آخر.

```vue
<label for="service">اختار الخدمة</label>
<select id="service" v-model="selectedServiceId">
```

for تربط label بالعنصر اللي عنده نفس id. v-model تربط قيمة select بالحالة في الاتجاهين؛ المستخدم يختار فتتغيّر الحالة، وتغيير الحالة ينعكس في القائمة.

```vue
<option disabled value="">اختار خدمة</option>
```

اختيار إرشادي يبدأ ظاهرًا لأن value فاضية زي البداية. disabled يمنع اختياره من جديد من القائمة؛ التحقق اللي بنشرحه في confirmService، مش required افتراضية حاطة رسالتنا.

```vue
<option
    v-for="service in services"
    :key="service.id"
    :value="service.id"
>
    {{ service.name }}
</option>
```

- v-for تكرر option لكل خدمة؛ service متاحة في نطاق العنصر ده.
- :key هوية التكرار لـVue؛ مش قيمة select ولا نص يظهر.
- :value تربط id كرقم JavaScript. بدون : هتبعت النص الحرفي 'service.id' لكل الاختيارات.
- {{ service.name }} تعرض اسم كل خدمة للمستخدم. الأقواس المعقوفة للعرض النصي؛ لا تنشئ قاعدة بيانات.

```vue
<div v-if="selectedService">
    <p>السعر: {{ selectedService.price }}</p>
</div>
```

v-if تنشئ العنصر لما الخدمة موجودة؛ مفيش اختيار يعني undefined فيختفي. price خاصية الخدمة الناتجة من computed، مش خاصية الـarray كلها. داخل template Vue تفك ref هنا تلقائيًا، لذلك مش محتاجين .value.

```vue
<button type="submit">تأكيد الاختيار</button>
<p v-if="errorMessage">{{ errorMessage }}</p>
<p v-if="confirmationMessage">{{ confirmationMessage }}</p>
```

- الزر type submit يطلق إرسال الفورم، فتشتغل @submit فوق. مش محتاج @click ثانية لنفس التأكيد.
- السطر الثاني يعرض الخطأ لو النص مش فاضي؛ النص الفاضي falsy، فالعنصر مش يتنشأ.
- الثالث يعرض التأكيد بنفس القاعدة. تغيير الحالة هو اللي يطلب تحديث الواجهة.

## 9. watch: ليه رسالة التأكيد القديمة لازم تتمسح؟

```js
watch(selectedServiceId, () => {
    errorMessage.value = '';
    confirmationMessage.value = '';
});
```

تختار خدمة وتأكدها ثم تغيرها: السعر بيتحدّث من computed، لكن الرسالة القديمة نص مخزّن في ref، فمش هتتبدّل من نفسها. watch هنا مسؤولة عن إلغاء الرسالة القديمة.

**جاية منين؟** أداة من Vue، مش دالة كتبناها.

**بتاخد إيه؟** أول مدخل مصدر نراقبه؛ مرّرنا ref نفسها selectedServiceId، مش selectedServiceId.value النص/الرقم الحالي فقط. ثاني مدخل callback Vue تناديها لما المصدر يتغيّر. callback ممكن تستقبل newValue وoldValue، لكن المثال مش محتاجهم.

**بترجع إيه؟** مقبض مراقبة يمكن استدعاؤه كدالة stop؛ إحنا مش محتاجين نخزّنه. التسجيل المتزامن في script setup يتنضف مع إزالة المكوّن.

السطور:

1. سجّل مراقبة المصدر ثم افتح callback. التسجيل لا ينفّذ callback فورًا بالافتراضات الحالية؛ مفيش immediate:true.
2. امسح الخطأ القديم لما المستخدم يصلّح الاختيار.
3. امسح التأكيد لأن الاختيار الجديد لسه ما اتأكدش.
4. اقفل callback ونداء watch.

computed **تحسب قيمة**؛ watch **تعمل تصرّف** بسبب تغيير. watch لا تحسب السعر هنا ولا تنشئ طلب حجز. اختيار نفس القيمة بدون تغيّر لا يعتبر تغيّرًا جديدًا للمصدر.

## 10. جرّب الحالات كلها

1. أول فتح: القائمة إرشادية، مفيش سعر ولا رسائل.
2. اضغط تأكيد بدون اختيار: تظهر «اختار خدمة الأول».
3. اختار Tire Rotation: يظهر $30، ورسالة الخطأ تختفي.
4. اضغط تأكيد: تظهر «اختيارك: Tire Rotation — السعر: $30».
5. غيّر إلى Oil Change: السعر يصبح $50 ورسالة التأكيد القديمة تختفي.
6. اضغط تأكيد مرة أخرى: تظهر رسالة Oil Change.

**غلطة شائعة:** اسم selectService بدل selectedService؛ value بدل :value؛ service.price خارج v-for؛ أو وضع watch داخل confirmService فتسجّل مراقبة جديدة مع كل ضغط. خلّي watch في setup مرة واحدة.

<details><summary>سؤال إنترفيو: هل نجاح التأكيد هنا يعني حجز محفوظ؟</summary>

لأ؛ ده UI state فقط. الحجز الحقيقي يحتاج إرسال HTTP إلى backend مع validation وauthorization وحفظ DB، ورد نجاح/فشل. إخفاء زر أو إظهار رسالة لا يثبت الحفظ.

</details>

**English recap:** Selection = اختيار، Validation = تحقق من المدخلات، Confirmation = تأكيد، Computed value = قيمة مشتقة، Watcher = مراقب، Callback = دالة تُمرّر لكود آخر ليناديها، Side effect = أثر جانبي مثل تغيير رسالة أو حفظ.
