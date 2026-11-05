# اختيار الفرع والتوصيل وإعادة تسعير السلة

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `resources/js/context/OrderContext.jsx` · 132 سطر.

**وظيفة الملف:** يمسك delivery/pickup والفرع والعنوان ويخزن التفضيلات. عند تغيير فرع والسلة مرتبطة بفرع آخر يستأذن، يعيد تسعير المنتجات ويزيل غير المتاح ويصدر حدث تحديث السلة.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../resources/js/context/OrderContext.jsx). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/resources/js/context/CatalogContext.jsx](CatalogContext.jsx.md)

- [pizza-crm/resources/js/Pages/MenuPage.jsx](../Pages/MenuPage.jsx.md)

- [pizza-crm/resources/js/Pages/Cart.jsx](../Pages/Cart.jsx.md)

- [pizza-crm/resources/js/Components/Navbar.jsx](../Components/Navbar.jsx.md)

- [pizza-crm/resources/js/app.jsx](../app.jsx.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```jsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { branchOption, useCatalog } from './CatalogContext';

const OrderContext = createContext(null);
const isDemo = import.meta.env.VITE_DEMO_MODE === 'true';
const PREFERENCES_KEY = isDemo ? 'wtc_demo_order_preferences' : 'wtc_order_preferences';
const CART_KEY = isDemo ? 'wtc_demo_cart' : 'wtc_cart';
const CART_EVENT = 'wtc-cart-updated';

function savedPreferences() {
    try {
        return JSON.parse(localStorage.getItem(PREFERENCES_KEY) || '{}');
    } catch {
        return {};
    }
}

function readCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    } catch {
        return [];
    }
}

export function OrderProvider({ children }) {
    const { branches, items } = useCatalog();
    const initial = savedPreferences();
    const [mode, setMode] = useState(initial.mode === 'pickup' ? 'pickup' : 'delivery');
    const [branchId, setBranchId] = useState(Number(initial.branchId) || null);
    const [deliveryAddress, setDeliveryAddress] = useState(initial.deliveryAddress || '');
    const [deliveryArea, setDeliveryArea] = useState(initial.deliveryArea || '');
    const [notice, setNotice] = useState('');

    const availableBranches = useMemo(
        () => branches.filter((branch) => branch.is_active !== false && (mode !== 'delivery' || branch.delivery_enabled)),
        [branches, mode],
    );
    const selectedBranch = branches.find((branch) => Number(branch.id) === Number(branchId)) || null;

    useEffect(() => {
        if (!branches.length) return;
        const valid = availableBranches.some((branch) => Number(branch.id) === Number(branchId));
        if (!valid) setBranchId(availableBranches[0]?.id || null);
    }, [availableBranches, branchId, branches.length]);

    useEffect(() => {
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify({
            mode,
            branchId,
            deliveryAddress,
            deliveryArea,
        }));
        if (branchId) localStorage.setItem(isDemo ? 'wtc_demo_branch_id' : 'wtc_branch_id', String(branchId));
    }, [mode, branchId, deliveryAddress, deliveryArea]);

    const changeBranch = useCallback((nextBranchId, { confirmCart = true } = {}) => {
        const numericId = Number(nextBranchId);
        const branch = branches.find((entry) => Number(entry.id) === numericId);
        if (!branch || (mode === 'delivery' && !branch.delivery_enabled)) return false;

        const cart = readCart();
        const changesBranch = cart.some((line) => Number(line.branch_id) !== numericId);
        if (changesBranch && confirmCart && !window.confirm('Switch to ' + branch.name + '? Your cart will be repriced and unavailable items will be removed.')) {
            return false;
        }

        if (changesBranch) {
            let removed = 0;
            const nextCart = cart.flatMap((line) => {
                const item = items.find((candidate) => Number(candidate.id) === Number(line.id));
                const option = branchOption(item, numericId);
                if (!item || !option?.is_available) {
                    removed += 1;
                    return [];
                }
                return [{
                    ...line,
                    name: item.name,
                    description: item.description,
                    image_src: item.image_path,
                    price: Number(option.price),
                    branch_id: numericId,
                    branch_name: branch.name,
                }];
            });
            localStorage.setItem(CART_KEY, JSON.stringify(nextCart));
            window.dispatchEvent(new Event(CART_EVENT));
            setNotice(removed
                ? removed + ' unavailable cart item' + (removed === 1 ? '' : 's') + ' removed for ' + branch.name + '.'
                : 'Cart updated for ' + branch.name + '.');
        }

        setBranchId(numericId);
        return true;
    }, [branches, items, mode]);

    const changeMode = useCallback((nextMode) => {
        const normalized = nextMode === 'pickup' ? 'pickup' : 'delivery';
        setMode(normalized);
        if (normalized === 'delivery') {
            const current = branches.find((branch) => Number(branch.id) === Number(branchId));
            if (current && !current.delivery_enabled) {
                setBranchId(branches.find((branch) => branch.delivery_enabled && branch.is_active !== false)?.id || null);
            }
        }
    }, [branches, branchId]);

    const value = useMemo(() => ({
        mode,
        branchId,
        selectedBranch,
        availableBranches,
        deliveryAddress,
        deliveryArea,
        notice,
        setOrderMode: changeMode,
        setBranch: changeBranch,
        setDeliveryAddress,
        setDeliveryArea,
        clearNotice: () => setNotice(''),
    }), [mode, branchId, selectedBranch, availableBranches, deliveryAddress, deliveryArea, notice, changeMode, changeBranch]);

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
    const context = useContext(OrderContext);
    if (!context) throw new Error('useOrder must be used inside OrderProvider.');
    return context;
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### savedPreferences

يقرأ تفضيلات الطلب السابقة من localStorage؛ يتعافى من JSON تالف بدل إسقاط الصفحة.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** object أو {}.

### readCart

يقرأ سلة نفس وضع التشغيل demo/live من localStorage ويفك JSON.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** القيمة المخزنة أو [] عند غياب/تلف التخزين؛ مفيش schema validation كامل هنا.

### OrderProvider

يوفر تفضيلات الطلب ودوال تغييرها ويصحّح فرعًا غير صالح عند تغيّر mode/catalog.

- **بتاخد إيه؟ Inputs:** children؛ الكتالوج من useCatalog.

- **بترجع/بتغيّر إيه؟ Return / effect:** OrderContext.Provider.

### changeBranch

يتأكد من الفرع، يطلب موافقة عند اختلاف فرع السلة، يعيد بناء السلة بـ flatMap وأسعار الفرع ثم يغيّر branchId.

- **بتاخد إيه؟ Inputs:** nextBranchId؛ options اختياري {confirmCart=true}.

- **بترجع/بتغيّر إيه؟ Return / effect:** true لو تم الاختيار، false لو الفرع غير صالح أو المستخدم رفض. الدالة متاحة للمستهلكين باسم setBranch.

### changeMode

يحوّل أي قيمة غير pickup إلى delivery ويختار أول فرع توصيل صالح لو الفرع الحالي لا يوصّل.

- **بتاخد إيه؟ Inputs:** nextMode.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined؛ متاحة باسم setOrderMode.

### clearNotice

يمسح رسالة إعادة تسعير السلة عن طريق setNotice('').

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined.

### useOrder

Custom hook يقرأ اختيار الفرع وطريقة الاستلام والعنوان ودوال تغييرها.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** value الخاص بـ OrderContext أو يرمي خطأ لو خارج Provider.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### createContext

- **جاية منين؟** React API

- **وظيفتها:** ينشئ قناة مشاركة بيانات للأبناء؛ إنشاء السياق لا يخزن بيانات وحده، الـ Provider يمرر value.

- **المدخلات — Arguments:** defaultValue.

- **الناتج/الأثر — Return / effect:** Context object.

- **أول موضع هنا:** السطر 4، والمدخلات المكتوبة: `null`.

- **مثال:** const OrderContext = createContext(null);

### JSON.parse

- **جاية منين؟** JavaScript

- **وظيفتها:** يفك JSON string لقيم JS؛ ممكن يرمي SyntaxError ولا يعتبر validation كامل.

- **المدخلات — Arguments:** JSON string

- **الناتج/الأثر — Return / effect:** JS value

- **أول موضع هنا:** السطر 20، والمدخلات المكتوبة: `localStorage.getItem(CART_KEY) || '[]'`.

- **مثال:** const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

### localStorage.getItem

- **جاية منين؟** Browser localStorage/sessionStorage

- **وظيفتها:** تقرأ النص المحفوظ تحت مفتاح.

- **المدخلات — Arguments:** اسم المفتاح.

- **الناتج/الأثر — Return / effect:** string أو null؛ لا تعيد object تلقائيًا.

- **أول موضع هنا:** السطر 20، والمدخلات المكتوبة: `CART_KEY`.

### useCatalog

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** يوصل المكوّن إلى الكتالوج المشترك؛ يفشل بوضوح لو Provider غير موجود.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** branches/categories/items/loading/error/reload.

- **أول موضع هنا:** السطر 27.

- **تكملة التعريف:** [resources/js/context/CatalogContext.jsx](CatalogContext.jsx.md)، عند السطر 37.

### savedPreferences

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يقرأ تفضيلات الطلب السابقة من localStorage؛ يتعافى من JSON تالف بدل إسقاط الصفحة.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** object أو {}.

- **أول موضع هنا:** السطر 28.

### useState

- **جاية منين؟** React

- **وظيفتها:** حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة.

- **المدخلات — Arguments:** initialState

- **الناتج/الأثر — Return / effect:** [currentState,setter]

- **أول موضع هنا:** السطر 33، والمدخلات المكتوبة: `''`.

- **مثال:** const [failed, setFailed] = useState(false);

### Number

- **جاية منين؟** JavaScript conversion function

- **وظيفتها:** يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** number أو NaN.

- **أول موضع هنا:** السطر 102، والمدخلات المكتوبة: `branchId`.

- **مثال:** Number(option.price);

### useMemo

- **جاية منين؟** React hook

- **وظيفتها:** يحفظ نتيجة حساب كتحسين أداء لحد تغير dependencies؛ callback للحساب مش مكان HTTP أو setState side effects.

- **المدخلات — Arguments:** calculate function,dependencies.

- **الناتج/الأثر — Return / effect:** القيمة المحسوبة.

- **أول موضع هنا:** السطر 109، والمدخلات المكتوبة: `() => ({         mode,         branchId,         selectedBranch,         availableBranches,         deliveryAddress,         deliveryArea,         notice,         setOrderMode: cha…`، `[mode, branchId, selectedBranch, availableBranches, deliveryAddress, deliveryArea, notice, changeMode, changeBranch]`.

- **مثال:** const completedOrders = useMemo(() => orders.filter((order) => order.status === 'completed'), [orders]);

### branches.filter

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تختار كل العناصر التي شرطها truthy.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** array جديدة؛ لا تحذف الأصل بنفسها.

- **أول موضع هنا:** السطر 36، والمدخلات المكتوبة: `(branch) => branch.is_active !== false && (mode !== 'delivery' || branch.delivery_enabled)`.

### branches.find

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تبحث بالترتيب حتى أول callback truthy.

- **المدخلات — Arguments:** callback تستقبل العنصر وindex والقائمة.

- **الناتج/الأثر — Return / effect:** العنصر المطابق نفسه أو undefined؛ ليست array نتائج.

- **أول موضع هنا:** السطر 104، والمدخلات المكتوبة: `(branch) => branch.delivery_enabled && branch.is_active !== false`.

### useEffect

- **جاية منين؟** React

- **وظيفتها:** يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies.

- **المدخلات — Arguments:** setup callback, dependencies

- **الناتج/الأثر — Return / effect:** undefined

- **أول موضع هنا:** السطر 47، والمدخلات المكتوبة: `() => {         localStorage.setItem(PREFERENCES_KEY, JSON.stringify({             mode,             branchId,             deliveryAddress,             deliveryArea,         }));  …`، `[mode, branchId, deliveryAddress, deliveryArea]`.

- **مثال:** useEffect(() => { window.addEventListener('resize', updateRunway); return () => window.removeEventListener('resize', updateRunway); }, []);

### availableBranches.some

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تفحص هل أي عنصر يحقق الشرط وتتوقف عند أول نجاح.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** Boolean.

- **أول موضع هنا:** السطر 43، والمدخلات المكتوبة: `(branch) => Number(branch.id) === Number(branchId)`.

### setBranchId

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setBranchId هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 104، والمدخلات المكتوبة: `branches.find((branch) => branch.delivery_enabled && branch.is_active !== false)?.id || null`.

### localStorage.setItem

- **جاية منين؟** Browser localStorage/sessionStorage

- **وظيفتها:** تحفظ قيمة نصية تحت مفتاح وتستبدل القديمة.

- **المدخلات — Arguments:** key وvalue.

- **الناتج/الأثر — Return / effect:** undefined؛ قد تفشل لو التخزين غير متاح.

- **أول موضع هنا:** السطر 87، والمدخلات المكتوبة: `CART_KEY`، `JSON.stringify(nextCart)`.

### JSON.stringify

- **جاية منين؟** JavaScript

- **وظيفتها:** يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions.

- **المدخلات — Arguments:** value

- **الناتج/الأثر — Return / effect:** string أو undefined لبعض القيم

- **أول موضع هنا:** السطر 87، والمدخلات المكتوبة: `nextCart`.

- **مثال:** localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

### String

- **جاية منين؟** JavaScript

- **وظيفتها:** تحوّل قيمة إلى نص عند استدعائها بدون new.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 54، والمدخلات المكتوبة: `branchId`.

### useCallback

- **جاية منين؟** React hook

- **وظيفتها:** يثبت هوية function بين renders ما دامت dependencies ثابتة؛ لا ينفذ الدالة ولا يحفظ نتيجة API. مهم لأن loadOrders dependency للـ polling effect.

- **المدخلات — Arguments:** function, dependencies.

- **الناتج/الأثر — Return / effect:** function memoized.

- **أول موضع هنا:** السطر 98، والمدخلات المكتوبة: `(nextMode) => {         const normalized = nextMode === 'pickup' ? 'pickup' : 'delivery';         setMode(normalized);         if (normalized === 'delivery') {             const cu…`، `[branches, branchId]`.

- **مثال:** const loadOrders = useCallback(async () => { /* actual request */ }, [user, branch, date]);

### readCart

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يقرأ سلة نفس وضع التشغيل demo/live من localStorage ويفك JSON.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** القيمة المخزنة أو [] عند غياب/تلف التخزين؛ مفيش schema validation كامل هنا.

- **أول موضع هنا:** السطر 62.

### cart.some

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تفحص هل أي عنصر يحقق الشرط وتتوقف عند أول نجاح.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** Boolean.

- **أول موضع هنا:** السطر 63، والمدخلات المكتوبة: `(line) => Number(line.branch_id) !== numericId`.

### window.confirm

- **جاية منين؟** Browser

- **وظيفتها:** تطلب تأكيدًا بسيطًا من المستخدم.

- **المدخلات — Arguments:** نص السؤال.

- **الناتج/الأثر — Return / effect:** Boolean؛ ده قرار واجهة مش authorization.

- **أول موضع هنا:** السطر 64، والمدخلات المكتوبة: `'Switch to ' + branch.name + '? Your cart will be repriced and unavailable items will be removed.'`.

### cart.flatMap

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل العناصر ثم تفرد مستوى array واحد.

- **المدخلات — Arguments:** callback قد ترجع عنصرًا أو array.

- **الناتج/الأثر — Return / effect:** array جديدة؛ [] من callback تشيل العنصر من الناتج.

- **أول موضع هنا:** السطر 70، والمدخلات المكتوبة: `(line) => {                 const item = items.find((candidate) => Number(candidate.id) === Number(line.id));                 const option = branchOption(item, numericId);         …`.

### items.find

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تبحث بالترتيب حتى أول callback truthy.

- **المدخلات — Arguments:** callback تستقبل العنصر وindex والقائمة.

- **الناتج/الأثر — Return / effect:** العنصر المطابق نفسه أو undefined؛ ليست array نتائج.

- **أول موضع هنا:** السطر 71، والمدخلات المكتوبة: `(candidate) => Number(candidate.id) === Number(line.id)`.

### branchOption

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** يبحث عن سعر وتوفر منتج في فرع بعينه. السعر مش ثابت في item نفسه؛ مصدره branch_options.

- **المدخلات — Arguments:** item: المنتج وقد يكون undefined؛ branchId: رقم أو نص معرّف الفرع.

- **الناتج/الأثر — Return / effect:** object خيار الفرع أو null؛ Number يوحّد نوع المعرّفات قبل المقارنة.

- **أول موضع هنا:** السطر 72، والمدخلات المكتوبة: `item`، `numericId`.

- **تكملة التعريف:** [resources/js/context/CatalogContext.jsx](CatalogContext.jsx.md)، عند السطر 45.

### window.dispatchEvent

- **جاية منين؟** Browser EventTarget

- **وظيفتها:** ترسل Event للمستمعين على هذا الهدف بشكل متزامن.

- **المدخلات — Arguments:** Event object.

- **الناتج/الأثر — Return / effect:** Boolean مرتبطة بعدم إلغاء default؛ مش HTTP response.

- **أول موضع هنا:** السطر 88، والمدخلات المكتوبة: `new Event(CART_EVENT)`.

### Event

- **جاية منين؟** Browser

- **وظيفتها:** تنشئ Event تحمل نوع الحدث.

- **المدخلات — Arguments:** event type وoptions.

- **الناتج/الأثر — Return / effect:** Event object؛ الإرسال يحتاج dispatchEvent.

- **أول موضع هنا:** السطر 88، والمدخلات المكتوبة: `CART_EVENT`.

### setNotice

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setNotice هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 121، والمدخلات المكتوبة: `''`.

### setMode

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setMode هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 100، والمدخلات المكتوبة: `normalized`.

### useContext

- **جاية منين؟** React hook

- **وظيفتها:** يقرأ أقرب Provider لنفس Context ويشترك في تغيّر قيمته.

- **المدخلات — Arguments:** Context object.

- **الناتج/الأثر — Return / effect:** value الحالية أو default لو لا Provider.

- **أول موضع هنا:** السطر 128، والمدخلات المكتوبة: `OrderContext`.

- **مثال:** const context = useContext(OrderContext);

### Error

- **جاية منين؟** JavaScript

- **وظيفتها:** تنشئ object خطأ برسالة؛ الرمي يحتاج throw منفصلة.

- **المدخلات — Arguments:** message وخيارات اختيارية.

- **الناتج/الأثر — Return / effect:** Error object.

- **أول موضع هنا:** السطر 129، والمدخلات المكتوبة: `'useOrder must be used inside OrderProvider.'`.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```jsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { branchOption, useCatalog } from './CatalogContext';

const OrderContext = createContext(null);
const isDemo = import.meta.env.VITE_DEMO_MODE === 'true';
const PREFERENCES_KEY = isDemo ? 'wtc_demo_order_preferences' : 'wtc_order_preferences';
const CART_KEY = isDemo ? 'wtc_demo_cart' : 'wtc_cart';
const CART_EVENT = 'wtc-cart-updated';
```

**السطر 1:** Import / استيراد: الأسماء `React`، `createContext`، `useCallback`، `useContext`، `useEffect`، `useMemo`، `useState` جاية من `react`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 2:** Import / استيراد: الأسماء `branchOption`، `useCatalog` جاية من `./CatalogContext`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 4:** Variable declaration / تعريف `OrderContext` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `createContext(...)`: ينشئ قناة مشاركة بيانات للأبناء؛ إنشاء السياق لا يخزن بيانات وحده، الـ Provider يمرر value. القيم المكتوبة هنا: `null`. العائد/الأثر: Context object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 5:** Variable declaration / تعريف `isDemo` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 6:** Variable declaration / تعريف `PREFERENCES_KEY` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 7:** Variable declaration / تعريف `CART_KEY` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 8:** Variable declaration / تعريف `CART_EVENT` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `"wtc-cart-updated"`، مش ناتج طلب شبكة.

### السطور 9–16

```jsx

function savedPreferences() {
    try {
        return JSON.parse(localStorage.getItem(PREFERENCES_KEY) || '{}');
    } catch {
        return {};
    }
}
```

**السطر 10:** Function / تعريف دالة `savedPreferences`؛ تعريفها مش تشغيلها. يقرأ تفضيلات الطلب السابقة من localStorage؛ يتعافى من JSON تالف بدل إسقاط الصفحة. مدخلاتها: لا شيء. ناتجها: object أو {}.

**السطر 11:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة.

**السطر 12:** Return / رجّع `JSON.parse(localStorage.getItem(PREFERENCES_KEY) || '{}')` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `JSON.parse(...)`: يفك JSON string لقيم JS؛ ممكن يرمي SyntaxError ولا يعتبر validation كامل. القيم المكتوبة هنا: `localStorage.getItem(PREFERENCES_KEY) || '{}'`. العائد/الأثر: JS value؛ `localStorage.getItem(...)`: تقرأ النص المحفوظ تحت مفتاح. القيم المكتوبة هنا: `PREFERENCES_KEY`. العائد/الأثر: string أو null؛ لا تعيد object تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 13:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 14:** Return / رجّع `{}` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 15:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 16:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 17–24

```jsx

function readCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    } catch {
        return [];
    }
}
```

**السطر 18:** Function / تعريف دالة `readCart`؛ تعريفها مش تشغيلها. يقرأ سلة نفس وضع التشغيل demo/live من localStorage ويفك JSON. مدخلاتها: لا شيء. ناتجها: القيمة المخزنة أو [] عند غياب/تلف التخزين؛ مفيش schema validation كامل هنا.

**السطر 19:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة.

**السطر 20:** Return / رجّع `JSON.parse(localStorage.getItem(CART_KEY) || '[]')` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `JSON.parse(...)`: يفك JSON string لقيم JS؛ ممكن يرمي SyntaxError ولا يعتبر validation كامل. القيم المكتوبة هنا: `localStorage.getItem(CART_KEY) || '[]'`. العائد/الأثر: JS value؛ `localStorage.getItem(...)`: تقرأ النص المحفوظ تحت مفتاح. القيم المكتوبة هنا: `CART_KEY`. العائد/الأثر: string أو null؛ لا تعيد object تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 21:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 22:** Return / رجّع `[]` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 23:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 24:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 25–32

```jsx

export function OrderProvider({ children }) {
    const { branches, items } = useCatalog();
    const initial = savedPreferences();
    const [mode, setMode] = useState(initial.mode === 'pickup' ? 'pickup' : 'delivery');
    const [branchId, setBranchId] = useState(Number(initial.branchId) || null);
    const [deliveryAddress, setDeliveryAddress] = useState(initial.deliveryAddress || '');
    const [deliveryArea, setDeliveryArea] = useState(initial.deliveryArea || '');
```

**السطر 26:** Function / تعريف دالة `OrderProvider`؛ تعريفها مش تشغيلها. يوفر تفضيلات الطلب ودوال تغييرها ويصحّح فرعًا غير صالح عند تغيّر mode/catalog. مدخلاتها: children؛ الكتالوج من useCatalog. ناتجها: OrderContext.Provider.

**السطر 27:** Variable declaration / تعريف اسم/أسماء لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useCatalog(...)`: يوصل المكوّن إلى الكتالوج المشترك؛ يفشل بوضوح لو Provider غير موجود. مدخلاتها: لا شيء. العائد/الأثر: branches/categories/items/loading/error/reload.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 28:** Variable declaration / تعريف `initial` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `savedPreferences(...)`: يقرأ تفضيلات الطلب السابقة من localStorage؛ يتعافى من JSON تالف بدل إسقاط الصفحة. مدخلاتها: لا شيء. العائد/الأثر: object أو {}.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 29:** Variable declaration / تعريف `mode + setMode` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `initial.mode === 'pickup' ? 'pickup' : 'delivery'`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 30:** Variable declaration / تعريف `branchId + setBranchId` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `Number(initial.branchId) || null`. العائد/الأثر: [currentState,setter]؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `initial.branchId`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 31:** Variable declaration / تعريف `deliveryAddress + setDeliveryAddress` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `initial.deliveryAddress || ''`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 32:** Variable declaration / تعريف `deliveryArea + setDeliveryArea` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `initial.deliveryArea || ''`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 33–40

```jsx
    const [notice, setNotice] = useState('');

    const availableBranches = useMemo(
        () => branches.filter((branch) => branch.is_active !== false && (mode !== 'delivery' || branch.delivery_enabled)),
        [branches, mode],
    );
    const selectedBranch = branches.find((branch) => Number(branch.id) === Number(branchId)) || null;

```

**السطر 33:** Variable declaration / تعريف `notice + setNotice` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `''`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 35:** Variable declaration / تعريف `availableBranches` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useMemo(...)`: يحفظ نتيجة حساب كتحسين أداء لحد تغير dependencies؛ callback للحساب مش مكان HTTP أو setState side effects. القيم المكتوبة هنا: `() => branches.filter((branch) => branch.is_active !== false && (mode !== 'delivery' || branch.delivery_enable…`، `[branches, mode]`. العائد/الأثر: القيمة المحسوبة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 36:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `branches.filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `(branch) => branch.is_active !== false && (mode !== 'delivery' || branch.delivery_enabled)`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 37:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 38:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 39:** Variable declaration / تعريف `selectedBranch` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `branches.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(branch) => Number(branch.id) === Number(branchId)`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `branchId`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 41–48

```jsx
    useEffect(() => {
        if (!branches.length) return;
        const valid = availableBranches.some((branch) => Number(branch.id) === Number(branchId));
        if (!valid) setBranchId(availableBranches[0]?.id || null);
    }, [availableBranches, branchId, branches.length]);

    useEffect(() => {
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify({
```

**السطر 41:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `() => {         if (!branches.length) return;         const valid = availableBranches.some((branch) => Number(…`، `[availableBranches, branchId, branches.length]`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 42:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 43:** Variable declaration / تعريف `valid` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `availableBranches.some(...)`: تفحص هل أي عنصر يحقق الشرط وتتوقف عند أول نجاح. القيم المكتوبة هنا: `(branch) => Number(branch.id) === Number(branchId)`. العائد/الأثر: Boolean.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `branchId`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 44:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `setBranchId(...)`: لو setBranchId هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `availableBranches[0]?.id || null`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 45:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 47:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `() => {         localStorage.setItem(PREFERENCES_KEY, JSON.stringify({             mode,             branchId,…`، `[mode, branchId, deliveryAddress, deliveryArea]`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 48:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `localStorage.setItem(...)`: تحفظ قيمة نصية تحت مفتاح وتستبدل القديمة. القيم المكتوبة هنا: `PREFERENCES_KEY`، `JSON.stringify({             mode,             branchId,             deliveryAddress,             deliveryArea…`. العائد/الأثر: undefined؛ قد تفشل لو التخزين غير متاح.؛ `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `{             mode,             branchId,             deliveryAddress,             deliveryArea,         }`. العائد/الأثر: string أو undefined لبعض القيم. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 49–56

```jsx
            mode,
            branchId,
            deliveryAddress,
            deliveryArea,
        }));
        if (branchId) localStorage.setItem(isDemo ? 'wtc_demo_branch_id' : 'wtc_branch_id', String(branchId));
    }, [mode, branchId, deliveryAddress, deliveryArea]);

```

**السطر 49:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 50:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 51:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 52:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 53:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 54:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `localStorage.setItem(...)`: تحفظ قيمة نصية تحت مفتاح وتستبدل القديمة. القيم المكتوبة هنا: `isDemo ? 'wtc_demo_branch_id' : 'wtc_branch_id'`، `String(branchId)`. العائد/الأثر: undefined؛ قد تفشل لو التخزين غير متاح.؛ `String(...)`: تحوّل قيمة إلى نص عند استدعائها بدون new. القيم المكتوبة هنا: `branchId`. العائد/الأثر: string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 55:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 57–64

```jsx
    const changeBranch = useCallback((nextBranchId, { confirmCart = true } = {}) => {
        const numericId = Number(nextBranchId);
        const branch = branches.find((entry) => Number(entry.id) === numericId);
        if (!branch || (mode === 'delivery' && !branch.delivery_enabled)) return false;

        const cart = readCart();
        const changesBranch = cart.some((line) => Number(line.branch_id) !== numericId);
        if (changesBranch && confirmCart && !window.confirm('Switch to ' + branch.name + '? Your cart will be repriced and unavailable items will be removed.')) {
```

**السطر 57:** Variable declaration / تعريف `changeBranch` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `changeBranch` هنا: يتأكد من الفرع، يطلب موافقة عند اختلاف فرع السلة، يعيد بناء السلة بـ flatMap وأسعار الفرع ثم يغيّر branchId. المدخلات: nextBranchId؛ options اختياري {confirmCart=true}.. الناتج/الأثر: true لو تم الاختيار، false لو الفرع غير صالح أو المستخدم رفض. الدالة متاحة للمستهلكين باسم setBranch.. الدوال الموجودة في السطر: `useCallback(...)`: يثبت هوية function بين renders ما دامت dependencies ثابتة؛ لا ينفذ الدالة ولا يحفظ نتيجة API. مهم لأن loadOrders dependency للـ polling effect. القيم المكتوبة هنا: `(nextBranchId, { confirmCart = true } = {}) => {         const numericId = Number(nextBranchId);         const…`، `[branches, items, mode]`. العائد/الأثر: function memoized.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 58:** Variable declaration / تعريف `numericId` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `nextBranchId`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 59:** Variable declaration / تعريف `branch` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `branches.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(entry) => Number(entry.id) === numericId`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `entry.id`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 60:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 62:** Variable declaration / تعريف `cart` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `readCart(...)`: يقرأ سلة نفس وضع التشغيل demo/live من localStorage ويفك JSON. مدخلاتها: لا شيء. العائد/الأثر: القيمة المخزنة أو [] عند غياب/تلف التخزين؛ مفيش schema validation كامل هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 63:** Variable declaration / تعريف `changesBranch` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `cart.some(...)`: تفحص هل أي عنصر يحقق الشرط وتتوقف عند أول نجاح. القيم المكتوبة هنا: `(line) => Number(line.branch_id) !== numericId`. العائد/الأثر: Boolean.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `line.branch_id`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 64:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `window.confirm(...)`: تطلب تأكيدًا بسيطًا من المستخدم. القيم المكتوبة هنا: `'Switch to ' + branch.name + '? Your cart will be repriced and unavailable items will be removed.'`. العائد/الأثر: Boolean؛ ده قرار واجهة مش authorization.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 65–72

```jsx
            return false;
        }

        if (changesBranch) {
            let removed = 0;
            const nextCart = cart.flatMap((line) => {
                const item = items.find((candidate) => Number(candidate.id) === Number(line.id));
                const option = branchOption(item, numericId);
```

**السطر 65:** Return / رجّع `false` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 66:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 68:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 69:** Variable declaration / تعريف `removed` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `0`، مش ناتج طلب شبكة.

**السطر 70:** Variable declaration / تعريف `nextCart` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `cart.flatMap(...)`: تحوّل العناصر ثم تفرد مستوى array واحد. القيم المكتوبة هنا: `(line) => {                 const item = items.find((candidate) => Number(candidate.id) === Number(line.id)); …`. العائد/الأثر: array جديدة؛ [] من callback تشيل العنصر من الناتج.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 71:** Variable declaration / تعريف `item` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `items.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(candidate) => Number(candidate.id) === Number(line.id)`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `line.id`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 72:** Variable declaration / تعريف `option` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `branchOption(...)`: يبحث عن سعر وتوفر منتج في فرع بعينه. السعر مش ثابت في item نفسه؛ مصدره branch_options. القيم المكتوبة هنا: `item`، `numericId`. العائد/الأثر: object خيار الفرع أو null؛ Number يوحّد نوع المعرّفات قبل المقارنة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 73–80

```jsx
                if (!item || !option?.is_available) {
                    removed += 1;
                    return [];
                }
                return [{
                    ...line,
                    name: item.name,
                    description: item.description,
```

**السطر 73:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 74:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 75:** Return / رجّع `[]` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 76:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 77:** Return / رجّع `[{` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 78:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 79:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 80:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 81–88

```jsx
                    image_src: item.image_path,
                    price: Number(option.price),
                    branch_id: numericId,
                    branch_name: branch.name,
                }];
            });
            localStorage.setItem(CART_KEY, JSON.stringify(nextCart));
            window.dispatchEvent(new Event(CART_EVENT));
```

**السطر 81:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 82:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `option.price`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 83:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 84:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 85:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 86:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 87:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `localStorage.setItem(...)`: تحفظ قيمة نصية تحت مفتاح وتستبدل القديمة. القيم المكتوبة هنا: `CART_KEY`، `JSON.stringify(nextCart)`. العائد/الأثر: undefined؛ قد تفشل لو التخزين غير متاح.؛ `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `nextCart`. العائد/الأثر: string أو undefined لبعض القيم. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 88:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `window.dispatchEvent(...)`: ترسل Event للمستمعين على هذا الهدف بشكل متزامن. القيم المكتوبة هنا: `new Event(CART_EVENT)`. العائد/الأثر: Boolean مرتبطة بعدم إلغاء default؛ مش HTTP response.؛ `Event(...)`: تنشئ Event تحمل نوع الحدث. القيم المكتوبة هنا: `CART_EVENT`. العائد/الأثر: Event object؛ الإرسال يحتاج dispatchEvent.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 89–96

```jsx
            setNotice(removed
                ? removed + ' unavailable cart item' + (removed === 1 ? '' : 's') + ' removed for ' + branch.name + '.'
                : 'Cart updated for ' + branch.name + '.');
        }

        setBranchId(numericId);
        return true;
    }, [branches, items, mode]);
```

**السطر 89:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setNotice(...)`: لو setNotice هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `removed                 ? removed + ' unavailable cart item' + (removed === 1 ? '' : 's') + ' removed for ' + …`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 90:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 91:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 92:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 94:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setBranchId(...)`: لو setBranchId هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `numericId`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 95:** Return / رجّع `true` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 96:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 97–104

```jsx

    const changeMode = useCallback((nextMode) => {
        const normalized = nextMode === 'pickup' ? 'pickup' : 'delivery';
        setMode(normalized);
        if (normalized === 'delivery') {
            const current = branches.find((branch) => Number(branch.id) === Number(branchId));
            if (current && !current.delivery_enabled) {
                setBranchId(branches.find((branch) => branch.delivery_enabled && branch.is_active !== false)?.id || null);
```

**السطر 98:** Variable declaration / تعريف `changeMode` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `changeMode` هنا: يحوّل أي قيمة غير pickup إلى delivery ويختار أول فرع توصيل صالح لو الفرع الحالي لا يوصّل. المدخلات: nextMode.. الناتج/الأثر: undefined؛ متاحة باسم setOrderMode.. الدوال الموجودة في السطر: `useCallback(...)`: يثبت هوية function بين renders ما دامت dependencies ثابتة؛ لا ينفذ الدالة ولا يحفظ نتيجة API. مهم لأن loadOrders dependency للـ polling effect. القيم المكتوبة هنا: `(nextMode) => {         const normalized = nextMode === 'pickup' ? 'pickup' : 'delivery';         setMode(norm…`، `[branches, branchId]`. العائد/الأثر: function memoized.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 99:** Variable declaration / تعريف `normalized` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 100:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setMode(...)`: لو setMode هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `normalized`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 101:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 102:** Variable declaration / تعريف `current` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `branches.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(branch) => Number(branch.id) === Number(branchId)`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `branchId`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 103:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 104:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setBranchId(...)`: لو setBranchId هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `branches.find((branch) => branch.delivery_enabled && branch.is_active !== false)?.id || null`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `branches.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(branch) => branch.delivery_enabled && branch.is_active !== false`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 105–112

```jsx
            }
        }
    }, [branches, branchId]);

    const value = useMemo(() => ({
        mode,
        branchId,
        selectedBranch,
```

**السطر 105:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 106:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 107:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 109:** Variable declaration / تعريف `value` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useMemo(...)`: يحفظ نتيجة حساب كتحسين أداء لحد تغير dependencies؛ callback للحساب مش مكان HTTP أو setState side effects. القيم المكتوبة هنا: `() => ({         mode,         branchId,         selectedBranch,         availableBranches,         deliveryAd…`، `[mode, branchId, selectedBranch, availableBranches, deliveryAddress, deliveryArea, notice, changeMode, changeB…`. العائد/الأثر: القيمة المحسوبة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 110:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 111:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 112:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 113–120

```jsx
        availableBranches,
        deliveryAddress,
        deliveryArea,
        notice,
        setOrderMode: changeMode,
        setBranch: changeBranch,
        setDeliveryAddress,
        setDeliveryArea,
```

**السطر 113:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 114:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 115:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 116:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 117:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 118:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 119:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 120:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 121–128

```jsx
        clearNotice: () => setNotice(''),
    }), [mode, branchId, selectedBranch, availableBranches, deliveryAddress, deliveryArea, notice, changeMode, changeBranch]);

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
    const context = useContext(OrderContext);
```

**السطر 121:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `setNotice(...)`: لو setNotice هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `''`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 122:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 124:** Return / رجّع `<OrderContext.Provider value={value}>{children}</OrderContext.Provider>` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 125:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 127:** Function / تعريف دالة `useOrder`؛ تعريفها مش تشغيلها. Custom hook يقرأ اختيار الفرع وطريقة الاستلام والعنوان ودوال تغييرها. مدخلاتها: لا شيء. ناتجها: value الخاص بـ OrderContext أو يرمي خطأ لو خارج Provider.

**السطر 128:** Variable declaration / تعريف `context` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useContext(...)`: يقرأ أقرب Provider لنفس Context ويشترك في تغيّر قيمته. القيم المكتوبة هنا: `OrderContext`. العائد/الأثر: value الحالية أو default لو لا Provider.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 129–132

```jsx
    if (!context) throw new Error('useOrder must be used inside OrderProvider.');
    return context;
}

```

**السطر 129:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `Error(...)`: تنشئ object خطأ برسالة؛ الرمي يحتاج throw منفصلة. القيم المكتوبة هنا: `'useOrder must be used inside OrderProvider.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 130:** Return / رجّع `context` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 131:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
