# 15 — أتأكد إن الكود صح وأشرح ده في الإنترفيو؟

[الفهرس](00-start-here.md) · اقرأ JavaScript وطلبات API قبل الاختبارات. الأمثلة التعليمية متنفّذش ضد بيانات الشغل الحقيقية.

## سؤال 1: أختبر حساب الإجمالي بدون فتح المتصفح؟

**مثال تدريبي إضافي**، مستقل عن تطبيق الدفع. اعمل `total.practice.mjs` في فولدر تدريب منفصل:

```js
import assert from 'node:assert/strict';
function calculateTotal(items) {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
assert.equal(calculateTotal([{ price: 50, quantity: 2 }]), 100);
assert.equal(calculateTotal([]), 0);
console.log('Passed');
```

1. أداة assertions الموجودة في Node؛ strict تقارن بدون تحويل أنواع تلقائي.
2. دالة تاخد قائمة.
3. تجمع قيمة كل سطر؛ صفر قيمة البداية.
4. نهاية الدالة.
5. شغّل الحساب وقارن النتيجة المتوقعة 100؛ لو مختلفة assertion ترمي خطأ.
6. اختبر حالة حدّية: سلة فاضية.
7. اطبع Passed لو مفيش assertion فشلت.

شغّل من فولدر التدريب:

```powershell
node total.practice.mjs
```

**بإيدك:** غيّر المتوقع إلى 90. المفروض الاختبار يفشل؛ رجّعه 100 بعد التجربة.

**غلطة شائعة:** اختبار حالة النجاح فقط، ونسيان الفاضي والحدود والأخطاء.

**سؤال إنترفيو:** ليه دي قريبة من Unit Test؟

<details><summary>الإجابة</summary>بتختبر دالة صغيرة معزولة بدون HTTP أو DB أو متصفح. اختبارات مشروع Pizza الفعلية موجودة في tests/demo/orders.test.mjs ومش كلها unit لأن بعضها يختبر تدفق demo كامل.</details>

المصدر الحقيقي للمقارنة: [اختبارات demo](../tests/demo/orders.test.mjs).

## سؤال 2: أختبر GET /api/menu في Laravel؟

**مثال مبسّط** من [MenuApiTest](../tests/Feature/MenuApiTest.php). ضعه كـ method جديدة داخل نفس test class لو بتطبّق يدويًا؛ الـ class الموجودة فيها RefreshDatabase وبتعمل seed للكتالوج في setUp:

```php
public function test_menu_has_items_for_practice(): void
{
    $response = $this->getJson('/api/menu');
    $response->assertOk();
    $response->assertJsonStructure(['branches', 'categories', 'items']);
    $response->assertJsonPath('items.0.id', 1);
}
```

1. public method للاختبار؛ الاسم يبدأ test_؛ void معناها مش بترجع قيمة.
2. بداية الجسم.
3. `$this` test case الحالية؛ `->` استدعاء method؛ getJson ينفّذ طلب اختباري مع توقع JSON.
4. تأكد status 200.
5. تأكد وجود مفاتيح الاستجابة.
6. تأكد معرّف أول منتج 1 حسب seeder المستخدم؛ مش افتراض لكل قاعدة بيانات.
7. نهاية الاختبار.

قبل تشغيل أي اختبار DB: راجع [phpunit.xml](../phpunit.xml). إعداد المشروع وقت المراجعة testing + SQLite `:memory:`؛ خليك متأكد مفيش إعداد خارجي/كاش بيحوّله لقاعدة حقيقية. متستخدمش `migrate:fresh` على قاعدة شغل.

```powershell
php artisan test --filter=MenuApiTest
```

**بإيدك:** غيّر path إلى `items.0.id` بقيمة متوقعة غلط داخل الاختبار فقط وشوف الفشل، ثم رجّعه.

**غلطة شائعة:** تفسّر مرور اختبار القائمة إنه دليل إن الدفع أو صلاحيات الموظفين سليمة. كل سلوك يحتاج اختبار خاص.

**سؤال إنترفيو:** Unit ولا Feature؟

<details><summary>الإجابة</summary>Feature لأنه يعدّي عبر HTTP routing وLaravel والـ DB الاختبارية، مش دالة واحدة معزولة.</details>

## سؤال 3: أختار حالات اختبار مهمة من المشروع؟

قبل قراءة [OrderOperationsTest](../tests/Feature/OrderOperationsTest.php)، جاوب:

1. لو العميل بعت total_price = 1، هل السيرفر يعتمده؟ المتوقع لأ؛ يعيد الحساب من بيانات الفرع.
2. لو staff لفرع 1 حاول يعدّل طلب فرع آخر؟ المتوقع رفض الوصول وفق كود السيرفر؛ بعض المسارات تخفي وجود الطلب بـ404.
3. لو تعديل حالة الطلب جاي من شاشة قديمة؟ المتوقع رفض التعارض، مش الكتابة فوق تحديث أحدث.
4. لو webhook اتبعت مرتين؟ لازم تختبر عدم تكرار الأثر؛ الاختبار المتسلسل لا يثبت الأمان من السباق المتزامن وحده.

**بإيدك:** اختار حالة واحدة، واقرأ اسم test اللي بيغطيها، وحدد Arrange البيانات وAct الطلب وAssert التوقع.

**غلطة شائعة:** كتابة test يكرّر نفس منطق التطبيق لحساب النتيجة المتوقعة؛ ممكن نفس الغلط ينجح في الاتنين.

**سؤال إنترفيو:** النجاح في كل الاختبارات يضمن انعدام الأخطاء؟

<details><summary>الإجابة</summary>لأ؛ يثبت الحالات اللي اختبرناها فقط، وجودة الدليل تعتمد على تغطية السيناريوهات والحدود.</details>

## سؤال 4: أكتشف ليه سعر الخدمة مش بيظهر؟

**مثال تدريبي إضافي** من الغلطة اللي قابلتك:

```js
const selectedServiceId = '2';
const services = [{ id: 2, price: 300 }];
const selected = services.find((item) => item.id === selectedServiceId);
console.log(typeof selectedServiceId);
console.log(selected);
```

1. القيمة نص بين اقتباسات.
2. id رقم.
3. المقارنة الصارمة تفشل لاختلاف النوع؛ find ترجع undefined.
4. typeof يطبع string.
5. يطبع undefined؛ ده يفسّر غياب السعر قبل ما تلوم CSS.

**بإيدك:** قارن بـ `Number(selectedServiceId)` بعد التأكد إن المدخل صالح؛ المتوقع object السعر 300. في Vue select المثال الصحيح `:value="service.id"` يمرّر الرقم أصلًا.

**غلطة شائعة:** تغيّر `===` إلى `==` بدون فهم أصل اختلاف البيانات.

**سؤال إنترفيو:** بتبدأ debugging منين؟

<details><summary>الإجابة</summary>أعيد إنتاج المشكلة، أقرأ أول Console error، أفحص المدخلات وأنواعها، أتابع Network لو فيه API، ثم أصلح السبب وأضيف اختبارًا مناسبًا. مابغيّرش خمس حاجات مرة واحدة.</details>

## سؤال 5: أستخدم Git من غير ما أضيّع شغلي؟

المشاريع وقت المراجعة مش كلها مهيّأة كـ Git repository. الأوامر دي **تدريب في repo موجودة**، مش دليل إنها اتنفّذت هنا:

```powershell
git status
git diff
git add resources/js/components/ServicePractice.vue
git diff --staged
git commit -m "Add service selection practice"
```

1. شوف الفرع والملفات المتغيرة.
2. راجع التعديلات غير المضافة.
3. جهّز الملف المقصود فقط؛ المسار مثال لازم موجود عندك.
4. راجع بالضبط اللي هيدخل commit.
5. احفظ snapshot محلية برسالة توضّح التغيير؛ مش نشر على الإنترنت.

**بإيدك:** اشرح الفرق بين working tree وstaging وcommit قبل التنفيذ.

**غلطة شائعة:** `git add .` بدون مراجعة ممكن يضيف أسرار أو ملفات مش مقصودة. متضيفش .env أو قواعد البيانات أو مفاتيح الدفع، ومتستخدمش أوامر reset/clean المدمّرة لتجربة الحظ.

**سؤال إنترفيو:** commit هي push؟

<details><summary>الإجابة</summary>لأ؛ commit سجل محلي، push يرسل commits إلى remote وده إجراء منفصل.</details>

## سؤال 6: أقيس تقدمي إزاي؟

بدون نسخ الإجابات، اختار ميزة واحدة مثل اختيار خدمة أو إضافة منتج للسلة:

1. اكتب البيانات المطلوبة.
2. اعرضها ثم ضيف التفاعل.
3. اختبر نجاح وفشل ومدخل فاضي.
4. قول بصوتك كل سطر بيعمل إيه.
5. اشرح مصدر الحقيقة: frontend للعرض، backend للأمان والحسابات الموثوقة.

المطلوب مش حفظ المشروع كله؛ المطلوب تقدر تبني جزء صغير، تصلّح غلطته، وتبرّر قرارك.

## سؤال 7: method الاختبار بتغيّر التطبيق ولا بتفحصه؟

التمييز ده أساسي. `getJson` تشغّل طلبًا اختباريًا، لكن `assertOk` تفحص الرد الناتج، مش تصلّح كود السيرفر.

### `assert.equal` في مثال Node

```js
assert.equal(calculateTotal([{ price: 50, quantity: 2 }]), 100);
```

- `calculateTotal(...)` دالة تدريب من عندنا؛ تحسب وترجع رقمًا. ليست من Node أو من API الدفع.
- `assert.equal(actual, expected)` method من module `node:assert/strict` المستوردة. الأول الناتج الحقيقي، والثاني المتوقع؛ تحت هذا الاستيراد المقارنة صارمة.
- لو القيم متساوية، ترجع `undefined` وتسمح باستمرار البرنامج؛ **لا ترجع true** علشان تختبرها بـ if.
- لو مختلفة، ترمي `AssertionError` ويقف المسار ما لم تمسك الخطأ. لا تغيّر actual إلى expected.
- `console.log('Passed')` method Console تطبع للـ terminal هنا لأن التنفيذ Node، ولا ترجع نتيجة الاختبار كبيانات؛ تظهر فقط لو كل assertions اللي قبلها مرت.

### `reduce`: method الحساب التي بنختبرها

```js
return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
```

- `reduce(callback, initialValue)` JavaScript Array method تختزل عناصر array لقيمة واحدة.
- `sum` اسم accumulator، يبدأ بـ `0` لأننا مرّرناها كـ initialValue. `item` العنصر الحالي.
- callback ترجع `sum` الجديدة بعد جمع قيمة السطر. لما array تخلص، reduce ترجع accumulator الأخيرة.
- مثال عنصرين `50 × 2` و`30 × 1`: accumulator تمشي `0 → 100 → 130`؛ النتيجة `130`.
- array فاضية مع initialValue `0` ترجع `0`. من غير initialValue، reduce على array فاضية ترمي TypeError.
- method لا تحفظ طلبًا ولا تغيّر عناصر array تلقائيًا؛ الدالة التدريبية pure طالما callback لا تعدّل مدخلاتها.

### methods إعداد الاختبار في Laravel

- `setUp()` method lifecycle من PHPUnit/Laravel يناديها framework قبل كل test. مش دالة بتتنادى عند كل HTTP request في تطبيق العميل.
- `parent::setUp()` يستدعي تجهيز framework في الـ class الأب. مش خطوة اختيارية نشيلها لمجرد إن test بتعمل seed.
- `seed(MenuCatalogSeeder::class)` method Laravel test تشتغل seeder على **قاعدة الاختبار**؛ لها أثر كتابة بيانات وليست قراءة ملف فقط. لا تنقل نفس الفكرة عشوائيًا إلى production.
- `RefreshDatabase` trait تدير تهيئة/عزل DB بين tests حسب البيئة. ليست method بنناديها كـ `RefreshDatabase()`؛ ولها تأثير حقيقي على قاعدة الاتصال المختارة للاختبار.
- `User::factory()->create([...])` تبني وتحفظ user في DB الاختبار وترجع model؛ `make` بدلها تبني في الذاكرة فقط. لا تعاملها كأنها assertion.

### `getJson` ثم `assertOk` ثم `json`

```php
$response = $this->getJson('/api/menu');
$response->assertOk();
$items = $response->json('items');
```

- `$this` test case الحالية. `getJson($uri, $headers = [])` method Laravel تختبر GET داخل التطبيق بإعدادات JSON وترجع `TestResponse`؛ ليست fetch من المتصفح ولا تحتاج تشغيل artisan serve.
- `assertOk()` method على TestResponse تتأكد HTTP 200، وترجع نفس TestResponse للـ chaining عند النجاح. عند الفشل assertion failure؛ **لا ترجع بيانات المنيو ولا Boolean**.
- `json('items')` على TestResponse تقرأ JSON المفكوكة من body تحت المفتاح items وترجع قيمته. `json()` بلا path ترجع payload كاملة. لا تنادي controller مرة أخرى.
- `json` هنا ليست `response()->json` في controller: الأولى تقرأ body اختبار، والثانية تبني استجابة سيرفر. receiver هو اللي يحدد معنى الاسم.

### methods فحص body والـ DB

- `assertJsonStructure(['branches', 'categories', 'items'])`: تأكد من شكل مفاتيح JSON؛ ترجع TestResponse للـ chaining. لا تثبت الأسعار الصحيحة أو الصلاحيات لمجرد وجود المفاتيح.
- `assertJsonPath('items.0.id', 1)`: تصل للمسار المتداخل وتفحص تطابق قيمته مع المتوقع. `0` أول عنصر، مش اسم عمود DB.
- `assertJsonCount(3, 'items.0.branch_options')`: تفحص عدد العناصر داخل ذلك الجزء من الرد. ليست عدد صفوف الجدول كله.
- `assertCreated()` تفحص HTTP 201؛ `assertUnprocessable()` تفحص 422؛ `assertForbidden()` تفحص 403. كلها assertions، لا تغيّر الاستجابة لتناسب المتوقع.
- `assertJsonValidationErrors('pickup_time')`: تتحقق من وجود خطأ validation للحقل في رد JSON؛ لا تنفّذ قواعد التحقق بنفسها.
- `$this->assertSame($expected, $actual)` من PHPUnit تقارن القيمة والنوع بدقة. عند النجاح لا ترجع بيانات مفيدة؛ عند الفشل ترمي assertion failure. ترتيب المتوقع/الحقيقي هنا عكس مثال Node السابق.
- `assertDatabaseHas($table, $attributes)` method Laravel test تنفّذ فحص DB وتتأكد من وجود صف مطابق للحقول، ولا تضيف صفًا ولا تعدّل حالة الطلب. المثال لا يثبت uniqueness وحده.
- `assertDatabaseCount($table, $count)` تفحص عدد كل صفوف الجدول في قاعدة الاختبار؛ العدد ليس عدد صفوف request الأخيرة فقط.
- `assertGreaterThanOrEqual($expectedMinimum, $actual)` تفحص الحد الأدنى؛ `assertNotNull($actual)` تفحص عدم كون القيمة null. أسماء assertions لا تعني أنها تنشئ بيانات ناقصة.

## سؤال 8: نكمّل اختبار المنيو من test إلى controller ثم نرجع للـ assertion

**ده مقتطف فعلي مكتمل method من `MenuApiTest`، وأسماء البيانات من seeder المشروع وقت المراجعة:**

```php
public function test_menu_items_are_returned_in_display_order(): void
{
    $items = $this->getJson('/api/menu')->assertOk()->json('items');
    $pizzas = collect($items)->where('category_slug', 'pizzas')->values();

    $this->assertSame('Margherita Verace', $pizzas->first()['name']);
    $this->assertSame(range(1, 19), $pizzas->pluck('display_order')->all());
}
```

### أ. قبل method الاختبار

**داخل نفس test class في المصدر:**

```php
use RefreshDatabase;

protected function setUp(): void
{
    parent::setUp();
    $this->seed(MenuCatalogSeeder::class);
}
```

دي بداية المثال المرتبطة به؛ من غير بيانات seeder لا يصح افتراض اسم أول بيتزا ولا عدد ترتيب 19. في class لازم imports الأصلية موجودة، مش ملف PHP مستقل تنسخ فيه method وحدها.

### ب. الطلب يمر فعليًا على route وcontroller

**السطر الفعلي داخل prefix('api') في routes:**

```php
Route::get('/menu', [MenuController::class, 'index']);
```

**جزء الاستعلام الفعلي المتصل في `MenuController::index` قبل تحويل الحقول:**

```php
$items = MenuItem::query()
    ->where('is_active', true)
    ->whereHas('category', fn ($query) => $query->where('is_active', true))
    ->with(['category', 'branches' => fn ($query) => $query
        ->where('branches.is_active', true)
        ->orderBy('branches.display_order')])
    ->orderBy('category_id')
    ->orderBy('display_order')
    ->orderBy('id')
    ->get();
```

في المصدر `map` بعد get تحوّل models إلى arrays فيها `category_slug` و`display_order` وباقي حقول المنتج، ثم آخر method:

```php
return response()->json([
    'branches' => $branches,
    'categories' => $categories,
    'items' => $items,
]);
```

ده موضع السلوك اللي test بتفحصه: `orderBy` تضيف ترتيبًا لـ query و`get` تنفّذها؛ response الافتراضي 200. نسخة controller الفعلية لا تطبع echo أثناء الاختبار.

### ج. بعد رجوع HTTP response، نكمل test سطر سطر

```php
$items = $this->getJson('/api/menu')->assertOk()->json('items');
```

`getJson` رجعت TestResponse، و`assertOk` فحصتها ورجعتها، و`json('items')` رجعت array المنتجات. لذلك `$items` في test array، مش builder ولا TestResponse.

```php
$pizzas = collect($items)->where('category_slug', 'pizzas')->values();
```

- `collect` helper Laravel تغلّف array في Collection.
- `where` هنا على Collection **تفلتر بيانات موجودة في الذاكرة**، لا تعمل SQL query. تاخد اسم خاصية وقيمة وترجع Collection مطابقة.
- `values` تعيد فهرسة النتائج من صفر، لا تعيد ترتيبها تصاعديًا. الترتيب نفسه جاي من controller.

```php
$this->assertSame('Margherita Verace', $pizzas->first()['name']);
```

`first()` على Collection ترجع أول عنصر أو null. هنا الأول array لأن الرد JSON مفكوك، فنقرأ `['name']`، مش `->name`. الاختبار يتوقع وجود منتجات بعد seed.

```php
$this->assertSame(range(1, 19), $pizzas->pluck('display_order')->all());
```

- `range(1, 19)` دالة PHP ترجع array الأعداد من 1 إلى 19 شاملة الطرفين.
- `pluck('display_order')` تجمع أرقام الترتيب الموجودة بالفعل في Collection جديدة.
- `all()` تحول Collection إلى array خام للمقارنة.
- assertSame تقارن القائمتين بقيمهما وأنواعهما وترتيبهما؛ لا ترتّب القائمة قبل الفحص لتخبّي خطأ controller.

**النهاية:** نجاح test يعني كتالوج بيانات الاختبار رجع بترتيب متوقع في هذا السيناريو. لا يعني شبكة المستخدم أو Stripe أو جميع الصلاحيات سليمة تلقائيًا.

## سؤال 9: الاختبار بيستبدل Stripe إزاي من غير اتصال حقيقي؟

**المقاطع التالية متصلة من `test_verified_payment_webhook_marks_order_paid_once`، مع اختصار تجهيز Order فقط:**

```php
$event = (object) [
    'type' => 'payment_intent.succeeded',
    'data' => (object) ['object' => (object) ['id' => 'pi_test']],
];

$gateway = new class($event) implements PaymentGateway {
    public function __construct(private object $event) {}

    public function createIntent(int $amount, string $currency, array $metadata, string $idempotencyKey): array
    {
        return [];
    }

    public function parseWebhook(string $payload, string $signature): object
    {
        return $this->event;
    }
};

$this->app->instance(PaymentGateway::class, $gateway);
$this->postJson('/api/payments/webhook', [], ['Stripe-Signature' => 'valid'])->assertOk();
$this->postJson('/api/payments/webhook', [], ['Stripe-Signature' => 'valid'])->assertOk();
$this->assertDatabaseHas('orders', ['id' => $order->id, 'payment_status' => 'paid', 'status' => 'new']);
$this->assertDatabaseCount('order_status_logs', 1);
```

- `new class(...) implements PaymentGateway` anonymous PHP class؛ fake تنفيذ للعقد مش الـ SDK الحقيقي.
- `__construct` constructor تستقبل event وتحتفظ بها في private property، مش method API باسم تختاره في URL.
- `instance(contract, object)` على Laravel container تسجل **object موجودة** بدل binding الافتراضي. Laravel تمرّر نفس fake لما controller تطلب PaymentGateway.
- `parseWebhook` هنا دالة fake ترجع event المحضّرة بصرف النظر عن التوقيع، علشان نعزل منطق التعامل مع الحدث. النص `'valid'` مش توقيع Stripe صالح خارج الاختبار.
- `postJson(uri, data, headers)` ترسل طلب POST اختباري داخل التطبيق وترجع TestResponse. الـ route تنادي webhook، والـ controller تستدعي fake ثم تبحث عن gateway_reference=`pi_test` وتحدّث الطلب.
- في إعداد الاختبار المصدر أنشأ `$order` بحالة `payment_pending` وpayment_status `pending` وgateway_reference `pi_test`؛ من غيره لا يثبت المثال نفس السلوك.
- الطلب الثاني يمر عبر نفس controller لكن شرط paid يمنع تاريخًا ثانيًا في التنفيذ المتتابع. بعد الرد نفحص DB، مش مجرد النص المرسل للمتصفح.
- **حد الاختبار:** يثبت التكرار المتتابع ومنطق DB، ولا يختبر Stripe signature verification أو حدثين متزامنين. الـ fake createIntent ترجع array فارغة لأنها مش مستخدمة في السيناريو؛ لو بدأت تختبر endpoint إنشاء Intent لازم fake مناسبة لذلك العقد والناتج.

## سؤال 10: الديباجينج والتغييرات المحلية — وظيفة كل أداة

- `typeof value` JavaScript operator لا method؛ يعطي نص نوع القيمة مثل `'string'`. لا يحوّل النص لرقم.
- `services.find(callback)` Array method ترجع أول عنصر يحقق callback أو undefined. اختلاف `2` عن `'2'` مع `===` سبب بيانات، مش CSS.
- `Number('2')` يحوّل لرقم `2`، و`Number('abc')` يرجع NaN؛ لا تصلح كل input بمجرد التحويل.
- `git status` أمر يعرض وضع working tree/staging؛ لا يغيّر الكود ولا ينشره.
- `git diff` يعرض فروق غير staged؛ `git diff --staged` يعرض الفروق المجهزة مقارنة بالـ commit. كلاهما قراءة فقط.
- `git add path` يحدّث نسخة الملف في staging؛ لا يحفظ commit ولا يرفع remote. راجع الملف والأسرار قبلها.
- `git commit -m message` ينشئ commit محلية من staged changes؛ يرجع نجاح/فشل كأمر، لا ينشر تلقائيًا.

مش مطلوب تنفّذ أوامر كتابة علشان تفهمها الآن. ركّز: مين بيقرأ؟ مين بيغيّر؟ مين بيرجع بيانات؟ ومين بيرمي خطأ لو التوقع ما اتحققش؟
