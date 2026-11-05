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

بعد ما تقدر تشرح الخمسة بدون حفظ: انتقل إلى [الحجز والدفع](08-checkout-and-payment.md)، ثم [Navbar وتزامن العدد](11-app-navbar-footer-and-styles.md).
