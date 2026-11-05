# 05 — أسئلة وأمثلة: قاعدة البيانات وEloquent

ذاكر مثال واحد كل مرة. المقتطفات للتفسير؛ مش تعليمات لحذف قاعدة بياناتك أو تشغيل migrations عشوائيًا. لا تستخدم `migrate:fresh` على مشروع عليه بيانات عايز تحتفظ بيها.

**تصحيح مهم:** الكود يدعم MySQL وSQLite حسب إعداد الاتصال، مش معنى وجود `database.sqlite` إنه المستخدم حاليًا. [config/database.php](../config/database.php) يقرأ `DB_CONNECTION`، والـ fallback فيه sqlite. اختبارات المشروع تضبط SQLite مؤقتة في الذاكرة عبر [phpunit.xml](../phpunit.xml). مش محتاج تفتح أو تشارك `.env` علشان تذاكر الأمثلة.

## 1. يعني إيه migration، وإزاي تمنع تكرار نفس المنتج في نفس الفرع؟

**مقتطف فعلي** داخل `up()` في [migration جدول branch_menu_item](../database/migrations/2026_06_14_000004_create_branch_menu_item_table.php). الاستيرادات `Schema` و`Blueprint` موجودة أعلى الملف؛ متشغّلوش كـ PHP مستقل.

```php
Schema::create('branch_menu_item', function (Blueprint $table) {
    $table->id();
    $table->foreignId('branch_id')->constrained()->cascadeOnDelete();
    $table->foreignId('menu_item_id')->constrained()->cascadeOnDelete();
    $table->decimal('price', 10, 2);
    $table->boolean('is_available')->default(true);
    $table->timestamps();

    $table->unique(['branch_id', 'menu_item_id']);
});
```

**كل سطر بيعمل إيه؟**

- `Schema::create`: إنشاء جدول جديد بالاسم المحدد. `::` استدعاء على facade؛ مش إضافة صف منتج.
- `function (Blueprint $table)`: دالة تستقبل أداة وصف الأعمدة. `{` بداية تعليمات إنشاء الجدول.
- `$table->id()`: عمود معرّف أساسي للصف. `$` لمتغير PHP و`->` للوصول إلى method على object.
- `foreignId('branch_id')`: عمود بيربط الصف بالفرع. `constrained()` يضيف قيد مرجعي للجدول المستنتج من الاسم.
- `cascadeOnDelete()`: حذف الفرع يؤدي لحذف صفوف الربط التابعة له. نفس الفكرة للسطر الخاص بـ `menu_item_id`.
- `decimal('price', 10, 2)`: رقم عشري دقيق، إجمالي أرقامه 10، منها رقمين بعد العلامة؛ مش 10 قبلها و2 بعدها.
- `boolean(...)->default(true)`: متاح افتراضيًا لو الإدخال ما حددش قيمة.
- `timestamps()`: إضافة `created_at` و`updated_at`.
- `unique(['branch_id', 'menu_item_id'])`: امنع تكرار **نفس الزوج**؛ مش معناه إن المنتج ممنوع يكون في فرع تاني.
- `});`: اقفل الدالة واستدعاء الإنشاء.

الـ migration توثيق قابل للتنفيذ لتغيير الهيكل. `up` يطبق التغيير، و`down` في المصدر يحذف الجدول عند rollback؛ rollback ممكن يفقد بيانات، فمش تجربة بريئة على قاعدة حقيقية.

**نفّذ بإيدك:** اكتب ثلاث أزواج: `(1, 7)` و`(2, 7)` و`(1, 7)`، وحدد أي صف يتعارض مع القيد.

**المتوقع:** الأول والتاني مختلفين؛ الثالث مكرر للأول ومرفوض.

**غلطة شائعة:** تعمل unique على `menu_item_id` وحده فتمنع المنتج من الظهور في أكثر من فرع، أو تعتمد على فحص JavaScript لمنع التكرار في قاعدة البيانات.

<details>
<summary>سؤال إنترفيو: الفرق بين migration وmodel؟</summary>

Migration تغيّر هيكل قاعدة البيانات. Model يتيح التعامل مع صفوفها وعلاقاتها من PHP. كتابة علاقة في model وحدها لا تنشئ foreign key في قاعدة البيانات.

</details>

## 2. الطلب الواحد فيه منتجات كتير؛ بنكتب العلاقة إزاي؟

**مقتطف فعلي** من [Order.php](../app/Models/Order.php). الدالة مكتوبة داخل class `Order` و`HasMany` مستوردة فوق.

```php
public function items(): HasMany
{
    return $this->hasMany(OrderItem::class);
}
```

**كل سطر بيعمل إيه؟**

- `public`: متاحة للكود اللي يتعامل مع Order، مش مقتصرة على نفس class.
- `function items()`: تعريف دالة علاقة اسمها `items` من اختيارنا. الأقواس فاضية لأن العلاقة مش محتاجة parameter هنا.
- `: HasMany`: نوع الـ object اللي الدالة ترجعّه: وصف علاقة واحد إلى متعدد، مش array منتجات جاهزة.
- `{`: بداية جسم الدالة.
- `return`: رجّع وصف العلاقة للمتصل.
- `$this`: الطلب الحالي؛ instance من model `Order`.
- `->hasMany(...)`: الطلب الحالي له صفوف متعددة في model آخر.
- `OrderItem::class`: اسم class الكامل الخاص ببند الطلب. مش استدعاء لبناء منتج جديد.
- `}`: نهاية الدالة.

Laravel يستنتج إن `order_items.order_id` بيربط البنود بالطلب. العلاقة العكسية موجودة باسم `order()` داخل [OrderItem.php](../app/Models/OrderItem.php) وبتستخدم `belongsTo`.

في PHP فيه فرق بين `$order->items()`، اللي بيرجع relation تقدر تضيف عليه query، و`$order->items`، اللي بيرجع مجموعة البنود ويحمّلها لو محتاج. وفي `OrderCreator` بنستخدم العلاقة لإنشاء بند؛ Laravel يربط `order_id` بالطلب الحالي.

الـ model كمان فيه `$fillable` لتحديد الحقول المسموح ملؤها جماعيًا. دي مش validation ولا صلاحيات؛ لازم server validation قبل إدخال بيانات العميل. الـ casts تحول تمثيل بعض القيم، مثل `total_price` إلى decimal بموضعين و`pickup_time` إلى تاريخ.

**نفّذ بإيدك:** على الورق، ارسم Order رقم 10 وبندين `order_id` بتاعهم 10 وبند `order_id` بتاعه 11. حدّد البنود اللي هتظهر للطلب 10. قراءة المشروع تكفي؛ متضيفش طلبات حقيقية.

**المتوقع:** أول بندين بس، مش كل منتجات المنيو.

**غلطة شائعة:** تخلط بين MenuItem، المنتج في الكتالوج، وOrderItem، بند شراء له كمية وسعر تاريخي.

<details>
<summary>سؤال إنترفيو: ليه OrderItem يحتفظ بسعره واسمه؟</summary>

لأن سعر واسم المنيو ممكن يتغيروا لاحقًا. `price` و`item_name` داخل بند الطلب بيمثلوا snapshot وقت الشراء، بدل تغيير تاريخ الفواتير مع تعديل الكتالوج.

</details>

## 3. نفس البيتزا سعرها مختلف حسب الفرع؛ نخزّن ده فين؟

**مقتطف فعلي** من [Branch.php](../app/Models/Branch.php). جدول الربط من السؤال الأول هو اللي بيخزن السعر والتوفر لكل زوج فرع/منتج.

```php
public function menuItems(): BelongsToMany
{
    return $this->belongsToMany(MenuItem::class)
        ->withPivot(['price', 'is_available'])
        ->withTimestamps();
}
```

**كل سطر بيعمل إيه؟**

- `public function menuItems()`: دالة العلاقة اللي نطلب منها منتجات الفرع.
- `: BelongsToMany`: نوع علاقة many-to-many. الفرع عنده منتجات كتير، ونفس المنتج موجود في فروع كتير.
- `return $this->belongsToMany(MenuItem::class)`: عرّف الطرف التاني للعلاقة. Laravel يستنتج جدول الربط `branch_menu_item` من الاسمين.
- `->withPivot(['price', 'is_available'])`: لما تحمل المنتجات، حمّل معاها الحقلين دول من صف الربط، مش من جدول menu_items.
- `->withTimestamps()`: خلي العلاقة تدير حقول وقت الإنشاء والتحديث في جدول الربط عند عمليات العلاقة المناسبة.
- `;`: نهاية سلسلة الاستدعاءات، و`}` نهاية الدالة.

`->` هنا بيتكرر لأن كل method بيرجع object يسمح بالاستدعاء اللي بعده؛ دي method chaining. `withPivot` مش اللي أنشأ الأعمدة؛ إنشاء الأعمدة حصل في migration.

في الاستخدام تقدر تقرأ `$item->pivot->price` عند تحميل المنتج عن طريق العلاقة. API المنيو الحالي يحول البيانات إلى `branch_options`؛ كل خيار فيه `branch_id` و`price` و`is_available`. مفيش سعر موحد مفروض على كل الفروع، والـ endpoint الحالي يرجّع الفروع الفعّالة بدل افتراض فلتر branch query قديم.

**نفّذ بإيدك:** اكتب بيانات افتراضية لنفس المنتج 7: سعره 190 في الفرع 1 و210 في الفرع 2. حدّد القيم اللي تتخزن في menu_items والقيم اللي تتخزن في pivot.

**المتوقع:** الاسم والوصف في menu_items، والسعر والتوفر في صف منفصل لكل فرع داخل pivot.

**غلطة شائعة:** تستخدم `$item->price` وتنسى إن السعر في هذا التصميم خاص بالـ pivot، أو تعدّل سعر الطلب القديم بمجرد تغيّر سعر المنيو.

<details>
<summary>سؤال إنترفيو: إمتى علاقة many-to-many تحتاج حقول زيادة في pivot؟</summary>

لما البيانات تخص العلاقة نفسها، مش أي طرف وحده؛ زي سعر المنتج وتوفره داخل فرع معين. نفس الفكرة ممكن تطبق على دور مستخدم داخل مشروع معين.

</details>

## 4. يعني إيه N+1، وإزاي `with` بتساعد؟

**مثال مبسّط من** [MenuController.php](../app/Http/Controllers/Api/MenuController.php). الأصل بيحمّل الفروع ويطبّق فلاتر إضافية؛ هنا ركّز على تحميل category فقط. الكود داخل method بعد استيراد `MenuItem`.

```php
$items = MenuItem::query()
    ->where('is_active', true)
    ->with('category')
    ->get();
foreach ($items as $item) {
    echo $item->category?->name;
}
```

**كل سطر بيعمل إيه؟**

- `$items = MenuItem::query()`: ابدأ query builder للمنتجات. لسه ما قريناش كل الصفوف.
- `->where('is_active', true)`: ضيف شرط المنتجات الفعّالة. ده اختصار تعليمي؛ الأصل بيشترط كمان category فعّالة.
- `->with('category')`: اطلب تحميل التصنيفات المطلوبة بشكل مجمّع بدل query منفصل لكل منتج عند قراءتها.
- `->get()`: نفّذ الاستعلام وارجع Collection من models؛ هنا التنفيذ الفعلي للقراءة.
- `foreach ($items as $item)`: مر على كل منتج. `$item` هو العنصر الحالي، زي متغير العنصر في `v-for` و`map`.
- `echo`: اطبع اسم التصنيف للتوضيح فقط؛ الـ API الفعلي بيرجع JSON بدل طباعة متناثرة.
- `$item->category?->name`: اقرأ اسم العلاقة لو موجودة. `?->` null-safe access؛ يمنع قراءة الخاصية على null.
- `}`: اقفل التكرار.

بدون eager loading، 20 منتج ممكن ينتج عنهم query للمنتجات وقراءات تصنيف إضافية مع الوصول للعلاقات؛ دي فكرة N+1. مع `with` غالبًا query للمنتجات وواحد للتصنيفات في علاقة belongsTo دي؛ مش بالضرورة JOIN واحد، ومش قاعدة إن أي `with` يعني استعلامين فقط لكل تصميم.

**نفّذ بإيدك:** علّم على السطر اللي بينفّذ query فعلًا، وبعدها اشرح إيه المتوقع يتغيّر لو شلت `with` مع استمرار قراءة category داخل الحلقة. ما تحتاجش تعدّل production.

**المتوقع:** `get` ينفّذ؛ حذف التحميل المسبق ممكن يزيد queries حسب البيانات وطريقة الوصول.

**غلطة شائعة:** تقول إن `with` تحوّل العلاقات تلقائيًا إلى SQL JOIN أو تمنع كل مشاكل الأداء، حتى لو لسه عندك query جوه حلقة في مكان آخر زي حساب بنود الطلب. وفي الأمان: Eloquent/query builder يربط قيم `where` كـ parameters بدل دمجها داخل SQL؛ ده يساعد ضد SQL injection للقيم، لكنه مش ضمان أمان أي raw SQL تكتبه. متجمعش input مستخدم داخل `DB::raw`، وأسماء الأعمدة/اتجاه الترتيب القادمة من العميل تحتاج allowlist؛ مش كل جزء من SQL قابل للـ parameter binding.

<details>
<summary>سؤال إنترفيو: إزاي تكتشف N+1؟</summary>

تراقب عدد وشكل queries أثناء طلب واحد بأدوات مناسبة للتطوير أو query logging آمن، وتشوف هل نفس نوع الاستعلام بيتكرر لكل عنصر. بعدين تستخدم eager loading أو batch query حسب الحالة.

</details>

## 5. الفرق بين Seeder وFactory وإزاي أعمل بيانات تدريب من غير لمس الحقيقي؟

**مثال تدريبي إضافي** مبني على [UserFactory.php](../database/factories/UserFactory.php) ونمط اختبارات [OrderOperationsTest.php](../tests/Feature/OrderOperationsTest.php). اكتبه داخل feature test له `RefreshDatabase` وفي بيئة testing معزولة فقط، مش Tinker على قاعدة شغلك.

```php
$user = User::factory()->make([
    'name' => 'Practice User',
    'role' => 'customer',
]);
$this->assertSame('customer', $user->role);
$this->assertFalse($user->exists);
```

**كل سطر بيعمل إيه؟**

- `User::factory()`: هات مصنع بيانات وهمية للـ User. `User` لازم تكون مستوردة في ملف الاختبار.
- `->make([`: كوّن model في الذاكرة بالقيم الافتراضية للمصنع مع التعديلات دي؛ ما تحفظوش في قاعدة البيانات.
- `'name' => 'Practice User'`: بدّل الاسم المولّد باسم واضح للتدريب.
- `'role' => 'customer'`: حدّد الدور بدل الاعتماد على default من غير ما تفهمه.
- `]);`: اقفل تعديلات الـ factory واستدعاء make.
- `$this->assertSame(...)`: assertion من PHPUnit؛ اتأكد إن القيمة والنوع هما المتوقعين.
- `$this->assertFalse($user->exists)`: اتأكد إن model لسه مش محفوظ. دي property على Eloquent، مش فحص لوجود الحساب في كل قواعد البيانات.

`create()` بدل `make()` تحفظ صفًا؛ متبدّلهمش على قاعدة حقيقية من غير قصد. Factory بتجهّز بيانات متنوعة للاختبارات، وSeeder بينظم تجهيز بيانات بداية/عرض للتطبيق وغالبًا بيكتب في قاعدة البيانات. الاتنين ممكن يستخدموا بعض، فمش الفرق إن واحد عشوائي دائمًا والتاني ثابت دائمًا.

المصدر الحالي [DatabaseSeeder.php](../database/seeders/DatabaseSeeder.php) بينادي MenuCatalogSeeder ثم StaffUserSeeder ثم DemoOrderSeeder. لا تشغّل seeders افتراضيًا على production، ولا تستخدم بيانات دخول الديمو لحساب حقيقي. مش مطلوب تنسخ أي كلمة سر للتعلّم.

**نفّذ بإيدك:** اكتب المثال داخل اختبار منفصل آمن، أو توقّع ناتجه على الورق لو لسه مش مجهّز بيئة اختبارات. إعدادات المشروع للاختبار تشير إلى sqlite `:memory:`؛ تحقق من عدم وجود override قبل أي تشغيل.

**المتوقع:** الاختباران ينجحوا، و`make` نفسها لا تضيف مستخدمًا إلى قاعدة البيانات.

**غلطة شائعة:** تشغّل `migrate:fresh --seed` على القاعدة اللي فيها طلباتك، أو تعتبر بيانات factory بيانات إنتاج صالحة.

<details>
<summary>سؤال إنترفيو: ليه نفصل بيانات الاختبار عن قاعدة التطوير؟</summary>

علشان النتائج تكون قابلة للتكرار من غير اعتماد على طلباتك الشخصية، وعلشان عمليات التنظيف أو إعادة بناء الجداول في الاختبارات ما تمسحش بياناتك الفعلية.

</details>

## 6. كل method بتاخد إيه وبترجّع إيه؟ نفصلها قبل ربط الملفات

### مجموعة إنشاء الجداول: دي مش methods لإضافة منتجات

كل الأسماء الجاية من Laravel Schema/Blueprint، مش دوال اخترعناها داخل المشروع. الـ callback بتوصف schema؛ تنفيذ migration هو اللي يغيّر هيكل DB، مش مجرد فتح الملف في المحرر.

- `Schema::create('branch_menu_item', callback)`: تاخد اسم الجدول ودالة تصف أعمدته؛ تنشئ الجدول أثناء migration. ما بترجعش model ولا قائمة منتجات. Laravel يمرّر `Blueprint` للدالة بنفسه.
- `$table->id()`: من غير arguments هنا؛ تضيف تعريف عمود primary key اسمه `id` بزيادة تلقائية وفق المحرك، وترجع column definition لو محتاج تعدّل إعداداته.
- `foreignId('branch_id')`: تاخد اسم العمود، وترجع تعريف عمود معرّف قابل لربطه بعلاقة مرجعية. لسه القيد نفسه مش اتحدد إلا عند `constrained`.
- `constrained()`: هنا بلا arguments؛ تستنتج `branches.id` من `branch_id` وتضيف foreign key definition؛ ترجع definition يسمح بتكملة `cascadeOnDelete`.
- `cascadeOnDelete()`: تضبط فعل القيد عند حذف الأب وترجع definition؛ مش بتبدأ حذفًا الآن. لو حصل حذف فرع لاحقًا فصفوف الربط التابعة هي اللي تتأثر حسب القيد.
- `decimal('price', 10, 2)`: الاسم، إجمالي عدد الأرقام، وعدد الأرقام العشرية. تضيف تعريف عمود وترجعه. مثال قيمة مناسبة للشكل `190.50`؛ مش معناه سعر افتراضي 10.2.
- `boolean('is_available')`: تضيف تعريف عمود Boolean وترجعه؛ `default(true)` على نفس التعريف تضبط قيمة DB عند غياب القيمة من INSERT، مش عند قراءة عنصر قديم.
- `timestamps()`: تضيف تعريفي `created_at/updated_at`، مش بتضيف صف سجل تاريخ كامل لكل تغيير.
- `unique(['branch_id', 'menu_item_id'])`: تضيف unique index على الزوج، وترجع تعريف index؛ البيانات المكررة مستقبلًا ترفضها DB. array هنا أسماء أعمدة، مش قيم فرع ومنتج.

`up()` و`down()` methods lifecycle في migration: Laravel ينادي المناسبة أثناء migrate/rollback. مش استدعاء بيحصل مع كل زيارة للمنيو. ما تشغّلش rollback على قاعدة فيها بيانات عايز تحتفظ بيها لمجرد التعلم.

### علاقة ولا بيانات؟ `items()` و`items` مش نفس الناتج

```php
$relation = $order->items();
$lines = $order->items;
```

- `items()` دالة مشروع مكتوبة في Order، لكنها ترجع علاقة Laravel `HasMany`. هي مش method JavaScript ولا array.
- `hasMany(OrderItem::class)` تاخد class الطرف الآخر وترجع relationship object فيه قيد الطلب الحالي. تعريف العلاقة وحده مش حفظ بند ومش إنشاء جدول.
- `$order->items` dynamic property في Eloquent: تحصل على Collection من البنود؛ لو العلاقة مش محمّلة ممكن Laravel يعمل query لتحميلها. لو محمّلة قبل كده يستخدم الموجود على model.
- علاقة `belongsTo(Order::class)` في OrderItem عكس الاتجاه: كل بند تابع لطلب واحد؛ قراءة `$line->order` ترجع Order أو null، مش Collection طلبات.

### ليه `create` بعد العلاقة بتعمل حاجة مختلفة عن قراءتها؟

**المقطع الحقيقي من OrderCreator:**

```php
$order->items()->create([
    'menu_item_id' => $line['menu_item_id'],
    'item_name' => $menuItem->name,
    'quantity' => $quantity,
    'price' => $price,
    'notes' => $line['notes'] ?? null,
]);
```

- `items()` أولًا ترجع العلاقة المقيدة بالطلب الحالي.
- `create([...])` method من Eloquent على العلاقة: تاخد attributes، تبني OrderItem، تعيّن `order_id` للطلب تلقائيًا، وتنفّذ INSERT. ترجع OrderItem المحفوظة، مش Boolean.
- المشروع مش بيحتفظ بالنتيجة في متغير هنا، لكن الـ INSERT حصل بالفعل. عدم كتابة `const/$variable =` لا يعني عدم وجود أثر.
- لو `$order->id` يساوي `10`، البند الناتج مربوط بـ `order_id = 10` حتى لو المفتاح مش مكتوب في array.

### Many-to-many: `belongsToMany` و`withPivot` و`withTimestamps`

- `belongsToMany(MenuItem::class)` method Laravel على الفرع ترجع relation object بين Branch وMenuItem عن طريق pivot؛ مش النتيجة المحمّلة بعد.
- `withPivot(['price', 'is_available'])` تاخد أسماء أعمدة إضافية للقراءة من pivot؛ ترجع نفس العلاقة لتكملة السلسلة، ولا تنشئ الأعمدة.
- `withTimestamps()` بلا arguments في المثال؛ تضبط إدارة أعمدة وقت الربط عند عمليات العلاقة المناسبة، وترجع العلاقة.
- بعد تحميل products عن طريق العلاقة، `$item->pivot` object يمثل صف الربط و`$item->pivot->price` قيمة سعر هذا الزوج تحديدًا. `pivot` خاصية وليست method.

### Query builder: السلسلة بتتبني الأول، والقراءة تحصل في الآخر

```php
$query = MenuItem::query();
$query->where('is_active', true);
$query->with('category');
$items = $query->get();
```

- `query()` method Eloquent تفتح builder وترجعه. لا ترجع كل المنتجات ولا تنفّذ SELECT هنا.
- `where('is_active', true)` تاخد اسم عمود وقيمة، وتضيف شرط مساواة؛ ترجع builder يسمح بسلسلة أخرى. ده مش `Array.filter`، لأن DB لسه ما رجعتش الصفوف.
- `with('category')` تسجّل العلاقة المطلوب eager loading لها وترجع builder؛ لا تطلب HTTP ولا ترجع category الآن.
- `get()` تنفّذ SELECT وخطوات eager loading المطلوبة ثم ترجع `Eloquent Collection` من MenuItem models. هنا تغير نوع الناتج من builder لنتائج فعلية.
- `orderBy('display_order')` تاخد اسم عمود واتجاه افتراضي ascending، تعدّل ترتيب الاستعلام وترجع builder؛ لا تعيد ترتيب array JavaScript.
- `find($id)` على Eloquent builder تنفّذ بحث primary key وترجع model أو null. `findOrFail($id)` تنفّذ نفس الفكرة لكن ترمي model-not-found لو لا يوجد؛ في سياق HTTP المعتاد ينتج 404.
- `first()` تنفّذ الاستعلام وترجع أول عنصر أو null، مش Collection؛ مع `DB::table(...)` ترجع record object مثل `stdClass`، ومع Eloquent ترجع model.
- `whereHas('category', callback)` تضيف شرط وجود علاقة تحقق شروط callback وترجع builder. callback هنا بتبني شرط SQL على العلاقة، مش بتمر على كل category في الواجهة.

### طرق النتائج: `map` و`values` و`pluck` مش query builder methods في كل موضع

```php
$names = $items->pluck('name')->all();
```

- هنا `$items` Collection محمّلة. `pluck('name')` من Laravel Collections تجمع هذه الخاصية من كل عنصر وترجع Collection جديدة.
- `all()` ترجع array PHP بالقيم؛ لا تنفّذ SELECT جديد في هذا الموضع.
- `map(callback)` على Collection تمرّر كل عنصر للدالة وتجمع ما ترجعه الدالة في Collection جديدة؛ لا تحفظ التعديلات في DB لمجرد إنك استخدمتها.
- `values()` تعيد فهرسة العناصر `0,1,2...` وترجع Collection؛ مفيدة قبل JSON بعد ترشيح ترك فهارس متقطعة.
- مثال: `collect(['a' => 'Pizza', 'b' => 'Drink'])->values()->all()` ناتجه `['Pizza', 'Drink']`. `collect` helper يغلّف array في Collection؛ مش database connection.

### إنشاء بيانات اختبار: اعرف فرق العائد والأثر

- `User::factory()` ترجع UserFactory، أي وصف توليد البيانات؛ لا user محفوظة حتى الآن.
- `make(['role' => 'customer'])` على factory ترجع User في الذاكرة، `exists` فيها false، ولا INSERT منها.
- `create(['role' => 'customer'])` على factory تبني وتحفظ وترجع User. نفس الاسم `create` موجود في model/relation لكن نوع الـ receiver يحدد السلوك والسياق.
- `assertSame(expected, actual)` من PHPUnit يقارن النوع والقيمة؛ لا يحوّل role ولا يحفظ user. النجاح مجرد عدم رمي assertion failure.
- `assertFalse($user->exists)` يتأكد إن التعبير false حرفيًا؛ `exists` هنا property على model، مش method `exists()` الخاصة بالاستعلام.

## 7. متابعة كاملة للسعر من الـ pivot حتى React

المثال التالي يكمّل سؤال «السعر وصل للواجهة إزاي؟» من غير ترك الجزء الناقص في ملف آخر.

### أ. علاقة MenuItem بفروعه: `app/Models/MenuItem.php`

**نفس تعريف العلاقة الفعلي، مع اختصار جسم class فقط:**

```php
public function branches(): BelongsToMany
{
    return $this->belongsToMany(Branch::class)
        ->withPivot(['price', 'is_available'])
        ->withTimestamps();
}
```

دي العلاقة العكسية لعلاقة Branch اللي شرحناها. `withPivot` هي اللي بتتيح قراءة `$branch->pivot->price` لما المنتج يتحمّل بفروعه.

### ب. التحميل والتحويل في `MenuController::index`

**مقتطفات فعلية متتابعة في المعنى؛ حذفنا أسماء باقي حقول المنتج فقط:**

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
    ->get()
    ->map(function (MenuItem $item) {
        return [
            'id' => $item->id,
            'name' => $item->name,
            'branch_options' => $item->branches->map(fn (Branch $branch) => [
                'branch_id' => $branch->id,
                'price' => $branch->pivot->price,
                'is_available' => (bool) $branch->pivot->is_available,
            ])->values(),
        ];
    });
```

- لحد `get()` بنتكلم عن بناء وتنفيذ query. بعد `get()` بنتعامل مع Collection في الذاكرة.
- `fn ($query) => ...` صيغة PHP arrow function؛ هنا تستقبل builder للعلاقة وتضيف شرطه. Laravel هو اللي يناديها.
- الـ map الخارجية تحول كل MenuItem لـ array للشبكة. الداخلية تحول فروع المنتج لخيارات أسعار. ولا واحدة منهم تضيف صف DB.
- `?->` اللي في بقية المصدر اختصار قراءة آمنة لما العلاقة null؛ مش method.

وفي آخر نفس method:

```php
return response()->json([
    'branches' => $branches,
    'categories' => $categories,
    'items' => $items,
]);
```

ده رد HTTP JSON: models/Collections تتحول لتمثيل JSON، مش كود PHP بيتبعت للمتصفح علشان يشغله.

### ج. React تستقبل النتيجة: `CatalogContext.jsx`

```jsx
const response = await csrfFetch('/api/menu');
setCatalog({
    branches: response.branches || [],
    categories: response.categories || [],
    items: response.items || [],
});
```

- `csrfFetch` helper المشروع يرجّع payload المفكوكة، مش Response خام. تنفيذه الشبكي يقابل route `GET /api/menu` اللي ينادي `MenuController::index`.
- `setCatalog` setter React تضع object جديد في state، فتتحدث المكوّنات المشتركة في CatalogContext. ترجع undefined؛ الأثر هو تحديث الحالة.
- `|| []` fallback لو القيمة المقروءة falsy، مش تحميل من DB ثانية.

### د. اختيار سعر الفرع: الدالة الحقيقية في نفس Context

```js
export function branchOption(item, branchId) {
    return item?.branch_options?.find((option) =>
        Number(option.branch_id) === Number(branchId)
    ) || null;
}
```

- `branchOption` دالة مشروع وليست Laravel method؛ مدخلها item الذي وصل في JSON ومعرّف الفرع.
- `?.` توقف القراءة بأمان لو item أو branch_options مش موجودة، بدل TypeError.
- `find(callback)` هنا **JavaScript Array method**: تعيد أول object مطابق، أو undefined؛ ليست `Eloquent::find` اللي قرأت DB قبل كده.
- `Number(...)` دالة JavaScript تحول القيمة لرقم؛ `Number('2')` نتيجتها `2`. لا تصلح كل إدخال غلط؛ غير الصالح قد يعطي NaN.
- `|| null` يخلي عدم العثور نتيجة واضحة null.

**مثال قيمي للتجربة، مش تعديل أسعار مشروعك:** لو options فيها `{ branch_id: 1, price: '190.00' }` و`{ branch_id: 2, price: '210.00' }`، استدعاء `branchOption(item, 2)` يرجع object الفرع الثاني. الوصول لـ `.price` بعد فحص وجود النتيجة يعطي `'210.00'`. كده اتتبع السعر من عمود pivot لحد JavaScript.

التالي: [06 — من الـ route إلى controller وservice](06-routes-controllers-and-server.md). تطبيق الاختبارات والتشغيل الآمن في [15 — الاختبارات وGit وتصحيح الأخطاء](15-testing-git-and-debugging.md).
