# اختبارات كتالوج المنيو

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `tests/Feature/MenuApiTest.php` · 59 سطر.

**وظيفة الملف:** تتحقق إن GET /api/menu بيرجع الفروع والأصناف وbranch prices والترتيب المتوقع من seeder؛ دي expectations ثابتة من fixtures مش تقرير عن DB المستخدم الحالية.

**نوعه:** support. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../tests/Feature/MenuApiTest.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/database/seeders/MenuCatalogSeeder.php](../../database/seeders/MenuCatalogSeeder.php.md)

- [pizza-crm/app/Http/Controllers/Api/MenuController.php](../../app/Http/Controllers/Api/MenuController.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

namespace Tests\Feature;

use Database\Seeders\MenuCatalogSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MenuApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(MenuCatalogSeeder::class);
    }

    public function test_menu_returns_the_canonical_branches_and_complete_catalog(): void
    {
        $response = $this->getJson('/api/menu')->assertOk();

        $this->assertSame(
            ['The Drive', 'Golf Central', 'LakeHouse'],
            collect($response->json('branches'))->pluck('name')->all(),
        );
        $response->assertJsonPath('items.0.id', 1)
            ->assertJsonPath('items.0.name', 'Margherita Verace')
            ->assertJsonPath('items.0.tag', 'The Queen')
            ->assertJsonCount(3, 'items.0.branch_options');

        $diavola = collect($response->json('items'))->firstWhere('name', 'Diavola');
        $this->assertSame('/images/menu/diavola.webp', $diavola['image_path']);
    }

    public function test_drinks_are_seeded_and_every_item_has_branch_prices(): void
    {
        $payload = $this->getJson('/api/menu')->assertOk()->json();
        $drinks = collect($payload['items'])->where('category_slug', 'drinks');

        $this->assertGreaterThanOrEqual(5, $drinks->count());
        $this->assertTrue(collect($payload['items'])->every(
            fn (array $item) => count($item['branch_options']) === 3,
        ));
        $this->assertGreaterThanOrEqual(47, count($payload['items']));
        $this->assertNotNull(collect($payload['items'])->firstWhere('name', 'Panino Al Tartufo'));
        $this->assertNotNull(collect($payload['items'])->firstWhere('name', 'Ortolana'));
    }

    public function test_menu_items_are_returned_in_display_order(): void
    {
        $items = $this->getJson('/api/menu')->assertOk()->json('items');
        $pizzas = collect($items)->where('category_slug', 'pizzas')->values();

        $this->assertSame('Margherita Verace', $pizzas->first()['name']);
        $this->assertSame(range(1, 19), $pizzas->pluck('display_order')->all());
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### setUp

جهز test app وseed catalogue قبل كل test.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** void.

### test_menu_returns_the_canonical_branches_and_complete_catalog

اختبر أسماء الفروع واسم/tag/id أول منتج وصورة Diavola.

- **بتاخد إيه؟ Inputs:** GET /api/menu.

- **بترجع/بتغيّر إيه؟ Return / effect:** void assertions.

### test_drinks_are_seeded_and_every_item_has_branch_prices

اختبر وجود المشروبات وأقل عدد منتجات وكل item له3branch options.

- **بتاخد إيه؟ Inputs:** JSON catalogue.

- **بترجع/بتغيّر إيه؟ Return / effect:** void assertions.

### test_menu_items_are_returned_in_display_order

اختبر بداية البيتزا وdisplay_order من1ل19.

- **بتاخد إيه؟ Inputs:** items filtered pizzas.

- **بترجع/بتغيّر إيه؟ Return / effect:** void assertions.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### parent::setUp

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** جهز test app وseed catalogue قبل كل test.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** void.

- **أول موضع هنا:** السطر 15.

### $this->seed

- **جاية منين؟** Laravel TestCase/Seeder

- **وظيفتها:** تشغل seeders على اتصال البيئة الحالية.

- **المدخلات — Arguments:** seeder class(es).

- **الناتج/الأثر — Return / effect:** الأثر إنشاء بيانات؛ متجربهاش على production للتعلم.

- **أول موضع هنا:** السطر 16.

### $this->getJson

- **جاية منين؟** Laravel TestCase

- **وظيفتها:** تنفّذ طلب GET اختباري وتتوقع JSON.

- **المدخلات — Arguments:** URI وheaders اختيارية.

- **الناتج/الأثر — Return / effect:** TestResponse؛ مش اتصال production عادة.

- **أول موضع هنا:** السطر 52.

### ->assertOk

- **جاية منين؟** Laravel test response

- **وظيفتها:** تؤكد إن status هي200؛ الفشل يرمي assertion failure.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** نفس TestResponse للـchaining، مش true.

- **أول موضع هنا:** السطر 52.

### $this->assertSame

- **جاية منين؟** PHPUnit

- **وظيفتها:** تقارن القيمة والنوع بشكل صارم.

- **المدخلات — Arguments:** expected وactual.

- **الناتج/الأثر — Return / effect:** void أو فشل assertion.

- **أول موضع هنا:** السطر 56.

### $response->json

- **جاية منين؟** Laravel TestResponse في ملفات tests PHP

- **وظيفتها:** اقرأ JSON من response الاختبارية الموجودة؛ ليست PHP response()->json لبناء رد، وليست JS Response.json التي ترجع Promise.

- **المدخلات — Arguments:** path بصيغة dot notation اختيارية مثل 'items' أو 'branches'.

- **الناتج/الأثر — Return / effect:** PHP value محللة مثل array أو قيمة المسار المطلوب؛ ليست Promise.

- **أول موضع هنا:** السطر 32.

- **مثال:** $response->json('branches')

### ->pluck

- **جاية منين؟** Laravel Collection/Query Builder

- **وظيفتها:** هات قيمة عمود واحد، ومع key تاني تعمل قاموس بدل rows كاملة.

- **المدخلات — Arguments:** value column ثم key column اختياري.

- **الناتج/الأثر — Return / effect:** Collection قيم أو قاموس.

- **أول موضع هنا:** السطر 25.

- **مثال:** AppSetting::pluck('value', 'key')

### ->all

- **جاية منين؟** Laravel Collection

- **وظيفتها:** ترجع array العناصر الحالية.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** array؛ Model::all بدلًا منها تنفّذ query وترجع Collection.

- **أول موضع هنا:** السطر 56.

### collect

- **جاية منين؟** Laravel helper

- **وظيفتها:** حوّل array أو iterable إلى Collection في الذاكرة للاستفادة من map/filter/pluck؛ لا يقرأ DB وحده.

- **المدخلات — Arguments:** array أو iterable أو قيمة يقبلها Collection constructor؛ الافتراضي قائمة فاضية.

- **الناتج/الأثر — Return / effect:** Illuminate Support Collection object.

- **أول موضع هنا:** السطر 53.

- **مثال:** collect($options)->mapWithKeys(fn ($option) => [$option['branch_id'] => $option]);

### $response->assertJsonPath

- **جاية منين؟** Laravel TestResponse

- **وظيفتها:** تؤكد قيمة مسار داخل JSON.

- **المدخلات — Arguments:** path وexpected.

- **الناتج/الأثر — Return / effect:** نفس TestResponse أو فشل assertion.

- **أول موضع هنا:** السطر 27.

### ->assertJsonPath

- **جاية منين؟** Laravel TestResponse

- **وظيفتها:** تؤكد قيمة مسار داخل JSON.

- **المدخلات — Arguments:** path وexpected.

- **الناتج/الأثر — Return / effect:** نفس TestResponse أو فشل assertion.

- **أول موضع هنا:** السطر 29.

### ->assertJsonCount

- **جاية منين؟** Laravel TestResponse

- **وظيفتها:** تؤكد عدد عناصر جزء JSON.

- **المدخلات — Arguments:** count وpath اختيارية.

- **الناتج/الأثر — Return / effect:** TestResponse أو فشل.

- **أول موضع هنا:** السطر 30.

### ->firstWhere

- **جاية منين؟** Laravel Collection

- **وظيفتها:** تقرأ أول عنصر يطابق حقلًا/قيمة.

- **المدخلات — Arguments:** key/operator/value حسب الاستخدام.

- **الناتج/الأثر — Return / effect:** العنصر أو null.

- **أول موضع هنا:** السطر 47.

### ->json

- **جاية منين؟** Laravel TestResponse

- **وظيفتها:** تفك/تقرأ JSON من الاستجابة الاختبارية الموجودة.

- **المدخلات — Arguments:** key path اختيارية.

- **الناتج/الأثر — Return / effect:** القيمة المفكوكة أو الجزء المطلوب؛ لا ترسل response جديدة.

- **أول موضع هنا:** السطر 52.

### ->where

- **جاية منين؟** Laravel Query Builder

- **وظيفتها:** تضيف شرط فلترة أو مجموعة شروط.

- **المدخلات — Arguments:** column/operator/value أو closure.

- **الناتج/الأثر — Return / effect:** Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.

- **أول موضع هنا:** السطر 53.

### $this->assertGreaterThanOrEqual

- **جاية منين؟** PHPUnit

- **وظيفتها:** تؤكد أن actual لا تقل عن expected.

- **المدخلات — Arguments:** expected وactual.

- **الناتج/الأثر — Return / effect:** void أو فشل assertion.

- **أول موضع هنا:** السطر 45.

### $drinks->count

- **جاية منين؟** Laravel Builder/Collection

- **وظيفتها:** تحسب عدد الصفوف/العناصر حسب المستقبِل.

- **المدخلات — Arguments:** column اختيارية للـquery.

- **الناتج/الأثر — Return / effect:** عدد؛ query count تنفّذ aggregate.

- **أول موضع هنا:** السطر 41.

### $this->assertTrue

- **جاية منين؟** PHPUnit

- **وظيفتها:** تؤكد إن القيمة true فعلًا.

- **المدخلات — Arguments:** actual ورسالة اختيارية.

- **الناتج/الأثر — Return / effect:** لا نتيجة Boolean للنجاح؛ الفشل يرمي assertion failure.

- **أول موضع هنا:** السطر 42.

### ->every

- **جاية منين؟** Laravel Collection

- **وظيفتها:** تفحص أن كل العناصر تحقق predicate.

- **المدخلات — Arguments:** callback.

- **الناتج/الأثر — Return / effect:** Boolean.

- **أول موضع هنا:** السطر 42.

### count

- **جاية منين؟** PHP built-in عند count(...) وليس ->count()

- **وظيفتها:** عد عناصر array أو Countable في الذاكرة؛ مختلف عن QueryBuilder->count الذي يجري aggregate SQL.

- **المدخلات — Arguments:** array أو Countable ثم mode اختيارية.

- **الناتج/الأثر — Return / effect:** int عدد العناصر.

- **أول موضع هنا:** السطر 45.

- **مثال:** count($pending)

### $this->assertNotNull

- **جاية منين؟** PHPUnit

- **وظيفتها:** تؤكد أن القيمة ليست null.

- **المدخلات — Arguments:** actual.

- **الناتج/الأثر — Return / effect:** void أو فشل assertion.

- **أول موضع هنا:** السطر 47.

### ->values

- **جاية منين؟** Laravel Collection

- **وظيفتها:** أعد ترقيم المفاتيح من صفر بعد filter لتتسلسل النتيجة JSON array منتظمة.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** Collection بمفاتيح رقمية متتابعة.

- **أول موضع هنا:** السطر 53.

- **مثال:** ->filter()->values()

### $pizzas->first

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تنفّذ query لجلب أول صف.

- **المدخلات — Arguments:** columns اختيارية.

- **الناتج/الأثر — Return / effect:** model أو stdClass حسب builder، أو null.

- **أول موضع هنا:** السطر 55.

### $pizzas->pluck

- **جاية منين؟** Laravel Collection/Query Builder

- **وظيفتها:** هات قيمة عمود واحد، ومع key تاني تعمل قاموس بدل rows كاملة.

- **المدخلات — Arguments:** value column ثم key column اختياري.

- **الناتج/الأثر — Return / effect:** Collection قيم أو قاموس.

- **أول موضع هنا:** السطر 56.

- **مثال:** AppSetting::pluck('value', 'key')

### range

- **جاية منين؟** PHP built-in sequence generation function

- **وظيفتها:** تنشئ array متتابعة من بداية لنهاية شاملة لو يمكن الوصول للنهاية بالخطوة؛ مثل range(1,3) تعطي1 و2 و3. لا تنفذ loop body من تلقاء نفسها.

- **المدخلات — Arguments:** start، end، step اختيارية افتراضيها1. تدعم أرقامًا وبعض تسلسلات الأحرف؛ استخدم قيمًا متسقة وواضحة.

- **الناتج/الأثر — Return / effect:** array تسلسل صاعد أو نازل حسب الطرفين. step غير صالحة مثل صفر تسبب ValueError؛ ما تستخدمش حدودًا ضخمة بدون حساب الذاكرة.

- **أول موضع هنا:** السطر 56.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

namespace Tests\Feature;

use Database\Seeders\MenuCatalogSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** namespace بتحدد نطاق أسماء الكلاس `Tests\Feature`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 5:** use / استيراد الاسم `Database\Seeders\MenuCatalogSeeder` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** use / استيراد الاسم `Illuminate\Foundation\Testing\RefreshDatabase` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 7:** use / استيراد الاسم `Tests\TestCase` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php
class MenuApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(MenuCatalogSeeder::class);
```

**السطر 9:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

**السطر 10:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 11:** use / استيراد الاسم `RefreshDatabase` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 13:** Function / تعريف دالة `setUp`؛ تعريفها مش تشغيلها. جهز test app وseed catalogue قبل كل test. مدخلاتها: لا شيء. ناتجها: void.

**السطر 14:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 15:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `parent::setUp(...)`: جهز test app وseed catalogue قبل كل test. مدخلاتها: لا شيء. العائد/الأثر: void.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 16:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->seed(...)`: تشغل seeders على اتصال البيئة الحالية. مدخلاتها: seeder class(es). العائد/الأثر: الأثر إنشاء بيانات؛ متجربهاش على production للتعلم.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 17–24

```php
    }

    public function test_menu_returns_the_canonical_branches_and_complete_catalog(): void
    {
        $response = $this->getJson('/api/menu')->assertOk();

        $this->assertSame(
            ['The Drive', 'Golf Central', 'LakeHouse'],
```

**السطر 17:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 19:** Function / تعريف دالة `test_menu_returns_the_canonical_branches_and_complete_catalog`؛ تعريفها مش تشغيلها. اختبر أسماء الفروع واسم/tag/id أول منتج وصورة Diavola. مدخلاتها: GET /api/menu. ناتجها: void assertions.

**السطر 20:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 21:** Assignment / إسناد: احسب `$this->getJson('/api/menu')->assertOk()` الأول وخزّن النتيجة في `$response`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 23:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->assertSame(...)`: تقارن القيمة والنوع بشكل صارم. مدخلاتها: expected وactual. العائد/الأثر: void أو فشل assertion.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 24:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 25–32

```php
            collect($response->json('branches'))->pluck('name')->all(),
        );
        $response->assertJsonPath('items.0.id', 1)
            ->assertJsonPath('items.0.name', 'Margherita Verace')
            ->assertJsonPath('items.0.tag', 'The Queen')
            ->assertJsonCount(3, 'items.0.branch_options');

        $diavola = collect($response->json('items'))->firstWhere('name', 'Diavola');
```

**السطر 25:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$response->json(...)`: اقرأ JSON من response الاختبارية الموجودة؛ ليست PHP response()->json لبناء رد، وليست JS Response.json التي ترجع Promise. مدخلاتها: path بصيغة dot notation اختيارية مثل 'items' أو 'branches'. العائد/الأثر: PHP value محللة مثل array أو قيمة المسار المطلوب؛ ليست Promise.؛ `->pluck(...)`: هات قيمة عمود واحد، ومع key تاني تعمل قاموس بدل rows كاملة. مدخلاتها: value column ثم key column اختياري. العائد/الأثر: Collection قيم أو قاموس.؛ `->all(...)`: ترجع array العناصر الحالية. مدخلاتها: بدون arguments. العائد/الأثر: array؛ Model::all بدلًا منها تنفّذ query وترجع Collection.؛ `collect(...)`: حوّل array أو iterable إلى Collection في الذاكرة للاستفادة من map/filter/pluck؛ لا يقرأ DB وحده. مدخلاتها: array أو iterable أو قيمة يقبلها Collection constructor؛ الافتراضي قائمة فاضية. العائد/الأثر: Illuminate Support Collection object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 26:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 27:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$response->assertJsonPath(...)`: تؤكد قيمة مسار داخل JSON. مدخلاتها: path وexpected. العائد/الأثر: نفس TestResponse أو فشل assertion.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 28:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->assertJsonPath(...)`: تؤكد قيمة مسار داخل JSON. مدخلاتها: path وexpected. العائد/الأثر: نفس TestResponse أو فشل assertion.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 29:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->assertJsonPath(...)`: تؤكد قيمة مسار داخل JSON. مدخلاتها: path وexpected. العائد/الأثر: نفس TestResponse أو فشل assertion.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 30:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->assertJsonCount(...)`: تؤكد عدد عناصر جزء JSON. مدخلاتها: count وpath اختيارية. العائد/الأثر: TestResponse أو فشل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 32:** Assignment / إسناد: احسب `collect($response->json('items'))->firstWhere('name', 'Diavola')` الأول وخزّن النتيجة في `$diavola`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

### السطور 33–40

```php
        $this->assertSame('/images/menu/diavola.webp', $diavola['image_path']);
    }

    public function test_drinks_are_seeded_and_every_item_has_branch_prices(): void
    {
        $payload = $this->getJson('/api/menu')->assertOk()->json();
        $drinks = collect($payload['items'])->where('category_slug', 'drinks');

```

**السطر 33:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->assertSame(...)`: تقارن القيمة والنوع بشكل صارم. مدخلاتها: expected وactual. العائد/الأثر: void أو فشل assertion.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 34:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 36:** Function / تعريف دالة `test_drinks_are_seeded_and_every_item_has_branch_prices`؛ تعريفها مش تشغيلها. اختبر وجود المشروبات وأقل عدد منتجات وكل item له3branch options. مدخلاتها: JSON catalogue. ناتجها: void assertions.

**السطر 37:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 38:** Assignment / إسناد: احسب `$this->getJson('/api/menu')->assertOk()->json()` الأول وخزّن النتيجة في `$payload`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 39:** Assignment / إسناد: احسب `collect($payload['items'])->where('category_slug', 'drinks')` الأول وخزّن النتيجة في `$drinks`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

### السطور 41–48

```php
        $this->assertGreaterThanOrEqual(5, $drinks->count());
        $this->assertTrue(collect($payload['items'])->every(
            fn (array $item) => count($item['branch_options']) === 3,
        ));
        $this->assertGreaterThanOrEqual(47, count($payload['items']));
        $this->assertNotNull(collect($payload['items'])->firstWhere('name', 'Panino Al Tartufo'));
        $this->assertNotNull(collect($payload['items'])->firstWhere('name', 'Ortolana'));
    }
```

**السطر 41:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->assertGreaterThanOrEqual(...)`: تؤكد أن actual لا تقل عن expected. مدخلاتها: expected وactual. العائد/الأثر: void أو فشل assertion.؛ `$drinks->count(...)`: تحسب عدد الصفوف/العناصر حسب المستقبِل. مدخلاتها: column اختيارية للـquery. العائد/الأثر: عدد؛ query count تنفّذ aggregate.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 42:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->assertTrue(...)`: تؤكد إن القيمة true فعلًا. مدخلاتها: actual ورسالة اختيارية. العائد/الأثر: لا نتيجة Boolean للنجاح؛ الفشل يرمي assertion failure.؛ `->every(...)`: تفحص أن كل العناصر تحقق predicate. مدخلاتها: callback. العائد/الأثر: Boolean.؛ `collect(...)`: حوّل array أو iterable إلى Collection في الذاكرة للاستفادة من map/filter/pluck؛ لا يقرأ DB وحده. مدخلاتها: array أو iterable أو قيمة يقبلها Collection constructor؛ الافتراضي قائمة فاضية. العائد/الأثر: Illuminate Support Collection object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 43:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `count(...)`: عد عناصر array أو Countable في الذاكرة؛ مختلف عن QueryBuilder->count الذي يجري aggregate SQL. مدخلاتها: array أو Countable ثم mode اختيارية. العائد/الأثر: int عدد العناصر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 44:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 45:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->assertGreaterThanOrEqual(...)`: تؤكد أن actual لا تقل عن expected. مدخلاتها: expected وactual. العائد/الأثر: void أو فشل assertion.؛ `count(...)`: عد عناصر array أو Countable في الذاكرة؛ مختلف عن QueryBuilder->count الذي يجري aggregate SQL. مدخلاتها: array أو Countable ثم mode اختيارية. العائد/الأثر: int عدد العناصر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 46:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->assertNotNull(...)`: تؤكد أن القيمة ليست null. مدخلاتها: actual. العائد/الأثر: void أو فشل assertion.؛ `->firstWhere(...)`: تقرأ أول عنصر يطابق حقلًا/قيمة. مدخلاتها: key/operator/value حسب الاستخدام. العائد/الأثر: العنصر أو null.؛ `collect(...)`: حوّل array أو iterable إلى Collection في الذاكرة للاستفادة من map/filter/pluck؛ لا يقرأ DB وحده. مدخلاتها: array أو iterable أو قيمة يقبلها Collection constructor؛ الافتراضي قائمة فاضية. العائد/الأثر: Illuminate Support Collection object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 47:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->assertNotNull(...)`: تؤكد أن القيمة ليست null. مدخلاتها: actual. العائد/الأثر: void أو فشل assertion.؛ `->firstWhere(...)`: تقرأ أول عنصر يطابق حقلًا/قيمة. مدخلاتها: key/operator/value حسب الاستخدام. العائد/الأثر: العنصر أو null.؛ `collect(...)`: حوّل array أو iterable إلى Collection في الذاكرة للاستفادة من map/filter/pluck؛ لا يقرأ DB وحده. مدخلاتها: array أو iterable أو قيمة يقبلها Collection constructor؛ الافتراضي قائمة فاضية. العائد/الأثر: Illuminate Support Collection object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 48:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 49–56

```php

    public function test_menu_items_are_returned_in_display_order(): void
    {
        $items = $this->getJson('/api/menu')->assertOk()->json('items');
        $pizzas = collect($items)->where('category_slug', 'pizzas')->values();

        $this->assertSame('Margherita Verace', $pizzas->first()['name']);
        $this->assertSame(range(1, 19), $pizzas->pluck('display_order')->all());
```

**السطر 50:** Function / تعريف دالة `test_menu_items_are_returned_in_display_order`؛ تعريفها مش تشغيلها. اختبر بداية البيتزا وdisplay_order من1ل19. مدخلاتها: items filtered pizzas. ناتجها: void assertions.

**السطر 51:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 52:** Assignment / إسناد: احسب `$this->getJson('/api/menu')->assertOk()->json('items')` الأول وخزّن النتيجة في `$items`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 53:** Assignment / إسناد: احسب `collect($items)->where('category_slug', 'pizzas')->values()` الأول وخزّن النتيجة في `$pizzas`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 55:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->assertSame(...)`: تقارن القيمة والنوع بشكل صارم. مدخلاتها: expected وactual. العائد/الأثر: void أو فشل assertion.؛ `$pizzas->first(...)`: تنفّذ query لجلب أول صف. مدخلاتها: columns اختيارية. العائد/الأثر: model أو stdClass حسب builder، أو null.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 56:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->assertSame(...)`: تقارن القيمة والنوع بشكل صارم. مدخلاتها: expected وactual. العائد/الأثر: void أو فشل assertion.؛ `$pizzas->pluck(...)`: هات قيمة عمود واحد، ومع key تاني تعمل قاموس بدل rows كاملة. مدخلاتها: value column ثم key column اختياري. العائد/الأثر: Collection قيم أو قاموس.؛ `->all(...)`: ترجع array العناصر الحالية. مدخلاتها: بدون arguments. العائد/الأثر: array؛ Model::all بدلًا منها تنفّذ query وترجع Collection.؛ `range(...)`: تنشئ array متتابعة من بداية لنهاية شاملة لو يمكن الوصول للنهاية بالخطوة؛ مثل range(1,3) تعطي1 و2 و3. لا تنفذ loop body من تلقاء نفسها. مدخلاتها: start، end، step اختيارية افتراضيها1. تدعم أرقامًا وبعض تسلسلات الأحرف؛ استخدم قيمًا متسقة وواضحة. العائد/الأثر: array تسلسل صاعد أو نازل حسب الطرفين. step غير صالحة مثل صفر تسبب ValueError؛ ما تستخدمش حدودًا ضخمة بدون حساب الذاكرة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 57–59

```php
    }
}

```

**السطر 57:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 58:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
