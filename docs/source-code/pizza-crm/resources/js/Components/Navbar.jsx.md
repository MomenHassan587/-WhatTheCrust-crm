# Navbar البيتزا: الحساب والتوصيل وعدّاد السلة

[فهرس كل الأكواد](../../../../../16-all-project-source.md)

المشروع: `pizza-crm` · الملف: `resources/js/Components/Navbar.jsx` · 709 سطر.

**وظيفة الملف:** شريط الموقع الحالي؛ يظهر حسب جاهزية فيديو Home، يدعم قائمة موبايل وModal عنوان التوصيل وأزرار الحساب حسب role. عدّاد السلة متزامن مع custom event ومع storage من التبويبات الأخرى.

**نوعه:** active. ده وصف للدور، مش ادعاء إن كل ملف مستورد في الصفحة الحالية.

**مصدر حرفي:** [افتح الملف الأصلي](../../../../../../resources/js/Components/Navbar.jsx). الكود الكامل تحت نسخة من محتواه، وشرح السطور منفصل عنه. المقتطفات لا تتنفّذ بتصفح المذكرة.

## الملفات المرتبطة — Connected files

- [pizza-crm/resources/js/context/AuthContext.jsx](../context/AuthContext.jsx.md)

- [pizza-crm/resources/js/context/OrderContext.jsx](../context/OrderContext.jsx.md)

- [pizza-crm/resources/js/Pages/MenuPage.jsx](../Pages/MenuPage.jsx.md)

- [pizza-crm/resources/js/Pages/Cart.jsx](../Pages/Cart.jsx.md)

- [pizza-crm/resources/js/app.jsx](../app.jsx.md)

## الكود الحقيقي كاملًا — Full original source

<details><summary>افتح الكود كاملًا؛ الشرح خطوة خطوة تحته</summary>

```jsx
// resources/js/Components/Navbar.jsx

import React, { useEffect, useState } from 'react';
import { Collapse, Container, Dropdown, Modal } from 'react-bootstrap';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';

const CART_STORAGE_KEY = import.meta.env.VITE_DEMO_MODE === 'true' ? 'wtc_demo_cart' : 'wtc_cart';
const CART_EVENT_NAME = 'wtc-cart-updated';

function getCartCount() {
    try {
        const savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');

        return savedCart.reduce((total, item) => total + Number(item.quantity || 0), 0);
    } catch {
        return 0;
    }
}

export default function Navbar({ isVisible = true, reduceMotion = false, animateReveal = false }) {
    const navigate = useNavigate();
    const location = useLocation();

    const [isOpen, setIsOpen] = useState(false);
    const [deliverySettingsOpen, setDeliverySettingsOpen] = useState(false);
    const { user: authUser, isCheckingAuth, logout: logoutUser } = useAuth();
    const {
        mode,
        branchId,
        availableBranches,
        selectedBranch,
        deliveryAddress,
        deliveryArea,
        setOrderMode,
        setBranch,
        setDeliveryAddress,
        setDeliveryArea,
    } = useOrder();
    const [cartCount, setCartCount] = useState(getCartCount);

    useEffect(() => {
        const syncCartCount = () => {
            setCartCount(getCartCount());
        };

        window.addEventListener('storage', syncCartCount);
        window.addEventListener(CART_EVENT_NAME, syncCartCount);

        return () => {
            window.removeEventListener('storage', syncCartCount);
            window.removeEventListener(CART_EVENT_NAME, syncCartCount);
        };
    }, []);

    const closeMobileMenu = () => {
        setIsOpen(false);
    };

    const logout = async () => {
        try {
            await logoutUser();
            closeMobileMenu();
            navigate('/');
        } catch {
            closeMobileMenu();
        }
    };

    const isHomeActive = location.pathname === '/' && !location.hash;
    const isMenuActive = location.pathname.startsWith('/menu');
    const isAboutActive = location.pathname === '/' && location.hash === '#about';
    const isContactActive = location.pathname === '/' && location.hash === '#contact';

    const navClass = (isActive) => (
        `wtc-navbar-link ${isActive ? 'wtc-navbar-link-active' : ''}`
    );

    const mobileNavClass = (isActive) => (
        `wtc-mobile-nav-link ${isActive ? 'wtc-mobile-nav-link-active' : ''}`
    );

    return (
        <>
            <style>
                {`
                    .wtc-navbar-link {
                        position: relative;
                        color: rgba(255,255,255,0.74);
                        font-size: 0.92rem;
                        font-weight: 900;
                        text-decoration: none;
                        white-space: nowrap;
                        transition: color 0.22s ease;
                        padding: 0.35rem 0;
                    }

                    .wtc-navbar-link::after {
                        content: "";
                        position: absolute;
                        left: 50%;
                        bottom: -0.34rem;
                        width: 0;
                        height: 2px;
                        border-radius: 999px;
                        background: #e32424;
                        transform: translateX(-50%);
                        transition: width 0.22s ease;
                    }

                    .wtc-navbar-link:hover {
                        color: #ffffff;
                    }

                    .wtc-navbar-link-active {
                        color: #e32424 !important;
                    }

                    .wtc-navbar-link-active::after {
                        width: 22px;
                    }

                    .wtc-logo-img {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                        display: block;
                        filter:
                            invert(1)
                            hue-rotate(180deg)
                            saturate(3.3)
                            brightness(1.34)
                            contrast(1.2)
                            drop-shadow(0 0 10px rgba(227, 36, 36, 0.92))
                            drop-shadow(0 0 30px rgba(227, 36, 36, 0.48));
                        mix-blend-mode: screen;
                    }

                    .wtc-mobile-menu {
                        width: 44px;
                        height: 44px;
                        display: none;
                        border: 1px solid rgba(255,255,255,0.18);
                        border-radius: 14px;
                        background: rgba(0,0,0,0.2);
                        transition: border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
                    }

                    .wtc-mobile-menu span {
                        display: block;
                        width: 19px;
                        height: 2px;
                        margin: 4px auto;
                        border-radius: 999px;
                        background: #ffffff;
                        transition: transform 0.24s ease, opacity 0.2s ease;
                    }

                    .wtc-mobile-menu.active {
                        border-color: rgba(227,38,38,0.62);
                        background: rgba(227,38,38,0.12);
                        box-shadow: 0 0 24px rgba(227,38,38,0.18);
                    }

                    .wtc-mobile-menu.active span:nth-child(1) {
                        transform: translateY(6px) rotate(45deg);
                    }

                    .wtc-mobile-menu.active span:nth-child(2) {
                        opacity: 0;
                    }

                    .wtc-mobile-menu.active span:nth-child(3) {
                        transform: translateY(-6px) rotate(-45deg);
                    }

                    .wtc-mobile-nav-panel {
                        display: none;
                    }

                    .wtc-mobile-nav-inner {
                        margin: 0 -0.75rem;
                        padding: 0.45rem 0.75rem 0.9rem;
                        background:
                            linear-gradient(180deg, rgba(10,10,10,0.92), rgba(10,10,10,0.68) 72%, rgba(10,10,10,0)),
                            radial-gradient(circle at 12% 0%, rgba(227,38,38,0.13), transparent 16rem);
                        backdrop-filter: blur(18px);
                        -webkit-backdrop-filter: blur(18px);
                        box-shadow:
                            inset 0 1px 0 rgba(255,255,255,0.08),
                            inset 0 -1px 0 rgba(255,255,255,0.035);
                    }

                    .wtc-mobile-nav-list {
                        display: grid;
                        gap: 0.2rem;
                        padding: 0.18rem 0;
                    }

                    .wtc-mobile-nav-link {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        min-height: 48px;
                        padding: 0.35rem 0.1rem;
                        color: rgba(255,255,255,0.72);
                        font-weight: 920;
                        text-decoration: none;
                        transition: color 0.2s ease, transform 0.2s ease;
                    }

                    .wtc-mobile-nav-link::after {
                        content: "";
                        width: 6px;
                        height: 6px;
                        border-radius: 999px;
                        background: transparent;
                        box-shadow: 0 0 0 rgba(227,38,38,0);
                        transition: background 0.2s ease, box-shadow 0.2s ease;
                    }

                    .wtc-mobile-nav-link:hover {
                        color: #ffffff;
                        transform: translateX(2px);
                    }

                    .wtc-mobile-nav-link-active {
                        color: #ff3b3b;
                    }

                    .wtc-mobile-nav-link-active::after {
                        background: #e32424;
                        box-shadow: 0 0 18px rgba(227,38,38,0.6);
                    }

                    .wtc-cart-link {
                        position: relative;
                        width: 44px;
                        height: 44px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 999px;
                        border: 1px solid rgba(255,255,255,0.2);
                        background: rgba(0,0,0,0.24);
                        color: #ffffff;
                        text-decoration: none;
                        transition: 0.22s ease;
                    }

                    .wtc-cart-link:hover {
                        color: #ffffff;
                        border-color: rgba(227,38,38,0.7);
                        box-shadow: 0 0 22px rgba(227,38,38,0.28);
                        transform: translateY(-1px);
                    }

                    .wtc-cart-badge {
                        position: absolute;
                        top: -4px;
                        right: -4px;
                        min-width: 20px;
                        height: 20px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        padding: 0 6px;
                        border-radius: 999px;
                        background: #e32424;
                        color: #ffffff;
                        font-size: 0.68rem;
                        font-weight: 950;
                        box-shadow: 0 0 0 3px rgba(18,18,18,0.9);
                    }

                    .wtc-account-menu {
                        min-width: 220px;
                        background: #171717 !important;
                        border: 1px solid rgba(255,255,255,0.14) !important;
                        border-radius: 8px !important;
                        padding: 0.42rem !important;
                        box-shadow: 0 18px 48px rgba(0,0,0,0.48);
                    }

                    .wtc-account-item {
                        display: flex !important;
                        align-items: center;
                        min-height: 42px;
                        border-radius: 5px !important;
                        background: transparent !important;
                        color: #f5f5f5 !important;
                        font-weight: 850 !important;
                        transition: background 0.16s ease, color 0.16s ease;
                    }

                    .wtc-account-item:hover,
                    .wtc-account-item:focus,
                    .wtc-account-item:active,
                    .wtc-account-item.active {
                        background: rgba(227,36,36,0.16) !important;
                        color: #ff5757 !important;
                    }

                    .wtc-account-item:focus-visible {
                        outline: 3px solid rgba(255,87,87,0.52);
                        outline-offset: -2px;
                        box-shadow: none !important;
                    }

                    .wtc-account-item:disabled,
                    .wtc-account-item.disabled {
                        background: transparent !important;
                        color: #777 !important;
                        cursor: not-allowed;
                        opacity: 1;
                    }

                    .wtc-account-item.is-logout {
                        color: #ff8a8a !important;
                    }

                    .wtc-mobile-order-mode {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 0.45rem;
                        padding: 0.55rem 0 0.75rem;
                    }

                    .wtc-mobile-order-mode button {
                        min-height: 42px;
                        border: 1px solid #3b3b3b;
                        border-radius: 5px;
                        background: #171717;
                        color: #ddd;
                        font-weight: 850;
                    }

                    .wtc-mobile-order-mode button.active {
                        border-color: #e32424;
                        background: #e32424;
                        color: #fff;
                    }

                    @media (max-width: 1199px) {
                        .wtc-mobile-menu {
                            display: block;
                        }

                        .wtc-desktop-nav {
                            display: none !important;
                        }

                        .wtc-mobile-nav-panel {
                            display: block;
                        }
                    }

                    @media (max-width: 991px) {
                        .wtc-order-toggle {
                            display: none !important;
                        }
                    }

                    @media (max-width: 767px) {
                        .wtc-navbar-shell {
                            min-height: 72px !important;
                        }

                        .wtc-logo-link {
                            width: 118px !important;
                            height: 52px !important;
                        }

                        .wtc-auth-name {
                            max-width: 116px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }

                        .wtc-mobile-nav-link {
                            min-height: 46px;
                            font-size: 0.96rem;
                        }
                    }

                    @media (max-width: 520px) {
                        .wtc-auth-wrap {
                            display: none !important;
                        }

                        .wtc-cart-link {
                            width: 40px;
                            height: 40px;
                        }
                    }
                `}
            </style>

            <AnimatePresence>
            {isVisible && <motion.header
                className="site-header"
                initial={!animateReveal || reduceMotion ? false : { opacity: 0, y: -24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: reduceMotion ? 0 : 0.36, ease: 'easeOut' }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    background: 'rgba(10,10,10,0.38)',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                }}
            >
                <Container fluid="xl">
                    <nav
                        className="wtc-navbar-shell d-flex align-items-center justify-content-between gap-3"
                        aria-label="Primary navigation"
                        style={{ minHeight: '84px' }}
                    >
                        <div className="d-flex align-items-center justify-content-start flex-fill">
                            <button
                                type="button"
                                className={`wtc-mobile-menu ${isOpen ? 'active' : ''}`}
                                aria-label="Toggle navigation"
                                aria-expanded={isOpen}
                                aria-controls="wtc-mobile-nav"
                                onClick={() => setIsOpen((current) => !current)}
                            >
                                <span />
                                <span />
                                <span />
                            </button>

                            <div className="wtc-desktop-nav d-flex align-items-center gap-4">
                                <Link className={navClass(isHomeActive)} to="/" onClick={closeMobileMenu}>
                                    Home
                                </Link>

                                <Link className={navClass(isMenuActive)} to="/menu" onClick={closeMobileMenu}>
                                    Menu
                                </Link>

                                <Link className={navClass(isAboutActive)} to="/#about" onClick={closeMobileMenu}>
                                    About Us
                                </Link>

                                <Link className={navClass(isContactActive)} to="/#contact" onClick={closeMobileMenu}>
                                    Contact
                                </Link>
                            </div>
                        </div>

                        <Link
                            to="/"
                            aria-label="What The Crust homepage"
                            onClick={closeMobileMenu}
                            className="wtc-logo-link d-flex align-items-center justify-content-center flex-shrink-0"
                            style={{
                                width: 'clamp(138px, 12vw, 178px)',
                                height: '62px',
                                background: 'transparent',
                                border: 0,
                                overflow: 'visible',
                            }}
                        >
                            <img
                                src="/images/logo.png"
                                alt="What The Crust"
                                className="wtc-logo-img"
                            />
                        </Link>

                        <div className="d-flex align-items-center justify-content-end flex-fill gap-3">
                            <div
                                className="wtc-order-toggle d-inline-flex align-items-center"
                                role="group"
                                aria-label="Order mode"
                                style={{
                                    padding: '0.28rem',
                                    borderRadius: '999px',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    background: 'rgba(0,0,0,0.22)',
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOrderMode('delivery');
                                        setDeliverySettingsOpen(true);
                                    }}
                                    aria-pressed={mode === 'delivery'}
                                    style={{
                                        border: 0,
                                        borderRadius: '999px',
                                        padding: '0.66rem 0.92rem',
                                        background: mode === 'delivery' ? '#e32424' : 'transparent',
                                        color: '#fff',
                                        fontSize: '0.75rem',
                                        fontWeight: 900,
                                    }}
                                >
                                    Delivery
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setOrderMode('pickup')}
                                    aria-pressed={mode === 'pickup'}
                                    style={{
                                        border: 0,
                                        borderRadius: '999px',
                                        padding: '0.66rem 0.92rem',
                                        background: mode === 'pickup' ? '#e32424' : 'transparent',
                                        color: '#fff',
                                        fontSize: '0.75rem',
                                        fontWeight: 900,
                                    }}
                                >
                                    Pickup
                                </button>
                            </div>

                            <Link
                                to="/cart"
                                className="wtc-cart-link"
                                aria-label="View cart"
                                onClick={closeMobileMenu}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                    <path
                                        d="M6.5 8.5H17.5L18.6 20H5.4L6.5 8.5Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M9 8.5V6.8C9 4.9 10.35 3.5 12 3.5C13.65 3.5 15 4.9 15 6.8V8.5"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>

                                {cartCount > 0 && (
                                    <span className="wtc-cart-badge">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </Link>

                            <div className="wtc-auth-wrap">
                                {!isCheckingAuth && !authUser && (
                                    <Link
                                        to="/login"
                                        onClick={closeMobileMenu}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            minHeight: '42px',
                                            padding: '0.62rem 1rem',
                                            borderRadius: '999px',
                                            border: '1px solid rgba(255,255,255,0.22)',
                                            background: 'rgba(0,0,0,0.24)',
                                            color: '#fff',
                                            textDecoration: 'none',
                                            fontWeight: 900,
                                        }}
                                    >
                                        Login
                                    </Link>
                                )}

                                {!isCheckingAuth && authUser && (
                                    <Dropdown align="end">
                                        <Dropdown.Toggle
                                            id="auth-user-dropdown"
                                            className="wtc-auth-name"
                                            style={{
                                                border: '1px solid rgba(255,255,255,0.22)',
                                                borderRadius: '999px',
                                                background: 'rgba(0,0,0,0.24)',
                                                color: '#fff',
                                                padding: '0.66rem 0.95rem',
                                                fontWeight: 900,
                                            }}
                                        >
                                            Hi, {authUser.name}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="wtc-account-menu">
                                            {['staff', 'admin'].includes(authUser.role) && (
                                                <Dropdown.Item className="wtc-account-item" as={Link} to="/staff" onClick={closeMobileMenu}>
                                                    Staff Dashboard
                                                </Dropdown.Item>
                                            )}
                                            {authUser.role === 'admin' && (
                                                <Dropdown.Item className="wtc-account-item" as={Link} to="/admin" onClick={closeMobileMenu}>
                                                    Admin Panel
                                                </Dropdown.Item>
                                            )}
                                            <Dropdown.Item
                                                className="wtc-account-item"
                                                as={Link}
                                                to="/orders"
                                                onClick={closeMobileMenu}
                                            >
                                                My orders
                                            </Dropdown.Item>
                                            <Dropdown.Item
                                                className="wtc-account-item"
                                                as={Link}
                                                to="/menu"
                                                onClick={closeMobileMenu}
                                            >
                                                My Menu
                                            </Dropdown.Item>

                                            <Dropdown.Item
                                                className="wtc-account-item is-logout"
                                                as="button"
                                                onClick={logout}
                                            >
                                                Logout
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                )}
                            </div>
                        </div>
                    </nav>

                    <Collapse in={isOpen}>
                        <div id="wtc-mobile-nav" className="wtc-mobile-nav-panel">
                            <div className="wtc-mobile-nav-inner">
                                <div className="wtc-mobile-nav-list" aria-label="Mobile navigation">
                                    <Link className={mobileNavClass(isHomeActive)} to="/" onClick={closeMobileMenu}>
                                        Home
                                    </Link>

                                    <Link className={mobileNavClass(isMenuActive)} to="/menu" onClick={closeMobileMenu}>
                                        Menu
                                    </Link>

                                    <Link className={mobileNavClass(isAboutActive)} to="/#about" onClick={closeMobileMenu}>
                                        About Us
                                    </Link>

                                    <Link className={mobileNavClass(isContactActive)} to="/#contact" onClick={closeMobileMenu}>
                                        Contact
                                    </Link>

                                    <div className="wtc-mobile-order-mode" role="group" aria-label="Order mode">
                                        <button type="button" className={mode === 'delivery' ? 'active' : ''} onClick={() => { setOrderMode('delivery'); setDeliverySettingsOpen(true); }}>Delivery</button>
                                        <button type="button" className={mode === 'pickup' ? 'active' : ''} onClick={() => setOrderMode('pickup')}>Pickup</button>
                                    </div>

                                    <Link className={mobileNavClass(false)} to="/cart" onClick={closeMobileMenu}>
                                        Cart ({cartCount})
                                    </Link>
                                    {authUser && <Link className={mobileNavClass(location.pathname.startsWith('/orders'))} to="/orders" onClick={closeMobileMenu}>My orders</Link>}

                                    {['staff', 'admin'].includes(authUser?.role) && (
                                        <Link className={mobileNavClass(location.pathname === '/staff')} to="/staff" onClick={closeMobileMenu}>
                                            Staff Dashboard
                                        </Link>
                                    )}
                                    {authUser?.role === 'admin' && <Link className={mobileNavClass(location.pathname.startsWith('/admin'))} to="/admin" onClick={closeMobileMenu}>Admin Panel</Link>}
                                </div>
                            </div>
                        </div>
                    </Collapse>
                </Container>
            </motion.header>}
            </AnimatePresence>
            <Modal show={deliverySettingsOpen} onHide={() => setDeliverySettingsOpen(false)} centered contentClassName="wtc-delivery-modal">
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>Delivery details</Modal.Title>
                </Modal.Header>
                <form onSubmit={(event) => { event.preventDefault(); setDeliverySettingsOpen(false); }}>
                <Modal.Body className="wtc-delivery-fields">
                    <label className="form-label fw-bold" htmlFor="nav-delivery-branch">Delivering branch</label>
                    <select id="nav-delivery-branch" className="wtc-delivery-input" value={branchId || ''} disabled={!availableBranches.length} required onChange={(event) => setBranch(event.target.value)}>
                        {!availableBranches.length && <option value="">No delivery branches available</option>}
                        {availableBranches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name} · EGP {Number(branch.delivery_fee || 0).toFixed(2)}</option>)}
                    </select>
                    <label className="form-label fw-bold" htmlFor="nav-delivery-area">Area</label>
                    <input id="nav-delivery-area" className="wtc-delivery-input" maxLength={100} required value={deliveryArea} onChange={(event) => setDeliveryArea(event.target.value)} placeholder="e.g. New Cairo" />
                    <label className="form-label fw-bold" htmlFor="nav-delivery-address">Address</label>
                    <textarea id="nav-delivery-address" className="wtc-delivery-input" rows="3" maxLength={350} required value={deliveryAddress} onChange={(event) => setDeliveryAddress(event.target.value)} placeholder="Street, building and apartment" />
                    {selectedBranch && <div className="wtc-delivery-fee"><span>Delivery fee</span><strong>EGP {Number(selectedBranch.delivery_fee || 0).toFixed(2)}</strong></div>}
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-outline-light" onClick={() => setDeliverySettingsOpen(false)}>Cancel</button>
                    <button type="submit" className="btn btn-red" disabled={!availableBranches.length || !branchId || !deliveryArea.trim() || !deliveryAddress.trim()}>Save delivery details</button>
                </Modal.Footer>
                </form>
            </Modal>
        </>
    );
}
```

</details>

## الدوال والأجزاء المهمة هنا — Functions in context

### getCartCount

يفك السلة المحفوظة ويجمع quantity لكل سطر؛ العدد هو مجموع الكميات مش عدد المنتجات المختلفة.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** number؛ صفر عند JSON تالف.

### Navbar

يرسم الروابط والهوية والموبايل واختيار طريقة الطلب؛ إخفاء staff/admin links تجربة استخدام وليس ضمان صلاحيات backend.

- **بتاخد إيه؟ Inputs:** isVisible=true، reduceMotion=false، animateReveal=false.

- **بترجع/بتغيّر إيه؟ Return / effect:** JSX للشريط وModal التوصيل.

### syncCartCount

Callback للأحداث: يعيد حساب العداد ويضعه في state.

- **بتاخد إيه؟ Inputs:** قد يمرّر المتصفح event لكن الدالة لا تستخدمه.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined.

### closeMobileMenu

يقفل القائمة بعد التنقل أو تسجيل الخروج.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** undefined.

### logout

ينادي logoutUser من AuthContext، يقفل الموبايل وينتقل للرئيسية؛ في الخطأ يقفل القائمة فقط.

- **بتاخد إيه؟ Inputs:** لا شيء.

- **بترجع/بتغيّر إيه؟ Return / effect:** Promise<void>.

### navClass

يبني className للينك desktop حسب هل المسار active.

- **بتاخد إيه؟ Inputs:** isActive: Boolean.

- **بترجع/بتغيّر إيه؟ Return / effect:** string فيه الكلاس الأساسي ومعاه active عند تحقق الشرط.

### mobileNavClass

نفس فكرة navClass لكن بأسماء كلاسات الموبايل.

- **بتاخد إيه؟ Inputs:** isActive.

- **بترجع/بتغيّر إيه؟ Return / effect:** string.

## وظيفة كل استدعاء في الملف — Methods & calls

نفس اسم method ممكن يظهر على objects مختلفة؛ اسم المستقبِل مهم. الـarguments الفعلية مكتوبة في السطر، والبطاقة تشرح العقد العام أو تعريف المشروع.

### JSON.parse

- **جاية منين؟** JavaScript

- **وظيفتها:** يفك JSON string لقيم JS؛ ممكن يرمي SyntaxError ولا يعتبر validation كامل.

- **المدخلات — Arguments:** JSON string

- **الناتج/الأثر — Return / effect:** JS value

- **أول موضع هنا:** السطر 15، والمدخلات المكتوبة: `localStorage.getItem(CART_STORAGE_KEY) || '[]'`.

- **مثال:** const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

### localStorage.getItem

- **جاية منين؟** Browser localStorage/sessionStorage

- **وظيفتها:** تقرأ النص المحفوظ تحت مفتاح.

- **المدخلات — Arguments:** اسم المفتاح.

- **الناتج/الأثر — Return / effect:** string أو null؛ لا تعيد object تلقائيًا.

- **أول موضع هنا:** السطر 15، والمدخلات المكتوبة: `CART_STORAGE_KEY`.

### savedCart.reduce

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تجمع عناصر في نتيجة متراكمة.

- **المدخلات — Arguments:** callback(accumulator, item) وقيمة بداية اختيارية.

- **الناتج/الأثر — Return / effect:** الناتج النهائي؛ سلة فاضية مع البداية0 ترجع0.

- **أول موضع هنا:** السطر 17، والمدخلات المكتوبة: `(total, item) => total + Number(item.quantity || 0)`، `0`.

### Number

- **جاية منين؟** JavaScript conversion function

- **وظيفتها:** يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده.

- **المدخلات — Arguments:** value.

- **الناتج/الأثر — Return / effect:** number أو NaN.

- **أول موضع هنا:** السطر 698، والمدخلات المكتوبة: `selectedBranch.delivery_fee || 0`.

- **مثال:** Number(option.price);

### useNavigate

- **جاية منين؟** react-router-dom hook

- **وظيفتها:** يوفر function للتنقل داخل SPA؛ replace=true يستبدل history entry الحالية.

- **المدخلات — Arguments:** لا شيء عند إنشاء hook.

- **الناتج/الأثر — Return / effect:** navigate function.

- **أول موضع هنا:** السطر 24.

- **مثال:** navigate('/cart');

### useLocation

- **جاية منين؟** react-router-dom hook

- **وظيفتها:** يقرأ عنوان Router الحالي ويحدث component عند التنقل.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** location فيها pathname/search/hash وغيرها.

- **أول موضع هنا:** السطر 25.

- **مثال:** const location = useLocation();

### useState

- **جاية منين؟** React

- **وظيفتها:** حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة.

- **المدخلات — Arguments:** initialState

- **الناتج/الأثر — Return / effect:** [currentState,setter]

- **أول موضع هنا:** السطر 42، والمدخلات المكتوبة: `getCartCount`.

- **مثال:** const [failed, setFailed] = useState(false);

### useAuth

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** Custom hook يقرأ AuthContext؛ يرمي خطأ واضح لو اتنادى خارج AuthProvider.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** object فيه user/isCheckingAuth/login/register/logout.

- **أول موضع هنا:** السطر 29.

- **تكملة التعريف:** [resources/js/context/AuthContext.jsx](../context/AuthContext.jsx.md)، عند السطر 74.

### useOrder

- **جاية منين؟** دالة من ملف آخر في المشروع — Imported project function

- **وظيفتها:** Custom hook يقرأ اختيار الفرع وطريقة الاستلام والعنوان ودوال تغييرها.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** value الخاص بـ OrderContext أو يرمي خطأ لو خارج Provider.

- **أول موضع هنا:** السطر 41.

- **تكملة التعريف:** [resources/js/context/OrderContext.jsx](../context/OrderContext.jsx.md)، عند السطر 127.

### useEffect

- **جاية منين؟** React

- **وظيفتها:** يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies.

- **المدخلات — Arguments:** setup callback, dependencies

- **الناتج/الأثر — Return / effect:** undefined

- **أول موضع هنا:** السطر 44، والمدخلات المكتوبة: `() => {         const syncCartCount = () => {             setCartCount(getCartCount());         };          window.addEventListener('storage', syncCartCount);         window.addEve…`، `[]`.

- **مثال:** useEffect(() => { window.addEventListener('resize', updateRunway); return () => window.removeEventListener('resize', updateRunway); }, []);

### setCartCount

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setCartCount هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 46، والمدخلات المكتوبة: `getCartCount()`.

### getCartCount

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يفك السلة المحفوظة ويجمع quantity لكل سطر؛ العدد هو مجموع الكميات مش عدد المنتجات المختلفة.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** number؛ صفر عند JSON تالف.

- **أول موضع هنا:** السطر 46.

### window.addEventListener

- **جاية منين؟** Browser EventTarget

- **وظيفتها:** تسجّل listener؛ مصدر الحدث يناديها ويمرر Event.

- **المدخلات — Arguments:** اسم الحدث والدالة وخيارات.

- **الناتج/الأثر — Return / effect:** undefined؛ لا تشغّل handler لحظة التسجيل.

- **أول موضع هنا:** السطر 50، والمدخلات المكتوبة: `CART_EVENT_NAME`، `syncCartCount`.

### window.removeEventListener

- **جاية منين؟** Browser EventTarget

- **وظيفتها:** تلغي listener بنفس الاسم ومرجع الدالة وcapture المناسب.

- **المدخلات — Arguments:** نوع الحدث والدالة وخيار capture إن لزم.

- **الناتج/الأثر — Return / effect:** undefined؛ لا توقف الحدث نفسه.

- **أول موضع هنا:** السطر 54، والمدخلات المكتوبة: `CART_EVENT_NAME`، `syncCartCount`.

### setIsOpen

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setIsOpen هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 434، والمدخلات المكتوبة: `(current) => !current`.

### logoutUser

- **جاية منين؟** Callback/دالة مأخوذة من props أو Context حسب تعريف المكوّن

- **وظيفتها:** تنادي العملية اللي الأب أو الـContext مرّرها باسم logoutUser؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي.

- **المدخلات — Arguments:** بدون arguments مباشرة هنا.

- **الناتج/الأثر — Return / effect:** العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.

- **أول موضع هنا:** السطر 64.

### closeMobileMenu

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يقفل القائمة بعد التنقل أو تسجيل الخروج.

- **المدخلات — Arguments:** لا شيء.

- **الناتج/الأثر — Return / effect:** undefined.

- **أول موضع هنا:** السطر 68.

### navigate

- **جاية منين؟** React Router callback

- **وظيفتها:** تنقّل داخل SPA حسب route.

- **المدخلات — Arguments:** path وoptions مثل replace.

- **الناتج/الأثر — Return / effect:** void/Promise حسب نمط Router؛ مش حماية endpoint.

- **أول موضع هنا:** السطر 66، والمدخلات المكتوبة: `'/'`.

### location.pathname.startsWith

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تفحص بداية النص.

- **المدخلات — Arguments:** prefix وموضع اختياري.

- **الناتج/الأثر — Return / effect:** Boolean؛ لا تتحقق من وجود ملف.

- **أول موضع هنا:** السطر 675، والمدخلات المكتوبة: `'/admin'`.

### navClass

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** يبني className للينك desktop حسب هل المسار active.

- **المدخلات — Arguments:** isActive: Boolean.

- **الناتج/الأثر — Return / effect:** string فيه الكلاس الأساسي ومعاه active عند تحقق الشرط.

- **أول موضع هنا:** السطر 454، والمدخلات المكتوبة: `isContactActive`.

### setOrderMode

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setOrderMode هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 662، والمدخلات المكتوبة: `'pickup'`.

### setDeliverySettingsOpen

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setDeliverySettingsOpen هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 701، والمدخلات المكتوبة: `false`.

### ['staff', 'admin'].includes

- **جاية منين؟** Array/String / JavaScript

- **وظيفتها:** تختبر وجود قيمة في array أو نص داخل string.

- **المدخلات — Arguments:** القيمة/النص المطلوب.

- **الناتج/الأثر — Return / effect:** Boolean؛ مش العنصر ولا موقعه.

- **أول موضع هنا:** السطر 670، والمدخلات المكتوبة: `authUser?.role`.

### mobileNavClass

- **جاية منين؟** دالة من كود المشروع — Custom function

- **وظيفتها:** نفس فكرة navClass لكن بأسماء كلاسات الموبايل.

- **المدخلات — Arguments:** isActive.

- **الناتج/الأثر — Return / effect:** string.

- **أول موضع هنا:** السطر 675، والمدخلات المكتوبة: `location.pathname.startsWith('/admin')`.

### event.preventDefault

- **جاية منين؟** Browser Event

- **وظيفتها:** تمنع السلوك الافتراضي لحدث قابل للإلغاء.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** undefined؛ لا توقف propagation تلقائيًا.

- **أول موضع هنا:** السطر 687.

### setBranch

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setBranch هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 690، والمدخلات المكتوبة: `event.target.value`.

### availableBranches.map

- **جاية منين؟** Array / JavaScript

- **وظيفتها:** تحوّل كل عنصر إلى نتيجة callback.

- **المدخلات — Arguments:** callback تحويل.

- **الناتج/الأثر — Return / effect:** array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.

- **أول موضع هنا:** السطر 692، والمدخلات المكتوبة: `(branch) => <option key={branch.id} value={branch.id}>{branch.name} · EGP {Number(branch.delivery_fee || 0).toFixed(2)}</option>`.

### Number(branch.delivery_fee || 0).toFixed

- **جاية منين؟** Number / JavaScript

- **وظيفتها:** تنسّق عددًا بمواضع عشرية محددة.

- **المدخلات — Arguments:** عدد الخانات.

- **الناتج/الأثر — Return / effect:** string، مش رقمًا صالحًا للحساب بدون تحويل.

- **أول موضع هنا:** السطر 692، والمدخلات المكتوبة: `2`.

### setDeliveryArea

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setDeliveryArea هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 695، والمدخلات المكتوبة: `event.target.value`.

### setDeliveryAddress

- **جاية منين؟** راجع تعريف المتغير في نفس الملف

- **وظيفتها:** لو setDeliveryAddress هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم.

- **المدخلات — Arguments:** القيمة الجديدة أو updater function في حالة setter.

- **الناتج/الأثر — Return / effect:** React setter ترجع undefined؛ لا ترجع بيانات API.

- **أول موضع هنا:** السطر 697، والمدخلات المكتوبة: `event.target.value`.

### Number(selectedBranch.delivery_fee || 0).toFixed

- **جاية منين؟** Number / JavaScript

- **وظيفتها:** تنسّق عددًا بمواضع عشرية محددة.

- **المدخلات — Arguments:** عدد الخانات.

- **الناتج/الأثر — Return / effect:** string، مش رقمًا صالحًا للحساب بدون تحويل.

- **أول موضع هنا:** السطر 698، والمدخلات المكتوبة: `2`.

### deliveryArea.trim

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تشيل whitespace من أول وآخر النص فقط.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** نص جديد؛ لا تغيّر النص الأصلي.

- **أول موضع هنا:** السطر 702.

### deliveryAddress.trim

- **جاية منين؟** String / JavaScript

- **وظيفتها:** تشيل whitespace من أول وآخر النص فقط.

- **المدخلات — Arguments:** بدون مدخلات.

- **الناتج/الأثر — Return / effect:** نص جديد؛ لا تغيّر النص الأصلي.

- **أول موضع هنا:** السطر 702.

## نمشي سطر سطر — Line by line

كل مجموعة تحت مقتطف متتابع من نفس الملف، مش function جديدة مستقلة. لو script وtemplate في ملف Vue واحد، هتلاقي الجزئين بنفس ترتيبهم الأصلي، والربط بينهما موضّح في الدرس العملي.

### السطور 1–8

```jsx
// resources/js/Components/Navbar.jsx

import React, { useEffect, useState } from 'react';
import { Collapse, Container, Dropdown, Modal } from 'react-bootstrap';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
```

**السطر 1:** Comment / تعليق: ملاحظة في المصدر، مش تعليمة تشغيل. اقرأها مع الكود اللي بعدها؛ تعليق قديم مش دليل وحده إن الميزة نشطة.

**السطر 3:** Import / استيراد: الأسماء `React`، `useEffect`، `useState` جاية من `react`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 4:** Import / استيراد: الأسماء `Collapse`، `Container`، `Dropdown`، `Modal` جاية من `react-bootstrap`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 5:** Import / استيراد: الأسماء `AnimatePresence`، `motion` جاية من `framer-motion`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 6:** Import / استيراد: الأسماء `Link`، `useLocation`، `useNavigate` جاية من `react-router-dom`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 7:** Import / استيراد: الأسماء `useAuth` جاية من `../context/AuthContext`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

**السطر 8:** Import / استيراد: الأسماء `useOrder` جاية من `../context/OrderContext`. الاستيراد يوصّل التعريفات؛ مش نداء handler بالضغط.

### السطور 9–16

```jsx

const CART_STORAGE_KEY = import.meta.env.VITE_DEMO_MODE === 'true' ? 'wtc_demo_cart' : 'wtc_cart';
const CART_EVENT_NAME = 'wtc-cart-updated';

function getCartCount() {
    try {
        const savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');

```

**السطر 10:** Variable declaration / تعريف `CART_STORAGE_KEY` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 11:** Variable declaration / تعريف `CART_EVENT_NAME` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. البداية `"wtc-cart-updated"`، مش ناتج طلب شبكة.

**السطر 13:** Function / تعريف دالة `getCartCount`؛ تعريفها مش تشغيلها. يفك السلة المحفوظة ويجمع quantity لكل سطر؛ العدد هو مجموع الكميات مش عدد المنتجات المختلفة. مدخلاتها: لا شيء. ناتجها: number؛ صفر عند JSON تالف.

**السطر 14:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة.

**السطر 15:** Variable declaration / تعريف `savedCart` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `JSON.parse(...)`: يفك JSON string لقيم JS؛ ممكن يرمي SyntaxError ولا يعتبر validation كامل. القيم المكتوبة هنا: `localStorage.getItem(CART_STORAGE_KEY) || '[]'`. العائد/الأثر: JS value؛ `localStorage.getItem(...)`: تقرأ النص المحفوظ تحت مفتاح. القيم المكتوبة هنا: `CART_STORAGE_KEY`. العائد/الأثر: string أو null؛ لا تعيد object تلقائيًا.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 17–24

```jsx
        return savedCart.reduce((total, item) => total + Number(item.quantity || 0), 0);
    } catch {
        return 0;
    }
}

export default function Navbar({ isVisible = true, reduceMotion = false, animateReveal = false }) {
    const navigate = useNavigate();
```

**السطر 17:** Return / رجّع `savedCart.reduce((total, item) => total + Number(item.quantity || 0), 0)` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS. الدوال الموجودة في السطر: `savedCart.reduce(...)`: تجمع عناصر في نتيجة متراكمة. القيم المكتوبة هنا: `(total, item) => total + Number(item.quantity || 0)`، `0`. العائد/الأثر: الناتج النهائي؛ سلة فاضية مع البداية0 ترجع0.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `item.quantity || 0`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 18:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 19:** Return / رجّع `0` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 20:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 21:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 23:** Function / تعريف دالة `Navbar`؛ تعريفها مش تشغيلها. يرسم الروابط والهوية والموبايل واختيار طريقة الطلب؛ إخفاء staff/admin links تجربة استخدام وليس ضمان صلاحيات backend. مدخلاتها: isVisible=true، reduceMotion=false، animateReveal=false. ناتجها: JSX للشريط وModal التوصيل.

**السطر 24:** Variable declaration / تعريف `navigate` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useNavigate(...)`: يوفر function للتنقل داخل SPA؛ replace=true يستبدل history entry الحالية. مدخلاتها: لا شيء عند إنشاء hook. العائد/الأثر: navigate function.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 25–32

```jsx
    const location = useLocation();

    const [isOpen, setIsOpen] = useState(false);
    const [deliverySettingsOpen, setDeliverySettingsOpen] = useState(false);
    const { user: authUser, isCheckingAuth, logout: logoutUser } = useAuth();
    const {
        mode,
        branchId,
```

**السطر 25:** Variable declaration / تعريف `location` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useLocation(...)`: يقرأ عنوان Router الحالي ويحدث component عند التنقل. مدخلاتها: لا شيء. العائد/الأثر: location فيها pathname/search/hash وغيرها.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 27:** Variable declaration / تعريف `isOpen + setIsOpen` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `false`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 28:** Variable declaration / تعريف `deliverySettingsOpen + setDeliverySettingsOpen` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `false`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 29:** Variable declaration / تعريف اسم/أسماء لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useAuth(...)`: Custom hook يقرأ AuthContext؛ يرمي خطأ واضح لو اتنادى خارج AuthProvider. مدخلاتها: لا شيء. العائد/الأثر: object فيه user/isCheckingAuth/login/register/logout.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 30:** Variable declaration / تعريف اسم/أسماء لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 31:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 32:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 33–40

```jsx
        availableBranches,
        selectedBranch,
        deliveryAddress,
        deliveryArea,
        setOrderMode,
        setBranch,
        setDeliveryAddress,
        setDeliveryArea,
```

**السطر 33:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 34:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 35:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 36:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 37:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 38:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 39:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 40:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 41–48

```jsx
    } = useOrder();
    const [cartCount, setCartCount] = useState(getCartCount);

    useEffect(() => {
        const syncCartCount = () => {
            setCartCount(getCartCount());
        };

```

**السطر 41:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useOrder(...)`: Custom hook يقرأ اختيار الفرع وطريقة الاستلام والعنوان ودوال تغييرها. مدخلاتها: لا شيء. العائد/الأثر: value الخاص بـ OrderContext أو يرمي خطأ لو خارج Provider.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 42:** Variable declaration / تعريف `cartCount + setCartCount` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `useState(...)`: حالة component وsetter؛ تغييرها يطلب render جديد. لا تعدّل object state مباشرة. القيم المكتوبة هنا: `getCartCount`. العائد/الأثر: [currentState,setter]. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 44:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `useEffect(...)`: يزامن component مع نظام خارجي بعد commit؛ callback ترجع cleanup وتنفذ حسب dependencies. القيم المكتوبة هنا: `() => {         const syncCartCount = () => {             setCartCount(getCartCount());         };          wi…`، `[]`. العائد/الأثر: undefined. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 45:** Variable declaration / تعريف `syncCartCount` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `syncCartCount` هنا: Callback للأحداث: يعيد حساب العداد ويضعه في state. المدخلات: قد يمرّر المتصفح event لكن الدالة لا تستخدمه.. الناتج/الأثر: undefined..

**السطر 46:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setCartCount(...)`: لو setCartCount هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `getCartCount()`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `getCartCount(...)`: يفك السلة المحفوظة ويجمع quantity لكل سطر؛ العدد هو مجموع الكميات مش عدد المنتجات المختلفة. مدخلاتها: لا شيء. العائد/الأثر: number؛ صفر عند JSON تالف.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 47:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 49–56

```jsx
        window.addEventListener('storage', syncCartCount);
        window.addEventListener(CART_EVENT_NAME, syncCartCount);

        return () => {
            window.removeEventListener('storage', syncCartCount);
            window.removeEventListener(CART_EVENT_NAME, syncCartCount);
        };
    }, []);
```

**السطر 49:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `window.addEventListener(...)`: تسجّل listener؛ مصدر الحدث يناديها ويمرر Event. القيم المكتوبة هنا: `'storage'`، `syncCartCount`. العائد/الأثر: undefined؛ لا تشغّل handler لحظة التسجيل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 50:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `window.addEventListener(...)`: تسجّل listener؛ مصدر الحدث يناديها ويمرر Event. القيم المكتوبة هنا: `CART_EVENT_NAME`، `syncCartCount`. العائد/الأثر: undefined؛ لا تشغّل handler لحظة التسجيل.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 52:** Return / رجّع `() => {` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 53:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `window.removeEventListener(...)`: تلغي listener بنفس الاسم ومرجع الدالة وcapture المناسب. القيم المكتوبة هنا: `'storage'`، `syncCartCount`. العائد/الأثر: undefined؛ لا توقف الحدث نفسه.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 54:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `window.removeEventListener(...)`: تلغي listener بنفس الاسم ومرجع الدالة وcapture المناسب. القيم المكتوبة هنا: `CART_EVENT_NAME`، `syncCartCount`. العائد/الأثر: undefined؛ لا توقف الحدث نفسه.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 55:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 56:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 57–64

```jsx

    const closeMobileMenu = () => {
        setIsOpen(false);
    };

    const logout = async () => {
        try {
            await logoutUser();
```

**السطر 58:** Variable declaration / تعريف `closeMobileMenu` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `closeMobileMenu` هنا: يقفل القائمة بعد التنقل أو تسجيل الخروج. المدخلات: لا شيء.. الناتج/الأثر: undefined..

**السطر 59:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setIsOpen(...)`: لو setIsOpen هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `false`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 60:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 62:** Variable declaration / تعريف `logout` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `logout` هنا: ينادي logoutUser من AuthContext، يقفل الموبايل وينتقل للرئيسية؛ في الخطأ يقفل القائمة فقط. المدخلات: لا شيء.. الناتج/الأثر: Promise<void>..

**السطر 63:** Try: بداية كود ممكن يرمي خطأ؛ النجاح يكمل طبيعي والفشل يروح catch المناسبة.

**السطر 64:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `logoutUser(...)`: تنادي العملية اللي الأب أو الـContext مرّرها باسم logoutUser؛ ده مش built-in في اللغة. راجع ربط نفس prop في JSX وسلسلة الميزة في الدرس العملي. مدخلاتها: بدون arguments مباشرة هنا. العائد/الأثر: العائد حسب الدالة الممرّرة؛ هدف callbacks الواجهة هنا تحديث حالة/طلب إجراء، مش ناتج HTML مباشر.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 65–72

```jsx
            closeMobileMenu();
            navigate('/');
        } catch {
            closeMobileMenu();
        }
    };

    const isHomeActive = location.pathname === '/' && !location.hash;
```

**السطر 65:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `closeMobileMenu(...)`: يقفل القائمة بعد التنقل أو تسجيل الخروج. مدخلاتها: لا شيء. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 66:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `navigate(...)`: تنقّل داخل SPA حسب route. القيم المكتوبة هنا: `'/'`. العائد/الأثر: void/Promise حسب نمط Router؛ مش حماية endpoint.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 67:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 68:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `closeMobileMenu(...)`: يقفل القائمة بعد التنقل أو تسجيل الخروج. مدخلاتها: لا شيء. العائد/الأثر: undefined.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 69:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 70:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 72:** Variable declaration / تعريف `isHomeActive` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

### السطور 73–80

```jsx
    const isMenuActive = location.pathname.startsWith('/menu');
    const isAboutActive = location.pathname === '/' && location.hash === '#about';
    const isContactActive = location.pathname === '/' && location.hash === '#contact';

    const navClass = (isActive) => (
        `wtc-navbar-link ${isActive ? 'wtc-navbar-link-active' : ''}`
    );

```

**السطر 73:** Variable declaration / تعريف `isMenuActive` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. الدوال الموجودة في السطر: `location.pathname.startsWith(...)`: تفحص بداية النص. القيم المكتوبة هنا: `'/menu'`. العائد/الأثر: Boolean؛ لا تتحقق من وجود ملف.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 74:** Variable declaration / تعريف `isAboutActive` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 75:** Variable declaration / تعريف `isContactActive` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter.

**السطر 77:** Variable declaration / تعريف `navClass` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `navClass` هنا: يبني className للينك desktop حسب هل المسار active. المدخلات: isActive: Boolean.. الناتج/الأثر: string فيه الكلاس الأساسي ومعاه active عند تحقق الشرط..

**السطر 78:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 79:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 81–88

```jsx
    const mobileNavClass = (isActive) => (
        `wtc-mobile-nav-link ${isActive ? 'wtc-mobile-nav-link-active' : ''}`
    );

    return (
        <>
            <style>
                {`
```

**السطر 81:** Variable declaration / تعريف `mobileNavClass` لتخزين القيمة المحسوبة على يمين =. const تمنع إعادة الإسناد، let تسمح. لو [] على الشمال فهي destructuring مثل زوج state وsetter. دور `mobileNavClass` هنا: نفس فكرة navClass لكن بأسماء كلاسات الموبايل. المدخلات: isActive.. الناتج/الأثر: string..

**السطر 82:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 83:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 85:** Return / رجّع `(` للمتصل وأنهِ مسار الدالة الحالي. رجوع JSX وصف للواجهة؛ رجوع callback يختلف عن تنفيذها الآن؛ return بدون قيمة يرجّع undefined في JS.

**السطر 86:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 87:** بداية CSS / تنسيق؛ لو scoped فـVue تضيف عزلًا بالـattributes أثناء البناء.

**السطر 88:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 89–96

```jsx
                    .wtc-navbar-link {
                        position: relative;
                        color: rgba(255,255,255,0.74);
                        font-size: 0.92rem;
                        font-weight: 900;
                        text-decoration: none;
                        white-space: nowrap;
                        transition: color 0.22s ease;
```

**السطر 89:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 90:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 91:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 92:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 93:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 94:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 95:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 96:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 97–104

```jsx
                        padding: 0.35rem 0;
                    }

                    .wtc-navbar-link::after {
                        content: "";
                        position: absolute;
                        left: 50%;
                        bottom: -0.34rem;
```

**السطر 97:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 98:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 100:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 101:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 102:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 103:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 104:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 105–112

```jsx
                        width: 0;
                        height: 2px;
                        border-radius: 999px;
                        background: #e32424;
                        transform: translateX(-50%);
                        transition: width 0.22s ease;
                    }

```

**السطر 105:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 106:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 107:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 108:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 109:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 110:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 111:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 113–120

```jsx
                    .wtc-navbar-link:hover {
                        color: #ffffff;
                    }

                    .wtc-navbar-link-active {
                        color: #e32424 !important;
                    }

```

**السطر 113:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 114:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 115:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 117:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 118:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 119:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 121–128

```jsx
                    .wtc-navbar-link-active::after {
                        width: 22px;
                    }

                    .wtc-logo-img {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
```

**السطر 121:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 122:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 123:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 125:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 126:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 127:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 128:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 129–136

```jsx
                        display: block;
                        filter:
                            invert(1)
                            hue-rotate(180deg)
                            saturate(3.3)
                            brightness(1.34)
                            contrast(1.2)
                            drop-shadow(0 0 10px rgba(227, 36, 36, 0.92))
```

**السطر 129:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 130:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 131:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 132:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 133:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 134:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 135:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 136:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 137–144

```jsx
                            drop-shadow(0 0 30px rgba(227, 36, 36, 0.48));
                        mix-blend-mode: screen;
                    }

                    .wtc-mobile-menu {
                        width: 44px;
                        height: 44px;
                        display: none;
```

**السطر 137:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 138:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 139:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 141:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 142:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 143:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 144:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 145–152

```jsx
                        border: 1px solid rgba(255,255,255,0.18);
                        border-radius: 14px;
                        background: rgba(0,0,0,0.2);
                        transition: border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
                    }

                    .wtc-mobile-menu span {
                        display: block;
```

**السطر 145:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 146:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 147:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 148:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 149:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 151:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 152:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 153–160

```jsx
                        width: 19px;
                        height: 2px;
                        margin: 4px auto;
                        border-radius: 999px;
                        background: #ffffff;
                        transition: transform 0.24s ease, opacity 0.2s ease;
                    }

```

**السطر 153:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 154:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 155:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 156:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 157:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 158:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 159:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 161–168

```jsx
                    .wtc-mobile-menu.active {
                        border-color: rgba(227,38,38,0.62);
                        background: rgba(227,38,38,0.12);
                        box-shadow: 0 0 24px rgba(227,38,38,0.18);
                    }

                    .wtc-mobile-menu.active span:nth-child(1) {
                        transform: translateY(6px) rotate(45deg);
```

**السطر 161:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 162:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 163:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 164:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 165:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 167:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 168:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 169–176

```jsx
                    }

                    .wtc-mobile-menu.active span:nth-child(2) {
                        opacity: 0;
                    }

                    .wtc-mobile-menu.active span:nth-child(3) {
                        transform: translateY(-6px) rotate(-45deg);
```

**السطر 169:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 171:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 172:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 173:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 175:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 176:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 177–184

```jsx
                    }

                    .wtc-mobile-nav-panel {
                        display: none;
                    }

                    .wtc-mobile-nav-inner {
                        margin: 0 -0.75rem;
```

**السطر 177:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 179:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 180:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 181:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 183:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 184:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 185–192

```jsx
                        padding: 0.45rem 0.75rem 0.9rem;
                        background:
                            linear-gradient(180deg, rgba(10,10,10,0.92), rgba(10,10,10,0.68) 72%, rgba(10,10,10,0)),
                            radial-gradient(circle at 12% 0%, rgba(227,38,38,0.13), transparent 16rem);
                        backdrop-filter: blur(18px);
                        -webkit-backdrop-filter: blur(18px);
                        box-shadow:
                            inset 0 1px 0 rgba(255,255,255,0.08),
```

**السطر 185:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 186:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 187:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 188:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 189:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 190:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 191:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 192:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 193–200

```jsx
                            inset 0 -1px 0 rgba(255,255,255,0.035);
                    }

                    .wtc-mobile-nav-list {
                        display: grid;
                        gap: 0.2rem;
                        padding: 0.18rem 0;
                    }
```

**السطر 193:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 194:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 196:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 197:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 198:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 199:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 200:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 201–208

```jsx

                    .wtc-mobile-nav-link {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        min-height: 48px;
                        padding: 0.35rem 0.1rem;
                        color: rgba(255,255,255,0.72);
```

**السطر 202:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 203:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 204:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 205:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 206:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 207:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 208:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 209–216

```jsx
                        font-weight: 920;
                        text-decoration: none;
                        transition: color 0.2s ease, transform 0.2s ease;
                    }

                    .wtc-mobile-nav-link::after {
                        content: "";
                        width: 6px;
```

**السطر 209:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 210:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 211:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 212:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 214:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 215:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 216:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 217–224

```jsx
                        height: 6px;
                        border-radius: 999px;
                        background: transparent;
                        box-shadow: 0 0 0 rgba(227,38,38,0);
                        transition: background 0.2s ease, box-shadow 0.2s ease;
                    }

                    .wtc-mobile-nav-link:hover {
```

**السطر 217:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 218:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 219:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 220:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 221:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 222:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 224:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 225–232

```jsx
                        color: #ffffff;
                        transform: translateX(2px);
                    }

                    .wtc-mobile-nav-link-active {
                        color: #ff3b3b;
                    }

```

**السطر 225:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 226:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 227:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 229:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 230:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 231:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 233–240

```jsx
                    .wtc-mobile-nav-link-active::after {
                        background: #e32424;
                        box-shadow: 0 0 18px rgba(227,38,38,0.6);
                    }

                    .wtc-cart-link {
                        position: relative;
                        width: 44px;
```

**السطر 233:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 234:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 235:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 236:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 238:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 239:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 240:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 241–248

```jsx
                        height: 44px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 999px;
                        border: 1px solid rgba(255,255,255,0.2);
                        background: rgba(0,0,0,0.24);
                        color: #ffffff;
```

**السطر 241:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 242:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 243:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 244:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 245:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 246:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 247:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 248:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 249–256

```jsx
                        text-decoration: none;
                        transition: 0.22s ease;
                    }

                    .wtc-cart-link:hover {
                        color: #ffffff;
                        border-color: rgba(227,38,38,0.7);
                        box-shadow: 0 0 22px rgba(227,38,38,0.28);
```

**السطر 249:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 250:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 251:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 253:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 254:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 255:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 256:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 257–264

```jsx
                        transform: translateY(-1px);
                    }

                    .wtc-cart-badge {
                        position: absolute;
                        top: -4px;
                        right: -4px;
                        min-width: 20px;
```

**السطر 257:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 258:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 260:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 261:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 262:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 263:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 264:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 265–272

```jsx
                        height: 20px;
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        padding: 0 6px;
                        border-radius: 999px;
                        background: #e32424;
                        color: #ffffff;
```

**السطر 265:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 266:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 267:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 268:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 269:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 270:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 271:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 272:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 273–280

```jsx
                        font-size: 0.68rem;
                        font-weight: 950;
                        box-shadow: 0 0 0 3px rgba(18,18,18,0.9);
                    }

                    .wtc-account-menu {
                        min-width: 220px;
                        background: #171717 !important;
```

**السطر 273:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 274:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 275:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 276:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 278:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 279:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 280:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 281–288

```jsx
                        border: 1px solid rgba(255,255,255,0.14) !important;
                        border-radius: 8px !important;
                        padding: 0.42rem !important;
                        box-shadow: 0 18px 48px rgba(0,0,0,0.48);
                    }

                    .wtc-account-item {
                        display: flex !important;
```

**السطر 281:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 282:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 283:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 284:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 285:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 287:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 288:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 289–296

```jsx
                        align-items: center;
                        min-height: 42px;
                        border-radius: 5px !important;
                        background: transparent !important;
                        color: #f5f5f5 !important;
                        font-weight: 850 !important;
                        transition: background 0.16s ease, color 0.16s ease;
                    }
```

**السطر 289:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 290:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 291:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 292:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 293:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 294:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 295:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 296:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 297–304

```jsx

                    .wtc-account-item:hover,
                    .wtc-account-item:focus,
                    .wtc-account-item:active,
                    .wtc-account-item.active {
                        background: rgba(227,36,36,0.16) !important;
                        color: #ff5757 !important;
                    }
```

**السطر 298:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 299:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 300:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 301:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 302:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 303:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 304:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 305–312

```jsx

                    .wtc-account-item:focus-visible {
                        outline: 3px solid rgba(255,87,87,0.52);
                        outline-offset: -2px;
                        box-shadow: none !important;
                    }

                    .wtc-account-item:disabled,
```

**السطر 306:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 307:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 308:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 309:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 310:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 312:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 313–320

```jsx
                    .wtc-account-item.disabled {
                        background: transparent !important;
                        color: #777 !important;
                        cursor: not-allowed;
                        opacity: 1;
                    }

                    .wtc-account-item.is-logout {
```

**السطر 313:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 314:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 315:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 316:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 317:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 318:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 320:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 321–328

```jsx
                        color: #ff8a8a !important;
                    }

                    .wtc-mobile-order-mode {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 0.45rem;
                        padding: 0.55rem 0 0.75rem;
```

**السطر 321:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 322:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 324:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 325:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 326:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 327:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 328:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 329–336

```jsx
                    }

                    .wtc-mobile-order-mode button {
                        min-height: 42px;
                        border: 1px solid #3b3b3b;
                        border-radius: 5px;
                        background: #171717;
                        color: #ddd;
```

**السطر 329:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 331:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 332:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 333:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 334:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 335:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 336:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 337–344

```jsx
                        font-weight: 850;
                    }

                    .wtc-mobile-order-mode button.active {
                        border-color: #e32424;
                        background: #e32424;
                        color: #fff;
                    }
```

**السطر 337:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 338:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 340:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 341:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 342:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 343:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 344:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 345–352

```jsx

                    @media (max-width: 1199px) {
                        .wtc-mobile-menu {
                            display: block;
                        }

                        .wtc-desktop-nav {
                            display: none !important;
```

**السطر 346:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 347:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 348:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 349:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 351:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 352:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 353–360

```jsx
                        }

                        .wtc-mobile-nav-panel {
                            display: block;
                        }
                    }

                    @media (max-width: 991px) {
```

**السطر 353:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 355:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 356:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 357:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 358:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 360:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 361–368

```jsx
                        .wtc-order-toggle {
                            display: none !important;
                        }
                    }

                    @media (max-width: 767px) {
                        .wtc-navbar-shell {
                            min-height: 72px !important;
```

**السطر 361:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 362:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 363:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 364:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 366:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 367:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 368:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 369–376

```jsx
                        }

                        .wtc-logo-link {
                            width: 118px !important;
                            height: 52px !important;
                        }

                        .wtc-auth-name {
```

**السطر 369:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 371:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 372:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 373:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 374:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 376:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 377–384

```jsx
                            max-width: 116px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }

                        .wtc-mobile-nav-link {
                            min-height: 46px;
```

**السطر 377:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 378:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 379:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 380:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 381:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 383:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 384:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 385–392

```jsx
                            font-size: 0.96rem;
                        }
                    }

                    @media (max-width: 520px) {
                        .wtc-auth-wrap {
                            display: none !important;
                        }
```

**السطر 385:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 386:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 387:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 389:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 390:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 391:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 392:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 393–400

```jsx

                        .wtc-cart-link {
                            width: 40px;
                            height: 40px;
                        }
                    }
                `}
            </style>
```

**السطر 394:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 395:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 396:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 397:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 398:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 399:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 400:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 401–408

```jsx

            <AnimatePresence>
            {isVisible && <motion.header
                className="site-header"
                initial={!animateReveal || reduceMotion ? false : { opacity: 0, y: -24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: reduceMotion ? 0 : 0.36, ease: 'easeOut' }}
```

**السطر 402:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 403:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 404:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 405:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 406:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 407:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 408:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

### السطور 409–416

```jsx
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    background: 'rgba(10,10,10,0.38)',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
```

**السطر 409:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 410:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 411:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 412:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 413:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 414:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 415:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 416:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 417–424

```jsx
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                }}
            >
                <Container fluid="xl">
                    <nav
                        className="wtc-navbar-shell d-flex align-items-center justify-content-between gap-3"
                        aria-label="Primary navigation"
```

**السطر 417:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 418:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 419:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 420:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 421:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 422:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 423:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 424:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

### السطور 425–432

```jsx
                        style={{ minHeight: '84px' }}
                    >
                        <div className="d-flex align-items-center justify-content-start flex-fill">
                            <button
                                type="button"
                                className={`wtc-mobile-menu ${isOpen ? 'active' : ''}`}
                                aria-label="Toggle navigation"
                                aria-expanded={isOpen}
```

**السطر 425:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 426:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 427:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 428:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 429:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 430:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 431:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 432:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

### السطور 433–440

```jsx
                                aria-controls="wtc-mobile-nav"
                                onClick={() => setIsOpen((current) => !current)}
                            >
                                <span />
                                <span />
                                <span />
                            </button>

```

**السطر 433:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 434:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `setIsOpen(...)`: لو setIsOpen هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `(current) => !current`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 435:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 436:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 437:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 438:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 439:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 441–448

```jsx
                            <div className="wtc-desktop-nav d-flex align-items-center gap-4">
                                <Link className={navClass(isHomeActive)} to="/" onClick={closeMobileMenu}>
                                    Home
                                </Link>

                                <Link className={navClass(isMenuActive)} to="/menu" onClick={closeMobileMenu}>
                                    Menu
                                </Link>
```

**السطر 441:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 442:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `navClass(...)`: يبني className للينك desktop حسب هل المسار active. القيم المكتوبة هنا: `isHomeActive`. العائد/الأثر: string فيه الكلاس الأساسي ومعاه active عند تحقق الشرط.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 443:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 444:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 446:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `navClass(...)`: يبني className للينك desktop حسب هل المسار active. القيم المكتوبة هنا: `isMenuActive`. العائد/الأثر: string فيه الكلاس الأساسي ومعاه active عند تحقق الشرط.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 447:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 448:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 449–456

```jsx

                                <Link className={navClass(isAboutActive)} to="/#about" onClick={closeMobileMenu}>
                                    About Us
                                </Link>

                                <Link className={navClass(isContactActive)} to="/#contact" onClick={closeMobileMenu}>
                                    Contact
                                </Link>
```

**السطر 450:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `navClass(...)`: يبني className للينك desktop حسب هل المسار active. القيم المكتوبة هنا: `isAboutActive`. العائد/الأثر: string فيه الكلاس الأساسي ومعاه active عند تحقق الشرط.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 451:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 452:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 454:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `navClass(...)`: يبني className للينك desktop حسب هل المسار active. القيم المكتوبة هنا: `isContactActive`. العائد/الأثر: string فيه الكلاس الأساسي ومعاه active عند تحقق الشرط.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 455:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 456:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 457–464

```jsx
                            </div>
                        </div>

                        <Link
                            to="/"
                            aria-label="What The Crust homepage"
                            onClick={closeMobileMenu}
                            className="wtc-logo-link d-flex align-items-center justify-content-center flex-shrink-0"
```

**السطر 457:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 458:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 460:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 461:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 462:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 463:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها.

**السطر 464:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

### السطور 465–472

```jsx
                            style={{
                                width: 'clamp(138px, 12vw, 178px)',
                                height: '62px',
                                background: 'transparent',
                                border: 0,
                                overflow: 'visible',
                            }}
                        >
```

**السطر 465:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 466:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 467:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 468:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 469:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 470:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 471:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 472:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 473–480

```jsx
                            <img
                                src="/images/logo.png"
                                alt="What The Crust"
                                className="wtc-logo-img"
                            />
                        </Link>

                        <div className="d-flex align-items-center justify-content-end flex-fill gap-3">
```

**السطر 473:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 474:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 475:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 476:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 477:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 478:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 480:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 481–488

```jsx
                            <div
                                className="wtc-order-toggle d-inline-flex align-items-center"
                                role="group"
                                aria-label="Order mode"
                                style={{
                                    padding: '0.28rem',
                                    borderRadius: '999px',
                                    border: '1px solid rgba(255,255,255,0.2)',
```

**السطر 481:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 482:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 483:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 484:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 485:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 486:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 487:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 488:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 489–496

```jsx
                                    background: 'rgba(0,0,0,0.22)',
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOrderMode('delivery');
                                        setDeliverySettingsOpen(true);
```

**السطر 489:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 490:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 491:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 492:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 493:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 494:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها.

**السطر 495:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setOrderMode(...)`: لو setOrderMode هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `'delivery'`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 496:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `setDeliverySettingsOpen(...)`: لو setDeliverySettingsOpen هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `true`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 497–504

```jsx
                                    }}
                                    aria-pressed={mode === 'delivery'}
                                    style={{
                                        border: 0,
                                        borderRadius: '999px',
                                        padding: '0.66rem 0.92rem',
                                        background: mode === 'delivery' ? '#e32424' : 'transparent',
                                        color: '#fff',
```

**السطر 497:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 498:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 499:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 500:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 501:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 502:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 503:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 504:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 505–512

```jsx
                                        fontSize: '0.75rem',
                                        fontWeight: 900,
                                    }}
                                >
                                    Delivery
                                </button>

                                <button
```

**السطر 505:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 506:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 507:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 508:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 509:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 510:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 512:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 513–520

```jsx
                                    type="button"
                                    onClick={() => setOrderMode('pickup')}
                                    aria-pressed={mode === 'pickup'}
                                    style={{
                                        border: 0,
                                        borderRadius: '999px',
                                        padding: '0.66rem 0.92rem',
                                        background: mode === 'pickup' ? '#e32424' : 'transparent',
```

**السطر 513:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 514:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `setOrderMode(...)`: لو setOrderMode هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `'pickup'`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 515:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 516:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 517:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 518:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 519:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 520:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 521–528

```jsx
                                        color: '#fff',
                                        fontSize: '0.75rem',
                                        fontWeight: 900,
                                    }}
                                >
                                    Pickup
                                </button>
                            </div>
```

**السطر 521:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 522:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 523:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 524:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 525:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 526:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 527:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 528:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 529–536

```jsx

                            <Link
                                to="/cart"
                                className="wtc-cart-link"
                                aria-label="View cart"
                                onClick={closeMobileMenu}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
```

**السطر 530:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 531:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 532:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 533:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 534:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها.

**السطر 535:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 536:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 537–544

```jsx
                                    <path
                                        d="M6.5 8.5H17.5L18.6 20H5.4L6.5 8.5Z"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M9 8.5V6.8C9 4.9 10.35 3.5 12 3.5C13.65 3.5 15 4.9 15 6.8V8.5"
```

**السطر 537:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 538:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 539:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 540:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 541:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 542:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 543:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 544:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

### السطور 545–552

```jsx
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>

                                {cartCount > 0 && (
                                    <span className="wtc-cart-badge">
```

**السطر 545:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 546:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 547:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 548:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 549:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 551:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 552:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 553–560

```jsx
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </Link>

                            <div className="wtc-auth-wrap">
                                {!isCheckingAuth && !authUser && (
                                    <Link
```

**السطر 553:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 554:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 555:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 556:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 558:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 559:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 560:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 561–568

```jsx
                                        to="/login"
                                        onClick={closeMobileMenu}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            minHeight: '42px',
                                            padding: '0.62rem 1rem',
```

**السطر 561:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 562:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها.

**السطر 563:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 564:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 565:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 566:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 567:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 568:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 569–576

```jsx
                                            borderRadius: '999px',
                                            border: '1px solid rgba(255,255,255,0.22)',
                                            background: 'rgba(0,0,0,0.24)',
                                            color: '#fff',
                                            textDecoration: 'none',
                                            fontWeight: 900,
                                        }}
                                    >
```

**السطر 569:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 570:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 571:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 572:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 573:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 574:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 575:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 576:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 577–584

```jsx
                                        Login
                                    </Link>
                                )}

                                {!isCheckingAuth && authUser && (
                                    <Dropdown align="end">
                                        <Dropdown.Toggle
                                            id="auth-user-dropdown"
```

**السطر 577:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 578:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 579:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 581:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 582:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 583:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 584:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

### السطور 585–592

```jsx
                                            className="wtc-auth-name"
                                            style={{
                                                border: '1px solid rgba(255,255,255,0.22)',
                                                borderRadius: '999px',
                                                background: 'rgba(0,0,0,0.24)',
                                                color: '#fff',
                                                padding: '0.66rem 0.95rem',
                                                fontWeight: 900,
```

**السطر 585:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 586:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 587:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 588:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 589:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 590:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 591:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

**السطر 592:** خاصية داخل object/وصف props/TypeScript حسب السياق. الاسم على الشمال يحدد الحقل، والقيمة/النوع على اليمين؛ راجع بداية المجموعة.

### السطور 593–600

```jsx
                                            }}
                                        >
                                            Hi, {authUser.name}
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="wtc-account-menu">
                                            {['staff', 'admin'].includes(authUser.role) && (
                                                <Dropdown.Item className="wtc-account-item" as={Link} to="/staff" onClick={closeMobileMenu}>
```

**السطر 593:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 594:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 595:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 596:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 598:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 599:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `['staff', 'admin'].includes(...)`: تختبر وجود قيمة في array أو نص داخل string. القيم المكتوبة هنا: `authUser.role`. العائد/الأثر: Boolean؛ مش العنصر ولا موقعه.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 600:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها.

### السطور 601–608

```jsx
                                                    Staff Dashboard
                                                </Dropdown.Item>
                                            )}
                                            {authUser.role === 'admin' && (
                                                <Dropdown.Item className="wtc-account-item" as={Link} to="/admin" onClick={closeMobileMenu}>
                                                    Admin Panel
                                                </Dropdown.Item>
                                            )}
```

**السطر 601:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 602:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 603:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 604:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 605:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها.

**السطر 606:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 607:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 608:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

### السطور 609–616

```jsx
                                            <Dropdown.Item
                                                className="wtc-account-item"
                                                as={Link}
                                                to="/orders"
                                                onClick={closeMobileMenu}
                                            >
                                                My orders
                                            </Dropdown.Item>
```

**السطر 609:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 610:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 611:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 612:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 613:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها.

**السطر 614:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 615:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 616:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 617–624

```jsx
                                            <Dropdown.Item
                                                className="wtc-account-item"
                                                as={Link}
                                                to="/menu"
                                                onClick={closeMobileMenu}
                                            >
                                                My Menu
                                            </Dropdown.Item>
```

**السطر 617:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 618:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 619:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 620:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 621:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها.

**السطر 622:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 623:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 624:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 625–632

```jsx

                                            <Dropdown.Item
                                                className="wtc-account-item is-logout"
                                                as="button"
                                                onClick={logout}
                                            >
                                                Logout
                                            </Dropdown.Item>
```

**السطر 626:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 627:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 628:** Assignment / إسناد أو تحديث قيمة: اقرأ الطرف اليمين أولًا ثم خزّن النتيجة في الهدف على الشمال. value وcurrent خصائص للحالة حسب Vue/React؛ مش methods.

**السطر 629:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها.

**السطر 630:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 631:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 632:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 633–640

```jsx
                                        </Dropdown.Menu>
                                    </Dropdown>
                                )}
                            </div>
                        </div>
                    </nav>

                    <Collapse in={isOpen}>
```

**السطر 633:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 634:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 635:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 636:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 637:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 638:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 640:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 641–648

```jsx
                        <div id="wtc-mobile-nav" className="wtc-mobile-nav-panel">
                            <div className="wtc-mobile-nav-inner">
                                <div className="wtc-mobile-nav-list" aria-label="Mobile navigation">
                                    <Link className={mobileNavClass(isHomeActive)} to="/" onClick={closeMobileMenu}>
                                        Home
                                    </Link>

                                    <Link className={mobileNavClass(isMenuActive)} to="/menu" onClick={closeMobileMenu}>
```

**السطر 641:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 642:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 643:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 644:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `mobileNavClass(...)`: نفس فكرة navClass لكن بأسماء كلاسات الموبايل. القيم المكتوبة هنا: `isHomeActive`. العائد/الأثر: string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 645:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 646:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 648:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `mobileNavClass(...)`: نفس فكرة navClass لكن بأسماء كلاسات الموبايل. القيم المكتوبة هنا: `isMenuActive`. العائد/الأثر: string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 649–656

```jsx
                                        Menu
                                    </Link>

                                    <Link className={mobileNavClass(isAboutActive)} to="/#about" onClick={closeMobileMenu}>
                                        About Us
                                    </Link>

                                    <Link className={mobileNavClass(isContactActive)} to="/#contact" onClick={closeMobileMenu}>
```

**السطر 649:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 650:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 652:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `mobileNavClass(...)`: نفس فكرة navClass لكن بأسماء كلاسات الموبايل. القيم المكتوبة هنا: `isAboutActive`. العائد/الأثر: string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 653:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 654:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 656:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `mobileNavClass(...)`: نفس فكرة navClass لكن بأسماء كلاسات الموبايل. القيم المكتوبة هنا: `isContactActive`. العائد/الأثر: string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

### السطور 657–664

```jsx
                                        Contact
                                    </Link>

                                    <div className="wtc-mobile-order-mode" role="group" aria-label="Order mode">
                                        <button type="button" className={mode === 'delivery' ? 'active' : ''} onClick={() => { setOrderMode('delivery'); setDeliverySettingsOpen(true); }}>Delivery</button>
                                        <button type="button" className={mode === 'pickup' ? 'active' : ''} onClick={() => setOrderMode('pickup')}>Pickup</button>
                                    </div>

```

**السطر 657:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 658:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 660:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 661:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `setOrderMode(...)`: لو setOrderMode هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `'delivery'`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.؛ `setDeliverySettingsOpen(...)`: لو setDeliverySettingsOpen هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `true`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 662:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `setOrderMode(...)`: لو setOrderMode هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `'pickup'`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 663:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 665–672

```jsx
                                    <Link className={mobileNavClass(false)} to="/cart" onClick={closeMobileMenu}>
                                        Cart ({cartCount})
                                    </Link>
                                    {authUser && <Link className={mobileNavClass(location.pathname.startsWith('/orders'))} to="/orders" onClick={closeMobileMenu}>My orders</Link>}

                                    {['staff', 'admin'].includes(authUser?.role) && (
                                        <Link className={mobileNavClass(location.pathname === '/staff')} to="/staff" onClick={closeMobileMenu}>
                                            Staff Dashboard
```

**السطر 665:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `mobileNavClass(...)`: نفس فكرة navClass لكن بأسماء كلاسات الموبايل. القيم المكتوبة هنا: `false`. العائد/الأثر: string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 666:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 667:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 668:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `mobileNavClass(...)`: نفس فكرة navClass لكن بأسماء كلاسات الموبايل. القيم المكتوبة هنا: `location.pathname.startsWith('/orders')`. العائد/الأثر: string.؛ `location.pathname.startsWith(...)`: تفحص بداية النص. القيم المكتوبة هنا: `'/orders'`. العائد/الأثر: Boolean؛ لا تتحقق من وجود ملف.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 670:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `['staff', 'admin'].includes(...)`: تختبر وجود قيمة في array أو نص داخل string. القيم المكتوبة هنا: `authUser?.role`. العائد/الأثر: Boolean؛ مش العنصر ولا موقعه.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 671:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `mobileNavClass(...)`: نفس فكرة navClass لكن بأسماء كلاسات الموبايل. القيم المكتوبة هنا: `location.pathname === '/staff'`. العائد/الأثر: string.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 672:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

### السطور 673–680

```jsx
                                        </Link>
                                    )}
                                    {authUser?.role === 'admin' && <Link className={mobileNavClass(location.pathname.startsWith('/admin'))} to="/admin" onClick={closeMobileMenu}>Admin Panel</Link>}
                                </div>
                            </div>
                        </div>
                    </Collapse>
                </Container>
```

**السطر 673:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 674:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 675:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `mobileNavClass(...)`: نفس فكرة navClass لكن بأسماء كلاسات الموبايل. القيم المكتوبة هنا: `location.pathname.startsWith('/admin')`. العائد/الأثر: string.؛ `location.pathname.startsWith(...)`: تفحص بداية النص. القيم المكتوبة هنا: `'/admin'`. العائد/الأثر: Boolean؛ لا تتحقق من وجود ملف.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 676:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 677:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 678:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 679:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 680:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 681–688

```jsx
            </motion.header>}
            </AnimatePresence>
            <Modal show={deliverySettingsOpen} onHide={() => setDeliverySettingsOpen(false)} centered contentClassName="wtc-delivery-modal">
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>Delivery details</Modal.Title>
                </Modal.Header>
                <form onSubmit={(event) => { event.preventDefault(); setDeliverySettingsOpen(false); }}>
                <Modal.Body className="wtc-delivery-fields">
```

**السطر 681:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 682:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 683:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `setDeliverySettingsOpen(...)`: لو setDeliverySettingsOpen هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `false`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 684:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 685:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 686:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 687:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `event.preventDefault(...)`: تمنع السلوك الافتراضي لحدث قابل للإلغاء. مدخلاتها: بدون مدخلات. العائد/الأثر: undefined؛ لا توقف propagation تلقائيًا.؛ `setDeliverySettingsOpen(...)`: لو setDeliverySettingsOpen هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `false`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 688:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 689–696

```jsx
                    <label className="form-label fw-bold" htmlFor="nav-delivery-branch">Delivering branch</label>
                    <select id="nav-delivery-branch" className="wtc-delivery-input" value={branchId || ''} disabled={!availableBranches.length} required onChange={(event) => setBranch(event.target.value)}>
                        {!availableBranches.length && <option value="">No delivery branches available</option>}
                        {availableBranches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name} · EGP {Number(branch.delivery_fee || 0).toFixed(2)}</option>)}
                    </select>
                    <label className="form-label fw-bold" htmlFor="nav-delivery-area">Area</label>
                    <input id="nav-delivery-area" className="wtc-delivery-input" maxLength={100} required value={deliveryArea} onChange={(event) => setDeliveryArea(event.target.value)} placeholder="e.g. New Cairo" />
                    <label className="form-label fw-bold" htmlFor="nav-delivery-address">Address</label>
```

**السطر 689:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 690:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `setBranch(...)`: لو setBranch هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `event.target.value`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 691:** تكملة التعبير أو بياناته داخل النطاق السابق. اقرأها مع بداية function/object/markup في نفس مجموعة السطور؛ السطر مش مثال مستقل للصق وحده.

**السطر 692:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `availableBranches.map(...)`: تحوّل كل عنصر إلى نتيجة callback. القيم المكتوبة هنا: `(branch) => <option key={branch.id} value={branch.id}>{branch.name} · EGP {Number(branch.delivery_fee || 0).to…`. العائد/الأثر: array جديدة من النتائج، بنفس عدد العناصر في القائمة الكثيفة هنا.؛ `Number(branch.delivery_fee || 0).toFixed(...)`: تنسّق عددًا بمواضع عشرية محددة. القيم المكتوبة هنا: `2`. العائد/الأثر: string، مش رقمًا صالحًا للحساب بدون تحويل.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `branch.delivery_fee || 0`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 693:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 694:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 695:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `setDeliveryArea(...)`: لو setDeliveryArea هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `event.target.value`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 696:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

### السطور 697–704

```jsx
                    <textarea id="nav-delivery-address" className="wtc-delivery-input" rows="3" maxLength={350} required value={deliveryAddress} onChange={(event) => setDeliveryAddress(event.target.value)} placeholder="Street, building and apartment" />
                    {selectedBranch && <div className="wtc-delivery-fee"><span>Delivery fee</span><strong>EGP {Number(selectedBranch.delivery_fee || 0).toFixed(2)}</strong></div>}
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" className="btn btn-outline-light" onClick={() => setDeliverySettingsOpen(false)}>Cancel</button>
                    <button type="submit" className="btn btn-red" disabled={!availableBranches.length || !branchId || !deliveryArea.trim() || !deliveryAddress.trim()}>Save delivery details</button>
                </Modal.Footer>
                </form>
```

**السطر 697:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `setDeliveryAddress(...)`: لو setDeliveryAddress هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `event.target.value`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 698:** Function / method call: نفّذ الاستدعاء المكتوب هنا. اسم الـobject قبل النقطة أو -> أو :: يحدد صاحب العملية؛ الأقواس فيها البيانات المبعوتة. الدوال الموجودة في السطر: `Number(selectedBranch.delivery_fee || 0).toFixed(...)`: تنسّق عددًا بمواضع عشرية محددة. القيم المكتوبة هنا: `2`. العائد/الأثر: string، مش رقمًا صالحًا للحساب بدون تحويل.؛ `Number(...)`: يحوّل القيمة إلى number للمقارنة والحساب؛ input غير صالح قد ينتج NaN، و'' ينتج0، لذلك التحويل مش validation وحده. القيم المكتوبة هنا: `selectedBranch.delivery_fee || 0`. العائد/الأثر: number أو NaN.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 699:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 700:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض.

**السطر 701:** Event binding / ربط حدث: الجزء المكتوب يحدد handler لما يحصل الحدث. Vue @click وReact onClick ليهم قواعد تعبير مختلفة؛ تتبّع اسم الدالة إلى تعريفها. الدوال الموجودة في السطر: `setDeliverySettingsOpen(...)`: لو setDeliverySettingsOpen هي setter الراجعة من useState، فهي تطلب تحديث الحالة والعرض؛ لو دالة مخصّصة فتعريفها هو الحكم. القيم المكتوبة هنا: `false`. العائد/الأثر: React setter ترجع undefined؛ لا ترجع بيانات API.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 702:** Markup / عنصر واجهة: اسم التاج يحدد العنصر أو المكوّن. attributes مدخلات/تنسيق/أحداث؛ النص والتعبيرات داخله هي المحتوى المعروض. الدوال الموجودة في السطر: `deliveryArea.trim(...)`: تشيل whitespace من أول وآخر النص فقط. مدخلاتها: بدون مدخلات. العائد/الأثر: نص جديد؛ لا تغيّر النص الأصلي.؛ `deliveryAddress.trim(...)`: تشيل whitespace من أول وآخر النص فقط. مدخلاتها: بدون مدخلات. العائد/الأثر: نص جديد؛ لا تغيّر النص الأصلي.. مدخلاتها وناتجها موضحان في بطاقات الدوال لهذا الملف.

**السطر 703:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 704:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

### السطور 705–709

```jsx
            </Modal>
        </>
    );
}

```

**السطر 705:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 706:** إغلاق عنصر واجهة مفتوح سابقًا. طابق الاسم لتعرف أين ينتهي نطاقه؛ المتغير المحلي في v-for لا يمتد خارج نطاقه.

**السطر 707:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

**السطر 708:** إغلاق نطاق/استدعاء/قائمة بدأ قبل السطر ده. طابق الأقواس مع بداية الجزء؛ الإغلاق وحده مش عملية جديدة.

## جرّب تفهمه بنفسك

اختار function واحدة: حدد مين يناديها، الـarguments، كل return، وأول عنصر واجهة يقرأ نتيجتها. لو فيه حفظ/دفع/حذف، جرّب فقط في مشروع تدريب وبيئة آمنة؛ مجرد قراءة المصدر لا تحتاج تشغيله.

**English words:** Source = المصدر، Function = دالة، Parameter = اسم مدخل في التعريف، Argument = قيمة مبعوتة، Return = ناتج راجع، State = حالة، Side effect = أثر جانبي، Caller = الكود اللي نادى الدالة.
