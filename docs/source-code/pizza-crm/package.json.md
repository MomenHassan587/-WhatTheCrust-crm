# package.json

[فهرس كل الأكواد](../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `package.json` · 33 سطر.

**وظيفة الملف:** إعدادات تطوير/build/dependencies أو اختبار. تفسّرها الأداة المكتوبة في الملف؛ وجود package لا يثبت استخدامها في واجهة نشطة.

**نوعه:** source / مصدر. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../package.json). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```json
{
    "$schema": "https://www.schemastore.org/package.json",
    "private": true,
    "type": "module",
    "scripts": {
        "build": "vite build",
        "dev": "vite",
        "demo:export": "php scripts/export-demo-catalog.php",
        "demo:build": "vite build --config vite.demo.config.js && node scripts/package-demo.mjs",
        "demo:preview": "vite preview --config vite.demo.config.js --host 127.0.0.1 --port 4173",
        "demo:test": "node --test tests/demo/*.test.mjs"
    },
    "devDependencies": {
        "@tailwindcss/vite": "^4.0.0",
        "axios": "^1.11.0",
        "concurrently": "^9.0.1",
        "laravel-vite-plugin": "^2.0.0",
        "tailwindcss": "^4.0.0",
        "vite": "^7.0.7"
    },
    "dependencies": {
        "@stripe/react-stripe-js": "^6.12.0",
        "@stripe/stripe-js": "^9.17.0",
        "@vitejs/plugin-react": "^5.2.0",
        "bootstrap": "^5.3.8",
        "framer-motion": "^12.40.0",
        "react": "^19.2.7",
        "react-bootstrap": "^2.10.10",
        "react-dom": "^19.2.7",
        "react-router-dom": "^7.17.0"
    }
}
```

</details>

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```json
{
    "$schema": "https://www.schemastore.org/package.json",
    "private": true,
    "type": "module",
    "scripts": {
        "build": "vite build",
        "dev": "vite",
        "demo:export": "php scripts/export-demo-catalog.php",
```

**السطر 1:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 2:** `$schema` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"https://www.schemastore.org/package.json",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 3:** `private` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 4:** `type` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"module",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 5:** `scripts` اسم حقل/إعداد، والقيمة بعد النقطتين هي `{`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 6:** `build` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"vite build",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 7:** `dev` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"vite",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 8:** `demo:export` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"php scripts/export-demo-catalog.php",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 9–16

```json
        "demo:build": "vite build --config vite.demo.config.js && node scripts/package-demo.mjs",
        "demo:preview": "vite preview --config vite.demo.config.js --host 127.0.0.1 --port 4173",
        "demo:test": "node --test tests/demo/*.test.mjs"
    },
    "devDependencies": {
        "@tailwindcss/vite": "^4.0.0",
        "axios": "^1.11.0",
        "concurrently": "^9.0.1",
```

**السطر 9:** `demo:build` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"vite build --config vite.demo.config.js && node scripts/package-demo.mjs",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 10:** `demo:preview` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"vite preview --config vite.demo.config.js --host 127.0.0.1 --port 4173",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 11:** `demo:test` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"node --test tests/demo/*.test.mjs"`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 12:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 13:** `devDependencies` اسم حقل/إعداد، والقيمة بعد النقطتين هي `{`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 14:** `@tailwindcss/vite` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"^4.0.0",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 15:** `axios` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"^1.11.0",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 16:** `concurrently` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"^9.0.1",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 17–24

```json
        "laravel-vite-plugin": "^2.0.0",
        "tailwindcss": "^4.0.0",
        "vite": "^7.0.7"
    },
    "dependencies": {
        "@stripe/react-stripe-js": "^6.12.0",
        "@stripe/stripe-js": "^9.17.0",
        "@vitejs/plugin-react": "^5.2.0",
```

**السطر 17:** `laravel-vite-plugin` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"^2.0.0",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 18:** `tailwindcss` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"^4.0.0",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 19:** `vite` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"^7.0.7"`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 20:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 21:** `dependencies` اسم حقل/إعداد، والقيمة بعد النقطتين هي `{`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 22:** `@stripe/react-stripe-js` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"^6.12.0",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 23:** `@stripe/stripe-js` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"^9.17.0",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 24:** `@vitejs/plugin-react` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"^5.2.0",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 25–32

```json
        "bootstrap": "^5.3.8",
        "framer-motion": "^12.40.0",
        "react": "^19.2.7",
        "react-bootstrap": "^2.10.10",
        "react-dom": "^19.2.7",
        "react-router-dom": "^7.17.0"
    }
}
```

**السطر 25:** `bootstrap` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"^5.3.8",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 26:** `framer-motion` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"^12.40.0",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 27:** `react` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"^19.2.7",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 28:** `react-bootstrap` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"^2.10.10",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 29:** `react-dom` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"^19.2.7",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 30:** `react-router-dom` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"^7.17.0"`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 31:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 32:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
