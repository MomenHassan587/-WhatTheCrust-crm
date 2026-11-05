# حالة الجراج المشتركة والعمليات الأساسية

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `autocare-booking` · الملف: `resources/js/composables/useGarage.js` · 51 سطر.

**وظيفة الملف:** حالة واحدة خارج useGarage بتتشارك بين مستدعي الـ composable في نفس تشغيل الصفحة. أول التشغيل يقرأ التخزين أو يعمل seed، وdeep watch يحفظ التغييرات.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../../autocare-booking/resources/js/composables/useGarage.js). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [autocare-booking/resources/js/services/garageRepository.js](../services/garageRepository.js.md)

- [autocare-booking/resources/js/components/GarageDashboard.vue](../components/GarageDashboard.vue.md)

- [autocare-booking/resources/js/components/App.vue](../components/App.vue.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```js
import { reactive, watch } from 'vue';
import { garageRepository } from '../services/garageRepository';

const dateAfter = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
};
const seed = () => ({
    version: 1,
    vehicles: [
        { id: 'car-corolla', make: 'Toyota', model: 'Corolla', year: 2021, plate: 'DEMO 101', mileage: 42500 },
        { id: 'car-bmw', make: 'BMW', model: '320i', year: 2019, plate: 'DEMO 202', mileage: 68100 },
    ],
    appointments: [
        { id: 'ACP-DEMO-001', vehicleId: 'car-corolla', car: '2021 Toyota Corolla', service: 'Oil Change', date: dateAfter(3), time: '10:30', status: 'confirmed' },
    ],
    history: [
        { id: 'JOB-DEMO-102', vehicleId: 'car-corolla', car: '2021 Toyota Corolla', service: 'Oil Change', date: dateAfter(-65), total: 450, notes: 'Engine oil and filter replaced. Fluid levels checked. Example service record.' },
        { id: 'JOB-DEMO-101', vehicleId: 'car-bmw', car: '2019 BMW 320i', service: 'Battery Test', date: dateAfter(-30), total: 250, notes: 'Charging system and battery tested. No replacement recommended. Example service record.' },
    ],
    repair: { id: 'JOB-DEMO-103', vehicleId: 'car-bmw', car: '2019 BMW 320i', service: 'Brake inspection & service', stage: 2, note: 'Inspection complete. Brake service is underway. This is a sample job, not a live workshop feed.' },
});

const state = reactive(garageRepository.read() || seed());
const storage = reactive({ available: true });
watch(state, () => { storage.available = garageRepository.write(state); }, { deep: true });

export function useGarage() {
    const addVehicle = (vehicle) => {
        const entry = { ...vehicle, id: crypto.randomUUID(), year: Number(vehicle.year), mileage: Number(vehicle.mileage || 0) };
        state.vehicles.push(entry);
        return entry;
    };
    const addAppointment = (form) => {
        const vehicle = state.vehicles.find(v => `${v.year} ${v.make} ${v.model}` === form.car);
        const entry = {
            id: `ACP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
            vehicleId: vehicle?.id || null,
            car: form.car, service: form.service, date: form.date, time: form.time, status: 'requested',
        };
        // Contact details and problem notes are not persisted in this demo.
        state.appointments.push(entry);
        storage.available = garageRepository.write(state);
        return entry;
    };
    return { state, storage, addVehicle, addAppointment };
}

export const formatDate = value => new Date(value + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### dateAfter

يعمل تاريخ demo قبل/بعد النهارده، ويكوّن YYYY-MM-DD يدويًا.

- **بتاخد إيه؟ Inputs:** days رقم موجب أو سالب

- **بترجع/بتغيّر إيه؟ Return / effect:** نص تاريخ بلا وقت

### seed

يرجّع بيانات تجريبية جديدة: عربيتين، حجز، تاريخ صيانة، وعملية إصلاح وهمية.

- **بتاخد إيه؟ Inputs:** لا شيء

- **بترجع/بتغيّر إيه؟ Return / effect:** object بversion=1؛ مش request حقيقي

### state

Reactive object يبدأ من repository أو seed. وجوده خارج الدالة مقصود للمشاركة.

- **بتاخد إيه؟ Inputs:** garageRepository.read() || seed()

- **بترجع/بتغيّر إيه؟ Return / effect:** Vue proxy للحالة

### storage

حالة متاحة للواجهة علشان تنبه المستخدم لو الكتابة فشلت.

- **بتاخد إيه؟ Inputs:** { available: true }

- **بترجع/بتغيّر إيه؟ Return / effect:** reactive object

### watch(state)

أي تغيير عميق في القوائم/الحقول يتبعه حفظ للديمو وتحديث available.

- **بتاخد إيه؟ Inputs:** reactive state وcallback و{deep:true}

- **بترجع/بتغيّر إيه؟ Return / effect:** stop function؛ الكود مش بيخزنها، والمراقبة هنا module-scope مش component lifecycle

### useGarage

يرجع الحالة وعمليات الإضافة؛ مش بيبدأ نسخة state منفصلة لكل component.

- **بتاخد إيه؟ Inputs:** لا شيء

- **بترجع/بتغيّر إيه؟ Return / effect:** { state, storage, addVehicle, addAppointment }

### addVehicle

ينسخ form ويضيف UUID ويحوّل السنة والعداد لأرقام، ثم push في قائمة العربيات.

- **بتاخد إيه؟ Inputs:** vehicle: object من نموذج Dashboard

- **بترجع/بتغيّر إيه؟ Return / effect:** entry: العربية الجديدة؛ الحفظ يتم من deep watcher

### addAppointment

يطابق العربية بالنص، يولّد رقم طلب، وينسخ حقول الحجز الآمنة فقط ثم يحفظ فورًا.

- **بتاخد إيه؟ Inputs:** form: car,service,date,time مع حقول أخرى لا تُحفظ

- **بترجع/بتغيّر إيه؟ Return / effect:** entry: طلب demo status=requested؛ لا يتم حفظ الاسم والتليفون والملاحظات

### formatDate

يعرض YYYY-MM-DD كصيغة يوم وشهر وسنة إنجليزية؛ إضافة منتصف اليوم تتجنب بعض انزياحات التاريخ عند العرض.

- **بتاخد إيه؟ Inputs:** value نص تاريخ

- **بترجع/بتغيّر إيه؟ Return / effect:** نص من toLocaleDateString('en-GB')

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### Date

- **جاية منين؟** JavaScript Date

- **وظيفتها:** مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي.

- **المدخلات — Arguments:** قيمة تاريخ اختيارية.

- **الناتج/الأثر — Return / effect:** Date object عند new؛ مش string تلقائيًا.

- **أول موضع هنا:** السطر 50، والمدخلات المكتوبة: `value + 'T12:00:00'`.

### date.setDate

- **جاية منين؟** Date instance

- **وظيفتها:** تغيّر يوم الشهر في نفس Date، مع حساب عبور الشهور.

- **المدخلات — Arguments:** day number.

- **الناتج/الأثر — Return / effect:** timestamp بعد التعديل؛ تعدّل object نفسها.

- **أول موضع هنا:** السطر 6، والمدخلات المكتوبة: `date.getDate() + days`.

### date.getDate

- **جاية منين؟** Date instance

- **وظيفتها:** تقرأ يوم الشهر في التوقيت المحلي.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** رقم من1 إلى31.

- **أول موضع هنا:** السطر 7.

### [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تجمع عناصر في نص.

- **المدخلات — Arguments:** separator اختياري.

- **الناتج/الأثر — Return / effect:** string، لا تعدّل عناصر الأصل.

- **أول موضع هنا:** السطر 7، والمدخلات المكتوبة: `'-'`.

### date.getFullYear

- **جاية منين؟** Date instance

- **وظيفتها:** تقرأ السنة المحلية كاملة.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** number مثل2026.

- **أول موضع هنا:** السطر 7.

### String(date.getMonth() + 1).padStart

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تضيف padding لبداية النص حتى طول محدد.

- **المدخلات — Arguments:** targetLength وpadString.

- **الناتج/الأثر — Return / effect:** نص جديد.

- **أول موضع هنا:** السطر 7، والمدخلات المكتوبة: `2`، `'0'`.

### String

- **جاية منين؟** JavaScript

- **وظيفتها:** تحوّل قيمة إلى نص عند استدعائها بدون new.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 7، والمدخلات المكتوبة: `date.getDate()`.

### date.getMonth

- **جاية منين؟** Date instance

- **وظيفتها:** تقرأ رقم الشهر في التوقيت المحلي.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** رقم من0 إلى11؛ للعرض المعتاد نضيف1.

- **أول موضع هنا:** السطر 7.

### String(date.getDate()).padStart

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تضيف padding لبداية النص حتى طول محدد.

- **المدخلات — Arguments:** targetLength وpadString.

- **الناتج/الأثر — Return / effect:** نص جديد.

- **أول موضع هنا:** السطر 7، والمدخلات المكتوبة: `2`، `'0'`.

### dateAfter

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يعمل تاريخ demo قبل/بعد النهارده، ويكوّن YYYY-MM-DD يدويًا.

- **المدخلات — Arguments:** days رقم موجب أو سالب

- **الناتج/الأثر — Return / effect:** نص تاريخ بلا وقت

- **أول موضع هنا:** السطر 20، والمدخلات المكتوبة: `-30`.

### reactive

- **جاية منين؟** Vue

- **وظيفتها:** يعمل Proxy تفاعلي لobject؛ تتعامل مع الحقول مباشرة بلا .value.

- **المدخلات — Arguments:** object

- **الناتج/الأثر — Return / effect:** reactive Proxy

- **أول موضع هنا:** السطر 26، والمدخلات المكتوبة: `{ available: true }`.

- **مثال:** const form = reactive({ car: '' }); form.car = 'Toyota';

### garageRepository.read

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** يحاول يفك JSON ويتأكد من version والقوائم؛ يرجّع null لو التخزين مقفول أو البيانات تالفة أو شكلها غير متوقع.

- **المدخلات — Arguments:** لا توجد parameters

- **الناتج/الأثر — Return / effect:** object صالح للحد الأدنى من الفحص أو null

- **أول موضع هنا:** السطر 25.

- **تكملة التعريف:** [resources/js/services/garageRepository.js](../services/garageRepository.js.md)، عند السطر 4.

### seed

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يرجّع بيانات تجريبية جديدة: عربيتين، حجز، تاريخ صيانة، وعملية إصلاح وهمية.

- **المدخلات — Arguments:** لا شيء

- **الناتج/الأثر — Return / effect:** object بversion=1؛ مش request حقيقي

- **أول موضع هنا:** السطر 25.

### watch

- **جاية منين؟** Vue

- **وظيفتها:** يراقب reactive source وينفذ callback عند التغيير؛ هنا حفظ state أو فتح dialog.

- **المدخلات — Arguments:** source, callback, options مثل deep

- **الناتج/الأثر — Return / effect:** watch handle للإيقاف/التوقيف المؤقت حسب الإصدار؛ الاستخدام هنا لا يخزنه

- **أول موضع هنا:** السطر 27، والمدخلات المكتوبة: `state`، `() => { storage.available = garageRepository.write(state); }`، `{ deep: true }`.

- **مثال:** watch(state, () => garageRepository.write(state), { deep: true });

### garageRepository.write

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** يحوّل state إلى JSON ويكتبها في localStorage، ويرجّع نجاح أو فشل بدل ما يقع التطبيق.

- **المدخلات — Arguments:** data: state object

- **الناتج/الأثر — Return / effect:** true عند الكتابة؛ false عند خطأ التخزين

- **أول موضع هنا:** السطر 44، والمدخلات المكتوبة: `state`.

- **تكملة التعريف:** [resources/js/services/garageRepository.js](../services/garageRepository.js.md)، عند السطر 11.

### crypto.randomUUID

- **جاية منين؟** Browser Crypto

- **وظيفتها:** يولّد UUID عشوائي في secure context؛ ليس authorization token.

- **المدخلات — Arguments:** لا شيء

- **الناتج/الأثر — Return / effect:** UUID string

- **أول موضع هنا:** السطر 38.

- **مثال:** id: crypto.randomUUID();

### Number

- **جاية منين؟** JavaScript conversion function

- **وظيفتها:** يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** number أو NaN.

- **أول موضع هنا:** السطر 31، والمدخلات المكتوبة: `vehicle.mileage || 0`.

- **مثال:** Number(option.price);

### state.vehicles.push

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تضيف عناصر في آخر array الأصلية.

- **المدخلات — Arguments:** العناصر المطلوبة.

- **الناتج/الأثر — Return / effect:** الطول الجديد؛ تعدّل الأصل.

- **أول موضع هنا:** السطر 32، والمدخلات المكتوبة: `entry`.

### state.vehicles.find

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تبحث بالترتيب حتى أول callback truthy.

- **المدخلات — Arguments:** callback تستقبل العنصر وindex والقائمة.

- **الناتج/الأثر — Return / effect:** العنصر المطابق نفسه أو undefined؛ ليست array نتائج.

- **أول موضع هنا:** السطر 36، والمدخلات المكتوبة: `v => '${v.year} ${v.make} ${v.model}' === form.car`.

### crypto.randomUUID().slice(0, 8).toUpperCase

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تحوّل الحروف لحالتها الكبيرة.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** نص جديد.

- **أول موضع هنا:** السطر 38.

### crypto.randomUUID().slice

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تأخذ جزءًا بدون تعديل الأصل.

- **المدخلات — Arguments:** start وend غير شامل النهاية.

- **الناتج/الأثر — Return / effect:** نسخة array جزئية أو نص جزئي حسب المستقبِل.

- **أول موضع هنا:** السطر 38، والمدخلات المكتوبة: `0`، `8`.

### state.appointments.push

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تضيف عناصر في آخر array الأصلية.

- **المدخلات — Arguments:** العناصر المطلوبة.

- **الناتج/الأثر — Return / effect:** الطول الجديد؛ تعدّل الأصل.

- **أول موضع هنا:** السطر 43، والمدخلات المكتوبة: `entry`.

### new Date(value + 'T12:00:00').toLocaleDateString

- **جاية منين؟** Date instance

- **وظيفتها:** تنسّق التاريخ للعرض حسب locale/options.

- **المدخلات — Arguments:** locale وخيارات.

- **الناتج/الأثر — Return / effect:** string، وليس قيمة مناسبة بالضرورة للتخزين.

- **أول موضع هنا:** السطر 50، والمدخلات المكتوبة: `'en-GB'`، `{ day: 'numeric', month: 'short', year: 'numeric' }`.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```js
import { reactive, watch } from 'vue';
import { garageRepository } from '../services/garageRepository';

const dateAfter = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
};
```

**السطر 1:** Import / استيراد: الأسماء `reactive`، `watch` جاية من `vue`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 2:** Import / استيراد: الأسماء `garageRepository` جاية من `../services/garageRepository`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 4:** Variable declaration / تعريف `dateAfter` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `dateAfter` هنا: يعمل تاريخ demo قبل/بعد النهارده، ويكوّن YYYY-MM-DD يدويًا. المدخلات: days رقم موجب أو سالب. الناتج/الأثر: نص تاريخ بلا وقت.

**السطر 5:** Variable declaration / تعريف `date` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Date(...)`: مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي. مدخلاتها: قيمة تاريخ اختيارية. العائد/الأثر: Date object عند new؛ مش string تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 6:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `date.setDate(...)`: تغيّر يوم الشهر في نفس Date، مع حساب عبور الشهور. القيم المكتوبة هنا: `date.getDate() + days`. العائد/الأثر: timestamp بعد التعديل؛ تعدّل object نفسها.؛ `date.getDate(...)`: تقرأ يوم الشهر في التوقيت المحلي. مدخلاتها: بدون arguments. العائد/الأثر: رقم من1 إلى31.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 7:** Return / رجّع `[date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-')` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `[date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join(...)`: تجمع عناصر في نص. القيم المكتوبة هنا: `'-'`. العائد/الأثر: string، لا تعدّل عناصر الأصل.؛ `date.getFullYear(...)`: تقرأ السنة المحلية كاملة. مدخلاتها: بدون arguments. العائد/الأثر: number مثل2026.؛ `String(date.getMonth() + 1).padStart(...)`: تضيف padding لبداية النص حتى طول محدد. القيم المكتوبة هنا: `2`، `'0'`. العائد/الأثر: نص جديد.؛ `String(...)`: تحوّل قيمة إلى نص عند استدعائها بدون new. القيم المكتوبة هنا: `date.getDate()`. العائد/الأثر: string.؛ `date.getMonth(...)`: تقرأ رقم الشهر في التوقيت المحلي. مدخلاتها: بدون arguments. العائد/الأثر: رقم من0 إلى11؛ للعرض المعتاد نضيف1.؛ `String(date.getDate()).padStart(...)`: تضيف padding لبداية النص حتى طول محدد. القيم المكتوبة هنا: `2`، `'0'`. العائد/الأثر: نص جديد.؛ `date.getDate(...)`: تقرأ يوم الشهر في التوقيت المحلي. مدخلاتها: بدون arguments. العائد/الأثر: رقم من1 إلى31.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 8:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 9–16

```js
const seed = () => ({
    version: 1,
    vehicles: [
        { id: 'car-corolla', make: 'Toyota', model: 'Corolla', year: 2021, plate: 'DEMO 101', mileage: 42500 },
        { id: 'car-bmw', make: 'BMW', model: '320i', year: 2019, plate: 'DEMO 202', mileage: 68100 },
    ],
    appointments: [
        { id: 'ACP-DEMO-001', vehicleId: 'car-corolla', car: '2021 Toyota Corolla', service: 'Oil Change', date: dateAfter(3), time: '10:30', status: 'confirmed' },
```

**السطر 9:** Variable declaration / تعريف `seed` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `seed` هنا: يرجّع بيانات تجريبية جديدة: عربيتين، حجز، تاريخ صيانة، وعملية إصلاح وهمية. المدخلات: لا شيء. الناتج/الأثر: object بversion=1؛ مش request حقيقي.

**السطر 10:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 11:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 12:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 13:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 14:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 15:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 16:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `dateAfter(...)`: يعمل تاريخ demo قبل/بعد النهارده، ويكوّن YYYY-MM-DD يدويًا. القيم المكتوبة هنا: `3`. العائد/الأثر: نص تاريخ بلا وقت. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 17–24

```js
    ],
    history: [
        { id: 'JOB-DEMO-102', vehicleId: 'car-corolla', car: '2021 Toyota Corolla', service: 'Oil Change', date: dateAfter(-65), total: 450, notes: 'Engine oil and filter replaced. Fluid levels checked. Example service record.' },
        { id: 'JOB-DEMO-101', vehicleId: 'car-bmw', car: '2019 BMW 320i', service: 'Battery Test', date: dateAfter(-30), total: 250, notes: 'Charging system and battery tested. No replacement recommended. Example service record.' },
    ],
    repair: { id: 'JOB-DEMO-103', vehicleId: 'car-bmw', car: '2019 BMW 320i', service: 'Brake inspection & service', stage: 2, note: 'Inspection complete. Brake service is underway. This is a sample job, not a live workshop feed.' },
});

```

**السطر 17:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 18:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 19:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `dateAfter(...)`: يعمل تاريخ demo قبل/بعد النهارده، ويكوّن YYYY-MM-DD يدويًا. القيم المكتوبة هنا: `-65`. العائد/الأثر: نص تاريخ بلا وقت. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 20:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `dateAfter(...)`: يعمل تاريخ demo قبل/بعد النهارده، ويكوّن YYYY-MM-DD يدويًا. القيم المكتوبة هنا: `-30`. العائد/الأثر: نص تاريخ بلا وقت. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 21:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 22:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 23:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 25–32

```js
const state = reactive(garageRepository.read() || seed());
const storage = reactive({ available: true });
watch(state, () => { storage.available = garageRepository.write(state); }, { deep: true });

export function useGarage() {
    const addVehicle = (vehicle) => {
        const entry = { ...vehicle, id: crypto.randomUUID(), year: Number(vehicle.year), mileage: Number(vehicle.mileage || 0) };
        state.vehicles.push(entry);
```

**السطر 25:** Variable declaration / تعريف `state` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `state` هنا: Reactive object يبدأ من repository أو seed. وجوده خارج الدالة مقصود للمشاركة. المدخلات: garageRepository.read() || seed(). الناتج/الأثر: Vue proxy للحالة. الدوال الموجودة في السطر: `reactive(...)`: يعمل Proxy تفاعلي لobject؛ تتعامل مع الحقول مباشرة بلا .value. القيم المكتوبة هنا: `garageRepository.read() || seed()`. العائد/الأثر: reactive Proxy؛ `garageRepository.read(...)`: يحاول يفك JSON ويتأكد من version والقوائم؛ يرجّع null لو التخزين مقفول أو البيانات تالفة أو شكلها غير متوقع. مدخلاتها: لا توجد parameters العائد/الأثر: object صالح للحد الأدنى من الفحص أو null؛ `seed(...)`: يرجّع بيانات تجريبية جديدة: عربيتين، حجز، تاريخ صيانة، وعملية إصلاح وهمية. مدخلاتها: لا شيء العائد/الأثر: object بversion=1؛ مش request حقيقي. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 26:** Variable declaration / تعريف `storage` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `storage` هنا: حالة متاحة للواجهة علشان تنبه المستخدم لو الكتابة فشلت. المدخلات: { available: true }. الناتج/الأثر: reactive object. الدوال الموجودة في السطر: `reactive(...)`: يعمل Proxy تفاعلي لobject؛ تتعامل مع الحقول مباشرة بلا .value. القيم المكتوبة هنا: `{ available: true }`. العائد/الأثر: reactive Proxy. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 27:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `watch(...)`: يراقب reactive source وينفذ callback عند التغيير؛ هنا حفظ state أو فتح dialog. القيم المكتوبة هنا: `state`، `() => { storage.available = garageRepository.write(state); }`، `{ deep: true }`. العائد/الأثر: watch handle للإيقاف/التوقيف المؤقت حسب الإصدار؛ الاستخدام هنا لا يخزنه؛ `garageRepository.write(...)`: يحوّل state إلى JSON ويكتبها في localStorage، ويرجّع نجاح أو فشل بدل ما يقع التطبيق. القيم المكتوبة هنا: `state`. العائد/الأثر: true عند الكتابة؛ false عند خطأ التخزين. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 29:** Function / تعريف دالة `useGarage`؛ تعريفها مش تشغيلها. يرجع الحالة وعمليات الإضافة؛ مش بيبدأ نسخة state منفصلة لكل component. مدخلاتها: لا شيء ناتجها: { state, storage, addVehicle, addAppointment }

**السطر 30:** Variable declaration / تعريف `addVehicle` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `addVehicle` هنا: ينسخ form ويضيف UUID ويحوّل السنة والعداد لأرقام، ثم push في قائمة العربيات. المدخلات: vehicle: object من نموذج Dashboard. الناتج/الأثر: entry: العربية الجديدة؛ الحفظ يتم من deep watcher.

**السطر 31:** Variable declaration / تعريف `entry` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة Object حقولها `id`، `year`، `mileage`. الدوال الموجودة في السطر: `crypto.randomUUID(...)`: يولّد UUID عشوائي في secure context؛ ليس authorization token. مدخلاتها: لا شيء العائد/الأثر: UUID string؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `vehicle.mileage || 0`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 32:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `state.vehicles.push(...)`: تضيف عناصر في آخر array الأصلية. القيم المكتوبة هنا: `entry`. العائد/الأثر: الطول الجديد؛ تعدّل الأصل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 33–40

```js
        return entry;
    };
    const addAppointment = (form) => {
        const vehicle = state.vehicles.find(v => `${v.year} ${v.make} ${v.model}` === form.car);
        const entry = {
            id: `ACP-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
            vehicleId: vehicle?.id || null,
            car: form.car, service: form.service, date: form.date, time: form.time, status: 'requested',
```

**السطر 33:** Return / رجّع `entry` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 34:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 35:** Variable declaration / تعريف `addAppointment` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `addAppointment` هنا: يطابق العربية بالنص، يولّد رقم طلب، وينسخ حقول الحجز الآمنة فقط ثم يحفظ فورًا. المدخلات: form: car,service,date,time مع حقول أخرى لا تُحفظ. الناتج/الأثر: entry: طلب demo status=requested؛ لا يتم حفظ الاسم والتليفون والملاحظات.

**السطر 36:** Variable declaration / تعريف `vehicle` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `state.vehicles.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `v => '${v.year} ${v.make} ${v.model}' === form.car`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 37:** Variable declaration / تعريف `entry` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة Object حقولها `id`، `vehicleId`، `car`، `service`، `date`، `time`، `status`.

**السطر 38:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `crypto.randomUUID().slice(0, 8).toUpperCase(...)`: تحوّل الحروف لحالتها الكبيرة. مدخلاتها: بدون مدخلات. العائد/الأثر: نص جديد.؛ `crypto.randomUUID().slice(...)`: تأخذ جزءًا بدون تعديل الأصل. القيم المكتوبة هنا: `0`، `8`. العائد/الأثر: نسخة array جزئية أو نص جزئي حسب المستقبِل.؛ `crypto.randomUUID(...)`: يولّد UUID عشوائي في secure context؛ ليس authorization token. مدخلاتها: لا شيء العائد/الأثر: UUID string. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 39:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 40:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 41–48

```js
        };
        // Contact details and problem notes are not persisted in this demo.
        state.appointments.push(entry);
        storage.available = garageRepository.write(state);
        return entry;
    };
    return { state, storage, addVehicle, addAppointment };
}
```

**السطر 41:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 42:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 43:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `state.appointments.push(...)`: تضيف عناصر في آخر array الأصلية. القيم المكتوبة هنا: `entry`. العائد/الأثر: الطول الجديد؛ تعدّل الأصل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 44:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods. الدوال الموجودة في السطر: `garageRepository.write(...)`: يحوّل state إلى JSON ويكتبها في localStorage، ويرجّع نجاح أو فشل بدل ما يقع التطبيق. القيم المكتوبة هنا: `state`. العائد/الأثر: true عند الكتابة؛ false عند خطأ التخزين. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 45:** Return / رجّع `entry` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 46:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 47:** Return / رجّع `{ state, storage, addVehicle, addAppointment }` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 48:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 49–51

```js

export const formatDate = value => new Date(value + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

```

**السطر 50:** Variable declaration / تعريف `formatDate` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `formatDate` هنا: يعرض YYYY-MM-DD كصيغة يوم وشهر وسنة إنجليزية؛ إضافة منتصف اليوم تتجنب بعض انزياحات التاريخ عند العرض. المدخلات: value نص تاريخ. الناتج/الأثر: نص من toLocaleDateString('en-GB'). الدوال الموجودة في السطر: `new Date(value + 'T12:00:00').toLocaleDateString(...)`: تنسّق التاريخ للعرض حسب locale/options. القيم المكتوبة هنا: `'en-GB'`، `{ day: 'numeric', month: 'short', year: 'numeric' }`. العائد/الأثر: string، وليس قيمة مناسبة بالضرورة للتخزين.؛ `Date(...)`: مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي. القيم المكتوبة هنا: `value + 'T12:00:00'`. العائد/الأثر: Date object عند new؛ مش string تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
