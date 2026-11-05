# أسئلة تطوير إضافية: أطبّق اللي اتعلّمته إزاي؟

[الفهرس](00-start-here.md) · ده بنك تمارين، مش قائمة عيوب مؤكدة في النسخة الحالية.

التقرير القديم كان مؤرخًا 9 أكتوبر ووصف كودًا اتغيّر بعده. مثلًا MenuPage الآن تستخدم CatalogContext، وفيه Admin وtracking حاليًا؛ متتعاملش مع الاقتراحات القديمة كأنها كلها ناقصة. النسخة الأصلية محفوظة في [الأرشيف](../docs-backup-before-study-20261023/ideas.md).

كل كود هنا **تدريب إضافي**؛ مش مطبّق تلقائيًا ومش مقتطف حرفي. اختار تمرين واحد بعد أساسه. السؤال مش محتاج تحويل المشروع كله مرة واحدة.

## سؤال 1: أضيف بحث عن الخدمة بالاسم؟

في مكوّن Vue تدريبي يحتوي services، استورد ref وcomputed ثم أضف:

```js
const search = ref('');
const filteredServices = computed(() => {
    const query = search.value.trim().toLowerCase();
    return services.filter((service) => service.name.toLowerCase().includes(query));
});
```

1. نص البحث reactive وفاضي في البداية.
2. النتيجة مشتقة من نص البحث وقائمة الخدمات.
3. trim تشيل الفراغات الطرفية؛ toLowerCase توحّد حالة الحروف، بدون تعديل services الأصلية.
4. filter ترجع قائمة المطابقات؛ includes تبحث عن النص داخل الاسم؛ كل اسم بنحوّله lowercase علشان الطرفين متوافقين.
5. نهاية الحساب.

### Methods البحث واحدة واحدة

- **`ref('')`:** من Vue، تستقبل القيمة الأولى وترجع ref object له `.value`. هي الذاكرة اللي بتتغيّر لما تكتب.
- **`computed(callback)`:** من Vue، تستقبل دالة حساب وترجع computed ref؛ تعيد الحساب عند الحاجة لما الاعتمادات reactive تتغير. وظيفتها إنتاج نتيجة مشتقة، مش تنفيذ طلب شبكة أو حفظ بيانات.
- **`trim()`:** method جاهزة على string، لا تحتاج arguments هنا؛ ترجع نصًا جديدًا بدون فراغات البداية والنهاية. `' oil '.trim()` تصبح `'oil'`، والفراغ الداخلي في `'oil change'` يفضل.
- **`toLowerCase()`:** String method ترجع نصًا جديدًا بحروف صغيرة، من غير تعديل النص الأصلي. `'Oil'.toLowerCase()` تصبح `'oil'`.
- **`includes(query)`:** String method تأخذ نص البحث وترجع true لو موجود داخل الاسم، وإلا false. البحث هنا حساس للحروف، لذلك وحّدنا الطرفين أولًا. `'oil change'.includes('oil')` ترجع true. النص الفاضي موجود في أي نص؛ لذلك البحث الفاضي يعرض كل الخدمات.
- **`filter(callback)`:** Array method تأخذ شرطًا وترجع array جديدة بالمطابقات، أو `[]`. لا تمسح عناصر `services` الأصلية. طول الناتج قد يكون صفرًا أو واحدًا أو أكثر.

### نكمّل المثال في نفس المكوّن

**مكوّن تدريبي كامل صغير**، لا يحتاج helper مخفيًا:

```vue
<script setup>
import { ref, computed } from 'vue';
const services = [
    { id: 1, name: 'Oil Change' },
    { id: 2, name: 'Tire Service' },
];
const search = ref('');
const filteredServices = computed(() => {
    const query = search.value.trim().toLowerCase();
    return services.filter((service) => service.name.toLowerCase().includes(query));
});
</script>

<template>
    <input v-model="search" aria-label="Search services">
    <p v-if="filteredServices.length === 0">مفيش خدمات مطابقة</p>
    <p v-for="service in filteredServices" :key="service.id">{{ service.name }}</p>
</template>
```

السلسلة: كتابة `OIL` → v-model تحدّث search → computed تعمل `oil` → filter ترجع الخدمة الأولى → v-for تعرضها. ده كله محلي، ومفيش HTTP request مع كل حرف.

**بإيدك:** أضف `<input v-model="search" aria-label="Search services">`، وخلّي v-for تلف على filteredServices بدل services. كلمة oil تعرض Oil Change. نص مفيش له نتيجة يعرض قائمة فاضية؛ اعمل رسالة مناسبة.

**غلطة شائعة:** فلترة القائمة الأصلية وإعادة استبدالها في كل حرف؛ تفقد باقي البيانات بدل اشتقاق نتيجة منها.

**سؤال إنترفيو:** البحث ده يكفي لكتالوج ضخم؟

<details><summary>الإجابة</summary>لأ بالضرورة؛ مع بيانات كبيرة نحتاج server filtering وpagination وربما debounce ونتعامل مع ترتيب وصول النتائج.</details>

## سؤال 2: أضيف loading وأمنع الضغط المتكرر على زر؟

في مكوّن Vue تدريبي استورد ref؛ الدالة هنا محاكاة انتظار فقط، لا تنشئ طلبًا حقيقيًا:

```js
const saving = ref(false);
async function savePractice() {
    if (saving.value) return;
    saving.value = true;
    try {
        await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
        saving.value = false;
    }
}
```

1. حالة التحميل.
2. async دالة غير متزامنة.
3. guard يمنع تنفيذ ثانٍ أثناء الانتظار.
4. ابدأ حالة الانتظار.
5–6. محاكاة Promise تنتهي بعد 500ms؛ مش طلب شبكة.
7–9. finally ترجع الحالة حتى لو حصل خطأ؛ مفيش catch هنا لأن مثالنا مش بيضيف فشل متعمّد.
10. نهاية الدالة.

### يعني إيه `Promise` و`setTimeout` هنا؟

- **`new Promise(executor)`:** جزء جاهز من JavaScript، ينشئ object يمثل نتيجة هتكتمل لاحقًا. يستقبل دالة يناديها فورًا، ويديها أداتي `resolve` و`reject`. المثال استخدم الأولى بس.
- **`resolve(value)`:** دالة يوفّرها Promise، تنهيه بنجاح بالقيمة الممرّرة. هنا تُستدعى من غير قيمة، فالنتيجة undefined. مش دالة حفظ كتبناها.
- **`setTimeout(callback, 500)`:** Web API للجدولة **مرة واحدة** بعد مدة لا تقل عادة عن 500ms؛ مش بتكرر زي setInterval، ومش بتجمّد الصفحة. ترجع timer id، لكن المثال لا يستخدمه.
- **`setTimeout(resolve, 500)`:** بنسلّم resolve نفسها كـ callback؛ بعد الانتظار المتصفح يناديها. لو كتبنا `resolve()` هنا نكون أنهينا Promise فورًا.
- **`savePractice()`:** دالة تدريب كتبناها؛ لا arguments، وترجع Promise بسبب async. لا يوجد فيها DB ولا fetch؛ كل أثرها تغيير saving ومحاكاة انتظار.
- **`finally`:** جزء من try statement، مش method هنا. ينفّذ في النجاح والفشل؛ خطأ غير ممسوك يفضل خارجًا بعده. ده لا يعني إنه catch تلقائي.

تكملة الزر في template:

```vue
<button type="button" @click="savePractice" :disabled="saving">
    {{ saving ? 'جاري الحفظ...' : 'حفظ تجريبي' }}
</button>
```

الضغط → saving تصبح true → الزر يتعطّل → المؤقت مرة واحدة يكمل Promise → finally ترجع saving false. كلمة «حفظ» هنا تسمية واجهة تدريبية فقط؛ مفيش حفظ حقيقي.

**بإيدك:** اربط زر بـ `@click="savePractice"` و`:disabled="saving"` واعرض saving كنص. المتوقع الزر يقف نصف ثانية ثم يرجع.

**غلطة شائعة:** اعتبار تعطيل الزر حماية من تكرار الطلب في السيرفر؛ المستخدم يقدر يعيد الطلب من خارج الواجهة.

**سؤال إنترفيو:** الحل على السيرفر لتكرار طلب دفع؟

<details><summary>الإجابة</summary>تصميم idempotency وربط محاولة واحدة بهوية ثابتة وقيود مناسبة؛ الدرس الفعلي في [الدفع](08-checkout-and-payment.md).</details>

## سؤال 3: أضيف pagination بعد ما أخلص الأساسيات؟

**بإيدك أولًا:** في Pizza Admin orders، حدّد هل endpoint بترجع كل الطلبات ولا صفحات. ارجع إلى [AdminController](../app/Http/Controllers/Api/AdminController.php)، مش لقطة شاشة.

بعدها صمّم في فرع/مشروع تدريب:

1. backend يرجع data ومعاها current_page وlast_page حسب عقد واضح.
2. frontend تخزّن الصفحة وتعرض Next/Previous.
3. تغيير filter يرجّع الصفحة للأولى.
4. حالات loading/error/empty مستقلة.

**المتوقع:** ماتعرضش زر Next شغال بعد آخر صفحة. حدّد اختبار لصفحة فاضية ومستخدم غير مصرّح.

**غلطة شائعة:** تطبيق slice في المتصفح بعد تحميل آلاف الطلبات واعتباره server pagination.

**سؤال إنترفيو:** أيهما قبل أي، pagination ولا authorization؟

<details><summary>الإجابة</summary>الـ query لازم تكون مقيّدة بالمستخدم/الفرع المصرّح أولًا؛ تقسيم نتائج غير مصرح بها لا يحميها.</details>

## سؤال 4: أتعامل مع طلبين شبكة راجعين بترتيب مختلف؟

تمرين متقدم بعد async/await: المستخدم كتب "o" ثم "oil"؛ استجابة o ممكن ترجع بعد oil فتستبدل النتائج الصح.

**بإيدك:** في مكوّن تدريب، أخّر أول استجابة أكثر من الثانية ثم اثبت المشكلة. حلّها بـ request id ومقارنة أحدث طلب، أو AbortController مع معالجة AbortError. متضيفش الحل المعقّد قبل ما تعيد إنتاج المشكلة.

**المتوقع:** الشاشة دائمًا تعرض آخر بحث، مش آخر استجابة وصلت بالصدفة.

### مثال كامل من ملفين — محاكاة محلية، مش كود الإنتاج

**الملف الأول `practiceSearch.js`:** helper إحنا بنكتبه للتجربة. لا يطلب API؛ يؤخر البيانات محليًا علشان نثبت السباق.

```js
const services = [
    { id: 1, name: 'Oil Change' },
    { id: 2, name: 'Tire Service' },
];

export async function searchServices(query) {
    const delay = query.length === 1 ? 1000 : 100;
    await new Promise((resolve) => setTimeout(resolve, delay));
    return services.filter((service) =>
        service.name.toLowerCase().includes(query.toLowerCase())
    );
}
```

`searchServices(query)` custom function تأخذ string وترجع Promise بـ array الخدمات المطابقة. أول حرف ينتظر ثانية، والأكثر ينتظر عُشر ثانية. هذا التأخير مقصود للتعليم، ولا يُضاف للكود الحقيقي.

**الملف الثاني، داخل script setup لمكوّن تدريب:**

```js
import { ref } from 'vue';
import { searchServices } from './practiceSearch.js';

const search = ref('');
const results = ref([]);
let latestRequestId = 0;

async function runSearch() {
    const requestId = ++latestRequestId;
    const data = await searchServices(search.value);
    if (requestId !== latestRequestId) return;
    results.value = data;
}
```

والتكملة في template:

```vue
<input v-model="search" @input="runSearch" aria-label="Search">
<p v-for="service in results" :key="service.id">{{ service.name }}</p>
```

- `runSearch` دالتنا، بلا arguments مباشرة؛ تقرأ search الحالية، وتستدعي helper وترجع Promise بلا بيانات صريحة.
- `++latestRequestId` يزيد الرقم أولًا ثم يسلّمه للطلب الحالي. استخدمنا let لأن الرقم هيتغيّر، ومش محتاجينه يظهر في الواجهة.
- كل استدعاء عنده `requestId` محلية ثابتة. لو رقمها مش الأحدث بعد الانتظار، `return` يخرج قبل تحديث الشاشة.
- ده لا يلغي العمل القديم؛ بس يمنع نتيجته القديمة من الكتابة فوق الأحدث.

اكتب `o` ثم `oi` بسرعة. الثانية ترجع أولًا، والقديمة تتجاهل. احذف سطر المقارنة مؤقتًا في التدريب وشوف كيف ترجع نتيجة الحرف الأول متأخرًا. رجّع الحماية بعد الاختبار.

**`AbortController` لو طلب حقيقي:** constructor جاهز من المتصفح ينشئ controller له `signal`. تمرّر signal إلى fetch، وتنادي `controller.abort()` لإلغاء الاستمرار المرتبط به؛ abort ترجع undefined وقد يرفض fetch بخطأ AbortError. ده خيار مختلف عن request id، ومش جزء من المحاكاة الحالية.

**غلطة شائعة:** افتراض await يفرض ترتيب النتائج بين استدعاءين مستقلين؛ كل دالة async لها تنفيذها.

**سؤال إنترفيو:** إلغاء fetch كفاية لكل حالات السباق؟

<details><summary>الإجابة</summary>مش تلقائيًا؛ لازم نربط تحديث الواجهة بالطلب الحالي ونفهم أي مراحل اتلغت وأيها اكتملت.</details>

## سؤال 5: أحوّل AutoCare من demo لbackend حقيقي؟

ده تمرين full-stack كبير، مش ميزة موجودة الآن:

1. صمّم vehicles وappointments وربطهم بالمستخدم وservice.
2. اكتب migrations وModels بعلاقات واضحة.
3. ضيف auth ثم API validation وownership checks على السيرفر.
4. استبدل garageRepository بمساعد API، مع الحفاظ على واجهة useGarage قدر الإمكان.
5. اختبر إن مستخدمًا لا يقرأ أو يعدّل عربية شخص آخر.

المصدر الحالي: [repository المحلي](../../autocare-booking/resources/js/services/garageRepository.js). الأساس المقابل الحقيقي: [نماذج Pizza](../app/Models/Order.php) و[صلاحياتها](../app/Http/Middleware/RequireRole.php).

**غلطة شائعة:** نقل localStorage إلى DB من غير إضافة عزل وصلاحيات وvalidation.

### نفهم الحد الفاصل الموجود فعلًا قبل استبداله

من [garageRepository.js](../../autocare-booking/resources/js/services/garageRepository.js)، **method فعلية كاملة مع مفتاحها وحاوية object؛ حذفنا read فقط من هذا العرض**. ده شرح، مش دعوة تنفّذ الكتابة على بياناتك:

```js
const STORAGE_KEY = 'autocare.demo.garage.v1';
export const garageRepository = {
    write(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch {
            return false;
        }
    },
};
```

- `write` اسم method إحنا كتبناها، تستقبل object البيانات وترجع Boolean نجاح/فشل، مش Promise.
- `JSON.stringify(data)` جاهزة من JavaScript تحول البيانات إلى JSON string وترجع النص؛ لا تحفظه بنفسها.
- `localStorage.setItem(key, text)` Web Storage method تحفظ نصًا تحت مفتاح في نفس origin؛ ترجع undefined وقد ترمي خطأ لو التخزين غير متاح/ممتلئ.
- true/false ناتج خاص بـ write عندنا، مش ناتج setItem.

وتكملتها الفعلية في [useGarage.js](../../autocare-booking/resources/js/composables/useGarage.js):

```js
const state = reactive(garageRepository.read() || seed());
const storage = reactive({ available: true });
watch(state, () => {
    storage.available = garageRepository.write(state);
}, { deep: true });
```

`read` method مشروعنا ترجع object صالحة من المخزن أو null؛ `seed` دالتنا ترجع بيانات العرض الابتدائية. `reactive` من Vue تعمل proxy reactive للـ object. `watch` من Vue تتابع تغيّره؛ callback تكتب البيانات وتضع نجاح الكتابة في storage.available. `deep: true` تتابع التغييرات الداخلية أيضًا.

وقت الانتقال لـ backend، لو `write` رجعت Promise بدل Boolean، السطر الحالي مش هيعني نفس الشيء: storage.available ستحمل Promise لو لم نعدّل التدفق. لازم await وحالات loading/error وسياسة حفظ مقصودة؛ فصل repository مفيد، لكنه مش سحر يخفي اختلاف async.

**سؤال إنترفيو:** ليه فصل repository مفيد هنا؟

<details><summary>الإجابة</summary>بيفصل مصدر البيانات عن الواجهة؛ لكن التحويل لـ API يدخل async وحالات فشل، فمش تغيير اسم method فقط.</details>

## سؤال 6: أراجع جاهزية المشروع للشغل؟

جاوب عمليًا بمثال واحد لكل نقطة، مش حفظ تعريفات:

- عرض قائمة واختيار عنصر وحساب قيمة مشتقة.
- إضافة وتعديل وحذف مع تحقق من المدخلات.
- API بحالات نجاح وفشل وصلاحيات.
- DB relationships وquery بدون N+1 غير مقصود.
- اختبار يثبت السلوك، وGit diff واضح للتغيير.
- مفاتيح سرية خارج frontend، وشرح صادق لما هو demo وما هو حقيقي.

لو نقطة مش قادر تشرحها، ارجع لدرسها واعمل تمرين صغير قبل مشروع جديد كامل.
