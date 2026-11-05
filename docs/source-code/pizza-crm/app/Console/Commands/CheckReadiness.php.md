# أمر فحص جاهزية البيئة

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `app/Console/Commands/CheckReadiness.php` · 93 سطر.

**وظيفة الملف:** php artisan app:readiness يفحص وجود env واتصال DB وmigrations وseed data وشكل مفاتيح Stripe بدون طباعة قيم الأسرار. لا يشغّل migrations ولا seed بنفسه، ووجود prefix test صالح مش إثبات اتصال فعلي بـ Stripe.

**نوعه:** support. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../app/Console/Commands/CheckReadiness.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Models/Branch.php](../../Models/Branch.php.md)

- [pizza-crm/app/Models/Category.php](../../Models/Category.php.md)

- [pizza-crm/app/Models/MenuItem.php](../../Models/MenuItem.php.md)

- [pizza-crm/app/Models/Order.php](../../Models/Order.php.md)

- [pizza-crm/app/Models/User.php](../../Models/User.php.md)

- [pizza-crm/database/seeders/DatabaseSeeder.php](../../../database/seeders/DatabaseSeeder.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

namespace App\Console\Commands;

use App\Models\Branch;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Order;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CheckReadiness extends Command
{
    protected $signature = 'app:readiness';

    protected $description = 'Check local setup, database data, migrations, and Stripe test keys';

    public function handle(): int
    {
        $failed = false;
        $this->components->info('What The Crust readiness check');

        if (file_exists(base_path('.env'))) {
            $this->line('<fg=green>PASS</> .env exists.');
        } else {
            $this->line('<fg=red>FAIL</> .env is missing. Copy .env.example to .env.');
            $failed = true;
        }

        if (config('database.default') === 'mysql') {
            $this->line('<fg=green>PASS</> MySQL is the active database connection.');
        } else {
            $this->line('<fg=yellow>WARN</> The active database is '.config('database.default').'. MySQL is recommended for XAMPP.');
        }

        try {
            DB::connection()->getPdo();
            $this->line('<fg=green>PASS</> Database connection works.');

            $migrator = app('migrator');
            if (! $migrator->repositoryExists()) {
                $this->line('<fg=red>FAIL</> Migration table is missing. Run php artisan migrate.');
                $failed = true;
            } else {
                $files = $migrator->getMigrationFiles(database_path('migrations'));
                $pending = array_diff(array_keys($files), $migrator->getRepository()->getRan());
                if ($pending === []) {
                    $this->line('<fg=green>PASS</> All migrations have run.');
                } else {
                    $this->line('<fg=red>FAIL</> '.count($pending).' migration(s) are pending. Run php artisan migrate.');
                    $failed = true;
                }
            }

            $expectedBranches = ['The Drive', 'Golf Central', 'LakeHouse'];
            $hasSeedData = Branch::whereIn('name', $expectedBranches)->count() === 3
                && Category::count() >= 7
                && MenuItem::count() >= 47
                && User::whereIn('role', ['staff', 'admin'])->exists()
                && Order::where('idempotency_key', 'like', 'demo-order-%')->exists();
            if ($hasSeedData) {
                $this->line('<fg=green>PASS</> Menu, branches, staff account, and demo orders are seeded.');
            } else {
                $this->line('<fg=red>FAIL</> Seed data is incomplete. Run php artisan db:seed.');
                $failed = true;
            }
        } catch (\Throwable $exception) {
            $this->line('<fg=red>FAIL</> Database is not ready: '.$exception->getMessage());
            $this->line('Start MySQL in XAMPP and create the database named in DB_DATABASE.');
            $failed = true;
        }

        $stripe = config('services.stripe');
        $stripeReady = str_starts_with((string) $stripe['key'], 'pk_test_')
            && ! str_contains((string) $stripe['key'], 'replace_me')
            && str_starts_with((string) $stripe['secret'], 'sk_test_')
            && ! str_contains((string) $stripe['secret'], 'replace_me')
            && str_starts_with((string) $stripe['webhook_secret'], 'whsec_')
            && ! str_contains((string) $stripe['webhook_secret'], 'replace_me');
        if ($stripeReady) {
            $this->line('<fg=green>PASS</> Stripe test keys are configured.');
        } else {
            $this->line('<fg=yellow>WARN</> Stripe test keys are placeholders. Cash orders work, but card payments do not.');
        }

        $this->newLine();
        $failed ? $this->components->error('Setup is not ready yet.') : $this->components->info('Setup is ready.');

        return $failed ? self::FAILURE : self::SUCCESS;
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### handle

اعرض PASS/WARN/FAIL وافحص الإعدادات والبيانات؛ cash ممكن يعمل مع Stripe placeholders.

- **بتاخد إيه؟ Inputs:** config وfilesystem وقراءات DB فقط.

- **بترجع/بتغيّر إيه؟ Return / effect:** int exit code SUCCESS أو FAILURE.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### components->info

- **جاية منين؟** Laravel Console components

- **وظيفتها:** تعرض رسالة معلومات في terminal.

- **المدخلات — Arguments:** text.

- **الناتج/الأثر — Return / effect:** أثر عرض، لا إنشاء بيانات.

- **أول موضع هنا:** السطر 88.

### file_exists

- **جاية منين؟** PHP built-in

- **وظيفتها:** اختبر وجود ملف أو مجلد على filesystem بدون قراءة محتواه؛ readiness تفحص وجود .env فقط ولا تطبع أسراره.

- **المدخلات — Arguments:** path string.

- **الناتج/الأثر — Return / effect:** bool: true لو المسار موجود، وإلا false.

- **أول موضع هنا:** السطر 24.

- **مثال:** file_exists(base_path('.env'))

### base_path

- **جاية منين؟** Laravel path helper

- **وظيفتها:** ابنِ مسار filesystem مطلق يبدأ من جذر المشروع؛ لا يقرأ الملف ولا ينشئه ولا يفتح المتصفح.

- **المدخلات — Arguments:** مسار نسبي اختياري string.

- **الناتج/الأثر — Return / effect:** absolute filesystem path string.

- **أول موضع هنا:** السطر 24.

- **مثال:** base_path('.env')

### $this->line

- **جاية منين؟** Laravel Console Command

- **وظيفتها:** تطبع سطرًا.

- **المدخلات — Arguments:** text وstyle اختيارية.

- **الناتج/الأثر — Return / effect:** أثر عرض.

- **أول موضع هنا:** السطر 84.

### config

- **جاية منين؟** Laravel helper

- **وظيفتها:** اقرأ إعدادًا من ملفات config بالقيمة المحملة وقت تشغيل التطبيق؛ النقطة تفصل الملف عن المفتاح الداخلي.

- **المدخلات — Arguments:** key بصيغة dot notation مثل services.stripe.key، ثم default اختيارية. بدون key يرجع config repository، وarray تضبط إعدادات.

- **الناتج/الأثر — Return / effect:** قيمة الإعداد أو default في الاستخدام الحالي؛ ليست بالضرورة string ولا قيمة env مباشرة.

- **أول موضع هنا:** السطر 74.

- **مثال:** config('orders.minimum_pickup_prep_minutes', 20)

### DB::connection

- **جاية منين؟** Laravel Database Manager

- **وظيفتها:** هات connection حسب الاسم، أوالاتصال الافتراضي من config. مجرد الحصول على connection object مش إثبات إن DB متاحة؛ getPdo هوالفحص في readiness.

- **المدخلات — Arguments:** اسم connection اختياري string أوnull؛ المشروع بدون arguments.

- **الناتج/الأثر — Return / effect:** Illuminate Database Connection object.

- **أول موضع هنا:** السطر 38.

- **مثال:** DB::connection()->getPdo();

### ->getPdo

- **جاية منين؟** Laravel Connection

- **وظيفتها:** تقرأ/تجهز اتصال PDO الحقيقي.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** PDO object أو خطأ اتصال.

- **أول موضع هنا:** السطر 38.

### app

- **جاية منين؟** Laravel helper / Service Container

- **وظيفتها:** هات container أو حل dependency مسجلة؛ app('migrator') في readiness تجيب خدمة المهاجرات، مش تشغل migration وحدها.

- **المدخلات — Arguments:** اسم خدمة أو class string اختياري، ثم array parameters اختيارية.

- **الناتج/الأثر — Return / effect:** Application container بدون اسم، أو instance الخدمة المطلوبة؛ يفشل لو الاعتماد لا يمكن حله.

- **أول موضع هنا:** السطر 41.

- **مثال:** $migrator = app('migrator');

### $migrator->repositoryExists

- **جاية منين؟** Laravel migration repository

- **وظيفتها:** تفحص وجود جدول تتبع migrations.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** Boolean؛ لا تثبت مرور كل migrations.

- **أول موضع هنا:** السطر 42.

### $migrator->getMigrationFiles

- **جاية منين؟** Laravel Migrator

- **وظيفتها:** تقرأ أسماء ملفات migrations من المسارات.

- **المدخلات — Arguments:** migration paths.

- **الناتج/الأثر — Return / effect:** array خريطة ملفات؛ لا تنفذها.

- **أول موضع هنا:** السطر 46.

### database_path

- **جاية منين؟** Laravel path helper

- **وظيفتها:** ابنِ مسار filesystem داخل database؛ readiness تستخدمه لتحديد مجلد ملفات migrations بدون تشغيلها.

- **المدخلات — Arguments:** مسار نسبي اختياري مثل migrations.

- **الناتج/الأثر — Return / effect:** absolute filesystem path string.

- **أول موضع هنا:** السطر 46.

- **مثال:** database_path('migrations')

### $migrator->getRepository

- **جاية منين؟** Laravel Migrator

- **وظيفتها:** تقرأ مستودع تتبع migrations.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** MigrationRepository.

- **أول موضع هنا:** السطر 47.

### ->getRan

- **جاية منين؟** Laravel migration repository

- **وظيفتها:** تقرأ أسماء migrations المنفذة المسجلة.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** array أسماء.

- **أول موضع هنا:** السطر 47.

### array_diff

- **جاية منين؟** PHP built-in array function

- **وظيفتها:** تجيب قيم موجودة في أول array ومش موجودة في القوائم التالية؛ مثل حساب أكواد roles المرفوضة. تفحص القيم لا المفاتيح، وتحافظ على مفاتيح القائمة الأولى.

- **المدخلات — Arguments:** array الأولى ثم arrays المقارنة. مقارنة القيم تعتمد تمثيلها كنص؛ مش strict type comparison مثل ===.

- **الناتج/الأثر — Return / effect:** array بالقيم غير الموجودة في القوائم الأخرى؛ array فاضية تعني مفيش فرق حسب المقارنة.

- **أول موضع هنا:** السطر 47.

### array_keys

- **جاية منين؟** PHP built-in

- **وظيفتها:** هات مفاتيح array الحالية في قائمة؛ seeder تستخدمها كـ index أثناء array_map.

- **المدخلات — Arguments:** array ثم search_value وstrict اختياريان لو مطلوب فلترة المفاتيح.

- **الناتج/الأثر — Return / effect:** array من المفاتيح، مش قيم العناصر.

- **أول موضع هنا:** السطر 47.

- **مثال:** array_keys($items)

### count

- **جاية منين؟** PHP built-in عند count(...) وليس ->count()

- **وظيفتها:** عد عناصر array أو Countable في الذاكرة؛ مختلف عن QueryBuilder->count الذي يجري aggregate SQL.

- **المدخلات — Arguments:** array أو Countable ثم mode اختيارية.

- **الناتج/الأثر — Return / effect:** int عدد العناصر.

- **أول موضع هنا:** السطر 51.

- **مثال:** count($pending)

### Branch::whereIn

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تضيف شرط انتماء لقائمة قيم.

- **المدخلات — Arguments:** column وvalues.

- **الناتج/الأثر — Return / effect:** Builder؛ Collection.whereIn بدلًا منها تعيد مجموعة مفلترة.

- **أول موضع هنا:** السطر 57.

### ->count

- **جاية منين؟** Laravel Builder/Collection

- **وظيفتها:** تحسب عدد الصفوف/العناصر حسب المستقبِل.

- **المدخلات — Arguments:** column اختيارية للـquery.

- **الناتج/الأثر — Return / effect:** عدد؛ query count تنفّذ aggregate.

- **أول موضع هنا:** السطر 57.

### Category::count

- **جاية منين؟** Laravel Builder/Collection

- **وظيفتها:** تحسب عدد الصفوف/العناصر حسب المستقبِل.

- **المدخلات — Arguments:** column اختيارية للـquery.

- **الناتج/الأثر — Return / effect:** عدد؛ query count تنفّذ aggregate.

- **أول موضع هنا:** السطر 58.

### MenuItem::count

- **جاية منين؟** Laravel Builder/Collection

- **وظيفتها:** تحسب عدد الصفوف/العناصر حسب المستقبِل.

- **المدخلات — Arguments:** column اختيارية للـquery.

- **الناتج/الأثر — Return / effect:** عدد؛ query count تنفّذ aggregate.

- **أول موضع هنا:** السطر 59.

### User::whereIn

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تضيف شرط انتماء لقائمة قيم.

- **المدخلات — Arguments:** column وvalues.

- **الناتج/الأثر — Return / effect:** Builder؛ Collection.whereIn بدلًا منها تعيد مجموعة مفلترة.

- **أول موضع هنا:** السطر 60.

### ->exists

- **جاية منين؟** Laravel Builder

- **وظيفتها:** تختبر وجود صف مطابق.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** Boolean، لا تجلب كل rows.

- **أول موضع هنا:** السطر 61.

### Order::where

- **جاية منين؟** Laravel Query Builder

- **وظيفتها:** تضيف شرط فلترة أو مجموعة شروط.

- **المدخلات — Arguments:** column/operator/value أو closure.

- **الناتج/الأثر — Return / effect:** Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.

- **أول موضع هنا:** السطر 61.

### $exception->getMessage

- **جاية منين؟** PHP Throwable

- **وظيفتها:** تقرأ رسالة الخطأ.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** string؛ لا تعالج الخطأ وحدها.

- **أول موضع هنا:** السطر 69.

### str_starts_with

- **جاية منين؟** PHP 8 built-in string function

- **وظيفتها:** تفحص هل النص يبدأ بالمقطع المحدد؛ مثل التمييز بين مسار api ومسار واجهة. المقارنة case-sensitive، ومش بحث عن المقطع في أي مكان.

- **المدخلات — Arguments:** haystack: النص الكامل، needle: البداية المطلوبة.

- **الناتج/الأثر — Return / effect:** Boolean. true لو البداية مطابقة؛ needle الفاضية تطابق بداية أي نص.

- **أول موضع هنا:** السطر 79.

### str_contains

- **جاية منين؟** PHP 8 built-in string function

- **وظيفتها:** تفحص هل النص يحتوي المقطع في أي موضع؛ مثل البحث عن لفظ داخل رسالة. المقارنة case-sensitive.

- **المدخلات — Arguments:** haystack: النص الكامل، needle: المقطع المطلوب.

- **الناتج/الأثر — Return / effect:** Boolean. true لو المقطع موجود؛ needle الفاضية ترجع true.

- **أول موضع هنا:** السطر 80.

### $this->newLine

- **جاية منين؟** Laravel Console Command

- **وظيفتها:** تطبع سطرًا فارغًا/أسطرًا للفصل.

- **المدخلات — Arguments:** count اختيارية.

- **الناتج/الأثر — Return / effect:** أثر عرض.

- **أول موضع هنا:** السطر 87.

### components->error

- **جاية منين؟** Laravel Console

- **وظيفتها:** تعرض خطأ في terminal.

- **المدخلات — Arguments:** text.

- **الناتج/الأثر — Return / effect:** أثر عرض؛ throw مختلفة.

- **أول موضع هنا:** السطر 88.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

namespace App\Console\Commands;

use App\Models\Branch;
use App\Models\Category;
use App\Models\MenuItem;
use App\Models\Order;
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** namespace بتحدد نطاق أسماء الكلاس `App\Console\Commands`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 5:** use / استيراد الاسم `App\Models\Branch` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** use / استيراد الاسم `App\Models\Category` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 7:** use / استيراد الاسم `App\Models\MenuItem` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 8:** use / استيراد الاسم `App\Models\Order` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CheckReadiness extends Command
{
    protected $signature = 'app:readiness';

```

**السطر 9:** use / استيراد الاسم `App\Models\User` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 10:** use / استيراد الاسم `Illuminate\Console\Command` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 11:** use / استيراد الاسم `Illuminate\Support\Facades\DB` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 13:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

**السطر 14:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 15:** Property / خاصية `$signature` في الكلاس. `protected` معناها متاحة جوّه الكلاس والكلاسات الوارثة. القيمة الافتراضية/النوع ظاهر في التعريف؛ دي بيانات للـobject مش function بتتنادى.

### السطور 17–24

```php
    protected $description = 'Check local setup, database data, migrations, and Stripe test keys';

    public function handle(): int
    {
        $failed = false;
        $this->components->info('What The Crust readiness check');

        if (file_exists(base_path('.env'))) {
```

**السطر 17:** Property / خاصية `$description` في الكلاس. `protected` معناها متاحة جوّه الكلاس والكلاسات الوارثة. القيمة الافتراضية/النوع ظاهر في التعريف؛ دي بيانات للـobject مش function بتتنادى.

**السطر 19:** Function / تعريف دالة `handle`؛ تعريفها مش تشغيلها. اعرض PASS/WARN/FAIL وافحص الإعدادات والبيانات؛ cash ممكن يعمل مع Stripe placeholders. مدخلاتها: config وfilesystem وقراءات DB فقط. ناتجها: int exit code SUCCESS أو FAILURE.

**السطر 20:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 21:** Assignment / إسناد: احسب `false` الأول وخزّن النتيجة في `$failed`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 22:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `components->info(...)`: تعرض رسالة معلومات في terminal. مدخلاتها: text. العائد/الأثر: أثر عرض، لا إنشاء بيانات.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 24:** if تختبر الشرط `file_exists(base_path('.env'))`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

### السطور 25–32

```php
            $this->line('<fg=green>PASS</> .env exists.');
        } else {
            $this->line('<fg=red>FAIL</> .env is missing. Copy .env.example to .env.');
            $failed = true;
        }

        if (config('database.default') === 'mysql') {
            $this->line('<fg=green>PASS</> MySQL is the active database connection.');
```

**السطر 25:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->line(...)`: تطبع سطرًا. مدخلاتها: text وstyle اختيارية. العائد/الأثر: أثر عرض.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 26:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 27:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->line(...)`: تطبع سطرًا. مدخلاتها: text وstyle اختيارية. العائد/الأثر: أثر عرض.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 28:** Assignment / إسناد: احسب `true` الأول وخزّن النتيجة في `$failed`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 29:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 31:** if تختبر الشرط `config('database.default') === 'mysql'`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 32:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->line(...)`: تطبع سطرًا. مدخلاتها: text وstyle اختيارية. العائد/الأثر: أثر عرض.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 33–40

```php
        } else {
            $this->line('<fg=yellow>WARN</> The active database is '.config('database.default').'. MySQL is recommended for XAMPP.');
        }

        try {
            DB::connection()->getPdo();
            $this->line('<fg=green>PASS</> Database connection works.');

```

**السطر 33:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 34:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->line(...)`: تطبع سطرًا. مدخلاتها: text وstyle اختيارية. العائد/الأثر: أثر عرض.؛ `config(...)`: اقرأ إعدادًا من ملفات config بالقيمة المحملة وقت تشغيل التطبيق؛ النقطة تفصل الملف عن المفتاح الداخلي. مدخلاتها: key بصيغة dot notation مثل services.stripe.key، ثم default اختيارية. بدون key يرجع config repository، وarray تضبط إعدادات. العائد/الأثر: قيمة الإعداد أو default في الاستخدام الحالي؛ ليست بالضرورة string ولا قيمة env مباشرة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 35:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 37:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة.

**السطر 38:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `DB::connection(...)`: هات connection حسب الاسم، أوالاتصال الافتراضي من config. مجرد الحصول على connection object مش إثبات إن DB متاحة؛ getPdo هوالفحص في readiness. مدخلاتها: اسم connection اختياري string أوnull؛ المشروع بدون arguments. العائد/الأثر: Illuminate Database Connection object.؛ `->getPdo(...)`: تقرأ/تجهز اتصال PDO الحقيقي. مدخلاتها: بدون arguments. العائد/الأثر: PDO object أو خطأ اتصال.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 39:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->line(...)`: تطبع سطرًا. مدخلاتها: text وstyle اختيارية. العائد/الأثر: أثر عرض.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 41–48

```php
            $migrator = app('migrator');
            if (! $migrator->repositoryExists()) {
                $this->line('<fg=red>FAIL</> Migration table is missing. Run php artisan migrate.');
                $failed = true;
            } else {
                $files = $migrator->getMigrationFiles(database_path('migrations'));
                $pending = array_diff(array_keys($files), $migrator->getRepository()->getRan());
                if ($pending === []) {
```

**السطر 41:** Assignment / إسناد: احسب `app('migrator')` الأول وخزّن النتيجة في `$migrator`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 42:** if تختبر الشرط `! $migrator->repositoryExists()`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 43:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->line(...)`: تطبع سطرًا. مدخلاتها: text وstyle اختيارية. العائد/الأثر: أثر عرض.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 44:** Assignment / إسناد: احسب `true` الأول وخزّن النتيجة في `$failed`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 45:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 46:** Assignment / إسناد: احسب `$migrator->getMigrationFiles(database_path('migrations'))` الأول وخزّن النتيجة في `$files`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 47:** Assignment / إسناد: احسب `array_diff(array_keys($files), $migrator->getRepository()->getRan())` الأول وخزّن النتيجة في `$pending`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 48:** if تختبر الشرط `$pending === []`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

### السطور 49–56

```php
                    $this->line('<fg=green>PASS</> All migrations have run.');
                } else {
                    $this->line('<fg=red>FAIL</> '.count($pending).' migration(s) are pending. Run php artisan migrate.');
                    $failed = true;
                }
            }

            $expectedBranches = ['The Drive', 'Golf Central', 'LakeHouse'];
```

**السطر 49:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->line(...)`: تطبع سطرًا. مدخلاتها: text وstyle اختيارية. العائد/الأثر: أثر عرض.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 50:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 51:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->line(...)`: تطبع سطرًا. مدخلاتها: text وstyle اختيارية. العائد/الأثر: أثر عرض.؛ `count(...)`: عد عناصر array أو Countable في الذاكرة؛ مختلف عن QueryBuilder->count الذي يجري aggregate SQL. مدخلاتها: array أو Countable ثم mode اختيارية. العائد/الأثر: int عدد العناصر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 52:** Assignment / إسناد: احسب `true` الأول وخزّن النتيجة في `$failed`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 53:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 54:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 56:** Assignment / إسناد: احسب `['The Drive', 'Golf Central', 'LakeHouse']` الأول وخزّن النتيجة في `$expectedBranches`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

### السطور 57–64

```php
            $hasSeedData = Branch::whereIn('name', $expectedBranches)->count() === 3
                && Category::count() >= 7
                && MenuItem::count() >= 47
                && User::whereIn('role', ['staff', 'admin'])->exists()
                && Order::where('idempotency_key', 'like', 'demo-order-%')->exists();
            if ($hasSeedData) {
                $this->line('<fg=green>PASS</> Menu, branches, staff account, and demo orders are seeded.');
            } else {
```

**السطر 57:** Assignment / إسناد: احسب `Branch::whereIn('name', $expectedBranches)->count() === 3` الأول وخزّن النتيجة في `$hasSeedData`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 58:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `Category::count(...)`: تحسب عدد الصفوف/العناصر حسب المستقبِل. مدخلاتها: column اختيارية للـquery. العائد/الأثر: عدد؛ query count تنفّذ aggregate.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 59:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `MenuItem::count(...)`: تحسب عدد الصفوف/العناصر حسب المستقبِل. مدخلاتها: column اختيارية للـquery. العائد/الأثر: عدد؛ query count تنفّذ aggregate.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 60:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `User::whereIn(...)`: تضيف شرط انتماء لقائمة قيم. مدخلاتها: column وvalues. العائد/الأثر: Builder؛ Collection.whereIn بدلًا منها تعيد مجموعة مفلترة.؛ `->exists(...)`: تختبر وجود صف مطابق. مدخلاتها: بدون arguments. العائد/الأثر: Boolean، لا تجلب كل rows.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 61:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `Order::where(...)`: تضيف شرط فلترة أو مجموعة شروط. مدخلاتها: column/operator/value أو closure. العائد/الأثر: Builder تكمل عليه؛ لا تنفّذ القراءة وحدها.؛ `->exists(...)`: تختبر وجود صف مطابق. مدخلاتها: بدون arguments. العائد/الأثر: Boolean، لا تجلب كل rows.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 62:** if تختبر الشرط `$hasSeedData`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 63:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->line(...)`: تطبع سطرًا. مدخلاتها: text وstyle اختيارية. العائد/الأثر: أثر عرض.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 64:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 65–72

```php
                $this->line('<fg=red>FAIL</> Seed data is incomplete. Run php artisan db:seed.');
                $failed = true;
            }
        } catch (\Throwable $exception) {
            $this->line('<fg=red>FAIL</> Database is not ready: '.$exception->getMessage());
            $this->line('Start MySQL in XAMPP and create the database named in DB_DATABASE.');
            $failed = true;
        }
```

**السطر 65:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->line(...)`: تطبع سطرًا. مدخلاتها: text وstyle اختيارية. العائد/الأثر: أثر عرض.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 66:** Assignment / إسناد: احسب `true` الأول وخزّن النتيجة في `$failed`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 67:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 68:** Catch: استقبل الخطأ من try/Promise حسب السياق وتعامل مع رسالته؛ catch لا تعني نجاح الطلب الأصلي.

**السطر 69:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `$this->line(...)`: تطبع سطرًا. مدخلاتها: text وstyle اختيارية. العائد/الأثر: أثر عرض.؛ `$exception->getMessage(...)`: تقرأ رسالة الخطأ. مدخلاتها: بدون arguments. العائد/الأثر: string؛ لا تعالج الخطأ وحدها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 70:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->line(...)`: تطبع سطرًا. مدخلاتها: text وstyle اختيارية. العائد/الأثر: أثر عرض.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 71:** Assignment / إسناد: احسب `true` الأول وخزّن النتيجة في `$failed`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 72:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 73–80

```php

        $stripe = config('services.stripe');
        $stripeReady = str_starts_with((string) $stripe['key'], 'pk_test_')
            && ! str_contains((string) $stripe['key'], 'replace_me')
            && str_starts_with((string) $stripe['secret'], 'sk_test_')
            && ! str_contains((string) $stripe['secret'], 'replace_me')
            && str_starts_with((string) $stripe['webhook_secret'], 'whsec_')
            && ! str_contains((string) $stripe['webhook_secret'], 'replace_me');
```

**السطر 74:** Assignment / إسناد: احسب `config('services.stripe')` الأول وخزّن النتيجة في `$stripe`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 75:** Assignment / إسناد: احسب `str_starts_with((string) $stripe['key'], 'pk_test_')` الأول وخزّن النتيجة في `$stripeReady`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 76:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `str_contains(...)`: تفحص هل النص يحتوي المقطع في أي موضع؛ مثل البحث عن لفظ داخل رسالة. المقارنة case-sensitive. مدخلاتها: haystack: النص الكامل، needle: المقطع المطلوب. العائد/الأثر: Boolean. true لو المقطع موجود؛ needle الفاضية ترجع true.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 77:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `str_starts_with(...)`: تفحص هل النص يبدأ بالمقطع المحدد؛ مثل التمييز بين مسار api ومسار واجهة. المقارنة case-sensitive، ومش بحث عن المقطع في أي مكان. مدخلاتها: haystack: النص الكامل، needle: البداية المطلوبة. العائد/الأثر: Boolean. true لو البداية مطابقة؛ needle الفاضية تطابق بداية أي نص.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 78:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `str_contains(...)`: تفحص هل النص يحتوي المقطع في أي موضع؛ مثل البحث عن لفظ داخل رسالة. المقارنة case-sensitive. مدخلاتها: haystack: النص الكامل، needle: المقطع المطلوب. العائد/الأثر: Boolean. true لو المقطع موجود؛ needle الفاضية ترجع true.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 79:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `str_starts_with(...)`: تفحص هل النص يبدأ بالمقطع المحدد؛ مثل التمييز بين مسار api ومسار واجهة. المقارنة case-sensitive، ومش بحث عن المقطع في أي مكان. مدخلاتها: haystack: النص الكامل، needle: البداية المطلوبة. العائد/الأثر: Boolean. true لو البداية مطابقة؛ needle الفاضية تطابق بداية أي نص.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 80:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `str_contains(...)`: تفحص هل النص يحتوي المقطع في أي موضع؛ مثل البحث عن لفظ داخل رسالة. المقارنة case-sensitive. مدخلاتها: haystack: النص الكامل، needle: المقطع المطلوب. العائد/الأثر: Boolean. true لو المقطع موجود؛ needle الفاضية ترجع true.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 81–88

```php
        if ($stripeReady) {
            $this->line('<fg=green>PASS</> Stripe test keys are configured.');
        } else {
            $this->line('<fg=yellow>WARN</> Stripe test keys are placeholders. Cash orders work, but card payments do not.');
        }

        $this->newLine();
        $failed ? $this->components->error('Setup is not ready yet.') : $this->components->info('Setup is ready.');
```

**السطر 81:** if تختبر الشرط `$stripeReady`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 82:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->line(...)`: تطبع سطرًا. مدخلاتها: text وstyle اختيارية. العائد/الأثر: أثر عرض.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 83:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 84:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->line(...)`: تطبع سطرًا. مدخلاتها: text وstyle اختيارية. العائد/الأثر: أثر عرض.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 85:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 87:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->newLine(...)`: تطبع سطرًا فارغًا/أسطرًا للفصل. مدخلاتها: count اختيارية. العائد/الأثر: أثر عرض.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 88:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `components->error(...)`: تعرض خطأ في terminal. مدخلاتها: text. العائد/الأثر: أثر عرض؛ throw مختلفة.؛ `components->info(...)`: تعرض رسالة معلومات في terminal. مدخلاتها: text. العائد/الأثر: أثر عرض، لا إنشاء بيانات.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 89–93

```php

        return $failed ? self::FAILURE : self::SUCCESS;
    }
}

```

**السطر 90:** return تعيد التعبير `$failed ? self::FAILURE : self::SUCCESS` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

**السطر 91:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 92:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
