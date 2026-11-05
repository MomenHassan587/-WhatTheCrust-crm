# محاكاة API للديمو داخل المتصفح فقط

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `resources/js/demo/api.js` · 235 سطر.

**وظيفة الملف:** يقلّد endpoints مستخدمة في الواجهة بدون Laravel/شبكة، ويخزن catalog/orders/users محليًا. role checks هنا لتوضيح الديمو وليست حماية أمنية لأن الزائر يتحكم في المتصفح. Payments/upload الحقيقي معطلان صراحة.

**نوعه:** support. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../resources/js/demo/api.js). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/resources/js/demo/catalog.json](catalog.json.md)

- [pizza-crm/resources/js/Components/DemoBar.jsx](../Components/DemoBar.jsx.md)

- [pizza-crm/resources/js/lib/api.js](../lib/api.js.md)

- [pizza-crm/resources/js/Pages/StaffDashboard.jsx](../Pages/StaffDashboard.jsx.md)

- [pizza-crm/resources/js/Pages/Cart.jsx](../Pages/Cart.jsx.md)

- [pizza-crm/resources/js/Pages/Admin/AdminPanel.jsx](../Pages/Admin/AdminPanel.jsx.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```js
import seedCatalog from './catalog.json' with { type: 'json' };

const STORE_KEY = 'wtc-demo-store-v1';
const SESSION_KEY = 'wtc-demo-user';
const clone = (value) => JSON.parse(JSON.stringify(value));

export function demoAccounts(catalog = seedCatalog) {
    return [
        { id: 100, name: 'Demo Customer', email: 'customer@demo.test', role: 'customer', branch_id: null, is_active: true },
        ...catalog.branches.map((branch) => ({ id: 200 + branch.id, name: branch.name + ' Staff', email: 'staff.' + branch.id + '@demo.test', role: 'staff', branch_id: branch.id, branch, is_active: true })),
        { id: 300, name: 'Demo Admin', email: 'admin@demo.test', role: 'admin', branch_id: null, is_active: true },
    ];
}

function error(message, errors = {}, status = 422) {
    const result = new Error(message);
    result.payload = { message, errors };
    result.status = status;
    return result;
}

function initialStore() {
    const catalog = clone(seedCatalog);
    const store = { catalog, users: demoAccounts(catalog), orders: [], logs: [], settings: { default_delivery_fee: 25, minimum_pickup_prep_minutes: 20, order_promise_minutes: 3 }, nextOrder: 1001 };
    const statuses = ['new', 'preparing', 'ready', 'out_for_delivery', 'picked_up', 'completed', 'cancelled', 'rejected'];
    catalog.branches.forEach((branch) => {
        statuses.forEach((status, index) => {
            const item = catalog.items.find((product) => product.branch_options.some((option) => option.branch_id === branch.id && option.is_available));
            const option = item.branch_options.find((price) => price.branch_id === branch.id);
            const createdAt = new Date(Date.now() - (index + 1) * 90000).toISOString();
            const type = status === 'picked_up' ? 'pickup' : 'delivery';
            store.orders.push({
                id: store.nextOrder++, user_id: 100, tracking_token: crypto.randomUUID(), branch_id: branch.id, branch: clone(branch),
                customer_name: 'Demo Guest ' + (index + 1), customer_phone: 'Demo phone', order_type: type,
                delivery_address: type === 'delivery' ? 'Sample address, Cairo (demo)' : null,
                pickup_time: type === 'pickup' ? new Date(Date.now() + 45 * 60000).toISOString() : null,
                payment_method: 'cash', payment_status: 'unpaid', status,
                status_reason: ['cancelled', 'rejected'].includes(status) ? 'Demonstration: customer request.' : null,
                total_price: Number(option.price) + (type === 'delivery' ? Number(branch.delivery_fee) : 0),
                items: [{ id: 1, menu_item_id: item.id, item_name: item.name, menu_item: clone(item), quantity: 1, price: Number(option.price), notes: index % 2 ? 'Demo kitchen note: extra crispy.' : null }],
                created_at: createdAt, updated_at: createdAt,
                status_logs: [{ from_status: null, to_status: status, created_at: createdAt }],
            });
        });
    });
    return store;
}

function loadStore() {
    try {
        const stored = JSON.parse(localStorage.getItem(STORE_KEY));
        if (stored?.catalog?.items?.length) return stored;
    } catch { /* Restart only corrupt demo data. */ }
    const store = initialStore();
    saveStore(store);
    return store;
}

function saveStore(store) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); }
    catch { throw error('Demo storage is full. Reset the demo and try again.'); }
}

function currentUser(store) {
    return store.users.find((user) => user.id === Number(localStorage.getItem(SESSION_KEY))) || null;
}

function requireRole(user, roles) {
    if (!user?.is_active || !roles.includes(user.role)) throw error('Access restricted in this demo.', {}, 403);
}

export function transitionOrder(order, data, user) {
    if (user.role !== 'admin' && Number(order.branch_id) !== Number(user.branch_id)) throw error('Order not found.', {}, 404);
    if (data.expected_status && data.expected_status !== order.status) throw error('Another demo tab already updated this order.', { expected_status: ['Refresh this order.'] }, 409);
    const transitions = { new: ['accepted', 'rejected', 'cancelled'], accepted: ['preparing', 'cancelled'], preparing: ['ready', 'cancelled'], ready: [order.order_type === 'delivery' ? 'out_for_delivery' : 'picked_up', 'cancelled'], out_for_delivery: ['completed', 'cancelled'], picked_up: ['completed'] };
    const steps = order.status === 'new' && data.status === 'preparing' ? ['accepted', 'preparing'] : [data.status];
    if (['cancelled', 'rejected'].includes(data.status) && !data.reason?.trim()) throw error('Please choose a reason.');
    for (const step of steps) {
        if (!transitions[order.status]?.includes(step)) throw error('This status transition is not available.');
        order.status_logs.push({ from_status: order.status, to_status: step, user_id: user.id, created_at: new Date().toISOString() });
        order.status = step;
    }
    order.status_reason = ['cancelled', 'rejected'].includes(data.status) ? data.reason : null;
    order.updated_at = new Date().toISOString();
    return order;
}

export function calculateOrder(data, catalog) {
    const branch = catalog.branches.find((entry) => entry.id === Number(data.branch_id) && entry.is_active !== false);
    if (!branch || (data.order_type === 'delivery' && !branch.delivery_enabled)) throw error('Choose an available branch.');
    if (!['delivery', 'pickup'].includes(data.order_type)) throw error('Choose delivery or pickup.');
    if (!data.customer_name?.trim() || !data.customer_phone?.trim()) throw error('Enter a demo name and phone.');
    if (data.order_type === 'delivery' && !data.delivery_address?.trim()) throw error('Enter a sample delivery address.');
    if (!data.items?.length) throw error('Add an item before ordering.');
    const items = data.items.map((line, index) => {
        const product = catalog.items.find((item) => item.id === Number(line.menu_item_id) && item.is_active !== false);
        const option = product?.branch_options.find((price) => price.branch_id === branch.id);
        if (!option?.is_available) throw error('One of these items is unavailable.');
        if (!Number.isInteger(Number(line.quantity)) || line.quantity < 1 || line.quantity > 20) throw error('Quantity must be between 1 and 20.');
        if ((line.notes || '').length > 200) throw error('Kitchen notes must be 200 characters or fewer.');
        return { id: index + 1, menu_item_id: product.id, menu_item: clone(product), item_name: product.name, price: Number(option.price), quantity: Number(line.quantity), notes: line.notes || null };
    });
    return { branch: clone(branch), items, total_price: items.reduce((total, line) => total + line.price * line.quantity, 0) + (data.order_type === 'delivery' ? Number(branch.delivery_fee) : 0) };
}

function adminItem(item, catalog) {
    return { ...item, is_active: item.is_active !== false, category: catalog.categories.find((category) => category.id === item.category_id), branches: item.branch_options.map((option) => ({ ...catalog.branches.find((branch) => branch.id === option.branch_id), pivot: option })) };
}

function audit(store, user, action, subjectId) {
    store.logs.unshift({ id: store.logs.length + 1, user, action, subject_type: 'DemoRecord', subject_id: subjectId, created_at: new Date().toISOString() });
}

export async function demoFetch(url, options = {}) {
    const location = new URL(url, 'https://demo.local');
    const path = location.pathname;
    const method = options.method || 'GET';
    const store = loadStore();
    const user = currentUser(store);
    const data = options.body instanceof FormData ? Object.fromEntries(options.body.entries()) : options.body ? JSON.parse(options.body) : {};
    const catalog = store.catalog;
    const persist = (result) => { saveStore(store); return clone(result); };

    if (path === '/api/menu') return clone({ ...catalog, branches: catalog.branches.filter((branch) => branch.is_active !== false), categories: catalog.categories.filter((category) => category.is_active !== false), items: catalog.items.filter((item) => item.is_active !== false && catalog.categories.find((category) => category.id === item.category_id)?.is_active !== false) });
    if (path === '/api/auth/me') return { user };
    if (path === '/api/auth/logout') { localStorage.removeItem(SESSION_KEY); return { user: null }; }
    if (path === '/api/auth/login') {
        const account = store.users.find((entry) => entry.email === data.email && entry.is_active);
        if (!account) throw error('Use one of the demo account buttons.');
        localStorage.setItem(SESSION_KEY, String(account.id));
        return { user: clone(account) };
    }
    if (path === '/api/auth/register') throw error('Use the Demo Customer account. Registration is disabled for this preview.');
    if (path.startsWith('/api/payments')) throw error('Payments are disabled. No money is collected in this demo.');

    if (path === '/api/orders' && method === 'POST') {
        const prepared = calculateOrder(data, catalog);
        if (data.order_type === 'pickup' && (!Number.isFinite(Date.parse(data.pickup_time)) || Date.parse(data.pickup_time) < Date.now() + Number(store.settings.minimum_pickup_prep_minutes) * 60000)) throw error('Choose a pickup time with enough preparation time.');
        const timestamp = new Date().toISOString();
        const order = { ...data, ...prepared, id: store.nextOrder++, branch_id: prepared.branch.id, user_id: user?.id || null, tracking_token: crypto.randomUUID(), payment_method: 'cash', payment_status: 'unpaid', status: 'new', created_at: timestamp, updated_at: timestamp, status_logs: [{ from_status: null, to_status: 'new', created_at: timestamp }] };
        store.orders.unshift(order);
        return persist({ order, tracking_url: '/orders/' + order.tracking_token });
    }
    if (path.startsWith('/api/orders/track/')) {
        const order = store.orders.find((entry) => entry.tracking_token === path.split('/').pop());
        if (!order) throw error('Order not found.', {}, 404);
        return clone({ order });
    }
    if (path === '/api/orders/history') {
        if (!user) throw error('Sign in with the demo customer account.', {}, 401);
        return clone({ orders: store.orders.filter((order) => order.user_id === user.id) });
    }
    if (/^\/api\/orders\/\d+\/reorder$/.test(path)) {
        const order = store.orders.find((entry) => entry.id === Number(path.split('/')[3]) && entry.user_id === user?.id);
        if (!order) throw error('Order not found.', {}, 404);
        const lines = order.items.flatMap((line) => {
            const item = catalog.items.find((entry) => entry.id === line.menu_item_id && entry.is_active !== false);
            const option = item?.branch_options.find((entry) => entry.branch_id === order.branch_id && entry.is_available);
            return option ? [{ id: item.id, name: item.name, description: item.description, image_src: item.image_path, price: Number(option.price), quantity: line.quantity, notes: line.notes, branch_id: order.branch_id, branch_name: order.branch.name }] : [];
        });
        return { branch_id: order.branch_id, order_type: order.order_type, cart_items: lines, skipped_items: order.items.length - lines.length };
    }
    if (path.startsWith('/api/staff/')) {
        requireRole(user, ['staff', 'admin']);
        const visible = store.orders.filter((order) => user.role === 'admin' || order.branch_id === user.branch_id);
        if (path === '/api/staff/orders') {
            return clone({ orders: visible.filter((order) => (!location.searchParams.get('branch_id') || order.branch_id === Number(location.searchParams.get('branch_id'))) && (!location.searchParams.get('date') || order.created_at.slice(0, 10) === location.searchParams.get('date'))), timing: { green_minutes: Number(store.settings.order_promise_minutes), orange_minutes: 6 } });
        }
        const order = visible.find((entry) => entry.id === Number(path.split('/')[4]));
        if (!order) throw error('Order not found.', {}, 404);
        if (method === 'PATCH') return persist({ message: 'Demo order updated.', order: transitionOrder(order, data, user) });
        return clone({ order });
    }
    if (path.startsWith('/api/admin/')) {
        requireRole(user, ['admin']);
        const section = path.split('/')[3];
        const id = Number(path.split('/')[4]);
        if (section === 'catalog') return clone({ ...catalog, items: catalog.items.map((item) => adminItem(item, catalog)) });
        if (section === 'dashboard') {
            const orders = store.orders.filter((order) => order.created_at.slice(0, 10) === new Date().toISOString().slice(0, 10));
            const active = orders.filter((order) => !['cancelled', 'rejected'].includes(order.status));
            const sales = active.reduce((sum, order) => sum + Number(order.total_price), 0);
            const byStatus = {}; const best = {};
            orders.forEach((order) => { byStatus[order.status] = (byStatus[order.status] || 0) + 1; });
            active.forEach((order) => order.items.forEach((line) => { best[line.item_name] = (best[line.item_name] || 0) + line.quantity; }));
            return { summary: { sales, orders: active.length, average: active.length ? sales / active.length : 0 }, by_status: byStatus, by_branch: catalog.branches.map((branch) => ({ name: branch.name, sales: active.filter((order) => order.branch_id === branch.id).reduce((sum, order) => sum + order.total_price, 0) })), best_items: Object.entries(best).map(([item_name, quantity]) => ({ item_name, quantity })).sort((a, b) => b.quantity - a.quantity).slice(0, 8) };
        }
        if (method !== 'GET') {
            if (section === 'products') {
                const item = catalog.items.find((entry) => entry.id === id);
                if (method === 'DELETE') { if (!item) throw error('Product not found.'); item.is_active = false; }
                else {
                    const optionsList = typeof data.branch_options === 'string' ? JSON.parse(data.branch_options) : data.branch_options;
                    const category = catalog.categories.find((entry) => entry.id === Number(data.category_id));
                    if (!data.name?.trim() || !category || !optionsList?.length) throw error('Complete the product details.');
                    const updated = { ...item, ...data, id: item?.id || Math.max(...catalog.items.map((entry) => entry.id)) + 1, category_id: category.id, category: category.name, category_slug: category.slug, is_active: data.is_active === true || data.is_active === '1', display_order: Number(data.display_order), branch_options: optionsList.map((option) => ({ ...option, branch_id: Number(option.branch_id), price: Number(option.price) })) };
                    delete updated.image;
                    if (data.image instanceof Blob && data.image.size) throw error('Photo uploads are available in the full website. Demo product edits work without a file.');
                    if (item) Object.assign(item, updated); else catalog.items.push(updated);
                }
            } else if (section === 'categories') {
                if (!data.name?.trim() || !data.slug?.trim()) throw error('Enter a category name and slug.');
                const existing = catalog.categories.find((entry) => entry.id === id);
                if (existing) Object.assign(existing, data); else catalog.categories.push({ ...data, id: Math.max(...catalog.categories.map((entry) => entry.id)) + 1 });
            } else if (section === 'branches') {
                const branch = catalog.branches.find((entry) => entry.id === id);
                if (!branch) throw error('Branch not found.');
                Object.assign(branch, data, { delivery_fee: Number(data.delivery_fee) });
                store.users.forEach((entry) => { if (entry.branch_id === branch.id) entry.branch = clone(branch); });
            } else if (section === 'staff') {
                if (!data.name?.trim() || !data.email?.trim()) throw error('Enter demo account details.');
                const record = { name: data.name, email: data.email, role: data.role, is_active: data.is_active, branch_id: data.role === 'staff' ? Number(data.branch_id) : null };
                record.branch = catalog.branches.find((branch) => branch.id === record.branch_id) || null;
                if (data.role === 'staff' && !record.branch) throw error('Assign a branch.');
                const account = store.users.find((entry) => entry.id === id);
                if (account) Object.assign(account, record); else store.users.push({ ...record, id: Math.max(...store.users.map((entry) => entry.id)) + 1 });
            } else if (section === 'settings') Object.assign(store.settings, data);
            else throw error('This demo action is unavailable.');
            audit(store, user, section + '.updated', id || null);
            return persist(section === 'settings' ? { settings: store.settings } : { message: 'Demo changes saved in this browser.' });
        }
        if (section === 'branches') return clone({ branches: catalog.branches });
        if (section === 'staff') return clone({ users: store.users.filter((entry) => entry.role !== 'customer') });
        if (section === 'settings') return clone({ settings: store.settings });
        if (section === 'audit') return clone({ logs: store.logs });
        if (section === 'orders') return clone({ orders: store.orders.filter((order) => (!location.searchParams.get('status') || order.status === location.searchParams.get('status')) && (!location.searchParams.get('payment_status') || order.payment_status === location.searchParams.get('payment_status')) && (!location.searchParams.get('search') || [order.id, order.customer_name, order.customer_phone].join(' ').toLowerCase().includes(location.searchParams.get('search').toLowerCase()))) });
        if (section === 'customers') return clone({ customers: store.users.filter((entry) => entry.role === 'customer').map((entry) => { const orders = store.orders.filter((order) => order.user_id === entry.id); return { ...entry, orders_count: orders.length, orders_sum_total_price: orders.reduce((sum, order) => sum + order.total_price, 0), orders_max_created_at: orders[0]?.created_at }; }) });
    }
    throw error('This feature is not available in the demo.', {}, 404);
}

export function resetDemo() {
    [STORE_KEY, SESSION_KEY, 'wtc_demo_cart', 'wtc_demo_branch_id', 'wtc_demo_order_preferences'].forEach((key) => localStorage.removeItem(key));
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### clone

ينسخ بيانات JSON-safe عبر stringify/parse لفصل المراجع؛ يفقد الأنواع غير المناسبة لـ JSON مثل Dates ككائنات/functions.

- **بتاخد إيه؟ Inputs:** value.

- **بترجع/بتغيّر إيه؟ Return / effect:** نسخة بيانات مفكوكة من JSON.

### demoAccounts

يبني عميلًا وموظفًا لكل فرع وأدمن بأرقام ثابتة للديمو.

- **بتاخد إيه؟ Inputs:** catalog=seedCatalog.

- **بترجع/بتغيّر إيه؟ Return / effect:** array حسابات وهمية، لا passwords.

### error

ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw.

- **بتاخد إيه؟ Inputs:** message,errors={},status=422.

- **بترجع/بتغيّر إيه؟ Return / effect:** Error object.

### initialStore

يبني seed محلي من catalog ويولّد طلبات حالات مختلفة لكل فرع مع tokens وأوقات demo.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** store object.

### loadStore

يقرأ store؛ لو ناقص/تالف يبني initialStore ويحفظه.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** store object.

### saveStore

يكتب store في localStorage ويحوّل فشل الامتلاء لرسالة مفهومة.

- **بتاخد إيه؟ Inputs:** store.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined أو يرمي Error.

### currentUser

يطابق session key المحلي مع store.users.

- **بتاخد إيه؟ Inputs:** store.

- **بترجع/بتغيّر إيه؟ Return / effect:** user object أو null.

### requireRole

يتأكد أن حساب الديمو active ودوره مسموح؛ ده محاكاة UX مش authorization إنتاجي.

- **بتاخد إيه؟ Inputs:** user,roles array.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined لو مسموح وإلا throw Error status403.

### transitionOrder

يتحقق من فرع الموظف وexpected_status وقواعد الحالة والسبب؛ يسجل خطوات accepted/preparing عند القبول السريع.

- **بتاخد إيه؟ Inputs:** order,data,user.

- **بترجع/بتغيّر إيه؟ Return / effect:** نفس order بعد تعديله؛ يرمي Error للانتقال المرفوض.

### calculateOrder

يراجع فرع/طريقة/عميل/عناوين/كمية وملاحظات ويعيد حساب السعر من catalog، مش من أسعار مرسلة من العميل.

- **بتاخد إيه؟ Inputs:** data: payload؛ catalog.

- **بترجع/بتغيّر إيه؟ Return / effect:** {branch,items,total_price}.

### adminItem

يحوّل item لواجهة admin: category object وbranches تحمل pivot من branch_options.

- **بتاخد إيه؟ Inputs:** item,catalog.

- **بترجع/بتغيّر إيه؟ Return / effect:** object موسّع.

### audit

يضيف سجل نشاط في أول store.logs بالوقت والمستخدم والإجراء.

- **بتاخد إيه؟ Inputs:** store,user,action,subjectId.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined.

### demoFetch

Router محلي يختار من url/method ويطبق منطق API demo ثم يرجع data مباشرة. لا يرجع Response مثل fetch، ولا يجري network request.

- **بتاخد إيه؟ Inputs:** url,options={}؛ body JSON أو FormData.

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<payload> أو rejection بخطأ demo.

### persist

helper داخل demoFetch يحفظ store ثم يرجع clone من النتيجة حتى ما يبقاش المستدعي ماسك نفس المرجع.

- **بتاخد إيه؟ Inputs:** result.

- **بترجع/بتغيّر إيه؟ Return / effect:** نسخة result.

### resetDemo

يمسح 5 مفاتيح demo محددة فقط؛ لا يستخدم localStorage.clear ولا يمس مفاتيح live.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined؛ UI ينادي reload بعده لتوليد seed جديد.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### JSON.parse

- **جاية منين؟** JavaScript

- **وظيفتها:** يفك JSON string لقيم JS؛ ممكن يرمي SyntaxError ولا يعتبر validation كامل.

- **المدخلات — Arguments:** JSON string

- **الناتج/الأثر — Return / effect:** JS value

- **أول موضع هنا:** السطر 193، والمدخلات المكتوبة: `data.branch_options`.

- **مثال:** const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

### JSON.stringify

- **جاية منين؟** JavaScript

- **وظيفتها:** يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions.

- **المدخلات — Arguments:** value

- **الناتج/الأثر — Return / effect:** string أو undefined لبعض القيم

- **أول موضع هنا:** السطر 60، والمدخلات المكتوبة: `store`.

- **مثال:** localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

### catalog.branches.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 186، والمدخلات المكتوبة: `(branch) => ({ name: branch.name, sales: active.filter((order) => order.branch_id === branch.id).reduce((sum, order) => sum + order.total_price, 0) })`.

### Error

- **جاية منين؟** JavaScript

- **وظيفتها:** تنشئ object خطأ برسالة؛ الرمي يحتاج throw منفصلة.

- **المدخلات — Arguments:** message وخيارات اختيارية.

- **الناتج/الأثر — Return / effect:** Error object.

- **أول موضع هنا:** السطر 16، والمدخلات المكتوبة: `message`.

### clone

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** ينسخ بيانات JSON-safe عبر stringify/parse لفصل المراجع؛ يفقد الأنواع غير المناسبة لـ JSON مثل Dates ككائنات/functions.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** نسخة بيانات مفكوكة من JSON.

- **أول موضع هنا:** السطر 227، والمدخلات المكتوبة: `{ customers: store.users.filter((entry) => entry.role === 'customer').map((entry) => { const orders = store.orders.filter((order) => order.user_id === entry.id); return { ...entry,…`.

### demoAccounts

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يبني عميلًا وموظفًا لكل فرع وأدمن بأرقام ثابتة للديمو.

- **المدخلات — Arguments:** catalog=seedCatalog.

- **الناتج/الأثر — Return / effect:** array حسابات وهمية، لا passwords.

- **أول موضع هنا:** السطر 24، والمدخلات المكتوبة: `catalog`.

### catalog.branches.forEach

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تنفّذ callback لكل عنصر لأثر جانبي.

- **المدخلات — Arguments:** callback.

- **الناتج/الأثر — Return / effect:** undefined؛ لا تجمع نتائج callbacks ولا تنتظر async callbacks تلقائيًا.

- **أول موضع هنا:** السطر 26، والمدخلات المكتوبة: `(branch) => {         statuses.forEach((status, index) => {             const item = catalog.items.find((product) => product.branch_options.some((option) => option.branch_id === br…`.

### statuses.forEach

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تنفّذ callback لكل عنصر لأثر جانبي.

- **المدخلات — Arguments:** callback.

- **الناتج/الأثر — Return / effect:** undefined؛ لا تجمع نتائج callbacks ولا تنتظر async callbacks تلقائيًا.

- **أول موضع هنا:** السطر 27، والمدخلات المكتوبة: `(status, index) => {             const item = catalog.items.find((product) => product.branch_options.some((option) => option.branch_id === branch.id && option.is_available));      …`.

### catalog.items.find

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تبحث بالترتيب حتى أول callback truthy.

- **المدخلات — Arguments:** callback تستقبل العنصر وindex والقائمة.

- **الناتج/الأثر — Return / effect:** العنصر المطابق نفسه أو undefined؛ ليست array نتائج.

- **أول موضع هنا:** السطر 190، والمدخلات المكتوبة: `(entry) => entry.id === id`.

### product.branch_options.some

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تفحص هل أي عنصر يحقق الشرط وتتوقف عند أول نجاح.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** Boolean.

- **أول موضع هنا:** السطر 28، والمدخلات المكتوبة: `(option) => option.branch_id === branch.id && option.is_available`.

### item.branch_options.find

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تبحث بالترتيب حتى أول callback truthy.

- **المدخلات — Arguments:** callback تستقبل العنصر وindex والقائمة.

- **الناتج/الأثر — Return / effect:** العنصر المطابق نفسه أو undefined؛ ليست array نتائج.

- **أول موضع هنا:** السطر 29، والمدخلات المكتوبة: `(price) => price.branch_id === branch.id`.

### new Date(Date.now() - (index + 1) * 90000).toISOString

- **جاية منين؟** Date instance

- **وظيفتها:** تنسّق التاريخ بنظام UTC.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** string؛ اليوم قد يختلف عن توقيت جهازك المحلي.

- **أول موضع هنا:** السطر 30.

### Date

- **جاية منين؟** JavaScript Date

- **وظيفتها:** مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي.

- **المدخلات — Arguments:** قيمة تاريخ اختيارية.

- **الناتج/الأثر — Return / effect:** Date object عند new؛ مش string تلقائيًا.

- **أول موضع هنا:** السطر 180.

### Date.now

- **جاية منين؟** Date / JavaScript

- **وظيفتها:** تقرأ وقت النظام الحالي كـtimestamp.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** milliseconds منذ Unix epoch، مش Date object.

- **أول موضع هنا:** السطر 138.

### store.orders.push

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تضيف عناصر في آخر array الأصلية.

- **المدخلات — Arguments:** العناصر المطلوبة.

- **الناتج/الأثر — Return / effect:** الطول الجديد؛ تعدّل الأصل.

- **أول موضع هنا:** السطر 32، والمدخلات المكتوبة: `{                 id: store.nextOrder++, user_id: 100, tracking_token: crypto.randomUUID(), branch_id: branch.id, branch: clone(branch),                 customer_name: 'Demo Guest …`.

### crypto.randomUUID

- **جاية منين؟** Browser Crypto

- **وظيفتها:** يولّد UUID عشوائي في secure context؛ ليس authorization token.

- **المدخلات — Arguments:** لا شيء

- **الناتج/الأثر — Return / effect:** UUID string

- **أول موضع هنا:** السطر 140.

- **مثال:** id: crypto.randomUUID();

### new Date(Date.now() + 45 * 60000).toISOString

- **جاية منين؟** Date instance

- **وظيفتها:** تنسّق التاريخ بنظام UTC.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** string؛ اليوم قد يختلف عن توقيت جهازك المحلي.

- **أول موضع هنا:** السطر 36.

### ['cancelled', 'rejected'].includes

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تختبر وجود قيمة في array أو نص داخل string.

- **المدخلات — Arguments:** القيمة/النص المطلوب.

- **الناتج/الأثر — Return / effect:** Boolean؛ مش العنصر ولا موقعه.

- **أول موضع هنا:** السطر 181، والمدخلات المكتوبة: `order.status`.

### Number

- **جاية منين؟** JavaScript conversion function

- **وظيفتها:** يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** number أو NaN.

- **أول موضع هنا:** السطر 212، والمدخلات المكتوبة: `data.branch_id`.

- **مثال:** Number(option.price);

### localStorage.getItem

- **جاية منين؟** Browser localStorage/sessionStorage

- **وظيفتها:** تقرأ النص المحفوظ تحت مفتاح.

- **المدخلات — Arguments:** اسم المفتاح.

- **الناتج/الأثر — Return / effect:** string أو null؛ لا تعيد object تلقائيًا.

- **أول موضع هنا:** السطر 65، والمدخلات المكتوبة: `SESSION_KEY`.

### initialStore

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يبني seed محلي من catalog ويولّد طلبات حالات مختلفة لكل فرع مع tokens وأوقات demo.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** store object.

- **أول موضع هنا:** السطر 54.

### saveStore

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يكتب store في localStorage ويحوّل فشل الامتلاء لرسالة مفهومة.

- **المدخلات — Arguments:** store.

- **الناتج/الأثر — Return / effect:** undefined أو يرمي Error.

- **أول موضع هنا:** السطر 122، والمدخلات المكتوبة: `store`.

### localStorage.setItem

- **جاية منين؟** Browser localStorage/sessionStorage

- **وظيفتها:** تحفظ قيمة نصية تحت مفتاح وتستبدل القديمة.

- **المدخلات — Arguments:** key وvalue.

- **الناتج/الأثر — Return / effect:** undefined؛ قد تفشل لو التخزين غير متاح.

- **أول موضع هنا:** السطر 130، والمدخلات المكتوبة: `SESSION_KEY`، `String(account.id)`.

### error

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw.

- **المدخلات — Arguments:** message,errors={},status=422.

- **الناتج/الأثر — Return / effect:** Error object.

- **أول موضع هنا:** السطر 229، والمدخلات المكتوبة: `'This feature is not available in the demo.'`، `{}`، `404`.

### store.users.find

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تبحث بالترتيب حتى أول callback truthy.

- **المدخلات — Arguments:** callback تستقبل العنصر وindex والقائمة.

- **الناتج/الأثر — Return / effect:** العنصر المطابق نفسه أو undefined؛ ليست array نتائج.

- **أول موضع هنا:** السطر 215، والمدخلات المكتوبة: `(entry) => entry.id === id`.

### roles.includes

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تختبر وجود قيمة في array أو نص داخل string.

- **المدخلات — Arguments:** القيمة/النص المطلوب.

- **الناتج/الأثر — Return / effect:** Boolean؛ مش العنصر ولا موقعه.

- **أول موضع هنا:** السطر 69، والمدخلات المكتوبة: `user.role`.

### data.reason?.trim

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تشيل whitespace من أول وآخر النص فقط.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** نص جديد؛ لا تغيّر النص الأصلي.

- **أول موضع هنا:** السطر 77.

### transitions[order.status]?.includes

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تختبر وجود قيمة في array أو نص داخل string.

- **المدخلات — Arguments:** القيمة/النص المطلوب.

- **الناتج/الأثر — Return / effect:** Boolean؛ مش العنصر ولا موقعه.

- **أول موضع هنا:** السطر 79، والمدخلات المكتوبة: `step`.

### order.status_logs.push

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تضيف عناصر في آخر array الأصلية.

- **المدخلات — Arguments:** العناصر المطلوبة.

- **الناتج/الأثر — Return / effect:** الطول الجديد؛ تعدّل الأصل.

- **أول موضع هنا:** السطر 80، والمدخلات المكتوبة: `{ from_status: order.status, to_status: step, user_id: user.id, created_at: new Date().toISOString() }`.

### new Date().toISOString

- **جاية منين؟** Date instance

- **وظيفتها:** تنسّق التاريخ بنظام UTC.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** string؛ اليوم قد يختلف عن توقيت جهازك المحلي.

- **أول موضع هنا:** السطر 180.

### catalog.branches.find

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تبحث بالترتيب حتى أول callback truthy.

- **المدخلات — Arguments:** callback تستقبل العنصر وindex والقائمة.

- **الناتج/الأثر — Return / effect:** العنصر المطابق نفسه أو undefined؛ ليست array نتائج.

- **أول موضع هنا:** السطر 213، والمدخلات المكتوبة: `(branch) => branch.id === record.branch_id`.

### ['delivery', 'pickup'].includes

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تختبر وجود قيمة في array أو نص داخل string.

- **المدخلات — Arguments:** القيمة/النص المطلوب.

- **الناتج/الأثر — Return / effect:** Boolean؛ مش العنصر ولا موقعه.

- **أول موضع هنا:** السطر 91، والمدخلات المكتوبة: `data.order_type`.

### data.customer_name?.trim

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تشيل whitespace من أول وآخر النص فقط.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** نص جديد؛ لا تغيّر النص الأصلي.

- **أول موضع هنا:** السطر 92.

### data.customer_phone?.trim

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تشيل whitespace من أول وآخر النص فقط.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** نص جديد؛ لا تغيّر النص الأصلي.

- **أول موضع هنا:** السطر 92.

### data.delivery_address?.trim

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تشيل whitespace من أول وآخر النص فقط.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** نص جديد؛ لا تغيّر النص الأصلي.

- **أول موضع هنا:** السطر 93.

### data.items.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 95، والمدخلات المكتوبة: `(line, index) => {         const product = catalog.items.find((item) => item.id === Number(line.menu_item_id) && item.is_active !== false);         const option = product?.branch_o…`.

### product?.branch_options.find

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تبحث بالترتيب حتى أول callback truthy.

- **المدخلات — Arguments:** callback تستقبل العنصر وindex والقائمة.

- **الناتج/الأثر — Return / effect:** العنصر المطابق نفسه أو undefined؛ ليست array نتائج.

- **أول موضع هنا:** السطر 97، والمدخلات المكتوبة: `(price) => price.branch_id === branch.id`.

### Number.isInteger

- **جاية منين؟** Number static

- **وظيفتها:** تفحص أن القيمة number صحيحة.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** Boolean؛ مش فحص حدود الكمية وحده.

- **أول موضع هنا:** السطر 99، والمدخلات المكتوبة: `Number(line.quantity)`.

### items.reduce

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تجمع عناصر في نتيجة متراكمة.

- **المدخلات — Arguments:** callback(accumulator, item) وقيمة بداية اختيارية.

- **الناتج/الأثر — Return / effect:** الناتج النهائي؛ سلة فاضية مع البداية0 ترجع0.

- **أول موضع هنا:** السطر 103، والمدخلات المكتوبة: `(total, line) => total + line.price * line.quantity`، `0`.

### catalog.categories.find

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تبحث بالترتيب حتى أول callback truthy.

- **المدخلات — Arguments:** callback تستقبل العنصر وindex والقائمة.

- **الناتج/الأثر — Return / effect:** العنصر المطابق نفسه أو undefined؛ ليست array نتائج.

- **أول موضع هنا:** السطر 203، والمدخلات المكتوبة: `(entry) => entry.id === id`.

### item.branch_options.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 107، والمدخلات المكتوبة: `(option) => ({ ...catalog.branches.find((branch) => branch.id === option.branch_id), pivot: option })`.

### store.logs.unshift

- **جاية منين؟** JavaScript Array.prototype

- **وظيفتها:** يضيف عناصر في أول نفس القائمة، لعرض الأحدث أولًا.

- **المدخلات — Arguments:** عنصر أو أكثر.

- **الناتج/الأثر — Return / effect:** الطول الجديد.

- **أول موضع هنا:** السطر 111، والمدخلات المكتوبة: `{ id: store.logs.length + 1, user, action, subject_type: 'DemoRecord', subject_id: subjectId, created_at: new Date().toISOString() }`.

- **مثال:** store.orders.unshift(order);

### URL

- **جاية منين؟** Browser/Node URL

- **وظيفتها:** تحلل عنوانًا وتجهز حقوله.

- **المدخلات — Arguments:** عنوان وbase اختياري.

- **الناتج/الأثر — Return / effect:** URL object، ولا تجلب المورد وحدها.

- **أول موضع هنا:** السطر 115، والمدخلات المكتوبة: `url`، `'https://demo.local'`.

### loadStore

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يقرأ store؛ لو ناقص/تالف يبني initialStore ويحفظه.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** store object.

- **أول موضع هنا:** السطر 118.

### currentUser

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يطابق session key المحلي مع store.users.

- **المدخلات — Arguments:** store.

- **الناتج/الأثر — Return / effect:** user object أو null.

- **أول موضع هنا:** السطر 119، والمدخلات المكتوبة: `store`.

### Object.fromEntries

- **جاية منين؟** JavaScript Object

- **وظيفتها:** عكس entries: يبني object من أزواج key/value، مثل تحويل entries FormData أو فلاتر غير فاضية.

- **المدخلات — Arguments:** iterable أزواج.

- **الناتج/الأثر — Return / effect:** object.

- **أول موضع هنا:** السطر 120، والمدخلات المكتوبة: `options.body.entries()`.

- **مثال:** Object.fromEntries(Object.entries(filters).filter(([,v]) => v));

### options.body.entries

- **جاية منين؟** Object/Map

- **وظيفتها:** تجهز أزواج key/value من المصدر.

- **المدخلات — Arguments:** object مع Object.entries، أو بدون arguments على Map.

- **الناتج/الأثر — Return / effect:** array أزواج أو iterator حسب المستقبِل.

- **أول موضع هنا:** السطر 120.

### catalog.branches.filter

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تختار كل العناصر التي شرطها truthy.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** array جديدة؛ لا تحذف الأصل بنفسها.

- **أول موضع هنا:** السطر 124، والمدخلات المكتوبة: `(branch) => branch.is_active !== false`.

### catalog.categories.filter

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تختار كل العناصر التي شرطها truthy.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** array جديدة؛ لا تحذف الأصل بنفسها.

- **أول موضع هنا:** السطر 124، والمدخلات المكتوبة: `(category) => category.is_active !== false`.

### catalog.items.filter

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تختار كل العناصر التي شرطها truthy.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** array جديدة؛ لا تحذف الأصل بنفسها.

- **أول موضع هنا:** السطر 124، والمدخلات المكتوبة: `(item) => item.is_active !== false && catalog.categories.find((category) => category.id === item.category_id)?.is_active !== false`.

### localStorage.removeItem

- **جاية منين؟** Browser Storage

- **وظيفتها:** تمسح مفتاحًا محددًا فقط.

- **المدخلات — Arguments:** key.

- **الناتج/الأثر — Return / effect:** undefined؛ ليست حذف قاعدة بيانات Laravel.

- **أول موضع هنا:** السطر 233، والمدخلات المكتوبة: `key`.

### String

- **جاية منين؟** JavaScript

- **وظيفتها:** تحوّل قيمة إلى نص عند استدعائها بدون new.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 130، والمدخلات المكتوبة: `account.id`.

### path.startsWith

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تفحص بداية النص.

- **المدخلات — Arguments:** prefix وموضع اختياري.

- **الناتج/الأثر — Return / effect:** Boolean؛ لا تتحقق من وجود ملف.

- **أول موضع هنا:** السطر 174، والمدخلات المكتوبة: `'/api/admin/'`.

### calculateOrder

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يراجع فرع/طريقة/عميل/عناوين/كمية وملاحظات ويعيد حساب السعر من catalog، مش من أسعار مرسلة من العميل.

- **المدخلات — Arguments:** data: payload؛ catalog.

- **الناتج/الأثر — Return / effect:** {branch,items,total_price}.

- **أول موضع هنا:** السطر 137، والمدخلات المكتوبة: `data`، `catalog`.

### Number.isFinite

- **جاية منين؟** Number static

- **وظيفتها:** تفحص رقمًا محدودًا بدون تحويل النصوص.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** Boolean.

- **أول موضع هنا:** السطر 138، والمدخلات المكتوبة: `Date.parse(data.pickup_time)`.

### Date.parse

- **جاية منين؟** JSON / JavaScript

- **وظيفتها:** تحلّل نص JSON لقيمة JavaScript.

- **المدخلات — Arguments:** نص JSON صالح.

- **الناتج/الأثر — Return / effect:** قيمة object/array/primitive أو خطأ SyntaxError.

- **أول موضع هنا:** السطر 138، والمدخلات المكتوبة: `data.pickup_time`.

### store.orders.unshift

- **جاية منين؟** JavaScript Array.prototype

- **وظيفتها:** يضيف عناصر في أول نفس القائمة، لعرض الأحدث أولًا.

- **المدخلات — Arguments:** عنصر أو أكثر.

- **الناتج/الأثر — Return / effect:** الطول الجديد.

- **أول موضع هنا:** السطر 141، والمدخلات المكتوبة: `order`.

- **مثال:** store.orders.unshift(order);

### persist

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** helper داخل demoFetch يحفظ store ثم يرجع clone من النتيجة حتى ما يبقاش المستدعي ماسك نفس المرجع.

- **المدخلات — Arguments:** result.

- **الناتج/الأثر — Return / effect:** نسخة result.

- **أول موضع هنا:** السطر 220، والمدخلات المكتوبة: `section === 'settings' ? { settings: store.settings } : { message: 'Demo changes saved in this browser.' }`.

### store.orders.find

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تبحث بالترتيب حتى أول callback truthy.

- **المدخلات — Arguments:** callback تستقبل العنصر وindex والقائمة.

- **الناتج/الأثر — Return / effect:** العنصر المطابق نفسه أو undefined؛ ليست array نتائج.

- **أول موضع هنا:** السطر 154، والمدخلات المكتوبة: `(entry) => entry.id === Number(path.split('/')[3]) && entry.user_id === user?.id`.

### path.split('/').pop

- **جاية منين؟** Array

- **وظيفتها:** تشيل آخر عنصر من array الأصلية.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** العنصر المحذوف أو undefined.

- **أول موضع هنا:** السطر 145.

### path.split

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تقسم النص لأجزاء.

- **المدخلات — Arguments:** separator وlimit اختيارية.

- **الناتج/الأثر — Return / effect:** array نصوص.

- **أول موضع هنا:** السطر 177، والمدخلات المكتوبة: `'/'`.

### store.orders.filter

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تختار كل العناصر التي شرطها truthy.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** array جديدة؛ لا تحذف الأصل بنفسها.

- **أول موضع هنا:** السطر 227، والمدخلات المكتوبة: `(order) => order.user_id === entry.id`.

### /^\/api\/orders\/\d+\/reorder$/.test

- **جاية منين؟** RegExp أو Node test حسب المستقبِل

- **وظيفتها:** RegExp.test تفحص تطابق النص؛ Node test يسجل اختبارًا.

- **المدخلات — Arguments:** نص للـregex، أو اسم وcallback للاختبار.

- **الناتج/الأثر — Return / effect:** Boolean في regex؛ نتيجة تسجيل اختبار في Node.

- **أول موضع هنا:** السطر 153، والمدخلات المكتوبة: `path`.

### order.items.flatMap

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل العناصر ثم تفرد مستوى array واحد.

- **المدخلات — Arguments:** callback قد ترجع عنصرًا أو array.

- **الناتج/الأثر — Return / effect:** array جديدة؛ [] من callback تشيل العنصر من الناتج.

- **أول موضع هنا:** السطر 156، والمدخلات المكتوبة: `(line) => {             const item = catalog.items.find((entry) => entry.id === line.menu_item_id && entry.is_active !== false);             const option = item?.branch_options.fin…`.

### item?.branch_options.find

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تبحث بالترتيب حتى أول callback truthy.

- **المدخلات — Arguments:** callback تستقبل العنصر وindex والقائمة.

- **الناتج/الأثر — Return / effect:** العنصر المطابق نفسه أو undefined؛ ليست array نتائج.

- **أول موضع هنا:** السطر 158، والمدخلات المكتوبة: `(entry) => entry.branch_id === order.branch_id && entry.is_available`.

### requireRole

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يتأكد أن حساب الديمو active ودوره مسموح؛ ده محاكاة UX مش authorization إنتاجي.

- **المدخلات — Arguments:** user,roles array.

- **الناتج/الأثر — Return / effect:** undefined لو مسموح وإلا throw Error status403.

- **أول موضع هنا:** السطر 175، والمدخلات المكتوبة: `user`، `['admin']`.

### visible.filter

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تختار كل العناصر التي شرطها truthy.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** array جديدة؛ لا تحذف الأصل بنفسها.

- **أول موضع هنا:** السطر 167، والمدخلات المكتوبة: `(order) => (!location.searchParams.get('branch_id') || order.branch_id === Number(location.searchParams.get('branch_id'))) && (!location.searchParams.get('date') || order.created_a…`.

### location.searchParams.get

- **جاية منين؟** URLSearchParams

- **وظيفتها:** تقرأ قيمة query parameter.

- **المدخلات — Arguments:** اسم المفتاح.

- **الناتج/الأثر — Return / effect:** string أو null؛ لا تجلب شبكة.

- **أول موضع هنا:** السطر 226، والمدخلات المكتوبة: `'search'`.

### order.created_at.slice

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تأخذ جزءًا بدون تعديل الأصل.

- **المدخلات — Arguments:** start وend غير شامل النهاية.

- **الناتج/الأثر — Return / effect:** نسخة array جزئية أو نص جزئي حسب المستقبِل.

- **أول موضع هنا:** السطر 180، والمدخلات المكتوبة: `0`، `10`.

### visible.find

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تبحث بالترتيب حتى أول callback truthy.

- **المدخلات — Arguments:** callback تستقبل العنصر وindex والقائمة.

- **الناتج/الأثر — Return / effect:** العنصر المطابق نفسه أو undefined؛ ليست array نتائج.

- **أول موضع هنا:** السطر 169، والمدخلات المكتوبة: `(entry) => entry.id === Number(path.split('/')[4])`.

### transitionOrder

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يتحقق من فرع الموظف وexpected_status وقواعد الحالة والسبب؛ يسجل خطوات accepted/preparing عند القبول السريع.

- **المدخلات — Arguments:** order,data,user.

- **الناتج/الأثر — Return / effect:** نفس order بعد تعديله؛ يرمي Error للانتقال المرفوض.

- **أول موضع هنا:** السطر 171، والمدخلات المكتوبة: `order`، `data`، `user`.

### catalog.items.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 196، والمدخلات المكتوبة: `(entry) => entry.id`.

### adminItem

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يحوّل item لواجهة admin: category object وbranches تحمل pivot من branch_options.

- **المدخلات — Arguments:** item,catalog.

- **الناتج/الأثر — Return / effect:** object موسّع.

- **أول موضع هنا:** السطر 178، والمدخلات المكتوبة: `item`، `catalog`.

### new Date().toISOString().slice

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تأخذ جزءًا بدون تعديل الأصل.

- **المدخلات — Arguments:** start وend غير شامل النهاية.

- **الناتج/الأثر — Return / effect:** نسخة array جزئية أو نص جزئي حسب المستقبِل.

- **أول موضع هنا:** السطر 180، والمدخلات المكتوبة: `0`، `10`.

### orders.filter

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تختار كل العناصر التي شرطها truthy.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** array جديدة؛ لا تحذف الأصل بنفسها.

- **أول موضع هنا:** السطر 181، والمدخلات المكتوبة: `(order) => !['cancelled', 'rejected'].includes(order.status)`.

### active.reduce

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تجمع عناصر في نتيجة متراكمة.

- **المدخلات — Arguments:** callback(accumulator, item) وقيمة بداية اختيارية.

- **الناتج/الأثر — Return / effect:** الناتج النهائي؛ سلة فاضية مع البداية0 ترجع0.

- **أول موضع هنا:** السطر 182، والمدخلات المكتوبة: `(sum, order) => sum + Number(order.total_price)`، `0`.

### orders.forEach

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تنفّذ callback لكل عنصر لأثر جانبي.

- **المدخلات — Arguments:** callback.

- **الناتج/الأثر — Return / effect:** undefined؛ لا تجمع نتائج callbacks ولا تنتظر async callbacks تلقائيًا.

- **أول موضع هنا:** السطر 184، والمدخلات المكتوبة: `(order) => { byStatus[order.status] = (byStatus[order.status] || 0) + 1; }`.

### active.forEach

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تنفّذ callback لكل عنصر لأثر جانبي.

- **المدخلات — Arguments:** callback.

- **الناتج/الأثر — Return / effect:** undefined؛ لا تجمع نتائج callbacks ولا تنتظر async callbacks تلقائيًا.

- **أول موضع هنا:** السطر 185، والمدخلات المكتوبة: `(order) => order.items.forEach((line) => { best[line.item_name] = (best[line.item_name] || 0) + line.quantity; })`.

### order.items.forEach

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تنفّذ callback لكل عنصر لأثر جانبي.

- **المدخلات — Arguments:** callback.

- **الناتج/الأثر — Return / effect:** undefined؛ لا تجمع نتائج callbacks ولا تنتظر async callbacks تلقائيًا.

- **أول موضع هنا:** السطر 185، والمدخلات المكتوبة: `(line) => { best[line.item_name] = (best[line.item_name] || 0) + line.quantity; }`.

### active.filter((order) => order.branch_id === branch.id).reduce

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تجمع عناصر في نتيجة متراكمة.

- **المدخلات — Arguments:** callback(accumulator, item) وقيمة بداية اختيارية.

- **الناتج/الأثر — Return / effect:** الناتج النهائي؛ سلة فاضية مع البداية0 ترجع0.

- **أول موضع هنا:** السطر 186، والمدخلات المكتوبة: `(sum, order) => sum + order.total_price`، `0`.

### active.filter

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تختار كل العناصر التي شرطها truthy.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** array جديدة؛ لا تحذف الأصل بنفسها.

- **أول موضع هنا:** السطر 186، والمدخلات المكتوبة: `(order) => order.branch_id === branch.id`.

### Object.entries(best).map(([item_name, quantity]) => ({ item_name, quantity })).sort((a, b) => b.quantity - a.quantity).slice

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تأخذ جزءًا بدون تعديل الأصل.

- **المدخلات — Arguments:** start وend غير شامل النهاية.

- **الناتج/الأثر — Return / effect:** نسخة array جزئية أو نص جزئي حسب المستقبِل.

- **أول موضع هنا:** السطر 186، والمدخلات المكتوبة: `0`، `8`.

### Object.entries(best).map(([item_name, quantity]) => ({ item_name, quantity })).sort

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** ترتّب القائمة باستخدام المقارنة.

- **المدخلات — Arguments:** compare callback اختيارية.

- **الناتج/الأثر — Return / effect:** نفس array بعد تعديل ترتيبها؛ ليست نسخة مستقلة.

- **أول موضع هنا:** السطر 186، والمدخلات المكتوبة: `(a, b) => b.quantity - a.quantity`.

### Object.entries(best).map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 186، والمدخلات المكتوبة: `([item_name, quantity]) => ({ item_name, quantity })`.

### Object.entries

- **جاية منين؟** JavaScript Object

- **وظيفتها:** يحوّل الخصائص الذاتية القابلة للتعداد لأزواج [key,value]؛ مفيد لبناء FormData وفلاتر URL.

- **المدخلات — Arguments:** object.

- **الناتج/الأثر — Return / effect:** array أزواج.

- **أول موضع هنا:** السطر 186، والمدخلات المكتوبة: `best`.

- **مثال:** Object.entries(form).forEach(([key, value]) => { /* append */ });

### data.name?.trim

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تشيل whitespace من أول وآخر النص فقط.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** نص جديد؛ لا تغيّر النص الأصلي.

- **أول موضع هنا:** السطر 211.

### Math.max

- **جاية منين؟** Math / JavaScript

- **وظيفتها:** ترجع أكبر المدخلات.

- **المدخلات — Arguments:** أعداد.

- **الناتج/الأثر — Return / effect:** number.

- **أول موضع هنا:** السطر 216، والمدخلات المكتوبة: `...store.users.map((entry) => entry.id)`.

### optionsList.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 196، والمدخلات المكتوبة: `(option) => ({ ...option, branch_id: Number(option.branch_id), price: Number(option.price) })`.

### Object.assign

- **جاية منين؟** JavaScript

- **وظيفتها:** ينسخ properties إلى target نفسه؛ هنا يحافظ على reactive object بدل استبداله.

- **المدخلات — Arguments:** target,...sources

- **الناتج/الأثر — Return / effect:** target بعد التعديل

- **أول موضع هنا:** السطر 217، والمدخلات المكتوبة: `store.settings`، `data`.

- **مثال:** Object.assign(rescheduleTarget.value, rescheduleForm, {status:'requested'});

### catalog.items.push

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تضيف عناصر في آخر array الأصلية.

- **المدخلات — Arguments:** العناصر المطلوبة.

- **الناتج/الأثر — Return / effect:** الطول الجديد؛ تعدّل الأصل.

- **أول موضع هنا:** السطر 199، والمدخلات المكتوبة: `updated`.

### data.slug?.trim

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تشيل whitespace من أول وآخر النص فقط.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** نص جديد؛ لا تغيّر النص الأصلي.

- **أول موضع هنا:** السطر 202.

### catalog.categories.push

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تضيف عناصر في آخر array الأصلية.

- **المدخلات — Arguments:** العناصر المطلوبة.

- **الناتج/الأثر — Return / effect:** الطول الجديد؛ تعدّل الأصل.

- **أول موضع هنا:** السطر 204، والمدخلات المكتوبة: `{ ...data, id: Math.max(...catalog.categories.map((entry) => entry.id)) + 1 }`.

### catalog.categories.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 204، والمدخلات المكتوبة: `(entry) => entry.id`.

### store.users.forEach

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تنفّذ callback لكل عنصر لأثر جانبي.

- **المدخلات — Arguments:** callback.

- **الناتج/الأثر — Return / effect:** undefined؛ لا تجمع نتائج callbacks ولا تنتظر async callbacks تلقائيًا.

- **أول موضع هنا:** السطر 209، والمدخلات المكتوبة: `(entry) => { if (entry.branch_id === branch.id) entry.branch = clone(branch); }`.

### data.email?.trim

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تشيل whitespace من أول وآخر النص فقط.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** نص جديد؛ لا تغيّر النص الأصلي.

- **أول موضع هنا:** السطر 211.

### store.users.push

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تضيف عناصر في آخر array الأصلية.

- **المدخلات — Arguments:** العناصر المطلوبة.

- **الناتج/الأثر — Return / effect:** الطول الجديد؛ تعدّل الأصل.

- **أول موضع هنا:** السطر 216، والمدخلات المكتوبة: `{ ...record, id: Math.max(...store.users.map((entry) => entry.id)) + 1 }`.

### store.users.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 216، والمدخلات المكتوبة: `(entry) => entry.id`.

### audit

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يضيف سجل نشاط في أول store.logs بالوقت والمستخدم والإجراء.

- **المدخلات — Arguments:** store,user,action,subjectId.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 219، والمدخلات المكتوبة: `store`، `user`، `section + '.updated'`، `id || null`.

### store.users.filter

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تختار كل العناصر التي شرطها truthy.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** array جديدة؛ لا تحذف الأصل بنفسها.

- **أول موضع هنا:** السطر 227، والمدخلات المكتوبة: `(entry) => entry.role === 'customer'`.

### [order.id, order.customer_name, order.customer_phone].join(' ').toLowerCase().includes

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تختبر وجود قيمة في array أو نص داخل string.

- **المدخلات — Arguments:** القيمة/النص المطلوب.

- **الناتج/الأثر — Return / effect:** Boolean؛ مش العنصر ولا موقعه.

- **أول موضع هنا:** السطر 226، والمدخلات المكتوبة: `location.searchParams.get('search').toLowerCase()`.

### [order.id, order.customer_name, order.customer_phone].join(' ').toLowerCase

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تحوّل الحروف لحالتها الصغيرة.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** نص جديد.

- **أول موضع هنا:** السطر 226.

### [order.id, order.customer_name, order.customer_phone].join

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تجمع عناصر في نص.

- **المدخلات — Arguments:** separator اختياري.

- **الناتج/الأثر — Return / effect:** string، لا تعدّل عناصر الأصل.

- **أول موضع هنا:** السطر 226، والمدخلات المكتوبة: `' '`.

### location.searchParams.get('search').toLowerCase

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تحوّل الحروف لحالتها الصغيرة.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** نص جديد.

- **أول موضع هنا:** السطر 226.

### store.users.filter((entry) => entry.role === 'customer').map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 227، والمدخلات المكتوبة: `(entry) => { const orders = store.orders.filter((order) => order.user_id === entry.id); return { ...entry, orders_count: orders.length, orders_sum_total_price: orders.reduce((sum, …`.

### orders.reduce

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تجمع عناصر في نتيجة متراكمة.

- **المدخلات — Arguments:** callback(accumulator, item) وقيمة بداية اختيارية.

- **الناتج/الأثر — Return / effect:** الناتج النهائي؛ سلة فاضية مع البداية0 ترجع0.

- **أول موضع هنا:** السطر 227، والمدخلات المكتوبة: `(sum, order) => sum + order.total_price`، `0`.

### [STORE_KEY, SESSION_KEY, 'wtc_demo_cart', 'wtc_demo_branch_id', 'wtc_demo_order_preferences'].forEach

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تنفّذ callback لكل عنصر لأثر جانبي.

- **المدخلات — Arguments:** callback.

- **الناتج/الأثر — Return / effect:** undefined؛ لا تجمع نتائج callbacks ولا تنتظر async callbacks تلقائيًا.

- **أول موضع هنا:** السطر 233، والمدخلات المكتوبة: `(key) => localStorage.removeItem(key)`.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```js
import seedCatalog from './catalog.json' with { type: 'json' };

const STORE_KEY = 'wtc-demo-store-v1';
const SESSION_KEY = 'wtc-demo-user';
const clone = (value) => JSON.parse(JSON.stringify(value));

export function demoAccounts(catalog = seedCatalog) {
    return [
```

**السطر 1:** Import / استيراد: الأسماء `seedCatalog` جاية من `./catalog.json`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 3:** Variable declaration / تعريف `STORE_KEY` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `"wtc-demo-store-v1"`، مش ناتج طلب شبكة.

**السطر 4:** Variable declaration / تعريف `SESSION_KEY` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `"wtc-demo-user"`، مش ناتج طلب شبكة.

**السطر 5:** Variable declaration / تعريف `clone` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `clone` هنا: ينسخ بيانات JSON-safe عبر stringify/parse لفصل المراجع؛ يفقد الأنواع غير المناسبة لـ JSON مثل Dates ككائنات/functions. المدخلات: value.. الناتج/الأثر: نسخة بيانات مفكوكة من JSON.. الدوال الموجودة في السطر: `JSON.parse(...)`: يفك JSON string لقيم JS؛ ممكن يرمي SyntaxError ولا يعتبر validation كامل. القيم المكتوبة هنا: `JSON.stringify(value)`. العائد/الأثر: JS value؛ `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `value`. العائد/الأثر: string أو undefined لبعض القيم. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 7:** Function / تعريف دالة `demoAccounts`؛ تعريفها مش تشغيلها. يبني عميلًا وموظفًا لكل فرع وأدمن بأرقام ثابتة للديمو. مدخلاتها: catalog=seedCatalog. ناتجها: array حسابات وهمية، لا passwords.

**السطر 8:** Return / رجّع `[` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

### السطور 9–16

```js
        { id: 100, name: 'Demo Customer', email: 'customer@demo.test', role: 'customer', branch_id: null, is_active: true },
        ...catalog.branches.map((branch) => ({ id: 200 + branch.id, name: branch.name + ' Staff', email: 'staff.' + branch.id + '@demo.test', role: 'staff', branch_id: branch.id, branch, is_active: true })),
        { id: 300, name: 'Demo Admin', email: 'admin@demo.test', role: 'admin', branch_id: null, is_active: true },
    ];
}

function error(message, errors = {}, status = 422) {
    const result = new Error(message);
```

**السطر 9:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 10:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `catalog.branches.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(branch) => ({ id: 200 + branch.id, name: branch.name + ' Staff', email: 'staff.' + branch.id + '@demo.test', …`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 11:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 12:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 13:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 15:** Function / تعريف دالة `error`؛ تعريفها مش تشغيلها. ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. مدخلاتها: message,errors={},status=422. ناتجها: Error object.

**السطر 16:** Variable declaration / تعريف `result` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Error(...)`: تنشئ object خطأ برسالة؛ الرمي يحتاج throw منفصلة. القيم المكتوبة هنا: `message`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 17–24

```js
    result.payload = { message, errors };
    result.status = status;
    return result;
}

function initialStore() {
    const catalog = clone(seedCatalog);
    const store = { catalog, users: demoAccounts(catalog), orders: [], logs: [], settings: { default_delivery_fee: 25, minimum_pickup_prep_minutes: 20, order_promise_minutes: 3 }, nextOrder: 1001 };
```

**السطر 17:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 18:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 19:** Return / رجّع `result` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 20:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 22:** Function / تعريف دالة `initialStore`؛ تعريفها مش تشغيلها. يبني seed محلي من catalog ويولّد طلبات حالات مختلفة لكل فرع مع tokens وأوقات demo. مدخلاتها: لا شيء. ناتجها: store object.

**السطر 23:** Variable declaration / تعريف `catalog` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `clone(...)`: ينسخ بيانات JSON-safe عبر stringify/parse لفصل المراجع؛ يفقد الأنواع غير المناسبة لـ JSON مثل Dates ككائنات/functions. القيم المكتوبة هنا: `seedCatalog`. العائد/الأثر: نسخة بيانات مفكوكة من JSON.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 24:** Variable declaration / تعريف `store` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة Object حقولها `catalog`، `users`، `orders`، `logs`، `settings`، `nextOrder`. الدوال الموجودة في السطر: `demoAccounts(...)`: يبني عميلًا وموظفًا لكل فرع وأدمن بأرقام ثابتة للديمو. القيم المكتوبة هنا: `catalog`. العائد/الأثر: array حسابات وهمية، لا passwords.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 25–32

```js
    const statuses = ['new', 'preparing', 'ready', 'out_for_delivery', 'picked_up', 'completed', 'cancelled', 'rejected'];
    catalog.branches.forEach((branch) => {
        statuses.forEach((status, index) => {
            const item = catalog.items.find((product) => product.branch_options.some((option) => option.branch_id === branch.id && option.is_available));
            const option = item.branch_options.find((price) => price.branch_id === branch.id);
            const createdAt = new Date(Date.now() - (index + 1) * 90000).toISOString();
            const type = status === 'picked_up' ? 'pickup' : 'delivery';
            store.orders.push({
```

**السطر 25:** Variable declaration / تعريف `statuses` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة الابتدائية Array فيها 8 عنصرًا؛ العناصر نفسها في السطور التالية.

**السطر 26:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `catalog.branches.forEach(...)`: تنفّذ callback لكل عنصر لأثر جانبي. القيم المكتوبة هنا: `(branch) => {         statuses.forEach((status, index) => {             const item = catalog.items.find((produ…`. العائد/الأثر: undefined؛ لا تجمع نتائج callbacks ولا تنتظر async callbacks تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 27:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `statuses.forEach(...)`: تنفّذ callback لكل عنصر لأثر جانبي. القيم المكتوبة هنا: `(status, index) => {             const item = catalog.items.find((product) => product.branch_options.some((opt…`. العائد/الأثر: undefined؛ لا تجمع نتائج callbacks ولا تنتظر async callbacks تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 28:** Variable declaration / تعريف `item` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `catalog.items.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(product) => product.branch_options.some((option) => option.branch_id === branch.id && option.is_available)`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.؛ `product.branch_options.some(...)`: تفحص هل أي عنصر يحقق الشرط وتتوقف عند أول نجاح. القيم المكتوبة هنا: `(option) => option.branch_id === branch.id && option.is_available`. العائد/الأثر: Boolean.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 29:** Variable declaration / تعريف `option` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `item.branch_options.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(price) => price.branch_id === branch.id`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 30:** Variable declaration / تعريف `createdAt` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `new Date(Date.now() - (index + 1) * 90000).toISOString(...)`: تنسّق التاريخ بنظام UTC. مدخلاتها: بدون مدخلات. العائد/الأثر: string؛ اليوم قد يختلف عن توقيت جهازك المحلي.؛ `Date(...)`: مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي. القيم المكتوبة هنا: `Date.now() - (index + 1) * 90000`. العائد/الأثر: Date object عند new؛ مش string تلقائيًا.؛ `Date.now(...)`: تقرأ وقت النظام الحالي كـtimestamp. مدخلاتها: بدون مدخلات. العائد/الأثر: milliseconds منذ Unix epoch، مش Date object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 31:** Variable declaration / تعريف `type` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 32:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `store.orders.push(...)`: تضيف عناصر في آخر array الأصلية. القيم المكتوبة هنا: `{                 id: store.nextOrder++, user_id: 100, tracking_token: crypto.randomUUID(), branch_id: branch.…`. العائد/الأثر: الطول الجديد؛ تعدّل الأصل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 33–40

```js
                id: store.nextOrder++, user_id: 100, tracking_token: crypto.randomUUID(), branch_id: branch.id, branch: clone(branch),
                customer_name: 'Demo Guest ' + (index + 1), customer_phone: 'Demo phone', order_type: type,
                delivery_address: type === 'delivery' ? 'Sample address, Cairo (demo)' : null,
                pickup_time: type === 'pickup' ? new Date(Date.now() + 45 * 60000).toISOString() : null,
                payment_method: 'cash', payment_status: 'unpaid', status,
                status_reason: ['cancelled', 'rejected'].includes(status) ? 'Demonstration: customer request.' : null,
                total_price: Number(option.price) + (type === 'delivery' ? Number(branch.delivery_fee) : 0),
                items: [{ id: 1, menu_item_id: item.id, item_name: item.name, menu_item: clone(item), quantity: 1, price: Number(option.price), notes: index % 2 ? 'Demo kitchen note: extra crispy.' : null }],
```

**السطر 33:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `crypto.randomUUID(...)`: يولّد UUID عشوائي في secure context؛ ليس authorization token. مدخلاتها: لا شيء العائد/الأثر: UUID string؛ `clone(...)`: ينسخ بيانات JSON-safe عبر stringify/parse لفصل المراجع؛ يفقد الأنواع غير المناسبة لـ JSON مثل Dates ككائنات/functions. القيم المكتوبة هنا: `branch`. العائد/الأثر: نسخة بيانات مفكوكة من JSON.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 34:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 35:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 36:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `new Date(Date.now() + 45 * 60000).toISOString(...)`: تنسّق التاريخ بنظام UTC. مدخلاتها: بدون مدخلات. العائد/الأثر: string؛ اليوم قد يختلف عن توقيت جهازك المحلي.؛ `Date(...)`: مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي. القيم المكتوبة هنا: `Date.now() + 45 * 60000`. العائد/الأثر: Date object عند new؛ مش string تلقائيًا.؛ `Date.now(...)`: تقرأ وقت النظام الحالي كـtimestamp. مدخلاتها: بدون مدخلات. العائد/الأثر: milliseconds منذ Unix epoch، مش Date object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 37:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 38:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `['cancelled', 'rejected'].includes(...)`: تختبر وجود قيمة في array أو نص داخل string. القيم المكتوبة هنا: `status`. العائد/الأثر: Boolean؛ مش العنصر ولا موقعه.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 39:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `branch.delivery_fee`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 40:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `clone(...)`: ينسخ بيانات JSON-safe عبر stringify/parse لفصل المراجع؛ يفقد الأنواع غير المناسبة لـ JSON مثل Dates ككائنات/functions. القيم المكتوبة هنا: `item`. العائد/الأثر: نسخة بيانات مفكوكة من JSON.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `option.price`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 41–48

```js
                created_at: createdAt, updated_at: createdAt,
                status_logs: [{ from_status: null, to_status: status, created_at: createdAt }],
            });
        });
    });
    return store;
}

```

**السطر 41:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 42:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 43:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 44:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 45:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 46:** Return / رجّع `store` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 47:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 49–56

```js
function loadStore() {
    try {
        const stored = JSON.parse(localStorage.getItem(STORE_KEY));
        if (stored?.catalog?.items?.length) return stored;
    } catch { /* Restart only corrupt demo data. */ }
    const store = initialStore();
    saveStore(store);
    return store;
```

**السطر 49:** Function / تعريف دالة `loadStore`؛ تعريفها مش تشغيلها. يقرأ store؛ لو ناقص/تالف يبني initialStore ويحفظه. مدخلاتها: لا شيء. ناتجها: store object.

**السطر 50:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة.

**السطر 51:** Variable declaration / تعريف `stored` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `JSON.parse(...)`: يفك JSON string لقيم JS؛ ممكن يرمي SyntaxError ولا يعتبر validation كامل. القيم المكتوبة هنا: `localStorage.getItem(STORE_KEY)`. العائد/الأثر: JS value؛ `localStorage.getItem(...)`: تقرأ النص المحفوظ تحت مفتاح. القيم المكتوبة هنا: `STORE_KEY`. العائد/الأثر: string أو null؛ لا تعيد object تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 52:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 53:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 54:** Variable declaration / تعريف `store` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `initialStore(...)`: يبني seed محلي من catalog ويولّد طلبات حالات مختلفة لكل فرع مع tokens وأوقات demo. مدخلاتها: لا شيء. العائد/الأثر: store object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 55:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `saveStore(...)`: يكتب store في localStorage ويحوّل فشل الامتلاء لرسالة مفهومة. القيم المكتوبة هنا: `store`. العائد/الأثر: undefined أو يرمي Error.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 56:** Return / رجّع `store` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

### السطور 57–64

```js
}

function saveStore(store) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); }
    catch { throw error('Demo storage is full. Reset the demo and try again.'); }
}

function currentUser(store) {
```

**السطر 57:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 59:** Function / تعريف دالة `saveStore`؛ تعريفها مش تشغيلها. يكتب store في localStorage ويحوّل فشل الامتلاء لرسالة مفهومة. مدخلاتها: store. ناتجها: undefined أو يرمي Error.

**السطر 60:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة. الدوال الموجودة في السطر: `localStorage.setItem(...)`: تحفظ قيمة نصية تحت مفتاح وتستبدل القديمة. القيم المكتوبة هنا: `STORE_KEY`، `JSON.stringify(store)`. العائد/الأثر: undefined؛ قد تفشل لو التخزين غير متاح.؛ `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `store`. العائد/الأثر: string أو undefined لبعض القيم. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 61:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'Demo storage is full. Reset the demo and try again.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 62:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 64:** Function / تعريف دالة `currentUser`؛ تعريفها مش تشغيلها. يطابق session key المحلي مع store.users. مدخلاتها: store. ناتجها: user object أو null.

### السطور 65–72

```js
    return store.users.find((user) => user.id === Number(localStorage.getItem(SESSION_KEY))) || null;
}

function requireRole(user, roles) {
    if (!user?.is_active || !roles.includes(user.role)) throw error('Access restricted in this demo.', {}, 403);
}

export function transitionOrder(order, data, user) {
```

**السطر 65:** Return / رجّع `store.users.find((user) => user.id === Number(localStorage.getItem(SESSION_KEY))) || null` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `store.users.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(user) => user.id === Number(localStorage.getItem(SESSION_KEY))`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `localStorage.getItem(SESSION_KEY)`. العائد/الأثر: number أو NaN.؛ `localStorage.getItem(...)`: تقرأ النص المحفوظ تحت مفتاح. القيم المكتوبة هنا: `SESSION_KEY`. العائد/الأثر: string أو null؛ لا تعيد object تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 66:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 68:** Function / تعريف دالة `requireRole`؛ تعريفها مش تشغيلها. يتأكد أن حساب الديمو active ودوره مسموح؛ ده محاكاة UX مش authorization إنتاجي. مدخلاتها: user,roles array. ناتجها: undefined لو مسموح وإلا throw Error status403.

**السطر 69:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `roles.includes(...)`: تختبر وجود قيمة في array أو نص داخل string. القيم المكتوبة هنا: `user.role`. العائد/الأثر: Boolean؛ مش العنصر ولا موقعه.؛ `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'Access restricted in this demo.'`، `{}`، `403`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 70:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 72:** Function / تعريف دالة `transitionOrder`؛ تعريفها مش تشغيلها. يتحقق من فرع الموظف وexpected_status وقواعد الحالة والسبب؛ يسجل خطوات accepted/preparing عند القبول السريع. مدخلاتها: order,data,user. ناتجها: نفس order بعد تعديله؛ يرمي Error للانتقال المرفوض.

### السطور 73–80

```js
    if (user.role !== 'admin' && Number(order.branch_id) !== Number(user.branch_id)) throw error('Order not found.', {}, 404);
    if (data.expected_status && data.expected_status !== order.status) throw error('Another demo tab already updated this order.', { expected_status: ['Refresh this order.'] }, 409);
    const transitions = { new: ['accepted', 'rejected', 'cancelled'], accepted: ['preparing', 'cancelled'], preparing: ['ready', 'cancelled'], ready: [order.order_type === 'delivery' ? 'out_for_delivery' : 'picked_up', 'cancelled'], out_for_delivery: ['completed', 'cancelled'], picked_up: ['completed'] };
    const steps = order.status === 'new' && data.status === 'preparing' ? ['accepted', 'preparing'] : [data.status];
    if (['cancelled', 'rejected'].includes(data.status) && !data.reason?.trim()) throw error('Please choose a reason.');
    for (const step of steps) {
        if (!transitions[order.status]?.includes(step)) throw error('This status transition is not available.');
        order.status_logs.push({ from_status: order.status, to_status: step, user_id: user.id, created_at: new Date().toISOString() });
```

**السطر 73:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `user.branch_id`. العائد/الأثر: number أو NaN.؛ `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'Order not found.'`، `{}`، `404`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 74:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'Another demo tab already updated this order.'`، `{ expected_status: ['Refresh this order.'] }`، `409`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 75:** Variable declaration / تعريف `transitions` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة Object حقولها `new`، `accepted`، `preparing`، `ready`، `out_for_delivery`، `picked_up`.

**السطر 76:** Variable declaration / تعريف `steps` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 77:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `['cancelled', 'rejected'].includes(...)`: تختبر وجود قيمة في array أو نص داخل string. القيم المكتوبة هنا: `data.status`. العائد/الأثر: Boolean؛ مش العنصر ولا موقعه.؛ `data.reason?.trim(...)`: تشيل whitespace من أول وآخر النص فقط. مدخلاتها: بدون مدخلات. العائد/الأثر: نص جديد؛ لا تغيّر النص الأصلي.؛ `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'Please choose a reason.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 78:** Variable declaration / تعريف `step` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 79:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `transitions[order.status]?.includes(...)`: تختبر وجود قيمة في array أو نص داخل string. القيم المكتوبة هنا: `step`. العائد/الأثر: Boolean؛ مش العنصر ولا موقعه.؛ `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'This status transition is not available.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 80:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `order.status_logs.push(...)`: تضيف عناصر في آخر array الأصلية. القيم المكتوبة هنا: `{ from_status: order.status, to_status: step, user_id: user.id, created_at: new Date().toISOString() }`. العائد/الأثر: الطول الجديد؛ تعدّل الأصل.؛ `new Date().toISOString(...)`: تنسّق التاريخ بنظام UTC. مدخلاتها: بدون مدخلات. العائد/الأثر: string؛ اليوم قد يختلف عن توقيت جهازك المحلي.؛ `Date(...)`: مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي. مدخلاتها: قيمة تاريخ اختيارية. العائد/الأثر: Date object عند new؛ مش string تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 81–88

```js
        order.status = step;
    }
    order.status_reason = ['cancelled', 'rejected'].includes(data.status) ? data.reason : null;
    order.updated_at = new Date().toISOString();
    return order;
}

export function calculateOrder(data, catalog) {
```

**السطر 81:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 82:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 83:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods. الدوال الموجودة في السطر: `['cancelled', 'rejected'].includes(...)`: تختبر وجود قيمة في array أو نص داخل string. القيم المكتوبة هنا: `data.status`. العائد/الأثر: Boolean؛ مش العنصر ولا موقعه.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 84:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods. الدوال الموجودة في السطر: `new Date().toISOString(...)`: تنسّق التاريخ بنظام UTC. مدخلاتها: بدون مدخلات. العائد/الأثر: string؛ اليوم قد يختلف عن توقيت جهازك المحلي.؛ `Date(...)`: مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي. مدخلاتها: قيمة تاريخ اختيارية. العائد/الأثر: Date object عند new؛ مش string تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 85:** Return / رجّع `order` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 86:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 88:** Function / تعريف دالة `calculateOrder`؛ تعريفها مش تشغيلها. يراجع فرع/طريقة/عميل/عناوين/كمية وملاحظات ويعيد حساب السعر من catalog، مش من أسعار مرسلة من العميل. مدخلاتها: data: payload؛ catalog. ناتجها: {branch,items,total_price}.

### السطور 89–96

```js
    const branch = catalog.branches.find((entry) => entry.id === Number(data.branch_id) && entry.is_active !== false);
    if (!branch || (data.order_type === 'delivery' && !branch.delivery_enabled)) throw error('Choose an available branch.');
    if (!['delivery', 'pickup'].includes(data.order_type)) throw error('Choose delivery or pickup.');
    if (!data.customer_name?.trim() || !data.customer_phone?.trim()) throw error('Enter a demo name and phone.');
    if (data.order_type === 'delivery' && !data.delivery_address?.trim()) throw error('Enter a sample delivery address.');
    if (!data.items?.length) throw error('Add an item before ordering.');
    const items = data.items.map((line, index) => {
        const product = catalog.items.find((item) => item.id === Number(line.menu_item_id) && item.is_active !== false);
```

**السطر 89:** Variable declaration / تعريف `branch` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `catalog.branches.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(entry) => entry.id === Number(data.branch_id) && entry.is_active !== false`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `data.branch_id`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 90:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'Choose an available branch.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 91:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `['delivery', 'pickup'].includes(...)`: تختبر وجود قيمة في array أو نص داخل string. القيم المكتوبة هنا: `data.order_type`. العائد/الأثر: Boolean؛ مش العنصر ولا موقعه.؛ `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'Choose delivery or pickup.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 92:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `data.customer_name?.trim(...)`: تشيل whitespace من أول وآخر النص فقط. مدخلاتها: بدون مدخلات. العائد/الأثر: نص جديد؛ لا تغيّر النص الأصلي.؛ `data.customer_phone?.trim(...)`: تشيل whitespace من أول وآخر النص فقط. مدخلاتها: بدون مدخلات. العائد/الأثر: نص جديد؛ لا تغيّر النص الأصلي.؛ `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'Enter a demo name and phone.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 93:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `data.delivery_address?.trim(...)`: تشيل whitespace من أول وآخر النص فقط. مدخلاتها: بدون مدخلات. العائد/الأثر: نص جديد؛ لا تغيّر النص الأصلي.؛ `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'Enter a sample delivery address.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 94:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'Add an item before ordering.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 95:** Variable declaration / تعريف `items` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `data.items.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(line, index) => {         const product = catalog.items.find((item) => item.id === Number(line.menu_item_id) …`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 96:** Variable declaration / تعريف `product` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `catalog.items.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(item) => item.id === Number(line.menu_item_id) && item.is_active !== false`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `line.menu_item_id`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 97–104

```js
        const option = product?.branch_options.find((price) => price.branch_id === branch.id);
        if (!option?.is_available) throw error('One of these items is unavailable.');
        if (!Number.isInteger(Number(line.quantity)) || line.quantity < 1 || line.quantity > 20) throw error('Quantity must be between 1 and 20.');
        if ((line.notes || '').length > 200) throw error('Kitchen notes must be 200 characters or fewer.');
        return { id: index + 1, menu_item_id: product.id, menu_item: clone(product), item_name: product.name, price: Number(option.price), quantity: Number(line.quantity), notes: line.notes || null };
    });
    return { branch: clone(branch), items, total_price: items.reduce((total, line) => total + line.price * line.quantity, 0) + (data.order_type === 'delivery' ? Number(branch.delivery_fee) : 0) };
}
```

**السطر 97:** Variable declaration / تعريف `option` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `product?.branch_options.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(price) => price.branch_id === branch.id`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 98:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'One of these items is unavailable.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 99:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `Number.isInteger(...)`: تفحص أن القيمة number صحيحة. القيم المكتوبة هنا: `Number(line.quantity)`. العائد/الأثر: Boolean؛ مش فحص حدود الكمية وحده.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `line.quantity`. العائد/الأثر: number أو NaN.؛ `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'Quantity must be between 1 and 20.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 100:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'Kitchen notes must be 200 characters or fewer.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 101:** Return / رجّع `{ id: index + 1, menu_item_id: product.id, menu_item: clone(product), item_name: product.name, price: Number(option.price), quantity: Number(line.quantity), notes: line.notes || null }` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `clone(...)`: ينسخ بيانات JSON-safe عبر stringify/parse لفصل المراجع؛ يفقد الأنواع غير المناسبة لـ JSON مثل Dates ككائنات/functions. القيم المكتوبة هنا: `product`. العائد/الأثر: نسخة بيانات مفكوكة من JSON.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `line.quantity`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 102:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 103:** Return / رجّع `{ branch: clone(branch), items, total_price: items.reduce((total, line) => total + line.price * line.quantity, 0) + (data.order_type === 'delivery' ? Number(branch.delivery_fee) : 0) }` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `clone(...)`: ينسخ بيانات JSON-safe عبر stringify/parse لفصل المراجع؛ يفقد الأنواع غير المناسبة لـ JSON مثل Dates ككائنات/functions. القيم المكتوبة هنا: `branch`. العائد/الأثر: نسخة بيانات مفكوكة من JSON.؛ `items.reduce(...)`: تجمع عناصر في نتيجة متراكمة. القيم المكتوبة هنا: `(total, line) => total + line.price * line.quantity`، `0`. العائد/الأثر: الناتج النهائي؛ سلة فاضية مع البداية0 ترجع0.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `branch.delivery_fee`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 104:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 105–112

```js

function adminItem(item, catalog) {
    return { ...item, is_active: item.is_active !== false, category: catalog.categories.find((category) => category.id === item.category_id), branches: item.branch_options.map((option) => ({ ...catalog.branches.find((branch) => branch.id === option.branch_id), pivot: option })) };
}

function audit(store, user, action, subjectId) {
    store.logs.unshift({ id: store.logs.length + 1, user, action, subject_type: 'DemoRecord', subject_id: subjectId, created_at: new Date().toISOString() });
}
```

**السطر 106:** Function / تعريف دالة `adminItem`؛ تعريفها مش تشغيلها. يحوّل item لواجهة admin: category object وbranches تحمل pivot من branch_options. مدخلاتها: item,catalog. ناتجها: object موسّع.

**السطر 107:** Return / رجّع `{ ...item, is_active: item.is_active !== false, category: catalog.categories.find((category) => category.id === item.category_id), branches: item.branch_options.map((option) => ({ ...catalog.branches.find((branch) => bra…` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `catalog.categories.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(category) => category.id === item.category_id`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.؛ `item.branch_options.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(option) => ({ ...catalog.branches.find((branch) => branch.id === option.branch_id), pivot: option })`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `catalog.branches.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(branch) => branch.id === option.branch_id`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 108:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 110:** Function / تعريف دالة `audit`؛ تعريفها مش تشغيلها. يضيف سجل نشاط في أول store.logs بالوقت والمستخدم والإجراء. مدخلاتها: store,user,action,subjectId. ناتجها: undefined.

**السطر 111:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `store.logs.unshift(...)`: يضيف عناصر في أول نفس القائمة، لعرض الأحدث أولًا. القيم المكتوبة هنا: `{ id: store.logs.length + 1, user, action, subject_type: 'DemoRecord', subject_id: subjectId, created_at: new …`. العائد/الأثر: الطول الجديد.؛ `new Date().toISOString(...)`: تنسّق التاريخ بنظام UTC. مدخلاتها: بدون مدخلات. العائد/الأثر: string؛ اليوم قد يختلف عن توقيت جهازك المحلي.؛ `Date(...)`: مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي. مدخلاتها: قيمة تاريخ اختيارية. العائد/الأثر: Date object عند new؛ مش string تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 112:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 113–120

```js

export async function demoFetch(url, options = {}) {
    const location = new URL(url, 'https://demo.local');
    const path = location.pathname;
    const method = options.method || 'GET';
    const store = loadStore();
    const user = currentUser(store);
    const data = options.body instanceof FormData ? Object.fromEntries(options.body.entries()) : options.body ? JSON.parse(options.body) : {};
```

**السطر 114:** Function / تعريف دالة `demoFetch`؛ تعريفها مش تشغيلها. Router محلي يختار من url/method ويطبق منطق API demo ثم يرجع data مباشرة. لا يرجع Response مثل fetch، ولا يجري network request. مدخلاتها: url,options={}؛ body JSON أو FormData. ناتجها: Promise<payload> أو rejection بخطأ demo.

**السطر 115:** Variable declaration / تعريف `location` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `URL(...)`: تحلل عنوانًا وتجهز حقوله. القيم المكتوبة هنا: `url`، `'https://demo.local'`. العائد/الأثر: URL object، ولا تجلب المورد وحدها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 116:** Variable declaration / تعريف `path` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 117:** Variable declaration / تعريف `method` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 118:** Variable declaration / تعريف `store` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `loadStore(...)`: يقرأ store؛ لو ناقص/تالف يبني initialStore ويحفظه. مدخلاتها: لا شيء. العائد/الأثر: store object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 119:** Variable declaration / تعريف `user` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `currentUser(...)`: يطابق session key المحلي مع store.users. القيم المكتوبة هنا: `store`. العائد/الأثر: user object أو null.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 120:** Variable declaration / تعريف `data` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Object.fromEntries(...)`: عكس entries: يبني object من أزواج key/value، مثل تحويل entries FormData أو فلاتر غير فاضية. القيم المكتوبة هنا: `options.body.entries()`. العائد/الأثر: object.؛ `options.body.entries(...)`: تجهز أزواج key/value من المصدر. مدخلاتها: object مع Object.entries، أو بدون arguments على Map. العائد/الأثر: array أزواج أو iterator حسب المستقبِل.؛ `JSON.parse(...)`: يفك JSON string لقيم JS؛ ممكن يرمي SyntaxError ولا يعتبر validation كامل. القيم المكتوبة هنا: `options.body`. العائد/الأثر: JS value. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 121–128

```js
    const catalog = store.catalog;
    const persist = (result) => { saveStore(store); return clone(result); };

    if (path === '/api/menu') return clone({ ...catalog, branches: catalog.branches.filter((branch) => branch.is_active !== false), categories: catalog.categories.filter((category) => category.is_active !== false), items: catalog.items.filter((item) => item.is_active !== false && catalog.categories.find((category) => category.id === item.category_id)?.is_active !== false) });
    if (path === '/api/auth/me') return { user };
    if (path === '/api/auth/logout') { localStorage.removeItem(SESSION_KEY); return { user: null }; }
    if (path === '/api/auth/login') {
        const account = store.users.find((entry) => entry.email === data.email && entry.is_active);
```

**السطر 121:** Variable declaration / تعريف `catalog` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 122:** Variable declaration / تعريف `persist` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `persist` هنا: helper داخل demoFetch يحفظ store ثم يرجع clone من النتيجة حتى ما يبقاش المستدعي ماسك نفس المرجع. المدخلات: result.. الناتج/الأثر: نسخة result.. الدوال الموجودة في السطر: `saveStore(...)`: يكتب store في localStorage ويحوّل فشل الامتلاء لرسالة مفهومة. القيم المكتوبة هنا: `store`. العائد/الأثر: undefined أو يرمي Error.؛ `clone(...)`: ينسخ بيانات JSON-safe عبر stringify/parse لفصل المراجع؛ يفقد الأنواع غير المناسبة لـ JSON مثل Dates ككائنات/functions. القيم المكتوبة هنا: `result`. العائد/الأثر: نسخة بيانات مفكوكة من JSON.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 124:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `clone(...)`: ينسخ بيانات JSON-safe عبر stringify/parse لفصل المراجع؛ يفقد الأنواع غير المناسبة لـ JSON مثل Dates ككائنات/functions. القيم المكتوبة هنا: `{ ...catalog, branches: catalog.branches.filter((branch) => branch.is_active !== false), categories: catalog.c…`. العائد/الأثر: نسخة بيانات مفكوكة من JSON.؛ `catalog.branches.filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `(branch) => branch.is_active !== false`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.؛ `catalog.categories.filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `(category) => category.is_active !== false`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.؛ `catalog.items.filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `(item) => item.is_active !== false && catalog.categories.find((category) => category.id === item.category_id)?…`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.؛ `catalog.categories.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(category) => category.id === item.category_id`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 125:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 126:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `localStorage.removeItem(...)`: تمسح مفتاحًا محددًا فقط. القيم المكتوبة هنا: `SESSION_KEY`. العائد/الأثر: undefined؛ ليست حذف قاعدة بيانات Laravel.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 127:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 128:** Variable declaration / تعريف `account` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `store.users.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(entry) => entry.email === data.email && entry.is_active`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 129–136

```js
        if (!account) throw error('Use one of the demo account buttons.');
        localStorage.setItem(SESSION_KEY, String(account.id));
        return { user: clone(account) };
    }
    if (path === '/api/auth/register') throw error('Use the Demo Customer account. Registration is disabled for this preview.');
    if (path.startsWith('/api/payments')) throw error('Payments are disabled. No money is collected in this demo.');

    if (path === '/api/orders' && method === 'POST') {
```

**السطر 129:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'Use one of the demo account buttons.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 130:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `localStorage.setItem(...)`: تحفظ قيمة نصية تحت مفتاح وتستبدل القديمة. القيم المكتوبة هنا: `SESSION_KEY`، `String(account.id)`. العائد/الأثر: undefined؛ قد تفشل لو التخزين غير متاح.؛ `String(...)`: تحوّل قيمة إلى نص عند استدعائها بدون new. القيم المكتوبة هنا: `account.id`. العائد/الأثر: string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 131:** Return / رجّع `{ user: clone(account) }` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `clone(...)`: ينسخ بيانات JSON-safe عبر stringify/parse لفصل المراجع؛ يفقد الأنواع غير المناسبة لـ JSON مثل Dates ككائنات/functions. القيم المكتوبة هنا: `account`. العائد/الأثر: نسخة بيانات مفكوكة من JSON.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 132:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 133:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'Use the Demo Customer account. Registration is disabled for this preview.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 134:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `path.startsWith(...)`: تفحص بداية النص. القيم المكتوبة هنا: `'/api/payments'`. العائد/الأثر: Boolean؛ لا تتحقق من وجود ملف.؛ `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'Payments are disabled. No money is collected in this demo.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 136:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

### السطور 137–144

```js
        const prepared = calculateOrder(data, catalog);
        if (data.order_type === 'pickup' && (!Number.isFinite(Date.parse(data.pickup_time)) || Date.parse(data.pickup_time) < Date.now() + Number(store.settings.minimum_pickup_prep_minutes) * 60000)) throw error('Choose a pickup time with enough preparation time.');
        const timestamp = new Date().toISOString();
        const order = { ...data, ...prepared, id: store.nextOrder++, branch_id: prepared.branch.id, user_id: user?.id || null, tracking_token: crypto.randomUUID(), payment_method: 'cash', payment_status: 'unpaid', status: 'new', created_at: timestamp, updated_at: timestamp, status_logs: [{ from_status: null, to_status: 'new', created_at: timestamp }] };
        store.orders.unshift(order);
        return persist({ order, tracking_url: '/orders/' + order.tracking_token });
    }
    if (path.startsWith('/api/orders/track/')) {
```

**السطر 137:** Variable declaration / تعريف `prepared` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `calculateOrder(...)`: يراجع فرع/طريقة/عميل/عناوين/كمية وملاحظات ويعيد حساب السعر من catalog، مش من أسعار مرسلة من العميل. القيم المكتوبة هنا: `data`، `catalog`. العائد/الأثر: {branch,items,total_price}.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 138:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `Number.isFinite(...)`: تفحص رقمًا محدودًا بدون تحويل النصوص. القيم المكتوبة هنا: `Date.parse(data.pickup_time)`. العائد/الأثر: Boolean.؛ `Date.parse(...)`: تحلّل نص JSON لقيمة JavaScript. القيم المكتوبة هنا: `data.pickup_time`. العائد/الأثر: قيمة object/array/primitive أو خطأ SyntaxError.؛ `Date.now(...)`: تقرأ وقت النظام الحالي كـtimestamp. مدخلاتها: بدون مدخلات. العائد/الأثر: milliseconds منذ Unix epoch، مش Date object.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `store.settings.minimum_pickup_prep_minutes`. العائد/الأثر: number أو NaN.؛ `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'Choose a pickup time with enough preparation time.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 139:** Variable declaration / تعريف `timestamp` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `new Date().toISOString(...)`: تنسّق التاريخ بنظام UTC. مدخلاتها: بدون مدخلات. العائد/الأثر: string؛ اليوم قد يختلف عن توقيت جهازك المحلي.؛ `Date(...)`: مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي. مدخلاتها: قيمة تاريخ اختيارية. العائد/الأثر: Date object عند new؛ مش string تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 140:** Variable declaration / تعريف `order` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة Object حقولها `id`، `branch_id`، `user_id`، `tracking_token`، `payment_method`، `payment_status`، `status`، `created_at`، `updated_at`، `status_logs`. الدوال الموجودة في السطر: `crypto.randomUUID(...)`: يولّد UUID عشوائي في secure context؛ ليس authorization token. مدخلاتها: لا شيء العائد/الأثر: UUID string. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 141:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `store.orders.unshift(...)`: يضيف عناصر في أول نفس القائمة، لعرض الأحدث أولًا. القيم المكتوبة هنا: `order`. العائد/الأثر: الطول الجديد.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 142:** Return / رجّع `persist({ order, tracking_url: '/orders/' + order.tracking_token })` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `persist(...)`: helper داخل demoFetch يحفظ store ثم يرجع clone من النتيجة حتى ما يبقاش المستدعي ماسك نفس المرجع. القيم المكتوبة هنا: `{ order, tracking_url: '/orders/' + order.tracking_token }`. العائد/الأثر: نسخة result.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 143:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 144:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `path.startsWith(...)`: تفحص بداية النص. القيم المكتوبة هنا: `'/api/orders/track/'`. العائد/الأثر: Boolean؛ لا تتحقق من وجود ملف.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 145–152

```js
        const order = store.orders.find((entry) => entry.tracking_token === path.split('/').pop());
        if (!order) throw error('Order not found.', {}, 404);
        return clone({ order });
    }
    if (path === '/api/orders/history') {
        if (!user) throw error('Sign in with the demo customer account.', {}, 401);
        return clone({ orders: store.orders.filter((order) => order.user_id === user.id) });
    }
```

**السطر 145:** Variable declaration / تعريف `order` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `store.orders.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(entry) => entry.tracking_token === path.split('/').pop()`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.؛ `path.split('/').pop(...)`: تشيل آخر عنصر من array الأصلية. مدخلاتها: بدون arguments. العائد/الأثر: العنصر المحذوف أو undefined.؛ `path.split(...)`: تقسم النص لأجزاء. القيم المكتوبة هنا: `'/'`. العائد/الأثر: array نصوص.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 146:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'Order not found.'`، `{}`، `404`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 147:** Return / رجّع `clone({ order })` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `clone(...)`: ينسخ بيانات JSON-safe عبر stringify/parse لفصل المراجع؛ يفقد الأنواع غير المناسبة لـ JSON مثل Dates ككائنات/functions. القيم المكتوبة هنا: `{ order }`. العائد/الأثر: نسخة بيانات مفكوكة من JSON.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 148:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 149:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 150:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'Sign in with the demo customer account.'`، `{}`، `401`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 151:** Return / رجّع `clone({ orders: store.orders.filter((order) => order.user_id === user.id) })` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `clone(...)`: ينسخ بيانات JSON-safe عبر stringify/parse لفصل المراجع؛ يفقد الأنواع غير المناسبة لـ JSON مثل Dates ككائنات/functions. القيم المكتوبة هنا: `{ orders: store.orders.filter((order) => order.user_id === user.id) }`. العائد/الأثر: نسخة بيانات مفكوكة من JSON.؛ `store.orders.filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `(order) => order.user_id === user.id`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 152:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 153–160

```js
    if (/^\/api\/orders\/\d+\/reorder$/.test(path)) {
        const order = store.orders.find((entry) => entry.id === Number(path.split('/')[3]) && entry.user_id === user?.id);
        if (!order) throw error('Order not found.', {}, 404);
        const lines = order.items.flatMap((line) => {
            const item = catalog.items.find((entry) => entry.id === line.menu_item_id && entry.is_active !== false);
            const option = item?.branch_options.find((entry) => entry.branch_id === order.branch_id && entry.is_available);
            return option ? [{ id: item.id, name: item.name, description: item.description, image_src: item.image_path, price: Number(option.price), quantity: line.quantity, notes: line.notes, branch_id: order.branch_id, branch_name: order.branch.name }] : [];
        });
```

**السطر 153:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `/^\/api\/orders\/\d+\/reorder$/.test(...)`: RegExp.test تفحص تطابق النص؛ Node test يسجل اختبارًا. القيم المكتوبة هنا: `path`. العائد/الأثر: Boolean في regex؛ نتيجة تسجيل اختبار في Node.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 154:** Variable declaration / تعريف `order` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `store.orders.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(entry) => entry.id === Number(path.split('/')[3]) && entry.user_id === user?.id`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `path.split('/')[3]`. العائد/الأثر: number أو NaN.؛ `path.split(...)`: تقسم النص لأجزاء. القيم المكتوبة هنا: `'/'`. العائد/الأثر: array نصوص.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 155:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'Order not found.'`، `{}`، `404`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 156:** Variable declaration / تعريف `lines` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `order.items.flatMap(...)`: تحوّل العناصر ثم تفرد مستوى array واحد. القيم المكتوبة هنا: `(line) => {             const item = catalog.items.find((entry) => entry.id === line.menu_item_id && entry.is_…`. العائد/الأثر: array جديدة؛ [] من callback تشيل العنصر من الناتج.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 157:** Variable declaration / تعريف `item` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `catalog.items.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(entry) => entry.id === line.menu_item_id && entry.is_active !== false`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 158:** Variable declaration / تعريف `option` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `item?.branch_options.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(entry) => entry.branch_id === order.branch_id && entry.is_available`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 159:** Return / رجّع `option ? [{ id: item.id, name: item.name, description: item.description, image_src: item.image_path, price: Number(option.price), quantity: line.quantity, notes: line.notes, branch_id: order.branch_id, branch_name: order…` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `option.price`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 160:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 161–168

```js
        return { branch_id: order.branch_id, order_type: order.order_type, cart_items: lines, skipped_items: order.items.length - lines.length };
    }
    if (path.startsWith('/api/staff/')) {
        requireRole(user, ['staff', 'admin']);
        const visible = store.orders.filter((order) => user.role === 'admin' || order.branch_id === user.branch_id);
        if (path === '/api/staff/orders') {
            return clone({ orders: visible.filter((order) => (!location.searchParams.get('branch_id') || order.branch_id === Number(location.searchParams.get('branch_id'))) && (!location.searchParams.get('date') || order.created_at.slice(0, 10) === location.searchParams.get('date'))), timing: { green_minutes: Number(store.settings.order_promise_minutes), orange_minutes: 6 } });
        }
```

**السطر 161:** Return / رجّع `{ branch_id: order.branch_id, order_type: order.order_type, cart_items: lines, skipped_items: order.items.length - lines.length }` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 162:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 163:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `path.startsWith(...)`: تفحص بداية النص. القيم المكتوبة هنا: `'/api/staff/'`. العائد/الأثر: Boolean؛ لا تتحقق من وجود ملف.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 164:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `requireRole(...)`: يتأكد أن حساب الديمو active ودوره مسموح؛ ده محاكاة UX مش authorization إنتاجي. القيم المكتوبة هنا: `user`، `['staff', 'admin']`. العائد/الأثر: undefined لو مسموح وإلا throw Error status403.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 165:** Variable declaration / تعريف `visible` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `store.orders.filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `(order) => user.role === 'admin' || order.branch_id === user.branch_id`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 166:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 167:** Return / رجّع `clone({ orders: visible.filter((order) => (!location.searchParams.get('branch_id') || order.branch_id === Number(location.searchParams.get('branch_id'))) && (!location.searchParams.get('date') || order.created_at.slice(0…` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `clone(...)`: ينسخ بيانات JSON-safe عبر stringify/parse لفصل المراجع؛ يفقد الأنواع غير المناسبة لـ JSON مثل Dates ككائنات/functions. القيم المكتوبة هنا: `{ orders: visible.filter((order) => (!location.searchParams.get('branch_id') || order.branch_id === Number(loc…`. العائد/الأثر: نسخة بيانات مفكوكة من JSON.؛ `visible.filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `(order) => (!location.searchParams.get('branch_id') || order.branch_id === Number(location.searchParams.get('b…`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.؛ `location.searchParams.get(...)`: تقرأ قيمة query parameter. القيم المكتوبة هنا: `'date'`. العائد/الأثر: string أو null؛ لا تجلب شبكة.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `store.settings.order_promise_minutes`. العائد/الأثر: number أو NaN.؛ `order.created_at.slice(...)`: تأخذ جزءًا بدون تعديل الأصل. القيم المكتوبة هنا: `0`، `10`. العائد/الأثر: نسخة array جزئية أو نص جزئي حسب المستقبِل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 168:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 169–176

```js
        const order = visible.find((entry) => entry.id === Number(path.split('/')[4]));
        if (!order) throw error('Order not found.', {}, 404);
        if (method === 'PATCH') return persist({ message: 'Demo order updated.', order: transitionOrder(order, data, user) });
        return clone({ order });
    }
    if (path.startsWith('/api/admin/')) {
        requireRole(user, ['admin']);
        const section = path.split('/')[3];
```

**السطر 169:** Variable declaration / تعريف `order` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `visible.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(entry) => entry.id === Number(path.split('/')[4])`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `path.split('/')[4]`. العائد/الأثر: number أو NaN.؛ `path.split(...)`: تقسم النص لأجزاء. القيم المكتوبة هنا: `'/'`. العائد/الأثر: array نصوص.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 170:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'Order not found.'`، `{}`، `404`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 171:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `persist(...)`: helper داخل demoFetch يحفظ store ثم يرجع clone من النتيجة حتى ما يبقاش المستدعي ماسك نفس المرجع. القيم المكتوبة هنا: `{ message: 'Demo order updated.', order: transitionOrder(order, data, user) }`. العائد/الأثر: نسخة result.؛ `transitionOrder(...)`: يتحقق من فرع الموظف وexpected_status وقواعد الحالة والسبب؛ يسجل خطوات accepted/preparing عند القبول السريع. القيم المكتوبة هنا: `order`، `data`، `user`. العائد/الأثر: نفس order بعد تعديله؛ يرمي Error للانتقال المرفوض.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 172:** Return / رجّع `clone({ order })` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `clone(...)`: ينسخ بيانات JSON-safe عبر stringify/parse لفصل المراجع؛ يفقد الأنواع غير المناسبة لـ JSON مثل Dates ككائنات/functions. القيم المكتوبة هنا: `{ order }`. العائد/الأثر: نسخة بيانات مفكوكة من JSON.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 173:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 174:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `path.startsWith(...)`: تفحص بداية النص. القيم المكتوبة هنا: `'/api/admin/'`. العائد/الأثر: Boolean؛ لا تتحقق من وجود ملف.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 175:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `requireRole(...)`: يتأكد أن حساب الديمو active ودوره مسموح؛ ده محاكاة UX مش authorization إنتاجي. القيم المكتوبة هنا: `user`، `['admin']`. العائد/الأثر: undefined لو مسموح وإلا throw Error status403.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 176:** Variable declaration / تعريف `section` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `path.split(...)`: تقسم النص لأجزاء. القيم المكتوبة هنا: `'/'`. العائد/الأثر: array نصوص.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 177–184

```js
        const id = Number(path.split('/')[4]);
        if (section === 'catalog') return clone({ ...catalog, items: catalog.items.map((item) => adminItem(item, catalog)) });
        if (section === 'dashboard') {
            const orders = store.orders.filter((order) => order.created_at.slice(0, 10) === new Date().toISOString().slice(0, 10));
            const active = orders.filter((order) => !['cancelled', 'rejected'].includes(order.status));
            const sales = active.reduce((sum, order) => sum + Number(order.total_price), 0);
            const byStatus = {}; const best = {};
            orders.forEach((order) => { byStatus[order.status] = (byStatus[order.status] || 0) + 1; });
```

**السطر 177:** Variable declaration / تعريف `id` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `path.split('/')[4]`. العائد/الأثر: number أو NaN.؛ `path.split(...)`: تقسم النص لأجزاء. القيم المكتوبة هنا: `'/'`. العائد/الأثر: array نصوص.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 178:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `clone(...)`: ينسخ بيانات JSON-safe عبر stringify/parse لفصل المراجع؛ يفقد الأنواع غير المناسبة لـ JSON مثل Dates ككائنات/functions. القيم المكتوبة هنا: `{ ...catalog, items: catalog.items.map((item) => adminItem(item, catalog)) }`. العائد/الأثر: نسخة بيانات مفكوكة من JSON.؛ `catalog.items.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(item) => adminItem(item, catalog)`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `adminItem(...)`: يحوّل item لواجهة admin: category object وbranches تحمل pivot من branch_options. القيم المكتوبة هنا: `item`، `catalog`. العائد/الأثر: object موسّع.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 179:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 180:** Variable declaration / تعريف `orders` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `store.orders.filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `(order) => order.created_at.slice(0, 10) === new Date().toISOString().slice(0, 10)`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.؛ `order.created_at.slice(...)`: تأخذ جزءًا بدون تعديل الأصل. القيم المكتوبة هنا: `0`، `10`. العائد/الأثر: نسخة array جزئية أو نص جزئي حسب المستقبِل.؛ `new Date().toISOString().slice(...)`: تأخذ جزءًا بدون تعديل الأصل. القيم المكتوبة هنا: `0`، `10`. العائد/الأثر: نسخة array جزئية أو نص جزئي حسب المستقبِل.؛ `new Date().toISOString(...)`: تنسّق التاريخ بنظام UTC. مدخلاتها: بدون مدخلات. العائد/الأثر: string؛ اليوم قد يختلف عن توقيت جهازك المحلي.؛ `Date(...)`: مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي. مدخلاتها: قيمة تاريخ اختيارية. العائد/الأثر: Date object عند new؛ مش string تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 181:** Variable declaration / تعريف `active` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `orders.filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `(order) => !['cancelled', 'rejected'].includes(order.status)`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.؛ `['cancelled', 'rejected'].includes(...)`: تختبر وجود قيمة في array أو نص داخل string. القيم المكتوبة هنا: `order.status`. العائد/الأثر: Boolean؛ مش العنصر ولا موقعه.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 182:** Variable declaration / تعريف `sales` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `active.reduce(...)`: تجمع عناصر في نتيجة متراكمة. القيم المكتوبة هنا: `(sum, order) => sum + Number(order.total_price)`، `0`. العائد/الأثر: الناتج النهائي؛ سلة فاضية مع البداية0 ترجع0.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `order.total_price`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 183:** Variable declaration / تعريف `byStatus`، `best` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة Object حقولها . القيمة Object حقولها .

**السطر 184:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `orders.forEach(...)`: تنفّذ callback لكل عنصر لأثر جانبي. القيم المكتوبة هنا: `(order) => { byStatus[order.status] = (byStatus[order.status] || 0) + 1; }`. العائد/الأثر: undefined؛ لا تجمع نتائج callbacks ولا تنتظر async callbacks تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 185–192

```js
            active.forEach((order) => order.items.forEach((line) => { best[line.item_name] = (best[line.item_name] || 0) + line.quantity; }));
            return { summary: { sales, orders: active.length, average: active.length ? sales / active.length : 0 }, by_status: byStatus, by_branch: catalog.branches.map((branch) => ({ name: branch.name, sales: active.filter((order) => order.branch_id === branch.id).reduce((sum, order) => sum + order.total_price, 0) })), best_items: Object.entries(best).map(([item_name, quantity]) => ({ item_name, quantity })).sort((a, b) => b.quantity - a.quantity).slice(0, 8) };
        }
        if (method !== 'GET') {
            if (section === 'products') {
                const item = catalog.items.find((entry) => entry.id === id);
                if (method === 'DELETE') { if (!item) throw error('Product not found.'); item.is_active = false; }
                else {
```

**السطر 185:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `active.forEach(...)`: تنفّذ callback لكل عنصر لأثر جانبي. القيم المكتوبة هنا: `(order) => order.items.forEach((line) => { best[line.item_name] = (best[line.item_name] || 0) + line.quantity;…`. العائد/الأثر: undefined؛ لا تجمع نتائج callbacks ولا تنتظر async callbacks تلقائيًا.؛ `order.items.forEach(...)`: تنفّذ callback لكل عنصر لأثر جانبي. القيم المكتوبة هنا: `(line) => { best[line.item_name] = (best[line.item_name] || 0) + line.quantity; }`. العائد/الأثر: undefined؛ لا تجمع نتائج callbacks ولا تنتظر async callbacks تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 186:** Return / رجّع `{ summary: { sales, orders: active.length, average: active.length ? sales / active.length : 0 }, by_status: byStatus, by_branch: catalog.branches.map((branch) => ({ name: branch.name, sales: active.filter((order) => orde…` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `catalog.branches.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(branch) => ({ name: branch.name, sales: active.filter((order) => order.branch_id === branch.id).reduce((sum, …`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `active.filter((order) => order.branch_id === branch.id).reduce(...)`: تجمع عناصر في نتيجة متراكمة. القيم المكتوبة هنا: `(sum, order) => sum + order.total_price`، `0`. العائد/الأثر: الناتج النهائي؛ سلة فاضية مع البداية0 ترجع0.؛ `active.filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `(order) => order.branch_id === branch.id`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.؛ `Object.entries(best).map(([item_name, quantity]) => ({ item_name, quantity })).sort((a, b) => b.quantity - a.quantity).slice(...)`: تأخذ جزءًا بدون تعديل الأصل. القيم المكتوبة هنا: `0`، `8`. العائد/الأثر: نسخة array جزئية أو نص جزئي حسب المستقبِل.؛ `Object.entries(best).map(([item_name, quantity]) => ({ item_name, quantity })).sort(...)`: ترتّب القائمة باستخدام المقارنة. القيم المكتوبة هنا: `(a, b) => b.quantity - a.quantity`. العائد/الأثر: نفس array بعد تعديل ترتيبها؛ ليست نسخة مستقلة.؛ `Object.entries(best).map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `([item_name, quantity]) => ({ item_name, quantity })`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `Object.entries(...)`: يحوّل الخصائص الذاتية القابلة للتعداد لأزواج [key,value]؛ مفيد لبناء FormData وفلاتر URL. القيم المكتوبة هنا: `best`. العائد/الأثر: array أزواج.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 187:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 188:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 189:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 190:** Variable declaration / تعريف `item` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `catalog.items.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(entry) => entry.id === id`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 191:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'Product not found.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 192:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

### السطور 193–200

```js
                    const optionsList = typeof data.branch_options === 'string' ? JSON.parse(data.branch_options) : data.branch_options;
                    const category = catalog.categories.find((entry) => entry.id === Number(data.category_id));
                    if (!data.name?.trim() || !category || !optionsList?.length) throw error('Complete the product details.');
                    const updated = { ...item, ...data, id: item?.id || Math.max(...catalog.items.map((entry) => entry.id)) + 1, category_id: category.id, category: category.name, category_slug: category.slug, is_active: data.is_active === true || data.is_active === '1', display_order: Number(data.display_order), branch_options: optionsList.map((option) => ({ ...option, branch_id: Number(option.branch_id), price: Number(option.price) })) };
                    delete updated.image;
                    if (data.image instanceof Blob && data.image.size) throw error('Photo uploads are available in the full website. Demo product edits work without a file.');
                    if (item) Object.assign(item, updated); else catalog.items.push(updated);
                }
```

**السطر 193:** Variable declaration / تعريف `optionsList` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `JSON.parse(...)`: يفك JSON string لقيم JS؛ ممكن يرمي SyntaxError ولا يعتبر validation كامل. القيم المكتوبة هنا: `data.branch_options`. العائد/الأثر: JS value. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 194:** Variable declaration / تعريف `category` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `catalog.categories.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(entry) => entry.id === Number(data.category_id)`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `data.category_id`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 195:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `data.name?.trim(...)`: تشيل whitespace من أول وآخر النص فقط. مدخلاتها: بدون مدخلات. العائد/الأثر: نص جديد؛ لا تغيّر النص الأصلي.؛ `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'Complete the product details.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 196:** Variable declaration / تعريف `updated` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة Object حقولها `id`، `category_id`، `category`، `category_slug`، `is_active`، `display_order`، `branch_options`. الدوال الموجودة في السطر: `Math.max(...)`: ترجع أكبر المدخلات. القيم المكتوبة هنا: `...catalog.items.map((entry) => entry.id)`. العائد/الأثر: number.؛ `catalog.items.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(entry) => entry.id`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `option.price`. العائد/الأثر: number أو NaN.؛ `optionsList.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(option) => ({ ...option, branch_id: Number(option.branch_id), price: Number(option.price) })`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 197:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 198:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'Photo uploads are available in the full website. Demo product edits work without a file.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 199:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `Object.assign(...)`: ينسخ properties إلى target نفسه؛ هنا يحافظ على reactive object بدل استبداله. القيم المكتوبة هنا: `item`، `updated`. العائد/الأثر: target بعد التعديل؛ `catalog.items.push(...)`: تضيف عناصر في آخر array الأصلية. القيم المكتوبة هنا: `updated`. العائد/الأثر: الطول الجديد؛ تعدّل الأصل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 200:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 201–208

```js
            } else if (section === 'categories') {
                if (!data.name?.trim() || !data.slug?.trim()) throw error('Enter a category name and slug.');
                const existing = catalog.categories.find((entry) => entry.id === id);
                if (existing) Object.assign(existing, data); else catalog.categories.push({ ...data, id: Math.max(...catalog.categories.map((entry) => entry.id)) + 1 });
            } else if (section === 'branches') {
                const branch = catalog.branches.find((entry) => entry.id === id);
                if (!branch) throw error('Branch not found.');
                Object.assign(branch, data, { delivery_fee: Number(data.delivery_fee) });
```

**السطر 201:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 202:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `data.name?.trim(...)`: تشيل whitespace من أول وآخر النص فقط. مدخلاتها: بدون مدخلات. العائد/الأثر: نص جديد؛ لا تغيّر النص الأصلي.؛ `data.slug?.trim(...)`: تشيل whitespace من أول وآخر النص فقط. مدخلاتها: بدون مدخلات. العائد/الأثر: نص جديد؛ لا تغيّر النص الأصلي.؛ `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'Enter a category name and slug.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 203:** Variable declaration / تعريف `existing` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `catalog.categories.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(entry) => entry.id === id`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 204:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `Object.assign(...)`: ينسخ properties إلى target نفسه؛ هنا يحافظ على reactive object بدل استبداله. القيم المكتوبة هنا: `existing`، `data`. العائد/الأثر: target بعد التعديل؛ `catalog.categories.push(...)`: تضيف عناصر في آخر array الأصلية. القيم المكتوبة هنا: `{ ...data, id: Math.max(...catalog.categories.map((entry) => entry.id)) + 1 }`. العائد/الأثر: الطول الجديد؛ تعدّل الأصل.؛ `Math.max(...)`: ترجع أكبر المدخلات. القيم المكتوبة هنا: `...catalog.categories.map((entry) => entry.id)`. العائد/الأثر: number.؛ `catalog.categories.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(entry) => entry.id`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 205:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 206:** Variable declaration / تعريف `branch` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `catalog.branches.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(entry) => entry.id === id`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 207:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'Branch not found.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 208:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `Object.assign(...)`: ينسخ properties إلى target نفسه؛ هنا يحافظ على reactive object بدل استبداله. القيم المكتوبة هنا: `branch`، `data`، `{ delivery_fee: Number(data.delivery_fee) }`. العائد/الأثر: target بعد التعديل؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `data.delivery_fee`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 209–216

```js
                store.users.forEach((entry) => { if (entry.branch_id === branch.id) entry.branch = clone(branch); });
            } else if (section === 'staff') {
                if (!data.name?.trim() || !data.email?.trim()) throw error('Enter demo account details.');
                const record = { name: data.name, email: data.email, role: data.role, is_active: data.is_active, branch_id: data.role === 'staff' ? Number(data.branch_id) : null };
                record.branch = catalog.branches.find((branch) => branch.id === record.branch_id) || null;
                if (data.role === 'staff' && !record.branch) throw error('Assign a branch.');
                const account = store.users.find((entry) => entry.id === id);
                if (account) Object.assign(account, record); else store.users.push({ ...record, id: Math.max(...store.users.map((entry) => entry.id)) + 1 });
```

**السطر 209:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `store.users.forEach(...)`: تنفّذ callback لكل عنصر لأثر جانبي. القيم المكتوبة هنا: `(entry) => { if (entry.branch_id === branch.id) entry.branch = clone(branch); }`. العائد/الأثر: undefined؛ لا تجمع نتائج callbacks ولا تنتظر async callbacks تلقائيًا.؛ `clone(...)`: ينسخ بيانات JSON-safe عبر stringify/parse لفصل المراجع؛ يفقد الأنواع غير المناسبة لـ JSON مثل Dates ككائنات/functions. القيم المكتوبة هنا: `branch`. العائد/الأثر: نسخة بيانات مفكوكة من JSON.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 210:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 211:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `data.name?.trim(...)`: تشيل whitespace من أول وآخر النص فقط. مدخلاتها: بدون مدخلات. العائد/الأثر: نص جديد؛ لا تغيّر النص الأصلي.؛ `data.email?.trim(...)`: تشيل whitespace من أول وآخر النص فقط. مدخلاتها: بدون مدخلات. العائد/الأثر: نص جديد؛ لا تغيّر النص الأصلي.؛ `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'Enter demo account details.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 212:** Variable declaration / تعريف `record` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة Object حقولها `name`، `email`، `role`، `is_active`، `branch_id`. الدوال الموجودة في السطر: `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `data.branch_id`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 213:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods. الدوال الموجودة في السطر: `catalog.branches.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(branch) => branch.id === record.branch_id`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 214:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'Assign a branch.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 215:** Variable declaration / تعريف `account` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `store.users.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(entry) => entry.id === id`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 216:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `Object.assign(...)`: ينسخ properties إلى target نفسه؛ هنا يحافظ على reactive object بدل استبداله. القيم المكتوبة هنا: `account`، `record`. العائد/الأثر: target بعد التعديل؛ `store.users.push(...)`: تضيف عناصر في آخر array الأصلية. القيم المكتوبة هنا: `{ ...record, id: Math.max(...store.users.map((entry) => entry.id)) + 1 }`. العائد/الأثر: الطول الجديد؛ تعدّل الأصل.؛ `Math.max(...)`: ترجع أكبر المدخلات. القيم المكتوبة هنا: `...store.users.map((entry) => entry.id)`. العائد/الأثر: number.؛ `store.users.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(entry) => entry.id`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 217–224

```js
            } else if (section === 'settings') Object.assign(store.settings, data);
            else throw error('This demo action is unavailable.');
            audit(store, user, section + '.updated', id || null);
            return persist(section === 'settings' ? { settings: store.settings } : { message: 'Demo changes saved in this browser.' });
        }
        if (section === 'branches') return clone({ branches: catalog.branches });
        if (section === 'staff') return clone({ users: store.users.filter((entry) => entry.role !== 'customer') });
        if (section === 'settings') return clone({ settings: store.settings });
```

**السطر 217:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `Object.assign(...)`: ينسخ properties إلى target نفسه؛ هنا يحافظ على reactive object بدل استبداله. القيم المكتوبة هنا: `store.settings`، `data`. العائد/الأثر: target بعد التعديل. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 218:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'This demo action is unavailable.'`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 219:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `audit(...)`: يضيف سجل نشاط في أول store.logs بالوقت والمستخدم والإجراء. القيم المكتوبة هنا: `store`، `user`، `section + '.updated'`، `id || null`. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 220:** Return / رجّع `persist(section === 'settings' ? { settings: store.settings } : { message: 'Demo changes saved in this browser.' })` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `persist(...)`: helper داخل demoFetch يحفظ store ثم يرجع clone من النتيجة حتى ما يبقاش المستدعي ماسك نفس المرجع. القيم المكتوبة هنا: `section === 'settings' ? { settings: store.settings } : { message: 'Demo changes saved in this browser.' }`. العائد/الأثر: نسخة result.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 221:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 222:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `clone(...)`: ينسخ بيانات JSON-safe عبر stringify/parse لفصل المراجع؛ يفقد الأنواع غير المناسبة لـ JSON مثل Dates ككائنات/functions. القيم المكتوبة هنا: `{ branches: catalog.branches }`. العائد/الأثر: نسخة بيانات مفكوكة من JSON.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 223:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `clone(...)`: ينسخ بيانات JSON-safe عبر stringify/parse لفصل المراجع؛ يفقد الأنواع غير المناسبة لـ JSON مثل Dates ككائنات/functions. القيم المكتوبة هنا: `{ users: store.users.filter((entry) => entry.role !== 'customer') }`. العائد/الأثر: نسخة بيانات مفكوكة من JSON.؛ `store.users.filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `(entry) => entry.role !== 'customer'`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 224:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `clone(...)`: ينسخ بيانات JSON-safe عبر stringify/parse لفصل المراجع؛ يفقد الأنواع غير المناسبة لـ JSON مثل Dates ككائنات/functions. القيم المكتوبة هنا: `{ settings: store.settings }`. العائد/الأثر: نسخة بيانات مفكوكة من JSON.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 225–232

```js
        if (section === 'audit') return clone({ logs: store.logs });
        if (section === 'orders') return clone({ orders: store.orders.filter((order) => (!location.searchParams.get('status') || order.status === location.searchParams.get('status')) && (!location.searchParams.get('payment_status') || order.payment_status === location.searchParams.get('payment_status')) && (!location.searchParams.get('search') || [order.id, order.customer_name, order.customer_phone].join(' ').toLowerCase().includes(location.searchParams.get('search').toLowerCase()))) });
        if (section === 'customers') return clone({ customers: store.users.filter((entry) => entry.role === 'customer').map((entry) => { const orders = store.orders.filter((order) => order.user_id === entry.id); return { ...entry, orders_count: orders.length, orders_sum_total_price: orders.reduce((sum, order) => sum + order.total_price, 0), orders_max_created_at: orders[0]?.created_at }; }) });
    }
    throw error('This feature is not available in the demo.', {}, 404);
}

export function resetDemo() {
```

**السطر 225:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `clone(...)`: ينسخ بيانات JSON-safe عبر stringify/parse لفصل المراجع؛ يفقد الأنواع غير المناسبة لـ JSON مثل Dates ككائنات/functions. القيم المكتوبة هنا: `{ logs: store.logs }`. العائد/الأثر: نسخة بيانات مفكوكة من JSON.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 226:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `clone(...)`: ينسخ بيانات JSON-safe عبر stringify/parse لفصل المراجع؛ يفقد الأنواع غير المناسبة لـ JSON مثل Dates ككائنات/functions. القيم المكتوبة هنا: `{ orders: store.orders.filter((order) => (!location.searchParams.get('status') || order.status === location.se…`. العائد/الأثر: نسخة بيانات مفكوكة من JSON.؛ `store.orders.filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `(order) => (!location.searchParams.get('status') || order.status === location.searchParams.get('status')) && (…`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.؛ `location.searchParams.get(...)`: تقرأ قيمة query parameter. القيم المكتوبة هنا: `'search'`. العائد/الأثر: string أو null؛ لا تجلب شبكة.؛ `[order.id, order.customer_name, order.customer_phone].join(' ').toLowerCase().includes(...)`: تختبر وجود قيمة في array أو نص داخل string. القيم المكتوبة هنا: `location.searchParams.get('search').toLowerCase()`. العائد/الأثر: Boolean؛ مش العنصر ولا موقعه.؛ `[order.id, order.customer_name, order.customer_phone].join(' ').toLowerCase(...)`: تحوّل الحروف لحالتها الصغيرة. مدخلاتها: بدون مدخلات. العائد/الأثر: نص جديد.؛ `[order.id, order.customer_name, order.customer_phone].join(...)`: تجمع عناصر في نص. القيم المكتوبة هنا: `' '`. العائد/الأثر: string، لا تعدّل عناصر الأصل.؛ `location.searchParams.get('search').toLowerCase(...)`: تحوّل الحروف لحالتها الصغيرة. مدخلاتها: بدون مدخلات. العائد/الأثر: نص جديد.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 227:** Variable declaration / تعريف `orders` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `clone(...)`: ينسخ بيانات JSON-safe عبر stringify/parse لفصل المراجع؛ يفقد الأنواع غير المناسبة لـ JSON مثل Dates ككائنات/functions. القيم المكتوبة هنا: `{ customers: store.users.filter((entry) => entry.role === 'customer').map((entry) => { const orders = store.or…`. العائد/الأثر: نسخة بيانات مفكوكة من JSON.؛ `store.users.filter((entry) => entry.role === 'customer').map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(entry) => { const orders = store.orders.filter((order) => order.user_id === entry.id); return { ...entry, ord…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `store.users.filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `(entry) => entry.role === 'customer'`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.؛ `store.orders.filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `(order) => order.user_id === entry.id`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.؛ `orders.reduce(...)`: تجمع عناصر في نتيجة متراكمة. القيم المكتوبة هنا: `(sum, order) => sum + order.total_price`، `0`. العائد/الأثر: الناتج النهائي؛ سلة فاضية مع البداية0 ترجع0.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 228:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 229:** Throw / ارمِ خطأ وأوقف المسار الحالي؛ الدالة async تتحول Promise الخاصة بها إلى rejected لو لم يُمسك الخطأ داخلها. الدوال الموجودة في السطر: `error(...)`: ينشئ Error ومعه payload.errors وstatus ليشبه خطأ csrfFetch؛ لا يرميه إلا لو المستدعي كتب throw. القيم المكتوبة هنا: `'This feature is not available in the demo.'`، `{}`، `404`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 230:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 232:** Function / تعريف دالة `resetDemo`؛ تعريفها مش تشغيلها. يمسح 5 مفاتيح demo محددة فقط؛ لا يستخدم localStorage.clear ولا يمس مفاتيح live. مدخلاتها: لا شيء. ناتجها: undefined؛ UI ينادي reload بعده لتوليد seed جديد.

### السطور 233–235

```js
    [STORE_KEY, SESSION_KEY, 'wtc_demo_cart', 'wtc_demo_branch_id', 'wtc_demo_order_preferences'].forEach((key) => localStorage.removeItem(key));
}

```

**السطر 233:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `[STORE_KEY, SESSION_KEY, 'wtc_demo_cart', 'wtc_demo_branch_id', 'wtc_demo_order_preferences'].forEach(...)`: تنفّذ callback لكل عنصر لأثر جانبي. القيم المكتوبة هنا: `(key) => localStorage.removeItem(key)`. العائد/الأثر: undefined؛ لا تجمع نتائج callbacks ولا تنتظر async callbacks تلقائيًا.؛ `localStorage.removeItem(...)`: تمسح مفتاحًا محددًا فقط. القيم المكتوبة هنا: `key`. العائد/الأثر: undefined؛ ليست حذف قاعدة بيانات Laravel.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 234:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
