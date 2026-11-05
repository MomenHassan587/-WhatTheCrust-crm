# تحويل صورة المنتج إلى WebP وتصغيرها

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `app/Services/ProductImageService.php` · 46 سطر.

**وظيفة الملف:** service يستخدم PHP GD؛ يقرأ JPEG/PNG/WebP، يحافظ على النسبة والشفافية، يصغّر العرض لحد 800 بدون تكبير الصور الصغيرة، ويكتب WebP جودة 82 باسم عشوائي داخل public/images/menu/admin.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../app/Services/ProductImageService.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Http/Controllers/Api/AdminController.php](../Http/Controllers/Api/AdminController.php.md)

- [pizza-crm/app/Http/Requests/AdminProductRequest.php](../Http/Requests/AdminProductRequest.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ProductImageService
{
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
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### store

افتح UploadedFile حسب MIME وغيّر المقاس وسمّيها slug+random واحفظها ثم حرر صور GD.

- **بتاخد إيه؟ Inputs:** UploadedFile $file وstring $name اسم المنتج لتكوين اسم ملف.

- **بترجع/بتغيّر إيه؟ Return / effect:** string public URL يبدأ /images/menu/admin/؛ ValidationException لو GD/WebP غير متاح أو الصورة غير قابلة للفتح. imagewebp return غير مفحوص حاليًا.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### function_exists

- **جاية منين؟** PHP built-in function inspection

- **وظيفتها:** تسأل هل اسم function معرّف وقابل للوجود في الـruntime؛ مثل التأكد من دعم دالة صورة قبل استخدامها. ده لا ينادي الدالة نفسها.

- **المدخلات — Arguments:** function: اسم الدالة كنص؛ مثل imagecreatefromwebp.

- **الناتج/الأثر — Return / effect:** Boolean: true لو الدالة معرّفة، false لو غير متاحة. لا تؤكد نجاح الدالة لو ناديتها بملف تالف.

- **أول موضع هنا:** السطر 13.

### ValidationException::withMessages

- **جاية منين؟** Laravel ValidationException

- **وظيفتها:** ابنِ exception بأخطاء مرتبطة بأسماء حقول زي items أو expected_status.

- **المدخلات — Arguments:** array field=>messages.

- **الناتج/الأثر — Return / effect:** ValidationException؛ throw هو اللي يرميها.

- **أول موضع هنا:** السطر 24.

- **مثال:** throw ValidationException::withMessages(['items' => ['Unavailable']]);

### $file->getMimeType

- **جاية منين؟** UploadedFile

- **وظيفتها:** تقرأ نوع MIME المكتشف للملف.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** string أو null.

- **أول موضع هنا:** السطر 17.

### $file->getRealPath

- **جاية منين؟** UploadedFile

- **وظيفتها:** تقرأ المسار الفعلي المؤقت للملف.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** string أو false.

- **أول موضع هنا:** السطر 20.

### imagecreatefromjpeg

- **جاية منين؟** PHP GD extension function

- **وظيفتها:** تقرأ ملف JPEG وتفك بكسلاته إلى صورة في الذاكرة علشان نعدل الأبعاد أو نحوله. لا تحفظ صورة جديدة وحدها.

- **المدخلات — Arguments:** filename: مسار JPEG. استدعاؤها يتطلب GD ودعم JPEG؛ المدخل غير الموثوق لازم يتحقق منه قبل القراءة.

- **الناتج/الأثر — Return / effect:** GdImage في PHP 8 عند النجاح، أو false مع warning عند فشل القراءة/فك الصورة. لازم نفحص الفشل قبل تمرير الناتج لـimagesx.

- **أول موضع هنا:** السطر 18.

### imagecreatefrompng

- **جاية منين؟** PHP GD extension function

- **وظيفتها:** تفك ملف PNG إلى صورة في الذاكرة، بما فيها بيانات الشفافية المتاحة؛ ليست رفعًا للملف ولا حفظًا للنسخة المعدلة.

- **المدخلات — Arguments:** filename: مسار PNG؛ تتطلب GD ودعم PNG.

- **الناتج/الأثر — Return / effect:** GdImage عند النجاح أو false مع warning عند الملف غير الصالح/غير المقروء؛ نراجع النتيجة قبل بقية خطوات المعالجة.

- **أول موضع هنا:** السطر 19.

### imagecreatefromwebp

- **جاية منين؟** PHP GD extension function

- **وظيفتها:** تفك صورة WebP مدعومة إلى صورة في الذاكرة للمعالجة؛ دعم GD مهم، والصور المتحركة مش بالضرورة مدعومة بهذه الدالة.

- **المدخلات — Arguments:** filename: مسار WebP؛ تحقق من function_exists والدعم إذا البيئة قد تختلف.

- **الناتج/الأثر — Return / effect:** GdImage عند النجاح أو false مع warning عند فشل القراءة/صيغة غير مدعومة. لو الدالة غير متاحة أصلًا استدعاؤها يرمي Error.

- **أول موضع هنا:** السطر 20.

### imagesx

- **جاية منين؟** PHP GD extension function

- **وظيفتها:** تقرأ عرض الصورة المحملة في الذاكرة بالبكسل؛ x يعني البعد الأفقي. لا تغيّر حجم الصورة.

- **المدخلات — Arguments:** image: GdImage ناتجة من دالة تحميل/إنشاء ناجحة، مش path string.

- **الناتج/الأثر — Return / effect:** int يمثل العرض بالبكسل. تمرير false بدل صورة ناجحة يسبب TypeError في PHP 8.

- **أول موضع هنا:** السطر 27.

### imagesy

- **جاية منين؟** PHP GD extension function

- **وظيفتها:** تقرأ ارتفاع الصورة في الذاكرة بالبكسل؛ y يعني البعد الرأسي. غالبًا تستخدم مع imagesx لحساب نسبة الأبعاد.

- **المدخلات — Arguments:** image: GdImage صالحة.

- **الناتج/الأثر — Return / effect:** int يمثل الارتفاع بالبكسل؛ نوع مدخل غير مناسب يسبب TypeError.

- **أول موضع هنا:** السطر 28.

### min

- **جاية منين؟** Laravel Password rule

- **وظيفتها:** تجهز قاعدة حد أدنى لطول كلمة السر عند Password::min.

- **المدخلات — Arguments:** عدد الحروف.

- **الناتج/الأثر — Return / effect:** Password rule object؛ لا تولّد باسورد ولا تنفذ محاولة دخول.

- **أول موضع هنا:** السطر 29.

### max

- **جاية منين؟** PHP built-in comparison/math function

- **وظيفتها:** تختار أكبر قيمة من القيم؛ مثل max(1,$width) لمنع ناتج أبعاد أقل من1. لا تعني أقصى حد دائمًا؛ هي تختار الأكبر، وmin تختار الأصغر.

- **المدخلات — Arguments:** قيم متعددة، أو array واحدة غير فاضية. في حساب الأبعاد استخدم أرقامًا واضحة لأن خلط الأنواع يؤثر على المقارنة.

- **الناتج/الأثر — Return / effect:** القيمة الأكبر بنوعها؛ مش شرط int في كل استخدام. array فاضية ترمي ValueError.

- **أول موضع هنا:** السطر 30.

### round

- **جاية منين؟** PHP built-in

- **وظيفتها:** قرّب رقمًا حسب precision؛ الدفع يستخدمها بعد ضرب total في100 ثم cast إلىint، وده مختلف عن تقريب سعر للعرض فقط.

- **المدخلات — Arguments:** number ثم precision اختيارية افتراضي0 ثم rounding mode اختيارية.

- **الناتج/الأثر — Return / effect:** float نتيجة التقريب؛ cast(int) في payment يحوّلها بعد ذلك إلىinteger.

- **أول موضع هنا:** السطر 30.

- **مثال:** (int) round(((float) $order->total_price) * 100)

### imagecreatetruecolor

- **جاية منين؟** PHP GD extension function

- **وظيفتها:** تنشئ لوحة صورة true-color جديدة في الذاكرة بالأبعاد المطلوبة؛ ننسخ/نعيد أخذ بكسلات الصورة الأصلية إليها لاحقًا. لا تعيد تحجيم الأصل وحدها.

- **المدخلات — Arguments:** width ثم height: أعداد صحيحة موجبة بالبكسل.

- **الناتج/الأثر — Return / effect:** GdImage عند النجاح أو false عند فشل الإنشاء؛ الأبعاد غير الموجبة تسبب ValueError في PHP 8. تحتاج GD وذاكرة مناسبة.

- **أول موضع هنا:** السطر 31.

### imagealphablending

- **جاية منين؟** PHP GD extension function

- **وظيفتها:** تضبط هل الرسم على الصورة يدمج اللون مع الخلفية أم ينسخ اللون مع alpha كما هو. false مهمة أثناء تجهيز صورة نريد الحفاظ على شفافيتها.

- **المدخلات — Arguments:** image: GdImage، enable: Boolean لتفعيل blending أو تعطيلها.

- **الناتج/الأثر — Return / effect:** true في الاستدعاء الصحيح؛ الأثر تغيير إعداد الصورة نفسها، وليس إنشاء GdImage جديدة. نوع صورة غير صالح يسبب TypeError.

- **أول موضع هنا:** السطر 32.

### imagesavealpha

- **جاية منين؟** PHP GD extension function

- **وظيفتها:** تضبط حفظ معلومات alpha الكاملة عند إخراج صيغة تدعم الشفافية. لا تحفظ الملف الآن؛ فقط إعداد تستخدمه خطوة الحفظ. غالبًا نعطل blending قبلها للحفاظ على alpha.

- **المدخلات — Arguments:** image: GdImage، enable: Boolean مثل true للاحتفاظ بقناة alpha.

- **الناتج/الأثر — Return / effect:** true في الاستدعاء الصحيح؛ لا ترجع مسار ملف ولا صورة جديدة. JPEG لا تدعم alpha حتى لو فعلت الإعداد.

- **أول موضع هنا:** السطر 33.

### imagecopyresampled

- **جاية منين؟** PHP GD extension

- **وظيفتها:** انسخ الصورة الأصلية إلى canvas الهدف مع إعادة sampling لتغيير المقاس بجودة أفضل.

- **المدخلات — Arguments:** target/source وإحداثيات ومقاسات الهدف والمصدر.

- **الناتج/الأثر — Return / effect:** bool.

- **أول موضع هنا:** السطر 34.

- **مثال:** imagecopyresampled($target, $source, 0, 0, 0, 0, $targetWidth, $targetHeight, $width, $height);

### public_path

- **جاية منين؟** Laravel path helper

- **وظيفتها:** ابنِ مسار filesystem مطلق داخل public للكتابة أو القراءة المحلية؛ مختلف عن URL التي تبدأ /images.

- **المدخلات — Arguments:** مسار نسبي اختياري داخل public.

- **الناتج/الأثر — Return / effect:** absolute filesystem path string، مش public URL.

- **أول موضع هنا:** السطر 36.

- **مثال:** public_path('images/menu/admin')

### is_dir

- **جاية منين؟** PHP built-in filesystem function

- **وظيفتها:** تسأل هل المسار موجود وهو Directory فعلًا؛ تختلف عن file_exists التي تقبل ملفًا أو فولدرًا. لا تنشئ المسار.

- **المدخلات — Arguments:** filename: المسار المراد فحصه.

- **الناتج/الأثر — Return / effect:** Boolean: true لفولدر موجود، false لو غير موجود أو ليس فولدرًا أو تعذر الفحص.

- **أول موضع هنا:** السطر 37.

### mkdir

- **جاية منين؟** PHP built-in filesystem mutation function

- **وظيفتها:** تنشئ فولدرًا فعليًا على القرص؛ recursive=true تسمح بإنشاء الآباء الناقصين. دي خطوة تغيير ملفات، مش مجرد فحص مسار.

- **المدخلات — Arguments:** directory: المسار؛ permissions اختياري مثل0755؛ recursive اختياري؛ context اختياري. الصلاحيات الفعلية تتأثر بالنظام وumask.

- **الناتج/الأثر — Return / effect:** true عند النجاح أو false مع warning عند الفشل مثل نقص الصلاحيات أو وجود الفولدر بالفعل. عشان كده غالبًا نفحص is_dir الأول.

- **أول موضع هنا:** السطر 37.

### Str::slug

- **جاية منين؟** Laravel Str

- **وظيفتها:** حوّل اسم المنتج أو الفرع إلى اسم مناسب للرابط/الملف مثل garlic-bread.

- **المدخلات — Arguments:** string name وseparator اختياري.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 38.

- **مثال:** Str::slug($name)

### Str::lower

- **جاية منين؟** Laravel Str

- **وظيفتها:** تحول النص إلى lowercase.

- **المدخلات — Arguments:** text.

- **الناتج/الأثر — Return / effect:** string جديدة.

- **أول موضع هنا:** السطر 38.

### Str::random

- **جاية منين؟** Laravel Str

- **وظيفتها:** ولّد string عشوائية آمنة للاستخدام كtracking token أو جزء اسم ملف؛ الطول لا يلغي الحاجة للتحكم في صلاحيات الوصول.

- **المدخلات — Arguments:** length int.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 38.

- **مثال:** Str::random(48)

### imagewebp

- **جاية منين؟** PHP GD extension

- **وظيفتها:** حوّل GD image لملف WebP أو output؛ quality82 اختيار ضغط/جودة وليس نسبة resize.

- **المدخلات — Arguments:** GD image وfilename وquality.

- **الناتج/الأثر — Return / effect:** bool نجاح حسب GD؛ التنفيذ الحالي لا يفحص القيمة.

- **أول موضع هنا:** السطر 39.

- **مثال:** imagewebp($target, $path, 82);

### imagedestroy

- **جاية منين؟** PHP GD extension

- **وظيفتها:** حرر مورد الصورة بعد المعالجة؛ في إصدارات GD object الحديثة إدارة الذاكرة تلقائية أيضًا.

- **المدخلات — Arguments:** GD image.

- **الناتج/الأثر — Return / effect:** نتيجة غير مستخدمة.

- **أول موضع هنا:** السطر 41.

- **مثال:** imagedestroy($source);

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** namespace بتحدد نطاق أسماء الكلاس `App\Services`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 5:** use / استيراد الاسم `Illuminate\Http\UploadedFile` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** use / استيراد الاسم `Illuminate\Support\Str` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 7:** use / استيراد الاسم `Illuminate\Validation\ValidationException` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php
class ProductImageService
{
    public function store(UploadedFile $file, string $name): string
    {
        if (! function_exists('imagewebp')) {
            throw ValidationException::withMessages(['image' => ['PHP GD with WebP support is required for product uploads.']]);
        }

```

**السطر 9:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

**السطر 10:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 11:** Function / تعريف دالة `store`؛ تعريفها مش تشغيلها. افتح UploadedFile حسب MIME وغيّر المقاس وسمّيها slug+random واحفظها ثم حرر صور GD. مدخلاتها: UploadedFile $file وstring $name اسم المنتج لتكوين اسم ملف. ناتجها: string public URL يبدأ /images/menu/admin/؛ ValidationException لو GD/WebP غير متاح أو الصورة غير قابلة للفتح. imagewebp return غير مفحوص حاليًا.

**السطر 12:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 13:** if تختبر الشرط `! function_exists('imagewebp')`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 14:** throw ترمي الاستثناء `ValidationException::withMessages(['image' => ['PHP GD with WebP support is required for product uploads.']]);` وتوقف المسار العادي. Laravel exception handler أو catch المناسبة تتعامل معاه؛ مش مجرد رسالة بتنطبع وتكمّل التنفيذ.

**السطر 15:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 17–24

```php
        $source = match ($file->getMimeType()) {
            'image/jpeg' => imagecreatefromjpeg($file->getRealPath()),
            'image/png' => imagecreatefrompng($file->getRealPath()),
            'image/webp' => imagecreatefromwebp($file->getRealPath()),
            default => false,
        };
        if (! $source) {
            throw ValidationException::withMessages(['image' => ['The image could not be processed.']]);
```

**السطر 17:** Assignment / إسناد: احسب `match ($file->getMimeType()) {` الأول وخزّن النتيجة في `$source`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 18:** PHP array entry: المفتاح `image/jpeg` مرتبط بالقيمة `imagecreatefromjpeg($file->getRealPath())`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 19:** PHP array entry: المفتاح `image/png` مرتبط بالقيمة `imagecreatefrompng($file->getRealPath())`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 20:** PHP array entry: المفتاح `image/webp` مرتبط بالقيمة `imagecreatefromwebp($file->getRealPath())`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 21:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 22:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 23:** if تختبر الشرط `! $source`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 24:** throw ترمي الاستثناء `ValidationException::withMessages(['image' => ['The image could not be processed.']]);` وتوقف المسار العادي. Laravel exception handler أو catch المناسبة تتعامل معاه؛ مش مجرد رسالة بتنطبع وتكمّل التنفيذ.

### السطور 25–32

```php
        }

        $width = imagesx($source);
        $height = imagesy($source);
        $targetWidth = min(800, $width);
        $targetHeight = max(1, (int) round($height * ($targetWidth / $width)));
        $target = imagecreatetruecolor($targetWidth, $targetHeight);
        imagealphablending($target, false);
```

**السطر 25:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 27:** Assignment / إسناد: احسب `imagesx($source)` الأول وخزّن النتيجة في `$width`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 28:** Assignment / إسناد: احسب `imagesy($source)` الأول وخزّن النتيجة في `$height`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 29:** Assignment / إسناد: احسب `min(800, $width)` الأول وخزّن النتيجة في `$targetWidth`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 30:** Assignment / إسناد: احسب `max(1, (int) round($height * ($targetWidth / $width)))` الأول وخزّن النتيجة في `$targetHeight`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 31:** Assignment / إسناد: احسب `imagecreatetruecolor($targetWidth, $targetHeight)` الأول وخزّن النتيجة في `$target`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 32:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `imagealphablending(...)`: تضبط هل الرسم على الصورة يدمج اللون مع الخلفية أم ينسخ اللون مع alpha كما هو. false مهمة أثناء تجهيز صورة نريد الحفاظ على شفافيتها. مدخلاتها: image: GdImage، enable: Boolean لتفعيل blending أو تعطيلها. العائد/الأثر: true في الاستدعاء الصحيح؛ الأثر تغيير إعداد الصورة نفسها، وليس إنشاء GdImage جديدة. نوع صورة غير صالح يسبب TypeError.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 33–40

```php
        imagesavealpha($target, true);
        imagecopyresampled($target, $source, 0, 0, 0, 0, $targetWidth, $targetHeight, $width, $height);

        $directory = public_path('images/menu/admin');
        if (! is_dir($directory)) mkdir($directory, 0755, true);
        $filename = Str::slug($name).'-'.Str::lower(Str::random(8)).'.webp';
        imagewebp($target, $directory.DIRECTORY_SEPARATOR.$filename, 82);
        imagedestroy($source);
```

**السطر 33:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `imagesavealpha(...)`: تضبط حفظ معلومات alpha الكاملة عند إخراج صيغة تدعم الشفافية. لا تحفظ الملف الآن؛ فقط إعداد تستخدمه خطوة الحفظ. غالبًا نعطل blending قبلها للحفاظ على alpha. مدخلاتها: image: GdImage، enable: Boolean مثل true للاحتفاظ بقناة alpha. العائد/الأثر: true في الاستدعاء الصحيح؛ لا ترجع مسار ملف ولا صورة جديدة. JPEG لا تدعم alpha حتى لو فعلت الإعداد.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 34:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `imagecopyresampled(...)`: انسخ الصورة الأصلية إلى canvas الهدف مع إعادة sampling لتغيير المقاس بجودة أفضل. مدخلاتها: target/source وإحداثيات ومقاسات الهدف والمصدر. العائد/الأثر: bool.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 36:** Assignment / إسناد: احسب `public_path('images/menu/admin')` الأول وخزّن النتيجة في `$directory`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 37:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `is_dir(...)`: تسأل هل المسار موجود وهو Directory فعلًا؛ تختلف عن file_exists التي تقبل ملفًا أو فولدرًا. لا تنشئ المسار. مدخلاتها: filename: المسار المراد فحصه. العائد/الأثر: Boolean: true لفولدر موجود، false لو غير موجود أو ليس فولدرًا أو تعذر الفحص.؛ `mkdir(...)`: تنشئ فولدرًا فعليًا على القرص؛ recursive=true تسمح بإنشاء الآباء الناقصين. دي خطوة تغيير ملفات، مش مجرد فحص مسار. مدخلاتها: directory: المسار؛ permissions اختياري مثل0755؛ recursive اختياري؛ context اختياري. الصلاحيات الفعلية تتأثر بالنظام وumask. العائد/الأثر: true عند النجاح أو false مع warning عند الفشل مثل نقص الصلاحيات أو وجود الفولدر بالفعل. عشان كده غالبًا نفحص is_dir الأول.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 38:** Assignment / إسناد: احسب `Str::slug($name).'-'.Str::lower(Str::random(8)).'.webp'` الأول وخزّن النتيجة في `$filename`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 39:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `imagewebp(...)`: حوّل GD image لملف WebP أو output؛ quality82 اختيار ضغط/جودة وليس نسبة resize. مدخلاتها: GD image وfilename وquality. العائد/الأثر: bool نجاح حسب GD؛ التنفيذ الحالي لا يفحص القيمة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 40:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `imagedestroy(...)`: حرر مورد الصورة بعد المعالجة؛ في إصدارات GD object الحديثة إدارة الذاكرة تلقائية أيضًا. مدخلاتها: GD image. العائد/الأثر: نتيجة غير مستخدمة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 41–46

```php
        imagedestroy($target);

        return '/images/menu/admin/'.$filename;
    }
}

```

**السطر 41:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `imagedestroy(...)`: حرر مورد الصورة بعد المعالجة؛ في إصدارات GD object الحديثة إدارة الذاكرة تلقائية أيضًا. مدخلاتها: GD image. العائد/الأثر: نتيجة غير مستخدمة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 43:** return تعيد التعبير `'/images/menu/admin/'.$filename` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 44:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 45:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
