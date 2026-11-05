import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { csrfFetch } from '../lib/api';

const STATUS_LABELS = {
    payment_pending: 'Confirming payment',
    new: 'Received',
    accepted: 'Accepted',
    preparing: 'Preparing',
    ready: 'Ready',
    out_for_delivery: 'Out for delivery',
    picked_up: 'Picked up',
    completed: 'Completed',
    cancelled: 'Cancelled',
    rejected: 'Rejected',
};

function statusSteps(order) {
    return order.order_type === 'delivery'
        ? ['new', 'preparing', 'ready', 'out_for_delivery', 'completed']
        : ['new', 'preparing', 'ready', 'picked_up', 'completed'];
}

export default function OrderTracking() {
    const { token } = useParams();
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [updatedAt, setUpdatedAt] = useState(null);

    const loadOrder = useCallback(async () => {
        try {
            const response = await csrfFetch('/api/orders/track/' + encodeURIComponent(token));
            setOrder(response.order);
            setError('');
            setUpdatedAt(new Date());
        } catch (requestError) {
            setError(requestError.payload?.message || (requestError.message === 'Not Found' ? 'Order not found.' : requestError.message));
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        loadOrder();
        const timer = window.setInterval(loadOrder, 7000);
        return () => window.clearInterval(timer);
    }, [loadOrder]);

    const steps = useMemo(() => order ? statusSteps(order) : [], [order]);
    const visibleStatus = order?.status === 'accepted' ? 'preparing' : order?.status;
    const currentIndex = steps.indexOf(visibleStatus);
    const closed = ['cancelled', 'rejected'].includes(order?.status);

    if (loading) return <main className="wtc-tracking-page"><div className="container">Loading your order...</div></main>;
    if (error || !order) return <main className="wtc-tracking-page"><div className="container"><section className="wtc-track-empty"><p className="eyebrow">Order tracking</p><h1>We could not find that order.</h1><p>The tracking link may be incomplete or expired.</p><Link to="/menu" className="btn btn-red">Back to menu</Link></section></div></main>;

    return (
        <main className="wtc-tracking-page">
            <style>{`
                .wtc-tracking-page{min-height:100vh;padding:8rem 0 5rem;background:#111;color:#f5f5f5}.wtc-track-head{display:flex;align-items:end;justify-content:space-between;gap:1rem;margin-bottom:2rem}.wtc-track-head h1{font-size:clamp(2.2rem,5vw,4.8rem);font-weight:1000;letter-spacing:0}.wtc-live-dot{display:inline-flex;align-items:center;gap:.5rem;color:#aaa;font-size:.8rem}.wtc-live-dot::before{content:'';width:8px;height:8px;border-radius:50%;background:#54c77b;box-shadow:0 0 0 5px rgba(84,199,123,.12)}.wtc-track-grid{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(280px,.75fr);gap:1rem}.wtc-track-panel{border:1px solid #303030;border-radius:8px;padding:1.25rem;background:#1a1a1a}.wtc-timeline{display:grid;grid-template-columns:repeat(5,1fr);margin:2rem 0}.wtc-step{position:relative;text-align:center;color:#747474}.wtc-step::before{content:'';position:absolute;left:-50%;right:50%;top:13px;height:2px;background:#363636}.wtc-step:first-child::before{display:none}.wtc-step-dot{position:relative;z-index:1;display:grid;place-items:center;width:28px;height:28px;margin:0 auto .65rem;border:2px solid #474747;border-radius:50%;background:#1a1a1a;font-size:.7rem}.wtc-step.done,.wtc-step.current{color:#fff}.wtc-step.done::before,.wtc-step.current::before{background:#e32626}.wtc-step.done .wtc-step-dot,.wtc-step.current .wtc-step-dot{border-color:#e32626;background:#e32626}.wtc-step.current .wtc-step-dot{box-shadow:0 0 0 7px rgba(227,38,38,.14)}.wtc-track-items{display:grid;gap:.75rem}.wtc-track-item{display:flex;justify-content:space-between;gap:1rem;padding-bottom:.75rem;border-bottom:1px solid #303030}.wtc-track-note{display:block;color:#f1a83a;font-size:.82rem}.wtc-track-total{display:flex;justify-content:space-between;margin-top:1rem;font-size:1.2rem}.wtc-track-fact{padding:.8rem 0;border-bottom:1px solid #303030}.wtc-track-fact span{display:block;color:#888;font-size:.72rem;text-transform:uppercase}.wtc-track-closed{margin:1rem 0;padding:1rem;border-left:3px solid #e32626;background:rgba(227,38,38,.1);color:#ff9b9b}.wtc-track-empty{max-width:620px;margin:10vh auto;text-align:center}@media(max-width:767px){.wtc-track-grid{grid-template-columns:1fr}.wtc-track-head{align-items:start;flex-direction:column}.wtc-timeline{grid-template-columns:1fr;margin:1rem 0}.wtc-step{display:grid;grid-template-columns:32px 1fr;align-items:center;gap:.65rem;text-align:left;padding:.45rem 0}.wtc-step::before{left:13px;right:auto;top:-50%;bottom:50%;width:2px;height:auto}.wtc-step-dot{margin:0}.wtc-tracking-page{padding-top:6.5rem}}
            `}</style>
            <div className="container">
                <header className="wtc-track-head"><div><p className="eyebrow">Order confirmed</p><h1 className="mb-0">Order #{order.id}</h1></div><span className="wtc-live-dot">{updatedAt ? 'Updated ' + updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Connecting'}</span></header>
                <section className="wtc-track-panel mb-3" aria-label="Order progress">
                    <h2 className="h4">Current status: {STATUS_LABELS[order.status] || order.status}</h2>
                    {closed ? <div className="wtc-track-closed"><strong>{STATUS_LABELS[order.status]}</strong>{order.status_reason && <p className="mb-0 mt-1">{order.status_reason}</p>}</div> : <div className="wtc-timeline">{steps.map((step, index) => <div className={`wtc-step ${index < currentIndex ? 'done' : ''} ${index === currentIndex ? 'current' : ''}`} key={step}><motion.span className="wtc-step-dot" animate={index === currentIndex ? { scale: [1, 1.08, 1] } : {}} transition={{ repeat: Infinity, duration: 1.4 }}>{index < currentIndex ? '✓' : index + 1}</motion.span><strong>{STATUS_LABELS[step]}</strong></div>)}</div>}
                </section>
                <div className="wtc-track-grid">
                    <section className="wtc-track-panel"><h2 className="h4 mb-3">Your order</h2><div className="wtc-track-items">{order.items.map((item) => <div className="wtc-track-item" key={item.id}><div><strong>{item.quantity} × {item.item_name}</strong>{item.notes && <span className="wtc-track-note">Note: {item.notes}</span>}</div><span>EGP {(Number(item.price) * item.quantity).toFixed(2)}</span></div>)}</div><div className="wtc-track-total"><span>Total</span><strong>EGP {Number(order.total_price).toFixed(2)}</strong></div></section>
                    <aside className="wtc-track-panel"><h2 className="h4 mb-3">{order.order_type === 'delivery' ? 'Delivery' : 'Pickup'} details</h2><div className="wtc-track-fact"><span>Branch</span><strong>{order.branch?.name}</strong><p className="mb-0 text-secondary">{order.branch?.location}</p></div><div className="wtc-track-fact"><span>{order.order_type === 'delivery' ? 'Address' : 'Estimated arrival'}</span><strong>{order.order_type === 'delivery' ? order.delivery_address : new Date(order.pickup_time).toLocaleString()}</strong></div><div className="wtc-track-fact"><span>Payment</span><strong className="text-capitalize">{order.payment_status} · {order.payment_method}</strong></div></aside>
                </div>
            </div>
        </main>
    );
}
