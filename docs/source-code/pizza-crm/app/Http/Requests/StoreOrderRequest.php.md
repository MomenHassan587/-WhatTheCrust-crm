# مراجعة بيانات checkout قبل إنشاء الطلب

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `app/Http/Requests/StoreOrderRequest.php` · 69 سطر.

**وظيفة الملف:** FormRequest تحدد shape الطلب وقواعد الحقول وتراجع ميعاد pickup. authorize=true لأن الضيف مسموح؛ الأسعار مش موثوق فيها من المتصفح ومش ضمن validated payload. فحص ساعات الفرع مش مضمون حاليًا: opens_at/closes_at غير موجودين في schema المقروءة، الموجود opening_hours نص.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../app/Http/Requests/StoreOrderRequest.php). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/app/Models/Branch.php](../../Models/Branch.php.md)

- [pizza-crm/app/Models/AppSetting.php](../../Models/AppSetting.php.md)

- [pizza-crm/app/Http/Controllers/Api/OrderController.php](../Controllers/Api/OrderController.php.md)

- [pizza-crm/app/Services/Orders/OrderCreator.php](../../Services/Orders/OrderCreator.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```php
<?php

namespace App\Http\Requests;

use App\Models\Branch;
use App\Models\AppSetting;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge(['payment_method' => $this->input('payment_method', 'cash')]);
    }

    public function rules(): array
    {
        return [
            'branch_id' => ['required', 'integer', 'exists:branches,id'],
            'order_type' => ['required', Rule::in(['delivery', 'pickup', 'dine_in'])],
            'customer_name' => ['required', 'string', 'min:2', 'max:100'],
            'customer_phone' => ['required', 'string', 'max:40'],
            'delivery_address' => ['nullable', 'required_if:order_type,delivery', 'string', 'max:500'],
            'pickup_time' => ['nullable', 'required_if:order_type,pickup', 'date'],
            'payment_method' => ['required', Rule::in(['cash', 'card'])],
            'idempotency_key' => ['nullable', 'string', 'max:100'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.menu_item_id' => ['required', 'integer', 'exists:menu_items,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:20'],
            'items.*.notes' => ['nullable', 'string', 'max:200'],
        ];
    }

    public function after(): array
    {
        return [function (Validator $validator): void {
            if ($this->input('order_type') !== 'pickup' || ! $this->input('pickup_time')) {
                return;
            }

            $arrival = Carbon::parse($this->input('pickup_time'));
            $prepMinutes = (int) AppSetting::valueFor('minimum_pickup_prep_minutes', config('orders.minimum_pickup_prep_minutes', 20));
            $earliest = now()->addMinutes($prepMinutes);

            if ($arrival->lt($earliest)) {
                $validator->errors()->add('pickup_time', "Pickup must be at least {$earliest->diffInMinutes(now())} minutes from now.");

                return;
            }

            $branch = Branch::find($this->integer('branch_id'));
            if ($branch && isset($branch->opens_at, $branch->closes_at)) {
                $time = $arrival->format('H:i:s');
                if ($time < $branch->opens_at || $time > $branch->closes_at) {
                    $validator->errors()->add('pickup_time', 'Pickup time must be within branch opening hours.');
                }
            }
        }];
    }
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### authorize

اسمح بطلب إنشاء order حتى للضيف؛ لا يعني إلغاء validation.

- **بتاخد إيه؟ Inputs:** Laravel يناديها قبل controller.

- **بترجع/بتغيّر إيه؟ Return / effect:** true.

### prepareForValidation

لو payment_method مش مبعوتة استخدم cash وادمجها في request قبل تطبيق القواعد.

- **بتاخد إيه؟ Inputs:** بيانات request الحالية.

- **بترجع/بتغيّر إيه؟ Return / effect:** void؛ تعدّل المدخلات داخليًا.

### rules

اشترط فرعًا موجودًا ونوع طلب صحيح واسم/هاتف وبندًا واحدًا على الأقل؛ العنوان مطلوب للتوصيل والوقت مطلوب للاستلام.

- **بتاخد إيه؟ Inputs:** لا parameters.

- **بترجع/بتغيّر إيه؟ Return / effect:** array validation rules بما فيها items.*.quantity من 1 إلى 20.

### after

بعد validation الأساسي ارجع callback يراجع pickup_time مقارنة بمدة التحضير والإعدادات، وساعات فرع إن وجدت كحقول.

- **بتاخد إيه؟ Inputs:** Laravel يمرر Validator للcallback.

- **بترجع/بتغيّر إيه؟ Return / effect:** array of callbacks؛ callback تضيف errors أو تخرج return من غير قيمة.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### $this->merge

- **جاية منين؟** Laravel FormRequest / Request

- **وظيفتها:** ادمج قيمًا جديدة داخل input request قبل validation؛ متغيّرش DB ولا ترسل طلب شبكة جديد.

- **المدخلات — Arguments:** array من field إلى value.

- **الناتج/الأثر — Return / effect:** نفس request object في Laravel المثبت؛ الكود يعتمد على الأثر ولا يستخدم return.

- **أول موضع هنا:** السطر 21.

- **مثال:** $this->merge(['payment_method' => 'cash']);

### $this->input

- **جاية منين؟** Laravel FormRequest / Request

- **وظيفتها:** اقرأ قيمة input من request داخل كلاس FormRequest؛ input الخام ليس بديل validated عند الحفظ.

- **المدخلات — Arguments:** اسم field string، ثم default اختيارية.

- **الناتج/الأثر — Return / effect:** قيمة field أو default؛ ممكن string أو array أو null بناءً على المدخل.

- **أول موضع هنا:** السطر 49.

- **مثال:** $this->input('payment_method', 'cash')

### Rule::in

- **جاية منين؟** Laravel Validation Rule

- **وظيفتها:** ابنِ قاعدة تقبل قيمة الحقل لو ضمن القائمة المحددة؛ لا تختار عنصرًا ولا تحوّله إلى array.

- **المدخلات — Arguments:** array قيم مسموحة أو قيم منفصلة؛ هنا array مثل ['cash','card'].

- **الناتج/الأثر — Return / effect:** Illuminate Validation Rules In object تفسرها validation.

- **أول موضع هنا:** السطر 33.

- **مثال:** Rule::in(['cash', 'card'])

### Carbon::parse

- **جاية منين؟** Carbon

- **وظيفتها:** تحلل تاريخًا إلى object تاريخ.

- **المدخلات — Arguments:** time وtimezone اختيارية.

- **الناتج/الأثر — Return / effect:** Carbon instance أو خطأ عند مدخل غير صالح.

- **أول موضع هنا:** السطر 49.

### AppSetting::valueFor

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** query على key ثم value('value') وبعدها null-coalescing إلى default.

- **المدخلات — Arguments:** string key وmixed default افتراضي null.

- **الناتج/الأثر — Return / effect:** mixed قيمة setting أو default؛ caller مسؤول عن cast المطلوب.

- **أول موضع هنا:** السطر 50.

- **تكملة التعريف:** [app/Models/AppSetting.php](../../Models/AppSetting.php.md)، عند السطر 11.

### config

- **جاية منين؟** Laravel helper

- **وظيفتها:** اقرأ إعدادًا من ملفات config بالقيمة المحملة وقت تشغيل التطبيق؛ النقطة تفصل الملف عن المفتاح الداخلي.

- **المدخلات — Arguments:** key بصيغة dot notation مثل services.stripe.key، ثم default اختيارية. بدون key يرجع config repository، وarray تضبط إعدادات.

- **الناتج/الأثر — Return / effect:** قيمة الإعداد أو default في الاستخدام الحالي؛ ليست بالضرورة string ولا قيمة env مباشرة.

- **أول موضع هنا:** السطر 50.

- **مثال:** config('orders.minimum_pickup_prep_minutes', 20)

### ->addMinutes

- **جاية منين؟** Carbon

- **وظيفتها:** تضيف دقائق للتاريخ.

- **المدخلات — Arguments:** count.

- **الناتج/الأثر — Return / effect:** نفس Carbon المعدلة في النوع mutable المعتاد.

- **أول موضع هنا:** السطر 51.

### now

- **جاية منين؟** Laravel Date helper / Carbon

- **وظيفتها:** أنشئ object يمثل الوقت الحالي بتوقيت التطبيق أو المنطقة المطلوبة؛ ليست JS Date.now التي ترجع milliseconds.

- **المدخلات — Arguments:** timezone اختيارية؛ المشروع غالبًا بدون arguments.

- **الناتج/الأثر — Return / effect:** Carbon date-time object يمكن تنسيقها أو إضافة دقائق لها؛ ليست string تلقائيًا.

- **أول موضع هنا:** السطر 51.

- **مثال:** now()->addMinutes(20)

### $arrival->lt

- **جاية منين؟** Carbon

- **وظيفتها:** تفحص هل الوقت أقدم من وقت آخر.

- **المدخلات — Arguments:** date.

- **الناتج/الأثر — Return / effect:** Boolean.

- **أول موضع هنا:** السطر 53.

### $validator->errors

- **جاية منين؟** Laravel Validator

- **وظيفتها:** تقرأ أخطاء التحقق.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** MessageBag.

- **أول موضع هنا:** السطر 63.

### ->add

- **جاية منين؟** Laravel MessageBag

- **وظيفتها:** تضيف رسالة لحقل.

- **المدخلات — Arguments:** key وmessage.

- **الناتج/الأثر — Return / effect:** نفس MessageBag.

- **أول موضع هنا:** السطر 63.

### $earliest->diffInMinutes

- **جاية منين؟** Carbon

- **وظيفتها:** تحسب فرق وقت بالدقائق حسب الإصدار/خيارات absolute.

- **المدخلات — Arguments:** date وخيارات.

- **الناتج/الأثر — Return / effect:** فرق رقمي؛ لا يغيّر التاريخ.

- **أول موضع هنا:** السطر 54.

### Branch::find

- **جاية منين؟** Eloquent

- **وظيفتها:** تبحث بالـprimary key مع شروط query الحالية.

- **المدخلات — Arguments:** id.

- **الناتج/الأثر — Return / effect:** model أو null في استخدام id الواحد.

- **أول موضع هنا:** السطر 59.

### $this->integer

- **جاية منين؟** Laravel FormRequest / Request

- **وظيفتها:** اقرأ input وحوّله إلى integer لاستخدامه في البحث؛ التحويل وحده لا يثبت أن القيمة كانت valid integer.

- **المدخلات — Arguments:** اسم field string ثم default integer اختيارية افتراضي 0.

- **الناتج/الأثر — Return / effect:** int.

- **أول موضع هنا:** السطر 59.

- **مثال:** $this->integer('branch_id')

### isset

- **جاية منين؟** PHP language construct، مش method

- **وظيفتها:** تفحص إن المتغير/المفتاح موجود وقيمته ليست null؛ false وصفر والنص الفاضي تعتبر قيمًا موجودة عندها. تختلف عن empty وعن array_key_exists.

- **المدخلات — Arguments:** متغير أو أكثر؛ مثل isset($data['name']). لا نمرر اسم المتغير كنص بدل المتغير نفسه.

- **الناتج/الأثر — Return / effect:** true لو كل المدخلات معرّفة وغير null، وإلا false؛ بدون warning عند فحص المفتاح الغائب بالشكل المعتاد.

- **أول موضع هنا:** السطر 60.

### $arrival->format

- **جاية منين؟** PHP DateTime/Carbon

- **وظيفتها:** تنسّق تاريخًا كنص.

- **المدخلات — Arguments:** format string.

- **الناتج/الأثر — Return / effect:** string؛ توقيت object هو المستخدم.

- **أول موضع هنا:** السطر 61.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```php
<?php

namespace App\Http\Requests;

use App\Models\Branch;
use App\Models\AppSetting;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;
```

**السطر 1:** بداية كود PHP؛ السيرفر يفسّره، مش المتصفح.

**السطر 3:** namespace بتحدد نطاق أسماء الكلاس `App\Http\Requests`. بتمنع تعارض كلاس بنفس الاسم في مكان تاني؛ مش عنوان URL ولا route.

**السطر 5:** use / استيراد الاسم `App\Models\Branch` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 6:** use / استيراد الاسم `App\Models\AppSetting` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 7:** use / استيراد الاسم `Carbon\Carbon` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 8:** use / استيراد الاسم `Illuminate\Foundation\Http\FormRequest` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

### السطور 9–16

```php
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
```

**السطر 9:** use / استيراد الاسم `Illuminate\Validation\Rule` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 10:** use / استيراد الاسم `Illuminate\Validation\Validator` علشان نقدر نكتبه مختصر في الملف. لو use جوّه class فده إدخال Trait بيوفّر methods للكلاس؛ الاستيراد نفسه مش طلب شبكة ولا query.

**السطر 12:** Class / تعريف كلاس يجمع بيانات وmethods. إنشاء object/استدعاء method يحصل في موضع آخر، مش لمجرد تعريف الكلاس.

**السطر 13:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 14:** Function / تعريف دالة `authorize`؛ تعريفها مش تشغيلها. اسمح بطلب إنشاء order حتى للضيف؛ لا يعني إلغاء validation. مدخلاتها: Laravel يناديها قبل controller. ناتجها: true.

**السطر 15:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 16:** return تعيد التعبير `true` ثم تنهي المسار الحالي. ارجع لنوع العائد في signature وإلى المستدعي علشان تعرف هيستخدمه إزاي.

### السطور 17–24

```php
    }

    protected function prepareForValidation(): void
    {
        $this->merge(['payment_method' => $this->input('payment_method', 'cash')]);
    }

    public function rules(): array
```

**السطر 17:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 19:** Function / تعريف دالة `prepareForValidation`؛ تعريفها مش تشغيلها. لو payment_method مش مبعوتة استخدم cash وادمجها في request قبل تطبيق القواعد. مدخلاتها: بيانات request الحالية. ناتجها: void؛ تعدّل المدخلات داخليًا.

**السطر 20:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 21:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$this->merge(...)`: ادمج قيمًا جديدة داخل input request قبل validation؛ متغيّرش DB ولا ترسل طلب شبكة جديد. مدخلاتها: array من field إلى value. العائد/الأثر: نفس request object في Laravel المثبت؛ الكود يعتمد على الأثر ولا يستخدم return.؛ `$this->input(...)`: اقرأ قيمة input من request داخل كلاس FormRequest؛ input الخام ليس بديل validated عند الحفظ. مدخلاتها: اسم field string، ثم default اختيارية. العائد/الأثر: قيمة field أو default؛ ممكن string أو array أو null بناءً على المدخل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 22:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 24:** Function / تعريف دالة `rules`؛ تعريفها مش تشغيلها. اشترط فرعًا موجودًا ونوع طلب صحيح واسم/هاتف وبندًا واحدًا على الأقل؛ العنوان مطلوب للتوصيل والوقت مطلوب للاستلام. مدخلاتها: لا parameters. ناتجها: array validation rules بما فيها items.*.quantity من 1 إلى 20.

### السطور 25–32

```php
    {
        return [
            'branch_id' => ['required', 'integer', 'exists:branches,id'],
            'order_type' => ['required', Rule::in(['delivery', 'pickup', 'dine_in'])],
            'customer_name' => ['required', 'string', 'min:2', 'max:100'],
            'customer_phone' => ['required', 'string', 'max:40'],
            'delivery_address' => ['nullable', 'required_if:order_type,delivery', 'string', 'max:500'],
            'pickup_time' => ['nullable', 'required_if:order_type,pickup', 'date'],
```

**السطر 25:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 26:** return تعيد array القيم التالية. في ملف config دي إعدادات يستلمها Laravel وقت تحميل الإعداد؛ في method فهي ناتج يرجع للكود اللي ناداها. مش JSON response إلا لو بنينا response صراحة.

**السطر 27:** قواعد حقل `branch_id` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `integer` = عدد صحيح؛ `exists:branches,id` = القيمة لازم تكون موجودة في الجدول والعمود المحددين. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 28:** قواعد حقل `order_type` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `delivery` قاعدة إضافية يفسّرها Laravel؛ `pickup` قاعدة إضافية يفسّرها Laravel؛ `dine_in` قاعدة إضافية يفسّرها Laravel. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 29:** قواعد حقل `customer_name` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `string` = نص؛ `min:2` = أقل قيمة/طول `2` حسب نوع الحقل؛ `max:100` = أقصى قيمة/طول `100` حسب النوع؛ حجم الملفات بالكيلوبايت. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 30:** قواعد حقل `customer_phone` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `string` = نص؛ `max:40` = أقصى قيمة/طول `40` حسب النوع؛ حجم الملفات بالكيلوبايت. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 31:** قواعد حقل `delivery_address` داخل array التحقق: `nullable` = مسموح تكون قيمته null؛ `required_if:order_type,delivery` قاعدة إضافية يفسّرها Laravel؛ `string` = نص؛ `max:500` = أقصى قيمة/طول `500` حسب النوع؛ حجم الملفات بالكيلوبايت. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 32:** قواعد حقل `pickup_time` داخل array التحقق: `nullable` = مسموح تكون قيمته null؛ `required_if:order_type,pickup` قاعدة إضافية يفسّرها Laravel؛ `date` = تاريخ صالح. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

### السطور 33–40

```php
            'payment_method' => ['required', Rule::in(['cash', 'card'])],
            'idempotency_key' => ['nullable', 'string', 'max:100'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.menu_item_id' => ['required', 'integer', 'exists:menu_items,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:20'],
            'items.*.notes' => ['nullable', 'string', 'max:200'],
        ];
    }
```

**السطر 33:** قواعد حقل `payment_method` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `cash` قاعدة إضافية يفسّرها Laravel؛ `card` قاعدة إضافية يفسّرها Laravel. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 34:** قواعد حقل `idempotency_key` داخل array التحقق: `nullable` = مسموح تكون قيمته null؛ `string` = نص؛ `max:100` = أقصى قيمة/طول `100` حسب النوع؛ حجم الملفات بالكيلوبايت. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 35:** قواعد حقل `items` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `array` = قائمة/array؛ `min:1` = أقل قيمة/طول `1` حسب نوع الحقل. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 36:** قواعد حقل `items.*.menu_item_id` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `integer` = عدد صحيح؛ `exists:menu_items,id` = القيمة لازم تكون موجودة في الجدول والعمود المحددين. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 37:** قواعد حقل `items.*.quantity` داخل array التحقق: `required` = لازم يتبعت ومينفعش يكون فاضي؛ `integer` = عدد صحيح؛ `min:1` = أقل قيمة/طول `1` حسب نوع الحقل؛ `max:20` = أقصى قيمة/طول `20` حسب النوع؛ حجم الملفات بالكيلوبايت. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 38:** قواعد حقل `items.*.notes` داخل array التحقق: `nullable` = مسموح تكون قيمته null؛ `string` = نص؛ `max:200` = أقصى قيمة/طول `200` حسب النوع؛ حجم الملفات بالكيلوبايت. الـ=> بتربط اسم الحقل بالقواعد؛ validate هي اللي تطبّقهم عند استدعائها.

**السطر 39:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 40:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 41–48

```php

    public function after(): array
    {
        return [function (Validator $validator): void {
            if ($this->input('order_type') !== 'pickup' || ! $this->input('pickup_time')) {
                return;
            }

```

**السطر 42:** Function / تعريف دالة `after`؛ تعريفها مش تشغيلها. بعد validation الأساسي ارجع callback يراجع pickup_time مقارنة بمدة التحضير والإعدادات، وساعات فرع إن وجدت كحقول. مدخلاتها: Laravel يمرر Validator للcallback. ناتجها: array of callbacks؛ callback تضيف errors أو تخرج return من غير قيمة.

**السطر 43:** القوس { يفتح جسم الـclass/function/شرط المكتوب قبله. اللي بعده تابع للجسم ده لحد القوس المقابل }؛ القوس نفسه مش method.

**السطر 44:** return تعيد array القيم التالية. في ملف config دي إعدادات يستلمها Laravel وقت تحميل الإعداد؛ في method فهي ناتج يرجع للكود اللي ناداها. مش JSON response إلا لو بنينا response صراحة.

**السطر 45:** if تختبر الشرط `$this->input('order_type') !== 'pickup' || ! $this->input('pickup_time')`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 46:** return بدون قيمة: اخرج من الدالة الحالية هنا. مفيش تعليمات بعدها في نفس المسار هتتنفذ؛ في PHP العائد بدون قيمة هو null، مش undefined بتاعة JavaScript.

**السطر 47:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 49–56

```php
            $arrival = Carbon::parse($this->input('pickup_time'));
            $prepMinutes = (int) AppSetting::valueFor('minimum_pickup_prep_minutes', config('orders.minimum_pickup_prep_minutes', 20));
            $earliest = now()->addMinutes($prepMinutes);

            if ($arrival->lt($earliest)) {
                $validator->errors()->add('pickup_time', "Pickup must be at least {$earliest->diffInMinutes(now())} minutes from now.");

                return;
```

**السطر 49:** Assignment / إسناد: احسب `Carbon::parse($this->input('pickup_time'))` الأول وخزّن النتيجة في `$arrival`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 50:** Assignment / إسناد: احسب `(int) AppSetting::valueFor('minimum_pickup_prep_minutes', config('orders.minimum_pickup_prep_minutes', 20))` الأول وخزّن النتيجة في `$prepMinutes`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 51:** Assignment / إسناد: احسب `now()->addMinutes($prepMinutes)` الأول وخزّن النتيجة في `$earliest`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 53:** if تختبر الشرط `$arrival->lt($earliest)`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 54:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$validator->errors(...)`: تقرأ أخطاء التحقق. مدخلاتها: بدون arguments. العائد/الأثر: MessageBag.؛ `->add(...)`: تضيف رسالة لحقل. مدخلاتها: key وmessage. العائد/الأثر: نفس MessageBag.؛ `$earliest->diffInMinutes(...)`: تحسب فرق وقت بالدقائق حسب الإصدار/خيارات absolute. مدخلاتها: date وخيارات. العائد/الأثر: فرق رقمي؛ لا يغيّر التاريخ.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 56:** return بدون قيمة: اخرج من الدالة الحالية هنا. مفيش تعليمات بعدها في نفس المسار هتتنفذ؛ في PHP العائد بدون قيمة هو null، مش undefined بتاعة JavaScript.

### السطور 57–64

```php
            }

            $branch = Branch::find($this->integer('branch_id'));
            if ($branch && isset($branch->opens_at, $branch->closes_at)) {
                $time = $arrival->format('H:i:s');
                if ($time < $branch->opens_at || $time > $branch->closes_at) {
                    $validator->errors()->add('pickup_time', 'Pickup time must be within branch opening hours.');
                }
```

**السطر 57:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 59:** Assignment / إسناد: احسب `Branch::find($this->integer('branch_id'))` الأول وخزّن النتيجة في `$branch`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 60:** if تختبر الشرط `$branch && isset($branch->opens_at, $branch->closes_at)`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 61:** Assignment / إسناد: احسب `$arrival->format('H:i:s')` الأول وخزّن النتيجة في `$time`. علامة $ جزء من اسم متغير PHP؛ = إسناد، مش اختبار مساواة.

**السطر 62:** if تختبر الشرط `$time < $branch->opens_at || $time > $branch->closes_at`. لو صح تنفّذ الجسم التالي، ولو غلط تتخطّاه. ! تعكس النتيجة، && معناها الشرطان لازم يتحققوا، === مقارنة قيمة ونوع بدون تحويل تلقائي.

**السطر 63:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `$validator->errors(...)`: تقرأ أخطاء التحقق. مدخلاتها: بدون arguments. العائد/الأثر: MessageBag.؛ `->add(...)`: تضيف رسالة لحقل. مدخلاتها: key وmessage. العائد/الأثر: نفس MessageBag.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 64:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 65–69

```php
            }
        }];
    }
}

```

**السطر 65:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 66:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 67:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 68:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
