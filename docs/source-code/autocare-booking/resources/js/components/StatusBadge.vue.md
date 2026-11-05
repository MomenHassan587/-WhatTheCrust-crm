# شارة حالة فيها كلمة وأيقونة ولون

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `autocare-booking` · الملف: `resources/js/components/StatusBadge.vue` · 14 سطر.

**وظيفة الملف:** تستقبل label/tone/icon بدل الاعتماد على اللون فقط. tone تبني اسم CSS وicon تنتقل إلى AppIcon.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../../autocare-booking/resources/js/components/StatusBadge.vue). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [autocare-booking/resources/js/components/AppIcon.vue](AppIcon.vue.md)

- [autocare-booking/resources/js/components/GarageDashboard.vue](GarageDashboard.vue.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```vue
<template>
    <span class="status-badge" :class="'status-badge--' + tone">
        <AppIcon :name="icon" /><span>{{ label }}</span>
    </span>
</template>
<script setup>
import AppIcon from './AppIcon.vue';
defineProps({
    label: { type: String, required: true },
    tone: { type: String, default: 'neutral' },
    icon: { type: String, default: 'clock' },
});
</script>
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### defineProps

label مطلوبة وtone افتراضي neutral وicon افتراضي clock.

- **بتاخد إيه؟ Inputs:** props من الأب

- **بترجع/بتغيّر إيه؟ Return / effect:** قيم مقروءة في template

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### defineProps

- **جاية منين؟** Vue compiler macro

- **وظيفتها:** يعلن المدخلات التي يبعتها المكوّن الأب؛ لا import داخل script setup.

- **المدخلات — Arguments:** runtime props definition أو type

- **الناتج/الأثر — Return / effect:** readonly props object

- **أول موضع هنا:** السطر 8، والمدخلات المكتوبة: `{     label: { type: String, required: true },     tone: { type: String, default: 'neutral' },     icon: { type: String, default: 'clock' }, }`.

- **مثال:** const props = defineProps({ time: Number });

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```vue
<template>
    <span class="status-badge" :class="'status-badge--' + tone">
        <AppIcon :name="icon" /><span>{{ label }}</span>
    </span>
</template>
<script setup>
import AppIcon from './AppIcon.vue';
defineProps({
```

**السطر 1:** بداية Vue template / شكل الواجهة؛ تعبيراته تقرأ الحالة والدوال من script المكوّن.

**السطر 2:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 3:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 4:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 5:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 6:** بداية جزء JavaScript في مكوّن Vue/صفحة HTML. setup في Vue تتيح التعريفات للـtemplate؛ type=module في HTML يحدد تحميل module.

**السطر 7:** Import / استيراد: الأسماء `AppIcon` جاية من `./AppIcon.vue`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 8:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `defineProps(...)`: يعلن المدخلات التي يبعتها المكوّن الأب؛ لا import داخل script setup. القيم المكتوبة هنا: `{     label: { type: String, required: true },     tone: { type: String, default: 'neutral' },     icon: { typ…`. العائد/الأثر: readonly props object. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 9–14

```vue
    label: { type: String, required: true },
    tone: { type: String, default: 'neutral' },
    icon: { type: String, default: 'clock' },
});
</script>

```

**السطر 9:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 10:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 11:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 12:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 13:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
