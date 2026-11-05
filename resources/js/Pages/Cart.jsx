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
