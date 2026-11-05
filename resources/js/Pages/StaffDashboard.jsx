import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { csrfFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useCatalog } from '../context/CatalogContext';

const ACTIVE_COLUMNS = [
    { key: 'new', title: 'New', statuses: ['new'] },
    { key: 'preparing', title: 'Preparing', statuses: ['accepted', 'preparing'] },
    { key: 'ready', title: 'Ready', statuses: ['ready'] },
    { key: 'journey', title: 'On the way / Done', statuses: ['out_for_delivery', 'picked_up'] },
];
const CLOSED_STATUSES = ['cancelled', 'rejected'];
const QUICK_REASONS = ['Out of stock', 'Too busy', 'Address problem', 'Customer request', 'Other'];

function today() {
    return new Date().toISOString().slice(0, 10);
}

function BellIcon() {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function stepStart(order) {
    const matchingLog = [...(order.status_logs || [])].reverse().find((log) => log.to_status === order.status);
    return matchingLog?.created_at || order.updated_at || order.created_at;
}

function timerDetails(order, now, timing) {
    const elapsedSeconds = Math.max(0, Math.floor((now - new Date(stepStart(order)).getTime()) / 1000));
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    const level = elapsedSeconds < timing.green_minutes * 60
        ? 'green'
        : elapsedSeconds <= timing.orange_minutes * 60 ? 'orange' : 'red';
    return { label: `${minutes}m ${String(seconds).padStart(2, '0')}s`, level };
}

function primaryAction(order) {
    if (order.status === 'new') return { status: 'preparing', label: 'Accept & start preparing' };
    if (order.status === 'accepted') return { status: 'preparing', label: 'Start preparing' };
    if (order.status === 'preparing') return { status: 'ready', label: 'Mark ready' };
    if (order.status === 'ready') return order.order_type === 'delivery'
        ? { status: 'out_for_delivery', label: 'Out for delivery' }
        : { status: 'picked_up', label: 'Customer picked up' };
    if (['out_for_delivery', 'picked_up'].includes(order.status)) return { status: 'completed', label: 'Complete' };
    return null;
}

function ReasonModal({ action, busy, onClose, onConfirm }) {
    const [quickReason, setQuickReason] = useState('');
    const [details, setDetails] = useState('');
    const reason = quickReason === 'Other' ? details.trim() : [quickReason, details.trim()].filter(Boolean).join(': ');

    useEffect(() => {
        setQuickReason('');
        setDetails('');
    }, [action]);

    return (
        <Modal show={Boolean(action)} onHide={busy ? undefined : onClose} centered contentClassName="wtc-reason-modal">
            <Modal.Header closeButton closeVariant="white">
                <Modal.Title>{action?.status === 'rejected' ? 'Reject order' : 'Cancel order'} #{action?.order.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="text-secondary">Choose a clear reason for the customer and the status history.</p>
                <div className="wtc-reason-grid" role="group" aria-label="Quick reasons">
                    {QUICK_REASONS.map((item) => <button key={item} type="button" className={quickReason === item ? 'active' : ''} onClick={() => setQuickReason(item)}>{item}</button>)}
                </div>
                <label className="form-label fw-bold mt-3" htmlFor="status-reason-details">Extra details <span className="text-secondary fw-normal">(optional)</span></label>
                <textarea id="status-reason-details" className="wtc-reason-input" rows="3" maxLength="500" value={details} onChange={(event) => setDetails(event.target.value)} placeholder={quickReason === 'Other' ? 'Tell the team what happened' : 'Add a short note'} />
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-outline-light" disabled={busy} onClick={onClose}>Go back</button>
                <button type="button" className="btn btn-red" disabled={!reason || busy} onClick={() => onConfirm(reason)}>{busy ? 'Saving...' : 'Confirm reason'}</button>
            </Modal.Footer>
        </Modal>
    );
}

function OrderCard({ order, now, timing, busy, highlighted, printing, reduceMotion, onAdvance, onReason, onPrint }) {
    const timer = timerDetails(order, now, timing);
    const action = primaryAction(order);
    const canClose = !['completed', 'cancelled', 'rejected', 'picked_up'].includes(order.status);
    const location = order.order_type === 'delivery'
        ? order.delivery_address || 'Delivery address missing'
        : order.pickup_time ? `Arriving ${new Date(order.pickup_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Pickup time not set';

    return (
        <motion.article
            layout={!reduceMotion}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: highlighted ? [1, 1.02, 1] : 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.28 }}
            className={`wtc-kitchen-card ${highlighted ? 'is-new' : ''} ${printing ? 'is-printing' : ''}`}
        >
            <div className="wtc-card-top">
                <div><span className="wtc-order-number">#{order.id}</span><span className="wtc-order-type">{order.order_type.replace('_', ' ')}</span></div>
                <div className={`wtc-step-timer is-${timer.level}`}><span>In this step</span><strong>{timer.label}</strong></div>
            </div>
            <div className="wtc-ticket-only"><strong>WHAT THE CRUST · KITCHEN TICKET</strong></div>
            <h3>{order.customer_name || order.user?.name || 'Guest order'}</h3>
            <a className="wtc-phone" href={`tel:${order.customer_phone}`}>{order.customer_phone || 'No phone'}</a>
            <div className="wtc-fulfillment-callout"><span>{order.order_type === 'delivery' ? 'Deliver to' : 'Pickup'}</span><strong>{location}</strong></div>
            <div className="wtc-item-list">
                {order.items.map((item) => (
                    <div className="wtc-kitchen-item" key={item.id}>
                        <strong><span>{item.quantity}×</span> {item.item_name || item.menu_item?.name || 'Menu item'}</strong>
                        {item.notes && <div className="wtc-kitchen-note"><span>NOTE</span>{item.notes}</div>}
                    </div>
                ))}
            </div>
            <div className="wtc-card-summary"><span>{order.branch?.name}</span><span className="text-capitalize">{order.payment_status} · {order.payment_method}</span><strong>EGP {order.total_price}</strong></div>
            {action && <button type="button" className="wtc-primary-action" disabled={busy} onClick={() => onAdvance(order, action.status)}>{busy ? 'Updating...' : action.label}</button>}
            <div className="wtc-card-tools">
                <button type="button" onClick={() => onPrint(order.id)}>Print ticket</button>
                {canClose && <button type="button" className="danger" onClick={() => onReason(order, order.status === 'new' ? 'rejected' : 'cancelled')}>{order.status === 'new' ? 'Reject order' : 'Cancel order'}</button>}
            </div>
        </motion.article>
    );
}

export default function StaffDashboard() {
    const { user, isCheckingAuth } = useAuth();
    const { branches: catalogBranches, loading: branchesLoading } = useCatalog();
    const reduceMotion = useReducedMotion();
    const [orders, setOrders] = useState([]);
    const [branch, setBranch] = useState('');
    const [date, setDate] = useState(today());
    const [view, setView] = useState('active');
    const [historyTab, setHistoryTab] = useState('completed');
    const [mobileColumn, setMobileColumn] = useState('new');
    const [message, setMessage] = useState('');
    const [loadError, setLoadError] = useState('');
    const [lastUpdated, setLastUpdated] = useState(null);
    const [timing, setTiming] = useState({ green_minutes: 3, orange_minutes: 6 });
    const [now, setNow] = useState(Date.now());
    const [muted, setMuted] = useState(() => localStorage.getItem('wtc-staff-muted') !== '0');
    const [highlighted, setHighlighted] = useState([]);
    const [busyOrders, setBusyOrders] = useState([]);
    const [reasonAction, setReasonAction] = useState(null);
    const [printingOrderId, setPrintingOrderId] = useState(null);
    const knownIds = useRef(new Set());
    const loadedOnce = useRef(false);
    const loadingRef = useRef(false);
    const audioContext = useRef(null);
    const touchStart = useRef(null);
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        if (user?.role === 'staff' && user.branch_id) {
            setBranch(String(user.branch_id));
        }
    }, [user]);

    const notify = useCallback((newOrders) => {
        if (!newOrders.length) return;
        setMessage(`${newOrders.length} new order${newOrders.length > 1 ? 's' : ''} received.`);
        setHighlighted(newOrders.map((order) => order.id));
        window.setTimeout(() => setHighlighted([]), 3600);
        if (!muted && audioContext.current) {
            const oscillator = audioContext.current.createOscillator();
            const gain = audioContext.current.createGain();
            oscillator.frequency.value = 760;
            gain.gain.setValueAtTime(0.1, audioContext.current.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + 0.18);
            oscillator.connect(gain).connect(audioContext.current.destination);
            oscillator.start();
            oscillator.stop(audioContext.current.currentTime + 0.18);
        }
    }, [muted]);

    const loadOrders = useCallback(async () => {
        if (!user || !['staff', 'admin'].includes(user.role) || loadingRef.current) return;
        loadingRef.current = true;
        try {
            const params = new URLSearchParams({ date });
            if (isAdmin && branch) params.set('branch_id', branch);
            const response = await csrfFetch(`/api/staff/orders?${params}`);
            const fresh = response.orders || [];
            if (loadedOnce.current) notify(fresh.filter((order) => order.status === 'new' && !knownIds.current.has(order.id)));
            knownIds.current = new Set(fresh.map((order) => order.id));
            loadedOnce.current = true;
            setOrders(fresh);
            setTiming(response.timing || { green_minutes: 3, orange_minutes: 6 });
            setLastUpdated(new Date());
            setLoadError('');
        } catch (error) {
            setLoadError(error.message || 'Orders could not be refreshed.');
        } finally {
            loadingRef.current = false;
        }
    }, [user, isAdmin, branch, date, notify]);

    useEffect(() => {
        knownIds.current = new Set();
        loadedOnce.current = false;
    }, [branch, date]);

    useEffect(() => {
        loadOrders();
        const refreshTimer = window.setInterval(loadOrders, 7000);
        return () => window.clearInterval(refreshTimer);
    }, [loadOrders]);

    useEffect(() => {
        const clock = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(clock);
    }, []);

    useEffect(() => {
        const clearPrint = () => setPrintingOrderId(null);
        window.addEventListener('afterprint', clearPrint);
        return () => window.removeEventListener('afterprint', clearPrint);
    }, []);

    const toggleSound = async () => {
        const nextMuted = !muted;
        if (!nextMuted) {
            if (!audioContext.current) audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
            await audioContext.current.resume();
        }
        setMuted(nextMuted);
        localStorage.setItem('wtc-staff-muted', nextMuted ? '1' : '0');
    };

    const updateStatus = async (order, status, reason = null) => {
        setBusyOrders((current) => [...current, order.id]);
        try {
            const response = await csrfFetch(`/api/staff/orders/${order.id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status, reason, expected_status: order.status }),
            });
            setOrders((current) => current.map((item) => item.id === order.id ? response.order : item));
            setMessage(response.message);
            setReasonAction(null);
        } catch (error) {
            if (error.payload?.errors?.expected_status) {
                setMessage('Another staff member already moved this order. The board has been refreshed.');
                await loadOrders();
            } else {
                setMessage(error.payload?.errors ? Object.values(error.payload.errors).flat()[0] : error.message);
            }
        } finally {
            setBusyOrders((current) => current.filter((id) => id !== order.id));
        }
    };

    const printTicket = (orderId) => {
        setPrintingOrderId(orderId);
        window.setTimeout(() => window.print(), 80);
    };

    const activeOrders = useMemo(() => orders.filter((order) => !['completed', ...CLOSED_STATUSES].includes(order.status)), [orders]);
    const completedOrders = useMemo(() => orders.filter((order) => order.status === 'completed'), [orders]);
    const closedOrders = useMemo(() => orders.filter((order) => CLOSED_STATUSES.includes(order.status)), [orders]);
    const columnOrders = (column) => activeOrders.filter((order) => column.statuses.includes(order.status));
    const displayedHistory = historyTab === 'completed' ? completedOrders : closedOrders;

    const swipeColumns = (direction) => {
        const index = ACTIVE_COLUMNS.findIndex((column) => column.key === mobileColumn);
        const next = Math.min(ACTIVE_COLUMNS.length - 1, Math.max(0, index + direction));
        setMobileColumn(ACTIVE_COLUMNS[next].key);
    };

    if (isCheckingAuth) return <main className="wtc-staff-page"><div className="container">Loading dashboard...</div></main>;
    if (!user) return <main className="wtc-staff-page"><div className="container text-center"><h1>Staff sign in</h1><p>Please sign in with a staff account.</p><Link to="/login" className="btn btn-red">Sign in</Link></div></main>;
    if (!['staff', 'admin'].includes(user.role)) return <main className="wtc-staff-page"><div className="container text-center"><h1>Access restricted</h1><p>This dashboard is available to staff only.</p></div></main>;

    return (
        <main className="wtc-staff-page">
            <style>{`
                .wtc-branch-lock{color:#a9a9a9;font-size:.86rem}.wtc-branch-lock strong{color:#fff}
                .wtc-staff-page{min-height:100vh;padding:7rem 0 3rem;background:#101010;color:#f5f5f5}.wtc-staff-head{display:flex;justify-content:space-between;align-items:end;gap:1.25rem}.wtc-staff-head h1{font-size:clamp(2rem,4vw,3.7rem);letter-spacing:0}.wtc-staff-controls{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:.55rem}.wtc-staff-field,.wtc-sound-toggle{min-height:42px;padding:.6rem .75rem;border:1px solid #3a3a3a;border-radius:6px;background:#181818;color:#fff}.wtc-sound-toggle{display:flex;align-items:center;gap:.45rem;font-weight:800}.wtc-sound-toggle.is-on{border-color:#4cbf70;color:#8de7a9}.wtc-updated{display:flex;align-items:center;gap:.45rem;color:#8d8d8d;font-size:.78rem}.wtc-updated::before{content:'';width:7px;height:7px;border-radius:50%;background:#4cbf70}.wtc-dashboard-switch{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin:1.4rem 0}.wtc-segmented,.wtc-history-tabs{display:inline-flex;padding:4px;border:1px solid #303030;border-radius:7px;background:#181818}.wtc-segmented button,.wtc-history-tabs button{border:0;border-radius:4px;padding:.65rem .9rem;background:transparent;color:#999;font-weight:850}.wtc-segmented button.active,.wtc-history-tabs button.active{background:#e32626;color:#fff}.wtc-mobile-tabs{display:none;gap:.45rem;overflow-x:auto;padding:0 0 .8rem;scrollbar-width:none}.wtc-mobile-tabs button{flex:0 0 auto;border:1px solid #343434;border-radius:999px;padding:.55rem .8rem;background:#181818;color:#aaa;font-weight:850}.wtc-mobile-tabs button.active{border-color:#e32626;background:#e32626;color:#fff}.wtc-kitchen-board{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.75rem;align-items:start}.wtc-board-column{min-width:0;border-top:3px solid #353535;background:#151515}.wtc-board-column:nth-child(1){border-color:#e32626}.wtc-board-column:nth-child(2){border-color:#f1a83a}.wtc-board-column:nth-child(3){border-color:#56b7e8}.wtc-board-column:nth-child(4){border-color:#56bd79}.wtc-column-head{position:sticky;top:92px;z-index:4;display:flex;align-items:center;justify-content:space-between;padding:.8rem;background:rgba(21,21,21,.96);backdrop-filter:blur(10px)}.wtc-column-head h2{margin:0;font-size:.95rem;font-weight:950;text-transform:uppercase}.wtc-column-head span{display:grid;place-items:center;min-width:25px;height:25px;border-radius:50%;background:#292929;font-size:.75rem;font-weight:900}.wtc-column-cards{display:grid;gap:.7rem;padding:.7rem}.wtc-column-empty{padding:2.4rem .8rem;color:#747474;text-align:center;font-size:.85rem}.wtc-kitchen-card{position:relative;border:1px solid #303030;border-radius:7px;padding:.9rem;background:#1b1b1b;box-shadow:0 12px 30px rgba(0,0,0,.18)}.wtc-kitchen-card.is-new{border-color:#e32626;animation:wtc-new-flash .7s ease-out 3}.wtc-card-top,.wtc-card-summary,.wtc-card-tools{display:flex;align-items:center;justify-content:space-between;gap:.55rem}.wtc-order-number{font-size:1.05rem;font-weight:1000}.wtc-order-type{display:block;color:#888;font-size:.68rem;font-weight:800;text-transform:uppercase}.wtc-step-timer{text-align:right}.wtc-step-timer span{display:block;color:#7d7d7d;font-size:.62rem;text-transform:uppercase}.wtc-step-timer strong{font-size:1rem;font-variant-numeric:tabular-nums}.wtc-step-timer.is-green strong{color:#63d184}.wtc-step-timer.is-orange strong{color:#f1a83a}.wtc-step-timer.is-red strong{color:#ff5a5a}.wtc-kitchen-card h3{margin:.85rem 0 .1rem;font-size:1.05rem;font-weight:950}.wtc-phone{color:#cfcfcf;font-size:.8rem}.wtc-fulfillment-callout{margin:.75rem 0;padding:.75rem;border-left:3px solid #e32626;background:#121212}.wtc-fulfillment-callout span{display:block;color:#999;font-size:.65rem;font-weight:900;text-transform:uppercase}.wtc-fulfillment-callout strong{display:block;margin-top:.2rem;font-size:1rem;line-height:1.3}.wtc-kitchen-item{padding:.62rem 0;border-bottom:1px solid #303030;font-size:.86rem}.wtc-kitchen-item>strong span{color:#f1a83a}.wtc-kitchen-note{margin-top:.45rem;padding:.5rem;border:1px solid rgba(241,168,58,.35);border-radius:4px;background:rgba(241,168,58,.1);color:#ffd089;font-weight:850;line-height:1.3}.wtc-kitchen-note span{display:block;margin-bottom:.2rem;color:#f1a83a;font-size:.6rem}.wtc-card-summary{align-items:end;margin-top:.75rem;color:#8e8e8e;font-size:.68rem}.wtc-card-summary strong{color:#fff;font-size:.8rem}.wtc-primary-action{width:100%;min-height:48px;margin-top:.85rem;border:0;border-radius:5px;background:#e32626;color:#fff;font-weight:950}.wtc-primary-action:hover{background:#ff3232}.wtc-primary-action:disabled{opacity:.55}.wtc-card-tools{margin-top:.6rem}.wtc-card-tools button{border:0;background:none;color:#aaa;font-size:.72rem;text-decoration:underline}.wtc-card-tools .danger{color:#ff7373}.wtc-history-panel{margin-top:.75rem}.wtc-history-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.8rem;margin-top:1rem}.wtc-staff-banner{position:fixed;top:96px;right:20px;z-index:1600;max-width:min(420px,calc(100vw - 2rem));padding:.85rem 1rem;border-radius:6px;background:#e32626;color:#fff;font-weight:850;box-shadow:0 16px 40px rgba(0,0,0,.35)}.wtc-load-error{padding:.75rem;border:1px solid rgba(255,90,90,.35);border-radius:6px;background:rgba(227,38,38,.08);color:#ff9a9a}.wtc-reason-modal{border:1px solid #393939;border-radius:8px;background:#191919;color:#f5f5f5}.wtc-reason-modal .modal-header,.wtc-reason-modal .modal-footer{border-color:#333}.wtc-reason-grid{display:flex;flex-wrap:wrap;gap:.45rem}.wtc-reason-grid button{border:1px solid #3d3d3d;border-radius:999px;padding:.5rem .7rem;background:#222;color:#ddd}.wtc-reason-grid button.active{border-color:#e32626;background:#e32626;color:#fff}.wtc-reason-input{width:100%;border:1px solid #414141;border-radius:6px;padding:.75rem;background:#101010;color:#fff}.wtc-ticket-only{display:none}@keyframes wtc-new-flash{0%,100%{box-shadow:0 0 0 0 rgba(227,38,38,0)}45%{box-shadow:0 0 0 4px rgba(227,38,38,.35)}}@media(prefers-reduced-motion:reduce){.wtc-kitchen-card.is-new{animation:none}}@media(max-width:1199px) and (min-width:768px){.wtc-kitchen-board{grid-template-columns:repeat(4,minmax(250px,1fr));overflow-x:auto;padding-bottom:.7rem}.wtc-board-column{min-width:250px}.wtc-history-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:767px){.wtc-staff-page{padding-top:6rem}.wtc-staff-head{align-items:start;flex-direction:column}.wtc-staff-controls{width:100%;justify-content:stretch}.wtc-staff-controls label{flex:1 1 calc(50% - .3rem)}.wtc-staff-field{width:100%}.wtc-sound-toggle{flex:1 1 100%;justify-content:center}.wtc-dashboard-switch{align-items:flex-start;flex-direction:column}.wtc-mobile-tabs{display:flex}.wtc-kitchen-board{display:block}.wtc-board-column{display:none}.wtc-board-column.is-mobile-active{display:block}.wtc-column-head{top:78px}.wtc-history-grid{grid-template-columns:1fr}.wtc-staff-banner{left:1rem;right:1rem;top:86px}}@media print{body *{visibility:hidden!important}.site-navbar,.site-footer{display:none!important}.wtc-kitchen-card.is-printing,.wtc-kitchen-card.is-printing *{visibility:visible!important}.wtc-kitchen-card.is-printing{position:absolute;inset:0 auto auto 0;width:80mm;border:0;background:#fff!important;color:#000!important;box-shadow:none}.wtc-kitchen-card.is-printing .wtc-primary-action,.wtc-kitchen-card.is-printing .wtc-card-tools{display:none}.wtc-kitchen-card.is-printing .wtc-ticket-only{display:block;margin-bottom:10px}.wtc-kitchen-card.is-printing .wtc-fulfillment-callout,.wtc-kitchen-card.is-printing .wtc-kitchen-note{background:#fff!important;color:#000!important;border-color:#000}.wtc-kitchen-card.is-printing a,.wtc-kitchen-card.is-printing span,.wtc-kitchen-card.is-printing strong{color:#000!important}}
            `}</style>
            <AnimatePresence>{message && <motion.button type="button" className="wtc-staff-banner" initial={reduceMotion ? false : { opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onClick={() => setMessage('')} role="status">{message}</motion.button>}</AnimatePresence>
            <div className="container-fluid px-3 px-xl-4">
                <header className="wtc-staff-head">
                    <div>
                        <p className="eyebrow">Kitchen command</p>
                        <h1 className="fw-bold mb-0">Orders at a glance.</h1>
                        {!isAdmin && <p className="wtc-branch-lock mb-0 mt-2">Branch: <strong>{user.branch?.name || 'Not assigned'}</strong></p>}
                    </div>
                    <div className="wtc-staff-controls">
                        {isAdmin && <label><span className="visually-hidden">Branch</span><select className="wtc-staff-field" value={branch} disabled={branchesLoading} onChange={(event) => setBranch(event.target.value)}><option value="">All branches</option>{catalogBranches.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>}
                        <label><span className="visually-hidden">Order date</span><input className="wtc-staff-field" type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
                        <button type="button" className={`wtc-sound-toggle ${muted ? '' : 'is-on'}`} onClick={toggleSound} aria-pressed={!muted}><BellIcon />{muted ? 'Sound off' : 'Sound on'}</button>
                        <span className="wtc-updated">{lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : 'Connecting...'}</span>
                    </div>
                </header>
                <div className="wtc-dashboard-switch">
                    <div className="wtc-segmented" role="group" aria-label="Order view"><button type="button" className={view === 'active' ? 'active' : ''} onClick={() => setView('active')}>Active orders ({activeOrders.length})</button><button type="button" className={view === 'history' ? 'active' : ''} onClick={() => setView('history')}>Today&apos;s history ({completedOrders.length + closedOrders.length})</button></div>
                    {loadError && <div className="wtc-load-error" role="alert">{loadError} <button type="button" className="btn btn-sm btn-outline-light ms-2" onClick={loadOrders}>Retry</button></div>}
                </div>
                {view === 'active' ? <>
                    <div className="wtc-mobile-tabs" role="tablist" aria-label="Active order stages">{ACTIVE_COLUMNS.map((column) => <button key={column.key} type="button" role="tab" aria-selected={mobileColumn === column.key} className={mobileColumn === column.key ? 'active' : ''} onClick={() => setMobileColumn(column.key)}>{column.title} ({columnOrders(column).length})</button>)}</div>
                    <div className="wtc-kitchen-board" onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={(event) => { if (touchStart.current === null) return; const distance = event.changedTouches[0].clientX - touchStart.current; if (Math.abs(distance) > 55) swipeColumns(distance < 0 ? 1 : -1); touchStart.current = null; }}>
                        {ACTIVE_COLUMNS.map((column) => { const cards = columnOrders(column); return <section key={column.key} className={`wtc-board-column ${mobileColumn === column.key ? 'is-mobile-active' : ''}`} aria-labelledby={`column-${column.key}`}><header className="wtc-column-head"><h2 id={`column-${column.key}`}>{column.title}</h2><span>{cards.length}</span></header><div className="wtc-column-cards">{cards.map((order) => <OrderCard key={order.id} order={order} now={now} timing={timing} busy={busyOrders.includes(order.id)} highlighted={highlighted.includes(order.id)} printing={printingOrderId === order.id} reduceMotion={reduceMotion} onAdvance={updateStatus} onReason={(selectedOrder, status) => setReasonAction({ order: selectedOrder, status })} onPrint={printTicket} />)}{!cards.length && <p className="wtc-column-empty">No orders here.</p>}</div></section>; })}
                    </div>
                </> : <section className="wtc-history-panel">
                    <div className="wtc-history-tabs" role="tablist" aria-label="Order history"><button type="button" role="tab" aria-selected={historyTab === 'completed'} className={historyTab === 'completed' ? 'active' : ''} onClick={() => setHistoryTab('completed')}>Completed ({completedOrders.length})</button><button type="button" role="tab" aria-selected={historyTab === 'closed'} className={historyTab === 'closed' ? 'active' : ''} onClick={() => setHistoryTab('closed')}>Closed ({closedOrders.length})</button></div>
                    <div className="wtc-history-grid">{displayedHistory.map((order) => <OrderCard key={order.id} order={order} now={now} timing={timing} busy={false} highlighted={false} printing={printingOrderId === order.id} reduceMotion={reduceMotion} onAdvance={updateStatus} onReason={(selectedOrder, status) => setReasonAction({ order: selectedOrder, status })} onPrint={printTicket} />)}</div>
                    {!displayedHistory.length && <p className="text-secondary py-5 text-center">No orders in this view.</p>}
                </section>}
            </div>
            <ReasonModal action={reasonAction} busy={reasonAction ? busyOrders.includes(reasonAction.order.id) : false} onClose={() => setReasonAction(null)} onConfirm={(reason) => updateStatus(reasonAction.order, reasonAction.status, reason)} />
        </main>
    );
}
