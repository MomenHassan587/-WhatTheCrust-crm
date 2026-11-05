# مقابلة عملية: 24 سؤال من مشاريعك

ما تحفظش الإجابات. اقفل الإجابة، اشرح بصوتك في دقيقة، وبعدها قارن. لو مش قادر تطبق الفكرة في كود صغير، ارجع لدرسها.

**الأولوية دلوقتي:** أسئلة 1–16 أساسية. 17–22 full-stack وأمان وبيانات. 23–24 طريقة عرض مشروعك. مش لازم تحفظ معادلات GSAP أو API كل مكتبة علشان تبدأ تقدم.

كل snippets اللي تحت **مبسّطة/تدريبية إلا لو مكتوب مقتطف فعلي**. الأسعار والمعرّفات عينات، مش بيانات عملاء.

## JavaScript: افهم الناتج قبل تشغيل الكود

المصدر المرجعي: [Cart](../resources/js/Pages/Cart.jsx)، [CatalogContext](../resources/js/context/CatalogContext.jsx). تطبيق أوسع في [12](12-javascript-practice.md).

### 1. إمتى تستخدم find وإمتى filter؟

```js
const services = [{ id: 1, price: 50 }, { id: 2, price: 30 }];
const selected = services.find((service) => service.id === 2);
const cheap = services.filter((service) => service.price < 40);
```

<details><summary>الإجابة</summary>

find ترجع أول object مطابق أو undefined، filter ترجع array جديدة حتى لو فاضية. هنا selected object الخدمة 2، وcheap array فيها الخدمة 2. `service` عنصر callback الحالي، و`===` مقارنة صارمة.

الاتنين methods جاهزة في JavaScript على array، وبتاخد callback شرط. callback ترجع Boolean؛ لكن **ناتج method نفسها مش Boolean**: find عنصر، وfilter قائمة. لا واحدة بتحذف من services. العناصر الناتجة تفضل نفس مراجع objects، حتى لو array filter نفسها جديدة. التفاصيل بأمثلة دخل/خرج في [12](12-javascript-practice.md).

</details>

### 2. ليه الشرط ده false؟

```js
const selectedId = '2';
const matches = 2 === selectedId;
```

<details><summary>الإجابة</summary>

الأنواع مختلفة: رقم ونص. ظبط النوع عند حدود الإدخال حسب البيانات؛ في Vue `:value="service.id"` تحفظ الرقم، وفي بعض HTML inputs القيمة نص. ما تستبدلش كل === بـ == لمجرد إخفاء المشكلة.

`===` عامل لغة، مش method. `Number(selectedId)` دالة JavaScript جاهزة تأخذ قيمة وترجع رقمًا أو NaN لو التحويل فشل؛ النص الفاضي يتحول لصفر، لذلك التحويل وحده مش validation. مثال `2 === Number('2')` نتيجته true، و`Number('two')` ناتجه NaN.

</details>

### 3. إيه الناتج؟ وليه spread هنا؟

```js
const item = { id: 1, quantity: 1 };
const next = { ...item, quantity: 3 };
console.log(item.quantity, next.quantity);
```

<details><summary>الإجابة</summary>

`1 3`؛ عملنا object جديد وغيّرنا خاصية فيه. spread shallow، فـ nested object يفضل مرجع مشترك لو ما نسخناهوش. ده أساس immutable updates في React.

</details>

### 4. إجمالي السلة يتحسب إزاي؟

```js
const items = [{ price: 50, quantity: 2 }, { price: 30, quantity: 1 }];
const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
```

<details><summary>الإجابة</summary>

130. `0` بداية accumulator؛ كل مرة نضيف سعر السطر × الكمية. ده preview في الفرونت؛ Laravel يعيد الحساب بأسعاره. استخدام numbers مالية floating-point له حدود؛ في تصميم إنتاج قوي فكّر في minor units/decimal strategy واضحة.

`reduce(callback, initialValue)` Array method جاهزة ترجع آخر نتيجة متراكمة. callback هنا تأخذ sum السابق وitem الحالية وترجع sum الجديد. البداية 0 → بعد 50×2 تصبح 100 → بعد 30×1 تصبح 130. الأصل items لا يتغير. مع array فاضية وبداية 0 ترجع 0؛ من غير بداية على array فاضية ترمي TypeError.

</details>

### 5. إيه الفرق بين ?? و||؟

```js
const fee = 0;
console.log(fee ?? 20);
console.log(fee || 20);
```

<details><summary>الإجابة</summary>

الأول 0، التاني 20. ?? يستخدم البديل مع null/undefined فقط؛ || مع أي falsy. ده مهم في مجاني/صفر، مش فرق شكلي.

</details>

### 6. await بيجمّد الصفحة؟ وfetch بترمي error على 422؟

```js
const response = await fetch('/api/menu');
if (!response.ok) throw new Error('Request failed');
const data = await response.json();
```

<details><summary>الإجابة</summary>

الكود ده داخل async function. await يوقف تكملة الدالة مؤقتًا، مش event loop كلها. fetch لا ترفض لمجرد HTTP 422؛ افحص ok/status. network failure ممكن يرفض Promise. json قراءة body async، مش نفس stringify.

- `fetch(url, options?)` Web API: المدخل URL وخيارات اختيارية؛ الراجع Promise بـ Response. الأثر طلب شبكة.
- `response.ok` خاصية Boolean لحالات 200–299، مش method ولا نتيجة parsing.
- `response.json()` Response method: بلا arguments هنا، ترجع Promise ببيانات body. HTTP ناجحة لا تضمن JSON صالحًا؛ parsing قد يفشل.
- `new Error(message)` ينشئ خطأ، و`throw` يرميه. catch تستقبل الخطأ لو موجودة في المسار.

مساعد المشروع `csrfFetch` يغلّف fetch ويكمل التحليل، لذلك `await csrfFetch('/api/menu')` يرجّع payload مباشرة مش Response؛ متعملش `.json()` عليه مرة أخرى. جسمه والمستدعي CatalogContext متصلين في [libraries](libraries.md).

</details>

**تمرين المجموعة:** اكتب function ترجع أسماء الخدمات الأرخص من 40 بـ filter ثم map. **المتوقع:** قائمة أسماء، مش object واحد. **خطأ شائع:** forEach لا ترجع array نتائج.

## Vue: نفس تمرين الخدمة اللي طبقته

المصدر: [AutoCare App](../../autocare-booking/resources/js/components/App.vue)، [useGarage](../../autocare-booking/resources/js/composables/useGarage.js). التدريب المفصل في [13](13-vue-practice.md).

### 7. ref وcomputed: كل واحدة إمتى؟

```js
const selectedId = ref('');
const selected = computed(() => services.find((service) => service.id === selectedId.value));
```

<details><summary>الإجابة</summary>

ref لحالة الاختيار القابلة للتغيير؛ computed لنتيجة مشتقة تتحدث عند تغير reactive dependencies. services لازم تكون معرّفة. في JavaScript نقرأ .value؛ في template Vue يفك ref تلقائيًا في الاستخدام ده. ما أخزنش selected كنسخة state مستقلة وأتعب في مزامنتها بدون داعي.

`ref(initialValue)` من Vue ترجع ref object قابل لتغيير value. `computed(getter)` من Vue ترجع computed ref تقرأ منها النتيجة؛ getter تتحسب عند الحاجة وتُخزّن النتيجة لحين تغيّر اعتماد reactive. هنا getter تنادي find؛ find تقرأ selectedId.value، فتدخل ضمن الاعتمادات. computed لا تطلب شبكة ولا تحفظ DB تلقائيًا.

لو مفيش اختيار، find ترجع undefined؛ لذلك عرض `selected.price` لازم يكون تحت `v-if="selected"`. ده يمنع الوصول لخاصية على قيمة غير موجودة، مش مجرد تجميل واجهة.

</details>

### 8. ليه :value و:key مختلفين رغم نفس الرقم؟

```vue
<option v-for="service in services" :key="service.id" :value="service.id">
    {{ service.name }}
</option>
```

<details><summary>الإجابة</summary>

key لهوية عنصر القائمة بالنسبة لـ Vue عند التحديث. value قيمة اختيار المستخدم. : تربط JavaScript expression؛ من غيرها value="service.id" نص حرفي. `service` متاح في نطاق v-for، مش كل المكوّن.

</details>

### 9. v-model بتعمل إيه؟

<details><summary>الإجابة</summary>

مزامنة بين قيمة الإدخال وstate باستخدام الربط وأحداث التحديث المناسبة. اختيار select يغير selectedId، وتغيير selectedId برمجيًا يعكس الاختيار. مش بتبعت البيانات للسيرفر تلقائيًا.

</details>

### 10. v-if ولا v-show؟

<details><summary>الإجابة</summary>

v-if ينشئ/يزيل الفرع ومكوّناته، وv-show يبدّل display ويُبقي العنصر. اختيارهم حسب تكرار التبديل والتكلفة. opacity:0 شيء مختلف: العنصر قد يظل قابلًا للتركيز/التفاعل لو ما اتعالجش.

</details>

### 11. ليه نزيل scroll listener؟

```js
function updateNavbar() {
    navbarScrolled.value = window.scrollY > 24;
}
onMounted(() => window.addEventListener('scroll', updateNavbar));
onBeforeUnmount(() => window.removeEventListener('scroll', updateNavbar));
```

السياق: داخل script setup بعد استيراد ref/onMounted/onBeforeUnmount من Vue وتعريف `const navbarScrolled = ref(false)`. الدالة هنا مبسّطة من فكرة المشروع.

<details><summary>الإجابة</summary>

لمنع بقاء listener بعد إزالة المكوّن أو تكرار التسجيل. نزيل نفس function reference ونفس event، مش arrow function جديدة تبدو متشابهة. updateNavbar بدون أقواس لأننا بنمرر الدالة للتنفيذ لاحقًا.

`addEventListener(type, callback)` Web API method تسجل callback وتعيد undefined؛ لا تنفّذ callback بنفسها وقت التسجيل. المتصفح يناديها عند الحدث. `removeEventListener(type, callback)` تلغي التسجيل بنفس المرجع ونفس capture عند استخدامه؛ لا تمسح الدالة من الذاكرة بالقوة.

`updateNavbar` دالة كتبناها تقرأ scrollY وتحدّث ref؛ لا ترجع قيمة. `scrollY` خاصية عدد بكسلات وليست function. `onMounted` و`onBeforeUnmount` hooks Vue تسجل functions لمراحل عمر المكوّن، مش أسماء أحداث متصفح.

</details>

**تمرين المجموعة:** اختار خدمة واعرض السعر، ثم غيّر الاختيار. **المتوقع:** السعر يتحدث من computed بدون change handler إضافية. **خطأ شائع:** استخدام اسم service خارج نطاق v-for بدل selectedService.

## React وTypeScript

المصدر: [Pizza Cart](../resources/js/Pages/Cart.jsx)، [CatalogContext](../resources/js/context/CatalogContext.jsx)، [Portfolio main](../../mo-m-en-portfolio/src/main.tsx)، [Portfolio App](../../mo-m-en-portfolio/src/App.tsx). الشرح في [14](14-react-typescript-practice.md).

### 12. props مقابل state؟

<details><summary>الإجابة</summary>

props مدخلات الأب للابن، state ذاكرة قابلة للتغيير تخص المكوّن أو owner للحالة. الطفل ما يعدلش props مباشرة. لما يحتاج يبلغ الأب بفعل، يستدعي callback في React أو emit في Vue. رفع الحالة يفيد لما أكثر من مكوّن يحتاج نفس الحقيقة.

</details>

### 13. ليه functional state update؟

```jsx
setQuantity((current) => current + 1);
```

<details><summary>الإجابة</summary>

لما القيمة الجديدة تعتمد على السابقة، updater يأخذ القيمة المناسبة من React بدل الاعتماد على snapshot قديمة داخل closure. تحديث state يطلب render؛ مش تعديل فوري للمتغير المحلي في نفس التنفيذ.

`setQuantity` هنا setter رجعته `useState`، مش function إحنا كتبناها. تقبل قيمة أو updater function، وترجع undefined. `current` قيمة تعطيها React للـ updater، و`current + 1` الراجع المطلوب تخزينه. خلي updater نقيًا: لا network ولا localStorage بداخله.

مثال متصل داخل مكوّن: `const [quantity, setQuantity] = useState(1)` ثم `<button onClick={() => setQuantity((current) => current + 1)}>{quantity}</button>`. أول ضغطة تطلب 2، وبعد render يظهر 2؛ مش لازم المتغير في السطر التالي من نفس handler يتبدّل.

</details>

### 14. useEffect وuseMemo: الفرق؟

<details><summary>الإجابة</summary>

effect للمزامنة مع شيء خارجي مثل network/listener/timer مع cleanup عند الحاجة. memo لحساب نقي مشتق وحفظ نتيجته كتحسين أداء. ما تحطش POST أو setter side effect جوه useMemo. dependencies الناقصة ممكن تنتج stale closure؛ ضفها أو أصلح التصميم بدل إخفاء التحذير.

- `useEffect(setup, dependencies)` hook React؛ لا ترجع قيمة حساب لكود العرض، وناتجها undefined. React تنادي setup بعد commit. لو setup رجعت function، دي cleanup تتنفّذ قبل إعادة setup بسبب تغيّر الاعتمادات وعند unmount.
- `useMemo(calculate, dependencies)` hook React؛ ترجع نتيجة calculate أثناء render وتستطيع إعادة استخدام النتيجة لو الاعتمادات ثابتة. هي تحسين أداء، مش ضمان تخزين دائم ولا مكان آثار جانبية.
- `useCallback(fn, dependencies)` hook React؛ ترجع function reference، مش نتيجة تشغيل fn. لذلك بعدها لسه محتاج استدعاء الدالة.

في CatalogContext، reload هي function من useCallback؛ effect تناديها؛ reload تنادي csrfFetch ثم setCatalog؛ useMemo تبني value للـ Provider. ده ترتيب أدوار، مش ثلاث طرق متكافئة لطلب API. جسم reload وcsrfFetch في [libraries](libraries.md). مثال setInterval/clearInterval الكامل من تعريف loadOrders لرد السيرفر موجود في [09](09-staff-dashboard.md).

</details>

### 15. Context تحل إيه؟ وليه مش لكل متغير؟

<details><summary>الإجابة</summary>

Pizza تشارك auth وcatalog وbranch preferences عبر providers. ده يقلّل prop drilling، لكن تغيّر context value يحدّث consumers وقد يزيد التعقيد. state محلية للـ input أو menu مش لازم global store. React Context مش cache API كامل ولا بديل لكل state library.

</details>

### 16. علامة ! في Portfolio main.tsx تعمل runtime check؟

```tsx
document.getElementById('root')!
```

<details><summary>الإجابة</summary>

لا؛ non-null assertion تقول لـ TypeScript افترض غير null. بتختفي من ناتج JavaScript. لو root غير موجود runtime error لسه ممكن. هي مش عكس Boolean في الموضع ده؛ وضع علامة ! قبل تعبير له معنى مختلف.

`getElementById('root')` DOM method جاهزة، تستقبل id وترجع HTMLElement أو null. مش بتنشىء العنصر. علامة ! هنا type assertion وليست method، ولا تغيّر القيمة الراجعة فعليًا.

</details>

**تمرين المجموعة:** اعمل مكوّن زر يستقبل label وonClick، واكتب نوع props في TypeScript. **المتوقع:** تغيير label لا يتطلب تعديل markup الداخلي. **خطأ شائع:** `onClick={handler()}` يشغل handler أثناء render بدل تمريره.

## Laravel والبيانات والأمان

المصدر: [routes](../routes/web.php)، [OrderCreator](../app/Services/Orders/OrderCreator.php)، [Order](../app/Models/Order.php)، [StaffOrderController](../app/Http/Controllers/Api/StaffOrderController.php)، [PaymentController](../app/Http/Controllers/Api/PaymentController.php).

### 17. Route → Request → Controller → Service معناها إيه؟

<details><summary>الإجابة</summary>

route يطابق method/URL وmiddleware. Form Request يتحقق من input عند حقنه. controller ينسق الاستجابة. OrderCreator يطبق إنشاء الطلب وتسعيره وحفظه. service مفيدة لتجميع business logic؛ مش شرط تعمّل طبقة جديدة لكل سطر.

الأسماء هنا أدوار وملفات مختلفة: Form Request::validated ترجع المدخلات المقبولة؛ method الإنشاء الخاصة بـ OrderCreator ترجع Order محفوظة وقد ترمي خطأ؛ response()->json تبني HTTP response للفرونت. متقولش «كلهم بيرجعوا JSON». اتبع الاستدعاء والوسائط والراجع في [06](06-routes-controllers-and-server.md) و[08](08-checkout-and-payment.md).

</details>

### 18. authentication وauthorization وvalidation مختلفين إزاي؟

<details><summary>الإجابة</summary>

الأولى مين أنت، الثانية مسموح تعمل إيه، الثالثة المدخلات سليمة؟ staff/admin middleware مش كفاية وحدها لو staff المفروض يشوف فرعه فقط؛ فيه branch authorization في StaffOrderController. إخفاء زر React مش حماية endpoint.

</details>

### 19. ليه APIs هنا في web.php؟ المشروع Sanctum؟

<details><summary>الإجابة</summary>

التدفق الحالي same-origin session-based مع web middleware وCSRF. اسم prefix api مش بيختار guard ولا يلغى CSRF. Sanctum مش direct dependency في المشروع الحالي؛ ما تقولش مستخدمه. تسجيل الدخول يجدد session، وhelper يرسل CSRF ويحدّث token من الرد عند توفره.

</details>

### 20. علاقة الطلب بالمنتجات إيه؟ وليه تحفظ price على OrderItem؟

<details><summary>الإجابة</summary>

Order hasMany OrderItem؛ Order belongsTo Branch/User. Branch وMenuItem بينهما pivot يحمل السعر والتوفر. سعر order item snapshot تاريخية؛ تعديل سعر المنيو بكرة ما يغيرش طلب امبارح. frontend totals غير موثوقة؛ OrderCreator يقرأ pivot price.

`hasMany(Model::class)` و`belongsTo(Model::class)` methods من Eloquent ترجع relation object، مش كل السجلات فورًا. قراءة علاقة كخاصية قد تحمّل النتائج إذا لم تُحمّل مسبقًا، بينما استدعاء العلاقة كدالة يسمح ببناء query عليها. علاقة pivot تحمل بيانات الربط الخاصة بالفرع، مش سعر عام واحد لكل المنتجات.

</details>

### 21. Transaction وN+1 وconcurrency: تشرحهم من المشروع إزاي؟

<details><summary>الإجابة</summary>

Transaction تحفظ order/items كوحدة واحدة أو rollback. eager loading بـ with يقلل استعلامات العلاقات المتكررة؛ OrderCreator حاليًا يقرأ item/pivot لكل سطر، تحسينها بتجميع queries ممكن. تحديث staff يستخدم transaction وlockForUpdate وexpected_status لاكتشاف تعارض؛ فاعلية locks تختلف حسب DB engine، فلا تدّعي ضمانات production من SQLite فقط.

`DB::transaction(callback)` من Laravel تنفّذ callback داخل transaction وتعيد ناتجها؛ استثناء غير ممسوك يسبب rollback وتُعاد إثارته. `with([...])` Eloquent تضيف خطة تحميل علاقات للـ query، و`get()` تنفّذ وترجع collection. `lockForUpdate()` تضيف قفلًا مناسبًا لقراءة السجلات عند تنفيذ query حسب محرك DB؛ مش lock JavaScript للزر.

</details>

### 22. هل تأكيد Stripe في المتصفح كفاية؟ وهل الداشبورد WebSocket؟

<details><summary>الإجابة</summary>

لا؛ PaymentController يتحقق من webhook signature قبل paid/new. النظام يستخدم idempotency key وبعض checks للتكرار، لكن ده لا يثبت إن كل concurrent retry آمنة؛ نحتاج tests/design أقوى قبل production. staff حاليًا polling كل 7 ثواني؛ وجود backend broadcast events لا يعني Echo/Reverb client متصل.

`window.setInterval(callback, delay)` Web API تسجل callback تتكرر وتعيد timer id؛ ما بترجعش بيانات الطلبات، وأول مرة ليست فورًا. `window.clearInterval(id)` تلغي التكرارات القادمة لهذا المعرف وترجع undefined؛ لا تلغي fetch بدأ بالفعل. لهذا loadOrders تُستدعى فورًا ثم تُمرّر للمؤقت. التتبّع والشرح كلمة بكلمة في [09](09-staff-dashboard.md)، مش مطلوب تحفظ الجملة «يوقف المؤقت» بدون فهم المؤقت وآثاره.

</details>

**تمرين المجموعة:** فسّر نتيجة guest request لـ staff endpoint ثم customer مسجل يحاول نفس endpoint. **المتوقع في JSON tests:** غير المسجل 401، وغير المصرح 403. استخدم test DB المعزولة. **خطأ شائع:** اعتبار validation في browser بديلًا لفحوص السيرفر.

## تقديم نفسك والمشاريع بصدق

### 23. إيه الفرق بين المشاريع اللي عندك، والنسخ المنشورة؟

<details><summary>إجابة مقترحة بصوتك</summary>

Pizza عندي React/Laravel backend محلي فيه catalog وorders وroles وتتبع وإدارة وتكامل Stripe. النسخة static demo تستخدم adapter ومحاكاة محلية، مش PHP/payment/live auth. AutoCare Vue فيه cinematic UI وdemo garage بتخزين المتصفح وLaravel shell محلي، مش backend booking مكتمل. Portfolio React/TypeScript موقع عرض static. أفرّق بين code implementation وبين اللي متاح فعلًا على الاستضافة.

</details>

### 24. إيه تقول لو اتسألت عن AI أو نقطة ضعف في المشروع؟

<details><summary>إجابة مقترحة بصوتك</summary>

استخدمت AI للمساعدة، وبراجع التدفقات وأطبق أجزاء بإيدي وأختبرها. أقدر أشرح feature محددة وحدودها. ما أدعيش فهم جزء مش قادر أعدله. تحسين مقترح: backend حقيقي لـ AutoCare مع ownership tests، أو اختبارات payment retry/concurrency في Pizza. مش هقول المنيو هاردكود بدون مراجعة؛ النسخة الحالية متصلة بـ CatalogContext/API أو demo adapter.

</details>

## تمرين مقابلة لمدة 10 دقائق

1. دقيقتان: اشرح مشروع واحد والفرق بين local backend وstatic demo.
2. 3 دقائق: اكتب filter/map أو Vue select/computed من غير نسخ.
3. 3 دقائق: تتبع order من Cart إلى validation/service/DB.
4. دقيقتان: اذكر test يحمي صلاحية، وتحسين واحد بحدود واقعية.

لو جاوبت السؤال لكن مش عارف تكتب مثال، دوّن اسمه وراجع درسه. ده تمرين مهارة، مش مسابقة حفظ.
