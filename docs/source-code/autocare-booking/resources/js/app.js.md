# بداية Vue واختيار صفحة الموقع أو الجراج

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `autocare-booking` · الملف: `resources/js/app.js` · 13 سطر.

**وظيفة الملف:** ده مش تصميم الصفحة؛ ده السلك اللي بيقرأ الـ URL، يختار الـ component المناسب، ويشبّك Vue بالـ div اللي Laravel رجّعها.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../autocare-booking/resources/js/app.js). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [autocare-booking/resources/js/bootstrap.js](bootstrap.js.md)

- [autocare-booking/resources/css/app.css](../css/app.css.md)

- [autocare-booking/resources/css/product.css](../css/product.css.md)

- [autocare-booking/resources/js/components/GarageDashboard.vue](components/GarageDashboard.vue.md)

- [autocare-booking/resources/js/components/App.vue](components/App.vue.md)

- [autocare-booking/routes/web.php](../../routes/web.php.md)

- [autocare-booking/resources/views/app.blade.php](../views/app.blade.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```js
import './bootstrap';
import '../css/app.css';
import '../css/product.css';
import { createApp, defineAsyncComponent } from 'vue';

const isGarage = location.pathname.replace(/\/$/, '') === '/my-garage';
document.title = isGarage ? 'My Garage | AutoCare Pro' : 'AutoCare Pro | Car care, with clarity';
const Page = defineAsyncComponent(() => isGarage
    ? import('./components/GarageDashboard.vue')
    : import('./components/App.vue'));

createApp(Page).mount('#app');
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### isGarage

يحسم هل مسار المتصفح هو صفحة الجراج بعد إزالة slash أخيرة.

- **بتاخد إيه؟ Inputs:** location.pathname من المتصفح

- **بترجع/بتغيّر إيه؟ Return / effect:** Boolean: true للجراج، false للصفحة العامة

### Page

مكوّن async يحمّل Dashboard أو App حسب المسار، مش Vue Router.

- **بتاخد إيه؟ Inputs:** loader function بترجع dynamic import Promise

- **بترجع/بتغيّر إيه؟ Return / effect:** Vue async component definition

### createApp(Page).mount

ينشئ التطبيق ويعرضه داخل العنصر id=app.

- **بتاخد إيه؟ Inputs:** Page ثم selector '#app'

- **بترجع/بتغيّر إيه؟ Return / effect:** mount ترجع public component instance؛ الكود لا يخزنها

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### location.pathname.replace

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تستبدل تطابقًا أو تطابقات حسب pattern.

- **المدخلات — Arguments:** نص/regex ثم replacement.

- **الناتج/الأثر — Return / effect:** نص جديد؛ الأصل لا يتغيّر.

- **أول موضع هنا:** السطر 6، والمدخلات المكتوبة: `/\/$/`، `''`.

### defineAsyncComponent

- **جاية منين؟** Vue

- **وظيفتها:** يلف loader يرجع Promise لمكوّن ليحمّله Vue عند الحاجة.

- **المدخلات — Arguments:** loader أو options

- **الناتج/الأثر — Return / effect:** async component

- **أول موضع هنا:** السطر 8، والمدخلات المكتوبة: `() => isGarage     ? import('./components/GarageDashboard.vue')     : import('./components/App.vue')`.

- **مثال:** defineAsyncComponent(() => import('./components/App.vue'));

### import

- **جاية منين؟** JavaScript modules

- **وظيفتها:** تحمّل module ديناميكيًا وقت الحاجة.

- **المدخلات — Arguments:** مسار module.

- **الناتج/الأثر — Return / effect:** Promise لـmodule namespace؛ مش root component نفسه بدون اختيار export.

- **أول موضع هنا:** السطر 10، والمدخلات المكتوبة: `'./components/App.vue'`.

### createApp(Page).mount

- **جاية منين؟** Vue

- **وظيفتها:** تربط تطبيق Vue بعنصر DOM موجود وتبدأ عرض المكوّن.

- **المدخلات — Arguments:** selector أو عنصر.

- **الناتج/الأثر — Return / effect:** instance المكوّن الأساسي؛ الأثر الأساسي هو العرض.

- **أول موضع هنا:** السطر 12، والمدخلات المكتوبة: `'#app'`.

### createApp

- **جاية منين؟** Vue

- **وظيفتها:** ينشئ تطبيق Vue مستقل؛ mount تبدأ العرض في HTML target.

- **المدخلات — Arguments:** root component

- **الناتج/الأثر — Return / effect:** App instance

- **أول موضع هنا:** السطر 12، والمدخلات المكتوبة: `Page`.

- **مثال:** createApp(Page).mount('#app');

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```js
import './bootstrap';
import '../css/app.css';
import '../css/product.css';
import { createApp, defineAsyncComponent } from 'vue';

const isGarage = location.pathname.replace(/\/$/, '') === '/my-garage';
document.title = isGarage ? 'My Garage | AutoCare Pro' : 'AutoCare Pro | Car care, with clarity';
const Page = defineAsyncComponent(() => isGarage
```

**السطر 1:** Import / استيراد: الأسماء بدون أسماء؛ تشغيل الموديول لأثره جاية من `./bootstrap`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 2:** Import / استيراد: الأسماء بدون أسماء؛ تشغيل الموديول لأثره جاية من `../css/app.css`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 3:** Import / استيراد: الأسماء بدون أسماء؛ تشغيل الموديول لأثره جاية من `../css/product.css`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 4:** Import / استيراد: الأسماء `createApp`، `defineAsyncComponent` جاية من `vue`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 6:** Variable declaration / تعريف `isGarage` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `isGarage` هنا: يحسم هل مسار المتصفح هو صفحة الجراج بعد إزالة slash أخيرة. المدخلات: location.pathname من المتصفح. الناتج/الأثر: Boolean: true للجراج، false للصفحة العامة. الدوال الموجودة في السطر: `location.pathname.replace(...)`: تستبدل تطابقًا أو تطابقات حسب pattern. القيم المكتوبة هنا: `/\/$/`، `''`. العائد/الأثر: نص جديد؛ الأصل لا يتغيّر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 7:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 8:** Variable declaration / تعريف `Page` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `Page` هنا: مكوّن async يحمّل Dashboard أو App حسب المسار، مش Vue Router. المدخلات: loader function بترجع dynamic import Promise. الناتج/الأثر: Vue async component definition. الدوال الموجودة في السطر: `defineAsyncComponent(...)`: يلف loader يرجع Promise لمكوّن ليحمّله Vue عند الحاجة. القيم المكتوبة هنا: `() => isGarage     ? import('./components/GarageDashboard.vue')     : import('./components/App.vue')`. العائد/الأثر: async component. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 9–13

```js
    ? import('./components/GarageDashboard.vue')
    : import('./components/App.vue'));

createApp(Page).mount('#app');

```

**السطر 9:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `import(...)`: تحمّل module ديناميكيًا وقت الحاجة. القيم المكتوبة هنا: `'./components/GarageDashboard.vue'`. العائد/الأثر: Promise لـmodule namespace؛ مش root component نفسه بدون اختيار export.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 10:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `import(...)`: تحمّل module ديناميكيًا وقت الحاجة. القيم المكتوبة هنا: `'./components/App.vue'`. العائد/الأثر: Promise لـmodule namespace؛ مش root component نفسه بدون اختيار export.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 12:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `createApp(Page).mount(...)`: تربط تطبيق Vue بعنصر DOM موجود وتبدأ عرض المكوّن. القيم المكتوبة هنا: `'#app'`. العائد/الأثر: instance المكوّن الأساسي؛ الأثر الأساسي هو العرض.؛ `createApp(...)`: ينشئ تطبيق Vue مستقل؛ mount تبدأ العرض في HTML target. القيم المكتوبة هنا: `Page`. العائد/الأثر: App instance. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
