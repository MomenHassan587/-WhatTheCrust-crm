# المنيو اللي العميل بيستقبلها

[فهرس كل الأكواد](../../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `app/Http/Controllers/Api/MenuController.php` · 63 سطر.

**وظيفة الملف:** بيقرأ الفروع والأقسام والمنتجات النشطة، يعمل eager loading للأسعار المتاحة بكل فرع، ويرجع الشكل اللي CatalogContext وMenuPage محتاجينه. السعر هنا مش property على menu_items؛ جاي من pivot branch_menu_item.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../../app/Http/Controllers/Api/MenuController.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Http/Controllers/Controller.php](../Controller.php.md)

- [pizza-crm/app/Models/Branch.php](../../../Models/Branch.php.md)

- [pizza-crm/app/Models/Category.php](../../../Models/Category.php.md)

- [pizza-crm/app/Models/MenuItem.php](../../../Models/MenuItem.php.md)

- [pizza-crm/resources/js/context/CatalogContext.jsx](../../../../resources/js/context/CatalogContext.jsx.md)

- [pizza-crm/resources/js/Pages/MenuPage.jsx](../../../../resources/js/Pages/MenuPage.jsx.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

// app/Http/Controllers/Api/MenuController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Http\JsonResponse;

class MenuController extends Controller
{
    public function index(): JsonResponse
    {
        $branches = Branch::query()
            ->where('is_active', true)
            ->orderBy('display_order')
            ->orderBy('id')
            ->get();

        $categories = Category::query()
            ->where('is_active', true)
            ->orderBy('display_order')
            ->orderBy('id')
            ->get();

        $items = MenuItem::query()
            ->where('is_active', true)
            ->whereHas('category', fn ($query) => $query->where('is_active', true))
            ->with(['category', 'branches' => fn ($query) => $query->where('branches.is_active', true)->orderBy('branches.display_order')])
            ->orderBy('category_id')
            ->orderBy('display_order')
            ->orderBy('id')
            ->get()
            ->map(function (MenuItem $item) {
                return [
                    'id' => $item->id,
                    'category_id' => $item->category_id,
                    'category' => $item->category?->name,
                    'category_slug' => $item->category?->slug,
                    'name' => $item->name,
                    'description' => $item->description,
                    'image_path' => $item->image_path,
                    'tag' => $item->tag,
                    'display_order' => $item->display_order,
                    'branch_options' => $item->branches->map(fn (Branch $branch) => [
                        'branch_id' => $branch->id,
                        'price' => $branch->pivot->price,
                        'is_available' => (bool) $branch->pivot->is_available,
                    ])->values(),
                ];
            });

        return response()->json([
            'branches' => $branches,
            'categories' => $categories,
            'items' => $items,
        ]);
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### index

جهّز كتالوج branches/categories/items مرتب، ومع كل منتج branch_options للأسعار والإتاحة.

- **بتاخد إيه؟ Inputs:** مفيش parameters للدالة؛ route GET /api/menu.

- **بترجع/بتغيّر إيه؟ Return / effect:** JsonResponse بقوائم الفروع والأقسام والمنتجات النشطة.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### Branch::query

- **جاية منين؟** Eloquent

- **وظيفتها:** تبدأ بناء query على model.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** Eloquent Builder، مش rows جاهزة.

- **أول موضع هنا:** السطر 17.

### ->where

- **جاية منين؟** Laravel Query Builder

- **وظيفتها:** تضيف شرط فلترة أو مجموعة شروط.

- **المدخلات — Arguments:** column/operator/value أو closure.

- **الناتج/الأثر — Return / effect:** Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.

- **أول موضع هنا:** السطر 30.

### ->orderBy

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تضيف ترتيبًا حسب عمود واتجاه.

- **المدخلات — Arguments:** column وdirection.

- **الناتج/الأثر — Return / effect:** Builder.

- **أول موضع هنا:** السطر 35.

### ->get

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تنفّذ الاستعلام وتجمع الصفوف.

- **المدخلات — Arguments:** columns اختيارية.

- **الناتج/الأثر — Return / effect:** Collection؛ مش استجابة JSON وحدها.

- **أول موضع هنا:** السطر 36.

### Category::query

- **جاية منين؟** Eloquent

- **وظيفتها:** تبدأ بناء query على model.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** Eloquent Builder، مش rows جاهزة.

- **أول موضع هنا:** السطر 23.

### MenuItem::query

- **جاية منين؟** Eloquent

- **وظيفتها:** تبدأ بناء query على model.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** Eloquent Builder، مش rows جاهزة.

- **أول موضع هنا:** السطر 29.

### ->whereHas

- **جاية منين؟** Eloquent

- **وظيفتها:** تقيد النتائج بوجود علاقة تحقق شروطًا.

- **المدخلات — Arguments:** relation وcallback.

- **الناتج/الأثر — Return / effect:** Builder؛ غير eager loading with.

- **أول موضع هنا:** السطر 31.

### $query->where

- **جاية منين؟** Laravel Query Builder

- **وظيفتها:** تضيف شرط فلترة أو مجموعة شروط.

- **المدخلات — Arguments:** column/operator/value أو closure.

- **الناتج/الأثر — Return / effect:** Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.

- **أول موضع هنا:** السطر 32.

### ->with

- **جاية منين؟** Eloquent

- **وظيفتها:** تحدد علاقات يتم eager load لها عند الجلب.

- **المدخلات — Arguments:** علاقات كنصوص/array.

- **الناتج/الأثر — Return / effect:** Builder؛ التحميل يكتمل عند تنفيذ query.

- **أول موضع هنا:** السطر 32.

### ->map

- **جاية منين؟** Laravel Collection

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback(value, key).

- **الناتج/الأثر — Return / effect:** Collection جديدة؛ ليست array إلا لو كملت all.

- **أول موضع هنا:** السطر 37.

### branches->map

- **جاية منين؟** Laravel Collection

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback(value, key).

- **الناتج/الأثر — Return / effect:** Collection جديدة؛ ليست array إلا لو كملت all.

- **أول موضع هنا:** السطر 48.

### ->values

- **جاية منين؟** Laravel Collection

- **وظيفتها:** أعد ترقيم المفاتيح من صفر بعد filter لتتسلسل النتيجة JSON array منتظمة.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** Collection بمفاتيح رقمية متتابعة.

- **أول موضع هنا:** السطر 52.

- **مثال:** ->filter()->values()

### ->json

- **جاية منين؟** Laravel Response factory

- **وظيفتها:** تجهّز HTTP response من بيانات JSON.

- **المدخلات — Arguments:** data وstatus وheaders.

- **الناتج/الأثر — Return / effect:** JsonResponse، مش object JavaScript مشترك بين PHP والمتصفح.

- **أول موضع هنا:** السطر 56.

### response

- **جاية منين؟** Laravel helper

- **وظيفتها:** جهّز HTTP response. بدون arguments هات factory نكمل عليها json أو view أو streamDownload.

- **المدخلات — Arguments:** بدون arguments للـ factory؛ أو content ثم status ثم headers لإنشاء response مباشرة.

- **الناتج/الأثر — Return / effect:** ResponseFactory بدون arguments، أو HTTP Response عند تمرير content؛ مش إرسال شبكة من browser.

- **أول موضع هنا:** السطر 56.

- **مثال:** return response()->json(['message' => 'Saved'], 201);

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

// app/Http/Controllers/Api/MenuController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Branch;
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 5:** namespace بتحدد نطاق أسماء الكلاس `App\Http\Controllers\Api`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 7:** use / استيراد الاسم `App\Http\Controllers\Controller` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 8:** use / استيراد الاسم `App\Models\Branch` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php
use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Http\JsonResponse;

class MenuController extends Controller
{
    public function index(): JsonResponse
    {
```

**السطر 9:** use / استيراد الاسم `App\Models\Category` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 10:** use / استيراد الاسم `App\Models\MenuItem` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 11:** use / استيراد الاسم `Illuminate\Http\JsonResponse` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 13:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

**السطر 14:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 15:** Function / تعريف دالة `index`؛ تعريفها مش تشغيلها. جهّز كتالوج branches/categories/items مرتب، ومع كل منتج branch_options للأسعار والإتاحة. مدخلاتها: مفيش parameters للدالة؛ route GET /api/menu. ناتجها: JsonResponse بقوائم الفروع والأقسام والمنتجات النشطة.

**السطر 16:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

### السطور 17–24

```php
        $branches = Branch::query()
            ->where('is_active', true)
            ->orderBy('display_order')
            ->orderBy('id')
            ->get();

        $categories = Category::query()
            ->where('is_active', true)
```

**السطر 17:** Assignment / إسناد: احسب `Branch::query()` الأول وخزّن النتيجة في `$branches`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 18:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->where(...)`: تضيف شرط فلترة أو مجموعة شروط. مدخلاتها: column/operator/value أو closure. العائد/الأثر: Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 19:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->orderBy(...)`: تضيف ترتيبًا حسب عمود واتجاه. مدخلاتها: column وdirection. العائد/الأثر: Builder.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 20:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->orderBy(...)`: تضيف ترتيبًا حسب عمود واتجاه. مدخلاتها: column وdirection. العائد/الأثر: Builder.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 21:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->get(...)`: تنفّذ الاستعلام وتجمع الصفوف. مدخلاتها: columns اختيارية. العائد/الأثر: Collection؛ مش استجابة JSON وحدها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 23:** Assignment / إسناد: احسب `Category::query()` الأول وخزّن النتيجة في `$categories`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 24:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->where(...)`: تضيف شرط فلترة أو مجموعة شروط. مدخلاتها: column/operator/value أو closure. العائد/الأثر: Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 25–32

```php
            ->orderBy('display_order')
            ->orderBy('id')
            ->get();

        $items = MenuItem::query()
            ->where('is_active', true)
            ->whereHas('category', fn ($query) => $query->where('is_active', true))
            ->with(['category', 'branches' => fn ($query) => $query->where('branches.is_active', true)->orderBy('branches.display_order')])
```

**السطر 25:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->orderBy(...)`: تضيف ترتيبًا حسب عمود واتجاه. مدخلاتها: column وdirection. العائد/الأثر: Builder.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 26:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->orderBy(...)`: تضيف ترتيبًا حسب عمود واتجاه. مدخلاتها: column وdirection. العائد/الأثر: Builder.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 27:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->get(...)`: تنفّذ الاستعلام وتجمع الصفوف. مدخلاتها: columns اختيارية. العائد/الأثر: Collection؛ مش استجابة JSON وحدها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 29:** Assignment / إسناد: احسب `MenuItem::query()` الأول وخزّن النتيجة في `$items`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 30:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->where(...)`: تضيف شرط فلترة أو مجموعة شروط. مدخلاتها: column/operator/value أو closure. العائد/الأثر: Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 31:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->whereHas(...)`: تقيد النتائج بوجود علاقة تحقق شروطًا. مدخلاتها: relation وcallback. العائد/الأثر: Builder؛ غير eager loading with.؛ `$query->where(...)`: تضيف شرط فلترة أو مجموعة شروط. مدخلاتها: column/operator/value أو closure. العائد/الأثر: Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 32:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->with(...)`: تحدد علاقات يتم eager load لها عند الجلب. مدخلاتها: علاقات كنصوص/array. العائد/الأثر: Builder؛ التحميل يكتمل عند تنفيذ query.؛ `$query->where(...)`: تضيف شرط فلترة أو مجموعة شروط. مدخلاتها: column/operator/value أو closure. العائد/الأثر: Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.؛ `->orderBy(...)`: تضيف ترتيبًا حسب عمود واتجاه. مدخلاتها: column وdirection. العائد/الأثر: Builder.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 33–40

```php
            ->orderBy('category_id')
            ->orderBy('display_order')
            ->orderBy('id')
            ->get()
            ->map(function (MenuItem $item) {
                return [
                    'id' => $item->id,
                    'category_id' => $item->category_id,
```

**السطر 33:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->orderBy(...)`: تضيف ترتيبًا حسب عمود واتجاه. مدخلاتها: column وdirection. العائد/الأثر: Builder.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 34:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->orderBy(...)`: تضيف ترتيبًا حسب عمود واتجاه. مدخلاتها: column وdirection. العائد/الأثر: Builder.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 35:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->orderBy(...)`: تضيف ترتيبًا حسب عمود واتجاه. مدخلاتها: column وdirection. العائد/الأثر: Builder.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 36:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->get(...)`: تنفّذ الاستعلام وتجمع الصفوف. مدخلاتها: columns اختيارية. العائد/الأثر: Collection؛ مش استجابة JSON وحدها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 37:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->map(...)`: تحوّل كل عنصر إلى نتيجة callback. مدخلاتها: callback(value, key). العائد/الأثر: Collection جديدة؛ ليست array إلا لو كملت all.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 38:** return تعيد array القيم التالية. في ملف config دي إعدادات يستلمها Laravel وقت تحميل الإعداد؛ في method فهي ناتج يرجع للكود اللي ناداها. مش JSON response إلا لو بنينا response صراحة.

**السطر 39:** PHP array entry: المفتاح `id` مرتبط بالقيمة `$item->id`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 40:** PHP array entry: المفتاح `category_id` مرتبط بالقيمة `$item->category_id`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 41–48

```php
                    'category' => $item->category?->name,
                    'category_slug' => $item->category?->slug,
                    'name' => $item->name,
                    'description' => $item->description,
                    'image_path' => $item->image_path,
                    'tag' => $item->tag,
                    'display_order' => $item->display_order,
                    'branch_options' => $item->branches->map(fn (Branch $branch) => [
```

**السطر 41:** PHP array entry: المفتاح `category` مرتبط بالقيمة `$item->category?->name`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 42:** PHP array entry: المفتاح `category_slug` مرتبط بالقيمة `$item->category?->slug`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 43:** PHP array entry: المفتاح `name` مرتبط بالقيمة `$item->name`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 44:** PHP array entry: المفتاح `description` مرتبط بالقيمة `$item->description`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 45:** PHP array entry: المفتاح `image_path` مرتبط بالقيمة `$item->image_path`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 46:** PHP array entry: المفتاح `tag` مرتبط بالقيمة `$item->tag`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 47:** PHP array entry: المفتاح `display_order` مرتبط بالقيمة `$item->display_order`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 48:** PHP array entry: المفتاح `branch_options` مرتبط بالقيمة `$item->branches->map(fn (Branch $branch) => [`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 49–56

```php
                        'branch_id' => $branch->id,
                        'price' => $branch->pivot->price,
                        'is_available' => (bool) $branch->pivot->is_available,
                    ])->values(),
                ];
            });

        return response()->json([
```

**السطر 49:** PHP array entry: المفتاح `branch_id` مرتبط بالقيمة `$branch->id`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 50:** PHP array entry: المفتاح `price` مرتبط بالقيمة `$branch->pivot->price`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 51:** PHP array entry: المفتاح `is_available` مرتبط بالقيمة `(bool) $branch->pivot->is_available`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 52:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->values(...)`: أعد ترقيم المفاتيح من صفر بعد filter لتتسلسل النتيجة JSON array منتظمة. مدخلاتها: لا شيء. العائد/الأثر: Collection بمفاتيح رقمية متتابعة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 53:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 54:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 56:** return بتوقف الدالة وترجّع JsonResponse للـroute. response()->json تبني HTTP response من البيانات التالية؛ الـstatus المكتوب يحدد نجاح/فشل الطلب. مختلفة عن response.json() في المتصفح اللي تقرأ الرد.

### السطور 57–63

```php
            'branches' => $branches,
            'categories' => $categories,
            'items' => $items,
        ]);
    }
}

```

**السطر 57:** PHP array entry: المفتاح `branches` مرتبط بالقيمة `$branches`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 58:** PHP array entry: المفتاح `categories` مرتبط بالقيمة `$categories`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 59:** PHP array entry: المفتاح `items` مرتبط بالقيمة `$items`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 60:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 61:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 62:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
