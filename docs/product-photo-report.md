# أسئلة كود: صورة المنتج مش موجودة أو فشلت؟

[الفهرس](00-start-here.md) · موضوع الدرس React state + عرض شرطي + معالجة ملف في backend. مش مطلوب تذاكر تصميم الصور نفسه.

قائمة الصور الناقصة القديمة محفوظة في [التقرير الأصلي](../docs-backup-before-study-20261023/product-photo-report.md). هي snapshot وقت التقرير، مش inventory حي لقاعدة بياناتك الآن. الصور الأصلية لم يتم تغييرها أثناء تعديل ملفات الدراسة.

## سؤال 1: إزاي الواجهة تكتشف فشل الصورة؟

**مثال مبسّط** من [ProductImage في MenuPage](../resources/js/Pages/MenuPage.jsx). اكتب مكوّن تدريب مستقل؛ استورد useState:

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

### `useState` و`setFailed` مش نفس الوظيفة

- **`useState(false)`:** hook من React، بتاخد الحالة الأولى وترجع array فيها القيمة الحالية وsetter. `const [failed, setFailed]` تفكيك للعنصرين، مش أسماء محجوزة.
- **`setFailed(true)`:** setter اللي React رجعتها. تستقبل الحالة الجديدة وتطلب إعادة عرض المكوّن؛ ترجع undefined، مش الصورة البديلة. القراءة الحالية داخل نفس تنفيذ الدالة لا تتغيّر لحظيًا.
- **`onError`:** prop حدث على `img`، مش method بنناديها. المتصفح يبلغ React بفشل التحميل، فReact تنادي `() => setFailed(true)`.
- **`ProductImage({ item })`:** دالة مكوّن كتبناها. المدخل props فيها item، والناتج JSX يصف صورة أو فقرة بديلة. لا ترجع ملف الصورة ولا تجلب بيانات المنيو.

نكمل الاستدعاء علشان المثال ميقفش عند تعريف component:

```jsx
const sample = { id: 1, name: 'Diavola', image_path: '/missing-photo.webp' };
<ProductImage item={sample} />
```

المكوّن يبدأ failed=false → يحاول تحميل src → المتصفح يفشل → setFailed(true) → React تنادي المكوّن تاني → الشرط يرجّع الفقرة. `return` داخل المكوّن يحدد الناتج المعروض ويوقف بقية التنفيذ الحالي.

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

### بس مصدر الصورة جي منين؟ نتابع التدفق كامل

ده مسار **Laravel المحلي الحقيقي، مش نسخة static demo**:

1. input الملف في `Admin/AdminPanel.jsx` يضع `event.target.files[0]` في `form.image`.
2. دالة `save` تجهّز FormData وترسل POST عن طريق csrfFetch.
3. route `/api/admin/products` تصل إلى AdminController::storeProduct بعد middleware والـ Form Request.
4. controller يستدعي ProductImageService::store للصورة، والدالة ترجع URL.
5. controller يحفظ URL في image_path داخل DB ويرجع المنتج.
6. API المنيو ترجع image_path، وProductImage تعرضه في img src.

### الجزء الأول: تجهيز الملف في المتصفح

**مقتطف فعلي متصل من save في [AdminPanel.jsx](../resources/js/Pages/Admin/AdminPanel.jsx):**

```jsx
const body = new FormData();
Object.entries(form).forEach(([key, value]) => {
    if (key === 'branch_options') body.append(key, JSON.stringify(value));
    else if (key === 'image' && value) body.append(key, value);
    else if (key !== 'image') body.append(key, typeof value === 'boolean' ? (value ? '1' : '0') : value);
});
await csrfFetch(product ? '/api/admin/products/' + product.id : '/api/admin/products', {
    method: 'POST',
    body,
});
onSaved();
```

- **`new FormData()`:** Web API constructor، ينشئ حاوية حقول وملفات مناسبة للرفع، مش JSON string. هنا بلا arguments وترجع FormData object.
- **`Object.entries(form)`:** JavaScript method تأخذ object وترجع array أزواج مثل `[['name', 'Diavola'], ['image', File]]`. لا تحذف حقول form.
- **`forEach(callback)`:** Array method تنادي callback لكل زوج. `[key, value]` تفك الزوج لاسم الحقل وقيمته. ناتج forEach نفسها undefined.
- **`body.append(key, value)`:** FormData method تضيف حقلًا. تقبل string أو Blob/File كقيمة، وترجع undefined. لو القيمة File هيتبعت محتوى الملف، مش مجرد اسمه.
- **`JSON.stringify(value)`:** يحول branch_options من array إلى نص JSON يمكن إرساله كحقل. `AdminProductRequest` في المشروع يفك النص قبل validation.
- **`csrfFetch(url, options)`:** helper مشروعنا؛ لأن body هي FormData لا يفرض Content-Type: application/json، ويسيبه للمتصفح. يرجع Promise ببيانات الرد. شرح جسمه كامل في [المكتبات](libraries.md).
- **`onSaved()`:** callback من الأب. في MenuAdmin تغلق نموذج التعديل ثم تنادي `load()`؛ `load` تنفّذ GET `/api/admin/catalog` وتضع الرد في setData، فتظهر بيانات المنتج والصورة الجديدة. callback نفسها لا تكتب الصورة.

### الجزء الثاني: controller يستلم ويرسل للصورة service

**أسطر فعلية من [AdminController::saveProduct](../app/Http/Controllers/Api/AdminController.php)، اخترنا الأسطر المتعلقة بالصورة والحفظ والرد:**

```php
$data = $request->validated();
if ($request->hasFile('image')) $data['image_path'] = $images->store($request->file('image'), $data['name']);
$options = $data['branch_options'];
unset($data['branch_options'], $data['image']);
$item->fill($data)->save();
// الكود الأصلي يزامن أسعار الفروع ويسجل audit بين الحفظ والرد.
return response()->json(['item' => $item->load(['category', 'branches'])], $status);
```

- `validated()` من Form Request ترجع array المدخلات المقبولة؛ مش كل الطلب بدون فحص.
- `hasFile('image')` من Laravel ترجع Boolean: هل فيه ملف مرفوع صالح تحت الحقل؟ القواعد السابقة هي اللي تقيّد النوع والحجم.
- `file('image')` ترجع UploadedFile؛ ده تمثيل الملف المؤقت على السيرفر، مش img HTML.
- `$images->store(file, name)` custom method بتاعتنا. تستقبل الملف والاسم وترجع string URL، وفي داخلها كتابة فعلية على القرص. `->` استدعاء/وصول على object في PHP.
- `unset` تركيب PHP لإزالة حقول من array؛ لا يحذف ملفًا على القرص.
- `fill($data)` من Eloquent تملأ خصائص النموذج المسموح بها وترجع النموذج للتسلسل. `save()` تنفّذ INSERT/UPDATE وترجع Boolean، ومش URL الصورة.
- `load([...])` من Eloquent تحمل العلاقات وترجع النموذج. `response()->json(...)` تبني رد HTTP JSON.

### الجزء الثالث: store نفسها — مفيش helper ناقص للصورة

**الجسم الفعلي الكامل للدالة** من [ProductImageService.php](../app/Services/ProductImageService.php). الكلاس يستورد `UploadedFile` من Laravel و`Str` و`ValidationException`:

```php
public function store(UploadedFile $file, string $name): string
{
    if (! function_exists('imagewebp')) {
        throw ValidationException::withMessages(['image' => ['PHP GD with WebP support is required for product uploads.']]);
    }

    $source = match ($file->getMimeType()) {
        'image/jpeg' => imagecreatefromjpeg($file->getRealPath()),
        'image/png' => imagecreatefrompng($file->getRealPath()),
        'image/webp' => imagecreatefromwebp($file->getRealPath()),
        default => false,
    };
    if (! $source) {
        throw ValidationException::withMessages(['image' => ['The image could not be processed.']]);
    }

    $width = imagesx($source);
    $height = imagesy($source);
    $targetWidth = min(800, $width);
    $targetHeight = max(1, (int) round($height * ($targetWidth / $width)));
    $target = imagecreatetruecolor($targetWidth, $targetHeight);
    imagealphablending($target, false);
    imagesavealpha($target, true);
    imagecopyresampled($target, $source, 0, 0, 0, 0, $targetWidth, $targetHeight, $width, $height);

    $directory = public_path('images/menu/admin');
    if (! is_dir($directory)) mkdir($directory, 0755, true);
    $filename = Str::slug($name).'-'.Str::lower(Str::random(8)).'.webp';
    imagewebp($target, $directory.DIRECTORY_SEPARATOR.$filename, 82);
    imagedestroy($source);
    imagedestroy($target);

    return '/images/menu/admin/'.$filename;
}
```

### أول مجموعة: قراءة وفك الصورة

- **`store(UploadedFile $file, string $name): string`:** method إحنا كتبناها. file كائن رفع وname اسم المنتج. `: string` إعلان نوع الراجع. مش هي Laravel Storage::store؛ تشابه الاسم مش دليل.
- **`function_exists('imagewebp')`:** PHP built-in تأخذ اسم دالة وترجع true/false. هنا نفحص دعم GD/WebP قبل العمل.
- **`ValidationException::withMessages(array)`:** factory من Laravel ترجع exception فيها أخطاء الحقول؛ `throw` يرميها علشان دورة Laravel تنتج رد validation.
- **`getMimeType()`:** من كائن الملف؛ تحاول تحديد MIME من الملف وترجع string أو null. ده غير الوثوق باسم الامتداد من المستخدم.
- **`getRealPath()`:** من كائن الملف؛ ترجع مساره الحقيقي المؤقت أو false عند الفشل، مش URL عامًا.
- **`match`:** تركيب PHP يختار التعبير المطابق لقيمة MIME، مش method.
- **`imagecreatefromjpeg/png/webp(path)`:** دوال GD تقرأ المسار وتفك الصورة إلى GdImage في الذاكرة، أو false عند الفشل. الناتج مش اسم الملف. نستخدم decoder المناسب حسب النوع.

### المجموعة الثانية: الحساب والتصغير

- **`imagesx(source)` و`imagesy(source)`:** دوال GD تأخذ صورة مفكوكة وترجع عرضها وارتفاعها كأرقام بكسل.
- **`min(800, width)`:** PHP built-in ترجع أصغر القيم؛ لا تكبّر الصور الصغيرة.
- **`round(number)`:** ترجع قيمة مقربة لأقرب عدد صحيح كقيمة رقمية؛ `(int)` يحولها لنوع integer.
- **`max(1, height)`:** ترجع الأكبر، علشان الارتفاع المستهدف لا يقل عن بكسل واحد.
- **`imagecreatetruecolor(width, height)`:** GD تنشئ لوحة صورة جديدة بالأبعاد المطلوبة، وترجع GdImage أو false. دي لسه في الذاكرة، مش ملف WebP.
- **`imagealphablending(target, false)`:** تضبط طريقة الكتابة على alpha للصورة الهدف، وترجع Boolean. `imagesavealpha(target, true)` تطلب الاحتفاظ بقناة الشفافية عند الحفظ المناسب.
- **`imagecopyresampled(target, source, ...)`:** تنسخ وتعيد أخذ عينات الصورة من source إلى target بحجم جديد. الأربع أصفار هي بدايات x/y للهدف والمصدر، بعدها عرض/ارتفاع الهدف ثم المصدر. ترجع Boolean وتعدّل target في الذاكرة.

لو الأصل 1600×1000: width الجديد 800، النسبة 0.5، height الجديد 500. بعد النسخ target تحمل النسخة 800×500؛ source لا تتحول تلقائيًا لملف جديد.

### المجموعة الثالثة: اسم الملف والكتابة والراجع

- **`public_path(relativePath)`:** helper Laravel ترجع المسار المطلق داخل public كـ string، ولا تنشئ المجلد بنفسها.
- **`is_dir(path)`:** PHP تفحص وجود directory وترجع Boolean. `mkdir(path, 0755, true)` تحاول إنشاء المجلدات الآباء كمان وترجع Boolean؛ وضع الصلاحيات يتأثر بالنظام.
- **`Str::slug(name)`:** helper Laravel تنتج اسمًا مناسبًا للروابط/الملفات مثل `Garlic Bread` → `garlic-bread`.
- **`Str::random(8)`:** Laravel ترجع نصًا عشوائيًا بطول 8. `Str::lower(text)` ترجعه lowercase. إضافته تقلّل تصادم الأسماء؛ مش تصريح باستحالة التصادم.
- **`imagewebp(target, path, 82)`:** GD تكتب الصورة إلى ملف WebP بالمسار. `82` إعداد جودة، مش عرض ولا حجم بالكيلوبايت. ده الأثر الجانبي الأساسي على filesystem. ترجع Boolean، لكن **الكود الحالي لا يفحص نتيجة الكتابة**.
- **`imagedestroy(image)`:** اسمها التاريخي لتحرير صورة GD بعد الاستخدام. تفاصيل إدارة GdImage تختلف بإصدار PHP؛ المهم هنا إنها ليست حذفًا للملف المكتوب ولا ناتجها يُستخدم.
- **`return '/images/menu/admin/'.$filename`:** يرجّع URL نسبيًا عامًا. النقطة `.` تربط نصوص PHP. الـ controller يضع النص في image_path.

**مثال دخل/خرج توضيحي:** ملف JPEG 1600×1000 واسم Garlic Bread → ملف WebP 800×500 باسم شبيه `garlic-bread-a1b2c3d4.webp` على القرص → الراجع `/images/menu/admin/garlic-bread-a1b2c3d4.webp` → DB تحفظ النص → المتصفح يطلب الصورة عبر هذا URL.

**حدود التنفيذ الحالي:** لا يفحص كل نتائج GD/إنشاء المجلد/الكتابة، ولا يضمن تنظيف الموارد في كل فشل، ومفيش transaction تجمع filesystem مع DB. لو DB فشلت بعد كتابة الصورة ممكن يتبقى ملف غير مربوط. دي نقاط تحسين، مش حاجة هنقول موجودة من غير كود.

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

**بطاقة الدوال:** `fetch` Web API ترجع Promise بـ Response؛ `json()` method Response ترجع Promise بالبيانات؛ `filter` Array method ترجع قائمة جديدة بالمطابقات؛ `map` Array method ترجع قائمة نتائج جديدة. ولا واحدة منهم تعدّل الصور أو DB هنا.

`console.table(rows)` method في Console تأخذ array/objects وتعرض جدولًا للفحص وترجع undefined؛ مش بتبني table في صفحة المنيو ولا تصدّر Excel. لذلك `missing` بيانات الفحص، والجدول مجرد طريقة عرضها في أدوات المطور.

**بإيدك:** قارن عدد النتائج ببيانات المصدر الحالية. متنسخش قائمة التقرير القديم كأنها نتيجة تشغيل النهارده.

**سؤال إنترفيو:** إيه الفرق بين path فاضي وHTTP404 للصورة؟

<details><summary>الإجابة</summary>الأول نقص بيانات معروف قبل الطلب؛ الثاني path موجود لكن المورد فشل وقت التحميل، علشان كده نحتاج onError أيضًا.</details>
