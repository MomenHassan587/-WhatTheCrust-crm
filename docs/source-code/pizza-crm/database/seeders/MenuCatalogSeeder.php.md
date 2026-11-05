# داتا المنيو الأساسية وأسعار الفروع

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `database/seeders/MenuCatalogSeeder.php` · 105 سطر.

**وظيفة الملف:** upsert للفروع الثلاثة والأقسام السبعة والمنتجات وpivot لكل فرع. المنتجات أسعارها في tuples داخل seeder ثم تتحول لbranch_menu_item rows؛ metadata اسم/صورة/tag تحفظ في menu_items. لا تختزل الملف إلى foreach وتتجاهل آخر upsert.

**نوعه:** support. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../database/seeders/MenuCatalogSeeder.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Http/Controllers/Api/MenuController.php](../../app/Http/Controllers/Api/MenuController.php.md)

- [pizza-crm/database/migrations/2026_06_14_000004_create_branch_menu_item_table.php](../migrations/2026_06_14_000004_create_branch_menu_item_table.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MenuCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        DB::table('branches')->upsert([
            ['id' => 1, 'name' => 'The Drive', 'location' => 'The Drive by Waterway, New Cairo', 'phone' => '+2 0101 599 6039', 'opening_hours' => '4 PM - 2 AM', 'display_order' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'name' => 'Golf Central', 'location' => 'Golf Central, Palm Hills, 6th of October', 'phone' => null, 'opening_hours' => null, 'display_order' => 2, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 3, 'name' => 'LakeHouse', 'location' => 'LakeHouse The Club, Dusit Thani, New Cairo', 'phone' => '+2 0103 314 4388', 'opening_hours' => '12 PM - 12 AM', 'display_order' => 3, 'created_at' => $now, 'updated_at' => $now],
        ], ['id'], ['name', 'location', 'phone', 'opening_hours', 'display_order', 'updated_at']);

        DB::table('categories')->upsert([
            ['id' => 1, 'name' => 'Pizzas', 'slug' => 'pizzas', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'name' => 'Sandwiches', 'slug' => 'sandwiches', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 3, 'name' => 'Drinks', 'slug' => 'drinks', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 4, 'name' => 'Dips', 'slug' => 'dips', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 5, 'name' => 'Desserts', 'slug' => 'desserts', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 6, 'name' => 'Starters', 'slug' => 'starters', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 7, 'name' => 'Salads', 'slug' => 'salads', 'created_at' => $now, 'updated_at' => $now],
        ], ['id'], ['name', 'slug', 'updated_at']);

        $items = [
            [1, 1, 'Margherita Verace', 'Italian tomatoes, fresh mozzarella, fresh basil, parmesan, and extra virgin olive oil.', 425, null, 'The Queen'],
            [2, 1, 'Diavola', 'Italian tomatoes, fresh mozzarella, salami, dried chili, basil, parmesan, and olive oil.', 470, '/images/menu/diavola.webp', 'The Devil\'s Pie'],
            [3, 1, 'Quattro Formaggi', 'Fresh mozzarella, smoked mozzarella, gorgonzola, parmesan, basil, and olive oil.', 500, '/images/menu/quattro-formaggi.webp', 'Cheese Lover'],
            [4, 1, 'Al Pesto', 'Homemade pesto, fresh mozzarella, sundried tomatoes, basil, and parmesan.', 580, '/images/menu/al-pesto.webp', 'The Green One'],
            [5, 1, 'Carnivora', 'Italian tomatoes, mozzarella, salami, Italian sausage, bresaola, parmesan, and basil.', 555, '/images/menu/carnivora.webp', 'Meat Lover'],
            [6, 1, 'La Sbagliata', 'Homemade pesto, fresh mozzarella, Italian tomatoes, parmesan, and basil.', 560, '/images/menu/la-sbagliata.webp', 'Upside Down'],
            [7, 1, 'Capricciosa', 'Italian tomatoes, mozzarella, mushrooms, salami, artichokes, basil, and parmesan.', 525, '/images/menu/capricciosa.webp', 'The Wild One'],
            [8, 1, 'La Tartufata', 'Truffle cream, fresh mozzarella, mushrooms, parmesan, basil, and olive oil.', 595, null, 'Truffle Lover'],
            [31, 1, 'Marinara Estiva', 'Cherry tomatoes, parmesan, fresh basil, and extra virgin olive oil.', 300, null, 'Summery Sailor'],
            [32, 1, 'Margherita Estiva', 'Cherry tomatoes, fresh mozzarella, parmesan, basil, and extra virgin olive oil.', 450, null, 'Summery Queen'],
            [33, 1, 'Marinara', 'Italian tomatoes, oregano, garlic, and extra virgin olive oil.', 275, null, 'Sailor\'s Pie'],
            [34, 1, 'Scarpariello', 'Italian tomatoes, sundried tomatoes, garlic, oregano, parmesan, basil, olive oil, and black pepper.', 330, null, 'Shoemaker\'s Pie'],
            [35, 1, 'Cosacca', 'Italian tomatoes, garlic, oregano, parmesan, basil, olive oil, and black pepper.', 315, null, 'King\'s Pie'],
            [36, 1, 'Ai Funghi', 'Italian tomatoes, fresh mozzarella, mushrooms, basil, parmesan, and olive oil.', 480, null, 'Mushroom Pie'],
            [37, 1, 'Romana', 'Italian tomatoes, fresh mozzarella, anchovies, Kalamata olives, basil, parmesan, and olive oil.', 450, null, 'Roman Pie'],
            [38, 1, 'Ripieno', 'Fresh mozzarella, salami, mushrooms, Italian tomatoes, basil, parmesan, and olive oil.', 490, null, 'Calzone'],
            [39, 1, 'Tonno E Cipolla', 'Italian tomatoes, mozzarella, tuna, red onion, Kalamata olives, parmesan, and basil.', 575, null, 'Tuna Pie'],
            [40, 1, 'Canadian All-Dressed', 'Italian tomatoes, mozzarella, mushrooms, salami, red onions, peppers, parmesan, and basil.', 510, null, 'Loaded'],
            [41, 1, 'Ortolana', 'Italian tomatoes, mozzarella, zucchini, aubergine, peppers, parmesan, and basil.', 450, null, 'Vegetarian'],
            [9, 2, 'Panuozzo Al Tonno', 'Italian tomatoes, mozzarella, tuna, red onion, olives, parmesan, basil, and lemon sauce.', 320, null, 'Cold Sandwich'],
            [10, 2, 'Panuozzo Al Roast Beef', 'Roast beef, fresh tomatoes, mozzarella, basil, and creamy pesto.', 310, null, 'Cold Sandwich'],
            [11, 2, 'Panuozzo Alla Caprese', 'Italian tomatoes, fresh mozzarella, basil, parmesan, and olive oil.', 240, null, 'Cold Sandwich'],
            [12, 2, 'Panuozzo Al Duck Bacon', 'Duck bacon, mozzarella, mixed leaves, red onion, pesto Caesar sauce, and lemon zest.', 285, null, 'Cold Sandwich'],
            [42, 2, 'Rotolo Al Salami', 'Tomato sauce, mozzarella, mushrooms, salami, pickled onions, basil, parmesan, and arugula.', 255, null, 'Hot Sandwich'],
            [43, 2, 'Rotolo Al Pesto', 'Pesto, mozzarella, sundried tomatoes, basil, parmesan, arugula, balsamic, and almonds.', 275, null, 'Hot Sandwich'],
            [44, 2, 'Panino Al Roast Beef', 'Roast beef, salami spread, mozzarella, artichokes, sundried tomatoes, arugula, and pesto.', 345, null, 'Hot Sandwich'],
            [45, 2, 'Panino Al Tartufo', 'Truffle cream, mozzarella, mushrooms, peppers, zucchini, aubergine, and parmesan.', 250, null, 'Hot Sandwich'],
            [13, 4, 'Marinara Dip', 'Marinara sauce for dipping.', 60, '/images/menu/marinara-dip.webp', 'Crust Dip'],
            [14, 4, 'Creamy Pesto Crust Dippers', 'Crust pieces served with a creamy pesto dip.', 80, '/images/menu/pesto-dip.webp', 'Crust Dip'],
            [15, 4, 'Creamy Truffle', 'A creamy sauce infused with truffle.', 110, null, 'Crust Dip'],
            [16, 5, 'Impasto Al Cacao', 'Cocoa dough with chocolate hazelnut spread, nuts, whipped cream, and sugar.', 385, '/images/menu/impasto-al-cacao.webp', 'House Special'],
            [17, 5, 'Ripieno Al Gianduia', 'Folded sweet dough filled with chocolate hazelnut cream and dusted with sugar.', 295, '/images/menu/ripieno-al-gianduia.webp', 'Nutella Calzone'],
            [18, 5, 'Tiramisu', 'House tiramisu served with a special creamy sauce.', 210, '/images/menu/tiramisu.webp', 'Italian'],
            [19, 3, 'Water', 'Mineral water.', 20, null, 'Cold'],
            [20, 3, 'Sodas', 'Assorted carbonated soft drinks.', 30, null, 'Cold'],
            [21, 3, 'Lemonade', 'A refreshing drink made with fresh lemons.', 115, null, 'Fresh'],
            [22, 3, 'Iced Tea', 'Chilled brewed tea.', 110, '/images/menu/iced-tea.webp', 'Cold'],
            [23, 3, 'Red Bull', 'Energy drink with caffeine, taurine, and B-group vitamins.', 75, null, 'Energy'],
            [24, 6, 'Garlic Bread', 'Aromatic garlic butter on pizza dough.', 250, '/images/menu/garlic-bread.webp', 'Shareable'],
            [25, 6, 'Mozzarella Sticks', 'Crispy mozzarella sticks served hot.', 145, '/images/menu/mozzarella-sticks.webp', 'Cheesy'],
            [30, 6, 'Montanarina', 'Fried pizza dough with sweet marinara and parmesan.', 225, '/images/menu/montanarina.webp', 'Neapolitan'],
            [47, 6, 'Truffled Crochette', 'Potato croquettes, truffle paste, and house truffle dip.', 260, null, 'Truffle'],
            [26, 7, 'Insalata Arrostita', 'Zucchini, peppers, aubergine, mushrooms, pesto, feta, herbs, and lemon vinaigrette.', 235, '/images/menu/insalata-arrostita.webp', 'Roasted'],
            [27, 7, 'Insalata Di Tonno', 'Mixed leaves, tuna, roasted peppers, pickled onions, tomatoes, olives, and lemon dressing.', 375, '/images/menu/insalata-di-tonno.webp', 'Protein'],
            [28, 7, 'Greek Salad', 'Mixed leaves, cucumber, peppers, onions, olives, tomatoes, crumbs, oregano, and Greek dressing.', 265, '/images/menu/greek-salad.webp', 'Fresh'],
            [29, 7, 'House Caesar', 'Romaine, cherry tomatoes, pesto Caesar dressing, parmesan, and pizza dough crumbs.', 340, '/images/menu/house-caesar.webp', 'House Pick'],
            [46, 7, 'Caprese De Buffala', 'Cherry tomatoes, buffalo mozzarella, basil, and balsamic glaze.', 295, null, 'Fresh'],
        ];

        DB::table('menu_items')->upsert(array_map(fn ($item, $index) => [
            'id' => $item[0], 'category_id' => $item[1], 'name' => $item[2],
            'description' => $item[3], 'image_path' => $item[5], 'tag' => $item[6],
            'display_order' => $index + 1, 'created_at' => $now, 'updated_at' => $now,
        ], $items, array_keys($items)), ['id'], ['category_id', 'name', 'description', 'image_path', 'tag', 'display_order', 'updated_at']);

        $multipliers = [1 => 1.00, 2 => 1.00, 3 => 1.00];
        $unavailable = [1 => [22], 2 => [8, 16], 3 => [9]];
        $rows = [];
        foreach ($multipliers as $branchId => $multiplier) {
            foreach ($items as $item) {
                $rows[] = [
                    'branch_id' => $branchId,
                    'menu_item_id' => $item[0],
                    'price' => round($item[4] * $multiplier, 2),
                    'is_available' => ! in_array($item[0], $unavailable[$branchId], true),
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
            }
        }

        DB::table('branch_menu_item')->upsert($rows, ['branch_id', 'menu_item_id'], ['price', 'is_available', 'updated_at']);
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### run

أنشئ أو حدّث catalogue ثم ابنِ أسعار/availability كل فرع حسب multipliers/unavailable.

- **بتاخد إيه؟ Inputs:** arrays ثابتة داخل الملف والوقت الحالي.

- **بترجع/بتغيّر إيه؟ Return / effect:** void؛ تكتب DB وupsert قد يعدّل بيانات موجودة مطابقة للمفاتيح.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### now

- **جاية منين؟** Laravel Date helper / Carbon

- **وظيفتها:** أنشئ object يمثل الوقت الحالي بتوقيت التطبيق أو المنطقة المطلوبة؛ ليست JS Date.now التي ترجع milliseconds.

- **المدخلات — Arguments:** timezone اختيارية؛ المشروع غالبًا بدون arguments.

- **الناتج/الأثر — Return / effect:** Carbon date-time object يمكن تنسيقها أو إضافة دقائق لها؛ ليست string تلقائيًا.

- **أول موضع هنا:** السطر 12.

- **مثال:** now()->addMinutes(20)

### DB::table

- **جاية منين؟** Laravel Database Query Builder

- **وظيفتها:** ابدأ query لجدول بالاسم من غير Eloquent Model؛ لا يقرأ rows ولا يغيّر schema بمجرد استدعائه.

- **المدخلات — Arguments:** اسم الجدول string، مع alias اختيارية؛ في المشروع اسم فقط.

- **الناتج/الأثر — Return / effect:** Illuminate Database Query Builder؛ كمّل عليه where ثم first/get/update/insert لتنفيذ العملية.

- **أول موضع هنا:** السطر 102.

- **مثال:** DB::table('branch_menu_item')->where('branch_id', $branch->id)->first();

### ->upsert

- **جاية منين؟** Laravel Query Builder

- **وظيفتها:** اكتب rows كتير دفعة واحدة: insert للجديد وupdate عند تعارض unique key؛ DB indexes مهمة.

- **المدخلات — Arguments:** rows وuniqueBy وupdate columns.

- **الناتج/الأثر — Return / effect:** affected result حسب driver؛ الكود لا يستخدمها.

- **أول موضع هنا:** السطر 102.

- **مثال:** DB::table('branch_menu_item')->upsert($rows, ['branch_id', 'menu_item_id'], ['price']);

### array_map

- **جاية منين؟** PHP built-in

- **وظيفتها:** طبّق callback على العناصر وابنِ array جديدة من نتائجها؛ seeder تحول tuples المنتجات إلى rows مناسبة للـ upsert.

- **المدخلات — Arguments:** callback ثم array واحدة أو أكثر؛ seeder تمرر items وarray_keys(items) كمدخلين متوازيين.

- **الناتج/الأثر — Return / effect:** array نتائج؛ لا تكتب DB إلا عند upsert التالية.

- **أول موضع هنا:** السطر 80.

- **مثال:** array_map(fn ($item, $index) => ['id' => $item[0], 'display_order' => $index + 1], $items, array_keys($items))

### array_keys

- **جاية منين؟** PHP built-in

- **وظيفتها:** هات مفاتيح array الحالية في قائمة؛ seeder تستخدمها كـ index أثناء array_map.

- **المدخلات — Arguments:** array ثم search_value وstrict اختياريان لو مطلوب فلترة المفاتيح.

- **الناتج/الأثر — Return / effect:** array من المفاتيح، مش قيم العناصر.

- **أول موضع هنا:** السطر 84.

- **مثال:** array_keys($items)

### round

- **جاية منين؟** PHP built-in

- **وظيفتها:** قرّب رقمًا حسب precision؛ الدفع يستخدمها بعد ضرب total في100 ثم cast إلىint، وده مختلف عن تقريب سعر للعرض فقط.

- **المدخلات — Arguments:** number ثم precision اختيارية افتراضي0 ثم rounding mode اختيارية.

- **الناتج/الأثر — Return / effect:** float نتيجة التقريب؛ cast(int) في payment يحوّلها بعد ذلك إلىinteger.

- **أول موضع هنا:** السطر 94.

- **مثال:** (int) round(((float) $order->total_price) * 100)

### in_array

- **جاية منين؟** PHP built-in

- **وظيفتها:** هل قيمة موجودة في array؟ المعامل الثالث true يمنع تحويل الأنواع أثناء المقارنة.

- **المدخلات — Arguments:** needle ثم haystack ثم strict bool.

- **الناتج/الأثر — Return / effect:** bool.

- **أول موضع هنا:** السطر 95.

- **مثال:** in_array($status, $allowed, true)

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MenuCatalogSeeder extends Seeder
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** namespace بتحدد نطاق أسماء الكلاس `Database\Seeders`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 5:** use / استيراد الاسم `Illuminate\Database\Seeder` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** use / استيراد الاسم `Illuminate\Support\Facades\DB` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 8:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

### السطور 9–16

```php
{
    public function run(): void
    {
        $now = now();

        DB::table('branches')->upsert([
            ['id' => 1, 'name' => 'The Drive', 'location' => 'The Drive by Waterway, New Cairo', 'phone' => '+2 0101 599 6039', 'opening_hours' => '4 PM - 2 AM', 'display_order' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'name' => 'Golf Central', 'location' => 'Golf Central, Palm Hills, 6th of October', 'phone' => null, 'opening_hours' => null, 'display_order' => 2, 'created_at' => $now, 'updated_at' => $now],
```

**السطر 9:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 10:** Function / تعريف دالة `run`؛ تعريفها مش تشغيلها. أنشئ أو حدّث catalogue ثم ابنِ أسعار/availability كل فرع حسب multipliers/unavailable. مدخلاتها: arrays ثابتة داخل الملف والوقت الحالي. ناتجها: void؛ تكتب DB وupsert قد يعدّل بيانات موجودة مطابقة للمفاتيح.

**السطر 11:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 12:** Assignment / إسناد: احسب `now()` الأول وخزّن النتيجة في `$now`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 14:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `DB::table(...)`: ابدأ query لجدول بالاسم من غير Eloquent Model؛ لا يقرأ rows ولا يغيّر schema بمجرد استدعائه. مدخلاتها: اسم الجدول string، مع alias اختيارية؛ في المشروع اسم فقط. العائد/الأثر: Illuminate Database Query Builder؛ كمّل عليه where ثم first/get/update/insert لتنفيذ العملية.؛ `->upsert(...)`: اكتب rows كتير دفعة واحدة: insert للجديد وupdate عند تعارض unique key؛ DB indexes مهمة. مدخلاتها: rows وuniqueBy وupdate columns. العائد/الأثر: affected result حسب driver؛ الكود لا يستخدمها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 15:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 16:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 17–24

```php
            ['id' => 3, 'name' => 'LakeHouse', 'location' => 'LakeHouse The Club, Dusit Thani, New Cairo', 'phone' => '+2 0103 314 4388', 'opening_hours' => '12 PM - 12 AM', 'display_order' => 3, 'created_at' => $now, 'updated_at' => $now],
        ], ['id'], ['name', 'location', 'phone', 'opening_hours', 'display_order', 'updated_at']);

        DB::table('categories')->upsert([
            ['id' => 1, 'name' => 'Pizzas', 'slug' => 'pizzas', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 2, 'name' => 'Sandwiches', 'slug' => 'sandwiches', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 3, 'name' => 'Drinks', 'slug' => 'drinks', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 4, 'name' => 'Dips', 'slug' => 'dips', 'created_at' => $now, 'updated_at' => $now],
```

**السطر 17:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 18:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 20:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `DB::table(...)`: ابدأ query لجدول بالاسم من غير Eloquent Model؛ لا يقرأ rows ولا يغيّر schema بمجرد استدعائه. مدخلاتها: اسم الجدول string، مع alias اختيارية؛ في المشروع اسم فقط. العائد/الأثر: Illuminate Database Query Builder؛ كمّل عليه where ثم first/get/update/insert لتنفيذ العملية.؛ `->upsert(...)`: اكتب rows كتير دفعة واحدة: insert للجديد وupdate عند تعارض unique key؛ DB indexes مهمة. مدخلاتها: rows وuniqueBy وupdate columns. العائد/الأثر: affected result حسب driver؛ الكود لا يستخدمها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 21:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 22:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 23:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 24:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 25–32

```php
            ['id' => 5, 'name' => 'Desserts', 'slug' => 'desserts', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 6, 'name' => 'Starters', 'slug' => 'starters', 'created_at' => $now, 'updated_at' => $now],
            ['id' => 7, 'name' => 'Salads', 'slug' => 'salads', 'created_at' => $now, 'updated_at' => $now],
        ], ['id'], ['name', 'slug', 'updated_at']);

        $items = [
            [1, 1, 'Margherita Verace', 'Italian tomatoes, fresh mozzarella, fresh basil, parmesan, and extra virgin olive oil.', 425, null, 'The Queen'],
            [2, 1, 'Diavola', 'Italian tomatoes, fresh mozzarella, salami, dried chili, basil, parmesan, and olive oil.', 470, '/images/menu/diavola.webp', 'The Devil\'s Pie'],
```

**السطر 25:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 26:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 27:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 28:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 30:** Assignment / إسناد: احسب `[` الأول وخزّن النتيجة في `$items`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 31:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 32:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 33–40

```php
            [3, 1, 'Quattro Formaggi', 'Fresh mozzarella, smoked mozzarella, gorgonzola, parmesan, basil, and olive oil.', 500, '/images/menu/quattro-formaggi.webp', 'Cheese Lover'],
            [4, 1, 'Al Pesto', 'Homemade pesto, fresh mozzarella, sundried tomatoes, basil, and parmesan.', 580, '/images/menu/al-pesto.webp', 'The Green One'],
            [5, 1, 'Carnivora', 'Italian tomatoes, mozzarella, salami, Italian sausage, bresaola, parmesan, and basil.', 555, '/images/menu/carnivora.webp', 'Meat Lover'],
            [6, 1, 'La Sbagliata', 'Homemade pesto, fresh mozzarella, Italian tomatoes, parmesan, and basil.', 560, '/images/menu/la-sbagliata.webp', 'Upside Down'],
            [7, 1, 'Capricciosa', 'Italian tomatoes, mozzarella, mushrooms, salami, artichokes, basil, and parmesan.', 525, '/images/menu/capricciosa.webp', 'The Wild One'],
            [8, 1, 'La Tartufata', 'Truffle cream, fresh mozzarella, mushrooms, parmesan, basil, and olive oil.', 595, null, 'Truffle Lover'],
            [31, 1, 'Marinara Estiva', 'Cherry tomatoes, parmesan, fresh basil, and extra virgin olive oil.', 300, null, 'Summery Sailor'],
            [32, 1, 'Margherita Estiva', 'Cherry tomatoes, fresh mozzarella, parmesan, basil, and extra virgin olive oil.', 450, null, 'Summery Queen'],
```

**السطر 33:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 34:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 35:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 36:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 37:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 38:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 39:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 40:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 41–48

```php
            [33, 1, 'Marinara', 'Italian tomatoes, oregano, garlic, and extra virgin olive oil.', 275, null, 'Sailor\'s Pie'],
            [34, 1, 'Scarpariello', 'Italian tomatoes, sundried tomatoes, garlic, oregano, parmesan, basil, olive oil, and black pepper.', 330, null, 'Shoemaker\'s Pie'],
            [35, 1, 'Cosacca', 'Italian tomatoes, garlic, oregano, parmesan, basil, olive oil, and black pepper.', 315, null, 'King\'s Pie'],
            [36, 1, 'Ai Funghi', 'Italian tomatoes, fresh mozzarella, mushrooms, basil, parmesan, and olive oil.', 480, null, 'Mushroom Pie'],
            [37, 1, 'Romana', 'Italian tomatoes, fresh mozzarella, anchovies, Kalamata olives, basil, parmesan, and olive oil.', 450, null, 'Roman Pie'],
            [38, 1, 'Ripieno', 'Fresh mozzarella, salami, mushrooms, Italian tomatoes, basil, parmesan, and olive oil.', 490, null, 'Calzone'],
            [39, 1, 'Tonno E Cipolla', 'Italian tomatoes, mozzarella, tuna, red onion, Kalamata olives, parmesan, and basil.', 575, null, 'Tuna Pie'],
            [40, 1, 'Canadian All-Dressed', 'Italian tomatoes, mozzarella, mushrooms, salami, red onions, peppers, parmesan, and basil.', 510, null, 'Loaded'],
```

**السطر 41:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 42:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 43:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 44:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 45:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 46:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 47:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 48:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 49–56

```php
            [41, 1, 'Ortolana', 'Italian tomatoes, mozzarella, zucchini, aubergine, peppers, parmesan, and basil.', 450, null, 'Vegetarian'],
            [9, 2, 'Panuozzo Al Tonno', 'Italian tomatoes, mozzarella, tuna, red onion, olives, parmesan, basil, and lemon sauce.', 320, null, 'Cold Sandwich'],
            [10, 2, 'Panuozzo Al Roast Beef', 'Roast beef, fresh tomatoes, mozzarella, basil, and creamy pesto.', 310, null, 'Cold Sandwich'],
            [11, 2, 'Panuozzo Alla Caprese', 'Italian tomatoes, fresh mozzarella, basil, parmesan, and olive oil.', 240, null, 'Cold Sandwich'],
            [12, 2, 'Panuozzo Al Duck Bacon', 'Duck bacon, mozzarella, mixed leaves, red onion, pesto Caesar sauce, and lemon zest.', 285, null, 'Cold Sandwich'],
            [42, 2, 'Rotolo Al Salami', 'Tomato sauce, mozzarella, mushrooms, salami, pickled onions, basil, parmesan, and arugula.', 255, null, 'Hot Sandwich'],
            [43, 2, 'Rotolo Al Pesto', 'Pesto, mozzarella, sundried tomatoes, basil, parmesan, arugula, balsamic, and almonds.', 275, null, 'Hot Sandwich'],
            [44, 2, 'Panino Al Roast Beef', 'Roast beef, salami spread, mozzarella, artichokes, sundried tomatoes, arugula, and pesto.', 345, null, 'Hot Sandwich'],
```

**السطر 49:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 50:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 51:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 52:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 53:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 54:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 55:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 56:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 57–64

```php
            [45, 2, 'Panino Al Tartufo', 'Truffle cream, mozzarella, mushrooms, peppers, zucchini, aubergine, and parmesan.', 250, null, 'Hot Sandwich'],
            [13, 4, 'Marinara Dip', 'Marinara sauce for dipping.', 60, '/images/menu/marinara-dip.webp', 'Crust Dip'],
            [14, 4, 'Creamy Pesto Crust Dippers', 'Crust pieces served with a creamy pesto dip.', 80, '/images/menu/pesto-dip.webp', 'Crust Dip'],
            [15, 4, 'Creamy Truffle', 'A creamy sauce infused with truffle.', 110, null, 'Crust Dip'],
            [16, 5, 'Impasto Al Cacao', 'Cocoa dough with chocolate hazelnut spread, nuts, whipped cream, and sugar.', 385, '/images/menu/impasto-al-cacao.webp', 'House Special'],
            [17, 5, 'Ripieno Al Gianduia', 'Folded sweet dough filled with chocolate hazelnut cream and dusted with sugar.', 295, '/images/menu/ripieno-al-gianduia.webp', 'Nutella Calzone'],
            [18, 5, 'Tiramisu', 'House tiramisu served with a special creamy sauce.', 210, '/images/menu/tiramisu.webp', 'Italian'],
            [19, 3, 'Water', 'Mineral water.', 20, null, 'Cold'],
```

**السطر 57:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 58:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 59:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 60:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 61:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 62:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 63:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 64:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 65–72

```php
            [20, 3, 'Sodas', 'Assorted carbonated soft drinks.', 30, null, 'Cold'],
            [21, 3, 'Lemonade', 'A refreshing drink made with fresh lemons.', 115, null, 'Fresh'],
            [22, 3, 'Iced Tea', 'Chilled brewed tea.', 110, '/images/menu/iced-tea.webp', 'Cold'],
            [23, 3, 'Red Bull', 'Energy drink with caffeine, taurine, and B-group vitamins.', 75, null, 'Energy'],
            [24, 6, 'Garlic Bread', 'Aromatic garlic butter on pizza dough.', 250, '/images/menu/garlic-bread.webp', 'Shareable'],
            [25, 6, 'Mozzarella Sticks', 'Crispy mozzarella sticks served hot.', 145, '/images/menu/mozzarella-sticks.webp', 'Cheesy'],
            [30, 6, 'Montanarina', 'Fried pizza dough with sweet marinara and parmesan.', 225, '/images/menu/montanarina.webp', 'Neapolitan'],
            [47, 6, 'Truffled Crochette', 'Potato croquettes, truffle paste, and house truffle dip.', 260, null, 'Truffle'],
```

**السطر 65:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 66:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 67:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 68:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 69:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 70:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 71:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 72:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 73–80

```php
            [26, 7, 'Insalata Arrostita', 'Zucchini, peppers, aubergine, mushrooms, pesto, feta, herbs, and lemon vinaigrette.', 235, '/images/menu/insalata-arrostita.webp', 'Roasted'],
            [27, 7, 'Insalata Di Tonno', 'Mixed leaves, tuna, roasted peppers, pickled onions, tomatoes, olives, and lemon dressing.', 375, '/images/menu/insalata-di-tonno.webp', 'Protein'],
            [28, 7, 'Greek Salad', 'Mixed leaves, cucumber, peppers, onions, olives, tomatoes, crumbs, oregano, and Greek dressing.', 265, '/images/menu/greek-salad.webp', 'Fresh'],
            [29, 7, 'House Caesar', 'Romaine, cherry tomatoes, pesto Caesar dressing, parmesan, and pizza dough crumbs.', 340, '/images/menu/house-caesar.webp', 'House Pick'],
            [46, 7, 'Caprese De Buffala', 'Cherry tomatoes, buffalo mozzarella, basil, and balsamic glaze.', 295, null, 'Fresh'],
        ];

        DB::table('menu_items')->upsert(array_map(fn ($item, $index) => [
```

**السطر 73:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 74:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 75:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 76:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 77:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 78:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 80:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `DB::table(...)`: ابدأ query لجدول بالاسم من غير Eloquent Model؛ لا يقرأ rows ولا يغيّر schema بمجرد استدعائه. مدخلاتها: اسم الجدول string، مع alias اختيارية؛ في المشروع اسم فقط. العائد/الأثر: Illuminate Database Query Builder؛ كمّل عليه where ثم first/get/update/insert لتنفيذ العملية.؛ `->upsert(...)`: اكتب rows كتير دفعة واحدة: insert للجديد وupdate عند تعارض unique key؛ DB indexes مهمة. مدخلاتها: rows وuniqueBy وupdate columns. العائد/الأثر: affected result حسب driver؛ الكود لا يستخدمها.؛ `array_map(...)`: طبّق callback على العناصر وابنِ array جديدة من نتائجها؛ seeder تحول tuples المنتجات إلى rows مناسبة للـ upsert. مدخلاتها: callback ثم array واحدة أو أكثر؛ seeder تمرر items وarray_keys(items) كمدخلين متوازيين. العائد/الأثر: array نتائج؛ لا تكتب DB إلا عند upsert التالية.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 81–88

```php
            'id' => $item[0], 'category_id' => $item[1], 'name' => $item[2],
            'description' => $item[3], 'image_path' => $item[5], 'tag' => $item[6],
            'display_order' => $index + 1, 'created_at' => $now, 'updated_at' => $now,
        ], $items, array_keys($items)), ['id'], ['category_id', 'name', 'description', 'image_path', 'tag', 'display_order', 'updated_at']);

        $multipliers = [1 => 1.00, 2 => 1.00, 3 => 1.00];
        $unavailable = [1 => [22], 2 => [8, 16], 3 => [9]];
        $rows = [];
```

**السطر 81:** PHP array entry: المفتاح `id` مرتبط بالقيمة `$item[0], 'category_id' => $item[1], 'name' => $item[2]`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 82:** PHP array entry: المفتاح `description` مرتبط بالقيمة `$item[3], 'image_path' => $item[5], 'tag' => $item[6]`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 83:** PHP array entry: المفتاح `display_order` مرتبط بالقيمة `$index + 1, 'created_at' => $now, 'updated_at' => $now`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 84:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `array_keys(...)`: هات مفاتيح array الحالية في قائمة؛ seeder تستخدمها كـ index أثناء array_map. مدخلاتها: array ثم search_value وstrict اختياريان لو مطلوب فلترة المفاتيح. العائد/الأثر: array من المفاتيح، مش قيم العناصر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 86:** Assignment / إسناد: احسب `[1 => 1.00, 2 => 1.00, 3 => 1.00]` الأول وخزّن النتيجة في `$multipliers`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 87:** Assignment / إسناد: احسب `[1 => [22], 2 => [8, 16], 3 => [9]]` الأول وخزّن النتيجة في `$unavailable`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 88:** Assignment / إسناد: احسب `[]` الأول وخزّن النتيجة في `$rows`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

### السطور 89–96

```php
        foreach ($multipliers as $branchId => $multiplier) {
            foreach ($items as $item) {
                $rows[] = [
                    'branch_id' => $branchId,
                    'menu_item_id' => $item[0],
                    'price' => round($item[4] * $multiplier, 2),
                    'is_available' => ! in_array($item[0], $unavailable[$branchId], true),
                    'created_at' => $now,
```

**السطر 89:** Loop / حلقة مرور؛ تعيد تنفيذ الجسم حسب الشرط/العناصر. راقب المتغير الحالي وما الذي يتغيّر في كل دورة.

**السطر 90:** Loop / حلقة مرور؛ تعيد تنفيذ الجسم حسب الشرط/العناصر. راقب المتغير الحالي وما الذي يتغيّر في كل دورة.

**السطر 91:** Assignment / إسناد: احسب القيمة على يمين = وخزّنها في المتغير أو خاصية الـobject على الشمال. -> وصول لخاصية/دالة object، و:: وصول static/facade حسب التعريف.

**السطر 92:** PHP array entry: المفتاح `branch_id` مرتبط بالقيمة `$branchId`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 93:** PHP array entry: المفتاح `menu_item_id` مرتبط بالقيمة `$item[0]`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 94:** PHP array entry: المفتاح `price` مرتبط بالقيمة `round($item[4] * $multiplier, 2)`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 95:** PHP array entry: المفتاح `is_available` مرتبط بالقيمة `! in_array($item[0], $unavailable[$branchId], true)`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 96:** PHP array entry: المفتاح `created_at` مرتبط بالقيمة `$now`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 97–104

```php
                    'updated_at' => $now,
                ];
            }
        }

        DB::table('branch_menu_item')->upsert($rows, ['branch_id', 'menu_item_id'], ['price', 'is_available', 'updated_at']);
    }
}
```

**السطر 97:** PHP array entry: المفتاح `updated_at` مرتبط بالقيمة `$now`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 98:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 99:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 100:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 102:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `DB::table(...)`: ابدأ query لجدول بالاسم من غير Eloquent Model؛ لا يقرأ rows ولا يغيّر schema بمجرد استدعائه. مدخلاتها: اسم الجدول string، مع alias اختيارية؛ في المشروع اسم فقط. العائد/الأثر: Illuminate Database Query Builder؛ كمّل عليه where ثم first/get/update/insert لتنفيذ العملية.؛ `->upsert(...)`: اكتب rows كتير دفعة واحدة: insert للجديد وupdate عند تعارض unique key؛ DB indexes مهمة. مدخلاتها: rows وuniqueBy وupdate columns. العائد/الأثر: affected result حسب driver؛ الكود لا يستخدمها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 103:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 104:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
