# tsconfig.json

[فهرس كل الأكواد](../../16-all-project-source.md)

المشروع: `mo-m-en-portfolio` · الملف: `tsconfig.json` · 21 سطر.

**وظيفة الملف:** إعدادات تطوير/build/dependencies أو اختبار. تفسّرها الأداة المكتوبة في الملف؛ وجود package لا يثبت استخدامها في واجهة نشطة.

**نوعه:** source / مصدر. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../mo-m-en-portfolio/tsconfig.json). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

</details>

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
```

**السطر 1:** عنصر/تكملة داخل بيانات JSON؛ الفواصل تفصل العناصر، و[] قائمة و{} object.

**السطر 2:** `compilerOptions` اسم حقل/إعداد، والقيمة بعد النقطتين هي `{`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 3:** `target` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"ES2020",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 4:** `useDefineForClassFields` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 5:** `lib` اسم حقل/إعداد، والقيمة بعد النقطتين هي `["ES2020", "DOM", "DOM.Iterable"],`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 6:** `module` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"ESNext",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 7:** `skipLibCheck` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 8:** `moduleResolution` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"bundler",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 9–16

```json
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
```

**السطر 9:** `allowImportingTsExtensions` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 10:** `resolveJsonModule` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 11:** `isolatedModules` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 12:** `noEmit` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 13:** `jsx` اسم حقل/إعداد، والقيمة بعد النقطتين هي `"react-jsx",`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 14:** `strict` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 15:** `noUnusedLocals` اسم حقل/إعداد، والقيمة بعد النقطتين هي `false,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 16:** `noUnusedParameters` اسم حقل/إعداد، والقيمة بعد النقطتين هي `false,`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

### السطور 17–21

```json
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}

```

**السطر 17:** `noFallthroughCasesInSwitch` اسم حقل/إعداد، والقيمة بعد النقطتين هي `true`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 18:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 19:** `include` اسم حقل/إعداد، والقيمة بعد النقطتين هي `["src"]`. JSON بيانات، مش function بتتنفّذ؛ لو القيمة script فتنفيذها محتاج الأمر المناسب صراحة.

**السطر 20:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
