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
