# أسئلة كود: أربط المنتج بصورته إزاي؟

[الفهرس](00-start-here.md) · الأساس: object وpath وmap. صور الأصول وحقوقها ما اتغيّرتش في شغل الدراسة.

## سؤال 1: أحط محتوى الصورة في DB ولا مسارها؟

في المشروع ده بنخزّن مسار الصورة. **مثال تدريبي إضافي**:

```js
const product = {
    id: 1,
    name: 'Diavola',
    image_path: '/images/menu/diavola.webp',
};
console.log(product.image_path);
```

1. object لبيانات المنتج؛ مش سجل DB حقيقي بالـid ده.
2. معرّف تدريبي؛ ما تربطوش بمنتج حقيقي لمجرد تشابه رقم id.
3. الاسم المعروض.
4. URL بالنسبة لأصل الموقع؛ يبدأ slash مش مسار Windows.
5. نهاية object.
6. اطبع المسار للتأكد من البيانات.

**`console.log(value)`** method من أدوات المتصفح/Node، تأخذ القيمة وتعرضها في Console وترجع undefined. هي لا ترفع صورة ولا تحفظ في DB. `product.image_path` قراءة خاصية object، مش method ولا تحميل ملف بحد ذاته؛ التحميل يبدأ لما المتصفح يستخدمها في src.

الملف الفعلي لهذا المسار يكون تحت `public/images/menu/diavola.webp`. المتصفح لا يكتب public في URL.

**بإيدك:** افتح `/images/menu/diavola.webp` من نفس أصل موقع Pizza المحلي. المتوقع الصورة لو الملف موجود ومتقدم من السيرفر.

**غلطة شائعة:** `D:\...` أو `/public/images/...` في src؛ ده مش URL الصورة في إعداد المشروع المعتاد.

**سؤال إنترفيو:** مسار الملف المحلي هو نفس URL؟

<details><summary>الإجابة</summary>لأ؛ السيرفر بيربط public root بمسارات URL؛ المتصفح يحتاج عنوانًا يقدر يطلبه.</details>

المصدر: [MenuCatalogSeeder](../database/seeders/MenuCatalogSeeder.php)، [MenuPage](../resources/js/Pages/MenuPage.jsx).

## سؤال 2: أعمل mapping للأسماء بدل التخمين؟

**مثال تدريبي إضافي** بنفس أسماء أصول التقرير القديم:

```js
const photoMap = {
    Diavola: '/images/menu/diavola.webp',
    Carnivora: '/images/menu/carnivora.webp',
};
const photo = photoMap['Diavola'] ?? null;
console.log(photo);
```

1. قاموس مفاتيحه أسماء والقيم مسارات.
2–3. كل منتج له مسار معروف، بدل اختيار صورة عشوائية.
4. نهاية القاموس.
5. `[]` قراءة خاصية بالاسم؛ `??` تستخدم null لو القيمة null أو undefined.
6. يطبع مسار Diavola.

**مهم في كلمة mapping:** `photoMap` هنا اسم object اخترناه إحنا؛ ده مش استدعاء `.map()` الخاصة بالـ array. `photoMap['Diavola']` عملية قراءة خاصية، و`??` عامل في JavaScript مش method. لو المفتاح مفقود، القراءة ترجع undefined ثم نختار null.

### من الاسم للصورة المعروضة — نكمّل مثال القاموس

**مثال React تدريبي متصل، مش بديل لتخزين image_path الحقيقي في DB:**

```jsx
const photoMap = {
    Diavola: '/images/menu/diavola.webp',
    Carnivora: '/images/menu/carnivora.webp',
};
const products = [
    { id: 1, name: 'Diavola' },
    { id: 2, name: 'Missing' },
];

function ProductPhotos() {
    return (
        <section>
            {products.map((product) => {
                const photo = photoMap[product.name] ?? null;
                return (
                    <article key={product.id}>
                        <h2>{product.name}</h2>
                        {photo
                            ? <img src={photo} alt={product.name} />
                            : <p>Photo coming soon</p>}
                    </article>
                );
            })}
        </section>
    );
}
```

- `ProductPhotos()` مكوّن إحنا كتبناه؛ بلا props هنا ويرجع JSX.
- `products.map(callback)` Array method جاهزة؛ كل callback تأخذ product وترجع JSX لمنتج واحد. map ترجع array العناصر المعروضة، ومش بتغيّر products.
- `photoMap[product.name]` تستخدم الاسم الحالي كمفتاح. المنتج الأول يلاقي URL، والثاني لا يلاقي قيمة.
- ternary `photo ? ... : ...` تختار img أو فقرة. مجرد إيجاد النص لا يضمن إن الملف موجود؛ معالجة فشل التحميل تتم بـ onError كما في الدرس التالي.

لو عايز تجرب المكوّن في ملف، صدّره أو اعرض `<ProductPhotos />` من مكوّن الأب؛ تعريف function وحده لا يعرضها.

**بإيدك:** جرّب اسم Missing. المتوقع null؛ اعرض placeholder بدل تخمين صورة.

**غلطة شائعة:** اختلاف spelling أو case. في الأنظمة الفعلية يفضّل الربط بهوية منتج ثابتة أو حقل واضح في DB، مش الاسم المتغيّر فقط.

**سؤال إنترفيو:** ليه `??` مش بالضبط زي `||`؟

<details><summary>الإجابة</summary>?? تستخدم البديل فقط مع null/undefined؛ || تستخدمه مع كل falsy مثل 0 أو نص فاضي كمان.</details>

## سؤال 3: أحتفظ بالتوثيق القديم إزاي؟

الجدول التالي **مرجع mapping تاريخي من الملف الأصلي**، مش نتيجة إعادة فحص صور أو مواقع خارجية الآن:

| الأصل | المنتج | النسخة المحسّنة |
| --- | --- | --- |
| Diavola.jpg | Diavola | diavola.webp |
| Quattro formmage.jpg | Quattro Formaggi | quattro-formaggi.webp |
| AL Pesto.jpg | Al Pesto | al-pesto.webp |
| canivora.jpg | Carnivora | carnivora.webp |
| la spaligat.jpg | La Sbagliata | la-sbagliata.webp |
| Capricciosa.jpg | Capricciosa | capricciosa.webp |
| marinara dip.webp | Marinara Dip | marinara-dip.webp |
| pesto dip.webp | Pesto Dip | pesto-dip.webp |
| impasto_al_cacao desert.webp | Impasto Al Cacao | impasto-al-cacao.webp |
| ripieno_al_nutella dessert.webp | Ripieno Al Gianduia | ripieno-al-gianduia.webp |
| tirmaso.webp | Tiramisu | tiramisu.webp |
| Cup2.jpeg | Iced Tea | iced-tea.webp |
| garlic_bread starter.webp | Garlic Bread | garlic-bread.webp |
| mozzerella steks starter.jpg | Mozzarella Sticks | mozzarella-sticks.webp |
| unkown.webp | Montanarina، وفق التقرير القديم | montanarina.webp |

الملف الأصلي فيه كمان سلطة بأسماء عربية، ملفات سندوتشات غير مؤكدة، وملاحظات تكرار byte-for-byte ومراجع البحث القديمة. محفوظ كاملًا في [نسخة ما قبل الدراسة](../docs-backup-before-study-20261023/menu-photo-mapping.md)؛ ما تعتبرش التوثيق دليل ترخيص الصورة أو تحقق جديد من مطابقتها.

### المسار الحقيقي في المشروع، مش القاموس التدريبي

1. [MenuCatalogSeeder](../database/seeders/MenuCatalogSeeder.php) يضع image_path في بيانات المنتج. مثال فعلي في قائمة items: Diavola لها `/images/menu/diavola.webp`.
2. seeder يستخدم `DB::table('menu_items')->upsert(...)` لكتابة/تحديث السجلات. دي خطوة كتابة DB، مش شيء يحصل مع فتح كل صفحة. **اقرأها فقط؛ مش مطلوب تشغيل seeder وإعادة كتابة بياناتك.**
3. [MenuController::index](../app/Http/Controllers/Api/MenuController.php) يعيد الحقل في JSON هكذا:

```php
'image_path' => $item->image_path,
```

4. [CatalogContext](../resources/js/context/CatalogContext.jsx) يطلب القائمة بـ csrfFetch ويضع `response.items` في state. [المكتبات](libraries.md) فيها جسم المساعد والاستدعاء المتصل لو محتاج تتابعه.
5. [MenuPage](../resources/js/Pages/MenuPage.jsx) تعرض `<ProductImage item={item} />`. ده اسم المكوّن الحقيقي الحالي.

**المكوّن الفعلي كاملًا من نفس الملف:**

```jsx
function ProductImage({ item }) {
    const [failed, setFailed] = useState(false);
    if (!item.image_path || failed) {
        return <div className="menu-image-placeholder" role="img" aria-label={`${item.name} photo coming soon`}>WTC</div>;
    }
    return <img src={item.image_path} alt={item.name} loading="lazy" decoding="async" onError={() => setFailed(true)} />;
}
```

`useState` مستوردة في أول MenuPage من React؛ ترجع حالة وsetter. `setFailed(true)` تحديث للحالة، فيعيد React العرض ويختار placeholder. `loading="lazy"` طلب للمتصفح بتأجيل تحميل الصورة حسب قربها من العرض، و`decoding="async"` تلميح لفك الصورة بطريقة لا تربط عرض الصفحة بانتظارها؛ دول attributes مش دوال JS.

**المحصلة:** DB فيها string → API ترجع string → React تضع string في src → المتصفح يطلب ملف الصورة. مفيش خطوة تحوّل صورة DB إلى base64 في التدفق ده.

**بإيدك:** اختار منتجًا، تتبّع image_path من seeder أو API إلى src في ProductImage، وحدد fallback لو غابت الصورة.

**سؤال إنترفيو:** هل وجود ملفين بنفس الاسم أو الشكل يعني نفس المحتوى؟

<details><summary>الإجابة</summary>لأ؛ مقارنة hash تفحص التطابق البايتّي، أما تشابه الشكل أو صحة المنتج فمراجعة مختلفة.</details>

التالي: [التعامل مع فشل الصورة والتحقق من الرفع](product-photo-report.md).
