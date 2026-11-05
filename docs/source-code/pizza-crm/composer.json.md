# composer.json

[فهرس كل الأكواد](../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `composer.json` · 89 سطر.

**وظيفة الملف:** إعدادات تطوير/build/dependencies أو اختبار. تفسّرها الأداة المكتوبة في الملف؛ وجود package لا يثبت استخدامها في واجهة نشطة.

**نوعه:** source / مصدر. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../composer.json). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```json
{
    "$schema": "https://getcomposer.org/schema.json",
    "name": "laravel/laravel",
    "type": "project",
    "description": "The skeleton application for the Laravel framework.",
    "keywords": ["laravel", "framework"],
    "license": "MIT",
    "require": {
        "php": "^8.2",
        "laravel/framework": "^12.0",
        "laravel/tinker": "^2.10.1",
        "stripe/stripe-php": "^21.0"
    },
    "require-dev": {
        "fakerphp/faker": "^1.23",
        "laravel/pail": "^1.2.2",
        "laravel/pint": "^1.24",
        "laravel/sail": "^1.41",
        "mockery/mockery": "^1.6",
        "nunomaduro/collision": "^8.6",
        "phpunit/phpunit": "^11.5.50"
    },
    "autoload": {
        "psr-4": {
            "App\\": "app/",
            "Database\\Factories\\": "database/factories/",
            "Database\\Seeders\\": "database/seeders/"
        }
    },
    "autoload-dev": {
        "psr-4": {
            "Tests\\": "tests/"
        }
    },
    "scripts": {
        "setup": [
            "composer install",
            "@php -r \"file_exists('.env') || copy('.env.example', '.env');\"",
            "@php artisan key:generate",
            "@php artisan migrate --force",
            "npm install",
            "npm run build"
        ],
        "dev": [
            "Composer\\Config::disableProcessTimeout",
            "npx concurrently -c \"#93c5fd,#c4b5fd,#fb7185,#fdba74\" \"php artisan serve\" \"php artisan queue:listen --tries=1 --timeout=0\" \"php artisan pail --timeout=0\" \"npm run dev\" --names=server,queue,logs,vite --kill-others"
        ],
        "test": [
            "@php artisan config:clear --ansi",
            "@php artisan test"
        ],
        "ready": "@php artisan app:readiness",
        "post-autoload-dump": [
            "Illuminate\\Foundation\\ComposerScripts::postAutoloadDump",
            "@php artisan package:discover --ansi"
        ],
        "post-update-cmd": [
            "@php artisan vendor:publish --tag=laravel-assets --ansi --force"
        ],
        "post-root-package-install": [
            "@php -r \"file_exists('.env') || copy('.env.example', '.env');\""
        ],
        "post-create-project-cmd": [
            "@php artisan key:generate --ansi",
            "@php -r \"file_exists('database/database.sqlite') || touch('database/database.sqlite');\"",
            "@php artisan migrate --graceful --ansi"
        ],
        "pre-package-uninstall": [
            "Illuminate\\Foundation\\ComposerScripts::prePackageUninstall"
        ]
    },
    "extra": {
        "laravel": {
            "dont-discover": []
        }
    },
    "config": {
        "optimize-autoloader": true,
        "preferred-install": "dist",
        "sort-packages": true,
        "allow-plugins": {
            "pestphp/pest-plugin": true,
            "php-http/discovery": true
        }
    },
    "minimum-stability": "stable",
    "prefer-stable": true
}
```

</details>

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```json
{
    "$schema": "https://getcomposer.org/schema.json",
    "name": "laravel/laravel",
    "type": "project",
    "description": "The skeleton application for the Laravel framework.",
    "keywords": ["laravel", "framework"],
    "license": "MIT",
    "require": {
```

**السطر 1:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 2:** `$schema` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"https://getcomposer.org/schema.json",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 3:** `name` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"laravel/laravel",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 4:** `type` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"project",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 5:** `description` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"The skeleton application for the Laravel framework.",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 6:** `keywords` اسم حقل/إعداد، والقيمة بعد النقطتين هي `["laravel", "framework"],`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 7:** `license` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"MIT",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 8:** `require` اسم حقل/إعداد، والقيمة بعد النقطتين هي `{`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 9–16

```json
        "php": "^8.2",
        "laravel/framework": "^12.0",
        "laravel/tinker": "^2.10.1",
        "stripe/stripe-php": "^21.0"
    },
    "require-dev": {
        "fakerphp/faker": "^1.23",
        "laravel/pail": "^1.2.2",
```

**السطر 9:** `php` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"^8.2",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 10:** `laravel/framework` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"^12.0",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 11:** `laravel/tinker` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"^2.10.1",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 12:** `stripe/stripe-php` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"^21.0"`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 13:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 14:** `require-dev` اسم حقل/إعداد، والقيمة بعد النقطتين هي `{`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 15:** `fakerphp/faker` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"^1.23",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 16:** `laravel/pail` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"^1.2.2",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 17–24

```json
        "laravel/pint": "^1.24",
        "laravel/sail": "^1.41",
        "mockery/mockery": "^1.6",
        "nunomaduro/collision": "^8.6",
        "phpunit/phpunit": "^11.5.50"
    },
    "autoload": {
        "psr-4": {
```

**السطر 17:** `laravel/pint` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"^1.24",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 18:** `laravel/sail` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"^1.41",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 19:** `mockery/mockery` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"^1.6",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 20:** `nunomaduro/collision` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"^8.6",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 21:** `phpunit/phpunit` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"^11.5.50"`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 22:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 23:** `autoload` اسم حقل/إعداد، والقيمة بعد النقطتين هي `{`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 24:** `psr-4` اسم حقل/إعداد، والقيمة بعد النقطتين هي `{`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 25–32

```json
            "App\\": "app/",
            "Database\\Factories\\": "database/factories/",
            "Database\\Seeders\\": "database/seeders/"
        }
    },
    "autoload-dev": {
        "psr-4": {
            "Tests\\": "tests/"
```

**السطر 25:** `App\\` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"app/",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 26:** `Database\\Factories\\` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"database/factories/",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 27:** `Database\\Seeders\\` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"database/seeders/"`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 28:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 29:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 30:** `autoload-dev` اسم حقل/إعداد، والقيمة بعد النقطتين هي `{`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 31:** `psr-4` اسم حقل/إعداد، والقيمة بعد النقطتين هي `{`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 32:** `Tests\\` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"tests/"`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 33–40

```json
        }
    },
    "scripts": {
        "setup": [
            "composer install",
            "@php -r \"file_exists('.env') || copy('.env.example', '.env');\"",
            "@php artisan key:generate",
            "@php artisan migrate --force",
```

**السطر 33:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 34:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 35:** `scripts` اسم حقل/إعداد، والقيمة بعد النقطتين هي `{`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 36:** `setup` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 37:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 38:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 39:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 40:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 41–48

```json
            "npm install",
            "npm run build"
        ],
        "dev": [
            "Composer\\Config::disableProcessTimeout",
            "npx concurrently -c \"#93c5fd,#c4b5fd,#fb7185,#fdba74\" \"php artisan serve\" \"php artisan queue:listen --tries=1 --timeout=0\" \"php artisan pail --timeout=0\" \"npm run dev\" --names=server,queue,logs,vite --kill-others"
        ],
        "test": [
```

**السطر 41:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 42:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 43:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 44:** `dev` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 45:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 46:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 47:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 48:** `test` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 49–56

```json
            "@php artisan config:clear --ansi",
            "@php artisan test"
        ],
        "ready": "@php artisan app:readiness",
        "post-autoload-dump": [
            "Illuminate\\Foundation\\ComposerScripts::postAutoloadDump",
            "@php artisan package:discover --ansi"
        ],
```

**السطر 49:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 50:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 51:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 52:** `ready` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"@php artisan app:readiness",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 53:** `post-autoload-dump` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 54:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 55:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 56:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 57–64

```json
        "post-update-cmd": [
            "@php artisan vendor:publish --tag=laravel-assets --ansi --force"
        ],
        "post-root-package-install": [
            "@php -r \"file_exists('.env') || copy('.env.example', '.env');\""
        ],
        "post-create-project-cmd": [
            "@php artisan key:generate --ansi",
```

**السطر 57:** `post-update-cmd` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 58:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 59:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 60:** `post-root-package-install` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 61:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 62:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 63:** `post-create-project-cmd` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 64:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

### السطور 65–72

```json
            "@php -r \"file_exists('database/database.sqlite') || touch('database/database.sqlite');\"",
            "@php artisan migrate --graceful --ansi"
        ],
        "pre-package-uninstall": [
            "Illuminate\\Foundation\\ComposerScripts::prePackageUninstall"
        ]
    },
    "extra": {
```

**السطر 65:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 66:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 67:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 68:** `pre-package-uninstall` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 69:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 70:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 71:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 72:** `extra` اسم حقل/إعداد، والقيمة بعد النقطتين هي `{`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 73–80

```json
        "laravel": {
            "dont-discover": []
        }
    },
    "config": {
        "optimize-autoloader": true,
        "preferred-install": "dist",
        "sort-packages": true,
```

**السطر 73:** `laravel` اسم حقل/إعداد، والقيمة بعد النقطتين هي `{`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 74:** `dont-discover` اسم حقل/إعداد، والقيمة بعد النقطتين هي `[]`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 75:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 76:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 77:** `config` اسم حقل/إعداد، والقيمة بعد النقطتين هي `{`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 78:** `optimize-autoloader` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 79:** `preferred-install` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"dist",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 80:** `sort-packages` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 81–88

```json
        "allow-plugins": {
            "pestphp/pest-plugin": true,
            "php-http/discovery": true
        }
    },
    "minimum-stability": "stable",
    "prefer-stable": true
}
```

**السطر 81:** `allow-plugins` اسم حقل/إعداد، والقيمة بعد النقطتين هي `{`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 82:** `pestphp/pest-plugin` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 83:** `php-http/discovery` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 84:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 85:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 86:** `minimum-stability` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"stable",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 87:** `prefer-stable` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 88:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
