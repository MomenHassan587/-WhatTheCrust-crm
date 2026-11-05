# رحلة الكود كاملة: AutoCare والبورتفوليو

الهدف هنا مش إنك تحفظ دالة لوحدها. هنمسك حركة المستخدم من الزر أو الفورم، نمشي ورا الـ handler والملف اللي بيناديه، ونرجع تاني للنتيجة اللي بتظهر في الواجهة.

**نوع الأكواد:** كل بلوك موسوم «مقتطف حرفي» من الملف المذكور، بدون تغيير logic أو أسماء. المقتطف مش ملف كامل، والأكواد المتباعدة في نفس الرحلة موجودة أصلًا في أماكن مختلفة؛ ما تنسخهاش كلها جنب بعض في ملف واحد. الشرح بالمصري زائد أسماء المصطلحات بالإنجليزي. الأمثلة التعليمية المضافة في بقية المذكرة لازم يبقى مكتوب عليها إنها تدريبية، مش مقتطف أصلي.

**قبل التطبيق:** AutoCare حاليًا demo. مفيش controller بيحفظ عربية أو حجز، ومفيش database-backed booking. الحفظ في localStorage. البورتفوليو React واجهة عرض بلا backend. دي حدود التنفيذ الحالي، مش حاجات مفروض تفترض إنها اتعملت.

---

## الرحلة 1 — أملأ الحجز وأشوف الطلب في My Garage

### السؤال: الزر بيحفظ فين؟ مين بيستقبل الفورم؟

ملف البداية: `autocare-booking/resources/js/components/App.vue`.

المقتطف الحرفي ده هو بيانات النموذج:

```js
const form = reactive({ name: '', phone: '', car: '', service: '', date: '', time: '', notes: '' });
```

- `const form`: مرجع بيانات النموذج؛ الاسم ده بيتكرر في الـ template وفي submitBooking.
- `reactive(...)`: من Vue. تعمل object يراقب تغيير حقوله. المدخل object، والناتج Proxy تفاعلي.
- `name` و`phone` وهكذا: properties، مش variables منفصلة.
- `''`: نص فاضي كبداية.
- مش بنكتب `form.value` لأن دي reactive object، مش ref.

### الجزء المرتبط في الـ template — مقتطفات حرفية

```vue
<form class="booking-form" @submit.prevent="submitBooking">
```

```vue
<input id="booking-name" v-model="form.name" type="text" autocomplete="name" required placeholder="Example: Momen Hassan">
```

```vue
<select id="booking-service" v-model="form.service" required>
    <option value="">Choose service</option>
    <option v-for="service in services" :key="service.id" :value="service.name">{{ service.name }}</option>
</select>
```

```vue
<p v-if="errorMessage" class="alert alert-error" role="alert"><AppIcon name="warning" />{{ errorMessage }}</p>
<p v-if="successMessage" class="alert alert-success" role="status"><AppIcon name="check" />{{ successMessage }} <a href="/my-garage#appointments">View in My Garage →</a></p>
<button class="btn btn-primary form-btn" type="submit">Submit Booking</button>
```

نشرحهم تحت بعض:

- `<form>`: حاوية إدخال وإرسال، مش مجرد box.
- `@submit`: لما الفورم يتبعت، شغّل الدالة المحددة.
- `.prevent`: امنع السلوك الافتراضي لإرسال الفورم. Vue تعمل preventDefault للحدث بدل ما المتصفح يعمل navigation تقليدي.
- `submitBooking`: مرجع الدالة اللي هنلاقي تعريفها تحت، مش كلمة جاهزة من Vue.
- `v-model="form.name"`: الكتابة في input تحدّث form.name، وتغييرها بالكود يحدّث input.
- `required`: browser validation؛ في المعتاد المتصفح يمنع submit لو الحقل المطلوب فاضي. ده مش بديل لفحص backend لو عملناه لاحقًا.
- `v-model="form.service"`: يخزن اختيار الخدمة في field داخل نفس object.
- `v-for`: كرر option لكل عنصر من services.
- `service`: اسم مؤقت للخدمة الحالية، متاح داخل تكرار option فقط.
- `:key="service.id"`: هوية Vue لكل option.
- `:value="service.name"`: القيمة اللي بتتخزن هنا هي الاسم، مش الـ id. المقتطف الأصلي مختلف عن مثال التدريب اللي خزّن id.
- `{{ service.name }}`: النص اللي المستخدم يشوفه.
- `v-if="errorMessage"`: لو النص مش فاضي، اعرض الخطأ.
- `v-if="successMessage"`: لو نص النجاح موجود، اعرضه مع رابط الجراج.
- `type="submit"`: الزر يطلق submit بتاع الفورم. مفيش احتياج لـ @click مكرر.
- باقي الحقول في نفس form مربوطين بنفس الطريقة: `form.phone` و`form.car` و`form.date` و`form.time` و`form.notes`. وجودها موجود حرفيًا في atlas الكامل للملف، مش محتاج تفترض state تانية.

### الدالة اللي بيشغّلها الفورم — مقتطف حرفي كامل

```js
function submitBooking() {
    errorMessage.value = '';
    successMessage.value = '';
    if (!form.name || !form.phone || !form.car || !form.service || !form.date || !form.time) {
        errorMessage.value = 'Please fill in all required fields before submitting.';
        return;
    }
    if (form.date < today) {
        errorMessage.value = 'Choose today or a future date for your request.';
        return;
    }
    const appointment = addAppointment(form);
    successMessage.value = storage.available
        ? `Demo request ${appointment.id} saved. It is pending review; no real appointment has been made.`
        : 'Browser storage is unavailable. Your demo request cannot be kept after leaving this page.';
    Object.assign(form, { name: '', phone: '', car: '', service: '', date: '', time: '', notes: '' });
}
```

- `function submitBooking()`: تعريف function من عندنا، مدخلاتها فاضية لأنها بتقرأ form من نفس scope.
- `errorMessage.value = ''`: ابدأ من غير خطأ قديم. value لأن الرسالة ref.
- `successMessage.value = ''`: امسح نجاح المحاولة السابقة.
- `if (...)`: افتح فرع لو شرط الحقول تحقق.
- `!`: اسأل عن نفي القيمة؛ النص الفاضي falsy فينفيه إلى true.
- `||`: OR، يكفي أي حقل ناقص علشان ندخل الخطأ.
- `return;`: اخرج من الدالة فورًا؛ مش بس اخرج من if.
- `form.date < today`: مقارنة نصوص بنفس صيغة YYYY-MM-DD. تنفع للترتيب طالما الصيغة موحدة؛ مش قاعدة لكل شكل تاريخ.
- `addAppointment(form)`: هنا بقى هنتنقل لملف تاني. form هي argument، يعني البيانات اللي بنبعتها.
- `const appointment = ...`: نمسك object الطلب اللي الدالة هترجعه.
- `storage.available ? ... : ...`: ternary؛ لو الكتابة نجحت رسالة فيها رقم الطلب، وإلا تحذير.
- علامات backticks مع `${appointment.id}`: template literal تدمج رقم الطلب في النص. الناتج string.
- `Object.assign(form, {...})`: تعدّل نفس الـ reactive object لقيم فاضية؛ مش بتستبدل مرجعه. دي عملية reset للفورم.
- الناتج المباشر للدالة undefined؛ أثرها الحقيقي تعديل state وإضافة حجز demo.

### عرفنا addAppointment منين؟ — مقتطف حرفي

من نفس App.vue:

```js
import { useGarage } from '../composables/useGarage';

const { addAppointment, storage } = useGarage();
```

- `import`: هات exports من الملف ده.
- `useGarage()`: شغّل composable من عندنا.
- `{ addAppointment, storage }`: object destructuring؛ استخرج property بالاسم. دي JavaScript مش syntax خاص بـ Vue.
- المسار `../composables/useGarage` معناه اطلع من components إلى js ثم ادخل composables.

### تكملة الدالة في useGarage.js — مقتطف حرفي

```js
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
```

- `(form) =>`: arrow function تستقبل form اللي وصل من App.
- `state.vehicles.find(...)`: دور على أول عربية نصها مطابق لقيمة form.car؛ ترجع object أو undefined.
- `v =>`: predicate؛ دالة صغيرة تتنفذ لكل عربية لحد أول تطابق.
- `${v.year} ${v.make} ${v.model}`: تكوين نص العربية من الحقول. دي مطابقة نصية، مش foreign-key lookup من DB.
- `===`: نفس القيمة والنوع. هنا مقارنة string بstring.
- `crypto.randomUUID()`: دالة متصفح لتوليد UUID؛ مش رقم من السيرفر.
- `.slice(0, 8)`: أول8حروف من النص، مش تعديل النص الأصلي.
- `.toUpperCase()`: حوّل الحروف لكبيرة.
- `vehicle?.id`: optional chaining؛ اقرأ id لو vehicle موجودة، وإلا undefined بدل crash.
- `|| null`: استخدم null لو مفيش معرّف.
- `entry`: object جديد. فيه فقط car/service/date/time/vehicleId/status/id.
- الاسم والتليفون والملاحظات مش بينسخوا إلى entry؛ عشان كده لا يُحفظوا في localStorage هنا.
- `push(entry)`: يضيف الطلب لآخر نفس array. push ترجع الطول الجديد، لكن الكود مش بيستخدم الناتج ده.
- `garageRepository.write(state)`: استدعاء adapter التخزين. الناتج Boolean بيتحط في storage.available.
- `return entry`: يرجّع object الطلب لـ submitBooking علشان تستخدم id في رسالة النجاح.

### write بتعمل إيه؟ — المقتطف الحرفي في garageRepository.js

```js
write(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); return true; }
    catch { return false; }
},
```

- `data`: parameter، هنا استقبلت state.
- `try`: جرب العملية؛ التخزين ممكن يكون ممنوع أو مساحته ممتلئة.
- `JSON.stringify(data)`: حوّل object إلى نص JSON.
- `localStorage.setItem`: خزّن النص تحت المفتاح STORAGE_KEY؛ مش network request.
- `return true`: signal للدالة اللي نادتنا إن الحفظ نجح.
- `catch`: لو حصل exception، متوقعش الواجهة.
- `return false`: بلغها إن الحفظ فشل.

### طيب الرابط يجيب الطلب إزاي بعد الانتقال لصفحة تانية؟

في useGarage.js، مقتطف حرفي:

```js
const state = reactive(garageRepository.read() || seed());
const storage = reactive({ available: true });
watch(state, () => { storage.available = garageRepository.write(state); }, { deep: true });
```

- عند تشغيل JavaScript في صفحة الجراج، read تقرأ البيانات المكتوبة.
- `|| seed()`: لو القراءة رجعت null، اعمل بيانات demo أولية.
- `deep: true`: راقب التعديلات داخل القوائم والobjects، مش استبدال مرجع state فقط.
- المراقبة هنا متعرّفة في module scope خارج component؛ لا تعتبرها تلقائيًا نفس watcher عمره مرتبط بمكوّن بعينه.
- فيه write فوري في addAppointment لأن رسالة النجاح محتاجة تعرف نجاح الكتابة قبل عرضها.

في GarageDashboard.vue، مقتطف حرفي:

```js
const { state, storage, addVehicle } = useGarage();
```

```js
const upcoming = computed(() => state.appointments.filter(a => a.status !== 'cancelled' && a.date >= today).sort((a,b) => (a.date + a.time).localeCompare(b.date + b.time)));
```

```js
const filteredAppointments = computed(() => appointmentFilter.value === 'active' ? upcoming.value : [...state.appointments].sort((a,b) => b.date.localeCompare(a.date)));
```

- Dashboard تقرأ نفس شكل state من composable.
- `filter`: array جديدة بطلبات مش cancelled وتاريخها لسه صالح.
- `sort`: ترتيب. بما إنها بعد filter فهي بتعدل array الجديدة مش الأصل.
- `computed`: قيمة مشتقة تتحدث لما appointments أو filter يتغيروا.
- `[...state.appointments]`: shallow copy قبل ترتيب كل المواعيد، علشان متغيّرش ترتيب القائمة الأصلية.

وفي template، المقتطفات المرتبطة حرفيًا:

```vue
<article v-for="appointment in filteredAppointments" :key="appointment.id" class="dashboard-card appointment-card">
```

```vue
<div class="appointment-copy"><span class="card-kicker">{{ appointment.id }}</span><h2>{{ appointment.service }}</h2><p>{{ appointment.car }}</p><small>{{ formatDate(appointment.date) }} at {{ appointment.time }} · Demo location</small></div>
```

كده وصلنا من الفورم للطلب المحفوظ ولعرضه على صفحة ثانية. ده مثال full flow، بس كله browser storage.

**التطبيق:** اطلب خدمة demo، اضغط View in My Garage، وشوف رقم الطلب نفسه. جرب Refresh؛ يفضل موجودًا لو التخزين متاح. جرّب Incognito أو origin مختلف؛ مش لازم يظهر لأن التخزين منفصل.

**سؤال إنترفيو:** هل client validation أو localStorage بديل backend؟ لأ. الأول يساعد UX، والثاني تخزين محلي لا يثبت هوية المستخدم ولا يحجز slot حقيقي.

---

## الرحلة 2 — زر إضافة عربية، dialog، حفظ، ثم تحديث القائمة

### البداية من الزر — مقتطف حرفي من GarageDashboard.vue

```vue
<button class="btn garage-primary" @click="showVehicleForm = true"><AppIcon name="plus" /> Add vehicle</button>
```

- `@click`: شغّل التعبير وقت الضغط.
- `showVehicleForm = true`: في template Vue تفك ref، فمش بنكتب .value.
- الزر لا ينادي showModal بنفسه؛ تغيير الحالة هو البداية.

### الحالة والمراقبة — مقتطف حرفي

```js
const showVehicleForm = ref(false), vehicleDialog = ref(null), vehicleError = ref('');
const vehicleForm = reactive({make:'',model:'',year:new Date().getFullYear(),plate:'',mileage:0});
```

```js
function syncDialog(dialog, open) { if (!dialog) return; if (open && !dialog.open) dialog.showModal(); else if (!open && dialog.open) dialog.close(); }
watch(showVehicleForm, async value => { await nextTick(); syncDialog(vehicleDialog.value, value); });
```

نشرح الجمل جوه السطور:

- `showVehicleForm`: هل نريد فتح النموذج؟
- `vehicleDialog`: template ref تحمل DOM element الخاصة بالـ dialog بعد mount؛ null في البداية.
- `vehicleError`: رسالة التحقق.
- الفاصلة بين تعريفات const في أول سطر إعلان لأكثر من متغير؛ مش array.
- `new Date().getFullYear()`: السنة الحالية كرقم، قيمة مبدئية للحقل.
- `reactive`: نموذج object نغير حقوله مباشرة.
- `syncDialog(dialog, open)`: دالة من عندنا توفق الحالة التفاعلية مع API المتصفح.
- `if (!dialog) return`: لو عنصر DOM لسه مش متاح، اخرج بأمان.
- `open && !dialog.open`: عايزين نفتح وهي حاليًا مقفولة.
- `dialog.showModal()`: native method من المتصفح تفتح dialog بشكل modal.
- `else if (!open && dialog.open)`: عايزين نقفل وهي مفتوحة.
- `dialog.close()`: native method تقفلها.
- `watch(showVehicleForm, ...)`: راقب ref نفسها، مش .value العادية.
- `async value =>`: callback تستقبل القيمة الجديدة وتقدر تستخدم await.
- `await nextTick()`: انتظر اكتمال دفعة تحديث Vue للDOM؛ ده مش delay ولا تحميل شبكة.
- `syncDialog(vehicleDialog.value, value)`: مرّر DOM element والحالة المطلوبة.

### الربط بالـ HTML — مقتطفات حرفية

```vue
<dialog ref="vehicleDialog" @close="showVehicleForm = false" @click="closeOnBackdrop($event, 'vehicle')">
    <form class="garage-dialog-form" @submit.prevent="saveVehicle">
```

```vue
<label>Make<input v-model.trim="vehicleForm.make" required maxlength="40" placeholder="Toyota"></label>
```

```vue
<p v-if="vehicleError" role="alert" class="alert alert-error">{{ vehicleError }}</p>
<button class="btn garage-primary" type="submit">Save vehicle <AppIcon name="check" /></button>
```

- `ref="vehicleDialog"`: شبّك DOM بالـ ref اللي فوق.
- `@close`: لو المتصفح قفل dialog، مثل Escape، رجع Vue state إلى false كمان.
- `$event`: كائن الحدث اللي Vue بتوفره في template.
- `closeOnBackdrop`: تفرق بين الضغط على المحتوى والضغط على الخلفية؛ تعريفها الكامل في atlas الملف.
- `@submit.prevent="saveVehicle"`: الزر يرسل الفورم، والدالة تتنفذ من غير navigation.
- `v-model.trim`: حدث الحقل مع حذف المسافات الطرفية؛ مش حذف المسافات بين الكلمات.
- باقي inputs في نفس form: model/year/plate/mileage. كلها موجودة في المصدر الكامل، بنفس vehicleForm.

### وظيفة الحفظ — مقتطف حرفي كامل

```js
function saveVehicle() {
    vehicleError.value='';
    if (!vehicleForm.make.trim() || !vehicleForm.model.trim() || !vehicleForm.plate.trim()) { vehicleError.value='Please complete the vehicle details.'; return; }
    if (state.vehicles.some(v=>v.plate.toLowerCase()===vehicleForm.plate.toLowerCase())) { vehicleError.value='That registration is already saved.'; return; }
    addVehicle({...vehicleForm}); showVehicleForm.value=false; notice.value='Vehicle saved in this demo workspace.';
    Object.assign(vehicleForm,{make:'',model:'',year:new Date().getFullYear(),plate:'',mileage:0});
}
```

- أول سطر يمسح error قديم.
- `.trim()`: ترجع نسخة النص من غير مسافات أول/آخر؛ لو النتيجة فاضية، الشرط يرفض.
- `some(...)`: هل أي عربية محفوظة عندها نفس plate؟ الناتج Boolean فقط.
- `.toLowerCase()`: المقارنة ما تتأثرش بحروف كبيرة وصغيرة. ده مش normalizer شامل لكل صيغ لوحات العربيات.
- `return`: تمنع تنفيذ الإضافة عند وجود خطأ.
- `{...vehicleForm}`: object spread؛ انسخ properties كـ shallow copy.
- `addVehicle(...)`: دالة جاية من useGarage، مش من Vue.
- `showVehicleForm.value=false`: يقفل dialog عبر watcher.
- `notice.value=...`: رسالة فوق dashboard.
- `Object.assign`: يصفر نفس النموذج من غير قطع التفاعل.

### الدالة المكملة في useGarage.js — مقتطف حرفي

```js
const addVehicle = (vehicle) => {
    const entry = { ...vehicle, id: crypto.randomUUID(), year: Number(vehicle.year), mileage: Number(vehicle.mileage || 0) };
    state.vehicles.push(entry);
    return entry;
};
```

- `vehicle`: النسخة اللي بعتها saveVehicle.
- `...vehicle`: انسخ الحقول.
- properties اللي بعد spread تستبدل القيم لو نفس الاسم موجود.
- `Number(vehicle.year)`: تحويل رقم السنة من string/number لnumber.
- `vehicle.mileage || 0`: fallback للصفر لو قيمة falsy، ثم Number.
- `push(entry)`: تضيف العربية لنفس reactive array.
- `return entry`: متاح للمستدعي، لكنه لا يخزنه في saveVehicle الحالية.
- الـ deep watch اللي شرحناه في الرحلة1 يكتب state في repository. مفيش API اتنسى هنا؛ مفيش API أصلًا في التنفيذ الحالي.

### مين بيظهر العربية الجديدة؟ — مقتطفات حرفية

```vue
<article v-for="vehicle in state.vehicles" :key="vehicle.id" class="dashboard-card saved-vehicle">
```

```vue
<h2>{{ vehicle.make }} {{ vehicle.model }}</h2><p>{{ vehicle.year }} · {{ vehicle.plate }}</p>
```

push غيرت array، فVue أعادت عرض القائمة. مش محتاج querySelector أو إنشاء article بإيدك.

**التطبيق:** أضف Demo 303 وشوف الكارت. حاول تضيف نفس التسجيل بحروف مختلفة؛ some تمنع التكرار في الديمو. قواعد year/mileage الإضافية browser attributes وليست validation backend.

---

## الرحلة 3 — إزالة عربية أو إلغاء طلب: نفس dialog، نتيجتان مختلفتان

### الزر يحدد الهدف، مش بيحذف فورًا — مقتطفات حرفية

من GarageDashboard.vue:

```vue
<button class="subtle-button" @click="removeTarget = vehicle">Remove</button>
```

```vue
<button class="subtle-button" @click="cancelTarget = appointment">Cancel request</button>
```

- `removeTarget` و`cancelTarget`: refs فيها object الهدف أو null.
- التخزين هنا مرجع object الحالي، مش نسخة منه.
- الفكرة اسمها confirmation flow: حدّد الهدف، اعرض confirmation، وبعد الموافقة نفّذ.

المراقبة الحرفية:

```js
watch([cancelTarget,removeTarget], async ([a,b]) => { await nextTick(); syncDialog(confirmDialog.value, !!a || !!b); });
```

- أول array مصادر المراقبة؛ تراقب الاتنين.
- `([a,b])`: destructuring للarray بتاعة القيم الجديدة، بنفس الترتيب.
- `!!a`: يحول القيمة Boolean؛ object→true، null→false.
- `||`: افتح لو أي هدف موجود.
- `syncDialog`: نفس الدالة اللي شرحناها، مفيش mechanism تانية سرية.

### زر التنفيذ في dialog — مقتطف حرفي

```vue
<button class="btn garage-primary" @click="confirmAction">{{ removeTarget ? 'Remove vehicle' : 'Cancel request' }}</button>
```

نص الزر يتحدد حسب نوع الهدف، والدالة واحدة.

### الدالة كاملة — مقتطف حرفي

```js
function confirmAction() { if(removeTarget.value){state.vehicles.splice(state.vehicles.findIndex(v=>v.id===removeTarget.value.id),1);removeTarget.value=null;notice.value='Saved vehicle removed.';} else if(cancelTarget.value){cancelTarget.value.status='cancelled';cancelTarget.value=null;notice.value='Demo request cancelled.';} }
```

السطر طويل في المصدر، هنفهم **جمله بالترتيب** بدون ما نغير الكود:

1. `if(removeTarget.value)`: لو العملية إزالة عربية.
2. `findIndex(v=>v.id===removeTarget.value.id)`: دور على موضع العربية في array. يرجع index، مش object.
3. `splice(index,1)`: احذف عنصر واحد من نفس array عند الموضع ده.
4. `removeTarget.value=null`: فضّي الهدف؛ watch يقفل dialog.
5. `notice.value=...`: أعرض إشعار.
6. `else if(cancelTarget.value)`: لو مش حذف عربية لكن إلغاء طلب.
7. `cancelTarget.value.status='cancelled'`: تعدّل status على object الحجز نفسه، مش بتحذفه من القائمة.
8. `cancelTarget.value=null`: بعد التعديل فضّي ref الهدف.
9. deep watch في useGarage يكتب التغيير في localStorage.

**فرق لازم تفهمه:** العربية تُحذف من قائمة vehicles. الطلب لا يُحذف، حالته فقط تتغير؛ عشان يتعرض مع All appointments ويكون قابل للاسترجاع.

**حدود الكود:** findIndex ممكن ترجع -1 عمومًا، وsplice(-1,1) تحذف آخر عنصر. في المسار الحالي الهدف جاي من قائمة الشاشة نفسها، لكن في نسخة إنتاجية نتحقق من index قبل الحذف خصوصًا مع data تتغير من أكتر من مصدر.

زر الاسترجاع الحرفي:

```vue
<button v-else class="text-link" @click="appointment.status = 'requested'; notice = 'Demo request restored.'">Restore request</button>
```

- `v-else`: ده الفرع اللي يظهر للحجز cancelled بدل أزرار الإدارة.
- `;`: يفصل تعليمتين داخل event expression.
- عدّل status، ثم غيّر notice. Vue تعيد حساب upcoming تلقائيًا.
- تحديث حالة الطلب هنا demo محلي، مش موافقة ورشة ولا منطق authorization.

---

## الرحلة 4 — تغيير موعد الحجز: افتح بقيم قديمة، عدّل، احفظ

### زر البداية — مقتطف حرفي

```vue
<button class="text-link" @click="openReschedule(appointment)">Reschedule</button>
```

- `appointment`: الحجز الحالي في v-for.
- هنا بنبعت argument، مش بنفتح form فاضية.

### الدالة والحالة والمراقبة — مقتطفات حرفية

```js
const rescheduleTarget = ref(null), rescheduleDialog = ref(null), rescheduleError = ref('');
const rescheduleForm = reactive({date:'',time:''});
```

```js
function openReschedule(appointment) { rescheduleError.value=''; Object.assign(rescheduleForm,{date:appointment.date,time:appointment.time}); rescheduleTarget.value=appointment; }
```

```js
watch(rescheduleTarget, async value => { await nextTick(); syncDialog(rescheduleDialog.value, !!value); });
```

- target تحمل **الحجز اللي هيتعدل**.
- form تحمل **القيم المؤقتة اللي المستخدم بيكتبها**.
- الفصل مهم: لو المستخدم قفل dialog من غير حفظ، الكتابة في rescheduleForm وحدها متغيرش الحجز.
- openReschedule تمسح الخطأ، تنسخ التاريخ والوقت إلى form، ثم تحدد target.
- watcher تفتح الـ dialog لأن target بقت object.

### الـ template المرتبط — مقتطفات حرفية

```vue
<dialog ref="rescheduleDialog" @close="rescheduleTarget = null" @click="closeOnBackdrop($event, 'reschedule')">
    <form class="garage-dialog-form" @submit.prevent="saveReschedule">
```

```vue
<div class="dialog-fields"><label>Preferred date<input v-model="rescheduleForm.date" type="date" :min="today" required></label><label>Preferred time<input v-model="rescheduleForm.time" type="time" required></label></div>
<p v-if="rescheduleError" role="alert" class="alert alert-error">{{ rescheduleError }}</p>
<button type="submit" class="btn garage-primary">Save requested time</button>
```

- `:min="today"`: قيمة JavaScript لتاريخ اليوم، مش النص الحرفي today.
- v-model تكتب في form المؤقتة، وليس target.
- @close تصفر target؛ عند الإغلاق متخليش اختيار قديم فعال.

### الدالة الحرفية

```js
function saveReschedule() { if(rescheduleForm.date<today || !rescheduleForm.time){rescheduleError.value='Choose today or a future date and a preferred time.';return;} Object.assign(rescheduleTarget.value,rescheduleForm,{status:'requested'});rescheduleTarget.value=null;notice.value='Demo request updated. The new time is pending review.'; }
```

- `if(date<today || !time)`: ارفض التاريخ الماضي أو وقت ناقص.
- `return`: اخرج قبل تحديث الحجز.
- `Object.assign(rescheduleTarget.value,rescheduleForm,{status:'requested'})`: عدّل نفس object الحجز من form وغيّر حالته. آخر source تكسب لو property مكررة.
- `rescheduleTarget.value=null`: انتهى الاختيار واقفل dialog.
- `notice.value=...`: أبلغ المستخدم.
- deep watch تحفظ state؛ computed upcoming تعيد الترتيب حسب التاريخ الجديد.

**التطبيق:** غيّر الموعد إلى يوم أبعد، احفظ، شوف التاريخ والحالة Requested. افتح تاني واكتب وقت مختلف ثم اقفل؛ الحجز لا يتغير إلا بالضغط Save.

---

## الرحلة 5 — اختار عربية في الجراج وفورم الحجز يتملي في صفحة ثانية

### البداية من Dashboard — مقتطف حرفي

```vue
<button class="text-link" @click="bookVehicle(vehicle)">Book service <AppIcon name="arrow" /></button>
```

الدالة الحرفية:

```js
function bookVehicle(vehicle) { try{sessionStorage.setItem('autocare.booking.vehicle',JSON.stringify({car:`${vehicle.year} ${vehicle.make} ${vehicle.model}`}));}catch{} location.href='/#booking'; }
```

- `vehicle`: object العربية اللي جاي من card.
- `JSON.stringify({car:...})`: اعمل object صغير ثم حوّله لنص، مش بنحفظ كل بيانات العربية للprefill.
- `sessionStorage.setItem`: تخزين مؤقت خاص بالـ origin والـ tab session. مش نفس localStorage.
- `try/catch`: لو التخزين ممنوع، لسه نقدر ننتقل لفورم الحجز.
- `location.href='/#booking'`: انتقال document للصفحة العامة عند القسم. دي مش router.push ولا تنقل SPA.

### الصفحة الثانية تقرأ الرسالة — مقتطف حرفي من داخل onMounted في App.vue

```js
try {
    const selected = JSON.parse(sessionStorage.getItem('autocare.booking.vehicle'));
    if (selected?.car) form.car = selected.car;
    sessionStorage.removeItem('autocare.booking.vehicle');
} catch { /* The booking form works without browser storage. */ }
```

- `getItem`: يرجع النص أو null.
- `JSON.parse`: يحوّل النص إلى object.
- `selected?.car`: اسأل بأمان لو فيه car.
- `form.car = selected.car`: تعبئة reactive form، فينعكس تلقائيًا في input.
- `removeItem`: امسح المفتاح بعد استهلاكه. المرة التالية الفورم مش يمتلئ باختيار قديم.
- catch تحمي من JSON تالفة أو storage ممنوع.

الinput اللي بيستقبل النتيجة، مقتطف حرفي:

```vue
<input id="booking-car" v-model="form.car" type="text" required placeholder="Example: Toyota Corolla 2018">
```

**الرحلة:** زر في Dashboard → sessionStorage → انتقال لصفحة App → onMounted يقرأ → form.car تتغير → v-model يعرض النص.

**سؤال إنترفيو:** ليه مستخدمناش props بين الصفحتين؟ props تعمل داخل شجرة مكوّنات حية. هنا فيه full page navigation، فعايزين وسيط يعيش عبر reload زي URL أو storage؛ التنفيذ اختار storage.

---

## الرحلة 6 — أنيميشن القصة فشلت: الابن يبلغ الأب، والأب يسمح Retry

دي رحلة مهمة للـ props وevents وasync. مش هنبدأ بمعادلات الرسم.

### توصيل المكوّنين — مقتطف حرفي من App.vue

```vue
<StoryCanvas
    :key="storyAttempt"
    :time="storyTime"
    :active="storyActive"
    :fallback="useFallback"
    :canvas-opacity="canvasOpacity"
    :overlay-opacity="canvasOverlayOpacity"
    :blur="whipEffects.blur"
    :brightness="whipEffects.brightness"
    :scale="whipEffects.scale"
    @ready="handleStoryReady"
    @failure="activateFallback"
/>
```

- `:time` و`:blur` وباقي inputs: props، اتجاهها من الأب App إلى الابن StoryCanvas.
- `@ready` و`@failure`: events، اتجاه الإشعار من الابن للأب.
- `:key="storyAttempt"`: مش مجرد key لـ list. لما القيمة تتغير Vue تعتبرها instance جديدة، فتزيل القديمة وتنشئ واحدة من الأول.

### تعريف الأحداث في StoryCanvas.vue — مقتطف حرفي

```js
const emit = defineEmits(['ready', 'failure']);
```

- defineEmits macro من Vue script setup، مش import عادي.
- المدخل array أسماء الأحداث.
- الناتج دالة emit. هي مش callback الأب نفسها، لكنها ترسل event للنظام ليوصلها للـ listener.

### أول تحميل — الدالة الحرفية كاملة من StoryCanvas.vue

```js
async function initialize() {
    if (props.fallback) {
        ready.value = true;
        emit('ready');
        return;
    }

    try {
        const response = await fetch('/assets/story/manifest.json', { cache: 'no-cache' });
        if (!response.ok) throw new Error('Story manifest failed to load.');
        manifest = await response.json();
        if (destroyed || props.fallback) return;
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const preferLightFrames = ['slow-2g', '2g', '3g'].includes(connection?.effectiveType);
        frameSet = window.innerWidth < 768 || preferLightFrames ? manifest.mobile : manifest.desktop;

        const initialCount = Math.min(24, frameSet.count);
        let completed = 0;
        await Promise.all(Array.from({ length: initialCount }, async (_, index) => {
            await fetchEncoded(index);
            completed += 1;
            loadProgress.value = Math.round((completed / initialCount) * 100);
        }));

        await decodeFrame(0);
        if (destroyed) return;
        ready.value = true;
        emit('ready');
        resizeCanvas();
        scheduleIdlePreload(initialCount);
    } catch (error) {
        if (!destroyed) emit('failure', error);
    }
}
```

السطر والجملة بالترتيب:

- `async`: الدالة ترجع Promise وتسمح بـ await.
- `if(props.fallback)`: لو الأب طالب عرض ثابت، متحمّلش frames إضافية.
- `ready.value=true`: اقفل loader المحلي.
- `emit('ready')`: أبلغ الأب إن العرض جاهز حتى لو ثابت.
- `return`: اخرج بدل تكملة التحميل.
- `try`: جمع العمليات اللي ممكن تفشل.
- `fetch(...)`: اطلب manifest، وهو ملف JSON فيه عدد الصور ودقتها ومسارها وfps. مش endpoint حجز.
- `await`: انتظر Promise بدون حبس thread المتصفح كله.
- `cache:'no-cache'`: يسمح بإعادة التحقق من النسخة، مش معناه بالضرورة تجاهل cache كلية.
- `response.ok`: نجاح HTTP2xx. fetch لا ترمي لمجرد404، فبنراجع بنفسنا.
- `throw new Error(...)`: اعمل exception هيوصل catch.
- `await response.json()`: اقرأ body وافك JSON.
- `destroyed`: flag تمنع استكمال شغل لمكوّن اتشال أثناء الانتظار.
- `navigator.connection || ...`: حاول API الاتصال بأسماء متاحة حسب المتصفح.
- `connection?.effectiveType`: اقرأ النوع لو API موجودة، من غير crash لو مش موجودة.
- `includes`: هل النوع ضمن الأنواع الخفيفة؟ Boolean.
- `condition ? manifest.mobile : manifest.desktop`: اختار frame set؛3g تختار خفيف مش fallback دائم.
- `Math.min(24,count)`: حمّل أول24 أو العدد كله لو أقل.
- `let completed=0`: عداد هيزيد، فمش const.
- `Array.from({length:initialCount},...)`: أنشئ عددًا من المهام.
- `_`: parameter إحنا مش محتاجين قيمته؛ الاسم اصطلاحي، مش keyword.
- `index`: رقم الصورة من0.
- `Promise.all`: انتظر كل مهام المجموعة؛ لو واحدة رفضت ترفض المجموعة، لكنها لا تلغي بقية الشبكة تلقائيًا.
- `fetchEncoded(index)`: الدالة المحلية اللي هنعرفها تحت؛ ترجع Blob للصورة.
- `completed += 1`: زوّد العدد بعد نجاح صورة.
- `Math.round(...*100)`: نسبة loader.
- `await decodeFrame(0)`: أول صورة لازم تتفك قبل إعلان الجاهزية.
- `resizeCanvas()`: جهز أبعاد Canvas وجدول رسم.
- `scheduleIdlePreload(initialCount)`: حمّل الباقي على دفعات في وقت أهدى.
- `catch(error)`: لو التحميل/القراءة/decode فشل، أبلغ الأب.
- الشرط !destroyed يمنع event لمكوّن قديم اتشال.

### fetchEncoded: مش اسم جاهز، دالة من عندنا — مقتطف حرفي كامل

```js
async function fetchEncoded(index) {
    if (index < 0 || index >= frameSet.count) return null;
    if (encodedFrames.has(index)) return encodedFrames.get(index);
    if (fetchingFrames.has(index)) return fetchingFrames.get(index);
    const task = (async () => {
        for (let attempt = 0; attempt < 3; attempt += 1) {
            if (destroyed) throw new Error('Story unmounted.');
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000);
            try {
                const response = await fetch(frameUrl(index), {
                    cache: attempt ? 'reload' : 'force-cache',
                    signal: controller.signal,
                });
                if (!response.ok) throw new Error(`Frame ${index + 1} failed to load.`);
                const blob = await response.blob();
                if (!blob.type.startsWith('image/')) throw new Error('Invalid frame response.');
                if (!destroyed) encodedFrames.set(index, blob);
                return blob;
            } catch (error) {
                if (attempt === 2 || destroyed) throw error;
            } finally {
                clearTimeout(timeout);
            }
        }
    })();
    fetchingFrames.set(index, task);
    try { return await task; } finally { fetchingFrames.delete(index); }
}
```

- خارج الحدود؟ رجّع null؛ أصلًا مفيش صورة بالرقم ده.
- `encodedFrames.has/get`: لو Blob اتحملت قبل كده رجّعها، متعيدش الشبكة.
- `fetchingFrames.has/get`: لو نفس الطلب شغال بالفعل شارك نفس Promise، متعملش طلب مكرر.
- `(async()=>{...})()`: دالة async تتعرّف وتشتغل فورًا؛ ناتجها Promise اسمها task.
- `for`: حد أقصى3محاولات؛ الأرقام0و1و2.
- `AbortController`: owner browser API؛ controller.signal يربط fetch بإمكانية الإلغاء.
- `setTimeout(callback,15000)`: جدولة مرة واحدة بعد نحو15ثانية. يرجع timer ID، مش response.
- `()=>controller.abort()`: callback، لا تنفذ abort فورًا.
- `attempt ? 'reload' : 'force-cache'`: أول مرة استفد من cache، الإعادة تطلب reload.
- `response.blob()`: Promise لبيانات binary.
- `startsWith('image/')`: تأكد MIME صورة، بدل محاولة decode صفحة HTML رجعت خطأ.
- `encodedFrames.set`: خزّن Blob.
- `return blob`: يحل task بالبيانات.
- catch تعيد throw في آخر محاولة أو عند unmount، وإلا loop تحاول تاني.
- `finally`: يتنفذ سواء نجاح أو خطأ.
- `clearTimeout(timeout)`: يلغي timer المحددة إذا لسه متنفذتش. مش بيلغي fetch بنفسه؛ abort هي اللي تعمل ده.
- نخزن task في Map قبل انتظارها.
- آخر finally تحذف الطلب من قائمة in-flight، سواء نجح أو فشل.

### decodeFrame تكمل التحويل للصورة — مقتطف حرفي كامل

```js
async function decodeFrame(index) {
    if (index < 0 || index >= frameSet.count) return null;
    if (decodedFrames.has(index)) return decodedFrames.get(index);
    if (decodingFrames.has(index)) return decodingFrames.get(index);

    const task = fetchEncoded(index)
        .then(decodeBlob)
        .then((bitmap) => {
            if (destroyed) { bitmap.close?.(); throw new Error('Story unmounted.'); }
            decodedFrames.set(index, bitmap);
            decodingFrames.delete(index);
            return bitmap;
        })
        .catch((error) => {
            decodingFrames.delete(index);
            throw error;
        });

    decodingFrames.set(index, task);
    return task;
}
```

- أول3شروط نفس فكرة bounds/cache/in-flight، لكن مرحلة decode مش network.
- `.then(decodeBlob)`: لما Blob توصل، مررها لـ decodeBlob. مرجع دالة، مش استدعاء فوري.
- `.then(bitmap=>...)`: بعد فك الصورة خزّنها.
- `bitmap.close?.()`: لو فيه close شغّلها لتحرير الموارد.
- `throw error`: لا تبلع الخطأ؛ لازم initialize/renderFrame تعرف وتبلغ الأب.
- `return task`: المستدعي يقدر await الناتج.

### decodeBlob نفسها — مقتطف حرفي

```js
async function decodeBlob(blob) {
    if (typeof createImageBitmap === 'function') {
        try { return await createImageBitmap(blob); } catch { /* Try the browser image decoder. */ }
    }
    return new Promise((resolve, reject) => {
        const image = new Image();
        const url = URL.createObjectURL(blob);
        image.onload = () => { URL.revokeObjectURL(url); resolve(image); };
        image.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Frame could not be decoded.')); };
        image.src = url;
    });
}
```

- createImageBitmap من المتصفح، تدخل Blob وترجع Promise لصورة جاهزة للرسم.
- لو مش موجودة أو فشلت، جرّب Image كمسار بديل.
- `new Promise`: غلف onload/onerror القديمة في واجهة async.
- resolve نجاح، reject فشل؛ الاتنين functions وفرهم Promise constructor.
- `createObjectURL`: رابط مؤقت لبيانات موجودة، مش رفع على الإنترنت.
- `revokeObjectURL`: حرّر الرابط بعد انتهاء الحاجة.
- `image.src=url`: السطر اللي يبدأ تحميل/فك الصورة داخل Image.

### الأب يستقبل failure — مقتطف حرفي من App.vue

```js
function activateFallback(reason = 'load') {
    fallbackReason.value = typeof reason === 'string' ? reason : 'load';
    useFallback.value = true;
    storyReady.value = true;
    scrollTrigger?.kill();
    gsap.killTweensOf(smoothState);
    smoothProgress.value = 1;
}
```

- reason default يساوي load؛ لو event بعت Error بدل string نحوله لسبب load.
- useFallback=true يغير CSS/layout ويعرض fallback controls بدل ترك الشاشة سوداء.
- kill توقف instance الـ ScrollTrigger؛ killTweensOf توقف التنعيم.
- smoothProgress=1 ليست نهاية فيديو يشغّل نفسه؛ قيمة الحالة أصبحت نهاية القصة.
- الخدمات والفورم يفضلوا شغالين، مش هنعاقب المستخدم بفشل عرض المحتوى.

### زر المحاولة والدالة — مقتطف حرفي

```vue
<button class="btn" type="button" @click="enableAnimation">{{ fallbackReason === 'load' ? 'Retry animation' : 'Enable animation' }}<AppIcon name="arrow" /></button>
```

```js
async function enableAnimation() {
    useFallback.value = false;
    fallbackReason.value = '';
    storyReady.value = false;
    smoothState.value = 0;
    smoothProgress.value = 0;
    rawProgress.value = 0;
    storyActive.value = true;
    storyAttempt.value += 1;
    await nextTick();
    window.scrollTo({ top: 0, behavior: 'instant' });
    setupScrollStory();
}
```

- تصفير الحالة يمهد محاولة جديدة.
- `storyAttempt.value +=1`: يغير key، فتبدأ StoryCanvas instance جديدة بMaps وflags جديدة.
- nextTick ينتظر تحديث شجرة Vue قبل التعامل مع DOM.
- scrollTo يرجع أعلى الصفحة.
- setupScrollStory تبني المراقبة من جديد. الكود الكامل للscroll/render في atlas، لا يوجد backend تكملة مخفية.

**التطبيق الآمن:** من DevTools اعمل Offline ثم Reload علشان تشوف رسالة فشل، أعد Online واضغط Retry. reduced-motion مسار آخر مشروع، فيه زر Enable اختياري. لا تضيف intervals من عندك.

---

## الرحلة 7 — البورتفوليو: زر قابل لإعادة الاستخدام، والصورة تتحرك مع الماوس

### اختيار props للزر — مقتطف حرفي من HeroSection.tsx

```tsx
<ContactButton href="#projects" label="View Projects" />
```

وتكملته الحرفية في ContactButton.tsx:

```tsx
interface ContactButtonProps {
  className?: string;
  href?: string;
  label?: string;
}

export default function ContactButton({
  className,
  href = '#projects',
  label = 'View Projects',
}: ContactButtonProps) {
```

وفي داخل anchor، السطر الحرفي:

```tsx
{label}
```

- `interface`: تعريف شكل props للمترجم TypeScript، مش object يُنشأ في المتصفح.
- `?`: property اختيارية، مسموح للأب ميبعتهاش.
- `: string`: type لازم يكون نص في الكود الذي يراجعه TypeScript، مش validation server.
- `export default`: ده التصدير الأساسي من الملف، علشان import بالاسم المناسب.
- `{className,href,label}`: destructuring للprops.
- `href='#projects'`: default لو القيمة undefined.
- JSX braces `{label}`: اعرض قيمة المتغير، مش النص label.
- الزر الحقيقي anchor href؛ ينقل لقسم. الاسم ContactButton مش معناه submit ولا إرسال بريد.
- باقي inline style/classes حرفيًا موجودة في atlas، لا تمنع فهم props.

### الصورة مغطاة بمكوّن Magnet — مقتطف حرفي من HeroSection.tsx

```tsx
<Magnet
  padding={150}
  strength={3}
  activeTransition="transform 0.3s ease-out"
  inactiveTransition="transform 0.6s ease-in-out"
  className="absolute left-1/2 -translate-x-1/2 z-10 top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px]"
>
```

المحتوى الموجود بين Magnet و/‏Magnet يبقى children. فيه FadeIn وصورة portrait من المصدر الحقيقي.

- `padding={150}`: رقم JS، مدى إضافي لقرب الماوس، مش CSS padding.
- `strength={3}`: نقسم مسافة الماوس على3، إذن القيمة الأكبر حركة أضعف هنا.
- النصوص transition تُمرر كCSS string.
- className تذهب للwrapper الخارجي.

### الحالة في Magnet.tsx — مقتطف حرفي

```tsx
const wrapperRef = useRef<HTMLDivElement>(null);
const [isActive, setIsActive] = useState(false);
const [translate, setTranslate] = useState({ x: 0, y: 0 });
```

- useRef: مرجع ثابت للDOM، نقرأه من .current. تغيير .current وحده مش طلب render.
- `<HTMLDivElement>`: generic type لـ TypeScript، يحدد نوع العنصر.
- useState يرجع array عنصرين؛ destructuring يمسك القيمة ودالة تعديلها.
- isActive تحدد أي transition نختار.
- translate object للمسافة؛ بنعمل setTranslate بدل تعديل state مباشرة.

### الدالة والاستماع والتنظيف — مقتطف حرفي كامل

```tsx
useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    const el = wrapperRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;

    const withinX = Math.abs(distX) < rect.width / 2 + padding;
    const withinY = Math.abs(distY) < rect.height / 2 + padding;

    if (withinX && withinY) {
      setIsActive(true);
      setTranslate({ x: distX / strength, y: distY / strength });
    } else {
      setIsActive(false);
      setTranslate({ x: 0, y: 0 });
    }
  };

  window.addEventListener('mousemove', handleMouseMove, { passive: true });
  return () => window.removeEventListener('mousemove', handleMouseMove);
}, [padding, strength]);
```

- useEffect: مزامنة مع المتصفح بعد commit. هنا تسجيل listener نظام خارجي.
- `(e:MouseEvent)`: parameter مع type، event فيها clientX/clientY.
- `wrapperRef.current`: DOM الحقيقي بعد render.
- `if(!el)return`: لو ref فاضية متكملش القياسات.
- `getBoundingClientRect()`: مستطيل العنصر بالنسبة للviewport.
- centerX/Y: موضع المنتصف.
- distX/Y: بُعد الماوس عن المنتصف، ممكن موجب أو سالب.
- Math.abs ترجع مقدار البعد بدون علامة.
- withinX/Y: هل الماوس قريب على المحور ده؟
- `&&`: لازم قريب أفقيًا ورأسيًا.
- setIsActive(true) وsetTranslate: يطلبوا render بحالة حركة جديدة.
- عند الخروج نرجع translate للصفر.
- addEventListener يسجل مرجع handleMouseMove، مش يناديها.
- return داخل effect ترجع **cleanup function**؛ React تناديها قبل إعادة setup بسبب dependencies، وعند unmount.
- [padding,strength]: لما أي واحدة تتغير، فك التسجيل القديم ثم سجل handler بقيم حديثة.
- StrictMode في development ممكن setup/cleanup إضافية للتحقق، مش معناه تسيب listeners مزدوجة.

### عودة النتيجة إلى JSX — مقتطف حرفي

```tsx
<div ref={wrapperRef} className={className} style={{ willChange: 'transform' }}>
  <div
    style={{
      transform: `translate3d(${translate.x}px, ${translate.y}px, 0)`,
      transition: isActive ? activeTransition : inactiveTransition,
      willChange: 'transform',
    }}
  >
    {children}
  </div>
</div>
```

- ref على الخارجي علشان القياس ثابت.
- الحركة على الداخلي، فمش بنقيس نفس العنصر اللي بنتحركه مع كل event.
- style={{...}}: أول braces JS expression في JSX، والثانية object.
- translate3d CSS، الأرقام جاية من state.
- ternary تختار transition قرب/بعد الماوس.
- children هي الصورة والـ FadeIn اللي الأب وضعهم بين tagين.
- الدورة كاملة: ماوس → event → حساب → state → render → transform على الصورة.

**حدود الأداء:** الكود الحالي يستعمل state لكل mousemove. قابل للتحسين بـ rAF/MotionValues لو احتجنا؛ مش نقول إن ده موجود بالفعل. ولا فيه reduced-motion guard صريح في Magnet الحالية.

---

## الرحلة 8 — البورتفوليو: كارت مشروع، رابط حي، وتراكم Sticky

### البيانات ثم map — مقتطفات حرفية من ProjectsSection.tsx

```tsx
interface Project {
  id: string;
  category: string;
  title: string;
  liveUrl?: string;
  images: {
    topLeft: string;
    bottomLeft: string;
    right: string;
  };
}
```

- interface شكل البيانات فقط، لا fetch ولا model database.
- liveUrl اختيارية؛ البيانات الحالية للمشروعين لا تملأها.
- images object متداخل للصور3.

الاستدعاء الحرفي:

```tsx
{PROJECTS.map((project, index) => (
  <ProjectCard
    key={project.id}
    project={project}
    index={index}
    cardRef={index === PROJECTS.length - 1 ? lastCardRef : undefined}
  />
))}
```

- map تبني React element لكل project.
- key هوية reconciliation، لا تُمرر كprop عادية إلى ProjectCard.
- project هي البيانات، index الترتيب.
- فقط آخر كارت يستقبل lastCardRef؛ البقية undefined.
- ليه آخر كارت؟ لأنه اللي هنقيسه علشان المساحة الأخيرة.

### حساب موضع الكارت — مقتطف حرفي

```tsx
const TOP_OFFSET_BASE = 80; // px, matches top-20
const TOP_OFFSET_STEP = 16; // px added per card index
```

```tsx
function ProjectCard({ project, index, cardRef }: { project: Project; index: number; cardRef?: Ref<HTMLDivElement> }) {
  const stickyTop = TOP_OFFSET_BASE + index * TOP_OFFSET_STEP;
  const smallImageClassName = 'w-full rounded-2xl object-cover object-top aspect-video';
  const largeImageClassName = 'w-full rounded-2xl object-cover object-top aspect-video sm:h-full';

  const cardStyle: CSSProperties = {
    top: `${stickyTop}px`,
    zIndex: index + 1,
  };
```

وفي الـ return:

```tsx
<div ref={cardRef} className="sticky" style={cardStyle}>
```

- destructuring أول الأقواس يستخرج props؛ بعد colon تعريف نوع الـ object.
- stickyTop =80 لأول كارت،96للثاني.
- CSSProperties type من React عشان style object تكون خصائص CSS صحيحة.
- zIndex يزيد علشان التالي يغطي السابق.
- className sticky توفر position:sticky من Tailwind؛ JS مش بيحرك الكارت مع كل scroll.
- يبقى فيه فرق بين **حساب إعداد CSS** وبين **تنفيذ animation loop**.

### الـ live link — الدالة الحرفية كاملة

```tsx
function LiveProjectPill({ href }: { href?: string }) {
  const className =
    'inline-flex items-center justify-center rounded-full border border-white/25 px-6 py-2.5 text-xs sm:text-sm font-medium uppercase tracking-widest text-white transition-colors duration-200';

  if (!href) {
    return (
      <span
        aria-disabled="true"
        title="Live link coming soon"
        className={`${className} cursor-not-allowed opacity-60`}
      >
        Live Project
      </span>
    );
  }

  return (
    <a
      href={href}
      className={`${className} hover:border-white/40 hover:bg-white/10`}
      target="_blank"
      rel="noreferrer"
    >
      Live Project
    </a>
  );
}
```

ومكان استخدامها الحرفي:

```tsx
<LiveProjectPill href={project.liveUrl} />
```

- href ناقصة؟ if تدخل، ترجع span مش a. مفيش رابط مكسور.
- title tooltip وaria-disabled توضيح semantic، مش دي اللي منعت navigation؛ أصلاً العنصر span بلا href.
- href موجودة؟ anchor حقيقية بتاب جديدة.
- return الأول ينهي الدالة، فالفرع الثاني لا يتنفذ في نفس render.
- متلخبطش LiveProjectPill هنا مع ملف LiveProjectButton.tsx القديم؛ القديم غير مستخدم حاليًا وbutton بلا handler.

### تكملة آخر كارت في نفس الملف — مقتطف حرفي كامل

```tsx
useEffect(() => {
  const lastCard = lastCardRef.current;
  const runway = runwayRef.current;
  if (!lastCard || !runway) return;

  const updateRunway = () => {
    const finalStickyTop = TOP_OFFSET_BASE + (PROJECTS.length - 1) * TOP_OFFSET_STEP;
    runway.style.height = `${Math.max(0, window.innerHeight - lastCard.offsetHeight - finalStickyTop)}px`;
  };

  const resizeObserver = new ResizeObserver(updateRunway);
  resizeObserver.observe(lastCard);
  window.addEventListener('resize', updateRunway);
  updateRunway();

  return () => {
    resizeObserver.disconnect();
    window.removeEventListener('resize', updateRunway);
  };
}, []);
```

العنصر الحرفي اللي يتلقى الارتفاع:

```tsx
<div ref={runwayRef} aria-hidden="true" />
```

- refs نجيب منها DOM بعد mount.
- guard يمنع القياس لو عنصر مش موجود.
- updateRunway دالة local جوه effect، لا تُستدعى من JSX.
- finalStickyTop موضع آخر كارت.
- innerHeight ارتفاع الشاشة، offsetHeight ارتفاع الكارت.
- Math.max(0,...) يمنع ارتفاع سالب.
- الناتج ينكتب مباشرة style.height، مش React state لأن القيمة دي قياس DOM فقط.
- ResizeObserver تراقب **حجم الكارت**؛ window resize تراقب **حجم النافذة**. مش نفس الحدث.
- updateRunway() فورًا لأول قياس، مش نستنى resize.
- cleanup توقف المراقبة وتسحب listener.
- []: setup مرتبط بmount في هذا الكود. StrictMode dev قد يختبر setup/cleanup زيادة.
- runway div زخرفية بدون نص، لذلك aria-hidden.
- النتيجة مساحة نهاية كافية لوقفة الكارت الأخير؛ sticky نفسها CSS مش effect.

**التطبيق:** صغر وكبّر النافذة وشوف التراكم. جرّب مؤقتًا تضيف liveUrl صالحة لمشروعك في data بعد معرفة النوع، وشوف span يتحول anchor. لا تنسب روابط معاينات خارجية إلى مشاريعك.

---

## الرحلة 9 — الصور والفيديوهات في الشريط: تحميل قريب وتشغيل وقت الظهور فقط

المصدر: `mo-m-en-portfolio/src/sections/MarqueeSection.tsx`.

### اختيار المكوّن حسب نوع العنصر — مقتطف حرفي

```tsx
function Tile({ item, decorative }: { item: MediaItem; decorative: boolean }) {
  if (item.type === 'video') {
    return <VideoTile item={item} decorative={decorative} />;
  }

  return <ImageTile item={item} decorative={decorative} />;
}
```

- type تحدد branch؛ TypeScript يفهم narrowing داخل if.
- الفيديو له poster، الصورة ليس لها نفس contract؛ مش بنمرر data عشوائية.
- decorative للنسخ المتكررة في marquee علشان قارئ الشاشة ميسمعش المحتوى مرتين.

### حالة الفيديو — مقتطف حرفي

```tsx
const videoRef = useRef<HTMLVideoElement>(null);
const [failed, setFailed] = useState(false);
const [shouldLoad, setShouldLoad] = useState(false);
```

أول effect حرفيًا:

```tsx
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
```

- refs تمسك DOM؛ state تحدد هل src يتضاف.
- IntersectionObserver متصفح API، مش React hook.
- callback تستقبل entries array؛ [entry] destructuring تأخذ أول نتيجة.
- rootMargin توسع منطقة الرصد500px، فنبدا التحميل قبل دخول الشاشة.
- setShouldLoad(true) يطلب render، مش بيشغل الفيديو بنفسه.
- disconnect بعد أول اقتراب لأن التحميل مش محتاج يرجع false.
- dependency shouldLoad تمنع إنشاء observer جديد دائم بعد التحميل.

### ثاني effect: تشغيل/إيقاف — مقتطف حرفي

```tsx
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
```

- guard: متشغلش الفيديو لو فشل أو لسه محملناش src.
- threshold .25: observer يبلغ عند حدود نسبة ظهور25% أو عبور التقاطع، مش مؤقت كل25ms.
- play() ترجع Promise؛ بعض المتصفحات ترفض autoplay.
- catch تعالج الرفض بدون crashing؛ undefined معناها لا نتيجة مهتمين بيها.
- void تقول نتجاهل Promise الناتج عمدًا؛ مش معناها إلغاء التشغيل.
- pause() توقف مؤقتًا ولا تصفر currentTime.
- cleanup توقف الفيديو وتفصل observer لما dependencies تتغير أو component يتشال.

### JSX المرتبط — مقتطف حرفي

```tsx
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
```

- src مش موجودة لحد الاقتراب، فده gate واضح للشبكة.
- poster صورة قبل التشغيل.
- muted يساعد سياسة autoplay لكنه مش ضمان لكل ظروف المتصفح.
- loop يكرر.
- playsInline يمنع طلب fullscreen في بعض بيئات الموبايل.
- preload=metadata تلميح للمتصفح مش أمر تحميل كامل.
- onError تغير failed، فcomponent ترجع img بديلة في branch مذكورة في المصدر.
- الـ fallback img بتستخدم item.poster، مفيش endpoint بديل مخترع.

**الرحلة:** item data → Tile يختار VideoTile → observer قرب العنصر → state تضيف src → observer ظهور يشغل → خروج يوقف → خطأ يستبدله بـ poster.

---

## قاموس سريع للكلمات اللي بتتكرر في الرحلات

- **State:** بيانات الواجهة القابلة للتغيير.
- **Derived state:** نتيجة محسوبة من state، مثل upcoming.
- **Handler:** دالة تتعامل مع حدث، مثل saveVehicle.
- **Callback:** دالة تُمرَّر لدالة أخرى لتشغيلها لاحقًا أو أثناء iteration.
- **Argument:** قيمة تبعتها وقت الاستدعاء، مثل form في addAppointment(form).
- **Parameter:** الاسم الذي يستقبل القيمة داخل تعريف الدالة.
- **Return value:** الناتج الذي يعود للمستدعي.
- **Side effect:** أثر خارج حساب قيمة فقط، مثل التخزين أو تسجيل listener.
- **Cleanup:** فك التسجيل وإيقاف timers/observers عند انتهاء الحاجة.
- **Props:** مدخلات المكوّن من الأب.
- **Emit/event:** إشارة من مكوّن إلى المستمع لها.
- **Ref:** في Vue صندوق reactive بقيمة .value؛ في React كائن .current لا يطلب render عند تغييرها.
- **Promise:** تمثيل نتيجة async مستقبلية، مش البيانات نفسها فورًا.
- **Adapter/repository:** طبقة تخفي تفاصيل مصدر البيانات؛ هنا Storage وليس server.
- **Cache:** حفظ نتيجة لتجنب إعادة نفس الشغل.
- **In-flight:** عملية لسه شغالة؛ مشاركة Promise تمنع تكرارها.
- **Fallback:** مسار بديل صالح لما الميزة الأساسية تفشل.
- **Lifecycle:** توقيت إنشاء المكوّن وعرضه وإزالته.

## إزاي تذاكر من غير متاهة؟

امسك رحلة واحدة، افتح الملفات المكتوبة بالترتيب، واكتب جزءًا ثم اختبر ناتجه قبل الانتقال. ما تغيّرش كود الإنتاج التجريبي وأنت بتجرب destructive operations على بيانات مهمة. الأساس إنك تعرف: مين بدأ الحدث؟ مين الدالة؟ إيه المدخل؟ إيه الناتج؟ فين بتظهر النتيجة؟ لو عرفتهم تقدر تشرح الميزة في إنترفيو بدل حفظ syntax بس.

