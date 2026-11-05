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
