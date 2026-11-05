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
