# أسئلة كود: صورة المنتج مش موجودة أو فشلت؟

[الفهرس](00-start-here.md) · موضوع الدرس React state + عرض شرطي + معالجة ملف في backend. مش مطلوب تذاكر تصميم الصور نفسه.

قائمة الصور الناقصة القديمة محفوظة في [التقرير الأصلي](../docs-backup-before-study-20261023/product-photo-report.md). هي snapshot وقت التقرير، مش inventory حي لقاعدة بياناتك الآن. الصور الأصلية لم يتم تغييرها أثناء تعديل ملفات الدراسة.

## سؤال 1: إزاي الواجهة تكتشف فشل الصورة؟

**مثال مبسّط** من [MenuImage في MenuPage](../resources/js/Pages/MenuPage.jsx). اكتب مكوّن تدريب مستقل؛ استورد useState:

```jsx
import { useState } from 'react';
function ProductImage({ item }) {
    const [failed, setFailed] = useState(false);
    if (!item.image_path || failed) return <p>Photo coming soon</p>;
    return <img src={item.image_path} alt={item.name} onError={() => setFailed(true)} />;
}
```

1. استيراد حالة React.
2. مكوّن يستقبل المنتج في props؛ `{ item }` تفكيكها.
3. حالة فشل تبدأ false ودالة تحديثها setFailed.
4. `!` ينفي وجود المسار؛ `||` يكفي أي شرط؛ لو مفيش صورة أو فشلت ارجع بديلًا.
5. استخدم الصورة واسم المنتج كوصف؛ onError يحدّث الحالة لو التحميل فشل، فيعيد React العرض بالبديل.
6. نهاية المكوّن.

**بإيدك:** اعرضه بمنتج صورة مساره `/missing-photo.webp`. المتوقع النص البديل، مش صورة مكسورة مستمرة. لو غيرت المنتج في نفس instance، حالة failed لا تتصفر تلقائيًا؛ استخدم key مستقرة مناسبة للمنتج أو صمّم reset مقصود.

**غلطة شائعة:** تعيد تعيين صورة معطوبة أخرى داخل onError بلا حد، فتعمل حلقة فشل.

**سؤال إنترفيو:** إيه الفرق بين alt وfallback؟

<details><summary>الإجابة</summary>alt وصف بديل للصورة، fallback قرار واجهة لعرض بديل عند غيابها أو فشلها؛ مش نفس الخاصية.</details>

## سؤال 2: الرفع من المتصفح كفاية لحماية السيرفر؟

**مقتطف فعلي** من [AdminProductRequest](../app/Http/Requests/AdminProductRequest.php)، سطر داخل array قواعد validation:

```php
'image' => ['nullable', 'image', 'mimes:jpeg,png,webp', 'max:8192'],
```

- `'image'` اسم حقل الطلب؛ `=>` ربط المفتاح بقواعده.
- `nullable` يسمح بعدم إرسال صورة.
- `image` يتحقق من كون الملف صورة مدعومة.
- `mimes:...` يقيد الأنواع المقبولة، مش اسم الملف المعروض فقط.
- `max:8192` حد الملف بالكيلوبايت في validation الملفات، مش أبعاد الصورة.
- `[]` قائمة القواعد؛ الفاصلة نهاية عنصر داخل rules array، مش PHP script كامل مستقل.

**بإيدك:** اكتب اختبارًا يتوقع validation error لملف نصي بدل صورة، في بيئة الاختبار فقط. متحاولش ترفع ملفات مؤذية لتجربة الموقع العام.

**غلطة شائعة:** الاعتماد على accept داخل input؛ ده توجيه للمتصفح مش فحص أمان من السيرفر.

**سؤال إنترفيو:** هل validation تكفي وحدها؟

<details><summary>الإجابة</summary>لأ؛ نحتاج authorization وأسماء وتخزين آمنين وحدود موارد ومعالجة وفحص أخطاء مناسبين. القواعد دي جزء من الحماية.</details>

## سؤال 3: السيرفر بيصغّر الصورة مع الحفاظ على نسبتها إزاي؟

**مقتطف فعلي** من [ProductImageService](../app/Services/ProductImageService.php)، داخل store بعد فك الصورة:

```php
$width = imagesx($source);
$height = imagesy($source);
$targetWidth = min(800, $width);
$targetHeight = max(1, (int) round($height * ($targetWidth / $width)));
```

1. عرض الصورة الأصلية بالبكسل؛ `$source` صورة اتقرأت بالفعل.
2. ارتفاعها.
3. العرض المستهدف أصغر القيمتين؛ الصورة الصغيرة مش بيكبّرها لـ800.
4. نفس نسبة التصغير للارتفاع؛ round تقريب؛ `(int)` عدد صحيح؛ max يمنع ارتفاع أقل من1.

**بإيدك:** احسب لصورة 1600×1000. المتوقع 800×500. ولصورة 400×300 تفضل 400×300.

**غلطة شائعة:** تحديد ارتفاع ثابت مستقل عن العرض فيشوّه النسبة. ده شرح حساب لا تشغيل service كاملة من السطور الأربعة وحدها.

**سؤال إنترفيو:** التحويل لـWebP يثبت إن الملف آمن تمامًا؟

<details><summary>الإجابة</summary>لأ؛ لازم بقية pipeline والصلاحيات وحدود الذاكرة والملف والتعامل مع فشل الكتابة تكون محسوبة. الكود الحالي له مساحة تحسين، مش ضمان production شامل.</details>

## سؤال 4: أحصل على قائمة المنتجات بدون صور؟

**مثال تدريبي إضافي** على بيانات snapshot العامة؛ في Console صفحة Pizza المحلية:

```js
const response = await fetch('/api/menu');
if (!response.ok) throw new Error('Menu failed');
const data = await response.json();
const missing = data.items.filter((item) => !item.image_path);
console.table(missing.map((item) => ({ id: item.id, name: item.name })));
```

1. GET قائمة المنتجات.
2. ارفض استجابة HTTP فاشلة بدل تحليلها كأنها menu.
3. اقرأ JSON.
4. filter ترجع المنتجات بدون path فقط؛ مش اختبار إن الملفات الموجودة قابلة للتحميل.
5. map تختار id وname؛ `({ ... })` ترجع object من arrow function مختصرة؛ table تعرضها كجدول في Console.

**بإيدك:** قارن عدد النتائج ببيانات المصدر الحالية. متنسخش قائمة التقرير القديم كأنها نتيجة تشغيل النهارده.

**سؤال إنترفيو:** إيه الفرق بين path فاضي وHTTP404 للصورة؟

<details><summary>الإجابة</summary>الأول نقص بيانات معروف قبل الطلب؛ الثاني path موجود لكن المورد فشل وقت التحميل، علشان كده نحتاج onError أيضًا.</details>
