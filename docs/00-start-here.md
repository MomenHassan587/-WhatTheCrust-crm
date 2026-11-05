# ابدأ من هنا: سؤال صغير ← كود صغير ← تطبيق بإيدك

## الجديد: كل المصدر الحقيقي، مش دروس مختارة بس

- [16 — فهرس كل ملفات الكود في المشاريع الثلاثة](16-all-project-source.md): كل ملف له الكود الكامل وشرح سطوره وروابط التعريفات؛ مع فصل الملفات النشطة والقديمة وstarter.
- [17 — مثال الخدمات والتأكيد وwatch كامل بالـJavaScript والـtemplate](17-service-confirmation-and-watch.md): نفس طريقتنا في المحادثة، ويشمل تشغيل المكوّن من App.vue.
- [18 — رحلات backend في Pizza](18-pizza-backend-full-flows.md)، [19 — رحلات frontend في Pizza](19-pizza-frontend-full-flows.md)، [20 — رحلات AutoCare والبورتفوليو](20-autocare-portfolio-full-flows.md): نتتبع الواجهة والدوال والملفات المرتبطة للنهاية.

مرجع «كل المصدر» مش معناه تذاكر 100ملف في قعدة. خُد ميزة من الرحلات العملية، وبعدها افتح ملفها من الفهرس لو عايز الكود الكامل وأرقام السطور. مصطلحات English جنب شرحها العربي علشان تعرف تسمي اللي بتعمله في مقابلة.

المذكرات دي لمراجعة الشغل والاستعداد للوظائف، مش كتاب لازم تخلصه في قعدة. هنمشي بنفس طريقة مثال اختيار الخدمة: تفهم المطلوب، تكتب كود قصير، تعرف كل سطر بيعمل إيه، وتجرّبه.

## لو اسم method مش واضح، نوقف عنده الأول

الشرح مش مفروض يقول «يشغّل الدالة» ويسيبك مش فاهم اسمها. جنب الأمثلة هتلاقي:

- مين وفّر الدالة: اللغة، المتصفح، framework، ولا كود المشروع.
- بتاخد إيه بين الأقواس، ودي بيانات ولا callback.
- بترجع إيه، وهل بتعدّل بيانات أو بتعمل أثرًا جانبيًا.
- مثال بقيم واضحة ونتيجة متوقعة، وبعده شرح كل سطر.
- لو الدالة بتكمل في ملف آخر، نتابع الاستدعاء والتنفيذ والرد والعرض؛ الرابط وحده مش شرح للتكملة.

**ابدأ من هنا لو سؤالك عن المؤقت:** [09 — setInterval وclearInterval وتحديث الطلبات كاملًا](09-staff-dashboard.md). ولو الفرق بين method وproperty وcallback لسه مش ثابت، [بداية القاموس](01-glossary.md) فيها أمثلة مستقلة عليهم.

طول الصفحة مش معناه تذاكرها مرة واحدة؛ خُد method واحدة وافهم مدخلاتها ونتيجتها، وبعدين كمّل السلسلة.

## سؤال البداية: أنا بذاكر مشاريع إيه؟

| المشروع | الفرونت | الباك والبيانات | نتعلم منه إيه؟ |
|---|---|---|---|
| What The Crust في `pizza-crm` | React + JSX | Laravel؛ كتالوج وطلبات وأدوار وإدارة ودفع | مشروع full-stack محلي، وفيه نسخة static demo منفصلة |
| AutoCare في `autocare-booking` | Vue ومؤثرات GSAP | Laravel بيقدّم الصفحة محليًا؛ بيانات الجراج demo في المتصفح | Vue، forms، computed، props، lifecycle، تخزين محلي |
| Portfolio في `mo-m-en-portfolio` | React + TypeScript | واجهة static؛ مفيش Laravel backend داخل المشروع | components، props types، animations، تنظيم sections |

**نقطة مهمة للإنترفيو:** كود Laravel الموجود على جهازك مش معناه إنه بيشتغل في نسخة Cloudflare الـ static. حساب demo في المتصفح مش authentication حقيقي، وlocalStorage مش قاعدة بيانات السيرفر.

المصادر اللي اتراجع عليها الكلام: [Pizza entry](../resources/js/app.jsx)، [Pizza API helper](../resources/js/lib/api.js)، [AutoCare entry](../../autocare-booking/resources/js/app.js)، [Garage storage](../../autocare-booking/resources/js/services/garageRepository.js)، [Portfolio entry](../../mo-m-en-portfolio/src/main.tsx).

## هتذاكر إزاي؟

كل مرة خُد **سؤال واحد فقط**:

1. اقرأ المطلوب قبل الكود، وحاول تتوقع الحل.
2. افتح ملف المصدر المشار إليه، وحدد المقتطف فيه.
3. اكتب المثال في مكوّن تجريبي منفصل، مش فوق المشروع الأصلي كله.
4. غيّر قيمة أو امسح سطر وشوف النتيجة، وبعدها رجّعه.
5. حل التمرين الصغير واشرح النتيجة بصوتك.

العناوين دي لها معنى ثابت:

- **مقتطف فعلي:** النص من ملف المشروع نفسه؛ ممكن يكون جزء من دالة وليس ملفًا كاملًا.
- **مبسّط من المشروع:** قلّلنا التفاصيل للتعلّم؛ مش بندّعي إنه مطابق حرفيًا.
- **مثال تدريبي جديد:** تمرين إضافي؛ ما تضيفوش للإنتاج من غير دمج واختبار.
- **خطأ شائع:** حاجة تتأكد منها لو المثال مش شغال.
- **سؤال إنترفيو:** افهم إجابته، مش تحفظ ألفاظها.

أمثلة الدروس مش خطوات لتشغيل سيرفر الإنتاج أو استقبال دفع حقيقي. ما تنشرش secrets، وما تستخدمش بيانات شخصية فعلية في التمارين.

## ترتيب عملي بدل قراءة كل الملفات بالترتيب الرقمي

### المرحلة 1: JavaScript وبعدها Vue

1. [12 — JavaScript practice](12-javascript-practice.md): arrays، functions، find/filter/map، async.
2. [13 — Vue practice](13-vue-practice.md): ref، v-model، computed، props وevents.
3. [01 — قاموس الأسئلة](01-glossary.md): ارجع له عند ظهور كلمة مش واضحة، مش لازم تقرأه كله الأول.

**اختبار الخروج:** تختار خدمة، يظهر سعرها، وتشرح ليه استخدمت `find` و`computed`.

### المرحلة 2: React وتنظيم الفرونت

4. [14 — React وTypeScript](14-react-typescript-practice.md).
5. [02 — البداية منين؟ خريطة المشاريع](02-project-map.md).
6. [11 — App وNavbar وFooter والتنسيقات](11-app-navbar-footer-and-styles.md).
7. [07 — المنيو والسلة](07-menu-and-cart.md).
8. [10 — الصفحة الرئيسية والحركة](10-hero-home-and-animation.md).

**اختبار الخروج:** تعدّل عنصر سلة من غير mutation وتشرح props مقابل state وتنظيف effect.

### المرحلة 3: Laravel والطلب الكامل

9. [06 — routes/controllers/server](06-routes-controllers-and-server.md).
10. [05 — database/models](05-database-and-models.md).
11. [04 — login/roles](04-login-and-roles.md).
12. [08 — checkout/payment](08-checkout-and-payment.md).
13. [09 — staff dashboard](09-staff-dashboard.md).
14. [03 — أسئلة features من أول الضغط لحد الرد](03-features.md).

**اختبار الخروج:** تتبع طلب من React إلى Laravel وتعرف مين بيحدد السعر والصلاحية.

### المرحلة 4: شغل الوظائف والتسليم

15. [15 — testing/Git/debugging](15-testing-git-and-debugging.md).
16. [مقابلة عملية قصيرة](interview-simple.md).
17. [المكتبات: ليه موجودة؟](libraries.md).
18. [الديمو والاستضافة](demo-hosting.md).
19. [أفكار وتمارين تطوير](ideas.md).
20. [مطابقة صور المنيو](menu-photo-mapping.md).
21. [تقرير صور المنتجات كتمارين](product-photo-report.md).

دول **22 ملف مذاكرة أساسي**. أضفنا فوقهم **5 ملفات جديدة**: فهرس المصدر، المثال الكامل، و3 مسارات عملية. ومعاهم **194 صفحة لملفات المصدر**؛ يعني **221 صفحة مذاكرة** إجمالًا. الرقم في اسم الملف للتنظيم؛ مش شرط يمثّل مستوى الصعوبة.

## إيه المهم دلوقتي للوظائف؟

**لازم تعرف تطبّق وتشرح:** variables/functions، array methods، async/await، state/props، forms، HTTP، validation، authorization، SQL relationships، tests، Git.

**بعد الأساس:** memoization، dependency injection، transactions، payments/webhooks، performance، deployment.

**يتأجل لحد ما تحتاجه:** معادلات الأنيميشن الطويلة وتفاصيل canvas وفريمات الفيديو. وجودها في المشروع مش معناها إنها أول حاجة في كل مقابلة.

## سؤال أخير قبل ما تبدأ

لو حجز اختفى بعد فتح الموقع من جهاز تاني، هل دي مشكلة Vue؟

<details>
<summary>الإجابة</summary>

مش لازم. لو الحجز demo محفوظ في localStorage، فهو خاص بالمتصفح والـ origin. علشان أجهزة مختلفة تشوف نفس الحجز، محتاج backend وقاعدة بيانات وهوية وصلاحيات مناسبة. ده مهم جدًا وإنت بتشرح AutoCare.

</details>

ابدأ بسؤال واحد من [درس JavaScript](12-javascript-practice.md). لما تعرف تكتبه وتفسّره من غير نسخ، انتقل للي بعده.
