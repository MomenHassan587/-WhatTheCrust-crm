# حسابات الموظفين التجريبية من إعدادات آمنة

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `database/seeders/StaffUserSeeder.php` · 48 سطر.

**وظيفة الملف:** يتوقف مع warning لو passwords غير مهيأة، ويعمل حساب staff لكل فرع نشط ثم admin بلا فرع. يقرأ أسماء env variables فقط؛ المذكرات لا يجب أن تنسخ قيم الأسرار من .env.

**نوعه:** support. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../database/seeders/StaffUserSeeder.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Models/Branch.php](../../app/Models/Branch.php.md)

- [pizza-crm/app/Models/User.php](../../app/Models/User.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StaffUserSeeder extends Seeder
{
    public function run(): void
    {
        $staffPassword = env('STAFF_PASSWORD');
        $adminPassword = env('ADMIN_PASSWORD') ?: $staffPassword;

        if (! $staffPassword || ! $adminPassword) {
            $this->command?->warn('STAFF_PASSWORD and ADMIN_PASSWORD must be set before staff accounts can be seeded.');
            return;
        }

        Branch::query()->where('is_active', true)->each(function (Branch $branch) use ($staffPassword): void {
            $slug = Str::slug($branch->name);
            User::updateOrCreate(
                ['email' => "staff.{$slug}@whatthecrust.test"],
                [
                    'name' => "{$branch->name} Staff",
                    'password' => $staffPassword,
                    'role' => 'staff',
                    'branch_id' => $branch->id,
                    'is_active' => true,
                ],
            );
        });

        User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@whatthecrust.test')],
            [
                'name' => env('ADMIN_NAME', 'What The Crust Admin'),
                'password' => $adminPassword,
                'role' => 'admin',
                'branch_id' => null,
                'is_active' => true,
            ],
        );
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### run

updateOrCreate بحسابات staff.{slug}@whatthecrust.test وحساب admin المحدد؛ User hashed cast يعالج password.

- **بتاخد إيه؟ Inputs:** STAFF_PASSWORD/ADMIN_PASSWORD وADMIN_EMAIL/ADMIN_NAME من البيئة والفروع النشطة.

- **بترجع/بتغيّر إيه؟ Return / effect:** void؛ warning وreturn لو missing passwords.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### env

- **جاية منين؟** Laravel helper

- **وظيفتها:** اقرأ قيمة متغير البيئة أو default؛ تستعمل لإعداد التطبيق، ومش وسيلة قراءة بيانات form. مع config cache تُقرأ الإعدادات عادة من config بدل env داخل business code.

- **المدخلات — Arguments:** اسم متغير string ثم default اختيارية؛ لا تطبع قيم password أو مفاتيح الدفع في المذكرات.

- **الناتج/الأثر — Return / effect:** قيمة متغير البيئة المحوّلة وفق Laravel، أو default لو غائب؛ ممكن string أو bool أو null.

- **أول موضع هنا:** السطر 39.

- **مثال:** env('ADMIN_EMAIL', 'admin@whatthecrust.test')

### ->warn

- **جاية منين؟** Laravel Console

- **وظيفتها:** تعرض تحذيرًا.

- **المدخلات — Arguments:** text.

- **الناتج/الأثر — Return / effect:** أثر عرض.

- **أول موضع هنا:** السطر 18.

### Branch::query

- **جاية منين؟** Eloquent

- **وظيفتها:** تبدأ بناء query على model.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** Eloquent Builder، مش rows جاهزة.

- **أول موضع هنا:** السطر 22.

### ->where

- **جاية منين؟** Laravel Query Builder

- **وظيفتها:** تضيف شرط فلترة أو مجموعة شروط.

- **المدخلات — Arguments:** column/operator/value أو closure.

- **الناتج/الأثر — Return / effect:** Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.

- **أول موضع هنا:** السطر 22.

### ->each

- **جاية منين؟** Laravel Collection

- **وظيفتها:** تنفذ callback لكل عنصر لأثر جانبي.

- **المدخلات — Arguments:** callback.

- **الناتج/الأثر — Return / effect:** نفس Collection؛ return false قد توقف المرور.

- **أول موضع هنا:** السطر 22.

### Str::slug

- **جاية منين؟** Laravel Str

- **وظيفتها:** حوّل اسم المنتج أو الفرع إلى اسم مناسب للرابط/الملف مثل garlic-bread.

- **المدخلات — Arguments:** string name وseparator اختياري.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 23.

- **مثال:** Str::slug($name)

### User::updateOrCreate

- **جاية منين؟** Laravel Eloquent

- **وظيفتها:** ابحث بالشروط؛ حدّث لو موجود أو أنشئ لو مفيش. مش معناها transaction مستقلة تمنع كل race condition تلقائيًا.

- **المدخلات — Arguments:** attributes للبحث ثم values للكتابة.

- **الناتج/الأثر — Return / effect:** Model محفوظة.

- **أول موضع هنا:** السطر 36.

- **مثال:** AppSetting::updateOrCreate(['key' => $key], ['value' => $value]);

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** namespace بتحدد نطاق أسماء الكلاس `Database\Seeders`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 5:** use / استيراد الاسم `App\Models\Branch` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** use / استيراد الاسم `App\Models\User` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 7:** use / استيراد الاسم `Illuminate\Database\Seeder` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 8:** use / استيراد الاسم `Illuminate\Support\Str` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php

class StaffUserSeeder extends Seeder
{
    public function run(): void
    {
        $staffPassword = env('STAFF_PASSWORD');
        $adminPassword = env('ADMIN_PASSWORD') ?: $staffPassword;

```

**السطر 10:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

**السطر 11:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 12:** Function / تعريف دالة `run`؛ تعريفها مش تشغيلها. updateOrCreate بحسابات staff.{slug}@whatthecrust.test وحساب admin المحدد؛ User hashed cast يعالج password. مدخلاتها: STAFF_PASSWORD/ADMIN_PASSWORD وADMIN_EMAIL/ADMIN_NAME من البيئة والفروع النشطة. ناتجها: void؛ warning وreturn لو missing passwords.

**السطر 13:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 14:** Assignment / إسناد: احسب `env('STAFF_PASSWORD')` الأول وخزّن النتيجة في `$staffPassword`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 15:** Assignment / إسناد: احسب `env('ADMIN_PASSWORD') ?: $staffPassword` الأول وخزّن النتيجة في `$adminPassword`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

### السطور 17–24

```php
        if (! $staffPassword || ! $adminPassword) {
            $this->command?->warn('STAFF_PASSWORD and ADMIN_PASSWORD must be set before staff accounts can be seeded.');
            return;
        }

        Branch::query()->where('is_active', true)->each(function (Branch $branch) use ($staffPassword): void {
            $slug = Str::slug($branch->name);
            User::updateOrCreate(
```

**السطر 17:** if تختبر الشرط `! $staffPassword || ! $adminPassword`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 18:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `->warn(...)`: تعرض تحذيرًا. مدخلاتها: text. العائد/الأثر: أثر عرض.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 19:** return بدون قيمة: اخرج من الدالة الحالية هنا. مفيش تعليمات بعدها في نفس المسار هتتنفذ؛ في PHP العائد بدون قيمة هو null، مش undefined بتاعة JavaScript.

**السطر 20:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 22:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `Branch::query(...)`: تبدأ بناء query على model. مدخلاتها: بدون مدخلات. العائد/الأثر: Eloquent Builder، مش rows جاهزة.؛ `->where(...)`: تضيف شرط فلترة أو مجموعة شروط. مدخلاتها: column/operator/value أو closure. العائد/الأثر: Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.؛ `->each(...)`: تنفذ callback لكل عنصر لأثر جانبي. مدخلاتها: callback. العائد/الأثر: نفس Collection؛ return false قد توقف المرور.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 23:** Assignment / إسناد: احسب `Str::slug($branch->name)` الأول وخزّن النتيجة في `$slug`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 24:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `User::updateOrCreate(...)`: ابحث بالشروط؛ حدّث لو موجود أو أنشئ لو مفيش. مش معناها transaction مستقلة تمنع كل race condition تلقائيًا. مدخلاتها: attributes للبحث ثم values للكتابة. العائد/الأثر: Model محفوظة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 25–32

```php
                ['email' => "staff.{$slug}@whatthecrust.test"],
                [
                    'name' => "{$branch->name} Staff",
                    'password' => $staffPassword,
                    'role' => 'staff',
                    'branch_id' => $branch->id,
                    'is_active' => true,
                ],
```

**السطر 25:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 26:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 27:** PHP array entry: المفتاح `name` مرتبط بالقيمة `"{$branch->name} Staff"`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 28:** PHP array entry: المفتاح `password` مرتبط بالقيمة `$staffPassword`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 29:** PHP array entry: المفتاح `role` مرتبط بالقيمة `'staff'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 30:** PHP array entry: المفتاح `branch_id` مرتبط بالقيمة `$branch->id`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 31:** PHP array entry: المفتاح `is_active` مرتبط بالقيمة `true`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 32:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 33–40

```php
            );
        });

        User::updateOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@whatthecrust.test')],
            [
                'name' => env('ADMIN_NAME', 'What The Crust Admin'),
                'password' => $adminPassword,
```

**السطر 33:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 34:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 36:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `User::updateOrCreate(...)`: ابحث بالشروط؛ حدّث لو موجود أو أنشئ لو مفيش. مش معناها transaction مستقلة تمنع كل race condition تلقائيًا. مدخلاتها: attributes للبحث ثم values للكتابة. العائد/الأثر: Model محفوظة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 37:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `env(...)`: اقرأ قيمة متغير البيئة أو default؛ تستعمل لإعداد التطبيق، ومش وسيلة قراءة بيانات form. مع config cache تُقرأ الإعدادات عادة من config بدل env داخل business code. مدخلاتها: اسم متغير string ثم default اختيارية؛ لا تطبع قيم password أو مفاتيح الدفع في المذكرات. العائد/الأثر: قيمة متغير البيئة المحوّلة وفق Laravel، أو default لو غائب؛ ممكن string أو bool أو null.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 38:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 39:** PHP array entry: المفتاح `name` مرتبط بالقيمة `env('ADMIN_NAME', 'What The Crust Admin')`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 40:** PHP array entry: المفتاح `password` مرتبط بالقيمة `$adminPassword`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

### السطور 41–48

```php
                'role' => 'admin',
                'branch_id' => null,
                'is_active' => true,
            ],
        );
    }
}

```

**السطر 41:** PHP array entry: المفتاح `role` مرتبط بالقيمة `'admin'`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 42:** PHP array entry: المفتاح `branch_id` مرتبط بالقيمة `null`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 43:** PHP array entry: المفتاح `is_active` مرتبط بالقيمة `true`. => معناها «المفتاح ده قيمته كذا»، مش مقارنة مساواة ولا arrow function زي JavaScript.

**السطر 44:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 45:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 46:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 47:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
