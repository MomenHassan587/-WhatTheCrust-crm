# قسم الورشة والصور والثقة

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `autocare-booking` · الملف: `resources/js/components/WorkshopSection.vue` · 62 سطر.

**وظيفة الملف:** قسم عرض: يستورد business ويكرر supportedMakes، ويستخدم AppIcon/StatusBadge. الصور lazy وثابتة؛ مفيش API أو فورم هنا.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../../autocare-booking/resources/js/components/WorkshopSection.vue). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [autocare-booking/resources/js/components/AppIcon.vue](AppIcon.vue.md)

- [autocare-booking/resources/js/components/StatusBadge.vue](StatusBadge.vue.md)

- [autocare-booking/resources/js/config/business.js](../config/business.js.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```vue
<template>
    <section class="workshop-section" aria-labelledby="workshop-title">
        <div class="container">
            <div class="trust-strip" aria-label="Garage information">
                <a href="#reviews"><AppIcon name="star" /><span><strong>Customer stories</strong><small>Explore sample reviews</small></span></a>
                <a href="#makes"><AppIcon name="car" /><span><strong>Multi-make care</strong><small>{{ business.supportedMakes.length }} makes in this demo</small></span></a>
                <a href="#contact"><AppIcon name="pin" /><span><strong>New Cairo</strong><small>Example service area</small></span></a>
                <a href="#warranty"><AppIcon name="shield" /><span><strong>Clear warranty terms</strong><small>View illustrative coverage</small></span></a>
            </div>
            <div class="section-overline"><span>01 / THE WORKSHOP</span><span class="demo-label">Portfolio demo</span></div>
            <div class="workshop-editorial">
                <div class="workshop-copy">
                    <p class="editorial-kicker">Good hands. Clear answers.</p>
                    <h2 id="workshop-title">Care you can see.<br><em>Confidence you can feel.</em></h2>
                    <p>Your car is part of your everyday life. Looking after it should feel straightforward, from the first inspection to the moment you drive away.</p>
                    <ul class="care-promises">
                        <li><AppIcon name="check" /><span><strong>Understand the work</strong><small>Readable inspection notes and a clear service breakdown.</small></span></li>
                        <li><AppIcon name="check" /><span><strong>Stay in the loop</strong><small>Your appointments, updates, and history in My Garage.</small></span></li>
                        <li><AppIcon name="check" /><span><strong>Plan your next visit</strong><small>Choose a service and request a time that suits you.</small></span></li>
                    </ul>
                    <a class="text-link" href="#booking">Find your next service <AppIcon name="arrow" /></a>
                </div>
                <div class="workshop-photos">
                    <figure class="photo-main">
                        <img :src="'/assets/photos/workshop-engine.webp'" alt="Mechanic working beneath the open hood of a car in a real workshop" width="1400" height="2100" loading="lazy" decoding="async">
                        <figcaption>Precision starts with attention.</figcaption>
                    </figure>
                    <figure class="photo-detail">
                        <img :src="'/assets/photos/workshop-inspection.jpg'" alt="Technician inspecting the underside of a raised vehicle" width="900" height="1350" loading="lazy" decoding="async">
                        <figcaption>Every detail matters.</figcaption>
                    </figure>
                    <span class="photo-disclosure">Real workshop photography · stock images for this demo</span>
                </div>
            </div>
            <div id="makes" class="supported-makes">
                <p>Example vehicle coverage</p>
                <div><span v-for="make in business.supportedMakes" :key="make">{{ make }}</span></div>
            </div>
            <div class="garage-preview">
                <div class="garage-preview-copy">
                    <span class="editorial-kicker">MEET YOUR CAR’S NEW HOME</span>
                    <h3>Less paperwork.<br>More peace of mind.</h3>
                    <p>Saved vehicles. Upcoming visits. A service history that stays with you. Take the My Garage demo for a spin.</p>
                    <a class="btn btn-primary" href="/my-garage">Explore My Garage <AppIcon name="arrow" /></a>
                </div>
                <div class="preview-ticket" aria-label="My Garage feature preview">
                    <div class="ticket-top"><AppIcon name="car" /><StatusBadge label="Sample vehicle" tone="neutral" icon="car" /></div>
                    <span class="ticket-caption">YOUR EVERYDAY COMPANION</span>
                    <h4>Toyota Corolla <small>2021</small></h4>
                    <div class="ticket-appointment"><AppIcon name="calendar" /><div><strong>Next up: Oil Change</strong><span>Your next visit, all in one place.</span></div></div>
                    <div class="ticket-footer"><span>Service history, always handy</span><AppIcon name="check" /></div>
                </div>
            </div>
        </div>
    </section>
</template>
<script setup>
import AppIcon from './AppIcon.vue';
import StatusBadge from './StatusBadge.vue';
import { business } from '../config/business';
</script>
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### business

يمرّر عدد وأسماء الماركات وتفاصيل الديمو للعرض.

- **بتاخد إيه؟ Inputs:** استيراد config

- **بترجع/بتغيّر إيه؟ Return / effect:** قراءة object فقط

### v-for make

يعمل span لكل اسم ماركة، والاسم نفسه key لأنه فريد داخل القائمة.

- **بتاخد إيه؟ Inputs:** business.supportedMakes

- **بترجع/بتغيّر إيه؟ Return / effect:** عناصر DOM من template

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```vue
<template>
    <section class="workshop-section" aria-labelledby="workshop-title">
        <div class="container">
            <div class="trust-strip" aria-label="Garage information">
                <a href="#reviews"><AppIcon name="star" /><span><strong>Customer stories</strong><small>Explore sample reviews</small></span></a>
                <a href="#makes"><AppIcon name="car" /><span><strong>Multi-make care</strong><small>{{ business.supportedMakes.length }} makes in this demo</small></span></a>
                <a href="#contact"><AppIcon name="pin" /><span><strong>New Cairo</strong><small>Example service area</small></span></a>
                <a href="#warranty"><AppIcon name="shield" /><span><strong>Clear warranty terms</strong><small>View illustrative coverage</small></span></a>
```

**السطر 1:** بداية Vue template / شكل الواجهة؛ تعبيراته تقرأ الحالة والدوال من script المكوّن.

**السطر 2:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 3:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 4:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 5:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 6:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 7:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 8:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 9–16

```vue
            </div>
            <div class="section-overline"><span>01 / THE WORKSHOP</span><span class="demo-label">Portfolio demo</span></div>
            <div class="workshop-editorial">
                <div class="workshop-copy">
                    <p class="editorial-kicker">Good hands. Clear answers.</p>
                    <h2 id="workshop-title">Care you can see.<br><em>Confidence you can feel.</em></h2>
                    <p>Your car is part of your everyday life. Looking after it should feel straightforward, from the first inspection to the moment you drive away.</p>
                    <ul class="care-promises">
```

**السطر 9:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 10:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 11:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 12:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 13:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 14:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 15:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 16:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 17–24

```vue
                        <li><AppIcon name="check" /><span><strong>Understand the work</strong><small>Readable inspection notes and a clear service breakdown.</small></span></li>
                        <li><AppIcon name="check" /><span><strong>Stay in the loop</strong><small>Your appointments, updates, and history in My Garage.</small></span></li>
                        <li><AppIcon name="check" /><span><strong>Plan your next visit</strong><small>Choose a service and request a time that suits you.</small></span></li>
                    </ul>
                    <a class="text-link" href="#booking">Find your next service <AppIcon name="arrow" /></a>
                </div>
                <div class="workshop-photos">
                    <figure class="photo-main">
```

**السطر 17:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 18:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 19:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 20:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 21:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 22:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 23:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 24:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 25–32

```vue
                        <img :src="'/assets/photos/workshop-engine.webp'" alt="Mechanic working beneath the open hood of a car in a real workshop" width="1400" height="2100" loading="lazy" decoding="async">
                        <figcaption>Precision starts with attention.</figcaption>
                    </figure>
                    <figure class="photo-detail">
                        <img :src="'/assets/photos/workshop-inspection.jpg'" alt="Technician inspecting the underside of a raised vehicle" width="900" height="1350" loading="lazy" decoding="async">
                        <figcaption>Every detail matters.</figcaption>
                    </figure>
                    <span class="photo-disclosure">Real workshop photography · stock images for this demo</span>
```

**السطر 25:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 26:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 27:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 28:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 29:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 30:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 31:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 32:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 33–40

```vue
                </div>
            </div>
            <div id="makes" class="supported-makes">
                <p>Example vehicle coverage</p>
                <div><span v-for="make in business.supportedMakes" :key="make">{{ make }}</span></div>
            </div>
            <div class="garage-preview">
                <div class="garage-preview-copy">
```

**السطر 33:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 34:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 35:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 36:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 37:** v-for: لف على `business.supportedMakes`، وفي كل دورة اسم العنصر الحالي `make`. كرّر التاج ومحتواه لكل عنصر. الاسم المحلي ده متاح داخل العنصر المتكرر بس؛ :key تربط كل نسخة بهوية مستقرة.

**السطر 38:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 39:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 40:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 41–48

```vue
                    <span class="editorial-kicker">MEET YOUR CAR’S NEW HOME</span>
                    <h3>Less paperwork.<br>More peace of mind.</h3>
                    <p>Saved vehicles. Upcoming visits. A service history that stays with you. Take the My Garage demo for a spin.</p>
                    <a class="btn btn-primary" href="/my-garage">Explore My Garage <AppIcon name="arrow" /></a>
                </div>
                <div class="preview-ticket" aria-label="My Garage feature preview">
                    <div class="ticket-top"><AppIcon name="car" /><StatusBadge label="Sample vehicle" tone="neutral" icon="car" /></div>
                    <span class="ticket-caption">YOUR EVERYDAY COMPANION</span>
```

**السطر 41:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 42:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 43:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 44:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 45:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 46:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 47:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 48:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 49–56

```vue
                    <h4>Toyota Corolla <small>2021</small></h4>
                    <div class="ticket-appointment"><AppIcon name="calendar" /><div><strong>Next up: Oil Change</strong><span>Your next visit, all in one place.</span></div></div>
                    <div class="ticket-footer"><span>Service history, always handy</span><AppIcon name="check" /></div>
                </div>
            </div>
        </div>
    </section>
</template>
```

**السطر 49:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 50:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 51:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 52:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 53:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 54:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 55:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 56:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 57–62

```vue
<script setup>
import AppIcon from './AppIcon.vue';
import StatusBadge from './StatusBadge.vue';
import { business } from '../config/business';
</script>

```

**السطر 57:** بداية جزء JavaScript في مكوّن Vue/صفحة HTML. setup في Vue تتيح التعريفات للـtemplate؛ type=module في HTML يحدد تحميل module.

**السطر 58:** Import / استيراد: الأسماء `AppIcon` جاية من `./AppIcon.vue`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 59:** Import / استيراد: الأسماء `StatusBadge` جاية من `./StatusBadge.vue`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 60:** Import / استيراد: الأسماء `business` جاية من `../config/business`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 61:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
