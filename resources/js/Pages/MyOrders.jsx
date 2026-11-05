import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { csrfFetch } from '../lib/api';

export default function MyOrders() {
    const { user, isCheckingAuth } = useAuth();
    const { setOrderMode, setBranch } = useOrder();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        csrfFetch('/api/orders/history').then((response) => setOrders(response.orders || [])).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false));
    }, [user]);

    const reorder = async (order) => {
        setError('');
        try {
            const response = await csrfFetch('/api/orders/' + order.id + '/reorder', { method: 'POST' });
            setOrderMode(response.order_type);
            setBranch(response.branch_id, { confirmCart: true });
            localStorage.setItem(import.meta.env.VITE_DEMO_MODE === 'true' ? 'wtc_demo_cart' : 'wtc_cart', JSON.stringify(response.cart_items));
            window.dispatchEvent(new Event('wtc-cart-updated'));
            navigate('/cart');
        } catch (requestError) {
            setError(requestError.message);
        }
    };

    if (isCheckingAuth || loading) return <main className="wtc-orders-page"><div className="container">Loading orders...</div></main>;
    if (!user) return <main className="wtc-orders-page"><div className="container text-center"><h1>Sign in to see your orders.</h1><Link to="/login" className="btn btn-red">Sign in</Link></div></main>;

    return <main className="wtc-orders-page"><style>{`.wtc-orders-page{min-height:100vh;padding:8rem 0 5rem;background:#111;color:#f5f5f5}.wtc-order-history{display:grid;gap:.8rem}.wtc-history-card{display:grid;grid-template-columns:1fr auto;gap:1rem;padding:1.1rem;border:1px solid #303030;border-radius:8px;background:#1a1a1a}.wtc-history-meta{display:flex;flex-wrap:wrap;gap:.8rem;color:#999}.wtc-history-actions{display:flex;align-items:center;gap:.5rem}@media(max-width:575px){.wtc-history-card{grid-template-columns:1fr}.wtc-history-actions{justify-content:stretch}.wtc-history-actions>*{flex:1}}`}</style><div className="container"><p className="eyebrow">Account</p><h1 className="display-4 fw-bold mb-4">My orders</h1>{error && <div className="alert alert-danger">{error}</div>}{!orders.length ? <section className="text-center py-5"><h2>No orders yet.</h2><Link to="/menu" className="btn btn-red">Explore the menu</Link></section> : <div className="wtc-order-history">{orders.map((order) => <article className="wtc-history-card" key={order.id}><div><h2 className="h5">Order #{order.id} · <span className="text-capitalize">{order.status.replaceAll('_', ' ')}</span></h2><div className="wtc-history-meta"><span>{order.branch?.name}</span><span>{new Date(order.created_at).toLocaleString()}</span><span>EGP {Number(order.total_price).toFixed(2)}</span></div></div><div className="wtc-history-actions"><Link className="btn btn-outline-light" to={'/orders/' + order.tracking_token}>Track</Link><button type="button" className="btn btn-red" onClick={() => reorder(order)}>Reorder</button></div></article>)}</div>}</div></main>;
}
