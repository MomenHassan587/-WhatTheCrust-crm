# السلة الحالية: كميات وعنوان ودفع Cash/Card

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `resources/js/Pages/Cart.jsx` · 202 سطر.

**وظيفة الملف:** تزامن السلة من localStorage؛ تراجع العناصر ضد catalog، تحسب subtotal ورسوم الفرع، تبني payload بالـ IDs والكميات لا أسعار العميل. كاش ينشئ order، وكارت يمرّ بـ Stripe. نجاح طلب الكارت في الواجهة لا يغني عن webhook السيرفر.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../resources/js/Pages/Cart.jsx). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/resources/js/lib/api.js](../lib/api.js.md)

- [pizza-crm/resources/js/context/CatalogContext.jsx](../context/CatalogContext.jsx.md)

- [pizza-crm/resources/js/context/OrderContext.jsx](../context/OrderContext.jsx.md)

- [pizza-crm/resources/js/Pages/MenuPage.jsx](MenuPage.jsx.md)

- [pizza-crm/resources/js/Components/Navbar.jsx](../Components/Navbar.jsx.md)

- [pizza-crm/app/Http/Controllers/Api/PaymentController.php](../../../app/Http/Controllers/Api/PaymentController.php.md)

- [pizza-crm/app/Http/Controllers/Api/OrderController.php](../../../app/Http/Controllers/Api/OrderController.php.md)

- [pizza-crm/resources/js/Pages/OrderTracking.jsx](OrderTracking.jsx.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { csrfFetch } from '../lib/api';
import { branchOption, useCatalog } from '../context/CatalogContext';
import { useOrder } from '../context/OrderContext';

const isDemo = import.meta.env.VITE_DEMO_MODE === 'true';
const CART_STORAGE_KEY = isDemo ? 'wtc_demo_cart' : 'wtc_cart';
const CART_EVENT_NAME = 'wtc-cart-updated';
const stripePromise = !isDemo && import.meta.env.VITE_STRIPE_KEY ? loadStripe(import.meta.env.VITE_STRIPE_KEY) : null;
function readCart() {
    try { return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]'); } catch { return []; }
}

function writeCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event(CART_EVENT_NAME));
}

function CardCheckout({ payload, disabled, onSuccess, onMessage }) {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);

    const pay = async () => {
        if (!stripe || !elements || processing) return;
        setProcessing(true);
        onMessage('');
        const idempotencyKey = crypto.randomUUID();
        try {
            const response = await csrfFetch('/api/payments/intents', {
                method: 'POST',
                headers: { 'Idempotency-Key': idempotencyKey },
                body: JSON.stringify({ ...payload(), payment_method: 'card', idempotency_key: idempotencyKey }),
            });
            const result = await stripe.confirmCardPayment(response.client_secret, {
                payment_method: { card: elements.getElement(CardElement) },
            });
            if (result.error) throw new Error(result.error.message);
            onMessage(`Payment received. Order #${response.order_id} is being confirmed.`);
            onSuccess(response.tracking_url);
        } catch (error) {
            onMessage(error.message || 'Card payment failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="wtc-card-fields">
            <label className="form-label fw-bold" htmlFor="card-element">Card details</label>
            <div id="card-element" className="wtc-card-element">
                <CardElement options={{ style: { base: { color: '#fff', fontSize: '16px', '::placeholder': { color: '#8f8f8f' } } } }} />
            </div>
            <button type="button" className="btn btn-red w-100 mt-3" disabled={disabled || processing || !stripe} onClick={pay}>
                {processing ? 'Processing securely...' : 'Pay by Card'}
            </button>
        </div>
    );
}

export default function Cart() {
    const { branches, items, loading: catalogLoading, error: catalogError, reload: reloadCatalog } = useCatalog();
    const navigate = useNavigate();
    const {
        mode: orderType,
        branchId: selectedBranchId,
        selectedBranch,
        availableBranches,
        deliveryAddress,
        deliveryArea,
        notice,
        setOrderMode,
        setBranch,
        setDeliveryAddress,
        setDeliveryArea,
        clearNotice,
    } = useOrder();
    const [cartItems, setCartItems] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [customer, setCustomer] = useState({ name: '', phone: '', pickupTime: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const sync = () => setCartItems(readCart());
        sync();
        window.addEventListener('storage', sync);
        window.addEventListener(CART_EVENT_NAME, sync);
        return () => { window.removeEventListener('storage', sync); window.removeEventListener(CART_EVENT_NAME, sync); };
    }, []);

    useEffect(() => {
        if (!items.length || !branches.length || !cartItems.length) return;
        let removed = 0;
        const normalized = cartItems.flatMap((line) => {
            const item = items.find((candidate) => candidate.id === line.id);
            if (!item || item.name !== line.name) {
                removed += 1;
                return [];
            }
            const branchId = Number(line.branch_id || selectedBranchId || branches[0].id);
            const branch = branches.find((candidate) => candidate.id === branchId);
            const option = branchOption(item, branchId);
            if (!branch || !option?.is_available) {
                removed += 1;
                return [];
            }
            return [{ ...line, name: item.name, description: item.description, image_src: item.image_path, price: Number(option.price), branch_id: branch.id, branch_name: branch.name }];
        });
        if (JSON.stringify(normalized) !== JSON.stringify(cartItems)) {
            setCartItems(normalized);
            writeCart(normalized);
            if (removed) setMessage('The menu changed, so unavailable or outdated cart items were removed.');
        }
    }, [branches, items, cartItems, selectedBranchId]);

    const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0), [cartItems]);
    const deliveryFee = orderType === 'delivery' && cartItems.length ? Number(selectedBranch?.delivery_fee || 0) : 0;
    const total = subtotal + deliveryFee;

    const updateItem = (id, changes) => {
        const next = cartItems.map((item) => item.id === id ? { ...item, ...changes } : item);
        setCartItems(next);
        writeCart(next);
    };
    const removeItem = (id) => { const next = cartItems.filter((item) => item.id !== id); setCartItems(next); writeCart(next); };
    const clearCart = () => { setCartItems([]); writeCart([]); };
    const updateCustomer = (field, value) => setCustomer((current) => ({ ...current, [field]: value }));

    const changeBranch = (branchId) => {
        if (!setBranch(branchId)) return;
        setCartItems(readCart());
    };

    const buildPayload = () => ({
        branch_id: Number(selectedBranchId),
        order_type: orderType,
        customer_name: customer.name,
        customer_phone: customer.phone,
        delivery_address: orderType === 'delivery' ? [deliveryArea, deliveryAddress].filter(Boolean).join(', ') : null,
        pickup_time: orderType === 'pickup' ? customer.pickupTime : null,
        payment_method: paymentMethod,
        items: cartItems.map((item) => ({ menu_item_id: item.id, quantity: item.quantity, notes: item.notes || null })),
    });

    const submitCashOrder = async () => {
        setMessage('');
        setIsSubmitting(true);
        try {
            const response = await csrfFetch('/api/orders', { method: 'POST', body: JSON.stringify(buildPayload()) });
            clearCart();
            navigate(response.tracking_url);
        } catch (error) {
            setMessage(error.payload?.errors ? Object.values(error.payload.errors).flat()[0] : error.message);
        } finally { setIsSubmitting(false); }
    };

    const selection = (name, value, current, onChange, title, copy, icon, keyValue) => (
        <label key={keyValue ?? value} className={`wtc-option-card ${Number(current) === Number(value) || current === value ? 'is-selected' : ''}`}>
            <input type="radio" name={name} value={value} checked={Number(current) === Number(value) || current === value} onChange={() => onChange(value)} />
            <span className="wtc-option-icon" aria-hidden="true">{icon}</span>
            <span><strong>{title}</strong><small>{copy}</small></span>
        </label>
    );

    const disabled = !selectedBranchId || !cartItems.length || !customer.name || !customer.phone || (orderType === 'delivery' && (!deliveryArea || !deliveryAddress)) || (orderType === 'pickup' && !customer.pickupTime);

    return (
        <main className="wtc-cart-page">
            <style>{`
                .wtc-cart-page{min-height:100vh;padding:8rem 0 5rem;background:#121212;color:#f5f5f5}.wtc-cart-title{font-size:clamp(2.7rem,5vw,5.5rem);line-height:.95;font-weight:1000;letter-spacing:0}.wtc-cart-copy{color:#aaa}.wtc-cart-card,.wtc-cart-summary{border:1px solid rgba(255,255,255,.08);border-radius:8px;background:#1b1b1b}.wtc-cart-card{display:grid;grid-template-columns:120px 1fr auto;gap:1rem;padding:1rem;align-items:start}.wtc-cart-image{width:120px;height:96px;border-radius:8px;overflow:hidden}.wtc-cart-image img{width:100%;height:100%;object-fit:cover}.wtc-item-notes{grid-column:2/-1}.wtc-item-notes textarea,.wtc-field{width:100%;border:1px solid rgba(255,255,255,.13);border-radius:6px;background:#111;color:#fff;padding:.75rem}.wtc-counter{display:block;text-align:right;color:#888;font-size:.75rem}.wtc-cart-price{color:#ed3434;font-weight:900}.wtc-quantity-control{display:flex;align-items:center;gap:.6rem}.wtc-quantity-control button{width:34px;height:34px;border:0;border-radius:50%;background:#333;color:#fff}.wtc-remove-btn{border:0;background:none;color:#ff7b7b}.wtc-cart-summary{position:sticky;top:106px;padding:1.4rem}.wtc-option-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.65rem}.wtc-option-card{position:relative;display:flex;gap:.7rem;align-items:center;padding:.85rem;border:1px solid #393939;border-radius:8px;background:#171717;cursor:pointer}.wtc-option-card:focus-within{outline:2px solid #ed3434;outline-offset:2px}.wtc-option-card.is-selected{border-color:#ed3434;background:rgba(227,36,36,.1)}.wtc-option-card input{position:absolute;opacity:0}.wtc-option-card small{display:block;color:#929292;font-size:.72rem}.wtc-option-icon{font-size:1.3rem}.wtc-summary-line,.wtc-summary-total{display:flex;justify-content:space-between;padding:.75rem 0;border-bottom:1px solid #303030}.wtc-summary-total{font-size:1.2rem;font-weight:900;border:0}.wtc-card-element{padding:.85rem;border:1px solid #444;border-radius:6px;background:#111}.wtc-cart-message{margin-top:1rem;padding:.8rem;border-radius:6px;background:rgba(241,168,58,.1);color:#f1a83a}.wtc-payment-tabs{display:grid;grid-template-columns:1fr 1fr;gap:.5rem}.wtc-payment-tabs button{padding:.7rem;border:1px solid #444;background:#171717;color:#ddd;border-radius:6px}.wtc-payment-tabs button.active{border-color:#ed3434;color:#fff;background:rgba(227,36,36,.12)}@media(max-width:767px){.wtc-cart-page{padding-top:6.5rem}.wtc-cart-card{grid-template-columns:82px 1fr}.wtc-cart-image{width:82px;height:82px}.wtc-cart-actions,.wtc-item-notes{grid-column:1/-1}.wtc-cart-summary{position:static}.wtc-option-grid{grid-template-columns:1fr}}
            `}</style>
            <div className="container">
                {isDemo && <p className="wtc-cart-message" role="status">Place a sample order using made-up details. No food will be prepared and no payment is collected.</p>}
                <div className="row g-4 align-items-end mb-5"><div className="col-12 col-lg-7"><p className="eyebrow">Your Cart</p><h1 className="wtc-cart-title">Review your order.</h1></div><div className="col-12 col-lg-5"><p className="wtc-cart-copy mb-0">Choose how you want it, add any kitchen notes, and check out securely.</p></div></div>
                <div className="row g-4">
                    <div className="col-12 col-lg-8">
                        {!cartItems.length ? <div className="wtc-cart-card d-block text-center p-5"><h2>Your cart is empty.</h2><Link to="/menu" className="btn btn-red">View Menu</Link></div> : <div className="d-grid gap-3">{cartItems.map((item) => <article className="wtc-cart-card" key={item.id}>
                            <div className="wtc-cart-image">{item.image_src ? <img src={item.image_src} alt={item.name} loading="lazy" /> : <span className="menu-image-placeholder" role="img" aria-label={`${item.name} photo coming soon`}>WTC</span>}</div>
                            <div><h3 className="h5 fw-bold">{item.name}</h3><p className="wtc-cart-copy mb-2">{item.description}</p><span className="wtc-cart-price">EGP {item.price}</span></div>
                            <div className="wtc-cart-actions d-flex flex-column align-items-end gap-2"><div className="wtc-quantity-control"><button type="button" aria-label={`Decrease ${item.name}`} disabled={item.quantity <= 1} onClick={() => updateItem(item.id,{quantity:Math.max(1,item.quantity-1)})}>-</button><strong>{item.quantity}</strong><button type="button" aria-label={`Increase ${item.name}`} onClick={() => updateItem(item.id,{quantity:item.quantity+1})}>+</button></div><button type="button" className="wtc-remove-btn" onClick={() => removeItem(item.id)}>Remove</button></div>
                            <div className="wtc-item-notes"><label className="form-label fw-bold" htmlFor={`notes-${item.id}`}>Kitchen notes <span className="fw-normal text-secondary">(optional)</span></label><textarea id={`notes-${item.id}`} rows="2" maxLength="200" value={item.notes || ''} onChange={(event) => updateItem(item.id,{notes:event.target.value})} placeholder="Want to add or remove something? e.g. no onions, extra cheese"/><small className="wtc-counter">{(item.notes || '').length}/200</small></div>
                        </article>)}</div>}
                    </div>
                    <div className="col-12 col-lg-4"><aside className="wtc-cart-summary"><h2 className="h4 fw-bold mb-4">Order Summary</h2>
                        <fieldset className="mb-4" disabled={catalogLoading}><legend className="h6 fw-bold">Branch</legend>{catalogLoading && <p className="text-secondary small" role="status">Loading branches...</p>}{catalogError && <div className="wtc-cart-message" role="alert">{catalogError} <button type="button" className="btn btn-sm btn-outline-light ms-2" onClick={reloadCatalog}>Retry</button></div>}<div className="d-grid gap-2">{availableBranches.map((branch) => selection('branch',branch.id,selectedBranchId,changeBranch,branch.name,branch.location,'\u2302',branch.id))}</div></fieldset>
                        <fieldset className="mb-4"><legend className="h6 fw-bold">Fulfillment</legend><div className="wtc-option-grid">{selection('fulfillment','delivery',orderType,setOrderMode,'Delivery','To your door','\u2192')}{selection('fulfillment','pickup',orderType,setOrderMode,'Pickup','Collect in store','\u25A3')}</div></fieldset>
                        <div className="d-grid gap-3 mb-4"><div><label htmlFor="customer-name" className="form-label fw-bold">Name</label><input id="customer-name" className="wtc-field" value={customer.name} onChange={(e)=>updateCustomer('name',e.target.value)} required /></div><div><label htmlFor="customer-phone" className="form-label fw-bold">Phone</label><input id="customer-phone" type="tel" className="wtc-field" value={customer.phone} onChange={(e)=>updateCustomer('phone',e.target.value)} required /></div>{orderType==='delivery'?<><div><label htmlFor="delivery-area" className="form-label fw-bold">Delivery area</label><input id="delivery-area" className="wtc-field" value={deliveryArea} onChange={(e)=>setDeliveryArea(e.target.value)} required /></div><div><label htmlFor="delivery-address" className="form-label fw-bold">Delivery address</label><textarea id="delivery-address" className="wtc-field" value={deliveryAddress} onChange={(e)=>setDeliveryAddress(e.target.value)} required /></div></>:<div><label htmlFor="pickup-time" className="form-label fw-bold">Estimated arrival time</label><input id="pickup-time" type="datetime-local" className="wtc-field" value={customer.pickupTime} min={new Date(Date.now()+20*60000).toISOString().slice(0,16)} onChange={(e)=>updateCustomer('pickupTime',e.target.value)} required /><small className="text-secondary">Allow at least 20 minutes for preparation. {selectedBranch?.opening_hours && `Open ${selectedBranch.opening_hours}.`}</small></div>}</div>
                        <div className="wtc-summary-line"><span>Subtotal</span><strong>EGP {subtotal.toFixed(2)}</strong></div><div className="wtc-summary-line"><span>Delivery fee</span><strong>EGP {deliveryFee.toFixed(2)}</strong></div><div className="wtc-summary-total"><span>Total</span><strong>EGP {total.toFixed(2)}</strong></div>
                        <div className="wtc-payment-tabs mb-3" role="group" aria-label="Payment method"><button type="button" className={paymentMethod==='cash'?'active':''} onClick={()=>setPaymentMethod('cash')}>{orderType==='pickup'?'Pay at pickup':'Cash on delivery'}</button><button type="button" className={paymentMethod==='card'?'active':''} onClick={()=>setPaymentMethod('card')}>Pay by card</button></div>
                        {paymentMethod==='cash'?<button type="button" className="btn btn-red w-100" disabled={disabled||isSubmitting} onClick={submitCashOrder}>{isSubmitting?'Confirming...':'Confirm Order'}</button>:stripePromise?<Elements stripe={stripePromise}><CardCheckout payload={buildPayload} disabled={disabled} onSuccess={(trackingUrl)=>{clearCart();navigate(trackingUrl);}} onMessage={setMessage}/></Elements>:<div className="wtc-cart-message">Card payments need VITE_STRIPE_KEY configured.</div>}
                        {!!cartItems.length&&<button type="button" className="btn btn-outline-glow w-100 mt-3" onClick={clearCart}>Clear Cart</button>}{(message||notice)&&<div className="wtc-cart-message" role="status" onClick={clearNotice}>{message||notice}</div>}
                    </aside></div>
                </div>
            </div>
        </main>
    );
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### readCart

يقرأ السلة المحفوظة لوصول الصفحة أو حدث مزامنة.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** cart array أو [].

### writeCart

يحفظ السلة ويصدر wtc-cart-updated.

- **بتاخد إيه؟ Inputs:** cart array.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined.

### CardCheckout

مكوّن داخل Elements يستخرج Stripe وElements ويرسم CardElement وزر الدفع.

- **بتاخد إيه؟ Inputs:** payload: دالة تجهيز الطلب؛ disabled؛ onSuccess؛ onMessage.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX حقول الكارت.

### pay

يمنع التكرار المحلي، يطلب PaymentIntent باستخدام idempotency key ثم stripe.confirmCardPayment؛ يرسل رسالة وينادي onSuccess للتوجيه.

- **بتاخد إيه؟ Inputs:** لا شيء؛ يقرأ props وStripe refs.

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<void>.

### Cart

صفحة /cart الفعلية وتحتوي handlers للكميات والملاحظات والعميل والـ checkout.

- **بتاخد إيه؟ Inputs:** contexts.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX main.

### sync

يقرأ التخزين ويحدث cartItems عند أول effect أو storage/custom event.

- **بتاخد إيه؟ Inputs:** لا مدخل مستخدم.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined.

### updateItem

ينشئ array جديدة ويستبدل العنصر المطابق بنسخة تحمل changes ثم يحدّث state والتخزين.

- **بتاخد إيه؟ Inputs:** id: معرّف المنتج؛ changes: object مثل {quantity:2} أو {notes:'no onions'}.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined.

### removeItem

يستبعد سطر المنتج باستخدام filter ثم يحدّث state والتخزين.

- **بتاخد إيه؟ Inputs:** id.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined.

### clearCart

يضع [] في state وفي التخزين وينبّه Navbar بالحدث.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined.

### updateCustomer

يغيّر حقلًا ديناميكيًا في customer مع الاحتفاظ بباقي الحقول، باستعمال functional state update و[field].

- **بتاخد إيه؟ Inputs:** field: name/phone/pickupTime؛ value: قيمة input.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined.

### changeBranch

ينادي setBranch من OrderContext ثم يعيد تحميل السلة بعد إعادة التسعير.

- **بتاخد إيه؟ Inputs:** branchId.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined.

### buildPayload

يحوّل بيانات الصفحة لشكل API: branch/order/customer/address/payment/items IDs. لا يبعث سعر المنتج كمرجع موثوق.

- **بتاخد إيه؟ Inputs:** لا شيء؛ يقرأ أحدث state وقت الاستدعاء.

- **بترجع/بتغيّر إيه؟ Return / effect:** object صالح للإرسال بعد JSON.stringify، وليس JSON string بذاته.

### submitCashOrder

يبعت payload إلى POST /api/orders، يفرغ السلة ويوجّه tracking_url؛ catch يعرض أول validation error؛ finally يوقف loading.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<void>.

### selection

JSX helper يرسم radio option card ويحدد checked/class من current/value.

- **بتاخد إيه؟ Inputs:** name,value,current,onChange,title,copy,icon,keyValue.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX label/input؛ onChange(value) يصل للدالة المناسبة.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### loadStripe

- **جاية منين؟** Stripe.js

- **وظيفتها:** تحمّل/تجهز Stripe browser client بمفتاح عام.

- **المدخلات — Arguments:** publishable key وخيارات.

- **الناتج/الأثر — Return / effect:** Promise لـStripe object أو null حسب الظروف.

- **أول موضع هنا:** السطر 12، والمدخلات المكتوبة: `import.meta.env.VITE_STRIPE_KEY`.

### JSON.parse

- **جاية منين؟** JavaScript

- **وظيفتها:** يفك JSON string لقيم JS؛ ممكن يرمي SyntaxError ولا يعتبر validation كامل.

- **المدخلات — Arguments:** JSON string

- **الناتج/الأثر — Return / effect:** JS value

- **أول موضع هنا:** السطر 14، والمدخلات المكتوبة: `localStorage.getItem(CART_STORAGE_KEY) || '[]'`.

- **مثال:** const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

### localStorage.getItem

- **جاية منين؟** Browser localStorage/sessionStorage

- **وظيفتها:** تقرأ النص المحفوظ تحت مفتاح.

- **المدخلات — Arguments:** اسم المفتاح.

- **الناتج/الأثر — Return / effect:** string أو null؛ لا تعيد object تلقائيًا.

- **أول موضع هنا:** السطر 14، والمدخلات المكتوبة: `CART_STORAGE_KEY`.

### localStorage.setItem

- **جاية منين؟** Browser localStorage/sessionStorage

- **وظيفتها:** تحفظ قيمة نصية تحت مفتاح وتستبدل القديمة.

- **المدخلات — Arguments:** key وvalue.

- **الناتج/الأثر — Return / effect:** undefined؛ قد تفشل لو التخزين غير متاح.

- **أول موضع هنا:** السطر 18، والمدخلات المكتوبة: `CART_STORAGE_KEY`، `JSON.stringify(cart)`.

### JSON.stringify

- **جاية منين؟** JavaScript

- **وظيفتها:** يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions.

- **المدخلات — Arguments:** value

- **الناتج/الأثر — Return / effect:** string أو undefined لبعض القيم

- **أول موضع هنا:** السطر 153، والمدخلات المكتوبة: `buildPayload()`.

- **مثال:** localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

### window.dispatchEvent

- **جاية منين؟** Browser EventTarget

- **وظيفتها:** ترسل Event للمستمعين على هذا الهدف بشكل متزامن.

- **المدخلات — Arguments:** Event object.

- **الناتج/الأثر — Return / effect:** Boolean مرتبطة بعدم إلغاء default؛ مش HTTP response.

- **أول موضع هنا:** السطر 19، والمدخلات المكتوبة: `new Event(CART_EVENT_NAME)`.

### Event

- **جاية منين؟** Browser

- **وظيفتها:** تنشئ Event تحمل نوع الحدث.

- **المدخلات — Arguments:** event type وoptions.

- **الناتج/الأثر — Return / effect:** Event object؛ الإرسال يحتاج dispatchEvent.

- **أول موضع هنا:** السطر 19، والمدخلات المكتوبة: `CART_EVENT_NAME`.

### useStripe

- **جاية منين؟** Stripe React

- **وظيفتها:** تقرأ Stripe client من Elements provider.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** Stripe object أو null قبل الجاهزية.

- **أول موضع هنا:** السطر 23.

### useElements

- **جاية منين؟** Stripe React

- **وظيفتها:** تقرأ Elements manager من provider.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** StripeElements أو null.

- **أول موضع هنا:** السطر 24.

### useState

- **جاية منين؟** React

- **وظيفتها:** حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة.

- **المدخلات — Arguments:** initialState

- **الناتج/الأثر — Return / effect:** [currentState,setter]

- **أول موضع هنا:** السطر 85، والمدخلات المكتوبة: `''`.

- **مثال:** const [failed, setFailed] = useState(false);

### setProcessing

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setProcessing هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 47، والمدخلات المكتوبة: `false`.

### onMessage

- **جاية منين؟** Callback/دالة مأخوذة من props أو Context حسب تعريف المكوّن

- **وظيفتها:** تنادي العملية اللي الأب أو الـContext مرّرها باسم onMessage؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي.

- **المدخلات — Arguments:** error.message || 'Card payment failed. Please try again.'

- **الناتج/الأثر — Return / effect:** العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.

- **أول موضع هنا:** السطر 45، والمدخلات المكتوبة: `error.message || 'Card payment failed. Please try again.'`.

### crypto.randomUUID

- **جاية منين؟** Browser Crypto

- **وظيفتها:** يولّد UUID عشوائي في secure context؛ ليس authorization token.

- **المدخلات — Arguments:** لا شيء

- **الناتج/الأثر — Return / effect:** UUID string

- **أول موضع هنا:** السطر 31.

- **مثال:** id: crypto.randomUUID();

### csrfFetch

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح.

- **المدخلات — Arguments:** url: مسار API؛ options: method/body/headers وغيرها، الافتراضي {}.

- **الناتج/الأثر — Return / effect:** Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.

- **أول موضع هنا:** السطر 153، والمدخلات المكتوبة: `'/api/orders'`، `{ method: 'POST', body: JSON.stringify(buildPayload()) }`.

- **تكملة التعريف:** [resources/js/lib/api.js](../lib/api.js.md)، عند السطر 3.

### payload

- **جاية منين؟** دالة مخصّصة معرّفة في المشروع

- **وظيفتها:** تعريف payload الكامل في الملف المرتبط.

- **المدخلات — Arguments:** 

- **الناتج/الأثر — Return / effect:** تتبّع return في التعريف المرتبط؛ الأثر مذكور في سياق الملف.

- **أول موضع هنا:** السطر 36.

- **تكملة التعريف:** [tests/demo/orders.test.mjs](../../../tests/demo/orders.test.mjs.md)، عند السطر 10.

### stripe.confirmCardPayment

- **جاية منين؟** Stripe browser

- **وظيفتها:** تبدأ/تؤكد دفع PaymentIntent بالـclient secret.

- **المدخلات — Arguments:** clientSecret وpayment data/options.

- **الناتج/الأثر — Return / effect:** Promise لنتيجة فيها paymentIntent أو error؛ webhook يبقى مهمًا للسيرفر.

- **أول موضع هنا:** السطر 38، والمدخلات المكتوبة: `response.client_secret`، `{                 payment_method: { card: elements.getElement(CardElement) },             }`.

### elements.getElement

- **جاية منين؟** Stripe Elements

- **وظيفتها:** تقرأ Element مركّبة من النوع المحدد.

- **المدخلات — Arguments:** Element type مثل CardElement.

- **الناتج/الأثر — Return / effect:** Stripe element أو null؛ مش رقم بطاقة خام في Laravel.

- **أول موضع هنا:** السطر 39، والمدخلات المكتوبة: `CardElement`.

### Error

- **جاية منين؟** JavaScript

- **وظيفتها:** تنشئ object خطأ برسالة؛ الرمي يحتاج throw منفصلة.

- **المدخلات — Arguments:** message وخيارات اختيارية.

- **الناتج/الأثر — Return / effect:** Error object.

- **أول موضع هنا:** السطر 41، والمدخلات المكتوبة: `result.error.message`.

### onSuccess

- **جاية منين؟** Callback/دالة مأخوذة من props أو Context حسب تعريف المكوّن

- **وظيفتها:** تنادي العملية اللي الأب أو الـContext مرّرها باسم onSuccess؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي.

- **المدخلات — Arguments:** response.tracking_url

- **الناتج/الأثر — Return / effect:** العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.

- **أول موضع هنا:** السطر 43، والمدخلات المكتوبة: `response.tracking_url`.

### useCatalog

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** يوصل المكوّن إلى الكتالوج المشترك؛ يفشل بوضوح لو Provider غير موجود.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** branches/categories/items/loading/error/reload.

- **أول موضع هنا:** السطر 65.

- **تكملة التعريف:** [resources/js/context/CatalogContext.jsx](../context/CatalogContext.jsx.md)، عند السطر 37.

### useNavigate

- **جاية منين؟** react-router-dom hook

- **وظيفتها:** يوفر function للتنقل داخل SPA؛ replace=true يستبدل history entry الحالية.

- **المدخلات — Arguments:** لا شيء عند إنشاء hook.

- **الناتج/الأثر — Return / effect:** navigate function.

- **أول موضع هنا:** السطر 66.

- **مثال:** navigate('/cart');

### useOrder

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** Custom hook يقرأ اختيار الفرع وطريقة الاستلام والعنوان ودوال تغييرها.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** value الخاص بـ OrderContext أو يرمي خطأ لو خارج Provider.

- **أول موضع هنا:** السطر 80.

- **تكملة التعريف:** [resources/js/context/OrderContext.jsx](../context/OrderContext.jsx.md)، عند السطر 127.

### useEffect

- **جاية منين؟** React

- **وظيفتها:** يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies.

- **المدخلات — Arguments:** setup callback, dependencies

- **الناتج/الأثر — Return / effect:** undefined

- **أول موضع هنا:** السطر 95، والمدخلات المكتوبة: `() => {         if (!items.length || !branches.length || !cartItems.length) return;         let removed = 0;         const normalized = cartItems.flatMap((line) => {             co…`، `[branches, items, cartItems, selectedBranchId]`.

- **مثال:** useEffect(() => { window.addEventListener('resize', updateRunway); return () => window.removeEventListener('resize', updateRunway); }, []);

### setCartItems

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setCartItems هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 135، والمدخلات المكتوبة: `readCart()`.

### readCart

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يقرأ السلة المحفوظة لوصول الصفحة أو حدث مزامنة.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** cart array أو [].

- **أول موضع هنا:** السطر 135.

### sync

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يقرأ التخزين ويحدث cartItems عند أول effect أو storage/custom event.

- **المدخلات — Arguments:** لا مدخل مستخدم.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 89.

### window.addEventListener

- **جاية منين؟** Browser EventTarget

- **وظيفتها:** تسجّل listener؛ مصدر الحدث يناديها ويمرر Event.

- **المدخلات — Arguments:** اسم الحدث والدالة وخيارات.

- **الناتج/الأثر — Return / effect:** undefined؛ لا تشغّل handler لحظة التسجيل.

- **أول موضع هنا:** السطر 91، والمدخلات المكتوبة: `CART_EVENT_NAME`، `sync`.

### window.removeEventListener

- **جاية منين؟** Browser EventTarget

- **وظيفتها:** تلغي listener بنفس الاسم ومرجع الدالة وcapture المناسب.

- **المدخلات — Arguments:** نوع الحدث والدالة وخيار capture إن لزم.

- **الناتج/الأثر — Return / effect:** undefined؛ لا توقف الحدث نفسه.

- **أول موضع هنا:** السطر 92، والمدخلات المكتوبة: `CART_EVENT_NAME`، `sync`.

### cartItems.flatMap

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل العناصر ثم تفرد مستوى array واحد.

- **المدخلات — Arguments:** callback قد ترجع عنصرًا أو array.

- **الناتج/الأثر — Return / effect:** array جديدة؛ [] من callback تشيل العنصر من الناتج.

- **أول موضع هنا:** السطر 98، والمدخلات المكتوبة: `(line) => {             const item = items.find((candidate) => candidate.id === line.id);             if (!item || item.name !== line.name) {                 removed += 1;         …`.

### items.find

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تبحث بالترتيب حتى أول callback truthy.

- **المدخلات — Arguments:** callback تستقبل العنصر وindex والقائمة.

- **الناتج/الأثر — Return / effect:** العنصر المطابق نفسه أو undefined؛ ليست array نتائج.

- **أول موضع هنا:** السطر 99، والمدخلات المكتوبة: `(candidate) => candidate.id === line.id`.

### Number

- **جاية منين؟** JavaScript conversion function

- **وظيفتها:** يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** number أو NaN.

- **أول موضع هنا:** السطر 163، والمدخلات المكتوبة: `value`.

- **مثال:** Number(option.price);

### branches.find

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تبحث بالترتيب حتى أول callback truthy.

- **المدخلات — Arguments:** callback تستقبل العنصر وindex والقائمة.

- **الناتج/الأثر — Return / effect:** العنصر المطابق نفسه أو undefined؛ ليست array نتائج.

- **أول موضع هنا:** السطر 105، والمدخلات المكتوبة: `(candidate) => candidate.id === branchId`.

### branchOption

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** يبحث عن سعر وتوفر منتج في فرع بعينه. السعر مش ثابت في item نفسه؛ مصدره branch_options.

- **المدخلات — Arguments:** item: المنتج وقد يكون undefined؛ branchId: رقم أو نص معرّف الفرع.

- **الناتج/الأثر — Return / effect:** object خيار الفرع أو null؛ Number يوحّد نوع المعرّفات قبل المقارنة.

- **أول موضع هنا:** السطر 106، والمدخلات المكتوبة: `item`، `branchId`.

- **تكملة التعريف:** [resources/js/context/CatalogContext.jsx](../context/CatalogContext.jsx.md)، عند السطر 45.

### writeCart

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يحفظ السلة ويصدر wtc-cart-updated.

- **المدخلات — Arguments:** cart array.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 130، والمدخلات المكتوبة: `[]`.

### setMessage

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setMessage هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 157، والمدخلات المكتوبة: `error.payload?.errors ? Object.values(error.payload.errors).flat()[0] : error.message`.

### useMemo

- **جاية منين؟** React hook

- **وظيفتها:** يحفظ نتيجة حساب كتحسين أداء لحد تغير dependencies؛ callback للحساب مش مكان HTTP أو setState side effects.

- **المدخلات — Arguments:** calculate function,dependencies.

- **الناتج/الأثر — Return / effect:** القيمة المحسوبة.

- **أول موضع هنا:** السطر 120، والمدخلات المكتوبة: `() => cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0)`، `[cartItems]`.

- **مثال:** const completedOrders = useMemo(() => orders.filter((order) => order.status === 'completed'), [orders]);

### cartItems.reduce

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تجمع عناصر في نتيجة متراكمة.

- **المدخلات — Arguments:** callback(accumulator, item) وقيمة بداية اختيارية.

- **الناتج/الأثر — Return / effect:** الناتج النهائي؛ سلة فاضية مع البداية0 ترجع0.

- **أول موضع هنا:** السطر 120، والمدخلات المكتوبة: `(sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0)`، `0`.

### cartItems.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 181، والمدخلات المكتوبة: `(item) => <article className="wtc-cart-card" key={item.id}>                             <div className="wtc-cart-image">{item.image_src ? <img src={item.image_src} alt={item.name} …`.

### cartItems.filter

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تختار كل العناصر التي شرطها truthy.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** array جديدة؛ لا تحذف الأصل بنفسها.

- **أول موضع هنا:** السطر 129، والمدخلات المكتوبة: `(item) => item.id !== id`.

### setCustomer

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setCustomer هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 131، والمدخلات المكتوبة: `(current) => ({ ...current, [field]: value })`.

### setBranch

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setBranch هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 134، والمدخلات المكتوبة: `branchId`.

### [deliveryArea, deliveryAddress].filter(Boolean).join

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تجمع عناصر في نص.

- **المدخلات — Arguments:** separator اختياري.

- **الناتج/الأثر — Return / effect:** string، لا تعدّل عناصر الأصل.

- **أول موضع هنا:** السطر 143، والمدخلات المكتوبة: `', '`.

### [deliveryArea, deliveryAddress].filter

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تختار كل العناصر التي شرطها truthy.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** array جديدة؛ لا تحذف الأصل بنفسها.

- **أول موضع هنا:** السطر 143، والمدخلات المكتوبة: `Boolean`.

### setIsSubmitting

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setIsSubmitting هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 158، والمدخلات المكتوبة: `false`.

### buildPayload

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يحوّل بيانات الصفحة لشكل API: branch/order/customer/address/payment/items IDs. لا يبعث سعر المنتج كمرجع موثوق.

- **المدخلات — Arguments:** لا شيء؛ يقرأ أحدث state وقت الاستدعاء.

- **الناتج/الأثر — Return / effect:** object صالح للإرسال بعد JSON.stringify، وليس JSON string بذاته.

- **أول موضع هنا:** السطر 153.

### clearCart

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يضع [] في state وفي التخزين وينبّه Navbar بالحدث.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 194.

### navigate

- **جاية منين؟** React Router callback

- **وظيفتها:** تنقّل داخل SPA حسب route.

- **المدخلات — Arguments:** path وoptions مثل replace.

- **الناتج/الأثر — Return / effect:** void/Promise حسب نمط Router؛ مش حماية endpoint.

- **أول موضع هنا:** السطر 194، والمدخلات المكتوبة: `trackingUrl`.

### Object.values(error.payload.errors).flat

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تفرد مستويات arrays حسب العمق.

- **المدخلات — Arguments:** depth اختياري افتراضيه1.

- **الناتج/الأثر — Return / effect:** array جديدة.

- **أول موضع هنا:** السطر 157.

### Object.values

- **جاية منين؟** JavaScript Object

- **وظيفتها:** يرجع قيم خصائص object بدون مفاتيح؛ مستخدم لاستخراج validation messages.

- **المدخلات — Arguments:** object.

- **الناتج/الأثر — Return / effect:** array قيم.

- **أول موضع هنا:** السطر 157، والمدخلات المكتوبة: `error.payload.errors`.

- **مثال:** Object.values(error.payload.errors).flat()[0];

### onChange

- **جاية منين؟** Callback/دالة مأخوذة من props أو Context حسب تعريف المكوّن

- **وظيفتها:** تنادي العملية اللي الأب أو الـContext مرّرها باسم onChange؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي.

- **المدخلات — Arguments:** value

- **الناتج/الأثر — Return / effect:** العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.

- **أول موضع هنا:** السطر 163، والمدخلات المكتوبة: `value`.

### updateItem

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** ينشئ array جديدة ويستبدل العنصر المطابق بنسخة تحمل changes ثم يحدّث state والتخزين.

- **المدخلات — Arguments:** id: معرّف المنتج؛ changes: object مثل {quantity:2} أو {notes:'no onions'}.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 185، والمدخلات المكتوبة: `item.id`، `{notes:event.target.value}`.

### Math.max

- **جاية منين؟** Math / JavaScript

- **وظيفتها:** ترجع أكبر المدخلات.

- **المدخلات — Arguments:** أعداد.

- **الناتج/الأثر — Return / effect:** number.

- **أول موضع هنا:** السطر 184، والمدخلات المكتوبة: `1`، `item.quantity-1`.

### removeItem

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يستبعد سطر المنتج باستخدام filter ثم يحدّث state والتخزين.

- **المدخلات — Arguments:** id.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 184، والمدخلات المكتوبة: `item.id`.

### availableBranches.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 189، والمدخلات المكتوبة: `(branch) => selection('branch',branch.id,selectedBranchId,changeBranch,branch.name,branch.location,'\u2302',branch.id)`.

### selection

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** JSX helper يرسم radio option card ويحدد checked/class من current/value.

- **المدخلات — Arguments:** name,value,current,onChange,title,copy,icon,keyValue.

- **الناتج/الأثر — Return / effect:** JSX label/input؛ onChange(value) يصل للدالة المناسبة.

- **أول موضع هنا:** السطر 190، والمدخلات المكتوبة: `'fulfillment'`، `'pickup'`، `orderType`، `setOrderMode`، `'Pickup'`، `'Collect in store'`، `'\u25A3'`.

### updateCustomer

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يغيّر حقلًا ديناميكيًا في customer مع الاحتفاظ بباقي الحقول، باستعمال functional state update و[field].

- **المدخلات — Arguments:** field: name/phone/pickupTime؛ value: قيمة input.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 191، والمدخلات المكتوبة: `'pickupTime'`، `e.target.value`.

### setDeliveryArea

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setDeliveryArea هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 191، والمدخلات المكتوبة: `e.target.value`.

### setDeliveryAddress

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setDeliveryAddress هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 191، والمدخلات المكتوبة: `e.target.value`.

### new Date(Date.now()+20*60000).toISOString().slice

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تأخذ جزءًا بدون تعديل الأصل.

- **المدخلات — Arguments:** start وend غير شامل النهاية.

- **الناتج/الأثر — Return / effect:** نسخة array جزئية أو نص جزئي حسب المستقبِل.

- **أول موضع هنا:** السطر 191، والمدخلات المكتوبة: `0`، `16`.

### new Date(Date.now()+20*60000).toISOString

- **جاية منين؟** Date instance

- **وظيفتها:** تنسّق التاريخ بنظام UTC.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** string؛ اليوم قد يختلف عن توقيت جهازك المحلي.

- **أول موضع هنا:** السطر 191.

### Date

- **جاية منين؟** JavaScript Date

- **وظيفتها:** مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي.

- **المدخلات — Arguments:** قيمة تاريخ اختيارية.

- **الناتج/الأثر — Return / effect:** Date object عند new؛ مش string تلقائيًا.

- **أول موضع هنا:** السطر 191، والمدخلات المكتوبة: `Date.now()+20*60000`.

### Date.now

- **جاية منين؟** Date / JavaScript

- **وظيفتها:** تقرأ وقت النظام الحالي كـtimestamp.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** milliseconds منذ Unix epoch، مش Date object.

- **أول موضع هنا:** السطر 191.

### subtotal.toFixed

- **جاية منين؟** Number / JavaScript

- **وظيفتها:** تنسّق عددًا بمواضع عشرية محددة.

- **المدخلات — Arguments:** عدد الخانات.

- **الناتج/الأثر — Return / effect:** string، مش رقمًا صالحًا للحساب بدون تحويل.

- **أول موضع هنا:** السطر 192، والمدخلات المكتوبة: `2`.

### deliveryFee.toFixed

- **جاية منين؟** Number / JavaScript

- **وظيفتها:** تنسّق عددًا بمواضع عشرية محددة.

- **المدخلات — Arguments:** عدد الخانات.

- **الناتج/الأثر — Return / effect:** string، مش رقمًا صالحًا للحساب بدون تحويل.

- **أول موضع هنا:** السطر 192، والمدخلات المكتوبة: `2`.

### total.toFixed

- **جاية منين؟** Number / JavaScript

- **وظيفتها:** تنسّق عددًا بمواضع عشرية محددة.

- **المدخلات — Arguments:** عدد الخانات.

- **الناتج/الأثر — Return / effect:** string، مش رقمًا صالحًا للحساب بدون تحويل.

- **أول موضع هنا:** السطر 192، والمدخلات المكتوبة: `2`.

### setPaymentMethod

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setPaymentMethod هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 193، والمدخلات المكتوبة: `'card'`.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { csrfFetch } from '../lib/api';
import { branchOption, useCatalog } from '../context/CatalogContext';
import { useOrder } from '../context/OrderContext';

```

**السطر 1:** Import / استيراد: الأسماء `React`، `useEffect`، `useMemo`، `useState` جاية من `react`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 2:** Import / استيراد: الأسماء `Link`، `useNavigate` جاية من `react-router-dom`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 3:** Import / استيراد: الأسماء `CardElement`، `Elements`، `useElements`، `useStripe` جاية من `@stripe/react-stripe-js`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 4:** Import / استيراد: الأسماء `loadStripe` جاية من `@stripe/stripe-js`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 5:** Import / استيراد: الأسماء `csrfFetch` جاية من `../lib/api`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 6:** Import / استيراد: الأسماء `branchOption`، `useCatalog` جاية من `../context/CatalogContext`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 7:** Import / استيراد: الأسماء `useOrder` جاية من `../context/OrderContext`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

### السطور 9–16

```jsx
const isDemo = import.meta.env.VITE_DEMO_MODE === 'true';
const CART_STORAGE_KEY = isDemo ? 'wtc_demo_cart' : 'wtc_cart';
const CART_EVENT_NAME = 'wtc-cart-updated';
const stripePromise = !isDemo && import.meta.env.VITE_STRIPE_KEY ? loadStripe(import.meta.env.VITE_STRIPE_KEY) : null;
function readCart() {
    try { return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]'); } catch { return []; }
}

```

**السطر 9:** Variable declaration / تعريف `isDemo` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 10:** Variable declaration / تعريف `CART_STORAGE_KEY` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 11:** Variable declaration / تعريف `CART_EVENT_NAME` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `"wtc-cart-updated"`، مش ناتج طلب شبكة.

**السطر 12:** Variable declaration / تعريف `stripePromise` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `loadStripe(...)`: تحمّل/تجهز Stripe browser client بمفتاح عام. القيم المكتوبة هنا: `import.meta.env.VITE_STRIPE_KEY`. العائد/الأثر: Promise لـStripe object أو null حسب الظروف.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 13:** Function / تعريف دالة `readCart`؛ تعريفها مش تشغيلها. يقرأ السلة المحفوظة لوصول الصفحة أو حدث مزامنة. مدخلاتها: لا شيء. ناتجها: cart array أو [].

**السطر 14:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة. الدوال الموجودة في السطر: `JSON.parse(...)`: يفك JSON string لقيم JS؛ ممكن يرمي SyntaxError ولا يعتبر validation كامل. القيم المكتوبة هنا: `localStorage.getItem(CART_STORAGE_KEY) || '[]'`. العائد/الأثر: JS value؛ `localStorage.getItem(...)`: تقرأ النص المحفوظ تحت مفتاح. القيم المكتوبة هنا: `CART_STORAGE_KEY`. العائد/الأثر: string أو null؛ لا تعيد object تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 15:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 17–24

```jsx
function writeCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event(CART_EVENT_NAME));
}

function CardCheckout({ payload, disabled, onSuccess, onMessage }) {
    const stripe = useStripe();
    const elements = useElements();
```

**السطر 17:** Function / تعريف دالة `writeCart`؛ تعريفها مش تشغيلها. يحفظ السلة ويصدر wtc-cart-updated. مدخلاتها: cart array. ناتجها: undefined.

**السطر 18:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `localStorage.setItem(...)`: تحفظ قيمة نصية تحت مفتاح وتستبدل القديمة. القيم المكتوبة هنا: `CART_STORAGE_KEY`، `JSON.stringify(cart)`. العائد/الأثر: undefined؛ قد تفشل لو التخزين غير متاح.؛ `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `cart`. العائد/الأثر: string أو undefined لبعض القيم. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 19:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `window.dispatchEvent(...)`: ترسل Event للمستمعين على هذا الهدف بشكل متزامن. القيم المكتوبة هنا: `new Event(CART_EVENT_NAME)`. العائد/الأثر: Boolean مرتبطة بعدم إلغاء default؛ مش HTTP response.؛ `Event(...)`: تنشئ Event تحمل نوع الحدث. القيم المكتوبة هنا: `CART_EVENT_NAME`. العائد/الأثر: Event object؛ الإرسال يحتاج dispatchEvent.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 20:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 22:** Function / تعريف دالة `CardCheckout`؛ تعريفها مش تشغيلها. مكوّن داخل Elements يستخرج Stripe وElements ويرسم CardElement وزر الدفع. مدخلاتها: payload: دالة تجهيز الطلب؛ disabled؛ onSuccess؛ onMessage. ناتجها: JSX حقول الكارت.

**السطر 23:** Variable declaration / تعريف `stripe` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useStripe(...)`: تقرأ Stripe client من Elements provider. مدخلاتها: بدون arguments. العائد/الأثر: Stripe object أو null قبل الجاهزية.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 24:** Variable declaration / تعريف `elements` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useElements(...)`: تقرأ Elements manager من provider. مدخلاتها: بدون arguments. العائد/الأثر: StripeElements أو null.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 25–32

```jsx
    const [processing, setProcessing] = useState(false);

    const pay = async () => {
        if (!stripe || !elements || processing) return;
        setProcessing(true);
        onMessage('');
        const idempotencyKey = crypto.randomUUID();
        try {
```

**السطر 25:** Variable declaration / تعريف `processing + setProcessing` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `false`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 27:** Variable declaration / تعريف `pay` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `pay` هنا: يمنع التكرار المحلي، يطلب PaymentIntent باستخدام idempotency key ثم stripe.confirmCardPayment؛ يرسل رسالة وينادي onSuccess للتوجيه. المدخلات: لا شيء؛ يقرأ props وStripe refs.. الناتج/الأثر: Promise<void>..

**السطر 28:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 29:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setProcessing(...)`: لو setProcessing هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `true`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 30:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `onMessage(...)`: تنادي العملية اللي الأب أو الـContext مرّرها باسم onMessage؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي. القيم المكتوبة هنا: `''`. العائد/الأثر: العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 31:** Variable declaration / تعريف `idempotencyKey` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `crypto.randomUUID(...)`: يولّد UUID عشوائي في secure context؛ ليس authorization token. مدخلاتها: لا شيء العائد/الأثر: UUID string. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 32:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة.

### السطور 33–40

```jsx
            const response = await csrfFetch('/api/payments/intents', {
                method: 'POST',
                headers: { 'Idempotency-Key': idempotencyKey },
                body: JSON.stringify({ ...payload(), payment_method: 'card', idempotency_key: idempotencyKey }),
            });
            const result = await stripe.confirmCardPayment(response.client_secret, {
                payment_method: { card: elements.getElement(CardElement) },
            });
```

**السطر 33:** Variable declaration / تعريف `response` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `csrfFetch(...)`: توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح. القيم المكتوبة هنا: `'/api/payments/intents'`، `{                 method: 'POST',                 headers: { 'Idempotency-Key': idempotencyKey },             …`. العائد/الأثر: Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 34:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 35:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 36:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `{ ...payload(), payment_method: 'card', idempotency_key: idempotencyKey }`. العائد/الأثر: string أو undefined لبعض القيم؛ `payload(...)`: تعريف payload الكامل في الملف المرتبط. مدخلاتها:  العائد/الأثر: تتبّع return في التعريف المرتبط؛ الأثر مذكور في سياق الملف.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 37:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 38:** Variable declaration / تعريف `result` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `stripe.confirmCardPayment(...)`: تبدأ/تؤكد دفع PaymentIntent بالـclient secret. القيم المكتوبة هنا: `response.client_secret`، `{                 payment_method: { card: elements.getElement(CardElement) },             }`. العائد/الأثر: Promise لنتيجة فيها paymentIntent أو error؛ webhook يبقى مهمًا للسيرفر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 39:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `elements.getElement(...)`: تقرأ Element مركّبة من النوع المحدد. القيم المكتوبة هنا: `CardElement`. العائد/الأثر: Stripe element أو null؛ مش رقم بطاقة خام في Laravel.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 40:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 41–48

```jsx
            if (result.error) throw new Error(result.error.message);
            onMessage(`Payment received. Order #${response.order_id} is being confirmed.`);
            onSuccess(response.tracking_url);
        } catch (error) {
            onMessage(error.message || 'Card payment failed. Please try again.');
        } finally {
            setProcessing(false);
        }
```

**السطر 41:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `Error(...)`: تنشئ object خطأ برسالة؛ الرمي يحتاج throw منفصلة. القيم المكتوبة هنا: `result.error.message`. العائد/الأثر: Error object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 42:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `onMessage(...)`: تنادي العملية اللي الأب أو الـContext مرّرها باسم onMessage؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي. القيم المكتوبة هنا: `'Payment received. Order #${response.order_id} is being confirmed.'`. العائد/الأثر: العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 43:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `onSuccess(...)`: تنادي العملية اللي الأب أو الـContext مرّرها باسم onSuccess؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي. القيم المكتوبة هنا: `response.tracking_url`. العائد/الأثر: العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 44:** Catch: استقبل الخطأ من try/Promise حسب السياق وتعامل مع رسالته؛ catch لا تعني نجاح الطلب الأصلي.

**السطر 45:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `onMessage(...)`: تنادي العملية اللي الأب أو الـContext مرّرها باسم onMessage؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي. القيم المكتوبة هنا: `error.message || 'Card payment failed. Please try again.'`. العائد/الأثر: العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 46:** Finally: تنظيف/إرجاع حالة الانشغال بعد try سواء نجحت أو فشلت.

**السطر 47:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setProcessing(...)`: لو setProcessing هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `false`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 48:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 49–56

```jsx
    };

    return (
        <div className="wtc-card-fields">
            <label className="form-label fw-bold" htmlFor="card-element">Card details</label>
            <div id="card-element" className="wtc-card-element">
                <CardElement options={{ style: { base: { color: '#fff', fontSize: '16px', '::placeholder': { color: '#8f8f8f' } } } }} />
            </div>
```

**السطر 49:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 51:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 52:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 53:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 54:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 55:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 56:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 57–64

```jsx
            <button type="button" className="btn btn-red w-100 mt-3" disabled={disabled || processing || !stripe} onClick={pay}>
                {processing ? 'Processing securely...' : 'Pay by Card'}
            </button>
        </div>
    );
}

export default function Cart() {
```

**السطر 57:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها.

**السطر 58:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 59:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 60:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 61:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 62:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 64:** Function / تعريف دالة `Cart`؛ تعريفها مش تشغيلها. صفحة /cart الفعلية وتحتوي handlers للكميات والملاحظات والعميل والـ checkout. مدخلاتها: contexts. ناتجها: JSX main.

### السطور 65–72

```jsx
    const { branches, items, loading: catalogLoading, error: catalogError, reload: reloadCatalog } = useCatalog();
    const navigate = useNavigate();
    const {
        mode: orderType,
        branchId: selectedBranchId,
        selectedBranch,
        availableBranches,
        deliveryAddress,
```

**السطر 65:** Variable declaration / تعريف اسم/أسماء لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useCatalog(...)`: يوصل المكوّن إلى الكتالوج المشترك؛ يفشل بوضوح لو Provider غير موجود. مدخلاتها: لا شيء. العائد/الأثر: branches/categories/items/loading/error/reload.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 66:** Variable declaration / تعريف `navigate` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useNavigate(...)`: يوفر function للتنقل داخل SPA؛ replace=true يستبدل history entry الحالية. مدخلاتها: لا شيء عند إنشاء hook. العائد/الأثر: navigate function.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 67:** Variable declaration / تعريف اسم/أسماء لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 68:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 69:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 70:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 71:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 72:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 73–80

```jsx
        deliveryArea,
        notice,
        setOrderMode,
        setBranch,
        setDeliveryAddress,
        setDeliveryArea,
        clearNotice,
    } = useOrder();
```

**السطر 73:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 74:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 75:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 76:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 77:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 78:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 79:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 80:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useOrder(...)`: Custom hook يقرأ اختيار الفرع وطريقة الاستلام والعنوان ودوال تغييرها. مدخلاتها: لا شيء. العائد/الأثر: value الخاص بـ OrderContext أو يرمي خطأ لو خارج Provider.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 81–88

```jsx
    const [cartItems, setCartItems] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [customer, setCustomer] = useState({ name: '', phone: '', pickupTime: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const sync = () => setCartItems(readCart());
```

**السطر 81:** Variable declaration / تعريف `cartItems + setCartItems` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `[]`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 82:** Variable declaration / تعريف `paymentMethod + setPaymentMethod` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `'cash'`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 83:** Variable declaration / تعريف `customer + setCustomer` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `{ name: '', phone: '', pickupTime: '' }`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 84:** Variable declaration / تعريف `isSubmitting + setIsSubmitting` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `false`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 85:** Variable declaration / تعريف `message + setMessage` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `''`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 87:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `() => {         const sync = () => setCartItems(readCart());         sync();         window.addEventListener('…`، `[]`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 88:** Variable declaration / تعريف `sync` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `sync` هنا: يقرأ التخزين ويحدث cartItems عند أول effect أو storage/custom event. المدخلات: لا مدخل مستخدم.. الناتج/الأثر: undefined.. الدوال الموجودة في السطر: `setCartItems(...)`: لو setCartItems هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `readCart()`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `readCart(...)`: يقرأ السلة المحفوظة لوصول الصفحة أو حدث مزامنة. مدخلاتها: لا شيء. العائد/الأثر: cart array أو [].. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 89–96

```jsx
        sync();
        window.addEventListener('storage', sync);
        window.addEventListener(CART_EVENT_NAME, sync);
        return () => { window.removeEventListener('storage', sync); window.removeEventListener(CART_EVENT_NAME, sync); };
    }, []);

    useEffect(() => {
        if (!items.length || !branches.length || !cartItems.length) return;
```

**السطر 89:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `sync(...)`: يقرأ التخزين ويحدث cartItems عند أول effect أو storage/custom event. مدخلاتها: لا مدخل مستخدم. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 90:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `window.addEventListener(...)`: تسجّل listener؛ مصدر الحدث يناديها ويمرر Event. القيم المكتوبة هنا: `'storage'`، `sync`. العائد/الأثر: undefined؛ لا تشغّل handler لحظة التسجيل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 91:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `window.addEventListener(...)`: تسجّل listener؛ مصدر الحدث يناديها ويمرر Event. القيم المكتوبة هنا: `CART_EVENT_NAME`، `sync`. العائد/الأثر: undefined؛ لا تشغّل handler لحظة التسجيل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 92:** Return / رجّع `() => { window.removeEventListener('storage', sync); window.removeEventListener(CART_EVENT_NAME, sync); }` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `window.removeEventListener(...)`: تلغي listener بنفس الاسم ومرجع الدالة وcapture المناسب. القيم المكتوبة هنا: `CART_EVENT_NAME`، `sync`. العائد/الأثر: undefined؛ لا توقف الحدث نفسه.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 93:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 95:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `() => {         if (!items.length || !branches.length || !cartItems.length) return;         let removed = 0;  …`، `[branches, items, cartItems, selectedBranchId]`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 96:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

### السطور 97–104

```jsx
        let removed = 0;
        const normalized = cartItems.flatMap((line) => {
            const item = items.find((candidate) => candidate.id === line.id);
            if (!item || item.name !== line.name) {
                removed += 1;
                return [];
            }
            const branchId = Number(line.branch_id || selectedBranchId || branches[0].id);
```

**السطر 97:** Variable declaration / تعريف `removed` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `0`، مش ناتج طلب شبكة.

**السطر 98:** Variable declaration / تعريف `normalized` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `cartItems.flatMap(...)`: تحوّل العناصر ثم تفرد مستوى array واحد. القيم المكتوبة هنا: `(line) => {             const item = items.find((candidate) => candidate.id === line.id);             if (!ite…`. العائد/الأثر: array جديدة؛ [] من callback تشيل العنصر من الناتج.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 99:** Variable declaration / تعريف `item` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `items.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(candidate) => candidate.id === line.id`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 100:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 101:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 102:** Return / رجّع `[]` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 103:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 104:** Variable declaration / تعريف `branchId` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `line.branch_id || selectedBranchId || branches[0].id`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 105–112

```jsx
            const branch = branches.find((candidate) => candidate.id === branchId);
            const option = branchOption(item, branchId);
            if (!branch || !option?.is_available) {
                removed += 1;
                return [];
            }
            return [{ ...line, name: item.name, description: item.description, image_src: item.image_path, price: Number(option.price), branch_id: branch.id, branch_name: branch.name }];
        });
```

**السطر 105:** Variable declaration / تعريف `branch` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `branches.find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(candidate) => candidate.id === branchId`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 106:** Variable declaration / تعريف `option` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `branchOption(...)`: يبحث عن سعر وتوفر منتج في فرع بعينه. السعر مش ثابت في item نفسه؛ مصدره branch_options. القيم المكتوبة هنا: `item`، `branchId`. العائد/الأثر: object خيار الفرع أو null؛ Number يوحّد نوع المعرّفات قبل المقارنة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 107:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 108:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 109:** Return / رجّع `[]` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 110:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 111:** Return / رجّع `[{ ...line, name: item.name, description: item.description, image_src: item.image_path, price: Number(option.price), branch_id: branch.id, branch_name: branch.name }]` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `option.price`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 112:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 113–120

```jsx
        if (JSON.stringify(normalized) !== JSON.stringify(cartItems)) {
            setCartItems(normalized);
            writeCart(normalized);
            if (removed) setMessage('The menu changed, so unavailable or outdated cart items were removed.');
        }
    }, [branches, items, cartItems, selectedBranchId]);

    const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0), [cartItems]);
```

**السطر 113:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `cartItems`. العائد/الأثر: string أو undefined لبعض القيم. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 114:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setCartItems(...)`: لو setCartItems هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `normalized`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 115:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `writeCart(...)`: يحفظ السلة ويصدر wtc-cart-updated. القيم المكتوبة هنا: `normalized`. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 116:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `setMessage(...)`: لو setMessage هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `'The menu changed, so unavailable or outdated cart items were removed.'`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 117:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 118:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 120:** Variable declaration / تعريف `subtotal` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useMemo(...)`: يحفظ نتيجة حساب كتحسين أداء لحد تغير dependencies؛ callback للحساب مش مكان HTTP أو setState side effects. القيم المكتوبة هنا: `() => cartItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0)`، `[cartItems]`. العائد/الأثر: القيمة المحسوبة.؛ `cartItems.reduce(...)`: تجمع عناصر في نتيجة متراكمة. القيم المكتوبة هنا: `(sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0)`، `0`. العائد/الأثر: الناتج النهائي؛ سلة فاضية مع البداية0 ترجع0.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `item.quantity || 0`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 121–128

```jsx
    const deliveryFee = orderType === 'delivery' && cartItems.length ? Number(selectedBranch?.delivery_fee || 0) : 0;
    const total = subtotal + deliveryFee;

    const updateItem = (id, changes) => {
        const next = cartItems.map((item) => item.id === id ? { ...item, ...changes } : item);
        setCartItems(next);
        writeCart(next);
    };
```

**السطر 121:** Variable declaration / تعريف `deliveryFee` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `selectedBranch?.delivery_fee || 0`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 122:** Variable declaration / تعريف `total` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 124:** Variable declaration / تعريف `updateItem` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `updateItem` هنا: ينشئ array جديدة ويستبدل العنصر المطابق بنسخة تحمل changes ثم يحدّث state والتخزين. المدخلات: id: معرّف المنتج؛ changes: object مثل {quantity:2} أو {notes:'no onions'}.. الناتج/الأثر: undefined..

**السطر 125:** Variable declaration / تعريف `next` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `cartItems.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(item) => item.id === id ? { ...item, ...changes } : item`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 126:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setCartItems(...)`: لو setCartItems هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `next`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 127:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `writeCart(...)`: يحفظ السلة ويصدر wtc-cart-updated. القيم المكتوبة هنا: `next`. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 128:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 129–136

```jsx
    const removeItem = (id) => { const next = cartItems.filter((item) => item.id !== id); setCartItems(next); writeCart(next); };
    const clearCart = () => { setCartItems([]); writeCart([]); };
    const updateCustomer = (field, value) => setCustomer((current) => ({ ...current, [field]: value }));

    const changeBranch = (branchId) => {
        if (!setBranch(branchId)) return;
        setCartItems(readCart());
    };
```

**السطر 129:** Variable declaration / تعريف `removeItem`، `next` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `removeItem` هنا: يستبعد سطر المنتج باستخدام filter ثم يحدّث state والتخزين. المدخلات: id.. الناتج/الأثر: undefined.. الدوال الموجودة في السطر: `cartItems.filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `(item) => item.id !== id`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.؛ `setCartItems(...)`: لو setCartItems هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `next`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `writeCart(...)`: يحفظ السلة ويصدر wtc-cart-updated. القيم المكتوبة هنا: `next`. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 130:** Variable declaration / تعريف `clearCart` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `clearCart` هنا: يضع [] في state وفي التخزين وينبّه Navbar بالحدث. المدخلات: لا شيء.. الناتج/الأثر: undefined.. الدوال الموجودة في السطر: `setCartItems(...)`: لو setCartItems هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `[]`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `writeCart(...)`: يحفظ السلة ويصدر wtc-cart-updated. القيم المكتوبة هنا: `[]`. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 131:** Variable declaration / تعريف `updateCustomer` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `updateCustomer` هنا: يغيّر حقلًا ديناميكيًا في customer مع الاحتفاظ بباقي الحقول، باستعمال functional state update و[field]. المدخلات: field: name/phone/pickupTime؛ value: قيمة input.. الناتج/الأثر: undefined.. الدوال الموجودة في السطر: `setCustomer(...)`: لو setCustomer هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `(current) => ({ ...current, [field]: value })`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 133:** Variable declaration / تعريف `changeBranch` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `changeBranch` هنا: ينادي setBranch من OrderContext ثم يعيد تحميل السلة بعد إعادة التسعير. المدخلات: branchId.. الناتج/الأثر: undefined..

**السطر 134:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `setBranch(...)`: لو setBranch هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `branchId`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 135:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setCartItems(...)`: لو setCartItems هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `readCart()`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `readCart(...)`: يقرأ السلة المحفوظة لوصول الصفحة أو حدث مزامنة. مدخلاتها: لا شيء. العائد/الأثر: cart array أو [].. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 136:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 137–144

```jsx

    const buildPayload = () => ({
        branch_id: Number(selectedBranchId),
        order_type: orderType,
        customer_name: customer.name,
        customer_phone: customer.phone,
        delivery_address: orderType === 'delivery' ? [deliveryArea, deliveryAddress].filter(Boolean).join(', ') : null,
        pickup_time: orderType === 'pickup' ? customer.pickupTime : null,
```

**السطر 138:** Variable declaration / تعريف `buildPayload` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `buildPayload` هنا: يحوّل بيانات الصفحة لشكل API: branch/order/customer/address/payment/items IDs. لا يبعث سعر المنتج كمرجع موثوق. المدخلات: لا شيء؛ يقرأ أحدث state وقت الاستدعاء.. الناتج/الأثر: object صالح للإرسال بعد JSON.stringify، وليس JSON string بذاته..

**السطر 139:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `selectedBranchId`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 140:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 141:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 142:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 143:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `[deliveryArea, deliveryAddress].filter(Boolean).join(...)`: تجمع عناصر في نص. القيم المكتوبة هنا: `', '`. العائد/الأثر: string، لا تعدّل عناصر الأصل.؛ `[deliveryArea, deliveryAddress].filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `Boolean`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 144:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 145–152

```jsx
        payment_method: paymentMethod,
        items: cartItems.map((item) => ({ menu_item_id: item.id, quantity: item.quantity, notes: item.notes || null })),
    });

    const submitCashOrder = async () => {
        setMessage('');
        setIsSubmitting(true);
        try {
```

**السطر 145:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 146:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `cartItems.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(item) => ({ menu_item_id: item.id, quantity: item.quantity, notes: item.notes || null })`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 147:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 149:** Variable declaration / تعريف `submitCashOrder` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `submitCashOrder` هنا: يبعت payload إلى POST /api/orders، يفرغ السلة ويوجّه tracking_url؛ catch يعرض أول validation error؛ finally يوقف loading. المدخلات: لا شيء.. الناتج/الأثر: Promise<void>..

**السطر 150:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setMessage(...)`: لو setMessage هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `''`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 151:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setIsSubmitting(...)`: لو setIsSubmitting هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `true`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 152:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة.

### السطور 153–160

```jsx
            const response = await csrfFetch('/api/orders', { method: 'POST', body: JSON.stringify(buildPayload()) });
            clearCart();
            navigate(response.tracking_url);
        } catch (error) {
            setMessage(error.payload?.errors ? Object.values(error.payload.errors).flat()[0] : error.message);
        } finally { setIsSubmitting(false); }
    };

```

**السطر 153:** Variable declaration / تعريف `response` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `csrfFetch(...)`: توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح. القيم المكتوبة هنا: `'/api/orders'`، `{ method: 'POST', body: JSON.stringify(buildPayload()) }`. العائد/الأثر: Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.؛ `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `buildPayload()`. العائد/الأثر: string أو undefined لبعض القيم؛ `buildPayload(...)`: يحوّل بيانات الصفحة لشكل API: branch/order/customer/address/payment/items IDs. لا يبعث سعر المنتج كمرجع موثوق. مدخلاتها: لا شيء؛ يقرأ أحدث state وقت الاستدعاء. العائد/الأثر: object صالح للإرسال بعد JSON.stringify، وليس JSON string بذاته.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 154:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `clearCart(...)`: يضع [] في state وفي التخزين وينبّه Navbar بالحدث. مدخلاتها: لا شيء. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 155:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `navigate(...)`: تنقّل داخل SPA حسب route. القيم المكتوبة هنا: `response.tracking_url`. العائد/الأثر: void/Promise حسب نمط Router؛ مش حماية endpoint.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 156:** Catch: استقبل الخطأ من try/Promise حسب السياق وتعامل مع رسالته؛ catch لا تعني نجاح الطلب الأصلي.

**السطر 157:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setMessage(...)`: لو setMessage هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `error.payload?.errors ? Object.values(error.payload.errors).flat()[0] : error.message`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `Object.values(error.payload.errors).flat(...)`: تفرد مستويات arrays حسب العمق. مدخلاتها: depth اختياري افتراضيه1. العائد/الأثر: array جديدة.؛ `Object.values(...)`: يرجع قيم خصائص object بدون مفاتيح؛ مستخدم لاستخراج validation messages. القيم المكتوبة هنا: `error.payload.errors`. العائد/الأثر: array قيم.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 158:** Finally: تنظيف/إرجاع حالة الانشغال بعد try سواء نجحت أو فشلت. الدوال الموجودة في السطر: `setIsSubmitting(...)`: لو setIsSubmitting هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `false`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 159:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 161–168

```jsx
    const selection = (name, value, current, onChange, title, copy, icon, keyValue) => (
        <label key={keyValue ?? value} className={`wtc-option-card ${Number(current) === Number(value) || current === value ? 'is-selected' : ''}`}>
            <input type="radio" name={name} value={value} checked={Number(current) === Number(value) || current === value} onChange={() => onChange(value)} />
            <span className="wtc-option-icon" aria-hidden="true">{icon}</span>
            <span><strong>{title}</strong><small>{copy}</small></span>
        </label>
    );

```

**السطر 161:** Variable declaration / تعريف `selection` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `selection` هنا: JSX helper يرسم radio option card ويحدد checked/class من current/value. المدخلات: name,value,current,onChange,title,copy,icon,keyValue.. الناتج/الأثر: JSX label/input؛ onChange(value) يصل للدالة المناسبة..

**السطر 162:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض. الدوال الموجودة في السطر: `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `value`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 163:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `value`. العائد/الأثر: number أو NaN.؛ `onChange(...)`: تنادي العملية اللي الأب أو الـContext مرّرها باسم onChange؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي. القيم المكتوبة هنا: `value`. العائد/الأثر: العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 164:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 165:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 166:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 167:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 169–176

```jsx
    const disabled = !selectedBranchId || !cartItems.length || !customer.name || !customer.phone || (orderType === 'delivery' && (!deliveryArea || !deliveryAddress)) || (orderType === 'pickup' && !customer.pickupTime);

    return (
        <main className="wtc-cart-page">
            <style>{`
                .wtc-cart-page{min-height:100vh;padding:8rem 0 5rem;background:#121212;color:#f5f5f5}.wtc-cart-title{font-size:clamp(2.7rem,5vw,5.5rem);line-height:.95;font-weight:1000;letter-spacing:0}.wtc-cart-copy{color:#aaa}.wtc-cart-card,.wtc-cart-summary{border:1px solid rgba(255,255,255,.08);border-radius:8px;background:#1b1b1b}.wtc-cart-card{display:grid;grid-template-columns:120px 1fr auto;gap:1rem;padding:1rem;align-items:start}.wtc-cart-image{width:120px;height:96px;border-radius:8px;overflow:hidden}.wtc-cart-image img{width:100%;height:100%;object-fit:cover}.wtc-item-notes{grid-column:2/-1}.wtc-item-notes textarea,.wtc-field{width:100%;border:1px solid rgba(255,255,255,.13);border-radius:6px;background:#111;color:#fff;padding:.75rem}.wtc-counter{display:block;text-align:right;color:#888;font-size:.75rem}.wtc-cart-price{color:#ed3434;font-weight:900}.wtc-quantity-control{display:flex;align-items:center;gap:.6rem}.wtc-quantity-control button{width:34px;height:34px;border:0;border-radius:50%;background:#333;color:#fff}.wtc-remove-btn{border:0;background:none;color:#ff7b7b}.wtc-cart-summary{position:sticky;top:106px;padding:1.4rem}.wtc-option-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.65rem}.wtc-option-card{position:relative;display:flex;gap:.7rem;align-items:center;padding:.85rem;border:1px solid #393939;border-radius:8px;background:#171717;cursor:pointer}.wtc-option-card:focus-within{outline:2px solid #ed3434;outline-offset:2px}.wtc-option-card.is-selected{border-color:#ed3434;background:rgba(227,36,36,.1)}.wtc-option-card input{position:absolute;opacity:0}.wtc-option-card small{display:block;color:#929292;font-size:.72rem}.wtc-option-icon{font-size:1.3rem}.wtc-summary-line,.wtc-summary-total{display:flex;justify-content:space-between;padding:.75rem 0;border-bottom:1px solid #303030}.wtc-summary-total{font-size:1.2rem;font-weight:900;border:0}.wtc-card-element{padding:.85rem;border:1px solid #444;border-radius:6px;background:#111}.wtc-cart-message{margin-top:1rem;padding:.8rem;border-radius:6px;background:rgba(241,168,58,.1);color:#f1a83a}.wtc-payment-tabs{display:grid;grid-template-columns:1fr 1fr;gap:.5rem}.wtc-payment-tabs button{padding:.7rem;border:1px solid #444;background:#171717;color:#ddd;border-radius:6px}.wtc-payment-tabs button.active{border-color:#ed3434;color:#fff;background:rgba(227,36,36,.12)}@media(max-width:767px){.wtc-cart-page{padding-top:6.5rem}.wtc-cart-card{grid-template-columns:82px 1fr}.wtc-cart-image{width:82px;height:82px}.wtc-cart-actions,.wtc-item-notes{grid-column:1/-1}.wtc-cart-summary{position:static}.wtc-option-grid{grid-template-columns:1fr}}
            `}</style>
            <div className="container">
```

**السطر 169:** Variable declaration / تعريف `disabled` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 171:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 172:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 173:** بداية CSS / تنسيق؛ لو scoped فـVue تضيف عزلًا بالـattributes أثناء البناء.

**السطر 174:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 175:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 176:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 177–184

```jsx
                {isDemo && <p className="wtc-cart-message" role="status">Place a sample order using made-up details. No food will be prepared and no payment is collected.</p>}
                <div className="row g-4 align-items-end mb-5"><div className="col-12 col-lg-7"><p className="eyebrow">Your Cart</p><h1 className="wtc-cart-title">Review your order.</h1></div><div className="col-12 col-lg-5"><p className="wtc-cart-copy mb-0">Choose how you want it, add any kitchen notes, and check out securely.</p></div></div>
                <div className="row g-4">
                    <div className="col-12 col-lg-8">
                        {!cartItems.length ? <div className="wtc-cart-card d-block text-center p-5"><h2>Your cart is empty.</h2><Link to="/menu" className="btn btn-red">View Menu</Link></div> : <div className="d-grid gap-3">{cartItems.map((item) => <article className="wtc-cart-card" key={item.id}>
                            <div className="wtc-cart-image">{item.image_src ? <img src={item.image_src} alt={item.name} loading="lazy" /> : <span className="menu-image-placeholder" role="img" aria-label={`${item.name} photo coming soon`}>WTC</span>}</div>
                            <div><h3 className="h5 fw-bold">{item.name}</h3><p className="wtc-cart-copy mb-2">{item.description}</p><span className="wtc-cart-price">EGP {item.price}</span></div>
                            <div className="wtc-cart-actions d-flex flex-column align-items-end gap-2"><div className="wtc-quantity-control"><button type="button" aria-label={`Decrease ${item.name}`} disabled={item.quantity <= 1} onClick={() => updateItem(item.id,{quantity:Math.max(1,item.quantity-1)})}>-</button><strong>{item.quantity}</strong><button type="button" aria-label={`Increase ${item.name}`} onClick={() => updateItem(item.id,{quantity:item.quantity+1})}>+</button></div><button type="button" className="wtc-remove-btn" onClick={() => removeItem(item.id)}>Remove</button></div>
```

**السطر 177:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 178:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 179:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 180:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 181:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `cartItems.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(item) => <article className="wtc-cart-card" key={item.id}>                             <div className="wtc-ca…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 182:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 183:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 184:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `updateItem(...)`: ينشئ array جديدة ويستبدل العنصر المطابق بنسخة تحمل changes ثم يحدّث state والتخزين. القيم المكتوبة هنا: `item.id`، `{quantity:item.quantity+1}`. العائد/الأثر: undefined.؛ `Math.max(...)`: ترجع أكبر المدخلات. القيم المكتوبة هنا: `1`، `item.quantity-1`. العائد/الأثر: number.؛ `removeItem(...)`: يستبعد سطر المنتج باستخدام filter ثم يحدّث state والتخزين. القيم المكتوبة هنا: `item.id`. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 185–192

```jsx
                            <div className="wtc-item-notes"><label className="form-label fw-bold" htmlFor={`notes-${item.id}`}>Kitchen notes <span className="fw-normal text-secondary">(optional)</span></label><textarea id={`notes-${item.id}`} rows="2" maxLength="200" value={item.notes || ''} onChange={(event) => updateItem(item.id,{notes:event.target.value})} placeholder="Want to add or remove something? e.g. no onions, extra cheese"/><small className="wtc-counter">{(item.notes || '').length}/200</small></div>
                        </article>)}</div>}
                    </div>
                    <div className="col-12 col-lg-4"><aside className="wtc-cart-summary"><h2 className="h4 fw-bold mb-4">Order Summary</h2>
                        <fieldset className="mb-4" disabled={catalogLoading}><legend className="h6 fw-bold">Branch</legend>{catalogLoading && <p className="text-secondary small" role="status">Loading branches...</p>}{catalogError && <div className="wtc-cart-message" role="alert">{catalogError} <button type="button" className="btn btn-sm btn-outline-light ms-2" onClick={reloadCatalog}>Retry</button></div>}<div className="d-grid gap-2">{availableBranches.map((branch) => selection('branch',branch.id,selectedBranchId,changeBranch,branch.name,branch.location,'\u2302',branch.id))}</div></fieldset>
                        <fieldset className="mb-4"><legend className="h6 fw-bold">Fulfillment</legend><div className="wtc-option-grid">{selection('fulfillment','delivery',orderType,setOrderMode,'Delivery','To your door','\u2192')}{selection('fulfillment','pickup',orderType,setOrderMode,'Pickup','Collect in store','\u25A3')}</div></fieldset>
                        <div className="d-grid gap-3 mb-4"><div><label htmlFor="customer-name" className="form-label fw-bold">Name</label><input id="customer-name" className="wtc-field" value={customer.name} onChange={(e)=>updateCustomer('name',e.target.value)} required /></div><div><label htmlFor="customer-phone" className="form-label fw-bold">Phone</label><input id="customer-phone" type="tel" className="wtc-field" value={customer.phone} onChange={(e)=>updateCustomer('phone',e.target.value)} required /></div>{orderType==='delivery'?<><div><label htmlFor="delivery-area" className="form-label fw-bold">Delivery area</label><input id="delivery-area" className="wtc-field" value={deliveryArea} onChange={(e)=>setDeliveryArea(e.target.value)} required /></div><div><label htmlFor="delivery-address" className="form-label fw-bold">Delivery address</label><textarea id="delivery-address" className="wtc-field" value={deliveryAddress} onChange={(e)=>setDeliveryAddress(e.target.value)} required /></div></>:<div><label htmlFor="pickup-time" className="form-label fw-bold">Estimated arrival time</label><input id="pickup-time" type="datetime-local" className="wtc-field" value={customer.pickupTime} min={new Date(Date.now()+20*60000).toISOString().slice(0,16)} onChange={(e)=>updateCustomer('pickupTime',e.target.value)} required /><small className="text-secondary">Allow at least 20 minutes for preparation. {selectedBranch?.opening_hours && `Open ${selectedBranch.opening_hours}.`}</small></div>}</div>
                        <div className="wtc-summary-line"><span>Subtotal</span><strong>EGP {subtotal.toFixed(2)}</strong></div><div className="wtc-summary-line"><span>Delivery fee</span><strong>EGP {deliveryFee.toFixed(2)}</strong></div><div className="wtc-summary-total"><span>Total</span><strong>EGP {total.toFixed(2)}</strong></div>
```

**السطر 185:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `updateItem(...)`: ينشئ array جديدة ويستبدل العنصر المطابق بنسخة تحمل changes ثم يحدّث state والتخزين. القيم المكتوبة هنا: `item.id`، `{notes:event.target.value}`. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 186:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 187:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 188:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 189:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `availableBranches.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(branch) => selection('branch',branch.id,selectedBranchId,changeBranch,branch.name,branch.location,'\u2302',br…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `selection(...)`: JSX helper يرسم radio option card ويحدد checked/class من current/value. القيم المكتوبة هنا: `'branch'`، `branch.id`، `selectedBranchId`، `changeBranch`، `branch.name`، `branch.location`، `'\u2302'`، `branch.id`. العائد/الأثر: JSX label/input؛ onChange(value) يصل للدالة المناسبة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 190:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض. الدوال الموجودة في السطر: `selection(...)`: JSX helper يرسم radio option card ويحدد checked/class من current/value. القيم المكتوبة هنا: `'fulfillment'`، `'pickup'`، `orderType`، `setOrderMode`، `'Pickup'`، `'Collect in store'`، `'\u25A3'`. العائد/الأثر: JSX label/input؛ onChange(value) يصل للدالة المناسبة.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 191:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `updateCustomer(...)`: يغيّر حقلًا ديناميكيًا في customer مع الاحتفاظ بباقي الحقول، باستعمال functional state update و[field]. القيم المكتوبة هنا: `'pickupTime'`، `e.target.value`. العائد/الأثر: undefined.؛ `setDeliveryArea(...)`: لو setDeliveryArea هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `e.target.value`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `setDeliveryAddress(...)`: لو setDeliveryAddress هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `e.target.value`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `new Date(Date.now()+20*60000).toISOString().slice(...)`: تأخذ جزءًا بدون تعديل الأصل. القيم المكتوبة هنا: `0`، `16`. العائد/الأثر: نسخة array جزئية أو نص جزئي حسب المستقبِل.؛ `new Date(Date.now()+20*60000).toISOString(...)`: تنسّق التاريخ بنظام UTC. مدخلاتها: بدون مدخلات. العائد/الأثر: string؛ اليوم قد يختلف عن توقيت جهازك المحلي.؛ `Date(...)`: مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي. القيم المكتوبة هنا: `Date.now()+20*60000`. العائد/الأثر: Date object عند new؛ مش string تلقائيًا.؛ `Date.now(...)`: تقرأ وقت النظام الحالي كـtimestamp. مدخلاتها: بدون مدخلات. العائد/الأثر: milliseconds منذ Unix epoch، مش Date object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 192:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض. الدوال الموجودة في السطر: `subtotal.toFixed(...)`: تنسّق عددًا بمواضع عشرية محددة. القيم المكتوبة هنا: `2`. العائد/الأثر: string، مش رقمًا صالحًا للحساب بدون تحويل.؛ `deliveryFee.toFixed(...)`: تنسّق عددًا بمواضع عشرية محددة. القيم المكتوبة هنا: `2`. العائد/الأثر: string، مش رقمًا صالحًا للحساب بدون تحويل.؛ `total.toFixed(...)`: تنسّق عددًا بمواضع عشرية محددة. القيم المكتوبة هنا: `2`. العائد/الأثر: string، مش رقمًا صالحًا للحساب بدون تحويل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 193–200

```jsx
                        <div className="wtc-payment-tabs mb-3" role="group" aria-label="Payment method"><button type="button" className={paymentMethod==='cash'?'active':''} onClick={()=>setPaymentMethod('cash')}>{orderType==='pickup'?'Pay at pickup':'Cash on delivery'}</button><button type="button" className={paymentMethod==='card'?'active':''} onClick={()=>setPaymentMethod('card')}>Pay by card</button></div>
                        {paymentMethod==='cash'?<button type="button" className="btn btn-red w-100" disabled={disabled||isSubmitting} onClick={submitCashOrder}>{isSubmitting?'Confirming...':'Confirm Order'}</button>:stripePromise?<Elements stripe={stripePromise}><CardCheckout payload={buildPayload} disabled={disabled} onSuccess={(trackingUrl)=>{clearCart();navigate(trackingUrl);}} onMessage={setMessage}/></Elements>:<div className="wtc-cart-message">Card payments need VITE_STRIPE_KEY configured.</div>}
                        {!!cartItems.length&&<button type="button" className="btn btn-outline-glow w-100 mt-3" onClick={clearCart}>Clear Cart</button>}{(message||notice)&&<div className="wtc-cart-message" role="status" onClick={clearNotice}>{message||notice}</div>}
                    </aside></div>
                </div>
            </div>
        </main>
    );
```

**السطر 193:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `setPaymentMethod(...)`: لو setPaymentMethod هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `'card'`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 194:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `clearCart(...)`: يضع [] في state وفي التخزين وينبّه Navbar بالحدث. مدخلاتها: لا شيء. العائد/الأثر: undefined.؛ `navigate(...)`: تنقّل داخل SPA حسب route. القيم المكتوبة هنا: `trackingUrl`. العائد/الأثر: void/Promise حسب نمط Router؛ مش حماية endpoint.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 195:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها.

**السطر 196:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 197:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 198:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 199:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 200:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 201–202

```jsx
}

```

**السطر 201:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
