# التقييمات والأسئلة والتواصل

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `autocare-booking` · الملف: `resources/js/components/CustomerSupport.vue` · 52 سطر.

**وظيفة الملف:** تقييمات الديمو وساعات العمل جاية من config. الـ FAQ تستخدم details/summary الأصلية في HTML، مش JavaScript toggle.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../../autocare-booking/resources/js/components/CustomerSupport.vue). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [autocare-booking/resources/js/components/AppIcon.vue](AppIcon.vue.md)

- [autocare-booking/resources/js/config/business.js](../config/business.js.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```vue
<template>
    <section id="reviews" class="reviews-section" aria-labelledby="reviews-title">
        <div class="container">
            <div class="section-overline"><span>02 / CUSTOMER EXPERIENCE</span><span class="demo-label">Illustrative reviews · not real testimonials</span></div>
            <div class="support-heading"><h2 id="reviews-title">A better visit.<br><em>From start to finish.</em></h2><p>Sample customer stories showing how verified feedback can look once this product is connected to a real garage.</p></div>
            <div class="review-grid">
                <article v-for="review in business.reviews" :key="review.name" class="review-card">
                    <span class="review-mark" aria-hidden="true">“</span>
                    <blockquote>{{ review.quote }}</blockquote>
                    <div class="review-person"><span>{{ review.name.charAt(0) }}</span><div><strong>{{ review.name }}</strong><small>{{ review.vehicle }} · Sample review</small></div></div>
                </article>
            </div>
        </div>
    </section>
    <section id="faqs" class="faq-section" aria-labelledby="faq-title">
        <div class="container faq-grid">
            <div class="faq-intro"><p class="editorial-kicker">A LITTLE CLARITY GOES A LONG WAY</p><h2 id="faq-title">Before you<br><em>hand over the keys.</em></h2><p>Answers to the questions you might have before your first visit.</p><a class="text-link" href="#contact">Talk to the garage <AppIcon name="arrow" /></a></div>
            <div class="faq-list">
                <details v-for="faq in faqs" :key="faq.question" :id="faq.id">
                    <summary>{{ faq.question }}<AppIcon name="plus" /></summary>
                    <p>{{ faq.answer }}</p>
                </details>
            </div>
        </div>
    </section>
    <section id="contact" class="contact-section" aria-labelledby="contact-title">
        <div class="container">
            <div class="section-overline"><span>03 / COME SAY HELLO</span><span class="demo-label">Demo business details</span></div>
            <div class="contact-grid">
                <div class="contact-intro"><p class="editorial-kicker">YOUR NEXT VISIT STARTS HERE</p><h2 id="contact-title">Let’s take care<br>of your car.</h2><p>Pick a service, ask a question, or explore the example service area.</p><a class="btn btn-primary" href="#booking">Request an appointment <AppIcon name="arrow" /></a></div>
                <div class="contact-details">
                    <article><AppIcon name="pin" /><div><h3>Find the workshop</h3><p>{{ business.location }}</p><small>{{ business.locationNote }}</small><a :href="business.directionsUrl" target="_blank" rel="noopener noreferrer">Explore demo area <span aria-hidden="true">↗</span></a></div></article>
                    <article><AppIcon name="clock" /><div><h3>Opening hours <small class="inline-demo">Example schedule</small></h3><p v-for="row in business.hours" :key="row.days" class="hours-row"><span>{{ row.days }}</span><strong>{{ row.time }}</strong></p><small>Hours are illustrative. Confirm the real garage’s schedule before visiting.</small></div></article>
                    <article><AppIcon name="mail" /><div><h3>Stay in touch</h3><p>{{ business.email }}</p><small>Demo email address. No messages are delivered. Phone and WhatsApp details can be added by the buyer.</small></div></article>
                </div>
            </div>
        </div>
    </section>
</template>
<script setup>
import AppIcon from './AppIcon.vue';
import { business } from '../config/business';
const faqs = [
    { question: 'How do I book a service?', answer: 'Choose a service, add your vehicle details, and select a preferred date and time. In this demo, your request appears in My Garage on this browser. No request is sent to a real workshop.' },
    { question: 'Is my appointment confirmed immediately?', answer: 'A new request is marked “Requested”. A real garage would review availability before confirming it. The demo does not reserve real workshop capacity.' },
    { question: 'What if I am not sure which service I need?', answer: 'Choose Engine Check and describe the symptoms in the problem description. A real workshop can use these details to plan an inspection; the website itself does not diagnose your vehicle.' },
    { question: 'Are the prices fixed?', answer: 'The EGP prices are sample service prices. Final pricing can depend on your vehicle, required parts, and inspection results. A real garage should provide an agreed estimate before work begins.' },
    { id: 'warranty', question: 'What does the warranty cover?', answer: business.warranty + '. ' + business.warrantyDetails },
    { question: 'Can I manage my bookings online?', answer: 'Yes. Open My Garage to view requests, reschedule or cancel demo appointments, save vehicles, and inspect sample service records. Demo changes are stored only in this browser.' },
];
</script>
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### faqs

قائمة question/answer؛ إجابة warranty بتتجمع من config.

- **بتاخد إيه؟ Inputs:** نصوص ثابتة + business.warranty/business.warrantyDetails

- **بترجع/بتغيّر إيه؟ Return / effect:** array للـ v-for

### review.name.charAt

ياخد أول حرف للاسم لعرض avatar نصي.

- **بتاخد إيه؟ Inputs:** index=0

- **بترجع/بتغيّر إيه؟ Return / effect:** string أول حرف، مش صورة مستخدم حقيقية

### business.directionsUrl

رابط Maps لمنطقة demo يفتح tab جديدة؛ مش API خرائط ولا لوكيشن مباشر.

- **بتاخد إيه؟ Inputs:** config string

- **بترجع/بتغيّر إيه؟ Return / effect:** href في anchor

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```vue
<template>
    <section id="reviews" class="reviews-section" aria-labelledby="reviews-title">
        <div class="container">
            <div class="section-overline"><span>02 / CUSTOMER EXPERIENCE</span><span class="demo-label">Illustrative reviews · not real testimonials</span></div>
            <div class="support-heading"><h2 id="reviews-title">A better visit.<br><em>From start to finish.</em></h2><p>Sample customer stories showing how verified feedback can look once this product is connected to a real garage.</p></div>
            <div class="review-grid">
                <article v-for="review in business.reviews" :key="review.name" class="review-card">
                    <span class="review-mark" aria-hidden="true">“</span>
```

**السطر 1:** بداية Vue template / شكل الواجهة؛ تعبيراته تقرأ الحالة والدوال من script المكوّن.

**السطر 2:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 3:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 4:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 5:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 6:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 7:** v-for: لف على `business.reviews`، وفي كل دورة اسم العنصر الحالي `review`. كرّر التاج ومحتواه لكل عنصر. الاسم المحلي ده متاح داخل العنصر المتكرر بس؛ :key تربط كل نسخة بهوية مستقرة.

**السطر 8:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 9–16

```vue
                    <blockquote>{{ review.quote }}</blockquote>
                    <div class="review-person"><span>{{ review.name.charAt(0) }}</span><div><strong>{{ review.name }}</strong><small>{{ review.vehicle }} · Sample review</small></div></div>
                </article>
            </div>
        </div>
    </section>
    <section id="faqs" class="faq-section" aria-labelledby="faq-title">
        <div class="container faq-grid">
```

**السطر 9:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 10:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 11:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 12:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 13:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 14:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 15:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 16:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 17–24

```vue
            <div class="faq-intro"><p class="editorial-kicker">A LITTLE CLARITY GOES A LONG WAY</p><h2 id="faq-title">Before you<br><em>hand over the keys.</em></h2><p>Answers to the questions you might have before your first visit.</p><a class="text-link" href="#contact">Talk to the garage <AppIcon name="arrow" /></a></div>
            <div class="faq-list">
                <details v-for="faq in faqs" :key="faq.question" :id="faq.id">
                    <summary>{{ faq.question }}<AppIcon name="plus" /></summary>
                    <p>{{ faq.answer }}</p>
                </details>
            </div>
        </div>
```

**السطر 17:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 18:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 19:** v-for: لف على `faqs`، وفي كل دورة اسم العنصر الحالي `faq`. كرّر التاج ومحتواه لكل عنصر. الاسم المحلي ده متاح داخل العنصر المتكرر بس؛ :key تربط كل نسخة بهوية مستقرة.

**السطر 20:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 21:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 22:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 23:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 24:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 25–32

```vue
    </section>
    <section id="contact" class="contact-section" aria-labelledby="contact-title">
        <div class="container">
            <div class="section-overline"><span>03 / COME SAY HELLO</span><span class="demo-label">Demo business details</span></div>
            <div class="contact-grid">
                <div class="contact-intro"><p class="editorial-kicker">YOUR NEXT VISIT STARTS HERE</p><h2 id="contact-title">Let’s take care<br>of your car.</h2><p>Pick a service, ask a question, or explore the example service area.</p><a class="btn btn-primary" href="#booking">Request an appointment <AppIcon name="arrow" /></a></div>
                <div class="contact-details">
                    <article><AppIcon name="pin" /><div><h3>Find the workshop</h3><p>{{ business.location }}</p><small>{{ business.locationNote }}</small><a :href="business.directionsUrl" target="_blank" rel="noopener noreferrer">Explore demo area <span aria-hidden="true">↗</span></a></div></article>
```

**السطر 25:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 26:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 27:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 28:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 29:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 30:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 31:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 32:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 33–40

```vue
                    <article><AppIcon name="clock" /><div><h3>Opening hours <small class="inline-demo">Example schedule</small></h3><p v-for="row in business.hours" :key="row.days" class="hours-row"><span>{{ row.days }}</span><strong>{{ row.time }}</strong></p><small>Hours are illustrative. Confirm the real garage’s schedule before visiting.</small></div></article>
                    <article><AppIcon name="mail" /><div><h3>Stay in touch</h3><p>{{ business.email }}</p><small>Demo email address. No messages are delivered. Phone and WhatsApp details can be added by the buyer.</small></div></article>
                </div>
            </div>
        </div>
    </section>
</template>
<script setup>
```

**السطر 33:** v-for: لف على `business.hours`، وفي كل دورة اسم العنصر الحالي `row`. كرّر التاج ومحتواه لكل عنصر. الاسم المحلي ده متاح داخل العنصر المتكرر بس؛ :key تربط كل نسخة بهوية مستقرة.

**السطر 34:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 35:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 36:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 37:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 38:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 39:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 40:** بداية جزء JavaScript في مكوّن Vue/صفحة HTML. setup في Vue تتيح التعريفات للـtemplate؛ type=module في HTML يحدد تحميل module.

### السطور 41–48

```vue
import AppIcon from './AppIcon.vue';
import { business } from '../config/business';
const faqs = [
    { question: 'How do I book a service?', answer: 'Choose a service, add your vehicle details, and select a preferred date and time. In this demo, your request appears in My Garage on this browser. No request is sent to a real workshop.' },
    { question: 'Is my appointment confirmed immediately?', answer: 'A new request is marked “Requested”. A real garage would review availability before confirming it. The demo does not reserve real workshop capacity.' },
    { question: 'What if I am not sure which service I need?', answer: 'Choose Engine Check and describe the symptoms in the problem description. A real workshop can use these details to plan an inspection; the website itself does not diagnose your vehicle.' },
    { question: 'Are the prices fixed?', answer: 'The EGP prices are sample service prices. Final pricing can depend on your vehicle, required parts, and inspection results. A real garage should provide an agreed estimate before work begins.' },
    { id: 'warranty', question: 'What does the warranty cover?', answer: business.warranty + '. ' + business.warrantyDetails },
```

**السطر 41:** Import / استيراد: الأسماء `AppIcon` جاية من `./AppIcon.vue`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 42:** Import / استيراد: الأسماء `business` جاية من `../config/business`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 43:** Variable declaration / تعريف `faqs` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة الابتدائية Array فيها 6 عنصرًا؛ العناصر نفسها في السطور التالية. دور `faqs` هنا: قائمة question/answer؛ إجابة warranty بتتجمع من config. المدخلات: نصوص ثابتة + business.warranty/business.warrantyDetails. الناتج/الأثر: array للـ v-for.

**السطر 44:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 45:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 46:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 47:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 48:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 49–52

```vue
    { question: 'Can I manage my bookings online?', answer: 'Yes. Open My Garage to view requests, reschedule or cancel demo appointments, save vehicles, and inspect sample service records. Demo changes are stored only in this browser.' },
];
</script>

```

**السطر 49:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 50:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 51:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
