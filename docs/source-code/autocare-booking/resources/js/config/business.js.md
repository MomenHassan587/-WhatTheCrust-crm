# بيانات النشاط التجاري التجريبية

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `autocare-booking` · الملف: `resources/js/config/business.js` · 23 سطر.

**وظيفة الملف:** مصدر مركزي للأسماء والمواعيد والعنوان والتقييمات. التقييمات illustrative وليست تقييمات حقيقية، والإيميل example غير عامل.

**نوعه:** support. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../../autocare-booking/resources/js/config/business.js). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [autocare-booking/resources/js/components/WorkshopSection.vue](../components/WorkshopSection.vue.md)

- [autocare-booking/resources/js/components/CustomerSupport.vue](../components/CustomerSupport.vue.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```js
// Replace the demo facts before launching this template for a real garage.
export const business = {
    demo: true,
    name: 'AutoCare Pro',
    supportedMakes: ['Toyota', 'BMW', 'Hyundai', 'Nissan', 'Kia', 'Mercedes-Benz'],
    location: 'New Cairo, Cairo, Egypt',
    locationNote: 'Example service area. No physical workshop is associated with this demo.',
    directionsUrl: 'https://www.google.com/maps/search/?api=1&query=New+Cairo+Cairo+Egypt',
    email: 'hello@autocare.example',
    phone: null,
    hours: [
        { days: 'Saturday – Thursday', time: '9:00 AM – 6:00 PM' },
        { days: 'Friday', time: 'Closed' },
    ],
    warranty: 'Example coverage: 6 months or 10,000 km',
    warrantyDetails: 'Illustrative terms only. A buyer must replace these with their actual parts and workmanship policy, exclusions, and claim process before accepting customers.',
    reviews: [
        { name: 'Mariam A.', vehicle: 'Toyota Corolla', quote: 'A clear estimate, an easy booking, and updates at every step. Exactly the experience I wanted.' },
        { name: 'Omar H.', vehicle: 'BMW 320i', quote: 'Having the service history and next appointment in one place makes looking after my car much simpler.' },
        { name: 'Salma K.', vehicle: 'Hyundai Elantra', quote: 'I could understand the inspection notes and review the work before anything went ahead.' },
    ],
};
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### business

object إعدادات تستورده أقسام العرض بدل تكرار الحقائق في كل component.

- **بتاخد إيه؟ Inputs:** لا شيء

- **بترجع/بتغيّر إيه؟ Return / effect:** object عادي غير reactive يشمل supportedMakes/hours/reviews

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```js
// Replace the demo facts before launching this template for a real garage.
export const business = {
    demo: true,
    name: 'AutoCare Pro',
    supportedMakes: ['Toyota', 'BMW', 'Hyundai', 'Nissan', 'Kia', 'Mercedes-Benz'],
    location: 'New Cairo, Cairo, Egypt',
    locationNote: 'Example service area. No physical workshop is associated with this demo.',
    directionsUrl: 'https://www.google.com/maps/search/?api=1&query=New+Cairo+Cairo+Egypt',
```

**السطر 1:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 2:** Variable declaration / تعريف `business` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة Object حقولها `demo`، `name`، `supportedMakes`، `location`، `locationNote`، `directionsUrl`، `email`، `phone`، `hours`، `warranty`، `warrantyDetails`، `reviews`. دور `business` هنا: object إعدادات تستورده أقسام العرض بدل تكرار الحقائق في كل component. المدخلات: لا شيء. الناتج/الأثر: object عادي غير reactive يشمل supportedMakes/hours/reviews.

**السطر 3:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 4:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 5:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 6:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 7:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 8:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 9–16

```js
    email: 'hello@autocare.example',
    phone: null,
    hours: [
        { days: 'Saturday – Thursday', time: '9:00 AM – 6:00 PM' },
        { days: 'Friday', time: 'Closed' },
    ],
    warranty: 'Example coverage: 6 months or 10,000 km',
    warrantyDetails: 'Illustrative terms only. A buyer must replace these with their actual parts and workmanship policy, exclusions, and claim process before accepting customers.',
```

**السطر 9:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 10:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 11:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 12:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 13:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 14:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 15:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 16:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 17–23

```js
    reviews: [
        { name: 'Mariam A.', vehicle: 'Toyota Corolla', quote: 'A clear estimate, an easy booking, and updates at every step. Exactly the experience I wanted.' },
        { name: 'Omar H.', vehicle: 'BMW 320i', quote: 'Having the service history and next appointment in one place makes looking after my car much simpler.' },
        { name: 'Salma K.', vehicle: 'Hyundai Elantra', quote: 'I could understand the inspection notes and review the work before anything went ahead.' },
    ],
};

```

**السطر 17:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 18:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 19:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 20:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 21:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 22:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
