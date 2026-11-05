# أسئلة وتمارين: المنيو والسلة — JavaScript + React

المشروع: **pizza-crm = Laravel + React، مش Vue**. المتطلبات: تعرف array وobject و`useState`، وتراجع [خريطة المشروع](02-project-map.md). ذاكر سؤال واحد ونفّذه قبل اللي بعده؛ مش مطلوب تحفظ الصفحة كلها.

المصادر: [CatalogContext](../resources/js/context/CatalogContext.jsx)، [MenuPage](../resources/js/Pages/MenuPage.jsx)، [OrderContext](../resources/js/context/OrderContext.jsx)، [Cart](../resources/js/Pages/Cart.jsx).

**تصحيح مهم للنسخة القديمة من المذكرة:** المنيو الحالي بيقرأ `/api/menu` فعلًا، ومشاركة الفرع ونوع الطلب موجودة في `OrderContext`. في وضع الديمو، `csrfFetch` بيستخدم محاكاة محلية بدل Laravel؛ راجع [api.js](../resources/js/lib/api.js). الأسعار في المتصفح للعرض؛ السيرفر الحقيقي يعيد التحقق وقت الطلب.

## 1. سؤال: إزاي المنيو بيجيب بياناته؟

**مقتطف فعلي** من دالة `reload` داخل `CatalogProvider`:

```jsx
setLoading(true);
setError('');
try {
    const response = await csrfFetch('/api/menu');
    setCatalog({
        branches: response.branches || [],
        categories: response.categories || [],
        items: response.items || [],
    });
} catch (requestError) {
    setError(requestError.message || 'The menu could not be loaded.');
} finally {
    setLoading(false);
}
```

**كل سطر بيعمل إيه؟**

1. `setLoading(true)` يشغّل حالة التحميل؛ دي setter جاية من `useState`، مش متغير عادي.
2. `setError('')` يمسح رسالة طلب سابق؛ `''` نص فاضي.
3. `try` يبدأ أوامر ممكن تفشل؛ الأقواس `{}` تحدد حدودها.
4. `const response` يحفظ الرد؛ `await` يستنى الـ Promise داخل الدالة `async` الحالية، مش بيجمّد المتصفح. `csrfFetch` مساعد المشروع للطلبات.
5. `setCatalog({` يبدأ تحديث الحالة بـ object جديد.
6–8. كل خاصية تقرأ قائمة من الرد؛ `|| []` يستخدم قائمة فاضية لو القيمة الأصلية falsy.
9. `});` يقفل الـ object واستدعاء setter.
10. `catch` يستقبل الخطأ في اسم اخترناه `requestError`.
11. نخزّن رسالته أو رسالة بديلة.
12. `finally` جزء يتنفذ بعد النجاح أو الفشل.
13. نطفي حالة التحميل.
14. قفل الجزء الأخير.

**تطبيق يدوي:** افتح الملف واقرأ فوق المقتطف تعريف `loading` و`error` و`catalog`، وبعده `useEffect` اللي ينادي `reload()`. اكتب المقتطف في ملاحظتك؛ متضيفش نسخة ثانية للـ Provider. جرّب Offline في أدوات المطوّر ثم افتح المنيو، وبعدها رجّع الاتصال واضغط Retry.

**المتوقع:** رسالة خطأ بدل spinner دائم، ثم بيانات بعد إعادة المحاولة. **غلطة شائعة:** نسيان `finally` يسيب `loading` مفعّل عند الفشل.

<details><summary>سؤال إنترفيو: ليه state للتحميل والخطأ؟</summary>

الطلب مش فوري وممكن يفشل. لازم الواجهة تفرق بين loading وsuccess وerror؛ والقائمة الفاضية حالة مختلفة عن فشل الشبكة. وجود `await` لا يمنع التعامل مع أخطاء الطلب.

</details>

## 2. سؤال: إزاي أجيب سعر المنتج في الفرع المختار؟

**مقتطف فعلي** من `CatalogContext.jsx`:

```js
export function branchOption(item, branchId) {
    return item?.branch_options?.find((option) => Number(option.branch_id) === Number(branchId)) || null;
}
```

السطر الأول يعرّف دالة قابلة للاستيراد بـ `export`، اسمها `branchOption`، ومدخلاتها المنتج ومعرّف الفرع. السطر الثاني بيرجّع أول خيار مطابق أو `null`. السطر الثالث يقفل الدالة.

نفك السطر الطويل: `item?.branch_options` يقرأ خيارات الفروع لو المنتج موجود. `?.find` مايناديش البحث لو القائمة نفسها null أو undefined. `find` يمر على الخيارات ويرجّع **object واحد**؛ `option` اسم العنصر الحالي. `=>` تعريف callback قصيرة. `Number(...)` يحوّل المعرّفات لأرقام، علشان `'2'` و`2` يتقارنوا بنفس النوع. `===` مقارنة صارمة. `|| null` بديل لما مفيش تطابق. ده يتحمل غياب البيانات، لكنه مش تحقق كامل من صحة شكل الرد.

**مثال تدريبي إضافي — في Console فقط، مش ملف التطبيق:**

```js
const item = { branch_options: [{ branch_id: 2, price: 167 }] };
const option = item.branch_options.find((entry) => entry.branch_id === 2);
console.log(option.price);
```

1. أنشأنا object فيه array من خيارات الفروع.
2. بحثنا عن الفرع `2` وخزّنا الـ object الناتج؛ `entry` مجرد اسم محلي.
3. طبعنا `price` من النتيجة: `167`.

**تطبيق يدوي:** غيّر البحث إلى `=== 3`، واطبع `option` بدل `option.price`. **المتوقع:** `undefined`، لأن `find` ما لقتش عنصر. الدالة الأصلية تحول النتيجة إلى `null`، فلازم المتصل يفحصها قبل قراءة السعر.

**غلطة شائعة:** استخدام `filter` ثم كتابة `.price`؛ `filter` بيرجّع array مش object.

<details><summary>سؤال إنترفيو: الفرق بين find وfilter؟</summary>

`find` يرجّع أول عنصر مطابق أو undefined. `filter` يرجّع array بكل المطابقات، وممكن تكون فاضية. اختار حسب شكل النتيجة اللي محتاجه، مش حسب الاسم الأسهل.

</details>

## 3. سؤال: إزاي أعرض منتجات القسم والفرع المتاحين بس؟

**مقتطف فعلي** داخل `MenuPage`:

```jsx
const filteredItems = useMemo(() => items.filter((item) => {
    const option = branchOption(item, selectedBranchId);
    return item.category_slug === activeCategory && option?.is_available;
}), [items, activeCategory, selectedBranchId]);
```

**شرح كل سطر:**

1. `const filteredItems` اسم النتيجة. `useMemo` يحفظ نتيجة الحساب طالما dependencies متغيرتش. الدالة `() =>` ترجع نتيجة `items.filter`، والأخيرة تمر على كل منتج.
2. نجيب بيانات المنتج في الفرع الحالي بالدالة اللي فهمناها. `option` ممكن تكون `null`.
3. نرجع شرطين: `category_slug === activeCategory` يعني المنتج تابع للقسم المختار، و`&&` يعني **لازم كمان** يكون متاحًا. `option?.is_available` يمنع محاولة قراءة الخاصية من `null`.
4. نقفل `filter` ثم نحدد dependencies: لو قائمة المنتجات أو القسم أو الفرع تغير، الحساب يتعاد. `[]` هنا مش قائمة منتجات؛ دي قائمة اعتماديات الـ Hook.

**التطبيق اليدوي:** افتح `MenuPage` وحدد مكان المقتطف. متكتبش `useMemo` جوه `if` أو handler؛ الـ Hooks مكانها أعلى المكوّن. في صفحة المنيو اختار فرع، ثم بدّل الفئة. المتوقع إن المنتجات المعروضة تحقق الشرطين؛ لو مفيش مطابقات تشوف empty state، مش error.

**تجربة صغيرة:** في نسخة تدريبية فقط احذف شرط الفئة وشوف المنتجات المتاحة من فئات مختلفة. رجّعه بعدها. الهدف تعرف كل شرط بيمنع إيه، مش تعديل التطبيق النهائي عشوائيًا.

**غلطة شائعة:** نسيان `return` داخل callback ذات `{}`؛ ساعتها كل النتائج تتعامل كأنها غير مطابقة. و`useMemo` مش مسؤول عن صحة الفلترة؛ `filter` هي اللي بتحسبها.

<details><summary>سؤال إنترفيو: useMemo لازم لكل filter؟</summary>

لأ. هو أداة لتقليل حسابات متكررة، مش شرط لعمل الكود ولا بديل عن state. خزن البيانات الأصلية، واشتق منها القائمة بدل تخزين نسختين ممكن يختلفوا.

</details>

## 4. سؤال: إزاي أزود كمية منتج من غير ما أعدّل المصفوفة القديمة؟

**مقتطف فعلي** داخل `Cart`:

```jsx
const updateItem = (id, changes) => {
    const next = cartItems.map((item) => item.id === id ? { ...item, ...changes } : item);
    setCartItems(next);
    writeCart(next);
};
```

1. تعريف arrow function بمدخلين: معرّف المنتج، وobject بالتغييرات المطلوبة.
2. `map` تعمل array جديدة بنفس عدد العناصر. لكل `item` بنسأل `item.id === id`. علامة `?` تفصل نتيجة تحقق الشرط عن البديل بعد `:`. لو مطابق، `{ ...item, ...changes }` ينشئ object جديد: انسخ القديم، ثم اكتب التغييرات فوق الخصائص المتشابهة. لو مش مطابق، رجّع نفس العنصر بدون تغيير.
3. حدّث React state؛ ده اللي يطلب إعادة عرض الواجهة.
4. احفظ النسخة الجديدة في المتصفح وأبلغ المستمعين، زي ما هنشوف في السؤال التالي.
5. نهاية تعريف الدالة.

**مثال مبسّط من زر الزيادة في نفس الصفحة:** اكتب مكان زر الكمية في نسخة تدريبية؛ لازم `item` يكون داخل `cartItems.map` والدالة السابقة موجودة:

```jsx
<button type="button" onClick={() => updateItem(item.id, { quantity: item.quantity + 1 })}>
    +
</button>
```

السطر الأول يربط الضغط بدالة مؤجلة: ابعت ID وobject فيه الكمية القديمة زائد واحد. السطر الثاني نص الزر. الثالث يقفل العنصر. `type="button"` يمنع إرسال فورم بالغلط.

**تطبيق:** أضف منتجًا للسلة، واضغط `+` ثم refresh. **المتوقع:** الكمية تزيد وتفضل محفوظة. **غلطة شائعة:** `item.quantity++` وتوقّع React يحدّث تلقائيًا؛ هنا لازم تحديث state واضح، مش تعديل object قديم.

<details><summary>سؤال إنترفيو: ليه spread بعد item؟</summary>

في `{ ...item, ...changes }` آخر قيمة لنفس المفتاح تكسب. لو عكست الترتيب، الكمية القديمة من item ممكن تغطي الجديدة. النسخ هنا shallow، مش نسخ عميق لكل objects الداخلية.

</details>

## 5. سؤال: السلة بتتحفظ فين، وإجماليها بيتحسب إزاي؟

**مقتطف فعلي** من `Cart.jsx` و`MenuPage.jsx`:

```js
function writeCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event(CART_EVENT_NAME));
}
```

1. دالة تستقبل array السلة.
2. `JSON.stringify` يحوّلها لنص؛ `localStorage.setItem` يخزّن النص تحت المفتاح المتفق عليه. المفتاح الحالي `wtc_cart`، أو `wtc_demo_cart` في الديمو.
3. `new Event` ينشئ حدثًا باسمه المتفق عليه، و`dispatchEvent` يرسله في التبويب نفسه علشان Navbar يعمل recount. الكتابة في التخزين وحدها مش React state، وحدث `storage` التلقائي لا يخبر نفس المستند اللي كتب.
4. نهاية الدالة. ده تخزين browser، مش إرسال إلى Laravel.

**مقتطف فعلي** لحساب المجموع الفرعي:

```jsx
const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0), [cartItems]);
```

السطر الوحيد بيحسب قيمة مشتقة: `reduce` تجمع قيمة كل سطر. `sum` المجموع المتراكم، `item` العنصر الحالي. نضرب السعر في الكمية ثم نجمعه. `Number` يحوّل الأرقام النصية لأرقام؛ `|| 0` بديل للقيم falsy، لكنه مش تحقق شامل ضد بيانات تالفة. الصفر بعد callback هو بداية المجموع. `[cartItems]` يعيد الحساب عند تغيّر مرجع السلة.

**تطبيق يدوي:** في Console اكتب:

```js
const cart = [{ price: 50, quantity: 2 }, { price: 30, quantity: 1 }];
console.log(cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
```

الأول بيانات تدريبية، والثاني يجمعها. **المتوقع: `130`**؛ ده subtotal، قبل رسوم التوصيل في المشروع.

**غلطة شائعة:** اعتبار السعر المحفوظ موثوقًا. أي مستخدم يقدر يغيّره؛ backend الحقيقي لازم يستخدم سعر قاعدة البيانات.

<details><summary>سؤال إنترفيو: localStorage مكان مناسب لكلمات السر أو إثبات صلاحيات؟</summary>

لأ. بيانات المتصفح قابلة للقراءة والتعديل من JavaScript، ومش مصدر ثقة للسيرفر. هنا بنستخدمها لسلة وتجربة مستخدم؛ التخويل والتسعير النهائي لازم على backend.

</details>

## 6. سؤال: عايز وظيفة كل method ومدخلها وناتجها في المثال؟

### `useMemo(callback, dependencies)` مش هي اللي بتفلتر

```js
const filteredItems = useMemo(() => items.filter((item) => {
    const option = branchOption(item, selectedBranchId);
    return item.category_slug === activeCategory && option?.is_available;
}), [items, activeCategory, selectedBranchId]);
```

- `useMemo` Hook جاهزة من React. المدخل الأول دالة **بتحسب وترجّع نتيجة**. المدخل الثاني قائمة القيم اللي النتيجة معتمدة عليها.
- ناتج `useMemo` هو ناتج دالة الحساب نفسها: هنا array المنتجات المطابقة. مش دالة، ومش setter.
- في أول حساب React تنادي الدالة. في renders التالية تقدر تستخدم النتيجة المحفوظة لو الاعتماديات متساوية بـ `Object.is`. دي أداة تحسين، مش ضمان إن الدالة هتتنفذ مرة واحدة للأبد.
- `items.filter(callback)` method JavaScript. تنادي callback على كل عنصر وتكوّن array جديدة من العناصر اللي نتيجة اختبارها truthy. لا تمسح من `items` ولا تنسخ objects بعمق.
- مدخل callback اسمه `item`، وهو المنتج الحالي. `return` بتاع callback هو قرار قبول المنتج، مش السعر ولا اسم المنتج.
- `branchOption(item, selectedBranchId)` دالة المشروع، مش JavaScript method. تستقبل object المنتج ومعرّف الفرع، وترجع object خيار الفرع أو `null`. تنفيذها موجود في السؤال 2؛ معناها مش هنخمنه من الاسم.
- `find` جوه `branchOption` تقف عند أول تطابق؛ `filter` هنا تكمل على كل المنتجات. السبب إن المنتج له **خيار واحد نحتاجه** للفرع، والمنيو محتاج **قائمة منتجات متعددة**.
- `Number(value)` دالة تحويل جاهزة: `Number('2')` تساوي `2`، و`Number('bad')` تساوي `NaN`. التحويل مش validation، و`NaN` مش هيساوي ID صالح.

**اختبار ورقي:** القسم `pizza` والفرع `2`. منتج قسمه `pizza` وخياره متاح → يبقى في النتيجة. منتج `drinks` متاح → يتشال من نتيجة الفلترة. منتج `pizza` بلا خيار فرع → `option` تساوي null، فالتعبير يرجع falsy ويتشال. البيانات الأصلية لا تتغيّر.

### `map(callback)` و`setCartItems(next)`

```js
const next = cartItems.map((item) => {
    return item.id === id ? { ...item, ...changes } : item;
});
setCartItems(next);
```

دي نفس فكرة السؤال 4 بس فكّينا arrow function لسطرين. `map` تستقبل دالة تحويل؛ الناتج اللي callback ترجّعه يتحط في نفس موضع العنصر داخل array جديدة. مثال `[{id:1,quantity:1}]` مع `id=1` و`changes={quantity:3}` ينتج `[{id:1,quantity:3}]`.

`map` لا تعتبر `false` معناها احذف العنصر؛ هتحط `false` نفسه في القائمة. الحذف المناسب بفكرة شرط هو `filter`.

`setCartItems` دالة React عطاهالنا `useState`؛ مدخلها هنا array جديدة، وبتطلب تحديث الحالة والعرض. عائد setter هو `undefined`، مش السلة الجديدة. لو طبعت `cartItems` فورًا بعدها في نفس handler هتشوف snapshot التنفيذ الحالي، مش وعد إن المتغير اتبدّل لحظيًا.

### `reduce(callback, initialValue)` بتطلع رقم من قائمة

```js
const total = [
    { price: 50, quantity: 2 },
    { price: 30, quantity: 1 },
].reduce((sum, item) => sum + item.price * item.quantity, 0);
```

- `reduce` method JavaScript لتجميع عناصر في نتيجة واحدة؛ مش لازم النتيجة تكون رقم دائمًا، لكن ده احتياجنا هنا.
- أول مدخل callback تستقبل المجموع الحالي `sum` والعنصر الحالي `item`.
- تاني مدخل `0` هو قيمة بداية `sum`، وبيخلي القائمة الفاضية نتيجتها صفر بدل خطأ بدون initial value.
- أول دورة ترجع `0 + 50 * 2` يعني `100`. دي تبقى sum للدورة التالية.
- تاني دورة ترجع `100 + 30 * 1` يعني `130`. دي نتيجة reduce النهائية في `total`.

## 7. سؤال: `csrfFetch` أصلها إيه، والبيانات بتكمل في أي ملف؟

دي **دالة كتبناها للمشروع** في `resources/js/lib/api.js`؛ اسمها لا يعني إنها بتعمل fetch تلقائيًا من React. لازم حد يناديها. `CatalogContext.jsx` يستوردها ويناديها داخل `reload`.

الرحلة الحقيقية في الوضع غير الديمو، باختصار واضح:

```text
CatalogProvider يتركّب
→ effect ينادي reload()
→ reload تنادي csrfFetch('/api/menu')
→ api.js ينفّذ fetch
→ Laravel MenuController يرجّع JSON
→ api.js يفك JSON ويرجع object
→ reload تعمل setCatalog(object)
→ MenuPage تقرأ items من useCatalog()
→ filter تختار المنتجات، وmap تعرضها
```

### أول حلقة: `reload` بتبدأ منين؟

**مقتطف فعلي** من CatalogContext، بعد تعريف `reload` الموضحة في السؤال 1:

```jsx
useEffect(() => {
    reload();
}, [reload]);
```

- `useEffect` Hook من React تربط المكوّن بأثر جانبي؛ هنا طلب بيانات. تستقبل دالة إعداد، وبعدها dependencies.
- `reload()` دالتنا المعرّفة بـ `useCallback(async () => {...}, [])`. استدعاؤها يرجّع Promise لأنها async؛ هي نفسها بتتعامل مع النجاح والفشل داخل try/catch.
- `useCallback` تستقبل دالة وdependencies وترجع الدالة بمرجع محفوظ طالما الاعتماديات لم تتغير؛ **لا تناديها**. effect هي اللي بتناديها هنا.
- `[reload]` معناها أعد توصيل الأثر لو مرجع الدالة تغيّر، مش كل 7 ثواني. في تطوير StrictMode ممكن تشوف setup إضافية، فلا تعتبره ضمان طلب واحد فقط.

### تاني حلقة: نفك الجزء اللي بيرجع البيانات

**مقتطف فعلي متصل من آخر `csrfFetch`**؛ `url/options/headers` اتجهزوا قبله في نفس الدالة:

```js
const response = await fetch(url, {
    credentials: 'same-origin',
    ...options,
    headers,
});

const contentType = response.headers.get('content-type') || '';
const isJson = contentType.includes('application/json');
const payload = isJson ? await response.json() : null;

if (payload?.csrf_token) {
    document.querySelector('meta[name="csrf-token"]')?.setAttribute('content', payload.csrf_token);
}

if (!response.ok) {
    const message = payload?.message || 'Something went wrong. Please try again.';
    const error = new Error(message);
    error.payload = payload;
    throw error;
}

return payload;
```

**كل method في المقتطف:**

- `fetch(url, options)` Browser API: تستقبل العنوان وإعدادات الطلب وترجع Promise تنجح عادة بـ `Response` عند وصول headers. `await` تطلع الـ Response من الوعد؛ مش object المنيو بعد.
- `credentials:'same-origin'` يحدد إرسال credentials للـ origin نفسه. `...options` ينسخ إعدادات المنادي، و`headers` المتجهّزة في helper توضع في الآخر.
- `response.headers.get('content-type')` تقرأ header باسمه وترجع نصًا أو `null`. `|| ''` يضمن نصًا بدل null.
- `contentType.includes('application/json')` method للنص، ترجع `true` لو يحتوي الجزء ده؛ مثال `'application/json; charset=utf-8'` ينتج true.
- `response.json()` تقرأ جسم الرد وتفسّره JSON، وبترجع Promise للبيانات. ممكن ترفض لو JSON غير صالح. لو الرد مش JSON، الكود هنا يختار `null`.
- `document.querySelector(selector)` تجيب أول عنصر يطابق CSS selector، أو null. هنا بندوّر على meta token، مش عنصر منتج.
- `setAttribute('content', token)` تغيّر قيمة attribute داخل الـ meta. ترجع undefined؛ وظيفتها تجهيز token الطلبات التالية لو السيرفر بعت token جديدة. `?.` يمنع النداء لو meta مش موجودة.
- `response.ok` **خاصية Boolean مش method**؛ true عادة لرموز HTTP من 200 إلى 299. fetch نفسها مش بترفض لمجرد 404 أو 422، علشان كده الفحص ده موجود.
- `new Error(message)` يبني object خطأ؛ `throw error` يخرج من المسار الطبيعي ويرفض Promise الدالة async. `catch` في reload يستقبله.
- `return payload` ترجع object البيانات عند النجاح، **مش Response ولا HTML**. في `reload` نسمّي نفس النتيجة `response`؛ الاسم ده مجرد متغير اختاره المبرمج.

### آخر حلقة: من الرد إلى المنتج الظاهر

**مثال عرض مبسّط** من MenuPage، يفترض إن `filteredItems` متحسبة بالكود السابق، داخل return المكوّن:

```jsx
<section>
    {filteredItems.map((item) => (
        <article key={item.id}>
            <h2>{item.name}</h2>
        </article>
    ))}
</section>
```

`map` تستقبل دالة ترجع JSX لكل منتج، وترجع array عناصر React تعرضها. الأقواس `(...)` بعد السهم ترجع التعبير تلقائيًا؛ لو استبدلتها بـ `{...}` لازم `return` بنفسك. `key` هوية ثابتة للعنصر في القائمة، و`item.name` الاسم الجاي من JSON.

**في static demo:** أول `csrfFetch` تفحص `VITE_DEMO_MODE`؛ لو `'true'` تنفّذ dynamic `import('../demo/api')` وتعمل `return demoFetch(url, options)`. `import()` ترجع Promise بالـ module، و`demoFetch` دالة مشروع للمحاكاة المحلية. ساعتها مفيش Laravel endpoint في الرحلة؛ شكل البيانات موحّد علشان بقية الواجهة تكمل بنفس المنطق. اقرأ [الحجز والدفع](08-checkout-and-payment.md) للطلبات التي تكتب بيانات، ومتخلطش demo مع backend حقيقي.

**النتيجة اللي تختبرها بإيدك:** في الوضع المحلي الحقيقي افتح Network ثم Menu. دور على `GET /api/menu` وافتح Response؛ خد اسم منتج وقارنه بالكارت المعروض. لو الطلب فشل، `catch` تضبط error و`finally` تطفّي loading، فتظهر رسالة المحاولة بدل قائمة غير موجودة.

بعد ما تقدر تشرح الخمسة بدون حفظ: انتقل إلى [الحجز والدفع](08-checkout-and-payment.md)، ثم [Navbar وتزامن العدد](11-app-navbar-footer-and-styles.md).
