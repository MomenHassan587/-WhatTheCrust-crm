# أسئلة وتمارين: تشغيل التطبيق والـ Navbar والـ Footer

المشروع: **pizza-crm يستخدم React، وautocare-booking يستخدم Vue**. قبل الملف: [قاموس الأساسيات](01-glossary.md). هنا نشرح JavaScript/JSX وVue فقط؛ مش هنحفظ CSS طويل. المصادر: [app.jsx](../resources/js/app.jsx)، [Blade](../resources/views/app.blade.php)، [Navbar](../resources/js/Components/Navbar.jsx)، [Footer](../resources/js/Components/Footer.jsx).

**سؤال البداية:** أي ملف يشغّل الواجهة؟ في pizza الملف النشط `app.jsx`، مش `app.js`. ملفات `.jsx` تتعالج بواسطة Vite/React plugin، وملفات `.vue` بواسطة Vue plugin في المشروع الآخر؛ المتصفح مش بيقرأ الصيغتين كقوالب خام.

## 1. سؤال: الواجهة بتبدأ منين بالضبط؟

**مقتطف فعلي** من `app.blade.php`:

```blade
@vite(['resources/css/app.css', 'resources/js/app.jsx'])
```

السطر يولد روابط تحميل CSS وJavaScript. `@vite` تعليمة Laravel على السيرفر، مش JavaScript بيشغله المتصفح. داخل القائمة مساران: stylesheet ومدخل React. وقت التطوير Vite يقدم الملفات، وبعد build Laravel يستخدم manifest للوصول للأسماء المبنية. ملف Blade يحتوي على `<div id="root"></div>`، وهي المساحة اللي React هيعرض فيها التطبيق.

**مقتطف فعلي** من نهاية `app.jsx`:

```jsx
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
```

1. `document` مستند HTML في المتصفح. `getElementById('root')` يجيب عنصر التركيب. `createRoot` ينشئ React root، و`render(` يبدأ عرض الشجرة داخله.
2. `StrictMode` أداة فحوصات أثناء التطوير، مش صفحة ولا حماية دخول.
3. `<App />` يشغّل المكوّن الرئيسي؛ الحرف الكبير يميّزه عن عنصر HTML عادي.
4. قفل غلاف StrictMode.
5. نهاية استدعاء render. JSX في الوسط بيتحوّل بواسطة build tool لاستدعاءات JavaScript.

**تطبيق يدوي:** افتح Blade وحدد `root` ثم ابحث عن نفس النص في app.jsx. في نسخة تدريبية لو غيرت الاسم في طرف واحد فقط، المتوقع إن التطبيق يفشل في التركيب بدل ما ينشئ العنصر تلقائيًا. رجّع الاسم فورًا.

**غلطة شائعة:** التعديل في `resources/js/app.js` القديم وتوقّع الواجهة تتغير؛ راجع entries في [vite.config.js](../vite.config.js). و`bootstrap.js` المحلي مختلف عن مكتبة تصميم Bootstrap المستوردة من npm.

<details><summary>سؤال إنترفيو: Blade وReact بيشتغلوا فين؟</summary>

Blade يتعالج على السيرفر ويرجع HTML. React يشغّل واجهة المتصفح بعد تحميل JavaScript. وجود Laravel لا يجعل Vue أو React server-rendered تلقائيًا. في الديمو الثابت يبدأ التطبيق من HTML مبني بدل تشغيل PHP.

</details>

## 2. سؤال: ليه التطبيق ملفوف بـ Providers وRouter؟

**مقتطف فعلي** من داخل `App`:

```jsx
<BrowserRouter>
    <AuthProvider>
        <CatalogProvider>
            <OrderProvider>
                <AppShell />
            </OrderProvider>
        </CatalogProvider>
    </AuthProvider>
</BrowserRouter>
```

**شرح السطور:** الأول يوفّر معلومات URL والتنقل لمكوّنات React Router. الثاني يوفّر المستخدم وحالة التحقق ودوال الدخول. الثالث يوفّر الفروع والفئات والمنتجات. الرابع يوفّر نوع الطلب والفرع والعنوان، وهو يحتاج CatalogProvider فوقه لأنه يستخدم بياناته. الخامس يرسم المكوّن المشترك اللي فيه Navbar وRoutes وFooter. السطور 6–9 تقفل الأغلفة بعكس ترتيب فتحها. `Provider` مش عنصر HTML ظاهر؛ وظيفته توصيل قيم للسلالة الداخلية.

**مقتطف فعلي** من داخل `<Routes>` في `AppShell`:

```jsx
<Route path="/menu" element={<MenuPage />} />
<Route path="/cart" element={<Cart />} />
```

كل سطر يطابق مسارًا ويحدد المكوّن اللي يظهر. `path` نص المسار، و`element={...}` تعبير JSX للمكوّن. المسارات هنا client-side؛ Laravel عند refresh يرجع shell للمسارات غير API، وبعدها React يختار الصفحة. مفيش Route catch-all لصفحة React 404 حاليًا.

**تطبيق:** من داخل `MenuPage` شوف `useCatalog()` و`useOrder()`. تتبّع كل واحد للـ Provider اللي فوقه. بعدها جرّب Menu ثم Cart من الروابط. **المتوقع:** بيانات الفرع تفضل مشتركة بدل ما كل صفحة تبدأ باختيار مستقل.

**غلطة شائعة:** نقل OrderProvider فوق CatalogProvider؛ `useCatalog` وقتها بلا provider صالح ويطلع خطأ. أو الاعتقاد إن Context يسجل البيانات في قاعدة البيانات؛ هو مشاركة بيانات داخل شجرة React، والتخزين/الشبكة أكواد منفصلة.

<details><summary>سؤال إنترفيو: props ولا Context؟</summary>

ابدأ بـ props بين أب وطفل قريبين. Context مناسب لقيم يحتاجها فروع متعددة، مثل المستخدم والطلب. مش لازم ننقل كل state له؛ الحالة المحلية زي فتح قائمة الموبايل مكانها المكوّن نفسه.

</details>

## 3. سؤال: إزاي الأب يتحكم في ظهور الـ Navbar بـ props؟

**مقتطف فعلي** من `AppShell`:

```jsx
<Navbar
    isVisible={!isHome || heroReady}
    reduceMotion={reduceMotion}
    animateReveal={isHome}
/>
```

1. بداية مكوّن Navbar.
2. `isVisible` اسم prop. `{}` تسمح بتعبير JavaScript. `!isHome` يعني إحنا مش في الرئيسية، و`||` معناها «أو». إذن النافبار يظهر لو الصفحة مش Home، أو مقدمة Home خلصت وبقت `heroReady` true. متكتبش `&&` مكان `||`؛ كده الشروط المطلوبة مختلفة.
3. تمرير تفضيل تقليل الحركة؛ الاسم على الشمال prop، وعلى اليمين متغير الأب.
4. نفعّل حركة الكشف لما تكون Home.
5. قفل الاستدعاء.

**مقتطف فعلي** من تعريف المكوّن نفسه:

```jsx
export default function Navbar({ isVisible = true, reduceMotion = false, animateReveal = false }) {
```

ده سطر افتتاح function، مش المكوّن كله: `export default` يسمح باستيراده كالتصدير الأساسي، و`Navbar` اسم المكوّن. `{ ... }` داخل الأقواس اسمها destructuring: تفك object الـ props لمتغيرات. `= true` و`= false` قيم افتراضية تستخدم لو prop غير مرسلة أو undefined؛ لو الأب مرر false صراحة، القيمة الافتراضية مش هتغيّرها.

**تطبيق يدوي:** احسب التعبير ذهنيًا: `isHome=true, heroReady=false` النتيجة false؛ خارج Home النتيجة true حتى لو heroReady false. في نسخة تدريبية مرّر `isVisible={false}` وشوف الـ Navbar يختفي، ثم رجّع التعبير الأصلي.

**غلطة شائعة:** `isVisible="false"` تبعت نصًا غير فاضي، والنص ده truthy مش Boolean false. استخدم الأقواس للقيمة المنطقية.

<details><summary>سؤال إنترفيو: props تتعدل من الطفل؟</summary>

لأ، عاملها كمدخلات read-only. لو محتاج تغيّر حالة الأب، نادِ callback بعتها الأب. عندنا Hero ينادي onReady، والأب يحدّث heroReady ويعيد تمرير isVisible للـ Navbar.

</details>

## 4. سؤال: ليه عداد السلة يحدث من غير refresh؟ وإيه شبهه بكود Vue؟

**مقتطف فعلي** من Navbar، بعد تعريف `syncCartCount` داخل effect:

```js
window.addEventListener('storage', syncCartCount);
window.addEventListener(CART_EVENT_NAME, syncCartCount);

return () => {
    window.removeEventListener('storage', syncCartCount);
    window.removeEventListener(CART_EVENT_NAME, syncCartCount);
};
```

السطر الأول يستمع لتغييرات التخزين من مستند آخر مناسب، مش لنفس الصفحة اللي كتبت. الثاني يستمع لحدث المشروع اليدوي داخل نفس التبويب؛ الاسم `wtc-cart-updated`. السطر الفاضي فصل. الرابع يرجع cleanup للـ effect. الخامس والسادس يزيلوا نفس الحدث ونفس مرجع الدالة. السابع يقفل cleanup. `syncCartCount` في الأصل تنادي `setCartCount(getCartCount())`، والدالة تحسب مجموع الكميات بـ reduce، مش عدد السطور.

**مثال مبسّط من** Navbar في [AutoCare App.vue](../../autocare-booking/resources/js/components/App.vue)، اكتبه في **مكوّن Vue تدريبي منفصل فقط**، مش داخل React:

```js
const navbarScrolled = ref(false);
function updateNavbar() {
    navbarScrolled.value = window.scrollY > 24;
}
onMounted(() => {
    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });
});
onBeforeUnmount(() => window.removeEventListener('scroll', updateNavbar));
```

يلزم استيراد `ref, onMounted, onBeforeUnmount` من vue داخل script setup. الأول حالة، الثاني تعريف دالة، الثالث يقارن مسافة النزول ويحدث الحالة، الرابع يقفل الدالة. الخامس يبدأ lifecycle hook؛ السادس يضبط الحالة فورًا؛ السابع يستمع للتمرير و`passive` تعلن إن المعالج مش هيمنع الحدث. الثامن يقفل hook؛ التاسع ينظف قبل الإزالة.

**تطبيق:** تتبّع add/remove بنفس اسم الدالة في المشروعين. **المتوقع:** لا تراكم listeners بعد خروج/رجوع. **غلطة شائعة:** استخدام arrow function جديدة في remove؛ مش نفس المرجع، فلا تلغي القديمة.

<details><summary>سؤال إنترفيو: التشابه الأساسي بين React وVue هنا؟</summary>

إعداد listener عند تركيب المكوّن وتنظيفه عند إزالته. React effect يرجع cleanup؛ Vue يستخدم onMounted وonBeforeUnmount. طريقة state مختلفة، لكن JavaScript وBrowser Event API نفسهم.

</details>

## 5. سؤال: الـ Footer جاب الفروع منين وإزاي يعرضهم؟

النسخة الحالية مش قائمة عناوين hard-coded زي المذكرة القديمة. **مقتطف فعلي** داخل `Footer`:

```jsx
const { branches, loading, error } = useCatalog();
```

السطر يفك object ناتج Hook: `branches` البيانات، `loading` حالة التحميل، `error` رسالة الفشل. أسماء المتغيرات مطابقة لمفاتيح الـ object. ده نفس CatalogProvider اللي تستخدمه المنيو؛ مصدر واحد بدل نسخ الفروع في كل صفحة.

**مثال مبسّط من Footer:** ضع الجزء داخل return لمكوّن React تدريبي يستخدم Hook السابق وموجود تحت CatalogProvider:

```jsx
<footer>
    {loading && <p>Loading locations...</p>}
    {!loading && error && <p>Locations are temporarily unavailable.</p>}
    {!loading && !error && branches.map((branch) => (
        <section key={branch.id}>
            <h2>{branch.name}</h2>
            <p>{branch.opening_hours || 'Opening hours coming soon'}</p>
        </section>
    ))}
</footer>
```

1. عنصر Footer.
2. `&&` يعرض رسالة لما loading تكون true.
3. بعد انتهاء التحميل، لو فيه error، يعرض الفشل.
4. لو لا تحميل ولا خطأ، `map` تحول كل فرع لعنصر واجهة. `branch` اسم العنصر الحالي، و`(` لرجوع JSX ضمنيًا بدون `return`.
5. `key` ثابت وفريد لكل فرع؛ مش prop معمول علشان يظهر كنص.
6. عرض الاسم داخل `{}`.
7. عرض مواعيد العمل أو نص بديل لما القيمة falsy.
8. نهاية section.
9. قفل callback وmap والتعبير.
10. نهاية footer.

**تطبيق:** اكتب المثال في نسخة تدريبية وغيّر النص البديل فقط. **المتوقع:** المواعيد الحقيقية لا تتأثر؛ الفارغة فقط تعرض البديل. لو الفروع فاضية، map لا تعرض أقسامًا.

**غلطة شائعة:** الخلط بين `map` و`forEach` داخل JSX؛ map يرجّع array العناصر، لكن forEach يرجّع undefined. روابط السوشيال في الأصل تشير حاليًا إلى `/`، يعني placeholders مش حسابات جاهزة.

<details><summary>سؤال إنترفيو: ليه مفتاح ID أحسن من index؟</summary>

الـ ID يتبع هوية الفرع لو تغير الترتيب، فيحافظ React على ارتباط العنصر بحالته الصحيحة. index قد يربط الحالة بفرع مختلف بعد إضافة أو حذف. استخدم مفتاحًا مستقرًا وفريدًا بين الإخوة.

</details>

## 6. سؤال: عايز أكمل مثال عداد السلة من الملف اللي كتب لحد الرقم الظاهر؟

### الملف الأول: `Pages/MenuPage.jsx` — كتابة السلة

القيمتان الفعليتان المشتركتان في الملفين:

```js
const CART_STORAGE_KEY = import.meta.env.VITE_DEMO_MODE === 'true'
    ? 'wtc_demo_cart'
    : 'wtc_cart';
const CART_EVENT_NAME = 'wtc-cart-updated';
```

- `import.meta.env` إعدادات يوفّرها Vite للكود؛ القيمة المقارنة هنا نص `'true'`، مش Boolean true.
- التفرع يختار مفتاح تخزين مستقل للديمو. الاسم لازم يتطابق في كاتب السلة وقارئها.
- `CART_EVENT_NAME` اسم حدث اتفقنا عليه في المشروع، مش حدث browser جاهز.

**الكود الفعلي اللي MenuPage بتستخدمه بعد حساب `next` داخل `addToCart`:**

```js
function writeCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event(CART_EVENT_NAME));
}
```

كل method ووظيفتها:

- `writeCart(cart)` دالة كتبناها؛ مدخلها array السلة، ومفيش return صريح، فعائدها undefined. دي مش دالة JavaScript جاهزة.
- `JSON.stringify(cart)` دالة جاهزة تحوّل البيانات لنص JSON. مثال `[{quantity:2}]` يصبح نصًا `'[{"quantity":2}]'`. مش حفظ في حد ذاتها.
- `localStorage.setItem(key, text)` Browser method تكتب نصًا تحت مفتاح في تخزين الـ origin الحالي. ترجع undefined، وممكن ترمي خطأ لو التخزين مرفوض أو ممتلئ. الكتابة هنا مش React state.
- `new Event(CART_EVENT_NAME)` ينشئ Event object يحمل اسم الحدث؛ لا يرسله وحده، ولا يحمل بيانات السلة في هذا التنفيذ.
- `window.dispatchEvent(event)` يرسل الحدث للـ listeners المسجّلة على window بشكل متزامن. ترجع Boolean عن عدم إلغاء الحدث، لكننا مش بنستخدم عائدها هنا. مفيش طلب HTTP في السطر.

### الملف التاني: `Components/Navbar.jsx` — قراءة الكميات

**الدالة الفعلية:**

```js
function getCartCount() {
    try {
        const savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
        return savedCart.reduce((total, item) => total + Number(item.quantity || 0), 0);
    } catch {
        return 0;
    }
}
```

- `getCartCount()` دالتنا، بلا مدخلات؛ تعتمد على مفتاح التخزين أعلى الملف. ترجع رقم مجموع الكميات أو صفر لو حصل خطأ.
- `localStorage.getItem(key)` تجيب النص المخزّن أو null لو المفتاح مش موجود؛ `|| '[]'` بديل نص JSON لقائمة فاضية.
- `JSON.parse(text)` تحوّل النص لبيانات JavaScript؛ عكس stringify. نص `'[{"quantity":2}]'` يرجع array فيها object. JSON تالف يرمي exception فتشتغل catch.
- `savedCart.reduce(callback, 0)` تلف على العناصر وتراكم مجموعًا يبدأ بصفر. callback تاخد `total` المجموع السابق و`item` الحالي، وترجع مجموع الدورة الجديدة.
- `Number(item.quantity || 0)` تحوّل الكمية لرقم؛ `'2'` تصبح `2` علشان الجمع مش يوصل لنص زي `'02'`. لو بيانات غير رقمية، Number ممكن تنتج NaN؛ ده مش تحقق شامل من صحة السلة.
- في سلة فيها كميتان `2` و`3`: الدورة الأولى `0 + 2 = 2`، والتانية `2 + 3 = 5`، فالدالة ترجع `5`؛ مش عدد السطور `2`.
- `catch { return 0; }` تحمي العرض من أخطاء القراءة/التحليل، لكنها لا تصلّح البيانات التالفة في التخزين تلقائيًا.

**الحالة والاشتراك الفعليان داخل Navbar:**

```jsx
const [cartCount, setCartCount] = useState(getCartCount);

useEffect(() => {
    const syncCartCount = () => {
        setCartCount(getCartCount());
    };

    window.addEventListener('storage', syncCartCount);
    window.addEventListener(CART_EVENT_NAME, syncCartCount);

    return () => {
        window.removeEventListener('storage', syncCartCount);
        window.removeEventListener(CART_EVENT_NAME, syncCartCount);
    };
}, []);
```

- `useState(getCartCount)` تمرّر دالة initializer بدون `()`؛ React تناديها لقراءة الحالة الابتدائية، مش كل render. في StrictMode التطوير ممكن initializer تتنادى إضافيًا لفحص النقاء.
- `useState` ترجع `[القيمة, setter]`؛ `cartCount` رقم و`setCartCount` دالة تحديث. setter ترجع undefined وتطلب render جديد.
- `useEffect(setup, [])` تستقبل دالة إعداد أثر جانبي وقائمة اعتماديات فاضية. الاشتراك هنا لا يعتمد على state متغيّرة؛ مش محتاجين إعادة توصيله مع كل تحديث رقم.
- `syncCartCount` دالة محلية كتبناها داخل effect؛ تقرأ أحدث التخزين **وقت الحدث** ثم تمرّر الرقم للـ setter. عائدها مش مستخدم.
- `addEventListener(type, callback)` تسجّل دالة لنوع حدث؛ ترجع undefined. المتصفح يمرر Event للدالة، لكن syncCartCount لا تحتاج مدخلاته.
- `'storage'` حدث browser لتغيير التخزين من مستند آخر مناسب؛ مع localStorage غالبًا تبويب آخر لنفس الـ origin. لا ينطلق في نفس المستند الذي كتب.
- الحدث المخصص هو اللي يسمح لنفس التبويب يعرف الكتابة فورًا.
- `return () => {...}` يرجّع دالة تنظيف إلى React؛ لا يشغّلها فورًا. React تناديها عند الإزالة، وفي دورة فحص إضافية بالتطوير عند StrictMode.
- `removeEventListener` تستخدم اسم الحدث **ونفس مرجع callback** لإلغاء الاشتراك، وترجع undefined. كتابة `() => syncCartCount()` جديدة مش نفس المرجع.

### آخر حلقة: عرض الرقم

**مقتطف فعلي من JSX:**

```jsx
{cartCount > 0 && (
    <span className="wtc-cart-badge">
        {cartCount > 99 ? '99+' : cartCount}
    </span>
)}
```

- `cartCount > 0` ينتج Boolean؛ لو false لا يظهر badge. استخدمنا مقارنة، مش `cartCount && ...` اللي قد تعرض صفرًا.
- `? :` تختار النص `'99+'` لو العدد كبير، أو الرقم نفسه لو أقل.
- دي قراءة state في JSX؛ React تحدّث النص لما setter تطلب عرضًا بالقيمة الجديدة.

**جرّب سلسلة واحدة:** أضف منتجًا كميته 1 ثم زوّد منتجًا آخر كميته 2. الكتابة تسبق dispatchEvent، فيقرأ listener السلة الجديدة، وreduce ترجع 3، وbadge تعرض 3. لو فتحت تبويبًا آخر لنفس الموقع ووصل حدث storage، بيستخدم نفس القارئ لتحديث العداد هناك.

## 7. سؤال: methods تشغيل التطبيق والـ Context بتعمل إيه تحديدًا؟

- `document.getElementById('root')`: Browser method، مدخلها ID كنص بدون `#`، وناتجها عنصر DOM أو null. مش بتنشيء العنصر لو مش موجود.
- `ReactDOM.createRoot(element)`: من React DOM؛ تستقبل عنصر تركيب حقيقي وترجع root object. يلزم إن العنصر موجود.
- `root.render(<App />)`: method على root، تستقبل شجرة React وتطلب عرضها في العنصر. عائدها undefined، مش HTML string.
- `useCatalog()`: Hook كتبناها في CatalogContext، بلا مدخلات، ترجع object `branches/categories/items/loading/error/reload` من أقرب Provider. مش fetch جديدة في كل Footer.
- `useContext(CatalogContext)`: Hook React تستقبل context object وترجع القيمة الحالية من أقرب Provider، أو default اللي اتحدد عند إنشاء الـ context.
- `createContext(null)`: تستقبل default value وترجع context object، مش قائمة منتجات. الـ Provider يبعت القيمة الحقيقية لاحقًا.
- `useLocation()`: من React Router، ترجع object مسار حالي، مثل `pathname:'/menu'` و`hash:''`. مش بتعمل navigation.
- `useNavigate()`: من React Router، ترجع دالة تنقّل. استدعاء `navigate('/cart')` يطلب انتقال router للمسار من غير إعادة تحميل مستند كاملة في التنقل المعتاد، مش طلب حفظ سلة.
- `location.pathname.startsWith('/menu')`: method نص ترجع Boolean؛ `/menu/pizza` ينتج true و`/cart` ينتج false. هي فحص بادئة، مش تطابق route أمني.
- `['staff','admin'].includes(role)`: method array ترجع Boolean لوجود role بالقائمة. لو `role='customer'` النتيجة false. ده قرار عرض؛ حماية API لازم في Laravel.
- `Number(value).toFixed(2)`: الأولى تحوّل الرقم النصي لرقم؛ الثانية method Number تنتج **نصًا** بمنزلتين، مثل `12.5` → `'12.50'`. ده تنسيق عرض، مش عملية تأمين حسابات مالية.
- `text.trim()`: method نص ترجع نصًا جديدًا بدون المسافات في أول وآخر النص، مثل `' Cairo '` → `'Cairo'`. لا تغيّر النص الأصلي ولا تحذف المسافات بين كلمتين.

**ملخص للمذاكرة:** اختيار component بالـ Router، مشاركة data بالـ Context، تغييرات UI بـ state/props، والـ side effects تتنضف. CSS مجرد import في رحلة التشغيل دي؛ دراسة قواعده الطويلة مش شرط لفهم الأمثلة.
