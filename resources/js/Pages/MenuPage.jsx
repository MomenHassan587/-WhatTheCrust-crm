import React, { useEffect, useMemo, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { branchOption, useCatalog } from '../context/CatalogContext';
import { useOrder } from '../context/OrderContext';

const CART_STORAGE_KEY = import.meta.env.VITE_DEMO_MODE === 'true' ? 'wtc_demo_cart' : 'wtc_cart';
const CART_EVENT_NAME = 'wtc-cart-updated';

function readCart() {
    try { return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]'); } catch { return []; }
}

function writeCart(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event(CART_EVENT_NAME));
}

function ProductImage({ item }) {
    const [failed, setFailed] = useState(false);
    if (!item.image_path || failed) {
        return <div className="menu-image-placeholder" role="img" aria-label={`${item.name} photo coming soon`}>WTC</div>;
    }
    return <img src={item.image_path} alt={item.name} loading="lazy" decoding="async" onError={() => setFailed(true)} />;
}

function CartToast({ message }) {
    return (
        <AnimatePresence>
            {message && (
                <motion.div className="wtc-menu-toast" initial={{ opacity: 0, y: 22, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 18 }} transition={{ duration: 0.25 }} role="status">
                    <span aria-hidden="true">+</span>{message}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default function MenuPage() {
    const { branches, categories, items, loading, error, reload } = useCatalog();
    const { mode, branchId: selectedBranchId, selectedBranch, availableBranches, setBranch } = useOrder();
    const [choosingBranch, setChoosingBranch] = useState(false);
    const [activeCategory, setActiveCategory] = useState('');
    const [toast, setToast] = useState('');

    useEffect(() => {
        if (!categories.length || activeCategory) return;
        setActiveCategory(categories[0].slug);
    }, [categories, activeCategory]);

    useEffect(() => {
        if (!toast) return undefined;
        const timeout = window.setTimeout(() => setToast(''), 2400);
        return () => window.clearTimeout(timeout);
    }, [toast]);

    const chooseBranch = (branch) => {
        if (!setBranch(branch.id)) return;
        setChoosingBranch(false);
        setActiveCategory(categories[0]?.slug || '');
    };

    const filteredItems = useMemo(() => items.filter((item) => {
        const option = branchOption(item, selectedBranchId);
        return item.category_slug === activeCategory && option?.is_available;
    }), [items, activeCategory, selectedBranchId]);

    const addToCart = (item) => {
        const option = branchOption(item, selectedBranchId);
        if (!selectedBranch || !option?.is_available) return;
        let currentCart = readCart();
        const differentBranch = currentCart.some((line) => Number(line.branch_id) !== selectedBranch.id);
        if (differentBranch) {
            if (!setBranch(selectedBranch.id)) return;
            currentCart = readCart();
        }
        const existing = currentCart.find((line) => line.id === item.id);
        const canonical = {
            id: item.id,
            name: item.name,
            description: item.description,
            price: Number(option.price),
            image_src: item.image_path,
            branch_id: selectedBranch.id,
            branch_name: selectedBranch.name,
        };
        const next = existing
            ? currentCart.map((line) => line.id === item.id ? { ...line, ...canonical, quantity: line.quantity + 1 } : line)
            : [...currentCart, { ...canonical, quantity: 1 }];
        writeCart(next);
        setToast(`${item.name} added to cart.`);
    };

    return (
        <main className="menu-page">
            <style>{`
                .wtc-menu-toast{position:fixed;right:1.4rem;bottom:1.4rem;z-index:3000;display:flex;align-items:center;gap:.7rem;max-width:min(430px,calc(100vw - 2rem));padding:.95rem 1.1rem;border:1px solid rgba(255,255,255,.1);border-radius:8px;background:rgba(26,26,26,.96);color:#f5f5f5;font-weight:900;box-shadow:0 24px 70px rgba(0,0,0,.35)}.wtc-menu-toast span{display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:#e32626}.wtc-catalog-state{min-height:320px;display:grid;place-items:center;text-align:center}.wtc-catalog-state>div{max-width:520px}.menu-image-placeholder{font-size:1.25rem;font-weight:1000;color:#f1a83a;letter-spacing:.12em;background:radial-gradient(circle at center,rgba(227,38,38,.18),transparent 60%)}.menu-product-card{height:100%;overflow:hidden;border:1px solid rgba(255,255,255,.08);border-radius:8px;background:#1a1a1a;color:#f5f5f5}.menu-product-card .card-body{display:flex;flex-direction:column}.menu-product-tag{color:#f1a83a;font-size:.7rem;font-weight:900;text-transform:uppercase}.menu-product-price{color:#ed3434;font-weight:950}.menu-product-footer{display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:1rem}.menu-product-footer button{width:38px;height:38px;border:0;border-radius:50%;background:#e32626;color:#fff;font-size:1.4rem}.branch-hours{display:block;color:#aaa}@media(max-width:575px){.wtc-menu-toast{left:1rem;right:1rem;bottom:1rem}}
            `}</style>
            <section className="section-padding menu-hero">
                <div className="container">
                    <header className="section-heading text-center">
                        <p className="eyebrow">Menu</p>
                        <h1 className="section-title">Choose your branch first.</h1>
                        <p className="section-copy mx-auto">Prices and availability come directly from each branch.</p>
                    </header>

                    {loading && <div className="wtc-catalog-state" role="status"><div><h2>Loading today&apos;s menu...</h2><p className="text-secondary">Checking branch prices and availability.</p></div></div>}
                    {!loading && error && <div className="wtc-catalog-state" role="alert"><div><h2>We could not load the menu.</h2><p className="text-secondary">{error}</p><button type="button" className="btn btn-red" onClick={reload}>Try Again</button></div></div>}
                    {!loading && !error && !branches.length && <div className="wtc-catalog-state"><div><h2>No branches are available.</h2><p className="text-secondary">Please check back shortly.</p></div></div>}

                    {!loading && !error && branches.length > 0 && (
                        <AnimatePresence mode="wait">
                            {choosingBranch || !selectedBranch ? (
                                <motion.div key="branches" className="branch-selection-panel" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -30 }}>
                                    <span className="step-pill">Step 1</span><h2>Select a branch</h2><p>{mode === 'delivery' ? 'Showing branches that currently deliver.' : 'Choose where you will collect your order.'}</p>
                                    <Row className="g-4 mt-2">{availableBranches.map((branch) => <Col key={branch.id} xs={12} md={4}><button type="button" className="branch-card" onClick={() => chooseBranch(branch)}><span>{branch.location}</span><strong>{branch.name}</strong><small>{mode === 'delivery' ? `Delivery EGP ${Number(branch.delivery_fee || 0).toFixed(2)}` : branch.opening_hours || 'Opening hours coming soon'}</small></button></Col>)}</Row>
                                </motion.div>
                            ) : (
                                <motion.div key="products" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                                    <div className="selected-branch-bar"><div><span className="step-pill">{mode === 'delivery' ? 'Delivery' : 'Pickup'} · Selected Branch</span><strong>{selectedBranch.name}</strong><small>{selectedBranch.location}</small></div><div className="selected-actions"><button type="button" className="btn btn-outline-glow" onClick={() => setChoosingBranch(true)}>Change Branch</button><Link to="/cart" className="btn btn-red">Go to Cart</Link></div></div>
                                    <div className="category-subnav"><span className="step-pill">Step 2</span><div className="category-scroll">{categories.map((category) => <button key={category.id} type="button" className={activeCategory === category.slug ? 'active' : ''} onClick={() => setActiveCategory(category.slug)}>{category.name}</button>)}</div></div>
                                    {!items.length ? <div className="empty-menu-state"><h2>The menu is empty.</h2><p>Seed the catalog to add products.</p></div> : !filteredItems.length ? <div className="empty-menu-state"><h2>Nothing available here right now.</h2><p>Try another category or branch.</p></div> : <Row className="g-4 menu-grid">{filteredItems.map((item, index) => { const option = branchOption(item, selectedBranch.id); return <Col key={item.id} xs={12} sm={6} lg={4} xl={3}><motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .3, delay: index * .06 }} className="h-100"><Card className="menu-product-card"><div className="menu-image"><ProductImage item={item} /></div><Card.Body><span className="menu-product-tag">{item.tag || item.category}</span><Card.Title className="mt-2 fw-bold">{item.name}</Card.Title><Card.Text className="text-secondary">{item.description}</Card.Text><div className="menu-product-footer"><strong className="menu-product-price">EGP {Number(option.price).toFixed(2)}</strong><button type="button" aria-label={`Add ${item.name} to cart`} onClick={() => addToCart(item)}>+</button></div></Card.Body></Card></motion.div></Col>; })}</Row>}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </section>
            <CartToast message={toast} />
        </main>
    );
}
