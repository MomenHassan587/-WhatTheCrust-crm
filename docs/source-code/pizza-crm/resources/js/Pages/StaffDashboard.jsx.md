# لوحة المطبخ: Polling وانتقالات الحالة وصوت وطباعة

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `resources/js/Pages/StaffDashboard.jsx` · 316 سطر.

**وظيفة الملف:** واجهة staff/admin تعرض Kanban للطلبات في التاريخ والفرع المختارين، تحديث API كل 7 ثوانٍ وساعة محلية كل ثانية. Role check في الواجهة للتجربة؛ الحماية الفعلية موجودة middleware/controllers في Laravel.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../resources/js/Pages/StaffDashboard.jsx). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/resources/js/lib/api.js](../lib/api.js.md)

- [pizza-crm/resources/js/context/AuthContext.jsx](../context/AuthContext.jsx.md)

- [pizza-crm/resources/js/context/CatalogContext.jsx](../context/CatalogContext.jsx.md)

- [pizza-crm/app/Http/Controllers/Api/StaffOrderController.php](../../../app/Http/Controllers/Api/StaffOrderController.php.md)

- [pizza-crm/routes/web.php](../../../routes/web.php.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```jsx
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
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### today

يولّد تاريخ اليوم بصيغة YYYY-MM-DD من ISO؛ ISO هنا UTC، فلا تعتبره دائمًا تاريخ مصر المحلي قرب منتصف الليل.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** string.

### BellIcon

يرسم SVG لجرس زر الصوت.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX svg.

### stepStart

يبحث من أحدث status_logs عن بداية الحالة الحالية، ثم fallback إلى updated_at أو created_at.

- **بتاخد إيه؟ Inputs:** order.

- **بترجع/بتغيّر إيه؟ Return / effect:** تاريخ string.

### timerDetails

يحسب الزمن منذ بداية المرحلة ويصنفه green/orange/red حسب thresholds ويحوله إلى label دقائق وثوانٍ.

- **بتاخد إيه؟ Inputs:** order, now timestamp, timing thresholds.

- **بترجع/بتغيّر إيه؟ Return / effect:** {label,level}.

### primaryAction

جدول قرار للزر القادم حسب الحالة وطريقة الطلب؛ واجهة فقط، السيرفر يراجع الانتقال مرة أخرى.

- **بتاخد إيه؟ Inputs:** order.

- **بترجع/بتغيّر إيه؟ Return / effect:** {status,label} أو null.

### ReasonModal

يجمع سبب جاهز وتفاصيل ثم يرسل النص إلى onConfirm؛ ينظف المدخلات عند تغيّر action.

- **بتاخد إيه؟ Inputs:** action,busy,onClose,onConfirm.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX Modal.

### OrderCard

يرسم الطلب والعداد والأصناف؛ ينادي callbacks onAdvance/onReason/onPrint المرسلة من الأب.

- **بتاخد إيه؟ Inputs:** order,now,timing,busy,highlighted,printing,reduceMotion,onAdvance,onReason,onPrint.

- **بترجع/بتغيّر إيه؟ Return / effect:** motion.article JSX.

### StaffDashboard

أب حالة لوحة الطلبات ومركز الاتصال بالـ API والـ modal والطباعة والفلاتر.

- **بتاخد إيه؟ Inputs:** contexts.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX للحالات المسموح/المرفوض/التحميل واللوحة.

### notify

يبرز IDs الطلبات الجديدة ويعرض عددها؛ لو الصوت مفعّل ينشئ tone قصير باستخدام WebAudio.

- **بتاخد إيه؟ Inputs:** newOrders array.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined.

### loadOrders

يتأكد من role وعدم وجود طلب جاري، يبني query date/branch، يجلب الطلبات، يكتشف IDs الجديدة ثم يحدّث board/timing/lastUpdated. finally يفك loadingRef.

- **بتاخد إيه؟ Inputs:** لا parameters؛ يقرأ user/isAdmin/branch/date/notify من closure.

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<void>.

### clearPrint

Callback لحدث afterprint؛ يمسح printingOrderId بعد انتهاء نافذة الطباعة.

- **بتاخد إيه؟ Inputs:** event غير مستخدم.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined.

### toggleSound

يعكس muted، ينشئ AudioContext ويعمل resume بإجراء مستخدم عند التفعيل ثم يحفظ التفضيل.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<void>.

### updateStatus

PATCH للحالة مع expected_status لمنع تعديل مبني على حالة قديمة؛ يستبدل الطلب الراجع في state. conflict يعيد تحميل اللوحة؛ finally يمسح busy ID.

- **بتاخد إيه؟ Inputs:** order, status, reason=null.

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<void>.

### printTicket

يحدد ID الطلب المراد طباعته، ينتظر 80ms لإتاحة render ثم يفتح window.print؛ afterprint يمسح الاختيار.

- **بتاخد إيه؟ Inputs:** orderId.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined.

### columnOrders

يفلتر الطلبات النشطة لحالات العمود المطلوب.

- **بتاخد إيه؟ Inputs:** column object وله statuses array.

- **بترجع/بتغيّر إيه؟ Return / effect:** array طلبات.

### swipeColumns

يحرك تبويب الموبايل بواحد يمين/شمال مع حصر index بين أول وآخر عمود.

- **بتاخد إيه؟ Inputs:** direction: 1 أو -1.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### new Date().toISOString().slice

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تأخذ جزءًا بدون تعديل الأصل.

- **المدخلات — Arguments:** start وend غير شامل النهاية.

- **الناتج/الأثر — Return / effect:** نسخة array جزئية أو نص جزئي حسب المستقبِل.

- **أول موضع هنا:** السطر 19، والمدخلات المكتوبة: `0`، `10`.

### new Date().toISOString

- **جاية منين؟** Date instance

- **وظيفتها:** تنسّق التاريخ بنظام UTC.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** string؛ اليوم قد يختلف عن توقيت جهازك المحلي.

- **أول موضع هنا:** السطر 19.

### Date

- **جاية منين؟** JavaScript Date

- **وظيفتها:** مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي.

- **المدخلات — Arguments:** قيمة تاريخ اختيارية.

- **الناتج/الأثر — Return / effect:** Date object عند new؛ مش string تلقائيًا.

- **أول موضع هنا:** السطر 192.

### [...(order.status_logs || [])].reverse().find

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تبحث بالترتيب حتى أول callback truthy.

- **المدخلات — Arguments:** callback تستقبل العنصر وindex والقائمة.

- **الناتج/الأثر — Return / effect:** العنصر المطابق نفسه أو undefined؛ ليست array نتائج.

- **أول موضع هنا:** السطر 31، والمدخلات المكتوبة: `(log) => log.to_status === order.status`.

### [...(order.status_logs || [])].reverse

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تعكس ترتيب array الأصلية.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** نفس array المعدّلة؛ اعمل نسخة قبلها لو لا تريد mutation.

- **أول موضع هنا:** السطر 31.

### Math.max

- **جاية منين؟** Math / JavaScript

- **وظيفتها:** ترجع أكبر المدخلات.

- **المدخلات — Arguments:** أعداد.

- **الناتج/الأثر — Return / effect:** number.

- **أول موضع هنا:** السطر 268، والمدخلات المكتوبة: `0`، `index + direction`.

### Math.floor

- **جاية منين؟** Math / JavaScript

- **وظيفتها:** تأخذ أكبر integer لا يزيد عن العدد.

- **المدخلات — Arguments:** number.

- **الناتج/الأثر — Return / effect:** number.

- **أول موضع هنا:** السطر 37، والمدخلات المكتوبة: `elapsedSeconds / 60`.

### new Date(stepStart(order)).getTime

- **جاية منين؟** Date instance

- **وظيفتها:** تحوّل Date إلى timestamp.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** milliseconds؛ قد تكون NaN لتاريخ غير صالح.

- **أول موضع هنا:** السطر 36.

### stepStart

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يبحث من أحدث status_logs عن بداية الحالة الحالية، ثم fallback إلى updated_at أو created_at.

- **المدخلات — Arguments:** order.

- **الناتج/الأثر — Return / effect:** تاريخ string.

- **أول موضع هنا:** السطر 36، والمدخلات المكتوبة: `order`.

### String(seconds).padStart

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تضيف padding لبداية النص حتى طول محدد.

- **المدخلات — Arguments:** targetLength وpadString.

- **الناتج/الأثر — Return / effect:** نص جديد.

- **أول موضع هنا:** السطر 42، والمدخلات المكتوبة: `2`، `'0'`.

### String

- **جاية منين؟** JavaScript

- **وظيفتها:** تحوّل قيمة إلى نص عند استدعائها بدون new.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 158، والمدخلات المكتوبة: `user.branch_id`.

### ['out_for_delivery', 'picked_up'].includes

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تختبر وجود قيمة في array أو نص داخل string.

- **المدخلات — Arguments:** القيمة/النص المطلوب.

- **الناتج/الأثر — Return / effect:** Boolean؛ مش العنصر ولا موقعه.

- **أول موضع هنا:** السطر 52، والمدخلات المكتوبة: `order.status`.

### useState

- **جاية منين؟** React

- **وظيفتها:** حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة.

- **المدخلات — Arguments:** initialState

- **الناتج/الأثر — Return / effect:** [currentState,setter]

- **أول موضع هنا:** السطر 148، والمدخلات المكتوبة: `null`.

- **مثال:** const [failed, setFailed] = useState(false);

### details.trim

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تشيل whitespace من أول وآخر النص فقط.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** نص جديد؛ لا تغيّر النص الأصلي.

- **أول موضع هنا:** السطر 59.

### [quickReason, details.trim()].filter(Boolean).join

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تجمع عناصر في نص.

- **المدخلات — Arguments:** separator اختياري.

- **الناتج/الأثر — Return / effect:** string، لا تعدّل عناصر الأصل.

- **أول موضع هنا:** السطر 59، والمدخلات المكتوبة: `': '`.

### [quickReason, details.trim()].filter

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تختار كل العناصر التي شرطها truthy.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** array جديدة؛ لا تحذف الأصل بنفسها.

- **أول موضع هنا:** السطر 59، والمدخلات المكتوبة: `Boolean`.

### useEffect

- **جاية منين؟** React

- **وظيفتها:** يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies.

- **المدخلات — Arguments:** setup callback, dependencies

- **الناتج/الأثر — Return / effect:** undefined

- **أول موضع هنا:** السطر 217، والمدخلات المكتوبة: `() => {         const clearPrint = () => setPrintingOrderId(null);         window.addEventListener('afterprint', clearPrint);         return () => window.removeEventListener('after…`، `[]`.

- **مثال:** useEffect(() => { window.addEventListener('resize', updateRunway); return () => window.removeEventListener('resize', updateRunway); }, []);

### setQuickReason

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setQuickReason هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 74، والمدخلات المكتوبة: `item`.

### setDetails

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setDetails هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 77، والمدخلات المكتوبة: `event.target.value`.

### Boolean

- **جاية منين؟** JavaScript

- **وظيفتها:** تحوّل قيمة إلى true/false حسب truthiness.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** Boolean؛ النص false غير الفاضي يساوي true.

- **أول موضع هنا:** السطر 67، والمدخلات المكتوبة: `action`.

### QUICK_REASONS.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 74، والمدخلات المكتوبة: `(item) => <button key={item} type="button" className={quickReason === item ? 'active' : ''} onClick={() => setQuickReason(item)}>{item}</button>`.

### onConfirm

- **جاية منين؟** Callback/دالة مأخوذة من props أو Context حسب تعريف المكوّن

- **وظيفتها:** تنادي العملية اللي الأب أو الـContext مرّرها باسم onConfirm؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي.

- **المدخلات — Arguments:** reason

- **الناتج/الأثر — Return / effect:** العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.

- **أول موضع هنا:** السطر 81، والمدخلات المكتوبة: `reason`.

### timerDetails

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يحسب الزمن منذ بداية المرحلة ويصنفه green/orange/red حسب thresholds ويحوله إلى label دقائق وثوانٍ.

- **المدخلات — Arguments:** order, now timestamp, timing thresholds.

- **الناتج/الأثر — Return / effect:** {label,level}.

- **أول موضع هنا:** السطر 88، والمدخلات المكتوبة: `order`، `now`، `timing`.

### primaryAction

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** جدول قرار للزر القادم حسب الحالة وطريقة الطلب؛ واجهة فقط، السيرفر يراجع الانتقال مرة أخرى.

- **المدخلات — Arguments:** order.

- **الناتج/الأثر — Return / effect:** {status,label} أو null.

- **أول موضع هنا:** السطر 89، والمدخلات المكتوبة: `order`.

### ['completed', 'cancelled', 'rejected', 'picked_up'].includes

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تختبر وجود قيمة في array أو نص داخل string.

- **المدخلات — Arguments:** القيمة/النص المطلوب.

- **الناتج/الأثر — Return / effect:** Boolean؛ مش العنصر ولا موقعه.

- **أول موضع هنا:** السطر 90، والمدخلات المكتوبة: `order.status`.

### new Date(order.pickup_time).toLocaleTimeString

- **جاية منين؟** Date instance

- **وظيفتها:** تنسّق الوقت للعرض المحلي.

- **المدخلات — Arguments:** locale وخيارات.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 93، والمدخلات المكتوبة: `[]`، `{ hour: '2-digit', minute: '2-digit' }`.

### order.order_type.replace

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تستبدل تطابقًا أو تطابقات حسب pattern.

- **المدخلات — Arguments:** نص/regex ثم replacement.

- **الناتج/الأثر — Return / effect:** نص جديد؛ الأصل لا يتغيّر.

- **أول موضع هنا:** السطر 104، والمدخلات المكتوبة: `'_'`، `' '`.

### order.items.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 112، والمدخلات المكتوبة: `(item) => (                     <div className="wtc-kitchen-item" key={item.id}>                         <strong><span>{item.quantity}×</span> {item.item_name || item.menu_item?.na…`.

### onAdvance

- **جاية منين؟** Callback/دالة مأخوذة من props أو Context حسب تعريف المكوّن

- **وظيفتها:** تنادي العملية اللي الأب أو الـContext مرّرها باسم onAdvance؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي.

- **المدخلات — Arguments:** order، action.status

- **الناتج/الأثر — Return / effect:** العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.

- **أول موضع هنا:** السطر 120، والمدخلات المكتوبة: `order`، `action.status`.

### onPrint

- **جاية منين؟** Callback/دالة مأخوذة من props أو Context حسب تعريف المكوّن

- **وظيفتها:** تنادي العملية اللي الأب أو الـContext مرّرها باسم onPrint؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي.

- **المدخلات — Arguments:** order.id

- **الناتج/الأثر — Return / effect:** العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.

- **أول موضع هنا:** السطر 122، والمدخلات المكتوبة: `order.id`.

### onReason

- **جاية منين؟** Callback/دالة مأخوذة من props أو Context حسب تعريف المكوّن

- **وظيفتها:** تنادي العملية اللي الأب أو الـContext مرّرها باسم onReason؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي.

- **المدخلات — Arguments:** order، order.status === 'new' ? 'rejected' : 'cancelled'

- **الناتج/الأثر — Return / effect:** العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.

- **أول موضع هنا:** السطر 123، والمدخلات المكتوبة: `order`، `order.status === 'new' ? 'rejected' : 'cancelled'`.

### useAuth

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** Custom hook يقرأ AuthContext؛ يرمي خطأ واضح لو اتنادى خارج AuthProvider.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** object فيه user/isCheckingAuth/login/register/logout.

- **أول موضع هنا:** السطر 130.

- **تكملة التعريف:** [resources/js/context/AuthContext.jsx](../context/AuthContext.jsx.md)، عند السطر 74.

### useCatalog

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** يوصل المكوّن إلى الكتالوج المشترك؛ يفشل بوضوح لو Provider غير موجود.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** branches/categories/items/loading/error/reload.

- **أول موضع هنا:** السطر 131.

- **تكملة التعريف:** [resources/js/context/CatalogContext.jsx](../context/CatalogContext.jsx.md)، عند السطر 37.

### useReducedMotion

- **جاية منين؟** framer-motion hook

- **وظيفتها:** يقرأ تفضيل المستخدم لتقليل الحركة ويستخدم لاختيار animations أخف؛ قيمته ليست طلب تعطيل الـ UI نفسه.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** Boolean أو null في سياقات لا يتوفر فيها القياس.

- **أول موضع هنا:** السطر 132.

- **مثال:** const reduceMotion = useReducedMotion();

### today

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يولّد تاريخ اليوم بصيغة YYYY-MM-DD من ISO؛ ISO هنا UTC، فلا تعتبره دائمًا تاريخ مصر المحلي قرب منتصف الليل.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 135.

### Date.now

- **جاية منين؟** Date / JavaScript

- **وظيفتها:** تقرأ وقت النظام الحالي كـtimestamp.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** milliseconds منذ Unix epoch، مش Date object.

- **أول موضع هنا:** السطر 213.

### localStorage.getItem

- **جاية منين؟** Browser localStorage/sessionStorage

- **وظيفتها:** تقرأ النص المحفوظ تحت مفتاح.

- **المدخلات — Arguments:** اسم المفتاح.

- **الناتج/الأثر — Return / effect:** string أو null؛ لا تعيد object تلقائيًا.

- **أول موضع هنا:** السطر 144، والمدخلات المكتوبة: `'wtc-staff-muted'`.

### useRef

- **جاية منين؟** React

- **وظيفتها:** مرجع ثابت .current للDOM أو قيمة لا تتطلب render عند تغييرها.

- **المدخلات — Arguments:** initialValue

- **الناتج/الأثر — Return / effect:** MutableRefObject

- **أول موضع هنا:** السطر 153، والمدخلات المكتوبة: `null`.

- **مثال:** const videoRef = useRef<HTMLVideoElement>(null);

### Set

- **جاية منين؟** JavaScript

- **وظيفتها:** تنشئ مجموعة قيم فريدة.

- **المدخلات — Arguments:** iterable اختيارية.

- **الناتج/الأثر — Return / effect:** Set instance، مش array.

- **أول موضع هنا:** السطر 202.

### setBranch

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setBranch هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 291، والمدخلات المكتوبة: `event.target.value`.

### useCallback

- **جاية منين؟** React hook

- **وظيفتها:** يثبت هوية function بين renders ما دامت dependencies ثابتة؛ لا ينفذ الدالة ولا يحفظ نتيجة API. مهم لأن loadOrders dependency للـ polling effect.

- **المدخلات — Arguments:** function, dependencies.

- **الناتج/الأثر — Return / effect:** function memoized.

- **أول موضع هنا:** السطر 179، والمدخلات المكتوبة: `async () => {         if (!user || !['staff', 'admin'].includes(user.role) || loadingRef.current) return;         loadingRef.current = true;         try {             const params …`، `[user, isAdmin, branch, date, notify]`.

- **مثال:** const loadOrders = useCallback(async () => { /* actual request */ }, [user, branch, date]);

### setMessage

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setMessage هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 282، والمدخلات المكتوبة: `''`.

### setHighlighted

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setHighlighted هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 166، والمدخلات المكتوبة: `[]`.

### newOrders.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 165، والمدخلات المكتوبة: `(order) => order.id`.

### window.setTimeout

- **جاية منين؟** Browser

- **وظيفتها:** ترتّب نداء callback مرة واحدة بعد التأخير.

- **المدخلات — Arguments:** callback وdelay بالمللي ثانية.

- **الناتج/الأثر — Return / effect:** timer ID في المتصفح.

- **أول موضع هنا:** السطر 257، والمدخلات المكتوبة: `() => window.print()`، `80`.

### audioContext.current.createOscillator

- **جاية منين؟** Web Audio

- **وظيفتها:** تنشئ مصدر نغمة صوتية.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** OscillatorNode؛ التشغيل يحتاج start.

- **أول موضع هنا:** السطر 168.

### audioContext.current.createGain

- **جاية منين؟** Web Audio

- **وظيفتها:** تنشئ عقدة للتحكم في مستوى الصوت.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** GainNode.

- **أول موضع هنا:** السطر 169.

### gain.gain.setValueAtTime

- **جاية منين؟** AudioParam

- **وظيفتها:** تحدد قيمة parameter في توقيت صوتي.

- **المدخلات — Arguments:** value وtime بالثواني.

- **الناتج/الأثر — Return / effect:** AudioParam نفسها للـchaining.

- **أول موضع هنا:** السطر 171، والمدخلات المكتوبة: `0.1`، `audioContext.current.currentTime`.

### gain.gain.exponentialRampToValueAtTime

- **جاية منين؟** AudioParam

- **وظيفتها:** تحدد انتقالًا أسيًا لقيمة موجبة بنهاية زمنية.

- **المدخلات — Arguments:** value وendTime بالثواني.

- **الناتج/الأثر — Return / effect:** AudioParam؛ مش timer ID.

- **أول موضع هنا:** السطر 172، والمدخلات المكتوبة: `0.001`، `audioContext.current.currentTime + 0.18`.

### oscillator.connect(gain).connect

- **جاية منين؟** Web Audio nodes

- **وظيفتها:** تصل عقدة صوت بالهدف.

- **المدخلات — Arguments:** destination node أو AudioParam.

- **الناتج/الأثر — Return / effect:** الهدف في overload ربط AudioNode؛ الناتج يختلف مع AudioParam.

- **أول موضع هنا:** السطر 173، والمدخلات المكتوبة: `audioContext.current.destination`.

### oscillator.connect

- **جاية منين؟** Web Audio nodes

- **وظيفتها:** تصل عقدة صوت بالهدف.

- **المدخلات — Arguments:** destination node أو AudioParam.

- **الناتج/الأثر — Return / effect:** الهدف في overload ربط AudioNode؛ الناتج يختلف مع AudioParam.

- **أول موضع هنا:** السطر 173، والمدخلات المكتوبة: `gain`.

### oscillator.start

- **جاية منين؟** Audio source

- **وظيفتها:** تبدأ مصدر الصوت في التوقيت المناسب.

- **المدخلات — Arguments:** when اختيارية بالثواني.

- **الناتج/الأثر — Return / effect:** undefined؛ مش fetch.

- **أول موضع هنا:** السطر 174.

### oscillator.stop

- **جاية منين؟** Audio source

- **وظيفتها:** تحدد إيقاف المصدر.

- **المدخلات — Arguments:** when اختيارية بالثواني.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 175، والمدخلات المكتوبة: `audioContext.current.currentTime + 0.18`.

### ['staff', 'admin'].includes

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تختبر وجود قيمة في array أو نص داخل string.

- **المدخلات — Arguments:** القيمة/النص المطلوب.

- **الناتج/الأثر — Return / effect:** Boolean؛ مش العنصر ولا موقعه.

- **أول موضع هنا:** السطر 274، والمدخلات المكتوبة: `user.role`.

### URLSearchParams

- **جاية منين؟** Browser URL API

- **وظيفتها:** يبني query parameters ويعمل encoding عند إدراجه في URL؛ لا يرسل طلبًا بنفسه.

- **المدخلات — Arguments:** object أو query string أو entries.

- **الناتج/الأثر — Return / effect:** URLSearchParams instance.

- **أول موضع هنا:** السطر 183، والمدخلات المكتوبة: `{ date }`.

- **مثال:** const params = new URLSearchParams({ date });

### params.set

- **جاية منين؟** URLSearchParams

- **وظيفتها:** تضيف أو تستبدل query parameter في object الحالي.

- **المدخلات — Arguments:** name وvalue.

- **الناتج/الأثر — Return / effect:** undefined؛ يتحوّل إلى query string عند العرض في URL.

- **أول موضع هنا:** السطر 184، والمدخلات المكتوبة: `'branch_id'`، `branch`.

### csrfFetch

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح.

- **المدخلات — Arguments:** url: مسار API؛ options: method/body/headers وغيرها، الافتراضي {}.

- **الناتج/الأثر — Return / effect:** Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.

- **أول موضع هنا:** السطر 236، والمدخلات المكتوبة: `'/api/staff/orders/${order.id}/status'`، `{                 method: 'PATCH',                 body: JSON.stringify({ status, reason, expected_status: order.status }),             }`.

- **تكملة التعريف:** [resources/js/lib/api.js](../lib/api.js.md)، عند السطر 3.

### notify

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يبرز IDs الطلبات الجديدة ويعرض عددها؛ لو الصوت مفعّل ينشئ tone قصير باستخدام WebAudio.

- **المدخلات — Arguments:** newOrders array.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 187، والمدخلات المكتوبة: `fresh.filter((order) => order.status === 'new' && !knownIds.current.has(order.id))`.

### fresh.filter

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تختار كل العناصر التي شرطها truthy.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** array جديدة؛ لا تحذف الأصل بنفسها.

- **أول موضع هنا:** السطر 187، والمدخلات المكتوبة: `(order) => order.status === 'new' && !knownIds.current.has(order.id)`.

### knownIds.current.has

- **جاية منين؟** Map/Set في JavaScript

- **وظيفتها:** تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات.

- **المدخلات — Arguments:** مفتاح/قيمة حسب get/set/has/delete، وclear بدون.

- **الناتج/الأثر — Return / effect:** Boolean.

- **أول موضع هنا:** السطر 187، والمدخلات المكتوبة: `order.id`.

### fresh.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 188، والمدخلات المكتوبة: `(order) => order.id`.

### setOrders

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setOrders هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 240، والمدخلات المكتوبة: `(current) => current.map((item) => item.id === order.id ? response.order : item)`.

### setTiming

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setTiming هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 191، والمدخلات المكتوبة: `response.timing || { green_minutes: 3, orange_minutes: 6 }`.

### setLastUpdated

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setLastUpdated هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 192، والمدخلات المكتوبة: `new Date()`.

### setLoadError

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setLoadError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 195، والمدخلات المكتوبة: `error.message || 'Orders could not be refreshed.'`.

### loadOrders

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يتأكد من role وعدم وجود طلب جاري، يبني query date/branch، يجلب الطلبات، يكتشف IDs الجديدة ثم يحدّث board/timing/lastUpdated. finally يفك loadingRef.

- **المدخلات — Arguments:** لا parameters؛ يقرأ user/isAdmin/branch/date/notify من closure.

- **الناتج/الأثر — Return / effect:** Promise<void>.

- **أول موضع هنا:** السطر 246.

### window.setInterval

- **جاية منين؟** Browser

- **وظيفتها:** تسجّل نداءً متكررًا لدالة؛ أول مرة بعد الفاصل، مش فورًا.

- **المدخلات — Arguments:** callback وdelay بالمللي ثانية.

- **الناتج/الأثر — Return / effect:** رقم timer ID في المتصفح؛ التوقيت تقريبي.

- **أول موضع هنا:** السطر 213، والمدخلات المكتوبة: `() => setNow(Date.now())`، `1000`.

### window.clearInterval

- **جاية منين؟** Browser

- **وظيفتها:** تلغي النداءات القادمة لمؤقت تكرار محدد.

- **المدخلات — Arguments:** timer ID الراجع من setInterval.

- **الناتج/الأثر — Return / effect:** undefined؛ لا تلغي fetch بدأت بالفعل.

- **أول موضع هنا:** السطر 214، والمدخلات المكتوبة: `clock`.

### setNow

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setNow هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 213، والمدخلات المكتوبة: `Date.now()`.

### setPrintingOrderId

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setPrintingOrderId هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 256، والمدخلات المكتوبة: `orderId`.

### window.addEventListener

- **جاية منين؟** Browser EventTarget

- **وظيفتها:** تسجّل listener؛ مصدر الحدث يناديها ويمرر Event.

- **المدخلات — Arguments:** اسم الحدث والدالة وخيارات.

- **الناتج/الأثر — Return / effect:** undefined؛ لا تشغّل handler لحظة التسجيل.

- **أول موضع هنا:** السطر 219، والمدخلات المكتوبة: `'afterprint'`، `clearPrint`.

### window.removeEventListener

- **جاية منين؟** Browser EventTarget

- **وظيفتها:** تلغي listener بنفس الاسم ومرجع الدالة وcapture المناسب.

- **المدخلات — Arguments:** نوع الحدث والدالة وخيار capture إن لزم.

- **الناتج/الأثر — Return / effect:** undefined؛ لا توقف الحدث نفسه.

- **أول موضع هنا:** السطر 220، والمدخلات المكتوبة: `'afterprint'`، `clearPrint`.

### audioContext.current.resume

- **جاية منين؟** AudioContext

- **وظيفتها:** تستأنف تشغيل السياق المعلّق.

- **المدخلات — Arguments:** بدون arguments.

- **الناتج/الأثر — Return / effect:** Promise لاكتمال الاستئناف.

- **أول موضع هنا:** السطر 227.

### setMuted

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setMuted هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 229، والمدخلات المكتوبة: `nextMuted`.

### localStorage.setItem

- **جاية منين؟** Browser localStorage/sessionStorage

- **وظيفتها:** تحفظ قيمة نصية تحت مفتاح وتستبدل القديمة.

- **المدخلات — Arguments:** key وvalue.

- **الناتج/الأثر — Return / effect:** undefined؛ قد تفشل لو التخزين غير متاح.

- **أول موضع هنا:** السطر 230، والمدخلات المكتوبة: `'wtc-staff-muted'`، `nextMuted ? '1' : '0'`.

### setBusyOrders

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setBusyOrders هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 251، والمدخلات المكتوبة: `(current) => current.filter((id) => id !== order.id)`.

### JSON.stringify

- **جاية منين؟** JavaScript

- **وظيفتها:** يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions.

- **المدخلات — Arguments:** value

- **الناتج/الأثر — Return / effect:** string أو undefined لبعض القيم

- **أول موضع هنا:** السطر 238، والمدخلات المكتوبة: `{ status, reason, expected_status: order.status }`.

- **مثال:** localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

### current.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 240، والمدخلات المكتوبة: `(item) => item.id === order.id ? response.order : item`.

### setReasonAction

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setReasonAction هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 312، والمدخلات المكتوبة: `null`.

### Object.values(error.payload.errors).flat

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تفرد مستويات arrays حسب العمق.

- **المدخلات — Arguments:** depth اختياري افتراضيه1.

- **الناتج/الأثر — Return / effect:** array جديدة.

- **أول موضع هنا:** السطر 248.

### Object.values

- **جاية منين؟** JavaScript Object

- **وظيفتها:** يرجع قيم خصائص object بدون مفاتيح؛ مستخدم لاستخراج validation messages.

- **المدخلات — Arguments:** object.

- **الناتج/الأثر — Return / effect:** array قيم.

- **أول موضع هنا:** السطر 248، والمدخلات المكتوبة: `error.payload.errors`.

- **مثال:** Object.values(error.payload.errors).flat()[0];

### current.filter

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تختار كل العناصر التي شرطها truthy.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** array جديدة؛ لا تحذف الأصل بنفسها.

- **أول موضع هنا:** السطر 251، والمدخلات المكتوبة: `(id) => id !== order.id`.

### window.print

- **جاية منين؟** Browser

- **وظيفتها:** تفتح تدفق الطباعة.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** undefined؛ لا تنشئ طلب مطعم.

- **أول موضع هنا:** السطر 257.

### useMemo

- **جاية منين؟** React hook

- **وظيفتها:** يحفظ نتيجة حساب كتحسين أداء لحد تغير dependencies؛ callback للحساب مش مكان HTTP أو setState side effects.

- **المدخلات — Arguments:** calculate function,dependencies.

- **الناتج/الأثر — Return / effect:** القيمة المحسوبة.

- **أول موضع هنا:** السطر 262، والمدخلات المكتوبة: `() => orders.filter((order) => CLOSED_STATUSES.includes(order.status))`، `[orders]`.

- **مثال:** const completedOrders = useMemo(() => orders.filter((order) => order.status === 'completed'), [orders]);

### orders.filter

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تختار كل العناصر التي شرطها truthy.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** array جديدة؛ لا تحذف الأصل بنفسها.

- **أول موضع هنا:** السطر 262، والمدخلات المكتوبة: `(order) => CLOSED_STATUSES.includes(order.status)`.

### ['completed', ...CLOSED_STATUSES].includes

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تختبر وجود قيمة في array أو نص داخل string.

- **المدخلات — Arguments:** القيمة/النص المطلوب.

- **الناتج/الأثر — Return / effect:** Boolean؛ مش العنصر ولا موقعه.

- **أول موضع هنا:** السطر 260، والمدخلات المكتوبة: `order.status`.

### CLOSED_STATUSES.includes

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تختبر وجود قيمة في array أو نص داخل string.

- **المدخلات — Arguments:** القيمة/النص المطلوب.

- **الناتج/الأثر — Return / effect:** Boolean؛ مش العنصر ولا موقعه.

- **أول موضع هنا:** السطر 262، والمدخلات المكتوبة: `order.status`.

### activeOrders.filter

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تختار كل العناصر التي شرطها truthy.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** array جديدة؛ لا تحذف الأصل بنفسها.

- **أول موضع هنا:** السطر 263، والمدخلات المكتوبة: `(order) => column.statuses.includes(order.status)`.

### column.statuses.includes

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تختبر وجود قيمة في array أو نص داخل string.

- **المدخلات — Arguments:** القيمة/النص المطلوب.

- **الناتج/الأثر — Return / effect:** Boolean؛ مش العنصر ولا موقعه.

- **أول موضع هنا:** السطر 263، والمدخلات المكتوبة: `order.status`.

### ACTIVE_COLUMNS.findIndex

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تبحث عن موضع أول عنصر مطابق.

- **المدخلات — Arguments:** callback شرط.

- **الناتج/الأثر — Return / effect:** index أو -1 لو مفيش تطابق.

- **أول موضع هنا:** السطر 267، والمدخلات المكتوبة: `(column) => column.key === mobileColumn`.

### Math.min

- **جاية منين؟** Math / JavaScript

- **وظيفتها:** ترجع أصغر المدخلات.

- **المدخلات — Arguments:** أعداد.

- **الناتج/الأثر — Return / effect:** number.

- **أول موضع هنا:** السطر 268، والمدخلات المكتوبة: `ACTIVE_COLUMNS.length - 1`، `Math.max(0, index + direction)`.

### setMobileColumn

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setMobileColumn هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 302، والمدخلات المكتوبة: `column.key`.

### catalogBranches.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 291، والمدخلات المكتوبة: `(item) => <option key={item.id} value={item.id}>{item.name}</option>`.

### setDate

- **جاية منين؟** Date instance

- **وظيفتها:** تغيّر يوم الشهر في نفس Date، مع حساب عبور الشهور.

- **المدخلات — Arguments:** day number.

- **الناتج/الأثر — Return / effect:** timestamp بعد التعديل؛ تعدّل object نفسها.

- **أول موضع هنا:** السطر 292، والمدخلات المكتوبة: `event.target.value`.

### lastUpdated.toLocaleTimeString

- **جاية منين؟** Date instance

- **وظيفتها:** تنسّق الوقت للعرض المحلي.

- **المدخلات — Arguments:** locale وخيارات.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 294، والمدخلات المكتوبة: `[]`، `{ hour: '2-digit', minute: '2-digit', second: '2-digit' }`.

### setView

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setView هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 298، والمدخلات المكتوبة: `'history'`.

### ACTIVE_COLUMNS.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 304، والمدخلات المكتوبة: `(column) => { const cards = columnOrders(column); return <section key={column.key} className={'wtc-board-column ${mobileColumn === column.key ? 'is-mobile-active' : ''}'} aria-labe…`.

### columnOrders

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يفلتر الطلبات النشطة لحالات العمود المطلوب.

- **المدخلات — Arguments:** column object وله statuses array.

- **الناتج/الأثر — Return / effect:** array طلبات.

- **أول موضع هنا:** السطر 304، والمدخلات المكتوبة: `column`.

### Math.abs

- **جاية منين؟** Math / JavaScript

- **وظيفتها:** ترجع القيمة المطلقة بدون إشارة.

- **المدخلات — Arguments:** number.

- **الناتج/الأثر — Return / effect:** number.

- **أول موضع هنا:** السطر 303، والمدخلات المكتوبة: `distance`.

### swipeColumns

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يحرك تبويب الموبايل بواحد يمين/شمال مع حصر index بين أول وآخر عمود.

- **المدخلات — Arguments:** direction: 1 أو -1.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 303، والمدخلات المكتوبة: `distance < 0 ? 1 : -1`.

### cards.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 304، والمدخلات المكتوبة: `(order) => <OrderCard key={order.id} order={order} now={now} timing={timing} busy={busyOrders.includes(order.id)} highlighted={highlighted.includes(order.id)} printing={printingOrd…`.

### busyOrders.includes

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تختبر وجود قيمة في array أو نص داخل string.

- **المدخلات — Arguments:** القيمة/النص المطلوب.

- **الناتج/الأثر — Return / effect:** Boolean؛ مش العنصر ولا موقعه.

- **أول موضع هنا:** السطر 312، والمدخلات المكتوبة: `reasonAction.order.id`.

### highlighted.includes

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تختبر وجود قيمة في array أو نص داخل string.

- **المدخلات — Arguments:** القيمة/النص المطلوب.

- **الناتج/الأثر — Return / effect:** Boolean؛ مش العنصر ولا موقعه.

- **أول موضع هنا:** السطر 304، والمدخلات المكتوبة: `order.id`.

### setHistoryTab

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setHistoryTab هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 307، والمدخلات المكتوبة: `'closed'`.

### displayedHistory.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 308، والمدخلات المكتوبة: `(order) => <OrderCard key={order.id} order={order} now={now} timing={timing} busy={false} highlighted={false} printing={printingOrderId === order.id} reduceMotion={reduceMotion} on…`.

### updateStatus

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** PATCH للحالة مع expected_status لمنع تعديل مبني على حالة قديمة؛ يستبدل الطلب الراجع في state. conflict يعيد تحميل اللوحة؛ finally يمسح busy ID.

- **المدخلات — Arguments:** order, status, reason=null.

- **الناتج/الأثر — Return / effect:** Promise<void>.

- **أول موضع هنا:** السطر 312، والمدخلات المكتوبة: `reasonAction.order`، `reasonAction.status`، `reason`.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { csrfFetch } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useCatalog } from '../context/CatalogContext';

```

**السطر 1:** Import / استيراد: الأسماء `React`، `useCallback`، `useEffect`، `useMemo`، `useRef`، `useState` جاية من `react`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 2:** Import / استيراد: الأسماء `AnimatePresence`، `motion`، `useReducedMotion` جاية من `framer-motion`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 3:** Import / استيراد: الأسماء `Modal` جاية من `react-bootstrap`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 4:** Import / استيراد: الأسماء `Link` جاية من `react-router-dom`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 5:** Import / استيراد: الأسماء `csrfFetch` جاية من `../lib/api`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 6:** Import / استيراد: الأسماء `useAuth` جاية من `../context/AuthContext`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 7:** Import / استيراد: الأسماء `useCatalog` جاية من `../context/CatalogContext`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

### السطور 9–16

```jsx
const ACTIVE_COLUMNS = [
    { key: 'new', title: 'New', statuses: ['new'] },
    { key: 'preparing', title: 'Preparing', statuses: ['accepted', 'preparing'] },
    { key: 'ready', title: 'Ready', statuses: ['ready'] },
    { key: 'journey', title: 'On the way / Done', statuses: ['out_for_delivery', 'picked_up'] },
];
const CLOSED_STATUSES = ['cancelled', 'rejected'];
const QUICK_REASONS = ['Out of stock', 'Too busy', 'Address problem', 'Customer request', 'Other'];
```

**السطر 9:** Variable declaration / تعريف `ACTIVE_COLUMNS` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة الابتدائية Array فيها 4 عنصرًا؛ العناصر نفسها في السطور التالية.

**السطر 10:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 11:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 12:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 13:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 14:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 15:** Variable declaration / تعريف `CLOSED_STATUSES` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة الابتدائية Array فيها 2 عنصرًا؛ العناصر نفسها في السطور التالية.

**السطر 16:** Variable declaration / تعريف `QUICK_REASONS` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. القيمة الابتدائية Array فيها 5 عنصرًا؛ العناصر نفسها في السطور التالية.

### السطور 17–24

```jsx

function today() {
    return new Date().toISOString().slice(0, 10);
}

function BellIcon() {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
```

**السطر 18:** Function / تعريف دالة `today`؛ تعريفها مش تشغيلها. يولّد تاريخ اليوم بصيغة YYYY-MM-DD من ISO؛ ISO هنا UTC، فلا تعتبره دائمًا تاريخ مصر المحلي قرب منتصف الليل. مدخلاتها: لا شيء. ناتجها: string.

**السطر 19:** Return / رجّع `new Date().toISOString().slice(0, 10)` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `new Date().toISOString().slice(...)`: تأخذ جزءًا بدون تعديل الأصل. القيم المكتوبة هنا: `0`، `10`. العائد/الأثر: نسخة array جزئية أو نص جزئي حسب المستقبِل.؛ `new Date().toISOString(...)`: تنسّق التاريخ بنظام UTC. مدخلاتها: بدون مدخلات. العائد/الأثر: string؛ اليوم قد يختلف عن توقيت جهازك المحلي.؛ `Date(...)`: مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي. مدخلاتها: قيمة تاريخ اختيارية. العائد/الأثر: Date object عند new؛ مش string تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 20:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 22:** Function / تعريف دالة `BellIcon`؛ تعريفها مش تشغيلها. يرسم SVG لجرس زر الصوت. مدخلاتها: لا شيء. ناتجها: JSX svg.

**السطر 23:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 24:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 25–32

```jsx
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function stepStart(order) {
    const matchingLog = [...(order.status_logs || [])].reverse().find((log) => log.to_status === order.status);
    return matchingLog?.created_at || order.updated_at || order.created_at;
```

**السطر 25:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 26:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 27:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 28:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 30:** Function / تعريف دالة `stepStart`؛ تعريفها مش تشغيلها. يبحث من أحدث status_logs عن بداية الحالة الحالية، ثم fallback إلى updated_at أو created_at. مدخلاتها: order. ناتجها: تاريخ string.

**السطر 31:** Variable declaration / تعريف `matchingLog` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `[...(order.status_logs || [])].reverse().find(...)`: تبحث بالترتيب حتى أول callback truthy. القيم المكتوبة هنا: `(log) => log.to_status === order.status`. العائد/الأثر: العنصر المطابق نفسه أو undefined؛ ليست array نتائج.؛ `[...(order.status_logs || [])].reverse(...)`: تعكس ترتيب array الأصلية. مدخلاتها: بدون مدخلات. العائد/الأثر: نفس array المعدّلة؛ اعمل نسخة قبلها لو لا تريد mutation.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 32:** Return / رجّع `matchingLog?.created_at || order.updated_at || order.created_at` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

### السطور 33–40

```jsx
}

function timerDetails(order, now, timing) {
    const elapsedSeconds = Math.max(0, Math.floor((now - new Date(stepStart(order)).getTime()) / 1000));
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    const level = elapsedSeconds < timing.green_minutes * 60
        ? 'green'
```

**السطر 33:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 35:** Function / تعريف دالة `timerDetails`؛ تعريفها مش تشغيلها. يحسب الزمن منذ بداية المرحلة ويصنفه green/orange/red حسب thresholds ويحوله إلى label دقائق وثوانٍ. مدخلاتها: order, now timestamp, timing thresholds. ناتجها: {label,level}.

**السطر 36:** Variable declaration / تعريف `elapsedSeconds` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Math.max(...)`: ترجع أكبر المدخلات. القيم المكتوبة هنا: `0`، `Math.floor((now - new Date(stepStart(order)).getTime()) / 1000)`. العائد/الأثر: number.؛ `Math.floor(...)`: تأخذ أكبر integer لا يزيد عن العدد. القيم المكتوبة هنا: `(now - new Date(stepStart(order)).getTime()) / 1000`. العائد/الأثر: number.؛ `new Date(stepStart(order)).getTime(...)`: تحوّل Date إلى timestamp. مدخلاتها: بدون مدخلات. العائد/الأثر: milliseconds؛ قد تكون NaN لتاريخ غير صالح.؛ `Date(...)`: مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي. القيم المكتوبة هنا: `stepStart(order)`. العائد/الأثر: Date object عند new؛ مش string تلقائيًا.؛ `stepStart(...)`: يبحث من أحدث status_logs عن بداية الحالة الحالية، ثم fallback إلى updated_at أو created_at. القيم المكتوبة هنا: `order`. العائد/الأثر: تاريخ string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 37:** Variable declaration / تعريف `minutes` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Math.floor(...)`: تأخذ أكبر integer لا يزيد عن العدد. القيم المكتوبة هنا: `elapsedSeconds / 60`. العائد/الأثر: number.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 38:** Variable declaration / تعريف `seconds` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 39:** Variable declaration / تعريف `level` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 40:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 41–48

```jsx
        : elapsedSeconds <= timing.orange_minutes * 60 ? 'orange' : 'red';
    return { label: `${minutes}m ${String(seconds).padStart(2, '0')}s`, level };
}

function primaryAction(order) {
    if (order.status === 'new') return { status: 'preparing', label: 'Accept & start preparing' };
    if (order.status === 'accepted') return { status: 'preparing', label: 'Start preparing' };
    if (order.status === 'preparing') return { status: 'ready', label: 'Mark ready' };
```

**السطر 41:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 42:** Return / رجّع `{ label: '${minutes}m ${String(seconds).padStart(2, '0')}s', level }` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `String(seconds).padStart(...)`: تضيف padding لبداية النص حتى طول محدد. القيم المكتوبة هنا: `2`، `'0'`. العائد/الأثر: نص جديد.؛ `String(...)`: تحوّل قيمة إلى نص عند استدعائها بدون new. القيم المكتوبة هنا: `seconds`. العائد/الأثر: string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 43:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 45:** Function / تعريف دالة `primaryAction`؛ تعريفها مش تشغيلها. جدول قرار للزر القادم حسب الحالة وطريقة الطلب؛ واجهة فقط، السيرفر يراجع الانتقال مرة أخرى. مدخلاتها: order. ناتجها: {status,label} أو null.

**السطر 46:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 47:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 48:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

### السطور 49–56

```jsx
    if (order.status === 'ready') return order.order_type === 'delivery'
        ? { status: 'out_for_delivery', label: 'Out for delivery' }
        : { status: 'picked_up', label: 'Customer picked up' };
    if (['out_for_delivery', 'picked_up'].includes(order.status)) return { status: 'completed', label: 'Complete' };
    return null;
}

function ReasonModal({ action, busy, onClose, onConfirm }) {
```

**السطر 49:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 50:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 51:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 52:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `['out_for_delivery', 'picked_up'].includes(...)`: تختبر وجود قيمة في array أو نص داخل string. القيم المكتوبة هنا: `order.status`. العائد/الأثر: Boolean؛ مش العنصر ولا موقعه.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 53:** Return / رجّع `null` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 54:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 56:** Function / تعريف دالة `ReasonModal`؛ تعريفها مش تشغيلها. يجمع سبب جاهز وتفاصيل ثم يرسل النص إلى onConfirm؛ ينظف المدخلات عند تغيّر action. مدخلاتها: action,busy,onClose,onConfirm. ناتجها: JSX Modal.

### السطور 57–64

```jsx
    const [quickReason, setQuickReason] = useState('');
    const [details, setDetails] = useState('');
    const reason = quickReason === 'Other' ? details.trim() : [quickReason, details.trim()].filter(Boolean).join(': ');

    useEffect(() => {
        setQuickReason('');
        setDetails('');
    }, [action]);
```

**السطر 57:** Variable declaration / تعريف `quickReason + setQuickReason` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `''`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 58:** Variable declaration / تعريف `details + setDetails` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `''`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 59:** Variable declaration / تعريف `reason` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `details.trim(...)`: تشيل whitespace من أول وآخر النص فقط. مدخلاتها: بدون مدخلات. العائد/الأثر: نص جديد؛ لا تغيّر النص الأصلي.؛ `[quickReason, details.trim()].filter(Boolean).join(...)`: تجمع عناصر في نص. القيم المكتوبة هنا: `': '`. العائد/الأثر: string، لا تعدّل عناصر الأصل.؛ `[quickReason, details.trim()].filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `Boolean`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 61:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `() => {         setQuickReason('');         setDetails('');     }`، `[action]`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 62:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setQuickReason(...)`: لو setQuickReason هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `''`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 63:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setDetails(...)`: لو setDetails هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `''`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 64:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 65–72

```jsx

    return (
        <Modal show={Boolean(action)} onHide={busy ? undefined : onClose} centered contentClassName="wtc-reason-modal">
            <Modal.Header closeButton closeVariant="white">
                <Modal.Title>{action?.status === 'rejected' ? 'Reject order' : 'Cancel order'} #{action?.order.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="text-secondary">Choose a clear reason for the customer and the status history.</p>
```

**السطر 66:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 67:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `Boolean(...)`: تحوّل قيمة إلى true/false حسب truthiness. القيم المكتوبة هنا: `action`. العائد/الأثر: Boolean؛ النص false غير الفاضي يساوي true.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 68:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 69:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 70:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 71:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 72:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 73–80

```jsx
                <div className="wtc-reason-grid" role="group" aria-label="Quick reasons">
                    {QUICK_REASONS.map((item) => <button key={item} type="button" className={quickReason === item ? 'active' : ''} onClick={() => setQuickReason(item)}>{item}</button>)}
                </div>
                <label className="form-label fw-bold mt-3" htmlFor="status-reason-details">Extra details <span className="text-secondary fw-normal">(optional)</span></label>
                <textarea id="status-reason-details" className="wtc-reason-input" rows="3" maxLength="500" value={details} onChange={(event) => setDetails(event.target.value)} placeholder={quickReason === 'Other' ? 'Tell the team what happened' : 'Add a short note'} />
            </Modal.Body>
            <Modal.Footer>
                <button type="button" className="btn btn-outline-light" disabled={busy} onClick={onClose}>Go back</button>
```

**السطر 73:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 74:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `QUICK_REASONS.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(item) => <button key={item} type="button" className={quickReason === item ? 'active' : ''} onClick={() => set…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `setQuickReason(...)`: لو setQuickReason هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `item`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 75:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 76:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 77:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `setDetails(...)`: لو setDetails هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `event.target.value`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 78:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 79:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 80:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها.

### السطور 81–88

```jsx
                <button type="button" className="btn btn-red" disabled={!reason || busy} onClick={() => onConfirm(reason)}>{busy ? 'Saving...' : 'Confirm reason'}</button>
            </Modal.Footer>
        </Modal>
    );
}

function OrderCard({ order, now, timing, busy, highlighted, printing, reduceMotion, onAdvance, onReason, onPrint }) {
    const timer = timerDetails(order, now, timing);
```

**السطر 81:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `onConfirm(...)`: تنادي العملية اللي الأب أو الـContext مرّرها باسم onConfirm؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي. القيم المكتوبة هنا: `reason`. العائد/الأثر: العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 82:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 83:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 84:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 85:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 87:** Function / تعريف دالة `OrderCard`؛ تعريفها مش تشغيلها. يرسم الطلب والعداد والأصناف؛ ينادي callbacks onAdvance/onReason/onPrint المرسلة من الأب. مدخلاتها: order,now,timing,busy,highlighted,printing,reduceMotion,onAdvance,onReason,onPrint. ناتجها: motion.article JSX.

**السطر 88:** Variable declaration / تعريف `timer` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `timerDetails(...)`: يحسب الزمن منذ بداية المرحلة ويصنفه green/orange/red حسب thresholds ويحوله إلى label دقائق وثوانٍ. القيم المكتوبة هنا: `order`، `now`، `timing`. العائد/الأثر: {label,level}.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 89–96

```jsx
    const action = primaryAction(order);
    const canClose = !['completed', 'cancelled', 'rejected', 'picked_up'].includes(order.status);
    const location = order.order_type === 'delivery'
        ? order.delivery_address || 'Delivery address missing'
        : order.pickup_time ? `Arriving ${new Date(order.pickup_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Pickup time not set';

    return (
        <motion.article
```

**السطر 89:** Variable declaration / تعريف `action` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `primaryAction(...)`: جدول قرار للزر القادم حسب الحالة وطريقة الطلب؛ واجهة فقط، السيرفر يراجع الانتقال مرة أخرى. القيم المكتوبة هنا: `order`. العائد/الأثر: {status,label} أو null.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 90:** Variable declaration / تعريف `canClose` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `['completed', 'cancelled', 'rejected', 'picked_up'].includes(...)`: تختبر وجود قيمة في array أو نص داخل string. القيم المكتوبة هنا: `order.status`. العائد/الأثر: Boolean؛ مش العنصر ولا موقعه.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 91:** Variable declaration / تعريف `location` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 92:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 93:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `new Date(order.pickup_time).toLocaleTimeString(...)`: تنسّق الوقت للعرض المحلي. القيم المكتوبة هنا: `[]`، `{ hour: '2-digit', minute: '2-digit' }`. العائد/الأثر: string.؛ `Date(...)`: مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي. القيم المكتوبة هنا: `order.pickup_time`. العائد/الأثر: Date object عند new؛ مش string تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 95:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 96:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 97–104

```jsx
            layout={!reduceMotion}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: highlighted ? [1, 1.02, 1] : 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.28 }}
            className={`wtc-kitchen-card ${highlighted ? 'is-new' : ''} ${printing ? 'is-printing' : ''}`}
        >
            <div className="wtc-card-top">
                <div><span className="wtc-order-number">#{order.id}</span><span className="wtc-order-type">{order.order_type.replace('_', ' ')}</span></div>
```

**السطر 97:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 98:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 99:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 100:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 101:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 102:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 103:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 104:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض. الدوال الموجودة في السطر: `order.order_type.replace(...)`: تستبدل تطابقًا أو تطابقات حسب pattern. القيم المكتوبة هنا: `'_'`، `' '`. العائد/الأثر: نص جديد؛ الأصل لا يتغيّر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 105–112

```jsx
                <div className={`wtc-step-timer is-${timer.level}`}><span>In this step</span><strong>{timer.label}</strong></div>
            </div>
            <div className="wtc-ticket-only"><strong>WHAT THE CRUST · KITCHEN TICKET</strong></div>
            <h3>{order.customer_name || order.user?.name || 'Guest order'}</h3>
            <a className="wtc-phone" href={`tel:${order.customer_phone}`}>{order.customer_phone || 'No phone'}</a>
            <div className="wtc-fulfillment-callout"><span>{order.order_type === 'delivery' ? 'Deliver to' : 'Pickup'}</span><strong>{location}</strong></div>
            <div className="wtc-item-list">
                {order.items.map((item) => (
```

**السطر 105:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 106:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 107:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 108:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 109:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 110:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 111:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 112:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `order.items.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(item) => (                     <div className="wtc-kitchen-item" key={item.id}>                         <stro…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 113–120

```jsx
                    <div className="wtc-kitchen-item" key={item.id}>
                        <strong><span>{item.quantity}×</span> {item.item_name || item.menu_item?.name || 'Menu item'}</strong>
                        {item.notes && <div className="wtc-kitchen-note"><span>NOTE</span>{item.notes}</div>}
                    </div>
                ))}
            </div>
            <div className="wtc-card-summary"><span>{order.branch?.name}</span><span className="text-capitalize">{order.payment_status} · {order.payment_method}</span><strong>EGP {order.total_price}</strong></div>
            {action && <button type="button" className="wtc-primary-action" disabled={busy} onClick={() => onAdvance(order, action.status)}>{busy ? 'Updating...' : action.label}</button>}
```

**السطر 113:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 114:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 115:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 116:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 117:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 118:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 119:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 120:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `onAdvance(...)`: تنادي العملية اللي الأب أو الـContext مرّرها باسم onAdvance؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي. القيم المكتوبة هنا: `order`، `action.status`. العائد/الأثر: العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 121–128

```jsx
            <div className="wtc-card-tools">
                <button type="button" onClick={() => onPrint(order.id)}>Print ticket</button>
                {canClose && <button type="button" className="danger" onClick={() => onReason(order, order.status === 'new' ? 'rejected' : 'cancelled')}>{order.status === 'new' ? 'Reject order' : 'Cancel order'}</button>}
            </div>
        </motion.article>
    );
}

```

**السطر 121:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 122:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `onPrint(...)`: تنادي العملية اللي الأب أو الـContext مرّرها باسم onPrint؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي. القيم المكتوبة هنا: `order.id`. العائد/الأثر: العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 123:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `onReason(...)`: تنادي العملية اللي الأب أو الـContext مرّرها باسم onReason؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي. القيم المكتوبة هنا: `order`، `order.status === 'new' ? 'rejected' : 'cancelled'`. العائد/الأثر: العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 124:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 125:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 126:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 127:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 129–136

```jsx
export default function StaffDashboard() {
    const { user, isCheckingAuth } = useAuth();
    const { branches: catalogBranches, loading: branchesLoading } = useCatalog();
    const reduceMotion = useReducedMotion();
    const [orders, setOrders] = useState([]);
    const [branch, setBranch] = useState('');
    const [date, setDate] = useState(today());
    const [view, setView] = useState('active');
```

**السطر 129:** Function / تعريف دالة `StaffDashboard`؛ تعريفها مش تشغيلها. أب حالة لوحة الطلبات ومركز الاتصال بالـ API والـ modal والطباعة والفلاتر. مدخلاتها: contexts. ناتجها: JSX للحالات المسموح/المرفوض/التحميل واللوحة.

**السطر 130:** Variable declaration / تعريف اسم/أسماء لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useAuth(...)`: Custom hook يقرأ AuthContext؛ يرمي خطأ واضح لو اتنادى خارج AuthProvider. مدخلاتها: لا شيء. العائد/الأثر: object فيه user/isCheckingAuth/login/register/logout.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 131:** Variable declaration / تعريف اسم/أسماء لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useCatalog(...)`: يوصل المكوّن إلى الكتالوج المشترك؛ يفشل بوضوح لو Provider غير موجود. مدخلاتها: لا شيء. العائد/الأثر: branches/categories/items/loading/error/reload.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 132:** Variable declaration / تعريف `reduceMotion` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useReducedMotion(...)`: يقرأ تفضيل المستخدم لتقليل الحركة ويستخدم لاختيار animations أخف؛ قيمته ليست طلب تعطيل الـ UI نفسه. مدخلاتها: لا شيء. العائد/الأثر: Boolean أو null في سياقات لا يتوفر فيها القياس.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 133:** Variable declaration / تعريف `orders + setOrders` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `[]`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 134:** Variable declaration / تعريف `branch + setBranch` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `''`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 135:** Variable declaration / تعريف `date + setDate` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `today()`. العائد/الأثر: [currentState,setter]؛ `today(...)`: يولّد تاريخ اليوم بصيغة YYYY-MM-DD من ISO؛ ISO هنا UTC، فلا تعتبره دائمًا تاريخ مصر المحلي قرب منتصف الليل. مدخلاتها: لا شيء. العائد/الأثر: string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 136:** Variable declaration / تعريف `view + setView` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `'active'`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 137–144

```jsx
    const [historyTab, setHistoryTab] = useState('completed');
    const [mobileColumn, setMobileColumn] = useState('new');
    const [message, setMessage] = useState('');
    const [loadError, setLoadError] = useState('');
    const [lastUpdated, setLastUpdated] = useState(null);
    const [timing, setTiming] = useState({ green_minutes: 3, orange_minutes: 6 });
    const [now, setNow] = useState(Date.now());
    const [muted, setMuted] = useState(() => localStorage.getItem('wtc-staff-muted') !== '0');
```

**السطر 137:** Variable declaration / تعريف `historyTab + setHistoryTab` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `'completed'`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 138:** Variable declaration / تعريف `mobileColumn + setMobileColumn` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `'new'`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 139:** Variable declaration / تعريف `message + setMessage` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `''`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 140:** Variable declaration / تعريف `loadError + setLoadError` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `''`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 141:** Variable declaration / تعريف `lastUpdated + setLastUpdated` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `null`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 142:** Variable declaration / تعريف `timing + setTiming` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `{ green_minutes: 3, orange_minutes: 6 }`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 143:** Variable declaration / تعريف `now + setNow` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `Date.now()`. العائد/الأثر: [currentState,setter]؛ `Date.now(...)`: تقرأ وقت النظام الحالي كـtimestamp. مدخلاتها: بدون مدخلات. العائد/الأثر: milliseconds منذ Unix epoch، مش Date object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 144:** Variable declaration / تعريف `muted + setMuted` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `() => localStorage.getItem('wtc-staff-muted') !== '0'`. العائد/الأثر: [currentState,setter]؛ `localStorage.getItem(...)`: تقرأ النص المحفوظ تحت مفتاح. القيم المكتوبة هنا: `'wtc-staff-muted'`. العائد/الأثر: string أو null؛ لا تعيد object تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 145–152

```jsx
    const [highlighted, setHighlighted] = useState([]);
    const [busyOrders, setBusyOrders] = useState([]);
    const [reasonAction, setReasonAction] = useState(null);
    const [printingOrderId, setPrintingOrderId] = useState(null);
    const knownIds = useRef(new Set());
    const loadedOnce = useRef(false);
    const loadingRef = useRef(false);
    const audioContext = useRef(null);
```

**السطر 145:** Variable declaration / تعريف `highlighted + setHighlighted` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `[]`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 146:** Variable declaration / تعريف `busyOrders + setBusyOrders` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `[]`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 147:** Variable declaration / تعريف `reasonAction + setReasonAction` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `null`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 148:** Variable declaration / تعريف `printingOrderId + setPrintingOrderId` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `null`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 149:** Variable declaration / تعريف `knownIds` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useRef(...)`: مرجع ثابت .current للDOM أو قيمة لا تتطلب render عند تغييرها. القيم المكتوبة هنا: `new Set()`. العائد/الأثر: MutableRefObject؛ `Set(...)`: تنشئ مجموعة قيم فريدة. مدخلاتها: iterable اختيارية. العائد/الأثر: Set instance، مش array.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 150:** Variable declaration / تعريف `loadedOnce` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useRef(...)`: مرجع ثابت .current للDOM أو قيمة لا تتطلب render عند تغييرها. القيم المكتوبة هنا: `false`. العائد/الأثر: MutableRefObject. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 151:** Variable declaration / تعريف `loadingRef` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useRef(...)`: مرجع ثابت .current للDOM أو قيمة لا تتطلب render عند تغييرها. القيم المكتوبة هنا: `false`. العائد/الأثر: MutableRefObject. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 152:** Variable declaration / تعريف `audioContext` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useRef(...)`: مرجع ثابت .current للDOM أو قيمة لا تتطلب render عند تغييرها. القيم المكتوبة هنا: `null`. العائد/الأثر: MutableRefObject. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 153–160

```jsx
    const touchStart = useRef(null);
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        if (user?.role === 'staff' && user.branch_id) {
            setBranch(String(user.branch_id));
        }
    }, [user]);
```

**السطر 153:** Variable declaration / تعريف `touchStart` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useRef(...)`: مرجع ثابت .current للDOM أو قيمة لا تتطلب render عند تغييرها. القيم المكتوبة هنا: `null`. العائد/الأثر: MutableRefObject. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 154:** Variable declaration / تعريف `isAdmin` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 156:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `() => {         if (user?.role === 'staff' && user.branch_id) {             setBranch(String(user.branch_id));…`، `[user]`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 157:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 158:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setBranch(...)`: لو setBranch هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `String(user.branch_id)`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `String(...)`: تحوّل قيمة إلى نص عند استدعائها بدون new. القيم المكتوبة هنا: `user.branch_id`. العائد/الأثر: string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 159:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 160:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 161–168

```jsx

    const notify = useCallback((newOrders) => {
        if (!newOrders.length) return;
        setMessage(`${newOrders.length} new order${newOrders.length > 1 ? 's' : ''} received.`);
        setHighlighted(newOrders.map((order) => order.id));
        window.setTimeout(() => setHighlighted([]), 3600);
        if (!muted && audioContext.current) {
            const oscillator = audioContext.current.createOscillator();
```

**السطر 162:** Variable declaration / تعريف `notify` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `notify` هنا: يبرز IDs الطلبات الجديدة ويعرض عددها؛ لو الصوت مفعّل ينشئ tone قصير باستخدام WebAudio. المدخلات: newOrders array.. الناتج/الأثر: undefined.. الدوال الموجودة في السطر: `useCallback(...)`: يثبت هوية function بين renders ما دامت dependencies ثابتة؛ لا ينفذ الدالة ولا يحفظ نتيجة API. مهم لأن loadOrders dependency للـ polling effect. القيم المكتوبة هنا: `(newOrders) => {         if (!newOrders.length) return;         setMessage('${newOrders.length} new order${new…`، `[muted]`. العائد/الأثر: function memoized.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 163:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 164:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setMessage(...)`: لو setMessage هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `'${newOrders.length} new order${newOrders.length > 1 ? 's' : ''} received.'`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 165:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setHighlighted(...)`: لو setHighlighted هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `newOrders.map((order) => order.id)`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `newOrders.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(order) => order.id`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 166:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `window.setTimeout(...)`: ترتّب نداء callback مرة واحدة بعد التأخير. القيم المكتوبة هنا: `() => setHighlighted([])`، `3600`. العائد/الأثر: timer ID في المتصفح.؛ `setHighlighted(...)`: لو setHighlighted هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `[]`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 167:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 168:** Variable declaration / تعريف `oscillator` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `audioContext.current.createOscillator(...)`: تنشئ مصدر نغمة صوتية. مدخلاتها: بدون arguments. العائد/الأثر: OscillatorNode؛ التشغيل يحتاج start.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 169–176

```jsx
            const gain = audioContext.current.createGain();
            oscillator.frequency.value = 760;
            gain.gain.setValueAtTime(0.1, audioContext.current.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + 0.18);
            oscillator.connect(gain).connect(audioContext.current.destination);
            oscillator.start();
            oscillator.stop(audioContext.current.currentTime + 0.18);
        }
```

**السطر 169:** Variable declaration / تعريف `gain` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `audioContext.current.createGain(...)`: تنشئ عقدة للتحكم في مستوى الصوت. مدخلاتها: بدون arguments. العائد/الأثر: GainNode.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 170:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 171:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `gain.gain.setValueAtTime(...)`: تحدد قيمة parameter في توقيت صوتي. القيم المكتوبة هنا: `0.1`، `audioContext.current.currentTime`. العائد/الأثر: AudioParam نفسها للـchaining.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 172:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `gain.gain.exponentialRampToValueAtTime(...)`: تحدد انتقالًا أسيًا لقيمة موجبة بنهاية زمنية. القيم المكتوبة هنا: `0.001`، `audioContext.current.currentTime + 0.18`. العائد/الأثر: AudioParam؛ مش timer ID.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 173:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `oscillator.connect(gain).connect(...)`: تصل عقدة صوت بالهدف. القيم المكتوبة هنا: `audioContext.current.destination`. العائد/الأثر: الهدف في overload ربط AudioNode؛ الناتج يختلف مع AudioParam.؛ `oscillator.connect(...)`: تصل عقدة صوت بالهدف. القيم المكتوبة هنا: `gain`. العائد/الأثر: الهدف في overload ربط AudioNode؛ الناتج يختلف مع AudioParam.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 174:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `oscillator.start(...)`: تبدأ مصدر الصوت في التوقيت المناسب. مدخلاتها: when اختيارية بالثواني. العائد/الأثر: undefined؛ مش fetch.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 175:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `oscillator.stop(...)`: تحدد إيقاف المصدر. القيم المكتوبة هنا: `audioContext.current.currentTime + 0.18`. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 176:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 177–184

```jsx
    }, [muted]);

    const loadOrders = useCallback(async () => {
        if (!user || !['staff', 'admin'].includes(user.role) || loadingRef.current) return;
        loadingRef.current = true;
        try {
            const params = new URLSearchParams({ date });
            if (isAdmin && branch) params.set('branch_id', branch);
```

**السطر 177:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 179:** Variable declaration / تعريف `loadOrders` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `loadOrders` هنا: يتأكد من role وعدم وجود طلب جاري، يبني query date/branch، يجلب الطلبات، يكتشف IDs الجديدة ثم يحدّث board/timing/lastUpdated. finally يفك loadingRef. المدخلات: لا parameters؛ يقرأ user/isAdmin/branch/date/notify من closure.. الناتج/الأثر: Promise<void>.. الدوال الموجودة في السطر: `useCallback(...)`: يثبت هوية function بين renders ما دامت dependencies ثابتة؛ لا ينفذ الدالة ولا يحفظ نتيجة API. مهم لأن loadOrders dependency للـ polling effect. القيم المكتوبة هنا: `async () => {         if (!user || !['staff', 'admin'].includes(user.role) || loadingRef.current) return;     …`، `[user, isAdmin, branch, date, notify]`. العائد/الأثر: function memoized.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 180:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `['staff', 'admin'].includes(...)`: تختبر وجود قيمة في array أو نص داخل string. القيم المكتوبة هنا: `user.role`. العائد/الأثر: Boolean؛ مش العنصر ولا موقعه.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 181:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 182:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة.

**السطر 183:** Variable declaration / تعريف `params` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `URLSearchParams(...)`: يبني query parameters ويعمل encoding عند إدراجه في URL؛ لا يرسل طلبًا بنفسه. القيم المكتوبة هنا: `{ date }`. العائد/الأثر: URLSearchParams instance.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 184:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `params.set(...)`: تضيف أو تستبدل query parameter في object الحالي. القيم المكتوبة هنا: `'branch_id'`، `branch`. العائد/الأثر: undefined؛ يتحوّل إلى query string عند العرض في URL.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 185–192

```jsx
            const response = await csrfFetch(`/api/staff/orders?${params}`);
            const fresh = response.orders || [];
            if (loadedOnce.current) notify(fresh.filter((order) => order.status === 'new' && !knownIds.current.has(order.id)));
            knownIds.current = new Set(fresh.map((order) => order.id));
            loadedOnce.current = true;
            setOrders(fresh);
            setTiming(response.timing || { green_minutes: 3, orange_minutes: 6 });
            setLastUpdated(new Date());
```

**السطر 185:** Variable declaration / تعريف `response` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `csrfFetch(...)`: توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح. القيم المكتوبة هنا: `'/api/staff/orders?${params}'`. العائد/الأثر: Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 186:** Variable declaration / تعريف `fresh` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 187:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `notify(...)`: يبرز IDs الطلبات الجديدة ويعرض عددها؛ لو الصوت مفعّل ينشئ tone قصير باستخدام WebAudio. القيم المكتوبة هنا: `fresh.filter((order) => order.status === 'new' && !knownIds.current.has(order.id))`. العائد/الأثر: undefined.؛ `fresh.filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `(order) => order.status === 'new' && !knownIds.current.has(order.id)`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.؛ `knownIds.current.has(...)`: تقرأ/تعدّل collection في الذاكرة حسب اسم method، مش قاعدة بيانات. القيم المكتوبة هنا: `order.id`. العائد/الأثر: Boolean.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 188:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods. الدوال الموجودة في السطر: `Set(...)`: تنشئ مجموعة قيم فريدة. القيم المكتوبة هنا: `fresh.map((order) => order.id)`. العائد/الأثر: Set instance، مش array.؛ `fresh.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(order) => order.id`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 189:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 190:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setOrders(...)`: لو setOrders هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `fresh`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 191:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `setTiming(...)`: لو setTiming هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `response.timing || { green_minutes: 3, orange_minutes: 6 }`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 192:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setLastUpdated(...)`: لو setLastUpdated هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `new Date()`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `Date(...)`: مع new تنشئ قيمة تاريخ/وقت؛ بدون arguments الوقت الحالي. مدخلاتها: قيمة تاريخ اختيارية. العائد/الأثر: Date object عند new؛ مش string تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 193–200

```jsx
            setLoadError('');
        } catch (error) {
            setLoadError(error.message || 'Orders could not be refreshed.');
        } finally {
            loadingRef.current = false;
        }
    }, [user, isAdmin, branch, date, notify]);

```

**السطر 193:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setLoadError(...)`: لو setLoadError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `''`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 194:** Catch: استقبل الخطأ من try/Promise حسب السياق وتعامل مع رسالته؛ catch لا تعني نجاح الطلب الأصلي.

**السطر 195:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setLoadError(...)`: لو setLoadError هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `error.message || 'Orders could not be refreshed.'`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 196:** Finally: تنظيف/إرجاع حالة الانشغال بعد try سواء نجحت أو فشلت.

**السطر 197:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 198:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 199:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 201–208

```jsx
    useEffect(() => {
        knownIds.current = new Set();
        loadedOnce.current = false;
    }, [branch, date]);

    useEffect(() => {
        loadOrders();
        const refreshTimer = window.setInterval(loadOrders, 7000);
```

**السطر 201:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `() => {         knownIds.current = new Set();         loadedOnce.current = false;     }`، `[branch, date]`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 202:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods. الدوال الموجودة في السطر: `Set(...)`: تنشئ مجموعة قيم فريدة. مدخلاتها: iterable اختيارية. العائد/الأثر: Set instance، مش array.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 203:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 204:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 206:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `() => {         loadOrders();         const refreshTimer = window.setInterval(loadOrders, 7000);         retur…`، `[loadOrders]`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 207:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `loadOrders(...)`: يتأكد من role وعدم وجود طلب جاري، يبني query date/branch، يجلب الطلبات، يكتشف IDs الجديدة ثم يحدّث board/timing/lastUpdated. finally يفك loadingRef. مدخلاتها: لا parameters؛ يقرأ user/isAdmin/branch/date/notify من closure. العائد/الأثر: Promise<void>.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 208:** Variable declaration / تعريف `refreshTimer` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `window.setInterval(...)`: تسجّل نداءً متكررًا لدالة؛ أول مرة بعد الفاصل، مش فورًا. القيم المكتوبة هنا: `loadOrders`، `7000`. العائد/الأثر: رقم timer ID في المتصفح؛ التوقيت تقريبي.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 209–216

```jsx
        return () => window.clearInterval(refreshTimer);
    }, [loadOrders]);

    useEffect(() => {
        const clock = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(clock);
    }, []);

```

**السطر 209:** Return / رجّع `() => window.clearInterval(refreshTimer)` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `window.clearInterval(...)`: تلغي النداءات القادمة لمؤقت تكرار محدد. القيم المكتوبة هنا: `refreshTimer`. العائد/الأثر: undefined؛ لا تلغي fetch بدأت بالفعل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 210:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 212:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `() => {         const clock = window.setInterval(() => setNow(Date.now()), 1000);         return () => window.…`، `[]`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 213:** Variable declaration / تعريف `clock` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `window.setInterval(...)`: تسجّل نداءً متكررًا لدالة؛ أول مرة بعد الفاصل، مش فورًا. القيم المكتوبة هنا: `() => setNow(Date.now())`، `1000`. العائد/الأثر: رقم timer ID في المتصفح؛ التوقيت تقريبي.؛ `setNow(...)`: لو setNow هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `Date.now()`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `Date.now(...)`: تقرأ وقت النظام الحالي كـtimestamp. مدخلاتها: بدون مدخلات. العائد/الأثر: milliseconds منذ Unix epoch، مش Date object.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 214:** Return / رجّع `() => window.clearInterval(clock)` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `window.clearInterval(...)`: تلغي النداءات القادمة لمؤقت تكرار محدد. القيم المكتوبة هنا: `clock`. العائد/الأثر: undefined؛ لا تلغي fetch بدأت بالفعل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 215:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 217–224

```jsx
    useEffect(() => {
        const clearPrint = () => setPrintingOrderId(null);
        window.addEventListener('afterprint', clearPrint);
        return () => window.removeEventListener('afterprint', clearPrint);
    }, []);

    const toggleSound = async () => {
        const nextMuted = !muted;
```

**السطر 217:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `() => {         const clearPrint = () => setPrintingOrderId(null);         window.addEventListener('afterprint…`، `[]`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 218:** Variable declaration / تعريف `clearPrint` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `clearPrint` هنا: Callback لحدث afterprint؛ يمسح printingOrderId بعد انتهاء نافذة الطباعة. المدخلات: event غير مستخدم.. الناتج/الأثر: undefined.. الدوال الموجودة في السطر: `setPrintingOrderId(...)`: لو setPrintingOrderId هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `null`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 219:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `window.addEventListener(...)`: تسجّل listener؛ مصدر الحدث يناديها ويمرر Event. القيم المكتوبة هنا: `'afterprint'`، `clearPrint`. العائد/الأثر: undefined؛ لا تشغّل handler لحظة التسجيل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 220:** Return / رجّع `() => window.removeEventListener('afterprint', clearPrint)` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `window.removeEventListener(...)`: تلغي listener بنفس الاسم ومرجع الدالة وcapture المناسب. القيم المكتوبة هنا: `'afterprint'`، `clearPrint`. العائد/الأثر: undefined؛ لا توقف الحدث نفسه.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 221:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 223:** Variable declaration / تعريف `toggleSound` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `toggleSound` هنا: يعكس muted، ينشئ AudioContext ويعمل resume بإجراء مستخدم عند التفعيل ثم يحفظ التفضيل. المدخلات: لا شيء.. الناتج/الأثر: Promise<void>..

**السطر 224:** Variable declaration / تعريف `nextMuted` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

### السطور 225–232

```jsx
        if (!nextMuted) {
            if (!audioContext.current) audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
            await audioContext.current.resume();
        }
        setMuted(nextMuted);
        localStorage.setItem('wtc-staff-muted', nextMuted ? '1' : '0');
    };

```

**السطر 225:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 226:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 227:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `audioContext.current.resume(...)`: تستأنف تشغيل السياق المعلّق. مدخلاتها: بدون arguments. العائد/الأثر: Promise لاكتمال الاستئناف.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 228:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 229:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setMuted(...)`: لو setMuted هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `nextMuted`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 230:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `localStorage.setItem(...)`: تحفظ قيمة نصية تحت مفتاح وتستبدل القديمة. القيم المكتوبة هنا: `'wtc-staff-muted'`، `nextMuted ? '1' : '0'`. العائد/الأثر: undefined؛ قد تفشل لو التخزين غير متاح.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 231:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 233–240

```jsx
    const updateStatus = async (order, status, reason = null) => {
        setBusyOrders((current) => [...current, order.id]);
        try {
            const response = await csrfFetch(`/api/staff/orders/${order.id}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status, reason, expected_status: order.status }),
            });
            setOrders((current) => current.map((item) => item.id === order.id ? response.order : item));
```

**السطر 233:** Variable declaration / تعريف `updateStatus` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `updateStatus` هنا: PATCH للحالة مع expected_status لمنع تعديل مبني على حالة قديمة؛ يستبدل الطلب الراجع في state. conflict يعيد تحميل اللوحة؛ finally يمسح busy ID. المدخلات: order, status, reason=null.. الناتج/الأثر: Promise<void>..

**السطر 234:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setBusyOrders(...)`: لو setBusyOrders هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `(current) => [...current, order.id]`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 235:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة.

**السطر 236:** Variable declaration / تعريف `response` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `csrfFetch(...)`: توحّد إرسال JSON أو FormData وقراءة الاستجابة وتجديد CSRF token إن السيرفر أرسله. اسمها مخصص للمشروع، مش method أصلية في المتصفح. القيم المكتوبة هنا: `'/api/staff/orders/${order.id}/status'`، `{                 method: 'PATCH',                 body: JSON.stringify({ status, reason, expected_status: ord…`. العائد/الأثر: Promise تنتهي بالـ payload المفكوك أو null لو الاستجابة مش JSON؛ ترفض بـ Error يحمل payload لو HTTP response غير ناجح.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 237:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 238:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `JSON.stringify(...)`: يحوّل بيانات قابلة للتمثيل إلى JSON text قبل التخزين؛ لا يخزن functions. القيم المكتوبة هنا: `{ status, reason, expected_status: order.status }`. العائد/الأثر: string أو undefined لبعض القيم. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 239:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 240:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة. الدوال الموجودة في السطر: `setOrders(...)`: لو setOrders هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `(current) => current.map((item) => item.id === order.id ? response.order : item)`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `current.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(item) => item.id === order.id ? response.order : item`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 241–248

```jsx
            setMessage(response.message);
            setReasonAction(null);
        } catch (error) {
            if (error.payload?.errors?.expected_status) {
                setMessage('Another staff member already moved this order. The board has been refreshed.');
                await loadOrders();
            } else {
                setMessage(error.payload?.errors ? Object.values(error.payload.errors).flat()[0] : error.message);
```

**السطر 241:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setMessage(...)`: لو setMessage هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `response.message`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 242:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setReasonAction(...)`: لو setReasonAction هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `null`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 243:** Catch: استقبل الخطأ من try/Promise حسب السياق وتعامل مع رسالته؛ catch لا تعني نجاح الطلب الأصلي.

**السطر 244:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 245:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setMessage(...)`: لو setMessage هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `'Another staff member already moved this order. The board has been refreshed.'`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 246:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `loadOrders(...)`: يتأكد من role وعدم وجود طلب جاري، يبني query date/branch، يجلب الطلبات، يكتشف IDs الجديدة ثم يحدّث board/timing/lastUpdated. finally يفك loadingRef. مدخلاتها: لا parameters؛ يقرأ user/isAdmin/branch/date/notify من closure. العائد/الأثر: Promise<void>.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 247:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 248:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setMessage(...)`: لو setMessage هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `error.payload?.errors ? Object.values(error.payload.errors).flat()[0] : error.message`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `Object.values(error.payload.errors).flat(...)`: تفرد مستويات arrays حسب العمق. مدخلاتها: depth اختياري افتراضيه1. العائد/الأثر: array جديدة.؛ `Object.values(...)`: يرجع قيم خصائص object بدون مفاتيح؛ مستخدم لاستخراج validation messages. القيم المكتوبة هنا: `error.payload.errors`. العائد/الأثر: array قيم.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 249–256

```jsx
            }
        } finally {
            setBusyOrders((current) => current.filter((id) => id !== order.id));
        }
    };

    const printTicket = (orderId) => {
        setPrintingOrderId(orderId);
```

**السطر 249:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 250:** Finally: تنظيف/إرجاع حالة الانشغال بعد try سواء نجحت أو فشلت.

**السطر 251:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setBusyOrders(...)`: لو setBusyOrders هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `(current) => current.filter((id) => id !== order.id)`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `current.filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `(id) => id !== order.id`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 252:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 253:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 255:** Variable declaration / تعريف `printTicket` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `printTicket` هنا: يحدد ID الطلب المراد طباعته، ينتظر 80ms لإتاحة render ثم يفتح window.print؛ afterprint يمسح الاختيار. المدخلات: orderId.. الناتج/الأثر: undefined..

**السطر 256:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setPrintingOrderId(...)`: لو setPrintingOrderId هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `orderId`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 257–264

```jsx
        window.setTimeout(() => window.print(), 80);
    };

    const activeOrders = useMemo(() => orders.filter((order) => !['completed', ...CLOSED_STATUSES].includes(order.status)), [orders]);
    const completedOrders = useMemo(() => orders.filter((order) => order.status === 'completed'), [orders]);
    const closedOrders = useMemo(() => orders.filter((order) => CLOSED_STATUSES.includes(order.status)), [orders]);
    const columnOrders = (column) => activeOrders.filter((order) => column.statuses.includes(order.status));
    const displayedHistory = historyTab === 'completed' ? completedOrders : closedOrders;
```

**السطر 257:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `window.setTimeout(...)`: ترتّب نداء callback مرة واحدة بعد التأخير. القيم المكتوبة هنا: `() => window.print()`، `80`. العائد/الأثر: timer ID في المتصفح.؛ `window.print(...)`: تفتح تدفق الطباعة. مدخلاتها: بدون مدخلات. العائد/الأثر: undefined؛ لا تنشئ طلب مطعم.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 258:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 260:** Variable declaration / تعريف `activeOrders` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useMemo(...)`: يحفظ نتيجة حساب كتحسين أداء لحد تغير dependencies؛ callback للحساب مش مكان HTTP أو setState side effects. القيم المكتوبة هنا: `() => orders.filter((order) => !['completed', ...CLOSED_STATUSES].includes(order.status))`، `[orders]`. العائد/الأثر: القيمة المحسوبة.؛ `orders.filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `(order) => !['completed', ...CLOSED_STATUSES].includes(order.status)`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.؛ `['completed', ...CLOSED_STATUSES].includes(...)`: تختبر وجود قيمة في array أو نص داخل string. القيم المكتوبة هنا: `order.status`. العائد/الأثر: Boolean؛ مش العنصر ولا موقعه.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 261:** Variable declaration / تعريف `completedOrders` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useMemo(...)`: يحفظ نتيجة حساب كتحسين أداء لحد تغير dependencies؛ callback للحساب مش مكان HTTP أو setState side effects. القيم المكتوبة هنا: `() => orders.filter((order) => order.status === 'completed')`، `[orders]`. العائد/الأثر: القيمة المحسوبة.؛ `orders.filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `(order) => order.status === 'completed'`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 262:** Variable declaration / تعريف `closedOrders` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useMemo(...)`: يحفظ نتيجة حساب كتحسين أداء لحد تغير dependencies؛ callback للحساب مش مكان HTTP أو setState side effects. القيم المكتوبة هنا: `() => orders.filter((order) => CLOSED_STATUSES.includes(order.status))`، `[orders]`. العائد/الأثر: القيمة المحسوبة.؛ `orders.filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `(order) => CLOSED_STATUSES.includes(order.status)`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.؛ `CLOSED_STATUSES.includes(...)`: تختبر وجود قيمة في array أو نص داخل string. القيم المكتوبة هنا: `order.status`. العائد/الأثر: Boolean؛ مش العنصر ولا موقعه.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 263:** Variable declaration / تعريف `columnOrders` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `columnOrders` هنا: يفلتر الطلبات النشطة لحالات العمود المطلوب. المدخلات: column object وله statuses array.. الناتج/الأثر: array طلبات.. الدوال الموجودة في السطر: `activeOrders.filter(...)`: تختار كل العناصر التي شرطها truthy. القيم المكتوبة هنا: `(order) => column.statuses.includes(order.status)`. العائد/الأثر: array جديدة؛ لا تحذف الأصل بنفسها.؛ `column.statuses.includes(...)`: تختبر وجود قيمة في array أو نص داخل string. القيم المكتوبة هنا: `order.status`. العائد/الأثر: Boolean؛ مش العنصر ولا موقعه.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 264:** Variable declaration / تعريف `displayedHistory` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

### السطور 265–272

```jsx

    const swipeColumns = (direction) => {
        const index = ACTIVE_COLUMNS.findIndex((column) => column.key === mobileColumn);
        const next = Math.min(ACTIVE_COLUMNS.length - 1, Math.max(0, index + direction));
        setMobileColumn(ACTIVE_COLUMNS[next].key);
    };

    if (isCheckingAuth) return <main className="wtc-staff-page"><div className="container">Loading dashboard...</div></main>;
```

**السطر 266:** Variable declaration / تعريف `swipeColumns` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `swipeColumns` هنا: يحرك تبويب الموبايل بواحد يمين/شمال مع حصر index بين أول وآخر عمود. المدخلات: direction: 1 أو -1.. الناتج/الأثر: undefined..

**السطر 267:** Variable declaration / تعريف `index` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ACTIVE_COLUMNS.findIndex(...)`: تبحث عن موضع أول عنصر مطابق. القيم المكتوبة هنا: `(column) => column.key === mobileColumn`. العائد/الأثر: index أو -1 لو مفيش تطابق.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 268:** Variable declaration / تعريف `next` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Math.min(...)`: ترجع أصغر المدخلات. القيم المكتوبة هنا: `ACTIVE_COLUMNS.length - 1`، `Math.max(0, index + direction)`. العائد/الأثر: number.؛ `Math.max(...)`: ترجع أكبر المدخلات. القيم المكتوبة هنا: `0`، `index + direction`. العائد/الأثر: number.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 269:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setMobileColumn(...)`: لو setMobileColumn هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `ACTIVE_COLUMNS[next].key`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 270:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 272:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

### السطور 273–280

```jsx
    if (!user) return <main className="wtc-staff-page"><div className="container text-center"><h1>Staff sign in</h1><p>Please sign in with a staff account.</p><Link to="/login" className="btn btn-red">Sign in</Link></div></main>;
    if (!['staff', 'admin'].includes(user.role)) return <main className="wtc-staff-page"><div className="container text-center"><h1>Access restricted</h1><p>This dashboard is available to staff only.</p></div></main>;

    return (
        <main className="wtc-staff-page">
            <style>{`
                .wtc-branch-lock{color:#a9a9a9;font-size:.86rem}.wtc-branch-lock strong{color:#fff}
                .wtc-staff-page{min-height:100vh;padding:7rem 0 3rem;background:#101010;color:#f5f5f5}.wtc-staff-head{display:flex;justify-content:space-between;align-items:end;gap:1.25rem}.wtc-staff-head h1{font-size:clamp(2rem,4vw,3.7rem);letter-spacing:0}.wtc-staff-controls{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:.55rem}.wtc-staff-field,.wtc-sound-toggle{min-height:42px;padding:.6rem .75rem;border:1px solid #3a3a3a;border-radius:6px;background:#181818;color:#fff}.wtc-sound-toggle{display:flex;align-items:center;gap:.45rem;font-weight:800}.wtc-sound-toggle.is-on{border-color:#4cbf70;color:#8de7a9}.wtc-updated{display:flex;align-items:center;gap:.45rem;color:#8d8d8d;font-size:.78rem}.wtc-updated::before{content:'';width:7px;height:7px;border-radius:50%;background:#4cbf70}.wtc-dashboard-switch{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin:1.4rem 0}.wtc-segmented,.wtc-history-tabs{display:inline-flex;padding:4px;border:1px solid #303030;border-radius:7px;background:#181818}.wtc-segmented button,.wtc-history-tabs button{border:0;border-radius:4px;padding:.65rem .9rem;background:transparent;color:#999;font-weight:850}.wtc-segmented button.active,.wtc-history-tabs button.active{background:#e32626;color:#fff}.wtc-mobile-tabs{display:none;gap:.45rem;overflow-x:auto;padding:0 0 .8rem;scrollbar-width:none}.wtc-mobile-tabs button{flex:0 0 auto;border:1px solid #343434;border-radius:999px;padding:.55rem .8rem;background:#181818;color:#aaa;font-weight:850}.wtc-mobile-tabs button.active{border-color:#e32626;background:#e32626;color:#fff}.wtc-kitchen-board{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.75rem;align-items:start}.wtc-board-column{min-width:0;border-top:3px solid #353535;background:#151515}.wtc-board-column:nth-child(1){border-color:#e32626}.wtc-board-column:nth-child(2){border-color:#f1a83a}.wtc-board-column:nth-child(3){border-color:#56b7e8}.wtc-board-column:nth-child(4){border-color:#56bd79}.wtc-column-head{position:sticky;top:92px;z-index:4;display:flex;align-items:center;justify-content:space-between;padding:.8rem;background:rgba(21,21,21,.96);backdrop-filter:blur(10px)}.wtc-column-head h2{margin:0;font-size:.95rem;font-weight:950;text-transform:uppercase}.wtc-column-head span{display:grid;place-items:center;min-width:25px;height:25px;border-radius:50%;background:#292929;font-size:.75rem;font-weight:900}.wtc-column-cards{display:grid;gap:.7rem;padding:.7rem}.wtc-column-empty{padding:2.4rem .8rem;color:#747474;text-align:center;font-size:.85rem}.wtc-kitchen-card{position:relative;border:1px solid #303030;border-radius:7px;padding:.9rem;background:#1b1b1b;box-shadow:0 12px 30px rgba(0,0,0,.18)}.wtc-kitchen-card.is-new{border-color:#e32626;animation:wtc-new-flash .7s ease-out 3}.wtc-card-top,.wtc-card-summary,.wtc-card-tools{display:flex;align-items:center;justify-content:space-between;gap:.55rem}.wtc-order-number{font-size:1.05rem;font-weight:1000}.wtc-order-type{display:block;color:#888;font-size:.68rem;font-weight:800;text-transform:uppercase}.wtc-step-timer{text-align:right}.wtc-step-timer span{display:block;color:#7d7d7d;font-size:.62rem;text-transform:uppercase}.wtc-step-timer strong{font-size:1rem;font-variant-numeric:tabular-nums}.wtc-step-timer.is-green strong{color:#63d184}.wtc-step-timer.is-orange strong{color:#f1a83a}.wtc-step-timer.is-red strong{color:#ff5a5a}.wtc-kitchen-card h3{margin:.85rem 0 .1rem;font-size:1.05rem;font-weight:950}.wtc-phone{color:#cfcfcf;font-size:.8rem}.wtc-fulfillment-callout{margin:.75rem 0;padding:.75rem;border-left:3px solid #e32626;background:#121212}.wtc-fulfillment-callout span{display:block;color:#999;font-size:.65rem;font-weight:900;text-transform:uppercase}.wtc-fulfillment-callout strong{display:block;margin-top:.2rem;font-size:1rem;line-height:1.3}.wtc-kitchen-item{padding:.62rem 0;border-bottom:1px solid #303030;font-size:.86rem}.wtc-kitchen-item>strong span{color:#f1a83a}.wtc-kitchen-note{margin-top:.45rem;padding:.5rem;border:1px solid rgba(241,168,58,.35);border-radius:4px;background:rgba(241,168,58,.1);color:#ffd089;font-weight:850;line-height:1.3}.wtc-kitchen-note span{display:block;margin-bottom:.2rem;color:#f1a83a;font-size:.6rem}.wtc-card-summary{align-items:end;margin-top:.75rem;color:#8e8e8e;font-size:.68rem}.wtc-card-summary strong{color:#fff;font-size:.8rem}.wtc-primary-action{width:100%;min-height:48px;margin-top:.85rem;border:0;border-radius:5px;background:#e32626;color:#fff;font-weight:950}.wtc-primary-action:hover{background:#ff3232}.wtc-primary-action:disabled{opacity:.55}.wtc-card-tools{margin-top:.6rem}.wtc-card-tools button{border:0;background:none;color:#aaa;font-size:.72rem;text-decoration:underline}.wtc-card-tools .danger{color:#ff7373}.wtc-history-panel{margin-top:.75rem}.wtc-history-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.8rem;margin-top:1rem}.wtc-staff-banner{position:fixed;top:96px;right:20px;z-index:1600;max-width:min(420px,calc(100vw - 2rem));padding:.85rem 1rem;border-radius:6px;background:#e32626;color:#fff;font-weight:850;box-shadow:0 16px 40px rgba(0,0,0,.35)}.wtc-load-error{padding:.75rem;border:1px solid rgba(255,90,90,.35);border-radius:6px;background:rgba(227,38,38,.08);color:#ff9a9a}.wtc-reason-modal{border:1px solid #393939;border-radius:8px;background:#191919;color:#f5f5f5}.wtc-reason-modal .modal-header,.wtc-reason-modal .modal-footer{border-color:#333}.wtc-reason-grid{display:flex;flex-wrap:wrap;gap:.45rem}.wtc-reason-grid button{border:1px solid #3d3d3d;border-radius:999px;padding:.5rem .7rem;background:#222;color:#ddd}.wtc-reason-grid button.active{border-color:#e32626;background:#e32626;color:#fff}.wtc-reason-input{width:100%;border:1px solid #414141;border-radius:6px;padding:.75rem;background:#101010;color:#fff}.wtc-ticket-only{display:none}@keyframes wtc-new-flash{0%,100%{box-shadow:0 0 0 0 rgba(227,38,38,0)}45%{box-shadow:0 0 0 4px rgba(227,38,38,.35)}}@media(prefers-reduced-motion:reduce){.wtc-kitchen-card.is-new{animation:none}}@media(max-width:1199px) and (min-width:768px){.wtc-kitchen-board{grid-template-columns:repeat(4,minmax(250px,1fr));overflow-x:auto;padding-bottom:.7rem}.wtc-board-column{min-width:250px}.wtc-history-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:767px){.wtc-staff-page{padding-top:6rem}.wtc-staff-head{align-items:start;flex-direction:column}.wtc-staff-controls{width:100%;justify-content:stretch}.wtc-staff-controls label{flex:1 1 calc(50% - .3rem)}.wtc-staff-field{width:100%}.wtc-sound-toggle{flex:1 1 100%;justify-content:center}.wtc-dashboard-switch{align-items:flex-start;flex-direction:column}.wtc-mobile-tabs{display:flex}.wtc-kitchen-board{display:block}.wtc-board-column{display:none}.wtc-board-column.is-mobile-active{display:block}.wtc-column-head{top:78px}.wtc-history-grid{grid-template-columns:1fr}.wtc-staff-banner{left:1rem;right:1rem;top:86px}}@media print{body *{visibility:hidden!important}.site-navbar,.site-footer{display:none!important}.wtc-kitchen-card.is-printing,.wtc-kitchen-card.is-printing *{visibility:visible!important}.wtc-kitchen-card.is-printing{position:absolute;inset:0 auto auto 0;width:80mm;border:0;background:#fff!important;color:#000!important;box-shadow:none}.wtc-kitchen-card.is-printing .wtc-primary-action,.wtc-kitchen-card.is-printing .wtc-card-tools{display:none}.wtc-kitchen-card.is-printing .wtc-ticket-only{display:block;margin-bottom:10px}.wtc-kitchen-card.is-printing .wtc-fulfillment-callout,.wtc-kitchen-card.is-printing .wtc-kitchen-note{background:#fff!important;color:#000!important;border-color:#000}.wtc-kitchen-card.is-printing a,.wtc-kitchen-card.is-printing span,.wtc-kitchen-card.is-printing strong{color:#000!important}}
```

**السطر 273:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده.

**السطر 274:** Condition / شرط: اختار مسار التنفيذ حسب التعبير. ! نفي، && لازم الطرفان، || يكفي طرف؛ === مقارنة صارمة. شرط if مش listener بيتكرر وحده. الدوال الموجودة في السطر: `['staff', 'admin'].includes(...)`: تختبر وجود قيمة في array أو نص داخل string. القيم المكتوبة هنا: `user.role`. العائد/الأثر: Boolean؛ مش العنصر ولا موقعه.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 276:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 277:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 278:** بداية CSS / تنسيق؛ لو scoped فـVue تضيف عزلًا بالـattributes أثناء البناء.

**السطر 279:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 280:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 281–288

```jsx
            `}</style>
            <AnimatePresence>{message && <motion.button type="button" className="wtc-staff-banner" initial={reduceMotion ? false : { opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} onClick={() => setMessage('')} role="status">{message}</motion.button>}</AnimatePresence>
            <div className="container-fluid px-3 px-xl-4">
                <header className="wtc-staff-head">
                    <div>
                        <p className="eyebrow">Kitchen command</p>
                        <h1 className="fw-bold mb-0">Orders at a glance.</h1>
                        {!isAdmin && <p className="wtc-branch-lock mb-0 mt-2">Branch: <strong>{user.branch?.name || 'Not assigned'}</strong></p>}
```

**السطر 281:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 282:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `setMessage(...)`: لو setMessage هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `''`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 283:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 284:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 285:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 286:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 287:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 288:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 289–296

```jsx
                    </div>
                    <div className="wtc-staff-controls">
                        {isAdmin && <label><span className="visually-hidden">Branch</span><select className="wtc-staff-field" value={branch} disabled={branchesLoading} onChange={(event) => setBranch(event.target.value)}><option value="">All branches</option>{catalogBranches.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>}
                        <label><span className="visually-hidden">Order date</span><input className="wtc-staff-field" type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
                        <button type="button" className={`wtc-sound-toggle ${muted ? '' : 'is-on'}`} onClick={toggleSound} aria-pressed={!muted}><BellIcon />{muted ? 'Sound off' : 'Sound on'}</button>
                        <span className="wtc-updated">{lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : 'Connecting...'}</span>
                    </div>
                </header>
```

**السطر 289:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 290:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 291:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `setBranch(...)`: لو setBranch هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `event.target.value`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `catalogBranches.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(item) => <option key={item.id} value={item.id}>{item.name}</option>`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 292:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `setDate(...)`: تغيّر يوم الشهر في نفس Date، مع حساب عبور الشهور. القيم المكتوبة هنا: `event.target.value`. العائد/الأثر: timestamp بعد التعديل؛ تعدّل object نفسها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 293:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها.

**السطر 294:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض. الدوال الموجودة في السطر: `lastUpdated.toLocaleTimeString(...)`: تنسّق الوقت للعرض المحلي. القيم المكتوبة هنا: `[]`، `{ hour: '2-digit', minute: '2-digit', second: '2-digit' }`. العائد/الأثر: string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 295:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 296:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 297–304

```jsx
                <div className="wtc-dashboard-switch">
                    <div className="wtc-segmented" role="group" aria-label="Order view"><button type="button" className={view === 'active' ? 'active' : ''} onClick={() => setView('active')}>Active orders ({activeOrders.length})</button><button type="button" className={view === 'history' ? 'active' : ''} onClick={() => setView('history')}>Today&apos;s history ({completedOrders.length + closedOrders.length})</button></div>
                    {loadError && <div className="wtc-load-error" role="alert">{loadError} <button type="button" className="btn btn-sm btn-outline-light ms-2" onClick={loadOrders}>Retry</button></div>}
                </div>
                {view === 'active' ? <>
                    <div className="wtc-mobile-tabs" role="tablist" aria-label="Active order stages">{ACTIVE_COLUMNS.map((column) => <button key={column.key} type="button" role="tab" aria-selected={mobileColumn === column.key} className={mobileColumn === column.key ? 'active' : ''} onClick={() => setMobileColumn(column.key)}>{column.title} ({columnOrders(column).length})</button>)}</div>
                    <div className="wtc-kitchen-board" onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }} onTouchEnd={(event) => { if (touchStart.current === null) return; const distance = event.changedTouches[0].clientX - touchStart.current; if (Math.abs(distance) > 55) swipeColumns(distance < 0 ? 1 : -1); touchStart.current = null; }}>
                        {ACTIVE_COLUMNS.map((column) => { const cards = columnOrders(column); return <section key={column.key} className={`wtc-board-column ${mobileColumn === column.key ? 'is-mobile-active' : ''}`} aria-labelledby={`column-${column.key}`}><header className="wtc-column-head"><h2 id={`column-${column.key}`}>{column.title}</h2><span>{cards.length}</span></header><div className="wtc-column-cards">{cards.map((order) => <OrderCard key={order.id} order={order} now={now} timing={timing} busy={busyOrders.includes(order.id)} highlighted={highlighted.includes(order.id)} printing={printingOrderId === order.id} reduceMotion={reduceMotion} onAdvance={updateStatus} onReason={(selectedOrder, status) => setReasonAction({ order: selectedOrder, status })} onPrint={printTicket} />)}{!cards.length && <p className="wtc-column-empty">No orders here.</p>}</div></section>; })}
```

**السطر 297:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 298:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `setView(...)`: لو setView هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `'history'`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 299:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها.

**السطر 300:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 301:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 302:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `ACTIVE_COLUMNS.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(column) => <button key={column.key} type="button" role="tab" aria-selected={mobileColumn === column.key} clas…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `setMobileColumn(...)`: لو setMobileColumn هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `column.key`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `columnOrders(...)`: يفلتر الطلبات النشطة لحالات العمود المطلوب. القيم المكتوبة هنا: `column`. العائد/الأثر: array طلبات.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 303:** Variable declaration / تعريف `distance` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `Math.abs(...)`: ترجع القيمة المطلقة بدون إشارة. القيم المكتوبة هنا: `distance`. العائد/الأثر: number.؛ `swipeColumns(...)`: يحرك تبويب الموبايل بواحد يمين/شمال مع حصر index بين أول وآخر عمود. القيم المكتوبة هنا: `distance < 0 ? 1 : -1`. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 304:** Variable declaration / تعريف `cards` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `ACTIVE_COLUMNS.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(column) => { const cards = columnOrders(column); return <section key={column.key} className={'wtc-board-colum…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `columnOrders(...)`: يفلتر الطلبات النشطة لحالات العمود المطلوب. القيم المكتوبة هنا: `column`. العائد/الأثر: array طلبات.؛ `cards.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(order) => <OrderCard key={order.id} order={order} now={now} timing={timing} busy={busyOrders.includes(order.i…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `busyOrders.includes(...)`: تختبر وجود قيمة في array أو نص داخل string. القيم المكتوبة هنا: `order.id`. العائد/الأثر: Boolean؛ مش العنصر ولا موقعه.؛ `highlighted.includes(...)`: تختبر وجود قيمة في array أو نص داخل string. القيم المكتوبة هنا: `order.id`. العائد/الأثر: Boolean؛ مش العنصر ولا موقعه.؛ `setReasonAction(...)`: لو setReasonAction هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `{ order: selectedOrder, status }`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 305–312

```jsx
                    </div>
                </> : <section className="wtc-history-panel">
                    <div className="wtc-history-tabs" role="tablist" aria-label="Order history"><button type="button" role="tab" aria-selected={historyTab === 'completed'} className={historyTab === 'completed' ? 'active' : ''} onClick={() => setHistoryTab('completed')}>Completed ({completedOrders.length})</button><button type="button" role="tab" aria-selected={historyTab === 'closed'} className={historyTab === 'closed' ? 'active' : ''} onClick={() => setHistoryTab('closed')}>Closed ({closedOrders.length})</button></div>
                    <div className="wtc-history-grid">{displayedHistory.map((order) => <OrderCard key={order.id} order={order} now={now} timing={timing} busy={false} highlighted={false} printing={printingOrderId === order.id} reduceMotion={reduceMotion} onAdvance={updateStatus} onReason={(selectedOrder, status) => setReasonAction({ order: selectedOrder, status })} onPrint={printTicket} />)}</div>
                    {!displayedHistory.length && <p className="text-secondary py-5 text-center">No orders in this view.</p>}
                </section>}
            </div>
            <ReasonModal action={reasonAction} busy={reasonAction ? busyOrders.includes(reasonAction.order.id) : false} onClose={() => setReasonAction(null)} onConfirm={(reason) => updateStatus(reasonAction.order, reasonAction.status, reason)} />
```

**السطر 305:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 306:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 307:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `setHistoryTab(...)`: لو setHistoryTab هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `'closed'`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 308:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `displayedHistory.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(order) => <OrderCard key={order.id} order={order} now={now} timing={timing} busy={false} highlighted={false} …`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `setReasonAction(...)`: لو setReasonAction هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `{ order: selectedOrder, status }`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 309:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 310:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 311:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 312:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `busyOrders.includes(...)`: تختبر وجود قيمة في array أو نص داخل string. القيم المكتوبة هنا: `reasonAction.order.id`. العائد/الأثر: Boolean؛ مش العنصر ولا موقعه.؛ `setReasonAction(...)`: لو setReasonAction هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `null`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `updateStatus(...)`: PATCH للحالة مع expected_status لمنع تعديل مبني على حالة قديمة؛ يستبدل الطلب الراجع في state. conflict يعيد تحميل اللوحة؛ finally يمسح busy ID. القيم المكتوبة هنا: `reasonAction.order`، `reasonAction.status`، `reason`. العائد/الأثر: Promise<void>.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 313–316

```jsx
        </main>
    );
}

```

**السطر 313:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 314:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 315:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
