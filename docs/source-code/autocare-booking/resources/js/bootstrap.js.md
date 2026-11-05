# تجهيز Axios على window

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `autocare-booking` · الملف: `resources/js/bootstrap.js` · 5 سطر.

**وظيفة الملف:** يستورد Axios ويخليه متاح كـ window.axios ويضيف header يعرّف طلبات JavaScript. الملف ده مش بيبعت request لوحده.

**نوعه:** support. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../autocare-booking/resources/js/bootstrap.js). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```js
import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### window.axios

مرجع عام لمكتبة HTTP، لكنه مش مستخدم لحفظ الحجوزات التجريبية الحالية.

- **بتاخد إيه؟ Inputs:** axios module

- **بترجع/بتغيّر إيه؟ Return / effect:** Axios client على window

### defaults.headers.common

إعداد افتراضي مشترك لطلبات Axios اللاحقة.

- **بتاخد إيه؟ Inputs:** X-Requested-With = XMLHttpRequest

- **بترجع/بتغيّر إيه؟ Return / effect:** تعديل إعدادات العميل؛ لا توجد استجابة HTTP هنا

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–5

```js
import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

```

**السطر 1:** Import / استيراد: الأسماء `axios` جاية من `axios`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 2:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 4:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
