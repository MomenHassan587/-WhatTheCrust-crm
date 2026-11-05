# tests/demo/orders.test.mjs

[فهرس كل الأكواد](../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `tests/demo/orders.test.mjs` · 62 سطر.

**وظيفة الملف:** اختبار أو تجهيز بيئة اختبار. assertions تثبت سيناريو محدد؛ لا تعتبر نجاح اختبار واحد إثباتًا لكل المشروع.

**نوعه:** source / مصدر. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../tests/demo/orders.test.mjs). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/resources/js/demo/api.js](../../resources/js/demo/api.js.md)

- [pizza-crm/resources/js/demo/catalog.json](../../resources/js/demo/catalog.json.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```js
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { demoFetch, calculateOrder, transitionOrder, resetDemo } from '../../resources/js/demo/api.js';
import catalog from '../../resources/js/demo/catalog.json' with { type: 'json' };

const values = new Map();
globalThis.localStorage = { getItem: (key) => values.get(key) || null, setItem: (key, value) => values.set(key, String(value)), removeItem: (key) => values.delete(key) };
beforeEach(() => values.clear());
const login = (email) => demoFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email }) });
const payload = () => ({ branch_id: 1, order_type: 'delivery', customer_name: 'Sample Guest', customer_phone: 'Demo phone', delivery_address: 'Sample address', items: [{ menu_item_id: 1, quantity: 2, notes: 'No onions' }] });

test('demo computes prices from the catalog and rejects unavailable items', () => {
    const result = calculateOrder({ ...payload(), total_price: 1 }, catalog);
    const price = Number(catalog.items.find((item) => item.id === 1).branch_options.find((option) => option.branch_id === 1).price);
    assert.equal(result.total_price, price * 2 + Number(catalog.branches[0].delivery_fee));
    assert.throws(() => calculateOrder({ ...payload(), items: [{ menu_item_id: 22, quantity: 1 }] }, catalog));
});
test('a guest order can be tracked by token after reload and appears in the kitchen', async () => {
    const created = await demoFetch('/api/orders', { method: 'POST', body: JSON.stringify(payload()) });
    assert.ok(created.tracking_url.includes(created.order.tracking_token));
    const tracked = await demoFetch('/api/orders/track/' + created.order.tracking_token);
    assert.equal(tracked.order.items[0].notes, 'No onions');
    await login('staff.1@demo.test');
    const board = await demoFetch('/api/staff/orders');
    assert.ok(board.orders.some((order) => order.id === created.order.id));
});
test('branch isolation and administrator access match the demo roles', async () => {
    await login('staff.1@demo.test');
    const board = await demoFetch('/api/staff/orders');
    assert.ok(board.orders.every((order) => order.branch_id === 1));
    await assert.rejects(() => demoFetch('/api/staff/orders/1009/status', { method: 'PATCH', body: JSON.stringify({ status: 'preparing' }) }));
    await assert.rejects(() => demoFetch('/api/admin/dashboard'));
    await login('admin@demo.test');
    assert.equal(new Set((await demoFetch('/api/staff/orders')).orders.map((order) => order.branch_id)).size, 3);
});
test('accept and prepare logs both steps; stale and invalid updates fail', () => {
    const order = { branch_id: 1, status: 'new', order_type: 'delivery', status_logs: [] };
    const user = { id: 201, role: 'staff', branch_id: 1 };
    transitionOrder(order, { status: 'preparing', expected_status: 'new' }, user);
    assert.deepEqual(order.status_logs.map((log) => log.to_status), ['accepted', 'preparing']);
    assert.throws(() => transitionOrder(order, { status: 'ready', expected_status: 'new' }, user));
    assert.throws(() => transitionOrder(order, { status: 'completed' }, user));
});
test('customer history and reorder exclude other users; payment never runs', async () => {
    await login('customer@demo.test');
    const created = await demoFetch('/api/orders', { method: 'POST', body: JSON.stringify(payload()) });
    const history = await demoFetch('/api/orders/history');
    assert.ok(history.orders.every((order) => order.user_id === 100));
    const reorder = await demoFetch('/api/orders/' + created.order.id + '/reorder', { method: 'POST' });
    assert.equal(reorder.cart_items[0].quantity, 2);
    await assert.rejects(() => demoFetch('/api/payments/intents', { method: 'POST' }));
});
test('demo reset leaves the real cart untouched and stores no passwords', async () => {
    values.set('wtc_cart', 'original cart');
    await login('admin@demo.test');
    await demoFetch('/api/admin/staff', { method: 'POST', body: JSON.stringify({ name: 'Demo User', email: 'demo-new@demo.test', role: 'staff', branch_id: 1, is_active: true, password: 'do-not-store' }) });
    assert.ok(!values.get('wtc-demo-store-v1').includes('do-not-store'));
    resetDemo();
    assert.equal(values.get('wtc_cart'), 'original cart');
    assert.equal(values.has('wtc-demo-store-v1'), false);
});
```

</details>

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### Map

- **جاية منين؟** JavaScript

- **وظيفتها:** تنشئ مجموعة ربط key→value.

- **المدخلات — Arguments:** iterable أزواج اختيارية.

- **الناتج/الأثر — Return / effect:** Map instance في الذاكرة.

- **أول موضع هنا:** السطر 6.

### values.get

- **جاية منين؟** Map/Set في JavaScript

- **وظيفتها:** تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات.

- **المدخلات — Arguments:** مفتاح/قيمة حسب get/set/has/delete، وclear بدون.

- **الناتج/الأثر — Return / effect:** القيمة أو undefined.

- **أول موضع هنا:** السطر 59، والمدخلات المكتوبة: `'wtc_cart'`.

### values.set

- **جاية منين؟** Map/Set في JavaScript

- **وظيفتها:** تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات.

- **المدخلات — Arguments:** مفتاح/قيمة حسب get/set/has/delete، وclear بدون.

- **الناتج/الأثر — Return / effect:** نفس Map للـchaining.

- **أول موضع هنا:** السطر 54، والمدخلات المكتوبة: `'wtc_cart'`، `'original cart'`.

### String

- **جاية منين؟** JavaScript

- **وظيفتها:** تحوّل قيمة إلى نص عند استدعائها بدون new.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 7، والمدخلات المكتوبة: `value`.

### values.delete

- **جاية منين؟** Map/Set في JavaScript

- **وظيفتها:** تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات.

- **المدخلات — Arguments:** مفتاح/قيمة حسب get/set/has/delete، وclear بدون.

- **الناتج/الأثر — Return / effect:** Boolean.

- **أول موضع هنا:** السطر 7، والمدخلات المكتوبة: `key`.

### beforeEach

- **جاية منين؟** Node test

- **وظيفتها:** تسجّل setup قبل كل test في النطاق.

- **المدخلات — Arguments:** callback.

- **الناتج/الأثر — Return / effect:** تسجيل hook، مش نتيجة assertion.

- **أول موضع هنا:** السطر 8، والمدخلات المكتوبة: `() => values.clear()`.

### values.clear

- **جاية منين؟** Map/Set في JavaScript

- **وظيفتها:** تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات.

- **المدخلات — Arguments:** مفتاح/قيمة حسب get/set/has/delete، وclear بدون.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 8.

### demoFetch

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** Router محلي يختار من url/method ويطبق منطق API demo ثم يرجع data مباشرة. لا يرجع Response مثل fetch، ولا يجري network request.

- **المدخلات — Arguments:** url,options={}؛ body JSON أو FormData.

- **الناتج/الأثر — Return / effect:** Promise<payload> أو rejection بخطأ demo.

- **أول موضع هنا:** السطر 56، والمدخلات المكتوبة: `'/api/admin/staff'`، `{ method: 'POST', body: JSON.stringify({ name: 'Demo User', email: 'demo-new@demo.test', role: 'staff', branch_id: 1, is_active: true, password: 'do-not-store' }) }`.

- **تكملة التعريف:** [resources/js/demo/api.js](../../resources/js/demo/api.js.md)، عند السطر 114.

### JSON.stringify

- **جاية منين؟** JavaScript

- **وظيفتها:** يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions.

- **المدخلات — Arguments:** value

- **الناتج/الأثر — Return / effect:** string أو undefined لبعض القيم

- **أول موضع هنا:** السطر 56، والمدخلات المكتوبة: `{ name: 'Demo User', email: 'demo-new@demo.test', role: 'staff', branch_id: 1, is_active: true, password: 'do-not-store' }`.

- **مثال:** localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

### test

- **جاية منين؟** RegExp أو Node test حسب المستقبِل

- **وظيفتها:** RegExp.test تفحص تطابق النص؛ Node test يسجل اختبارًا.

- **المدخلات — Arguments:** نص للـregex، أو اسم وcallback للاختبار.

- **الناتج/الأثر — Return / effect:** Boolean في regex؛ نتيجة تسجيل اختبار في Node.

- **أول موضع هنا:** السطر 53، والمدخلات المكتوبة: `'demo reset leaves the real cart untouched and stores no passwords'`، `async () => {     values.set('wtc_cart', 'original cart');     await login('admin@demo.test');     await demoFetch('/api/admin/staff', { method: 'POST', body: JSON.stringify({ name…`.

### calculateOrder

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** يراجع فرع/طريقة/عميل/عناوين/كمية وملاحظات ويعيد حساب السعر من catalog، مش من أسعار مرسلة من العميل.

- **المدخلات — Arguments:** data: payload؛ catalog.

- **الناتج/الأثر — Return / effect:** {branch,items,total_price}.

- **أول موضع هنا:** السطر 16، والمدخلات المكتوبة: `{ ...payload(), items: [{ menu_item_id: 22, quantity: 1 }] }`، `catalog`.

- **تكملة التعريف:** [resources/js/demo/api.js](../../resources/js/demo/api.js.md)، عند السطر 88.

### payload

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** تنفّذ الجزء المعرّف باسم payload في نفس الملف؛ التعريف كامل تحت مع شرح سطوره.

- **المدخلات — Arguments:** المدخلات مكتوبة في تعريفها؛ الأقواس الفارغة تعني بدون arguments مباشرة.

- **الناتج/الأثر — Return / effect:** ارجع لسطر return في تعريف الدالة؛ لو مفيش return قيمة فالناتج المعتاد undefined في JavaScript.

- **أول موضع هنا:** السطر 46.

### Number

- **جاية منين؟** JavaScript conversion function

- **وظيفتها:** يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** number أو NaN.

- **أول موضع هنا:** السطر 15، والمدخلات المكتوبة: `catalog.branches[0].delivery_fee`.

- **مثال:** Number(option.price);

### catalog.items.find((item) => item.id === 1).branch_options.find

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تبحث بالترتيب حتى أول callback truthy.

- **المدخلات — Arguments:** callback تستقبل العنصر وindex والقائمة.

- **الناتج/الأثر — Return / effect:** العنصر المطابق نفسه أو undefined؛ ليست array نتائج.

- **أول موضع هنا:** السطر 14، والمدخلات المكتوبة: `(option) => option.branch_id === 1`.

### catalog.items.find

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تبحث بالترتيب حتى أول callback truthy.

- **المدخلات — Arguments:** callback تستقبل العنصر وindex والقائمة.

- **الناتج/الأثر — Return / effect:** العنصر المطابق نفسه أو undefined؛ ليست array نتائج.

- **أول موضع هنا:** السطر 14، والمدخلات المكتوبة: `(item) => item.id === 1`.

### assert.equal

- **جاية منين؟** Node assert/strict

- **وظيفتها:** تؤكد مساواة expected وactual بشكل صارم في هذا import.

- **المدخلات — Arguments:** actual وexpected ورسالة اختيارية.

- **الناتج/الأثر — Return / effect:** undefined لو نجحت أو AssertionError عند الفشل.

- **أول موضع هنا:** السطر 60، والمدخلات المكتوبة: `values.has('wtc-demo-store-v1')`، `false`.

### assert.throws

- **جاية منين؟** Node assert

- **وظيفتها:** تؤكد أن callback ترمي خطأ متزامنًا.

- **المدخلات — Arguments:** callback وتوقع اختياري.

- **الناتج/الأثر — Return / effect:** undefined لو تحقق التوقع؛ Promise failures تحتاج rejects.

- **أول موضع هنا:** السطر 42، والمدخلات المكتوبة: `() => transitionOrder(order, { status: 'completed' }, user)`.

### assert.ok

- **جاية منين؟** Node assert

- **وظيفتها:** تؤكد truthiness قيمة.

- **المدخلات — Arguments:** actual.

- **الناتج/الأثر — Return / effect:** undefined أو AssertionError.

- **أول موضع هنا:** السطر 57، والمدخلات المكتوبة: `!values.get('wtc-demo-store-v1').includes('do-not-store')`.

### created.tracking_url.includes

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تختبر وجود قيمة في array أو نص داخل string.

- **المدخلات — Arguments:** القيمة/النص المطلوب.

- **الناتج/الأثر — Return / effect:** Boolean؛ مش العنصر ولا موقعه.

- **أول موضع هنا:** السطر 20، والمدخلات المكتوبة: `created.order.tracking_token`.

### login

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** تنفّذ الجزء المعرّف باسم login في نفس الملف؛ التعريف كامل تحت مع شرح سطوره.

- **المدخلات — Arguments:** email

- **الناتج/الأثر — Return / effect:** ارجع لسطر return في تعريف الدالة؛ لو مفيش return قيمة فالناتج المعتاد undefined في JavaScript.

- **أول موضع هنا:** السطر 55، والمدخلات المكتوبة: `'admin@demo.test'`.

### board.orders.some

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تفحص هل أي عنصر يحقق الشرط وتتوقف عند أول نجاح.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** Boolean.

- **أول موضع هنا:** السطر 25، والمدخلات المكتوبة: `(order) => order.id === created.order.id`.

### board.orders.every

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تفحص هل كل العناصر تحقق الشرط.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** Boolean؛ القائمة الفاضية ترجع true.

- **أول موضع هنا:** السطر 30، والمدخلات المكتوبة: `(order) => order.branch_id === 1`.

### assert.rejects

- **جاية منين؟** Node assert

- **وظيفتها:** تؤكد رفض Promise.

- **المدخلات — Arguments:** async callback/Promise وتوقع اختياري.

- **الناتج/الأثر — Return / effect:** Promise للاختبار؛ لازم await.

- **أول موضع هنا:** السطر 51، والمدخلات المكتوبة: `() => demoFetch('/api/payments/intents', { method: 'POST' })`.

### Set

- **جاية منين؟** JavaScript

- **وظيفتها:** تنشئ مجموعة قيم فريدة.

- **المدخلات — Arguments:** iterable اختيارية.

- **الناتج/الأثر — Return / effect:** Set instance، مش array.

- **أول موضع هنا:** السطر 34، والمدخلات المكتوبة: `(await demoFetch('/api/staff/orders')).orders.map((order) => order.branch_id)`.

### (await demoFetch('/api/staff/orders')).orders.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 34، والمدخلات المكتوبة: `(order) => order.branch_id`.

### transitionOrder

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** يتحقق من فرع الموظف وexpected_status وقواعد الحالة والسبب؛ يسجل خطوات accepted/preparing عند القبول السريع.

- **المدخلات — Arguments:** order,data,user.

- **الناتج/الأثر — Return / effect:** نفس order بعد تعديله؛ يرمي Error للانتقال المرفوض.

- **أول موضع هنا:** السطر 42، والمدخلات المكتوبة: `order`، `{ status: 'completed' }`، `user`.

- **تكملة التعريف:** [resources/js/demo/api.js](../../resources/js/demo/api.js.md)، عند السطر 72.

### assert.deepEqual

- **جاية منين؟** Node assert/strict

- **وظيفتها:** تؤكد مساواة البنية والقيم.

- **المدخلات — Arguments:** actual وexpected.

- **الناتج/الأثر — Return / effect:** undefined أو AssertionError.

- **أول موضع هنا:** السطر 40، والمدخلات المكتوبة: `order.status_logs.map((log) => log.to_status)`، `['accepted', 'preparing']`.

### order.status_logs.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 40، والمدخلات المكتوبة: `(log) => log.to_status`.

### history.orders.every

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تفحص هل كل العناصر تحقق الشرط.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** Boolean؛ القائمة الفاضية ترجع true.

- **أول موضع هنا:** السطر 48، والمدخلات المكتوبة: `(order) => order.user_id === 100`.

### values.get('wtc-demo-store-v1').includes

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تختبر وجود قيمة في array أو نص داخل string.

- **المدخلات — Arguments:** القيمة/النص المطلوب.

- **الناتج/الأثر — Return / effect:** Boolean؛ مش العنصر ولا موقعه.

- **أول موضع هنا:** السطر 57، والمدخلات المكتوبة: `'do-not-store'`.

### resetDemo

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** يمسح 5 مفاتيح demo محددة فقط؛ لا يستخدم localStorage.clear ولا يمس مفاتيح live.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** undefined؛ UI ينادي reload بعده لتوليد seed جديد.

- **أول موضع هنا:** السطر 58.

- **تكملة التعريف:** [resources/js/demo/api.js](../../resources/js/demo/api.js.md)، عند السطر 232.

### values.has

- **جاية منين؟** Map/Set في JavaScript

- **وظيفتها:** تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات.

- **المدخلات — Arguments:** مفتاح/قيمة حسب get/set/has/delete، وclear بدون.

- **الناتج/الأثر — Return / effect:** Boolean.

- **أول موضع هنا:** السطر 60، والمدخلات المكتوبة: `'wtc-demo-store-v1'`.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```js
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { demoFetch, calculateOrder, transitionOrder, resetDemo } from '../../resources/js/demo/api.js';
import catalog from '../../resources/js/demo/catalog.json' with { type: 'json' };

const values = new Map();
globalThis.localStorage = { getItem: (key) => values.get(key) || null, setItem: (key, value) => values.set(key, String(value)), removeItem: (key) => values.delete(key) };
beforeEach(() => values.clear());
```

**السطر 1:** Import / استيراد: الأسماء `test`، `beforeEach` جاية من `node:test`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 2:** Import / استيراد: الأسماء `assert` جاية من `node:assert/strict`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 3:** Import / استيراد: الأسماء `demoFetch`، `calculateOrder`، `transitionOrder`، `resetDemo` جاية من `../../resources/js/demo/api.js`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 4:** Import / استيراد: الأسماء `catalog` جاية من `../../resources/js/demo/catalog.json`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 6:** Variable declaration / تعريف `values` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Map(...)`: تنشئ مجموعة ربط key→value. مدخلاتها: iterable أزواج اختيارية. العائد/الأثر: Map instance في الذاكرة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 7:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods. الدوال الموجودة في السطر: `values.get(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. القيم المكتوبة هنا: `key`. العائد/الأثر: القيمة أو undefined.؛ `values.set(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. القيم المكتوبة هنا: `key`، `String(value)`. العائد/الأثر: نفس Map للـchaining.؛ `String(...)`: تحوّل قيمة إلى نص عند استدعائها بدون new. القيم المكتوبة هنا: `value`. العائد/الأثر: string.؛ `values.delete(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. القيم المكتوبة هنا: `key`. العائد/الأثر: Boolean.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 8:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `beforeEach(...)`: تسجّل setup قبل كل test في النطاق. القيم المكتوبة هنا: `() => values.clear()`. العائد/الأثر: تسجيل hook، مش نتيجة assertion.؛ `values.clear(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. مدخلاتها: مفتاح/قيمة حسب get/set/has/delete، وclear بدون. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 9–16

```js
const login = (email) => demoFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email }) });
const payload = () => ({ branch_id: 1, order_type: 'delivery', customer_name: 'Sample Guest', customer_phone: 'Demo phone', delivery_address: 'Sample address', items: [{ menu_item_id: 1, quantity: 2, notes: 'No onions' }] });

test('demo computes prices from the catalog and rejects unavailable items', () => {
    const result = calculateOrder({ ...payload(), total_price: 1 }, catalog);
    const price = Number(catalog.items.find((item) => item.id === 1).branch_options.find((option) => option.branch_id === 1).price);
    assert.equal(result.total_price, price * 2 + Number(catalog.branches[0].delivery_fee));
    assert.throws(() => calculateOrder({ ...payload(), items: [{ menu_item_id: 22, quantity: 1 }] }, catalog));
```

**السطر 9:** Variable declaration / تعريف `login` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `demoFetch(...)`: Router محلي يختار من url/method ويطبق منطق API demo ثم يرجع data مباشرة. لا يرجع Response مثل fetch، ولا يجري network request. القيم المكتوبة هنا: `'/api/auth/login'`، `{ method: 'POST', body: JSON.stringify({ email }) }`. العائد/الأثر: Promise<payload> أو rejection بخطأ demo.؛ `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `{ email }`. العائد/الأثر: string أو undefined لبعض القيم. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 10:** Variable declaration / تعريف `payload` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 12:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `test(...)`: RegExp.test تفحص تطابق النص؛ Node test يسجل اختبارًا. القيم المكتوبة هنا: `'demo computes prices from the catalog and rejects unavailable items'`، `() => {     const result = calculateOrder({ ...payload(), total_price: 1 }, catalog);     const price = Number…`. العائد/الأثر: Boolean في regex؛ نتيجة تسجيل اختبار في Node.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 13:** Variable declaration / تعريف `result` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `calculateOrder(...)`: يراجع فرع/طريقة/عميل/عناوين/كمية وملاحظات ويعيد حساب السعر من catalog، مش من أسعار مرسلة من العميل. القيم المكتوبة هنا: `{ ...payload(), total_price: 1 }`، `catalog`. العائد/الأثر: {branch,items,total_price}.؛ `payload(...)`: تنفّذ الجزء المعرّف باسم payload في نفس الملف؛ التعريف كامل تحت مع شرح سطوره. مدخلاتها: المدخلات مكتوبة في تعريفها؛ الأقواس الفارغة تعني بدون arguments مباشرة. العائد/الأثر: ارجع لسطر return في تعريف الدالة؛ لو مفيش return قيمة فالناتج المعتاد undefined في JavaScript.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 14:** Variable declaration / تعريف `price` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `catalog.items.find((item) => item.id === 1).branch_options.find((option) => option.branch_id === 1).price`. العائد/الأثر: number أو NaN.؛ `catalog.items.find((item) => item.id === 1).branch_options.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(option) => option.branch_id === 1`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.؛ `catalog.items.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(item) => item.id === 1`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 15:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `assert.equal(...)`: تؤكد مساواة expected وactual بشكل صارم في هذا import. القيم المكتوبة هنا: `result.total_price`، `price * 2 + Number(catalog.branches[0].delivery_fee)`. العائد/الأثر: undefined لو نجحت أو AssertionError عند الفشل.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `catalog.branches[0].delivery_fee`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 16:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `assert.throws(...)`: تؤكد أن callback ترمي خطأ متزامنًا. القيم المكتوبة هنا: `() => calculateOrder({ ...payload(), items: [{ menu_item_id: 22, quantity: 1 }] }, catalog)`. العائد/الأثر: undefined لو تحقق التوقع؛ Promise failures تحتاج rejects.؛ `calculateOrder(...)`: يراجع فرع/طريقة/عميل/عناوين/كمية وملاحظات ويعيد حساب السعر من catalog، مش من أسعار مرسلة من العميل. القيم المكتوبة هنا: `{ ...payload(), items: [{ menu_item_id: 22, quantity: 1 }] }`، `catalog`. العائد/الأثر: {branch,items,total_price}.؛ `payload(...)`: تنفّذ الجزء المعرّف باسم payload في نفس الملف؛ التعريف كامل تحت مع شرح سطوره. مدخلاتها: المدخلات مكتوبة في تعريفها؛ الأقواس الفارغة تعني بدون arguments مباشرة. العائد/الأثر: ارجع لسطر return في تعريف الدالة؛ لو مفيش return قيمة فالناتج المعتاد undefined في JavaScript.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 17–24

```js
});
test('a guest order can be tracked by token after reload and appears in the kitchen', async () => {
    const created = await demoFetch('/api/orders', { method: 'POST', body: JSON.stringify(payload()) });
    assert.ok(created.tracking_url.includes(created.order.tracking_token));
    const tracked = await demoFetch('/api/orders/track/' + created.order.tracking_token);
    assert.equal(tracked.order.items[0].notes, 'No onions');
    await login('staff.1@demo.test');
    const board = await demoFetch('/api/staff/orders');
```

**السطر 17:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 18:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `test(...)`: RegExp.test تفحص تطابق النص؛ Node test يسجل اختبارًا. القيم المكتوبة هنا: `'a guest order can be tracked by token after reload and appears in the kitchen'`، `async () => {     const created = await demoFetch('/api/orders', { method: 'POST', body: JSON.stringify(payloa…`. العائد/الأثر: Boolean في regex؛ نتيجة تسجيل اختبار في Node.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 19:** Variable declaration / تعريف `created` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `demoFetch(...)`: Router محلي يختار من url/method ويطبق منطق API demo ثم يرجع data مباشرة. لا يرجع Response مثل fetch، ولا يجري network request. القيم المكتوبة هنا: `'/api/orders'`، `{ method: 'POST', body: JSON.stringify(payload()) }`. العائد/الأثر: Promise<payload> أو rejection بخطأ demo.؛ `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `payload()`. العائد/الأثر: string أو undefined لبعض القيم؛ `payload(...)`: تنفّذ الجزء المعرّف باسم payload في نفس الملف؛ التعريف كامل تحت مع شرح سطوره. مدخلاتها: المدخلات مكتوبة في تعريفها؛ الأقواس الفارغة تعني بدون arguments مباشرة. العائد/الأثر: ارجع لسطر return في تعريف الدالة؛ لو مفيش return قيمة فالناتج المعتاد undefined في JavaScript.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 20:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `assert.ok(...)`: تؤكد truthiness قيمة. القيم المكتوبة هنا: `created.tracking_url.includes(created.order.tracking_token)`. العائد/الأثر: undefined أو AssertionError.؛ `created.tracking_url.includes(...)`: تختبر وجود قيمة في array أو نص داخل string. القيم المكتوبة هنا: `created.order.tracking_token`. العائد/الأثر: Boolean؛ مش العنصر ولا موقعه.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 21:** Variable declaration / تعريف `tracked` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `demoFetch(...)`: Router محلي يختار من url/method ويطبق منطق API demo ثم يرجع data مباشرة. لا يرجع Response مثل fetch، ولا يجري network request. القيم المكتوبة هنا: `'/api/orders/track/' + created.order.tracking_token`. العائد/الأثر: Promise<payload> أو rejection بخطأ demo.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 22:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `assert.equal(...)`: تؤكد مساواة expected وactual بشكل صارم في هذا import. القيم المكتوبة هنا: `tracked.order.items[0].notes`، `'No onions'`. العائد/الأثر: undefined لو نجحت أو AssertionError عند الفشل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 23:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `login(...)`: تنفّذ الجزء المعرّف باسم login في نفس الملف؛ التعريف كامل تحت مع شرح سطوره. القيم المكتوبة هنا: `'staff.1@demo.test'`. العائد/الأثر: ارجع لسطر return في تعريف الدالة؛ لو مفيش return قيمة فالناتج المعتاد undefined في JavaScript.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 24:** Variable declaration / تعريف `board` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `demoFetch(...)`: Router محلي يختار من url/method ويطبق منطق API demo ثم يرجع data مباشرة. لا يرجع Response مثل fetch، ولا يجري network request. القيم المكتوبة هنا: `'/api/staff/orders'`. العائد/الأثر: Promise<payload> أو rejection بخطأ demo.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 25–32

```js
    assert.ok(board.orders.some((order) => order.id === created.order.id));
});
test('branch isolation and administrator access match the demo roles', async () => {
    await login('staff.1@demo.test');
    const board = await demoFetch('/api/staff/orders');
    assert.ok(board.orders.every((order) => order.branch_id === 1));
    await assert.rejects(() => demoFetch('/api/staff/orders/1009/status', { method: 'PATCH', body: JSON.stringify({ status: 'preparing' }) }));
    await assert.rejects(() => demoFetch('/api/admin/dashboard'));
```

**السطر 25:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `assert.ok(...)`: تؤكد truthiness قيمة. القيم المكتوبة هنا: `board.orders.some((order) => order.id === created.order.id)`. العائد/الأثر: undefined أو AssertionError.؛ `board.orders.some(...)`: تفحص هل أي عنصر يحقق الشرط وتتوقف عند أول نجاح. القيم المكتوبة هنا: `(order) => order.id === created.order.id`. العائد/الأثر: Boolean.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 26:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 27:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `test(...)`: RegExp.test تفحص تطابق النص؛ Node test يسجل اختبارًا. القيم المكتوبة هنا: `'branch isolation and administrator access match the demo roles'`، `async () => {     await login('staff.1@demo.test');     const board = await demoFetch('/api/staff/orders');   …`. العائد/الأثر: Boolean في regex؛ نتيجة تسجيل اختبار في Node.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 28:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `login(...)`: تنفّذ الجزء المعرّف باسم login في نفس الملف؛ التعريف كامل تحت مع شرح سطوره. القيم المكتوبة هنا: `'staff.1@demo.test'`. العائد/الأثر: ارجع لسطر return في تعريف الدالة؛ لو مفيش return قيمة فالناتج المعتاد undefined في JavaScript.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 29:** Variable declaration / تعريف `board` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `demoFetch(...)`: Router محلي يختار من url/method ويطبق منطق API demo ثم يرجع data مباشرة. لا يرجع Response مثل fetch، ولا يجري network request. القيم المكتوبة هنا: `'/api/staff/orders'`. العائد/الأثر: Promise<payload> أو rejection بخطأ demo.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 30:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `assert.ok(...)`: تؤكد truthiness قيمة. القيم المكتوبة هنا: `board.orders.every((order) => order.branch_id === 1)`. العائد/الأثر: undefined أو AssertionError.؛ `board.orders.every(...)`: تفحص هل كل العناصر تحقق الشرط. القيم المكتوبة هنا: `(order) => order.branch_id === 1`. العائد/الأثر: Boolean؛ القائمة الفاضية ترجع true.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 31:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `assert.rejects(...)`: تؤكد رفض Promise. القيم المكتوبة هنا: `() => demoFetch('/api/staff/orders/1009/status', { method: 'PATCH', body: JSON.stringify({ status: 'preparing'…`. العائد/الأثر: Promise للاختبار؛ لازم await.؛ `demoFetch(...)`: Router محلي يختار من url/method ويطبق منطق API demo ثم يرجع data مباشرة. لا يرجع Response مثل fetch، ولا يجري network request. القيم المكتوبة هنا: `'/api/staff/orders/1009/status'`، `{ method: 'PATCH', body: JSON.stringify({ status: 'preparing' }) }`. العائد/الأثر: Promise<payload> أو rejection بخطأ demo.؛ `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `{ status: 'preparing' }`. العائد/الأثر: string أو undefined لبعض القيم. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 32:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `assert.rejects(...)`: تؤكد رفض Promise. القيم المكتوبة هنا: `() => demoFetch('/api/admin/dashboard')`. العائد/الأثر: Promise للاختبار؛ لازم await.؛ `demoFetch(...)`: Router محلي يختار من url/method ويطبق منطق API demo ثم يرجع data مباشرة. لا يرجع Response مثل fetch، ولا يجري network request. القيم المكتوبة هنا: `'/api/admin/dashboard'`. العائد/الأثر: Promise<payload> أو rejection بخطأ demo.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 33–40

```js
    await login('admin@demo.test');
    assert.equal(new Set((await demoFetch('/api/staff/orders')).orders.map((order) => order.branch_id)).size, 3);
});
test('accept and prepare logs both steps; stale and invalid updates fail', () => {
    const order = { branch_id: 1, status: 'new', order_type: 'delivery', status_logs: [] };
    const user = { id: 201, role: 'staff', branch_id: 1 };
    transitionOrder(order, { status: 'preparing', expected_status: 'new' }, user);
    assert.deepEqual(order.status_logs.map((log) => log.to_status), ['accepted', 'preparing']);
```

**السطر 33:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `login(...)`: تنفّذ الجزء المعرّف باسم login في نفس الملف؛ التعريف كامل تحت مع شرح سطوره. القيم المكتوبة هنا: `'admin@demo.test'`. العائد/الأثر: ارجع لسطر return في تعريف الدالة؛ لو مفيش return قيمة فالناتج المعتاد undefined في JavaScript.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 34:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `assert.equal(...)`: تؤكد مساواة expected وactual بشكل صارم في هذا import. القيم المكتوبة هنا: `new Set((await demoFetch('/api/staff/orders')).orders.map((order) => order.branch_id)).size`، `3`. العائد/الأثر: undefined لو نجحت أو AssertionError عند الفشل.؛ `Set(...)`: تنشئ مجموعة قيم فريدة. القيم المكتوبة هنا: `(await demoFetch('/api/staff/orders')).orders.map((order) => order.branch_id)`. العائد/الأثر: Set instance، مش array.؛ `(await demoFetch('/api/staff/orders')).orders.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(order) => order.branch_id`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `demoFetch(...)`: Router محلي يختار من url/method ويطبق منطق API demo ثم يرجع data مباشرة. لا يرجع Response مثل fetch، ولا يجري network request. القيم المكتوبة هنا: `'/api/staff/orders'`. العائد/الأثر: Promise<payload> أو rejection بخطأ demo.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 35:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 36:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `test(...)`: RegExp.test تفحص تطابق النص؛ Node test يسجل اختبارًا. القيم المكتوبة هنا: `'accept and prepare logs both steps; stale and invalid updates fail'`، `() => {     const order = { branch_id: 1, status: 'new', order_type: 'delivery', status_logs: [] };     const …`. العائد/الأثر: Boolean في regex؛ نتيجة تسجيل اختبار في Node.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 37:** Variable declaration / تعريف `order` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة Object حقولها `branch_id`، `status`، `order_type`، `status_logs`.

**السطر 38:** Variable declaration / تعريف `user` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة Object حقولها `id`، `role`، `branch_id`.

**السطر 39:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `transitionOrder(...)`: يتحقق من فرع الموظف وexpected_status وقواعد الحالة والسبب؛ يسجل خطوات accepted/preparing عند القبول السريع. القيم المكتوبة هنا: `order`، `{ status: 'preparing', expected_status: 'new' }`، `user`. العائد/الأثر: نفس order بعد تعديله؛ يرمي Error للانتقال المرفوض.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 40:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `assert.deepEqual(...)`: تؤكد مساواة البنية والقيم. القيم المكتوبة هنا: `order.status_logs.map((log) => log.to_status)`، `['accepted', 'preparing']`. العائد/الأثر: undefined أو AssertionError.؛ `order.status_logs.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(log) => log.to_status`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 41–48

```js
    assert.throws(() => transitionOrder(order, { status: 'ready', expected_status: 'new' }, user));
    assert.throws(() => transitionOrder(order, { status: 'completed' }, user));
});
test('customer history and reorder exclude other users; payment never runs', async () => {
    await login('customer@demo.test');
    const created = await demoFetch('/api/orders', { method: 'POST', body: JSON.stringify(payload()) });
    const history = await demoFetch('/api/orders/history');
    assert.ok(history.orders.every((order) => order.user_id === 100));
```

**السطر 41:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `assert.throws(...)`: تؤكد أن callback ترمي خطأ متزامنًا. القيم المكتوبة هنا: `() => transitionOrder(order, { status: 'ready', expected_status: 'new' }, user)`. العائد/الأثر: undefined لو تحقق التوقع؛ Promise failures تحتاج rejects.؛ `transitionOrder(...)`: يتحقق من فرع الموظف وexpected_status وقواعد الحالة والسبب؛ يسجل خطوات accepted/preparing عند القبول السريع. القيم المكتوبة هنا: `order`، `{ status: 'ready', expected_status: 'new' }`، `user`. العائد/الأثر: نفس order بعد تعديله؛ يرمي Error للانتقال المرفوض.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 42:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `assert.throws(...)`: تؤكد أن callback ترمي خطأ متزامنًا. القيم المكتوبة هنا: `() => transitionOrder(order, { status: 'completed' }, user)`. العائد/الأثر: undefined لو تحقق التوقع؛ Promise failures تحتاج rejects.؛ `transitionOrder(...)`: يتحقق من فرع الموظف وexpected_status وقواعد الحالة والسبب؛ يسجل خطوات accepted/preparing عند القبول السريع. القيم المكتوبة هنا: `order`، `{ status: 'completed' }`، `user`. العائد/الأثر: نفس order بعد تعديله؛ يرمي Error للانتقال المرفوض.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 43:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 44:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `test(...)`: RegExp.test تفحص تطابق النص؛ Node test يسجل اختبارًا. القيم المكتوبة هنا: `'customer history and reorder exclude other users; payment never runs'`، `async () => {     await login('customer@demo.test');     const created = await demoFetch('/api/orders', { meth…`. العائد/الأثر: Boolean في regex؛ نتيجة تسجيل اختبار في Node.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 45:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `login(...)`: تنفّذ الجزء المعرّف باسم login في نفس الملف؛ التعريف كامل تحت مع شرح سطوره. القيم المكتوبة هنا: `'customer@demo.test'`. العائد/الأثر: ارجع لسطر return في تعريف الدالة؛ لو مفيش return قيمة فالناتج المعتاد undefined في JavaScript.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 46:** Variable declaration / تعريف `created` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `demoFetch(...)`: Router محلي يختار من url/method ويطبق منطق API demo ثم يرجع data مباشرة. لا يرجع Response مثل fetch، ولا يجري network request. القيم المكتوبة هنا: `'/api/orders'`، `{ method: 'POST', body: JSON.stringify(payload()) }`. العائد/الأثر: Promise<payload> أو rejection بخطأ demo.؛ `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `payload()`. العائد/الأثر: string أو undefined لبعض القيم؛ `payload(...)`: تنفّذ الجزء المعرّف باسم payload في نفس الملف؛ التعريف كامل تحت مع شرح سطوره. مدخلاتها: المدخلات مكتوبة في تعريفها؛ الأقواس الفارغة تعني بدون arguments مباشرة. العائد/الأثر: ارجع لسطر return في تعريف الدالة؛ لو مفيش return قيمة فالناتج المعتاد undefined في JavaScript.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 47:** Variable declaration / تعريف `history` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `demoFetch(...)`: Router محلي يختار من url/method ويطبق منطق API demo ثم يرجع data مباشرة. لا يرجع Response مثل fetch، ولا يجري network request. القيم المكتوبة هنا: `'/api/orders/history'`. العائد/الأثر: Promise<payload> أو rejection بخطأ demo.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 48:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `assert.ok(...)`: تؤكد truthiness قيمة. القيم المكتوبة هنا: `history.orders.every((order) => order.user_id === 100)`. العائد/الأثر: undefined أو AssertionError.؛ `history.orders.every(...)`: تفحص هل كل العناصر تحقق الشرط. القيم المكتوبة هنا: `(order) => order.user_id === 100`. العائد/الأثر: Boolean؛ القائمة الفاضية ترجع true.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 49–56

```js
    const reorder = await demoFetch('/api/orders/' + created.order.id + '/reorder', { method: 'POST' });
    assert.equal(reorder.cart_items[0].quantity, 2);
    await assert.rejects(() => demoFetch('/api/payments/intents', { method: 'POST' }));
});
test('demo reset leaves the real cart untouched and stores no passwords', async () => {
    values.set('wtc_cart', 'original cart');
    await login('admin@demo.test');
    await demoFetch('/api/admin/staff', { method: 'POST', body: JSON.stringify({ name: 'Demo User', email: 'demo-new@demo.test', role: 'staff', branch_id: 1, is_active: true, password: 'do-not-store' }) });
```

**السطر 49:** Variable declaration / تعريف `reorder` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `demoFetch(...)`: Router محلي يختار من url/method ويطبق منطق API demo ثم يرجع data مباشرة. لا يرجع Response مثل fetch، ولا يجري network request. القيم المكتوبة هنا: `'/api/orders/' + created.order.id + '/reorder'`، `{ method: 'POST' }`. العائد/الأثر: Promise<payload> أو rejection بخطأ demo.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 50:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `assert.equal(...)`: تؤكد مساواة expected وactual بشكل صارم في هذا import. القيم المكتوبة هنا: `reorder.cart_items[0].quantity`، `2`. العائد/الأثر: undefined لو نجحت أو AssertionError عند الفشل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 51:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `assert.rejects(...)`: تؤكد رفض Promise. القيم المكتوبة هنا: `() => demoFetch('/api/payments/intents', { method: 'POST' })`. العائد/الأثر: Promise للاختبار؛ لازم await.؛ `demoFetch(...)`: Router محلي يختار من url/method ويطبق منطق API demo ثم يرجع data مباشرة. لا يرجع Response مثل fetch، ولا يجري network request. القيم المكتوبة هنا: `'/api/payments/intents'`، `{ method: 'POST' }`. العائد/الأثر: Promise<payload> أو rejection بخطأ demo.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 52:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 53:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `test(...)`: RegExp.test تفحص تطابق النص؛ Node test يسجل اختبارًا. القيم المكتوبة هنا: `'demo reset leaves the real cart untouched and stores no passwords'`، `async () => {     values.set('wtc_cart', 'original cart');     await login('admin@demo.test');     await demoF…`. العائد/الأثر: Boolean في regex؛ نتيجة تسجيل اختبار في Node.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 54:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `values.set(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. القيم المكتوبة هنا: `'wtc_cart'`، `'original cart'`. العائد/الأثر: نفس Map للـchaining.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 55:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `login(...)`: تنفّذ الجزء المعرّف باسم login في نفس الملف؛ التعريف كامل تحت مع شرح سطوره. القيم المكتوبة هنا: `'admin@demo.test'`. العائد/الأثر: ارجع لسطر return في تعريف الدالة؛ لو مفيش return قيمة فالناتج المعتاد undefined في JavaScript.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 56:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `demoFetch(...)`: Router محلي يختار من url/method ويطبق منطق API demo ثم يرجع data مباشرة. لا يرجع Response مثل fetch، ولا يجري network request. القيم المكتوبة هنا: `'/api/admin/staff'`، `{ method: 'POST', body: JSON.stringify({ name: 'Demo User', email: 'demo-new@demo.test', role: 'staff', branch…`. العائد/الأثر: Promise<payload> أو rejection بخطأ demo.؛ `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `{ name: 'Demo User', email: 'demo-new@demo.test', role: 'staff', branch_id: 1, is_active: true, password: 'do-…`. العائد/الأثر: string أو undefined لبعض القيم. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 57–62

```js
    assert.ok(!values.get('wtc-demo-store-v1').includes('do-not-store'));
    resetDemo();
    assert.equal(values.get('wtc_cart'), 'original cart');
    assert.equal(values.has('wtc-demo-store-v1'), false);
});

```

**السطر 57:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `assert.ok(...)`: تؤكد truthiness قيمة. القيم المكتوبة هنا: `!values.get('wtc-demo-store-v1').includes('do-not-store')`. العائد/الأثر: undefined أو AssertionError.؛ `values.get('wtc-demo-store-v1').includes(...)`: تختبر وجود قيمة في array أو نص داخل string. القيم المكتوبة هنا: `'do-not-store'`. العائد/الأثر: Boolean؛ مش العنصر ولا موقعه.؛ `values.get(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. القيم المكتوبة هنا: `'wtc-demo-store-v1'`. العائد/الأثر: القيمة أو undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 58:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `resetDemo(...)`: يمسح 5 مفاتيح demo محددة فقط؛ لا يستخدم localStorage.clear ولا يمس مفاتيح live. مدخلاتها: لا شيء. العائد/الأثر: undefined؛ UI ينادي reload بعده لتوليد seed جديد.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 59:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `assert.equal(...)`: تؤكد مساواة expected وactual بشكل صارم في هذا import. القيم المكتوبة هنا: `values.get('wtc_cart')`، `'original cart'`. العائد/الأثر: undefined لو نجحت أو AssertionError عند الفشل.؛ `values.get(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. القيم المكتوبة هنا: `'wtc_cart'`. العائد/الأثر: القيمة أو undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 60:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `assert.equal(...)`: تؤكد مساواة expected وactual بشكل صارم في هذا import. القيم المكتوبة هنا: `values.has('wtc-demo-store-v1')`، `false`. العائد/الأثر: undefined لو نجحت أو AssertionError عند الفشل.؛ `values.has(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. القيم المكتوبة هنا: `'wtc-demo-store-v1'`. العائد/الأثر: Boolean.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 61:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
