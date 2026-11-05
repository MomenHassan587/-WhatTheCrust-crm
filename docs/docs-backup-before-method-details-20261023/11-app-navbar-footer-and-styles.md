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

**ملخص للمذاكرة:** اختيار component بالـ Router، مشاركة data بالـ Context، تغييرات UI بـ state/props، والـ side effects تتنضف. CSS مجرد import في رحلة التشغيل دي؛ دراسة قواعده الطويلة مش شرط لفهم الأمثلة.
